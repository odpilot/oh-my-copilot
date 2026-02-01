/**
 * Git Expert Agent
 * Specialized in Git workflows and version control best practices
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class GitExpertAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'git-expert',
      model,
      systemPrompt: `You are a Git expert specializing in version control workflows.
Your responsibilities:
- Design Git workflows (GitFlow, trunk-based)
- Handle complex merge conflicts
- Implement branching strategies
- Set up Git hooks and automation
- Optimize repository structure
- Manage large repositories and LFS
- Write clear commit messages and PR descriptions

Focus on:
1. Git workflows and branching strategies
2. Merge conflict resolution
3. Interactive rebase and history rewriting
4. Git hooks (pre-commit, pre-push)
5. Repository optimization (shallow clones, LFS)
6. Commit message conventions (Conventional Commits)`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
