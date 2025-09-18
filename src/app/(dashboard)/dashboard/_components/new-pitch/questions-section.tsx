import React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface QAItem {
  text: string
  answer: string
}

interface QuestionsSectionProps {
  qa: QAItem[]
  updateQAAnswer: (index: number, answer: string) => void
}

export function QuestionsSection({ qa, updateQAAnswer }: QuestionsSectionProps) {
  if (!qa || qa.length === 0) return null

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-background">
      <div className="space-y-1">
        <h3 className="font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Follow-up Questions
        </h3>
        <p className="text-sm text-muted-foreground">
          Answer these questions to get a more accurate evaluation of your pitch.
        </p>
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
              onChange={(e) => updateQAAnswer(idx, e.target.value)}
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
  )
}