import { writeFileSync } from 'node:fs';
// 1x1 transparent PNG
const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buf = Buffer.from(b64, 'base64');
for (const p of ['public/favicon-32.png', 'public/apple-touch-icon.png', 'public/og-default.png']) {
  writeFileSync(p, buf);
}
console.log('placeholders written');
