import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, Star, Users, Award, Building, Home, Briefcase, ShoppingBag } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/services';
import ServiceDetailModal from '../components/ServiceDetailModal';
import TestimonialCard from '../components/TestimonialCard';
import ProcessTimeline from '../components/ProcessTimeline';

const Services: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'home' | 'office' | 'retail'>('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredServices = services.filter(service => {
    if (selectedFilter === 'all') return true;
    return service.useCases[selectedFilter as keyof typeof service.useCases];
  });

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsModalOpen(true);
  };

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Homeowner",
      quote: "The interior design service transformed our living space completely. Every detail was thoughtfully considered.",
      rating: 5,
      project: "Modern Family Home"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Owner",
      quote: "Their space planning expertise helped us maximize our office efficiency while maintaining a beautiful aesthetic.",
      rating: 5,
      project: "Tech Startup Office"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Restaurant Owner",
      quote: "The 3D visualization helped us see exactly how our restaurant would look before construction began.",
      rating: 5,
      project: "Urban Bistro"
    }
  ];

  const stats = [
    { value: 200, label: 'Projects Completed', icon: Building },
    { value: 150, label: 'Happy Clients', icon: Users },
    { value: 15, label: 'Years Experience', icon: Award },
    { value: 98, label: 'Satisfaction Rate', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {}
      <section className="hero-section" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg)',
      }}>
        <div className="overlay-dark"></div>
        <div className="text-overlay">
          <div className="container-minimal">
            <div className="max-w-4xl">
              <div className="section-subtitle">
                <AnimatedText text="OUR SERVICES" type="fade-in" />
              </div>
              <h1 className="section-title">
                <AnimatedText text="Comprehensive Design Solutions" type="slide-up" delay={300} />
              </h1>
              <p className="text-xl leading-relaxed mb-12 max-w-2xl text-gray-300">
                <AnimatedText 
                  text="From concept to completion, we provide end-to-end design services that transform spaces and enhance lives."
                  type="slide-up"
                  delay={600}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-minimal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <stat.icon className="h-8 w-8 text-white/60" />
                </div>
                <div className="text-3xl font-light mb-2">{stat.value}+</div>
                <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-light">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-8">
              <AnimatedText text="Our Services" type="slide-up" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              <AnimatedText 
                text="Discover our comprehensive range of design services tailored to your specific needs and project requirements."
                type="slide-up"
                delay={300}
              />
            </p>
          </div>

          {}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { key: 'all', label: 'All Services', icon: Filter },
              { key: 'home', label: 'Residential', icon: Home },
              { key: 'office', label: 'Commercial', icon: Briefcase },
              { key: 'retail', label: 'Retail', icon: ShoppingBag }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`flex items-center gap-2 px-6 py-3 border transition-all duration-300 ${
                  selectedFilter === filter.key
                    ? 'border-white text-white bg-white/10'
                    : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </button>
            ))}
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="cursor-pointer"
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  image={`https://images.pexels.com/photos/${1571460 + index}/pexels-photo-${1571460 + index}.jpeg`}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-minimal">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-8">
              <AnimatedText text="Our Process" type="slide-up" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              <AnimatedText 
                text="A systematic approach to design that ensures every project meets the highest standards of quality and creativity."
                type="slide-up"
                delay={300}
              />
            </p>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      {}
      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-minimal">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-8">
              <AnimatedText text="Client Testimonials" type="slide-up" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              <AnimatedText 
                text="Hear from our satisfied clients about their experience working with our design team."
                type="slide-up"
                delay={300}
              />
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black border-t border-white/10">
        <div className="container-minimal text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-light mb-8">
              <AnimatedText text="Ready to Start Your Project?" type="slide-up" />
            </h2>
            <p className="text-gray-400 mb-12 text-lg">
              <AnimatedText 
                text="Let's discuss how we can bring your vision to life through our comprehensive design services."
                type="slide-up"
                delay={300}
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary group inline-flex items-center justify-center">
                <span>GET IN TOUCH</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/projects" className="btn-secondary group inline-flex items-center justify-center">
                <span>VIEW PROJECTS</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {}
      {selectedService && (
        <ServiceDetailModal
          service={services.find(s => s.id === selectedService)!}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

export default Services; 