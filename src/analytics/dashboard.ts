/**
 * Dashboard
 * Combines cost tracking and metrics for a unified view
 */

import { CostTracker } from './cost-tracker.js';
import { Metrics } from './metrics.js';

export class Dashboard {
  private costTracker: CostTracker;
  private metrics: Metrics;

  constructor(costTracker: CostTracker, metrics: Metrics) {
    this.costTracker = costTracker;
    this.metrics = metrics;
  }

  /**
   * Get comprehensive dashboard report
   */
  getReport(): string {
    const costReport = this.costTracker.getReport();
    const metricsReport = this.metrics.getReport();

    return `
${costReport}

${metricsReport}
    `.trim();
  }

  /**
   * Get dashboard data as JSON
   */
  getData(): {
    costs: any;
    metrics: any;
    timestamp: number;
  } {
    return {
      costs: this.costTracker.getSummary(),
      metrics: this.metrics.getMetricNames().map(name => ({
        name,
        stats: this.metrics.getStats(name)
      })),
      timestamp: Date.now()
    };
  }
}
