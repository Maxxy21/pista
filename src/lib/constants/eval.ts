// Centralized evaluation constants for reproducibility (thesis-friendly)

export const MODEL_VERSION = "gpt-4-structured-v1";
export const PROMPT_VERSION = "criteria-v1.2"; // rubric anchors + evidence gating
export const POLICY_VERSION = "scoring-policy-v2"; // aspect-averaging + normalized weighted average

// Model and generation configuration
export const MODEL_NAME = "gpt-4";
export const SCORING_TEMPERATURE = 0.2; // low variance for scoring
export const FEEDBACK_TEMPERATURE = 0.7; // more expressive narrative

// Content limits used for prompt truncation
export const CONTENT_LIMITS = {
  evaluateChars: 8000,
  answersChars: 6000,
  questionsChars: 4000,
} as const;

// Prompt rubric and scoring rules (kept here for easy maintenance)
export const RUBRIC_ANCHORS = `Rubric anchors (apply to every aspect):
1-2: no concrete evidence; claims only
3-4: weak/indirect evidence; plan not validated
5-6: mixed evidence; partial validation or unclear metrics
7-8: strong evidence; credible metrics; risks addressed
9-10: exceptional evidence; repeated traction; benchmarks exceeded`;

export const SCORING_RULES = `Scoring rules:
- Start with aspect scoring; compute the criterion "score" as the rounded average of aspect scores.
- If there are no numbers or specific evidence for an aspect, cap it at 4 and note the gap in the rationale.
- Avoid mid-scale defaults; justify any mid-scale scores against the rubric anchors.`;

export const SCORING_SYSTEM_PROMPT =
  "You are an experienced venture capitalist. Follow the rubric strictly, return valid JSON only, and avoid unsupported claims. Use the full 1-10 scale based on evidence.";
