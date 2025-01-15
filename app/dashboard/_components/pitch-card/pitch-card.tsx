"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Actions } from "@/components/actions";
import { MoreHorizontal, Star } from 'lucide-react';
import React from "react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

interface PitchCardProps {
    id: string;
    title: string;
    text: string;
    authorId: string;
    authorName: string;
    createdAt: number;
    orgId: string;
    isFavorite: boolean;
    onClick: () => void;
}

export function PitchCard({
                              id,
                              title,
                              text,
                              authorId,
                              authorName,
                              createdAt,
                              orgId,
                              isFavorite,
                              onClick
                          }: PitchCardProps) {
    const { userId } = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true,
    });

    const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.pitches.favorite);
    const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(api.pitches.unfavorite);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (isFavorite) {
            onUnfavorite({ id, orgId})
                .catch(() => toast.error("Failed to unfavorite"));
        } else {
            onFavorite({ id, orgId })
                .catch(() => toast.error("Failed to favorite"));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
            className="group h-[250px]"
        >
            <Card
                onClick={onClick}
                className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-all duration-200 bg-background border-border hover:shadow-md"
            >
                <CardHeader className="flex-none space-y-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-1 text-lg font-semibold">
                            {title}
                        </CardTitle>
                        <Actions
                            id={id}
                            title={title}
                            side="right"
                        >
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                            >
                                <MoreHorizontal className="h-4 w-4"/>
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </Actions>
                    </div>
                    <CardDescription className="flex items-center text-xs">
                        {authorLabel} • {createdAtLabel}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {text}
                    </p>
                </CardContent>
                <CardFooter className="flex-none justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-medium"
                    >
                        View Details
                    </Button>
                    <Button
                        onClick={toggleFavorite}
                        disabled={pendingFavorite || pendingUnfavorite}
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-8 w-8",
                            (pendingFavorite || pendingUnfavorite) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Star
                            className={cn(
                                "h-4 w-4 transition-colors",
                                isFavorite && "fill-primary text-primary"
                            )}
                        />
                        <span className="sr-only">
                            {isFavorite ? "Remove from favorites" : "Add to favorites"}
                        </span>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

