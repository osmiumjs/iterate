# @osmium/iterate

[![npm version](https://badge.fury.io/js/@osmium%2Fiterate.svg)](https://badge.fury.io/js/@osmium%2Fiterate)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-99.24%25-brightgreen.svg)](../COVERAGE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A powerful, type-safe iteration library for JavaScript and TypeScript

## Quick Links

- 📖 [Full Documentation](../README.md)
- 🚀 [Examples & Use Cases](../EXAMPLES.md)
- 🧪 [Test Coverage Report](../COVERAGE.md)
- 🤝 [Contributing Guide](../CONTRIBUTING.md)
- 📝 [Changelog](../CHANGELOG.md)

## Quick Start

```bash
npm install @osmium/iterate
```

```typescript
import {iterateSync, iterateAsync, iterateParallel} from '@osmium/iterate';

// Synchronous iteration
const doubled = iterateSync([1, 2, 3], (x) => x * 2, []);
// Result: [2, 4, 6]

// Asynchronous iteration
await iterateAsync(urls, async (url) => {
	return await fetch(url).then(r => r.json());
});

// Parallel processing
await iterateParallel(tasks, async (task) => {
	return await processTask(task);
});
```

## Features

- 🔄 **Universal Iteration** - Arrays, objects, sets, maps, strings, numbers
- ⚡ **Async/Sync Support** - Full Promise support
- 🚀 **Parallel Processing** - Built-in concurrency control
- 🎯 **Type Safety** - Complete TypeScript support
- 🛠️ **Advanced Mapping** - Transform data while iterating
- 🎮 **Flow Control** - Break, skip, repeat operations
- 📦 **Zero Dependencies** - Lightweight and self-contained

---

Made with ❤️ by Vasiliy Isaichkin