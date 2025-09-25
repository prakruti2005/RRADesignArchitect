import { useEffect, useState } from 'react';

interface UseCounterOptions {
  duration?: number;
  delay?: number;
  startValue?: number;
}

export const useCounter = (
  targetValue: number,
  options: UseCounterOptions = {}
) => {
  const { duration = 2000, delay = 0, startValue = 0 } = options;
  const [count, setCount] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startCounter = () => {
    if (hasStarted) return; 
    
    setHasStarted(true);
    setIsAnimating(true);
    const startTime = Date.now();
    const startCount = startValue;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startCount + (targetValue - startCount) * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
        setIsAnimating(false);
      }
    };

    setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);
  };

  
  useEffect(() => {
    setCount(startValue);
    setHasStarted(false);
    setIsAnimating(false);
  }, [targetValue, startValue]);

  return { count, isAnimating, startCounter };
}; 