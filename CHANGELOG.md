# v50 - Dots bright colours

- Changed Dots & Boxes Player 1 lines, boxes and active highlight from blue to bright lime.
- Changed Dots & Boxes Player 2 lines, boxes and active highlight to electric purple.
- Preserved Dots board fitting, extra-turn wording, rules, scoring, board sizes, splash screen and all other games.
- Updated smoke coverage for the new Dots line colours.

# v49 - Dots fit and extra-turn clarity

- Made the Dots & Boxes board size respond to the available viewport width and height.
- Reduced Dots board padding on small screens so larger boards fit better.
- Added a clear extra-turn status after a player claims one or more boxes.
- Preserved Dots rules, scoring, colours, board sizes, splash screen and all other games.
- Added smoke coverage for board fit and extra-turn wording.

# v48 - Dots blue and gold

- Changed Dots & Boxes Player 1 lines, boxes and active highlight to blue.
- Kept Dots & Boxes Player 2 lines, boxes and active highlight as bright gold.
- Preserved Dots rules, scoring, board sizes, splash screen and all other games.
- Added smoke coverage for the blue/gold Dots line colours.

# v47 - Dots claim wording

- Clarified the Dots & Boxes turn prompt: finish the fourth side to claim a box.
- Clarified the Dots & Boxes screen instruction with the same rule.
- Preserved Dots scoring logic, board sizes, replay, splash screen and all other games.
- Added smoke coverage for the clarified Dots wording.

# v46 - Startup splash and Dots levels

- Added the GameHub startup image as a four-second splash screen.
- Added keypress, click, tap and pointer skip for the splash screen.
- Added Small, Medium and Large Dots & Boxes board sizes: 4 x 4, 5 x 5 and 7 x 7 boxes.
- Preserved Dots replay so it restarts with the selected board size.
- Changed Dots claimed edges from coloured ovals to thinner line segments with touch-friendly hit areas.
- Matched the active player highlight to the current player's line colour.
- Added splash timing, splash skip and Dots size regression coverage.

# v45 - Dots and Boxes

- Added Dots & Boxes as a sixth home-screen game.
- Added a two-player-only character selection flow that skips computer-opponent setup.
- Added a 4 x 4 boxes board with tappable lines, box claiming and extra turns after completed boxes.
- Added final scoring, draw handling, replay and Home actions.
- Added a short final-board pause before the game-over card appears.
- Preserved the existing Connect Four, Noughts & Crosses, Card Flipping and Find game engines.
- Added Dots & Boxes smoke coverage and updated intentional home-menu visual baselines.

# v44 - Find recorded narrator voices

- Routed Find Grandad and Find the Character prompts through the shared narrator resolver.
- Added recorded narrator support for `find-intro`, `find-again`, `find-correct` and `find-complete`.
- Preserved the path priority of full named prompt, shared prompt plus name clip, generic prompt and browser speech.
- Kept the Malcolm wrong-click sequence independent from generic retry narration.
- Kept correct-card voice completion, three-second hold, zoom-out and cancellation timing intact.
- Added regression coverage for Find narrator path mapping and completion-aware audio playback.

# v43 - Noughts recorded character voices

- Routed Noughts & Crosses speech through the shared character-audio resolver.
- Added the selected opponent's recorded `start` announcement to the active setup router.
- Added recorded `not-so-fast`, `move` and `your-turn` responses after computer moves.
- Added recorded `i-win`, `you-win` and `game-over` outcome responses.
- Kept character-specific audio first, demographic fallback audio second and browser speech synthesis third.
- Preserved the 3.4-second win pause, 3.2-second draw pause and session-owned cancellation.
- Kept Memory's existing generic speech helper independent from the new Noughts event helper.
- Added deterministic path-mapping and existing pause/cancellation regression coverage.

# v42 - Character editor and dynamic roster

