/**
 * Autopilot CLI command
 */

import { OhMyCopilot } from '../../oh-my-copilot.js';
import { ui } from '../ui.js';

export interface AutopilotOptions {
  skipSecurity?: boolean;
  skipTests?: boolean;
  output?: string;
}

export async function autopilotCommand(
  task: string,
  options: AutopilotOptions
): Promise<void> {
  ui.header('🎯 Autopilot Mode');
  ui.info(`Task: ${task}`);
  
  if (options.skipSecurity) ui.warn('Security review will be skipped');
  if (options.skipTests) ui.warn('Testing will be skipped');

  const omc = new OhMyCopilot();

  try {
    ui.startSpinner('Running autopilot pipeline...');

    const result = await omc.autopilot(task, undefined, {
      skipSecurity: options.skipSecurity,
      skipTests: options.skipTests
    });

    if (result.success) {
      ui.succeedSpinner('Pipeline completed successfully!');
    } else {
      ui.failSpinner('Pipeline completed with failures');
    }

    // Show summary
    console.log('\n' + result.summary);

    // Show detailed results
    ui.header('Detailed Results');
    for (const agentResult of result.results) {
      console.log(chalk.bold(`\n${agentResult.agentName}:`));
      console.log(agentResult.content);
    }

    // Show cost report
    console.log('\n' + omc.getCostReport());

    // Save output if requested
    if (options.output) {
      const fs = await import('fs');
      const output = {
        task,
        result,
        costReport: omc.getCostReport()
      };
      fs.writeFileSync(options.output, JSON.stringify(output, null, 2));
      ui.success(`Results saved to ${options.output}`);
    }

  } catch (error) {
    ui.failSpinner('An error occurred');
    ui.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    omc.cleanup();
  }
}

// Need chalk import
import chalk from 'chalk';
