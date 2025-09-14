import React from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileUpload as PrettyFileUpload } from "@/components/ui/file-upload"
import { AudioPreview } from "@/components/ui/previews/audio-preview"
import { FilePreview } from "@/components/ui/previews/file-preview"
import { normalizeTranscriptText } from "@/lib/utils/text"

type FileType = "textFile" | "audio"

interface FileUploadTabProps {
  type: FileType
  file: File | null
  preview: { url?: string; text?: string } | null
  onFilesSelected: (files: File[]) => void
  onRemoveFile: () => void
}

export function FileUploadTab({ 
  type, 
  file, 
  preview, 
  onFilesSelected, 
  onRemoveFile 
}: FileUploadTabProps) {
  const isAudio = type === "audio"
  const accept = isAudio ? "audio/*" : "text/plain,.txt"
  const maxSize = isAudio ? 25 * 1024 * 1024 : 5 * 1024 * 1024
  const label = isAudio ? "Upload Audio File" : "Upload Text File"

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="h-[480px] border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background rounded-lg overflow-hidden">
        <div className="h-full [&>div]:h-full [&>div>div]:h-full [&>div>div]:!p-4 [&>div>div]:flex [&>div>div]:items-center [&>div>div]:justify-center">
          <PrettyFileUpload 
            accept={accept} 
            maxSize={maxSize} 
            onChange={onFilesSelected} 
            showList={false} 
          />
        </div>
      </div>
      
      {file && (
        <div className="mt-3 rounded-lg border bg-muted/20 p-3 sm:p-4">
          {isAudio ? (
            <AudioPreview file={file} onRemove={onRemoveFile} />
          ) : (
            <FilePreview file={file} />
          )}
          
          {/* Text file preview */}
          {!isAudio && preview?.text && (
            <div className="mt-3 max-h-32 sm:max-h-48 overflow-auto rounded bg-background p-2 sm:p-3 text-sm border" style={{ textAlign: 'justify' }}>
              {normalizeTranscriptText(preview.text).slice(0, 800)}
              {file.size > 800 && "..."}
            </div>
          )}
          
          <div className="mt-3 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {isAudio ? (
                `${(file.size / (1024 * 1024)).toFixed(1)} MB • ${file.name}`
              ) : (
                `${(file.size / 1024).toFixed(1)} KB`
              )}
            </div>
            {!isAudio && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-xs touch-manipulation" 
                onClick={onRemoveFile}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}