# Consigne d'écriture — les QCM du cours `go` (B4, 47ᵉ cours)

Tu écris les **distracteurs** d'un lot de questions du cours `go` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, et tu ne
fais **aucun commit** : l'orchestrateur s'en charge.

---

## ⚠️ CE COURS NE S'EXÉCUTE PAS — ET C'EST UNE CONTRAINTE, PAS UN CONFORT

`go` n'est **pas installé** dans cet environnement (`go version` → *command not found*), et
`runner.js` ne pose un bouton « Tester » que sur du JavaScript. **Aucune de tes affirmations ne
pourra être prouvée par exécution.**

Conséquence directe, et elle est stricte : **tu n'écris un distracteur que sur un point que la page
elle-même établit**, ou qui relève du comportement documenté et non ambigu du langage. Si tu dois
supposer ce que rend `go vet`, ce que fait le *race detector* sur une machine donnée, ou l'ordre de
sortie de deux goroutines, **tu ne l'écris pas** : tu le remontes dans ton compte rendu. C'est
exactement la règle qui a fait refuser, au 46ᵉ cours, un encadré que la page ne fondait pas.

⚠️ Attention particulière aux **versions** : le cours peut enseigner les génériques (`any`,
contraintes de type, `slices`/`maps`), `errors.Is`/`errors.As`, le `for range` sur un entier, ou
la capture des variables de boucle **changée en Go 1.22**. Un distracteur du type « la variable de
boucle est partagée par toutes les goroutines » est **vrai avant 1.22 et faux après** : ne fonde
jamais une fausseté sur un point dont la page ne dit pas la version.

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien au cours réussit **94,4 %** des QCM de `go` en cochant l'option
la plus longue — **couverture 98,4 %, rendement 95,1 %**. Ce n'est pas le seul indice :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **94,4 %** | **98,4 %** | **95,1 %** |
| la plus détaillée | **84,7 %** | 77,4 % | **100 %** |
| RESTREINDRE à la parenthèse | **77,0 %** | 71,0 % | 97,7 % |
| l'incise entre parenthèses | **74,6 %** | 67,7 % | 97,6 % |
| RESTREINDRE à la ponctuation forte | **74,6 %** | 64,5 % | **100 %** |
| la seule avec une PONCTUATION FORTE | **73,4 %** | 64,5 % | **100 %** |
| le mot technique exclusif | **73,1 %** | 66,1 % | 92,7 % |
| RESTREINDRE aux deux-points | **56,0 %** | 40,3 % | **100 %** |
| l'écho de la question | **54,6 %** | 53,2 % | 72,7 % |
| RESTREINDRE au point-virgule | **49,6 %** | 32,3 % | **100 %** |
| ECARTER la moins bavarde | **44,2 %** | 11,3 % | **100 %** |
| la seule qui nie | **36,7 %** | 38,7 % | 41,7 % |
| la seule avec une barre oblique | **33,1 %** | 12,9 % | 87,5 % |
| la seule en deux phrases / RESTREINDRE au point interne | **32,3 %** | 9,7 % | **100 %** |
| la seule avec des guillemets | **28,6 %** | 4,8 % | **100 %** |

**Ton lot doit ramener chaque indice à 25 %, l'étalon du hasard.** On ne rend pas les questions plus
difficiles : on rend les **distracteurs crédibles**.

---

## (b) Le travail est de l'**ALLONGEMENT**, et le déséquilibre est le deuxième du chantier

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **123,0 caractères** |
| longueur moyenne d'un distracteur | **25,8 caractères** |
| **rapport** | **4,76** |
| rapport du 42ᵉ cours (`haskell`), le record | 5,06 |
| rapport du 46ᵉ cours (`powershell`) | 3,97 |
| médiane du même rapport sur les **46 cours déjà traités** | ~1,0 |

`node tools/plan-rangs-qcm.js go` demande **15 184 caractères** répartis sur **58 questions
sur 62**. Rangs actuels **59 / 1 / 0 / 2**, cible **16 / 16 / 15 / 15**.
**177 distracteurs sur 186 sont hors de la bande 70–130 %** ; la fourchette va de **0,03** à 4,17.

⚠️ **Le distracteur moyen fait 26 caractères** : « Avec throw », « loop », « dict() », « Les deux
valent nil ». Presque tout le travail est de la **rédaction neuve**, pas de la retouche.

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

