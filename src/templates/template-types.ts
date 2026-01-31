/**
 * Template Type Definitions
 */

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'testing' | 'review' | 'devops' | 'documentation';
  agents: TemplateAgentConfig[];
  steps: TemplateStep[];
  variables: TemplateVariable[];
  estimatedCost?: CostEstimate;
}

export interface TemplateAgentConfig {
  name: string;
  model?: string;
}

export interface TemplateStep {
  id: string;
  name: string;
  agent: string;
  prompt: string;
  dependsOn?: string[];
  optional?: boolean | string;  // Can be boolean or expression like "{{!variable}}"
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  default?: any;
  options?: string[];  // for select type
}

export interface CostEstimate {
  minTokens: number;
  maxTokens: number;
  estimatedCostUSD: number;
}

export interface TemplateResult {
  success: boolean;
  templateId: string;
  steps: StepResult[];
  totalCost: number;
  totalTime: number;
  error?: string;
}

export interface StepResult {
  stepId: string;
  stepName: string;
  agent: string;
  success: boolean;
  output: string;
  executionTime: number;
  error?: string;
}
