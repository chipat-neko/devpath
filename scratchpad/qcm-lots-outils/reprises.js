"use strict";
/* Remplit consigne-reprise-modele.md. Usage : node reprises.js <n> <cours> "<état>" "<mission>" */
var fs = require("fs"), path = require("path");
var a = process.argv.slice(2), n = a[0], c = a[1], etat = a[2], mission = a[3];
var W = path.win32.normalize(__dirname);
var t = fs.readFileSync(path.join(__dirname, "consigne-reprise-modele.md"), "utf8")
  .split("__COURS__").join(c).split("__CASE__").join("C" + n)
  .split("__DOSSIERBASH__").join("/d/test-claude-c" + n + "-" + c)
  .split("__DOSSIER__").join("D:\\test-claude-c" + n + "-" + c)
  .split("__BRANCHE__").join("v18/c" + n + "-" + c).split("__BASE__").join("8d163bf")
  .split("__CONSIGNE__").join(path.win32.join(W, "consigne-c" + n + "-" + c + ".md"))
  .split("__RAPPORT__").join("D:\\test-claude-c" + n + "-" + c + "\\en-cours\\rapports-v18\\c" + n + "-" + c + ".md")
  .split("__ETAT__").join(etat).split("__MISSION__").join(mission);
var reste = t.match(/__[A-Z]+__/g);
if (reste) throw new Error("champs non remplis : " + reste.join(", "));
var out = path.join(__dirname, "consigne-c" + n + "-" + c + "-reprise.md");
fs.writeFileSync(out, t);
console.log(path.win32.join(W, path.basename(out)));
