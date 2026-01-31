/**
 * Ultrawork Example
 * Demonstrates parallel task execution
 */

import { OhMyCopilot } from '../src/index.js';
import { ExecutorAgent, QATesterAgent } from '../src/index.js';

async function main() {
  const omc = new OhMyCopilot({
    trackCosts: true,
    logLevel: 'info'
  });

  try {
    console.log('Running Ultrawork Mode...\n');

    // Define multiple tasks to run in parallel
    const tasks = [
      {
        title: 'User Model',
        description: 'Create a User model with TypeScript',
        agent: new ExecutorAgent()
      },
      {
        title: 'Product Model',
        description: 'Create a Product model with TypeScript',
        agent: new ExecutorAgent()
      },
      {
        title: 'Order Model',
        description: 'Create an Order model with TypeScript',
        agent: new ExecutorAgent()
      },
      {
        title: 'API Tests',
        description: 'Write integration tests for the API',
        agent: new QATesterAgent()
      }
    ];

    // Execute all tasks in parallel
    const result = await omc.ultra(tasks);

    // Show results
    console.log('\n' + result.summary);

    // Show individual task results
    console.log('\n=== Task Details ===\n');
    for (const taskResult of result.results) {
      console.log(`\n--- ${taskResult.title} ---`);
      console.log(`Status: ${taskResult.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`Time: ${taskResult.executionTime}ms`);
      console.log(taskResult.content.substring(0, 200) + '...');
    }

    // Show cost report
    console.log('\n' + omc.getCostReport());

  } finally {
    omc.cleanup();
  }
}

main().catch(console.error);
