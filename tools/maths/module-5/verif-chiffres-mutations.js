/* Le vérificateur de chiffres est-il capable de VOIR une faute ? On en injecte,
   une par une, dans une copie de la page, et on exige qu'il la signale. */
'use strict';
const fs = require('fs');
const { execFileSync } = require('child_process');

const PAGE = 'pages/maths/lecon-12.html';
const COPIE = 'scratchpad/mut-lecon-12.html';
const original = fs.readFileSync(PAGE, 'utf8');

const FAUTES = [
  ['<strong>127&nbsp;502&nbsp;330</strong> opérations', '<strong>127&nbsp;502&nbsp;331</strong> opérations', 'un chiffre décalé de 1'],
  ['soit <strong>298,6</strong> fois plus', 'soit <strong>312,4</strong> fois plus', 'un rapport inventé'],
  ["<em>n</em> = <strong>3&nbsp;987</strong>", "<em>n</em> = <strong>4&nbsp;120</strong>", 'un croisement faux'],
  ['<strong>65&nbsp;537</strong> unités, soit', '<strong>65&nbsp;540</strong> unités, soit', 'un pic arrondi à tort'],
  ['<strong>44&nbsp;722</strong> lignes', '<strong>45&nbsp;000</strong> lignes', 'un seuil arrondi'],
];

let vues = 0;
FAUTES.forEach(function (f, i) {
  const [avant, apres, quoi] = f;
  if (original.indexOf(avant) === -1) { console.log((i + 1) + '. MOTIF ABSENT : ' + quoi); return; }
  fs.writeFileSync(COPIE, original.replace(avant, apres), 'utf8');
  let vue = false;
  try { execFileSync('node', ['tools/maths/module-5/verif-chiffres.js', COPIE], { encoding: 'utf8' }); }
  catch (e) { vue = true; }
  if (vue) vues++;
  console.log((i + 1) + '. ' + (vue ? 'VUE   ' : 'RATÉE ') + quoi);
});
fs.unlinkSync(COPIE);
console.log('');
console.log(vues + '/' + FAUTES.length + ' fautes injectées ont été vues.');
process.exit(vues === FAUTES.length ? 0 : 1);
