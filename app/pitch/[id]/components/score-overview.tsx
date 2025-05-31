import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn, getScoreColor } from "./utils";
import { ScoreRadarChart } from "./radar-chart";

interface Evaluation {
    criteria: string;
    score: number;
}

interface ScoreOverviewProps {
    data: {
        evaluation: {
            overallScore: number;
            evaluations: Evaluation[];
        };
    };
}

const getScoreDescription = (score: number) => {
    if (score >= 8) return "Excellent pitch! Ready for investors.";
    if (score >= 6) return "Good pitch with minor improvements needed.";
    if (score >= 4) return "Average pitch requiring refinement.";
    return "Needs significant improvements before presenting to investors.";
};

export const ScoreOverview = ({ data }: ScoreOverviewProps) => {
    const { overallScore, evaluations } = data.evaluation;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-full">
                        <CardContent className="p-6">
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold">Overall Score</h3>
                                    <Badge
                                        className={cn(
                                            "text-lg font-semibold px-3 py-1",
                                            getScoreColor(overallScore)
                                        )}
                                    >
                                        {overallScore.toFixed(1)}
                                    </Badge>
                                </div>
                                <Progress value={overallScore * 10} className="my-6 h-2" />
                                <p className="text-muted-foreground mt-2">
                                    {getScoreDescription(overallScore)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <ScoreRadarChart data={evaluations} />
            </div>

            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Category Scores</h3>
                    <div className="space-y-4">
                        {evaluations.map(({ criteria, score }) => (
                            <div key={criteria} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{criteria}</span>
                                    <Badge className={cn(getScoreColor(score))}>
                                        {score.toFixed(1)}
                                    </Badge>
                                </div>
                                <Progress value={score * 10} className="h-1.5" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};