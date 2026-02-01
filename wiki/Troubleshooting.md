# Troubleshooting

Common issues and their solutions.

## Installation Issues

### Permission Errors (npm global install)

**Problem:** Permission denied when installing globally

**Solution:**
```bash
# Option 1: Use npx (recommended)
npx oh-my-copilot autopilot "Task"

# Option 2: Configure npm prefix
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g oh-my-copilot

# Option 3: Use sudo (not recommended)
sudo npm install -g oh-my-copilot
```

### Node Version Too Old

**Problem:** `Error: Oh My Copilot requires Node.js >= 18.0.0`

**Solution:**
```bash
# Check version
node --version

# Update using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Build Errors

**Problem:** Build fails with TypeScript or compilation errors

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install

# Update npm
npm install -g npm@latest

# Try with legacy peer deps
npm install --legacy-peer-deps
```

## API Key Issues

### Invalid API Key

**Problem:** `Error: Invalid API key`

**Solution:**
```bash
# Check if key is set
echo $OPENAI_API_KEY

# Reconfigure
omc config

# Test the key
omc config --test-key openai

# Make sure no extra spaces or quotes
OPENAI_API_KEY=sk-... # Correct
OPENAI_API_KEY="sk-..." # May cause issues
```

### API Key Not Found

**Problem:** `Error: No API key configured for provider`

**Solution:**
1. Check `.env` file exists and contains the key
2. Verify environment variable is set: `echo $OPENAI_API_KEY`
3. Try setting directly in config:
   ```bash
   omc autopilot "Task" --openai-key sk-...
   ```
4. Use the config wizard: `omc config`

### Multiple Providers

**Problem:** Confused about which provider to use

**Solution:**
```bash
# Set default provider
export DEFAULT_PROVIDER=openai

# Or in omc.config.json
{
  "defaultProvider": "openai"
}

# Or specify per command
omc autopilot "Task" --provider anthropic
```

## Runtime Errors

### Rate Limit Exceeded

**Problem:** `Error: Rate limit exceeded`

**Solution:**
- Wait a few minutes before retrying
- Reduce concurrency in ultrawork mode
- Use economy mode to reduce requests
- Check your API provider's rate limits
- Consider upgrading your API plan

### Timeout Errors

**Problem:** `Error: Request timeout`

**Solution:**
```bash
# Increase timeout in config
{
  "execution": {
    "autopilot": {
      "timeout": 900000  // 15 minutes
    }
  }
}

# Or break task into smaller pieces
omc eco "Smaller subtask 1"
omc eco "Smaller subtask 2"
```

### Out of Memory

**Problem:** `Error: JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Or run with increased memory
node --max-old-space-size=4096 $(which omc) autopilot "Task"
```

### Context Length Exceeded

**Problem:** `Error: Context length exceeded`

**Solution:**
- Break task into smaller pieces
- Use a model with larger context (e.g., GPT-4o with 128k tokens)
- Reduce the amount of code/context provided
- Use templates for structured tasks

## Configuration Issues

### Config Not Loading

**Problem:** Configuration file not being read

**Solution:**
```bash
# Check file location
ls ~/.oh-my-copilot/omc.config.json
ls ./omc.config.json

# Verify JSON syntax
cat omc.config.json | jq .

# Use specific config file
omc --config /path/to/omc.config.json autopilot "Task"

# Debug config loading
omc --log-level debug config --show
```

### Environment Variables Not Working

**Problem:** `.env` file not being loaded

**Solution:**
```bash
# Check file exists
ls .env

# Load manually
export $(cat .env | xargs)

# Or use dotenv
npm install -g dotenv-cli
dotenv omc autopilot "Task"

# Check if loaded
omc config --show
```

## Cost Tracking Issues

### Costs Not Showing

**Problem:** Cost report shows $0.00

**Solution:**
```bash
# Enable cost tracking
export TRACK_COSTS=true

# Or in config
{
  "tracking": {
    "enableCosts": true
  }
}

# Check if models have cost data
omc config --show
```

### Incorrect Cost Calculations

**Problem:** Costs seem wrong

**Solution:**
- Verify model pricing in configuration
- Check for custom models without cost data
- Ensure provider pricing is up to date
- Report discrepancies as GitHub issues

## Web UI Issues

### Port Already in Use

**Problem:** `Error: Port 3000 already in use`

**Solution:**
```bash
# Use different port
omc web --port 8080

# Or configure in omc.config.json
{
  "web": {
    "port": 8080
  }
}

# Kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000    # Windows
```

### Dashboard Not Loading

**Problem:** Web UI shows blank page

**Solution:**
- Clear browser cache
- Try different browser
- Check console for errors (F12)
- Rebuild: `npm run build`
- Check firewall settings

