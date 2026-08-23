'use strict';

/**
 * tools/verif-sorties.js — Les sorties rangées dans un bloc séparé, rejouées.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * `verif-exemples.js` ne confronte au réel que les valeurs écrites EN COMMENTAIRE
 * dans le code (`// affiche : 14`). Or une leçon range souvent la sortie d'un
 * programme dans un bloc `plaintext` séparé, juste après lui :
 *
 *     <figure class="code-block" data-file="eval-ordre.js">…le programme…</figure>
 *     <figure class="code-block" data-file="eval-ordre.txt">…sa sortie…</figure>
 *
 * Ce second bloc n'était vérifié par personne. Angle mort relevé au module 2 du
 * cours `compilation`, comblé ici de façon générique : on exécute le programme et
 * on compare sa sortie, ligne à ligne, à ce que la page affiche.
 *
 * CE QU'IL NE JUGE PAS, ET POURQUOI
 * ---------------------------------
 * Un bloc `.txt` voisin n'est pas toujours une sortie de programme. C'est très
 * souvent une ILLUSTRATION : un arbre dessiné, une table d'opcodes, une trace
 * calculée à la main, un désassemblage Python. Une première version de cet outil
 * a crié au loup 13 fois sur 13 pour cette raison. Il n'apparie donc que si le nom
 * du bloc le DÉSIGNE comme la sortie du programme qui le précède :
 *   · même radical            `eval-ordre.js`  ↔ `eval-ordre.txt`
 *   · ou préfixe « sortie »   `analyseur.js`   ↔ `sortie-analyseur.txt`, `sortie.txt`
 * et à condition que le bloc de programme soit bien du `language-javascript`.
 * Tout le reste est compté « non jugé » et listé, jamais signalé comme une faute.
 *
 * Il ne juge pas non plus un FRAGMENT : un bloc qui ne produit rien, ou qui lève
 * une `ReferenceError` parce qu'il dépend d'un bloc précédent.
 *
 * USAGE
 *   node tools/verif-sorties.js                       toutes les leçons à risque
 *   node tools/verif-sorties.js --tout                toutes les leçons
 *   node tools/verif-sorties.js pages/x/lecon-01.html une ou plusieurs pages
 *
 * Sort en code 1 s'il reste une divergence.
 */

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..');
var args = process.argv.slice(2);
var TOUT = args.indexOf('--tout') !== -1;
var explicites = args.filter(function (a) { return a.indexOf('--') !== 0; });

/* ---------------------------------------------------------- choix des pages --- */
function lecons() {
  var out = [];
  var base = path.join(RACINE, 'pages');
  fs.readdirSync(base).forEach(function (d) {
    var dir = path.join(base, d);
    if (!fs.statSync(dir).isDirectory()) return;
    fs.readdirSync(dir).forEach(function (f) {
      if (!/^lecon-\d+\.html$/.test(f)) return;
      var h = fs.readFileSync(path.join(dir, f), 'utf8');
      if (h.indexOf('language-javascript') < 0) return;
      /* à risque : un bloc JS et, quelque part, un bloc de sortie .txt */
      if (TOUT || /data-file="[^"]*\.txt"/.test(h)) {
        out.push(path.relative(RACINE, path.join(dir, f)).replace(/\\/g, '/'));
      }
    });
  });
  return out;
}
var PAGES = explicites.length ? explicites : lecons();

/* -------------------------------------------------------------- extraction --- */
function des(x) {
  return x.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocs(src) {
  var re = /data-file="([^"]+)"[^>]*>\s*<pre><code class="language-([a-z]+)"[^>]*>([\s\S]*?)<\/code><\/pre>/g;
  var out = [], m;
  while ((m = re.exec(src))) out.push({ nom: m[1], lang: m[2], code: des(m[3]) });
  return out;
}

/* Le bloc `.txt` est-il désigné comme la SORTIE du programme `nomJs` ? */
function estLaSortieDe(nomTxt, nomJs) {
  var t = nomTxt.replace(/\.txt$/, '').toLowerCase();
  var j = nomJs.replace(/\.[a-z]+$/, '').toLowerCase();
  if (t === j) return true;                              /* eval-ordre.txt ↔ eval-ordre.js */
  if (t === 'sortie') return true;                       /* sortie.txt */
  if (t.indexOf('sortie') === 0) {                       /* sortie-trace.txt ↔ trace.js */
    var reste = t.replace(/^sortie[-_]?/, '');
    return reste === '' || reste === j || j.indexOf(reste) >= 0 || reste.indexOf(j) >= 0;
  }
  return false;
}

