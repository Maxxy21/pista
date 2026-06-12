'use client';

import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreRadarChart } from "@/app/(pitch)/pitch/[id]/_components/charts/radar-chart";
import { getScoreColor } from "@/lib/utils/evaluation-colors";
import { cn } from "@/lib/utils";
import { animations } from "./constants";
import { sampleEvaluation } from "./sample-data";

const SampleEvaluation = () => {
  const detailed = sampleEvaluation.categories;

  return (
    <section
      className="py-24 lg:py-32"
      style={{ borderTop: "1px solid var(--landing-border)" }}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className="text-xs uppercase tracking-widest mb-4 font-medium"
            style={{ color: "var(--landing-text-muted)" }}
          >
            A real evaluation
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl tracking-tight leading-[1.1] mb-4"
            style={{ color: "var(--landing-cream)" }}
          >
            See exactly what
            <br />
            <span style={{ color: "var(--landing-text-muted)" }}>you get back</span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "var(--landing-text-muted)" }}>
            Every pitch comes back scored across four dimensions, with specific strengths and fixes.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={animations.staggerChildren}
          className="grid gap-4 lg:grid-cols-2 lg:items-start"
        >
          <motion.div variants={animations.fadeIn} className="lg:sticky lg:top-24">
            <div className="gradient-shell">
              <div className="gradient-shell-inner p-8 flex flex-col items-center gap-6">
                <ScoreRing score={sampleEvaluation.overallScore} size="xl" />
                <div className="w-full max-w-xs">
                  <ScoreRadarChart data={sampleEvaluation.categories} />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {detailed.map((c) => (
              <motion.div key={c.criteria} variants={animations.fadeIn}>
                <div className="gradient-shell-sm h-full">
                  <div className="gradient-shell-sm-inner h-full p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-display text-base" style={{ color: "var(--landing-cream)" }}>
                        {c.criteria}
                      </h3>
                      <span className={cn("rounded px-2 py-0.5 font-mono text-xs", getScoreColor(c.score))}>
                        {c.score.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--landing-text-muted)" }}>
                      {c.summary}
                    </p>
                    <ul className="space-y-2 text-sm" style={{ color: "var(--landing-text-muted)" }}>
                      <li className="flex gap-2">
                        <span className="shrink-0 text-[hsl(var(--score-high))]">✓</span>
                        <span>{c.strength}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="shrink-0 text-[hsl(var(--score-mid))]">→</span>
                        <span>{c.improvement}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SampleEvaluation;
