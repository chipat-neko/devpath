# LE NNᵉ COURS — `cobol`, 98,7 % → 24,5 %

**« COBOL : le langage des systèmes bancaires », 14 leçons, 50 questions dont 8 de bilan.** Traité seul
(écriture, dosage, relecture par contradiction, correction, contre-relecture) le 2026-11-10 dans la
copie de travail `D:\test-claude-b4\cobol`, branche `b4/cobol`. Consigne versionnée :
`scratchpad/CONSIGNE-COBOL.md`.

Aucune écriture hors de `pages/cobol/**`, `scratchpad/CONSIGNE-COBOL.md` et de ce rapport. ⚠️ **Un
détail de copie de travail à connaître pour la fusion** : la copie a été extraite avec
`core.autocrlf=true` (réglage système de Git pour Windows), donc en **CRLF**, alors que le dépôt
principal est en LF et que `remplace.js` refuse le CRLF. Les 15 pages de `pages/cobol/` ont été
remises en LF dans la copie avant tout travail ; `git diff` était vide après la conversion (le
contenu indexé est en LF des deux côtés), aucun commit n'en porte la trace. Les pages des autres
cours de cette copie sont restées en CRLF : c'est sans effet sur les mesures de `cobol`.

## Commits (branche `b4/cobol`, sur `a6a45f2`)

| commit | étape |
|---|---|
| `1953681` | consigne et mesures de départ, GnuCOBOL installé, table des erreurs classiques exécutée |
| `cde9703` | vague, lot 1 (leçons 01-03) : 22 distracteurs |
| `8a38e6d` | vague, lot 2 (leçons 04-06) : 24 distracteurs |
| `38983d4` | vague, lot 3 (leçons 07-09, et `lecon-05` q1) : 28 distracteurs |
| `e35bf6e` | vague, lot 4 (leçons 10-12) : 27 distracteurs |
| `de5a95e` | vague, lot 5 (leçons 13-14, bilan compris) : 36 distracteurs |
| `bce4eac` | dosage calculé (la plus dense, mots fétiches, tic, intrus) |
| `24a4631` | relecture par contradiction et corrections de fond |
| `1a8023d` | contre-relecture des corrections |
| `59cde52` | second dosage (intrus lexical en lecture inverse, biais inverse) |

## Le cours s'exécute : GnuCOBOL 3.2 portable, hors de tout dépôt

