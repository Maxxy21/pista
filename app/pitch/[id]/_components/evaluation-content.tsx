import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getShortCriteriaName } from "@/utils"

interface Evaluation {
    criteria: string
    score: number
    comment: string
    strengths: string[]
    improvements: string[]
    aspects: string[]
}

interface EvaluationData {
    evaluation: {
        overallScore: number
        overallFeedback: string
        evaluations: Evaluation[]
    }
}

export function EvaluationContent({ data }: { data: EvaluationData }) {
    return (
        <div className="space-y-4 md:space-y-6">
            {/* Score Overview */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-gradient-to-br from-blue-500/10 via-blue-400/10 to-blue-300/10">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base md:text-lg">Overall Score</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                                {data.evaluation.evaluations.length} criteria
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold">
                  {data.evaluation.overallScore.toFixed(1)}
                </span>
                                <span className="text-muted-foreground">/10</span>
                            </div>
                            <Progress value={data.evaluation.overallScore * 10} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base md:text-lg">Score Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.evaluation.evaluations.map((evaluation) => (
                            <div key={evaluation.criteria} className="space-y-1">
                                <div className="flex items-center justify-between text-xs md:text-sm">
                                    <span>{getShortCriteriaName(evaluation.criteria)}</span>
                                    <span className="font-medium">{evaluation.score.toFixed(1)}/10</span>
                                </div>
                                <Progress value={evaluation.score * 10} className="h-1.5" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Overall Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.evaluation.overallFeedback}
                    </p>
                </CardContent>
            </Card>

            {/* Detailed Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={getShortCriteriaName(data.evaluation.evaluations[0].criteria)}>
                        <ScrollArea className="w-full">
                            <TabsList className="w-full justify-start inline-flex h-9 md:h-10">
                                {data.evaluation.evaluations.map((evaluation) => (
                                    <TabsTrigger
                                        key={evaluation.criteria}
                                        value={getShortCriteriaName(evaluation.criteria)}
                                        className="text-xs md:text-sm px-3"
                                    >
                                        {getShortCriteriaName(evaluation.criteria)}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </ScrollArea>

                        {data.evaluation.evaluations.map((evaluation) => (
                            <TabsContent
                                key={evaluation.criteria}
                                value={getShortCriteriaName(evaluation.criteria)}
                                className="mt-4 space-y-4 md:space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-base md:text-lg">{evaluation.criteria}</h3>
                                    <Badge variant="secondary" className="text-sm">
                                        {evaluation.score.toFixed(1)}/10
                                    </Badge>
                                </div>

                                <div className="space-y-4 md:space-y-6">
                                    <div>
                                        <h4 className="font-medium mb-2 text-sm md:text-base">Analysis</h4>
                                        <p className="text-sm text-muted-foreground">{evaluation.comment}</p>
                                    </div>

                                    <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                                        <div>
                                            <h4 className="font-medium mb-2 text-sm md:text-base flex items-center gap-2">
                                                Key Strengths
                                                <Badge variant="secondary" className="text-xs">
                                                    {evaluation.strengths.length}
                                                </Badge>
                                            </h4>
                                            <ul className="space-y-2">
                                                {evaluation.strengths.map((strength, index) => (
                                                    <li key={index} className="text-xs md:text-sm text-muted-foreground">
                                                        • {strength}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2 text-sm md:text-base flex items-center gap-2">
                                                Areas for Improvement
                                                <Badge variant="secondary" className="text-xs">
                                                    {evaluation.improvements.length}
                                                </Badge>
                                            </h4>
                                            <ul className="space-y-2">
                                                {evaluation.improvements.map((improvement, index) => (
                                                    <li key={index} className="text-xs md:text-sm text-muted-foreground">
                                                        • {improvement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2 text-sm md:text-base">Evaluation Criteria</h4>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {evaluation.aspects.map((aspect, index) => (
                                                <Card key={index} className="p-2 md:p-3">
                                                    <p className="text-xs md:text-sm">{aspect}</p>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

