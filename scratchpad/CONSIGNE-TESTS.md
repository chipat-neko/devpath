# Consigne d'écriture — les QCM du cours `tests` (B4, 60ᵉ cours)

Préparée le 2026-09-30, à l'ouverture du 60ᵉ cours. Mesures de départ archivées dans
`scratchpad/tests-depart/` (sorties brutes des outils, `questions.txt` : les 57 questions à plat).
Sondes prêtes dans `scratchpad/tests-sonde/` (`controle.js` v2, `simule.js`, `essai.js`,
`essai2.js`, `essai3.js`, `pose.js`, `rempl.js`, `k.js`, `kdiff.js`, `dosage.js`) et
`scratchpad/tests-corr/` (`remplace.js`, `wk.js`), copiées de `bash-sonde` et pointées sur
`pages/tests/` (`controle.js` à vide : **0 indicateur déplacé sur 57 questions**).

Tu écris les **distracteurs** d'un lot de questions du cours `tests` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build).
Le cours s'intitule « Tests & qualité » : pourquoi tester, anatomie d'un bon test (AAA),
pyramide des tests, TDD, doublures (mocks, stubs, fakes), couverture / intégration continue /
linter, tests paramétrés et valeurs limites, asynchrone / temps / aléatoire, intégration et E2E
(Page Object), tests basés sur les propriétés et mutation testing, performance et charge (k6,
centiles), tests de contrat (Pact), sécurité automatisée (SAST, SCA, DAST, `npm audit`), puis un
projet (`lecon-14` : reprendre du code legacy sous filet de tests, **18 questions dont 15 de
bilan**). 14 leçons, 3 questions chacune, 57 questions.

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-écris un patch.

Les QCM sont dans `pages/tests/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-14`). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Écris tes patchs dans `scratchpad/tests-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/tests-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js`
refuse de toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un
fichier qui contient un antislash ou un `$` : l'outil Bash en mange un niveau. Écris tes scripts
avec Write.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Du 53ᵉ au 59ᵉ cours, après des vagues où toutes les mesures étaient vertes, la relecture a encore
trouvé des distracteurs inintelligibles, des fautes de français et **des distracteurs VRAIS** —
des queues de phrase ajoutées pour tenir un compte de caractères, des parenthèses qui n'énoncent
rien.

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette forme » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).
6. **Aucun distracteur qui annonce un comportement sans le prouver faux** : si un distracteur dit
   « un test sans assertion échoue » ou « `toBe` compare le contenu de deux objets », le
   comportement vrai a été **exécuté** (voir plus bas), pas supposé.

⚠️ **Le piège propre à ce cours : c'est un cours de MÉTHODE, où presque toute thèse « fausse » est
défendue par quelqu'un.** « On mocke toutes les dépendances » est l'école de Londres ; « 100 % de
couverture est exigé » est la règle de certaines équipes ; « un test = une assertion » est un
conseil répandu ; « l'E2E suffit » est le trophée de Kent C. Dodds mal lu ; « le test de stress
et le test de pic cherchent tous deux la rupture » se discute. Un distracteur qui énonce une
OPINION défendable n'est pas faux : il est **discutable**, et la relecture le prendra. Tiens-toi à
des **erreurs de FAIT ou de DÉFINITION** (ce que l'outil fait, ce que le mot désigne, ce que la
mesure compte), fausses **contre la page de TA leçon** — c'est elle qui fixe le vocabulaire — et,
dès que la thèse porte sur un comportement de Jest, de `fast-check` ou de `npm`, fausses **par
exécution**.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, JEST S'EXÉCUTE

Un environnement jetable (hors git) est installé : `scratchpad/tests-env/`, **Jest 29.7.0**,
**fast-check**, Node **24.16**, npm **11.13**.

```
cd scratchpad/tests-env
npx jest <ton lot>/<essai>.test.js --verbose       # un fichier écrit avec l'outil Write
```

- Écris tes fichiers `*.test.js` avec l'outil **Write** dans `scratchpad/tests-env/<ton lot>/`
  (exemple : `scratchpad/tests-env/l07-09/frontiere.test.js`). N'écris RIEN d'autre dans
  `tests-env` et n'y installe rien.
