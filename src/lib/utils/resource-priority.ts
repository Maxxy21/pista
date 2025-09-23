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
