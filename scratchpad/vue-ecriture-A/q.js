/* q.js — compare une question candidate (4 textes) a la signature de reference (git HEAD).
 * usage : node q.js lecon-01.html <numeroQuestion 1..n> <t0> <t1> <t2> <t3>
 * (mets "=" pour garder le texte de reference d'une option)
 */
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
    var v = JSON.parse(m[1]);
    if (Array.isArray(v)) v.forEach(function (q) { if (q && Array.isArray(q.a)) out.push(q); });
  }
  return out;
}
function vocabulaire(src) {
  return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
}
function signature(a, vocab) {
  var L = a.map(function (t) { return t.length; });
  var tri = L.slice().sort(function (x, y) { return y - x; });
  var sets = a.map(function (t) { return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []); });
  return {
    rang: L.map(function (v) { return tri.indexOf(v); }),
    dense: argMax(a.map(densite)),
    bavarde: argMin(a.map(nmots)),
    w: a.map(function (t) { return motsLongs(t).length; }),
    k: a.map(function (t) { return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); }).length; }),
    x: sets.map(function (s, i) { var n = 0; s.forEach(function (m) { if (!sets.some(function (o, j) { return j !== i && o.has(m); })) n++; }); return n; }),
    _len: L, _mots: a.map(nmots), _dens: a.map(function (t) { return +densite(t).toFixed(3); }),
    _kmots: a.map(function (t) { return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); }); }),
    _xmots: sets.map(function (s, i) { var l = []; s.forEach(function (m) { if (!sets.some(function (o, j) { return j !== i && o.has(m); })) l.push(m); }); return l; }),
  };
}
var f = process.argv[2], qi = parseInt(process.argv[3], 10) - 1;
var textes = process.argv.slice(4);
var refSrc = cp.execSync("git show HEAD:pages/vue/" + f, { cwd: RACINE, encoding: "utf8", maxBuffer: 6e7 });
var disque = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");
var qr = questionsDe(refSrc)[qi];
var cand = textes.map(function (t, i) { return t === "=" ? qr.a[i] : t; });
var A = signature(qr.a, vocabulaire(refSrc)), B = signature(cand, vocabulaire(disque));
["rang", "dense", "bavarde", "w", "k", "x"].forEach(function (c) {
  var ok = JSON.stringify(A[c]) === JSON.stringify(B[c]);
  console.log((ok ? "  ok  " : "  XX  ") + c.padEnd(8) + JSON.stringify(A[c]) + "  ->  " + JSON.stringify(B[c]));
});
console.log("  --  len     " + JSON.stringify(A._len) + "  ->  " + JSON.stringify(B._len));
console.log("  --  mots    " + JSON.stringify(A._mots) + "  ->  " + JSON.stringify(B._mots));
console.log("  --  dens    " + JSON.stringify(A._dens) + "  ->  " + JSON.stringify(B._dens));
cand.forEach(function (t, i) {
  console.log("  [" + i + "] k:" + JSON.stringify(B._kmots[i]) + " x:" + JSON.stringify(B._xmots[i]));
});
