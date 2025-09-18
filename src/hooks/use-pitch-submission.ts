import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useOrganization } from "@clerk/nextjs"
import { useWorkspace } from "@/hooks/use-workspace"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { streamUpload } from "@/lib/utils"
import { normalizeTranscriptText } from "@/lib/utils/text"

export type PitchType = "text" | "textFile" | "audio"
export type FormStage = "compose" | "questions"

export interface QAItem {
  text: string
  answer: string
}

export function usePitchSubmission() {
  const router = useRouter()
  const { organization } = useOrganization()
  const workspace = useWorkspace()
  const { mutate: createPitch, pending } = useApiMutation(api.pitches.create)
  const evalProg = useEvaluationProgress()
  
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const transcribeAudio = useCallback(async (audioFile: File) => {
    evalProg.setStep('uploading', 'Uploading audio...')
    setProgress(0)
    const res = await streamUpload('/api/transcribe', audioFile, (p) => {
      setProgress(p)
      evalProg.setProgress(p)
    })
    if (!res.ok) throw new Error('Transcription failed')
    evalProg.setStep('transcribing', 'Transcribing audio...')
    const data = await res.json()
    evalProg.setProgress(100)
    return data.text as string
  }, [evalProg])

  const evaluateText = useCallback(async (text: string, questions: QAItem[]) => {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, questions }),
    })
    if (!res.ok) throw new Error("Evaluation failed")
    return await res.json()
  }, [])

  const generateQuestionsForText = useCallback(async (text: string) => {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) return [] as string[]
    const data = await res.json()
    const items: string[] = Array.isArray(data?.questions) ? data.questions : []
    return items.slice(0, 3)
  }, [])

  const processContent = useCallback(async (
    type: PitchType, 
    textContent: string, 
    file: File | null,
    readTextFile: (f: File) => Promise<string>
  ) => {
    let sourceText = textContent
    
    if (type === "audio" && file) {
      sourceText = await transcribeAudio(file)
    } else if (type === "textFile" && file) {
      sourceText = await readTextFile(file)
    }
    
    return normalizeTranscriptText(sourceText)
  }, [transcribeAudio])

  const submitPitch = useCallback(async (
    title: string,
    type: PitchType,
    textContent: string,
    file: File | null,
    qa: QAItem[],
    enableQA: boolean,
    stage: FormStage,
    preparedText: string,
    readTextFile: (f: File) => Promise<string>,
    onQuestionsGenerated: (questions: string[]) => void,
    onStageChange: (stage: FormStage) => void,
    onPreparedTextChange: (text: string) => void
  ) => {
    if (processing) return
    setProcessing(true)
    
    try {
      // Initialize global progress overlay
      evalProg.start()
      
      // Process content
      const normalized = await processContent(type, textContent, file, readTextFile)
      onPreparedTextChange(normalized)

      // Handle Q&A generation if needed
      if (stage === 'compose' && enableQA) {
        evalProg.setStep('analyzing', 'Generating follow-up questions...')
        const questions = await generateQuestionsForText(normalized)
        if (questions.length > 0) {
          onQuestionsGenerated(questions)
          onStageChange('questions')
          toast.message('Answer a few questions to improve the evaluation')
          evalProg.done()
          return
        }
      }

      // Evaluate pitch
      evalProg.setStep('analyzing', 'Analyzing content...')
      const evaluation = await evaluateText(normalized, enableQA ? qa : [])

      // Create pitch
      const id = await createPitch({
        orgId: workspace.mode === "org" ? organization?.id : undefined,
        title,
        text: normalized,
        type,
        status: "evaluated",
        evaluation,
        questions: qa,
      })

      toast.success("Pitch created")
      evalProg.done()
      router.replace(`/pitch/${id}`)
      
    } catch (e: any) {
      const msg = e?.message || 'Failed to create pitch'
      toast.error(msg)
      evalProg.fail(msg)
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }, [processing, workspace.mode, organization?.id, createPitch, router, evalProg, processContent, generateQuestionsForText, evaluateText])

  const skipQAAndSubmit = useCallback(async (
    title: string,
    type: PitchType,
    preparedText: string,
    textContent: string
  ) => {
    if (processing) return
    setProcessing(true)
    
    try {
      evalProg.start()
      evalProg.setStep('analyzing', 'Analyzing content...')
      const textForEval = preparedText || normalizeTranscriptText(textContent)
      const evaluation = await evaluateText(textForEval, [])
      
      const id = await createPitch({
        orgId: workspace.mode === "org" ? organization?.id : undefined,
        title,
        text: textForEval,
        type,
        status: "evaluated",
        evaluation,
        questions: [],
      })
      
      toast.success('Pitch created successfully!')
      evalProg.done()
      router.replace(`/pitch/${id}`)
      
    } catch (e: any) {
      const msg = e?.message || 'Failed to create pitch'
      toast.error(msg)
      evalProg.fail(msg)
    } finally {
      setProcessing(false)
    }
  }, [processing, workspace.mode, organization?.id, createPitch, router, evalProg, evaluateText])

  return {
    processing,
    pending,
    progress,
    submitPitch,
    skipQAAndSubmit,
  }
}