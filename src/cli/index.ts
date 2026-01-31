/**
 * CLI Entry Point
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { autopilotCommand } from './commands/autopilot.js';
import { chatCommand } from './commands/chat.js';
import { ultraworkCommand } from './commands/ultrawork.js';
import { swarmCommand } from './commands/swarm.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('omc')
  .description('Oh My Copilot - A multi-agent system built with GitHub Copilot SDK')
  .version('0.1.0');

// Config command
program
  .command('config')
  .description('Interactive configuration for API keys and models')
  .action(configCommand);

// Autopilot command
program
  .command('autopilot <task>')
  .alias('ap')
  .description('Run full automated pipeline (planning → execution → testing → security)')
  .option('--skip-security', 'Skip security review')
  .option('--skip-tests', 'Skip testing phase')
  .option('-o, --output <file>', 'Save results to file')
  .action(autopilotCommand);

// Chat command
program
  .command('chat')
  .description('Interactive chat mode with automatic mode detection')
  .action(chatCommand);

// Ultrawork command
program
  .command('ultrawork [tasks...]')
  .alias('ulw')
  .description('Execute multiple tasks in parallel')
  .option('-c, --concurrency <number>', 'Maximum concurrent tasks', parseInt)
  .option('--tasks-file <file>', 'Load tasks from JSON file')
  .action(ultraworkCommand);

// Swarm command
program
  .command('swarm [tasks...]')
  .description('Start swarm mode with task claiming')
  .option('-a, --agents <number>', 'Number of agents', parseInt)
  .option('--tasks-file <file>', 'Load tasks from JSON file')
  .option('--poll-interval <ms>', 'Task polling interval in ms', parseInt)
  .action(swarmCommand);

// Eco command (alias to autopilot with cost optimization)
program
  .command('eco <task>')
  .description('Run in economy mode (cost-optimized)')
  .option('-o, --output <file>', 'Save results to file')
  .action(async (task, options) => {
    const { OhMyCopilot } = await import('../oh-my-copilot.js');
    const { ui } = await import('./ui.js');
    
    ui.header('💰 Economy Mode');
    ui.info(`Task: ${task}`);

    const omc = new OhMyCopilot();

    try {
      ui.startSpinner('Running in economy mode...');

      const result = await omc.eco(task);

      if (result.success) {
        ui.succeedSpinner('Completed successfully!');
      } else {
        ui.failSpinner('Completed with failures');
      }

      console.log('\n' + result.summary);
      console.log('\n' + omc.getCostReport());

      if (options.output) {
        const fs = await import('fs');
        const output = { task, result, costReport: omc.getCostReport() };
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
  });

// Show banner on help
program.on('--help', () => {
  console.log('');
  console.log(chalk.cyan('  Examples:'));
  console.log('');
  console.log(chalk.gray('    # Run autopilot mode'));
  console.log('    $ omc autopilot "Build a REST API with Express"');
  console.log('');
  console.log(chalk.gray('    # Interactive chat'));
  console.log('    $ omc chat');
  console.log('');
  console.log(chalk.gray('    # Parallel execution'));
  console.log('    $ omc ultrawork "Task 1" "Task 2" "Task 3"');
  console.log('');
  console.log(chalk.gray('    # Swarm mode'));
  console.log('    $ omc swarm --agents 5 --tasks-file tasks.json');
  console.log('');
  console.log(chalk.gray('    # Economy mode'));
  console.log('    $ omc eco "Simple implementation task"');
  console.log('');
});

program.parse();
