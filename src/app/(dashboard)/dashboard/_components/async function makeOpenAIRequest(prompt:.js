async function makeOpenAIRequest(prompt: string) {
  const openai = getOpenAI();
  try {
    return await backOff(
      () =>
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an experienced venture capitalist known for your thorough, critical, and insightful evaluations of startup pitches.
You have deep expertise in startups, business models, and market analysis.
Your goal is to provide clear, actionable, and investor-focused feedback—identifying both key strengths and areas for improvement.
Be concise and professional.

IMPORTANT: When assigning SCORE values, calibrate using a neutral baseline where a solid, investable pitch typically scores around 7/10.
Avoid extreme low or high scores unless strongly justified by the content. Aim for balanced scoring such that, across typical pitches, scores tend to converge toward an average of ~7.
Always include a clear justification for the numeric score in the ANALYSIS section.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      {
        numOfAttempts: 3,
        maxDelay: 60000,
        startingDelay: 1000,
        timeMultiple: 2,
        /*...*/
      }
    );
  } catch (err) {
    throw err;
  }
}