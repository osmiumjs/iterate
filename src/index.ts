import {
	isAsyncFunction,
	isArray,
	isMap,
	isSet,
	isNumber,
	isObject,
	isString,
	isUndefined,
	isNull, isNumeric,
} from '@osmium/is';

export class Iterate<Source, Mapper, MapperFlagUndefined> {
	protected states?: Iterate.States;

	static createInstance<Source, Mapper, MapperFlagUndefined>() {
		return new Iterate<Source, Mapper, MapperFlagUndefined>();
	}

	async iterateAsync(values: any, cb: Function, map: Mapper | undefined, mapUndefined: boolean | undefined, iterateKeys: boolean) {
		this.states = Iterate.States.createInstance({
			isAsync: true,
			values,
			cb,
			map,
			mapUndefined,
			iterateKeys
		});

		return this.resolveTypes(this.states.values, {
			isNulled : () => undefined,
			isArray  : () => this.iterateArrayLikeAsync(),
			isSet    : () => this.iterateArrayLikeAsync(),
			isMap    : () => this.iterateMapAsync(),
			isNumber : () => this.iterateNumberAsync(),
			isTrue   : () => this.iterateTrueAsync(),
			isString : () => this.iterateStringAsync(),
			isObject : () => this.iterateObjectAsync(),
			isUnknown: () => undefined
		});
	}

	iterateSync(values: any, cb: Function, map: Mapper | undefined, mapUndefined: boolean | undefined, iterateKeys: boolean) {
		this.states = Iterate.States.createInstance({
			isAsync: false,
			values,
			cb,
			map,
			mapUndefined,
			iterateKeys
		});

		return this.resolveTypes(this.states.values, {
			isNulled : () => undefined,
			isArray  : () => this.iterateArrayLikeSync(),
			isSet    : () => this.iterateArrayLikeSync(),
			isMap    : () => this.iterateMapSync(),
			isNumber : () => this.iterateNumberSync(),
			isTrue   : () => this.iterateTrueSync(),
			isString : () => this.iterateStringSync(),
			isObject : () => this.iterateObjectSync(),
			isUnknown: () => undefined
		});
	}

	valuesLength(values: any) {
		return this.resolveTypes(values, {
			isNulled : () => 0,
			isArray  : (v) => v.length,
			isSet    : (v) => v.size,
			isMap    : (v) => v.size,
			isNumber : (v) => v,
			isTrue   : () => 0,
			isString : (v) => v.length,
			isObject : (v) => Object.keys(v).length,
			isUnknown: () => 0
		});
	}

	getByIndex(index: number, values: any): { value: any, idx: any } | null {
		return this.resolveTypes<{ value: any, idx: any } | null>(values, {
			isNulled : () => null,
			isArray  : (v) => ({idx: index, value: v[index]}),
			isSet    : (v) => ({idx: index, value: [...v][index]}),
			isMap    : (v) => {
				const idx = [...v.keys()][index];
				return {idx, value: v.get(idx)};
			},
			isNumber : () => ({idx: index, value: index}),
			isTrue   : () => null,
			isString : () => ({idx: 1, value: 1}),
			isObject : (v) => {
				const idx = Object.keys(v)[index];
				return ({idx, value: v[index]});
			},
			isUnknown: () => null
		});
	}

	protected resolveTypes<T>(values: any, callbacks: Iterate.TypeDetectorCB<T>): any {
		if (isUndefined(values) || isNull(values) || values === false || Number.isNaN(values)) return callbacks.isNulled(values);
		if (isArray(values)) return callbacks.isArray(values);
		if (isSet(values)) return callbacks.isSet(values);
		if (isMap(values)) return callbacks.isMap(values);
		if (isNumeric(values)) return callbacks.isNumber(values);
		if (values === true) return callbacks.isTrue(values);
		if (isString(values)) return callbacks.isString(values);
		if (isObject(values)) return callbacks.isObject(values);

		return callbacks.isUnknown(values);
	}

