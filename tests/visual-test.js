const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const baselineDir = path.join(__dirname, 'visual-baselines');
const updateBaselines = process.env.UPDATE_VISUAL_BASELINES === '1';

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

async function settle(page) {
  await page.addStyleTag({
    content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;}'
  });
  await page.evaluate(async () => {
    localStorage.setItem('gc31Sound', 'off');
    localStorage.setItem('gcSound', 'off');
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all(Array.from(document.images).map(image => {
      if (image.complete) return Promise.resolve();
      return new Promise(resolve => {
        image.addEventListener('load', resolve, { once:true });
        image.addEventListener('error', resolve, { once:true });
      });
    }));
  });
  await page.waitForTimeout(100);
}

async function capture(page, fileName, options={}) {
  await settle(page);
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
  if (hasOverflow) throw new Error(`${fileName} has horizontal overflow.`);

  const actual = await page.screenshot({
    animations:options.allowAnimations ? 'allow' : 'disabled',
    timeout:90000
  });
  const baseline = path.join(baselineDir, fileName);
  if (updateBaselines) {
    fs.mkdirSync(baselineDir, { recursive:true });
    fs.writeFileSync(baseline, actual);
    return;
  }
  if (!fs.existsSync(baseline)) {
    throw new Error(`Missing visual baseline: ${baseline}`);
  }
  const expected = fs.readFileSync(baseline);
  if (!actual.equals(expected)) {
    const actualPath = path.join(os.tmpdir(), `grandad-connect-${fileName}`);
    fs.writeFileSync(actualPath, actual);
    throw new Error(`Visual regression in ${fileName}. Actual screenshot: ${actualPath}`);
  }
}

async function clickCorrectFindChoice(page) {
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
}

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({
    executablePath: edgeExecutable(),
    headless: true
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}/`;
  const viewports = [
    { name:'desktop', width:1280, height:900 },
    { name:'tablet', width:820, height:1180 },
    { name:'phone', width:390, height:844 }
  ];

  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      await page.addInitScript(() => {
        window.GC_SKIP_STARTUP_SPLASH = true;
        Math.random = () => 0.123456789;
      });
      await page.goto(baseUrl, { waitUntil:'domcontentloaded' });
      await capture(page, `${viewport.name}-home.png`);

      await page.locator('[data-game="connect"]').click();
      await page.locator('[data-character]:not([disabled])').first().click();
      await page.waitForTimeout(1050);
      await capture(page, `${viewport.name}-choice.png`);

      await page.evaluate(() => window.gc32MenuHome());
      await page.locator('[data-game="find"]').click();
      await page.locator('[data-find-diff="easy"]').click();
      await clickCorrectFindChoice(page);
      await page.waitForTimeout(120);
      await capture(page, `${viewport.name}-find-success.png`);

      await page.evaluate(() => window.gc32MenuHome());
      await page.locator('[data-game="noughts"]').click();
      await page.locator('[data-character]:not([disabled])').first().click();
      await page.waitForTimeout(1050);
      await page.locator('[data-kind="computer"]').click();
      await capture(page, `${viewport.name}-noughts-opponents.png`);

      await page.evaluate(() => window.gc32MenuHome());
      await page.locator('[data-game="noughts"]').click();
      await page.locator('[data-character]:not([disabled])').first().click();
      await page.waitForTimeout(1050);
      await page.locator('[data-kind="two"]').click();
      await page.locator('[data-character]:not([disabled])').first().click();
      await page.waitForTimeout(1050);
      for (const index of [0, 3, 1, 4, 2]) {
        await page.locator('.noughtsCell').nth(index).click();
      }
      await page.waitForTimeout(150);
      await capture(page, `${viewport.name}-noughts-final-board.png`);

      await page.goto(`${baseUrl}character-editor.html`, { waitUntil:'domcontentloaded' });
      await capture(page, `${viewport.name}-character-editor.png`);
      await page.evaluate(() => {
        document.querySelector('#recordTitle').textContent = 'Record Find prompt';
        document.querySelector('#recordTarget').textContent = 'assets/audio/narrator/find-intro.webm';
        document.querySelector('#recordPhrase').textContent = 'Can you find...';
        document.querySelector('#recordHint').textContent = 'Recording format: .webm';
        document.querySelector('#recordDialog').showModal();
      });
      await capture(page, `${viewport.name}-record-dialog.png`);
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  console.log(updateBaselines ? 'Visual baselines updated.' : 'Visual regression screenshots passed.');
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
