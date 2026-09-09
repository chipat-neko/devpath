'use strict';
/**
 * tools/preuves/sonde-fragment-orphelin.js — LE FRAGMENT ORPHELIN, mesuré avant d'être écrit.
 *
 * Après le point B2b-9 il reste 102 blocs JS en panne, dont **60 « INTROUVABLES »**
 * (`sonde-repli-manque.js`) : le bloc échoue sur « X is not defined » et X n'est déclaré
 * NULLE PART dans la page. Aucun préambule ne les sauvera — c'est acquis, et mesuré. Reste
 * une seule issue : leur RETIRER le bouton, comme aux huit familles déjà écartées.
 *
 * Mais une règle du bouton est STATIQUE : `runner.js` la joue avant tout clic, il n'exécute
 * rien. Le critère ne peut donc pas être « ça plante », il doit être « ce bloc OUVRE une
 * ligne sur un nom que rien ne fournit ». D'où le risque, et d'où cette sonde : un nom peut
 * ouvrir une ligne sans être un identifiant du tout.
 *
 *   const message = `
 *   Bonjour
 *   `;                     <- « Bonjour » ouvre une ligne, et n'est rien.
 *
 *   \/*
 *   Explication en français.
 *   *\/                    <- « Explication » aussi.
 *
 * Trois variantes de nettoyage sont donc mesurées, de la plus naïve à la plus prudente, et
 * chaque bloc visé est EXÉCUTÉ (repli et ré-ancrage compris, exactement comme le moteur) pour
 * savoir s'il est VIVANT. Un critère qui emporte un seul bloc vivant est refusé : c'est ce
 * qui est arrivé au critère « évident » du point B2b-8, qui en emportait 31.
 *
 * Elle ne modifie rien et ne rend aucun verdict.
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
var preambuleReAncre = lireFonction('preambuleReAncre');
/* ⚠️ LA CINQUIEME VARIANTE N'EST PAS UNE MAQUETTE : elle LIT la regle reellement posee dans
   `js/runner.js` et rejoue la mesure. Sans elle, rien n'interdirait qu'une transcription
   approximative vise 35 blocs pendant que le moteur en vise d'autres — le defaut fondateur
   du chantier. Elle vaut `null` tant que la regle n'est pas ecrite. */
var estUnFragmentOrphelin = null;
try { estUnFragmentOrphelin = lireFonction('estUnFragmentOrphelin'); } catch (e) {}

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
/* Le verdict du moteur d'aujourd'hui, repli ET ré-ancrage compris : ce bloc, cliqué,
   rend-il quelque chose sans erreur ? C'est la seule définition de « vivant » qui vaille. */
function verdict(code, prefixe) {
  var r = joue(code);
  if (!r.err || /timed out/i.test(r.err) || !prefixe.length || !meriteUnRepli(r.err)) return r;
  var prf = prefixe;
  var e = joue(preambuleQuiCompile(prf, code).join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code));
  while (e.err && meriteUnRepli(e.err)) {
    var prf2 = preambuleReAncre(prf, e.err);
    if (!prf2) break;
    prf = prf2;
    var g = preambuleQuiCompile(prf, code);
    if (!g.length) break;
    e = joue(g.join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code));
  }
  return e.err ? r : e;
}

/* ------------------------------------------------- ce qui peut ouvrir une ligne --- */
var MOTS_CLES = ('const let var function class async await return if else for while do switch ' +
  'case default break continue try catch finally throw new delete typeof void instanceof in of ' +
  'this super yield import export null true false undefined debugger with static get set').split(' ');
var GLOBALES = ('console Math JSON Object Array String Number Boolean Date RegExp Error TypeError ' +
  'RangeError SyntaxError ReferenceError EvalError URIError AggregateError Promise Symbol Map Set ' +
  'WeakMap WeakSet WeakRef Proxy Reflect BigInt Function parseInt parseFloat isNaN isFinite ' +
  'encodeURI encodeURIComponent decodeURI decodeURIComponent Infinity NaN ArrayBuffer ' +
  'SharedArrayBuffer DataView Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array ' +
  'Int32Array Uint32Array Float32Array Float64Array BigInt64Array BigUint64Array Intl ' +
  'setTimeout setInterval clearTimeout clearInterval queueMicrotask structuredClone self ' +
  'globalThis eval arguments Atomics Generator AsyncGenerator').split(' ')
  .concat(GLOBALES_WORKER);
var CONNUS = {};
MOTS_CLES.concat(GLOBALES).forEach(function (m) { CONNUS[m] = true; });

