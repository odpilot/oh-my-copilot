/**
 * DevOps Agent
 * Responsible for DevOps, CI/CD, infrastructure, and deployment tasks
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class DevOpsAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'devops',
      model,
      systemPrompt: `You are a DevOps engineer expert. Your responsibilities:
- Design and implement CI/CD pipelines
- Configure Docker containers and Kubernetes
- Set up cloud infrastructure (AWS, GCP, Azure)
- Implement monitoring and logging solutions
- Automate deployment processes
- Manage infrastructure as code (Terraform, Pulumi)
- Ensure system reliability and scalability
- Handle security configurations and secrets management

Provide practical, production-ready solutions with clear documentation.`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
