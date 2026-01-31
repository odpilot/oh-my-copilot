/**
 * Chat CLI command
 */

import inquirer from 'inquirer';
import { OhMyCopilot } from '../../oh-my-copilot.js';
import { ui } from '../ui.js';
import chalk from 'chalk';

export async function chatCommand(): Promise<void> {
  ui.header('💬 Interactive Chat Mode');
  ui.info('Type your tasks and I\'ll detect the best execution mode.');
  ui.info('Commands: /autopilot, /eco, /exit, /help, /cost');
  console.log();

  const omc = new OhMyCopilot();
  let running = true;

  while (running) {
    try {
      const { input } = await inquirer.prompt([
        {
          type: 'input',
          name: 'input',
          message: chalk.cyan('You:'),
          prefix: ''
        }
      ]);

      const trimmed = input.trim();

      // Handle commands
      if (trimmed.startsWith('/')) {
        switch (trimmed.toLowerCase()) {
          case '/exit':
          case '/quit':
            running = false;
            ui.success('Goodbye!');
            break;

          case '/help':
            showHelp();
            break;

          case '/cost':
            console.log('\n' + omc.getCostReport());
            break;

          case '/metrics':
            console.log('\n' + omc.getMetricsReport());
            break;

          case '/dashboard':
            console.log('\n' + omc.getDashboardReport());
            break;

          default:
            ui.warn(`Unknown command: ${trimmed}`);
            ui.info('Type /help for available commands');
        }
        continue;
      }

      if (!trimmed) continue;

      // Process the input
      ui.startSpinner('Processing...');

      const result = await omc.run(trimmed);

      ui.succeedSpinner('Done!');
      
      console.log(chalk.bold('\nAssistant:'));
      console.log(result.summary || 'Task completed');
      console.log();

    } catch (error) {
      ui.failSpinner('Error occurred');
      ui.error(error instanceof Error ? error.message : String(error));
    }
  }

  omc.cleanup();
}

function showHelp(): void {
  ui.box(`Available Commands:
  
/help       - Show this help message
/exit       - Exit chat mode
/cost       - Show cost report
/metrics    - Show metrics report
/dashboard  - Show full dashboard

Keywords for automatic mode detection:
- autopilot, build me  → Full pipeline
- ultrawork, ulw       → Parallel execution
- eco, budget          → Economy mode
- swarm                → Swarm mode`, 'Chat Commands');
}
