/* tools/verif-controles.js — aucun CARACTÈRE DE CONTRÔLE ne doit traîner dans
   un fichier source, sauf là où il est voulu.
 *
 * POURQUOI CET OUTIL EXISTE
 * -------------------------
 * Un script d'édition écrit en Python, avec des chaînes non brutes, a transformé
 * « \b » en un vrai backspace (U+0008) à l'intérieur d'expressions régulières de
 * tools/doc/gen.js. Les motifs ne matchaient donc plus rien, deux compteurs de
 * la leçon 03 affichaient « 0 » au lieu de 18 et 1 — et RIEN ne l'a signalé :
 * ni `node --check`, ni les vérificateurs, ni la relecture du fichier, puisque
 * le caractère est invisible. Seule une capture d'écran de la page l'a montré.
 *
 * Deux endroits emploient ces caractères À DESSEIN (un séparateur improbable,
 * un marqueur de bloc) : ils sont déclarés ci-dessous et exemptés nommément.
 * Toute AUTRE occurrence est une erreur, et fait sortir en code 1.
 *
 * USAGE :  node tools/verif-controles.js [dossier]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const IGNORE = new Set(['node_modules', '.git', 'scratchpad', 'assets']);
const EXT = /\.(js|json|html|css|txt|md)$/;
/* tout caractère de contrôle sauf tabulation (9), saut de ligne (10) et
   retour chariot (13), qui sont légitimes partout. */
const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

/* Les emplois VOULUS, chacun avec sa raison. Un fichier qui n'est pas ici et
   qui porte un caractère de contrôle est un accident. */
const VOULUS = {
  'tools/verif-interpreteur.js': 'U+0001 comme séparateur de lignes improbable dans un join()',
  'js/markdown.js': 'U+0000 comme marqueur des blocs de code mis de côté',
};

let fichiers = 0;
const trouves = [];
function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { scan(p); continue; }
    if (!EXT.test(e.name)) continue;
    fichiers++;
    const s = fs.readFileSync(p, 'utf8');
    if (!CTRL.test(s)) continue;
    const rel = path.relative(process.cwd(), p).split(path.sep).join('/');
    const total = (s.match(new RegExp(CTRL.source, 'g')) || []).length;
    const i = s.search(CTRL);
    trouves.push({ rel, total, code: s.charCodeAt(i), extrait: s.slice(Math.max(0, i - 45), i + 45) });
  }
}

scan(process.argv[2] || '.');
const accidents = trouves.filter((t) => !VOULUS[t.rel]);

console.log('verif-controles.js — ' + fichiers + ' fichiers examinés.');
for (const t of trouves) {
  const voulu = VOULUS[t.rel];
  console.log('  ' + (voulu ? 'voulu ' : 'ACCIDENT') + '  ' + t.rel + '  ' + t.total +
    ' occurrence(s), U+' + t.code.toString(16).padStart(4, '0'));
  if (voulu) console.log('            ' + voulu);
  else console.log('            …' + JSON.stringify(t.extrait));
}
if (!trouves.length) console.log('  aucun caractère de contrôle.');
console.log('\n' + accidents.length + ' accident(s), ' + (trouves.length - accidents.length) + ' emploi(s) voulu(s).');
process.exit(accidents.length ? 1 : 0);
