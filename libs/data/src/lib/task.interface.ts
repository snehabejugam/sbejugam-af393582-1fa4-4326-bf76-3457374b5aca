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
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  assignedToId?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  category?: TaskCategory;
  assignedToId?: number;
}