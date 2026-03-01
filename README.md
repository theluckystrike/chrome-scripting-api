# chrome-scripting-api — Scripting API Wrapper for MV3

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Built by [Zovo](https://zovo.one)**

**Chrome Scripting API wrapper** — inject JS/CSS, execute functions in tabs, dynamic content script registration, dark mode injection, element hiding.

## 🚀 Quick Start
```typescript
import { ScriptInjector, CSSInjector, ContentScriptRegistry } from 'chrome-scripting-api';
const title = await ScriptInjector.getPageTitle(tabId);
await CSSInjector.darkMode(tabId);
await ContentScriptRegistry.register('my-script', ['*://*.example.com/*'], ['content.js']);
```

## 📄 License
MIT — [Zovo](https://zovo.one)
