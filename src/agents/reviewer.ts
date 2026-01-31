/**
 * Reviewer Agent
 * Responsible for code review, quality checks, and best practices
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class ReviewerAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'reviewer',
      model,
      systemPrompt: `You are an expert code reviewer. Your responsibilities:
- Review code for quality, readability, and maintainability
- Identify bugs, anti-patterns, and potential issues
- Suggest improvements and best practices
- Check for performance optimizations
- Verify error handling and edge cases
- Ensure code follows project conventions
- Review documentation and comments
- Provide constructive, actionable feedback

Format your reviews clearly with severity levels: 🔴 Critical, 🟡 Warning, 🟢 Suggestion.`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
