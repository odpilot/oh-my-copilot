# oh-my-copilot

🚀 A powerful multi-agent orchestration system with BYOK support.

## ✨ Features

### 🤖 Agent System
- **5 Specialized Agents**: Architect, Executor, QA Tester, Security Reviewer, Designer
- **Custom Agent Creation**: Build your own specialized agents
- **Context Chaining**: Agents work together seamlessly
- **Model Flexibility**: Choose different models for each agent

### ⚙️ Execution Modes
- **Autopilot (Pipeline)**: Planning → Implementation → Testing → Security Review
- **Ultrawork**: Parallel task execution for maximum speed
- **Swarm**: Dynamic task claiming from SQLite pool with autonomous agents
- **Ecomode**: Cost-optimized execution with efficient models

### 🔑 BYOK (Bring Your Own Key)
- **6 AI Providers**: OpenAI, Anthropic, Google Gemini, Azure OpenAI, Ollama, GitHub Copilot
- **Dynamic Model Selection**: Mix and match models from different providers
- **Model Aliases**: Use shortcuts like `fast`, `smart`, `cheap`
- **Flexible Configuration**: Per-agent model customization

### 📊 Analytics & Monitoring
- **Real-time Cost Tracking**: Track token usage and costs across all providers
- **Performance Metrics**: Monitor agent performance and success rates
- **Web Dashboard**: Beautiful UI for real-time monitoring
- **CLI Reports**: Detailed reports in the terminal

### 🛠️ Developer Tools
- **Interactive CLI**: Rich command-line interface with multiple modes
- **Web UI Dashboard**: Modern web interface for monitoring and management
- **SQLite Task Pool**: Atomic task management with state persistence
- **Keyword Detection**: Automatic mode detection from natural language

---

## 📦 Installation

```bash
npm install oh-my-copilot
```

Or for development:

```bash
git clone https://github.com/odpilot/oh-my-copilot.git
cd oh-my-copilot
npm install
npm run build
```

---

## 🚀 Quick Start

### Configure Your API Keys

First, set up your preferred AI provider:

```bash
# Interactive configuration wizard
omc config

# Or use environment variables
echo "OPENAI_API_KEY=sk-..." >> .env
echo "DEFAULT_PROVIDER=openai" >> .env
```

### Programmatic Usage

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot({
  trackCosts: true,
  logLevel: 'info'
});

// Run with automatic mode detection
const result = await omc.run('autopilot: build me a REST API');

console.log(result.summary);
console.log(omc.getCostReport());

omc.cleanup();
```

### CLI Usage

```bash
# Autopilot mode (full pipeline)
omc autopilot "Build a REST API with Express"

# Interactive chat
omc chat

# Parallel execution
omc ultrawork "Task 1" "Task 2" "Task 3"

# Economy mode
omc eco "Simple task"

# Swarm mode
omc swarm --agents 5 --tasks-file tasks.json

# Web UI
omc web
```

---

## 🎯 Execution Modes

### 1. Autopilot Mode (Pipeline)

Full automated pipeline with specialized agents working together.

**Workflow**: Architect → Executor → QA Tester → Security Reviewer

```typescript
const result = await omc.autopilot(
  'Build a user authentication system',
  { framework: 'Express', database: 'PostgreSQL' }
);
```

**CLI**:
```bash
omc autopilot "Build a user authentication system"
omc ap "Build a REST API" --skip-security
```

### 2. Ultrawork Mode

Execute multiple independent tasks in parallel for maximum speed.

```typescript
const tasks = [
  { title: 'User API', description: 'Build user endpoints', agent: new ExecutorAgent() },
  { title: 'Product API', description: 'Build product endpoints', agent: new ExecutorAgent() },
  { title: 'Tests', description: 'Write API tests', agent: new QATesterAgent() }
];

const result = await omc.ultra(tasks, 3); // Max 3 concurrent
```

**CLI**:
```bash
omc ultrawork "Task 1" "Task 2" "Task 3"
omc ulw --concurrency 2 --tasks-file tasks.json
```

### 3. Swarm Mode

Agents dynamically claim and process tasks from a shared SQLite pool.

```typescript
const swarm = omc.getSwarm();
const taskPool = omc.getTaskPool();

// Register agents
swarm.registerAgent(new ExecutorAgent());
swarm.registerAgent(new QATesterAgent());

