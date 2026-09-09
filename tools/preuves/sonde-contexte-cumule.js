'use strict';
/**
 * tools/preuves/sonde-contexte-cumule.js — MESURER, avant d'écrire quoi que ce soit, ce que
 * rapporterait (et ce que coûterait) la seule voie restante du point B2b.
 *
 * B2b-6 a laissé le gisement à 159 blocs en panne, sans plus aucun lot homogène : ce qui
 * reste est du FRAGMENT INTERNE — un bloc qui poursuit le précédent de sa leçon (`Tache`,
 * `etatInitial`, `bouton`, `UnionFind`). Deux voies étaient écrites dans le plan : réparer
 * leçon par leçon, ou décider que le moteur exécute un bloc dans le CONTEXTE CUMULÉ de sa
 * leçon. Cette sonde chiffre la seconde AVANT de la prendre, comme B2b-2 avait chiffré la
 * piste `await` (33 blocs touchés, 3 gains : piste notée, pas prise). Elle ne modifie rien.
 *
 *   node tools/preuves/sonde-contexte-cumule.js --naif      # le cumul séquentiel (dangereux)
 *   node tools/preuves/sonde-contexte-cumule.js             # le REPLI, 6 variantes
 *   node tools/preuves/sonde-contexte-cumule.js --detail    # + la liste des blocs gagnés
 *
 * CE QUE LES SIX VARIANTES ONT RENDU (1 675 blocs à bouton, 159 en panne) :
 *      separe-nu 28 · separe-enveloppe 40 · concat-nu 17 · concat-enveloppe 21 ·
 *      concat-env-tous 19 · concat-env-filtre **28** (retenue)
 * Les deux premières sont INFIDÈLES au Worker (voir plus bas) : leurs 40 gains n'existaient
 * pas. La retenue gagne 28 blocs, et le navigateur les a confirmés un par un.
 *
 * DEUX MÉCANIQUES, ET TOUTE LA DIFFÉRENCE EST LÀ.
 *
 * (1) LE CUMUL SÉQUENTIEL — tous les blocs de la leçon dans UN contexte partagé, comme si le
 *     moteur ne remettait jamais les compteurs à zéro. Mesuré : 1 675 blocs, **28 gagnés,
 *     380 PERDUS**, et 380 pertes sur 380 portent le même message : « Identifier '…' has
 *     already been declared ». Deux blocs d'une même leçon qui déclarent chacun `const jeu`
 *     ne peuvent pas cohabiter dans une portée globale. C'est rédhibitoire, et le navigateur
 *     ferait pareil : `(0, eval)(code)` s'exécute au scope global.
 *
 * (2) LE REPLI — le bloc est d'abord exécuté SEUL, exactement comme aujourd'hui ; s'il tombe
 *     en panne, et seulement dans ce cas, il est rejoué dans un contexte NEUF précédé des
 *     blocs qui le précèdent dans la leçon. Un bloc qui aboutit seul n'est jamais rejoué :
 *     cette variante ne peut donc RIEN perdre, et la seule question est ce qu'elle gagne.
 *     Deux réglages sont croisés :
 *       - le préambule : les blocs À BOUTON qui précèdent, ou TOUS ceux qui compilent ;
 *       - l'ENVELOPPE : le bloc rejoué tel quel, ou entouré d'accolades. L'enveloppe est ce
 *         qui répond à la collision qui tue le cumul séquentiel — `{ const jeu = … }` est
 *         une portée de bloc, elle masque le `jeu` du préambule au lieu d'entrer en conflit.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..', '..');
var DETAIL = process.argv.indexOf('--detail') !== -1;
var NAIF = process.argv.indexOf('--naif') !== -1;
var DELAI = 5000;

function lireMotif(nom) {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(new RegExp('var ' + nom + ' = (/[\\s\\S]*?/);'));
  if (!m) throw new Error(nom + ' introuvable dans js/runner.js');
  return eval(m[1]);
}
function lireFonction(nom) {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var i = src.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable dans js/runner.js');
  var j = src.indexOf('\n  }', i);
  return eval('(' + src.slice(i, j + 4) + ')');
}
var BROWSER_ONLY = lireMotif('BROWSER_ONLY');
var NOMS_REGLES = ['estUnFichierJson', 'estUneSuiteDeTests', 'estUnFragmentServeur',
  'estDuDomDePage', 'estUnServiceWorker', 'neCompilePas'];
var regles = NOMS_REGLES.map(lireFonction);
var neCompilePas = regles[NOMS_REGLES.indexOf('neCompilePas')];

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">([\s\S]*?)<\/code>/g, m;
  while ((m = re.exec(src))) out.push({ code: dec(m[2]).trim(), rang: out.length + 1 });
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
var ERREUR_ANNONCEE = /\/\/[^\n]*\b(erreur|Erreur|ERREUR|throw|lève|leve|refuse|rejett?e|échoue|echoue|plante|invalide)\b/;

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

/* Un bloc peut lever une erreur APRÈS la fin de son script (un écouteur déclenché par
   `dispatchEvent`, une promesse rejetée) : Node la relance hors de tout `try`, et la sonde
   mourrait au milieu de la mesure.
   ⚠️ CE GARDE-FOU A D'ABORD RENDU LA SONDE MUETTE. Installé dès le chargement, il avalait
   aussi les erreurs de DÉMARRAGE : une règle mal lue dans runner.js faisait sortir la sonde
   en code 0 avec un fichier de résultats VIDE — un outil qui ne peut plus échouer, le défaut
   même que ce chantier ferme. Il n'est donc armé qu'au moment d'exécuter du contenu, et il
   COMPTE ce qu'il avale. */
