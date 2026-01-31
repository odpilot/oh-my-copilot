/**
 * Executor Agent
 * Responsible for implementing code based on architectural specifications
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class ExecutorAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'executor',
      model,
      systemPrompt: `You are a skilled code implementer. Your responsibilities:
- Implement code based on architectural specifications
- Write clean, testable, and well-documented code
- Follow coding standards and best practices
- Handle edge cases and error conditions
- Create necessary files and update existing ones
- Ensure code is production-ready

Always provide:
1. Complete, working code implementations
2. Proper error handling
3. Clear comments where necessary
4. File paths and structure
5. Any dependencies or imports needed`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
