/* =============================================================================
   verif-execution-liens-mutations.js — ON CASSE LES LIENS EXPRES, ET ON REGARDE
   SI LE VERIFICATEUR S'EN APERCOIT (chantier V15, point B6).

   `tools/verif-execution-liens.js` rend « 0 PROBLEME ». Un vert ne vaut que ce
   que vaut l'oeil qui regarde. On injecte donc des fautes connues dans
   `js/lecon.js` — un identifiant faux, un titre recopie de travers, une
   profondeur de lien erronee, la mise en garde retiree, l'encart pose PARTOUT —
   et on compte celles qui sont vues. La copie de securite est restauree quoi
   qu'il arrive.
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.resolve(__dirname, "..");
var CIBLE = path.join(RACINE, "js", "lecon.js");
var VERIF = path.join(RACINE, "tools", "verif-execution-liens.js");

var MUTATIONS = [
  {
    nom: "la table renvoie vers un exemple qui n'existe pas",
    de: '"js/lecon-17": ["this-methode", "this-impose"],',
    vers: '"js/lecon-17": ["this-methode", "this-inexistant"],'
  },
  {
    nom: "un titre recopie ne correspond plus a l'exemple",
    de: '"factorielle": "Factorielle : la pile monte, puis redescend",',
    vers: '"factorielle": "Factorielle, tout simplement",'
  },
  {
    nom: "l'encart n'est plus pose du tout",
    de: "    var lies = VISUALISEUR[cours + \"/\" + lecon];\n    if (!lies || !lies.length) return;",
    vers: "    var lies = VISUALISEUR[cours + \"/\" + lecon];\n    if (true) return;"
  },
  {
    nom: "la profondeur du lien est fausse (il manque le ../)",
    de: 'a.href = "../execution.html#" + lies[i];',
    vers: 'a.href = "execution.html#" + lies[i];'
  },
  {
    nom: "la mise en garde disparait pour les cours hors JavaScript",
    de: 'if (FAMILLE_JS.indexOf(cours) === -1) {',
    vers: 'if (false) {'
  },
  {
    nom: "l'encart est pose sur TOUTES les lecons",
    de: "    var lies = VISUALISEUR[cours + \"/\" + lecon];\n    if (!lies || !lies.length) return;",
    vers: "    var lies = VISUALISEUR[cours + \"/\" + lecon] || [\"factorielle\"];\n    if (!lies || !lies.length) return;"
  },
  {
    nom: "un seul lien est dessine, quel que soit le nombre annonce",
    de: "for (var i = 0; i < lies.length; i++) {\n      var li = document.createElement(\"li\");",
    vers: "for (var i = 0; i < 1; i++) {\n      var li = document.createElement(\"li\");"
  },
  {
    nom: "les liens perdent leur libelle",
    de: "a.textContent = TITRES_VISUALISEUR[lies[i]] || lies[i];",
    vers: "a.textContent = \"\";"
  }
];

var original = fs.readFileSync(CIBLE, "utf8");
function restaurer() { try { fs.writeFileSync(CIBLE, original, "utf8"); } catch (e) { /* rien */ } }
process.on("exit", restaurer);
process.on("SIGINT", function () { restaurer(); process.exit(2); });
process.on("uncaughtException", function (e) {
  restaurer();
  console.log("ECHEC TECHNIQUE : " + (e && e.message ? e.message : e));
  process.exit(2);
});

function lancerVerif() {
  var r = cp.spawnSync(process.execPath, [VERIF], { encoding: "utf8", timeout: 900000 });
  return { code: r.status, sortie: String(r.stdout || "") + String(r.stderr || "") };
}

console.log("verif-execution-liens-mutations.js — " + MUTATIONS.length + " fautes injectees dans js/lecon.js\n");

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
    impossibles.push(m.nom);
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
