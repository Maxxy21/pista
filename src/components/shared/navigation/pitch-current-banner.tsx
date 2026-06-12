"use client";

import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ScoreRing } from "@/components/ui/score-ring";

interface CurrentPitchBannerProps {
  title: string;
  creationTime: number;
  score: number;
  typeBadge: React.ReactNode;
  authorName?: string;
  userImageUrl?: string | null;
  contextNote?: string | null;
}

export function CurrentPitchBanner({
  title,
  creationTime,
  score,
  typeBadge,
  authorName,
  userImageUrl,
  contextNote,
}: CurrentPitchBannerProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        {contextNote ? (
          <div className="mb-3 rounded-md border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.1)] px-2 py-1 text-[11px] text-[hsl(var(--gold))]">
            {contextNote}
          </div>
        ) : null}

        <div className="flex items-start gap-3">
          <ScoreRing score={score} size="md" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base leading-snug line-clamp-2 text-foreground">{title}</h2>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(creationTime), "MMM d, yyyy")}</span>
            </div>
            <div className="mt-2">{typeBadge}</div>
          </div>
        </div>

        <Separator className="my-3 bg-border" />

        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-border">
            <AvatarImage src={userImageUrl || undefined} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              {authorName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground">{authorName}</span>
        </div>
      </div>
    </motion.div>
  );
}
