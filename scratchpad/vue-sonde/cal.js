/* cal.js — calibrage d'un lot de patchs : applique EN MEMOIRE et montre, question
   par question, si les RANGS de longueur et le compte d'INCISES tiennent.
   usage : node cal.js patchs.json */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var patchs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
function inc(t) { return (t.match(/\([^)]{4,}\)/g) || []).length; }
function rangs(a) {
  var L = a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (x, y) { return y - x; });
  return L.map(function (v) { return tri.indexOf(v); });
}
var parF = {};
patchs.forEach(function (p) { (parF[p.fichier] = parF[p.fichier] || []).push(p); });
var ko = 0;
Object.keys(parF).sort().forEach(function (f) {
  var src = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8"), m, n = 0;
  var re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(src))) {
    if (/data-exos/.test(m[0])) continue;
    var v = null; try { v = JSON.parse(m[1]); } catch (e) { continue; }
    if (!Array.isArray(v)) continue;
    v.forEach(function (q) {
      if (!q || !Array.isArray(q.a)) return;
      n++;
      var lot = parF[f].filter(function (x) { return x.q === n; });
      if (!lot.length) return;
      var av = q.a.slice(), ap = q.a.slice();
      lot.forEach(function (x) { ap[x.opt] = x.texte; });
      var ra = rangs(av), rb = rangs(ap);
      var ia = av.map(inc), ib = ap.map(inc);
      var bon = JSON.stringify(ra) === JSON.stringify(rb);
      var egal = ib.every(function (x) { return x === ib[0]; });
      if (!bon || !egal) ko++;
      console.log("  " + (bon && egal ? "OK  " : "KO  ") + f + " q" + n +
        "   rangs " + JSON.stringify(ra) + (bon ? " =" : " -> " + JSON.stringify(rb)) +
        "   incises " + JSON.stringify(ia) + " -> " + JSON.stringify(ib));
      if (!bon) ap.forEach(function (t, j) {
        if (av[j] !== t) console.log("        opt" + j + " : " + av[j].length + " -> " + t.length + " car.");
      });
    });
  }
});
console.log("  " + (ko ? ko + " question(s) a revoir" : "tout tient : rangs preserves, incises egales"));
process.exitCode = ko ? 1 : 0;
