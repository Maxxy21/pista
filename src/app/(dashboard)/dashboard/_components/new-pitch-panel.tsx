"use client"

import React, { useCallback, useMemo, useState } from "react"
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
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false
    if (type === "text") return text.trim().length > 0
    return !!file
  }, [title, type, text, file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  const transcribeAudio = async (audioFile: File) => {
    const formData = new FormData()
    formData.append("file", audioFile)
    setProgress(10)
    const interval = setInterval(() => setProgress(p => Math.min(p + 8, 85)), 200)
    try {
      const res = await fetch("/api/transcribe", { method: "POST", body: formData })
      clearInterval(interval)
      setProgress(100)
      if (!res.ok) throw new Error("Transcription failed")
      const data = await res.json()
      return data.text as string
    } catch (e) {
      throw e
    }
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
      let sourceText = text
      if (type === "audio" && file) sourceText = await transcribeAudio(file)
      else if (type === "textFile" && file) sourceText = await readTextFile(file)

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
      router.replace(`/pitch/${id}`)
    } catch (e: any) {
      toast.error(e?.message || "Failed to create pitch")
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }, [canSubmit, processing, type, file, text, title, workspace.mode, organization?.id, createPitch, router])

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-2">
      <Card>
        <CardContent className="p-4 md:p-6 space-y-4">
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
              <Textarea id="pitch-text" rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or write your pitch..." />
            </TabsContent>
            <TabsContent value="textFile" className="space-y-2">
              <Label htmlFor="file">Upload .txt</Label>
              <Input id="file" type="file" accept=".txt,text/plain" onChange={e => handleFileChange(e)} />
            </TabsContent>
            <TabsContent value="audio" className="space-y-2">
              <Label htmlFor="audio">Upload audio</Label>
              <Input id="audio" type="file" accept="audio/*" onChange={e => handleFileChange(e)} />
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
