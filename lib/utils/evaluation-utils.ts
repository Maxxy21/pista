// lib/utils/evaluation-utils.ts

import { 
  StructuredEvaluationData, 
  LegacyEvaluationData, 
  isStructuredEvaluationData 
} from "@/lib/types/evaluation";

export type UniversalEvaluationData = StructuredEvaluationData | LegacyEvaluationData;

// Helper to get overall feedback safely
export function getOverallFeedback(evaluation: UniversalEvaluationData) {
  if (isStructuredEvaluationData(evaluation)) {
    return evaluation.overallFeedback;
  }
  return {
    overallAssessment: {
      summary: evaluation.overallFeedback,
      keyHighlights: [],
      primaryConcerns: []
    },
    investmentThesis: {
      viability: "Not Applicable" as const,
      reasoning: "Legacy evaluation format",
      potentialReturns: "Not specified"
    },
    riskAssessment: {
      majorRisks: [],
      riskScore: 5
    },
    nextSteps: {
      immediateActions: [],
      longTermRecommendations: [],
      followUpQuestions: []
    },
    competitivePosition: {
      strengths: [],
      weaknesses: [],
      marketOpportunity: "Not specified"
    },
    foundersAssessment: {
      teamStrengths: [],
      experienceGaps: [],
      executionCapability: "Good" as const
    }
  };
}

// Helper to get evaluations in a consistent format
export function getEvaluations(evaluation: UniversalEvaluationData) {
  if (isStructuredEvaluationData(evaluation)) {
    return evaluation.evaluations;
  }
  
  // Convert legacy evaluations to structured format for display
  return evaluation.evaluations.map(legacyEval => ({
    criteria: legacyEval.criteria,
    score: legacyEval.score,
    breakdown: {
      strengths: legacyEval.strengths.map(point => ({ point, impact: "Medium" as const })),
      improvements: legacyEval.improvements.map(area => ({
        area,
        priority: "Important" as const,
        actionable: area
      })),
      aspectScores: legacyEval.aspects.map(aspect => ({
        aspect,
        score: legacyEval.score,
        rationale: 'Based on overall evaluation'
      }))
    },
    summary: legacyEval.comment,
    recommendations: []
  }));
}

// Helper to check if evaluation has metadata
export function hasMetadata(evaluation: UniversalEvaluationData): evaluation is StructuredEvaluationData {
  return isStructuredEvaluationData(evaluation);
}

// Helper to get evaluation metadata
export function getEvaluationMetadata(evaluation: UniversalEvaluationData) {
  if (hasMetadata(evaluation)) {
    return evaluation.metadata;
  }
  return {
    evaluatedAt: "Unknown",
    modelVersion: "legacy",
    processingTime: undefined
  };
}