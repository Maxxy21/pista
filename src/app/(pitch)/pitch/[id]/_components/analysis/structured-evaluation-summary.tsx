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
  Clock,
  Zap
} from "lucide-react";
import React, { FC } from "react";

interface StructuredEvaluationSummaryProps {
  data: UniversalPitchData;
}


export const StructuredEvaluationSummary: FC<StructuredEvaluationSummaryProps> = ({ data }) => {
  const rawFeedback = getOverallFeedback(data.evaluation);
  const metadata = hasMetadata(data.evaluation) ? data.evaluation.metadata : null;

  // Normalize legacy string feedback into structured shape for rendering
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
    <div className="space-y-6">
      {/* Overall Assessment */}
      <Card className="relative overflow-hidden border-primary/20">
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <CardTitle>Overall Assessment</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {metadata && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {metadata.processingTime}ms
              </div>
            )}
            <CopyButton text={copyText} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {feedback.overallAssessment.summary}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-green-500" />
                Key Highlights
              </h4>
              <ul className="space-y-1">
                {feedback.overallAssessment.keyHighlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Primary Concerns
              </h4>
              <ul className="space-y-1">
                {feedback.overallAssessment.primaryConcerns.map((concern, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-amber-500 flex-shrink-0">!</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Thesis & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Investment Thesis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Viability:</span>
              <Badge className={getViabilityColor(feedback.investmentThesis.viability)}>
                {feedback.investmentThesis.viability}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {feedback.investmentThesis.reasoning}
            </p>
            <Separator />
            <div>
              <span className="text-sm font-medium">Potential Returns: </span>
              <span className="text-sm text-muted-foreground">
                {feedback.investmentThesis.potentialReturns}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
              </div>
              <Badge variant="outline">
                Risk Score: {feedback.riskAssessment.riskScore}/10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedback.riskAssessment.majorRisks.map((risk, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(risk.severity)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{risk.risk}</span>
                  <Badge variant="outline">
                    {risk.severity}
                  </Badge>
                </div>
                <p className="text-xs opacity-80">{risk.mitigation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Next Steps & Team Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                Immediate Actions
              </h4>
              <ul className="space-y-1">
                {feedback.nextSteps.immediateActions.map((action, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-orange-500 flex-shrink-0">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm mb-2">Long-term Recommendations</h4>
              <ul className="space-y-1">
                {feedback.nextSteps.longTermRecommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-blue-500 flex-shrink-0">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Team Assessment</CardTitle>
              </div>
              <Badge className={getExecutionColor(feedback.foundersAssessment.executionCapability)}>
                {feedback.foundersAssessment.executionCapability}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Team Strengths</h4>
              <ul className="space-y-1">
                {feedback.foundersAssessment.teamStrengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {feedback.foundersAssessment.experienceGaps.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-2">Experience Gaps</h4>
                  <ul className="space-y-1">
                    {feedback.foundersAssessment.experienceGaps.map((gap, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-amber-500 flex-shrink-0">!</span>
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

      {/* Market Position */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Competitive Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Market Opportunity</h4>
            <p className="text-sm text-muted-foreground">
              {feedback.competitivePosition.marketOpportunity}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Competitive Strengths</h4>
              <ul className="space-y-1">
                {feedback.competitivePosition.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Competitive Weaknesses</h4>
              <ul className="space-y-1">
                {feedback.competitivePosition.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-red-500 flex-shrink-0">×</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
