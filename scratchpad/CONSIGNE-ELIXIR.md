# Consigne d'écriture — les QCM du cours `elixir` (B4, 48ᵉ cours)

Tu écris les **distracteurs** d'un lot de questions du cours `elixir` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, et tu ne
fais **aucun commit** : l'orchestrateur s'en charge.

Les QCM sont dans `pages/elixir/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-17`). Le schéma est
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

---

## ⚠️ CE COURS NE S'EXÉCUTE PAS — ET C'EST UNE CONTRAINTE, PAS UN CONFORT

`elixir` n'est **pas installé** dans cet environnement (`elixir --version` → *command not found*),
et `runner.js` ne pose un bouton « Tester » que sur du JavaScript. **Aucune de tes affirmations ne
pourra être prouvée par exécution.**

Conséquence directe, et elle est stricte : **tu n'écris un distracteur que sur un point que la page
elle-même établit**, ou qui relève du comportement documenté et non ambigu du langage. Si tu dois
supposer l'ordre de livraison de deux messages entre processus, le contenu exact d'un message
d'erreur du compilateur, le comportement du planificateur de la BEAM, ou ce que rend une version
donnée d'une bibliothèque (Phoenix, Ecto, `LiveView`), **tu ne l'écris pas** : tu le remontes dans
ton compte rendu.

