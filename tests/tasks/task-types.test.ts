import { describe, it, expect } from 'vitest';
import { TaskStatus, TaskPriority } from '../../src/tasks/task-types.js';

describe('TaskTypes', () => {
  describe('TaskStatus enum', () => {
    it('should have correct status values', () => {
      expect(TaskStatus.PENDING).toBe('pending');
      expect(TaskStatus.CLAIMED).toBe('claimed');
      expect(TaskStatus.IN_PROGRESS).toBe('in_progress');
      expect(TaskStatus.COMPLETED).toBe('completed');
      expect(TaskStatus.FAILED).toBe('failed');
      expect(TaskStatus.CANCELLED).toBe('cancelled');
    });
  });

  describe('TaskPriority enum', () => {
    it('should have correct priority values', () => {
      expect(TaskPriority.LOW).toBe(0);
      expect(TaskPriority.MEDIUM).toBe(1);
      expect(TaskPriority.HIGH).toBe(2);
      expect(TaskPriority.CRITICAL).toBe(3);
    });

    it('should have priority order LOW < MEDIUM < HIGH < CRITICAL', () => {
      expect(TaskPriority.LOW).toBeLessThan(TaskPriority.MEDIUM);
      expect(TaskPriority.MEDIUM).toBeLessThan(TaskPriority.HIGH);
      expect(TaskPriority.HIGH).toBeLessThan(TaskPriority.CRITICAL);
    });
  });
});
