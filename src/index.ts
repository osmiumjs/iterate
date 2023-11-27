import {
	isAsyncFunction,
	isArray,
	isMap,
	isSet,
	isObject,
	isString,
	isUndefined,
	isNull,
	isNumeric,
} from '@osmium/is';

export class Iterate<Source extends Iterate.Iterable, Mapper, MapperFlagUndefined> {
	protected states?: Iterate.States<Source, Mapper>;

	static createInstance<Source extends Iterate.Iterable, Mapper, MapperFlagUndefined>() {
		return new Iterate<Source, Mapper, MapperFlagUndefined>();
	}

	async iterateAsync(
		values: Source,
		cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined, true>,
		map: Mapper | undefined,
		mapUndefined: boolean | undefined,
		iterateKeys: boolean
	): Promise<Mapper extends undefined ? void : Mapper> {
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
		}) as Mapper extends undefined ? void : Mapper;
	}

	iterateSync(
		values: Source,
		cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined, false>,
		map: Mapper | undefined,
		mapUndefined: boolean | undefined,
		iterateKeys: boolean
	): Mapper extends undefined ? void : Mapper {
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
		}) as Mapper extends undefined ? void : Mapper;
	}

	valuesLength<T extends Iterate.Iterable>(values: T): number {
		return this.resolveTypes(values, {
			isNulled : () => 0,
			isArray  : (v: unknown[]) => v.length,
			isSet    : (v: Set<unknown>) => v.size,
			isMap    : (v: Map<unknown, unknown>) => v.size,
			isNumber : (v: number) => v,
			isTrue   : () => 0,
			isString : (v: string) => v.length,
			isObject : (v: Record<string, unknown>) => Object.keys(v).length,
			isUnknown: () => 0
		});
	}

	getByIndex<T extends Iterate.Iterable>(
		index: number,
		values: T
	): { value: Iterate.ResolveValue<T>, idx: Iterate.ResolveIndex<T> } | null {
		return this.resolveTypes<{ value: Iterate.ResolveValue<T>, idx: Iterate.ResolveIndex<T> } | null>(values, {
			isNulled : () => null,
			isArray  : (v: unknown[]) => {
				if (index < 0 || index >= v.length) return null;
				return {idx: index as Iterate.ResolveIndex<T>, value: v[index] as Iterate.ResolveValue<T>};
			},
			isSet    : (v: Set<unknown>) => {
				const arr = [...v];
				if (index < 0 || index >= arr.length) return null;
				return {idx: index as Iterate.ResolveIndex<T>, value: arr[index] as Iterate.ResolveValue<T>};
			},
			isMap    : (v: Map<unknown, unknown>) => {
				const keys = [...v.keys()];
				if (index < 0 || index >= keys.length) return null;
				const idx = keys[index];
				return {idx: idx as Iterate.ResolveIndex<T>, value: v.get(idx) as Iterate.ResolveValue<T>};
			},
			isNumber : () => ({idx: index as Iterate.ResolveIndex<T>, value: (index + 1) as Iterate.ResolveValue<T>}),
			isTrue   : () => null,
			isString : (v: string) => {
				if (index < 0 || index >= v.length) return null;
				return {idx: index as Iterate.ResolveIndex<T>, value: v[index] as Iterate.ResolveValue<T>};
			},
			isObject : (v: Record<string, unknown>) => {
				const keys = Object.keys(v);
				if (index < 0 || index >= keys.length) return null;
				const idx = keys[index];
				return {idx: idx as Iterate.ResolveIndex<T>, value: v[idx] as Iterate.ResolveValue<T>};
			},
			isUnknown: () => null
		});
	}

	protected resolveTypes<T>(values: Iterate.Iterable, callbacks: Iterate.TypeDetectorCB<T>): T {
		if (isUndefined(values) || isNull(values) || values === false || Number.isNaN(values)) return callbacks.isNulled(values as null | undefined);
		if (isArray(values)) return callbacks.isArray(values as unknown[]);
		if (isSet(values)) return callbacks.isSet(values as Set<unknown>);
		if (isMap(values)) return callbacks.isMap(values as Map<unknown, unknown>);
		if (isNumeric(values)) return callbacks.isNumber(values as number);
		if (values === true) return callbacks.isTrue(values);
		if (isString(values)) return callbacks.isString(values as string);
		if (isObject(values)) return callbacks.isObject(values as Record<string, unknown>);

		return callbacks.isUnknown(values);
	}

	protected iterateArrayLikeSync() {
		if (!this.states) throw new Error('States not initialized');

		const rows = [...(this.states.values as Array<any> | Set<any>).values()];
		this.states.length = rows.length;

		for (this.states.position = 0; this.states.position < rows.length; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, rows[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateArrayLikeAsync() {
		if (!this.states) throw new Error('States not initialized');

		const rows = [...(this.states.values as Array<any> | Set<any>).values()];
		this.states.length = rows.length;

		for (this.states.position = 0; this.states.position < rows.length; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, rows[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateMapSync() {
		if (!this.states) throw new Error('States not initialized');

		const values = [...(this.states.values as Map<any, any>).entries()];
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < values.length; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, values[this.states.position][1], values[this.states.position][0]);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateMapAsync() {
		if (!this.states) throw new Error('States not initialized');

		const values = [...(this.states.values as Map<any, any>).entries()];
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < values.length; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, values[this.states.position][1], values[this.states.position][0]);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateObjectSync() {
		if (!this.states) throw new Error('States not initialized');

		if ((this.states.values as any)?.[Symbol.iterator]) {
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
		if (!this.states) throw new Error('States not initialized');

		if ((this.states.values as any)?.[Symbol.iterator]) {
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

	protected iterateNumberSync(): Mapper | undefined {
		if (!this.states) throw new Error('States not initialized');

		const values = this.states.values as number;
		this.states.length = values + 1;

		for (this.states.position = 0; this.states.position < values; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, this.states.position + 1, this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateNumberAsync() {
		if (!this.states) throw new Error('States not initialized');

		const values = this.states.values as number;
		this.states.length = values + 1;

		for (this.states.position = 0; this.states.position < values; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, this.states.position + 1, this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateStringSync(): Mapper | undefined {
		if (!this.states) throw new Error('States not initialized');

		const values = this.states.values as string;
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < this.states.length; this.states.position++) {
			Iterate.Row.processIterationSync(this.states, values[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected async iterateStringAsync(): Promise<Mapper | undefined> {
		if (!this.states) throw new Error('States not initialized');

		const values = this.states.values as string;
		this.states.length = values.length;

		for (this.states.position = 0; this.states.position < this.states.length; this.states.position++) {
			await Iterate.Row.processIterationAsync(this.states, values[this.states.position], this.states.position);

			if (this.states.break) return this.states.map;
		}

		return this.states.map;
	}

	protected iterateTrueSync(): Mapper | undefined {
		if (!this.states) throw new Error('States not initialized');

		let cnt: number = 0;
		this.states.length = Infinity;

		while (true) {
			this.states.position = cnt;
			Iterate.Row.processIterationSync(this.states, cnt + 1, cnt);

			if (this.states.break) return this.states.map;

			cnt++;

			// Safety check to prevent infinite loops without break condition
			if (cnt > Number.MAX_SAFE_INTEGER - 1) {
				throw new Error('Infinite iteration detected - no break condition found');
			}
		}
	}

	protected async iterateTrueAsync(): Promise<Mapper | undefined> {
		if (!this.states) throw new Error('States not initialized');

		let cnt: number = 0;
		this.states.length = Infinity;

		while (true) {
			this.states.position = cnt;
			await Iterate.Row.processIterationAsync(this.states, cnt + 1, cnt);

			if (this.states.break) return this.states.map;

			cnt++;

			// Safety check to prevent infinite loops without break condition
			if (cnt > Number.MAX_SAFE_INTEGER - 1) {
				throw new Error('Infinite iteration detected - no break condition found');
			}
		}
	}
}

export namespace Iterate {
	export interface IterableObject {
		[Symbol.iterator]: Function;
	}

	export type TypeDetectorCB<T> = {
		isNulled: (arg: null | undefined) => T,
		isArray: (args: unknown[]) => T,
		isSet: (args: Set<unknown>) => T,
		isMap: (args: Map<unknown, unknown>) => T,
		isNumber: (args: number) => T,
		isTrue: (args: true) => T,
		isString: (args: string) => T,
		isObject: (args: Record<string, unknown>) => T,
		isUnknown: (args: unknown) => T
	}

	type ExtractObjectValueType<Source> = Source[keyof Source];

	export class Controller<MapperIndex = unknown> implements Control<MapperIndex> {
		static createInstance<MapperIndex = unknown>(row: Row<MapperIndex>): Controller<MapperIndex> {
			return new Controller(row);
		}

		public row: Row<MapperIndex>;

		constructor(row: Row<MapperIndex>) {
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

		get mapKey(): any {
			return this.row.states.map ? (this.row.mapKey as any) : undefined;
		}

		set mapKey(key: any) {
			if (!this.row.states.map) return;

			this.row.mapKey = key as MapperIndex;
		}

		key(key: any) {
			this.mapKey = key;
		}

		getStates(): States {
			return this.row.states;
		}
	}

	export class Row<MapperIndex = unknown> {
		static createInstance<MapperIndex = unknown>(states: States, index: MapperIndex): Row<MapperIndex> {
			return new Row(states, index);
		}

		public states: States;

		public mapKey: MapperIndex;
		public index: MapperIndex;

		constructor(states: States, index: MapperIndex) {
			this.states = states;
			this.index = index;

			if (Array.isArray(this.states.map)) {
				this.mapKey = this.states.position as MapperIndex;

				return;
			}

			this.mapKey = index;
		}

		protected processMapper(mapperValue: ResolveValue<unknown>): boolean {
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
				(this.states.map as Record<string, unknown>)[this.mapKey as string] = mapperValue;

				return true;
			}

			return false;
		}

		static processIterationSync(
			states: States<any, any>,
			value: any,
			index: any
		): void {
			const instance = Row.createInstance(states, index);

			const mapperValue = states.iterateKeys
			                    ? states.cb(index, value, Controller.createInstance(instance))
			                    : states.cb(value, index, Controller.createInstance(instance));

			instance.processMapper(mapperValue);
		}

		static async processIterationAsync(
			states: States<any, any>,
			value: any,
			index: any
		): Promise<void> {
			const instance = Row.createInstance(states, index);

			const mapperValue = states.iterateKeys
			                    ? await states.cb(index, value, Controller.createInstance(instance))
			                    : await states.cb(value, index, Controller.createInstance(instance));

			instance.processMapper(mapperValue);
		}
	}

	export class States<Source = any, Mapper = any> {
		static createInstance<Source, Mapper>(args: Partial<States<Source, Mapper>>): States<Source, Mapper> {
			const instance = new States<Source, Mapper>();
			Object.assign(instance, args);
			return instance;
		}

		public isAsync: boolean = false;
		public values!: Source;
		public cb!: any;
		public map?: Mapper;
		public mapUndefined: boolean | undefined = false;
		public mapChanged: boolean = false;
		public iterateKeys: boolean = false;

		public length: number = 0;
		public position: number = 0;
		public break: boolean = false;

		public getStates(): States<Source, Mapper> {
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

	export type Mappable = Exclude<Iterable, null>;

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

	export interface Control<_MapperIndex> {
		break: () => void;
		mapKey: any;
		key: (index: any) => void;
		shift: (pos: number) => void;
		repeat: () => void;
		skip: () => void;
		getStates: () => States;

		get length(): number;
	}

	export type CallbackResult<MapperValue, MapperFlagUndefined> = MapperFlagUndefined extends true ? MapperValue : MapperValue | void;

	export type CallbackResolve<Source, SourceValue, SourceIndex, Mapper, _MapperIndex, MapperFlagUndefined, Control, IsAsync extends boolean = false> =
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

	export type CallbackKeysResolve<Source, SourceIndex, SourceValue, Mapper, _MapperIndex, MapperFlagUndefined, Control, IsAsync extends boolean = false> =
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

export function iterateSync<Source extends Iterate.Iterable, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source,
	cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined>,
	map?: Mapper & (Iterate.Mappable | undefined),
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Mapper extends undefined ? void : Mapper {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values, cb, map, mapUndefined, false);
}

export function iterateAsync<Source extends Iterate.Iterable, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source,
	cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Promise<Mapper extends undefined ? void : Mapper> {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb, map, mapUndefined, false);
}

export function iterate<Source extends Iterate.Iterable,
	Callback extends Iterate.Callback<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	Mapper = undefined,
	MapperFlagUndefined = undefined>(
	values: Source,
	cb: Callback & Iterate.Callback<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): any {
	if (isAsyncFunction(cb)) {
		return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb as any, map, mapUndefined, false) as any;
	}

	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values as any, cb as any, map as any, mapUndefined, false) as any;
}

export function iterateKeysSync<Source extends Iterate.Iterable, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source,
	cb: Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined>,
	map?: Mapper & (Iterate.Mappable | undefined),
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Mapper extends undefined ? void : Mapper {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values, cb as any, map, mapUndefined, true);
}

export function iterateKeysAsync<Source extends Iterate.Iterable, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source,
	cb: Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Promise<Mapper extends undefined ? void : Mapper> {
	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb as any, map, mapUndefined, true);
}

export function iterateKeys<Source extends Iterate.Iterable,
	Callback extends Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	Mapper = undefined,
	MapperFlagUndefined = undefined>(
	values: Source,
	cb: Callback & Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, ReturnType<Callback> extends Promise<any> ? true : false>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): any {
	if (isAsyncFunction(cb)) {
		return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateAsync(values, cb as any, map, mapUndefined, true) as any;
	}

	return Iterate.createInstance<Source, Mapper, MapperFlagUndefined>().iterateSync(values as any, cb as any, map as any, mapUndefined, true) as any;
}

export async function iterateParallel<Source extends Iterate.Iterable, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source,
	cb: Iterate.Callback<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined,
	iterateKeys: boolean = false
): Promise<Mapper extends undefined ? void : Mapper> {
	const states: Record<string, { val: any, key: any }> = {};
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

	return iterateSync<Record<string, { val: any, key: any }>, Mapper, MapperFlagUndefined>(states, ((val: any, idx: any, iter: Iterate.Control<any>) => {
		iter.key(val.key);

		return val.val;
	}) as any, map, mapUndefined);
}

export async function iterateKeysParallel<Source extends Iterate.Iterable, Mapper = undefined, MapperFlagUndefined = undefined>(
	values: Source,
	cb: Iterate.CallbackKeys<Source, Mapper, MapperFlagUndefined, true>,
	map?: (Mapper & Iterate.Mappable) | undefined,
	mapUndefined?: MapperFlagUndefined extends boolean | undefined ? MapperFlagUndefined : undefined
): Promise<Mapper extends undefined ? void : Mapper> {
	return iterateParallel<Source, Mapper, MapperFlagUndefined>(values, cb as any, map, mapUndefined, true);
}

export function seriesPageableRange(start: number, end: number, inPage: number): [number, number][] {
	const delta = end - start;
	const count = Math.ceil(delta / inPage);

	return iterateKeysSync(count, (idx, _, iter) => {
		const from = start + (inPage * idx);

		if (from + inPage >= end) {
			if (from + inPage === end) {
				iter.getStates().map.push([from, end - 1]);
				return [end, end];
			}
			return [from, end];
		}

		return [from, from + inPage - 1];
	}, [] as [number, number][]);
}

export async function iterateParallelLimit<Source extends Iterate.Iterable>(
	limit: number,
	values: Source,
	cb: Iterate.Callback<Source, undefined, undefined, true>,
	iterateKeys: boolean = false
): Promise<void> {
	const instance = Iterate.createInstance<Source, undefined, undefined>();
	const length = instance.valuesLength(values);

	if (!length) return;

	const batchCount = Math.ceil(length / limit);

	for (let batchIdx = 0; batchIdx < batchCount; batchIdx++) {
		const pr = iterateSync<number, Promise<any>[], undefined>(limit, (_: any, key: any, iter: any) => {
			const cursor = (batchIdx * limit) + key;

			if (cursor >= length) return iter.break();

			const param = instance.getByIndex(cursor, values);
			if (!param) return;

			return (async () => iterateKeys ? cb(param.idx as any, param.value as any, iter) : cb(param.value as any, param.idx as any, iter))();

		}, [] as Promise<any>[]);

		await Promise.all(pr);
	}
}
