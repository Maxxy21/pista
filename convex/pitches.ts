import {mutation, query, QueryCtx} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {Doc} from "@/convex/_generated/dataModel";
import {getAllOrThrow} from "convex-helpers/server/relationships";
import { OpenAI } from "openai";

// Types
export const evaluationObject = v.object({
    criteria: v.string(),
    comment: v.string(),
    score: v.number(),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    aspects: v.array(v.string()),
});

export const evaluationArgs = v.object({
    evaluations: v.array(evaluationObject),
    overallScore: v.number(),
    overallFeedback: v.string(),
});

type Pitch = Doc<"pitches">;

interface PitchStats {
    totalPitches: number;
    averageScore: number;
    bestPitch: Doc<"pitches"> | undefined;
    recentPitches: Doc<"pitches">[];
    scoreDistribution: Record<number, number>;
}


const validateUser = async (ctx: { auth: any }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError("Unauthorized");
    }
    return identity;
};

// Get all pitches for an organization
export const get = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favorites: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        // Handle favorites
        if (args.favorites) {
            const favoritedPitches = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_org_pitch", (q) =>
                    q
                        .eq("userId", identity.subject)
                        .eq("orgId", args.orgId)
                )
                .order("desc")
                .collect();

            const ids = favoritedPitches.map((f) => f.pitchId);
            const pitches = await getAllOrThrow(ctx.db, ids);

            return pitches.map((pitch) => ({
                ...pitch,
                isFavorite: true,
            }));
        }

        // Handle search
        const title = args.search as string;
        let pitches = [];

        if (title) {
            pitches = await ctx.db
                .query("pitches")
                .withSearchIndex("search_title", (q) =>
                    q
                        .search("title", title)
                        .eq("orgId", args.orgId)
                )
                .collect();
        } else {
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
                .order("desc")
                .collect();
        }

        // Add favorite status to each pitch
        const pitchesWithFavoriteRelation = pitches.map((pitch) => {
            return ctx.db
                .query("userFavorites")
                .withIndex("by_user_org_pitch", (q) =>
                    q
                        .eq("userId", identity.subject)
                        .eq("orgId", args.orgId)
                        .eq("pitchId", pitch._id)
                )
                .unique()
                .then((favorite) => {
                    return {
                        ...pitch,
                        isFavorite: !!favorite,
                    };
                });
        });

        return Promise.all(pitchesWithFavoriteRelation);
    },
});

// Create a new pitch
export const create = mutation({
    args: {
        orgId: v.string(),
        title: v.string(),
        text: v.string(),
        type: v.string(),
        status: v.string(),
        evaluation: evaluationArgs,
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        // Create the pitch with all required fields
        return await ctx.db.insert("pitches", {
            title: args.title,
            text: args.text,
            type: args.type,
            status: args.status,
            evaluation: args.evaluation,
            orgId: args.orgId,
            userId: identity.subject,
            authorName: identity.name!,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Update existing pitch
export const update = mutation({
    args: {
        id: v.id("pitches"),
        orgId: v.string(),
        title: v.optional(v.string()),
        text: v.optional(v.string()),
        status: v.optional(v.string()),
        evaluation: v.optional(evaluationArgs),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        if (pitch.orgId !== args.orgId) {
            throw new Error("Unauthorized");
        }

        const updates = {
            ...(args.title && { title: args.title }),
            ...(args.text && { text: args.text }),
            ...(args.status && { status: args.status }),
            ...(args.evaluation && { evaluation: args.evaluation }),
            updatedAt: Date.now(),
        };

        return await ctx.db.patch(args.id, updates);
    },
});


export const remove = mutation({
    args: { id: v.id("pitches") },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const userId = identity.subject;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_pitch", (q) =>
                q
                    .eq("userId", userId)
                    .eq("pitchId", args.id)
            )
            .unique();

        if (existingFavorite) {
            await ctx.db.delete(existingFavorite._id);
        }

        await ctx.db.delete(args.id);
    },
});
// Favorite/unfavorite functions
export const favorite = mutation({
    args: {
        id: v.id("pitches"),
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q
                    .eq("userId", identity.subject)
                    .eq("orgId", args.orgId)
                    .eq("pitchId", pitch._id)
            )
            .unique();

        if (existingFavorite) {
            throw new Error("Pitch already favorited");
        }

        await ctx.db.insert("userFavorites", {
            userId: identity.subject,
            pitchId: pitch._id,
            orgId: args.orgId,
        });

        return pitch;
    },
});

export const unfavorite = mutation({
    args: {
        id: v.id("pitches"),
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q
                    .eq("userId", identity.subject)
                    .eq("orgId", args.orgId)
                    .eq("pitchId", pitch._id)
            )
            .unique();

        if (!existingFavorite) {
            throw new Error("Favorited pitch not found");
        }

        await ctx.db.delete(existingFavorite._id);

        return pitch;
    },
});

export const getPitch = query({
    args: {
        id: v.id("pitches"),
    },
    handler: async (ctx: QueryCtx, {id}) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(id);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized: You don't have access to this pitch");
        }

        return pitch;
    },
});

