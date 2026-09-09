'use strict';
/**
 * tools/preuves/sonde-eval-contre-function.js — MESURER l'écart entre les DEUX juges de
 * compilation : `new Function(texte)`, qu'emploie la règle `neCompilePas` de `runner.js`,
 * et `(0, eval)(texte)`, que le Worker emploie POUR DE VRAI.
 *
 * POURQUOI CETTE QUESTION. Le commentaire de `neCompilePas` (point B2b-5) dit l'écart en
 * toutes lettres : « Trois blocs vont dans l'autre sens (`eval` refuse un `return` racine
 * que `new Function` autorise) : gain non pris, jamais un risque. » Le gain non pris est
 * un bloc qui GARDE son bouton et qui ne peut rendre qu'une `SyntaxError` au clic —
 * exactement ce que le chantier cherche à faire disparaître. `nodejs/lecon-22` #6 en est
 * un : cliqué dans Chrome, il affiche `SyntaxError: Illegal return statement`.
 *
 * CE QU'ELLE MESURE, pour chaque bloc qui a un bouton aujourd'hui :
 *   — `new Function` l'accepte-t-il ? (le juge actuel)
 *   — `(0, eval)("throw 0;\n" + texte)` l'accepte-t-il ? (le juge FIDÈLE : le `throw` en
 *     tête garantit que la compilation a lieu et que rien ne s'exécute)
 *   — et, quand les deux divergent, le bloc est-il VIVANT ? Le statut est DEMANDÉ à
 *     `verif-js.js`, jamais recalculé (la leçon du point B2b-15).
 *
 *   node tools/verif-js.js > statuts.txt
 *   node tools/preuves/sonde-eval-contre-function.js statuts.txt
 *
 * Sonde de MESURE : elle ne rend aucun verdict et ne corrige rien.
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..', '..');
var REG = require(path.join(RACINE, 'tools', 'lib', 'regles-bouton.js'));

var fStatuts = process.argv[2];
var statut = {};
if (fStatuts) {
  fs.readFileSync(fStatuts, 'utf8').split(/\r?\n/).forEach(function (l) {
    var m = /^  (OK |REP|ANN|KO |HP |RHL|\?\?\?) (\S+) #(\d+)/.exec(l);
    if (m) statut[m[2] + ' #' + m[3]] = m[1].trim();
  });
}

/* Les deux juges. Aucun n'exécute quoi que ce soit : `new Function` construit un corps de
   fonction sans l'appeler, et le `throw 0` placé en tête de l'`eval` part avant la
   première ligne du bloc. Un `catch` qui ne filtre pas `SyntaxError` compterait une erreur
   d'exécution comme une faute de compilation — c'est le défaut que `neCompilePas` évite. */
function accepteFunction(code) {
  try { new Function(String(code)); } catch (e) { return !(e instanceof SyntaxError); }
  return true;
}
function accepteEval(code) {
  try { (0, eval)('throw 0;\n' + String(code)); }
  catch (e) { if (e instanceof SyntaxError) return false; return true; }
  return true;
}

var aFunctionPasEval = [], aEvalPasFunction = [], boutons = 0;
REG.lecons(null).forEach(function (f) {
  var rel = path.relative(RACINE, f).split(path.sep).join('/');
  var blocs = REG.blocsJs(f);
  var ctx = REG.contexteLecon(blocs);
  blocs.forEach(function (b, i) {
    if (!b.code || !ctx.aUnBouton(b.code, i)) return;
    boutons++;
    var okF = accepteFunction(b.code), okE = accepteEval(b.code);
    if (okF === okE) return;
    var cle = rel + ' #' + (i + 1);
    var ligne = cle + '  [' + (b.fichier || '') + ']  ' + (statut[cle] || 'statut inconnu');
    (okF ? aFunctionPasEval : aEvalPasFunction).push(ligne);
  });
});

console.log('=== LES DEUX JUGES DE COMPILATION, SUR LES BLOCS QUI ONT UN BOUTON ===\n');
console.log('  blocs à bouton examinés ............................. ' + boutons);
console.log('  acceptés par `new Function`, REFUSÉS par `eval` ..... ' + aFunctionPasEval.length +
  '   (le bouton promet, le clic rend une SyntaxError)');
console.log('  acceptés par `eval`, refusés par `new Function` ..... ' + aEvalPasFunction.length +
  '   (un bouton retiré à tort : rédhibitoire)');
if (aFunctionPasEval.length) {
  console.log('\n--- `new Function` dit oui, le Worker dira non ---');
  aFunctionPasEval.forEach(function (l) { console.log('   ' + l); });
}
if (aEvalPasFunction.length) {
  console.log('\n--- `eval` dit oui, `new Function` dit non ---');
  aEvalPasFunction.forEach(function (l) { console.log('   ' + l); });
}
console.log('\n(statut demandé à verif-js.js : OK/REP = vivant, KO = en panne, ANN = erreur annoncée)');
