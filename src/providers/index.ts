/**
 * Provider exports
 */

export * from './base.js';
export * from './openai.js';
export * from './anthropic.js';
export * from './google.js';
export * from './azure.js';
export * from './ollama.js';
export * from './copilot.js';

import type { ProviderClient } from './base.js';
import type { ProviderKeys } from '../config/types.js';
import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
import { GoogleProvider } from './google.js';
import { AzureProvider } from './azure.js';
import { OllamaProvider } from './ollama.js';
import { CopilotProvider } from './copilot.js';

/**
 * Create a provider client based on provider type and keys
 */
export function createProviderClient(
  provider: string,
  keys: ProviderKeys
): ProviderClient {
  switch (provider) {
    case 'openai':
      if (!keys.openai) {
        throw new Error('OpenAI API key is required');
      }
      return new OpenAIProvider(keys.openai);

    case 'anthropic':
      if (!keys.anthropic) {
        throw new Error('Anthropic API key is required');
      }
      return new AnthropicProvider(keys.anthropic);

    case 'google':
      if (!keys.google) {
        throw new Error('Google API key is required');
      }
      return new GoogleProvider(keys.google);

    case 'azure':
      if (!keys.azure?.apiKey || !keys.azure?.endpoint) {
        throw new Error('Azure OpenAI API key and endpoint are required');
      }
      return new AzureProvider(keys.azure.apiKey, keys.azure.endpoint);

    case 'ollama':
      return new OllamaProvider(keys.ollama);

    case 'copilot':
      if (!keys.copilot) {
        throw new Error('GitHub Copilot API key is required');
      }
      return new CopilotProvider(keys.copilot);

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
