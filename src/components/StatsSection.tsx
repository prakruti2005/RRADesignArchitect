import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import AnimatedCounter from './AnimatedCounter';

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsSectionProps {
  stats: StatItem[];
  title?: string;
  subtitle?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  title = "Our Impact",
  subtitle = "NUMBERS THAT MATTER"
}) => {
  const { elementRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <section className="section-padding bg-black border-t border-white/10">
      <div className="container-minimal">
        <div
          ref={elementRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-20 transition-all duration-1000 ${
            hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="section-subtitle">{subtitle}</div>
          <h2 className="text-5xl font-light">{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-1000 ${
                hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              <div className="mb-4">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-5xl font-light text-white"
                  delay={index * 300}
                />
              </div>
              <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-light">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 