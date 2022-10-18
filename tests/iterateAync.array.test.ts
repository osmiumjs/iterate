// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateAsync}     from '../src';
import {delay, mockArray} from './mock';

describe('iterateAync - Arrays', () => {
	it('Iterate', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();

		const result = await iterateAsync(values, async (val, idx) => {
			await delay();
			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
		expect(result).toEqual(undefined);
	});

	it('iter.length', async () => {
		const {values} = mockArray();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();

			expect(values.length).toEqual(iter.length);
		});
	});

	it('iter.break()', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();

		await iterateAsync(values, async (val, idx, iter) => {
			if (idx === 1) iter.break();
			await delay();

			outValues.push(val);
			outIndexes.push(idx);
		});

		expect(outValues).toEqual(values.splice(0, 2));
		expect(outIndexes).toEqual(indexes.splice(0, 2));
	});

	it('iter.skip()', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();
			if (idx === 1) iter.skip();

			outValues.push(val);
			outIndexes.push(idx);
		});

		values.splice(2, 1);
		indexes.splice(2, 1);

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.repeat()', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();
		let repeated = false;

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();
			if (idx === 1 && !repeated) {
				iter.repeat();
				repeated = true;
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		values.splice(1, 0, values[1]);
		indexes.splice(1, 0, indexes[1]);

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - positive', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();
			if (idx === 0) {
				iter.shift(2);
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		values.splice(1, 2);
		indexes.splice(1, 2);

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - positive, more length', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();
			if (idx === 0) {
				iter.shift(10);
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		values.splice(1, 3);
		indexes.splice(1, 3);

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - negative', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();
		let repeated = false;

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();
			if (idx === 2 && !repeated) {
				iter.shift(-2);
				repeated = true;
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		values.splice(1, 0, values[1]);
		values.splice(2, 0, values[3]);
		indexes.splice(1, 0, indexes[1]);
		indexes.splice(2, 0, indexes[3]);

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
	});

	it('iter.shift(n), n - negative, resulting position less 0', async () => {
		const {values, indexes, outValues, outIndexes} = mockArray();
		let repeated = false;

		await iterateAsync(values, async (val, idx, iter) => {
			await delay();
			if (idx === 1 && !repeated) {
				iter.shift(-10);
				repeated = true;
			}

			outValues.push(val);
			outIndexes.push(idx);
		});

		values.splice(0, 0, values[0]);
		values.splice(1, 0, values[2]);
		indexes.splice(0, 0, indexes[0]);
		indexes.splice(1, 0, indexes[2]);

		expect(outValues).toEqual(values);
		expect(outIndexes).toEqual(indexes);
	});
});
