"use strict";
/* C1 (c) : les 22 cours restants remesurés par l'outil lui-même (--json), et la part du
   signal « tics » déjà vue par les stratégies existantes de la parenthèse. */
var cp = require("child_process");
var out = cp.execFileSync(process.execPath, ["D:/test-claude/tools/mesure-biais-qcm.js", "--json"], { cwd: "D:/test-claude", encoding: "utf8", maxBuffer: 1 << 28 });
var j = JSON.parse(out);
var PLAN = [["cloud", 53, 92.5], ["reseaux", 52, 92.9], ["wasm", 50, 96.0], ["ml", 52, 92.3], ["erlang", 54, 88.9], ["ada", 49, 96.6],
  ["llm", 48, 97.9], ["fortran", 54, 87.0], ["groovy", 54, 87.0], ["patterns", 45, 97.8], ["http", 48, 89.6], ["graphql", 45, 93.3],
  ["kubernetes", 48, 87.5], ["cicd", 43, 93.0], ["markdown", 45, 88.9], ["distribue", 69, null], ["neurones", 65, null],
  ["formats", 45, 84.4], ["regex", 44, 85.8], ["compilation", 72, null], ["vscode", 46, 81.2], ["offensive", 69, null]];
var par = {}; j.parCours.forEach(function (c) { par[c.cours] = c; });
function pct(x) { return (100 * x).toFixed(1).replace(".", ","); }
var lignes = PLAN.map(function (p, i) {
  var c = par[p[0]];
  var paren = Math.max(c.parStrategie["l'incise entre parentheses"] || 0, c.parStrategie["RESTREINDRE a la parenthese"] || 0);
  return { rangPlan: i + 2, cours: p[0], qPlan: p[1], lgPlan: p[2], q: c.questions, lg: c.longueur, meilleure: c.meilleure,
           taux: c.taux, detaillee: c.parStrategie["la plus detaillee"], paren: paren, nocivite: c.questions * c.taux };
});
console.log("cours".padEnd(12) + "case".padStart(5) + "  q (plan)".padStart(11) + "  longue (plan)".padStart(16) + "  détaillée" + "  parenth." + "  meilleure stratégie".padEnd(44) + "  nocivité");
lignes.forEach(function (l) {
  console.log(l.cours.padEnd(12) + ("C" + l.rangPlan).padStart(5) + (l.q + " (" + l.qPlan + ")").padStart(11) +
    (pct(l.lg) + " % (" + (l.lgPlan === null ? "—" : String(l.lgPlan).replace(".", ",")) + ")").padStart(16) +
    (pct(l.detaillee) + " %").padStart(11) + (pct(l.paren) + " %").padStart(10) + "  " + (l.meilleure + " " + pct(l.taux) + " %").padEnd(42) +
    l.nocivite.toFixed(1).replace(".", ",").padStart(10));
});
var tri = lignes.slice().sort(function (a, b) { return b.nocivite - a.nocivite; });
console.log("\nOrdre par nocivité (questions × taux de la meilleure stratégie) :");
console.log("  " + tri.map(function (l, i) { return (i + 1) + ". " + l.cours + " (" + l.nocivite.toFixed(1).replace(".", ",") + ", C" + l.rangPlan + ")"; }).join("\n  "));
console.log("\nSite : " + j.questions + " questions ; « la plus longue » " + pct(j.strategies.filter(function (s) { return s.nom === "la plus longue"; })[0].taux) + " %");
