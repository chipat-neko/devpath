# Consigne d'écriture — les QCM du cours `nosql` (B4, 50ᵉ cours)

Tu écris les **distracteurs** d'un lot de questions du cours `nosql` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, et tu ne
fais **aucun commit** : l'orchestrateur s'en charge.

Les QCM sont dans `pages/nosql/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-14`). Le schéma est
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

**Écris tes scripts jetables dans TON dossier scratch à toi** (`scratchpad/nosql-<ton lot>/`) :
deux agents qui écrivent dans le même dossier temporaire s'écrasent mutuellement.

---

## ⚠️ CE COURS NE S'EXÉCUTE PAS — ET C'EST UNE CONTRAINTE, PAS UN CONFORT

Aucun moteur NoSQL n'est installé dans cet environnement (ni MongoDB, ni Redis, ni Cassandra, ni
Neo4j, ni Elasticsearch), et `runner.js` ne pose un bouton « Tester » que sur du JavaScript.
**Aucune de tes affirmations ne pourra être prouvée par exécution.**

Conséquence directe, et elle est stricte : **tu n'écris un distracteur que sur un point que la page
elle-même établit**, ou qui relève du comportement documenté et non ambigu du modèle décrit. Si tu
dois supposer le texte exact d'un message d'erreur, un chiffre de latence, un nombre de nœuds par
défaut, le nom exact d'une option d'un pilote, ou ce que rend une **version** donnée d'un moteur
(les transactions multi-documents de MongoDB, les niveaux de cohérence de Cassandra, la politique
d'éviction de Redis, le nommage des types de champs d'Elasticsearch, les index vectoriels HNSW/IVF),
**tu ne l'écris pas** : tu le remontes dans ton compte rendu.

