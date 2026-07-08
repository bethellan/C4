const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (/\.png$/i.test(file)) return 'image/png';
  if (/\.webp$/i.test(file)) return 'image/webp';
  if (/\.(jpg|jpeg)$/i.test(file)) return 'image/jpeg';
  if (/\.webm$/i.test(file)) return 'audio/webm';
  return 'application/octet-stream';
}

function createServer() {
  return http.createServer((request, response) => {
    const requested = decodeURIComponent(request.url.split('?')[0]);
    const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root)) {
      response.statusCode = 403;
      response.end('Forbidden');
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        response.statusCode = 404;
        response.end('Not found');
        return;
      }
      response.setHeader('Content-Type', contentType(file));
      response.end(data);
    });
  });
}

function edgeExecutable() {
  const candidates = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ];
  return candidates.find(fs.existsSync);
}

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({
    executablePath: edgeExecutable(),
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(8000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const baseUrl = `http://127.0.0.1:${server.address().port}/`;

  const splashTimerPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  splashTimerPage.on('pageerror', error => pageErrors.push(error.message));
  await splashTimerPage.goto(baseUrl, { waitUntil:'domcontentloaded' });
  await splashTimerPage.waitForTimeout(3900);
  const splashStillVisible = await splashTimerPage.locator('.gc46Splash').count() === 1;
  await splashTimerPage.waitForTimeout(600);
  const splashTimerAdvanced =
    await splashTimerPage.locator('.gc46Splash').count() === 0 &&
    await splashTimerPage.locator('[data-game]').count() === 6;
  await splashTimerPage.close();

  const splashSkipPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  splashSkipPage.on('pageerror', error => pageErrors.push(error.message));
  await splashSkipPage.goto(baseUrl, { waitUntil:'domcontentloaded' });
  await splashSkipPage.keyboard.press('Enter');
  await splashSkipPage.waitForTimeout(350);
  const splashKeypressAdvanced =
    await splashSkipPage.locator('.gc46Splash').count() === 0 &&
    await splashSkipPage.locator('[data-game]').count() === 6;
  await splashSkipPage.close();

  await page.addInitScript(() => {
    window.GC_SKIP_STARTUP_SPLASH = true;
  });

  async function reset() {
    await page.goto(baseUrl, { waitUntil:'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('gc31Sound', 'off');
      localStorage.setItem('gcSound', 'off');
    });
    await page.reload();
  }

  async function pickFirstCharacter() {
    await page.locator('[data-character]:not([disabled])').first().click();
    await page.waitForTimeout(1050);
  }

  async function openNonMalcolmFamilyRound() {
    let lastRound = null;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await reset();
      await page.locator('[data-game="findCharacter"]').click();
      await page.locator('[data-find-diff="family"]').click();
      await page.locator('[data-find-key]').first().waitFor();
      const prompt = await page.locator('.gc33FindPrompt strong').textContent();
      const choices = await page.locator('[data-find-key]').evaluateAll(cards =>
        cards.map(card => card.dataset.findKey)
      );
      lastRound = { prompt, choices };
      if (
        !/Malcolm|shoe salesman|shoe expert/i.test(prompt) &&
        choices.includes('malcolm')
      ) return prompt;
    }
    throw new Error(`Could not obtain a non-Malcolm target with Malcolm visible. Last round: ${JSON.stringify(lastRound)}`);
  }

  async function clickCorrectFindChoice() {
    const prompt = String(await page.locator('.gc33FindPrompt strong').textContent()).toLowerCase();
    const clues = {
      grandad:['grandad', 'crazy chef'],
      granny:['granny', 'dj'],
      joshua:['joshua', 'scientist'],
      isabella:['isabella', 'guitar hero', 'guitar star'],
      jj:['jj', 'ninja'],
      leon:['leon', 'dragon rider', 'riding the dragon'],
      loke:['loke', 'viking'],
      marilyn:['marilyn', 'astronaut'],
      andrew:['andrew', 'detective'],
      malcolm:['malcolm', 'shoe salesman', 'shoe expert'],
      tess:['tess', 'pirate queen']
    };
    const target = Object.entries(clues)
      .find(([, patterns]) => patterns.some(pattern => prompt.includes(pattern)))?.[0];
    if (!target) throw new Error(`Could not resolve Find target from prompt: ${prompt}`);
    await page.locator(`[data-find-key="${target}"]`).click();
    return target;
  }

  const results = {};
  results.startupSplash = {
    visibleBeforeFourSeconds:splashStillVisible,
    timerAdvanced:splashTimerAdvanced,
    keypressAdvanced:splashKeypressAdvanced
  };

  await reset();
  results.homeGames = await page.locator('[data-game]').count();
  results.voiceArchitecture = await page.evaluate(() => {
    const characterChoices = window.GC_BUILD_CHARACTER_AUDIO_CHOICES('jj', 'your-turn', 'grandad');
    const narratorChoices = window.GC_BUILD_NARRATOR_AUDIO_CHOICES('find-intro', 'grandad');
    const plan = window.GC_GET_VOICE_RECORDING_PLAN();
    return {
      catalogueVersion:window.GC_VOICE_CATALOG?.version,
      characterEvents:plan.characterEvents,
      narratorEvents:plan.narratorEvents,
      narratorFolder:plan.narratorFolder,
      narratorNamesFolder:plan.narratorNamesFolder,
      hasNoughtsEventHelper:typeof window.GC_SPEAK_NOUGHTS_EVENT === 'function',
      hasFindEventHelper:typeof window.GC_SPEAK_FIND_EVENT === 'function',
      characterFirst:characterChoices[0],
      characterHasGeneric:characterChoices.some(sequence => sequence[0]?.includes('/jj/your-turn.')),
      narratorFirst:narratorChoices[0],
      narratorHasComposed:narratorChoices.some(sequence =>
        sequence.length === 2 &&
        sequence[0]?.includes('/narrator/find-intro.') &&
        sequence[1]?.includes('/narrator/names/grandad.')
      )
    };
  });
  results.findNarratorPlayback = await page.evaluate(async () => {
    const OriginalAudio = window.Audio;
    const played = [];
    const completed = [];
    voiceEnabled = true;
    window.Audio = function(src) {
      this.src = src;
      const listeners = {};
      this.preload = '';
      this.volume = 1;
      this.addEventListener = (type, callback) => { listeners[type] = callback; };
      this.play = () => {
        played.push(src);
        setTimeout(() => {
          if (src.includes('/find-again-grandad.')) {
            if (listeners.error) listeners.error();
          } else if (listeners.ended) {
            listeners.ended();
          }
        }, 0);
        return Promise.resolve();
      };
      this.pause = () => {};
    };
    await new Promise(resolve => window.GC_SPEAK_FIND_EVENT('find-again', 'grandad', 'Try again. Find Grandad.', () => {
      completed.push('again');
      resolve();
    }));
    await new Promise(resolve => window.GC_SPEAK_FIND_EVENT('find-complete', null, 'You found everyone!', () => {
      completed.push('complete');
      resolve();
    }));
    window.Audio = OriginalAudio;
    return { played, completed };
  });
  results.standardMenuControls = await page.evaluate(() => {
    const gameButtons = Array.from(document.querySelectorAll('.gc31GameButton'));
    const utilityButtons = Array.from(document.querySelectorAll('.gc31Utility button'));
    const gameStyles = gameButtons.map(button => getComputedStyle(button));
    const utilityStyles = utilityButtons.map(button => getComputedStyle(button));
    return {
      gameHeights: gameButtons.map(button => button.getBoundingClientRect().height),
      gameRadii: gameStyles.map(style => style.borderRadius),
      gameBorders: gameStyles.map(style => style.borderTopWidth),
      utilityRadii: utilityStyles.map(style => style.borderRadius),
      utilityBorders: utilityStyles.map(style => style.borderTopWidth)
    };
  });

  await page.locator('[data-game="connect"]').click();
  await pickFirstCharacter();
  results.standardChoiceControls = await page.evaluate(() => {
    const choices = Array.from(document.querySelectorAll('.gc31BigButton'));
    const back = document.querySelector('.gc31Back');
    const header = document.querySelector('.gc36ScreenHeader');
    const choiceStyles = choices.map(button => getComputedStyle(button));
    const backStyle = getComputedStyle(back);
    return {
      choiceHeights: choices.map(button => button.getBoundingClientRect().height),
      choiceRadii: choiceStyles.map(style => style.borderRadius),
      choiceBorders: choiceStyles.map(style => style.borderTopWidth),
      backRadius: backStyle.borderRadius,
      backBorder: backStyle.borderTopWidth,
      headerChildren: header ? Array.from(header.children).map(node => node.className) : [],
      heading: header ? header.querySelector('.gc31Heading')?.textContent : '',
      instruction: header ? header.querySelector('.gc31Sub')?.textContent : ''
    };
  });
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  results.connectCells = await page.locator('.cell').count();
  results.connectStartModal = await page.locator('.modalBackdrop.active').count();

  await reset();
  await page.locator('[data-game="dots"]').click();
  results.dotsSizeSelector = await page.evaluate(() => ({
    step: document.querySelector('.gc31Step')?.textContent || '',
    heading: document.querySelector('.gc31Heading')?.textContent || '',
    sizes: Array.from(document.querySelectorAll('[data-dots-diff]')).map(button => button.textContent.trim())
  }));
  await page.locator('[data-dots-diff="small"]').click();
  await pickFirstCharacter();
  results.dotsSkippedOpponentType = await page.evaluate(() => ({
    step: document.querySelector('.gc31Step')?.textContent || '',
    heading: document.querySelector('.gc31Heading')?.textContent || '',
    choices: document.querySelectorAll('[data-character]').length,
    kindButtons: document.querySelectorAll('[data-kind]').length
  }));
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  results.dotsLaunch = await page.evaluate(() => ({
    lines: document.querySelectorAll('[data-dots-edge]').length,
    boxes: document.querySelectorAll('[data-dots-box]').length,
    instruction: document.querySelector('.gc31Sub')?.textContent || '',
    status: document.querySelector('.gc45DotsStatus')?.textContent || '',
    p1Highlight:(() => { const node = document.querySelector('.dotsPlayerCard.p1, .gc45DotsScore.p1'); return node ? getComputedStyle(node).borderTopColor : ''; })(),
    boardRect:(() => {
      const rect = document.querySelector('.gc45DotsBoard')?.getBoundingClientRect();
      return rect ? { top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height, viewportWidth:window.innerWidth, viewportHeight:window.innerHeight } : null;
    })(),
    state: window.GC_GET_DOTS_STATE && window.GC_GET_DOTS_STATE()
  }));
  await page.locator('[data-dots-edge="h-0-0"]').click();
  results.dotsAfterPass = await page.evaluate(() => window.GC_GET_DOTS_STATE());
  await page.locator('[data-dots-edge="v-0-0"]').click();
  await page.locator('[data-dots-edge="h-1-0"]').click();
  await page.locator('[data-dots-edge="v-0-1"]').click();
  results.dotsAfterBox = await page.evaluate(() => window.GC_GET_DOTS_STATE());
  results.dotsAfterBoxStatus = await page.evaluate(() => document.querySelector('.gc45DotsStatus')?.textContent || '');
  results.dotsLineColours = await page.evaluate(() => {
    const colourFor = selector => {
      const node = document.querySelector(selector);
      return node ? getComputedStyle(node, '::before').backgroundColor : '';
    };
    return {
      p1:colourFor('[data-dots-edge="h-0-0"]'),
      p2:colourFor('[data-dots-edge="v-0-0"]'),
      p2Highlight:(() => { const node = document.querySelector('.dotsPlayerCard.p2, .gc45DotsScore.p2'); return node ? getComputedStyle(node).borderTopColor : ''; })()
    };
  });
  for (let guard = 0; guard < 50; guard += 1) {
    const remaining = await page.locator('[data-dots-edge]:not(.claimed)').count();
    if (!remaining) break;
    await page.locator('[data-dots-edge]:not(.claimed)').first().click();
  }
  results.dotsFinalBoardVisible = await page.evaluate(() => ({
    state: window.GC_GET_DOTS_STATE && window.GC_GET_DOTS_STATE(),
    popup: document.querySelectorAll('.modalBackdrop.active').length
  }));
  await page.waitForTimeout(1500);
  results.dotsPopupStillPaused =
    await page.locator('.modalBackdrop.active').count() === 0 &&
    await page.locator('[data-dots-box]').evaluateAll(boxes => boxes.filter(box => box.textContent.trim()).length) === 16;
  await page.waitForTimeout(450);
  results.dotsPopupAfterPause = await page.locator('.modalBackdrop.active').count() === 1;
  await page.locator('#gc32OpponentModalActions button').first().click();
  results.dotsReplay = await page.evaluate(() => ({
    lines: document.querySelectorAll('[data-dots-edge]').length,
    state: window.GC_GET_DOTS_STATE && window.GC_GET_DOTS_STATE(),
    popup: document.querySelectorAll('.modalBackdrop.active').length
  }));

  await reset();
  await page.locator('[data-game="dots"]').click();
  await page.locator('[data-dots-diff="medium"]').click();
  await pickFirstCharacter();
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  results.dotsMediumLaunch = await page.evaluate(() => ({
    lines: document.querySelectorAll('[data-dots-edge]').length,
    boxes: document.querySelectorAll('[data-dots-box]').length,
    boardRect:(() => {
      const rect = document.querySelector('.gc45DotsBoard')?.getBoundingClientRect();
      return rect ? { top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height, viewportWidth:window.innerWidth, viewportHeight:window.innerHeight } : null;
    })(),
    state: window.GC_GET_DOTS_STATE && window.GC_GET_DOTS_STATE()
  }));

  await reset();
  await page.locator('[data-game="dots"]').click();
  await page.locator('[data-dots-diff="large"]').click();
  await pickFirstCharacter();
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  results.dotsLargeLaunch = await page.evaluate(() => ({
    lines: document.querySelectorAll('[data-dots-edge]').length,
    boxes: document.querySelectorAll('[data-dots-box]').length,
    boardRect:(() => {
      const rect = document.querySelector('.gc45DotsBoard')?.getBoundingClientRect();
      return rect ? { top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height, viewportWidth:window.innerWidth, viewportHeight:window.innerHeight } : null;
    })(),
    state: window.GC_GET_DOTS_STATE && window.GC_GET_DOTS_STATE()
  }));

  await reset();
  await page.locator('[data-game="noughts"]').click();
  await pickFirstCharacter();
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  await page.locator('.noughtsCell').nth(0).click();
  await page.locator('.noughtsCell').nth(1).click();
  results.noughtsMarks = (await page.locator('.noughtsCell')
    .evaluateAll(cells => cells.slice(0, 2).map(cell => cell.textContent))).join('');

  await reset();
  await page.locator('[data-game="noughts"]').click();
  await pickFirstCharacter();
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  for (const index of [0, 3, 1, 4, 2]) {
    await page.locator('.noughtsCell').nth(index).click();
  }
  results.noughtsFinalBoardVisible = await page.evaluate(() => ({
    over: noughtsState && noughtsState.over,
    winner: noughtsState && noughtsState.winner,
    winCells: Array.from(document.querySelectorAll('.noughtsCell.winCell')).length,
    popup: document.querySelectorAll('.modalBackdrop.active').length
  }));
  await page.waitForTimeout(3000);
  results.noughtsPopupStillPaused =
    await page.locator('.modalBackdrop.active').count() === 0 &&
    await page.locator('.noughtsCell.winCell').count() === 3;
  await page.waitForTimeout(550);
  results.noughtsPopupAfterPause =
    await page.locator('.modalBackdrop.active').count() === 1;

  await reset();
  await page.locator('[data-game="noughts"]').click();
  await pickFirstCharacter();
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  for (const index of [0, 3, 1, 4, 2]) {
    await page.locator('.noughtsCell').nth(index).click();
  }
  await page.evaluate(() => window.gc32MenuHome());
  await page.waitForTimeout(3600);
  results.noughtsEndPauseCancelled =
    await page.locator('[data-game="connect"]').isVisible() &&
    await page.locator('.modalBackdrop.active').count() === 0;

  await reset();
  await page.locator('[data-game="noughts"]').click();
  await pickFirstCharacter();
  await page.locator('[data-kind="computer"]').click();
  results.noughtsComputerOpponents = await page.locator('[data-computer-difficulty]').count();
  results.noughtsComputerSelector = await page.evaluate(() => ({
    step: document.querySelector('.gc31Step')?.textContent || '',
    heading: document.querySelector('.gc31Heading')?.textContent || '',
    instruction: document.querySelector('.gc31Sub')?.textContent || '',
    names: Array.from(document.querySelectorAll('[data-computer-difficulty] > div:not(.gc31Band)')).map(node => node.textContent.trim()),
    skillLevels: Array.from(document.querySelectorAll('[data-computer-difficulty] .gc31Band')).map(node => node.textContent.trim())
  }));
  await page.evaluate(() => {
    window.__noughtsVoiceCalls = [];
    voiceEnabled = true;
    playAudioChoices = (choices, fallbackText) => {
      window.__noughtsVoiceCalls.push({
        firstPath: choices && choices[0] && choices[0][0],
        fallbackText
      });
    };
  });
  await page.locator('[data-computer-difficulty]').first().click();
  await page.waitForTimeout(1050);
  results.noughtsComputerLaunch =
    await page.locator('.noughtsCell').count() === 9 &&
    await page.evaluate(() => noughtsState && noughtsState.mode === 'computer' && !!noughtsState.opponent);
  results.noughtsRecordedVoiceEvents = await page.evaluate(() => {
    const humanKey = noughtsState.human.key;
    const opponentKey = noughtsState.opponent.key;
    announceNoughtsComputerMove(true);
    const originalRandom = Math.random;
    Math.random = () => 0;
    announceNoughtsComputerMove(false);
    Math.random = () => 0.5;
    announceNoughtsComputerMove(false);
    Math.random = originalRandom;
    noughtsState.board = ['X', 'X', 'X', null, 'O', null, null, null, 'O'];
    finishNoughtsTurn('X');
    speakNoughtsEvent(noughtsState.opponent, 'i-win', 'I win. Good game.', humanKey);
    speakNoughtsEvent(noughtsState.opponent, 'game-over', 'Game over. It is a draw.', humanKey);
    return {
      humanKey,
      opponentKey,
      paths: window.__noughtsVoiceCalls.map(call => call.firstPath),
      fallbackTexts: window.__noughtsVoiceCalls.map(call => call.fallbackText)
    };
  });

  await reset();
  await page.locator('[data-game="cards"]').click();
  await page.locator('[data-card-diff="easy"]').click();
  results.memoryCards = await page.locator('.memoryCard').count();
  await page.locator('.memoryCard').nth(0).click();
  await page.locator('.memoryCard').nth(1).click();
  await page.locator('#memoryHomeButton').click();
  await page.waitForTimeout(900);
  results.memoryTimerCancelled = await page.locator('[data-game="connect"]').isVisible();

  await reset();
  await page.locator('[data-game="find"]').click();
  await page.locator('[data-find-diff="easy"]').click();
  results.findChoices = await page.locator('[data-find-key]').count();
  const findTarget = await clickCorrectFindChoice();
  await page.waitForTimeout(120);
  results.findSuccessReveal = await page.locator('.gc37FindSuccessOverlay').evaluate(overlay => {
    const card = overlay.querySelector('.gc37FindSuccessCard');
    const image = overlay.querySelector('img');
    return {
      label: overlay.querySelector('.gc37FindSuccessLabel')?.textContent || '',
      cardWidth: card.getBoundingClientRect().width,
      cardHeight: card.getBoundingClientRect().height,
      naturalWidth: image ? image.naturalWidth : 0,
      zoomMode: card.dataset.gc38Zoom || '',
      activeAnimations: card.getAnimations().length,
      transform: getComputedStyle(card).transform
    };
  });
  await page.waitForTimeout(2700);
  results.findRevealHeldForThreeSeconds =
    await page.locator('.gc37FindSuccessOverlay').count() === 1 &&
    /Round 1 of 5/.test(await page.locator('.gc31Step').textContent());
  await page.waitForTimeout(450);
  results.findRevealZoomingOut =
    await page.locator('.gc37FindSuccessCard').evaluate(card => ({
      phase: card.dataset.gc41Phase || '',
      activeAnimations: card.getAnimations().length,
      transform: getComputedStyle(card).transform
    }));
  results.findRoundHeldDuringZoomOut =
    /Round 1 of 5/.test(await page.locator('.gc31Step').textContent());
  await page.waitForTimeout(500);
  results.findAdvancedAfterHold =
    await page.locator('.gc37FindSuccessOverlay').count() === 0 &&
    /Round 2 of 5/.test(await page.locator('.gc31Step').textContent());

  await reset();
  await page.locator('[data-game="findCharacter"]').click();
  await page.locator('[data-find-diff="easy"]').click();
  const characterTarget = await clickCorrectFindChoice();
  await page.waitForTimeout(120);
  results.findCharacterSuccessReveal =
    await page.locator('.gc37FindSuccessOverlay').count() === 1;
  await page.evaluate(() => window.gc32MenuHome());
  await page.waitForTimeout(3300);
  results.findCharacterRevealCancelled =
    await page.locator('.gc37FindSuccessOverlay').count() === 0 &&
    await page.locator('[data-game="connect"]').isVisible();
  results.findSuccessTargets = { findTarget, characterTarget };

  await reset();
  await page.locator('[data-game="findCharacter"]').click();
  await page.locator('[data-find-diff="easy"]').click();
  await clickCorrectFindChoice();
  await page.waitForTimeout(3150);
  results.findZoomOutStartedBeforeCancel =
    await page.locator('.gc37FindSuccessCard').evaluate(card => card.dataset.gc41Phase === 'zooming-out');
  await page.evaluate(() => window.gc32MenuHome());
  await page.waitForTimeout(800);
  results.findZoomOutCancelled =
    await page.locator('.gc37FindSuccessOverlay').count() === 0 &&
    await page.locator('[data-game="connect"]').isVisible();

  await reset();
  await page.evaluate(() => {
    localStorage.setItem('gc31Sound', 'on');
    localStorage.setItem('gcSound', 'on');
    voiceEnabled = true;
    buildNarratorAudioChoices = () => [];
    window.SpeechSynthesisUtterance = function(text) {
      this.text = text;
      this.onend = null;
      this.onerror = null;
    };
    window.Audio = function(src) {
      const listeners = {};
      this.src = src;
      this.preload = '';
      this.volume = 1;
      this.addEventListener = (type, callback) => { listeners[type] = callback; };
      this.play = () => {
        setTimeout(() => { if (listeners.error) listeners.error(); }, 0);
        return Promise.resolve();
      };
      this.pause = () => {};
    };
    Object.defineProperty(window, 'speechSynthesis', {
      configurable:true,
      value:{
        cancel() {},
        speak(utterance) {
          setTimeout(() => {
            window.__findTestVoiceEndedAt = Date.now();
            if (utterance.onend) utterance.onend();
          }, 400);
        }
      }
    });
  });
  await page.locator('[data-game="find"]').click();
  await page.locator('[data-find-diff="easy"]').click();
  await clickCorrectFindChoice();
  await page.waitForTimeout(3200);
  results.findRevealWaitsForVoiceEnd =
    await page.locator('.gc37FindSuccessOverlay').count() === 1 &&
    Number(await page.evaluate(() => window.__findTestVoiceEndedAt || 0)) > 0;
  await page.waitForTimeout(450);
  results.findVoiceRevealZoomingOut =
    await page.locator('.gc37FindSuccessCard').evaluate(card => card.dataset.gc41Phase === 'zooming-out');
  await page.waitForTimeout(500);
  results.findRevealClosesThreeSecondsAfterVoice =
    await page.locator('.gc37FindSuccessOverlay').count() === 0 &&
    /Round 2 of 5/.test(await page.locator('.gc31Step').textContent());

  await reset();
  await page.evaluate(() => {
    localStorage.setItem('gc31Sound', 'on');
    localStorage.setItem('gcSound', 'on');
    voiceEnabled = true;
    window.__findPromptSpeechCount = 0;
    buildNarratorAudioChoices = () => [];
    window.SpeechSynthesisUtterance = function(text) {
      this.text = text;
      this.onend = null;
      this.onerror = null;
    };
    Object.defineProperty(window, 'speechSynthesis', {
      configurable:true,
      value:{
        cancel() {},
        speak(utterance) {
          window.__findPromptSpeechCount += 1;
          if (utterance.onend) utterance.onend();
        }
      }
    });
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) =>
      nativeSetTimeout(callback, Number(delay) === 10000 ? 20 : delay, ...args);
  });
  await page.locator('[data-game="find"]').click();
  await page.locator('[data-find-diff="easy"]').click();
  await page.waitForFunction(() => window.__findPromptSpeechCount === 6, null, { timeout:3000 });
  results.findPromptRepeatCount = await page.evaluate(() => window.__findPromptSpeechCount);
  await page.waitForTimeout(180);
  results.findPromptRepeatStopped =
    await page.evaluate(() => window.__findPromptSpeechCount) === 6;

  const prompt = await openNonMalcolmFamilyRound();
  await page.locator('[data-find-key="malcolm"]').click();
  await page.waitForTimeout(150);
  results.malcolmVisible = await page.locator('.gc33MalcolmDanceOverlay').evaluate(overlay => {
    const image = overlay.querySelector('img');
    const overlayRect = overlay.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    return {
      overlayWidth: overlayRect.width,
      overlayHeight: overlayRect.height,
      imageWidth: imageRect.width,
      imageHeight: imageRect.height,
      naturalWidth: image.naturalWidth
    };
  });
  await page.evaluate(() => window.gc32MenuHome());
  results.malcolmCancelledOnHome =
    await page.locator('.gc33MalcolmDanceOverlay').count() === 0;
  await page.waitForTimeout(5100);
  results.oldRoundDidNotResume =
    await page.locator('[data-game="connect"]').isVisible() &&
    await page.locator('.gc33MalcolmDanceOverlay').count() === 0;

  const normalPrompt = await openNonMalcolmFamilyRound();
  await page.locator('[data-find-key="malcolm"]').click();
  await page.waitForTimeout(5150);
  results.malcolmNormalCompletion =
    await page.locator('.gc33MalcolmDanceOverlay').count() === 0 &&
    await page.locator('.gc33FindPrompt strong').textContent() === normalPrompt &&
    await page.locator('[data-find-key]').first().isEnabled();

  await reset();
  await page.locator('[data-game="noughts"]').click();
  await pickFirstCharacter();
  await page.locator('[data-kind="two"]').click();
  await pickFirstCharacter();
  const replayButton = page.locator('#noughtsAgainButton');
  await page.evaluate(() => {
    noughtsState.over = true;
    noughtsState.winner = 'draw';
    updatePlayAgainVisibility();
  });
  await replayButton.evaluate(button => { button.__replayIdentity = 'kept'; });
  await replayButton.click();
  results.replayButtonNotCloned =
    await page.locator('#noughtsAgainButton')
      .evaluate(button => button.__replayIdentity === 'kept');

  results.pageErrors = pageErrors;

  const visible = results.malcolmVisible;
  const successReveal = results.findSuccessReveal;
  const successZoomOut = results.findRevealZoomingOut;
  const noughtsComputer = results.noughtsComputerSelector;
  const noughtsFinal = results.noughtsFinalBoardVisible;
  const noughtsVoices = results.noughtsRecordedVoiceEvents;
  const findNarrator = results.findNarratorPlayback;
  const dotsLaunch = results.dotsLaunch;
  const dotsFinal = results.dotsFinalBoardVisible;
  const dotsMedium = results.dotsMediumLaunch;
  const dotsLarge = results.dotsLargeLaunch;
  const boardFitsHorizontally = rect =>
    rect &&
    rect.right <= rect.viewportWidth + 8 &&
    rect.width <= rect.viewportWidth + 8;
  const boardFitsViewport = rect =>
    boardFitsHorizontally(rect) &&
    rect.bottom <= rect.viewportHeight + 12;
  const controls = results.standardMenuControls;
  const voiceArchitecture = results.voiceArchitecture;
  const menuHeightsMatch =
    new Set(controls.gameHeights.map(height => Math.round(height))).size === 1;
  const menuRadiiMatch =
    new Set(controls.gameRadii.concat(controls.utilityRadii)).size === 1;
  const menuBordersMatch =
    new Set(controls.gameBorders.concat(controls.utilityBorders)).size === 1;
  const choices = results.standardChoiceControls;
  const choiceHeightsMatch =
    new Set(choices.choiceHeights.map(height => Math.round(height))).size === 1;
  const choiceRadiiMatch =
    new Set(choices.choiceRadii.concat(choices.backRadius)).size === 1;
  const choiceBordersMatch =
    new Set(choices.choiceBorders.concat(choices.backBorder)).size === 1;
  const choiceHeaderStandard =
    choices.headerChildren.length === 4 &&
    choices.headerChildren[0] === 'gc31Back' &&
    choices.headerChildren[1] === 'gc31Step' &&
    choices.headerChildren[2] === 'gc31Heading' &&
    choices.headerChildren[3] === 'gc31Sub' &&
    choices.heading === 'Choose how to play' &&
    choices.instruction.length > 0;
  const passed =
    results.homeGames === 6 &&
    results.startupSplash.visibleBeforeFourSeconds &&
    results.startupSplash.keypressAdvanced &&
    voiceArchitecture.catalogueVersion === 1 &&
    voiceArchitecture.characterEvents.includes('your-turn') &&
    voiceArchitecture.characterEvents.includes('i-win') &&
    voiceArchitecture.narratorEvents.includes('find-intro') &&
    voiceArchitecture.narratorEvents.includes('memory-complete') &&
    voiceArchitecture.narratorFolder === 'assets/audio/narrator' &&
    voiceArchitecture.narratorNamesFolder === 'assets/audio/narrator/names' &&
    voiceArchitecture.hasNoughtsEventHelper &&
    voiceArchitecture.hasFindEventHelper &&
    voiceArchitecture.characterFirst[0] === 'assets/audio/jj/your-turn-grandad.mp3' &&
    voiceArchitecture.characterHasGeneric &&
    voiceArchitecture.narratorFirst[0] === 'assets/audio/narrator/find-intro-grandad.mp3' &&
    voiceArchitecture.narratorHasComposed &&
    findNarrator.completed.join(',') === 'again,complete' &&
    findNarrator.played.includes('assets/audio/narrator/find-again-grandad.mp3') &&
    findNarrator.played.includes('assets/audio/narrator/find-again.mp3') &&
    findNarrator.played.includes('assets/audio/narrator/names/grandad.mp3') &&
    findNarrator.played.includes('assets/audio/narrator/find-complete.mp3') &&
    results.connectCells === 42 &&
    results.connectStartModal === 0 &&
    results.dotsSizeSelector.step === 'Step 1' &&
    results.dotsSizeSelector.heading === 'Choose Dots & Boxes size' &&
    results.dotsSizeSelector.sizes.length === 3 &&
    results.dotsSizeSelector.sizes.some(text => /Small/.test(text) && /4 x 4/.test(text)) &&
    results.dotsSizeSelector.sizes.some(text => /Medium/.test(text) && /5 x 5/.test(text)) &&
    results.dotsSizeSelector.sizes.some(text => /Large/.test(text) && /7 x 7/.test(text)) &&
    results.dotsSkippedOpponentType.step === 'Step 2' &&
    results.dotsSkippedOpponentType.heading === 'Choose how to play' &&
    results.dotsSkippedOpponentType.choices === 0 &&
    results.dotsSkippedOpponentType.kindButtons === 2 &&
    dotsLaunch.lines === 40 &&
    dotsLaunch.boxes === 16 &&

    dotsLaunch.state.size === 4 &&
    dotsLaunch.state.level === 'small' &&
    dotsLaunch.state.current === 'p1' &&
    dotsLaunch.state.claimedEdges === 0 &&
    boardFitsViewport(dotsLaunch.boardRect) &&
    results.dotsAfterPass.current === 'p2' &&
    results.dotsAfterPass.claimedEdges === 1 &&
    results.dotsAfterBox.current === 'p2' &&
    results.dotsAfterBox.p2Score === 1 &&
    results.dotsAfterBox.lastCompleted === 1 &&

    results.dotsLineColours.p1 === 'rgb(0, 239, 83)' &&
    results.dotsLineColours.p2 === 'rgb(194, 0, 255)' &&
    dotsLaunch.p1Highlight === 'rgb(41, 163, 106)' &&
    results.dotsLineColours.p2Highlight === 'rgb(41, 163, 106)' &&
    dotsFinal.state.over === true &&
    dotsFinal.state.claimedBoxes === 16 &&
    dotsFinal.popup === 0 &&
    results.dotsPopupStillPaused &&
    results.dotsPopupAfterPause &&
    results.dotsReplay.lines === 40 &&
    results.dotsReplay.state.claimedEdges === 0 &&
    results.dotsReplay.popup === 0 &&
    dotsMedium.lines === 60 &&
    dotsMedium.boxes === 25 &&
    dotsMedium.state.size === 5 &&
    dotsMedium.state.level === 'medium' &&
    boardFitsViewport(dotsMedium.boardRect) &&
    dotsLarge.lines === 112 &&
    dotsLarge.boxes === 49 &&
    dotsLarge.state.size === 7 &&
    dotsLarge.state.level === 'large' &&
    boardFitsViewport(dotsLarge.boardRect) &&
    results.noughtsMarks === 'XO' &&
    noughtsFinal.over === true &&
    noughtsFinal.winner === 'X' &&
    noughtsFinal.winCells === 3 &&
    noughtsFinal.popup === 0 &&
    results.noughtsPopupStillPaused &&
    results.noughtsPopupAfterPause &&
    results.noughtsEndPauseCancelled &&
    results.noughtsComputerOpponents === 10 &&
    noughtsComputer.step === 'Step 3' &&
    noughtsComputer.heading === 'Choose computer opponent' &&
    /Noughts & Crosses/.test(noughtsComputer.instruction) &&
    noughtsComputer.names.length === 10 &&
    noughtsComputer.names.every(Boolean) &&
    noughtsComputer.skillLevels.length === 10 &&
    noughtsComputer.skillLevels.every(Boolean) &&
    results.noughtsComputerLaunch &&
    noughtsVoices.paths[0] === `assets/audio/${noughtsVoices.opponentKey}/start-${noughtsVoices.humanKey}.mp3` &&
    noughtsVoices.paths[1] === `assets/audio/${noughtsVoices.opponentKey}/not-so-fast-${noughtsVoices.humanKey}.mp3` &&
    noughtsVoices.paths[2] === `assets/audio/${noughtsVoices.opponentKey}/move-${noughtsVoices.humanKey}.mp3` &&
    noughtsVoices.paths[3] === `assets/audio/${noughtsVoices.opponentKey}/your-turn-${noughtsVoices.humanKey}.mp3` &&
    noughtsVoices.paths[4] === `assets/audio/${noughtsVoices.opponentKey}/you-win-${noughtsVoices.humanKey}.mp3` &&
    noughtsVoices.paths[5] === `assets/audio/${noughtsVoices.opponentKey}/i-win-${noughtsVoices.humanKey}.mp3` &&
    noughtsVoices.paths[6] === `assets/audio/${noughtsVoices.opponentKey}/game-over-${noughtsVoices.humanKey}.mp3` &&
    results.memoryCards === 8 &&
    results.memoryTimerCancelled &&
    results.findChoices === 2 &&
    /Yes\. You found /.test(successReveal.label) &&
    successReveal.cardWidth > 250 &&
    successReveal.cardHeight > 250 &&
    successReveal.naturalWidth > 0 &&
    successReveal.zoomMode === 'source-card' &&
    successReveal.activeAnimations > 0 &&
    successReveal.transform !== 'none' &&
    results.findRevealHeldForThreeSeconds &&
    successZoomOut.phase === 'zooming-out' &&
    successZoomOut.activeAnimations > 0 &&
    successZoomOut.transform !== 'none' &&
    results.findRoundHeldDuringZoomOut &&
    results.findAdvancedAfterHold &&
    results.findCharacterSuccessReveal &&
    results.findCharacterRevealCancelled &&
    results.findZoomOutStartedBeforeCancel &&
    results.findZoomOutCancelled &&
    results.findRevealWaitsForVoiceEnd &&
    results.findVoiceRevealZoomingOut &&
    results.findRevealClosesThreeSecondsAfterVoice &&
    results.findPromptRepeatCount === 6 &&
    results.findPromptRepeatStopped &&
    visible.overlayWidth === 1280 &&
    visible.overlayHeight === 900 &&
    visible.imageWidth > 100 &&
    visible.naturalWidth === 800 &&
    results.malcolmCancelledOnHome &&
    results.oldRoundDidNotResume &&
    results.malcolmNormalCompletion &&
    results.replayButtonNotCloned &&
    menuHeightsMatch &&
    menuRadiiMatch &&
    menuBordersMatch &&
    choiceHeightsMatch &&
    choiceRadiiMatch &&
    choiceBordersMatch &&
    choiceHeaderStandard &&
    pageErrors.length === 0;

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  if (!passed) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
