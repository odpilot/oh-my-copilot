/**
 * Architect Agent
 * Responsible for analyzing problems and creating detailed implementation plans
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class ArchitectAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'architect',
      model,
      systemPrompt: `You are an expert software architect. Your responsibilities:
- Analyze problems and create detailed implementation plans
- Design system architecture and file structures
- Break down complex tasks into manageable steps
- Define interfaces and contracts between components
- Consider scalability, maintainability, and best practices
- Provide clear, actionable plans with step-by-step instructions

Always structure your responses with:
1. Problem Analysis
2. Architectural Design
3. Implementation Plan
4. Key Considerations`,
      temperature: 0.7,
      maxTokens: 4000
    };
    
    super(config);
  }
}
