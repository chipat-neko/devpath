/*
   mesure-qcm-marques.js — une reecriture de distracteurs a-t-elle AJOUTE ou RETIRE
   une marque de ponctuation, et casse l'equilibre entre les quatre options ?

   Ecrit le 2026-09-08 (B4, cours `lua`), pendant la passe de fermeture de l'echo.
   Le chantier a mesure onze marques (deux-points, point-virgule, tiret cadratin,
   parentheses, guillemets, barre oblique, fleche, virgule decimale, point interne,
   majuscule d'emphase, approximateur) dont plusieurs rendent 90 a 100 % quand une
   SEULE option la porte. La regle est « par marque : ou les quatre options la
   portent, ou aucune ».

   Le probleme : cette regle se verifie APRES coup, sur le cours entier, par
   mesure-biais-qcm. Quand une passe retouche 50 options pour fermer UN indice,
   elle peut en ouvrir un autre a l'insu de tous, et la mesure globale le noie.
   Cet outil compare option par option a une reference git et dit exactement
   QUELLE option a gagne ou perdu QUELLE marque — avant que la moyenne ne le cache.

   Usage : node tools/mesure-qcm-marques.js <cours> [<ref-git>]
           (code 1 si une marque a bouge)
*/
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var cours = process.argv[2];
if (!cours) { console.error("usage : node tools/mesure-qcm-marques.js <cours> [<ref-git>]"); process.exit(2); }
var REF = process.argv[3] || "HEAD";
var dir = path.join(__dirname, "..", "pages", cours);

/* Les marques mesurees par mesure-biais-qcm, ecrites ici pour etre nommees dans le
   rapport. Le point INTERNE est « un point suivi d'une espace puis d'une capitale » :
   une phrase de plus, pas une abreviation ni un nom qualifie (t.nom, math.pi). */
var MARQUES = [
  ["deux-points",      /:/],
  ["point-virgule",    /;/],
  ["tiret cadratin",   /[—–]|\s-\s/],
  ["parenthese",       /\([^)]{4,}\)/],
  ["guillemets",       /[«»"“”]/],
  ["barre oblique",    /[A-Za-zÀ-ÿ0-9)]\s?\/\s?[A-Za-zÀ-ÿ0-9(]/],
  ["fleche",           /→|->|=>/],
  ["virgule decimale", /\d,\d/],
  ["point interne",    /\.\s+[A-ZÀ-Þ]/],
];

function extrait(src) {
  var re = /<script[^>]*type="application\/json"[^>]*data-quiz(?:-bilan)?[^>]*>([\s\S]*?)<\/script>/g, m, out = [];
  while ((m = re.exec(src))) out.push(JSON.parse(m[1]));
  return out;
}
function marquesDe(t) {
  return MARQUES.filter(function (p) { return p[1].test(String(t)); }).map(function (p) { return p[0]; });
}

var bouges = [], nq = 0, nopt = 0, reecrits = 0;
fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort().forEach(function (f) {
  var rel = "pages/" + cours + "/" + f, avant, apres;
  try { avant = extrait(cp.execSync("git show " + REF + ":" + rel, { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "ignore"] })); }
  catch (e) { bouges.push(rel + " : introuvable dans " + REF); return; }
  apres = extrait(fs.readFileSync(rel, "utf8"));
  if (avant.length !== apres.length) { bouges.push(rel + " : nombre de blocs change"); return; }
  avant.forEach(function (blocA, b) {
    var blocB = apres[b];
    if (blocA.length !== blocB.length) { bouges.push(rel + " bloc" + b + " : nombre de questions change"); return; }
    blocA.forEach(function (qa, i) {
      var qb = blocB[i]; nq++;
      if (!Array.isArray(qa.a) || !Array.isArray(qb.a) || qa.a.length !== qb.a.length) {
        bouges.push(rel + " bloc" + b + " q" + (i + 1) + " : nombre d'options change"); return;
      }
      qa.a.forEach(function (ta, j) {
        var tb = qb.a[j]; nopt++;
        if (ta === tb) return;
        reecrits++;
        var ma = marquesDe(ta), mb = marquesDe(tb);
        var perdues = ma.filter(function (x) { return mb.indexOf(x) === -1; });
        var gagnees = mb.filter(function (x) { return ma.indexOf(x) === -1; });
        if (!perdues.length && !gagnees.length) return;
        bouges.push(rel + " bloc" + b + " q" + (i + 1) + " opt" + j +
          (j === qb.correct ? " (BONNE REPONSE)" : "") + " : " +
          (gagnees.length ? "+ " + gagnees.join(", ") + "  " : "") +
          (perdues.length ? "- " + perdues.join(", ") : "") +
          "\n      avant : " + ta + "\n      apres : " + tb);
      });
    });
  });
});

console.log("\n" + cours + " : " + nq + " questions, " + nopt + " options, " + reecrits +
  " reecrite(s) depuis " + REF + ".");
if (!bouges.length) {
  console.log("Aucune marque n'a bouge : l'equilibre par marque est intact.\n");
  process.exit(0);
}
console.log("\n" + bouges.length + " MOUVEMENT(S) DE MARQUE :");
bouges.forEach(function (b) { console.log("  " + b); });
console.log("\n  Rappel de la regle : par marque, ou les QUATRE options la portent, ou AUCUNE.");
console.log("  Un mouvement n'est pas forcement une faute — il l'est si, apres lui, une seule");
console.log("  option porte la marque. Verifier avec mesure-biais-qcm --seul=" + cours + ".\n");
process.exit(1);
