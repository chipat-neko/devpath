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
 * ⚠️ ET DEUX LECTURES DE CHACUNE, depuis le 2026-09-07 (dette 1 du cours `php`) :
 *   DESIGNATION UNIQUE : la strategie ne compte que si elle designe UNE SEULE option.
 *   RESTREINDRE (credit 1/n) : la strategie designe un ENSEMBLE de n options sur 4 ;
 *     l'apprenant y tire au sort, donc elle vaut 1/n quand la bonne reponse est dedans
 *     et 0 sinon. Elle « tranche » des que n < 4.
 *
 * POURQUOI LA SECONDE EXISTE — cours `php`, le 2026-09-07. Le cours venait d'etre
 * detordu selon la regle du k ci-dessous ; `--liste=php` affichait « 0 exploitable,
 * 0 a mettre en forme » et le cliquet etait VERT. Mesure faite a la main pendant la
 * vague : l'apprenant qui ECARTE les options dont tout le vocabulaire figure deja dans
 * la page passe de 4 options a 2, tranche sur 62,8 % des questions et REUSSIT 43,2 %.
 * Une egalite a deux vaut 50 % pour l'apprenant et 0 pour un outil qui exige l'unicite :
 * c'est la lecon « RESTREINDRE » du cours `data-eng`, transposee au lexique.
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
 * D'OU LA REGLE D'ECRITURE. ⚠️ ELLE A CHANGE LE 2026-09-07, et l'ancienne est laissee
 * ici parce qu'elle explique 3 cours du site :
 *   ANCIENNE (0 / 0 / k) : si k = 0, les trois distracteurs a ZERO ; si k > 0, DEUX
 *   distracteurs a ZERO et le TROISIEME a EXACTEMENT k. Elle ferme les trois variantes
 *   EN DESIGNATION UNIQUE — et elle laisse EXACTEMENT 50 % en RESTREINDRE quand k > 0 :
 *   l'ensemble {bonne reponse, distracteur a k} a deux elements, et la bonne est dedans.
 *   NOUVELLE (k / k / k / k) : les QUATRE options portent le MEME nombre de mots
 *   etrangers. Alors STRICTE ne designe rien ou les quatre, PROPORTION et INVERSE
 *   designent les quatre : aucune ne restreint, dans aucune des deux lectures.
 *   C'est « les quatre ou aucune » de `data-eng`, transposee au lexique.
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

/* RESTREINDRE : la strategie designe l'ENSEMBLE `ens` (indices d'options).
   Elle « tranche » des qu'elle restreint vraiment, c'est-a-dire des que
   1 <= |ens| < nombre d'options. L'apprenant tire alors au sort DANS cet
   ensemble : il vaut 1/|ens| si la bonne reponse y figure, 0 sinon.
   Une egalite a deux vaut donc 50 % — pas 0, comme le comptait la lecture
   par designation unique jusqu'au 2026-09-07. */
function credit(ens, correct, nbOptions) {
  if (!ens.length || ens.length >= nbOptions) return null;   /* ne restreint rien */
  return ens.indexOf(correct) !== -1 ? 1 / ens.length : 0;
}

