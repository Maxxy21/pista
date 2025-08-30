// Centralized evaluation constants for reproducibility (thesis-friendly)

export const MODEL_VERSION = "gpt-4-structured-v1";
export const PROMPT_VERSION = "criteria-v1.1"; // updated to encourage full 1–10 usage
export const POLICY_VERSION = "scoring-policy-v2"; // aspect-averaging + normalized weighted average

// Content limits used for prompt truncation
export const CONTENT_LIMITS = {
  evaluateChars: 8000,
  answersChars: 6000,
  questionsChars: 4000,
} as const;

