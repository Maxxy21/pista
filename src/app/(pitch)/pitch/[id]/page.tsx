"use client"

import React, { Suspense, lazy } from 'react'
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Loading } from "@/components/shared/auth/loading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset } from "@/components/ui/sidebar"
import { SkeletonCard } from "@/components/ui/skeleton-card"

// Import the header component normally as it's needed immediately
import { PitchHeader } from "./_components/sections/pitch-header"
import { isStructuredEvaluationData } from "@/lib/types/evaluation"

// Lazy load other components
const TranscriptSection = lazy(() => import("./_components/sections/transcript-section").then(mod => ({ default: mod.TranscriptSection })))
const ScoreOverview = lazy(() => import("./_components/sections/score-overview").then(mod => ({ default: mod.ScoreOverview })))
const EvaluationSummary = lazy(() => import("./_components/analysis/evaluation-summary").then(mod => ({ default: mod.EvaluationSummary })))
const DetailedAnalysis = lazy(() => import("./_components/analysis/detailed-analysis").then(mod => ({ default: mod.DetailedAnalysis })))
const QuestionsSection = lazy(() => import("./_components/sections/questions-section").then(mod => ({ default: mod.QuestionsSection })))

// New structured components
const StructuredEvaluationSummary = lazy(() => import("./_components/analysis/structured-evaluation-summary").then(mod => ({ default: mod.StructuredEvaluationSummary })))
const StructuredDetailedAnalysis = lazy(() => import("./_components/analysis/structured-detailed-analysis").then(mod => ({ default: mod.StructuredDetailedAnalysis })))

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

    // Determine if we should use structured or legacy components
    const useStructuredComponents = isStructuredEvaluationData(data.evaluation)

    return (
        <SidebarInset className="h-screen bg-background">
            <PitchHeader data={data} />
            
            <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 space-y-8 sm:space-y-10">
                    <div className="space-y-6">
                        <Suspense fallback={<TranscriptSkeleton />}>
                            <TranscriptSection data={data} />
                        </Suspense>
                        {/* Q&A section commented out for testing with external pitches */}
                        {/* <Suspense fallback={<QuestionsSkeleton />}>
                            <QuestionsSection data={data} />
                        </Suspense> */}
                    </div>
                    <Suspense fallback={<ScoreOverviewSkeleton />}>
                        <ScoreOverview data={data} />
                    </Suspense>
                    
                    {useStructuredComponents ? (
                        <>
                            <Suspense fallback={<EvaluationSummarySkeleton />}>
                                <StructuredEvaluationSummary data={data} />
                            </Suspense>
                            <Suspense fallback={<DetailedAnalysisSkeleton />}>
                                <StructuredDetailedAnalysis data={data} />
                            </Suspense>
                        </>
                    ) : (
                        <>
                            <Suspense fallback={<EvaluationSummarySkeleton />}>
                                <EvaluationSummary data={data} />
                            </Suspense>
                            <Suspense fallback={<DetailedAnalysisSkeleton />}>
                                <DetailedAnalysis data={data} />
                            </Suspense>
                        </>
                    )}
                </div>
            </ScrollArea>
        </SidebarInset>
    )
}

export default PitchDetails