/**
 * Swarm Mode
 * Dynamic task claiming from SQLite pool
 */

import { TaskPool, TaskStatus, type Task } from '../tasks/index.js';
import { BaseAgent } from '../agents/base-agent.js';
import { logger } from '../utils/logger.js';
import { sleep } from '../utils/helpers.js';

export interface SwarmAgent {
  agent: BaseAgent;
  isActive: boolean;
}

export interface SwarmConfig {
  maxConcurrency?: number;
  pollInterval?: number;
  stopWhenEmpty?: boolean;
}

export class Swarm {
  private taskPool: TaskPool;
  private agents: Map<string, SwarmAgent> = new Map();
  private isRunning = false;

  constructor(taskPool: TaskPool) {
    this.taskPool = taskPool;
    logger.info('Swarm initialized');
  }

  /**
   * Register an agent to the swarm
   */
  registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.getName(), {
      agent,
      isActive: false
    });
    logger.info(`Agent registered: ${agent.getName()}`);
  }

  /**
   * Unregister an agent from the swarm
   */
  unregisterAgent(agentName: string): void {
    this.agents.delete(agentName);
    logger.info(`Agent unregistered: ${agentName}`);
  }

  /**
   * Start the swarm
   */
  async start(config: SwarmConfig = {}): Promise<void> {
    const {
      maxConcurrency = this.agents.size,
      pollInterval = 1000,
      stopWhenEmpty = false
    } = config;

    this.isRunning = true;
    logger.info('🐝 Starting Swarm Mode');

    const workers: Promise<void>[] = [];

    // Create worker tasks for each agent
    for (const [agentName, swarmAgent] of this.agents) {
      if (workers.length >= maxConcurrency) break;

      workers.push(
        this.runWorker(agentName, swarmAgent, pollInterval, stopWhenEmpty)
      );
    }

    // Wait for all workers to complete
    await Promise.all(workers);

    logger.info('Swarm stopped');
  }

  /**
   * Stop the swarm
   */
  stop(): void {
    this.isRunning = false;
    logger.info('Stopping swarm...');
  }

  /**
   * Run a worker that claims and processes tasks
   */
  private async runWorker(
    agentName: string,
    swarmAgent: SwarmAgent,
    pollInterval: number,
    stopWhenEmpty: boolean
  ): Promise<void> {
    logger.info(`Worker started: ${agentName}`);

    while (this.isRunning) {
      try {
        // Try to claim a task
        const task = this.taskPool.claimTask(agentName);

        if (!task) {
          if (stopWhenEmpty) {
            logger.info(`No tasks available, stopping worker: ${agentName}`);
            break;
          }
          
          // No task available, wait and try again
          await sleep(pollInterval);
          continue;
        }

        swarmAgent.isActive = true;

        // Update task status to in_progress
        this.taskPool.updateTask(task.id, { status: TaskStatus.IN_PROGRESS });

        // Execute the task
        logger.info(`${agentName} processing task: ${task.title}`);
        const result = await swarmAgent.agent.execute({
          task: task.description,
          context: task.metadata
        });

        // Update task with result
        if (result.success) {
          this.taskPool.updateTask(task.id, {
            status: TaskStatus.COMPLETED,
            result: result.content
          });
          logger.info(`${agentName} completed task: ${task.title}`);
        } else {
          this.taskPool.updateTask(task.id, {
            status: TaskStatus.FAILED,
            error: result.error
          });
          logger.error(`${agentName} failed task: ${task.title}`);
        }

        swarmAgent.isActive = false;

      } catch (error) {
        logger.error(`Worker error in ${agentName}: ${error}`);
        swarmAgent.isActive = false;
        await sleep(pollInterval);
      }
    }

    logger.info(`Worker stopped: ${agentName}`);
  }

  /**
   * Get swarm status
   */
  getStatus(): {
    isRunning: boolean;
    agents: Array<{ name: string; isActive: boolean }>;
    taskStats: any;
  } {
    return {
      isRunning: this.isRunning,
      agents: Array.from(this.agents.entries()).map(([name, agent]) => ({
        name,
        isActive: agent.isActive
      })),
      taskStats: this.taskPool.getStats()
    };
  }
}
