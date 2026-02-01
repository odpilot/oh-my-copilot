# oh-my-copilot

🚀 A powerful multi-agent orchestration system with BYOK support.

[![npm version](https://img.shields.io/npm/v/oh-my-copilot.svg)](https://www.npmjs.com/package/oh-my-copilot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

📚 **[Documentation Wiki](https://github.com/odpilot/oh-my-copilot/wiki)** | 🔌 **[VS Code Extension](vscode-extension/)** | 💬 **[Discussions](https://github.com/odpilot/oh-my-copilot/discussions)**

## ✨ Features

### 🤖 Agent System
- **32 Specialized Agents**: Full roster of domain-specific experts organized by complexity tier
  - **Core Agents**: Architect, Executor, QA Tester, Security, Designer, DevOps, Data Analyst, Reviewer
  - **Engineering**: Frontend, Backend, Database Expert, API Specialist, Mobile, ML Engineer
  - **Testing**: Unit Test, Integration Test, Testing Automation specialists
  - **Infrastructure**: Infrastructure Engineer, CI/CD, Monitoring, Serverless, Caching
  - **Architecture**: Microservices Architect, UX Designer, Refactoring, Code Reviewer
  - **Specialized**: GraphQL, WebSocket, Blockchain, Authentication
  - **Support**: Documentation, Accessibility, Localization, Migration, Performance, Error Handling, Configuration, Git Expert
- **Custom Agent Creation**: Build your own specialized agents
- **Context Chaining**: Agents work together seamlessly
- **Smart Model Routing**: Automatic model tier selection (LOW/MEDIUM/HIGH)
- **Automatic Delegation**: Intelligent task routing to specialized agents
- **MCP Support**: Agents can use Model Context Protocol tools

### ⚙️ Execution Modes
- **Autopilot (Pipeline)**: Planning → Implementation → Testing → Security Review
- **Ultrapilot**: Advanced orchestration with skill composition and smart routing
- **Ralph**: Guarantee completion with verification and evidence-based checks
- **Ultrawork**: Parallel task execution for maximum speed
- **Swarm**: Dynamic task claiming from SQLite pool with autonomous agents
- **Ecomode**: Cost-optimized execution with efficient models
- **Templates**: Pre-configured workflows for common tasks

### 🔌 Extensibility
- **Plugin System**: Extend functionality with custom plugins
- **Built-in Plugins**: GitHub, Jira, and Slack integrations
- **MCP Integration**: Model Context Protocol for tool usage
- **Task Templates**: 8 ready-to-use templates for common workflows
- **NPM Plugin Support**: Install plugins from npm

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
- **HUD Statusline**: Real-time progress display during execution ✨ NEW!
- **State Management**: Session history and wisdom capture ✨ NEW!
- **Agent Statistics**: Success rate and cost tracking per agent ✨ NEW!

### 🛠️ Developer Tools
- **Interactive CLI**: Rich command-line interface with multiple modes
- **Web UI Dashboard**: Modern web interface for monitoring and management
- **VS Code Extension**: Full IDE integration with commands, chat, and monitoring
- **SQLite Task Pool**: Atomic task management with state persistence
- **Keyword Detection**: Automatic mode detection from natural language
- **Template System**: Execute common workflows with pre-built templates
- **State Management**: View session history, wisdom, and agent stats ✨ NEW!
  - `omc state sessions` - View recent sessions
  - `omc state wisdom` - View captured learnings
  - `omc state stats` - View agent statistics
  - `omc state clean` - Clean old session data

---

## 💻 VS Code Extension

Install the Oh My Copilot extension for seamless IDE integration:

### Features
- 🚀 **Command Palette Integration** - Run autopilot, eco, ultrawork, and swarm from VS Code
- 💬 **Chat Sidebar** - Interactive agent chat directly in your editor
- 💰 **Cost Tracking** - Real-time cost monitoring in the sidebar
- ⚙️ **Configuration UI** - Easy API key and model setup through VS Code settings
- 📤 **Output Panel** - View results and logs without leaving the editor

### Installation

1. Download the `.vsix` file from the [vscode-extension](vscode-extension/) directory
2. Install in VS Code: Extensions → `...` → "Install from VSIX..."
3. Configure API keys in VS Code settings

Or build from source:
```bash
cd vscode-extension
npm install
npm run compile
```

See the [VS Code Extension README](vscode-extension/README.md) for detailed documentation.

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

# Templates
omc templates list
omc templates run build-rest-api --resourceName users --framework express

# Plugins
omc plugins list
omc plugins load ./my-plugin.js

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

### 2. Ultrapilot Mode

Advanced orchestration with skill composition and intelligent agent routing.

**Features**:
- Skill composition (execution + enhancement + guarantee layers)
- Smart model routing based on task complexity (LOW/MEDIUM/HIGH tiers)
- Automatic delegation to specialized agents
- Parallel execution support

```typescript
const result = await omc.ultrapilotMode(
  'Build a scalable microservices API',
  { framework: 'Express' },
  {
    skills: ['default', 'ultrawork', 'git-master'],
    smartRouting: true,
    autoDelegate: true,
    parallelExecution: true
  }
);
```

**CLI**:
```bash
omc ultrapilot "Build a microservices API" --smart-routing --auto-delegate
```

### 3. Ralph Mode

Guarantee completion mode with verification and evidence-based checks.

**Features**:
- Automatic retry on verification failure
- Evidence-based completion checks (BUILD, TEST, LINT, FUNCTIONALITY, SECURITY)
- Strict mode for comprehensive verification
- Guaranteed task completion

```typescript
const result = await omc.ralphMode(
  'Implement user authentication with tests',
  { framework: 'Express' },
  {
    maxRetries: 3,
    requiredChecks: ['BUILD', 'TEST', 'FUNCTIONALITY'],
    strictMode: true
  }
);
```

**CLI**:
```bash
omc ralph "Build feature" --strict --max-retries 3
```

### 4. Ultrawork Mode

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

### Built-in Agents (32 Total)

Oh My Copilot provides 32 specialized agents organized by domain and complexity tier:

#### Core Agents
| Agent | Model | Tier | Role |
|-------|-------|------|------|
| **Architect** | GPT-4o | HIGH | System design, architecture, task breakdown |
| **Executor** | GPT-4o-mini | MEDIUM | Code implementation, file operations |
| **QA Tester** | GPT-4o-mini | MEDIUM | Test writing, validation, coverage |
| **Security** | GPT-4o | HIGH | Vulnerability detection, security review |
| **Designer** | GPT-4o | HIGH | UI/UX design, interface design |
| **DevOps** | GPT-4o-mini | MEDIUM | Deployment, infrastructure operations |
| **Data Analyst** | GPT-4o | MEDIUM | Data analysis and insights |
| **Reviewer** | GPT-4o | MEDIUM | Code review and quality checks |

#### Engineering Specialists
- **Frontend Engineer** (HIGH): React, Vue, Angular, modern UI development
- **Backend Engineer** (HIGH): APIs, server-side logic, microservices
- **Database Expert** (HIGH): Schema design, query optimization, migrations
- **API Specialist** (MEDIUM): REST/GraphQL API design and documentation
- **Mobile Developer** (HIGH): iOS, Android, React Native development
- **ML Engineer** (HIGH): Machine learning models and AI integration

#### Testing Specialists
- **Unit Test Specialist** (MEDIUM): Comprehensive unit testing
- **Integration Test Specialist** (MEDIUM): E2E and integration testing
- **Testing Automation Specialist** (MEDIUM): Test automation frameworks

#### Infrastructure & DevOps
- **Infrastructure Engineer** (HIGH): Cloud infrastructure, IaC (Terraform, AWS)
- **CI/CD Specialist** (MEDIUM): Pipeline automation, deployment
- **Monitoring Specialist** (MEDIUM): Logging, metrics, observability
- **Serverless Specialist** (MEDIUM): Lambda, serverless architectures
- **Caching Specialist** (MEDIUM): Redis, Memcached, CDN strategies

#### Architecture & Design
- **Microservices Architect** (HIGH): Distributed systems, service mesh
- **UX Designer** (HIGH): User experience, accessibility, responsive design
- **Refactoring Specialist** (HIGH): Code quality, design patterns
- **Code Reviewer** (HIGH): Thorough code review, best practices

#### Specialized Domains
- **GraphQL Specialist** (MEDIUM): GraphQL schema and resolver design
- **WebSocket Specialist** (MEDIUM): Real-time communication
- **Blockchain Developer** (HIGH): Smart contracts, Web3, DApps
- **Authentication Specialist** (HIGH): OAuth, JWT, SSO, MFA

#### Support & Quality
- **Documentation Specialist** (MEDIUM): API docs, README, technical writing
- **Accessibility Specialist** (MEDIUM): WCAG compliance, inclusive design
- **Localization Expert** (MEDIUM): i18n, multi-language support
- **Migration Specialist** (HIGH): Framework upgrades, code migrations
- **Performance Optimizer** (HIGH): Performance tuning, bottleneck analysis
- **Error Handling Specialist** (MEDIUM): Robust error handling, resilience
- **Configuration Specialist** (MEDIUM): Environment config, feature flags
- **Git Expert** (MEDIUM): Git workflows, branching strategies

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

## 🔍 Keyword Detection & Magic Words

Oh My Copilot automatically detects execution mode from natural language using "magic words":

| Keywords | Mode | Description |
|----------|------|-------------|
| `ralph`, `guarantee`, `verify` | Ralph | Guarantee completion with verification |
| `ultrapilot`, `smart routing`, `auto delegate` | Ultrapilot | Advanced orchestration |
| `autopilot`, `build me` | Autopilot | Full automated pipeline |
| `ultrawork`, `ulw`, `parallel` | Ultrawork | Parallel task execution |
| `swarm` | Swarm | Distributed task claiming |
| `eco`, `budget` | Ecomode | Cost-optimized execution |

```typescript
// These all trigger their respective modes:
omc.run('autopilot: create an API')
omc.run('build me a REST service')

omc.run('ultrapilot: build a microservices API with smart routing')
omc.run('auto delegate this complex task')

omc.run('ralph: implement authentication with full verification')
omc.run('guarantee this feature is complete')

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

### 📚 Wiki (Recommended)

Visit our comprehensive [**GitHub Wiki**](https://github.com/odpilot/oh-my-copilot/wiki) for:

- 🚀 [Quick Start Guide](https://github.com/odpilot/oh-my-copilot/wiki/Quick-Start) - Get started in 5 minutes
- 📦 [Installation](https://github.com/odpilot/oh-my-copilot/wiki/Installation) - Setup guide for all platforms
- ⚙️ [Configuration](https://github.com/odpilot/oh-my-copilot/wiki/Configuration) - API keys and settings
- 🎯 [Execution Modes](https://github.com/odpilot/oh-my-copilot/wiki/Execution-Modes) - Autopilot, Ultrawork, Swarm, Economy
- 🛠️ [Troubleshooting](https://github.com/odpilot/oh-my-copilot/wiki/Troubleshooting) - Common issues and solutions
- ❓ [FAQ](https://github.com/odpilot/oh-my-copilot/wiki/FAQ) - Frequently asked questions

### 📁 API Documentation

Detailed API and technical documentation is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| [Getting Started](./docs/getting-started.md) | Quick start guide and installation |
| [Agents](./docs/agents.md) | Complete agent system documentation (8 agents) |
| [Execution Modes](./docs/modes.md) | Detailed guide to all 4 execution modes |
| [BYOK Configuration](./docs/byok.md) | Multi-provider setup and configuration |
| [CLI Reference](./docs/cli.md) | Complete CLI command reference |
| [Web UI](./docs/web-ui.md) | Web dashboard usage guide |
| [Cost Tracking](./docs/cost-tracking.md) | Cost analysis and optimization |
| [Custom Agents](./docs/custom-agents.md) | Building custom specialized agents |
| [Task Management](./docs/task-management.md) | SQLite task pool and state management |
| [MCP Integration](./docs/mcp.md) | Model Context Protocol integration |
| [Task Templates](./docs/templates.md) | Task template system (8 templates) |
| [Plugin System](./docs/plugins.md) | Plugin development and usage |
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

See our [Wiki Contributing Guide](https://github.com/odpilot/oh-my-copilot/wiki/Contributing) for more details.

---

## 🔗 Resources

### Documentation
- 📚 [Wiki](https://github.com/odpilot/oh-my-copilot/wiki) - Comprehensive user guide
- 📁 [API Docs](./docs/) - Technical documentation
- 🔌 [VS Code Extension](./vscode-extension/) - IDE integration

### Community
- 💬 [GitHub Discussions](https://github.com/odpilot/oh-my-copilot/discussions) - Ask questions and share ideas
- 🐛 [Issue Tracker](https://github.com/odpilot/oh-my-copilot/issues) - Report bugs or request features
- 📖 [Examples](./examples/) - Code examples and use cases

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
