/* Applique un patch d'options a un fichier, par remplacement litteral et sur.
   usage : node applique.js <lecon-NN.html> <patch.json> [--ecrire] */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var f = process.argv[2];
var patch = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
var ecrire = process.argv.indexOf("--ecrire") >= 0;
var p = path.join(RACINE, "pages", "vue", f);
var src = fs.readFileSync(p, "utf8");

function questionsDe(s) {
  var out = [], m, re = /<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(s))) {
    if (/data-exos/.test(m[0])) continue;
    var v = JSON.parse(m[1]);
    if (Array.isArray(v)) v.forEach(function (q) { if (q && Array.isArray(q.a)) out.push(q); });
  }
  return out;
}
var qs = questionsDe(src);
var esc = function (t) { var s = JSON.stringify(t); return s.slice(1, -1); };
var n = 0;
Object.keys(patch).forEach(function (num) {
  var q = qs[Number(num) - 1];
  Object.keys(patch[num]).forEach(function (j) {
    var vieux = esc(q.a[Number(j)]), neuf = esc(patch[num][j]);
    if (vieux === neuf) { console.log("  = q" + num + " option " + j + " inchangee"); return; }
    var parts = src.split(vieux);
    if (parts.length !== 2) { console.log("  ! q" + num + " option " + j + " : " + (parts.length - 1) + " occurrence(s) — ABANDON"); process.exit(1); }
    src = parts.join(neuf);
    n++;
    console.log("  + q" + num + " option " + j);
  });
});
if (ecrire) { fs.writeFileSync(p, src); console.log("  ecrit : " + n + " option(s) dans " + f); }
else console.log("  APERCU seulement : " + n + " option(s) prete(s) pour " + f);
