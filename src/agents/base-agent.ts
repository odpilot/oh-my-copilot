/**
 * Base Agent class
 * Provides common functionality for all specialized agents
 */

import { MockAgent, type AgentConfig, type AgentResponse } from '../sdk/index.js';
import { logger } from '../utils/logger.js';

export interface TaskContext {
  task: string;
  context?: Record<string, any>;
  previousResults?: any[];
}

export interface AgentResult {
  agentName: string;
  success: boolean;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  executionTime: number;
  error?: string;
}

export class BaseAgent {
  protected agent: MockAgent;
  protected config: AgentConfig;
  protected name: string;

  constructor(config: AgentConfig) {
    this.config = config;
    this.name = config.name;
    this.agent = new MockAgent(config);
  }

  /**
   * Execute a task with this agent
   */
  async execute(taskContext: TaskContext): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`[${this.name}] Starting task execution`);
      
      // Build the prompt with context
      const prompt = this.buildPrompt(taskContext);
      
      // Execute the task
      const response = await this.agent.chat(prompt);
      
      const executionTime = Date.now() - startTime;
      
      logger.info(`[${this.name}] Task completed in ${executionTime}ms`);
      
      return {
        agentName: this.name,
        success: true,
        content: response.content,
        usage: response.usage,
        model: response.model,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error(`[${this.name}] Task failed: ${errorMessage}`);
      
      return {
        agentName: this.name,
        success: false,
        content: '',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        model: this.config.model,
        executionTime,
        error: errorMessage
      };
    }
  }

  /**
   * Build the prompt with task context
   */
  protected buildPrompt(taskContext: TaskContext): string {
    let prompt = `Task: ${taskContext.task}\n\n`;
    
    if (taskContext.context) {
      prompt += `Context:\n${JSON.stringify(taskContext.context, null, 2)}\n\n`;
    }
    
    if (taskContext.previousResults && taskContext.previousResults.length > 0) {
      prompt += `Previous Results:\n`;
      taskContext.previousResults.forEach((result, index) => {
        prompt += `\n--- Result ${index + 1} from ${result.agentName} ---\n`;
        prompt += `${result.content}\n`;
      });
    }
    
    return prompt;
  }

  /**
   * Reset the agent's conversation history
   */
  reset(): void {
    this.agent.resetConversation();
  }

  /**
   * Get the agent's name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the agent's configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }
}
