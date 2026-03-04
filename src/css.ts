/**
 * CSS Injector — Insert/remove CSS in tabs with error handling
 */

export class CSSInjectorError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'CSSInjectorError';
        if (originalError && originalError.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const CSSInjectorErrorCode = {
    SCRIPTING_API_ERROR: 'SCRIPTING_API_ERROR',
    INVALID_TAB_ID: 'INVALID_TAB_ID',
    INVALID_CSS: 'INVALID_CSS',
    INVALID_FILE: 'INVALID_FILE',
} as const;

/**
 * CSS Injector — Insert/remove CSS in tabs with proper error handling
 */
export class CSSInjector {
    /** Inject CSS string */
    static async inject(tabId: number, css: string): Promise<void> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new CSSInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                CSSInjectorErrorCode.INVALID_TAB_ID,
                'inject'
            );
        }
        
        if (!css || typeof css !== 'string') {
            throw new CSSInjectorError(
                `Invalid CSS: must be a non-empty string. Received: ${typeof css}`,
                CSSInjectorErrorCode.INVALID_CSS,
                'inject'
            );
        }
        
        try {
            await chrome.scripting.insertCSS({ target: { tabId }, css });
        } catch (error) {
            if ((error as Error).message?.includes('No tab with id')) {
                throw new CSSInjectorError(
                    `Tab not found: No tab with ID ${tabId}. The tab may have been closed.`,
                    CSSInjectorErrorCode.INVALID_TAB_ID,
                    'inject',
                    error as Error
                );
            }
            throw new CSSInjectorError(
                `Failed to inject CSS in tab ${tabId}: ${(error as Error).message}. ` +
                'Make sure you have the "scripting" permission.',
                CSSInjectorErrorCode.SCRIPTING_API_ERROR,
                'inject',
                error as Error
            );
        }
    }

    /** Inject CSS file */
    static async injectFile(tabId: number, file: string): Promise<void> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new CSSInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                CSSInjectorErrorCode.INVALID_TAB_ID,
                'injectFile'
            );
        }
        
        if (!file || typeof file !== 'string') {
            throw new CSSInjectorError(
                `Invalid file path: must be a non-empty string. Received: ${typeof file}`,
                CSSInjectorErrorCode.INVALID_FILE,
                'injectFile'
            );
        }
        
        try {
            await chrome.scripting.insertCSS({ target: { tabId }, files: [file] });
        } catch (error) {
            if ((error as Error).message?.includes('No tab with id')) {
                throw new CSSInjectorError(
                    `Tab not found: No tab with ID ${tabId}. The tab may have been closed.`,
                    CSSInjectorErrorCode.INVALID_TAB_ID,
                    'injectFile',
                    error as Error
                );
            }
            throw new CSSInjectorError(
                `Failed to inject CSS file "${file}" in tab ${tabId}: ${(error as Error).message}. ` +
                'Make sure the file path is correct and you have the "scripting" permission.',
                CSSInjectorErrorCode.SCRIPTING_API_ERROR,
                'injectFile',
                error as Error
            );
        }
    }

    /** Remove injected CSS */
    static async remove(tabId: number, css: string): Promise<void> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new CSSInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                CSSInjectorErrorCode.INVALID_TAB_ID,
                'remove'
            );
        }
        
        if (!css || typeof css !== 'string') {
            throw new CSSInjectorError(
                `Invalid CSS: must be a non-empty string. Received: ${typeof css}`,
                CSSInjectorErrorCode.INVALID_CSS,
                'remove'
            );
        }
        
        try {
            await chrome.scripting.removeCSS({ target: { tabId }, css });
        } catch (error) {
            if ((error as Error).message?.includes('No tab with id')) {
                throw new CSSInjectorError(
                    `Tab not found: No tab with ID ${tabId}. The tab may have been closed.`,
                    CSSInjectorErrorCode.INVALID_TAB_ID,
                    'remove',
                    error as Error
                );
            }
            throw new CSSInjectorError(
                `Failed to remove CSS from tab ${tabId}: ${(error as Error).message}. ` +
                'Make sure you have the "scripting" permission.',
                CSSInjectorErrorCode.SCRIPTING_API_ERROR,
                'remove',
                error as Error
            );
        }
    }

    /** Inject in all frames */
    static async injectAllFrames(tabId: number, css: string): Promise<void> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new CSSInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                CSSInjectorErrorCode.INVALID_TAB_ID,
                'injectAllFrames'
            );
        }
        
        if (!css || typeof css !== 'string') {
            throw new CSSInjectorError(
                `Invalid CSS: must be a non-empty string. Received: ${typeof css}`,
                CSSInjectorErrorCode.INVALID_CSS,
                'injectAllFrames'
            );
        }
        
        try {
            await chrome.scripting.insertCSS({ target: { tabId, allFrames: true }, css });
        } catch (error) {
            if ((error as Error).message?.includes('No tab with id')) {
                throw new CSSInjectorError(
                    `Tab not found: No tab with ID ${tabId}. The tab may have been closed.`,
                    CSSInjectorErrorCode.INVALID_TAB_ID,
                    'injectAllFrames',
                    error as Error
                );
            }
            throw new CSSInjectorError(
                `Failed to inject CSS in all frames: ${(error as Error).message}. ` +
                'Make sure you have the "scripting" permission.',
                CSSInjectorErrorCode.SCRIPTING_API_ERROR,
                'injectAllFrames',
                error as Error
            );
        }
    }

    /** Dark mode injection */
    static async darkMode(tabId: number): Promise<void> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new CSSInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                CSSInjectorErrorCode.INVALID_TAB_ID,
                'darkMode'
            );
        }
        
        try {
            await this.inject(tabId, `html{filter:invert(1) hue-rotate(180deg)!important}img,video{filter:invert(1) hue-rotate(180deg)!important}`);
        } catch (error) {
            if (error instanceof CSSInjectorError) throw error;
            throw new CSSInjectorError(
                `Failed to apply dark mode: ${(error as Error).message}`,
                CSSInjectorErrorCode.SCRIPTING_API_ERROR,
                'darkMode',
                error as Error
            );
        }
    }

    /** Hide element by selector */
    static async hide(tabId: number, selector: string): Promise<void> {
        if (typeof tabId !== 'number' || tabId <= 0) {
            throw new CSSInjectorError(
                `Invalid tab ID: must be a positive number. Received: ${tabId}`,
                CSSInjectorErrorCode.INVALID_TAB_ID,
                'hide'
            );
        }
        
        if (!selector || typeof selector !== 'string') {
            throw new CSSInjectorError(
                `Invalid selector: must be a non-empty string. Received: ${typeof selector}`,
                CSSInjectorErrorCode.INVALID_CSS,
                'hide'
            );
        }
        
        try {
            await this.inject(tabId, `${selector}{display:none!important}`);
        } catch (error) {
            if (error instanceof CSSInjectorError) throw error;
            throw new CSSInjectorError(
                `Failed to hide element "${selector}": ${(error as Error).message}`,
                CSSInjectorErrorCode.SCRIPTING_API_ERROR,
                'hide',
                error as Error
            );
        }
    }
}
