export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  authorId: string;
  status: 'submitted' | 'under-review' | 'approved' | 'implemented' | 'rejected';
  votes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
