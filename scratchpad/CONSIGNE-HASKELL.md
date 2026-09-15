# Consigne d'écriture — les QCM du cours `haskell` (B4, 42ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `haskell` (GHCi, types et pureté,
listes et récursion, ordre supérieur, types algébriques, classes de types, foncteurs/applicatives,
monades, IO, paresse, modules et tests, State, écosystème, Monoid/Foldable/Traversable,
transformers, combinateurs d'analyseurs, concurrence, projet de synthèse).

La question (`q`), l'index `correct`, l'explication (`explain`) et **le texte de la bonne réponse**
sont **INTOUCHABLES** : `node tools/mesure-qcm-intouchable.js haskell <ref-git>` le contrôle et
signalera toute atteinte. **Tu ne touches qu'aux trois options fausses.**

**66 questions sur 18 leçons, 198 distracteurs** — dont **12 questions en QCM bilan** dans
`lecon-18.html`, qui porte donc **15 questions** (3 de leçon + 12 de bilan).

---

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **92,4 %** des QCM de `haskell` en cochant
l'option la plus longue — **couverture 100 %**, rendement 92,4 %. Ce n'est pas le seul indice :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **92,4 %** | **100 %** | 92,4 % |
| la plus détaillée | **89,1 %** | 84,8 % | **100 %** |
| RESTREINDRE à la ponctuation forte | **81,2 %** | 72,7 % | **100 %** |
| RESTREINDRE à la parenthèse | **79,0 %** | 71,2 % | **100 %** |
| l'incise entre parenthèses | 78,8 % | 71,2 % | **100 %** |
| le mot technique exclusif | 72,2 % | 65,2 % | 93,0 % |
| RESTREINDRE aux deux-points | 61,9 % | 47,0 % | **100 %** |
| l'écho de la question | 60,7 % | 53,0 % | 88,6 % |
| la seule avec un point-virgule | 60,2 % | 47,0 % | **100 %** |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## ⚠️ CE QUI REND CE COURS-CI PARTICULIER — à lire avant la liste des indices

### (a) **AUCUNE TOOLCHAIN HASKELL SUR LA MACHINE** — mesuré, pas supposé

`ghc`, `ghci`, `runghc`, `runhaskell`, `stack` : **aucun n'est dans le `PATH`** (vérifié le
2026-09-15). La règle fondatrice du chantier — « ne jamais affirmer un comportement de tête, le
faire tourner » — **n'est pas applicable ici par exécution**, comme au 39ᵉ cours (`scala`). Ce que
cela impose, et c'est une contrainte forte :

> **LA SOURCE DE VÉRITÉ EST LE CORPS DE LA LEÇON, PAS TA MÉMOIRE.**
> Avant d'écrire un distracteur, **lis la page** et ancre-le sur ce que la leçon affirme. Si tu
> veux dire qu'une option est fausse, tu dois pouvoir **citer la phrase ou le bloc de code de la
> page** qui l'établit.

**Ne fabrique pas de distracteur qui repose sur un détail que la page ne tranche pas** (le nom exact
d'une fonction d'une bibliothèque non citée, une sortie numérique non publiée, un message d'erreur
GHC). Préfère les erreurs **structurelles**, celles qu'un débutant commet vraiment et que la leçon
corrige explicitement. Et si tu trouves dans la page une affirmation que tu crois fausse,
**remonte-la à l'orchestrateur avec la citation** — ne la recopie pas dans un distracteur.

### (b) Le travail est **presque entièrement de l'ALLONGEMENT**, et à un degré jamais vu ici

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **128,2 caractères** (max 208) |
| longueur moyenne d'un distracteur | **25,3 caractères** (min **1**) |
| rapport | **5,06** |
| médiane du même rapport sur les **41 cours déjà traités** | ~1,0 |
| rapport du 41ᵉ cours (`pandas`), déjà jugé extrême | 2,85 |

`node tools/plan-rangs-qcm.js haskell` demande **17 138 caractères** répartis sur **63 questions sur
66** — **1,4 fois** le lot de `pandas` (12 457), **3,3 fois** celui de `crypto` (5 255).
**C'est le plus gros lot d'écriture du chantier.**