⚠️ Attention particulière aux **versions** : ne fonde jamais une fausseté sur un point de version
que la page ne date pas. Les 46ᵉ à 49ᵉ cours ont fait refuser quatre à six périmètres chacun pour
cette raison exacte.

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien au cours réussit **99,1 %** des QCM de `nosql` en cochant l'option
la plus longue — **couverture 98,2 %, rendement 100,0 %**. C'est **le cours le plus tordu qu'ait
rencontré B4 depuis `stats`** : la bonne réponse est la plus longue dans **toutes** les questions
tranchées, sans une seule exception. Relevé du jour, `node tools/mesure-biais-qcm.js --seul=nosql` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **99,1 %** | **98,2 %** | **100,0 %** |
| la plus détaillée | **78,1 %** | 70,2 % | **100,0 %** |
| le mot technique exclusif | **73,8 %** | 77,2 % | 86,4 % |
| RESTREINDRE à la parenthèse | **68,3 %** | 57,9 % | **100,0 %** |
| l'incise entre parenthèses | **63,1 %** | 50,9 % | **100,0 %** |
| la seule avec une PONCTUATION FORTE | **49,5 %** | 35,1 % | 95,0 % |
| ECARTER la moins bavarde | **43,4 %** | 8,8 % | **100,0 %** |
| RESTREINDRE aux deux-points | **40,7 %** | 22,8 % | 92,3 % |
| l'écho de la question | **40,1 %** | 29,8 % | 64,7 % |
| RESTREINDRE au point-virgule | **33,2 %** | 10,5 % | **100,0 %** |
| la seule avec une barre oblique | **31,5 %** | 8,8 % | **100,0 %** |
| l'attaque unique | **31,1 %** | 31,6 % | 44,4 % |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## (b) Le travail est de l'**ALLONGEMENT**

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **111,8 caractères** |
| longueur moyenne d'un distracteur | **32,8 caractères** |
| **rapport** | **3,41** |
| rapport du 42ᵉ cours (`haskell`), le record | 5,06 |
| rapport du 49ᵉ cours (`julia`) | 4,16 |
| médiane du même rapport sur les **49 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js nosql` demande **11 059 caractères** répartis sur **56 questions
sur 57**. Rangs actuels **57 / 0 / 0 / 0**, cible **15 / 14 / 14 / 14**.

⚠️ **Le distracteur moyen fait 33 caractères** : « Elles sont identiques », « Il n'a que des
avantages », « À chiffrer la valeur ». Presque tout le travail est de la **rédaction neuve**, pas
de la retouche.

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

Les erreurs vraiment commises en NoSQL se rédigent facilement sur 80 à 200 caractères.
**N'utilise que celles que TA leçon établit** :

- croire que « NoSQL » veut dire **« pas de base de données »** ou « l'inverse de SQL », au lieu de
  *Not only SQL* : une famille de modèles de données non relationnels ;
- croire que le NoSQL **remplace** le relationnel partout, au lieu de répondre à d'autres besoins ;
- croire que l'absence de schéma signifie **absence de modèle** : le schéma passe du serveur à
  l'application, il ne disparaît pas ;
- confondre **scalabilité verticale** (une machine plus grosse) et **horizontale** (plus de
  machines) ;
- croire qu'ACID et BASE sont deux noms de la même chose, ou que BASE veut dire « sans garantie » ;
- croire que le **C** de CAP est la *cohérence ACID*, que le théorème permet de choisir les trois à
  la fois, ou qu'on choisit entre C, A et P alors que **P s'impose** dès qu'il y a réseau ;
- croire que la **cohérence à terme** signifie « les données finissent par être perdues » ou
  « jamais cohérentes » ;
- confondre **collection / document** avec **table / ligne** au mauvais endroit (une collection est
  l'équivalent d'une table, un document d'une ligne — mais un document est **imbriqué et
  hétérogène**) ;
- croire que la **dénormalisation** économise l'espace disque (elle en consomme plus : elle échange
  de l'espace et de la duplication contre des lectures sans jointure) ;
- croire qu'une base **clé-valeur** sait interroger par le contenu de la valeur (elle n'interroge
  que par la clé) ;
- croire qu'une base **orientée colonnes** stocke une colonne par ligne, ou que c'est juste un
  tableur ;
- croire qu'une base **graphe** est un SGBD relationnel avec des jointures rapides, ou qu'un
  parcours de graphe coûte le même prix qu'une jointure de profondeur équivalente ;
- croire qu'un **index** accélère aussi les écritures (il les ralentit : chaque écriture met l'index
  à jour) ou qu'il est gratuit en espace ;
- croire qu'un index **composé** sert autant quel que soit l'ordre de ses champs (le préfixe compte) ;
- croire qu'une **agrégation** se fait forcément côté application, ou que les étapes d'un pipeline
  s'exécutent dans un ordre indifférent (filtrer d'abord réduit le volume des étapes suivantes) ;
- confondre **réplication** (copies de la même donnée, disponibilité et lecture) et
  **partitionnement / sharding** (découpage de la donnée, capacité d'écriture) ;
- croire qu'une **clé de partition** mal choisie n'a pas de conséquence, au lieu de produire un
  **point chaud** ;
- croire qu'un quorum `W + R > N` garantit la disponibilité plutôt que la **lecture de la dernière
  écriture** ;
- croire que « sans transaction » signifie « sans atomicité du tout » : l'atomicité existe au
  niveau du **document** ;
- croire qu'une base NoSQL est **sécurisée par défaut** (la leçon dit l'inverse : authentification
  à activer, port à ne pas exposer) ;
- croire qu'une base de **séries temporelles** est une base document avec un champ date, ou que le
  *downsampling* supprime les données sans les agréger ;
- croire qu'un **index inversé** associe un document à ses mots (c'est l'inverse : un **terme** vers
  la liste des documents qui le contiennent), ou que la recherche plein texte est un `LIKE %mot%` ;
- confondre **analyse** (tokenisation, normalisation) et **stockage brut** du texte ;
- croire qu'une base **vectorielle** cherche des mots identiques, au lieu d'une **proximité** dans
  un espace de plongement ; croire que la recherche approchée (ANN) rend toujours le voisin exact ;
- croire que la dimension d'un vecteur peut varier d'un document à l'autre dans un même index.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **99,1 %, couverture 98,2 %, rendement 100,0 %**

Suis **exactement** ce que rend `node tools/plan-rangs-qcm.js nosql` pour tes questions : le rang
visé et la bande de caractères option par option. Ne « corrige » pas le rang par intuition : la
cible **15 / 14 / 14 / 14** est une répartition de FICHIER, et la casser sur ton lot la casse pour
tout le monde.

### (2) ⚠️⚠️ LES QUATRE RANGS ONT UNE DIRECTE DE **0,0 % EXACTEMENT**

`node tools/mesure-biais-inverse.js --toutes nosql` rend **4 alertes**, et les quatre sont au
plafond théorique :

| stratégie | tranche | part | DIRECTE | INVERSE |
|---|---:|---:|---:|---:|
| la DEUXIEME plus longue | 54 | 94,7 % | **0,0 %** | **33,2 %** |
| la QUATRIEME plus longue | 54 | 94,7 % | **0,0 %** | **33,2 %** |
| la TROISIEME plus longue | 52 | 91,2 % | **0,0 %** | **33,2 %** |
| la moins bavarde (peu de mots) | 37 | 64,9 % | **0,0 %** | **33,1 %** |

**Une DIRECTE à 0,0 % sur une large couverture est le pire défaut possible** : elle offre une
élimination *certaine*. Viser **25 % sur CHAQUE rang**, jamais 0 % — règle du cours `sql`.

**LE NOMBRE DE MOTS SUIT LE RANG DE LONGUEUR.** `la moins bavarde` tranche sur 64,9 % des questions
avec une DIRECTE à 0,0 % : allonger avec quelques mots très longs ferme les caractères et laisse le
compte de mots ouvert. **Le rang en MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.**

### (3) LA PLUS DÉTAILLÉE — 78,1 %, couverture 70,2 %, **rendement 100,0 %**

La stratégie compte les `, : ;` d'une option. **Égalise ce compte sur les quatre options.** Fais
porter du **concret FAUX** à tes distracteurs : un nom réel de moteur ou d'opérateur (`MongoDB`,
`Redis`, `Cassandra`, `Neo4j`, `Elasticsearch`, `$match`, `$group`, `SETEX`, `MATCH`) avec un effet
inventé, un chiffre précis mais faux, une option nommée qui n'existe pas.

### (4) LA PONCTUATION — la PARENTHÈSE est à **33 bonnes / 0 distracteur**

Relevé brut du jour sur les 57 questions (comptage auxiliaire ; les couvertures de référence restent
celles de `mesure-biais-qcm`) :

| marque | bonnes / distracteurs | SEULE à la porter | la bonne l'emporte |
|---|---|---:|---:|
| **parenthèse** | **33 / 0** | **33 questions** | **100,0 %** |
| **virgule** | **32 / 10** | **29 questions** | **96,6 %** |
| **deux-points** | **13 / 2** | **13 questions** | **92,3 %** |
| **point-virgule** | **7 / 1** | **6 questions** | **100,0 %** |
| barre oblique | 5 / 0 | 5 questions | **100,0 %** |
| guillemets | 3 / 1 | 2 questions | 100,0 % |
| tiret cadratin | 1 / 0 | 1 question | 100,0 % |
| MAJUSCULE | 9 / 15 | 13 questions | **38,5 %** |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'UNION**
(`la seule avec une PONCTUATION FORTE` = `:` ou `;` ou tiret, à **49,5 % et rendement 95,0 %**).
Fermer chaque marque séparément et laisser l'union ouverte ne sert à rien : leçon du 35ᵉ cours.

⚠️ La MAJUSCULE est **déjà à 38,5 %**, c'est-à-dire du côté des distracteurs : n'y touche pas, tu la
retournerais. Et **n'invente pas de sigle** pour tenir un compte : au 45ᵉ cours, une majuscule
fermée par un mot a simplement **déplacé l'indice d'un cran, au même chiffre exact**.
⚠️ `ACID`, `BASE`, `CAP`, `NoSQL`, `SQL`, `JSON`, `TTL`, `ANN` sont des majuscules **de contenu** :
compte-les, mais ne les ajoute pas artificiellement à un distracteur qui n'en parle pas.

### (5) LE MOT TECHNIQUE EXCLUSIF — 73,8 %, couverture 77,2 %, rendement 86,4 %

Les mots du domaine (`réplication`, `partitionnement`, `cohérence`, `dénormalisation`, `agrégation`,
`disponibilité`, `document`, `collection`, `indexation`, `similarité`, `tolérance`…) ne doivent pas
être le privilège de la bonne réponse. **Par mot technique : les quatre options le portent, ou
aucune.**

⚠️⚠️ **CET INDICE EST EN TENSION STRUCTURELLE AVEC L'INTRUS LEXICAL (point 8) — leçon du 48ᵉ cours.**
`le mot technique exclusif` désigne l'option qui porte le plus de mots de **9 lettres et plus**
qu'aucune autre n'emploie. La bonne réponse étant intouchable, le fermer en ajoutant un mot de
9+ lettres **exclusif à un distracteur** est exactement ce que l'intrus lexical compte en EXCÈS.
**La seule issue qui ferme les deux est de reprendre un mot de 9+ lettres de la bonne réponse et de
le poser dans les TROIS distracteurs** (4/4 = neutre pour l'intrus, et le mot cesse d'être exclusif).
Coût mesuré : ~45 caractères par question — **compte-les dans ta bande de longueur**.

### (6) L'ÉCHO DE L'ÉNONCÉ — 40,1 %, couverture 29,8 %, rendement 64,7 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé). ⚠️ Un identifiant court passe sous le radar de l'outil : au 46ᵉ cours, `job` (3 lettres)
faisait de la bonne réponse la seule à citer une cmdlet et **aucune stratégie ne le voyait**.
En NoSQL, `clé`, `CAP`, `TTL`, `ANN`, `id`, `_id`, `W`, `R`, `N`, `$` sont dans ce cas :
**compte-les à la main**.

⚠️ `l'attaque unique` est à **31,1 % (couverture 31,6 %)** : la bonne réponse commence souvent par un
mot que nulle autre option n'emploie en tête. **Varie les attaques de tes distracteurs**, et ne les
commence pas tous par la même formule.

