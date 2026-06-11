# Landing Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the public landing page by replacing the static hero screenshot with a live verdict card built from real product primitives, adding a sample-evaluation deep-dive section, warming the last cool accents, and adding tasteful motion.

**Architecture:** All landing pieces are client-side and presentational. A single hardcoded `sampleEvaluation` dataset feeds both the hero verdict card and the new sample-evaluation section so they tell one consistent story. The hero verdict card and sample section reuse the actual app components (`ScoreRing`, `ScoreRadarChart`) plus the warm `--score-*` token classes — no new design language, just the existing product surfaced on the landing.

**Tech Stack:** Next.js 15 (App Router, client components), React, TypeScript, Tailwind CSS 3, framer-motion, recharts (via existing `ScoreRadarChart`), Vitest + Testing Library (jsdom).

**Reference spec:** `docs/superpowers/specs/2026-06-11-landing-elevation-design.md`

---

## File Structure

- **Create** `src/components/shared/landing/components/sample-data.ts` — the hardcoded sample evaluation (overall score, verdict, categories) + TypeScript types. Single source of truth for both new pieces.
- **Create** `src/components/shared/landing/components/use-count-up.ts` — small framer-motion count-up hook used by the verdict ring(s).
- **Create** `src/components/shared/landing/components/verdict-card.tsx` — the hero centerpiece: `ScoreRing` (xl, count-up) + Fraunces verdict + warm score bars + mono meta row.
- **Create** `src/components/shared/landing/components/sample-evaluation.tsx` — new section: `ScoreRadarChart` + overall `ScoreRing` + two detailed criteria cards.
- **Create** `src/components/shared/landing/components/__tests__/sample-data.test.ts` — shape test.
- **Create** `src/components/shared/landing/components/__tests__/verdict-card.test.tsx` — render smoke test.
- **Modify** `src/components/shared/landing/components/hero.tsx` — drop the screenshot/browser-chrome block, render `<VerdictCard />`, warm-tune the badge dot / glow / button token, mono stats.
- **Modify** `src/components/shared/landing/landing-page.tsx` — insert `<SampleEvaluation />` between `HowItWorks` and `CTA`.
- **Modify** `src/components/shared/landing/components/how-it-works.tsx` — step numbers `font-mono`.
- **Modify** `src/components/shared/landing/components/cta.tsx` — button text color → token.
- **Modify** `src/app/globals.css` — `gradient-shell` utilities source from tokens instead of hardcoded hexes.

Reused as-is: `@/components/ui/score-ring` (`ScoreRing`, accepts `score:number`, `size:"sm"|"md"|"lg"|"xl"`), `@/app/(pitch)/pitch/[id]/_components/charts/radar-chart` (`ScoreRadarChart`, accepts `data: Array<{criteria:string; score:number}>`), `@/lib/utils/score` (`getScoreTier`), `@/lib/utils/evaluation-colors` (`getScoreColor`).

---

### Task 1: Sample evaluation data

**Files:**
- Create: `src/components/shared/landing/components/sample-data.ts`
- Test: `src/components/shared/landing/components/__tests__/sample-data.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/components/shared/landing/components/__tests__/sample-data.test.ts
import { describe, it, expect } from "vitest";
import { sampleEvaluation } from "../sample-data";

describe("sampleEvaluation", () => {
  it("has a numeric overall score and a verdict", () => {
    expect(typeof sampleEvaluation.overallScore).toBe("number");
    expect(sampleEvaluation.verdict.length).toBeGreaterThan(0);
  });

  it("has non-empty categories with criteria + score", () => {
    expect(sampleEvaluation.categories.length).toBeGreaterThan(0);
    for (const c of sampleEvaluation.categories) {
      expect(typeof c.criteria).toBe("string");
      expect(typeof c.score).toBe("number");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/shared/landing/components/__tests__/sample-data.test.ts`
Expected: FAIL — cannot resolve `../sample-data`.

- [ ] **Step 3: Create the data module**

