/* applique.js — remplacement litteral des distracteurs dans pages/vue/*.html
 * usage : node applique.js [--ecrire]   (sans --ecrire : apercu seulement)
 */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..");
var liste = JSON.parse(fs.readFileSync(path.join(__dirname, "remplacements.json"), "utf8"));
var ecrire = process.argv.indexOf("--ecrire") !== -1;
var parFichier = {};
liste.forEach(function (r) { (parFichier[r.f] = parFichier[r.f] || []).push(r); });
var total = 0, souci = 0;
Object.keys(parFichier).forEach(function (f) {
  var p = path.join(RACINE, "pages", "vue", f);
  var src = fs.readFileSync(p, "utf8");
  parFichier[f].forEach(function (r) {
    var n = src.split(r.old).length - 1;
    if (n !== 1) { console.log("  ! " + f + " : " + n + " occurrence(s) — " + r.old.slice(0, 60)); souci++; return; }
    if (/["\\]/.test(r.new)) { console.log("  ! " + f + " : le nouveau texte contient un guillemet ou un backslash"); souci++; return; }
    src = src.split(r.old).join(r.new);
    total++;
  });
  if (ecrire && !souci) fs.writeFileSync(p, src, "utf8");
});
console.log((ecrire ? "  ecrit : " : "  apercu : ") + total + " remplacement(s), " + souci + " souci(s)");
