"use client";

import React from "react";
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress";
import { cn } from "@/lib/utils";
import LogoIcon from "@/components/ui/logo-icon";
import { AlertTriangle, X } from "lucide-react";

const steps = [
  { key: "uploading", label: "Uploading" },
  { key: "transcribing", label: "Transcribing" },
  { key: "analyzing", label: "Analyzing" },
  { key: "complete", label: "Complete" },
] as const;

const stepIndex: Record<string, number> = {
  uploading: 0,
  transcribing: 1,
  analyzing: 2,
  complete: 3,
};

export function EvaluationProgressOverlay() {
  const { visible, step, message, progress } = useEvaluationProgress();
  if (!visible) return null;

  const isError = step === "error";
  // fail() does not preserve the prior step; surface the error on "Analyzing".
  const activeIndex = isError ? stepIndex.analyzing : stepIndex[step] ?? 0;

  const getStatusText = () => {
    if (message) return message;
    switch (step) {
      case "uploading":
        return progress !== undefined ? `Uploading... ${Math.round(progress)}%` : "Uploading...";
      case "transcribing":
        return "Transcribing audio...";
      case "analyzing":
        return "Analyzing content...";
      case "error":
        return "Something went wrong.";
      default:
        return "Processing...";
    }
  };

  const getProgressValue = () => {
    if (step === "uploading" && typeof progress === "number") return progress;
    if (step === "transcribing") return 33;
    if (step === "analyzing") return 66;
    if (step === "complete") return 100;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon />
            <span className="font-display text-lg font-semibold text-foreground">Pista</span>
          </div>
          <DismissButton />
        </div>

        {/* Title + status */}
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {isError ? "Evaluation failed" : "Processing your pitch"}
          </h3>
          <p
            className={cn(
              "flex items-center gap-1.5 text-sm",
              isError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {isError && <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0" />}
            {getStatusText()}
          </p>
        </div>

        {/* Stepper */}
        <ol className="flex items-start">
          {steps.map((s, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            const dotTone =
              isError && active
                ? "border-destructive bg-destructive"
                : done
                  ? "border-gold bg-gold"
                  : active
                    ? "border-gold"
                    : "border-border";
            const labelTone =
              isError && active
                ? "text-destructive"
                : active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground";
            return (
              <React.Fragment key={s.key}>
                <li className="flex flex-col items-center gap-1.5">
                  <span className={cn("h-3 w-3 rounded-full border-2", dotTone)} />
                  <span className={cn("text-[11px]", labelTone)}>{s.label}</span>
                </li>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "mx-2 mt-[5px] h-px flex-1",
                      i < activeIndex ? "bg-gold" : "bg-border"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </ol>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{Math.round(getProgressValue())}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-out",
                isError ? "bg-destructive" : "bg-gold"
              )}
              style={{ width: `${getProgressValue()}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DismissButton() {
  const reset = useEvaluationProgress((s) => s.reset);
  return (
    <button
      type="button"
      onClick={reset}
      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Dismiss"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
