'use strict';

/**
 * tools/fraicheur/verif-fraicheur-mutations.js — QUI VÉRIFIE verif-fraicheur.js ?
 *
 * Le contrôle est vert. Vert parce que tout va bien, ou vert parce qu'il ne
 * regarde rien ? On abîme UNE page de test d'une faute réaliste à la fois, on
 * relance le contrôle, et on exige qu'il rougisse — puis on restaure la page.
 *
 * USAGE : node tools/fraicheur/verif-fraicheur-mutations.js
 * Code de sortie : 1 si une faute passe inaperçue.
 */

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RACINE = path.resolve(__dirname, '..', '..');
var PAGE = path.join(RACINE, 'pages', 'react', 'lecon-22.html');
var REL = 'pages/react/lecon-22.html';
var VERIF = path.join(RACINE, 'tools', 'verif-fraicheur.js');

var original = fs.readFileSync(PAGE, 'utf8');
var mMarque = /<span class="fraicheur"[^>]*>[\s\S]*?<\/span>/.exec(original);
if (!mMarque) { console.log('La page de test ne porte plus de marque : rien à muter.'); process.exit(2); }
var MARQUE = mMarque[0];
var OUVRANTE = /<span class="fraicheur"[^>]*>/.exec(MARQUE)[0];
var DEDANS = MARQUE.slice(OUVRANTE.length, -'</span>'.length);

/* [libellé, texte cherché, remplacement, avertissement seulement ?] */
var MUTATIONS = [
  ['data-arrete absent', OUVRANTE, '<span class="fraicheur">', false],
  ['date au format français', OUVRANTE, OUVRANTE.replace(/data-arrete="[^"]*"/, 'data-arrete="03/09/2026"'), false],
  ['jour inexistant (31 février)', OUVRANTE, OUVRANTE.replace(/data-arrete="[^"]*"/, 'data-arrete="2026-02-31"'), false],
  ['date dans le futur', OUVRANTE, OUVRANTE.replace(/data-arrete="[^"]*"/, 'data-arrete="2099-01-01"'), false],
  ['data-duree = 0', OUVRANTE, OUVRANTE.replace(/data-duree="[^"]*"/, 'data-duree="0"'), false],
  ['data-duree en toutes lettres', OUVRANTE, OUVRANTE.replace(/data-duree="[^"]*"/, 'data-duree="douze"'), false],
  ['marque imbriquée', MARQUE, OUVRANTE + '<span class="fraicheur" data-arrete="2026-09-03">' + DEDANS + '</span></span>', false],
  ['marque vide', MARQUE, OUVRANTE + '</span>', false],
  ['balises non appariées dedans', MARQUE, OUVRANTE + '<strong>' + DEDANS + '</span>', false],
  ['marque hors de l’article', '<article class="prose">',
    '<span class="fraicheur" data-arrete="2026-09-03">hors article</span><article class="prose">', false],
  ['marque dans un bloc de code', '<pre>', '<pre><span class="fraicheur" data-arrete="2026-09-03">x</span>', false],
  ['affirmation trop vieille (durée dépassée du double)', OUVRANTE,
    OUVRANTE.replace(/data-arrete="[^"]*"/, 'data-arrete="2019-01-01"'), false],
  ['6 marques sur la page (parcimonie)', MARQUE,
    MARQUE + new Array(6).join('<p><span class="fraicheur" data-arrete="2026-09-03">bis</span></p>'), true],
];

function controler(strict) {
  var a = [VERIF, '--cours=react'];
  if (strict) a.push('--strict');
  var r = cp.spawnSync(process.execPath, a, { cwd: RACINE, encoding: 'utf8' });
  return { code: r.status, sortie: (r.stdout || '') + (r.stderr || '') };
}

console.log('verif-fraicheur-mutations.js — ' + MUTATIONS.length + ' fautes injectées dans ' + REL + '\n');
var temoin = controler(true);
if (temoin.code !== 0) {
  console.log('  Le contrôle n’est pas vert AVANT mutation — rien ne peut être conclu :');
  console.log(temoin.sortie.split('\n').slice(-12).join('\n'));
  process.exit(2);
}
console.log('  témoin (sans faute, --strict) : vert.\n');

var vues = 0, aveugles = [];
try {
  MUTATIONS.forEach(function (mu) {
    if (original.indexOf(mu[1]) < 0) {
      aveugles.push(mu[0] + '  [texte à muter introuvable]');
      console.log('  ??   · ' + mu[0] + ' — texte introuvable');
      return;
    }
    fs.writeFileSync(PAGE, original.replace(mu[1], mu[2]));
    var r = controler(mu[3]);   // les avertissements ne rougissent qu'en --strict
    if (r.code === 1) { vues++; console.log('  vu   · ' + mu[0]); }
    else { aveugles.push(mu[0]); console.log('  RATÉ · ' + mu[0] + ' (code ' + r.code + ')'); }
  });
} finally {
  fs.writeFileSync(PAGE, original);
}

var apres = controler(true);
console.log('\n  page restaurée · contrôle après restauration : ' + (apres.code === 0 ? 'vert' : 'ROUGE (!)'));
console.log('  fautes vues : ' + vues + ' / ' + MUTATIONS.length);
if (aveugles.length) {
  console.log('  ANGLES MORTS :');
  aveugles.forEach(function (a) { console.log('    · ' + a); });
}
process.exit(aveugles.length || apres.code !== 0 ? 1 : 0);
