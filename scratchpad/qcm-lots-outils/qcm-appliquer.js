"use strict";
/* Phase C : applique les verdicts A_CORRIGER d'une contre-relecture de QCM dans la copie d'un cours,
   puis remesure ce cours. Usage : node qcm-appliquer.js <copie> <cours> <verdicts.json>... [--sec]
   --sec : n'écrit rien, dit seulement ce qui s'appliquerait. Refuse (sans rien écrire du tout) si un
   « avant » n'est pas présent UNE seule fois, ou si un bloc JSON d'une page modifiée devient invalide. */
var fs = require("fs"), path = require("path"), cp = require("child_process");
var args = process.argv.slice(2).filter(function (x) { return x !== "--sec"; });
var SEC = process.argv.indexOf("--sec") !== -1;
var copie = args[0], cours = args[1], fichiers = args.slice(2);
if (!copie || !cours || !fichiers.length) { console.error("usage : node qcm-appliquer.js <copie> <cours> <verdicts.json>... [--sec]"); process.exit(2); }
var V = [];
fichiers.forEach(function (f) { V = V.concat(JSON.parse(fs.readFileSync(f, "utf8"))); });
var corr = V.filter(function (v) { return v.verdict === "A_CORRIGER" && v.avant; });
var sansTexte = V.filter(function (v) { return v.verdict === "A_CORRIGER" && !v.avant; });
console.log(V.length + " entrées lues, " + corr.length + " corrections avec texte, " + sansTexte.length + " sans texte (à poser à la main)");
sansTexte.forEach(function (v) { console.log("  SANS TEXTE  " + v.page + " q" + v.question + " o" + v.option + " — " + (v.faute || "") + " — " + String(v.preuve || "").slice(0, 160)); });
var pages = {}, refus = [];
corr.forEach(function (v) {
  var f = path.join(copie, v.page);
  var t = pages[f] !== undefined ? pages[f] : fs.readFileSync(f, "utf8");
  var n = t.split(v.avant).length - 1;
  if (n !== 1) { refus.push(v.page + " q" + v.question + " o" + v.option + " : « avant » trouvé " + n + " fois"); return; }
  pages[f] = t.replace(v.avant, function () { return v.apres; });
  console.log("  ok  " + v.page.replace("pages/", "") + " q" + v.question + " o" + v.option + " " + (v.faute || ""));
});
function blocsInvalides(t) {
  var re = /<script type="application\/json" (data-quiz-bilan|data-quiz|data-exos)[^>]*>([\s\S]*?)<\/script>/g, m, bad = [];
  while ((m = re.exec(t))) { try { JSON.parse(m[2]); } catch (e) { bad.push(m[1] + " : " + e.message); } }
  return bad;
}
Object.keys(pages).forEach(function (f) {
  var b = blocsInvalides(pages[f]);
  if (b.length) refus.push(path.basename(f) + " : JSON invalide après application — " + b.join(" ; "));
  if (/\r/.test(pages[f]) && !/\r/.test(fs.readFileSync(f, "utf8"))) refus.push(path.basename(f) + " : CR introduit");
});
if (refus.length) { console.log("REFUS (rien n'est écrit) :"); refus.forEach(function (r) { console.log("  " + r); }); process.exit(1); }
if (SEC) { console.log("--sec : " + Object.keys(pages).length + " page(s) seraient modifiées."); process.exit(0); }
Object.keys(pages).forEach(function (f) { fs.writeFileSync(f, pages[f]); });
console.log(Object.keys(pages).length + " page(s) écrite(s). Mesure du cours :");
var j = JSON.parse(cp.execFileSync(process.execPath, [path.join(copie, "tools", "mesure-biais-qcm.js"), "--json"], { cwd: copie, encoding: "utf8", maxBuffer: 1 << 28 }));
var c = j.parCours.filter(function (x) { return x.cours === cours; })[0];
var top = Object.keys(c.parStrategie).map(function (k) { return [k, c.parStrategie[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5);
console.log("  la plus longue " + (100 * c.longueur).toFixed(1) + " % ; pires : " + top.map(function (x) { return x[0] + " " + (100 * x[1]).toFixed(1) + " %"; }).join(", "));
