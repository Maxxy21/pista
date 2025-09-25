import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, OpenAIConfigError } from "@/lib/utils";
import { withAuth, AuthenticatedRequest } from "@/lib/auth/api-auth";
import { withRateLimit, evaluationRateLimiter } from "@/lib/rate-limit/rate-limiter";
import { z } from "zod";
import { backOff } from "exponential-backoff";
import { 
  StructuredEvaluationData, 
  StructuredEvaluation, 
  StructuredFeedback 
} from "@/lib/types/evaluation";
import { parseStructuredEvaluationResponse, parseTextEvaluationResponse } from '@/lib/eval/parse'
import {
  MODEL_VERSION,
  PROMPT_VERSION,
  POLICY_VERSION,
  CONTENT_LIMITS,
  MODEL_NAME,
  SCORING_TEMPERATURE,
  FEEDBACK_TEMPERATURE,
  RUBRIC_ANCHORS,
  SCORING_RULES,
  SCORING_SYSTEM_PROMPT,
} from "@/lib/constants/eval";

// export const runtime = "edge";
export const maxDuration = 60;
const MAX_CONTENT_CHARS = CONTENT_LIMITS.evaluateChars;

const EVALUATION_CRITERIA = {
  problemSolution: {
    name: "Problem-Solution Fit",
    aspects: [
      "Problem Definition Clarity",
      "Solution Innovation",
      "Market Understanding",
      "Competitive Advantage",
      "Value Proposition",
    ],
  },
  businessModel: {
    name: "Business Model & Market",
    aspects: [
      "Revenue Model",
      "Market Size & Growth",
      "Go-to-Market Strategy",
      "Customer Acquisition",
      "Scalability Potential",
    ],
  },
  team: {
    name: "Team & Execution",
    aspects: [
      "Team Capability",
      "Domain Expertise",
      "Track Record",
      "Resource Management",
      "Implementation Plan",
    ],
  },
  presentation: {
    name: "Pitch Quality",
    aspects: [
      "Clarity & Structure",
      "Data & Evidence",
      "Story & Engagement",
      "Q&A Performance",
      "Overall Persuasiveness",
    ],
  },
} as const;

const WEIGHTS: Record<string, number> = {
  "Problem-Solution Fit": 0.3,
  "Business Model & Market": 0.3,
  "Team & Execution": 0.25,
  "Pitch Quality": 0.15,
};

type Question = {
  text: string;
  answer: string;
};


