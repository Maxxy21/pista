# Sidebar / Navigation Redesign — Design Spec (Phase 5)

**Date:** 2026-06-12
**Status:** Approved (direction), pending spec review
**Depends on:** Phase 1 foundation (warm tokens, fonts, `--gold`, `--score-high/mid/low`), Phase 2 (`ScoreRing`, `getScoreTier`), Phase 4 (gold primary CTAs convention) — all on `main`.

## Context

Phase 5 redesigns the **navigation chrome** — the two sidebars and their sub-components under `src/components/shared/navigation/`:
- `app-sidebar.tsx` — dashboard sidebar (logo, nav, New Pitch, invite, team switcher).
- `pitch-details-sidebar.tsx` — pitch-detail sidebar (logo, back, search, current-pitch banner, recent pitches, share/export/New Pitch).
- Sub-components: `sidebar-nav.tsx`, `pitch-list-item.tsx`, `pitch-current-banner.tsx`, plus `nav-user-navbar.tsx`, `team-switcher.tsx`, `theme-menu.tsx`, etc.

The shadcn primitive `src/components/ui/sidebar.tsx` is already token-driven and is **not** touched.

Both sidebars are built but carry warm-editorial debt:
1. **Fake logo** — a hand-drawn `div` shape filled with hardcoded `#F2EAD3` is used instead of the real `LogoIcon` (π + score bars). `app-sidebar.tsx` even imports `LogoIcon` but never renders it.
2. **Hardcoded hexes** — `#F2EAD3` (cream) and `#0e0d0c` (ink) on the logo text, "New Pitch" buttons, and the SidebarNav "New" badge, bypassing tokens.
3. **Cream "New Pitch" buttons** — should be gold to match the Phase 4 landing CTAs.
4. **Cool colors** — `renderTypeBadge` uses emerald/blue/purple for Audio/File/Text; favorite states use yellow-500/yellow-400; the loading skeleton uses `bg-gray-200 dark:bg-gray-700`; `pitch-list-item` uses an amber star.
5. **Score never uses `ScoreRing`** — the sidebar shows scores as text/badges while the dashboard, pitch detail, and landing all use the `ScoreRing` primitive.

## Approved direction

Reconcile the chrome to the warm system and elevate the score-bearing elements with `ScoreRing` (chosen option **B** from the mockup). Reuse `LogoIcon`, `ScoreRing`, `getScoreTier`, and the warm tokens. No IA/navigation restructure, no Clerk/org/workspace logic changes.

## Goals

1. Use the real `LogoIcon` + `font-display` wordmark in both sidebars (collapsed = icon only).
2. Gold (`--gold`/`--gold-foreground`) primary buttons ("New Pitch" both footers) and the SidebarNav "New" badge.
3. Pitch list items show a tier-colored `ScoreRing size="sm"`; drop the amber star.
4. Rebuild the current-pitch banner as a ring-led warm card (md `ScoreRing` + title + date + neutral type pill + author row); warm the contextNote.
5. Replace cool type badges with one neutral muted pill; gold favorite star; warm loading skeleton.
6. Folder-wide cool-color sweep of `navigation/`; warm anything found via tokens (no structural changes to Clerk-driven components).

### Non-goals

- No navigation/IA rework (same routes, same nav items, same workspace/org behavior).
- No changes to Convex queries, search, favorite, export, or share logic.
- No edits to `src/components/ui/sidebar.tsx` (already tokenized).
- No new routes, no Clerk theming changes beyond color tokens already in place.

## Color / semantics strategy

- **Scores** are the only thing that carries warm *tier* color (olive `--score-high` / gold `--score-mid` / rust `--score-low`), via `ScoreRing` + `getScoreTier`.
- **Type badges** (Audio/File/Text) become a single **neutral** pill (`text-muted-foreground bg-muted border-border`) — differentiated by label/icon, not color — so type never competes semantically with score color.
- **Primary actions** (New Pitch) are **gold**, matching the landing.
- **Favorite** uses **gold** (`--gold`) for the active/filled star.

## Components

### `app-sidebar.tsx`
- Replace both collapsed/expanded hand-drawn logo `div`s with `<LogoIcon size="md" />`; wordmark `<span className="font-display ...">Pista</span>` using `text-foreground` (drop inline `#F2EAD3`).
- Footer "New Pitch" `SidebarMenuButton`: drop `style={{ background:"#F2EAD3", color:"#0e0d0c" }}`; use gold via inline `style={{ background:"hsl(var(--gold))", color:"hsl(var(--gold-foreground))" }}` (consistent with the Phase 4 landing buttons).
- Remove the now-unused-vs-now-used import bookkeeping (LogoIcon now actually used). No logic change to nav/invite/team-switcher.

