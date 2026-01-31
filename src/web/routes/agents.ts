/**
 * Agents API Routes
 */

import { Router, Request, Response } from 'express';

export const agentsRouter = Router();

// Mock data for demonstration
const mockAgents = [
  {
    name: 'architect',
    displayName: 'Architect Agent',
    model: 'gpt-4o',
    status: 'idle',
    description: 'Strategic planning and system design',
    tasksCompleted: 0,
    totalCost: 0
  },
  {
    name: 'executor',
    displayName: 'Executor Agent',
    model: 'gpt-4o-mini',
    status: 'idle',
    description: 'Code implementation',
    tasksCompleted: 0,
    totalCost: 0
  },
  {
    name: 'qa-tester',
    displayName: 'QA Tester Agent',
    model: 'gpt-4o-mini',
    status: 'idle',
    description: 'Testing and quality assurance',
    tasksCompleted: 0,
    totalCost: 0
  },
  {
    name: 'security',
    displayName: 'Security Agent',
    model: 'gpt-4o',
    status: 'idle',
    description: 'Security review and vulnerability detection',
    tasksCompleted: 0,
    totalCost: 0
  },
  {
    name: 'designer',
    displayName: 'Designer Agent',
    model: 'gpt-4o',
    status: 'idle',
    description: 'UI/UX design',
    tasksCompleted: 0,
    totalCost: 0
  }
];

/**
 * GET /api/agents - List all agents
 */
agentsRouter.get('/', (req: Request, res: Response) => {
  res.json({
    agents: mockAgents,
    total: mockAgents.length,
    active: mockAgents.filter(a => a.status === 'active').length
  });
});

/**
 * GET /api/agents/:name - Get agent details
 */
agentsRouter.get('/:name', (req: Request, res: Response) => {
  const agent = mockAgents.find(a => a.name === req.params.name);
  
  if (!agent) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Agent ${req.params.name} not found`
    });
  }

  res.json(agent);
});

/**
 * GET /api/agents/:name/status - Get agent status
 */
agentsRouter.get('/:name/status', (req: Request, res: Response) => {
  const agent = mockAgents.find(a => a.name === req.params.name);
  
  if (!agent) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Agent ${req.params.name} not found`
    });
  }

  res.json({
    name: agent.name,
    status: agent.status,
    model: agent.model,
    timestamp: Date.now()
  });
});
