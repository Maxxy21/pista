import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from './copy-button'
import { cn, getScoreColor } from './utils'

interface DetailedAnalysisProps {
    data: {
        evaluation: {
            evaluations: Array<{
                criteria: string
                score: number
                comment: string
                strengths: string[]
                improvements: string[]
            }>
        }
    }
}

export const DetailedAnalysis = ({ data }: DetailedAnalysisProps) => (
    <div>
        <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
        <div className="grid gap-6 md:grid-cols-2">
            {data.evaluation.evaluations.map((evaluation) => (
                <motion.div
                    key={evaluation.criteria}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="h-full relative">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center pr-10">
                                <CardTitle className="text-lg">{evaluation.criteria}</CardTitle>
                                <Badge className={cn(getScoreColor(evaluation.score))}>
                                    {evaluation.score.toFixed(1)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{evaluation.comment}</p>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Strengths</h4>
                                    <ul className="space-y-1 text-sm">
                                        {evaluation.strengths.map((strength, idx) => (
                                            <li key={idx} className="flex gap-2 text-muted-foreground">
                                                <span className="text-green-500 flex-shrink-0">✓</span>
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Areas for Improvement</h4>
                                    <ul className="space-y-1 text-sm">
                                        {evaluation.improvements.map((improvement, idx) => (
                                            <li key={idx} className="flex gap-2 text-muted-foreground">
                                                <span className="text-amber-500 flex-shrink-0">→</span>
                                                <span>{improvement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="absolute top-2 right-4">
                                <CopyButton
                                    text={`${evaluation.criteria}\n\nScore: ${evaluation.score.toFixed(1)}/10\n\nComment: ${evaluation.comment}\n\nStrengths:\n${evaluation.strengths.map(s => `• ${s}`).join('\n')}\n\nAreas for Improvement:\n${evaluation.improvements.map(i => `• ${i}`).join('\n')}`} 
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    </div>
) 