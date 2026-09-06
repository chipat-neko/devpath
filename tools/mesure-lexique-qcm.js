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
 * TROIS variantes :
 *   STRICTE     : la seule option dont aucun mot n'est etranger a la page.
 *   PROPORTION  : l'option dont la part de mots presents dans la page est la plus forte.
 *   INVERSE     : l'option qui porte le PLUS de mots etrangers.
 *
 * POURQUOI LA VARIANTE INVERSE EXISTE — cours `mobile`, le 2026-09-06, quelques heures apres
 * la creation de cet outil. La premiere consigne disait « ZERO mot etranger dans les quatre
 * options ». Les six lots l'ont tenue : STRICTE et PROPORTION sont tombees de 100,0 % et
 * 88,4 % a « ne tranche plus du tout » (0,0 % de couverture). Et le cours restait devinable
 * a 100 % : la bonne reponse etant INTOUCHABLE, ses mots etrangers a elle sont restes pendant
 * que les 219 distracteurs passaient a zero. L'apprenant n'avait plus qu'a retourner la regle
 * — « choisis l'option qui contient un mot ABSENT de la page » — pour avoir juste 37 fois sur
 * 37. LA CORRECTION AVAIT FABRIQUE L'INDICE INVERSE, et le cliquet verif-qcm-lexique.js etait
 * VERT parce qu'il ne mesurait que les deux premieres variantes.
 *
 * D'OU LA REGLE D'ECRITURE, qui ferme les TROIS d'un coup et se verifie mecaniquement :
 *   soit k = le nombre de mots etrangers de la BONNE reponse (intouchable).
 *   - si k = 0 : les trois distracteurs a ZERO mot etranger.
 *   - si k > 0 : DEUX distracteurs a ZERO, et le TROISIEME a EXACTEMENT k.
 *   Alors STRICTE voit deux zeros (elle exige un seul), PROPORTION voit deux parts a 1,0
 *   ex aequo, et INVERSE voit deux maxima ex aequo : aucune des trois ne tranche.
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
  var d = path.join(PAGES, liste), tot = 0, exploitables = 0, aFaire = 0;
  console.log("\nmots ETRANGERS a la page, option par option — cours " + liste);
  console.log("  REGLE : soit k le nombre de mots etrangers de la BONNE reponse (intouchable).");
  console.log("    k = 0  ->  les TROIS distracteurs a ZERO mot etranger.");
  console.log("    k > 0  ->  DEUX distracteurs a ZERO, et le TROISIEME a EXACTEMENT k.");
  console.log("  Mettre les trois a zero quand k > 0 ne ferme rien : ca RETOURNE l'indice");
  console.log("  (variante INVERSE, 100 % sur `mobile` le 2026-09-06). Voir l'entete.\n");
  fs.readdirSync(d).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort().forEach(function (f) {
    var src = fs.readFileSync(path.join(d, f), "utf8");
    var page = new Set(mots(texteDeLaPage(src)));
    var nq = 0;
    questionsDe(src).forEach(function (q) {
      nq++; tot++;
      var sortie = [], nAbs = [], part = [];
      q.a.forEach(function (o, i) {
        var w = mots(o), abs = w.filter(function (x) { return !page.has(x); });
        nAbs.push(abs.length);
        part.push(w.length ? (w.length - abs.length) / w.length : 1);
        sortie.push("      opt" + i + (i === q.correct ? " (BONNE) " : "         ") +
                    abs.length + " etranger(s)" + (abs.length ? " : " + abs.join(", ") : ""));
      });
      var zeros = nAbs.filter(function (v) { return v === 0; }).length;
      var expS = zeros === 1 && nAbs[q.correct] === 0;
      var expP = argMax(part).length === 1 && argMax(part)[0] === q.correct;
      var pire = argMax(nAbs);
      var expI = pire.length === 1 && pire[0] === q.correct;

      /* CONFORME = la forme des distracteurs suit la regle du k */
      var k = nAbs[q.correct];
      var dist = nAbs.filter(function (v, i) { return i !== q.correct; })
                     .sort(function (x, y) { return x - y; });
      var conforme = k === 0
        ? (dist[0] === 0 && dist[1] === 0 && dist[2] === 0)
        : (dist[0] === 0 && dist[1] === 0 && dist[2] === k);

      if (expS || expP || expI) exploitables++;
      if (conforme) return;
      aFaire++;
      var etiq = (expS ? "[STRICTE] " : "") + (expP ? "[PROPORTION] " : "") + (expI ? "[INVERSE] " : "");
      console.log("  " + f + " q" + nq + "  " + etiq + String(q.q).slice(0, 52));
      console.log("      k = " + k + "  ->  distracteurs vises : " +
                  (k === 0 ? "0 / 0 / 0" : "0 / 0 / " + k) +
                  "   (aujourd'hui " + dist.join(" / ") + ")");
      sortie.forEach(function (l) { console.log(l); });
    });
  });
  console.log("\n  " + exploitables + " questions EXPLOITABLES sur " + tot +
              " ; " + aFaire + " questions a mettre en forme.");
  console.log("  Objectif : 0 exploitable ET 0 a mettre en forme — les deux, sinon l'indice");
  console.log("  se contente de changer de sens.\n");
  process.exit(0);
}

