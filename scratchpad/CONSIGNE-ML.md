# Consigne d'écriture — les QCM du cours `ml` (phase C du V18, case C5)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c5-ml` (branche `v18/c5-ml`, partie
de `8d163bf`). Un seul agent fait tous les rôles (preuves, écriture, dosage, relecture, contre-relecture).
Mesures de départ archivées dans `scratchpad/c5-ml/depart/` (hors git) ; `questions.txt` y donne les 52
questions à plat avec leurs explications. Sondes dans `scratchpad/c5-ml/sonde/` :

- `controle.js` (copie de `scratchpad/vue-sonde/controle.js` v2, repointée sur `pages/ml/` : elle CHARGE
  les 44 stratégies et compare, question par question, les ensembles d'options désignés + `w`/`k`) ;
- **`atelier.js`** (neuf) : un ou plusieurs lots de patchs appliqués dans un BANC
  (`scratchpad/c5-ml/banc/`, copie des pages et des outils), puis, pour chaque question touchée, tout
  ce qui désigne une option — rangs, mots, densité, `, : ;`, écho, `w`/`k`, mots de 9+ lettres exclusifs,
  marques (0 ou 4 porteurs), intrus lexical et motifs de forme des tics de lot (fonctions LUES dans le
  source des outils : copie exacte par construction), stratégies qui POINTENT la bonne réponse, qui la
  RESTREIGNENT ou qui l'ÉCARTENT ; avec `--outils`, les VRAIS outils lancés sur le banc ;
- `pose.js` (copie de `vue-sonde`, refuse la bonne réponse, reparse chaque bloc avant d'écrire),
  `aplat.js`, `texte.js`, `cibles.json` (le rang visé de chaque question, figé depuis `plan-rangs-qcm`).

Le cours : « Machine Learning » avec scikit-learn — vocabulaire et familles (`lecon-01`), workflow et
`train_test_split` (`02`), préparation et fuite de données (`03`), régression (`04`), classification
(`05`), sur/sous-apprentissage et validation croisée (`06`), projet de bout en bout et pipeline (`07`),
clustering k-means (`08`), métriques fines (`09`), arbres et forêts (`10`), pipeline, ColumnTransformer
et GridSearchCV (`11`), projet final (`12` : 3 questions + **12 de bilan**). **52 questions, 156
distracteurs.**

## ✅ CE QUI SE PROUVE SE PROUVE — scikit-learn S'EXÉCUTE ICI

Python 3.14.5, environnement virtuel `D:\outils-c\ml\venv` (hors dépôt) : **scikit-learn 1.9.1** (la
version citée par le cours), numpy 2.5.5, pandas 3.1.1, scipy 1.18.1. Preuves dans
`scratchpad/c5-ml/preuves/` (`p01_qcm.py` … , sorties `.out`). Lancer avec
`D:\outils-c\ml\venv\Scripts\python.exe -I <script>` ; **jamais `n_jobs=-1`** dans une preuve (d'autres
agents partagent la machine).

**Ce que scikit-learn 1.9.1 rend — à utiliser pour écrire les erreurs des distracteurs :**

| croyance fausse | ce que l'exécution rend |
|---|---|
| `random_state` accélère ou améliore le modèle | il fige le tirage : deux appels avec 42 rendent le même test `[0 17 15 1]`, sans graine deux tirages différents |
| `test_size` vaut 0,2 par défaut | sans argument, 5 exemples de test sur 20 : **0,25** |
| un R² nul veut dire « modèle parfait » ou « rien » | prédire toujours la moyenne rend R² = **0,0** ; une constante plus haute rend **−0,481** (le R² peut être négatif) |
| 99 % d'exactitude = bon modèle | 1 % de positifs, « toujours négatif » : exactitude **0,99**, rappel **0,0** |
| le F1 est la moyenne, ou garde la meilleure, ou la pire | P = 0,90 et R = 0,10 : F1 = **0,18** (moyenne arithmétique 0,50) |
| baisser le seuil fait monter la précision | seuil 0,50 → 0,30 : précision 0,788 → **0,606**, rappel 0,611 → **0,793** (jeu bruité) ; 0,986 → 0,973 et 0,986 → 1,0 (cancer du sein) |
| une AUC vaut au moins 0,5 | score au hasard : **0,4995** ; score retourné d'un bon modèle : **0,0046** |
| `confusion_matrix` range [[VP, FN], [FP, VN]] | il rend **[[VN, FP], [FN, VP]]** (étiquettes 0 puis 1) |
| `feature_importances_` donne des causes ou des scores | des parts relatives : **somme 1,0** |
| l'inertie est la somme des distances | `inertia_` = **somme des CARRÉS** des distances (57,41 contre 49,90) |
| `KMeans()` relance 10 fois par défaut | `n_init='auto'`, `init='k-means++'` en 1.9.1 |
| `stratify=y` équilibre ou trie les classes | il garde la part de la classe 0 (0,3726 → 0,3736 / 0,3684) ; tailles inchangées 455 / 114 |
| `GridSearchCV` évalue sur le test | 5 plis sur les seules données passées à `fit`, puis `refit=True` |
| `cross_val_score` sans `cv` fait 3 ou 10 plis | **5** scores |
| ajouter des arbres fait surapprendre une forêt | 10 → 3 000 arbres : test 0,70 / 0,74 / 0,74 / 0,73 / 0,72, pas de dérive (Breiman 2001, cité dans la page) |
| `X = X.dropna()` suffit | `y` n'est plus aligné : `ValueError` au `fit` (« inconsistent numbers of samples ») |

**Fautes de fond trouvées par l'exécution (corrigées dans le corps AVANT la vague, parce qu'un corps
qui change déplace le `k` du lexique)** : voir le rapport `en-cours/rapports-v18/c5-ml.md`.

---

## Pourquoi ce travail — mesure de départ (`node tools/mesure-biais-qcm.js --seul=ml`, sur `8d163bf`)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **92,3 %** | 100,0 % | 92,3 % |
| la plus détaillée | **70,5 %** | 61,5 % | 96,9 % |
| le mot technique exclusif | **64,3 %** | 67,3 % | 77,1 % |
| l'écho de la question | 44,1 % | 40,4 % | 66,7 % |
| RESTREINDRE à la ponctuation forte | 44,1 % | 23,1 % | **100,0 %** |
| l'incise entre parenthèses / RESTREINDRE à la parenthèse | 43,8 % | 25,0 % | **100,0 %** |
| ECARTER la moins bavarde | 43,4 % | 9,6 % | 80,0 % |
| la seule avec une PONCTUATION FORTE | 42,3 % | 23,1 % | **100,0 %** |
| RESTREINDRE aux deux-points | 41,2 % | 19,2 % | **100,0 %** |
| ECARTER la plus courte | 34,3 % | 0,0 % | — |
| la seule avec une barre oblique | 30,3 % | 9,6 % | 80,0 % |
| la seule avec un tiret | 29,3 % | 5,8 % | **100,0 %** |

**26 questions sur 52 (50,0 %)** trahies par 5 indices ou plus. Bonne réponse **90,5 caractères** en
moyenne, distracteur **31,0** : rapport **2,92** (mesuré sur `8d163bf`). Rangs **48 / 1 / 2 / 1**, cible **13 / 13 / 13 / 13** (`cibles.json`) ;
`plan-rangs-qcm ml` demande **7 595 caractères** sur 48 questions. Biais inverse : **4 alertes** (rangs
2, 3, 4 et « la moins bavarde »). Intrus lexical : 1 question sûre (`lecon-07` q2, EXCES). Point
interne : aucune option en deux phrases (à garder ainsi). Guillemets : `lecon-09` q2 seule.

### Les NEUF tics de lot (`node tools/mesure-tics-lot.js ml --exemples`)

| tic | bonnes / distr. | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **16 / 10** | 12 | 83,3 % | **38,5 %** |
| **glose finale entre parenthèses** | **8 / 0** | 8 | **100,0 %** | **36,5 %** |
| « le modèle » | 11 / 7 | 12 | 66,7 % | 34,6 % |
| « sur l'entraînement » | 5 / 0 | 5 | 100,0 % | 32,2 % |
| parenthèse ouverte par un article | 4 / 0 | 4 | 100,0 % | 30,8 % |
| adverbe de reprise (alors / ensuite / puis) | 5 / 4 | 5 | 80,0 % | 30,3 % |
| « des données » | 4 / 2 | 6 | 66,7 % | 29,8 % |
| « que le », « validation croisée » | 3 / 2 | 5 | 60,0 % | 28,4 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse (glose) » ou « réponse, puis
conséquence » : **les distracteurs prennent le MÊME gabarit**, avec un contenu qui énonce une erreur —
jamais une parenthèse ou une queue de phrase de remplissage. « le modèle », « sur l'entraînement »,
« des données », « validation croisée » sont les mots du sujet : **les poser dans des distracteurs** là
où ils ont un sens (ex. : « …ajusté sur l'entraînement ET le test »), à raison d'environ un porteur
juste pour trois porteurs faux.

### Mots fétiches (`node tools/mesure-mot-fetiche.js ml`) : 4 alertes

`entraînement` (12 bonnes / 2 distracteurs, RESTREINDRE 41,3 %), `modèle` (13 / 14, 34,8 %), `chaque`
(6 / 3, 32,2 %), `données` (9 / 16, 28,4 %). Sous le seuil mais à surveiller : `positifs`, `score`,
`surapprentissage`, `évaluer`, `rappel` ; mots de DISTRACTEUR à ne pas multiplier : `rapide` (0 / 7),
`toujours` (1 / 7), `nombre` (1 / 6), `parce` (2 / 9), `précision` (1 / 5). **Poser `entraînement`,
`modèle`, `chaque` dans les distracteurs des questions où la bonne réponse les porte.**

### Lexique (`node tools/mesure-lexique-qcm.js --liste=ml`)

**45 exploitables, 26 retournées, 48 à mettre en forme sur 52.** Règle du `k` (compté en OCCURRENCES,
comme l'outil) : les quatre options portent le même nombre de mots de 6 lettres et plus ABSENTS de la
page (la page entière hors blocs de quiz). Règle du `w` : quand `k > 0`, les quatre portent aussi le
même nombre de mots de 6+ lettres. Un mot de moins de 6 lettres ne compte ni dans `w` ni dans `k` ;
l'apostrophe et le tiret collent (`n'explique`, `lui-même` sont UN jeton). Le plus sûr pour tenir `k` :
reprendre les mots étrangers de la bonne réponse dans les distracteurs.

---

## La règle qui prime sur toutes les mesures

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Test de recevabilité de CHAQUE distracteur : (1) l'erreur se nomme en une phrase ; (2) chaque
proposition a un référent ; (3) un débutant crédule pourrait le cocher (erreur réelle de débutant :
encadrés « Piège fréquent », « Attention », pièges de fin de leçon) ; (4) aucune parenthèse ni queue de
phrase de remplissage ; (5) aucune clause finale qui le condamne (« … et le modèle s'effondre ») ; (6)
aucun comportement de scikit-learn annoncé sans avoir été EXÉCUTÉ (table ci-dessus).

⚠️ **Le piège propre à ce cours : en ML, beaucoup d'affirmations sont « vraies parfois ».** Une forêt
PEUT surapprendre, un pipeline PEUT accélérer, le one-hot PEUT être plus lent, la validation croisée
RÉDUIT le hasard sans le supprimer, l'exactitude N'EST PAS toujours trompeuse. Un distracteur doit être
faux dans le cadre de la question (« elle supprime le surapprentissage », « elle est obligatoire »), pas
discutable. Et un distracteur ne contredit jamais un encadré « Cas réel » de sa leçon.

## Ce que chaque question doit tenir (`atelier.js` le vérifie)

1. **Longueur et rang** : le rang visé (`cibles.json`), sans ex æquo avec la bonne réponse ; les
   distracteurs dans 70-130 % de sa longueur ; le rang en MOTS suit le rang en caractères.
2. **Marques — les quatre ou aucune** : `;`, `:`, parenthèse (même NOMBRE d'incises de 4+ caractères),
   glose finale, tiret (`—`, `–`, ` - `, « c'est-à-dire »), `/`, « », flèche `→`, virgule décimale,
   point final. ⚠️ Le CODE en porte : `entraînement/test` et `spam/non-spam` sont des barres obliques,
   `0/1/2` aussi ; `Charger → préparer` des flèches ; `0,90` une virgule décimale.
3. **Même nombre de `, : ;`** dans les quatre (« la plus détaillée » 70,5 %).
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre — fermer par ÉCHANGE de mots.
5. **Attaque** : les quatre options commencent par le même mot, ou par quatre mots différents (ou deux
   paires) — jamais trois pareils et un intrus. **Casse initiale** : la même partout (`fit` : minuscule).
6. **Absolus** (toujours, jamais, uniquement, seulement, aucun, impossible, rien…) : pas dans un
   distracteur si la bonne réponse n'en porte pas ; **prudents** (peut, permet, souvent, selon, plutôt,
   notamment) et **négation** (ne, pas, n', aucun, rien, ni, non, jamais) : les quatre ou aucune.
7. **Mots de 9+ lettres exclusifs** : autant dans chaque option (le plus simple : reprendre ceux de la
   bonne réponse dans les distracteurs). **Intrus** (5+ lettres) : aucun mot porté par exactement trois
   options ; chaque option a au moins un mot propre.
8. **Lexique** : `k` égal partout ; si `k > 0`, `w` égal partout.
9. **Tics de forme** : 0, 2 ou 4 porteurs (deux-points médian, glose finale, parenthèse ouverte par un
   article, « alors / ensuite / puis », « car / puisque / parce que », « ce / cette / ces »,
   « est / sont / reste / devient » en fin, « , et », « ne … que », « y » adverbial).
10. **Densité** : allonger avec le vocabulaire technique de la leçon, pas avec des chevilles ; mesurer
    « la plus dense » et « la moins bavarde » à la fin de chaque lot et DOSER par calcul (viser 25 %).

## L'ordre de travail

1. Relire la leçon entière (le corps fixe le vocabulaire et ce qui est vrai).
2. Écrire les trois erreurs de chaque question en une phrase, les EXÉCUTER si elles portent sur
   scikit-learn.
3. Rédiger au gabarit de la bonne réponse, dans la bande du rang visé ; `atelier.js`, corriger.
4. Poser par `pose.js --ecrire`, mesurer le cours entier, COMMITER le lot.
