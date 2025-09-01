import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, ArrowDownUp, List, GridIcon, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NewPitchButton } from "./new-pitch-button";
import { useOrganization } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PitchFiltersProps {
    searchValue: string;
    setSearchValue: (value: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    scoreFilter: string;
    setScoreFilter: (filter: string) => void;
    sortBy: "newest" | "score" | "updated";
    setSortBy: (sort: "newest" | "score" | "updated") => void;
    handleSearch: (e: React.FormEvent) => void;
    resultsCount?: number;
}

const SCORE_FILTER_LABELS: Record<string, string> = {
    all: "All Scores",
    high: "High Scores (8-10)",
    medium: "Medium Scores (5-7.9)",
    low: "Low Scores (0-4.9)",
};

const SCORE_FILTER_LABELS_MOBILE: Record<string, string> = {
    all: "All Scores",
    high: "High (8-10)",
    medium: "Medium (5-7.9)",
    low: "Low (0-4.9)",
};

const SORT_BY_LABELS: Record<PitchFiltersProps["sortBy"], string> = {
    newest: "Newest",
    score: "Highest Score",
    updated: "Recently Updated",
};

const SORT_BY_LABELS_MOBILE: Record<PitchFiltersProps["sortBy"], string> = {
    newest: "Newest",
    score: "By Score",
    updated: "Updated",
};

export const PitchFilters: React.FC<PitchFiltersProps> = ({
    searchValue,
    setSearchValue,
    viewMode,
    setViewMode,
    scoreFilter,
    setScoreFilter,
    sortBy,
    setSortBy,
    handleSearch,
    resultsCount,
}) => {
    const { organization } = useOrganization();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const isMobile = useIsMobile();
    
    const handleViewModeToggle = useCallback(() => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    }, [viewMode, setViewMode]);

    const scoreFilterLabel = useMemo(
        () => SCORE_FILTER_LABELS[scoreFilter] || SCORE_FILTER_LABELS.all,
        [scoreFilter]
    );

    const sortByLabel = useMemo(
        () => SORT_BY_LABELS[sortBy],
        [sortBy]
    );

    const handleScoreChange = (v: string) => setScoreFilter(v);
    const handleSortChange = (v: string) => setSortBy(v as 'newest' | 'score' | 'updated');

    return (
        <div className="border-b bg-gradient-to-r from-muted/5 via-muted/10 to-muted/5 px-3 md:px-6 py-2.5 md:py-3.5">
            <div className="flex items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                        <SheetTrigger asChild>
                            <Button className="sm:hidden h-9 gap-2 px-3 text-sm font-medium" variant="outline">
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={isMobile ? "bottom" : "right"} className="sm:max-w-sm w-full">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <div className="text-sm font-medium mb-2">Score</div>
                                    <Select value={scoreFilter} onValueChange={handleScoreChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Score" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SCORE_FILTER_LABELS_MOBILE).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <div className="text-sm font-medium mb-2">Sort by</div>
                                    <Select value={sortBy} onValueChange={handleSortChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SORT_BY_LABELS_MOBILE).map(([key, label]) => (
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

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFiltersOpen(true)}
                        className="h-9 gap-2 px-3 sm:px-4 text-sm font-medium hidden sm:inline-flex"
                    >
                        <Filter className="h-4 w-4" />
                        <span>{scoreFilterLabel}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFiltersOpen(true)}
                        className="h-9 gap-2 px-3 sm:px-4 text-sm font-medium hidden sm:inline-flex"
                    >
                        <ArrowDownUp className="h-4 w-4" />
                        <span>{sortByLabel}</span>
                    </Button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 justify-end flex-shrink-0">
                    {organization && (
                        <NewPitchButton
                            orgId={organization.id}
                            variant="default"
                            size="sm"
                            className="h-9 gap-2 px-4 text-sm font-semibold"
                            showIcon={true}
                            mobileIconOnly={true}
                        />
                    )}

                    <Separator orientation="vertical" className="h-5 hidden sm:block" />

                    <div className="hidden sm:flex items-center bg-muted rounded-lg p-0.5 flex-shrink-0">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setViewMode("grid")}
                        >
                            <GridIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
