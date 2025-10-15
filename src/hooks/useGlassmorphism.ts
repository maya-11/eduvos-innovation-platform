import { useRef, useEffect } from 'react';

export const useGlassmorphism = (intensity = 10) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.style.backdropFilter = `blur(${intensity}px)`;
    element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  }, [intensity]);

  return ref;
};
