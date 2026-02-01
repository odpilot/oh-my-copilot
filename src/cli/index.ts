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
import { templatesCommand } from './commands/templates.js';
import { pluginsCommand } from './commands/plugins.js';
import { ralphCommand } from './commands/ralph.js';
import { ultrapilotCommand } from './commands/ultrapilot.js';
import { stateCommand } from './commands/state.js';

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

// Ultrapilot command (NEW)
program
  .command('ultrapilot <task>')
  .alias('up')
  .description('Advanced orchestration with skill composition and smart routing')
  .option('--skills <skills>', 'Comma-separated list of skills (default,ultrawork,ralph,etc.)')
  .option('--parallel', 'Enable parallel execution')
  .option('--no-smart-routing', 'Disable smart model routing')
  .option('--no-auto-delegate', 'Disable automatic delegation')
  .option('-c, --concurrency <number>', 'Maximum concurrent tasks', parseInt)
  .option('-o, --output <file>', 'Save results to file')
  .action(ultrapilotCommand);

// Ralph command (NEW)
program
  .command('ralph <task>')
  .description('Guarantee completion with verification and evidence-based checks')
  .option('--max-retries <number>', 'Maximum retry attempts', parseInt)
  .option('--checks <checks>', 'Comma-separated verification checks (BUILD,TEST,LINT,etc.)')
  .option('--strict', 'Enable strict mode (all checks must pass)')
  .option('-o, --output <file>', 'Save results to file')
  .action(ralphCommand);

// State command (NEW)
program
  .command('state <action>')
  .description('View and manage session state and wisdom (actions: sessions, wisdom, stats, clean)')
  .option('-l, --limit <number>', 'Limit number of results', parseInt)
  .option('--category <category>', 'Filter wisdom by category (success, failure, optimization, insight)')
  .option('--tags <tags>', 'Filter wisdom by tags (comma-separated)')
  .option('--days <days>', 'Days to keep for clean action', parseInt)
  .action(stateCommand);

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

// Web UI command
program
  .command('web')
  .description('Start Web UI dashboard')
  .option('-p, --port <number>', 'Port number', parseInt)
  .action(async (options) => {
    const { startServer } = await import('../web/server.js');
    
    const port = options.port || 3000;
    
    console.log('Starting Oh My Copilot Web UI...');
    startServer({ port });
  });

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

// Templates command
program
  .command('templates <action> [templateId]')
  .description('Manage and execute task templates (actions: list, show, run)')
  .option('-c, --category <category>', 'Filter by category (for list)')
  .option('-i, --interactive', 'Interactive mode (for run)')
  .option('--resourceName <name>', 'Template variable')
  .option('--framework <name>', 'Template variable')
  .option('--database <name>', 'Template variable')
  .option('--includeTests <boolean>', 'Template variable')
  .option('--codeLocation <path>', 'Template variable')
  .option('--focusArea <area>', 'Template variable')
  .option('--sourceFile <path>', 'Template variable')
  .option('--testFramework <name>', 'Template variable')
  .option('--coverageTarget <number>', 'Template variable', parseInt)
  .option('--projectPath <path>', 'Template variable')
  .option('--docType <type>', 'Template variable')
  .option('--format <format>', 'Template variable')
  .option('--targetFile <path>', 'Template variable')
  .option('--refactoringGoal <goal>', 'Template variable')
  .option('--bugDescription <desc>', 'Template variable')
  .option('--affectedArea <area>', 'Template variable')
  .option('--severity <level>', 'Template variable')
  .option('--featureName <name>', 'Template variable')
  .option('--featureDescription <desc>', 'Template variable')
  .option('--complexity <level>', 'Template variable')
  .option('--auditScope <path>', 'Template variable')
  .option('--auditDepth <depth>', 'Template variable')
  .action(templatesCommand);

// Plugins command
program
  .command('plugins <action> [pluginName]')
  .description('Manage plugins (actions: list, load, install, unload, info)')
  .option('--config <json>', 'Plugin configuration (JSON string)')
  .action(pluginsCommand);

// Show banner on help
program.on('--help', () => {
  console.log('');
  console.log(chalk.cyan('  Examples:'));
  console.log('');
  console.log(chalk.gray('    # Run autopilot mode'));
  console.log('    $ omc autopilot "Build a REST API with Express"');
  console.log('');
  console.log(chalk.gray('    # Ultrapilot mode (advanced orchestration)'));
  console.log('    $ omc ultrapilot "Build microservices" --smart-routing --auto-delegate');
  console.log('');
  console.log(chalk.gray('    # Ralph mode (guarantee completion)'));
  console.log('    $ omc ralph "Implement auth" --strict --max-retries 3');
  console.log('');
  console.log(chalk.gray('    # View session history'));
  console.log('    $ omc state sessions');
  console.log('');
  console.log(chalk.gray('    # View captured wisdom'));
  console.log('    $ omc state wisdom --category success');
  console.log('');
  console.log(chalk.gray('    # View agent statistics'));
  console.log('    $ omc state stats');
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
  console.log(chalk.gray('    # Start Web UI'));
  console.log('    $ omc web --port 3000');
  console.log('');
});

program.parse();
