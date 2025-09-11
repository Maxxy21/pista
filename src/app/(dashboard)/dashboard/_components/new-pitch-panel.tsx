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
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress"
import { streamUpload } from "@/lib/utils"
import { FileAudio2, FileText as FileTextIcon, Upload, Loader2, Mic } from "lucide-react"
import { FileUpload as PrettyFileUpload, GridPattern } from "@/components/ui/file-upload"
import { AudioPreview } from "@/components/ui/previews/audio-preview"
import { FilePreview } from "@/components/ui/previews/file-preview"

type PitchType = "text" | "textFile" | "audio"

export function NewPitchPanel() {
  const router = useRouter()
  const { organization } = useOrganization()
  const workspace = useWorkspace()
  const { mutate: createPitch, pending } = useApiMutation(api.pitches.create)

  const [title, setTitle] = useState("")
  const [type, setType] = useState<PitchType>("text")
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ url?: string; text?: string } | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const evalProg = useEvaluationProgress()

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false
    if (type === "text") return text.trim().length > 0
    return !!file
  }, [title, type, text, file])

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

  const evaluateText = async (t: string) => {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: t, questions: [] }),
    })
    if (!res.ok) throw new Error("Evaluation failed")
    return await res.json()
  }

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

      evalProg.setStep('analyzing', 'Analyzing content...')
      const evaluation = await evaluateText(sourceText)

      const id = await createPitch({
        orgId: workspace.mode === "org" ? organization?.id : undefined,
        title,
        text: sourceText,
        type,
        status: "evaluated",
        evaluation,
        questions: [],
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
  }, [canSubmit, processing, type, file, text, title, workspace.mode, organization?.id, createPitch, router, evalProg, transcribeAudio])

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
              <div className="min-h-96 border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg p-4 relative overflow-hidden">
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                  <GridPattern />
                </div>
                <div className="h-full flex flex-col relative z-10">
                  {!text && (
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
                    placeholder="Describe your startup idea, business model, target market, and competitive advantages..." 
                    className={`flex-1 min-h-[280px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ${text ? 'mt-0 text-left' : 'mt-auto text-center'} placeholder:text-center relative z-10`}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="textFile" className="space-y-2">
              <Label>Upload Text File</Label>
              <div className="min-h-96 border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg">
                <PrettyFileUpload accept="text/plain,.txt" maxSize={5 * 1024 * 1024} onChange={handleFilesSelected} showList={false} />
              </div>
              {file && (
                <div className="mt-3 rounded-lg border bg-muted/20 p-3 sm:p-4">
                  <FilePreview file={file} />
                  {preview?.text && (
                    <pre className="mt-3 max-h-32 sm:max-h-48 overflow-auto whitespace-pre-wrap rounded bg-background p-2 sm:p-3 text-xs border">
                      {preview.text}
                      {file.size > 800 && "\n..."}
                    </pre>
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
              <div className="min-h-96 border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg">
                <PrettyFileUpload accept="audio/*" maxSize={25 * 1024 * 1024} onChange={handleFilesSelected} showList={false} />
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
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Create & Evaluate
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
