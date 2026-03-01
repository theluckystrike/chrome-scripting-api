/**
 * CSS Injector — Insert/remove CSS in tabs
 */
export class CSSInjector {
    /** Inject CSS string */
    static async inject(tabId: number, css: string): Promise<void> {
        await chrome.scripting.insertCSS({ target: { tabId }, css });
    }

    /** Inject CSS file */
    static async injectFile(tabId: number, file: string): Promise<void> {
        await chrome.scripting.insertCSS({ target: { tabId }, files: [file] });
    }

    /** Remove injected CSS */
    static async remove(tabId: number, css: string): Promise<void> {
        await chrome.scripting.removeCSS({ target: { tabId }, css });
    }

    /** Inject in all frames */
    static async injectAllFrames(tabId: number, css: string): Promise<void> {
        await chrome.scripting.insertCSS({ target: { tabId, allFrames: true }, css });
    }

    /** Dark mode injection */
    static async darkMode(tabId: number): Promise<void> {
        await this.inject(tabId, `html{filter:invert(1) hue-rotate(180deg)!important}img,video{filter:invert(1) hue-rotate(180deg)!important}`);
    }

    /** Hide element by selector */
    static async hide(tabId: number, selector: string): Promise<void> {
        await this.inject(tabId, `${selector}{display:none!important}`);
    }
}
