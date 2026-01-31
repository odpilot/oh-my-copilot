/**
 * Configuration types
 */

export type ProviderType = 'openai' | 'anthropic' | 'google' | 'azure' | 'ollama' | 'copilot';

export type ModelTier = 'fast' | 'standard' | 'premium';

export interface ModelConfig {
  id: string;
  name: string;
  provider: ProviderType;
  tier: ModelTier;
  costPer1MInput: number;
  costPer1MOutput: number;
  maxTokens: number;
  capabilities: string[];
}

export interface ProviderKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  azure?: {
    apiKey: string;
    endpoint: string;
  };
  ollama?: string;
  copilot?: string;
}

export interface UserConfig {
  defaultProvider?: string;
  defaultModel?: string;
  models?: {
    custom?: ModelConfig[];
    disabled?: string[];
    aliases?: Record<string, string>;
  };
  agents?: Record<string, { model: string }>;
}

export interface ProviderConfig {
  apiKey: string;
  baseURL?: string;
  endpoint?: string;
}

export interface OhMyCopilotConfig {
  // Database
  dbPath?: string;
  
  // Models
  architectModel?: string;
  executorModel?: string;
  qaTesterModel?: string;
  securityModel?: string;
  designerModel?: string;
  
  // Cost tracking
  trackCosts?: boolean;
  
  // Logging
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  logFile?: string;
  
  // API
  apiKey?: string;
  githubToken?: string;
  
  // BYOK
  providerKeys?: ProviderKeys;
  defaultProvider?: string;
  defaultModel?: string;
}
