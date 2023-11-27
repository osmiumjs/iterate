// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {Iterate}                                                         from '../src';
import {mockArray, mockMap, mockNumber, mockObject, mockSet, mockString} from './mock';
import {describe, it, expect}                                            from 'vitest';

describe('Iterate Class', () => {
	describe('createInstance', () => {
		it('should create new instance', () => {
			const instance = Iterate.createInstance();
			expect(instance).toBeInstanceOf(Iterate);
		});
	});

	describe('valuesLength', () => {
		it('Array', () => {
			const instance = Iterate.createInstance();
			const {values} = mockArray();
			expect(instance.valuesLength(values)).toBe(4);
		});

		it('Set', () => {
			const instance = Iterate.createInstance();
			const {values} = mockSet();
			expect(instance.valuesLength(values)).toBe(4);
		});

		it('Map', () => {
			const instance = Iterate.createInstance();
			const {values} = mockMap();
			expect(instance.valuesLength(values)).toBe(4);
		});

		it('Object', () => {
			const instance = Iterate.createInstance();
			const {values} = mockObject();
			expect(instance.valuesLength(values)).toBe(4);
		});

		it('String', () => {
			const instance = Iterate.createInstance();
			const {values} = mockString();
			expect(instance.valuesLength(values)).toBe(4);
		});

		it('Number', () => {
			const instance = Iterate.createInstance();
			const {values} = mockNumber();
			expect(instance.valuesLength(values)).toBe(4);
		});

		it('null', () => {
			const instance = Iterate.createInstance();
			expect(instance.valuesLength(null)).toBe(0);
		});

		it('undefined', () => {
			const instance = Iterate.createInstance();
			expect(instance.valuesLength(undefined)).toBe(0);
		});

		it('false', () => {
			const instance = Iterate.createInstance();
			expect(instance.valuesLength(false)).toBe(0);
		});

		it('true', () => {
			const instance = Iterate.createInstance();
			expect(instance.valuesLength(true)).toBe(0);
		});

		it('unknown type', () => {
			const instance = Iterate.createInstance();
			expect(instance.valuesLength(Symbol() as any)).toBe(0);
		});
	});

	describe('getByIndex', () => {
		it('Array - valid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockArray();
			const result = instance.getByIndex(1, values);
			expect(result).toEqual({idx: 1, value: true});
		});

		it('Array - invalid index (negative)', () => {
			const instance = Iterate.createInstance();
			const {values} = mockArray();
			const result = instance.getByIndex(-1, values);
			expect(result).toBe(null);
		});

		it('Array - invalid index (too large)', () => {
			const instance = Iterate.createInstance();
			const {values} = mockArray();
			const result = instance.getByIndex(10, values);
			expect(result).toBe(null);
		});

		it('Set - valid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockSet();
			const result = instance.getByIndex(0, values);
			expect(result?.idx).toBe(0);
			expect(result?.value).toEqual(['first', 1]);
		});

		it('Set - invalid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockSet();
			const result = instance.getByIndex(10, values);
			expect(result).toBe(null);
		});

		it('Map - valid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockMap();
			const result = instance.getByIndex(0, values);
			expect(result?.value).toBe('firstv');
		});

		it('Map - invalid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockMap();
			const result = instance.getByIndex(-1, values);
			expect(result).toBe(null);
		});

		it('Object - valid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockObject();
			const result = instance.getByIndex(0, values);
			expect(result?.idx).toBe('first');
			expect(result?.value).toBe('firstv');
		});

		it('Object - invalid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockObject();
			const result = instance.getByIndex(10, values);
			expect(result).toBe(null);
		});

		it('String - valid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockString();
			const result = instance.getByIndex(1, values);
			expect(result).toEqual({idx: 1, value: 'B'});
		});

		it('String - invalid index', () => {
			const instance = Iterate.createInstance();
			const {values} = mockString();
			const result = instance.getByIndex(-1, values);
			expect(result).toBe(null);
		});

		it('Number', () => {
			const instance = Iterate.createInstance();
			const {values} = mockNumber();
			const result = instance.getByIndex(2, values);
			expect(result).toEqual({idx: 2, value: 3});
		});

		it('null', () => {
			const instance = Iterate.createInstance();
			const result = instance.getByIndex(0, null);
			expect(result).toBe(null);
		});

		it('true', () => {
			const instance = Iterate.createInstance();
			const result = instance.getByIndex(0, true);
			expect(result).toBe(null);
		});

		it('unknown type', () => {
			const instance = Iterate.createInstance();
			const result = instance.getByIndex(0, Symbol() as any);
			expect(result).toBe(null);
		});
	});
});

