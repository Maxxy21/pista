'use client';

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarInset } from "@/components/ui/sidebar";
import { Loading } from "@/components/auth/loading";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { DashboardTabs } from "@/app/dashboard/components/dashboard-tabs";
import { useSearchParams } from "next/navigation";
import { useDashboardState } from "./hooks/use-dashboard-state";
import { usePrefetchPitches } from "@/hooks/use-prefetch-pitches";
import { SkeletonCard } from "@/components/ui/skeleton-card";


// Import simplified empty state components
import { EmptyOrg } from "@/app/dashboard/components/empty-org";
import { EmptySearch } from "@/app/dashboard/components/empty-search";
import { EmptyPitches } from "@/app/dashboard/components/empty-pitches";
import { EmptyFavorites } from "@/app/dashboard/components/empty-favorites";

// Lazy load heavy components
const DashboardStats = lazy(() => import("@/app/dashboard/components/stats").then(mod => ({ default: mod.DashboardStats })));
const PitchesGrid = lazy(() => import("@/app/dashboard/components/pitches-grid").then(mod => ({ default: mod.PitchesGrid })));
const VirtualizedPitchesGrid = lazy(() => import("@/app/dashboard/components/virtualized-pitches-grid").then(mod => ({ default: mod.VirtualizedPitchesGrid })));

// Skeleton loaders for lazy-loaded components
const StatsSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} variant="stat" />
    ))}
  </div>
);

const PitchesGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} variant="pitch" />
    ))}
  </div>
);

export default function Dashboard() {
    const { isLoaded } = useUser();
    const { organization } = useOrganization();
    const searchParamsObj = useSearchParams();
    const { 
      searchValue, setSearchValue, 
      viewMode, setViewMode, 
      scoreFilter, setScoreFilter, 
      sortBy, setSortBy, 
      handleSearch, handleTabChange, 
      getScoreRange 
    } = useDashboardState(searchParamsObj);
    
    // Prefetch frequently accessed data
    usePrefetchPitches();
    
    // Get search parameters
    const searchParam = searchParamsObj.get('search') || "";
    const viewParam = searchParamsObj.get('view') || "all";
    
    // Fetch pitches data with loading state tracking
    const [isLoading, setIsLoading] = useState(true);
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
    
    // Update loading state when data changes
    useEffect(() => {
        if (data !== undefined) {
            setIsLoading(false);
        }
    }, [data]);

    // Performance monitoring
    useEffect(() => {
        // Mark when dashboard content is loaded
        if (!isLoading && data !== undefined) {
            if (typeof window !== 'undefined' && 'performance' in window) {
                performance.mark('dashboard-content-loaded');
            }
        }
    }, [isLoading, data]);

    if (!isLoaded) {
        return <Loading />;
    }

    // Determine which empty state to show
    const renderEmptyState = () => {
        if (!organization) {
            return <EmptyOrg />;
        }
        
        if (searchParam && (!data || data.length === 0)) {
            return <EmptySearch />;
        }
        
        if (viewParam === "favorites" && (!data || data.length === 0)) {
            return <EmptyFavorites />;
        }
        
        if (!data || data.length === 0) {
            return <EmptyPitches orgId={organization.id} />;
        }
        
        return null;
    };

    // Determine whether to use virtualized grid for large datasets
    const useVirtualizedGrid = data && data.length > 20;

    return (
        <SidebarInset className="w-full">
            <div className="flex flex-col h-full w-full">
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
                    handleSearch={handleSearch}
                    organization={organization}
                />

                {/* Tab Navigation */}
                <DashboardTabs 
                    currentView={viewParam}
                    handleTabChange={handleTabChange}
                />

                {/* Stats Section */}
                <div className="w-full px-4 md:px-6 lg:px-8 py-6">
                    <Suspense fallback={<StatsSkeleton />}>
                        <DashboardStats />
                    </Suspense>
                </div>

                {/* Main Content */}
                <div className="w-full px-4 md:px-6 lg:px-8 pb-6 flex-1">
                    {renderEmptyState() || (
                        <Suspense fallback={<PitchesGridSkeleton />}>
                            {useVirtualizedGrid ? (
                                <VirtualizedPitchesGrid 
                                    data={data}
                                    viewMode={viewMode}
                                    searchQuery={searchParam}
                                    currentView={viewParam}
                                    organization={organization}
                                    isLoading={isLoading}
                                />
                            ) : (
                                <PitchesGrid 
                                    data={data}
                                    viewMode={viewMode}
                                    searchQuery={searchParam}
                                    currentView={viewParam}
                                    organization={organization}
                                    isLoading={isLoading}
                                />
                            )}
                        </Suspense>
                    )}
                </div>
            </div>
        </SidebarInset>
    );
}