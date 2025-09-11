import React, { useCallback, useMemo, useRef } from 'react';
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrganizationResource } from "@clerk/types";
import { PitchCard } from "../cards/pitch-card";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useVirtualizer } from '@tanstack/react-virtual';
import { NewPitchButton } from "../new-pitch-button";
import { EmptySearch } from "../empty-states/empty-search";
import { EmptyFavorites } from "../empty-states/empty-favorites";
import { EmptyPitches } from "../empty-states/empty-pitches";
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

    const LIST_CARD_HEIGHT = 200;  // fixed card height in list view
    const GRID_CARD_HEIGHT = 250;  // fixed card height in grid view
    const ROW_GAP_PX = 24;         // matches `py-3` vertical padding per row

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ((viewMode === "list" ? LIST_CARD_HEIGHT : GRID_CARD_HEIGHT) + ROW_GAP_PX),
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

    // Tailwind cannot generate dynamic `grid-cols-${n}` classes at runtime.
    // Map the computed column count to static class names to ensure CSS exists.
    const gridColsClass = viewMode === "grid"
        ? (columnCount === 1
            ? "grid-cols-1"
            : columnCount === 2
                ? "grid-cols-2"
                : columnCount === 3
                    ? "grid-cols-3"
                    : "grid-cols-4")
        : "grid-cols-1";

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
                            className={cn("absolute top-0 left-0 w-full grid gap-6 py-3", gridColsClass)}
                            style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                            ref={rowVirtualizer.measureElement}
                        >
                            {Array.from({ length: columnCount }).map((_, colIndex) => {
                                const pitchIndex = rowIndex * columnCount + colIndex;
                                const pitch = pitches[pitchIndex];

                                if (isLoading || !pitch) {
                                    return pitchIndex < (isLoading ? 8 : pitches.length) ? (
                                        <SkeletonCard
                                            key={`skeleton-${pitchIndex}`}
                                            variant="pitch"
                                            height={viewMode === "list" ? "h-[200px]" : "h-[250px]"}
                                        />
                                    ) : null;
                                }

                                return (
                                    <motion.div
                                        key={pitch._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div style={{ height: viewMode === "list" ? LIST_CARD_HEIGHT : GRID_CARD_HEIGHT }}>
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
                                        </div>
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
