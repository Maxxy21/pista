import { useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { useWorkspace } from '@/hooks/use-workspace';

export function usePrefetchPitches() {
  const { organization } = useOrganization();
  const workspace = useWorkspace();
  const prefetch = useMutation(api.pitches.prefetch);
  
  // Fetch the most recent pitches
  const recentPitches = useQuery(
    api.pitches.getFilteredPitches,
    workspace.mode === 'org' && workspace.orgId
      ? { orgId: workspace.orgId, sortBy: 'date' }
      : workspace.userId ? { ownerUserId: workspace.userId, sortBy: 'date' } : 'skip'
  );
  
  // Prefetch favorite pitches
  const favoritePitches = useQuery(
    api.pitches.getFilteredPitches,
    workspace.mode === 'org' && workspace.orgId
      ? { orgId: workspace.orgId, favorites: true }
      : workspace.userId ? { ownerUserId: workspace.userId, favorites: true } : 'skip'
  );
  
  // Prefetch high-scoring pitches
  const highScoringPitches = useQuery(
    api.pitches.getFilteredPitches,
    workspace.mode === 'org' && workspace.orgId
      ? { orgId: workspace.orgId, sortBy: 'score', scoreRange: { min: 8, max: 10 } }
      : workspace.userId ? { ownerUserId: workspace.userId, sortBy: 'score', scoreRange: { min: 8, max: 10 } } : 'skip'
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
