"use strict";
var fs = require("fs"), path = require("path");
var f = path.join(__dirname, "..", "..", "pages", "vue", "lecon-13.html");
var src = fs.readFileSync(f, "utf8");
var R = [
  // q1 d2
  ["Les variables du script : le compteur (valeur), la saisie (message), à lire et à modifier sans inspecter",
   "Les variables internes du script : le compteur du bouton, que le test peut lire et modifier sans inspecter le résultat"],
  // q1 d3
  ["Le composant monté : ses variables (props, entrées) et ses sorties (emitted), à modifier",
   "Le composant monté : son script, ses variables internes, ses entrées et ses sorties"],
  // q2 d1
  ["Pour un retard : sans await, le clic du bouton part trop tôt et le DOM de Vue se met à jour une fois sur deux",
   "Parce que sans await, le clic du bouton part trop tôt : Vue n'a pas eu le temps de placer le DOM du test"],
  // q2 d3
  ["Pour un contrôle du clic : await le rend asynchrone, donc sûr",
   "Parce que await rend le clic asynchrone : sinon, le DOM refuse le clic"],
  // q3 d3
  ["Dans le rendu (wrapper.text), qui affiche valider et ses variables",
   "Dans le rendu de wrapper.text(), qui affiche les variables du script"],
  // q4 d2
  ["Lire les variables internes du composant monté, pour des tests très précis, même si le wrapper ne vérifie pas le montage ni le clic réel",
   "Lire les variables internes du composant monté : c'est le seul test précis, et il est bien plus sûr que le contrat de sortie du wrapper"],
  // q4 d3
  ["Refactoriser les tests dès que le code bouge, pour couvrir la structure exacte du wrapper monté, non son contrat de sortie",
   "Refactoriser les tests dès que le code bouge, pour couvrir la structure exacte du HTML, et non le contrat de sortie du composant"],
];
R.forEach(function (p, i) {
  var n = src.split(p[0]).length - 1;
  if (n !== 1) { console.error("!! motif " + i + " trouve " + n + " fois : " + p[0].slice(0, 50)); process.exit(1); }
  src = src.replace(p[0], p[1]);
});
fs.writeFileSync(f, src);
console.log("lecon-13 : " + R.length + " options reecrites");
