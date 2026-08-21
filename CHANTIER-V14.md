# Chantier V14 — faire écrire du code, et le corriger

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**À traiter APRÈS `CHANTIER-V13.md`**, qui doit être entièrement coché.

---

## Le constat qui fonde ce chantier

Le site enseigne remarquablement. Il fait **peu pratiquer**, et le chiffre est net :

| | |
|---|---:|
| Exercices `type:code`, corrigés **en exécutant** ce que l'apprenant écrit | **105** |
| Exercices `type:text`, corrigés en comparant à un mot-clé attendu | **4 136** |
| Part réellement auto-corrigée | **2,5 %** |

Et ces 105 exercices sont concentrés sur **trois cours** : `js` (45), `algo` (38), `projets-js` (21).
Les 80 autres cours n'en ont aucun.

La cause est technique, pas éditoriale. `js/runner.js` le dit lui-même :

> JS et HTML fonctionnent en `file://`. **Pyodide (Python) et sql.js (SQL) se chargent depuis un CDN
> et exigent le protocole HTTP** : en `file://` — le mode fondateur du site — l'exécution échoue
> toujours. On le SIGNALE donc AVANT le clic (bouton « Serveur requis » désactivé).

C'est honnête, et c'est bien fait. Mais cela veut dire que **sur un site qui enseigne 75 langages,
un seul est réellement exécutable**. Ce chantier s'attaque à cette limite, puis en tire les
conséquences pédagogiques.

---

## Règles permanentes

- **Un point à la fois**, mené jusqu'à la mesure.
- **Mesurer avant de promettre** : chaque moteur embarqué doit être **prouvé fonctionnel en `file://`**, hors réseau, avant qu'on écrive un seul exercice qui en dépend. Chrome avec `--host-resolver-rules="MAP * ~NOTFOUND"` est la preuve.
- **Un commit par point**, avec la mesure dans le message.
- `node tools/verif.js --rapide` vert ; `verif-exemples.js` et `verif-rendu.js` selon ce qui est touché.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build, **aucune dépendance installée**. Un moteur embarqué est un fichier du dépôt, pas un paquet.
- **⚠️ LE POIDS EST UN CRITÈRE, PAS UN DÉTAIL.** Le dépôt fait aujourd'hui ~35 Mo. Un moteur de 10 Mo le change de nature. Mesurer, dire le chiffre, et décider en connaissance de cause.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`. Un moteur embarqué se charge depuis `assets/vendor/`, jamais depuis le réseau.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — Rendre l'exécution locale

L'ordre compte : SQL d'abord parce qu'il est petit et que le besoin est massif (354 blocs et
21 cours concernés), Python ensuite parce qu'il est lourd et que la décision mérite d'être posée.

- [ ] **A1 · Mesurer avant de choisir.** Combien de blocs de code par langage, et combien d'exercices pourraient devenir exécutables pour chacun ? Produire le tableau. C'est lui qui décide de l'ordre du reste, pas l'intuition. Chiffrer aussi le poids actuel du dépôt et ce que chaque moteur y ajouterait.

- [ ] **A2 · SQL en local.** Embarquer sql.js (SQLite compilé en WebAssembly) dans `assets/vendor/`. **Vérifier d'abord** : poids réel du `.wasm`, et surtout **chargement en `file://`** — un `fetch()` vers un fichier local échoue dans Chrome, il faudra sans doute encoder le binaire en base64 dans un `.js`. **Si ça ne marche pas, le dire et passer à A4** : mieux vaut un constat net qu'une demi-solution.

- [ ] **A3 · Le bouton « Tester » pour SQL.** Une fois A2 prouvé : étendre `runner.js` aux blocs `language-sql`, avec une base d'exemple créée à la volée. L'apprenant écrit une requête, la lance, voit le résultat. **21 cours** en bénéficient (`sql`, `bdd`, `nosql`, `data-eng`, `pandas`…).

- [ ] **A4 · Python : décider, pas bricoler.** Pyodide pèse environ 10 Mo — c'est un tiers du dépôt actuel. Trois options à évaluer honnêtement, chiffres à l'appui : (a) l'embarquer malgré le poids ; (b) écrire un mini-interpréteur Python couvrant le sous-ensemble réellement utilisé dans les exercices (variables, conditions, boucles, listes, chaînes, fonctions simples) ; (c) renoncer et l'assumer explicitement dans l'interface. **Écrire la recommandation et son raisonnement ici, puis appliquer.** Ne pas se lancer dans (b) sans avoir mesuré ce que couvrent réellement les exercices Python.

- [ ] **A5 · Ce qui restera non exécutable.** Après A2-A4, dresser la liste des langages qui ne le seront jamais en `file://` (compilés, mobiles, systèmes). Pour ceux-là, l'exercice honnête n'est pas l'exécution mais la **prédiction** : « que produit ce code ? ». Le dire dans l'interface plutôt que de laisser un bouton mort.

---

## PHASE B — Convertir les exercices, cours par cours

Une case = un cours. **Ne convertir que ce qui gagne à l'être** : un exercice qui demande de
comprendre une notion reste très bien en `type:text`. La conversion vise ceux qui demandent
d'**écrire** quelque chose.

