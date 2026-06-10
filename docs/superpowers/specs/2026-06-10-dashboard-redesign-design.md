# Dashboard Redesign — Design Spec (Phase 2)

**Date:** 2026-06-10
**Status:** Approved (direction), pending spec review
**Depends on:** Phase 1 design-system foundation (warm-editorial tokens, Fraunces/Hanken/JetBrains Mono, `--gold`, `--score-high/mid/low`, gold button variant) — already on `main`.

## Context

Phase 2 redesigns the **dashboard** — the main product screen — on top of the Phase 1 foundation. Phase 1 only re-skinned via tokens; the dashboard's *composition* is still the generic stack it always was.

Current structure (top → bottom):
- **Navbar** (`navigation/navbar.tsx`, global, set in `dashboard-layout-client.tsx`) — title "Dashboard" + search.
- **DashboardTabs** (`_components/dashboard-tabs.tsx`) — All Pitches / Recent / Favorites / New (the "New" tab renders `NewPitchPanel` inline).
- **DashboardStats** (`_components/stats.tsx`) — 4 cards.
- **PitchFilters** (`_components/pitch-filters.tsx`) — score filter, sort, view toggle, New-pitch button (+ mobile filter sheet).
- **Pitch grid** (`_components/grids/*`) — `PitchCard` repeated (grid + virtualized variants), plus list view mode.

Problems this fixes:
1. **Two stacked control rows** (DashboardTabs row + PitchFilters row) with redundant chrome.
2. **Fake data smell** — `stats.tsx` hardcodes a `"+14%"` growth and uses cool `text-green-500/red-500/gray-500` trend colors.
3. **Generic cards** — plain shadcn cards with a small score badge.
4. **Dead code** — `_components/dashboard-header.tsx` is defined but imported nowhere.

## Approved direction (from visual mockup)

- **One consolidated dashboard toolbar** merging tabs + filters into a single row.
- **Editorial stats strip** — one hairline-divided row, mono numbers, Average Score as a gold **score ring**, honest deltas (no fake growth).
- **Redesigned pitch cards** — Fraunces title, mono metadata, a warm **score ring** (olive/gold/rust by tier) replacing the badge, favorite star, hover lift.

## Goals

