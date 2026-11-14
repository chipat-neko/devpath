/* =============================================================================
   tools/verif-cas-reel-mutations.js — l'épreuve par injection de LA RÈGLE des
   « Cas réel » (B3 du CHANTIER-V18). Node pur. Modifie TEMPORAIREMENT une page,
   puis la restaure à l'octet près (relue et comparée), même sur interruption.

   La règle (tools/cas-reels/extraction.js, appliquée par `verif-contenu.js
   --cas-reel`) : un « Cas réel » nomme son sujet et sa date dans son titre et se
   termine par un <p class="cas-reel__source">Source : … (date ou lien)</p>.

   On part d'un cas CONFORME — Knight Capital, pages/tests/lecon-14.html — et on y
   pose une faute à la fois. Chaque faute doit faire apparaître CE cas (ou la section
   injectée) dans la liste « HORS REGLE » AVEC LA RAISON ATTENDUE : un rouge venu
   d'ailleurs ne compte pas (le cours `tests` a d'autres cas hors de la règle, donc
   le code de sortie seul ne prouve rien). Des témoins négatifs doivent, eux, laisser
   le cas conforme. Témoin d'abord : sans faute, le cas doit être conforme, sinon
   rien n'a de sens (code 2).

     node tools/verif-cas-reel-mutations.js        # 0 : tout vu ; 1 : une faute passée ; 2 : rien de mesuré
   ============================================================================= */
"use strict";
var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..");
var PAGE = "pages/tests/lecon-14.html";
var ID = PAGE + "#1";
var ABS = path.join(RACINE, PAGE);
var ORIGINAL = fs.readFileSync(ABS);
var TXT = ORIGINAL.toString("utf8");
var NL = /\r\n/.test(TXT) ? "\r\n" : "\n";

function restaurer() { fs.writeFileSync(ABS, ORIGINAL); }
process.on("exit", restaurer);
["SIGINT", "SIGTERM"].forEach(function (s) { process.on(s, function () { restaurer(); process.exit(130); }); });
process.on("uncaughtException", function (e) { restaurer(); console.error(e); process.exit(2); });

