"use client";

import React, { Suspense, lazy, useEffect, useMemo, useRef } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Loading } from "@/components/shared/auth/loading";
import { DashboardTabs } from "./dashboard-tabs";
import { PitchFilters } from "./pitch-filters";
import { NewPitchPanel } from "./new-pitch-panel";
import { useDashboardState } from "../_hooks/use-dashboard-state";
import { usePrefetchPitches } from "@/hooks/use-prefetch-pitches";
import { ErrorBoundary } from "./error-boundary";
import { PitchesGridSkeleton, StatsSkeleton } from "./dashboard-skeletons";
import { useDashboardQuery } from "../_hooks/use-dashboard-query";
import { getEmptyState } from "./empty-states/empty-helper";
import { useSearchParams } from "next/navigation";
import { useVirtualizedThreshold } from "@/hooks/use-virtualized-threshold";
import { ScrollArea } from "@/components/ui/scroll-area";

const DashboardStats = lazy(() => import("./stats").then(mod => ({ default: mod.DashboardStats })));
const PitchesGrid = lazy(() => import("./grids/pitches-grid").then(mod => ({ default: mod.PitchesGrid })));
const VirtualizedPitchesGrid = lazy(() => import("./grids/virtualized-pitches-grid").then(mod => ({ default: mod.VirtualizedPitchesGrid })));

export function DashboardContent() {
  const { isLoaded } = useUser();
  const { organization } = useOrganization();
  const searchParams = useSearchParams();

  const {
    searchValue, setSearchValue,
    viewMode, setViewMode,
    scoreFilter, setScoreFilter,
    sortBy, setSortBy,
    handleSearch, handleTabChange,
    getScoreRange,
  } = useDashboardState(searchParams);

  usePrefetchPitches();
  const { data, isLoading, searchParam, viewParam } = useDashboardQuery({ sortBy, scoreFilter, getScoreRange });
  const { shouldVirtualize } = useVirtualizedThreshold(20);
  const useVirtualizedGrid = useMemo(() => shouldVirtualize(data?.length), [data, shouldVirtualize]);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && data !== undefined && typeof window !== "undefined" && "performance" in window) {
      try { performance.mark("dashboard-content-loaded"); } catch {}
    }
  }, [isLoading, data]);

  if (!isLoaded) return <Loading />;

  return (
    <div className="min-h-0 flex-1 bg-background flex flex-col overflow-hidden">
      <DashboardTabs currentView={viewParam} handleTabChange={handleTabChange} />
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" viewportRef={viewportRef}>
          <div className="p-4 md:p-6 pb-0">
            <ErrorBoundary fallback={<StatsSkeleton />}>
              <Suspense fallback={<StatsSkeleton />}>
                <DashboardStats />
              </Suspense>
            </ErrorBoundary>
          </div>

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

          <div className="p-4 md:p-6 pt-0">
            {viewParam === "new" ? (
              <NewPitchPanel />
            ) : ((() => {
              const empty = getEmptyState({ data, searchParam, viewParam, organizationId: organization?.id });
              if (empty) return empty;
              return (
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
                        scrollRef={viewportRef}
                      />
                    ) : (
                      <PitchesGrid
                        data={data}
                        viewMode={viewMode}
                        searchQuery={searchParam}
                        currentView={viewParam}
                        organization={organization}
                        isLoading={isLoading}
                        useOuterScroll
                      />
                    )}
                  </Suspense>
                </ErrorBoundary>
              );
            })())}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
