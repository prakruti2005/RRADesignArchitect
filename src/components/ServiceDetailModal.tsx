import React from 'react';
import { Link } from 'react-router-dom';
import { X, Check, Home, Briefcase, ShoppingBag } from 'lucide-react';
import { Service } from '../types';

interface ServiceDetailModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const useCaseIcons = {
    home: Home,
    office: Briefcase,
    retail: ShoppingBag
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-black border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          {}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-light mb-4">{service.title}</h2>
              <p className="text-gray-400 text-lg">{service.description}</p>
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
            <h3 className="text-xl font-light mb-4">Suitable For</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(service.useCases).map(([key, value]) => {
                if (!value) return null;
                const Icon = useCaseIcons[key as keyof typeof useCaseIcons];
                return (
                  <div key={key} className="flex items-center gap-2 text-gray-300">
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{key}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {}
          <div className="mb-8">
            <h3 className="text-xl font-light mb-4">Why Choose This Service</h3>
            <p className="text-gray-300 leading-relaxed">{service.why}</p>
          </div>

          {}
          <div className="mb-8">
            <h3 className="text-xl font-light mb-4">How We Work</h3>
            <p className="text-gray-300 leading-relaxed">{service.how}</p>
          </div>

          {}
          {service.relatedProjectIds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-light mb-4">Related Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.relatedProjectIds.map((projectId) => (
                  <div key={projectId} className="border border-white/10 p-4">
                    <h4 className="font-light mb-2 capitalize">
                      {projectId.replace('-', ' ')}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      View project details and see this service in action.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="border-t border-white/10 pt-8">
            <div className="text-center">
              <p className="text-gray-400 mb-6">
                Ready to get started with {service.title.toLowerCase()}?
              </p>
              <Link to="/contact" className="btn-primary group inline-flex items-center justify-center" onClick={onClose}>
                <span>GET IN TOUCH</span>
                <Check className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 