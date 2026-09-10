'use strict';

/**
 * tools/preuves/sonde-type-exos.js — Le TYPE déclaré d'un exercice et la SOLUTION
 * qu'on lui a repliée disent-ils la même chose ?
 *
 * POURQUOI CETTE SONDE EXISTE
 * ---------------------------
 * `js/lecon.js` (initExos) apparie les entrées du bloc `data-exos` aux blocs
 * `.exercise` **par INDEX**. Rien ne garantit que l'entrée de rang i décrive
 * l'exercice de rang i : c'est un simple compte, et il s'était perdu.
 *
 * Le point B4a-2 du chantier V17 l'a payé sur cinq pages du cours `offensive` :
 * l'entrée #3 y portait `type:"code"` alors que l'énoncé était une rédaction en
 * trois phrases, dont la solution repliée est du `language-plaintext`. Un
 * exercice de rédaction jugé comme un programme n'est pas seulement faux : il
 * demande à l'apprenant d'écrire du code là où la leçon demande une phrase, et
 * `exos-code.js` le range en « sans solution repliée », c'est-à-dire NON JUGÉ.
 *
 * CE QU'ELLE MESURE — deux sens, très inégalement graves :
 *  · GRAVE  : entrée `type:"code"` dont le bloc `.exercise` de même rang n'offre
 *             AUCUNE solution `language-javascript`. La solution publiée ne peut
 *             pas passer un juge qui attend un programme.
 *  · INFO   : entrée `type:"text"` dont l'exercice montre pourtant du JavaScript.
 *             Ce n'est PAS une faute en soi — une rédaction peut s'illustrer d'un
 *             programme (tout le cours `maths` fait ainsi) — donc c'est compté,
 *             pas listé, sauf avec --tout.
 *
 * ELLE NE REND AUCUN VERDICT et sort toujours en 0 quand elle va au bout : c'est
 * une sonde de recensement, déclarée hors chaîne dans tools/hors-chaine.json.
 *
 * USAGE
 *   node tools/preuves/sonde-type-exos.js              tout le site, sens grave listé
 *   node tools/preuves/sonde-type-exos.js offensive    un cours
 *   node tools/preuves/sonde-type-exos.js --tout       liste aussi le sens informatif
 */

var fs = require('fs');
var path = require('path');

var RACINE = path.resolve(__dirname, '..', '..');
var args = process.argv.slice(2);
var TOUT = args.indexOf('--tout') !== -1;
var cible = args.filter(function (a) { return a.indexOf('--') !== 0; })[0] || null;

var base = path.join(RACINE, 'pages');
var entrees = 0, pages = 0, graves = [], infos = [], jsonKo = [];

fs.readdirSync(base).forEach(function (d) {
  if (cible && d !== cible) return;
  var dir = path.join(base, d);
  if (!fs.statSync(dir).isDirectory()) return;
  fs.readdirSync(dir).forEach(function (f) {
    if (!/^lecon-\d+\.html$/.test(f)) return;
    var rel = 'pages/' + d + '/' + f;
    var h = fs.readFileSync(path.join(dir, f), 'utf8');
    var m = h.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
    if (!m) return;
    pages++;
    var data;
    try { data = JSON.parse(m[1]); } catch (e) { jsonKo.push(rel + ' — ' + e.message); return; }
    if (!Array.isArray(data)) { jsonKo.push(rel + ' — la racine n\'est pas un tableau'); return; }
    /* Les blocs .exercise, dans l'ordre du document : c'est l'ordre qu'initExos suit. */
    var blocs = h.split('<div class="exercise">').slice(1);
    data.forEach(function (e, i) {
      entrees++;
      var t = e && e.type;
      var bloc = blocs[i] || '';
      /* La solution est celle du <details>, pas le premier bloc de code venu : un
         énoncé peut montrer sa donnée d'entrée AVANT le repli (c'est le cas de
         data-eng/lecon-04, faux positif de la première version de cette sonde).
         Même repère que exos-code.js : `details code.language-javascript`. */
      var dep = bloc.indexOf('<details');
      var repli = dep === -1 ? '' : bloc.slice(dep);
      var langs = (repli.match(/class="language-([a-z0-9]+)"/g) || []).map(function (s) {
        return s.replace('class="language-', '').replace('"', '');
      });
      var premiere = langs.length ? langs[0] : null;
      var solJs = langs.indexOf('javascript') !== -1;
      if (t === 'code' && !solJs) {
        graves.push(rel + ' #' + (i + 1) + '  solution repliée : ' + (premiere || 'AUCUNE'));
      } else if (solJs && t !== 'code' && t !== 'python' && t !== 'sql' && t !== 'regex') {
        infos.push(rel + ' #' + (i + 1) + '  type:"' + t + '" mais solution en javascript');
      }
    });
  });
});

console.log('sonde-type-exos.js — ' + entrees + ' entrée(s) data-exos sur ' + pages + ' page(s)' +
            (cible ? ' du cours ' + cible : '') + '\n');

if (jsonKo.length) {
  console.log('  JSON ILLISIBLE (' + jsonKo.length + ') :');
  jsonKo.forEach(function (l) { console.log('    · ' + l); });
  console.log('');
}

console.log('  GRAVE — type:"code" sans solution JavaScript de même rang : ' + graves.length);
graves.forEach(function (l) { console.log('    · ' + l); });

console.log('\n  info — solution JavaScript sous un type non exécuté : ' + infos.length +
            (TOUT ? '' : '   (--tout pour la liste)'));
if (TOUT) infos.forEach(function (l) { console.log('    · ' + l); });

console.log('\n  Sonde de recensement : aucun verdict, sortie 0. Le sens GRAVE est une dette de' +
            '\n  contenu — un exercice de rédaction jugé comme un programme.');
