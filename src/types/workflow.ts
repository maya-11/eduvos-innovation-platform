export interface Department {
  id: string;
  name: string;
  email: string;
  tags: string[];
  managerId: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  conditions: {
    field: 'tags' | 'aiScore' | 'title' | 'description';
    operator: 'contains' | 'greaterThan' | 'lessThan' | 'equals';
    value: any;
  }[];
  actions: {
    type: 'assignDepartment' | 'setPriority' | 'changeStatus' | 'notify';
    target: string;
  }[];
  priority: number;
}

export interface WorkflowAction {
  type: string;
  timestamp: Date;
  description: string;
  automated: boolean;
}