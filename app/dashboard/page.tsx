'use client';

import React, { useEffect, useState } from 'react';
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarInset } from "@/components/ui/sidebar";
import { Loading } from "@/components/auth/loading";
import { EmptyOrg } from "./_components/empty-org";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardTabs } from "./_components/dashboard-tabs";
import { DashboardStats } from "./_components/stats";
import { PitchesGrid } from "./_components/pitches-grid";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const Dashboard = () => {
    const { user, isLoaded } = useUser();
    const { organization } = useOrganization();
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsObj = useSearchParams();
    const [isClient, setIsClient] = useState(false);
    
    // Get search parameters
    const searchParam = searchParamsObj.get('search') || "";
    const viewParam = searchParamsObj.get('view') || "all";
    
    // State for filters and search
    const [searchValue, setSearchValue] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [scoreFilter, setScoreFilter] = useState("all");
    const [sortBy, setSortBy] = useState<"newest" | "score" | "updated">("newest");
    
    // Set isClient to true once component mounts on client
    useEffect(() => {
        setIsClient(true);
        setSearchValue(searchParam);
    }, [searchParam]);
    
    // Update search value when URL parameter changes
    useEffect(() => {
        setSearchValue(searchParam);
    }, [searchParam]);
    
    // Handle tab changes
    const handleTabChange = (value: string) => {
        const current = new URLSearchParams(Array.from(searchParamsObj.entries()));
        
        if (value === "all") {
            current.delete("view");
        } else {
            current.set("view", value);
        }
        
        const search = current.toString();
        const query = search ? `?${search}` : "";
        
        router.push(`${pathname}${query}`);
    };
    
    // Get score range based on filter
    const getScoreRange = (filter: string) => {
        switch (filter) {
            case "high":
                return { min: 8, max: 10 };
            case "medium":
                return { min: 5, max: 7.9 };
            case "low":
                return { min: 0, max: 4.9 };
            default:
                return { min: 0, max: 10 };
        }
    };

    // Get score range based on filter
    const { min, max } = getScoreRange(scoreFilter);

    // Fetch pitches data
    const data = useQuery(
        api.pitches.getFilteredPitches,
        organization
            ? {
                orgId: organization.id,
                search: searchParam,
                favorites: viewParam === "favorites",
                sortBy: viewParam === "recent" ? "date" : sortBy === "newest" ? "date" : "score",
                scoreRange: getScoreRange(scoreFilter),
            }
            : "skip"
    );

    if (!isLoaded) {
        return <Loading />;
    }

    return (
        <SidebarInset className="w-full">
            <div className="flex flex-col h-full w-full">
                {isClient ? (
                    <>
                        {/* Dashboard Header */}
                        <DashboardHeader
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            scoreFilter={scoreFilter}
                            setScoreFilter={setScoreFilter}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            handleSearch={() => {}}
                            organization={organization}
                        />

                        {/* Tab Navigation */}
                        <DashboardTabs 
                            currentView={viewParam}
                            handleTabChange={handleTabChange}
                        />

                        {/* Stats Section */}
                        <div className="w-full px-4 md:px-6 lg:px-8 py-6">
                            <DashboardStats />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-h-0 w-full px-4 md:px-6 lg:px-8 py-6">
                            {!organization ? (
                                <EmptyOrg />
                            ) : (
                                <div className="w-full">
                                    <PitchesGrid 
                                        data={data}
                                        viewMode={viewMode}
                                        searchQuery={searchParam}
                                        currentView={viewParam}
                                        organization={organization}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Loading />
                    </div>
                )}
            </div>
        </SidebarInset>
    );
};

export default Dashboard;