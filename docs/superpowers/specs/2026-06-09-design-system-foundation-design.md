# Design System Foundation — Design Spec

**Date:** 2026-06-09
**Status:** Approved (scope), pending spec review
**Branch:** `redesign/design-system-foundation`

## Context

Pista is a startup-pitch-analysis app (Next.js 15, Convex, Clerk, Tailwind, framer-motion, recharts). It currently suffers from visual inconsistency because **two competing design languages** coexist:

1. The **landing page** uses a warm editorial dark theme defined as `--landing-*` tokens in `globals.css` (cream `#F2EAD3` on near-black `#0E0D0C`, gold-ish gradient shells).
2. The **app** (dashboard, pitch detail, navigation, modals) uses cold, pure-grayscale shadcn tokens (`--background`, `--primary`, etc. at 0% saturation), forced into dark mode (`forcedTheme="dark"`), with a full **light** palette defined but never rendered.

Clerk's prebuilt components add a third surface that must be manually themed (already partially done via `getClerkAppearance()`).

This spec is **Phase 1** of a phased, full-app redesign. It builds the single design system that every later phase inherits. It deliberately does **not** redesign any page; it fixes the foundation so subsequent surface redesigns are consistent by construction.

### Decisions already locked (via brainstorming)

- **Aesthetic direction:** Warm Editorial — ink/charcoal base, cream text, gold accent, warm-tuned score colors.
- **Auth:** Keep Clerk; theme it to match the system. No auth/backend migration.
- **Sequence:** Design system first; each surface (landing, auth, dashboard, pitch-detail, upload flow) becomes its own later spec.
- **Theme:** Single dark-only theme (the app already forces dark). The dead light palette is removed.

## Goals

1. One source-of-truth token set, in the warm-editorial aesthetic, that all shadcn/Radix components inherit automatically.
2. Distinctive typography (Fraunces / Hanken Grotesk / JetBrains Mono) replacing Inter/Playfair.
3. A new, meaningful Pista logo (mark "B": π over rising score bars) + matching favicon, replacing the generic blue blob and the stale "Pitch Perfect" wordmark.
4. Clerk screens themed from the same tokens.
5. Restyled core UI primitives (button + gold variant, input, card, badge, tabs).

### Non-goals (explicitly out of scope for this spec)

- Redesigning the landing page, dashboard, pitch-detail, auth screens, or upload flow layouts (later specs).
- Replacing Clerk or any auth/organization functionality.
- Adding a light theme or theme switcher.
- Changing Convex schema, data flow, or any business logic.

## Design Tokens

All tokens live in `src/app/globals.css`. The warm palette becomes the single theme. shadcn variables are expressed in **HSL channel triplets** (the format `hsl(var(--x))` expects).

### Core palette

| Token | Value (hex ref) | Role |
|---|---|---|
| Ink (base bg) | `#0E0D0C` | `--background` |
| Surface | `#171512` | `--card`, `--popover`, `--secondary` |
| Elevated | `#1F1C18` | `--muted`, `--accent` |
| Cream (text) | `#F2EAD3` | `--foreground`, `--primary` |
| Cream-muted | `rgba(242,234,211,.55)` | `--muted-foreground` |
| Border | `rgba(242,234,211,.12)` | `--border`, `--input` |
| Border-hover | `rgba(242,234,211,.28)` | hover states |
| Gold (accent) | `#C9A227` | `--gold` (new) |

shadcn primary stays **cream** (so default primary buttons are cream-on-ink, matching the current landing CTA). Gold is a **separate accent token** used intentionally (links, active states, the gold button variant), not as `--primary`, to avoid recoloring every existing `bg-primary` usage.

### Semantic score colors (warm-tuned)

| Token | Value | Use |
|---|---|---|
| `--score-high` | `#9CB24A` (olive) | scores ≥ ~75 |
| `--score-mid` | `#C9A227` (gold) | mid scores |
| `--score-low` | `#C2602F` (rust) | low scores |

