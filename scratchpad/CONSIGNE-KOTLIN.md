# Consigne d'écriture — les QCM du cours `kotlin` (B4, 31ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `kotlin`.
La question, l'index `correct`, l'explication et **le texte de la bonne réponse** sont
**INTOUCHABLES** : un vérificateur (`tools/mesure-qcm-intouchable.js`) le contrôle et signalera
toute atteinte. Tu ne touches qu'aux **trois options fausses** de chaque question.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **90,0 %** des QCM de `kotlin` en cochant
simplement **l'option la plus longue** (rendement **91,8 %** sur les 97,3 % de questions où la
règle tranche). Ce n'est pas le seul indice : neuf autres stratégies mécaniques dépassent
largement le hasard sur ce cours. **Ton lot doit ramener chaque indice à 25 %, l'étalon du
hasard.** On ne rend pas les questions plus difficiles : on rend les **distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — l'indice à 90,0 %, rendement 91,8 %

`node tools/plan-rangs-qcm.js kotlin` te donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. Sur ce cours, **68 questions sur 75** sont à retoucher, soit
**15 237 caractères** à écrire. L'outil vise à répartir la bonne réponse sur les quatre rangs de
longueur : **19 / 19 / 19 / 18** (elle est aujourd'hui **68 fois au rang 0**, c'est-à-dire la plus
longue).

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur le cours `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à
qui cochait « la deuxième plus longue ». C'est pour ça que l'outil demande une **répartition**.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.** Un script Node jetable qui
vérifie les cinq contraintes coûte moins cher qu'une reprise.

### (2) LE POINT-VIRGULE — 100 % de rendement, sur 33,3 % des questions

Sur ce cours, quand une seule option porte un `;`, **c'est la bonne, 25 fois sur 25**. Règle :
**les quatre options le portent, ou aucune.** Corriger est bon marché — il suffit d'ajouter un
`;` dans un distracteur, ou de le retirer de la bonne réponse (non : elle est intouchable — donc
**tu en ajoutes aux distracteurs**).

Même chose pour les **deux-points** (`RESTREINDRE aux deux-points` : **100 %** de rendement) et
la **parenthèse** (`RESTREINDRE à la parenthèse` : **97,7 %**).

⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — c'est le plafond trouvé sur
`data-eng` : il reste **50 %** à l'apprenant qui **RESTREINT** son tirage aux options marquées.
**Par marque : ou les quatre options la portent, ou aucune.**

### (3) L'INCISE ENTRE PARENTHÈSES — 65,2 %, rendement 97,6 %

`node tools/plan-rangs-qcm.js kotlin --incise` liste les questions concernées et donne la fenêtre.
Formulation exacte de la règle, apprise sur `java` : **autant d'incises que la bonne réponse** —
et non « pas la seule à en porter » (cette formulation molle laissait l'indice à 39,9 %).

### (4) LA PLUS DÉTAILLÉE — 69,7 %, rendement 97,7 %

La bonne réponse ne doit pas être la seule à donner un exemple, un nom d'API, une valeur. **Fais
porter du concret à tes distracteurs** — du concret qui dit quelque chose de **faux**.

### (5) LE MOT TECHNIQUE EXCLUSIF — 67,7 %, rendement 89,1 %

Le vocabulaire de métier (`coroutine`, `suspend`, `nullable`, `data class`, `sealed`, `inline`,
`reified`, `délégation`, `extension`, `covariance`, `destructuration`, `companion`, `scope`,
`flow`, `immuable`…) ne doit pas n'apparaître que dans la bonne réponse : **au moins deux
distracteurs emploient du vocabulaire du même registre**, en disant quelque chose de faux.

⚠️ Cet indice **MONTE** quand on écrit du français naturel avec le vocabulaire du cours (mesuré
sur `mobile` : 25,0 % → 42,5 %). Surveille-le après écriture.

### (6) L'INDICE LEXICAL — INVERSE à 68,3 % de rendement sur ce cours

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.
Sur `kotlin` c'est la variante **INVERSE** qui domine : les distracteurs actuels sont écrits avec
des mots **absents de la leçon**, donc il suffit d'écarter l'option la plus étrangère.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0`
- `k > 0` → `k / k / k`

Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (variante INVERSE, mesurée à
**100 %** sur `mobile`). Et l'ancienne règle `0 / 0 / k` laisse **exactement 50 %** à qui restreint
son tirage aux deux options les plus étrangères. **Seule l'égalité des quatre ferme les deux
lectures.**

**RÈGLE DU `w`** (trouvée le 2026-09-07 sur `ocaml`) : à `k` égal, la part de mots présents
`(w - k) / w` **croît avec `w`**, le nombre de mots longs. Donc si la bonne réponse porte à elle
seule le plus de mots longs, elle reste désignée **avec des `k` parfaitement égaux**. Ou les quatre
options portent le même nombre de mots longs, ou **au moins un distracteur en porte strictement
plus** que la bonne réponse. (Sans objet quand `k = 0`.)

Outil : `node tools/mesure-lexique-qcm.js --liste=kotlin` — il liste les questions non conformes,
option par option, avec les mots fautifs.

