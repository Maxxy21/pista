// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


const questionAnswer = v.object({
    text: v.string(),
    answer: v.string(),
});

// Legacy evaluation structure for backward compatibility
const legacyEvaluation = v.object({
    criteria: v.string(),
    comment: v.string(),
    score: v.number(),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    aspects: v.array(v.string()),
});

// New structured evaluation
const structuredBreakdown = v.object({
    strengths: v.array(v.object({
        point: v.string(),
        impact: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    })),
    improvements: v.array(v.object({
        area: v.string(),
        priority: v.union(v.literal("Critical"), v.literal("Important"), v.literal("Nice to Have")),
        actionable: v.string()
    })),
    aspectScores: v.array(v.object({
        aspect: v.string(),
        score: v.number(),
        rationale: v.string()
    }))
});

const structuredEvaluation = v.object({
    criteria: v.string(),
    score: v.number(),
    breakdown: structuredBreakdown,
    summary: v.string(),
    recommendations: v.array(v.string())
});

const structuredFeedback = v.object({
    overallAssessment: v.object({
        summary: v.string(),
        keyHighlights: v.array(v.string()),
        primaryConcerns: v.array(v.string())
    }),
    investmentThesis: v.object({
        viability: v.union(v.literal("Strong"), v.literal("Moderate"), v.literal("Weak"), v.literal("Not Applicable")),
        reasoning: v.string(),
        potentialReturns: v.string()
    }),
    riskAssessment: v.object({
        majorRisks: v.array(v.object({
            risk: v.string(),
            severity: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low")),
            mitigation: v.string()
        })),
        riskScore: v.number()
    }),
    nextSteps: v.object({
        immediateActions: v.array(v.string()),
        longTermRecommendations: v.array(v.string()),
        followUpQuestions: v.array(v.string())
    }),
    competitivePosition: v.object({
        strengths: v.array(v.string()),
        weaknesses: v.array(v.string()),
        marketOpportunity: v.string()
    }),
    foundersAssessment: v.object({
        teamStrengths: v.array(v.string()),
        experienceGaps: v.array(v.string()),
        executionCapability: v.union(v.literal("Excellent"), v.literal("Good"), v.literal("Fair"), v.literal("Poor"))
    })
});

const evaluationMetadata = v.object({
    evaluatedAt: v.string(),
    modelVersion: v.string(),
    processingTime: v.optional(v.number()),
    promptVersion: v.optional(v.string()),
    policyVersion: v.optional(v.string())
});

// Union type to support both legacy and new structured evaluations
const evaluationData = v.union(
    // Legacy format
    v.object({
        evaluations: v.array(legacyEvaluation),
        overallScore: v.number(),
        overallFeedback: v.string(),
    }),
    // New structured format
    v.object({
        evaluations: v.array(structuredEvaluation),
        overallScore: v.number(),
        overallFeedback: structuredFeedback,
        metadata: evaluationMetadata
    })
);

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
    .index("by_user", ["userId"]) 
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
    legacyEvaluation,
    structuredEvaluation,
    evaluationData,
};
