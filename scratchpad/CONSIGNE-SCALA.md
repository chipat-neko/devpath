# Consigne d'écriture — les QCM du cours `scala` (B4, 39ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `scala` (val/var et inférence,
classes et *case classes*, *pattern matching*, `Option`/`Either`/`Try`, collections immuables,
`map`/`flatMap`/`for`-comprehension, traits et mixins, génériques et variance, implicites
`given`/`using`, fonctions d'ordre supérieur, concurrence par `Future`, Scala 3). La question,
l'index `correct`, l'explication et **le texte de la bonne réponse** sont **INTOUCHABLES** :
`tools/mesure-qcm-intouchable.js scala <ref-git>` le contrôle et signalera toute atteinte.
Tu ne touches qu'aux **trois options fausses**.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **91,9 %** des QCM de `scala` en cochant
l'option la plus longue — couverture **98,5 %**, rendement **92,5 %**. **Ton lot doit ramener
chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus difficiles : on rend
les **distracteurs crédibles**.

**68 questions sur 17 leçons** (dont **12 en QCM bilan**).

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 91,9 %, couverture 98,5 %

`node tools/plan-rangs-qcm.js scala` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. **65 questions sur 68** sont à retoucher, soit **14 567 caractères**.
La bonne réponse est **63 fois au rang 0** ; l'outil vise **17 / 17 / 17 / 17**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à qui
cochait « la deuxième plus longue ».

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

⚠️⚠️ **ET NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX.** La cible est **17/17/17/17 sur le
cours** : la bonne réponse est donc volontairement la plus longue sur 17 questions et la plus
courte sur 17 autres. Sur `typescript`, **quatre relecteurs sur cinq** ont signalé « la bonne
réponse est la plus courte ici, l'indice est rouvert » — les quatre avaient tort, et la mesure
globale (25,0 % dans les deux sens) les a réfutés. **Un lot de 12 questions ne peut pas afficher
25 %.** Fais confiance à `plan-rangs-qcm`, pas à ton impression sur ton lot.

### (2) LA PLUS DÉTAILLÉE — 81,7 %, rendement 94,4 %

La bonne réponse ne doit pas être la seule à donner un exemple, un nom de type, un chiffre.
**Fais porter du concret FAUX à tes distracteurs** : une méthode de collection employée pour la
mauvaise chose, une règle de variance inventée, un comportement de `for`-comprehension qui
n'existe pas.

### (3) LA PONCTUATION FORTE EN UNION — 73,5 % (et **74,0 %** en RESTREIGNANT), rendement **100 %**

Elle regarde l'**UNION** de trois marques : « `:` », « `;` » et le **tiret cadratin**. Sur ce cours
elle tranche sur 44 questions et **ne se trompe jamais**.
**La règle, et elle suffit à fermer aussi les marques prises une par une** : *par marque, ou les
quatre options la portent, ou aucune.*
⚠️ En Scala, `:` est **du code** (annotation de type, `case x: Int`, `A <: B`). Si une option en
porte, les quatre. Idem pour `=>` (fonction anonyme et branche de `case`).
Pris séparément : deux-points **50,7 %**, point-virgule **47,1 %**.

### (4) LE MOT TECHNIQUE EXCLUSIF — 72,4 %, rendement 84,6 %

La bonne réponse ne doit pas être la seule à employer un mot long que personne d'autre n'emploie.
⚠️ **Ne le ferme pas à fond** : sur `git`, l'écraser a fait passer l'inverse à 28,5 %. Vise
l'égalité, pas l'inversion.

### (5) L'INCISE ENTRE PARENTHÈSES — 63,6 %, rendement 92,1 % (et RESTREINDRE **65,6 %**)

