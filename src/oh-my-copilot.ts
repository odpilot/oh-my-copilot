/**
 * Oh My Copilot
 * Main class for the multi-agent system
 */

import { Pipeline } from './orchestrator/pipeline.js';
import { Swarm } from './orchestrator/swarm.js';
import { Ultrawork } from './orchestrator/ultrawork.js';
import { Ecomode } from './orchestrator/ecomode.js';
import { Ralph } from './orchestrator/ralph.js';
import { Ultrapilot } from './orchestrator/ultrapilot.js';
import { TaskPool } from './tasks/task-pool.js';
import { keywordDetector, type ExecutionMode } from './keywords/detector.js';
import { CostTracker } from './analytics/cost-tracker.js';
import { Metrics } from './analytics/metrics.js';
import { Dashboard } from './analytics/dashboard.js';
import { logger, LogLevel } from './utils/logger.js';
import { mergeConfig, DEFAULT_CONFIG } from './config/default.js';
import type { OhMyCopilotConfig } from './config/types.js';
import type { PipelineResult } from './orchestrator/pipeline.js';
import type { UltraworkResult, UltraworkTask } from './orchestrator/ultrawork.js';
import type { EcomodeResult } from './orchestrator/ecomode.js';
import type { RalphResult } from './orchestrator/ralph.js';
import type { UltrapilotResult } from './orchestrator/ultrapilot.js';

export class OhMyCopilot {
  private config: OhMyCopilotConfig;
  private pipeline: Pipeline;
  private swarm: Swarm;
  private ultrawork: Ultrawork;
  private ecomode: Ecomode;
  private ralph: Ralph;
  private ultrapilot: Ultrapilot;
  private taskPool: TaskPool;
  private costTracker: CostTracker;
  private metrics: Metrics;
  private dashboard: Dashboard;

  constructor(config: OhMyCopilotConfig = {}) {
    // Merge configuration
    this.config = mergeConfig(config);

    // Setup logger
    if (this.config.logLevel) {
      logger.setLevel(
        this.config.logLevel === 'debug' ? LogLevel.DEBUG :
        this.config.logLevel === 'warn' ? LogLevel.WARN :
        this.config.logLevel === 'error' ? LogLevel.ERROR :
        LogLevel.INFO
      );
    }

    // Initialize analytics
    this.costTracker = new CostTracker(this.config.trackCosts);
    this.metrics = new Metrics();
    this.dashboard = new Dashboard(this.costTracker, this.metrics);

    // Initialize task pool
    this.taskPool = new TaskPool(this.config.dbPath);

    // Initialize orchestrators
    this.pipeline = new Pipeline();
    this.swarm = new Swarm(this.taskPool);
    this.ultrawork = new Ultrawork();
    this.ecomode = new Ecomode();
    this.ralph = new Ralph();
    this.ultrapilot = new Ultrapilot();

    logger.info('OhMyCopilot initialized');
  }

  /**
   * Execute a task with automatic mode detection
   */
  async run(input: string, context?: Record<string, any>): Promise<any> {
    // Detect execution mode from input
    const detection = keywordDetector.detect(input);
    
    logger.info(`Detected mode: ${detection.mode} (confidence: ${detection.confidence})`);

    switch (detection.mode) {
      case 'autopilot':
        return this.autopilot(input, context);
      
      case 'ultrawork':
        // For ultrawork, we'd need to parse tasks from input
        // This is a simplified version
        logger.warn('Ultrawork mode requires explicit task definition. Use autopilot() method instead.');
        return this.autopilot(input, context);
      
      case 'swarm':
        logger.info('Swarm mode requires setup. Use swarm() method directly.');
        return this.autopilot(input, context);
      
      case 'ecomode':
        return this.eco(input, context);
      
      default:
        // Default to autopilot for general tasks
        return this.autopilot(input, context);
    }
  }

  /**
   * Execute in autopilot mode (full pipeline)
   */
  async autopilot(
    task: string,
    context?: Record<string, any>,
    config?: { skipSecurity?: boolean; skipTests?: boolean }
  ): Promise<PipelineResult> {
    logger.info('Executing in Autopilot mode');
    const result = await this.pipeline.execute(task, context, config);
    
    // Track costs
    for (const agentResult of result.results) {
      this.costTracker.track(
        { ...agentResult.usage, model: agentResult.model },
        agentResult.agentName
      );
    }
    
    // Track metrics
    this.metrics.record('pipeline.execution_time', result.totalTime);
    this.metrics.record('pipeline.total_cost', result.totalCost);
    
    return result;
  }

