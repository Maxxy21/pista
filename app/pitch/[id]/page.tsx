"use client"
import React from 'react';
import {useParams} from "next/navigation";
import {useQuery} from "convex/react";
import {Id} from "@/convex/_generated/dataModel";
import {api} from "@/convex/_generated/api";
import {Loading} from "@/components/auth/loading";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {EvaluationContent} from "@/app/pitch/[id]/_components/evaluation-content";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {SidebarInset} from "@/components/ui/sidebar";
import PitchDetailsHeader from "@/app/pitch/[id]/_components/pitch-details-header";
import {Separator} from "@/components/ui/separator";


const PitchDetails = () => {
    const {id} = useParams<{ id: string }>();
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    });

    if (!data) return <Loading/>

    const mobileView = (
        <Tabs defaultValue="transcript" className="w-full h-screen flex flex-col">
            <TabsList className="w-full">
                <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                <TabsTrigger value="evaluation" className="flex-1">Evaluation</TabsTrigger>
            </TabsList>

            <TabsContent value="transcript" className="flex-1 overflow-hidden">
                    <p className="whitespace-pre-wrap">{data.text}</p>
            </TabsContent>

            <TabsContent value="evaluation" className="flex-1 overflow-hidden">
                    <EvaluationContent data={data}/>
            </TabsContent>
        </Tabs>
    );

    const desktopView = (
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-100px)]">
            <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4">
                    <h2 className="font-semibold mb-2">Transcript</h2>
                        <p className="whitespace-pre-wrap">{data.text}</p>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4">
                        <EvaluationContent data={data}/>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );

    return (
        <SidebarInset>
            <div className="h-screen flex flex-col">
                <PitchDetailsHeader title={data.title}/>
                <Separator orientation="horizontal"/>
                <ScrollArea className="flex-1 px-4">
                    <div className="md:hidden h-full">{mobileView}</div>
                    <div className="hidden md:block h-full">{desktopView}</div>
                </ScrollArea>
            </div>
        </SidebarInset>
    );
};

export default PitchDetails;