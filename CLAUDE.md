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

The app uses Dojo 1.10.x (loaded from CDN) with AMD module loading. There is no build step, no npm, and no transpilation.

**Core modules:**

- `ATTENDEE_LIST_EDIT_THIS_ONE.js` — the only file end users need to edit; contains the list of attendee names
- `AttendeeList.js` — domain model/game state: tracks `names`, `survivors`, and `losers`; contains the elimination logic (`isLoserThisRound`, `loses`, `doesWinnerExist`)
- `utils.js` — pure utility functions: `shuffleNames` (Fisher-Yates), `pickOne`, `oneInNChance`, `getRandom`
- `Scooter.js` — Dojo widget (`_WidgetBase` + `_TemplatedMixin`) that owns all UI interaction; binds to `template/scooter.html`; uses Dojo CSS3 effects for animations (puff/shrink for losers, rotate for winner)

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

- Honor third-party library licenses (Dojo uses BSD/AFL licenses)
