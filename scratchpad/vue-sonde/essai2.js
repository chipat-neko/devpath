/* essai2.js — banc d'essai : applique EN MEMOIRE un remplacement de distracteur et
   affiche le diff de SIGNATURE COMPLETE (les 44 strategies + w + k) contre une
   reference git. Rien n'est ecrit sur le disque.
   usage : node essai2.js <lecon-NN.html> <no question, 1-based> <index option> "<texte>" [--ref=<commit>] */
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var RACINE = path.join(__dirname, "..", "..");
var STRATEGIES = require(path.join(RACINE, "tools", "mesure-biais-qcm.js")).STRATEGIES;
var argv = process.argv.slice(2);
var ref = (argv.find(function (a) { return a.indexOf("--ref=") === 0; }) || "--ref=HEAD").slice(6);
var pos = argv.filter(function (a) { return a.indexOf("--") !== 0; });
var fichier = pos[0], noQ = Number(pos[1]), iOpt = Number(pos[2]), texte = pos[3];

function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function questionsDe(src) {
  var out = [], m, re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(src))) {
    if (/data-exos/.test(m[0])) continue;
    var v = null;
    try { v = JSON.parse(m[1]); } catch (e) { continue; }
    if (Array.isArray(v)) v.forEach(function (q) { if (q && Array.isArray(q.a)) out.push(q); });
  }
  return out;
}
function vocabulaire(src) {
  return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
}
function signature(q, vocab) {
  var vu = {};
  STRATEGIES.forEach(function (s) {
    var sel; try { sel = s.choisir(q); } catch (e) { sel = ["!"]; }
    vu["S:" + s.nom] = sel;
  });
  vu["w"] = q.a.map(function (t) { return motsLongs(t).length; });
  vu["k"] = q.a.map(function (t) {
    return Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); }).length;
  });
  return vu;
}

var disque = fs.readFileSync(path.join(RACINE, "pages", "vue", fichier), "utf8");
var refSrc = cp.execSync("git show " + ref + ":pages/vue/" + fichier, { cwd: RACINE, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
var qd = questionsDe(disque), qr = questionsDe(refSrc);
var vd = vocabulaire(disque), vr = vocabulaire(refSrc);
var q = JSON.parse(JSON.stringify(qd[noQ - 1]));

console.log(fichier + " q" + noQ + " — " + q.q.slice(0, 70));
console.log("  bonne reponse = opt" + q.correct);
q.a.forEach(function (t, j) {
  console.log("   " + (j === q.correct ? "*B" : " d" + j) + " car=" + String(t.length).padStart(4) + "  " + t);
});
if (texte === undefined) {
  var d0 = signature(qd[noQ - 1], vd), r0 = signature(qr[noQ - 1], vr), n0 = 0;
  Object.keys(r0).forEach(function (c) {
    if (JSON.stringify(r0[c]) !== JSON.stringify(d0[c])) { n0++; console.log("  ECART " + c + " : " + JSON.stringify(r0[c]) + " -> " + JSON.stringify(d0[c])); }
  });
  console.log("  " + n0 + " ecart(s) contre " + ref);
  process.exit(0);
}
q.a[iOpt] = texte;
console.log("");
console.log("  APRES, opt" + iOpt + " -> car=" + texte.length);
console.log("   " + texte);
var a = signature(qr[noQ - 1], vr), b = signature(q, vd), n = 0;
Object.keys(a).forEach(function (c) {
  if (JSON.stringify(a[c]) !== JSON.stringify(b[c])) { n++; console.log("  ECART " + c + " : " + JSON.stringify(a[c]) + " -> " + JSON.stringify(b[c])); }
});
console.log("  " + n + " ecart(s) contre " + ref + (n ? "" : "  — signature identique"));
process.exitCode = n ? 1 : 0;
