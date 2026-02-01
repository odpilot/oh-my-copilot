# Quick Start Guide

Get up and running with Oh My Copilot in just 5 minutes!

## Step 1: Install

```bash
npm install -g oh-my-copilot
```

## Step 2: Configure

Run the interactive configuration wizard:

```bash
omc config
```

You'll be asked to:
1. Choose your AI provider (OpenAI, Anthropic, Google, etc.)
2. Enter your API key
3. Select a default model
4. Configure tracking preferences

**Don't have an API key?** Get one from:
- [OpenAI](https://platform.openai.com/api-keys) - Recommended for beginners
- [Anthropic](https://console.anthropic.com/) - Claude models
- [Google AI Studio](https://aistudio.google.com/app/apikey) - Gemini models

## Step 3: Run Your First Task

### Using Autopilot Mode

The easiest way to get started:

```bash
omc autopilot "Create a simple calculator function in JavaScript"
```

This will:
1. ✅ Architect agent plans the implementation
2. ✅ Executor agent writes the code
3. ✅ QA Tester agent creates tests
4. ✅ Security agent reviews for vulnerabilities

### Using Chat Mode

For interactive conversations:

```bash
omc chat
```

Then type your questions or requests:
```
> How do I create a REST API with Express?
> Write tests for the user authentication module
> Explain the difference between let and const
```

### Using Economy Mode

For simple, cost-effective tasks:

```bash
omc eco "Add JSDoc comments to my functions"
```

## Step 4: View Results

Results are displayed in the terminal. You can also:

### Check Cost Report

```bash
omc cost
```

### View Metrics

```bash
omc metrics
```

### Launch Web Dashboard

```bash
omc web
```

Then open http://localhost:3000 in your browser.

## Common Tasks

### Code Generation

```bash
omc autopilot "Build a user authentication system with JWT"
```

### Code Review

```bash
omc autopilot "Review this code for security issues" < myfile.js
```

### Test Generation

```bash
omc autopilot "Write unit tests for the Calculator class"
```

### Documentation

```bash
omc autopilot "Generate API documentation for my Express routes"
```

### Refactoring

```bash
omc eco "Refactor this function to use async/await"
```

## Understanding Execution Modes

### Autopilot (Full Pipeline)

Complete automated workflow with multiple agents:

```bash
omc autopilot "Your task here"
omc ap "Your task here"  # Short alias
```

**Use when:**
- Building new features
- Need comprehensive solution
- Want full testing and security review

### Economy Mode (Cost-Optimized)

Efficient execution for simpler tasks:

```bash
omc eco "Your task here"
```

**Use when:**
- Simple, straightforward tasks
- Want to minimize costs
- Don't need extensive testing

### Ultrawork (Parallel)

Execute multiple tasks simultaneously:

```bash
omc ultrawork "Task 1" "Task 2" "Task 3"
omc ulw --tasks-file tasks.json
```

**Use when:**
- Have multiple independent tasks
- Want maximum speed
- Tasks can run in parallel

### Swarm Mode (Distributed)

Autonomous agents claim and process tasks:

```bash
omc swarm --agents 5 "Task 1" "Task 2" "Task 3"
```

**Use when:**
- Large number of tasks
- Need dynamic task allocation
- Want self-organizing agents

## Using Templates

Pre-built workflows for common tasks:

```bash
# List available templates
omc templates list

# View template details
omc templates show build-rest-api

# Run a template
omc templates run build-rest-api \
  --resourceName users \
  --framework express \
  --database postgresql
```

Available templates:
- `build-rest-api` - Create REST API endpoints
- `code-review` - Comprehensive code review
- `test-generation` - Generate test suites
- `documentation` - Create documentation
- `refactoring` - Code refactoring
- `bug-fix` - Fix bugs systematically
- `feature-implementation` - Implement features
- `security-audit` - Security analysis

## Configuration Tips

### Using Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=sk-...
DEFAULT_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini
```

### Using Config File

Create `omc.config.json`:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-4o-mini",
  "agents": {
    "architect": { "model": "gpt-4o" },
    "executor": { "model": "gpt-4o-mini" },
    "qa-tester": { "model": "gpt-4o-mini" }
  },
  "trackCosts": true
}
```

### Model Aliases

Use shortcuts instead of full model names:

```json
{
  "models": {
    "aliases": {
      "fast": "gpt-4o-mini",
      "smart": "gpt-4o",
      "cheap": "claude-3-haiku-20240307"
    }
  }
}
```

Then use:
```bash
omc autopilot "Task" --model fast
```

## Getting Help

### In-App Help

```bash
# General help
omc --help

# Command-specific help
omc autopilot --help
omc chat --help
```

### Documentation

- [Configuration Guide](Configuration) - Detailed configuration options
- [Execution Modes](Execution-Modes) - Deep dive into modes
- [CLI Reference](CLI-Reference) - All commands and options
- [Agent System](Agent-System) - Understanding agents

### Troubleshooting

If something doesn't work:

1. Check your API key is valid:
   ```bash
   omc config
   ```

2. Verify your Node.js version:
   ```bash
   node --version  # Should be >= 18.0.0
   ```

3. Check for errors:
   ```bash
   omc --log-level debug autopilot "Test task"
   ```

4. See [Troubleshooting Guide](Troubleshooting)

## Next Steps

Now that you're up and running:

1. **Explore Execution Modes** - [Learn about autopilot, ultrawork, swarm, and eco](Execution-Modes)
2. **Understand Agents** - [Deep dive into the 8 specialized agents](Agent-System)
3. **Try Templates** - [Use pre-built workflows](Templates)
4. **Set Up Plugins** - [Extend functionality](Plugins)
5. **Launch Web UI** - [Use the visual dashboard](Web-Dashboard)
6. **Install VS Code Extension** - [Editor integration](VSCode-Extension)

## Example Workflow

Here's a complete workflow for building a feature:

```bash
# 1. Plan the feature
omc autopilot "Plan implementation of user profile editing feature"

# 2. Implement the feature
omc autopilot "Implement user profile editing with validation"

# 3. Generate tests
omc templates run test-generation --component UserProfile

# 4. Security review
omc templates run security-audit --target "user profile endpoints"

# 5. Generate documentation
omc templates run documentation --component UserProfile

# 6. Check costs
omc cost
```

Happy coding! 🚀
