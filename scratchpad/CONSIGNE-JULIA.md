# Consigne d'écriture — les QCM du cours `julia` (B4, 49ᵉ cours)

Tu écris les **distracteurs** d'un lot de questions du cours `julia` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, et tu ne
fais **aucun commit** : l'orchestrateur s'en charge.

Les QCM sont dans `pages/julia/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-16`). Le schéma est
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

**Écris tes scripts jetables dans TON dossier scratch à toi** (`scratchpad/julia-<ton lot>/`) :
deux agents qui écrivent dans le même dossier temporaire s'écrasent mutuellement.

---

## ⚠️ CE COURS NE S'EXÉCUTE PAS — ET C'EST UNE CONTRAINTE, PAS UN CONFORT

`julia` n'est **pas installé** dans cet environnement (`julia --version` → *command not found*),
et `runner.js` ne pose un bouton « Tester » que sur du JavaScript. **Aucune de tes affirmations ne
pourra être prouvée par exécution.**

Conséquence directe, et elle est stricte : **tu n'écris un distracteur que sur un point que la page
elle-même établit**, ou qui relève du comportement documenté et non ambigu du langage. Si tu dois
supposer le texte exact d'un message d'erreur, le temps de compilation JIT d'un appel, le nombre de
fils qu'un `Threads.@threads` utilise, l'ordre d'exécution de tâches concurrentes, ou ce que rend
une version donnée d'un paquet (`DataFrames`, `Plots`, `Flux`, `DifferentialEquations`,
`PackageCompiler`), **tu ne l'écris pas** : tu le remontes dans ton compte rendu.