async function makeOpenAIRequest(prompt: string, temperature = SCORING_TEMPERATURE) {
  const openai = getOpenAI();
  try {
    return await backOff(
      () =>
        openai.chat.completions.create({
          model: MODEL_NAME,
          messages: [
            {
              role: "system",
              content: SCORING_SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature,
        }),
      {
        numOfAttempts: 3,
        maxDelay: 60000,
        startingDelay: 1000,
        timeMultiple: 2,
        retry: (error: any) => error?.error?.code === "rate_limit_exceeded",
      }
    );
  } catch (error: any) {
    if (error?.error?.code === "rate_limit_exceeded") {
      throw new Error(
        "OpenAI service is currently busy. Please try again in a few moments."
      );
    }
    throw error;
  }
}

function truncateContent(content: string, maxChars: number): string {
  if (content.length <= maxChars) return content;
  const keep = Math.floor(maxChars / 2);
  return content.slice(0, keep) + "\n...\n" + content.slice(-keep);
}

function buildFullContent(text: string, questions?: Question[]): string {
  const qna =
    questions
      ?.map((q, i) => `Q${i + 1}: ${q.text}\nA${i + 1}: ${q.answer}`)
      .join("\n\n") || "";
  const raw = `Pitch Presentation:\n"${text}"\n\nFollow-up Q&A:\n${qna}`;
  return truncateContent(raw, MAX_CONTENT_CHARS);
}

function buildStructuredPrompt(
  criteriaName: string,
  aspects: string[],
  fullContent: string
): string {
  return `
As an expert evaluator, score ONLY the criterion: ${criteriaName}.

Work from the content below without inventing facts. If evidence is missing for an aspect, score that aspect <= 4 and note what is missing.

Aspects to score (each 1-10 with a one sentence rationale):
${aspects.map((aspect) => `- ${aspect}`).join("\n")}

Content to evaluate (pitch + Q&A):
${fullContent}

${RUBRIC_ANCHORS}

JSON response schema (valid JSON only):
{
  "score": 1-10, // criterion score = rounded average of aspectScores[].score
  "strengths": [{ "point": "...", "impact": "High"|"Medium"|"Low"}],
  "improvements": [{ "area": "...", "priority": "Critical"|"Important"|"Nice to Have", "actionable": "..."}],
  "aspectScores": [
    { "aspect": "${aspects[0]}", "score": 1-10, "rationale": "..." },
    { "aspect": "${aspects[1]}", "score": 1-10, "rationale": "..." },
    { "aspect": "${aspects[2]}", "score": 1-10, "rationale": "..." },
    { "aspect": "${aspects[3]}", "score": 1-10, "rationale": "..." },
    { "aspect": "${aspects[4]}", "score": 1-10, "rationale": "..." }
  ],
  "summary": "2-3 sentence synthesis",
  "recommendations": ["actionable step 1", "actionable step 2"]
}

${SCORING_RULES}
`;
}

function calculateOverallScore(evaluations: StructuredEvaluation[]): number {
  const { weightedSum, totalWeight } = evaluations.reduce(
    (acc, evali) => {
      const weight = WEIGHTS[evali.criteria] ?? 0.25;
      return {
        weightedSum: acc.weightedSum + evali.score * weight,
        totalWeight: acc.totalWeight + weight,
      };
    },
    { weightedSum: 0, totalWeight: 0 }
  );

  if (totalWeight === 0) return 0;
  const avg = weightedSum / totalWeight;
  return Number(avg.toFixed(2));
}

async function generateStructuredFeedback(
  fullContent: string,
  evaluations: StructuredEvaluation[]
): Promise<StructuredFeedback> {
  const openai = getOpenAI();
  
  const feedbackPrompt = `
Based on the pitch evaluation, provide a comprehensive structured feedback as JSON:

Pitch content: ${fullContent.substring(0, 1000)}...
Evaluation scores: ${evaluations.map(e => `${e.criteria}: ${e.score}`).join(', ')}

Respond with this JSON structure:
{
  "overallAssessment": {
    "summary": "2-3 sentence overall assessment",
    "keyHighlights": ["highlight 1", "highlight 2", "highlight 3"],
    "primaryConcerns": ["concern 1", "concern 2", "concern 3"]
  },
  "investmentThesis": {
    "viability": "Strong" | "Moderate" | "Weak" | "Not Applicable",
    "reasoning": "investment thesis reasoning",
    "potentialReturns": "potential returns assessment"
  },
  "riskAssessment": {
    "majorRisks": [
      {
        "risk": "risk description",
        "severity": "High" | "Medium" | "Low",
        "mitigation": "mitigation strategy"
      }
    ],
    "riskScore": number (1-10, lower is better)
  },
  "nextSteps": {
    "immediateActions": ["action 1", "action 2"],
    "longTermRecommendations": ["recommendation 1", "recommendation 2"],
    "followUpQuestions": ["question 1", "question 2"]
  },
  "competitivePosition": {
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "marketOpportunity": "market opportunity assessment"
  },
  "foundersAssessment": {
    "teamStrengths": ["strength 1", "strength 2"],
    "experienceGaps": ["gap 1", "gap 2"],
    "executionCapability": "Excellent" | "Good" | "Fair" | "Poor"
  }
}`;

  const completion = await openai.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      {
        role: "system",
        content: "You are an experienced venture capitalist. Provide structured, actionable feedback in valid JSON format.",
      },
      {
        role: "user",
        content: feedbackPrompt,
      },
    ],
    temperature: FEEDBACK_TEMPERATURE,
  });

  try {
    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch (error) {
    return {
      overallAssessment: {
        summary: "Unable to parse detailed feedback, but evaluation completed successfully.",
        keyHighlights: ["Evaluation completed"],
        primaryConcerns: ["Feedback parsing issue"]
      },
      investmentThesis: {
        viability: "Moderate",
        reasoning: "Requires manual review",
        potentialReturns: "To be determined"
      },
      riskAssessment: {
        majorRisks: [{ risk: "Analysis incomplete", severity: "Medium", mitigation: "Manual review required" }],
        riskScore: 5
      },
      nextSteps: {
        immediateActions: ["Review evaluation results"],
        longTermRecommendations: ["Conduct detailed analysis"],
        followUpQuestions: ["Request manual feedback"]
      },
      competitivePosition: {
        strengths: ["Pitch submitted for evaluation"],
        weaknesses: ["Detailed analysis pending"],
        marketOpportunity: "To be assessed"
      },
      foundersAssessment: {
        teamStrengths: ["Engagement in evaluation process"],
        experienceGaps: ["To be determined"],
        executionCapability: "Good"
      }
    };
  }
}

// Input validation schema
const evaluateSchema = z.object({
  text: z.string().min(1, "Text is required").max(50000, "Text too long"),
  questions: z.array(z.object({
    text: z.string(),
    answer: z.string()
  })).optional().default([])
});

export const POST = withRateLimit(evaluationRateLimiter)(withAuth(async (req: AuthenticatedRequest) => {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    const { text, questions } = evaluateSchema.parse(body);


    const fullContent = buildFullContent(text, questions);

    const evaluations: StructuredEvaluation[] = await Promise.all(
      Object.entries(EVALUATION_CRITERIA).map(async ([, criteria]) => {
        const prompt = buildStructuredPrompt(
          criteria.name,
          Array.from(criteria.aspects),
          fullContent
        );
        const completion = await makeOpenAIRequest(prompt, SCORING_TEMPERATURE);
        const response = completion.choices[0].message.content || "";
        return parseStructuredEvaluationResponse(
          response,
          criteria.name,
          Array.from(criteria.aspects)
        );
      })
    );

    const overallFeedback = await generateStructuredFeedback(fullContent, evaluations);
    const overallScore = calculateOverallScore(evaluations);
    const processingTime = Date.now() - startTime;

    const result: StructuredEvaluationData = {
      evaluations,
      overallScore,
      overallFeedback,
      metadata: {
        evaluatedAt: new Date().toISOString(),
        modelVersion: MODEL_VERSION,
        processingTime,
        promptVersion: PROMPT_VERSION,
        policyVersion: POLICY_VERSION,
      }
    };

    // no debug logging in production builds

    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    
    if (error instanceof OpenAIConfigError) {
      return NextResponse.json({
        error: error.message,
        code: error.code
      }, { status: 503 })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid request data",
        code: "VALIDATION_ERROR",
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: "Evaluation processing failed",
      code: "EVALUATION_ERROR" 
    }, { status: 500 });
  }
}));
