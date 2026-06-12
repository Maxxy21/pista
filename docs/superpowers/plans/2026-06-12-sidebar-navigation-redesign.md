# Sidebar / Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the two sidebars and their navigation sub-components to the warm-editorial system (real LogoIcon, gold primary buttons, neutral type badges, gold favorites, warm skeletons, tokenized hexes) and elevate score display with the `ScoreRing` primitive.

**Architecture:** All edited components are presentational and keep their existing props/queries. Scores render through the shared `ScoreRing` + `getScoreTier`; the logo renders through the shared `LogoIcon`; primary actions and favorites use the `--gold` token. No changes to the shadcn `ui/sidebar.tsx` primitive, Convex queries, or Clerk/workspace logic.

**Tech Stack:** Next.js 15 client components, React, TypeScript, Tailwind CSS 3, framer-motion, Vitest + Testing Library (jsdom). Reused primitives: `@/components/ui/score-ring` (`ScoreRing`, `size: "sm"|"md"|"lg"|"xl"`, `score: number`), `@/components/ui/logo-icon` (default export `LogoIcon`, `size: "sm"|"md"|"lg"`).

**Reference spec:** `docs/superpowers/specs/2026-06-12-sidebar-navigation-redesign-design.md`

**Gold button convention (matches Phase 4 landing):** inline `style={{ background: "hsl(var(--gold))", color: "hsl(var(--gold-foreground))" }}`.

---

## File Structure

- **Modify** `src/components/shared/navigation/app-sidebar.tsx` — real LogoIcon + wordmark, gold New Pitch.
- **Modify** `src/components/shared/navigation/sidebar-nav.tsx` — gold "New" badge.
- **Modify** `src/components/shared/navigation/pitch-list-item.tsx` — ScoreRing treatment (drop amber star).
- **Create** `src/components/shared/navigation/__tests__/pitch-list-item.test.tsx` — render smoke.
- **Modify** `src/components/shared/navigation/pitch-current-banner.tsx` — ring-led warm card.
- **Modify** `src/components/shared/navigation/pitch-details-sidebar.tsx` — logo, gold New Pitch, neutral type badges, gold favorite, warm skeleton.
- **Modify** `src/components/shared/navigation/nav-user-navbar.tsx` — sign-out red → rust.

---

### Task 1: Dashboard sidebar chrome (`app-sidebar.tsx` + `sidebar-nav.tsx`)

**Files:**
- Modify: `src/components/shared/navigation/app-sidebar.tsx`
- Modify: `src/components/shared/navigation/sidebar-nav.tsx`

`LogoIcon` is already imported in `app-sidebar.tsx` (line 25) but unused; this task uses it.

- [ ] **Step 1: Replace the collapsed logo shape**

In `app-sidebar.tsx`, find:
```tsx
                {state === "collapsed" ? (
                    <div className="flex flex-col items-center space-y-3">
                        <div
                            className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                            style={{ background: "#F2EAD3" }}
                        />
                    </div>
                ) : (
```
Replace with:
```tsx
                {state === "collapsed" ? (
                    <div className="flex flex-col items-center space-y-3">
                        <LogoIcon size="md" />
                    </div>
                ) : (
```

- [ ] **Step 2: Replace the expanded logo + wordmark**

In `app-sidebar.tsx`, find:
```tsx
                        <div className="flex items-center gap-2.5">
                            <div
                                className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                                style={{ background: "#F2EAD3" }}
                            />
                            <h1 className="text-lg font-semibold tracking-tight" style={{ color: "#F2EAD3" }}>
                                Pista
                            </h1>
                        </div>
```
Replace with:
```tsx
                        <div className="flex items-center gap-2.5">
                            <LogoIcon size="md" />
                            <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">
                                Pista
                            </h1>
                        </div>
```

- [ ] **Step 3: Make the footer New Pitch button gold**

In `app-sidebar.tsx`, find:
```tsx
                            style={{ background: "#F2EAD3", color: "#0e0d0c" }}
```
Replace with:
```tsx
                            style={{ background: "hsl(var(--gold))", color: "hsl(var(--gold-foreground))" }}
```

- [ ] **Step 4: Make the SidebarNav "New" badge gold**

