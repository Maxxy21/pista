import React from 'react';
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

import { PlusCircle } from "lucide-react";
import { NewPitchButton } from "./new-pitch-button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrganizationResource } from "@clerk/types";
import {PitchCard} from "@/app/dashboard/components/pitch-card";


interface PitchesGridProps {
    data: any[] | undefined;
    viewMode: "grid" | "list";
    searchQuery: string;
    currentView: string;
    organization: OrganizationResource | null | undefined;
}

export const PitchesGrid = ({ 
    data, 
    viewMode, 
    searchQuery, 
    currentView,
    organization 
}: PitchesGridProps) => {
    const router = useRouter();

    const handlePitchClick = (pitchId: string) => {
        router.push(`/pitch/${pitchId}`);
    };

    return (
        <ScrollArea className="h-full w-full">
            {data === undefined ? (
                // Loading state
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-[250px] animate-pulse bg-muted rounded-lg" />
                    ))}
                </div>
            ) : data.length === 0 ? (
                // Empty state
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
            ) : (
                // Pitch grid/list
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
            )}
        </ScrollArea>
    );
}; 