- Added Phase 3 microphone recording, review, redo and direct-save controls to every voice inventory row.
- Added confirmed replacement that removes stale extension variants before saving the new clip.
- Added recorder stream, timer and object-URL cleanup on save, cancel and dialog close.
- Added Phase 2 read-only character, narrator and name-clip voice inventory to the Character Editor.
- Added multi-format clip detection, essential-progress summaries and recording preview.
- Added the Phase 1 shared voice-event catalogue and narrator/name-clip folder conventions.
- Added dormant narrator and name-clip path resolvers without changing current game speech.
- Fixed image saving so it also persists the character manifest immediately.
- Fixed person removal so it immediately persists all manifests instead of leaving an empty character card.
- Added separate normal-image and card-flip-image removal controls with immediate manifest saving.
- Recovered Kenneth's already-saved normal and card-flip images into the roster.
- Added a separate `character-editor.html` application for adding, editing and removing characters.
- Added square image cropping, zooming, resizing and WebP/JPEG/PNG export.
- Recommended 800 x 800 WebP at 84% quality to retain card detail while reducing download size.
- Added direct project-folder saving in supported Edge/Chrome browsers, with download fallbacks.
- Made `data/characters.json` the authoritative roster rather than merging it over stale built-in entries.
- Added `data/characters.generated.js` so edited rosters also work when `index.html` is opened directly.
- Moved occupation, normal image, card-flip image and game-specific skill settings into the manifest.
- Made Card Flipping derive its card pool from the current manifest.
- Added editor, image-export, authoritative-removal and cross-viewport regression coverage.
- Linked the existing voice recorder as the next-stage audio tool without changing current voice behaviour.

# v41 - Find success zoom-out

- Added a 700 ms reverse animation when a correct Find card closes.
- Reuses the exact measured source-card transform from the zoom-in.
- Fades the reveal backdrop while the card returns to its original position.
- Advances to the next round only after the reverse animation finishes.
- Keeps Home, replay and new-session cancellation immediate.
- Added mid-animation, round-lock, voice-timing and cancellation regression coverage.

# v40 - Noughts end-board pause

- Added a 3.4-second pause after a Noughts & Crosses win before the message card appears.
- Added a 3.2-second pause after a draw.
- Matched the established Connect Four end-board timing.
- Kept the completed board locked, visible and highlighted during the pause.
- Kept the popup timer session-owned so Home, replay or a new game cancels it.
- Added win-pause timing, cancellation and desktop/tablet/phone visual regression coverage.

# v39 - Find repeat cap and Noughts opponents

- Limited each Find round to five idle prompt repeats after the initial prompt.
- Resets the repeat count only when a new Find round begins.
- Replaced Noughts & Crosses' obsolete difficulty-first computer route with the same combined opponent-card selector used by Connect Four.
- Shows all eligible Noughts computer characters with their Noughts-specific skill levels.
- Launches Noughts directly after the computer opponent is selected.
- Removed the now-obsolete difficulty screen, Step 4 opponent screen, router entries and delegated handler.
- Added repeat-cap, opponent-card, skill-band, launch and cross-viewport regression coverage.

# v38 - Reliable Find zoom

- Replaced the correct-card CSS-only scale with a measured source-to-fullscreen zoom.
- Captures the tapped card's position and size before opening the reveal.
- Animates the enlarged card from that exact location for a clearly visible 700 ms zoom.
- Retains a CSS fallback for browsers without the Web Animations API.
- Preserved voice completion, three-second hold, session cancellation and next-round ownership.
- Added regression checks proving the source-card animation is active and transformed mid-zoom.

# v37 - Find success reveal

- Added a large correct-card reveal to Find Grandad and Find the Character.
- Starts the existing success voice while the identified card is visible.
- Keeps the card visible until the voice ends, then holds it for another three seconds.
- Advances only after the reveal closes and the original round still owns the interaction.
- Cancels the reveal, speech callback and delayed progression when Home, replay or a new session starts.
- Preserved Malcolm's wrong-choice zoom, five-second tune and same-round resume.
- Added controlled voice-end timing tests and desktop, tablet and phone reveal baselines.

# v36 - Standardized screen structure

- Added one active-router helper for Back, Step, title and instruction ordering.
- Standardized menu wording around short action titles and one-line guidance.
- Standardized completion dialogs so Play again is primary and Home is the exit action.
- Added desktop, tablet and phone screenshot baselines for the home and stepped-choice screens.
- Added regression checks for header order and horizontal overflow.
- Preserved menu layout, game rules, AI, timing, assets, settings, themes and interaction flows.

# v35 - Standardized menus and controls

