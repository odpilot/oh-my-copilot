/**
 * Ralph Command
 * Guarantee completion mode with verification
 */

import chalk from 'chalk';
import ora from 'ora';
import { OhMyCopilot } from '../../oh-my-copilot.js';

export async function ralphCommand(task: string, options: any) {
  console.log(chalk.bold.green('🎯 Ralph Mode - Guarantee Completion\n'));
  
  const spinner = ora('Initializing Ralph mode...').start();

  try {
    const omc = new OhMyCopilot({
      trackCosts: true,
      logLevel: 'info'
    });

    spinner.text = 'Executing with verification...';

    const result = await omc.ralphMode(task, undefined, {
      maxRetries: options.maxRetries || 3,
      requiredChecks: options.checks ? options.checks.split(',') : ['BUILD', 'TEST', 'FUNCTIONALITY'],
      strictMode: options.strict || false,
      evidenceRequired: true
    });

    spinner.stop();

    // Display results
    console.log(result.summary);
    console.log();

    // Display verification checks
    if (result.verificationChecks && result.verificationChecks.length > 0) {
      console.log(chalk.bold.cyan('Verification Checks:'));
      result.verificationChecks.forEach(check => {
        const icon = check.passed ? '✓' : '✗';
        const color = check.passed ? chalk.green : chalk.red;
        const required = check.required ? ' (required)' : '';
        console.log(color(`  ${icon} ${check.name}${required}`));
      });
      console.log();
    }

    // Cost report
    if (result.totalCost > 0) {
      console.log(chalk.bold.yellow('Cost Summary:'));
      console.log(`  Total Cost: ${chalk.green('$' + result.totalCost.toFixed(4))}`);
      console.log(`  Retry Count: ${result.retryCount}`);
    }

    // Save to file if requested
    if (options.output) {
      const fs = await import('fs/promises');
      await fs.writeFile(options.output, JSON.stringify(result, null, 2));
      console.log(chalk.gray(`\nResults saved to ${options.output}`));
    }

    // Cleanup
    omc.cleanup();

    // Exit code based on completion
    process.exit(result.completed ? 0 : 1);

  } catch (error) {
    spinner.fail('Ralph mode failed');
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}