  /**
   * Execute in ultrawork mode (parallel tasks)
   */
  async ultra(tasks: UltraworkTask[], concurrencyLimit?: number): Promise<UltraworkResult> {
    logger.info('Executing in Ultrawork mode');
    
    const result = concurrencyLimit
      ? await this.ultrawork.executeWithLimit(tasks, concurrencyLimit)
      : await this.ultrawork.execute(tasks);
    
    // Track costs
    for (const agentResult of result.results) {
      this.costTracker.track(
        { ...agentResult.usage, model: agentResult.model },
        agentResult.agentName
      );
    }
    
    // Track metrics
    this.metrics.record('ultrawork.execution_time', result.totalTime);
    this.metrics.record('ultrawork.total_cost', result.totalCost);
    this.metrics.record('ultrawork.task_count', tasks.length);
    
    return result;
  }

  /**
   * Execute in economy mode (cost-optimized)
   */
  async eco(
    task: string,
    context?: Record<string, any>,
    config?: { maxCostThreshold?: number }
  ): Promise<EcomodeResult> {
    logger.info('Executing in Ecomode');
    const result = await this.ecomode.execute(task, context, config);
    
    // Track costs
    for (const agentResult of result.results) {
      this.costTracker.track(
        { ...agentResult.usage, model: agentResult.model },
        agentResult.agentName
      );
    }
    
    // Track metrics
    this.metrics.record('ecomode.execution_time', result.totalTime);
    this.metrics.record('ecomode.total_cost', result.totalCost);
    this.metrics.record('ecomode.cost_savings', result.costSavings);
    
    return result;
  }

  /**
   * Execute in Ralph mode (guarantee completion)
   */
  async ralphMode(
    task: string,
    context?: Record<string, any>,
    config?: { maxRetries?: number; requiredChecks?: string[]; strictMode?: boolean }
  ): Promise<RalphResult> {
    logger.info('Executing in Ralph mode (Guarantee Completion)');
    const result = await this.ralph.execute(task, context, config);
    
    // Track costs
    for (const agentResult of result.results) {
      this.costTracker.track(
        { ...agentResult.usage, model: agentResult.model },
        agentResult.agentName
      );
    }
    
    // Track metrics
    this.metrics.record('ralph.execution_time', result.totalTime);
    this.metrics.record('ralph.total_cost', result.totalCost);
    this.metrics.record('ralph.retry_count', result.retryCount);
    this.metrics.record('ralph.verification_passed', result.completed ? 1 : 0);
    
    return result;
  }

  /**
   * Execute in Ultrapilot mode (advanced orchestration)
   */
  async ultrapilotMode(
    task: string,
    context?: Record<string, any>,
    config?: {
      skills?: string[];
      parallelExecution?: boolean;
      smartRouting?: boolean;
      autoDelegate?: boolean;
    }
  ): Promise<UltrapilotResult> {
    logger.info('Executing in Ultrapilot mode (Advanced Orchestration)');
    const result = await this.ultrapilot.execute(task, context, config);
    
    // Track costs
    for (const agentResult of result.results) {
      this.costTracker.track(
        { ...agentResult.usage, model: agentResult.model },
        agentResult.agentName
      );
    }
    
    // Track metrics
    this.metrics.record('ultrapilot.execution_time', result.totalTime);
    this.metrics.record('ultrapilot.total_cost', result.totalCost);
    this.metrics.record('ultrapilot.skills_used', result.skillsUsed.length);
    this.metrics.record('ultrapilot.delegations', result.delegations);
    
    return result;
  }

  /**
   * Get the swarm orchestrator for manual control
   */
  getSwarm(): Swarm {
    return this.swarm;
  }

  /**
   * Get the task pool
   */
  getTaskPool(): TaskPool {
    return this.taskPool;
  }

  /**
   * Get cost tracking report
   */
  getCostReport(): string {
    return this.costTracker.getReport();
  }

  /**
   * Get metrics report
   */
  getMetricsReport(): string {
    return this.metrics.getReport();
  }

  /**
   * Get full dashboard
   */
  getDashboard(): Dashboard {
    return this.dashboard;
  }

  /**
   * Get dashboard report
   */
  getDashboardReport(): string {
    return this.dashboard.getReport();
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.taskPool.close();
    logger.info('OhMyCopilot cleaned up');
  }
}
