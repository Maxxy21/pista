export type ScoreTone = "gray" | "green" | "blue" | "yellow" | "red";

export function getScoreTone(score?: number | null): ScoreTone {
  if (score === undefined || score === null) return "gray";
  if (score >= 8) return "green";
  if (score >= 6) return "blue";
  if (score >= 4) return "yellow";
  return "red";
}

