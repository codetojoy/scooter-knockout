---
name: Spec
description: Technical Specification for the app.
---

### Summary

This is a simple app, called "Scooter", which is a door-prize picker (i.e. lottery) for attendees at a real-life event. The attendees are simply listed by name.

### Rules

See @docs/GameRules.md for the rules and example of the game.

### Technical Specs

* Currently the app uses vanilla Javascript, Knockout JS, and Require JS.
    * Previously the app used Dojo 1.10.x (from CDN), with an old-style of module loading (AMD).
* The code should have JS objects/classes for domain entities, ViewModel entities, etc.
* Use the code-style skill for code formatting.
* Use vanilla CSS with no frameworks.
* Use Jasmine for unit-tests of any game logic.
* Currently, there is no back-end or database in the application.
* The entire app does not need to exist in one file; certainly CSS and JS can be partitioned into multiple files. If necessary, we can run the app via a Bash script that runs a simple HTTP server in Python3.

### Phase 1 TODO items

* [COMPLETE] Refactor existing code from Dojo to use Require JS 2.3.7 and Knockout JS 3.5.1.
    * [COMPLETE] No changes to UX or CSS at this time: do not worry about ux-ui-police skill, as changes will come in later phases.
    * [COMPLETE] No changes to game workflow (i.e. app behaviour). 

### Phase 2 TODO items

* [COMPLETE] Store state of play in browser local storage so that a browser restart maintains state of play: i.e. names that have been eliminated and names that are still eligible for the prize.
    * [COMPLETE] If no state is present, then assume it is a new game.
    * [COMPLETE] The reset button should clear local storage.

### Phase 3 TODO items

* [COMPLETE] Write Playwright tests for basic behaviour of the app.
* [COMPLETE] Write Jasmine tests for Javascript code.

### Phase 4 TODO items

* [COMPLETE] Add a new button on the left side called "Manage".
* [COMPLETE] When "Manage" is clicked, it should open a modal dialog with the following:
    * [COMPLETE] At right, how a current list of attendee names.
    * [COMPLETE] At left, have an text field box for a new name, plus a button called "Add".
    * [COMPLETE] When "Add" is clicked, add the name to the list and write the new set to local storage.
    * [COMPLETE] It is true that if local storage is cleared, the new name will be lost, but that is OK.

### Phase 5 TODO items

* [COMPLETE] Rename "Manage" button to "Config" including all code references.
* [COMPLETE] In "Config" (formerly "Manage") modal, add an integer field for the value of N in the "1/N" dice roll. The minimum allowed-value is 2 and the maximum allowed-value is 10.
    * [COMPLETE] Use this value in the actual dice-roll code.
    * [COMPLETE] Store this value in local storage as part of the game state.

### Phase 6 TODO items

* [COMPLETE] In "Config" (formerly "Manage") modal, add a dropdown of current names on left side, along with a "Remove" button. When "Remove" is clicked, the selected name is removed from the attendees list (at right).
    * [COMPLETE] For the "Remove" dropdown provide a text-field on top with fuzzy matching of names, to allow the user to find a name.

### Phase 7 TODO items

* [COMPLETE] For a round, in the event that there are no attendees eliminated, introduce a new animation that is applied to all remaining attendees. In this way, the user knows that the round has taken place.
    * [COMPLETE] The animation should be a brief "shake" in place.
* [COMPLETE] In the footer of the page, introduce a UI element for a "round counter", to further provide cues to the user about the round changes.