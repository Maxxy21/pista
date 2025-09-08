import { StructuredEvaluation } from '@/lib/types/evaluation'

export function parseStructuredEvaluationResponse(
  response: string,
  criteriaName: string,
  aspects: string[]
): StructuredEvaluation {
  try {
    const parsed = JSON.parse(response)
    const numericAspectScores = Array.isArray(parsed.aspectScores)
      ? parsed.aspectScores
          .map((s: any) => Number(s?.score))
          .filter((n: any) => Number.isFinite(n))
      : []
    const baseScore = Number(parsed.score)
    const clamped = (n: number) => Math.min(Math.max(n, 1), 10)
    const aspectAvg = numericAspectScores.length
      ? numericAspectScores.reduce((a: number, b: number) => a + b, 0) / numericAspectScores.length
      : NaN
    const criterionScore = Number.isFinite(aspectAvg)
      ? clamped(aspectAvg)
      : clamped(Number.isFinite(baseScore) ? baseScore : 5)

    return {
      criteria: criteriaName,
      score: criterionScore,
      breakdown: {
        strengths: (parsed.strengths || []).map((s: any) => ({
          point: typeof s === 'string' ? s : s.point || '',
          impact: s.impact || 'Medium'
        })),
        improvements: (parsed.improvements || []).map((i: any) => ({
          area: typeof i === 'string' ? i : i.area || '',
          priority: i.priority || 'Important',
          actionable: i.actionable || i.area || ''
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

