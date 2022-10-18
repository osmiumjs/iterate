///TEST AREA
import {iterate, iterateAsync, iterateKeysParallel, iterateKeysSync, iterateParallel, iterateParallelLimit, iterateSync} from './src';
import {delay}                                                                                                           from './tests/mock';

const val1 = ['sdf', 6, 77];

interface Val2 {
	a: string;
	s: Date;
}

const val2: Val2 = {
	a: 'wefqw',
	s: new Date()
};
const val3 = new Set<boolean>([true, true, false]);

const val5 = new Map<string, Date | string>();
const val6: (string | undefined)[] = ['dfsf'];

const val7: Record<any, string> = {
	bla  : 'sdfw',
	s3fwz: 'qewf',
	sdf  : 'trueX',
};

const val8 = {
	idx: 0,
	jaga(a: number) {},
	[Symbol.iterator]: () => ({
		next: () => {
			val8.idx++;
			return {value: val8.idx, done: val8.idx > 10};
		}
	})
};

const val4 = new Map<[string, number], [boolean, number]>([[['bla', 4], [true, 33]], [['fqwef', 15], [false, 42]]]);

type VVA = { [key: string]: string };

(async () => {
	const vg: (string)[] = [];

	const a = await iterateParallelLimit(2, val7, async (val, idx, iter) => {
		await delay(true);
		console.log('T', val, idx);

		return `${val}:sadfs`;
	}, [] as any[]);

	console.log('>>', a);
})();