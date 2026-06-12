"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock8 } from "lucide-react";
import { format } from "date-fns";
import { ScoreRing } from "@/components/ui/score-ring";

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
        className="h-auto py-3 px-4 justify-start w-full text-left hover:bg-muted/50 rounded-xl transition-all duration-200 border border-transparent hover:border-border"
      >
        <div className="flex w-full items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <span className="w-full truncate text-left text-sm font-semibold leading-tight text-foreground/90 group-hover:text-foreground">
              {title}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock8 className="h-3 w-3" />
              <span>{format(new Date(creationTime), "MMM d")}</span>
            </div>
          </div>
          <ScoreRing score={score} size="sm" />
        </div>
      </Button>
    </motion.div>
  );
}
