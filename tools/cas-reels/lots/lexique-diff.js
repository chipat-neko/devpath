/* =============================================================================
   tools/cas-reels/lots/lexique-diff.js — quels MOTS D'OPTIONS de QCM une retouche de page
   a fait entrer dans la page, ou en a fait sortir.

   Écrit par l'agent du lot 1 php-ruby (B4 du CHANTIER-V18), généralisé par l'orchestrateur.
   Pour chaque page MODIFIÉE dans la copie (git diff contre REV, HEAD par défaut) : les mots
   (6 lettres et plus, la définition de mesure-lexique-qcm.js) des options de QCM de la page
   dont la présence a changé. GAGNÉS = absents avant, présents maintenant ; PERDUS = l'inverse.
   Les deux comptent : un mot de DISTRACTEUR qui sort de la page fait ressortir la bonne
   réponse (INVERSE), un mot de la BONNE réponse qui sort la rend « étrangère » à la page.
   Visée : 0 écart. Le cliquet verif-qcm-lexique.js tolère 2 points ; ce diff, aucun.

   USAGE : node tools/cas-reels/lots/lexique-diff.js <copie> [REV]
   ============================================================================= */
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var dir = process.argv[2], rev = process.argv[3] || "HEAD";
function git(a) { return cp.execFileSync("git", ["-c", "core.autocrlf=false"].concat(a), { cwd: dir, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] }); }
function mots(t) {
  var m = String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g) || [];
  return m.map(function (w) { return w.replace(/^[' -]+|[' -]+$/g, ""); }).filter(Boolean);
}
function texteDeLaPage(src) { return src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g, " "); }
var RE_QUIZ = /<script[^>]*data-quiz(?:-bilan)?[^>]*>([\s\S]*?)<\/script>/g;
function options(src) {
  var out = new Set(), m, re = new RegExp(RE_QUIZ.source, "g");
  while ((m = re.exec(src))) {
    var qs; try { qs = JSON.parse(m[1]); } catch (e) { continue; }
    if (Array.isArray(qs)) qs.forEach(function (q) { if (q && Array.isArray(q.a)) q.a.forEach(function (o) { mots(o).forEach(function (w) { out.add(w); }); }); });
  }
  return out;
}
var fichiers = git(["diff", "--name-only", rev]).split("\n").filter(function (p) { return /^pages\/.*\.html$/.test(p); });
var total = 0;
fichiers.forEach(function (p) {
  var neuf = fs.readFileSync(path.join(dir, p), "utf8"), vieux = git(["show", rev + ":" + p]);
  var opt = options(vieux), pv = new Set(mots(texteDeLaPage(vieux))), pn = new Set(mots(texteDeLaPage(neuf)));
  var perdus = [], gagnes = [];
  opt.forEach(function (w) { if (pv.has(w) && !pn.has(w)) perdus.push(w); if (!pv.has(w) && pn.has(w)) gagnes.push(w); });
  if (perdus.length || gagnes.length) { total += perdus.length + gagnes.length; console.log(p + "  PERDUS: " + perdus.join(", ") + "  |  GAGNÉS: " + gagnes.join(", ")); }
});
console.log(fichiers.length + " pages comparées à " + rev + ", " + total + " écart(s)");