- Standardized active clean-menu button height, borders, corner radius, typography, spacing and shadows.
- Standardized primary, secondary, active, disabled, hover, pressed and keyboard-focus states.
- Standardized Back, utility and Settings controls.
- Standardized character-card interaction feedback while preserving card layout and difficulty bands.
- Standardized in-game Play again/Home controls, modal actions and Find-game end actions.
- Scoped all new rules to active menu/action controls so Connect Four cells, drop controls, Noughts cells and Memory cards remain unchanged.
- Preserved menu order, control positions, responsive structure, rules, AI, timing, assets, settings, themes and interaction flows.

# v34 - Session-owned overlays and regression tests

- Made Malcolm's special overlay, five-second timer, and 8-bit tune one cancellable session resource.
- Home, replay, or any new game session now removes an active Malcolm overlay and stops its tune without resuming the abandoned round.
- Replaced replay-button cloning with one baseline click handler per visible Play again button.
- Added a Playwright regression harness covering all five game routes, replay ownership, pending Memory timer cancellation, and Malcolm overlay completion/cancellation.
- Preserved all layouts, game rules, AI, timing values, voices, images, settings, themes, card visuals, and interaction flows.

# v33 - Clean baseline consolidation

- Removed the dormant v27 home/menu implementation and its unused navigation fallbacks.
- Removed the disabled MutationObserver-based Memory flip enhancer.
- Removed the duplicate Malcolm/Tess runtime roster mutation; the built-in roster and embedded manifest remain authoritative.
- Replaced clean-router reassignment of `showStartOpponentModal()` with explicit `skipStartModal` launcher options.
- Reduced clean-router startup from four scheduled attempts to one DOM-ready initialization.
- Removed unreferenced v27 home CSS and obsolete v29c marker globals.
- Preserved the stable baseline Memory renderer, session cleanup, Malcolm overlay visibility fix, and all active game behaviour.
- Preserved layouts, responsive behaviour, rules, AI, timing, voices, assets, settings, themes, teaching content, and interaction flows.

# v32x - Malcolm overlay visibility

- Fixed the Find the Character Malcolm wrong-choice overlay being hidden by the clean-router body quarantine rule.
- Explicitly allows `.gc33MalcolmDanceOverlay` to remain visible while the clean menu router is active.
- Preserved the existing trigger condition, Malcolm cardflip image, five-second 8-bit tune, round lock, and same-round resume behaviour.
- Preserved all game layouts, rules, timing values, assets, settings, and interaction flows.

# v32w - Lifecycle consolidation

- Routed clean-menu Noughts & Crosses, Card Flipping, Find games, replay, and Home transitions through the existing game-session cleanup owner.
- Moved the stable Card Flipping renderer into the baseline `renderMemoryMatch()` implementation.
- Removed the late runtime replacement of `renderMemoryMatch()`.
- Removed one redundant full Noughts & Crosses board render after each human move.
- Synchronized the HTML title, router build label, and build version.
- Added the required Andrew Bethell copyright and educational-use notices without changing the visible layout.
- Preserved game rules, AI, voices, timing values, responsive layout, turn banner, card appearance, assets, settings, and interaction flow.

# v32q — Find Grandad all-character targets

- Find Grandad now asks for all family characters, not only Grandad.
- Find Grandad continues to use the normal `assets/images/` portraits.
- Find the Character continues to use `assets/images/cardflip/` portraits.
- Correct and retry voice lines now name the active target character.

# v32p — Find idle prompt and Malcolm dance

- Added 10-second idle prompt repeat for Find Grandad and Find the Character.
- Find Grandad now prioritises normal `assets/images/` portraits.
- Find the Character keeps cardflip images.
- Malcolm wrong-click interruption added for Find the Character.

## v32n - Find Character voice timing and Loke pronunciation

- Fixes Find the Character correct-answer speech being cut short by delaying the next round until the spoken success line has time to finish.
- Keeps the displayed character name as Loke but speaks it as “Low-Key” in text-to-speech prompts.
- Stops Find Grandad / Find the Character end popups from reusing older character game-over audio, preventing unrelated lines such as “Game over. Play again. Let me beat you.”
- Preserves the Speak the Truth setting: Off says “No, but Malcolm is a shoe salesman”; On says “Try again.”

