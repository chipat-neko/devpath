# C9 — fortran, 87,0 % → 25,9 %

Case C9 de la phase C du CHANTIER-V18 : les QCM du cours `fortran` (14 leçons, **54 questions**
dont 12 de bilan, **162 distracteurs**). Copie de travail `D:\test-claude-c9-fortran`, branche
`v18/c9-fortran`, partie de `8d163bf`. Un seul agent, tous les rôles (écriture, dosage,
relecture, correction, contre-relecture). Consigne du cours : `scratchpad/CONSIGNE-FORTRAN.md`.

**Aucun fichier du dépôt principal `D:\test-claude\` n'a été modifié.**

**Atteintes à l'intouchable : aucune.** `node tools/mesure-qcm-intouchable.js fortran 8d163bf` :
« 54 questions, 162 distracteurs, 156 reecrits. Aucune atteinte : q / correct / explain / bonne
reponse intacts. » Aucune bonne réponse ni explication n'a été prouvée fausse (§ 4).

## 1. Avant / après

| indice | commande | avant (`8d163bf`) | après |
|---|---|---:|---:|
| la plus longue | `node tools/mesure-biais-qcm.js --seul=fortran` | **87,0 %** | **25,9 %** |
| pire des 44 stratégies | id. | 87,0 % (la plus longue) | **27,3 %** (ECARTER la moins bavarde) |
| la plus détaillée | id. | 74,2 % | 25,5 % |
| RESTREINDRE à la parenthèse | id. | 61,9 % | 25,0 % |
| le mot technique exclusif | id. | 59,9 % | 23,3 % |
| l'incise entre parenthèses | id. | 59,3 % | 25,0 % |
| ponctuation forte (seule / restreindre) | id. | 54,2 / 54,6 % | 25,0 / 25,0 % |
| RESTREINDRE aux deux-points | id. | 47,7 % | 25,0 % |
| ECARTER la moins bavarde | id. | 43,5 % | 27,3 % |
| l'écho de la question | id. | 40,7 % | 25,0 % |
| l'attaque unique | id. | 36,1 % | 24,5 % |
| la plus dense | id. | 33,8 % | 26,5 % |
| la moins bavarde | id. | 2,2 % | 26,7 % |
| la seule avec un point-virgule | id. | 31,9 % | 25,0 % |
| questions trahies par 5 indices ou plus | id. | 38 (70,4 %) | **0** |
| rangs de la bonne réponse | `node tools/plan-rangs-qcm.js fortran` | 47 / 5 / 2 / 0 | **14 / 13 / 14 / 13** |
| point interne, guillemets, flèche | `plan-rangs-qcm fortran --marques` | 4 questions à mettre en forme | 0 |
| lexique (exploitables / retournées / à mettre en forme) | `node tools/mesure-lexique-qcm.js --liste=fortran` | 41 / 27 / 47 | **0 / 0 / 0** |
| lexique STRICTE / PROPORTION / INVERSE (couverture) | `mesure-lexique-qcm --seul=fortran` | 35,2 / 55,6 / 68,5 % | 0,0 / 0,0 / 0,0 % |
| mot fétiche | `node tools/mesure-mot-fetiche.js fortran` | 1 alerte (`compilateur`, 30,6 %) | 0 alerte |
| tics de lot | `node tools/mesure-tics-lot.js fortran --exemples` | 9 tics | **aucun** |
| tics par fenêtre de 4 leçons | `node tools/mesure-biais-qcm.js --lots --cours=fortran` | 91 alertes | aucune fenêtre |
| biais inverse | `node tools/mesure-biais-inverse.js --toutes fortran` | 4 alertes (rangs 2, 3, 4, la moins bavarde) | **0 alerte** (pire : le mot technique exclusif, 27,2 %) |
| intrus lexical (DÉFAUT / EXCÈS, questions sûres) | `node tools/mesure-mot-question.js fortran --liste` | 2 / 1 | **0 / 0** (25,0 % partout) |
| explications orphelines | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --travail --seul=fortran` | — | aucune (et une trouvée à la main, § 3) |

**Distracteurs : 156 réécrits sur 162, 6 gardés** (`p.masse` en `lecon-10` q1, que
l'explication commente, et cinq options du bilan déjà conformes : `0` et `-1` en q10, `echo`
et `cout` en q9, « Dans des variables globales » en q14). **Caractères** : 3 820 → 15 348 sur les 162
distracteurs (**11 528 écrits nets**) ; distracteur moyen 23,6 → 94,7 caractères, bonne réponse
moyenne 92,6.

## 2. La méthode, et ce qui l'a rendue sûre

