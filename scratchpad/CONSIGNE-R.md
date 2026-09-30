# Consigne d'écriture — les QCM du cours `r` (B4, 58ᵉ cours)

Préparée le 2026-09-30, à la clôture du 57ᵉ cours (`docker`). Mesures de départ archivées dans
`scratchpad/r-depart/` (sorties brutes des outils, et `classiques.R` / `classiques.out` : la table
des erreurs classiques EXÉCUTÉE). Sondes prêtes dans `scratchpad/r-sonde/` (`controle.js` v2,
`simule.js`, `essai.js`, `essai2.js`, `essai3.js`, `pose.js`, `rempl.js`, `k.js`, `dosage.js`,
`chaque.js`), copiées de `docker-sonde` et pointées sur `pages/r/` (`controle.js` à vide :
**0 indicateur déplacé sur 63 questions**).

Tu écris les **distracteurs** d'un lot de questions du cours `r` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).
Le cours s'intitule « R » : prendre en main R (console, script, paquets), vecteurs, types et
indexation, conditions, boucles et vectorisation, listes et data frames, transformer avec dplyr,
importer, nettoyer et remodeler (readr, tidyr), visualiser avec ggplot2, statistiques descriptives,
inférence (tests et intervalles), la régression (`lm`), programmer proprement, rapports
reproductibles (Quarto), chaînes et expressions régulières (stringr), facteurs et dates (forcats,
lubridate), jointures dplyr, programmation fonctionnelle (purrr), puis un projet de bout en bout
(`lecon-17`, **15 questions dont 12 de bilan**).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-écris un patch.

Les QCM sont dans `pages/r/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-17`). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

⚠️ **`pages/r/lecon-06.html` porte un MOJIBAKE VOLONTAIRE** (`Ã©`, `FÃ©vrier` : la leçon enseigne
l'encodage). **N'y touche pas, ne le « répare » pas**, et n'ouvre jamais ce fichier avec un outil
qui le réencoderait. `pose.js` ne modifie que le bloc du QCM.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Écris tes patchs dans `scratchpad/r-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/r-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js`
refuse de toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un
fichier qui contient un antislash : l'outil Bash en mange un niveau. Écris tes scripts avec Write.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Du 53ᵉ au 57ᵉ cours, après des vagues où toutes les mesures étaient vertes, la relecture a encore
trouvé des distracteurs inintelligibles, des fautes de français et **des distracteurs VRAIS** —
des queues de phrase ajoutées pour tenir un compte de caractères, des parenthèses qui n'énoncent
rien.

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette forme » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).
6. **Aucun distracteur qui annonce un comportement sans le prouver faux** : si un distracteur dit
   « `x[0]` renvoie le premier élément » ou « `mean()` ignore les `NA` », le comportement vrai a été
   **exécuté** (voir plus bas), pas supposé.

⚠️ **Le piège propre à ce cours : R a TROIS façons de tout faire, et presque tout a un argument.**
« `mean()` renvoie toujours `NA` s'il y a un manquant » est faux avec `na.rm = TRUE` ; « un facteur
est trié par ordre alphabétique » est faux après `fct_relevel()` ; « `left_join()` garde autant de
lignes que la table de gauche » est faux dès qu'une clé est dupliquée à droite (exécuté : 2 lignes à
gauche, **3** en sortie). Et **R de base et le tidyverse ne se comportent pas pareil** :
`df[, 1]` sur un `data.frame` rend un vecteur, sur un `tibble` un tibble ; `sapply()` change de type
de retour selon l'entrée, `map_dbl()` non. Un distracteur qui absolutise un comportement peut être
**vrai dans l'autre dialecte, ou avec un argument que la leçon cite ailleurs** : vérifie que ta
thèse est fausse **dans le contexte exact de la question**, contre la page ET par exécution.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, R S'EXÉCUTE

