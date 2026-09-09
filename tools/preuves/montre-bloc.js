'use strict';
/**
 * tools/preuves/montre-bloc.js — afficher le code d'un bloc `language-javascript`
 * tel que `verif-js.js` le voit (même expression, même numérotation, même décodage
 * des entités). Sert à juger à l'œil un bloc signalé en panne SANS le retaper.
 *
 *   node tools/preuves/montre-bloc.js pages/js/lecon-02.html 4 16
 *   node tools/preuves/montre-bloc.js pages/js/lecon-02.html      # tous
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..', '..');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

var args = process.argv.slice(2);
var fichier = path.resolve(RACINE, args[0]);
var vises = args.slice(1).map(Number);
var src = fs.readFileSync(fichier, 'utf8');
var re = /<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">([\s\S]*?)<\/code>/g;
var m, i = 0;
while ((m = re.exec(src))) {
  i++;
  if (vises.length && vises.indexOf(i) === -1) continue;
  var df = (m[1] || '').match(/data-file="([^"]*)"/);
  console.log('===== #' + i + '  [' + (df ? df[1] : '') + ']  (offset ' + m.index + ')');
  console.log(dec(m[2]).trim());
  console.log('');
}
