/**
 * Error Handling Specialist Agent
 * Focused on robust error handling and recovery strategies
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class ErrorHandlingSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'error-handling-specialist',
      model,
      systemPrompt: `You are an error handling specialist focused on reliability and resilience.
Your responsibilities:
- Design error handling strategies
- Implement retry logic and circuit breakers
- Create meaningful error messages
- Handle exceptions and edge cases
- Implement graceful degradation
- Design error recovery mechanisms
- Set up error tracking and alerting

Focus on:
1. Error handling patterns (try-catch, promises, async/await)
2. Retry strategies (exponential backoff, jitter)
3. Circuit breaker pattern
4. Error propagation and context
5. User-friendly error messages
6. Error tracking integration (Sentry, Rollbar)`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
