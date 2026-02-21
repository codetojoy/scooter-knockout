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
define(['scooter/AttendeeList'], function(AttendeeList) {

    const NAMES = ['Alice', 'Bob', 'Carol', 'Dave'];

    describe('AttendeeList', function() {

        describe('construction', function() {
            it('initializes survivors with all names', function() {
                // test
                const list = new AttendeeList(NAMES.slice());
                expect(list.getNumSurvivors()).toBe(4);
            });

            it('initializes with empty losers', function() {
                // test
                const list = new AttendeeList(NAMES.slice());
                expect(list.getNumLosers()).toBe(0);
            });

            it('reports correct total name count', function() {
                // test
                const list = new AttendeeList(NAMES.slice());
                expect(list.getNumNames()).toBe(4);
            });
        });

        describe('loses', function() {
            it('moves name from survivors to losers', function() {
                const list = new AttendeeList(NAMES.slice());
                // test
                list.loses('Alice');
                expect(list.getNumLosers()).toBe(1);
                expect(list.getNumSurvivors()).toBe(3);
                expect(list.losers).toContain('Alice');
                expect(list.survivors).not.toContain('Alice');
            });
        });

        describe('doesWinnerExist', function() {
            it('returns false with multiple survivors', function() {
                // test
                const list = new AttendeeList(NAMES.slice());
                expect(list.doesWinnerExist()).toBe(false);
            });

            it('returns true with exactly one survivor', function() {
                const list = new AttendeeList(NAMES.slice());
                list.loses('Alice');
                list.loses('Bob');
                // test
                list.loses('Carol');
                expect(list.doesWinnerExist()).toBe(true);
            });
        });

        describe('isWinner', function() {
            it('returns false when multiple survivors remain', function() {
                // test
                const list = new AttendeeList(NAMES.slice());
                expect(list.isWinner('Alice')).toBe(false);
            });

            it('returns true for the sole survivor', function() {
                // test
                const list = new AttendeeList(['Alice']);
                expect(list.isWinner('Alice')).toBe(true);
            });
        });

        describe('isLoserThisRound', function() {
            it('returns false when a winner already exists (guard)', function() {
                const list = new AttendeeList(['Alice']); // sole survivor = already a winner
                // test
                expect(list.isLoserThisRound('Alice')).toBe(false);
            });

            it('returns false when the name is already a loser (guard)', function() {
                const list = new AttendeeList(NAMES.slice());
                list.loses('Bob');
                // test
                expect(list.isLoserThisRound('Bob')).toBe(false);
            });

            it('eventually returns true for a live survivor', function() {
                let eliminated = false;
                // test
                for (let i = 0; i < 100 && !eliminated; i++) {
                    const trial = new AttendeeList(NAMES.slice());
                    if (trial.isLoserThisRound('Alice')) {
                        eliminated = true;
                    }
                }
                expect(eliminated).toBe(true);
            });
        });

        describe('clear', function() {
            it('resets losers to empty', function() {
                const list = new AttendeeList(NAMES.slice());
                list.loses('Alice');
                // test
                list.clear();
                expect(list.getNumLosers()).toBe(0);
            });

            it('restores all names to survivors', function() {
                const list = new AttendeeList(NAMES.slice());
                list.loses('Alice');
                // test
                list.clear();
                expect(list.getNumSurvivors()).toBe(4);
            });
        });

        describe('reset', function() {
            it('clears losers', function() {
                const list = new AttendeeList(NAMES.slice());
                list.loses('Alice');
                // test
                list.reset();
                expect(list.getNumLosers()).toBe(0);
            });

            it('restores all names as survivors', function() {
                const list = new AttendeeList(NAMES.slice());
                list.loses('Alice');
                // test
                list.reset();
                expect(list.getNumSurvivors()).toBe(4);
            });

            it('preserves all original names', function() {
                const list = new AttendeeList(NAMES.slice());
                // test
                list.reset();
                expect(list.getNumNames()).toBe(4);
            });
        });

        describe('initFromState', function() {
            it('restores the names array', function() {
                const list = new AttendeeList([]);
                // test
                list.initFromState(['Alice', 'Bob', 'Carol'], ['Bob']);
                expect(list.getNumNames()).toBe(3);
            });

            it('restores the losers array', function() {
                const list = new AttendeeList([]);
                // test
                list.initFromState(['Alice', 'Bob', 'Carol'], ['Bob']);
                expect(list.getNumLosers()).toBe(1);
                expect(list.losers).toContain('Bob');
            });

            it('derives survivors by excluding losers', function() {
                const list = new AttendeeList([]);
                // test
                list.initFromState(['Alice', 'Bob', 'Carol'], ['Bob']);
                expect(list.getNumSurvivors()).toBe(2);
                expect(list.survivors).toContain('Alice');
                expect(list.survivors).toContain('Carol');
                expect(list.survivors).not.toContain('Bob');
            });
        });

    });

});
