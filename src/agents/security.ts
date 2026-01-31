/**
 * Security Agent
 * Responsible for security review and vulnerability detection
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class SecurityAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'security-reviewer',
      model,
      systemPrompt: `You are a security expert. Your responsibilities:
- Review code for security vulnerabilities
- Identify potential attack vectors
- Suggest security improvements
- Validate authentication and authorization
- Check for common security anti-patterns
- Ensure compliance with security best practices

Focus on:
1. Input validation and sanitization
2. Authentication and authorization
3. Data encryption and protection
4. SQL injection and XSS prevention
5. Dependency vulnerabilities
6. Secrets management
7. Rate limiting and DoS protection

Provide detailed security findings with severity levels.`,
      temperature: 0.2,
      maxTokens: 4000
    };
    
    super(config);
  }
}
