/**
 * Autopilot Example
 * Demonstrates full pipeline execution
 */

import { OhMyCopilot } from '../src/index.js';

async function main() {
  const omc = new OhMyCopilot({
    trackCosts: true,
    logLevel: 'info'
  });

  try {
    console.log('Running Autopilot Mode...\n');

    // Execute with full pipeline
    const result = await omc.autopilot(
      'Build a REST API endpoint for user authentication with JWT',
      {
        framework: 'Express',
        language: 'TypeScript'
      }
    );

    // Show detailed results
    console.log('\n=== Pipeline Results ===\n');
    
    for (const agentResult of result.results) {
      console.log(`\n--- ${agentResult.agentName.toUpperCase()} ---`);
      console.log(agentResult.content);
      console.log(`\nExecution time: ${agentResult.executionTime}ms`);
      console.log(`Tokens used: ${agentResult.usage.totalTokens}`);
    }

    // Show summary and costs
    console.log('\n' + result.summary);
    console.log('\n' + omc.getCostReport());

  } finally {
    omc.cleanup();
  }
}

main().catch(console.error);
