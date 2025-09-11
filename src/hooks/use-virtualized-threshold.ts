"use client";

import { useCallback, useMemo } from "react";

export function useVirtualizedThreshold(defaultThreshold = 20) {
  const threshold = useMemo(() => defaultThreshold, [defaultThreshold]);
  const shouldVirtualize = useCallback((count: number | undefined | null) => {
    return typeof count === "number" && count > threshold;
  }, [threshold]);
  return { threshold, shouldVirtualize } as const;
}

