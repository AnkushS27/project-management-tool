export type ProjectStatus = 'draft' | 'active' | 'completed';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface User {
  _id: string;
  email: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  owner: string;
  taskCount?: number;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  project: string;
  createdAt: string;
}
