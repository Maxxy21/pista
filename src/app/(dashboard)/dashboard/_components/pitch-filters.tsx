import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Filter, ArrowDownUp, List, GridIcon, PlusCircle, FileText } from "lucide-react";
import { SearchForm } from "@/components/shared/forms/search-form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { NewPitchButton } from "./new-pitch-button";
import { useOrganization } from "@clerk/nextjs";

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
}) => {
    const router = useRouter()
    const { organization } = useOrganization()
    
    const handleViewModeToggle = useCallback(() => {
        setViewMode(viewMode === "grid" ? "list" : "grid");
    }, [viewMode, setViewMode]);

    const scoreFilterLabel = useMemo(
        () => SCORE_FILTER_LABELS[scoreFilter] || SCORE_FILTER_LABELS.all,
        [scoreFilter]
    );

    const scoreFilterLabelMobile = useMemo(
        () => SCORE_FILTER_LABELS_MOBILE[scoreFilter] || SCORE_FILTER_LABELS_MOBILE.all,
        [scoreFilter]
    );

    const sortByLabel = useMemo(
        () => SORT_BY_LABELS[sortBy],
        [sortBy]
    );

    const sortByLabelMobile = useMemo(
        () => SORT_BY_LABELS_MOBILE[sortBy],
        [sortBy]
    );

    return (
        <div className="border-b bg-gradient-to-r from-muted/5 via-muted/10 to-muted/5 px-4 md:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Left side - Filters (Beautiful Miro-style) */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                    <span className="text-sm font-semibold text-foreground/80 hidden md:inline flex-shrink-0">Filter by</span>
                    
                    {/* Score Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline"
                                size="sm"
                                className={`h-9 gap-2 px-3 sm:px-4 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0 ${
                                    scoreFilter !== "all" 
                                        ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15" 
                                        : "hover:bg-background/80 border-border/60 hover:border-border"
                                }`}
                            >
                                <Filter className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate max-w-20 sm:max-w-32 md:max-w-none">
                                    <span className="sm:hidden">{scoreFilterLabelMobile}</span>
                                    <span className="hidden sm:inline">{scoreFilterLabel}</span>
                                </span>
                                {scoreFilter !== "all" && (
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-56 shadow-lg border-border/50">
                            {Object.entries(SCORE_FILTER_LABELS).map(([key, label]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setScoreFilter(key)}
                                    className={`font-medium transition-colors ${
                                        scoreFilter === key 
                                            ? "bg-primary/15 text-primary font-semibold" 
                                            : "hover:bg-muted/60"
                                    }`}
                                >
                                    {label}
                                    {scoreFilter === key && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Separator orientation="vertical" className="h-5 bg-border/60 hidden md:block flex-shrink-0" />
                    
                    <span className="text-sm font-semibold text-foreground/80 hidden md:inline flex-shrink-0">Sort by</span>
                    
                    {/* Sort By */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline"
                                size="sm"
                                className={`h-9 gap-2 px-3 sm:px-4 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0 ${
                                    sortBy !== "newest" 
                                        ? "bg-secondary/10 text-secondary-foreground border-secondary/30 hover:bg-secondary/15" 
                                        : "hover:bg-background/80 border-border/60 hover:border-border"
                                }`}
                            >
                                <ArrowDownUp className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate max-w-16 sm:max-w-24 md:max-w-none">
                                    <span className="sm:hidden">{sortByLabelMobile}</span>
                                    <span className="hidden sm:inline">{sortByLabel}</span>
                                </span>
                                {sortBy !== "newest" && (
                                    <div className="w-2 h-2 rounded-full bg-secondary-foreground/60 animate-pulse flex-shrink-0" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-56 shadow-lg border-border/50">
                            {Object.entries(SORT_BY_LABELS).map(([key, label]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setSortBy(key as PitchFiltersProps["sortBy"])}
                                    className={`font-medium transition-colors ${
                                        sortBy === key 
                                            ? "bg-secondary/15 text-secondary-foreground font-semibold" 
                                            : "hover:bg-muted/60"
                                    }`}
                                >
                                    {label}
                                    {sortBy === key && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-secondary-foreground" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Right side - Actions and View Toggle */}
                <div className="flex items-center gap-2 sm:gap-3 justify-end flex-shrink-0">
                    {/* Action Buttons */}
                    {organization && (
                        <NewPitchButton
                            orgId={organization.id}
                            variant="default"
                            size="sm"
                            className="h-9 gap-2 px-4 sm:px-4 text-sm font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0"
                            showIcon={true}
                            mobileIconOnly={true}
                        />
                    )}

                    <Separator orientation="vertical" className="h-5 bg-border/60 hidden sm:block" />

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-muted/40 border border-border/60 rounded-lg p-0.5 shadow-sm flex-shrink-0">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            className={`h-8 w-8 p-0 rounded-md border-0 transition-all duration-200 ${
                                viewMode === "grid" 
                                    ? "bg-background shadow-sm border border-border/30" 
                                    : "hover:bg-background/60"
                            }`}
                            onClick={() => setViewMode("grid")}
                        >
                            <GridIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            className={`h-8 w-8 p-0 rounded-md border-0 transition-all duration-200 ${
                                viewMode === "list" 
                                    ? "bg-background shadow-sm border border-border/30" 
                                    : "hover:bg-background/60"
                            }`}
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