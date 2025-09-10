"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { useEvaluationProgress } from '@/hooks/use-evaluation-progress'
import { cn } from '@/lib/utils'
import LogoIcon from '@/components/ui/logo-icon'

const steps: { key: ReturnType<typeof useEvaluationProgress.getState>['step']; label: string }[] = [
  { key: 'uploading', label: 'Uploading' },
  { key: 'transcribing', label: 'Transcribing audio' },
  { key: 'analyzing', label: 'Analyzing content' },
  { key: 'complete', label: 'Complete' },
]

export function EvaluationProgressOverlay() {
  const { visible, step, message, progress } = useEvaluationProgress()
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-neutral-900 shadow-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="animate-pulse"><LogoIcon /></div>
          <span className="text-sm font-semibold">Pista</span>
          <DismissButton className="ml-auto" />
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">Pitch processing</p>
        <ol className="flex items-center w-full text-xs text-neutral-500 dark:text-neutral-400">
          {steps.map((s, idx) => (
            <li key={s.key} className={cn('flex-1 flex items-center', idx !== steps.length - 1 && 'mr-2') }>
              <div className={cn(
                'h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800',
                step === s.key && 'bg-sky-200 dark:bg-sky-900',
                (step === 'complete' || steps.findIndex(ss => ss.key === step) > idx) && 'bg-sky-500'
              )} />
            </li>
          ))}
        </ol>
        <div className="mt-4">
          {step === 'uploading' && typeof progress === 'number' && (
            <div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded">
                <div className="h-2 bg-sky-500 rounded transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-neutral-500">{Math.round(progress)}%</p>
            </div>
          )}
          <TypedMessage text={message || ''} />
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
      className={cn('rounded p-1 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200', className)}
      aria-label="Dismiss"
    >
      ×
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
