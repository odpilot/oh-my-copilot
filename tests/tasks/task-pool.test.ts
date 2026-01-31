import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TaskPool } from '../../src/tasks/task-pool.js';
import { TaskStatus, TaskPriority } from '../../src/tasks/task-types.js';

describe('TaskPool', () => {
  let taskPool: TaskPool;

  beforeEach(() => {
    taskPool = new TaskPool(':memory:');
  });

  afterEach(() => {
    taskPool.close();
  });

  describe('createTask', () => {
    it('should create a task with correct properties', () => {
      const task = taskPool.createTask({
        title: 'Test Task',
        description: 'Test description',
        priority: TaskPriority.HIGH
      });

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test description');
      expect(task.status).toBe('pending');
      expect(task.priority).toBe(TaskPriority.HIGH);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should create task with default priority', () => {
      const task = taskPool.createTask({
        title: 'Task',
        description: 'Description'
      });

      expect(task.priority).toBe(1);
    });

    it('should create task with metadata', () => {
      const task = taskPool.createTask({
        title: 'Task',
        description: 'Description',
        metadata: { custom: 'data' }
      });

      expect(task.metadata).toEqual({ custom: 'data' });
    });
  });

  describe('claimTask', () => {
    it('should atomically claim a pending task', () => {
      taskPool.createTask({
        title: 'Task 1',
        description: 'Description 1'
      });

      const claimed = taskPool.claimTask('agent-1');
      
      expect(claimed).not.toBeNull();
      expect(claimed?.status).toBe('claimed');
      expect(claimed?.assignedAgent).toBe('agent-1');
      expect(claimed?.startedAt).toBeDefined();
    });

    it('should return null when no pending tasks', () => {
      const claimed = taskPool.claimTask('agent-1');
      expect(claimed).toBeNull();
    });

    it('should claim highest priority task first', () => {
      taskPool.createTask({ title: 'Low', description: '', priority: TaskPriority.LOW });
      taskPool.createTask({ title: 'High', description: '', priority: TaskPriority.HIGH });
      taskPool.createTask({ title: 'Medium', description: '', priority: TaskPriority.MEDIUM });

      const claimed = taskPool.claimTask('agent-1');
      expect(claimed?.title).toBe('High');
    });

    it('should claim oldest task when priorities are equal', () => {
      taskPool.createTask({ title: 'First', description: '', priority: TaskPriority.MEDIUM });
      taskPool.createTask({ title: 'Second', description: '', priority: TaskPriority.MEDIUM });

      const claimed = taskPool.claimTask('agent-1');
      expect(claimed?.title).toBe('First');
    });
  });

  describe('getTask', () => {
    it('should get task by id', () => {
      const created = taskPool.createTask({
        title: 'Task',
        description: 'Description'
      });

      const retrieved = taskPool.getTask(created.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Task');
    });

    it('should return null for non-existent id', () => {
      const task = taskPool.getTask('non-existent-id');
      expect(task).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task status', () => {
      const task = taskPool.createTask({
        title: 'Task',
        description: 'Description'
      });

      const updated = taskPool.updateTask(task.id, {
        status: TaskStatus.IN_PROGRESS
      });

      expect(updated?.status).toBe('in_progress');
      expect(updated?.updatedAt).toBeGreaterThanOrEqual(task.updatedAt);
    });

    it('should update task with result', () => {
      const task = taskPool.createTask({
        title: 'Task',
        description: 'Description'
      });

      const updated = taskPool.updateTask(task.id, {
        status: TaskStatus.COMPLETED,
        result: 'Task completed successfully'
      });

      expect(updated?.status).toBe('completed');
      expect(updated?.result).toBe('Task completed successfully');
      expect(updated?.completedAt).toBeDefined();
    });

    it('should update task with error', () => {
      const task = taskPool.createTask({
        title: 'Task',
        description: 'Description'
      });

      const updated = taskPool.updateTask(task.id, {
        status: TaskStatus.FAILED,
        error: 'Task failed'
      });

      expect(updated?.status).toBe('failed');
      expect(updated?.error).toBe('Task failed');
      expect(updated?.completedAt).toBeDefined();
    });
  });

  describe('getTasks', () => {
    beforeEach(() => {
      taskPool.createTask({ title: 'Task 1', description: 'Desc 1', priority: TaskPriority.HIGH });
      taskPool.createTask({ title: 'Task 2', description: 'Desc 2', priority: TaskPriority.LOW });
      taskPool.createTask({ title: 'Task 3', description: 'Desc 3', priority: TaskPriority.MEDIUM });
    });

    it('should get all tasks', () => {
      const tasks = taskPool.getTasks();
      expect(tasks).toHaveLength(3);
    });

    it('should filter tasks by status', () => {
      taskPool.claimTask('agent-1');
      const pending = taskPool.getTasks({ status: TaskStatus.PENDING });
      const claimed = taskPool.getTasks({ status: TaskStatus.CLAIMED });
      
      expect(pending).toHaveLength(2);
      expect(claimed).toHaveLength(1);
    });

    it('should filter tasks by priority', () => {
      const high = taskPool.getTasks({ priority: TaskPriority.HIGH });
      expect(high).toHaveLength(1);
      expect(high[0].title).toBe('Task 1');
    });

    it('should filter tasks by assigned agent', () => {
      taskPool.claimTask('agent-1');
      const agentTasks = taskPool.getTasks({ assignedAgent: 'agent-1' });
      expect(agentTasks).toHaveLength(1);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      taskPool.createTask({ title: 'Task 1', description: '' });
      taskPool.createTask({ title: 'Task 2', description: '' });
      taskPool.claimTask('agent-1');

      const stats = taskPool.getStats();
      
      expect(stats.total).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.claimed).toBe(1);
      expect(stats.completed).toBe(0);
    });

    it('should return zero stats for empty pool', () => {
      const stats = taskPool.getStats();
      
      expect(stats.total).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.claimed).toBe(0);
    });
  });

  describe('deleteTask', () => {
    it('should delete task', () => {
      const task = taskPool.createTask({
        title: 'Task',
        description: 'Description'
      });

      const deleted = taskPool.deleteTask(task.id);
      expect(deleted).toBe(true);

      const retrieved = taskPool.getTask(task.id);
      expect(retrieved).toBeNull();
    });

    it('should return false for non-existent task', () => {
      const deleted = taskPool.deleteTask('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('should clear all tasks', () => {
      taskPool.createTask({ title: 'Task 1', description: '' });
      taskPool.createTask({ title: 'Task 2', description: '' });

      taskPool.clearAll();

      const stats = taskPool.getStats();
      expect(stats.total).toBe(0);
    });
  });
});
