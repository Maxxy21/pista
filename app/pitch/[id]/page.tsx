"use client"

import React from 'react'
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Loading } from "@/components/auth/loading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset } from "@/components/ui/sidebar"


import { PitchHeader } from "./components/pitch-header"
import { TranscriptSection } from "./components/transcript-section"
import { ScoreOverview } from "./components/score-overview"
import { EvaluationSummary } from "./components/evaluation-summary"
import { DetailedAnalysis } from "./components/detailed-analysis"
import { QuestionsSection } from "./components/questions-section"

const PitchDetails = () => {
    const { id } = useParams<{ id: string }>()
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    })

    if (!data) return <Loading />

    return (
        <SidebarInset className="h-screen bg-background">
            <PitchHeader data={data} />
            
            <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="container mx-auto py-6 space-y-10">
                    <div className="space-y-6">
                        <TranscriptSection data={data} />
                        <QuestionsSection data={data} />
                    </div>
                    <ScoreOverview data={data} />
                    <EvaluationSummary data={data} />
                    <DetailedAnalysis data={data} />
                </div>
            </ScrollArea>
        </SidebarInset>
    )
}


export default PitchDetails