1. Replace the badge with a reusable **`ScoreRing`** primitive (used in cards + stats), colored by score tier.
2. Redesign **`PitchCard`** (grid + list) to the editorial style; keep all props/behavior (favorite, actions, click-through).
3. Redesign **`DashboardStats`** into the hairline strip; remove the fake "+14%" and cool trend colors; keep the same Convex query/data.
4. **Consolidate** `DashboardTabs` + `PitchFilters` into one **`DashboardToolbar`** row; preserve every control and the mobile filter sheet.
5. Light, token-driven warm restyle of the **Navbar** (conservative — it's shared).
6. Remove dead `dashboard-header.tsx`.

### Non-goals

- No changes to Convex queries, data hooks (`use-dashboard-state/query`), routing/URL params, virtualization logic, or the new-pitch flow internals (Phase 4).
- No pitch-detail, auth, or landing changes.
- No new filtering/sorting capabilities — same options, restyled.

## Data reality (important)

`PitchCard` today receives only: `title, text, authorName, createdAt, isFavorite, score` (+ ids). There is **no industry/category field** — the schema's `type` is the *input method* (`text` | `audio` | `textFile`), and `toPitchCardProps` doesn't currently pass it.

Decision: the card's small eyebrow slot shows the **real input type** as a mono tag — `TEXT` / `AUDIO` (map `textFile` → `TEXT`). This requires threading `pitch.type` through `toPitchCardProps` and adding an optional `type` field to `PitchCardProps`. (If you'd rather drop the eyebrow entirely, that's a one-line change — flagged for spec review.)

## Components

### 1. `ScoreRing` — new primitive
**File:** `src/components/ui/score-ring.tsx` (+ test).
A circular score indicator: a ring bordered in the tier color with the score (mono) centered.
- Props: `{ score: number; size?: "sm" | "md" | "lg"; className?: string }`.
- Tier → color via a new pure helper `getScoreTier(score): "high" | "mid" | "low"` in `src/lib/utils/score.ts`:
  - `score >= 7.5` → `high` (`--score-high`, olive)
  - `score >= 5` → `mid` (`--score-mid`, gold)
  - else → `low` (`--score-low`, rust)
- Ring border uses `border-[hsl(var(--score-<tier>))]`; number in `font-mono`. Sizes map to px (sm 34 / md 44 / lg 56). `score` rendered with `toFixed(1)`.
- A subtle tier-colored glow (`box-shadow`) on md/lg only.

### 2. `PitchCard` redesign
**File:** `src/app/(dashboard)/dashboard/_components/cards/pitch-card.tsx` (modify); `grids/pitch-to-card.ts` (+ `type`); add optional `type` to `PitchCardProps`.
Layout (grid variant):
- Favorite star top-right (uses existing `FavoriteToggleButton`; always visible at low opacity, full on hover — keep `CardActions` on hover).
- Eyebrow: mono input-type tag (`TEXT`/`AUDIO`).
- Title: `font-display` (Fraunces), 2-line clamp.
- Excerpt: muted, 3-line clamp.
- Footer (hairline top border): mono `AUTHOR · RELATIVE-DATE` left; `ScoreRing size="sm"` right (replaces `ScoreBadge`).
- Keep `framer-motion` enter animation; hover lifts (`-translate-y-0.5` + border brighten).
- Preserve `onClick`, `tabIndex`, aria-label, favorite mutation logic exactly.

List view: the existing list `viewMode` keeps working. The card renders in a horizontal arrangement when the grid passes a `variant`/`layout` — to keep scope tight, the **same card** is reused; the grid's existing column logic provides list vs grid. (If the current list mode already just narrows columns, no extra variant is built — confirmed during implementation; do not add a new list component unless the current behavior breaks.)

### 3. `DashboardStats` redesign
**File:** `_components/stats.tsx` (modify).
- Replace the 4 separate `Card`s with one bordered **strip**: `grid grid-cols-2 lg:grid-cols-4`, hairline `divide-x divide-border`, rounded container, `bg-card`.
- Each cell: mono uppercase label (`--muted-foreground`), big **mono** value, optional sub-line.
  - Total pitches — value `totalPitches`; sub-line drops the fake growth (show nothing, or "N analyzed").
  - Average score — `ScoreRing size="md"` with `averageScore`.
  - Best pitch — title (Fraunces, clamped) + `score/10` mono sub-line.
  - Recent — `recentPitches.length`, sub-line "last 7 days".
- Remove `trendColor` (green-500/red-500/gray-500) and the `"+14%"` literal entirely. Keep the Convex `getPitchStats` query and skeleton loading.

### 4. `DashboardToolbar` — consolidation
**File:** new `_components/dashboard-toolbar.tsx`; `dashboard-content.tsx` swaps `<DashboardTabs/>` + `<PitchFilters/>` for `<DashboardToolbar/>`. `dashboard-tabs.tsx` and `pitch-filters.tsx` are absorbed (deleted) — their logic moves into the toolbar.
One row (wraps on mobile):
- **Left:** tab links **All / Recent / Favorites** — text with gold active underline (the visual style from `dashboard-tabs.tsx`, restyled). The old **"New" tab is dropped from the bar** (the gold New button covers creation); `dashboard-content.tsx` keeps handling `viewParam === "new"` so any existing link/route still works.
- **Right:** score-filter button, sort button, grid/list toggle (ghost styling), then the **gold New-pitch button** (`NewPitchButton`, `variant="gold"`).
- **Mobile:** preserve the existing filter **Sheet** (score + sort + clear) from `pitch-filters.tsx`.
- All handlers (`handleTabChange`, `setScoreFilter`, `setSortBy`, `setViewMode`) keep their current signatures; props are passed from `dashboard-content.tsx` (which already holds this state via `useDashboardState`).

### 5. Navbar — light restyle
**File:** `navigation/navbar.tsx` (modify, conservative).
Token-driven warm pass only: title in `font-display`, search field aligned to the card surface, remove any gradient-clip text. No structural/behavior change. (Shared component — keep the diff small.)

### 6. Remove dead code
Delete `_components/dashboard-header.tsx` (unused).

## Architecture / Data Flow

No data-flow change. `dashboard-content.tsx` remains the state owner (via `useDashboardState`/`useDashboardQuery`) and passes props down. The toolbar is presentational. `ScoreRing` is a pure presentational primitive. Grid/virtualization, favorites mutations, empty states, and routing are untouched.

```
dashboard-content.tsx (state: search/view/score/sort/tab + query)
 ├─ DashboardToolbar (tabs + filters + view + New)      [was DashboardTabs + PitchFilters]
 ├─ DashboardStats (Convex getPitchStats) → ScoreRing
 └─ PitchesGrid / VirtualizedPitchesGrid → PitchCard → ScoreRing
```

## Testing / Verification

- **Unit (Vitest):**
  - `getScoreTier` — boundaries 7.5/5.0 map to high/mid/low (+ a 10 and a 0 case).
  - `ScoreRing` — renders the score (toFixed(1)) and the tier color class for high & low.
  - `toPitchCardProps` — maps `type: "textFile"` → card `type: "TEXT"` and `"audio"` → `"AUDIO"`.
- **Build:** `npm run build` clean.
- **Manual smoke:** dashboard renders with warm cards + ring scores; stats strip shows real numbers (no "+14%"); single toolbar with working tabs/filter/sort/view/New; mobile filter sheet opens; favorite + card click still work; empty states unaffected.
- Full `npx vitest run` stays green.

## Open Questions / Deferred

- Eyebrow tag: input type (`TEXT`/`AUDIO`) vs. dropping it — spec defaults to showing input type; easy to drop at review.
- List-view: reuse the same card unless the current list mode visibly breaks; a dedicated row component is deferred (YAGNI) unless needed.
