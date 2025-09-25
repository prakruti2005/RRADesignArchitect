export interface Project {
  id: string;
  title: string;
  location: {
    city: string;
    neighborhood: string;
  };
  type: 'residential' | 'commercial' | 'retail';
  area: number;
  completionDate: string;
  description: string;
  transformationLog: TransformationStep[];
  materials: Material[];
  testimonial: {
    client: string;
    quote: string;
  };
  images: string[];
  budget: string;
}

export interface TransformationStep {
  step: number;
  title: string;
  description: string;
  date: string;
  challenges: string[];
  solutions: string[];
}

export interface Material {
  id: string;
  name: string;
  category: 'wood' | 'paint' | 'tile' | 'fabric' | 'metal' | 'stone' | 'glass';
  source: string;
  cost: string;
  sustainability: 'high' | 'medium' | 'low';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  why: string;
  how: string;
  useCases: {
    home: boolean;
    office: boolean;
    retail: boolean;
  };
  relatedProjectIds: string[];
}

export interface QuestionnaireStep {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'slider';
  options?: string[];
  required: boolean;
}

export interface BudgetEstimate {
  propertyType: 'residential' | 'commercial' | 'retail';
  area: number;
  finishLevel: 'essential' | 'balanced' | 'premium';
  estimatedRange: {
    min: number;
    max: number;
  };
  included: string[];
}

export interface FounderLetter {
  id: string;
  title: string;
  date: string;
  content: string;
  author: string;
}

export interface Philosophy {
  statement: string;
  explanation: string;
}

export interface CultureNote {
  id: string;
  date: string;
  title: string;
  content: string;
  category: 'project' | 'team' | 'client' | 'learning';
}

export interface SupportQuery {
  id: string;
  type: 'layout' | 'material' | 'timeline' | 'budget' | 'general';
  question: string;
  email: string;
  status: 'pending' | 'replied' | 'reviewed';
  response?: string;
  date: string;
}