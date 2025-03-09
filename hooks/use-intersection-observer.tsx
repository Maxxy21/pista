import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends Element>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = false
}: IntersectionObserverOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const node = ref.current;
    
    // If the element doesn't exist or we've already triggered once and seen it, return
    if (!node || (triggerOnce && isIntersecting)) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );
    
    observer.observe(node);
    
    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce, isIntersecting]);
  
  return [ref, isIntersecting];
} 