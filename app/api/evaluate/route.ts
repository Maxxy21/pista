

// app/api/evaluate/route.ts
import {NextResponse} from "next/server";
import {getOpenAI} from "@/lib/utils";
import { backOff } from "exponential-backoff";


export const runtime = "edge";
export const maxDuration = 300;

const evaluationCriteria = {
    problemSolution: {
        name: "Problem-Solution Fit",
        aspects: [
            "Problem Definition Clarity",
            "Solution Innovation",
            "Market Understanding",
            "Competitive Advantage",
            "Value Proposition"
        ]
    },
    businessModel: {
        name: "Business Model & Market",
        aspects: [
            "Revenue Model",
            "Market Size & Growth",
            "Go-to-Market Strategy",
            "Customer Acquisition",
            "Scalability Potential"
        ]
    },
    team: {
        name: "Team & Execution",
        aspects: [
            "Team Capability",
            "Domain Expertise",
            "Track Record",
            "Resource Management",
            "Implementation Plan"
        ]
    },
    presentation: {
        name: "Pitch Quality",
        aspects: [
            "Clarity & Structure",
            "Data & Evidence",
            "Story & Engagement",
            "Q&A Performance",
            "Overall Persuasiveness"
        ]
    }
};

async function makeOpenAIRequest(prompt: string, attempt = 1) {
    const openai = getOpenAI();
    try {
        return await backOff(
            () => openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an experienced venture capitalist evaluating startup pitches with deep expertise in startups, business models, and market analysis.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    }
                ],
                temperature: 0.7,
            }),
            {
                numOfAttempts: 3,
                maxDelay: 60000, // Maximum delay of 60 seconds
                startingDelay: 1000, // Start with 1 second delay
                timeMultiple: 2, // Double the delay each time
                retry: (error: any) => {
                    // Only retry on rate limit errors
                    return error?.error?.code === 'rate_limit_exceeded';
                },
            }
        );
    } catch (error: any) {
        if (error?.error?.code === 'rate_limit_exceeded') {
            // If we still hit rate limits after retries, return a specific error
            throw new Error("OpenAI service is currently busy. Please try again in a few moments.");
        }
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        const {text, questions} = await req.json();

        if (!text) {
            return NextResponse.json(
                {error: "No text provided"},
                {status: 400}
            );
        }

        const openai = getOpenAI();

        const fullContent = `
      Pitch Presentation:
      "${text}"

      Follow-up Q&A:
      ${questions?.map((q: any, i: number) =>
            `Q${i + 1}: ${q.text}\nA${i + 1}: ${q.answer}`
        ).join('\n\n')}
    `;

        // Generate detailed evaluation for each criterion
        const evaluations = await Promise.all(
            Object.entries(evaluationCriteria).map(async ([key, criteria]) => {
                const prompt = `
          As an expert startup evaluator, analyze this pitch focusing on ${criteria.name}.

          Consider these specific aspects:
          ${criteria.aspects.map(aspect => `- ${aspect}`).join('\n')}

          Content to evaluate:
          ${fullContent}

          Provide:
          1. Score (1-10) with specific justification
          2. Key strengths (3-5 bullet points)
          3. Areas for improvement (3-5 bullet points)
          4. Detailed analysis of each aspect
          5. Critical insights and recommendations

          Format your response as follows:
          SCORE: [number]
          STRENGTHS:
          - [point 1]
          - [point 2]
          ...
          IMPROVEMENTS:
          - [point 1]
          - [point 2]
          ...
          ANALYSIS:
          [Your detailed analysis]


        `;

                const completion = await makeOpenAIRequest(prompt);
                const response = completion.choices[0].message.content || "";

                // Parse response
                const scoreMatch = response.match(/SCORE:\s*(\d+(\.\d+)?)/i);
                const strengthsMatch = response.match(/STRENGTHS:([\s\S]*?)(?=IMPROVEMENTS:|$)/i);
                const improvementsMatch = response.match(/IMPROVEMENTS:([\s\S]*?)(?=ANALYSIS:|$)/i);
                const analysisMatch = response.match(/ANALYSIS:([\s\S]*?)$/i);

                const strengths = strengthsMatch
                    ? strengthsMatch[1].split('\n')
                        .filter(s => s.trim().startsWith('-'))
                        .map(s => s.replace('-', '').trim())
                    : [];

                const improvements = improvementsMatch
                    ? improvementsMatch[1].split('\n')
                        .filter(s => s.trim().startsWith('-'))
                        .map(s => s.replace('-', '').trim())
                    : [];

                return {
                    criteria: criteria.name,
                    comment: analysisMatch ? analysisMatch[1].trim() : "",
                    score: scoreMatch ? Math.min(Math.max(parseFloat(scoreMatch[1]), 1), 10) : 5,
                    strengths,
                    improvements,
                    aspects: criteria.aspects,
                };
            })
        );

        // Generate overall summary
        const summaryPrompt = `
      Based on the detailed evaluations of ${fullContent.length} characters of pitch content, provide:
      1. Overall assessment (2-3 sentences)
      2. Key investment thesis (if applicable)
      3. Major risks and mitigation strategies
      4. Next steps recommendation
      Keep it concise but insightful.
    `;

        const summaryCompletion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Provide a concise, actionable synthesis of the pitch evaluation.",
                },
                {
                    role: "user",
                    content: summaryPrompt,
                }
            ],
            temperature: 0.7,
        });

        // Calculate weighted score
        const weights = {
            "Problem-Solution Fit": 0.3,
            "Business Model & Market": 0.3,
            "Team & Execution": 0.25,
            "Pitch Quality": 0.15,
        };

        const overallScore = Math.round(
            evaluations.reduce((sum, evali) => {
                const weight = weights[evali.criteria as keyof typeof weights] || 0.25;
                return sum + evali.score * weight;
            }, 0)
        );

        console.log('API Response:', {
            evaluations,
            overallScore,
            overallFeedback: summaryCompletion.choices[0].message.content || "",
        });

        return NextResponse.json({
            evaluations,
            overallScore,
            overallFeedback: summaryCompletion.choices[0].message.content || "",
        });
    } catch (error) {
        console.error("Evaluation error:", error);
        return NextResponse.json(
            {error: "Evaluation failed"},
            {status: 500}
        );
    }
}


