import { useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

export function useOptimizedAnimations() {
  const prefersReducedMotion = useReducedMotion();
  
  const animations = useMemo(() => {
    // Base animations
    const baseAnimations = {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
      },
      slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      },
      staggerChildren: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      },
      scale: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
      }
    };
    
    // If user prefers reduced motion, simplify animations
    if (prefersReducedMotion) {
      return {
        ...baseAnimations,
        // Override with simpler animations
        slideUp: baseAnimations.fadeIn,
        scale: baseAnimations.fadeIn,
        // Reduce stagger time
        staggerChildren: {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }
      };
    }
    
    return baseAnimations;
  }, [prefersReducedMotion]);
  
  // Animation durations
  const durations = useMemo(() => ({
    fast: prefersReducedMotion ? 0.1 : 0.2,
    medium: prefersReducedMotion ? 0.2 : 0.5,
    slow: prefersReducedMotion ? 0.3 : 0.8
  }), [prefersReducedMotion]);
  
  return {
    animations,
    durations,
    prefersReducedMotion
  };
} 