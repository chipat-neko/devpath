# Consigne d'écriture — les QCM du cours `c` (B4, 32ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `c` (langage C).
La question, l'index `correct`, l'explication et **le texte de la bonne réponse** sont
**INTOUCHABLES** : un vérificateur (`tools/mesure-qcm-intouchable.js`) le contrôle et signalera
toute atteinte. Tu ne touches qu'aux **trois options fausses** de chaque question.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **94,4 %** des QCM de `c` en cochant simplement
**l'option la plus longue** — et la règle tranche sur **100 %** des questions, sans une seule
égalité. C'est le pire score des 90 cours du site sur cet indice. Ce n'est pas le seul : **dix**
autres stratégies mécaniques dépassent largement le hasard, dont sept à **100 % de rendement**.
**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions
plus difficiles : on rend les **distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — l'indice à 94,4 %, rendement 94,4 %, couverture 100 %

`node tools/plan-rangs-qcm.js c` te donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. Sur ce cours, **66 questions sur 71** sont à retoucher, soit
**17 391 caractères** à écrire. La bonne réponse est aujourd'hui **67 fois au rang 0** (la plus
longue) ; l'outil vise la répartition **18 / 18 / 18 / 17**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur le cours `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à
qui cochait « la deuxième plus longue ». C'est pour ça que l'outil demande une **répartition**.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.** Un script Node jetable qui
vérifie les cinq contraintes coûte moins cher qu'une reprise.

### (2) LA PLUS DÉTAILLÉE — 82,2 %, rendement **100 %**

La bonne réponse ne doit pas être la seule à donner un exemple, un nom de fonction, une valeur, un
type. **Fais porter du concret à tes distracteurs** — du concret qui dit quelque chose de **faux**.
C'est, avec la longueur, l'indice le plus payant du cours : il ne s'est jamais trompé.

### (3) LA PARENTHÈSE ET LE POINT-VIRGULE — rendement **100 %** tous les deux

