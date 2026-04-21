import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../export/copy-button";
import {
  getOverallFeedback,
  hasMetadata
} from "@/lib/utils/evaluation-utils";
import {
  getSeverityColor,
  getViabilityColor,
  getExecutionColor
} from "@/lib/utils/evaluation-colors";
import { UniversalPitchData } from "@/lib/types/pitch";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
  Trophy,
  Zap
} from "lucide-react";
import React, { FC } from "react";

interface StructuredEvaluationSummaryProps {
  data: UniversalPitchData;
}

export const StructuredEvaluationSummary: FC<StructuredEvaluationSummaryProps> = ({ data }) => {
  const rawFeedback = getOverallFeedback(data.evaluation);
  const metadata = hasMetadata(data.evaluation) ? data.evaluation.metadata : null;

  const feedback = typeof rawFeedback === 'string' ? {
    overallAssessment: {
      summary: rawFeedback,
      keyHighlights: [],
      primaryConcerns: [],
    },
    investmentThesis: {
      viability: 'Not Applicable' as const,
      reasoning: '',
      potentialReturns: '',
    },
    riskAssessment: {
      majorRisks: [],
      riskScore: 5,
    },
    nextSteps: {
      immediateActions: [],
      longTermRecommendations: [],
      followUpQuestions: [],
    },
    competitivePosition: {
      strengths: [],
      weaknesses: [],
      marketOpportunity: '',
    },
    foundersAssessment: {
      teamStrengths: [],
      experienceGaps: [],
      executionCapability: 'Good' as const,
    },
  } : rawFeedback;

  const copyText = `
EVALUATION SUMMARY
${feedback.overallAssessment.summary}

KEY HIGHLIGHTS:
${feedback.overallAssessment.keyHighlights.map(h => `• ${h}`).join('\n')}

PRIMARY CONCERNS:
${feedback.overallAssessment.primaryConcerns.map(c => `• ${c}`).join('\n')}

INVESTMENT THESIS:
Viability: ${feedback.investmentThesis.viability}
${feedback.investmentThesis.reasoning}

RISK ASSESSMENT (Score: ${feedback.riskAssessment.riskScore}/10):
${feedback.riskAssessment.majorRisks.map(r => `• ${r.risk} (${r.severity}): ${r.mitigation}`).join('\n')}

IMMEDIATE ACTIONS:
${feedback.nextSteps.immediateActions.map(a => `• ${a}`).join('\n')}

COMPETITIVE POSITION:
Market Opportunity: ${feedback.competitivePosition.marketOpportunity}

TEAM ASSESSMENT:
Execution Capability: ${feedback.foundersAssessment.executionCapability}
`.trim();

  return (
    <div className="space-y-4">
      {/* Overall Assessment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-foreground" />
            <CardTitle className="text-base">Overall Assessment</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {metadata && (
              <span className="text-xs text-muted-foreground">
                {metadata.processingTime}ms
              </span>
            )}
            <CopyButton text={copyText} />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feedback.overallAssessment.summary}
          </p>

          {(feedback.overallAssessment.keyHighlights.length > 0 || feedback.overallAssessment.primaryConcerns.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {feedback.overallAssessment.keyHighlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
                    <Trophy className="h-3.5 w-3.5" />
                    Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {feedback.overallAssessment.keyHighlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-green-500 shrink-0">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {feedback.overallAssessment.primaryConcerns.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Concerns
                  </h4>
                  <ul className="space-y-1.5">
                    {feedback.overallAssessment.primaryConcerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-amber-500 shrink-0">!</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Thesis + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-foreground" />
              <CardTitle className="text-base">Investment Thesis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Viability</span>
              <Badge className={getViabilityColor(feedback.investmentThesis.viability)}>
                {feedback.investmentThesis.viability}
              </Badge>
            </div>
            {feedback.investmentThesis.reasoning && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feedback.investmentThesis.reasoning}
              </p>
            )}
            {feedback.investmentThesis.potentialReturns && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Potential returns: </span>
                  {feedback.investmentThesis.potentialReturns}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-foreground" />
                <CardTitle className="text-base">Risk Assessment</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {feedback.riskAssessment.riskScore}/10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {feedback.riskAssessment.majorRisks.map((risk, idx) => (
              <div key={idx} className={`p-3 rounded-lg border text-xs ${getSeverityColor(risk.severity)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{risk.risk}</span>
                  <Badge variant="outline" className="text-xs">{risk.severity}</Badge>
                </div>
                <p className="opacity-75 leading-relaxed">{risk.mitigation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Next Steps + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-foreground" />
              <CardTitle className="text-base">Next Steps</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.nextSteps.immediateActions.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <Zap className="h-3.5 w-3.5" />
                  Immediate
                </h4>
                <ul className="space-y-1.5">
                  {feedback.nextSteps.immediateActions.map((action, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span className="shrink-0">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.nextSteps.longTermRecommendations.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Long-term</h4>
                  <ul className="space-y-1.5">
                    {feedback.nextSteps.longTermRecommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="shrink-0">·</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-foreground" />
                <CardTitle className="text-base">Team Assessment</CardTitle>
              </div>
              <Badge className={getExecutionColor(feedback.foundersAssessment.executionCapability)}>
                {feedback.foundersAssessment.executionCapability}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.foundersAssessment.teamStrengths.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Strengths</h4>
                <ul className="space-y-1.5">
                  {feedback.foundersAssessment.teamStrengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-green-500 shrink-0">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.foundersAssessment.experienceGaps.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Experience Gaps</h4>
                  <ul className="space-y-1.5">
                    {feedback.foundersAssessment.experienceGaps.map((gap, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-amber-500 shrink-0">!</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Competitive Position */}
      {(feedback.competitivePosition.marketOpportunity || feedback.competitivePosition.strengths.length > 0 || feedback.competitivePosition.weaknesses.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Competitive Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.competitivePosition.marketOpportunity && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Market Opportunity</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feedback.competitivePosition.marketOpportunity}
                </p>
              </div>
            )}
            {(feedback.competitivePosition.strengths.length > 0 || feedback.competitivePosition.weaknesses.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {feedback.competitivePosition.strengths.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Strengths</h4>
                    <ul className="space-y-1.5">
                      {feedback.competitivePosition.strengths.map((s, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-green-500 shrink-0">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.competitivePosition.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Weaknesses</h4>
                    <ul className="space-y-1.5">
                      {feedback.competitivePosition.weaknesses.map((w, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-red-400 shrink-0">×</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
