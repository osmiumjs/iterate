// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateSync}                   from '../src';
import {mockNumber, mockSet, mockTrue} from './mock';

describe('iterateSync - true', () => {
	it('Iterate', () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockTrue();

		const result = iterateSync(values as true, (val, idx, iter) => {
			outValues.push(val);
			outIndexes.push(idx);

			if (idx === 3) iter.break();
		});

		expect(outValues).toEqual(iteratedValues);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});
});
