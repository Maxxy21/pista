"use client"

import React from "react"
import { useOrganization } from "@clerk/nextjs"
import { useWorkspace } from "@/hooks/use-workspace"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { FileAudio2, FileText as FileTextIcon, Upload, Mic } from "lucide-react"
import { useNewPitchForm, type PitchType } from "@/hooks/use-new-pitch-form"
import { useFileHandling } from "@/hooks/use-file-handling"
import { usePitchSubmission } from "@/hooks/use-pitch-submission"
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress"
import { TextInputTab } from "./new-pitch/text-input-tab"
import { FileUploadTab } from "./new-pitch/file-upload-tab"
import { QuestionsSection } from "./new-pitch/questions-section"
import { ProcessingStatus } from "./new-pitch/processing-status"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function NewPitchPanel() {
  const { organization } = useOrganization()
  const workspace = useWorkspace()

  const form = useNewPitchForm()
  const fileHandling = useFileHandling(form.type)
  const submission = usePitchSubmission()
  const { step } = useEvaluationProgress()

  const showTakeover = submission.processing || step === "error"
  const canSubmitWithFile = form.canSubmitBase || (form.type !== "text" && fileHandling.hasValidFile())

  const handleSubmit = () => {
    submission.submitPitch(
      form.title,
      form.type,
      form.text,
      fileHandling.file,
      form.qa,
      form.enableQA,
      form.stage,
      form.preparedText,
      fileHandling.readTextFile,
      form.setQuestions,
      form.setStage,
      form.setPreparedText
    )
  }

  const handleSkipQA = () => {
    submission.skipQAAndSubmit(form.title, form.type, form.preparedText, form.text)
  }

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-2">
      <Card className="overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg md:text-xl font-semibold">Create a New Pitch</h2>
            {workspace.mode === "org" && (
              <span className="text-xs text-muted-foreground">
                Creating in {organization?.name || "Organization"}
              </span>
            )}
          </div>
        </div>

        <CardContent className="p-4 md:p-6">
          {showTakeover ? (
            <ProcessingStatus type={form.type} onRetry={submission.retry} />
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="improve-qa">Improve evaluation with follow-up questions</Label>
                  <p className="text-xs text-muted-foreground">Answering 1–3 questions can improve accuracy.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{form.enableQA ? 'On' : 'Off'}</span>
                  <Switch
                    id="improve-qa"
                    checked={form.enableQA}
                    onCheckedChange={form.setEnableQA}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => form.setTitle(e.target.value)}
                  placeholder='e.g. "AI-powered inventory management for SMBs"'
                />
              </div>

              <Tabs value={form.type} onValueChange={(v) => form.setType(v as PitchType)}>
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
                  <TextInputTab
                    text={form.text}
                    setText={form.setText}
                    textFocused={form.textFocused}
                    setTextFocused={form.setTextFocused}
                  />
                </TabsContent>

                <TabsContent value="textFile" className="space-y-2">
                  <FileUploadTab
                    type="textFile"
                    file={fileHandling.file}
                    preview={fileHandling.preview}
                    onFilesSelected={fileHandling.handleFilesSelected}
                    onRemoveFile={fileHandling.removeFile}
                  />
                </TabsContent>

                <TabsContent value="audio" className="space-y-2">
                  <FileUploadTab
                    type="audio"
                    file={fileHandling.file}
                    preview={fileHandling.preview}
                    onFilesSelected={fileHandling.handleFilesSelected}
                    onRemoveFile={fileHandling.removeFile}
                  />
                </TabsContent>
              </Tabs>

              <QuestionsSection
                qa={form.qa}
                updateQAAnswer={form.updateQAAnswer}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmitWithFile || submission.processing || submission.pending}
                  variant="gold"
                  className="w-full sm:w-auto h-11 text-sm font-medium touch-manipulation"
                  size="lg"
                >
                  {submission.processing || submission.pending ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner variant="minimal" size="sm" />
                      {form.stage === 'questions' ? 'Evaluating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {form.stage === 'questions' ? 'Evaluate with Answers' : 'Create & Evaluate'}
                    </div>
                  )}
                </Button>

                {form.stage === 'questions' && (
                  <Button
                    variant="outline"
                    disabled={!form.canSubmitBase || submission.processing || submission.pending}
                    onClick={handleSkipQA}
                    className="w-full sm:w-auto h-11 text-sm font-medium"
                  >
                    Skip Q&A
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
