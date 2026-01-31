/**
 * MCP Servers
 * Server management and lifecycle
 */

import { spawn, type ChildProcess } from 'child_process';
import { logger } from '../utils/logger.js';
import type { MCPServerConfig } from './config.js';

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export class MCPServer {
  private process?: ChildProcess;
  private config: MCPServerConfig;
  private connected: boolean = false;

  constructor(config: MCPServerConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.process) {
      logger.warn(`MCP Server ${this.config.name} is already running`);
      return;
    }

    logger.info(`Starting MCP Server: ${this.config.name}`);

    try {
      this.process = spawn(this.config.command, this.config.args || [], {
        env: { ...process.env, ...this.config.env },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.process.on('error', (error) => {
        logger.error(`MCP Server ${this.config.name} error: ${error.message}`);
      });

      this.process.on('exit', (code) => {
        logger.info(`MCP Server ${this.config.name} exited with code ${code}`);
        this.connected = false;
      });

      // Wait a bit for the server to start
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.connected = true;
      
      logger.info(`MCP Server ${this.config.name} started successfully`);
    } catch (error) {
      logger.error(`Failed to start MCP Server ${this.config.name}: ${error}`);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.process) {
      return;
    }

    logger.info(`Stopping MCP Server: ${this.config.name}`);
    
    this.process.kill();
    this.process = undefined;
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  getName(): string {
    return this.config.name;
  }

  async listTools(): Promise<MCPTool[]> {
    if (!this.connected) {
      throw new Error(`MCP Server ${this.config.name} is not connected`);
    }

    // In a real implementation, this would communicate with the MCP server
    // For now, return mock tools based on server name
    return this.getMockTools();
  }

  async callTool(toolName: string, args: any): Promise<any> {
    if (!this.connected) {
      throw new Error(`MCP Server ${this.config.name} is not connected`);
    }

    logger.info(`Calling tool ${toolName} on ${this.config.name} with args: ${JSON.stringify(args)}`);
    
    // In a real implementation, this would communicate with the MCP server
    // For now, return mock response
    return {
      success: true,
      result: `Mock result from ${toolName}`,
      timestamp: new Date().toISOString()
    };
  }

  private getMockTools(): MCPTool[] {
    const toolsByServer: Record<string, MCPTool[]> = {
      filesystem: [
        {
          name: 'readFile',
          description: 'Read contents of a file',
          parameters: { path: { type: 'string', required: true } }
        },
        {
          name: 'writeFile',
          description: 'Write contents to a file',
          parameters: {
            path: { type: 'string', required: true },
            content: { type: 'string', required: true }
          }
        },
        {
          name: 'listDirectory',
          description: 'List contents of a directory',
          parameters: { path: { type: 'string', required: true } }
        }
      ],
      git: [
        {
          name: 'status',
          description: 'Get git status',
          parameters: {}
        },
        {
          name: 'commit',
          description: 'Create a git commit',
          parameters: {
            message: { type: 'string', required: true }
          }
        },
        {
          name: 'diff',
          description: 'Show git diff',
          parameters: {}
        }
      ]
    };

    return toolsByServer[this.config.name] || [];
  }
}
