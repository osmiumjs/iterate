// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateSync}          from '../src';
import {mockNotIterable}      from './mock';
import {describe, it, expect} from 'vitest';

describe('iterateSync - notIterable', () => {
	it('Iterate null', () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = iterateSync(null, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Iterate false', () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = iterateSync(false, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('Iterate undefined', () => {
		const {iteratedValues, indexes, outValues, outIndexes} = mockNotIterable();

		const result = iterateSync(undefined, (val, idx) => {
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});
});
