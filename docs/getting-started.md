# Getting Started with Oh My Copilot

Welcome! Oh My Copilot is a powerful multi-agent orchestration system that helps you automate complex development tasks using AI. This guide will walk you through everything you need to get started.

## What is Oh My Copilot?

Oh My Copilot orchestrates multiple specialized AI agents that work together to complete complex development tasks. Think of it as having a team of AI assistants - an architect for planning, an executor for coding, a QA tester for validation, and a security expert for reviews.

**Key Features:**
- 🤖 **5 Specialized Agents** working together
- ⚡ **4 Execution Modes** for different workflows
- 🔑 **BYOK Support** - use your own API keys from 6+ providers
- 💰 **Built-in Cost Tracking** across all operations
- 🌐 **Web Dashboard** for real-time monitoring
- 🎯 **Smart Task Management** with SQLite

---

## Installation

### Quick Install (Recommended)

Install globally to use the CLI anywhere:

```bash
npm install -g oh-my-copilot
```

### As a Project Dependency

For programmatic use in your projects:

```bash
npm install oh-my-copilot
```

### From Source (For Contributors)

```bash
git clone https://github.com/odpilot/oh-my-copilot.git
cd oh-my-copilot
npm install
npm run build
```

**Requirements:**
- Node.js >= 18.0.0
- npm or yarn

---

## Initial Setup

### Step 1: Configure Your API Keys (BYOK)

Oh My Copilot works with multiple AI providers. You'll need at least one API key to get started.

**Supported Providers:**
- **OpenAI** (GPT-4o, GPT-4o-mini, o1, o1-mini)
- **Anthropic** (Claude 3.5 Sonnet, Claude 3 Opus/Haiku)
- **Google** (Gemini 2.0 Flash, Gemini 1.5 Pro/Flash)
- **Azure OpenAI** (GPT-4o deployments)
- **Ollama** (Local models - Llama 3, Mistral, etc.)
- **GitHub Copilot** (Copilot SDK models)

#### Option A: Interactive Setup (Easiest)

Run the configuration wizard:

```bash
omc config
```

This will guide you through setting up your preferred provider and API keys.

#### Option B: Manual Setup

Create a `.env` file in your project root or home directory:

```env
# Choose your primary provider
OPENAI_API_KEY=sk-...
DEFAULT_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini

# Or use Anthropic
# ANTHROPIC_API_KEY=sk-ant-...
# DEFAULT_PROVIDER=anthropic
# DEFAULT_MODEL=claude-3-5-sonnet-20241022

# Or use Google
# GOOGLE_API_KEY=AIza...
# DEFAULT_PROVIDER=google
# DEFAULT_MODEL=gemini-2.0-flash-exp

# Optional: Multiple providers
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_API_KEY=AIza...

# Optional: Cost tracking
TRACK_COSTS=true

# Optional: Logging
LOG_LEVEL=info
```

**Don't have an API key?** See the [BYOK Configuration Guide](./byok.md) for detailed setup instructions for each provider.

### Step 2: Verify Installation

Test your setup:

```bash
omc --help
```

You should see the help menu with all available commands.

---

## Quick Start Examples

### Example 1: Your First Command (CLI)

Try the simplest possible command:

```bash
omc autopilot "Create a hello world function in JavaScript"
```

This runs the **Autopilot mode**, which orchestrates multiple agents to plan, implement, test, and review your task.

### Example 2: Interactive Chat

For a conversational experience:

```bash
omc chat
```

Type your requests naturally, like:
- "Create a REST API with Express"
- "Add unit tests to my code"
- "Review this file for security issues"

Type `exit` or press Ctrl+C to quit.

### Example 3: Programmatic Usage

Create a file `test.js`:

```javascript
import { OhMyCopilot } from 'oh-my-copilot';

async function main() {
  const omc = new OhMyCopilot({
    trackCosts: true,
    logLevel: 'info'
  });

  // Run a simple task
  const result = await omc.run('Create a calculator function');
  
  console.log('Result:', result.summary);
  console.log('Cost:', omc.getCostReport());
  
  // Clean up
  omc.cleanup();
}

main().catch(console.error);
```

