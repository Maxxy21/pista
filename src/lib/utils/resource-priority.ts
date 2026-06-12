type ResourceType = 'script' | 'style' | 'image' | 'font' | 'fetch';

type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | 'lazy';

interface ResourcePriority {
  type: ResourceType;
  url: string;
  priority: PriorityLevel;
  loadAfterInteraction?: boolean;
}

const resourcePriorities: Record<string, ResourcePriority> = {
  'logo': { type: 'image', url: '/logo.svg', priority: 'critical' },
  'main-css': { type: 'style', url: '/main.css', priority: 'critical' },
  'dashboard-data': { type: 'fetch', url: '/api/dashboard', priority: 'high' },
  'user-avatar': { type: 'image', url: '/avatar.jpg', priority: 'high' },
  'chart-library': { type: 'script', url: '/chart.js', priority: 'medium' },
  'analytics': { type: 'script', url: '/analytics.js', priority: 'low', loadAfterInteraction: true },
  'feedback-widget': { type: 'script', url: '/feedback.js', priority: 'lazy', loadAfterInteraction: true },
};

export function getResourcePriority(resourceKey: string): ResourcePriority | undefined {
  return resourcePriorities[resourceKey];
}
