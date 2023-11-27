// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterate}                                                                                                        from '../src';
import {mockArray, mockMap, mockNotIterable, mockNumber, mockObject, mockObjectIterator, mockSet, mockString, mockTrue} from './mock';
import {describe, it, expect}                                                                                           from 'vitest';

describe('iterate - Sync', () => {
	it('Array', () => {
		const {values, indexes, outValues, outIndexes} = mockArray();

		const result = iterate(values, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Map', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockMap();

		const result = iterate(values, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});


	it('null', () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = iterate(null, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('false', () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = iterate(false, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('undefined', () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = iterate(undefined, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('number', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockNumber();

		const result = iterate(values, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Object', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockObject();

		const result = iterate(values, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Object with [Symbol.iterator]', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockObjectIterator();

		const result = iterate(values, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Set', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();

		const result = iterate(values, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('string', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockString();

		const result = iterate(values, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('true', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockTrue();

		const result = iterate(values as true, (val, idx, iter) => {
			outValues.push(val);
			outIndexes.push(idx);
			if (idx === 3) iter.break();
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});
});
