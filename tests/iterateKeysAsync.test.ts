// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateKeysAsync}                                                       from '../src';
import {mockArray, mockMap, mockNumber, mockObject, mockSet, mockString, delay} from './mock';
import {describe, it, expect}                                                   from 'vitest';

describe('iterateKeysAsync', () => {
	it('Array - keys first iteration', async () => {
		const {values} = mockArray();
		const outKeys: number[] = [];
		const outValues: any[] = [];

		await iterateKeysAsync(values, async (key, val) => {
			await delay();
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual(values);
	});

	it('Array - with mapping', async () => {
		const {values} = mockArray();
		const expected = values.map((_, idx) => `key-${idx}`);

		const result = await iterateKeysAsync(values, async (key) => {
			await delay();
			return `key-${key}`;
		}, [] as string[]);

		expect(result).toEqual(expected);
	});

	it('Object - keys first iteration', async () => {
		const {values, indexes} = mockObject();
		const outKeys: string[] = [];
		const outValues: any[] = [];

		await iterateKeysAsync(values, async (key, val) => {
			await delay();
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys.sort()).toEqual([...indexes].sort());
		expect(outValues.length).toEqual(Object.values(values).length);
	});

	it('Map - keys first iteration', async () => {
		const {values, indexes} = mockMap();
		const outKeys: any[] = [];
		const outValues: string[] = [];

		await iterateKeysAsync(values, async (key, val) => {
			await delay();
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys.length).toEqual(indexes.length);
		expect(outValues.length).toEqual(values.size);
	});

	it('Set - keys first iteration', async () => {
		const {values} = mockSet();
		const outKeys: number[] = [];
		const outValues: any[] = [];

		await iterateKeysAsync(values, async (key, val) => {
			await delay();
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual(Array.from(values));
	});

	it('String - keys first iteration', async () => {
		const {values} = mockString();
		const outKeys: number[] = [];
		const outValues: string[] = [];

		await iterateKeysAsync(values, async (key, val) => {
			await delay();
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual(['A', 'B', 'C', 'D']);
	});

	it('Number - keys first iteration', async () => {
		const {values} = mockNumber();
		const outKeys: number[] = [];
		const outValues: number[] = [];

		await iterateKeysAsync(values, async (key, val) => {
			await delay();
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual([1, 2, 3, 4]);
	});

	it('Array - with control flow', async () => {
		const values = [1, 2, 3, 4, 5];
		const result: string[] = [];

		await iterateKeysAsync(values, async (key, val, iter) => {
			await delay();
			result.push(`${key}:${val}`);
			if (key === 2) {
				iter.break();
			}
		});

		expect(result).toEqual(['0:1', '1:2', '2:3']);
	});

	it('Object - with Map mapping', async () => {
		const values = {a: 1, b: 2, c: 3};

		const result = await iterateKeysAsync(values, async (key, val) => {
			await delay();
			return val * 2;
		}, new Map<string, number>());

		expect(Array.from(result.entries()).sort()).toEqual([
			['a', 2], ['b', 4], ['c', 6]
		].sort());
	});
});
