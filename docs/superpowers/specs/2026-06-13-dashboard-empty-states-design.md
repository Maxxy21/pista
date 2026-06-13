# Dashboard Empty States + Skeletons — Design Spec (Phase 8)

**Date:** 2026-06-13
**Status:** Approved (direction), pending spec review
**Depends on:** Phase 1 foundation (warm tokens, fonts), `NewPitchButton` (already has `variant="gold"`), `LogoIcon` — all on `main`.

## Context

Phase 8 reconciles the **dashboard** surface. Exploration found that the high-traffic pieces — `pitch-card.tsx`, `dashboard-toolbar.tsx`, `stats.tsx`, and the grids — were already brought to the warm-editorial system in earlier phases (ScoreRing, `font-display`/`font-mono`, `border-border`/`bg-card`, gold accents). The remaining debt is concentrated in two places:

1. **Empty states** break the system three ways:
   - **Raster illustrations** — `/empty-favorites.svg` and `/empty-search.svg` are the only illustration art left in the app; everywhere else is icon/type-led.
   - **Non-gold CTA** — `EmptyPitches` uses `bg-gradient-to-r from-primary to-primary/80` (a cream gradient), not the gold convention every other primary CTA uses. It also reuses the *favorites* image for "no pitches."
   - **Internal inconsistency** — `EmptySearch` is a bespoke one-off (its own `next/image`, `text-2xl font-semibold`), while `EmptyFavorites`/`EmptyPitches` go through the shared `EmptyState`. None use `font-display`.

2. **Skeletons** don't match the real card — `PitchCard` is `rounded-2xl p-5`, but both card skeletons (`SkeletonCard variant="pitch"` and the inline `SkeletonPitchCard` in `pitches-grid.tsx`) are `rounded-lg p-6`, so the loading state visibly "jumps" when content resolves.

`EmptyState` (`@/components/ui/empty-state`) is consumed **only** by `empty-pitches.tsx` and `empty-favorites.tsx` (verified), so its API can be reworked safely.

## Approved direction

Redesign the shared `EmptyState` into one **illustration-free, medallion-icon editorial pattern**; route all three empty states through it; align both card skeletons to the real card. DRY: one component, three thin call sites.

## Goals

1. Rework `EmptyState` to render a **gold medallion icon** (not a raster image) and a `font-display` heading.
2. Update the three empty states to use it consistently, with the `EmptyPitches` CTA switched to gold.
3. Align both card skeletons to the real `PitchCard` shape (`rounded-2xl p-5`).

### Non-goals

- No changes to cards/toolbar/stats/grids (already warm).
- No list-view row redesign (list mode renders single-column cards — unchanged).
- No deletion of the `/empty-*.svg` asset files (simply no longer referenced).
- No copy rewrites beyond what's required to move `EmptySearch` onto the shared component (preserve its existing strings).

## Architecture / Data Flow

All three empty states are presentational and stateless. `EmptyState` owns the layout (medallion + heading + description + optional action) and the entrance animation. Each empty-state file is a thin wrapper supplying an icon node, copy, and (for `EmptyPitches`) a gold `NewPitchButton`. `getEmptyState` (empty-helper) routing is unchanged. The skeleton change is purely visual class alignment.

## Components

### `EmptyState` (rework) — `src/components/ui/empty-state.tsx`

New interface (replaces `imageSrc`/`imageAlt`/`imageSize` with `icon`):

```tsx
interface EmptyStateProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}
```

Implementation:

```tsx
import React from "react";
import { motion } from "framer-motion";
import { useOptimizedAnimations } from "@/hooks/use-optimized-animations";
import { LazyLoadSection } from "@/components/shared/common/lazy-load-section";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
    const { animations } = useOptimizedAnimations();

    return (
        <LazyLoadSection className={cn("flex flex-col items-center justify-center py-10", className)}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={animations.staggerChildren}
                className="flex flex-col items-center"
            >
                <motion.div variants={animations.fadeIn}>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-[hsl(var(--gold))]">
                        {icon}
                    </div>
                </motion.div>

                <motion.h2
                    className="text-center font-display text-2xl font-semibold"
                    variants={animations.slideUp}
                >
                    {title}
                </motion.h2>

                <motion.p
                    className="mt-2 max-w-md text-center text-sm text-muted-foreground"
                    variants={animations.slideUp}
                >
                    {description}
                </motion.p>

                {action && (
                    <motion.div className="mt-6" variants={animations.scale}>
                        {action}
                    </motion.div>
                )}
            </motion.div>
        </LazyLoadSection>
    );
}
```

