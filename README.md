# @osmium/iterate

[![npm version](https://badge.fury.io/js/@osmium%2Fiterate.svg)](https://badge.fury.io/js/@osmium%2Fiterate)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-99.24%25-brightgreen.svg)](./COVERAGE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, type-safe iteration library for JavaScript and TypeScript that provides unified iteration over various data types with advanced mapping, parallel processing, and
control flow features.

## ✨ Features

- 🔄 **Universal Iteration** - Iterate over arrays, objects, sets, maps, strings, numbers, and more
- ⚡ **Async/Sync Support** - Full support for both synchronous and asynchronous operations
- 🚀 **Parallel Processing** - Built-in parallel iteration with configurable limits
- 🎯 **Type Safety** - Full TypeScript support with advanced type inference
- 🛠️ **Advanced Mapping** - Transform data while iterating with various mapping strategies
- 🎮 **Flow Control** - Break, skip, repeat, and shift operations during iteration
- 📦 **Zero Dependencies** - Lightweight and self-contained
- 🧪 **Well Tested** - 99.24% test coverage with 331+ tests

## 📦 Installation

```bash
npm install @osmium/iterate
```

```bash
yarn add @osmium/iterate
```

```bash
pnpm add @osmium/iterate
```

## 🚀 Quick Start

```typescript
import {iterateSync, iterateAsync, iterateParallel} from '@osmium/iterate';

// Synchronous iteration
iterateSync([1, 2, 3], (value, index) => {
	console.log(`Item ${index}: ${value}`);
});

// Asynchronous iteration
await iterateAsync([1, 2, 3], async (value, index) => {
	const result = await processAsync(value);
	console.log(`Processed ${index}: ${result}`);
});

// Parallel processing
await iterateParallel([1, 2, 3], async (value) => {
	return await heavyComputation(value);
});
```

## 📚 Supported Data Types

| Type         | Example               | Description                         |
|--------------|-----------------------|-------------------------------------|
| **Array**    | `[1, 2, 3]`           | Iterate over array elements         |
| **Object**   | `{a: 1, b: 2}`        | Iterate over object key-value pairs |
| **Set**      | `new Set([1, 2, 3])`  | Iterate over set values             |
| **Map**      | `new Map([['a', 1]])` | Iterate over map entries            |
| **String**   | `"hello"`             | Iterate over each character         |
| **Number**   | `5`                   | Iterate N times (0 to N-1)          |
| **Boolean**  | `true`                | Infinite iteration until break      |
| **Iterable** | Custom iterables      | Any object with `Symbol.iterator`   |

## 🎯 Core Functions

### `iterateSync(values, callback, map?, mapUndefined?)`

Synchronous iteration over any iterable data type.

```typescript
// Basic iteration
iterateSync([1, 2, 3], (value, index, control) => {
	console.log(`${index}: ${value}`);
});

// With mapping to array
const doubled = iterateSync([1, 2, 3], (value) => value * 2, []);
// Result: [2, 4, 6]

// With flow control
iterateSync([1, 2, 3, 4, 5], (value, index, control) => {
	if (value === 3) control.break();
	console.log(value);
});
// Output: 1, 2
```

### `iterateAsync(values, callback, map?, mapUndefined?)`

Asynchronous iteration with Promise support.

```typescript
// Async iteration
await iterateAsync([1, 2, 3], async (value, index) => {
	const result = await fetch(`/api/data/${value}`);
	return await result.json();
});

// With async mapping
const results = await iterateAsync(
	['file1.txt', 'file2.txt'],
	async (filename) => await readFile(filename),
	[]
);
```

### `iterateParallel(values, callback, map?, mapUndefined?)`

Parallel execution of async callbacks (like `Promise.all`).

```typescript
// Process all items in parallel
const results = await iterateParallel(
	[1, 2, 3, 4, 5],
	async (value) => {
		await delay(1000); // All delays happen in parallel
		return value * 2;
	},
	[]
);
// Completes in ~1 second instead of ~5 seconds
```

### `iterateParallelLimit(limit, values, callback)`

Parallel execution with concurrency limit.

```typescript
// Process max 2 items at a time
await iterateParallelLimit(2, urls, async (url) => {
	return await fetch(url);
});
```

## 🗝️ Key-First Iteration

All functions have "Keys" variants that pass the index/key as the first parameter:

```typescript
// Regular: (value, index, control)
iterateSync({a: 1, b: 2}, (value, key) => {
	console.log(`${key} = ${value}`);
});

// Keys variant: (key, value, control)
iterateKeysSync({a: 1, b: 2}, (key, value) => {
	console.log(`${key} = ${value}`);
});
```

Available functions:

- `iterateKeysSync` / `iterateKeysAsync`
- `iterateKeys` (auto-detect sync/async)
- `iterateKeysParallel`

## 🎮 Flow Control

The `control` parameter provides powerful flow control options:

```typescript
iterateSync([1, 2, 3, 4, 5], (value, index, control) => {
	// Skip current iteration
	if (value === 2) {
		control.skip();
		return;
	}

	// Repeat current iteration
	if (value === 3 && !repeated) {
		repeated = true;
		control.repeat();
		return;
	}

	// Break out of loop
	if (value === 4) {
		control.break();
		return;
	}

	// Shift position
	control.shift(1); // Move forward by 1

	console.log(value);
});
```

### Control Methods

| Method                | Description                    |
|-----------------------|--------------------------------|
| `control.break()`     | Exit the iteration immediately |
| `control.skip()`      | Skip to next iteration         |
| `control.repeat()`    | Repeat current iteration       |
| `control.shift(n)`    | Move position by n steps       |
| `control.key(newKey)` | Set custom mapping key         |
| `control.length`      | Get total length of iterable   |

## 🗺️ Mapping Strategies

### Array Mapping

```typescript
const doubled = iterateSync([1, 2, 3], (x) => x * 2, []);
// Result: [2, 4, 6]
```

### Object Mapping

```typescript
const mapped = iterateSync(
	{a: 1, b: 2},
	(value, key) => value * 2,
	{}
);
// Result: {a: 2, b: 4}
```

### Set Mapping

```typescript
const uniqueDoubled = iterateSync([1, 2, 2, 3], (x) => x * 2, new Set());
// Result: Set {2, 4, 6}
```

### Map Mapping

```typescript
const keyValueMap = iterateSync(
	['a', 'b', 'c'],
	(value, index) => value.toUpperCase(),
	new Map()
);
// Result: Map {'a' => 'A', 'b' => 'B', 'c' => 'C'}
```

### Number Mapping (Counter)

```typescript
const count = iterateSync([1, 2, undefined, 3], (x) => x, 0);
// Result: 3 (counts non-undefined returns)
```

### Boolean Mapping (Flag)

```typescript
const hasEven = iterateSync([1, 3, 4, 5], (x) => x % 2 === 0, false);
// Result: true (flips to true when callback returns truthy)
```

## 🔧 Advanced Examples

### Processing Files in Batches

```typescript
import {iterateParallelLimit} from '@osmium/iterate';

const files = ['file1.txt', 'file2.txt', /* ... many files ... */];

// Process max 3 files at a time
await iterateParallelLimit(3, files, async (filename) => {
	const content = await fs.readFile(filename, 'utf8');
	const processed = await processContent(content);
	await fs.writeFile(filename.replace('.txt', '.processed.txt'), processed);
});
```

### Data Transformation Pipeline

```typescript
const data = [
	{id: 1, name: 'John', age: 25},
	{id: 2, name: 'Jane', age: 30},
	{id: 3, name: 'Bob', age: 35}
];

// Transform to Map with custom keys
const userMap = iterateSync(
	data,
	(user, index, control) => {
		control.key(`user_${user.id}`);
		return {
			...user,
			isAdult: user.age >= 18
		};
	},
	new Map()
);
```

### Infinite Iteration with Break Condition

```typescript
let counter = 0;
iterateSync(true, (value, index, control) => {
	counter++;
	console.log(`Iteration ${counter}`);

	if (counter >= 10) {
		control.break();
	}
});
```

### Error Handling in Async Iteration

```typescript
const results = await iterateAsync(
	urls,
	async (url, index) => {
		try {
			const response = await fetch(url);
			return await response.json();
		} catch (error) {
			console.error(`Failed to fetch ${url}:`, error);
			return null; // Continue with other URLs
		}
	},
	[]
);
```

## 🔍 Utility Functions

### `seriesPageableRange(start, end, pageSize)`

Generate paginated ranges for batch processing:

```typescript
import {seriesPageableRange} from '@osmium/iterate';

const ranges = seriesPageableRange(0, 100, 10);
// Result: [[0, 9], [10, 19], [20, 29], ..., [90, 99]]

// Use with parallel processing
await iterateParallel(ranges, async ([start, end]) => {
	return await processRange(start, end);
});
```

## 📝 TypeScript Support

Full TypeScript support with advanced type inference:

```typescript
// Type inference works automatically
const numbers: number[] = [1, 2, 3];
const doubled = iterateSync(numbers, (x) => x * 2, []); // Type: number[]

// Custom types
interface User {
	id: number;
	name: string;
}

const users: User[] = [{id: 1, name: 'John'}];
const userNames = iterateSync(users, (user) => user.name, []); // Type: string[]
```

## ⚡ Performance

- **Synchronous operations**: Optimized for minimal overhead
- **Parallel processing**: Efficient batching and concurrency control
- **Memory efficient**: Streaming-style processing for large datasets
- **Type safety**: Zero runtime type checking overhead

## 🧪 Testing

The library has extensive test coverage (99.24%) with 331+ tests covering:

- All data types and edge cases
- Async/sync operations
- Parallel processing
- Error handling
- Type system validation
- Performance scenarios

Run tests:

```bash
npm test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## 📞 Support

- 📖 [Documentation](https://github.com/osmium-org/iterate)
- 🐛 [Issue Tracker](https://github.com/osmium-org/iterate/issues)
- 💬 [Discussions](https://github.com/osmium-org/iterate/discussions)

---

Made with ❤️ by Vasiliy Isaichkin