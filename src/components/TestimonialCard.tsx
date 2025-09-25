import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  project: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  index
}) => {
  const { elementRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`minimal-card group transition-all duration-1000 ${
        hasTriggered 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${index * 200}ms`
      }}
    >
      {}
      <div className="mb-6">
        <Quote className="h-8 w-8 text-white/20" />
      </div>

      {}
      <div className="flex gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {}
      <blockquote className="text-gray-300 mb-8 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>

      {}
      <div className="border-t border-white/10 pt-6">
        <div className="font-light text-white mb-1">{testimonial.name}</div>
        <div className="text-gray-400 text-sm mb-2">{testimonial.role}</div>
        <div className="text-gray-500 text-xs tracking-[0.1em] uppercase">
          {testimonial.project}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 