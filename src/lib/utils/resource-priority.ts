// Resource types that can be prioritized
type ResourceType = 'script' | 'style' | 'image' | 'font' | 'fetch';

// Priority levels
type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | 'lazy';

interface ResourcePriority {
  type: ResourceType;
  url: string;
  priority: PriorityLevel;
  loadAfterInteraction?: boolean;
}

// Map of resources with their priorities
const resourcePriorities: Record<string, ResourcePriority> = {
  // Critical UI resources
  'logo': { type: 'image', url: '/logo.svg', priority: 'critical' },
  'main-css': { type: 'style', url: '/main.css', priority: 'critical' },
  
  // High priority resources
  'dashboard-data': { type: 'fetch', url: '/api/dashboard', priority: 'high' },
  'user-avatar': { type: 'image', url: '/avatar.jpg', priority: 'high' },
  
  // Medium priority
  'chart-library': { type: 'script', url: '/chart.js', priority: 'medium' },
  
  // Low priority
  'analytics': { type: 'script', url: '/analytics.js', priority: 'low', loadAfterInteraction: true },
  
  // Lazy loaded
  'feedback-widget': { type: 'script', url: '/feedback.js', priority: 'lazy', loadAfterInteraction: true },
};

// Helper to get resource priority
export function getResourcePriority(resourceKey: string): ResourcePriority | undefined {
  return resourcePriorities[resourceKey];
}

// Helper to prioritize fetch requests
export async function prioritizedFetch(resourceKey: string, fetchFn: () => Promise<any>) {
  const priority = getResourcePriority(resourceKey);
  
  if (!priority) {
    return fetchFn();
  }
  
  // For critical and high priority, fetch immediately
  if (priority.priority === 'critical' || priority.priority === 'high') {
    return fetchFn();
  }
  
  // For medium priority, use requestIdleCallback if available
  if (priority.priority === 'medium') {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          resolve(fetchFn());
        });
      } else {
        // Fallback to setTimeout
        setTimeout(() => {
          resolve(fetchFn());
        }, 200);
      }
    });
  }
  
  // For low and lazy, defer even more
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      if (priority.loadAfterInteraction) {
        // Load after user interaction
        const handleInteraction = () => {
          window.removeEventListener('scroll', handleInteraction);
          window.removeEventListener('click', handleInteraction);
          window.removeEventListener('keydown', handleInteraction);
          
          setTimeout(() => {
            resolve(fetchFn());
          }, 500);
        };
        
        window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
      } else {
        // Just defer with a longer timeout
        setTimeout(() => {
          resolve(fetchFn());
        }, priority.priority === 'low' ? 500 : 1000);
      }
    } else {
      resolve(fetchFn());
    }
  });
} 