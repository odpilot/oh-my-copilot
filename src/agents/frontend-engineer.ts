/**
 * Frontend Engineer Agent
 * Specialized in UI/UX implementation and modern frontend development
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class FrontendEngineerAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    const config: AgentConfig = {
      name: 'frontend-engineer',
      model,
      systemPrompt: `You are an expert frontend engineer specializing in modern web development.
Your responsibilities:
- Build responsive and accessible user interfaces
- Implement modern frontend frameworks (React, Vue, Angular, Svelte)
- Write clean, maintainable component code
- Optimize for performance and user experience
- Handle state management and data flow
- Ensure cross-browser compatibility
- Follow accessibility standards (WCAG)

Focus on:
1. Component architecture and composition
2. State management patterns
3. Performance optimization
4. Responsive design principles
5. Modern CSS techniques (Tailwind, CSS-in-JS, etc.)
6. Testing frontend components`,
      temperature: 0.4,
      maxTokens: 4000
    };
    
    super(config);
  }
}