- Le code des leçons est écrit pour Jest (parfois Vitest, API quasi identique) en CommonJS ou en
  `import` : recopie-le en CommonJS (`require`) pour l'exécuter.
- **Ce qui ne s'exécute PAS ici** — pour ceux-là, cite la source (documentation officielle de
  l'outil) et distingue « prouvé par exécution », « établi par la source » et « de mémoire » :
  **k6**, **Pact** et son broker, **Stryker**, **Playwright / Cypress** (aucun navigateur piloté),
  **Testcontainers**, une vraie base, un vrai serveur de CI (GitHub Actions), les outils SAST /
  DAST (Semgrep, ZAP…). `npm audit` s'exécute (mesuré dans `tests-env` : « found 0
  vulnerabilities », code **0** avec `--audit-level=high`), mais pas sur un projet vulnérable.
  Si la page affirme autre chose que la source ou que l'exécution, **tu le remontes**, tu ne
  tranches pas de mémoire.
- **Sorties, verdicts, nombres de tests, codes de sortie** : **toujours par Jest**, jamais de tête.

**Erreurs classiques de débutant** (n'utilise que celles que TA leçon établit). Toutes les lignes
ont été **exécutées** à la préparation (`scratchpad/tests-env/depart/classiques.test.js` et
`classiques.out`, `sansawait*.test.js`) :

| croyance fausse | ce que Jest 29.7 rend |
|---|---|
| un test sans assertion échoue (ou est signalé) | un test vide **passe** ; un test qui appelle la fonction sans rien vérifier **passe** ; seul `expect.assertions(1)` le fait échouer |
| `toBe` compare le contenu de deux objets | `expect({a:1}).toBe({a:1})` **échoue** (identité) ; `toEqual` passe ; `toEqual` ignore une propriété `undefined`, `toStrictEqual` non |
| `0.1 + 0.2` vaut `0.3` dans une assertion | `toBe(0.3)` **échoue** ; `toBeCloseTo(0.3)` passe |
| `expect(f()).toThrow()` vérifie que `f` lève | l'exception part AVANT `expect` : le test échoue sur l'erreur elle-même ; il faut `expect(() => f()).toThrow()` |
| après une assertion en échec, le test continue et liste les autres | la première assertion en échec **arrête** le test ; les suivantes ne sont pas évaluées |
| `test.each` rend un seul verdict global | trois lignes = **trois tests** au rapport, nommés séparément ; avec un bug `>` au lieu de `>=` sur 65 : 64 passe, **65 échoue**, 66 passe |
| 40 et 70 suffisent à tester « réduit à partir de 65 ans » | avec le même bug de frontière, 40 et 70 passent : seul **65** le voit |
| `await` est facultatif devant `expect(...).rejects` | avec `await` (ou `return`) sur une promesse qui résout : le test **échoue** (« Received promise resolved instead of rejected ») ; ⚠️ **sans `await`, sous Node 24 + Jest 29.7, le test n'est PAS vert : le rejet non rattrapé fait TOMBER le processus Jest (code 1, aucun rapport de test)** — sur d'anciennes versions de Node il finissait vert avec un simple avertissement. La leçon 8 dit « peut finir vert » : ne t'appuie sur AUCUNE des deux versions dans un distracteur sans l'avoir rejouée |
| les faux minuteurs attendent quand même le temps réel | `jest.advanceTimersByTime(5000)` déclenche le rappel **sans attendre** ; à 4 999 ms il n'est pas appelé, à 5 000 il l'est une fois ; les faux minuteurs modernes figent aussi `Date.now()` (écart mesuré : **5000**) ; `jest.setSystemTime` fixe la date |
| un `jest.fn()` rend une valeur par défaut utile | il rend **`undefined`** ; `mockReturnValue(true)` en fait un stub ; `toHaveBeenCalledWith(2)` après un appel avec `1` **échoue** |
| deux tests peuvent partager un tableau sans risque | A pousse un élément, B qui suppose le tableau vide **échoue** quand il passe après A |
| `fast-check` essaie toutes les entrées possibles | **100** cas par défaut (compté) ; une propriété fausse sur un cas RARE (deux zéros dans un tableau d'entiers quelconques) peut **passer** les 100 tirages : le PBT ne prouve pas, il cherche |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **93,9 %** des QCM de `tests` en cochant l'option la
plus longue. Relevé du 2026-09-30, `node tools/mesure-biais-qcm.js --seul=tests` (57 questions,
dont 15 de bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **93,9 %** | 98,2 % | 94,6 % |
| la plus détaillée | **73,8 %** | 63,2 % | **100,0 %** |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | **60,5 % / 60,7 %** | 47,4 % | **100,0 %** |
| le mot technique exclusif | **57,2 %** | 59,6 % | 73,5 % |
| l'incise entre parenthèses | **52,6 %** | 36,8 % | **100,0 %** |
| RESTREINDRE à la parenthèse | **51,3 %** | 35,1 % | **100,0 %** |
| RESTREINDRE aux deux-points | **47,5 %** | 29,8 % | **100,0 %** |
| ÉCARTER la moins bavarde | 42,4 % | 8,8 % | **100,0 %** |
| la seule avec un point-virgule (et RESTREINDRE) | 36,8 % | 15,8 % | **100,0 %** |
| la plus prudente | 35,1 % | 12,3 % | **100,0 %** |
| l'écho de la question | 34,5 % | 42,1 % | 41,7 % |
| la seule qui nie | 32,9 % | 26,3 % | 46,7 % |
| l'attaque unique | 32,5 % | 33,3 % | 47,4 % |
| la MAJUSCULE d'emphase | 28,1 % | 12,3 % | 42,9 % |
| la seule avec une barre oblique (et RESTREINDRE) | 27,6 % / 27,8 % | 3,5 % | **100,0 %** |

**71,9 %** des questions (41 sur 57) sont trahies par **5 indices ou plus** sur 44.

## Le travail est de l'ALLONGEMENT

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **105,5 caractères** |
| longueur moyenne d'un distracteur | **32,6 caractères** |
| **rapport** | **3,24** (`bash` : 4,36 ; `r` : 4,42 ; `docker` : 3,13) |

`node tools/plan-rangs-qcm.js tests` demande **10 210 caractères** sur **55 questions sur 57**.
Rangs actuels **54 / 1 / 0 / 2**, cible **15 / 14 / 14 / 14**. **Suis EXACTEMENT** le rang visé et la
bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la bonne
réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

⚠️ Les distracteurs actuels sont presque tous des **boutades ou des renvois creux** (« Pour
ralentir le développement », « Livrer puis prier », « Faire joli », « Aucune différence », « Il
n'y a aucun risque ») et **19 commencent par « Parce que »** (0 bonne réponse) : aucun débutant ne
les coche. Un distracteur de 150 caractères se construit avec un **contresens complet** — ce que
l'apprenant croit que la pratique ou l'outil fait, puis la conséquence qu'il en tire. Les
contresens réels sont dans la table ci-dessus et dans les encadrés « Attention » / « Erreur
fréquente » / « Piège » de ta leçon (confondre couverture et vérification, stub et mock, charge et
stress, SAST et SCA, test de caractérisation et test de spécification, tué et survivant…).

⚠️ **Le bilan de `lecon-14` a des bonnes réponses très courtes** (`beforeEach`, « Le test
unitaire », « Un mock / stub », 10 à 24 caractères) : là, le plan demande de **RESSERRER** ou de
tenir une bande de quelques caractères. Pour un nom attendu, les distracteurs sont **les noms
voisins que le cours établit** (`beforeAll`, `afterEach`, `describe` ; un fake, un spy ; le test
d'intégration, de contrat, de charge) — chacun réellement faux pour la question posée (`beforeAll`
ne s'exécute qu'UNE fois : exécute-le si tu l'emploies).

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes tests` rend **4 alertes** au départ (la DEUXIÈME plus
longue 32,7 % en global, la TROISIÈME 32,5 %, la QUATRIÈME 31,7 %, la moins bavarde 29,2 %).
**Le rang en MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.** Quand la bonne réponse
est la plus courte, qu'**un** de ses distracteurs ait autant de mots qu'elle (égalité) plutôt que
tous davantage — et vise qu'un distracteur en ait **un de moins** quand la bonne est au rang 3.
**L'attaque** : les quatre options d'une question commencent par le même type de mot (un article,
un verbe à l'infinitif, « Pour », « À »), ou par quatre différents. ⚠️ **« Parce que » en tête est
aujourd'hui une signature de distracteur (19 / 0)** : ne commence un distracteur par « Parce » que
si la BONNE réponse commence ainsi.

### (2) LA PONCTUATION — et L'UNION (60,7 %, rendement 100 %)
Par marque (`;`, `:`, parenthèse, tiret, barre oblique, guillemets « », flèche `→`, virgule
décimale, `%`), **les quatre options la portent, ou aucune** ; vérifie aussi l'UNION
(« PONCTUATION FORTE » = `:` ou `;` ou tiret). ⚠️ Le CODE porte de la ponctuation : `test.each`,
`Date.now` et `p(95)<500` comptent comme point ou parenthèse, `--audit-level=high` et
`data-testid` comme tiret, `E2E/manuels` et `mock / stub` comme barre oblique, `TOUTES`, `ACTUEL`,
`SAST`, `E2E`, `CI`, `YAGNI` comme majuscule d'emphase. Compte-les.

### (3) LES DOUZE TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js tests --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **18 / 2** | 18 | **94,4 %** | **46,9 %** |
| **glose finale entre parenthèses** | **12 / 0** | 12 | **100,0 %** | **40,8 %** |
| **point-virgule médian** | **9 / 0** | 9 | **100,0 %** | **36,8 %** |
| « que le » | 8 / 4 | 10 | 80,0 % | 34,6 % |
| « le test » | 12 / 14 | 10 | 60,0 % | 31,1 % |
| « ce qui » | 4 / 0 | 4 | 100,0 % | 30,3 % |
| « le comportement » | 5 / 1 | 4 | 100,0 % | 30,3 % |
| verbe conjugué en fin d'option | 11 / 19 | 14 | 42,9 % | 29,4 % |
| « un test » | 5 / 9 | 6 | 66,7 % | 29,4 % |
| « le code » | 7 / 13 | 12 | 41,7 % | 28,5 % |
| « ce que » | 3 / 1 | 4 | 75,0 % | 28,5 % |
| « que le code » | 3 / 2 | 5 | 60,0 % | 28,1 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (une glose) » : donne-le à tes distracteurs, avec un contenu qui dit quelque chose — une
glose finale entre parenthèses qui PRÉCISE l'erreur, jamais une parenthèse vide de sens.

### (4) ⚠️ LES MOTS FÉTICHES — 3 ALERTES DÈS LE DÉPART
`node tools/mesure-mot-fetiche.js tests` : **`parce`** (0 bonne / **19 distracteurs**, ÉCARTER
32,2 %) — **à retirer des distracteurs** ; `assertion` (4 / 4, RESTREINDRE 28,5 %) ; `tests`
(8 / 17, 28,1 %). Puis `échoue` (**6 bonnes / 0 distracteur**, 32,9 %), `comportement` (6 / 1,
32,0 %), `chaque` (5 / 1, 31,1 %) : **pose ces trois mots dans des distracteurs**, là où ils ont un
sens — ce sont les mots du sujet. `exécution`, `toujours`, `production` (0 / 6 chacun) et `rapide`
(1 / 7) sont déjà des mots de DISTRACTEUR : ne les multiplie pas. ⚠️ **Dosage** : un mot posé
partout devient une signature de distracteur (`chaque` sur `bash` : 10 / 46 après la vague). Vise
une proportion voisine de 1 bonne pour 3 distracteurs, pas davantage.

### (5) LE MOT TECHNIQUE EXCLUSIF (57,2 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune.
`node tools/mesure-mot-question.js tests --plan` donne la liste exacte, question par question
(**51 mots à traiter sur 13 questions qui tranchent**).

### (6) L'ÉCHO DE L'ÉNONCÉ (34,5 %, rendement 41,7 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les sigles et les noms
d'API passent sous le radar : `E2E`, `TDD`, `p95`, `SAST`, `SCA`, `await`, `expect`, `test.each`,
`Date.now`, `npm audit` — compte-les.

### (7) L'INDICE LEXICAL — 49 exploitables, 34 retournées, 55 à mettre en forme sur 57
`node tools/mesure-lexique-qcm.js --liste=tests`. **Règle du `k`** : les QUATRE options portent le
même nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en OCCURRENCES** : un
mot étranger répété compte deux fois. **Règle du `w`** : quand `k > 0`, les quatre portent aussi le
même nombre de mots de 6+ lettres. Un substitut doit être **présent dans la page** (jeton entier ;
l'apostrophe et le tiret séparent les mots). Cible : 0 / 0 / 0. Fais-le mot par mot avec
`node scratchpad/tests-sonde/k.js` et `node scratchpad/tests-corr/wk.js lecon-NN.html "texte"`.
**Un mot de moins de 6 lettres ne compte ni dans `w` ni dans `k`** : c'est le levier.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE — les quatre options ont le MÊME nombre de phrases
Le point suivi d'une espace puis d'une majuscule est la signature ; « etc. », « ex. » et le point
d'un identifiant (`test.each`, `Date.now`) ne comptent pas. Au départ aucune option n'a deux
phrases : **n'en crée pas**.

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js tests <sha>`. Si une bonne réponse te paraît FAUSSE (Jest
   ou la source la dément), **ne la corrige pas** : remonte-la dans ton compte rendu, avec le
   fichier de test et sa sortie.
2. **Aucun distracteur ne doit devenir vrai ni DISCUTABLE** — voir le piège du cours : une opinion
   d'école n'est pas une erreur.
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`. ⚠️ Dans un patch
   JSON, un antislash se double et un guillemet droit s'échappe (`\"`) ; préfère « » dans le texte.
4. **Aucune URL externe** dans le contenu.

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js tests` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger,
   et **exécute sous Jest** chaque comportement d'outil que tu annonces.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Pose, puis relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js tests
node tools/mesure-mot-question.js tests --plan
node tools/mesure-biais-qcm.js --seul=tests
node tools/mesure-biais-inverse.js --toutes tests
node tools/mesure-lexique-qcm.js --liste=tests
node tools/mesure-mot-fetiche.js tests
node tools/mesure-tics-lot.js tests --exemples
node scratchpad/tests-sonde/essai.js "<fragment unique de l'énoncé>"
```

⚠️ Les mesures par cours portent sur les 57 questions : les chiffres des autres lots bougent en
même temps que les tiens. Juge TON lot sur le plan de rangs, le lexique (`--liste`, tes fichiers),
les tics (`--exemples`, tes fichiers) et `mesure-mot-question --plan` (tes fichiers).

## Lots (six écrivains, fichiers disjoints)
| lot | leçons | questions |
|---|---|---:|
| `l01-03` | lecon-01, lecon-02, lecon-03 | 9 |
| `l04-06` | lecon-04, lecon-05, lecon-06 | 9 |
| `l07-09` | lecon-07, lecon-08, lecon-09 | 9 |
| `l10-11` | lecon-10, lecon-11 | 6 |
| `l12-13` | lecon-12, lecon-13 | 6 |
| `l14` | lecon-14 (3 questions + 15 de bilan) | 18 |

## CE QUE TU RENDS
Un compte rendu bref : nombre de distracteurs réécrits, nombre de fichiers de test exécutés, les
chiffres de tes contrôles sur ton lot, et la **liste des défauts que tu as VUS sans y toucher**
(corps de leçon dont un exemple ne rend pas ce que la page annonce, bonne réponse douteuse,
`explain` qui cite un ancien distracteur, exercice dont la réponse attendue est fausse) — chacun
avec le fichier, le passage exact, et la sortie qui le prouve. Écris cette liste aussi dans
`scratchpad/tests-<ton lot>/defauts.json` : `[{"fichier","zone","passage","constat","preuve"}]`.