### (7) L'INDICE LEXICAL — ouvert dans les trois lectures

`node tools/mesure-lexique-qcm.js --seul=nosql` :

| lecture | couverture | rendement |
|---|---:|---:|
| STRICTE | 42,1 % | **54,2 %** |
| PROPORTION | **59,6 %** | **58,8 %** |
| INVERSE | 54,4 % | 29,0 % |

**RÈGLE DU `k` : soit `k` le nombre de mots de 6 lettres et plus absents de la page que porte une
option — les QUATRE options doivent porter le MÊME `k`.** Ni 0/0/k (qui laisse 50 % en RESTREINDRE),
ni « aucun étranger partout » (qui retourne l'indice).

**RÈGLE DU `w`** : soit `w` le nombre de mots de 6 lettres et plus d'une option — les quatre valeurs
doivent rester proches. `w` et `k` se règlent **séparément**.

⚠️⚠️ **DEUX RÈGLES APPRISES AU 47ᵉ COURS, ET ELLES ONT COÛTÉ DEUX ALLERS-RETOURS CHACUNE** :
1. **Un mot de remplacement doit être PRÉSENT dans la page ET faire moins de 9 lettres.** Un
   substitut absent de la page fait exploser la lecture STRICTE ; un substitut de 9 lettres et plus
   reste compté comme « mot long ». Le contrôle est un `grep` de trois secondes : fais-le **avant**
   d'écrire. ⚠️ `grep -ci` sur une **racine** ment : l'outil compare des **jetons entiers**
   (« document » ≠ « documents ») — cherche le mot entier, pas sa racine (leçon du 44ᵉ cours).
2. **Pose le substitut dans DEUX distracteurs à la fois**, jamais un seul : un mot porté par
   exactement 1 ou 3 options sur 4 rouvre l'**intrus lexical** (point 8).

### (8) L'INTRUS LEXICAL — DÉFAUT 24,0 % avec **2 questions sûres**, EXCÈS 26,2 %

`node tools/mesure-mot-question.js nosql`. Un mot porté par exactement 3 options sur 4 désigne la
quatrième à coup sûr ; un mot porté par une seule la désigne aussi. **Par mot, les quatre ou
aucune.**

**Lance `node tools/mesure-mot-question.js nosql --plan` : il te donne, question par question, la
liste exacte des mots à ajouter ou à retirer, et il marque `[LA BONNE]` quand le porteur est
intouchable.** Cible = **couverture zéro**, pas « taux à 25 % ».

⚠️ L'indice est **bas au départ** : c'est la correction qui le fabrique. Mesure-le **après** avoir
écrit, pas seulement avant.

### (9) LE MOT FÉTICHE — **3 alertes, toutes trois du côté de la bonne réponse**

`node tools/mesure-mot-fetiche.js nosql` :

| mot | bonnes / distracteurs | tranche | RESTREINDRE |
|---|---|---:|---:|
| `chaque` | **6 / 3** | 9 questions | **31,7 %** |
| `données` | **10 / 14** | 19 questions | **30,5 %** |
| `documents` | **8 / 11** | 16 questions | **29,5 %** |
| `valeur` | 5 / 2 | 6 questions | 30,4 % |
| `plusieurs` | 5 / 3 | 7 questions | 29,9 % |
| `serveurs` | 4 / 2 | 6 questions | 29,5 % |

Place ces mots dans des distracteurs de tes questions — tu n'as pas le droit de toucher aux bonnes
réponses, donc **la seule action possible est l'ajout côté distracteur**.
⚠️ `parce` est à l'**inverse** (6 bonnes / 22 distracteurs) : n'ouvre pas tes distracteurs par
« Parce que » si la bonne réponse ne le fait pas. Même remarque pour `chiffrer` (0/7),
`transactions` (0/6), `uniquement` (1/6), `toute` (1/5), `supprimer` (1/5) : ces mots sont déjà
**marqueurs de distracteur**, ne les multiplie pas.

### (10) ⚠️ LE DISTRACTEUR NE DOIT PAS DEVENIR UN MODE D'EMPLOI

Un distracteur long qui explique correctement la règle **avant** de se tromper enseigne la bonne
réponse. La fausseté doit être dans la **thèse**, pas dans une queue de phrase. Et la fausseté ne
doit pas non plus être un **conseil dangereux** qu'un débutant pourrait appliquer (ici : exposer un
port, désactiver l'authentification, « les sauvegardes sont inutiles »).

### (11) LES TROIS RÉSULTATS DE LA PASSE `julia`, À APPLIQUER ICI

1. **Retourner « la plus dense » se fait en RETIRANT de petits mots**, pas en ajoutant des mots
   longs. Ici `la plus dense` est à **26,3 % avec une couverture de 100 %** : elle est déjà au
   niveau du hasard, **ne la casse pas** en bourrant tes distracteurs de mots longs.
2. **Un tic de LOT rend 100 % et aucun outil ne le voit.** Une **locution** (`et/ou`, `c'est-à-dire`),
   un **signe** (`…`), un **gabarit de phrase** (« X, donc Y ») répété dans tes seuls distracteurs
   ou dans tes seules bonnes réponses tranche à coup sûr. **Cherche-le au `grep` après écriture**,
   sur TON lot, et compare au reste du cours.
3. **Trois distracteurs de même longueur livrent `ECARTER la plus courte` à 100 %** : les écarter ne
   laisse que la bonne réponse. Ici l'indice est déjà à **34,1 % avec une couverture de 0,0 %** —
   c'est-à-dire fermé. **Écarte tes trois distracteurs les uns des autres d'au moins 15 caractères.**
4. **Un seul distracteur absolutiste (« toujours », « jamais », « aucun ») fait désigner les trois
   autres**, bonne réponse comprise — il faut **0, 2 ou 3** porteurs par question, jamais 1.

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
8. **Pas de CRLF, pas de BOM.** L'outil d'édition écrit parfois en CRLF : vérifie à la fin
   (`node -e "const s=require('fs').readFileSync(f); console.log(s.includes(13), s[0]===0xEF)"`).

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/plan-rangs-qcm.js nosql
node tools/mesure-mot-question.js nosql --plan
node tools/mesure-biais-qcm.js --seul=nosql
node tools/mesure-biais-inverse.js --toutes nosql
node tools/mesure-lexique-qcm.js --seul=nosql
node tools/mesure-mot-fetiche.js nosql
node tools/verif-html.js
```

**Cible : 25 % dans les DEUX sens, sur les 46 stratégies — 0 mot fétiche, 0 question « sûre »,
et une couverture nulle pour les indices de ponctuation.**

---

## ⚠️ Ce que les passes 39 à 49 ont appris sur la MÉTHODE

- **Mesure sur un état GELÉ, pas sur l'arbre vivant.** Les mesures globales (`--seul=nosql`) que tu
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
