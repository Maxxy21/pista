// app/api/evaluate-answers/route.ts
import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/utils";

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
                    content: "You are an expert pitch evaluator analyzing follow-up responses.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content?.trim() ?? "";

        const evaluation: Evaluation = {
            criteria: "Follow-up Responses",
            comment: response,
            score: calculateScore(response),
            strengths: extractStrengths(response),
            improvements: extractImprovements(response),
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

function buildPrompt(pitchText: string, answers: QA[]): string {
    const qaSection = answers
        .map(
            (qa) =>
                `Q: ${qa.question}\nA: ${qa.answer}`
        )
        .join("\n\n");

    return `
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

Provide an updated evaluation with:
1. Specific strengths from the answers
2. Areas needing more clarification
3. Adjusted scores based on new insights
`.trim();
}

// Helper functions to parse the AI response
function calculateScore(response: string): number {
    const positiveSignals = [
        "excellent", "strong", "comprehensive", "impressive",
        "clear", "detailed", "well-thought", "insightful"
    ];

    let score = 7; // Base score
    for (const signal of positiveSignals) {
        if (response.toLowerCase().includes(signal)) {
            score += 0.5;
        }
    }

    return Math.min(Math.max(score, 1), 10);
}

function extractStrengths(response: string): string[] {
    // Looks for lines starting with "Strength" or containing "strength"
    return response
        .split("\n")
        .filter(line => /strength/i.test(line))
        .map(line => line.replace(/^[^:]+:/, "").trim())
        .filter(Boolean);
}

function extractImprovements(response: string): string[] {
    // Looks for lines containing "improve" or "clarif"
    return response
        .split("\n")
        .filter(line =>
            /improve|clarif/i.test(line)
        )
        .map(line => line.replace(/^[^:]+:/, "").trim())
        .filter(Boolean);
}