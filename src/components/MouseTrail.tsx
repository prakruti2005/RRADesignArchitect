import React, { useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
  id: number;
}

const MouseTrail: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  
  const isTouchOrSmall = typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || window.matchMedia?.('(max-width: 767px)').matches);

  useEffect(() => {
    let pointId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: Point = {
        x: e.clientX,
        y: e.clientY,
        id: pointId++
      };

      setPoints(prev => [...prev.slice(-5), newPoint]); 
    };

    if (!isTouchOrSmall) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
    return () => {};
  }, [isTouchOrSmall]);

  if (isTouchOrSmall) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {points.map((point, index) => (
        <div
          key={point.id}
          className="absolute w-1 h-1 bg-white/30 rounded-full transition-all duration-300"
          style={{
            left: point.x,
            top: point.y,
            transform: `scale(${1 - index * 0.2})`,
            opacity: 1 - index * 0.2
          }}
        />
      ))}
    </div>
  );
};

export default MouseTrail; 