Run it:

```bash
node test.js
```

---

## Understanding the 4 Execution Modes

Oh My Copilot offers different execution modes for different scenarios:

### 1. **Autopilot Mode** (Full Pipeline)

**Best for:** Complete feature implementations with quality assurance

**What it does:** Runs a full pipeline: Architect → Executor → QA Tester → Security Reviewer

**CLI:**
```bash
omc autopilot "Build a user authentication system"
omc ap "Create a REST API with Express"  # 'ap' is shorthand
```

**Code:**
```typescript
const result = await omc.autopilot('Build a login feature', {
  framework: 'Express',
  database: 'PostgreSQL'
});
```

### 2. **Ultrawork Mode** (Parallel Execution)

**Best for:** Running multiple independent tasks simultaneously

**What it does:** Executes tasks in parallel for maximum speed

**CLI:**
```bash
omc ultrawork "Task 1" "Task 2" "Task 3"
omc ulw "Add logging" "Add tests" "Fix bugs"  # 'ulw' is shorthand
```

**Code:**
```typescript
import { ExecutorAgent, QATesterAgent } from 'oh-my-copilot';

const tasks = [
  { title: 'User API', description: 'Build user endpoints', agent: new ExecutorAgent() },
  { title: 'Product API', description: 'Build product endpoints', agent: new ExecutorAgent() },
  { title: 'Write Tests', description: 'Add API tests', agent: new QATesterAgent() }
];

const result = await omc.ultra(tasks, 3); // Max 3 concurrent
```

### 3. **Swarm Mode** (Dynamic Task Pool)

**Best for:** Flexible workloads where agents dynamically claim tasks

**What it does:** Agents autonomously claim and process tasks from a shared pool

**CLI:**
```bash
omc swarm --agents 5 "Task 1" "Task 2" "Task 3"
omc swarm --agents 3 --tasks-file tasks.json
```

**Code:**
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
  priority: 'high'
});

// Start swarm
await swarm.start({ stopWhenEmpty: true });
```

### 4. **Ecomode** (Cost-Optimized)

**Best for:** Simple tasks where you want to minimize costs

**What it does:** Uses efficient models and optimized execution paths

**CLI:**
```bash
omc eco "Add comments to code"
```

**Code:**
```typescript
const result = await omc.eco('Simple refactoring task', {
  maxCostThreshold: 0.10  // Stop if cost exceeds $0.10
});

console.log(`Savings: $${result.costSavings.toFixed(4)}`);
```

**Quick comparison:**

| Mode | Speed | Cost | Best For |
|------|-------|------|----------|
| **Autopilot** | Medium | High | Complete features with QA |
| **Ultrawork** | Fast | Medium | Multiple independent tasks |
| **Swarm** | Variable | Variable | Dynamic/flexible workloads |
| **Ecomode** | Slow | Low | Simple, cost-sensitive tasks |

---

## Understanding Agents

Each agent is specialized for specific tasks:

| Agent | Primary Role | Model | When to Use |
|-------|-------------|-------|-------------|
| **Architect** | Planning & Design | GPT-4o | System architecture, task breakdown |
| **Executor** | Implementation | GPT-4o-mini | Writing code, file operations |
| **QA Tester** | Testing | GPT-4o-mini | Writing tests, validation |
| **Security** | Security Review | GPT-4o | Finding vulnerabilities, security analysis |
| **Designer** | UI/UX | GPT-4o | Interface design, accessibility |

**Note:** You can customize which models each agent uses. See [BYOK Configuration](./byok.md) for details.

---

## Using the Web UI

Oh My Copilot includes a beautiful web dashboard for monitoring and managing tasks.

### Launching the Dashboard

```bash
omc web            # Starts on http://localhost:3000
omc web --port 8080  # Custom port
```

### Features

- 📊 **Real-time Dashboard** - Live metrics and statistics
- 📋 **Task Management** - Create, view, filter, and manage tasks
- 🤖 **Agent Monitoring** - See which agents are active and their performance
- 💰 **Cost Analytics** - Track spending across all operations
- 🔄 **Live Updates** - WebSocket-powered real-time updates

### Quick Tour

1. **Dashboard** - Overview of system status, total tasks, active agents, costs, and success rate
2. **Tasks** - Full task lifecycle management with filtering and status updates
3. **Agents** - Monitor agent status and assign tasks
4. **Analytics** - Cost breakdowns and performance metrics

See the [Web UI Guide](./web-ui.md) for complete documentation.

---

## Common Use Cases & Patterns

### Use Case 1: Build a Complete Feature

```bash
omc autopilot "Build a REST API with user authentication, including tests and security review"
```

This runs the full pipeline with all quality checks.

### Use Case 2: Quick Code Generation

```typescript
const omc = new OhMyCopilot();
const result = await omc.run('Create a utility function to validate emails');
console.log(result.summary);
omc.cleanup();
```

### Use Case 3: Parallel Task Execution

```bash
omc ultrawork \
  "Add logging to the API" \
  "Write integration tests" \
  "Update documentation"
