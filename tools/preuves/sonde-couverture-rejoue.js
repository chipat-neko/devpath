'use strict';
/**
 * tools/preuves/sonde-couverture-rejoue.js — QUELLE PART DES SORTIES ANNONCÉES LES NEUF
 * `rejoue-*.js` COUVRENT-ILS VRAIMENT ?
 *
 * Le point B3 les a versés dans la chaîne : 178 programmes, 309 lignes comparées, 0
 * divergence. Le chiffre serait trompeur sans son dénominateur — ce sont des TRANSPOSITIONS
 * JavaScript écrites à la main, donc leur couverture ne grandit pas toute seule quand une
 * leçon gagne un bloc. Cette sonde compte, pour chacun des neuf cours : les blocs du langage,
 * ceux qui ANNONCENT une sortie (commentaire `// affiche`, `=>`, « renvoie »… ou bloc `.txt`
 * voisin), et les programmes que l'outil rejoue.
 *
 *   node tools/preuves/sonde-couverture-rejoue.js
 *
 * Sonde de MESURE : elle ne rend aucun verdict et ne corrige rien.
 */
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var RACINE = path.resolve(__dirname, '..', '..');

var LANGS = ['cpp', 'rust', 'go', 'java', 'php', 'c', 'csharp', 'elixir', 'bash'];
var ANNONCE = /(?:\/\/|#|--)[^\n]*(?:affiche|=>|sortie|résultat|resultat|renvoie|donne|imprime)/i;

var totBlocs = 0, totAnnonce = 0, totRejoues = 0;
console.log('=== COUVERTURE DES NEUF « rejoue-* » ===\n');
console.log('| cours | blocs | annoncent une sortie | rejoués | couverture |');
console.log('|---|---|---|---|---|');
LANGS.forEach(function (l) {
  var dir = path.join(RACINE, 'pages', l);
  if (!fs.existsSync(dir)) { console.log('| ' + l + ' | dossier absent | | | |'); return; }
  var blocs = 0, annonce = 0;
  fs.readdirSync(dir).filter(function (f) { return /lecon-\d+\.html$/.test(f); }).forEach(function (f) {
    var s = fs.readFileSync(path.join(dir, f), 'utf8');
    var re = new RegExp('<code class="language-' + l + '">([\\s\\S]*?)</code>', 'g'), m;
    while ((m = re.exec(s))) { blocs++; if (ANNONCE.test(m[1])) annonce++; }
  });
  var sortie = '';
  try { sortie = cp.execSync('node ' + JSON.stringify(path.join(RACINE, 'tools', 'preuves', 'rejoue-' + l + '.js')), { encoding: 'utf8' }); }
  catch (e) { sortie = String((e && e.stdout) || ''); }
  var derniere = sortie.trim().split('\n').pop();
  var n = /(\d+)\s+(?:programme|bloc|script)/.exec(derniere);
  var rejoues = n ? Number(n[1]) : 0;
  totBlocs += blocs; totAnnonce += annonce; totRejoues += rejoues;
  var pc = annonce ? (100 * rejoues / annonce).toFixed(1) + ' %' : '—';
  console.log('| ' + l + ' | ' + blocs + ' | ' + annonce + ' | ' + rejoues + ' | ' + pc + ' |');
});
console.log('| **total** | **' + totBlocs + '** | **' + totAnnonce + '** | **' + totRejoues + '** | **' +
  (totAnnonce ? (100 * totRejoues / totAnnonce).toFixed(1) + ' %' : '—') + '** |');
console.log('\n  Le dénominateur qui compte est « annoncent une sortie » : un bloc qui n\'annonce');
console.log('  rien n\'a rien à comparer. La couverture ne grandit pas toute seule — chaque bloc');
console.log('  neuf demande une transposition écrite à la main.');
