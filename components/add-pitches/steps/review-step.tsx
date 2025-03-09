"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ReviewStepProps {
  pitchData: {
    title: string
    type: string
    content: string
  }
  processedText: string
}

export function ReviewStep({ pitchData, processedText }: ReviewStepProps) {
  const displayText = pitchData.type === "text" ? pitchData.content : processedText

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{pitchData.title}</h3>
        <Card>
          <CardContent className="p-4 max-h-[400px] overflow-y-auto">
            <p className="whitespace-pre-wrap">{displayText}</p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Source: {pitchData.type === "text" ? "Direct Text Input" : 
                  pitchData.type === "audio" ? "Audio Transcription" : "Text File"}
        </h4>
      </div>
    </div>
  )
} 