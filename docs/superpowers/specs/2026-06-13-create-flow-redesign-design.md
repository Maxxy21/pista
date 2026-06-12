# Create Flow Redesign — Design Spec (Phase 6)

**Date:** 2026-06-13
**Status:** Approved (direction), pending spec review
**Depends on:** Phase 1 foundation (warm tokens, fonts, `--gold`, `--score-*`), `LogoIcon`, gold-CTA convention (Phases 4–5) — all on `main`.

## Context

Phase 6 redesigns the **new-pitch / create flow** — the core creation action. The live flow is `NewPitchPanel` (`src/app/(dashboard)/dashboard/_components/new-pitch-panel.tsx`), rendered inline in the dashboard when `?view=new` (see `dashboard-content.tsx:72`). It is a single-panel form: a Q&A toggle, a title input, a 3-tab input (Text / Text File / Audio), an inline `ProcessingStatus`, a `QuestionsSection` (follow-up Q&A), and submit / skip buttons. State and submission live in hooks: `useNewPitchForm`, `useFileHandling`, `usePitchSubmission`, and the Zustand `useEvaluationProgress` store (`idle → uploading → transcribing → analyzing → complete → error`).

The flow works and is mostly on warm tokens, but carries debt and an underplayed payoff moment:
1. **Underplayed processing state** — the "AI is analyzing your pitch" moment is a small inline box (`processing-status.tsx`). It's the emotional payoff and deserves focus.
2. **One cool accent** — the Q&A "Answered" check is hardcoded `#4ade80` green (`questions-section.tsx:45`).
3. **No gold / Fraunces / mono** — heavy cream `primary/*` tints; the submit button and headings are plain; no mono on data.
4. **Dead code** — the entire legacy `src/components/shared/forms/add-pitches/` modal flow (`pitch-dialog`, `file-dialog`, `steps/`, `components/`) is unused (only self-references).

(`--destructive` is already warm rust, so the error state needs only restyling, not re-coloring.)

## Approved direction

Reconcile + elevate, **keeping the single-panel structure and all submission logic/hooks unchanged**. The marquee change is a **full-panel processing takeover** (chosen option B): while processing, the form is replaced by a centered, cinematic focus state.

## Goals

1. Rebuild the processing state as a **full-panel takeover**: glowing `LogoIcon`, a Fraunces anticipation line, and a vertical **Upload → Transcribe → Analyze** stepper driven by `useEvaluationProgress` (done = olive ✓, active = gold •), with a mono step/percent. Adapts to pitch type.
2. **Gold** primary CTA ("Create & Evaluate"); Fraunces panel heading.
3. **Warm the dropzones** (text + file tabs): dashed border goes gold on drag-active/hover, gold-tinted empty-state icon, mono size/format hints.
4. **Q&A section:** olive "Answered" (kill `#4ade80`), gold pulse dot, Fraunces heading.
5. **Delete** the dead `add-pitches/` folder.
6. Cool-color / hardcoded-hex sweep of the create-flow area.

### Non-goals

- No changes to submission/validation logic or the hooks (`useNewPitchForm`, `useFileHandling`, `usePitchSubmission`, `useEvaluationProgress`), the API routes, or Convex.
- No new pitch types, no wizard/multi-step restructure, no navigation changes (still routes to the new pitch on success).
- No edits to the `ui/tabs`, `ui/switch`, or other shared primitives beyond color/token usage already in place.

## Architecture / Data Flow

No data-flow change. `useEvaluationProgress` already exposes `step`, `message`, `progress`. The takeover consumes the store; `NewPitchPanel` decides form-vs-takeover.

**Form vs takeover decision (in `NewPitchPanel`):**
```ts
const { step } = useEvaluationProgress();
const showTakeover = submission.processing || step === "error";
```
When `showTakeover`, render `<ProcessingStatus type={form.type} onRetry={submission.retry} />` in the card body **in place of** the form controls (toggle, title, tabs, questions, buttons). Otherwise render the form as today. The card shell + header stay mounted.

**Stepper stages by pitch type** (`type: "text" | "textFile" | "audio"`):
- `audio` → `["Upload", "Transcribe", "Analyze"]`
- `textFile` → `["Upload", "Analyze"]`
- `text` → `["Analyze"]`

**Active stage from `step`:** `uploading`→Upload, `transcribing`→Transcribe, `analyzing`→Analyze, `complete`→all done. Stages before the active one render done (olive ✓); the active one gold; later ones muted.

## Components

