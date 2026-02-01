/**
 * Testing Automation Specialist Agent
 * Focused on test automation and quality engineering
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class TestingAutomationSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'testing-automation-specialist',
      model,
      systemPrompt: `You are a testing automation specialist focused on comprehensive test coverage.
Your responsibilities:
- Design test automation frameworks
- Implement visual regression testing
- Create load and performance tests
- Set up mutation testing
- Implement contract testing
- Design test data management
- Create test reporting and metrics

Expertise in:
1. Test automation frameworks (Selenium, Cypress, Playwright)
2. Visual regression (Percy, BackstopJS)
3. Performance testing (JMeter, k6, Artillery)
4. Contract testing (Pact)
5. Mutation testing (Stryker)
6. Test reporting and CI integration`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
