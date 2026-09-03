/* Écrit tools/doc/code/titres-reels.js à partir des VRAIS titres du site.
   Aucun titre n'est recopié à la main : chacun est lu dans sa leçon par le
   décodeur partagé de corpus-lib.js, et le fichier produit porte le chemin de
   sa source en commentaire. */
'use strict';
const fs = require('fs'), path = require('path');
const lib = require('./corpus-lib.js');

const tous = lib.titres().filter(function (t) {
  /* on écarte tout titre portant un caractère invisible : dans un bloc de code
     publié, une espace insécable serait indétectable à l'œil du lecteur. */
  return t.texte && !/[ ​-‍﻿]/.test(t.texte);
});

const AVEC_LIGATURE = /[œŒæÆßﬁﬂ]/;
const ligature = tous.filter((x) => AVEC_LIGATURE.test(x.texte)).slice(0, 4);
const restants = tous.filter((x) => !AVEC_LIGATURE.test(x.texte));
/* 6 titres ordinaires pris à intervalle régulier : aucun choix arbitraire. */
const pas = Math.floor(restants.length / 6);
const ordinaires = [0, 1, 2, 3, 4, 5].map((i) => restants[i * pas]);
const choisis = ordinaires.concat(ligature);

const lignes = [
  '/* Dix titres <h2> lus dans les leçons de ce site, et le fragment que',
  '   slugify() en fait. Aucun n\'a été inventé pour l\'occasion. */',
  '/*@@SLUGIFY@@*/',
  '',
  'var titres = [',
];
for (const c of choisis) {
  lignes.push('  // ' + c.fichier);
  lignes.push('  ' + JSON.stringify(c.texte) + ',');
}
lignes.push('];');
lignes.push('');
lignes.push('titres.forEach(function (t) {');
lignes.push('  console.log(slugify(t) + "   <- " + t);');
lignes.push('});');

const cible = path.join(__dirname, '..', 'code', 'titres-reels.js');
fs.writeFileSync(cible, lignes.join('\n') + '\n', 'utf8');
console.log('titres h2 lisibles dans le corpus : ' + tous.length);
console.log('   dont à ligature                : ' + tous.filter((x) => AVEC_LIGATURE.test(x.texte)).length);
console.log('écrit ' + path.relative(lib.RACINE, cible) + ' — ' + choisis.length + ' titres');
choisis.forEach((c) => console.log('   ' + c.fichier + '  « ' + c.texte + ' »'));
