# Installation

This guide will walk you through installing Oh My Copilot on your system.

## System Requirements

- **Node.js**: >= 18.0.0
- **npm** or **yarn**: Latest version
- **Operating System**: Windows, macOS, or Linux

## Installation Methods

### 1. Global Installation (Recommended)

Install Oh My Copilot globally to use the CLI from anywhere:

```bash
npm install -g oh-my-copilot
```

Verify the installation:

```bash
omc --version
```

### 2. Local Project Installation

Install as a dependency in your project:

```bash
npm install oh-my-copilot
```

Or with yarn:

```bash
yarn add oh-my-copilot
```

### 3. From Source (For Contributors)

Clone and build from source:

```bash
# Clone the repository
git clone https://github.com/odpilot/oh-my-copilot.git
cd oh-my-copilot

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## Post-Installation

### Configure API Keys

After installation, configure your AI provider API keys:

```bash
omc config
```

This will launch an interactive wizard to help you:
- Choose your AI provider (OpenAI, Anthropic, Google, Azure, Ollama)
- Enter your API key
- Select default model
- Configure other settings

### Verify Installation

Test that everything is working:

```bash
# Show help
omc --help

# Check version
omc --version

# List available models
omc templates list
```

## Installing the VS Code Extension

If you want to use Oh My Copilot directly in VS Code:

1. Download the `.vsix` file from the releases page
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`)
4. Click `...` menu → "Install from VSIX..."
5. Select the downloaded file

Or build from source:

```bash
cd vscode-extension
npm install
npm run compile
npm run package
```

## Updating

### Update Global Installation

```bash
npm update -g oh-my-copilot
```

### Update Local Installation

```bash
npm update oh-my-copilot
```

### Update from Source

```bash
cd oh-my-copilot
git pull
npm install
npm run build
```

## Troubleshooting Installation

### Permission Errors (Linux/macOS)

If you get permission errors with global install:

```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g oh-my-copilot

# Option 2: Configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g oh-my-copilot
```

### Node Version Issues

Check your Node.js version:

```bash
node --version
```

If it's below 18.0.0, update Node.js:

**Using nvm (recommended):**
```bash
nvm install 18
nvm use 18
```

**Or download from:** https://nodejs.org/

### Build Errors

If you encounter build errors:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Ensure you have the latest npm:
   ```bash
   npm install -g npm@latest
   ```

## Uninstallation

### Remove Global Installation

```bash
npm uninstall -g oh-my-copilot
```

### Remove Local Installation

```bash
npm uninstall oh-my-copilot
```

### Clean Up Configuration

Configuration files are stored in:
- **Linux/macOS**: `~/.oh-my-copilot/`
- **Windows**: `%USERPROFILE%\.oh-my-copilot\`

Remove manually if needed:

```bash
# Linux/macOS
rm -rf ~/.oh-my-copilot

# Windows (PowerShell)
Remove-Item -Recurse -Force $env:USERPROFILE\.oh-my-copilot
```

## Next Steps

- [Configuration](Configuration) - Set up your API keys and preferences
- [Quick Start](Quick-Start) - Get started with your first task
- [CLI Reference](CLI-Reference) - Learn all available commands

## Need Help?

- [Troubleshooting](Troubleshooting) - Common issues and solutions
- [FAQ](FAQ) - Frequently asked questions
- [GitHub Issues](https://github.com/odpilot/oh-my-copilot/issues) - Report bugs or ask questions
