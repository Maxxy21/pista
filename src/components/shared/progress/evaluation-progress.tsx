"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { useEvaluationProgress } from '@/hooks/use-evaluation-progress'
import { cn } from '@/lib/utils'
import LogoIcon from '@/components/ui/logo-icon'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const steps: { key: ReturnType<typeof useEvaluationProgress.getState>['step']; label: string }[] = [
  { key: 'uploading', label: 'Uploading' },
  { key: 'transcribing', label: 'Transcribing audio' },
  { key: 'analyzing', label: 'Analyzing content' },
  { key: 'complete', label: 'Complete' },
]

export function EvaluationProgressOverlay() {
  const { visible, step, message, progress } = useEvaluationProgress()
  if (!visible) return null

  const getStatusText = (currentStep: string, currentMessage?: string, currentProgress?: number) => {
    if (currentMessage) return currentMessage;
    
    switch (currentStep) {
      case 'uploading': return currentProgress !== undefined ? `Uploading... ${Math.round(currentProgress)}%` : 'Uploading...'
      case 'transcribing': return 'Transcribing audio...'
      case 'analyzing': return 'Analyzing content...'
      default: return 'Processing...'
    }
  }

  const getProgressValue = () => {
    if (step === 'uploading' && typeof progress === 'number') return progress
    if (step === 'transcribing') return 33
    if (step === 'analyzing') return 66
    if (step === 'complete') return 100
    return 0
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center gap-2">
              <LogoIcon />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse-subtle" />
            </div>
            <span className="text-lg font-semibold text-foreground">Pista</span>
          </div>
          <DismissButton className="ml-auto" />
        </div>

        {/* Main content */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground">Processing your pitch</h3>
            <p className="text-sm text-muted-foreground">
              {getStatusText(step, message, progress)}
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-primary">{Math.round(getProgressValue())}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressValue()}%` }}
              />
            </div>
          </div>

          {/* Loading indicators */}
          <div className="flex justify-center items-center gap-4 pt-2">
            <LoadingSpinner variant="minimal" size="md" />
            <LoadingSpinner variant="dots" size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DismissButton({ className }: { className?: string }) {
  const reset = useEvaluationProgress(s => s.reset)
  return (
    <button
      type="button"
      onClick={reset}
      className={cn(
        'rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors',
        className
      )}
      aria-label="Dismiss"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

function TypedMessage({ text }: { text: string }) {
  const [display, setDisplay] = useState('')
  const speed = 18
  const target = useMemo(() => text || '', [text])

  useEffect(() => {
    let i = 0
    setDisplay('')
    if (!target) return
    const id = setInterval(() => {
      i += 1
      setDisplay(target.slice(0, i))
      if (i >= target.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [target])

  if (!target) return null
  return (
    <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 font-mono" aria-live="polite">
      {display}
      <span className="opacity-50">{display.length < target.length ? '▌' : ''}</span>
    </p>
  )
}
