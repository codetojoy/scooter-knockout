/*
 * Copyright 2026 Michael Easter / @codetojoy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(['scooter/utils'], function(utils) {

    describe('utils', function() {

        describe('getRandom', function() {
            it('returns an integer within the given range over many calls', function() {
                // test
                for (let i = 0; i < 100; i++) {
                    const result = utils.getRandom(1, 6);
                    expect(Number.isInteger(result)).toBe(true);
                    expect(result).toBeGreaterThanOrEqual(1);
                    expect(result).toBeLessThanOrEqual(6);
                }
            });

            it('returns min when min equals max', function() {
                // test
                expect(utils.getRandom(5, 5)).toBe(5);
            });
        });

        describe('pickOne', function() {
            it('returns the only element from a single-item array', function() {
                // test
                expect(utils.pickOne(['x'])).toBe('x');
            });

            it('returns a value that exists in the source array', function() {
                const arr = ['Alice', 'Bob', 'Carol'];
                // test
                const result = utils.pickOne(arr);
                expect(arr).toContain(result);
            });
        });

        describe('shuffleNames', function() {
            it('returns all original elements', function() {
                const names = ['Alice', 'Bob', 'Carol'];
                // test
                const result = utils.shuffleNames(names.slice());
                expect(result.length).toBe(3);
                expect(result).toContain('Alice');
                expect(result).toContain('Bob');
                expect(result).toContain('Carol');
            });

            it('returns an empty array given empty input', function() {
                // test
                expect(utils.shuffleNames([])).toEqual([]);
            });
        });

        describe('oneInNChance', function() {
            it('always returns true when N is 1', function() {
                // test
                for (let i = 0; i < 20; i++) {
                    expect(utils.oneInNChance(1)).toBe(true);
                }
            });
        });

    });

});
