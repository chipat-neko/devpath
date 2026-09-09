'use strict';
/**
 * tools/preuves/sonde-reseau-sans-serveur.js — COMBIEN DE BLOCS À BOUTON DEMANDENT UN
 * SERVEUR QUE LE SITE N'A PAS, ET COMBIEN D'ENTRE EUX SONT VIVANTS ?
 *
 * (2026-09-09, préparation du point B2b-16.) Le point B2b-2 a délibérément laissé `fetch`,
 * `WebSocket`, `XMLHttpRequest`, `indexedDB` et `caches` HORS du contexte de mesure, au
 * motif qu'ils « exigent un serveur ou le réseau ». La mesure au clic dit que ce motif est
 * juste pour les uns et FAUX pour les autres : `pages/nodejs/lecon-17.html` #9 (WebSocket)
 * n'affiche rien du tout chez l'apprenant — il promet pourtant « Connecté au chat » — alors
 * que `pages/js/lecon-32.html` #6 (indexedDB) affiche bel et bien « Acheter du pain », le
 * stockage local n'ayant besoin d'aucun serveur.
 *
 * Avant d'écrire la moindre règle, cette sonde compte : pour chaque nom, combien de blocs
 * À BOUTON le citent, et combien de ces blocs ABOUTISSENT aujourd'hui — c'est-à-dire
 * combien de boutons VIVANTS une règle les visant retirerait. C'est la mesure que le point
 * B2a avait faite avant d'écarter les fichiers JSON, et qui avait sauvé trois boutons.
 *
 * Elle ne modifie rien.  node tools/preuves/sonde-reseau-sans-serveur.js
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var RACINE = path.resolve(__dirname, '..', '..');

/* ⚠️ ELLE S'EST ARRÊTÉE EN SILENCE À SON PREMIER JET, ET C'EST LA TROISIÈME SONDE À QUI
   CELA ARRIVE (2026-09-09 ; les deux autres aux points B2b-13 et B2b-14). Ici la cause
   était double, et l'une cachait l'autre : `prochainPrefixe` avait été LUE sans les trois
   fonctions qu'elle appelle, et un `uncaughtException` MUET avalait la `ReferenceError`
   qui en découlait — la boucle mourait au milieu, sans message, EN CODE 0. Un instrument
   qui s'arrête en route rend une mesure PARTIELLE sous les traits d'un relevé complet.
   Deux garde-fous, donc, et ils restent en place une fois la cause corrigée : toute
   exception non rattrapée est IMPRIMÉE, et la sonde sort en 3 tant que sa dernière ligne
   n'est pas atteinte, pour qu'aucun chiffre partiel ne puisse être cité. */
var TERMINE = false;
process.on('exit', function (code) {
  if (!TERMINE && code === 0) {
    console.error('\nSONDE INCOMPLETE — arretee avant sa derniere ligne : ne citer AUCUN chiffre.');
    process.exitCode = 3;
  }
});
process.on('uncaughtException', function (e) { console.error('EXCEPTION NON RATTRAPEE : ' + (e && e.stack ? e.stack : e)); });
process.on('unhandledRejection', function () {});

var CTX = require('../lib/contexte-worker.js');
var contexteWorker = CTX.contexteWorker;
var erreurAnnoncee = CTX.erreurAnnoncee;

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
/* ⚠️ `prochainPrefixe` N'EST PAS AUTONOME : elle appelle `meriteUnRepli`,
   `preambuleReAncre` et `preambuleElague`, qui doivent donc être lues AUSSI. Les oublier
   ne se voit pas au chargement — l'erreur ne tombe qu'au premier bloc qui déclenche un
   ré-ancrage, et un `uncaughtException` muet l'avalait : la sonde s'arrêtait alors au
   milieu de sa boucle, en code 0. Deux dettes en une, l'une l'ayant caché l'autre. */
var preambuleReAncre = lireFonction('preambuleReAncre');
var preambuleElague = lireFonction('preambuleElague');
var prochainPrefixe = lireFonction('prochainPrefixe');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>([\s\S]*?)<\/figure>/g, m;
  while ((m = re.exec(src))) {
    var c = m[2].match(/<code class="language-javascript">([\s\S]*?)<\/code>/);
    if (!c) continue;
    var df = (m[1] || '').match(/data-file="([^"]*)"/);
    out.push({ code: dec(c[1]).trim(), fichier: df ? df[1] : '' });
  }
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

/* Les cinq noms laissés dehors par le point B2b-2, cherchés hors commentaire et hors
   chaîne de caractères — un `fetch` cité dans une phrase n'appelle rien. */
