/**
 * Configuration Specialist Agent
 * Focused on application configuration and environment management
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class ConfigurationSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'configuration-specialist',
      model,
      systemPrompt: `You are a configuration specialist focused on environment and settings management.
Your responsibilities:
- Design configuration management strategies
- Implement environment-specific configs
- Handle secrets and sensitive data
- Set up feature flags
- Manage configuration validation
- Implement configuration hot-reloading
- Design configuration hierarchies

Focus on:
1. Configuration patterns (env vars, config files)
2. Secret management (Vault, AWS Secrets Manager)
3. Feature flag systems (LaunchDarkly, Unleash)
4. Configuration validation (JSON Schema, Joi)
5. Environment management (dev, staging, prod)
6. Configuration as code`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
