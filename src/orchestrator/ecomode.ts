/**
 * Ecomode
 * Cost-optimized execution mode
 */

import { ExecutorAgent } from '../agents/executor.js';
import { QATesterAgent } from '../agents/qa-tester.js';
import type { AgentResult } from '../agents/base-agent.js';
import { logger } from '../utils/logger.js';
import { calculateCost, formatCost, formatDuration } from '../utils/helpers.js';

export interface EcomodeConfig {
  preferMiniModels?: boolean;
  skipSecurityReview?: boolean;
  maxCostThreshold?: number; // in dollars
}

export interface EcomodeResult {
  success: boolean;
  results: AgentResult[];
  totalCost: number;
  totalTime: number;
  summary: string;
  costSavings: number;
}

export class Ecomode {
  private executor: ExecutorAgent;
  private qaTester: QATesterAgent;

  constructor() {
    // Use mini models for cost efficiency
    this.executor = new ExecutorAgent('gpt-4o-mini');
    this.qaTester = new QATesterAgent('gpt-4o-mini');
    
    logger.info('Ecomode initialized with cost-optimized models');
  }

  /**
   * Execute task in economy mode
   */
  async execute(
    task: string,
    context?: Record<string, any>,
    config: EcomodeConfig = {}
  ): Promise<EcomodeResult> {
    const startTime = Date.now();
    const results: AgentResult[] = [];
    let totalCost = 0;

    try {
      logger.info('💰 Starting Ecomode (Cost-Optimized)');

      // Step 1: Implementation with mini model
      logger.info('Step 1/2: Implementation with cost-optimized model...');
      const implementResult = await this.executor.execute({
        task,
        context
      });
      results.push(implementResult);
      totalCost += calculateCost({ ...implementResult.usage, model: implementResult.model });

      // Check cost threshold
      if (config.maxCostThreshold && totalCost > config.maxCostThreshold) {
        logger.warn(`Cost threshold exceeded: ${formatCost(totalCost)}`);
        return this.buildResult(results, startTime, totalCost, false);
      }

      // Step 2: Basic testing (optional)
      logger.info('Step 2/2: Basic testing...');
      const testResult = await this.qaTester.execute({
        task: 'Write essential tests for the implementation',
        context,
        previousResults: results
      });
      results.push(testResult);
      totalCost += calculateCost({ ...testResult.usage, model: testResult.model });

      // Check cost threshold again
      if (config.maxCostThreshold && totalCost > config.maxCostThreshold) {
        logger.warn(`Cost threshold exceeded: ${formatCost(totalCost)}`);
      }

      const success = results.every(r => r.success);
      logger.info('✅ Ecomode completed');

      return this.buildResult(results, startTime, totalCost, success);

    } catch (error) {
      logger.error(`Ecomode failed: ${error}`);
      return this.buildResult(results, startTime, totalCost, false);
    }
  }

  /**
   * Build ecomode result
   */
  private buildResult(
    results: AgentResult[],
    startTime: number,
    totalCost: number,
    success: boolean
  ): EcomodeResult {
    const totalTime = Date.now() - startTime;
    
    // Estimate cost savings compared to full pipeline with premium models
    // Rough estimate: full pipeline with GPT-4o would cost ~3-4x more
    const estimatedFullCost = totalCost * 3.5;
    const costSavings = estimatedFullCost - totalCost;

    const summary = `
Ecomode ${success ? 'Completed' : 'Failed'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Steps completed: ${results.length}
Total time: ${formatDuration(totalTime)}
Total cost: ${formatCost(totalCost)}
Estimated savings: ${formatCost(costSavings)} (vs. full pipeline)
${results.map((r, i) => `${i + 1}. ${r.agentName}: ${r.success ? '✓' : '✗'} (${formatDuration(r.executionTime)})`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return {
      success,
      results,
      totalCost,
      totalTime,
      summary,
      costSavings
    };
  }
}
