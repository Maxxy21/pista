import { useState, useMemo, useEffect } from "react"

export type PitchType = "text" | "textFile" | "audio"
export type FormStage = "compose" | "questions"

export interface QAItem {
  text: string
  answer: string
}

export function useNewPitchForm() {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<PitchType>("text")
  const [text, setText] = useState("")
  const [preparedText, setPreparedText] = useState("")
  const [stage, setStage] = useState<FormStage>("compose")
  const [qa, setQa] = useState<QAItem[]>([])
  const [enableQA, setEnableQA] = useState(true)
  const [textFocused, setTextFocused] = useState(false)

  // Persist Q&A preference
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('pista_enable_qa') : null
      if (stored !== null) setEnableQA(stored === 'true')
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('pista_enable_qa', String(enableQA))
    } catch {}
  }, [enableQA])

  const canSubmitBase = useMemo(() => {
    if (!title.trim()) return false
    if (type === "text") return text.trim().length > 0
    return false // File validation handled by useFileHandling hook
  }, [title, type, text])

  const allAnswersProvided = useMemo(() => 
    qa.every(q => q.answer.trim().length > 0), [qa]
  )

  const canSubmit = useMemo(() => {
    return stage === 'questions' ? (canSubmitBase && allAnswersProvided) : canSubmitBase
  }, [stage, canSubmitBase, allAnswersProvided])

  const updateQAAnswer = (index: number, answer: string) => {
    setQa(prev => prev.map((item, i) => 
      i === index ? { ...item, answer } : item
    ))
  }

  const setQuestions = (questions: string[]) => {
    setQa(questions.map(text => ({ text, answer: "" })))
  }

  const resetForm = () => {
    setTitle("")
    setText("")
    setPreparedText("")
    setStage("compose")
    setQa([])
    setTextFocused(false)
  }

  return {
    // State
    title,
    type,
    text,
    preparedText,
    stage,
    qa,
    enableQA,
    textFocused,
    
    // Computed
    canSubmitBase,
    allAnswersProvided,
    canSubmit,
    
    // Actions
    setTitle,
    setType,
    setText,
    setPreparedText,
    setStage,
    setEnableQA,
    setTextFocused,
    updateQAAnswer,
    setQuestions,
    resetForm,
  }
}