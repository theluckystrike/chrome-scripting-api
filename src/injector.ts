/**
 * Script Injector — Execute scripts in tabs via chrome.scripting
 */

export class ScriptInjectorError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'ScriptInjectorError';
        if (originalError && originalError.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const ScriptInjectorErrorCode = {
    SCRIPTING_API_ERROR: 'SCRIPTING_API_ERROR',
    INVALID_TAB_ID: 'INVALID_TAB_ID',
    TABS_API_ERROR: 'TABS_API_ERROR',
    NO_ACTIVE_TAB: 'NO_ACTIVE_TAB',
    SCRIPT_EXECUTION_FAILED: 'SCRIPT_EXECUTION_FAILED',
} as const;

/**
 * Script Injector — Execute scripts in tabs via chrome.scripting with proper error handling
 */
export class ScriptInjector {
    /** Execute a function in a tab */
    static async executeFunction<T>(tabId: number, fn: (...args: unknown[]) => T, args?: unknown[]): Promise<T | undefined> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new ScriptInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                ScriptInjectorErrorCode.INVALID_TAB_ID,
                'executeFunction'
            );
        }
        
        if (typeof fn !== 'function') {
            throw new ScriptInjectorError(
                `Invalid function: must be a function. Received: ${typeof fn}`,
                ScriptInjectorErrorCode.SCRIPT_EXECUTION_FAILED,
                'executeFunction'
            );
        }
        
        try {
            const results = await chrome.scripting.executeScript({ 
                target: { tabId }, 
                func: fn, 
                args: args || [] 
            });
            return results?.[0]?.result as T | undefined;
        } catch (error) {
            if ((error as Error).message?.includes('No tab with id')) {
                throw new ScriptInjectorError(
                    `Tab not found: No tab with ID ${tabId}. The tab may have been closed.`,
                    ScriptInjectorErrorCode.INVALID_TAB_ID,
                    'executeFunction',
                    error as Error
                );
            }
            throw new ScriptInjectorError(
                `Failed to execute script in tab ${tabId}: ${(error as Error).message}. ` +
                'Make sure you have the "scripting" permission and the tab is accessible.',
                ScriptInjectorErrorCode.SCRIPTING_API_ERROR,
                'executeFunction',
                error as Error
            );
        }
    }

    /** Execute in all frames */
    static async executeInAllFrames<T>(tabId: number, fn: (...args: unknown[]) => T): Promise<T[]> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new ScriptInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                ScriptInjectorErrorCode.INVALID_TAB_ID,
                'executeInAllFrames'
            );
        }
        
        if (typeof fn !== 'function') {
            throw new ScriptInjectorError(
                `Invalid function: must be a function. Received: ${typeof fn}`,
                ScriptInjectorErrorCode.SCRIPT_EXECUTION_FAILED,
                'executeInAllFrames'
            );
        }
        
        try {
            const results = await chrome.scripting.executeScript({ 
                target: { tabId, allFrames: true }, 
                func: fn 
            });
            return results.map((r) => r.result as T);
        } catch (error) {
            if ((error as Error).message?.includes('No tab with id')) {
                throw new ScriptInjectorError(
                    `Tab not found: No tab with ID ${tabId}. The tab may have been closed.`,
                    ScriptInjectorErrorCode.INVALID_TAB_ID,
                    'executeInAllFrames',
                    error as Error
                );
            }
            throw new ScriptInjectorError(
                `Failed to execute script in all frames: ${(error as Error).message}. ` +
                'Make sure you have the "scripting" permission.',
                ScriptInjectorErrorCode.SCRIPTING_API_ERROR,
                'executeInAllFrames',
                error as Error
            );
        }
    }

    /** Execute a file */
    static async executeFile(tabId: number, file: string): Promise<void> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new ScriptInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                ScriptInjectorErrorCode.INVALID_TAB_ID,
                'executeFile'
            );
        }
        
        if (!file || typeof file !== 'string') {
            throw new ScriptInjectorError(
                `Invalid file path: must be a non-empty string. Received: ${typeof file}`,
                ScriptInjectorErrorCode.SCRIPT_EXECUTION_FAILED,
                'executeFile'
            );
        }
        
        try {
            await chrome.scripting.executeScript({ 
                target: { tabId }, 
                files: [file] 
            });
        } catch (error) {
            if ((error as Error).message?.includes('No tab with id')) {
                throw new ScriptInjectorError(
                    `Tab not found: No tab with ID ${tabId}. The tab may have been closed.`,
                    ScriptInjectorErrorCode.INVALID_TAB_ID,
                    'executeFile',
                    error as Error
                );
            }
            throw new ScriptInjectorError(
                `Failed to execute script file "${file}" in tab ${tabId}: ${(error as Error).message}. ` +
                'Make sure the file path is correct and you have the "scripting" permission.',
                ScriptInjectorErrorCode.SCRIPTING_API_ERROR,
                'executeFile',
                error as Error
            );
        }
    }

    /** Execute in multiple tabs */
    static async executeInTabs<T>(tabIds: number[], fn: (...args: unknown[]) => T): Promise<Map<number, T | { error: string }>> {
        if (!Array.isArray(tabIds) || tabIds.length === 0) {
            throw new ScriptInjectorError(
                `Invalid tab IDs: must be a non-empty array. Received: ${tabIds}`,
                ScriptInjectorErrorCode.INVALID_TAB_ID,
                'executeInTabs'
            );
        }
        
        if (typeof fn !== 'function') {
            throw new ScriptInjectorError(
                `Invalid function: must be a function. Received: ${typeof fn}`,
                ScriptInjectorErrorCode.SCRIPT_EXECUTION_FAILED,
                'executeInTabs'
            );
        }
        
        const results = new Map<number, T | { error: string }>();
        
        for (const tabId of tabIds) {
            if (typeof tabId !== 'number' || tabId <= 0) {
                results.set(tabId, { error: `Invalid tab ID: ${tabId}` } as any);
                continue;
            }
            
            try {
                const r = await this.executeFunction(tabId, fn);
                if (r !== undefined) {
                    results.set(tabId, r);
                }
            } catch (error) {
                results.set(tabId, { error: (error as Error).message } as any);
            }
        }
        
        return results;
    }

    /** Execute in active tab */
    static async executeInActiveTab<T>(fn: (...args: unknown[]) => T): Promise<T | undefined> {
        if (typeof fn !== 'function') {
            throw new ScriptInjectorError(
                `Invalid function: must be a function. Received: ${typeof fn}`,
                ScriptInjectorErrorCode.SCRIPT_EXECUTION_FAILED,
                'executeInActiveTab'
            );
        }
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.id) {
                throw new ScriptInjectorError(
                    'No active tab found. Make sure you are running in a tab context.',
                    ScriptInjectorErrorCode.NO_ACTIVE_TAB,
                    'executeInActiveTab'
                );
            }
            return this.executeFunction(tab.id, fn);
        } catch (error) {
            if (error instanceof ScriptInjectorError) throw error;
            throw new ScriptInjectorError(
                `Failed to get active tab: ${(error as Error).message}. ` +
                'Make sure you have the "tabs" permission.',
                ScriptInjectorErrorCode.TABS_API_ERROR,
                'executeInActiveTab',
                error as Error
            );
        }
    }

    /** Get page title from tab */
    static async getPageTitle(tabId: number): Promise<string> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new ScriptInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                ScriptInjectorErrorCode.INVALID_TAB_ID,
                'getPageTitle'
            );
        }
        
        try {
            return (await this.executeFunction(tabId, () => document.title)) || '';
        } catch (error) {
            if (error instanceof ScriptInjectorError) throw error;
            throw new ScriptInjectorError(
                `Failed to get page title: ${(error as Error).message}`,
                ScriptInjectorErrorCode.SCRIPTING_API_ERROR,
                'getPageTitle',
                error as Error
            );
        }
    }

    /** Get page text content */
    static async getPageText(tabId: number): Promise<string> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new ScriptInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                ScriptInjectorErrorCode.INVALID_TAB_ID,
                'getPageText'
            );
        }
        
        try {
            return (await this.executeFunction(tabId, () => document.body?.innerText || '')) || '';
        } catch (error) {
            if (error instanceof ScriptInjectorError) throw error;
            throw new ScriptInjectorError(
                `Failed to get page text: ${(error as Error).message}`,
                ScriptInjectorErrorCode.SCRIPTING_API_ERROR,
                'getPageText',
                error as Error
            );
        }
    }
}
