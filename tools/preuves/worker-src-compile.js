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
/* ⚠️ LES FONCTIONS INJECTÉES SONT TROUVÉES, PAS ÉNUMÉRÉES (2026-09-09, point B2b-16). Ce
   montage ne fournissait que `envelopperPourRepli`, la seule que le tableau appelait le jour
   où il a été écrit. Le point B2b-16 en a injecté deux autres (`apisHorsLigne`,
   `formaterPourLaSortie`) et ce contrôle est mort sur un `ReferenceError` — signalant, il est
   vrai, mais pour la mauvaise raison : il ne mesurait plus rien. Toute liste écrite à la main
   d'un contenu qui bouge finit ainsi. On lit donc dans le tableau LUI-MÊME les noms dont il
   demande le `toString()`, et on les fournit tous. */
var injectees = [];
tableau.replace(/(\w+)\.toString\(\)/g, function (_, n) { if (injectees.indexOf(n) < 0) injectees.push(n); return _; });
if (!injectees.length) { console.log('aucune fonction injectee trouvee dans WORKER_SRC : montage impossible'); process.exit(1); }
injectees.forEach(function (n) {
  if (src.indexOf('function ' + n + '(') < 0) { console.log('injectee introuvable dans runner.js : ' + n); process.exit(1); }
});
var monter = new Function(injectees.map(fonction).join('\n') + '\nreturn (' + tableau + ').join("\\n");');
var code = monter();
try {
  new Function(code);
  console.log('WORKER_SRC compile — ' + code.split('\n').length + ' lignes.');
  /* Les quatre premiers sont le REPLI (B2b-7) ; les deux derniers, la COUPURE DU RÉSEAU et le
     formatage des erreurs (B2b-16). Ce contrôle est le seul endroit qui puisse dire qu'ils
     sont bien PARTIS dans le Worker : `node --check` ne lit qu'une chaîne. */
  var attendus = ['envelopperPourRepli', '__finDuPrelude', 'prelude.join', 'muet',
                  'apisHorsLigne', 'formaterPourLaSortie'];
  attendus.forEach(function (a) {
    if (code.indexOf(a) < 0) { console.log('MANQUE dans le worker : ' + a); process.exit(1); }
  });
  /* ⚠️ CHERCHER UN NOM NE PROUVE RIEN, ET L'ÉPREUVE PAR INJECTION L'A MONTRÉ (2026-09-09,
     B2b-16). En retirant `apisHorsLigne.toString()` du tableau — donc en privant le Worker de
     la coupure du réseau — le contrôle ci-dessus restait VERT : le nom figure toujours dans le
     code, à la ligne qui l'APPELLE. Un contrôle qui ne peut pas rougir est pire qu'aucun.
     La règle est donc DÉRIVÉE, jamais listée : toute fonction de `runner.js` que le Worker
     APPELLE doit y être DÉFINIE, sinon il jettera un ReferenceError au premier clic. */
  var manquantes = [];
  src.replace(/\n  function (\w+)\(/g, function (_, n) {
    /* ⚠️ UN APPEL N'EST PAS LA SEULE FAÇON D'AVOIR BESOIN D'UNE FONCTION, et la deuxième
       injection l'a montré : `formaterPourLaSortie` est prise comme VALEUR (`var fmt = …`),
       sans parenthèses. Un premier jet n'exigeait que `nom(` et restait vert en la retirant.
       On cherche donc toute RÉFÉRENCE au nom, appel ou non. */
    var citee = new RegExp('(?:^|[^\\w$.])' + n + '(?![\\w$])').test(code);
    if (citee && code.indexOf('function ' + n + '(') < 0) manquantes.push(n);
    return _;
  });
  if (manquantes.length) {
    console.log('LE WORKER APPELLE SANS EMBARQUER : ' + manquantes.join(', '));
    console.log('  Chacune jettera un ReferenceError au premier clic. Ajouter `<nom>.toString()`' +
                ' au tableau WORKER_SRC de js/runner.js.');
    process.exit(1);
  }
  console.log('les ' + attendus.length + ' morceaux attendus (repli, coupure reseau, formatage) sont bien dans la source du Worker.');
  process.exit(0);
} catch (e) {
  console.log('LE CODE DU WORKER NE COMPILE PAS : ' + e.message);
  process.exit(1);
}
