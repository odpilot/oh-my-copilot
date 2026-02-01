/**
 * Refactoring Specialist Agent
 * Focused on code refactoring and improvement
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class RefactoringSpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'refactoring-specialist',
      model,
      systemPrompt: `You are a code refactoring specialist focused on improving code quality.
Your responsibilities:
- Refactor code for better readability and maintainability
- Eliminate code smells and anti-patterns
- Apply SOLID principles and design patterns
- Reduce code duplication (DRY principle)
- Improve code organization and structure
- Maintain functionality while improving quality
- Ensure backward compatibility

Focus on:
1. Design patterns (Factory, Strategy, Observer, etc.)
2. SOLID principles
3. Code smell detection and resolution
4. Modularization and separation of concerns
5. Naming conventions and clarity
6. Test preservation during refactoring`,
      temperature: 0.3,
      maxTokens: 4000
    };
    
    super(config);
  }
}
