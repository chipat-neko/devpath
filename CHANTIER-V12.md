# Chantier V12 — les 42 points de l'inventaire

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**Origine** : l'inventaire du 2026-08-20 (`INVENTAIRE-2026-08-20.md`, 11 agents). 29 propositions,
**26 manques vérifiés** après filtrage sceptique, plus **15 rattrapés par les filtres** eux-mêmes.
Décision de Noah : traiter le rapport en entier.

Les points sont regroupés **par thème**, pas par angle d'audit : trois angles indépendants ont trouvé
le même manque (le cahier d'erreurs), et plusieurs autres se recoupent.

---

## ⚠️ CE QUE CET INVENTAIRE A PROUVÉ

Les quatre vérificateurs étaient **verts** quand l'inventaire a trouvé **5 exemples dont la sortie
annoncée était fausse** — dont une leçon sur les regex qui affichait `// true` sous un test renvoyant
`false`, visible par l'apprenant puisque `runner.js` pose un bouton « ▶ Tester ».

Ces 5 erreurs sont **déjà corrigées** (commit du 2026-08-20, 10 assertions rejouées). Mais la cause
reste : **aucun outil n'exécute jamais un exemple.** 1 862 valeurs attendues sont écrites en
commentaire et 4 241 réponses d'exercices sont déclarées ; personne ne les confronte au réel.

C'est pourquoi la **phase A est l'outillage** : elle sert à tout le reste, et elle attrape ce que
les yeux ne voient pas.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure. Le compte rendu cite le chiffre avant et après.
- **Vérifier avant de faire** : les chiffres datent du 2026-08-20. Reproduis la mesure ; si un point est déjà réglé, coche-le en le signalant.
- **NE JAMAIS CORRIGER UN CALCUL DE TÊTE, LE FAIRE TOURNER.** Règle héritée du chantier V11, et c'est elle qui a permis de trouver les 5 erreurs.
- **Un commit par point**, avec la mesure dans le message.
- `node tools/verif.js --rapide` doit rester vert ; `verif-rendu` dès que tu touches à du CSS.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, aucune dépendance installée.
- **⚠️ ORDRE DES FEUILLES CSS** : `variables` → `base` → `layout` → `components` → `pages`. Une règle de même spécificité placée dans un fichier antérieur est **écrasée**.
- **⚠️ `.tag` et `.module` percutent les jetons Prism** : toute classe portant un nom de jeton doit exclure `.token`.
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`**.
- **⚠️ Un motif de remplacement trop large casse ce qui était juste** : un même chiffre apparaît souvent plusieurs fois dans une page pour des raisons différentes. Rejoue le scénario complet après correction.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — L'outillage (la cause racine, à faire en premier)

- [ ] **A1 · Exécuter les exemples.** Nouvel outil `tools/verif-exemples.js` : extraire les blocs de code portant une valeur attendue en commentaire (`# affiche : …`, `// true`, `=> …`) et **les exécuter réellement**. JavaScript dans un contexte Node isolé ; Python via l'interpréteur s'il est disponible, sinon signaler les blocs non vérifiables plutôt que de les ignorer silencieusement. **1 862 valeurs** sont concernées. Commencer par JavaScript (332 blocs, exécutables sans dépendance), puis Python. L'outil doit distinguer trois états : **conforme**, **divergent**, **non exécutable** — et ne jamais faire passer un non-exécutable pour un conforme.

- [ ] **A2 · Étendre A1 aux réponses d'exercices.** **4 241 réponses attendues** sont déclarées dans les blocs `data-exos` sans être confrontées au code de la solution. Pour les exercices `type:code` en JavaScript, rejouer la solution et vérifier qu'elle satisfait `run.expect`. Chiffrer ce qui est vérifiable et ce qui ne l'est pas.

- [ ] **A3 · Le biais de longueur des QCM.** Mesure de l'inventaire : dans les **5 643 questions**, la bonne réponse est **la plus longue 93 % du temps**. Un apprenant qui répond « la plus longue » a donc 93 % sans rien savoir. Deux travaux distincts, à ne pas confondre : (a) un **détecteur** dans `verif-contenu.js` qui signale les questions où la bonne réponse dépasse nettement les distracteurs ; (b) la **correction éditoriale**, qui est un chantier à part — étoffer les distracteurs, pas raccourcir la bonne réponse. Faire (a) d'abord, et mesurer combien de questions (b) concernerait. Vérifier aussi que les options sont bien mélangées à l'affichage.

- [ ] **A4 · Relier les compteurs affichés à la réalité.** Les chiffres de l'accueil, du catalogue et d'« À propos » sont écrits en dur et ne sont reliés à rien — ils ont été faux trois fois dans l'histoire du projet (79/938, puis 1341, puis 13 pages de cours). Ajouter un invariant à `verif-donnees.js` qui compare chaque chiffre affiché au décompte réel.

- [ ] **A5 · Titres : `data.js` contre le `<h1>`.** Rien ne rapproche le titre déclaré d'une leçon de celui affiché. **4 divergences vivantes** relevées. Nouvel invariant.

- [ ] **A6 · Étiquettes de langage des blocs de code.** **Un bloc sur cinq** est coloré par la mauvaise grammaire : `I14` vérifie que la grammaire est chargée, jamais qu'elle correspond au contenu. Détecter les blocs dont le contenu ne ressemble pas au langage annoncé (heuristique simple : mots-clés caractéristiques).

- [ ] **A7 · SQL : dialecte et mots réservés.** **354 blocs SQL**, aucun contrôle. C'est la seule famille de fautes que l'audit V10 a dû trouver à la main (`end` comme nom de colonne dans 5 leçons). Vérifier au minimum les mots réservés du standard et la cohérence de dialecte à l'intérieur d'une même leçon.

- [ ] **A8 · `verif-rendu` ne visite que 20 pages sur 1 702.** Et **82 des 83 pages `cours.html` ne sont jamais mesurées**. Élargir l'échantillon par défaut : toutes les pages de premier niveau, tous les `cours.html`, une leçon par cours.

- [ ] **A9 · Durées annoncées.** Le rythme de lecture implicite varie **d'un facteur 4,7** selon le cours. `I2` vérifie que les durées existent, jamais qu'elles sont plausibles. Ajouter un avertissement (pas une erreur) sur les cours dont le rythme s'écarte trop de la médiane.

---

## PHASE B — Les données de l'apprenant (risque de perte réelle)

- [ ] **B1 · Les écritures qui échouent en silence.** **24 points d'écriture `localStorage`, 3 seulement préviennent** l'utilisateur ; les 19 autres sont des `catch (e) {}` vides — dont `mes-qcm.js` (les questions qu'il a rédigées) et `playground.js` (son code). `QuotaExceeded` : 0 occurrence dans tout `js/`. En mode privé ou profil durci, il travaille une heure sans qu'un mot ne dise que rien n'est gardé. Extraire un helper `safeSet()` renvoyant un booléen, remplacer les 19 `catch` vides, s'appuyer sur `window.SyntaxeToast` qui existe déjà et est chargé sur les 62 pages.

- [ ] **B2 · Une donnée corrompue est relue comme vide.** Tous les lecteurs font `try { JSON.parse(…) } catch { return {} }` : si `syntaxe-progress` est abîmé, la progression **paraît effacée**, rien ne le dit, et la première écriture suivante l'écrase définitivement. Distinguer « absent » de « présent mais illisible », et proposer l'export brut avant d'écraser.

- [ ] **B3 · L'import écrase au lieu de fusionner.** C'est la seule route entre deux machines. Proposer un vrai choix : remplacer ou fusionner (en gardant le meilleur score et l'union des leçons terminées).

- [ ] **B4 · « Mes données » est introuvable.** La seule page de sauvegarde et de réparation n'est accessible que par un lien de pied de page. La rendre découvrable depuis la page Progression.

- [ ] **B5 · Aucun repli `<noscript>`.** Sans JavaScript, les **62 pages transverses** sont des pages blanches muettes. Un message court expliquant que le site a besoin de JavaScript, injecté dans un gabarit.

---

## PHASE C — Le cahier d'erreurs (trouvé par trois angles indépendants)

- [ ] **C1 · L'examen n'enregistre rien.** `js/examen.js` (225 lignes) ne contient **aucun `localStorage`** : le score s'affiche et disparaît. C'est la seule activité du site dont il ne reste aucune trace — les 18 libellés de `donnees-perso.js` inventorient tout le reste. Empiler `{date, cours, score, total}` dans `syntaxe-examen`.

- [ ] **C2 · Le champ `f` est jeté.** `prepare()` fabrique `{q, e, c, opts}` et **abandonne `f`**, alors que les **5 627 questions** de `quiz-index.js` le portent. Conséquence : une correction ne peut pas pointer la leçon qui enseigne la réponse. Le conserver et composer le lien `../<c>/<f>`.

- [ ] **C3 · Rien ne liste ce qu'on a raté.** `saveQuizBest()` n'écrit que `{best, total}` ; les quatre consommateurs ne lisent que le **haut** de la distribution (« Maîtrisé », « Sans faute », « As des QCM »). Aucune page ne montre les leçons à score bas. Ajouter une section « À retravailler » dans `progression.html`. **Réserve à traiter** : pour dire *quelle notion* et pas seulement *quelle leçon*, il faut aussi noter l'index des questions ratées — quelques lignes dans `lecon.js`, `examen.js` et `cours.js`.

- [ ] **C4 · L'examen ignore ce qui a été lu.** `pool = BANK.filter(q => q.c === c)` puis mélange : sur JavaScript (65 leçons), qui en a fait 10 reçoit ~85 % de questions sur du contenu jamais ouvert, obtient 6/20, et le site lui répond « À retravailler — courage ! ». **Une case à cocher « seulement les leçons que j'ai terminées »** — les deux ingrédients existent déjà (`syntaxe-progress` et le champ `f`). L'inventaire le désigne comme le meilleur rapport effet/effort du rapport.

- [ ] **C5 · Rejouer les questions ratées.** Une fois C1 à C4 en place : un mode « refaire ce que j'ai raté », qui tire dans l'historique plutôt que dans la banque entière.

---

## PHASE D — Les pièges et les liens perdus

- [ ] **D1 · Indexer les 1 741 « Piège fréquent ».** Le site s'est donné une convention éditoriale forte — **1 777 occurrences** sur 949 leçons et 62 cours — et aucune page ne les rassemble. Un `buildPieges()` calqué sur `buildCheats`, un `js/pieges-data.js`, une page calquée sur `antiseches.html`. **Zéro contenu nouveau.** C'est aussi le meilleur matériau de flashcards du site : un piège est une prédiction vérifiable, une définition ne l'est pas.

- [ ] **D2 · Les 25 cours sans aucun encadré d'erreur.** À faire **avec D1**, sinon l'index publie un trou. Concernés : les quatre cours `-avance` et les vagues d'ajout tardives (`docker`, `api`, `securite`, `patterns`, `formats`, `nosql`, `markdown`, `vue`, `vscode`, `sass`, `http`, `a11y`, `perf-web`, `cloud`, `iac`, `wasm`, `linux`, `reseaux`, `ux`, `observabilite`, `os`). Cause identifiée : `verif-contenu.js` **compte** les encadrés sans jamais exiger qu'il y en ait un sur l'erreur. Ajouter un invariant en **avertissement** (double palier, comme I17) pour que le trou ne se rouvre pas.

- [ ] **D3 · Flashcards et glossaire ne renvoient à aucune leçon.** **10 678 cartes et 9 700 entrées** ne pointent que vers le cours. Or le générateur connaît la leçon d'origine : il la jette. La rétablir dans les deux index.

- [ ] **D4 · La révision ignore ce qu'on a étudié.** Elle propose les 10 678 cartes du site, sans option « seulement ce que j'ai lu ». Quelques lignes : lire `syntaxe-progress`.

- [ ] **D5 · Le moteur Leitner est bridé.** `revision.js` implémente un vrai Leitner (5 boîtes, intervalles 0/1/3/7/16 jours, échéances persistées) mais ne tourne que sur du vocabulaire. Le brancher sur les questions de QCM et les pièges (D1), qui sont un bien meilleur matériau de rappel.

---

## PHASE E — Navigation et reprise

- [ ] **E1 · La palette ne connaît que les leçons.** Les **40+ outils et pages transverses** sont introuvables au clavier. Les ajouter à `search-lite.js`.

- [ ] **E2 · « Imprimer un cours entier » ne marche pas en `file://`** — le seul mode supporté par le site. Générer une page imprimable par cours au moment de la construction des index.

- [ ] **E3 · La reprise est aveugle à la date.** Les dates sont pourtant enregistrées. Après trois semaines d'interruption, dire « tu as arrêté il y a trois semaines, voici où tu en étais » plutôt que de reprendre comme si de rien n'était.

- [ ] **E4 · Aucun diagnostic d'entrée.** 83 cours, 25 parcours, et rien pour dire par où commencer quand on sait déjà programmer. Une version honnête : quelques questions, puis une suggestion de parcours — **pas** un test de niveau prétentieux.

---

## PHASES F et G — déplacées vers les chantiers V13 et V14

Le catalogue et les gros morceaux pédagogiques ont été sortis de ce plan le 2026-08-21 : une case
« écrire 13 leçons de réseaux de neurones » ou « construire un moteur SQL » n'est pas un point de
chantier, c'est un chantier. Les traiter ici les aurait condamnés à être expédiés.

- Le **contenu neuf** (cours manquants, fils rouges incomplets) → **`CHANTIER-V13.md`**
- **L'exécution et la pratique** (moteurs locaux, exercices vérifiables, décodeur d'erreurs) → **`CHANTIER-V14.md`**

L'autonomie enchaîne les trois plans dans l'ordre, sans intervention.

---

## PHASE H — Contrôle final

- [ ] **H1 · Mesure globale.** Reprendre chaque chiffre du plan et donner sa valeur finale.
- [ ] **H2 · Non-régression.** `node tools/verif.js` complet, les cinq vérificateurs verts (les quatre plus `verif-exemples.js` de A1).
- [ ] **H3 · Les points laissés de côté.** Lister ce qui n'a pas été fait et pourquoi. Un point écarté avec sa raison est un résultat ; un point oublié n'en est pas un.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert. Le verdict n'est retenu que si le rapport a été **écrit pendant cette passe**.
