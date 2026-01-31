/**
 * Plugin Loader
 * Utilities for loading and managing plugins
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { logger } from '../utils/logger.js';
import type { Plugin } from './plugin-types.js';
import type { PluginManager } from './plugin-manager.js';

export class PluginLoader {
  private pluginManager: PluginManager;

  constructor(pluginManager: PluginManager) {
    this.pluginManager = pluginManager;
  }

  /**
   * Load all plugins from a directory
   */
  async loadFromDirectory(dirPath: string): Promise<void> {
    try {
      const files = await readdir(dirPath);
      
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.ts')) {
          const pluginPath = join(dirPath, file);
          try {
            await this.pluginManager.loadPlugin(pluginPath);
          } catch (error) {
            logger.error(`Failed to load plugin ${file}: ${error}`);
          }
        }
      }

      logger.info(`Loaded plugins from directory: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to load plugins from directory ${dirPath}: ${error}`);
      throw error;
    }
  }

  /**
   * Load multiple plugins from npm packages
   */
  async loadFromNpmPackages(packages: string[]): Promise<void> {
    for (const pkg of packages) {
      try {
        await this.pluginManager.loadPluginFromNpm(pkg);
      } catch (error) {
        logger.error(`Failed to load plugin package ${pkg}: ${error}`);
      }
    }
  }

  /**
   * Discover and load built-in plugins
   */
  async loadBuiltInPlugins(): Promise<void> {
    // Load built-in plugins
    const builtInPlugins = [
      './built-in/github-plugin.js',
      './built-in/jira-plugin.js',
      './built-in/slack-plugin.js'
    ];

    for (const pluginPath of builtInPlugins) {
      try {
        // Try to load, but don't fail if not found
        await this.pluginManager.loadPlugin(pluginPath);
      } catch (error) {
        // Silently skip missing built-in plugins
        logger.debug(`Built-in plugin not loaded: ${pluginPath}`);
      }
    }
  }
}
