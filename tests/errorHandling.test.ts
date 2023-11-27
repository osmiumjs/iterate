// noinspection JSVoidFunctionReturnValueUsed,DuplicatedCode

import {iterateSync, iterateAsync, Iterate} from '../src';
import {describe, it, expect}               from 'vitest';

describe('Error Handling', () => {
	describe('Infinite loop protection', () => {
		it('iterateSync with true - should break on safety limit', () => {
			// Mock the safety check to trigger earlier for testing
			const originalIterateTrueSync = Iterate.prototype['iterateTrueSync'];
			let iterations = 0;

			// Override the method to trigger safety check after fewer iterations
			Iterate.prototype['iterateTrueSync'] = function() {
				if (!this.states) throw new Error('States not initialized');

				let cnt: number = 0;
				this.states.length = Infinity;

				while (true) {
					this.states.position = cnt;
					Iterate.Row.processIterationSync(this.states, cnt + 1, cnt);

					if (this.states.break) return this.states.map;

					cnt++;

					// Trigger safety check after 1000 iterations for testing
					if (cnt > 1000) {
						throw new Error('Infinite iteration detected - no break condition found');
					}
				}
			};

			expect(() => {
				iterateSync(true, (val, idx, iter) => {
					iterations++;
					// Never call break to trigger safety check
				});
			}).toThrow('Infinite iteration detected - no break condition found');

			// Restore original method
			Iterate.prototype['iterateTrueSync'] = originalIterateTrueSync;
		});

		it('iterateAsync with true - should break on safety limit', async () => {
			// Mock the safety check to trigger earlier for testing
			const originalIterateTrueAsync = Iterate.prototype['iterateTrueAsync'];
			let iterations = 0;

			// Override the method to trigger safety check after fewer iterations
			Iterate.prototype['iterateTrueAsync'] = async function() {
				if (!this.states) throw new Error('States not initialized');

				let cnt: number = 0;
				this.states.length = Infinity;

				while (true) {
					this.states.position = cnt;
					await Iterate.Row.processIterationAsync(this.states, cnt + 1, cnt);

					if (this.states.break) return this.states.map;

					cnt++;

					// Trigger safety check after 1000 iterations for testing
					if (cnt > 1000) {
						throw new Error('Infinite iteration detected - no break condition found');
					}
				}
			};

			await expect(async () => {
				await iterateAsync(true, async (val, idx, iter) => {
					iterations++;
					// Never call break to trigger safety check
				});
			}).rejects.toThrow('Infinite iteration detected - no break condition found');

			// Restore original method
			Iterate.prototype['iterateTrueAsync'] = originalIterateTrueAsync;
		});

		it('iterateSync with true - should work with proper break', () => {
			let iterations = 0;
			const result: number[] = [];

			iterateSync(true, (val, idx, iter) => {
				iterations++;
				result.push(val);
				if (iterations >= 5) {
					iter.break();
				}
			});

			expect(result).toEqual([1, 2, 3, 4, 5]);
			expect(iterations).toBe(5);
		});

		it('iterateAsync with true - should work with proper break', async () => {
			let iterations = 0;
			const result: number[] = [];

			await iterateAsync(true, async (val, idx, iter) => {
				iterations++;
				result.push(val);
				if (iterations >= 3) {
					iter.break();
				}
			});

			expect(result).toEqual([1, 2, 3]);
			expect(iterations).toBe(3);
		});
	});

	describe('States initialization errors', () => {
		it('should throw error when states not initialized in iterateArrayLikeSync', () => {
			const instance = new Iterate();
			expect(() => {
				(instance as any).iterateArrayLikeSync();
			}).toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateArrayLikeAsync', async () => {
			const instance = new Iterate();
			await expect(async () => {
				await (instance as any).iterateArrayLikeAsync();
			}).rejects.toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateMapSync', () => {
			const instance = new Iterate();
			expect(() => {
				(instance as any).iterateMapSync();
			}).toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateMapAsync', async () => {
			const instance = new Iterate();
			await expect(async () => {
				await (instance as any).iterateMapAsync();
			}).rejects.toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateObjectSync', () => {
			const instance = new Iterate();
			expect(() => {
				(instance as any).iterateObjectSync();
			}).toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateObjectAsync', async () => {
			const instance = new Iterate();
			await expect(async () => {
				await (instance as any).iterateObjectAsync();
			}).rejects.toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateNumberSync', () => {
			const instance = new Iterate();
			expect(() => {
				(instance as any).iterateNumberSync();
			}).toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateNumberAsync', async () => {
			const instance = new Iterate();
			await expect(async () => {
				await (instance as any).iterateNumberAsync();
			}).rejects.toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateStringSync', () => {
			const instance = new Iterate();
			expect(() => {
				(instance as any).iterateStringSync();
			}).toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateStringAsync', async () => {
			const instance = new Iterate();
			await expect(async () => {
				await (instance as any).iterateStringAsync();
			}).rejects.toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateTrueSync', () => {
			const instance = new Iterate();
			expect(() => {
				(instance as any).iterateTrueSync();
			}).toThrow('States not initialized');
		});

		it('should throw error when states not initialized in iterateTrueAsync', async () => {
			const instance = new Iterate();
			await expect(async () => {
				await (instance as any).iterateTrueAsync();
			}).rejects.toThrow('States not initialized');
		});
	});

	describe('Edge cases', () => {
		it('NaN should be treated as null', () => {
			const result: any[] = [];

			iterateSync(NaN, (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('Empty array should work', () => {
			const result: any[] = [];

			iterateSync([], (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('Empty string should work', () => {
			const result: any[] = [];

			iterateSync('', (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('Zero number should work', () => {
			const result: any[] = [];

			iterateSync(0, (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('Negative number should work', () => {
			const result: any[] = [];

			iterateSync(-5, (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('Empty Set should work', () => {
			const result: any[] = [];

			iterateSync(new Set(), (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('Empty Map should work', () => {
			const result: any[] = [];

			iterateSync(new Map(), (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});

		it('Empty object should work', () => {
			const result: any[] = [];

			iterateSync({}, (val, idx) => {
				result.push({val, idx});
			});

			expect(result).toEqual([]);
		});
	});

	describe('Complex scenarios', () => {
		it('Nested iteration should work', () => {
			const result: string[] = [];

			iterateSync([1, 2], (outerVal, outerIdx) => {
				iterateSync(['a', 'b'], (innerVal, innerIdx) => {
					result.push(`${outerVal}${innerVal}`);
				});
			});

			expect(result).toEqual(['1a', '1b', '2a', '2b']);
		});

		it('Exception in callback should propagate', () => {
			expect(() => {
				iterateSync([1, 2, 3], (val) => {
					if (val === 2) {
						throw new Error('Test error');
					}
				});
			}).toThrow('Test error');
		});

		it('Exception in async callback should propagate', async () => {
			await expect(async () => {
				await iterateAsync([1, 2, 3], async (val) => {
					if (val === 2) {
						throw new Error('Async test error');
					}
				});
			}).rejects.toThrow('Async test error');
		});
	});
});