Ni `cobc` ni WSL. Installé dans `D:\outils-b4\cobol\` à partir des **paquets officiels MSYS2**
(`repo.msys2.org/mingw/ucrt64/`) : `mingw-w64-ucrt-x86_64-gnucobol 1~3.2-10` et sa chaîne `gcc`
16.2, **29 paquets**, chacun vérifié contre le SHA256 de la base `ucrt64.db`, décompressé par le zstd
de Node 24 et extrait par un lecteur tar écrit pour l'occasion (le `tar` de Git Bash refusait les
liens durs de `binutils` sur ce disque). `cobc (GnuCOBOL) 3.2.0`. Lanceur :
`bash /d/outils-b4/cobol/cob.sh fichier.cbl [-free] [options]`. **Environ 45 programmes COBOL
compilés et exécutés**, tous dans `D:\outils-b4\cobol\essais\` (sorties conservées, dont
`classiques.out`). Berkeley DB fournit les fichiers indexés : chaque essai indexé tourne dans un
dossier neuf (sous Windows `CLIENTS.DAT` et `clients.dat` sont le même fichier, et le premier essai
a buté sur le fichier séquentiel d'un essai précédent).

## Avant / après

Commandes : `node tools/mesure-biais-qcm.js --seul=cobol`, `plan-rangs-qcm.js cobol [--marques]`,
`mesure-biais-inverse.js --toutes cobol`, `mesure-lexique-qcm.js --liste=cobol` et `--seul=cobol`,
`mesure-mot-fetiche.js cobol`, `mesure-tics-lot.js cobol --exemples`, `mesure-mot-question.js cobol`.
Sorties brutes : `scratchpad/cobol-depart/`, `cobol-vague/`, `cobol-dosage/`, `cobol-final/` (hors git).

| indice | départ | après la vague | final |
|---|---:|---:|---:|
| **« la plus longue »** (réussite / sans ex æquo) | **98,7 % / 98,0 %** | 24,5 % | **24,5 %** (couverture 90 %, rendement 26,7 %) |
| pire stratégie sur 44 | 98,7 % (la plus longue) | **46,2 %** (la plus dense) | **26,5 %** (DEUXIÈME et TROISIÈME plus longue, ECARTER la plus courte, écarter les deux extrêmes) |
| la plus dense | 35,7 % | **46,2 %** | **26,2 %** |
| la moins bavarde | 2,2 % | 31,2 % | 25,3 % |
| l'incise entre parenthèses / RESTREINDRE à la parenthèse | 72,0 % / 73,5 % | 24,7 % / 26,0 % | 24,8 % / 26,0 % |
| la plus détaillée | 68,3 % | 19,2 % | 21,2 % |
| le mot technique exclusif | 60,7 % | 23,5 % | 20,8 % |
| ECARTER la moins bavarde | 58,2 % | 21,5 % | 24,3 % |
| ponctuation forte (seule / RESTREINDRE) | 52,0 % / 52,5 % | 25,0 % / 25,0 % | 25,0 % / 25,0 % |
| questions trahies par 5 indices ou plus | **37 sur 50** (74 %) | 0 | **0** (41 à 0-2 indices, 9 à 3-4) |
| rangs de la bonne réponse | **50 / 0 / 0 / 0** | 13 / 13 / 13 / 11 | **13 / 13 / 13 / 11** (visés 13 / 13 / 12 / 12) |
| biais inverse (alertes) | 4 | 2 | **0** |
| mots fétiches (alertes) | 1 (`procedure`) | 3 (`programme` 0/22, `chaque` 0/16, `lecture` 1/13) | **0** |
| tics de lot | **9** (glose finale 15/1, deux-points médian 14/1…) | 1 (« comme un ») | **0** |
| lexique (`--liste`) | 43 exploitables, 26 retournées, 44 à mettre en forme | 2 / 0 / 2 | **2 / 1 / 3** ; global STRICTE 25,0 %, PROPORTION 26,0 %, INVERSE 25,0 % |
| intrus lexical DÉFAUT (direct / inverse / sûres) | 21,5 % / 26,2 % / 0 | 19,2 % / 29,8 % / 2 | **17,2 % / 27,8 % / 0** |
| intrus lexical EXCÈS (direct / inverse / sûres) | **28,8 %** / 17,2 % / 0 | 26,3 % / 25,0 % / 1 | **25,3 % / 25,0 % / 0** |
| point interne (bonne seule) | 5 | 0 | **0** (1 question « bonne partagée », `lecon-05` q2, 3 options sur 4) |

**138 distracteurs réécrits sur 150, 12 gardés** : les noms de verbes courts des questions
`lecon-01` q2 et du bilan q8 (PRINT, WRITE, ECHO, SHOW), deux des trois permutations de
`lecon-02` q1 (la troisième, `MAIN, DATA, CODE, END`, a été remplacée par une permutation réelle :
les quatre options font 44 caractères, égalité parfaite), CALL et GO TO (`lecon-05` q1), FIELD et
LET du bilan. **3 091 → 14 526 caractères** dans les distracteurs réécrits (**11 435 écrits en
plus**, pour 9 485 demandés par `plan-rangs-qcm`). `mesure-qcm-intouchable cobol 1953681` :
**1 atteinte, délibérée** (l'explication de `lecon-06` q3, voir plus bas).

## Fautes de fond trouvées et corrigées — chacune avec sa preuve

Aucune **bonne réponse** n'a été prouvée fausse : les 50 ont été confrontées à GnuCOBOL quand elles
s'exécutent (ordre des divisions, groupe sans PIC, champ édité refusé en calcul, ROUNDED, GIVING,
88, VARYING, indices à partir de 1, SEARCH / SEARCH ALL, AT END, FILE STATUS 00/22/23/10, REWRITE,
BY CONTENT, COPY, CHAINE(3:2), CONVERTING…), aux pages sinon. **Une explication est fausse et a été
corrigée** (atteinte délibérée à l'intouchable) :

1. **`lecon-06` q3, explain** : « SEARCH parcourt la table élément par élément, **sans prérequis** » —
   la page elle-même dit plus haut que la table doit avoir un `INDEXED BY`, et GnuCOBOL refuse
   `SEARCH` sur une table sans index (`essais/l06search.cbl` : « 'ARTICLE' not indexed », sous les
   normes `default`, `ibm`, `cobol85` et `cobol2014`). Devenu « sans exiger de tri (mais avec un
   index déclaré par INDEXED BY) ».

Fautes de **corps**, toutes rejouées :

2. **`lecon-03`, deux exemples qui ne compilaient pas** : `01 MESSAGE PIC X(10)` et la solution de
   l'exercice 2 `05 CODE PIC 9(5)` — `MESSAGE` et `CODE` sont des **mots réservés** (« syntax error,
   unexpected MESSAGE », « unexpected CODE », sous `default`, `ibm`, `cobol85`, `mf` ; `CODE` aussi
   sous `cobol2014`). Renommés `ACCUEIL` et `CODE-ART`, recompilés (`essais/corr/l03.cbl`). Un
   relevé des 77 noms de données du cours contre la liste des mots réservés de `cobc` n'en a pas
   trouvé d'autre (`C` est réservé « selon le contexte » et compile, `FILLER` est voulu).
3. **`lecon-04`, sorties d'exercices** : `*> 0087.50` et `*> 0020.00` pour un `PIC 9(5)V99` —
   GnuCOBOL 3.2 affiche **`00087.50`** et **`00020.00`** (cinq chiffres entiers ; `classiques.out`).
4. **`lecon-04`, Bourse de Vancouver** : « tronquait **la troisième décimale** » et « l'indice a
   **bondi de près de moitié** » — l'indice était tronqué **à trois décimales**, et la correction l'a
   fait passer de **524,811 à 1098,892** : il a **plus que doublé**. Source : article « Vancouver Stock
   Exchange » de Wikipédia (anglophone), lu le 2026-11-10 (*source*, non exécutable).
5. **`lecon-07`, bloc « Écrire dans un fichier »** : il ouvrait `F-SORTIE` puis écrivait
   `CLIENT-REC`, l'enregistrement de `F-CLIENTS` — exécuté : **FILE STATUS 48** sur `F-CLIENTS`,
   `sortie.dat` reste vide. Le bloc ouvre et ferme désormais `F-CLIENTS` (rejoué : deux clients écrits,
   relus par la boucle de la page, `EXTEND` en ajoute un troisième). Au passage, « la section
   FILE-CONTROL » → « le paragraphe » (le glossaire de la même page le dit), et le FILE STATUS est
   « nommé dans le SELECT, déclaré en WORKING-STORAGE ».
6. **`lecon-08`, piège de l'amorçage** : « sans elle, le premier enregistrement n'est **jamais
   traité** » — exécuté (`essais/l08b.cbl`, programme neuf) : sans lecture d'amorçage, **tous** les
   enregistrements sont traités, **plus** un tour sur une zone jamais lue (4 ventes au lieu de 3,
   total `$100,400.00` au lieu de `$400.00`). Corrigé.
7. **`lecon-09`, deux contradictions** : « Cette dernière leçon » (le cours en a 14 : elle est la
   dernière **du module 3**, ce que dit désormais la phrase) ; et le titre « Lire la DATA DIVISION
   **en premier** » / « Avant la logique » / l'antisèche « à lire avant la logique », qui
   contredisaient le paragraphe précédent, l'autre ligne de l'antisèche (« à suivre en premier ») et
   la **bonne réponse de q1** (commencer par la PROCEDURE DIVISION). Devenu « en parallèle ».
8. **`lecon-10`, « Le même 12345 occupe 2 octets en COMP »** : un `PIC 9(4) COMP` occupe bien 2 octets
   mais **garde 2345** d'un `MOVE 12345`, et un `PIC 9(5) COMP` en occupe **4** (`BYTE-LENGTH`).
   Légende, schéma (quatre octets `00000000 00000000 00110000 00111001`) et `aria-label` corrigés.
9. **`lecon-10`, schéma de la PICTURE d'édition** : « 0 0 1 2 3 4 5 6 7 » (neuf chiffres pour un
   `PIC 9(6)V99`) et un résultat « ␣␣12,345.**99** » pour la valeur `12345.67` — GnuCOBOL rend
   `[    12,345.67]` (quatre espaces : trois zéros et la virgule qui les suit). Schéma, `aria-label` et
   commentaire du code alignés sur l'exécution.
10. **`lecon-10`, cas réel** : « En **2020**, une étude a montré… 43 % … 95 % » — ces chiffres viennent
    d'une infographie de **Reuters (2017)**, reprise depuis (*source secondaire* : plusieurs reprises
    concordantes, l'original n'a pas été lu). Formulation prudente posée. Et « l'arithmétique packed
    decimal **héritée de COMP-3** » (sens inversé) → « celle qu'emploie COMP-3 ».
11. **`lecon-11`, appel statique** : « `CALL "CALC-TVA"` (littéral) : le lien **est résolu à la
    compilation** » — sous GnuCOBOL, l'appelant compilé seul se lie sans erreur et échoue **à
    l'exécution** (« module 'CALC-TVA' not found ») ; seul `-fstatic-call` résout le lien à
    l'édition de liens (`essais/l11/`). Corrigé aux **quatre** endroits qui le disaient (liste,
    antisèche, glossaire, récapitulatif). Le comportement d'IBM (option DYNAM) n'est pas exécuté et
    n'est pas affirmé.
12. **`lecon-12`, solution de l'exercice 3** : si `START` échoue, `READ NEXT` rend **46** sans jamais
    déclencher `AT END` : la boucle `PERFORM UNTIL FIN-FICHIER` **ne se termine pas** (rejoué avec
    un garde-fou : statut 46 cinq tours de suite). `SET FIN-FICHIER TO TRUE` ajouté dans
    `INVALID KEY` ; rejoué : 0 tour si aucun compte, 3 comptes puis statut 10 sinon.
13. **`lecon-12` et `lecon-14`, REWRITE « préalablement lu »** : en accès `DYNAMIC`, `REWRITE` sans
    `READ` préalable rend **00** (`essais/l12d/l12.cbl`). Précisé : « en accès séquentiel, celui que
    le dernier READ vient de lire ».
14. **`lecon-13`** : la liste « Vérifie ta compréhension » posait d'autres questions que le QCM, dont
    `"BONJOUR"(2:3)`, une référence de sous-chaîne sur un **littéral**, qui ne compile pas (« syntax
    error, unexpected ( ») ; le schéma `REPLACING ALL SPACE` montrait « LE-CLIENT » alors que les
    **espaces de bourrage** du `PIC X(30)` deviennent eux aussi des tirets (`[LE-CLIENT----…]`) ;
    l'explication de l'exercice 3 se contredisait (« indépendants » / « l'ordre compte »).
15. **`lecon-02`, format fixe** : « une division en zone B **provoque une erreur de compilation** » —
    GnuCOBOL 3.2 l'accepte **sans rien dire** par défaut, avertit en `-std=ibm`, refuse en
    `-std=cobol85` et `-std=ibm-strict` (`essais/zonesb.cbl`). Piège et schéma précisés.
16. **`lecon-03`** : « mémorisé sur six caractères, **plus le signe** » — un `S9(4)V99` tient sur
    **6** octets, le signe est porté par le dernier chiffre (`-1234.56` → `313233343576`) ; 7 seulement
    avec `SIGN SEPARATE`. **`lecon-06`** : l'indice 13 d'une table de 12 « **corrompt** la mémoire
    voisine » → « **peut** écraser » (dans l'essai, le champ suivant est resté intact ; `-debug` le
    refuse : « subscript of 'MOIS-VENTE' out of bounds: 13 »). **`lecon-01`** : « Soixante-cinq ans
    plus tard » (1959 + 65 = 2024) → « Plus de soixante-cinq ans après ». **`lecon-10`** : liste de
    vérification réalignée sur le QCM pour sa troisième question.
17. **Six indices d'exercice qui donnaient la réponse** (`exos-tous.js`, `fuites-larges.js`) :
    `lecon-02` exo 2 (« MOVE 'PARIS' TO VILLE. » en premier indice), `lecon-04` exo 2 (« … ROUNDED
    = … »), `lecon-05` exo 1 (« IF AGE >= 18 »), `lecon-11` exo 1 (la réponse entière en dernier
    indice), `lecon-14` exo 2 (« COMPUTE … ») et exo 3 (l'égalité entière). Réécrits avec un masque.
18. **`lecon-02` q2** : l'explain cite la LINKAGE SECTION, que la vague avait retirée des options
    (`mesure-explain-orpheline` la signalait) ; le glossaire de la page la nomme désormais (« les
    données reçues d'un appelant, leçon 11 »), et le distracteur est revenu sans mot étranger.

**Distracteurs repris à la relecture** (vrais ou discutables) : `TYPE` et `FORMAT` (bilan q6) sont
des **mots réservés de GnuCOBOL** et `TYPE` est une clause de COBOL 2002 — remplacés par `VALUE` et
`SIZE` ; « COMP (binaire) : deux chiffres par octet » était **numériquement vrai** pour un
`PIC 9(4) COMP` (2 chiffres, 2 octets) — remplacé ; « Le point est facultatif : chaque compilateur
accepte sa présence comme son absence » était **en partie vrai** (GnuCOBOL accepte
`IDENTIFICATION DIVISION` sans point, avec un avertissement) — recentré sur ce qui est faux
(l'exécution change : `essais/bonnes/point.cbl`) ; `SET =` (bilan q7) laissé de côté, `SET` affectant
réellement un index ; `ROUNDING` envisagé puis écarté (mot de COBOL 2014, `INTERMEDIATE ROUNDING`).

**Signalé, non touché (discutable, non prouvé faux)** : la bonne réponse de `lecon-13` q2 range
`SIZE` parmi les délimiteurs « de STRING ou d'UNSTRING », alors que `UNSTRING … DELIMITED BY SIZE` ne
compile pas (« unexpected SIZE ») — la phrase se lit aussi comme une liste globale ; celle de
`lecon-04` q3 dit « aucune erreur d'arrondi sur les montants » (vrai pour les additions, une
division se tronque ou s'arrondit toujours) ; celle de `lecon-01` q3 dit que le point termine
« un paragraphe ». Le dernier indice de `lecon-02` exo 1 (« « Procédure » + « division » ») est une
réponse acceptée : dernière indication délibérée, laissée.

## Ce qui a été exécuté, et ce qui ne l'a pas été

**Exécuté** sous GnuCOBOL 3.2 (`D:\outils-b4\cobol\essais\`) : la table de 22 erreurs classiques de
la consigne ; chaque thèse fausse posée dans un distracteur qui porte sur un comportement du
langage (ADD … INTO, FUNCTION ROUND, clause ROUND, COMPUTE d'un littéral, MOVE TRUE vers un 88, 88
comme constante, VARYING … TO, UNTIL I >= 10, FROM 0, SEARCH sans index, SEARCH ALL sans clé,
UNSTRING … SIZE, référence de sous-chaîne sur un littéral, COMP-3 non signé accepté et stocké
`000123456F`, WRITE sur clé présente, READ NEXT après un START raté) ; tous les blocs de code des
leçons qu'une faute visait, dans leur forme corrigée ; le mini-projet `INVENTAIRE` de `lecon-14`
(compile en format fixe, `TOTAL : 00015`) et le cœur `2100-APPLIQUER` (solde 1150.00, un rejet).

**Non exécuté** (source ou mémoire, dit comme tel) : le JCL, CICS, DB2 et le SQL embarqué, VSAM et
IDCAMS (GnuCOBOL range ses fichiers indexés en Berkeley DB), le comportement d'IBM Enterprise COBOL
(options `DYNAM`, `TRUNC`, affichage sans point décimal) ; les chiffres de Reuters (source
secondaire) ; l'historique de Grace Hopper, du New Jersey en 2020, du bug de l'an 2000 et la date
de VSAM (1973), relus sans correction. ⚠️ **L'affichage `00087.50` est propre à GnuCOBOL**
(`pretty-display`) : un mainframe IBM afficherait `0008750` ; les commentaires corrigés suivent le
compilateur que le cours fait installer.

## Les leçons de ce cours

- **La vague fabrique « la plus dense », comme sur `tests` — et plus fort ici : 35,7 % → 46,2 %**
  (couverture 92 %). Les mots-clés COBOL en capitales et les termes techniques de la bonne réponse
  font des mots longs ; un distracteur allongé à la bonne longueur avec des mots courts devient
  moins dense. Fermé par **dix bascules calculées** (`scratchpad/cobol-sonde/dense.js` donne la
  marge de chaque question) : retirer un mot court, remplacer un mot par un plus long déjà présent
  dans la page, sans toucher au rang ni au `k`.
- **Remplir `w` avec les mots de la page fabrique des mots fétiches.** Pour tenir la règle du `k`
  (mots de 6 lettres et plus absents de la page), les mots longs « sûrs » — `programme`, `chaque`,
  `lecture` — se sont retrouvés dans 22, 16 et 13 distracteurs et dans aucune bonne réponse
  (ECARTER `programme` 31,0 %). Le dosage les a ramenés sous le seuil en les retirant des questions
  où **trois** distracteurs les portaient (crédit 100 % pour qui les écarte).
- **Le cliquet lexical et l'intrus lexical tirent en sens contraires.** Égaliser `k` et `w` pousse à
  reprendre les mots de la bonne réponse dans deux distracteurs ; un mot porté par trois options sur
  quatre désigne alors la quatrième. La lecture **inverse** de l'intrus (écarter l'option désignée)
  est montée à **31,0 %** après le premier dosage, avec deux questions à 100 % (`lecon-03` q1,
  `lecon-07` q3). Il a fallu un second dosage, mot par mot (`scratchpad/cobol-sonde/intrus.js`).
- **Deux égalités de longueur aux extrêmes donnent la bonne réponse à coup sûr** à « écarter les deux
  extrêmes » (`lecon-04` q1 : 72 / **85 / 85** / 59 ; bilan q9 : 14 / **13 / 13** / 15) : une retouche
  de densité les avait créées sans qu'aucun autre indicateur bouge.
- **Un mot réservé est une faute que la relecture à l'œil ne voit pas** : `MESSAGE`, `CODE`, `TYPE`,
  `FORMAT`. Croiser les identifiants du cours avec `cobc --list-reserved` coûte une commande.
- **Une correction de corps bouge `k`, et ici dans les deux sens** : « suivant » entré dans
  `lecon-09` (la bonne réponse de q1 le portait comme mot étranger), « changent » sorti de `lecon-10`
  (un distracteur de q2 le portait) — vus par `kdiff.js`, rattrapés avant le commit ; « dernière »
  aurait quitté `lecon-09` avec « Cette dernière leçon », d'où « dernière leçon du module 3 ».

## Ce qui reste

- **Lexique** : 2 questions exploitables (`lecon-07` q1 : PROPORTION désigne la bonne, ses trois
  distracteurs n'ont pas assez de mots longs dans 86 caractères ; `lecon-13` q2 : égalité à trois
  options sur la proportion), 1 retournée (`lecon-10` q3, gardée parce qu'elle porte une bascule de
  densité), 3 à mettre en forme ; le taux global de PROPORTION est à **26,0 %**.
- **Point interne** : `lecon-05` q2, trois options sur quatre portent un « ex. MOT » (crédit 33 %
  pour qui restreint à la marque).
- **Intrus lexical** : lecture inverse de DÉFAUT à **27,8 %**, juste sous le seuil de 28 % ; neuf
  questions la laissent à 33 % (un mot porté par trois options) et cinq à 50 %.
- **Index dérivés** : `verif-donnees` [I18] signale 8 erreurs attendues (quiz-index, antisèches et
  pièges de `cobol` périmés) — à régénérer par l'orchestrateur à la fusion, avec les cliquets
  (`verif-qcm-biais.js --ecrire`, `cobol` à marquer `traite`, `verif-qcm-lexique.js --ecrire`).
- **Pages dérivées qui citent des chiffres du corpus** (je n'y touche pas, règle de fusion) :
  `doc/verif-normatif.js` passe de 0 à **8 échecs** — la page publiée cite les chiffres d'avant le
  cours ; mesure du jour sur la branche : **1 240 manquements à S3** (la page en cite 6 103 − 4 821 =
  1 282, soit 42 de moins avec `cobol`), S4 **59 / 89 cours** (66,3 %), corpus de l'ancienne clause
  **3 698 questions** ; `doc/verif-doc.js` passe de 0 à **1 échec** — « titres hors ASCII » **9 577 →
  9 578**, parce que le titre de `lecon-09` « Lire la DATA DIVISION en premier » est devenu « … en
  parallèle » (faute de fond n° 7, l'accent de « parallèle »). À regénérer par l'orchestrateur avec
  les autres pages dérivées.
- **Hors B4** : dans 4 exercices, la réponse se lit dans l'énoncé visible (`fuites-enonces.js` :
  `lecon-05` exo 2, `lecon-09` exo 2, `lecon-12` exo 2, `lecon-13` exo 2), convention du site déjà
  notée sur `tests`.

## Clôture : `verif.js --rapide` et `verif-rendu`

**Dans la copie de travail**, `verif.js --rapide` signale 10 étapes et 1 non mesurée — mais cette
copie est en CRLF (voir plus haut) : `rejoue-cpp` ne retrouve aucun de ses 12 blocs,
`build-sources-worker` compte 4 écarts de caractères, `verif-sql-exos` ne trouve plus la fin de
`JUGE_SQL`, `maths/verif-verite` 58 divergences. Ces fichiers n'ont pas été modifiés (`git status`
ne montre que mes trois chemins) : ils comptent 415, 11, 198 retours chariot dans la copie et 0 dans
le dépôt.

**Sur un export LF de `59cde52`** (`git -c core.autocrlf=false archive`, hors dépôt, dans le
scratchpad de session) : 149,8 s, **8 étapes signalent, 0 non mesurée**, et chacune s'explique :

| Étape | Cause | Sur un export LF de `master` (`a6a45f2`) |
| --- | --- | --- |
| `donnees` | [I18] : 6 index de `cobol` périmés, 8 erreurs — attendu | — |
| `qcmbiai`, `qcmlexi` | `cobol` a progressé sans que le gain soit figé — attendu | — |
| `normatf` | 8 chiffres de corpus cités par la page de `doc` (ci-dessus) | 0 échec |
| `doc-ref` | « titres hors ASCII » 9 577 → 9 578 (ci-dessus) | 0 échec |
| `etudes`, `etude-6` | `etude-inconnu` périmée : « 6 570,2 Ko » publié | **déjà en faute** (6 561,1 Ko ; 6 561,2 Ko avec `cobol`) |
| `mth-prg` | barre lue « 0 / 13 » pendant que Chrome mesurait aussi `verif-rendu` | rejouée seule sur l'export : verte |

Seuls les journaux de `donnees`, `qcmbiai` et `qcmlexi` contiennent le mot « cobol ».

**`verif-rendu`** sur les 15 pages de `pages/cobol/` (6 largeurs × thèmes, 90 mesures) : **0 erreur,
0 avertissement** ; 6 mesures non stabilisées en 3 s (Chrome partagé avec la chaîne ci-dessus),
remesurées seules sur `lecon-06`, `lecon-07` et `lecon-08` : 18 mesures, 0 erreur, toutes
stabilisées. Les schémas retouchés de `lecon-03`, `lecon-10` (4 boîtes de 52 px au lieu de 2 de
108 px pour COMP) et `lecon-13` ne débordent pas.
