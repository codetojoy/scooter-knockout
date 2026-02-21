# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Scooter** is a browser-based door-prize/lottery picker for real-life events. It selects a winner from a list of attendees through a random elimination game mechanic. There is no backend or database — the entire app runs in the browser.

## Running the App

```bash
./run.sh          # starts Python3 HTTP server on port 8080
# then open http://localhost:8080
```

## Tests

Use **Jasmine** for unit tests of game logic (e.g., `AttendeeList`, `utils`). No test infrastructure is currently set up, but test files should follow Jasmine conventions and test only domain logic, not UI.

## Architecture

The app uses **RequireJS 2.3.7** for AMD module loading and **Knockout JS 3.5.1** for data binding and the ViewModel. Both libraries are vendored locally (no CDN dependency at runtime). There is no build step, no npm, and no transpilation.

The app was originally written with Dojo 1.10.x (Phase 0). Phase 1 refactored it to RequireJS + Knockout while preserving all game logic and UX unchanged.

**Core modules:**

- `ATTENDEE_LIST_EDIT_THIS_ONE.js` — the only file end users need to edit; contains the list of attendee names; sets the global `ATTENDEE_LIST` array
- `AttendeeList.js` — domain model/game state: tracks `names`, `survivors`, and `losers`; contains the elimination logic (`isLoserThisRound`, `loses`, `doesWinnerExist`); plain AMD module, no framework dependency
- `utils.js` — pure utility functions: `shuffleNames` (Fisher-Yates), `pickOne`, `oneInNChance`, `getRandom`; plain AMD module, no framework dependency
- `Scooter.js` — Knockout ViewModel; owns all UI interaction; exposes `attendees` (observable array), `reset()`, and `go()` methods; animation state is tracked via `animationClass` observables on each attendee
- `main.js` — RequireJS entry-point; configures module paths; instantiates `ScooterViewModel` and calls `ko.applyBindings`
- `knockout-min.js` — Knockout JS 3.5.1, vendored locally

**Template:** `template/scooter.html` documents the Knockout binding structure. The live template is inlined in `index.html` inside `#mainBody` — this avoids the need for the RequireJS `text!` plugin.

**Animations:** Loser boxes use CSS `@keyframes` classes (`.animate-puff`, `.animate-shrink`) toggled via Knockout `css` bindings. The winner box uses `.animate-rotate` (single 360° rotation). These replace the former `dojox/css3/fx` effects.

**Game flow:** Reset → shuffle attendees → Go rounds → each survivor has 1-in-4 chance to be eliminated per round → repeat until 1 survivor (winner) or 0 survivors (no winner, restart required).

## Code Style

- 4-space indentation, no hard tabs
- Braces on the same line
- `const` and `let` only (no `var`)
- All `console.log` output must be prefixed with `TRACER ` so it stands out against system logs
- Guard clauses must have a `// guard` comment
- In unit tests, use `// test` instead of `// arrange / act / assert`; only mark the "act" section

## Architecture Principles

- DRY and YAGNI: avoid premature abstractions and unnecessary features
- Prefer immutable state
- Log liberally but judiciously

## UX/UI Guidelines

- 1980s retro styling from early home computing era
- Responsive for both mobile and desktop (CSS breakpoints)
- Follow ARIA accessibility guidelines
- Support dark and light themes
- Write UI tests with Playwright
- North American, Anglophone audience — no i18n needed
- Provide tooltips on input fields

## Security

- No hardcoded API keys or credentials
- Use Apache License 2.0 copyright headers on all source files:

```
Copyright 2026 Michael Easter / @codetojoy

Licensed under the Apache License, Version 2.0 (the "License");
...
```

- Honor third-party library licenses (RequireJS uses BSD/MIT license; Knockout JS uses MIT license)
