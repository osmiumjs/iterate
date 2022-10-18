// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateAsync}    from '../src';
import {delay, mockTrue} from './mock';

describe('iterateSync - true', () => {
	it('Iterate', async () => {
		const {values, iteratedValues, indexes, outValues, outIndexes} = mockTrue();

		const result = await iterateAsync(values as true, async (val, idx, iter) => {
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
