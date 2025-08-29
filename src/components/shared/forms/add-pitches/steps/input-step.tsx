"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

// UI Components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Icons
import {
  Upload,
  Mic,
  FileText,
} from "lucide-react"

// Custom Components
import { AudioPreview } from "../audio-preview"
import { FilePreview } from "../file-preview"

interface InputStepProps {
  pitchData: {
    title: string
    type: string
    content: string
  }
  setPitchData: (data: any) => void
  files: File[]
  setFiles: (files: File[]) => void
  isProcessing: boolean
}

export function InputStep({
  pitchData,
  setPitchData,
  files,
  setFiles,
  isProcessing,
}: InputStepProps) {
  const [activeTab, setActiveTab] = useState(pitchData.type || "text")

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: activeTab === "audio"
      ? { 'audio/*': ['.mp3', '.wav', '.m4a'] }
      : { 'text/plain': ['.txt'] },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
    },
    disabled: isProcessing,
  })

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setPitchData({
      ...pitchData,
      type: value,
      content: value === "text" ? pitchData.content : "",
    })
    setFiles([])
  }

  const handleRemoveFile = () => {
    setFiles([])
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Pitch Title</Label>
        <Input
          id="title"
          placeholder="Enter a title for your pitch"
          value={pitchData.title}
          onChange={(e) => setPitchData({ ...pitchData, title: e.target.value })}
          className="mt-1.5"
          disabled={isProcessing}
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="textFile">File</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div>
            <Label htmlFor="content">Your Pitch</Label>
            <Textarea
              id="content"
              placeholder="Enter your pitch here..."
              value={pitchData.content}
              onChange={(e) => setPitchData({ ...pitchData, content: e.target.value })}
              className="mt-1.5 min-h-[200px]"
              disabled={isProcessing}
            />
          </div>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive && !isProcessing && "border-primary bg-primary/5",
              isProcessing ? "opacity-50 cursor-not-allowed bg-muted" : "hover:border-primary hover:bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <AudioPreview file={files[0]} onRemove={handleRemoveFile} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">
                  {isDragActive
                    ? "Drop the audio file here"
                    : "Drag & drop your audio file here"
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP3, WAV, M4A (max 50MB)
                </p>
                <Button size="sm" variant="outline" type="button">
                  Browse files
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="textFile" className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive && !isProcessing && "border-primary bg-primary/5",
              isProcessing ? "opacity-50 cursor-not-allowed bg-muted" : "hover:border-primary hover:bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <FilePreview file={files[0]} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">
                  {isDragActive
                    ? "Drop the text file here"
                    : "Drag & drop your text file here"
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports TXT files (max 10MB)
                </p>
                <Button size="sm" variant="outline" type="button">
                  Browse files
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 