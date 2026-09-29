# Consigne d'écriture — les QCM du cours `dart` (B4, 53ᵉ cours)

Préparée le 2026-09-29, à la clôture du 52ᵉ cours (`perl`). Mesures de départ archivées dans
`scratchpad/dart-depart/` (sorties brutes des outils, à relancer avant la vague : le site bouge).
Sondes prêtes dans `scratchpad/dart-sonde/` (`controle.js` v2, `simule.js`, `essai.js`, `pose.js`,
`k.js`, `dosage.js`, `chaque.js`), copiées de `perl-sonde` et pointées sur `pages/dart/`.

Tu écris les **distracteurs** d'un lot de questions du cours `dart` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).
Le cours s'intitule « Dart & Flutter » : null safety, collections, classes et mixins, asynchrone
(Future, Streams), génériques, tests, puis Flutter.

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-édite.

Les QCM sont dans `pages/dart/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-16`, qui porte
**12 questions de bilan** en plus de ses 3). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Leçon du 52ᵉ cours : c'est ce qui a supprimé les pièges du CRLF (14 fichiers au 51ᵉ, 0 au 52ᵉ) et du
JSON cassé. Écris tes patchs dans `scratchpad/dart-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/dart-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js` refuse de
toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un fichier qui
contient un antislash : l'outil Bash en mange un niveau (re-vérifié au 52ᵉ cours sur un JSON).

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Au 52ᵉ cours (`perl`), après une vague où toutes les mesures étaient vertes, la relecture a encore
trouvé **11 distracteurs inintelligibles et 10 fautes de français** sur 60 questions — des queues de
phrase ajoutées pour tenir un compte de caractères (« et non pas la valeur », « ce qui vaut pour
plusieurs structures », « ne sert à aucun emploi »).

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette notation » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## 🟢 LE DART DE CE COURS S'EXÉCUTE — FLUTTER, NON

**Mis à jour au réveil de la vague (2026-09-29)** : un SDK Dart **3.13.5** portable a été déposé dans
`scratchpad/dart-sdk/` (hors git, aucune installation système). Lancer un programme :
`scratchpad/dart-sdk/dart-sdk/bin/dart run <fichier.dart>` (≈ 1,2 s), analyse statique :
`scratchpad/dart-sdk/dart-sdk/bin/dart analyze <fichier.dart>`. **Tout distracteur qui parle d'un
résultat, d'une erreur de compilation ou d'une exception se PROUVE faux par exécution avant d'être
écrit**, et la bonne réponse se prouve vraie. Tes scripts vont dans `scratchpad/dart-<ton lot>/`.
**Flutter n'est pas disponible** (leçons 10 à 14 et 16 en partie) : pour un widget, tu juges sur le
CORPS de la leçon et la documentation ; seul le Dart pur qui y figure peut tourner. **Ne fonde une
fausseté sur un point de version que si TA page le date.** Si une bonne réponse te semble fausse, tu ne
la touches pas : tu la remontes avec la preuve.

