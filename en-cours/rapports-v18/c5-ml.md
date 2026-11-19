# C5 — ml, 92,3 % → 25,0 %

Phase C du chantier V18, case C5 : les QCM du cours `ml` (12 leçons, 52 questions dont 12 de bilan,
156 distracteurs). Copie de travail `D:\test-claude-c5-ml`, branche `v18/c5-ml`, partie de `8d163bf`.
Un seul agent a tenu tous les rôles : preuves, écriture, dosage, relecture, contre-relecture. Le dépôt
principal `D:\test-claude\` n'a pas été touché. Consigne du cours : `scratchpad/CONSIGNE-ML.md`.

Chiffre de l'en-tête : « la plus longue » (`node tools/mesure-biais-qcm.js --seul=ml`), réussite d'un
apprenant qui coche toujours l'option la plus longue.

## 1. Avant / après

Avant = `8d163bf` (mesures archivées dans `scratchpad/c5-ml/depart/`, hors git) ; après = la tête de la
branche (`scratchpad/c5-ml/final/`).

| mesure | commande | avant | après |
|---|---|---:|---:|
| la plus longue | `node tools/mesure-biais-qcm.js --seul=ml` | **92,3 %** | **25,0 %** |
| pire des 44 stratégies | idem | 92,3 % (la plus longue) | **26,9 %** (la plus dense) |
| la plus détaillée | idem | 70,5 % | 25,0 % |
| le mot technique exclusif | idem | 64,3 % | 26,4 % |
| l'écho de la question | idem | 44,1 % | 25,0 % |
| RESTREINDRE à la ponctuation forte | idem | 44,1 % | 25,0 % |
| l'incise entre parenthèses | idem | 43,8 % | 25,0 % |
| ECARTER la moins bavarde | idem | 43,4 % | 25,2 % |
| ECARTER la plus courte | idem | 34,3 % | 26,0 % |
| questions trahies par 5 indices ou plus | idem | 26 sur 52 (50,0 %) | **0** |
| rangs de la bonne réponse (0 = la plus longue) | `node tools/plan-rangs-qcm.js ml` | 48 / 1 / 2 / 1 | **13 / 13 / 13 / 13** |
| questions à retoucher (plan des rangs) | idem | 48 (7 595 car.) | **0** |
| marques point interne / guillemets / flèche | `node tools/plan-rangs-qcm.js ml --marques` | 1 (guillemets, `lecon-09` q2) | **0** |
| lexique : exploitables / retournées / à mettre en forme | `node tools/mesure-lexique-qcm.js --liste=ml` | 45 / 26 / 48 | **0 / 0 / 0** |
| tics de lot | `node tools/mesure-tics-lot.js ml --exemples` | 9 (pire : deux-points médian, 38,5 %) | **aucun** |
| mots fétiches | `node tools/mesure-mot-fetiche.js ml` | 4 alertes | **0** |
| biais inverse | `node tools/mesure-biais-inverse.js --toutes ml` | 4 alertes | **0** |
| intrus lexical DEFAUT (direct / inverse / sûres) | `node tools/mesure-mot-question.js ml --liste` | 22,6 % / 25,8 % / 0 | 25,0 % / 25,0 % / 0 |
| intrus lexical EXCES (direct / inverse / sûres) | idem | 27,1 % / 23,6 % / 1 | 24,5 % / 25,2 % / 0 |
| point interne (« la seule en deux phrases ») | `node tools/mesure-point-interne.js` | 0 | 0 |
| atteintes à l'intouchable | `node tools/mesure-qcm-intouchable.js ml 8d163bf` | — | **aucune** (153 distracteurs réécrits sur 156) |
| explications orphelines | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --seul=ml` | — | **aucune** (13 cas indicatifs, lus : tous cohérents) |

Rendements à lire avec la réussite : « la DEUXIÈME / TROISIÈME plus longue » rendent 29,5 % et 30,2 % sur
les questions qu'elles tranchent, mais leur réussite est 25,0 % (rangs 13/13/13/13 : leur rendement vient
des ex aequo de longueur entre distracteurs) ; « ECARTER la moins bavarde » rend 66,7 % sur 3 questions
(couverture 5,8 %), réussite 25,2 %. Biais inverse : 6 fenêtres trop courtes (< 8 questions), aucune
mesurable au-dessus du seuil.

## 2. Distracteurs

- **153 réécrits sur 156, 3 gardés** (justes et sans marque) : `lecon-12` q5 « Régression », q7
  « predict », q8 « Une fuite de données ».
- Caractères des distracteurs : **4 835 → 14 104** (moyenne **31,0 → 90,4**), pour une bonne réponse
  moyenne de 90,5 caractères (intouchable, inchangée : 4 704 caractères au total).
- Calcul : `node scratchpad/c5-ml/sonde/bilan-chars.js 8d163bf` (hors git).

