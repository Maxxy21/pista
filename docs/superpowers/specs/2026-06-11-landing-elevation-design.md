# Landing Elevation — Design Spec (Phase 4)

**Date:** 2026-06-11
**Status:** Approved (direction), pending spec review
**Depends on:** Phase 1 foundation (warm tokens, Fraunces/Hanken/JetBrains Mono, `--gold`, `--score-high/mid/low`), Phase 2 (`ScoreRing`, `getScoreTier`), Phase 3 (`ScoreRadarChart` warm + embeddable) — all on `main`.

## Context

Phase 4 elevates the public **landing page** (`src/components/shared/landing/`, rendered at `/` via `src/app/page.tsx`). It's the product's first impression and the last unredesigned high-traffic surface besides auth and the create flow.

Current state (better than expected): the landing already aliases the warm system. `globals.css` maps `--landing-*` tokens onto the core tokens (`--background`, `--foreground`, `--card`, `--border`, `--muted-foreground`), `font-display` is Fraunces, and the `gradient-shell` cards are warm-cream. Structure: `Header → Hero → Features → HowItWorks → CTA → Footer`.

So this is **elevation + consistency polish**, not a rebuild. Remaining gaps:
1. **Static hero centerpiece** — a browser-chrome dashboard screenshot (`/img.png`); tells rather than shows, and isn't built from product primitives.
2. **Leftover cool accents** — `#4ade80` green pulse dots (hero badge + browser-mockup status dot).
3. **Hardcoded hexes** bypassing tokens — `#0e0d0c` (button text), `#F2EAD3` (ambient glow), `#171512` and `rgba(242,234,211,…)` (gradient-shell utilities in `globals.css`).
4. **No mono treatment** — stats values and step numbers use `font-display`, not the product's JetBrains Mono data convention.
5. **No proof of depth** — nothing shows what a real evaluation looks like.

## Approved direction

Elevate, reusing the **real product primitives** so the landing literally shows the product:
- **Hero centerpiece → live verdict card** (chosen option B): animated `ScoreRing` + Fraunces verdict + warm score bars, replacing the static screenshot.
- **New section: Sample evaluation deep-dive** — a real scored pitch (`ScoreRadarChart` + `ScoreRing` + detailed criteria cards) between How-it-works and CTA.
- **Motion: tasteful & purposeful** — ring count-up, bars fill on scroll-into-view, gentle hover lifts, existing staggered reveals. No parallax/magnetic/cursor-follow.
- **Warm-tune pass** — kill cool dots, map hardcoded hexes to tokens, apply mono to data values.

### Why reuse real primitives (approach)

The hero verdict card and sample-evaluation section are built from the actual app components — `ScoreRing` (`@/components/ui/score-ring`), `ScoreRadarChart` (`@/app/(pitch)/pitch/[id]/_components/charts/radar-chart`), and the warm `--score-*` bar pattern — fed hardcoded sample data. This guarantees the landing and the product stay visually identical, and is DRY. The rejected alternative (landing-local mockups) would drift from the real components over time. `ScoreRadarChart` only depends on recharts + the shared chart UI, so importing it on the landing is acceptable; if its location becomes awkward later, promoting it to `@/components/ui` is a separate, out-of-scope change.

## Goals

1. Rebuild the **Hero** centerpiece as a live verdict card from product primitives, keeping headline/subhead/CTAs/stats.
2. Add a **Sample evaluation** section that demonstrates real analysis depth.
3. **Warm-tune** the last cool accents and token-bypassing hexes; apply **mono** to data values.
4. Add a **tasteful motion layer** (count-up, fill-on-view, hover lift) consistent with "interactive but simple."
5. Keep Features / How-it-works / CTA / Footer structure and copy; polish + token cleanup only.

### Non-goals

- No copy overhaul of feature/step content (text in `constants.ts` stays).
- No new routes, no auth changes, no Convex/data changes (sample data is hardcoded, client-only).
- No testimonials/social-proof, no FAQ (explicitly cut).
- No promotion/relocation of `ScoreRadarChart` or other shared-component refactors.
- The `/img.png` asset stays in the repo (used elsewhere / harmless); the hero just stops importing it.

## Architecture / Data Flow

All landing components are client (`'use client'`) and presentational. No server data. New pieces:

- **`landing/components/sample-data.ts`** — single hardcoded sample evaluation: `overallScore`, a `verdict` line, and an array of category criteria `{ criteria, score, summary, strength, improvement }`. Consumed by BOTH the hero verdict card and the sample-evaluation section so they tell one consistent story.
- **`landing/components/verdict-card.tsx`** — the hero centerpiece extracted into its own component: `ScoreRing` (xl) with count-up, Fraunces verdict, warm score bars, mono meta row.
- **`landing/components/sample-evaluation.tsx`** — the new section: `ScoreRadarChart` + overall `ScoreRing` on one side, two detailed criteria cards (gradient-shell-sm) on the other.

