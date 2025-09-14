import React from "react"
import { Progress } from "@/components/ui/progress"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import LogoIcon from "@/components/ui/logo-icon"

interface ProcessingStatusProps {
  processing: boolean
  progress: number
}

export function ProcessingStatus({ processing, progress }: ProcessingStatusProps) {
  if (!processing) return null

  const getStatusText = (progress: number) => {
    if (progress < 25) return "Initializing processing..."
    if (progress < 50) return "Analyzing content..."
    if (progress < 75) return "Generating evaluation..."
    return "Finalizing results..."
  }

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center gap-2">
          <LogoIcon />
          <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse-subtle" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Processing your pitch</p>
          <p className="text-xs text-muted-foreground">{getStatusText(progress)}</p>
        </div>
        <LoadingSpinner variant="minimal" size="md" />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 bg-primary/10" />
        
        {/* Loading dots indicator */}
        <div className="flex justify-center pt-2">
          <LoadingSpinner variant="dots" size="sm" />
        </div>
      </div>
    </div>
  )
}