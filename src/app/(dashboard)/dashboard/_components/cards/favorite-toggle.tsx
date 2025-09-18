import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteToggleButtonProps {
  isFavorite: boolean;
  disabled?: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export function FavoriteToggleButton({ isFavorite, disabled, onToggle }: FavoriteToggleButtonProps) {
  return (
    <Button
      onClick={onToggle}
      disabled={disabled}
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-black/70",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      tabIndex={-1}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-600 dark:text-gray-400"
        )}
      />
    </Button>
  );
}

