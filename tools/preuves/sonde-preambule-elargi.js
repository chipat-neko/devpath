'use strict';
/**
 * tools/preuves/sonde-preambule-elargi.js — ÉLARGIR le préambule du repli, mesuré avant d'être écrit.
 *
 * Le point B2b-8 laisse 107 blocs JS en panne. `sonde-repli-manque.js` les a triés : 60
 * INTROUVABLES, 16 AUTRE-ERR, 16 TRI, 0 APRÈS. Le lot TRI est le seul où le bloc source
 * EXISTE dans la page : le repli du point B2b-7 ne le lui donne pas, pour deux raisons
 * distinctes qu'il faut mesurer séparément.
 *
 *   (a) le bloc source est écarté par `preambuleQuiCompile` — il ne compile pas avec un bloc
 *       PLUS PROCHE, et le tri part du plus proche : c'est l'ancien qui saute, pas le récent ;
 *   (b) le bloc source n'a pas de bouton, il n'entre donc jamais dans le préfixe.
 *
 * Les variantes sont exécutées sur TOUT le site, et comparées à la référence :
 *   V1..V3  RÉ-ANCRAGE : si le repli échoue encore sur « Y is not defined », le préambule
 *           est reconstruit en TRONQUANT le préfixe juste après le bloc le plus proche qui
 *           déclare Y en colonne zéro — ce bloc devient alors le plus proche, donc le
 *           premier gardé. Le chiffre est le nombre de tours autorisés.
 *   VINF    LE MÊME, SANS PLAFOND : la terminaison vient de la décroissance STRICTE du
 *           préfixe, pas d'un compteur.
 *   ETENDU  PRÉFIXE ÉTENDU : le préambule prend TOUS les blocs précédents, y compris ceux
 *           sans bouton.
 *
 * RELEVÉ DU 2026-09-09. La référence de la sonde est le repli SEUL, ré-ancrage exclu : elle
 * comptait 1 522 blocs qui aboutissent et 124 en panne le jour du point B2b-9, puis 89 après
 * que le point B2b-10 eut privé 35 fragments orphelins de leur bouton. Les verdicts, eux,
 * n'ont pas bougé d'une unité :
 *
 *   | variante | gains | pertes |
 *   |---|---|---|
 *   | V1       |   4   |   0    |
 *   | V2       |   5   |   0    |
 *   | V3, VINF |   5   |   0    |
 *   | ETENDU   |   0   | **2**  |
 *
 * Deux verdicts, tous deux MESURÉS et non devinés : le ré-ancrage sature à DEUX tours (un
 * plafond plus haut ne rend pas un bloc de plus), et le préfixe étendu est REFUSÉ — il ne
 * gagne rien et casse deux blocs vivants, les blocs sans bouton touchant `document` ou
 * `localStorage`, qui n'existent pas dans le Worker.
 *
 * Elle ne modifie rien. Elle compte les GAINS (une panne qui aboutit) et surtout les PERTES
 * (un bloc vivant qui cesserait d'aboutir), parce qu'un élargissement qui casse ce qui marche
 * doit être refusé — c'est ce qui est arrivé au critère « évident » du point B2b-8.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');
/* Les règles du bouton et LE CONTEXTE DE LA LEÇON, écrits une seule fois (B2b-15, B2b-23). */
var REG = require('../lib/regles-bouton.js');

var RACINE = path.resolve(__dirname, '..', '..');

