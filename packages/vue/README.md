# @straylightagency/storage

A lightweight JavaScript utility to simplify working with the browser's `localStorage` and `sessionStorage`.

It provides automatic serialization and deserialization of common JavaScript data types, along with simple helper functions for accessing stored values through a Proxy or Vue.js composables.

## Features

- Native ES modules and no external dependencies.
- Simple API for `localStorage` and `sessionStorage`.
- Automatic serialization and deserialization of common JavaScript data types.
- Support for strings, numbers, booleans, dates, regular expressions, objects, and arrays.
- Optional initial values when retrieving stored data.
- Proxy-based accessors for Vanilla JavaScript applications.
- Dedicated Vue.js integration through `@straylightagency/storage-vue`.

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Storage instances](#storage-instances)
- [Supported data types](#supported-data-types)
- [Default values](#default-values)
- [Proxy-based access](#proxy-based-access)
- [Vue.js integration](#vuejs-integration)
- [API reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install @straylightagency/storage
```

## Quick start

Import the storage instances and start storing values:

```js
import { localStorage, sessionStorage } from '@straylightagency/storage';

// Store values
localStorage.set('user', { name: 'John', age: 30 });
sessionStorage.set('token', 'my-token');

// Retrieve values
const user = localStorage.get('user');
const token = sessionStorage.get('token');

// Check if a key exists
if (localStorage.has('user')) {
    console.log(user);
}

// Remove values
localStorage.remove('user');
```

## Storage instances

The package exposes two storage instances:

| Instance | Description |
|---|---|
| `localStorage` | Persists data across browser sessions. |
| `sessionStorage` | Persists data for the duration of the browser session. |

Both instances expose the same methods:

| Method | Parameters | Description |
|---|---|---|
| `get(key, initial?)` | Storage key and optional fallback value. | Retrieves a stored value. |
| `set(key, value)` | Storage key and value. | Stores a value. |
| `has(key)` | Storage key. | Checks whether a key exists. |
| `remove(key)` | Storage key. | Removes a stored value. |

## Supported data types

Values are automatically serialized when stored and deserialized when retrieved.

The following types are supported:

| Type | Example |
|---|---|
| String | `'Hello world'` |
| Number | `42` |
| Boolean | `true` |
| Date | `new Date()` |
| RegExp | `/pattern/` |
| Object | `{ name: 'John' }` |
| Array | `[1, 2, 3]` |

Objects and arrays are serialized using JSON.

Functions are stored as their source code string and returned as strings when retrieved. They are not automatically reconstructed as executable functions.

## Default values

Both `get()` and the helper functions accept an optional initial value.

```js
const user = localStorage.get('user', { name: 'Guest' });
```

If the requested key does not exist, the provided initial value is returned.

When no initial value is provided, `undefined` is returned.

## Proxy-based access

For Vanilla JavaScript applications, the package provides `fromLocalStorage()` and `fromSessionStorage()`.

These helpers return an array containing:

1. A read-only Proxy exposing the stored value through its `.value` property.
2. A setter function.
3. A remove function.

### Local storage

```js
import { fromLocalStorage } from '@straylightagency/storage';

const [user, setUser, removeUser] = fromLocalStorage('user', null);

// Read the current value
console.log(user.value);

// Update the value
setUser({ name: 'John', age: 30 });

// Remove the value
removeUser();
```

### Session storage

```js
import { fromSessionStorage } from '@straylightagency/storage';

const [token, setToken, removeToken] = fromSessionStorage('token');

// Read the current value
console.log(token.value);

// Update the value
setToken('my-token');

// Remove the value
removeToken();
```

The Proxy reads directly from the underlying storage whenever `.value` is accessed. This means it always returns the latest stored value, even if it was modified elsewhere.

The Proxy is read-only. Use the provided setter function to update the stored value.

## Vue.js integration

For Vue.js applications, use the dedicated [`@straylightagency/storage-vue`](https://www.npmjs.com/package/@straylightagency/storage-vue) package.

It provides composables that integrate the storage API with Vue's reactivity system.

### Installation

```bash
npm install @straylightagency/storage-vue
```

### useLocalStorage()

```js
import { useLocalStorage } from '@straylightagency/storage-vue';

const [user, setUser, removeUser] = useLocalStorage('user', null);

// Read the current value
console.log(user.value);

// Update the value
setUser({ name: 'John', age: 30 });

// Remove the value
removeUser();
```

### useSessionStorage()

```js
import { useSessionStorage } from '@straylightagency/storage-vue';

const [token, setToken, removeToken] = useSessionStorage('token');

// Read the current value
console.log(token.value);

// Update the value
setToken('my-token');

// Remove the value
removeToken();
```

Both composables return an array containing:

1. A readonly Vue `ref` containing the stored value.
2. A setter function.
3. A remove function.

The returned ref is reactive and can be used directly in Vue components and templates.

### Vue component example

```vue
<script setup>
import { useLocalStorage } from '@straylightagency/storage-vue';

const [theme, setTheme] = useLocalStorage('theme', 'light');
</script>

<template>
    <div>
        <p>Current theme: {{ theme }}</p>

        <button @click="setTheme('light')">
            Light
        </button>

        <button @click="setTheme('dark')">
            Dark
        </button>
    </div>
</template>
```

**Note:** The composables initialize their refs from the stored value when called. Changes made directly to the underlying storage outside the composable are not automatically reflected in the ref.

## API reference

### Vanilla JavaScript

| Function | Parameters | Description |
|---|---|---|
| `fromLocalStorage(key, initial?)` | Storage key and optional initial value. | Creates a Proxy-based local storage accessor. |
| `fromSessionStorage(key, initial?)` | Storage key and optional initial value. | Creates a Proxy-based session storage accessor. |

### Vue.js

| Function | Parameters | Description |
|---|---|---|
| `useLocalStorage(key, initial?)` | Storage key and optional initial value. | Creates a reactive local storage accessor. |
| `useSessionStorage(key, initial?)` | Storage key and optional initial value. | Creates a reactive session storage accessor. |

### Storage methods

| Method | Parameters | Description |
|---|---|---|
| `get(key, initial?)` | Storage key and optional fallback. | Retrieves a stored value. |
| `set(key, value)` | Storage key and value. | Stores a value. |
| `has(key)` | Storage key. | Checks whether a key exists. |
| `remove(key)` | Storage key. | Removes a stored value. |

## Contributing

Contributions, bug reports, and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the affected storage behavior in a browser.
5. Submit a pull request.

Repository: https://github.com/straylightagency/js-storage

Report issues: https://github.com/straylightagency/js-storage/issues

## License

`@straylightagency/storage` is released under the MIT License.

See the [LICENSE](LICENSE) file for details.