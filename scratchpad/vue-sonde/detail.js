/* Detail des options d'une question : caracteres, mots, densite, rang, mots 9+ exclusifs. */
var m = require("../../tools/mesure-biais-qcm.js");
var corpus = m.lireCorpus().filter(function (q) { return q.cours === "vue"; });
function dens(t) { var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []; return w.length ? w.join("").length / w.length : 0; }
function nmots(t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; }
function exclusifs(a) {
  var sets = a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
  return sets.map(function (s, i) {
    var out = [];
    s.forEach(function (w) { if (!sets.some(function (o, j) { return j !== i && o.has(w); })) out.push(w); });
    return out;
  });
}
var cibles = process.argv.slice(2).map(Number);
cibles.forEach(function (i) {
  var q = corpus[i];
  var L = q.a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (a, b) { return b - a; });
  var ex = exclusifs(q.a);
  console.log("#" + i + "  " + q.fichier + (q.bilan ? " [BILAN]" : ""));
  console.log("  Q: " + q.q);
  q.a.forEach(function (t, j) {
    console.log("   " + (j === q.k ? "*B" : " d" + j) + " car=" + String(t.length).padStart(4) +
      " rang=" + tri.indexOf(t.length) + " mots=" + String(nmots(t)).padStart(3) +
      " dens=" + dens(t).toFixed(3) + " excl=" + ex[j].length + " " + JSON.stringify(ex[j]));
    console.log("       " + t);
  });
  console.log("");
});
