/* =============================================================================
   verif-execution-mutations.js — ON CASSE LE VISUALISEUR EXPRES, ET ON REGARDE
   SI LE VERIFICATEUR S'EN APERCOIT (chantier V15, point B2).

   POURQUOI CET OUTIL EXISTE
   `tools/verif-execution.js` rend « 0 PROBLEME ». Un vert ne vaut que ce que
   vaut l'oeil qui regarde : un verificateur qui ne verifie rien rend aussi
   « 0 probleme ». Le seul moyen de savoir, c'est d'INJECTER des fautes connues
   dans `js/execution.js` et de compter celles qui sont vues.

   COMMENT
   Chaque mutation est un remplacement de texte, applique sur une COPIE de
   securite du fichier, qui est restauree quoi qu'il arrive — y compris si le
   processus est interrompu. Le verificateur est ensuite lance : il DOIT sortir
   en code 1. S'il rend 0, la mutation est passee inapercue et c'est le
   verificateur qui est en cause, pas le visualiseur.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..");
var CIBLE = path.join(RACINE, "js", "execution.js");
var VERIF = path.join(RACINE, "tools", "verif-execution.js");

var MUTATIONS = [
  {
    nom: "la ligne surlignee est decalee d'un cran",
    de: "dessinerLignes(pas.ligne);",
    vers: "dessinerLignes(pas.ligne + 1);"
  },
  {
    nom: "le panneau de sortie n'avance jamais",
    de: "var lignes = etat.sortie.slice(0, pas.sortie);",
    vers: "var lignes = etat.sortie.slice(0, 0);"
  },
  {
    nom: "« Precedent » ne recule pas",
    de: 'btnPrec.addEventListener("click", function () { aller(etat.pas - 1); });',
    vers: 'btnPrec.addEventListener("click", function () { aller(etat.pas); });'
  },
  {
    nom: "« Tout derouler » revient au debut",
    de: 'btnFin.addEventListener("click", function () { aller(etat.trace.length - 1); });',
    vers: 'btnFin.addEventListener("click", function () { aller(0); });'
  },
  {
    nom: "la pile perd son cadre du sommet",
    de: "for (var i = pas.pile.length - 1; i >= 0; i--) {",
    vers: "for (var i = pas.pile.length - 2; i >= 0; i--) {"
  },
  {
    nom: "un programme refuse ne dit plus rien",
    de: "elErr.hidden = false;\n    elErr.textContent = err.nom",
    vers: "elErr.hidden = true;\n    elErr.textContent = \"\" && err.nom"
  },
  {
    nom: "les fleches du clavier ne font plus rien",
    de: 'if (e.key === "ArrowRight") { aller(etat.pas + 1); e.preventDefault(); }',
    vers: 'if (e.key === "ArrowRight") { e.preventDefault(); }'
  },
  {
    nom: "les portees ne sont plus dessinees",
    de: "elPortees.innerHTML = html;",
    vers: "elPortees.innerHTML = \"\";"
  },
  {
    nom: "la fenetre de code ne defile plus vers la ligne courante",
    de: "if (ligneCourante > 0) faireDefiler(ligneCourante);",
    vers: "if (ligneCourante < 0) faireDefiler(ligneCourante);"
  },
  {
    nom: "le compteur de pas ment d'une unite",
    de: 'elPosition.textContent = "pas " + (etat.pas + 1) + " sur " + etat.trace.length;',
    vers: 'elPosition.textContent = "pas " + (etat.pas + 2) + " sur " + etat.trace.length;'
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

function lancerVerif() {
  var r = cp.spawnSync(process.execPath, [VERIF], { encoding: "utf8", timeout: 600000 });
  return { code: r.status, sortie: String(r.stdout || "") + String(r.stderr || "") };
}

console.log("verif-execution-mutations.js — " + MUTATIONS.length + " fautes injectees dans js/execution.js\n");

/* Point de depart : sans mutation, le verificateur doit etre VERT. Sinon la
   mesure ne veut rien dire (on ne saurait pas ce qu'on observe). */
var base = lancerVerif();
if (base.code !== 0) {
  restaurer();
  console.log("Le verificateur n'est PAS vert avant toute mutation (code " + base.code + ") :");
  console.log(base.sortie.split("\n").slice(-14).join("\n"));
  process.exit(2);
}
console.log("[temoin] sans mutation : verificateur VERT — la mesure a un sens\n");

var vues = 0, ratees = [], impossibles = [];
MUTATIONS.forEach(function (m, i) {
  if (original.indexOf(m.de) === -1) {
    impossibles.push(m.nom + " (le texte a muter n'existe plus dans js/execution.js)");
    console.log("[" + (i + 1) + "/" + MUTATIONS.length + "] " + m.nom + " : NON APPLICABLE");
    return;
  }
  fs.writeFileSync(CIBLE, original.replace(m.de, m.vers), "utf8");
  var r = lancerVerif();
  restaurer();
  if (r.code === 1) { vues++; console.log("[" + (i + 1) + "/" + MUTATIONS.length + "] " + m.nom + " : VUE"); }
  else {
    ratees.push(m.nom + " (code " + r.code + ")");
    console.log("[" + (i + 1) + "/" + MUTATIONS.length + "] " + m.nom + " : PASSEE INAPERCUE");
  }
});

restaurer();
console.log("");
console.log("=== BILAN ===");
console.log("  fautes injectees ............ " + MUTATIONS.length);
console.log("  fautes vues ................. " + vues);
console.log("  passees inapercues .......... " + ratees.length + (ratees.length ? " : " + ratees.join(" | ") : ""));
console.log("  non applicables ............. " + impossibles.length + (impossibles.length ? " : " + impossibles.join(" | ") : ""));
console.log("");
if (ratees.length || impossibles.length) { console.log("RESULTAT : LE VERIFICATEUR A DES ANGLES MORTS"); process.exit(1); }
console.log("RESULTAT : " + vues + "/" + MUTATIONS.length + " FAUTES VUES");
process.exit(0);