### `sidebar-nav.tsx`
- The "New" `SidebarMenuBadge`: drop `style={{ background:"#F2EAD3", color:"#0e0d0c" }}`; use gold tokens as above.

### `pitch-details-sidebar.tsx`
- Logo: same `LogoIcon` + `font-display` wordmark swap (collapsed + expanded), drop `#F2EAD3`.
- Footer "New Pitch": gold tokens (drop `#F2EAD3`/`#0e0d0c`).
- `renderTypeBadge`: return one neutral pill for all types — `<Badge variant="secondary" className="bg-muted text-muted-foreground border-border font-medium">{label}</Badge>` where label is Audio/File/Text. (Optionally keep a small leading icon per type; not required.)
- Collapsed favorite `SidebarMenuButton`: replace `yellow-500/15 text-yellow-700 border-yellow-500/25` and `fill-yellow-400 text-yellow-400` with gold equivalents: active bg `bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))] border-[hsl(var(--gold)/0.25)]`, star `fill-[hsl(var(--gold))] text-[hsl(var(--gold))]`.
- Loading skeleton (`!isAuthLoaded` branch): replace `bg-gray-200 dark:bg-gray-700` with `bg-muted` (and the header skeleton too).

### `pitch-list-item.tsx`
- Right side: replace the `Clock8`/date + amber-star score row's score with a `ScoreRing size="sm"` (tier-colored) placed at the right of the row; keep the date (`MMM d`) on the left under the title. Drop `fill-amber-400/20 text-amber-500`.
- Layout: title (truncate) on top-left, date below it, `ScoreRing` right-aligned and vertically centered. Keep the framer-motion hover/tap. Score passed in as `score` prop (already provided).

### `pitch-current-banner.tsx`
- Rebuild as a ring-led warm card: left `ScoreRing size="md"` (from `score`), right column = title (`font-display` or semibold foreground), date row, and `typeBadge` (now neutral). Keep the author avatar + name row below a separator.
- Replace the `primary/*` gradient/halo with a warm card surface (`bg-card border-border` or a subtle `bg-gradient-to-br from-[hsl(var(--gold)/0.06)] ...`); keep it calm.
- contextNote: replace `amber-300/40 / amber-100/40 / amber-900` with neutral/gold warm classes (`border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.1)] text-[hsl(var(--gold))]` or muted).
- Score number rendered by the ring (mono, tier color); drop the separate "8.4 Score" `primary` badge.

### Folder-wide cool-color sweep
- Grep `navigation/` for `(text|bg|border|fill|stroke)-(green|blue|red|amber|emerald|sky|indigo|cyan|teal|violet|purple|yellow|gray|slate|zinc)-\d` and `#F2EAD3`/`#0e0d0c`. Warm or tokenize each hit. Clerk-driven components (`nav-user-navbar`, `team-switcher`, `theme-menu`, `create-organization-modal`, `organization-list`, `workspace-badge`, `personal-workspace-*`) get color-only fixes if they have debt — no structural changes.

## Architecture / Data Flow

No data-flow change. All edited components are presentational; they already receive `score`, `title`, `type`, etc. as props or via existing queries. `ScoreRing` + `getScoreTier` are pure. `LogoIcon` is static. The sidebar primitive and all Convex/Clerk hooks are untouched.

## Testing / Verification

- **Unit (Vitest):** a render smoke for `pitch-list-item` — renders the title and the score (e.g. `getByText("Acme")` and the score `7.1` appears). Keep light.
- **Build:** `npm run build` clean (watch for now-unused imports after dropping the hand-drawn logo divs and the amber star).
- **Cool-color sweep:** the navigation-folder grep above returns no matches after the pass.
- **Manual smoke:** dashboard sidebar and pitch sidebar, both collapsed and expanded — real LogoIcon shows, wordmark in display font, New Pitch is gold, recent-pitch items show tier-colored ScoreRings, current-pitch banner is ring-led, type badges are neutral, favorite star is gold, skeleton is warm, search/back/share/export/team-switcher still work.
- Full `npx vitest run` stays green.

## Open Questions / Deferred

- Whether type badges keep a small per-type **icon** (FileText/Mic/Type) inside the neutral pill — spec default: label only; icon is a trivial optional add at implementation.
- Whether `pitch-list-item` shows the date inline with a separator vs. stacked under the title — spec default: stacked under the title with the ring right-aligned (cleanest with the ring present). Easy to adjust at review.
- Deeper restyle of Clerk-driven menus (`nav-user-navbar`, `team-switcher`) beyond color tokens — deferred (out of scope).
