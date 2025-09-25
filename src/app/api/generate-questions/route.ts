import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, OpenAIConfigError } from "@/lib/utils";
import { withAuth, AuthenticatedRequest } from "@/lib/auth/api-auth";
import { withRateLimit, apiRateLimiter } from "@/lib/rate-limit/rate-limiter";
import { z } from "zod";
import { MODEL_NAME } from "@/lib/constants/eval";

// export const runtime = "edge";
export const maxDuration = 60;
const MAX_PROMPT_CHARS = 4000;
const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, Math.floor(max / 2))}\n...\n${text.slice(-Math.floor(max / 2))}`;

const questionSchema = z.object({
  text: z.string().min(1, "Text is required").max(10000, "Text too long")
});

export const POST = withRateLimit(apiRateLimiter)(withAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const { text } = questionSchema.parse(body);

    const openai = getOpenAI();

    const prompt = [
      `Analyze the following pitch and identify the most important gaps that prevent a confident evaluation. Select up to 3 questions that, if answered, would materially improve the assessment.`,
      `Pitch:\n"${truncate(text, MAX_PROMPT_CHARS)}"`,
      `\nReturn valid JSON only with this schema:\n{\n  "items": [\n    {\n      "dimension": "Problem-Solution Fit" | "Business Model & Market" | "Team & Execution" | "Pitch Quality",\n      "question": "one specific question, no multi-part prompts",\n      "why_needed": "why this matters for evaluation",\n      "suggested_format": "how to answer: numbers, metrics, bullets, examples",\n      "priority": "Critical" | "Important"\n    }\n  ]\n}\n\nConstraints:\n- Ask 1–3 questions total.\n- Make each question specific and evidence-seeking.\n- Do not request sensitive data (PII, secrets, internal docs).\n- Avoid duplicates and multi-part questions.`,
    ].join("\n\n");

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: `You are an experienced venture capitalist. Ask only the highest-priority follow-up questions that close information gaps. Questions must be specific, evidence-seeking, and answerable by a typical pitch. Return valid JSON only.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const responseContent = completion.choices?.[0]?.message?.content ?? "";

    let questions: string[] = [];
    // Try JSON first
    try {
      const data = JSON.parse(responseContent);
      if (Array.isArray(data?.items)) {
        questions = data.items
          .map((it: any) => (typeof it?.question === 'string' ? it.question.trim() : ''))
          .filter(Boolean);
      }
    } catch {
      // Fallback to numbered list
      const lines = responseContent
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      questions = lines
        .filter((line) => /^\d+\./.test(line))
        .map((line) => line.replace(/^\d+\.\s*/, ""))
        .filter(Boolean);
    }

    // Normalize: 1–3 items max; trim extras
    questions = questions.slice(0, 3);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Question generation error:", error);
    
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
      error: "Question generation failed",
      code: "GENERATION_ERROR" 
    }, { status: 500 });
  }
}));
