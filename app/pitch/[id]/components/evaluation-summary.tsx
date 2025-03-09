import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CopyButton } from './copy-button'
import React from 'react'

interface EvaluationSummaryProps {
    data: {
        evaluation: {
            overallFeedback: string
        }
    }
}

export const EvaluationSummary = ({ data }: EvaluationSummaryProps) => {
    // Format the feedback text by splitting on numbered points
    const formatFeedback = (text: string) => {
        // Split the text by numbered points pattern (e.g., "1. ", "2. ")
        const parts = text.split(/(\d+\.\s)/);
        const formattedParts: React.ReactNode[] = [];
        
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 1) { // This is a number prefix
                // Add spacing between points except for the first one
                if (i > 1) formattedParts.push(<div key={`space-${i}`} className="mt-4"></div>);
                
                // Add the numbered point with its content
                formattedParts.push(
                    <p key={i} className="text-muted-foreground leading-relaxed">
                        <span className="font-medium">{parts[i]}</span>
                        {parts[i+1]}
                    </p>
                );
                i++; // Skip the next part as we've already included it
            } else if (i === 0 && parts[i].trim()) {
                // Handle any text before the first numbered point
                formattedParts.push(
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                        {parts[i]}
                    </p>
                );
            }
        }
        
        return formattedParts;
    };

    return (
        <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Evaluation Summary</CardTitle>
                <CopyButton text={data.evaluation.overallFeedback} />
            </CardHeader>
            <CardContent>
                {formatFeedback(data.evaluation.overallFeedback)}
            </CardContent>
        </Card>
    );
} 