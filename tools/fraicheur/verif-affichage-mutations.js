'use strict';

/**
 * tools/fraicheur/verif-affichage-mutations.js — QUI VÉRIFIE LE VÉRIFICATEUR ?
 *
 * `verif-affichage.js` dit « 0 écart ». Un vérificateur qui ne trouve rien peut
 * être vert pour deux raisons opposées : tout va bien, ou il ne regarde rien.
 * Ce script tranche. Il abîme `js/main.js` d'UNE faute réaliste à la fois,
 * relance le contrôle, et exige qu'il rougisse. Puis il restaure le fichier.
 *
 * Une faute injectée que le contrôle ne voit pas est un ANGLE MORT : elle
 * signale un contrôle à écrire, pas un succès.
 *
 * USAGE : node tools/fraicheur/verif-affichage-mutations.js
 * Code de sortie : 1 si au moins une faute passe inaperçue.
 */

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RACINE = path.resolve(__dirname, '..', '..');
var MAIN = path.join(RACINE, 'js', 'main.js');
var PAGE = 'pages/react/lecon-20.html';   // 4 marques, dont une longue

/* Chaque mutation : un libellé, le texte à trouver, ce par quoi le remplacer. */
var MUTATIONS = [
  ['exposant : mauvaise année',        'sup.textContent = d.an;',                  'sup.textContent = "1999";'],
  ['exposant : plus aria-hidden',      'sup.setAttribute("aria-hidden", "true");', 'sup.setAttribute("data-x", "1");'],
  ['exposant : pas inséré',            'el.parentNode.insertBefore(sup, el.nextSibling);', 'void 0;'],
  ['lecteur d’écran : classe perdue',  'sr.className = "sr-only";',                'sr.className = "sr-none";'],
  ['lecteur d’écran : date absente',   'sr.textContent = " (état arrêté au " + d.texte + ") ";', 'sr.textContent = " (daté) ";'],
  ['infobulle vide',                   'el.title = "Affirmation datée : état arrêté au " + d.texte + ".";', 'el.title = "";'],
  ['pas d’identifiant sur la marque',  'if (!el.id) el.id = "fraicheur-" + (i + 1);', 'void 0;'],
  ['mois faux (table décalée)',        'var mois = MOIS_FR[Number(m[2]) - 1];',    'var mois = MOIS_FR[Number(m[2]) % 12];'],
  ['bilan absent',                     'hote.appendChild(det);',                   'void 0;'],
  ['bilan déplié par défaut',          'det.className = "fraicheur-bilan";',       'det.className = "fraicheur-bilan"; det.open = true;'],
  ['bilan : compte faux',              'sum.textContent = "Fraîcheur de cette page — " + lignes.length +', 'sum.textContent = "Fraîcheur de cette page — " + (lignes.length + 7) +'],
  ['bilan : lien mort',                'a.setAttribute("href", "#" + l.id);',      'a.setAttribute("href", "#néant");'],
  ['bilan : une entrée manquante',     'lignes.forEach(function (l) {',            'lignes.slice(1).forEach(function (l) {'],
  ['bilan : note trafiquée',           '"consulte rien en ligne : il ne peut pas dire s\'ils sont encore vrais, seulement quand ils " +', '"consulte parfois le réseau, " +'],
];

var original = fs.readFileSync(MAIN, 'utf8');
var vues = 0, aveugles = [];

function controler() {
  var r = cp.spawnSync(process.execPath,
    [path.join(__dirname, 'verif-affichage.js'), PAGE],
    { cwd: RACINE, encoding: 'utf8' });
  return { code: r.status, sortie: (r.stdout || '') + (r.stderr || '') };
}

console.log('verif-affichage-mutations.js — ' + MUTATIONS.length + ' fautes injectées dans js/main.js, une à la fois\n');

/* Témoin : sans mutation, le contrôle doit être VERT. Sinon tout le reste ment. */
var temoin = controler();
if (temoin.code !== 0) {
  console.log('  Le contrôle n’est PAS vert avant mutation — rien ne peut être conclu :');
  console.log(temoin.sortie.split('\n').filter(function (l) { return l.trim(); }).slice(-4).join('\n'));
  process.exit(2);
}
console.log('  témoin (sans faute) : vert.\n');

try {
  for (var i = 0; i < MUTATIONS.length; i++) {
    var m = MUTATIONS[i];
    if (original.indexOf(m[1]) < 0) {
      aveugles.push(m[0] + '  [le texte à muter n’existe plus dans js/main.js]');
      console.log('  ?? ' + m[0] + ' — texte introuvable, mutation non appliquée');
      continue;
    }
    fs.writeFileSync(MAIN, original.replace(m[1], m[2]));
    var r = controler();
    if (r.code === 1) { vues++; console.log('  vu   · ' + m[0]); }
    else { aveugles.push(m[0]); console.log('  RATÉ · ' + m[0] + ' (code ' + r.code + ')'); }
  }
} finally {
  fs.writeFileSync(MAIN, original);
}

var apres = controler();
console.log('\n  js/main.js restauré · contrôle après restauration : ' + (apres.code === 0 ? 'vert' : 'ROUGE (!)'));
console.log('  fautes vues : ' + vues + ' / ' + MUTATIONS.length);
if (aveugles.length) {
  console.log('  ANGLES MORTS :');
  aveugles.forEach(function (a) { console.log('    · ' + a); });
}
process.exit(aveugles.length || apres.code !== 0 ? 1 : 0);