```ts
// src/components/shared/landing/components/sample-data.ts
export interface SampleCriterion {
  criteria: string;
  score: number;
  summary: string;
  strength: string;
  improvement: string;
}

export interface SampleEvaluation {
  overallScore: number;
  verdict: string;
  evaluatedInSeconds: number;
  categories: SampleCriterion[];
}

export const sampleEvaluation: SampleEvaluation = {
  overallScore: 8.4,
  verdict: "Strong pitch. Ready to present to investors.",
  evaluatedInSeconds: 47,
  categories: [
    {
      criteria: "Problem-Solution Fit",
      score: 8.4,
      summary:
        "A sharply defined problem with a solution that maps directly to it and clear early demand.",
      strength: "Quantified pain point backed by customer interviews.",
      improvement: "Name the wedge use case you win first.",
    },
    {
      criteria: "Business Model",
      score: 6.2,
      summary:
        "Pricing is credible but unit economics and expansion path need more proof.",
      strength: "Recurring revenue with a logical pricing tier.",
      improvement: "Show CAC payback and a path to net revenue retention.",
    },
    {
      criteria: "Team & Execution",
      score: 4.8,
      summary:
        "Strong product instincts, but the team has a visible gap on go-to-market.",
      strength: "Technical founder who has shipped the core product.",
      improvement: "Add or name a commercial/GTM lead to de-risk execution.",
    },
    {
      criteria: "Pitch Quality",
      score: 7.1,
      summary:
        "Clear narrative arc; a few slides bury the strongest proof points.",
      strength: "Tight, jargon-free storytelling.",
      improvement: "Lead with traction instead of saving it for the end.",
    },
  ],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/shared/landing/components/__tests__/sample-data.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/landing/components/sample-data.ts src/components/shared/landing/components/__tests__/sample-data.test.ts
git commit -m "add landing sample evaluation data"
```

---

### Task 2: Count-up hook

**Files:**
- Create: `src/components/shared/landing/components/use-count-up.ts`

No standalone test (covered indirectly by the VerdictCard smoke test and build). This is a tiny, pure-ish hook.

- [ ] **Step 1: Create the hook**

```ts
// src/components/shared/landing/components/use-count-up.ts
import { animate } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animates a number from 0 up to `target`.
 * Pass `start=false` to defer (e.g. until scrolled into view).
 */
export function useCountUp(target: number, start = true, duration = 1.1) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [target, start, duration]);

  return value;
}
```

- [ ] **Step 2: Type-check via build later (no test now). Commit**

```bash
git add src/components/shared/landing/components/use-count-up.ts
git commit -m "add count-up hook for landing"
```

---

### Task 3: Verdict card (hero centerpiece)

**Files:**
- Create: `src/components/shared/landing/components/verdict-card.tsx`
- Test: `src/components/shared/landing/components/__tests__/verdict-card.test.tsx`

- [ ] **Step 1: Write the failing render smoke test**

The test asserts on stable (non-animated) content — the verdict line and a category label — to avoid animation timing flakiness.

```tsx
// src/components/shared/landing/components/__tests__/verdict-card.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerdictCard } from "../verdict-card";
import { sampleEvaluation } from "../sample-data";

describe("VerdictCard", () => {
  it("renders the verdict line and category labels", () => {
    render(<VerdictCard />);
    expect(screen.getByText(sampleEvaluation.verdict)).toBeDefined();
    expect(screen.getByText("Problem-Solution Fit")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/shared/landing/components/__tests__/verdict-card.test.tsx`
Expected: FAIL — cannot resolve `../verdict-card`.

- [ ] **Step 3: Implement the component**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/shared/landing/components/__tests__/verdict-card.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/landing/components/verdict-card.tsx src/components/shared/landing/components/__tests__/verdict-card.test.tsx
git commit -m "add hero verdict card"
```

---

### Task 4: Rebuild the Hero around the verdict card

**Files:**
- Modify: `src/components/shared/landing/components/hero.tsx`

Replace the static screenshot block with the verdict card, warm-tune the badge dot, ambient glow, and stats.

- [ ] **Step 1: Remove the now-unused `Image` import**

Find:
```tsx
import Image from "next/image";
```
Delete that line. (Keep the `Link` and `motion` imports.)

- [ ] **Step 2: Add the VerdictCard import**

After the existing `import { animations, stats } from "./constants";` line, add:
```tsx
import { VerdictCard } from "./verdict-card";
```

- [ ] **Step 3: Warm-tune the ambient glow**

Find:
```tsx
                        background: "radial-gradient(ellipse at center, #F2EAD3 0%, transparent 70%)",
```
Replace with:
```tsx
                        background: "radial-gradient(ellipse at center, hsl(var(--foreground)) 0%, transparent 70%)",
```

- [ ] **Step 4: Warm-tune the badge pulse dot**

Find:
```tsx
                            <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ background: "#4ade80" }}
                            />
```
Replace with:
```tsx
                            <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ background: "hsl(var(--score-high))" }}
                            />
```

- [ ] **Step 5: Mono the stats values**

Find:
```tsx
                                <span
                                    className="text-2xl font-bold tabular-nums font-display"
                                    style={{ color: "var(--landing-cream)" }}
                                >
                                    {stat.value}
                                </span>
