---
name: Spec
description: Technical Specification for the app.
---

### Summary

This is a simple app, called "Scooter", which is a door-prize picker (i.e. lottery) for attendees at a real-life event. The attendees are simply listed by name.

### Rules

See @docs/GameRules.md for the rules and example of the game.

### Technical Specs

* Currently the app uses Javascript, Dojo 1.10.x (from CDN), with an old-style of module loading (AMD).
* The code should have JS objects/classes for domain entities, ViewModel entities, etc.
* Use the code-style skill for code formatting.
* Use vanilla CSS with no frameworks.
* Use Jasmine for unit-tests of any game logic.
* Currently, there is no back-end or database in the application.
* The entire app does not need to exist in one file; certainly CSS and JS can be partitioned into multiple files. If necessary, we can run the app via a Bash script that runs a simple HTTP server in Python3.

