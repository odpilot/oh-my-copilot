/**
 * Metrics Collector
 * Collects and aggregates performance metrics
 */

import { logger } from '../utils/logger.js';

export interface MetricEntry {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface MetricStats {
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
}

export class Metrics {
  private entries: MetricEntry[] = [];

  /**
   * Record a metric
   */
  record(name: string, value: number, tags?: Record<string, string>): void {
    this.entries.push({
      name,
      value,
      timestamp: Date.now(),
      tags
    });

    logger.debug(`Metric recorded: ${name} = ${value}`);
  }

  /**
   * Get statistics for a metric
   */
  getStats(name: string): MetricStats | null {
    const values = this.entries
      .filter(e => e.name === name)
      .map(e => e.value);

    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      sum,
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  /**
   * Get all metric names
   */
  getMetricNames(): string[] {
    return [...new Set(this.entries.map(e => e.name))];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.entries = [];
    logger.info('Metrics cleared');
  }

  /**
   * Get formatted report
   */
  getReport(): string {
    const names = this.getMetricNames();
    
    if (names.length === 0) {
      return 'No metrics recorded';
    }

    let report = 'Metrics Report\n';
    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

    for (const name of names) {
      const stats = this.getStats(name);
      if (stats) {
        report += `${name}:\n`;
        report += `  Count: ${stats.count}\n`;
        report += `  Avg: ${stats.avg.toFixed(2)}\n`;
        report += `  Min: ${stats.min}\n`;
        report += `  Max: ${stats.max}\n`;
        report += `  Sum: ${stats.sum}\n\n`;
      }
    }

    report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    return report;
  }
}
