# Pitch Detail Redesign — Design Spec (Phase 3)

**Date:** 2026-06-10
**Status:** Approved (direction), pending spec review
**Depends on:** Phase 1 foundation (warm tokens, fonts, `--gold`, `--score-high/mid/low`) and Phase 2 (`ScoreRing`, `getScoreTier`) — both on `main`.

## Context

Phase 3 redesigns the **pitch detail / analysis page** (`src/app/(pitch)/pitch/[id]/`) — the product's payoff screen, now that the redesigned dashboard links into it.

Current composition (`page.tsx`, top → bottom):
1. `PitchHeader` (sticky; editable title, back, user menu)
2. **Transcript + Questions** (raw input — shown FIRST)
3. `ScoreOverview` (overall-score number card + bar chart + category list)
4. `StructuredEvaluationSummary` / `StructuredDetailedAnalysis` (or legacy `EvaluationSummary` / `DetailedAnalysis`), branched on `isStructuredEvaluationData`.

Problems:
1. **Backwards narrative** — the raw transcript appears before the score and analysis (the payoff is buried).
2. **Cool colors everywhere** — `_components/utils.ts` `getScoreColor` and `lib/utils/evaluation-colors.ts` (`getScoreColor/getSeverityColor/getViabilityColor/getExecutionColor`) use `green/blue/amber/red-*`; `structured-detailed-analysis.tsx` has local `getImpactColor/getPriorityColor` (cool); `structured-evaluation-summary.tsx` uses inline `text-green-500/amber-500/red-400`; `score-bar-chart.tsx` uses `#4ade80/#f87171`.
3. **Redundant chart** — `radar-chart.tsx` (`ScoreRadarChart`) is **dead code** (imported nowhere); the live one is `score-bar-chart.tsx`. Both are titled "Score Distribution".
4. Generic shadcn cards / no Fraunces or mono treatment; the big overall score is plain text instead of the `ScoreRing` used on the dashboard.

## Approved direction (from mockup)

Score-first narrative + warm editorial:
- **Verdict hero** at top: overall **`ScoreRing`** + one-line Fraunces verdict + a **warm radar** of category scores beside a compact breakdown (mono numbers, olive/gold/rust bars).
- **Evaluation summary** → **Detailed analysis** below.
- **Transcript & Questions** moved to the **bottom** as collapsible reference.
- Revive the radar (warm), remove the redundant bar chart.

## Goals

