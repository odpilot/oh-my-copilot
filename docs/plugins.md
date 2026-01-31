# Plugin System

## Overview

The Plugin System allows you to extend Oh My Copilot with custom functionality. Plugins can add new agents, tools, commands, and hooks to integrate with external services and customize behavior.

## Features

- **Extensible Architecture**: Add custom agents, tools, and commands
- **Lifecycle Hooks**: React to events (beforeExecute, afterExecute, onError, onCostUpdate)
- **Built-in Plugins**: GitHub, Jira, and Slack integrations
- **NPM Support**: Load plugins from npm packages
- **Plugin Manager**: Centralized plugin management

## Built-in Plugins

### GitHub Plugin

Interact with GitHub repositories.

**Tools:**
- `github.createIssue`: Create GitHub issues
- `github.createPR`: Create pull requests
- `github.listIssues`: List repository issues
- `github.getRepo`: Get repository information

**Example:**
```typescript
import { PluginManager, GitHubPlugin } from 'oh-my-copilot';

const manager = new PluginManager(omc);
await manager.loadPlugin('./node_modules/oh-my-copilot/dist/plugins/built-in/github-plugin.js');

// Use the tool
const result = await manager.callTool('github.createIssue', {
  repo: 'owner/repository',
  title: 'Bug: Something is broken',
  body: 'Detailed description...'
});
```

### Jira Plugin

Integrate with Jira for issue tracking.

**Tools:**
- `jira.createIssue`: Create Jira issues
- `jira.listIssues`: List project issues

### Slack Plugin

Send notifications to Slack.

**Tools:**
- `slack.sendMessage`: Send messages to channels
- `slack.sendNotification`: Send formatted notifications

**Hooks:**
- `afterExecute`: Notify on completion
- `onError`: Notify on errors

## CLI Usage

### List Loaded Plugins

```bash
omc plugins list
```

### Load a Plugin

```bash
# Load from file
omc plugins load ./my-plugin.js

# Load from npm package
omc plugins install @omc/plugin-jira
```

### Unload a Plugin

```bash
omc plugins unload github
```

### Show Plugin Info

```bash
omc plugins info github
```

## Programmatic Usage

### Basic Plugin Management

```typescript
import { OhMyCopilot, PluginManager } from 'oh-my-copilot';

const omc = new OhMyCopilot();
const manager = new PluginManager(omc);

// Load a plugin
await manager.loadPlugin('./plugins/my-plugin.js');

// Load from npm
await manager.loadPluginFromNpm('@omc/plugin-custom');

// List loaded plugins
const plugins = manager.listPlugins();
console.log('Loaded plugins:', plugins);

// Get plugin details
const plugin = manager.getPlugin('github');
console.log('Plugin:', plugin);

// Call a tool
const result = await manager.callTool('github.createIssue', {
  repo: 'owner/repo',
  title: 'Issue title'
});

// Unload plugin
await manager.unloadPlugin('github');
```

### Execute Hooks

```typescript
// Execute hooks for an event
await manager.executeHook('afterExecute', {
  success: true,
  agentName: 'architect',
  result: '...'
});

await manager.executeHook('onError', {
  error: 'Something went wrong',
  agentName: 'executor'
});
```

### Get Plugin Extensions

```typescript
// Get all agents from plugins
const agents = manager.getAgents();
console.log('Plugin agents:', Array.from(agents.keys()));

// Get all tools from plugins
const tools = manager.getTools();
console.log('Plugin tools:', Array.from(tools.keys()));

// Get all commands from plugins
const commands = manager.getCommands();
console.log('Plugin commands:', Array.from(commands.keys()));
```

## Creating Plugins

### Plugin Structure

```typescript
import type { Plugin, PluginContext } from 'oh-my-copilot';

export const MyPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My custom plugin',
  author: 'Your Name',
  
  // Optional lifecycle hooks
  async onLoad(context: PluginContext) {
    context.logger.info('My plugin loaded!');
    // Initialize plugin
  },
  
  async onUnload() {
    // Cleanup
  },
  
  // Optional: Add custom agents
  agents: [
    {
      name: 'my-agent',
      factory: (config) => new MyCustomAgent(config)
    }
  ],
  
  // Optional: Add custom tools
  tools: [
    {
      name: 'my-tool',
      description: 'Does something useful',
      parameters: {
        input: { type: 'string', required: true }
      },
      async execute(args, context) {
        context.logger.info(`Executing my-tool with: ${args.input}`);
        return { result: 'Success!' };
      }
    }
  ],
  
  // Optional: Add custom commands
  commands: [
    {
      name: 'my-command',
      description: 'Custom CLI command',
      async action(args, context) {
        context.logger.info('Executing custom command');
      }
    }
  ],
  
  // Optional: Add event hooks
  hooks: [
    {
      event: 'beforeExecute',
      async handler(data, context) {
        context.logger.info('About to execute:', data);
      }
    },
    {
      event: 'afterExecute',
      async handler(data, context) {
        context.logger.info('Execution complete:', data);
      }
    },
    {
      event: 'onError',
      async handler(data, context) {
        context.logger.error('Error occurred:', data);
      }
    },
    {
      event: 'onCostUpdate',
      async handler(data, context) {
        context.logger.info('Cost update:', data);
      }
    }
  ]
};

export default MyPlugin;
```

