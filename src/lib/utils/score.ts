export type ScoreTone = "gray" | "green" | "blue" | "yellow" | "red";

export function getScoreTone(score?: number | null): ScoreTone {
  if (score === undefined || score === null) return "gray";
  if (score >= 8) return "green";
  if (score >= 6) return "blue";
  if (score >= 4) return "yellow";
  return "red";
}

export type ScoreTier = "high" | "mid" | "low";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 7.5) return "high";
  if (score >= 5) return "mid";
  return "low";
}

