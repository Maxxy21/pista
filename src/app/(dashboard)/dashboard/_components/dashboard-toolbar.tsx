"use client";

import React, { useMemo, useState } from "react";
import { Filter, ArrowDownUp, List, GridIcon } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { NewPitchButton } from "./new-pitch-button";

const TABS = [
    { value: "all", label: "All pitches" },
    { value: "recent", label: "Recent" },
    { value: "favorites", label: "Favorites" },
];

const SCORE_LABELS: Record<string, string> = {
    all: "All scores",
    high: "High (8-10)",
    medium: "Medium (5-7.9)",
    low: "Low (0-4.9)",
};

const SORT_LABELS: Record<string, string> = {
    newest: "Newest",
    score: "Highest score",
    updated: "Recently updated",
};

interface DashboardToolbarProps {
    currentView: string;
    handleTabChange: (value: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    scoreFilter: string;
    setScoreFilter: (filter: string) => void;
    sortBy: "newest" | "score" | "updated";
    setSortBy: (sort: "newest" | "score" | "updated") => void;
}

export function DashboardToolbar({
    currentView,
    handleTabChange,
    viewMode,
    setViewMode,
    scoreFilter,
    setScoreFilter,
    sortBy,
    setSortBy,
}: DashboardToolbarProps) {
    const { organization } = useOrganization();
    const isMobile = useIsMobile();
    const [filtersOpen, setFiltersOpen] = useState(false);

    const activeTab = TABS.some((t) => t.value === currentView) ? currentView : "all";
    const scoreLabel = useMemo(() => SCORE_LABELS[scoreFilter] ?? SCORE_LABELS.all, [scoreFilter]);
    const sortLabel = useMemo(() => SORT_LABELS[sortBy], [sortBy]);

    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 md:px-6">
            <div className="flex items-center gap-5">
                {TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={cn(
                            "border-b-2 border-transparent pb-1 text-sm transition-colors",
                            activeTab === tab.value
                                ? "border-gold font-semibold text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden h-9 gap-2 sm:inline-flex">
                            <Filter className="h-4 w-4" />
                            <span>{scoreLabel}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-48">
                        {Object.entries(SCORE_LABELS).map(([key, label]) => (
                            <DropdownMenuItem key={key} onClick={() => setScoreFilter(key)}>
                                {label}
                                {scoreFilter === key && <span className="ml-auto h-2 w-2 rounded-full bg-gold" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden h-9 gap-2 sm:inline-flex">
                            <ArrowDownUp className="h-4 w-4" />
                            <span>{sortLabel}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-48">
                        {Object.entries(SORT_LABELS).map(([key, label]) => (
                            <DropdownMenuItem key={key} onClick={() => setSortBy(key as DashboardToolbarProps["sortBy"])}>
                                {label}
                                {sortBy === key && <span className="ml-auto h-2 w-2 rounded-full bg-gold" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-2 sm:hidden">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={isMobile ? "bottom" : "right"} className="w-full sm:max-w-sm">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4 space-y-4">
                            <div>
                                <div className="mb-2 text-sm font-medium">Score</div>
                                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Score" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(SCORE_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="mb-2 text-sm font-medium">Sort by</div>
                                <Select value={sortBy} onValueChange={(v) => setSortBy(v as DashboardToolbarProps["sortBy"])}>
                                    <SelectTrigger className="w-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(SORT_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <Button variant="ghost" size="sm" onClick={() => { setScoreFilter("all"); setSortBy("newest"); }}>Clear all</Button>
                                <Button size="sm" onClick={() => setFiltersOpen(false)}>Done</Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="hidden items-center rounded-lg bg-muted p-0.5 sm:flex">
                    <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode("grid")} aria-label="Grid view">
                        <GridIcon className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" className="h-8 w-8 p-0" onClick={() => setViewMode("list")} aria-label="List view">
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                <NewPitchButton orgId={organization?.id} variant="gold" size="sm" className="h-9 px-4 font-semibold" showIcon mobileIconOnly />
            </div>
        </div>
    );
}
