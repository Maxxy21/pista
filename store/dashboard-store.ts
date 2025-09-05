// store/dashboard-store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

export interface DashboardFilters {
  search: string;
  view: 'all' | 'recent' | 'favorites';
  scoreFilter: 'all' | 'high' | 'medium' | 'low';
  sortBy: 'newest' | 'score' | 'updated';
  viewMode: 'grid' | 'list';
}

export interface DashboardState extends DashboardFilters {
  // Actions
  setSearch: (search: string) => void;
  setView: (view: DashboardFilters['view']) => void;
  setScoreFilter: (filter: DashboardFilters['scoreFilter']) => void;
  setSortBy: (sortBy: DashboardFilters['sortBy']) => void;
  setViewMode: (mode: DashboardFilters['viewMode']) => void;
  
  // Computed values
  getScoreRange: () => { min: number; max: number };
  getQueryParams: (orgId?: string) => any;
  
  // Utilities
  reset: () => void;
  syncFromURL: (searchParams: URLSearchParams) => void;
  syncToURL: () => URLSearchParams;
}

const initialState: DashboardFilters = {
  search: '',
  view: 'all',
  scoreFilter: 'all',
  sortBy: 'newest',
  viewMode: 'grid',
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setSearch: (search) => set({ search }, false, 'setSearch'),
        setView: (view) => set({ view }, false, 'setView'),
        setScoreFilter: (scoreFilter) => set({ scoreFilter }, false, 'setScoreFilter'),
        setSortBy: (sortBy) => set({ sortBy }, false, 'setSortBy'),
        setViewMode: (viewMode) => set({ viewMode }, false, 'setViewMode'),

        // Computed values
        getScoreRange: () => {
          const { scoreFilter } = get();
          switch (scoreFilter) {
            case 'high':
              return { min: 8, max: 10 };
            case 'medium':
              return { min: 5, max: 7.9 };
            case 'low':
              return { min: 0, max: 4.9 };
            default:
              return { min: 0, max: 10 };
          }
        },

        getQueryParams: (orgId) => {
          if (!orgId) return 'skip';
          
          const state = get();
          return {
            orgId,
            search: state.search || undefined,
            favorites: state.view === 'favorites',
            sortBy: (state.view === 'recent' ? 'date' : 
                     state.sortBy === 'newest' ? 'date' : 'score') as 'score' | 'date',
            scoreRange: state.getScoreRange(),
          };
        },

        // Utilities
        reset: () => set(initialState, false, 'reset'),
        
        syncFromURL: (searchParams) => {
          const updates: Partial<DashboardFilters> = {};
          
          const search = searchParams.get('search');
          if (search !== null) updates.search = search;
          
          const view = searchParams.get('view') as DashboardFilters['view'];
          if (view && ['all', 'recent', 'favorites'].includes(view)) {
            updates.view = view;
          }
          
          const scoreFilter = searchParams.get('scoreFilter') as DashboardFilters['scoreFilter'];
          if (scoreFilter && ['all', 'high', 'medium', 'low'].includes(scoreFilter)) {
            updates.scoreFilter = scoreFilter;
          }
          
          const sortBy = searchParams.get('sortBy') as DashboardFilters['sortBy'];
          if (sortBy && ['newest', 'score', 'updated'].includes(sortBy)) {
            updates.sortBy = sortBy;
          }
          
          const viewMode = searchParams.get('viewMode') as DashboardFilters['viewMode'];
          if (viewMode && ['grid', 'list'].includes(viewMode)) {
            updates.viewMode = viewMode;
          }
          
          if (Object.keys(updates).length > 0) {
            set(updates, false, 'syncFromURL');
          }
        },
        
        syncToURL: () => {
          const state = get();
          const params = new URLSearchParams();
          
          if (state.search) params.set('search', state.search);
          if (state.view !== 'all') params.set('view', state.view);
          if (state.scoreFilter !== 'all') params.set('scoreFilter', state.scoreFilter);
          if (state.sortBy !== 'newest') params.set('sortBy', state.sortBy);
          if (state.viewMode !== 'grid') params.set('viewMode', state.viewMode);
          
          return params;
        },
      }),
      {
        name: 'dashboard-state',
        partialize: (state) => ({
          // Only persist preferences, not search/filters
          viewMode: state.viewMode,
          sortBy: state.sortBy,
        }),
      }
    ),
    {
      name: 'DashboardStore',
    }
  )
);

// Simple type-safe store access - components can destructure what they need