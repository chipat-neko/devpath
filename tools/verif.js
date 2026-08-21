/* =============================================================================
   verif.js — point d'entree unique des verificateurs du site Syntaxe.
   Node pur, ZERO dependance.

   POURQUOI : il y a cinq outils, chacun avec ses options. Se souvenir des cinq
   commandes a chaque fois est une charge inutile — et une occasion d'en oublier
   un. Celui-ci les enchaine et rend UN verdict.

     source   node tools/verif-html.js       balise creee par erreur dans du code
     donnees  node tools/verif-donnees.js    17 invariants (data.js, index, liens)
     contenu  node tools/verif-contenu.js    standard editorial, maigreur, redondance
     exemples node tools/verif-exemples.js   sortie annoncee confrontee au reel (execution)
     rendu    node tools/verif-rendu.js      ce que le navigateur affiche

   USAGE
     node tools/verif.js            # les cinq (le rendu prend plusieurs minutes)
     node tools/verif.js --rapide   # les quatre premiers, exemples JS seul : ~20 secondes
     node tools/verif.js --complet  # idem, mais le rendu balaie 139 pages
     node tools/verif.js --strict   # code 1 des qu'un outil signale quoi que ce soit

   Note : en mode rapide, « exemples » n'execute que JavaScript (pur Node, ~1 s) ;
   Python (via l'interpreteur, ~35 s) n'est joue qu'en mode complet.

   CODE DE SORTIE : 0 si tout va bien, 1 si un outil a signale un probleme.
   Pense a l'appeler avant un commit, et systematiquement en fin de chantier.
   ============================================================================= */
"use strict";

var cp = require("child_process");
var path = require("path");

var args = process.argv.slice(2);
function flag(n) { return args.indexOf("--" + n) !== -1; }
var RAPIDE = flag("rapide");
var COMPLET = flag("complet");
var STRICT = flag("strict");
var TOOLS = __dirname;

var ETAPES = [
  { nom: "source ", fichier: "verif-html.js", args: [], quoi: "balise creee par erreur dans un bloc de code" },
  { nom: "donnees", fichier: "verif-donnees.js", args: [], quoi: "invariants de data.js, index, liens" },
  { nom: "contenu", fichier: "verif-contenu.js", args: STRICT ? ["--strict"] : [], quoi: "standard editorial, maigreur, redondance" },
  {
    nom: "exemple",
    fichier: "verif-exemples.js",
    args: RAPIDE ? ["--lang", "js"] : [],
    quoi: "sortie annoncee confrontee au reel (execution)",
    lent: !RAPIDE,
  },
];
if (!RAPIDE) {
  ETAPES.push({
    nom: "rendu  ",
    fichier: "verif-rendu.js",
    args: COMPLET ? ["--tout", "--lecons"] : [],
    quoi: "debordement, contraste, focus, aria, console, reseau",
    lent: true,
  });
}

console.log("verif.js — " + ETAPES.length + " verificateur(s)" + (RAPIDE ? " (mode rapide : le rendu est saute)" : "") + "\n");

var resultats = [];
var debutTotal = Date.now();

ETAPES.forEach(function (e) {
  var t0 = Date.now();
  process.stdout.write("  " + e.nom + "  " + e.quoi + (e.lent ? "  (patience, il pilote Chrome)" : "") + "\n");
  var r = cp.spawnSync(process.execPath, [path.join(TOOLS, e.fichier)].concat(e.args), {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  var duree = ((Date.now() - t0) / 1000).toFixed(1);
  var sortie = (r.stdout || "") + (r.stderr || "");
  resultats.push({ e: e, code: r.status, duree: duree, sortie: sortie });
  var etat = r.status === 0 ? "OK  " : "SIGNALE";
  process.stdout.write("          -> " + etat + "  en " + duree + " s\n\n");
});

/* ------------------------------------------------------------------ verdict */
var enEchec = resultats.filter(function (r) { return r.code !== 0; });
console.log("=".repeat(70));
resultats.forEach(function (r) {
  /* on remonte la ou les lignes de bilan de chaque outil, pas tout son rapport */
  var lignes = r.sortie.split("\n").filter(function (l) {
    return /ERREURS|erreur\(s\)|sous le standard|Aucun probl|aucune erreur|probleme|maigre|redondance|divergen|Aucune divergence/i.test(l) && l.trim();
  });
  console.log("  " + r.e.nom + "  " + (r.code === 0 ? "OK" : "SIGNALE") + "   (" + r.duree + " s)");
  lignes.slice(-2).forEach(function (l) { console.log("            " + l.trim().slice(0, 100)); });
});
console.log("=".repeat(70));
console.log("  total : " + ((Date.now() - debutTotal) / 1000).toFixed(1) + " s · " +
  (enEchec.length ? enEchec.length + " verificateur(s) ont signale quelque chose" : "tout est vert"));

if (enEchec.length) {
  console.log("\n  Pour le detail, relance l'outil concerne :");
  enEchec.forEach(function (r) { console.log("    node tools/" + r.e.fichier + " " + r.e.args.join(" ")); });
}
process.exit(enEchec.length ? 1 : 0);
