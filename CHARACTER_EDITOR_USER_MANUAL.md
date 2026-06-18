# Grandad Connect Character Editor User Manual

## Overview

`character-editor.html` manages:

- Character details and game inclusion
- Normal avatar images
- Card-flip images
- Character, narrator and name voice recordings
- The character manifest used by the game

Use Microsoft Edge or Google Chrome. Direct saving requires the browser's folder-access feature.

## 1. Open The Game Folder

1. Open `character-editor.html`.
2. Select **Choose game folder**.
3. Choose the main Grandad Connect folder containing:
   - `index.html`
   - `assets`
   - `data`
4. Approve read/write access when the browser asks.

The status bar confirms the folder name. Direct save controls remain unavailable until a folder is open.

## 2. Choose Or Add A Character

The **Characters** view lists the current roster.

To edit an existing character:

1. Select the character.
2. Choose **Character details**, **Images**, or **Voice recordings**.

To add a character:

1. Select **Add person**.
2. Complete the Character Details screen.
3. Add the required images.
4. Select **Save all changes** from the Characters view.

Use **Back to characters** or the **Characters** menu button to choose another person.

## 3. Edit Character Details

The Details view controls:

- Key and audio-folder name
- Display name and initials
- Occupation or role
- Gender and age profile
- Character group
- Connect Four and Noughts & Crosses difficulty
- Description
- Game and opponent inclusion

### Commit The Detail Changes

1. Select **Apply details** to apply the form to the editor's working roster.
2. Return to **Characters**.
3. Select **Save all changes** to write the changes into the game folder.

**Apply details** alone does not write the manifest files to disk.

**Save all changes** writes:

```text
data/characters.json
data/characters.generated.js
data/cardflip-images.json
```

Refresh or reopen `index.html` after saving.

## 4. Edit Images

The Images view contains two independent editors:

- **Normal avatar**: menus, player cards and Find Grandad
- **Card-flip image**: Card Flipping and Find the Character

On a wide screen they appear side by side. On a narrow screen they stack vertically.

Each editor has its own image, crop position, zoom, size, format and quality.

### Load An Image

Use either:

- **Load new image** to choose a source image from the computer
- **Load current avatar/card image** to edit the image already stored in the game

Use **Fill crop** to reset the image so it fills the square crop.

Drag the image to position it. Use **Zoom** to adjust the framing.

Recommended output:

```text
800 x 800
WebP
84% quality
```

### Save An Image Into The Game

Select:

- **Save to avatar folder**, or
- **Save to card-flip folder**

The editor saves the optimized image and immediately updates the manifest files.

Normal avatars are stored in:

```text
assets/images/<character-key>.<extension>
```

Card-flip images are stored in:

```text
assets/images/cardflip/<character-key>.<extension>
```

Refresh or reopen `index.html` after saving.

### Download An Image

**Download avatar** and **Download card image** create optimized files in the browser's Downloads location. Downloading does not install the image into the game or update the manifest.

Use download when:

- No game folder is open
- You want a separate copy
- You want to inspect the optimized file before manually placing it

## 5. Record Voice Clips

Open **Voice recordings** after selecting a character.

The inventory shows:

- Selected-character recordings
- Essential recording progress
- Narrator recordings
- The reusable narrator name clip
- Missing and existing clips

### Create Or Replace A Recording

1. Select **Record** beside a missing clip or **Replace** beside an existing clip.
2. Allow microphone access.
3. Read the displayed phrase.
4. Select **Stop**.
5. Play the recording back.
6. Select **Save recording**.

**Save recording** is the commit point. Closing or cancelling the dialog discards the unsaved recording.

Character recordings are stored in:

```text
assets/audio/<character-key>/
```

Narrator recordings are stored in:

```text
assets/audio/narrator/
```

Narrator name clips are stored in:

```text
assets/audio/narrator/names/
```

When replacing a clip, the editor asks for confirmation and removes obsolete extension variants after saving the replacement.

## 6. Choose Another Character

1. Select **Back to characters** or **Characters**.
2. Select another person.
3. Choose Details, Images or Voice.

Applied detail edits remain in the working roster, but use **Save all changes** before closing the editor.

Image and voice save commands write their files immediately when a game folder is open.

## 7. Export Manifest

**Export manifest** downloads a copy of:

```text
characters.json
```

It is useful for:

- Keeping a roster backup
- Reviewing the character data
- Moving roster data to another copy of the project
- Working in a browser that cannot directly open the game folder

Exporting does not update the active game folder. For normal editing, use **Choose game folder** and **Save all changes**.

If manually installing an exported manifest:

1. Rename it `characters.json` if necessary.
2. Place it in `data/`.
3. Regenerate or update `data/characters.generated.js`.

Direct folder saving is preferred because the editor updates all required manifest files together.

## Save Summary

| Action | Writes immediately? | Destination |
|---|---:|---|
| Apply details | No | Editor working roster |
| Save all changes | Yes | Three files under `data/` |
| Save avatar | Yes | `assets/images/` and manifests |
| Save card image | Yes | `assets/images/cardflip/` and manifests |
| Download image | No game update | Browser Downloads |
| Save recording | Yes | Relevant `assets/audio/` folder |
| Export manifest | No game update | Browser Downloads |

Copyright © Andrew Bethell. All rights reserved.
Developed by Andrew Bethell in his own time and at his own expense.

Educational simulation tool. Not for clinical decision-making.