- **Exécuter d'abord.** gfortran 16.2 par l'API de Compiler Explorer :
  `scratchpad/c9-fortran/gf.js` (un fichier, compile et exécute) et `gfm.js` (plusieurs fichiers
  en compilation SÉPARÉE, C compris, par le mode CMake). Plus de 80 programmes (et 3 projets à
  plusieurs fichiers), sources et sorties dans `scratchpad/c9-fortran/preuves/` (hors git).
- **Un banc d'écriture** (`sonde/atelier.js`) qui applique un lot EN MÉMOIRE et rend, question par
  question, le rang visé, la fenêtre 70-130 %, `w`/`k` (copie exacte de `mesure-lexique-qcm`),
  l'intrus lexical (copie de `mesure-mot-question`), les tics (copie des FORMES de
  `mesure-tics-lot`) et toutes les stratégies de marque CHARGÉES de `mesure-biais-qcm.js` ; puis
  le cours entier. Ses chiffres de cours ont été vérifiés égaux à ceux des outils au départ, après la vague et à
  la fin.
- **Calquer la charpente de la bonne réponse** (mots-outils, marques, mots de l'énoncé), ne changer
  que le contenu technique : c'est ce qui a fermé d'un coup marques, écho, attaque et tics.
- **Vague en 7 lots commités**, puis **dosage calculé** (`sonde/dosage.js`), puis `controle.js`
  (copié de `vue-sonde`, v2) contre HEAD pour vérifier que le dosage n'a bougé que les
  indicateurs visés : 17 questions, seuls densité, nombre de mots, rang et `w` (sur des questions
  à `k = 0`) ont bougé.

## 3. Fautes de fond trouvées et corrigées

**Bonnes réponses et explications : aucune prouvée fausse** (liste des preuves au § 4).

**Distracteurs devenus vrais ou discutables pendant la vague, repris à la relecture :**
- `lecon-02` q1 : « 2, car la division de deux entiers arrondit … par défaut » était VRAI pour
  5 / 2 (2,5 arrondi par défaut donne 2 ; la règle générale est fausse, `-5 / 2` rend `-2` et non
  `-3`) : remplacé par « 3, … division arrondie ».
- `lecon-14` q4 « Les données et les fichiers » et q14 « Dans des fichiers tout à part »
  (discutables : un module vit souvent dans un fichier à part) : remplacés.
- `lecon-11` q2 « (le triplet) », « (la tranche) » : parenthèses de remplissage, remplacées par
  une affirmation (« (une valeur paire) », « (la taille vaut 8) »).

**Explication orpheline créée par la vague et réparée** (`lecon-08` q2) : l'explication
commente `-g`, `-c` et `-Wall` ; la vague avait remplacé `-g` et `-c` par `-O0` et
`-march=native`. `mesure-explain-orpheline` ne l'a pas vue (options de deux caractères) : trouvée
en relisant, `-g` et `-c` sont revenus avec une thèse fausse (« entre -O2 et -O3 », « même effet
que -O2 ou -O3 »).

**Corps de leçon, quatre fautes corrigées, chacune prouvée sous gfortran 16.2 :**
1. `lecon-08` : `a = 1.0_dp + 1.0e-16_dp ; print *, a - b ! très petit, sensible aux arrondis` :
   le programme affiche `0.0000000000000000` (1e-16 est sous la moitié d'`epsilon(1.0_dp)` =
   2.22e-16, il est absorbé). Commentaire devenu « ! 0.0 : le 1.0e-16 a été absorbé par
   l'arrondi ».
2. `lecon-11` : le bloc « sections » déclarait `real :: m(3,3)` après des `print` : « Error: data
   declaration statement at (1) cannot appear after executable statements ». Déclaration
   remontée ; le bloc corrigé compile et affiche `2 3 4 5`, `1 3 5 7`, `8 7 … 1`.
3. `lecon-02` (« Pour aller plus loin ») : « ton code donnera les mêmes résultats sur n'importe
   quelle machine et compilateur ». La même somme en `real64` rend `2.59237584867298665E+00`
   sous `-O0` et `2.59237584867299509E+00` sous `-O3 -ffast-math`, même compilateur, même
   machine (`preuves/p40-meme.f90`). Devenu « ton code aura la même précision … (les derniers
   chiffres d'un résultat peuvent encore varier avec les options d'optimisation) ».
4. `lecon-09` (frise, texte alternatif, légende) : « chaque norme ajoute sans casser le code
   existant ». Fortran 2018 a retiré le IF arithmétique : `-std=f2018` le refuse (« Fortran 2018
   deleted feature: Arithmetic IF statement »), `-std=gnu` l'accepte avec un avertissement
   (`preuves/p41-if.f90`). Devenu « chaque norme ajoute et ne retire presque rien » ; la légende
   cite l'exemple, limité à gfortran (la contre-relecture a retiré un « les compilateurs » non
   exécuté).

