import React from "react"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface ProcessingStatusProps {
  processing: boolean
  progress: number
}

export function ProcessingStatus({ processing, progress }: ProcessingStatusProps) {
  if (!processing) return null

  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Processing your pitch...</p>
          <p className="text-xs text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-primary/10" />
      </div>
    </div>
  )
}