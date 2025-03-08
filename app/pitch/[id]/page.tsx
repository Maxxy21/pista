"use client"

import React, { useState } from 'react'
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Loading } from "@/components/auth/loading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Copy,
    ChevronDown,
    ChevronUp,
    Check,
    ChevronLeft,
    Share2,
    PencilLine,
    Download
} from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ExpandTrigger } from "@/components/expand-trigger"
import { toast } from "sonner"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRenameModal } from "@/store/use-rename-modal"

const ModernPitchDetails = () => {
    const { id } = useParams<{ id: string }>()
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    })
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
    const { isMobile } = useSidebar()
    const { onOpen } = useRenameModal()

    if (!data) return <Loading />

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success("Copied to clipboard")
        } catch (err) {
            toast.error("Failed to copy text")
        }
    }

    const CopyButton = ({ text, className }: { text: string, className?: string }) => {
        const [isCopied, setIsCopied] = useState(false)

        const handleCopy = async () => {
            await copyToClipboard(text)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }

        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className={`h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-black/70 ${className}`}
            >
                {isCopied ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
            </Button>
        )
    }

    // Function to determine score color
    const getScoreColor = (score: number) => {
        if (score >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        if (score >= 6) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        if (score >= 4) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    };

    const ScoreOverview = () => (
        <div className="grid gap-4 lg:grid-cols-2">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-full">
                    <CardContent className="p-6">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">Overall Score</h3>
                                <Badge className={cn("text-lg font-semibold px-3 py-1", getScoreColor(data.evaluation.overallScore))}>
                                    {data.evaluation.overallScore.toFixed(1)}
                                </Badge>
                            </div>
                            <Progress value={data.evaluation.overallScore * 10} className="my-6 h-2" />
                            <p className="text-muted-foreground mt-2">
                                {data.evaluation.overallScore >= 8 ?
                                    "Excellent pitch! Ready for investors." :
                                    data.evaluation.overallScore >= 6 ?
                                        "Good pitch with minor improvements needed." :
                                        data.evaluation.overallScore >= 4 ?
                                            "Average pitch requiring refinement." :
                                            "Needs significant improvements before presenting to investors."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Category Scores</h3>
                    <div className="space-y-4">
                        {data.evaluation.evaluations.map((evaluation) => (
                            <div key={evaluation.criteria} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{evaluation.criteria}</span>
                                    <Badge className={cn(getScoreColor(evaluation.score))}>
                                        {evaluation.score.toFixed(1)}
                                    </Badge>
                                </div>
                                <Progress value={evaluation.score * 10} className="h-1.5"/>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const TranscriptSection = () => (
        <Collapsible open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
            <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="mb-4 gap-2">
                    {isTranscriptOpen ? (
                        <ChevronUp className="h-4 w-4"/>
                    ) : (
                        <ChevronDown className="h-4 w-4"/>
                    )}
                    {isTranscriptOpen ? "Hide" : "Show"} Transcript
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-6 relative">
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {data.text}
                            </p>
                            <div className="absolute top-3 right-3">
                                <CopyButton text={data.text} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </CollapsibleContent>
        </Collapsible>
    )

    return (
        <SidebarInset className="h-screen bg-background">
            {/* Modern Header */}
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b">
                <div className="container mx-auto py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold truncate">{data.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                    Created {new Date(data._creationTime).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => onOpen(data._id, data.title)}
                            >
                                <PencilLine className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => copyToClipboard(data.evaluation.overallFeedback)}
                            >
                                <Share2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Share</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="container mx-auto py-6 space-y-10">
                    <TranscriptSection />

                    <ScoreOverview />

                    {/* Summary Card */}
                    <Card className="relative overflow-hidden border-primary/20">
                        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
                        <CardHeader>
                            <CardTitle>Evaluation Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <p className="text-muted-foreground leading-relaxed">
                                {data.evaluation.overallFeedback}
                            </p>
                            <div className="absolute top-0 right-0">
                                <CopyButton text={data.evaluation.overallFeedback} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Analysis Cards */}
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
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg">{evaluation.criteria}</CardTitle>
                                                <Badge className={cn(getScoreColor(evaluation.score))}>
                                                    {evaluation.score.toFixed(1)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-muted-foreground">{evaluation.comment}</p>

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

                                            <div className="absolute top-4 right-4">
                                                <CopyButton text={`${evaluation.criteria}\n\nScore: ${evaluation.score.toFixed(1)}/10\n\nComment: ${evaluation.comment}\n\nStrengths:\n${evaluation.strengths.map(s => `• ${s}`).join('\n')}\n\nAreas for Improvement:\n${evaluation.improvements.map(i => `• ${i}`).join('\n')}`} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </SidebarInset>
    )
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default ModernPitchDetails