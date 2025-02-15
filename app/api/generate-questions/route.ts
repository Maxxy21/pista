// app/api/generate-questions/route.ts
import { NextResponse } from "next/server";
import {getOpenAI} from "@/lib/utils";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        const openai = getOpenAI();

        if (!text) {
            return NextResponse.json(
                { error: "No pitch text provided" },
                { status: 400 }
            );
        }

        const prompt = `
      Given this startup pitch:
      "${text}"
      
      Generate 3 insightful follow-up questions that will help evaluate:
      1. The depth of understanding of the market and competition
      2. The viability and scalability of the business model
      3. The team's ability to execute
      
      Questions should be:
      - Specific to the pitch content
      - Encourage detailed responses
      - Help assess the startup's potential
      - Focus on critical aspects not covered in the pitch
      
      Only return the questions in a numbered list format (1-3).
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an experienced venture capitalist conducting a pitch evaluation.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
        });

        // Extract questions from the response
        const response = completion.choices[0].message.content || "";
        const questions = response
            .split("\n")
            .filter((line) => line.match(/^\d+\./))
            .map((line) => line.replace(/^\d+\.\s*/, ""));

        return NextResponse.json({ questions });
    } catch (error) {
        console.error("Question generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate questions" },
            { status: 500 }
        );
    }
}