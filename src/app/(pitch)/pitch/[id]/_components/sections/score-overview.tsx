import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, getScoreColor } from "../utils";
import { ScoreBarChart } from "../charts/score-bar-chart";
import { UniversalPitchData } from "@/lib/types/pitch";
import { getEvaluations } from "@/lib/utils/evaluation-utils";
import { Badge } from "@/components/ui/badge";

interface ScoreOverviewProps {
    data: UniversalPitchData;
}

const getScoreDescription = (score: number) => {
    if (score >= 8) return "Strong pitch. Ready to present to investors.";
    if (score >= 6) return "Solid pitch with a few areas to sharpen.";
    if (score >= 4) return "Promising concept, but needs meaningful refinement.";
    return "Needs significant work before presenting to investors.";
};

export const ScoreOverview = ({ data }: ScoreOverviewProps) => {
    const evaluations = getEvaluations(data.evaluation);
    const overallScore = data.evaluation.overallScore;

    return (
        <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {/* Overall score card */}
                <Card className="h-full">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
                                Overall Score
                            </p>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-5xl font-bold tabular-nums">
                                    {overallScore.toFixed(1)}
                                </span>
                                <span className="text-lg text-muted-foreground mb-1">/10</span>
                            </div>
                            <Progress value={overallScore * 10} className="h-1.5 mt-4 mb-4" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {getScoreDescription(overallScore)}
                        </p>
                    </CardContent>
                </Card>

                {/* Bar chart */}
                <ScoreBarChart data={evaluations} />
            </div>

            {/* Category scores */}
            <Card>
                <CardHeader className="pb-2 pt-5 px-6">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Category Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="space-y-4">
                        {evaluations.map(({ criteria, score }) => (
                            <div key={criteria} className="space-y-1.5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{criteria}</span>
                                    <Badge className={cn(getScoreColor(score))}>{score.toFixed(1)}</Badge>
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
