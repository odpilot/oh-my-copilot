# MCP (Model Context Protocol) Integration

## Overview

Oh My Copilot supports the Model Context Protocol (MCP), allowing agents to interact with external tools and services through a standardized interface.

## Features

- **Multiple MCP Servers**: Connect to multiple MCP servers simultaneously
- **Built-in Tools**: File system, Git, Shell, HTTP, and Database operations
- **Agent Integration**: All agents can use MCP tools
- **Extensible**: Add custom MCP servers and tools

## Configuration

### Basic Configuration

```typescript
import { MCPClient, DEFAULT_MCP_CONFIG } from 'oh-my-copilot';

const mcpClient = new MCPClient();
await mcpClient.connect(DEFAULT_MCP_CONFIG);
```

### Custom Configuration

```typescript
import { MCPClient, type MCPConfig } from 'oh-my-copilot';

const config: MCPConfig = {
  servers: [
    {
      name: 'filesystem',
      command: 'npx',
      args: ['-y', '@anthropic-ai/mcp-server-filesystem'],
      enabled: true
    },
    {
      name: 'custom-server',
      command: 'node',
      args: ['./my-mcp-server.js'],
      env: {
        API_KEY: 'your-api-key'
      },
      enabled: true
    }
  ],
  timeout: 30000,
  retries: 3
};

const mcpClient = new MCPClient();
await mcpClient.connect(config);
```

## Using MCP with Agents

### Enable MCP for an Agent

```typescript
import { ArchitectAgent, DEFAULT_MCP_CONFIG } from 'oh-my-copilot';

const agent = new ArchitectAgent();

// Enable MCP
await agent.enableMCP(DEFAULT_MCP_CONFIG);

// Now the agent can use MCP tools
const result = await agent.useTool('filesystem', 'readFile', {
  path: './README.md'
});

console.log(result);
```

### List Available Tools

```typescript
// List all tools
const allTools = await agent.listMCPTools();

// List tools from a specific server
const fileTools = await agent.listMCPTools('filesystem');

console.log('Available tools:', allTools);
```

### Disable MCP

```typescript
await agent.disableMCP();
```

## Built-in MCP Tools

### File System Tools

- `readFile(path: string)`: Read file contents
- `writeFile(path: string, content: string)`: Write to a file
- `listDirectory(path: string)`: List directory contents

### Git Tools

- `status(cwd?: string)`: Get git status
- `commit(message: string, cwd?: string)`: Create a commit
- `diff(cwd?: string)`: Get git diff
- `log(count?: number, cwd?: string)`: Get git log

### Shell Tools

- `execute(command: string, cwd?: string)`: Execute shell command
- `which(program: string)`: Find program location

### HTTP Tools

- `get(url: string, headers?)`: HTTP GET request
- `post(url: string, body: any, headers?)`: HTTP POST request
- `put(url: string, body: any, headers?)`: HTTP PUT request
- `delete(url: string, headers?)`: HTTP DELETE request

### Database Tools

- `query(sql: string, params?: any[])`: Execute SQL query
- `execute(sql: string, params?: any[])`: Execute SQL statement
- `transaction(queries: Array)`: Execute transaction

## Direct MCP Client Usage

You can also use the MCP client directly without agents:

```typescript
import { MCPClient, DEFAULT_MCP_CONFIG } from 'oh-my-copilot';

const client = new MCPClient();
await client.connect(DEFAULT_MCP_CONFIG);

// Call a tool
const result = await client.callTool('git', 'status', {});
console.log(result);

// List connected servers
const servers = client.getConnectedServers();
console.log('Connected servers:', servers);

// Disconnect
await client.disconnect();
```

## Creating Custom MCP Servers

You can create custom MCP servers to extend Oh My Copilot's capabilities:

```typescript
// my-custom-server.ts
import { MCPServer } from 'oh-my-copilot';

const server = new MCPServer({
  name: 'my-custom-server',
  command: 'node',
  args: ['./server.js']
});

await server.start();

// The server can now be used by MCP clients
```

## Best Practices

1. **Connection Management**: Always disconnect from MCP servers when done
2. **Error Handling**: Wrap MCP calls in try-catch blocks
3. **Timeouts**: Configure appropriate timeouts for long-running operations
4. **Security**: Be cautious with shell and file system access
5. **Resource Cleanup**: Ensure servers are properly stopped

## Troubleshooting

### Server Won't Start

```typescript
// Check if the server process is running
const isConnected = client.isServerConnected('filesystem');
console.log('Server connected:', isConnected);
```

### Tool Not Found

```typescript
// List available tools to verify the tool exists
const tools = await client.listTools('servername');
console.log('Available tools:', tools);
```

### Timeout Issues

```typescript
// Increase timeout in configuration
const config: MCPConfig = {
  servers: [...],
  timeout: 60000,  // 60 seconds
  retries: 5
};
```

## Examples

See the [examples](../examples/) directory for complete working examples:

- `examples/mcp-basic.ts` - Basic MCP usage
- `examples/mcp-agents.ts` - Using MCP with agents
- `examples/mcp-custom-server.ts` - Creating custom MCP servers
