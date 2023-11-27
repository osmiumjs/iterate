// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateParallel, iterateKeysParallel, iterateParallelLimit}             from '../src';
import {mockArray, mockMap, mockNumber, mockObject, mockSet, mockString, delay} from './mock';
import {describe, it, expect}                                                   from 'vitest';

describe('iterateParallel', () => {
	it('Array - basic parallel iteration', async () => {
		const values = [42, true, 'string'];
		const outValues: any[] = [];
		const outIndexes: number[] = [];

		const result = await iterateParallel(values, async (val, idx) => {
			await delay();
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues.sort()).toEqual([42, 'string', true]);
		expect(outIndexes.sort()).toEqual([0, 1, 2]);
		expect(result).toEqual(undefined);
	});

	it('Array - with mapping', async () => {
		const {values} = mockArray();
		const expected = values.map(v => v.toString());

		const result = await iterateParallel(values, async (val) => {
			await delay();
			return val.toString();
		}, [] as string[]);

		expect(result.sort()).toEqual(expected.sort());
	});

	it('Map - parallel iteration', async () => {
		const {values, iteratedValues, indexes} = mockMap();
		const outValues: string[] = [];
		const outIndexes: any[] = [];

		await iterateParallel(values, async (val, idx) => {
			await delay();
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues.sort()).toEqual([...iteratedValues].sort());
		expect(outIndexes.length).toEqual(indexes.length);
	});

	it('Number - parallel iteration', async () => {
		const {values, iteratedValues, indexes} = mockNumber();
		const outValues: number[] = [];
		const outIndexes: number[] = [];

		await iterateParallel(values, async (val, idx) => {
			await delay();
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues.sort()).toEqual([...iteratedValues].sort());
		expect(outIndexes.sort()).toEqual([...indexes].sort());
	});

	it('Set - with Set mapping', async () => {
		const {values} = mockSet();
		const expected = new Set(Array.from(values).map(v => v[0]));

		const result = await iterateParallel(values, async (val) => {
			await delay();
			return val[0];
		}, new Set<string>());

		expect(Array.from(result).sort()).toEqual(Array.from(expected).sort());
	});

	it('Object - with Map mapping', async () => {
		const values = {a: 1, b: 2, c: 3};
		const expected = new Map([['a', 1], ['b', 2], ['c', 3]]);

		const result = await iterateParallel(values, async (val, idx, iter) => {
			await delay();
			iter.key(idx); // Set the key explicitly to the object key
			return val;
		}, new Map<string, number>());

		expect(Array.from(result.entries()).sort()).toEqual(Array.from(expected.entries()).sort());
	});

	it('String - with mapUndefined', async () => {
		const {values} = mockString();

		const result = await iterateParallel(values, async (val) => {
			await delay();
			return val === 'B' ? undefined : val;
		}, [] as (string | undefined)[], true);

		expect(result.sort()).toEqual(['A', 'C', 'D', undefined].sort());
	});
});

describe('iterateKeysParallel', () => {
	it('Array - keys first', async () => {
		const values = [42, true, 'string', 100];
		const outKeys: number[] = [];
		const outValues: any[] = [];

		await iterateKeysParallel(values, async (idx, val) => {
			await delay();
			outKeys.push(idx);
			outValues.push(val);
		});

		expect(outKeys.sort()).toEqual([0, 1, 2, 3]);
		expect(outValues.sort()).toEqual([100, 42, 'string', true]);
	});

	it('Object - keys first with mapping', async () => {
		const {values} = mockObject();
		const expected = Object.keys(values);

		const result = await iterateKeysParallel(values, async (key) => {
			await delay();
			return key;
		}, [] as string[]);

		expect(result.sort()).toEqual(expected.sort());
	});

	it('Map - keys first', async () => {
		const {values, indexes} = mockMap();
		const outKeys: any[] = [];

		await iterateKeysParallel(values, async (key, val) => {
			await delay();
			outKeys.push(key);
		});

		expect(outKeys.length).toEqual(indexes.length);
	});
});

describe('iterateParallelLimit', () => {
	it('Array - with limit 2', async () => {
		const values = [42, true, 'string', 100];
		const outValues: any[] = [];
		const timestamps: number[] = [];

		await iterateParallelLimit(2, values, async (val) => {
			timestamps.push(Date.now());
			await delay();
			outValues.push(val);
		});

		expect(outValues.sort()).toEqual([100, 42, 'string', true]);
		expect(timestamps.length).toEqual(values.length);
	});

	it('Number - with limit 1', async () => {
		const {values, iteratedValues} = mockNumber();
		const outValues: number[] = [];

		await iterateParallelLimit(1, values, async (val) => {
			await delay();
			outValues.push(val);
		});

		expect(outValues).toEqual(iteratedValues);
	});

	it('String - with keys iteration', async () => {
		const {values} = mockString();
		const outKeys: number[] = [];
		const outValues: string[] = [];

		await iterateParallelLimit(2, values, async (key: any, val: any) => {
			await delay();
			outKeys.push(key as unknown as number);
			outValues.push(val as unknown as string);
		}, true);

		expect(outKeys.sort()).toEqual([0, 1, 2, 3]);
		expect(outValues.sort()).toEqual(['A', 'B', 'C', 'D']);
	});

	it('Empty values', async () => {
		await iterateParallelLimit(2, [], async () => {
			throw new Error('Should not be called');
		});
		// Should complete without error
	});

	it('Set - with limit 3', async () => {
		const {values, iteratedValues} = mockSet();
		const outValues: any[] = [];

		await iterateParallelLimit(3, values, async (val) => {
			await delay();
			outValues.push(val);
		});

		expect(outValues.sort()).toEqual([...iteratedValues].sort());
	});
});
