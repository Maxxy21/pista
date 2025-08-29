import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Filter, ArrowDownUp, List, GridIcon } from "lucide-react";
import { SearchForm } from "@/components/search-form";
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
        <div className="border-b">
            <div className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">Dashboard</h1>
                
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

                {/* Right section - Controls */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Score Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-8 gap-1 sm:gap-2" aria-label="Score Filter">
                                <Filter className="h-3.5 w-3.5" />
                                <span className="hidden md:inline text-sm">{scoreFilterLabel}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.entries(SCORE_FILTER_LABELS).map(([key, label]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setScoreFilter(key)}
                                    aria-selected={scoreFilter === key}
                                >
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sort By */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-8 gap-1 sm:gap-2" aria-label="Sort By">
                                <ArrowDownUp className="h-3.5 w-3.5" />
                                <span className="hidden md:inline text-sm">{sortByLabel}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.entries(SORT_BY_LABELS).map(([key, label]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setSortBy(key as DashboardHeaderProps["sortBy"])}
                                    aria-selected={sortBy === key}
                                >
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* View Mode Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleViewModeToggle}
                        aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
                    >
                        {viewMode === "grid" ? (
                            <List className="h-3.5 w-3.5" />
                        ) : (
                            <GridIcon className="h-3.5 w-3.5" />
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