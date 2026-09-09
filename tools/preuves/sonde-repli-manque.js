'use strict';
/**
 * tools/preuves/sonde-repli-manque.js — POURQUOI le repli ne sauve pas ces blocs-là.
 *
 * Après le point B2b-10 il reste 70 blocs JS en panne (102 avant lui). Une partie échoue sur
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
 * Relevé du 2026-09-09, ré-ancrage ET fragment orphelin compris : APRES 0, TRI 10,
 * AUTRE-ERR 15, INTROUVABLE 31.
 * Deux lots ont été fermés depuis l'écriture de cette sonde. Les 6 « le tri a écarté le bloc
 * source » : 4 sauvés par le ré-ancrage du point B2b-9, 2 repassés en AUTRE-ERR. Et 29 des
 * 60 INTROUVABLES : privés de bouton par `estUnFragmentOrphelin` (point B2b-10), ils ne sont
 * plus des pannes. Le TRI restant est d'une SEULE nature — le bloc source n'a pas de bouton —
 * et lui donner le préambule a été mesuré puis refusé (0 gain, 2 pertes) : ces blocs touchent
 * `document` ou `localStorage`. Les 31 INTROUVABLES restants sont ceux qu'un critère STATIQUE
 * ne sait pas nommer : le nom manquant n'ouvre aucune ligne, il est lu dans le corps d'une
 * fonction que le bloc appelle.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..', '..');

/* ⚠️ CETTE SONDE MOURAIT AVANT SA DERNIÈRE LIGNE (2026-09-09, point B2b-14), comme
   `sonde-heritage-navigateur.js` le faisait pour une raison voisine. Ici l'`EventTarget`
   de Node remet à `process.nextTick` l'exception d'un écouteur (`pages/js/lecon-64` #1
   appelle `miseAJourBadge`, qui n'existe pas) : le `try/catch` autour de `runInContext`
   ne peut rien pour une exception relancée au tour suivant, et le processus s'arrêtait au
   milieu du dernier tableau. Un instrument qui meurt en route rend une mesure PARTIELLE
   sous les traits d'une panne d'outil. Un navigateur, lui, signale l'exception d'un
   écouteur et poursuit : l'ignorer est donc aussi le comportement FIDÈLE. */
process.on('uncaughtException', function () {});
process.on('unhandledRejection', function () {});

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
var preambuleReAncre = lireFonction('preambuleReAncre');
var preambuleElague = lireFonction('preambuleElague');
/* ⚠️ CETTE SONDE RECOPIAIT LA BOUCLE DU REPLI (dette ouverte au point B2b-14, soldée au
   point B2b-15). Elle ignorait donc l'ÉLAGAGE PAR LE HAUT écrit ce jour-là, et ses chiffres
   décrivaient l'état d'AVANT : elle rangeait en AUTRE-ERR huit blocs que le moteur sauve.
   L'ordre des deux réécritures est maintenant LU dans `js/runner.js`, comme les onze règles
   au-dessus — c'est exactement ce que fait `tools/verif-js.js`. */
var prochainPrefixe = lireFonction('prochainPrefixe');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
/* Motif BORNÉ par `</figure>`, comme dans `tools/verif-js.js` depuis le point B2b-15 :
   non borné, il traverse les figures et associe l'attribut de l'une au code de l'autre. */
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>([\s\S]*?)<\/figure>/g, m;
  while ((m = re.exec(src))) {
    var c = m[2].match(/<code class="language-javascript">([\s\S]*?)<\/code>/);
    if (c) out.push({ code: dec(c[1]).trim() });
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
/* LE CONTEXTE EST CELUI DE verif-js.js, LU DANS LE MEME MODULE (2026-09-09, B2b-15).
   Cette sonde en portait sa PROPRE copie, restee au console a 11 methodes et au
   structuredClone contrefait : elle mesurait donc un autre moteur que le verificateur
   dont elle prepare les cases. */
var CTX = require('../lib/contexte-worker.js');
var contexteWorker = CTX.contexteWorker;
/* Et la MÊME reconnaissance des erreurs annoncées : cette sonde n'en avait que le motif
   français, pas l'annonce par son NOM technique (point B2b-13), et comptait donc en panne
   deux blocs (`pages/js/lecon-06.html` #9 et #10) que `verif-js.js` compte annoncés. */
var erreurAnnoncee = CTX.erreurAnnoncee;

var DELAI = 5000;

function declareEnColonneZero(texte, nom) {
  var n = nom.replace(/[$]/g, '\\$&');
  return new RegExp('^(?:const|let|var|class|async\\s+function|function)\\s+' + n + '(?![\\w$À-ɏ])', 'm').test(texte);
}

var compte = { APRES: 0, TRI: 0, 'AUTRE-ERR': 0, INTROUVABLE: 0 };
var detail = { APRES: [], TRI: [], 'AUTRE-ERR': [], INTROUVABLE: [] };

lecons().forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
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
    var prefixe = aBouton.slice(0, rang);
    var sorties = [];
    var msg = null;
    try { vm.runInContext(code, vm.createContext(contexteWorker(sorties)), { timeout: DELAI, displayErrors: false }); }
    catch (e) { msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)); }
    if (!msg || /timed out/i.test(msg) || erreurAnnoncee(code, msg)) return;
    if (!meriteUnRepli(msg)) return;
    var nom = /^ReferenceError: (.+?) is not defined/.exec(msg);
    if (!nom) return;
    nom = nom[1];
    /* Le repli a-t-il été tenté, et qu'a-t-il donné ? RÉ-ANCRAGE (B2b-9) ET ÉLAGAGE
       (B2b-14) COMPRIS : sans eux, cette sonde classerait en défaut des blocs que le
       moteur sauve, et sa réponse se périmerait à chaque passe. */
    var essayer = function (gardes) {
      var s2 = [], brut = contexteWorker(s2);
      brut.__finDuPrelude = function () {};
      try {
        vm.runInContext(gardes.join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code),
          vm.createContext(brut), { timeout: DELAI, displayErrors: false });
      } catch (e2) { return (e2 && e2.name ? e2.name + ': ' : '') + (e2 && e2.message ? e2.message : String(e2)); }
      return null;
    };
    var prf = prefixe;
    var gardes = preambuleQuiCompile(prf, code);
    var msg2 = gardes.length ? essayer(gardes) : 'préambule vide';
    while (msg2 && gardes.length) {
      var suite = prochainPrefixe(prf, msg2);
      if (!suite) break;
      var g2 = preambuleQuiCompile(suite.prefixe, code);
      if (!g2.length) break;
      prf = suite.prefixe; gardes = g2;
      msg2 = essayer(gardes);
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
