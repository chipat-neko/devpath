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
     gitmodl  node tools/verif-git-modele.js  le modele de depot Git face au vrai git
     gitgraf  node tools/verif-git-graphe.js  le graphe dessine face a git log --graph
     gitscen  node tools/verif-git-scenarios.js  les situations guidees : la solution atteint le but

   USAGE
     node tools/verif.js            # les six (le rendu prend plusieurs minutes)
     node tools/verif.js --rapide   # les quatre premiers, exemples JS seul : ~20 secondes
     node tools/verif.js --complet  # idem, le rendu balaie 229 pages, ET les verificateurs
                                    #   sont eux-memes mis a l epreuve par 9 fautes injectees
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
  /* Le bac a sable Git (phase D) simule un depot. Un simulateur est une affirmation
     permanente — « voila ce que Git ferait » — et rien ne distingue a la lecture un
     modele juste d'un modele qui a l'air juste. Celui-ci monte le MEME scenario dans
     un vrai depot git temporaire et compare : empreintes de blobs, d'arbres et de
     commits, rev-parse, merge-base, et `git status --porcelain`.
     `sautable` : code 2 = git absent de la machine, ce n'est pas un echec. */
  { nom: "gitmodl", fichier: "verif-git-modele.js", args: [], quoi: "modele de depot : memes empreintes que le vrai git", sautable: true },
  /* Les COMMANDES (point D2) rendent en plus un TEXTE que l'apprenant va lire et
     croire. Cette etape rejoue 32 scenarios des deux cotes et compare, apres
     chaque commande, la sortie, la reussite, `status --porcelain`, HEAD, toutes
     les refs, le contenu de chaque fichier et l'arbre de HEAD. */
  { nom: "gitcmd ", fichier: "verif-git-commandes.js", args: [], quoi: "commandes du bac a sable : memes sorties et memes etats que le vrai git", sautable: true },
  /* Le GRAPHE (point D3) est une affirmation de plus : « ce commit descend de
     celui-la ». Cette etape compare, apres chaque commande de 19 scenarios,
     l'ordre topologique des lignes, la continuite des colonnes, les aretes et
     les marques a ce que rend `git log --graph --topo-order`. */
  { nom: "gitgraf", fichier: "verif-git-graphe.js", args: [], quoi: "graphe du bac a sable : meme ordre et memes colonnes que git log --graph", sautable: true },
  /* Les SITUATIONS GUIDEES (point D4) affirment trois choses de plus : que la
     mise en place produit bien le probleme annonce, que la solution publiee
     l'atteint (et plusieurs autres chemins avec elle), et que les pieges
     echouent sur l'objectif annonce. Cette etape rejoue les 43 parcours des deux
     cotes, et refuse tout objectif deja vrai au depart — un controle vert par
     vacuite ne prouve rien. */
  { nom: "gitscen", fichier: "verif-git-scenarios.js", args: [], quoi: "situations guidees : la solution atteint le but, les pieges echouent", sautable: true },
  /* Le bloc « Une autre facon de le faire » (phase E) est un FORMAT : trois faits
     obligatoires, dans le meme ordre, sous le meme titre. Un format qui derive ne
     casse rien -- il se contente de ne plus rien promettre au lecteur. Et une classe
     mal orthographiee rend le bloc en texte nu sans qu'aucun autre controle bronche :
     cette etape verifie donc aussi que chaque classe employee existe dans le CSS. */
  { nom: "altern ", fichier: "verif-alternatives.js", args: [], quoi: "format « une autre facon de le faire » : les trois faits, les classes reelles" },
  /* Depuis Chrome 152, les deux moteurs embarques ne sont plus IMPORTES par le Worker
     mais EVALUES a partir de chaines que la page lui transmet. Ces chaines sont des
     COPIES du code de sql.js et de Pyodide : une copie qui derive de son original est
     une panne muette -- le moteur demarrerait avec une version qui n'est plus celle
     du depot. Cette etape relit chaque chaine et la compare caractere par caractere. */
  { nom: "moteurs", fichier: "build-sources-worker.js", args: [], quoi: "le code des moteurs, copie en chaine pour le Worker, est identique a l'original" },
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
  /* ⚠️ LES DEUX SEULES ETAPES QUI CLIQUENT SUR UN VRAI BOUTON DE MOTEUR, et elles sont ici
     parce que leur absence a coute une semaine. Du 26 aout au 2 septembre 2026, Chrome 152 a
     ferme importScripts() sur une URL file:// : SQLite et CPython ne demarraient plus chez
     l'apprenant, 1 075 boutons etaient morts -- et TOUTE la chaine restait verte, parce
     qu'aucune etape n'ouvrait une lecon pour y cliquer. Rien dans le depot n'avait bouge ;
     c'est le navigateur qui avait change. Aucun controle de SOURCE ne peut voir cela.
     Elles ne rougissent que si le MOTEUR echoue (une erreur SQL d'un exemple de lecon est
     un resultat normal, pas une panne) ou si une requete part sur le reseau. ~90 s chacune. */
  ETAPES.push({
    nom: "sql-lec",
    fichier: "preuves/sql-lecon.js",
    args: [],
    quoi: "SQLite demarre-t-il vraiment quand on clique dans une lecon (file://, DNS coupe)",
    lent: true,
  });
  ETAPES.push({
    nom: "py-lec ",
    fichier: "preuves/python-lecon.js",
    args: [],
    quoi: "CPython demarre-t-il vraiment quand on clique dans une lecon (file://, DNS coupe)",
    lent: true,
  });
  /* Une etude de cas AFFIRME trois choses a l'apprenant : que le programme marche, qu'il
     affiche CE QUI EST PUBLIE, et que la solution de la modification produit la ligne
     annoncee. Aucune des trois ne se verifie en lisant le fichier -- il faut ouvrir la
     page, cliquer, comparer. C'est ce que fait cette etape, en file:// et DNS coupe.
     Epreuve d'injection faite : un seul chiffre change dans la sortie publiee, et
     l'etape rougit en designant la ligne. */
  ETAPES.push({
    nom: "etude-1",
    fichier: "preuves/etude-journal.js",
    args: [],
    quoi: "etude de cas 1 : le programme publie rend-il, dans le navigateur, la sortie publiee",
    lent: true,
  });
  /* L'etude 2 fait lire le VRAI code du site : elle affirme en plus que ses extraits
     sont ceux de js/lecon.js. Cette etape les compare au fichier sur disque, execute le
     banc d'essai dans le navigateur, et refait la mesure annoncee par la solution.
     Epreuve d'injection faite : trois fautes posees (un chiffre de la sortie, le nombre
     de bascules annonce, un mot d'un extrait), trois fautes vues et nommees. */
  ETAPES.push({
    nom: "etude-2",
    fichier: "preuves/etude-moteur-exos.js",
    args: [],
    quoi: "etude de cas 2 : les extraits publies sont-ils ceux de js/lecon.js, et le banc rend-il sa sortie",
    lent: true,
  });
  /* L'etude 3 publie en plus des CHIFFRES de mesure (un rapport avant/apres). Cette
     etape rejoue la modification annoncee dans le navigateur et compare les deux
     rapports, verifie que la fonction `postings` embarquee dans le banc est bien celle
     de js/recherche.js, et recompare la sortie ligne a ligne. Epreuve d'injection
     faite : trois fautes posees (un chiffre de la sortie, le rapport annonce, une
     valeur du decodage), trois fautes vues. */
  ETAPES.push({
    nom: "etude-3",
    fichier: "preuves/etude-recherche.js",
    args: [],
    quoi: "etude de cas 3 : le rapport publie est-il celui que la modification annoncee produit",
    lent: true,
  });
}
/* ⚠️ LA SEULE ETAPE QUI JUGE LES AUTRES, et elle n'est jouee qu'en mode --complet
   parce qu'elle MODIFIE des fichiers du depot. Elle injecte neuf fautes -- un « < »
   dans un bloc de code, une lecon absente du disque, une sortie annoncee faussee, une
   chaine de moteur videe... -- et exige que le verificateur charge de chacune ROUGISSE.
   Elle restaure les octets d'origine apres chaque mutation, y compris sur exception et
   sur Ctrl-C, et refuse de conclure si `git status` a change. RESERVE HONNETE : un arret
   BRUTAL de la machine pendant une mutation laisserait un fichier modifie -- `git
   checkout -- <fichier>` le repare. C'est le prix d'une mesure qu'aucun controle de
   source ne peut rendre : le 2026-09-02, elle a trouve que verif-html.js VOYAIT le
   « < » injecte, l'affichait... et rendait 0. La chaine restait verte sur le defaut
   meme qui fonde ce chantier. */
if (COMPLET) {
  ETAPES.push({
    nom: "mutants",
    fichier: "verif-chaine-mutations.js",
    args: [],
    quoi: "les verificateurs VOIENT-ILS une faute ? 9 fautes injectees, 9 attendues rouges",
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
