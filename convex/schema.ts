// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


const questionAnswer = v.object({
    text: v.string(),
    answer: v.string(),
});

const evaluation = v.object({
    criteria: v.string(),
    comment: v.string(),
    score: v.number(),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    aspects: v.array(v.string()),
});

const evaluationData = v.object({
    evaluations: v.array(evaluation),
    overallScore: v.number(),
    overallFeedback: v.string(),
});

// Table definitions
const pitches = defineTable({
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
        filterFields: ["orgId"],
    });

const userFavorites = defineTable({
    userId: v.string(),
    orgId: v.string(),
    pitchId: v.id("pitches"),
})
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_pitch", ["userId", "pitchId"])
    .index("by_user_org_pitch", ["userId", "orgId", "pitchId"]);


export default defineSchema({
    pitches,
    userFavorites,
});


export {
    questionAnswer,
    evaluation,
    evaluationData,
};