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
        "h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm shadow-sm hover:bg-card",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      tabIndex={-1}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorite ? "fill-gold text-gold" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}

