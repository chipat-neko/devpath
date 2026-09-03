/* =============================================================================
   execution-ancres-mutations.js — ON CASSE LE CHEMIN DE L'ANCRE EXPRES, ET ON
   REGARDE SI LA PREUVE S'EN APERCOIT. (chantier V15, point F3.)

   POURQUOI
   `tools/preuves/execution-ancres.js` rend « 0 PROBLEME ». Un vert ne vaut que
   ce que vaut l'oeil qui regarde. Chaque mutation ci-dessous vise UNE des
   affirmations de cette preuve, et une seule : si la preuve reste verte, c'est
   elle qui est en cause, pas le visualiseur.

   Les cinq fautes sont posees dans `js/execution.js`, sur le chemin qui n'etait
   pas eprouve avant F3 : celui de l'apprenant qui arrive d'une lecon par un lien
   `execution.html#<id>`.

   Le fichier est restaure quoi qu'il arrive — fin normale, exception, Ctrl-C.
   RESERVE HONNETE : un arret BRUTAL de la machine pendant une mutation
   laisserait `js/execution.js` modifie ; `git checkout -- js/execution.js` le
   repare.

   USAGE   node tools/preuves/execution-ancres-mutations.js
   Codes de sortie : 0 toutes vues · 1 une faute est passee · 2 rien n'a pu etre mesure.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..", "..");
var CIBLE = path.join(RACINE, "js", "execution.js");
var PREUVE = path.join(RACINE, "tools", "preuves", "execution-ancres.js");

var MUTATIONS = [
  {
    nom: "l'ancre n'est plus lue a l'ouverture de la page",
    vise: "point 1 — la page ouverte sur #<id> charge bien cet exemple",
    de: "  window.addEventListener(\"hashchange\", chargerAncre);\n  chargerAncre();",
    vers: "  window.addEventListener(\"hashchange\", chargerAncre);"
  },
  {
    nom: "l'ancre choisit le bon nom mais charge le mauvais programme",
    vise: "point 2 — le code charge est compare caractere par caractere",
    de: "    zoneCode.value = vise.src;\n    analyser(vise.src);",
    vers: "    zoneCode.value = EXEMPLES[0].src;\n    analyser(EXEMPLES[0].src);"
  },
  {
    nom: "changer d'ancre sans recharger ne fait plus rien",
    vise: "point 6 — le retour dans l'historique et le second lien d'une lecon",
    de: "  window.addEventListener(\"hashchange\", chargerAncre);",
    vers: "  window.addEventListener(\"hashchange-jamais-emis\", chargerAncre);"
  },
  {
    nom: "une ancre inconnue efface le travail en cours",
    vise: "point 7b — une ancre inconnue doit LAISSER l'exemple en place",
    de: "    if (!vise || vise.id !== ancre) return;",
    vers: "    if (!vise || vise.id !== ancre) { if (selEx) selEx.value = EXEMPLES[0].id;\n      zoneCode.value = EXEMPLES[0].src; analyser(EXEMPLES[0].src); return; }"
  },
  {
    nom: "« Tout derouler » s'arrete un pas trop tot",
    vise: "point 4 — le dernier pas est vraiment atteint, sortie comprise",
    de: "btnFin.addEventListener(\"click\", function () { aller(etat.trace.length - 1); });",
    vers: "btnFin.addEventListener(\"click\", function () { aller(etat.trace.length - 2); });"
  }
];

var original = fs.readFileSync(CIBLE, "utf8");
function restaurer() {
  try { fs.writeFileSync(CIBLE, original, "utf8"); } catch (e) { /* rien */ }
}
process.on("exit", restaurer);
process.on("SIGINT", function () { restaurer(); process.exit(2); });
process.on("uncaughtException", function (e) {
  restaurer();
  console.log("ECHEC TECHNIQUE : " + (e && e.message ? e.message : e));
  process.exit(2);
});

function lancerPreuve() {
  var r = cp.spawnSync(process.execPath, [PREUVE], { encoding: "utf8", timeout: 900000 });
  return { code: r.status, sortie: String(r.stdout || "") + String(r.stderr || "") };
}

console.log("execution-ancres-mutations.js — " + MUTATIONS.length +
  " fautes injectees sur le chemin de l'ancre, dans js/execution.js\n");

var base = lancerPreuve();
if (base.code !== 0) {
  restaurer();
  console.log("La preuve n'est PAS verte avant toute mutation (code " + base.code + ") :");
  console.log(base.sortie.split("\n").slice(-14).join("\n"));
  process.exit(2);
}
console.log("[temoin] sans mutation : preuve VERTE — la mesure a un sens\n");

var vues = 0, ratees = [], impossibles = [];
MUTATIONS.forEach(function (mu, i) {
  var tete = "[" + (i + 1) + "/" + MUTATIONS.length + "] " + mu.nom;
  if (original.indexOf(mu.de) === -1) {
    impossibles.push(mu.nom + " (le texte a muter n'existe plus dans js/execution.js)");
    console.log(tete + " : NON APPLICABLE");
    return;
  }
  fs.writeFileSync(CIBLE, original.replace(mu.de, mu.vers), "utf8");
  var r = lancerPreuve();
  restaurer();
  if (fs.readFileSync(CIBLE, "utf8") !== original) {
    console.log("ARRET — la restauration de js/execution.js a echoue.");
    process.exit(2);
  }
  if (r.code === 1) {
    vues++;
    var premier = (r.sortie.split("\n").filter(function (l) { return /^\s+X /.test(l); })[0] || "").trim();
    console.log(tete + " : VUE");
    console.log("        vise " + mu.vise);
    console.log("        dit  " + premier.slice(0, 150));
  } else {
    ratees.push(mu.nom + " (code " + r.code + ")");
    console.log(tete + " : PASSEE INAPERCUE  — " + mu.vise);
  }
});

restaurer();
console.log("");
console.log("=== BILAN ===");
console.log("  fautes injectees ... " + MUTATIONS.length);
console.log("  VUES ............... " + vues);
console.log("  passees inapercues . " + ratees.length);
console.log("  non applicables .... " + impossibles.length);
impossibles.forEach(function (s) { console.log("    - " + s); });
ratees.forEach(function (s) { console.log("    X " + s); });
if (ratees.length || impossibles.length) process.exit(1);
console.log("\n  Chaque faute posee sur le chemin de l'ancre a rougi la preuve.");
process.exit(0);