1. **Reorder** `page.tsx` to: Header → ScoreOverview (verdict hero) → Summary → Detailed analysis → Transcript + Questions.
2. **Centralize + warm-tune** all score/severity/viability/execution/impact/priority colors to the warm tiers (olive `--score-high`, gold `--score-mid`, rust `--score-low`, plus a neutral), reusing `getScoreTier`.
3. Rebuild **`ScoreOverview`** as the verdict hero: `ScoreRing` (overall) + verdict text + warm radar + category breakdown. Covers both structured & legacy (it's shared).
4. **Revive & warm-tune** `ScoreRadarChart`; **delete** the now-dead `score-bar-chart.tsx`.
5. Editorial pass (Fraunces headings, mono scores, warm pills) on **structured** summary + detailed analysis (primary), and a lighter token-driven pass on **legacy** summary + detailed analysis.
6. `PitchHeader` title → Fraunces; light warm pass on Transcript/Questions.

### Non-goals

- No Convex/query/data-shaping changes (`getPitch`, `getEvaluations`, `evaluation-utils`, structured/legacy branching all unchanged).
- No copy/export (`CopyButton`, copy text) behavior changes.
- No edits to the pitch-detail **sidebar** (`pitch-details-sidebar.tsx`) beyond what Phase 1 tokens already give it.
- No new analysis content or AI changes.

## Color strategy (the leverage point)

Create one warm source of truth so most cool colors die at the root. In `lib/utils/evaluation-colors.ts`, rewrite the four exported helpers to return warm token-based classes, and add tier helpers used by the analysis chips:

- Numeric scores → reuse `getScoreTier(score)` (Phase 2): high→olive, mid→gold, low→rust.
- `getScoreColor(score)` (both the `evaluation-colors.ts` one and `_components/utils.ts` one) → warm classes: `text-[hsl(var(--score-<tier>))] bg-[hsl(var(--score-<tier>)/0.12)] border-[hsl(var(--score-<tier>)/0.25)]`. `_components/utils.ts` `getScoreColor` re-exports/delegates to the `evaluation-colors.ts` version to avoid two implementations.
- `getSeverityColor` (High/Medium/Low) → rust / gold / olive.
- `getViabilityColor` (Strong/Moderate/Weak/NA) → olive / gold / rust / muted.
- `getExecutionColor` (Excellent/Good/Fair/Poor) → olive / olive-dim / gold / rust.
- `getImpactColor` (High/Medium/Low) and `getPriorityColor` (Critical/Important/Nice to Have) — move out of `structured-detailed-analysis.tsx` into `evaluation-colors.ts` as warm helpers (critical→rust, important→gold, nice→olive; high-impact→olive, medium→gold, low→muted).
- Inline `text-green-500/amber-500/red-400` (checks/concerns/weakness marks) in `structured-evaluation-summary.tsx` → `text-[hsl(var(--score-high))]` / `text-[hsl(var(--score-mid))]` / `text-[hsl(var(--score-low))]`.

A small Vitest covers the pure helpers (representative input → expected warm token class fragment).

## Components

### `page.tsx` — reorder
Move the `Transcript + Questions` block from the top to the **bottom** (after the analysis sections), under a small "Reference" label. Keep all `Suspense`/lazy boundaries and the `useStructuredComponents` branch; only the JSX order changes. Order: `PitchHeader` → `ScoreOverview` → (structured|legacy summary) → (structured|legacy detailed) → `TranscriptSection` + `QuestionsSection`.

### `ScoreOverview` — verdict hero (rebuild)
**File:** `_components/sections/score-overview.tsx`.
- Left: a **verdict card** — `ScoreRing` (overall, new `xl` size) + `getScoreDescription(overallScore)` as a Fraunces line + a one-sentence summary pulled from existing `getScoreDescription` (kept) / overall feedback summary.
- Right: a **category card** — the warm `ScoreRadarChart` (category shape) + a compact breakdown list (criteria, warm `--score-*` bar, mono score) built from `getEvaluations(data.evaluation)`.
- Remove the `ScoreBarChart` import/usage and the old big-number card.

### `ScoreRing` — add `xl` size
**File:** `src/components/ui/score-ring.tsx` (modify).
Add `xl` to the size maps (`PX.xl = 96`, `FONT.xl = 34`) so the hero ring is large. Existing sizes unchanged; update the size prop union to include `"xl"`. (Its test still passes; add one assertion for xl rendering.)

### `ScoreRadarChart` — revive + warm
**File:** `_components/charts/radar-chart.tsx` (modify), used by `ScoreOverview`.
- Already consumes `--chart-1` (warm post-Phase-1). Tune: gold stroke/fill (`--gold`), warm grid (`--border`), Fraunces-free (chart labels stay sans/mono). Keep the entrance animation.
- Remove the duplicate "Score Distribution" `CardHeader` chrome if it's redundant inside the hero (the hero supplies the label).

### Delete dead chart
**File:** delete `_components/charts/score-bar-chart.tsx` (orphaned once `ScoreOverview` uses the radar). Confirm no other importer first.

### `StructuredEvaluationSummary` — editorial pass
**File:** `_components/analysis/structured-evaluation-summary.tsx`.
Fraunces card titles; warm pills via the updated `getViabilityColor/getSeverityColor/getExecutionColor`; warm inline marks; mono risk score (`riskScore/10`). All data/logic and `CopyButton` unchanged.

### `StructuredDetailedAnalysis` — editorial pass
**File:** `_components/analysis/structured-detailed-analysis.tsx`.
Fraunces "Detailed Analysis" heading; per-criterion score shown via the warm `getScoreColor` badge (NOT a `ScoreRing` — reserve the ring for the hero + category viz to avoid overload); warm `getImpactColor/getPriorityColor` (now imported from `evaluation-colors.ts`); mono aspect scores; warm aspect `Progress`. Data unchanged.

### Legacy `EvaluationSummary` + `DetailedAnalysis` — light pass
**Files:** `_components/analysis/evaluation-summary.tsx`, `detailed-analysis.tsx`.
They consume the shared warm helpers, so warming the helpers covers most. Add Fraunces section headings and confirm no remaining hardcoded cool classes. Keep structure.

### `PitchHeader` + Transcript/Questions — light pass
- `PitchHeader` title `<h1>` → `font-display`.
- `TranscriptSection`/`QuestionsSection`: keep collapsible behavior; ensure warm card styling and a small mono section label; they now render at the page bottom.

## Architecture / Data Flow

No data-flow change. `page.tsx` still queries `getPitch` and branches structured/legacy. All redesigned components are presentational and read the same `UniversalPitchData`. The color helpers are pure functions; warming them propagates to every consumer (dashboard score-badge already uses its own path — unaffected).

## Testing / Verification

- **Unit (Vitest):** `evaluation-colors` helpers — `getScoreColor(9)`/`getSeverityColor("High")`/`getViabilityColor("Strong")`/`getExecutionColor("Poor")` return the expected warm `--score-*` token fragment; `ScoreRing` renders at `xl`.
- **Build:** `npm run build` clean (watch for unused imports after deleting the bar chart and moving impact/priority helpers).
- **Manual smoke:** open a pitch detail — verdict hero (ring + radar) at top, summary, detailed analysis, transcript/questions collapsible at bottom; all score chips warm (olive/gold/rust), no cool green/blue/red; title editing, copy buttons, and structured↔legacy both still render.
- Full `npx vitest run` stays green.

## Open Questions / Deferred

- Whether the verdict hero's one-sentence summary uses `getScoreDescription` (tier-based, always present) or the structured `overallAssessment.summary` (richer but structured-only). Spec default: show `getScoreDescription` as the headline verdict (works for both formats); structured summary text remains in the Evaluation Summary section below. Easy to swap at review.
- Legacy detailed-analysis depth of restyle — default is token/heading-level only (YAGNI), not a full structural rebuild.
