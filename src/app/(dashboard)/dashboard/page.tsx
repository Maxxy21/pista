'use client';

import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from 'react';
import { useOrganization, useUser } from "@clerk/nextjs";
import { useWorkspace } from "@/hooks/use-workspace";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loading } from "@/components/shared/auth/loading";
import { DashboardTabs } from "./_components/dashboard-tabs";
import { PitchFilters } from "./_components/pitch-filters";
import { NewPitchPanel } from "./_components/new-pitch-panel";
import { useSearchParams } from "next/navigation";
import { useDashboardState } from "./_hooks/use-dashboard-state";
import { usePrefetchPitches } from "@/hooks/use-prefetch-pitches";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { Separator } from "@/components/ui/separator";

// Empty state components
import { EmptySearch } from "./_components/empty-states/empty-search";
import { EmptyPitches } from "./_components/empty-states/empty-pitches";
import { EmptyFavorites } from "./_components/empty-states/empty-favorites";

// Lazy load heavy components
const DashboardStats = lazy(() =>
    import("./_components/stats").then(mod => ({ default: mod.DashboardStats }))
);
const PitchesGrid = lazy(() =>
    import("./_components/grids/pitches-grid").then(mod => ({ default: mod.PitchesGrid }))
);
const VirtualizedPitchesGrid = lazy(() =>
    import("./_components/grids/virtualized-pitches-grid").then(mod => ({ default: mod.VirtualizedPitchesGrid }))
);

import { ErrorBoundary } from "./_components/error-boundary";

// Skeleton loaders
const StatsSkeleton = () => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
    const workspace = useWorkspace();
    const searchParamsObj = useSearchParams();

    const {
        searchValue, setSearchValue,
        viewMode, setViewMode,
        scoreFilter, setScoreFilter,
        sortBy, setSortBy,
        handleSearch, handleTabChange,
        getScoreRange
    } = useDashboardState(searchParamsObj);

    usePrefetchPitches();

    const searchParam = searchParamsObj.get('search') || "";
    const viewParam = searchParamsObj.get('view') || "all";

    // Memoize query params to avoid unnecessary re-renders
    const queryParams = useMemo(() => {
        const base = {
            search: searchParam,
            favorites: viewParam === "favorites",
            sortBy: (viewParam === "recent" ? "date" : sortBy === "newest" ? "date" : "score") as "score" | "date",
            scoreRange: getScoreRange(scoreFilter),
        } as any
        if (workspace.mode === 'org' && workspace.orgId) return { ...base, orgId: workspace.orgId }
        if (workspace.userId) return { ...base, ownerUserId: workspace.userId }
        return "skip"
    }, [workspace.mode, workspace.orgId, workspace.userId, searchParam, viewParam, sortBy, scoreFilter, getScoreRange]);

    const data = useQuery(api.pitches.getFilteredPitches, queryParams);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(data === undefined);
    }, [data]);

    useEffect(() => {
        if (!isLoading && data !== undefined && typeof window !== 'undefined' && 'performance' in window) {
            try {
                performance.mark('dashboard-content-loaded');
            } catch {
                // no-op
            }
        }
    }, [isLoading, data]);

    // Empty state rendering
    const renderEmptyState = useCallback(() => {
                if (searchParam && (!data || data.length === 0)) return <EmptySearch />;
        if (viewParam === "favorites" && (!data || data.length === 0)) return <EmptyFavorites />;
        if (!data || data.length === 0) return <EmptyPitches orgId={organization?.id} />;
        return null;
    }, [organization, searchParam, data, viewParam]);

    const useVirtualizedGrid = useMemo(() => data && data.length > 20, [data]);

    if (!isLoaded) return <Loading />;

    return (
        <div className="flex flex-col flex-1">
            <DashboardTabs
                currentView={viewParam}
                handleTabChange={handleTabChange}
            />

            <div className="flex-1 flex flex-col">
                <div className="p-4 md:p-6 pb-0">
                    <ErrorBoundary fallback={<StatsSkeleton />}>
                        <Suspense fallback={<StatsSkeleton />}>
                            <DashboardStats />
                        </Suspense>
                    </ErrorBoundary>
                </div>

                {/* Filters below stats */}
                <PitchFilters
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    scoreFilter={scoreFilter}
                    setScoreFilter={setScoreFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    handleSearch={handleSearch}
                    resultsCount={Array.isArray(data) ? data.length : undefined}
                />

                <div className="flex-1 p-4 md:p-6 pt-0">
                    {viewParam === 'new' ? (
                        <NewPitchPanel />
                    ) : (renderEmptyState() || (
                        <ErrorBoundary fallback={<PitchesGridSkeleton />}>
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
                        </ErrorBoundary>
                    )}
                </div>
            </div>
        </div>
    );
}
