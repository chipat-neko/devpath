/* mesure-mot-fetiche.js — le MOT FETICHE des QCM.
 *
 * TROUVE LE 2026-09-10, par une relecture adversariale du cours `swift` (B4 du
 * CHANTIER-V16). Un relecteur charge de demolir son lot a compte a la main : le mot
 * « compilateur » figurait dans 17 distracteurs sur 45 et dans UNE bonne reponse sur 15.
 * Un apprenant qui ne comprend rien, mais qui ECARTE toute option portant ce mot,
 * reussissait 43,3 % de son lot -- et 100 % sur trois questions ou les trois
 * distracteurs le portaient et la bonne reponse non.
 *
 * AUCUN DES 43 OUTILS DU PROTOCOLE NE LE VOYAIT, et la raison est structurelle :
 *   - `mesure-biais-qcm` mesure la FORME (longueur, ponctuation, marques, echo) ;
 *   - `mesure-lexique-qcm` compare le vocabulaire des options a celui de la PAGE ;
 *   - aucun ne compare le vocabulaire des options ENTRE ELLES, d'une question a l'autre.
 * C'est pourtant la vague d'ecriture qui le FABRIQUE : la regle du `k` demande aux
 * ecrivains de puiser dans le vocabulaire de la page, et six agents qui ecrivent le meme
 * jour, sur le meme cours, avec la meme consigne, convergent vers les memes mots-outils.
 *
 * ⚠ REMESURER SUR LE CORPUS ENTIER, JAMAIS SUR UN LOT. Le meme mot mesure 43,3 % sur les
 * 15 questions d'un lot et 33,5 % sur les 66 du cours : c'est la lecon du cours `react`
 * -- un indice de LOT vaut 100 % sur le lot et 25 % sur le site.
 *
 * LES DEUX LECTURES, comme partout dans ce protocole :
 *   ECARTER      : l'apprenant elimine les options qui portent le mot et tire parmi les autres.
 *   RESTREINDRE  : il tire parmi les seules options qui le portent.
 * Chacune vaut 1/n quand la bonne reponse est dans l'ensemble retenu, 0 sinon ; la colonne
 * rendue est GLOBALE (hasard a 25 % sur les questions que le mot ne tranche pas), donc
 * directement comparable a l'etalon de 25,0 %.
 *
 * LA REGLE D'ECRITURE QUI FERME L'INDICE est celle des marques et du `k` : par mot,
 * les quatre options le portent, ou aucune. ⚠ Quand c'est la BONNE reponse qui porte le
 * mot (elle est intouchable), on l'AJOUTE aux distracteurs -- le retirer d'eux laisserait
 * la bonne reponse seule a le porter et RETOURNERAIT l'indice a 100 %.
 *
 * Usage :
 *   node tools/mesure-mot-fetiche.js <cours> [minimum d occurrences]
 *   node tools/mesure-mot-fetiche.js --tous [minimum]   # le pire mot de chaque cours
 */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..");

var arg = process.argv[2] || "swift";
var TOUS = arg === "--tous";
var mini = Number(process.argv[3] || 6);
var SEUIL = 0.28;          /* au-dela, la lecture est exploitable */
var FENETRE = 8;           /* en deca, la mesure porte sur trop peu de questions */

function questionsDe(cours) {
  var dossier = path.join(RACINE, "pages", cours), out = [];
  if (!fs.existsSync(dossier)) return out;
  fs.readdirSync(dossier).sort().forEach(function (f) {
    if (!/\.html$/.test(f)) return;
    var src = fs.readFileSync(path.join(dossier, f), "utf8");
    var rx = /<script type="application\/json" data-quiz(?:-bilan)?>([\s\S]*?)<\/script>/g, x;
    while ((x = rx.exec(src))) {
      try {
        JSON.parse(x[1]).forEach(function (q) {
          if (q && Array.isArray(q.a) && q.a.length === 4) out.push(q);
        });
      } catch (e) { /* un bloc JSON invalide est signale par verif-donnees, pas ici */ }
    }
  });
  return out;
}

function mots(t) {
  return new Set(String(t).toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{4,}/g) || []);
}

