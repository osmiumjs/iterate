// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateSync, iterateAsync, iterateKeysSync, iterateKeysAsync, Iterate} from '../src';
import {describe, it, expect}                                                  from 'vitest';

describe('Type System and Inference', () => {
	describe('Type resolution', () => {
		it('should correctly resolve array types', () => {
			const numbers = [1, 2, 3, 4, 5];
			const result: number[] = [];

			iterateSync(numbers, (val, idx) => {
				// val should be inferred as number
				result.push(val * 2);
				// idx should be inferred as number
				expect(typeof idx).toBe('number');
			});

			expect(result).toEqual([2, 4, 6, 8, 10]);
		});

		it('should correctly resolve string types', () => {
			const text = 'hello';
			const result: string[] = [];

			iterateSync(text, (val, idx) => {
				// val should be inferred as string
				result.push(val.toUpperCase());
				// idx should be inferred as number
				expect(typeof idx).toBe('number');
			});

			expect(result).toEqual(['H', 'E', 'L', 'L', 'O']);
		});

		it('should correctly resolve object types', () => {
			const obj = {name: 'John', age: 30, active: true};
			const result: Array<{ key: string, value: any, type: string }> = [];

			iterateSync(obj, (val, key) => {
				// key should be inferred as string
				// val should be inferred as string | number | boolean
				result.push({
					key  : key,
					value: val,
					type : typeof val
				});
				expect(typeof key).toBe('string');
			});

			expect(result.sort((a, b) => a.key.localeCompare(b.key))).toEqual([
				{key: 'active', value: true, type: 'boolean'},
				{key: 'age', value: 30, type: 'number'},
				{key: 'name', value: 'John', type: 'string'}
			]);
		});

		it('should correctly resolve Map types', () => {
			const map = new Map([
				['key1', 'value1'],
				['key2', 'value2']
			]);
			const result: Array<{ key: string, value: string }> = [];

			iterateSync(map, (val, key) => {
				// key should be inferred as string
				// val should be inferred as string
				result.push({key, value: val});
				expect(typeof key).toBe('string');
				expect(typeof val).toBe('string');
			});

			expect(result).toEqual([
				{key: 'key1', value: 'value1'},
				{key: 'key2', value: 'value2'}
			]);
		});

		it('should correctly resolve Set types', () => {
			const set = new Set([10, 20, 30]);
			const result: Array<{ index: number, value: number }> = [];

			iterateSync(set, (val, idx) => {
				// val should be inferred as number
				// idx should be inferred as number
				result.push({index: idx, value: val});
				expect(typeof val).toBe('number');
				expect(typeof idx).toBe('number');
			});

			expect(result).toEqual([
				{index: 0, value: 10},
				{index: 1, value: 20},
				{index: 2, value: 30}
			]);
		});

		it('should correctly resolve number iteration', () => {
			const result: Array<{ index: number, value: number }> = [];

			iterateSync(3, (val, idx) => {
				// val should be number (1, 2, 3)
				// idx should be number (0, 1, 2)
				result.push({index: idx, value: val});
				expect(typeof val).toBe('number');
				expect(typeof idx).toBe('number');
			});

			expect(result).toEqual([
				{index: 0, value: 1},
				{index: 1, value: 2},
				{index: 2, value: 3}
			]);
		});
	});

	describe('Mapping type inference', () => {
		it('should infer array mapping types', () => {
			const numbers = [1, 2, 3];

			const stringResult = iterateSync(numbers, (val) => {
				return val.toString();
			}, [] as string[]);

			expect(stringResult).toEqual(['1', '2', '3']);
			// TypeScript should infer stringResult as string[]
		});

		it('should infer Set mapping types', () => {
			const numbers = [1, 2, 3];

			const setResult = iterateSync(numbers, (val) => {
				return val * 2;
			}, new Set<number>());

			expect(Array.from(setResult)).toEqual([2, 4, 6]);
			// TypeScript should infer setResult as Set<number>
		});

		it('should infer Map mapping types', () => {
			const data = ['a', 'b', 'c'];

			const mapResult = iterateSync(data, (val, idx) => {
				return val.toUpperCase();
			}, new Map<number, string>());

			expect(Array.from(mapResult.entries())).toEqual([
				[0, 'A'],
				[1, 'B'],
				[2, 'C']
			]);
			// TypeScript should infer mapResult as Map<number, string>
		});

		it('should infer object mapping types', () => {
			const data = ['first', 'second', 'third'];

			const objResult = iterateSync(data, (val, idx) => {
				return val.length;
			}, {} as Record<string, number>);

			expect(objResult).toEqual({
				'0': 5,
				'1': 6,
				'2': 5
			});
			// TypeScript should infer objResult as Record<string, number>
		});

		it('should handle undefined mapping correctly', () => {
			const data = [1, 2, 3];

			const result = iterateSync(data, (val) => {
				return val > 2 ? val : undefined;
			}, [] as (number | undefined)[], true);

			expect(result).toEqual([undefined, undefined, 3]);
		});
	});

	describe('Keys iteration type inference', () => {
		it('should correctly type keys iteration for arrays', () => {
			const data = ['a', 'b', 'c'];
			const result: Array<{ key: number, value: string }> = [];

			iterateKeysSync(data, (key, val) => {
				// key should be number, val should be string
				result.push({key, value: val});
				expect(typeof key).toBe('number');
				expect(typeof val).toBe('string');
			});

			expect(result).toEqual([
				{key: 0, value: 'a'},
				{key: 1, value: 'b'},
				{key: 2, value: 'c'}
			]);
		});

		it('should correctly type keys iteration for objects', () => {
			const data = {x: 10, y: 20};
			const result: Array<{ key: string, value: number }> = [];

			iterateKeysSync(data, (key, val) => {
				// key should be string, val should be number
				result.push({key, value: val});
				expect(typeof key).toBe('string');
				expect(typeof val).toBe('number');
			});

			expect(result.sort((a, b) => a.key.localeCompare(b.key))).toEqual([
				{key: 'x', value: 10},
				{key: 'y', value: 20}
			]);
		});

		it('should correctly type keys iteration for Maps', () => {
			const data = new Map([[{id: 1}, 'first'], [{id: 2}, 'second']]);
			const result: Array<{ key: any, value: string }> = [];

			iterateKeysSync(data, (key, val) => {
				// key should be {id: number}, val should be string
				result.push({key, value: val});
				expect(typeof key).toBe('object');
				expect(typeof val).toBe('string');
			});

			expect(result).toEqual([
				{key: {id: 1}, value: 'first'},
				{key: {id: 2}, value: 'second'}
			]);
		});
	});

	describe('Async type inference', () => {
		it('should correctly type async iteration', async () => {
			const data = [1, 2, 3];
			const result: number[] = [];

			await iterateAsync(data, async (val, idx) => {
				// Simulate async operation
				await new Promise(resolve => setImmediate(resolve));
				result.push(val * 2);
				expect(typeof val).toBe('number');
				expect(typeof idx).toBe('number');
			});

			expect(result.sort()).toEqual([2, 4, 6]);
		});

		it('should correctly type async keys iteration', async () => {
			const data = {a: 1, b: 2};
			const result: string[] = [];

			await iterateKeysAsync(data, async (key, val) => {
				// Simulate async operation
				await new Promise(resolve => setImmediate(resolve));
				result.push(`${key}:${val}`);
				expect(typeof key).toBe('string');
				expect(typeof val).toBe('number');
			});

			expect(result.sort()).toEqual(['a:1', 'b:2']);
		});

		it('should correctly type async mapping', async () => {
			const data = ['hello', 'world'];

			const result = await iterateAsync(data, async (val) => {
				await new Promise(resolve => setImmediate(resolve));
				return val.toUpperCase();
			}, [] as string[]);

			expect(result.sort()).toEqual(['HELLO', 'WORLD']);
			// TypeScript should infer result as string[]
		});
	});

	describe('Complex type scenarios', () => {
		it('should handle union types correctly', () => {
			const mixedData: (string | number | boolean)[] = ['hello', 42, true, 'world', 0, false];
			const result: Array<{ value: any, type: string }> = [];

			iterateSync(mixedData, (val) => {
				result.push({value: val, type: typeof val});
			});

			expect(result).toEqual([
				{value: 'hello', type: 'string'},
				{value: 42, type: 'number'},
				{value: true, type: 'boolean'},
				{value: 'world', type: 'string'},
				{value: 0, type: 'number'},
				{value: false, type: 'boolean'}
			]);
		});

		it('should handle nested generic types', () => {
			const nestedData: Array<{ items: number[] }> = [
				{items: [1, 2, 3]},
				{items: [4, 5, 6]}
			];
			const result: number[] = [];

			iterateSync(nestedData, (val) => {
				iterateSync(val.items, (item) => {
					result.push(item);
				});
			});

			expect(result).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should handle optional properties', () => {
			interface OptionalData {
				required: string;
				optional?: number;
			}

			const data: OptionalData[] = [
				{required: 'first'},
				{required: 'second', optional: 42}
			];
			const result: Array<{ req: string, opt: number | undefined }> = [];

			iterateSync(data, (val) => {
				result.push({req: val.required, opt: val.optional});
			});

			expect(result).toEqual([
				{req: 'first', opt: undefined},
				{req: 'second', opt: 42}
			]);
		});
	});

	describe('Type detector callbacks', () => {
		it('should correctly identify all types in resolveTypes', () => {
			const instance = Iterate.createInstance();
			const results: string[] = [];

			const callbacks = {
				isNulled : () => {
					results.push('nulled');
					return 'nulled';
				},
				isArray  : () => {
					results.push('array');
					return 'array';
				},
				isSet    : () => {
					results.push('set');
					return 'set';
				},
				isMap    : () => {
					results.push('map');
					return 'map';
				},
				isNumber : () => {
					results.push('number');
					return 'number';
				},
				isTrue   : () => {
					results.push('true');
					return 'true';
				},
				isString : () => {
					results.push('string');
					return 'string';
				},
				isObject : () => {
					results.push('object');
					return 'object';
				},
				isUnknown: () => {
					results.push('unknown');
					return 'unknown';
				}
			};

			// Test each type
			(instance as any).resolveTypes(null, callbacks);
			(instance as any).resolveTypes(undefined, callbacks);
			(instance as any).resolveTypes(false, callbacks);
			(instance as any).resolveTypes(NaN, callbacks);
			(instance as any).resolveTypes([], callbacks);
			(instance as any).resolveTypes(new Set(), callbacks);
			(instance as any).resolveTypes(new Map(), callbacks);
			(instance as any).resolveTypes(42, callbacks);
			(instance as any).resolveTypes(true, callbacks);
			(instance as any).resolveTypes('test', callbacks);
			(instance as any).resolveTypes({}, callbacks);
			(instance as any).resolveTypes(Symbol(), callbacks);

			expect(results).toEqual([
				'nulled', 'nulled', 'nulled', 'nulled', // null, undefined, false, NaN
				'array', 'set', 'map', 'number', 'true', 'string', 'object', 'unknown'
			]);
		});
	});
});
