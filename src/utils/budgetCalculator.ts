import { BudgetEstimate } from '../types';

interface BudgetParams {
  propertyType: 'residential' | 'commercial' | 'retail';
  area: number;
  finishLevel: 'essential' | 'balanced' | 'premium';
}

const baseCosts = {
  residential: {
    essential: { min: 1200, max: 1800 },
    balanced: { min: 1800, max: 2500 },
    premium: { min: 2500, max: 4000 }
  },
  commercial: {
    essential: { min: 1500, max: 2200 },
    balanced: { min: 2200, max: 3200 },
    premium: { min: 3200, max: 5000 }
  },
  retail: {
    essential: { min: 2000, max: 2800 },
    balanced: { min: 2800, max: 4000 },
    premium: { min: 4000, max: 6500 }
  }
};

const includedServices = {
  essential: [
    'Design consultation and space planning',
    'Basic material selection and sourcing',
    'Furniture layout and arrangement',
    'Color scheme and lighting plan',
    'Project coordination and supervision'
  ],
  balanced: [
    'Complete design consultation and concept development',
    'Detailed space planning and 3D visualization',
    'Premium material selection and procurement',
    'Custom furniture design and coordination',
    'Comprehensive lighting and electrical planning',
    'Project management from start to finish',
    'Post-completion support and adjustments'
  ],
  premium: [
    'Comprehensive design consultation with multiple concepts',
    'Advanced 3D visualization and virtual reality walkthrough',
    'Luxury material sourcing with sustainability focus',
    'Bespoke furniture and fixture design',
    'Smart home integration and advanced lighting systems',
    'Dedicated project manager and priority scheduling',
    'White-glove installation and styling services',
    'Extended warranty and maintenance support',
    'Photography and documentation services'
  ]
};

export function calculateBudget(params: BudgetParams): BudgetEstimate {
  const { propertyType, area, finishLevel } = params;
  const rates = baseCosts[propertyType][finishLevel];
  
  const minCost = Math.round((rates.min * area) / 100000) / 10; 
  const maxCost = Math.round((rates.max * area) / 100000) / 10;
  
  return {
    propertyType,
    area,
    finishLevel,
    estimatedRange: {
      min: minCost,
      max: maxCost
    },
    included: includedServices[finishLevel]
  };
}

export function formatBudgetRange(min: number, max: number): string {
  return `₹${min.toFixed(1)} – ₹${max.toFixed(1)} Lakhs`;
}

export function getBudgetDescription(finishLevel: string): string {
  const descriptions = {
    essential: 'Quality design focused on functionality and lasting appeal with smart material choices.',
    balanced: 'Perfect blend of style and substance with premium finishes and thoughtful details.',
    premium: 'Luxury experience with bespoke elements, highest quality materials, and comprehensive service.'
  };
  return descriptions[finishLevel as keyof typeof descriptions] || '';
}