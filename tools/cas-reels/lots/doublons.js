/* =============================================================================
   tools/cas-reels/lots/doublons.js — un même « Cas réel » raconté dans PLUSIEURS cours.

   Né du lot 1 (B4 du CHANTIER-V18, 2026-11-14) : sept agents en parallèle, chacun
   tenu de ne pas répéter un cas DANS son cours, ont choisi indépendamment les mêmes
   histoires célèbres — la panne d'Azure du 29 février 2012 cinq fois, Ariane 5 trois
   fois. Chaque cas servait sa leçon ; l'apprenant qui suit plusieurs cours relit la
   même histoire. Ce contrôle les montre.

   Un DOUBLON = la même URL de source (sans « www. », sans fragment, sans « / » final)
   dans la ligne `cas-reel__source` de cas appartenant à au moins DEUX cours.
   Limite connue : deux cas sur le même événement cités par des URL différentes
   (rapport original et copie archivée, par exemple) ne sont pas vus — relire la liste
   des titres (`--titres`) pour ceux-là.

   USAGE : node tools/cas-reels/lots/doublons.js [--cours=a,b,…] [--titres] [--json]
   Code 0 toujours (outil de lecture) ; le nombre de groupes est en dernière ligne.
   ============================================================================= */
"use strict";
var fs = require("fs"), path = require("path");
var RACINE = path.join(__dirname, "..", "..", "..");
var ex = require(path.join(__dirname, "..", "extraction.js"));
var arg = function (n) { var a = process.argv.find(function (x) { return x.indexOf("--" + n + "=") === 0; }); return a ? a.split("=")[1] : null; };
var filtre = arg("cours") ? arg("cours").split(",") : null;
var JSONOUT = process.argv.indexOf("--json") >= 0, TITRES = process.argv.indexOf("--titres") >= 0;

var cas = [];
fs.readdirSync(path.join(RACINE, "pages")).forEach(function (d) {
  var dir = path.join(RACINE, "pages", d);
  if (!fs.statSync(dir).isDirectory() || (filtre && filtre.indexOf(d) < 0)) return;
  fs.readdirSync(dir).filter(function (f) { return /^lecon-\d+\.html$/.test(f); }).forEach(function (f) {
    var html = fs.readFileSync(path.join(dir, f), "utf8");
    ex.extraire(html).forEach(function (c) {
      var src = (String(c.corpsHtml).match(/<p class="cas-reel__source"[^>]*>[\s\S]*?<\/p>/gi) || []).pop() || "";
      var urls = [];
      src.replace(/href="(https?:\/\/[^"]+)"/g, function (_, u) {
        urls.push(u.replace(/#.*$/, "").replace(/\/$/, "").replace(/^https?:\/\/(www\.)?/, ""));
      });
      cas.push({ id: "pages/" + d + "/" + f + "#" + c.rang, cours: d, titre: c.titre, urls: urls });
    });
  });
});

var parUrl = {};
cas.forEach(function (c) { c.urls.forEach(function (u) { (parUrl[u] = parUrl[u] || []).push(c); }); });
var groupes = Object.keys(parUrl).map(function (u) {
  var cs = {}; parUrl[u].forEach(function (c) { cs[c.cours] = 1; });
  return { url: u, cours: Object.keys(cs), cas: parUrl[u].map(function (c) { return { id: c.id, titre: c.titre }; }) };
}).filter(function (g) { return g.cours.length >= 2; })
  .sort(function (a, b) { return b.cours.length - a.cours.length || a.url.localeCompare(b.url); });

if (JSONOUT) { console.log(JSON.stringify(groupes, null, 1)); process.exit(0); }
groupes.forEach(function (g) {
  console.log(g.cours.length + " cours — " + g.url);
  g.cas.forEach(function (c) { console.log("    " + c.id + "  |  " + c.titre); });
});
if (TITRES) {
  console.log("\nTITRES (pour les doublons que l'URL ne voit pas) :");
  cas.slice().sort(function (a, b) { return a.titre.localeCompare(b.titre); })
    .forEach(function (c) { console.log("  " + c.titre + "  |  " + c.id); });
}
console.log(cas.length + " « Cas réel » lus ; " + groupes.length + " source(s) partagée(s) entre cours.");
