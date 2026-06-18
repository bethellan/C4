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
  return [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ].find(fs.existsSync);
}

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: edgeExecutable(), headless:true });
  const page = await browser.newPage({ viewport:{ width:1280, height:900 }, acceptDownloads:true });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const results = {};

  try {
    await page.goto(base);
    results.generatedManifest = await page.evaluate(() => ({
      count: window.GC_CHARACTER_MANIFEST?.characters?.length || 0,
      source: typeof characterManifestSource === 'undefined' ? '' : characterManifestSource,
      occupation: CHARACTERS.andrew?.occupation || '',
      cardflipImage: CHARACTERS.andrew?.cardflipImage || ''
    }));
    results.authoritativeRemoval = await page.evaluate(() => {
      const grandad = window.GC_CHARACTER_MANIFEST.characters.find(person => person.key === 'grandad');
      const computer = window.GC_CHARACTER_MANIFEST.characters.find(person => person.key === 'computer');
      applyCharacterManifest({ version:2, characters:[grandad, computer] }, 'test');
      window.gc32MenuHome();
      return Object.keys(CHARACTERS).sort();
    });

    const testManifest = JSON.parse(fs.readFileSync(path.join(root, 'data/characters.json'), 'utf8'));
    await page.addInitScript(({ manifest }) => {
      const files = new Map([
        ['data/characters.json', JSON.stringify(manifest)],
        ['assets/audio/grandad/start.webm', 'start'],
        ['assets/audio/grandad/i-win.mp3', 'win'],
        ['assets/audio/narrator/find-intro.webm', 'find'],
        ['assets/audio/narrator/names/grandad.wav', 'grandad']
      ]);
      window.__editorMockFiles = files;
      class MockMediaRecorder extends EventTarget {
        static isTypeSupported(type) { return !type || /webm/.test(type); }
        constructor(stream, options={}) { super(); this.stream=stream; this.mimeType=options.mimeType || 'audio/webm'; this.state='inactive'; }
        start() { this.state='recording'; }
        stop() {
          if (this.state==='inactive') return;
          this.state='inactive';
          this.dispatchEvent(new MessageEvent('dataavailable', { data:new Blob(['recorded-voice'], { type:this.mimeType }) }));
          this.dispatchEvent(new Event('stop'));
        }
      }
      window.MediaRecorder = MockMediaRecorder;
      Object.defineProperty(navigator, 'mediaDevices', {
        configurable:true,
        value:{ async getUserMedia() { return { getTracks() { return [{ stop() {} }]; } }; } }
      });
      function directory(prefix='') {
        return {
          name:prefix ? prefix.split('/').pop() : 'mock-grandad-connect',
          async getDirectoryHandle(name, options={}) {
            const next = prefix ? `${prefix}/${name}` : name;
            if (!options.create && ![...files.keys()].some(key => key.startsWith(`${next}/`))) throw new DOMException('Missing directory', 'NotFoundError');
            return directory(next);
          },
          async getFileHandle(name, options={}) {
            const key = prefix ? `${prefix}/${name}` : name;
            if (!files.has(key) && !options.create) throw new DOMException('Missing file', 'NotFoundError');
            return {
              async getFile() { return new File([files.get(key)], name); },
              async createWritable() { return { async write(data) { files.set(key, data); }, async close() {} }; }
            };
          },
          async removeEntry(name) {
            const key = prefix ? `${prefix}/${name}` : name;
            if (!files.delete(key)) throw new DOMException('Missing file', 'NotFoundError');
          }
        };
      }
      window.showDirectoryPicker = async () => directory();
    }, { manifest:testManifest });
    await page.goto(`${base}character-editor.html`);
    await page.locator('#chooseProject').click();
    await page.waitForFunction(() => document.querySelector('#voiceHeading')?.textContent.includes('Grandad: recordings found'));
    await page.locator('#voiceViewButton').click();
    results.voiceInventory = await page.evaluate(() => ({
      characterRows:document.querySelectorAll('#characterVoiceList .voiceRow').length,
      narratorRows:document.querySelectorAll('#narratorVoiceList .voiceRow').length,
      characterFound:document.querySelectorAll('#characterVoiceList .voiceBadge.found').length,
      narratorFound:document.querySelectorAll('#narratorVoiceList .voiceBadge.found').length,
      summary:document.querySelector('#voiceSummary')?.textContent,
      definitions:window.GC_CHARACTER_EDITOR.getVoiceDefinitions()
    }));
    const moveRow = page.locator('#characterVoiceList .voiceRow').filter({ hasText:'Move made' });
    await moveRow.locator('.voiceRecord').click();
    await page.locator('#recordStart').click();
    await page.locator('#recordStop').click();
    await page.waitForFunction(() => !document.querySelector('#recordSave').disabled);
    await page.locator('#recordSave').click();
    await page.waitForFunction(() => document.querySelector('#voiceSummary')?.textContent.includes('Character: 3/12'));
    results.newVoiceRecording = await page.evaluate(() => ({
      saved:window.__editorMockFiles.has('assets/audio/grandad/move.webm'),
      state:window.GC_CHARACTER_EDITOR.getRecordingState(),
      summary:document.querySelector('#voiceSummary')?.textContent
    }));

    page.once('dialog', dialog => dialog.accept());
    const winRow = page.locator('#characterVoiceList .voiceRow').filter({ hasText:'Character wins' });
    await winRow.locator('.voiceRecord').click();
    await page.locator('#recordStart').click();
    await page.locator('#recordStop').click();
    await page.waitForFunction(() => !document.querySelector('#recordSave').disabled);
    await page.locator('#recordSave').click();
    await page.waitForFunction(() => !document.querySelector('#recordDialog').open);
    results.replacedVoiceRecording = await page.evaluate(() => ({
      oldRemoved:!window.__editorMockFiles.has('assets/audio/grandad/i-win.mp3'),
      newSaved:window.__editorMockFiles.has('assets/audio/grandad/i-win.webm'),
      state:window.GC_CHARACTER_EDITOR.getRecordingState()
    }));
    const praiseRow = page.locator('#characterVoiceList .voiceRow').filter({ hasText:'Praise move' });
    await praiseRow.locator('.voiceRecord').click();
    await page.locator('#recordStart').click();
    await page.locator('#recordCancel').click();
    results.cancelledVoiceRecording = await page.evaluate(() => ({
      saved:window.__editorMockFiles.has('assets/audio/grandad/nice-move.webm'),
      state:window.GC_CHARACTER_EDITOR.getRecordingState()
    }));
    results.imageRemovalControls = await page.evaluate(() => ({
      normalLabel:document.querySelector('#removeNormal')?.textContent.trim(),
      cardflipLabel:document.querySelector('#removeCardflip')?.textContent.trim(),
      normalDisabled:document.querySelector('#removeNormal')?.disabled,
      cardflipDisabled:document.querySelector('#removeCardflip')?.disabled
    }));
    await page.locator('#chooseCharacterView').click();
    await page.locator('#addPerson').click();
    await page.waitForFunction(() => window.GC_CHARACTER_EDITOR.getActiveView() === 'details');
    await page.locator('#key').fill('sophie');
    await page.locator('#name').fill('Sophie');
    await page.locator('#occupation').fill('Paramedic');
    await page.locator('#connectDifficulty').selectOption('Hard');
    await page.locator('#noughtsDifficulty').selectOption('Expert');
    await page.locator('#applyDetails').click();
    results.editorPerson = await page.evaluate(() => window.GC_CHARACTER_EDITOR.getSelected());

    await page.locator('#imagesViewButton').click();
    await page.locator('#imageInput').setInputFiles(path.join(root, 'assets/images/computer.png'));
    await page.waitForFunction(() => !document.querySelector('#downloadImage').disabled);
    await page.locator('#outputSize').selectOption('512');
    const beforeCardState = await page.evaluate(() => ({
      file:document.querySelector('#cardFileInfo').textContent,
      zoom:document.querySelector('#cardZoom').value,
      saveDisabled:document.querySelector('#saveCardflip').disabled
    }));
    await page.locator('#zoom').fill('1.6');
    const afterCardState = await page.evaluate(() => ({
      file:document.querySelector('#cardFileInfo').textContent,
      zoom:document.querySelector('#cardZoom').value,
      saveDisabled:document.querySelector('#saveCardflip').disabled
    }));
    results.independentImageEditors = {
      before:beforeCardState,
      after:afterCardState,
      activeView:await page.evaluate(() => window.GC_CHARACTER_EDITOR.getActiveView())
    };
    const imageDownloadPromise = page.waitForEvent('download');
    await page.locator('#downloadImage').click();
    const imageDownload = await imageDownloadPromise;
    const imagePath = await imageDownload.path();
    results.imageExport = {
      name:imageDownload.suggestedFilename(),
      size:fs.statSync(imagePath).size
    };

    const manifestDownloadPromise = page.waitForEvent('download');
    await page.locator('#exportManifest').click();
    const manifestDownload = await manifestDownloadPromise;
    const manifestPath = await manifestDownload.path();
    const exported = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    results.exportedPerson = exported.characters.find(person => person.key === 'sophie');
    results.pageErrors = errors;
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  const generated = results.generatedManifest;
  const passed =
    generated.count >= 12 &&
    generated.source === 'data/characters.generated.js' &&
    generated.occupation === 'Detective' &&
    /cardflip\/andrew/i.test(generated.cardflipImage) &&
    JSON.stringify(results.authoritativeRemoval) === JSON.stringify(['computer','grandad']) &&
    results.editorPerson?.name === 'Sophie' &&
    results.editorPerson?.occupation === 'Paramedic' &&
    results.editorPerson?.connectDifficulty === 'Hard' &&
    results.editorPerson?.noughtsDifficulty === 'Expert' &&
    results.imageRemovalControls?.normalLabel === 'Remove normal image' &&
    results.imageRemovalControls?.cardflipLabel === 'Remove card-flip image' &&
    results.imageRemovalControls?.normalDisabled === false &&
    results.imageRemovalControls?.cardflipDisabled === false &&
    results.voiceInventory?.characterRows === 12 &&
    results.voiceInventory?.narratorRows === 9 &&
    results.voiceInventory?.characterFound === 2 &&
    results.voiceInventory?.narratorFound === 2 &&
    /Character: 2\/12/.test(results.voiceInventory?.summary || '') &&
    /Narrator\/name: 2\/9/.test(results.voiceInventory?.summary || '') &&
    results.voiceInventory?.definitions?.character?.length === 12 &&
    results.voiceInventory?.definitions?.narrator?.length === 9 &&
    results.newVoiceRecording?.saved === true &&
    /Character: 3\/12/.test(results.newVoiceRecording?.summary || '') &&
    results.newVoiceRecording?.state?.open === false &&
    results.replacedVoiceRecording?.oldRemoved === true &&
    results.replacedVoiceRecording?.newSaved === true &&
    results.replacedVoiceRecording?.state?.open === false &&
    results.replacedVoiceRecording?.state?.hasBlob === false &&
    results.cancelledVoiceRecording?.saved === false &&
    results.cancelledVoiceRecording?.state?.open === false &&
    results.cancelledVoiceRecording?.state?.hasBlob === false &&
    results.imageExport.name === 'sophie.webp' &&
    results.imageExport.size > 1000 &&
    results.imageExport.size < 300000 &&
    results.independentImageEditors?.activeView === 'images' &&
    JSON.stringify(results.independentImageEditors?.before) === JSON.stringify(results.independentImageEditors?.after) &&
    results.exportedPerson?.occupation === 'Paramedic' &&
    errors.length === 0;

  console.log(JSON.stringify(results, null, 2));
  if (!passed) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
