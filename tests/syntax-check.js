const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let executable = 0;
let json = 0;
let match;
while ((match = re.exec(html))) {
  const attrs = match[1] || '';
  const typeMatch = attrs.match(/type=["']?([^"'\s>]+)/i);
  const type = typeMatch ? typeMatch[1].toLowerCase() : 'text/javascript';
  if (type.includes('json')) {
    JSON.parse(match[2]);
    json += 1;
  } else {
    new Function(match[2]);
    executable += 1;
  }
}
console.log(`compiled executable inline scripts: ${executable}`);
console.log(`validated json script tags: ${json}`);
