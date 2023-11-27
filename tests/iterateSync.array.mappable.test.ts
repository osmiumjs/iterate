// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateSync}             from '../src';
import {mockArray, mockMappings} from './mock';
import {describe, it, expect}    from 'vitest';

describe('iterateSync - Arrays - Mappable', () => {
	it('Iterate', () => {
		const {values} = mockArray();
		const {array, arrayResult} = mockMappings();

		const result = iterateSync(values, (val, idx) => {
			if (typeof val === 'number' || typeof val === 'string') return val;
		}, array);

		expect(result).toEqual(arrayResult);
	});

	it('Iterate with undefined', () => {
		const {values} = mockArray();
		const {array, arrayResultWUndefineds} = mockMappings();

		const result = iterateSync(values, (val, idx) => {
			if (typeof val === 'number' || typeof val === 'string') return val;
		}, array, true);

		expect(result).toEqual(arrayResultWUndefineds);
	});

	it('iter.mapKey', () => {
		const {values} = mockArray();
		const {array, arrayResultMapKey} = mockMappings();

		const result = iterateSync(values, (val, idx, iter) => {
			if (idx === 2) {
				iter.mapKey = 0;
			}

			if (typeof val === 'number' || typeof val === 'string') return val;
		}, array);

		expect(result).toEqual(arrayResultMapKey);
	});
});
