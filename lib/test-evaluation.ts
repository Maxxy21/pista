// lib/test-evaluation.ts
// Simple test utility to validate the structured evaluation system

import { StructuredEvaluation, CategoryEvaluation, evaluationJsonSchema } from './evaluation-schema';

// Test data that matches the new structured format
export const mockStructuredEvaluation: StructuredEvaluation = {
  overallScore: 7.2,
  confidence: 8,
  categories: [
    {
      criteria: "Problem-Solution Fit",
      score: 7.0,
      comment: "The pitch presents a clear problem and solution with good market understanding. However, the solution lacks innovation and differentiation from existing competitors.",
      strengths: [
        "Clear problem definition: The problem of choosing an outfit quickly is well-defined",
        "Market Understanding: Good understanding of target demographics",
        "Revenue Plan: Well thought out dual-tier business model"
      ],
      improvements: [
        "Solution Innovation: The solution needs more unique features",
        "Competitive Advantage: No clear differentiation presented",
        "Team Expertise: Lack of fashion industry experience"
      ],
      aspects: [
        {
          name: "Problem Definition Clarity",
          score: 8.0,
          analysis: "Problem is clearly articulated and relatable to target audience",
          recommendations: ["Provide more quantitative data on problem frequency", "Include user research findings"]
        },
        {
          name: "Solution Innovation",
          score: 6.0,
          analysis: "Solution is functional but not particularly innovative",
          recommendations: ["Add unique AI features", "Consider personalization algorithms"]
        }
      ],
      keyInsights: [
        "Fashion tech market is competitive but has room for innovative solutions",
        "Team composition could benefit from industry expertise"
      ],
      actionableRecommendations: [
        "Conduct user interviews to validate problem-solution fit",
        "Research competitive landscape more thoroughly",
        "Consider bringing on fashion industry advisor"
      ]
    }
  ],
  overallAssessment: {
    summary: "The pitch presented a compelling solution with a clear market need. The founding team shows technical expertise but lacks industry experience. Financial projections need validation.",
    investmentThesis: "Fashion tech market is growing rapidly, and the product addresses a real pain point. Scalable business model with both B2C and potential B2B applications.",
    majorRisks: [
      "Market penetration in competitive fashion tech space",
      "Regulatory compliance challenges",
      "Team's lack of fashion industry experience"
    ],
    mitigationStrategies: [
      "Strategic partnerships with fashion brands",
      "Hiring industry experts as advisors",
      "Focus on regulatory compliance early"
    ],
    nextSteps: [
      "Conduct thorough due diligence on market size and competition",
      "Validate financial projections with industry benchmarks",
      "Develop detailed go-to-market strategy"
    ],
    competitivePosition: "Product has potential but needs clearer differentiation. Focus on unique AI capabilities and user experience improvements.",
    fundingReadiness: 6
  },
  metadata: {
    evaluationDate: new Date().toISOString(),
    modelUsed: "gpt-4o",
    processingTime: 15000,
    wordCount: 1250,
    hasQnA: true
  }
};

// Validation function
export function validateStructuredEvaluation(data: any): boolean {
  try {
    // Basic type checking
    if (typeof data.overallScore !== 'number' || data.overallScore < 1 || data.overallScore > 10) {
      console.error('Invalid overallScore:', data.overallScore);
      return false;
    }

    if (!Array.isArray(data.categories) || data.categories.length === 0) {
      console.error('Invalid categories array:', data.categories);
      return false;
    }

    // Validate each category
    for (const category of data.categories) {
      if (typeof category.score !== 'number' || category.score < 1 || category.score > 10) {
        console.error('Invalid category score:', category.criteria, category.score);
        return false;
      }

      if (!category.criteria || !category.comment) {
        console.error('Missing required category fields:', category);
        return false;
      }

      if (!Array.isArray(category.strengths) || !Array.isArray(category.improvements)) {
        console.error('Invalid strengths/improvements arrays:', category);
        return false;
      }
    }

    // Validate overall assessment
    if (!data.overallAssessment || !data.overallAssessment.summary) {
      console.error('Invalid overallAssessment:', data.overallAssessment);
      return false;
    }

    console.log('✅ Structured evaluation validation passed');
    return true;
  } catch (error) {
    console.error('❌ Validation error:', error);
    return false;
  }
}

// Test the validation
export function runValidationTest(): boolean {
  console.log('🧪 Testing structured evaluation validation...');
  
  const isValid = validateStructuredEvaluation(mockStructuredEvaluation);
  
  if (isValid) {
    console.log('✅ Mock data validation successful');
    console.log('📊 Sample scores:', mockStructuredEvaluation.categories.map(c => 
      `${c.criteria}: ${c.score}`
    ));
    console.log('🎯 Overall score:', mockStructuredEvaluation.overallScore);
    console.log('🔍 Confidence:', mockStructuredEvaluation.confidence);
  } else {
    console.log('❌ Mock data validation failed');
  }
  
  return isValid;
}

// Export for use in components
export { evaluationJsonSchema };