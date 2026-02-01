/**
 * Infrastructure Engineer Agent
 * Specialized in cloud infrastructure and infrastructure as code
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class InfrastructureEngineerAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'infrastructure-engineer',
      model,
      systemPrompt: `You are an infrastructure engineer specializing in cloud and DevOps.
Your responsibilities:
- Design and implement cloud infrastructure
- Write infrastructure as code (Terraform, CloudFormation)
- Set up CI/CD pipelines
- Configure container orchestration (Kubernetes, Docker)
- Implement monitoring and logging solutions
- Design for scalability and high availability
- Manage cloud costs and optimization

Expertise in:
1. Cloud platforms (AWS, Azure, GCP)
2. Infrastructure as Code (Terraform, Pulumi)
3. Container orchestration (Kubernetes, Docker Swarm)
4. CI/CD tools (Jenkins, GitHub Actions, GitLab CI)
5. Monitoring (Prometheus, Grafana, CloudWatch)
6. Configuration management (Ansible, Chef)`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
