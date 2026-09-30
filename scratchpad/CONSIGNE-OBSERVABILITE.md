# Consigne d'écriture — les QCM du cours `observabilite` (B4, 56ᵉ cours)

Préparée le 2026-09-30, à la clôture du 55ᵉ cours (`lisp`). Mesures de départ archivées dans
`scratchpad/observabilite-depart/` (sorties brutes des outils). Sondes prêtes dans
`scratchpad/observabilite-sonde/` (`controle.js` v2, `simule.js`, `essai.js`, `essai2.js`, `pose.js`,
`rempl.js`, `k.js`, `dosage.js`, `chaque.js`), copiées de `lisp-sonde` et pointées sur
`pages/observabilite/` (`controle.js` à vide : **0 indicateur déplacé sur 56 questions**).

Tu écris les **distracteurs** d'un lot de questions du cours `observabilite` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).
Le cours s'intitule « Observabilité & SRE » : pourquoi l'observabilité (monitoring contre
observabilité, les trois piliers), les journaux structurés, les métriques et les tableaux de bord,
le tracing distribué, l'alerting et les SLI/SLO, rendre une app observable, OpenTelemetry, les
types de métriques et PromQL, les journaux à grande échelle, la gestion d'incident (budget
d'erreur, burn rate, astreinte, post-mortem), puis un projet qui instrumente un service de bout
en bout (`lecon-11`, **16 questions dont 12 de bilan**).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-écris un patch.

Les QCM sont dans `pages/observabilite/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-11`). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Écris tes patchs dans `scratchpad/observabilite-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/observabilite-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js`
refuse de toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un
fichier qui contient un antislash : l'outil Bash en mange un niveau. Écris tes scripts avec Write.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Aux 53ᵉ, 54ᵉ et 55ᵉ cours, après des vagues où toutes les mesures étaient vertes, la relecture a
encore trouvé des distracteurs inintelligibles, des fautes de français et **des distracteurs VRAIS**
— des queues de phrase ajoutées pour tenir un compte de caractères, des parenthèses qui n'énoncent
rien. Au 55ᵉ, la contre-relecture a même trouvé un distracteur rendu vrai PAR SA CORRECTION.

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette forme » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).
6. **Aucun distracteur qui annonce une valeur sans la prouver fausse** : si un distracteur dit
   « `rate()` renvoie le total de la fenêtre » ou « 99,9 % laisse 4 heures par mois », la valeur
   vraie a été **calculée** (voir plus bas), pas estimée.

⚠️ **Le piège propre à ce cours : les bonnes pratiques sont des NUANCES, pas des absolus.** « On
n'alerte jamais sur le CPU » est faux ; « le CPU n'a pas sa place sur un tableau de bord » aussi.
Un distracteur qui pousse une bonne pratique un cran trop loin peut devenir **vrai dans le
contexte d'un autre** : vérifie que ta thèse est fausse **au sens de la page** et de la source
officielle, pas seulement « moins bonne ».

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, LE PromQL S'EXÉCUTE

