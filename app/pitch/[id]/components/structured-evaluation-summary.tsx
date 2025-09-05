import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "./copy-button";
import React, { FC, ReactNode, useMemo } from "react";
import { StructuredEvaluation } from "@/lib/evaluation-schema";
import { TrendingUp, AlertTriangle, Target, Building, DollarSign } from "lucide-react";

interface StructuredEvaluationSummaryProps {
    data: {
        evaluation: {
            overallFeedback?: string;
            structured?: StructuredEvaluation;
        };
    };
}

const formatFeedback = (text: string): ReactNode[] => {
    if (!text) return [];
    const parts = text.split(/(\d+\.\s)/);
    const formattedParts: ReactNode[] = [];

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            if (i > 1) {
                formattedParts.push(
                    <div key={`space-${i}`} className="mt-4" aria-hidden="true" />
                );
            }
            formattedParts.push(
                <p key={i} className="text-muted-foreground leading-relaxed">
                    <span className="font-medium">{parts[i]}</span>
                    {parts[i + 1]}
                </p>
            );
            i++;
        } else if (i === 0 && parts[i].trim()) {
            formattedParts.push(
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                    {parts[i]}
                </p>
            );
        }
    }

    return formattedParts;
};

const SectionCard: FC<{ 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'info';
}> = ({ title, icon, children, variant = 'default' }) => {
    const variantClasses = {
        default: 'border-primary/20',
        success: 'border-green-200 bg-green-50/50',
        warning: 'border-amber-200 bg-amber-50/50',
        info: 'border-blue-200 bg-blue-50/50'
    };

    return (
        <Card className={`relative overflow-hidden ${variantClasses[variant]}`}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
};

const ListSection: FC<{ items: string[]; emptyMessage?: string }> = ({ 
    items, 
    emptyMessage = "None identified" 
}) => {
    if (!items.length) {
        return <p className="text-muted-foreground italic">{emptyMessage}</p>;
    }

    return (
        <ul className="space-y-2">
            {items.map((item, idx) => (
                <li key={idx} className="flex gap-2 text-muted-foreground leading-relaxed">
                    <span className="text-primary flex-shrink-0 mt-1">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

const StructuredSummary: FC<{ structured: StructuredEvaluation }> = ({ structured }) => {
    const { overallAssessment } = structured;
    
    const getCopyText = () => [
        "EVALUATION SUMMARY",
        "==================",
        "",
        "Overall Assessment:",
        overallAssessment.summary,
        "",
        "Investment Thesis:",
        overallAssessment.investmentThesis,
        "",
        "Major Risks:",
        ...overallAssessment.majorRisks.map(risk => `• ${risk}`),
        "",
        "Mitigation Strategies:",
        ...overallAssessment.mitigationStrategies.map(strategy => `• ${strategy}`),
        "",
        "Next Steps:",
        ...overallAssessment.nextSteps.map(step => `• ${step}`),
        "",
        "Competitive Position:",
        overallAssessment.competitivePosition,
        "",
        `Funding Readiness Score: ${overallAssessment.fundingReadiness}/10`,
    ].join("\n");

    return (
        <div className="space-y-6">
            {/* Overall Assessment */}
            <SectionCard 
                title="Overall Assessment" 
                icon={<TrendingUp className="h-5 w-5" />}
                variant="info"
            >
                <div className="flex justify-between items-start mb-4">
                    <p className="text-muted-foreground leading-relaxed flex-1">
                        {overallAssessment.summary}
                    </p>
                    <div className="ml-4">
                        <CopyButton text={getCopyText()} />
                    </div>
                </div>
            </SectionCard>

            {/* Investment Thesis */}
            {overallAssessment.investmentThesis && (
                <SectionCard 
                    title="Investment Thesis" 
                    icon={<DollarSign className="h-5 w-5" />}
                    variant="success"
                >
                    <p className="text-muted-foreground leading-relaxed">
                        {overallAssessment.investmentThesis}
                    </p>
                </SectionCard>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Major Risks */}
                <SectionCard 
                    title="Major Risks" 
                    icon={<AlertTriangle className="h-5 w-5" />}
                    variant="warning"
                >
                    <ListSection 
                        items={overallAssessment.majorRisks} 
                        emptyMessage="No major risks identified"
                    />
                </SectionCard>

                {/* Mitigation Strategies */}
                <SectionCard 
                    title="Mitigation Strategies" 
                    icon={<Target className="h-5 w-5" />}
                >
                    <ListSection 
                        items={overallAssessment.mitigationStrategies}
                        emptyMessage="No specific strategies outlined"
                    />
                </SectionCard>
            </div>

            {/* Next Steps */}
            <SectionCard 
                title="Recommended Next Steps" 
                icon={<Target className="h-5 w-5" />}
                variant="info"
            >
                <ListSection 
                    items={overallAssessment.nextSteps}
                    emptyMessage="No specific next steps provided"
                />
            </SectionCard>

            {/* Competitive Position & Funding Readiness */}
            <div className="grid gap-6 md:grid-cols-2">
                {overallAssessment.competitivePosition && (
                    <SectionCard 
                        title="Competitive Position" 
                        icon={<Building className="h-5 w-5" />}
                    >
                        <p className="text-muted-foreground leading-relaxed">
                            {overallAssessment.competitivePosition}
                        </p>
                    </SectionCard>
                )}

                {overallAssessment.fundingReadiness && (
                    <SectionCard 
                        title="Funding Readiness" 
                        icon={<DollarSign className="h-5 w-5" />}
                        variant={overallAssessment.fundingReadiness >= 7 ? 'success' : 
                               overallAssessment.fundingReadiness >= 5 ? 'warning' : 'default'}
                    >
                        <div className="flex items-center gap-3">
                            <Badge 
                                variant={overallAssessment.fundingReadiness >= 7 ? 'default' : 'secondary'}
                                className="text-lg px-3 py-1"
                            >
                                {overallAssessment.fundingReadiness}/10
                            </Badge>
                            <span className="text-muted-foreground">
                                {overallAssessment.fundingReadiness >= 8 ? 'Highly Ready' :
                                 overallAssessment.fundingReadiness >= 6 ? 'Ready with Minor Improvements' :
                                 overallAssessment.fundingReadiness >= 4 ? 'Needs Significant Work' :
                                 'Not Ready for Funding'}
                            </span>
                        </div>
                    </SectionCard>
                )}
            </div>
        </div>
    );
};

const LegacySummary: FC<{ feedback: string }> = ({ feedback }) => {
    const formattedFeedback = useMemo(
        () => formatFeedback(feedback),
        [feedback]
    );

    return (
        <Card className="relative overflow-hidden border-primary/20">
            <div
                className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl"
                aria-hidden="true"
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Evaluation Summary</CardTitle>
                <CopyButton text={feedback} />
            </CardHeader>
            <CardContent>{formattedFeedback}</CardContent>
        </Card>
    );
};

export const StructuredEvaluationSummary: FC<StructuredEvaluationSummaryProps> = ({ data }) => {
    const { structured, overallFeedback } = data.evaluation;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Evaluation Summary</h2>
            {structured ? (
                <StructuredSummary structured={structured} />
            ) : (
                <LegacySummary feedback={overallFeedback || ""} />
            )}
        </div>
    );
};