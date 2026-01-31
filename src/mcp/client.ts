/**
 * MCP Client
 * Client for managing and communicating with MCP servers
 */

import { logger } from '../utils/logger.js';
import { MCPServer, type MCPTool } from './servers.js';
import type { MCPConfig, MCPServerConfig } from './config.js';

export class MCPClient {
  private servers: Map<string, MCPServer> = new Map();
  private config?: MCPConfig;

  /**
   * Connect to MCP servers
   */
  async connect(config: MCPConfig): Promise<void> {
    this.config = config;
    logger.info(`Connecting to ${config.servers.length} MCP servers`);

    for (const serverConfig of config.servers) {
      if (serverConfig.enabled === false) {
        logger.info(`Skipping disabled server: ${serverConfig.name}`);
        continue;
      }

      try {
        const server = new MCPServer(serverConfig);
        await server.start();
        this.servers.set(serverConfig.name, server);
        logger.info(`Connected to MCP server: ${serverConfig.name}`);
      } catch (error) {
        logger.error(`Failed to connect to ${serverConfig.name}: ${error}`);
        // Continue with other servers
      }
    }

    logger.info(`MCP Client connected with ${this.servers.size} active servers`);
  }

  /**
   * Call a tool on a specific server
   */
  async callTool(serverName: string, toolName: string, args: any): Promise<any> {
    const server = this.servers.get(serverName);
    if (!server) {
      throw new Error(`MCP Server not found: ${serverName}`);
    }

    return server.callTool(toolName, args);
  }

  /**
   * List tools from a specific server or all servers
   */
  async listTools(serverName?: string): Promise<MCPTool[]> {
    if (serverName) {
      const server = this.servers.get(serverName);
      if (!server) {
        throw new Error(`MCP Server not found: ${serverName}`);
      }
      return server.listTools();
    }

    // List tools from all servers
    const allTools: MCPTool[] = [];
    for (const [name, server] of this.servers) {
      const tools = await server.listTools();
      // Prefix tool names with server name
      const prefixedTools = tools.map(tool => ({
        ...tool,
        name: `${name}.${tool.name}`
      }));
      allTools.push(...prefixedTools);
    }

    return allTools;
  }

  /**
   * Disconnect from all MCP servers
   */
  async disconnect(): Promise<void> {
    logger.info('Disconnecting from MCP servers');

    for (const [name, server] of this.servers) {
      try {
        await server.stop();
        logger.info(`Disconnected from ${name}`);
      } catch (error) {
        logger.error(`Error disconnecting from ${name}: ${error}`);
      }
    }

    this.servers.clear();
    logger.info('All MCP servers disconnected');
  }

  /**
   * Get list of connected servers
   */
  getConnectedServers(): string[] {
    return Array.from(this.servers.keys()).filter(name => 
      this.servers.get(name)?.isConnected()
    );
  }

  /**
   * Check if a server is connected
   */
  isServerConnected(serverName: string): boolean {
    const server = this.servers.get(serverName);
    return server?.isConnected() ?? false;
  }
}