function mesurer() {
  var r = cp.spawnSync(process.execPath, [path.join(RACINE, "tools", "verif-contenu.js"), "--cas-reel", "--cours=tests"],
                       { cwd: RACINE, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  var sortie = r.stdout || "";
  var m = /(\d+) conformes a la regle, (\d+) hors de la regle/.exec(sortie);
  var hors = {};
  sortie.split("\n").forEach(function (l) {
    var h = /^  HORS REGLE  (\S+) — .* — (.+)$/.exec(l);
    if (h) hors[h[1]] = h[2];
  });
  return { code: r.status, conformes: m ? +m[1] : null, nhors: m ? +m[2] : null, hors: hors, sortie: sortie };
}

var SOURCE = /<p class="cas-reel__source">[\s\S]*?<\/p>/;
var TITRE = '<p class="callout__title">Cas réel — Knight Capital (2012)</p>';
var SECTION_OK = "<h2>Cas réel — Témoin d'épreuve (2020)</h2>" + NL + "<p>Paragraphe témoin.</p>" + NL +
  '<p class="cas-reel__source">Source : document témoin daté de 2020.</p>' + NL;
var SECTION_KO = "<h2>Cas réel — Témoin d'épreuve (2020)</h2>" + NL + "<p>Paragraphe témoin, sans source.</p>" + NL;
var ID_SECTION = null; /* rang de la section injectée : calculé au témoin */

function remplacerUneFois(t, motif, par) {
  var n = typeof motif === "string" ? t.split(motif).length - 1 : (t.match(new RegExp(motif.source, "g")) || []).length;
  if (n !== 1) return null;
  return t.replace(motif, function () { return par; });
}

var CAS = [
  { id: "M1", quoi: "source retirée", attendu: "pas de source",
    faire: function (t) { return remplacerUneFois(t, SOURCE, ""); } },
  { id: "M2", quoi: "source vidée", attendu: "source vide",
    faire: function (t) { return remplacerUneFois(t, SOURCE, '<p class="cas-reel__source">Source : </p>'); } },
  { id: "M3", quoi: "source sans date ni lien", attendu: "source sans date ni lien",
    faire: function (t) { return remplacerUneFois(t, SOURCE, '<p class="cas-reel__source">Source : une ordonnance de la SEC visant Knight Capital Americas.</p>'); } },
  { id: "M4", quoi: "titre sans date", attendu: "titre sans date",
    faire: function (t) { return remplacerUneFois(t, TITRE, '<p class="callout__title">Cas réel — Knight Capital</p>'); } },
  { id: "M5", quoi: "titre sans sujet", attendu: "titre sans sujet",
    faire: function (t) { return remplacerUneFois(t, TITRE, '<p class="callout__title">Cas réel (2012)</p>'); } },
  { id: "M6", quoi: "paragraphe de source mal nommé (cas-reel-source)", attendu: "pas de source",
    faire: function (t) { var s = SOURCE.exec(t); return s && remplacerUneFois(t, SOURCE, s[0].replace("cas-reel__source", "cas-reel-source")); } },
  { id: "M7", quoi: "source sortie de l'encadré", attendu: "pas de source",
    faire: function (t) {
      var s = SOURCE.exec(t); if (!s) return null;
      var sans = t.replace(SOURCE, "");
      var i = sans.indexOf(TITRE); if (i < 0) return null;
      var f = /<\/div>\s*<\/div>/.exec(sans.slice(i)); if (!f) return null;
      var j = i + f.index + f[0].length;
      return sans.slice(0, j) + NL + s[0] + sans.slice(j);
    } },
  { id: "M8", quoi: "section « Cas réel » sans source", attendu: "pas de source", section: true,
    faire: function (t) { return remplacerUneFois(t, "<h2>Antisèche</h2>", SECTION_KO + "<h2>Antisèche</h2>"); } },
  { id: "M9", quoi: "page entière en CRLF, puis source retirée", attendu: "pas de source",
    faire: function (t) { var u = remplacerUneFois(t, SOURCE, ""); return u && u.replace(/\r?\n/g, "\r\n"); } },
  /* Témoins négatifs : le cas doit RESTER conforme. */
  { id: "N1", quoi: "source par un lien, sans année", negatif: true,
    faire: function (t) { return remplacerUneFois(t, SOURCE, '<p class="cas-reel__source">Source : <a href="https://www.sec.gov/">SEC</a>, ordonnance visant Knight Capital Americas.</p>'); } },
  { id: "N2", quoi: "titre avec un tiret court (–)", negatif: true,
    faire: function (t) { return remplacerUneFois(t, TITRE, '<p class="callout__title">Cas réel – Knight Capital (2012)</p>'); } },
  { id: "N3", quoi: "titre avec deux-points", negatif: true,
    faire: function (t) { return remplacerUneFois(t, TITRE, '<p class="callout__title">Cas réel&nbsp;: Knight Capital (2012)</p>'); } },
  { id: "N4", quoi: "section « Cas réel » conforme ajoutée", negatif: true, section: true,
    faire: function (t) { return remplacerUneFois(t, "<h2>Antisèche</h2>", SECTION_OK + "<h2>Antisèche</h2>"); } },
];

console.log("verif-cas-reel-mutations.js — " + CAS.length + " cas sur " + PAGE + " (" + (NL === "\n" ? "LF" : "CRLF") + ")\n");
var t0 = mesurer();
if (t0.conformes === null || t0.hors[ID] !== undefined) {
  console.log("[témoin] " + ID + " n'est PAS conforme sans faute (" + (t0.hors[ID] || "sortie illisible") + ") : la mesure n'a pas de sens.");
  process.exit(2);
}
console.log("[témoin] sans faute : " + ID + " conforme · cours tests : " + t0.conformes + " conformes, " + t0.nhors + " hors de la règle\n");

var vues = 0, passees = [], nonApplicables = [], negatifsOk = 0, negatifsKo = [];
CAS.forEach(function (c, k) {
  var mute = c.faire(TXT);
  if (!mute) { nonApplicables.push(c.id); console.log("[" + (k + 1) + "/" + CAS.length + "] " + c.id + " " + c.quoi + " : NON APPLICABLE (motif introuvable)"); return; }
  fs.writeFileSync(ABS, mute);
  var r = mesurer();
  restaurer();
  if (Buffer.compare(fs.readFileSync(ABS), ORIGINAL) !== 0) { console.log("RESTAURATION RATÉE : " + PAGE); process.exit(2); }
  /* La section injectée précède « Antisèche » : elle prend le rang suivant le dernier cas de la page. */
  var cible = c.section ? Object.keys(r.hors).filter(function (h) { return h.indexOf(PAGE + "#") === 0 && h !== ID; })[0] || null : ID;
  if (c.negatif) {
    var ok = r.hors[ID] === undefined && (c.section ? r.conformes === t0.conformes + 1 : r.conformes === t0.conformes);
    if (ok) negatifsOk++; else negatifsKo.push(c.id);
    console.log("[" + (k + 1) + "/" + CAS.length + "] " + c.id + " " + c.quoi + " : " + (ok ? "reste CONFORME" : "REJETÉ À TORT") +
      " (conformes " + r.conformes + ")");
    return;
  }
  var raisons = cible ? r.hors[cible] : undefined;
  var vu = raisons !== undefined && raisons.indexOf(c.attendu) !== -1;
  if (vu) vues++; else passees.push(c.id + " " + c.quoi);
  console.log("[" + (k + 1) + "/" + CAS.length + "] " + c.id + " " + c.quoi + " : " + (vu ? "VUE" : "PASSÉE INAPERÇUE") +
    " — " + (cible || "(aucun cas de la page signalé)") + " : " + (raisons || "conforme"));
});

var nFautes = CAS.filter(function (c) { return !c.negatif; }).length;
var nNeg = CAS.length - nFautes;
console.log("\n  fautes vues ................ " + vues + " / " + nFautes);
console.log("  témoins négatifs conformes . " + negatifsOk + " / " + nNeg);
console.log("  non applicables ............ " + nonApplicables.length + (nonApplicables.length ? " (" + nonApplicables.join(", ") + ")" : ""));
console.log("  page restaurée et relue .... " + (Buffer.compare(fs.readFileSync(ABS), ORIGINAL) === 0 ? "oui" : "NON"));
if (passees.length || negatifsKo.length || nonApplicables.length) {
  passees.forEach(function (p) { console.log("  ✗ passée : " + p); });
  negatifsKo.forEach(function (p) { console.log("  ✗ témoin rejeté à tort : " + p); });
  console.log("RESULTAT : " + vues + "/" + nFautes + " FAUTES VUES — L'ÉPREUVE ÉCHOUE");
  process.exit(1);
}
console.log("RESULTAT : " + vues + "/" + nFautes + " FAUTES VUES, " + negatifsOk + " TÉMOINS VERTS");
process.exit(0);
