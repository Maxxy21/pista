// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const questionAnswer = v.object({
    text: v.string(),
    answer: v.string()
});

export const evaluation = v.object({
    criteria: v.string(),
    comment: v.string(),
    score: v.number(),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    aspects: v.array(v.string()),
});

export const evaluationData = v.object({
    evaluations: v.array(evaluation),
    overallScore: v.number(),
    overallFeedback: v.string(),
});

export const questionAnswerArray = v.array(questionAnswer);
export const evaluationArray = v.array(evaluation);

export default defineSchema({
    pitches: defineTable({
        title: v.string(),
        text: v.string(),
        type: v.string(),
        status: v.string(),
        evaluation: evaluationData,
        questions: v.array(questionAnswer),
        orgId: v.string(),
        userId: v.string(),
        authorName: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["orgId"])
        .index("by_user_org", ["userId", "orgId"])
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["orgId"]
        }),

    userFavorites: defineTable({
        userId: v.string(),
        orgId: v.string(),
        pitchId: v.id("pitches"),
    })
        .index("by_user", ["userId"])
        .index("by_org", ["orgId"])
        .index("by_user_pitch", ["userId", "pitchId"])
        .index("by_user_org_pitch", ["userId", "orgId", "pitchId"])
});