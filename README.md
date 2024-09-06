# hide-secret-plugin-ts
[![Coverage Status](https://coveralls.io/repos/github/KostinKD/hide-secret-plugin-ts/badge.svg?branch=master)](https://coveralls.io/github/KostinKD/hide-secret-plugin-ts?branch=master)


Sure! Here’s a simple README documentation based on the provided code. 📜

---

# Sensitive Word Redactor

This module provides functionality to redact sensitive words from JavaScript objects. It allows for configuration options that dictate how and when redaction occurs.

## Features

- Redact specified sensitive words from the keys of an object.
- Two modes of operation: **strict** (exact match) and **prefix** (based on custom prefixes).
- Optional redaction of string values or all values associated with sensitive keys.
- Customize the replacement string for redacted values.

## Installation

To install the module, add it to your project via npm:

```bash
npm install hide-secret-plugin-ts
```

## Usage

### Import the Module

```javascript
import redactSensitiveWords from 'hide-secret-plugin-ts';
```

### Redact Sensitive Words

Use the `redactSensitiveWords` function to redact sensitive words from an object.

#### Parameters

- `obj` (MyObjectType): The object from which you want to redact sensitive words.
- `opts` (Options): Configuration options for redaction.

#### Options Interface

```typescript
interface Options {
  badWords?: string[];
  mode: 'strict' | 'prefix';
  onlyStringReplace?: boolean;
  replacement?: string;
  customPrefix?: string[];
}
```

##### Options Explained

- **badWords**: An array of sensitive words to be redacted. Defaults to:
  ```javascript
  ['password', 'pass', 'token', 'auth', 'secret', 'secret_key', 'secret_api', 'passphrase', 'card']
  ```

- **mode**: Redaction mode. Choose between:
    - `'strict'`: Redacts exact key matches.
    - `'prefix'`: Redacts keys that start with specified prefixes.

- **onlyStringReplace**: If set to `true`, only redacts string values. Default is `true`.

- **replacement**: The string that will replace redacted content. Default is `'[SECRET]'`.

- **customPrefix**: ONLY IN PREFIX MODE. An array of custom prefixes to match for redaction in prefix mode. Must not be empty.

#### Example (PREFIX)

```javascript
const exampleObj = {
  username: 'user1',
  password: 'mypassword',
  api_key: 'my_api_key',
};

const options = {
  mode: 'prefix',
  customPrefix: ['api_'],
  replacement: '[REDACTED]',
};

const redactedObj = redactSensitiveWords(exampleObj, options);

console.log(redactedObj);
// Output: { username: 'user1', password: 'mypassword', api_key: '[REDACTED]' }
```
#### Example (STRICT)

```javascript
const exampleObj = {
  password: '123456',
  pass: 123456,
  passport: '123',
  hello: { nopass: '123', password: '123', secret_api: '123' }
};

const options = {
  mode: 'strict',
  replacement: '***',
  badWords: ['passport', 'secret_api', 'pass']
};

const redactedObj = redactSensitiveWords(exampleObj, options);

console.log(redactedObj);
// Output: password: '123456', pass: 123456, passport: '***', hello: { nopass: '123', password: '123', secret_api: '***' }
```

### Error Handling

If using `'prefix'` mode, make sure to provide a non-empty array for `customPrefix`. An empty prefix will throw an error:

```text
Custom prefix must be provided when using mode "prefix" and cannot be an empty string
```

## Notes

- The replacement process will only affect string values unless `onlyStringReplace` is set to `false` in order to replace all values associated with sensitive keys.
- The module traverses nested objects; sensitive words can be redacted from any level of the object.

[//]: # (## License)

[//]: # ()
[//]: # (This project is licensed under the MIT License - see the [LICENSE]&#40;LICENSE&#41; file for details.)

[//]: # ()
[//]: # (---)

[//]: # (Feel free to adjust any sections to better suit your project’s branding or specific use cases! 😊)
