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
