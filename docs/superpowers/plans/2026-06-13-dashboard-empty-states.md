# Dashboard Empty States + Skeletons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the dashboard empty states into one illustration-free, gold-medallion editorial pattern and align the card skeletons to the real `PitchCard`.

**Architecture:** Rework the shared `EmptyState` to take an `icon` node (replacing the raster `imageSrc` props) rendered in a gold medallion with a `font-display` heading; route all three empty states (`EmptyPitches`, `EmptyFavorites`, `EmptySearch`) through it; switch the `EmptyPitches` CTA to gold; align both card skeletons (`SkeletonCard variant="pitch"` and the inline `SkeletonPitchCard`) to `rounded-2xl p-5`.

**Tech Stack:** Next.js 15 App Router, React, Tailwind CSS 3 (warm HSL tokens), lucide-react, framer-motion, Vitest + Testing Library (jsdom).

**Reference spec:** `docs/superpowers/specs/2026-06-13-dashboard-empty-states-design.md`

---

### Task 1: Rework the shared `EmptyState` component

**Files:**
- Modify (full rewrite): `src/components/ui/empty-state.tsx`
- Test: `src/components/ui/__tests__/empty-state.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/__tests__/empty-state.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renders the title, description, icon node, and action", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Add something to get started."
        icon={<svg data-testid="probe-icon" />}
        action={<button>Do it</button>}
      />
    );
    expect(screen.getByText("Nothing here")).toBeDefined();
    expect(screen.getByText("Add something to get started.")).toBeDefined();
    expect(screen.getByTestId("probe-icon")).toBeDefined();
    expect(screen.getByRole("button", { name: "Do it" })).toBeDefined();
  });

  it("renders no raster image", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Add something."
        icon={<svg data-testid="probe-icon" />}
      />
    );
    expect(screen.queryByRole("img")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/__tests__/empty-state.test.tsx`
Expected: FAIL — the current `EmptyState` requires `imageSrc` and renders an `<img>`, so the `icon`/no-img assertions fail (and TS rejects the `icon` prop).

- [ ] **Step 3: Rewrite the component**

```tsx
// src/components/ui/empty-state.tsx
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/__tests__/empty-state.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/empty-state.tsx src/components/ui/__tests__/empty-state.test.tsx
git commit -m "editorial empty state with medallion icon"
```

---

### Task 2: Update `EmptyPitches` (gold CTA + icon)

**Files:**
- Modify (full rewrite): `src/app/(dashboard)/dashboard/_components/empty-states/empty-pitches.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/app/(dashboard)/dashboard/_components/empty-states/empty-pitches.tsx
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

- [ ] **Step 2: Verify the gradient CTA and raster props are gone**

Use the Grep tool on `src/app/(dashboard)/dashboard/_components/empty-states/empty-pitches.tsx` for `bg-gradient-to-r|imageSrc|\.svg`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/empty-states/empty-pitches.tsx"
git commit -m "gold cta for empty pitches"
```

---

### Task 3: Update `EmptyFavorites` (medallion icon)

**Files:**
- Modify (full rewrite): `src/app/(dashboard)/dashboard/_components/empty-states/empty-favorites.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/app/(dashboard)/dashboard/_components/empty-states/empty-favorites.tsx
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

- [ ] **Step 2: Verify raster props are gone**

Use the Grep tool on `src/app/(dashboard)/dashboard/_components/empty-states/empty-favorites.tsx` for `imageSrc|\.svg`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/empty-states/empty-favorites.tsx"
git commit -m "medallion icon for empty favorites"
```

---

### Task 4: Rewrite `EmptySearch` onto the shared component

**Files:**
- Modify (full rewrite): `src/app/(dashboard)/dashboard/_components/empty-states/empty-search.tsx`
- Test: `src/app/(dashboard)/dashboard/_components/empty-states/__tests__/empty-search.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/(dashboard)/dashboard/_components/empty-states/__tests__/empty-search.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptySearch } from "../empty-search";

describe("EmptySearch", () => {
  it("shows the no-results copy and no raster image", () => {
    render(<EmptySearch />);
    expect(screen.getByText("No results found")).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/(dashboard)/dashboard/_components/empty-states/__tests__/empty-search.test.tsx"`
Expected: FAIL — the current `EmptySearch` renders a `next/image` `<img>`, so `queryByRole("img")` is non-null.

- [ ] **Step 3: Rewrite the component**

