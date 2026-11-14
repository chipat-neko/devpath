/* =============================================================================
   tools/cas-reels/lots/cr-appliquer.js — appliquer les corrections d'une CONTRE-RELECTURE
   dans une copie de lot.

   USAGE : node tools/cas-reels/lots/cr-appliquer.js <copie> <verdicts.json>... [--sec]
           (--sec : aperçu, n'écrit rien — le lancer d'abord, et LIRE chaque correction)
   - travaille à l'OCTET (latin1) : un mojibake volontaire n'est jamais réencodé ;
   - chaque `avant` doit apparaître UNE seule fois dans la page, et DANS la zone d'un
     « Cas réel » (titre d'encadré ou intertitre « Cas réel » / « Un cas réel » qui précède) ;
     sinon la correction est REFUSÉE et listée — à traiter à la main ;
   - les A_REMPLACER et INACCESSIBLE sont listés, pas traités.
   ⚠ ENSUITE, TOUJOURS : lexique-diff.js. Au lot 1, trois corrections justes ont fait
   rougir le cliquet lexical (un mot d'option de QCM entré dans la page ou sorti d'elle :
   « réservées », puis « moitié », « pendant », « fausse » — php INVERSE 0 % -> 100 %).
   Format des verdicts : voir consigne-contre-relecture.md (même dossier).
   ============================================================================= */
"use strict";
var fs = require("fs"), path = require("path");
var args = process.argv.slice(2), sec = args.indexOf("--sec") >= 0;
args = args.filter(function (a) { return a !== "--sec"; });
var dir = args.shift();
var L = function (s) { return Buffer.from(s, "utf8").toString("latin1"); };
var ok = 0, ko = [], aTraiter = [], pages = {};
args.forEach(function (f) {
  JSON.parse(fs.readFileSync(f, "utf8")).forEach(function (v) {
    if (v.verdict === "A_REMPLACER" || v.verdict === "INACCESSIBLE") { aTraiter.push(v.verdict + " " + v.id + " : " + (v.remarque || "")); return; }
    if (v.verdict !== "A_CORRIGER") return;
    var p = v.id.split("#")[0], abs = path.join(dir, p);
    if (!pages[p]) pages[p] = fs.readFileSync(abs, "latin1");
    (v.corrections || []).forEach(function (c, i) {
      var av = L(c.avant), ap = L(c.apres || "");
      var s = pages[p], n = s.split(av).length - 1;
      if (n !== 1) { ko.push(v.id + " correction " + (i + 1) + " : `avant` trouvé " + n + " fois — «" + c.avant.slice(0, 90) + "»"); return; }
      /* dans la zone du cas : entre le titre « Cas réel » qui précède et la fin d'encadré qui suit */
      var pos = s.indexOf(av);
      var avantTxt = s.slice(0, pos + 30);   /* + 30 : un `avant` qui COMMENCE par <h2> ou par le titre */
      var t = Math.max(avantTxt.lastIndexOf('<p class="callout__title">'), avantTxt.search(/<h[23][^>]*>(?![\s\S]*<h[23][^>]*>)/));
      if (t < 0 || !/[Cc]as r(?:Ã©|&eacute;)el/.test(s.slice(t, t + 200))) { ko.push(v.id + " correction " + (i + 1) + " : hors d'une zone « Cas réel »"); return; }
      pages[p] = s.split(av).join(ap); ok++;
    });
  });
});
Object.keys(pages).forEach(function (p) {
  if ((pages[p].match(/\r/g) || []).length) ko.push(p + " : CR présents");
  if (!sec) fs.writeFileSync(path.join(dir, p), pages[p], "latin1");
});
console.log((sec ? "[APERÇU] " : "") + ok + " correction(s) appliquée(s) dans " + Object.keys(pages).length + " page(s)");
if (ko.length) console.log("REFUSÉES (" + ko.length + ") :\n- " + ko.join("\n- "));
if (aTraiter.length) console.log("À TRAITER À LA MAIN (" + aTraiter.length + ") :\n- " + aTraiter.join("\n- "));
process.exit(ko.length ? 1 : 0);
