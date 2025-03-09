import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from './copy-button'
import { cn, getScoreColor } from './utils'
import React from 'react'

interface DetailedAnalysisProps {
    data: {
        evaluation: {
            evaluations: Array<{
                criteria: string
                score: number
                comment: string
                strengths: string[]
                improvements: string[]
            }>
        }
    }
}

export const DetailedAnalysis = ({ data }: DetailedAnalysisProps) => {
    // Format the comment text by splitting on numbered points
    const formatComment = (text: string) => {
        // Check if the text contains numbered points pattern
        if (text.match(/\d+\.\s/)) {
            // Split the text by numbered points pattern (e.g., "1. ", "2. ")
            const parts = text.split(/(\d+\.\s)/);
            const formattedParts: React.ReactNode[] = [];
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 1) { // This is a number prefix
                    // Add spacing between points except for the first one
                    if (i > 1) formattedParts.push(<div key={`space-${i}`} className="mt-2"></div>);
                    
                    // Add the numbered point with its content
                    formattedParts.push(
                        <p key={i} className="text-sm text-muted-foreground">
                            <span className="font-medium">{parts[i]}</span>
                            {parts[i+1]}
                        </p>
                    );
                    i++; // Skip the next part as we've already included it
                } else if (i === 0 && parts[i].trim()) {
                    // Handle any text before the first numbered point
                    formattedParts.push(
                        <p key={i} className="text-sm text-muted-foreground mb-2">
                            {parts[i]}
                        </p>
                    );
                }
            }
            
            return formattedParts;
        } else {
            // If no numbered points, return the text as a single paragraph
            return <p className="text-sm text-muted-foreground">{text}</p>;
        }
    };

    return (
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
                                <div className="space-y-2">
                                    {formatComment(evaluation.comment)}
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Strengths</h4>
                                        <ul className="space-y-1 text-sm">
                                            {evaluation.strengths.map((strength, idx) => (
                                                <li key={idx} className="flex gap-2 text-muted-foreground">
                                                    <span className="text-green-500 flex-shrink-0">✓</span>
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Areas for Improvement</h4>
                                        <ul className="space-y-1 text-sm">
                                            {evaluation.improvements.map((improvement, idx) => (
                                                <li key={idx} className="flex gap-2 text-muted-foreground">
                                                    <span className="text-amber-500 flex-shrink-0">→</span>
                                                    <span>{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="absolute top-2 right-4">
                                    <CopyButton
                                        text={`${evaluation.criteria}\n\nScore: ${evaluation.score.toFixed(1)}/10\n\nComment: ${evaluation.comment}\n\nStrengths:\n${evaluation.strengths.map(s => `• ${s}`).join('\n')}\n\nAreas for Improvement:\n${evaluation.improvements.map(i => `• ${i}`).join('\n')}`} 
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
} 