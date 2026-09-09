'use strict';
/* Le CODE DU WORKER est une chaîne assemblée dans js/runner.js : `node --check runner.js` ne
   dit donc RIEN de sa validité, et une faute y serait invisible jusqu'au clic de l'apprenant.
   Ce contrôle extrait la chaîne et la compile. */
var fs = require('fs');
var path = require('path');
var src = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'runner.js'), 'utf8');

function fonction(nom) {
  var i = src.indexOf('function ' + nom + '(');
  var j = src.indexOf('\n  }', i);
  return src.slice(i, j + 4);
}
var i = src.indexOf('var WORKER_SRC = [');
var j = src.indexOf('].join("\\n");', i);
if (i < 0 || j < 0) { console.log('WORKER_SRC introuvable'); process.exit(1); }
var tableau = src.slice(i + 'var WORKER_SRC = '.length, j + 1);
var monter = new Function(fonction('envelopperPourRepli') + '\nreturn (' + tableau + ').join("\\n");');
var code = monter();
try {
  new Function(code);
  console.log('WORKER_SRC compile — ' + code.split('\n').length + ' lignes.');
  var attendus = ['envelopperPourRepli', '__finDuPrelude', 'prelude.join', 'muet'];
  attendus.forEach(function (a) {
    if (code.indexOf(a) < 0) { console.log('MANQUE dans le worker : ' + a); process.exit(1); }
  });
  console.log('les ' + attendus.length + ' morceaux du repli sont bien dans la source du Worker.');
  process.exit(0);
} catch (e) {
  console.log('LE CODE DU WORKER NE COMPILE PAS : ' + e.message);
  process.exit(1);
}
