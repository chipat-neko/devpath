# Consigne d'écriture — les QCM du cours `typescript` (B4, 38ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `typescript` (types de base et
inférence, unions et intersections, types littéraux, `interface` contre `type`, génériques et
contraintes, types utilitaires, gardes de type et rétrécissement, `unknown`/`any`/`never`, modules,
`strict`, décorateurs, typage des API). La question, l'index `correct`, l'explication et **le texte
de la bonne réponse** sont **INTOUCHABLES** : `tools/mesure-qcm-intouchable.js <cours> <ref-git>`
le contrôle et signalera toute atteinte. Tu ne touches qu'aux **trois options fausses**.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **92,6 %** des QCM de `typescript` en cochant
l'option la plus longue — couverture **98,5 %**, rendement **94,0 %**. **Ton lot doit ramener chaque
indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus difficiles : on rend les
**distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 92,6 %, couverture 98,5 %

`node tools/plan-rangs-qcm.js typescript` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. **65 questions sur 68** sont à retoucher, soit **15 425 caractères**.
La bonne réponse est **63 fois au rang 0** ; l'outil vise **17 / 17 / 17 / 17**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à qui
cochait « la deuxième plus longue ».

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

### (2) LA PLUS DÉTAILLÉE — 75,1 %, rendement 93,8 %

La bonne réponse ne doit pas être la seule à donner un exemple, un nom de type, un chiffre.
**Fais porter du concret FAUX à tes distracteurs** : un type utilitaire employé pour la mauvaise
chose, une option de `tsconfig` inventée, un comportement de l'inférence qui n'existe pas.

### (3) LA PONCTUATION FORTE EN UNION — 70,2 % (et 70,6 % en RESTREIGNANT), rendement **100 %**

