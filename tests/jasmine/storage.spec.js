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
define(['scooter/storage'], function(storage) {

    describe('storage', function() {

        beforeEach(function() {
            storage.clear();
        });

        afterEach(function() {
            storage.clear();
        });

        describe('load', function() {
            it('returns null when no state has been saved', function() {
                // test
                expect(storage.load()).toBeNull();
            });
        });

        describe('save and load', function() {
            it('round-trips names and losers arrays', function() {
                const names = ['Alice', 'Bob', 'Carol'];
                const losers = ['Bob'];
                // test
                storage.save(names, losers);
                const state = storage.load();
                expect(state.names).toEqual(names);
                expect(state.losers).toEqual(losers);
            });

            it('round-trips an empty losers array', function() {
                // test
                storage.save(['Alice', 'Bob'], []);
                const state = storage.load();
                expect(state.losers).toEqual([]);
            });
        });

        describe('clear', function() {
            it('causes load to return null', function() {
                storage.save(['Alice'], []);
                // test
                storage.clear();
                expect(storage.load()).toBeNull();
            });
        });

    });

});
