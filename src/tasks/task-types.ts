/**
 * Task type definitions
 */

export enum TaskStatus {
  PENDING = 'pending',
  CLAIMED = 'claimed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  CRITICAL = 3
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedAgent?: string;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority?: TaskPriority;
  metadata?: Record<string, any>;
}

export interface UpdateTaskInput {
  status?: TaskStatus;
  assignedAgent?: string;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface TaskFilter {
  status?: TaskStatus;
  assignedAgent?: string;
  priority?: TaskPriority;
}

export interface TaskStats {
  total: number;
  pending: number;
  claimed: number;
  inProgress: number;
  completed: number;
  failed: number;
  cancelled: number;
}
