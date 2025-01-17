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
import { Copy, Share2, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ExpandTrigger } from "@/components/expand-trigger"
import { toast } from "sonner"

const PitchDetails = () => {
    const { id } = useParams<{ id: string }>()
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    })
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
    const { isMobile } = useSidebar()

    if (!data) return <Loading />

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success("Copied to clipboard")
        } catch (err) {
            toast.error("Failed to copy text")
        }
    }

    const CopyButton = ({ text }: { text: string }) => {
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
                className="h-6 w-6 absolute top-2 right-2"
            >
                {isCopied ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <Copy className="h-4 w-4" />
                )}
            </Button>
        )
    }

    const ScoreOverview = () => (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{data.evaluation.overallScore.toFixed(1)}</span>
                        <span className="text-muted-foreground">/10</span>
                    </div>
                    <Progress value={data.evaluation.overallScore * 10} className="mt-2"/>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        {data.evaluation.evaluations.map((evaluation) => (
                            <div key={evaluation.criteria} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>{evaluation.criteria}</span>
                                    <span>{evaluation.score.toFixed(1)}/10</span>
                                </div>
                                <Progress value={evaluation.score * 10}/>
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
                <Button variant="ghost" size="sm" className="mb-4">
                    {isTranscriptOpen ? (
                        <ChevronUp className="h-4 w-4 mr-2"/>
                    ) : (
                        <ChevronDown className="h-4 w-4 mr-2"/>
                    )}
                    {isTranscriptOpen ? "Hide" : "Show"} Transcript
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Card className="mb-6 relative">
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {data.text}
                        </p>
                        <CopyButton text={data.text} />
                    </CardContent>
                </Card>
            </CollapsibleContent>
        </Collapsible>
    )

    const MobileView = () => (
        <div className="h-[calc(100vh-4rem)]">
            <div className="border-b p-4">
                <div className="flex items-center gap-2">
                    {isMobile && <ExpandTrigger />}
                    <h1 className="font-semibold truncate text-xl">{data.title} Evaluation</h1>
                </div>
            </div>

            <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="p-4 space-y-6">
                    <TranscriptSection />
                    <ScoreOverview />

                    <Card className="relative">
                        <CardHeader>
                            <CardTitle>Evaluation Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {data.evaluation.overallFeedback}
                            </p>
                            <CopyButton text={data.evaluation.overallFeedback} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.evaluation.evaluations.map((evaluation) => (
                                <div key={evaluation.criteria} className="space-y-4 pb-4 border-b last:border-0 relative">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">{evaluation.criteria}</h3>
                                        <Badge variant="secondary" className="mr-5">{evaluation.score.toFixed(1)}/10</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{evaluation.comment}</p>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Strengths</h4>
                                            <ul className="space-y-1">
                                                {evaluation.strengths.map((strength, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground">• {strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Areas for Improvement</h4>
                                            <ul className="space-y-1">
                                                {evaluation.improvements.map((improvement, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground">• {improvement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <CopyButton text={`${evaluation.criteria}\n\nComment: ${evaluation.comment}\n\nStrengths:\n${evaluation.strengths.map(s => `• ${s}`).join('\n')}\n\nAreas for Improvement:\n${evaluation.improvements.map(i => `• ${i}`).join('\n')}`} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    )

    const DesktopView = () => (
        <div className="h-[calc(100vh-4rem)]">
            <div className="border-b px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="font-semibold truncate text-xl">{data.title} Evaluation</h1>
                    </div>
                    {/*<div className="flex gap-2">*/}
                    {/*    <Button variant="outline" size="sm">*/}
                    {/*        <Copy className="h-4 w-4 mr-2"/>*/}
                    {/*        Copy*/}
                    {/*    </Button>*/}
                    {/*    <Button variant="outline" size="sm">*/}
                    {/*        <Share2 className="h-4 w-4 mr-2"/>*/}
                    {/*        Share*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </div>
            </div>

            <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="p-6 container mx-auto space-y-6">
                    <TranscriptSection />
                    <ScoreOverview />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="md:col-span-2 lg:col-span-3 relative">
                            <CardHeader>
                                <CardTitle>Evaluation Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {data.evaluation.overallFeedback}
                                </p>
                                <CopyButton text={data.evaluation.overallFeedback} />
                            </CardContent>
                        </Card>

                        {data.evaluation.evaluations.map((evaluation) => (
                            <Card key={evaluation.criteria} className="relative">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{evaluation.criteria}</CardTitle>
                                        <Badge variant="secondary" className="mr-4">{evaluation.score.toFixed(1)}/10</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">{evaluation.comment}</p>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Key Strengths</h4>
                                            <ul className="space-y-1">
                                                {evaluation.strengths.map((strength, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground">• {strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Areas for Improvement</h4>
                                            <ul className="space-y-1">
                                                {evaluation.improvements.map((improvement, idx) => (
                                                    <li key={idx} className="text-sm text-muted-foreground">• {improvement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <CopyButton text={`${evaluation.criteria}\n\nComment: ${evaluation.comment}\n\nKey Strengths:\n${evaluation.strengths.map(s => `• ${s}`).join('\n')}\n\nAreas for Improvement:\n${evaluation.improvements.map(i => `• ${i}`).join('\n')}`}  />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )

    return (
        <SidebarInset className="h-screen bg-background">
            <div className="md:hidden">
                <MobileView />
            </div>
            <div className="hidden md:block h-full w-full">
                <DesktopView />
            </div>
        </SidebarInset>
    )
}

export default PitchDetails

