import { useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';

export function usePrefetchPitches() {
  const { organization } = useOrganization();
  const prefetch = useMutation(api.pitches.prefetch);
  
  // Fetch the most recent pitches
  const recentPitches = useQuery(
    api.pitches.getFilteredPitches,
    organization
      ? {
          orgId: organization.id,
          sortBy: "date"
        }
      : "skip"
  );
  
  // Prefetch favorite pitches
  const favoritePitches = useQuery(
    api.pitches.getFilteredPitches,
    organization
      ? {
          orgId: organization.id,
          favorites: true
        }
      : "skip"
  );
  
  // Prefetch high-scoring pitches
  const highScoringPitches = useQuery(
    api.pitches.getFilteredPitches,
    organization
      ? {
          orgId: organization.id,
          sortBy: "score",
          scoreRange: { min: 8, max: 10 }
        }
      : "skip"
  );
  
  // When navigating to dashboard, prefetch additional data
  useEffect(() => {
    if (organization) {
      prefetch({ orgId: organization.id })
        .catch(err => console.error("Error prefetching pitches:", err));
    }
  }, [organization, prefetch]);
  
  return {
    recentPitches,
    favoritePitches,
    highScoringPitches,
  };
} 