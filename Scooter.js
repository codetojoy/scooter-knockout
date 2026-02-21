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
define(['knockout', 'scooter/AttendeeList', 'scooter/utils'], function(ko, AttendeeList, utils) {

    const NUM_BOXES_PER_ROW = 6;
    const LOSER_ANIMATIONS = ['animate-puff', 'animate-shrink'];

    function ScooterViewModel(names) {
        const self = this;
        const attendeeList = new AttendeeList(names);

        const numNames = attendeeList.getNumNames();
        console.log('TRACER Scooter: initializing with ' + numNames + ' attendees');

        const attendeeItems = [];
        for (let i = 0; i < numNames; i++) {
            const name = attendeeList.getName(i);
            attendeeItems.push({
                name: name,
                left: (i % NUM_BOXES_PER_ROW) * 200 + 'px',
                top: Math.floor(i / NUM_BOXES_PER_ROW) * 175 + 'px',
                animationClass: ko.observable('')
            });
        }

        self.attendees = ko.observableArray(attendeeItems);

        self.reset = function() {
            console.log('TRACER Scooter: reset');
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
        };
    }

    return ScooterViewModel;
});
