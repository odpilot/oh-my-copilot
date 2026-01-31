/**
 * API Routes Setup
 */

import { Express, Request, Response } from 'express';
import { agentsRouter } from './agents.js';
import { tasksRouter } from './tasks.js';
import { analyticsRouter } from './analytics.js';

/**
 * Setup all API routes
 */
export function setupRoutes(app: Express): void {
  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      version: '0.1.0'
    });
  });

  // API routes
  app.use('/api/agents', agentsRouter);
  app.use('/api/tasks', tasksRouter);
  app.use('/api/analytics', analyticsRouter);

  // 404 handler for API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `API endpoint ${req.path} not found`
    });
  });
}
