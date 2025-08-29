import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrganizationResource } from "@clerk/types";
import { PitchCard } from "../cards/pitch-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptySearch } from "../empty-states/empty-search";
import { EmptyFavorites } from "../empty-states/empty-favorites";
import { EmptyPitches } from "../empty-states/empty-pitches";
import { Id } from "@/convex/_generated/dataModel";

export interface Pitch {
    _id: Id<"pitches">;
    title: string;
    text: string;
    userId: string;
    authorName: string;
    _creationTime: number;
    orgId: string;
    isFavorite: boolean;
    evaluation: {
        overallScore: number;
    };
}

interface PitchesGridProps {
    data: Pitch[] | undefined;
    viewMode: "grid" | "list";
    searchQuery: string;
    currentView: string;
    organization: OrganizationResource | null | undefined;
    isLoading?: boolean;
}

const SkeletonPitchCard: React.FC<{ viewMode: "grid" | "list" }> = ({ viewMode }) => (
    <div
        className={cn(
            "rounded-lg overflow-hidden border border-border",
            viewMode === "list" ? "h-[120px]" : "h-[250px]"
        )}
    >
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

export const PitchesGrid: React.FC<PitchesGridProps> = ({
    data,
    viewMode,
    searchQuery,
    currentView,
    organization,
    isLoading = false,
}) => {
    const router = useRouter();

    const handlePitchClick = useCallback(
        (pitchId: string) => {
            router.push(`/pitch/${pitchId}`);
        },
        [router]
    );

    const gridClass = useMemo(
        () =>
            cn(
                "grid gap-6",
                viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
            ),
        [viewMode]
    );

    // Loading state
    if (isLoading || data === undefined) {
        return (
            <ScrollArea className="h-full w-full">
                <div className={gridClass}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonPitchCard key={i} viewMode={viewMode} />
                    ))}
                </div>
            </ScrollArea>
        );
    }

    // Empty states
    if (data.length === 0) {
        if (searchQuery) return <EmptySearch />;
        if (currentView === "favorites") return <EmptyFavorites />;
        if (organization) return <EmptyPitches orgId={organization.id as string} />;
        return null;
    }

    // Main grid/list
    return (
        <ScrollArea className="h-full w-full">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={gridClass}
                >
                    {data.map((pitch) => (
                        <PitchCard
                            key={pitch._id}
                            id={pitch._id}
                            title={pitch.title}
                            text={pitch.text}
                            authorId={pitch.userId}
                            authorName={pitch.authorName}
                            createdAt={Number(new Date(pitch._creationTime))}
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