- `l'incise entre parenthèses` : **70,5 %**, rendement **100 %**, **44 questions** où la bonne
  réponse est SEULE en tête. `node tools/plan-rangs-qcm.js c --incise` donne la liste.
  Formulation exacte de la règle, apprise sur `java` : **autant d'incises que la bonne réponse** —
  et non « pas la seule à en porter » (cette formulation molle laissait l'indice à 39,9 %).
- `la seule avec un point-virgule` : **59,9 %**, rendement **100 %** sur 46,5 % des questions.
  Règle : **les quatre options le portent, ou aucune.** Corriger est bon marché — tu **ajoutes**
  un `;` dans des distracteurs (la bonne réponse est intouchable).
- `RESTREINDRE aux deux-points` : **48,9 %**, rendement **100 %**. Même règle.
- Densité globale : la bonne réponse est **la seule la plus ponctuée 53 fois sur 71 (74,6 %)**.
  `--ponctuation` donne le détail.

⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — c'est le plafond trouvé sur
`data-eng` : il reste **50 %** à l'apprenant qui **RESTREINT** son tirage aux options marquées.
**Par marque : ou les quatre options la portent, ou aucune.**

### (4) LE MOT TECHNIQUE EXCLUSIF — 72,3 %, rendement 86,5 %

Le vocabulaire du C (`pointeur`, `déréférencer`, `malloc`, `free`, `stack`, `tas`, `segfault`,
`prototype`, `struct`, `union`, `typedef`, `static`, `const`, `volatile`, `préprocesseur`,
`édition de liens`, `débordement`, `alignement`, `padding`, `arithmétique de pointeurs`, `UB`…) ne
doit pas n'apparaître que dans la bonne réponse : **au moins deux distracteurs emploient du
vocabulaire du même registre**, en disant quelque chose de faux.

⚠️ Cet indice **MONTE** quand on écrit du français naturel avec le vocabulaire du cours (mesuré
sur `mobile` : 25,0 % → 42,5 %). Surveille-le après écriture.

### (5) L'INDICE LEXICAL — 56 questions EXPLOITABLES sur 71

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.
**59 questions** sont à mettre en forme.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0`
- `k > 0` → `k / k / k`

Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (variante INVERSE, mesurée à
**100 %** sur `mobile`). Et l'ancienne règle `0 / 0 / k` laisse **exactement 50 %** à qui restreint
son tirage aux deux options les plus étrangères. **Seule l'égalité des quatre ferme les deux
lectures.**

**RÈGLE DU `w`** (trouvée sur `ocaml`) : à `k` égal, la part de mots présents `(w - k) / w` **croît
avec `w`**, le nombre de mots longs. Donc si la bonne réponse porte à elle seule le plus de mots
longs, elle reste désignée **avec des `k` parfaitement égaux**. Ou les quatre options portent le
même nombre de mots longs, ou **au moins un distracteur en porte strictement plus** que la bonne
réponse. (Sans objet quand `k = 0`.)

Outil : `node tools/mesure-lexique-qcm.js --liste=c` — il liste les questions non conformes,
option par option, avec les mots fautifs.

### (6) LA MOINS BAVARDE, À L'ENVERS — `ECARTER la moins bavarde` : 47,5 %, rendement **100 %**

Sur 14,1 % des questions, il suffit d'**écarter** l'option la plus courte pour gagner. Ne laisse
pas un distracteur nettement plus maigre que les trois autres options : la fenêtre de longueur du
plan te le règle si tu la respectes vraiment.

### (7) L'ÉCHO DE L'ÉNONCÉ — 57,6 %, rendement 84,2 %

La bonne réponse ne doit pas être la seule à reprendre les mots de la question : fais-les reprendre
par **UN seul** distracteur. ⚠️ **Pas par les trois** : sur `data-eng` l'écho s'est RETOURNÉ
(40,8 % → 11,3 %) et « écarter l'option la plus écho » a rendu **30,4 %**. Cette règle inverse est
**dans le cliquet** : un lot qui met l'écho à zéro partout fera échouer la chaîne.

### (8) LES MARQUES — `node tools/plan-rangs-qcm.js c --marques`

- **point interne** (option écrite en deux phrases) : la bonne réponse est SEULE à le porter
  **9 fois**. Rendement **100 %**. C'est l'indice le plus fort du site (99,0 % sur 308 questions).
  Si la bonne réponse est en deux phrases, **écris tes trois distracteurs en deux phrases** —
  c'est aussi la façon la plus naturelle d'atteindre la fenêtre de longueur.
- **guillemets** : bonne réponse seule **3 fois**, rendement **100 %**.
- **flèche** : **1 question ÉCARTABLE** (deux distracteurs portent la flèche, pas la bonne
  réponse) — donc dans les DEUX sens : ni « la seule marquée », ni « la seule non marquée ».

Cible : **les quatre ou aucune.**

### (9) Les indices mineurs à ne pas RECRÉER

- **La négation** (36,5 % ici) : n'écris pas la négation uniquement dans la bonne réponse, ni des
  distracteurs tous positifs quand la bonne réponse nie.
- **La plus prudente** (33,5 %, rendement 75,0 %) : ne réserve pas la nuance (« souvent », « en
  général », « selon l'implémentation ») à la bonne réponse, et n'accumule pas les absolus
  (« toujours », « jamais », « aucun ») dans les seuls distracteurs.
- **L'attaque unique** : ne fais pas commencer tous tes distracteurs par le même mot. Un
  **connecteur causal** répété (« Parce que… ») est un tic que nos vagues d'écriture ont déjà
  fabriqué sur `nodejs` (1/7 → 9/9).
- **La casse** : ne fais pas commencer les distracteurs par une minuscule quand la bonne réponse
  commence par une majuscule, ni l'inverse. ⚠️ `mesure-lexique-qcm` met en minuscules avant de
  comparer, donc **la casse n'est mesurée par rien** de ce côté — c'est à toi de la tenir.
- **Le point final** : ne termine pas tout ton lot par le même signe. Sur `react`, le point final
  valait **100 % sur le lot** d'un seul écrivain.
- **La MAJUSCULE d'emphase** (62,5 % de rendement ici) : pas de mot en capitales exclusif à la
  bonne réponse.

## Méthode

1. **Lis tes leçons en entier** (corps + QCM) : un distracteur ne peut pas être écrit sans le
   contenu enseigné, et l'indice lexical se calcule sur le texte de la page.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js c --json` puis filtre sur tes fichiers ;
   idem `--incise`, `--ponctuation`, `--marques`, et `node tools/mesure-lexique-qcm.js --liste=c`.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères, les marques, la ponctuation et les mots de 6 lettres et plus absents de la page.
4. **Écris avec un script Node** qui relit le bloc `data-quiz`, remplace les seules options
   fausses et réécrit le fichier. **N'écris pas le JSON à la main.** Après chaque fichier, vérifie
   que le bloc se reparse (`JSON.parse`).
5. Après écriture, relance `plan-rangs-qcm c` (tes questions au rang cible), `--incise`,
   `--ponctuation`, `--marques`, `mesure-lexique-qcm --liste=c` et `node tools/verif-html.js`.
6. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, **et la liste
   de ce que tu n'as pas pu tenir avec la raison**. ⚠️ Sur `mobile`, c'est cette dernière section
   qui a révélé le retournement de l'indice lexical : **elle rapporte plus que la consigne**.

## Trois interdits absolus

⚠️ **UN DISTRACTEUR NE DOIT JAMAIS DEVENIR VRAI.** C'est la faute la plus grave possible : elle
crée une question à deux bonnes réponses, et l'apprenant qui comprend est puni. Chaque option que
tu écris doit être **fausse au regard du C réel (norme C99/C11)**, et fausse **franchement** — pas
« fausse par une nuance ». Méfie-toi des reformulations qui décrivent, sans le vouloir, un
comportement qui existe. En C, les pièges classiques sont le **comportement indéfini** (affirmer
« ça plante » est souvent FAUX : c'est *indéfini*, pas *garanti*), la **promotion des entiers**, le
**comportement défini par l'implémentation** (taille de `int`, signe de `char`), et les **cas où
les deux formes marchent** (`*p` et `p[0]` sont identiques par définition, `&tab[0]` et `tab` aussi
dans une expression).

⚠️ **NE MODIFIE RIEN D'AUTRE** : ni la question, ni `correct`, ni `explain`, ni le texte de la
bonne réponse, ni le corps de la leçon, ni un autre fichier que ceux de ton lot. Deux agents qui
écrivent dans le même fichier se détruisent mutuellement. **Ne fais aucun `git` — aucun `add`,
aucun `commit`, aucun `stash`, aucun `checkout`.**

⚠️ **AUCUN COMPILATEUR C N'EST INSTALLÉ SUR CETTE MACHINE** (`gcc`, `cc`, `clang`, `tcc`, MSVC :
introuvables, vérifié le 2026-09-08). Tu ne peux donc pas exécuter un extrait pour trancher.
**N'invente aucune sortie.** Si tu veux écrire un distracteur qui cite une valeur produite par du
code, raisonne **par la norme du langage**, pas de mémoire. En cas de doute, choisis un distracteur
qui porte sur un **mécanisme** plutôt que sur une **valeur**.

⚠️ **Si le corps d'une leçon de ton lot est faux** (une sortie annoncée que le langage ne produit
pas, un contresens), **signale-le dans ton compte rendu** — mais **ne le corrige pas** : modifier
le corps change le vocabulaire de la page et donc le calcul de l'indice lexical de tout le lot.