var NOMS = {
  'fetch': /(?:^|[^\w$.])fetch\s*\(/,
  'WebSocket': /new\s+WebSocket\s*\(/,
  'EventSource': /new\s+EventSource\s*\(/,
  'XMLHttpRequest': /new\s+XMLHttpRequest\s*\(/,
  'indexedDB': /(?:^|[^\w$.])indexedDB\s*\./,
  'caches': /(?:^|[^\w$.])caches\s*\./
};
function sansCommentaire(code) {
  return String(code).replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:"'`\\])\/\/[^\n]*/gm, '$1');
}

var DELAI = 5000;
var compte = {}, detail = {};
Object.keys(NOMS).forEach(function (n) { compte[n] = { total: 0, vivants: 0, panne: 0 }; detail[n] = []; });

lecons().forEach(function (f) {
  var rel = path.relative(RACINE, f).split(path.sep).join('/');
  var blocs = blocsJs(f);
  var navAvant = [], vusNav = [], tousTextesJs = [];
  blocs.forEach(function (b) {
    navAvant.push(vusNav.slice());
    if (!b.code) return;
    tousTextesJs.push(b.code);
    if (BROWSER_ONLY.test(b.code) || estDuDomDePage(b.code)) vusNav.push(b.code);
  });
  function aUnBouton(code, ctxNav) {
    return !(BROWSER_ONLY.test(code) || estUnFichierJson(code) || estUneSuiteDeTests(code) ||
      estUnFragmentServeur(code) || estDuDomDePage(code) || estUnServiceWorker(code) ||
      neCompilePas(code) || heriteDuNavigateur(code, ctxNav) ||
      estUnFragmentOrphelin(code, tousTextesJs));
  }
  var indexBouton = [];
  blocs.forEach(function (b, i) { if (b.code && aUnBouton(b.code, navAvant[i])) indexBouton.push(i); });
  var aBouton = indexBouton.map(function (i) { return blocs[i].code; });

  indexBouton.forEach(function (idx, rang) {
    var code = blocs[idx].code;
    var nu = sansCommentaire(code);
    var vises = Object.keys(NOMS).filter(function (n) { return NOMS[n].test(nu); });
    if (!vises.length) return;

    /* Le bloc aboutit-il aujourd'hui ? Même mécanique que verif-js.js : bloc seul, puis
       repli derrière les blocs à bouton qui le précèdent, avec les réécritures du moteur. */
    var sorties = [], msg = null;
    try { vm.runInContext(code, vm.createContext(contexteWorker(sorties)), { timeout: DELAI, displayErrors: false }); }
    catch (e) { msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)); }
    if (msg && !/timed out/i.test(msg)) {
      var prefixe = aBouton.slice(0, rang);
      var jouer = function (gardes) {
        var s2 = [], brut = contexteWorker(s2);
        brut.__finDuPrelude = function () {};
        try {
          vm.runInContext(gardes.join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code),
            vm.createContext(brut), { timeout: DELAI, displayErrors: false });
        } catch (e2) { return (e2 && e2.name ? e2.name + ': ' : '') + (e2 && e2.message ? e2.message : String(e2)); }
        return null;
      };
      if (prefixe.length && meriteUnRepli(msg)) {
        var prf = prefixe, g = preambuleQuiCompile(prf, code);
        var err = g.length ? jouer(g) : 'préambule vide';
        while (err && g.length) {
          var suite = prochainPrefixe(prf, err);
          if (!suite) break;
          var g2 = preambuleQuiCompile(suite.prefixe, code);
          if (!g2.length) break;
          prf = suite.prefixe; g = g2; err = jouer(g);
        }
        if (!err) msg = null;
      }
    }
    var vivant = !msg || /timed out/i.test(msg) || erreurAnnoncee(code, msg);
    vises.forEach(function (n) {
      compte[n].total++;
      if (vivant) compte[n].vivants++; else compte[n].panne++;
      detail[n].push(rel + ' #' + (idx + 1) + (blocs[idx].fichier ? '  [' + blocs[idx].fichier + ']' : '') +
        (vivant ? '   ⚠ VIVANT' : '   (deja en panne)'));
    });
  });
});

console.log('=== BLOCS A BOUTON QUI CITENT UNE API LAISSEE HORS DU CONTEXTE (point B2b-2) ===\n');
Object.keys(NOMS).forEach(function (n) {
  var c = compte[n];
  console.log('  ' + n.padEnd(16) + 'total ' + String(c.total).padStart(3) +
              '   deja en panne ' + String(c.panne).padStart(3) +
              '   VIVANTS ' + String(c.vivants).padStart(3));
});
Object.keys(NOMS).forEach(function (n) {
  if (!detail[n].length) return;
  console.log('\n--- ' + n + ' (' + detail[n].length + ') ---');
  detail[n].forEach(function (l) { console.log('   ' + l); });
});

TERMINE = true;
