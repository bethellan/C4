# Voiceover recording prompts for Grandad Connect v14

## Important voice rule

Grandad is a silent avatar. Do not put spoken prompts in a Grandad folder.

There is **no shared kids prompt folder**. Every speaking character has their own audio folder:

```text
assets/audio/granny/
assets/audio/joshua/
assets/audio/isabella/
assets/audio/jj/
assets/audio/computer/
```

Use the same filenames in each folder. The app checks the speaking character's folder only.

---

# 1. Core prompts to record for each speaking person

Record these first for Granny, Joshua, Isabella and JJ.

| Prompt to record | Filename |
|---|---|
| Hello. Let's play Connect Four. | `start.mp3` |
| Hello Grandad. Let's play Connect Four. | `start-grandad.mp3` |
| Hello Granny. Let's play Connect Four. | `start-granny.mp3` |
| Hello Joshua. Let's play Connect Four. | `start-joshua.mp3` |
| Hello Isabella. Let's play Connect Four. | `start-isabella.mp3` |
| Hello JJ. Let's play Connect Four. | `start-jj.mp3` |
| My turn. | `my-turn.mp3` |
| There we go. | `move.mp3` |
| Not so fast. | `not-so-fast.mp3` |
| Your turn. | `your-turn.mp3` |
| Your turn Grandad. | `your-turn-grandad.mp3` |
| Your turn Granny. | `your-turn-granny.mp3` |
| Your turn Joshua. | `your-turn-joshua.mp3` |
| Your turn Isabella. | `your-turn-isabella.mp3` |
| Your turn JJ. | `your-turn-jj.mp3` |
| I win. Good game. Play again? | `i-win.mp3` |
| You win. Well done. Play again? | `you-win.mp3` |
| Game over. Play again? | `game-over.mp3` |
| Take your time. | `take-your-time.mp3` |
| Have a good look at the board. | `have-a-look.mp3` |
| Your move. | `your-move.mp3` |
| You might have a good move there. | `nearly-there.mp3` |
| Good thinking. | `good-thinking.mp3` |
| Clever move. | `clever-move.mp3` |
| Watch this. | `watch-this.mp3` |

Example:

```text
assets/audio/granny/start-joshua.mp3
assets/audio/granny/your-turn-jj.mp3
assets/audio/jj/your-turn-granny.mp3
assets/audio/isabella/i-win.mp3
assets/audio/joshua/not-so-fast.mp3
```

---

# 2. Optional modular prompts inside each character folder

This supports recording **"Your turn"** separately, then recording the names separately. These files still go inside each speaking character's own folder, not a shared folder.

| Prompt to record | Filename |
|---|---|
| Your turn. | `your-turn.mp3` |
| Grandad. | `grandad.mp3` |
| Granny. | `granny.mp3` |
| Joshua. | `joshua.mp3` |
| Isabella. | `isabella.mp3` |
| JJ. | `jj.mp3` |

Example for Granny's voice:

```text
assets/audio/granny/your-turn.mp3
assets/audio/granny/grandad.mp3
assets/audio/granny/jj.mp3
```

The app first tries the complete phrase, for example `your-turn-jj.mp3`. If that is missing, it can use `your-turn.mp3` plus `jj.mp3` from the same speaker folder.

---

# 3. Computer voice prompts

If the opponent is the generic Computer, save robotic/computer-style recordings here:

```text
assets/audio/computer/
```

Use the same filenames:

```text
start.mp3
start-grandad.mp3
start-granny.mp3
start-joshua.mp3
start-isabella.mp3
start-jj.mp3
my-turn.mp3
move.mp3
not-so-fast.mp3
your-turn.mp3
your-turn-grandad.mp3
your-turn-granny.mp3
your-turn-joshua.mp3
your-turn-isabella.mp3
your-turn-jj.mp3
i-win.mp3
you-win.mp3
game-over.mp3
take-your-time.mp3
have-a-look.mp3
your-move.mp3
nearly-there.mp3
good-thinking.mp3
clever-move.mp3
watch-this.mp3
```

---

# 4. Extra fun prompts for later

These are not all wired into v14 yet, but worth recording later.

| Prompt to record | Possible filename |
|---|---|
| Nice move. | `nice-move.mp3` |
| Clever move. | `clever-move.mp3` |
| I blocked you. | `blocked-you.mp3` |
| You blocked me. | `you-blocked-me.mp3` |
| That was close. | `that-was-close.mp3` |
| Four in a row. | `four-in-a-row.mp3` |
| Choose a column. | `choose-a-column.mp3` |
| Tap a number. | `tap-a-number.mp3` |
| One more game? | `one-more-game.mp3` |
| I love playing with you. | `love-playing-with-you.mp3` |

---

# 5. Recording rules

- Record each phrase as a separate file.
- Use MP3 if possible.
- Keep filenames lowercase and exactly as shown.
- Avoid spaces in filenames.
- Keep each phrase short and clear.
- Leave only a tiny pause at the start and end.
- If a file is missing, the app skips it and still works.
