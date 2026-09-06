/* mesure-lexique-qcm — l'indice LEXICAL des QCM.
 *
 * Trouve par la vague de contradiction du cours `os` (B4 du CHANTIER-V16), le 2026-09-06 :
 * un apprenant qui ne comprend rien peut ouvrir la lecon, chercher au clavier les mots de
 * chaque option dans la page, et choisir celle dont TOUT le vocabulaire figure dans le cours.
 * La bonne reponse est ecrite avec les mots enseignes ; un distracteur invente est ecrit avec
 * des mots que la page ne contient pas. Aucune des 23 strategies de mesure-biais-qcm.js ne
 * voit cet indice : il ne porte ni sur la longueur, ni sur la ponctuation, ni sur la forme.
 *
 * MESURE FONDATRICE, cours `os`, le 2026-09-06 : la vague d'ecriture de B4 FABRIQUE l'indice.
 * Avant la vague, rendement de la variante STRICTE 38,1 % ; apres, 100,0 %. En allongeant les
 * distracteurs avec du vocabulaire invente, on rend la bonne reponse trouvable au Ctrl+F.
 *
 * Deux variantes :
 *   STRICTE     : la seule option dont aucun mot n'est etranger a la page.
 *   PROPORTION  : l'option dont la part de mots presents dans la page est la plus forte.
 *
 * usage : node tools/mesure-lexique-qcm.js [--seul=<cours>] [--racine=<dir>] [--json]
 *         node tools/mesure-lexique-qcm.js --liste=<cours>   (mots etrangers, option par option)
 */
"use strict";
var fs = require("fs"), path = require("path");

var argv = process.argv.slice(2);
function opt(nom) {
  var a = argv.find(function (x) { return x.indexOf("--" + nom + "=") === 0; });
  return a ? a.slice(nom.length + 3) : "";
}
var racine = opt("racine");
var PAGES = racine ? path.join(racine, "pages") : path.join(__dirname, "..", "pages");
var seul = opt("seul"), liste = opt("liste");

