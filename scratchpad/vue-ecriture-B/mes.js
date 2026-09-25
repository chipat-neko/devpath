/* mesure de textes candidats contre le vocabulaire d'une page.
   usage : node mes.js lecon-04.html "texte1" "texte2" ... */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var f = process.argv[2];
var src = fs.readFileSync(path.join(RACINE, "pages", "vue", f), "utf8");
function motsLongs(t) {
  var w = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return w.map(function (x) { return x.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function nmots(t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; }
function densite(t) { var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []; return w.length ? w.join("").length / w.length : 0; }
var vocab = new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " ")));
process.argv.slice(3).forEach(function (t) {
  var ml = motsLongs(t);
  var kk = Array.from(new Set(ml)).filter(function (m) { return !vocab.has(m); });
  var ex = Array.from(new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []));
  console.log("car=" + t.length + " mots=" + nmots(t) + " dens=" + densite(t).toFixed(3) + " w=" + ml.length + " k=" + kk.length + " " + JSON.stringify(kk) + "\n   9+=" + JSON.stringify(ex) + "\n   " + t);
});
