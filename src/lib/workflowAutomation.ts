// src/lib/workflowAutomation.ts

export interface Department {
  id: string;
  name: string;
  email: string;
  tags: string[];
  managerId: string;
}

export interface WorkflowAction {
  type: string;
  timestamp: Date;
  description: string;
  automated: boolean;
}

// Default departments data
export const defaultDepartments: Department[] = [
  {
    id: 'it',
    name: 'IT Department',
    email: 'it@eduvos.ac.za',
    tags: ['technology', 'software', 'app', 'website', 'digital', 'ai', 'code', 'system', 'computer', 'mobile'],
    managerId: 'admin'
  },
  {
    id: 'sustainability', 
    name: 'Sustainability Office',
    email: 'sustainability@eduvos.ac.za',
    tags: ['environment', 'green', 'recycling', 'energy', 'eco-friendly', 'sustainable', 'planet', 'climate', 'waste'],
    managerId: 'admin'
  },
  {
    id: 'student-life',
    name: 'Student Life',
    email: 'studentlife@eduvos.ac.za',
    tags: ['events', 'activities', 'campus', 'social', 'wellness', 'student', 'community', 'sports', 'club'],
    managerId: 'admin'
  },
  {
    id: 'academic',
    name: 'Academic Affairs',
    email: 'academic@eduvos.ac.za',
    tags: ['course', 'curriculum', 'teaching', 'learning', 'education', 'study', 'exam', 'lecture', 'assignment'],
    managerId: 'admin'
  },
  {
    id: 'facilities',
    name: 'Facilities Management',
    email: 'facilities@eduvos.ac.za',
    tags: ['building', 'maintenance', 'space', 'equipment', 'infrastructure', 'campus', 'room', 'facility'],
    managerId: 'admin'
  }
];

// Automate workflow for a new idea
export function automateIdeaWorkflow(idea: {
  title: string;
  description: string;
  tags: string[];
  aiScore?: number;
}): { 
  assignedDepartment: string | null; 
  priority: string;
  automationScore: number;
  workflowActions: WorkflowAction[];
} {
  const actions: WorkflowAction[] = [];
  
  console.log("🤖 Starting workflow automation...");
  
  // 1. Assign department based on content
  const assignedDept = assignDepartment(idea);
  if (assignedDept) {
    const deptName = getDepartmentName(assignedDept);
    actions.push({
      type: 'department_assignment',
      description: `Automatically assigned to ${deptName}`,
      timestamp: new Date(),
      automated: true
    });
    console.log(`📍 Assigned to department: ${assignedDept}`);
  }
  
  // 2. Calculate priority
  const priority = calculatePriority(idea);
  actions.push({
    type: 'priority_assignment',
    description: `Automatically set priority to ${priority}`,
    timestamp: new Date(),
    automated: true
  });
  console.log(`🎯 Set priority: ${priority}`);
  
  // 3. Calculate automation score
  const automationScore = calculateAutomationScore(idea);
  console.log(`📊 Automation score: ${automationScore}`);
  
  return {
    assignedDepartment: assignedDept,
    priority,
    automationScore,
    workflowActions: actions
  };
}

// Helper function to assign department
function assignDepartment(idea: any): string | null {
  const content = `${idea.title} ${idea.description}`.toLowerCase();
  const ideaTags = idea.tags || [];
  
  console.log(`🔍 Analyzing content for department assignment: "${idea.title}"`);
  
  for (const dept of defaultDepartments) {
    // Check if any department tags match the content or idea tags
    const matches = dept.tags.filter(tag => {
      const hasContentMatch = content.includes(tag.toLowerCase());
      const hasTagMatch = ideaTags.some((ideaTag: string) => 
        ideaTag.toLowerCase().includes(tag.toLowerCase())
      );
      return hasContentMatch || hasTagMatch;
    });
    
    if (matches.length > 0) {
      console.log(`✅ Matched department ${dept.id} with tags:`, matches);
      return dept.id;
    }
  }
  
  // AI-based fallback
  if (idea.aiScore && idea.aiScore > 0.7) {
    console.log(`🎓 High AI score (${idea.aiScore}), defaulting to IT department`);
    return 'it';
  }
  
  console.log(`❌ No department matched, keeping unassigned`);
  return null;
}

// Calculate priority based on multiple factors
function calculatePriority(idea: any): string {
  let score = 0;
  
  // AI Score (40%)
  score += (idea.aiScore || 0) * 40;
  console.log(`📈 AI score contribution: ${(idea.aiScore || 0) * 40}`);
  
  // Urgency keywords (30%)
  const urgencyKeywords = ['urgent', 'critical', 'important', 'asap', 'emergency', 'fix now', 'immediately'];
  const hasUrgency = urgencyKeywords.some(keyword => {
    const hasMatch = idea.title.toLowerCase().includes(keyword) ||
                    idea.description.toLowerCase().includes(keyword);
    if (hasMatch) console.log(`🚨 Urgency keyword found: ${keyword}`);
    return hasMatch;
  });
  if (hasUrgency) score += 30;
  
  // Scope impact (30%)
  const scopeKeywords = ['campus', 'all students', 'university', 'system', 'everyone', 'entire', 'whole'];
  const hasBroadScope = scopeKeywords.some(keyword => {
    const hasMatch = idea.description.toLowerCase().includes(keyword);
    if (hasMatch) console.log(`🌍 Scope keyword found: ${keyword}`);
    return hasMatch;
  });
  if (hasBroadScope) score += 30;
  
  console.log(`🧮 Final priority score: ${score}`);
  
  // Determine priority level
  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

// Calculate overall automation score
function calculateAutomationScore(idea: any): number {
  let score = idea.aiScore || 0.5;
  
  // Boost score for well-described ideas
  const descLength = idea.description.length;
  if (descLength > 200) {
    score += 0.2;
    console.log(`📝 Description length bonus: +0.2`);
  }
  if (descLength > 500) {
    score += 0.1;
    console.log(`📝 Long description bonus: +0.1`);
  }
  
  // Boost for having tags
  if (idea.tags && idea.tags.length > 0) {
    score += 0.1;
    console.log(`🏷️ Tags bonus: +0.1`);
  }
  
  const finalScore = Math.min(score, 1.0);
  console.log(`🎯 Final automation score: ${finalScore}`);
  return finalScore;
}

// Get department name by ID
export function getDepartmentById(id: string): Department | undefined {
  return defaultDepartments.find(dept => dept.id === id);
}

export function getDepartmentName(id: string): string {
  const dept = getDepartmentById(id);
  return dept ? dept.name : 'Unknown Department';
}

// Get all departments
export function getAllDepartments(): Department[] {
  return defaultDepartments;
}