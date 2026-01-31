/**
 * Configuration command for CLI
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { ui } from '../ui.js';
import { loadUserConfig, saveUserConfig } from '../../config/user-config.js';
import { loadKeys, getAvailableProviders } from '../../config/keys.js';
import { DEFAULT_MODELS, getModelsByProvider } from '../../config/models.js';
import type { UserConfig } from '../../config/types.js';

/**
 * Main config command
 */
export async function configCommand(options: any) {
  ui.header('⚙️  Configuration');

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to configure?',
      choices: [
        { name: '🔑 Manage API Keys', value: 'keys' },
        { name: '🤖 Select Models', value: 'models' },
        { name: '📋 View Current Config', value: 'view' },
        { name: '🔄 Reset to Defaults', value: 'reset' }
      ]
    }
  ]);

  switch (answers.action) {
    case 'keys':
      await manageKeys();
      break;
    case 'models':
      await selectModels();
      break;
    case 'view':
      await viewConfig();
      break;
    case 'reset':
      await resetConfig();
      break;
  }
}

/**
 * Manage API keys
 */
async function manageKeys() {
  ui.section('API Key Management');

  const keys = loadKeys();
  const available = getAvailableProviders(keys);

  console.log('\n' + chalk.cyan('Available Providers:'));
  if (available.length === 0) {
    console.log(chalk.yellow('  No API keys configured yet.'));
  } else {
    available.forEach(provider => {
      console.log(`  ✓ ${chalk.green(provider)}`);
    });
  }

  console.log('\n' + chalk.cyan('Missing Providers:'));
  const allProviders = ['openai', 'anthropic', 'google', 'azure', 'ollama', 'copilot'];
  const missing = allProviders.filter(p => !available.includes(p));
  
  if (missing.length === 0) {
    console.log(chalk.green('  All providers configured!'));
  } else {
    missing.forEach(provider => {
      console.log(`  ✗ ${chalk.gray(provider)}`);
    });
  }

  console.log('\n' + chalk.dim('To add API keys, edit your .env file or set environment variables.'));
  console.log(chalk.dim('See .env.example for configuration options.'));
}

/**
 * Interactive model selection
 */
async function selectModels() {
  ui.section('Model Selection');

  const keys = loadKeys();
  const available = getAvailableProviders(keys);

  if (available.length === 0) {
    ui.error('No API keys configured. Please configure at least one provider first.');
    console.log(chalk.dim('Run: omc config (select "Manage API Keys")'));
    return;
  }

  // Select default provider
  const { defaultProvider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'defaultProvider',
      message: 'Select default provider:',
      choices: available.map(p => ({ name: p, value: p }))
    }
  ]);

  // Get models for selected provider
  const models = getModelsByProvider(defaultProvider);
  
  // Select default model
  const { defaultModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'defaultModel',
      message: 'Select default model:',
      choices: models.map(m => ({
        name: `${m.name} (${m.tier}) - $${m.costPer1MInput}/1M input`,
        value: m.id
      }))
    }
  ]);

  // Select agent models
  const { configureAgents } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'configureAgents',
      message: 'Configure specific models for each agent?',
      default: false
    }
  ]);

  let agentModels = {};

  if (configureAgents) {
    const agents = ['architect', 'executor', 'qa-tester', 'security', 'designer'];
    
    for (const agent of agents) {
      const { model } = await inquirer.prompt([
        {
          type: 'list',
          name: 'model',
          message: `Select model for ${agent} agent:`,
          choices: [
            { name: 'Use default', value: defaultModel },
            ...models.map(m => ({
              name: `${m.name} (${m.tier}) - $${m.costPer1MInput}/1M input`,
              value: m.id
            }))
          ],
          default: defaultModel
        }
      ]);

      agentModels[agent] = { model };
    }
  }

  // Save configuration
  const config: UserConfig = {
    defaultProvider,
    defaultModel,
    ...(Object.keys(agentModels).length > 0 && { agents: agentModels })
  };

  saveUserConfig(config);
  ui.success('Configuration saved to omc.config.json');
  
  console.log('\n' + chalk.cyan('Current Configuration:'));
  console.log(`  Default Provider: ${chalk.green(defaultProvider)}`);
  console.log(`  Default Model: ${chalk.green(defaultModel)}`);
  
  if (Object.keys(agentModels).length > 0) {
    console.log('\n' + chalk.cyan('Agent-specific Models:'));
    Object.entries(agentModels).forEach(([agent, config]: [string, any]) => {
      console.log(`  ${agent}: ${chalk.green(config.model)}`);
    });
  }
}

/**
 * View current configuration
 */
async function viewConfig() {
  ui.section('Current Configuration');

  const userConfig = loadUserConfig();
  const keys = loadKeys();
  const available = getAvailableProviders(keys);

  console.log(chalk.cyan('Available Providers:'));
  available.forEach(provider => {
    console.log(`  ✓ ${chalk.green(provider)}`);
  });

  console.log('\n' + chalk.cyan('Configuration:'));
  
  if (!userConfig) {
    console.log(chalk.yellow('  No custom configuration found (using defaults)'));
    console.log(chalk.dim('  Run "omc config" to create a configuration'));
  } else {
    console.log(JSON.stringify(userConfig, null, 2));
  }

  console.log('\n' + chalk.cyan('Available Models:'));
  DEFAULT_MODELS.forEach(model => {
    const available = model.provider;
    const status = keys[available as keyof typeof keys] ? '✓' : '✗';
    const color = keys[available as keyof typeof keys] ? chalk.green : chalk.gray;
    console.log(`  ${status} ${color(model.name)} (${model.provider}) - ${model.tier}`);
  });
}

/**
 * Reset configuration to defaults
 */
async function resetConfig() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to reset configuration to defaults?',
      default: false
    }
  ]);

  if (confirm) {
    const config: UserConfig = {};
    saveUserConfig(config);
    ui.success('Configuration reset to defaults');
  } else {
    ui.info('Reset cancelled');
  }
}
