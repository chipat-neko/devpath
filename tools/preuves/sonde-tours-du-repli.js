'use strict';
/**
 * tools/preuves/sonde-tours-du-repli.js — DÉROULER, tour par tour, la chaîne des replis
 * d'UN bloc, pour voir où elle s'arrête.
 *
 * `sonde-repli-manque.js` dit dans quelle CATÉGORIE un bloc en panne tombe ; elle ne dit
 * pas POURQUOI la boucle s'est arrêtée là. Cette sonde rejoue la boucle de `lancerJs`
 * — les règles étant LUES dans `tools/lib/regles-bouton.js`, jamais recopiées — et
 * imprime à chaque tour : le préfixe courant (rangs des blocs retenus), le préambule que
 * le tri garde, l'erreur obtenue, et la réécriture choisie.
 *
 *   node tools/preuves/sonde-tours-du-repli.js pages/projets-js/lecon-15.html 5
 *
 * Sonde de DIAGNOSTIC : elle ne rend aucun verdict et ne corrige rien.
 */
var path = require('path');
var vm = require('vm');
var RACINE = path.resolve(__dirname, '..', '..');
var REG = require(path.join(RACINE, 'tools', 'lib', 'regles-bouton.js'));
var CTX = require(path.join(RACINE, 'tools', 'lib', 'contexte-worker.js'));

var cible = process.argv[2];
var rang = parseInt(process.argv[3], 10);
if (!cible || !rang) {
  console.log('usage : node tools/preuves/sonde-tours-du-repli.js <page.html> <rang du bloc>');
  process.exit(2);
}
var f = path.resolve(RACINE, cible);
var blocs = REG.blocsJs(f);

/* Le contexte de la leçon est LU (`contexteLecon`), jamais recopié : les trois règles à
   contexte du moteur y sont déjà, celle du `data-file` comprise (point B2b-23). */
var ctxL = REG.contexteLecon(blocs);
var aUnBouton = ctxL.aUnBouton;
var aBouton = [], rangDe = [];
blocs.forEach(function (b, i) {
  if (b.code && aUnBouton(b.code, i)) { aBouton.push(b.code); rangDe.push(i + 1); }
});

var vus = 0, code = null, prefixe = null;
blocs.forEach(function (b, i) {
  if (!b.code) return;
  var bouton = aUnBouton(b.code, i);
  if (i + 1 === rang) { code = b.code; prefixe = bouton ? aBouton.slice(0, vus) : null; }
  if (bouton) vus++;
});
if (code === null) { console.log('bloc #' + rang + ' introuvable'); process.exit(2); }
if (prefixe === null) { console.log('le bloc #' + rang + " n'a pas de bouton"); process.exit(2); }

console.log('=== ' + cible + ' #' + rang + ' ===');
console.log('blocs à bouton de la leçon (rangs) : ' + rangDe.join(', '));
console.log('préfixe disponible : ' + rangDe.slice(0, prefixe.length).join(', ') + '\n');

function jouer(src) {
  var s = [], brut = CTX.contexteWorker(s), avant = 0;
  brut.__finDuPrelude = function () { avant = s.length; };
  try {
    vm.runInContext(src, vm.createContext(brut), { timeout: 5000, displayErrors: false });
  } catch (e) {
    return { err: (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)) };
  }
  return { err: null, lignes: s.length - avant };
}

/* Tour 0 : le bloc SEUL. */
var s0 = [], c0 = vm.createContext(CTX.contexteWorker(s0)), msg = null;
try { vm.runInContext(code, c0, { timeout: 5000, displayErrors: false }); }
catch (e) { msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)); }
console.log('tour 0 (bloc seul) : ' + (msg || 'ABOUTIT (' + s0.length + ' ligne(s))'));
if (!msg) process.exit(0);
if (!REG.meriteUnRepli(msg)) { console.log('  → pas un « X is not defined » : aucun repli'); process.exit(0); }

function rangsDe(liste) {
  return liste.map(function (t) {
    var k = aBouton.indexOf(t);
    return k < 0 ? '?' : rangDe[k];
  }).join(', ');
}

var prf = prefixe, ancres = [], tour = 1;
var gardes = REG.preambuleQuiCompile(prf, code, ancres);
console.log('tour ' + tour + ' : préfixe [' + rangsDe(prf) + '] → préambule retenu [' + rangsDe(gardes) + ']');
var essai = gardes.length ? jouer(gardes.join('\n') + '\n;__finDuPrelude();\n' + REG.envelopperPourRepli(code))
                          : { err: 'préambule vide' };
console.log('         ' + (essai.err || 'ABOUTIT (' + essai.lignes + ' ligne(s))'));
while (essai.err && gardes.length) {
  var suite = REG.prochainPrefixe(prf, essai.err, ancres);
  if (!suite) { console.log('  → ARRÊT : aucune réécriture du préfixe (ancres = [' + ancres.join(', ') + '])'); break; }
  gardes = REG.preambuleQuiCompile(suite.prefixe, code, ancres);
  if (!gardes.length) { console.log('  → ARRÊT : préambule vide après « ' + suite.facon + ' »'); break; }
  prf = suite.prefixe;
  tour++;
  console.log('tour ' + tour + ' (' + suite.facon + ', ancres = [' + ancres.join(', ') + ']) : préfixe [' +
    rangsDe(prf) + '] → préambule retenu [' + rangsDe(gardes) + ']');
  essai = jouer(gardes.join('\n') + '\n;__finDuPrelude();\n' + REG.envelopperPourRepli(code));
  console.log('         ' + (essai.err || 'ABOUTIT (' + essai.lignes + ' ligne(s))'));
}
