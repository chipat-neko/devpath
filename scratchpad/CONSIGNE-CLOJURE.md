# Consigne d'écriture — les QCM du cours `clojure` (B4, 43ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `clojure` (REPL et S-expressions,
fonctions et liaisons, collections, séquences et ordre supérieur, immuabilité et structures
persistantes, concurrence et état, macros et interop JVM, écosystème, protocols et records,
core.async, clojure.spec, clojure.test et test.check, transducteurs, données imbriquées, gestion des
erreurs, projet de synthèse).

La question (`q`), l'index `correct`, l'explication (`explain`) et **le texte de la bonne réponse**
sont **INTOUCHABLES** : `node tools/mesure-qcm-intouchable.js clojure <ref-git>` le contrôle et
signalera toute atteinte. **Tu ne touches qu'aux trois options fausses.**

**66 questions sur 17 leçons, 198 distracteurs** — dont **10 questions en QCM bilan** dans
`lecon-17.html`, qui porte donc **14 questions** (4 de leçon + 10 de bilan). Les leçons 13 à 16
portent **4** questions, les leçons 01 à 12 en portent **3**.

---

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **89,4 %** des QCM de `clojure` en cochant
l'option la plus longue — **couverture 100 %**. Ce n'est pas le seul indice :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **89,4 %** | **100 %** | 89,4 % |
| la plus détaillée | **59,2 %** | 45,5 % | 93,3 % |
| le mot technique exclusif | **52,0 %** | 51,5 % | 76,5 % |
| RESTREINDRE à la ponctuation forte | **51,1 %** | 39,4 % | 88,5 % |
| l'incise entre parenthèses | **50,8 %** | 34,8 % | **100 %** |
| RESTREINDRE à la parenthèse | **47,9 %** | 30,3 % | **100 %** |
| RESTREINDRE aux deux-points | **42,4 %** | 28,8 % | 84,2 % |
| la seule qui nie | 33,1 % | 30,3 % | 50,0 % |
| l'écho de la question | 33,0 % | 16,7 % | 63,6 % |
| RESTREINDRE au point-virgule | 32,2 % | 9,1 % | **100 %** |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## ⚠️ CE QUI REND CE COURS-CI PARTICULIER — à lire avant la liste des indices

### (a) **AUCUNE TOOLCHAIN CLOJURE, ET PAS MÊME DE JVM** — mesuré, pas supposé

`clojure`, `clj`, `lein`, `babashka` **et `java`** : aucun n'est dans le `PATH` (vérifié le
2026-09-22). La règle fondatrice du chantier — « ne jamais affirmer un comportement de tête, le
faire tourner » — **n'est pas applicable ici par exécution**, comme aux 39ᵉ (`scala`) et 42ᵉ
(`haskell`) cours. Ce que cela impose :

> **LA SOURCE DE VÉRITÉ EST LE CORPS DE LA LEÇON, PAS TA MÉMOIRE.**
> Avant d'écrire un distracteur, **lis la page** et ancre-le sur ce que la leçon affirme. Si tu
> veux dire qu'une option est fausse, tu dois pouvoir **citer la phrase ou le bloc de code de la
> page** qui l'établit.

**Ne fabrique pas de distracteur qui repose sur un détail que la page ne tranche pas** (l'arité
exacte d'une fonction non citée, une sortie numérique non publiée, un message d'erreur de la JVM).
Préfère les erreurs **structurelles**, celles qu'un débutant commet vraiment et que la leçon corrige
explicitement. Si tu trouves dans la page une affirmation que tu crois fausse, **remonte-la à
l'orchestrateur avec la citation** — ne la recopie pas dans un distracteur.

