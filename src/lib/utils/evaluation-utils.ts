import {
  StructuredEvaluationData,
  StructuredEvaluation,
  StructuredFeedback,
  LegacyEvaluationData,
  isStructuredEvaluationData,
  isLegacyEvaluationData,
} from '@/lib/types/evaluation'

export type UniversalEvaluationData = StructuredEvaluationData | LegacyEvaluationData

export function hasMetadata(evaluation: UniversalEvaluationData): evaluation is StructuredEvaluationData {
  return isStructuredEvaluationData(evaluation) && !!evaluation.metadata
}


export function getOverallFeedback(evaluation: UniversalEvaluationData): StructuredFeedback | string {
  if (isStructuredEvaluationData(evaluation)) {
    return evaluation.overallFeedback
  }
  // legacy returns plain string summary
  return (evaluation as LegacyEvaluationData).overallFeedback
}

export function getEvaluations(evaluation: UniversalEvaluationData): StructuredEvaluation[] {
  if (isStructuredEvaluationData(evaluation)) {
    return evaluation.evaluations
  }
  if (isLegacyEvaluationData(evaluation)) {
    const legacy = evaluation as LegacyEvaluationData
    return legacy.evaluations.map((e) => ({
      criteria: e.criteria,
      score: e.score,
      breakdown: {
        strengths: (e.strengths || []).map((s) => ({ point: s, impact: 'Medium' as const })),
        improvements: (e.improvements || []).map((i) => ({
          area: i,
          priority: 'Important' as const,
          actionable: i,
        })),
        aspectScores: (e.aspects || []).map((a) => ({
          aspect: a,
          score: e.score,
          rationale: 'Based on overall evaluation',
        })),
      },
      summary: e.comment || '',
      recommendations: [],
    }))
  }
  return []
}

