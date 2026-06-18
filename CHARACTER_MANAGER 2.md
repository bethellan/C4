# Grandad Connect Character Editor

Version: v43

For the complete step-by-step workflow, image and audio save locations, and Manifest Export explanation, see `CHARACTER_EDITOR_USER_MANUAL.md`.

## Open the editor

Open `character-editor.html` in Microsoft Edge or Google Chrome.

Select **Choose game folder**, then choose this v42 folder. The editor reads the current character manifest and can save images and data directly into the project.

## Add or edit a person

1. Select an existing person, or choose **Add person**.
2. Edit the name, occupation, initials, groups, game inclusion and skill levels.
3. Choose an image.
4. Drag the image to position it and use the zoom control to crop it.
5. Choose **Normal image** or **Card-flip image**.
6. Save the image, then choose **Save character data**.

The editor writes:

```text
assets/images/<key>.webp
assets/images/cardflip/<key>.webp
data/characters.json
data/characters.generated.js
data/cardflip-images.json
```

`characters.generated.js` is required because browsers often block JSON loading when `index.html` is opened directly from disk.

## Recommended image settings

Use:

```text
800 x 800 pixels
WebP
84% quality
```

This is large enough for the game's zoomed cards while usually keeping each image around 50-180 KB. Use 1024 x 1024 only when the source contains fine detail that remains visible in the game.

## Removing a person

Select the person and choose **Remove person**. Professor Pixel is retained as the system computer character. The editor can also remove that person's normal and card-flip image files when direct folder access is active.

Keep at least two selectable people and two Card Flipping people so those game modes remain playable.

To keep the person but remove one portrait, use **Remove normal image** or **Remove card-flip image** beside the saved path. Each button deletes only that image and immediately updates the character data. If the normal image is absent but a card-flip image remains, some game screens may use the card-flip portrait as a fallback.

## Voice recording

The Character Editor includes microphone recording, playback, redo and direct-save controls. Character clips are stored under:

```text
assets/audio/<character-key>/
```

Phase 1 voice planning is stored in:

```text
data/voice-catalog.js
assets/audio/narrator/
assets/audio/narrator/names/
```

The catalogue defines shared character events, narrator events, supported formats and recording-path conventions. Noughts & Crosses uses the character events for its opening, computer moves, turns and outcomes. Find Grandad and Find the Character use narrator/name clips for prompts, retries, correct answers and completion. Card Flipping retains its current speech behavior.

After choosing the game folder, the editor's **Voice recordings** panel scans every supported audio extension and reports:

- Found and missing selected-character clips
- Essential recording progress
- Narrator prompt availability
- The selected character's reusable narrator name clip
- The exact expected path for every missing recording

Found recordings can be played from the inventory.

## Recording voices

After choosing the game folder:

1. Select a character.
2. Choose **Record** beside a missing clip or **Replace** beside an existing clip.
3. Read the displayed phrase.
4. Stop and play the recording back.
5. Save it or record it again.

The editor saves directly to the exact character, narrator or narrator-name path. Replacing a clip requires confirmation and removes older extension variants for that event so the newly recorded file takes priority.

Closing or cancelling the recorder stops the microphone and discards the unsaved recording.

Copyright © Andrew Bethell. All rights reserved.
Developed by Andrew Bethell in his own time and at his own expense.

Educational simulation tool. Not for clinical decision-making.
