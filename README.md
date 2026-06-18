# Grandad Connect v12

A static, GitHub Pages-compatible Connect Four game for family play.

## Current build

- Version: v12
- Base: v11 stable runtime fix
- v9 and v10 remain discarded

## What changed in v12

- Larger in-game avatars.
- Cleaner player cards with repetitive role text removed.
- Only the Voice toggle remains under the board.
- Play again is now offered only in the end-of-game popup.
- Added iPhone/iPad app icon support.
- Added preferred smaller avatar image formats (`.webp`, `.jpg`, `.jpeg`) before `.png`.

## Key files

- `index.html` — main game
- `assets/images/` — avatar images
- `assets/icons/` — app icons
- `assets/audio/` — character and fallback voice folders
- `CHANGELOG.md` — single rolling changelog
- `BUILD_VERSION.txt` — current build note
- `site.webmanifest` — app icon manifest

## Settings

Settings password:

```text
4321
```

## Faster avatar images

The game now looks for each avatar image in this order:

```text
assets/images/grandad.webp
assets/images/grandad.jpg
assets/images/grandad.jpeg
assets/images/grandad.png
```

Use the same naming pattern for Granny, Joshua, Isabella, JJ and Computer.

## Test before release

1. Open `index.html`.
2. Click Human vs human — setup should open.
3. Click Player vs computer — setup should open.
4. Start a game.
5. Confirm larger avatars display correctly.
6. Confirm there is no Play again / Full screen / Home button under the board.
7. Finish a game and confirm Play again appears in the popup.
8. Open Settings with password `4321`.
