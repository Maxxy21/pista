import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../export/copy-button";
import { cn, getScoreColor } from "../utils";
import { getImpactColor, getPriorityColor } from "@/lib/utils/evaluation-colors";
import { getEvaluations } from "@/lib/utils/evaluation-utils";
import { UniversalPitchData } from "@/lib/types/pitch";
import {
  AlertCircle,
  CheckCircle2,
  Target,
  Star,
} from "lucide-react";
import React, { FC } from "react";

interface StructuredDetailedAnalysisProps {
  data: UniversalPitchData;
}

const getCopyText = (evaluation: any) => {
  const strengths = evaluation.breakdown.strengths.map((s: any) => 
    `• ${s.point} (${s.impact} impact)`
  ).join('\n');
  
  const improvements = evaluation.breakdown.improvements.map((i: any) => 
    `• ${i.area} (${i.priority}): ${i.actionable}`
  ).join('\n');
  
  const aspectScores = evaluation.breakdown.aspectScores.map((a: any) => 
    `• ${a.aspect}: ${a.score}/10 - ${a.rationale}`
  ).join('\n');
  
  return `
${evaluation.criteria.toUpperCase()}
Score: ${evaluation.score.toFixed(1)}/10

SUMMARY:
${evaluation.summary}

STRENGTHS:
${strengths}

IMPROVEMENTS:
${improvements}

ASPECT BREAKDOWN:
${aspectScores}

RECOMMENDATIONS:
${evaluation.recommendations.map((r: string) => `• ${r}`).join('\n')}
`.trim();
};

export const StructuredDetailedAnalysis: FC<StructuredDetailedAnalysisProps> = ({ data }) => {
  const evaluations = getEvaluations(data.evaluation);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-4">Detailed Analysis</h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.criteria} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-foreground" />
                    {evaluation.criteria}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(getScoreColor(evaluation.score))}>
                      {evaluation.score.toFixed(1)}
                    </Badge>
                    <CopyButton text={getCopyText(evaluation)} />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Summary */}
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {evaluation.summary}
                  </p>
                </div>

                {/* Aspect Scores */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Aspect Breakdown</h4>
                  <div className="space-y-2">
                    {evaluation.breakdown.aspectScores.map((aspect, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium">{aspect.aspect}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded font-mono text-xs",
                            getScoreColor(aspect.score)
                          )}>
                            {aspect.score.toFixed(1)}
                          </span>
                        </div>
                        <Progress value={aspect.score * 10} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          {aspect.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Strengths and Improvements */}
                <div className="grid gap-4 grid-cols-1">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[hsl(var(--score-high))]" />
                      Strengths
                    </h4>
                    <div className="space-y-2">
                      {evaluation.breakdown.strengths.map((strength, idx) => (
                        <div key={idx} className={cn(
                          "p-2 rounded-lg border text-xs",
                          getImpactColor(strength.impact)
                        )}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium leading-tight">{strength.point}</span>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {strength.impact}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[hsl(var(--score-mid))]" />
                      Improvements
                    </h4>
                    <div className="space-y-2">
                      {evaluation.breakdown.improvements.map((improvement, idx) => (
                        <div key={idx} className={cn(
                          "p-2 rounded-lg border text-xs",
                          getPriorityColor(improvement.priority)
                        )}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium leading-tight">{improvement.area}</span>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {improvement.priority}
                            </Badge>
                          </div>
                          <div className="flex items-start gap-1 mt-1">
                            <span className="shrink-0">→</span>
                            <span className="opacity-80 leading-tight">{improvement.actionable}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {evaluation.recommendations.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1.5">
                        {evaluation.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex gap-2 leading-relaxed">
                            <span className="shrink-0 mt-0.5">·</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};