### Plugin Context

The `PluginContext` provides access to:

```typescript
interface PluginContext {
  omc: OhMyCopilot;      // Main OhMyCopilot instance
  config: Record<string, any>;  // Plugin configuration
  logger: Logger;         // Logging utility
}
```

### Tool Definition

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any, context: PluginContext) => Promise<any>;
}
```

### Agent Definition

```typescript
import { BaseAgent } from 'oh-my-copilot';

class MyCustomAgent extends BaseAgent {
  constructor(model: string = 'gpt-4o') {
    super({
      name: 'my-agent',
      model,
      systemPrompt: 'You are a custom agent...',
      temperature: 0.7
    });
  }
}

export const myAgentDefinition: AgentDefinition = {
  name: 'my-agent',
  factory: (config) => new MyCustomAgent(config.model)
};
```

### Hook Events

Available hook events:
- `beforeExecute`: Before an agent executes a task
- `afterExecute`: After an agent completes a task
- `onError`: When an error occurs
- `onCostUpdate`: When cost tracking updates

## Publishing Plugins

### 1. Package Structure

```
my-plugin/
├── package.json
├── src/
│   └── index.ts
├── dist/
│   └── index.js
└── README.md
```

### 2. package.json

```json
{
  "name": "@omc/plugin-myname",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["oh-my-copilot", "plugin"],
  "peerDependencies": {
    "oh-my-copilot": "^0.1.0"
  }
}
```

### 3. Export Plugin

```typescript
// src/index.ts
import type { Plugin } from 'oh-my-copilot';

export const MyPlugin: Plugin = {
  // ... plugin definition
};

export default MyPlugin;
```

### 4. Publish to npm

```bash
npm publish --access public
```

### 5. Install and Use

```bash
npm install @omc/plugin-myname
```

```typescript
import { PluginManager } from 'oh-my-copilot';

await manager.loadPluginFromNpm('@omc/plugin-myname');
```

## Plugin Examples

### API Integration Plugin

```typescript
export const APIPlugin: Plugin = {
  name: 'api-client',
  version: '1.0.0',
  description: 'HTTP API client plugin',
  
  tools: [
    {
      name: 'api.get',
      description: 'Make GET request',
      parameters: {
        url: { type: 'string', required: true },
        headers: { type: 'object', required: false }
      },
      async execute(args, context) {
        const response = await fetch(args.url, {
          headers: args.headers
        });
        return await response.json();
      }
    }
  ]
};
```

### Database Plugin

```typescript
export const DatabasePlugin: Plugin = {
  name: 'database',
  version: '1.0.0',
  description: 'Database operations',
  
  async onLoad(context) {
    // Initialize database connection
    this.db = await connectToDatabase(context.config.connectionString);
  },
  
  tools: [
    {
      name: 'db.query',
      description: 'Execute SQL query',
      parameters: {
        sql: { type: 'string', required: true },
        params: { type: 'array', required: false }
      },
      async execute(args, context) {
        return await this.db.query(args.sql, args.params);
      }
    }
  ],
  
  async onUnload() {
    await this.db.close();
  }
};
```

### Monitoring Plugin

```typescript
export const MonitoringPlugin: Plugin = {
  name: 'monitoring',
  version: '1.0.0',
  description: 'Performance monitoring',
  
  hooks: [
    {
      event: 'beforeExecute',
      async handler(data, context) {
        data.startTime = Date.now();
      }
    },
    {
      event: 'afterExecute',
      async handler(data, context) {
        const duration = Date.now() - data.startTime;
        context.logger.info(`Task took ${duration}ms`);
        
        // Send to monitoring service
        await sendMetric('task_duration', duration);
      }
    }
  ]
};
```

## Best Practices

1. **Naming**: Use descriptive, namespaced tool names (e.g., `github.createIssue`)
2. **Error Handling**: Always handle errors in tools and hooks
3. **Cleanup**: Implement `onUnload` to cleanup resources
4. **Logging**: Use `context.logger` for consistent logging
5. **Configuration**: Support configuration through `PluginContext.config`
6. **Documentation**: Document tool parameters and return values
7. **Testing**: Test plugins thoroughly before publishing
8. **Versioning**: Follow semantic versioning

## Troubleshooting

### Plugin Won't Load

- Check plugin exports (`export default Plugin`)
- Verify plugin structure matches interface
- Check for import errors

### Tool Not Found

- Ensure plugin is loaded: `manager.listPlugins()`
- Verify tool name matches definition
- Check `manager.getTools()` for available tools

### Hook Not Executing

- Verify hook event name is correct
- Check plugin is loaded when event fires
- Look for errors in plugin code

## Examples

See [examples/plugins/](../examples/plugins/) for complete examples:

- `examples/plugins/custom-plugin.ts` - Basic custom plugin
- `examples/plugins/api-plugin.ts` - API integration plugin
- `examples/plugins/monitoring-plugin.ts` - Monitoring and metrics plugin