## VS Code Extension Issues

### Extension Not Activating

**Problem:** Commands not appearing in palette

**Solution:**
1. Reload VS Code window: `Developer: Reload Window`
2. Check extension is installed and enabled
3. View extension output: Output → "Oh My Copilot"
4. Reinstall extension
5. Check VS Code version >= 1.80.0

### API Keys Not Working in Extension

**Problem:** Extension can't access API keys

**Solution:**
1. Set keys in VS Code settings (not just .env)
2. Open Settings → Search "Oh My Copilot"
3. Enter API keys in extension settings
4. Reload window

### Commands Failing

**Problem:** Commands start but fail immediately

**Solution:**
1. Check Output panel for errors
2. Verify Node.js is in PATH
3. Try running from terminal first
4. Check extension logs

## Swarm Mode Issues

### Tasks Not Being Claimed

**Problem:** Agents not picking up tasks

**Solution:**
```bash
# Check task pool
omc swarm --status

# Verify agents are running
ps aux | grep omc

# Increase polling interval
{
  "execution": {
    "swarm": {
      "pollingInterval": 500
    }
  }
}
```

### Database Locked

**Problem:** `Error: Database is locked`

**Solution:**
```bash
# Stop all agents
killall omc

# Remove lock file
rm ~/.oh-my-copilot/tasks.db-lock

# Restart swarm
omc swarm --agents 3 "Task 1"
```

## Performance Issues

### Slow Execution

**Problem:** Commands taking too long

**Solution:**
- Use economy mode for simple tasks
- Use faster models (gpt-4o-mini, gemini-flash)
- Reduce maxTokens in config
- Check network connection
- Use local models with Ollama

### High Memory Usage

**Problem:** Process using too much RAM

**Solution:**
```bash
# Use streaming mode
omc autopilot "Task" --stream

# Reduce concurrency
omc ultrawork --concurrency 1 "Tasks"

# Use lighter models
omc eco "Task" --model cheap
```

## Template Issues

### Template Not Found

**Problem:** `Error: Template 'xyz' not found`

**Solution:**
```bash
# List available templates
omc templates list

# Check spelling
omc templates show build-rest-api

# Use custom template
omc templates run /path/to/template.json
```

### Template Variables Not Substituted

**Problem:** Variables like `{{variable}}` appear in output

**Solution:**
```bash
# Ensure variables are provided
omc templates run build-rest-api \
  --resourceName users \
  --framework express

# Check template syntax
cat template.json | jq .
```

## Plugin Issues

### Plugin Won't Load

**Problem:** `Error: Failed to load plugin`

**Solution:**
```bash
# Check plugin path
ls ./my-plugin.js

# Verify plugin syntax
node --check ./my-plugin.js

# Check logs
omc --log-level debug plugins load ./my-plugin.js

# Reinstall plugin dependencies
cd my-plugin
npm install
```

## Getting More Help

### Enable Debug Logging

```bash
# Run with debug logs
omc --log-level debug autopilot "Task"

# Save logs to file
omc --log-level debug autopilot "Task" 2>&1 | tee debug.log
```

### Report an Issue

When reporting issues, include:

1. **Version info:**
   ```bash
   omc --version
   node --version
   npm --version
   ```

2. **Configuration:**
   ```bash
   omc config --show
   ```

3. **Error logs:**
   ```bash
   omc --log-level debug <command>
   ```

4. **Steps to reproduce**

5. **Expected vs actual behavior**

### Community Support

- **GitHub Issues**: https://github.com/odpilot/oh-my-copilot/issues
- **Discussions**: https://github.com/odpilot/oh-my-copilot/discussions
- **Documentation**: https://github.com/odpilot/oh-my-copilot/wiki

## Common Error Messages

| Error | Likely Cause | Solution |
|-------|-------------|----------|
| `No API key configured` | Missing API key | Run `omc config` |
| `Invalid API key` | Wrong or expired key | Verify key in provider dashboard |
| `Rate limit exceeded` | Too many requests | Wait and retry, or upgrade plan |
| `Context length exceeded` | Input too large | Break into smaller tasks |
| `Command not found: omc` | Not installed or not in PATH | Reinstall or check PATH |
| `Permission denied` | File/directory permissions | Check file permissions |
| `ENOENT` | File not found | Verify file paths |
| `EADDRINUSE` | Port in use | Use different port |

## Still Having Issues?

1. Check the [FAQ](FAQ)
2. Search [existing issues](https://github.com/odpilot/oh-my-copilot/issues)
3. Ask in [Discussions](https://github.com/odpilot/oh-my-copilot/discussions)
4. [Create a new issue](https://github.com/odpilot/oh-my-copilot/issues/new)
