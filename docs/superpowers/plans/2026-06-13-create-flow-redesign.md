# Create Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the new-pitch create flow — rebuild the processing state as a full-panel "analyzing" takeover, apply gold/Fraunces/mono polish, warm the dropzones and Q&A, and delete the dead legacy dialog — without touching any submission logic.

**Architecture:** All edits are presentational. The processing takeover reads the existing `useEvaluationProgress` Zustand store; `NewPitchPanel` decides form-vs-takeover from `submission.processing` / the store's `error` step. Hooks, API routes, and Convex are untouched.

**Tech Stack:** Next.js 15 client components, React, TypeScript, Tailwind CSS 3, zustand (`useEvaluationProgress`), Vitest + Testing Library (jsdom). Reused: `LogoIcon`, `Progress`, warm `--gold`/`--score-*` tokens.

**Reference spec:** `docs/superpowers/specs/2026-06-13-create-flow-redesign-design.md`

**Gold CTA convention:** inline `style={{ background: "hsl(var(--gold))", color: "hsl(var(--gold-foreground))" }}`.

---

## File Structure

- **Modify** `src/app/(dashboard)/dashboard/_components/new-pitch/processing-status.tsx` — rebuild as the full-panel takeover (stepper by pitch type).
- **Create** `src/app/(dashboard)/dashboard/_components/new-pitch/__tests__/processing-status.test.tsx` — render smoke.
- **Modify** `src/app/(dashboard)/dashboard/_components/new-pitch-panel.tsx` — takeover gate, Fraunces header, gold submit.
- **Modify** `src/app/(dashboard)/dashboard/_components/new-pitch/text-input-tab.tsx` — warm dropzone + gold icon.
- **Modify** `src/app/(dashboard)/dashboard/_components/new-pitch/file-upload-tab.tsx` — warm dropzone + mono meta.
- **Modify** `src/app/(dashboard)/dashboard/_components/new-pitch/questions-section.tsx` — olive "Answered", gold dot, Fraunces heading.
- **Delete** `src/components/shared/forms/add-pitches/` (entire dead folder).

Store reference: `useEvaluationProgress` (`src/hooks/use-evaluation-progress.ts`) — `step: 'idle'|'uploading'|'transcribing'|'analyzing'|'complete'|'error'`, plus `message?`, `progress?`. It is a zustand `create(...)` hook, so tests can seed it via `useEvaluationProgress.setState({...})`.

---

### Task 1: Rebuild the processing takeover

**Files:**
- Modify: `src/app/(dashboard)/dashboard/_components/new-pitch/processing-status.tsx`
- Test: `src/app/(dashboard)/dashboard/_components/new-pitch/__tests__/processing-status.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/(dashboard)/dashboard/_components/new-pitch/__tests__/processing-status.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessingStatus } from "../processing-status";
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress";

describe("ProcessingStatus", () => {
  beforeEach(() => {
    useEvaluationProgress.setState({ step: "idle", message: undefined, progress: undefined });
  });

  it("shows all three stages for an audio pitch while analyzing", () => {
    useEvaluationProgress.setState({ step: "analyzing" });
    render(<ProcessingStatus type="audio" />);
    expect(screen.getByText("Reading your pitch like an investor would…")).toBeDefined();
    expect(screen.getByText("Upload")).toBeDefined();
    expect(screen.getByText("Transcribe")).toBeDefined();
    expect(screen.getByText("Analyze")).toBeDefined();
  });

  it("shows only the Analyze stage for a text pitch", () => {
    useEvaluationProgress.setState({ step: "analyzing" });
    render(<ProcessingStatus type="text" />);
    expect(screen.getByText("Analyze")).toBeDefined();
    expect(screen.queryByText("Upload")).toBeNull();
  });

  it("renders the error state with a retry button", () => {
    useEvaluationProgress.setState({ step: "error", message: "Boom" });
    render(<ProcessingStatus type="text" onRetry={() => {}} />);
    expect(screen.getByText("Evaluation failed")).toBeDefined();
    expect(screen.getByText("Retry")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/(dashboard)/dashboard/_components/new-pitch/__tests__/processing-status.test.tsx"`