### (b) Le travail est de l'**ALLONGEMENT**, mais moins violent qu'au 42ᵉ

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **77,2 caractères** (max 212) |
| longueur moyenne d'un distracteur | **25,5 caractères** (min **2**) |
| rapport | **3,02** |
| rapport du 42ᵉ cours (`haskell`) | 5,06 |
| rapport du 41ᵉ (`pandas`) | 2,85 |
| médiane du même rapport sur les **42 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js clojure` demande **8 538 caractères** répartis sur **64 questions sur
66** — **la moitié** du lot de `haskell` (17 138). Options hors de la bande 70-130 % : **174 sur
198**. Fourchette actuelle **0,03 à 3,00** : attention, certains distracteurs sont **trois fois plus
longs** que leur bonne réponse — pour ceux-là il faut **RACCOURCIR**, pas allonger. Lis la colonne
de `plan-rangs-qcm`, elle dit `ALLONGER` ou `RACCOURCIR` option par option.

### (c) LA FORME DU DÉFAUT EST UNIFORME, ET C'EST UNE CHANCE

Comme aux cours précédents, la bonne réponse est **« la réponse + sa justification »** et les
distracteurs sont des **télégrammes nus**. **LE REMÈDE EST TOUJOURS LE MÊME : donne au distracteur
la MÊME STRUCTURE que la bonne réponse — la réponse fausse, PUIS sa justification fausse mais
cohérente.** Pas du remplissage : une justification qu'un apprenant qui s'est trompé donnerait
vraiment.

---

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.**

Au 39ᵉ cours (`scala`), la relecture adversariale a rendu **54 prises, dont 30 de ce seul type** :
pour atteindre la fenêtre de longueur, les écrivains avaient remélangé le vocabulaire de la bonne
réponse jusqu'au bon compte de caractères, et le résultat ne voulait **rien dire**. Le biais de
longueur avait été fermé et remplacé par un **biais de cohérence sémantique, qui se mesure
exactement au même endroit. Aucun des 45 outils ne le voit.**

**Relis chaque distracteur à voix haute.** Un bon distracteur est **une erreur que quelqu'un
pourrait vraiment commettre**. En Clojure elles sont nombreuses, connues, et faciles à rendre
plausibles sur 70 à 130 caractères :

- croire que `(def x 1)` puis `(def x 2)` est une mutation, ou qu'`atom` sert à « rendre une
  variable modifiable » comme ailleurs ;
- croire qu'une structure persistante **recopie** la collection à chaque modification ;
- confondre `list`, `vector`, `map` et `set` sur l'ordre, l'accès et la complexité ;
- confondre `map`/`filter`/`reduce` avec leurs équivalents impératifs, ou croire que `map` est
  strict ;
- croire qu'une séquence paresseuse a déjà tout calculé, ou qu'elle recalcule à chaque parcours ;
- croire qu'une macro est une fonction qui s'exécute plus vite, plutôt qu'un code qui s'exécute
  **avant** l'évaluation et reçoit du **code** ;
- confondre `atom`, `ref`, `agent` et `var` ; croire que `swap!` prend un verrou ;
- croire qu'un canal `core.async` est un thread, ou que `go` crée un thread système ;
- croire que `clojure.spec` valide **à la compilation**, ou qu'il remplace le système de types ;
- croire qu'un transducteur est « un `map` plus rapide » plutôt qu'une transformation **découplée de
  la source** ;
- confondre `assoc-in`/`update-in`/`get-in`, ou croire qu'ils mutent la map d'origine ;
- croire qu'un `protocol` est une classe avec héritage, ou qu'un `record` est une map mutable ;
- croire que `try/catch` de Clojure ignore les exceptions de la JVM, ou que `ex-info` lève tout seul.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **89,4 %, couverture 100 %**

`node tools/plan-rangs-qcm.js clojure` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. Rangs actuels **59 / 6 / 1 / 0** ; l'outil vise **17 / 17 / 16 / 16**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang. Le sens INVERSE le dit **déjà** ici : « la TROISIÈME plus longue » rend **31,1 %**
en global inverse et « la DEUXIÈME » **30,8 %**, parce que la bonne réponse n'est **jamais** à ces
rangs-là.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

⚠️⚠️ **UN DISTRACTEUR NE DOIT JAMAIS FAIRE EXACTEMENT LA LONGUEUR DE LA BONNE RÉPONSE** :
`plan-rangs-qcm` teste `plusLong = len > bon`, donc à `len === bon` l'option est classée « plus
courte » et sa fenêtre s'arrête à `bon − 1` — hors bande d'un seul caractère.

⚠️⚠️ **NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX.** La cible est **17/17/16/16 sur le cours
entier** : la bonne réponse est volontairement la plus courte sur 16 questions. Sur `typescript`,
**quatre relecteurs sur cinq** ont signalé « l'indice de longueur est rouvert ici » — les quatre
avaient tort. **Un lot de 9 à 12 questions ne peut pas afficher 25 %.**

### (2) ⚠️⚠️ LE NOMBRE DE MOTS DOIT SUIVRE LE RANG DE LONGUEUR — mesuré au 42ᵉ

`la moins bavarde (peu de mots)` : **DIRECTE 0,0 % sur 43 questions**, soit **30,4 % au global
inverse**. Une DIRECTE à zéro sur une large couverture est une **élimination sûre**. Règle
appliquée avec succès au 42ᵉ : **le rang en MOTS de la bonne réponse = son rang en CARACTÈRES.**
Allonger un distracteur avec des mots longs le rend plus long *et* moins bavard — ce qui ferme la
longueur et ouvre celle-ci.

### (3) LA PLUS DÉTAILLÉE — 59,2 %, couverture 45,5 %, rendement 93,3 %

La bonne réponse est presque toujours la seule à porter un nom de fonction, une arité, un exemple
chiffré. **Fais porter du concret FAUX à tes distracteurs** : une fonction qui existe employée pour
la mauvaise chose (`conj` présenté comme ajoutant toujours en fin), une complexité plausible mais
fausse, un opérateur réel avec un effet inventé. **La stratégie compte les `, : ;` — égalise ce
compte sur les quatre options.**

### (4) LA PONCTUATION, ET SURTOUT SON UNION

| marque | bonnes réponses qui la portent | distracteurs | questions où **une seule** option la porte | dont c'est **la bonne** |
|---|---:|---:|---:|---:|
| parenthèse | 27 / 66 | 21 / 198 | 21 | **20 (95,2 %)** |
| virgule | 30 | 11 | 25 | **22 (88,0 %)** |
| deux-points | 18 | 7 | 19 | **16 (84,2 %)** |
| point-virgule | 7 | 1 | 6 | **6 (100 %)** |
| tiret | 5 | 1 | 4 | **4 (100 %)** |
| **UNION ponctuation forte** | 27 | 9 | **26** | **23 (88,5 %)** |
| guillemets | 2 | 1 | 1 | 1 (100 %) |
| flèche | 2 | 0 | 2 | 2 (100 %) |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'union.**
⚠️ En Clojure la parenthèse est presque toujours **du code** (`(map inc coll)`), pas une incise :
l'outil ne fait pas la différence, il **compte le caractère**. Tu dois équilibrer le CARACTÈRE.
⚠️ **L'INCISE SE COMPTE, ELLE NE SE TESTE PAS** — la leçon du 42ᵉ. `l'incise entre parenthèses` est
un `argMax` sur le **NOMBRE** d'incises de 4 signes et plus : un **2/1/1/1** est vert pour qui
regarde « toutes les options en portent une » et rend **100 %** à qui compte. Cible : **n/n/n/n**.
⚠️ **NE POSE PAS TES INCISES EN FIN DE DISTRACTEUR.** Au 42ᵉ, cela a fait passer « écarter la glose
finale » de 24,9 % à 28,9 %, et la fermer en *supprimant* une incise rouvrait l'indice précédent :
il a fallu les **déplacer** à compte constant. **Répartis-les dès le premier jet.**