```

All three tasks run simultaneously.

### Use Case 4: Cost-Conscious Development

```typescript
const omc = new OhMyCopilot({ trackCosts: true });

// Use economy mode for simple tasks
const result = await omc.eco('Refactor this function for readability');

// Check costs
console.log(omc.getCostReport());
```

### Use Case 5: Monitor Everything

```bash
# Terminal 1: Start web dashboard
omc web

# Terminal 2: Run your tasks
omc autopilot "Build feature X"

# View progress in browser at http://localhost:3000
```

---

## Configuration Options

### Programmatic Configuration

```typescript
import { OhMyCopilot } from 'oh-my-copilot';

const omc = new OhMyCopilot({
  // Cost tracking
  trackCosts: true,
  
  // Logging
  logLevel: 'info',  // 'debug' | 'info' | 'warn' | 'error'
  
  // Database
  dbPath: './tasks.db',  // Use ':memory:' for in-memory DB
  
  // Default provider
  defaultProvider: 'openai',
  defaultModel: 'gpt-4o-mini'
});
```

### File-Based Configuration

Create `omc.config.json` in your project root:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o-mini",
  "trackCosts": true,
  "logLevel": "info",
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

See [BYOK Configuration](./byok.md) for comprehensive provider setup.

---

## Cost Tracking

Track your API usage and costs in real-time:

```typescript
const omc = new OhMyCopilot({ trackCosts: true });

await omc.autopilot('Build a feature');

// Get detailed report
console.log(omc.getCostReport());
```

**Sample Output:**
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

**Tips for cost optimization:**
- Use **Ecomode** for simple tasks
- Prefer **GPT-4o-mini** or **Claude 3 Haiku** for routine work
- Use **Gemini 2.0 Flash** (has free tier)
- Monitor costs with the Web UI dashboard

See [Cost Tracking Guide](./cost-tracking.md) for advanced strategies.

---

## Troubleshooting

### Issue: "Cannot find module" or Import Errors

**Solution:** Make sure the package is built:

```bash
npm run build
```

If using from source, ensure you've installed dependencies:

```bash
npm install
```

### Issue: "API key not found" or Authentication Errors

**Solution:** Verify your `.env` file has the correct API key:

```bash
# Check if .env file exists
cat .env

# Make sure the key starts with the correct prefix:
# OpenAI: sk-...
# Anthropic: sk-ant-...
# Google: AIza...
```

Run the config wizard to set it up:

```bash
omc config
```

### Issue: "Database is locked"

**Solution:** Close any existing Oh My Copilot instances, or use an in-memory database:

```typescript
const omc = new OhMyCopilot({ dbPath: ':memory:' });
```

Or specify a unique database path:

```typescript
const omc = new OhMyCopilot({ dbPath: './my-tasks.db' });
```

### Issue: High API Costs

**Solution:** Use economy mode or set cost limits:

```typescript
// Use economy mode
const result = await omc.eco('Simple task');