**Méthode, à suivre pour chaque cours** : relever le nombre d'exercices et leur type, repérer ceux
qui font écrire du code, les convertir en `type:code` avec un `run.expect` vérifiable, **exécuter la
solution de référence pour prouver qu'elle passe**, et mesurer avant/après.

- [ ] **B1 · Les cours SQL et données** (`sql`, `bdd`, `nosql`, `data-eng`) — dépend de A2/A3.
- [ ] **B2 · Les cours Python** (`python`, `python-avance`, `pandas`, `stats`, `dataviz`, `ml`) — dépend de A4.
- [ ] **B3 · Les cours JavaScript restants** (`typescript`, `nodejs`, `react`, `vue`, `projets-js`) — exécutable dès aujourd'hui, aucun préalable.
- [ ] **B4 · Les cours web** (`html`, `css`, `sass`, `a11y`, `perf-web`) — l'aperçu HTML existe déjà dans `runner.js` et n'est presque pas utilisé : c'est un gisement immédiat.
- [ ] **B5 · `regex`** — cas particulier : entièrement vérifiable en JavaScript, et c'est le cours où « écrire et tester » a le plus de valeur.
- [ ] **B6 · `algo` et `patterns`** — déjà bien dotés, compléter.
- [ ] **B7 · Les cours de prédiction** (langages non exécutables) — appliquer le format « que produit ce code ? » décidé en A5, sur les cours les plus consultés d'abord.

---

## PHASE C — Le décodeur de messages d'erreur

C'est ce qu'un débutant cherche en premier, et le site n'en dit rien. Un fichier de données, une page
de recherche, et des renvois depuis les leçons.

- [ ] **C1 · Le format et les 30 premières erreurs.** `js/erreurs-data.js` : message, langage, cause réelle, remède, leçon qui l'explique. Commencer par JavaScript et Python, les deux langages où le site a le plus de contenu. **Chaque message doit être copié d'une exécution réelle**, pas reconstitué de mémoire — un message approximatif ne sera jamais retrouvé par recherche.
- [ ] **C2 · La page de recherche.** On colle un message d'erreur, on obtient la cause et le remède. Recherche tolérante : les messages contiennent des noms de variables qui changent d'un cas à l'autre.
- [ ] **C3 · Étendre aux autres langages** — un lot par famille, en s'appuyant sur les cours existants.
- [ ] **C4 · Relier aux leçons.** Une leçon qui enseigne une notion dont l'erreur est fréquente renvoie au décodeur, et inversement.

---

## PHASE D — Un bac à sable Git

Le cours `git` fait 24 leçons sans **aucune** pratique interactive, alors que c'est la référence la
plus utilisée du domaine et que tout est simulable en JavaScript : un dépôt Git est un graphe de
commits, et les commandes courantes sont des opérations sur ce graphe.

- [ ] **D1 · Le modèle.** Un graphe de commits en mémoire, les branches, l'index, le répertoire de travail. Purement JavaScript, donc exécutable en `file://`.
- [ ] **D2 · Les commandes.** `add`, `commit`, `branch`, `checkout`, `merge`, `rebase`, `reset`, `revert`, `cherry-pick`. Chacune modifie le graphe.
- [ ] **D3 · La visualisation.** Le graphe dessiné en SVG, qui se met à jour à chaque commande. C'est ce qui rend Git compréhensible : on **voit** ce que `rebase` fait.
- [ ] **D4 · Les scénarios guidés.** Des situations réelles à résoudre : « tu as commité sur la mauvaise branche », « il faut annuler un commit déjà poussé », « résoudre un conflit ». Relier aux leçons du cours `git`.

---

## PHASE E — « Plusieurs façons de le faire »

Le site donne une solution par exercice. Les bons cours montrent les **alternatives** et disent
pourquoi on choisit l'une plutôt que l'autre — c'est ce qui distingue un apprenant qui applique d'un
apprenant qui décide.

- [ ] **E1 · Choisir les leçons.** Repérer les leçons où plusieurs approches se défendent réellement (boucle contre méthode fonctionnelle, récursif contre itératif, jointure contre sous-requête…). **Borner : quelques dizaines, pas 1 463.** Écrire la liste ici avant de commencer.
- [ ] **E2 · Le format.** Un bloc « une autre façon de le faire » : la variante, ce qu'elle coûte, ce qu'elle apporte, quand la préférer. Style du site, pas de catalogue exhaustif.
- [ ] **E3 · Écrire, par lots de cours.** Un lot par case.

---

## PHASE F — Contrôle final

- [ ] **F1 · Mesure globale.** Part d'exercices auto-corrigés : **2,5 % au départ**, combien à l'arrivée ? Nombre de cours ayant au moins un exercice exécutable : **3 au départ**.
- [ ] **F2 · Preuve hors réseau.** Tous les moteurs embarqués fonctionnent avec le réseau coupé, mesuré dans Chrome. Aucune requête distante.
- [ ] **F3 · Poids.** Taille du dépôt avant et après, et jugement : le compromis valait-il le coup ?
- [ ] **F4 · Non-régression.** Les cinq vérificateurs verts.
- [ ] **F5 · Ce qui n'a pas été fait.** Lister et expliquer.

---

## Fin de chantier

Quand toutes les cases sont cochées, le wrapper déclenche la **passe de sécurité** : vérification
globale, rapport dans `VERIF-FINALE.md` avec un verdict en première ligne, puis extinction automatique
si le verdict est vert.
