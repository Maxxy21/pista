import React, { useCallback, useMemo, useRef } from 'react';
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrganizationResource } from "@clerk/types";
import { PitchCard } from "@/app/dashboard/components/pitch-card";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useVirtualizer } from '@tanstack/react-virtual';
import { NewPitchButton } from "./new-pitch-button";
import { EmptySearch } from "@/app/dashboard/components/empty-search";
import { EmptyFavorites } from "@/app/dashboard/components/empty-favorites";
import { EmptyPitches } from "@/app/dashboard/components/empty-pitches";
import { Pitch } from "./pitches-grid";

interface VirtualizedPitchesGridProps {
    data?: Pitch[];
    viewMode: "grid" | "list";
    searchQuery: string;
    currentView: string;
    organization?: OrganizationResource | null;
    isLoading?: boolean;
}

const getColumnCount = (viewMode: "grid" | "list", width: number) => {
    if (viewMode === "list") return 1;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
};

export const VirtualizedPitchesGrid: React.FC<VirtualizedPitchesGridProps> = ({
    data = [],
    viewMode,
    searchQuery,
    currentView,
    organization,
    isLoading = false,
}) => {
    const router = useRouter();
    const parentRef = useRef<HTMLDivElement>(null);

    // Responsive column count
    const [windowWidth, setWindowWidth] = React.useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const columnCount = useMemo(
        () => getColumnCount(viewMode, windowWidth),
        [viewMode, windowWidth]
    );

    const pitches = data;
    const rowCount = useMemo(
        () => Math.ceil((isLoading ? 8 : pitches.length) / columnCount),
        [pitches.length, columnCount, isLoading]
    );

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => (viewMode === "list" ? 120 : 250),
        overscan: 5,
    });

    const handlePitchClick = useCallback(
        (pitchId: string) => {
            router.push(`/pitch/${pitchId}`);
        },
        [router]
    );

    // Empty states
    if (!isLoading && pitches.length === 0) {
        if (searchQuery) return <EmptySearch />;
        if (currentView === "favorites") return <EmptyFavorites />;
        if (organization) return <EmptyPitches orgId={organization.id as string} />;
        return null;
    }

    return (
        <div ref={parentRef} className="h-full w-full overflow-auto">
            <div
                className="relative w-full"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const rowIndex = virtualRow.index;
                    return (
                        <div
                            key={virtualRow.key}
                            className={cn(
                                "absolute top-0 left-0 w-full grid gap-6",
                                viewMode === "grid"
                                    ? `grid-cols-${columnCount}`
                                    : "grid-cols-1"
                            )}
                            style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {Array.from({ length: columnCount }).map((_, colIndex) => {
                                const pitchIndex = rowIndex * columnCount + colIndex;
                                const pitch = pitches[pitchIndex];

                                if (isLoading || !pitch) {
                                    return pitchIndex < (isLoading ? 8 : pitches.length) ? (
                                        <SkeletonCard
                                            key={`skeleton-${pitchIndex}`}
                                            variant="pitch"
                                            height={viewMode === "list" ? "h-[120px]" : "h-[250px]"}
                                        />
                                    ) : null;
                                }

                                return (
                                    <motion.div
                                        key={pitch._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
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
                                            score={pitch.evaluation.overallScore}
                                            onClick={() => handlePitchClick(pitch._id)}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};