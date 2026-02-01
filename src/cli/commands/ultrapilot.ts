/**
 * Ultrapilot Command
 * Advanced orchestration with skill composition
 */

import chalk from 'chalk';
import ora from 'ora';
import { OhMyCopilot } from '../../oh-my-copilot.js';

export async function ultrapilotCommand(task: string, options: any) {
  console.log(chalk.bold.magenta('🚀 Ultrapilot Mode - Advanced Orchestration\n'));
  
  const spinner = ora('Initializing Ultrapilot mode...').start();

  try {
    const omc = new OhMyCopilot({
      trackCosts: true,
      logLevel: 'info'
    });

    // Parse skills from options
    const skills = options.skills ? options.skills.split(',') : ['default'];
    
    spinner.text = 'Executing with intelligent routing...';

    const result = await omc.ultrapilotMode(task, undefined, {
      skills,
      parallelExecution: options.parallel || false,
      smartRouting: options.smartRouting !== false, // Default to true
      autoDelegate: options.autoDelegate !== false, // Default to true
      maxConcurrency: options.concurrency ? parseInt(options.concurrency) : undefined
    });

    spinner.stop();

    // Display results
    console.log(result.summary);
    console.log();

    // Display skills used
    if (result.skillsUsed && result.skillsUsed.length > 0) {
      console.log(chalk.bold.cyan('Skills Activated:'));
      result.skillsUsed.forEach(skill => {
        console.log(chalk.cyan(`  • ${skill.name} (${skill.type}): ${skill.description}`));
      });
      console.log();
    }

    // Display delegation info
    if (result.delegations > 0) {
      console.log(chalk.bold.green(`✓ Auto-delegated to ${result.delegations} specialized agents`));
      console.log();
    }

    // Cost report
    if (result.totalCost > 0) {
      console.log(chalk.bold.yellow('Cost Summary:'));
      console.log(`  Total Cost: ${chalk.green('$' + result.totalCost.toFixed(4))}`);
      console.log(`  Skills Used: ${result.skillsUsed.length}`);
      console.log(`  Delegations: ${result.delegations}`);
    }

    // Save to file if requested
    if (options.output) {
      const fs = await import('fs/promises');
      await fs.writeFile(options.output, JSON.stringify(result, null, 2));
      console.log(chalk.gray(`\nResults saved to ${options.output}`));
    }

    // Cleanup
    omc.cleanup();

    process.exit(result.success ? 0 : 1);

  } catch (error) {
    spinner.fail('Ultrapilot mode failed');
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}
