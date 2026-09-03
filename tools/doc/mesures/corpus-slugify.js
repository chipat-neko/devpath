/* MESURE PUBLIÉE DANS pages/doc/lecon-01.html.
   Ce que slugify() de js/lecon.js produit sur tous les titres réels du site,
   COURS « doc » EXCLU (voir corpus-lib.js : une leçon qui se compte elle-même
   périme ses propres chiffres le jour où on la publie).
   Rejouable : node tools/doc/mesures/corpus-slugify.js */
'use strict';
const lib = require('./corpus-lib.js');

const r = lib.releve();

console.log('lignes de la fonction lue dans js/lecon.js : ' + r.lignesFonction);
console.log('leçons parcourues (cours « doc » exclu) : ' + r.lecons);
console.log('   pages de redirection écartées        : ' + r.redirections);
console.log('titres h2 dans .prose                   : ' + r.titres);
console.log('   déjà porteurs d un id (ignorés)      : ' + r.avecId);
console.log('   contenant un caractère non ASCII     : ' + r.horsAscii);
console.log('   contenant une ligature (œ Œ æ Æ ß ﬁ ﬂ) : ' + r.ligature);
console.log('fragments distincts produits            : ' + r.distincts);
console.log('fragments VIDES                         : ' + r.vides.length);
console.log('COLLISIONS dans une même page           : ' + r.collisions.length);
r.vides.slice(0, 5).forEach((v) => console.log('   vide : ' + v.fichier + ' « ' + v.texte + ' »'));
r.collisions.slice(0, 5).forEach((c) => console.log('   collision : ' + c[0] + ' « ' + c[1] + ' » ⇄ « ' + c[2] + ' » -> ' + c[3]));
