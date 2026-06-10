import React from "react";
import { cn } from "@/lib/utils";
import { getScoreTier, type ScoreTier } from "@/lib/utils/score";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PX = { sm: 34, md: 44, lg: 56 } as const;
const FONT = { sm: 12, md: 15, lg: 19 } as const;

const TIER_BORDER: Record<ScoreTier, string> = {
  high: "border-[hsl(var(--score-high))]",
  mid: "border-[hsl(var(--score-mid))]",
  low: "border-[hsl(var(--score-low))]",
};

const TIER_GLOW: Record<ScoreTier, string> = {
  high: "rgba(156,178,74,0.25)",
  mid: "rgba(201,162,39,0.25)",
  low: "rgba(194,96,47,0.25)",
};

export function ScoreRing({ score, size = "md", className }: ScoreRingProps) {
  const tier = getScoreTier(score);
  const dim = PX[size];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 font-mono font-medium text-foreground",
        TIER_BORDER[tier],
        className
      )}
      style={{
        width: dim,
        height: dim,
        fontSize: FONT[size],
        boxShadow: size === "sm" ? undefined : `0 0 14px ${TIER_GLOW[tier]}`,
      }}
      aria-label={`Score ${score.toFixed(1)} out of 10`}
    >
      {score.toFixed(1)}
    </div>
  );
}
