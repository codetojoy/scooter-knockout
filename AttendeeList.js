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

    function AttendeeList(names) {
        this.init(names);
    }

    AttendeeList.prototype.getNumNames = function() {
        return this.names.length;
    };

    AttendeeList.prototype.getName = function(i) {
        return this.names[i];
    };

    AttendeeList.prototype.getNumLosers = function() {
        return this.losers.length;
    };

    AttendeeList.prototype.getNumSurvivors = function() {
        return this.survivors.length;
    };

    AttendeeList.prototype.clear = function() {
        this.losers = [];
        this.survivors = this.names.slice();
    };

    AttendeeList.prototype.init = function(names) {
        this.names = utils.shuffleNames(names);
        this.losers = [];
        this.survivors = this.names.slice();
    };

    AttendeeList.prototype.reset = function() {
        this.init(this.names);
    };

    AttendeeList.prototype.loses = function(name) {
        this.losers.push(name);
        const nameIndex = this.survivors.indexOf(name);
        this.survivors.splice(nameIndex, 1);
    };

    AttendeeList.prototype.doesWinnerExist = function() {
        return this.survivors.length == 1;
    };

    AttendeeList.prototype.isWinner = function(name) {
        return this.doesWinnerExist() && this.survivors.indexOf(name) == 0;
    };

    AttendeeList.prototype.addName = function(name) {
        this.names.push(name);
        this.survivors.push(name);
    };

    AttendeeList.prototype.initFromState = function(names, losers) {
        this.names = names.slice();
        this.losers = losers.slice();
        this.survivors = names.filter(function(name) {
            return losers.indexOf(name) === -1;
        });
    };

    AttendeeList.prototype.isLoserThisRound = function(name, numChances) {
        let result = false;

        if (!this.doesWinnerExist() && this.losers.indexOf(name) == -1) {
            if (utils.oneInNChance(numChances)) {
                this.loses(name);
                result = true;
            }
        }

        return result;
    };

    return AttendeeList;
});
