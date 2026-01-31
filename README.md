# oh-my-copilot

🚀 A powerful multi-agent system with BYOK (Bring Your Own Key) support for multiple AI providers.

> **New in v0.1**: Now supports OpenAI, Anthropic, Google Gemini, Azure OpenAI, Ollama, and GitHub Copilot SDK! Use your preferred AI provider with your own API keys. Mock SDK available for development and testing.

## ✨ Features

### MVP Features
- 🎯 **Specialized Agents**: Architect, Executor, QA Tester, Security Reviewer, Designer
- 🔍 **Keyword Detection**: Automatic mode detection from natural language
- ⚙️ **Pipeline Mode**: Automated workflow (Planning → Execution → Testing → Security)
- 🔑 **BYOK Support**: Bring Your Own Key for 6 AI providers (OpenAI, Anthropic, Google, Azure, Ollama, Copilot)

### Advanced Features
- 💾 **SQLite Task Pool**: Atomic task claiming and state management
- 🐝 **Swarm Mode**: Dynamic agent task claiming with parallel execution
- 💰 **Cost Tracking**: Real-time token usage and cost analysis with multi-provider support
- 📊 **Analytics Dashboard**: Comprehensive metrics and performance tracking

### Full Features
- 🖥️ **CLI Interface**: Rich interactive command-line tool with configuration wizard
- 🌐 **Web UI**: Real-time monitoring dashboard (coming soon)
- 📝 **Custom Templates**: Extensible agent template system
- ⚡ **Multiple Modes**: Autopilot, Ultrawork, Swarm, and Ecomode

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
# Install globally
npm install -g oh-my-copilot

# Configure API keys and models
omc config

# Autopilot mode
omc autopilot "Build a REST API with Express"

# Interactive chat
omc chat

# Parallel execution
omc ultrawork "Task 1" "Task 2" "Task 3"

# Economy mode
omc eco "Simple task"

# Swarm mode
omc swarm --agents 5 --tasks-file tasks.json
```

---

## 🎯 Execution Modes

### 1. Autopilot Mode (Pipeline)

Full automated pipeline with multiple specialized agents.

**Workflow**: Planning → Implementation → Testing → Security Review

```typescript
const result = await omc.autopilot(
  'Build a user authentication system',
  { framework: 'Express', database: 'PostgreSQL' }
);
```

**CLI**:
```bash
omc autopilot "Build a user authentication system"
omc ap "Build a user authentication system" --skip-security
```

**Agents involved**:
1. **Architect** (GPT-4o): Creates detailed implementation plan
2. **Executor** (GPT-4o-mini): Implements the code
3. **QA Tester** (GPT-4o-mini): Writes comprehensive tests
4. **Security Reviewer** (GPT-4o): Reviews for vulnerabilities

---

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

---

### 3. Swarm Mode

Agents dynamically claim and process tasks from a shared pool.

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
omc swarm --agents 3 --tasks-file tasks.json --poll-interval 500
```

---

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

#### Architect Agent (GPT-4o)
- Analyzes problems and creates implementation plans
- Designs system architecture
- Breaks down complex tasks
- Defines interfaces and contracts

#### Executor Agent (GPT-4o-mini)
- Implements code based on specifications
- Writes clean, testable code
- Handles edge cases
- Creates and updates files

#### QA Tester Agent (GPT-4o-mini)
- Writes comprehensive tests
- Validates implementations
- Identifies edge cases
- Ensures code coverage

#### Security Agent (GPT-4o)
- Reviews for vulnerabilities
- Identifies attack vectors
- Validates authentication/authorization
- Checks for security anti-patterns

#### Designer Agent (GPT-4o)
- Designs UI/UX
- Creates responsive layouts
- Defines color schemes
- Ensures accessibility

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

Track API usage and costs in real-time:

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

## 📊 Analytics & Metrics

```typescript
// Get metrics
const metrics = omc.getMetricsReport();

// Get full dashboard
const dashboard = omc.getDashboard();
console.log(dashboard.getReport());

// Export cost data
const costTracker = omc.getCostReport();
```

---

## ⚙️ Configuration

### BYOK (Bring Your Own Key)

Oh My Copilot supports multiple AI providers, allowing you to use your preferred API keys:

#### Supported Providers

| Provider | Environment Variable | Models |
|----------|---------------------|--------|
| **OpenAI** | `OPENAI_API_KEY` | GPT-4o, GPT-4o-mini, o1, o1-mini |
| **Anthropic** | `ANTHROPIC_API_KEY` | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku |
| **Google Gemini** | `GOOGLE_API_KEY` | Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash |
| **Azure OpenAI** | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT` | GPT-4o (Azure deployments) |
| **Ollama** | `OLLAMA_BASE_URL` | Llama 3, Mistral, and other local models |
| **GitHub Copilot** | `GITHUB_COPILOT_API_KEY` | Copilot SDK models |

#### Quick Setup

1. **Create a `.env` file** in your project root:

```env
# Choose your preferred provider
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
# or
GOOGLE_API_KEY=AIza-...

