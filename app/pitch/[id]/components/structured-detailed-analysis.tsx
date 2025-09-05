import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "./copy-button";
import { cn, getScoreColor } from "./utils";
import React, { FC, ReactNode, useMemo } from "react";
import { StructuredEvaluation, CategoryEvaluation, EvaluationAspect } from "@/lib/evaluation-schema";
import { Lightbulb, Target, TrendingUp, AlertTriangle } from "lucide-react";

interface LegacyEvaluation {
    criteria: string;
    score: number;
    comment: string;
    strengths: string[];
    improvements: string[];
}

interface StructuredDetailedAnalysisProps {
    data: {
        evaluation: {
            evaluations?: LegacyEvaluation[];
            structured?: StructuredEvaluation;
        };
    };
}

const formatComment = (text: string): ReactNode => {
    if (/\d+\.\s/.test(text)) {
        const parts = text.split(/(\d+\.\s)/);
        const formattedParts: ReactNode[] = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 1) {
                if (i > 1) formattedParts.push(<div key={`space-${i}`} className="mt-2" />);
                formattedParts.push(
                    <p key={i} className="text-sm text-muted-foreground">
                        <span className="font-medium">{parts[i]}</span>
                        {parts[i + 1]}
                    </p>
                );
                i++;
            } else if (i === 0 && parts[i].trim()) {
                formattedParts.push(
                    <p key={i} className="text-sm text-muted-foreground mb-2">
                        {parts[i]}
                    </p>
                );
            }
        }
        return formattedParts;
    }
    return <p className="text-sm text-muted-foreground">{text}</p>;
};