export const getPitchStats = query({
    args: {},
    handler: async (ctx: QueryCtx): Promise<PitchStats> => {
        const identity = await validateUser(ctx);

        const pitches = await ctx.db
            .query("pitches")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .collect();

        // Handle empty pitches case
        if (pitches.length === 0) {
            return {
                totalPitches: 0,
                averageScore: 0,
                bestPitch: undefined,
                recentPitches: [],
                scoreDistribution: {},
            };
        }
        // Calculate stats for non-empty pitches
        const totalScores = pitches.reduce((acc, pitch) => acc + pitch.evaluation.overallScore, 0);

        const bestPitch = pitches.reduce((best, current) => {
            if (!best) return current;
            return current.evaluation.overallScore > best.evaluation.overallScore ? current : best;
        }, pitches[0]);

        return {
            totalPitches: pitches.length,
            averageScore: totalScores / pitches.length,
            bestPitch,
            recentPitches: pitches.slice(-5),
            scoreDistribution: pitches.reduce((acc, pitch) => {
                const score = Math.floor(pitch.evaluation.overallScore);
                acc[score] = (acc[score] || 0) + 1;
                return acc;
            }, {} as Record<number, number>),
        };
    },
});


// Add categories/tags to pitches
export const updatePitchCategories = mutation({
    args: {
        id: v.id("pitches"),
        categories: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.patch(args.id, {
            categories: args.categories,
            updatedAt: Date.now(),
        });
    },
});

// Add ability to favorite/bookmark pitches
export const togglePitchFavorite = mutation({
    args: {
        pitchId: v.id("pitches"),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);
        const userId = identity.subject;

        const pitch = await ctx.db.get(args.pitchId);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.orgId !== args.orgId) {
            throw new Error("Unauthorized");
        }

        // Check if already favorited
        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q.eq("userId", userId)
                    .eq("orgId", args.orgId)
                    .eq("pitchId", args.pitchId)
            )
            .unique();

        if (existingFavorite) {
            await ctx.db.delete(existingFavorite._id);
        } else {
            await ctx.db.insert("userFavorites", {
                userId,
                orgId: args.orgId,
                pitchId: args.pitchId,
            });
        }

        return await ctx.db.get(args.pitchId);
    },
});

// Add comments/notes to pitches
export const addPitchNote = mutation({
    args: {
        pitchId: v.id("pitches"),
        note: v.string(),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.pitchId);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.orgId !== args.orgId) {
            throw new Error("Unauthorized");
        }

        const notes = pitch.notes || [];
        notes.push({
            content: args.note,
            authorId: identity.subject,
            authorName: identity.name!,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return await ctx.db.patch(args.pitchId, {
            notes,
            updatedAt: Date.now(),
        });
    },
});
// Get pitch history/versions
export const getPitchHistory = query({
    args: {
        pitchId: v.id("pitches"),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.pitchId);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        // Assuming you store versions in the pitch document
        return pitch.versions || [];
    },
});

