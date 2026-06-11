import { Card, CardContent } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { ScoreRadarChart } from "../charts/radar-chart";
import { UniversalPitchData } from "@/lib/types/pitch";
import { getEvaluations } from "@/lib/utils/evaluation-utils";
import { getScoreTier, type ScoreTier } from "@/lib/utils/score";

interface ScoreOverviewProps {
    data: UniversalPitchData;
}

const getScoreDescription = (score: number) => {
    if (score >= 8) return "Strong pitch. Ready to present to investors.";
    if (score >= 6) return "Solid pitch with a few areas to sharpen.";
    if (score >= 4) return "Promising concept, but needs meaningful refinement.";
    return "Needs significant work before presenting to investors.";
};

const TIER_BAR: Record<ScoreTier, string> = {
    high: "bg-[hsl(var(--score-high))]",
    mid: "bg-[hsl(var(--score-mid))]",
    low: "bg-[hsl(var(--score-low))]",
};

export const ScoreOverview = ({ data }: ScoreOverviewProps) => {
    const evaluations = getEvaluations(data.evaluation);
    const overallScore = data.evaluation.overallScore;

    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Verdict hero */}
            <Card className="h-full">
                <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Overall Score
                    </p>
                    <div className="flex flex-col items-center gap-5 text-center">
                        <ScoreRing score={overallScore} size="xl" />
                        <h2 className="max-w-sm font-display text-2xl leading-snug">
                            {getScoreDescription(overallScore)}
                        </h2>
                    </div>
                    <div />
                </CardContent>
            </Card>

            {/* Category card */}
            <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-5 p-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Category Breakdown
                    </p>
                    <ScoreRadarChart data={evaluations} />
                    <div className="space-y-3">
                        {evaluations.map(({ criteria, score }) => {
                            const tier = getScoreTier(score);
                            return (
                                <div key={criteria} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{criteria}</span>
                                        <span className="font-mono text-muted-foreground">
                                            {score.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className={`h-full rounded-full ${TIER_BAR[tier]}`}
                                            style={{ width: `${score * 10}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
