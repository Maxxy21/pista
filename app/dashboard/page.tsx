"use client";
import React from 'react';
import { DashboardStats } from "./_components/stats";
import { PitchList } from "./_components/pitch-list";
import { SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useOrganization } from "@clerk/nextjs";
import { ExpandTrigger } from "@/components/expand-trigger";

interface DashboardProps {
    searchParams: {
        search?: string;
        favorites?: string;
    };
}

const Dashboard = ({ searchParams }: DashboardProps) => {
    const { organization } = useOrganization();
    const { isMobile } = useSidebar();
    
    return (
        <SidebarInset>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 p-4">
                    {isMobile && <ExpandTrigger />}
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>

                <div className="flex-none px-4">
                    <DashboardStats />
                </div>

                <div className="flex-1 min-h-0">
                    <PitchList
                        orgId={organization?.id as string}
                        query={searchParams}
                    />
                </div>
            </div>
        </SidebarInset>
    );
};

export default Dashboard;