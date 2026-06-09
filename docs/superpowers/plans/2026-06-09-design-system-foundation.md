# Design System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify Pista's two competing design languages into one warm-editorial theme — new tokens, fonts, logo, and Clerk theming — that every existing component inherits.

**Architecture:** Presentation-layer only. Remap shadcn's CSS variables (`globals.css`) to a warm palette so all Radix/shadcn primitives re-skin for free; swap fonts in `layout.tsx`/`tailwind.config.ts`; replace the generic logo with mark "B" (π over rising score bars); retune Clerk's `appearance`. No structural, data, or auth changes. Keep `--landing-*`, `--green/amber/red-rgb` as aliases over the new tokens so existing consumers don't break.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS 3, shadcn/ui + Radix, next/font/google, Clerk (`@clerk/themes`), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-06-09-design-system-foundation-design.md`

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/app/layout.tsx` | Load Fraunces/Hanken/JetBrains Mono, set body font | Modify |
| `tailwind.config.ts` | `fontFamily` (sans/display/mono), `gold` color | Modify |
| `src/app/globals.css` | Single warm-dark token source; score vars; warm rgb/chart aliases; remove light palette | Modify |
| `src/components/ui/button.tsx` | Add `gold` variant | Modify |
| `src/components/ui/logo-icon.tsx` | π+bars SVG mark | Rewrite |
| `src/components/ui/logo.tsx` | Mark + "Pi/sta" wordmark; remove "Pitch Perfect" | Rewrite |
| `src/components/ui/__tests__/logo-icon.test.tsx` | Render test for the mark | Create |
| `src/components/shared/landing/components/header.tsx` | Use shared logo | Modify |
| `src/app/icon.tsx` | Favicon = π+bars mark | Rewrite |
| `src/lib/utils/score.ts` | (unchanged logic) warm tone mapping lives in consumer | — |
| `src/app/(dashboard)/dashboard/_components/cards/score-badge.tsx` | Warm score tone classes | Modify |
| `src/components/ui/__tests__/score-badge.test.tsx` | Tone→class mapping test | Create |
| `src/lib/utils/clerk-appearance.ts` | Token-aligned Clerk theming + gold accent | Modify |
| landing/auth files using `font-playfair` | Migrate to `font-display` | Modify |

Each task ends with a commit. Commit messages are **short and lowercase, no co-author trailer** (per `CLAUDE.md`).

---

## Task 1: Swap fonts (Fraunces / Hanken Grotesk / JetBrains Mono)

**Files:**
- Modify: `src/app/layout.tsx:1-16,51-52`
- Modify: `tailwind.config.ts:26-29`

- [ ] **Step 1: Replace font imports/loaders in `layout.tsx`**

Replace lines 2–16 (the `Inter`/`Playfair_Display` imports and loaders) with:

```tsx
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

