import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Filter, ArrowDownUp, List, GridIcon } from "lucide-react";
import { SearchForm } from "@/components/shared/forms/search-form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationResource } from "@clerk/types";

interface DashboardHeaderProps {
    searchValue: string;
    setSearchValue: (value: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    scoreFilter: string;
    setScoreFilter: (filter: string) => void;
    sortBy: "newest" | "score" | "updated";
    setSortBy: (sort: "newest" | "score" | "updated") => void;
    handleSearch: (e: React.FormEvent) => void;
    organization: OrganizationResource | null | undefined;
}

const SCORE_FILTER_LABELS: Record<string, string> = {
    all: "All Scores",
    high: "High Scores (8-10)",
    medium: "Medium Scores (5-7.9)",
    low: "Low Scores (0-4.9)",
};

const SORT_BY_LABELS: Record<DashboardHeaderProps["sortBy"], string> = {
    newest: "Newest",
    score: "Highest Score",
    updated: "Recently Updated",
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    searchValue,
    setSearchValue,
    viewMode,
    setViewMode,
    scoreFilter,
    setScoreFilter,
    sortBy,
    setSortBy,
    organization,
}) => {
    const { isMobile } = useSidebar();

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

    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-20 shrink-0 items-center gap-4 px-4 md:px-6 lg:px-8 w-full">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-5" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                </div>
                
                {/* Middle section - Search */}
                <div className="hidden md:flex flex-1 justify-center max-w-xl mx-4">
                    <SearchForm
                        value={searchValue}
                        onChange={setSearchValue}
                        className="w-full max-w-md"
                        placeholder="Search pitches..."
                        variant="standalone"
                        autoFocus={false}
                    />
                </div>

                {/* Right section - Enhanced Controls */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Score Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant={scoreFilter !== "all" ? "default" : "outline"} 
                                className={`h-9 gap-2 px-4 font-medium transition-all duration-200 ${
                                    scoreFilter !== "all" 
                                        ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 shadow-sm" 
                                        : "hover:bg-muted/50 hover:border-muted-foreground/30"
                                }`}
                                aria-label="Score Filter"
                            >
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline font-semibold">{scoreFilterLabel}</span>
                                {scoreFilter !== "all" && (
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-48">
                            {Object.entries(SCORE_FILTER_LABELS).map(([key, label]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setScoreFilter(key)}
                                    className={`font-medium ${
                                        scoreFilter === key 
                                            ? "bg-primary/10 text-primary" 
                                            : ""
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

                    {/* Sort By */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant={sortBy !== "newest" ? "default" : "outline"} 
                                className={`h-9 gap-2 px-4 font-medium transition-all duration-200 ${
                                    sortBy !== "newest" 
                                        ? "bg-secondary/60 text-secondary-foreground border-secondary/40 hover:bg-secondary/70 shadow-sm" 
                                        : "hover:bg-muted/50 hover:border-muted-foreground/30"
                                }`}
                                aria-label="Sort By"
                            >
                                <ArrowDownUp className="h-4 w-4" />
                                <span className="hidden sm:inline font-semibold">{sortByLabel}</span>
                                {sortBy !== "newest" && (
                                    <div className="w-2 h-2 rounded-full bg-secondary-foreground/60 animate-pulse" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-48">
                            {Object.entries(SORT_BY_LABELS).map(([key, label]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setSortBy(key as DashboardHeaderProps["sortBy"])}
                                    className={`font-medium ${
                                        sortBy === key 
                                            ? "bg-secondary/20 text-secondary-foreground" 
                                            : ""
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

                    {/* Visual Separator */}
                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* View Mode Toggle */}
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 transition-all duration-200 ${
                            viewMode === "list" 
                                ? "bg-accent/60 text-accent-foreground shadow-sm" 
                                : "hover:bg-muted/50"
                        }`}
                        onClick={handleViewModeToggle}
                        aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
                    >
                        {viewMode === "grid" ? (
                            <List className="h-4 w-4" />
                        ) : (
                            <GridIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
            
            {/* Mobile search - shown below header on small screens */}
            <div className="md:hidden px-4 pb-4">
                <SearchForm
                    value={searchValue}
                    onChange={setSearchValue}
                    className="w-full"
                    placeholder="Search pitches..."
                    variant="standalone"
                    autoFocus={false}
                />
            </div>
        </div>
    );
};