## v32m - Speak the Truth setting for Find the Character

- Added a Settings switch named **Speak the Truth** with On / Off choices only.
- Default is Off.
- In **Find the Character**, wrong answers now say **"No, but Malcolm is a shoe salesman"** when Speak the Truth is Off.
- When Speak the Truth is On, wrong answers say **"Try again."**
- **Find Grandad** keeps its existing wrong-answer prompt.

## v32k - Find the Character expansion

- Added **Find the Character** as a second find-style game alongside **Find Grandad**.
- The new mode randomly asks for family characters using name, persona, and clue prompts.
- Malcolm includes the extra Shoe Salesman prompt.
- Reuses existing difficulty, voice, zoom/flip, Play again, and Home patterns.

# v32g — Selection Animation + Noughts Play Again Polish

- Renamed Step 1 to "Choose your character".
- Renamed two-player Step 3 to "Choose player two's character".
- Added a centre zoom + card flip character-selection transition before advancing.
- Ensured Noughts & Crosses offers Play again at game over.
- Allowed game-over opponent pop-up modals to display during game mode.

# v32d responsive layout space fit

- Lightened the Connect Four button on the clean main menu so it no longer appears as an overly dark primary tile.
- Widened the clean menu router on desktop/tablet so player icons use available horizontal space instead of being constrained to a narrow centred column.
- Added viewport-fit responsive sizing for the player-selection cards, avatars, navigation buttons and game-choice buttons.
- Reset menu scroll position on each clean-menu render so returning from a game does not leave icon rows starting part-way down the page.
- Added card-count-aware Memory Match grid sizing: easy, medium and hard boards now select columns/rows based on available screen space.
- Tightened Noughts & Crosses and Memory Match full-screen game layouts so headers, boards and controls fit better on PC, iPad and iPhone.


## v32c - Cardflip Image Path Fix

- Made Card Flipping use the actual files present in `assets/images/cardflip/`.
- Fixed the previous hard-coded `.jpg` lookup, which missed the current `.PNG` files on case-sensitive hosting.
- Added an inline cardflip image map so GitHub Pages does not need to scan the folder.

# v32b Menu-only fix

- Replaced the brittle menu/router patch with a standalone defensive menu script.
- Menu now owns only navigation: game selection, player selection, opponent selection, card difficulty, help, and simple settings.
- Opponent lists exclude the selected first player so nobody can play themselves.
- Card Flipping difficulty now uses only characters with normal app image fallbacks.
- If a game engine throws, the menu shows a clear error instead of leaving a blank screen.
- Game rules/engines were not deliberately changed.


## v14e - Difficulty levels and voice reset fix
- Built from `grandad_connect_v14d_dwell_snap_drag_refinement.zip`.
- Added computer difficulty selector for Player vs computer: Easy, Normal, Hard and Expert.
- Default computer difficulty is Hard for stronger play out of the box.
- Added stronger AI logic: immediate wins, immediate blocks, fork/threat blocking, centre-biased scoring, and minimax look-ahead for Hard/Expert.
- Improved defence against simple bottom-row repeated four-in-a-row patterns.
- Added game-session timer cancellation so old thinking, idle, reaction and game-over timers do not leak into a restarted game.
- Hardened voice playback with an audio token so old delayed/missing-file voice sequences cannot continue after a new game starts.
- Preserved v14d single-piece dwell-to-snap drag behaviour and release-only drop.

# Changelog

## v14c — default Grandad and smoother armed drag
- Built from `grandad_connect_v14b_single_top_piece_snap_drag_fix.zip`.
- Changed setup defaults so Grandad is preselected as the main player when entering player selection.
- Kept the single active top piece, but made drag feel smoother by allowing the full-size piece to follow the pointer during free dragging.
- Added an armed placement state: when the piece is dragged downward near the top/mouth of a valid column, it snaps into the column as if being inserted for the drop.
- The piece only drops on release while in that armed placement state. Dragging around the board without arming the column no longer drops accidentally.

