"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock8, Star } from "lucide-react";
import { format } from "date-fns";

interface PitchListItemProps {
  title: string;
  creationTime: number;
  score: number;
  onClick: () => void;
}

export function PitchListItem({ title, creationTime, score, onClick }: PitchListItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="h-auto py-3 px-4 justify-start w-full text-left hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 rounded-xl transition-all duration-200 border border-transparent hover:border-muted-foreground/10"
      >
        <div className="flex flex-col items-start gap-2 min-w-0 w-full">
          <div className="flex w-full justify-between items-start gap-2">
            <span className="font-semibold truncate text-sm leading-tight text-foreground/90 group-hover:text-foreground">
              {title}
            </span>
            <ChevronLeft className="h-4 w-4 rotate-180 opacity-0 group-hover:opacity-100 transition-all duration-200 text-primary shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
            <div className="flex items-center gap-1">
              <Clock8 className="h-3 w-3" />
              <span>{format(new Date(creationTime), "MMM d")}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400/20 text-amber-500" />
              <span className="font-medium">{score.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Button>
    </motion.div>
  );
}

