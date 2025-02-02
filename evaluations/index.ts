//evaluations/index.ts


import {getOpenAI} from "@/lib/utils";

type EvaluationResult = {
    criteria: string;
    comment: string;
    score: number;
    strengths: string[];
    improvements: string[];
    aspects: string[];
}

type EvaluationResponse = {
    evaluations: EvaluationResult[];
    overallScore: number;
    overallFeedback: string;
}


const evaluationCriteria = {
    problemSolutionFit: {
        name: "Problem-Solution Fit",
        description: "Evaluate how well the pitch identifies a clear problem and presents a viable solution",
        aspects: [
            "Problem clarity and significance",
            "Solution viability and innovation",
            "Target market understanding",
            "Competitive advantage",
        ]
    },
    businessPotential: {
        name: "Business Potential",
        description: "Assess the potential for success as a startup business",
        aspects: [
            "Market opportunity size",
            "Revenue model viability",
            "Scalability potential",
            "Growth strategy",
        ]
    },
    presentationQuality: {
        name: "Presentation Quality",
        description: "Evaluate the effectiveness of the pitch delivery",
        aspects: [
            "Clarity and structure",
            "Engagement and persuasiveness",
            "Supporting evidence",
            "Professional delivery",
        ]
    }
};

export async function evaluatePitch(transcription: string): Promise<EvaluationResponse> {
    const openai = getOpenAI();

    const systemPrompt = `
You are an experienced startup pitch evaluator with expertise in venture capital and business development.
Your task is to provide detailed, constructive feedback on startup pitches.
Evaluate objectively and provide specific, actionable feedback.
Include:
1. A score (1-10)
2. 3-5 specific strengths
3. 3-5 areas for improvement
4. Analysis of required aspects
5. Detailed commentary
`;

    const evaluations = await Promise.all(
        Object.entries(evaluationCriteria).map(async ([key, criteria]) => {
            const prompt = `
Evaluate this pitch on ${criteria.name}.
Consider these aspects:
${criteria.aspects.map(aspect => `- ${aspect}`).join('\n')}

Scoring Guidelines:
1-3: Significant improvements needed
4-6: Meets basic expectations
7-8: Strong performance
9-10: Exceptional quality

Pitch Text:
"${transcription}"

Format your response as follows:
SCORE: [Your score]
STRENGTHS:
- [Strength 1]
- [Strength 2]
- [Strength 3]
IMPROVEMENTS:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]
ANALYSIS:
[Your detailed analysis]
`;

            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                });

                const response = completion.choices[0].message.content || "";

                // Parse the response
                const scoreMatch = response.match(/SCORE:\s*(\d+)/i);
                const strengthsMatch = response.match(/STRENGTHS:([\s\S]*?)(?=IMPROVEMENTS:|$)/i);
                const improvementsMatch = response.match(/IMPROVEMENTS:([\s\S]*?)(?=ANALYSIS:|$)/i);
                const analysisMatch = response.match(/ANALYSIS:([\s\S]*?)$/i);

                const strengths = strengthsMatch
                    ? strengthsMatch[1].split('\n').filter(s => s.trim().startsWith('-')).map(s => s.replace('-', '').trim())
                    : [];
                const improvements = improvementsMatch
                    ? improvementsMatch[1].split('\n').filter(s => s.trim().startsWith('-')).map(s => s.replace('-', '').trim())
                    : [];

                return {
                    criteria: criteria.name,
                    comment: analysisMatch ? analysisMatch[1].trim() : response,
                    score: scoreMatch ? Math.min(Math.max(parseInt(scoreMatch[1], 10), 1), 10) : 5,
                    strengths,
                    improvements,
                    aspects: criteria.aspects,
                } satisfies EvaluationResult;
            } catch (error) {
                console.error(`Evaluation error for ${criteria.name}:`, error);
                return {
                    criteria: criteria.name,
                    comment: "Evaluation failed",
                    score: 5,
                    strengths: [],
                    improvements: [],
                    aspects: criteria.aspects,
                } satisfies EvaluationResult;
            }
        })
    );

    // Calculate overall score
    const averageScore = Math.round(
        evaluations.reduce((sum, evaluate) => sum + evaluate.score, 0) / evaluations.length
    );

    // Generate overall feedback
    const overallFeedbackPrompt = `
Based on these evaluations:
${evaluations.map(e => `${e.criteria}: ${e.score}/10 - Key strengths: ${e.strengths.join(', ')}`).join('\n')}

Provide a concise summary including:
1. Overall assessment
2. Key strengths across all areas
3. Critical improvements needed
4. Next steps recommendation
Keep it to a single paragraph.
`;

    const overallFeedbackCompletion = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Provide concise, actionable feedback synthesis."
            },
            {
                role: "user",
                content: overallFeedbackPrompt
            }
        ],
        temperature: 0.7,
    });

    return {
        evaluations,
        overallScore: averageScore,
        overallFeedback: overallFeedbackCompletion.choices[0].message.content || "No overall feedback available",
    } satisfies EvaluationResponse;
}