function srcRunner() { return fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8'); }
function lireMotif(nom) {
  var m = srcRunner().match(new RegExp('var ' + nom + ' = (/[\\s\\S]*?/);'));
  if (!m) throw new Error(nom + ' introuvable');
  return eval(m[1]);
}
function lireFonction(nom) {
  var src = srcRunner();
  var i = src.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable');
  var j = src.indexOf('\n  }', i);
  return eval('(' + src.slice(i, j + 4) + ')');
}
var BROWSER_ONLY = lireMotif('BROWSER_ONLY');
var estUnFichierJson = lireFonction('estUnFichierJson');
var estUneSuiteDeTests = lireFonction('estUneSuiteDeTests');
var estUnFragmentServeur = lireFonction('estUnFragmentServeur');
var estDuDomDePage = lireFonction('estDuDomDePage');
var estUnServiceWorker = lireFonction('estUnServiceWorker');
var neCompilePas = lireFonction('neCompilePas');
var heriteDuNavigateur = lireFonction('heriteDuNavigateur');
var estUnFragmentOrphelin = lireFonction('estUnFragmentOrphelin');
var meriteUnRepli = lireFonction('meriteUnRepli');
var envelopperPourRepli = lireFonction('envelopperPourRepli');
var preambuleQuiCompile = lireFonction('preambuleQuiCompile');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
/* ⚠️ LE DÉCOUPAGE DES BLOCS EST CELUI DE `regles-bouton.js`, PAS UNE COPIE (B2b-23).
   La copie locale ne relevait pas le `data-file` : la règle `estLaSuiteDunFichierDeNavigateur`
   recevait alors un contexte VIDE et ne s'appliquait jamais, si bien que cette sonde
   décrivait des blocs à bouton que le navigateur n'affiche plus. */
var blocsJs = REG.blocsJs;
var lecons = REG.lecons;
var GLOBALES_WORKER = ['TextEncoder', 'TextDecoder', 'performance', 'EventTarget', 'Event',
  'CustomEvent', 'URL', 'URLSearchParams', 'Blob', 'AbortController', 'AbortSignal',
  'ReadableStream', 'WritableStream', 'TransformStream', 'FormData', 'Headers', 'Request',
  'Response', 'atob', 'btoa', 'PerformanceObserver', 'crypto', 'DOMException',
  'MessageChannel', 'BroadcastChannel', 'CompressionStream', 'DecompressionStream'];
function fmtArgs(a) {
  return Array.prototype.slice.call(a).map(function (v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'function') return String(v);
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }).join(' ');
}
function contexteWorker(sorties) {
  var faux = function () {};
  var ctx = {
    console: {
      log: function () { sorties.push(fmtArgs(arguments)); },
      info: function () { sorties.push(fmtArgs(arguments)); },
      debug: function () { sorties.push(fmtArgs(arguments)); },
      warn: function () { sorties.push(fmtArgs(arguments)); },
      error: function () { sorties.push(fmtArgs(arguments)); },
      table: faux, group: faux, groupEnd: faux, time: faux, timeEnd: faux, dir: faux
    },
    setTimeout: function (f) { try { if (typeof f === 'function') f(); } catch (e) {} return 0; },
    setInterval: function () { return 0; },
    clearTimeout: faux, clearInterval: faux,
    queueMicrotask: function (f) { try { f(); } catch (e) {} },
    /* Le VRAI clonage structure, pas un JSON.parse(JSON.stringify) : la contrefacon
       jette sur un cycle et perd Date/Set/Map, ce qui faisait declarer en panne un bloc
       que l apprenant voit marcher (point B2b-13). Node le fournit depuis la v17. */
    structuredClone: globalThis.structuredClone,
    self: null, globalThis: null
  };
  GLOBALES_WORKER.forEach(function (n) {
    if (typeof globalThis[n] !== 'undefined') ctx[n] = globalThis[n];
  });
  ctx.self = ctx; ctx.globalThis = ctx;
  return ctx;
}
var DELAI = 5000;

/* ⚠️ UNE ERREUR ASYNCHRONE TUE LE PROCESSUS ENTIER, ET LA SONDE EST MORTE DESSUS.
   `pages/js/lecon-19` rejoue un `EventTarget` dont l'écouteur lève dans un microtask :
   `vm.runInContext` a déjà rendu la main, le `try/catch` ne voit rien, et Node relance
   l'erreur par `process.nextTick`. Le premier jet a donc affiché ses chiffres PUIS s'est
   arrêté en défaut — une sonde qui meurt après avoir parlé est exactement le genre d'outil
   dont on ne sait plus s'il a tout mesuré. Le navigateur, lui, ne fait qu'écrire la ligne
   dans la console du Worker. On l'ignore ici comme lui : ce n'est pas le verdict du bloc. */
process.on('uncaughtException', function () {});

function joue(codeComplet) {
  var sorties = [], brut = contexteWorker(sorties), avant = 0;
  brut.__finDuPrelude = function () { avant = sorties.length; };
  try {
    vm.runInContext(codeComplet, vm.createContext(brut), { timeout: DELAI, displayErrors: false });
  } catch (e) {
    return { err: (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)) };
  }
  return { err: null, lignes: sorties.length - avant, sortie: sorties.slice(avant) };
}
function avecPreambule(gardes, code) {
  return gardes.join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code);
}
function declareEnColonneZero(texte, nom) {
  var n = nom.replace(/[$]/g, '\\$&');
  return new RegExp('^(?:const|let|var|class|async\\s+function|function)\\s+' + n + '(?![\\w$À-ɏ])', 'm').test(texte);
}
function nomManquant(msg) {
  var m = /^ReferenceError: (.+?) is not defined/.exec(String(msg));
  return m ? m[1] : null;
}

function replRef(prefixe, code) {                     /* V0 : le repli d'aujourd'hui */
  var g = preambuleQuiCompile(prefixe, code);
  if (!g.length) return { err: 'préambule vide' };
  return joue(avecPreambule(g, code));
}
/* Le RÉ-ANCRAGE. `tours` = 0 signifie « sans plafond » : la terminaison ne vient pas d'un
   compteur mais de la DÉCROISSANCE STRICTE du préfixe — on n'ancre que sur un bloc
   STRICTEMENT plus ancien que le dernier, sans quoi le préambule serait identique et le
   tour suivant rendrait mot pour mot la même erreur. */
