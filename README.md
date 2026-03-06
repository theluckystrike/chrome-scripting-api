# chrome-scripting-api

[![npm version](https://img.shields.io/npm/v/chrome-scripting-api)](https://npmjs.com/package/chrome-scripting-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

Chrome Scripting API wrapper for Manifest V3. Inject scripts, CSS, execute functions, and register content scripts dynamically. Zero dependencies. Written in TypeScript with full type safety.

INSTALL

```bash
npm install chrome-scripting-api
```

Your manifest.json needs the scripting permission and host_permissions for the tabs you want to target.

```json
{
  "permissions": ["scripting", "activeTab"],
  "host_permissions": ["<all_urls>"]
}
```

USAGE

```js
import { ScriptInjector, CSSInjector, ContentScriptRegistry } from 'chrome-scripting-api';
```

SCRIPTINJECTOR

Execute functions, files, and scripts inside browser tabs.

All methods are static and async.

ScriptInjector.executeFunction(tabId, fn, args?)
Runs a function inside a tab. Returns the function's return value. Pass serializable arguments via the optional args array.

```js
const title = await ScriptInjector.executeFunction(tabId, () => document.title);

const text = await ScriptInjector.executeFunction(tabId, (sel) => {
  return document.querySelector(sel)?.textContent;
}, ['.main-content']);
```

ScriptInjector.executeInActiveTab(fn)
Queries the current active tab automatically and runs the function there. Requires the tabs permission.

```js
const url = await ScriptInjector.executeInActiveTab(() => location.href);
```

ScriptInjector.executeFile(tabId, file)
Injects a bundled script file into the tab.

```js
await ScriptInjector.executeFile(tabId, 'scripts/content.js');
```

ScriptInjector.executeInAllFrames(tabId, fn)
Runs a function in every frame of a tab. Returns an array of results, one per frame.

```js
const titles = await ScriptInjector.executeInAllFrames(tabId, () => document.title);
```

ScriptInjector.executeInTabs(tabIds, fn)
Runs a function across multiple tabs. Returns a Map keyed by tab ID. Entries are either the result value or an object with an error string if that tab failed.

```js
const results = await ScriptInjector.executeInTabs([1, 2, 3], () => location.href);
```

ScriptInjector.getPageTitle(tabId)
Convenience method. Returns the document title of the given tab.

ScriptInjector.getPageText(tabId)
Convenience method. Returns the body innerText of the given tab.

CSSINJECTOR

Insert and remove CSS in tabs.

All methods are static and async.

CSSInjector.inject(tabId, css)
Injects a CSS string into a tab.

```js
await CSSInjector.inject(tabId, 'body { background: #1a1a1a; color: #eee; }');
```

CSSInjector.injectFile(tabId, file)
Injects a CSS file from your extension bundle.

```js
await CSSInjector.injectFile(tabId, 'styles/custom.css');
```

CSSInjector.remove(tabId, css)
Removes previously injected CSS. The string must match what was originally injected.

```js
await CSSInjector.remove(tabId, 'body { background: #1a1a1a; color: #eee; }');
```

CSSInjector.injectAllFrames(tabId, css)
Injects CSS into every frame of a tab, including iframes.

CSSInjector.darkMode(tabId)
Applies a quick invert filter to simulate dark mode on any page. Images and videos are re-inverted so they look normal.

```js
await CSSInjector.darkMode(tabId);
```

CSSInjector.hide(tabId, selector)
Hides elements matching a CSS selector with display none.

```js
await CSSInjector.hide(tabId, '.ads, .banner, .popup');
```

CONTENTSCRIPTREGISTRY

Dynamically register and manage content scripts at runtime instead of declaring them statically in the manifest.

All methods are static and async.

ContentScriptRegistry.register(id, matches, js?, css?, runAt?)
Registers a content script. The runAt parameter defaults to document_idle. Accepts optional js and css file arrays.

```js
await ContentScriptRegistry.register(
  'my-script',
  ['https://*.example.com/*'],
  ['content.js'],
  ['styles.css'],
  'document_end'
);
```

ContentScriptRegistry.unregister(ids)
Unregisters content scripts by their IDs.

```js
await ContentScriptRegistry.unregister(['my-script']);
```

ContentScriptRegistry.getAll()
Returns all currently registered content scripts.

ContentScriptRegistry.update(id, changes)
Updates a registered script. Pass an object with optional matches, js, and css arrays.

```js
await ContentScriptRegistry.update('my-script', { matches: ['https://new-site.com/*'] });
```

ContentScriptRegistry.toggle(id, matches, js)
Toggles a content script on or off. Returns true if the script was registered, false if it was unregistered.

```js
const isOn = await ContentScriptRegistry.toggle('my-script', ['*://*/*'], ['inject.js']);
```

ERROR HANDLING

Both ScriptInjector and CSSInjector throw typed errors with structured information.

ScriptInjectorError has properties: message, code, operation, and originalError.

Error codes for ScriptInjector:
- SCRIPTING_API_ERROR - general Chrome Scripting API failure
- INVALID_TAB_ID - tab ID is invalid or the tab no longer exists
- TABS_API_ERROR - failure querying the Tabs API
- NO_ACTIVE_TAB - no active tab found in the current window
- SCRIPT_EXECUTION_FAILED - the function or file could not be executed

CSSInjectorError has the same shape. Its error codes:
- SCRIPTING_API_ERROR - general Chrome Scripting API failure
- INVALID_TAB_ID - tab ID is invalid or the tab no longer exists
- INVALID_CSS - the CSS string was empty or not a string
- INVALID_FILE - the file path was empty or not a string

```js
import { ScriptInjector, ScriptInjectorError } from 'chrome-scripting-api';

try {
  await ScriptInjector.executeFunction(tabId, () => document.title);
} catch (err) {
  if (err instanceof ScriptInjectorError) {
    console.log(err.code);       // e.g. "INVALID_TAB_ID"
    console.log(err.operation);  // e.g. "executeFunction"
  }
}
```

LICENSE

MIT. See LICENSE file.

---

Built at [zovo.one](https://zovo.one)