In `sidebar-nav.tsx`, find:
```tsx
                style={{ background: "#F2EAD3", color: "#0e0d0c" }}
```
Replace with:
```tsx
                style={{ background: "hsl(var(--gold))", color: "hsl(var(--gold-foreground))" }}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Compiles with no errors (LogoIcon now used; no remaining `#F2EAD3`/`#0e0d0c` in either file).

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/navigation/app-sidebar.tsx src/components/shared/navigation/sidebar-nav.tsx
git commit -m "real logo and gold buttons in dashboard sidebar"
```

---

### Task 2: Pitch list item — ScoreRing (`pitch-list-item.tsx`)

**Files:**
- Modify: `src/components/shared/navigation/pitch-list-item.tsx`
- Test: `src/components/shared/navigation/__tests__/pitch-list-item.test.tsx`

- [ ] **Step 1: Write the failing render smoke test**

```tsx
// src/components/shared/navigation/__tests__/pitch-list-item.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PitchListItem } from "../pitch-list-item";

describe("PitchListItem", () => {
  it("renders the title and the score", () => {
    render(
      <PitchListItem
        title="Acme AI seed deck"
        creationTime={Date.now()}
        score={7.1}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText("Acme AI seed deck")).toBeDefined();
    expect(screen.getByText("7.1")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/shared/navigation/__tests__/pitch-list-item.test.tsx`
Expected: FAIL — the current component renders the score only inside a star row as `{score.toFixed(1)}` which IS "7.1", so this might pass on title but the layout changes below are still required. If it already passes, proceed to Step 3 anyway (the refactor must still happen); re-run after Step 3 to confirm it stays green.

- [ ] **Step 3: Rewrite the component to use ScoreRing**

Replace the ENTIRE contents of `src/components/shared/navigation/pitch-list-item.tsx` with:
```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock8 } from "lucide-react";
import { format } from "date-fns";
import { ScoreRing } from "@/components/ui/score-ring";

interface PitchListItemProps {
  title: string;
  creationTime: number;
  score: number;
  onClick: () => void;
}

export function PitchListItem({ title, creationTime, score, onClick }: PitchListItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="h-auto py-3 px-4 justify-start w-full text-left hover:bg-muted/50 rounded-xl transition-all duration-200 border border-transparent hover:border-border"
      >
        <div className="flex w-full items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <span className="w-full truncate text-left text-sm font-semibold leading-tight text-foreground/90 group-hover:text-foreground">
              {title}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock8 className="h-3 w-3" />
              <span>{format(new Date(creationTime), "MMM d")}</span>
            </div>
          </div>
          <ScoreRing score={score} size="sm" />
        </div>
      </Button>
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/shared/navigation/__tests__/pitch-list-item.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Compiles cleanly (no unused `ChevronLeft`/`Star` imports — they were removed).

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/navigation/pitch-list-item.tsx src/components/shared/navigation/__tests__/pitch-list-item.test.tsx
git commit -m "score ring in pitch list item"
```

---

### Task 3: Current-pitch banner — ring-led warm card (`pitch-current-banner.tsx`)

**Files:**
- Modify: `src/components/shared/navigation/pitch-current-banner.tsx`

- [ ] **Step 1: Rewrite the component**

Replace the ENTIRE contents of `src/components/shared/navigation/pitch-current-banner.tsx` with:
```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ScoreRing } from "@/components/ui/score-ring";

interface CurrentPitchBannerProps {
  title: string;
  creationTime: number;
  score: number;
  typeBadge: React.ReactNode;
  authorName?: string;
  userImageUrl?: string | null;
  contextNote?: string | null;
}

export function CurrentPitchBanner({
  title,
  creationTime,
  score,
  typeBadge,
  authorName,
  userImageUrl,
  contextNote,
}: CurrentPitchBannerProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        {contextNote ? (
          <div className="mb-3 rounded-md border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.1)] px-2 py-1 text-[11px] text-[hsl(var(--gold))]">
            {contextNote}
          </div>
        ) : null}

        <div className="flex items-start gap-3">
          <ScoreRing score={score} size="md" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base leading-snug line-clamp-2 text-foreground">{title}</h2>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(creationTime), "MMM d, yyyy")}</span>
            </div>
            <div className="mt-2">{typeBadge}</div>
          </div>
        </div>

        <Separator className="my-3 bg-border" />

        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border">
            <AvatarImage src={userImageUrl || undefined} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              {authorName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground">{authorName}</span>
        </div>
      </div>
    </motion.div>
  );
}
```

(Note: the `Badge` import is intentionally gone — the score is now the ring, and `typeBadge` is supplied by the parent.)

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles cleanly (no unused `Badge` import).

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/navigation/pitch-current-banner.tsx
git commit -m "ring-led warm current pitch banner"
```

---

### Task 4: Pitch-detail sidebar (`pitch-details-sidebar.tsx`)

**Files:**
- Modify: `src/components/shared/navigation/pitch-details-sidebar.tsx`

- [ ] **Step 1: Import LogoIcon**

Find:
```tsx
import { SearchForm } from "../forms/search-form";
```
Add immediately above it:
```tsx
import LogoIcon from "@/components/ui/logo-icon";
```

- [ ] **Step 2: Warm the loading skeleton**

Find:
```tsx
                <SidebarHeader className="p-4 border-b">
                    <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                </SidebarHeader>
                <div className="p-4 space-y-4">
                    <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
```
Replace with:
```tsx
                <SidebarHeader className="p-4 border-b">
                    <div className="animate-pulse h-8 bg-muted rounded" />
                </SidebarHeader>
                <div className="p-4 space-y-4">
                    <div className="animate-pulse h-6 bg-muted rounded w-1/2" />
                    <div className="animate-pulse h-4 bg-muted rounded w-3/4" />
                </div>
```

- [ ] **Step 3: Replace the collapsed logo shape**

Find:
```tsx
                {state === "collapsed" ? (
                    <div className="flex flex-col items-center space-y-3">
                        <div
                            className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                            style={{ background: "#F2EAD3" }}
                        />
                        <SidebarMenuButton
```
Replace with:
```tsx
                {state === "collapsed" ? (
                    <div className="flex flex-col items-center space-y-3">
                        <LogoIcon size="md" />
                        <SidebarMenuButton
```

- [ ] **Step 4: Replace the expanded logo + wordmark**

Find:
```tsx
                        <div className="flex items-center gap-2.5">
                            <div
                                className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                                style={{ background: "#F2EAD3" }}
                            />
                            <h1 className="text-lg font-semibold tracking-tight" style={{ color: "#F2EAD3" }}>
                                Pista
                            </h1>
                        </div>
```
Replace with:
```tsx
                        <div className="flex items-center gap-2.5">
                            <LogoIcon size="md" />
                            <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">
                                Pista
                            </h1>
                        </div>
```

- [ ] **Step 5: Neutral type badges**

Find:
```tsx
            case "audio":
                return <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 hover:bg-emerald-500/20 font-medium">Audio</Badge>;
            case "textFile":
                return <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 border-blue-500/25 hover:bg-blue-500/20 font-medium">File</Badge>;
            default:
                return <Badge variant="secondary" className="bg-purple-500/15 text-purple-700 border-purple-500/25 hover:bg-purple-500/20 font-medium">Text</Badge>;
```
Replace with:
```tsx
            case "audio":
                return <Badge variant="secondary" className="bg-muted text-muted-foreground border-border font-medium">Audio</Badge>;
            case "textFile":
                return <Badge variant="secondary" className="bg-muted text-muted-foreground border-border font-medium">File</Badge>;
            default:
                return <Badge variant="secondary" className="bg-muted text-muted-foreground border-border font-medium">Text</Badge>;
```

- [ ] **Step 6: Gold favorite (collapsed) state**

Find:
```tsx
                                        className={`rounded-lg transition-all duration-200 hover:shadow-sm ${
                                            currentPitch.isFavorite 
                                                ? "bg-yellow-500/15 text-yellow-700 border-yellow-500/25 hover:bg-yellow-500/20" 
                                                : ""
                                        }`}
```
Replace with:
```tsx
                                        className={`rounded-lg transition-all duration-200 hover:shadow-sm ${
                                            currentPitch.isFavorite 
                                                ? "bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))] border-[hsl(var(--gold)/0.25)] hover:bg-[hsl(var(--gold)/0.2)]" 
                                                : ""
                                        }`}
```

- [ ] **Step 7: Gold favorite star fill**

Find:
```tsx
                                        <Star className={`h-4 w-4 ${currentPitch.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
```
Replace with:
```tsx
                                        <Star className={`h-4 w-4 ${currentPitch.isFavorite ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" : ""}`} />
```

- [ ] **Step 8: Gold footer New Pitch button**

Find:
```tsx
                            style={{ background: "#F2EAD3", color: "#0e0d0c" }}
```
Replace with:
```tsx
                            style={{ background: "hsl(var(--gold))", color: "hsl(var(--gold-foreground))" }}
```

- [ ] **Step 9: Verify build**

Run: `npm run build`
Expected: Compiles cleanly.

- [ ] **Step 10: Commit**

```bash
git add src/components/shared/navigation/pitch-details-sidebar.tsx
git commit -m "warm pitch detail sidebar chrome"
```

---

### Task 5: Sign-out tone + folder sweep (`nav-user-navbar.tsx`)

**Files:**
- Modify: `src/components/shared/navigation/nav-user-navbar.tsx`

- [ ] **Step 1: Warm the sign-out tone (red → rust)**

Find:
```tsx
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-red-500 focus:text-red-500">
```
Replace with:
```tsx
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-[hsl(var(--score-low))] focus:text-[hsl(var(--score-low))]">
```

- [ ] **Step 2: Folder-wide cool-color sweep**

Use the Grep tool over `src/components/shared/navigation` for:
`(text|bg|border|fill|stroke)-(green|blue|red|amber|emerald|sky|indigo|cyan|teal|violet|purple|yellow|gray|slate|zinc)-\d|#F2EAD3|#0e0d0c`
Expected: **No matches.** If any remain (e.g. in `team-switcher.tsx`, `theme-menu.tsx`, `create-organization-modal.tsx`, `organization-list.tsx`, `workspace-badge.tsx`), warm/tokenize them (cool accent → `--gold`; destructive → `--score-low`; gray → `muted`/`border`) without structural changes, and include those files in the commit.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Compiles cleanly.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/navigation/nav-user-navbar.tsx
git commit -m "warm sign-out tone and finish navigation sweep"
```
(Include any additional swept files in the `git add` if Step 2 found more.)

---

### Task 6: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Cool-color sweep confirmation**

Grep `src/components/shared/navigation` for:
`(text|bg|border|fill|stroke)-(green|blue|red|amber|emerald|sky|indigo|cyan|teal|violet|purple|yellow|gray|slate|zinc)-\d|#F2EAD3|#0e0d0c|#f2ead3`
Expected: **No matches.**

- [ ] **Step 2: Full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing suite + the new `pitch-list-item` test).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 4: Manual smoke (dev server)**

Run `npm run dev`. Check, signed in:
- **Dashboard** (`/dashboard`): sidebar shows the real LogoIcon (π + score bars) + "Pista" in the display font; "New Pitch" is gold; the "New" badge on Favorites is gold; collapse the sidebar (rail) and confirm the icon-only logo.
- **Pitch detail** (`/pitch/<id>`): sidebar shows LogoIcon + wordmark; current-pitch banner is ring-led (md ScoreRing, tier color) with a neutral type pill; recent-pitch items each show a tier-colored `sm` ScoreRing; type badges are neutral; favorite star is gold (toggle it); collapsed favorite button is gold when active; "New Pitch" is gold; search, back, share, export still work.
- No cool green/blue/red/yellow/gray anywhere in either sidebar.

- [ ] **Step 5: No commit needed** unless Step 1/2/3 surfaced a fix.

---

## Self-Review Notes

- **Spec coverage:** real LogoIcon + display wordmark (Tasks 1, 4) ✓; gold New Pitch + "New" badge (Tasks 1, 4) ✓; ScoreRing list items (Task 2) ✓; ring-led warm banner + warm contextNote (Task 3) ✓; neutral type badges (Task 4) ✓; gold favorite (Task 4) ✓; warm skeleton (Task 4) ✓; folder-wide cool-color sweep incl. sign-out (Tasks 5, 6) ✓; pitch-list-item render smoke (Task 2) ✓; non-goals respected (no IA/Convex/Clerk-logic/`ui/sidebar.tsx` changes).
- **Type consistency:** `ScoreRing` used as `score: number`, `size: "sm"|"md"`; `LogoIcon` default import, `size: "md"`; `CurrentPitchBanner` props unchanged (parent call site in `pitch-details-sidebar.tsx` still passes the same props). `PitchListItem` props unchanged.
- **Placeholder scan:** every code step contains full content; the only "find more" step (Task 5 Step 2) is a deterministic grep with explicit warm-mapping rules, not a vague placeholder.
- **Note:** Task 2 Step 2's test may pass before the refactor (the old markup also renders "7.1"); the plan calls this out and still requires the Step 3 rewrite, re-confirming green after.
