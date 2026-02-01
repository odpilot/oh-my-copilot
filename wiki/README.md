# Oh My Copilot Wiki Content

This directory contains the markdown files for the Oh My Copilot GitHub Wiki.

## Wiki Pages

### Getting Started
- **Home.md** - Wiki home page with overview and navigation
- **Installation.md** - Installation guide for all platforms
- **Quick-Start.md** - 5-minute quick start guide
- **Configuration.md** - Comprehensive configuration guide

### Core Features
- **Execution-Modes.md** - Guide to autopilot, ultrawork, swarm, and economy modes
- **Agent-System.md** - Understanding the 8 specialized agents (TO BE CREATED)
- **BYOK.md** - Bring Your Own Key provider setup (TO BE CREATED)

### Advanced
- **Templates.md** - Task template system (TO BE CREATED)
- **Plugins.md** - Plugin development and usage (TO BE CREATED)
- **MCP.md** - Model Context Protocol integration (TO BE CREATED)
- **Cost-Tracking.md** - Cost monitoring and optimization (TO BE CREATED)

### Development
- **CLI-Reference.md** - Complete CLI documentation (TO BE CREATED)
- **API-Reference.md** - Programmatic API guide (TO BE CREATED)
- **Custom-Agents.md** - Building custom agents (TO BE CREATED)
- **Contributing.md** - Contribution guidelines (TO BE CREATED)

### Help
- **Troubleshooting.md** - Common issues and solutions
- **FAQ.md** - Frequently asked questions
- **VSCode-Extension.md** - VS Code extension guide (TO BE CREATED)

## Publishing to GitHub Wiki

To publish these pages to the GitHub Wiki:

1. Go to https://github.com/odpilot/oh-my-copilot/wiki
2. Create or edit pages with the same names
3. Copy content from markdown files here
4. Save each page

Or use the GitHub Wiki's Git interface:

```bash
git clone https://github.com/odpilot/oh-my-copilot.wiki.git
cd oh-my-copilot.wiki
cp /path/to/oh-my-copilot/wiki/* .
git add .
git commit -m "Update wiki content"
git push
```

## Contributing

To contribute to the wiki:

1. Edit markdown files in this directory
2. Submit a PR to the main repository
3. Wiki maintainers will sync changes to GitHub Wiki

## Notes

- Maintain consistent formatting across pages
- Use relative links for inter-wiki navigation: `[Link Text](Page-Name)`
- Update the Home.md navigation when adding new pages
- Keep content up to date with code changes
