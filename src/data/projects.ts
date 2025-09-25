import { Project } from '../types';

export const projects: Project[] = [
  
  {
    id: 'sakura-bungalow',
    title: 'Sakura Bungalow',
    location: {
      city: 'Tokyo',
      neighborhood: 'Shibuya'
    },
    type: 'residential',
    area: 2800,
    completionDate: '2024-03-15',
    description: 'A modern Japanese-inspired bungalow featuring minimalist design, natural materials, and seamless indoor-outdoor living spaces.',
    transformationLog: [
      {
        step: 1,
        title: 'Site Analysis & Planning',
        description: 'Comprehensive site survey and zoning analysis for optimal space utilization.',
        date: '2023-09-01',
        challenges: ['Limited plot size', 'Zoning restrictions'],
        solutions: ['Vertical space optimization', 'Creative zoning compliance']
      },
      {
        step: 2,
        title: 'Design Development',
        description: 'Creation of detailed architectural plans and 3D visualizations.',
        date: '2023-10-15',
        challenges: ['Balancing traditional and modern elements'],
        solutions: ['Fusion design approach', 'Material harmony']
      },
      {
        step: 3,
        title: 'Construction & Finishing',
        description: 'Expert craftsmanship and premium material installation.',
        date: '2024-02-20',
        challenges: ['Material sourcing', 'Weather delays'],
        solutions: ['Local supplier network', 'Flexible timeline management']
      }
    ],
    materials: [
      {
        id: 'mat-001',
        name: 'Bamboo Flooring',
        category: 'wood',
        source: 'Local Bamboo Co.',
        cost: '$45/sqft',
        sustainability: 'high'
      },
      {
        id: 'mat-002',
        name: 'Recycled Glass Tiles',
        category: 'glass',
        source: 'EcoGlass Solutions',
        cost: '$28/sqft',
        sustainability: 'high'
      }
    ],
    testimonial: {
      client: 'Yuki Tanaka',
      quote: 'The Sakura Bungalow perfectly captures the essence of modern Japanese living while maintaining the warmth of traditional design.'
    },
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg',
      'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg'
    ],
    budget: '$450,000'
  },
  {
    id: 'modern-family-home',
    title: 'Modern Family Home',
    location: {
      city: 'San Francisco',
      neighborhood: 'Pacific Heights'
    },
    type: 'residential',
    area: 4200,
    completionDate: '2024-01-20',
    description: 'A contemporary family residence featuring open-concept living, smart home technology, and sustainable design principles.',
    transformationLog: [
      {
        step: 1,
        title: 'Family Needs Assessment',
        description: 'In-depth consultation to understand family dynamics and lifestyle requirements.',
        date: '2023-06-10',
        challenges: ['Diverse family needs', 'Future-proofing requirements'],
        solutions: ['Flexible space design', 'Modular furniture systems']
      },
      {
        step: 2,
        title: 'Smart Home Integration',
        description: 'Implementation of cutting-edge smart home technology and automation systems.',
        date: '2023-08-05',
        challenges: ['Technology integration complexity'],
        solutions: ['Expert system design', 'User-friendly interfaces']
      }
    ],
    materials: [
      {
        id: 'mat-003',
        name: 'Reclaimed Oak',
        category: 'wood',
        source: 'Heritage Woods',
        cost: '$65/sqft',
        sustainability: 'high'
      },
      {
        id: 'mat-004',
        name: 'Low-VOC Paint',
        category: 'paint',
        source: 'EcoPaint Pro',
        cost: '$35/gallon',
        sustainability: 'high'
      }
    ],
    testimonial: {
      client: 'Sarah Johnson',
      quote: 'Our new home perfectly balances modern aesthetics with family functionality. Every detail was thoughtfully considered.'
    },
    images: [
      'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg',
      'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg',
      'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg'
    ],
    budget: '$680,000'
  },
  {
    id: 'luxury-penthouse',
    title: 'Luxury Penthouse',
    location: {
      city: 'New York',
      neighborhood: 'Manhattan'
    },
    type: 'residential',
    area: 3500,
    completionDate: '2024-02-10',
    description: 'An ultra-luxurious penthouse featuring panoramic city views, premium finishes, and sophisticated design elements.',
    transformationLog: [
      {
        step: 1,
        title: 'Luxury Material Selection',
        description: 'Curated selection of premium materials and finishes for ultimate luxury experience.',
        date: '2023-11-01',
        challenges: ['Premium material availability', 'Custom fabrication requirements'],
        solutions: ['International sourcing', 'Artisan partnerships']
      },
      {
        step: 2,
        title: 'Custom Furniture Design',
        description: 'Bespoke furniture and lighting design to complement the architectural features.',
        date: '2024-01-15',
        challenges: ['Custom design complexity'],
        solutions: ['Expert craftsmanship', 'Quality control protocols']
      }
    ],
    materials: [
      {
        id: 'mat-005',
        name: 'Italian Marble',
        category: 'stone',
        source: 'Carrara Marble Co.',
        cost: '$120/sqft',
        sustainability: 'medium'
      },
      {
        id: 'mat-006',
        name: 'Brass Accents',
        category: 'metal',
        source: 'Heritage Metals',
        cost: '$85/sqft',
        sustainability: 'medium'
      }
    ],
    testimonial: {
      client: 'Michael Chen',
      quote: 'The penthouse transformation exceeded our expectations. The attention to detail and luxury finishes are exceptional.'
    },
    images: [
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg',
      'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg'
    ],
    budget: '$1,200,000'
  },

  
  {
    id: 'tech-startup-office',
    title: 'Tech Startup Office',
    location: {
      city: 'Austin',
      neighborhood: 'Downtown'
    },
    type: 'commercial',
    area: 8500,
    completionDate: '2024-01-15',
    description: 'A dynamic workspace designed for a growing tech startup, featuring collaborative areas, private offices, and innovative amenities.',
    transformationLog: [
      {
        step: 1,
        title: 'Workplace Strategy',
        description: 'Analysis of team dynamics and workflow requirements for optimal space planning.',
        date: '2023-07-20',
        challenges: ['Rapid team growth', 'Flexible workspace needs'],
        solutions: ['Modular design approach', 'Scalable infrastructure']
      },
      {
        step: 2,
        title: 'Technology Integration',
        description: 'Implementation of advanced AV systems and smart building technology.',
        date: '2023-09-10',
        challenges: ['Complex technology requirements'],
        solutions: ['Expert system integration', 'Future-proof infrastructure']
      }
    ],
    materials: [
      {
        id: 'mat-007',
        name: 'Acoustic Panels',
        category: 'fabric',
        source: 'Sound Solutions',
        cost: '$45/sqft',
        sustainability: 'high'
      },
      {
        id: 'mat-008',
        name: 'LED Lighting System',
        category: 'metal',
        source: 'Smart Lighting Co.',
        cost: '$25/sqft',
        sustainability: 'high'
      }
    ],
    testimonial: {
      client: 'Emma Rodriguez',
      quote: 'The new office space has significantly improved team collaboration and productivity. The design perfectly reflects our company culture.'
    },
    images: [
      'https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg',
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'
    ],
    budget: '$850,000'
  },
  {
    id: 'law-firm-headquarters',
    title: 'Law Firm Headquarters',
    location: {
      city: 'Chicago',
      neighborhood: 'Loop District'
    },
    type: 'commercial',
    area: 12000,
    completionDate: '2023-12-01',
    description: 'A sophisticated law firm headquarters featuring elegant meeting rooms, private offices, and professional client areas.',
    transformationLog: [
      {
        step: 1,
        title: 'Professional Image Design',
        description: 'Creation of sophisticated design that reflects the firm\'s professional reputation and values.',
        date: '2023-05-15',
        challenges: ['Professional image requirements', 'Client impression management'],
        solutions: ['Elegant material selection', 'Sophisticated color palette']
      },
      {
        step: 2,
        title: 'Conference Room Design',
        description: 'Design of impressive meeting spaces for client presentations and negotiations.',
        date: '2023-08-20',
        challenges: ['Acoustic requirements', 'Technology integration'],
        solutions: ['Advanced acoustic design', 'Seamless tech integration']
      }
    ],
    materials: [
      {
        id: 'mat-009',
        name: 'Mahogany Paneling',
        category: 'wood',
        source: 'Heritage Woods',
        cost: '$95/sqft',
        sustainability: 'medium'
      },
      {
        id: 'mat-010',
        name: 'Wool Carpet',
        category: 'fabric',
        source: 'Luxury Flooring',
        cost: '$55/sqft',
        sustainability: 'medium'
      }
    ],
    testimonial: {
      client: 'David Thompson',
      quote: 'The new headquarters perfectly represents our firm\'s professionalism and attention to detail. Our clients are impressed.'
    },
    images: [
      'https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg',
      'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg',
      'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg'
    ],
    budget: '$1,500,000'
  },
  {
    id: 'creative-agency-studio',
    title: 'Creative Agency Studio',
    location: {
      city: 'Los Angeles',
      neighborhood: 'Arts District'
    },
    type: 'commercial',
    area: 6500,
    completionDate: '2024-02-28',
    description: 'A vibrant creative studio designed to inspire innovation and collaboration among creative professionals.',
    transformationLog: [
      {
        step: 1,
        title: 'Creative Environment Design',
        description: 'Design of inspiring spaces that foster creativity and collaboration.',
        date: '2023-10-01',
        challenges: ['Balancing creativity with functionality'],
        solutions: ['Flexible workspace design', 'Inspirational elements']
      },
      {
        step: 2,
        title: 'Brand Integration',
        description: 'Integration of the agency\'s brand identity throughout the space.',
        date: '2023-12-15',
        challenges: ['Brand consistency', 'Visual impact'],
        solutions: ['Strategic brand placement', 'Cohesive design language']
      }
    ],
    materials: [
      {
        id: 'mat-011',
        name: 'Exposed Concrete',
        category: 'stone',
        source: 'Urban Concrete',
        cost: '$35/sqft',
        sustainability: 'high'
      },
      {
        id: 'mat-012',
        name: 'Colorful Acrylic Panels',
        category: 'glass',
        source: 'Creative Materials',
        cost: '$40/sqft',
        sustainability: 'medium'
      }
    ],
    testimonial: {
      client: 'Lisa Park',
      quote: 'The studio has become our creative hub. The design inspires our team and impresses our clients.'
    },
    images: [
      'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg',
      'https://images.pexels.com/photos/1571473/pexels-photo-1571473.jpeg',
      'https://images.pexels.com/photos/1571474/pexels-photo-1571474.jpeg'
    ],
    budget: '$720,000'
  },

  
  {
    id: 'urban-bistro',
    title: 'Urban Bistro',
    location: {
      city: 'Portland',
      neighborhood: 'Pearl District'
    },
    type: 'retail',
    area: 3200,
    completionDate: '2024-01-30',
    description: 'A modern bistro featuring an open kitchen, intimate dining areas, and a sophisticated bar with local craft beer selection.',
    transformationLog: [
      {
        step: 1,
        title: 'Kitchen Design',
        description: 'Design of efficient kitchen layout for optimal food preparation and service.',
        date: '2023-08-10',
        challenges: ['Space constraints', 'Equipment requirements'],
        solutions: ['Compact kitchen design', 'Multi-functional equipment']
      },
      {
        step: 2,
        title: 'Dining Experience',
        description: 'Creation of intimate dining spaces with proper acoustics and lighting.',
        date: '2023-10-20',
        challenges: ['Acoustic control', 'Atmospheric lighting'],
        solutions: ['Acoustic treatments', 'Layered lighting design']
      }
    ],
    materials: [
      {
        id: 'mat-013',
        name: 'Reclaimed Wood Tables',
        category: 'wood',
        source: 'Urban Reclaimed',
        cost: '$75/sqft',
        sustainability: 'high'
      },
      {
        id: 'mat-014',
        name: 'Copper Bar Top',
        category: 'metal',
        source: 'Heritage Metals',
        cost: '$90/sqft',
        sustainability: 'medium'
      }
    ],
    testimonial: {
      client: 'Emma Rodriguez',
      quote: 'The bistro design creates the perfect atmosphere for our guests. The open kitchen adds excitement to the dining experience.'
    },
    images: [
      'https://images.pexels.com/photos/1571475/pexels-photo-1571475.jpeg',
      'https://images.pexels.com/photos/1571476/pexels-photo-1571476.jpeg',
      'https://images.pexels.com/photos/1571477/pexels-photo-1571477.jpeg'
    ],
    budget: '$480,000'
  },
  {
    id: 'boutique-fashion-store',
    title: 'Boutique Fashion Store',
    location: {
      city: 'Miami',
      neighborhood: 'Design District'
    },
    type: 'retail',
    area: 2800,
    completionDate: '2024-02-15',
    description: 'A luxury fashion boutique featuring elegant display areas, private fitting rooms, and sophisticated lighting design.',
    transformationLog: [
      {
        step: 1,
        title: 'Display Design',
        description: 'Design of elegant product display areas to showcase merchandise effectively.',
        date: '2023-09-15',
        challenges: ['Product visibility', 'Space efficiency'],
        solutions: ['Modular display systems', 'Strategic lighting']
      },
      {
        step: 2,
        title: 'Fitting Room Experience',
        description: 'Creation of luxurious fitting rooms with proper lighting and privacy.',
        date: '2023-11-05',
        challenges: ['Privacy requirements', 'Lighting quality'],
        solutions: ['Soundproofing', 'Professional lighting design']
      }
    ],
    materials: [
      {
        id: 'mat-015',
        name: 'Mirrored Panels',
        category: 'glass',
        source: 'Luxury Mirrors',
        cost: '$65/sqft',
        sustainability: 'medium'
      },
      {
        id: 'mat-016',
        name: 'Velvet Upholstery',
        category: 'fabric',
        source: 'Luxury Fabrics',
        cost: '$45/sqft',
        sustainability: 'medium'
      }
    ],
    testimonial: {
      client: 'Sophia Martinez',
      quote: 'The boutique design elevates our brand and creates an exceptional shopping experience for our customers.'
    },
    images: [
      'https://images.pexels.com/photos/1571478/pexels-photo-1571478.jpeg',
      'https://images.pexels.com/photos/1571479/pexels-photo-1571479.jpeg',
      'https://images.pexels.com/photos/1571480/pexels-photo-1571480.jpeg'
    ],
    budget: '$520,000'
  },
  {
    id: 'coffee-shop-concept',
    title: 'Coffee Shop Concept',
    location: {
      city: 'Seattle',
      neighborhood: 'Capitol Hill'
    },
    type: 'retail',
    area: 1800,
    completionDate: '2024-03-01',
    description: 'A cozy coffee shop featuring comfortable seating areas, a barista station, and warm, inviting atmosphere.',
    transformationLog: [
      {
        step: 1,
        title: 'Barista Station Design',
        description: 'Design of efficient barista station for optimal coffee preparation and service.',
        date: '2023-12-01',
        challenges: ['Equipment layout', 'Workflow efficiency'],
        solutions: ['Ergonomic design', 'Streamlined workflow']
      },
      {
        step: 2,
        title: 'Seating Areas',
        description: 'Creation of comfortable seating areas for different customer preferences.',
        date: '2024-01-10',
        challenges: ['Space optimization', 'Comfort requirements'],
        solutions: ['Flexible seating', 'Ergonomic furniture']
      }
    ],
    materials: [
      {
        id: 'mat-017',
        name: 'Reclaimed Barn Wood',
        category: 'wood',
        source: 'Heritage Woods',
        cost: '$55/sqft',
        sustainability: 'high'
      },
      {
        id: 'mat-018',
        name: 'Industrial Lighting',
        category: 'metal',
        source: 'Vintage Lighting Co.',
        cost: '$35/sqft',
        sustainability: 'medium'
      }
    ],
    testimonial: {
      client: 'Alex Johnson',
      quote: 'The coffee shop design creates the perfect atmosphere for our customers. The warm, inviting space encourages community.'
    },
    images: [
      'https://images.pexels.com/photos/1571481/pexels-photo-1571481.jpeg',
      'https://images.pexels.com/photos/1571482/pexels-photo-1571482.jpeg',
      'https://images.pexels.com/photos/1571483/pexels-photo-1571483.jpeg'
    ],
    budget: '$280,000'
  }
]; 