Chaque distracteur énonce une thèse fausse sur un comportement que scikit-learn 1.9.1 a EXÉCUTÉ (table de
`scratchpad/CONSIGNE-ML.md`) : `test_size` par défaut 0,25 et non 0,2, `confusion_matrix` en
[[VN, FP], [FN, VP]], `n_init='auto'`, `inertia_` = somme des carrés, `cross_val_score` à 5 plis, AUC sous
0,5 possible, R² négatif, F1 = 0,18 pour P = 0,90 et R = 0,10, etc.

## 3. Atteintes à l'intouchable (bonnes réponses, `explain`)

**Aucune.** Aucune bonne réponse ni explication n'a été prouvée fausse par exécution.

Signalées sans y toucher (non réfutables par exécution) :

- **`lecon-05` q3** (« Que mesure le rappel ? ») : la bonne réponse dit « Parmi les **vrais positifs**,
  la part que le modèle a effectivement retrouvée », et l'`explain` « combien des vrais positifs sont
  attrapés ». Dans la même page, VP désigne les vrais positifs de la matrice, tous retrouvés par
  définition (VP / VP = 1). Le sens voulu est « parmi les exemples réellement positifs ». Le corps, la
  légende, le glossaire et l'indice d'exercice ont été corrigés ; la bonne réponse et l'`explain` gardent
  la formule. À trancher par l'orchestrateur.
- **`lecon-07` q2** (ordre des étapes) : la bonne réponse place « préparer » avant « séparer
  entraînement/test ». Défendable (nettoyage et encodage sans apprentissage avant la séparation,
  imputation apprise après, comme le script corrigé de la même leçon), mais un lecteur strict peut y
  voir la fuite que la leçon 03 dénonce.

## 4. Fautes de fond corrigées, avec leurs preuves

Environnement : Python 3.14.5, venv `D:\outils-c\ml\venv` (hors dépôt), **scikit-learn 1.9.1**,
numpy 2.5.5, pandas 3.1.1, scipy 1.18.1. Preuves et sorties dans `scratchpad/c5-ml/preuves/` (hors
git ; `p01_qcm`, `p02_corps`, `p03_l12_lineaire`, `p04_corps2`, `p05_grille_c`, dossiers `l03`, `l07`,
`l12`). Les blocs de code de la leçon 12 ont été extraits de la page et rejoués tels quels.

Avant la vague (commit `044bb642`), parce qu'un corps qui change déplace le `k` du lexique :

1. **`lecon-12`, comparaison des modèles** : la page annonçait 0,94 / 0,90 / 0,96 et « la forêt
   mène ». Exécuté : régression logistique **0,980 ± 0,013**, forêt **0,960 ± 0,019**, arbre seul
   **0,910 ± 0,019** — la régression logistique mène. Schéma, légende, conclusion alignés.
2. **`lecon-12`, réglage** : le GridSearchCV de la forêt rendait `max_depth=10` et 0,960, pas
   « profondeur 6, 0,968 ». On règle donc le gagnant (C de la régression logistique, comme l'exercice 2
   de `lecon-11`) : grille 0,952 / **0,980** / 0,980 / 0,969 / 0,956, `best_index_` = 1 (C = 0,1, à
   égalité avec C = 1 : GridSearchCV garde le premier rang dans l'ordre de la grille).
3. **`lecon-12`, rapport final** : le rappel des malins valait 0,929, pas 0,94 ; avec le modèle réglé :
   test **0,974**, rappel des malins **0,952**, entraînement 0,987.
4. **`lecon-12`** : renvoi « (leçon 11) » pour la validation croisée → « (leçon 6) » ; « un rayon en
   millimètres » (unité non documentée par le jeu) → les plages mesurées (rayon 7 à 28, aire 144 à 2 501).
5. **`lecon-08`** : l'inertie est la somme des **carrés** des distances (`inertia_` = 57,41 ; somme des
   distances 49,90) — corps et glossaire.
6. **`lecon-10`** : « trop d'arbres » ne fait pas surapprendre une forêt (10 → 3 000 arbres : test
   0,70 / 0,74 / 0,74 / 0,73 / 0,72, sans dérive ; Breiman 2001, cité dans l'encadré de la page).
7. **`lecon-09`** : le commentaire « AUC entre 0,5 et 1,0 » ; une AUC descend à **0,0046** pour un score
   retourné → « 0,5 = hasard, 1,0 = parfait ».
8. **`lecon-07`** : le script « de bout en bout » imputait la médiane de l'âge sur tout X avant la
   séparation — la fuite que `lecon-03` dénonce. Médiane apprise sur le seul entraînement (rejoué sur un
   `passagers.csv` synthétique, sans avertissement pandas).
