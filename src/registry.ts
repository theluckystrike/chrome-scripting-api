/**
 * Content Script Registry — Dynamically register/unregister content scripts
 */
export class ContentScriptRegistry {
    /** Register a content script dynamically */
    static async register(id: string, matches: string[], js?: string[], css?: string[], runAt: 'document_start' | 'document_end' | 'document_idle' = 'document_idle'): Promise<void> {
        await chrome.scripting.registerContentScripts([{ id, matches, js, css, runAt }]);
    }

    /** Unregister by ID */
    static async unregister(ids: string[]): Promise<void> {
        await chrome.scripting.unregisterContentScripts({ ids });
    }

    /** Get all registered */
    static async getAll(): Promise<chrome.scripting.RegisteredContentScript[]> {
        return chrome.scripting.getRegisteredContentScripts();
    }

    /** Update a registered script */
    static async update(id: string, changes: { matches?: string[]; js?: string[]; css?: string[] }): Promise<void> {
        await chrome.scripting.updateContentScripts([{ id, ...changes }]);
    }

    /** Toggle a script on/off */
    static async toggle(id: string, matches: string[], js: string[]): Promise<boolean> {
        const scripts = await this.getAll();
        const exists = scripts.find((s) => s.id === id);
        if (exists) { await this.unregister([id]); return false; }
        await this.register(id, matches, js);
        return true;
    }
}
