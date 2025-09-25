import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, DollarSign, Check, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !project) return null;

  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : [];
  const hasGallery = images.length > 0;
  const PLACEHOLDER_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial, Helvetica, sans-serif" font-size="24">No image</text></svg>`
    );

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-black border border-white/10 max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          {}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-light mb-4">{project.title}</h2>
              <p className="text-gray-400 text-lg">{project.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {}
          <div className="mb-8">
            <div className="relative bg-black/40 rounded-lg flex items-center justify-center overflow-hidden max-h-[70vh]">
              <img
                src={hasGallery ? images[currentImageIndex] : PLACEHOLDER_IMG}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="max-h-[70vh] w-auto max-w-full object-contain transition-opacity duration-300"/>
              
              {}
              {hasGallery && images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors duration-300"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors duration-300"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {}
              {hasGallery && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {}
            {hasGallery && images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((image, index) => {
                  const active = index === currentImageIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors duration-300 relative ${active ? 'border-white' : 'border-white/20 hover:border-white/40'}`}
                      aria-label={`Show image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-contain bg-black/50"
                      />
                      {active && <span className="absolute inset-0 ring-2 ring-white/50 pointer-events-none" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {}
            <div>
              <h3 className="text-xl font-light mb-4">Project Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-white/60" />
                  <span>{[project.location?.city, project.location?.neighborhood].filter(Boolean).join(', ') || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="h-5 w-5 text-white/60" />
                  <span>Completed {project.completionDate || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <DollarSign className="h-5 w-5 text-white/60" />
                  <span>Budget: {project.budget || '—'}</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-white/60">Area:</span> {project.area || '—'} sq ft
                </div>
                <div className="text-gray-300">
                  <span className="text-white/60">Type:</span> {project.type ? project.type.charAt(0).toUpperCase() + project.type.slice(1) : '—'}
                </div>
              </div>
            </div>

            {}
            <div>
              <h3 className="text-xl font-light mb-4">Materials Used</h3>
              <div className="space-y-3">
                {(project.materials ?? []).length === 0 && (
                  <div className="text-white/50 text-sm">No materials listed.</div>
                )}
                {(project.materials ?? []).map((material) => (
                  <div key={material.id} className="flex justify-between items-center p-3 border border-white/10 rounded-lg">
                    <div>
                      <div className="text-white font-light">{material.name || '—'}</div>
                      <div className="text-gray-400 text-sm capitalize">{material.category || '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300 text-sm">{material.cost || '—'}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        material.sustainability === 'high' ? 'bg-green-500/20 text-green-400' :
                        material.sustainability === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        material.sustainability === 'low' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'
                      }`}>
                        {material.sustainability ? `${material.sustainability} sustainability` : '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="mb-8">
            <h3 className="text-xl font-light mb-6">Transformation Process</h3>
            <div className="space-y-6">
              {(project.transformationLog ?? []).length === 0 && (
                <div className="text-white/50 text-sm">No steps to show.</div>
              )}
              {(project.transformationLog ?? []).map((step) => (
                <div key={step.step} className="border border-white/10 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-light">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-light mb-2">{step.title}</h4>
                      <p className="text-gray-300 mb-4">{step.description}</p>
                      <div className="text-sm text-gray-400 mb-2">Date: {step.date || '—'}</div>
                      
                      {}
                      <div className="mb-4">
                        <h5 className="text-white/80 mb-2">Challenges:</h5>
                        <ul className="space-y-1">
                          {(step.challenges ?? []).map((challenge, idx) => (
                            <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {}
                      <div>
                        <h5 className="text-white/80 mb-2">Solutions:</h5>
                        <ul className="space-y-1">
                          {(step.solutions ?? []).map((solution, idx) => (
                            <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                              <Check className="h-3 w-3 text-green-400 mt-1 flex-shrink-0" />
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="mb-8 p-6 border border-white/10 rounded-lg bg-white/5">
            <h3 className="text-xl font-light mb-4">Client Testimonial</h3>
            <blockquote className="text-gray-300 italic mb-4 text-lg">
              "{project.testimonial.quote}"
            </blockquote>
            <div className="text-white font-light">- {project.testimonial.client}</div>
          </div>

          {}
          <div className="border-t border-white/10 pt-8">
            <div className="text-center">
              <p className="text-gray-400 mb-6">
                Inspired by this project? Let's create something amazing together.
              </p>
              <button
                onClick={onClose}
                className="btn-primary group inline-flex items-center justify-center"
              >
                <span>START YOUR PROJECT</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal; 