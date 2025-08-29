import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../export/copy-button";
import { cn, getScoreColor } from "../utils";
import { getEvaluations } from "@/lib/utils/evaluation-utils";
import { UniversalPitchData } from "@/lib/types/pitch";
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Target,
  Star,
  ArrowRight
} from "lucide-react";
import React, { FC } from "react";

interface StructuredDetailedAnalysisProps {
  data: UniversalPitchData;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "High": return "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800";
    case "Medium": return "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800";
    case "Low": return "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800";
    default: return "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical": return "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800";
    case "Important": return "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800";
    case "Nice to Have": return "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800";
    default: return "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800";
  }
};

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
      <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {evaluations.map((evaluation) => (
          <motion.div
            key={evaluation.criteria}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full relative">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start pr-10">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    {evaluation.criteria}
                  </CardTitle>
                  <Badge className={cn(getScoreColor(evaluation.score))}>
                    {evaluation.score.toFixed(1)}
                  </Badge>
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
                            "px-2 py-0.5 rounded text-xs",
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
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
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
                      <AlertCircle className="h-4 w-4 text-amber-500" />
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
                            <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
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
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-500" />
                        Key Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {evaluation.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex gap-2 leading-relaxed">
                            <span className="text-purple-500 flex-shrink-0 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <div className="absolute top-2 right-4">
                  <CopyButton text={getCopyText(evaluation)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};