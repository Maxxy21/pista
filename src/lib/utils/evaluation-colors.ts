import { getScoreTier, type ScoreTier } from "@/lib/utils/score";

const CHIP: Record<ScoreTier, string> = {
  high: "text-[hsl(var(--score-high))] bg-[hsl(var(--score-high)/0.12)] border border-[hsl(var(--score-high)/0.25)]",
  mid: "text-[hsl(var(--score-mid))] bg-[hsl(var(--score-mid)/0.12)] border border-[hsl(var(--score-mid)/0.25)]",
  low: "text-[hsl(var(--score-low))] bg-[hsl(var(--score-low)/0.12)] border border-[hsl(var(--score-low)/0.25)]",
};
const MUTED = "text-muted-foreground bg-muted border border-border";

export const getScoreColor = (score: number) => CHIP[getScoreTier(score)];

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return CHIP.low;
    case "Medium": return CHIP.mid;
    case "Low": return CHIP.high;
    default: return MUTED;
  }
};

export const getViabilityColor = (viability: string) => {
  switch (viability) {
    case "Strong": return CHIP.high;
    case "Moderate": return CHIP.mid;
    case "Weak": return CHIP.low;
    default: return MUTED;
  }
};

export const getExecutionColor = (capability: string) => {
  switch (capability) {
    case "Excellent": return CHIP.high;
    case "Good": return CHIP.high;
    case "Fair": return CHIP.mid;
    case "Poor": return CHIP.low;
    default: return MUTED;
  }
};

export const getImpactColor = (impact: string) => {
  switch (impact) {
    case "High": return CHIP.high;
    case "Medium": return CHIP.mid;
    default: return MUTED;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical": return CHIP.low;
    case "Important": return CHIP.mid;
    default: return MUTED;
  }
};
