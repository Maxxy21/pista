import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CopyButton } from './copy-button'

interface EvaluationSummaryProps {
    data: {
        evaluation: {
            overallFeedback: string
        }
    }
}

export const EvaluationSummary = ({ data }: EvaluationSummaryProps) => (
    <Card className="relative overflow-hidden border-primary/20">
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Evaluation Summary</CardTitle>
            <CopyButton text={data.evaluation.overallFeedback} />
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground leading-relaxed">
                {data.evaluation.overallFeedback}
            </p>
        </CardContent>
    </Card>
) 