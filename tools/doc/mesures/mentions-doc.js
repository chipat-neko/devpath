/* MESURE PUBLIÉE : combien de leçons du site renvoient l'apprenant vers un
   document de référence — c'est-à-dire, presque toujours, vers un document en
   anglais — sans jamais lui apprendre à le lire.
   Le cours « doc » est EXCLU du corpus (voir corpus-lib.js) : il parle de ces
   documents à chaque page, et s'y compter fausserait sa propre mesure. */
'use strict';
const fs = require('fs'), path = require('path');
const lib = require('./corpus-lib.js');

const MOTIFS = [
  ['« documentation officielle »', /documentation officielle/gi],
  ['« doc officielle »', /\bdoc officielle/gi],
  ['« MDN »', /\bMDN\b/g],
  ['« la spécification »', /la sp[ée]cification/gi],
  ['une RFC', /\bRFC\s?\d{3,5}\b/g],
];
const lecons = lib.fichiersLecons();
const compteurs = MOTIFS.map(() => ({ pages: new Set(), occurrences: 0 }));
const pagesTouchees = new Set();

for (const f of lecons) {
  const html = fs.readFileSync(f, 'utf8');
  const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
  if (!art) continue;
  const rel = path.relative(lib.RACINE, f).replace(/\\/g, '/');
  MOTIFS.forEach(([, re], i) => {
    const n = (art[0].match(re) || []).length;
    if (n) { compteurs[i].pages.add(rel); compteurs[i].occurrences += n; pagesTouchees.add(rel); }
  });
}
console.log('leçons parcourues : ' + lecons.length);
MOTIFS.forEach(([nom], i) => {
  console.log('  ' + nom.padEnd(30) + compteurs[i].pages.size + ' leçon(s), ' +
    compteurs[i].occurrences + ' occurrence(s)');
});
console.log('leçons renvoyant à un document de référence : ' + pagesTouchees.size);
const cours = new Set([...pagesTouchees].map((p) => p.split('/')[1]));
console.log('cours concernés : ' + cours.size + ' — ' + [...cours].sort().join(', '));
