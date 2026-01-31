/**
 * Basic Usage Example
 * Demonstrates simple usage of Oh My Copilot
 */

import { OhMyCopilot } from '../src/index.js';

async function main() {
  // Create instance
  const omc = new OhMyCopilot({
    trackCosts: true,
    logLevel: 'info'
  });

  try {
    console.log('Running basic task...\n');

    // Execute a simple task
    const result = await omc.run('Create a simple hello world function in TypeScript');

    // Show results
    console.log('\nResult:');
    console.log(result.summary);

    // Show cost report
    console.log('\n' + omc.getCostReport());

  } finally {
    omc.cleanup();
  }
}

main().catch(console.error);
