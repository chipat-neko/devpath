# Consigne d'écriture — les QCM du cours `sass` (B4, 44ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `sass` (préprocesseur et
compilation, variables et types, imbrication et sélecteur parent, partials `@use`/`@forward`,
mixins et `@include`, fonctions/opérations/couleurs, conditions et boucles, architecture 7-1 et BEM,
design system et maps, modules natifs, media queries, maps avancées, migration `@import` →
`@use`, projet de synthèse).

La question (`q`), l'index `correct`, l'explication (`explain`) et **le texte de la bonne réponse**
sont **INTOUCHABLES** : `node tools/mesure-qcm-intouchable.js sass <ref-git>` le contrôle et
signalera toute atteinte. **Tu ne touches qu'aux trois options fausses.**

**61 questions sur 14 leçons, 183 distracteurs** — dont **12 questions en QCM bilan** dans
`lecon-14.html`, qui porte donc **16 questions** (4 de leçon + 12 de bilan). Les leçons 08 à 13
portent **4** questions, les leçons 01 à 07 en portent **3**.

---

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **96,7 %** des QCM de `sass` en cochant l'option
la plus longue — **couverture 98,4 %, rendement 98,3 %**. C'est le troisième taux le plus haut des
90 cours du site. Ce n'est pas le seul indice :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **96,7 %** | **98,4 %** | **98,3 %** |
| la plus détaillée | **78,7 %** | 70,5 % | **97,7 %** |
| l'incise entre parenthèses | **69,3 %** | 59,0 % | **100 %** |
| RESTREINDRE à la parenthèse | **69,3 %** | 59,0 % | **100 %** |
| le mot technique exclusif | **65,2 %** | 63,9 % | 82,1 % |
| RESTREINDRE à la ponctuation forte | **62,0 %** | 47,5 % | **100 %** |
| la seule avec une PONCTUATION FORTE | **60,7 %** | 47,5 % | **100 %** |
| la seule avec un point-virgule | **44,7 %** | 26,2 % | **100 %** |
| RESTREINDRE aux deux-points | **44,0 %** | 26,2 % | 93,8 % |
| ECARTER la moins bavarde | **43,2 %** | 11,5 % | 85,7 % |
| l'écho de la question | **42,6 %** | 44,3 % | 55,6 % |
| RESTREINDRE à la barre oblique | **32,0 %** | 8,2 % | **100 %** |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## ⚠️ CE QUI REND CE COURS-CI PARTICULIER — à lire avant la liste des indices

### (a) **AUCUN COMPILATEUR SASS** — mesuré, pas supposé

`sass`, `node-sass`, `dart-sass` : aucun n'est dans le `PATH` (vérifié le 2026-09-22), et le projet
n'installe **aucune dépendance**. La règle fondatrice du chantier — « ne jamais affirmer un
comportement de tête, le faire tourner » — **n'est pas applicable ici par exécution**, comme aux
39ᵉ (`scala`), 42ᵉ (`haskell`) et 43ᵉ (`clojure`) cours. Ce que cela impose :

> **LA SOURCE DE VÉRITÉ EST LE CORPS DE LA LEÇON, PAS TA MÉMOIRE.**
> Avant d'écrire un distracteur, **lis la page** et ancre-le sur ce que la leçon affirme. Si tu
> veux dire qu'une option est fausse, tu dois pouvoir **citer la phrase ou le bloc de code de la
> page** qui l'établit.

**Ne fabrique pas de distracteur qui repose sur un détail que la page ne tranche pas** (le nom exact
d'une fonction de `sass:color` non citée, une sortie CSS non publiée, un message d'erreur du
compilateur). Préfère les erreurs **structurelles**, celles qu'un débutant commet vraiment et que la
leçon corrige explicitement. Si tu trouves dans la page une affirmation que tu crois fausse,
**remonte-la à l'orchestrateur avec la citation** — ne la recopie pas dans un distracteur.

