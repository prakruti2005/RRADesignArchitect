import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ProcessTimeline: React.FC = () => {
  const { elementRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  const steps = [
    {
      number: '01',
      title: 'Discovery & Consultation',
      description: 'We begin with a comprehensive consultation to understand your vision, needs, and project requirements.',
      details: ['Initial meeting', 'Requirements gathering', 'Budget discussion', 'Timeline planning']
    },
    {
      number: '02',
      title: 'Concept Development',
      description: 'Our design team creates initial concepts and mood boards that align with your vision and functional needs.',
      details: ['Mood board creation', 'Concept sketches', 'Material selection', 'Color palette development']
    },
    {
      number: '03',
      title: 'Design & Planning',
      description: 'Detailed design development including space planning, 3D visualizations, and technical specifications.',
      details: ['Space planning', '3D modeling', 'Technical drawings', 'Material specifications']
    },
    {
      number: '04',
      title: 'Implementation',
      description: 'Professional execution of the design with careful attention to detail and quality craftsmanship.',
      details: ['Project management', 'Quality control', 'Timeline management', 'Client communication']
    },
    {
      number: '05',
      title: 'Completion & Handover',
      description: 'Final walkthrough, documentation, and ongoing support to ensure your complete satisfaction.',
      details: ['Final inspection', 'Documentation', 'Warranty information', 'Ongoing support']
    }
  ];

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-1000 ${
        hasTriggered ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative timeline-container">
        {}
        <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-px timeline-line"></div>
        
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {}
              <div className="absolute left-2 lg:left-6 top-0 w-3 h-3 lg:w-4 lg:h-4 bg-white rounded-full border-2 lg:border-4 border-black lg:block timeline-dot-mobile"></div>
              
              <div className={`ml-8 lg:ml-24 transition-all duration-1000 ${
                hasTriggered ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0'
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}>
                {}
                <div className="text-4xl lg:text-6xl font-extralight text-white/20 mb-4 timeline-step-number">
                  {step.number}
                </div>
                
                {}
                <div className="minimal-card">
                  <h3 className="text-2xl font-light mb-4">{step.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessTimeline; 