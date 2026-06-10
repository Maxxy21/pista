# Pitch Detail Redesign Implementation Plan (Phase 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Redesign the pitch-detail page into a warm, score-first narrative: verdict hero (ScoreRing + revived radar) → summary → detailed analysis → transcript/questions as reference, with all score colors warm-tuned via one centralized helper.

**Architecture:** Presentation-only. `page.tsx` still queries `getPitch` and branches structured/legacy. Warm the pure color helpers once (`evaluation-colors.ts`) and every analysis component inherits it. No data/query/export changes.

**Tech Stack:** Next.js 15, Tailwind 3, shadcn/Radix, recharts, framer-motion, Vitest. Reuses Phase 1 tokens + Phase 2 `ScoreRing`/`getScoreTier`.

**Spec:** `docs/superpowers/specs/2026-06-10-pitch-detail-redesign-design.md`

**Commit convention:** short lowercase subject, NO AI co-author trailer. Never stage `package-lock.json`. `CLAUDE.md` is gitignored — never add it.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/lib/utils/evaluation-colors.ts` | central warm color helpers (+ impact/priority) | Rewrite |
| `src/lib/utils/__tests__/evaluation-colors.test.ts` | helper tests | Create |
| `src/app/(pitch)/pitch/[id]/_components/utils.ts` | re-export warm getScoreColor | Modify |
| `src/components/ui/score-ring.tsx` | add `xl` size | Modify |
| `src/components/ui/__tests__/score-ring.test.tsx` | xl assertion | Modify |
| `.../[id]/_components/charts/radar-chart.tsx` | warm, chart-only | Modify |
| `.../[id]/_components/charts/score-bar-chart.tsx` | dead after | Delete |
| `.../[id]/_components/sections/score-overview.tsx` | verdict hero | Rewrite |
| `.../[id]/page.tsx` | reorder sections | Modify |
| `.../[id]/_components/sections/pitch-header.tsx` | Fraunces title | Modify |
| `.../[id]/_components/analysis/structured-evaluation-summary.tsx` | editorial pass | Modify |
| `.../[id]/_components/analysis/structured-detailed-analysis.tsx` | editorial pass + import helpers | Modify |
| `.../[id]/_components/analysis/evaluation-summary.tsx` | light pass | Modify |
| `.../[id]/_components/analysis/detailed-analysis.tsx` | light pass | Modify |

---

## Task 1: Centralized warm color helpers

**Files:** Rewrite `src/lib/utils/evaluation-colors.ts`; Modify `_components/utils.ts`; Create test.

- [ ] **Step 1: Write the failing test** — `src/lib/utils/__tests__/evaluation-colors.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  getScoreColor, getSeverityColor, getViabilityColor,
  getExecutionColor, getImpactColor, getPriorityColor,
} from "@/lib/utils/evaluation-colors";

