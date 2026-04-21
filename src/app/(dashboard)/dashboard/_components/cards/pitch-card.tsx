import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { ScoreBadge } from "./score-badge";
import { FavoriteToggleButton } from "./favorite-toggle";
import { CardActions } from "./card-actions";
import { toast } from "sonner";
import { useWorkspace } from "@/hooks/use-workspace";

export interface PitchCardProps {
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
    onClick,
}: PitchCardProps) {
    const { userId } = useAuth();
    const workspace = useWorkspace();

    const authorLabel = useMemo(
        () => (userId === authorId ? "You" : authorName),
        [userId, authorId, authorName]
    );
    const createdAtLabel = useMemo(
        () =>
            formatDistanceToNow(createdAt, {
                addSuffix: true,
            }),
        [createdAt]
    );

    const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(
        api.pitches.favorite
    );
    const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(
        api.pitches.unfavorite
    );

    const toggleFavorite = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            const action = isFavorite ? onUnfavorite : onFavorite;
            const payload = workspace.mode === 'org' ? { id, orgId } : { id };
            action(payload as any)
                .then(() => {
                    toast.success(`Pitch ${isFavorite ? "removed from" : "added to"} favorites`);
                })
                .catch(() => {
                    toast.error(`Failed to ${isFavorite ? "unfavorite" : "favorite"} pitch`);
                });
        },
        [isFavorite, onFavorite, onUnfavorite, id, orgId, workspace.mode]
    );

    const isPending = pendingFavorite || pendingUnfavorite;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full"
        >
            <Card
                onClick={onClick}
                className="flex flex-col h-full cursor-pointer transition-all duration-200 hover:border-foreground/20 hover:shadow-sm overflow-hidden relative group"
                tabIndex={0}
                aria-label={`Pitch: ${title}`}
            >
                <CardContent className="flex-1 p-5 pb-3">
                    {/* Title row with actions */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-sm font-semibold leading-snug line-clamp-2 flex-1">{title}</h3>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FavoriteToggleButton isFavorite={isFavorite} disabled={isPending} onToggle={toggleFavorite} />
                            <CardActions id={id} title={title} />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{text}</p>
                </CardContent>

                <CardFooter className="flex-none px-5 py-3 border-t border-border/60 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                        {authorLabel} · {createdAtLabel}
                    </span>
                    <div className="flex items-center gap-2">
                        {score !== undefined && <ScoreBadge score={score} />}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
