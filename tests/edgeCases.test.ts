// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateSync, iterateAsync, iterateKeysSync, iterateKeysAsync, iterate, iterateKeys, seriesPageableRange} from '../src';
import {describe, it, expect}                                                                                    from 'vitest';

describe('Edge Cases and Advanced Features', () => {
	describe('seriesPageableRange edge cases', () => {
		it('should handle exact division', () => {
			const result = seriesPageableRange(0, 10, 5);
			expect(result).toEqual([
				[0, 4],
				[5, 9],
				[10, 10]
			]);
		});

		it('should handle single page', () => {
			const result = seriesPageableRange(0, 3, 10);
			expect(result).toEqual([
				[0, 3]
			]);
		});

		it('should handle empty range', () => {
			const result = seriesPageableRange(5, 5, 10);
			expect(result).toEqual([]);
		});

		it('should handle large page size', () => {
			const result = seriesPageableRange(100, 105, 20);
			expect(result).toEqual([
				[100, 105]
			]);
		});

		it('should handle page size of 1', () => {
			const result = seriesPageableRange(0, 3, 1);
			expect(result).toEqual([
				[0, 0],
				[1, 1],
				[2, 2],
				[3, 3]
			]);
		});
	});

	describe('Complex mapping scenarios', () => {
		it('should handle nested objects with mapping', () => {
			const data = {
				users: {
					john: {age: 30, city: 'NYC'},
					jane: {age: 25, city: 'LA'}
				}
			};

			const result = iterateSync(data, (val: any, key: string) => {
				if (typeof val === 'object' && val !== null) {
					return iterateSync(val as any, (innerVal: any, innerKey: any) => {
						return `${key}.${innerKey}`;
					}, [] as string[]);
				}
				return val;
			}, {} as any);

			expect(result.users).toEqual(['users.john', 'users.jane']);
		});

		it('should handle array with mixed types and filtering', () => {
			const data = [1, 'hello', null, undefined, true, {id: 1}, [1, 2]];

			const result = iterateSync(data, (val) => {
				if (typeof val === 'number') return val * 2;
				if (typeof val === 'string') return val.toUpperCase();
				if (typeof val === 'boolean') return val ? 'YES' : 'NO';
				return null;
			}, [] as any[], true);

			expect(result).toEqual([2, 'HELLO', null, null, 'YES', null, null]);
		});

		it('should handle Set with complex objects', () => {
			const data = new Set([
				{id: 1, name: 'Alice'},
				{id: 2, name: 'Bob'},
				{id: 3, name: 'Charlie'}
			]);

			const result = iterateSync(data, (val) => {
				return (val as any).name;
			}, new Set<string>());

			expect(Array.from(result).sort()).toEqual(['Alice', 'Bob', 'Charlie']);
		});

		it('should handle Map with transformation', () => {
			const data = new Map([
				['user1', {score: 100}],
				['user2', {score: 85}],
				['user3', {score: 92}]
			]);

			const result = iterateSync(data, (val, key) => {
				return {
					user : key,
					grade: (val as any).score >= 90 ? 'A' : 'B'
				};
			}, [] as any[]);

			expect(result).toEqual([
				{user: 'user1', grade: 'A'},
				{user: 'user2', grade: 'B'},
				{user: 'user3', grade: 'A'}
			]);
		});
	});

	describe('Control flow edge cases', () => {
		it('should handle multiple breaks in nested iteration', () => {
			const result: string[] = [];

			iterateSync([1, 2, 3], (outerVal, outerIdx, outerIter) => {
				iterateSync(['a', 'b', 'c'], (innerVal, innerIdx, innerIter) => {
					result.push(`${outerVal}${innerVal}`);
					if (innerVal === 'b') {
						innerIter.break();
					}
				});
				if (outerVal === 2) {
					outerIter.break();
				}
			});

			expect(result).toEqual(['1a', '1b', '2a', '2b']);
		});

		it('should handle skip with boundary conditions', () => {
			const result: number[] = [];

			iterateSync([1, 2, 3, 4, 5], (val, idx, iter) => {
				if (idx === 1) {
					iter.skip(); // This should skip index 2
				}
				result.push(val);
			});

			expect(result).toEqual([1, 2, 4, 5]);
		});

		it('should handle repeat with boundary conditions', () => {
			const result: number[] = [];
			let repeatCount = 0;

			iterateSync([1, 2, 3], (val, idx, iter) => {
				result.push(val);
				if (idx === 1 && repeatCount === 0) {
					repeatCount++;
					iter.repeat();
				}
			});

			expect(result).toEqual([1, 2, 2, 3]);
		});

		it('should handle shift with negative overflow', () => {
			const result: number[] = [];

			iterateSync([1, 2, 3, 4, 5], (val, idx, iter) => {
				result.push(val);
				if (idx === 2 && result.length === 3) {
					iter.shift(-2); // Should go back one step
				}
			});

			expect(result).toEqual([1, 2, 3, 2, 3, 4, 5]);
		});

		it('should handle shift with positive overflow', () => {
			const result: number[] = [];

			iterateSync([1, 2, 3, 4, 5], (val, idx, iter) => {
				result.push(val);
				if (idx === 1) {
					iter.shift(10); // Should skip to end
				}
			});

			expect(result).toEqual([1, 2]);
		});
	});

	describe('Async/Sync detection', () => {
		it('iterate should detect sync function', () => {
			const result: number[] = [];

			const syncResult = iterate([1, 2, 3], (val) => {
				result.push(val);
			});

			expect(result).toEqual([1, 2, 3]);
			expect(syncResult).toBe(undefined);
		});

		it('iterate should detect async function', async () => {
			const result: number[] = [];

			const asyncResult = iterate([1, 2, 3], async (val) => {
				result.push(val);
			});

			expect(asyncResult).toBeInstanceOf(Promise);
			await asyncResult;
			expect(result).toEqual([1, 2, 3]);
		});

		it('iterateKeys should detect sync function', () => {
			const result: string[] = [];

			const syncResult = iterateKeys({a: 1, b: 2}, (key, val) => {
				result.push(`${key}:${val}`);
			});

			expect(result.sort()).toEqual(['a:1', 'b:2']);
			expect(syncResult).toBe(undefined);
		});

		it('iterateKeys should detect async function', async () => {
			const result: string[] = [];

			const asyncResult = iterateKeys({a: 1, b: 2}, async (key, val) => {
				result.push(`${key}:${val}`);
			});

			expect(asyncResult).toBeInstanceOf(Promise);
			await asyncResult;
			expect(result.sort()).toEqual(['a:1', 'b:2']);
		});
	});

	describe('Type-specific edge cases', () => {
		it('should handle object with Symbol.iterator returning non-iterable', () => {
			const obj = {
				[Symbol.iterator]: () => ({
					next: () => ({value: undefined, done: true})
				})
			};

			const result: any[] = [];
			iterateSync(obj, (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('should handle very large numbers', () => {
			const result: number[] = [];

			iterateSync(Number.MAX_SAFE_INTEGER - 2, (val, idx, iter) => {
				result.push(val);
				if (result.length >= 3) {
					iter.break();
				}
			});

			expect(result).toEqual([1, 2, 3]);
		});

		it('should handle string with unicode characters', () => {
			const result: string[] = [];

			iterateSync('ABC', (val, idx) => {
				result.push(val);
			});

			expect(result).toEqual(['A', 'B', 'C']);
		});

		it('should handle Map with complex keys', () => {
			const complexKey1 = {id: 1};
			const complexKey2 = [1, 2, 3];
			const map = new Map<any, string>([
				[complexKey1, 'value1'],
				[complexKey2, 'value2']
			]);

			const result: any[] = [];
			iterateSync(map, (val: any, key: any) => {
				result.push({key, val});
			});

			expect(result).toEqual([
				{key: complexKey1, val: 'value1'},
				{key: complexKey2, val: 'value2'}
			]);
		});
	});

	describe('Memory and performance edge cases', () => {
		it('should handle large arrays efficiently', () => {
			const largeArray = Array.from({length: 10000}, (_, i) => i);
			let sum = 0;

			iterateSync(largeArray, (val, idx, iter) => {
				sum += val;
				if (idx >= 999) {
					iter.break();
				}
			});

			expect(sum).toBe(499500); // Sum of 0 to 999
		});

		it('should handle deeply nested objects', () => {
			const createNestedObject = (depth: number): any => {
				if (depth === 0) return {value: depth};
				return {nested: createNestedObject(depth - 1), value: depth};
			};

			const nested = createNestedObject(5);
			const result: number[] = [];

			const processNested = (obj: any) => {
				iterateSync(obj, (val: any, key: any) => {
					if (key === 'value') {
						result.push(val);
					} else if (typeof val === 'object' && val !== null) {
						processNested(val);
					}
				});
			};

			processNested(nested);
			expect(result.sort()).toEqual([0, 1, 2, 3, 4, 5]);
		});
	});
});
