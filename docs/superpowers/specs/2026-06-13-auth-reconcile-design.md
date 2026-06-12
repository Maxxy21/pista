# Auth Reconcile + DRY — Design Spec (Phase 7)

**Date:** 2026-06-13
**Status:** Approved (direction), pending spec review
**Depends on:** Phase 1 foundation (warm tokens, fonts), `LogoIcon`, `getClerkAppearance` (already warm) — all on `main`.

## Context

Phase 7 reconciles the **auth screens** (`src/app/(auth)/`) — the last unredesigned surface. The Clerk widgets themselves are already warm-themed: `SignInForm`/`SignUpForm` render Clerk's `<SignIn>`/`<SignUp>` with `getClerkAppearance()` (gold primary, warm surfaces, etc.), and the post-auth `Loading` component already uses `LogoIcon`.

The remaining debt is purely in the **page chrome**:
1. **Fake logo** — both pages render a hand-drawn `#F2EAD3` rounded `div` instead of `LogoIcon`, in **four** places (desktop + mobile × sign-in + sign-up).
2. **Hardcoded hexes** — `#0e0d0c` (bg, in both pages and `layout.tsx`), `#F2EAD3` (cream), and `rgba(242,234,211,0.x)` (text/borders/glow) bypass the warm tokens.
3. **~95% duplication** — `sign-in/.../page.tsx` and `sign-up/.../page.tsx` are near-identical; only the eyebrow badge, the two-line headline, and the description differ.

## Approved direction

Reconcile to the warm token system and **de-duplicate**: extract one shared `AuthScreen` split-screen shell that both pages render, passing per-page copy. Use `LogoIcon` + a Fraunces wordmark. The Clerk forms and `getClerkAppearance` are untouched.

## Goals

1. Create a shared `AuthScreen` component (split-screen shell) used by both pages.
2. Replace all four hand-drawn logo divs with `LogoIcon` + `font-display` "Pista" wordmark (defined once in `AuthScreen`: one desktop, one mobile).
3. Token every hardcoded hex in the auth chrome.
4. Reduce `sign-in/page.tsx` and `sign-up/page.tsx` to thin wrappers that supply copy + the form.

### Non-goals

- No changes to `getClerkAppearance` or the Clerk widget appearance.
- No auth logic / redirect / routing changes (`forceRedirectUrl="/dashboard"` etc. unchanged).
- No new routes, no left-panel elevation (no product motif / social proof).

## Architecture / Data Flow

`AuthScreen` is presentational (no data, no hooks beyond rendering). It owns the split-screen layout, the ambient glow, both logo placements, and the editorial copy block; it renders `children` (the Clerk form) in the right panel. The two page files become thin: they import `AuthScreen` + their form and pass copy as props. `(auth)/layout.tsx` only tokens its background. `SignInForm`/`SignUpForm` are unchanged.

## Components

### `AuthScreen` (new)
**File:** `src/components/shared/auth/auth-screen.tsx` (alongside `loading.tsx`).

```tsx
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

Notes:
- Token mapping applied: bg `#0e0d0c`→`bg-background`; glow `#F2EAD3`→`hsl(var(--foreground))`; cream text `#F2EAD3`→`text-foreground`; `rgba(242,234,211,0.5/0.45)`→`text-[hsl(var(--foreground)/0.5)]`/`/0.45]`; left border `rgba(242,234,211,0.08)`→`border-border`.
- The `gradient-shell`/`gradient-shell-inner` utilities are already token-sourced (Phase 4), so they stay.
- The right panel previously had an extra inner wrapper from `SignInForm` (`flex flex-1 items-center justify-center p-8`); that stays inside the form components — `AuthScreen` just centers `children`.

### `sign-in/[[...sign-in]]/page.tsx` (rewrite to thin wrapper)
```tsx
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

### `sign-up/[[...sign-up]]/page.tsx` (rewrite to thin wrapper)
```tsx
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

### `(auth)/layout.tsx`
Token the background:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
```

## Testing / Verification

- **Unit (Vitest):** a render smoke for `AuthScreen` — renders the `title` text and its `children` (e.g. a probe element). Keep light (presentational).
- **Build:** `npm run build` clean (watch for now-unused `Link`/`Image` imports removed from the page files).
- **Cool-color / hex sweep:** grep `src/app/(auth)` + `src/components/shared/auth/auth-screen.tsx` for `#[0-9a-fA-F]{6}` and cool color classes → none.
- **Manual smoke:** open `/sign-in` and `/sign-up` signed out — real `LogoIcon` (π + score bars) + display-font wordmark on both desktop (top-left) and mobile; warm background; correct per-page eyebrow/headline/description; the Clerk form is gold-themed; the left/right split holds and collapses to the form + mobile logo on narrow widths.
- Full `npx vitest run` stays green.

## Open Questions / Deferred

- Whether to also surface the `eyebrow`/copy as constants — deferred (inline props are fine for two call sites; YAGNI).
- Left-panel product motif / social proof — explicitly out of scope (deferred).
