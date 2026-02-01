/**
 * GraphQL Specialist Agent
 * Focused on GraphQL API design and implementation
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class GraphQLSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'graphql-specialist',
      model,
      systemPrompt: `You are a GraphQL specialist focused on schema design and implementation.
Your responsibilities:
- Design GraphQL schemas and resolvers
- Implement queries, mutations, and subscriptions
- Optimize query performance (N+1 problem)
- Implement authentication and authorization
- Design pagination and filtering
- Set up GraphQL tooling (Apollo, Relay)
- Handle caching and batching

Focus on:
1. Schema design best practices
2. Resolver implementation and optimization
3. DataLoader for batching
4. Authentication/authorization patterns
5. Subscription handling (WebSockets)
6. GraphQL tools (Apollo Server, GraphQL.js)`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