Aucun encadré « Cas réel » touché : `node tools/verif-contenu.js` rend 1 551 conformes sur 1 551.

## 4. Ce qui a été exécuté, et ce qui ne l'a pas été

**Exécuté (gfortran 16.2, Compiler Explorer)** : toutes les bonnes réponses qui annoncent un
comportement — `5 / 2` → 2, `-5 / 2` → -2, `real(5) / 2` → 2.5, `precision()` 6 et 15, boucle
`do i = 10, 1, -1` (10 tours ; `do i = 10, 1` et `do i = 10, 1, 1` : 0 tour), `exit` qui ne quitte
que la boucle interne, `t(2:8:2)` → 2 4 6 8, `a(1:8:2)` → 1 3 5 7, `where`, `allocate`,
réallocation à l'affectation, `sum(x) / size(x)`, `intent(in)` (« Dummy argument 'x' with
INTENT(IN) in variable definition context »), procédure externe sans interface compilée À PART
(passe sans un mot et affiche `4.20389539E-45` ; dans UN fichier, gfortran 16 la voit quand
même), module compilé après le programme (« Cannot open module file »), `use … only`, `F8.3`
(`   3.142`, `********` si trop étroit), `iostat` (-1 en fin de fichier), `newunit` (-10), `%`,
`p.masse` / `p->masse` / `p::masse` / `p[masse]` / `p%masse()` refusés, `class` + `select type`,
`extends`, `polymorphic` inexistant, `value` (sans lui, le C reçoit l'adresse 4210776 au lieu de
42), ordre colonne lu par le C (1 2 3 4 5 6), OpenMP `reduction` (sans elle, 2 fils rendent
1000000 au lieu de 2000000), coarray sous `-fcoarray=single`, `do concurrent` ; chaque
distracteur de code (`integer: n`, `var n :: integer`, `n : integer`, `(5) // 2`, `nint(x) / 2`,
`real(5 / 2)`, `eof=`, `status=` dans un `read`, `eof(u)`, `return x`, appel sans `call`,
`allocatable(a(n))`, `deallocate(a(n))`, `dimension(a(n))`, `alloc(a(n))`, `use implicit`,
`implicit all`, `no implicit`, `do … next`, `print()`, `len(x)` sur des réels, `size` sans
argument) ; et les exemples du corps des leçons 01, 02, 04, 05, 06, 07, 08, 10, 11, 13, 14
(enveloppés dans un programme quand c'étaient des fragments), dont l'interopérabilité de
`lecon-13` avec un vrai fichier C.

**Non exécuté** :
- `-march=native` seul n'optimise pas (le niveau par défaut de gfortran reste `-O0`) : manuel de
  GCC, non chronométré.
- `fpm`, BLAS / LAPACK (`dgesv`), MPI : non installés ; affirmations de la documentation
  (fortran-lang.org, netlib), et les distracteurs qui en parlent n'annoncent aucun comportement
  d'exécution.
- Coarrays sur plusieurs images (`-fcoarray=lib` avec OpenCoarrays non disponible) : seule
  l'exécution à une image a tourné.
- Les sorties « à l'écran » des exemples qui lisent le clavier (`read(*, *)`).

## 5. Signalé, non touché (intouchable ou hors périmètre)

- `lecon-03` q3, **bonne réponse** : « l'égalité exacte échoue presque toujours ». Exagéré :
  `0.1 + 0.2 == 0.3` rend `T` en simple précision (`F` en double), et le corps de la leçon dit
  justement « peut être faux ». Discutable, pas prouvé faux : laissé.
- `lecon-07` q3, **explication** : « newunit=u demande au compilateur d'attribuer un numéro » :
  c'est la bibliothèque d'exécution qui le choisit, à l'exécution (la norme dit « processor »).
  Imprécision, laissée.
- `lecon-03`, encadré « Piège fréquent » : la tolérance `abs(a - b) < 1.0e-9` est plus fine que
  l'écart entre deux réels simple précision voisins (`epsilon(1.0)` vaut 1,19e-7) ; elle ne vaut que
  pour des `real(dp)`. Imprécision pédagogique, laissée.
- `lecon-12` : « C'est le seul modèle de parallélisme écrit dans le langage lui-même » —
  `do concurrent` est aussi dans le langage (mais ce n'est pas un « modèle »). Laissé.

## 6. Les leçons de ce cours

- **Calquer la charpente de la bonne réponse ferme presque tout d'un coup** : après la vague, les
  marques, l'écho, l'attaque, les tics et le lexique étaient à zéro ; seul le DOSAGE de la
  densité et du nombre de mots restait. Les bonnes réponses de ce cours sont faites de noms
  techniques longs : un distracteur écrit en français courant est presque toujours moins dense
  et plus bavard. 21 retouches calculées ont suffi (45,1 → 26,5 % et 36,7 → 26,7 %).
- **Fermer la densité a rouvert « écarter les deux extrêmes »** (monté à 28,2 % en simulation) :
  trois égalités de longueur entre deux distracteurs laissaient la bonne réponse SEULE au milieu.
  Cassées d'un caractère chacune avant de poser.
- **Le `k` en occurrences et le `w` égal sont le vrai coût du cours** : 47 questions sur 54 à
  mettre en forme au départ, beaucoup de bonnes réponses portant 3 à 9 mots absents de leur
  page. Le levier le plus sûr : reprendre les mots absents de la bonne réponse dans la charpente
  des distracteurs, puis compter au mot près (`sonde/k.js`, `sonde/voc.js`).
- **Un distracteur « vrai pour ce cas »** : sur une question qui demande une valeur ET sa raison,
  une raison fausse en général mais juste pour l'exemple (5 / 2 arrondi par défaut) rend le
  distracteur défendable. À relire comme un expert qui veut le démolir.
- **L'outil des explications orphelines ne voit pas les options courtes** (`-g`, `-c`) : seule
  la relecture a trouvé l'orpheline de `lecon-08` q2.

## 7. Ce qui reste, sans arrondir

- Pire stratégie à **27,3 %** (ECARTER la moins bavarde) ; puis la moins bavarde 26,7 %, la plus
  dense 26,5 % — dans la bande des derniers cours (25 à 27,5 %), pas à 25,0.
- « la TROISIÈME plus longue » rend 29,5 % de rendement sur 81,5 % de couverture (réussite
  25,6 %) ; rangs 14 / 13 / 14 / 13.
- `lecon-02` q1 : l'attaque « 3 » est unique (les trois autres options commencent par 2) ; une
  seule question, sous le seuil de mesure de l'inverse.
- Quatre questions à options d'un ou deux jetons (`lecon-10` q1, `lecon-14` q6, q9, q10) gardent
  des égalités de longueur ou de densité inévitables (`p%masse` / `p.masse`, `1` / `0` / `2`).
- Quelques distracteurs restent d'une langue un peu raide sous la contrainte `w`/`k` (`lecon-01`
  q2 « qui changent en réel au calcul un entier … », `lecon-02` q1 « la partie fractionnaire
  renvoie 1 ») : compréhensibles, à polir si une contre-relecture indépendante le demande.

## 8. Contrôles de fin

`verif-html` 0 problème ; 29 blocs JSON (quiz, bilan, exercices) valides ; 0 CR, 0 BOM dans
`pages/fortran/`, dans la consigne et dans ce rapport ; `verif-contenu` : 1 551 « Cas réel »
conformes ; `mesure-qcm-intouchable` : aucune atteinte.

`node tools/verif.js --rapide` (27 min 31 s, la machine étant partagée avec les autres agents) :
**51 étapes vertes, 4 signalées, toutes attendues** par la consigne :
- `donnees` : I18 seul en erreur, index périmés — `quiz-index.js` diverge de **+11 528 octets**
  (le même nombre que les caractères écrits nets dans les distracteurs) et `search-index.js` de
  +19 octets (non analysé ; le corps de quatre leçons a changé) ; avertissements anciens I17 (`zig`), I19, I25 ;
- `qcmbiai` : « le cours a PROGRESSE (longueur 87.0 % -> 25.9 %, pire indice 87.0 % -> 26.5 %)
  sans que le gain soit fige » (le cliquet compte 26,5 % pour le pire indice de ses
  stratégies surveillées ; la pire des 44 est ECARTER la moins bavarde, 27,3 %) ;
- `qcmlexi` : « 1 cours ont progresse SANS que le gain soit fige » ;
- `normatf` : 9 contrôles de la page de documentation qui citent des chiffres mesurés sur tout
  le site (taux de conformité S3, S4, ancienne clause) : ils changent parce que `fortran`
  devient conforme ; à régénérer à la fusion.

`doc-ref`, `doc-rec` et `etudes` sont verts dans cette copie.
