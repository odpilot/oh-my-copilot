import * as vscode from 'vscode';

export class CostsViewProvider implements vscode.TreeDataProvider<CostItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CostItem | undefined | null | void> = new vscode.EventEmitter<CostItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CostItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CostItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CostItem): Thenable<CostItem[]> {
        if (!element) {
            // Root level
            return Promise.resolve([
                new CostItem('Total Cost', '$0.00', vscode.TreeItemCollapsibleState.None),
                new CostItem('Total Tokens', '0', vscode.TreeItemCollapsibleState.None),
                new CostItem('Total Requests', '0', vscode.TreeItemCollapsibleState.None)
            ]);
        }
        return Promise.resolve([]);
    }
}

class CostItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly value: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.description = value;
        this.tooltip = `${label}: ${value}`;
    }
}
