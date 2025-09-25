import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { elementRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`relative minimal-card group cursor-pointer transition-all duration-1000 hover-lift hover-glow ${
        hasTriggered 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${index * 200}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-container mb-6 relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-40 sm:h-48 object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className={`image-overlay transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}></div>
        
        {}
  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-4 right-4">
            <div className={`text-white transition-all duration-500 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <p className="text-sm font-light">Learn more about our {title.toLowerCase()} services</p>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className={`text-xl font-light mb-4 transition-all duration-500 ${
        isHovered ? 'text-white' : 'text-gray-300'
      }`}>
        {title}
      </h3>
      
      <p className={`text-gray-400 text-sm leading-relaxed transition-all duration-500 ${
        isHovered ? 'text-gray-300' : 'text-gray-400'
      }`}>
        {description}
      </p>
      
      {}
      <div className={`absolute inset-0 border border-white/5 transition-all duration-500 ${
        isHovered ? 'border-white/20' : 'border-white/5'
      }`}></div>
    </div>
  );
};

export default ServiceCard; 