/**
 * Swarm CLI command
 */

import { OhMyCopilot } from '../../oh-my-copilot.js';
import { ExecutorAgent } from '../../agents/executor.js';
import { QATesterAgent } from '../../agents/qa-tester.js';
import { TaskPriority } from '../../tasks/task-types.js';
import { ui } from '../ui.js';

export interface SwarmOptions {
  agents?: number;
  tasksFile?: string;
  pollInterval?: number;
}

export async function swarmCommand(
  tasks: string[],
  options: SwarmOptions
): Promise<void> {
  ui.header('🐝 Swarm Mode');

  const omc = new OhMyCopilot();
  const swarm = omc.getSwarm();
  const taskPool = omc.getTaskPool();

  // Register agents
  const agentCount = options.agents || 3;
  for (let i = 0; i < agentCount; i++) {
    const agent = i % 2 === 0 ? new ExecutorAgent() : new QATesterAgent();
    swarm.registerAgent(agent);
  }

  ui.success(`Registered ${agentCount} agents to the swarm`);

  // Load tasks
  let taskDescriptions: string[] = [];

  if (options.tasksFile) {
    try {
      const fs = await import('fs');
      const content = fs.readFileSync(options.tasksFile, 'utf-8');
      const parsed = JSON.parse(content);
      taskDescriptions = parsed.map((t: any) => t.description || t);
      ui.success(`Loaded ${taskDescriptions.length} tasks from ${options.tasksFile}`);
    } catch (error) {
      ui.error(`Failed to load tasks file: ${error}`);
      process.exit(1);
    }
  } else {
    taskDescriptions = tasks;
  }

  if (taskDescriptions.length === 0) {
    ui.error('No tasks specified');
    ui.info('Usage: omc swarm <task1> <task2> ... or use --tasks-file');
    process.exit(1);
  }

  // Add tasks to pool
  for (const description of taskDescriptions) {
    taskPool.createTask({
      title: description.substring(0, 50),
      description,
      priority: TaskPriority.MEDIUM
    });
  }

  ui.success(`Added ${taskDescriptions.length} tasks to the pool`);

  try {
    ui.startSpinner('Starting swarm...');
    ui.info('Press Ctrl+C to stop');

    // Start swarm
    const swarmPromise = swarm.start({
      pollInterval: options.pollInterval || 1000,
      stopWhenEmpty: true
    });

    // Monitor progress
    const monitorInterval = setInterval(() => {
      const status = swarm.getStatus();
      const stats = status.taskStats;
      
      ui.updateSpinner(
        `Active: ${status.agents.filter(a => a.isActive).length}/${status.agents.length} | ` +
        `Completed: ${stats.completed}/${stats.total} | ` +
        `Failed: ${stats.failed}`
      );
    }, 1000);

    await swarmPromise;

    clearInterval(monitorInterval);
    ui.succeedSpinner('Swarm completed');

    // Show final stats
    const stats = taskPool.getStats();
    ui.header('Results');
    console.log(`Total tasks: ${stats.total}`);
    console.log(`Completed: ${stats.completed}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Pending: ${stats.pending}`);

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
