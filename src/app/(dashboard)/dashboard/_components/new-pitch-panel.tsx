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
import { FileAudio2, FileText as FileTextIcon } from "lucide-react"
import { FileUpload as PrettyFileUpload } from "@/components/ui/file-upload"
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

  const transcribeAudio = async (audioFile: File) => {
    // Show overlay and drive upload progress
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
  }

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
  }, [canSubmit, processing, type, file, text, title, workspace.mode, organization?.id, createPitch, router])

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
            <TabsList>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="textFile">Text File</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-2">
              <Label htmlFor="pitch-text">Pitch</Label>
              <div className="min-h-96 border border-dashed bg-background rounded-lg p-2">
                <Textarea 
                  id="pitch-text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Paste or write your pitch..." 
                  className="h-96 resize-vertical"
                />
              </div>
            </TabsContent>
            <TabsContent value="textFile" className="space-y-2">
              <Label>Upload .txt</Label>
              <div className="min-h-96 border border-dashed bg-background rounded-lg">
                <PrettyFileUpload accept="text/plain,.txt" maxSize={5 * 1024 * 1024} onChange={handleFilesSelected} showList={false} />
              </div>
              {file && (
                <div className="mt-3 rounded-lg border bg-muted/20 p-3">
                  <FilePreview file={file} />
                  {preview?.text && (
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-background p-2 text-xs border">
                      {preview.text}
                      {file.size > 800 && "\n..."}
                    </pre>
                  )}
                  <div className="mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setFile(null)}>Remove</Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="audio" className="space-y-2">
              <Label>Upload audio</Label>
              <div className="min-h-96 border border-dashed bg-background rounded-lg">
                <PrettyFileUpload accept="audio/*" maxSize={25 * 1024 * 1024} onChange={handleFilesSelected} showList={false} />
              </div>
              {file && (
                <div className="mt-3 rounded-lg border bg-muted/20 p-3">
                  <AudioPreview file={file} onRemove={() => setFile(null)} />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {processing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">Processing...</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onSubmit} disabled={!canSubmit || processing || pending}>
              {processing || pending ? "Creating..." : "Create & Evaluate"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
