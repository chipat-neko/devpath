/* Simule un jeu de remplacements et rejoue EXACTEMENT la signature de controle.js.
   usage : node essai.js <lecon-NN.html> <patch.json>
   patch.json = { "<numero de question 1-based>": { "<index option>": "texte" }, ... } */
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var RACINE = path.join(__dirname, "..", "..");
var f = process.argv[2];
var patch = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], "utf8")) : {};

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
var disque = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");
var refSrc = cp.execSync("git show HEAD:pages/vue/" + f, { cwd: RACINE, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
function vocabulaire(src) { return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " "))); }
var vd = vocabulaire(disque), vr = vocabulaire(refSrc);
var qd = questionsDe(disque), qr = questionsDe(refSrc);

Object.keys(patch).forEach(function (n) {
  var q = qd[Number(n) - 1];
  Object.keys(patch[n]).forEach(function (j) { q.a[Number(j)] = patch[n][j]; });
});

var nbEcarts = 0;
qd.forEach(function (q, i) {
  var a = signature(qr[i], vr), b = signature(q, vd);
  var diff = [];
  ["correct", "rang", "dense", "bavarde", "w", "k", "x"].forEach(function (cle) {
    if (JSON.stringify(a[cle]) !== JSON.stringify(b[cle])) diff.push("      " + cle + " " + JSON.stringify(a[cle]) + " -> " + JSON.stringify(b[cle]));
  });
  var touche = patch[String(i + 1)];
  if (!diff.length && !touche) return;
  console.log((diff.length ? "  X " : "  OK ") + "q" + (i + 1) + " : " + String(q.q).slice(0, 50));
  if (touche) {
    var L = q.a.map(function (t) { return t.length; });
    var tri = L.slice().sort(function (x, y) { return y - x; });
    q.a.forEach(function (t, j) {
      var ml = motsLongs(t);
      var kk = Array.from(new Set(ml)).filter(function (m) { return !vd.has(m); });
      var ex = Array.from(new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []));
      console.log("     " + (j === q.correct ? "*B" : " d") + j + " car=" + String(t.length).padStart(4) + " rang=" + tri.indexOf(t.length) +
        " mots=" + String(nmots(t)).padStart(3) + " dens=" + densite(t).toFixed(3) + " w=" + String(ml.length).padStart(2) + " k=" + kk.length + " " + JSON.stringify(kk) + " 9+=" + JSON.stringify(ex));
    });
  }
  diff.forEach(function (d) { console.log(d); nbEcarts++; });
});
console.log("  ecarts : " + nbEcarts);
