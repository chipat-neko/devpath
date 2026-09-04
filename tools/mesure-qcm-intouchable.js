/*
   mesure-qcm-intouchable.js — ce qu'une reecriture de distracteurs N'A PAS le
   droit de toucher, verifie contre git HEAD plutot que sur parole.

   Ecrit pour le point B3 du CHANTIER-V16 : etoffer les distracteurs d'un QCM
   ne doit changer NI l'enonce, NI l'index de la bonne reponse, NI l'explication,
   NI le texte de la bonne reponse. Le protocole confie la reecriture a plusieurs
   agents en parallele ; cet outil est le controle d'apres, pas la promesse
   d'avant. Eprouve par injection sur le cours iac (bonne reponse allongee + explication
   changee) : 2 atteintes injectees, 2 vues.

   Usage : node tools/mesure-qcm-intouchable.js <cours>
           (code 1 si une atteinte est trouvee)
*/
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var cours = process.argv[2];
var dir = path.join(__dirname, "..", "pages", cours);
function extrait(src) {
  var re = /<script[^>]*type="application\/json"[^>]*data-quiz(?:-bilan)?[^>]*>([\s\S]*?)<\/script>/g, m, out = [];
  while ((m = re.exec(src))) out.push(JSON.parse(m[1]));
  return out;
}
var pbs = [], nq = 0, nd = 0, chg = 0;
fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).sort().forEach(function (f) {
  var rel = "pages/" + cours + "/" + f;
  var avant, apres;
  try { avant = extrait(cp.execSync("git show HEAD:" + rel, { encoding: "utf8", maxBuffer: 1 << 26 })); }
  catch (e) { pbs.push(rel + " : introuvable dans HEAD"); return; }
  apres = extrait(fs.readFileSync(rel, "utf8"));
  if (avant.length !== apres.length) { pbs.push(rel + " : nombre de blocs QCM change (" + avant.length + " -> " + apres.length + ")"); return; }
  avant.forEach(function (blocA, b) {
    var blocB = apres[b];
    if (blocA.length !== blocB.length) { pbs.push(rel + " bloc" + b + " : nombre de questions change (" + blocA.length + " -> " + blocB.length + ")"); return; }
    blocA.forEach(function (qa, i) {
      var qb = blocB[i], id = rel + " bloc" + b + " q" + (i + 1);
      nq++;
      if (qa.q !== qb.q) pbs.push(id + " : ENONCE modifie");
      if (qa.correct !== qb.correct) pbs.push(id + " : index correct modifie (" + qa.correct + " -> " + qb.correct + ")");
      if (qa.explain !== qb.explain) pbs.push(id + " : EXPLICATION modifiee");
      if (qa.a.length !== qb.a.length) { pbs.push(id + " : nombre d'options modifie"); return; }
      if (qa.a[qa.correct] !== qb.a[qb.correct]) pbs.push(id + " : BONNE REPONSE modifiee\n      avant : " + qa.a[qa.correct] + "\n      apres : " + qb.a[qb.correct]);
      qa.a.forEach(function (o, k) { if (k === qb.correct) return; nd++; if (o !== qb.a[k]) chg++; });
    });
  });
});
console.log(cours + " : " + nq + " questions, " + nd + " distracteurs, " + chg + " reecrits.");
console.log(pbs.length ? "ATTEINTES A L'INTOUCHABLE : " + pbs.length : "Aucune atteinte : q / correct / explain / bonne reponse intacts.");
pbs.forEach(function (p) { console.log("  " + p); });
process.exit(pbs.length ? 1 : 0);
