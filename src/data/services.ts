import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'interior-design',
    title: 'Complete Interior Design',
    description: 'End-to-end interior design services that transform spaces into functional, beautiful environments.',
    why: 'Your space should reflect your personality while serving your daily needs. Great design isn\'t just about aesthetics—it\'s about creating environments that enhance your life and work.',
    how: 'We start with deep listening, conduct thorough space analysis, develop concepts through collaborative mood boarding, and execute with meticulous attention to detail and quality craftsmanship.',
    useCases: {
      home: true,
      office: true,
      retail: true
    },
    relatedProjectIds: ['cedar hospital', 'Kavira Office']
  },
  {
    id: '3d-visualization',
    title: '3D Visualization & Rendering',
    description: 'Photorealistic 3D renders and virtual walkthroughs that bring your design vision to life.',
    why: 'Visualization eliminates guesswork and uncertainty. See exactly how your space will look and feel before any construction begins, ensuring confidence in every design decision.',
    how: 'Using advanced rendering software, we create detailed 3D models of your space, apply realistic materials and lighting, and generate high-resolution images and interactive walkthroughs.',
    useCases: {
      home: true,
      office: true,
      retail: true
    },
    relatedProjectIds: ['Raghuvir Scarlett office']
  },
  {
    id: 'space-planning',
    title: 'Strategic Space Planning',
    description: 'Intelligent space optimization that maximizes functionality while maintaining aesthetic appeal.',
    why: 'Good space planning is the foundation of great design. Proper flow, proportions, and functionality determine whether a space truly works for its inhabitants.',
    how: 'We analyze traffic patterns, study user behavior, measure spatial relationships, and create detailed floor plans that optimize every square foot for its intended purpose.',
    useCases: {
      home: true,
      office: true,
      retail: false
    },
    relatedProjectIds: ['Avadh Kontina CA office']
  },
  {
    id: 'material-consultation',
    title: 'Material & Finish Consultation',
    description: 'Expert guidance on selecting materials that balance aesthetics, durability, and sustainability.',
    why: 'Materials define the character and longevity of your space. The right choices enhance both beauty and performance while supporting your values and budget.',
    how: 'We maintain extensive material libraries, conduct performance testing, evaluate sustainability credentials, and provide detailed specifications with cost analysis.',
    useCases: {
      home: true,
      office: true,
      retail: true
    },
    relatedProjectIds: ['Atlanta Eliza']
  }
];