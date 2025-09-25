import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { db } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Project } from '../types';
import { toProjectForm } from '../components/ProjectEditor';

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'residential' | 'commercial'>('residential');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setLoading(true);
    const ref = collection(db, 'projects');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows = snap.docs.map((d) => {
          const form = toProjectForm({ id: d.id, ...d.data() } as any);
          return { id: d.id, ...form } as Project;
        });
        setProjects(rows);
        setLoading(false);
      },
      () => {
        setError('Failed to load projects.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = project.type === selectedCategory;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.city.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
    setIsModalOpen(true);
  };

  const stats = {
    residential: projects.filter(p => p.type === 'residential').length,
    commercial: projects.filter(p => p.type === 'commercial').length,
  };

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
                <AnimatedText text="OUR PORTFOLIO" type="fade-in" />
              </div>
              <h1 className="section-title">
                <AnimatedText text="Featured Projects" type="slide-up" delay={300} />
              </h1>
              <p className="text-xl leading-relaxed mb-12 max-w-2xl text-gray-300">
                <AnimatedText 
                  text="Explore our diverse portfolio of completed projects across residential, commercial, and retail sectors."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light mb-2">{stats.residential}</div>
              <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-light">Residential</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light mb-2">{stats.commercial}</div>
              <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-light">Commercial</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light mb-2">{stats.residential + stats.commercial}</div>
              <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-light">Total Shown</p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="section-padding bg-black">
        <div className="container-minimal">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-8">
              <AnimatedText text="Browse Projects" type="slide-up" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              <AnimatedText 
                text="Discover our portfolio of innovative design solutions across different project types and locations."
                type="slide-up"
                delay={300}
              />
            </p>
          </div>

          {error && (
            <div className="text-center text-red-300 mb-6 text-sm">{error}</div>
          )}

          {}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-none px-12 py-4 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { key: 'residential', label: 'Residential' },
              { key: 'commercial', label: 'Commercial' }
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key as any)}
                className={`flex items-center gap-2 px-6 py-3 border transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'border-white text-white bg-white/10'
                    : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
                }`}
              >
                <Filter className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>

          {}
          {loading ? (
            <div className="text-center py-16 text-white/70">Loading projects…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={handleProjectClick}
                />
              ))}
            </div>
          )}

          {}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No projects found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('residential');
                  setSearchTerm('');
                }}
                className="btn-primary group inline-flex items-center justify-center"
              >
                <span>RESET FILTERS</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
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
                text="Let's discuss how we can bring your vision to life through innovative design and expert execution."
                type="slide-up"
                delay={300}
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary group inline-flex items-center justify-center">
                <span>GET IN TOUCH</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <button className="btn-secondary group inline-flex items-center justify-center">
                <span>VIEW SERVICES</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {}
    {selectedProject && (
        <ProjectDetailModal
      project={projects.find(p => p.id === selectedProject) || null}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

export default Projects; 