// app/api/evaluate-answers/route.ts
import { NextResponse } from "next/server";
import {getOpenAI} from "@/lib/utils";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { pitchText, answers } = await req.json();
        const openai = getOpenAI();

        if (!pitchText || !answers) {
            return NextResponse.json(
                { error: "Missing required data" },
                { status: 400 }
            );
        }

        const prompt = `
      Analyze this startup pitch and the follow-up Q&A:

      Original Pitch:
      "${pitchText}"

      Follow-up Q&A:
      ${answers.map((qa: any) => `Q: ${qa.question}\nA: ${qa.answer}`).join("\n\n")}

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
    `;

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

        // Parse the evaluation response and integrate with original evaluation format
        const response = completion.choices[0].message.content || "";

        // Structure matches your existing evaluation schema
        return NextResponse.json({
            evaluations: [
                {
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
                        "Team Capability"
                    ],
                },
            ],
            overallScore: calculateScore(response),
            overallFeedback: response,
        });
    } catch (error) {
        console.error("Answer evaluation error:", error);
        return NextResponse.json(
            { error: "Failed to evaluate answers" },
            { status: 500 }
        );
    }
}

// Helper functions to parse the AI response
function calculateScore(response: string): number {
    // Implement scoring logic based on response content
    // This is a simplified example
    const positiveSignals = [
        "excellent", "strong", "comprehensive", "impressive",
        "clear", "detailed", "well-thought", "insightful"
    ];

    let score = 7; // Base score
    positiveSignals.forEach(signal => {
        if (response.toLowerCase().includes(signal)) {
            score += 0.5;
        }
    });

    return Math.min(Math.max(score, 1), 10); // Ensure score is between 1-10
}

function extractStrengths(response: string): string[] {
    // Extract strengths from the response
    // This is a simplified implementation
    return response
        .split("\n")
        .filter(line => line.toLowerCase().includes("strength"))
        .map(line => line.replace(/^[^:]+:/, "").trim())
        .filter(Boolean);
}

function extractImprovements(response: string): string[] {
    // Extract improvements from the response
    // This is a simplified implementation
    return response
        .split("\n")
        .filter(line =>
            line.toLowerCase().includes("improve") ||
            line.toLowerCase().includes("clarif")
        )
        .map(line => line.replace(/^[^:]+:/, "").trim())
        .filter(Boolean);
}