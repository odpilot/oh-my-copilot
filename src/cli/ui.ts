/**
 * CLI UI Components
 * Provides formatted output using chalk and ora
 */

import chalk from 'chalk';
import ora, { type Ora } from 'ora';

export class UI {
  private spinner: Ora | null = null;

  /**
   * Show success message
   */
  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  /**
   * Show error message
   */
  error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  /**
   * Show warning message
   */
  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Show info message
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Show section header
   */
  header(title: string): void {
    console.log();
    console.log(chalk.bold.cyan(title));
    console.log(chalk.cyan('═'.repeat(title.length)));
  }

  /**
   * Show formatted box
   */
  box(content: string, title?: string): void {
    const lines = content.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const width = Math.max(maxLength, title ? title.length : 0) + 4;

    console.log();
    console.log(chalk.cyan('┌' + '─'.repeat(width - 2) + '┐'));
    
    if (title) {
      console.log(chalk.cyan('│') + chalk.bold(` ${title.padEnd(width - 4)} `) + chalk.cyan('│'));
      console.log(chalk.cyan('├' + '─'.repeat(width - 2) + '┤'));
    }
    
    for (const line of lines) {
      console.log(chalk.cyan('│') + ` ${line.padEnd(width - 4)} ` + chalk.cyan('│'));
    }
    
    console.log(chalk.cyan('└' + '─'.repeat(width - 2) + '┘'));
    console.log();
  }

  /**
   * Start a spinner
   */
  startSpinner(text: string): void {
    this.spinner = ora(text).start();
  }

  /**
   * Update spinner text
   */
  updateSpinner(text: string): void {
    if (this.spinner) {
      this.spinner.text = text;
    }
  }

  /**
   * Stop spinner with success
   */
  succeedSpinner(text?: string): void {
    if (this.spinner) {
      this.spinner.succeed(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with failure
   */
  failSpinner(text?: string): void {
    if (this.spinner) {
      this.spinner.fail(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner
   */
  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  /**
   * Show table
   */
  table(headers: string[], rows: string[][]): void {
    const colWidths = headers.map((h, i) => {
      const maxRowWidth = Math.max(...rows.map(r => (r[i] || '').length));
      return Math.max(h.length, maxRowWidth);
    });

    // Header
    console.log();
    console.log(chalk.bold(
      headers.map((h, i) => h.padEnd(colWidths[i])).join('  ')
    ));
    console.log(chalk.gray(
      colWidths.map(w => '─'.repeat(w)).join('  ')
    ));

    // Rows
    for (const row of rows) {
      console.log(
        row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join('  ')
      );
    }
    console.log();
  }
}

// Singleton instance
export const ui = new UI();