// Add tasks
taskPool.createTask({
  title: 'Implement login',
  description: 'Build login endpoint',
  priority: TaskPriority.HIGH
});

// Start swarm
await swarm.start({ stopWhenEmpty: true });
```

**CLI**:
```bash
omc swarm --agents 5 "Task 1" "Task 2" "Task 3"
omc swarm --agents 3 --tasks-file tasks.json
```

### 4. Ecomode (Economy)

Cost-optimized execution using efficient models.

```typescript
const result = await omc.eco('Simple implementation task', {
  maxCostThreshold: 0.10 // Stop if cost exceeds $0.10
});

console.log(`Savings: $${result.costSavings.toFixed(4)}`);
```

**CLI**:
```bash
omc eco "Simple task to implement"
```

---

## 🤖 Agents

### Built-in Agents

| Agent | Model | Role | Responsibilities |
|-------|-------|------|------------------|
| **Architect** | GPT-4o | Planning | System design, architecture, task breakdown |
| **Executor** | GPT-4o-mini | Implementation | Code writing, file operations, edge cases |
| **QA Tester** | GPT-4o-mini | Testing | Test writing, validation, coverage |
| **Security** | GPT-4o | Security | Vulnerability detection, security review |
| **Designer** | GPT-4o | UI/UX | Interface design, accessibility |

### Custom Agents

Create your own specialized agents:

```typescript
import { BaseAgent } from 'oh-my-copilot';

class DatabaseExpert extends BaseAgent {
  constructor() {
    super({
      name: 'database-expert',
      model: 'gpt-4o',
      systemPrompt: 'You are a database optimization expert...',
      temperature: 0.3
    });
  }
}

const dbAgent = new DatabaseExpert();
const result = await dbAgent.execute({
  task: 'Optimize this query for performance'
});
```

---

## 🔍 Keyword Detection

Oh My Copilot automatically detects execution mode from natural language:

| Keywords | Mode | Description |
|----------|------|-------------|
| `autopilot`, `build me` | Autopilot | Full automated pipeline |
| `ultrawork`, `ulw` | Ultrawork | Parallel task execution |
| `swarm` | Swarm | Distributed task claiming |
| `eco`, `budget` | Ecomode | Cost-optimized execution |

```typescript
// These all trigger autopilot mode:
omc.run('autopilot: create an API')
omc.run('build me a REST service')

// These trigger economy mode:
omc.run('eco: simple implementation')
omc.run('budget mode: add logging')
```

---

## 💰 Cost Tracking

Track API usage and costs in real-time across all providers:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });

await omc.autopilot('Build a feature');

// Get detailed cost report
console.log(omc.getCostReport());
```

**Output**:
```
Cost Tracking Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Cost: $0.0234
Total Tokens: 12,450
Total Requests: 4

Cost by Model:
  gpt-4o: $0.0156
  gpt-4o-mini: $0.0078

Cost by Agent:
  architect: $0.0089
  executor: $0.0045
  qa-tester: $0.0056
  security-reviewer: $0.0044
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ⚙️ Configuration

### BYOK (Bring Your Own Key)

Oh My Copilot supports 6 AI providers:

| Provider | Environment Variable | Models |
|----------|---------------------|--------|
| **OpenAI** | `OPENAI_API_KEY` | GPT-4o, GPT-4o-mini, o1, o1-mini |
| **Anthropic** | `ANTHROPIC_API_KEY` | Claude 3.5 Sonnet, Claude 3 Opus/Haiku |
| **Google** | `GOOGLE_API_KEY` | Gemini 2.0 Flash, Gemini 1.5 Pro/Flash |
| **Azure** | `AZURE_OPENAI_API_KEY` | GPT-4o (Azure deployments) |
| **Ollama** | `OLLAMA_BASE_URL` | Llama 3, Mistral, local models |
| **Copilot** | `GITHUB_COPILOT_API_KEY` | Copilot SDK models |

#### Quick Setup

Create a `.env` file:

```env
# Choose your preferred provider
OPENAI_API_KEY=sk-...

# Or use multiple providers
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza-...

