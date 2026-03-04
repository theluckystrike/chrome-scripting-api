# chrome-scripting-api

[![npm version](https://img.shields.io/npm/v/chrome-scripting-api)](https://npmjs.com/package/chrome-scripting-api)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/chrome-scripting-api/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/chrome-scripting-api/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-scripting-api?style=social)](https://github.com/theluckystrike/chrome-scripting-api)

> Script injection API wrapper for Chrome extensions — execute scripts, insert CSS, and manage content scripts with type safety.

**chrome-scripting-api** provides a clean TypeScript wrapper around Chrome's scripting API for executing scripts, inserting CSS, and managing content scripts in extensions.

Part of the [Zovo](https://zovo.one) developer tools family.

## Features

- ✅ **Script Execution** - Execute JavaScript in pages
- ✅ **CSS Injection** - Insert stylesheets into pages
- ✅ **Content Script Management** - Register and manage content scripts
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **MV3 Compatible** - Works with Manifest V3 extensions

## Installation

```bash
npm install chrome-scripting-api
```

## Quick Start

```typescript
import { Scripting } from 'chrome-scripting-api';

// Execute a script
await Scripting.executeScript(tabId, 'alert("hello")');

// Execute with function
await Scripting.executeScript(tabId, () => {
  document.body.style.backgroundColor = 'red';
});
```

## Usage Examples

### Execute JavaScript

```typescript
import { Scripting } from 'chrome-scripting-api';

// Execute a script string
await Scripting.executeScript(tabId, 'alert("hello")');

// Execute with function
await Scripting.executeScript(tabId, () => {
  document.body.style.backgroundColor = 'red';
});

// Execute with parameters
await Scripting.executeScript(tabId, (params: { color: string }) => {
  document.body.style.backgroundColor = params.color;
}, { color: 'blue' });
```

### Insert CSS

```typescript
import { Scripting } from 'chrome-scripting-api';

// Insert CSS
await Scripting.insertCSS(tabId, 'body { font-size: 18px; }');

// Insert from file
await Scripting.insertCSS(tabId, { file: 'styles.css' });
```

### Remove CSS

```typescript
import { Scripting } from 'chrome-scripting-api';

// Remove inserted CSS
await Scripting.removeCSS(tabId, 'body { font-size: 18px; }');
```

## API

### Methods

| Method | Description |
|--------|-------------|
| `executeScript(tabId, script)` | Execute JavaScript in a tab |
| `insertCSS(tabId, css)` | Insert CSS into a tab |
| `removeCSS(tabId, css)` | Remove inserted CSS |

### Options

| Option | Type | Description |
|--------|------|-------------|
| `tabId` | number | Target tab ID |
| `script` | string \| function | Script to execute |
| `css` | string | CSS to insert |

## Manifest

```json
{
  "permissions": ["scripting", "tabs"]
}
```

## Browser Support

- Chrome 88+ (MV3)
- Manifest V3

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/scripting-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/scripting-feature`
7. **Submit** a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/theluckystrike/chrome-scripting-api.git
cd chrome-scripting-api

# Install dependencies
npm install

# Build
npm run build
```

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage wrapper
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Extension template

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
