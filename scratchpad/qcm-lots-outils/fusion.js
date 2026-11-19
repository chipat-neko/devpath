"use strict";
/* Fusion --no-ff des branches de la phase C dans master. Usage : node fusion.js <n> <cours> "<résumé>" ... (par triplets) */
var cp = require("child_process"), fs = require("fs"), path = require("path");
var a = process.argv.slice(2);
for (var i = 0; i + 2 < a.length + 1; i += 3) {
  var n = a[i], c = a[i + 1], resume = a[i + 2];
  var msg = "Fusion v18/c" + n + "-" + c + " : " + c + " -- QCM detordus, contre-relus et doses (" + resume + ")\n\n" +
    "V18, phase C, premier lot (C2 a C10), partie de 8d163bf. Un agent d'ecriture par cours (consigne\n" +
    "tools/qcm-lots/consigne-ecriture.md), puis une contre-relecture independante en deux parts, puis une\n" +
    "reprise du dosage quand les corrections justes rouvraient un indice. Detail : en-cours/rapports-v18/c" + n + "-" + c + ".md.\n" +
    "Controle de l'orchestrateur : fichiers du seul cours, 0 CR, blocs JSON valides, commits signes.\n\n" +
    "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n";
  var f = path.join(__dirname, "fusion-c" + n + "-" + c + ".txt");
  fs.writeFileSync(f, msg);
  var r = cp.spawnSync("git", ["-c", "core.autocrlf=false", "merge", "--no-ff", "v18/c" + n + "-" + c, "-F", f], { cwd: "D:/test-claude", encoding: "utf8" });
  console.log("C" + n + " " + c + " : code " + r.status + " " + (r.stdout || "").split("\n").filter(function (l) { return /changed|CONFLICT|Merge made|Already/.test(l); }).join(" | ") + (r.status ? " " + r.stderr : ""));
  if (r.status) process.exit(1);
}
