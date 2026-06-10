# Dashboard Redesign Implementation Plan (Phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the dashboard on the warm-editorial foundation — a `ScoreRing` primitive, editorial pitch cards and stats strip, one consolidated toolbar (merging tabs + filters), a light Navbar pass, and dead-code removal.

**Architecture:** Presentation-layer only. `dashboard-content.tsx` stays the state owner; new/changed components are presentational. No Convex/query/routing/virtualization changes. Reuses Phase 1 tokens (`--gold`, `--score-high/mid/low`, `font-display`, `font-mono`).

**Tech Stack:** Next.js 15 App Router, Tailwind 3, shadcn/Radix, framer-motion, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-06-10-dashboard-redesign-design.md`

**Commit convention:** short lowercase subject, NO AI co-author trailer (per `CLAUDE.md`). Never stage `package-lock.json`.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/lib/utils/score.ts` | add `getScoreTier` | Modify |
| `src/lib/utils/__tests__/score-tier.test.ts` | tier boundary tests | Create |
| `src/components/ui/score-ring.tsx` | circular score primitive | Create |
| `src/components/ui/__tests__/score-ring.test.tsx` | render test | Create |
| `.../dashboard/_components/grids/pitch-to-card.ts` | thread input type | Modify |
| `.../dashboard/_components/grids/pitches-grid.tsx` | add `type` to `Pitch` | Modify |
| `.../dashboard/_components/grids/__tests__/pitch-to-card.test.ts` | mapping test | Create |
| `.../dashboard/_components/cards/pitch-card.tsx` | editorial card + ScoreRing | Modify |
| `.../dashboard/_components/stats.tsx` | editorial stats strip | Modify |
| `.../dashboard/_components/new-pitch-button.tsx` | add `gold` variant | Modify |
| `.../dashboard/_components/dashboard-toolbar.tsx` | merged tabs+filters | Create |
| `.../dashboard/_components/dashboard-content.tsx` | use toolbar | Modify |
| `.../dashboard/_components/dashboard-tabs.tsx` | absorbed | Delete |
| `.../dashboard/_components/pitch-filters.tsx` | absorbed | Delete |
| `.../dashboard/_components/dashboard-header.tsx` | dead code | Delete |
| `src/components/shared/navigation/navbar.tsx` | light warm pass | Modify |

---

## Task 1: `getScoreTier` helper

**Files:** Modify `src/lib/utils/score.ts`; Create `src/lib/utils/__tests__/score-tier.test.ts`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/utils/__tests__/score-tier.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getScoreTier } from "@/lib/utils/score";