## v14b — single active top piece and snap-drag fix
- Built from `grandad_connect_v14_avatar_animation_piece_drag_ui_polish.zip`.
- Changed the top-of-board controls so only one coloured active turn piece is visible instead of one piece above every column.
- Kept tap-to-drop by column. Invisible column hit areas remain active for easy tapping.
- Changed drag behaviour so the active piece snaps horizontally into the selected column while dragging rather than floating as a ghost over the board.
- Added a placement preview state when the piece is dragged downward into the board/column area; release there drops the piece.
- Preserved v14 avatar animation, settings/menu changes, final-popup delay, personality hooks and UI wording polish.
## v14 — avatar animation, piece controls and UI polish
- Built from `grandad_connect_v13_avatar_and_endgame_polish.zip`, preserving v12/v13 selection guard, idle prompt variation, larger avatars and Player 2/opponent final game-over line.
- Removed the large main-menu Settings button; Settings remains the small top-bar button beside Help.
- Moved Voice and avatar setup into the password-protected Settings modal.
- Renamed Human vs human to Two player game for continuity with Player vs computer.
- Replaced the numbered red/yellow drop squares above the columns with the current coloured game piece.
- Added pointer drag support: tap a column/piece to drop normally, or drag the current piece left/right and release only after dragging downward into a valid column.
- Delayed the final game-over popup for a few seconds so the board and winning/losing position remains visible before the final message appears.
- Added subtle active-turn avatar bounce and speaking pulse polish.
- Added extra personality prompt fallbacks/events including `have-a-look`, `your-move`, `nearly-there`, `good-thinking`, `clever-move`, and `watch-this`.
- Updated setup/help wording to describe tap or downward-drag controls.

## v13 — avatar and endgame polish
- Built from the v12 voice-prompt/idle-timer/selection-guard build, preserving the current working game flow.
- Increased in-game player avatar size and enlarged the hero avatar used in greeting/game-over modals.
- Added subtle avatar image scaling so cropped/cut-out avatars fill their boxes better.
- Changed game-over behaviour so Player 2 / the computer opponent always gets the final spoken line.
- Updated game-over actions to: Play again, Change players, Home.
- Kept one rolling changelog file only: `CHANGELOG.md`.

## v12 — voice prompt variation, idle timer, selection guard
- Built from `C4-main.zip`, the current source-of-truth baseline.
- Reduced repetitive immediate “your turn” voice prompts; each active player now gets only the first couple of immediate turn prompts.
- Added a 15-second idle reminder loop for player-vs-computer games. If the human player does not act, the opponent repeats a varied reminder every 15 seconds.
- Added random/rotating use of extra recorded prompts where available: `take-your-time`, `not-so-fast`, `you-blocked-me`, `nice-move`, `move`, and `one-more-game`.
- Added game-over audio sequence support so `one-more-game` can play after `i-win`, `you-win`, or `game-over` where browser audio allows it.
- Added selection guard: the same person/avatar cannot be selected on both sides. The already-selected person is greyed out in the opposite selection panel.
- Added defensive Start Game block if both sides somehow have the same character selected.
- Kept one rolling changelog file only: `CHANGELOG.md`.

## v14d - Dwell-to-snap drag refinement
- Refined piece dragging so the active piece follows the pointer/finger freely without immediately snapping.
- Added a short hold/dwell requirement near the top of a valid column before the piece arms/snaps into the placement position.
- Preserved release-only dropping: hovering near a column does not drop the piece until the player lets go while armed.

## v15 - Tournament Edition
- Added Family Challenge mode with progressive opponents: JJ, Leon, Loke, Isabella, Joshua, Granny, Grandad.
- Added Leon and Loke placeholder avatars for later photo replacement.
- Added profile selector and per-profile challenge progress saved in localStorage.
- Added trophy cabinet scaffolding and Hall of Fame pedestal screen.
- Added Voice System 2.0 event categories: greeting, thinking, goodMove, blocked, nearWin, win, lose, idle and unlock.
- Added browser speech-synthesis fallback so voices can remain active when matching audio files are missing.
- Added Option A app icon assets: Grandad smiling behind a Connect Four board.
- Updated main menu wording and future-games placeholder for noughts and crosses, memory match, checkers and remote play.