9. **`lecon-03`** : `X = X.dropna()` sans toucher `y` désaligne la cible : `ValueError` au `fit`
   (« inconsistent numbers of samples »), rejoué → `y = y.loc[X.index]`.
10. **`lecon-06`** : « on cherche la valeur qui maximise le score de test » contredisait le piège de la
    même leçon (« régler sur le test ») ; corps et solution de l'exercice 3 précisent qu'on règle par
    validation croisée.

À la relecture des corps (commit `bc40d95a`) :

11. **`lecon-04`** : le R² présenté comme « un score entre 0 et 1 » (corps, mémo, récap, indice
    d'exercice), alors que la même page le dit négatif plus bas. Exécuté : une constante au-dessus de la
    moyenne donne `r2_score` = **−0,481**. Il « vaut au plus 1 ». Accord : « Techniques qui brident ».
12. **`lecon-05`** : « parmi les vrais positifs, combien ai-je retrouvés » (corps, légende, glossaire)
    → « parmi les exemples vraiment positifs » (voir § 3).
13. **`lecon-02`** : les titres numérotaient 4 « séparer », 5 « entraîner », 6 « évaluer » contre
    l'aperçu et le schéma (4 entraîner, 5 évaluer, 6 utiliser et itérer) ; titres alignés sur le schéma.
14. **`lecon-06`** : l'exercice 4 applique son diagnostic « aux trois couples de la leçon », qui n'en
    montrait que deux ; le troisième (0.88 / 0.85, bon réglage) est ajouté au code de la leçon.
15. **`lecon-03`** : l'extrait d'imputation calcule la moyenne sur tout X ; un commentaire renvoie à la
    règle de la fuite de données de la même page.

À la contre-relecture (commit `60151409`) :

16. **`lecon-05`** : l'indice d'exercice « Couverture des vrais positifs » n'avait pas suivi la
    correction 12 → « Couverture des cas vraiment positifs ».

Aucun encadré « Cas réel », intertitre ou ligne `Source :` modifié (`node tools/verif-contenu.js` :
1 551 conformes sur 1 551).

## 5. Relecture et contre-relecture

- **Relecture par contradiction** (commit `318fa1fc`) : **16 distracteurs corrigés sur 153 réécrits
  (10,5 %)**. Le plus grave : en `lecon-12` q1, les trois distracteurs portaient la clause VRAIE
  « dépend moins d'un découpage chanceux », recopiée de la bonne réponse pour égaliser le lexique ; ils
  n'avancent plus que des thèses fausses. Les autres : thèses imprécises ou bancales (`lecon-03` q1 et
  q3, `lecon-05` q1, `lecon-08` q4, `lecon-10` q3, `lecon-11` q4, `lecon-12` q6, q8, q9, q13).
- **Contre-relecture de mes corrections** (commit `60151409`) : **2 fautives sur 28** (16 distracteurs et
  12 retouches de corps), soit **7,1 %** : un « il applique » sans antécédent (`lecon-11` q4) et
  l'indice d'exercice non propagé (§ 4, point 16). Les chiffres de la leçon 12 ont été recomparés aux
  sorties des preuves : conformes.
- Dernière retouche à la mesure finale (commit `1f51442a`) : `lecon-01` q3, un distracteur de 58
  caractères sous la bande 0,7 × 85 = 60 de `plan-rangs-qcm`.

## 6. Exécuté / non exécuté

**Exécuté** (scikit-learn 1.9.1) : chaque comportement de bibliothèque cité par un distracteur ou une
correction (table de `CONSIGNE-ML.md`), les blocs de code de `lecon-12` extraits de la page, le script
de `lecon-07` (sur un `passagers.csv` synthétique), l'extrait `dropna` de `lecon-03`, l'inertie de
`lecon-08`, la forêt de `lecon-10`, l'AUC de `lecon-09`, le R² de `lecon-04`, la fonction
`diagnostic` de l'exercice 4 de `lecon-06` (0.88 / 0.85 → « correct »).

**Non exécuté** :

- les encadrés « Cas réel » (Gmail, Zillow, radios de pneumonie, etc.) : faits historiques, hors du
  périmètre et intouchables ;
- les affirmations conceptuelles sans comportement observable (définitions, ordre des étapes de
  `lecon-07` q2, formule du rappel de `lecon-05` q3) : relues, pas exécutables ;
- les exercices `type:python` des pages n'ont pas été rejoués par leur moteur navigateur (Pyodide) ;
  `verif.js --rapide` les couvre (§ 7).

## 7. Vérifications finales

- `node tools/verif-html.js` : **0** problème grave, 0 remarque.
- `node tools/verif-contenu.js` : 1 551 « Cas réel » conformes sur 1 551, code 0.
- JSON : chaque bloc `data-quiz`, `data-quiz-bilan` et `data-exos` des 12 leçons se parse ; **0 CR**,
  **0 BOM** dans chaque fichier modifié.