/* ------------------------------------------------------------- exécution ----- */
function fmt(v) {                                        /* le formateur exact de js/runner.js */
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return v.toString();
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
function run(code) {
  var out = [];
  var pousse = function () { out.push(Array.prototype.slice.call(arguments).map(fmt).join(' ')); };
  var ctx = { console: { log: pousse, warn: pousse, error: pousse } };
  ctx.globalThis = ctx;
  vm.runInNewContext(code, vm.createContext(ctx), { timeout: 10000 });
  return out;
}

/* ------------------------------------------------------------------ passe ---- */
var identiques = 0, divergents = 0, nonJuges = [], fragments = 0, ambigus = [];
var pagesKO = [];

PAGES.forEach(function (page) {
  var abs = path.resolve(RACINE, page);
  if (!fs.existsSync(abs)) { console.log('  ' + page + ' : fichier introuvable'); return; }
  var bs = blocs(fs.readFileSync(abs, 'utf8'));
  var lignesPage = [];

  bs.forEach(function (b, i) {
    if (!/\.txt$/.test(b.nom)) return;
    /* le programme = le dernier bloc JavaScript avant, à trois blocs près */
    var js = null;
    for (var k = i - 1; k >= 0 && k >= i - 3; k--) {
      if (bs[k].lang === 'javascript' && /\.js$/.test(bs[k].nom)) { js = bs[k]; break; }
      if (bs[k].lang !== 'plaintext') break;             /* python, sql… : ce n'est pas notre affaire */
    }
    if (!js || !estLaSortieDe(b.nom, js.nom)) { nonJuges.push(page + ' · ' + b.nom); return; }
    /* Un nom générique — « solution.js » / « solution.txt » — est porté par TOUS les
       exercices d'une page : il ne rattache le bloc à rien. On ne juge que si la page
       contient exactement un programme et une sortie de ce radical. */
    var radical = js.nom.replace(/\.[a-z]+$/, '');
    var nbJs = bs.filter(function (x) { return x.nom === radical + '.js'; }).length;
    var nbTxt = bs.filter(function (x) { return x.nom === radical + '.txt'; }).length;
    if (nbJs !== 1 || nbTxt !== 1) { ambigus.push(page + ' · ' + b.nom + ' (' + nbJs + ' programme(s), ' + nbTxt + ' sortie(s) de ce nom)'); return; }

    var reel;
    try { reel = run(js.code); }
    catch (err) {
      if (/is not defined/.test(err.message)) { fragments++; return; }   /* dépend d'un bloc précédent */
      lignesPage.push('  X ' + b.nom + ' : ' + err.name + ' — ' + err.message);
      divergents++; return;
    }
    if (!reel.length) { fragments++; return; }

    /* Le « \r » d'un fichier en CRLF n'est PAS une divergence : il est invisible et
       ne change rien à ce que l'apprenant lit. Sans cette neutralisation, une leçon
       enregistrée en CRLF sort à 100 % divergente — mesuré le 2026-08-23 : la même
       page donne 4 blocs conformes en LF et 4 « divergences » en CRLF, ligne à ligne.
       `verif-clic.js` le faisait déjà (sa fonction norm) ; les deux outils comparent
       désormais la même chose. Le dépôt est à 1780 fichiers en LF contre 29 en CRLF,
       donc le piège est rare — et d'autant plus coûteux quand il tombe. */
    var sansCR = function (s) { return String(s).replace(/\r/g, ''); };
    var attendu = sansCR(b.code).replace(/\s+$/, '').split('\n');
    var obtenu = sansCR(reel.join('\n')).replace(/\s+$/, '').split('\n');
    if (JSON.stringify(attendu) === JSON.stringify(obtenu)) { identiques++; return; }

    divergents++;
    lignesPage.push('  DIVERGENCE ' + b.nom + '  (programme : ' + js.nom + ')');
    var n = Math.max(attendu.length, obtenu.length);
    for (var q = 0; q < n; q++) if (attendu[q] !== obtenu[q]) {
      lignesPage.push('    ligne ' + (q + 1));
      lignesPage.push('      la page affiche : ' + JSON.stringify(attendu[q]));
      lignesPage.push('      l\'exécution rend : ' + JSON.stringify(obtenu[q]));
    }
  });

  if (lignesPage.length) { pagesKO.push(page); console.log('\n' + page); console.log(lignesPage.join('\n')); }
});

console.log('\nverif-sorties.js — ' + PAGES.length + ' page(s) · les blocs de sortie sont rejoués');
console.log('\n=== RÉSUMÉ ===');
console.log('  blocs de sortie rejoués ............ ' + (identiques + divergents));
console.log('  identiques au caractère près ....... ' + identiques);
console.log('  DIVERGENTS ......................... ' + divergents);
console.log('  fragments (rien produit / dépendant) ' + fragments);
console.log('  blocs .txt non jugés ............... ' + nonJuges.length + '  (illustration, ou sortie d\'un autre langage)');
if (args.indexOf('--details') !== -1 && nonJuges.length) {
  console.log('\n=== BLOCS .txt NON JUGÉS ===');
  nonJuges.forEach(function (x) { console.log('  · ' + x); });
}
if (divergents) {
  console.log('\n  ' + divergents + ' divergence(s) sur ' + pagesKO.length + ' page(s) : ce que la page affiche n\'est pas ce que le code produit.');
  process.exit(1);
}
console.log('\n  Aucune divergence : chaque bloc de sortie est bien ce que son programme produit.');