// Or set a cost threshold
const result = await omc.autopilot('Task', {}, {
  maxCostThreshold: 0.10  // Stop if exceeds $0.10
});
```

Switch to cheaper models in your config:

```json
{
  "defaultModel": "gpt-4o-mini",  // Cheaper than gpt-4o
  "agents": {
    "executor": { "model": "claude-3-haiku-20240307" }
  }
}
```

### Issue: Tasks Getting Stuck or Not Completing

**Solution:** Check logs for errors:

```typescript
const omc = new OhMyCopilot({ logLevel: 'debug' });
```

Or monitor in the Web UI:

```bash
omc web
# Open http://localhost:3000 and check task status
```

### Issue: Web UI Not Accessible

**Solution:** Check if another process is using the port:

```bash
# Try a different port
omc web --port 8080

# Or check what's using port 3000
lsof -i :3000  # On macOS/Linux
netstat -ano | findstr :3000  # On Windows
```

### Issue: Slow Performance

**Solution:** 
- Use **Ultrawork mode** for parallel execution
- Reduce task complexity
- Use faster models (GPT-4o-mini, Gemini 2.0 Flash)
- Skip unnecessary steps (e.g., `--skip-security` for prototypes)

```bash
omc ultrawork "Task 1" "Task 2"  # Parallel execution
omc ap "Task" --skip-tests --skip-security  # Skip optional steps
```

### Still Having Issues?

- 📖 Check the [full documentation](./api.md)
- 🐛 [Report a bug on GitHub](https://github.com/odpilot/oh-my-copilot/issues)
- 💬 [Ask in GitHub Discussions](https://github.com/odpilot/oh-my-copilot/discussions)

---

## Next Steps

Now that you're set up, here's what to explore next:

### Learn More About Features

- **[Execution Modes Guide](./modes.md)** - Deep dive into all 4 modes
- **[BYOK Configuration](./byok.md)** - Multi-provider setup and model selection
- **[Agents Guide](./agents.md)** - Understanding and customizing agents
- **[Web UI Guide](./web-ui.md)** - Complete dashboard documentation
- **[Cost Tracking](./cost-tracking.md)** - Optimize your spending
- **[Custom Agents](./custom-agents.md)** - Build your own specialized agents

### API & Reference

- **[CLI Reference](./cli.md)** - All CLI commands and options
- **[API Documentation](./api.md)** - Programmatic API reference
- **[Task Management](./task-management.md)** - SQLite task pool details

### Examples

Check out the [`examples/`](../examples/) directory for complete working examples:

- [`basic-usage.ts`](../examples/basic-usage.ts) - Simple usage patterns
- [`autopilot-example.ts`](../examples/autopilot-example.ts) - Full pipeline example
- [`ultrawork-example.ts`](../examples/ultrawork-example.ts) - Parallel execution
- [`swarm-example.ts`](../examples/swarm-example.ts) - Swarm mode
- [`custom-agent.ts`](../examples/custom-agent.ts) - Creating custom agents

### Try These Commands

```bash
# See all available commands
omc --help

# Try different modes
omc autopilot "Create a simple web server"
omc eco "Add error handling"
omc ultrawork "Task 1" "Task 2"

# Launch the dashboard
omc web

# Interactive chat
omc chat
```

---

## Tips for Success

1. **Start Simple** - Begin with basic tasks to understand how agents work
2. **Monitor Costs** - Always enable cost tracking when experimenting
3. **Use the Right Mode** - Choose the execution mode that fits your needs
4. **Leverage the Web UI** - Visual monitoring makes debugging easier
5. **Read Agent Output** - Agents provide detailed explanations of their work
6. **Experiment with Models** - Different models excel at different tasks
7. **Check Examples** - The examples directory has practical use cases

---

## Support & Community

### Get Help

- 📧 **Email:** support@oh-my-copilot.dev
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/odpilot/oh-my-copilot/issues)
- 💬 **Questions & Discussions:** [GitHub Discussions](https://github.com/odpilot/oh-my-copilot/discussions)
- 📖 **Documentation:** [Full Docs](./api.md)

### Contributing

We welcome contributions! See our [Contributing Guide](../CONTRIBUTING.md) for details.

---

**Ready to build something amazing? Let's get started! 🚀**