/* ---- mode mesure ---- */
var cours = fs.readdirSync(PAGES).filter(function (d) {
  return fs.statSync(path.join(PAGES, d)).isDirectory() &&
         fs.existsSync(path.join(PAGES, d, "cours.html"));
}).sort();
if (seul) cours = cours.filter(function (c) { return c === seul; });

var glob = { n: 0, sTr: 0, sOk: 0, pTr: 0, pOk: 0, iTr: 0, iOk: 0 };
var lignes = [];

cours.forEach(function (c) {
  var dir = path.join(PAGES, c);
  var st = { n: 0, sTr: 0, sOk: 0, pTr: 0, pOk: 0, iTr: 0, iOk: 0 };
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
      var pire = argMax(etrangers);
      if (pire.length === 1) { st.iTr++; if (pire[0] === q.correct) st.iOk++; }
    });
  });
  if (!st.n) return;
  ["n", "sTr", "sOk", "pTr", "pOk", "iTr", "iOk"].forEach(function (k) { glob[k] += st[k]; });
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
      proportionRendement: x.st.pTr ? +(x.st.pOk / x.st.pTr).toFixed(4) : 0,
      inverseCouverture: x.st.n ? +(x.st.iTr / x.st.n).toFixed(4) : 0,
      inverseRendement: x.st.iTr ? +(x.st.iOk / x.st.iTr).toFixed(4) : 0
    };
  });
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

function pc(a, b) { return b ? (100 * a / b).toFixed(1) + " %" : "—"; }

console.log("\nmesure-lexique-qcm — l'apprenant qui cherche les mots de l'option DANS la page");
console.log("  etalon du hasard : 25,0 %\n");
console.log("    cours          quest.  STRICTE : couv./rend.   PROPORTION : couv./rend.   INVERSE : couv./rend.");
lignes.sort(function (a, b) {
  return (b.st.sTr ? b.st.sOk / b.st.sTr : 0) - (a.st.sTr ? a.st.sOk / a.st.sTr : 0);
}).forEach(function (x) {
  var s = x.st;
  console.log("    " + x.c.padEnd(14) + String(s.n).padStart(5) +
    "    " + pc(s.sTr, s.n).padStart(7) + " / " + pc(s.sOk, s.sTr).padStart(7) +
    "     " + pc(s.pTr, s.n).padStart(7) + " / " + pc(s.pOk, s.pTr).padStart(7) +
    "     " + pc(s.iTr, s.n).padStart(7) + " / " + pc(s.iOk, s.iTr).padStart(7));
});
console.log("\n  ENSEMBLE : " + glob.n + " questions");
console.log("    STRICTE    : tranche sur " + pc(glob.sTr, glob.n) + " des questions, rendement " + pc(glob.sOk, glob.sTr) +
            "  (reussite globale " + pc(glob.sOk + 0.25 * (glob.n - glob.sTr), glob.n) + ")");
console.log("    PROPORTION : tranche sur " + pc(glob.pTr, glob.n) + " des questions, rendement " + pc(glob.pOk, glob.pTr) +
            "  (reussite globale " + pc(glob.pOk + 0.25 * (glob.n - glob.pTr), glob.n) + ")");
console.log("    INVERSE    : tranche sur " + pc(glob.iTr, glob.n) + " des questions, rendement " + pc(glob.iOk, glob.iTr) +
            "  (reussite globale " + pc(glob.iOk + 0.25 * (glob.n - glob.iTr), glob.n) + ")");
console.log("\n  Lecture : « rendement » = reussite SUR LES SEULES questions ou la strategie tranche.");
console.log("  Cet indice est en partie LEGITIME (une bonne reponse est ecrite avec les mots du");
console.log("  cours) — mais il est exploitable SANS RIEN COMPRENDRE, au seul Ctrl+F. Le fermer");
console.log("  se fait en ecrivant les distracteurs avec le vocabulaire de la lecon, et non avec");
console.log("  des termes inventes — MAIS PAS JUSQU'A ZERO PARTOUT : la bonne reponse etant");
console.log("  intouchable, mettre les trois distracteurs a zero la designe par ses propres");
console.log("  mots etrangers, et c'est la variante INVERSE qui prend le relais a 100 %.");
console.log("  Regle : si la bonne reponse porte k mots etrangers, DEUX distracteurs a zero");
console.log("  et UN a exactement k.\n");
