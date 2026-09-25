"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function nmots(t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; }
function densite(t) { var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []; return w.length ? w.join("").length / w.length : 0; }
function argMax(v) { var m = Math.max.apply(null, v); return v.reduce(function (a, x, i) { if (x === m) a.push(i); return a; }, []); }
function argMin(v) { var m = Math.min.apply(null, v); return v.reduce(function (a, x, i) { if (x === m) a.push(i); return a; }, []); }
function questionsDe(src) {
  var out = [], m, re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(src))) {
    if (/data-exos/.test(m[0])) continue;
    var v = null;
    try { v = JSON.parse(m[1]); } catch (e) { out.push({ casse: true, err: e.message }); continue; }
    if (Array.isArray(v)) v.forEach(function (q) { if (q && Array.isArray(q.a)) out.push(q); });
  }
  return out;
}
function vocabulaire(src) {
  return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
}
process.argv.slice(2).forEach(function (f) {
  var src = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");
  var vocab = vocabulaire(src);
  var qs = questionsDe(src);
  console.log("==== " + f + " (" + qs.length + " questions)");
  qs.forEach(function (q, i) {
    var L = q.a.map(function (t) { return t.length; });
    var tri = L.slice().sort(function (a, b) { return b - a; });
    var sets = q.a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
    var dense = argMax(q.a.map(densite)), bav = argMin(q.a.map(nmots));
    console.log("\n-- q" + (i + 1) + "  correct=" + q.correct + "  dense=" + JSON.stringify(dense) + " bavarde=" + JSON.stringify(bav));
    console.log("   Q: " + q.q);
    q.a.forEach(function (t, j) {
      var ml = motsLongs(t);
      var k = Array.from(new Set(ml)).filter(function (m) { return !vocab.has(m); });
      var xs = []; sets[j].forEach(function (m) { if (!sets.some(function (o, jj) { return jj !== j && o.has(m); })) xs.push(m); });
      console.log("   [" + j + "]" + (j === q.correct ? "*" : " ") + " len=" + L[j] + " rang=" + tri.indexOf(L[j]) + " nm=" + nmots(t) + " dens=" + densite(t).toFixed(3) + " w=" + ml.length + " k=" + k.length + " x=" + xs.length);
      console.log("       " + t);
      if (k.length) console.log("       kmots: " + k.join(", "));
      if (xs.length) console.log("       xmots: " + xs.join(", "));
    });
    if (q.explain) console.log("   E: " + q.explain);
  });
});
