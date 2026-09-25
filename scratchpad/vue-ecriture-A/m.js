/* m.js — mesure un texte candidat contre le vocabulaire d'une page.
 * usage : node m.js lecon-01.html "mon texte"  [autre texte ...]
 */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function nmots(t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; }
function densite(t) { var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []; return w.length ? w.join("").length / w.length : 0; }
var f = process.argv[2];
var src = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");
var vocab = new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
process.argv.slice(3).forEach(function (t, i) {
  var abs = Array.from(new Set(motsLongs(t))).filter(function (m) { return !vocab.has(m); });
  var neuf = Array.from(new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []));
  console.log("#" + i + " len=" + t.length + " mots=" + nmots(t) + " dens=" + densite(t).toFixed(3) +
    " w=" + motsLongs(t).length + " k=" + abs.length);
  console.log("    absents: " + JSON.stringify(abs));
  console.log("    9+: " + JSON.stringify(neuf));
});
