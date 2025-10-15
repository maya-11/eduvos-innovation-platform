// src/hooks/useAnimation.ts - UPDATED
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const useAnimation = (threshold: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return {
    ref,
    isInView,
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: "easeOut" as const } // FIX: Type assertion
  };
};

export const useStaggerAnimation = (count: number, threshold: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const getStaggerProps = (index: number) => ({
    ref,
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { 
      duration: 0.5, 
      ease: "easeOut" as const, // FIX: Type assertion
      delay: index * 0.1 
    }
  });

  return getStaggerProps;
};