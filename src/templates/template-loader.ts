/**
 * Template Loader
 * Loads and manages task templates
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { logger } from '../utils/logger.js';
import type { TaskTemplate, TemplateResult, StepResult, TemplateVariable, TemplateStep } from './template-types.js';
import {
  ArchitectAgent,
  ExecutorAgent,
  QATesterAgent,
  SecurityAgent,
  DesignerAgent,
  DevOpsAgent,
  DataAnalystAgent,
  ReviewerAgent,
  type BaseAgent
} from '../agents/index.js';

export class TemplateLoader {
  private templates: Map<string, TaskTemplate> = new Map();

  constructor() {
    this.loadDefaultTemplates();
  }

  /**
   * Load default templates from the default-templates directory
   */
  private async loadDefaultTemplates(): Promise<void> {
    // Default templates will be loaded from a known path or skipped
    // In production, templates would be bundled or loaded from a known directory
    logger.info('Template loader initialized');
  }

  /**
   * Load template from file
   */
  async loadFromFile(path: string): Promise<TaskTemplate> {
    const content = await readFile(path, 'utf-8');
    const template = JSON.parse(content) as TaskTemplate;
    this.validateTemplate(template);
    return template;
  }

  /**
   * Load templates from directory
   */
  async loadFromDirectory(dir: string): Promise<TaskTemplate[]> {
    const files = await readdir(dir);
    const templates: TaskTemplate[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const template = await this.loadFromFile(join(dir, file));
          templates.push(template);
          this.templates.set(template.id, template);
        } catch (error) {
          logger.error(`Failed to load template ${file}: ${error}`);
        }
      }
    }

    return templates;
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): TaskTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * List all templates or templates by category
   */
  listTemplates(category?: string): TaskTemplate[] {
    const templates = Array.from(this.templates.values());

    if (category) {
      return templates.filter(t => t.category === category);
    }

    return templates;
  }

  /**
   * Execute a template with provided variables
   */
  async executeTemplate(
    templateId: string,
    variables: Record<string, any>
  ): Promise<TemplateResult> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    logger.info(`Executing template: ${template.name}`);

    // Validate variables
    this.validateVariables(template, variables);

    const startTime = Date.now();
    const stepResults: StepResult[] = [];
    const stepOutputs: Map<string, string> = new Map();

    try {
      // Execute steps in order, respecting dependencies
      for (const step of template.steps) {
        // Check if step should be skipped
        if (step.optional && this.shouldSkipStep(step, variables)) {
          logger.info(`Skipping optional step: ${step.name}`);
          continue;
        }

        // Check dependencies
        if (step.dependsOn) {
          const missingDeps = step.dependsOn.filter(dep => !stepOutputs.has(dep));
          if (missingDeps.length > 0) {
            throw new Error(`Step ${step.id} has unmet dependencies: ${missingDeps.join(', ')}`);
          }
        }

        // Execute step
        const stepResult = await this.executeStep(step, variables, stepOutputs);
        stepResults.push(stepResult);

        if (stepResult.success) {
          stepOutputs.set(step.id, stepResult.output);
        } else {
          // Stop on first failure
          throw new Error(`Step ${step.id} failed: ${stepResult.error}`);
        }
      }

      const totalTime = Date.now() - startTime;

      return {
        success: true,
        templateId: template.id,
        steps: stepResults,
        totalCost: 0, // TODO: Calculate from step results
        totalTime,
      };
    } catch (error) {
      const totalTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        success: false,
        templateId: template.id,
        steps: stepResults,
        totalCost: 0,
        totalTime,
        error: errorMessage
      };
    }
  }

  /**
   * Execute a single template step
   */
  private async executeStep(
    step: TemplateStep,
    variables: Record<string, any>,
    previousOutputs: Map<string, string>
  ): Promise<StepResult> {
    const startTime = Date.now();

    try {
      // Interpolate variables in prompt
      const prompt = this.interpolatePrompt(step.prompt, variables);

      // Create agent
      const agent = this.createAgent(step.agent);

      // Execute
      const result = await agent.execute({
        task: prompt,
        context: variables,
        previousResults: Array.from(previousOutputs.entries()).map(([id, output]) => ({
          agentName: id,
          content: output
        }))
      });

      const executionTime = Date.now() - startTime;

      return {
        stepId: step.id,
        stepName: step.name,
        agent: step.agent,
        success: result.success,
        output: result.content,
        executionTime,
        error: result.error
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        stepId: step.id,
        stepName: step.name,
        agent: step.agent,
        success: false,
        output: '',
        executionTime,
        error: errorMessage
      };
    }
  }

  /**
   * Create an agent instance by name
   */
  private createAgent(agentName: string): BaseAgent {
    switch (agentName) {
      case 'architect':
        return new ArchitectAgent();
      case 'executor':
        return new ExecutorAgent();
      case 'qa-tester':
        return new QATesterAgent();
      case 'security':
        return new SecurityAgent();
      case 'designer':
        return new DesignerAgent();
      case 'devops':
        return new DevOpsAgent();
      case 'data-analyst':
        return new DataAnalystAgent();
      case 'reviewer':
        return new ReviewerAgent();
      default:
        throw new Error(`Unknown agent: ${agentName}`);
    }
  }

  /**
   * Interpolate variables in a prompt template
   */
  private interpolatePrompt(prompt: string, variables: Record<string, any>): string {
    let result = prompt;

    // Replace {{variableName}} with variable value
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value));
    }

    return result;
  }

  /**
   * Check if a step should be skipped based on optional condition
   */
  private shouldSkipStep(step: TemplateStep, variables: Record<string, any>): boolean {
    // If optional is a boolean expression like "{{!includeTests}}"
    if (typeof step.optional === 'string') {
      // Parse negation: {{!variableName}}
      const match = step.optional.match(/\{\{!(\w+)\}\}/);
      if (match) {
        const varName = match[1];
        return variables[varName] === true;
      }
    }

    return step.optional === true;
  }

  /**
   * Validate template structure
   */
  private validateTemplate(template: TaskTemplate): void {
    if (!template.id || !template.name || !template.steps) {
      throw new Error('Invalid template: missing required fields');
    }

    if (template.steps.length === 0) {
      throw new Error('Template must have at least one step');
    }
  }

  /**
   * Validate provided variables against template requirements
   */
  private validateVariables(template: TaskTemplate, variables: Record<string, any>): void {
    for (const variable of template.variables) {
      if (variable.required && !(variable.name in variables)) {
        if (variable.default !== undefined) {
          variables[variable.name] = variable.default;
        } else {
          throw new Error(`Required variable missing: ${variable.name}`);
        }
      }

      // Apply defaults
      if (!(variable.name in variables) && variable.default !== undefined) {
        variables[variable.name] = variable.default;
      }
    }
  }
}
