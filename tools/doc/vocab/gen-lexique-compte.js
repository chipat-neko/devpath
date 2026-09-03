/* Compte les entrées du lexique PUBLIÉ (js/lexique-data.js), pour que la leçon
   n'écrive jamais ce nombre à la main : elle le lit dans le fichier livré. */
'use strict';
const fs = require('fs');
const path = require('path');
const CIBLE = path.join(__dirname, '..', '..', '..', 'js', 'lexique-data.js');

function entrees() {
  const src = fs.readFileSync(CIBLE, 'utf8');
  const w = {};
  /* eslint-disable no-new-func */
  new Function('window', src)(w);
  return w.LEXIQUE || [];
}
function total() { return entrees().length; }
function base() { return entrees().filter(function (e) { return (e.fam || 'base') === 'base'; }).length; }
function avecPiege() { return entrees().filter(function (e) { return !!e.piege; }).length; }

module.exports = { entrees, total, base, avecPiege };

if (require.main === module) {
  console.log(total() + ' entrées, dont ' + base() + ' de base et ' + avecPiege() + ' avec un piège.');
}
