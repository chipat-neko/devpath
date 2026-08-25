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

- [x] **A1 · Mesurer avant de choisir.** ✅ **2026-08-26.** Outil neuf `tools/mesure-executable.js` (rejouable, sans dépendance : il applique la règle `BROWSER_ONLY` de `runner.js` et la règle « pas de champ `run` → pas d'exécution » de `lecon.js`). **1 612 fichiers de leçon lus, 12 723 blocs de code, 92 dossiers de cours.**

  **Le cadrage de ce chantier était périmé sur trois chiffres, et faux sur un quatrième.**

  | | annoncé en tête de plan | **mesuré le 2026-08-26** |
  |---|---:|---:|
  | Exercices corrigés en exécutant | 105 | **211** |
  | Part réellement auto-corrigée | 2,5 % | **4,77 %** (211 / 4 422) |
  | Cours ayant au moins un exercice exécuté | 3 | **9** (js 45, algo 38, offensive 26, compilation 24, distribue 22, crypto 22, projets-js 21, neurones 12, formats 1) |
  | Cours concernés par SQL | « 21 cours » | **4** (`sql` 255 blocs, `bdd` 73, `data-eng` 24, `securite` 1) |

  V13 avait déjà doublé la part auto-corrigée sans que personne ne le note. Le « 21 cours » de SQL était une intuition : les 353 blocs `language-sql` tiennent dans 4 cours, pas 21.

  **Blocs exécutables aujourd'hui : 2 458 / 12 723 = 19,3 %** (JavaScript 1 773, aperçu HTML 685). **403 blocs JavaScript sont privés de bouton par le garde-fou `BROWSER_ONLY`** — cohérent avec la borne haute de 98 faux positifs relevée en V13, l'écart étant les blocs légitimement non exécutables (Node, DOM).

  **Ce que chaque moteur rendrait exécutable** (un exercice est rattaché au langage dominant de son cours) :

  | moteur | cours | blocs | exercices encore corrigés par mot-clé |
  |---|---:|---:|---:|
  | **worker JS — déjà en place** | 13 | 2 498 | **629** |
  | **aperçu HTML — déjà en place** | 6 | 1 151 | **444** |
  | Python — à trancher en A4 | 6 | 1 042 | 346 |
  | sql.js — à embarquer | 2 | 381 | 116 |
  | aucun moteur possible → prédiction (A5) | 65 | 7 651 | 2 676 |

  **Le résultat qui décide de l'ordre du reste : 1 073 exercices sont convertibles sans embarquer un seul octet**, avec les deux moteurs déjà présents et prouvés en `file://`. C'est **neuf fois** ce que sql.js apporterait (116) et trois fois ce que Pyodide apporterait (346).

  **Poids** — le dépôt ne fait plus 35 Mo : **77,9 Mo** de contenu réel sur 2 288 fichiers suivis (V12 et V13 l'ont doublé). Dont **13,4 Mo (17 %) pour les seuls six index dérivés** (`search-index` 3,93 Mo, `quiz-index` 3,15, `flashcards-data` 3,11, `antiseches-data` 1,51, `pieges-data` 0,93, `search-lite` 0,75).

  | moteur | fichiers strictement nécessaires | tel quel | **en base64** (imposé par `file://`) | part du dépôt |
  |---|---|---:|---:|---:|
  | **sql.js 1.14.2** | `sql-wasm.js` 45 Ko + `sql-wasm.wasm` 643 Ko | 688 Ko | **~903 Ko** | **+1,2 %** |
  | **Pyodide 0.26.2** | `pyodide.asm.wasm` 9,62 Mo + `python_stdlib.zip` 2,23 + `pyodide.asm.js` 1,17 + lock 0,10 | 13,14 Mo | **~17,5 Mo** | **+22,5 %** |

  sql.js est indolore, Pyodide change le dépôt de nature — A4 tranchera avec ces chiffres.

  **Constat neuf, que rien ne surveillait : 89 leçons n'ont AUCUN exercice.** Les quatre dossiers de niveau avancé sont entièrement dépourvus de bloc `data-exos` : `js-avance` 23, `html-avance` 22, `css-avance` 22, `python-avance` 22. Ce sont les leçons les plus difficiles du site, et ce sont les seules où l'apprenant n'a rien à faire. Aucun invariant de `verif-donnees.js` ne le détecte.

  **Piège de mesure rencontré, et pourquoi l'outil existe** : une contre-mesure au `grep` donnait 209 exercices exécutés contre 211 pour l'outil. L'outil avait raison — deux entrées de `pages/compilation/lecon-13.html` sont écrites en JSON indenté (`"type": "code"` avec espaces), invisibles pour un motif collé. **Compter du JSON au `grep` sous-estime en silence.**

  **Recommandation d'ordre pour la suite** : A2 reste en tête parce que c'est une mesure de faisabilité peu coûteuse (sql.js se charge-t-il vraiment en `file://` ?), mais **en phase B, B3 et B4 passent avant B1 et B2** : ils portent 1 073 des 1 535 exercices convertibles, ne dépendent d'aucun préalable, et n'ajoutent aucun octet.

- [x] **A2 · SQL en local.** ✅ **2026-08-26. Ça marche, et c'est prouvé dans les conditions de l'apprenant.**

  **Verdict mesuré : SQLite 3.49.1 s'exécute en `file://`, sans serveur, DNS coupé, en 411 ms — 0 requête distante.**

  L'intuition du plan était la bonne : `fetch()` vers un `.wasm` local est refusé par Chrome (origine opaque), le binaire doit être porté **dans** un script. Emscripten honore une option `wasmBinary` : quand on lui donne le binaire déjà en mémoire, il n'émet plus une seule requête.

  Livré dans `assets/vendor/sqljs/` — **909,4 Ko, soit +1,14 %** sur un dépôt de 77,90 Mo :

  | fichier | rôle | poids |
  |---|---|---:|
  | `sql-wasm.js` | module Emscripten de sql.js 1.14.2 (MIT), tel quel | 45,4 Ko |
  | `sql-wasm-base64.js` | le `.wasm` (658 410 octets) encodé en base64, **+33,4 %** | 858,0 Ko |
  | `sql-charge.js` | adaptateur maison : décode, contrôle le nombre magique, initialise | 3,3 Ko |
  | `LICENSE` + `README.md` | provenance et piège documenté | 2,7 Ko |

  **Outil neuf `tools/preuve-hors-reseau.js`, et c'est lui qui fait la valeur du point.** Une démonstration qui « marche » ne prouve rien si elle triche sur les conditions. Il ouvre la page en `file://`, **sans `--allow-file-access-from-files`** — le drapeau qu'emploie `tools/verif-clic.js`, et qui aurait rendu la preuve fausse puisque aucun apprenant n'ouvre son navigateur avec —, **avec `--host-resolver-rules="MAP * ~NOTFOUND"`**, et il lit le **journal réseau de Chrome** pour compter les requêtes sortantes. Preuve rejouable : `node tools/preuve-hors-reseau.js tools/preuves/sqljs.html`.

  Mesuré par cette page : `CREATE TABLE` + `INSERT`, `SELECT … WHERE … ORDER BY` (3 lignes justes), `COUNT(*)` = 4, `AVG(note)` = 16.25, `sqlite_version()` = 3.49.1, et une erreur SQL qui remonte proprement (`no such table: table_absente` — c'est ce que verra l'apprenant qui se trompe). **4 requêtes au total, toutes en `file:`, 0 distante.**

  **⚠️ Le piège qui a coûté deux essais, et qui vaut d'être retenu : `locateFile` est appelé (avec « sql-wasm.wasm ») MÊME quand `wasmBinary` est fourni.** Emscripten calcule le chemin avant de constater qu'il n'en a pas besoin — puis n'émet aucune requête. Un premier jet y levait une exception « pour détecter une régression vers le réseau » : Emscripten l'avale, **la promesse ne se résout jamais, et pas un message n'apparaît** — ni `onerror`, ni `unhandledrejection`, ni `console.error`. Le garde-fou fabriquait la panne qu'il prétendait surveiller. C'est le diagnostic pas-à-pas, pas la lecture du code, qui l'a montré. La preuve « aucun octet ne part » se fait donc au journal réseau, pas par un piège dans le code.

  Contrôles : `sql-wasm.js` ne contient **aucune** URL de CDN (son unique `https://` est un lien de commentaire vers un ticket GitHub, inerte) et **n'est pas un module ES** (0 `export`/`import`), donc compatible avec la contrainte fondatrice. `node tools/build-sqljs.js` régénère le base64 et, sans argument, contrôle son intégrité (658 410 octets redécodés, `\0asm` présent). `verif-html` 0/0, `verif-donnees` 0 erreur.

- [x] **A3 · Le bouton « Tester » pour SQL.** ✅ **2026-08-26. L'apprenant écrit une requête, la lance, et voit un tableau de résultats — en `file://`, sans réseau.**

  Toute la mécanique SQL existait déjà dans `runner.js` (`activateSql`, `runSql`, rendu en tableau) : elle était simplement branchée sur un CDN et neutralisée par la garde `HTTP_OK`. Trois changements ont suffi — puis la vraie difficulté est apparue ailleurs.

  1. **Le Worker charge le moteur depuis le dépôt.** Mesuré : un Worker issu d'un `Blob` **peut** `importScripts()` une URL `file://` **absolue**, sans drapeau permissif. Absolue est le mot : un Worker-Blob n'a aucune base pour résoudre un chemin relatif, et les leçons vivent à des profondeurs différentes. La racine est déduite de `document.currentScript.src`.
  2. **La garde `HTTP_OK` est levée pour SQL** (Python la garde). Plus de bouton « Serveur requis » sur les blocs SQL.
  3. **Le message d'échec, devenu faux, a été réécrit** : il conseillait de lancer `python -m http.server`, alors que le moteur est désormais dans le dépôt.

  **⚠️ Piège d'encodage qui a coûté un essai : `self`, jamais `window`.** Le fichier base64 assignait à `window.SQL_WASM_BASE64` ; dans un Worker, `window` n'existe pas, la `ReferenceError` est rapportée par `importScripts` comme un banal *« failed to load »* qui n'oriente vers rien. Corrigé dans `tools/build-sqljs.js` et documenté en tête du fichier généré.

  **La vraie difficulté : la base de démonstration ne correspondait pas aux leçons.** Écrite dans `runner.js` sans jamais avoir pu être confrontée à quoi que ce soit — SQL ne s'exécutait nulle part — elle déclarait `produits(id, **libelle**, prix, categorie)` quand les leçons écrivent partout `SELECT **nom** FROM produits`. D'où l'**outil neuf `tools/verif-sql.js`**, qui exécute les blocs SQL du site avec le **même moteur et le même jeu de données que le navigateur** (il lit `SEED_SQL` et le filtre de dialecte directement dans `runner.js`, pour qu'un écart soit impossible).

  | étape | blocs aboutis |
  |---|---:|
  | départ | 133 / 345 — **38,6 %** |
  | après ajout de `produits.nom` (et `stock`) | 153 / 345 — 44,3 % |
  | après ajout de 8 tables réellement interrogées | 170 / 345 — 49,3 % |
  | après le filtre de dialecte | **172 / 288 — 59,7 %** (57 blocs écartés) |

  Les 8 tables ajoutées sont celles que les leçons citent le plus et qu'aucun bloc ne pouvait trouver, « no such table » étant la première cause d'échec (77 blocs) : le fil rouge « Rideau » du cours `bdd` (`spectacle`, `representation`, `client`, `place`, `commande`, `billet`) plus `employes`, `comptes` et `ventes`. **`libelle` a été CONSERVÉ à côté de `nom`** : 26 blocs l'emploient, et le supprimer aurait cassé ce qui marchait.

  **Le filtre de dialecte, et le motif trop large qu'il a fallu écarter.** Le moteur est SQLite ; beaucoup de blocs enseignent PostgreSQL, MySQL ou SQL Server. Leur poser un bouton ne rend qu'un « near "FOR": syntax error » — **pire que pas de bouton du tout**. Un motif (`$$`, `MATERIALIZED VIEW`, `FOR UPDATE`, `GROUPING SETS`, `MERGE INTO`, `ISOLATION LEVEL`, `SERIAL`, `AUTO_INCREMENT`, `::`…) écarte **57 blocs : 55 échouaient bel et bien, 2 seulement marchaient** — et ces 2 sont explicitement intitulés « Version PostgreSQL ». Deux candidats ont été **retirés après mesure** : `/@\w/`, censé viser les variables SQL Server, attrapait **toutes les adresses e-mail** des chaînes d'exemple (4 faux positifs à lui seul) ; et `NULLS FIRST/LAST` comme `RETURNING` sont en réalité gérés par SQLite. La règle « un motif trop large casse ce qui était juste » s'est vérifiée au premier jet.

  **Une piste explorée puis abandonnée, mesure à l'appui.** Rejouer les blocs SQL précédents de la page avant celui qu'on lance — pour qu'un `SELECT` retrouve la table créée plus haut — donnait **exactement le même résultat** (5 blocs aboutis sur 41 dans le navigateur) pour un mécanisme bien plus fragile. Une leçon n'est pas un carnet linéaire : elle enchaîne des schémas concurrents et des violations de contraintes démontrées exprès, que rejouer met en collision (« table client already exists »).

  **Preuve dans le navigateur** — `tools/preuves/sql-lecon.js` clique pour de vrai sur chaque bouton, en `file://`, DNS coupé, sans `--allow-file-access-from-files` : **21 blocs aboutis sur 27** contre **5 sur 41** avant ce point, **0 requête distante**. Le script a lui-même dû être corrigé deux fois — il jugeait « aucune ligne à afficher » comme un échec alors que c'est la réponse normale d'un `CREATE` ou d'un `INSERT`, et il ne dépliait pas les `<details>` où sont rangées les solutions d'exercices, ce qui faisait passer 6 blocs sains pour muets.

  **4 fautes de contenu révélées par l'exécution, dans `pages/sql/lecon-03.html`** — invisibles pour les quatre vérificateurs, puisque aucun n'exécutait : trois blocs interrogeaient `ville` **dans `produits`** (c'est un attribut de `clients`), un quatrième lisait `commandes.client` au lieu de `client_id`. Le tableau de résultats annoncé omettait Nantes. Corrigés, énoncé de l'exercice 3 réaligné, et le second exemple de `DISTINCT` illustre désormais bien mieux son propos — **4 lignes puis 6** : ajouter une colonne fait réapparaître les villes. La leçon passe de 9/14 à **14/14**.

  `verif-html` 0/0 sur 1 612 fichiers, `verif-donnees` 0 erreur sur 25 invariants, 0 URL de CDN dans `runner.js`, 0 BOM.

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

> **Ordre révisé par la mesure A1** : traiter **B3 et B4 en premier** (1 073 exercices, aucun préalable,
> aucun octet ajouté), puis B5, B6, B7, et enfin B1/B2 qui dépendent de A2/A3 et A4.

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
