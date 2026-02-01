# Configuration

Learn how to configure Oh My Copilot for your needs.

## Configuration Methods

Oh My Copilot can be configured in multiple ways, with the following priority order:

1. **Command-line arguments** (highest priority)
2. **Environment variables**
3. **Configuration file** (`omc.config.json`)
4. **Interactive wizard** (`omc config`)
5. **Default values** (lowest priority)

## Interactive Configuration Wizard

The easiest way to get started:

```bash
omc config
```

This wizard will guide you through:
- ✅ Choosing your AI provider
- ✅ Setting up API keys
- ✅ Selecting default models
- ✅ Configuring tracking preferences
- ✅ Setting log levels

## Environment Variables

Create a `.env` file in your project root or set system environment variables:

```env
# AI Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://....openai.azure.com
OLLAMA_BASE_URL=http://localhost:11434
GITHUB_COPILOT_API_KEY=...

# Default Settings
DEFAULT_PROVIDER=openai          # openai|anthropic|google|azure|ollama|copilot
DEFAULT_MODEL=gpt-4o-mini
LOG_LEVEL=info                   # debug|info|warn|error
TRACK_COSTS=true                 # true|false
```

### Loading `.env` Files

Oh My Copilot automatically loads `.env` files from:
1. Current directory
2. Home directory (`~/.oh-my-copilot/.env`)

You can also specify a custom env file:

```bash
omc --env-file /path/to/.env autopilot "Task"
```

## Configuration File

Create `omc.config.json` in your project root or home directory:

### Basic Configuration

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o-mini",
  "trackCosts": true,
  "logLevel": "info"
}
```

### Advanced Configuration

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o-mini",
  
  "agents": {
    "architect": { 
      "model": "gpt-4o",
      "temperature": 0.3
    },
    "executor": { 
      "model": "gpt-4o-mini",
      "temperature": 0.2
    },
    "qa-tester": { 
      "model": "claude-3-haiku-20240307",
      "temperature": 0.3
    },
    "security": { 
      "model": "gpt-4o",
      "temperature": 0.1
    },
    "designer": { 
      "model": "gpt-4o",
      "temperature": 0.5
    }
  },
  
  "models": {
    "aliases": {
      "fast": "gpt-4o-mini",
      "smart": "gpt-4o",
      "cheap": "claude-3-haiku-20240307",
      "vision": "gpt-4o"
    },
    "custom": [
      {
        "id": "llama3:70b",
        "name": "Llama 3 70B (Local)",
        "provider": "ollama",
        "tier": "standard",
        "costPer1MInput": 0,
        "costPer1MOutput": 0
      }
    ],
    "disabled": ["gpt-4", "claude-3-opus-20240229"]
  },
  
  "execution": {
    "autopilot": {
      "skipSecurity": false,
      "skipTests": false,
      "maxRetries": 3
    },
    "ultrawork": {
      "maxConcurrency": 3,
      "timeout": 300000
    },
    "swarm": {
      "defaultAgents": 3,
      "pollingInterval": 1000,
      "stopWhenEmpty": true
    },
    "eco": {
      "maxCostThreshold": 0.10
    }
  },
  
  "web": {
    "port": 3000,
    "host": "localhost",
    "enableAuth": false
  },
  
  "tracking": {
    "enableCosts": true,
    "enableMetrics": true,
    "logRequests": true
  },
  
  "output": {
    "format": "text",
    "colorize": true,
    "timestamp": true
  }
}
```

## AI Provider Setup

### OpenAI

1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   DEFAULT_PROVIDER=openai
   ```

**Available Models:**
- `gpt-4o` - Most capable, vision support
- `gpt-4o-mini` - Fast and cost-effective
- `o1-preview` - Advanced reasoning
- `o1-mini` - Efficient reasoning

### Anthropic (Claude)

1. Get API key from https://console.anthropic.com/
2. Add to `.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   DEFAULT_PROVIDER=anthropic
   ```

**Available Models:**
- `claude-3-5-sonnet-20241022` - Most capable
- `claude-3-opus-20240229` - Most intelligent
- `claude-3-haiku-20240307` - Fast and affordable

### Google (Gemini)

1. Get API key from https://aistudio.google.com/app/apikey
2. Add to `.env`:
   ```env
   GOOGLE_API_KEY=AIza...
   DEFAULT_PROVIDER=google
   ```

**Available Models:**
- `gemini-2.0-flash` - Fast and efficient
- `gemini-1.5-pro` - Most capable
- `gemini-1.5-flash` - Speed optimized

### Azure OpenAI

1. Set up Azure OpenAI resource
2. Get endpoint and key
3. Add to `.env`:
   ```env
   AZURE_OPENAI_API_KEY=...
   AZURE_OPENAI_ENDPOINT=https://....openai.azure.com
   DEFAULT_PROVIDER=azure
   ```

### Ollama (Local Models)

1. Install Ollama: https://ollama.ai/
2. Pull a model: `ollama pull llama3`
3. Add to `.env`:
   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   DEFAULT_PROVIDER=ollama
   DEFAULT_MODEL=llama3
   ```