/* les mots « de contenu » : 6 lettres et plus, accents compris */
function mots(t) {
  var m = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return m.map(function (w) { return w.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}

/* le texte de la page tel que l'apprenant peut le fouiller, blocs de quiz EXCLUS */
function texteDeLaPage(src) {
  return src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ");
}

var RE_QUIZ = /<script[^>]*data-quiz(?:-bilan)?[^>]*>([\s\S]*?)<\/script>/g;

function questionsDe(src) {
  var out = [], m, re = new RegExp(RE_QUIZ.source, "g");
  while ((m = re.exec(src))) {
    var qs;
    try { qs = JSON.parse(m[1]); } catch (e) { continue; }
    if (Array.isArray(qs)) qs.forEach(function (q) {
      if (q && Array.isArray(q.a) && typeof q.correct === "number") out.push(q);
    });
  }
  return out;
}

function argMax(scores) {
  var mx = Math.max.apply(null, scores), out = [];
  scores.forEach(function (v, i) { if (v === mx) out.push(i); });
  return out;
}

/* ---- mode --liste : ce qu'il faut reecrire, mot par mot ---- */
if (liste) {
  var d = path.join(PAGES, liste), tot = 0, sales = 0, motsSales = 0, exploitables = 0;
  console.log("\nmots ETRANGERS a la page, option par option — cours " + liste);
  console.log("  objectif : ZERO mot etranger dans les quatre options de chaque question.\n");
  fs.readdirSync(d).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort().forEach(function (f) {
    var src = fs.readFileSync(path.join(d, f), "utf8");
    var page = new Set(mots(texteDeLaPage(src)));
    var nq = 0;
    questionsDe(src).forEach(function (q) {
      nq++; tot++;
      var sortie = [], sale = false, nAbs = [], part = [];
      q.a.forEach(function (o, i) {
        var w = mots(o), abs = w.filter(function (x) { return !page.has(x); });
        nAbs.push(abs.length);
        part.push(w.length ? (w.length - abs.length) / w.length : 1);
        if (abs.length) {
          sale = true; motsSales += abs.length;
          sortie.push("      opt" + i + (i === q.correct ? " (BONNE) " : "         ") + abs.join(", "));
        }
      });
      var zeros = nAbs.filter(function (v) { return v === 0; }).length;
      var expS = zeros === 1 && nAbs[q.correct] === 0;
      var expP = argMax(part).length === 1 && argMax(part)[0] === q.correct;
      if (expS || expP) {
        exploitables++;
        console.log("  " + f + " q" + nq + "  " + (expS ? "[STRICTE] " : "") + (expP ? "[PROPORTION] " : "") +
                    String(q.q).slice(0, 52));
        console.log("      la BONNE reponse est en tete : " + nAbs[q.correct] + " mot(s) etranger(s) contre " +
                    nAbs.filter(function (v, i) { return i !== q.correct; }).join(" / ") +
                    " — NETTOIE UN DISTRACTEUR jusqu'a l'egaler");
        sortie.forEach(function (l) { console.log(l); });
      }
      if (sale) sales++;
    });
  });
  console.log("\n  " + exploitables + " questions EXPLOITABLES sur " + tot + " ; " + sales +
              " portent au moins un mot etranger (" + motsSales + " mots).");
  console.log("  Objectif : 0 question exploitable. Il suffit qu'UN distracteur par question");
  console.log("  ait AUTANT DE MOTS DU COURS que la bonne reponse — pas de tout reecrire.\n");
  process.exit(0);
}

/* ---- mode mesure ---- */
var cours = fs.readdirSync(PAGES).filter(function (d) {
  return fs.statSync(path.join(PAGES, d)).isDirectory() &&
         fs.existsSync(path.join(PAGES, d, "cours.html"));
}).sort();
if (seul) cours = cours.filter(function (c) { return c === seul; });

var glob = { n: 0, sTr: 0, sOk: 0, pTr: 0, pOk: 0 };
var lignes = [];

cours.forEach(function (c) {
  var dir = path.join(PAGES, c);
  var st = { n: 0, sTr: 0, sOk: 0, pTr: 0, pOk: 0 };
  fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).forEach(function (f) {
    var src = fs.readFileSync(path.join(dir, f), "utf8");
    var page = new Set(mots(texteDeLaPage(src)));
    questionsDe(src).forEach(function (q) {
      st.n++;
      var etrangers = [], parts = [];
      q.a.forEach(function (o) {
        var w = mots(o), abs = w.filter(function (x) { return !page.has(x); });
        etrangers.push(abs.length);
        parts.push(w.length ? (w.length - abs.length) / w.length : 1);
      });
      var zeros = [];
      etrangers.forEach(function (v, i) { if (v === 0) zeros.push(i); });
      if (zeros.length === 1) { st.sTr++; if (zeros[0] === q.correct) st.sOk++; }
      var top = argMax(parts);
      if (top.length === 1) { st.pTr++; if (top[0] === q.correct) st.pOk++; }
    });
  });
  if (!st.n) return;
  ["n", "sTr", "sOk", "pTr", "pOk"].forEach(function (k) { glob[k] += st[k]; });
  lignes.push({ c: c, st: st });
});

if (argv.indexOf("--json") !== -1) {
  var out = { global: glob, cours: {} };
  lignes.forEach(function (x) {
    out.cours[x.c] = {
      questions: x.st.n,
      stricteCouverture: x.st.n ? +(x.st.sTr / x.st.n).toFixed(4) : 0,
      stricteRendement: x.st.sTr ? +(x.st.sOk / x.st.sTr).toFixed(4) : 0,
      proportionCouverture: x.st.n ? +(x.st.pTr / x.st.n).toFixed(4) : 0,
      proportionRendement: x.st.pTr ? +(x.st.pOk / x.st.pTr).toFixed(4) : 0
    };
  });
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

function pc(a, b) { return b ? (100 * a / b).toFixed(1) + " %" : "—"; }

console.log("\nmesure-lexique-qcm — l'apprenant qui cherche les mots de l'option DANS la page");
console.log("  etalon du hasard : 25,0 %\n");
console.log("    cours            questions   STRICTE : couv./rend.      PROPORTION : couv./rend.");
lignes.sort(function (a, b) {
  return (b.st.sTr ? b.st.sOk / b.st.sTr : 0) - (a.st.sTr ? a.st.sOk / a.st.sTr : 0);
}).forEach(function (x) {
  var s = x.st;
  console.log("    " + x.c.padEnd(16) + String(s.n).padStart(6) +
    "     " + pc(s.sTr, s.n).padStart(7) + " / " + pc(s.sOk, s.sTr).padStart(7) +
    "       " + pc(s.pTr, s.n).padStart(7) + " / " + pc(s.pOk, s.pTr).padStart(7));
});
console.log("\n  ENSEMBLE : " + glob.n + " questions");
console.log("    STRICTE    : tranche sur " + pc(glob.sTr, glob.n) + " des questions, rendement " + pc(glob.sOk, glob.sTr) +
            "  (reussite globale " + pc(glob.sOk + 0.25 * (glob.n - glob.sTr), glob.n) + ")");
console.log("    PROPORTION : tranche sur " + pc(glob.pTr, glob.n) + " des questions, rendement " + pc(glob.pOk, glob.pTr) +
            "  (reussite globale " + pc(glob.pOk + 0.25 * (glob.n - glob.pTr), glob.n) + ")");
console.log("\n  Lecture : « rendement » = reussite SUR LES SEULES questions ou la strategie tranche.");
console.log("  Cet indice est en partie LEGITIME (une bonne reponse est ecrite avec les mots du");
console.log("  cours) — mais il est exploitable SANS RIEN COMPRENDRE, au seul Ctrl+F. Le fermer");
console.log("  se fait en ecrivant les distracteurs avec le vocabulaire de la lecon, et non avec");
console.log("  des termes inventes.\n");
