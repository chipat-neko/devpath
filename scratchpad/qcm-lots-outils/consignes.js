"use strict";
/* Phase C du V18, premier lot (C2 à C10) : remplit tools/qcm-lots/consigne-ecriture.md pour chaque
   cours. La mesure de départ est relue par l'outil (--json) sur la base, pas recopiée. */
var fs = require("fs"), path = require("path"), cp = require("child_process");
var BASE = process.argv[2];
if (!BASE) { console.error("usage : node consignes.js <base>"); process.exit(2); }
var MODELE = fs.readFileSync("D:/test-claude/tools/qcm-lots/consigne-ecriture.md", "utf8");
var j = JSON.parse(cp.execFileSync(process.execPath, ["D:/test-claude/tools/mesure-biais-qcm.js", "--json"],
  { cwd: "D:/test-claude", encoding: "utf8", maxBuffer: 1 << 28 }));
var par = {}; j.parCours.forEach(function (c) { par[c.cours] = c; });
function pct(x) { return (100 * x).toFixed(1).replace(".", ",") + " %"; }

var EXEC = {
  cloud: "les fournisseurs (AWS, Google Cloud, Azure) ne s'exécutent pas ici : chaque bonne réponse qui décrit un service se vérifie dans la documentation officielle de ce service, à sa version ou à sa date, et un comportement de Node ou de Python s'exécute.",
  reseaux: "Node 26 (`dns`, `net`, `http`) et Python 3.14 (`socket`, `ipaddress`) exécutent ce qui touche aux adresses, aux masques et aux protocoles ; les RFC font foi pour le reste (cite le numéro et la section).",
  wasm: "Node 26 exécute WebAssembly : un module `.wat` se compile avec `wabt` (paquet npm installé dans `D:\\outils-c\\wasm\\`, jamais dans le dépôt) ; la spécification du W3C et le blog de V8 font foi. Les « Cas réel » de `wasm` ont été réécrits au lot 9 (B12) : un QCM qui en parle doit dire la même chose que l'encadré.",
  ml: "Python 3.14 : installe ce qu'il faut (numpy, scikit-learn…) dans un environnement virtuel sous `D:\\outils-c\\ml\\` (jamais dans le dépôt) et rejoue chaque calcul, chaque sortie, chaque valeur par défaut d'une bibliothèque (à la version citée).",
  erlang: "Erlang/OTP 29.1.2 : l'archive officielle est dans `D:\\test-claude\\scratchpad\\outils-portables\\archives\\otp_win64_29.1.2.zip` ; décompresse-la dans `D:\\outils-c\\erlang\\` et exécute (`erl`, `erlc`, `escript`). Chaque message d'erreur, chaque sortie du shell se rejoue.",
  ada: "GNAT par l'API de Compiler Explorer (godbolt.org, compilateur GNAT récent) ; chaque programme, chaque exception (`Constraint_Error`…), chaque message du compilateur se rejoue ; le manuel de référence Ada (Ada 2022) fait foi.",
  llm: "pas de modèle à exécuter ici : les articles d'origine (arXiv, actes de conférence) et la documentation officielle des API, à leur date, font foi ; un calcul (jetons, coût, probabilités, softmax) se rejoue en Python 3.14.",
  fortran: "gfortran par l'API de Compiler Explorer (godbolt.org) ; chaque programme, chaque sortie, chaque erreur se rejoue ; préciser la norme (Fortran 77, 90, 2008, 2018) quand le comportement en dépend.",
  groovy: "Java 27 est installé ; Groovy ne l'est pas : télécharge la distribution binaire officielle d'Apache Groovy (groovy.apache.org) dans `D:\\outils-c\\groovy\\` et exécute (`groovy script.groovy`) ; préciser la version (Groovy 4 ou 5) quand le comportement en dépend."
};
var COURS = ["cloud", "reseaux", "wasm", "ml", "erlang", "ada", "llm", "fortran", "groovy"];
COURS.forEach(function (c, k) {
  var n = k + 2, m = par[c];
  if (!m) throw new Error("cours absent de la mesure : " + c);
  var paren = Math.max(m.parStrategie["l'incise entre parentheses"] || 0, m.parStrategie["RESTREINDRE a la parenthese"] || 0);
  var depart = m.questions + " questions ; « la plus longue » " + pct(m.longueur) + " ; « la plus détaillée » " +
    pct(m.parStrategie["la plus detaillee"]) + " ; l'incise entre parenthèses (meilleure des deux stratégies) " + pct(paren) +
    " ; pire stratégie : « " + m.meilleure + " » " + pct(m.taux) + " (`node tools/mesure-biais-qcm.js --json`, sur `" + BASE + "`).";
  var particulier = "rien de plus que la méthode. Pour exécuter : " + EXEC[c];
  var t = MODELE.replace(/<!--[\s\S]*?-->\n/, "")
    .split("__COURSMAJ__").join(c.toUpperCase().replace(/-/g, "_"))
    .split("__COURS__").join(c)
    .split("__CASEMIN__").join("c" + n)
    .split("__CASE__").join("C" + n)
    .split("__DOSSIERBASH__").join("/d/test-claude-c" + n + "-" + c)
    .split("__DOSSIER__").join("D:\\test-claude-c" + n + "-" + c)
    .split("__BRANCHE__").join("v18/c" + n + "-" + c)
    .split("__BASE__").join(BASE)
    .split("__DEPART__").join(depart)
    .split("__PARTICULIER__").join(particulier);
  var reste = t.match(/__[A-Z]+__/g);
  if (reste) throw new Error(c + " : champs non remplis " + reste.join(", "));
  var out = path.join(__dirname, "consigne-c" + n + "-" + c + ".md");
  fs.writeFileSync(out, t);
  console.log("C" + n + " " + c.padEnd(9) + " : " + depart.slice(0, 120));
});