describe('Iterate.States', () => {
	it('createInstance with partial args', () => {
		const states = Iterate.States.createInstance({
			isAsync: true,
			values : [1, 2, 3],
			cb     : () => {},
		});

		expect(states.isAsync).toBe(true);
		expect(states.values).toEqual([1, 2, 3]);
		expect(states.mapUndefined).toBe(false);
		expect(states.mapChanged).toBe(false);
		expect(states.iterateKeys).toBe(false);
		expect(states.length).toBe(0);
		expect(states.position).toBe(0);
		expect(states.break).toBe(false);
	});

	it('getStates returns self', () => {
		const states = Iterate.States.createInstance({});
		expect(states.getStates()).toBe(states);
	});
});

describe('Iterate.Controller', () => {
	it('createInstance', () => {
		const states = Iterate.States.createInstance({length: 5});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		expect(controller).toBeInstanceOf(Iterate.Controller);
		expect(controller.row).toBe(row);
	});

	it('length getter', () => {
		const states = Iterate.States.createInstance({length: 5});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		expect(controller.length).toBe(5);
	});

	it('break method', () => {
		const states = Iterate.States.createInstance({});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.break();
		expect(states.break).toBe(true);
	});

	it('repeat method', () => {
		const states = Iterate.States.createInstance({position: 3});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.repeat();
		expect(states.position).toBe(2);
	});

	it('skip method', () => {
		const states = Iterate.States.createInstance({position: 3});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.skip();
		expect(states.position).toBe(4);
	});

	it('shift method - positive', () => {
		const states = Iterate.States.createInstance({position: 3});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.shift(2);
		expect(states.position).toBe(5);
	});

	it('shift method - negative', () => {
		const states = Iterate.States.createInstance({position: 3});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.shift(-2);
		expect(states.position).toBe(1);
	});

	it('shift method - negative overflow protection', () => {
		const states = Iterate.States.createInstance({position: 1});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.shift(-10);
		expect(states.position).toBe(-1);
	});

	it('mapKey getter/setter with map', () => {
		const states = Iterate.States.createInstance({map: []});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.mapKey = 'test';
		expect(controller.mapKey).toBe('test');
	});

	it('mapKey getter/setter without map', () => {
		const states = Iterate.States.createInstance({});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.mapKey = 'test';
		expect(controller.mapKey).toBe(undefined);
	});

	it('key method', () => {
		const states = Iterate.States.createInstance({map: []});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		controller.key('newKey');
		expect(controller.mapKey).toBe('newKey');
	});

	it('getStates method', () => {
		const states = Iterate.States.createInstance({});
		const row = Iterate.Row.createInstance(states, 0);
		const controller = Iterate.Controller.createInstance(row);

		expect(controller.getStates()).toBe(states);
	});
});

