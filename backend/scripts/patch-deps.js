// Patches transitive deps that are broken on newer Node versions but still
// pulled in unpatched by jsonwebtoken -> jwa (buffer-equal-constant-time
// reads `SlowBuffer.prototype` at load time; SlowBuffer was removed in Node 26).
// Runs automatically via the "postinstall" script since node_modules isn't
// version controlled and npm install would otherwise wipe this fix.
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'buffer-equal-constant-time',
  'index.js'
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const broken = "var SlowBuffer = require('buffer').SlowBuffer;";
const fixed = "var SlowBuffer = require('buffer').SlowBuffer || Buffer; // SlowBuffer removed in Node 26+";

const contents = fs.readFileSync(target, 'utf8');
if (contents.includes(broken)) {
  fs.writeFileSync(target, contents.replace(broken, fixed));
  console.log('[patch-deps] Patched buffer-equal-constant-time for Node 26+ compatibility');
}
