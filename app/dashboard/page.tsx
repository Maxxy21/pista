"use client";
import React from 'react';
import {DashboardStats} from "./_components/stats";

import {PitchList} from "./_components/pitch-list";
import {SidebarInset, SidebarTrigger, useSidebar} from "@/components/ui/sidebar";
import {useOrganization} from "@clerk/nextjs";
import {ExpandTrigger} from "@/components/expand-trigger";

interface DashboardProps {
    searchParams: {
        search?: string;
        favorites?: string;
    };
}


const Dashboard = ({searchParams}: DashboardProps) => {
    const { organization } = useOrganization();
    const {  isMobile } = useSidebar();
    return (
        <SidebarInset className="h-screen overflow-auto">

            <div className="flex-1 space-y-4 p-4 pb-8">

                <div className="flex items-center gap-2">
                    {isMobile && <ExpandTrigger />}
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>

                <DashboardStats/>
                <PitchList
                    orgId={organization?.id as string}
                    query={searchParams}
                />
            </div>
        </SidebarInset>

    );
};

export default Dashboard;