/* NETTOYAGE, en trois degrés — c'est LE point que la sonde doit trancher. */
function sansCommentaires(t) {
  return t.replace(/\/\*[\s\S]*?\*\//g, function (m) { return m.replace(/[^\n]/g, ' '); })
          .replace(/(^|[^:\\])\/\/[^\n]*/g, function (m, p) { return p; });
}
function sansChaines(t) {
  /* Une passe caractère par caractère : les expressions régulières ne savent pas suivre
     l'imbrication d'un gabarit `${…}`, et une approximation ici enverrait de faux
     orphelins dans le décompte — exactement ce qu'on cherche à éviter. */
  var out = '', i = 0, n = t.length;
  while (i < n) {
    var c = t[i];
    if (c === '"' || c === "'" || c === '`') {
      var q = c, prof = 0;
      out += ' '; i++;
      while (i < n) {
        var d = t[i];
        if (d === '\\') { out += '  '; i += 2; continue; }
        if (q === '`' && d === '$' && t[i + 1] === '{') { prof++; out += '  '; i += 2; continue; }
        if (q === '`' && prof > 0 && d === '}') { prof--; out += ' '; i++; continue; }
        if (prof > 0) { out += d; i++; continue; }   /* dans ${…} : du vrai code */
        if (d === q) { out += ' '; i++; break; }
        out += (d === '\n' ? '\n' : ' '); i++;
      }
      continue;
    }
    out += c; i++;
  }
  return out;
}

/* Les identifiants qui OUVRENT une ligne — la contrainte de colonne zéro des points B2b-3
   et B2b-8 : un nom évalué au niveau racine fait échouer le bloc à coup sûr, un nom cité
   dans le corps d'une fonction jamais appelée ne fait rien. */
function ouvrentUneLigne(t, sansEtiquettes) {
  var out = [], re = /^([A-Za-z_$À-ɏ][\w$À-ɏ]*)([\s\S]?)/gm, m;
  while ((m = re.exec(t))) {
    if (CONNUS[m[1]]) continue;
    /* `nom:` en tête de ligne est une ETIQUETTE ou une CLE d'objet, jamais la lecture
       d'une variable — `pages/graphql/lecon-09` #4 est un fragment d'objet dont la
       première ligne est `context: () => ({`. Sans cette exclusion, le critère emporte un
       bloc qui n'échoue pas. */
    if (sansEtiquettes && /[\s]*:/.test(m[2] || '')) continue;
    out.push(m[1]);
  }
  return out;
}
function declareQuelquePart(nom, textes) {
  var n = nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var decl = new RegExp('(?:const|let|var|class|function)\\s+' + n + '(?![\\w$À-ɏ])');
  var affect = new RegExp('(?:^|[^\\w$.À-ɏ])' + n + '\\s*=(?!=)');
  for (var i = 0; i < textes.length; i++) {
    if (decl.test(textes[i]) || affect.test(textes[i])) return true;
  }
  return false;
}

var VARIANTES = ['BRUT', 'SANS-COMM', 'SANS-COMM-CHAINES', 'SANS-ETIQUETTES'];
if (estUnFragmentOrphelin) VARIANTES.push('MOTEUR');
var stat = {};
VARIANTES.forEach(function (v) { stat[v] = { vises: 0, vivants: [], morts: 0 }; });
var exemples = {};
VARIANTES.forEach(function (v) { exemples[v] = []; });

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
  var aBouton = [];
  blocs.forEach(function (b, i) { if (b.code && aUnBouton(b.code, navAvant[i])) aBouton.push(b.code); });
  var tousTextes = blocs.map(function (b) { return b.code; }).filter(Boolean);
  var vus = 0;

  blocs.forEach(function (b, i) {
    var code = b.code;
    if (!code || !aUnBouton(code, navAvant[i])) return;
    var prefixe = aBouton.slice(0, vus);
    vus++;
    var nettoye = {
      BRUT: code,
      'SANS-COMM': sansCommentaires(code),
      'SANS-COMM-CHAINES': sansChaines(sansCommentaires(code)),
      'SANS-ETIQUETTES': sansChaines(sansCommentaires(code))
    };
    var vise = {}, orphelinDe = {};
    if (estUnFragmentOrphelin) {
      vise.MOTEUR = estUnFragmentOrphelin(code, tousTextes);
      orphelinDe.MOTEUR = 'moteur';
    }
    VARIANTES.filter(function (v) { return v !== 'MOTEUR'; }).forEach(function (v) {
      var noms = ouvrentUneLigne(nettoye[v], v === 'SANS-ETIQUETTES').filter(function (nom) {
        return !declareQuelquePart(nom, tousTextes);
      });
      vise[v] = noms.length > 0;
      orphelinDe[v] = noms[0];
    });
    if (!VARIANTES.some(function (v) { return vise[v]; })) return;
    var r = verdict(code, prefixe);
    var vivant = !r.err;
    VARIANTES.forEach(function (v) {
      if (!vise[v]) return;
      stat[v].vises++;
      if (vivant) stat[v].vivants.push(rel + ' #' + (i + 1) + '  [' + orphelinDe[v] + ']  ' +
        (r.lignes || 0) + ' ligne(s)');
      else stat[v].morts++;
      if (exemples[v].length < 12 && !vivant) exemples[v].push(rel + ' #' + (i + 1) + '  [' + orphelinDe[v] + ']');
    });
  });
});

console.log('=== LE FRAGMENT ORPHELIN — un nom qui OUVRE une ligne et que rien ne fournit ===\n');
console.log('  variante             visés   dont MORTS   dont VIVANTS');
VARIANTES.forEach(function (v) {
  console.log('  ' + v.padEnd(20) + String(stat[v].vises).padStart(5) +
    String(stat[v].morts).padStart(13) + String(stat[v].vivants.length).padStart(15));
});
VARIANTES.forEach(function (v) {
  if (stat[v].vivants.length) {
    console.log('\n--- ' + v + ' : les VIVANTS qu\'il emporterait (' + stat[v].vivants.length + ') ---');
    stat[v].vivants.slice(0, 40).forEach(function (l) { console.log('   ' + l); });
  }
});
console.log('\n--- exemples de blocs MORTS visés (variante la plus prudente) ---');
exemples['SANS-ETIQUETTES'].forEach(function (l) { console.log('   ' + l); });