## v16 - Professor Pixel and Ultimate Champion polish
- Added Professor Pixel as the named computer/final-boss character.
- Extended Family Challenge ladder so Professor Pixel unlocks after Grandad.
- Added Master difficulty for the final boss.
- Added Ultimate Champion, Beat Professor Pixel, 10 Wins and 3-Win Streak trophies.
- Expanded Hall of Fame into Family Champion and Ultimate Champion podium states.
- Added variable AI thinking delays by difficulty.
- Strengthened the winning-four glow so the final board state is easier to see.
- Refreshed app icon assets and added the missing computer avatar image.



## v17 - Family avatar cards and real avatar integration
- Replaced Leon and Loke placeholders with supplied character avatars.
- Refreshed Grandad, Granny, Joshua, Isabella, JJ, Leon and Loke image assets from the supplied avatar set.
- Added character personality/difficulty metadata.
- Added Character Cards from the main menu to show ladder status, unlocked characters and defeated characters.
- Refreshed app icon using Grandad plus a Connect Four board motif.
- Preserved one rolling CHANGELOG.md.

## v18 - Speaking avatar, stars, and Hall of Fame polish
- Added Challenge Stars menu and per-profile star tracking.
- Added star rewards for Family Challenge wins, Family Champion, and Ultimate Champion completion.
- Added unlock celebration panel when the next challenger is opened.
- Added a more complete Hall of Fame scene with cheering family avatar row.
- Improved speaking-avatar visual feedback with a pulsing speech ring.
- Added Star Collector trophy scaffold.
- Updated menu/version copy to v18.

## v19 - Polish and stability pass

- Refined counter drop animation with a more natural settle/bounce at the landing cell.
- Strengthened winning-four visual treatment with glow, pulse and sparkle overlay.
- Added a clearer AI thinking banner during computer turns.
- Extended the final-board pause before game-over modal appears so players can see the winning position.
- Tightened voice playback cleanup so completed clips clear the active audio reference and avoid stale speech bubbles during ongoing play.
- Preserved v18 profile, star, trophy, character-card, Hall of Fame and Professor Pixel systems.

## v20 - Noughts & Crosses Games Hub

- Added **Noughts & Crosses** as the first extra game under the Grandad's Games direction.
- Renamed the header from Connect Four-only wording to **Grandad's Games**.
- Added a main-menu Noughts & Crosses button.
- Added a full Noughts & Crosses game screen using the current profile avatar as X and Professor Pixel as O.
- Added Noughts & Crosses AI with win/block logic and minimax behaviour for Hard, Expert and Master difficulty settings.
- Reused existing voice fallback so Professor Pixel can speak in the Noughts & Crosses module.
- Added win-cell highlighting for Noughts & Crosses.
- Preserved Connect Four v19 behaviour, avatars, challenge progress, trophies, Hall of Fame and voice/timer cleanup.


## v20b - Noughts & Crosses fixed-grid patch
- Fixed Noughts & Crosses board cells so the nine boxes stay equal and stable.
- Added explicit 3x3 grid rows, fixed square cell sizing, border-box sizing, overflow control and non-layout-changing win highlight.
- Preserved v20 gameplay, profiles, voices, avatars, trophies and Connect Four behaviour.


## v20c - Brighter Noughts & Crosses Board

- Brightened the Noughts & Crosses board cells for better visibility.
- Increased X/O contrast and size for easier viewing at distance.
- Added raised/tactile cell styling with clearer hover/focus feedback.
- Improved winning-cell gold highlight while preserving the fixed equal-cell layout from v20b.

## v20d - Noughts & Crosses high-contrast tile pass
- Removed global disabled-button opacity/filter from occupied Noughts & Crosses cells so played squares no longer appear dark grey-blue.
- Added explicit X/O cell classes with brighter white-tinted backgrounds.
- Increased X/O symbol size and contrast.
- Brightened the board blue while preserving the fixed-grid sizing from v20b/v20c.
- Strengthened winning-cell gold highlight.

## v21 - Memory Match
- Added Memory Match as a third family game from the main menu.
- Uses family avatar cards and a 12-card / 6-pair matching layout.
- Added memory move counter, pair counter, completion popup, and profile star reward.
- Preserved Connect Four v19/v20 polish and Noughts & Crosses v20d bright board improvements.


