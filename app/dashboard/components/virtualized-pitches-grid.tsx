import React, { useCallback } from 'react';
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrganizationResource } from "@clerk/types";
import { PitchCard } from "@/app/dashboard/components/pitch-card";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useVirtualizer } from '@tanstack/react-virtual';
import { NewPitchButton } from "./new-pitch-button";

interface VirtualizedPitchesGridProps {
    data: any[] | undefined;
    viewMode: "grid" | "list";
    searchQuery: string;
    currentView: string;
    organization: OrganizationResource | null | undefined;
    isLoading?: boolean;
}

export const VirtualizedPitchesGrid = ({ 
    data, 
    viewMode, 
    searchQuery, 
    currentView,
    organization,
    isLoading = false
}: VirtualizedPitchesGridProps) => {
    const router = useRouter();
    const parentRef = React.useRef<HTMLDivElement>(null);

    const handlePitchClick = useCallback((pitchId: string) => {
        router.push(`/pitch/${pitchId}`);
    }, [router]);

    // Calculate columns based on view mode and screen size
    const getColumnCount = () => {
        if (viewMode === "list") return 1;
        
        // This is a simplified approach - in a real app you'd use a hook to get window width
        const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
        
        if (width < 768) return 1;
        if (width < 1024) return 2;
        if (width < 1280) return 3;
        return 4;
    };

    const columnCount = getColumnCount();
    const pitches = data || [];
    
    // Calculate row count based on data length and columns
    const rowCount = Math.ceil(pitches.length / columnCount);
    
    const rowVirtualizer = useVirtualizer({
        count: isLoading ? 8 : rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => viewMode === "list" ? 120 : 250,
        overscan: 5,
    });

    if (!isLoading && data?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <p className="text-muted-foreground mb-4">
                    {searchQuery
                        ? "No pitches found matching your search."
                        : currentView === "favorites"
                        ? "You haven't favorited any pitches yet."
                        : "No pitches found. Create your first pitch!"}
                </p>
                {!searchQuery && currentView !== "favorites" && organization && (
                    <NewPitchButton
                        orgId={organization.id as string}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    />
                )}
            </div>
        );
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