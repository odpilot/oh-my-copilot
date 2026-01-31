/**
 * Model configurations and defaults
 */

import type { ModelConfig } from './types.js';

export const DEFAULT_MODELS: ModelConfig[] = [
  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    tier: 'premium',
    costPer1MInput: 5,
    costPer1MOutput: 15,
    maxTokens: 128000,
    capabilities: ['code', 'chat', 'vision']
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    tier: 'fast',
    costPer1MInput: 0.15,
    costPer1MOutput: 0.6,
    maxTokens: 128000,
    capabilities: ['code', 'chat']
  },
  {
    id: 'o1',
    name: 'o1',
    provider: 'openai',
    tier: 'premium',
    costPer1MInput: 15,
    costPer1MOutput: 60,
    maxTokens: 200000,
    capabilities: ['reasoning', 'code']
  },
  {
    id: 'o1-mini',
    name: 'o1 Mini',
    provider: 'openai',
    tier: 'standard',
    costPer1MInput: 3,
    costPer1MOutput: 12,
    maxTokens: 128000,
    capabilities: ['reasoning', 'code']
  },

  // Anthropic
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    tier: 'premium',
    costPer1MInput: 3,
    costPer1MOutput: 15,
    maxTokens: 200000,
    capabilities: ['code', 'chat', 'vision']
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    tier: 'premium',
    costPer1MInput: 15,
    costPer1MOutput: 75,
    maxTokens: 200000,
    capabilities: ['code', 'chat', 'vision']
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    tier: 'fast',
    costPer1MInput: 0.25,
    costPer1MOutput: 1.25,
    maxTokens: 200000,
    capabilities: ['code', 'chat']
  },

  // Google Gemini
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    tier: 'fast',
    costPer1MInput: 0.1,
    costPer1MOutput: 0.4,
    maxTokens: 1000000,
    capabilities: ['code', 'chat', 'vision']
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    tier: 'premium',
    costPer1MInput: 1.25,
    costPer1MOutput: 5,
    maxTokens: 2000000,
    capabilities: ['code', 'chat', 'vision']
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    tier: 'fast',
    costPer1MInput: 0.075,
    costPer1MOutput: 0.3,
    maxTokens: 1000000,
    capabilities: ['code', 'chat', 'vision']
  }
];

/**
 * Get model configuration by ID
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return DEFAULT_MODELS.find(m => m.id === modelId);
}

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: string): ModelConfig[] {
  return DEFAULT_MODELS.filter(m => m.provider === provider);
}

/**
 * Get models by tier
 */
export function getModelsByTier(tier: string): ModelConfig[] {
  return DEFAULT_MODELS.filter(m => m.tier === tier);
}
