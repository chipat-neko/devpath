/* Sonde jetable : dosage exact de « la plus dense (mots longs) » sur `vue`.
   Charge STRATEGIES depuis l'outil au lieu d'en recopier la definition. */
var m = require("../../tools/mesure-biais-qcm.js");
var corpus = m.lireCorpus().filter(function (q) { return q.cours === "vue"; });
var strat = m.STRATEGIES.filter(function (s) { return /plus dense/.test(s.nom) && !/ECARTER/.test(s.nom); })[0];
var inv = m.STRATEGIES.filter(function (s) { return /ECARTER la plus dense/.test(s.nom); })[0];

function densiteMots(t) {
  var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || [];
  return w.length ? w.join("").length / w.length : 0;
}

var seules = [], score = 0, scoreInv = 0;
corpus.forEach(function (q, i) {
  var sel = strat.choisir(q);
  if (sel.indexOf(q.k) >= 0) score += 1 / sel.length;
  var si = inv.choisir(q);
  if (si.indexOf(q.k) >= 0) scoreInv += 1 / si.length;
  if (sel.length === 1 && sel[0] === q.k) {
    var d = q.a.map(densiteMots);
    var autres = d.filter(function (_, j) { return j !== q.k; });
    seules.push({
      i: i, f: q.fichier, bilan: q.bilan, q: q.q.slice(0, 70),
      dBonne: d[q.k].toFixed(3), dMax2: Math.max.apply(null, autres).toFixed(3),
      ecart: (d[q.k] - Math.max.apply(null, autres)).toFixed(3),
      bonne: q.a[q.k],
    });
  }
});
console.log("questions :", corpus.length);
console.log("la plus dense  : " + (100 * score / corpus.length).toFixed(1) + " %   (inverse ECARTER : " + (100 * scoreInv / corpus.length).toFixed(1) + " %)");
console.log("questions ou la densite designe SEULE la bonne :", seules.length);
console.log("");
seules.sort(function (a, b) { return a.ecart - b.ecart; });
seules.forEach(function (s) {
  console.log("  " + s.f + (s.bilan ? " [BILAN]" : "") + " #" + s.i + "  ecart=" + s.ecart + "  (" + s.dBonne + " vs " + s.dMax2 + ")");
  console.log("      Q: " + s.q);
  console.log("      B: " + s.bonne.slice(0, 110));
});
/* combien de bascules pour atteindre 25,0 % : chaque question tranchee a tort vaut 0,
   chaque question basculee en ex aequo a deux vaut 0,5 */
console.log("");
console.log("cible 25,0 % = " + (0.25 * corpus.length).toFixed(2) + " points ; actuel " + score.toFixed(2));
console.log("a retirer : " + (score - 0.25 * corpus.length).toFixed(2) + " points");