```
Replace with:
```tsx
                                <span
                                    className="text-2xl font-bold tabular-nums font-mono"
                                    style={{ color: "var(--landing-cream)" }}
                                >
                                    {stat.value}
                                </span>
```

- [ ] **Step 6: Replace the browser-chrome screenshot block with the verdict card**

Find the entire block that starts with `{/* Browser chrome mockup */}` and ends with its closing `</motion.div>` (the `motion.div` with `initial={{ opacity: 0, y: 48 }}` wrapping the `gradient-shell` → browser bar → `<Image src="/img.png" .../>`). Replace the WHOLE block with:

```tsx
                {/* Live verdict card */}
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto max-w-md"
                >
                    <VerdictCard />
                </motion.div>
```

- [ ] **Step 7: Verify build is clean**

Run: `npm run build`
Expected: Compiles with no errors; no "unused `Image`" or missing-import errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/shared/landing/components/hero.tsx
git commit -m "swap hero screenshot for live verdict card"
```

---

### Task 5: Sample evaluation section

**Files:**
- Create: `src/components/shared/landing/components/sample-evaluation.tsx`

- [ ] **Step 1: Implement the section**

Shows the overall ring + radar on the left, two detailed criteria cards on the right. The radar receives the sample categories directly (it reads `.criteria` and `.score`; extra fields are ignored).

```tsx
// src/components/shared/landing/components/sample-evaluation.tsx
'use client';

import { motion } from "framer-motion";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreRadarChart } from "@/app/(pitch)/pitch/[id]/_components/charts/radar-chart";
import { getScoreColor } from "@/lib/utils/evaluation-colors";
import { cn } from "@/lib/utils";
import { animations, } from "./constants";
import { sampleEvaluation } from "./sample-data";

const SampleEvaluation = () => {
  const detailed = sampleEvaluation.categories.slice(0, 2);

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
          className="grid gap-4 lg:grid-cols-2"
        >
          {/* Overall + radar */}
          <motion.div variants={animations.fadeIn}>
            <div className="gradient-shell h-full">
              <div className="gradient-shell-inner h-full p-8 flex flex-col items-center gap-6">
                <ScoreRing score={sampleEvaluation.overallScore} size="xl" />
                <ScoreRadarChart data={sampleEvaluation.categories} />
              </div>
            </div>
          </motion.div>

          {/* Detailed criteria cards */}
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
```

- [ ] **Step 2: Verify build is clean**

Run: `npm run build`
Expected: Compiles with no errors. (The `import { animations, }` trailing comma is valid; if your linter objects, remove the trailing comma.)

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/landing/components/sample-evaluation.tsx
git commit -m "add sample evaluation section"
```

---

### Task 6: Wire the section into the page

**Files:**
- Modify: `src/components/shared/landing/landing-page.tsx`

- [ ] **Step 1: Add the import**

Find:
```tsx
import CTA from "./components/cta";
```
Add immediately above it:
```tsx
import SampleEvaluation from "./components/sample-evaluation";
```

- [ ] **Step 2: Render it between HowItWorks and CTA**

Find:
```tsx
                <Hero />
                <Features />
                <HowItWorks />
                <CTA />
```
Replace with:
```tsx
                <Hero />
                <Features />
                <HowItWorks />
                <SampleEvaluation />
                <CTA />
```

- [ ] **Step 3: Verify build is clean**

Run: `npm run build`
Expected: Compiles with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/landing/landing-page.tsx
git commit -m "add sample evaluation to landing page"
```

---

### Task 7: Token cleanup in globals.css + remaining polish

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/shared/landing/components/how-it-works.tsx`
- Modify: `src/components/shared/landing/components/cta.tsx`

- [ ] **Step 1: Source gradient-shell inners from the card token**

In `src/app/globals.css`, find (appears twice — in `.gradient-shell-inner` and `.gradient-shell-sm-inner`):
```css
        background: #171512;
```
Replace BOTH occurrences with:
```css
        background: hsl(var(--card));
```

- [ ] **Step 2: Source gradient-shell borders from the foreground token**

In `.gradient-shell`, find:
```css
        background: linear-gradient(
            to right bottom,
            rgba(242, 234, 211, 0.28),
            rgba(242, 234, 211, 0.06),
            rgba(0, 0, 0, 0)
        );
```
Replace with:
```css
        background: linear-gradient(
            to right bottom,
            hsl(var(--foreground) / 0.28),
            hsl(var(--foreground) / 0.06),
            transparent
        );