**Erreurs classiques de débutant en Dart** (n'utilise que celles que TA leçon établit) :
⚠️ Cette table a été écrite de mémoire, avant que Dart soit disponible : **fais tourner chaque ligne
que tu utilises**. Sa première version portait une ligne fausse.

| croyance fausse | ce qui est vrai |
|---|---|
| `var x = "a";` puis `x = 3;` compile (« var = type libre ») | le type est INFÉRÉ de l'initialisation (`String`) : `x = 3` est une erreur de compilation ; seul `var x;` sans valeur, ou `dynamic`, accepte tout |
| `final` et `const` sont synonymes | `final` : affecté une fois, à l'exécution ; `const` : connu à la compilation |
| `String?` et `String` acceptent tous deux `null` | seul `String?` ; `!` affirme non-null et lève à l'exécution si c'est faux |
| `??` teste la vérité (comme `||`) | `??` ne teste que `null` |
| un `Future` s'exécute de façon synchrone si on n'écrit pas `await` | il est lancé ; sans `await`, la suite n'attend pas son résultat |
| `async` rend une fonction parallèle (multi-thread) | Dart est mono-thread par isolate ; `async` rend un `Future` |
| un `Stream` ne peut avoir qu'une valeur | un `Stream` émet une SUITE de valeurs ; un `Future`, une seule |
| `==` compare les références pour tous les objets, y compris les `String` | `String` redéfinit `==` (contenu) |
| `setState` redessine toute l'application | il redessine le `State` de CE widget et ses descendants |
| un `StatelessWidget` ne se redessine jamais | il se reconstruit quand son parent le reconstruit |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **92,5 %** des QCM de `dart` en cochant l'option la plus
longue. Relevé du 2026-09-29, `node tools/mesure-biais-qcm.js --seul=dart` (60 questions) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **92,5 %** | 100,0 % | 92,5 % |
| la plus détaillée | **79,0 %** | 85,0 % | 88,6 % |
| la seule avec une PONCTUATION FORTE | **72,1 %** | 65,0 % | **97,4 %** |
| le mot technique exclusif | **71,4 %** | 83,3 % | 80,7 % |
| RESTREINDRE à la parenthèse | **68,5 %** | 61,7 % | 95,5 % |
| l'incise entre parenthèses | **67,2 %** | 60,0 % | 95,4 % |
| l'écho de la question | **62,8 %** | 73,3 % | 76,5 % |
| la seule avec un point-virgule | **57,5 %** | 43,3 % | **100,0 %** |
| ECARTER la moins bavarde | 42,9 % | 13,3 % | 87,5 % |
| RESTREINDRE aux deux-points | 42,1 % | 25,0 % | 93,3 % |
| ECARTER la plus courte | 34,2 % | — | — |
| la seule avec une barre oblique | 30,0 % | 6,7 % | **100,0 %** |

## Le travail est de l'ALLONGEMENT — et c'est le pire rapport de B4

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **115,4 caractères** |
| longueur moyenne d'un distracteur | **24,2 caractères** |
| **rapport** | **4,77** (`perl` : 4,01 ; `vue` : 3,68 ; `nosql` : 3,41) |

`node tools/plan-rangs-qcm.js dart` demande **13 773 caractères** sur **56 questions sur 60**.
Rangs actuels **56 / 1 / 3 / 0**, cible **15 / 15 / 15 / 15**. **Suis EXACTEMENT** le rang visé et la
bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la bonne
réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes dart` rend **5 alertes** au départ. **Le rang en MOTS de
la bonne réponse doit valoir son rang en CARACTÈRES.** Au 52ᵉ cours, tenir ce principe à la lettre a
laissé « la moins bavarde » à 30,7 % : quand la bonne réponse est la plus courte, qu'**un** de ses
distracteurs ait autant de mots qu'elle (égalité) plutôt que tous davantage.

### (2) LA PONCTUATION — et L'UNION
Par marque (`;`, `:`, parenthèse, tiret, flèche `=>`, barre oblique, guillemets), **les quatre options
la portent, ou aucune** ; vérifie aussi l'UNION (« PONCTUATION FORTE » = `:` ou `;` ou tiret,
**72,1 %**, rendement 97,4 %). ⚠️ En Dart, `=>`, `?.`, `??` et `!` sont du CODE.

### (3) LES SEPT TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js dart --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **point-virgule médian** | **26 / 0** | 26 | **100,0 %** | **57,5 %** |
| **deux-points médian** | **13 / 0** | 13 | **100,0 %** | 41,3 % |
| glose finale entre parenthèses | 10 / 2 | 10 | 90,0 % | 35,8 % |
| connecteur causal (car / puisque / parce que) | 10 / 9 | 13 | 53,8 % | 31,3 % |
| « à l'exécution » | 5 / 0 | 5 | 100,0 % | 31,3 % |
| « parce que » | 8 / 8 | 10 | 50,0 % | 29,2 % |
| « la valeur » | 3 / 1 | 4 | 75,0 % | 28,3 % |

**26 bonnes réponses sur 60 portent un point-virgule médian, AUCUN distracteur.** Le gabarit est
« réponse ; justification » : donne-le à tes distracteurs, avec un contenu qui dit quelque chose.

### (4) ⚠️ LES MOTS FÉTICHES — 4 ALERTES DÈS LE DÉPART, et dans le sens des BONNES réponses
Premier cours où `mesure-mot-fetiche` alerte AVANT l'écriture :
`valeur` (9 bonnes / 4 distracteurs, RESTREINDRE **33,3 %**), `exécution` (7 / 1, **33,3 %**),
`parce` (10 / 14, 30,6 %), `flutter` (5 / 4, 29,6 %). **Pose ces mots dans des distracteurs**, là où
ils ont un sens. **N'emploie pas « chaque »** pour allonger : aux 50ᵉ, 51ᵉ et 52ᵉ cours, la
correction a fabriqué son propre mot fétiche (« chaque », « chaque », « chaîne »).

### (5) LE MOT TECHNIQUE EXCLUSIF (71,4 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune. `node tools/mesure-mot-question.js
dart --plan` donne la liste exacte. Intrus DÉFAUT **28,1 %** (exploitable) au départ.

### (6) L'ÉCHO DE L'ÉNONCÉ (62,8 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les identifiants courts
passent sous le radar : `var`, `final`, `const`, `?`, `!`, `??`, `=>`, `async`, `await` — compte-les.

### (7) L'INDICE LEXICAL — 52 exploitables, 26 retournées, 58 à mettre en forme sur 60
`node tools/mesure-lexique-qcm.js --liste=dart`. **Règle du `k`** : les QUATRE options portent le
même nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en OCCURRENCES** : un mot
étranger répété compte deux fois (piège du 52ᵉ cours : `controle.js`, qui compte les mots distincts,
était vert). **Règle du `w`** : quand `k > 0`, les quatre portent aussi le même nombre de mots de 6+
lettres. Un substitut doit être **présent dans la page** (jeton entier). Cible : 0 / 0 / 0.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) PAS DE MODE D'EMPLOI DANGEREUX (« `!` partout pour faire taire le compilateur »)

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js dart <sha>`.
2. **Aucun distracteur ne doit devenir vrai.**
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`.
4. **Aucune URL externe.**

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js dart` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js dart
node tools/mesure-mot-question.js dart --plan
node tools/mesure-biais-qcm.js --seul=dart
node tools/mesure-biais-inverse.js --toutes dart
node tools/mesure-lexique-qcm.js --liste=dart
node tools/mesure-mot-fetiche.js dart
node tools/mesure-tics-lot.js dart --exemples
node scratchpad/dart-sonde/essai.js "<fragment unique de l'énoncé>"
```

---

## CE QUE LE 52ᵉ COURS A APPRIS À L'ORCHESTRATEUR

- **La relecture par contradiction doit lire les CORPS**, pas seulement les QCM : au 52ᵉ cours elle a
  trouvé **22 fautes de corps sur 53** (une regex qui ne compilait pas, un one-liner qui détruisait
  le fichier, six sorties annoncées fausses). Aucun des 46 outils ne lit un corps.
- **Relancer `mesure-mot-fetiche` APRÈS la relecture** : ses réécritures fabriquent un mot fétiche
  que `controle.js` (stratégies par question) ne voit pas.
- **Une correction de CORPS change le vocabulaire de la page** et peut rouvrir `k` : relancer
  `controle.js` après toute correction de corps.
- **`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges`** :
  sans `--only`, `pieges-data.js` et `search-index.js` ne sont pas régénérés.
- **Dosage calculé** (`dosage.js`) : combien de points retirer, puis quelles questions rapportent le
  plus. Raccourcir un distracteur en ôtant des mots courts le rend PLUS DENSE : remplacer, pas ôter.
- Clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` à la main ;
  `verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, `tools/etudes/inconnu/assembler.js` et
  `tools/etudes/recherche/assembler.js`, puis index, jusqu'au point fixe (vérifié par empreinte).
