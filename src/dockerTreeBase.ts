import * as vscode from "vscode";
import { Utility } from "./utility";

export class DockerTreeBase<T> {
    protected static isErrorMessageShown = false;
    public _onDidChangeTreeData: vscode.EventEmitter<T | undefined> = new vscode.EventEmitter<T | undefined>();
    public readonly onDidChangeTreeData: vscode.Event<T | undefined> = this._onDidChangeTreeData.event;
    private _debounceTimer: NodeJS.Timeout;

    constructor(protected context: vscode.ExtensionContext) {
    }

    public refreshDockerTree(): void {
        DockerTreeBase.isErrorMessageShown = false;
        this._onDidChangeTreeData.fire( undefined );
    }

    protected setAutoRefresh(cachedItemStrings: string[], getItemStringsCallback: () => string[]): void {
        const interval = Utility.getConfiguration().get<number>("autoRefreshInterval");
        if (interval > 0) {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = setInterval(() => {
                try {
                    const itemStrings = getItemStringsCallback();
                    if (!Utility.isArrayEqual(itemStrings, cachedItemStrings)) {
                        this._onDidChangeTreeData.fire( undefined);
                    }
                } catch (e) { }
            }, interval);
        }
    }
}
