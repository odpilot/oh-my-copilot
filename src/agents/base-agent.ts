/**
 * Base Agent class
 * Provides common functionality for all specialized agents
 */

import { UnifiedAgent, type AgentConfig, type AgentResponse } from '../sdk/index.js';
import { logger } from '../utils/logger.js';
import type { ProviderKeys } from '../config/types.js';
import { MCPClient, type MCPConfig } from '../mcp/index.js';

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
  provider?: string;
}

export class BaseAgent {
  protected agent: UnifiedAgent;
  protected config: AgentConfig;
  protected name: string;
  protected mcpClient?: MCPClient;

  constructor(config: AgentConfig, providerKeys?: ProviderKeys) {
    this.config = config;
    this.name = config.name;
    this.agent = new UnifiedAgent(config, { providerKeys });
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
        executionTime,
        provider: this.agent.getProvider()
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
        error: errorMessage,
        provider: this.agent.getProvider()
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
   * Execute a task with streaming output
   */
  async *executeStream(taskContext: TaskContext): AsyncGenerator<string, AgentResult, unknown> {
    const startTime = Date.now();
    
    try {
      logger.info(`[${this.name}] Starting streaming task execution`);
      
      // Build the prompt with context
      const prompt = this.buildPrompt(taskContext);
      
      // Execute the task with streaming
      let fullContent = '';
      const stream = this.agent.chatStream(prompt);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        yield chunk;
      }
      
      const executionTime = Date.now() - startTime;
      
      logger.info(`[${this.name}] Streaming task completed in ${executionTime}ms`);
      
      return {
        agentName: this.name,
        success: true,
        content: fullContent,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        model: this.config.model,
        executionTime,
        provider: this.agent.getProvider()
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error(`[${this.name}] Streaming task failed: ${errorMessage}`);
      
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
        error: errorMessage,
        provider: this.agent.getProvider()
      };
    }
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
  
  /**
   * Get the current provider being used
   */
  getProvider(): string {
    return this.agent.getProvider();
  }

  /**
   * Enable MCP (Model Context Protocol) support
   */
  async enableMCP(config: MCPConfig): Promise<void> {
    this.mcpClient = new MCPClient();
    await this.mcpClient.connect(config);
    logger.info(`[${this.name}] MCP enabled with ${config.servers.length} servers`);
  }

  /**
   * Use an MCP tool
   */
  async useTool(serverName: string, toolName: string, args: any): Promise<any> {
    if (!this.mcpClient) {
      throw new Error('MCP not enabled. Call enableMCP() first.');
    }
    return this.mcpClient.callTool(serverName, toolName, args);
  }

  /**
   * List available MCP tools
   */
  async listMCPTools(serverName?: string): Promise<any[]> {
    if (!this.mcpClient) {
      throw new Error('MCP not enabled. Call enableMCP() first.');
    }
    return this.mcpClient.listTools(serverName);
  }

  /**
   * Disable MCP and disconnect from servers
   */
  async disableMCP(): Promise<void> {
    if (this.mcpClient) {
      await this.mcpClient.disconnect();
      this.mcpClient = undefined;
      logger.info(`[${this.name}] MCP disabled`);
    }
  }
}
