// apps/dashboard/src/app/core/models/models.ts

export interface User {
  id: number;
  email: string;
  name: string;
  roleId: number;
  organizationId: number;
  role?: Role;
  organization?: Organization;
}

export interface Role {
  id: number;
  name: 'Owner' | 'Admin' | 'Viewer';
}

export interface Organization {
  id: number;
  name: string;
  parentOrganizationId: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  organizationId: number;
  createdById: number;
  assignedToId: number | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User;
  assignedTo?: User;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  assignedToId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  category?: TaskCategory;
  assignedToId?: number;
}