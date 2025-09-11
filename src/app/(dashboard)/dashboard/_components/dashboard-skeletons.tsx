"use client";

import React from "react";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export const StatsSkeleton: React.FC = () => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} variant="stat" />
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

