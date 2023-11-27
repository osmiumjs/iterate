// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateAsync}         from '../src';
import {delay, mockSet}       from './mock';
import {describe, it, expect} from 'vitest';

describe('iterateAsync - Set', () => {
	it('Iterate', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();

		const result = await iterateAsync(values, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('iter.length', async () => {
		const {values, iteratedValues} = mockSet();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			expect(iteratedValues.length).toEqual(iter.length);
		});
	});

	it('iter.break()', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			if (idx === indexes[1]) iter.break();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues.splice(0, 2));
		expect(outIndexes).toEqual(indexes.splice(0, 2));
	});

	it('iter.skip()', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			if (idx === indexes[1]) iter.skip();

			outValues.push(val);
			outIndexes.push(idx);
		});

		iteratedValues.splice(2, 1);
		indexes.splice(2, 1);

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.repeat()', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();
		let repeated = false;

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			if (idx === indexes[1] && !repeated) {
				iter.repeat();
				repeated = true;
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		iteratedValues.splice(1, 0, iteratedValues[1]);
		indexes.splice(1, 0, indexes[1]);

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - positive', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			if (idx === indexes[0]) {
				iter.shift(2);
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		iteratedValues.splice(1, 2);
		indexes.splice(1, 2);

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - positive, more length', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			if (idx === indexes[0]) {
				iter.shift(10);
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		iteratedValues.splice(1, 3);
		indexes.splice(1, 3);

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - negative', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();
		let repeated = false;

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			if (idx === indexes[2] && !repeated) {
				iter.shift(-2);
				repeated = true;
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		iteratedValues.splice(1, 0, iteratedValues[1]);
		iteratedValues.splice(2, 0, iteratedValues[3]);
		indexes.splice(1, 0, indexes[1]);
		indexes.splice(2, 0, indexes[3]);

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - negative, resulting position less 0', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockSet();
		let repeated = false;

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			if (idx === indexes[1] && !repeated) {
				iter.shift(-10);
				repeated = true;
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		iteratedValues.splice(0, 0, iteratedValues[0]);
		iteratedValues.splice(1, 0, iteratedValues[2]);
		indexes.splice(0, 0, indexes[0]);
		indexes.splice(1, 0, indexes[2]);

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
	});
});
