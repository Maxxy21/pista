import React from 'react';
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

import { PlusCircle } from "lucide-react";
import { NewPitchButton } from "./new-pitch-button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrganizationResource } from "@clerk/types";
import {PitchCard} from "@/app/dashboard/components/pitch-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptySearch } from "@/app/dashboard/components/empty-search";
import { EmptyFavorites } from "@/app/dashboard/components/empty-favorites";
import { EmptyPitches } from "@/app/dashboard/components/empty-pitches";



interface PitchesGridProps {
    data: any[] | undefined;
    viewMode: "grid" | "list";
    searchQuery: string;
    currentView: string;
    organization: OrganizationResource | null | undefined;
    isLoading?: boolean;
}

export const PitchesGrid = ({ 
    data, 
    viewMode, 
    searchQuery, 
    currentView,
    organization,
    isLoading = false
}: PitchesGridProps) => {
    const router = useRouter();

    const handlePitchClick = (pitchId: string) => {
        router.push(`/pitch/${pitchId}`);
    };

    // Create a skeleton pitch card component for reuse
    const SkeletonPitchCard = () => (
        <div className={cn(
            "h-[250px] rounded-lg overflow-hidden border border-border",
            viewMode === "list" ? "h-[120px]" : "h-[250px]"
        )}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6 mb-2" />
                <div className="mt-auto flex justify-between items-center">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-4" />
                </div>
            </div>
        </div>
    );

    // Show loading state
    if (isLoading || data === undefined) {
        return (
            <ScrollArea className="h-full w-full">
                <div className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                )}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonPitchCard key={i} />
                    ))}
                </div>
            </ScrollArea>
        );
    }

    // Show empty states based on context
    if (data.length === 0) {
        if (searchQuery) {
            return <EmptySearch />;
        }
        
        if (currentView === "favorites") {
            return <EmptyFavorites />;
        }
        
        if (organization) {
            return <EmptyPitches orgId={organization.id as string} />;
        }
        
        return null;
    }

    // Show pitch grid/list
    return (
        <ScrollArea className="h-full w-full">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                        "grid gap-6",
                        viewMode === "grid"
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            : "grid-cols-1"
                    )}
                >
                    {data.map((pitch) => (
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
                            score={pitch.evaluation.overallScore}
                            onClick={() => handlePitchClick(pitch._id)}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </ScrollArea>
    );
}; 