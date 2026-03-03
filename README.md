# chrome-scripting-api

Script injection API wrapper for Chrome extensions.

## Installation

```bash
npm install chrome-scripting-api
```

## Usage

```javascript
import { Scripting } from 'chrome-scripting-api';

await Scripting.executeScript(tabId, 'alert("hello")');
```

## License

MIT