Les erreurs vraiment commises en Go sont nombreuses et se rédigent facilement sur 80 à
200 caractères. **N'utilise que celles que ta leçon établit** :

- croire que `:=` marche au niveau package (il n'y marche pas, il faut `var`) ;
- croire qu'une variable déclarée non utilisée est un simple avertissement (c'est une **erreur de
  compilation**) ;
- croire que la casse de l'initiale est une convention de style et non la règle d'**export** ;
- croire qu'`append` modifie toujours la tranche en place, ou qu'il ne réalloue jamais ;
- confondre **tableau** `[3]T` (taille dans le type, copié par valeur) et **tranche** `[]T` ;
- croire que `len` et `cap` sont la même chose, ou qu'une tranche vide et `nil` sont identiques ;
- croire qu'une `map` garantit l'ordre d'itération, ou qu'une lecture de clé absente panique ;
- croire que `v, ok := m[k]` sert à autre chose qu'à distinguer « absent » de « zéro » ;
- croire qu'une méthode à récepteur **valeur** peut modifier son receveur ;
- croire qu'une interface vaut `nil` dès que la valeur qu'elle porte vaut `nil` ;
- croire que `defer` s'exécute à la fin du bloc (c'est à la fin de la **fonction**), ou que ses
  arguments sont évalués au moment de l'exécution (ils le sont à la **déclaration**) ;
- croire que `panic`/`recover` est l'équivalent de `try`/`catch` et s'emploie pour le contrôle de
  flux ordinaire ;
- croire qu'une erreur se compare avec `==` sur le message, plutôt qu'avec `errors.Is` ;
- croire qu'une goroutine est un thread système, ou que `go f()` attend le retour de `f` ;
- croire qu'un canal non bufferisé ne bloque pas, ou que fermer un canal libère la mémoire ;
- croire qu'on peut lire un canal fermé et obtenir une erreur (on obtient la valeur zéro) ;
- croire qu'un `select` sans `default` fait tourner le processeur à vide ;
- croire qu'un `sync.Mutex` copié conserve son verrou ;
- croire que `go build` exécute et `go run` compile (c'est l'inverse) ;
- croire que `gofmt` est optionnel et que le style est affaire de goût.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — **94,4 %, couverture 98,4 %, rendement 95,1 %**

Suis **exactement** ce que rend `node tools/plan-rangs-qcm.js go` pour tes questions : le rang visé
et la bande de caractères option par option. Ne « corrige » pas le rang par intuition : la cible
**16 / 16 / 15 / 15** est une répartition de FICHIER, et la casser sur ton lot la casse pour tout le
monde.

### (2) ⚠️ LE NOMBRE DE MOTS SUIT LE RANG DE LONGUEUR

`la moins bavarde` tranche sur **62,9 %** des questions et sa DIRECTE est à **2,6 %** : autrement
dit, **écarter la plus courte en MOTS rend 32,5 %**. Allonger avec quelques mots très longs ferme
les caractères et laisse le compte de mots ouvert. **Le rang en MOTS de la bonne réponse doit valoir
son rang en CARACTÈRES.**

### (3) ⚠️⚠️ LE RANG 3 EXISTE MAINTENANT, ET `go` EST DÉJÀ EN ALERTE DESSUS

Le 46ᵉ indice a été câblé au cours précédent : **`la QUATRIEME plus longue`**, c'est-à-dire *la plus
courte*. Sur `go`, elle tranche **59 questions (95,2 %)** avec une DIRECTE de **3,4 %** — donc
**l'ÉCARTER rend 32,2 %**. Les quatre alertes du sens inverse sont toutes des rangs de longueur :

| stratégie | tranche | DIRECTE | INVERSE |
|---|---:|---:|---:|
| la TROISIEME plus longue | 55 | 0,0 % | **33,3 %** |
| la DEUXIEME plus longue | 57 | 1,8 % | 32,7 % |
| la moins bavarde | 39 | 2,6 % | 32,5 % |
| la QUATRIEME plus longue | 59 | 3,4 % | 32,2 % |

**Une DIRECTE très basse sur une large couverture est le vrai défaut** : elle offre une élimination
sûre. Viser **25 % sur CHAQUE rang**, jamais 0 % sur le premier — c'est la règle du cours `sql`, et
elle vaut maintenant pour les **quatre** rangs.