Expected: FAIL — the current component has no `type` prop / different markup (no "Reading your pitch…" text).

- [ ] **Step 3: Replace the component**

Replace the ENTIRE contents of `processing-status.tsx` with:
```tsx
import React from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import LogoIcon from "@/components/ui/logo-icon"
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress"

type PitchType = "text" | "textFile" | "audio"

interface ProcessingStatusProps {
  type: PitchType
  onRetry?: () => void
}

const STAGES_BY_TYPE: Record<PitchType, string[]> = {
  audio: ["Upload", "Transcribe", "Analyze"],
  textFile: ["Upload", "Analyze"],
  text: ["Analyze"],
}

const STEP_TO_STAGE: Record<string, string> = {
  uploading: "Upload",
  transcribing: "Transcribe",
  analyzing: "Analyze",
}

export function ProcessingStatus({ type, onRetry }: ProcessingStatusProps) {
  const { step, message, progress } = useEvaluationProgress()

  if (step === "idle" || step === "complete") return null

  if (step === "error") {
    return (
      <div
        className="flex flex-col items-center gap-4 py-10 text-center"
        role="alert"
        aria-live="assertive"
      >
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <div>
          <p className="font-display text-lg text-destructive">Evaluation failed</p>
          <p className="mt-1 text-sm text-muted-foreground">{message || "Something went wrong."}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={onRetry}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  const stages = STAGES_BY_TYPE[type]
  const activeStage = STEP_TO_STAGE[step] ?? "Analyze"
  const activeIndex = stages.indexOf(activeStage)
  const isUploading = activeStage === "Upload" && progress !== undefined

  return (
    <div
      className="flex flex-col items-center gap-6 py-10 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <LogoIcon size="lg" />
        <div className="absolute -inset-2 -z-10 rounded-full bg-[hsl(var(--gold)/0.2)] blur-md animate-pulse" />
      </div>

      <h3 className="font-display text-xl max-w-xs text-foreground">
        Reading your pitch like an investor would…
      </h3>

      <div className="flex w-56 flex-col gap-3 text-left">
        {stages.map((stage, i) => {
          const done = activeIndex >= 0 && i < activeIndex
          const active = i === activeIndex
          return (
            <div
              key={stage}
              className={`flex items-center gap-3 text-sm ${
                done || active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                  done
                    ? "border-[hsl(var(--score-high))] text-[hsl(var(--score-high))]"
                    : active
                    ? "border-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                    : "border-border text-muted-foreground"
                }`}
              >
                {done ? "✓" : active ? "•" : i + 1}
              </span>
              <span>{stage}</span>
              {active && stage === "Upload" && progress !== undefined && (
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          )
        })}
      </div>

      {message && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {message}
        </p>
      )}

      {isUploading && (
        <div className="w-56">
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/(dashboard)/dashboard/_components/new-pitch/__tests__/processing-status.test.tsx"`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/new-pitch/processing-status.tsx" "src/app/(dashboard)/dashboard/_components/new-pitch/__tests__/processing-status.test.tsx"
git commit -m "full-panel analyzing takeover"
```

---

### Task 2: Wire the takeover into NewPitchPanel

**Files:**
- Modify: `src/app/(dashboard)/dashboard/_components/new-pitch-panel.tsx`

- [ ] **Step 1: Replace the whole component file**

Replace the ENTIRE contents of `new-pitch-panel.tsx` with:
```tsx
"use client"

