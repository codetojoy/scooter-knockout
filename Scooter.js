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
define(['knockout', 'scooter/AttendeeList', 'scooter/utils', 'scooter/storage'], function(ko, AttendeeList, utils, storage) {

    const NUM_BOXES_PER_ROW = 6;
    const LOSER_ANIMATIONS = ['animate-puff', 'animate-shrink'];
    const DEFAULT_NUM_CHANCES = 4;
    const MIN_NUM_CHANCES = 2;
    const MAX_NUM_CHANCES = 10;

    function _buildAttendeeItem(name, index) {
        return {
            name: name,
            left: (index % NUM_BOXES_PER_ROW) * 200 + 'px',
            top: Math.floor(index / NUM_BOXES_PER_ROW) * 175 + 'px',
            animationClass: ko.observable('')
        };
    }

    function _clampNumChances(value) {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) { // guard
            return DEFAULT_NUM_CHANCES;
        }
        return Math.min(MAX_NUM_CHANCES, Math.max(MIN_NUM_CHANCES, parsed));
    }

    function ScooterViewModel(names) {
        const self = this;

        const savedState = storage.load();
        const attendeeList = new AttendeeList([]);

        if (savedState) {
            console.log('TRACER Scooter: restoring saved state');
            attendeeList.initFromState(savedState.names, savedState.losers);
        } else {
            console.log('TRACER Scooter: starting fresh game');
            attendeeList.init(names);
        }

        const numNames = attendeeList.getNumNames();
        console.log('TRACER Scooter: initializing with ' + numNames + ' attendees');

        const attendeeItems = [];
        for (let i = 0; i < numNames; i++) {
            const name = attendeeList.getName(i);
            const item = _buildAttendeeItem(name, i);
            if (attendeeList.losers.indexOf(name) !== -1) {
                item.animationClass('animate-shrink');
            } else if (attendeeList.isWinner(name)) {
                item.animationClass('animate-rotate');
            }
            attendeeItems.push(item);
        }

        const restoredNumChances = savedState ? savedState.numChances : null;
        const initialNumChances = restoredNumChances ? _clampNumChances(restoredNumChances) : DEFAULT_NUM_CHANCES;
        const initialRoundNumber = (savedState && savedState.roundNumber) ? savedState.roundNumber : 0;

        self.attendees = ko.observableArray(attendeeItems);
        self.isConfigOpen = ko.observable(false);
        self.newAttendeeName = ko.observable('');
        self.numChances = ko.observable(initialNumChances);
        self.removeFilter = ko.observable('');
        self.selectedAttendeeName = ko.observable('');
        self.roundNumber = ko.observable(initialRoundNumber);

        self.filteredAttendeeNames = ko.computed(function() {
            const filter = self.removeFilter().trim().toLowerCase();
            return self.attendees()
                .map(function(a) { return a.name; })
                .filter(function(name) {
                    return !filter || name.toLowerCase().indexOf(filter) !== -1;
                });
        });

        self.reset = function() {
            console.log('TRACER Scooter: reset');
            storage.clear();
            attendeeList.reset();
            self.roundNumber(0);
            self.attendees().forEach(function(attendee) {
                attendee.animationClass('');
            });
        };

        self.go = function() {
            const numChances = _clampNumChances(self.numChances());
            console.log('TRACER Scooter: go round, survivors: ' + attendeeList.getNumSurvivors() + ', numChances: ' + numChances);

            // Each person has a 1-in-N chance of losing this round.
            // Note it is possible for no one to lose in a given round.
            let newLosersCount = 0;
            self.attendees().forEach(function(attendee) {
                const isLoser = attendeeList.isLoserThisRound(attendee.name, numChances);
                if (isLoser) {
                    newLosersCount++;
                    const animation = utils.pickOne(LOSER_ANIMATIONS);
                    attendee.animationClass(animation);
                }
            });

            if (attendeeList.doesWinnerExist()) {
                self.attendees().forEach(function(attendee) {
                    const isWinner = attendeeList.isWinner(attendee.name);
                    if (isWinner) {
                        attendee.animationClass('animate-rotate');
                    }
                });
            } else if (newLosersCount === 0) {
                // No one eliminated this round: shake all survivors so user knows the round happened.
                self.attendees().forEach(function(attendee) {
                    if (attendee.animationClass() === '') {
                        attendee.animationClass('animate-shake');
                    }
                });
                setTimeout(function() {
                    self.attendees().forEach(function(attendee) {
                        if (attendee.animationClass() === 'animate-shake') { // guard
                            attendee.animationClass('');
                        }
                    });
                }, 500);
            }

            const roundNumber = self.roundNumber() + 1;
            self.roundNumber(roundNumber);
            storage.save(attendeeList.names, attendeeList.losers, numChances, roundNumber);
        };

        self.openConfig = function() {
            console.log('TRACER Scooter: open config');
            self.isConfigOpen(true);
        };

        self.closeConfig = function() {
            console.log('TRACER Scooter: close config');
            self.isConfigOpen(false);
            self.newAttendeeName('');
            self.removeFilter('');
            self.selectedAttendeeName('');
            storage.save(attendeeList.names, attendeeList.losers, _clampNumChances(self.numChances()), self.roundNumber());
        };

        self.removeAttendee = function() {
            const name = self.selectedAttendeeName();

            if (!name) { // guard
                return;
            }

            console.log('TRACER Scooter: removing attendee: ' + name);
            attendeeList.removeName(name);
            self.attendees.remove(function(a) { return a.name === name; });
            storage.save(attendeeList.names, attendeeList.losers, _clampNumChances(self.numChances()), self.roundNumber());
            self.selectedAttendeeName('');
            self.removeFilter('');
        };

        self.addAttendee = function() {
            const name = self.newAttendeeName().trim();

            if (!name) { // guard
                return;
            }

            const isDuplicate = self.attendees().some(function(a) { return a.name === name; });
            if (isDuplicate) { // guard
                return;
            }

            console.log('TRACER Scooter: adding attendee: ' + name);
            attendeeList.addName(name);

            const index = self.attendees().length;
            self.attendees.push(_buildAttendeeItem(name, index));

            storage.save(attendeeList.names, attendeeList.losers, _clampNumChances(self.numChances()), self.roundNumber());
            self.newAttendeeName('');
        };
    }

    return ScooterViewModel;
});
