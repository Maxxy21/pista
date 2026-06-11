// src/components/shared/landing/components/use-count-up.ts
import { animate } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animates a number from 0 up to `target`.
 * Pass `start=false` to defer (e.g. until scrolled into view).
 */
export function useCountUp(target: number, start = true, duration = 1.1) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      setValue(0);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [target, start, duration]);

  return value;
}
