import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CopyButton } from "../export/copy-button";
import { UniversalPitchData } from "@/lib/types/pitch";
import { getOverallFeedback } from "@/lib/utils/evaluation-utils";
import React, { FC, ReactNode, useMemo } from "react";

interface EvaluationSummaryProps {
    data: UniversalPitchData;
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
            i++; // Skip the next part as we've already included it
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

export const EvaluationSummary: FC<EvaluationSummaryProps> = ({ data }) => {
    const feedback = getOverallFeedback(data.evaluation);
    const overallFeedback = typeof feedback === 'string' ? feedback : feedback.overallAssessment.summary;

    const formattedFeedback = useMemo(
        () => formatFeedback(overallFeedback),
        [overallFeedback]
    );

    return (
        <div>
            <h2 className="font-display text-xl font-semibold mb-4">Evaluation Summary</h2>
            <Card>
                <CardHeader className="flex flex-row items-center justify-end pb-2">
                    <CopyButton text={overallFeedback} />
                </CardHeader>
                <CardContent>{formattedFeedback}</CardContent>
            </Card>
        </div>
    );
};