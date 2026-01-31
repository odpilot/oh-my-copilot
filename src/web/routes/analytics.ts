/**
 * Analytics API Routes
 */

import { Router, Request, Response } from 'express';

export const analyticsRouter = Router();

// Mock analytics data
const mockAnalytics = {
  costs: {
    total: 0,
    by_model: {
      'gpt-4o': 0,
      'gpt-4o-mini': 0
    },
    by_agent: {
      'architect': 0,
      'executor': 0,
      'qa-tester': 0,
      'security': 0,
      'designer': 0
    },
    history: [] as Array<{ timestamp: number; cost: number; model: string }>
  },
  metrics: {
    total_requests: 0,
    total_tokens: 0,
    avg_response_time: 0,
    success_rate: 100
  }
};

/**
 * GET /api/analytics/costs - Get cost analysis
 */
analyticsRouter.get('/costs', (req: Request, res: Response) => {
  const { period = '24h' } = req.query;

  // Filter history based on period
  let filteredHistory = mockAnalytics.costs.history;
  const now = Date.now();
  
  if (period === '1h') {
    filteredHistory = mockAnalytics.costs.history.filter(
      h => h.timestamp > now - 3600000
    );
  } else if (period === '24h') {
    filteredHistory = mockAnalytics.costs.history.filter(
      h => h.timestamp > now - 86400000
    );
  } else if (period === '7d') {
    filteredHistory = mockAnalytics.costs.history.filter(
      h => h.timestamp > now - 604800000
    );
  }

  res.json({
    total: mockAnalytics.costs.total,
    by_model: mockAnalytics.costs.by_model,
    by_agent: mockAnalytics.costs.by_agent,
    history: filteredHistory,
    period
  });
});

/**
 * GET /api/analytics/metrics - Get performance metrics
 */
analyticsRouter.get('/metrics', (req: Request, res: Response) => {
  res.json(mockAnalytics.metrics);
});

/**
 * GET /api/analytics/dashboard - Get complete dashboard data
 */
analyticsRouter.get('/dashboard', (req: Request, res: Response) => {
  res.json({
    costs: mockAnalytics.costs,
    metrics: mockAnalytics.metrics,
    timestamp: Date.now()
  });
});
