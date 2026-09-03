/* tools/maths/preuve-injection.js — L'ÉPREUVE DU VÉRIFICATEUR DE VÉRITÉ.
   ======================================================================
   V15 · point F2.

   POURQUOI CE FICHIER EXISTE
   --------------------------
   `verif-verite.js` rend « 0 divergent ». Un vérificateur qui rend toujours
   « 0 divergent » rend exactement la même chose qu'un vérificateur qui ne
   regarde rien. Tant qu'on ne lui a pas MONTRÉ une faute, son vert ne prouve
   rien — c'est la leçon des cinq exemples faux qui ont traversé quatre
   vérificateurs verts.

   Ce programme abîme donc le cours, une leçon à la fois : il remplace dans la
   page PUBLIÉE un fait chiffré par un fait faux, relance le groupe de contrôles
   qui couvre cette leçon, et exige qu'il rougisse. Puis il restaure la page,
   à l'octet près, avant de passer à la suivante.

   Les treize fautes sont choisies dans treize leçons différentes et dans des
   familles de faits différentes : un nombre de la prose, un compteur d'appels,
   une cellule de tableau, une colonne entière, une somme de probabilités.

   USAGE   node tools/maths/preuve-injection.js [-v]
   SORTIE  0 si les treize fautes sont vues, 1 si l'une passe.
*/
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const VERBEUX = process.argv.indexOf('-v') !== -1;
const RACINE = path.resolve(__dirname, '..', '..');
const OUTIL = path.join(__dirname, 'verif-verite.js');

/* leçon → groupe de contrôles qui la couvre. */
const GROUPE = { 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 4, 10: 5, 11: 5, 12: 6, 13: 6 };

const FAUTES = [
  { lecon: 1, quoi: 'prose : 2^20 annoncé 1 048 579 au lieu de 1 048 576',
    de: '1&nbsp;048&nbsp;576', a: '1&nbsp;048&nbsp;579' },
  { lecon: 2, quoi: 'prose : 21 propositions testées au lieu de 19',
    de: '19 propositions', a: '21 propositions' },
  { lecon: 3, quoi: 'sortie : le court-circuit compte 3 appels au lieu de 2',
    de: 'estValide appelée 2 fois', a: 'estValide appelée 3 fois' },
  { lecon: 4, quoi: 'inclusion-exclusion : 475 000 destinataires au lieu de 474 000',
    de: '474 000', a: '475 000' },
  { lecon: 5, quoi: 'solution 5 : 337 podiums au lieu de 336',
    de: '336 podiums', a: '337 podiums' },
  { lecon: 6, quoi: 'collisions : l’approximation recopiée dans la colonne « seuil exact » à 64 bits',
    de: 'hors portée     5.06 x 10^9', a: '5.06 x 10^9     5.06 x 10^9' },
  { lecon: 7, quoi: 'modulo : le reste de -5 modulo 3 devient 2 au lieu de 1',
    de: '-5     -2       1', a: '-5     -2       2' },
  { lecon: 8, quoi: 'densité : 78 598 premiers sous un million au lieu de 78 498',
    de: '78498', a: '78598' },
  { lecon: 9, quoi: 'IEEE 754 : 56 décimales exactes pour 0,1 au lieu de 55',
    de: 'chiffres apres la virgule : 55', a: 'chiffres apres la virgule : 56' },
  { lecon: 10, quoi: 'graphes : 11 arêtes annoncées au lieu de 10',
    de: 'graphe : 8 sommets, 10 aretes', a: 'graphe : 8 sommets, 11 aretes' },
  { lecon: 11, quoi: 'marche : la colonne « archive » somme à 1,5 au lieu de 1',
    de: 'archive=1.000', a: 'archive=1.500' },
  { lecon: 12, quoi: 'O() : le terme jeté passe sous 1 % à n = 1 655 au lieu de 1 654',
    de: '1654', a: '1655' },
  { lecon: 13, quoi: 'logarithmes : log₂(1000) publié 9,976 au lieu de 9,966',
    de: '1000                 9     9.966', a: '1000                 9     9.976' },
];

