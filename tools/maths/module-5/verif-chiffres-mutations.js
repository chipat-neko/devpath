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

/* LE TÉMOIN (chantier V18, point A6). Une faute compte « vue » dès que le vérificateur
   sort en erreur. Sans témoin, un vérificateur déjà rouge sur la page INTACTE fait donc
   passer les cinq fautes pour vues sans en avoir vu une seule : c'est ce qui est arrivé du
   2026-11-11 (recalcul des durées, V16/E2) au point A6 du V18, la durée d'en-tête
   « ~352 min » étant lue comme un chiffre sans source. La page intacte est donc posée
   exactement comme les pages mutées, et le vérificateur doit y être vert. */
fs.writeFileSync(COPIE, original, 'utf8');
try { execFileSync('node', ['tools/maths/module-5/verif-chiffres.js', COPIE], { encoding: 'utf8' }); }
catch (e) {
  fs.unlinkSync(COPIE);
  console.log('TÉMOIN ROUGE : le vérificateur échoue sur la page INTACTE — rien ne peut être conclu.');
  console.log(String(e.stdout || '').split('\n').filter(Boolean).slice(-4).join('\n'));
  process.exit(2);
}
console.log('0. témoin : page intacte, vérificateur VERT — la mesure a un sens');

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
