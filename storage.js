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
define(function() {

    const STORAGE_KEY = 'scooter_state';

    return {
        save: function(names, losers, numChances) {
            const state = { names: names, losers: losers, numChances: numChances };
            console.log('TRACER storage: saving state, losers: ' + losers.length + ', numChances: ' + numChances);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        },

        load: function() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) { // guard
                return null;
            }
            console.log('TRACER storage: loaded saved state');
            return JSON.parse(raw);
        },

        clear: function() {
            console.log('TRACER storage: clearing state');
            localStorage.removeItem(STORAGE_KEY);
        }
    };
});