### (b) Le travail est de l'**ALLONGEMENT**, et le rapport est l'un des plus durs du chantier

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **103,2 caractères** (max 168, min 12) |
| longueur moyenne d'un distracteur | **31,0 caractères** (max 79, min **4**) |
| rapport | **3,33** |
| rapport du 43ᵉ cours (`clojure`) | 3,02 |
| rapport du 42ᵉ (`haskell`) | 5,06 |
| médiane du même rapport sur les **43 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js sass` demande **10 916 caractères** répartis sur **58 questions sur
61**. Options hors de la bande 70-130 % : **179 sur 183**. Fourchette actuelle **0,08 à 1,44** :
quelques distracteurs sont **plus longs** que leur bonne réponse — pour ceux-là il faut
**RACCOURCIR**, pas allonger. Lis la colonne de `plan-rangs-qcm`, elle dit `ALLONGER` ou
`RACCOURCIR` option par option.

### (c) LA FORME DU DÉFAUT EST UNIFORME, ET C'EST UNE CHANCE

Comme aux cours précédents, la bonne réponse est **« la réponse + sa justification »** et les
distracteurs sont des **télégrammes nus** (« Les variables », « @extend », « Pour importer un
fichier »). **LE REMÈDE EST TOUJOURS LE MÊME : donne au distracteur la MÊME STRUCTURE que la bonne
réponse — la réponse fausse, PUIS sa justification fausse mais cohérente.** Pas du remplissage :
une justification qu'un apprenant qui s'est trompé donnerait vraiment.

---

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.**

Au 39ᵉ cours (`scala`), la relecture adversariale a rendu **54 prises, dont 30 de ce seul type** :
pour atteindre la fenêtre de longueur, les écrivains avaient remélangé le vocabulaire de la bonne
réponse jusqu'au bon compte de caractères, et le résultat ne voulait **rien dire**. Le biais de
longueur avait été fermé et remplacé par un **biais de cohérence sémantique, qui se mesure
exactement au même endroit. Aucun des 45 outils ne le voit.**

**Relis chaque distracteur à voix haute.** Un bon distracteur est **une erreur que quelqu'un
pourrait vraiment commettre**. En Sass elles sont nombreuses, connues, et faciles à rendre
plausibles sur 70 à 160 caractères :

- croire que le navigateur lit le `.scss` directement, ou qu'un `<link>` peut pointer sur un partial ;
- croire qu'une variable Sass est une variable CSS (`--x`) : croire qu'elle vit à l'exécution, qu'on
  peut la changer depuis JavaScript, ou qu'un média peut la redéfinir après compilation ;
- croire que `!default` **écrase** la valeur au lieu de ne s'appliquer qu'en l'absence de valeur, ou
  que `!global` sert à figer une constante ;
- croire que l'imbrication profonde produit un sélecteur **plus court** ou **plus rapide**, au lieu
  d'une spécificité qui enfle ;
- confondre `&` (sélecteur parent concaténé) avec un descendant, ou croire que `&:hover` crée un
  nouveau bloc ;
- confondre un **partial** `_x.scss` (non compilé en fichier propre) avec un fichier privé ;
- confondre `@use` (chargé une seule fois, avec namespace) et `@import` (recopié à chaque appel),
  ou croire que `@forward` **exécute** le module au lieu de ré-exposer son API ;
- confondre un **mixin** (`@include`, recopie les déclarations, accepte des arguments) avec
  `@extend` (regroupe les sélecteurs, pas d'argument) ou avec une **fonction** (`@return`, rend une
  valeur) ;
- croire que `@extend` fonctionne à travers les media queries, ou qu'il accepte un paramètre ;
- croire que les opérations de couleur produisent une image, ou que `lighten()` agit sur l'opacité ;
- croire qu'une **map** est un tableau indexé, que `map.get` mute la map, ou qu'on y accède par
  point comme à un objet JavaScript ;
- croire qu'une `@each`/`@for` boucle **dans le navigateur** au lieu de générer les règles à la
  compilation ;
- croire qu'une media query écrite en Sass devient une variable CSS, ou qu'un `@mixin` de breakpoint
  réduit le poids du CSS produit ;
- croire que BEM est une fonctionnalité de Sass plutôt qu'une convention de nommage ;
- croire que `sass:math`, `sass:color`, `sass:map`, `sass:string`, `sass:list` s'importent avec
  `@import` ou qu'ils sont disponibles sans `@use`.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **96,7 %, couverture 98,4 %**

`node tools/plan-rangs-qcm.js sass` donne, question par question, la **fenêtre de caractères** visée
pour chaque distracteur. Rangs actuels **59 / 1 / 1 / 0** ; l'outil vise **16 / 15 / 15 / 15**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang. Le sens INVERSE le dit **déjà** ici : « la DEUXIÈME plus longue » rend **32,1 %** en
global inverse sur 52 questions et « la TROISIÈME » **31,3 %** sur 50, parce que la bonne réponse
n'est **jamais** à ces rangs-là.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

⚠️⚠️ **UN DISTRACTEUR NE DOIT JAMAIS FAIRE EXACTEMENT LA LONGUEUR DE LA BONNE RÉPONSE** :
`plan-rangs-qcm` teste `plusLong = len > bon`, donc à `len === bon` l'option est classée « plus
courte » et sa fenêtre s'arrête à `bon − 1` — hors bande d'un seul caractère.

⚠️⚠️ **NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX.** La cible est **16/15/15/15 sur le cours
entier** : la bonne réponse est volontairement la plus courte sur 15 questions. Sur `typescript`,
**quatre relecteurs sur cinq** ont signalé « l'indice de longueur est rouvert ici » — les quatre
avaient tort. **Un lot de 9 à 13 questions ne peut pas afficher 25 %.**

### (2) ⚠️⚠️ LE NOMBRE DE MOTS DOIT SUIVRE LE RANG DE LONGUEUR

`la moins bavarde (peu de mots)` : **DIRECTE 0,0 % sur 37 questions**, soit **30,1 % au global
inverse**. Une DIRECTE à zéro sur une large couverture est une **élimination sûre**. Et sa jumelle
`ECARTER la moins bavarde` rend déjà **43,2 % en direct** (rendement 85,7 %). Règle appliquée avec
succès aux 42ᵉ et 43ᵉ : **le rang en MOTS de la bonne réponse = son rang en CARACTÈRES.** Allonger
un distracteur avec des mots longs le rend plus long *et* moins bavard — ce qui ferme la longueur et
ouvre celle-ci.

⚠️ **La fermeture de « la moins bavarde » n'est PAS « partager le minimum »** (leçon du 43ᵉ) :
l'outil ne cesse de compter la question que si l'ensemble des options au compte minimal vaut **les
quatre**. Un minimum partagé par deux options laisse encore un demi-point. **Vise les quatre options
au même nombre de mots quand c'est possible.**

### (3) LA PLUS DÉTAILLÉE — 78,7 %, couverture 70,5 %, rendement 97,7 %

La bonne réponse est presque toujours la seule à porter un nom de fonction, un chemin de fichier, un
exemple concret. **Fais porter du concret FAUX à tes distracteurs** : une directive qui existe
employée pour la mauvaise chose (`@extend` présenté comme acceptant des arguments), un module natif
réel avec un effet inventé, une valeur plausible mais fausse. **La stratégie compte les `, : ;` —
égalise ce compte sur les quatre options.**

### (4) LA PONCTUATION, ET SURTOUT SON UNION

| marque | bonnes réponses qui la portent | distracteurs | questions où **une seule** option la porte | dont c'est **la bonne** |
|---|---:|---:|---:|---:|
| parenthèse | 37 / 61 | 9 / 183 | 32 | **32 (100 %)** |
| virgule | 37 | 19 | 30 | **27 (90,0 %)** |
| deux-points | 20 | 11 | 16 | **15 (93,8 %)** |
| point-virgule | 16 | **0** | 16 | **16 (100 %)** |
| barre oblique | 7 | 2 | 5 | **5 (100 %)** |
| **UNION ponctuation forte** | 35 | 11 | **29** | **29 (100 %)** |
| guillemets | 2 | 1 | 1 | 1 (100 %) |
| tiret | 1 | 0 | 1 | 1 (100 %) |
| flèche | 1 | 0 | 1 | 1 (100 %) |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'union.**
⚠️ **AUCUN des 183 distracteurs ne porte de point-virgule**, quand 16 bonnes réponses en portent :
c'est **100 % de rendement** sur 16 questions. En Sass le `;` est souvent **du code**
(`$couleur: bleu;`), pas une ponctuation d'explication : l'outil ne fait pas la différence, il
**compte le caractère**. Tu dois équilibrer le CARACTÈRE. Même remarque pour la parenthèse
(`.scss`, `map.get()`) et la barre oblique (`sass:math`, `@use "x/y"`).
⚠️ **L'INCISE SE COMPTE, ELLE NE SE TESTE PAS** — la leçon du 42ᵉ. `l'incise entre parenthèses` est
un `argMax` sur le **NOMBRE** d'incises de 4 signes et plus : un **2/1/1/1** est vert pour qui
regarde « toutes les options en portent une » et rend **100 %** à qui compte. Cible : **n/n/n/n**.
Ici **36 questions** ont la bonne réponse seule en tête. `node tools/plan-rangs-qcm.js sass --incise`
donne le compte question par question.
⚠️ **NE POSE PAS TES INCISES EN FIN DE DISTRACTEUR.** Au 42ᵉ, cela a fait passer « écarter la glose
finale » de 24,9 % à 28,9 %, et la fermer en *supprimant* une incise rouvrait l'indice précédent :
il a fallu les **déplacer** à compte constant. **Répartis-les dès le premier jet.**

