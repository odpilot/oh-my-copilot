/**
 * Cost Tracker
 * Tracks API usage costs across all agent interactions
 */

import { logger } from '../utils/logger.js';
import { calculateCost, formatCost, type TokenCost } from '../utils/helpers.js';

export interface CostEntry {
  timestamp: number;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  agentName?: string;
  taskId?: string;
}

export interface CostSummary {
  totalCost: number;
  totalTokens: number;
  totalRequests: number;
  costByModel: Record<string, number>;
  costByAgent: Record<string, number>;
}

export class CostTracker {
  private entries: CostEntry[] = [];
  private enabled: boolean;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
    logger.info(`CostTracker initialized (${enabled ? 'enabled' : 'disabled'})`);
  }

  /**
   * Track a new cost entry
   */
  track(usage: TokenCost, agentName?: string, taskId?: string): void {
    if (!this.enabled) return;

    const cost = calculateCost(usage);
    
    const entry: CostEntry = {
      timestamp: Date.now(),
      model: usage.model,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.promptTokens + usage.completionTokens,
      cost,
      agentName,
      taskId
    };

    this.entries.push(entry);
    
    logger.debug(
      `Cost tracked: ${formatCost(cost)} for ${agentName || 'unknown'} using ${usage.model}`
    );
  }

  /**
   * Get summary of all costs
   */
  getSummary(): CostSummary {
    const summary: CostSummary = {
      totalCost: 0,
      totalTokens: 0,
      totalRequests: this.entries.length,
      costByModel: {},
      costByAgent: {}
    };

    for (const entry of this.entries) {
      summary.totalCost += entry.cost;
      summary.totalTokens += entry.totalTokens;

      // Group by model
      if (!summary.costByModel[entry.model]) {
        summary.costByModel[entry.model] = 0;
      }
      summary.costByModel[entry.model] += entry.cost;

      // Group by agent
      if (entry.agentName) {
        if (!summary.costByAgent[entry.agentName]) {
          summary.costByAgent[entry.agentName] = 0;
        }
        summary.costByAgent[entry.agentName] += entry.cost;
      }
    }

    return summary;
  }

  /**
   * Get entries within a time range
   */
  getEntriesInRange(startTime: number, endTime: number): CostEntry[] {
    return this.entries.filter(
      entry => entry.timestamp >= startTime && entry.timestamp <= endTime
    );
  }

  /**
   * Get entries for a specific agent
   */
  getEntriesByAgent(agentName: string): CostEntry[] {
    return this.entries.filter(entry => entry.agentName === agentName);
  }

  /**
   * Get entries for a specific task
   */
  getEntriesByTask(taskId: string): CostEntry[] {
    return this.entries.filter(entry => entry.taskId === taskId);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = [];
    logger.info('Cost tracker cleared');
  }

  /**
   * Export entries as JSON
   */
  export(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * Get formatted report
   */
  getReport(): string {
    const summary = this.getSummary();

    let report = `
Cost Tracking Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost: ${formatCost(summary.totalCost)}
Total Tokens: ${summary.totalTokens.toLocaleString()}
Total Requests: ${summary.totalRequests}

Cost by Model:
${Object.entries(summary.costByModel)
  .map(([model, cost]) => `  ${model}: ${formatCost(cost)}`)
  .join('\n')}

Cost by Agent:
${Object.entries(summary.costByAgent)
  .map(([agent, cost]) => `  ${agent}: ${formatCost(cost)}`)
  .join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return report;
  }
}