### (7) L'ÉCHO DE L'ÉNONCÉ — 55,7 %, rendement 90,6 %

La bonne réponse ne doit pas être la seule à reprendre les mots de la question : fais-les reprendre
par **UN seul** distracteur. ⚠️ **Pas par les trois** : sur `data-eng` l'écho s'est RETOURNÉ
(40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu **30,4 %**. Cette règle inverse est
**dans le cliquet** : un lot qui met l'écho à zéro partout fera échouer la chaîne.

### (8) LES MARQUES — 8 questions à mettre en forme

`node tools/plan-rangs-qcm.js kotlin --marques` : **point interne** (une option écrite en deux
phrases), **guillemets**, **flèche**. Cible : **les quatre ou aucune**, et **dans les deux sens** —
ne laisse pas non plus trois distracteurs marqués face à une bonne réponse qui ne l'est pas, il
suffirait alors de les **ÉCARTER**.

⚠️ Le **point interne** est l'indice le plus fort du site : **99,0 % de rendement** sur les 308
questions où il tranche. Si la bonne réponse est en deux phrases, **écris tes trois distracteurs en
deux phrases** — c'est aussi la façon la plus naturelle d'atteindre la fenêtre de longueur.

### (9) Les indices mineurs à ne pas RECRÉER

- **La négation** (30,3 % ici) : n'écris pas la négation uniquement dans la bonne réponse, ni des
  distracteurs tous positifs quand la bonne réponse nie.
- **Les absolus** (« toujours », « jamais », « aucun ») : ne les accumule pas dans les seuls
  distracteurs ; ne réserve pas la nuance (« souvent », « en général ») à la bonne réponse.
- **L'attaque unique** : ne fais pas commencer tous tes distracteurs par le même mot. Un
  **connecteur causal** répété (« Parce que… ») est un tic que nos vagues d'écriture ont déjà
  fabriqué sur `nodejs` (1/7 → 9/9).
- **La casse** : ne fais pas commencer les distracteurs par une minuscule quand la bonne réponse
  commence par une majuscule, ni l'inverse. ⚠️ `mesure-lexique-qcm` met en minuscules avant de
  comparer, donc **la casse n'est mesurée par rien** de ce côté — c'est à toi de la tenir.
- **Le point final** : ne termine pas tout ton lot par le même signe. Sur `react`, le point final
  valait **100 % sur le lot** d'un seul écrivain.
- **La MAJUSCULE d'emphase** (100 % de rendement ici, sur 4 % des questions) : pas de mot en
  capitales exclusif à la bonne réponse.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne peut pas être écrit sans le
   contenu enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js kotlin --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, `--marques`, et `node tools/mesure-lexique-qcm.js --liste=kotlin`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères, les marques, la ponctuation et les mots de 6 lettres et plus absents de la page.
4. **Écris avec un script Node** qui relit le bloc `data-quiz`, remplace les seules options
   fausses et réécrit le fichier. **N'écris pas le JSON à la main.** Après chaque fichier, vérifie
   que le bloc se reparse (`JSON.parse`).
5. Après écriture, relance `plan-rangs-qcm kotlin` (tes questions au rang cible), `--incise`,
   `--ponctuation`, `--marques`, `mesure-lexique-qcm --liste=kotlin` et `node tools/verif-html.js`.
6. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : **elle rapporte plus que la consigne**.

## Deux interdits absolus

⚠️ **UN DISTRACTEUR NE DOIT JAMAIS DEVENIR VRAI.** C'est la faute la plus grave possible : elle
crée une question à deux bonnes réponses, et l'apprenant qui comprend est puni. Chaque option que
tu écris doit être **fausse au regard de Kotlin réel**, et fausse **franchement** — pas « fausse
par une nuance ». Méfie-toi des reformulations qui décrivent, sans le vouloir, une API qui existe :
sur `ocaml`, un distracteur disait `val x` là où `val mutable n = 0` crée bel et bien une liaison.

⚠️ **NE MODIFIE RIEN D'AUTRE** : ni la question, ni `correct`, ni `explain`, ni le texte de la
bonne réponse, ni le corps de la leçon, ni un autre fichier que ceux de ton lot. Deux agents qui
écrivent dans le même fichier se détruisent mutuellement. **Ne fais aucun `git` — aucun `add`,
aucun `commit`, aucun `stash`, aucun `checkout`.**

⚠️ **KOTLIN N'EST PAS INSTALLÉ SUR CETTE MACHINE** (`kotlinc`, `kotlin`, `java` : introuvables,
vérifié le 2026-09-08). Tu ne peux donc pas exécuter un extrait pour trancher. **N'invente aucune
sortie.** Si tu veux écrire un distracteur qui cite une valeur produite par du code, raisonne
**par la documentation du langage**, pas de mémoire. En cas de doute, choisis un distracteur qui
porte sur un **mécanisme** plutôt que sur une **valeur**.

⚠️ **Si le corps d'une leçon de ton lot est faux** (une sortie annoncée que le langage ne produit
pas, un contresens), **signale-le dans ton compte rendu** — mais **ne le corrige pas** : modifier
le corps change le vocabulaire de la page et donc le calcul de l'indice lexical de tout le lot.
