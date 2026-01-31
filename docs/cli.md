# CLI Reference

Complete command-line interface reference for Oh My Copilot.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Global Options](#global-options)
- [Commands](#commands)
  - [config](#config)
  - [autopilot (ap)](#autopilot-ap)
  - [chat](#chat)
  - [ultrawork (ulw)](#ultrawork-ulw)
  - [swarm](#swarm)
  - [eco](#eco)
  - [web](#web)
- [Usage Examples](#usage-examples)
- [Tips and Tricks](#tips-and-tricks)

---

## Overview

Oh My Copilot provides a powerful command-line interface for orchestrating multi-agent AI workflows. The CLI supports multiple execution modes, interactive configuration, and real-time monitoring.

**Binary Name**: `omc`

**Version**: 0.1.0

**Quick Help**:
```bash
omc --help
omc <command> --help
```

---

## Installation

```bash
# Install globally
npm install -g oh-my-copilot

# Or use locally
npm install oh-my-copilot
npx omc --help
```

---

## Global Options

These options work with all commands:

| Option | Description |
|--------|-------------|
| `--version` | Display version information |
| `--help` | Display help for any command |

---

## Commands

### config

Interactive configuration wizard for API keys and model selection.

**Usage**:
```bash
omc config
```

**Description**:
Configure Oh My Copilot with your API keys and preferred models. The wizard guides you through:
- Managing API keys for 6 providers (OpenAI, Anthropic, Google, Azure, Ollama, GitHub Copilot)
- Selecting default provider and model
- Configuring agent-specific models
- Viewing current configuration
- Resetting to defaults

**Interactive Menu Options**:
- 🔑 **Manage API Keys** - View available providers and configuration instructions
- 🤖 **Select Models** - Choose default provider, model, and per-agent models
- 📋 **View Current Config** - Display current configuration and available models
- 🔄 **Reset to Defaults** - Clear custom configuration

**Configuration File**:
Creates/updates `omc.config.json` in the current directory.

**Example Configuration**:
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
  }
}
```

**Examples**:
```bash
# Run interactive configuration
omc config

# Verify settings (run config again and select "View Current Config")
omc config
```

---

### autopilot (ap)

Run the full automated pipeline with planning, execution, testing, and security review.

**Usage**:
```bash
omc autopilot <task> [options]
omc ap <task> [options]
```

**Arguments**:
- `<task>` - **Required**. Description of the task to execute

**Options**:
| Option | Description |
|--------|-------------|
| `--skip-security` | Skip the security review phase |
| `--skip-tests` | Skip the testing phase |
| `-o, --output <file>` | Save results to a JSON file |

**Workflow**:
1. **Architect Agent** - Creates system design and task breakdown
2. **Executor Agent** - Implements the solution
3. **QA Tester Agent** - Writes and runs tests (unless `--skip-tests`)
4. **Security Reviewer** - Performs security analysis (unless `--skip-security`)

**Output**:
- Pipeline progress with spinner
- Summary of each agent's work
- Detailed results from all agents
- Cost tracking report
- Optional JSON output file

**Examples**:
```bash
# Run full autopilot pipeline
omc autopilot "Build a REST API with Express and PostgreSQL"

# Use alias
omc ap "Create a user authentication system"

# Skip security review
omc ap "Add logging to the application" --skip-security

# Skip tests for quick prototyping
omc ap "Create a simple calculator" --skip-tests

# Save results to file
omc ap "Build a task manager" -o results.json

# Skip both security and tests
omc ap "Quick prototype for demo" --skip-security --skip-tests
```

**Exit Codes**:
- `0` - Success
- `1` - Error occurred

---

### chat

Interactive chat mode with automatic execution mode detection.

**Usage**:
```bash
omc chat
```

**Description**:
Starts an interactive chat session where you can enter tasks and commands. The system automatically detects the best execution mode based on keywords in your input.

**Chat Commands**:
| Command | Description |
|---------|-------------|
| `/help` | Show help message with available commands |
| `/exit` or `/quit` | Exit chat mode |
| `/cost` | Display cost tracking report |
| `/metrics` | Show performance metrics report |
| `/dashboard` | Display full dashboard with all statistics |

**Automatic Mode Detection Keywords**:
- `autopilot`, `build me` → Triggers full pipeline mode
- `ultrawork`, `ulw` → Triggers parallel execution mode
- `eco`, `budget` → Triggers economy mode
- `swarm` → Triggers swarm mode

**Features**:
- Natural language task input
- Real-time mode detection
- Persistent session with cost tracking
- Interactive command system

**Examples**:
```bash
# Start chat mode
omc chat

# Example chat session:
You: autopilot: build me a REST API
# → Runs autopilot mode

You: /cost
# → Shows cost report

You: eco: add simple logging
# → Runs in economy mode

You: /exit
# → Exits chat
```

**Tips**:
- Type naturally - the system detects execution modes from keywords
- Use `/cost` frequently to monitor spending
- Commands start with `/` prefix
- Press Ctrl+C or type `/exit` to quit

---

### ultrawork (ulw)

Execute multiple tasks in parallel for maximum speed.

**Usage**:
```bash
omc ultrawork [tasks...] [options]
omc ulw [tasks...] [options]
```

**Arguments**:
- `[tasks...]` - List of tasks to execute (optional if using `--tasks-file`)

**Options**:
| Option | Description |
|--------|-------------|
| `-c, --concurrency <number>` | Maximum number of concurrent tasks (default: unlimited) |
| `--tasks-file <file>` | Load tasks from a JSON file |

**Tasks File Format**:
```json
[
  {
    "title": "User API",
    "description": "Build user endpoints",
    "context": { "framework": "Express" }
  },
  {
    "title": "Product API",
    "description": "Build product endpoints"
  }
]
```

**Behavior**:
- All tasks execute in parallel by default
- Use `--concurrency` to limit parallel execution
- All tasks use the Executor Agent
- Tasks are independent and don't share context

**Examples**:
```bash
# Run multiple tasks in parallel
omc ultrawork "Create user model" "Create product model" "Setup database"

# Use alias
omc ulw "Task 1" "Task 2" "Task 3"

# Limit to 2 concurrent tasks
omc ultrawork "Task A" "Task B" "Task C" --concurrency 2

# Load tasks from file
omc ulw --tasks-file tasks.json

# Load from file with concurrency limit
omc ulw --tasks-file tasks.json -c 3

# Mix both (tasks from file only)
omc ulw --tasks-file tasks.json
```

**Performance**:
- Ideal for independent tasks
- Reduces total execution time
- Monitor with cost reports

**Exit Codes**:
- `0` - All tasks succeeded
- `1` - One or more tasks failed or error occurred

---

### swarm

Start swarm mode with dynamic task claiming from a shared pool.

**Usage**:
```bash
omc swarm [tasks...] [options]
```

**Arguments**:
- `[tasks...]` - Initial tasks to add to the pool (optional if using `--tasks-file`)

**Options**:
| Option | Description |
|--------|-------------|
| `-a, --agents <number>` | Number of agents to spawn (default: 3) |
| `--tasks-file <file>` | Load tasks from a JSON file |
| `--poll-interval <ms>` | Task polling interval in milliseconds (default: 1000) |

**Tasks File Format**:
```json
[
  {
    "description": "Implement user authentication",
    "priority": "high"
  },
  {
    "description": "Write API tests"
  }
]
```

**Behavior**:
- Spawns multiple agents that work autonomously
- Agents claim tasks from a shared SQLite pool
- Tasks are atomically claimed (no duplicates)
- Alternates between Executor and QA Tester agents
- Automatically stops when all tasks are complete

**Real-time Monitoring**:
- Active agents count
- Task completion progress
- Failed task count
- Live status updates

**Examples**:
```bash
# Start swarm with 3 agents (default)
omc swarm "Task 1" "Task 2" "Task 3"

# Spawn 5 agents
omc swarm --agents 5 "Implement auth" "Write tests" "Add logging"

# Load tasks from file with 3 agents
omc swarm --tasks-file tasks.json --agents 3

# Adjust polling interval for faster task claiming
omc swarm --agents 5 --tasks-file tasks.json --poll-interval 500

# Just tasks from file
omc swarm --tasks-file tasks.json
```

**Use Cases**:
- Large task lists
- Variable task complexity
- Load balancing across agents
- Continuous processing

**Output**:
- Real-time progress monitoring
- Final statistics (total, completed, failed, pending)
- Cost tracking report

---

### eco

Run tasks in economy mode with cost optimization.

**Usage**:
```bash
omc eco <task> [options]
```

**Arguments**:
- `<task>` - **Required**. Description of the task to execute

**Options**:
| Option | Description |
|--------|-------------|
| `-o, --output <file>` | Save results and cost report to a JSON file |

**Description**:
Economy mode optimizes for cost by using efficient models and minimal API calls. Best for simple tasks and budget-conscious execution.

**Features**:
- Uses cost-optimized models
- Minimal API overhead
- Cost tracking included
- Shows cost savings vs. standard mode

**Examples**:
```bash
# Run simple task in economy mode
omc eco "Add console logging to the app"

# Economy mode for simple implementations
omc eco "Create a basic calculator function"

# Save results with cost report
omc eco "Implement simple validation" -o results.json

# Budget-conscious refactoring
omc eco "Rename variables for clarity"
```

**Best For**:
- Simple implementation tasks
- Refactoring and cleanup
- Documentation updates
- Quick fixes
- Budget-limited projects

**Cost Savings**:
Output includes comparison showing savings vs. standard autopilot mode.

---

### web

Start the web UI dashboard for monitoring and management.

**Usage**:
```bash
omc web [options]
```

**Options**:
| Option | Description |
|--------|-------------|
| `-p, --port <number>` | Port number for the web server (default: 3000) |

**Features**:
- 📊 Real-time dashboard with metrics
- 📋 Task management and monitoring
- 🤖 Agent status and performance
- 💰 Cost tracking and analytics
- 🔄 Live WebSocket updates

**Examples**:
```bash
# Start on default port 3000
omc web

# Start on custom port
omc web --port 8080

# Access in browser
# http://localhost:3000
```

**Dashboard Sections**:
- **Overview** - System status and quick stats
- **Tasks** - Task pool status and history
- **Agents** - Active agents and performance
- **Costs** - Real-time cost tracking
- **Metrics** - Performance analytics

**Use Cases**:
- Long-running swarm operations
- Multi-task monitoring
- Cost analysis
- Performance tracking
- Team collaboration

---

## Usage Examples

### Getting Started

```bash
# 1. Configure your API keys
omc config

# 2. Run your first task
omc autopilot "Create a simple Express server"

# 3. Try interactive chat
omc chat
```

### Development Workflow

```bash
# Plan and implement a feature
omc ap "Add user authentication with JWT"

# Run parallel tasks for speed
omc ulw "Write unit tests" "Update docs" "Add logging"

# Quick fixes in economy mode
omc eco "Fix typo in README"
```

### Large Projects

```bash
# Create a task list
cat > tasks.json << EOF
[
  {"description": "Create user model", "priority": "high"},
  {"description": "Create product model", "priority": "high"},
  {"description": "Setup database migrations"},
  {"description": "Write API tests"},
  {"description": "Add API documentation"}
]
EOF

# Run with swarm mode
omc swarm --agents 5 --tasks-file tasks.json

# Monitor via web UI
omc web --port 8080
```

### Cost Optimization

```bash
# Use economy mode for simple tasks
omc eco "Update package.json dependencies"

# Skip unnecessary phases
omc ap "Quick prototype" --skip-security --skip-tests

# Monitor costs in real-time
omc chat
# Then use: /cost command
```

### Continuous Workflows

```bash
# Start a persistent chat session
omc chat

# In chat:
You: build me a REST API for users
# → Runs autopilot

You: /cost
# → Check cost

You: eco: add input validation
# → Runs economy mode

You: /dashboard
# → View full stats

You: /exit
```

---

## Tips and Tricks

### Configuration

**Use Environment Variables**:
```bash
# Quick setup without interactive config
export OPENAI_API_KEY="sk-..."
export DEFAULT_PROVIDER="openai"
export DEFAULT_MODEL="gpt-4o-mini"

omc autopilot "Build something"
```

**Per-Project Configuration**:
```bash
# Create project-specific config
cd my-project
omc config
# Creates omc.config.json in current directory
```

**Mix Multiple Providers**:
```json
{
  "defaultProvider": "openai",
  "agents": {
    "architect": { "model": "gpt-4o" },
    "executor": { "model": "claude-3-haiku-20240307" }
  }
}
```

### Execution Modes

**Choose the Right Mode**:
- **Autopilot** - Full-featured pipeline with all phases
- **Ultrawork** - Independent parallel tasks
- **Swarm** - Large task pools with autonomous agents
- **Economy** - Simple tasks with cost optimization

**Skip Phases Strategically**:
```bash
# Prototyping - skip tests and security
omc ap "POC for feature" --skip-tests --skip-security

# Documentation - skip security
omc ap "Update docs" --skip-security

# Production - run everything
omc ap "Production feature"
```

### Performance

**Optimize Concurrency**:
```bash
# Too many parallel tasks may hit rate limits
omc ulw --concurrency 3 --tasks-file tasks.json

# Swarm mode handles this automatically
omc swarm --agents 5 --tasks-file tasks.json
```

**Use Task Files for Repeatability**:
```bash
# Save tasks in version control
git add tasks.json

# Run same tasks consistently
omc ulw --tasks-file tasks.json
```

### Cost Management

**Track Costs Continuously**:
```bash
# In chat mode
omc chat
You: /cost  # Check after each task
```

**Use Economy Mode**:
```bash
# For simple tasks, economy mode can save 70-90%
omc eco "Simple refactoring task"
```

**Save Results for Analysis**:
```bash
# Save with cost data
omc ap "Feature X" -o results.json

# Analyze later
cat results.json | jq '.costReport'
```

### Monitoring

**Web Dashboard for Long Operations**:
```bash
# Terminal 1: Start web UI
omc web

# Terminal 2: Run swarm
omc swarm --agents 10 --tasks-file large-tasks.json

# Browser: Monitor at http://localhost:3000
```

**Real-time Progress**:
```bash
# Swarm shows live updates
omc swarm --agents 5 "Task 1" "Task 2" "Task 3"
# Active: 3/5 | Completed: 0/3 | Failed: 0
```

### Advanced Usage

**Chain Commands**:
```bash
# Configure then run
omc config && omc autopilot "Build API"
```

**Automate with Scripts**:
```bash
#!/bin/bash
# build-features.sh

omc ulw \
  "Implement feature A" \
  "Implement feature B" \
  "Implement feature C" \
  --concurrency 2 \
  -o build-results.json

echo "Build complete! Results in build-results.json"
```

**Integration with CI/CD**:
```bash
# .github/workflows/ai-tasks.yml
- name: Run AI Tasks
  run: |
    omc swarm --tasks-file .ai-tasks.json --agents 3
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### Debugging

**Verbose Output**:
```bash
# Results are automatically verbose
omc ap "Task" -o output.json
cat output.json | jq '.'
```

**Check Configuration**:
```bash
omc config
# Select "View Current Config"
```

**Validate Tasks File**:
```bash
# Check JSON syntax
cat tasks.json | jq '.'

# Run with single agent first
omc swarm --agents 1 --tasks-file tasks.json
```

### Keyboard Shortcuts

**Chat Mode**:
- `Ctrl+C` - Exit chat (or use `/exit`)
- `Ctrl+D` - EOF, exits chat
- `↑` / `↓` - Command history (via inquirer)

**General**:
- `Ctrl+C` - Interrupt current operation
- `omc <command> --help` - Quick help reference

### Best Practices

1. **Start Small**: Test with `eco` or single task before large swarms
2. **Use Task Files**: Version control your AI workflows
3. **Monitor Costs**: Check `/cost` frequently in chat mode
4. **Save Results**: Use `-o` flag for important runs
5. **Choose Models Wisely**: Architect uses smarter models, Executor uses faster ones
6. **Iterate**: Use chat mode for exploratory work
7. **Automate**: Swarm mode for repetitive tasks
8. **Document**: Save results for team sharing

### Common Patterns

**Feature Development**:
```bash
omc ap "Implement feature X" -o feature-x-plan.json
omc ulw "Write tests" "Update docs" "Add examples"
```

**Maintenance**:
```bash
omc eco "Update dependencies"
omc eco "Fix linting errors"
omc eco "Update README"
```

**Large Refactoring**:
```bash
# tasks.json with 20+ refactoring tasks
omc swarm --agents 8 --tasks-file refactor-tasks.json
```

**Experimentation**:
```bash
omc chat
You: eco: try approach A
You: /cost
You: eco: try approach B
You: /cost
You: /exit
```

---

## See Also

- [Getting Started Guide](./getting-started.md)
- [Agents Documentation](./agents.md)
- [Execution Modes](./modes.md)
- [BYOK Configuration](./byok.md)
- [API Reference](./api.md)

---

**Need Help?**

```bash
omc --help
omc <command> --help
omc chat
# Then type: /help
```
