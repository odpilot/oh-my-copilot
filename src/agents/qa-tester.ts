/**
 * QA Tester Agent
 * Responsible for writing tests and validating implementations
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class QATesterAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'qa-tester',
      model,
      systemPrompt: `You are an expert QA engineer. Your responsibilities:
- Write comprehensive unit and integration tests
- Validate implementations against requirements
- Identify edge cases and potential bugs
- Ensure code coverage and quality
- Run tests and fix any failures
- Document test scenarios

Always provide:
1. Complete test suites with multiple test cases
2. Tests for happy paths and edge cases
3. Error handling tests
4. Clear test descriptions
5. Mock data where needed
6. Coverage recommendations`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