const hanken = Hanken_Grotesk({
    subsets: ["latin"],
    variable: "--font-hanken",
    display: "swap",
});

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});
```

- [ ] **Step 2: Apply the font variables on `<html>`/`<body>`**

Replace line 51 `<html ...>` opening tag and line 52 `<body ...>`:

```tsx
        <html lang="en" className={`${hanken.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
        <body className={hanken.className}>
```

- [ ] **Step 3: Update `tailwind.config.ts` `fontFamily`**

Replace lines 26–29:

```ts
            fontFamily: {
                sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
                display: ["var(--font-fraunces)", "Georgia", "serif"],
                serif: ["var(--font-fraunces)", "Georgia", "serif"],
                mono: ["var(--font-mono)", "ui-monospace", "monospace"],
            },
```

- [ ] **Step 4: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (the `font-playfair` class is migrated in Task 3; it still resolves to nothing harmful until then, but to avoid lint noise run Task 3 right after). If build fails on missing `--font-playfair`, that is expected to be resolved in Task 3 — proceed.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx tailwind.config.ts
git commit -m "swap to fraunces/hanken/jetbrains mono"
```

---

## Task 2: Unified warm-dark tokens in `globals.css`

**Files:**
- Modify: `src/app/globals.css:11-22` (landing tokens → aliases), `:63-171` (light/dark palette blocks), `:101-106` (rgb aliases)

- [ ] **Step 1: Replace the `@layer base { :root {...} .dark {...} }` block**

Replace the entire `@layer base` block that defines `:root` and `.dark` (lines 63–171) with the warm palette below. shadcn vars are HSL channel triplets; the app is dark-only, so `:root` carries the warm values and `.dark` mirrors them.

```css
@layer base {
    :root {
        --background: 30 8% 5%;
        --foreground: 44 50% 89%;
        --card: 35 12% 8%;
        --card-foreground: 44 50% 89%;
        --popover: 35 12% 8%;
        --popover-foreground: 44 50% 89%;
        --primary: 44 50% 89%;
        --primary-foreground: 30 8% 6%;
        --secondary: 35 12% 11%;
        --secondary-foreground: 44 50% 89%;
        --muted: 35 12% 11%;
        --muted-foreground: 42 18% 62%;
        --accent: 35 12% 13%;
        --accent-foreground: 44 50% 89%;
        --destructive: 20 61% 47%;
        --destructive-foreground: 44 50% 92%;
        --border: 40 10% 16%;
        --input: 40 10% 16%;
        --ring: 44 55% 60%;

        /* Brand accent */
        --gold: 44 67% 47%;
        --gold-foreground: 30 8% 6%;

        /* Score semantics */
        --score-high: 76 41% 50%;
        --score-mid: 44 67% 47%;
        --score-low: 20 61% 47%;

        /* Warm chart hues (recharts radar/bar) */
        --chart-1: 44 67% 52%;
        --chart-2: 76 41% 50%;
        --chart-3: 20 61% 47%;
        --chart-4: 38 45% 70%;
        --chart-5: 30 10% 55%;

        --radius: 0.65rem;

        --sidebar-background: 35 12% 7%;
        --sidebar-foreground: 44 50% 89%;
        --sidebar-primary: 44 50% 89%;
        --sidebar-primary-foreground: 30 8% 6%;
        --sidebar-accent: 35 12% 12%;
        --sidebar-accent-foreground: 44 50% 89%;
        --sidebar-border: 40 10% 16%;
        --sidebar-ring: 44 55% 60%;

        /* Warm RGB aliases (consumed by *-alpha utilities, navbar, chart) */
        --primary-rgb: 201 162 39;
        --green-rgb: 156 178 74;
        --amber-rgb: 201 162 39;
        --red-rgb: 194 96 47;
        --indigo-rgb: 201 162 39;
        --purple-rgb: 194 96 47;

        --transition-fast: 150ms;
        --transition-normal: 250ms;
        --transition-slow: 350ms;
        --ease-bounce: cubic-bezier(0.37, 1.63, 0.5, 0.95);
        --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
        --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

        --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
        --shadow-hover: 0 14px 20px -4px rgba(0, 0, 0, 0.5), 0 8px 12px -4px rgba(0, 0, 0, 0.4);

        --radius-sm: 0.25rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        --radius-full: 9999px;
    }

    .dark {
        --background: 30 8% 5%;
        --foreground: 44 50% 89%;
        --card: 35 12% 8%;
        --card-foreground: 44 50% 89%;
        --popover: 35 12% 8%;
        --popover-foreground: 44 50% 89%;
        --primary: 44 50% 89%;
        --primary-foreground: 30 8% 6%;
        --secondary: 35 12% 11%;
        --secondary-foreground: 44 50% 89%;
        --muted: 35 12% 11%;
        --muted-foreground: 42 18% 62%;
        --accent: 35 12% 13%;
        --accent-foreground: 44 50% 89%;
        --destructive: 20 61% 47%;
        --destructive-foreground: 44 50% 92%;
        --border: 40 10% 16%;
        --input: 40 10% 16%;
        --ring: 44 55% 60%;

        --gold: 44 67% 47%;
        --gold-foreground: 30 8% 6%;
        --score-high: 76 41% 50%;
        --score-mid: 44 67% 47%;
        --score-low: 20 61% 47%;

        --chart-1: 44 67% 52%;
        --chart-2: 76 41% 50%;
        --chart-3: 20 61% 47%;
        --chart-4: 38 45% 70%;
        --chart-5: 30 10% 55%;

        --sidebar-background: 35 12% 7%;
        --sidebar-foreground: 44 50% 89%;
        --sidebar-primary: 44 50% 89%;
        --sidebar-primary-foreground: 30 8% 6%;
        --sidebar-accent: 35 12% 12%;
        --sidebar-accent-foreground: 44 50% 89%;
        --sidebar-border: 40 10% 16%;
        --sidebar-ring: 44 55% 60%;
    }
}
```

- [ ] **Step 2: Point the `--landing-*` tokens at the unified source**

Replace the `:root { --landing-* }` block (lines 12–22) with aliases so the landing page shares one source of truth:

```css
/* Landing tokens now alias the unified system */
:root {
    --landing-bg: hsl(var(--background));
    --landing-surface: hsl(var(--card));
    --landing-cream: hsl(var(--foreground));
    --landing-cream-muted: hsl(var(--foreground) / 0.6);
    --landing-cream-faint: hsl(var(--foreground) / 0.08);
    --landing-border: hsl(var(--border));
    --landing-border-hover: hsl(var(--foreground) / 0.25);
    --landing-text: hsl(var(--foreground));
    --landing-text-muted: hsl(var(--muted-foreground));
}
```

- [ ] **Step 3: Verify build + visually confirm the theme shifted warm**

Run: `npm run build`
Expected: succeeds.
Run: `npm run dev`, open `http://localhost:3000/dashboard` (sign in if needed) — confirm the app background is warm-black and text is cream (not grey). No layout breakage.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "unify tokens into warm-editorial theme"
```

---

## Task 3: Migrate `font-playfair` → `font-display`

**Files (all contain `font-playfair`):**
- Modify: `src/components/shared/landing/components/hero.tsx`, `how-it-works.tsx`, `cta.tsx`, `features.tsx`
- Modify: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`, `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`

- [ ] **Step 1: Replace every `font-playfair` occurrence with `font-display`**

For each file above, find `font-playfair` and replace with `font-display` (the Tailwind key defined in Task 1). Do not change any other classes.

- [ ] **Step 2: Verify none remain in source**

Run: `npx rg "font-playfair" src`
Expected: no matches.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src
git commit -m "migrate playfair class to font-display"
```

---

## Task 4: Add `gold` button variant

**Files:**
- Modify: `src/components/ui/button.tsx:11-21`
- Modify: `tailwind.config.ts` (colors)

- [ ] **Step 1: Register the `gold` color in Tailwind**

In `tailwind.config.ts`, inside `theme.extend.colors`, add after the `primary` block:

```ts
                gold: {
                    DEFAULT: 'hsl(var(--gold))',
                    foreground: 'hsl(var(--gold-foreground))'
                },
```

- [ ] **Step 2: Add the `gold` variant to `buttonVariants`**

In `src/components/ui/button.tsx`, add to the `variant` map (after `link`):

```ts
        gold: "bg-gold text-gold-foreground hover:bg-gold/90",
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds; `<Button variant="gold">` is now available.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/button.tsx tailwind.config.ts
git commit -m "add gold button variant"
```

---

## Task 5: Warm score-badge tones

**Files:**
- Create: `src/components/ui/__tests__/score-badge.test.tsx`
- Modify: `src/app/(dashboard)/dashboard/_components/cards/score-badge.tsx:10-23`

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/__tests__/score-badge.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScoreBadge } from "@/app/(dashboard)/dashboard/_components/cards/score-badge";

describe("ScoreBadge", () => {
  it("uses a warm olive tone for high scores", () => {
    const { container } = render(<ScoreBadge score={9} />);
    expect(container.innerHTML).toContain("text-[hsl(var(--score-high))]");
  });

  it("uses a rust tone for low scores", () => {
    const { container } = render(<ScoreBadge score={2} />);
    expect(container.innerHTML).toContain("text-[hsl(var(--score-low))]");
  });

  it("renders nothing when score is undefined", () => {
    const { container } = render(<ScoreBadge />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ui/__tests__/score-badge.test.tsx`
Expected: FAIL (current classes are `bg-green-100 text-green-800`, not the warm tokens).

- [ ] **Step 3: Rewrite `toneToBadgeClass` with warm tones**

Replace lines 10–23 of `score-badge.tsx`:

```tsx
function toneToBadgeClass(tone: ReturnType<typeof getScoreTone>) {
  switch (tone) {
    case "green":
      return "bg-[hsl(var(--score-high)/0.15)] text-[hsl(var(--score-high))] border-transparent";
    case "blue":
      return "bg-[hsl(var(--score-high)/0.12)] text-[hsl(var(--score-high)/0.85)] border-transparent";
    case "yellow":
      return "bg-[hsl(var(--score-mid)/0.15)] text-[hsl(var(--score-mid))] border-transparent";
    case "red":
      return "bg-[hsl(var(--score-low)/0.15)] text-[hsl(var(--score-low))] border-transparent";
    default:
      return "bg-muted text-muted-foreground border-transparent";
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/__tests__/score-badge.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/cards/score-badge.tsx" src/components/ui/__tests__/score-badge.test.tsx
git commit -m "warm-tune score badge tones"
```

---

## Task 6: New logo mark (π + rising score bars)

**Files:**
- Create: `src/components/ui/__tests__/logo-icon.test.tsx`
- Rewrite: `src/components/ui/logo-icon.tsx`
- Rewrite: `src/components/ui/logo.tsx`
- Modify: `src/components/shared/landing/components/header.tsx:28-39`

LogoIcon keeps its existing API (`size?: "sm"|"md"|"lg"`, `className?`, default export) so all 8 call sites keep working.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/__tests__/logo-icon.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LogoIcon from "@/components/ui/logo-icon";

describe("LogoIcon", () => {
  it("renders an svg mark with a top bar and three rising bars (4 rects)", () => {
    const { container } = render(<LogoIcon />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(container.querySelectorAll("rect").length).toBe(4);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ui/__tests__/logo-icon.test.tsx`
Expected: FAIL (current LogoIcon renders a `<div>`, no `<svg>`/`<rect>`).

- [ ] **Step 3: Rewrite `logo-icon.tsx`**

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface LogoIconProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const px = { sm: 18, md: 22, lg: 28 } as const;

const LogoIcon = ({ className, size = "md" }: LogoIconProps) => {
    const s = px[size];
    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            aria-label="Pista"
            className={cn("text-foreground flex-shrink-0", className)}
        >
            {/* pi top bar */}
            <rect x="3" y="3.4" width="18" height="2.6" rx="1.3" fill="currentColor" />
            {/* three rising score bars; tallest-but-one tallest, rightmost gold */}
            <rect x="5.5" y="12.5" width="3" height="8" rx="1.5" fill="currentColor" fillOpacity="0.55" />
            <rect x="10.5" y="7" width="3" height="13.5" rx="1.5" fill="currentColor" fillOpacity="0.85" />
            <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" style={{ fill: "hsl(var(--gold))" }} />
        </svg>
    );
};

export default LogoIcon;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/__tests__/logo-icon.test.tsx`
Expected: PASS.

- [ ] **Step 5: Rewrite `logo.tsx` (mark + Pi/sta wordmark, drop "Pitch Perfect")**

```tsx
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";
import LogoIcon from "@/components/ui/logo-icon";

const Logo = () => {
    return (
        <Link
            href="/dashboard"
            className="font-normal flex items-center gap-2.5 py-1 relative z-20"
        >
            <LogoIcon size="md" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-lg font-semibold tracking-tight whitespace-pre"
            >
                <span className="text-gold">Pi</span>
                <span className="text-foreground">sta</span>
            </motion.span>
        </Link>
    );
};

export default Logo;
```

- [ ] **Step 6: Update the landing header to use the shared mark**

In `src/components/shared/landing/components/header.tsx`, add at the top with the other imports:

```tsx
import LogoIcon from "@/components/ui/logo-icon";
```

Replace the logo `<div>` (lines 29–32, the cream blob) with:

```tsx
                    <LogoIcon size="md" style={{ color: "var(--landing-cream)" }} />
```

(If TS complains that `style` isn't on `LogoIconProps`, instead wrap: `<span style={{ color: "var(--landing-cream)" }}><LogoIcon size="md" /></span>`.)

- [ ] **Step 7: Verify build + tests**

Run: `npm run build && npx vitest run src/components/ui/__tests__/logo-icon.test.tsx`
Expected: build succeeds, test passes.

- [ ] **Step 8: Confirm "Pitch Perfect" is gone**

Run: `npx rg "Pitch Perfect" src`
Expected: no matches.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/logo-icon.tsx src/components/ui/logo.tsx src/components/ui/__tests__/logo-icon.test.tsx "src/components/shared/landing/components/header.tsx"
git commit -m "new pista logo mark"
```

---

## Task 7: New favicon

**Files:**
- Rewrite: `src/app/icon.tsx`

- [ ] **Step 1: Replace the blue-blob favicon with the π+bars mark**

```tsx
import { ImageResponse } from 'next/og'

export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0E0D0C',
                    borderRadius: 7,
                }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3.4" width="18" height="2.6" rx="1.3" fill="#F2EAD3" />
                    <rect x="5.5" y="12.5" width="3" height="8" rx="1.5" fill="#F2EAD3" fillOpacity="0.55" />
                    <rect x="10.5" y="7" width="3" height="13.5" rx="1.5" fill="#F2EAD3" fillOpacity="0.85" />
                    <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" fill="#C9A227" />
                </svg>
            </div>
        ),
        { ...size }
    )
}
```

- [ ] **Step 2: Verify build + render**

Run: `npm run build`
Expected: succeeds.
Run `npm run dev`, open `http://localhost:3000/icon` — confirm the mark renders legibly (π bar + 3 bars, gold rightmost) on a dark rounded tile.

- [ ] **Step 3: Commit**

```bash
git add src/app/icon.tsx
git commit -m "new favicon"
```

---

## Task 8: Theme Clerk to the new tokens

**Files:**
- Modify: `src/lib/utils/clerk-appearance.ts`

- [ ] **Step 1: Update appearance — gold primary, new type, aligned surfaces**

Replace the `formButtonPrimary` line and add font/accent alignment. Replace the full `elements` object's `formButtonPrimary`, `footerActionLink`, `formResendCodeLink`, and add `formFieldInput` focus ring in gold:

```ts
      formButtonPrimary:
        "bg-[#C9A227] text-[#0e0d0c] hover:opacity-90 rounded-xl font-semibold shadow-none",
```

```ts
      formFieldInput:
        "bg-[rgba(242,234,211,0.05)] border border-[rgba(242,234,211,0.12)] text-[#F2EAD3] placeholder:text-[rgba(242,234,211,0.3)] rounded-xl focus:ring-1 focus:ring-[#C9A227]",
```

```ts
      footerActionLink: "text-[#C9A227] hover:opacity-80",
```

```ts
      formResendCodeLink: "text-[#C9A227]",
```

Leave the other element keys (card, headerTitle, social buttons, dividers, userButton popover, etc.) as-is — their hex values already match the warm tokens.

- [ ] **Step 2: Verify build + render sign-in**

Run: `npm run build`
Expected: succeeds.
Run `npm run dev`, open `http://localhost:3000/sign-in` — confirm primary button is gold, inputs have warm surfaces, links are gold, and the card matches the app surface.

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils/clerk-appearance.ts
git commit -m "theme clerk to warm palette"
```

---

## Task 9: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: succeeds, no type/lint errors.

- [ ] **Step 2: Full test suite (regression guard)**

Run: `npx vitest run`
Expected: all tests pass (logic untouched; new logo + score-badge tests pass).

- [ ] **Step 3: Grep for removed artifacts**

Run: `npx rg "Pitch Perfect|font-playfair|from-blue-500" src`
Expected: no matches (blue-gradient blob, stale wordmark, and playfair class all gone).

- [ ] **Step 4: Visual smoke check**

Run `npm run dev` and load each surface; confirm warm theme + readable contrast, no broken layouts:
- `/` (landing) — warm bg, new logo in header
- `/dashboard` — cards, score badges warm (olive/gold/rust), stats
- a pitch detail page `/pitch/<id>` — radar/bar charts in warm hues
- `/sign-in` — themed Clerk
- open the "new pitch" modal — inputs/buttons consistent

- [ ] **Step 5: Final commit (if any smoke-fix tweaks were needed)**

```bash
git add -A
git commit -m "polish foundation visuals"
```

---

## Self-Review

**Spec coverage:**
- Goal 1 (unified tokens, inherited by shadcn) → Task 2. ✓
- Goal 2 (fonts) → Tasks 1, 3. ✓
- Goal 3 (logo + favicon, fix "Pitch Perfect") → Tasks 6, 7. ✓
- Goal 4 (Clerk themed) → Task 8. ✓
- Goal 5 (primitives: button gold, score colors) → Tasks 4, 5. ✓
- Single dark theme / remove light palette → Task 2. ✓
- Score-color alias strategy (`--green/amber/red-rgb`, `--landing-*`) → Task 2. ✓
- Verification (build, vitest, grep, visual) → Task 9. ✓

Non-goals respected: no page layout redesigns, no auth/schema changes.

**Placeholder scan:** No TBD/TODO; every code step shows full code.

**Type consistency:** `LogoIcon` keeps `{ size?: "sm"|"md"|"lg"; className?: string }` default export across rewrite and consumers; `getScoreTone` return type reused unchanged in `toneToBadgeClass`; Tailwind `gold` color + `--gold`/`--gold-foreground` vars defined in Task 2 before use in Tasks 4/6.

**Note for executor:** `input.tsx`, `card.tsx`, `badge.tsx`, `tabs.tsx` are already fully token-driven, so Task 2's remap re-skins them automatically — no edits needed beyond the button `gold` variant. If the visual smoke check (Task 9) reveals a radius/contrast issue on one of them, fix it inline in that task.
