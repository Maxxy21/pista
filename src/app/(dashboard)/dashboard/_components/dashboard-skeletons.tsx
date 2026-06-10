"use client";

import React from "react";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-card lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="px-5 py-4">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="mt-3 h-7 w-14 rounded bg-muted" />
      </div>
    ))}
  </div>
);

export const PitchesGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} variant="pitch" />
    ))}
  </div>
);

