# Auth Reconcile + DRY Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the auth screens (`src/app/(auth)/`) to the warm token system and de-duplicate the two near-identical pages behind one shared `AuthScreen` shell using `LogoIcon` + a Fraunces wordmark.

**Architecture:** Extract a presentational `AuthScreen` split-screen component that owns the layout, ambient glow, both logo placements, and the editorial copy block, rendering the Clerk form as `children`. The `sign-in` and `sign-up` pages become thin wrappers passing per-page copy. `(auth)/layout.tsx` tokens its background. The Clerk widgets (`SignInForm`/`SignUpForm`) and `getClerkAppearance` are untouched.

**Tech Stack:** Next.js 15 App Router, React, Tailwind CSS 3 (warm HSL tokens), Vitest + Testing Library (jsdom).

**Reference spec:** `docs/superpowers/specs/2026-06-13-auth-reconcile-design.md`

---

### Task 1: Create the shared `AuthScreen` component

**Files:**
- Create: `src/components/shared/auth/auth-screen.tsx`
- Test: `src/components/shared/auth/__tests__/auth-screen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/shared/auth/__tests__/auth-screen.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthScreen } from "../auth-screen";

describe("AuthScreen", () => {
  it("renders the title, subtitle, description, and children", () => {
    render(
      <AuthScreen
        eyebrow="Test eyebrow"
        title="Welcome back."
        subtitle="Your pitches are waiting."
        description="Sign in to keep refining your pitch."
      >
        <div data-testid="form-probe">form goes here</div>
      </AuthScreen>
    );

    expect(screen.getByText("Welcome back.")).toBeDefined();
    expect(screen.getByText("Your pitches are waiting.")).toBeDefined();
    expect(screen.getByText("Sign in to keep refining your pitch.")).toBeDefined();
    expect(screen.getByTestId("form-probe")).toBeDefined();
  });

  it("renders the Pista wordmark via LogoIcon", () => {
    render(
      <AuthScreen eyebrow="e" title="t" subtitle="s" description="d">
        <div />
      </AuthScreen>
    );
    // LogoIcon renders an svg with aria-label "Pista"; desktop + mobile = 2
    expect(screen.getAllByLabelText("Pista").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pista").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/shared/auth/__tests__/auth-screen.test.tsx`
Expected: FAIL — cannot resolve module `../auth-screen`.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/shared/auth/auth-screen.tsx
import React from "react";
import Link from "next/link";
import LogoIcon from "@/components/ui/logo-icon";

interface AuthScreenProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
}

function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group w-fit ${className ?? ""}`}>
      <LogoIcon size="md" />
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">Pista</span>
    </Link>
  );
}

export function AuthScreen({ eyebrow, title, subtitle, description, children }: AuthScreenProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left editorial panel */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(ellipse at center, hsl(var(--foreground)) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <Brand />

        <div>
          <div className="gradient-shell inline-block mb-8">
            <div className="gradient-shell-inner px-4 py-2 text-xs font-medium tracking-widest uppercase text-[hsl(var(--foreground)/0.5)]">
              {eyebrow}
            </div>
          </div>
          <h2 className="font-display text-5xl leading-[1.1] tracking-tight mb-6 text-foreground">
            {title}
            <br />
            <span className="text-[hsl(var(--foreground)/0.45)]">{subtitle}</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs text-[hsl(var(--foreground)/0.45)]">
            {description}
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 border-l border-border">
        <Brand className="mb-10 lg:hidden" />
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/shared/auth/__tests__/auth-screen.test.tsx`
Expected: PASS (both tests green).

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/auth/auth-screen.tsx src/components/shared/auth/__tests__/auth-screen.test.tsx
git commit -m "add shared auth screen shell"
```

---

### Task 2: Rewrite the sign-in page as a thin wrapper

**Files:**
- Modify (full rewrite): `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { AuthScreen } from "@/components/shared/auth/auth-screen";
import { SignInForm } from "./_components/sign-in-form";

const SignInPage = () => (
  <AuthScreen
    eyebrow="AI pitch evaluation"
    title="Welcome back."
    subtitle="Your pitches are waiting."
    description="Sign in to review your evaluations, track improvements, and keep refining your pitch."
  >
    <SignInForm />
  </AuthScreen>
);

export default SignInPage;
```

- [ ] **Step 2: Verify the old `Link` import and hand-drawn logo divs are gone**

Run: `npx grep -n "F2EAD3\|0e0d0c\|next/link" "src/app/(auth)/sign-in/[[...sign-in]]/page.tsx"` (or use the Grep tool)
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(auth)/sign-in/[[...sign-in]]/page.tsx"
git commit -m "sign-in page uses shared auth screen"
```

---

### Task 3: Rewrite the sign-up page as a thin wrapper

**Files:**
- Modify (full rewrite): `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { AuthScreen } from "@/components/shared/auth/auth-screen";
import { SignUpForm } from "./_components/sign-up-form";

const SignUpPage = () => (
  <AuthScreen
    eyebrow="Get started free"
    title="Start pitching"
    subtitle="with confidence."
    description="Get expert-level AI feedback on your startup pitch in under 60 seconds. No gatekeeping, no scheduling."
  >
    <SignUpForm />
  </AuthScreen>
);

export default SignUpPage;
```

- [ ] **Step 2: Verify the old `Link` import and hand-drawn logo divs are gone**

Run: `npx grep -n "F2EAD3\|0e0d0c\|next/link" "src/app/(auth)/sign-up/[[...sign-up]]/page.tsx"` (or use the Grep tool)
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(auth)/sign-up/[[...sign-up]]/page.tsx"
git commit -m "sign-up page uses shared auth screen"
```

---

### Task 4: Token the auth layout background

**Files:**
- Modify: `src/app/(auth)/layout.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(auth)/layout.tsx"
git commit -m "token auth layout background"
```

---

### Task 5: Final verification & hex/cool-color sweep

**Files:** none (verification only)

- [ ] **Step 1: Hex + cool-color sweep of the auth surface**

Use the Grep tool over `src/app/(auth)` and `src/components/shared/auth/auth-screen.tsx`:
- Pattern `#[0-9a-fA-F]{6}` → Expected: no matches.
- Pattern `sky-|blue-|indigo-|cyan-|violet-|slate-|gray-|zinc-` → Expected: no matches.

If any match remains, replace it with the appropriate warm token per the spec mapping (`bg-background`, `text-foreground`, `text-[hsl(var(--foreground)/0.x)]`, `border-border`) and re-run.

- [ ] **Step 2: Full test suite**

Run: `npx vitest run`
Expected: all tests green (including the new `auth-screen` tests).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds with no errors and no unused-import warnings from the auth pages.

- [ ] **Step 4: Commit any sweep fixes (only if Step 1 changed files)**

```bash
git add -A
git commit -m "warm auth color sweep"
```

---

## Notes for the implementer

- `LogoIcon` is a **default** export from `@/components/ui/logo-icon`; it renders an `<svg>` with `aria-label="Pista"`.
- `font-display` = Fraunces; the `gradient-shell` / `gradient-shell-inner` utilities are already token-sourced (defined in `globals.css`) — do not redefine them.
- Do **not** touch `sign-in-form.tsx`, `sign-up-form.tsx`, `loading.tsx`, or `getClerkAppearance` — those are already warm and out of scope.
- Commit messages must be short, lowercase, single-line, with no AI/Claude references and no co-author trailers.
