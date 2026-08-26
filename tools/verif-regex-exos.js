'use strict';

/**
 * tools/verif-regex-exos.js — les exercices `type:"regex"` sont-ils VRAIMENT corrigés ?
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Le chantier V14 est né d'exemples faux qui avaient traversé quatre vérificateurs
 * verts, faute d'outil qui EXÉCUTE. Les exercices de motifs ont exactement la même
 * faiblesse à deux étages :
 *   1. tant qu'ils sont corrigés par `accept:[…]`, la correction compare deux chaînes
 *      — elle ne dit rien de ce que le motif FAIT (et un `accept` recopié d'un autre
 *      exercice reste invisible : c'est ce qu'on a trouvé sur 8 exercices du cours
 *      `regex` avant ce chantier) ;
 *   2. une fois corrigés par exécution, rien ne garantit que le jeu de cas DISCRIMINE :
 *      un jeu que tout motif passe est un « compteur câblé », pas une mesure.
 *
 * CE QUE CET OUTIL VÉRIFIE, pour chaque entrée `type:"regex"` :
 *   · `ref` (le motif de référence) passe la totalité de ses cas ;
 *   · chaque motif de `contre` — des motifs PLAUSIBLES MAIS FAUX — échoue au moins un
 *     cas. Sans cela, le jeu de cas ne prouve rien ;
 *   · le jeu comporte au moins deux cas, dont au moins un rejet (`ko` ou `capte`) :
 *     un exercice qui ne teste que des acceptations est passé par `.*` ;
 *   · `ref` figure LITTÉRALEMENT dans la solution repliée de l'exercice — pour que ce
 *     qui est testé et ce qui est montré ne puissent pas diverger en silence ;
 *   · `accept` contient `ref`, seul filet quand le Worker est indisponible.
 *
 * Le corps du test est celui du site, EXTRAIT DE `js/lecon.js` (fonction TEST_REGEX)
 * et non recopié : deux copies divergent, une extraction non.
 *
 * USAGE   node tools/verif-regex-exos.js [--details]
 * SORTIE  0 si tout tient, 1 sinon.
 */

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..');
var DETAILS = process.argv.indexOf('--details') !== -1;

/* ---- Le moteur du site, extrait de js/lecon.js ------------------------------ */
function moteurDuSite() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'lecon.js'), 'utf8');
  var i = src.indexOf('  function TEST_REGEX(');
  var j = src.indexOf('  function programmeRegex(');
  if (i < 0 || j < 0 || j < i) {
    console.log('verif-regex-exos.js — TEST_REGEX introuvable dans js/lecon.js : moteur déplacé ou renommé.');
    process.exit(2);
  }
  var ctx = { sortie: [], console: { log: function () { ctx.sortie.push(Array.prototype.join.call(arguments, ' ')); } } };
  vm.createContext(ctx);
  vm.runInContext(src.slice(i, j), ctx);
  return function (motif, flags, cas) {
    ctx.sortie = [];
    vm.runInContext(
      'TEST_REGEX(' + JSON.stringify(motif) + ',' + JSON.stringify(flags || '') + ',' + JSON.stringify(cas) + ')',
      ctx
    );
    var out = ctx.sortie.join('\n');
    return { passe: /^REGEX-OK$/m.test(out), sortie: out };
  };
}

/* ---- Lecture des leçons ----------------------------------------------------- */
function lecons() {
  var out = [];
  var base = path.join(RACINE, 'pages');
  fs.readdirSync(base).forEach(function (d) {
    var dir = path.join(base, d);
    if (!fs.statSync(dir).isDirectory()) return;
    fs.readdirSync(dir).forEach(function (f) {
      if (/^lecon-\d+\.html$/.test(f)) out.push(path.join(dir, f));
    });
  });
  return out;
}

function zonesExercice(src) {
  var parts = src.split('<div class="exercise">');
  return parts.slice(1);
}

