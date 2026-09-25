/* sig.js — affiche la signature mesuree de chaque question d'un fichier (etat disque). */
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
    var v = JSON.parse(m[1]);
    if (Array.isArray(v)) v.forEach(function (q) { if (q && Array.isArray(q.a)) out.push(q); });
  }
  return out;
}
function vocabulaire(src) {
  return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
}
function signature(q, vocab) {
  var L = q.a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (a, b) { return b - a; });
  var sets = q.a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
  return {
    len: L,
    rang: L.map(function (v) { return tri.indexOf(v); }),
    dense: argMax(q.a.map(densite)),
    densev: q.a.map(function (t) { return +densite(t).toFixed(3); }),
    bavarde: argMin(q.a.map(nmots)),
    nmots: q.a.map(nmots),
    w: q.a.map(function (t) { return motsLongs(t).length; }),
    k: q.a.map(function (t) {
      return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); }).length;
    }),
    kmots: q.a.map(function (t) {
      return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); });
    }),
    x: sets.map(function (s, i) {
      var n = 0, l = [];
      s.forEach(function (m) { if (!sets.some(function (o, j) { return j !== i && o.has(m); })) { n++; l.push(m); } });
      return n;
    }),
    xmots: sets.map(function (s, i) {
      var l = [];
      s.forEach(function (m) { if (!sets.some(function (o, j) { return j !== i && o.has(m); })) l.push(m); });
      return l;
    }),
  };
}

var f = process.argv[2];
var src = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");
var vocab = vocabulaire(src);
questionsDe(src).forEach(function (q, i) {
  var s = signature(q, vocab);
  console.log("=== " + f + " Q" + (i + 1) + " correct=" + q.correct + " :: " + q.q);
  q.a.forEach(function (t, j) {
    console.log("  [" + j + "] len=" + s.len[j] + " rang=" + s.rang[j] + " mots=" + s.nmots[j] +
      " dens=" + s.densev[j] + " w=" + s.w[j] + " k=" + s.k[j] + " x=" + s.x[j]);
    console.log("      k:" + JSON.stringify(s.kmots[j]) + " x:" + JSON.stringify(s.xmots[j]));
  });
  console.log("  dense=" + JSON.stringify(s.dense) + " bavarde=" + JSON.stringify(s.bavarde));
  console.log("");
});
module.exports = { motsLongs: motsLongs, nmots: nmots, densite: densite, vocabulaire: vocabulaire, signature: signature, questionsDe: questionsDe };
