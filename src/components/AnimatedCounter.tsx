import React, { useEffect } from 'react';
import { useCounter } from '../hooks/useCounter';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  delay?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  className = '',
  duration = 2000,
  delay = 0
}) => {
  const { count, startCounter } = useCounter(value, { duration, delay });
  const { elementRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (hasTriggered) {
      
      const timer = setTimeout(() => {
        startCounter();
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [hasTriggered, startCounter, delay]);

  
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasTriggered) {
        
        startCounter();
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [hasTriggered, startCounter]);

  return (
    <span
      ref={elementRef as React.RefObject<HTMLSpanElement>}
      className={`inline-block ${className}`}
    >
      {prefix}{count || value}{suffix}
    </span>
  );
};

export default AnimatedCounter; 