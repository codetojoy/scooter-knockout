---
name: GameRules
description: Rules specification for the game.
---

### Summary

This is an app to select the winner of a door-prize at a real-life event.
There are N people/names who are eligible for the prize.

* Steps:
    * User clicks Reset button to shuffle the players
    * For each round:
        * User clicks Go button
        * Each player is evaluated with a 1/N chance to stay in the game (i.e. a dice roll)
        * Depending on the "dice roll" the player stays in the game or is eliminated
        * Various animations are used when players exit the game
    * Rounds repeat until there is one player left, and that name has a winning animation.
    * If all remaining players are eliminated in a round, then a new game must be held: no winner.

### Example

* Assume three players: Mozart, Beethoven, and Brahms.
* User clicks Reset to shuffle

* Round 1:
    * User clicks Go
    * Internally, Beethoven's dice roll fails so he is eliminated
    * Internally, Mozart's and Brahm's dice roll succeeds so they remain

* Round 2:
    * User clicks Go
    * Internally, Mozart's and Brahm's dice roll succeeds so they remain again

* Round 3:
    * User clicks Go
    * Internally, Brahms's dice roll fails so he is eliminated
    * Internally, Mozart dice roll succeeds so Mozart is the winner