```tsx
// src/app/(dashboard)/dashboard/_components/empty-states/empty-search.tsx
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/(dashboard)/dashboard/_components/empty-states/__tests__/empty-search.test.tsx"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/empty-states/empty-search.tsx" "src/app/(dashboard)/dashboard/_components/empty-states/__tests__/empty-search.test.tsx"
git commit -m "empty search uses shared empty state"
```

---

### Task 5: Align card skeletons to the real card

**Files:**
- Modify: `src/components/ui/skeleton-card.tsx` (the `variant === "pitch"` branch)
- Modify: `src/app/(dashboard)/dashboard/_components/grids/pitches-grid.tsx` (the inline `SkeletonPitchCard`)

- [ ] **Step 1: Update the `SkeletonCard` pitch variant wrapper**

In `src/components/ui/skeleton-card.tsx`, the `variant === "pitch"` branch outer wrapper currently reads:

```tsx
      <div className={cn(
        "rounded-lg overflow-hidden border border-border bg-card transition-all duration-200 hover:shadow-md",
        height,
        className
      )}>
        <div className="p-6 h-full flex flex-col space-y-3">
```

Change it to:

```tsx
      <div className={cn(
        "rounded-2xl overflow-hidden border border-border bg-card transition-all duration-200 hover:shadow-md",
        height,
        className
      )}>
        <div className="p-5 h-full flex flex-col space-y-3">
```

(Only `rounded-lg`→`rounded-2xl` and inner `p-6`→`p-5` change.)

- [ ] **Step 2: Update the inline `SkeletonPitchCard`**

In `src/app/(dashboard)/dashboard/_components/grids/pitches-grid.tsx`, `SkeletonPitchCard` currently reads:

```tsx
    <div
        className={cn(
            "rounded-lg overflow-hidden border border-border",
            viewMode === "list" ? "h-[120px]" : "h-[250px]"
        )}
    >
        <div className="p-6 h-full flex flex-col">
```

Change it to:

```tsx
    <div
        className={cn(
            "rounded-2xl overflow-hidden border border-border",
            viewMode === "list" ? "h-[120px]" : "h-[250px]"
        )}
    >
        <div className="p-5 h-full flex flex-col">
```

(Only `rounded-lg`→`rounded-2xl` and inner `p-6`→`p-5` change; heights unchanged.)

- [ ] **Step 3: Verify the tests still pass**

Run: `npx vitest run`
Expected: all green (no skeleton-specific tests, but confirm nothing regressed).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/skeleton-card.tsx "src/app/(dashboard)/dashboard/_components/grids/pitches-grid.tsx"
git commit -m "align card skeletons to pitch card"
```

---

### Task 6: Final verification & sweep

**Files:** none (verification only)

- [ ] **Step 1: Raster/illustration sweep of the empty-states surface**

Use the Grep tool over `src/app/(dashboard)/dashboard/_components/empty-states` and `src/components/ui/empty-state.tsx`:
- Pattern `imageSrc|next/image|\.svg|OptimizedImage` → Expected: no matches.
- Pattern `bg-gradient-to-r` → Expected: no matches.

If any match remains, replace it per the spec (`icon` medallion / gold CTA) and re-run.

- [ ] **Step 2: Full test suite**

Run: `npx vitest run`
Expected: all tests green (including the two new tests).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds, no errors, and no unused-import warnings from the changed files (the old `OptimizedImage`, `next/image`, and `motion` imports must be gone from `empty-state.tsx`/`empty-search.tsx`).

- [ ] **Step 4: Commit any sweep fixes (only if Step 1 changed files)**

```bash
git add -A
git commit -m "empty state sweep"
```

---

## Notes for the implementer

- `EmptyState` is consumed only by `empty-pitches.tsx`, `empty-favorites.tsx`, and (after Task 4) `empty-search.tsx` — all updated in this plan, so the API change is fully covered.
- `NewPitchButton` already supports `variant="gold"` (maps to the Button gold variant) — no change needed there.
- `useOptimizedAnimations()` returns `animations` with `staggerChildren`, `fadeIn`, `slideUp`, and `scale` variants (used by the original `EmptyState`) — reuse them as-is.
- In `EmptySearch`, "couldn't" is a JS string (a prop value), not JSX text, so a plain apostrophe is correct — do **not** use `&apos;`.
- Do not delete the `/empty-*.svg` asset files (out of scope; harmless once unreferenced).
- Commit messages: short, lowercase, single-line, no AI/Claude references, no co-author trailers.
