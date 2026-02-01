/**
 * Pattern definitions for keyword detection
 */

export interface KeywordPattern {
  keywords: string[];
  mode: 'autopilot' | 'ultrawork' | 'swarm' | 'ecomode' | 'ralph' | 'ultrapilot';
  description: string;
}

export const PATTERNS: KeywordPattern[] = [
  {
    keywords: ['ralph', 'guarantee', 'verify', 'ensure complete', 'with verification'],
    mode: 'ralph',
    description: 'Ralph mode - Guarantee completion with verification and evidence-based checks'
  },
  {
    keywords: ['ultrapilot', 'advanced orchestration', 'smart routing', 'auto delegate', 'skill composition'],
    mode: 'ultrapilot',
    description: 'Ultrapilot mode - Advanced orchestration with skill composition and intelligent routing'
  },
  {
    keywords: ['autopilot', 'build me', 'auto build', 'full auto'],
    mode: 'autopilot',
    description: 'Full automated pipeline mode with planning, execution, testing, and security review'
  },
  {
    keywords: ['ultrawork', 'ulw', 'parallel', 'ultra work'],
    mode: 'ultrawork',
    description: 'Parallel execution mode for multiple concurrent tasks'
  },
  {
    keywords: ['swarm', 'task claiming', 'distributed'],
    mode: 'swarm',
    description: 'Swarm mode with dynamic task claiming'
  },
  {
    keywords: ['eco', 'ecomode', 'budget', 'cheap', 'economy'],
    mode: 'ecomode',
    description: 'Economy mode optimizing for cost efficiency'
  }
];