Reused as-is: `ScoreRing`, `ScoreRadarChart`, `getScoreTier` (for warm bar tier colors), the warm `--score-*` classes.

`landing-page.tsx` gains `SampleEvaluation` in the `<main>` sequence: `Hero → Features → HowItWorks → SampleEvaluation → CTA → Footer`.

## Components

### Hero (`hero.tsx`) — rebuild centerpiece
- Remove the browser-chrome block (`<Image src="/img.png">`, browser bar, both status dots).
- Render `<VerdictCard />` inside the existing `gradient-shell` / motion wrapper, preserving the entrance animation.
- Keep badge, headline, subhead, CTAs, stats row.
- Warm-tune: hero badge pulse dot `#4ade80` → `hsl(var(--score-high))` (olive) or `hsl(var(--gold))`; CTA button text `#0e0d0c` → keep a near-ink but source from a token (`hsl(var(--background))`); ambient glow `#F2EAD3` → cream via `hsl(var(--foreground))`.
- Stats values → `font-mono`.

### `VerdictCard` (new) — `verdict-card.tsx`
- `ScoreRing` size `xl`, score from `sample-data` (olive tier), number counts up on mount (framer-motion `animate` on a motion value, or a small count-up hook).
- Fraunces verdict line (`font-display`) from `sample-data.verdict`.
- Warm score bars: for each category, a track (`bg-muted`/warm) + fill colored by `getScoreTier` (`--score-high/mid/low`), animating width from 0 → `score*10%` on mount/in-view.
- Mono meta row (e.g., `EVALUATED IN 47S`) in `font-mono`, muted.

### `SampleEvaluation` (new) — `sample-evaluation.tsx`
- Section shell matching siblings (`py-24 lg:py-32`, top border, centered label + Fraunces heading + subhead).
- Left card (gradient-shell): overall `ScoreRing` + `ScoreRadarChart` fed the sample categories.
- Right: two detailed criteria cards (gradient-shell-sm) — criteria name (Fraunces), warm score chip (`getScoreColor` from `@/lib/utils/evaluation-colors`), mono score, one-line summary, one strength (olive ✓) + one improvement (gold →).
- Scroll-reveal via `whileInView`; bars/ring animate in.

### Warm-tune in `globals.css`
- `.gradient-shell-inner` / `.gradient-shell-sm-inner` background `#171512` → `hsl(var(--card))`.
- `gradient-shell` gradient `rgba(242,234,211,…)` → `hsl(var(--foreground) / …)` equivalents. Keep visual result essentially the same; goal is token sourcing, not a look change.

### Features / HowItWorks / CTA / Footer — light polish
- Confirm no cool colors remain. HowItWorks step numbers `01/02/03` → `font-mono`. CTA/Footer: swap any hardcoded `#0e0d0c`/cream literals for tokens. No structural/copy change.

## Motion layer (tasteful)

- **Count-up:** verdict-card + sample-evaluation `ScoreRing` numbers animate to value on mount/in-view.
- **Bar fill:** score bars animate width 0 → target on in-view.
- **Hover lift:** feature cards, criteria cards, verdict card get a subtle `translateY(-2px)` + border warm on hover.
- Keep existing `staggerChildren` / `fadeIn` reveals. Explicitly NO parallax, magnetic buttons, or cursor-follow glows.

## Testing / Verification

- **Unit (Vitest):** a minimal render smoke for `VerdictCard` (renders the sample overall score and verdict text) and a shape assertion on `sample-data` (overallScore is a number, categories non-empty). Keep light — landing is presentational.
- **Build:** `npm run build` clean (watch unused imports after removing the screenshot block).
- **Manual smoke:** load `/` — hero shows the verdict card with ring counting up and bars filling; no cool green/blue anywhere; sample-evaluation section renders radar + criteria cards; scroll reveals fire; responsive at mobile/desktop; redirect-to-dashboard-when-signed-in behavior unchanged.
- Full `npx vitest run` stays green.

## Open Questions / Deferred

- Exact sample numbers/copy in `sample-data.ts` — pick believable values (overall ~8.4, mixed category scores incl. one rust-tier) at implementation; easy to tune.
- Count-up implementation (framer-motion `useMotionValue`/`animate` vs. a tiny `useCountUp` hook) — left to implementation; prefer framer-motion since it's already a dependency.
- Promoting `ScoreRadarChart` to `@/components/ui` for cleaner imports — deferred (out of scope).