# Set defaults
DEFAULT_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini
```

Or use the interactive wizard:

```bash
omc config
```

#### Advanced Configuration

Create an `omc.config.json` file:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o-mini",
  "agents": {
    "architect": { "model": "gpt-4o" },
    "executor": { "model": "gpt-4o-mini" },
    "qa-tester": { "model": "claude-3-haiku-20240307" },
    "security": { "model": "gpt-4o" },
    "designer": { "model": "gpt-4o" }
  },
  "models": {
    "aliases": {
      "fast": "gpt-4o-mini",
      "smart": "gpt-4o",
      "cheap": "claude-3-haiku-20240307"
    }
  }
}
```

---

## 🌐 Web UI

Launch the web dashboard to monitor your agents and tasks:

```bash
omc web            # Default port 3000
omc web --port 8080  # Custom port
```

Features:
- 📊 Real-time dashboard with metrics
- 📋 Task management and monitoring
- 🤖 Agent status and performance
- 💰 Cost tracking and analytics
- 🔄 Live WebSocket updates

---

## 📖 Documentation

Detailed documentation is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| [Getting Started](./docs/getting-started.md) | Quick start guide and installation |
| [Agents](./docs/agents.md) | Complete agent system documentation |
| [Execution Modes](./docs/modes.md) | Detailed guide to all 4 execution modes |
| [BYOK Configuration](./docs/byok.md) | Multi-provider setup and configuration |
| [CLI Reference](./docs/cli.md) | Complete CLI command reference |
| [Web UI](./docs/web-ui.md) | Web dashboard usage guide |
| [Cost Tracking](./docs/cost-tracking.md) | Cost analysis and optimization |
| [Custom Agents](./docs/custom-agents.md) | Building custom specialized agents |
| [Task Management](./docs/task-management.md) | SQLite task pool and state management |
| [API Reference](./docs/api.md) | Programmatic API documentation |

---

## 🧪 Examples

See the [`examples/`](./examples) directory for complete examples:

### Basic Examples
- [`basic-usage.ts`](./examples/basic-usage.ts) - Simple usage patterns
- [`autopilot-example.ts`](./examples/autopilot-example.ts) - Full pipeline workflow
- [`ultrawork-example.ts`](./examples/ultrawork-example.ts) - Parallel execution
- [`swarm-example.ts`](./examples/swarm-example.ts) - Swarm mode with task pool
- [`custom-agent.ts`](./examples/custom-agent.ts) - Creating custom agents

### Advanced Examples
- [`byok-providers.ts`](./examples/byok-providers.ts) - Using multiple AI providers (OpenAI, Anthropic, Google, Ollama)
- [`cost-optimization.ts`](./examples/cost-optimization.ts) - Cost management strategies and ecomode
- [`task-management.ts`](./examples/task-management.ts) - SQLite task pool operations
- [`web-integration.ts`](./examples/web-integration.ts) - Web server and WebSocket integration
- [`error-handling.ts`](./examples/error-handling.ts) - Error handling patterns and retry strategies
- [`multi-model-workflow.ts`](./examples/multi-model-workflow.ts) - Multi-model workflow orchestration
- [`streaming-output.ts`](./examples/streaming-output.ts) - Streaming and real-time output

### Real-World Examples
- [`real-world/build-rest-api.ts`](./examples/real-world/build-rest-api.ts) - Build complete REST API with autopilot
- [`real-world/code-review.ts`](./examples/real-world/code-review.ts) - Automated code review
- [`real-world/test-generation.ts`](./examples/real-world/test-generation.ts) - Generate tests for various frameworks
- [`real-world/documentation.ts`](./examples/real-world/documentation.ts) - API docs, README, JSDoc generation
- [`real-world/refactoring.ts`](./examples/real-world/refactoring.ts) - Code refactoring and optimization

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui

# Type checking
npm run typecheck

# Start web UI
npm run web
```

### Running Tests

The project has a comprehensive test suite with 125+ tests covering:
- Agent functionality (base-agent, architect, executor, qa-tester, security, designer)
- Task pool operations (CRUD, filtering, priorities)
- Keyword detection and mode matching
- Utility functions (logger, retry, helpers)

All tests use Vitest and can be run with:
```bash
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Inspired by [oh-my-claudecode](https://github.com/example/oh-my-claudecode)
- Built for the GitHub Copilot ecosystem
- Powered by multiple AI providers

---

## 📞 Support

- 📧 Email: support@oh-my-copilot.dev
- 🐛 Issues: [GitHub Issues](https://github.com/odpilot/oh-my-copilot/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/odpilot/oh-my-copilot/discussions)

---

Made with ❤️ by the Oh My Copilot Team
