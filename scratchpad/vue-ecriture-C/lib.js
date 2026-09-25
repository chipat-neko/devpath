"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
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
function signature(q, vocab) {
  var L = q.a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (a, b) { return b - a; });
  var sets = q.a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
  return {
    correct: q.correct,
    rang: L.map(function (v) { return tri.indexOf(v); }),
    dense: argMax(q.a.map(densite)),
    bavarde: argMin(q.a.map(nmots)),
    w: q.a.map(function (t) { return motsLongs(t).length; }),
    k: q.a.map(function (t) { return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); }).length; }),
    x: sets.map(function (s, i) { var n = 0; s.forEach(function (m) { if (!sets.some(function (o, j) { return j !== i && o.has(m); })) n++; }); return n; }),
  };
}
function lireRef(f, ref) {
  return cp.execSync("git show " + (ref || "HEAD") + ":pages/vue/" + f, { cwd: RACINE, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}
function chemin(f) { return path.join(RACINE, "pages", "vue", f); }

module.exports = { RACINE, motsLongs, nmots, densite, argMax, argMin, questionsDe, vocabulaire, signature, lireRef, chemin };
