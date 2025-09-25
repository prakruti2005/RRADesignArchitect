import React from 'react';
import { MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onClick
}) => {
  const { elementRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  const PLACEHOLDER_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial, Helvetica, sans-serif" font-size="20">No image</text></svg>`
    );

  const cover = project.images && project.images.length > 0 ? project.images[0] : PLACEHOLDER_IMG;
  const locationText = [project.location?.city, project.location?.neighborhood]
    .filter(Boolean)
    .join(', ') || '—';
  const completion = project.completionDate || '—';
  const budget = project.budget || '—';

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`minimal-card group cursor-pointer transition-all duration-1000 hover:scale-105 ${
        hasTriggered 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${index * 200}ms`
      }}
      onClick={() => onClick(project.id)}
    >
      {}
    <div className="relative overflow-hidden rounded-lg mb-6">
        <img
      src={cover}
          alt={project.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs tracking-[0.2em] uppercase rounded-full">
            {project.type}
          </span>
        </div>

        {}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 text-white">
            <span className="text-sm tracking-[0.2em] uppercase">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {}
      <div className="space-y-4">
        <h3 className="text-xl font-light text-white group-hover:text-gray-300 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed">
          {project.description}
        </p>

        {}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{locationText}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{completion}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>{budget}</span>
          </div>
        </div>

        {}
  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
          <div>
            <div className="text-lg font-light text-white">{project.area} sq ft</div>
            <div className="text-xs text-gray-500 uppercase tracking-[0.2em]">Area</div>
          </div>
          <div>
            <div className="text-lg font-light text-white">{project.materials?.length ?? 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-[0.2em]">Materials</div>
          </div>
          <div>
            <div className="text-lg font-light text-white">{project.transformationLog?.length ?? 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-[0.2em]">Steps</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 