- `node tools/verif-donnees.js` : **seul I18** en erreur (index dérivés périmés : `quiz-index.js`,
  `flashcards-data.js`, `antiseches-data.js` — dont le mémo « Régression avec scikit-learn », changé par
  la correction 11 —, `search-index.js`). Attendu : `js/*` est hors de mon périmètre, à régénérer après
  fusion (`build-index.js --write --fresh`).
- `node tools/verif-qcm-biais.js` et `node tools/verif-qcm-lexique.js` : seule alerte « référence
  périmée » pour `ml` (le gain n'est pas figé : 92,3 % → 25,0 % ; STRICTE 46,7 % → 0,0 %). Attendu :
  les références sont dans `tools/*`, à refiger par l'orchestrateur.
- `node tools/verif.js --rapide` (542,9 s, machine chargée par les autres agents ; un premier passage
  coupé à 590 s n'a pas abouti) : **RÉSULTAT : 0 PROBLÈME**, 6 vérificateurs signalent (54 étapes
  jouées sur 83) :
  - `donnees` (I18, ci-dessus), `qcmbiai`, `qcmlexi` (références périmées), `normatf` : attendus ;
  - `etudes` et `etude-6` (`tools/preuves/etude-inconnu.js`) : la page dérivée
    `pages/etude-inconnu.html` publie une mesure du corpus de code (« 10620 blocs d'au moins 5 lignes
    non vides », 6560,6 Ko) ; la mesure du jour rend 10622 et 6561,0 Ko, parce que deux de mes
    corrections de corps ont allongé deux blocs jusqu'au seuil de 5 lignes (le commentaire de
    `manquantes.py` en `lecon-03`, le troisième couple de `ecart.py` en `lecon-06`). Page dérivée hors
    de mon périmètre : à réassembler après fusion.
  Aucune modification laissée par les vérificateurs dans l'arbre de travail.
- `node tools/verif.js --mutations` : jamais lancé (consigne).

## 8. Ce que ce cours apprend

1. **Égaliser le lexique en recopiant la bonne réponse recopie aussi sa vérité.** En `lecon-12` q1, la
   fin de la bonne réponse (« dépend moins d'un découpage chanceux ») posée dans les trois distracteurs
   tenait `k`, `w`, l'écho et l'intrus — et rendait les trois distracteurs en partie vrais. Aucun outil
   ne le voit ; seule la relecture l'a trouvé.
2. **Les chiffres d'un projet « de bout en bout » s'inventent.** La leçon 12 annonçait un gagnant
   (la forêt) et des scores que l'exécution dément ; la conclusion pédagogique (« comparer avant de
   choisir ») tenait, mais pas l'histoire racontée.
3. **Fermer un indice en rouvre un autre, encore** : remplacer « sous-apprentissage » (mot étranger à la
   page) par « Un modèle trop simple » fermait le lexique et rouvrait le mot technique exclusif (bonne
   seule désignée) et une alerte de biais inverse ; « Trop de régularisation » (mot de 9+ lettres
   présent dans la page) ferme les trois. Ajouter « chaque » pour tenir `w` a porté le fétiche de
   27,7 % à 28,2 % : il a fallu l'ôter ailleurs.
4. **Une sonde qui ne vérifie que le rang laisse passer la bande** : mon banc (`atelier.js`) contrôlait
   le rang de longueur, pas la bande 0,7–1,3 de `plan-rangs-qcm` ; un distracteur à 58 caractères pour
   85 n'est apparu qu'à la mesure finale. Défaut de ma sonde, pas des outils.

## 9. Ce qui reste

- Trancher `lecon-05` q3 (« vrais positifs » dans la bonne réponse et l'`explain`) et, si on le
  souhaite, `lecon-07` q2 (§ 3).
- Régénérer les index dérivés (I18) et refiger les références des deux cliquets QCM pour verrouiller
  le gain de `ml`.
- `lecon-12` q13, distracteur 3 (« Elle retire le test de nombreux arbres… ») : faux et lisible, mais
  peu plausible ; gardé faute d'une variante qui tienne les mesures.

## 10. Notes

- Deux messages de commit sont inexacts (sans amendement, la branche n'étant pas réécrite) : le lot 3
  (`d7c1d0d8`) annonce des rangs 25/9/9/9 au lieu de 28/8/8/8 ; le lot 5 (`f9d5d43c`) liste comme
  gardés « q5 d1/d3, q7 d1, q8 d1/d3 » — les trois distracteurs gardés sont ceux du § 2 (`lecon-12`
  q8 d1 a depuis été réécrit à la relecture).
- Rien n'a été écrit dans une mémoire (le serveur de mémoire partagée répondait 503, et la consigne
  exclut la mémoire de l'orchestrateur).
- Aucun travail de plus de 30 minutes : pas de comparaison GPU / CPU à faire.