import React from "react"
import { useOrganization } from "@clerk/nextjs"
import { useWorkspace } from "@/hooks/use-workspace"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { FileAudio2, FileText as FileTextIcon, Upload, Mic } from "lucide-react"
import { useNewPitchForm, type PitchType } from "@/hooks/use-new-pitch-form"
import { useFileHandling } from "@/hooks/use-file-handling"
import { usePitchSubmission } from "@/hooks/use-pitch-submission"
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress"
import { TextInputTab } from "./new-pitch/text-input-tab"
import { FileUploadTab } from "./new-pitch/file-upload-tab"
import { QuestionsSection } from "./new-pitch/questions-section"
import { ProcessingStatus } from "./new-pitch/processing-status"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function NewPitchPanel() {
  const { organization } = useOrganization()
  const workspace = useWorkspace()

  const form = useNewPitchForm()
  const fileHandling = useFileHandling(form.type)
  const submission = usePitchSubmission()
  const { step } = useEvaluationProgress()

  const showTakeover = submission.processing || step === "error"
  const canSubmitWithFile = form.canSubmitBase || (form.type !== "text" && fileHandling.hasValidFile())

  const handleSubmit = () => {
    submission.submitPitch(
      form.title,
      form.type,
      form.text,
      fileHandling.file,
      form.qa,
      form.enableQA,
      form.stage,
      form.preparedText,
      fileHandling.readTextFile,
      form.setQuestions,
      form.setStage,
      form.setPreparedText
    )
  }

  const handleSkipQA = () => {
    submission.skipQAAndSubmit(form.title, form.type, form.preparedText, form.text)
  }

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-2">
      <Card className="overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg md:text-xl font-semibold">Create a New Pitch</h2>
            {workspace.mode === "org" && (
              <span className="text-xs text-muted-foreground">
                Creating in {organization?.name || "Organization"}
              </span>
            )}
          </div>
        </div>

        <CardContent className="p-4 md:p-6">
          {showTakeover ? (
            <ProcessingStatus type={form.type} onRetry={submission.retry} />
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="improve-qa">Improve evaluation with follow-up questions</Label>
                  <p className="text-xs text-muted-foreground">Answering 1–3 questions can improve accuracy.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{form.enableQA ? 'On' : 'Off'}</span>
                  <Switch
                    id="improve-qa"
                    checked={form.enableQA}
                    onCheckedChange={form.setEnableQA}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => form.setTitle(e.target.value)}
                  placeholder='e.g. "AI-powered inventory management for SMBs"'
                />
              </div>

              <Tabs value={form.type} onValueChange={(v) => form.setType(v as PitchType)}>
                <TabsList className="grid w-full grid-cols-3 h-11">
                  <TabsTrigger value="text" className="flex items-center gap-2 text-xs sm:text-sm">
                    <FileTextIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="textFile" className="flex items-center gap-2 text-xs sm:text-sm">
                    <FileAudio2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Text </span>File
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center gap-2 text-xs sm:text-sm">
                    <Mic className="w-4 h-4" />
                    <span className="hidden sm:inline">Audio</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-2">
                  <TextInputTab
                    text={form.text}
                    setText={form.setText}
                    textFocused={form.textFocused}
                    setTextFocused={form.setTextFocused}
                  />
                </TabsContent>

                <TabsContent value="textFile" className="space-y-2">
                  <FileUploadTab
                    type="textFile"
                    file={fileHandling.file}
                    preview={fileHandling.preview}
                    onFilesSelected={fileHandling.handleFilesSelected}
                    onRemoveFile={fileHandling.removeFile}
                  />
                </TabsContent>

                <TabsContent value="audio" className="space-y-2">
                  <FileUploadTab
                    type="audio"
                    file={fileHandling.file}
                    preview={fileHandling.preview}
                    onFilesSelected={fileHandling.handleFilesSelected}
                    onRemoveFile={fileHandling.removeFile}
                  />
                </TabsContent>
              </Tabs>

              <QuestionsSection
                qa={form.qa}
                updateQAAnswer={form.updateQAAnswer}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmitWithFile || submission.processing || submission.pending}
                  className="w-full sm:w-auto h-11 text-sm font-medium touch-manipulation"
                  size="lg"
                  style={{ background: "hsl(var(--gold))", color: "hsl(var(--gold-foreground))" }}
                >
                  {submission.processing || submission.pending ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner variant="minimal" size="sm" />
                      {form.stage === 'questions' ? 'Evaluating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {form.stage === 'questions' ? 'Evaluate with Answers' : 'Create & Evaluate'}
                    </div>
                  )}
                </Button>

                {form.stage === 'questions' && (
                  <Button
                    variant="outline"
                    disabled={!form.canSubmitBase || submission.processing || submission.pending}
                    onClick={handleSkipQA}
                    className="w-full sm:w-auto h-11 text-sm font-medium"
                  >
                    Skip Q&A
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/new-pitch-panel.tsx"
git commit -m "show takeover, fraunces header, gold submit"
```

---

### Task 3: Warm the dropzones

**Files:**
- Modify: `src/app/(dashboard)/dashboard/_components/new-pitch/text-input-tab.tsx`
- Modify: `src/app/(dashboard)/dashboard/_components/new-pitch/file-upload-tab.tsx`

- [ ] **Step 1: Warm the text-input dropzone border**

In `text-input-tab.tsx`, find:
```tsx
      <div className="h-[300px] sm:h-[420px] border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg relative overflow-hidden">
```
Replace with:
```tsx
      <div className="h-[300px] sm:h-[420px] border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--gold)/0.5)] focus-within:border-[hsl(var(--gold)/0.5)] bg-gradient-to-br from-[hsl(var(--gold)/0.04)] to-background rounded-lg relative overflow-hidden transition-colors">
```

- [ ] **Step 2: Gold the text-input empty-state icon**

In `text-input-tab.tsx`, find:
```tsx
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <FileTextIcon className="w-5 h-5 text-primary" />
                </div>
```
Replace with:
```tsx
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--gold)/0.12)] flex items-center justify-center mx-auto">
                  <FileTextIcon className="w-5 h-5 text-[hsl(var(--gold))]" />
                </div>
