/**
 * Plugins CLI Command
 */

import { PluginManager } from '../../plugins/plugin-manager.js';
import { PluginLoader } from '../../plugins/plugin-loader.js';
import { OhMyCopilot } from '../../oh-my-copilot.js';
import { ui } from '../ui.js';
import chalk from 'chalk';

export async function pluginsCommand(action: string, pluginName?: string, options?: any) {
  const omc = new OhMyCopilot();
  const pluginManager = new PluginManager(omc, options?.config || {});
  const pluginLoader = new PluginLoader(pluginManager);

  switch (action) {
    case 'list':
      await listPlugins(pluginManager);
      break;

    case 'load':
      if (!pluginName) {
        ui.error('Plugin path or package name required for load command');
        process.exit(1);
      }
      await loadPlugin(pluginManager, pluginName, options);
      break;

    case 'install':
      if (!pluginName) {
        ui.error('Package name required for install command');
        process.exit(1);
      }
      await installPlugin(pluginManager, pluginName);
      break;

    case 'unload':
      if (!pluginName) {
        ui.error('Plugin name required for unload command');
        process.exit(1);
      }
      await unloadPlugin(pluginManager, pluginName);
      break;

    case 'info':
      if (!pluginName) {
        ui.error('Plugin name required for info command');
        process.exit(1);
      }
      await showPluginInfo(pluginManager, pluginName);
      break;

    default:
      ui.error(`Unknown action: ${action}`);
      ui.info('Available actions: list, load, install, unload, info');
      process.exit(1);
  }
}

async function listPlugins(pluginManager: PluginManager) {
  ui.header('🔌 Loaded Plugins');

  const plugins = pluginManager.listPlugins();

  if (plugins.length === 0) {
    ui.info('No plugins loaded');
    ui.info('\nTo load a plugin, use:');
    ui.info('  omc plugins load <path>        # Load from file');
    ui.info('  omc plugins install <package>  # Install from npm');
    return;
  }

  console.log('');
  for (const plugin of plugins) {
    console.log(chalk.bold.cyan(`${plugin.name} v${plugin.version}`));
    console.log(chalk.gray(`  ${plugin.description}`));
    if (plugin.author) {
      console.log(chalk.gray(`  Author: ${plugin.author}`));
    }
    console.log(chalk.gray(`  Agents: ${plugin.agentCount}, Tools: ${plugin.toolCount}, Hooks: ${plugin.hookCount}`));
    console.log('');
  }

  console.log(chalk.gray(`Total: ${plugins.length} plugins loaded`));
}

async function loadPlugin(pluginManager: PluginManager, pluginPath: string, options: any) {
  ui.header(`🔌 Loading Plugin`);

  try {
    ui.startSpinner(`Loading plugin from ${pluginPath}...`);

    await pluginManager.loadPlugin(pluginPath);

    ui.succeedSpinner(`Plugin loaded successfully`);
  } catch (error) {
    ui.failSpinner('Failed to load plugin');
    ui.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function installPlugin(pluginManager: PluginManager, packageName: string) {
  ui.header(`📦 Installing Plugin`);

  try {
    ui.startSpinner(`Installing plugin from npm: ${packageName}...`);

    await pluginManager.loadPluginFromNpm(packageName);

    ui.succeedSpinner(`Plugin installed successfully`);
  } catch (error) {
    ui.failSpinner('Failed to install plugin');
    ui.error(error instanceof Error ? error.message : String(error));
    ui.info('\nMake sure the package is installed:');
    ui.info(`  npm install ${packageName}`);
    process.exit(1);
  }
}

async function unloadPlugin(pluginManager: PluginManager, pluginName: string) {
  ui.header(`🔌 Unloading Plugin`);

  try {
    ui.startSpinner(`Unloading plugin: ${pluginName}...`);

    await pluginManager.unloadPlugin(pluginName);

    ui.succeedSpinner(`Plugin unloaded successfully`);
  } catch (error) {
    ui.failSpinner('Failed to unload plugin');
    ui.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function showPluginInfo(pluginManager: PluginManager, pluginName: string) {
  const plugin = pluginManager.getPlugin(pluginName);

  if (!plugin) {
    ui.error(`Plugin not found: ${pluginName}`);
    process.exit(1);
  }

  ui.header(`🔌 Plugin Info: ${plugin.name}`);

  console.log(chalk.bold('Name:'), plugin.name);
  console.log(chalk.bold('Version:'), plugin.version);
  console.log(chalk.bold('Description:'), plugin.description);
  if (plugin.author) {
    console.log(chalk.bold('Author:'), plugin.author);
  }

  if (plugin.agents && plugin.agents.length > 0) {
    console.log(chalk.bold.cyan('\nAgents:'));
    for (const agent of plugin.agents) {
      console.log(`  - ${agent.name}`);
    }
  }

  if (plugin.tools && plugin.tools.length > 0) {
    console.log(chalk.bold.cyan('\nTools:'));
    for (const tool of plugin.tools) {
      console.log(chalk.white(`  ${tool.name}`));
      console.log(chalk.gray(`    ${tool.description}`));
      console.log(chalk.gray(`    Parameters: ${JSON.stringify(tool.parameters)}`));
    }
  }

  if (plugin.hooks && plugin.hooks.length > 0) {
    console.log(chalk.bold.cyan('\nHooks:'));
    for (const hook of plugin.hooks) {
      console.log(`  - ${hook.event}`);
    }
  }
}
