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
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "blue":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "yellow":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "red":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-500";
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
