// lib/evaluation-schema.ts

export interface EvaluationAspect {
  name: string;
  score: number; // 1-10
  analysis: string;
  recommendations: string[];
}

export interface CategoryEvaluation {
  criteria: string;
  score: number; // 1-10
  comment: string;
  strengths: string[];
  improvements: string[];
  aspects: EvaluationAspect[];
  keyInsights: string[];
  actionableRecommendations: string[];
}

export interface OverallAssessment {
  summary: string;
  investmentThesis: string;
  majorRisks: string[];
  mitigationStrategies: string[];
  nextSteps: string[];
  competitivePosition: string;
  fundingReadiness: number; // 1-10
}

export interface StructuredEvaluation {
  overallScore: number; // 1-10
  confidence: number; // 1-10, how confident the AI is in its evaluation
  categories: CategoryEvaluation[];
  overallAssessment: OverallAssessment;
  metadata: {
    evaluationDate: string;
    modelUsed: string;
    processingTime: number;
    wordCount: number;
    hasQnA: boolean;
  };
}

// JSON Schema for validation
export const evaluationJsonSchema = {
  type: "object",
  required: ["overallScore", "confidence", "categories", "overallAssessment", "metadata"],
  properties: {
    overallScore: {
      type: "number",
      minimum: 1,
      maximum: 10
    },
    confidence: {
      type: "number", 
      minimum: 1,
      maximum: 10
    },
    categories: {
      type: "array",
      items: {
        type: "object",
        required: ["criteria", "score", "comment", "strengths", "improvements", "aspects"],
        properties: {
          criteria: { type: "string" },
          score: { type: "number", minimum: 1, maximum: 10 },
          comment: { type: "string" },
          strengths: { type: "array", items: { type: "string" } },
          improvements: { type: "array", items: { type: "string" } },
          aspects: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "score", "analysis"],
              properties: {
                name: { type: "string" },
                score: { type: "number", minimum: 1, maximum: 10 },
                analysis: { type: "string" },
                recommendations: { type: "array", items: { type: "string" } }
              }
            }
          },
          keyInsights: { type: "array", items: { type: "string" } },
          actionableRecommendations: { type: "array", items: { type: "string" } }
        }
      }
    },
    overallAssessment: {
      type: "object",
      required: ["summary", "investmentThesis", "majorRisks", "nextSteps"],
      properties: {
        summary: { type: "string" },
        investmentThesis: { type: "string" },
        majorRisks: { type: "array", items: { type: "string" } },
        mitigationStrategies: { type: "array", items: { type: "string" } },
        nextSteps: { type: "array", items: { type: "string" } },
        competitivePosition: { type: "string" },
        fundingReadiness: { type: "number", minimum: 1, maximum: 10 }
      }
    },
    metadata: {
      type: "object",
      required: ["evaluationDate", "modelUsed", "processingTime", "wordCount", "hasQnA"],
      properties: {
        evaluationDate: { type: "string" },
        modelUsed: { type: "string" },
        processingTime: { type: "number" },
        wordCount: { type: "number" },
        hasQnA: { type: "boolean" }
      }
    }
  }
} as const;