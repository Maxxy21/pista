// src/components/shared/landing/components/verdict-card.tsx
'use client';

import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/score-ring";
import { getScoreTier, type ScoreTier } from "@/lib/utils/score";
import { sampleEvaluation } from "./sample-data";
import { useCountUp } from "./use-count-up";

const TIER_BAR: Record<ScoreTier, string> = {
  high: "bg-[hsl(var(--score-high))]",
  mid: "bg-[hsl(var(--score-mid))]",
  low: "bg-[hsl(var(--score-low))]",
};

export const VerdictCard = () => {
  const score = useCountUp(sampleEvaluation.overallScore);

  return (
    <div className="gradient-shell">
      <div className="gradient-shell-inner p-8 sm:p-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <ScoreRing score={score} size="xl" />

          <h3 className="font-display text-2xl leading-snug max-w-xs text-[hsl(var(--foreground))]">
            {sampleEvaluation.verdict}
          </h3>

          <div className="w-full max-w-sm space-y-3">
            {sampleEvaluation.categories.map(({ criteria, score: s }, i) => {
              const tier = getScoreTier(s);
              return (
                <div key={criteria} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">{criteria}</span>
                    <span className="font-mono text-[hsl(var(--muted-foreground))]">
                      {s.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                    <motion.div
                      className={`h-full rounded-full ${TIER_BAR[tier]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s * 10}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            Evaluated in {sampleEvaluation.evaluatedInSeconds}s
          </p>
        </div>
      </div>
    </div>
  );
};
