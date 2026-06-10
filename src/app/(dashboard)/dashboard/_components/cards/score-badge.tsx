import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getScoreTone } from "@/lib/utils/score";

interface ScoreBadgeProps {
  score?: number;
}

function toneToBadgeClass(tone: ReturnType<typeof getScoreTone>) {
  switch (tone) {
    case "green":
      return "bg-[hsl(var(--score-high)/0.15)] text-[hsl(var(--score-high))] border-transparent";
    case "blue":
      return "bg-[hsl(var(--score-high)/0.12)] text-[hsl(var(--score-high)/0.85)] border-transparent";
    case "yellow":
      return "bg-[hsl(var(--score-mid)/0.15)] text-[hsl(var(--score-mid))] border-transparent";
    case "red":
      return "bg-[hsl(var(--score-low)/0.15)] text-[hsl(var(--score-low))] border-transparent";
    default:
      return "bg-muted text-muted-foreground border-transparent";
  }
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score === undefined) return null;
  return (
    <Badge className={cn("font-semibold", toneToBadgeClass(getScoreTone(score)))}>
      {score.toFixed(1)}
    </Badge>
  );
}
