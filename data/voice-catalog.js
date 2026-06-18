window.GC_VOICE_CATALOG = {
  version: 1,
  notes: 'Shared voice-event and path catalogue. Phase 1 defines conventions without changing active game speech.',
  extensions: ['mp3', 'webm', 'mp4', 'ogg', 'wav', 'm4a'],
  characterFolder: 'assets/audio/{speaker}',
  narratorFolder: 'assets/audio/narrator',
  narratorNamesFolder: 'assets/audio/narrator/names',
  playbackPriority: [
    'character-specific recording',
    'demographic fallback recording',
    'narrator recording',
    'browser speech synthesis',
    'silent text'
  ],
  characterEvents: {
    start: { label: 'Start game', phrase: "Hello. Let's play.", games: ['connect', 'noughts'], essential: true },
    'your-turn': { label: 'Your turn', phrase: 'Your turn.', games: ['connect', 'noughts'], essential: true, supportsTarget: true },
    move: { label: 'Move made', phrase: 'There we go.', games: ['connect', 'noughts'], essential: true },
    'nice-move': { label: 'Praise move', phrase: 'Nice move.', games: ['connect', 'noughts'], essential: false },
    'not-so-fast': { label: 'Blocked player', phrase: 'Not so fast.', games: ['connect', 'noughts'], essential: true },
    'you-blocked-me': { label: 'Was blocked', phrase: 'You blocked me.', games: ['connect', 'noughts'], essential: false },
    'take-your-time': { label: 'Idle reminder', phrase: 'Take your time.', games: ['connect', 'noughts'], essential: true },
    'watch-this': { label: 'Strong move', phrase: 'Watch this.', games: ['connect', 'noughts'], essential: false },
    'i-win': { label: 'Character wins', phrase: 'I win. Good game.', games: ['connect', 'noughts'], essential: true },
    'you-win': { label: 'Character loses', phrase: 'You win. Well done.', games: ['connect', 'noughts'], essential: true, supportsTarget: true },
    'game-over': { label: 'Draw', phrase: 'Game over. It is a draw.', games: ['connect', 'noughts'], essential: true },
    'one-more-game': { label: 'Replay invitation', phrase: 'One more game?', games: ['connect', 'noughts'], essential: true }
  },
  narratorEvents: {
    'find-intro': { label: 'Find prompt', phrase: 'Can you find...', games: ['find', 'findCharacter'], essential: true, usesNameClip: true },
    'find-again': { label: 'Find retry', phrase: 'Try again. Find...', games: ['find', 'findCharacter'], essential: true, usesNameClip: true },
    'find-correct': { label: 'Find success', phrase: 'Yes. You found...', games: ['find', 'findCharacter'], essential: true, usesNameClip: true },
    'find-complete': { label: 'Find complete', phrase: 'You found everyone!', games: ['find', 'findCharacter'], essential: true },
    'memory-start': { label: 'Memory instructions', phrase: 'Find the matching family cards.', games: ['memory'], essential: true },
    'memory-match': { label: 'Memory match', phrase: 'That is a match.', games: ['memory'], essential: true },
    'memory-no-match': { label: 'Memory retry', phrase: 'Try another pair.', games: ['memory'], essential: true },
    'memory-complete': { label: 'Memory complete', phrase: 'You found all the matching cards.', games: ['memory'], essential: true }
  },
  nameClip: {
    label: 'Character name',
    phrase: '{character name}',
    path: 'assets/audio/narrator/names/{character-key}',
    essentialForFindGames: true
  }
};
