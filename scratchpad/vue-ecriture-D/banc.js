/* banc.js — essai en memoire : applique des remplacements et montre l'ecart mesure.
   usage : node banc.js <lecon-NN.html> [essais.json]
   essais.json : [ {"q":1,"i":2,"t":"nouveau texte"} , ... ]  (q = index 1-based dans le fichier)
   Sans essais.json : affiche juste l'etat courant du disque vs HEAD, en detail. */
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var RACINE = path.join(__dirname, "..", "..");
var f = process.argv[2];
var essais = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], "utf8")) : [];

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

var disque = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");
var refSrc = cp.execSync("git show HEAD:pages/vue/" + f, { cwd: RACINE, encoding: "utf8", maxBuffer: 64e6 });
var qd = questionsDe(disque), qr = questionsDe(refSrc);
essais.forEach(function (e) { qd[e.q - 1].a[e.i] = e.t; });
var vd = vocabulaire(disque), vr = vocabulaire(refSrc);

qd.forEach(function (q, i) {
  var a = signature(qr[i], vr), b = signature(q, vd);
  var diff = [];
  ["correct", "rang", "dense", "bavarde", "w", "k", "x"].forEach(function (cle) {
    if (JSON.stringify(a[cle]) !== JSON.stringify(b[cle])) diff.push("  ! " + cle + " " + JSON.stringify(a[cle]) + " -> " + JSON.stringify(b[cle]));
  });
  console.log("q" + (i + 1) + (diff.length ? "  ECART" : "  ok") + " — " + String(q.q).slice(0, 50));
  console.log("   len ref " + JSON.stringify(qr[i].a.map(function (t) { return t.length; })) + " -> " + JSON.stringify(q.a.map(function (t) { return t.length; })));
  console.log("   mots ref " + JSON.stringify(qr[i].a.map(nmots)) + " -> " + JSON.stringify(q.a.map(nmots)) +
              " | dens " + JSON.stringify(qr[i].a.map(function(t){return +densite(t).toFixed(2);})) + " -> " + JSON.stringify(q.a.map(function(t){return +densite(t).toFixed(2);})));
  console.log("   w ref " + JSON.stringify(a.w) + " -> " + JSON.stringify(b.w) + " | k " + JSON.stringify(a.k) + " -> " + JSON.stringify(b.k) + " | x " + JSON.stringify(a.x) + " -> " + JSON.stringify(b.x));
  q.a.forEach(function (t, j) {
    var etr = Array.from(new Set(motsLongs(t))).filter(function (m) { return !vd.has(m); });
    var sets = q.a.map(function (u) { return new Set(u.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
    var ex = []; sets[j].forEach(function (m) { if (!sets.some(function (o, k) { return k !== j && o.has(m); })) ex.push(m); });
    console.log("     [" + j + "] etrangers(k)=" + JSON.stringify(etr) + " excl9(x)=" + JSON.stringify(ex));
  });
  diff.forEach(function (d) { console.log(d); });
});