describe("warm evaluation colors", () => {
  it("scores map to warm tiers", () => {
    expect(getScoreColor(9)).toContain("--score-high");
    expect(getScoreColor(6)).toContain("--score-mid");
    expect(getScoreColor(3)).toContain("--score-low");
  });
  it("severity: High is rust(low), Low is olive(high)", () => {
    expect(getSeverityColor("High")).toContain("--score-low");
    expect(getSeverityColor("Low")).toContain("--score-high");
  });
  it("viability/execution/impact/priority", () => {
    expect(getViabilityColor("Strong")).toContain("--score-high");
    expect(getViabilityColor("Weak")).toContain("--score-low");
    expect(getExecutionColor("Poor")).toContain("--score-low");
    expect(getImpactColor("High")).toContain("--score-high");
    expect(getPriorityColor("Critical")).toContain("--score-low");
  });
  it("unknown values fall back to muted (no score token)", () => {
    expect(getViabilityColor("Not Applicable")).not.toContain("--score-");
  });
});
```

- [ ] **Step 2: Run, confirm fail** — `npx vitest run src/lib/utils/__tests__/evaluation-colors.test.ts` → FAIL (current helpers return cool classes).

- [ ] **Step 3: Rewrite `src/lib/utils/evaluation-colors.ts` entirely:**

```ts
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
```

- [ ] **Step 4: Delegate `_components/utils.ts` getScoreColor** — replace the local `getScoreColor` function (lines defining it) with a re-export; keep `cn` and `copyToClipboard` and the `toast` import:

Replace:
```ts
export const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (score >= 6) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (score >= 4) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
};
```
with:
```ts
export { getScoreColor } from "@/lib/utils/evaluation-colors";
```

- [ ] **Step 5: Run, confirm pass** — `npx vitest run src/lib/utils/__tests__/evaluation-colors.test.ts` → PASS.

- [ ] **Step 6: Build** — `npm run build` → succeeds.

- [ ] **Step 7: Commit**
```bash
git add src/lib/utils/evaluation-colors.ts src/lib/utils/__tests__/evaluation-colors.test.ts "src/app/(pitch)/pitch/[id]/_components/utils.ts"
git commit -m "warm-tune evaluation color helpers"
```

---

## Task 2: ScoreRing `xl` size

**Files:** Modify `src/components/ui/score-ring.tsx` and its test.

- [ ] **Step 1: Add `xl` to the size maps and prop union.** In `score-ring.tsx`:
  - Change `size?: "sm" | "md" | "lg";` → `size?: "sm" | "md" | "lg" | "xl";`
  - `const PX = { sm: 34, md: 44, lg: 56 } as const;` → `const PX = { sm: 34, md: 44, lg: 56, xl: 96 } as const;`
  - `const FONT = { sm: 12, md: 15, lg: 19 } as const;` → `const FONT = { sm: 12, md: 15, lg: 19, xl: 34 } as const;`

- [ ] **Step 2: Add an xl assertion** to `src/components/ui/__tests__/score-ring.test.tsx` (inside the existing `describe`):

```tsx
  it("renders at xl size", () => {
    const { getByText } = render(<ScoreRing score={8} size="xl" />);
    expect(getByText("8.0")).toBeTruthy();
  });