# Set defaults
DEFAULT_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini
```

2. **Or use the interactive configuration:**

```bash
omc config
```

This launches an interactive wizard to:
- View available API keys
- Select default provider and model
- Configure agent-specific models
- Manage your configuration

#### Advanced Configuration

Create an `omc.config.json` file for fine-grained control:

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
      "premium": "gpt-4o"
    },
    "disabled": ["o1-mini"]
  }
}
```

#### Cost Optimization

Different models have different pricing tiers:

- **Fast**: Optimized for speed and cost (e.g., GPT-4o-mini, Claude 3 Haiku, Gemini 2.0 Flash)
- **Standard**: Balanced performance (e.g., o1-mini)
- **Premium**: Maximum capability (e.g., GPT-4o, Claude 3.5 Sonnet, o1)

Use the config command to view pricing information:

```bash
omc config
# Select "View Current Config" to see all models and pricing
```

#### Development Mode

For development without API keys, enable mock SDK mode:

```env
USE_MOCK_SDK=true
```

This uses a built-in mock implementation for testing and development.

### Environment Variables

Create a `.env` file:

```env
# API Configuration
GITHUB_TOKEN=your_token
COPILOT_API_KEY=your_key

# Database
DB_PATH=./data/tasks.db

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/omc.log

# Cost Tracking
TRACK_COSTS=true

# Model Configuration
DEFAULT_ARCHITECT_MODEL=gpt-4o
DEFAULT_EXECUTOR_MODEL=gpt-4o-mini
DEFAULT_QA_MODEL=gpt-4o-mini
DEFAULT_SECURITY_MODEL=gpt-4o
DEFAULT_DESIGNER_MODEL=gpt-4o
```

### Programmatic Configuration

```typescript
const omc = new OhMyCopilot({
  dbPath: './my-tasks.db',
  architectModel: 'gpt-4o',
  executorModel: 'gpt-4o-mini',
  trackCosts: true,
  logLevel: 'debug'
});
```

---

## 📚 API Reference

### OhMyCopilot Class

#### Constructor
```typescript
new OhMyCopilot(config?: OhMyCopilotConfig)
```

#### Methods

- `run(input: string, context?: object): Promise<any>` - Auto-detect and execute
- `autopilot(task: string, context?, config?): Promise<PipelineResult>` - Run pipeline
- `ultra(tasks: UltraworkTask[], limit?): Promise<UltraworkResult>` - Parallel execution
- `eco(task: string, context?, config?): Promise<EcomodeResult>` - Economy mode
- `getSwarm(): Swarm` - Get swarm orchestrator
- `getTaskPool(): TaskPool` - Get task pool
- `getCostReport(): string` - Get cost tracking report
- `getMetricsReport(): string` - Get metrics report
- `getDashboard(): Dashboard` - Get analytics dashboard
- `cleanup(): void` - Clean up resources

---

## 🧪 Examples

See the [`examples/`](./examples) directory for complete examples:

- [`basic-usage.ts`](./examples/basic-usage.ts) - Simple usage
- [`autopilot-example.ts`](./examples/autopilot-example.ts) - Full pipeline
- [`ultrawork-example.ts`](./examples/ultrawork-example.ts) - Parallel tasks
- [`swarm-example.ts`](./examples/swarm-example.ts) - Swarm mode
- [`custom-agent.ts`](./examples/custom-agent.ts) - Custom agents

---

## 🧩 Project Structure

```
oh-my-copilot/
├── src/
│   ├── agents/              # Agent implementations
│   ├── orchestrator/        # Execution modes
│   ├── tasks/               # Task management
│   ├── keywords/            # Keyword detection
│   ├── analytics/           # Cost tracking & metrics
│   ├── cli/                 # CLI interface
│   ├── config/              # Configuration
│   ├── utils/               # Utilities
│   ├── sdk/                 # Mock SDK
│   ├── oh-my-copilot.ts     # Main class
│   └── index.ts             # Exports
├── examples/                # Usage examples
├── docs/                    # Documentation
└── tests/                   # Test suite
```

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

# Type checking
npm run typecheck
```

---

## 📖 Documentation

- [Getting Started](./docs/getting-started.md)
- [Agents Guide](./docs/agents.md)
- [Execution Modes](./docs/modes.md)
- [API Reference](./docs/api.md)

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
- Powered by OpenAI models

---

## 📞 Support

- 📧 Email: support@oh-my-copilot.dev
- 🐛 Issues: [GitHub Issues](https://github.com/odpilot/oh-my-copilot/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/odpilot/oh-my-copilot/discussions)

---

Made with ❤️ by the Oh My Copilot Team