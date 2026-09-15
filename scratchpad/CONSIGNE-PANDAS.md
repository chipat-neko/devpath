# Consigne d'écriture — les QCM du cours `pandas` (B4, 41ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `pandas` (Series et DataFrame,
sélection, filtres, valeurs manquantes, groupby, jointures, dates, pivots, entrées-sorties). La
question, l'index `correct`, l'explication et **le texte de la bonne réponse** sont **INTOUCHABLES** :
`node tools/mesure-qcm-intouchable.js pandas <ref-git>` le contrôle et signalera toute atteinte.
Tu ne touches qu'aux **trois options fausses**.

**65 questions sur 14 leçons, 195 distracteurs** — dont **15 questions dans `lecon-14`**, la dernière
(3 en QCM de leçon, **12 en QCM bilan**).

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **93,8 %** des QCM de `pandas` en cochant l'option
la plus longue — couverture **95,4 %**, rendement **96,8 %**. **Ton lot doit ramener chaque indice à
25 %, l'étalon du hasard.** On ne rend pas les questions plus difficiles : on rend les **distracteurs
crédibles**.

## ⚠️ CE QUI REND CE COURS-CI PARTICULIER — à lire avant la liste des indices

### (a) Un avantage inédit : **pandas EST INSTALLÉ sur la machine**

`python -c "import pandas; print(pandas.__version__)"` rend **3.0.5** (Python 3.14.5). C'est la
première fois depuis le 37ᵉ cours qu'une toolchain permet d'appliquer la règle fondatrice du
chantier : **NE JAMAIS AFFIRMER UN COMPORTEMENT DE TÊTE, LE FAIRE TOURNER.** Sur `scala`, son
absence a été inscrite comme la seule limite de la passe ; ici, il n'y a **aucune excuse**.

⚠️ **MAIS LE COURS ENSEIGNE pandas 2.0 / 2.2, ET LA MACHINE PORTE 3.0.** Une exécution qui diverge
ne prouve donc pas qu'un distracteur est faux : elle prouve qu'il est faux **en 3.0**. **Deux écarts
sont déjà mesurés, et ils touchent des affirmations que ce cours enseigne :**

| ce que le cours (2.x) dit | ce que la machine (3.0.5) rend |
|---|---|
| le `dtype` d'une colonne de texte est **`object`** | **`str`** (`pd.Series(["x"]).dtype` → `str`) |
| `DataFrame.applymap` applique une fonction cellule par cellule | **`applymap` n'existe plus** (`hasattr` → `False`), c'est `DataFrame.map` |

Le copy-on-write, devenu le défaut en 3.0, change aussi le comportement des affectations enchaînées.
**Avant de déclarer un distracteur faux sur la foi d'un `Traceback`, vérifie que la faute n'est pas
un écart de version** — et si c'en est un, écris-le plutôt que de l'appliquer. **Un distracteur qui
dit « `object` » reste FAUX-en-3.0 mais VRAI-en-2.x : il n'est donc pas employable.**

### (b) Le travail est presque entièrement de l'ALLONGEMENT — donc le terrain exact de la salade de mots

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **119,5 caractères** (max 204) |
| longueur moyenne d'un distracteur | **41,9 caractères** (min **6**) |
| rapport | **2,85** |
| médiane du même rapport sur les **39 cours déjà traités** | **0,99** |
| médiane sur les 51 cours non traités | 3,41 |

`plan-rangs-qcm` demande **12 457 caractères** répartis sur **60 questions sur 65** — c'est **2,4
fois** le lot de `crypto` (5 255). Autrement dit : presque tout ton travail consiste à faire passer
des télégrammes (« À supprimer les doublons », « Il convertit les dates en texte ») à des phrases de
100 à 160 caractères.

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER — elle vaut double ici

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.** Au 39ᵉ cours (`scala`), la relecture
adversariale a rendu **54 prises, dont 30 de ce seul type** : pour atteindre la fenêtre de longueur,
les écrivains avaient remélangé le vocabulaire de la bonne réponse jusqu'au bon compte de
caractères, et le résultat ne voulait **rien dire**. Sur quatre questions, **deux options sur
quatre** étaient dans ce cas — la bonne réponse devenait la seule phrase signifiante, et un
apprenant qui n'a jamais lu une ligne de code cochait juste **par élimination du charabia**.

**Le biais de longueur avait été fermé et remplacé par un biais de cohérence sémantique, qui se
mesure exactement au même endroit. Aucun des 44 outils ne le voit.**

**Relis chaque distracteur à voix haute.** Un bon distracteur est **une erreur que quelqu'un
pourrait vraiment commettre**. En pandas elles sont nombreuses, bien connues, et faciles à rendre
plausibles sur 120 caractères :

