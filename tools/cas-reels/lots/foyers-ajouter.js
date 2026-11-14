/* =============================================================================
   tools/cas-reels/lots/foyers-ajouter.js — inscrire au registre foyers.md les sujets d'un lot,
   lus dans son fichier de réservations (la DERNIÈRE ligne de chaque cas fait foi : un agent qui
   change de sujet ajoute une ligne).

   USAGE : node tools/cas-reels/lots/foyers-ajouter.js <fichier-reservations> "<titre de section>"
   Exemple : … b6-reservations.txt "Pris par le lot 3 (B6, 2026-11-14)"
   Une section de même titre déjà présente est remplacée (relance sans doublon).
   Format d'une réservation : `cours/lecon-NN#k | sujet | url` (un préfixe `pages/` et `.html`
   sont tolérés ; une ligne qui commence par « (correction… » ou « (remplace… » aussi).
   ============================================================================= */
"use strict";
var fs = require("fs"), path = require("path");
var RESA = process.argv[2], TITRE = process.argv[3];
if (!RESA || !TITRE) { console.error("usage : foyers-ajouter.js <reservations> \"<titre>\""); process.exit(2); }
var REG = path.join(__dirname, "foyers.md");
var s = fs.readFileSync(REG, "utf8");
var marque = "\n## " + TITRE + "\n", i = s.indexOf(marque);
if (i >= 0) { var j = s.indexOf("\n## ", i + marque.length); s = s.slice(0, i) + (j >= 0 ? s.slice(j) : ""); }
s = s.replace(/\n+$/, "\n");
var L = fs.readFileSync(RESA, "utf8").split("\n")
  .filter(function (l) { return /^(pages\/)?[a-z0-9-]+\/lecon-\d+(\.html)?#\d+\s*\|/.test(l); });
var parId = {};
L.forEach(function (l) {
  var p = l.split(" | ");
  var id = p[0].trim().replace(/^pages\//, "").replace(/\.html/, "");
  parId[id] = (p[1] || "").replace(/^\((correction|remplace)[^)]*\)\s*/i, "").trim();
});
var ids = Object.keys(parId).sort(function (a, b) {
  var x = a.match(/^(.*)\/lecon-(\d+)#(\d+)$/), y = b.match(/^(.*)\/lecon-(\d+)#(\d+)$/);
  return x[1].localeCompare(y[1]) || (+x[2] - +y[2]) || (+x[3] - +y[3]);
});
s += "\n## " + TITRE + "\n\nLa DERNIÈRE réservation de chaque cas.\n\n| Sujet | Foyer |\n|---|---|\n" +
  ids.map(function (id) { return "| " + parId[id].replace(/\|/g, "/") + " | `" + id + "` |"; }).join("\n") + "\n";
fs.writeFileSync(REG, s);
console.log(L.length + " lignes de réservation lues, " + ids.length + " cas distincts inscrits sous « " + TITRE + " »");