### (c) LA FORME DU DÉFAUT EST UNIFORME, ET C'EST UNE CHANCE

Sur presque toutes les questions, la bonne réponse est **« la réponse + sa justification »** et les
distracteurs sont des **télégrammes nus**. Quatre exemples réels :

```
lecon-07 q3 — « Que vaut (+) <$> Just 3 <*> Nothing, et pourquoi ? »
  * Nothing : dès qu'un opérande est Nothing, le calcul applicatif propage l'absence…  (107 car.)
    Just 3 (6)      3 (1)      Une erreur (10)

lecon-16 q1 — « Quelle est la signature, sous l'emballage newtype, de notre Parser a ? »
  * String -> Maybe (a, String) : il consomme le début de l'entrée et rend soit (valeur, reste)…  (120)
    String -> a (11)      a -> String (11)      IO a (4)

lecon-12 q1 — « Quelle fonction récupère uniquement l'état final d'un calcul State ? »
  * execState (qui renvoie l'état final) ; evalState renvoie la valeur, runState le couple…  (109)
    evalState (9)      runState seulement (18)      getState (8)

lecon-18 q7 — « Comment est le système de types ? »
  * Statique avec inférence (23)
    Dynamique (9)      Inexistant (10)      Typage canard (13)
```

**LE REMÈDE EST DONC TOUJOURS LE MÊME : donne au distracteur la MÊME STRUCTURE que la bonne
réponse — la réponse fausse, PUIS sa justification fausse mais cohérente.** Pas du remplissage : une
justification qu'un apprenant qui s'est trompé donnerait vraiment.

Exemple de ce qu'on attend (sur `lecon-07` q3, à titre d'illustration — écris les tiens) :

> `Just 3 : l'applicative retient le seul opérande présent et laisse tomber Nothing, comme le ferait
> une somme qui ignore les absents` — 138 caractères, une **thèse fausse** (la confusion réelle
> entre `<*>` et une agrégation qui ignore les valeurs manquantes), pas une salade de mots.

---

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER — elle vaut TRIPLE ici

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.**

Au 39ᵉ cours (`scala`), la relecture adversariale a rendu **54 prises, dont 30 de ce seul type** :
pour atteindre la fenêtre de longueur, les écrivains avaient remélangé le vocabulaire de la bonne
réponse jusqu'au bon compte de caractères, et le résultat ne voulait **rien dire**. Sur quatre
questions, **deux options sur quatre** étaient dans ce cas — la bonne réponse devenait la seule
phrase signifiante, et un apprenant qui n'a jamais lu une ligne de code cochait juste **par
élimination du charabia**.

**Le biais de longueur avait été fermé et remplacé par un biais de cohérence sémantique, qui se
mesure exactement au même endroit. Aucun des 45 outils ne le voit.**

Ici le risque est maximal : il faut ajouter **en moyenne 91 caractères par distracteur** (17 138 /
189). **Relis chaque distracteur à voix haute.** Un bon distracteur est **une erreur que quelqu'un
pourrait vraiment commettre**. En Haskell, elles sont nombreuses, connues, et faciles à rendre
plausibles sur 100 à 160 caractères :

- croire que `=` est une affectation, donc que `x = x + 1` incrémente ;
- croire que la paresse **mémorise tout** ou au contraire qu'elle **recalcule à chaque usage** ;
- croire qu'un `foldl` sur une liste infinie termine, ou que `foldr` ne le peut jamais ;
- confondre `map` et `fmap`, `<$>` et `<*>`, `>>=` et `>>` ;
- croire que `IO` « sort » de la monade avec `<-` au niveau global, ou que `unsafePerformIO` est la
  manière normale de lire une valeur ;