```

- [ ] **Step 3: Warm the file-upload dropzone border**

In `file-upload-tab.tsx`, find:
```tsx
      <div className="h-[220px] sm:h-[300px] border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg overflow-hidden">
```
Replace with:
```tsx
      <div className="h-[220px] sm:h-[300px] border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--gold)/0.5)] focus-within:border-[hsl(var(--gold)/0.5)] bg-gradient-to-br from-[hsl(var(--gold)/0.04)] to-background rounded-lg overflow-hidden transition-colors">
```

- [ ] **Step 4: Mono the file meta line**

In `file-upload-tab.tsx`, find:
```tsx
            <div className="text-xs text-muted-foreground">
              {isAudio ? (
                `${(file.size / (1024 * 1024)).toFixed(1)} MB • ${file.name}`
              ) : (
                `${(file.size / 1024).toFixed(1)} KB`
              )}
            </div>
```
Replace with:
```tsx
            <div className="font-mono text-xs text-muted-foreground">
              {isAudio ? (
                `${(file.size / (1024 * 1024)).toFixed(1)} MB • ${file.name}`
              ) : (
                `${(file.size / 1024).toFixed(1)} KB`
              )}
            </div>
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Compiles cleanly.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/new-pitch/text-input-tab.tsx" "src/app/(dashboard)/dashboard/_components/new-pitch/file-upload-tab.tsx"
git commit -m "warm create flow dropzones"
```

---

### Task 4: Warm the Q&A section

**Files:**
- Modify: `src/app/(dashboard)/dashboard/_components/new-pitch/questions-section.tsx`

- [ ] **Step 1: Fraunces heading + gold pulse dot**

Find:
```tsx
        <h3 className="font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Follow-up Questions
        </h3>
```
Replace with:
```tsx
        <h3 className="font-display font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-[hsl(var(--gold))] rounded-full animate-pulse" />
          Follow-up Questions
        </h3>
```

- [ ] **Step 2: Olive "Answered" (kill the green hex)**

Find:
```tsx
                <span className="inline-flex items-center gap-1 font-medium" style={{ color: "#4ade80" }}>
