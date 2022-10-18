// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterate}                                                                                                               from '../src';
import {delay, mockArray, mockMap, mockNotIterable, mockNumber, mockObject, mockObjectIterator, mockSet, mockString, mockTrue} from './mock';

describe('iterate - Async', () => {
	it('Array', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();

		const result = await iterate(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Map', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockMap();

		const result = await iterate(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});


	it('null', async () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = await iterate(null, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('false', async () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = await iterate(false, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('undefined', async () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = await iterate(undefined, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('number', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockNumber();

		const result = await iterate(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Object', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockObject();

		const result = await iterate(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Object with [Symbol.iterator]', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockObjectIterator();

		const result = await iterate(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Set', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();

		const result = await iterate(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('string', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockString();

		const result = await iterate(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('true', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockTrue();

		const result = await iterate(values as true, async (val, idx, iter) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
			if (idx === 3) iter.break();
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});
});