⚠️ Attention particulière aux **versions** : ne fonde jamais une fausseté sur un point de version
que la page ne date pas (les changements de `Pkg`, la disparition du temps de latence au premier
appel — *time to first plot* — améliorée à chaque version, le comportement de `@inbounds`, les
évolutions de `Base.Threads`). Le 46ᵉ cours a fait refuser un encadré que la page ne fondait pas ;
les 47ᵉ et 48ᵉ ont refusé quatre puis cinq périmètres pour la même raison.

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien au cours réussit **95,8 %** des QCM de `julia` en cochant l'option
la plus longue — **couverture 98,3 %, rendement 96,6 %**. Ce n'est pas le seul indice ; relevé du
jour, `node tools/mesure-biais-qcm.js --seul=julia` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **95,8 %** | **98,3 %** | **96,6 %** |
| la plus détaillée | **81,6 %** | 76,3 % | **97,8 %** |
| RESTREINDRE à la ponctuation forte | **70,5 %** | 61,0 % | **97,2 %** |
| le mot technique exclusif | **70,1 %** | 71,2 % | 85,7 % |
| la seule avec une PONCTUATION FORTE | **69,1 %** | 61,0 % | **97,2 %** |
| l'incise entre parenthèses | **64,1 %** | 50,8 % | **100 %** |
| RESTREINDRE à la parenthèse | **62,6 %** | 52,5 % | 93,5 % |
| RESTREINDRE aux deux-points | **52,5 %** | 39,0 % | 91,3 % |
| l'écho de la question | **48,0 %** | 37,3 % | 77,3 % |
| RESTREINDRE au point-virgule | **45,1 %** | 28,8 % | **94,1 %** |
| ECARTER la moins bavarde | **43,5 %** | 13,6 % | 75,0 % |
| ECARTER la plus courte / la plus prudente | **33,9 %** | 3,4 / 18,6 % | 50,0 / 72,7 % |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## (b) Le travail est de l'**ALLONGEMENT**

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **107,5 caractères** |
| longueur moyenne d'un distracteur | **25,9 caractères** |
| **rapport** | **4,16** |
| rapport du 42ᵉ cours (`haskell`), le record | 5,06 |
| rapport du 48ᵉ cours (`elixir`) | 4,05 |
| médiane du même rapport sur les **48 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js julia` demande **12 312 caractères** répartis sur **57 questions
sur 59**. Rangs actuels **57 / 1 / 1 / 0**, cible **15 / 15 / 15 / 14**.
**165 distracteurs sur 177 sont hors de la bande 70–130 %** ; la fourchette va de **0,05** à 15,00.

⚠️ **Le distracteur moyen fait 26 caractères** : « Une erreur », « C'est l'inverse », « Avec {nom} »,
« L'affectation ». Presque tout le travail est de la **rédaction neuve**, pas de la retouche.

## (c) LA FORME DU DÉFAUT EST UNIFORME, ET C'EST UNE CHANCE

La bonne réponse est **« la réponse + sa justification »** ; les distracteurs sont des télégrammes.
**LE REMÈDE EST TOUJOURS LE MÊME : donne au distracteur la MÊME STRUCTURE que la bonne réponse —
la réponse fausse, PUIS sa justification fausse mais cohérente.**

---

## ⚠️⚠️ LA CONTRAINTE QUI A COÛTÉ LE PLUS CHER

**ÉCRIS UNE THÈSE FAUSSE, PAS UNE SALADE DE MOTS.** Au 39ᵉ cours (`scala`), 30 prises sur 54
venaient de distracteurs remélangés jusqu'au bon compte de caractères et qui ne voulaient plus rien
dire ; au 45ᵉ (`securite`), **neuf contrôles verts sur un texte qui ne voulait rien dire**. Le biais
de longueur y avait été remplacé par un **biais de cohérence sémantique, qui se mesure au même
endroit et qu'aucun des 46 outils ne voit**. Relis chaque distracteur à voix haute.

Les erreurs vraiment commises en Julia se rédigent facilement sur 80 à 200 caractères.
**N'utilise que celles que TA leçon établit** :

- croire que Julia est **interprété** parce qu'on l'utilise en REPL, alors qu'il compile en JIT ;
- croire que la lenteur du **premier appel** est un défaut de performance, au lieu du coût de
  compilation (le deuxième appel est rapide) ;
- croire que l'**indexation commence à 0** (elle commence à **1**) ou que `end` est un mot-clé
  interdit dans un index ;
- croire qu'une plage `a:b` **exclut** sa borne haute (elle l'inclut) ;
- croire que `1/2` rend `0` par division entière (il rend `0.5` ; la division entière est `÷` ou
  `div`) ;
- croire que `Int + Float64` lève une erreur de type, au lieu de **promouvoir** vers `Float64` ;
- confondre `=` (affectation) et `==` (égalité) et `===` (identité) ;
- croire que le **point** de `f.(x)` est une multiplication ou un accès à un champ, au lieu du
  **broadcasting** élément par élément ;
- croire que `x .+ y` alloue toujours un tableau neuf même dans une fusion de points, ou
  qu'`@.` fait autre chose que poser les points ;
- croire qu'un `Array` copie à l'affectation `b = a` (les deux noms désignent la **même** donnée ;
  c'est `copy` qui duplique) ;
- confondre **tuple** (immuable, taille fixe) et **vecteur** (mutable) ;
- croire qu'une `struct` est **mutable** par défaut (il faut `mutable struct`) ;
- croire que `NamedTuple` et `Dict` ont le même coût d'accès, ou qu'un `Dict` garantit un ordre ;
- croire que le **multiple dispatch** choisit la méthode sur le type du **premier** argument
  seulement (il la choisit sur **tous** les types d'arguments), ou que c'est de l'héritage ;
- croire qu'une `struct` peut hériter d'une autre `struct` (seuls les types **abstraits** ont des
  sous-types) ;
- croire que `::Float64` sur un argument **accélère** l'appel, alors que c'est la **stabilité de
  type** et non l'annotation qui fait la performance ;
- croire qu'une variable **globale** non `const` est aussi rapide qu'une locale ;
- croire que `@code_warntype` mesure le temps, ou que `@time` le mesure fiablement au **premier**
  appel (c'est `@btime` de `BenchmarkTools`, et il faut interpoler avec `$`) ;
- croire que `Pkg.add` installe dans le dossier du projet plutôt que dans un dépôt partagé, ou que
  `Manifest.toml` et `Project.toml` jouent le même rôle ;
- croire qu'un environnement s'active par une variable d'environnement plutôt que par
  `Pkg.activate` / `]activate` ;
- croire qu'un `DataFrame` est une matrice typée uniformément, ou qu'une colonne s'atteint
  uniquement par indice ;
- croire que `missing` se compare à `missing` avec `==` en rendant `true` (il rend `missing` ;
  c'est `ismissing` qui tranche) ;
- croire qu'une **macro** s'exécute à l'exécution (elle s'exécute à la **compilation**), que
  `quote` **évalue** son contenu (il rend une `Expr`), ou que `$` dans un `quote` insère du texte
  plutôt que d'**interpoler** une expression ;
- croire qu'`esc` change la valeur plutôt que la **portée** dans laquelle un symbole est résolu ;
- croire qu'une **tâche** (`@async`, `Task`) est un fil système, ou que `@spawn` et `@threads`
  sont la même chose ;
- confondre **parallélisme par fils** (mémoire partagée) et **par processus** (`Distributed`,
  mémoire séparée) ;
- croire que `@test` échoue le programme entier plutôt que de rapporter un échec dans son
  `@testset` ;
- croire que `@test_throws` attend la **valeur** rendue plutôt que le **type d'exception** ;
- croire que `ccall` recompile la bibliothèque C, ou qu'appeler du C impose d'écrire un
  *wrapper* Julia ;
- croire que `PackageCompiler` rend un exécutable sans embarquer le runtime Julia.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **95,8 %, couverture 98,3 %, rendement 96,6 %**

Suis **exactement** ce que rend `node tools/plan-rangs-qcm.js julia` pour tes questions : le rang
visé et la bande de caractères option par option. Ne « corrige » pas le rang par intuition : la
cible **15 / 15 / 15 / 14** est une répartition de FICHIER, et la casser sur ton lot la casse pour
tout le monde.

### (2) ⚠️⚠️ LES QUATRE RANGS ONT UNE DIRECTE DE **0,0 % EXACTEMENT** — LA CONFIGURATION LA PLUS FRANCHE DU CHANTIER

`node tools/mesure-biais-inverse.js --toutes julia` rend **4 alertes**, et les quatre sont au
plafond théorique :

| stratégie | tranche | part | DIRECTE | INVERSE |
|---|---:|---:|---:|---:|
| la QUATRIEME plus longue | 54 | 91,5 % | **0,0 %** | **33,3 %** |
| la DEUXIEME plus longue | 53 | 89,8 % | **0,0 %** | **33,3 %** |
| la TROISIEME plus longue | 51 | 86,4 % | **0,0 %** | **33,3 %** |
| la moins bavarde (peu de mots) | 35 | 59,3 % | **0,0 %** | **33,3 %** |

**Une DIRECTE à 0,0 % sur une large couverture est le pire défaut possible** : elle offre une
élimination *certaine*, sur 35 à 54 questions. Viser **25 % sur CHAQUE rang**, jamais 0 % — c'est la
règle du cours `sql`, et elle vaut pour les **quatre** rangs.

**LE NOMBRE DE MOTS SUIT LE RANG DE LONGUEUR.** `la moins bavarde` tranche sur 59,3 % des questions
avec une DIRECTE à 0,0 % : allonger avec quelques mots très longs ferme les caractères et laisse le
compte de mots ouvert. **Le rang en MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.**

### (3) LA PLUS DÉTAILLÉE — 81,6 %, couverture 76,3 %, **rendement 97,8 %**

La stratégie compte les `, : ;` d'une option. **Égalise ce compte sur les quatre options.** Fais
porter du **concret FAUX** à tes distracteurs : un identifiant réel de la bibliothèque standard
(`Base`, `Pkg`, `Threads`, `Distributed`, `Test`, `LinearAlgebra`, `Random`) avec un effet inventé,
un chiffre précis mais faux, une option nommée qui n'existe pas.

### (4) LA PONCTUATION — quatre marques au-dessus de 91 %, et il faut regarder l'UNION

Relevé brut du jour sur les 59 questions (comptage auxiliaire ; les couvertures de référence restent
celles de `mesure-biais-qcm`) :

| marque | bonnes / distracteurs | SEULE à la porter | la bonne l'emporte |
|---|---|---:|---:|
| **point-virgule** | **17 / 3** | **17 questions** | **94,1 %** |
| **parenthèse** | **38 / 18** | **32 questions** | **93,8 %** |
| **virgule** | **39 / 20** | **29 questions** | **93,1 %** |
| **deux-points** | **26 / 9** | **23 questions** | **91,3 %** |
| tiret cadratin | 3 / 0 | 3 questions | **100 %** |
| barre oblique | 2 / 1 | 3 questions | 66,7 % |
| guillemets | 1 / 0 | 1 question | 100 % |
| MAJUSCULE | 5 / 5 | 6 questions | 50,0 % |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'UNION**
(`la seule avec une PONCTUATION FORTE` = `:` ou `;` ou tiret, à **69,1 % et rendement 97,2 %**).
Fermer chaque marque séparément et laisser l'union ouverte ne sert à rien : c'est la leçon du
35ᵉ cours (`dataviz`).

⚠️ La MAJUSCULE est **déjà à 50,0 % sur 6 questions** : n'y touche pas, tu la retournerais. Et
**n'invente pas de sigle** pour tenir un compte : au 45ᵉ cours, une majuscule fermée par un mot a
simplement **déplacé l'indice d'un cran, au même chiffre exact**.

### (5) LE MOT TECHNIQUE EXCLUSIF — 70,1 %, couverture 71,2 %, rendement 85,7 %

Les mots du domaine (`compilation`, `broadcasting`, `dispatch`, `méthode`, `signature`, `immuable`,
`allocation`, `stabilité`, `environnement`, `macro`, `expression`…) ne doivent pas être le privilège
de la bonne réponse. **Par mot technique : les quatre options le portent, ou aucune.**

⚠️⚠️ **CET INDICE EST EN TENSION STRUCTURELLE AVEC L'INTRUS LEXICAL (point 8) — leçon du 48ᵉ cours.**
`le mot technique exclusif` désigne l'option qui porte le plus de mots de **9 lettres et plus**
qu'aucune autre n'emploie. La bonne réponse étant intouchable, le fermer en ajoutant un mot de
9+ lettres **exclusif à un distracteur** est exactement ce que l'intrus lexical compte en EXCÈS.
**La seule issue qui ferme les deux est de reprendre un mot de 9+ lettres de la bonne réponse et de
le poser dans les TROIS distracteurs** (4/4 = neutre pour l'intrus, et le mot cesse d'être exclusif).
Coût mesuré : ~45 caractères par question — **compte-les dans ta bande de longueur**.

### (6) L'ÉCHO DE L'ÉNONCÉ — 48,0 %, couverture 37,3 %, rendement 77,3 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé). ⚠️ Un identifiant court passe sous le radar de l'outil : au 46ᵉ cours, `job` (3 lettres)
faisait de la bonne réponse la seule à citer une cmdlet et **aucune stratégie ne le voyait**.
En Julia, `end`, `Int`, `Pkg`, `REPL`, `JIT`, `.+`, `::`, `@`, `$`, `÷` sont dans ce cas :
**compte-les à la main**.

### (7) L'INDICE LEXICAL — ouvert dans les trois lectures, la plus grave étant l'INVERSE

`node tools/mesure-lexique-qcm.js --seul=julia` :

| lecture | couverture | rendement |
|---|---:|---:|
| STRICTE | 37,3 % | 18,2 % |
| PROPORTION | **61,0 %** | 44,4 % |
| **INVERSE** | **52,5 %** | **54,8 %** |

La bonne réponse porte à la fois beaucoup de mots de la page **et** beaucoup de mots étrangers à la
page — parce qu'elle est quatre fois plus longue que ses distracteurs.

**RÈGLE DU `k` : soit `k` le nombre de mots de 6 lettres et plus absents de la page que porte une
option — les QUATRE options doivent porter le MÊME `k`.** Ni 0/0/k (qui laisse 50 % en RESTREINDRE),
ni « aucun étranger partout » (qui retourne l'indice).

**RÈGLE DU `w`** : soit `w` le nombre de mots de 6 lettres et plus d'une option — les quatre valeurs
doivent rester proches. `w` et `k` se règlent **séparément**.

⚠️⚠️ **DEUX RÈGLES APPRISES AU 47ᵉ COURS, ET ELLES ONT COÛTÉ DEUX ALLERS-RETOURS CHACUNE** :
1. **Un mot de remplacement doit être PRÉSENT dans la page ET faire moins de 9 lettres.** Un
   substitut absent de la page fait exploser la lecture STRICTE (10,5 % → 50,0 % au 47ᵉ) ; un
   substitut de 9 lettres et plus reste compté comme « mot long ». Le contrôle est un `grep` de
   trois secondes : fais-le **avant** d'écrire. ⚠️ `grep -ci` sur une **racine** ment : l'outil
   compare des **jetons entiers** (« méthode » ≠ « méthodes » selon la casse et les accents) —
   cherche le mot entier, pas sa racine (leçon du 44ᵉ cours).
2. **Pose le substitut dans DEUX distracteurs à la fois**, jamais un seul : un mot porté par
   exactement 1 ou 3 options sur 4 rouvre l'**intrus lexical** (point 8).

### (8) L'INTRUS LEXICAL — **exploitable dans les DEUX sens, SEPT questions tranchées à coup sûr**

`node tools/mesure-mot-question.js julia` : DÉFAUT 26,7 % avec **3 questions sûres**, EXCÈS
**31,5 %** avec **4 questions sûres**. Un mot porté par exactement 3 options sur 4 désigne la
quatrième à coup sûr ; un mot porté par une seule la désigne aussi. **Par mot, les quatre ou
aucune.**

**Lance `node tools/mesure-mot-question.js julia --plan` : il te donne, question par question, la
liste exacte des mots à ajouter ou à retirer, et il marque `[LA BONNE]` quand le porteur est
intouchable.** Cible = **couverture zéro**, pas « taux à 25 % ».

### (9) LE MOT FÉTICHE — **2 alertes, toutes deux du côté de la bonne réponse**

`node tools/mesure-mot-fetiche.js julia` :

| mot | bonnes / distracteurs | tranche | RESTREINDRE |
|---|---|---:|---:|
| `fonction` | **10 / 7** | 10 questions | **34,0 %** |
| `types` | **8 / 2** | 8 questions | **33,5 %** |
| `compilation` | 5 / 2 | 7 questions | 30,5 % |
| `arguments` | 5 / 2 | 6 questions | 30,1 % |

Place ces mots dans des distracteurs de tes questions — tu n'as pas le droit de toucher aux bonnes
réponses, donc **la seule action possible est l'ajout côté distracteur**.
⚠️ `parce` est à l'**inverse** (2 bonnes / 15 distracteurs, ECARTER 28,5 %) : n'ouvre pas tes
distracteurs par « Parce que » si la bonne réponse ne le fait pas.

### (10) ⚠️ LE DISTRACTEUR NE DOIT PAS DEVENIR UN MODE D'EMPLOI

Un distracteur long qui explique correctement la règle **avant** de se tromper enseigne la bonne
réponse. La fausseté doit être dans la **thèse**, pas dans une queue de phrase. Et la fausseté ne
doit pas non plus être un **conseil dangereux** qu'un débutant pourrait appliquer.

---

## Les contraintes de non-régression

1. **La bonne réponse et l'`explain` sont INTOUCHABLES.** Si tu es convaincu qu'une bonne réponse
   est fausse, **tu ne la corriges pas** : tu le remontes dans ton compte rendu, avec la preuve.
   C'est l'orchestrateur qui tranche.
2. **L'énoncé (`q`) est intouchable** de la même façon.
3. **Aucun distracteur ne doit devenir vrai.** C'est la faute la plus fréquente du chantier : sur
   `bdd`, un seul défaut de schéma a produit trois bonnes réponses fausses.
4. **Deux distracteurs ne doivent pas énoncer la même thèse** (ils s'éliminent l'un l'autre).
5. **Le JSON doit rester valide**, sans BOM, et les antislashes des littéraux (`\n`, `\"`) doivent
   rester échappés correctement. Contrôle : `node -e "JSON.parse(...)"` ou
   `node tools/verif-donnees.js`.