describe("getScoreTier", () => {
  it("high at 7.5 and above", () => {
    expect(getScoreTier(10)).toBe("high");
    expect(getScoreTier(7.5)).toBe("high");
  });
  it("mid between 5 and 7.5", () => {
    expect(getScoreTier(7.4)).toBe("mid");
    expect(getScoreTier(5)).toBe("mid");
  });
  it("low below 5", () => {
    expect(getScoreTier(4.9)).toBe("low");
    expect(getScoreTier(0)).toBe("low");
  });
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `npx vitest run src/lib/utils/__tests__/score-tier.test.ts`
Expected: FAIL (`getScoreTier` not exported).

- [ ] **Step 3: Add `getScoreTier` to `score.ts`** (append, keep existing `getScoreTone`):

```ts
export type ScoreTier = "high" | "mid" | "low";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 7.5) return "high";
  if (score >= 5) return "mid";
  return "low";
}
```

- [ ] **Step 4: Run it, confirm it passes**

Run: `npx vitest run src/lib/utils/__tests__/score-tier.test.ts` → PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/score.ts src/lib/utils/__tests__/score-tier.test.ts
git commit -m "add score tier helper"
```

---

## Task 2: `ScoreRing` primitive

**Files:** Create `src/components/ui/score-ring.tsx`; Create `src/components/ui/__tests__/score-ring.test.tsx`.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/__tests__/score-ring.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScoreRing } from "@/components/ui/score-ring";

describe("ScoreRing", () => {
  it("shows the score to one decimal and a high-tier border", () => {
    const { container, getByText } = render(<ScoreRing score={9} />);
    expect(getByText("9.0")).toBeTruthy();
    expect(container.innerHTML).toContain("border-[hsl(var(--score-high))]");
  });
  it("uses the low-tier border for low scores", () => {
    const { container } = render(<ScoreRing score={3} />);
    expect(container.innerHTML).toContain("border-[hsl(var(--score-low))]");
  });
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `npx vitest run src/components/ui/__tests__/score-ring.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/components/ui/score-ring.tsx`:**

```tsx
import React from "react";
import { cn } from "@/lib/utils";
import { getScoreTier, type ScoreTier } from "@/lib/utils/score";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PX = { sm: 34, md: 44, lg: 56 } as const;
const FONT = { sm: 12, md: 15, lg: 19 } as const;

const TIER_BORDER: Record<ScoreTier, string> = {
  high: "border-[hsl(var(--score-high))]",
  mid: "border-[hsl(var(--score-mid))]",
  low: "border-[hsl(var(--score-low))]",
};

const TIER_GLOW: Record<ScoreTier, string> = {
  high: "rgba(156,178,74,0.25)",
  mid: "rgba(201,162,39,0.25)",
  low: "rgba(194,96,47,0.25)",
};

export function ScoreRing({ score, size = "md", className }: ScoreRingProps) {
  const tier = getScoreTier(score);
  const dim = PX[size];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 font-mono font-medium text-foreground",
        TIER_BORDER[tier],
        className
      )}
      style={{
        width: dim,
        height: dim,
        fontSize: FONT[size],
        boxShadow: size === "sm" ? undefined : `0 0 14px ${TIER_GLOW[tier]}`,
      }}
      aria-label={`Score ${score.toFixed(1)} out of 10`}
    >
      {score.toFixed(1)}
    </div>
  );
}
```

- [ ] **Step 4: Run it, confirm it passes**

Run: `npx vitest run src/components/ui/__tests__/score-ring.test.tsx` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/score-ring.tsx src/components/ui/__tests__/score-ring.test.tsx
git commit -m "add score ring component"
```

---

## Task 3: Thread input type into the card props

**Files:** Modify `grids/pitches-grid.tsx` (`Pitch` type), `grids/pitch-to-card.ts`, `cards/pitch-card.tsx` (`PitchCardProps` only — visual redesign is Task 4). Create `grids/__tests__/pitch-to-card.test.ts`.

- [ ] **Step 1: Add `type` to the `Pitch` interface** in `grids/pitches-grid.tsx` (inside `export interface Pitch { ... }`, after `text`):

```ts
    type: string;
```

- [ ] **Step 2: Add `inputType` to `PitchCardProps`** in `cards/pitch-card.tsx` (add to the interface):

```ts
    inputType?: "TEXT" | "AUDIO";
```

- [ ] **Step 3: Write the failing test**

Create `src/app/(dashboard)/dashboard/_components/grids/__tests__/pitch-to-card.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { toPitchCardProps } from "../pitch-to-card";

const base = {
  _id: "p1" as any,
  title: "T",
  text: "body",
  type: "audio",
  userId: "u1",
  authorName: "A",
  _creationTime: 0,
  orgId: "o1",
  isFavorite: false,
  evaluation: { overallScore: 8 },
};

describe("toPitchCardProps", () => {
  it("maps audio input type to AUDIO", () => {
    expect(toPitchCardProps(base as any, () => {}).inputType).toBe("AUDIO");
  });
  it("maps textFile and text to TEXT", () => {
    expect(toPitchCardProps({ ...base, type: "textFile" } as any, () => {}).inputType).toBe("TEXT");
    expect(toPitchCardProps({ ...base, type: "text" } as any, () => {}).inputType).toBe("TEXT");
  });
});
```

- [ ] **Step 4: Run it, confirm it fails**

Run: `npx vitest run "src/app/(dashboard)/dashboard/_components/grids/__tests__/pitch-to-card.test.ts"`
Expected: FAIL (`inputType` undefined).

- [ ] **Step 5: Update `pitch-to-card.ts`** — add the mapping helper and field:

```ts
import type { Pitch } from "./pitches-grid";
import type { PitchCardProps } from "../cards/pitch-card";
import { normalizeTranscriptText } from "@/lib/utils/text";

function inputTypeLabel(type: string): "TEXT" | "AUDIO" {
  return type === "audio" ? "AUDIO" : "TEXT";
}

export function toPitchCardProps(
  pitch: Pitch,
  onClick: (id: string) => void
): PitchCardProps {
  return {
    id: pitch._id,
    title: pitch.title,
    text: normalizeTranscriptText(pitch.text),
    authorId: pitch.userId,
    authorName: pitch.authorName,
    createdAt: pitch._creationTime,
    orgId: pitch.orgId,
    isFavorite: pitch.isFavorite,
    score: pitch.evaluation.overallScore,
    inputType: inputTypeLabel(pitch.type),
    onClick: () => onClick(pitch._id),
  };
}
```

- [ ] **Step 6: Run it, confirm it passes**

Run: `npx vitest run "src/app/(dashboard)/dashboard/_components/grids/__tests__/pitch-to-card.test.ts"` → PASS.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/grids/pitches-grid.tsx" "src/app/(dashboard)/dashboard/_components/grids/pitch-to-card.ts" "src/app/(dashboard)/dashboard/_components/cards/pitch-card.tsx" "src/app/(dashboard)/dashboard/_components/grids/__tests__/pitch-to-card.test.ts"
git commit -m "thread input type into card props"
```

---

## Task 4: Redesign `PitchCard`

**Files:** Modify `cards/pitch-card.tsx` (the returned JSX only; keep all hooks/logic and the `inputType` prop from Task 3).

- [ ] **Step 1: Replace the import of `ScoreBadge` with `ScoreRing`**

Change `import { ScoreBadge } from "./score-badge";` to:
```tsx
import { ScoreRing } from "@/components/ui/score-ring";
```

- [ ] **Step 2: Replace the component's `return (...)` JSX** with the editorial layout (leave everything above `return` unchanged; note `inputType` is destructured from props):

```tsx
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full"
        >
            <Card
                onClick={onClick}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[hsl(var(--foreground)/0.28)]"
                tabIndex={0}
                aria-label={`Pitch: ${title}`}
            >
                <div className="absolute right-4 top-4 flex items-center gap-1">
                    <FavoriteToggleButton isFavorite={isFavorite} disabled={isPending} onToggle={toggleFavorite} />
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        <CardActions id={id} title={title} />
                    </span>
                </div>

                <div className="flex-1">
                    {inputType && (
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                            {inputType}
                        </div>
                    )}
                    <h3 className="mb-2 line-clamp-2 pr-14 font-display text-lg font-semibold leading-tight">
                        {title}
                    </h3>
                    <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                        {text}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground/70">
                        {authorLabel} · {createdAtLabel}
                    </span>
                    {score !== undefined && <ScoreRing score={score} size="sm" />}
                </div>
            </Card>
        </motion.div>
    );
```

- [ ] **Step 3: Add `inputType` to the destructured props** in the function signature (add after `score,`):

```tsx
    inputType,
```

- [ ] **Step 4: Verify build + tests**

Run: `npm run build` → succeeds.
Run: `npx vitest run` → all pass.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/cards/pitch-card.tsx"
git commit -m "redesign pitch card"
```

---

## Task 5: Redesign `DashboardStats`

**Files:** Modify `_components/stats.tsx`.

- [ ] **Step 1: Replace the file's component bodies** — swap the 4 floating `Card`s for one hairline strip, use `ScoreRing` for the average, and remove the fake `"+14%"` growth and cool trend colors. Replace the `StatCard` definition and the `return` of `DashboardStats` (keep the `useAuth`, `useWorkspace`, `useQuery(getPitchStats...)`, `defaultStats`, `mergedStats`, and loading-skeleton logic intact). New imports at top: add `import { ScoreRing } from "@/components/ui/score-ring";` and drop the now-unused `ScoreBadge`, `LineChart/ChevronUp/CalendarDays/BarChart3` icon imports and the `trend` machinery.

Replace `StatCard` with a lean cell:

```tsx
function StatCell({
    label,
    children,
    sub,
}: {
    label: string;
    children: React.ReactNode;
    sub?: React.ReactNode;
}) {
    return (
        <div className="px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">
                {label}
            </p>
            <div className="mt-2 text-2xl font-medium font-mono leading-none tracking-tight">
                {children}
            </div>
            {sub && <p className="mt-1.5 text-[11px] text-muted-foreground">{sub}</p>}
        </div>
    );
}
```

Replace the loading `return` (keep its condition) so the skeleton matches the strip:

```tsx
    if (!shouldFetch || !stats) {
        return (
            <div className="grid grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-card lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-5 py-4">
                        <div className="h-3 w-20 rounded bg-muted" />
                        <div className="mt-3 h-7 w-14 rounded bg-muted" />
                    </div>
                ))}
            </div>
        );
    }
```

Replace the main `return` with the strip:

```tsx
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-4"
        >
            <StatCell label="Total pitches" sub={`${mergedStats.totalPitches} analyzed`}>
                {mergedStats.totalPitches}
            </StatCell>
            <StatCell label="Average score">
                <ScoreRing score={averageScore} size="md" />
            </StatCell>
            <StatCell
                label="Best pitch"
                sub={mergedStats.bestPitch ? `${bestPitchScore.toFixed(1)} / 10` : undefined}
            >
                <span className="block truncate font-display text-lg">
                    {mergedStats.bestPitch?.title ?? "None"}
                </span>
            </StatCell>
            <StatCell label="Recent" sub="last 7 days">
                {mergedStats.recentPitches.length}
            </StatCell>
        </motion.div>
    );
```

Also delete the now-unused `pitchGrowth` memo. Keep `bestPitchScore` and `averageScore`.

- [ ] **Step 2: Verify build**

Run: `npm run build` → succeeds (no unused-import or type errors; remove any leftover unused imports the compiler flags).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/stats.tsx"
git commit -m "redesign dashboard stats strip"
```

---

## Task 6: Add `gold` variant to `NewPitchButton`

**Files:** Modify `_components/new-pitch-button.tsx`.

- [ ] **Step 1: Extend the variant union** — change `variant?: "default" | "gradient" | "outline";` to:

```tsx
    variant?: "default" | "gradient" | "outline" | "gold";
```

- [ ] **Step 2: Add a `gold` entry to `BUTTON_STYLES`** (after `outline`):

```tsx
    gold: "",
```

- [ ] **Step 3: Pass `gold`/`outline` through to the underlying `Button`** — change the `variant={variant === "outline" ? "outline" : "default"}` line to:

```tsx
                variant={variant === "outline" ? "outline" : variant === "gold" ? "gold" : "default"}
```

- [ ] **Step 4: Verify build**

Run: `npm run build` → succeeds.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/new-pitch-button.tsx"
git commit -m "add gold variant to new pitch button"
```

---

## Task 7: Consolidated `DashboardToolbar`

**Files:** Create `_components/dashboard-toolbar.tsx`; Modify `_components/dashboard-content.tsx`; Delete `_components/dashboard-tabs.tsx` and `_components/pitch-filters.tsx`.

- [ ] **Step 1: Create `src/app/(dashboard)/dashboard/_components/dashboard-toolbar.tsx`:**

