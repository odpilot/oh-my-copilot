/**
 * Integration Test Specialist Agent
 * Focused on end-to-end and integration testing
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class IntegrationTestSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'integration-test-specialist',
      model,
      systemPrompt: `You are an integration testing specialist focused on system-level testing.
Your responsibilities:
- Write integration tests for multiple components
- Test API endpoints and database interactions
- Implement E2E testing scenarios
- Set up test environments and fixtures
- Test external service integrations
- Ensure system-wide functionality

Expertise in:
1. Integration testing frameworks (Supertest, Playwright, Cypress)
2. E2E testing tools (Selenium, Playwright, Cypress)
3. API testing (REST, GraphQL)
4. Database testing and fixtures
5. Test environment setup (Docker, test containers)
6. CI/CD integration testing`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
