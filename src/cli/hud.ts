/**
 * HUD Statusline
 * Real-time CLI status display for agent execution
 */

import chalk from 'chalk';
import { formatCost, formatDuration } from '../utils/helpers.js';

export interface StatusUpdate {
  mode: string;
  currentAgent?: string;
  activeAgents: string[];
  completedSteps: number;
  totalSteps: number;
  currentCost: number;
  elapsedTime: number;
  status: 'running' | 'success' | 'error' | 'warning';
  message?: string;
}

export class HUDStatusline {
  private lastUpdate: StatusUpdate | null = null;
  private startTime: number = Date.now();
  private updateInterval: NodeJS.Timeout | null = null;
  private isActive: boolean = false;

  /**
   * Start the HUD statusline
   */
  start(mode: string): void {
    this.startTime = Date.now();
    this.isActive = true;
    
    // Initial display
    console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') + chalk.bold(` ${mode.toUpperCase()} MODE - Live Status`.padEnd(62)) + chalk.bold.cyan('║'));
    console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════════╝\n'));
  }

  /**
   * Update the statusline with current information
   */
  update(status: StatusUpdate): void {
    if (!this.isActive) return;
    
    this.lastUpdate = status;
    this.render();
  }

  /**
   * Render the current status
   */
  private render(): void {
    if (!this.lastUpdate) return;

    const { 
      currentAgent, 
      activeAgents, 
      completedSteps, 
      totalSteps, 
      currentCost, 
      elapsedTime,
      status,
      message 
    } = this.lastUpdate;

    // Clear previous line (move cursor up and clear)
    if (process.stdout.isTTY) {
      process.stdout.write('\r\x1b[K');
    }

    // Status icon
    const statusIcon = this.getStatusIcon(status);
    
    // Progress bar
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    const progressBar = this.createProgressBar(progress, 20);
    
    // Active agents display
    const agentDisplay = activeAgents.length > 0 
      ? chalk.yellow(`[${activeAgents.join(', ')}]`)
      : chalk.gray('[Idle]');

    // Build status line
    const parts = [
      statusIcon,
      chalk.bold(`${completedSteps}/${totalSteps}`),
      progressBar,
      agentDisplay,
      chalk.green(formatCost(currentCost)),
      chalk.blue(formatDuration(elapsedTime))
    ];

    if (currentAgent) {
      parts.push(chalk.magenta(`→ ${currentAgent}`));
    }

    if (message) {
      parts.push(chalk.gray(`| ${message}`));
    }

    const statusLine = parts.join(' ');
    
    if (process.stdout.isTTY) {
      process.stdout.write(statusLine);
    } else {
      console.log(statusLine);
    }
  }

  /**
   * Get status icon
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case 'running':
        return chalk.blue('●');
      case 'success':
        return chalk.green('✓');
      case 'error':
        return chalk.red('✗');
      case 'warning':
        return chalk.yellow('⚠');
      default:
        return chalk.gray('○');
    }
  }

  /**
   * Create progress bar
   */
  private createProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    const percent = chalk.bold(`${Math.round(percentage)}%`);
    
    return `[${bar}] ${percent}`;
  }

  /**
   * Complete the statusline
   */
  complete(success: boolean, finalMessage?: string): void {
    if (!this.isActive) return;

    // Final update
    if (process.stdout.isTTY) {
      process.stdout.write('\n');
    }

    const icon = success ? chalk.green('✓') : chalk.red('✗');
    const statusText = success ? chalk.green('COMPLETED') : chalk.red('FAILED');
    
    console.log(chalk.bold(`\n${icon} ${statusText}`));
    
    if (finalMessage) {
      console.log(chalk.gray(finalMessage));
    }

    if (this.lastUpdate) {
      console.log(chalk.gray(`Total time: ${formatDuration(this.lastUpdate.elapsedTime)}`));
      console.log(chalk.gray(`Total cost: ${formatCost(this.lastUpdate.currentCost)}`));
    }

    this.stop();
  }

  /**
   * Stop the statusline
   */
  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isActive = false;
    
    if (process.stdout.isTTY) {
      console.log(); // New line after status
    }
  }

  /**
   * Show a step message
   */
  step(stepNumber: number, totalSteps: number, message: string): void {
    if (!this.isActive) return;
    
    if (process.stdout.isTTY) {
      console.log(); // New line before step
    }
    
    const stepLabel = chalk.bold.cyan(`Step ${stepNumber}/${totalSteps}:`);
    console.log(`${stepLabel} ${message}`);
  }

  /**
   * Show agent activity
   */
  agentActivity(agentName: string, action: string): void {
    if (!this.isActive) return;
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(chalk.gray(`[${timestamp}]`) + ` ${chalk.yellow(agentName)} ${action}`);
  }

  /**
   * Show verification check result
   */
  verificationCheck(checkName: string, passed: boolean, evidence?: string): void {
    if (!this.isActive) return;
    
    const icon = passed ? chalk.green('✓') : chalk.red('✗');
    const status = passed ? chalk.green('PASS') : chalk.red('FAIL');
    
    console.log(`  ${icon} ${checkName.padEnd(20)} ${status}`);
    
    if (evidence && !passed) {
      console.log(chalk.gray(`     ${evidence}`));
    }
  }

  /**
   * Show cost update
   */
  costUpdate(agentName: string, cost: number, totalCost: number): void {
    if (!this.isActive) return;
    
    console.log(
      chalk.gray(`  💰 ${agentName}: `) + 
      chalk.yellow(formatCost(cost)) + 
      chalk.gray(` (total: ${formatCost(totalCost)})`)
    );
  }
}

// Create singleton instance
export const hud = new HUDStatusline();
