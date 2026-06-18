# How to record and add voice prompts

## Recommended simple method

1. Open Voice Memos on an iPhone/iPad, or Sound Recorder/Voice Recorder on Windows.
2. Record one phrase at a time.
3. Rename/export each phrase using the exact filename from `VOICEOVER_RECORDING_PROMPTS.md`.
4. Convert to `.mp3` if the recorder exports `.m4a` or `.wav`.
5. Copy the MP3 into the correct character folder.
6. Test by opening `index.html` in a browser.

## Folder examples

Granny saying "Your turn JJ":

```text
assets/audio/granny/your-turn-jj.mp3
```

JJ saying "Your turn Granny":

```text
assets/audio/jj/your-turn-granny.mp3
```

Joshua saying "I win":

```text
assets/audio/joshua/i-win.mp3
```

Computer voice saying "My turn":

```text
assets/audio/computer/my-turn.mp3
```

## On Windows

After recording/exporting:

1. Unzip the app folder.
2. Open `assets`.
3. Open `audio`.
4. Open the right character folder, for example `granny`.
5. Paste the MP3 file there.
6. Make sure the file is named exactly, for example `your-turn-joshua.mp3`.

## On iPhone/iPad

Voice Memos usually exports `.m4a`. The app checks `.mp3`, `.webm`, `.mp4`, `.ogg`, `.wav`, and `.m4a` files with the same basename. Easiest options:

- AirDrop/email the recording to a computer, convert to MP3, rename, then copy into the folder.
- Or use GarageBand / a file converter to export MP3.

## Uploading to GitHub

Once the files are in the folders:

1. Open the GitHub repository folder on your computer.
2. Copy the changed `assets/audio/...` folders into the repository.
3. Commit the changes in GitHub Desktop.
4. Push to GitHub.
5. Reload the GitHub Pages site.

## Filename rule

Do not use filenames like:

```text
Your turn Grandad.mp3
Your_turn_grandad.mp3
your turn grandad.mp3
```

Use exactly:

```text
your-turn-grandad.mp3
```


## v14 start, idle and game-over windows

The large start-of-game opponent window uses `start.mp3` or `start-[player].mp3`.

The game-over window uses:

```text
i-win.mp3
you-win.mp3
game-over.mp3
```

For v14, these can include the Play Again question in the recording, for example: "I win. Good game. Play again?" Extra optional prompts now include `have-a-look`, `your-move`, `nearly-there`, `good-thinking`, `clever-move`, and `watch-this`.