- croire que `Maybe` et les exceptions sont la même chose, ou qu'un `Nothing` lève une erreur ;
- croire qu'une classe de types est une classe au sens objet, avec héritage et sous-typage ;
- croire que `newtype` crée une structure enveloppante coûteuse à l'exécution ;
- confondre `Semigroup` (`<>`) et `Monoid` (`mempty`), `Foldable` et `Traversable` ;
- croire qu'un transformer ajoute des effets **sans** changer le type de retour ;
- croire que `MVar` et `STM` diffèrent seulement par la syntaxe, ou qu'un thread Haskell est un
  thread système ;
- croire que le typage statique de Haskell exige d'écrire toutes les annotations.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **92,4 %, couverture 100 %**

`node tools/plan-rangs-qcm.js haskell` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. Rangs actuels **61 / 4 / 1 / 0** ; l'outil vise **17 / 17 / 16 / 16**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait 60,9 % à qui cochait
« la deuxième plus longue ». Le sens INVERSE le dit **déjà** ici : « la TROISIÈME plus longue » rend
**31,8 %** en global inverse et « la DEUXIÈME » **31,3 %** — parce que la bonne réponse n'est
**jamais** au rang 2 ni 3.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

⚠️⚠️ **UN DISTRACTEUR NE DOIT JAMAIS FAIRE EXACTEMENT LA LONGUEUR DE LA BONNE RÉPONSE** :
`plan-rangs-qcm` teste `plusLong = len > bon`, donc à `len === bon` l'option est classée « plus
courte » et sa fenêtre s'arrête à `bon − 1` — hors bande d'un seul caractère.

⚠️⚠️ **NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX.** La cible est **17/17/16/16 sur le cours
entier** : la bonne réponse est volontairement la plus courte sur 16 questions. Sur `typescript`,
**quatre relecteurs sur cinq** ont signalé « l'indice de longueur est rouvert ici » — les quatre
avaient tort. **Un lot de 9 à 12 questions ne peut pas afficher 25 %.**

### (2) LA PLUS DÉTAILLÉE — 89,1 %, couverture 84,8 %, **rendement 100 %**

