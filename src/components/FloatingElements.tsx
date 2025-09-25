import React from 'react';

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {}
      <div className="absolute top-20 left-10 w-4 h-4 border border-white/10 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-40 right-20 w-6 h-6 border border-white/5 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 border border-white/15 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-10 w-5 h-5 border border-white/8 animate-float" style={{ animationDelay: '0.5s' }}></div>
      
      {}
      <div className="absolute top-60 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute top-80 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-60 left-1/3 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      
      {}
      <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      <div className="absolute bottom-1/3 right-0 w-24 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default FloatingElements; 