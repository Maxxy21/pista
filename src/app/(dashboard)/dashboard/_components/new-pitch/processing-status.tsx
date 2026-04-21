import React from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertTriangle, RefreshCw } from "lucide-react"
import LogoIcon from "@/components/ui/logo-icon"
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress"

interface ProcessingStatusProps {
  processing: boolean
  progress: number
  onRetry?: () => void
}

const STEP_LABELS: Record<string, string> = {
  uploading: "Uploading audio...",
  transcribing: "Transcribing audio...",
  analyzing: "Analysing your pitch...",
  complete: "Done",
  error: "Something went wrong",
  idle: "",
}

export function ProcessingStatus({ processing, onRetry }: ProcessingStatusProps) {
  const { step, message, progress } = useEvaluationProgress()

  const isError = step === "error"

  if (!processing && !isError) return null

  const label = message || STEP_LABELS[step] || "Processing your pitch..."
  const showProgress = step === "uploading" && progress !== undefined

  if (isError) {
    return (
      <div
        className="space-y-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-destructive">Evaluation failed</p>
            <p className="text-xs text-muted-foreground truncate">{label}</p>
          </div>
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              className="flex-shrink-0 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={onRetry}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-4 p-6 rounded-lg border border-primary/20 bg-muted/30"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <LogoIcon />
          <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Processing your pitch</p>
          <p className="text-xs text-muted-foreground truncate">{label}</p>
        </div>
        <LoadingSpinner variant="minimal" size="md" />
      </div>

      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Upload progress</span>
            <span className="font-semibold tabular-nums">{Math.round(progress!)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  )
}
