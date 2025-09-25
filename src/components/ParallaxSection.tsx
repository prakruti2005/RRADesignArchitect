import React from 'react';
import { useParallax } from '../hooks/useParallax';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  direction = 'down',
  className = ''
}) => {
  const { elementRef, offset } = useParallax({ speed, direction });

  
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  const y = prefersReducedMotion || isSmallScreen ? 0 : offset;

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`transform transition-transform duration-100 ${className}`}
      style={{
        transform: `translateY(${y}px)`
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxSection; 