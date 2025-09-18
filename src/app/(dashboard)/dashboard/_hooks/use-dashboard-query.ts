"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspace";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UseDashboardQueryArgs<TFilter> {
  sortBy: string;
  scoreFilter: TFilter;
  getScoreRange: (f: TFilter) => any;
}

export function useDashboardQuery<TFilter>({ sortBy, scoreFilter, getScoreRange }: UseDashboardQueryArgs<TFilter>) {
  const workspace = useWorkspace();
  const searchParams = useSearchParams();

  const searchParam = searchParams.get("search") || "";
  const viewParam = searchParams.get("view") || "all";

  const queryParams = useMemo(() => {
    const base: any = {
      search: searchParam,
      favorites: viewParam === "favorites",
      sortBy: (viewParam === "recent" ? "date" : sortBy === "newest" ? "date" : "score") as "score" | "date",
      scoreRange: getScoreRange(scoreFilter),
    };
    if (workspace.mode === "org" && workspace.orgId) return { ...base, orgId: workspace.orgId };
    if (workspace.userId) return { ...base, ownerUserId: workspace.userId };
    return "skip" as const;
  }, [workspace.mode, workspace.orgId, workspace.userId, searchParam, viewParam, sortBy, scoreFilter, getScoreRange]);

  const data = useQuery(api.pitches.getFilteredPitches, queryParams);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setIsLoading(data === undefined), [data]);

  return { data, isLoading, searchParam, viewParam } as const;
}