`node tools/plan-rangs-qcm.js scala --incise` donne les questions concernées. Formulation
exacte, apprise sur `java` : **autant d'incises que la bonne réponse** — et non « pas la seule à en
porter » (cette formulation molle laissait l'indice à 39,9 %).
⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — plafond trouvé sur `data-eng` :
il reste **50 %** à qui **RESTREINT** son tirage aux options marquées.

### (6) L'ÉCHO DE L'ÉNONCÉ — 57,1 %, rendement 84,8 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité : avec un ensemble maximal
de taille `s` contenant la bonne réponse, le crédit vaut `1/s`, et il ne vaut l'étalon `1/4` **que**
si `s = 4`.

Outil : `node tools/mesure-biais-inverse.js --toutes scala` — les 42 stratégies dans le sens
INVERSE. **Lis la colonne GLOBAL**, pas la colonne INVERSE. Trois y sont déjà au-dessus du seuil :
« la TROISIÈME plus longue » **31,6 %**, « la moins bavarde » **30,3 %**.

⚠️ **UN MOT D'ÉCHO EST SOUVENT UN MOT LONG.** Le retirer fait tomber le compte de mots longs et
rouvre la **règle du `w`** ; l'ajouter peut introduire un mot **étranger à la page** et rouvrir la
règle du `k`. **Recompte `k` ET `w` après chaque retouche d'écho.**

### (7) L'INDICE LEXICAL — **59 questions EXPLOITABLES sur 68**, 62 à mettre en forme

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0` · `k > 0` → `k / k / k`
Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (**100 %** sur `mobile`). Et
`0 / 0 / k` laisse **exactement 50 %** à qui restreint son tirage aux deux options les plus
étrangères. **Seule l'égalité des quatre ferme les deux lectures.**

**RÈGLE DU `w`, et elle NE SE DÉDUIT PAS DU `k`.** Soit `w` le nombre de mots de 6 lettres et plus
de la bonne réponse : **ou les quatre options portent le même `w`, ou au moins un distracteur en
porte strictement plus.** C'est `w`, pas `k`, qui ferme la stratégie PROPORTION.

⚠️ **CONSTITUE LE DICTIONNAIRE DE LA PAGE AVANT DE RÉDIGER, pas après.** Un écrivain du 35ᵉ cours a
perdu un tour complet faute de l'avoir fait : premier jet propre en longueur, en marques et en `w`,
et **7 questions sur 10** violaient quand même la règle du `k`.

Outil : `node tools/mesure-lexique-qcm.js --liste=scala`. Cible : **0 exploitable ET 0 à
mettre en forme**.

### (8) LE MOT FÉTICHE — `scala` en porte DIX au-dessus du seuil

`node tools/mesure-mot-fetiche.js scala` les liste. **Tous du côté des BONNES réponses**, donc
tous à AJOUTER aux distracteurs :

| mot | bonnes / distracteurs | RESTREINDRE |
|---|---:|---:|
| `renvoie` | 7 / 1 | **32,0 %** |
| `résultat` | 7 / 2 | **31,3 %** |
| `valeur` | 6 / 3 | 30,9 % |
| `flatMap` | 6 / 2 | 30,5 % |
| `fournit`, `nouvelle`, `instance` | 5 / 1 | 29,8 % |
| `given` | 5 / 2 | 29,5 % |
| `using` | 4 / 2 | 28,4 % |
| `erreur` | 5 / 5 | 28,3 % |

**La règle est celle des marques : par mot, les quatre options le portent, ou aucune.**
⚠️ **Quand c'est la BONNE réponse qui porte le mot — et elle est intouchable — on l'AJOUTE aux
distracteurs.** Le retirer d'eux laisserait la bonne réponse seule à le porter et **retournerait
l'indice à 100 %**.

⚠️ **Un mot supplémentaire à surveiller** : `parce`, vu **52 fois**, rend **27,7 % en ÉCARTANT**.
Beaucoup de tes énoncés commencent par « Pourquoi », et la bonne réponse par « Parce que ». Si la
bonne réponse commence ainsi, **les trois distracteurs aussi**.

### (9) ⚠️ L'INTRUS LEXICAL — le 45ᵉ indice, découvert sur `typescript`

`node tools/mesure-mot-question.js scala --liste`. Sur `scala`, **4 questions** sont tranchées
**à coup sûr** par la lecture PAR DÉFAUT, et la lecture PAR EXCÈS rend **26,3 %**.

Pour **une** question, un mot porté par **toutes les options sauf une** désigne cette option.
L'apprenant qui écarte les trois options qui partagent un mot que la quatrième n'a pas trouve la
bonne réponse **sans rien connaître au cours**.

⚠️ **`mesure-mot-fetiche` NE LE VOIT PAS** : il exige qu'un mot tranche **≥ 8 questions** pour
alerter. Sur `typescript`, il rendait « 0 alerte » pendant que cinq relecteurs trouvaient **sept**
questions de ce type. **Lance les deux outils, aucun ne remplace l'autre.**

⚠️ **Lis la colonne « sûres », pas la colonne « taux ».** Le taux peut être **sous** 25 % alors que
des questions sont ouvertes à 100 % — c'est encore la leçon du cours `react`.

Règle : **par mot, les quatre options le portent, ou aucune** — appliquée **question par question**.
Détail complet dans `scratchpad/REGLE-INTRUS-LEXICAL.md`.

### (10) Les marques à ne pas ouvrir

**virgule décimale** (`4,5`), **flèche** (`→`) : ⚠️ en Scala, `=>` est **du code**. Si une option
en porte, les quatre.
**Nom d'outil ou de bibliothèque** (`sbt`, `Akka`, `Cats`, `ZIO`, `Spark`) : sur `dataviz`, **0
bonne réponse sur 68** en portait contre 17 distracteurs — la règle « écarter l'option qui nomme un
outil » n'avait **jamais** tort. Vérifie-le sur ton lot, et applique les quatre ou aucune.

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire.
3. **Par marque : les quatre options, ou aucune** — ponctuation, mots fétiches, ET mots d'une
   seule question (l'intrus lexical).
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en Scala** — c'est la plus importante. Le coût mesuré sur `a11y`
   d'un distracteur devenu vrai est de **1,68 réécriture**. Sur `swift`, **25 distracteurs sur
   198** étaient devenus vrais ; sur `typescript`, la relecture en a trouvé **une vingtaine**,
   dont un qui était **littéralement une seconde bonne réponse**.
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.** C'est la leçon neuve du 38ᵉ cours.
   Pour atteindre la fenêtre de longueur, les écrivains de `typescript` ont remélangé le
   vocabulaire de la bonne réponse jusqu'au bon compte de caractères — et la bonne réponse est
   devenue **la seule option qui veuille dire quelque chose**. Un apprenant qui ne connaît pas une
   ligne de Scala coche juste, par élimination du charabia. **Aucun outil ne mesure ça.** Relis
   chaque distracteur à voix haute : s'il ne signifie rien, il ne trompe personne et il abîme la
   leçon. Un bon distracteur est une **erreur que quelqu'un pourrait vraiment commettre**.

## Vrai en Scala, donc jamais employable comme distracteur

`val` est immuable et `var` réassignable ; une *case class* fournit `equals`, `hashCode`, `toString`,
`copy` et un extracteur pour le *pattern matching* ; `Option` a `Some` et `None` et évite le `null` ;
`Either` porte `Left` (l'erreur, par convention) et `Right` ; les collections de `scala.collection.immutable`
sont immuables par défaut ; `map` transforme et `flatMap` aplatit d'un niveau ; une `for`-comprehension
se désucre en `map`/`flatMap`/`withFilter` ; un `trait` peut porter des méthodes concrètes et se
mixer ; la variance s'écrit `+A` (covariant), `-A` (contravariant), `A` (invariant) ; `given`/`using`
remplacent `implicit` en Scala 3 ; `match` est une expression et rend une valeur ; `Future` est
*eager* et démarre dès sa création ; les *enums* et les `union types` sont arrivés avec Scala 3 ;
l'indentation significative y est optionnelle et remplace les accolades.

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=scala           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes scala     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=scala        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js scala                # 0 alerte
node tools/mesure-mot-question.js scala --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js scala              # rangs, cible 17/17/17/17
node tools/mesure-qcm-intouchable.js scala <ref>      # 0 atteinte
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**