function classer(questions) {
  var vus = new Map();
  questions.forEach(function (q) {
    q.a.forEach(function (t) { mots(t).forEach(function (m) { vus.set(m, (vus.get(m) || 0) + 1); }); });
  });
  var lignes = [];
  vus.forEach(function (n, mot) {
    if (n < mini) return;
    var ecarter = 0, restreindre = 0, tranche = 0, bonne = 0, distr = 0;
    questions.forEach(function (q) {
      var porte = q.a.map(function (t) { return mots(t).has(mot); });
      var nb = porte.filter(Boolean).length;
      if (porte[q.correct]) bonne++;
      distr += nb - (porte[q.correct] ? 1 : 0);
      if (nb === 0 || nb === 4) return;      /* le mot ne tranche pas */
      tranche++;
      if (porte[q.correct]) restreindre += 1 / nb;
      else ecarter += 1 / (4 - nb);
    });
    if (!tranche) return;
    var hasard = 0.25 * (questions.length - tranche);
    var gE = (ecarter + hasard) / questions.length;
    var gR = (restreindre + hasard) / questions.length;
    lignes.push({
      mot: mot, n: n, bonne: bonne, distr: distr, tranche: tranche,
      gE: gE, gR: gR, pire: Math.max(gE, gR),
      lecture: gE >= gR ? "ECARTER" : "RESTREINDRE",
    });
  });
  lignes.sort(function (a, b) { return b.pire - a.pire; });
  return lignes;
}

function coursDuSite() {
  return fs.readdirSync(path.join(RACINE, "pages")).filter(function (c) {
    var d = path.join(RACINE, "pages", c);
    return fs.statSync(d).isDirectory() && fs.existsSync(path.join(d, "cours.html"));
  }).sort();
}

if (TOUS) {
  var bilan = [];
  coursDuSite().forEach(function (nom) {
    var qs = questionsDe(nom);
    if (!qs.length) return;
    var r = classer(qs);
    if (r.length) bilan.push({ cours: nom, questions: qs.length, pire: r[0] });
  });
  bilan.sort(function (a, b) { return b.pire.pire - a.pire.pire; });
  console.log("mesure-mot-fetiche --tous — le pire mot de chacun des " + bilan.length + " cours");
  console.log("  (mot vu au moins " + mini + " fois ; alerte si la pire lecture rend >= " +
    (SEUIL * 100).toFixed(1).replace(".", ",") + " % en tranchant sur >= " + FENETRE + " questions)\n");
  console.log("  cours             mot                bonnes/distr  tranche  lecture       taux");
  bilan.forEach(function (l) {
    var p = l.pire, alerte = p.pire >= SEUIL && p.tranche >= FENETRE;
    console.log("  " + l.cours.padEnd(17) + p.mot.padEnd(18) +
      (p.bonne + " / " + p.distr).padStart(12) + String(p.tranche).padStart(9) +
      "  " + p.lecture.padEnd(12) +
      ((p.pire * 100).toFixed(1) + " %").padStart(7) + (alerte ? "   ALERTE" : ""));
  });
  var alertes = bilan.filter(function (l) { return l.pire.pire >= SEUIL && l.pire.tranche >= FENETRE; });
  console.log("\n  " + alertes.length + " cours sur " + bilan.length +
    " portent au moins un mot fetiche exploitable.");
  process.exit(0);
}

var questions = questionsDe(arg);
if (!questions.length) {
  console.log("mesure-mot-fetiche : aucune question lue pour le cours « " + arg + " »");
  process.exit(1);
}
var lignes = classer(questions);
console.log("mesure-mot-fetiche — " + arg + " : " + questions.length +
  " questions, mots vus au moins " + mini + " fois");
console.log("  mot                 vu  bonnes  distr  tranche   ECARTER  RESTREINDRE");
lignes.slice(0, 20).forEach(function (l) {
  console.log("  " + l.mot.padEnd(20) + String(l.n).padStart(3) + String(l.bonne).padStart(7) +
    String(l.distr).padStart(7) + String(l.tranche).padStart(9) +
    ("  " + (l.gE * 100).toFixed(1) + " %").padStart(10) +
    ("  " + (l.gR * 100).toFixed(1) + " %").padStart(13));
});
var alertes = lignes.filter(function (l) { return l.pire >= SEUIL && l.tranche >= FENETRE; });
console.log("\n  " + alertes.length + " alerte(s) : mot tranchant sur >= " + FENETRE +
  " questions et rendant >= " + (SEUIL * 100).toFixed(1).replace(".", ",") + " % sur le cours entier.");
alertes.forEach(function (l) {
  console.log("    " + l.mot + " — " + l.bonne + " bonne(s) / " + l.distr + " distracteur(s), " +
    l.tranche + " questions tranchees, " + l.lecture + " rend " + (l.pire * 100).toFixed(1) + " %");
});
process.exit(alertes.length ? 1 : 0);
