# BYOK Configuration Guide

## Overview

Oh My Copilot supports **Bring Your Own Key (BYOK)** functionality, allowing you to use your preferred AI providers with your own API keys. This gives you full control over costs, model selection, and provider choice.

## Supported Providers

### 1. OpenAI

**Models**: GPT-4o, GPT-4o-mini, o1, o1-mini

**Setup**:
```env
OPENAI_API_KEY=sk-...
```

**Cost**: 
- GPT-4o: ~$0.005-0.015 per 1K tokens
- GPT-4o-mini: ~$0.0001-0.0006 per 1K tokens

### 2. Anthropic (Claude)

**Models**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku

**Setup**:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

**Cost**:
- Claude 3.5 Sonnet: ~$0.003-0.015 per 1K tokens
- Claude 3 Haiku: ~$0.00025-0.00125 per 1K tokens

### 3. Google Gemini

**Models**: Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash

**Setup**:
```env
GOOGLE_API_KEY=AIza...
```

**Cost**:
- Gemini 2.0 Flash: Free tier available
- Gemini 1.5 Pro: ~$0.00125-0.005 per 1K tokens

### 4. Azure OpenAI

**Models**: GPT-4o (Azure deployments)

**Setup**:
```env
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
```

**Cost**: Based on Azure pricing

### 5. Ollama (Local)

**Models**: Llama 3, Mistral, and other local models

**Setup**:
```env
OLLAMA_BASE_URL=http://localhost:11434
```

**Cost**: Free (runs locally)

### 6. GitHub Copilot

**Models**: Copilot SDK models

**Setup**:
```env
GITHUB_COPILOT_API_KEY=...
```

---

## Configuration Methods

### Method 1: Environment Variables

Create a `.env` file in your project root:

```env
# Primary provider
OPENAI_API_KEY=sk-...
DEFAULT_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini

# Additional providers (optional)
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# Azure (if using)
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://...

# Ollama (if using local models)
OLLAMA_BASE_URL=http://localhost:11434
```

### Method 2: Interactive Configuration

Use the built-in configuration wizard:

```bash
omc config
```

This will guide you through:
1. Viewing available API keys
2. Selecting default provider and model
3. Configuring agent-specific models
4. Setting model aliases

### Method 3: Configuration File

Create `omc.config.json`:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o-mini",
  "agents": {
    "architect": {
      "model": "gpt-4o",
      "provider": "openai"
    },
    "executor": {
      "model": "gpt-4o-mini",
      "provider": "openai"
    },
    "qa-tester": {
      "model": "claude-3-haiku-20240307",
      "provider": "anthropic"
    },
    "security": {
      "model": "gpt-4o",
      "provider": "openai"
    },
    "designer": {
      "model": "gemini-2.0-flash-exp",
      "provider": "google"
    }
  },
  "models": {
    "aliases": {
      "fast": "gpt-4o-mini",
      "smart": "gpt-4o",
      "cheap": "claude-3-haiku-20240307",
      "local": "llama3"
    },
    "disabled": ["o1-mini"]
  }
}
```

### Method 4: Programmatic Configuration

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot({
  defaultProvider: 'openai',
  architectModel: 'gpt-4o',
  executorModel: 'gpt-4o-mini',
  qaModel: 'claude-3-haiku-20240307',
  securityModel: 'gpt-4o',
  designerModel: 'gemini-2.0-flash-exp'
});
```

---

## Configuration Priority

When Oh My Copilot looks for configuration, it checks in this order:

1. **Programmatic configuration** (passed to constructor)
2. **omc.config.json** file
3. **Environment variables** (.env file)
4. **Default values**

---

## Model Selection

### Model Aliases

Define shortcuts for commonly used models:

```json
{
  "models": {
    "aliases": {
      "fast": "gpt-4o-mini",
      "smart": "gpt-4o",
      "cheap": "claude-3-haiku-20240307",
      "premium": "claude-3-5-sonnet-20240620",
      "local": "llama3"
    }
  }
}
```

Usage:
```typescript
const architect = new ArchitectAgent({ model: 'smart' });
const executor = new ExecutorAgent({ model: 'fast' });
```

### Per-Agent Model Configuration

Assign different models to different agents for cost optimization:

```json
{
  "agents": {
    "architect": { "model": "gpt-4o" },        // Complex planning
    "executor": { "model": "gpt-4o-mini" },    // Fast implementation
    "qa-tester": { "model": "claude-3-haiku-20240307" }, // Cheap testing
    "security": { "model": "gpt-4o" },         // Thorough review
    "designer": { "model": "gemini-2.0-flash-exp" }  // Visual tasks
  }
}
```

---

## Cost Optimization

### Strategy 1: Use Cheaper Models for Simple Tasks

```json
{
  "agents": {
    "executor": { "model": "gpt-4o-mini" },
    "qa-tester": { "model": "claude-3-haiku-20240307" }
  }
}
```

### Strategy 2: Use Local Models When Possible

```env
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_MODEL=llama3
```

### Strategy 3: Mix Providers

Use the best model from each provider for specific tasks:

```json
{
  "agents": {
    "architect": { "model": "gpt-4o", "provider": "openai" },
    "executor": { "model": "claude-3-haiku-20240307", "provider": "anthropic" },
    "qa-tester": { "model": "gemini-2.0-flash-exp", "provider": "google" }
  }
}
```

### Strategy 4: Enable Cost Tracking

Always track costs to optimize:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });
await omc.autopilot('Task');
console.log(omc.getCostReport());
```

---

## Provider Comparison

| Provider | Speed | Cost | Quality | Best For |
|----------|-------|------|---------|----------|
| OpenAI GPT-4o | Fast | High | Excellent | Complex tasks, planning |
| OpenAI GPT-4o-mini | Very Fast | Low | Good | Simple tasks, fast iteration |
| Claude 3.5 Sonnet | Fast | Medium | Excellent | Code generation, analysis |
| Claude 3 Haiku | Very Fast | Very Low | Good | Testing, simple tasks |
| Gemini 2.0 Flash | Very Fast | Free tier | Good | Rapid prototyping |
| Ollama (Local) | Varies | Free | Varies | Privacy, offline work |

---

## Troubleshooting

### API Key Not Found

**Error**: `API key not found for provider: openai`

**Solution**: Make sure your `.env` file has the correct key:
```env
OPENAI_API_KEY=sk-...
```

### Invalid API Key

**Error**: `Invalid API key`

**Solution**: Check that your API key is correct and has proper permissions.

### Rate Limiting

**Error**: `Rate limit exceeded`

**Solution**: 
1. Reduce concurrency in ultrawork mode
2. Add delays between requests
3. Upgrade your API plan

### Model Not Available

**Error**: `Model not found: gpt-4o`

**Solution**: Check that the model name is correct and your account has access to it.

---

## Best Practices

1. **Use Multiple Providers**: Don't rely on a single provider
2. **Track Costs**: Always enable cost tracking
3. **Optimize Model Selection**: Use expensive models only when needed
4. **Set Budgets**: Use `maxCostThreshold` in ecomode
5. **Test Locally First**: Use Ollama for development
6. **Rotate Keys**: Keep API keys secure and rotate regularly
7. **Monitor Usage**: Check provider dashboards regularly

---

## Example Configurations

### Budget-Conscious Setup

```json
{
  "defaultProvider": "anthropic",
  "defaultModel": "claude-3-haiku-20240307",
  "agents": {
    "architect": { "model": "claude-3-haiku-20240307" },
    "executor": { "model": "claude-3-haiku-20240307" },
    "qa-tester": { "model": "gemini-2.0-flash-exp", "provider": "google" },
    "security": { "model": "claude-3-5-sonnet-20240620" }
  }
}
```

### Performance-Focused Setup

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o",
  "agents": {
    "architect": { "model": "gpt-4o" },
    "executor": { "model": "gpt-4o" },
    "qa-tester": { "model": "gpt-4o-mini" },
    "security": { "model": "gpt-4o" },
    "designer": { "model": "gpt-4o" }
  }
}
```

### Local Development Setup

```json
{
  "defaultProvider": "ollama",
  "defaultModel": "llama3",
  "models": {
    "aliases": {
      "fast": "llama3",
      "smart": "mistral"
    }
  }
}
```

---

## Security Considerations

1. **Never commit API keys** to version control
2. **Use .env files** and add to `.gitignore`
3. **Rotate keys regularly**
4. **Use environment-specific keys** (dev, staging, prod)
5. **Monitor API usage** for unexpected spikes
6. **Set spending limits** in provider dashboards