6. **Aucune URL externe** : pas de `cdnjs`, pas de `fonts.googleapis`, pas de `fonts.gstatic`.
7. **N'écris pas ton JSON par heredoc** : l'outil Bash mange un niveau d'antislash même dans un
   heredoc quoté. Édite le fichier avec l'outil d'édition.

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/plan-rangs-qcm.js julia
node tools/mesure-mot-question.js julia --plan
node tools/mesure-biais-qcm.js --seul=julia
node tools/mesure-biais-inverse.js --toutes julia
node tools/mesure-lexique-qcm.js --seul=julia
node tools/mesure-mot-fetiche.js julia
node tools/verif-html.js
```

**Cible : 25 % dans les DEUX sens, sur les 46 stratégies — 0 mot fétiche, 0 question « sûre »,
et une couverture nulle pour les indices de ponctuation.**

---

## ⚠️ Ce que les passes 39 à 48 ont appris sur la MÉTHODE

- **Mesure sur un état GELÉ, pas sur l'arbre vivant.** Au 46ᵉ cours, deux agents écrivaient en
  parallèle sur le même cours et le même outil a rendu `0 exploitable` / `3 exploitables` /
  `1 exploitable` à quelques minutes d'intervalle. Les mesures globales (`--seul=julia`) que tu
  lances pendant que cinq autres agents écrivent **ne valent rien** : mesure sur TON lot, et laisse
  la mesure d'ensemble à l'orchestrateur.
- **Un diagnostic qui n'est pas la COPIE EXACTE de l'outil fait travailler à côté.** Au 43ᵉ cours,
  une apostrophe traitée comme séparateur de mots a fait annoncer « 0 tranchée » là où l'outil en
  mesurait 22. N'écris pas ta propre sonde : lance les outils.
- **Fermer un indice à fond le RETOURNE.** Vise l'égalité des quatre, jamais l'extinction.
- **Fermer un indice peut le FAIRE MONTER** : une question tranchée à 0 vaut +0,25, une égalité à
  deux vaut +0,50. Un chiffre qui monte n'est pas forcément une régression — lis la couverture.
- **Relis le texte rendu, pas seulement le tableau.** Neuf contrôles verts sur une salade de mots
  est un résultat déjà obtenu deux fois.
- **⚠️ LE DOSAGE SE CALCULE, AVANT D'ÉCRIRE** (leçon du 47ᵉ, confirmée au 48ᵉ) : avant de fermer les
  `n` questions où un indice désigne la bonne réponse, calcule où tu emmènes son INVERSE. Fermer les
  20 questions d'un indice qui en tranche 20 porte son inverse à 33 % ; la cible 25 % demandait
  5 retouches, pas 20. **La cible n'est jamais « fermer », c'est « ramener à 25 % ».**
