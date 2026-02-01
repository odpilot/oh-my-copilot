# Oh My Copilot - VS Code Extension

A powerful VS Code extension for the Oh My Copilot multi-agent AI orchestration system. This extension brings the full power of Oh My Copilot's agents directly into your editor.

## Features

### 🚀 Execution Modes

- **Autopilot**: Full automated pipeline (Planning → Implementation → Testing → Security)
- **Economy Mode**: Cost-optimized execution for simpler tasks
- **Ultrawork**: Execute multiple tasks in parallel
- **Swarm Mode**: Dynamic task claiming with autonomous agents

### 💬 Interactive Chat

- Chat interface in the sidebar
- Real-time conversations with AI agents
- Context-aware code assistance

### 💰 Cost Tracking

- Real-time cost monitoring
- Token usage statistics
- Per-agent cost breakdown

### ⚙️ Configuration

Easy configuration through VS Code settings:
- Multiple AI provider support (OpenAI, Anthropic, Google, Azure, Ollama)
- Model selection and customization
- API key management
- Cost tracking preferences

## Installation

### From VSIX (Recommended)

1. Download the latest `.vsix` file from the releases
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
4. Click the `...` menu → "Install from VSIX..."
5. Select the downloaded `.vsix` file

### From Source

```bash
cd vscode-extension
npm install
npm run compile
```

## Quick Start

1. **Configure API Keys**: 
   - Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Run "Oh My Copilot: Configure API Keys"
   - Enter your API keys in the settings

2. **Run Autopilot**:
   - Select code or open a file
   - Open Command Palette
   - Run "Oh My Copilot: Run Autopilot"
   - Enter your task description

3. **Use Chat**:
   - Click the Oh My Copilot icon in the Activity Bar
   - Use the chat interface to interact with agents

## Commands

All commands are accessible from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- `Oh My Copilot: Run Autopilot` - Run the full automated pipeline
- `Oh My Copilot: Open Chat` - Open the chat interface
- `Oh My Copilot: Run Ultrawork (Parallel)` - Execute tasks in parallel
- `Oh My Copilot: Run Swarm Mode` - Start swarm mode with multiple agents
- `Oh My Copilot: Run Economy Mode` - Cost-optimized execution
- `Oh My Copilot: Configure API Keys` - Open settings to configure API keys
- `Oh My Copilot: Show Cost Report` - Display cost tracking information

## Configuration

Configure Oh My Copilot through VS Code settings:

```json
{
  "ohMyCopilot.openaiApiKey": "sk-...",
  "ohMyCopilot.anthropicApiKey": "sk-ant-...",
  "ohMyCopilot.googleApiKey": "AIza...",
  "ohMyCopilot.defaultProvider": "openai",
  "ohMyCopilot.defaultModel": "gpt-4o-mini",
  "ohMyCopilot.trackCosts": true,
  "ohMyCopilot.logLevel": "info"
}
```

## Supported AI Providers

- **OpenAI**: GPT-4o, GPT-4o-mini, o1, o1-mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus/Haiku
- **Google**: Gemini 2.0 Flash, Gemini 1.5 Pro/Flash
- **Azure OpenAI**: GPT-4o (Azure deployments)
- **Ollama**: Llama 3, Mistral, and other local models
- **GitHub Copilot**: Copilot SDK models

## Usage Examples

### Run Autopilot on Selected Code

1. Select code in the editor
2. Right-click → "Oh My Copilot: Run Autopilot"
3. Enter task description (e.g., "Add error handling")
4. View results in the output panel

### Parallel Task Execution

1. Open Command Palette
2. Run "Oh My Copilot: Run Ultrawork (Parallel)"
3. Enter tasks separated by commas
4. Tasks will execute in parallel

### Chat with Agents

1. Click Oh My Copilot icon in Activity Bar
2. Type your question in the chat
3. Get real-time responses from AI agents

## Keyboard Shortcuts

Currently, no default keyboard shortcuts are set. You can add your own in VS Code's keyboard shortcuts settings.

## Output and Logs

All execution results and logs are displayed in the "Oh My Copilot" output channel. Access it via:
- View → Output → Select "Oh My Copilot" from the dropdown

## Troubleshooting

### Extension Not Activating

- Check that you have Node.js >= 18.0.0 installed
- Reload VS Code window (`Developer: Reload Window`)

### API Key Issues

- Verify API keys are correctly set in settings
- Check that keys have proper permissions
- Ensure no extra spaces in the keys

### Cost Tracking Not Showing

- Enable cost tracking in settings: `"ohMyCopilot.trackCosts": true`
- Run at least one task to generate cost data

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Package extension
npm run package
```

## Contributing

Contributions are welcome! Please see the main repository for contribution guidelines.

## License

MIT License - see LICENSE file for details

## Links

- [GitHub Repository](https://github.com/odpilot/oh-my-copilot)
- [Documentation](https://github.com/odpilot/oh-my-copilot/wiki)
- [Report Issues](https://github.com/odpilot/oh-my-copilot/issues)

## Credits

Built with ❤️ by the Oh My Copilot team.
