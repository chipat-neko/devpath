"use strict";
/* Contrôle d'une branche de la phase C avant fusion. Usage : node controle-c.js <n> <cours> [base=8d163bf]
   - fichiers changés : seulement pages/<cours>/**, scratchpad/CONSIGNE-<COURS>*.md, en-cours/rapports-v18/c<n>-<cours>.md ;
   - 0 CR dans chaque fichier changé (état commité) ; chaque bloc JSON QCM/exos valide ;
   - chaque commit porte Co-Authored-By ; pas de commit de fusion ; copie propre. */
var cp = require("child_process");
var n = process.argv[2], cours = process.argv[3], base = process.argv[4] || "8d163bf";
var dir = "D:/test-claude-c" + n + "-" + cours;
function git(a) { return cp.execFileSync("git", ["-c", "core.autocrlf=false"].concat(a), { cwd: dir, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] }); }
var pb = [];
var fichiers = git(["diff", "--name-only", base + "..HEAD"]).split("\n").filter(Boolean);
var MAJ = cours.toUpperCase().replace(/-/g, "_");
fichiers.forEach(function (f) {
  var ok = f.indexOf("pages/" + cours + "/") === 0 || new RegExp("^scratchpad/CONSIGNE-" + MAJ + "[^/]*\\.md$").test(f) ||
           f === "en-cours/rapports-v18/c" + n + "-" + cours + ".md";
  if (!ok) pb.push("fichier hors périmètre : " + f);
  var t; try { t = git(["show", "HEAD:" + f]); } catch (e) { return; }
  if (/\r/.test(t)) pb.push("CR dans " + f);
  if (/\.html$/.test(f)) {
    var re = /<script type="application\/json" (data-quiz-bilan|data-quiz|data-exos)[^>]*>([\s\S]*?)<\/script>/g, m;
    while ((m = re.exec(t))) { try { JSON.parse(m[2]); } catch (e) { pb.push("JSON invalide " + f + " " + m[1]); } }
  }
});
var commits = git(["log", "--format=%H%x09%P%x09%B%x00", base + "..HEAD"]).split("\0").map(function (s) { return s.trim(); }).filter(Boolean);
commits.forEach(function (c) {
  var p = c.split("\t");
  if (p[1].trim().split(" ").length > 1) pb.push("commit de fusion " + p[0].slice(0, 8));
  if (!/Co-Authored-By: Claude Opus 5\.5 <noreply@anthropic\.com>/.test(c)) pb.push("commit sans Co-Authored-By " + p[0].slice(0, 8));
});
var sale = git(["status", "--porcelain"]).trim();
if (sale) pb.push("copie non propre : " + sale.split("\n").length + " ligne(s)");
console.log("C" + n + " " + cours + " : " + commits.length + " commits, " + fichiers.length + " fichiers" + (pb.length ? "" : " — OK"));
pb.forEach(function (x) { console.log("  PROBLÈME  " + x); });
process.exit(pb.length ? 1 : 0);