/* ---- mode --liste : ce qu'il faut reecrire, mot par mot ---- */
if (liste) {
  var d = path.join(PAGES, liste), tot = 0, exploitables = 0, aFaire = 0;
  console.log("\nmots ETRANGERS a la page, option par option — cours " + liste);
  console.log("  REGLE (revisee le 2026-09-07) : soit k le nombre de mots etrangers de la");
  console.log("  BONNE reponse (intouchable). LES TROIS DISTRACTEURS EN PORTENT EXACTEMENT k.");
  console.log("    k = 0  ->  0 / 0 / 0     k > 0  ->  k / k / k");
  console.log("  Mettre les trois a zero quand k > 0 RETOURNE l'indice (variante INVERSE,");
  console.log("  100 % sur `mobile` le 2026-09-06). Et l'ancienne regle 0 / 0 / k, elle,");
  console.log("  laisse 50 % a qui RESTREINT son tirage aux deux options les plus etrangeres.");
  console.log("  Seule l'egalite des quatre ferme les deux lectures. Voir l'entete.\n");
  fs.readdirSync(d).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort().forEach(function (f) {
    var src = fs.readFileSync(path.join(d, f), "utf8");
    var page = new Set(mots(texteDeLaPage(src)));
    var nq = 0;
    questionsDe(src).forEach(function (q) {
      nq++; tot++;
      var sortie = [], nAbs = [], part = [], nMots = [];
      q.a.forEach(function (o, i) {
        var w = mots(o), abs = w.filter(function (x) { return !page.has(x); });
        nAbs.push(abs.length);
        nMots.push(w.length);
        part.push(w.length ? (w.length - abs.length) / w.length : 1);
        sortie.push("      opt" + i + (i === q.correct ? " (BONNE) " : "         ") +
                    abs.length + " etranger(s) / " + w.length + " mot(s) long(s)" +
                    (abs.length ? " : " + abs.join(", ") : ""));
      });
      var zeros_ = [];
      nAbs.forEach(function (v, i) { if (v === 0) zeros_.push(i); });
      var zeros = zeros_.length;
      var expS = zeros === 1 && nAbs[q.correct] === 0;
      var expP = argMax(part).length === 1 && argMax(part)[0] === q.correct;
      var pire = argMax(nAbs);
      var expI = pire.length === 1 && pire[0] === q.correct;

      /* CONFORME = la forme des distracteurs suit la regle du k ET celle du w.
         ⚠️ La regle du k SEULE ne ferme PAS la variante PROPORTION, et c'est
         arithmetique : a k egal, la part de mots presents (w - k) / w CROIT avec w.
         Donc si la bonne reponse porte a elle seule le plus de mots longs, elle
         reste designee — avec des k parfaitement egaux. Trouve le 2026-09-07 par
         trois ecrivains du cours `ocaml`, independamment, alors que cet outil
         affichait « 0 question a mettre en forme » et comptait 3 exploitables
         SANS LES LISTER (le meme defaut que `plan-rangs-qcm --marques` avait la
         veille : compter sans nommer laisse le travail invisible).
         REGLE DU w : ou les quatre options portent le meme nombre de mots longs,
         ou au moins un distracteur en porte STRICTEMENT PLUS que la bonne reponse.
         (Sans objet quand k = 0 : toutes les parts valent alors 1.) */
      var k = nAbs[q.correct];
      var dist = nAbs.filter(function (v, i) { return i !== q.correct; })
                     .sort(function (x, y) { return x - y; });
      var kEgaux = dist[0] === k && dist[1] === k && dist[2] === k;
      var wc = nMots[q.correct], wSup = 0, wEgaux = 0;
      nMots.forEach(function (v, i) {
        if (i === q.correct) return;
        if (v > wc) wSup++; else if (v === wc) wEgaux++;
      });
      var wOK = k === 0 || wSup > 0 || wEgaux === nMots.length - 1;
      var conforme = kEgaux && wOK;

      /* EXPLOITABLE : l'une des trois variantes designe la bonne reponse seule,
         OU la RESTREINT a un ensemble strictement plus petit que les 4 options
         (credit 1/n) — c'est la lecture ajoutee le 2026-09-07. */
      var nOpt = q.a.length;
      var cS = credit(zeros_, q.correct, nOpt);
      var cP = credit(argMax(part), q.correct, nOpt);
      var cI = credit(pire, q.correct, nOpt);
      var expR = (cS !== null && cS > 0.25) || (cP !== null && cP > 0.25) || (cI !== null && cI > 0.25);

      var exploitable = expS || expP || expI || expR;
      if (exploitable) exploitables++;
      if (conforme && !exploitable) return;
      aFaire++;
      var etiq = (expS ? "[STRICTE] " : "") + (expP ? "[PROPORTION] " : "") + (expI ? "[INVERSE] " : "") +
                 (expR ? "[RESTREINT] " : "");
      console.log("  " + f + " q" + nq + "  " + etiq + String(q.q).slice(0, 52));
      console.log("      k = " + k + "  ->  distracteurs vises : " + k + " / " + k + " / " + k +
                  "   (aujourd'hui " + dist.join(" / ") + ")" + (kEgaux ? "  [k DEJA TENU]" : ""));
      if (!wOK) {
        console.log("      w = " + wc + " mots longs pour la BONNE reponse, la plus fournie a elle seule" +
                    "  ->  un distracteur doit en porter " + (wc + 1) + " ou plus, ou les quatre " + wc +
                    "  (regle du w : c'est ELLE qui ferme PROPORTION, pas le k)");
      }
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

var glob = { n: 0, sTr: 0, sOk: 0, pTr: 0, pOk: 0, iTr: 0, iOk: 0,
             sRt: 0, sRc: 0, pRt: 0, pRc: 0, iRt: 0, iRc: 0 };
var lignes = [];

cours.forEach(function (c) {
  var dir = path.join(PAGES, c);
  var st = { n: 0, sTr: 0, sOk: 0, pTr: 0, pOk: 0, iTr: 0, iOk: 0,
             sRt: 0, sRc: 0, pRt: 0, pRc: 0, iRt: 0, iRc: 0 };
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
      var top = argMax(parts);
      var pire = argMax(etrangers);
      /* lecture 1 — DESIGNATION UNIQUE (historique) */
      if (zeros.length === 1) { st.sTr++; if (zeros[0] === q.correct) st.sOk++; }
      if (top.length === 1) { st.pTr++; if (top[0] === q.correct) st.pOk++; }
      if (pire.length === 1) { st.iTr++; if (pire[0] === q.correct) st.iOk++; }
      /* lecture 2 — RESTREINDRE, credit 1/n sur les egalites */
      var nOpt = q.a.length;
      var cS = credit(zeros, q.correct, nOpt);
      if (cS !== null) { st.sRt++; st.sRc += cS; }
      var cP = credit(top, q.correct, nOpt);
      if (cP !== null) { st.pRt++; st.pRc += cP; }
      var cI = credit(pire, q.correct, nOpt);
      if (cI !== null) { st.iRt++; st.iRc += cI; }
    });
  });
  if (!st.n) return;
  Object.keys(st).forEach(function (k) { glob[k] += st[k]; });
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
      inverseRendement: x.st.iTr ? +(x.st.iOk / x.st.iTr).toFixed(4) : 0,
      /* lecture RESTREINDRE (credit 1/n) — ajoutee le 2026-09-07 */
      stricteRestreintCouverture: x.st.n ? +(x.st.sRt / x.st.n).toFixed(4) : 0,
      stricteRestreintRendement: x.st.sRt ? +(x.st.sRc / x.st.sRt).toFixed(4) : 0,
      proportionRestreintCouverture: x.st.n ? +(x.st.pRt / x.st.n).toFixed(4) : 0,
      proportionRestreintRendement: x.st.pRt ? +(x.st.pRc / x.st.pRt).toFixed(4) : 0,
      inverseRestreintCouverture: x.st.n ? +(x.st.iRt / x.st.n).toFixed(4) : 0,
      inverseRestreintRendement: x.st.iRt ? +(x.st.iRc / x.st.iRt).toFixed(4) : 0
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
console.log("\n  --- lecture RESTREINDRE (credit 1/n : une egalite a deux vaut 50 %) ---");
console.log("    cours          quest.  STRICTE : couv./rend.   PROPORTION : couv./rend.   INVERSE : couv./rend.");
lignes.slice().sort(function (a, b) {
  var ra = Math.max(a.st.sRt ? a.st.sRc / a.st.sRt : 0, a.st.iRt ? a.st.iRc / a.st.iRt : 0);
  var rb = Math.max(b.st.sRt ? b.st.sRc / b.st.sRt : 0, b.st.iRt ? b.st.iRc / b.st.iRt : 0);
  return rb - ra;
}).forEach(function (x) {
  var s = x.st;
  console.log("    " + x.c.padEnd(14) + String(s.n).padStart(5) +
    "    " + pc(s.sRt, s.n).padStart(7) + " / " + pc(s.sRc, s.sRt).padStart(7) +
    "     " + pc(s.pRt, s.n).padStart(7) + " / " + pc(s.pRc, s.pRt).padStart(7) +
    "     " + pc(s.iRt, s.n).padStart(7) + " / " + pc(s.iRc, s.iRt).padStart(7));
});

console.log("\n  ENSEMBLE : " + glob.n + " questions");
console.log("    STRICTE    : tranche sur " + pc(glob.sTr, glob.n) + " des questions, rendement " + pc(glob.sOk, glob.sTr) +
            "  (reussite globale " + pc(glob.sOk + 0.25 * (glob.n - glob.sTr), glob.n) + ")");
console.log("    PROPORTION : tranche sur " + pc(glob.pTr, glob.n) + " des questions, rendement " + pc(glob.pOk, glob.pTr) +
            "  (reussite globale " + pc(glob.pOk + 0.25 * (glob.n - glob.pTr), glob.n) + ")");
console.log("    INVERSE    : tranche sur " + pc(glob.iTr, glob.n) + " des questions, rendement " + pc(glob.iOk, glob.iTr) +
            "  (reussite globale " + pc(glob.iOk + 0.25 * (glob.n - glob.iTr), glob.n) + ")");
console.log("    --- credit 1/n ---");
console.log("    STRICTE    : restreint sur " + pc(glob.sRt, glob.n) + " des questions, rendement " + pc(glob.sRc, glob.sRt) +
            "  (reussite globale " + pc(glob.sRc + 0.25 * (glob.n - glob.sRt), glob.n) + ")");
console.log("    PROPORTION : restreint sur " + pc(glob.pRt, glob.n) + " des questions, rendement " + pc(glob.pRc, glob.pRt) +
            "  (reussite globale " + pc(glob.pRc + 0.25 * (glob.n - glob.pRt), glob.n) + ")");
console.log("    INVERSE    : restreint sur " + pc(glob.iRt, glob.n) + " des questions, rendement " + pc(glob.iRc, glob.iRt) +
            "  (reussite globale " + pc(glob.iRc + 0.25 * (glob.n - glob.iRt), glob.n) + ")");
console.log("\n  Lecture : « rendement » = reussite SUR LES SEULES questions ou la strategie tranche.");
console.log("  Cet indice est en partie LEGITIME (une bonne reponse est ecrite avec les mots du");
console.log("  cours) — mais il est exploitable SANS RIEN COMPRENDRE, au seul Ctrl+F. Le fermer");
console.log("  se fait en ecrivant les distracteurs avec le vocabulaire de la lecon, et non avec");
console.log("  des termes inventes — MAIS PAS JUSQU'A ZERO PARTOUT : la bonne reponse etant");
console.log("  intouchable, mettre les trois distracteurs a zero la designe par ses propres");
console.log("  mots etrangers, et c'est la variante INVERSE qui prend le relais a 100 %.");
console.log("  REGLE (revisee le 2026-09-07) : les QUATRE options portent le MEME nombre de");
console.log("  mots etrangers — k / k / k / k. L'ancienne regle 0 / 0 / k fermait bien les trois");
console.log("  variantes en DESIGNATION UNIQUE, mais elle laisse EXACTEMENT 50 % en RESTREINDRE");
console.log("  quand k > 0 : l'ensemble {bonne reponse, distracteur a k} a deux elements.\n");