var avalees = 0;
function armerLeGardeFou() {
  process.on('uncaughtException', function () { avalees++; });
}

function juger(code, ctx) {
  var msg = null;
  try { vm.runInContext(code, ctx, { timeout: DELAI, displayErrors: false }); }
  catch (e) { msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)); }
  if (msg && /timed out/i.test(msg)) return { etat: 'lent', msg: msg };
  if (!msg) return { etat: 'ok', msg: null };
  if (ERREUR_ANNONCEE.test(code)) return { etat: 'ann', msg: msg };
  return { etat: 'ko', msg: msg };
}

/* L'ENVELOPPE. Une portée de bloc suffit à masquer les déclarations du préambule au lieu
   d'entrer en collision avec elles. ⚠️ Sauf si le bloc s'ouvre sur `"use strict"` : dans des
   accolades, ce n'est plus une directive mais une expression sans effet, et le bloc serait
   silencieusement DÉCLASSÉ en mode non strict. Ces blocs-là reçoivent une fonction, qui
   garde la directive. */
function envelopper(code) {
  if (/^\s*["']use strict["']\s*;/.test(code)) return '(function () {\n' + code + '\n})();';
  return '{\n' + code + '\n}';
}

var stats = { blocs: 0, okIsole: 0, ko: 0, okCumule: 0, gagnes: [], perdus: [], causesPerte: {} };
/* ⚠️ LA PREMIÈRE MESURE DE CE FICHIER PRÊTAIT AU WORKER UNE SÉMANTIQUE QU'IL N'A PAS, et
   c'est le navigateur qui l'a dit. Les variantes `separe-*` exécutent chaque bloc du
   préambule dans son propre appel — ce que fait `vm.runInContext`, où les `const`, `let` et
   `class` de haut niveau PERSISTENT dans le contexte. Le Worker, lui, évalue par
   `(0, eval)(code)` : dans un eval, seuls `var` et `function` deviennent globaux, les
   déclarations LEXICALES disparaissent à la fin de l'appel. Un préambule passé bloc par bloc
   n'y laisse donc RIEN d'une `class UnionFind` — mesuré dans Chrome : les blocs annoncés
   gagnés affichaient toujours « ReferenceError: UnionFind is not defined ».
   Les variantes `concat-*` sont les seules FIDÈLES : préambule et bloc dans UN SEUL script,
   comme le fera le moteur. Elles paient ce qu'il faut payer — une collision de déclarations
   entre deux blocs du préambule, ou une erreur d'exécution dans l'un d'eux, emporte tout. */
var VARIANTES = [
  { cle: 'separe-nu', preambule: 'bouton', enveloppe: false, concat: false },
  { cle: 'separe-enveloppe', preambule: 'bouton', enveloppe: true, concat: false },
  { cle: 'concat-nu', preambule: 'bouton', enveloppe: false, concat: true },
  { cle: 'concat-enveloppe', preambule: 'bouton', enveloppe: true, concat: true },
  { cle: 'concat-env-tous', preambule: 'tous', enveloppe: true, concat: true },
  /* La variante RETENUE : concaténée (fidèle au Worker), enveloppée, et débarrassée des
     blocs du préambule qui empêchent l'ensemble de compiler. La règle du tri est LUE dans
     runner.js, jamais recopiée. */
  { cle: 'concat-env-filtre', preambule: 'bouton', enveloppe: true, concat: true, filtre: true }
];
var preambuleQuiCompile = lireFonction('preambuleQuiCompile');
var envelopperPourRepli = lireFonction('envelopperPourRepli');
VARIANTES.forEach(function (v) { v.gains = []; v.msDur = 0; });

armerLeGardeFou();

lecons().forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var tous = blocsJs(f).filter(function (b) { return !!b.code; });
  var aBouton = tous.filter(function (b) {
    if (BROWSER_ONLY.test(b.code)) return false;
    for (var i = 0; i < regles.length; i++) if (regles[i](b.code)) return false;
    return true;
  });
  if (!aBouton.length) return;

  /* Passe 1 : chaque bloc SEUL, comme aujourd'hui. */
  var isole = aBouton.map(function (b) {
    var s = []; return juger(b.code, vm.createContext(contexteWorker(s)));
  });
  aBouton.forEach(function (b, i) {
    stats.blocs++;
    if (isole[i].etat === 'ok') stats.okIsole++;
    if (isole[i].etat === 'ko') stats.ko++;
  });

  if (NAIF) {
    /* Passe 2 : les mêmes blocs dans l'ordre, dans UN SEUL contexte partagé. */
    var sorties = [];
    var ctx = vm.createContext(contexteWorker(sorties));
    var cumule = aBouton.map(function (b) { return juger(b.code, ctx); });
    aBouton.forEach(function (b, i) {
      if (cumule[i].etat === 'ok') stats.okCumule++;
      if (isole[i].etat === 'ko' && cumule[i].etat === 'ok') {
        stats.gagnes.push(rel + ' #' + b.rang);
      }
      if (isole[i].etat === 'ok' && cumule[i].etat !== 'ok') {
        stats.perdus.push(rel + ' #' + b.rang + '  -> ' + (cumule[i].msg || cumule[i].etat).slice(0, 70));
        var cle = (cumule[i].msg || cumule[i].etat).replace(/'[^']*'/g, "'…'").slice(0, 55);
        stats.causesPerte[cle] = (stats.causesPerte[cle] || 0) + 1;
      }
    });
    return;
  }

  /* Passe 3 : LE REPLI, seulement sur les blocs qui tombent en panne seuls. */
  aBouton.forEach(function (b, i) {
    if (isole[i].etat !== 'ko') return;
    VARIANTES.forEach(function (v) {
      var pre = v.preambule === 'bouton'
        ? aBouton.slice(0, i).map(function (p) { return p.code; })
        : tous.filter(function (p) { return p.rang < b.rang && !neCompilePas(p.code); })
              .map(function (p) { return p.code; });
      if (v.filtre) pre = preambuleQuiCompile(pre, b.code);
      if (!pre.length) return;
      var t0 = Date.now();
      var s = [], c = vm.createContext(contexteWorker(s)), av = 0, verdict;
      if (v.concat) {
        /* UN SEUL script, comme un seul `(0, eval)` dans le Worker. */
        verdict = juger(pre.join('\n') + '\n' + (v.enveloppe ? envelopper(b.code) : b.code), c);
      } else {
        pre.forEach(function (code) { try { juger(code, c); } catch (e) {} });
        av = s.length;
        verdict = juger(v.enveloppe ? envelopper(b.code) : b.code, c);
      }
      v.msDur += Date.now() - t0;
      if (verdict.etat === 'ok') {
        v.gains.push(rel + ' #' + b.rang + '  (' + (s.length - av) + ' ligne(s) rendue(s))  <- ' +
          isole[i].msg.slice(0, 45));
      }
    });
  });
});

