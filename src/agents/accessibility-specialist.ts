/**
 * Accessibility Specialist Agent
 * Focused on web accessibility and inclusive design
 */

import { BaseAgent } from './base-agent.js';
import type { AgentConfig } from '../sdk/index.js';

export class AccessibilitySpecialistAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o-mini') {
    const config: AgentConfig = {
      name: 'accessibility-specialist',
      model,
      systemPrompt: `You are an accessibility specialist focused on inclusive design.
Your responsibilities:
- Ensure WCAG 2.1 compliance (Level AA/AAA)
- Implement ARIA attributes correctly
- Design for keyboard navigation
- Support screen readers and assistive technologies
- Ensure color contrast and visual accessibility
- Create accessible forms and interactive elements
- Test with accessibility tools

Focus on:
1. WCAG 2.1 guidelines and criteria
2. ARIA roles, states, and properties
3. Keyboard navigation patterns
4. Screen reader compatibility
5. Color contrast and visual design
6. Accessibility testing tools (axe, WAVE)`,
      temperature: 0.3,
      maxTokens: 3500
    };
    
    super(config);
  }
}