## v21b - Memory Match bright-card visual fix
- Removed global disabled-button dimming from flipped and matched Memory Match cards.
- Brightened completed card faces, avatar images, and character names.
- Changed matched-card styling to a bright gold celebration border/glow instead of a muted disabled appearance.
- Preserved Memory Match gameplay, Connect Four, Noughts & Crosses, profiles, stars, and trophies.

## v24 - Character Manager

- Added `data/characters.json` as the editable character manifest.
- Added Character Manager panel under Settings.
- App can now load character roster, avatar paths, difficulty labels and challenge inclusion from JSON.
- Added `CHARACTER_MANAGER.md` with instructions for adding new characters.
- Preserved built-in roster as fallback if the manifest is missing or unavailable.
- Kept rolling changelog structure.

## v24b - Character Manager Andrew/Marilyn fallback fix

- Added Andrew and Marilyn to the built-in fallback roster as well as `data/characters.json`.
- Added an embedded character-manifest fallback so locally opened files can still load the updated roster if browser `fetch()` blocks `data/characters.json`.
- Andrew and Marilyn are available for player and opponent selection.
- Preserved the editable `data/characters.json` manifest system.

## v25 - Grouped Character Roster

- Added character group metadata to `data/characters.json`.
- Added grouped character browsing for larger rosters.
- Added character search box on avatar selection grids.
- Added group display to the Character Manager panel.
- Recommended groups: Core Family, Children, Extended Family, Special, Other.
- Preserved v24 Character Manager manifest loading and embedded/local fallback.

## v25b - Malcolm and Tess roster fix

- Added Malcolm and Tess to `data/characters.json`.
- Copied uploaded Malcolm/Tess images into `assets/images/`.
- Added Malcolm and Tess to human/player selection and opponent selection.
- Added Malcolm and Tess to the embedded manifest fallback for local testing.
- Added a runtime fallback patch so Malcolm and Tess still appear if local JSON loading is blocked.
- Preserved grouped roster and character search from v25.

## v26 - Full Memory Match and Cleaner Main Menu

- Added `includeInMemoryMatch` metadata to the character manifest.
- Memory Match now uses all non-computer family characters from the roster rather than a small fixed list.
- Added a Memory Match notice confirming all family faces are included.
- Added a simpler main menu grouping: Play a game, Family Challenge, Progress, Help & Settings.
- Preserved grouped character roster, Character Manager manifest system, and Malcolm/Tess roster fix.

## v27 - Family Challenge Home Redesign

- Added a new Grandad's Games home screen.
- Added current-player card with avatar, stars, trophies and cards.
- Replaced confusing first screen emphasis with large game cards: Connect Four, Memory Match, Noughts & Crosses.
- Added a visual Family Challenge path with avatars, current-opponent highlight and progress bar.
- Added cleaner Progress area for Character Cards, Hall of Fame, Stars and Trophies.
- Moved version/developer emphasis away from the home screen.
- Preserved v26 full Memory Match roster and Character Manager manifest system.

## v27b - Memory Match Flip Cards

- Added 3D flip-card styling for Memory Match.
- Added face-down blue question-mark card backs.
- Revealed cards flip to bright family-avatar fronts.
- Matched cards stay bright with a gold border/glow.
- Added runtime enhancer so existing Memory Match card markup is upgraded without changing core game logic.
- Preserved v27 Family Challenge home redesign.

## v28 - Simplified Connect Four Focus

- Pulled the home screen back to a simpler structure.
- Made Connect Four the primary action again.
- Kept Memory Match as a simple matched-cards game.
- Removed the busy Family Challenge path emphasis from the main menu.
- Disabled the v27b flip-card auto-enhancer and restored simpler bright Memory Match cards.
- Simplified bottom actions to Settings and Help, with Characters and Family Cards as secondary options.

## v29 - Clean Navigation Accessible Rebuild

- Rebuilt the user navigation layer from scratch with seven simple screens:
  Home, Mode Select, Two-Player Select, vs Computer Select, Card Game Difficulty, How to Play, and Settings.
- Removed main-menu emphasis on profiles, challenge mode, trophies, hall of fame, progress bars and collection grids.
- Added stroke-friendly accessibility rules: large buttons, high contrast, one decision per screen, no dropdowns.
- Added Connect Four and Noughts & Crosses difficulty labels per character.
- Added Card Flipping difficulty choices: Easy 8 cards, Medium 14 cards, Hard 22 cards.
- Kept game logic, existing assets, audio logic and character data intact.
- Settings now only has persisted text size and sound preference.

