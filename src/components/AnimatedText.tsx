import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  type?: 'typewriter' | 'fade-in' | 'slide-up';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  speed = 50,
  type = 'fade-in'
}) => {
  const [displayText, setDisplayText] = useState(type === 'typewriter' ? '' : text);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { elementRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (!hasTriggered) return;

    let typeTimer: NodeJS.Timeout | null = null;
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      if (type === 'typewriter') {
        setDisplayText('');
        setCurrentIndex(0);
        
        let currentChar = 0;
        typeTimer = setInterval(() => {
          if (currentChar < text.length) {
            setDisplayText(text.slice(0, currentChar + 1));
            currentChar++;
          } else {
            if (typeTimer) clearInterval(typeTimer);
          }
        }, speed);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      if (typeTimer) clearInterval(typeTimer);
    };
  }, [hasTriggered, delay, type, text, speed]);

  const getAnimationClass = () => {
    if (!hasTriggered) return 'opacity-0';
    
    switch (type) {
      case 'typewriter':
        return 'opacity-100';
      case 'fade-in':
        return isAnimating ? 'opacity-100 animate-fade-in' : 'opacity-0';
      case 'slide-up':
        return isAnimating ? 'opacity-100 animate-slide-up' : 'opacity-0 translate-y-8';
      default:
        return 'opacity-100';
    }
  };

  
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasTriggered) {
        setIsAnimating(true);
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [hasTriggered]);

  return (
    <span
      ref={elementRef}
      className={`transition-all duration-1000 ${getAnimationClass()} ${className}`}
      style={{ whiteSpace: 'pre-wrap', overflow: 'hidden' }}
    >
      {type === 'typewriter' ? (displayText || text) : text}
    </span>
  );
};

export default AnimatedText; 