// import {NextResponse} from "next/server";
// import {getOpenAI} from "@/lib/utils";
// import { backOff } from "exponential-backoff";
//
//
// export const runtime = "edge";
// export const maxDuration = 300;
//
// const evaluationCriteria = {
//     problemSolution: {
//         name: "Problem-Solution Fit",
//         aspects: [
//             "Problem Definition Clarity",
//             "Solution Innovation",
//             "Market Understanding",
//             "Competitive Advantage",
//             "Value Proposition"
//         ]
//     },
//     businessModel: {
//         name: "Business Model & Market",
//         aspects: [
//             "Revenue Model",
//             "Market Size & Growth",
//             "Go-to-Market Strategy",
//             "Customer Acquisition",
//             "Scalability Potential"
//         ]
//     },
//     team: {
//         name: "Team & Execution",
//         aspects: [
//             "Team Capability",
//             "Domain Expertise",
//             "Track Record",
//             "Resource Management",
//             "Implementation Plan"
//         ]
//     },
//     presentation: {
//         name: "Pitch Quality",
//         aspects: [
//             "Clarity & Structure",
//             "Data & Evidence",
//             "Story & Engagement",
//             "Q&A Performance",
//             "Overall Persuasiveness"
//         ]
//     }
// };
//
// async function makeOpenAIRequest(prompt: string, attempt = 1) {
//     const openai = getOpenAI();
//     try {
//         return await backOff(
//             () => openai.chat.completions.create({
//                 model: "gpt-4",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are an experienced venture capitalist evaluating startup pitches with deep expertise in startups, business models, and market analysis.",
//                     },
//                     {
//                         role: "user",
//                         content: prompt,
//                     }
//                 ],
//                 temperature: 0.7,
//             }),
//             {
//                 numOfAttempts: 3,
//                 maxDelay: 60000, // Maximum delay of 60 seconds
//                 startingDelay: 1000, // Start with 1 second delay
//                 timeMultiple: 2, // Double the delay each time
//                 retry: (error: any) => {
//                     // Only retry on rate limit errors
//                     return error?.error?.code === 'rate_limit_exceeded';
//                 },
//             }
//         );
//     } catch (error: any) {
//         if (error?.error?.code === 'rate_limit_exceeded') {
//             // If we still hit rate limits after retries, return a specific error
//             throw new Error("OpenAI service is currently busy. Please try again in a few moments.");
//         }
//         throw error;
//     }
// }
// export async function POST(req: Request) {
//     try {
//         const { text } = await req.json();
//
//         if (!text) {
//             return NextResponse.json(
//                 { error: "No text provided" },
//                 { status: 400 }
//             );
//         }
//
//         const openai = getOpenAI();
//
//         const fullContent = `
//       Pitch Presentation:
//       "${text}"
//     `;
//
//         // Generate detailed evaluation for each criterion
//         const evaluations = await Promise.all(
//             Object.entries(evaluationCriteria).map(async ([key, criteria]) => {
//                 const prompt = `
//           As an expert startup evaluator, analyze this pitch focusing on ${criteria.name}.
//
//           Consider these specific aspects:
//           ${criteria.aspects.map(aspect => `- ${aspect}`).join('\n')}
//
//           Content to evaluate:
//           ${fullContent}
//
//           Provide:
//           1. Score (1-10) with specific justification
//           2. Key strengths (3-5 bullet points)
//           3. Areas for improvement (3-5 bullet points)
//           4. Detailed analysis of each aspect
//           5. Critical insights and recommendations
//
//           Format your response as follows:
//           SCORE: [number]
//           STRENGTHS:
//           - [point 1]
//           - [point 2]
//           ...
//           IMPROVEMENTS:
//           - [point 1]
//           - [point 2]
//           ...
//           ANALYSIS:
//           [Your detailed analysis]
//         `;
//
//                 const completion = await makeOpenAIRequest(prompt);
//                 const response = completion.choices[0].message.content || "";
//
//                 // Parse response
//                 const scoreMatch = response.match(/SCORE:\s*(\d+(\.\d+)?)/i);
//                 const strengthsMatch = response.match(/STRENGTHS:([\s\S]*?)(?=IMPROVEMENTS:|$)/i);
//                 const improvementsMatch = response.match(/IMPROVEMENTS:([\s\S]*?)(?=ANALYSIS:|$)/i);
//                 const analysisMatch = response.match(/ANALYSIS:([\s\S]*?)$/i);
//
//                 const strengths = strengthsMatch
//                     ? strengthsMatch[1].split('\n')
//                         .filter(s => s.trim().startsWith('-'))
//                         .map(s => s.replace('-', '').trim())
//                     : [];
//
//                 const improvements = improvementsMatch
//                     ? improvementsMatch[1].split('\n')
//                         .filter(s => s.trim().startsWith('-'))
//                         .map(s => s.replace('-', '').trim())
//                     : [];
//
//                 return {
//                     criteria: criteria.name,
//                     comment: analysisMatch ? analysisMatch[1].trim() : "",
//                     score: scoreMatch ? Math.min(Math.max(parseFloat(scoreMatch[1]), 1), 10) : 5,
//                     strengths,
//                     improvements,
//                     aspects: criteria.aspects,
//                 };
//             })
//         );
//
//         // Generate overall summary
//         const summaryPrompt = `
//       Based on the detailed evaluations of ${fullContent.length} characters of pitch content, provide:
//       1. Overall assessment (2-3 sentences)
//       2. Key investment thesis (if applicable)
//       3. Major risks and mitigation strategies
//       4. Next steps recommendation
//       Keep it concise but insightful.
//     `;
//
//         const summaryCompletion = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//                 {
//                     role: "system",
//                     content: "Provide a concise, actionable synthesis of the pitch evaluation.",
//                 },
//                 {
//                     role: "user",
//                     content: summaryPrompt,
//                 }
//             ],
//             temperature: 0.7,
//         });
//
//         // Calculate weighted score
//         const weights = {
//             "Problem-Solution Fit": 0.3,
//             "Business Model & Market": 0.3,
//             "Team & Execution": 0.25,
//             "Pitch Quality": 0.15,
//         };
//
//         const overallScore = Math.round(
//             evaluations.reduce((sum, evali) => {
//                 const weight = weights[evali.criteria as keyof typeof weights] || 0.25;
//                 return sum + evali.score * weight;
//             }, 0)
//         );
//
//         return NextResponse.json({
//             evaluations,
//             overallScore,
//             overallFeedback: summaryCompletion.choices[0].message.content || "",
//         });
//     } catch (error) {
//         console.error("Evaluation error:", error);
//         return NextResponse.json(
//             { error: "Evaluation failed" },
//             { status: 500 }
//         );
//     }
// }