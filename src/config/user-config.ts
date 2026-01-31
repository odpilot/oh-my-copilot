/**
 * User configuration file loader
 */

import * as fs from 'fs';
import * as path from 'path';
import type { UserConfig } from './types.js';

const CONFIG_FILENAME = 'omc.config.json';

/**
 * Load user configuration from omc.config.json
 */
export function loadUserConfig(configPath?: string): UserConfig | null {
  const filepath = configPath || path.join(process.cwd(), CONFIG_FILENAME);
  
  if (!fs.existsSync(filepath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const config = JSON.parse(content) as UserConfig;
    return config;
  } catch (error) {
    console.error(`Error loading user config from ${filepath}:`, error);
    return null;
  }
}

/**
 * Save user configuration to omc.config.json
 */
export function saveUserConfig(config: UserConfig, configPath?: string): void {
  const filepath = configPath || path.join(process.cwd(), CONFIG_FILENAME);
  
  try {
    fs.writeFileSync(filepath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving user config to ${filepath}:`, error);
    throw error;
  }
}

/**
 * Get model ID from alias or return as-is
 */
export function resolveModelAlias(modelId: string, config: UserConfig | null): string {
  if (!config?.models?.aliases) {
    return modelId;
  }

  return config.models.aliases[modelId] || modelId;
}

/**
 * Check if a model is disabled
 */
export function isModelDisabled(modelId: string, config: UserConfig | null): boolean {
  if (!config?.models?.disabled) {
    return false;
  }

  return config.models.disabled.includes(modelId);
}
