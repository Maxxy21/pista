import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  variant?: "pitch" | "stat" | "simple" | "navbar" | "sidebar";
  height?: string;
}

export function SkeletonCard({ 
  className, 
  variant = "simple", 
  height = "h-[250px]" 
}: SkeletonCardProps) {
  if (variant === "pitch") {
    return (
      <div className={cn(
        "rounded-lg overflow-hidden border border-border bg-card transition-all duration-200 hover:shadow-md",
        height,
        className
      )}>
        <div className="p-6 h-full flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="flex-1" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === "stat") {
    return (
      <div className={cn(
        "rounded-lg overflow-hidden border border-border bg-card p-6 transition-all duration-200 hover:shadow-md",
        className
      )}>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (variant === "navbar") {
    return (
      <div className={cn("flex items-center space-x-4 p-4", className)}>
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/6" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-3 p-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }
  
  // Simple variant (default)
  return (
    <div className={cn(
      "rounded-md bg-muted/70 relative overflow-hidden",
      "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-muted-foreground/10 before:to-transparent",
      height, 
      className
    )} />
  );
} 