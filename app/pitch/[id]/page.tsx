"use client"

import React, {useState} from 'react'
import {useParams} from "next/navigation"
import {useQuery} from "convex/react"
import {Id} from "@/convex/_generated/dataModel"
import {api} from "@/convex/_generated/api"
import {Loading} from "@/components/auth/loading"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable"
import {SidebarInset, useSidebar} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Copy, Download, Share2, ChevronLeft, ChevronDown, ChevronUp} from 'lucide-react'
import Link from 'next/link'
import PitchDetailsHeader from "./_components/pitch-details-header"
import {EvaluationContent} from "./_components/evaluation-content"
import {Progress} from "@/components/ui/progress";
import {Collapsible, CollapsibleTrigger} from '@radix-ui/react-collapsible'
import {CollapsibleContent} from "@/components/ui/collapsible";
import {ExpandTrigger} from "@/components/expand-trigger";

const PitchDetails = () => {
    const {id} = useParams<{ id: string }>()
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    })
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const {isMobile} = useSidebar()
    if (!data) return <Loading/>

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
    );

    const MobileView = () => (
        <div className="h-[calc(100vh-4rem)]">
            <div className="border-b p-4">
                <div className="flex items-center gap-2">
                    {isMobile && <ExpandTrigger/>}
                    <h1 className="font-semibold truncate text-xl">{data.title} Evaluation</h1>
                </div>
            </div>

            <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="p-4 space-y-6">
                    <Collapsible>
                        <div className="flex items-center justify-between">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {isTranscriptOpen ? (
                                        <ChevronUp className="h-4 w-4 mr-2"/>
                                    ) : (
                                        <ChevronDown className="h-4 w-4 mr-2"/>
                                    )}
                                    Transcript
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="mt-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {data.text}
                                    </p>
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>

                    <ScoreOverview/>

                    <Card>
                        <CardHeader>
                            <CardTitle>Evaluation Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {data.evaluation.overallFeedback}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.evaluation.evaluations.map((evaluation) => (
                                <div key={evaluation.criteria} className="space-y-4 pb-4 border-b last:border-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">{evaluation.criteria}</h3>
                                        <Badge variant="secondary">{evaluation.score.toFixed(1)}/10</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{evaluation.comment}</p>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Strengths</h4>
                                            <ul className="space-y-1">
                                                {evaluation.strengths.map((strength, idx) => (
                                                    <li key={idx}
                                                        className="text-sm text-muted-foreground">• {strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Areas for Improvement</h4>
                                            <ul className="space-y-1">
                                                {evaluation.improvements.map((improvement, idx) => (
                                                    <li key={idx}
                                                        className="text-sm text-muted-foreground">• {improvement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );

    const DesktopView = () => (
        <div className="h-[calc(100vh-4rem)]">
            <div className="border-b px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="font-semibold truncate text-xl">{data.title} Evaluation</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-2"/>
                            Copy
                        </Button>
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2"/>
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="p-6 container mx-auto space-y-6">
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="mb-4">
                                {isTranscriptOpen ? (
                                    <ChevronUp className="h-4 w-4 mr-2"/>
                                ) : (
                                    <ChevronDown className="h-4 w-4 mr-2"/>
                                )}
                                Show Transcript
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <Card className="mb-6">
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {data.text}
                                    </p>
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>

                    <ScoreOverview/>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="md:col-span-2 lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Evaluation Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {data.evaluation.overallFeedback}
                                </p>
                            </CardContent>
                        </Card>

                        {data.evaluation.evaluations.map((evaluation) => (
                            <Card key={evaluation.criteria}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{evaluation.criteria}</CardTitle>
                                        <Badge variant="secondary">{evaluation.score.toFixed(1)}/10</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">{evaluation.comment}</p>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Key Strengths</h4>
                                            <ul className="space-y-1">
                                                {evaluation.strengths.map((strength, idx) => (
                                                    <li key={idx}
                                                        className="text-sm text-muted-foreground">• {strength}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Areas for Improvement</h4>
                                            <ul className="space-y-1">
                                                {evaluation.improvements.map((improvement, idx) => (
                                                    <li key={idx}
                                                        className="text-sm text-muted-foreground">• {improvement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="h-screen bg-background">
            <div className="md:hidden">
                <MobileView/>
            </div>
            <div className="hidden md:block h-full w-full">
                <DesktopView/>
            </div>
        </div>
    );
};

export default PitchDetails;