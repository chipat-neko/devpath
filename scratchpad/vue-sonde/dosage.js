/* dosage.js — pour une strategie de mesure-biais-qcm, liste les questions ou elle
   designe SEULE la bonne reponse, et calcule combien de bascules ramenent a 25,0 %.
   usage : node dosage.js "<fragment du nom de la strategie>" */
var m = require("../../tools/mesure-biais-qcm.js");
var corpus = m.lireCorpus().filter(function (q) { return q.cours === "vue"; });
var frag = process.argv[2];
var strats = m.STRATEGIES.filter(function (s) { return s.nom.indexOf(frag) >= 0; });
if (!strats.length) { console.log("aucune strategie pour « " + frag + " »"); process.exit(1); }

strats.forEach(function (s) {
  var score = 0, seules = [], contre = [];
  corpus.forEach(function (q) {
    var sel = s.choisir(q);
    if (sel.indexOf(q.k) >= 0) score += 1 / sel.length;
    if (sel.length < q.a.length) {
      if (sel.length === 1 && sel[0] === q.k) seules.push(q);
      else if (sel.indexOf(q.k) < 0) contre.push(q);
    }
  });
  console.log("=== " + s.nom);
  console.log("    reussite " + (100 * score / corpus.length).toFixed(1) + " %  ·  designe SEULE la bonne : " +
    seules.length + "  ·  designe un distracteur seul : " + contre.length);
  console.log("    cible 25,0 % = " + (0.25 * corpus.length).toFixed(2) + " pts ; actuel " + score.toFixed(2) +
    " ; a retirer " + (score - 0.25 * corpus.length).toFixed(2));
  seules.forEach(function (q) {
    console.log("    · " + q.fichier + (q.bilan ? " [BILAN]" : "") + "  " + q.q.slice(0, 55));
    q.a.forEach(function (t, j) { console.log("        " + (j === q.k ? "*B " : " d" + j + " ") + t.slice(0, 120)); });
  });
  console.log("");
});
