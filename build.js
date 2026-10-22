'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = __dirname;
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(out, 'index.html'));
const partPaths = Array.from({ length: 19 }, (_, i) => path.join(root, 'lunix-parts', 'part-' + String(i).padStart(2, '0') + '.bin'));
const apk = Buffer.concat(partPaths.map(p => fs.readFileSync(p)));
const expectedSize = 9285995;
const expectedSha256 = 'e127a01b42da3316a90b5fdd65457f68bd80f24eeb1478d6c83b907cf94db4a7';
const actualSha256 = crypto.createHash('sha256').update(apk).digest('hex');
if (apk.length !== expectedSize || actualSha256 !== expectedSha256) { throw new Error('Lunix APK integrity check failed: size=' + apk.length + ', sha256=' + actualSha256); }
fs.writeFileSync(path.join(out, 'Lunix_v1.0.2_1792204704534.apk'), apk);
console.log('Built verified Lunix APK (' + apk.length + ' bytes, sha256=' + actualSha256 + ')');
