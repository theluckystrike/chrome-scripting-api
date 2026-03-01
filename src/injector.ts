/**
 * Script Injector — Execute scripts in tabs via chrome.scripting
 */
export class ScriptInjector {
    /** Execute a function in a tab */
    static async executeFunction<T>(tabId: number, fn: (...args: unknown[]) => T, args?: unknown[]): Promise<T | undefined> {
        const results = await chrome.scripting.executeScript({ target: { tabId }, func: fn, args: args || [] });
        return results?.[0]?.result as T | undefined;
    }

    /** Execute in all frames */
    static async executeInAllFrames<T>(tabId: number, fn: (...args: unknown[]) => T): Promise<T[]> {
        const results = await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, func: fn });
        return results.map((r) => r.result as T);
    }

    /** Execute a file */
    static async executeFile(tabId: number, file: string): Promise<void> {
        await chrome.scripting.executeScript({ target: { tabId }, files: [file] });
    }

    /** Execute in multiple tabs */
    static async executeInTabs<T>(tabIds: number[], fn: (...args: unknown[]) => T): Promise<Map<number, T>> {
        const results = new Map<number, T>();
        for (const tabId of tabIds) {
            try { const r = await this.executeFunction(tabId, fn); if (r !== undefined) results.set(tabId, r); } catch { }
        }
        return results;
    }

    /** Execute in active tab */
    static async executeInActiveTab<T>(fn: (...args: unknown[]) => T): Promise<T | undefined> {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) return undefined;
        return this.executeFunction(tab.id, fn);
    }

    /** Get page title from tab */
    static async getPageTitle(tabId: number): Promise<string> {
        return (await this.executeFunction(tabId, () => document.title)) || '';
    }

    /** Get page text content */
    static async getPageText(tabId: number): Promise<string> {
        return (await this.executeFunction(tabId, () => document.body?.innerText || '')) || '';
    }
}
