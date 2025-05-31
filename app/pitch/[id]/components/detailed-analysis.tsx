import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "./copy-button";
import { cn, getScoreColor } from "./utils";
import React, { FC, ReactNode, useMemo } from "react";

interface Evaluation {
    criteria: string;
    score: number;
    comment: string;
    strengths: string[];
    improvements: string[];
}

interface DetailedAnalysisProps {
    data: {
        evaluation: {
            evaluations: Evaluation[];
        };
    };
}

// Extracted for readability and reusability
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
        <h4 className="font-medium text-sm">Strengths</h4>
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
        <h4 className="font-medium text-sm">Areas for Improvement</h4>
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

const getCopyText = (evaluation: Evaluation) =>
    [
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

export const DetailedAnalysis: FC<DetailedAnalysisProps> = ({ data }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
        <div className="grid gap-6 md:grid-cols-2">
            {data.evaluation.evaluations.map((evaluation) => (
                <motion.div
                    key={evaluation.criteria}
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
                                <CopyButton text={getCopyText(evaluation)} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    </div>
);