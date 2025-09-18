"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useOrganization } from "@clerk/nextjs"
import { useWorkspace } from "@/hooks/use-workspace"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress"
import { streamUpload } from "@/lib/utils"
import { FileAudio2, FileText as FileTextIcon, Upload, Mic } from "lucide-react"
import { FileUpload as PrettyFileUpload, GridPattern } from "@/components/ui/file-upload"
import { normalizeTranscriptText } from "@/lib/utils/text"
import { AudioPreview } from "@/components/ui/previews/audio-preview"
import { FilePreview } from "@/components/ui/previews/file-preview"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import LogoIcon from "@/components/ui/logo-icon"

type PitchType = "text" | "textFile" | "audio"

export function NewPitchPanel() {
  const router = useRouter()
  const { organization } = useOrganization()
  const workspace = useWorkspace()
  const { mutate: createPitch, pending } = useApiMutation(api.pitches.create)

  const [title, setTitle] = useState("")
  const [type, setType] = useState<PitchType>("text")
  const [text, setText] = useState("")
  const [preparedText, setPreparedText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ url?: string; text?: string } | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const evalProg = useEvaluationProgress()
  const [stage, setStage] = useState<"compose" | "questions">("compose")
  const [qa, setQa] = useState<Array<{ text: string; answer: string }>>([])
  const [enableQA, setEnableQA] = useState(true)
  const [textFocused, setTextFocused] = useState(false)

  // Persist user preference for Q&A
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

  // Clear file when switching between incompatible tab types
  useEffect(() => {
    if (file) {
      const isCurrentFileCompatible = 
        (type === "audio" && file.type.startsWith("audio/")) ||
        (type === "textFile" && (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")))
      
      if (type === "text" || !isCurrentFileCompatible) {
        setFile(null)
        setPreview(null)
      }
    }
  }, [type, file])

  const canSubmitBase = useMemo(() => {
    if (!title.trim()) return false
    if (type === "text") return text.trim().length > 0
    return !!file
  }, [title, type, text, file])

  const allAnswersProvided = useMemo(() => qa.every(q => q.answer.trim().length > 0), [qa])

  const canSubmit = useMemo(() => {
    return stage === 'questions' ? (canSubmitBase && allAnswersProvided) : canSubmitBase
  }, [stage, canSubmitBase, allAnswersProvided])

  const handleFilesSelected = (newFiles: File[]) => {
    if (!newFiles?.length) return
    const f = newFiles[0]
    if (type === "audio") {
      if (!f.type.startsWith("audio/")) {
        toast.error("Please upload an audio file (mp3, wav, m4a, ...)")
        return
      }
    } else if (type === "textFile") {
      // Prefer text/plain, fallback to .txt extension check
      const isTxt = f.type === "text/plain" || f.name.toLowerCase().endsWith(".txt")
      if (!isTxt) {
        toast.error("Please upload a plain text .txt file")
        return
      }
    }
    setFile(f)
  }

  // Build a simple preview for audio/text files and normalize content height
  useEffect(() => {
    let revokedUrl: string | undefined
    const run = async () => {
      if (!file) return setPreview(null)
      if (type === "audio") {
        const url = URL.createObjectURL(file)
        revokedUrl = url
        setPreview({ url })
      } else if (type === "textFile") {
        try {
          const t = await file.text()
          setPreview({ text: t.slice(0, 800) })
        } catch {
          setPreview(null)
        }
      } else {
        setPreview(null)
      }
    }
    run()
    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl)
    }
  }, [file, type])

  const transcribeAudio = React.useCallback(async (audioFile: File) => {
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

  const readTextFile = async (f: File) => await f.text()

  const evaluateText = async (t: string, questions: Array<{ text: string; answer: string }>) => {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: t, questions }),
    })
    if (!res.ok) throw new Error("Evaluation failed")
    return await res.json()
  }

  const generateQuestionsForText = useCallback(async (t: string) => {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: t }),
    })
    if (!res.ok) return [] as string[]
    const data = await res.json()
    const items: string[] = Array.isArray(data?.questions) ? data.questions : []
    return items.slice(0, 3)
  }, [])

  const onSubmit = useCallback(async () => {
    if (!canSubmit || processing) return
    setProcessing(true)
    try {
      // Initialize global progress overlay
      evalProg.start()
      let sourceText = text
      if (type === "audio" && file) {
        sourceText = await transcribeAudio(file)
      } else if (type === "textFile" && file) {
        sourceText = await readTextFile(file)
      }
      const normalized = normalizeTranscriptText(sourceText)
      setPreparedText(normalized)

      if (stage === 'compose' && enableQA) {
        evalProg.setStep('analyzing', 'Generating follow-up questions...')
        const questions = await generateQuestionsForText(normalized)
        if (questions.length > 0) {
          setQa(questions.map(q => ({ text: q, answer: "" })))
          setStage('questions')
          toast.message('Answer a few questions to improve the evaluation')
          evalProg.done()
          return
        }
      }

      evalProg.setStep('analyzing', 'Analyzing content...')
      const evaluation = await evaluateText(normalized, enableQA ? qa : [])

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
  }, [canSubmit, processing, type, file, text, title, workspace.mode, organization?.id, createPitch, router, evalProg, transcribeAudio, generateQuestionsForText, qa, stage, enableQA])

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-2">
      <Card className="overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold">Create a New Pitch</h2>
            {workspace.mode === "org" && (
              <span className="text-xs text-muted-foreground">
                Creating in {organization?.name || "Organization"}
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-4 md:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="improve-qa">Improve evaluation with follow-up questions</Label>
              <p className="text-xs text-muted-foreground">Answering 1–3 questions can improve accuracy.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{enableQA ? 'On' : 'Off'}</span>
              <Switch
                id="improve-qa"
                checked={enableQA}
                onCheckedChange={setEnableQA}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My awesome pitch" />
          </div>

          <Tabs value={type} onValueChange={(v) => setType(v as PitchType)}>
            <TabsList className="grid w-full grid-cols-3 h-11">
              <TabsTrigger value="text" className="flex items-center gap-2 text-xs sm:text-sm">
                <FileTextIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="textFile" className="flex items-center gap-2 text-xs sm:text-sm">
                <FileAudio2 className="w-4 h-4" />
                <span className="hidden sm:inline">Text </span>File
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2 text-xs sm:text-sm">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-2">
              <Label htmlFor="pitch-text">Pitch Content</Label>
              <div className="h-[480px] border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                  <GridPattern />
                </div>
                <div className="h-full flex flex-col relative z-10 p-4">
                  {!text && !textFocused && (
                    <div className="flex items-center justify-center h-20 mb-4">
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <FileTextIcon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Type or paste your pitch content</p>
                      </div>
                    </div>
                  )}
                  <Textarea 
                    id="pitch-text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setTextFocused(true)}
                    onBlur={() => setTextFocused(false)}
                    placeholder={textFocused || text ? "Describe your startup idea, business model, target market, and competitive advantages..." : ""}
                    className={`flex-1 min-h-[400px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ${text || textFocused ? 'mt-0 text-left' : 'mt-auto text-center'} ${textFocused || text ? 'placeholder:text-left' : 'placeholder:text-center'} relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full`}
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'hsl(var(--border)) transparent'
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="textFile" className="space-y-2">
              <Label>Upload Text File</Label>
              <div className="h-[480px] border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg overflow-hidden">
                <div className="h-full [&>div]:h-full [&>div>div]:h-full [&>div>div]:!p-4 [&>div>div]:flex [&>div>div]:items-center [&>div>div]:justify-center">
                  <PrettyFileUpload accept="text/plain,.txt" maxSize={5 * 1024 * 1024} onChange={handleFilesSelected} showList={false} />
                </div>
              </div>
              {file && (
                <div className="mt-3 rounded-lg border bg-muted/20 p-3 sm:p-4">
                  <FilePreview file={file} />
                  {preview?.text && (
                    <div className="mt-3 max-h-32 sm:max-h-48 overflow-auto rounded bg-background p-2 sm:p-3 text-sm border" style={{ textAlign: 'justify' }}>
                      {normalizeTranscriptText(preview.text).slice(0, 800)}
                      {file.size > 800 && "..."}
                    </div>
                  )}
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-3 text-xs touch-manipulation" 
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="audio" className="space-y-2">
              <Label>Upload Audio File</Label>
              <div className="h-[480px] border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg overflow-hidden">
                <div className="h-full [&>div]:h-full [&>div>div]:h-full [&>div>div]:!p-4 [&>div>div]:flex [&>div>div]:items-center [&>div>div]:justify-center">
                  <PrettyFileUpload accept="audio/*" maxSize={25 * 1024 * 1024} onChange={handleFilesSelected} showList={false} />
                </div>
              </div>
              {file && (
                <div className="mt-3 rounded-lg border bg-muted/20 p-3 sm:p-4">
                  <AudioPreview file={file} onRemove={() => setFile(null)} />
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB • {file.name}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {processing && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center gap-2">
                  <LogoIcon />
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse-subtle" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Processing your pitch</p>
                  <p className="text-xs text-muted-foreground">
                    {progress < 25 ? "Initializing processing..." 
                     : progress < 50 ? "Analyzing content..." 
                     : progress < 75 ? "Generating evaluation..." 
                     : "Finalizing results..."}
                  </p>
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
          )}

          {stage === 'questions' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-background">
              <div className="space-y-1">
                <h3 className="font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Follow-up Questions
                </h3>
                <p className="text-sm text-muted-foreground">Answer these questions to get a more accurate evaluation of your pitch.</p>
              </div>
              <div className="space-y-4">
                {qa.map((q, idx) => (
                  <div key={idx} className="space-y-2 p-3 border rounded-lg bg-background/50">
                    <Label htmlFor={`qa-${idx}`} className="font-medium text-sm">
                      {idx + 1}. {q.text}
                    </Label>
                    <Textarea
                      id={`qa-${idx}`}
                      value={q.answer}
                      onChange={(e) => setQa(prev => prev.map((it, i) => i === idx ? { ...it, answer: e.target.value } : it))}
                      placeholder="Share your thoughts here..."
                      className="min-h-[100px] resize-none"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {q.answer.length > 0 ? (
                        <span className="text-green-600 font-medium">✓ Answered</span>
                      ) : (
                        <span>Answer to improve evaluation</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border-l-2 border-primary/30">
                <strong>Tip:</strong> More detailed answers lead to better evaluations. You can always skip if you&apos;re in a hurry.
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button 
              onClick={onSubmit} 
              disabled={!canSubmit || processing || pending}
              className="w-full sm:w-auto h-11 text-sm font-medium touch-manipulation"
              size="lg"
            >
              {processing || pending ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner variant="minimal" size="sm" />
                  {stage === 'questions' ? 'Evaluating...' : 'Creating...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {stage === 'questions' ? 'Evaluate with Answers' : 'Create & Evaluate'}
                </div>
              )}
            </Button>
            {stage === 'questions' && (
              <Button
                variant="outline"
                disabled={!canSubmitBase || processing || pending}
                onClick={async () => {
                  // Skip Q&A: evaluate with empty answers
                  if (!canSubmitBase || processing) return
                  setProcessing(true)
                  try {
                    evalProg.start()
                    evalProg.setStep('analyzing', 'Analyzing content...')
                    const evaluation = await evaluateText(preparedText || normalizeTranscriptText(text), [])
                    const id = await createPitch({
                      orgId: workspace.mode === "org" ? organization?.id : undefined,
                      title,
                      text: preparedText || normalizeTranscriptText(text),
                      type,
                      status: "evaluated",
                      evaluation,
                      questions: [],
                    })
                    toast.success('Pitch created')
                    evalProg.done()
                    router.replace(`/pitch/${id}`)
                  } catch (e: any) {
                    const msg = e?.message || 'Failed to create pitch'
                    toast.error(msg)
                    evalProg.fail(msg)
                  } finally {
                    setProcessing(false)
                  }
                }}
                className="w-full sm:w-auto h-11 text-sm font-medium"
              >
                Skip Q&A
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
