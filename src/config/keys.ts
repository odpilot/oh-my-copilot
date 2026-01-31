/**
 * API Key loading and validation logic
 */

import * as dotenv from 'dotenv';
import type { ProviderKeys } from './types.js';

// Load environment variables
dotenv.config();

/**
 * Load API keys from environment variables and CLI args
 * Priority: CLI args > process.env > .env
 */
export function loadKeys(cliArgs?: Partial<ProviderKeys>): ProviderKeys {
  const keys: ProviderKeys = {
    openai: cliArgs?.openai || process.env.OPENAI_API_KEY,
    anthropic: cliArgs?.anthropic || process.env.ANTHROPIC_API_KEY,
    google: cliArgs?.google || process.env.GOOGLE_API_KEY,
    ollama: cliArgs?.ollama || process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    copilot: cliArgs?.copilot || process.env.GITHUB_COPILOT_API_KEY
  };

  // Handle Azure separately due to multiple required values
  if (cliArgs?.azure || process.env.AZURE_OPENAI_API_KEY) {
    keys.azure = {
      apiKey: cliArgs?.azure?.apiKey || process.env.AZURE_OPENAI_API_KEY || '',
      endpoint: cliArgs?.azure?.endpoint || process.env.AZURE_OPENAI_ENDPOINT || ''
    };
  }

  return keys;
}

/**
 * Validate that required API key exists for a provider
 */
export function validateKeys(keys: ProviderKeys, requiredProvider: string): void {
  const key = keys[requiredProvider as keyof ProviderKeys];
  
  if (!key) {
    throw new Error(
      `Missing API key for provider: ${requiredProvider}. ` +
      `Please set the appropriate environment variable or pass it via CLI.\n` +
      `See .env.example for configuration options.`
    );
  }

  // Additional validation for Azure
  if (requiredProvider === 'azure' && typeof key === 'object') {
    if (!key.apiKey || !key.endpoint) {
      throw new Error(
        'Azure OpenAI requires both AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT to be set.'
      );
    }
  }
}

/**
 * Get available providers based on loaded keys
 */
export function getAvailableProviders(keys: ProviderKeys): string[] {
  const available: string[] = [];

  if (keys.openai) available.push('openai');
  if (keys.anthropic) available.push('anthropic');
  if (keys.google) available.push('google');
  if (keys.azure?.apiKey && keys.azure?.endpoint) available.push('azure');
  if (keys.ollama) available.push('ollama');
  if (keys.copilot) available.push('copilot');

  return available;
}

/**
 * Check if a specific provider is available
 */
export function isProviderAvailable(keys: ProviderKeys, provider: string): boolean {
  return getAvailableProviders(keys).includes(provider);
}