## v29b - Tidied Menu System

- Reworked the clean navigation layer so only one menu system is visible.
- Clarified the Home screen: one game choice, then one next decision.
- Clarified Connect Four/Noughts flow: game -> mode -> character selection.
- Clarified Card Flipping flow: game -> player -> difficulty.
- Improved large-button labels with short plain-language hints.
- Kept profiles, trophies, challenge paths and progress systems out of the visible navigation.
- Preserved game logic, assets, character data, audio logic and flattened ZIP structure.

## v29c - Guided Game Flow

- Main menu now shows only the three games.
- Removed two-player/computer choices from the main menu.
- New flow: game -> choose player -> choose opponent type -> choose opponent/difficulty -> game.
- Card Flipping remains single-player: game -> choose player -> choose card difficulty -> game.
- Two-player opponent list excludes the selected player.
- Computer flow asks for difficulty first, then shows opponents at that difficulty.
- Preserved game logic, character data, images, audio logic, and flattened ZIP structure.

## v29e - Auto Flow and Setup Fix

- Main menu title changed to “Choose a game”.
- Main menu buttons now use simple graphics and no extra descriptive text.
- Card Flipping now goes straight from the main menu to difficulty selection.
- Connect Four and Noughts & Crosses auto-advance after choosing the player.
- Step 2 now shows the chosen player picture/name, then offers Two Player or vs Computer.
- Opponent selection auto-starts the game after tapping an opponent.
- Added difficulty-first computer flow.
- Suppressed the broken old “Setup” overlay that was blocking game start.
- Preserved flattened ZIP structure.

## v30 - Cardflip Image Folder

- Added `assets/images/cardflip/` for alternate Card Flipping Game photos.
- Added `assets/images/cardflip/README.md` with naming instructions.
- Card Flipping Game now looks for `assets/images/cardflip/<name>.jpg` first.
- If a cardflip image is missing, the image falls back to the existing character portrait.
- Preserved v29e guided flow and setup-overlay suppression.

## v31 - Clean Router Audit

- Added a new clean router that separates visible navigation from the preserved game engines.
- Preserved Connect Four, Noughts & Crosses, and Card Flipping game logic.
- Bypassed the old setup screen and old setup modal.
- Suppressed the old opponent-ready modal so Connect Four starts directly.
- Rebuilt the visible menu flow from scratch with simple accessible screens.
- Card Flipping now launches directly from difficulty selection.
- Noughts & Crosses now launches using selected player/opponent.
- Added `AUDIT_V31.md` documenting separation and remaining legacy code.

## v32a - startup/router null-safe repair
- Fixed startup crash caused by legacy menu buttons being removed while old JavaScript still attached listeners to their IDs.
- Made legacy menu event binding null-safe so the clean gc31 menu can coexist with preserved game engines.
- Guarded removed profile controls so `profileSelect` / `profileProgressText` no longer break startup.
- Preserved the existing Connect Four, Memory Match and Noughts & Crosses game engines.

## v32h - Flip-card visual/stability tidy
- Removed the character name text from the Card Flipping / Memory Match cards.
- Enlarged the card-front images so they occupy almost the full card face.
- Replaced the clean-router Memory Match renderer with a stable DOM renderer. Cards are now created once per board and then updated by class/state instead of rebuilding the whole board after every click.
- Fixed the re-flip bug where the first exposed card could visually flip again when the second card was selected.
- Preserved preloading of card-flip images and the end-of-game Play again/Home opponent pop-up.
- Rewired the visible Memory Match Play again button to relaunch the same clean-router Card Flipping game/difficulty rather than falling back to the older hidden memory starter.


## v32l - Find Character cardflip images
- Find Grandad / Find the Character round cards now use `assets/images/cardflip/` images first.
- The chosen-card zoom/flip animation also uses the cardflip image during find games.
- Find-game image preloading now preloads cardflip images before the normal portrait fallbacks.
- Added robust image fallback chain so case/path mismatches fall back to normal portraits before showing initials.
