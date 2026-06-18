# Regression testing

The game remains a single-file HTML application. Automated test files are kept separately under `tests/` and do not change how the app is launched.

## Requirements

- Node.js
- Microsoft Edge
- Playwright

## Run

From this folder:

```powershell
npm install
npm test
```

The tests start temporary local HTTP servers and check:

- all six visible game routes
- startup splash display, timed advance and keypress skip
- shared voice catalogue availability and version
- unchanged character-specific voice path priority
- narrator personalized and narrator-plus-name path generation
- Find narrator `find-intro`, `find-again`, `find-correct` and `find-complete` path mapping
- Find recorded-narrator completion preserving the correct-card hold and zoom-out timing
- standardized menu button heights, radii and border weights
- standardized Back, Step, title and instruction order
- Connect Four board and start-modal ownership
- Dots & Boxes size choice, launch, scoring, extra-turn, pass-turn, final-board pause and replay
- two-player Noughts X/O turns
- Card Flipping launch and pending-timer cancellation
- Find Grandad choices
- correct Find card reveal in both Find modes
- active source-card-to-fullscreen zoom transform
- inverse full-screen-to-source-card zoom-out transform
- next-round progression waiting for zoom-out completion
- cancellation during the zoom-out phase
- correct reveal remaining open until three seconds after voice completion
- correct reveal cancellation on Home without delayed round progression
- Find idle prompt stopping after five repeats per round
- Noughts computer Step 3 showing all eligible characters and skill levels
- Noughts computer opponent selection launching the game directly
- Noughts recorded `start`, move, turn, block and outcome event path mapping
- Noughts character-specific audio retaining demographic and browser-speech fallback behavior
- Noughts completed board remaining visible before the end popup
- Noughts win-popup delay and cancellation on Home
- Malcolm overlay image visibility
- Malcolm's normal five-second same-round resume
- Malcolm overlay/tune cancellation on Home
- prevention of the abandoned round resuming
- replay buttons retaining their original DOM nodes
- browser page errors
- generated-manifest loading when the app is served or opened directly
- authoritative character removal without stale built-in entries returning
- editor person creation and occupation/game-skill persistence
- read-only multi-format character, narrator and name-clip voice inventory
- voice inventory essential/found totals and expected path rows
- microphone lifecycle, missing-clip save and automatic inventory refresh
- confirmed replacement removing an old extension before saving the new recording
- cropped WebP export filename and file-size bounds
- exported manifest contents
- desktop, tablet and phone home, menu, correct-Find-reveal, Noughts-opponent, Noughts-final-board and character-editor screenshot baselines
- horizontal overflow at each captured viewport

To update the screenshot baselines after an intentional UI change:

```powershell
npm run test:visual:update
```

No game files are modified by the test.
