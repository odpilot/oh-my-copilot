/**
 * Default configuration
 */

import type { OhMyCopilotConfig } from './types.js';

export const DEFAULT_CONFIG: OhMyCopilotConfig = {
  dbPath: ':memory:',
  architectModel: 'gpt-4o',
  executorModel: 'gpt-4o-mini',
  qaTesterModel: 'gpt-4o-mini',
  securityModel: 'gpt-4o',
  designerModel: 'gpt-4o',
  trackCosts: true,
  logLevel: 'info',
  logFile: '',
  apiKey: '',
  githubToken: '',
  defaultProvider: 'openai',
  defaultModel: 'gpt-4o-mini'
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(userConfig: OhMyCopilotConfig = {}): OhMyCopilotConfig {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig
  };
}
