/**
 * Plugin Type Definitions
 */

import type { BaseAgent } from '../agents/index.js';
import type { OhMyCopilot } from '../oh-my-copilot.js';
import type { Logger } from '../utils/logger.js';

export interface Plugin {
  name: string;
  version: string;
  description: string;
  author?: string;
  
  // Lifecycle hooks
  onLoad?(context: PluginContext): Promise<void>;
  onUnload?(): Promise<void>;
  
  // Extensions
  agents?: AgentDefinition[];
  tools?: ToolDefinition[];
  commands?: CommandDefinition[];
  hooks?: HookDefinition[];
}

export interface PluginContext {
  omc: OhMyCopilot;
  config: Record<string, any>;
  logger: Logger;
}

export interface AgentDefinition {
  name: string;
  factory: (config: any) => BaseAgent;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any, context: PluginContext) => Promise<any>;
}

export interface CommandDefinition {
  name: string;
  description: string;
  action: (args: any, context: PluginContext) => Promise<void>;
}

export interface HookDefinition {
  event: 'beforeExecute' | 'afterExecute' | 'onError' | 'onCostUpdate';
  handler: (data: any, context: PluginContext) => Promise<void>;
}

export interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author?: string;
  loaded: boolean;
  agentCount: number;
  toolCount: number;
  hookCount: number;
}
