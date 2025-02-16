'use client';

import React from 'react';
import {use} from 'react';
import {DashboardStats} from "./_components/stats";
import {PitchList} from "./_components/pitch-list";
import {SidebarInset, useSidebar} from "@/components/ui/sidebar";
import {useOrganization, useUser} from "@clerk/nextjs";
import {ExpandTrigger} from "@/components/expand-trigger";
import {EmptyOrg} from "@/app/dashboard/_components/empty-org";
import {Loading} from "@/components/auth/loading";

type SearchParams = Promise<{
    search?: string | string[] | undefined;
    view?: string | string[] | undefined;
}>;

interface PageProps {
    params: Promise<Record<string, string>>;
    searchParams: SearchParams;
}

const Dashboard = (props: PageProps) => {
    const {user, isLoaded} = useUser();
    const {organization} = useOrganization();
    const {isMobile} = useSidebar();
    const searchParams = use(props.searchParams);

    // Show loading state until auth is loaded
    if (!isLoaded) {
        return <Loading/>;
    }

    // Don't render anything if not authenticated
    if (!user) {
        return null;
    }

    const query = {
        search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
        view: typeof searchParams.view === 'string' ? searchParams.view : undefined
    };

    return (
        <SidebarInset>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 p-4">
                    {isMobile && <ExpandTrigger/>}
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>

                <div className="flex-none px-4">
                    <DashboardStats/>
                </div>

                <div className="flex-1 min-h-0">
                    {!organization ? (
                        <EmptyOrg/>
                    ) : (
                        <PitchList
                            orgId={organization?.id as string}
                            query={query}
                        />
                    )}
                </div>
            </div>
        </SidebarInset>
    );
};

export default Dashboard;