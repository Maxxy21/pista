import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn, getScoreColor } from './utils'
import { ScoreRadarChart } from './radar-chart'

interface ScoreOverviewProps {
    data: {
        evaluation: {
            overallScore: number
            evaluations: Array<{
                criteria: string
                score: number
            }>
        }
    }
}

export const ScoreOverview = ({ data }: ScoreOverviewProps) => (
    <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-full">
                    <CardContent className="p-6">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">Overall Score</h3>
                                <Badge className={cn("text-lg font-semibold px-3 py-1", getScoreColor(data.evaluation.overallScore))}>
                                    {data.evaluation.overallScore.toFixed(1)}
                                </Badge>
                            </div>
                            <Progress value={data.evaluation.overallScore * 10} className="my-6 h-2" />
                            <p className="text-muted-foreground mt-2">
                                {data.evaluation.overallScore >= 8 ?
                                    "Excellent pitch! Ready for investors." :
                                    data.evaluation.overallScore >= 6 ?
                                        "Good pitch with minor improvements needed." :
                                        data.evaluation.overallScore >= 4 ?
                                            "Average pitch requiring refinement." :
                                            "Needs significant improvements before presenting to investors."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <ScoreRadarChart data={data.evaluation.evaluations} />
        </div>
        
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Category Scores</h3>
                <div className="space-y-4">
                    {data.evaluation.evaluations.map((evaluation) => (
                        <div key={evaluation.criteria} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{evaluation.criteria}</span>
                                <Badge className={cn(getScoreColor(evaluation.score))}>
                                    {evaluation.score.toFixed(1)}
                                </Badge>
                            </div>
                            <Progress value={evaluation.score * 10} className="h-1.5"/>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
) 