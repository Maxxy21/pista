import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  variant?: "pitch" | "stat" | "simple";
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
        "rounded-lg overflow-hidden border border-border",
        height,
        className
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6 mb-2" />
          <div className="mt-auto flex justify-between items-center">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === "stat") {
    return (
      <div className={cn(
        "rounded-lg overflow-hidden border border-border p-6",
        className
      )}>
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3 mt-4" />
      </div>
    );
  }
  
  // Simple variant (default)
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", height, className)} />
  );
} 