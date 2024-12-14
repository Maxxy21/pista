"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewPitchButton } from "./new-pitch-button";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyPitches } from "./empty-pitches";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { FilterPanel } from "@/components/filters/filter-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PitchCard } from "./pitch-card/pitch-card";

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
        favorites?: string;
    }
}

export const PitchList = ({ orgId, query }: PitchListProps) => {
    const [filters, setFilters] = React.useState<FilterState>({
        categories: [],
        scoreRange: {
            min: 0,
            max: 10
        },
        sortBy: "date"
    });

    const handleFiltersChange = React.useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
    }, []);

    const data = useQuery(api.pitches.getFilteredPitches, {
        orgId,
        search: query.search,
        favorites: query.favorites === "true",
        categories: filters.categories,
        scoreRange: filters.scoreRange,
        sortBy: filters.sortBy,
    });

    const router = useRouter();

    if (data === undefined) {
        return (
            <div className="flex-none p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-semibold">
                        {query.favorites ? "Favorite Pitches" : "Team Pitches"}
                    </h2>
                    <NewPitchButton orgId={orgId} disabled />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="h-[250px]">
                            <div className="w-full h-full animate-pulse bg-gray-200 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data?.length && query.search) {
        return <EmptySearch />;
    }

    if (!data?.length && query.favorites) {
        return <EmptyFavorites />;
    }

    if (!data?.length) {
        return <EmptyPitches orgId={orgId} />;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-none p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold">
                        {query.favorites ? "Favorite Pitches" : "Team Pitches"}
                    </h2>
                    <div className="flex items-center justify-between gap-2">
                        <FilterPanel
                            filters={filters}
                            onChange={handleFiltersChange}
                        />
                        <NewPitchButton orgId={orgId} />
                    </div>
                </div>
            </div>
            <ScrollArea className="flex-1 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 pb-4">
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
                                onClick={() => router.push(`/pitch/${pitch._id}`)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
};