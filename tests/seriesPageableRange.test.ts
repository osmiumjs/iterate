// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateSync, seriesPageableRange}  from '../src';
import {mockSeriesPageableRange, mockTrue} from './mock';
import {describe, it, expect}              from 'vitest';

describe('seriesPageableRange', () => {
	it('Correct result', () => {
		const {args, result} = mockSeriesPageableRange();

		iterateSync(args, (arg, idx) => {
			const series = seriesPageableRange(arg.start, arg.end, arg.inPage);

			expect(series).toEqual(result[idx]);
		});
	});
});