if (NAIF) {
  console.log('=== CUMUL SÉQUENTIEL (tous les blocs de la leçon dans un contexte partagé) ===');
  console.log('  blocs à bouton ......... ' + stats.blocs);
  console.log('  aboutissent SEULS ...... ' + stats.okIsole);
  console.log('  aboutissent EN CUMULÉ .. ' + stats.okCumule);
  console.log('  GAGNÉS (panne -> ok) ... ' + stats.gagnes.length);
  console.log('  PERDUS (ok -> panne) ... ' + stats.perdus.length);
  console.log('\n--- causes des PERTES ---');
  Object.keys(stats.causesPerte).sort(function (a, b) { return stats.causesPerte[b] - stats.causesPerte[a]; })
    .forEach(function (c) { console.log('  ' + String(stats.causesPerte[c]).padStart(4) + '  ' + c); });
  if (DETAIL) stats.perdus.forEach(function (p) { console.log('    ' + p); });
} else {
  console.log('=== LE REPLI : rejouer les blocs EN PANNE derrière ce qui les précède ===');
  console.log('  blocs à bouton ......... ' + stats.blocs);
  console.log('  aboutissent seuls ...... ' + stats.okIsole);
  console.log('  EN PANNE (le gisement) . ' + stats.ko);
  console.log('');
  VARIANTES.forEach(function (v) {
    console.log('  ' + v.cle.padEnd(18) + ' gagne ' + String(v.gains.length).padStart(4) +
      ' bloc(s)   (' + (v.msDur / 1000).toFixed(1) + ' s de préambules)');
  });
  if (DETAIL) VARIANTES.forEach(function (v) {
    console.log('\n--- ' + v.cle + ' ---');
    v.gains.forEach(function (g) { console.log('  ' + g); });
  });
}