Notes:
- Medallion: `h-16 w-16` (64px) `rounded-full border border-border bg-card`, icon gold via `text-[hsl(var(--gold))]`. The icon node passed by callers carries its own size (e.g. `className="h-7 w-7"`).
- `OptimizedImage` import is removed.

### `EmptyPitches` — `src/app/(dashboard)/dashboard/_components/empty-states/empty-pitches.tsx`

```tsx
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { NewPitchButton } from "../new-pitch-button";

interface EmptyPitchesProps {
    orgId?: string;
}

export const EmptyPitches = ({ orgId }: EmptyPitchesProps) => {
    return (
        <EmptyState
            title="Create your first pitch!"
            description="Start by uploading or writing your pitch"
            icon={<FileText className="h-7 w-7" />}
            className="min-h-[60vh]"
            action={<NewPitchButton orgId={orgId} variant="gold" showIcon />}
        />
    );
};
```

### `EmptyFavorites` — `src/app/(dashboard)/dashboard/_components/empty-states/empty-favorites.tsx`

```tsx
import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const EmptyFavorites = () => {
    return (
        <EmptyState
            title="No favorite pitches!"
            description="Try favoriting a pitch to see it here"
            icon={<Star className="h-7 w-7" />}
            className="min-h-[60vh]"
        />
    );
};
```

### `EmptySearch` (rewrite onto shared component) — `src/app/(dashboard)/dashboard/_components/empty-states/empty-search.tsx`

```tsx
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const EmptySearch = () => {
    return (
        <EmptyState
            title="No results found"
            description="We couldn't find any pitches matching your search. Try adjusting your search terms or filters."
            icon={<SearchX className="h-7 w-7" />}
            className="min-h-[60vh]"
        />
    );
};
```

Note: the apostrophe in "couldn't" is a normal JS string here (not JSX text), so no `&apos;` escaping is needed.

### Skeleton alignment

**`src/components/ui/skeleton-card.tsx`** — the `variant === "pitch"` branch: change the outer wrapper from `rounded-lg ... p-6` to match the real card. Specifically:
- `rounded-lg` → `rounded-2xl`
- inner padding `p-6` → `p-5`

(Keep `overflow-hidden border border-border bg-card transition-all duration-200 hover:shadow-md` and the `height` prop behavior.)

**`src/app/(dashboard)/dashboard/_components/grids/pitches-grid.tsx`** — the inline `SkeletonPitchCard`: change `rounded-lg` → `rounded-2xl` and the inner `p-6` → `p-5`. (Leave the `h-[120px]`/`h-[250px]` list/grid heights as-is.)

## Testing / Verification

- **Unit (Vitest):** new `src/components/ui/__tests__/empty-state.test.tsx`:
  - renders `title`, `description`, the action node, and the passed `icon` node (e.g. an icon with `data-testid`);
  - renders **no** `<img>` element (`screen.queryByRole("img")` is null).
- **Unit (Vitest):** `src/app/(dashboard)/dashboard/_components/empty-states/__tests__/empty-search.test.tsx`: renders "No results found" and contains no `<img>`.
- **Build:** `npm run build` clean — watch for now-unused imports (`OptimizedImage` in `empty-state.tsx`; `next/image`/`motion` in `empty-search.tsx`).
- **Sweep:** grep the empty-states folder + `empty-state.tsx` for `imageSrc`, `.svg`, and `next/image` → none remain; grep for `bg-gradient-to-r` in `empty-pitches.tsx` → none.
- Full `npx vitest run` stays green.

## Open Questions / Deferred

- Whether to delete the unused `/empty-*.svg` assets — deferred (harmless; out of scope).
- List-view distinct row design — deferred (explicitly out of scope).
