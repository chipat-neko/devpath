# Consigne d'écriture — les QCM du cours `fortran` (V18, case C9)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c9-fortran` (branche
`v18/c9-fortran`, partie de `8d163bf`). Un seul agent fait tous les rôles : écriture, dosage,
relecture, correction, contre-relecture. Mesures de départ archivées dans
`scratchpad/c9-fortran/depart/` (hors git : sorties brutes des outils, `questions.txt` = les 54
questions à plat). Sondes dans `scratchpad/c9-fortran/sonde/` : `controle.js` et `pose.js`
(copiés de `vue-sonde`, repointés sur `pages/fortran/`, `controle.js` à vide : **0 indicateur
déplacé sur 54 questions**), et trois outils neufs : **`atelier.js`** (banc d'écriture : un lot
de patchs appliqué EN MÉMOIRE ; pour chaque question, rang visé et fenêtre 70-130 %, `w`/`k`
copiés de `mesure-lexique-qcm`, mots de 9 lettres exclusifs, intrus lexical copié de
`mesure-mot-question`, tics de forme copiés de `mesure-tics-lot`, et toutes les stratégies de
marque CHARGÉES de `mesure-biais-qcm.js` ; puis la mesure du cours entier), `k.js` (mots de
6+ lettres absents de la page, comptés en occurrences comme l'outil) et `voc.js` (le
vocabulaire présent d'une page).

Le cours : Fortran moderne — bases et `implicit none` (`01`), types et précision (`02`),
contrôle (`03`), tableaux (`04`), procédures et `intent` (`05`), modules (`06`), entrées-sorties
et formats (`07`), performance et ordre colonne (`08`), Fortran moderne, fpm, BLAS/LAPACK
(`09`), types dérivés et objets (`10`), tableaux dynamiques et sections (`11`), parallélisme
(`12` : `do concurrent`, OpenMP, coarrays), interopérabilité C (`13`), projet (`14` : 3
questions + **12 de bilan**). **54 questions, 162 distracteurs.**

## ✅ CE QUI SE PROUVE SE PROUVE — gfortran S'EXÉCUTE ICI

**gfortran 16.2 par l'API de Compiler Explorer** (godbolt.org) : `scratchpad/c9-fortran/gf.js`
(un fichier : compile, exécute, écrit `<fichier>.out`) et `gfm.js` (plusieurs fichiers en
compilation SÉPARÉE, mode CMake, C compris). Options par défaut `-std=f2018 -Wall`. Preuves
dans `scratchpad/c9-fortran/preuves/` (sources et sorties rejouables).

**Les bonnes réponses vérifiées AVANT d'écrire** (aucune n'est fausse) : `5 / 2` → `2`,
`-5 / 2` → `-2` (troncature vers zéro), `real(5) / 2` → `2.5` ; `precision()` 6 et 15 ;
`t(2:8:2)` → `2 4 6 8`, `a(1:8:2)` → `1 3 5 7` ; `where (b > 0.0) b = 1.0` ne touche que les
cases strictement positives ; `lbound` vaut 1 par défaut ; `newunit` rend une unité NÉGATIVE
(`-10`), `iostat` vaut `-1` en fin de fichier ; `F8.3` écrit `   3.142`, `********` si trop
étroit ; écrire dans un argument `intent(in)` : « Dummy argument 'x' with INTENT(IN) in
variable definition context » ; programme placé avant son module dans le même fichier :
« Cannot open module file 'outils.mod' » ; procédure externe sans interface, compilée À PART :
`call afficher(3)` passe sans un mot et affiche `4.20389539E-45` (dans UN SEUL fichier,
gfortran 16 la voit quand même : c'est une extension, pas la norme) ; `p.masse` → « Syntax
error in PRINT statement », `p->masse` → « Syntax error in expression », `polymorphic` →
« Invalid character in name » ; `class(Particule)` + `select type` aiguille sur le type réel ;
`extends` hérite des composants (`q%Particule%masse`) ; sans `value`, une fonction C reçoit
l'ADRESSE (`4210776` au lieu de `42`) ; la matrice Fortran `reshape([1..6], [2,3])` est lue
`1 2 3 4 5 6` par le C (ordre colonne) ; OpenMP sans `reduction` sur 2 fils : `1000000` au
lieu de `2000000`, avec : `2000000` ; coarray `val[1]` sous `-fcoarray=single`.

**Erreurs classiques EXÉCUTÉES pour les distracteurs** (n'emploie que celles que TA leçon
établit, et cite le comportement exact) :

| croyance fausse | ce que gfortran 16.2 rend |
|---|---|
| `implicit none` interdit les mélanges entier-réel | `x = 5 / 2.0` compile et vaut `2.5` ; `n = 7.9` compile (avertissement `-Wconversion` sous `-Wall`) et vaut `7` |
| `real(5 / 2)` force une division réelle | `2.00000000` : la division entière a lieu AVANT la conversion |
| `nint(5.0) / 2` force une division réelle | `2` : `nint` rend un entier |
| `(5) // 2` divise | erreur « Operands of string concatenation operator … are INTEGER(4)/INTEGER(4) » |
| la division entière arrondit vers le bas | `-5 / 2` → `-2`, `floor(-5.0 / 2.0)` → `-3` : elle tronque vers zéro |
| `nint` arrondit à l'entier pair | `nint(2.5)` → `3`, `nint(-2.5)` → `-3` |
| `0.1 + 0.2 == 0.3` est faux | en simple précision : `T` ; en double : `F` (« peut être faux », pas « toujours ») |
| `==` entre réels ne compile pas | il compile (aucune erreur sous `-std=f2018 -Wall`) |
| `do i = 10, 1` descend | zéro tour : le pas vaut 1 par défaut |
| `real :: x = 1/3` vaut 0.333 | `0.00000000` |

## Pourquoi ce travail — mesure de départ (sur `8d163bf`)

`node tools/mesure-biais-qcm.js --seul=fortran` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **87,0 %** | 98,1 % | 88,7 % |
| la plus détaillée | **74,2 %** | 68,5 % | 97,3 % |
| RESTREINDRE à la parenthèse | **61,9 %** | 51,9 % | 96,4 % |
| le mot technique exclusif | **59,9 %** | 59,3 % | 81,3 % |
| l'incise entre parenthèses | **59,3 %** | 53,7 % | 89,7 % |
| ponctuation forte (seule / RESTREINDRE) | **54,2 % / 54,6 %** | 38,9 % | **100,0 %** |
| RESTREINDRE aux deux-points | **47,7 %** | 29,6 % | **100,0 %** |
| ECARTER la moins bavarde | 43,5 % | 16,7 % | 77,8 % |
| l'écho de la question | 40,7 % | 27,8 % | 73,3 % |
| l'attaque unique | 36,1 % | 37,0 % | 55,0 % |
| la plus dense | 33,8 % | 94,4 % | 35,3 % |
| ECARTER la plus courte | 33,0 % | — | — |
| la seule avec un point-virgule | 31,9 % | 9,3 % | **100,0 %** |

**38 questions sur 54 (70,4 %)** trahies par 5 indices ou plus. `plan-rangs-qcm fortran` :
rangs **47 / 5 / 2 / 0**, cible **14 / 14 / 13 / 13**, **9 338 caractères** à écrire sur 50
questions. Biais inverse (`mesure-biais-inverse --toutes fortran`) : **4 alertes** (rangs 2,
3, 4 à 0,0 % en directe, « la moins bavarde » 0,0 %). Point interne : 2 questions (bonne
réponse seule en deux phrases, `lecon-03` q3 et `lecon-05` q3). Flèche : 2 questions où un
distracteur SEUL porte `->` (`lecon-09` q3, `lecon-10` q1) — l'écarter rend 33 %.

### Les neuf tics de lot (`node tools/mesure-tics-lot.js fortran --exemples`)

| tic | bonnes / distr. | tranchées | gain au cours |
|---|---|---:|---:|
| **deux-points médian** | **18 / 4** | 16 | **47,2 %** |
| **glose finale entre parenthèses** | **11 / 5** | 14 | **38,9 %** |
| point-virgule médian | 5 / 0 | 5 | 31,9 % |
| adverbe de reprise (alors/ensuite/puis) | 4 / 0 | 4 | 30,6 % |
| verbe conjugué (est/sont/reste/garde/devient) | 10 / 22 | 12 | 30,6 % |
| quatre segments séparés par virgule | 4 / 0 | 4 | 30,6 % |
| connecteur causal (car/puisque/parce que) | 6 / 8 | 6 | 29,6 % |
| « le compilateur » | 4 / 3 | 7 | 29,2 % |
| « avec une » | 3 / 2 | 5 | 28,2 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse (glose) » ou
« réponse ; conséquence » : **les trois distracteurs prennent le MÊME gabarit** — mêmes
marques, même nombre de virgules, même glose finale — avec un contenu qui énonce une erreur.
Le plus sûr : **calquer la charpente de la bonne réponse** (ses mots-outils, ses marques, ses
mots de l'énoncé) et ne changer que le contenu technique.

### Mot fétiche (`node tools/mesure-mot-fetiche.js fortran`) : 1 alerte
`compilateur` (5 bonnes / 3 distracteurs, RESTREINDRE 30,6 %) ; à surveiller : `module` 5 / 1,
`fortran` 5 / 3. **Pose ces mots dans des distracteurs** là où ils ont un sens. `parce`
(5 / 19) est déjà un mot de distracteur : « Parce que » seulement quand la bonne réponse
commence ainsi.

### Lexique (`node tools/mesure-lexique-qcm.js --liste=fortran`)
**41 exploitables, 27 retournées, 47 à mettre en forme sur 54.** Règle du `k` (OCCURRENCES de
mots de 6 lettres et plus ABSENTS du corps de la page, balises comprises) : les quatre options
en portent le même nombre ; si `k > 0`, elles portent aussi le même nombre `w` de mots de 6+
lettres. L'apostrophe colle (`d'arrondi`, `l'arrête` sont UN jeton). Le levier : un mot de
moins de 6 lettres ne compte ni dans `w` ni dans `k` ; reprendre un mot étranger de la bonne
réponse dans un distracteur égalise `k` sans rien inventer.

### Intrus lexical (`mesure-mot-question fortran`) : 2 questions sûres en DÉFAUT, 1 en EXCÈS
Par mot de 5 lettres et plus (l'apostrophe COUPE ici : `d'arrondi` → `arrondi`) : porté par 1,
2 ou 4 options, **jamais 3**. Et chaque option, la bonne comprise, garde au moins un mot à elle
— sinon la lecture EXCÈS désigne les trois distracteurs et l'écarter rend 100 %.

## La règle qui prime sur toutes les mesures

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

1. L'erreur se nomme en une phrase, et le comportement vrai a été EXÉCUTÉ (table ci-dessus) ou
   lu dans la leçon. 2. Chaque proposition a un référent. 3. Un débutant crédule pourrait la
   cocher. 4. Aucune parenthèse ni queue de phrase de remplissage. 5. Aucun comportement de
   Fortran annoncé sans exécution.

⚠️ **Le piège propre à ce cours : Fortran est permissif et historique.** `integer n` (sans
`::`) est VALIDE, `.eq.` est le même opérateur que `==`, `Integer` vaut `integer`, `include`
existe, les crochets servent aux coarrays, `real :: a(8) = [1,2,…]` convertit tout seul. Un
distracteur « Fortran interdit X » est souvent VRAI pour une autre forme de X : vérifie chaque
fois. Et la norme compte : `newunit` (2008), `do concurrent` (2008), réallocation à
l'affectation (2003), coarrays (2008), `iso_c_binding` (2003) — ne t'appuie jamais sur une
différence de version.

## Ce que chaque question doit tenir (`atelier.js --court` le vérifie)

1. **Rang** de la bonne réponse = la cible de `sonde/cibles.json` (14 / 14 / 13 / 13 sur le
   cours, ajustable question par question si le total reste juste) ; distracteurs dans
   70-130 % de sa longueur, sans ex æquo avec elle.
2. **Marques — les quatre ou aucune** : `;`, `:` (⚠️ `::` du code en est), parenthèse (⚠️
   `real(5)` en est une pour « RESTREINDRE à la parenthèse »), incise de 4+ caractères (même
   NOMBRE), glose finale, tiret (` - ` du code `a - b` en est un), barre oblique (`5 / 2`,
   `public/private`), flèche (`->`), point interne, absolus (`toujours`, `uniquement`, `rien`…),
   prudents (`peut`, `plutôt`, `selon`…), négation (`ne`, `pas`, `non`…).
3. **Même nombre de `, : ;`** que la bonne réponse (« la plus détaillée » 74,2 %).
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre.
5. **Attaque et casse initiale** : jamais trois pareilles et une différente.
6. **Tics de forme** : 0, 2 ou 4 porteurs (verbe `est/sont/reste`, démonstratif, causal…).
7. **Mots de 9+ lettres** : reprendre ceux de la bonne réponse, ne pas laisser un seul
   distracteur riche en mots exclusifs.

## L'ordre de travail

1. Lire la leçon entière (le corps fixe le vocabulaire et ce qui est vrai).
2. Écrire les trois erreurs en une phrase chacune, les EXÉCUTER si elles portent sur Fortran.
3. Rédiger au gabarit de la bonne réponse, passer `atelier.js --court`, corriger.
4. Poser par `pose.js --ecrire`, `verif-html`, COMMITER le lot. Puis dosage calculé,
   relecture par contradiction (QCM ET corps), contre-relecture, mesure finale.
