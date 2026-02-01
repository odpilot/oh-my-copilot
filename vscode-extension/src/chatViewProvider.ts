import * as vscode from 'vscode';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'sendMessage':
                    this.handleMessage(data.message, webviewView.webview);
                    break;
            }
        });
    }

    private async handleMessage(message: string, webview: vscode.Webview) {
        // Send acknowledgment
        webview.postMessage({ 
            type: 'response', 
            message: `Received: ${message}. This is a placeholder response. The full chat integration will be implemented in a future update.`
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Oh My Copilot Chat</title>
            <style>
                body {
                    padding: 10px;
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                }
                #chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                #messages {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 10px;
                    padding: 10px;
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 4px;
                }
                .message {
                    margin-bottom: 10px;
                    padding: 8px;
                    border-radius: 4px;
                }
                .user-message {
                    background-color: var(--vscode-editor-selectionBackground);
                    text-align: right;
                }
                .bot-message {
                    background-color: var(--vscode-editor-inactiveSelectionBackground);
                }
                #input-container {
                    display: flex;
                    gap: 5px;
                }
                #message-input {
                    flex: 1;
                    padding: 8px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 4px;
                }
                button {
                    padding: 8px 16px;
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background: var(--vscode-button-hoverBackground);
                }
            </style>
        </head>
        <body>
            <div id="chat-container">
                <div id="messages"></div>
                <div id="input-container">
                    <input type="text" id="message-input" placeholder="Ask Oh My Copilot...">
                    <button id="send-button">Send</button>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                const messagesDiv = document.getElementById('messages');
                const input = document.getElementById('message-input');
                const sendButton = document.getElementById('send-button');
                
                function addMessage(message, isUser) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message ' + (isUser ? 'user-message' : 'bot-message');
                    messageDiv.textContent = message;
                    messagesDiv.appendChild(messageDiv);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }
                
                function sendMessage() {
                    const message = input.value.trim();
                    if (!message) return;
                    
                    addMessage(message, true);
                    vscode.postMessage({ type: 'sendMessage', message: message });
                    input.value = '';
                }
                
                sendButton.addEventListener('click', sendMessage);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
                
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.type === 'response') {
                        addMessage(message.message, false);
                    }
                });
            </script>
        </body>
        </html>`;
    }
}
