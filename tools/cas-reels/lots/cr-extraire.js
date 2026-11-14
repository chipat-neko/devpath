/* =============================================================================
   tools/cas-reels/lots/cr-extraire.js — préparer la CONTRE-RELECTURE d'une branche de lot.

   Extrait, de l'état COMMITÉ d'une copie de travail, les « Cas réel » des pages changées
   depuis une base, et les répartit en parts contiguës (par leçon) pour des agents en
   lecture seule. Chaque entrée : id (page#rang), titre de la leçon, titre du cas, texte,
   ligne de source, liens, HTML exact du corps — et l'INTERTITRE <h2>/<h3> collé au-dessus
   de l'encadré, quand il existe : au lot 1, 13 intertitres « Un cas réel : … » sur 46 cas
   (csharp) annonçaient l'ANCIEN récit après remplacement du corps ; la contre-relecture
   ne les voit que s'ils sont dans sa part.

   USAGE : node tools/cas-reels/lots/cr-extraire.js <copie> <nom> <nbParts> <dossierSortie> [base]
   Écrit <dossierSortie>/<nom>-part-K.json. Base par défaut : a244d0f (départ du lot 1).
   ============================================================================= */
"use strict";
var cp = require("child_process"), fs = require("fs"), path = require("path");
var dir = process.argv[2], nom = process.argv[3], nb = +process.argv[4] || 1, out = process.argv[5];
var base = process.argv[6] || "a244d0f";
if (!dir || !nom || !out) { console.error("usage : cr-extraire.js <copie> <nom> <nbParts> <dossierSortie> [base]"); process.exit(2); }
var ex = require(path.join(__dirname, "..", "extraction.js"));
function git(a) { return cp.execFileSync("git", ["-c", "core.autocrlf=false"].concat(a), { cwd: dir, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] }); }
var pages = git(["diff", "--name-only", base + "..HEAD"]).split("\n").filter(function (p) { return /^pages\/.*\.html$/.test(p); }).sort();
var cas = [];
pages.forEach(function (p) {
  var html = git(["show", "HEAD:" + p]);
  var titreLecon = (/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html) || [, ""])[1];
  /* intertitre collé AU-DESSUS d'un encadré ; son contenu ne traverse aucune balise de titre */
  var inter = {}, mi, reI = /<h([23])[^>]*>((?:(?!<\/?h[1-6][\s>])[\s\S]){0,300}?)<\/h\1>\s*<div class="callout[^"]*">(?:(?!<\/div>)[\s\S]){0,1500}?<p class="callout__title">([\s\S]*?)<\/p>/g;
  while ((mi = reI.exec(html))) inter[ex.texte(mi[3])] = { html: mi[0].slice(0, mi[0].indexOf("</h") + 5), texte: ex.texte(mi[2]) };
  ex.extraire(html).forEach(function (c) {
    var src = (String(c.corpsHtml).match(/<p class="cas-reel__source"[^>]*>[\s\S]*?<\/p>/gi) || []).pop() || "";
    var liens = []; src.replace(/href="([^"]+)"/g, function (_, u) { liens.push(u); });
    var o = { id: p + "#" + c.rang, lecon: ex.texte(titreLecon), titre: c.titre, texte: c.corps,
              source: ex.texte(src), liens: liens, html: c.corpsHtml.trim() };
    if (inter[c.titre] && c.type !== "section") { o.intertitre = inter[c.titre].texte; o.intertitreHtml = inter[c.titre].html; }
    cas.push(o);
  });
});
if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
var taille = Math.ceil(cas.length / nb);
for (var k = 0; k < nb; k++) {
  var part = cas.slice(k * taille, (k + 1) * taille);
  fs.writeFileSync(path.join(out, nom + "-part-" + (k + 1) + ".json"), JSON.stringify(part, null, 1));
  console.log(nom + "-part-" + (k + 1) + " : " + part.length + " cas (" + (part[0] || {}).id + " … " + (part[part.length - 1] || {}).id + ")");
}
