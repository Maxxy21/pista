// app/api/generate-questions/route.ts
import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/utils";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "No pitch text provided" },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const prompt = [
      `Analyze the following startup pitch and identify up to 3 important aspects that are missing or unclear such as 
       problem definition, business model, team, market, etc.`,
      `Pitch: "${text}"`,
      "",
      `For each missing or unclear aspect, generate a specific follow-up question that would help clarify or complete the pitch.`,
      "",
      `If there are fewer than 3 gaps, generate additional insightful questions about the pitch to reach a total of 3.`,
      "",
      `If there are no major gaps, generate 3 insightful questions that would help an investor better understand or challenge the pitch.`,
      "",
      `Return only the questions in a numbered list format (1-3).`,
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an experienced venture capitalist known for your thorough and insightful evaluations of startup pitches. 
          Your goal is to critically analyze each pitch, identify any missing or unclear aspects, and ask probing, constructive questions that help founders clarify and strengthen their ideas. 
          Be concise, professional, and focus on what would matter most to an investor making a funding decision.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices?.[0]?.message?.content ?? "";
    const questions = responseContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^\d+\./.test(line))
      .map((line) => line.replace(/^\d+\.\s*/, ""))
      .filter(Boolean);

    if (questions.length !== 3) {
      return NextResponse.json(
        { error: "Failed to generate the expected number of questions" },
        { status: 502 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
