import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/utils";
import { PROMPT_VERSION, POLICY_VERSION } from "@/lib/constants/eval";

export const runtime = "edge";

interface QA {
    question: string;
    answer: string;
}

interface Evaluation {
    criteria: string;
    comment: string;
    score: number;
    strengths: string[];
    improvements: string[];
    aspects: string[];
}

interface EvaluationResponse {
    evaluations: Evaluation[];
    overallScore: number;
    overallFeedback: string;
    meta?: {
        promptVersion: string;
        policyVersion: string;
        evaluatedAt: string;
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pitchText, answers } = body;

        if (typeof pitchText !== "string" || !Array.isArray(answers)) {
            return NextResponse.json(
                { error: "Missing or invalid required data" },
                { status: 400 }
            );
        }

        const prompt = buildPrompt(pitchText, answers);

        const openai = getOpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert pitch evaluator analyzing follow-up responses. Respond in valid JSON only.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
        });

        const raw = completion.choices[0]?.message?.content?.trim() ?? "";

        const parsed = parseStructuredAnswerEvaluation(raw);

        const evaluation: Evaluation = {
            criteria: "Follow-up Responses",
            comment: parsed.comment,
            score: parsed.score,
            strengths: parsed.strengths,
            improvements: parsed.improvements,
            aspects: [
                "Response Clarity",
                "Market Understanding",
                "Problem Validation",
                "Business Viability",
                "Team Capability",
            ],
        };

        const result: EvaluationResponse = {
            evaluations: [evaluation],
            overallScore: evaluation.score,
            overallFeedback: evaluation.comment,
            meta: {
                promptVersion: PROMPT_VERSION,
                policyVersion: POLICY_VERSION,
                evaluatedAt: new Date().toISOString(),
            }
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Answer evaluation error:", error);
        return NextResponse.json(
            { error: "Failed to evaluate answers" },
            { status: 500 }
        );
    }
}

const MAX_PROMPT_CHARS = 6000;

function truncate(text: string, max: number) {
    if (text.length <= max) return text;
    const keep = Math.floor(max / 2);
    return text.slice(0, keep) + "\n...\n" + text.slice(-keep);
}

function buildPrompt(pitchText: string, answers: QA[]): string {
    const qaSection = answers
        .map(
            (qa) =>
                `Q: ${qa.question}\nA: ${qa.answer}`
        )
        .join("\n\n");

    const base = `
Analyze this startup pitch and the follow-up Q&A:

Original Pitch:
"${pitchText}"

Follow-up Q&A:
${qaSection}

Evaluate the answers considering:
1. Depth and clarity of responses
2. Market understanding
3. Problem-solution validation
4. Business model viability
5. Team capability signals

Provide an updated evaluation in JSON format with this exact schema:
{
  "score": number (1-10),
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["improvement area 1", "improvement area 2"],
  "comment": "2-3 sentence summary of the impact of the answers"
}

Use the full 1-10 scale when appropriate based on evidence (avoid defaulting to the center). Ensure valid JSON only.
`;

    return truncate(base.trim(), MAX_PROMPT_CHARS);
}

function parseStructuredAnswerEvaluation(raw: string): { score: number; strengths: string[]; improvements: string[]; comment: string } {
    try {
        const data = JSON.parse(raw);
        const scoreNum = typeof data.score === 'number' ? data.score : Number(data.score);
        const bounded = Math.min(Math.max(scoreNum || 0, 1), 10);
        const strengths = Array.isArray(data.strengths) ? data.strengths.filter(Boolean).map(String) : [];
        const improvements = Array.isArray(data.improvements) ? data.improvements.filter(Boolean).map(String) : [];
        const comment = typeof data.comment === 'string' ? data.comment : '';
        return { score: Number(bounded.toFixed(2)), strengths, improvements, comment };
    } catch {
        const strengths = extractByKeyword(raw, /strength|positive|good/i);
        const improvements = extractByKeyword(raw, /improve|clarif|concern|risk|weak/i);
        const balance = strengths.length - improvements.length;
        const dynamicCenter = 5 + Math.tanh(balance);
        return { score: Number(Math.min(Math.max(dynamicCenter, 1), 10).toFixed(2)), strengths, improvements, comment: raw };
    }
}

function extractByKeyword(text: string, re: RegExp): string[] {
    return text
        .split("\n")
        .filter(line => re.test(line))
        .map(line => line.replace(/^[^:]+:/, "").trim())
        .filter(Boolean);
}
