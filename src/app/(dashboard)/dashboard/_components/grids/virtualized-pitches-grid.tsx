import React, { useCallback, useMemo, useRef } from 'react';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrganizationResource } from "@clerk/types";
import { PitchCard } from "../cards/pitch-card";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useVirtualizer } from '@tanstack/react-virtual';
import { EmptySearch } from "../empty-states/empty-search";
import { EmptyFavorites } from "../empty-states/empty-favorites";
import { EmptyPitches } from "../empty-states/empty-pitches";
import { Pitch } from "./pitches-grid";
import { getColumnCount, gridColsClass } from "./grid-utils";
import { toPitchCardProps } from "./pitch-to-card";

interface VirtualizedPitchesGridProps {
    data?: Pitch[];
    viewMode: "grid" | "list";
    searchQuery: string;
    currentView: string;
    organization?: OrganizationResource | null;
    isLoading?: boolean;
    scrollRef?: React.RefObject<HTMLDivElement>;
}

export const VirtualizedPitchesGrid: React.FC<VirtualizedPitchesGridProps> = ({
    data = [],
    viewMode,
    searchQuery,
    currentView,
    organization,
    isLoading = false,
    scrollRef,
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
    const ROW_GAP_PX = 24;

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => (scrollRef?.current as any) ?? parentRef.current,
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

    const colsClass = gridColsClass(viewMode, columnCount);

    return (
        <div ref={parentRef} className={scrollRef ? "h-full w-full" : "h-full w-full overflow-auto"}>
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
                            className={cn("absolute top-0 left-0 w-full grid gap-6 py-3", colsClass)}
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
                                          <PitchCard {...toPitchCardProps(pitch, handlePitchClick)} />
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
