/* Exécute les programmes de tools/doc/code/ et montre leur sortie, exactement
   comme gen.js le fera. Sert à mettre au point avant d'assembler la page. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const lib = require('./corpus-lib.js');
const SLUG = lib.slugifyDuSite().source.split('\n')
  .map((l, i) => (i === 0 ? l : l.replace(/^ {2}/, ''))).join('\n');

function fmt(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
const CODE = path.join(__dirname, '..', 'code');
const cibles = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(CODE);
for (const f of cibles) {
  const src = fs.readFileSync(path.join(CODE, f), 'utf8').replace('/*@@SLUGIFY@@*/', SLUG);
  const out = [];
  const push = function () { out.push(Array.prototype.slice.call(arguments).map(fmt).join(' ')); };
  const t0 = Date.now();
  try { vm.runInNewContext(src, vm.createContext({ console: { log: push, warn: push, error: push } }), { timeout: 5000 }); }
  catch (e) { out.push('!! ' + e.name + ': ' + e.message); }
  console.log('===== ' + f + '  (' + (Date.now() - t0) + ' ms) =====');
  console.log(out.join('\n'));
  console.log('');
}
