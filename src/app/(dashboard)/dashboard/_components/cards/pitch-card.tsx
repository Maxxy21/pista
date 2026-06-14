import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { ScoreRing } from "@/components/ui/score-ring";
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
    inputType?: "TEXT" | "AUDIO";
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
    inputType,
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
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[hsl(var(--foreground)/0.28)]"
                tabIndex={0}
                aria-label={`Pitch: ${title}`}
            >
                <div className="absolute right-4 top-4 flex items-center gap-1">
                    <FavoriteToggleButton isFavorite={isFavorite} disabled={isPending} onToggle={toggleFavorite} />
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        <CardActions id={id} title={title} />
                    </span>
                </div>

                <div className="flex-1">
                    {inputType && (
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                            {inputType}
                        </div>
                    )}
                    <h3 className="mb-2 line-clamp-2 pr-14 font-display text-lg font-semibold leading-tight">
                        {title}
                    </h3>
                    <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
                        {text}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground/70">
                        {authorLabel} · {createdAtLabel}
                    </span>
                    {score !== undefined && <ScoreRing score={score} size="sm" />}
                </div>
            </Card>
        </motion.div>
    );
}
