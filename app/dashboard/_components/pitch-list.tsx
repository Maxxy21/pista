"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewPitchButton } from "./new-pitch-button";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyPitches } from "./empty-pitches";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FilterPanel } from "@/components/filter-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PitchCard } from "./pitch-card/pitch-card";
import { PitchCardSkeleton } from "./pitch-card/pitch-card-skeleton";
import qs from "query-string";
import {useOrganization} from "@clerk/nextjs";

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
    const { organization } = useOrganization();

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
    }, []);

    const handlePitchClick = (pitchId: string) => {
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
        favorites: currentView === "favorites",
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
                return `${organization?.name ?? "Organization"} Pitches`;
        }
    };

    if (data === undefined) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-[100vw] p-4"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-2xl font-semibold truncate">
                        {getTitle()}
                    </h2>
                    <NewPitchButton orgId={orgId} disabled/>
                </div>
                <FilterPanel
                    filters={filters}
                    onChange={handleFiltersChange}
                    className="mb-6"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <PitchCardSkeleton key={index}/>
                    ))}
                </div>
            </motion.div>
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full w-full max-w-[100vw]"
        >
            <div className="flex-none p-4">
                <div className="flex flex-col gap-4 max-w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                        <h2 className="text-2xl font-semibold truncate">
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
            <ScrollArea className="flex-1 w-full">
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence mode="popLayout">
                            {data?.map((pitch, index) => (
                                <motion.div
                                    key={pitch._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: index * 0.1 }
                                    }}
                                    exit={{ opacity: 0, y: -20 }}
                                    layout
                                >
                                    <PitchCard
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
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </ScrollArea>
        </motion.div>
    );
};

