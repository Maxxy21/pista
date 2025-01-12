"use client"

import React from 'react'
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Loading } from "@/components/auth/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Share2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import PitchDetailsHeader from "./_components/pitch-details-header"
import { EvaluationContent } from "./_components/evaluation-content"

export default function PitchDetails() {
    const { id } = useParams<{ id: string }>()
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    })

    if (!data) return <Loading />

    const mobileView = (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="border-b">
                <div className="flex items-center gap-2 p-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="font-semibold truncate">{data.title}</h1>
                </div>
            </div>

            <Tabs defaultValue="transcript" className="flex-1">
                <div className="border-b">
                    <div className="flex items-center justify-between px-4">
                        <TabsList className="h-12">
                            <TabsTrigger value="transcript">Transcript</TabsTrigger>
                            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                        </TabsList>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <TabsContent value="transcript" className="flex-1 p-0 m-0">
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <Badge>Startup Pitch</Badge>
                                <h2 className="text-xl font-semibold">{data.title}</h2>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {data.text}
                            </p>
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="evaluation" className="flex-1 p-0 m-0">
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        <div className="p-4">
                            <EvaluationContent data={data} />
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    )

    const desktopView = (
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
            <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col">
                    <div className="border-b">
                        <div className="px-6 py-3 flex items-center justify-between">
                            <div className="space-y-1">
                                <Badge>Startup Pitch</Badge>
                                <h2 className="font-semibold">Transcript</h2>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <h1 className="text-2xl font-bold">{data.title}</h1>
                                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {data.text}
                                </p>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <EvaluationContent data={data} />
                    </div>
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
    )

    return (
        <SidebarInset>
            <div className="h-screen flex flex-col bg-background">
                <div className="hidden md:block">
                    <PitchDetailsHeader title={data.title} />
                </div>
                <div className="md:hidden">{mobileView}</div>
                <div className="hidden md:block flex-1">{desktopView}</div>
            </div>
        </SidebarInset>
    )
}

