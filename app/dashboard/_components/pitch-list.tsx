"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewPitchButton } from "./new-pitch-button";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyPitches } from "./empty-pitches";

import { AnimatePresence } from "framer-motion";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import React from "react";
import { FilterPanel } from "@/components/filters/filter-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PitchCard } from "./pitch-card/pitch-card";
import { PitchCardSkeleton } from "./pitch-card/pitch-card-skeleton";
import qs from "query-string";

interface FilterState {
    categories: string[];
    scoreRange: {
        min: number;
        max: number;
    };
    sortBy: "date" | "score";
}

interface PitchListProps {
    orgId: string;
    query: {
        search?: string;
        view?: string;
    }
}

export const PitchList = ({ orgId, query }: PitchListProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");
    const searchQuery = searchParams.get("search") || "";

    const [filters, setFilters] = React.useState<FilterState>({
        categories: [],
        scoreRange: {
            min: 0,
            max: 10
        },
        sortBy: currentView === "recent" ? "date" : "score"
    });


    const handleFiltersChange = React.useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
    }, [])

    const handlePitchClick = (pitchId: string) => {
        // Preserve the current view parameter when navigating to pitch details
        const url = qs.stringifyUrl({
            url: `/pitch/${pitchId}`,
            query: {
                view: query.view
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    };


    const data = useQuery(api.pitches.getFilteredPitches, {
        orgId,
        search: searchQuery,
        favorites: currentView === "favorites", // This needs to be a boolean
        sortBy: currentView === "recent" ? "date" : filters.sortBy,
        categories: filters.categories,
        scoreRange: filters.scoreRange,
    });


    const getTitle = () => {
        switch (query.view) {
            case "recent":
                return "Recent Pitches";
            case "favorites":
                return "Favorite Pitches";
            default:
                return "Team Pitches";
        }
    };



    if (data === undefined) {
        return (
            <div className="flex-none p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-semibold">
                        {getTitle()}
                    </h2>
                    <NewPitchButton orgId={orgId} disabled/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <PitchCardSkeleton key={index}/>
                    ))}
                </div>

            </div>
        );
    }

    if (!data?.length && query.search) {
        return <EmptySearch/>;
    }

    if (!data?.length && query.view === "favorites") {
        return <EmptyFavorites />;
    }

    if (!data?.length) {
        return <EmptyPitches orgId={orgId} />;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-none p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            {getTitle()}
                        </h2>
                        <NewPitchButton orgId={orgId}/>
                    </div>
                    <FilterPanel
                        filters={filters}
                        onChange={handleFiltersChange}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    <AnimatePresence mode="popLayout">
                        {data?.map((pitch) => (
                            <PitchCard
                                key={pitch._id}
                                id={pitch._id}
                                title={pitch.title}
                                text={pitch.text}
                                authorId={pitch.userId}
                                authorName={pitch.authorName}
                                createdAt={pitch._creationTime}
                                orgId={pitch.orgId}
                                isFavorite={pitch.isFavorite}
                                onClick={() => handlePitchClick(pitch._id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
};