- **PromQL** : `promtool` 3.15.0 portable est dans `scratchpad/prometheus/prometheus-3.15.0.windows-amd64/`
  (hors git, rien d'installé). Il évalue une expression sur des séries synthétiques :
  écris un fichier de test (outil Write), mets une valeur attendue absurde (`999`), et lis le
  `got:` dans l'échec. Modèle prêt : `scratchpad/observabilite-prom/t2.yml`.
  `scratchpad/prometheus/prometheus-3.15.0.windows-amd64/promtool.exe test rules <ton fichier>.yml`
- **Arithmétique** (SLO, budget, burn rate, percentiles, cardinalité, échantillonnage) :
  `node -e "..."` ou un script écrit avec Write. **Aucun chiffre de tête.**
- **Ce qui ne s'exécute pas** (OpenTelemetry, W3C Trace Context, pratiques SRE) : cite la source
  officielle — prometheus.io, opentelemetry.io, w3.org/TR/trace-context, sre.google (livres SRE
  et *SRE Workbook*). Si la page affirme autre chose que la source, **tu le remontes**, tu ne
  tranches pas de mémoire.

**Erreurs classiques de débutant en observabilité** (n'utilise que celles que TA leçon établit).
Les lignes marquées ▶ ont été **exécutées** à la préparation (promtool 3.15.0 ou Node) :

| croyance fausse | ce qui est vrai |
|---|---|
| ▶ `rate(c[5m])` renvoie l'augmentation totale sur 5 min | un débit **par seconde** : compteur à +60/min → **1** ; c'est `increase(c[5m])` qui rend **300** |
| ▶ afficher un counter brut suffit | il monte sans fin (**600** après 10 min à +60/min) ; on lit sa pente avec `rate()` |
| ▶ `rate()` sur une jauge donne sa pente | `rate()` prend chaque baisse pour une remise à zéro : jauge 10/5/10/5… → **0,083**/s au lieu de **0** avec `deriv()` |
| ▶ une remise à zéro du compteur fausse `rate()` | `rate()` la détecte : 0→180, reset, 0→360 sur 10 min → **0,889**/s (≈ 540 / 600, extrapolation comprise) |
| ▶ on peut moyenner les p99 de deux serveurs | p99 de A **0,1** s, de B **0,3** s : moyenne **0,2**, vrai p99 fusionné **0,3** |
| ▶ `histogram_quantile` rend une valeur mesurée exacte | il **interpole** dans la tranche : 90 % ≤ 0,5 s, 99 % ≤ 1 s → p95 = **0,778** s |
| ▶ 99,9 % sur 30 jours laisse quelques heures de panne | **43,2 min** (99 % → **432 min**, 99,99 % → **4,32 min**) |
| ▶ un burn rate de 14,4 pendant 1 h est anodin | il consomme **2,0 %** du budget de 30 j en 1 h, et l'épuise en **50 h** |
| la moyenne dit l'expérience de tous | la moyenne cache la queue : le p99 montre ce que vivent les plus lents |
| les trois piliers sont interchangeables | métriques = « quoi / combien », traces = « où », logs = « pourquoi / détail » |
| un post-mortem désigne le coupable | il est **sans blâme** : on corrige le système, pas la personne |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **96,4 %** des QCM de `observabilite` en cochant l'option
la plus longue. Relevé du 2026-09-30, `node tools/mesure-biais-qcm.js --seul=observabilite`
(56 questions, dont 12 de bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **96,4 %** | 100,0 % | 96,4 % |
| la plus détaillée | **85,7 %** | 82,1 % | 97,8 % |
| l'incise entre parenthèses / RESTREINDRE à la parenthèse | **70,1 %** | 58,9 % | **100,0 %** |
| le mot technique exclusif | **64,1 %** | 66,1 % | 78,4 % |
| la seule avec une PONCTUATION FORTE | **53,1 %** | 37,5 % | **100,0 %** |
| ECARTER la moins bavarde | 49,3 % | 14,3 % | **100,0 %** |
| RESTREINDRE aux deux-points | 40,6 % | 21,4 % | **100,0 %** |
| la seule avec un point-virgule | 38,4 % | 17,9 % | **100,0 %** |
| l'écho de la question | 37,6 % | 33,9 % | 57,9 % |
| la plus prudente | 33,9 % | 14,3 % | 87,5 % |
| guillemets / barre oblique / flèche | 30–32 % | 7–9 % | **100,0 %** |

**83,9 %** des questions (47 sur 56) sont trahies par **5 indices ou plus** sur 44.

## Le travail est de l'ALLONGEMENT

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **104,3 caractères** |
| longueur moyenne d'un distracteur | **29,0 caractères** |
| **rapport** | **3,60** (`lisp` : 4,19 ; `perf-web` : 3,36) |

`node tools/plan-rangs-qcm.js observabilite` demande **10 491 caractères** sur **55 questions sur
56**. Rangs actuels **54 / 2 / 0 / 0**, cible **14 / 14 / 14 / 14**. **Suis EXACTEMENT** le rang visé
et la bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la
bonne réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

⚠️ Beaucoup de distracteurs actuels sont des **boutades** (« Parce que 100 % est illégal », « À
punir les développeurs », « Parce qu'ils sont plus jolis ») : aucun débutant ne les coche. Remplace-
les par des **contresens réels** — ceux de la table ci-dessus, ou ceux que ta leçon réfute
explicitement (encadrés « Attention », « Erreur fréquente », exercices).

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes observabilite` rend **4 alertes** au départ (la
QUATRIÈME plus longue 32,6 %, la TROISIÈME 31,8 %, la DEUXIÈME 31,4 %, la moins bavarde 28,7 %).
**Le rang en MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.** Quand la bonne réponse
est la plus courte, qu'**un** de ses distracteurs ait autant de mots qu'elle (égalité) plutôt que
tous davantage — et vise qu'un distracteur en ait **un de moins** quand la bonne est au rang 3.

### (2) LA PONCTUATION — et L'UNION (53,1 %, rendement 100 %)
Par marque (`;`, `:`, parenthèse, tiret, barre oblique, guillemets « », flèche `→`, virgule
décimale), **les quatre options la portent, ou aucune** ; vérifie aussi l'UNION (« PONCTUATION
FORTE » = `:` ou `;` ou tiret). ⚠️ **Dans ce cours, le CODE porte des parenthèses** :
`rate(x[5m])` compte comme une parenthèse pour l'outil, et `99,9 %` comme une virgule décimale.

### (3) LES QUINZE TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js observabilite --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **glose finale entre parenthèses** | **16 / 2** | 14 | **100,0 %** | **43,8 %** |
| **deux-points médian** | **12 / 2** | 12 | **100,0 %** | **41,1 %** |
| **point-virgule médian** | **10 / 0** | 10 | **100,0 %** | **38,4 %** |
| quatre segments séparés par virgule | 7 / 3 | 8 | 100,0 % | 35,7 % |
| guillemets français | 6 / 3 | 5 | 100,0 % | 31,7 % |
| « le temps » | 5 / 0 | 5 | 100,0 % | 31,7 % |
| virgule avant « et » ; « à travers » ; « on peut » ; « tous les » ; « même requête » ; « le trace » | 4 / 0 chacun | 4 | 100,0 % | 30,4 % |
| « une requête » | 4 / 1 | 5 | 80,0 % | 29,9 % |
| **connecteur causal / « parce que »** | **1–2 / 18** | 5–6 | 60–67 % | 28–30 % |

Le gabarit des bonnes réponses est « réponse (exemple) », « réponse : explication » ou « réponse ;
conséquence » : donne-le à tes distracteurs, avec un contenu qui dit quelque chose. ⚠️ **« Parce
que » est un tic de DISTRACTEUR** (18 contre 1) : quand la bonne réponse d'un « Pourquoi… ? » n'en
porte pas, **retire-le** des distracteurs plutôt que de le garder — ou mets-le dans deux options.

### (4) ⚠️ LES MOTS FÉTICHES — 5 ALERTES DÈS LE DÉPART
`requête` (8 bonnes / 1 distracteur, RESTREINDRE **35,3 %**), `traces` (7 / 3, **32,6 %**),
`erreurs` (6 / 4, **31,0 %**), `métriques` (6 / 6, **30,4 %**), `données` (5 / 8, **28,1 %**) ; juste
sous le seuil ou sur trop peu de questions : `services` (6 / 0), `service` (5 / 1), `incident`
(6 / 3), `latence` (4 / 2). **Pose ces mots dans des distracteurs**, là où ils ont un sens.
**N'emploie pas « chaque », « chaîne » ni « valeur »** pour allonger : aux 50ᵉ à 52ᵉ cours, la
correction a fabriqué son propre mot fétiche avec eux. **« chiffrer »** (0 / 11) et **« réseau »**,
**« remplacer »** (0 / 6) sont déjà des mots de DISTRACTEUR : ne les multiplie pas.

### (5) LE MOT TECHNIQUE EXCLUSIF (64,1 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune.
`node tools/mesure-mot-question.js observabilite --plan` donne la liste exacte, question par
question (**90 mots à traiter sur 16 questions qui tranchent**).

### (6) L'ÉCHO DE L'ÉNONCÉ (37,6 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les sigles courts passent
sous le radar : `SLI`, `SLO`, `log`, `logs`, `span`, `trace`, `rate`, `p99`, `OTel`, `SRE` —
compte-les.

### (7) L'INDICE LEXICAL — 51 exploitables, 34 retournées, 54 à mettre en forme sur 56
`node tools/mesure-lexique-qcm.js --liste=observabilite`. **Règle du `k`** : les QUATRE options
portent le même nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en
OCCURRENCES** : un mot étranger répété compte deux fois. **Règle du `w`** : quand `k > 0`, les
quatre portent aussi le même nombre de mots de 6+ lettres. Un substitut doit être **présent dans
la page** (jeton entier ; l'apostrophe et le tiret séparent les mots). Cible : 0 / 0 / 0.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE — les quatre options ont le MÊME nombre de phrases
Le point suivi d'une espace puis d'une majuscule est la signature ; « etc. », « ex. », la virgule
décimale et le point d'un `objet.methode()` ne comptent pas.

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js observabilite <sha>`.
2. **Aucun distracteur ne doit devenir vrai** — et ici, une bonne pratique poussée trop loin peut
   redevenir vraie ailleurs : relis ta thèse contre la page ET contre la source.
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`.
4. **Aucune URL externe** dans le contenu.

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js observabilite` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger,
   et **exécute** (promtool, Node) chaque valeur ou comportement que tu annonces.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Pose, puis relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js observabilite
node tools/mesure-mot-question.js observabilite --plan
node tools/mesure-biais-qcm.js --seul=observabilite
node tools/mesure-biais-inverse.js --toutes observabilite
node tools/mesure-lexique-qcm.js --liste=observabilite
node tools/mesure-mot-fetiche.js observabilite
node tools/mesure-tics-lot.js observabilite --exemples
node scratchpad/observabilite-sonde/essai.js "<fragment unique de l'énoncé>"
```

---

## CE QUE LES 53ᵉ À 55ᵉ COURS ONT APPRIS À L'ORCHESTRATEUR

- **La relecture par contradiction doit lire les CORPS et les VÉRIFIER** : 51 fautes de corps sur
  92 pour `dart`, 99 sur 179 pour `perf-web`, 56 sur 113 pour `lisp`. Aucun des 46 outils ne lit un
  corps. Pour `observabilite`, faire tourner **chaque PromQL** qui annonce un résultat sous
  `promtool`, **chaque calcul** de SLO / budget / percentile sous Node, et confronter chaque
  affirmation sur OpenTelemetry ou W3C Trace Context à la spécification.
- **La CONTRE-RELECTURE des corrections** : 18,2 % des corrections fautives sur `perf-web`, 25,0 %
  sur `lisp`. À refaire avant de clore ; demander aux correcteurs de chercher la même faute dans
  TOUTES leurs leçons, pas seulement là où elle est listée.
- **Relancer `mesure-mot-fetiche` APRÈS la relecture** : ses réécritures fabriquent un mot fétiche
  que `controle.js` (stratégies par question) ne voit pas.
- **Une correction de CORPS change le vocabulaire de la page** et peut rouvrir `k` : relancer
  `controle.js --ref=<sha de la vague>` après toute correction de corps.
- **`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges`** :
  sans `--only`, `antiseches` et `pieges` restent périmés.
- **Dosage calculé** (`dosage.js`) : combien de points retirer, puis quelles questions rapportent le
  plus. Raccourcir un distracteur en ôtant des mots courts le rend PLUS DENSE : remplacer, pas ôter.
- **Un réveil qui termine son tour pendant un Workflow le tue** : attendre dans le même tour.
- Clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` à la main ;
  `verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, `tools/etudes/inconnu/assembler.js` et
  `tools/etudes/recherche/assembler.js`, puis index, jusqu'au point fixe (vérifié par empreinte).
