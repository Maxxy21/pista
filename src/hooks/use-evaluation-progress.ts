import { create } from 'zustand'

export type EvalStep = 'idle' | 'uploading' | 'transcribing' | 'analyzing' | 'complete' | 'error'

interface EvaluationProgressState {
  visible: boolean
  step: EvalStep
  message?: string
  progress?: number // 0-100 for upload progress
  start: () => void
  setStep: (step: EvalStep, message?: string) => void
  setProgress: (value: number) => void
  done: () => void
  fail: (message?: string) => void
  reset: () => void
}

export const useEvaluationProgress = create<EvaluationProgressState>((set) => ({
  visible: false,
  step: 'idle',
  message: undefined,
  progress: undefined,
  start: () => set({ visible: true, step: 'uploading', progress: 0, message: 'Uploading...' }),
  setStep: (step, message) => set({ step, message, progress: step === 'uploading' ? 0 : undefined }),
  setProgress: (value) => set({ progress: Math.max(0, Math.min(100, Math.round(value))) }),
  // Hide overlay immediately on completion
  done: () => set({ visible: false, step: 'complete', message: 'Complete! View your results.', progress: 100 }),
  fail: (message) => set({ step: 'error', message: message || 'Something went wrong.' }),
  reset: () => set({ visible: false, step: 'idle', message: undefined, progress: undefined }),
}))
