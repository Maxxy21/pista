"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

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
      <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-primary/3 p-5 rounded-2xl border border-primary/15 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="relative">
          {contextNote ? (
            <div className="mb-3 text-[11px] rounded-md border border-amber-300/40 bg-amber-100/40 text-amber-900 px-2 py-1">
              {contextNote}
            </div>
          ) : null}

          <h2 className="font-bold text-base line-clamp-2 mb-3 text-foreground/90">{title}</h2>

          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(creationTime), "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-primary/15 hover:bg-primary/20 text-primary border-primary/25 font-medium shadow-sm">
              {score.toFixed(1)} Score
            </Badge>
            {typeBadge}
          </div>

          <Separator className="my-3 bg-primary/10" />

          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border-2 border-primary/20">
              <AvatarImage src={userImageUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {authorName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-muted-foreground">{authorName}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

