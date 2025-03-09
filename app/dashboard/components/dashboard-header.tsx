import React from 'react';
import {Button} from "@/components/ui/button";

import {useSidebar} from "@/components/ui/sidebar";
import {Filter, ArrowDownUp, List, GridIcon} from "lucide-react";
import {NewPitchButton} from "./new-pitch-button";
import {SearchForm} from "@/components/search-form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {OrganizationResource} from "@clerk/types";
import {ExpandTrigger} from "@/components/expand-trigger";

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

export const DashboardHeader = ({
                                    searchValue,
                                    setSearchValue,
                                    viewMode,
                                    setViewMode,
                                    scoreFilter,
                                    setScoreFilter,
                                    sortBy,
                                    setSortBy,
                                    organization
                                }: DashboardHeaderProps) => {
    const { isMobile } = useSidebar();

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
                                <Button variant="outline" className="h-10 gap-2">
                                    <Filter className="h-4 w-4" />
                                    <span className="hidden md:inline">
                                        {scoreFilter === "all"
                                            ? "All Scores"
                                            : scoreFilter === "high"
                                                ? "High Scores (8-10)"
                                                : scoreFilter === "medium"
                                                    ? "Medium Scores (5-7.9)"
                                                    : "Low Scores (0-4.9)"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setScoreFilter("all")}>
                                    All Scores
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setScoreFilter("high")}>
                                    High Scores (8-10)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setScoreFilter("medium")}>
                                    Medium Scores (5-7.9)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setScoreFilter("low")}>
                                    Low Scores (0-4.9)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Sort By */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2">
                                    <ArrowDownUp className="h-4 w-4" />
                                    <span className="hidden md:inline">
                                        {sortBy === "newest"
                                            ? "Newest"
                                            : sortBy === "score"
                                                ? "Highest Score"
                                                : "Recently Updated"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                                    Newest
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("score")}>
                                    Highest Score
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("updated")}>
                                    Recently Updated
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* View Mode Toggle */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
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