R n'est **pas installé** sur la machine, mais il **tourne** : `scratchpad/webr/` porte **webR**
(R **4.6.0** compilé en WebAssembly, paquet npm, hors git) et les paquets du cours compilés pour
lui — **dplyr 1.2.1, tidyr, stringr, purrr, forcats, lubridate 1.9.5, readr, tibble, ggplot2 4.0.3,
broom**. Aucun réseau n'est nécessaire, une exécution prend environ 3 secondes.

```
node scratchpad/webr/r.js <fichier.R>           # comme Rscript : chaque expression est affichée
node scratchpad/webr/r.js --echo <fichier.R>    # affiche aussi chaque commande (> ...)
```

- Écris le fichier `.R` avec l'outil **Write** dans ton dossier (`scratchpad/r-<ton lot>/`), jamais
  par heredoc (les `"\\."` des expressions régulières y perdent un antislash).
- **Une erreur ARRÊTE le script** (comme `Rscript`) : pour relever un message d'erreur et continuer,
  entoure la ligne de `try( ... )`.
- `suppressPackageStartupMessages(library(dplyr))` évite le bruit de chargement.
- **ggplot2** : rien ne s'affiche, mais `ggplot_build(p)` construit le graphique et
  `layer_data(p)` rend les données calculées (compte d'un `geom_bar`, classes d'un histogramme…).
- **Ce qui ne s'exécute pas ici** : Quarto / R Markdown (`lecon-12`), RStudio, `install.packages()`
  depuis le CRAN, `renv`, la lecture de fichiers Excel. Pour ceux-là, cite la documentation
  officielle (r-project.org, tidyverse.org, quarto.org). Si la page affirme autre chose que la
  source ou que l'exécution, **tu le remontes**, tu ne tranches pas de mémoire.
- **Arithmétique et statistiques** (moyenne, écart-type, quantile, p-valeur, coefficient) :
  **toujours par R**, jamais de tête.

