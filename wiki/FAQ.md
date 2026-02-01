# FAQ (Frequently Asked Questions)

## General Questions

### What is Oh My Copilot?

Oh My Copilot is a multi-agent AI orchestration system built with the GitHub Copilot SDK. It uses specialized AI agents working together to automate complex development tasks.

### Is Oh My Copilot free?

Oh My Copilot itself is free and open-source (MIT License). However, you need API keys from AI providers (OpenAI, Anthropic, Google, etc.), which have their own pricing.

### Do I need GitHub Copilot to use this?

No! Despite the name, Oh My Copilot works with multiple AI providers:
- OpenAI (GPT-4o, GPT-4o-mini)
- Anthropic (Claude)
- Google (Gemini)
- Azure OpenAI
- Ollama (local models)
- GitHub Copilot SDK (optional)

### What's the difference between Oh My Copilot and GitHub Copilot?

**GitHub Copilot**: IDE code completion and chat
**Oh My Copilot**: Multi-agent orchestration system that coordinates multiple specialized agents for complex tasks

They can be used together, but serve different purposes.

## Installation & Setup

### Which AI provider should I use?

For beginners, we recommend:
1. **OpenAI** - Good balance of performance and cost (gpt-4o-mini)
2. **Google Gemini** - Excellent performance, low cost
3. **Anthropic** - High quality, good for code tasks

For advanced users:
- **Ollama** - Free, runs locally, no API costs
- **Azure** - Enterprise support and compliance

### How do I get an API key?

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **Google**: https://aistudio.google.com/app/apikey
- **Azure**: https://portal.azure.com/ (requires Azure subscription)
- **Ollama**: No key needed, install locally

### Can I use multiple providers?

Yes! You can:
- Configure multiple API keys
- Use different providers for different agents
- Switch providers per command
- Mix and match models

Example config:
```json
{
  "agents": {
    "architect": { "model": "gpt-4o" },
    "executor": { "model": "claude-3-5-sonnet-20241022" },
    "qa-tester": { "model": "gemini-2.0-flash" }
  }
}
```

## Usage Questions

### Which execution mode should I use?

- **Simple task?** → Economy mode
- **Complex task?** → Autopilot mode
- **Multiple tasks?** → Ultrawork mode
- **Many tasks?** → Swarm mode

See [Execution Modes](Execution-Modes) for details.

### How much does it cost to run a task?

Costs vary by:
- **Mode**: Economy (~$0.01), Autopilot (~$0.10-$0.50)
- **Model**: GPT-4o-mini (~$0.01), GPT-4o (~$0.10)
- **Complexity**: Simple tasks cost less

Use `omc cost` to see actual costs after running tasks.

### Can I run Oh My Copilot offline?

Yes, with Ollama:
1. Install Ollama: https://ollama.ai/
2. Pull a model: `ollama pull llama3`
3. Configure: `DEFAULT_PROVIDER=ollama`
4. Run: `omc autopilot "Task"`

No internet required after setup!

### How do I see what it's doing?

Several options:
```bash
# Web dashboard
omc web

# Verbose logging
omc --log-level debug autopilot "Task"

# Cost tracking
omc cost

# Metrics
omc metrics
```

## Features & Capabilities

### What tasks can Oh My Copilot handle?

Oh My Copilot can:
- ✅ Write code
- ✅ Generate tests
- ✅ Review code
- ✅ Create documentation
- ✅ Refactor code
- ✅ Fix bugs
- ✅ Design systems
- ✅ Security analysis
- ✅ API development
- ✅ Data analysis

### Can it modify existing code?

Yes! You can:
```bash
# Refactor existing code
omc eco "Refactor this function to use async/await" < myfile.js

# Add features
omc autopilot "Add error handling to all API endpoints"

# Fix issues
omc eco "Fix the bug in the login function"
```

### Does it support multiple programming languages?

Yes! Oh My Copilot works with:
- JavaScript/TypeScript
- Python
- Java
- C#
- Go
- Rust
- Ruby
- PHP
- And more!

The underlying AI models understand most programming languages.

### Can I create custom agents?

Yes! See [Custom Agents](Custom-Agents) guide.

Example:
```typescript
import { BaseAgent } from 'oh-my-copilot';

class DatabaseExpert extends BaseAgent {
  constructor() {
    super({
      name: 'database-expert',
      model: 'gpt-4o',
      systemPrompt: 'You are a database optimization expert...',
    });
  }
}
```

## Technical Questions

### How does the agent system work?

Oh My Copilot uses specialized agents, each with:
- **Role**: Specific responsibility (architecture, coding, testing, etc.)
- **Model**: AI model (can be different per agent)
- **System Prompt**: Instructions that define agent behavior
- **Context**: Shared context between agents

Agents communicate through a coordination layer that manages workflow.

### What happens to my code?

- **Local Processing**: Oh My Copilot runs locally
- **API Calls**: Code is sent to AI provider APIs for processing
- **No Storage**: Code is not stored by Oh My Copilot
- **Provider Policies**: Check your AI provider's data policy

### Is my API key secure?

