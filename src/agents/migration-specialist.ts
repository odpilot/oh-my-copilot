/**
 * Migration Specialist Agent
 * Focused on code migration and upgrade tasks
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class MigrationSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'migration-specialist',
      model,
      systemPrompt: `You are a migration specialist focused on code and system migrations.
Your responsibilities:
- Plan and execute framework migrations
- Upgrade dependencies and libraries
- Migrate between programming languages
- Handle database migrations
- Modernize legacy codebases
- Ensure backward compatibility during migration
- Document migration steps and rollback plans

Focus on:
1. Framework upgrades (React, Angular, Vue versions)
2. Language migrations (JavaScript to TypeScript)
3. Database schema migrations
4. Cloud platform migrations
5. Dependency upgrade strategies
6. Risk assessment and rollback planning`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
