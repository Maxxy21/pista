import { StructuredEvaluation } from '@/lib/types/evaluation'
import { logger } from '@/lib/logger'

interface ParsedAspectScore {
  score?: number;
  rationale?: string;
}

interface ParsedStrength {
  point?: string;
  impact?: string;
}

interface ParsedImprovement {
  area?: string;
  priority?: string;
  actionable?: string;
}

interface ParsedEvaluationResponse {
  score?: number;
  aspectScores?: ParsedAspectScore[];
  strengths?: Array<string | ParsedStrength>;
  improvements?: Array<string | ParsedImprovement>;
  summary?: string;
  analysis?: string;
  recommendations?: string[];
}

export function parseStructuredEvaluationResponse(
  response: string,
  criteriaName: string,
  aspects: string[]
): StructuredEvaluation {
  try {
    const parsed: ParsedEvaluationResponse = JSON.parse(response)
    const numericAspectScores = Array.isArray(parsed.aspectScores)
      ? parsed.aspectScores
          .map((s) => Number(s?.score))
          .filter((n) => Number.isFinite(n))
      : []
    const baseScore = Number(parsed.score)
    const clamped = (n: number) => Math.min(Math.max(n, 1), 10)
    const aspectAvg = numericAspectScores.length
      ? numericAspectScores.reduce((a, b) => a + b, 0) / numericAspectScores.length
      : NaN
    const criterionScore = Number.isFinite(aspectAvg)
      ? clamped(aspectAvg)
      : clamped(Number.isFinite(baseScore) ? baseScore : 5)

    return {
      criteria: criteriaName,
      score: criterionScore,
      breakdown: {
        strengths: (parsed.strengths || []).map((s) => ({
          point: typeof s === 'string' ? s : s.point || '',
          impact: (typeof s === 'string' ? 'Medium' : s.impact || 'Medium') as 'High' | 'Medium' | 'Low'
        })),
        improvements: (parsed.improvements || []).map((i) => ({
          area: typeof i === 'string' ? i : i.area || '',
          priority: (typeof i === 'string' ? 'Important' : i.priority || 'Important') as 'Critical' | 'Important' | 'Nice to Have',
          actionable: typeof i === 'string' ? i : i.actionable || i.area || ''
        })),
        aspectScores: aspects.map((aspect, index) => ({
          aspect,
          score: parsed.aspectScores?.[index]?.score || parsed.score || 5,
          rationale: parsed.aspectScores?.[index]?.rationale || 'No specific rationale provided'
        }))
      },
      summary: parsed.summary || parsed.analysis || '',
      recommendations: parsed.recommendations || []
    }
  } catch (error) {
    logger.error("parse", `JSON evaluation parse failed for "${criteriaName}", falling back to text parsing:`, error);
    return parseTextEvaluationResponse(response, criteriaName, aspects)
  }
}

export function parseTextEvaluationResponse(
  response: string,
  criteriaName: string,
  aspects: string[]
): StructuredEvaluation {
  const scoreMatch = response.match(/SCORE:\s*(\d+(\.\d+)?)/i)
  const strengthsMatch = response.match(/STRENGTHS:([\s\S]*?)(?=IMPROVEMENTS:|$)/i)
  const improvementsMatch = response.match(/IMPROVEMENTS:([\s\S]*?)(?=ANALYSIS:|$)/i)
  const analysisMatch = response.match(/ANALYSIS:([\s\S]*?)$/i)

  const strengths = strengthsMatch
    ? strengthsMatch[1]
        .split('\n')
        .filter((s) => s.trim().startsWith('-'))
        .map((s) => s.replace('-', '').trim())
    : []

  const improvements = improvementsMatch
    ? improvementsMatch[1]
        .split('\n')
        .filter((s) => s.trim().startsWith('-'))
        .map((s) => s.replace('-', '').trim())
    : []

  const score = scoreMatch ? Math.min(Math.max(parseFloat(scoreMatch[1]), 1), 10) : 5

  return {
    criteria: criteriaName,
    score,
    breakdown: {
      strengths: strengths.map((point) => ({ point, impact: 'Medium' as const })),
      improvements: improvements.map((area) => ({
        area,
        priority: 'Important' as const,
        actionable: area
      })),
      aspectScores: aspects.map((aspect) => ({
        aspect,
        score,
        rationale: 'Based on overall evaluation'
      }))
    },
    summary: analysisMatch ? analysisMatch[1].trim() : '',
    recommendations: []
  }
}
