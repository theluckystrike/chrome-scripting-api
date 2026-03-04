# chrome-scripting-api

[![npm version](https://img.shields.io/npm/v/chrome-scripting-api)](https://npmjs.com/package/chrome-scripting-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-scripting-api?style=social)](https://github.com/theluckystrike/chrome-scripting-api)

> Chrome Scripting API wrapper for MV3 -- inject scripts, CSS, execute functions, and register content scripts dynamically. Zero dependencies.

Part of the [Zovo](https://zovo.one) developer tools family.

## Install

```bash
npm install chrome-scripting-api
```

## Usage

```js
import { ScriptInjector, CSSInjector, ContentScriptRegistry } from 'chrome-scripting-api';

// Execute a function in a specific tab
const title = await ScriptInjector.executeFunction(tabId, () => document.title);

// Execute in the currently active tab
const text = await ScriptInjector.executeInActiveTab(() => document.body.innerText);

// Execute a script file in a tab
await ScriptInjector.executeFile(tabId, 'scripts/content.js');

// Execute across all frames in a tab
const results = await ScriptInjector.executeInAllFrames(tabId, () => document.title);

// Execute in multiple tabs at once
const resultMap = await ScriptInjector.executeInTabs([1, 2, 3], () => location.href);

// Inject inline CSS
await CSSInjector.inject(tabId, 'body { background: #1a1a1a; color: #eee; }');

// Inject a CSS file
await CSSInjector.injectFile(tabId, 'styles/custom.css');

// Apply dark mode to any page
await CSSInjector.darkMode(tabId);

// Hide elements by selector
await CSSInjector.hide(tabId, '.ads, .banner, .popup');

// Remove previously injected CSS
await CSSInjector.remove(tabId, 'body { background: #1a1a1a; color: #eee; }');

// Dynamically register a content script
await ContentScriptRegistry.register('my-script', ['https://*.example.com/*'], ['content.js']);

// Toggle a content script on/off
const isEnabled = await ContentScriptRegistry.toggle('my-script', ['*://*/*'], ['inject.js']);
```

## API

### `ScriptInjector`

All methods are static and async.

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `executeFunction` | `tabId: number, fn: (...args) => T, args?: unknown[]` | `Promise<T \| undefined>` | Execute a function in a tab |
| `executeInAllFrames` | `tabId: number, fn: (...args) => T` | `Promise<T[]>` | Execute a function in all frames of a tab |
| `executeFile` | `tabId: number, file: string` | `Promise<void>` | Execute a script file in a tab |
| `executeInTabs` | `tabIds: number[], fn: (...args) => T` | `Promise<Map<number, T \| { error: string }>>` | Execute a function in multiple tabs |
| `executeInActiveTab` | `fn: (...args) => T` | `Promise<T \| undefined>` | Execute a function in the currently active tab |
| `getPageTitle` | `tabId: number` | `Promise<string>` | Get the page title from a tab |
| `getPageText` | `tabId: number` | `Promise<string>` | Get the body text content from a tab |

### `CSSInjector`

All methods are static and async.

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `inject` | `tabId: number, css: string` | `Promise<void>` | Inject an inline CSS string into a tab |
| `injectFile` | `tabId: number, file: string` | `Promise<void>` | Inject a CSS file into a tab |
| `remove` | `tabId: number, css: string` | `Promise<void>` | Remove previously injected CSS |
| `injectAllFrames` | `tabId: number, css: string` | `Promise<void>` | Inject CSS into all frames of a tab |
| `darkMode` | `tabId: number` | `Promise<void>` | Apply a dark mode filter to a tab |
| `hide` | `tabId: number, selector: string` | `Promise<void>` | Hide elements matching a CSS selector |

### `ContentScriptRegistry`

All methods are static and async.

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `register` | `id: string, matches: string[], js?: string[], css?: string[], runAt?: 'document_start' \| 'document_end' \| 'document_idle'` | `Promise<void>` | Register a content script dynamically |
| `unregister` | `ids: string[]` | `Promise<void>` | Unregister content scripts by ID |
| `getAll` | none | `Promise<RegisteredContentScript[]>` | Get all registered content scripts |
| `update` | `id: string, changes: { matches?, js?, css? }` | `Promise<void>` | Update a registered content script |
| `toggle` | `id: string, matches: string[], js: string[]` | `Promise<boolean>` | Toggle a script on/off; returns `true` if registered, `false` if unregistered |

### `ScriptInjectorError`

Custom error class thrown by `ScriptInjector` methods.

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `code` | `string` | Error code from `ScriptInjectorErrorCode` |
| `operation` | `string` | The method that threw the error |
| `originalError` | `Error \| undefined` | The underlying Chrome API error |

### `ScriptInjectorErrorCode`

| Code | Description |
|------|-------------|
| `SCRIPTING_API_ERROR` | General Chrome Scripting API error |
| `INVALID_TAB_ID` | Invalid or nonexistent tab ID |
| `TABS_API_ERROR` | Error querying the Tabs API |
| `NO_ACTIVE_TAB` | No active tab found in the current window |
| `SCRIPT_EXECUTION_FAILED` | Script execution failed (invalid function or file) |

### `CSSInjectorError`

Custom error class thrown by `CSSInjector` methods.

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `code` | `string` | Error code from `CSSInjectorErrorCode` |
| `operation` | `string` | The method that threw the error |
| `originalError` | `Error \| undefined` | The underlying Chrome API error |

### `CSSInjectorErrorCode`

| Code | Description |
|------|-------------|
| `SCRIPTING_API_ERROR` | General Chrome Scripting API error |
| `INVALID_TAB_ID` | Invalid or nonexistent tab ID |
| `INVALID_CSS` | Invalid CSS string provided |
| `INVALID_FILE` | Invalid file path provided |

## License

MIT

## See Also

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Production-ready MV3 template
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage wrapper
- [content-script-toolkit](https://github.com/theluckystrike/content-script-toolkit) - Shadow DOM and content script utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built by [Zovo](https://zovo.one)