⚠️ Attention particulière aux **versions** : ne fonde jamais une fausseté sur un point de version
que la page ne date pas (`Enum.sort_by` et ses options, `Kernel.dbg/2`, la syntaxe des `sigils`
personnalisés, les changements d'Ecto ou de Phoenix). Le 46ᵉ cours a fait refuser un encadré que la
page ne fondait pas ; le 47ᵉ a refusé quatre périmètres pour la même raison.

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien au cours réussit **91,7 %** des QCM d'`elixir` en cochant l'option
la plus longue — **couverture 96,8 %, rendement 93,4 %**. Ce n'est pas le seul indice ; relevé du
jour, `node tools/mesure-biais-qcm.js --seul=elixir` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **91,7 %** | **96,8 %** | **93,4 %** |
| la plus détaillée | **73,4 %** | 65,1 % | **97,6 %** |
| RESTREINDRE à la ponctuation forte | **63,4 %** | 52,4 % | **97,0 %** |
| la seule avec une PONCTUATION FORTE | **62,7 %** | 52,4 % | **97,0 %** |
| le mot technique exclusif | **60,8 %** | 58,7 % | 81,1 % |
| l'écho de la question | **58,1 %** | 54,0 % | 82,4 % |
| RESTREINDRE à la parenthèse | **55,3 %** | 41,3 % | 96,2 % |
| l'incise entre parenthèses | **54,1 %** | 38,1 % | **100 %** |
| RESTREINDRE au point-virgule | **50,5 %** | 33,3 % | **100 %** |
| la seule avec un point-virgule | **50,0 %** | 33,3 % | **100 %** |
| RESTREINDRE aux deux-points | **46,2 %** | 30,2 % | 94,7 % |
| la seule qui nie | **41,0 %** | 33,3 % | 66,7 % |
| ECARTER la moins bavarde | **40,7 %** | 9,5 % | **100 %** |
| la seule en deux phrases / point interne | **28,6 %** | 4,8 % | **100 %** |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## (b) Le travail est de l'**ALLONGEMENT**

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **107,5 caractères** |
| longueur moyenne d'un distracteur | **26,5 caractères** |
| **rapport** | **4,05** |
| rapport du 42ᵉ cours (`haskell`), le record | 5,06 |
| rapport du 47ᵉ cours (`go`) | 4,76 |
| médiane du même rapport sur les **47 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js elixir` demande **12 847 caractères** répartis sur **60 questions
sur 63**. Rangs actuels **59 / 1 / 2 / 1**, cible **16 / 16 / 16 / 15**.
**174 distracteurs sur 189 sont hors de la bande 70–130 %** ; la fourchette va de **0,07** à 2,67.

⚠️ **Le distracteur moyen fait 26 caractères** : « C'est l'inverse », « Les deux sont publiques »,
« dict() », « module ». Presque tout le travail est de la **rédaction neuve**, pas de la retouche.

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

Les erreurs vraiment commises en Elixir se rédigent facilement sur 80 à 200 caractères.
**N'utilise que celles que TA leçon établit** :

- croire que `x = 5` est une affectation, alors que `=` est l'opérateur de **correspondance** ;
- croire qu'un `x = x * 2` **mute** la donnée (c'est un *rebinding*, les données sont immuables) ;
- croire que `^x` déclare ou supprime une variable, au lieu d'**épingler** sa valeur pour la
  correspondance ;
- croire que `defp` est « plus rapide » ou « plus sûr », au lieu de **privé au module** ;
- croire que les clauses d'une fonction sont essayées dans un ordre arbitraire, ou qu'un
  attrape-tout placé **en premier** ne masque pas les suivantes ;
- confondre **liste chaînée** (`[h | t]`, prépendre en O(1), parcourir pour la queue) et **tableau
  contigu** ; croire que `length/1` est en O(1) ;
- confondre **tuple** (taille fixe, accès indexé) et **liste** ;
- croire qu'une **map** garantit un ordre d'itération, ou qu'une clé absente en notation `map.clé`
  rend `nil` plutôt que de lever ;
- croire qu'`Enum` est **paresseux** (il est glouton ; c'est `Stream` qui est paresseux), ou qu'un
  `Stream` produit un résultat sans `Enum.to_list/1`, `Enum.take/2`, etc. ;
- croire que `|>` passe la valeur en **dernier** argument (c'est le **premier**) ;
- croire que `with` est un `try/catch`, ou que son `else` capte les exceptions plutôt que les
  correspondances ratées ;
- croire que le couple `{:ok, valeur}` / `{:error, raison}` est **imposé par le langage** (c'est une
  convention), ou qu'une fonction en `!` renvoie un tuple d'erreur (elle **lève**) ;
- croire qu'un processus Elixir est un **thread système** ou un processus du système d'exploitation ;
- croire que deux processus **partagent la mémoire** (ils ne partagent rien : les messages sont
  copiés) ;
- croire que `send/2` est **bloquant** ou qu'il garantit la réception ;
- croire que `receive` prend le message **le plus récent** (il prend le **premier** de la boîte qui
  correspond à un motif) ;
- croire que `GenServer.cast/2` **attend** une réponse (c'est `call/3` qui attend), ou que
  `handle_call/3` renvoie la réponse ailleurs que dans `{:reply, réponse, état}` ;
- croire que l'état d'un `GenServer` est **global** ou partagé entre les appelants ;
- croire que la supervision **empêche** les plantages, alors qu'elle **redémarre** (*let it crash*) ;
- confondre `:one_for_one` et `:one_for_all` ;
- croire que `mix test` s'exécute dans l'environnement `:prod`, ou que `mix.exs` liste des fichiers
  plutôt que des **dépendances** ;
- croire qu'une **struct** hérite d'un parent, ou qu'elle accepte n'importe quelle clé (les clés
  sont fixées à la définition) ;
- croire qu'un **protocole** est de l'héritage, alors que c'est un **dispatch sur le type** ;
- croire que `Task.async/1` crée un thread système, ou qu'`Agent` rend l'état mutable partagé ;
- croire que `quote` **évalue** le code (il renvoie l'**AST**), ou qu'une macro s'exécute à
  l'exécution (elle s'exécute à la **compilation**) ;
- croire qu'Ecto charge les associations **automatiquement** (il n'y a pas de chargement paresseux :
  `Repo.preload/2`), ou qu'un `changeset` **écrit** en base (c'est `Repo.insert/1`).

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **91,7 %, couverture 96,8 %, rendement 93,4 %**

Suis **exactement** ce que rend `node tools/plan-rangs-qcm.js elixir` pour tes questions : le rang
visé et la bande de caractères option par option. Ne « corrige » pas le rang par intuition : la
cible **16 / 16 / 16 / 15** est une répartition de FICHIER, et la casser sur ton lot la casse pour
tout le monde.

### (2) ⚠️ LE NOMBRE DE MOTS SUIT LE RANG DE LONGUEUR

`la moins bavarde` tranche sur **69,8 %** des questions et sa DIRECTE est à **0,0 %** : autrement
dit, **écarter la plus courte en MOTS rend 33,3 %, le plafond théorique de l'inverse**. Allonger
avec quelques mots très longs ferme les caractères et laisse le compte de mots ouvert. **Le rang en
MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.**

### (3) ⚠️⚠️ LES QUATRE RANGS SONT EN ALERTE À L'INVERSE

`node tools/mesure-biais-inverse.js --toutes elixir` rend **5 alertes**, et quatre sont des rangs de
longueur :

| stratégie | tranche | DIRECTE | INVERSE |
|---|---:|---:|---:|
| la moins bavarde (peu de mots) | 44 | **0,0 %** | **33,3 %** |
| la DEUXIEME plus longue | 58 | 1,7 % | 32,8 % |
| la QUATRIEME plus longue | 57 | 1,8 % | 32,7 % |
| la TROISIEME plus longue | 54 | 1,9 % | 32,7 % |
| l'attaque unique | 13 | 15,4 % | 28,2 % |

**Une DIRECTE très basse sur une large couverture est le vrai défaut** : elle offre une élimination
sûre. Viser **25 % sur CHAQUE rang**, jamais 0 % sur le premier — c'est la règle du cours `sql`, et
elle vaut pour les **quatre** rangs.

### (4) LA PLUS DÉTAILLÉE — 73,4 %, couverture 65,1 %, **rendement 97,6 %**

La stratégie compte les `, : ;` d'une option. **Égalise ce compte sur les quatre options.** Fais
porter du **concret FAUX** à tes distracteurs : un identifiant réel de la bibliothèque standard
(`Enum`, `Stream`, `Process`, `GenServer`, `Supervisor`, `Task`, `Agent`, `Repo`) avec un effet
inventé, un chiffre précis mais faux, une option nommée qui n'existe pas.

### (5) LA PONCTUATION — trois marques à ~100 %, et il faut regarder l'UNION

Relevé brut du jour sur les 63 questions (comptage auxiliaire ; les couvertures de référence restent
celles de `mesure-biais-qcm`) :

| marque | bonnes / distracteurs | SEULE à la porter | la bonne l'emporte |
|---|---|---:|---:|
| **point-virgule** | 25 / 9 | **21 questions** | **100 %** |
| **virgule** | 39 / 17 | **31 questions** | 96,8 % |
| **deux-points** | 19 / 3 | **19 questions** | 94,7 % |
| **parenthèse** | 30 / 9 | **28 questions** | 92,9 % |
| MAJUSCULE | 13 / 12 | 12 questions | 66,7 % |
| barre oblique | 3 / 2 | 3 questions | 66,7 % |
| guillemets | 2 / 3 | 2 questions | 50,0 % |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'UNION**
(`la seule avec une PONCTUATION FORTE` = `:` ou `;` ou tiret, à **62,7 % et rendement 97,0 %**).
Fermer chaque marque séparément et laisser l'union ouverte ne sert à rien : c'est la leçon du
35ᵉ cours (`dataviz`).

⚠️ La MAJUSCULE est **déjà à 66,7 % sur 12 questions seulement** : ne la referme pas « à fond », tu
la retournerais. Et **n'invente pas de sigle** pour tenir un compte : au 45ᵉ cours, une majuscule
fermée par un mot a simplement **déplacé l'indice d'un cran, au même chiffre exact**.

### (6) LE MOT TECHNIQUE EXCLUSIF — 60,8 %, couverture 58,7 %, rendement 81,1 %

C'est **le rendement le plus haut vu sur cet indice depuis longtemps**. Les mots du domaine
(`processus`, `message`, `superviseur`, `module`, `clause`, `correspondance`, `immuable`,
`paresseux`, `atome`, `tuple`…) ne doivent pas être le privilège de la bonne réponse.
**Par mot technique : les quatre options le portent, ou aucune.**

### (7) L'ÉCHO DE L'ÉNONCÉ — 58,1 %, couverture 54,0 %, rendement 82,4 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé). ⚠️ Un identifiant court passe sous le radar de l'outil : au 46ᵉ cours, `job` (3 lettres)
faisait de la bonne réponse la seule à citer une cmdlet et **aucune stratégie ne le voyait**.
En Elixir, `:ok`, `iex`, `mix`, `pid`, `map`, `|>`, `^`, `!` sont dans ce cas : **compte-les à la
main**.

### (8) L'INDICE LEXICAL — ⚠️ **OUVERT DANS LES TROIS LECTURES À LA FOIS**

`node tools/mesure-lexique-qcm.js --seul=elixir` :

| lecture | couverture | rendement |
|---|---:|---:|
| STRICTE | 36,5 % | 26,1 % |
| PROPORTION | 52,4 % | 45,5 % |
| **INVERSE** | **49,2 %** | **51,6 %** |

**Aucun des 47 cours précédents n'a présenté cette configuration.** La bonne réponse porte à la fois
beaucoup de mots de la page **et** beaucoup de mots étrangers à la page — parce qu'elle est
simplement quatre fois plus longue que ses distracteurs.

**RÈGLE DU `k` : soit `k` le nombre de mots de 6 lettres et plus absents de la page que porte une
option — les QUATRE options doivent porter le MÊME `k`.** Ni 0/0/k (qui laisse 50 % en RESTREINDRE),
ni « aucun étranger partout » (qui retourne l'indice).

**RÈGLE DU `w`** : soit `w` le nombre de mots de 6 lettres et plus d'une option — les quatre valeurs
doivent rester proches. `w` et `k` se règlent **séparément**.

⚠️⚠️ **DEUX RÈGLES APPRISES AU 47ᵉ COURS, ET ELLES ONT COÛTÉ DEUX ALLERS-RETOURS CHACUNE** :
1. **Un mot de remplacement doit être PRÉSENT dans la page ET faire moins de 9 lettres.** Un
   substitut absent de la page fait exploser la lecture STRICTE (10,5 % → 50,0 % au 47ᵉ) ; un
   substitut de 9 lettres et plus reste compté comme « mot long ». Le contrôle est un `grep` de
   trois secondes : fais-le **avant** d'écrire.
2. **Pose le substitut dans DEUX distracteurs à la fois**, jamais un seul : un mot porté par
   exactement 1 ou 3 options sur 4 rouvre l'**intrus lexical** (point 10).

### (9) LE MOT FÉTICHE — **3 alertes, toutes du côté de la bonne réponse**

`node tools/mesure-mot-fetiche.js elixir` :

| mot | bonnes / distracteurs | tranche | RESTREINDRE |
|---|---|---:|---:|
| `processus` | **11 / 3** | 12 questions | **36,1 %** |
| `fonction` | **10 / 3** | 11 questions | **34,9 %** |
| `valeur` | 5 / 6 | 8 questions | **28,7 %** |

Place ces mots dans des distracteurs de tes questions — tu n'as pas le droit de toucher aux bonnes
réponses, donc **la seule action possible est l'ajout côté distracteur**.

### (10) L'INTRUS LEXICAL — **exploitable dans les DEUX sens**

`node tools/mesure-mot-question.js elixir` : DÉFAUT 22,0 % avec **2 questions sûres**, EXCÈS
**29,4 %** avec **1 question sûre**. Un mot porté par exactement 3 options sur 4 désigne la
quatrième à coup sûr ; un mot porté par une seule la désigne aussi. **Par mot, les quatre ou
aucune.**

**Lance `node tools/mesure-mot-question.js elixir --plan` : il te donne, question par question, la
liste exacte des mots à ajouter ou à retirer, et il marque `[LA BONNE]` quand le porteur est
intouchable.** Cible = **couverture zéro**, pas « taux à 25 % ».

### (11) ⚠️ LE DISTRACTEUR NE DOIT PAS DEVENIR UN MODE D'EMPLOI

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
node tools/plan-rangs-qcm.js elixir
node tools/mesure-mot-question.js elixir --plan
node tools/mesure-biais-qcm.js --seul=elixir
node tools/mesure-biais-inverse.js --toutes elixir
node tools/mesure-lexique-qcm.js --seul=elixir
node tools/mesure-mot-fetiche.js elixir
node tools/verif-html.js
```

**Cible : 25 % dans les DEUX sens, sur les 46 stratégies — 0 mot fétiche, 0 question « sûre »,
et une couverture nulle pour les indices de ponctuation.**

---

## ⚠️ Ce que les passes 39 à 47 ont appris sur la MÉTHODE

- **Mesure sur un état GELÉ, pas sur l'arbre vivant.** Au 46ᵉ cours, deux agents écrivaient en
  parallèle sur le même cours et le même outil a rendu `0 exploitable` / `3 exploitables` /
  `1 exploitable` à quelques minutes d'intervalle. Les mesures globales (`--seul=elixir`) que tu
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
- **Le DOSAGE se CALCULE** (leçon du 47ᵉ) : avant de fermer les `n` questions où un indice désigne
  la bonne réponse, calcule où tu emmènes son INVERSE. Fermer les 20 questions d'un indice qui en
  tranche 20 porte son inverse à 33 % ; la cible 25 % demandait 5 retouches, pas 20.
