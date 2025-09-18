import React from "react";
import { Actions } from "@/components/shared/common/actions";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface CardActionsProps {
  id: string;
  title: string;
}

export function CardActions({ id, title }: CardActionsProps) {
  return (
    <Actions id={id} title={title} side="right">
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-black/70"
        tabIndex={-1}
        aria-label="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </Actions>
  );
}

