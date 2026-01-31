/**
 * Tasks API Routes
 */

import { Router, Request, Response } from 'express';

export const tasksRouter = Router();

// Mock task storage
let tasks: any[] = [];
let taskIdCounter = 1;

/**
 * GET /api/tasks/stats - Get task statistics
 */
tasksRouter.get('/stats', (req: Request, res: Response) => {
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    success_rate: tasks.length > 0 
      ? ((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(1) + '%'
      : '0%'
  };

  res.json(stats);
});

/**
 * GET /api/tasks - List all tasks
 */
tasksRouter.get('/', (req: Request, res: Response) => {
  const { status, limit = 100, offset = 0 } = req.query;
  
  let filteredTasks = tasks;
  
  if (status && typeof status === 'string') {
    filteredTasks = tasks.filter(t => t.status === status);
  }

  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);
  const paginatedTasks = filteredTasks.slice(offsetNum, offsetNum + limitNum);

  res.json({
    tasks: paginatedTasks,
    total: filteredTasks.length,
    limit: limitNum,
    offset: offsetNum
  });
});

/**
 * POST /api/tasks - Create new task
 */
tasksRouter.post('/', (req: Request, res: Response) => {
  const { title, description, priority = 'medium', agent } = req.body;

  if (!title) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Task title is required'
    });
  }

  const newTask = {
    id: taskIdCounter++,
    title,
    description: description || '',
    priority,
    agent: agent || 'executor',
    status: 'pending',
    created_at: Date.now(),
    updated_at: Date.now()
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

/**
 * GET /api/tasks/:id - Get task details
 */
tasksRouter.get('/:id', (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task ${taskId} not found`
    });
  }

  res.json(task);
});

/**
 * PATCH /api/tasks/:id - Update task
 */
tasksRouter.patch('/:id', (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task ${taskId} not found`
    });
  }

  const allowedUpdates = ['title', 'description', 'status', 'priority', 'agent'];
  const updates: any = {};

  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: Date.now()
  };

  res.json(tasks[taskIndex]);
});

/**
 * DELETE /api/tasks/:id - Delete task
 */
tasksRouter.delete('/:id', (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Task ${taskId} not found`
    });
  }

  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);

  res.json({
    message: 'Task deleted successfully',
    task: deletedTask
  });
});