// Compare two pitches
export const comparePitches = query({
    args: {
        pitchId1: v.id("pitches"),
        pitchId2: v.id("pitches"),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch1 = await ctx.db.get(args.pitchId1);
        const pitch2 = await ctx.db.get(args.pitchId2);

        if (!pitch1 || !pitch2) throw new Error("Pitch not found");
        if (pitch1.userId !== identity.subject || pitch2.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        return {
            pitch1,
            pitch2,
            comparison: {
                scoreDifference: pitch2.evaluation.overallScore - pitch1.evaluation.overallScore,
                improvements: pitch2.evaluation.evaluations.map((eval2, index) => ({
                    criteria: eval2.criteria,
                    scoreDifference: eval2.score - pitch1.evaluation.evaluations[index].score,
                })),
            },
        };
    },
});





// Types
export const categoryObject = v.object({
    id: v.string(),
    name: v.string(),
    color: v.optional(v.string())
});

// Get pitches with filters
export const getFilteredPitches = query({
    args: {
        orgId: v.string(), // Add orgId to args
        search: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        categories: v.optional(v.array(v.string())),
        sortBy: v.optional(v.union(v.literal("date"), v.literal("score"))),
        dateRange: v.optional(v.object({
            start: v.number(),
            end: v.number()
        })),
        scoreRange: v.optional(v.object({
            min: v.number(),
            max: v.number()
        }))
    },
    handler: async (ctx: QueryCtx, args) => {
        const identity = await validateUser(ctx);
        const userId = identity.subject;

        if (!args.orgId) {
            throw new Error("Organization ID is required");
        }

        // Get user's favorited pitches for this org
        const userFavorites = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q.eq("userId", userId)
                    .eq("orgId", args.orgId)
            )
            .collect();

        const favoritedPitchIds = new Set(userFavorites.map(f => f.pitchId));

        // Base query using correct index
        let queryBuilder = ctx.db
            .query("pitches")
            .withIndex("by_user_org", (q) =>
                q.eq("userId", userId)
                    .eq("orgId", args.orgId)
            );

        // Apply filters
        let pitches = await queryBuilder.collect();

        // Filter by search term
        if (args.search) {
            const searchTerm = args.search.toLowerCase();
            pitches = pitches.filter(pitch =>
                pitch.title.toLowerCase().includes(searchTerm) ||
                pitch.text.toLowerCase().includes(searchTerm) ||
                pitch.evaluation.overallFeedback.toLowerCase().includes(searchTerm) ||
                pitch.categories?.some(category => category.toLowerCase().includes(searchTerm))
            );
        }

        // Filter by favorites
        if (args.favorites) {
            pitches = pitches.filter(pitch => favoritedPitchIds.has(pitch._id));
        }

        // Filter by categories
        if (args.categories?.length) {
            pitches = pitches.filter(pitch =>
                pitch.categories?.some(category => args.categories!.includes(category))
            );
        }

        // Filter by date range
        if (args.dateRange) {
            pitches = pitches.filter(pitch =>
                pitch._creationTime >= args.dateRange!.start &&
                pitch._creationTime <= args.dateRange!.end
            );
        }

        // Filter by score range
        if (args.scoreRange) {
            pitches = pitches.filter(pitch =>
                pitch.evaluation.overallScore >= args.scoreRange!.min &&
                pitch.evaluation.overallScore <= args.scoreRange!.max
            );
        }

        // Apply sorting
        if (args.sortBy) {
            switch (args.sortBy) {
                case "date":
                    pitches.sort((a, b) => b._creationTime - a._creationTime);
                    break;
                case "score":
                    pitches.sort((a, b) => b.evaluation.overallScore - a.evaluation.overallScore);
                    break;
            }
        }

        // Add favorite status to results
        return pitches.map(pitch => ({
            ...pitch,
            isFavorite: favoritedPitchIds.has(pitch._id)
        }));
    }
});

// Get available categories
// export const getCategories = query({
//     handler: async (ctx) => {
//         const identity = await validateUser(ctx);
//
//         return await ctx.db
//             .query("categories")
//             .filter(q => q.eq(q.field("userId"), identity.subject))
//             .collect();
//     }
// });
//
// // Add new category
// export const addCategory = mutation({
//     args: {
//         name: v.string(),
//         color: v.optional(v.string())
//     },
//     handler: async (ctx, args) => {
//         const identity = await validateUser(ctx);
//
//         // Check if category already exists
//         const existing = await ctx.db
//             .query("categories")
//             .filter(q =>
//                 q.and(
//                     q.eq(q.field("userId"), identity.subject),
//                     q.eq(q.field("name"), args.name)
//                 )
//             )
//             .unique();
//
//         if (existing) {
//             throw new Error("Category already exists");
//         }
//
//         return await ctx.db.insert("categories", {
//             userId: identity.subject,
//             name: args.name,
//             color: args.color,
//             createdAt: Date.now()
//         });
//     }
// });
//
// // Update pitch categories
// export const updateCategories = mutation({
//     args: {
//         pitchId: v.id("pitches"),
//         categories: v.array(v.string())
//     },
//     handler: async (ctx, args) => {
//         const identity = await validateUser(ctx);
//
//         const pitch = await ctx.db.get(args.pitchId);
//         if (!pitch || pitch.userId !== identity.subject) {
//             throw new Error("Unauthorized or pitch not found");
//         }
//
//         // Validate categories exist
//         const existingCategories = await ctx.db
//             .query("categories")
//             .filter(q => q.eq(q.field("userId"), identity.subject))
//             .collect();
//
//         const validCategories = args.categories.filter(cat =>
//             existingCategories.some(existingCat => existingCat.name === cat)
//         );
//
//         return await ctx.db.patch(args.pitchId, {
//             categories: validCategories,
//             updatedAt: Date.now()
//         });
//     }
// });
//
// // Delete category
// export const deleteCategory = mutation({
//     args: {
//         id: v.id("categories")
//     },
//     handler: async (ctx, args) => {
//         const identity = await validateUser(ctx);
//
//         const category = await ctx.db.get(args.id);
//         if (!category || category.userId !== identity.subject) {
//             throw new Error("Unauthorized or category not found");
//         }
//
//         // Remove category from all pitches
//         const pitches = await ctx.db
//             .query("pitches")
//             .filter(q => q.eq(q.field("userId"), identity.subject))
//             .collect();
//
//         for (const pitch of pitches) {
//             if (pitch.categories?.includes(category.name)) {
//                 await ctx.db.patch(pitch._id, {
//                     categories: pitch.categories.filter(cat => cat !== category.name),
//                     updatedAt: Date.now()
//                 });
//             }
//         }
//
//         await ctx.db.delete(args.id);
//     }
// });
