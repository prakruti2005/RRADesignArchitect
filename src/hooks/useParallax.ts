import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'down' } = options;
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      const newOffset = direction === 'up' ? -rate : rate;
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { elementRef, offset };
}; 