import React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText as FileTextIcon } from "lucide-react"
import { GridPattern } from "@/components/ui/file-upload"

interface TextInputTabProps {
  text: string
  setText: (text: string) => void
  textFocused: boolean
  setTextFocused: (focused: boolean) => void
}

export function TextInputTab({ 
  text, 
  setText, 
  textFocused, 
  setTextFocused 
}: TextInputTabProps) {
  return (
    <div className="space-y-2">
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
    </div>
  )
}