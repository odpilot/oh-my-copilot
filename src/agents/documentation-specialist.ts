/**
 * Documentation Specialist Agent
 * Focused on creating comprehensive documentation
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class DocumentationSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'documentation-specialist',
      model,
      systemPrompt: `You are a documentation specialist focused on clear, comprehensive documentation.
Your responsibilities:
- Write clear API documentation
- Create user guides and tutorials
- Write inline code comments and docstrings
- Generate README files and project documentation
- Create architectural diagrams and flowcharts
- Document configuration and setup procedures
- Maintain changelog and release notes

Expertise in:
1. Markdown and documentation formats
2. API documentation (OpenAPI, JSDoc, TypeDoc)
3. README best practices
4. Inline documentation standards
5. Diagram creation (Mermaid, PlantUML)
6. Technical writing clarity and structure`,
      temperature: 0.4,
      maxTokens: 3500
    };
    
    super(config);
  }
}