**Elle ne se trompe JAMAIS sur ce cours.** La bonne réponse est presque toujours la seule à porter un
nom de fonction, une signature, un opérateur, un exemple chiffré. **Fais porter du concret FAUX à
tes distracteurs** : une fonction qui existe employée pour la mauvaise chose (`evalState` présenté
comme rendant l'état), une signature plausible mais fausse (`a -> String` pour un analyseur), un
opérateur réel avec un effet inventé (`<*>` présenté comme une composition).

### (3) LA PONCTUATION FORTE EN UNION — RESTREINDRE rend **81,2 %, rendement 100 %**

« : » **ou** « ; » **ou** tiret, comptés **ensemble** — c'est la leçon du 35ᵉ cours (`dataviz`).
Mesuré ici, et le chiffre est brutal :

| marque | bonnes réponses qui la portent | distracteurs | questions où **une seule** option la porte | dont c'est **la bonne** |
|---|---:|---:|---:|---:|
| parenthèse | 52 / 66 | 11 / 198 | 47 | **47 (100 %)** |
| deux-points | 37 | 9 | 31 | **31 (100 %)** |
| point-virgule | 33 | 4 | 31 | **31 (100 %)** |
| virgule | 48 | 15 | 40 | **39 (97,5 %)** |
| MAJUSCULE d'emphase | 18 | 8 | 15 | 13 (86,7 %) |
| **UNION ponctuation forte** | — | — | **48** | **48 (100 %)** |

**Sur 48 questions, l'apprenant qui coche l'option seule à porter « : », « ; » ou un tiret a raison
48 fois sur 48.** C'est l'indice le plus facile à fermer, et le plus rentable après la longueur.

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'union.**
⚠️ La **virgule simple** est dans le tableau : 39/40. Ne l'oublie pas.
⚠️ La MAJUSCULE d'emphase se **compte**, elle ne se teste pas : écrire `IO` deux fois quand les
autres options l'écrivent une fois suffit à trancher.

### (4) L'INCISE ENTRE PARENTHÈSES — 78,8 %, couverture 71,2 %, **rendement 100 %**

C'est la ligne « parenthèse » ci-dessus : **52 bonnes réponses sur 66** en portent une, contre **11
distracteurs sur 198**. ⚠️ Attention : en Haskell, une parenthèse peut être **du code**
(`(+) <$> Just 3`, `(valeur, reste)`) et pas une incise — l'outil ne fait pas la différence, il
compte le caractère. **Tu dois donc équilibrer le CARACTÈRE, quelle que soit sa nature.**

### (5) LE MOT TECHNIQUE EXCLUSIF — 72,2 %, couverture 65,2 %

La bonne réponse ne doit pas être la seule à employer un mot long qu'aucune autre n'emploie.
⚠️⚠️ **NE LE FERME PAS À FOND.** Mesuré au 39ᵉ cours : l'écraser l'a fait tomber à 13,3 % en direct,
ce qui a porté sa lecture INVERSE à 28,9 %. **Au 41ᵉ (`pandas`), le lot d'écriture l'a mis à 0,0 %
en direct sur 15 questions — c'est-à-dire une ÉLIMINATION SÛRE, et 33,3 % (le plafond théorique) à
qui l'écarte.** **Vise l'égalité, pas zéro.** Ici la lecture inverse est déjà à 6,8 % : elle est très
en dessous, et ton travail va la faire **remonter** — surveille qu'elle ne dépasse pas 25 %.
⚠️ Le piège dans le piège : le mot que tu écris **pour remplacer** un mot exclusif peut être exclusif
à son tour. La stratégie compte les mots de **9 lettres et plus** : `polymorphisme`, `applicative`,
`paresseuse`, `transformer`, `composable`, `récursion`, `évaluation`, `abstraction` en font partie.

### (6) L'ÉCHO DE L'ÉNONCÉ — 60,7 %, couverture 53,0 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité.

### (7) L'INDICE LEXICAL — **58 questions EXPLOITABLES sur 66**, et **61 sur 66 à mettre en forme**

Un apprenant qui cherche au clavier (Ctrl+F) les mots de chaque option **dans la page** réussit :
lecture INVERSE **73,2 % de rendement sur 62,1 % des questions**.

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
--liste=haskell` — il imprime, pour **chaque question**, le `k` visé, le `w` et les mots en cause.
Cible : **0 exploitable ET 0 à mettre en forme**.

⚠️ **LA CONTRAINTE À QUATRE CONDITIONS** (trouvée au 41ᵉ cours, indépendamment par trois
correcteurs). Un mot de remplacement doit satisfaire **quatre** règles à la fois :
**moins de 9 lettres** (sinon il redevient le mot technique exclusif), **au moins 6 lettres** (sinon
le `w` tombe et la bonne réponse redevient « la plus fournie à elle seule », ce qui rouvre
PROPORTION), **présent dans la page** (sinon il est étranger et casse le `k`), et **absent de
l'énoncé** (sinon il fabrique « l'écho de la question »). **Trois sur quatre ne suffit pas.**

⚠️ **PIÈGE DE COMPTAGE, mesuré au 41ᵉ** : `mesure-lexique-qcm` capte les mots de 6 signes et plus, et
**une apostrophe compte comme un signe**. Écrire `'value'` en fait un mot de 7 signes que la page —
qui l'écrit `<code>value</code>` — ne contient pas. En Haskell le risque est le même avec les
backticks et les opérateurs : **écris les identifiants comme la page les écrit**.

### (8) LE MOT FÉTICHE — **5 alertes**, et ce sont des mots du DOMAINE

`node tools/mesure-mot-fetiche.js haskell` :

| mot | bonnes / distracteurs | questions tranchées | RESTREINDRE |
|---|---:|---:|---:|
| `résultat` | 7 / 1 | 8 | **32,6 %** |
| `liste` | 7 / 3 | 9 | **31,4 %** |
| `maybe` | 7 / 3 | 9 | **31,4 %** |
| `fonction` | 7 / 5 | 8 | **30,1 %** |
| `nothing` | 7 / 6 | 8 | **29,8 %** |

⚠️ On ne peut pas retirer « liste » ou « fonction » d'un QCM Haskell. **La règle est celle des
marques : par mot, les quatre options le portent, ou aucune** — et quand c'est la BONNE réponse qui
le porte (elle est intouchable), on l'**AJOUTE** aux distracteurs. Le retirer d'eux laisserait la
bonne réponse seule à le porter et **retournerait l'indice à 100 %**.
⚠️ **SINGULIER/PLURIEL** : `liste` et `listes` sont **deux jetons différents** pour l'outil. Ajouter
« liste » quand la bonne réponse porte « listes » ouvre une configuration 3/4 en laissant les deux
outils verts — c'est arrivé au 39ᵉ.

### (9) L'INTRUS LEXICAL — **5 questions tranchées à coup sûr**

`node tools/mesure-mot-question.js haskell --liste`. Lecture **PAR EXCÈS 29,9 %** (3 sûres), lecture
**PAR DÉFAUT en sens inverse 26,1 %** (2 sûres). Les cinq questions :

| leçon | lecture | mots en cause |
|---|---|---|
| `lecon-10` | DÉFAUT | `parce` |
| `lecon-14` | EXCÈS | `échoue`, `validation`, `maybe`, `échec`, `échouer`, `parcours` |
| `lecon-16` | EXCÈS | `maybe`, `consomme`, `début`, `entrée`, `valeur`, `reste` |
| `lecon-17` | DÉFAUT | `elles` |
| `lecon-18` | EXCÈS | `point` |

Règle : **par mot, les quatre options le portent, ou aucune**, appliquée **question par question**.
⚠️ **`mesure-mot-fetiche` NE LE VOIT PAS** (il exige qu'un mot tranche ≥ 8 questions) : lance les
deux. **Lis la colonne « sûres », pas la colonne « taux ».**
⚠️ **LA SEULE MANŒUVRE SÛRE EST L'AJOUT, PAS LE RETRAIT**, et **ne crée pas un 3/4 dont l'intrus
serait la bonne réponse** : elle est intouchable, donc l'indice deviendrait irrattrapable.

### (10) LE SENS INVERSE — déjà **3 alertes AVANT ton passage**

`node tools/mesure-biais-inverse.js --toutes haskell` :

| stratégie | tranche | DIRECTE | INVERSE | GLOBAL |
|---|---:|---:|---:|---:|
| la moins bavarde (peu de mots) | 38 | **0,0 %** | 33,3 % | **29,8 %** |
| la TROISIÈME plus longue | 58 | 1,7 % | 32,8 % | **31,8 %** |
| la DEUXIÈME plus longue | 62 | 4,8 % | 31,7 % | **31,3 %** |

Une **DIRECTE à 0,0 % sur 38 questions, c'est le plafond théorique de l'inverse** : la stratégie ne
désigne JAMAIS la bonne réponse, donc l'écarter est une **élimination sûre**. Ces trois alertes sont
la conséquence directe du rapport 5,06 — et elles se refermeront **si et seulement si** tu tiens les
fenêtres de `plan-rangs-qcm`. **Ne les traite pas séparément : elles sont la longueur vue de dos.**

### (11) Les marques à ne pas ouvrir

**barre oblique** (3 questions, 3/3), **flèche** (5 questions, 4/5), **guillemets**, **virgule
décimale**, **point interne / deux phrases** (4 questions, 4/4), **nom d'outil ou de bibliothèque**
(`Cabal`, `Stack`, `Hackage`, `QuickCheck`, `HLS`) : sur `dataviz`, **0 bonne réponse sur 68** en
portait contre 17 distracteurs — la règle « écarter l'option qui nomme un outil » n'avait **jamais**
tort.

---

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
   ⚠️ **SAUF si elle est FAUSSE** : au 40ᵉ cours (`crypto`), une bonne réponse annonçait « +107 % au
   lieu de +29 % » quand le programme de sa propre leçon produit **+111 %**. **Si tu trouves une
   erreur dans l'intouchable, ne la recopie pas dans un distracteur : remonte-la à l'orchestrateur
   avec la citation de la page qui le prouve.** Aucun des 45 vérificateurs ne lit ces énoncés-là.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire.
3. **Par marque : les quatre options, ou aucune** — ponctuation (et leur UNION), mots fétiches, ET
   mots d'une seule question (l'intrus lexical).
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en Haskell** — et **tu ne peux pas l'exécuter** (voir (a)) : ancre-le
   sur le corps de la leçon. Le coût mesuré d'un distracteur devenu vrai est de **1,68 réécriture**.
   ⚠️ Une phrase peut être vraie **dans un autre contexte** : « `foldr` sur une liste infinie peut
   terminer » est vrai si la fonction est paresseuse dans son second argument ; « une classe de types
   permet la surcharge » est vrai. Demande-toi toujours : *existe-t-il une lecture où cette phrase
   est exacte ?*
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS** — voir en tête de cette consigne.

---

## Vrai en Haskell, donc jamais employable comme distracteur

Ces faits sont **enseignés par le cours lui-même** (vérifiés dans le corps des leçons, faute de
toolchain) :

`=` est une **équation**, pas une affectation ; l'application se fait par **juxtaposition**
(`addition 3 4`), et `addition (3, 4)` passe **un tuple** ; toute fonction est **curryfiée**, donc
`Int -> Int -> Int` se lit « rend une fonction » ; `:t` donne le type sans évaluer ; l'inférence
rend les annotations **facultatives** mais recommandées ; les valeurs sont **immuables** ;
l'évaluation est **paresseuse** et les thunks sont **mémorisés** une fois forcés ; `take 5 [1..]`
termine ; `fmap` est `map` généralisé, et `<$>` en est l'opérateur ; `<*>` propage `Nothing` ; `>>=`
enchaîne, `do` en est le sucre ; `IO` **décrit** une action, `main` l'exécute ; une classe de types
n'est **pas** une classe objet et n'a **pas** d'héritage d'implémentation ; `newtype` est effacé à la
compilation (coût nul) ; `Semigroup` fournit `<>` et `Monoid` ajoute `mempty` ; `Foldable` replie,
`Traversable` parcourt **en portant un effet** ; un transformer **empile** les effets et change le
type ; les threads GHC sont **légers** (forkIO), pas des threads système ; `STM` compose des
transactions **atomiques** que `MVar` ne compose pas.

**Si l'un de ces faits te semble faux, ne l'écris pas comme distracteur : signale-le.**

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=haskell           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes haskell     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=haskell        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js haskell                # 0 alerte
node tools/mesure-mot-question.js haskell --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js haskell              # rangs, cible 17/17/16/16
node tools/mesure-qcm-intouchable.js haskell <ref>      # 0 atteinte
node tools/plan-rangs-qcm.js haskell                    # ce qu'il reste a ecrire
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**

---

## ⚠️ Ce que les passes 39 à 41 ont appris sur la MÉTHODE, et qui vaut pour toi

1. **La contradiction adversariale doit elle-même être contredite.** Un remède proposé n'est pas un
   ordre : évalue-le, et si tu le rejettes, écris la preuve.
2. **Fermer un indice en rouvre un autre — mesuré quatre fois en une seule passe.** **Après chaque
   retouche, rejoue les mesures**, pas seulement celle que tu visais.
3. **Un relecteur qui mesure sur SON LOT extrapole faux.** Trois indices annoncés à 36-43 % sur un
   lot mesuraient 25-29 % sur le cours entier. **Toujours remesurer sur le corpus complet.**
4. **Corriger un CORPS de leçon rouvre l'indice lexical** : le dictionnaire de la page change, donc
   la règle du `k` des QCM de cette page peut sauter. Corrige le corps d'abord, le QCM ensuite.
5. **N'écris QUE dans les leçons de ton lot.** Un autre écrivain travaille en même temps sur les
   autres leçons du même cours ; deux agents qui touchent le même fichier se détruisent.
   **Ne fais AUCUN `git commit`, AUCUN `git add`, AUCUN `git stash`** — l'orchestrateur seul commite.
6. **Le JSON doit rester valide et le fichier sans BOM.** Après ton lot :
   `node -e "…JSON.parse…"` sur chaque bloc que tu as touché, et `node tools/verif-html.js`.