	protected iterateArrayLikeSync() {
		if (!this.states) throw new Error();

		const rows = [...(this.states.values as Array<any> | Set<any>).values()];
		this.states.length = rows.length;

		for (this.states.position = 0; this.states.position < rows.length; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, rows[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateArrayLikeAsync() {
		if (!this.states) throw new Error();

		const rows = [...(this.states.values as Array<any> | Set<any>).values()];
		this.states.length = rows.length;

		for (this.states.position = 0; this.states.position < rows.length; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, rows[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateMapSync() {
		if (!this.states) throw new Error();

		const values = [...(this.states.values as Map<any, any>).entries()];
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < values.length; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, values[this.states.position][1], values[this.states.position][0]);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateMapAsync() {
		if (!this.states) throw new Error();

		const values = [...(this.states.values as Map<any, any>).entries()];
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < values.length; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, values[this.states.position][1], values[this.states.position][0]);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateObjectSync() {
		if (!this.states) throw new Error();

		if (this.states.values?.[Symbol.iterator]) {
			const valuesIter = [...[...(this.states.values as any[])].entries()];
			this.states.length = valuesIter.length;

			for (this.states.position = 0; this.states.position < valuesIter.length; this.states.position++) {
				Iterate.Row.processIterationSync(this.states, valuesIter[this.states.position][1], valuesIter[this.states.position][0]);

				if (this.states.break) return this.states.map;
			}

			return this.states.map;
		}

		const values = Object.entries(this.states.values as object);
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < values.length; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, values[this.states.position][1], values[this.states.position][0]);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateObjectAsync() {
		if (!this.states) throw new Error();

		if (this.states.values?.[Symbol.iterator]) {
			const valuesIter = [...[...(this.states.values as any[])].entries()];
			this.states.length = valuesIter.length;
			for (this.states.position = 0; this.states.position < valuesIter.length; this.states.position++) {
				await Iterate.Row.processIterationAsync(this.states, valuesIter[this.states.position][1], valuesIter[this.states.position][0]);

				if (this.states.break) return this.states.map;
			}

			return this.states.map;
		}

		const values = Object.entries(this.states.values as object);
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < values.length; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, values[this.states.position][1], values[this.states.position][0]);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateNumberSync(): any {
		if (!this.states) throw new Error();

		const values = this.states.values as number;
		this.states.length = values + 1;

		for (this.states.position = 0; this.states.position < values; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, this.states.position + 1, this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateNumberAsync() {
		if (!this.states) throw new Error();

		const values = this.states.values as number;
		this.states.length = values + 1;

		for (this.states.position = 0; this.states.position < values; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, this.states.position + 1, this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateStringSync(): any {
		if (!this.states) throw new Error();

		const values = this.states.values as string;
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < this.states.length; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, values[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateStringAsync(): Promise<any> {
		if (!this.states) throw new Error();

		const values = this.states.values as string;
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < this.states.length; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, values[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateTrueSync(): any {
		if (!this.states) throw new Error();

		let cnt: number = 0;
		let control: boolean = true;
		this.states.length = Infinity;

		while (control) {
			this.states.position = cnt;
			Iterate.Row.processIterationSync(this.states, cnt + 1, cnt);

			if (this.states.break) return this.states.map;

			cnt++;
		}
	}

	protected async iterateTrueAsync() {
		if (!this.states) throw new Error();

		let cnt: number = 0;
		let control: boolean = true;
		this.states.length = Infinity;

		while (control) {
			this.states.position = cnt;
			await Iterate.Row.processIterationAsync(this.states, cnt + 1, cnt);

			if (this.states.break) return this.states.map;

			cnt++;
		}
	}
}

export namespace Iterate {
	export interface IterableObject {
		[Symbol.iterator]: Function;
	}

	export type TypeDetectorCB<T> = {
		isNulled: (arg: null | undefined) => T,
		isArray: (args: any[]) => T,
		isSet: (args: Set<any>) => T,
		isMap: (args: Map<any, any>) => T,
		isNumber: (args: number) => T,
		isTrue: (args: true) => T,
		isString: (args: string) => T,
		isObject: (args: Record<any, any>) => T,
		isUnknown: (args: any) => T
	}

	type ExtractObjectValueType<Source> = Source[keyof Source];

	export class Controller implements Control<unknown> {
		static createInstance(row: Row): Controller {
			return new Controller(row);
		}

		public row: Row;

		constructor(row: Row) {
			this.row = row;
		}

		get length() {
			return this.row.states.length;
		}

		break() {
			this.row.states.break = true;
		}

		repeat() {
			this.row.states.position--;
		}

		skip() {
			this.row.states.position++;
		}

		shift(n: number) {
			if (this.row.states.position + n < -1) n = -(this.row.states.position + 1);

			this.row.states.position += n;
		}

		get mapKey() {
			return this.row.states.map ? this.row.mapKey : undefined;
		}

		set mapKey(key: unknown) {
			if (!this.row.states.map) return;

			this.row.mapKey = key;
		}

		key(key: unknown) {
			this.mapKey = key;
		}

		getStates(): States {
			return this.row.states;
		}
	}

	export class Row {
		static createInstance(states: States, index: unknown): Row {
			return new Row(states, index);
		}

		public states: States;

		public mapKey: unknown;
		public index: unknown;

		constructor(states: States, index: unknown) {
			this.states = states;
			this.index = index;

			if (Array.isArray(this.states.map)) {
				this.mapKey = this.states.position;

				return;
			}

			this.mapKey = index;
		}

		protected processMapper(mapperValue: any): boolean {
			if (!this.states.mapUndefined && mapperValue === undefined) return false;

			if (Array.isArray(this.states.map)) {
				if (this.mapKey === this.states.position || !Number.isInteger(this.mapKey)) {
					this.states.map.push(mapperValue);
				} else {
					this.states.map[this.mapKey as number] = mapperValue;
				}

				return true;
			}

			if (this.states.map instanceof Set) {
				this.states.map.add(mapperValue);

				return true;
			}

			if (this.states.map instanceof Map) {
				this.states.map.set(this.mapKey, mapperValue);

				return true;
			}

			if (typeof this.states.map === 'number') {
				this.states.map++;

				return true;
			}

			if (typeof this.states.map === 'boolean' && !this.states.mapChanged) {
				this.states.map = !this.states.map;

				return true;
			}

			if (typeof this.states.map === 'object') {
				(this.states.map as { [key: string]: any })[this.mapKey as string] = mapperValue;

				return true;
			}

			return false;
		}

		static processIterationSync(states: States, value: any, index: any): void {
			const instance = Row.createInstance(states, index);

			const mapperValue = states.iterateKeys
			                    ? states.cb(index, value, Controller.createInstance(instance))
			                    : states.cb(value, index, Controller.createInstance(instance));

			instance.processMapper(mapperValue);
		}

		static async processIterationAsync(states: States, value: any, index: any): Promise<void> {
			const instance = Row.createInstance(states, index);

			const mapperValue = states.iterateKeys
			                    ? await states.cb(index, value, Controller.createInstance(instance))
			                    : await states.cb(value, index, Controller.createInstance(instance));

			instance.processMapper(mapperValue);
		}
	}

	export class States {
		static createInstance(args: Partial<States>): States {
			const instance = new States();
			Object.assign(instance, args);
			return instance;
		}

		public isAsync: boolean = false;
		public values!: any;
		public cb!: Function;
		public map?: any;
		public mapUndefined?: boolean = false;
		public mapChanged: boolean = false;
		public iterateKeys: boolean = false;

		public length: number = 0;
		public position: number = 0;
		public break: boolean = false;

		public getStates(): States {
			return this;
		}
	}

	export type Iterable =
		Array<any>
		| Record<any, any>
		| Set<any>
		| Map<any, any>
		| string
		| number
		| null
		| undefined
		| boolean;

	export type Mappable = Exclude<Iterable, boolean | null>;

	export type ResolveValue<Source>
		= Source extends Array<any> & ReadonlyArray<infer ArrayValueType>
		  ? ArrayValueType
		  : Source extends Set<any> & ReadonlySet<infer SetValueType>
		    ? SetValueType
		    : Source extends Map<any, any> & ReadonlyMap<any, infer MapValueType>
		      ? MapValueType
		      : Source extends number | true
		        ? number
		        : Source extends string
		          ? string
		          : Source extends IterableObject & Record<any, infer RecordValueType>
		            ? RecordValueType extends (...args: any) => any
		              ? never
		              : RecordValueType
		            : Source extends { [key: string]: any }
		              ? ExtractObjectValueType<Source>
		              : unknown;

	export type ResolveIndex<SourceType>
		= SourceType extends Array<any> | Set<any>
		  ? number
		  : SourceType extends Map<any, any> & ReadonlyMap<infer MapIndexType, any>
		    ? MapIndexType
		    : SourceType extends number | string | true
		      ? number
		      : SourceType extends IterableObject
		        ? number
		        : SourceType extends { [key: string]: any }
		          ? string
		          : unknown;

	export interface Control<MapperIndex> {
		break: () => void;
		mapKey: MapperIndex extends undefined ? undefined : MapperIndex;
		key: (index: MapperIndex extends undefined ? undefined : MapperIndex) => void;
		shift: (pos: number) => void;
		repeat: () => void;
		skip: () => void;
		getStates: () => States;

		get length(): number;
	}

	export type CallbackResult<MapperValue, MapperFlagUndefined> = MapperFlagUndefined extends true ? MapperValue : MapperValue | void;

	export type CallbackResolve<Source, SourceValue, SourceIndex, Mapper, MapperIndex, MapperFlagUndefined, Control, IsAsync extends boolean = false> =
		Source extends | false | null | undefined
		? (
			value: undefined,
			index: undefined,
			control: Control
		) =>
			IsAsync extends true
			? Promise<any>
			: any
		: (
			value: SourceValue,
			index: SourceIndex,
			control: Control
		) =>
			IsAsync extends true
			? Promise<CallbackResult<ResolveValue<Mapper>, MapperFlagUndefined>>
			: CallbackResult<ResolveValue<Mapper>, MapperFlagUndefined>;

	export type CallbackKeysResolve<Source, SourceIndex, SourceValue, Mapper, MapperIndex, MapperFlagUndefined, Control, IsAsync extends boolean = false> =
		Source extends | false | null | undefined
		? (
			index: undefined,
			value: undefined,
			control: Control
		) =>
			IsAsync extends true
			? Promise<any>
			: any
		: (
			index: SourceIndex,
			value: SourceValue,
			control: Control
		) =>
			IsAsync extends true
			? Promise<CallbackResult<ResolveValue<Mapper>, MapperFlagUndefined>>
			: CallbackResult<ResolveValue<Mapper>, MapperFlagUndefined>;

	export type Callback<Source, Mapper, MapperFlagUndefined, IsAsync extends boolean = false> = CallbackResolve<Source,
		ResolveValue<Source>,
		ResolveIndex<Source>,
		Mapper,
		ResolveIndex<Mapper>,
		MapperFlagUndefined,
		Control<Mapper extends undefined ? undefined : ResolveIndex<Mapper>>,
		IsAsync>;

	export type CallbackKeys<Source, Mapper, MapperFlagUndefined, IsAsync extends boolean = false> = CallbackKeysResolve<Source,
		ResolveIndex<Source>,
		ResolveValue<Source>,
		Mapper,
		ResolveIndex<Mapper>,
		MapperFlagUndefined,
		Control<Mapper extends undefined ? undefined : ResolveIndex<Mapper>>,
		IsAsync>;
}

export function iterateSync<Source, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined>,
	map?: Mapper & (Iterate.Mappable | undefined),
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Mapper extends undefined ? void : Mapper {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values, cb, map, mapUndefined, false);
}

export function iterateAsync<Source, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Promise<Mapper extends undefined ? void : Mapper> {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb, map, mapUndefined, false);
}

export function iterate<Source,
	Callback extends Iterate.Callback<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	Mapper = undefined,
	MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Callback & Iterate.Callback<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): ReturnType<Callback> extends Promise<any> ? Promise<Mapper extends undefined ? void : Mapper> : Mapper extends undefined ? void : Mapper {
	if (isAsyncFunction(cb)) {
		return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb, map, mapUndefined, false) as any;
	}

	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values as any, cb, map as any, mapUndefined, false);
}

export function iterateKeysSync<Source, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined>,
	map?: Mapper & (Iterate.Mappable | undefined),
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Mapper extends undefined ? void : Mapper {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values, cb, map, mapUndefined, true);
}

export function iterateKeysAsync<Source, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Promise<Mapper extends undefined ? void : Mapper> {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb, map, mapUndefined, true);
}

export function iterateKeys<Source,
	Callback extends Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	Mapper = undefined,
	MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Callback & Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): ReturnType<Callback> extends Promise<any> ? Promise<Mapper extends undefined ? void : Mapper> : Mapper extends undefined ? void : Mapper {
	if (isAsyncFunction(cb)) {
		return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb, map, mapUndefined, true) as any;
	}

	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values as any, cb, map as any, mapUndefined, true);
}

export async function iterateParallel<Source, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined,
	iterateKeys: boolean = false
): Promise<Mapper extends undefined ? void : Mapper> {
	let states: Record<string, { val: any, key: any }> = {};
	let idCnt = 0;

	const promises = iterateSync<Source, Promise<any>[], MapperFlagUndefined>(
		values,
		(val: any, idx: any, iter: Iterate.Control<any>) =>
			new Promise(async (resolve) => {
				const cid = idCnt;
				idCnt++;

				const origKey = iter.key;
				const ret = iterateKeys
				            ? await cb(idx, val, iter)
				            : await cb(val, idx, iter);

				states[cid] = {
					val: ret,
					key: iter.mapKey
				};
				iter.mapKey = origKey;

				resolve(cid);
			}),
		[] as Promise<any>[]
	);

	await Promise.all(promises as Promise<any>[]);

	return iterateSync<Source, Mapper, MapperFlagUndefined>(states as Source & Iterate.Iterable, ((val: any, idx: any, iter: Iterate.Control<any>) => {
		iter.key(val.key);

		return val.val;
	}) as any, map, mapUndefined);
}

export async function iterateKeysParallel<Source, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source & Iterate.Iterable,
	cb: Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Promise<Mapper extends undefined ? void : Mapper> {
	return iterateParallel<Source, Mapper, MapperFlagUndefined>(values, cb as any, map, mapUndefined, true);
}

/** @warning WIP, do not use */
export async function iterateParallelLimit<Source, Mapper = undefined, MapperFlagUndefined = undefined>(
	limit: number,
	values: Source & Iterate.Iterable,
	cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined,
	iterateKeys: boolean = false
): Promise<(Mapper extends undefined ? void : Mapper)[]> {
	const instance = Iterate.createInstance<Source, Mapper, MapperFlagUndefined>();
	const length = instance.valuesLength(values);
	let cnt = 0;

	if (!length) return [];

	return await iterateAsync<number, any[]>(Math.ceil(length / limit), async (idx: number) => {
		const pr = iterateSync<number, Promise<any>[], MapperFlagUndefined>(limit - 1, (_: any, key: any, iter: any) => {
			if (cnt >= length) return iter.break();
			cnt++;

			const cursor = ((idx - 1) * limit) + key;

			const param = instance.getByIndex(cursor, values);
			console.log(cursor, values);
			if (!param) return;

			return (async () => cb(param.value, param.idx, iter))();

		}, [] as Promise<any>[]);

		return Promise.all(pr);
	}, []);
}