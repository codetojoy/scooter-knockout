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

    function _isSameAttendeeList(a, b) {
        if (a.length !== b.length) { // guard
            return false;
        }
        const sortedA = a.slice().sort();
        const sortedB = b.slice().sort();
        return sortedA.every(function(name, i) { return name === sortedB[i]; });
    }

    function ScooterViewModel(names) {
        const self = this;

        const savedState = storage.load();
        const attendeeList = new AttendeeList([]);

        if (savedState && _isSameAttendeeList(names, savedState.names)) {
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
            let initialAnimation = '';
            if (attendeeList.losers.indexOf(name) !== -1) {
                initialAnimation = 'animate-shrink';
            } else if (attendeeList.isWinner(name)) {
                initialAnimation = 'animate-rotate';
            }
            attendeeItems.push({
                name: name,
                left: (i % NUM_BOXES_PER_ROW) * 200 + 'px',
                top: Math.floor(i / NUM_BOXES_PER_ROW) * 175 + 'px',
                animationClass: ko.observable(initialAnimation)
            });
        }

        self.attendees = ko.observableArray(attendeeItems);

        self.reset = function() {
            console.log('TRACER Scooter: reset');
            storage.clear();
            attendeeList.reset();
            self.attendees().forEach(function(attendee) {
                attendee.animationClass('');
            });
        };

        self.go = function() {
            console.log('TRACER Scooter: go round, survivors: ' + attendeeList.getNumSurvivors());

            // Each person has a 1-in-N chance of losing this round.
            // Note it is possible for no one to lose in a given round.
            self.attendees().forEach(function(attendee) {
                const isLoser = attendeeList.isLoserThisRound(attendee.name);
                if (isLoser) {
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
            }

            storage.save(attendeeList.names, attendeeList.losers);
        };
    }

    return ScooterViewModel;
});
