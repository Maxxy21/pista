'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { ModernDashboardStats } from "./_components/stats";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useOrganization, useUser } from "@clerk/nextjs";
import { ExpandTrigger } from "@/components/expand-trigger";
import { EmptyOrg } from "@/app/dashboard/_components/empty-org";
import { Loading } from "@/components/auth/loading";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, ArrowDownUp, Search as SearchIcon, Grid, GridIcon, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { ModernPitchCard } from "./_components/pitch-card/modern-pitch-card";
import { NewPitchButton } from "./_components/new-pitch-button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import qs from "query-string";

type SearchParams = Promise<{
    search?: string | string[] | undefined;
    view?: string | string[] | undefined;
}>;

interface PageProps {
    params: Promise<Record<string, string>>;
    searchParams: SearchParams;
}

const ModernDashboard = (props: PageProps) => {
    const { user, isLoaded } = useUser();
    const { organization } = useOrganization();
    const { isMobile } = useSidebar();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [scoreFilter, setScoreFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"newest" | "score" | "updated">("newest");

    // Get search and view params
    const currentView = searchParams.get("view") || "all";
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        if (searchQuery) {
            setSearchValue(searchQuery);
        }
    }, [searchQuery]);

    // Handle search changes
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                search: searchValue || undefined,
            },
        }, {skipEmptyString: true, skipNull: true});

        router.push(url);
    };

    // Handle tab changes
    const handleTabChange = (value: string) => {
        const url = qs.stringifyUrl({
            url: "/dashboard",
            query: {
                ...Object.fromEntries(searchParams.entries()),
                view: value === "all" ? undefined : value,
            },
        }, {skipEmptyString: true, skipNull: true});

        router.push(url);
    };

    // Get pitches data
    const data = useQuery(
        api.pitches.getFilteredPitches,
        organization
            ? {
                orgId: organization.id,
                search: searchQuery,
                favorites: currentView === "favorites",
                sortBy: currentView === "recent" ? "date" : sortBy === "newest" ? "date" : "score",
                scoreRange: getScoreRange(scoreFilter),
            }
            : "skip"
    );

    // Get score range based on filter
    function getScoreRange(filter: string) {
        switch (filter) {
            case "high":
                return { min: 8, max: 10 };
            case "medium":
                return { min: 5, max: 7.9 };
            case "low":
                return { min: 0, max: 4.9 };
            default:
                return { min: 0, max: 10 };
        }
    }

    // Handle pitch click
    const handlePitchClick = (pitchId: string) => {
        router.push(`/pitch/${pitchId}`);
    };

    // Show loading state until auth is loaded
    if (!isLoaded) {
        return <Loading />;
    }

    // Don't render anything if not authenticated
    if (!user) {
        return null;
    }

    return (
        <SidebarInset>
            <div className="flex flex-col h-full">
                {/* Modern Header with Search and Actions */}
                <div className="border-b bg-background sticky top-0 z-10">
                    <div className="container mx-auto py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                                {isMobile && <ExpandTrigger />}
                                <h1 className="text-2xl font-bold">Dashboard</h1>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Search Input with Icon */}
                                <form onSubmit={handleSearch} className="relative max-w-md w-full hidden md:block">
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search pitches..."
                                        className="pl-10 h-10 w-full bg-background"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </form>

                                {/* Score Filter Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-10 w-10">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => setScoreFilter("high")}
                                            className={cn(scoreFilter === "high" && "bg-muted")}
                                        >
                                            High Score (8+)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setScoreFilter("medium")}
                                            className={cn(scoreFilter === "medium" && "bg-muted")}
                                        >
                                            Medium Score (5-8)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setScoreFilter("low")}
                                            className={cn(scoreFilter === "low" && "bg-muted")}
                                        >
                                            Low Score (≤5)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setScoreFilter("all")}
                                            className={cn(scoreFilter === "all" && "bg-muted")}
                                        >
                                            All Scores
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Sort Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-10 w-10">
                                            <ArrowDownUp className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("newest")}
                                            className={cn(sortBy === "newest" && "bg-muted")}
                                        >
                                            Newest First
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("score")}
                                            className={cn(sortBy === "score" && "bg-muted")}
                                        >
                                            Highest Score
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSortBy("updated")}
                                            className={cn(sortBy === "updated" && "bg-muted")}
                                        >
                                            Last Updated
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
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b">
                    <div className="container mx-auto">
                        <Tabs
                            defaultValue={currentView}
                            value={currentView}
                            onValueChange={handleTabChange}
                            className="w-full"
                        >
                            <TabsList className="bg-transparent h-12">
                                <TabsTrigger
                                    value="all"
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none h-12"
                                >
                                    All Pitches
                                </TabsTrigger>
                                <TabsTrigger
                                    value="recent"
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none h-12"
                                >
                                    Recent
                                </TabsTrigger>
                                <TabsTrigger
                                    value="favorites"
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none h-12"
                                >
                                    Favorites
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="container mx-auto py-6">
                    <ModernDashboardStats />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-0 py-6">
                    {!organization ? (
                        <EmptyOrg />
                    ) : (
                        <div className="container mx-auto">
                            <ScrollArea className="h-full">
                                {data === undefined ? (
                                    // Loading state
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="h-[250px] animate-pulse bg-muted rounded-lg" />
                                        ))}
                                    </div>
                                ) : data.length === 0 ? (
                                    // Empty state
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                            <PlusCircle className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">No pitches found</h3>
                                        <p className="text-muted-foreground mb-6">
                                            {searchQuery
                                                ? "No pitches match your search criteria"
                                                : currentView === "favorites"
                                                    ? "You haven't favorited any pitches yet"
                                                    : "Create your first pitch to get started"}
                                        </p>
                                        {!searchQuery && currentView !== "favorites" && organization && (
                                            <NewPitchButton
                                                orgId={organization.id as string}
                                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    // Pitch grid/list
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={cn(
                                                "grid gap-6",
                                                viewMode === "grid"
                                                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                                    : "grid-cols-1"
                                            )}
                                        >
                                            {data.map((pitch, index) => (
                                                <ModernPitchCard
                                                    key={pitch._id}
                                                    id={pitch._id}
                                                    title={pitch.title}
                                                    text={pitch.text}
                                                    authorId={pitch.userId}
                                                    authorName={pitch.authorName}
                                                    createdAt={pitch._creationTime}
                                                    orgId={pitch.orgId}
                                                    isFavorite={pitch.isFavorite}
                                                    score={pitch.evaluation.overallScore}
                                                    onClick={() => handlePitchClick(pitch._id)}
                                                />
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </div>
        </SidebarInset>
    );
};

export default ModernDashboard;