### `processing-status.tsx` — rebuild as the takeover
**File:** `src/app/(dashboard)/dashboard/_components/new-pitch/processing-status.tsx` (rebuild; keep the export name `ProcessingStatus`).
- New prop: `type: "text" | "textFile" | "audio"`. Keep `onRetry?`. (The `processing`/`progress` props become unnecessary since it reads the store; `NewPitchPanel` now gates rendering, so `ProcessingStatus` can assume it is shown — but keep it returning `null` only when `step` is `idle`/`complete` as a guard.)
- **Active (non-error):** a centered column — `LogoIcon` (size `lg`) inside a gold-glow ring (`shadow` + `bg-[hsl(var(--gold)/0.2)] blur` pulse), a `font-display` anticipation line ("Reading your pitch like an investor would…"), then the vertical stepper built from the type→stages map and the active-stage logic above. Each row: a status dot (done = olive ✓, active = gold •, pending = muted), label, and for the active `uploading` stage with `progress`, a mono `{progress}%` + a thin warm `Progress` bar.
- **Error (`step === "error"`):** centered warm-rust card — `AlertTriangle` (`text-destructive`), "Evaluation failed" (`font-display`), the `message`, and the Retry `Button` (warm outline). Same content as today, restyled to the centered layout.
- Keep `role`/`aria-live` semantics (`status` for active, `alert` for error).

### `new-pitch-panel.tsx`
- Add `const { step } = useEvaluationProgress()` and the `showTakeover` gate; render takeover vs form as above.
- Heading "Create a New Pitch" → add `font-display`.
- Submit "Create & Evaluate" button → gold: `style={{ background: "hsl(var(--gold))", color: "hsl(var(--gold-foreground))" }}` (keep the loading spinner content and disabled logic). "Skip Q&A" stays `variant="outline"`.
- Remove the now-inline `<ProcessingStatus .../>` from the form body (it's rendered by the takeover branch instead). `QuestionsSection` stays in the form branch.

### `text-input-tab.tsx`
- Dropzone wrapper `border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background` → warm: dashed `border-[hsl(var(--border))]` that becomes `border-[hsl(var(--gold)/0.5)]` on focus-within/hover; keep the `GridPattern` mask.
- Empty-state icon circle `bg-primary/10 ... text-primary` → gold tint: `bg-[hsl(var(--gold)/0.12)]` + `text-[hsl(var(--gold))]`.
- Add a mono hint line under the label if absent? No — keep copy; only the warm border + gold icon change.

### `file-upload-tab.tsx`
- Same dropzone warm-tune (dashed warm border, gold on hover/drag-active).
- Size/format meta line (`${MB} • ${name}` / `${KB}`) → `font-mono` for the numeric portion (wrap in a `font-mono` span). Keep the preview + Remove logic.
- If `GridPattern`/`ui/file-upload.tsx` uses any cool color, warm it in the sweep (Goal 6).

### `questions-section.tsx`
- `style={{ color: "#4ade80" }}` "Answered" → `className="... text-[hsl(var(--score-high))]"` (drop the inline style).
- Pulse dot `bg-primary` → `bg-[hsl(var(--gold))]`.
- "Follow-up Questions" `<h3>` → add `font-display`.
- Tip box `border-primary/30` accent → keep (cream) or `border-[hsl(var(--gold)/0.3)]`. Logic unchanged.

### Delete dead code
- Remove `src/components/shared/forms/add-pitches/` entirely (`pitch-dialog.tsx`, `file-dialog.tsx`, `steps/`, `components/`). Confirm with a repo-wide grep that nothing outside that folder imports any of them first.

## Testing / Verification

- **Unit (Vitest):** a render smoke for `ProcessingStatus` — with the `useEvaluationProgress` store set to `analyzing` and `type="audio"`, it renders the anticipation line and shows "Analyze" as the active stage with "Upload"/"Transcribe" done; with `type="text"` it renders only the Analyze stage. (Mock/seed the Zustand store via its setters in the test.)
- **Build:** `npm run build` clean (watch for unused imports after the takeover refactor and the folder deletion).
- **Cool-color sweep:** grep the create-flow area (`src/app/(dashboard)/dashboard/_components/new-pitch*` + `src/components/ui/file-upload.tsx`) for cool classes / `#[0-9a-fA-F]{6}` → none (warm rust/gold/olive tokens excepted).
- **Manual smoke:** create a **text** pitch (takeover shows only Analyze, gold submit, lands on the pitch), and an **audio** pitch (takeover shows Upload→Transcribe→Analyze progressing, upload % in mono); trigger an error to see the warm rust failure + Retry; confirm warm dropzones (gold on hover), Q&A "Answered" is olive, no green.
- Full `npx vitest run` stays green.

## Open Questions / Deferred

- Exact anticipation copy ("Reading your pitch like an investor would…") — final wording tweakable at implementation.
- Whether to animate the stepper rows in (stagger) — default: a simple fade; keep light (tasteful-motion principle).
- The `ui/file-upload.tsx` `GridPattern` internals — only touched if the sweep finds cool colors; otherwise left as-is.
