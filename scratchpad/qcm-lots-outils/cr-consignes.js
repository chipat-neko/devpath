"use strict";
/* Remplit tools/qcm-lots/consigne-contre-relecture.md pour un cours de la phase C, en parts.
   Usage : node cr-consignes.js <n> <cours> <base> "<part 1>" "<part 2>" ...
   ex. node cr-consignes.js 2 cloud 8d163bf "lecon-01 à lecon-06" "lecon-07 à lecon-12 (bilan compris)" */
var fs = require("fs"), path = require("path");
var a = process.argv.slice(2), n = a[0], cours = a[1], base = a[2], parts = a.slice(3);
if (!parts.length) { console.error("usage : node cr-consignes.js <n> <cours> <base> <part>..."); process.exit(2); }
var MODELE = fs.readFileSync("D:/test-claude/tools/qcm-lots/consigne-contre-relecture.md", "utf8").replace(/<!--[\s\S]*?-->\n/, "");
var W = path.win32.normalize(__dirname);
parts.forEach(function (p, k) {
  var nom = "c" + n + "-" + cours + "-cr-" + (k + 1);
  var t = MODELE.split("__COURS__").join(cours).split("__CASE__").join("C" + n)
    .split("__DOSSIERBASH__").join("/d/test-claude-c" + n + "-" + cours)
    .split("__DOSSIER__").join("D:\\test-claude-c" + n + "-" + cours)
    .split("__BASE__").join(base).split("__PART__").join(p)
    .split("__SORTIE__").join(path.win32.join(W, nom + "-verdicts.json"))
    .split("__TELECH__").join(path.win32.join(W, "telech-" + nom))
    .split("__RAPPORT__").join("D:\\test-claude-c" + n + "-" + cours + "\\en-cours\\rapports-v18\\c" + n + "-" + cours + ".md");
  var reste = t.match(/__[A-Z]+__/g);
  if (reste) throw new Error("champs non remplis : " + reste.join(", "));
  fs.writeFileSync(path.join(__dirname, "consigne-" + nom + ".md"), t);
  console.log(path.win32.join(W, "consigne-" + nom + ".md") + "  (" + p + ")");
});