function decode(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

/* ---- Contrôle --------------------------------------------------------------- */
var tester = moteurDuSite();
var nExos = 0, nFichiers = 0, nContre = 0, nCas = 0;
var fautes = [];

lecons().forEach(function (f) {
  var src = fs.readFileSync(f, 'utf8');
  var m = src.match(/<script type="application\/json" data-exos>([\s\S]*?)<\/script>/);
  if (!m) return;
  var arr;
  try { arr = JSON.parse(m[1]); } catch (e) { return; }
  var zones = zonesExercice(src);
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var vu = false;

  arr.forEach(function (e, i) {
    if (!e || e.type !== 'regex') return;
    vu = true;
    nExos++;
    var ou = rel + ' · exercice ' + (i + 1);

    if (!e.cases) { fautes.push(ou + ' : type:"regex" sans champ `cases` — le moteur retombe sur accept, donc sur une comparaison de chaînes.'); return; }
    if (!e.ref) { fautes.push(ou + ' : pas de `ref` (motif de référence) — rien à vérifier.'); return; }

    /* ⚠️ Ce jeu doit contenir EXACTEMENT les champs que `programmeRegex` transmet au
       Worker. Une première version omettait `groupes` : l'outil mesurait alors moins
       que le site, et trois contre-motifs semblaient « passer » des cas qu'ils
       n'avaient jamais subis. Un contrôle qui teste moins que la chose contrôlée
       rend un vert par vacuité. */
    var cas = { ok: e.cases.ok || [], ko: e.cases.ko || [], capte: e.cases.capte || [], groupes: e.cases.groupes || [] };
    var total = cas.ok.length + cas.ko.length + cas.capte.length + cas.groupes.length;
    nCas += total;
    if (total < 2) fautes.push(ou + ' : ' + total + ' cas seulement — un jeu de cas doit pouvoir refuser.');
    if (!cas.ko.length && !cas.capte.length && !cas.groupes.length) fautes.push(ou + ' : aucun cas de REJET (`ko`) ni de capture — `.*` passerait.');

    var r = tester(e.ref, e.cases.flags, cas);
    if (!r.passe) fautes.push(ou + ' : la RÉFÉRENCE ' + JSON.stringify(e.ref) + ' échoue son propre exercice —\n      ' + r.sortie.replace(/\n/g, '\n      '));

    var contre = e.contre || [];
    if (!contre.length) fautes.push(ou + ' : aucun motif `contre` — rien ne prouve que les cas discriminent.');
    contre.forEach(function (c) {
      nContre++;
      var rc = tester(c, e.cases.flags, cas);
      if (rc.passe) fautes.push(ou + ' : le contre-motif ' + JSON.stringify(c) + ' PASSE les cas — le jeu ne discrimine pas.');
    });

    var zone = zones[i] || '';
    var texte = decode(zone);
    if (texte.indexOf(e.ref) < 0) {
      fautes.push(ou + ' : la référence ' + JSON.stringify(e.ref) + " n'apparaît pas dans la solution affichée — testé ≠ montré.");
    }
    var acc = e.accept || [];
    if (acc.indexOf(e.ref) < 0) fautes.push(ou + ' : `accept` ne contient pas `ref` — le repli sans Worker refuserait la bonne réponse.');

    if (DETAILS && r.passe) console.log('  ✓ ' + ou + ' — ' + total + ' cas, ' + contre.length + ' contre-motif(s)');
  });
  if (vu) nFichiers++;
});

console.log('\n=== EXERCICES type:"regex" ===');
console.log('  fichiers ................ ' + nFichiers);
console.log('  exercices ............... ' + nExos);
console.log('  cas exécutés ............ ' + nCas);
console.log('  contre-motifs éprouvés .. ' + nContre);
console.log('  fautes .................. ' + fautes.length);
if (fautes.length) {
  console.log('\n--- FAUTES ---');
  fautes.forEach(function (x) { console.log('  ✗ ' + x); });
}
process.exit(fautes.length ? 1 : 0);
