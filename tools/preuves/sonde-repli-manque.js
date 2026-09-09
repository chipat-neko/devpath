'use strict';
/**
 * tools/preuves/sonde-repli-manque.js — POURQUOI le repli ne sauve pas ces blocs-là.
 *
 * Après le point B2b-8 il reste 107 blocs JS en panne. Une partie échoue encore sur
 * « X is not defined » alors que X EST déclaré, en colonne zéro, par un bloc de la même
 * leçon qui A un bouton — donc un bloc que le préambule du repli (point B2b-7) aurait dû
 * fournir. Cette sonde répond à une seule question, et par la mesure : dans ces cas-là,
 * qu'est-ce qui a empêché le repli d'aboutir ?
 *
 * Quatre réponses possibles, comptées séparément :
 *   - APRES     : le bloc source est plus BAS dans la leçon (la solution avant l'énoncé) ;
 *   - TRI       : `preambuleQuiCompile` a écarté le bloc source, car il ne compile pas
 *                 avec le bloc examiné (collision de déclarations) ;
 *   - AUTRE-ERR : le préambule passe, mais le repli échoue sur une AUTRE erreur ;
 *   - INTROUVABLE : X n'est déclaré en colonne zéro par aucun bloc de la page.
 *
 * Elle ne modifie rien et ne rend aucun verdict : elle prépare la case suivante.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

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
var meriteUnRepli = lireFonction('meriteUnRepli');
var envelopperPourRepli = lireFonction('envelopperPourRepli');
var preambuleQuiCompile = lireFonction('preambuleQuiCompile');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">([\s\S]*?)<\/code>/g, m;
  while ((m = re.exec(src))) out.push({ code: dec(m[2]).trim() });
  return out;
}
function lecons() {
  var out = [];
  (function marche(d) {
    var st; try { st = fs.statSync(d); } catch (e) { return; }
    if (st.isFile()) { if (/lecon-\d+\.html$/.test(d)) out.push(d); return; }
    for (var f of fs.readdirSync(d)) marche(path.join(d, f));
  })(path.join(RACINE, 'pages'));
  return out;
}
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
    structuredClone: function (v) { return JSON.parse(JSON.stringify(v)); },
    self: null, globalThis: null
  };
  GLOBALES_WORKER.forEach(function (n) {
    if (typeof globalThis[n] !== 'undefined') ctx[n] = globalThis[n];
  });
  ctx.self = ctx; ctx.globalThis = ctx;
  return ctx;
}
var DELAI = 5000;
var ERREUR_ANNONCEE = /\/\/[^\n]*\b(erreur|Erreur|ERREUR|throw|lève|leve|refuse|rejett?e|échoue|echoue|plante|invalide)\b/;

function declareEnColonneZero(texte, nom) {
  var n = nom.replace(/[$]/g, '\\$&');
  return new RegExp('^(?:const|let|var|class|async\\s+function|function)\\s+' + n + '(?![\\w$À-ɏ])', 'm').test(texte);
}

var compte = { APRES: 0, TRI: 0, 'AUTRE-ERR': 0, INTROUVABLE: 0 };
var detail = { APRES: [], TRI: [], 'AUTRE-ERR': [], INTROUVABLE: [] };

lecons().forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var blocs = blocsJs(f);
  var navAvant = [], vusNav = [];
  blocs.forEach(function (b) {
    navAvant.push(vusNav.slice());
    if (b.code && (BROWSER_ONLY.test(b.code) || estDuDomDePage(b.code))) vusNav.push(b.code);
  });
  function aUnBouton(code, ctxNav) {
    return !(BROWSER_ONLY.test(code) || estUnFichierJson(code) || estUneSuiteDeTests(code) ||
      estUnFragmentServeur(code) || estDuDomDePage(code) || estUnServiceWorker(code) ||
      neCompilePas(code) || heriteDuNavigateur(code, ctxNav));
  }
  var indexBouton = [];
  blocs.forEach(function (b, i) { if (b.code && aUnBouton(b.code, navAvant[i])) indexBouton.push(i); });
  var aBouton = indexBouton.map(function (i) { return blocs[i].code; });

  indexBouton.forEach(function (idx, rang) {
    var code = blocs[idx].code;
    var prefixe = aBouton.slice(0, rang);
    var sorties = [];
    var msg = null;
    try { vm.runInContext(code, vm.createContext(contexteWorker(sorties)), { timeout: DELAI, displayErrors: false }); }
    catch (e) { msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)); }
    if (!msg || /timed out/i.test(msg) || ERREUR_ANNONCEE.test(code)) return;
    if (!meriteUnRepli(msg)) return;
    var nom = /^ReferenceError: (.+?) is not defined/.exec(msg);
    if (!nom) return;
    nom = nom[1];
    /* Le repli a-t-il été tenté, et qu'a-t-il donné ? */
    var gardes = preambuleQuiCompile(prefixe, code);
    var s2 = [], brut = contexteWorker(s2);
    brut.__finDuPrelude = function () {};
    var msg2 = gardes.length ? null : 'préambule vide';
    if (gardes.length) {
      try {
        vm.runInContext(gardes.join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code),
          vm.createContext(brut), { timeout: DELAI, displayErrors: false });
      } catch (e2) { msg2 = (e2 && e2.name ? e2.name + ': ' : '') + (e2 && e2.message ? e2.message : String(e2)); }
    }
    if (!msg2) return;   // le repli l'a sauvé : rien à expliquer
    var ligne = rel + ' #' + (idx + 1) + '  [' + nom + ']';
    var sourceAvant = prefixe.some(function (c) { return declareEnColonneZero(c, nom); });
    var sourceApres = aBouton.slice(rang + 1).some(function (c) { return declareEnColonneZero(c, nom); });
    var sourceAilleurs = blocs.some(function (b) { return b.code && declareEnColonneZero(b.code, nom); });
    if (sourceAvant) {
      var garde = gardes.some(function (c) { return declareEnColonneZero(c, nom); });
      if (!garde) { compte.TRI++; detail.TRI.push(ligne + '  (le tri du préambule a écarté le bloc source)'); }
      else { compte['AUTRE-ERR']++; detail['AUTRE-ERR'].push(ligne + '  → ' + String(msg2).slice(0, 70)); }
    } else if (sourceApres) {
      compte.APRES++; detail.APRES.push(ligne + '  (le bloc source est PLUS BAS dans la leçon)');
    } else if (sourceAilleurs) {
      compte.TRI++; detail.TRI.push(ligne + '  (source dans un bloc SANS bouton)');
    } else {
      compte.INTROUVABLE++; detail.INTROUVABLE.push(ligne + '  (déclaré nulle part dans la page)');
    }
  });
});

console.log('=== POURQUOI LE REPLI NE SAUVE PAS CES BLOCS ===\n');
Object.keys(compte).forEach(function (k) {
  console.log('  ' + k.padEnd(14) + String(compte[k]).padStart(4));
});
Object.keys(detail).forEach(function (k) {
  if (!detail[k].length) return;
  console.log('\n--- ' + k + ' (' + detail[k].length + ') ---');
  detail[k].forEach(function (l) { console.log('   ' + l); });
});
