/**
 * Pipeline Mode (Autopilot)
 * Fully automated pipeline: Planning → Execution → Testing → Security Review
 */

import { ArchitectAgent } from '../agents/architect.js';
import { ExecutorAgent } from '../agents/executor.js';
import { QATesterAgent } from '../agents/qa-tester.js';
import { SecurityAgent } from '../agents/security.js';
import type { AgentResult } from '../agents/base-agent.js';
import { logger } from '../utils/logger.js';
import { calculateCost, formatCost, formatDuration } from '../utils/helpers.js';

export interface PipelineConfig {
  skipSecurity?: boolean;
  skipTests?: boolean;
  continueOnFailure?: boolean;
}

export interface PipelineResult {
  success: boolean;
  results: AgentResult[];
  totalCost: number;
  totalTime: number;
  summary: string;
}

export class Pipeline {
  private architect: ArchitectAgent;
  private executor: ExecutorAgent;
  private qaTester: QATesterAgent;
  private security: SecurityAgent;

  constructor() {
    this.architect = new ArchitectAgent();
    this.executor = new ExecutorAgent();
    this.qaTester = new QATesterAgent();
    this.security = new SecurityAgent();
    
    logger.info('Pipeline initialized');
  }

  /**
   * Execute the full pipeline
   */
  async execute(
    task: string,
    context?: Record<string, any>,
    config: PipelineConfig = {}
  ): Promise<PipelineResult> {
    const startTime = Date.now();
    const results: AgentResult[] = [];
    let totalCost = 0;

    try {
      logger.info('🎯 Starting Pipeline Mode (Autopilot)');
      
      // Step 1: Planning (Architect)
      logger.info('Step 1/4: Planning with Architect...');
      const planResult = await this.architect.execute({
        task,
        context
      });
      results.push(planResult);
      totalCost += calculateCost(planResult.usage);

      if (!planResult.success && !config.continueOnFailure) {
        return this.buildResult(results, startTime, totalCost, false);
      }

      // Step 2: Implementation (Executor)
      logger.info('Step 2/4: Implementation with Executor...');
      const implementResult = await this.executor.execute({
        task,
        context,
        previousResults: results
      });
      results.push(implementResult);
      totalCost += calculateCost(implementResult.usage);

      if (!implementResult.success && !config.continueOnFailure) {
        return this.buildResult(results, startTime, totalCost, false);
      }

      // Step 3: Testing (QA Tester) - Optional
      if (!config.skipTests) {
        logger.info('Step 3/4: Testing with QA Tester...');
        const testResult = await this.qaTester.execute({
          task: 'Write comprehensive tests for the implementation',
          context,
          previousResults: results
        });
        results.push(testResult);
        totalCost += calculateCost(testResult.usage);

        if (!testResult.success && !config.continueOnFailure) {
          return this.buildResult(results, startTime, totalCost, false);
        }
      }

      // Step 4: Security Review (Security Agent) - Optional
      if (!config.skipSecurity) {
        logger.info('Step 4/4: Security Review...');
        const securityResult = await this.security.execute({
          task: 'Review the implementation for security vulnerabilities',
          context,
          previousResults: results
        });
        results.push(securityResult);
        totalCost += calculateCost(securityResult.usage);

        if (!securityResult.success && !config.continueOnFailure) {
          return this.buildResult(results, startTime, totalCost, false);
        }
      }

      logger.info('✅ Pipeline completed successfully');
      return this.buildResult(results, startTime, totalCost, true);

    } catch (error) {
      logger.error(`Pipeline failed: ${error}`);
      return this.buildResult(results, startTime, totalCost, false);
    }
  }

  /**
   * Build pipeline result
   */
  private buildResult(
    results: AgentResult[],
    startTime: number,
    totalCost: number,
    success: boolean
  ): PipelineResult {
    const totalTime = Date.now() - startTime;
    
    const summary = `
Pipeline ${success ? 'Completed' : 'Failed'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Steps completed: ${results.length}
Total time: ${formatDuration(totalTime)}
Total cost: ${formatCost(totalCost)}
${results.map((r, i) => `${i + 1}. ${r.agentName}: ${r.success ? '✓' : '✗'} (${formatDuration(r.executionTime)})`).join('\n')}
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