### (4) LA PLUS DÉTAILLÉE — 84,7 %, couverture 77,4 %, **rendement 100 %**

La stratégie compte les `, : ;` d'une option. **Égalise ce compte sur les quatre options.** Fais
porter du **concret FAUX** à tes distracteurs : un identifiant réel de la bibliothèque standard avec
un effet inventé, un chiffre précis mais faux, une condition nommée qui n'existe pas.

### (5) LA PONCTUATION — trois marques à **100 %**, et il faut regarder l'UNION

Relevé du jour sur les 62 questions :

| marque | bonnes / distracteurs | SEULE à la porter | la bonne l'emporte |
|---|---|---:|---:|
| **deux-points** | 27 / 2 | **25 questions** | **100 %** |
| **point-virgule** | 22 / 4 | **20 questions** | **100 %** |
| **point interne** | 8 / 0 | **8 questions** | **100 %** |
| guillemets | 5 / 2 | 4 questions | **100 %** |
| parenthèse | 47 / 15 | **45 questions** | 93,3 % |
| virgule | 35 / 9 | 30 questions | 93,3 % |
| barre oblique | 8 / 3 | 8 questions | 87,5 % |
| MAJUSCULE | 7 / 11 | 6 questions | 50,0 % |

**Règle : par marque, les quatre options la portent, ou aucune — ET vérifie aussi l'UNION**
(`la seule avec une PONCTUATION FORTE` = `:` ou `;` ou tiret, à **73,4 % et rendement 100 %**).
Fermer chaque marque séparément et laisser l'union ouverte ne sert à rien : c'est la leçon du
35ᵉ cours (`dataviz`).

⚠️ La MAJUSCULE est **déjà à 50 %** : ne la referme pas « à fond », tu la retournerais. Et
**n'invente pas de sigle** pour tenir un compte : au 45ᵉ cours, une majuscule fermée par un mot a
simplement **déplacé l'indice d'un cran, au même chiffre exact**.

### (6) LE MOT TECHNIQUE EXCLUSIF — 73,1 %, couverture 66,1 %, rendement 92,7 %

DIRECTE **73,1 %** contre INVERSE **5,6 %** : l'écart au hasard est de **−19,4 points**. Les mots
du domaine (`goroutine`, `interface`, `tranche`, `canal`, `récepteur`, `pointeur`…) ne doivent pas
être le privilège de la bonne réponse. **Par mot technique : les quatre options le portent, ou
aucune.**

### (7) L'ÉCHO DE L'ÉNONCÉ — 54,6 %, couverture 53,2 %

**LES QUATRE OPTIONS PORTENT LE MÊME NOMBRE DE MOTS D'ÉCHO** (mots de 4 lettres et plus repris de
l'énoncé). ⚠️ Un identifiant court passe sous le radar de l'outil : au 46ᵉ cours, `job` (3 lettres)
faisait de la bonne réponse la seule à citer une cmdlet `*-Job` et **aucune stratégie ne le voyait**.
En Go, `nil`, `cap`, `len`, `map`, `go`, `err` sont dans ce cas : **compte-les à la main**.

### (8) L'INDICE LEXICAL — et sur ce cours, c'est **l'INVERSE** qui domine

| lecture | couverture | rendement |
|---|---:|---:|
| STRICTE | 21,0 % | **0,0 %** |
| PROPORTION | 43,5 % | 44,4 % |
| **INVERSE** | **64,5 %** | **62,5 %** |

