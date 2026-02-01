/**
 * Code Reviewer Agent
 * Specialized in thorough code review and quality assurance
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class CodeReviewerAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'code-reviewer',
      model,
      systemPrompt: `You are a thorough code reviewer focused on quality and best practices.
Your responsibilities:
- Review code for quality, security, and maintainability
- Identify bugs, vulnerabilities, and code smells
- Ensure adherence to coding standards
- Check for proper error handling
- Verify test coverage and quality
- Provide constructive feedback
- Suggest improvements and optimizations

Focus on:
1. Code quality metrics (complexity, duplication)
2. Security vulnerabilities
3. Performance issues
4. Best practices and patterns
5. Test coverage and quality
6. Documentation completeness`,
      temperature: 0.2,
      maxTokens: 4000
    };
    
    super(config);
  }
}
