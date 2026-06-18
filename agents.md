\# Grandad Connect — agent instructions



\## Project

Grandad Connect is a single-page HTMLCSSJavaScript family game app.



The current source of truth is

grandad\_connect\_v32v\_noughts\_turn\_indicator.zip



Use the current repo contents as the working baseline. Do not revert to older ZIPs or older app logic unless explicitly instructed.



\## App structure

\- Main app `index.html`

\- Images `assetsimages`

\- Card flip  stylised game images `assetsimagescardflip`

\- Audio `assetsaudio`

\- Character data `datacharacters.json`

\- Card flip data `datacardflip-images.json`



\## Critical behaviour to preserve

\- App must run as a simple static web app.

\- No build step should be required.

\- Avoid adding dependencies unless explicitly requested.

\- Keep it compatible with GitHub Pages  static hosting.

\- Keep touch-app behaviour no browser text selection, no unwanted tap highlight.

\- Keep Settings as the only place for voicesound style switches.

\- Do not re-add in-game Voice or Full Screen buttons.

\- Play Again should appear only at game over.



\## Current games

\- Connect Four

\- Noughts \& Crosses

\- Card Flipping

\- Find Grandad  portrait find game

\- Find the Character  stylised cardflip find game



\## Find games

\- Find Grandad uses normal `assetsimages` portraits.

\- Find the Character uses `assetsimagescardflip`.

\- Both repeat the current prompt after 10 seconds of no card press.

\- Loke is displayed as `Loke` but spoken as `Low-Key`.

\- Malcolm prompt includes “Can you find the Shoe Salesman”



\## Find the Character Malcolm rule

\- If the correct prompted character is clicked say the normal success line.

\- If Malcolm is clicked when Malcolm is not the prompted character

&#x20; - show Malcolm full-screen for 5 seconds

&#x20; - play the funky 8-bit tune

&#x20; - return to the same round

\- If any other wrong card is clicked

&#x20; - say “No, but Malcolm is a shoe salesman.”

\- If Malcolm is the prompted character and Malcolm is clicked

&#x20; - treat as correct

&#x20; - do not trigger the dance



\## Noughts \& Crosses

\- Two-player mode must not make a computer move.

\- Player 1 is X.

\- Player 2 is O.

\- The turn banner must clearly show whose turn it is.

\- In computer mode, O is the computer.



\## Testing expectations

After edits, check

\- JavaScript syntax

\- ZIP contains the full app, not only `index.html`

\- `assets` and `data` remain included

\- Noughts \& Crosses two-player mode still allows Player 2 to move

\- Find the Character Malcolm rule still works

\- Find prompt idle repeat still works