function page(n) {
  return path.join(RACINE, 'pages', 'maths', 'lecon-' + String(n).padStart(2, '0') + '.html');
}

function groupe(g) {
  try {
    const out = cp.execSync('node "' + OUTIL + '" --groupe ' + g,
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], cwd: RACINE });
    return { code: 0, sortie: out };
  } catch (err) {
    return { code: err.status === undefined ? -1 : err.status, sortie: (err.stdout || '') + (err.stderr || '') };
  }
}

function nomsEnEchec(sortie) {
  return sortie.split('\n')
    .filter(function (l) { return /ÉCHEC/.test(l); })
    .map(function (l) { return l.replace(/^\s*ÉCHEC\s*/, '').trim(); });
}

console.log('preuve-injection.js — treize fautes posées dans le cours `maths`, une par leçon\n');

/* Point de départ : le cours doit être SAIN, sinon la preuve ne veut rien dire. */
const groupesUtiles = [];
for (const f of FAUTES) if (groupesUtiles.indexOf(GROUPE[f.lecon]) < 0) groupesUtiles.push(GROUPE[f.lecon]);
let departSain = true;
for (const g of groupesUtiles) {
  const r = groupe(g);
  if (r.code !== 0) {
    departSain = false;
    console.log('  ARRÊT — le groupe ' + g + ' rougit AVANT toute injection :');
    console.log(nomsEnEchec(r.sortie).map(function (s) { return '        ' + s; }).join('\n'));
  }
}
if (!departSain) {
  console.log('\n  Un cours déjà divergent ne peut pas servir de témoin. Corrige d’abord.');
  process.exit(2);
}
console.log('  témoin : les ' + groupesUtiles.length + ' groupes concernés sont verts avant injection.\n');

let vues = 0;
const manquees = [];

for (const f of FAUTES) {
  const P = page(f.lecon);
  const original = fs.readFileSync(P, 'utf8');
  const n = original.split(f.de).length - 1;
  if (n === 0) {
    manquees.push({ f: f, pourquoi: 'motif absent de la page : « ' + f.de + ' »' });
    console.log('  ✗ leçon ' + f.lecon + ' — MOTIF ABSENT : « ' + f.de + ' » (faute non posée)');
    continue;
  }
  let res;
  try {
    fs.writeFileSync(P, original.split(f.de).join(f.a));
    res = groupe(GROUPE[f.lecon]);
  } finally {
    fs.writeFileSync(P, original);            /* la page revient à l'octet près, quoi qu'il arrive */
  }
  const relu = fs.readFileSync(P, 'utf8');
  if (relu !== original) {
    console.log('  ARRÊT — la restauration de ' + P + ' a échoué.');
    process.exit(2);
  }
  const echecs = nomsEnEchec(res.sortie);
  if (res.code === 1 && echecs.length) {
    vues++;
    console.log('  ✓ leçon ' + String(f.lecon).padStart(2) + ' — ' + f.quoi);
    console.log('       vue par : ' + echecs[0] + (echecs.length > 1 ? '  (+' + (echecs.length - 1) + ' autre(s))' : ''));
    if (VERBEUX) for (const e of echecs.slice(1)) console.log('                 ' + e);
  } else {
    manquees.push({ f: f, pourquoi: 'groupe ' + GROUPE[f.lecon] + ' resté vert (code ' + res.code + ')' });
    console.log('  ✗ leçon ' + String(f.lecon).padStart(2) + ' — NON VUE : ' + f.quoi);
  }
  console.log('       (' + n + ' occurrence(s) remplacée(s), page restaurée à l’identique)');
}

console.log('\n=== RÉSUMÉ ===');
console.log('  fautes posées .... ' + FAUTES.length);
console.log('  fautes VUES ...... ' + vues);
console.log('  fautes MANQUÉES .. ' + manquees.length);
if (!manquees.length) {
  console.log('\n  Chaque faute injectée a rougi le contrôle qui la couvre, et le cours est intact.');
  process.exit(0);
}
console.log('');
for (const m of manquees) console.log('  leçon ' + m.f.lecon + ' : ' + m.pourquoi);
process.exit(1);
