"use client";

import React from 'react';
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ModeToggle from "@/components/mode-toggle";
import qs from "query-string";

interface PitchDetailsHeaderProps {
    title: string;
}

const PitchDetailsHeader = ( {title}: PitchDetailsHeaderProps    ) => {

    return (
        <header
            className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <h1 className="text-2xl font-semibold">Pitch Perfect</h1>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <h2 >{title}</h2>
            </div>
            <div className="px-4">
                <ModeToggle/>
            </div>
        </header>
    );
};

export default PitchDetailsHeader;