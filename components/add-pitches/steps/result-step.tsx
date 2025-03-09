import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResultStepProps {
  result: {
    id: string
    evaluation: {
      overallScore: number
      overallFeedback: string
    }
  }
  onViewResults: () => void
}

export function ResultStep({ result, onViewResults }: ResultStepProps) {
  if (!result) return null

  const { evaluation } = result
  const scoreColor = 
    evaluation.overallScore >= 8 ? "bg-green-500/10 text-green-500 border-green-500/20" :
    evaluation.overallScore >= 6 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
    evaluation.overallScore >= 4 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
    "bg-red-500/10 text-red-500 border-red-500/20"

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Evaluation Complete</h3>
        <p className="text-muted-foreground text-center mb-4">
          Your pitch has been evaluated successfully
        </p>
        
        <Badge className={`text-lg px-3 py-1 ${scoreColor}`}>
          Score: {evaluation.overallScore.toFixed(1)}/10
        </Badge>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Summary Feedback</h4>
          <p className="text-muted-foreground">{evaluation.overallFeedback}</p>
        </CardContent>
      </Card>
      
      <div className="flex justify-center pt-4">
        <Button 
          onClick={onViewResults}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          View Detailed Results
        </Button>
      </div>
    </div>
  )
} 