// lib/types/evaluation.ts

export interface StructuredFeedback {
  overallAssessment: {
    summary: string;
    keyHighlights: string[];
    primaryConcerns: string[];
  };
  investmentThesis: {
    viability: "Strong" | "Moderate" | "Weak" | "Not Applicable";
    reasoning: string;
    potentialReturns: string;
  };
  riskAssessment: {
    majorRisks: Array<{
      risk: string;
      severity: "High" | "Medium" | "Low";
      mitigation: string;
    }>;
    riskScore: number; // 1-10, lower is better
  };
  nextSteps: {
    immediateActions: string[];
    longTermRecommendations: string[];
    followUpQuestions: string[];
  };
  competitivePosition: {
    strengths: string[];
    weaknesses: string[];
    marketOpportunity: string;
  };
  foundersAssessment: {
    teamStrengths: string[];
    experienceGaps: string[];
    executionCapability: "Excellent" | "Good" | "Fair" | "Poor";
  };
}

export interface StructuredEvaluation {
  criteria: string;
  score: number;
  breakdown: {
    strengths: Array<{
      point: string;
      impact: "High" | "Medium" | "Low";
    }>;
    improvements: Array<{
      area: string;
      priority: "Critical" | "Important" | "Nice to Have";
      actionable: string;
    }>;
    aspectScores: Array<{
      aspect: string;
      score: number;
      rationale: string;
    }>;
  };
  summary: string;
  recommendations: string[];
}

export interface StructuredEvaluationData {
  evaluations: StructuredEvaluation[];
  overallScore: number;
  overallFeedback: StructuredFeedback;
  metadata: {
    evaluatedAt: string;
    modelVersion: string;
    processingTime?: number;
    promptVersion?: string;
    policyVersion?: string;
  };
}

// Legacy types for backward compatibility
export interface LegacyEvaluation {
  criteria: string;
  comment: string;
  score: number;
  strengths: string[];
  improvements: string[];
  aspects: string[];
}

export interface LegacyEvaluationData {
  evaluations: LegacyEvaluation[];
  overallScore: number;
  overallFeedback: string;
}

// Type guards
export function isStructuredEvaluationData(data: any): data is StructuredEvaluationData {
  return data && 
         typeof data === 'object' && 
         'metadata' in data && 
         'overallFeedback' in data &&
         typeof data.overallFeedback === 'object' &&
         'overallAssessment' in data.overallFeedback;
}

export function isLegacyEvaluationData(data: any): data is LegacyEvaluationData {
  return data && 
         typeof data === 'object' && 
         'overallFeedback' in data &&
         typeof data.overallFeedback === 'string';
}
