import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useWorkspace } from '@/hooks/use-workspace';

export function usePrefetchPitches() {
  const workspace = useWorkspace();

  const recentPitches = useQuery(
    api.pitches.getFilteredPitches,
    workspace.mode === 'org' && workspace.orgId
      ? { orgId: workspace.orgId, sortBy: 'date' }
      : workspace.userId ? { ownerUserId: workspace.userId, sortBy: 'date' } : 'skip'
  );

  const favoritePitches = useQuery(
    api.pitches.getFilteredPitches,
    workspace.mode === 'org' && workspace.orgId
      ? { orgId: workspace.orgId, favorites: true }
      : workspace.userId ? { ownerUserId: workspace.userId, favorites: true } : 'skip'
  );

  const highScoringPitches = useQuery(
    api.pitches.getFilteredPitches,
    workspace.mode === 'org' && workspace.orgId
      ? { orgId: workspace.orgId, sortBy: 'score', scoreRange: { min: 8, max: 10 } }
      : workspace.userId ? { ownerUserId: workspace.userId, sortBy: 'score', scoreRange: { min: 8, max: 10 } } : 'skip'
  );

  return {
    recentPitches,
    favoritePitches,
    highScoringPitches,
  };
}
