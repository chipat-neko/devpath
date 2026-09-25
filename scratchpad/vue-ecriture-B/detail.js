/* Detail complet d'un fichier : pour chaque question, les indicateurs de controle.js. */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var f = process.argv[2];
var only = process.argv[3] ? Number(process.argv[3]) : null;
var src = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");

function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function nmots(t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; }
function densite(t) { var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []; return w.length ? w.join("").length / w.length : 0; }
function argMax(v) { var m = Math.max.apply(null, v); return v.reduce(function (a, x, i) { if (x === m) a.push(i); return a; }, []); }
function argMin(v) { var m = Math.min.apply(null, v); return v.reduce(function (a, x, i) { if (x === m) a.push(i); return a; }, []); }
function questionsDe(s) {
  var out = [], m, re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(s))) {
    if (/data-exos/.test(m[0])) continue;
    var v = null;
    try { v = JSON.parse(m[1]); } catch (e) { out.push({ casse: true, err: e.message }); continue; }
    if (Array.isArray(v)) v.forEach(function (q) { if (q && Array.isArray(q.a)) out.push(q); });
  }
  return out;
}
var vocab = new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
var qs = questionsDe(src);
qs.forEach(function (q, i) {
  if (only !== null && i + 1 !== only) return;
  var L = q.a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (a, b) { return b - a; });
  var sets = q.a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
  console.log("q" + (i + 1) + " correct=" + q.correct + "  dense=" + JSON.stringify(argMax(q.a.map(densite))) + " bavarde=" + JSON.stringify(argMin(q.a.map(nmots))));
  console.log("  Q: " + q.q);
  q.a.forEach(function (t, j) {
    var ml = motsLongs(t);
    var kk = Array.from(new Set(ml)).filter(function (m) { return !vocab.has(m); });
    var ex = []; sets[j].forEach(function (m) { if (!sets.some(function (o, z) { return z !== j && o.has(m); })) ex.push(m); });
    console.log("  " + (j === q.correct ? "*B" : " d") + j + " car=" + String(t.length).padStart(4) + " rang=" + tri.indexOf(t.length) +
      " mots=" + String(nmots(t)).padStart(3) + " dens=" + densite(t).toFixed(3) + " w=" + ml.length + " k=" + kk.length + " x=" + ex.length);
    console.log("      " + t);
    if (kk.length) console.log("      k-mots: " + JSON.stringify(kk));
    console.log("      x-mots: " + JSON.stringify(ex));
  });
  console.log("");
});
