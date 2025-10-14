// src/types/index.ts

// AI Analysis structure
export interface AIAnalysis {
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
  confidence: number;
  summary: string;
  strengths: string[];
  considerations: string[];
  recommendations: string[];
  generatedAt: Date;
}

// AI Scores for overall calculation
export interface AIScores {
  overall: number;
  feasibility: number;
  impact: number;
  innovation: number;
  resources: number;
}

// Workflow tracking
export interface WorkflowAction {
  type: string;
  timestamp: Date;
  description: string;
  automated: boolean;
}

// Departments in the system
export interface Department {
  id: string;
  name: string;
  email: string;
  tags: string[];
  managerId: string;
}

// Idea structure
export interface Idea {
  id?: string;
  title: string;
  description: string;
  authorId: string;
  authorEmail: string;
  status: 'backlog' | 'validated' | 'in-progress' | 'implemented' | 'rejected';
  votesCount: number;
  tags: string[];
  priority: number;
  createdAt: Date | string;
  updatedAt: Date | string;

  // AI & Automation
  automationScore: number;
  aiScore?: number;
  aiAnalysis?: AIAnalysis;

  // Workflow Automation
  assignedDepartment?: string;
  workflowHistory: WorkflowAction[];
}

// Comments on ideas
export interface Comment {
  id: string;
  authorId: string;
  authorEmail: string;
  text: string;
  createdAt: Date | string;
}

// User statistics
export interface UserStats {
  ideasSubmitted: number;
  votesReceived: number;
  ideasInProgress: number;
  ideasImplemented: number;
}

// Export workflow types if they exist in a separate file
export * from './workflow';
