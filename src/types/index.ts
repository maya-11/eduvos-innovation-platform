// src/types/index.ts

export interface AIAnalysis {
  feasibility: number;
  impact: number;
  innovation: number;
  resources: number;
  estimatedCost: 'low' | 'medium' | 'high';
  timeToImplement: 'quick' | 'medium' | 'long';
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  summary: string;
  strengths: string[];
  considerations: string[];
  recommendations: string[];
  generatedAt: any;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorEmail: string;
  status: 'backlog' | 'validated' | 'in-progress' | 'implemented' | 'rejected';
  votesCount: number;
  tags: string[];
  priority: number;
  aiAnalysis?: AIAnalysis;
  aiScore?: number;
  createdAt: any;
  updatedAt: any;
}

export interface Comment {
  id: string;
  authorId: string;
  authorEmail: string;
  text: string;
  createdAt: any;
}

export interface UserStats {
  ideasSubmitted: number;
  votesReceived: number;
  ideasInProgress: number;
  ideasImplemented: number;
}
