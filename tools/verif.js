/* =============================================================================
   verif.js — point d'entree unique des verificateurs du site Syntaxe.
   Node pur, ZERO dependance.

   POURQUOI : il y a six outils, chacun avec ses options. Se souvenir des six
   commandes a chaque fois est une charge inutile — et une occasion d'en oublier
   un. Celui-ci les enchaine et rend UN verdict.

     source   node tools/verif-html.js       balise creee par erreur dans du code
     donnees  node tools/verif-donnees.js    17 invariants (data.js, index, liens)
     contenu  node tools/verif-contenu.js    standard editorial, maigreur, redondance
     exemples node tools/verif-exemples.js   sortie annoncee confrontee au reel (execution)
     rendu    node tools/verif-rendu.js      ce que le navigateur affiche
     stockage node tools/verif-stockage.js  l'echec d'ecriture previent l'apprenant

   USAGE
     node tools/verif.js            # les six (le rendu prend plusieurs minutes)
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
  /* Rapide (JS pur, < 0,2 s) : il rejoue chaque exercice type:"regex" dans le moteur
     du site, EXTRAIT de js/lecon.js, et exige qu'un motif faux echoue. Il est dans le
     mode rapide parce qu'un jeu de cas qui cesse de discriminer ne se voit pas
     autrement — ni a la lecture, ni au rendu. */
  { nom: "motifs ", fichier: "verif-regex-exos.js", args: [], quoi: "exercices de regex : la reference passe, un motif faux echoue" },
  /* Meme role pour les exercices type:"sql", un cran plus loin : il POSE le schema de
     chaque exercice dans le SQLite du depot, execute la requete de reference, exige
     qu'elle rende exactement l'attendu, puis exige que chaque contre-requete ECHOUE.
     Sans ce dernier point, un jeu de donnees ou toutes les lignes se ressemblent
     laisserait passer une requete fausse : ce serait un compteur cable. */
  { nom: "requete", fichier: "verif-sql-exos.js", args: [], quoi: "exercices SQL : la reference passe, une requete fausse echoue" },
  /* Les exercices type:"python" sont juges dans le navigateur par CPython 3.12
     (Pyodide, ~3 s par page : trop lent pour tourner a chaque passe). Celui-ci rejoue
     la SOLUTION PUBLIEE avec le CPython de la machine, avec la regle exacte du site.
     `sautable` : code 2 = aucun interpreteur installe, ce n'est pas un echec. */
  { nom: "python ", fichier: "verif-python-exos.js", args: [], quoi: "exercices Python : la solution publiee produit son run.expect", sautable: true },
  /* Le decodeur d'erreurs (phase C) affirme, pour chaque entree, LE MESSAGE EXACT que
     produit le moteur. Une affirmation que rien n'execute est precisement ce qui a
     laisse passer cinq exemples faux sous quatre verificateurs verts. Celui-ci
     reexecute chaque extrait fautif (le message doit tomber au caractere pres) ET
     chaque correction (elle doit etre muette). Les deux extraits de recursion sont
     sautes par defaut : ils sont lents et --lent les inclut. */
  { nom: "erreurs", fichier: "verif-erreurs.js", args: [], quoi: "decodeur : le message publie est celui que le moteur ecrit" },
];
if (!RAPIDE) {
  ETAPES.push({
    nom: "rendu  ",
    fichier: "verif-rendu.js",
    // normal : echantillon leger (~20 pages) ; complet : premier niveau + TOUS les
    // cours.html + une lecon par cours (~229 pages, plusieurs minutes).
    args: COMPLET ? ["--tout", "--cours", "--lecons"] : ["--echantillon"],
    quoi: "debordement, contraste, focus, aria, console, reseau",
    lent: true,
  });
  /* Les 14 entrees SQL du decodeur ne peuvent pas etre rejouees par Node : aucun
     `sqlite3` sur la machine, et sql.js est un moteur de NAVIGATEUR. Elles sont donc
     rejouees dans Chrome, dans le SQLite EMBARQUE du site -- celui qui juge les
     exercices SQL de l'apprenant. Hors du mode rapide, comme tout ce qui pilote Chrome. */
  ETAPES.push({
    nom: "err-sql",
    fichier: "preuves/erreurs-sql.js",
    args: [],
    quoi: "decodeur : les entrees SQL rejouees dans le moteur du site",
    lent: true,
  });
  /* L'encart « quand ca casse » des 31 lecons citees par le decodeur est construit A
     L'EXECUTION par js/lecon.js : rien dans le source des lecons ne le montre, ni
     verif-html ni verif-donnees ne peuvent le voir. Celui-ci ouvre les 31 pages, compte
     les erreurs listees, verifie que le lien MENE A UN FICHIER EXISTANT, et controle sur
     des temoins qu'aucune autre lecon n'en porte. */
  ETAPES.push({
    nom: "dec-lec",
    fichier: "preuves/decodeur-lecons.js",
    args: [],
    quoi: "decodeur : l'encart des lecons citees, vu dans le navigateur",
    lent: true,
  });
  /* Pilote Chrome lui aussi (~40 s) : hors du mode rapide, comme le rendu. */
  ETAPES.push({
    nom: "stockag",
    fichier: "verif-stockage.js",
    args: [],
    quoi: "l'echec d'ecriture previent l'apprenant (8 scenarios)",
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
  resultats.push({ e: e, code: e.sautable && r.status === 2 ? 0 : r.status, saute: e.sautable && r.status === 2, duree: duree, sortie: sortie });
  var saute = e.sautable && r.status === 2;
  var etat = r.status === 0 ? "OK  " : saute ? "SAUTE" : "SIGNALE";
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
  console.log("  " + r.e.nom + "  " + (r.saute ? "SAUTE" : r.code === 0 ? "OK" : "SIGNALE") + "   (" + r.duree + " s)");
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
