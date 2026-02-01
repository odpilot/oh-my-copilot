import * as vscode from 'vscode';
import { OhMyCopilot } from 'oh-my-copilot';
import { ChatViewProvider } from './chatViewProvider';
import { CostsViewProvider } from './costsViewProvider';
import { TasksViewProvider } from './tasksViewProvider';

let omcInstance: OhMyCopilot | undefined;
let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    console.log('Oh My Copilot extension is now active');
    
    // Create output channel
    outputChannel = vscode.window.createOutputChannel('Oh My Copilot');
    context.subscriptions.push(outputChannel);
    
    // Register webview providers
    const chatProvider = new ChatViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('ohMyCopilotSidebar', chatProvider)
    );
    
    const costsProvider = new CostsViewProvider();
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('ohMyCopilotCosts', costsProvider)
    );
    
    const tasksProvider = new TasksViewProvider();
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('ohMyCopilotTasks', tasksProvider)
    );
    
    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('oh-my-copilot.autopilot', async () => {
            await runAutopilot();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('oh-my-copilot.chat', async () => {
            await openChat();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('oh-my-copilot.ultrawork', async () => {
            await runUltrawork();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('oh-my-copilot.swarm', async () => {
            await runSwarm();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('oh-my-copilot.eco', async () => {
            await runEco();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('oh-my-copilot.config', async () => {
            await configureApiKeys();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('oh-my-copilot.showCosts', async () => {
            await showCosts();
        })
    );
}

export function deactivate() {
    if (omcInstance) {
        omcInstance.cleanup();
    }
}

async function getOmcInstance(): Promise<OhMyCopilot> {
    if (!omcInstance) {
        const config = vscode.workspace.getConfiguration('ohMyCopilot');
        
        // Set environment variables from config
        if (config.get('openaiApiKey')) {
            process.env.OPENAI_API_KEY = config.get('openaiApiKey');
        }
        if (config.get('anthropicApiKey')) {
            process.env.ANTHROPIC_API_KEY = config.get('anthropicApiKey');
        }
        if (config.get('googleApiKey')) {
            process.env.GOOGLE_API_KEY = config.get('googleApiKey');
        }
        if (config.get('azureApiKey')) {
            process.env.AZURE_OPENAI_API_KEY = config.get('azureApiKey');
        }
        if (config.get('azureEndpoint')) {
            process.env.AZURE_OPENAI_ENDPOINT = config.get('azureEndpoint');
        }
        if (config.get('ollamaBaseUrl')) {
            process.env.OLLAMA_BASE_URL = config.get('ollamaBaseUrl');
        }
        if (config.get('defaultProvider')) {
            process.env.DEFAULT_PROVIDER = config.get('defaultProvider');
        }
        if (config.get('defaultModel')) {
            process.env.DEFAULT_MODEL = config.get('defaultModel');
        }
        
        omcInstance = new OhMyCopilot({
            trackCosts: config.get('trackCosts', true),
            logLevel: config.get('logLevel', 'info')
        });
    }
    return omcInstance;
}

async function runAutopilot() {
    const editor = vscode.window.activeTextEditor;
    const selectedText = editor?.document.getText(editor.selection);
    
    const prompt = await vscode.window.showInputBox({
        prompt: 'Enter your task description',
        placeHolder: 'e.g., Build a REST API for user management',
        value: selectedText ? `Improve this code: ${selectedText}` : ''
    });
    
    if (!prompt) {
        return;
    }
    
    try {
        outputChannel.show();
        outputChannel.appendLine(`\n🚀 Running Autopilot: ${prompt}\n`);
        
        const omc = await getOmcInstance();
        const result = await omc.autopilot(prompt);
        
        outputChannel.appendLine(`\n✅ Autopilot completed!\n`);
        outputChannel.appendLine(`Summary: ${result.summary}\n`);
        
        if (result.output) {
            outputChannel.appendLine(`Output:\n${result.output}\n`);
        }
        
        const costReport = omc.getCostReport();
        outputChannel.appendLine(`\n💰 Cost Report:\n${costReport}`);
        
        vscode.window.showInformationMessage('Autopilot completed successfully!');
    } catch (error: any) {
        outputChannel.appendLine(`\n❌ Error: ${error.message}\n`);
        vscode.window.showErrorMessage(`Autopilot failed: ${error.message}`);
    }
}

async function runEco() {
    const editor = vscode.window.activeTextEditor;
    const selectedText = editor?.document.getText(editor.selection);
    
    const prompt = await vscode.window.showInputBox({
        prompt: 'Enter your task description (Economy mode)',
        placeHolder: 'e.g., Add logging to this function',
        value: selectedText ? `Improve this code: ${selectedText}` : ''
    });
    
    if (!prompt) {
        return;
    }
    
    try {
        outputChannel.show();
        outputChannel.appendLine(`\n🛡️ Running Economy Mode: ${prompt}\n`);
        
        const omc = await getOmcInstance();
        const result = await omc.eco(prompt);
        
        outputChannel.appendLine(`\n✅ Economy mode completed!\n`);
        outputChannel.appendLine(`Summary: ${result.summary}\n`);
        
        if (result.output) {
            outputChannel.appendLine(`Output:\n${result.output}\n`);
        }
        
        const costReport = omc.getCostReport();
        outputChannel.appendLine(`\n💰 Cost Report:\n${costReport}`);
        
        vscode.window.showInformationMessage('Economy mode completed successfully!');
    } catch (error: any) {
        outputChannel.appendLine(`\n❌ Error: ${error.message}\n`);
        vscode.window.showErrorMessage(`Economy mode failed: ${error.message}`);
    }
}

async function runUltrawork() {
    const tasksInput = await vscode.window.showInputBox({
        prompt: 'Enter tasks (comma-separated)',
        placeHolder: 'e.g., Task 1, Task 2, Task 3'
    });
    
    if (!tasksInput) {
        return;
    }
    
    const tasks = tasksInput.split(',').map(t => t.trim()).filter(t => t);
    
    if (tasks.length === 0) {
        vscode.window.showWarningMessage('No tasks provided');
        return;
    }
    
    try {
        outputChannel.show();
        outputChannel.appendLine(`\n🌊 Running Ultrawork with ${tasks.length} tasks\n`);
        
        const omc = await getOmcInstance();
        const result = await omc.ultra(
            tasks.map(task => ({ title: task, description: task, agent: null })),
            3 // max concurrency
        );
        
        outputChannel.appendLine(`\n✅ Ultrawork completed!\n`);
        outputChannel.appendLine(`Summary: ${result.summary}\n`);
        
        const costReport = omc.getCostReport();
        outputChannel.appendLine(`\n💰 Cost Report:\n${costReport}`);
        
        vscode.window.showInformationMessage('Ultrawork completed successfully!');
    } catch (error: any) {
        outputChannel.appendLine(`\n❌ Error: ${error.message}\n`);
        vscode.window.showErrorMessage(`Ultrawork failed: ${error.message}`);
    }
}

async function runSwarm() {
    const agentCount = await vscode.window.showInputBox({
        prompt: 'Number of agents',
        placeHolder: '3',
        value: '3'
    });
    
    if (!agentCount) {
        return;
    }
    
    const tasksInput = await vscode.window.showInputBox({
        prompt: 'Enter tasks (comma-separated)',
        placeHolder: 'e.g., Task 1, Task 2, Task 3'
    });
    
    if (!tasksInput) {
        return;
    }
    
    const tasks = tasksInput.split(',').map(t => t.trim()).filter(t => t);
    
    try {
        outputChannel.show();
        outputChannel.appendLine(`\n🐝 Running Swarm with ${agentCount} agents\n`);
        
        const omc = await getOmcInstance();
        const swarm = omc.getSwarm();
        const taskPool = omc.getTaskPool();
        
        // Add tasks to pool
        for (const task of tasks) {
            taskPool.createTask({
                title: task,
                description: task,
                priority: 1
            });
        }
        
        outputChannel.appendLine(`Added ${tasks.length} tasks to pool\n`);
        
        // Start swarm
        await swarm.start({ 
            agentCount: parseInt(agentCount),
            stopWhenEmpty: true 
        });
        
        outputChannel.appendLine(`\n✅ Swarm completed!\n`);
        
        const costReport = omc.getCostReport();
        outputChannel.appendLine(`\n💰 Cost Report:\n${costReport}`);
        
        vscode.window.showInformationMessage('Swarm completed successfully!');
    } catch (error: any) {
        outputChannel.appendLine(`\n❌ Error: ${error.message}\n`);
        vscode.window.showErrorMessage(`Swarm failed: ${error.message}`);
    }
}

async function openChat() {
    vscode.commands.executeCommand('ohMyCopilotSidebar.focus');
}

async function configureApiKeys() {
    await vscode.commands.executeCommand('workbench.action.openSettings', 'ohMyCopilot');
}

async function showCosts() {
    if (!omcInstance) {
        vscode.window.showInformationMessage('No costs to show. Run a task first.');
        return;
    }
    
    const costReport = omcInstance.getCostReport();
    outputChannel.show();
    outputChannel.appendLine(`\n💰 Cost Report:\n${costReport}`);
}
