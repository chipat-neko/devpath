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

   USAGE (durees mesurees le 2026-09-03, apres l'entree du cliquet des QCM, point B2)
     node tools/verif.js            # 51 etapes, plusieurs minutes (le rendu pilote Chrome)
     node tools/verif.js --rapide   # 26 etapes, 76,6 s : tout ce qui ne pilote pas Chrome,
                                    #   moins les trois bacs a sable Git (voir l'arbitrage
                                    #   plus bas : ils pesaient 76 % du mode a eux seuls)
     node tools/verif.js --complet  # 54 etapes : le rendu balaie 229 pages, la fraicheur est
                                    #   lue A L'AFFICHAGE, ET les verificateurs sont eux-memes
                                    #   mis a l epreuve par 9 + 13 fautes injectees
     node tools/verif.js --strict   # 51 etapes, code 1 des qu'un outil signale quoi que ce soit
     node tools/verif.js --lister   # la liste des etapes du mode demande, sans rien lancer
     node tools/verif.js --mutations  # les 16 epreuves par injection, et rien d'autre : elles
                                    #   MODIFIENT des fichiers avant de les restaurer, et le mode
                                    #   verifie lui-meme que le depot ressort comme il est entre

     node tools/verif.js --seules=qcm,fraicheur  # ne lancer que les etapes dont le nom de
                                    #   fichier contient l'un de ces motifs (les memes que
                                    #   `--lister` imprime). Un motif qui ne designe aucune
                                    #   etape mais qui existe sous tools/ est lance quand meme :
                                    #   c'est ainsi qu'on fait juger un outil hors chaine par
                                    #   la meme mecanique de verdict.

   Note : en mode rapide, « exemples » n'execute que JavaScript (pur Node, ~1 s) ;
   Python (via l'interpreteur, ~35 s) n'est joue qu'en mode complet.

   TROIS ETATS, ET TROIS CODES DE SORTIE (point A5 du chantier V17, 2026-09-08).
   Un verificateur du projet rend TROIS choses differentes, et cette chaine n'en
   lisait que deux :
       0  la mesure a eu lieu, rien a signaler                  -> OK
       1  la mesure a eu lieu, une faute a ete trouvee          -> SIGNALE
       2  RIEN N'A PU ETRE MESURE : donnees illisibles, moteur introuvable,
          Chrome absent, interpreteur manquant, reference absente -> NON MESURE
   Le troisieme cas etait repeint : en VERT pour les cinq etapes marquees
   `sautable` (leur code 2 etait converti en 0, et la chaine annoncait « tout est
   vert » alors que l'etape n'avait rien regarde), en ROUGE pour les vingt-cinq
   autres etapes qui savent sortir en 2 (« un verificateur a signale quelque
   chose », alors qu'aucune faute n'avait ete trouvee : c'est l'outil qui etait
   en panne). Les deux repeintures mentent, et la premiere est celle qui coute :
   c'est exactement la forme du defaut qui fonde ce chantier -- un controle vert
   qui n'a rien regarde. Un processus tue par un signal, ou qui n'a pas pu
   demarrer, est traite comme un code 2 : lui non plus n'a rien mesure.

   CODE DE SORTIE : 0 tout mesure et propre · 1 au moins une faute signalee ·
   2 aucune faute, mais au moins une etape n'a rien pu mesurer.
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
/* La racine du depot. Plusieurs verificateurs lisent des chemins RELATIFS
   (`js/lecon.js`, `pages/...`) ou appellent `process.cwd()` : lances depuis un
   autre dossier, ils tombaient. La chaine impose donc le repertoire de travail
   au lieu d'heriter de celui de l'appelant. Mesure du point A3 : quatre outils
   entrants sur seize etaient dans ce cas. */
var RACINE = path.join(TOOLS, "..");

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
     `sautable` : son code 2 s'explique par l'absence de l'interpreteur sur la
     machine. Depuis le point A5 il n'est plus repeint en vert : l'etape est
     comptee NON MESUREE, comme toute autre etape qui sort en 2. */
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
     `sautable` : son code 2 s'explique par l'absence de git sur la machine.
     Depuis le point A5 il n'est plus repeint en vert : l'etape est comptee NON
     MESUREE, comme toute autre etape qui sort en 2. */
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
  /* Les marques de FRAICHEUR (V15-E2) datent ce qui perime. E1 et E2 ont mesure
     qu'aucun motif ne sait TROUVER le perissable -- 87 % des affirmations
     perissables de `react` n'ont ni version, ni date, ni superlatif -- donc la
     charge est inversee : celui qui ecrit marque, et ce controle verifie que les
     marques posees sont bien formees, bien placees, et qu'aucune n'a depasse son
     age. Il ne dit jamais si une version est a jour : il n'a pas de reseau. */
  { nom: "fraich ", fichier: "verif-fraicheur.js", args: STRICT ? ["--strict"] : [], quoi: "marques de fraicheur : bien formees, bien placees, dans leur duree" },
  /* Le cours `maths` est le seul du site ou une erreur est INVISIBLE a la relecture :
     un programme qui calcule faux publie une sortie fausse, et les deux controles qui
     existent -- rejouer le programme, tracer les nombres de la prose jusqu'a une
     sortie -- restent verts, puisqu'ils font tous les deux confiance au programme.
     C'est arrive : `lois.js` annoncait 78 propositions evaluees pour 76. Cette etape ne
     lit pas le code du cours, elle RECALCULE ses faits par une autre methode --
     enumeration exhaustive, force brute, BigInt exact, decodage binaire des flottants --
     puis confronte le resultat au texte publie. */
  { nom: "maths  ", fichier: "maths/verif-verite.js", args: [], quoi: "les faits du cours maths, recalcules par une autre methode" },

  /* ===================================================================== *
   * ONZE VERIFICATEURS ENTRES PAR LE POINT A3 DU CHANTIER V16.
   * Ils existaient tous, ils fonctionnaient tous, et AUCUN mode ne les
   * lancait : un outil qu'il faut penser a lancer ne protege rien.
   * Aucun n'est entre sur sa reputation : chacun a subi une EPREUVE PAR
   * INJECTION (une faute posee dans le fichier qu'il lit, l'outil relance,
   * son code de sortie exige different de 0, les octets restaures et relus).
   * 16 candidats, 16 fautes vues. Cout mesure du lot : 8,4 s.
   * ===================================================================== */
  /* LE GARDE-FOU DE LA CHAINE ELLE-MEME (point A5). Il croise la liste des
     verificateurs presents sur le disque avec ceux que ce fichier lance vraiment
     — en la LISANT via `--lister`, pas en la recopiant — et echoue des qu'un outil
     n'est dans aucun mode sans etre declare dans `tools/hors-chaine.json` avec sa
     raison. Sans lui, le defaut qui a fonde le chantier V16 (35 outils hors
     chaine, dont un qui trouvait de vraies fautes que personne ne lisait)
     reviendrait au chantier suivant, et de la meme facon : en ecrivant un nouveau
     verif-*.js sans penser a le brancher. */
  { nom: "gardech", fichier: "verif-chaine-declaree.js", args: [], quoi: "aucun verificateur hors chaine sans declaration ecrite" },
  /* LE CLIQUET DU BIAIS DES QCM (point B2). Un apprenant qui choisit toujours la
     reponse la plus longue reussit 89,5 % des 6 167 questions du site : une dette
     editoriale de 40 cours, que ce verificateur ne pretend pas solder. Il interdit
     qu'elle EMPIRE — regression d'un cours de plus d'un point, cours marque traite
     qui reperd sa cible, cours NEUF publie hors cible, reference orpheline. Il ne
     mesure rien lui-meme : il lit `mesure-biais-qcm.js --json`. */
  { nom: "qcmbiai", fichier: "verif-qcm-biais.js", args: [], quoi: "le biais des QCM n'a empire nulle part (cliquet)" },
  /* Le meme cliquet, sur l'indice que les 23 strategies du precedent NE VOIENT PAS :
     l'apprenant qui cherche au clavier les mots de chaque option DANS LA PAGE et
     prend celle dont tout le vocabulaire figure dans le cours. C'est la CORRECTION
     du biais de longueur qui le fabrique — mesure sur `os`, meme corpus, avant et
     apres la vague de B4 : rendement 38,1 % -> 100,0 %. Sans ce cliquet, chaque
     cours detordu rouvre la faille en silence. Prouve capable d'echouer par
     injection (un mot invente dans les distracteurs d'une lecon le fait rougir). */
  { nom: "qcmlexi", fichier: "verif-qcm-lexique.js", args: [], quoi: "l'indice lexical des QCM n'a empire nulle part (cliquet)" },
  /* Le defaut que NOTRE PROPRE PROTOCOLE fabrique, et qu'aucun des 53 verificateurs
     ne voyait : les vagues de B4 remplacent les DISTRACTEURS en masse et declarent
     l'`explain` intouchable — or l'explain CITE les distracteurs pour les refuter.
     Deux cas prouves sur `kotlin`, trouves par la relecture. Le controle compare
     l'etat d'AVANT chaque vague (retrouve dans git) a celui d'aujourd'hui, et sur
     l'arbre de travail pendant une vague en cours. ⚠️ Il coute ~37 s : mode complet
     seulement. Prouve capable d'echouer par verif-explain-orpheline-mutations. */
  { nom: "explorp", fichier: "verif-explain-orpheline.js", args: [], quoi: "aucun explain ne commente une option EFFACEE par une vague (cliquet)", lent: true },
  /* Un caractere de controle ecrit par accident est INVISIBLE a la relecture :
     un « \b » devenu un vrai backspace dans une expression reguliere avait fait
     afficher « 0 » a deux compteurs, et seule une capture d'ecran l'avait montre. */
  { nom: "caract ", fichier: "verif-controles.js", args: [], quoi: "aucun caractere de controle invisible hors des deux emplois declares" },
  /* La page de reference en anglais (cours doc) demande a l'apprenant de s'y fier :
     36 controles rejouent son code, ses exemples et ses promesses de valeur. */
  { nom: "doc-ref", fichier: "doc/verif-doc.js", args: [], quoi: "la page de documentation dit-elle vrai (36 controles rejoues)" },
  /* La lecon 03 publie une specification et affirme que les milliers de questions
     du site la respectent : une affirmation qui se perime a chaque question ajoutee. */
  { nom: "normatf", fichier: "doc/verif-normatif.js", args: [], quoi: "la specification publiee et sa conformite, recalculees" },
  /* La lecon 04 tire ses chiffres de l'EXECUTION d'un moteur : un changement de
     version de Node peut faire basculer un verdict et la page mentirait en silence. */
  { nom: "doc-rec", fichier: "doc/verif-recherche.js", args: [], quoi: "les chiffres de la lecon 04, rejoues depuis les corpus" },
  /* L'angle mort du bilan REPLIE : verif-rendu ne mesure que le visible, donc les
     couleurs d'un <details> ferme ne sont jugees par personne. */
  { nom: "contras", fichier: "fraicheur/verif-contraste.js", args: [], quoi: "contraste des couleurs du bilan de fraicheur, dans les deux themes" },
  /* Les blocs SQL portent un bouton « Executer » : un bouton qui rend une erreur est
     pire que pas de bouton. ⚠ Le seuil de 55 % ne peut pas voir une faute isolee (le
     site est a 59,1 %) — c'est ce que l'epreuve d'injection a montre, et c'est
     pourquoi cet outil a recu un CLIQUET : le nombre de blocs en erreur ne doit
     jamais augmenter. */
  { nom: "sql-blc", fichier: "verif-sql.js", args: [], quoi: "les blocs SQL des lecons aboutissent-ils (seuil + cliquet)" },
  /* Les quatre suivants gardent le cours de maths, le seul du site ou une erreur est
     invisible a la relecture. Ils comblent chacun un angle mort de verif-exemples. */
  { nom: "mth-acc", fichier: "maths/module-5/verif-accept.js", args: [], quoi: "la valeur attendue d'un exercice est celle qu'affiche sa solution" },
  { nom: "mth-ren", fichier: "maths/module-5/verif-renvois.js", args: [], quoi: "les renvois « les mathematiques derriere » : cible reelle, chiffres retrouves" },
  { nom: "mth-e3 ", fichier: "maths/module-3/verif-expect.js", args: [], quoi: "module 3 : la solution publiee produit bien son run.expect" },
  { nom: "mth-e4 ", fichier: "maths/module-4/verif-expect.js", args: [], quoi: "module 4 : la solution publiee produit bien son run.expect" },
  { nom: "mth-e5 ", fichier: "maths/module-5/verif-expect.js", args: [], quoi: "module 5 : la solution publiee produit bien son run.expect" },
];

/* ===================================================================== *
 * L'ARBITRAGE DU MODE RAPIDE (point A3 du chantier V16).
 * Le plan posait un seuil : « si le mode rapide depasse une minute, il n'est
 * plus rapide ». Mesure faite AVANT tout ajout : 266,7 s pour 16 etapes.
 * Le seuil n'etait donc pas franchi par les nouveaux venus, il l'etait deja,
 * et de quatre fois. La mesure designe le coupable sans ambiguite : les trois
 * bacs a sable Git pesent 203,6 s a eux seuls, soit 76 % du mode rapide
 * (gitcmd 121,2 s, gitscen 49,4 s, gitgraf 33,0 s).
 * Ils SORTENT donc du mode rapide, et de lui seul : ils restent joues par le
 * mode par defaut, par --complet et par --strict. `gitmodl` (7,1 s) reste,
 * pour qu'une regression du modele de depot se voie quand meme en rapide.
 * Rapide mesure apres, machine au repos : 77,0 s pour 24 etapes, contre 266,7 s
 * pour 16 avant — trois fois moins de temps pour huit controles de plus.
 * ⚠ LA MINUTE N'EST PAS TENUE, et il faut le dire plutot que de la faire tenir :
 * les onze entrants ne coutent que 8,2 s ensemble. Ce qui reste au-dessus du
 * seuil, ce sont trois controles centraux — contenu 15,6 s, maths 15,5 s,
 * exemples 11,3 s — et les retirer viderait le mode de son interet. Le seuil
 * d'une minute est donc ecarte par la mesure, pas atteint.
 * ===================================================================== */
var HORS_RAPIDE = ["verif-git-commandes.js", "verif-git-graphe.js", "verif-git-scenarios.js",
  /* ~37 s : il rejoue `git show` sur les 20 lecons de chacun des 25 cours traites. */
  "verif-explain-orpheline.js"];
if (RAPIDE) {
  ETAPES = ETAPES.filter(function (e) { return HORS_RAPIDE.indexOf(e.fichier) === -1; });
}
if (!RAPIDE) {
  /* `verif-exemples.js` ne confronte au reel que les valeurs ecrites EN COMMENTAIRE
     dans le code. Or une lecon range souvent sa sortie dans un bloc `.txt` voisin,
     et ces 449 blocs-la n'etaient rejoues par aucun mode : l'outil existait depuis le
     chantier V15 et personne ne le lancait. Entre dans la chaine au point A2 du V16,
     apres solde de ses deux verdicts douteux -- tous deux etaient des defauts de
     l'outil, pas des fautes de contenu (microtaches perdues, delai trop court).
     70 s : hors du mode rapide. */
  ETAPES.push({
    nom: "sorties",
    fichier: "verif-sorties.js",
    args: [],
    quoi: "les 449 blocs de sortie ranges a part, rejoues et compares au caractere pres",
    lent: true,
    pourquoiLent: "il rejoue 449 programmes",
  });
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
  /* L'etude 4 publie DEUX programmes et affirme qu'ils rendent la meme sortie. Cette
     etape prend les trois blocs dans le HTML -- le jeu d'essai, la version 1, la
     version 2 -- les execute DANS LE NAVIGATEUR, et compare les deux sorties entre
     elles et a la sortie publiee. Rien n'est relu sur le disque : si quelqu'un modifie
     un programme sans reassembler la page, l'ecart se voit. Elle verifie aussi que le
     chiffre annonce dans la prose est celui du bloc de mesures -- controle ne d'une
     vraie confusion : deux mesures differentes portaient le meme libelle. */
  ETAPES.push({
    nom: "etude-4",
    fichier: "preuves/etude-reecriture.js",
    args: [],
    quoi: "etude de cas 4 : les deux programmes publies rendent-ils la meme sortie, celle qui est publiee",
    lent: true,
  });
  /* L'etude 5 publie un algorithme celebre -- ce qui ne le dispense de rien. Cette
     etape prend le code DANS LE HTML, l'execute dans le navigateur, et le fait juger
     par une force brute ecrite dans la preuve elle-meme (tous les diviseurs essayes) :
     14 400 paires, plus l'identite de Bezout et les 96 inverses modulo 97. Sans cette
     reference independante, on ne verifierait Euclide que par Euclide. */
  ETAPES.push({
    nom: "etude-5",
    fichier: "preuves/etude-euclide.js",
    args: [],
    quoi: "etude de cas 5 : l'algorithme publie resiste-t-il a une force brute independante",
    lent: true,
  });
  /* L'etude 6 est la SEULE du site a publier du code dans un langage que cette machine
     ne sait pas executer (ni go ni rustc installes). Elle ne peut donc pas prouver ce
     que le Go affiche -- et cette etape verifie d'abord qu'elle le DIT. Elle recalcule
     ensuite le tableau de mesure des 39 langages et le confronte a celui de la page,
     compare le Go publie au fichier .go, et fait executer le banc dans le navigateur. */
  ETAPES.push({
    nom: "etude-6",
    fichier: "preuves/etude-inconnu.js",
    args: [],
    quoi: "etude de cas 6 : la page dit-elle qu'aucun compilateur Go n'a tourne, et ses chiffres tiennent-ils",
    lent: true,
  });
  /* Les chemins qui menent aux etudes sont construits PAR DU JAVASCRIPT au chargement
     (le menu par initMainNav, les encarts de cours par renderEtudeLink) : ils
     n'existent dans aucun fichier HTML, et aucun controle de source ne peut les voir.
     Cette etape ouvre les pages pour de bon -- y compris DEUX COURS TEMOINS qui ne
     doivent porter aucun encart, sans quoi un encart pose partout passerait pour vert. */
  /* LE VISUALISEUR (phase B) n'etait dans AUCUN mode de cette chaine : ni --strict
     ni --complet ne l'ouvraient. Trois preuves l'eprouvent, et elles entrent ici.
     La premiere pilote les 26 exemples par le SELECTEUR ; la deuxieme verifie que
     les 19 lecons liees menent vraiment quelque part ; la troisieme, la seule qui
     suive le chemin REEL de l'apprenant, ouvre la page a neuf sur execution.html#<id>
     et deroule chaque exemple jusqu'au dernier pas, reseau coupe. */
  ETAPES.push({
    nom: "vexec  ",
    fichier: "verif-execution.js",
    args: [],
    quoi: "visualiseur : les 26 exemples pilotes par le selecteur, pas par pas",
    lent: true,
  });
  ETAPES.push({
    nom: "vexlien",
    fichier: "verif-execution-liens.js",
    args: [],
    quoi: "visualiseur : les 19 lecons liees, leurs 53 liens et 6 temoins negatifs",
    lent: true,
  });
  ETAPES.push({
    nom: "vexancr",
    fichier: "preuves/execution-ancres.js",
    args: [],
    quoi: "visualiseur : les 26 exemples ouverts PAR L'ANCRE et deroules jusqu'au bout",
    lent: true,
  });
  ETAPES.push({
    nom: "etudes-hub",
    fichier: "preuves/etudes-hub.js",
    args: [],
    quoi: "les six etudes sont-elles atteignables : hub, menu aux 4 profondeurs, encarts de cours, retour",
    lent: true,
  });
  /* ===================================================================== *
   * CINQ VERIFICATEURS DE PLUS, entres par le point A3 du V16 — hors du mode
   * rapide parce qu'ils coutent 39,2 s a eux cinq, dont trois pilotent Chrome.
   * ⚠ LES TROIS QUI OUVRENT CHROME PARTENT D'UN PROFIL NEUF (tools/lib/
   * profil-chrome.js). C'est une condition d'entree, pas un detail : avec son
   * ancien profil persistant, `mth-prg` annoncait « la barre affiche 0 / 13 »
   * — un bug du site en apparence — et le seul effacement du profil le fait
   * passer au vert, en 2,8 s au lieu de 15,0 s.
   * Chacun a subi l'epreuve par injection, et l'une d'elles a appris quelque
   * chose : la page de cours construit ses liens EN JAVASCRIPT, donc une faute
   * posee dans cours.html ne prouve rien — il faut casser le moteur qui la
   * remplit pour que le controle ait une chance de voir.
   * ===================================================================== */
  ETAPES.push({
    nom: "lexique",
    fichier: "doc/verif-lexique-clic.js",
    args: [],
    quoi: "le lexique CLIQUE dans Chrome : filtres, recherche par le piege, quiz",
    lent: true,
  });
  ETAPES.push({
    nom: "vocab  ",
    fichier: "doc/verif-vocab.js",
    args: [],
    quoi: "les 82 fiches de vocabulaire : chaque affirmation chiffree rejouee",
    lent: true,
    pourquoiLent: "il rejoue les preuves de chaque fiche",
  });
  ETAPES.push({
    nom: "interpr",
    fichier: "verif-interpreteur.js",
    args: [],
    quoi: "le mini-interpreteur du visualiseur, confronte au vrai moteur JavaScript",
    lent: true,
    pourquoiLent: "il execute chaque programme deux fois",
  });
  ETAPES.push({
    nom: "mth-bil",
    fichier: "maths/module-5/verif-bilan.js",
    args: [],
    quoi: "le QCM de bilan juge-t-il vraiment : score parfait ET temoin negatif a zero",
    lent: true,
  });
  ETAPES.push({
    nom: "mth-prg",
    fichier: "maths/module-5/verif-cours-progression.js",
    args: [],
    quoi: "la page de cours avec une progression SEMEE : 13 liens, barre lue, aucun « bientot »",
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
  /* Meme raison que `mutants`, appliquee au cours de maths : un controle qui rend
     toujours « 0 divergent » rend la meme chose qu'un controle qui ne regarde rien.
     Celui-ci pose treize faits faux dans treize lecons differentes -- un nombre de la
     prose, un compteur d'appels, une cellule de tableau, une colonne entiere, une somme
     de probabilites -- et exige que le groupe qui couvre la lecon rougisse. Il restaure
     la page a l'octet pres apres chaque injection, y compris sur exception, et relit le
     fichier pour le verifier. MEME RESERVE que `mutants` : un arret brutal pendant une
     injection laisserait une page modifiee -- `git checkout -- <fichier>` la repare. */
  ETAPES.push({
    nom: "mathinj",
    fichier: "maths/preuve-injection.js",
    args: [],
    quoi: "le controle des maths VOIT-IL une faute ? 13 fautes injectees, 13 attendues rouges",
    lent: true,
  });
  /* Les marques de fraicheur sont posees dans le SOURCE, mais ce que l'apprenant
     lit est calcule a l'affichage : l'age d'une marque, la note du bilan, les dates
     en clair. `verif-fraicheur.js` (mode rapide) juge le source ; celui-ci ouvre les
     pages et lit le rendu. 201 s a l'origine, il ne pouvait tenir nulle part
     ailleurs qu'en --complet. Son epreuve par injection existe deja et passe
     (fraicheur/verif-affichage-mutations.js, 14 fautes posees, 14 vues). */
  ETAPES.push({
    nom: "fr-affi",
    fichier: "fraicheur/verif-affichage.js",
    args: [],
    quoi: "les marques de fraicheur telles que le navigateur les AFFICHE",
    lent: true,
  });
  ETAPES.push({
    nom: "mutants",
    fichier: "verif-chaine-mutations.js",
    args: [],
    quoi: "les verificateurs VOIENT-ILS une faute ? 9 fautes injectees, 9 attendues rouges",
    lent: true,
  });
  /* LES CINQ PREUVES QUE PERSONNE NE LANCAIT (point A4 du chantier V17). Elles
     etaient hors de tous les modes, et le garde-fou `verif-chaine-declaree.js` ne
     les VOYAIT pas : il decidait la famille au prefixe du nom, et aucune ne
     s'appelle `verif-*`. Toutes les cinq ouvrent une page en file://, SANS
     `--allow-file-access-from-files` et DNS coupe — c'est la condition de
     l'apprenant, celle qu'aucune execution dans Node ne reproduit. Mesure du
     2026-09-08, les cinq lancees a la suite : 32,0 s au total, les cinq en code 0
     (git-modele 2,4 s / 13 valeurs, git-commandes 0,9 s / 13 valeurs, git-graphe
     16,5 s / 18 valeurs, git-scenarios 9,7 s / 26 valeurs, decodeur 2,5 s / 55
     messages retrouves en premier et 3 messages inventes refuses). */
  [
    ["gitmod ", "preuves/git-modele.js",
     "le modele de depot joue DANS CHROME : 13 empreintes contre celles de Node"],
    ["gitcmd ", "preuves/git-commandes.js",
     "les commandes du bac a sable jouees DANS CHROME, comparees a un vrai git"],
    ["gitgraf", "preuves/git-graphe.js",
     "la page du bac a sable pilotee au clavier : le SVG, les trois zones, le defilement"],
    ["gitscen", "preuves/git-scenarios.js",
     "les neuf situations guidees : vrais clics, indices un par un, chemins alternatifs"],
    ["decodwb", "preuves/decodeur.js",
     "le decodeur juge PAR LA PAGE : message exact, trace entiere, noms de l'apprenant"],
  ].forEach(function (p) {
    ETAPES.push({ nom: p[0], fichier: p[1], args: [], quoi: p[2], lent: true });
  });
  /* LE SEUL OUTIL QUI CLIQUE VRAIMENT (point A3 du chantier V17). `verif-exemples.js`
     et `verif-sorties.js` executent le code dans Node ; le site, lui, l'execute dans un
     Web Worker de navigateur, dont la pile est bien plus courte. Ce seul ecart avait
     laisse passer un exemple faux, tous verificateurs verts (compilation/lecon-08 :
     « 10000 / PLAFOND » annonce, « 6970 / Maximum call stack size exceeded » au clic).
     Il etait DECLARE HORS CHAINE depuis le 2026-09-03 pour trois raisons mesurees —
     port fixe, profil unique qui grossit, Chrome survivants — toutes corrigees au
     point A3 : port dynamique, profil neuf par page et efface apres, arbre tue.
     Sa couverture est desormais IMPRIMEE (blocs attendus lus dans le source, en face
     des blocs cliques) et un ecart sort en code 2 : une mesure incomplete ne peut plus
     se lire comme un « tout concorde », ce qu'elle faisait apres avoir juge 26 % des
     blocs. Il ne peut tenir qu'ici : il ouvre 75 pages une par une. */
  ETAPES.push({
    nom: "clic   ",
    fichier: "verif-clic.js",
    args: [],
    quoi: "le bouton « Tester » est clique pour de vrai : la sortie du Worker face au bloc publie",
    lent: true,
    pourquoiLent: "il ouvre 75 pages dans Chrome, une par une",
  });
}

/* =========================================================================== *
 * MODE --mutations : LES EPREUVES PAR INJECTION, ET RIEN D'AUTRE.
 *
 * POURQUOI UN MODE A PART. Ces douze outils prouvent que les verificateurs
 * VOIENT vraiment une faute — c'est le controle le plus precieux du projet, et
 * le point A1 a mesure que dix d'entre eux n'etaient lances par rien. Mais ils
 * MODIFIENT des fichiers du depot avant de les restaurer, et ils coutent
 * ensemble pres d'une heure : les verser dans `verif.js` ordinaire serait a la
 * fois risque et intenable. D'ou un mode dedie.
 *
 * CE QUE CE MODE GARANTIT, ET QU'AUCUNE EPREUVE NE PEUT GARANTIR SEULE.
 * Chaque epreuve pose deja ses filets (`exit`, `SIGINT`, `uncaughtException`).
 * Aucun de ces filets ne se declenche sur un ARRET BRUTAL : c'est ce qui est
 * arrive au point A1, ou `preuves/execution-ancres-mutations.js`, tuee a 614 s,
 * a laisse sa faute injectee dans `js/execution.js`. Le mode releve donc l'etat
 * du depot AVANT chaque epreuve, le recompare APRES, et RESTAURE lui-meme tout
 * fichier laisse modifie — en comptant l'epreuve en echec, car une epreuve qui
 * salit le depot a echoue meme si son verdict etait bon.
 * Il ramasse aussi les Chrome orphelins : apres le kill de `verif-clic.js`,
 * cinquante `chrome.exe` tournaient encore. Seuls les Chrome de test sont tues
 * (ceux dont la ligne de commande porte un profil du projet), jamais celui de
 * l'utilisateur.
 *
 *   node tools/verif.js --mutations
 *   node tools/verif.js --mutations --seul=git-modele
 *   node tools/verif.js --mutations --minutes=20    # plafond par epreuve
 * ========================================================================== */
if (flag("mutations")) {
  /* Ordre : de la plus courte a la plus longue, pour qu'un defaut se voie vite.
     Les durees sont celles du releve A1, refaites par ce mode a chaque passage. */
  var EPREUVES = [
    /* Ajoutee le 2026-09-08 avec les trois etats du verdict (point A5). C'est la
       seule epreuve qui juge la CHAINE elle-meme et non un verificateur : elle lui
       donne des etapes dont elle connait le code de sortie (0, 1, 2, 3) et exige le
       bon etat, la bonne cause imprimee et le bon code global. Son 5e cas rejoue la
       regression historique sur une vraie etape `sautable` : avant ce point, un
       code 2 y etait converti en 0 et la chaine annoncait « tout est vert » pour
       une etape qui n'avait rien regarde. */
    { nom: "verdict ", fichier: "verif-verdict-mutations.js", vues: "6 / 6" },
    { nom: "mth-chif", fichier: "maths/module-5/verif-chiffres-mutations.js", vues: "toutes" },
    /* 7 depuis B4 : le 7e cas eprouve « l'incise entre parentheses », entree dans
       EXPLOITABLES le 2026-09-04. Une branche de verificateur que rien n'eprouve
       ne vaut pas mieux qu'un verificateur absent. */
    { nom: "qcmbiai ", fichier: "verif-qcm-biais-mutations.js", vues: "10 / 10" },
    /* Ajoutee le 2026-09-07, avec la lecture RESTREINDRE du cliquet lexical. Son
       2e cas est le seul du depot a exiger que le verdict NOMME une dimension
       precise (« INVERSE/restr. ») : il injecte l'ancienne regle d'ecriture
       0 / 0 / k, que les trois dimensions historiques ne peuvent pas voir. Sans
       cette exigence, le cas serait passe vert sur une branche ancienne et la
       branche neuve serait restee sans preuve. */
    { nom: "qcmlexi ", fichier: "verif-qcm-lexique-mutations.js", vues: "6 / 6" },
    /* Ajoutee le 2026-09-08 avec le cliquet des explications orphelines. Deux de ses
       quatre cas ne sont pas des mutations mais des REJEUX du reel : les deux
       orphelines historiques de `kotlin`, restaurees depuis git. C'est cette epreuve
       qui a fait jeter le premier jet de l'outil — il n'en voyait aucune. Le 4e cas
       eprouve le garde-fou du piege cmd.exe (« ^ » mange, comparaison a soi-meme). */
    { nom: "explorp ", fichier: "verif-explain-orpheline-mutations.js", vues: "4 / 4" },
    { nom: "fraich  ", fichier: "fraicheur/verif-fraicheur-mutations.js", vues: "13 / 13" },
    { nom: "fr-affi ", fichier: "fraicheur/verif-affichage-mutations.js", vues: "14 / 14" },
    { nom: "mth-inj ", fichier: "maths/preuve-injection.js", vues: "13 / 13" },
    { nom: "chaine  ", fichier: "verif-chaine-mutations.js", vues: "9 / 9" },
    { nom: "vexlien ", fichier: "verif-execution-liens-mutations.js", vues: "8 / 8" },
    { nom: "git-mod ", fichier: "verif-git-modele-mutations.js", vues: "29 / 29" },
    { nom: "git-graf", fichier: "verif-git-graphe-mutations.js", vues: "29 / 29" },
    { nom: "git-scen", fichier: "verif-git-scenarios-mutations.js", vues: "30 / 30" },
    { nom: "vexec   ", fichier: "verif-execution-mutations.js", vues: "11 / 12 — un angle mort connu" },
    { nom: "git-cmd ", fichier: "verif-git-commandes-mutations.js", vues: "?" },
    { nom: "vexancr ", fichier: "preuves/execution-ancres-mutations.js", vues: "?" },
  ];

  var argSeul = (args.filter(function (a) { return a.indexOf("--seul=") === 0; })[0] || "").slice(7);
  var argMin = Number((args.filter(function (a) { return a.indexOf("--minutes=") === 0; })[0] || "").slice(10)) || 25;
  var PLAFOND = argMin * 60 * 1000;
  if (argSeul) {
    /* Plusieurs motifs, separes par des virgules : le releve se fait par lots,
       les cinq epreuves longues ne tenant pas dans le meme passage que les courtes. */
    var motifs = argSeul.split(",").map(function (m) { return m.trim(); }).filter(Boolean);
    EPREUVES = EPREUVES.filter(function (e) {
      return motifs.some(function (m) { return e.fichier.indexOf(m) !== -1; });
    });
    if (!EPREUVES.length) { console.log("aucune epreuve ne correspond a --seul=" + argSeul); process.exit(2); }
  }

  /* L'etat du depot, ligne par ligne. On ne se contente pas d'exiger un depot
     PROPRE au depart : un chantier en cours est la situation normale. On releve
     donc l'etat de reference et on ne s'alarme que des lignes NOUVELLES. */
  function etatDepot() {
    var r = cp.spawnSync("git", ["status", "--porcelain"], { cwd: RACINE, encoding: "utf8" });
    if (r.status !== 0) return null;
    return (r.stdout || "").split("\n").filter(function (l) { return l.trim(); });
  }
  function cheminDe(ligne) {
    var p = ligne.slice(3).trim();
    if (p.indexOf(" -> ") !== -1) p = p.split(" -> ")[1];
    return p.replace(/^"|"$/g, "");
  }
  /* Ne tue QUE les Chrome de test : ceux dont la ligne de commande porte un
     profil du projet. Le Chrome de l'utilisateur n'est jamais touche. */
  function ramasserChrome() {
    if (process.platform !== "win32") return 0;
    var ps = "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | " +
      "Where-Object { $_.CommandLine -match 'syntaxe-|scratchpad..chrome|verif-stockage' } | " +
      "ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop; 'tue' } catch {} }";
    var r = cp.spawnSync("powershell", ["-NoProfile", "-NonInteractive", "-Command", ps],
      { encoding: "utf8", timeout: 60000 });
    return ((r.stdout || "").match(/tue/g) || []).length;
  }

  /* `--lister` doit rester INOFFENSIF dans tous les modes. Sans ce garde, un
     `--mutations --lister` lancait les douze epreuves : c'est arrive, et le run
     interrompu a laisse une mutation dans `pages/js/lecon-02.html`. */
  if (flag("lister")) {
    EPREUVES.forEach(function (e) { console.log(e.fichier); });
    process.exit(0);
  }

  var reference = etatDepot();
  var referenceDepart = reference;
  if (reference === null) { console.log("git est introuvable : ce mode ne peut pas garantir la propriete du depot."); process.exit(2); }
  console.log("verif.js --mutations — " + EPREUVES.length + " epreuve(s) par injection");
  console.log("  etat du depot au depart : " + (reference.length ? reference.length + " fichier(s) deja modifie(s), ignores" : "propre"));
  /* ET ON LES NOMME (B4, 2026-09-04). Ce mode ignore a dessein les fichiers deja
     modifies : un chantier en cours est la situation normale. Mais quand une
     execution precedente a ete INTERROMPUE, elle laisse une faute injectee dans
     un fichier du site -- et la ligne ci-dessus la comptait sans la nommer, si
     bien que la mutation orpheline se fondait dans le chantier en cours.
     C'est arrive : un `js/execution.js` ampute de sa fleche droite est reste
     dans l'arbre de travail apres l'arret d'un passage, et seul un `git status`
     manuel l'a vu. Les nommer coute deux lignes ; ne pas les nommer coute une
     faute publiee. */
  reference.forEach(function (l) { console.log("      deja modifie : " + cheminDe(l)); });
  if (reference.length) {
    console.log("      ^ si l'un d'eux n'est PAS de vous, c'est la trace d'un passage interrompu :");
    console.log("        une faute injectee y est peut-etre restee. Verifier avant de commiter.");
  }
  console.log("  plafond par epreuve : " + argMin + " min\n");

  var bilan = [];
  var t0Total = Date.now();
  EPREUVES.forEach(function (e) {
    process.stdout.write("  " + e.nom + "  " + e.fichier + "\n");
    /* L'etat de reference est relu JUSTE AVANT chaque epreuve, et non une fois
       pour toutes : ainsi le mode n'impute a une epreuve que ce qu'elle a elle-meme
       laisse, et il ne restaure pas un fichier modifie entre-temps par autre chose. */
    reference = etatDepot() || reference;
    var t0 = Date.now();
    var r = cp.spawnSync(process.execPath, [path.join(TOOLS, e.fichier)], {
      encoding: "utf8", cwd: RACINE, timeout: PLAFOND, killSignal: "SIGKILL",
      maxBuffer: 64 * 1024 * 1024,
    });
    var duree = ((Date.now() - t0) / 1000).toFixed(1);
    var tues = ramasserChrome();
    /* La garantie du mode : ce que l'epreuve a laisse derriere elle. */
    var apres = etatDepot() || [];
    var traces = apres.filter(function (l) { return reference.indexOf(l) === -1; });
    var restaures = [];
    traces.forEach(function (l) {
      var f = cheminDe(l);
      if (/^\?\?/.test(l)) return;                       /* un fichier NOUVEAU n'est pas une trace a effacer */
      var g = cp.spawnSync("git", ["checkout", "--", f], { cwd: RACINE, encoding: "utf8" });
      restaures.push(f + (g.status === 0 ? "" : " (ECHEC)"));
    });
    var expire = r.error && r.error.code === "ETIMEDOUT";
    /* Meme distinction qu'en mode ordinaire (point A5) : une epreuve qui sort en 2
       n'a PAS trouve son verificateur aveugle, elle n'a pas pu tourner du tout --
       fichier de reference absent, git introuvable, moteur qui ne demarre pas. La
       compter « SIGNALE » revenait a lire un outil en panne comme un angle mort
       trouve, et donc a chercher un defaut la ou il n'y en a pas. */
    var etat = expire ? "EXPIRE"
      : r.status === 0 ? "OK"
      : (r.status === 2 || r.status === null || r.status === undefined) ? "NON MESURE"
      : "SIGNALE";
    if (restaures.length) etat = "SALE";
    bilan.push({ e: e, etat: etat, duree: duree, code: r.status, restaures: restaures, tues: tues,
      sortie: (r.stdout || "") + (r.stderr || "") });
    process.stdout.write("          -> " + etat + " en " + duree + " s" +
      (tues ? "  (" + tues + " chrome.exe ramasse(s))" : "") +
      (restaures.length ? "  ⚠ fichier(s) laisse(s) modifie(s), restaure(s) : " + restaures.join(", ") : "") + "\n\n");
  });

  console.log("=".repeat(70));
  bilan.forEach(function (b) {
    var lignes = b.sortie.split("\n").filter(function (l) {
      return /vue|voit|inject|mutation|aveugle|ECHEC|OK/i.test(l) && l.trim();
    });
    console.log("  " + b.e.nom + "  " + b.etat + "   (" + b.duree + " s)");
    lignes.slice(-1).forEach(function (l) { console.log("            " + l.trim().slice(0, 100)); });
  });
  console.log("=".repeat(70));
  var mauvais = bilan.filter(function (b) { return b.etat !== "OK" && b.etat !== "NON MESURE"; });
  var muettes = bilan.filter(function (b) { return b.etat === "NON MESURE"; });
  var final = etatDepot() || [];
  var restant = final.filter(function (l) { return referenceDepart.indexOf(l) === -1 && !/^\?\?/.test(l); });
  console.log("  total : " + ((Date.now() - t0Total) / 1000).toFixed(1) + " s · " +
    (mauvais.length || muettes.length
      ? [mauvais.length ? mauvais.length + " epreuve(s) en defaut" : "",
         muettes.length ? muettes.length + " epreuve(s) N'ONT RIEN PU MESURER" : ""].filter(Boolean).join(" · ")
      : "les " + bilan.length + " epreuves ont vu leurs fautes"));
  console.log("  depot a la sortie : " + (restant.length ? "SALE — " + restant.map(cheminDe).join(", ") : "propre, comme au depart"));
  process.exit(mauvais.length || restant.length ? 1 : muettes.length ? 2 : 0);
}

/* --seules=motif1,motif2 : ne garder que les etapes dont le nom de fichier contient
   l'un des motifs. Ajoute au point A5 pour une raison precise : l'epreuve par
   injection du verdict (`verif-verdict-mutations.js`) doit pouvoir faire juger UNE
   etape temoin par cette chaine-ci, sans en payer les cinquante autres. Un motif qui
   ne designe aucune etape du mode mais qui existe sous tools/ devient une etape a la
   volee : c'est ce qui permet de faire passer un outil declare hors chaine par la
   meme mecanique de verdict, sans le recopier ailleurs.
   Un motif qui ne designe rien du tout est une erreur d'appel, pas un mode vide :
   la chaine sort en 2 (rien n'a pu etre mesure) plutot que d'annoncer « tout est
   vert » apres n'avoir rien lance -- c'est le defaut meme que ce point ferme. */
var argSeules = (args.filter(function (a) { return a.indexOf("--seules=") === 0; })[0] || "").slice(9);
if (argSeules) {
  var motifsE = argSeules.split(",").map(function (m) { return m.trim(); }).filter(Boolean);
  var gardees = ETAPES.filter(function (e) {
    return motifsE.some(function (m) { return e.fichier.indexOf(m) !== -1; });
  });
  motifsE.forEach(function (m) {
    if (gardees.some(function (e) { return e.fichier.indexOf(m) !== -1; })) return;
    var fs2 = require("fs");
    if (fs2.existsSync(path.join(TOOLS, m.split("/").join(path.sep)))) {
      gardees.push({ nom: "adhoc  ", fichier: m, args: [], quoi: "outil lance a la demande (hors liste du mode)" });
    }
  });
  if (!gardees.length) {
    console.log("verif.js — aucune etape ne correspond a --seules=" + argSeules + " : RIEN N'A ETE MESURE.");
    process.exit(2);
  }
  ETAPES = gardees;
}

/* --lister : rendre la liste des etapes du mode demande, une par ligne, sans rien
   lancer. C'est ce que lit `tools/recense-chaine.js` pour croiser la chaine avec
   l'inventaire des outils. Il la LIT ici plutot que d'en recopier une copie : une
   liste recopiee se perime en silence, ce qui est exactement le defaut que le
   chantier V16 est venu fermer. */
if (flag("lister")) {
  ETAPES.forEach(function (e) { console.log(e.fichier); });
  process.exit(0);
}

console.log("verif.js — " + ETAPES.length + " verificateur(s)" + (RAPIDE ? " (mode rapide : le rendu est saute)" : "") + "\n");

/* =========================================================================== *
 * LES TROIS ETATS D'UNE ETAPE (point A5 du chantier V17).
 *
 * Toute la chaine lisait `r.status !== 0` : « il a signale quelque chose ». Les
 * outils du projet, eux, distinguent depuis toujours DEUX echecs differents --
 * 1 = « j'ai mesure et j'ai trouve une faute », 2 = « je n'ai RIEN pu mesurer »
 * (donnees illisibles, moteur introuvable, Chrome absent, reference manquante).
 * Mesure du 2026-09-08 : 30 des 62 etapes de la chaine savent sortir en 2, dont
 * 25 qui n'etaient pas declarees `sautable` -- leur panne se lisait « faute
 * trouvee » -- et 5 qui l'etaient, dont le code 2 etait converti en 0 : la chaine
 * imprimait « tout est vert » pour une etape qui n'avait rien regarde.
 *
 * `status === null` : le processus a ete tue (signal, plafond) ou n'a pas pu
 * demarrer. Il n'a rien mesure non plus, et le dire vaut mieux que l'appeler
 * « faute trouvee ».
 * ========================================================================== */
var LIBELLE = { ok: "OK  ", signale: "SIGNALE", nonmesure: "NON MESURE" };
function classer(r) {
  if (r.status === 0) return "ok";
  if (r.status === 2 || r.status === null || r.status === undefined) return "nonmesure";
  return "signale";
}
/* POURQUOI rien n'a pu etre mesure : on prend la premiere ligne de l'outil qui
   l'explique (les 30 etapes concernees impriment toutes un motif avant de sortir),
   sinon la derniere ligne non vide, sinon le signal ou l'erreur de lancement. */
function causeDe(r, sortie) {
  if (r.status !== 2) {
    if (r.error) return "l'etape n'a pas pu etre lancee : " + (r.error.code || r.error.message);
    if (r.signal) return "processus tue par " + r.signal + " : aucune mesure rendue";
    if (r.status === null || r.status === undefined) return "processus interrompu sans code de sortie";
  }
  var l = sortie.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
  var motif = l.filter(function (x) {
    return /introuvable|illisible|impossible|ARR[EÊ]T|abandon|n'a pas pu|n'a pas repondu|aucune? (mesure|reference|lecon|fichier)|rien (n'a ete|de mesure)|MESURE INCOMPL/i.test(x);
  })[0];
  return (motif || l[l.length - 1] || "l'outil est sorti en 2 sans rien expliquer").slice(0, 160);
}
var resultats = [];
var debutTotal = Date.now();

ETAPES.forEach(function (e) {
  var t0 = Date.now();
  /* `lent` a longtemps voulu dire « pilote Chrome », et le message le disait en
     toutes lettres. Ce n'est plus vrai depuis que `verif-sorties.js` est entre dans
     la chaine : il est lent parce qu'il rejoue 449 programmes dans un bac a sable,
     sans ouvrir un seul navigateur. Une etape peut donc dire POURQUOI elle est lente. */
  process.stdout.write("  " + e.nom + "  " + e.quoi +
    (e.lent ? "  (patience, " + (e.pourquoiLent || "il pilote Chrome") + ")" : "") + "\n");
  var r = cp.spawnSync(process.execPath, [path.join(TOOLS, e.fichier)].concat(e.args), {
    encoding: "utf8",
    cwd: RACINE,
    maxBuffer: 32 * 1024 * 1024,
  });
  var duree = ((Date.now() - t0) / 1000).toFixed(1);
  var sortie = (r.stdout || "") + (r.stderr || "");
  var etat = classer(r);
  /* `sautable` ne repeint plus rien : il ne sert qu'a NOMMER la cause attendue
     (« l'outil externe n'est pas installe sur cette machine »), pour qu'on ne
     confonde pas une machine sans git avec un verificateur en panne. */
  var cause = causeDe(r, sortie);
  if (etat === "nonmesure" && e.sautable) cause = "outil externe absent, cause prevue — " + cause;
  resultats.push({ e: e, etat: etat, code: r.status, cause: cause, duree: duree, sortie: sortie });
  process.stdout.write("          -> " + LIBELLE[etat] + "  en " + duree + " s\n\n");
});

/* ------------------------------------------------------------------ verdict */
var enEchec = resultats.filter(function (r) { return r.etat === "signale"; });
var nonMesures = resultats.filter(function (r) { return r.etat === "nonmesure"; });
console.log("=".repeat(70));
resultats.forEach(function (r) {
  /* on remonte la ou les lignes de bilan de chaque outil, pas tout son rapport.
     V17/A2 (2026-09-08) : les deux CLIQUETS du biais des QCM n'etaient captes par
     aucun de ces motifs — `--rapide` n'affichait donc que « qcmbiai OK » et
     « qcmlexi OK », sans jamais dire combien de cours sont verrouilles ni ce qui
     a bouge. Un cliquet muet est un cliquet qu'on cesse de lire : on ajoute ses
     lignes de bilan (cours traites, « n'a empire », progres non figes). */
  var lignes = r.sortie.split("\n").filter(function (l) {
    return /ERREURS|erreur\(s\)|sous le standard|Aucun probl|aucune erreur|probleme|maigre|redondance|divergen|Aucune divergence|n'a empire|marques traites|marque traite|PROGRESSE|reference perimee/i.test(l) && l.trim();
  });
  console.log("  " + r.e.nom + "  " + LIBELLE[r.etat].trim() + "   (" + r.duree + " s)");
  /* Une etape qui n'a rien mesure doit DIRE pourquoi, sur la ligne meme du bilan :
     sans cela elle se lit comme une etape ordinaire et on la survole. */
  if (r.etat === "nonmesure") console.log("            cause : " + r.cause);
  lignes.slice(-2).forEach(function (l) { console.log("            " + l.trim().slice(0, 100)); });
});
console.log("=".repeat(70));
/* LE VERDICT EN TROIS LIGNES, ET JAMAIS DEUX MOTS POUR TROIS ETATS. « tout est vert »
   n'est imprime que si TOUTES les etapes ont pu mesurer : c'est la phrase que les
   comptes rendus recopient, et elle affirmait jusqu'ici la sante du site alors qu'une
   etape avait pu ne rien regarder du tout. */
console.log("  total : " + ((Date.now() - debutTotal) / 1000).toFixed(1) + " s · " +
  (enEchec.length || nonMesures.length
    ? [enEchec.length ? enEchec.length + " verificateur(s) ont signale quelque chose" : "",
       nonMesures.length ? nonMesures.length + " n'ont RIEN PU MESURER" : ""]
      .filter(Boolean).join(" · ")
    : "tout est vert (" + resultats.length + " etape(s), toutes mesurees)"));

if (enEchec.length) {
  console.log("\n  Pour le detail, relance l'outil concerne :");
  enEchec.forEach(function (r) { console.log("    node tools/" + r.e.fichier + " " + r.e.args.join(" ")); });
}
if (nonMesures.length) {
  console.log("\n  RIEN N'A ETE MESURE par ces etapes — ce n'est ni un « OK » ni une faute trouvee,");
  console.log("  c'est un trou dans la couverture. A traiter comme tel :");
  nonMesures.forEach(function (r) {
    console.log("    " + r.e.fichier + " — " + r.cause);
  });
}
/* 1 prime sur 2 : quand une faute est trouvee, c'est elle qu'on va lire en premier. */
process.exit(enEchec.length ? 1 : nonMesures.length ? 2 : 0);
