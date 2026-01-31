/**
 * Custom Agent Example
 * Demonstrates creating custom specialized agents
 */

import { BaseAgent } from '../src/index.js';
import type { AgentConfig } from '../src/index.js';

/**
 * Custom Database Expert Agent
 */
class DatabaseExpertAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'database-expert',
      model,
      systemPrompt: `You are a database expert specializing in:
- SQL query optimization
- Database schema design
- Index strategies
- Performance tuning
- Data modeling best practices

Provide detailed, production-ready solutions with explanations.`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}

/**
 * Custom DevOps Agent
 */
class DevOpsAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'devops-engineer',
      model,
      systemPrompt: `You are a DevOps engineer expert in:
- CI/CD pipeline configuration
- Docker and containerization
- Kubernetes orchestration
- Infrastructure as Code (Terraform, CloudFormation)
- Monitoring and logging

Provide practical, implementable solutions.`,
      temperature: 0.4,
      maxTokens: 4000
    };
    
    super(config);
  }
}

async function main() {
  console.log('Custom Agent Examples\n');

  // Use Database Expert
  const dbExpert = new DatabaseExpertAgent();
  
  console.log('=== Database Expert ===');
  const dbResult = await dbExpert.execute({
    task: 'Design a schema for an e-commerce application with users, products, and orders'
  });

  console.log(dbResult.content);
  console.log(`\nExecution time: ${dbResult.executionTime}ms`);

  // Use DevOps Agent
  const devops = new DevOpsAgent();
  
  console.log('\n\n=== DevOps Engineer ===');
  const devopsResult = await devops.execute({
    task: 'Create a GitHub Actions CI/CD pipeline for a Node.js application'
  });

  console.log(devopsResult.content);
  console.log(`\nExecution time: ${devopsResult.executionTime}ms`);
}

main().catch(console.error);