```
Replace with:
```tsx
                <span className="inline-flex items-center gap-1 font-medium text-[hsl(var(--score-high))]">
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Compiles cleanly.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(dashboard)/dashboard/_components/new-pitch/questions-section.tsx"
git commit -m "warm follow-up questions section"
```

---

### Task 5: Delete dead legacy dialog + sweep

**Files:**
- Delete: `src/components/shared/forms/add-pitches/` (entire folder)

- [ ] **Step 1: Confirm no external importers**

Use the Grep tool for `add-pitches` across `src` (excluding the folder itself). Expected: only matches are inside `src/components/shared/forms/add-pitches/` (self-references). If anything OUTSIDE that folder imports it, STOP and report — do not delete.

- [ ] **Step 2: Delete the folder**

```bash
git rm -r "src/components/shared/forms/add-pitches"
```

- [ ] **Step 3: Cool-color / hex sweep of the create-flow area**

Use the Grep tool over `src/app/(dashboard)/dashboard/_components/new-pitch` and `src/app/(dashboard)/dashboard/_components/new-pitch-panel.tsx` and `src/components/ui/file-upload.tsx` for:
`(text|bg|border|fill|stroke|from|to|via)-(green|blue|red|amber|emerald|sky|indigo|cyan|teal|violet|purple|yellow|gray|slate|zinc)-\d|#[0-9a-fA-F]{6}`
Expected: **No matches.** (Warm rust/gold/olive use tokens, not hexes.) If `file-upload.tsx`'s `GridPattern` or anything else has a cool color, warm it via tokens and include it in this commit.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Compiles cleanly (no dangling imports after the delete).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "remove dead pitch dialog"
```

---

### Task 6: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing suite + the 3 new `ProcessingStatus` tests).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Cool-color sweep confirmation**

Grep `src/app/(dashboard)/dashboard/_components/new-pitch` + `new-pitch-panel.tsx` for:
`(text|bg|border|fill|stroke|from|to|via)-(green|blue|red|amber|emerald|sky|indigo|cyan|teal|violet|purple|yellow|gray|slate|zinc)-\d|#[0-9a-fA-F]{6}`
Expected: **No matches.**

- [ ] **Step 4: Manual smoke (dev server)**

Run `npm run dev`, sign in, click "New Pitch" (`/dashboard?view=new`). Confirm:
- Header "Create a New Pitch" is in the display font; the "Create & Evaluate" button is gold.
- Dropzones (Text tab textarea zone, Text File / Audio zones) show a warm dashed border that turns gold on hover; the empty-state icon is gold.
- Submit a **text** pitch → the form is replaced by the centered takeover showing only the **Analyze** stage (gold •), the Fraunces line, then it routes to the new pitch.
- Submit an **audio** pitch → takeover shows **Upload → Transcribe → Analyze** progressing (done = olive ✓, active = gold •), with a mono upload %.
- Force/observe an error → centered rust "Evaluation failed" + Retry.
- Toggle Q&A on a run that returns questions → "Follow-up Questions" heading is display font, the dot is gold, an answered question shows an **olive** "Answered" (no green).

- [ ] **Step 5: No commit needed** unless a verification fix was required.

---

## Self-Review Notes

- **Spec coverage:** full-panel takeover with type-aware stepper (Task 1) ✓; takeover gate + Fraunces header + gold submit (Task 2) ✓; warm dropzones + gold icon + mono meta (Task 3) ✓; Q&A olive/gold/Fraunces, kill `#4ade80` (Task 4) ✓; delete dead `add-pitches/` + sweep (Task 5) ✓; render-smoke test (Task 1) ✓; non-goals respected (no hook/API/Convex/logic changes — `submitPitch`/`skipQAAndSubmit` call sites are byte-identical to the original).
- **Type consistency:** `ProcessingStatus` prop is `type: "text"|"textFile"|"audio"` matching `form.type` (`PitchType`); `useEvaluationProgress` fields (`step`/`message`/`progress`) match the store. The gold-CTA inline style matches Phases 4–5.
- **Placeholder scan:** every code step has full content; the two "find more if present" steps (Task 5 Step 1/3) are deterministic greps with explicit instructions, not vague placeholders.
- **Note:** Task 2 replaces the whole file rather than patching, because the form body is now wrapped in the `showTakeover` conditional — a whole-file replacement is less error-prone than nesting edits. The form markup is preserved verbatim except the wrapper `<div className="space-y-5">`, the removed inline `<ProcessingStatus>`, the Fraunces header, and the gold submit style.