Yes, if you follow best practices:
- ✅ Store in `.env` files (not in code)
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables
- ✅ Don't commit config files
- ❌ Don't share API keys
- ❌ Don't commit them to GitHub

### Can I use it in CI/CD?

Yes! Example GitHub Actions:

```yaml
- name: Run Oh My Copilot
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    npm install -g oh-my-copilot
    omc autopilot "Review this PR for issues"
```

### Does it work with my IDE?

- **VS Code**: Yes! We have an [extension](VSCode-Extension)
- **Other IDEs**: Use the CLI from terminal

## Pricing & Costs

### How do I control costs?

1. **Use Economy Mode**: For simple tasks
2. **Set Cost Limits**:
   ```json
   {
     "execution": {
       "eco": {
         "maxCostThreshold": 0.10
       }
     }
   }
   ```
3. **Use Cheaper Models**: gpt-4o-mini, gemini-flash
4. **Track Costs**: `omc cost`
5. **Use Local Models**: Ollama (free)

### What are typical costs?

| Task Type | Mode | Typical Cost |
|-----------|------|--------------|
| Simple refactor | Economy | $0.01 - $0.02 |
| Bug fix | Economy | $0.02 - $0.05 |
| New feature | Autopilot | $0.10 - $0.50 |
| Full project | Autopilot | $1.00 - $5.00 |
| Code review | Autopilot | $0.05 - $0.20 |
| Tests | Autopilot | $0.05 - $0.15 |

### Can I set a budget?

Yes, through configuration:
```json
{
  "execution": {
    "eco": {
      "maxCostThreshold": 0.10
    }
  }
}
```

Or per command:
```bash
omc eco "Task" --max-cost 0.05
```

## Comparison Questions

### Oh My Copilot vs ChatGPT?

| Feature | Oh My Copilot | ChatGPT |
|---------|---------------|---------|
| Multi-agent | ✅ Yes | ❌ No |
| CLI/Automation | ✅ Yes | ❌ Limited |
| Cost Tracking | ✅ Yes | ❌ No |
| Templates | ✅ Yes | ❌ No |
| IDE Integration | ✅ Yes | ❌ No |
| Workflow Engine | ✅ Yes | ❌ No |

### Oh My Copilot vs Cursor?

**Cursor**: IDE with AI code assistance
**Oh My Copilot**: Multi-agent orchestration system

They serve different purposes and can be used together!

### Oh My Copilot vs Aider?

**Aider**: AI pair programmer for terminal
**Oh My Copilot**: Multi-agent system with specialized agents

Both are great! Oh My Copilot offers:
- Multiple agents with different roles
- Execution modes (autopilot, swarm, etc.)
- Templates and plugins
- Web dashboard

## Troubleshooting

### It's not working! What do I do?

1. Check [Troubleshooting Guide](Troubleshooting)
2. Enable debug logs: `omc --log-level debug`
3. Verify API key: `omc config --test-key`
4. Check Node version: `node --version` (need >= 18)
5. Search [GitHub Issues](https://github.com/odpilot/oh-my-copilot/issues)

### Where can I get help?

- **Documentation**: This wiki
- **GitHub Discussions**: https://github.com/odpilot/oh-my-copilot/discussions
- **GitHub Issues**: https://github.com/odpilot/oh-my-copilot/issues
- **Troubleshooting**: [Troubleshooting Guide](Troubleshooting)

## Contributing

### Can I contribute?

Yes! We welcome contributions:
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit PRs

See [Contributing Guide](Contributing) for details.

### How can I add a new agent?

See [Custom Agents](Custom-Agents) guide. Basic steps:
1. Create agent class extending `BaseAgent`
2. Define system prompt
3. Export from your code
4. Use in your workflows

### Can I add new templates?

Yes! Templates are JSON files. See [Templates Guide](Templates).

## Advanced Usage

### Can I use it programmatically?

Yes! Full API available:

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot({ trackCosts: true });
const result = await omc.autopilot('Build a calculator');
console.log(omc.getCostReport());
```

See [API Reference](API-Reference) for details.

### Can I extend it with plugins?

Yes! See [Plugin System](Plugins):

```typescript
import { PluginManager } from 'oh-my-copilot';

const manager = new PluginManager(omc);
await manager.loadPluginFromFile('./my-plugin.js');
```

### Can I customize models per agent?

Yes! In `omc.config.json`:

```json
{
  "agents": {
    "architect": { "model": "gpt-4o", "temperature": 0.3 },
    "executor": { "model": "claude-3-5-sonnet-20241022" },
    "qa-tester": { "model": "gemini-2.0-flash" }
  }
}
```

## Roadmap

### What's coming next?

Check the [GitHub Roadmap](https://github.com/odpilot/oh-my-copilot/issues) for:
- Additional agents
- More templates
- Enhanced plugins
- Improved web UI
- Additional providers
- Performance optimizations

### Can I request features?

Yes! Create an issue:
https://github.com/odpilot/oh-my-copilot/issues/new

## Still Have Questions?

- 📖 [Read the full documentation](Home)
- 💬 [Ask in GitHub Discussions](https://github.com/odpilot/oh-my-copilot/discussions)
- 🐛 [Report issues](https://github.com/odpilot/oh-my-copilot/issues)
