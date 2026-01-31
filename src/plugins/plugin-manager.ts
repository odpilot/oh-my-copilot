/**
 * Plugin Manager
 * Manages loading, unloading, and execution of plugins
 */

import { logger } from '../utils/logger.js';
import type { Plugin, PluginContext, PluginInfo, AgentDefinition, ToolDefinition, CommandDefinition } from './plugin-types.js';
import type { OhMyCopilot } from '../oh-my-copilot.js';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;

  constructor(omc: OhMyCopilot, config: Record<string, any> = {}) {
    this.context = {
      omc,
      config,
      logger
    };
  }

  /**
   * Load a plugin from a file path
   */
  async loadPlugin(pluginPath: string): Promise<void> {
    try {
      logger.info(`Loading plugin from: ${pluginPath}`);
      
      const module = await import(pluginPath);
      const plugin: Plugin = module.default || module;

      if (!this.validatePlugin(plugin)) {
        throw new Error('Invalid plugin structure');
      }

      // Check if already loaded
      if (this.plugins.has(plugin.name)) {
        logger.warn(`Plugin ${plugin.name} is already loaded`);
        return;
      }

      // Call onLoad hook
      if (plugin.onLoad) {
        await plugin.onLoad(this.context);
      }

      this.plugins.set(plugin.name, plugin);
      logger.info(`Plugin loaded: ${plugin.name} v${plugin.version}`);
    } catch (error) {
      logger.error(`Failed to load plugin from ${pluginPath}: ${error}`);
      throw error;
    }
  }

  /**
   * Load a plugin from npm package
   */
  async loadPluginFromNpm(packageName: string): Promise<void> {
    try {
      logger.info(`Loading plugin from npm: ${packageName}`);
      
      const module = await import(packageName);
      const plugin: Plugin = module.default || module;

      if (!this.validatePlugin(plugin)) {
        throw new Error('Invalid plugin structure');
      }

      // Check if already loaded
      if (this.plugins.has(plugin.name)) {
        logger.warn(`Plugin ${plugin.name} is already loaded`);
        return;
      }

      // Call onLoad hook
      if (plugin.onLoad) {
        await plugin.onLoad(this.context);
      }

      this.plugins.set(plugin.name, plugin);
      logger.info(`Plugin loaded from npm: ${plugin.name} v${plugin.version}`);
    } catch (error) {
      logger.error(`Failed to load plugin from npm ${packageName}: ${error}`);
      throw error;
    }
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    
    if (!plugin) {
      logger.warn(`Plugin not found: ${name}`);
      return;
    }

    try {
      // Call onUnload hook
      if (plugin.onUnload) {
        await plugin.onUnload();
      }

      this.plugins.delete(name);
      logger.info(`Plugin unloaded: ${name}`);
    } catch (error) {
      logger.error(`Failed to unload plugin ${name}: ${error}`);
      throw error;
    }
  }

  /**
   * Get a specific plugin
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * List all loaded plugins
   */
  listPlugins(): PluginInfo[] {
    return Array.from(this.plugins.values()).map(plugin => ({
      name: plugin.name,
      version: plugin.version,
      description: plugin.description,
      author: plugin.author,
      loaded: true,
      agentCount: plugin.agents?.length || 0,
      toolCount: plugin.tools?.length || 0,
      hookCount: plugin.hooks?.length || 0
    }));
  }

  /**
   * Execute hooks for a specific event
   */
  async executeHook(event: string, data: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks) {
        for (const hook of plugin.hooks) {
          if (hook.event === event) {
            try {
              await hook.handler(data, this.context);
            } catch (error) {
              logger.error(`Error executing hook ${event} in plugin ${plugin.name}: ${error}`);
            }
          }
        }
      }
    }
  }

  /**
   * Get all agent definitions from plugins
   */
  getAgents(): Map<string, AgentDefinition> {
    const agents = new Map<string, AgentDefinition>();
    
    for (const plugin of this.plugins.values()) {
      if (plugin.agents) {
        for (const agent of plugin.agents) {
          agents.set(agent.name, agent);
        }
      }
    }

    return agents;
  }

  /**
   * Get all tool definitions from plugins
   */
  getTools(): Map<string, ToolDefinition> {
    const tools = new Map<string, ToolDefinition>();
    
    for (const plugin of this.plugins.values()) {
      if (plugin.tools) {
        for (const tool of plugin.tools) {
          tools.set(tool.name, tool);
        }
      }
    }

    return tools;
  }

  /**
   * Get all command definitions from plugins
   */
  getCommands(): Map<string, CommandDefinition> {
    const commands = new Map<string, CommandDefinition>();
    
    for (const plugin of this.plugins.values()) {
      if (plugin.commands) {
        for (const command of plugin.commands) {
          commands.set(command.name, command);
        }
      }
    }

    return commands;
  }

  /**
   * Call a tool from a plugin
   */
  async callTool(toolName: string, args: any): Promise<any> {
    const tools = this.getTools();
    const tool = tools.get(toolName);

    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    return tool.execute(args, this.context);
  }

  /**
   * Validate plugin structure
   */
  private validatePlugin(plugin: any): plugin is Plugin {
    return (
      typeof plugin === 'object' &&
      typeof plugin.name === 'string' &&
      typeof plugin.version === 'string' &&
      typeof plugin.description === 'string'
    );
  }
}
