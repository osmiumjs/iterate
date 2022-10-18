export function mockMappings() {
	const array: (number | string | undefined)[] = [1, 2];
	const arrayResult: (number | string | undefined)[] = [1, 2, 42, 'string'];
	const arrayResultWUndefineds: (number | string | undefined)[] = [1, 2, 42, undefined, 'string', undefined];
	const arrayResultMapKey: (number | string | undefined)[] = ['string', 2, 42];

	return {array, arrayResult, arrayResultWUndefineds, arrayResultMapKey};
}

export function mockArray() {
	const values: [number, boolean, string, symbol] = [42, true, 'string', Symbol()];
	const indexes: number[] = [0, 1, 2, 3];

	const outValues: any[] = [];
	const outIndexes: number[] = [];

	return {values, indexes, outValues, outIndexes};
}

export function mockObjectIterator() {
	const values = {
		some             : 'some',
		idx              : 0,
		[Symbol.iterator]: () => ({
			next: () => {
				values.idx++;
				return {value: values.idx, done: values.idx > 4};
			}
		})
	};

	const indexes: number[] = [0, 1, 2, 3];
	const iteratedValues: number[] = [1, 2, 3, 4];
	const outValues: any[] = [];
	const outIndexes: number[] = [];

	return {values, iteratedValues, indexes, outValues, outIndexes};
}

export function mockObject() {
	const values = {
		first : 'firstv',
		second: 'secondv',
		foo   : 42,
		bar   : 'barv'
	};

	const iteratedValues: (string | number)[] = ['firstv', 'secondv', 42, 'barv'];
	const indexes: string[] = ['first', 'second', 'foo', 'bar'];
	const outValues: (string | number)[] = [];
	const outIndexes: string[] = [];

	return {values, iteratedValues, indexes, outValues, outIndexes};
}


export function mockSet() {
	const basic: ([string, number])[] = [['first', 1], ['second', 2], ['foo', 3], ['bar', 4]];

	const values = new Set<[string, number]>(basic);
	const iteratedValues: ([string, number])[] = basic;
	const indexes: number[] = [0, 1, 2, 3];
	const outValues: ([string, number])[] = [];
	const outIndexes: number[] = [];

	return {values, iteratedValues, indexes, outValues, outIndexes};
}

export function mockMap() {
	const indexes: ([string, number])[] = [['first', 1], ['second', 2], ['foo', 3], ['bar', 4]];
	const basicValues = ['firstv', 'secondv', 'foov', 'barv'];
	const basic: ([[string, number], string])[] = basicValues.map((v, i) => [indexes[i], v]);
	const values = new Map<[string, number], string>(basic);
	const iteratedValues: string[] = basic.map(r => r[1]);
	const outValues: string[] = [];
	const outIndexes: ([string, number])[] = [];

	return {values, iteratedValues, indexes, outValues, outIndexes};
}

export function mockNumber() {
	const values = 4;
	const iteratedValues: number[] = [1, 2, 3, 4];
	const indexes: number[] = [0, 1, 2, 3];
	const outValues: number[] = [];
	const outIndexes: number[] = [];

	return {values, iteratedValues, indexes, outValues, outIndexes};
}

export function mockTrue() {
	const values = true;
	const iteratedValues: number[] = [1, 2, 3, 4];
	const indexes: number[] = [0, 1, 2, 3];
	const outValues: number[] = [];
	const outIndexes: number[] = [];

	return {values, iteratedValues, indexes, outValues, outIndexes};
}

export function mockString() {
	const values = 'ABCD';
	const iteratedValues: string[] = ['A', 'B', 'C', 'D'];
	const indexes: number[] = [0, 1, 2, 3];
	const outValues: string[] = [];
	const outIndexes: number[] = [];

	return {values, iteratedValues, indexes, outValues, outIndexes};
}

export function mockNotIterable() {
	const iteratedValues: any[] = [];
	const indexes: any[] = [];
	const outValues: any[] = [];
	const outIndexes: any[] = [];

	return {iteratedValues, indexes, outValues, outIndexes};
}

export function delay(rand: boolean = false) {
	return new Promise((resolve) => !rand ? setImmediate(resolve) : setTimeout(resolve, Math.random() * 100));
}