- confondre `loc` (par étiquette, borne finale **incluse**) et `iloc` (par position, borne **exclue**) ;
- croire que `df[col]` rend un DataFrame (c'est une Series) et que `df[[col]]` rend une Series ;
- croire qu'un filtre booléen renvoie une copie modifiable de la source ;
- croire que `groupby` trie toujours, ou qu'il garde les groupes vides ;
- confondre `apply`, `map` et `applymap` ; `merge` et `join` ; `concat` et `append` (⚠️ voir
  l'écart de version ci-dessus pour `applymap`) ;
- croire que `NaN == NaN` est vrai, ou que `dropna()` agit sur place ;
- croire que `pivot` et `pivot_table` sont interchangeables (le second **agrège**) ;
- croire que `read_csv` devine les dates sans `parse_dates` ;
- croire que `inplace=True` est plus rapide ou économise la mémoire.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 93,8 %, couverture 95,4 %, rendement 96,8 %

`node tools/plan-rangs-qcm.js pandas` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. Rangs actuels **62 / 2 / 0 / 1** ; l'outil vise **17 / 16 / 16 / 16**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait 60,9 % à qui cochait
« la deuxième plus longue ». Le sens INVERSE le dit déjà ici : « la TROISIÈME plus longue » rend
**32,1 %** en global inverse, « la DEUXIÈME » **31,8 %**.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

⚠️⚠️ **UN DISTRACTEUR NE DOIT JAMAIS FAIRE EXACTEMENT LA LONGUEUR DE LA BONNE RÉPONSE** :
`plan-rangs-qcm` teste `plusLong = len > bon`, donc à `len === bon` l'option est classée « plus
courte » et sa fenêtre s'arrête à `bon − 1` — hors bande d'un seul caractère.

⚠️⚠️ **NE « CORRIGE » PAS UN RANG QUI TE PARAÎT FAUX.** La cible est **17/16/16/16 sur le cours** :
la bonne réponse est volontairement la plus courte sur 16 questions. Sur `typescript`, **quatre
relecteurs sur cinq** ont signalé « l'indice de longueur est rouvert ici » — les quatre avaient
tort. **Un lot de 12 questions ne peut pas afficher 25 %.**

### (2) LA PLUS DÉTAILLÉE — 82,2 %, couverture 73,8 %, **rendement 100 %**

**Elle ne se trompe jamais sur ce cours.** La bonne réponse est presque toujours la seule à porter un
nom de méthode, un chiffre, un `dtype`, un exemple. **Fais porter du concret FAUX à tes
distracteurs** : une méthode qui existe employée pour la mauvaise chose (`df.sort_index()` présenté
comme un tri de valeurs), un `dtype` plausible mais faux (`float64` là où la colonne est entière), un
argument réel avec un effet inventé (`keep='last'`, `how='outer'`, `axis=1`).

### (3) L'INCISE ENTRE PARENTHÈSES — 61,5 %, couverture 53,8 %, rendement 91,4 %

Mesuré : **45 bonnes réponses sur 65 portent une parenthèse, contre 40 distracteurs sur 195.**
Règle : **par marque, les quatre options la portent, ou aucune.** C'est l'indice le plus facile à
fermer de tout ce cours, et le deuxième plus rentable.

### (4) LA PONCTUATION FORTE EN UNION — RESTREINDRE rend **59,1 %**, rendement **100 %**

« : » **ou** « ; » **ou** tiret, comptés **ensemble** — c'est la leçon du 35ᵉ cours (`dataviz`), où
l'union rendait 91,7 % sur 1 689 questions pendant que chaque marque prise à part semblait tolérable.
Mesuré ici : **deux-points 28 bonnes / 18 distracteurs**, **point-virgule 10 bonnes / 2
distracteurs** (rendement **100 %**), **deux phrases / point interne 34,2 %, rendement 100 %**.
**Par marque, les quatre ou aucune — et vérifie aussi l'union.**

### (5) LE MOT TECHNIQUE EXCLUSIF — 53,2 %, couverture 64,6 %

La bonne réponse ne doit pas être la seule à employer un mot long qu'aucune autre n'emploie.
⚠️⚠️ **NE LE FERME PAS À FOND — mesuré au 39ᵉ cours :** l'écraser l'a fait tomber à 13,3 % en
direct, ce qui a porté sa lecture INVERSE à 28,9 %, au-dessus du seuil. **Vise l'égalité (25 %), pas
zéro.** ⚠️ Le piège dans le piège : le mot que tu écris **pour remplacer** un mot exclusif peut être
exclusif à son tour (« programme », 9 lettres, a rouvert l'indice qu'il devait fermer). La stratégie
compte les mots de **9 lettres et plus** : `DataFrame`, `groupby`, `agrégation`, `étiquette`,
`concaténer`, `rééchantillonne` en font partie.

### (6) L'ÉCHO DE L'ÉNONCÉ — 47,6 %, couverture 36,9 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé, comptés en ENSEMBLE). C'est une **égalité**, pas une inégalité. Attention : l'énoncé d'un
QCM pandas contient presque toujours `DataFrame`, `colonne`, `ligne`, `index` — l'écho est donc
difficile à éviter et facile à égaliser.

### (7) L'INDICE LEXICAL — **52 questions EXPLOITABLES sur 65**, et **55 sur 65 à mettre en forme**

Un apprenant qui cherche au clavier (Ctrl+F) les mots de chaque option **dans la page** réussit.

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
sur le **corps** de la page, blocs de QCM exclus ; l'outil compte les **occurrences**, pas les mots
distincts. Outil : `node tools/mesure-lexique-qcm.js --liste=pandas`. Cible : **0 exploitable ET 0 à
mettre en forme**.

### (8) LE MOT FÉTICHE — `pandas` en porte **HUIT** au-dessus du seuil, et ce sont des mots du DOMAINE

`node tools/mesure-mot-fetiche.js pandas` :

| mot | bonnes / distracteurs | questions tranchées | RESTREINDRE |
|---|---:|---:|---:|
| `ligne` | 10 / 5 | 14 | **34,2 %** |
| `colonne` | 13 / 18 | 21 | **33,1 %** |
| `lignes` | 12 / 12 | 17 | **32,8 %** |
| `chaque` | 7 / 1 | 8 | **32,7 %** |
| `colonnes` | 12 / 16 | 20 | **30,6 %** |
| `index` | 9 / 9 | 13 | **30,5 %** |
| `table` | 6 / 3 | 8 | **30,4 %** |
| `valeurs` | 6 / 7 | 12 | 28,8 % |

⚠️ **C'est l'inverse de `crypto`, et c'est plus dur** : on ne peut pas retirer « colonne » d'un QCM
pandas. **La règle est celle des marques : par mot, les quatre options le portent, ou aucune** — et
quand c'est la BONNE réponse qui porte le mot (elle est intouchable), on l'**AJOUTE** aux
distracteurs. Le retirer d'eux laisserait la bonne réponse seule à le porter et **retournerait
l'indice à 100 %**.
⚠️ **SINGULIER/PLURIEL** : `colonne` et `colonnes` sont **deux jetons différents** pour l'outil, et
ils sont **tous les deux** dans la liste. Ajouter « colonne » quand la bonne réponse porte
« colonnes » ouvre une configuration 3/4 en laissant les deux outils verts — c'est arrivé au 39ᵉ.

### (9) L'INTRUS LEXICAL — **2 questions tranchées à coup sûr**

`node tools/mesure-mot-question.js pandas --liste`. Lecture PAR EXCÈS **27,6 %**, lecture PAR DÉFAUT
en sens inverse **29,1 %**. Les deux questions sûres :
- `lecon-01` « Que renvoie `ventes.shape`… » — mot en cause : **`tuple`** ;
- `lecon-05` « Sur un DataFrame à index par défaut… » — mots en cause : **`borne`, `finale`,
  `incluse`, `labels`, `exclue`, `positions`** (six d'un coup, dans la seule bonne réponse).

Règle : **par mot, les quatre options le portent, ou aucune**, appliquée **question par question**.
⚠️ **`mesure-mot-fetiche` NE LE VOIT PAS** (il exige qu'un mot tranche ≥ 8 questions) : lance les
deux. **Lis la colonne « sûres », pas la colonne « taux ».**
⚠️ **LA SEULE MANŒUVRE SÛRE EST L'AJOUT, PAS LE RETRAIT**, et **ne crée pas un 3/4 dont l'intrus
serait la bonne réponse** : elle est intouchable, donc l'indice deviendrait irrattrapable.

### (10) Les marques à ne pas ouvrir

**MAJUSCULE d'emphase** (30,0 %, rendement 100 % — et la stratégie **COMPTE** les capitales, elle ne
teste pas leur présence : écrire `NaN` deux fois quand les autres l'écrivent une fois suffit à
trancher), **virgule décimale** (26,2 %, rendement 100 %), **guillemets** (26,2 %, rendement 100 %),
**barre oblique**, **flèche**, **nom d'outil ou de bibliothèque** (`NumPy`, `Excel`, `Arrow`,
`Matplotlib`) : sur `dataviz`, **0 bonne réponse sur 68** en portait contre 17 distracteurs — la
règle « écarter l'option qui nomme un outil » n'avait **jamais** tort.

## Les six contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
   ⚠️ **SAUF si elle est FAUSSE** : au 40ᵉ cours (`crypto`), une bonne réponse annonçait « +107 % au
   lieu de +29 % » quand le programme de sa propre leçon produit **+111 %** et **+34 %**, et une
   explication donnait un rapport bricolé entre deux grandeurs. **Si tu trouves un chiffre faux dans
   l'intouchable, ne le recopie pas dans un distracteur : remonte-le à l'orchestrateur avec la preuve
   par exécution.** Aucun des 44 vérificateurs ne lit un chiffre dans un QCM.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire.
3. **Par marque : les quatre options, ou aucune** — ponctuation (et leur UNION), mots fétiches, ET
   mots d'une seule question (l'intrus lexical).
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en pandas** — et ici, **tu peux l'exécuter**. Le coût mesuré d'un
   distracteur devenu vrai est de **1,68 réécriture**. ⚠️ Une phrase peut être vraie **dans un autre
   contexte** : « `groupby` trie les clés » est vrai par défaut (`sort=True`) ; « `merge` fait une
   jointure interne » est vrai par défaut (`how='inner'`). Demande-toi toujours : *existe-t-il une
   lecture où cette phrase est exacte ?*
6. ⚠️⚠️ **ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS** — voir en tête de cette consigne.

## Vrai en pandas, donc jamais employable comme distracteur

`df[col]` rend une **Series**, `df[[col]]` un **DataFrame** ; `loc` travaille par **étiquette** et sa
borne finale est **incluse**, `iloc` par **position** et sa borne est **exclue** ; `NaN != NaN` ;
`dropna()`, `fillna()`, `sort_values()` rendent une **copie** par défaut ; `groupby` trie les clés
par défaut et **écarte les NaN** de la clé ; `merge` fait une jointure **interne** par défaut ;
`pivot_table` **agrège**, `pivot` non ; `read_csv` ne convertit **pas** les dates sans
`parse_dates` ; `append` a été **supprimé** (pandas 2.0) au profit de `concat` ; `inplace=True`
n'économise **ni temps ni mémoire** ; une Series a un `dtype` unique, un DataFrame un `dtype` **par
colonne** ; `value_counts()` **exclut** les NaN sauf `dropna=False` ; `apply(axis=1)` reçoit **une
Series indexée par les noms de colonnes**.

**Tous les faits de ce paragraphe ont été vérifiés par exécution le 2026-09-15** (`pd.__version__`
= 3.0.5) : `df["v"]` → `Series`, `df[["v"]]` → `DataFrame` ; `df.loc[0:1]` → **2 lignes**,
`df.iloc[0:1]` → **1** ; `nan == nan` → `False` ; `groupby(sort=True, dropna=True)` par défaut ;
`pd.merge(how="inner")` par défaut ; `hasattr(pd.DataFrame, "append")` → `False` ;
`Series([1,1,nan]).value_counts()` → `{1.0: 2}` et `dropna=False` → `{1.0: 2, nan: 1}` ;
`apply(..., axis=1)` reçoit une `Series` d'index `['v','t']`.

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=pandas           # les 43 strategies, sens direct
node tools/mesure-biais-inverse.js --toutes pandas     # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=pandas        # 0 exploitable ET 0 a mettre en forme
node tools/mesure-mot-fetiche.js pandas                # 0 alerte
node tools/mesure-mot-question.js pandas --liste       # 0 question « sure », les DEUX lectures
node tools/mesure-qcm-longueurs.js pandas              # rangs, cible 17/16/16/16
node tools/mesure-qcm-intouchable.js pandas <ref>      # 0 atteinte
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies — 0 mot fétiche, et 0 question « sûre ».**
État de départ à battre, mesuré le 2026-09-15 : **6 alertes** au sens inverse (« la moins bavarde »
29,9 % global, « la TROISIÈME plus longue » 32,1 %, « la DEUXIÈME plus longue » 31,8 %).

## ⚠️ Ce que les passes 39 et 40 ont appris sur la MÉTHODE, et qui vaut pour toi

1. **La contradiction adversariale doit elle-même être contredite.** Deux correcteurs de `scala` ont
   réfuté, preuve à l'appui, une prise de leur relecteur. Un remède proposé n'est pas un ordre :
   évalue-le, et si tu le rejettes, écris la preuve.
2. **Fermer un indice en rouvre un autre — mesuré quatre fois en une passe.** **Après chaque
   retouche, rejoue les six mesures**, pas seulement celle que tu visais.
3. **Corriger un CORPS de leçon rouvre l'indice lexical** : le dictionnaire de la page change, donc
   la règle du `k` des QCM de cette page peut sauter. Corrige le corps d'abord, le QCM ensuite.
4. **Commit dès qu'un lot est fini.** Au 40ᵉ cours, une limite de session a coupé la passe à 14 h 31
   avec le lot entier **non commité** ; il n'a survécu que parce que rien n'a touché l'arbre entre
   les deux réveils. Au 30ᵉ (`ocaml`), le même scénario avait tout détruit.
5. **Remesure avant de verser, même un travail que tu crois fini.** C'est ce remesurage qui a fait
   apparaître les deux chiffres faux de `crypto`.
