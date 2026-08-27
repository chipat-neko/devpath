/* verif-liste-alternatives.js — la liste retenue en E1 tient-elle encore ?
 * ---------------------------------------------------------------------------
 * POURQUOI CET OUTIL EXISTE.
 * E1 a retenu 30 lecons a doter d'un bloc « une autre facon de le faire ». Pour
 * ecarter celles qui montrent DEJA leur alternative, il s'appuyait sur le motif
 * DEJA_DIT de mesure-alternatives.js — qui cherche des TOURNURES D'ANNONCE
 * (« une autre facon de », « on aurait pu ecrire »…). Or une lecon peut montrer
 * les deux facons cote a cote sans employer aucune de ces formules : js/lecon-23
 * expose `.then` PUIS sa version async/await, et le sequentiel PUIS Promise.all,
 * en disant simplement « en version async/await » et « compare ces deux fonctions ».
 * Le filtre mesurait donc la presence d'une PHRASE, pas la presence de l'ALTERNATIVE.
 *
 * CE QUE FAIT CELUI-CI : pour chaque lecon retenue, il cherche le motif du CODE
 * de l'alternative prescrite, DANS LES BLOCS DE CODE de la lecon (jamais dans la
 * prose : une alternative citee en passant n'est pas une alternative montree).
 *
 * CE QU'IL NE FAIT PAS : il ne juge pas a ta place. Un motif present est un
 * INDICE fort qu'il n'y a rien a ecrire ; il faut lire la lecon pour trancher.
 * Les lignes sont donc rendues avec leur numero, pour aller voir.
 *
 *   node tools/verif-liste-alternatives.js            # tableau complet
 *   node tools/verif-liste-alternatives.js --a-faire  # seulement celles a doter
 *   node tools/verif-liste-alternatives.js --deja     # seulement celles a ecarter
 */
"use strict";

var fs = require("fs");
var path = require("path");
var RACINE = path.join(__dirname, "..");
var PAGES = path.join(RACINE, "pages");

var A_FAIRE = process.argv.indexOf("--a-faire") >= 0;
var DEJA = process.argv.indexOf("--deja") >= 0;

/* La table de E1, recopiee du plan. `alt` = le motif du CODE de l'alternative.
   Quand l'alternative ne se reconnait a aucun motif de code fiable (composition,
   choix de structure), `alt` vaut null : l'outil le dit au lieu de deviner. */
