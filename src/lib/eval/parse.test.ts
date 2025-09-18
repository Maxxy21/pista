import { describe, it, expect } from 'vitest'
import { parseTextEvaluationResponse } from './parse'

describe('parseTextEvaluationResponse', () => {
  it('parses SCORE, strengths, improvements and fills aspectScores', () => {
    const text = `SCORE: 6\n\nSTRENGTHS:\n- Clear problem statement\n- Evidence of early traction\n\nIMPROVEMENTS:\n- Specify pricing model\n- Provide CAC/LTV estimates\n\nANALYSIS:\nSolid early signals but needs clearer economics.`

    const aspects = [
      'Problem Definition Clarity',
      'Solution Innovation',
      'Market Understanding',
      'Competitive Advantage',
      'Value Proposition',
    ]
    const result = parseTextEvaluationResponse(text, 'Problem-Solution Fit', aspects)

    expect(result.criteria).toBe('Problem-Solution Fit')
    expect(result.score).toBe(6)
    expect(result.breakdown.strengths.length).toBe(2)
    expect(result.breakdown.improvements.length).toBe(2)
    expect(result.breakdown.aspectScores).toHaveLength(5)
    expect(result.breakdown.aspectScores[0].aspect).toBe(aspects[0])
    expect(result.summary).toContain('Solid early signals')
  })
})