var toursFaits = 0;
function reAncre(prefixe, code, r0, tours) {
  var r = r0, prf = prefixe, t = 0;
  while (!tours || t < tours) {
    if (!r || !r.err) break;
    var nom = nomManquant(r.err);
    if (!nom) break;
    var k = -1;
    for (var i = prf.length - 1; i >= 0; i--) { if (declareEnColonneZero(prf[i], nom)) { k = i; break; } }
    if (k < 0 || k + 1 >= prf.length) break;
    prf = prf.slice(0, k + 1);
    var g = preambuleQuiCompile(prf, code);
    if (!g.length) break;
    r = joue(avecPreambule(g, code));
    t++; toursFaits++;
  }
  return r;
}

var VARIANTES = ['V1', 'V2', 'V3', 'VINF', 'ETENDU'];
var stat = {};
VARIANTES.forEach(function (v) { stat[v] = { gains: [], pertes: [] }; });
var panneRef = 0, okRef = 0;

lecons().forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var blocs = blocsJs(f);
  /* LE CONTEXTE DE LA LEÇON EST LU, PLUS RECOPIÉ (2026-09-09, point B2b-23) : la règle
     `estLaSuiteDunFichierDeNavigateur` demande un contexte de plus (le `data-file` des
     blocs de navigateur précédents), et une copie locale l'aurait ignoré en silence. */
  var ctxL = REG.contexteLecon(blocs);
  var navAvant = ctxL.navAvant, tousTextesJs = ctxL.tousJs;
  var aUnBouton = ctxL.aUnBouton;
  var aBouton = [];
  blocs.forEach(function (b, i) { if (b.code && aUnBouton(b.code, i)) aBouton.push(b.code); });
  var vus = 0;
  blocs.forEach(function (b, i) {
    var code = b.code;
    if (!code) return;
    if (!aUnBouton(code, i)) return;
    var prefixe = aBouton.slice(0, vus);
    var tousPrec = blocs.slice(0, i).map(function (x) { return x.code; }).filter(Boolean);
    vus++;
    var ligne = rel + ' #' + (i + 1);

    var seul = joue(code);
    if (seul.err && /timed out/i.test(seul.err)) return;

    var ref = seul;
    if (seul.err && prefixe.length && meriteUnRepli(seul.err)) {
      var r = replRef(prefixe, code);
      if (!r.err) ref = r;
    }
    if (ref.err) panneRef++; else okRef++;

    if (!seul.err || !meriteUnRepli(seul.err)) return;   /* les variantes ne changent rien */

    var base = prefixe.length ? replRef(prefixe, code) : { err: 'préambule vide' };
    var essais = {
      V1: prefixe.length ? reAncre(prefixe, code, base, 1) : null,
      V2: prefixe.length ? reAncre(prefixe, code, base, 2) : null,
      V3: prefixe.length ? reAncre(prefixe, code, base, 3) : null,
      VINF: prefixe.length ? reAncre(prefixe, code, base, 0) : null,
      ETENDU: tousPrec.length ? replRef(tousPrec, code) : null
    };
    Object.keys(essais).forEach(function (v) {
      var e = essais[v];
      if (!e) return;
      if (ref.err && !e.err) stat[v].gains.push(ligne + '  (' + e.lignes + ' ligne(s))' +
        (e.sortie && e.sortie.length ? '\n        > ' + e.sortie.join('\n        > ') : ''));
      if (!ref.err && e.err) stat[v].pertes.push(ligne + '  → ' + String(e.err).slice(0, 60));
    });
  });
});

console.log('=== ÉLARGIR LE PRÉAMBULE DU REPLI — mesuré sur tout le site ===\n');
console.log('  référence : ' + okRef + ' aboutissent, ' + panneRef + ' en panne\n');
console.log('  variante  gains  pertes   (V1..V3 = ré-ancrage a 1..5 tours ; ETENDU = préfixe elargi)');
VARIANTES.forEach(function (v) {
  console.log('  ' + v.padEnd(9) + String(stat[v].gains.length).padStart(5) + String(stat[v].pertes.length).padStart(7));
});
console.log('\n  tours de ré-ancrage effectués, toutes variantes confondues : ' + toursFaits);
VARIANTES.forEach(function (v) {
  if (stat[v].gains.length) { console.log('\n--- ' + v + ' GAINS (' + stat[v].gains.length + ') ---'); stat[v].gains.forEach(function (l) { console.log('   ' + l); }); }
  if (stat[v].pertes.length) { console.log('\n--- ' + v + ' PERTES (' + stat[v].pertes.length + ') ---'); stat[v].pertes.forEach(function (l) { console.log('   ' + l); }); }
});
