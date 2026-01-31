/**
 * MCP Configuration
 * Model Context Protocol configuration and defaults
 */

export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  enabled?: boolean;
}

export interface MCPConfig {
  servers: MCPServerConfig[];
  timeout?: number;
  retries?: number;
}

export const DEFAULT_MCP_CONFIG: MCPConfig = {
  servers: [
    {
      name: 'filesystem',
      command: 'npx',
      args: ['-y', '@anthropic-ai/mcp-server-filesystem'],
      enabled: true
    },
    {
      name: 'git',
      command: 'npx',
      args: ['-y', '@anthropic-ai/mcp-server-git'],
      enabled: true
    }
  ],
  timeout: 30000,
  retries: 3
};
