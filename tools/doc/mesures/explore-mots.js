/* Exploration : quels mots ASCII reviennent dans les BLOCS DE CODE du site ?
   Classement par nombre de COURS DISTINCTS — « revenir partout » est une mesure
   de transversalité, pas de volume : 400 occurrences dans un seul cours ne
   prouvent rien. */
'use strict';
const fs = require('fs'), path = require('path');
const lib = require('./corpus-lib.js');

const parMot = new Map();
let nbLecons = 0, nbBlocs = 0;
for (const f of lib.fichiersLecons()) {
  const html = fs.readFileSync(f, 'utf8');
  const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
  if (!art) continue;
  nbLecons++;
  const cours = path.relative(lib.RACINE, f).split(path.sep)[1];
  const dansCetteLecon = new Set();
  for (const b of art[0].matchAll(/<code[^>]*>([\s\S]*?)<\/code>/g)) {
    nbBlocs++;
    const txt = lib.texteDe(b[1]);
    for (const m of txt.matchAll(/[A-Za-z_][A-Za-z_]{2,}/g)) dansCetteLecon.add(m[0].toLowerCase());
  }
  for (const w of dansCetteLecon) {
    if (!parMot.has(w)) parMot.set(w, { cours: new Set(), lecons: 0 });
    const e = parMot.get(w); e.cours.add(cours); e.lecons++;
  }
}
const tri = [...parMot.entries()].map(([w, e]) => [w, e.cours.size, e.lecons])
  .sort((a, b) => b[1] - a[1] || b[2] - a[2]);
console.log('leçons ' + nbLecons + ', blocs <code> ' + nbBlocs + ', mots distincts ' + parMot.size);
const N = Number(process.argv[2] || 150);
for (const [w, c, l] of tri.slice(0, N)) {
  console.log(String(c).padStart(3) + ' cours  ' + String(l).padStart(5) + ' lecons  ' + w);
}