### (5) LE MOT TECHNIQUE EXCLUSIF — 52,0 %, couverture 51,5 %

La bonne réponse ne doit pas être la seule à employer un mot long qu'aucune autre n'emploie.
⚠️⚠️ **NE LE FERME PAS À FOND. Vise l'égalité, pas zéro.** Mesuré au 39ᵉ : l'écraser l'a fait tomber
à 13,3 % en direct, ce qui a porté sa lecture INVERSE à 28,9 %. Au 41ᵉ (`pandas`) le lot l'a mis à
**0,0 % en direct**, c'est-à-dire une **élimination sûre** à 33,3 %. Au 42ᵉ il a fallu une vague
entière pour ramener les comptes à `n/n/n/n`.
⚠️ Le piège dans le piège : le mot que tu écris **pour remplacer** un mot exclusif peut être exclusif
à son tour. La stratégie compte les mots de **9 lettres et plus** : `persistante`, `immuabilité`,
`transducteur`, `polymorphisme`, `concurrence`, `séquence`, `collection`, `déstructuration` en font
partie.

### (6) L'ÉCHO DE L'ÉNONCÉ — 33,0 %, couverture 16,7 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité.

### (7) L'INDICE LEXICAL — **53 questions EXPLOITABLES sur 66**, et **58 sur 66 à mettre en forme**

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
--liste=clojure` — il imprime, pour **chaque question**, le `k` visé, le `w` et les mots en cause.
Cible : **0 exploitable ET 0 à mettre en forme**.

⚠️ **LA CONTRAINTE À QUATRE CONDITIONS.** Un mot de remplacement doit satisfaire **quatre** règles à
la fois : **moins de 9 lettres** (sinon il redevient le mot technique exclusif), **au moins 6
lettres** (sinon le `w` tombe et PROPORTION se rouvre), **présent dans la page** (sinon il est
étranger et casse le `k`), et **absent de l'énoncé** (sinon il fabrique l'écho). **Trois sur quatre
ne suffit pas.**

⚠️ **PIÈGE DE COMPTAGE** : `mesure-lexique-qcm` capte les mots de 6 signes et plus, et **une
apostrophe compte comme un signe**. En Clojure le risque est maximal avec les identifiants à tiret,
les mots-clés `:comme-ceci` et les points d'exclamation (`swap!`, `conj!`) : **écris les
identifiants exactement comme la page les écrit**.

### (8) LE MOT FÉTICHE — **2 alertes**

`node tools/mesure-mot-fetiche.js clojure` :

| mot | bonnes / distracteurs | questions tranchées | RESTREINDRE |
|---|---:|---:|---:|
| `valeur` | 9 / 5 | 9 | **33,0 %** |
| `données` | 8 / 7 | 12 | **30,8 %** |

⚠️ On ne peut pas retirer « valeur » ou « données » d'un QCM Clojure. **La règle est celle des
marques : par mot, les quatre options le portent, ou aucune** — et quand c'est la BONNE réponse qui
le porte (elle est intouchable), on l'**AJOUTE** aux distracteurs. Le retirer d'eux laisserait la
bonne réponse seule à le porter et **retournerait l'indice à 100 %**.
⚠️ **SINGULIER/PLURIEL** : `valeur` et `valeurs` sont **deux jetons différents** pour l'outil.
Ajouter « donnée » quand la bonne réponse porte « données » ouvre une configuration 3/4 en laissant
les deux outils verts — c'est arrivé au 39ᵉ.

### (9) L'INTRUS LEXICAL — **4 questions tranchées à coup sûr**

`node tools/mesure-mot-question.js clojure --liste`. Lecture **PAR EXCÈS 29,0 %** (2 sûres), lecture
**PAR DÉFAUT 25,3 % en inverse** (2 sûres). Les quatre questions :

| leçon | lecture | mots en cause |
|---|---|---|
| `lecon-06` | DÉFAUT | `parce` |
| `lecon-08` | EXCÈS | `syntaxe`, `classe`, `methode` |
| `lecon-15` | DÉFAUT | `parce` |
| `lecon-17` | EXCÈS | `notation`, `préfixe` |

Règle : **par mot, les quatre options le portent, ou aucune**, appliquée **question par question**.
⚠️ **`mesure-mot-fetiche` NE LE VOIT PAS** (il exige qu'un mot tranche ≥ 8 questions) : lance les
deux. **Lis la colonne « sûres », pas la colonne « taux ».**
⚠️ **LA SEULE MANŒUVRE SÛRE EST L'AJOUT, PAS LE RETRAIT**, et **ne crée pas un 3/4 dont l'intrus
serait la bonne réponse** : elle est intouchable, donc l'indice deviendrait irrattrapable.
⚠️ Le mot `parce` tranche **19 bonnes réponses contre 3 distracteurs** sur le cours : c'est la
formule « Parce que… » des bonnes réponses. Si la bonne réponse commence par « Parce que », **les
trois distracteurs doivent commencer pareil.**

### (10) LE SENS INVERSE — déjà **3 alertes AVANT ton passage**

`node tools/mesure-biais-inverse.js --toutes clojure` :

| stratégie | tranche | DIRECTE | INVERSE | GLOBAL |
|---|---:|---:|---:|---:|
| la moins bavarde (peu de mots) | 43 | **0,0 %** | 33,3 % | **30,4 %** |
| la TROISIÈME plus longue | 52 | 1,9 % | 32,7 % | **31,1 %** |
| la DEUXIÈME plus longue | 54 | 3,7 % | 32,1 % | **30,8 %** |

Ces trois alertes sont la conséquence directe du rapport 3,02 — elles se refermeront **si et
seulement si** tu tiens les fenêtres de `plan-rangs-qcm` **et** la règle (2) sur le nombre de mots.
**Ne les traite pas séparément : elles sont la longueur vue de dos.**

### (11) Les marques à ne pas ouvrir

**barre oblique**, **guillemets** (1 question, 1/1), **flèche** (2 questions, 2/2), **virgule
décimale**, **point interne / deux phrases**, **nom d'outil ou de bibliothèque** (`Leiningen`,
`deps.edn`, `Clojars`, `nREPL`, `Calva`) : sur `dataviz`, **0 bonne réponse sur 68** en portait
contre 17 distracteurs — la règle « écarter l'option qui nomme un outil » n'avait **jamais** tort.
Et **« la seule qui nie »** est déjà à 33,1 % sur 30,3 % des questions : égalise la négation.

---

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
   ⚠️ **SAUF si elle est FAUSSE** : au 40ᵉ cours (`crypto`), une bonne réponse annonçait un chiffre
   que le programme de sa propre leçon contredit ; au 42ᵉ (`haskell`), **trois figures et blocs de
   sortie** se contredisaient eux-mêmes. **Si tu trouves une erreur dans l'intouchable, ne la
   recopie pas dans un distracteur : remonte-la à l'orchestrateur avec la citation de la page qui le
   prouve.** Aucun des 45 vérificateurs ne lit ces énoncés-là.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire — et le **rang en mots**
   aligné sur le rang en caractères.
3. **Par marque : les quatre options, ou aucune** — ponctuation (et leur UNION, et le **compte** des
   incises), mots fétiches, ET mots d'une seule question (l'intrus lexical).
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en Clojure** — et **tu ne peux pas l'exécuter** (voir (a)) : ancre-le
   sur le corps de la leçon. Le coût mesuré d'un distracteur devenu vrai est de **1,68 réécriture**.
   ⚠️ Une phrase peut être vraie **dans un autre contexte** : « une séquence paresseuse peut être
   infinie » est vrai ; « `conj` ajoute en tête » est vrai **pour une liste** et faux pour un
   vecteur. Demande-toi toujours : *existe-t-il une lecture où cette phrase est exacte ?*
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS** — voir en tête de cette consigne.

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=clojure           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes clojure     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=clojure        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js clojure                # 0 alerte
node tools/mesure-mot-question.js clojure --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js clojure              # rangs, cible 17/17/16/16
node tools/mesure-qcm-intouchable.js clojure <ref>      # 0 atteinte
node tools/plan-rangs-qcm.js clojure                    # ce qu'il reste a ecrire
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**

---

## ⚠️ Ce que les passes 39 à 42 ont appris sur la MÉTHODE, et qui vaut pour toi

1. **La contradiction adversariale doit elle-même être contredite.** Un remède proposé n'est pas un
   ordre : évalue-le, et si tu le rejettes, écris la preuve.
2. **Fermer un indice en rouvre un autre — trois fois de suite au 42ᵉ cours.** Longueur → incise →
   glose finale, et le remède évident de la troisième rouvrait la première. **Après chaque retouche,
   rejoue TOUTES les mesures**, pas seulement celle que tu visais.
3. **Un relecteur qui mesure sur SON LOT extrapole faux.** Trois indices annoncés à 36-43 % sur un
   lot mesuraient 25-29 % sur le cours entier. **Toujours remesurer sur le corpus complet.**
4. **Corriger un CORPS de leçon rouvre l'indice lexical** : le dictionnaire de la page change, donc
   la règle du `k` des QCM de cette page peut sauter. Corrige le corps d'abord, le QCM ensuite.
5. **N'écris QUE dans les leçons de ton lot.** Un autre écrivain travaille en même temps sur les
   autres leçons du même cours ; deux agents qui touchent le même fichier se détruisent.
   **Ne fais AUCUN `git commit`, AUCUN `git add`, AUCUN `git stash`** — l'orchestrateur seul commite.
6. **Le JSON doit rester valide et le fichier sans BOM.** Après ton lot :
   `node -e "…JSON.parse…"` sur chaque bloc que tu as touché, et `node tools/verif-html.js`.
7. **Un script lancé via `node -e '…'` en quotes simples se fait manger un niveau de backslash par
   l'outil Bash** : `(?<![\p{L}])` devient `(?<![p{L}])` et la mesure ment. **Écris le script dans un
   fichier avant de le lancer.**
