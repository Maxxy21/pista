import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/utils";
import { backOff } from "exponential-backoff";
import { 
  StructuredEvaluationData, 
  StructuredEvaluation, 
  StructuredFeedback 
} from "@/lib/types/evaluation";
import { MODEL_VERSION, PROMPT_VERSION, POLICY_VERSION, CONTENT_LIMITS } from "@/lib/constants/eval";

export const runtime = "edge";
export const maxDuration = 300;
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

function parseStructuredEvaluationResponse(
  response: string,
  criteriaName: string,
  aspects: string[]
): StructuredEvaluation {
  try {
    const parsed = JSON.parse(response);
    const numericAspectScores = Array.isArray(parsed.aspectScores)
      ? parsed.aspectScores
          .map((s: any) => Number(s?.score))
          .filter((n: any) => Number.isFinite(n))
      : [];
    const baseScore = Number(parsed.score);
    const clamped = (n: number) => Math.min(Math.max(n, 1), 10);
    const aspectAvg = numericAspectScores.length
      ? numericAspectScores.reduce((a: number, b: number) => a + b, 0) / numericAspectScores.length
      : NaN;
    const criterionScore = Number.isFinite(aspectAvg)
      ? clamped(aspectAvg)
      : clamped(Number.isFinite(baseScore) ? baseScore : 5);
    
    return {
      criteria: criteriaName,
      score: criterionScore,
      breakdown: {
        strengths: (parsed.strengths || []).map((s: any) => ({
          point: typeof s === 'string' ? s : s.point || '',
          impact: s.impact || "Medium"
        })),
        improvements: (parsed.improvements || []).map((i: any) => ({
          area: typeof i === 'string' ? i : i.area || '',
          priority: i.priority || "Important",
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
    };
  } catch (error) {
    return parseTextEvaluationResponse(response, criteriaName, aspects);
  }
}

function parseTextEvaluationResponse(
  response: string,
  criteriaName: string,
  aspects: string[]
): StructuredEvaluation {
  const scoreMatch = response.match(/SCORE:\s*(\d+(\.\d+)?)/i);
  const strengthsMatch = response.match(/STRENGTHS:([\s\S]*?)(?=IMPROVEMENTS:|$)/i);
  const improvementsMatch = response.match(/IMPROVEMENTS:([\s\S]*?)(?=ANALYSIS:|$)/i);
  const analysisMatch = response.match(/ANALYSIS:([\s\S]*?)$/i);

  const strengths = strengthsMatch
    ? strengthsMatch[1]
        .split("\n")
        .filter((s) => s.trim().startsWith("-"))
        .map((s) => s.replace("-", "").trim())
    : [];

  const improvements = improvementsMatch
    ? improvementsMatch[1]
        .split("\n")
        .filter((s) => s.trim().startsWith("-"))
        .map((s) => s.replace("-", "").trim())
    : [];

  const score = scoreMatch
    ? Math.min(Math.max(parseFloat(scoreMatch[1]), 1), 10)
    : 5;

  return {
    criteria: criteriaName,
    score,
    breakdown: {
      strengths: strengths.map(point => ({ point, impact: "Medium" as const })),
      improvements: improvements.map(area => ({
        area,
        priority: "Important" as const,
        actionable: area
      })),
      aspectScores: aspects.map(aspect => ({
        aspect,
        score,
        rationale: 'Based on overall evaluation'
      }))
    },
    summary: analysisMatch ? analysisMatch[1].trim() : "",
    recommendations: []
  };
}

async function makeOpenAIRequest(prompt: string, temperature = 0.2) {
  const openai = getOpenAI();
  try {
    return await backOff(
      () =>
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an experienced venture capitalist. Follow the rubric strictly, return valid JSON only, and avoid unsupported claims. Use the full 1-10 scale based on evidence.`,
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

Work from the content below without inventing facts. If evidence is missing for an aspect, score that aspect \u22644 and note what is missing.

Aspects to score (each 1-10 with a one sentence rationale):
${aspects.map((aspect) => `- ${aspect}`).join("\n")}

Content to evaluate (pitch + Q&A):
${fullContent}

Rubric anchors (apply to every aspect):
1-2: no concrete evidence; claims only
3-4: weak/indirect evidence; plan not validated
5-6: mixed evidence; partial validation or unclear metrics
7-8: strong evidence; credible metrics; risks addressed
9-10: exceptional evidence; repeated traction; benchmarks exceeded

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

Scoring rules:
- Start with aspect scoring; compute the criterion "score" as the rounded average of aspect scores.
- If there are no numbers or specific evidence for an aspect, cap it at 4 and list the gap in the rationale.
- Avoid mid-scale defaults; justify any mid-scale scores against the rubric anchors.
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

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const { text, questions } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

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
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