### (5) LE POINT INTERNE — **0 QUESTION AUJOURD'HUI, ET C'EST LA CORRECTION QUI LE FABRIQUE**

Mesure du jour : `la seule en deux phrases` = **25,0 %, couverture 0,0 %** sur `sass`. **C'est un
acquis, pas une dispense** : sur les cours déjà traités, la couverture de cet indice est presque
DEUX FOIS celle des cours non traités (`react` 19,8 %, `rust` 19,7 %), parce que c'est le réflexe de
qui étoffe une bonne réponse — on ajoute la règle à retenir, et jamais à un distracteur puisqu'il
est faux. **Ici le risque est inversé : c'est TON distracteur allongé qui va porter deux phrases.**

> **Dans une question donnée, les quatre options portent le MÊME nombre de phrases.** La signature
> est **un point suivi d'une espace puis d'une majuscule** (le point d'abréviation `etc.`, la
> virgule décimale et le point d'un `map.get()` ne comptent pas). Les bonnes réponses de `sass`
> tiennent presque toutes en **une** phrase : **écris donc tes distracteurs en une seule phrase**,
> quitte à employer un point-virgule ou une virgule là où tu aurais mis un point.

### (6) LE MOT TECHNIQUE EXCLUSIF — 65,2 %, couverture 63,9 %

La bonne réponse ne doit pas être la seule à employer un mot long qu'aucune autre n'emploie.
⚠️⚠️ **NE LE FERME PAS À FOND. Vise l'égalité, pas zéro.** Mesuré au 39ᵉ : l'écraser l'a fait tomber
à 13,3 % en direct, ce qui a porté sa lecture INVERSE à 28,9 %. Au 41ᵉ (`pandas`) le lot l'a mis à
**0,0 % en direct**, c'est-à-dire une **élimination sûre** à 33,3 %.
⚠️ Le piège dans le piège : le mot que tu écris **pour remplacer** un mot exclusif peut être exclusif
à son tour. La stratégie compte les mots de **9 lettres et plus** : `imbrication`, `compilation`,
`spécificité`, `sélecteurs`, `interpolation`, `paramètres`, `namespace`, `responsive`,
`architecture`, `déclarations` en font partie.

### (7) L'ÉCHO DE L'ÉNONCÉ — 42,6 %, couverture 44,3 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité.

### (8) L'INDICE LEXICAL — **54 questions EXPLOITABLES sur 61**, et **59 sur 61 à mettre en forme**

Un apprenant qui cherche au clavier (Ctrl+F) les mots de chaque option **dans la page** tranche.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0` · `k > 0` → `k / k / k`
Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (100 % sur `mobile`). Et
`0 / 0 / k` laisse **exactement 50 %** à qui restreint son tirage aux deux options les plus
étrangères. **Seule l'égalité des quatre ferme les deux lectures.**

**RÈGLE DU `w`, et elle NE SE DÉDUIT PAS DU `k`.** Soit `w` le nombre de mots de 6 lettres et plus
de la bonne réponse : **ou les quatre options portent le même `w`, ou au moins un distracteur en
porte strictement plus.** C'est `w`, pas `k`, qui ferme la stratégie PROPORTION.

⚠️ **CONSTITUE LE DICTIONNAIRE DE LA PAGE AVANT DE RÉDIGER, pas après.** Le dictionnaire se prend
sur le **corps** de la page, blocs de QCM exclus. Outil : `node tools/mesure-lexique-qcm.js
--liste=sass` — il imprime, pour **chaque question**, le `k` visé, le `w` et les mots en cause.
Cible : **0 exploitable ET 0 à mettre en forme**.

⚠️ **LA CONTRAINTE À QUATRE CONDITIONS.** Un mot de remplacement doit satisfaire **quatre** règles à
la fois : **moins de 9 lettres** (sinon il redevient le mot technique exclusif), **au moins 6
lettres** (sinon le `w` tombe et PROPORTION se rouvre), **présent dans la page** (sinon il est
étranger et casse le `k`), et **absent de l'énoncé** (sinon il fabrique l'écho). **Trois sur quatre
ne suffit pas.**

⚠️ **PIÈGE DE COMPTAGE** : `mesure-lexique-qcm` capte les mots de 6 signes et plus, et
**l'apostrophe et le tiret SÉPARENT les mots** (`l'option` = 2 mots, `theme-sombre` = 2). En Sass le
risque est maximal avec les noms à tiret (`carte__titre`, `theme-sombre`), les variables `$mon-nom`
et les directives `@use` : **écris les identifiants exactement comme la page les écrit**.

### (9) LE MOT FÉTICHE — **1 alerte**

`node tools/mesure-mot-fetiche.js sass` (colonnes : `vu / bonnes / distracteurs`) :

| mot | vu | bonnes | distracteurs | questions tranchées | RESTREINDRE |
|---|---:|---:|---:|---:|---:|
| `valeur` | 12 | 7 | 5 | 9 | **30,9 %** |
| `changer` | 7 | 6 | 1 | 7 | 32,0 % (sous le seuil de 8 questions) |
| `unique` | 6 | 5 | 1 | 6 | 30,7 % (idem) |
| `module` | 7 | 5 | 2 | 5 | 29,5 % (idem) |
| `mixin` | 11 | 6 | 5 | 7 | 29,2 % (idem) |

**La règle est celle des marques : par mot, les quatre options le portent, ou aucune** — et quand
c'est la BONNE réponse qui le porte (elle est intouchable), on l'**AJOUTE** aux distracteurs. Le
retirer d'eux laisserait la bonne réponse seule à le porter et **retournerait l'indice à 100 %**.
⚠️ **SINGULIER/PLURIEL** : `valeur` et `valeurs` sont **deux jetons différents** pour l'outil.
Ajouter « variable » quand la bonne réponse porte « variables » ouvre une configuration 3/4 en
laissant les deux outils verts — c'est arrivé au 39ᵉ.
⚠️ **ET DANS L'AUTRE SENS** : `rapide` (0 bonne / 8 distracteurs), `uniquement` (0 / 8),
`javascript` (0 / 6), `fonctionne` (0 / 6), `media` (0 / 6) sont des **tics de distracteur** —
« écarter l'option qui dit *rapide* ou *uniquement* » est une élimination presque sûre.
**N'ajoute pas de nouveaux `rapide` / `uniquement` / `plus performant` dans tes distracteurs.**

### (10) L'INTRUS LEXICAL — **4 questions tranchées à coup sûr**

`node tools/mesure-mot-question.js sass --liste`. Lecture **PAR DÉFAUT 26,2 %** (3 sûres), lecture
**PAR EXCÈS 27,5 %** (1 sûre) :

| leçon | lecture | mots en cause |
|---|---|---|
| `lecon-05` | DÉFAUT | `parce` |
| `lecon-08` | DÉFAUT | `parce` |
| `lecon-09` | DÉFAUT | `parce` |
| `lecon-14` | EXCÈS | `interpolation` |

Règle : **par mot, les quatre options le portent, ou aucune**, appliquée **question par question**.
⚠️ Le mot `parce` est **vu 16 fois** sur le cours, réparties en **1 bonne réponse et 15
distracteurs** : c'est la formule « Parce que… » des **distracteurs**. Trois questions ont leurs
**trois** distracteurs qui commencent par « Parce que » et une bonne réponse qui ne le fait pas —
donc « cocher celle qui ne dit pas *parce* » gagne à coup sûr. **Par question : les quatre options
commencent par « Parce que », ou aucune.** Comme la bonne réponse est intouchable, **c'est à tes
distracteurs de renoncer à la formule** sur ces trois questions.
⚠️ **`mesure-mot-fetiche` NE LE VOIT PAS** (il exige qu'un mot tranche ≥ 8 questions) : lance les
deux. **Lis la colonne « sûres », pas la colonne « taux ».**
⚠️ **NE CRÉE PAS un 3/4 dont l'intrus serait la bonne réponse** : elle est intouchable, donc
l'indice deviendrait irrattrapable.

### (11) LE SENS INVERSE — déjà **4 alertes AVANT ton passage**

`node tools/mesure-biais-inverse.js --toutes sass` :

| stratégie | tranche | DIRECTE | INVERSE | GLOBAL |
|---|---:|---:|---:|---:|
| la DEUXIÈME plus longue | 52 | **0,0 %** | 33,3 % | **32,1 %** |
| la TROISIÈME plus longue | 50 | 2,0 % | 32,7 % | **31,3 %** |
| la moins bavarde (peu de mots) | 37 | **0,0 %** | 33,3 % | **30,1 %** |
| l'attaque unique | 9 | 11,1 % | 29,6 % | 25,7 % |

Ces alertes sont la conséquence directe du rapport 3,33 — elles se refermeront **si et seulement si**
tu tiens les fenêtres de `plan-rangs-qcm` **et** la règle (2) sur le nombre de mots. **Ne les traite
pas séparément : elles sont la longueur vue de dos.**

### (12) Les marques à ne pas ouvrir

**virgule décimale**, **flèche** (1 question, 1/1 : `lecon-08` q3, la bonne réponse porte
`&__titre → .carte__titre` et les trois distracteurs n'ont pas de flèche — c'est **100 %** pour qui
la repère), **guillemets**, **nom d'outil ou de bibliothèque** (`Dart Sass`, `LibSass`, `Bootstrap`,
`PostCSS`, `webpack`) : sur `dataviz`, **0 bonne réponse sur 68** en portait contre 17 distracteurs —
la règle « écarter l'option qui nomme un outil » n'avait **jamais** tort. Et **« la seule qui nie »**
rend **21,7 % en direct sur 36,1 % des questions**, c'est-à-dire une quasi-élimination sûre :
**égalise la négation** (« ne… pas », « aucun », « jamais », « sans »).

---

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
   ⚠️ **SAUF si elle est FAUSSE** : au 40ᵉ cours (`crypto`), une bonne réponse annonçait un chiffre
   que le programme de sa propre leçon contredit ; au 42ᵉ (`haskell`), **trois figures et blocs de
   sortie** se contredisaient eux-mêmes ; au 43ᵉ (`clojure`), un bloc annonçait 11 assertions pour 9.
   **Si tu trouves une erreur dans l'intouchable ou dans le corps de la leçon, ne la recopie pas dans
   un distracteur : remonte-la à l'orchestrateur avec la citation de la page qui le prouve.** Aucun
   des 45 vérificateurs ne lit ces endroits-là.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire — et le **rang en mots**
   aligné sur le rang en caractères.
3. **Par marque : les quatre options, ou aucune** — ponctuation (et leur UNION, et le **compte** des
   incises), mots fétiches, ET mots d'une seule question (l'intrus lexical). **Et le même nombre de
   PHRASES.**
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en Sass** — et **tu ne peux pas le compiler** (voir (a)) : ancre-le
   sur le corps de la leçon. Le coût mesuré d'un distracteur devenu vrai est de **1,68 réécriture**.
   ⚠️ Une phrase peut être vraie **dans un autre contexte** : « les variables CSS peuvent changer à
   l'exécution » est vrai pour `--x` et faux pour `$x` ; « `@extend` regroupe les sélecteurs » est
   vrai. Demande-toi toujours : *existe-t-il une lecture où cette phrase est exacte ?*
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS** — voir en tête de cette consigne.

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=sass           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes sass     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=sass        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js sass                # 0 alerte
node tools/mesure-mot-question.js sass --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js sass              # rangs, cible 16/15/15/15
node tools/mesure-qcm-intouchable.js sass <ref>      # 0 atteinte
node tools/plan-rangs-qcm.js sass                    # ce qu'il reste a ecrire
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**

