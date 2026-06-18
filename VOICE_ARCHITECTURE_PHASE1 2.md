# Voice Architecture Phase 1

## Purpose

Define one shared recording catalogue and stable folder conventions before integrating recording into the Character Editor or changing game playback.

## Active behavior through Phase 4

Connect Four continues to use:

1. Character-specific audio
2. Demographic fallback audio
3. Browser speech synthesis
4. Silent text

Noughts & Crosses now uses the same priority for:

- `start`
- `not-so-fast`
- `move`
- `your-turn`
- `i-win`
- `you-win`
- `game-over`

Find Grandad and Find the Character now use narrator recordings for:

- `find-intro`
- `find-again`
- `find-correct`
- `find-complete`

The Find resolver tries the named full prompt first, then shared narrator prompt plus reusable name clip, then generic narrator prompt, then browser speech.

Card Flipping retains its existing speech behavior.

## New baseline

`data/voice-catalog.js` owns:

- Character event metadata
- Narrator event metadata
- Supported audio extensions
- Character, narrator and name-clip folder conventions
- The agreed future playback priority

The game exposes read-only planning and path helpers:

```text
GC_GET_VOICE_RECORDING_PLAN()
GC_BUILD_CHARACTER_AUDIO_CHOICES(speaker, event, target)
GC_BUILD_NARRATOR_AUDIO_CHOICES(event, target)
```

## Narrator paths

Shared narrator clips:

```text
assets/audio/narrator/find-intro.webm
assets/audio/narrator/memory-start.webm
```

Reusable name clips:

```text
assets/audio/narrator/names/grandad.webm
assets/audio/narrator/names/granny.webm
```

For a named Find prompt, the future resolver can try:

1. `find-intro-grandad`
2. `find-intro` followed by `names/grandad`
3. `find-intro`

## Phase 4 ownership

`speakNoughtsEvent()` is the single Noughts event-playback owner. The active setup router and legacy starter both call it for the opening announcement. AI move and result handlers call it directly without changing board rendering or popup timers.

`findSpeak()` remains the single Find voice owner. It now owns recorded narrator playback because the correct-card reveal must know exactly when voice playback ends before starting the three-second hold and zoom-out.

The older `speakNoughts()` helper remains in place for Memory prompts, preventing the Noughts event integration from changing Memory behavior.

## Risks and assumptions

- The Character Editor inventory verifies which recordings physically exist.
- Browser speech remains necessary until each activated event has a recording.
- Concatenated clips may need a short timing gap during the playback integration phase.
- Dynamic characters require one narrator name clip for fully recorded Find prompts.

## Preserved systems

- Existing Connect Four voice behavior and path order
- Memory speech behavior
- Find Malcolm interruption, prompt-repeat cap and success-card timing
- Noughts board rendering, AI difficulty and end-popup timing
- Voice toggle and fallback settings
- Existing JJ and Joshua recordings
- Game timing, overlays, menus and visual layout

Copyright © Andrew Bethell. All rights reserved.
Developed by Andrew Bethell in his own time and at his own expense.

Educational simulation tool. Not for clinical decision-making.
