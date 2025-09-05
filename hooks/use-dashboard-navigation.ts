// hooks/use-dashboard-navigation.ts
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDashboardStore } from '@/store/dashboard-store';

export const useDashboardNavigation = () => {
  const router = useRouter();
  const syncToURL = useDashboardStore((state) => state.syncToURL);
  
  const updateURL = useCallback(() => {
    const params = syncToURL();
    const query = params.toString();
    const url = query ? `/dashboard?${query}` : '/dashboard';
    
    // Use replace to avoid cluttering browser history
    router.replace(url);
  }, [router, syncToURL]);
  
  const navigateWithState = useCallback((updates: Partial<{
    search: string;
    view: 'all' | 'recent' | 'favorites';
    scoreFilter: 'all' | 'high' | 'medium' | 'low';
    sortBy: 'newest' | 'score' | 'updated';
    viewMode: 'grid' | 'list';
  }>) => {
    // Update store
    Object.entries(updates).forEach(([key, value]) => {
      const setter = `set${key.charAt(0).toUpperCase() + key.slice(1)}` as any;
      const store = useDashboardStore.getState();
      if (store[setter]) {
        store[setter](value);
      }
    });
    
    // Update URL
    updateURL();
  }, [updateURL]);
  
  return {
    updateURL,
    navigateWithState,
  };
};