```

In `.gradient-shell-sm`, find:
```css
        background: linear-gradient(
            to right bottom,
            rgba(242, 234, 211, 0.22),
            rgba(242, 234, 211, 0.04),
            rgba(0, 0, 0, 0)
        );
```
Replace with:
```css
        background: linear-gradient(
            to right bottom,
            hsl(var(--foreground) / 0.22),
            hsl(var(--foreground) / 0.04),
            transparent
        );
```

- [ ] **Step 3: Mono the how-it-works step numbers**

In `src/components/shared/landing/components/how-it-works.tsx`, find:
```tsx
                                    className="flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold tracking-wide"
```
Replace with:
```tsx
                                    className="flex h-16 w-16 items-center justify-center rounded-full font-mono text-sm font-bold tracking-wide"
```

- [ ] **Step 4: Token the CTA button text color**

In `src/components/shared/landing/components/cta.tsx`, find:
```tsx
                                style={{ background: "var(--landing-cream)", color: "#0e0d0c" }}
```
Replace with:
```tsx
                                style={{ background: "var(--landing-cream)", color: "hsl(var(--background))" }}
```

- [ ] **Step 5: Verify build is clean**

Run: `npm run build`
Expected: Compiles with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/shared/landing/components/how-it-works.tsx src/components/shared/landing/components/cta.tsx
git commit -m "token cleanup and mono polish on landing"
```

---

### Task 8: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Sweep for remaining cool colors in the landing folder**

Use the Grep tool (or rg) for this pattern across `src/components/shared/landing`:
`(text|bg|border|fill|stroke)-(green|blue|red|amber|emerald|sky|indigo|cyan|teal|violet|purple)-\d|#4ade80|#f87171`
Expected: **No matches.** (The hero badge dot and the deleted screenshot dot were the only cool accents; both are gone.) If anything remains, warm it (olive `--score-high` / gold `--gold` / rust `--score-low`) and amend the relevant commit's follow-up.

- [ ] **Step 2: Hero button text token (CTA in hero, not just the CTA section)**

In `src/components/shared/landing/components/hero.tsx`, confirm the primary CTA still reads:
```tsx
                            style={{ background: "var(--landing-cream)", color: "#0e0d0c" }}
```
If present, replace `color: "#0e0d0c"` with `color: "hsl(var(--background))"` and commit:
```bash
git add src/components/shared/landing/components/hero.tsx
git commit -m "token the hero cta text color"
```
(If it was already changed, skip.)

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing suite + the 2 new sample-data tests + 1 new verdict-card test).

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: Clean build, `/` route present.

- [ ] **Step 5: Manual smoke (dev server)**

Run: `npm run dev`, open `http://localhost:3000/` while signed out. Confirm:
- Hero shows the verdict card; the score ring number animates up and the score bars fill in.
- No cool green/blue/red anywhere; accents are gold/olive/rust/cream.
- Stats values render in mono.
- Scrolling to "A real evaluation" reveals the radar + overall ring + two criteria cards (warm score chips).
- How-it-works step numbers are mono.
- Layout holds at mobile and desktop widths.
- Signed-in users still get redirected to `/dashboard` (unchanged behavior).

- [ ] **Step 6: Final commit if any verification fixes were made** (otherwise nothing to do)

---

## Self-Review Notes

- **Spec coverage:** Hero verdict card (Tasks 2–4) ✓; sample-evaluation section (Tasks 5–6) ✓; warm-tune cool accents + hardcoded hexes (Tasks 4, 7) ✓; mono on data values (Tasks 4, 7) ✓; tasteful motion — ring count-up + bar fill + reveals (Tasks 2–5) ✓; reuse real primitives via shared `sample-data` (Tasks 1, 3, 5) ✓; tests — sample-data shape + verdict-card smoke (Tasks 1, 3) ✓; non-goals respected (no copy overhaul, no new routes/auth, no testimonials/FAQ) ✓.
- **Hover-lift motion** (spec §Motion) is intentionally folded into existing card styling and left light; if desired, a `hover:-translate-y-0.5 transition-transform` can be added to the gradient-shell wrappers during implementation — optional, not required for sign-off.
- **Type consistency:** `sampleEvaluation.categories` items satisfy both `ScoreRadarChart`'s `{criteria, score}` prop and the verdict-card/criteria-card reads (`summary`/`strength`/`improvement`). `ScoreRing` `score:number`, `size:"xl"` match usage. `getScoreColor(number)` and `getScoreTier(number)` signatures match.
- **No placeholders:** every code step contains full content.
