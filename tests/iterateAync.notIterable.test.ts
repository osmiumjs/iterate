// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateAsync}           from '../src';
import {delay, mockNotIterable} from './mock';
import {describe, it, expect}   from 'vitest';

describe('iterateAsync - notIterable', () => {
	it('Iterate null', async () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = await iterateAsync(null, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Iterate false', async () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = await iterateAsync(false, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Iterate undefined', async () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = await iterateAsync(undefined, async (val, idx) => {
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});
});
