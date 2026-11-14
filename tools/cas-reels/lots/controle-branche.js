/* =============================================================================
   tools/cas-reels/lots/controle-branche.js — contrôle d'une branche de lot AVANT fusion
   (orchestrateur des lots B4 à B12 du CHANTIER-V18).

   USAGE : node tools/cas-reels/lots/controle-branche.js <copie> [base=a244d0f]
   Sur l'état COMMITÉ (git show), pour chaque fichier changé depuis la base :
   - 0 CR ; aucun domaine interdit DE PLUS qu'à la base (le cours html ENSEIGNE le
     preconnect vers fonts.gstatic.com, en code échappé : ce n'est pas un ajout) ;
   - pages/*.html : hors des « Cas réel » (encadrés, sections, et l'intertitre <h2>/<h3>
     COLLÉ au-dessus d'un encadré), les OCTETS sont identiques à la base — lecture latin1,
     un caractère par octet : le mojibake volontaire de html/lecon-15 est comparé à l'octet ;
     le type de chaque encadré est inchangé ;
   - fichiers hors pages/ : seul en-cours/rapports-v18/b<N>-*.md est attendu (un autre
     fichier, comme le cliquet qcm-lexique-reference.json, se LIT avant d'être accepté) ;
   - chaque commit porte la ligne Co-Authored-By ; pas de commit de fusion ; copie propre.
   Piège corrigé au lot 1 : chercher l'encadré par '<div class="callout' tombait sur
   « callout__body » ; c'est '<div class="callout ' (avec l'espace) qui trouve l'extérieur.
   ============================================================================= */
"use strict";
var cp = require("child_process");
var dir = process.argv[2], base = process.argv[3] || "a244d0f";
function git(args, enc) {
  return cp.execFileSync("git", ["-c", "core.autocrlf=false"].concat(args),
    { cwd: dir, encoding: enc === undefined ? "utf8" : enc, maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });
}
function show(rev, p) { try { return git(["show", rev + ":" + p], "latin1"); } catch (e) { return null; } }

var E = "(?:Ã©|&eacute;|e)";          /* « é » en UTF-8 lu octet par octet */
var RE_CAS = new RegExp("^\\s*(?:Cas r" + E + "el|Sc" + E + "nario)", "i");
function zones(s) {
  var z = [], m, re = /<p class="callout__title">([\s\S]*?)<\/p>/g;
  while ((m = re.exec(s))) {
    if (!RE_CAS.test(m[1].replace(/<[^>]*>/g, ""))) continue;
    var deb = s.lastIndexOf('<div class="callout ', m.index);   /* l'encadré EXTÉRIEUR, pas callout__body */
    var suite = s.slice(re.lastIndex), f = /<\/div>\s*<\/div>/.exec(suite);
    var fin = f ? re.lastIndex + f.index + f[0].length : re.lastIndex;
    var type = /callout--([a-z]+)/.exec(s.slice(deb, m.index));
    /* un intertitre <h2>/<h3> COLLÉ au-dessus de l'encadré fait partie du cas */
    var hi = /<h([23])[^>]*>(?:(?!<\/?h[1-6][\s>])[\s\S]){0,300}?<\/h\1>\s*$/.exec(s.slice(Math.max(0, deb - 400), deb));
    if (hi) deb = Math.max(0, deb - 400) + hi.index;
    z.push({ deb: deb, fin: fin, type: type ? type[1] : "?", titre: m[1] });
  }
  var rh = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/g;
  while ((m = rh.exec(s))) {
    if (!RE_CAS.test(m[2].replace(/<[^>]*>/g, ""))) continue;
    var reste = s.slice(rh.lastIndex);
    var st = (m[1] === "2" ? /<h2[\s>]|<\/article>|<\/main>|<nav[\s>]|<footer[\s>]/ :
                             /<h[23][\s>]|<\/article>|<\/main>|<nav[\s>]|<footer[\s>]/).exec(reste);
    var fin2 = st ? rh.lastIndex + st.index : rh.lastIndex;
    if (z.some(function (x) { return x.deb >= m.index && x.deb < fin2; })) {
      /* section qui enveloppe un encadré : on masque la section entière */
      z = z.filter(function (x) { return !(x.deb >= m.index && x.deb < fin2); });
    }
    z.push({ deb: m.index, fin: fin2, type: "section", titre: m[2] });
  }
  z.sort(function (a, b) { return a.deb - b.deb; });
  return z;
}
function masquer(s, z) {
  var out = "", i = 0;
  z.forEach(function (x) { if (x.deb < i) return; out += s.slice(i, x.deb) + "§CAS§"; i = x.fin; });
  return out + s.slice(i);
}
var u8 = function (s) { return Buffer.from(s, "latin1").toString("utf8"); };

