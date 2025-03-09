import {motion} from "framer-motion";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {formatDistanceToNow} from "date-fns";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Star, ChevronRight} from 'lucide-react';
import React from "react";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {api} from "@/convex/_generated/api";
import {cn} from "@/lib/utils";
import {useAuth} from "@clerk/nextjs";
import {Badge} from "@/components/ui/badge";
import {Actions} from "@/components/actions";
import {useToast} from "@/components/ui/use-toast"

interface PitchCardProps {
    id: string;
    title: string;
    text: string;
    authorId: string;
    authorName: string;
    createdAt: number;
    orgId: string;
    isFavorite: boolean;
    score?: number;
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
                              score,
                              onClick
                          }: PitchCardProps) {
    const {userId} = useAuth();
    const {toast} = useToast()
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true,
    });

    const {mutate: onFavorite, pending: pendingFavorite} = useApiMutation(api.pitches.favorite);
    const {mutate: onUnfavorite, pending: pendingUnfavorite} = useApiMutation(api.pitches.unfavorite);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (isFavorite) {
            onUnfavorite({id, orgId})
                .catch(() => toast({
                    title: "Error",
                    description: "Failed to unfavorite",
                    variant: "destructive"
                }));
        } else {
            onFavorite({id, orgId})
                .catch(() => toast({
                    title: "Error",
                    description: "Failed to favorite",
                    variant: "destructive"
                }));
        }
    };

    // Function to determine score color
    const getScoreColor = (score?: number) => {
        if (!score) return "bg-gray-100 text-gray-500";
        if (score >= 8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        if (score >= 6) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        if (score >= 4) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            whileHover={{y: -5, transition: {duration: 0.2}}}
            className="h-full"
        >
            <Card
                onClick={onClick}
                className="flex flex-col h-full cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden border-opacity-40 dark:border-opacity-30"
            >
                {score !== undefined && (
                    <div className="absolute top-3 right-3 z-10">
                        <Badge className={cn("font-semibold", getScoreColor(score))}>
                            {score.toFixed(1)}
                        </Badge>
                    </div>
                )}

                <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
                    <Actions
                        id={id}
                        title={title}
                        side="right"
                    >
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-black/70"
                        >
                            <MoreHorizontal className="h-4 w-4"/>
                            <span className="sr-only">Actions</span>
                        </Button>
                    </Actions>

                    <Button
                        onClick={toggleFavorite}
                        disabled={pendingFavorite || pendingUnfavorite}
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-black/70",
                            (pendingFavorite || pendingUnfavorite) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Star
                            className={cn(
                                "h-4 w-4 transition-colors",
                                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-600 dark:text-gray-400"
                            )}
                        />
                        <span className="sr-only">
                            {isFavorite ? "Remove from favorites" : "Add to favorites"}
                        </span>
                    </Button>
                </div>

                <CardContent className="flex-1 pt-10 pb-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {text}
                    </p>
                </CardContent>

                <CardFooter
                    className="flex-none pt-0 pb-4 px-6 text-xs text-muted-foreground flex justify-between items-center">
                    <span>{authorLabel} • {createdAtLabel}</span>
                    <ChevronRight className="h-4 w-4 opacity-60"/>
                </CardFooter>
            </Card>
        </motion.div>
    );
}