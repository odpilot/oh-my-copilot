/**
 * Swarm Example
 * Demonstrates task pool and swarm mode
 */

import { OhMyCopilot, TaskPriority } from '../src/index.js';
import { ExecutorAgent, QATesterAgent } from '../src/index.js';

async function main() {
  const omc = new OhMyCopilot({
    dbPath: './swarm-tasks.db',
    trackCosts: true,
    logLevel: 'info'
  });

  try {
    console.log('Running Swarm Mode...\n');

    // Get swarm and task pool
    const swarm = omc.getSwarm();
    const taskPool = omc.getTaskPool();

    // Register agents to the swarm
    for (let i = 0; i < 3; i++) {
      swarm.registerAgent(new ExecutorAgent());
    }
    swarm.registerAgent(new QATesterAgent());

    console.log('Registered 4 agents to the swarm');

    // Create tasks
    const tasks = [
      { title: 'Implement login', priority: TaskPriority.HIGH },
      { title: 'Implement registration', priority: TaskPriority.HIGH },
      { title: 'Create user profile page', priority: TaskPriority.MEDIUM },
      { title: 'Add password reset', priority: TaskPriority.MEDIUM },
      { title: 'Write authentication tests', priority: TaskPriority.CRITICAL },
      { title: 'Add email verification', priority: TaskPriority.LOW }
    ];

    for (const task of tasks) {
      taskPool.createTask({
        title: task.title,
        description: `Implementation task: ${task.title}`,
        priority: task.priority
      });
    }

    console.log(`Created ${tasks.length} tasks in the pool`);
    console.log('Starting swarm...\n');

    // Start swarm (will stop when all tasks are completed)
    await swarm.start({
      stopWhenEmpty: true,
      pollInterval: 1000
    });

    // Show final stats
    const stats = taskPool.getStats();
    console.log('\n=== Final Results ===');
    console.log(`Total: ${stats.total}`);
    console.log(`Completed: ${stats.completed}`);
    console.log(`Failed: ${stats.failed}`);

    // Show cost report
    console.log('\n' + omc.getCostReport());

  } finally {
    omc.cleanup();
  }
}

main().catch(console.error);