**Erreurs classiques de débutant** (n'utilise que celles que TA leçon établit). Toutes les lignes
ont été **exécutées** à la préparation (`scratchpad/r-depart/classiques.out`, R 4.6.0) :

| croyance fausse | ce que R rend |
|---|---|
| `x[-1]` renvoie le dernier élément (comme en Python) | il **retire** le premier : `c(10,20,30,40)[-1]` → `20 30 40` |
| `x[0]` renvoie le premier élément ; `x[5]` hors bornes est une erreur | `x[0]` → `numeric(0)` ; `x[5]` → **`NA`**, sans erreur |
| un vecteur peut mêler nombres et texte | tout est converti : `c(1, "a", TRUE)` → `"1" "a" "TRUE"` ; `class(c(1, TRUE))` → `"numeric"` |
| additionner deux vecteurs de longueurs différentes est une erreur | **recyclage** : `1:3 + 1:6` → `2 4 6 5 7 9` sans rien dire ; `1:3 + 1:2` → `2 4 4` avec un **avertissement**, pas une erreur |
| `mean()` ignore les valeurs manquantes | `mean(c(1, NA, 3))` → **`NA`** ; avec `na.rm = TRUE` → `2` |
| `NA == NA` vaut `TRUE` ; `filter(v == NA)` garde les manquants | `NA == NA` → **`NA`** ; `filter(v == NA)` rend **0 ligne** ; il faut `is.na(v)` |
| `filter(v > 1)` garde les lignes où `v` est manquant | non : `c(1, NA, 3)` filtré par `v > 1` rend **1 ligne** (le 3) |
| `as.numeric()` d'un facteur rend les nombres écrits | il rend les **codes** : `factor(c("10","20","10"))` → `1 2 1` ; il faut `as.numeric(as.character(f))` |
| les niveaux d'un facteur suivent l'ordre d'apparition | ordre **alphabétique** : `"bas" "haut" "moyen"` ; `fct_relevel()` les réordonne ; `fct_infreq()` trie par fréquence décroissante |
| `l["a"]` et `l[["a"]]` rendent la même chose | `class(l["a"])` → `"list"` ; `class(l[["a"]])` → `"numeric"` |
| `df[1]` rend la première colonne sous forme de vecteur | `class(df[1])` → `"data.frame"` ; `class(df[, 1])` et `class(df[["a"]])` → `"integer"` |
| `for (i in 1:length(x))` ne tourne pas si `x` est vide | `1:0` vaut `1 0` : la boucle tourne **deux fois** ; `seq_len(0)` ne tourne pas |
| `if` accepte un vecteur de conditions ; `&&` est vectorisé | `if (c(TRUE, FALSE))` → **erreur** « the condition has length > 1 » ; `c(TRUE,FALSE) && TRUE` → **erreur** ; `ifelse()` et `&` sont vectorisés |
| `0.1 + 0.2 == 0.3` vaut `TRUE` | **`FALSE`** ; `isTRUE(all.equal(0.1 + 0.2, 0.3))` → `TRUE` |
| `summarise()` ignore les `NA` par groupe | `mean(v)` d'un groupe `1, NA` → **`NA`** ; `n()` compte les lignes, manquants compris (2) |
| `left_join()` rend toujours autant de lignes que la table de gauche | clé dupliquée à droite : 2 lignes à gauche → **3** ; `inner_join` → 2 ; `anti_join` → 1 (la clé sans correspondance) |
| dans une expression régulière, `.` désigne un point | `str_detect(c("a.b","axb"), ".")` → `TRUE TRUE` ; avec `"\\."` ou `fixed(".")` → `TRUE FALSE` |
| `str_replace()` remplace toutes les occurrences | la **première** : `"a-b-c"` → `"a+b-c"` ; `str_replace_all()` → `"a+b+c"` |
| `ymd("2024-01-31") + months(1)` donne le 29 février | **`NA`** (le 31 février n'existe pas) ; `%m+% months(1)` → `"2024-02-29"` |
| `map()` rend un vecteur | une **liste** ; `map_dbl(1:3, ~ .x^2)` → `1 4 9` ; `map_chr()` sur un nombre → **erreur** « Can't coerce from a number to a string » |
| `sapply()` rend toujours un vecteur | `sapply(list(), length)` → **`list()`** ; `vapply(list(), length, integer(1))` → `integer(0)` |
| la moyenne résiste aux valeurs extrêmes | `c(1, 2, 3, 100)` : moyenne **26,5**, médiane **2,5** |
| `sd()` divise par n | par **n − 1** : `var(c(2,4,4,4,5,5,7,9))` → `4.571429` (et non 4), `sd` → `2.13809` |
| une fonction modifie la variable qu'on lui passe | copie : `f <- function(x) { x <- x + 1; x }` ; `y <- 1; f(y)` → `2`, et `y` vaut encore **`1`** |
| une corrélation proche de 1 prouve une relation linéaire | `cor(1:10, (1:10)^2)` → **0,9746** pour une relation quadratique |
| `lm(mpg ~ wt, mtcars)` : le coefficient est la corrélation | ordonnée **37,285**, pente **−5,344** (mpg par unité de `wt`), R² **0,753** |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **85,7 %** des QCM de `r` en cochant l'option la plus
longue. Relevé du 2026-09-30, `node tools/mesure-biais-qcm.js --seul=r` (63 questions, dont 12 de
bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **85,7 %** | 96,8 % | 88,5 % |
| la plus détaillée | **76,9 %** | 69,8 % | 97,7 % |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | **72,2 % / 72,4 %** | 65,1 % | 97,6 % |
| le mot technique exclusif | **65,2 %** | 61,9 % | 87,2 % |
| l'écho de la question | **64,4 %** | 55,6 % | 91,4 % |
| l'incise entre parenthèses | **53,2 %** | 38,1 % | 95,8 % |
| la seule avec un point-virgule (et RESTREINDRE) | **51,2 %** | 34,9 % | **100,0 %** |
| RESTREINDRE à la parenthèse | 51,3 % | 34,9 % | 95,5 % |
| RESTREINDRE aux deux-points | 49,2 % | 36,5 % | 91,3 % |
| ÉCARTER la moins bavarde | 38,4 % | 4,8 % | 66,7 % |
| la seule en deux phrases (point interne) | 35,7 % | 14,3 % | **100,0 %** |
| la plus prudente | 34,1 % | 14,3 % | 88,9 % |
| la MAJUSCULE d'emphase | 32,9 % | 12,7 % | 87,5 % |
| la seule qui nie | 31,9 % | 25,4 % | 37,5 % |

**73,0 %** des questions (46 sur 63) sont trahies par **5 indices ou plus** sur 44.

## Le travail est de l'ALLONGEMENT — le plus lourd du chantier

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **113,3 caractères** |
| longueur moyenne d'un distracteur | **25,6 caractères** |
| **rapport** | **4,42** (`docker` : 3,13 ; `observabilite` : 3,60 ; `lisp` : 4,19) |

`node tools/plan-rangs-qcm.js r` demande **13 983 caractères** sur **60 questions sur 63**.
Rangs actuels **54 / 4 / 4 / 1**, cible **16 / 16 / 16 / 15**. **Suis EXACTEMENT** le rang visé et la
bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la bonne
réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

⚠️ Les distracteurs actuels sont presque tous des **renvois creux** (« Ils sont identiques »,
« C'est l'inverse », « Les deux installent », « Rien ») : aucun débutant ne les coche, et ils ne
disent rien. Un distracteur de 200 caractères se construit avec un **mécanisme faux complet** —
ce que l'apprenant croit que R fait, puis la conséquence qu'il en tire. Les contresens réels sont
dans la table ci-dessus et dans les encadrés « Attention » / « Erreur fréquente » de ta leçon.

⚠️ **Le bilan de `lecon-17` a des bonnes réponses de 1 à 11 caractères** (`2`, `NA`, un nom de
fonction) : là, le plan demande de **RESSERRER** ou de tenir une bande de quelques caractères.
Pour une valeur attendue, les distracteurs sont **les valeurs que donnent les erreurs classiques**
(le code du facteur au lieu du nombre, le résultat sans recyclage, la longueur d'une liste au lieu
de celle du vecteur) — **chacune exécutée**.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes r` rend **4 alertes** au départ (la moins bavarde
29,6 % en global, la QUATRIÈME plus longue 31,9 %, la TROISIÈME 31,1 %, la DEUXIÈME 31,1 %).
**Le rang en MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.** Quand la bonne réponse
est la plus courte, qu'**un** de ses distracteurs ait autant de mots qu'elle (égalité) plutôt que
tous davantage — et vise qu'un distracteur en ait **un de moins** quand la bonne est au rang 3.

### (2) LA PONCTUATION — et L'UNION (72,4 %, rendement 97,6 %)
Par marque (`;`, `:`, parenthèse, tiret, barre oblique, guillemets « », flèche `→`, virgule
décimale), **les quatre options la portent, ou aucune** ; vérifie aussi l'UNION (« PONCTUATION
FORTE » = `:` ou `;` ou tiret). ⚠️ **Dans ce cours, le CODE porte de la ponctuation** : `1:3`,
`dplyr::filter` et `x[1:2]` comptent comme deux-points pour l'outil, `mean(x)` comme parenthèse,
`na.rm = TRUE` comme majuscule d'emphase, `%>%` et `|>` comme signes, `"a"` comme guillemets,
`left_join` / `lecon-05` comme tiret ou soulignement, `3.14` comme point. Compte-les.

### (3) LES DOUZE TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js r --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **point-virgule médian** | **24 / 5** | 23 | **95,7 %** | **50,8 %** |
| **deux-points médian** | **21 / 1** | 22 | **95,5 %** | **49,6 %** |
| **quatre segments séparés par des virgules** | **8 / 0** | 8 | **100,0 %** | 34,5 % |
| **parenthèse ouverte par un article** | **6 / 0** | 6 | **100,0 %** | 32,1 % |
| « un vecteur » | 6 / 3 | 7 | 71,4 % | 30,2 % |
| virgule avant « et » | 4 / 0 | 4 | 100,0 % | 29,8 % |
| « vecteur de » / « un vecteur de » | 4 / 0 | 4 | 100,0 % | 29,8 % |
| « toutes les » | 4 / 0 | 4 | 100,0 % | 29,8 % |
| glose finale entre parenthèses | 6 / 9 | 7 | 57,1 % | 28,6 % |
| « le type » ; « à la » | 3 / 1 | 4 | 75,0 % | 28,2 % |

Le gabarit des bonnes réponses est « réponse ; conséquence », « réponse : explication », une
énumération à virgules, ou « réponse (un exemple) » : donne-le à tes distracteurs, avec un contenu
qui dit quelque chose. ⚠️ **« Parce que » est un tic de DISTRACTEUR** (`parce` : 7 bonnes contre
15 distracteurs) : quand la bonne réponse d'un « Pourquoi… ? » n'en porte pas, **retire-le** des
distracteurs plutôt que de le garder — ou mets-le dans deux options.

### (4) ⚠️ LES MOTS FÉTICHES — 2 ALERTES DÈS LE DÉPART
`node tools/mesure-mot-fetiche.js r` : `vecteur` (9 bonnes / 3 distracteurs, RESTREINDRE
**33,7 %**), `lignes` (6 / 6, **28,6 %**) ; et, sous le seuil du nombre de questions mais à
**7 bonnes pour 0 distracteur**, `valeur` et `variable` (33,3 %), puis `élément` (6 / 1), `toutes`
(5 / 1), `renvoie` (6 / 3), `gauche` (5 / 2), `colonnes` (6 / 4). **Pose ces mots dans des
distracteurs**, là où ils ont un sens — ce sont les mots du sujet. ⚠️ Pour ce cours, « valeur » et
« variable » sont donc À EMPLOYER dans les distracteurs (la mise en garde des cours précédents
contre « valeur » ne vaut pas ici : le mot manque aux distracteurs). **N'emploie pas « chaque » ni
« chaîne »** pour allonger. **« inverse »** (1 / 7), **« toujours »** (3 / 6) et **« replace »**
(2 / 6) sont déjà des mots de DISTRACTEUR : ne les multiplie pas.

### (5) LE MOT TECHNIQUE EXCLUSIF (65,2 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune.
`node tools/mesure-mot-question.js r --plan` donne la liste exacte, question par question
(**199 mots à traiter sur 29 questions qui tranchent**).

### (6) L'ÉCHO DE L'ÉNONCÉ (64,4 %, rendement 91,4 %) — très fort dans ce cours
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les noms de fonctions
passent sous le radar : `mean`, `filter`, `mutate`, `map`, `lm`, `NA`, `c()`, `aes`, `join` —
compte-les. L'« écho de FRAGMENT d'identifiant » existe aussi (`left_join` ↔ `join`).

### (7) L'INDICE LEXICAL — 52 exploitables, 27 retournées, 54 à mettre en forme sur 63
`node tools/mesure-lexique-qcm.js --liste=r`. **Règle du `k`** : les QUATRE options portent le
même nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en OCCURRENCES** : un
mot étranger répété compte deux fois. **Règle du `w`** : quand `k > 0`, les quatre portent aussi le
même nombre de mots de 6+ lettres. Un substitut doit être **présent dans la page** (jeton entier ;
l'apostrophe et le tiret séparent les mots). Cible : 0 / 0 / 0. ⚠️ Des bonnes réponses portent
jusqu'à **k = 10 et w = 17** (`lecon-01` q1) : c'est long à égaler, fais-le mot par mot avec
`node scratchpad/r-sonde/k.js`.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE (35,7 %, rendement 100 %) — les quatre options ont le MÊME nombre de phrases
Le point suivi d'une espace puis d'une majuscule est la signature ; « etc. », « ex. », le point
d'un nom R (`na.rm`, `read.csv`, `t.test`, `is.na`) et celui d'un nombre (`0.05`) ne comptent pas.
Si la bonne réponse conclut par une seconde phrase, **les trois distracteurs concluent aussi**, par
une règle FAUSSE mais plausible.

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js r <sha>`. Si une bonne réponse te paraît FAUSSE (R la
   dément), **ne la corrige pas** : remonte-la dans ton compte rendu, avec le script et sa sortie.
2. **Aucun distracteur ne doit devenir vrai** — et ici, un argument (`na.rm`, `.keep`, `by`) ou
   l'autre dialecte (base contre tidyverse) suffit à rendre vrai un « jamais ».
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`.
4. **Aucune URL externe** dans le contenu.
5. **Le mojibake de `lecon-06` reste tel quel.**

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js r` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger,
   et **exécute sous R** chaque comportement ou valeur que tu annonces.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Pose, puis relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js r
node tools/mesure-mot-question.js r --plan
node tools/mesure-biais-qcm.js --seul=r
node tools/mesure-biais-inverse.js --toutes r
node tools/mesure-lexique-qcm.js --liste=r
node tools/mesure-mot-fetiche.js r
node tools/mesure-tics-lot.js r --exemples
node scratchpad/r-sonde/essai.js "<fragment unique de l'énoncé>"
node scratchpad/webr/r.js --echo scratchpad/r-<ton lot>/<essai>.R
```

## CE QUE TU RENDS
Un compte rendu bref : nombre de distracteurs réécrits, nombre d'exécutions R citées, les chiffres
de tes contrôles sur ton lot, et la **liste des défauts que tu as VUS sans y toucher** (corps de
leçon dont un exemple ne rend pas ce que la page annonce, bonne réponse douteuse, `explain` qui
cite un ancien distracteur, exercice dont la réponse attendue est fausse) — chacun avec le fichier,
le passage exact, et la sortie R qui le prouve. Écris cette liste aussi dans
`scratchpad/r-<ton lot>/defauts.json` : `[{"fichier","zone","passage","constat","preuve"}]`.

---

## CE QUE LES 53ᵉ À 57ᵉ COURS ONT APPRIS À L'ORCHESTRATEUR

- **La relecture par contradiction doit lire les CORPS et les EXÉCUTER** : 51 fautes de corps sur
  92 pour `dart`, 99 sur 179 pour `perf-web`, 56 sur 113 pour `lisp`, 59 sur 126 pour `docker`
  (« ses exemples ne tournent pas »). Pour `r` : passer **chaque bloc de code** de la page à
  `r.js`, comparer **chaque sortie affichée** (`[1] …`, tibbles, `summary()`) à la sortie réelle,
  et refaire **chaque statistique** annoncée.
- **La CONTRE-RELECTURE des corrections** : 18,2 %, 25,0 %, 29,0 %, **23,8 %** des corrections
  fautives — une sur quatre. Dire aux correcteurs de recalculer **tout chiffre dérivé** du chiffre
  corrigé, de relire le schéma et la légende voisins, et de rejouer `normExo` sur TOUS les exercices
  du cours après avoir élargi un `accept` (modèle : `scratchpad/docker-contre/exos.js`).
- **Un absolu déplacé n'est pas un absolu retiré** : pour tenir une mesure, réordonner les MÊMES
  mots de façon que l'absolu porte sur une chose vraie.
- **Relancer `mesure-mot-fetiche` APRÈS la relecture** : ses réécritures fabriquent un mot fétiche
  que `controle.js` (stratégies par question) ne voit pas.
- **Une correction de CORPS change le vocabulaire de la page** et peut rouvrir `k` : relancer
  `controle.js --ref=<sha de la vague>` après toute correction de corps.
- **`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges`** :
  sans `--only`, `antiseches` et `pieges` restent périmés.
- **Dosage calculé** (`dosage.js`) : combien de points retirer, puis quelles questions rapportent le
  plus. Raccourcir un distracteur en ôtant des mots courts le rend PLUS DENSE : remplacer, pas ôter.
- **Un réveil qui termine son tour pendant un Workflow le tue** : attendre dans le même tour.
- Clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` à la main ;
  `verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, `tools/etudes/inconnu/assembler.js` et
  `tools/etudes/recherche/assembler.js`, puis index, jusqu'au point fixe (vérifié par empreinte).