var LISTE = [
  { f: "js/lecon-23", quoi: "async/await, Promise.all", alt: /\basync\s+function|\bawait\s|Promise\.all/ },
  { f: "js/lecon-46", quoi: "await", alt: /\basync\s+function|\bawait\s/ },
  { f: "js/lecon-44", quoi: "generateur paresseux", alt: /function\s*\*|\byield\b/ },
  { f: "js/lecon-57", quoi: "traitement par flux", alt: /ReadableStream|pipeThrough|pipeTo|getReader\(/ },
  { f: "js/lecon-21", quoi: "composition", alt: null },
  { f: "algo/lecon-02", quoi: "iteratif, pile explicite", alt: /pile\.pop\(\)|pile\.push\(/ },
  { f: "algo/lecon-03", quoi: "binaire iterative", alt: /while\s*\([^)]*\b(?:lo|bas|gauche|debut|g)\b[^)]*<=?[^)]*\b(?:hi|haut|droite|fin|d)\b/ },
  { f: "algo/lecon-05", quoi: "fusion ascendante iterative", alt: null },
  { f: "algo/lecon-08", quoi: "liste chainee", alt: /\bsuivant\b|\bnext\b|maillon|noeud|node/i },
  { f: "algo/lecon-18", quoi: "pile explicite", alt: /pile\.pop\(\)|pile\.push\(/ },
  { f: "algo/lecon-25", quoi: "rotations iteratives, rouge-noir", alt: /rouge|noir|red.black/i },
  { f: "algo/lecon-12", quoi: "matrice d'adjacence", alt: /matrice/i },
  { f: "algo/lecon-19", quoi: "table de hachage", alt: /new Map\(|new Set\(|\{\}\s*;?\s*\/\/.*hach/i },
  { f: "python/lecon-06", quoi: "comprehension de liste", alt: /\[\s*[\w.()\[\]]+\s+for\s+\w+\s+in\s/ },
  { f: "python/lecon-27", quoi: "itertools", alt: /itertools|functools|accumulate|groupby/ },
  { f: "python/lecon-29", quoi: "fonction d'ordre superieur", alt: null },
  { f: "python/lecon-37", quoi: "reduce / accumulate", alt: /\breduce\(|accumulate\(/ },
  { f: "sql/lecon-09", quoi: "jointure, EXISTS, CTE", alt: /\bWITH\b[\s\S]{0,80}\bAS\s*\(|\bEXISTS\s*\(/i },
  { f: "bdd/lecon-10", quoi: "colonne denormalisee", alt: null },
  { f: "bdd/lecon-13", quoi: "verrou optimiste", alt: /optimiste|\bversion\b\s*=\s*version/i },
  { f: "data-eng/lecon-08", quoi: "MERGE / upsert", alt: /\bMERGE\b|\bUPSERT\b|ON CONFLICT/i },
  { f: "css/lecon-08", quoi: "grid qui garde le flux", alt: /grid-area:\s*1\s*\/\s*1/ },
  { f: "css/lecon-38", quoi: "ancrage CSS", alt: /anchor-name|position-anchor|anchor\(/ },
  { f: "css/lecon-45", quoi: "grid", alt: /display:\s*grid/ },
  { f: "nodejs/lecon-05", quoi: "await, Promise.all", alt: /\basync\s+function|\bawait\s|Promise\.all/ },
  { f: "nodejs/lecon-07", quoi: "flux", alt: /createReadStream|\.pipe\(|pipeline\(/ },
  { f: "patterns/lecon-04", quoi: "parcours iteratif", alt: /pile\.pop\(\)|pile\.push\(|stack\.pop\(/ },
  { f: "java/lecon-04", quoi: "for-each, Stream", alt: /for\s*\(\s*\w[\w<>\[\]]*\s+\w+\s*:\s*\w+\s*\)|\.stream\(\)/ },
  { f: "csharp/lecon-04", quoi: "foreach, LINQ", alt: /\bforeach\s*\(|\.Select\(|\.Where\(|using System\.Linq/ },
  { f: "bash/lecon-12", quoi: "find -exec / xargs -0", alt: /find\s[^\n]*-exec|xargs\s+-0/ },
];

/* Les blocs de code seuls : une alternative CITEE dans la prose n'est pas une
   alternative MONTREE. On garde le numero de ligne pour pouvoir aller verifier. */
function blocsDeCode(html) {
  var out = [];
  var re = /<code class="language-[\w-]+">([\s\S]*?)<\/code>/g;
  var m;
  while ((m = re.exec(html))) {
    var avant = html.slice(0, m.index).split("\n").length;
    out.push({ ligne: avant, code: decode(m[1]) });
  }
  return out;
}
function decode(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

var aDoter = [], aEcarter = [], aJuger = [], absents = [];

LISTE.forEach(function (e) {
  var chemin = path.join(PAGES, e.f + ".html");
  if (!fs.existsSync(chemin)) { absents.push(e); return; }
  var html = fs.readFileSync(chemin, "utf8");
  var blocs = blocsDeCode(html);
  if (e.alt === null) { e.blocs = blocs.length; aJuger.push(e); return; }
  var touches = blocs.filter(function (b) { return e.alt.test(b.code); });
  e.blocs = blocs.length;
  e.touches = touches.map(function (b) { return b.ligne; });
  (touches.length ? aEcarter : aDoter).push(e);
});

function tableau(titre, liste, detail) {
  if (!liste.length) return;
  console.log("\n" + titre);
  liste.forEach(function (e) {
    var l = "  " + e.f.padEnd(20) + e.quoi.padEnd(28);
    if (detail && e.touches && e.touches.length) {
      l += e.touches.length + " bloc(s) de code, ligne(s) " + e.touches.slice(0, 4).join(", ");
    } else if (e.alt === null) {
      l += "aucun motif de code fiable — a lire";
    } else {
      l += "aucun des " + e.blocs + " blocs de code";
    }
    console.log(l);
  });
}

console.log("verif-liste-alternatives.js — l'alternative prescrite est-elle DEJA dans la lecon ?");
console.log("  lecons de la liste E1 ................ " + LISTE.length);
console.log("  alternative deja montree en code ..... " + aEcarter.length + "  (a ecarter ou a revoir)");
console.log("  alternative absente .................. " + aDoter.length + "  (a doter)");
console.log("  sans motif de code fiable ............ " + aJuger.length + "  (a lire)");
if (absents.length) console.log("  FICHIERS ABSENTS ..................... " + absents.length);

if (!A_FAIRE) tableau("DEJA MONTREE — l'ecrire serait redondant :", aEcarter, true);
if (!DEJA) tableau("A DOTER — l'alternative n'apparait dans aucun bloc de code :", aDoter, false);
if (!A_FAIRE && !DEJA) tableau("A LIRE — pas de motif mecanique :", aJuger, false);
if (absents.length) tableau("ABSENTS :", absents, false);

console.log("\n  Rappel : un motif present est un INDICE, pas un verdict. Lire la lecon avant de trancher.");
process.exit(0);