### GitHub Copilot

1. Get Copilot access
2. Add to `.env`:
   ```env
   GITHUB_COPILOT_API_KEY=...
   DEFAULT_PROVIDER=copilot
   ```

## Per-Agent Configuration

Customize each agent's model and temperature:

```json
{
  "agents": {
    "architect": {
      "model": "gpt-4o",
      "temperature": 0.3,
      "maxTokens": 4000
    },
    "executor": {
      "model": "claude-3-5-sonnet-20241022",
      "temperature": 0.2
    },
    "qa-tester": {
      "model": "gpt-4o-mini",
      "temperature": 0.3
    },
    "security": {
      "model": "gpt-4o",
      "temperature": 0.1
    }
  }
}
```

## Model Aliases

Create shortcuts for frequently used models:

```json
{
  "models": {
    "aliases": {
      "fast": "gpt-4o-mini",
      "smart": "gpt-4o",
      "cheap": "claude-3-haiku-20240307",
      "local": "llama3:70b"
    }
  }
}
```

Use aliases in commands:

```bash
omc autopilot "Task" --model fast
omc eco "Task" --model cheap
```

## Custom Models

Add custom or fine-tuned models:

```json
{
  "models": {
    "custom": [
      {
        "id": "my-fine-tuned-model",
        "name": "My Fine-tuned GPT-4",
        "provider": "openai",
        "tier": "premium",
        "costPer1MInput": 10,
        "costPer1MOutput": 30,
        "maxTokens": 128000
      },
      {
        "id": "llama3:70b",
        "name": "Llama 3 70B Local",
        "provider": "ollama",
        "tier": "standard",
        "costPer1MInput": 0,
        "costPer1MOutput": 0
      }
    ]
  }
}
```

## Command-Line Overrides

Override configuration for a single command:

```bash
# Override model
omc autopilot "Task" --model gpt-4o

# Override provider
omc eco "Task" --provider anthropic

# Override API key
omc autopilot "Task" --openai-key sk-...

# Override log level
omc --log-level debug autopilot "Task"

# Disable cost tracking
omc --no-track-costs autopilot "Task"
```

## Configuration File Locations

Oh My Copilot looks for config files in:

1. Current directory: `./omc.config.json`
2. Home directory: `~/.oh-my-copilot/omc.config.json`
3. Custom location: `omc --config /path/to/config.json`

## VS Code Extension Configuration

Configure through VS Code settings:

1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Oh My Copilot"
3. Configure:
   - `ohMyCopilot.openaiApiKey`
   - `ohMyCopilot.defaultProvider`
   - `ohMyCopilot.defaultModel`
   - `ohMyCopilot.trackCosts`
   - etc.

Or edit `settings.json`:

```json
{
  "ohMyCopilot.openaiApiKey": "sk-...",
  "ohMyCopilot.defaultProvider": "openai",
  "ohMyCopilot.defaultModel": "gpt-4o-mini",
  "ohMyCopilot.trackCosts": true,
  "ohMyCopilot.logLevel": "info"
}
```

## Security Best Practices

### API Key Security

1. **Never commit API keys** to version control
2. **Use environment variables** or config files
3. **Add to .gitignore**:
   ```
   .env
   .env.local
   omc.config.json
   ```

4. **Use key rotation** regularly
5. **Set usage limits** in provider dashboards
6. **Use separate keys** for different environments

### Example .gitignore

```
# Oh My Copilot
.env
.env.*
omc.config.json
.oh-my-copilot/
*.log
.omc-cache/
```

## Validation

Validate your configuration:

```bash
omc config --validate
```

This checks:
- ✅ API keys are set and valid
- ✅ Models are available
- ✅ Configuration syntax is correct
- ✅ Provider connections work

## Troubleshooting Configuration

### API Key Not Working

```bash
# Test API key
omc config --test-key openai

# Show current configuration
omc config --show

# Reset to defaults
omc config --reset
```

### Configuration Not Loading

```bash
# Debug configuration loading
omc --log-level debug config --show

# Use specific config file
omc --config /path/to/config.json autopilot "Task"
```

## Next Steps

- [Quick Start](Quick-Start) - Start using Oh My Copilot
- [BYOK Guide](BYOK) - Detailed provider setup
- [Agent System](Agent-System) - Configure agents
- [CLI Reference](CLI-Reference) - All command options
