// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateKeysSync}                                                 from '../src';
import {mockArray, mockMap, mockNumber, mockObject, mockSet, mockString} from './mock';
import {describe, it, expect}                                            from 'vitest';

describe('iterateKeysSync', () => {
	it('Array - keys first iteration', () => {
		const {values} = mockArray();
		const outKeys: number[] = [];
		const outValues: any[] = [];

		iterateKeysSync(values, (key, val) => {
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual(values);
	});

	it('Array - with mapping', () => {
		const {values} = mockArray();
		const expected = values.map((_, idx) => `key-${idx}`);

		const result = iterateKeysSync(values, (key) => {
			return `key-${key}`;
		}, [] as string[]);

		expect(result).toEqual(expected);
	});

	it('Object - keys first iteration', () => {
		const {values, indexes} = mockObject();
		const outKeys: string[] = [];
		const outValues: any[] = [];

		iterateKeysSync(values, (key, val) => {
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys.sort()).toEqual([...indexes].sort());
		expect(outValues.length).toEqual(Object.values(values).length);
	});

	it('Map - keys first iteration', () => {
		const {values, indexes} = mockMap();
		const outKeys: any[] = [];
		const outValues: string[] = [];

		iterateKeysSync(values, (key, val) => {
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys.length).toEqual(indexes.length);
		expect(outValues.length).toEqual(values.size);
	});

	it('Set - keys first iteration', () => {
		const {values} = mockSet();
		const outKeys: number[] = [];
		const outValues: any[] = [];

		iterateKeysSync(values, (key, val) => {
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual(Array.from(values));
	});

	it('String - keys first iteration', () => {
		const {values} = mockString();
		const outKeys: number[] = [];
		const outValues: string[] = [];

		iterateKeysSync(values, (key, val) => {
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual(['A', 'B', 'C', 'D']);
	});

	it('Number - keys first iteration', () => {
		const {values} = mockNumber();
		const outKeys: number[] = [];
		const outValues: number[] = [];

		iterateKeysSync(values, (key, val) => {
			outKeys.push(key);
			outValues.push(val);
		});

		expect(outKeys).toEqual([0, 1, 2, 3]);
		expect(outValues).toEqual([1, 2, 3, 4]);
	});

	it('Array - with control flow', () => {
		const values = [1, 2, 3, 4, 5];
		const result: string[] = [];

		iterateKeysSync(values, (key, val, iter) => {
			result.push(`${key}:${val}`);
			if (key === 2) {
				iter.break();
			}
		});

		expect(result).toEqual(['0:1', '1:2', '2:3']);
	});

	it('Object - with Map mapping', () => {
		const values = {a: 1, b: 2, c: 3};

		const result = iterateKeysSync(values, (key, val) => {
			return val * 2;
		}, new Map<string, number>());

		expect(Array.from(result.entries()).sort()).toEqual([
			['a', 2], ['b', 4], ['c', 6]
		].sort());
	});
});