```

- [ ] **Step 3: Run** — `npx vitest run src/components/ui/__tests__/score-ring.test.tsx` → PASS (3 tests).

- [ ] **Step 4: Commit**
```bash
git add src/components/ui/score-ring.tsx src/components/ui/__tests__/score-ring.test.tsx
git commit -m "add xl score ring size"
```

---

## Task 3: Warm + embeddable radar chart

**Files:** Modify `_components/charts/radar-chart.tsx`. The radar becomes chart-only (no Card wrapper) so `ScoreOverview` composes it.

- [ ] **Step 1: Replace the component's return + chartConfig** so it returns just the animated chart (drop the `Card/CardHeader/CardTitle/CardDescription` wrapper and their imports). Replace the whole file body below the imports/interface with:

```tsx
export const ScoreRadarChart = ({ data }: RadarChartProps) => {
  const [chartData, setChartData] = useState<RadarChartData[]>([]);

  useEffect(() => {
    setChartData(data.map((item) => ({ category: item.criteria, score: 0 })));
    const timer = setTimeout(() => {
      setChartData(data.map((item) => ({ category: item.criteria, score: item.score })));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const chartConfig: ChartConfig = {
    score: { label: "Score", color: "hsl(var(--gold))" },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
        <RadarChart data={chartData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", textAnchor: "middle" }}
          />
          <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.4} />
          <Radar
            dataKey="score"
            fill="var(--color-score)"
            fillOpacity={0.25}
            stroke="var(--color-score)"
            strokeWidth={2}
            animationDuration={1000}
            animationEasing="ease-out"
            isAnimationActive
          />
        </RadarChart>
      </ChartContainer>
    </motion.div>
  );
};
```

- [ ] **Step 2: Remove now-unused imports** at the top of the file: the `Card, CardContent, CardDescription, CardHeader, CardTitle` import line. Keep `useEffect/useState`, recharts imports, `motion`, and the `ChartConfig/ChartContainer/ChartTooltip/ChartTooltipContent` imports, and the `RadarChartData`/`RadarChartProps` interfaces.

- [ ] **Step 3: Build** — `npm run build` → succeeds (note: this file isn't rendered anywhere yet until Task 4 wires it; build still type-checks it).

- [ ] **Step 4: Commit**
```bash
git add "src/app/(pitch)/pitch/[id]/_components/charts/radar-chart.tsx"
git commit -m "warm radar chart, make it embeddable"
```

---

## Task 4: Rebuild `ScoreOverview` as the verdict hero

**Files:** Rewrite `_components/sections/score-overview.tsx`.

- [ ] **Step 1: Replace the entire file with:**

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreRadarChart } from "../charts/radar-chart";
import { UniversalPitchData } from "@/lib/types/pitch";
import { getEvaluations } from "@/lib/utils/evaluation-utils";
import { getScoreTier, type ScoreTier } from "@/lib/utils/score";

interface ScoreOverviewProps {
  data: UniversalPitchData;
}

const getScoreDescription = (score: number) => {
  if (score >= 8) return "Strong pitch. Ready to present to investors.";
  if (score >= 6) return "Solid pitch with a few areas to sharpen.";
  if (score >= 4) return "Promising concept, but needs meaningful refinement.";
  return "Needs significant work before presenting to investors.";
};

const TIER_BAR: Record<ScoreTier, string> = {
  high: "bg-[hsl(var(--score-high))]",
  mid: "bg-[hsl(var(--score-mid))]",
  low: "bg-[hsl(var(--score-low))]",
};

export const ScoreOverview = ({ data }: ScoreOverviewProps) => {
  const evaluations = getEvaluations(data.evaluation);
  const overallScore = data.evaluation.overallScore;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <ScoreRing score={overallScore} size="xl" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              Overall assessment
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold leading-tight">
              {getScoreDescription(overallScore)}
            </h2>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
            Category breakdown
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="w-full max-w-[220px]">
              <ScoreRadarChart data={evaluations} />
            </div>
            <div className="flex-1 space-y-2.5 w-full">
              {evaluations.map(({ criteria, score }) => (
                <div key={criteria} className="flex items-center gap-3 text-xs">
                  <span className="flex-1 text-muted-foreground">{criteria}</span>
                  <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <span
                      className={`block h-full rounded-full ${TIER_BAR[getScoreTier(score)]}`}
                      style={{ width: `${Math.min(score * 10, 100)}%` }}
                    />
                  </span>
                  <span className="w-7 text-right font-mono">{score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

- [ ] **Step 2: Build** — `npm run build` → succeeds.

- [ ] **Step 3: Commit**
```bash
git add "src/app/(pitch)/pitch/[id]/_components/sections/score-overview.tsx"
git commit -m "rebuild score overview as verdict hero"
```

---

## Task 5: Delete the dead bar chart

**Files:** Delete `_components/charts/score-bar-chart.tsx`.

- [ ] **Step 1: Confirm it's now unused** — search for importers:

Run (Grep tool or): `git grep -n "score-bar-chart\|ScoreBarChart" -- src`
Expected: no matches (ScoreOverview no longer imports it after Task 4). If there ARE matches outside the file itself, STOP and report — do not delete.

- [ ] **Step 2: Delete**
```bash
git rm "src/app/(pitch)/pitch/[id]/_components/charts/score-bar-chart.tsx"
```

- [ ] **Step 3: Build** — `npm run build` → succeeds.

- [ ] **Step 4: Commit**
```bash
git commit -m "remove dead score bar chart"
```

---

## Task 6: Reorder `page.tsx` + Fraunces page title

**Files:** Modify `_components/sections/pitch-header.tsx` and `page.tsx`.

- [ ] **Step 1: PitchHeader title to Fraunces** — in `pitch-header.tsx`, the `<h1>` (className `"text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors"`) → add `font-display`:
```tsx
                        className="font-display text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors"
```

- [ ] **Step 2: Reorder the page body** — in `page.tsx`, replace the `<div className="container ...">` inner content so the order is: ScoreOverview → summary/detailed (structured|legacy) → transcript+questions (under a "Reference" label) at the bottom. Replace the block from the opening `<div className="container ...">` through its close with:

```tsx
                <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 space-y-8 sm:space-y-10">
                    <Suspense fallback={<ScoreOverviewSkeleton/>}>
                        <ScoreOverview data={data}/>
                    </Suspense>

                    {useStructuredComponents ? (
                        <>
                            <Suspense fallback={<EvaluationSummarySkeleton/>}>
                                <StructuredEvaluationSummary data={data}/>
                            </Suspense>
                            <Suspense fallback={<DetailedAnalysisSkeleton/>}>
                                <StructuredDetailedAnalysis data={data}/>
                            </Suspense>
                        </>
                    ) : (
                        <>
                            <Suspense fallback={<EvaluationSummarySkeleton/>}>
                                <EvaluationSummary data={data}/>
                            </Suspense>
                            <Suspense fallback={<DetailedAnalysisSkeleton/>}>
                                <DetailedAnalysis data={data}/>
                            </Suspense>
                        </>
                    )}

                    <div className="space-y-4 border-t border-border pt-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                            Reference
                        </p>
                        <Suspense fallback={<TranscriptSkeleton/>}>
                            <TranscriptSection data={data}/>
                        </Suspense>
                        <Suspense fallback={<QuestionsSkeleton/>}>
                            <QuestionsSection data={data}/>
                        </Suspense>
                    </div>
                </div>
```

(All the lazy imports + skeletons already exist at the top of the file — unchanged. Only the JSX order changes.)

- [ ] **Step 3: Build** — `npm run build` → succeeds.

- [ ] **Step 4: Commit**
```bash
git add "src/app/(pitch)/pitch/[id]/page.tsx" "src/app/(pitch)/pitch/[id]/_components/sections/pitch-header.tsx"
git commit -m "reorder pitch detail to score-first"
```

---

## Task 7: Structured evaluation summary — editorial pass

**Files:** Modify `_components/analysis/structured-evaluation-summary.tsx`. Data/logic and `CopyButton` unchanged; only classes. (`getViabilityColor/getSeverityColor/getExecutionColor` already warm from Task 1 — no change needed to those call sites.)

- [ ] **Step 1: Fraunces card titles** — every `<CardTitle className="text-base">` → `<CardTitle className="text-base font-display">`. (There are several: Overall Assessment, Investment Thesis, Risk Assessment, Next Steps, Team Assessment, Competitive Position.)

- [ ] **Step 2: Warm the inline marks** — replace:
  - `<span className="text-green-500 shrink-0">✓</span>` → `<span className="text-[hsl(var(--score-high))] shrink-0">✓</span>` (both occurrences — highlights and team strengths)
  - `<span className="text-amber-500 shrink-0">!</span>` → `<span className="text-[hsl(var(--score-mid))] shrink-0">!</span>` (both — concerns and experience gaps)
  - `<span className="text-red-400 shrink-0">×</span>` → `<span className="text-[hsl(var(--score-low))] shrink-0">×</span>` (weaknesses)

- [ ] **Step 3: Mono risk score** — the risk-score badge `<Badge variant="outline" className="text-xs">{feedback.riskAssessment.riskScore}/10</Badge>` → add `font-mono`: `className="text-xs font-mono"`.

- [ ] **Step 4: Build** — `npm run build` → succeeds.

- [ ] **Step 5: Commit**
```bash
git add "src/app/(pitch)/pitch/[id]/_components/analysis/structured-evaluation-summary.tsx"
git commit -m "editorial pass on structured summary"
```

---

## Task 8: Structured detailed analysis — editorial pass + shared helpers

**Files:** Modify `_components/analysis/structured-detailed-analysis.tsx`.

- [ ] **Step 1: Import warm impact/priority helpers; delete the local cool ones.** Remove the local `getImpactColor` and `getPriorityColor` function definitions (the two `const get...Color = (… ) => { switch … }` blocks near the top). Add to the imports:
```tsx
import { getImpactColor, getPriorityColor } from "@/lib/utils/evaluation-colors";
```
(`getScoreColor` continues to come from `../utils`, now warm.)

- [ ] **Step 2: Fraunces heading + mono scores** —
  - `<h2 className="text-xl font-bold mb-4">Detailed Analysis</h2>` → `<h2 className="font-display text-xl font-semibold mb-4">Detailed Analysis</h2>`
  - The criterion score `<Badge className={cn(getScoreColor(evaluation.score))}>` → add `font-mono`: `<Badge className={cn("font-mono", getScoreColor(evaluation.score))}>`
  - The aspect score span `className={cn("px-2 py-0.5 rounded text-xs", getScoreColor(aspect.score))}` → add `font-mono`: `cn("px-2 py-0.5 rounded text-xs font-mono", getScoreColor(aspect.score))`

- [ ] **Step 3: Warm the section-heading icons** —
  - `<CheckCircle2 className="h-4 w-4 text-green-500" />` → `text-[hsl(var(--score-high))]`
  - `<AlertCircle className="h-4 w-4 text-amber-500" />` → `text-[hsl(var(--score-mid))]`

- [ ] **Step 4: Build** — `npm run build` → succeeds (no unused-import errors from removing the local helpers).

- [ ] **Step 5: Commit**
```bash
git add "src/app/(pitch)/pitch/[id]/_components/analysis/structured-detailed-analysis.tsx"
git commit -m "editorial pass on structured analysis"
```

---

## Task 9: Legacy summary + detailed — light pass

**Files:** Modify `_components/analysis/evaluation-summary.tsx` and `detailed-analysis.tsx`. They already use the warm `getScoreColor` via `../utils`; this is headings + inline marks.

- [ ] **Step 1: `evaluation-summary.tsx`** — `<CardTitle>Evaluation Summary</CardTitle>` → `<CardTitle className="font-display">Evaluation Summary</CardTitle>`.

- [ ] **Step 2: `detailed-analysis.tsx`** —
  - `<h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>` → `<h2 className="font-display text-2xl font-semibold mb-6">Detailed Analysis</h2>`
  - `<CardTitle className="text-lg">{evaluation.criteria}</CardTitle>` → add `font-display`.
  - score `<Badge className={cn(getScoreColor(evaluation.score))}>` → add `font-mono`.
  - In `StrengthsList`: `<span className="text-green-500 flex-shrink-0">✓</span>` → `text-[hsl(var(--score-high))]`.
  - In `ImprovementsList`: `<span className="text-amber-500 flex-shrink-0">→</span>` → `text-[hsl(var(--score-mid))]`.

- [ ] **Step 3: Build** — `npm run build` → succeeds.

- [ ] **Step 4: Commit**
```bash
git add "src/app/(pitch)/pitch/[id]/_components/analysis/evaluation-summary.tsx" "src/app/(pitch)/pitch/[id]/_components/analysis/detailed-analysis.tsx"
git commit -m "light warm pass on legacy analysis"
```

---

## Task 10: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full build** — `npm run build` → clean.
- [ ] **Step 2: Full tests** — `npx vitest run` → all pass (evaluation-colors, score-ring incl. xl, plus prior).
- [ ] **Step 3: Grep for leftover cool classes in the pitch surface** — using the Grep tool over `src/app/(pitch)` and `src/lib/utils/evaluation-colors.ts`, search `text-green-500|text-amber-500|text-red-400|green-100|blue-100|yellow-100|red-100|score-bar-chart`. Expect no matches (the legacy `formatComment`/sonner code is unaffected). Investigate any hit.
- [ ] **Step 4: Visual smoke** — `npm run dev`, open a pitch detail (`/pitch/<id>`): verdict hero (xl ring + radar + warm breakdown) at top, then summary, detailed analysis, then transcript/questions collapsible at the bottom under "Reference". All chips warm (olive/gold/rust). Title edit + copy buttons work. If you have both a structured and a legacy pitch, check both render.
- [ ] **Step 5: Commit any smoke fixes** — `git commit -am "polish pitch detail visuals"` (only if needed).

---

## Self-Review

**Spec coverage:**
- Reorder to score-first → Task 6. ✓
- Centralize + warm-tune all helpers (score/severity/viability/execution/impact/priority + inline marks) → Tasks 1, 7, 8, 9. ✓
- Verdict hero (ScoreRing xl + verdict + radar + breakdown) → Tasks 2, 3, 4. ✓
- Revive radar, delete bar chart → Tasks 3, 5. ✓
- Structured editorial; legacy light → Tasks 7–9. ✓
- PitchHeader Fraunces; transcript/questions to bottom as reference → Task 6. ✓
- Verification → Task 10. ✓

Non-goals respected: no Convex/query/branching/export changes; sidebar untouched.

**Placeholder scan:** none; code/edits are concrete.

**Type consistency:** `ScoreTier` reused in `evaluation-colors.ts` (CHIP), `score-ring.tsx` (xl added to both `PX`/`FONT` and the prop union), and `score-overview.tsx` (`TIER_BAR`). `getImpactColor`/`getPriorityColor` now exported from `evaluation-colors.ts` and imported by `structured-detailed-analysis.tsx` (local copies removed). `ScoreRadarChart` becomes card-less and is wrapped by `ScoreOverview`; it is its only consumer.

**Note for executor:** After Task 4, `ScoreRadarChart` is rendered only inside `ScoreOverview`; after Task 5, `score-bar-chart.tsx` is gone. The dashboard's `ScoreBadge`/`score-badge.tsx` is a different component on a different surface — do NOT touch it here.