const StrengthsList: FC<{ strengths: string[] }> = ({ strengths }) => (
    <div className="space-y-2">
        <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Strengths
        </h4>
        <ul className="space-y-1 text-sm">
            {strengths.map((strength, idx) => (
                <li key={idx} className="flex gap-2 text-muted-foreground">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{strength}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ImprovementsList: FC<{ improvements: string[] }> = ({ improvements }) => (
    <div className="space-y-2">
        <h4 className="font-medium text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Areas for Improvement
        </h4>
        <ul className="space-y-1 text-sm">
            {improvements.map((improvement, idx) => (
                <li key={idx} className="flex gap-2 text-muted-foreground">
                    <span className="text-amber-500 flex-shrink-0">→</span>
                    <span>{improvement}</span>
                </li>
            ))}
        </ul>
    </div>
);

const InsightsList: FC<{ insights: string[] }> = ({ insights }) => {
    if (!insights.length) return null;
    
    return (
        <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500" />
                Key Insights
            </h4>
            <ul className="space-y-1 text-sm">
                {insights.map((insight, idx) => (
                    <li key={idx} className="flex gap-2 text-muted-foreground">
                        <span className="text-blue-500 flex-shrink-0">💡</span>
                        <span>{insight}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ActionableRecommendationsList: FC<{ recommendations: string[] }> = ({ recommendations }) => {
    if (!recommendations.length) return null;
    
    return (
        <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                Actionable Recommendations
            </h4>
            <ul className="space-y-1 text-sm">
                {recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-2 text-muted-foreground">
                        <span className="text-purple-500 flex-shrink-0">🎯</span>
                        <span>{rec}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AspectBreakdown: FC<{ aspects: EvaluationAspect[] }> = ({ aspects }) => {
    if (!aspects.length) return null;
    
    return (
        <div className="space-y-3 mt-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm">Aspect Breakdown</h4>
            <div className="grid gap-3">
                {aspects.map((aspect, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{aspect.name}</span>
                            <Badge variant="outline" className={cn(getScoreColor(aspect.score))}>
                                {aspect.score.toFixed(1)}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{aspect.analysis}</p>
                        {aspect.recommendations && aspect.recommendations.length > 0 && (
                            <ul className="text-xs space-y-1">
                                {aspect.recommendations.map((rec, recIdx) => (
                                    <li key={recIdx} className="flex gap-1 text-muted-foreground">
                                        <span className="text-purple-400 flex-shrink-0">•</span>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const StructuredCategoryCard: FC<{ category: CategoryEvaluation }> = ({ category }) => {
    const getCopyText = () => [
        category.criteria,
        "",
        `Score: ${category.score.toFixed(1)}/10`,
        "",
        `Analysis: ${category.comment}`,
        "",
        "Strengths:",
        ...category.strengths.map((s) => `• ${s}`),
        "",
        "Areas for Improvement:",
        ...category.improvements.map((i) => `• ${i}`),
        "",
        ...(category.keyInsights.length ? ["Key Insights:", ...category.keyInsights.map((insight) => `• ${insight}`), ""] : []),
        ...(category.actionableRecommendations.length ? ["Actionable Recommendations:", ...category.actionableRecommendations.map((rec) => `• ${rec}`)] : []),
    ].join("\n");

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="h-full relative">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center pr-10">
                        <CardTitle className="text-lg">{category.criteria}</CardTitle>
                        <Badge className={cn(getScoreColor(category.score))}>
                            {category.score.toFixed(1)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">{formatComment(category.comment)}</div>
                    
                    <div className="grid gap-4 lg:grid-cols-2">
                        <StrengthsList strengths={category.strengths} />
                        <ImprovementsList improvements={category.improvements} />
                    </div>
                    
                    {(category.keyInsights?.length > 0 || category.actionableRecommendations?.length > 0) && (
                        <div className="grid gap-4 lg:grid-cols-2">
                            <InsightsList insights={category.keyInsights || []} />
                            <ActionableRecommendationsList recommendations={category.actionableRecommendations || []} />
                        </div>
                    )}
                    
                    <AspectBreakdown aspects={category.aspects || []} />
                    
                    <div className="absolute top-2 right-4">
                        <CopyButton text={getCopyText()} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const LegacyCategoryCard: FC<{ evaluation: LegacyEvaluation }> = ({ evaluation }) => {
    const getCopyText = () => [
        evaluation.criteria,
        "",
        `Score: ${evaluation.score.toFixed(1)}/10`,
        "",
        `Comment: ${evaluation.comment}`,
        "",
        "Strengths:",
        ...evaluation.strengths.map((s) => `• ${s}`),
        "",
        "Areas for Improvement:",
        ...evaluation.improvements.map((i) => `• ${i}`),
    ].join("\n");

    return (
        <motion.div
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
                    <div className="space-y-2">{formatComment(evaluation.comment)}</div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <StrengthsList strengths={evaluation.strengths} />
                        <ImprovementsList improvements={evaluation.improvements} />
                    </div>
                    <div className="absolute top-2 right-4">
                        <CopyButton text={getCopyText()} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export const StructuredDetailedAnalysis: FC<StructuredDetailedAnalysisProps> = ({ data }) => {
    const structuredData = data.evaluation.structured;
    const legacyData = data.evaluation.evaluations;
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
            
            {structuredData?.metadata && (
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Confidence:</span>
                            <Badge variant="outline" className="ml-2">
                                {structuredData.confidence}/10
                            </Badge>
                        </div>
                        <div>
                            <span className="font-medium">Word Count:</span>
                            <span className="ml-2 text-muted-foreground">{structuredData.metadata.wordCount}</span>
                        </div>
                        <div>
                            <span className="font-medium">Processing Time:</span>
                            <span className="ml-2 text-muted-foreground">{structuredData.metadata.processingTime}ms</span>
                        </div>
                        <div>
                            <span className="font-medium">Q&A Included:</span>
                            <span className="ml-2 text-muted-foreground">{structuredData.metadata.hasQnA ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid gap-6 md:grid-cols-2">
                {structuredData ? (
                    structuredData.categories.map((category) => (
                        <StructuredCategoryCard key={category.criteria} category={category} />
                    ))
                ) : (
                    legacyData?.map((evaluation) => (
                        <LegacyCategoryCard key={evaluation.criteria} evaluation={evaluation} />
                    ))
                )}
            </div>
        </div>
    );
};