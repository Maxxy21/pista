import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { evaluationArgs } from "./pitches";

export default defineSchema({
    pitches: defineTable({
        title: v.string(),
        text: v.string(),
        type: v.string(),
        status: v.string(),
        evaluation: evaluationArgs,
        orgId: v.string(),
        userId: v.string(),
        authorName: v.string(),
        categories: v.optional(v.array(v.string())),
        notes: v.optional(v.array(v.object({
            content: v.string(),
            authorId: v.string(),
            authorName: v.string(),
            createdAt: v.number(),
            updatedAt: v.number(),
        }))),
        versions: v.optional(v.array(v.object({
            text: v.string(),
            evaluation: evaluationArgs,
            authorId: v.string(),
            authorName: v.string(),
            createdAt: v.number(),
        }))),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["orgId"])
        .index("by_user_org", ["userId", "orgId"])
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["orgId"]
        })
        .index("by_status", ["status"])
        .index("by_categories", ["categories"]),

    categories: defineTable({
        orgId: v.string(),
        name: v.string(),
        color: v.optional(v.string()),
        createdAt: v.number(),
        createdBy: v.string(),
    })
        .index("by_org", ["orgId"])
        .index("by_org_name", ["orgId", "name"]),

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