```tsx
"use client";

import React, { useMemo, useState } from "react";
import { Filter, ArrowDownUp, List, GridIcon } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { NewPitchButton } from "./new-pitch-button";

const TABS = [
    { value: "all", label: "All pitches" },
    { value: "recent", label: "Recent" },
    { value: "favorites", label: "Favorites" },
];

const SCORE_LABELS: Record<string, string> = {
    all: "All scores",
    high: "High (8-10)",
    medium: "Medium (5-7.9)",
    low: "Low (0-4.9)",
};

const SORT_LABELS: Record<string, string> = {
    newest: "Newest",
    score: "Highest score",
    updated: "Recently updated",
};

interface DashboardToolbarProps {
    currentView: string;
    handleTabChange: (value: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    scoreFilter: string;
    setScoreFilter: (filter: string) => void;
    sortBy: "newest" | "score" | "updated";
    setSortBy: (sort: "newest" | "score" | "updated") => void;
}

export function DashboardToolbar({
    currentView,
    handleTabChange,
    viewMode,
    setViewMode,
    scoreFilter,
    setScoreFilter,
    sortBy,
    setSortBy,
}: DashboardToolbarProps) {
    const { organization } = useOrganization();
    const isMobile = useIsMobile();
    const [filtersOpen, setFiltersOpen] = useState(false);

    const activeTab = TABS.some((t) => t.value === currentView) ? currentView : "all";
    const scoreLabel = useMemo(() => SCORE_LABELS[scoreFilter] ?? SCORE_LABELS.all, [scoreFilter]);
    const sortLabel = useMemo(() => SORT_LABELS[sortBy], [sortBy]);

    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 md:px-6">
            {/* Tabs */}
            <div className="flex items-center gap-5">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={cn(
                            "border-b-2 border-transparent pb-1 text-sm transition-colors",
                            activeTab === tab.value
                                ? "border-gold font-semibold text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="ml-auto flex items-center gap-2">
                {/* Desktop score + sort dropdowns */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden h-9 gap-2 sm:inline-flex">
                            <Filter className="h-4 w-4" />
                            <span>{scoreLabel}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-48">
                        {Object.entries(SCORE_LABELS).map(([key, label]) => (
                            <DropdownMenuItem key={key} onClick={() => setScoreFilter(key)}>
                                {label}
                                {scoreFilter === key && <span className="ml-auto h-2 w-2 rounded-full bg-gold" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden h-9 gap-2 sm:inline-flex">
                            <ArrowDownUp className="h-4 w-4" />
                            <span>{sortLabel}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-48">
                        {Object.entries(SORT_LABELS).map(([key, label]) => (
                            <DropdownMenuItem key={key} onClick={() => setSortBy(key as DashboardToolbarProps["sortBy"])}>
                                {label}
                                {sortBy === key && <span className="ml-auto h-2 w-2 rounded-full bg-gold" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile filter sheet */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-2 sm:hidden">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={isMobile ? "bottom" : "right"} className="w-full sm:max-w-sm">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 space-y-4">
                            <div>
                                <div className="mb-2 text-sm font-medium">Score</div>
                                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Score" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(SCORE_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="mb-2 text-sm font-medium">Sort by</div>
                                <Select value={sortBy} onValueChange={(v) => setSortBy(v as DashboardToolbarProps["sortBy"])}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(SORT_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <Button variant="ghost" size="sm" onClick={() => { setScoreFilter("all"); setSortBy("newest"); }}>Clear all</Button>
                                <Button size="sm" onClick={() => setFiltersOpen(false)}>Done</Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* View toggle */}
                <div className="hidden items-center rounded-lg bg-muted p-0.5 sm:flex">
                    <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode("grid")} aria-label="Grid view">
                        <GridIcon className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode("list")} aria-label="List view">
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                <NewPitchButton orgId={organization?.id} variant="gold" size="sm" className="h-9 px-4 font-semibold" showIcon mobileIconOnly />
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Wire it into `dashboard-content.tsx`** — replace the `DashboardTabs` import and the `PitchFilters` import with `import { DashboardToolbar } from "./dashboard-toolbar";`. Then replace the `<DashboardTabs .../>` element and the entire `<PitchFilters ... />` block with a single element placed where `<DashboardTabs/>` currently sits (right after the opening wrapper `div`, before the scroll area content):

```tsx
      <DashboardToolbar
        currentView={viewParam}
        handleTabChange={handleTabChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        scoreFilter={scoreFilter}
        setScoreFilter={setScoreFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
```

Keep everything else (the `ScrollArea`, `DashboardStats`, grid/empty-state logic) unchanged. `searchValue`/`setSearchValue`/`handleSearch` stay owned by the Navbar (still destructured for that). `resultsCount` is no longer needed by the toolbar; the `<div className="seclabel">`-style count is not part of this toolbar.

- [ ] **Step 3: Delete the absorbed files**

```bash
git rm "src/app/(dashboard)/dashboard/_components/dashboard-tabs.tsx" "src/app/(dashboard)/dashboard/_components/pitch-filters.tsx"
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: succeeds. If TypeScript flags now-unused destructured vars in `dashboard-content.tsx` (e.g. `searchValue` if truly unused), confirm whether they're still passed to the Navbar via the layout; if genuinely unused, remove them. Do NOT remove `handleSearch`/`searchValue` if they are still consumed elsewhere in the file.

- [ ] **Step 5: Commit**

```bash
git add -A "src/app/(dashboard)/dashboard/_components/dashboard-toolbar.tsx" "src/app/(dashboard)/dashboard/_components/dashboard-content.tsx"
git commit -m "consolidate dashboard tabs and filters into toolbar"
```

---

## Task 8: Navbar light warm pass + remove dead code

**Files:** Modify `navigation/navbar.tsx`; Delete `_components/dashboard-header.tsx`.

- [ ] **Step 1: Title to Fraunces** — in `navbar.tsx`, change the `<h1>` className from `"hidden sm:block text-lg font-semibold truncate"` to:

```tsx
          <h1 className="hidden truncate font-display text-lg font-semibold sm:block">
```

(No other navbar changes — it's shared; keep the diff minimal.)

- [ ] **Step 2: Delete the dead header**

```bash
git rm "src/app/(dashboard)/dashboard/_components/dashboard-header.tsx"
```

- [ ] **Step 3: Confirm it was truly unused**

Run: `npx rg "dashboard-header|DashboardHeader" src` → no matches.

- [ ] **Step 4: Verify build**

Run: `npm run build` → succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A "src/components/shared/navigation/navbar.tsx"
git commit -m "warm navbar title, drop dead dashboard header"
```

---

## Task 9: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full build** — `npm run build` → succeeds, no type/lint errors.
- [ ] **Step 2: Full test suite** — `npx vitest run` → all pass (score-tier, score-ring, pitch-to-card, plus the Phase 1 tests).
- [ ] **Step 3: Grep for removed artifacts** — `npx rg "ScoreBadge|PitchFilters|DashboardTabs|dashboard-header|\\+14%" "src/app/(dashboard)"` → only legitimate remaining references (e.g. `ScoreBadge` may still be used elsewhere — confirm none remain in `stats.tsx`/`pitch-card.tsx`). Expect no `PitchFilters`, `DashboardTabs`, `dashboard-header`, or `+14%`.
- [ ] **Step 4: Visual smoke** — `npm run dev`, open `/dashboard`: one toolbar (tabs + filter/sort/view + gold New), stats strip with mono numbers + average ring, editorial cards with score rings; toggle grid/list; open mobile filter sheet (narrow window); favorite + click-through still work; empty states unaffected.
- [ ] **Step 5: Commit any smoke fixes** — `git commit -am "polish dashboard visuals"` (only if needed).

---

## Self-Review

**Spec coverage:**
- ScoreRing primitive + tier → Tasks 1, 2. ✓
- PitchCard redesign + input type → Tasks 3, 4. ✓
- Stats strip, no fake growth/cool colors → Task 5. ✓
- Toolbar consolidation (delete tabs+filters), preserve controls + mobile sheet, gold New, drop "New" tab but keep route → Tasks 6, 7. ✓
- Navbar light pass → Task 8. ✓
- Remove dead dashboard-header → Task 8. ✓
- Verification (build, vitest, grep, smoke) → Task 9. ✓

Non-goals respected: no Convex/query/routing/virtualization changes; `dashboard-content.tsx` stays the state owner and still feeds search to the Navbar.

**Placeholder scan:** none; every code step shows full code.

**Type consistency:** `ScoreTier` ("high"|"mid"|"low") defined in Task 1, consumed by `ScoreRing` (Task 2) and tokens `--score-high/mid/low`. `inputType?: "TEXT"|"AUDIO"` added to `PitchCardProps` (Task 3), produced by `toPitchCardProps` (Task 3), consumed by the card JSX (Task 4). `DashboardToolbar` props match the values `dashboard-content.tsx` already holds via `useDashboardState`. `NewPitchButton` `gold` variant (Task 6) is used by the toolbar (Task 7) and maps to the Button `gold` variant added in Phase 1.

**Note for executor:** `ScoreBadge` (`score-badge.tsx`) remains used by other surfaces (e.g. pitch detail); do NOT delete it — only stop using it in `pitch-card.tsx` and `stats.tsx`. The list view is `grid-cols-1` reusing the same `PitchCard` (confirmed in `pitches-grid.tsx`), so no separate row component is built.
