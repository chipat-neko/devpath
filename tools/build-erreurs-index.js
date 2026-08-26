'use strict';
/**
 * tools/build-erreurs-index.js — L'INDEX LÉGER du décodeur, pour les leçons.
 *
 * POURQUOI PAS `js/erreurs-data.js` DIRECTEMENT. Le fichier de données pèse une
 * cinquantaine de kilo-octets : causes, remèdes, exemples fautifs et corrigés. Une leçon
 * n'a besoin que de savoir QUELLES erreurs la concernent, et comment les nommer en une
 * ligne. On dérive donc un index minuscule — href → [{ id, gabarit, langue }] — que les
 * 31 leçons citées chargent à la place. Le reste du site ne charge rien.
 *
 * MODE COMPARAISON PAR DÉFAUT, comme `tools/build-index.js` : sans `--write`, le script
 * dit seulement si le fichier sur disque est à jour.
 *
 *   node tools/build-erreurs-index.js            compare
 *   node tools/build-erreurs-index.js --write    écrit js/erreurs-index.js
 */
var fs = require('fs'), path = require('path');
var RACINE = path.resolve(__dirname, '..');
var ECRIRE = process.argv.indexOf('--write') !== -1;

var w = {};
new Function('window', fs.readFileSync(path.join(RACINE, 'js', 'erreurs-data.js'), 'utf8'))(w);
var ERREURS = w.ERREURS || [];
if (!ERREURS.length) { console.log('js/erreurs-data.js vide'); process.exit(1); }

var par = {};
ERREURS.forEach(function (e) {
  if (!e.lecon || !e.lecon.href) return;
  (par[e.lecon.href] = par[e.lecon.href] || []).push({ id: e.id, gabarit: e.gabarit, langue: e.langue });
});
var cles = Object.keys(par).sort();

var out = '/* =============================================================================\n' +
  '   erreurs-index.js — DÉRIVÉ de js/erreurs-data.js par tools/build-erreurs-index.js.\n' +
  '   NE PAS ÉDITER À LA MAIN : régénérer après toute modification du décodeur.\n' +
  '\n' +
  '   À quoi il sert : les leçons citées par le décodeur affichent un encart « quand ça\n' +
  '   casse ». Elles n\'ont pas besoin des causes, des remèdes ni des exemples — juste du\n' +
  '   nom des erreurs qui les concernent. Cet index pèse quelques kilo-octets là où le\n' +
  '   fichier de données en pèse une cinquantaine.\n' +
  '   Clé : le chemin de la leçon, relatif à pages/.\n' +
  '   ============================================================================= */\n' +
  'window.ERREURS_INDEX = {\n' +
  cles.map(function (k) {
    return '  ' + JSON.stringify(k) + ': [\n' +
      par[k].map(function (e) { return '    ' + JSON.stringify(e); }).join(',\n') + '\n  ]';
  }).join(',\n') + '\n};\n';

var F = path.join(RACINE, 'js', 'erreurs-index.js');
var ancien = fs.existsSync(F) ? fs.readFileSync(F, 'utf8') : '';
var total = cles.reduce(function (a, k) { return a + par[k].length; }, 0);
console.log('index du décodeur : ' + cles.length + ' leçon(s), ' + total + ' renvoi(s), ' +
  Math.round(out.length / 1024) + ' Ko — ' + (ancien === out ? 'identique au fichier cible' : 'DIFFÉRENT du fichier cible'));
if (ECRIRE && ancien !== out) { fs.writeFileSync(F, out, 'utf8'); console.log('  écrit -> js/erreurs-index.js'); }
else if (!ECRIRE) console.log('  (mode comparaison : rien écrit)');
