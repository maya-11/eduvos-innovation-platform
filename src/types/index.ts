export type AIScores = {
  feasibility: number;
  impact: number;
  innovation: number;
  resources: number;
  scalability: number;
  risk: number;
  value: number;
  alignment: number;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'implemented';
  votes: number;
  createdAt: Date;
  updatedAt: Date;
  analysis?: AIAnalysis;
};

export type AIAnalysis = {
  summary: string;
  confidence: number;
  feasibility: number;
  impact: number;
  innovation: number;
  resources: number;
  scalability: number;
  risk: number;
  value: number;
  alignment: number;
  estimatedCost: 'low' | 'medium' | 'high';
  timeToImplement: 'quick' | 'medium' | 'long';
  riskLevel: 'low' | 'medium' | 'high';
  strengths: string[];
  considerations: string[];
  recommendations: string[];
  generatedAt: Date;
};