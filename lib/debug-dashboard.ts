// lib/debug-dashboard.ts
// Debug utility to track dashboard re-renders and requests

let renderCount = 0;
let queryCount = 0;

export const debugDashboard = {
  logRender: (component: string, props?: any) => {
    renderCount++;
    console.log(`🔄 [${renderCount}] ${component} render:`, {
      timestamp: Date.now(),
      props: props ? Object.keys(props) : 'none'
    });
  },
  
  logQuery: (queryName: string, params?: any) => {
    queryCount++;
    console.log(`📡 [${queryCount}] Query ${queryName}:`, {
      timestamp: Date.now(),
      params
    });
  },
  
  logNavigation: (from: string, to: string, reason?: string) => {
    console.log(`🧭 Navigation ${from} -> ${to}:`, {
      timestamp: Date.now(),
      reason
    });
  },
  
  reset: () => {
    renderCount = 0;
    queryCount = 0;
    console.log('🔄 Debug counters reset');
  },
  
  getStats: () => ({
    renders: renderCount,
    queries: queryCount
  })
};

// Only enable in development
export const isDev = process.env.NODE_ENV === 'development';