describe('Iterate.Row', () => {
	it('createInstance', () => {
		const states = Iterate.States.createInstance({});
		const row = Iterate.Row.createInstance(states, 'testIndex');

		expect(row).toBeInstanceOf(Iterate.Row);
		expect(row.states).toBe(states);
		expect(row.index).toBe('testIndex');
		expect(row.mapKey).toBe('testIndex');
	});

	it('createInstance with array map', () => {
		const states = Iterate.States.createInstance({map: [], position: 2});
		const row = Iterate.Row.createInstance(states, 'testIndex');

		expect(row.mapKey).toBe(2);
	});

	describe('processMapper', () => {
		it('Array - push value', () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({map, mapUndefined: true});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper('test');
			expect(result).toBe(true);
			expect(map).toEqual(['test']);
		});

		it('Array - set by index', () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({map, position: 0});
			const row = Iterate.Row.createInstance(states, 0);
			row.mapKey = 2;

			const result = (row as any).processMapper('test');
			expect(result).toBe(true);
			expect(map[2]).toBe('test');
		});

		it('Set - add value', () => {
			const map = new Set();
			const states = Iterate.States.createInstance({map});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper('test');
			expect(result).toBe(true);
			expect(map.has('test')).toBe(true);
		});

		it('Map - set value', () => {
			const map = new Map();
			const states = Iterate.States.createInstance({map});
			const row = Iterate.Row.createInstance(states, 'key');

			const result = (row as any).processMapper('test');
			expect(result).toBe(true);
			expect(map.get('key')).toBe('test');
		});

		it('Number - increment', () => {
			const states = Iterate.States.createInstance({map: 5});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper('ignored');
			expect(result).toBe(true);
			expect(states.map).toBe(6);
		});

		it('Boolean - toggle once', () => {
			const states = Iterate.States.createInstance({map: true, mapChanged: false});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper('ignored');
			expect(result).toBe(true);
			expect(states.map).toBe(false);
		});

		it('Boolean - no toggle when already changed', () => {
			const states = Iterate.States.createInstance({map: true, mapChanged: true});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper('ignored');
			expect(result).toBe(false);
			expect(states.map).toBe(true);
		});

		it('Object - set property', () => {
			const map = {};
			const states = Iterate.States.createInstance({map});
			const row = Iterate.Row.createInstance(states, 'key');

			const result = (row as any).processMapper('test');
			expect(result).toBe(true);
			expect((map as any).key).toBe('test');
		});

		it('undefined value without mapUndefined', () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({map, mapUndefined: false});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper(undefined);
			expect(result).toBe(false);
			expect(map).toEqual([]);
		});

		it('undefined value with mapUndefined', () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({map, mapUndefined: true});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper(undefined);
			expect(result).toBe(true);
			expect(map).toEqual([undefined]);
		});

		it('unsupported map type', () => {
			const states = Iterate.States.createInstance({map: 'string' as any});
			const row = Iterate.Row.createInstance(states, 0);

			const result = (row as any).processMapper('test');
			expect(result).toBe(false);
		});
	});

	describe('processIterationSync', () => {
		it('normal iteration', () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({
				map,
				cb         : (val: any) => val * 2,
				iterateKeys: false
			});

			Iterate.Row.processIterationSync(states, 5, 0);
			expect(map).toEqual([10]);
		});

		it('keys iteration', () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({
				map,
				cb         : (key: any, val: any) => `${key}:${val}`,
				iterateKeys: true
			});

			Iterate.Row.processIterationSync(states, 'value', 'key');
			expect(map).toEqual(['key:value']);
		});
	});

	describe('processIterationAsync', () => {
		it('normal iteration', async () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({
				map,
				cb         : async (val: any) => val * 2,
				iterateKeys: false
			});

			await Iterate.Row.processIterationAsync(states, 5, 0);
			expect(map).toEqual([10]);
		});

		it('keys iteration', async () => {
			const map: any[] = [];
			const states = Iterate.States.createInstance({
				map,
				cb         : async (key: any, val: any) => `${key}:${val}`,
				iterateKeys: true
			});

			await Iterate.Row.processIterationAsync(states, 'value', 'key');
			expect(map).toEqual(['key:value']);
		});
	});
});
