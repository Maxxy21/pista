"use client"

import React, { Suspense, lazy } from 'react'
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Loading } from "@/components/auth/loading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset } from "@/components/ui/sidebar"
import { SkeletonCard } from "@/components/ui/skeleton-card"

// Import the header component normally as it's needed immediately
import { PitchHeader } from "./components/pitch-header"

// Lazy load other components
const TranscriptSection = lazy(() => import("./components/transcript-section").then(mod => ({ default: mod.TranscriptSection })))
const ScoreOverview = lazy(() => import("./components/score-overview").then(mod => ({ default: mod.ScoreOverview })))
const EvaluationSummary = lazy(() => import("./components/evaluation-summary").then(mod => ({ default: mod.EvaluationSummary })))
const DetailedAnalysis = lazy(() => import("./components/detailed-analysis").then(mod => ({ default: mod.DetailedAnalysis })))
const QuestionsSection = lazy(() => import("./components/questions-section").then(mod => ({ default: mod.QuestionsSection })))

// Skeleton components for lazy-loaded sections
const TranscriptSkeleton = () => <SkeletonCard className="h-[200px] mb-6" />
const QuestionsSkeleton = () => <SkeletonCard className="h-[300px] mb-10" />
const ScoreOverviewSkeleton = () => <SkeletonCard className="h-[250px] mb-10" />
const EvaluationSummarySkeleton = () => <SkeletonCard className="h-[200px] mb-10" />
const DetailedAnalysisSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} className="h-[200px]" />
    ))}
  </div>
)

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
                        <Suspense fallback={<TranscriptSkeleton />}>
                            <TranscriptSection data={data} />
                        </Suspense>
                        <Suspense fallback={<QuestionsSkeleton />}>
                            <QuestionsSection data={data} />
                        </Suspense>
                    </div>
                    <Suspense fallback={<ScoreOverviewSkeleton />}>
                        <ScoreOverview data={data} />
                    </Suspense>
                    <Suspense fallback={<EvaluationSummarySkeleton />}>
                        <EvaluationSummary data={data} />
                    </Suspense>
                    <Suspense fallback={<DetailedAnalysisSkeleton />}>
                        <DetailedAnalysis data={data} />
                    </Suspense>
                </div>
            </ScrollArea>
        </SidebarInset>
    )
}

export default PitchDetails