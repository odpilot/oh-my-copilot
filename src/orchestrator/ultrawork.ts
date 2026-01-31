/**
 * Ultrawork Mode
 * Parallel execution of multiple tasks
 */

import { BaseAgent } from '../agents/base-agent.js';
import type { AgentResult } from '../agents/base-agent.js';
import { logger } from '../utils/logger.js';
import { calculateCost, formatCost, formatDuration } from '../utils/helpers.js';

export interface UltraworkTask {
  title: string;
  description: string;
  agent: BaseAgent;
  context?: Record<string, any>;
}

export interface UltraworkResult {
  success: boolean;
  results: Array<AgentResult & { title: string }>;
  totalCost: number;
  totalTime: number;
  summary: string;
}

export class Ultrawork {
  constructor() {
    logger.info('Ultrawork initialized');
  }

  /**
   * Execute multiple tasks in parallel
   */
  async execute(tasks: UltraworkTask[]): Promise<UltraworkResult> {
    const startTime = Date.now();
    
    logger.info(`⚡ Starting Ultrawork Mode with ${tasks.length} parallel tasks`);

    try {
      // Execute all tasks in parallel
      const promises = tasks.map(async (task) => {
        logger.info(`Starting parallel task: ${task.title}`);
        
        const result = await task.agent.execute({
          task: task.description,
          context: task.context
        });

        return {
          ...result,
          title: task.title
        };
      });

      const results = await Promise.all(promises);
      
      // Calculate total cost
      const totalCost = results.reduce(
        (sum, result) => sum + calculateCost(result.usage),
        0
      );

      const totalTime = Date.now() - startTime;
      const success = results.every(r => r.success);

      logger.info(`Ultrawork completed: ${results.filter(r => r.success).length}/${results.length} tasks succeeded`);

      return this.buildResult(results, totalTime, totalCost, success);

    } catch (error) {
      logger.error(`Ultrawork failed: ${error}`);
      
      return {
        success: false,
        results: [],
        totalCost: 0,
        totalTime: Date.now() - startTime,
        summary: `Ultrawork failed: ${error}`
      };
    }
  }

  /**
   * Execute tasks with controlled concurrency
   */
  async executeWithLimit(
    tasks: UltraworkTask[],
    concurrencyLimit: number
  ): Promise<UltraworkResult> {
    const startTime = Date.now();
    const results: Array<AgentResult & { title: string }> = [];
    
    logger.info(
      `⚡ Starting Ultrawork Mode with ${tasks.length} tasks (concurrency: ${concurrencyLimit})`
    );

    try {
      // Process tasks in batches
      for (let i = 0; i < tasks.length; i += concurrencyLimit) {
        const batch = tasks.slice(i, i + concurrencyLimit);
        
        logger.info(
          `Processing batch ${Math.floor(i / concurrencyLimit) + 1}/${Math.ceil(tasks.length / concurrencyLimit)}`
        );

        const batchPromises = batch.map(async (task) => {
          const result = await task.agent.execute({
            task: task.description,
            context: task.context
          });

          return {
            ...result,
            title: task.title
          };
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      const totalCost = results.reduce(
        (sum, result) => sum + calculateCost(result.usage),
        0
      );

      const totalTime = Date.now() - startTime;
      const success = results.every(r => r.success);

      logger.info(`Ultrawork completed: ${results.filter(r => r.success).length}/${results.length} tasks succeeded`);

      return this.buildResult(results, totalTime, totalCost, success);

    } catch (error) {
      logger.error(`Ultrawork failed: ${error}`);
      
      return {
        success: false,
        results,
        totalCost: 0,
        totalTime: Date.now() - startTime,
        summary: `Ultrawork failed: ${error}`
      };
    }
  }

  /**
   * Build ultrawork result
   */
  private buildResult(
    results: Array<AgentResult & { title: string }>,
    totalTime: number,
    totalCost: number,
    success: boolean
  ): UltraworkResult {
    const summary = `
Ultrawork ${success ? 'Completed' : 'Completed with Failures'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tasks completed: ${results.filter(r => r.success).length}/${results.length}
Total time: ${formatDuration(totalTime)}
Total cost: ${formatCost(totalCost)}
${results.map((r, i) => `${i + 1}. ${r.title}: ${r.success ? '✓' : '✗'} (${formatDuration(r.executionTime)})`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return {
      success,
      results,
      totalCost,
      totalTime,
      summary
    };
  }
}