Elle regarde l'**UNION** de trois marques : « `:` », « `;` » et le **tiret cadratin**. Sur ce cours
elle tranche sur 41 questions et **ne se trompe jamais**.
**La règle, et elle suffit à fermer aussi les marques prises une par une** : *par marque, ou les
quatre options la portent, ou aucune.*
⚠️ En TypeScript, `:` est **du code** (l'annotation de type). Si une option en porte, les quatre.

### (4) LE MOT TECHNIQUE EXCLUSIF — 64,0 %, rendement 77,1 %

La bonne réponse ne doit pas être la seule à employer un mot long que personne d'autre n'emploie.
⚠️ **Ne le ferme pas à fond** : sur `git`, l'écraser a fait passer l'inverse à 28,5 %. Vise
l'égalité, pas l'inversion.

### (5) L'INCISE ENTRE PARENTHÈSES — 62,9 %, rendement **100 %**, 34 questions

`node tools/plan-rangs-qcm.js typescript --incise` donne les questions concernées. Formulation
exacte, apprise sur `java` : **autant d'incises que la bonne réponse** — et non « pas la seule à en
porter » (cette formulation molle laissait l'indice à 39,9 %).
⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — plafond trouvé sur `data-eng` :
il reste **50 %** à qui **RESTREINT** son tirage aux options marquées.

### (6) L'ÉCHO DE L'ÉNONCÉ — 61,2 %, rendement 89,5 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité : avec un ensemble maximal
de taille `s` contenant la bonne réponse, le crédit vaut `1/s`, et il ne vaut l'étalon `1/4` **que**
si `s = 4`. Les deux formulations plus molles ont été mesurées et ont échoué sur `lua` (32,4 % en
inversant le sens, puis 30,7 % en laissant un ensemble de deux).

Outil : `node tools/mesure-biais-inverse.js --toutes typescript` — les 42 stratégies dans le sens
INVERSE. **Lis la colonne GLOBAL**, pas la colonne INVERSE.

⚠️ **UN MOT D'ÉCHO EST SOUVENT UN MOT LONG.** Le retirer fait tomber le compte de mots longs et
rouvre la **règle du `w`** ; l'ajouter peut introduire un mot **étranger à la page** et rouvrir la
règle du `k`. **Recompte `k` ET `w` après chaque retouche d'écho.**

### (7) L'INDICE LEXICAL — **61 questions EXPLOITABLES sur 68**, 63 à mettre en forme

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

Outil : `node tools/mesure-lexique-qcm.js --liste=typescript`. Cible : **0 exploitable ET 0 à
mettre en forme**.

### (8) ⚠️ LE MOT FÉTICHE — l'indice découvert sur `swift`, et `typescript` en porte SEPT

`node tools/mesure-mot-fetiche.js typescript` liste les mots que les options ne se partagent pas.
Sur ce cours, **sept mots dépassent le seuil, et tous du côté des BONNES réponses** :
« javascript » (7 bonnes / 1 distracteur) et « valeur » (8/2) rendent **32,4 %** à qui RESTREINT son
tirage aux options qui les portent ; « erreur » et « vérifier » (8/1) **33,1 %** ; « renvoie »
(6/2) 30,9 % ; « compilation » (7/6) 30,5 % ; « types » (9/9) 30,3 %.

**La règle est celle des marques : par mot, les quatre options le portent, ou aucune.**
⚠️ **Quand c'est la BONNE réponse qui porte le mot — et elle est intouchable — on l'AJOUTE aux
distracteurs.** Le retirer d'eux laisserait la bonne réponse seule à le porter et **retournerait
l'indice à 100 %**. C'est exactement la règle du `k` transposée au vocabulaire partagé.

### (9) Les marques à ne pas ouvrir

**virgule décimale** (`4,5`), **flèche** (`→`) : ⚠️ en TypeScript, `=>` est **du code** (fonction
fléchée, et signature d'appel). Si une option en porte, les quatre en portent.
**Nom d'outil ou de bibliothèque** (`tsc`, `ts-node`, `Zod`, `React`) : sur `dataviz`, **0 bonne
réponse sur 68** en portait contre 17 distracteurs — la règle « écarter l'option qui nomme un
outil » n'avait **jamais** tort. Vérifie-le sur ton lot, et applique les quatre ou aucune.

## Les cinq contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire.
3. **Par marque : les quatre options, ou aucune** — marques de ponctuation ET mots fétiches.
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en TypeScript** — c'est la plus importante. Le coût mesuré sur
   `a11y` d'un distracteur devenu vrai est de **1,68 réécriture**. Et sur `swift`, **25 distracteurs
   sur 198** étaient devenus vrais, dont la moitié portait la thèse même de la bonne réponse.

## Vrai en TypeScript, donc jamais employable comme distracteur

Les types sont effacés à la compilation et n'existent pas à l'exécution ; `interface` est ouverte à
la fusion de déclarations, `type` ne l'est pas ; `any` désactive le contrôle, `unknown` force à
rétrécir avant usage ; `never` est le type vide, retour d'une fonction qui ne termine pas ; une
union se rétrécit par garde (`typeof`, `in`, `instanceof`, prédicat `x is T`) ; `readonly` et
`as const` n'agissent qu'au typage ; les génériques acceptent des contraintes par `extends` ;
`Partial`, `Pick`, `Omit`, `Record` et `ReturnType` sont des types utilitaires de la bibliothèque
standard ; `strictNullChecks` sépare `null`/`undefined` des autres types ; l'inférence remonte des
littéraux vers les types élargis sauf avec `as const` ; les décorateurs sont standardisés depuis
TypeScript 5.0 ; `satisfies` vérifie sans élargir.

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=typescript          # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes typescript    # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=typescript       # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js typescript               # 0 alerte
node tools/mesure-qcm-longueurs.js typescript             # rangs, cible 17/17/17/17
node tools/mesure-qcm-intouchable.js typescript <ref>     # 0 atteinte
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — et 0 mot fétiche.**
