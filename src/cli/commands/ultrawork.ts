/**
 * Ultrawork CLI command
 */

import { OhMyCopilot } from '../../oh-my-copilot.js';
import { ExecutorAgent } from '../../agents/executor.js';
import { ui } from '../ui.js';
import type { UltraworkTask } from '../../orchestrator/ultrawork.js';

export interface UltraworkOptions {
  concurrency?: number;
  tasksFile?: string;
}

export async function ultraworkCommand(
  tasks: string[],
  options: UltraworkOptions
): Promise<void> {
  ui.header('⚡ Ultrawork Mode');

  let taskList: UltraworkTask[] = [];

  // Load tasks from file if specified
  if (options.tasksFile) {
    try {
      const fs = await import('fs');
      const content = fs.readFileSync(options.tasksFile, 'utf-8');
      const parsed = JSON.parse(content);
      
      // Convert to UltraworkTask format
      taskList = parsed.map((t: any) => ({
        title: t.title || t.description,
        description: t.description,
        agent: new ExecutorAgent(),
        context: t.context
      }));

      ui.success(`Loaded ${taskList.length} tasks from ${options.tasksFile}`);
    } catch (error) {
      ui.error(`Failed to load tasks file: ${error}`);
      process.exit(1);
    }
  } else {
    // Create tasks from command line arguments
    taskList = tasks.map((task, index) => ({
      title: `Task ${index + 1}`,
      description: task,
      agent: new ExecutorAgent()
    }));
  }

  if (taskList.length === 0) {
    ui.error('No tasks specified');
    ui.info('Usage: omc ultrawork <task1> <task2> ... or use --tasks-file');
    process.exit(1);
  }

  ui.info(`Executing ${taskList.length} tasks in parallel`);
  if (options.concurrency) {
    ui.info(`Concurrency limit: ${options.concurrency}`);
  }

  const omc = new OhMyCopilot();

  try {
    ui.startSpinner('Running ultrawork...');

    const result = await omc.ultra(taskList, options.concurrency);

    if (result.success) {
      ui.succeedSpinner('All tasks completed successfully!');
    } else {
      ui.failSpinner('Some tasks failed');
    }

    // Show summary
    console.log('\n' + result.summary);

    // Show cost report
    console.log('\n' + omc.getCostReport());

  } catch (error) {
    ui.failSpinner('An error occurred');
    ui.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    omc.cleanup();
  }
}
