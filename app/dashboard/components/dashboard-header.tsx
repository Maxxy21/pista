import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Filter, ArrowDownUp, List, GridIcon } from "lucide-react";
import { NewPitchButton } from "./new-pitch-button";
import { SearchForm } from "@/components/search-form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationResource } from "@clerk/types";
import { ExpandTrigger } from "@/components/expand-trigger";

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
            <div className="px-4 md:px-6 lg:px-8 py-4 w-full">
                <div className="flex items-center justify-between gap-4">
                    {/* Left section */}
                    <div className="flex items-center gap-2">
                        {isMobile && <ExpandTrigger />}
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                    </div>

                    {/* Middle section - Search */}
                    <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto">
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
                    <div className="flex items-center gap-2">
                        {/* Score Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2" aria-label="Score Filter">
                                    <Filter className="h-4 w-4" />
                                    <span className="hidden md:inline">{scoreFilterLabel}</span>
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
                                <Button variant="outline" className="h-10 gap-2" aria-label="Sort By">
                                    <ArrowDownUp className="h-4 w-4" />
                                    <span className="hidden md:inline">{sortByLabel}</span>
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
                            className="h-10 w-10"
                            onClick={handleViewModeToggle}
                            aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
                        >
                            {viewMode === "grid" ? (
                                <List className="h-4 w-4" />
                            ) : (
                                <GridIcon className="h-4 w-4" />
                            )}
                        </Button>

                        {/* New Pitch Button */}
                        {organization && (
                            <NewPitchButton
                                orgId={organization.id as string}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            />
                        )}
                    </div>
                </div>

                {/* Mobile search - shown below header on small screens */}
                <div className="md:hidden mt-4">
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
        </div>
    );
};