var pb = [], nPages = 0, nZonesA = 0, nZonesN = 0, autres = [];
var fichiers = git(["diff", "--name-only", base + "..HEAD"]).split("\n").filter(Boolean);
fichiers.forEach(function (p) {
  var n = show("HEAD", p), a = show(base, p);
  if (n === null) { pb.push(p + " : SUPPRIMÉ"); return; }
  var cr = (n.match(/\r/g) || []).length;
  if (cr) pb.push(p + " : " + cr + " CR");
  ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"].forEach(function (d) {
    var cN = n.split(d).length - 1, cA = a === null ? 0 : a.split(d).length - 1;
    if (cN > cA) pb.push(p + " : domaine interdit " + d + " (" + cA + " -> " + cN + ")");
  });
  if (!/^pages\/.*\.html$/.test(p)) { autres.push(p); return; }
  nPages++;
  if (a === null) { pb.push(p + " : page NOUVELLE"); return; }
  var za = zones(a), zn = zones(n);
  nZonesA += za.length; nZonesN += zn.length;
  if (za.length !== zn.length) pb.push(p + " : " + za.length + " zones avant, " + zn.length + " après");
  var ma = masquer(a, za), mn = masquer(n, zn);
  if (ma !== mn) {
    var i = 0; while (i < ma.length && ma[i] === mn[i]) i++;
    pb.push(p + " : HORS « Cas réel », diffère à l'octet " + i + " : avant «" + u8(ma.slice(Math.max(0, i - 60), i + 80)).replace(/\n/g, "⏎") +
      "» / après «" + u8(mn.slice(Math.max(0, i - 60), i + 80)).replace(/\n/g, "⏎") + "»");
  }
  za.forEach(function (x, k) { if (zn[k] && zn[k].type !== x.type) pb.push(p + " : type " + x.type + " -> " + zn[k].type + " (zone " + (k + 1) + ")"); });
});
var autresInattendus = autres.filter(function (p) { return !/^en-cours\/rapports-v18\/b\d+-[a-z0-9-]+\.md$/.test(p); });
autresInattendus.forEach(function (p) { pb.push(p + " : fichier HORS pages/ inattendu"); });

var commits = git(["log", "--format=%H%x09%s", base + "..HEAD"]).split("\n").filter(Boolean);
commits.forEach(function (l) {
  var h = l.split("\t")[0];
  var corps = git(["log", "-1", "--format=%B", h]);
  if (corps.indexOf("Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>") < 0) pb.push("commit " + h.slice(0, 7) + " : pas de Co-Authored-By");
  var par = git(["log", "-1", "--format=%P", h]).trim().split(" ");
  if (par.length > 1) pb.push("commit " + h.slice(0, 7) + " : commit de FUSION");
});
var sale = git(["status", "--porcelain", "--untracked-files=no"]).trim();
if (sale) pb.push("copie NON propre : " + sale.split("\n").length + " ligne(s)");

console.log(dir + " : " + commits.length + " commits, " + fichiers.length + " fichiers (" + nPages + " pages ; autres : " + autres.join(", ") + ")");
console.log("zones « Cas réel / Scénario » : " + nZonesA + " avant, " + nZonesN + " après");
console.log(pb.length ? "PROBLÈMES (" + pb.length + ") :\n- " + pb.join("\n- ") : "OK : 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, signatures, copie propre.");
process.exit(pb.length ? 1 : 0);