---

## ⚠️ Ce que les passes 39 à 43 ont appris sur la MÉTHODE, et qui vaut pour toi

1. **La contradiction adversariale doit elle-même être contredite.** Un remède proposé n'est pas un
   ordre : évalue-le, et si tu le rejettes, écris la preuve.
2. **Fermer un indice en rouvre un autre — trois fois de suite au 42ᵉ cours.** Longueur → incise →
   glose finale, et le remède évident de la troisième rouvrait la première. **Après chaque retouche,
   rejoue TOUTES les mesures**, pas seulement celle que tu visais.
3. **Un relecteur qui mesure sur SON LOT extrapole faux.** Trois indices annoncés à 36-43 % sur un
   lot mesuraient 25-29 % sur le cours entier. **Toujours remesurer sur le corpus complet.**
4. **UN DIAGNOSTIC QUI N'EST PAS LA COPIE EXACTE DE L'OUTIL FAIT TRAVAILLER À CÔTÉ DE LA CIBLE**
   (43ᵉ cours) : un script qui comptait les mots avec `/[\wà-ÿ'-]+/gi` annonçait « 0 question
   tranchée » quand l'outil, qui compte avec **`/[A-Za-zÀ-ÿ0-9_]+/g`**, en comptait 22. **Si tu
   écris un script de contrôle, recopie la fonction de l'outil, pas son intention** — et de
   préférence, **lance l'outil lui-même**.
5. **Corriger un CORPS de leçon rouvre l'indice lexical** : le dictionnaire de la page change, donc
   la règle du `k` des QCM de cette page peut sauter. Corrige le corps d'abord, le QCM ensuite.
6. **N'écris QUE dans les leçons de ton lot.** Un autre écrivain travaille en même temps sur les
   autres leçons du même cours ; deux agents qui touchent le même fichier se détruisent.
   **Ne fais AUCUN `git commit`, AUCUN `git add`, AUCUN `git stash`** — l'orchestrateur seul commite.
7. **Le JSON doit rester valide et le fichier sans BOM.** Après ton lot :
   `node -e "…JSON.parse…"` sur chaque bloc que tu as touché, et `node tools/verif-html.js`.
8. **Un script lancé via `node -e '…'` en quotes simples se fait manger un niveau de backslash par
   l'outil Bash** : `(?<![\p{L}])` devient `(?<![p{L}])` et la mesure ment. **Écris le script dans un
   fichier avant de le lancer.**