C'est une configuration **atypique** : sur `powershell`, l'INVERSE était à 0,0 % de couverture.
Ici, la bonne réponse porte **plus** de mots étrangers à la page que ses distracteurs, et l'écarter
paie. **RÈGLE DU `k` : soit `k` le nombre de mots de 6 lettres et plus absents de la page que porte
une option — les QUATRE options doivent porter le MÊME `k`.** Ni 0/0/k (qui laisse 50 % en
RESTREINDRE), ni « aucun étranger partout » (qui retourne l'indice).

**RÈGLE DU `w`** : soit `w` le nombre de mots de 6 lettres et plus d'une option — les quatre valeurs
doivent rester proches. `w` et `k` se règlent **séparément**.

### (9) LE MOT FÉTICHE — **1 alerte**

`valeur` : **8 bonnes réponses contre 2 distracteurs**, 9 questions tranchées, RESTREINDRE rend
**33,5 %**. Place ce mot dans des distracteurs de tes questions, ou retire-le de bonnes réponses
que tu n'as pas le droit de toucher — donc : **place-le dans les distracteurs.**

### (10) L'INTRUS LEXICAL — **0 question sûre, et il faut que ça le reste**

DÉFAUT 22,6 % / EXCÈS 25,8 %, aucune question sûre. C'est le seul indicateur déjà propre du cours :
**cible = couverture zéro**, pas « taux à 25 % ». Un mot porté par exactement 3 options sur 4
désigne la quatrième à coup sûr : par mot, **les quatre ou aucune**.

### (11) ⚠️ LE DISTRACTEUR NE DOIT PAS DEVENIR UN MODE D'EMPLOI

Un distracteur long qui explique correctement la règle **avant** de se tromper enseigne la bonne
réponse. La fausseté doit être dans la **thèse**, pas dans une queue de phrase. Et la fausseté ne
doit pas non plus être un **conseil dangereux** qu'un débutant pourrait appliquer.

---

## Les contraintes de non-régression

1. **La bonne réponse et l'`explain` sont INTOUCHABLES.** Si tu es convaincu qu'une bonne réponse
   est fausse, **tu ne la corriges pas** : tu le remontes dans ton compte rendu, avec la preuve.
   Au 46ᵉ cours, quatre atteintes à l'intouchable ont été rejugées une par une par l'orchestrateur,
   et les quatre étaient justifiées — mais c'est **lui** qui a tranché.
2. **L'énoncé (`q`) est intouchable** de la même façon.
3. **Aucun distracteur ne doit devenir vrai.** C'est la faute la plus fréquente du chantier : sur
   `bdd`, un seul défaut de schéma a produit trois bonnes réponses fausses.
4. **Deux distracteurs ne doivent pas énoncer la même thèse** (ils s'éliminent l'un l'autre).
5. **Le JSON doit rester valide**, sans BOM, et les antislashes des littéraux Go (`\n`, `\t`)
   doivent rester échappés correctement.
6. **Aucune URL externe** : pas de `cdnjs`, pas de `fonts.googleapis`, pas de `fonts.gstatic`.

---

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=go
node tools/mesure-biais-inverse.js --toutes go
node tools/mesure-lexique-qcm.js --seul=go --liste
node tools/mesure-mot-fetiche.js go
node tools/mesure-mot-question.js go
node tools/plan-rangs-qcm.js go
node tools/mesure-qcm-intouchable.js go <ref-git-d-avant>
node tools/verif-html.js
```

**Cible : 25 % dans les DEUX sens, sur les 46 stratégies — 0 mot fétiche, 0 question « sûre »,
et une couverture nulle pour les indices de ponctuation.**

---

## ⚠️ Ce que les passes 39 à 46 ont appris sur la MÉTHODE

- **Mesure sur un état GELÉ, pas sur l'arbre vivant.** Au 46ᵉ cours, deux agents écrivaient en
  parallèle sur le même cours et le même outil a rendu `0 exploitable` / `3 exploitables` /
  `1 exploitable` à quelques minutes d'intervalle. Copie `pages/` et `tools/` avant de juger.
- **Un diagnostic qui n'est pas la COPIE EXACTE de l'outil fait travailler à côté.** Au 43ᵉ cours,
  une apostrophe traitée comme séparateur de mots a fait annoncer « 0 tranchée » là où l'outil en
  mesurait 22. Si tu écris une sonde, vérifie qu'elle reproduit les chiffres de l'outil **au dixième
  près** sur au moins un cas connu.
- **Fermer un indice à fond le RETOURNE.** Vise l'égalité des quatre, jamais l'extinction.
- **Fermer un indice peut le FAIRE MONTER** : une question tranchée à 0 vaut +0,25, une égalité à
  deux vaut +0,50. Un chiffre qui monte n'est pas forcément une régression — lis la couverture.
- **Relis le texte rendu, pas seulement le tableau.** Neuf contrôles verts sur une salade de mots
  est un résultat déjà obtenu deux fois.
