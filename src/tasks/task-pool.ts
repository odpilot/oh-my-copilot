/**
 * SQLite Task Pool
 * Provides atomic task claiming and management using SQLite
 */

import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilter,
  TaskStats
} from './task-types.js';

export class TaskPool {
  private db: Database.Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new Database(dbPath);
    this.initializeDatabase();
    logger.info(`TaskPool initialized with database: ${dbPath}`);
  }

  /**
   * Initialize database schema
   */
  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        priority INTEGER NOT NULL,
        assigned_agent TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        started_at INTEGER,
        completed_at INTEGER,
        result TEXT,
        error TEXT,
        metadata TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_assigned_agent ON tasks(assigned_agent);
      CREATE INDEX IF NOT EXISTS idx_priority ON tasks(priority);
    `);
  }

  /**
   * Create a new task
   */
  createTask(input: CreateTaskInput): Task {
    const task: Task = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      status: 'pending' as TaskStatus,
      priority: input.priority || 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: input.metadata
    };

    const stmt = this.db.prepare(`
      INSERT INTO tasks (
        id, title, description, status, priority,
        created_at, updated_at, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.createdAt,
      task.updatedAt,
      task.metadata ? JSON.stringify(task.metadata) : null
    );

    logger.info(`Task created: ${task.id} - ${task.title}`);
    return task;
  }

  /**
   * Atomically claim a pending task
   */
  claimTask(agentName: string): Task | null {
    const transaction = this.db.transaction(() => {
      // Find highest priority pending task
      const row = this.db.prepare(`
        SELECT * FROM tasks
        WHERE status = 'pending'
        ORDER BY priority DESC, created_at ASC
        LIMIT 1
      `).get() as any;

      if (!row) return null;

      // Claim the task
      this.db.prepare(`
        UPDATE tasks
        SET status = 'claimed',
            assigned_agent = ?,
            updated_at = ?,
            started_at = ?
        WHERE id = ?
      `).run(agentName, Date.now(), Date.now(), row.id);

      // Return the claimed task
      return this.getTask(row.id);
    });

    const task = transaction();
    
    if (task) {
      logger.info(`Task claimed by ${agentName}: ${task.id} - ${task.title}`);
    }

    return task;
  }

  /**
   * Get a task by ID
   */
  getTask(id: string): Task | null {
    const row = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;
    return row ? this.rowToTask(row) : null;
  }

  /**
   * Update a task
   */
  updateTask(id: string, update: UpdateTaskInput): Task | null {
    const updates: string[] = [];
    const params: any[] = [];

    if (update.status !== undefined) {
      updates.push('status = ?');
      params.push(update.status);

      if (update.status === 'completed' || update.status === 'failed') {
        updates.push('completed_at = ?');
        params.push(Date.now());
      }
    }

    if (update.assignedAgent !== undefined) {
      updates.push('assigned_agent = ?');
      params.push(update.assignedAgent);
    }

    if (update.result !== undefined) {
      updates.push('result = ?');
      params.push(update.result);
    }

    if (update.error !== undefined) {
      updates.push('error = ?');
      params.push(update.error);
    }

    if (update.metadata !== undefined) {
      updates.push('metadata = ?');
      params.push(JSON.stringify(update.metadata));
    }

    updates.push('updated_at = ?');
    params.push(Date.now());

    params.push(id);

    this.db.prepare(`
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...params);

    logger.info(`Task updated: ${id}`);
    return this.getTask(id);
  }

  /**
   * Get tasks with optional filter
   */
  getTasks(filter?: TaskFilter): Task[] {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (filter?.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }

    if (filter?.assignedAgent) {
      query += ' AND assigned_agent = ?';
      params.push(filter.assignedAgent);
    }

    if (filter?.priority !== undefined) {
      query += ' AND priority = ?';
      params.push(filter.priority);
    }

    query += ' ORDER BY priority DESC, created_at ASC';

    const rows = this.db.prepare(query).all(...params) as any[];
    return rows.map(row => this.rowToTask(row));
  }

  /**
   * Get task statistics
   */
  getStats(): TaskStats {
    const row = this.db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'claimed' THEN 1 ELSE 0 END) as claimed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM tasks
    `).get() as any;

    return {
      total: row.total || 0,
      pending: row.pending || 0,
      claimed: row.claimed || 0,
      inProgress: row.in_progress || 0,
      completed: row.completed || 0,
      failed: row.failed || 0,
      cancelled: row.cancelled || 0
    };
  }

  /**
   * Delete a task
   */
  deleteTask(id: string): boolean {
    const result = this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    const deleted = result.changes > 0;
    
    if (deleted) {
      logger.info(`Task deleted: ${id}`);
    }

    return deleted;
  }

  /**
   * Clear all tasks
   */
  clearAll(): void {
    this.db.prepare('DELETE FROM tasks').run();
    logger.info('All tasks cleared');
  }

  /**
   * Convert database row to Task object
   */
  private rowToTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      assignedAgent: row.assigned_agent || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      startedAt: row.started_at || undefined,
      completedAt: row.completed_at || undefined,
      result: row.result || undefined,
      error: row.error || undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    };
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
    logger.info('TaskPool database closed');
  }
}