These replace the current cool `--green-rgb` / `--amber-rgb` / `--red-rgb` triplets used by score badges/bars (kept as aliases pointing to the warm values so existing references don't break during this phase). The plan will inventory existing consumers (`score-badge.tsx`, score bars, charts) and decide alias-vs-migrate per file.

### Token strategy notes

- `--landing-*` variables are **redefined to reference the unified tokens** (e.g. `--landing-bg: hsl(var(--background))`), so the landing page keeps working unchanged while sharing one source of truth. A later landing-redesign spec can drop them.
- The chart palette (`--chart-1..5`) is re-tuned to warm hues that harmonize with gold/olive/rust (recharts radar + bar charts consume these).
- `--radius` and the radius scale are reviewed for the slightly larger, softer editorial feel (cards ~16px, controls ~10px).
- The unused light `:root` shadcn palette block is removed; the warm values become the default `:root` (no `.dark` toggling needed since theme is forced dark, but `.dark` keeps the same values for safety with any `dark:` utilities).

## Typography

Replace fonts in `src/app/layout.tsx` and `tailwind.config.ts`.

| Family | Role | Tailwind key |
|---|---|---|
| **Fraunces** (Google, opsz 9–144, w 400–700) | display / headings | `font-display` (also `font-serif`) |
| **Hanken Grotesk** (Google, w 400–600) | body / UI | `font-sans` (default) |
| **JetBrains Mono** (Google, w 400–500) | numeric data, scores, dates, eyebrow labels | `font-mono` |

- `next/font/google` loads all three with `variable` CSS vars (`--font-fraunces`, `--font-hanken`, `--font-mono`).
- `tailwind.config.ts` `fontFamily` updated: `sans → Hanken`, `display`/`serif → Fraunces`, `mono → JetBrains Mono`. Existing `font-playfair` usages are migrated to `font-display`.
- `body` className switches from `inter.className` to the Hanken variable.

## Logo & Favicon

Mark **B**: a geometric **π** (horizontal top bar) sitting over **three rising bars** (the score-bar motif), rightmost/tallest bar in gold; rest cream. Wordmark: "**Pi**" in gold + "sta" in cream, Fraunces 600.

Files:
- `src/components/ui/logo-icon.tsx` — replace blob `<div>` with the SVG mark; keep `size` prop (`sm|md|lg`) and `className` API so existing call sites are unaffected. Colors via `currentColor` + a gold class so it adapts.
- `src/components/ui/logo.tsx` — render `LogoIcon` + the Pi/sta wordmark; **fix the stale "Pitch Perfect" text → "Pista"**; replace blue gradient.
- `src/components/shared/landing/components/header.tsx` — swap the inline cream blob for `LogoIcon` + wordmark (keeps landing visually consistent with app).
- `src/app/icon.tsx` — regenerate the favicon as the π+bars mark (gold accent on transparent), replacing the blue gradient blob. Verify 32×32 legibility.

The exact SVG geometry (bar widths, heights, gap, corner radii, gold bar) is finalized during implementation against a 16px and 32px legibility check.

## Core UI Primitives

These shared primitives are consumed app-wide; restyling them propagates everywhere. Most already use shadcn tokens, so the token remap does the heavy lifting — these are targeted additions/adjustments:

- `components/ui/button.tsx` — add a **`gold`** variant (`bg-gold text-ink hover:opacity-90`); review radii/sizes for the editorial feel. Existing variants inherit new tokens automatically.
- `components/ui/input.tsx` — confirm token-driven styling (surface bg, cream text, border) reads correctly under new tokens.
- `components/ui/card.tsx` — radii + border tuned to the editorial card style.
- `components/ui/badge.tsx` — add support for the score-color semantics where badges show scores.
- `components/ui/tabs.tsx` — active/inactive states aligned to gold accent.
- Numeric display convention: scores/dates/eyebrow labels use `font-mono`. Implementation introduces small helper classes or a `<Stat>`/`<ScoreRing>` primitive only if it reduces duplication (decided in the plan; YAGNI otherwise).

## Clerk Theming

`src/lib/utils/clerk-appearance.ts` already maps Clerk's `appearance.elements` to hardcoded warm hex values. Update it to:

- Reference the unified token values (via the same hex constants or CSS-var-backed Tailwind classes) so it stays in lockstep with `globals.css`.
- Apply the new type (Hanken for body, Fraunces where Clerk shows titles) and gold accent for primary actions/links, matching the new button style.
- No structural/auth changes — appearance only.

## Architecture / Data Flow

No runtime architecture change. This is a presentation-layer foundation:

```
globals.css (tokens)  ──┐
tailwind.config (fonts/ │
  colors/radii)         ├──►  shadcn/Radix primitives  ──►  every page (unchanged structurally)
layout.tsx (font wiring)│
clerk-appearance.ts ────┘──►  Clerk components
```

Risk surface is purely visual regressions. Mitigation: change tokens, not component structure; keep `--green/amber/red-rgb` and `--landing-*` as aliases so existing consumers don't break in this phase.

## Testing / Verification

- `npm run build` passes (type + lint clean).
- Visual smoke check of key surfaces under the new tokens: landing, dashboard, pitch-detail, a Clerk sign-in, and at least one modal — confirm no unreadable/!contrast-broken elements (the warm dark theme must keep AA-ish contrast for body text).
- Favicon renders correctly at 32px (browser tab) and the in-app logo at sm/md/lg.
- Existing Vitest suite still passes (`npm run test`) — no logic touched, so this is a regression guard.
- Manual: confirm no remaining "Pitch Perfect" string and no blue blob logo anywhere (`grep`).

## Open Questions / Deferred

- Whether to keep score-color aliases long-term or migrate all consumers now — deferred to the plan's per-file inventory (default: alias now, migrate during each surface's later spec).
- Exact chart hue values — tuned during implementation against real recharts output.
