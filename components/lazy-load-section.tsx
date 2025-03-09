import React from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { motion } from 'framer-motion';
import { useOptimizedAnimations } from '@/hooks/use-optimized-animations';

interface LazyLoadSectionProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  className?: string;
  animationVariant?: 'fadeIn' | 'slideUp' | 'scale';
  delay?: number;
}

export function LazyLoadSection({
  children,
  placeholder,
  className,
  animationVariant = 'fadeIn',
  delay = 0
}: LazyLoadSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '100px',
    triggerOnce: true
  });
  
  const { animations, durations } = useOptimizedAnimations();
  const selectedAnimation = animations[animationVariant];
  
  return (
    <div ref={ref} className={className}>
      {isIntersecting ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={selectedAnimation}
          transition={{ delay }}
        >
          {children}
        </motion.div>
      ) : (
        placeholder || <div className="min-h-[100px]" />
      )}
    </div>
  );
} 