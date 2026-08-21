# Chantier V13 — le contenu qui manque

Plan de travail de l'autonomie. **Source de vérité : ce fichier.** Chaque réveil lit ce plan,
prend la **première case non cochée**, la traite entièrement, la coche avec un compte rendu chiffré,
puis passe à la suivante. Le chantier est fini quand il ne reste aucune case `- [ ]`.

**À traiter APRÈS `CHANTIER-V12.md`**, qui doit être entièrement coché. Le V12 construit les outils
qui servent ici — en particulier `verif-exemples.js`, qui exécute les exemples de code.

**Origine** : l'inventaire du 2026-08-20 et l'audit du 2026-08-13. Le catalogue compte 83 cours et
75 langages, mais il reste des **trous de progression** : des parcours qui promettent une suite qui
n'existe pas, et des fondations enseignées par leurs conséquences plutôt que par elles-mêmes.

---

## ⚠️ CE QUE LE CHANTIER V10 A APPRIS, ET QUI VAUT ICI

Le V10 a écrit 7 cours — 101 leçons — en une seule journée. Un audit indépendant a ensuite trouvé
**73 erreurs** dans ces leçons : des calculs faux, des requêtes SQL impossibles, un exemple SwiftUI
qui compile sans rien faire. Le diagnostic était sans appel :

> **Le raisonnement était juste, l'exécution numérique ne l'était pas.** La doctrine était exacte,
> mais les exemples chiffrés n'avaient jamais été exécutés.

**Ce chantier écrit lentement.** Une case = **un module**, pas un cours. Chaque exemple chiffré est
exécuté avant d'être écrit. Un cours de 13 leçons prend cinq ou six cases, et c'est voulu.

**La barre :** un cours neuf naît **au standard** — `verif-contenu.js` doit afficher 0 leçon sous le
standard et 0 maigre pour ce cours, dès la première mesure. Pas de rattrapage après coup.

---

## Règles permanentes

- **Un module à la fois**, mené jusqu'à la mesure. Un module fini et vérifié vaut mieux que trois ébauches.
- **EXÉCUTER AVANT D'ÉCRIRE.** Tout exemple qui annonce une valeur (`# affiche : …`, `// true`) doit avoir été rejoué. Le compte rendu cite le chiffre obtenu.
- **Un commit par module**, avec la mesure dans le message.
- `node tools/verif.js --rapide` vert après chaque module ; `node tools/verif-exemples.js` (créé au V12) sur le cours en cours.
- `node tools/build-index.js --write --only=quiz,flashcards,search,searchlite,antiseches` après chaque cours terminé.
- **Contrainte fondatrice** : 100 % `file://`, aucun serveur, aucun module ES, aucun build.
- **⚠️ L'ÉCHAPPEMENT DANS LES BLOCS DE CODE** : tout `<` s'écrit `&lt;`, sans exception. C'est la seule famille de bugs qui a réellement détruit des pages de ce site.
- **⚠️ `end`, `order`, `group`, `case` sont des mots réservés SQL** : ne jamais les utiliser comme noms de colonnes. L'audit V10 a trouvé `end` posé comme canon d'un fil rouge, propagé dans 5 leçons.
- **⚠️ Un cours transverse** (plusieurs langages) ne doit jamais affirmer pour tous ce qui n'est vrai que pour un.
- **⚠️ JAMAIS de `&nbsp;` dans un bloc `<script type="application/json">`**.
- **INTERDIT** : réintroduire une URL vers `cdnjs.cloudflare.com`, `fonts.googleapis.com`, `fonts.gstatic.com`.
- Contenu **en français, accents corrects**. Ton du site : clair, progressif, honnête sur les pièges.
- **En cas de doute réel : ne force pas.** Laisse la case décochée et écris ce qui bloque.

---

## PHASE A — Réparer les promesses avant d'en faire de nouvelles

À faire **avant** d'écrire une ligne de contenu neuf : un parcours qui pointe vers le vide est pire
qu'un cours manquant.

- [x] **A1 · Un fil rouge promet un cours de compilation qui n'existe pas.** ✅ **RETROUVÉ, MESURÉ, DÉCIDÉ — le fil attendra le cours de la phase B, et l'endroit exact où l'insérer est fixé ci-dessous.** **CE QUE C'EST** : le fil rouge **`systeme` — « Construis ton propre langage de programmation »** (`js/fil-rouge-systeme-data.js`, 7 étapes : python → algo → c → cpp → rust → zig → asm). **CE QU'IL ANNONCE EXACTEMENT** : dès l'**étape 1**, il demande d'écrire « un **lexer** qui découpe le code source en *tokens* », « un **parser** qui construit un arbre de syntaxe (**AST**) » et « un **évaluateur récursif** de l'AST » ; l'**étape 4** demande « un **compilateur** qui transforme l'AST en **bytecode** » et « une **VM à pile** » avec « au moins cinq opcodes ». **CE QUI MANQUE, MESURÉ** : dans les **177 leçons** des 7 cours cités (python 50, algo 28, cpp 23, c 21, rust 22, zig 18, asm 15), **0 leçon n'enseigne l'analyse lexicale, et 0 n'enseigne l'analyse syntaxique**. Les 11 occurrences du mot « parser » sont `argparse` / `ArgumentParser` / « reparser un motif » ; les 2 « descente récursive » sont des mentions de passage dans des leçons sur la récursivité (`c/lecon-04` cite les analyseurs JSON en exemple). Aucun des **83 cours** ne porte sur la compilation. **CE QUI N'EST PAS EN CAUSE** : ce n'est **pas** un lien cassé — vérification des **18 fils rouges et de leurs 94 étapes**, **0 étape pointe vers un cours inexistant**. Le manque est un **prérequis pédagogique absent** : le fil demande de construire ce que le site n'explique nulle part. **DÉCISION** : **ne rien bricoler maintenant.** Corriger l'intro aujourd'hui obligerait à la réécrire dans quelques cases, et aucune formulation ne remplace le cours manquant. Le fil rouge **recevra le cours écrit en phase B en NOUVELLE ÉTAPE 1** — « Compilation : du texte source au code exécuté » —, les 7 étapes actuelles étant décalées en 2 à 8 ; l'étape « python » devient alors la **ré-implémentation** d'un travail déjà compris, ce qui est exactement la logique du fil. **Cette insertion est inscrite dans la case B5 ci-dessous**, pour qu'elle ne soit pas oubliée à l'intégration.

- [x] **A2 · Le parcours « ia » était cassé en deux endroits.** ✅ **RECOMPOSÉ, ET VÉRIFIÉ DANS UN VRAI NAVIGATEUR.** **CE QUI ÉTAIT CASSÉ, MESURÉ AVANT DE TOUCHER À QUOI QUE CE SOIT** : le fil rouge `ia` (`js/fil-rouge-ia-data.js`) comptait **3 étapes** — ml → llm → **graphql**. (1) **Une fin hors sujet** : « Exposer l'IA via une API GraphQL » n'exposait pas de l'IA, elle servait de débouché au cours `graphql`, et pesait **un tiers du fil**. (2) **Un départ abrupt** : le fil démarrait sur `ml`, alors que le **parcours** `ia` de `data.js` enchaîne python → pandas → stats → ml → llm ; fil et parcours ne se recoupaient que sur **2 cours sur 5**. **CE QUI A ÉTÉ FAIT** : le fil suit désormais le parcours et raconte **un seul projet** — prédire quels comptes d'un service vont se désabonner, puis rendre cette prédiction lisible — en **5 étapes** : **pandas** (Préparer) → **stats** (Comprendre) → **ml** (Modéliser) → **llm** (Générer : le LLM *met en mots*, il ne calcule jamais) → **dataviz** (Montrer), 25 critères cochables. Chaque étape ne demande que ce que son cours enseigne réellement, vérifié module par module : `ml` n'enseignant **aucune vectorisation de texte**, le projet est **tabulaire**, jamais textuel — c'est exactement l'erreur relevée en A1 sur le fil `systeme`, qui demande un lexer que personne n'enseigne. **GraphQL n'a pas été jeté** : le retirer en aurait fait un **15ᵉ cours orphelin de fil rouge**. Il est relogé en **étape 7 du fil `backend`** — « Ré-exposer la même API en GraphQL », après l'avoir écrite en quatre langages et posée sur une base. C'est le vrai sujet de `graphql/lecon-01` (« REST vs GraphQL »), avec une comparaison chiffrée en critère. Le drapeau 🏁 passe de l'étape 6 à l'étape 7. **Bilan orphelins : 14 avant, 14 après** — aucun cours perdu, trois cours de données (`pandas`, `stats`, `dataviz`) gagnés au passage pour A3.
  · **LE PIÈGE TROUVÉ EN ROUTE, ET TRAITÉ** : la progression d'un fil est stockée **par numéro d'étape** (`{"1":{"0":true}}`). Renuméroter aurait fait réapparaître les cases de `ml` sous `pandas`, en silence. `js/fil-rouge.js` reçoit donc une **conversion générique** (`FR.remap` + `FR.remapVersion`, marque `__remap`, appliquée **une seule fois**, **jamais sur un store vide**, et posée dès la première écriture pour qu'une progression créée après coup ne soit pas reconvertie), et `js/fils-rouges.js` **ignore les clés non numériques** dans son compteur. **Ce mécanisme resservira tel quel en B5**, où le fil `systeme` décalera ses 7 étapes en 2→8.
  · **MESURES AU NAVIGATEUR** (`scratchpad/sonde-fil-ia.js`, Chrome headless, progression semée dans localStorage) : ancien store `{1: 5 coches, 2: 1 coche, 3: 2 coches}` → après ouverture `{"3":{5 coches},"4":{1 coche},"__remap":"v1"}` — les 5 coches de `ml` suivent `ml` en étape 3, `llm` passe en 4, l'étape `graphql` disparaît. La page affiche **5 étapes**, « **1 / 5 étapes terminées** », étape 3 marquée ✔ 5/5, étape 4 à 1/5. Le hub affiche « **2 / 5 étapes abordées** » — et non 3, la marque `__remap` n'étant pas comptée — et « 5 étapes ». Le fil `backend` affiche **7 étapes**, l'étape 6 gardant ses 2/5. Encarts de start-card : `pandas` « étape **1 / 5** », `ml` « étape **3 / 5** », `graphql` « étape **7 / 7** » vers `fil-rouge-backend.html#7`. Store vierge → **aucune clé créée**, « Pas encore commencé », 0/5. **Scénario du plus grand risque** (`scratchpad/sonde-suite.js`) : localStorage vide → 2 cases cochées sur l'étape 3 → `{"3":{...},"__remap":"v1"}` → **rechargement** → progression intacte sur l'étape 3 (`0/5|0/5|2/5|0/5|0/5`), **aucune double conversion**. Seule réserve, assumée : tant que la page du fil n'a pas été rouverte une fois, le hub compte encore l'ancienne étape `graphql` (3 / 5 au lieu de 2 / 5) — l'écart disparaît à la première visite du fil.
  · **NON-RÉGRESSION** : `verif.js --rapide` **tout vert** (0 erreur d'invariant, 0 leçon sous le standard, 0 redondance, 0 divergence d'exemple) ; `verif-rendu.js` sur les 5 pages touchées = **30 mesures, 0 erreur, 0 avertissement**, réseau coupé ; `node --check` sur les 4 fichiers JS ; 0 BOM, 0 mojibake ; les 6 occurrences de `cdnjs`/`gstatic` du dépôt sont inchangées et toutes **pédagogiques** (code échappé, prose, README). **Trouvaille annexe** : `build-index.js --write` a révélé que `antiseches-data.js` était **périmé** sur un titre — il gardait « Projet — concevoir la base de Rideau… » alors que `data.js` **et** la page disent « Projet **:** concevoir… ». **L'invariant I18 (péremption des index) ne l'avait pas vu** : il compte les entrées, il ne compare pas leur contenu. Index régénéré ; le trou d'I18 est à traiter dans un chantier d'outillage. **Totaux du site** : 18 fils rouges, **94 → 97 étapes**.

- [ ] **A3 · 14 cours sur 83 ne figurent dans aucun fil rouge**, dont les 5 cours « données » créés au V10 (`pandas`, `dataviz`, `stats`, `data-eng`, `bdd`) et 4 des 6 cours « exploitation ». Les fils rouges sont la forme la plus aboutie du site : composer les fils manquants. Vérifier ensuite que `fils-rouges.html` les affiche et que la progression se calcule.

---

## PHASE B — Compilation : du texte source au code exécuté

**~13 leçons.** Le sujet est idéal pour ce site : il explique ce qui se passe *sous* tous les autres
cours, et il est entièrement démontrable en JavaScript — donc **exécutable en `file://`**, ce qui est
rare et précieux. Chaque étape peut être écrite et testée dans le navigateur.

- [ ] **B1 · Module 1 — Ce qu'est compiler** (3 leçons). Interprété contre compilé, les étapes d'une chaîne de compilation, pourquoi un langage a besoin d'une grammaire. Un schéma de la chaîne complète, réutilisé dans tout le cours.
- [ ] **B2 · Module 2 — Analyse lexicale** (3 leçons). Du texte aux jetons, expressions régulières et automates, gestion des espaces et des commentaires. **Écrire un analyseur lexical en JavaScript, exécutable dans la leçon.**
- [ ] **B3 · Module 3 — Analyse syntaxique** (3 leçons). Grammaires, descente récursive, priorité des opérateurs, arbre de syntaxe abstraite. Un analyseur pour les expressions arithmétiques, exécutable.
- [ ] **B4 · Module 4 — Évaluer et générer** (3 leçons). Parcourir l'arbre, évaluer, puis générer du code pour une machine à pile. La différence entre interpréter et compiler devient concrète.
- [ ] **B5 · Module 5 — Le projet** (1 leçon capstone). Un petit langage complet, du texte au résultat. Plus le QCM bilan, le projet contextualisé, l'entrée au catalogue, l'accent CSS, le logo, les `related`, la place dans un parcours. **⚠️ ET L'INSERTION DÉCIDÉE EN A1** : ajouter ce cours en **étape 1 du fil rouge `systeme`** (`js/fil-rouge-systeme-data.js`), décaler les 7 étapes existantes en 2 à 8, renuméroter leur champ `n`, et vérifier ensuite que `pages/fil-rouge-systeme.html` affiche 8 étapes et que la progression (`syntaxe-fil-rouge`) se calcule toujours sur 8.

---

## PHASE C — Réseaux de neurones et apprentissage profond

**~12 leçons.** Le chaînon manquant du parcours « ia » : `python` → `pandas` → `stats` → `ml` → **?**
Le cours `ml` s'arrête au seuil. Attention : c'est le sujet où les approximations pédagogiques
deviennent des erreurs — l'audit V10 l'a montré sur les statistiques.

- [ ] **C1 · Module 1 — Du neurone au réseau** (3 leçons). Le neurone formel, les fonctions d'activation et pourquoi elles doivent être non linéaires, l'architecture en couches. **Chaque calcul posé doit être refait à la main dans la leçon.**
- [ ] **C2 · Module 2 — Apprendre** (3 leçons). Fonction de perte, descente de gradient, rétropropagation. Le point délicat : expliquer la rétropropagation sans la réduire à une formule magique ni exiger le calcul matriciel.
- [ ] **C3 · Module 3 — Ce qui rate** (3 leçons). Surapprentissage, régularisation, taux d'apprentissage, disparition du gradient. **Le module le plus utile du cours** : ce sont les problèmes réels.
- [ ] **C4 · Module 4 — Les familles d'architectures** (2 leçons). Convolutifs pour l'image, récurrents et attention pour les séquences. Rester au niveau du principe et de l'usage, sans réécrire un cours de recherche.
- [ ] **C5 · Module 5 — Le projet** (1 leçon capstone) + intégration complète (catalogue, accent, logo, `related`, parcours « ia », projet contextualisé). **⚠️ ET L'INSERTION PRÉPARÉE EN A2** : ajouter ce cours en **étape 4 du fil rouge `ia`** (`js/fil-rouge-ia-data.js`), entre `ml` et `llm` — c'est lui qui explique ce qui rend un LLM possible. Décaler `llm` en 5 et `dataviz` en 6, renuméroter leur champ `n`, puis poser `remapVersion: 2` et `remap: { "4": 5, "5": 6 }` (mécanisme générique déjà en place dans `js/fil-rouge.js`, `migrerStore`). Mettre à jour ensuite `js/cours.js` (table `FILS_ROUGES`, entrée `fil-rouge-ia.html` : `total: 6` et la `map`), la carte du hub `pages/fils-rouges.html` (`data-fr-total`, « 6 étapes », la liste des phases, la description) et la `<meta name="description">` de `pages/fil-rouge-ia.html`. Vérifier enfin, **au navigateur** avec un store semé (`scratchpad/sonde-fil-ia.js` est réutilisable), que le fil affiche 6 étapes, que la progression d'un `llm` déjà entamé a bien suivi en étape 5, et que le parcours `ia` de `data.js` liste le nouveau cours.

---

## PHASE D — Systèmes distribués

**~12 leçons.** Le site enseigne partout les **conséquences** — `cloud`, `observabilite`, `data-eng`,
`bdd` parlent de réplication, de latence, de cohérence — mais jamais les **fondations**.

- [ ] **D1 · Module 1 — Pourquoi c'est difficile** (3 leçons). Les huit erreurs classiques sur les réseaux, latence contre bande passante, pannes partielles. Ce module doit convaincre que l'intuition d'un programme local est fausse ici.
- [ ] **D2 · Module 2 — S'accorder** (3 leçons). Horloges et ordre des événements, théorème CAP énoncé **correctement** (pas la version simplifiée fausse), cohérence forte contre éventuelle.
- [ ] **D3 · Module 3 — Répliquer et partitionner** (3 leçons). Copies, partitionnement, hachage cohérent, quorum.
- [ ] **D4 · Module 4 — En pratique** (2 leçons). Idempotence, reprise, files de messages, la livraison « au moins une fois ».
- [ ] **D5 · Module 5 — Le projet** (1 leçon capstone) + intégration complète.

---

## PHASE E — Sécurité offensive

**~12 leçons.** Le cours `securite` existe (9 leçons) et couvre la **défense**. Ce qui manque est le
point de vue de l'attaquant, qui est la seule façon de comprendre pourquoi les défenses existent.

**⚠️ CADRE STRICT, à respecter dans chaque leçon** : on enseigne à **comprendre et se défendre**,
jamais à attaquer un système qui ne vous appartient pas. Chaque leçon rappelle le cadre légal et
travaille sur des cibles fictives ou des environnements d'entraînement. Pas de charge utile prête à
l'emploi, pas de mode opératoire contre un service réel. Si un exemple ne peut pas être écrit dans ce
cadre, ne l'écris pas et note-le ici.

- [ ] **E1 · Module 1 — Penser comme un attaquant** (3 leçons). Surface d'attaque, reconnaissance, modélisation des menaces, cadre légal et éthique.
- [ ] **E2 · Module 2 — Les failles du web** (3 leçons). Injection, XSS, CSRF, contrôle d'accès défaillant — **du point de vue de l'exploitation**, pour comprendre ce que la défense doit bloquer. Le cours `securite` couvre déjà la défense : y renvoyer par `related` plutôt que répéter.
- [ ] **E3 · Module 3 — Authentification et secrets** (3 leçons). Mots de passe, sessions, jetons, secrets qui fuient dans un dépôt.
- [ ] **E4 · Module 4 — Chaîne d'approvisionnement et outillage** (2 leçons). Dépendances, intégrité, ce qu'un audit automatisé trouve et ne trouve pas.
- [ ] **E5 · Module 5 — Le projet** (1 leçon capstone : un audit méthodique d'une application fictive) + intégration complète.

---

## PHASE F — Cryptographie appliquée

**~11 leçons.** `securite` et `http` utilisent le chiffrement sans jamais l'expliquer. Sujet où les
demi-vérités sont dangereuses : le cours doit dire clairement **ce qu'on ne fait jamais soi-même**.

- [ ] **F1 · Module 1 — Les primitives** (3 leçons). Empreintes, chiffrement symétrique, chiffrement asymétrique — ce que chacun garantit et ce qu'il ne garantit pas.
- [ ] **F2 · Module 2 — Les assembler** (3 leçons). Signature, échange de clés, certificats, TLS de bout en bout.
- [ ] **F3 · Module 3 — En pratique** (3 leçons). Stocker un mot de passe, chiffrer des données au repos, gérer des clés. **Le fil directeur : ne jamais écrire sa propre cryptographie.**
- [ ] **F4 · Module 4 — Le projet** (2 leçons) + intégration complète.

---

## PHASE G — Contrôle final

- [ ] **G1 · Mesure globale.** Nombre de cours et de leçons avant et après. `verif-contenu.js` : **0 sous le standard, 0 maigre** sur les cours neufs. `verif-exemples.js` : **0 divergence** sur les cours neufs.
- [ ] **G2 · Intégration.** Chaque cours neuf a son accent CSS (clair et sombre), son logo, son projet contextualisé, ses `related` **dans les deux sens**, sa place dans un parcours et dans un fil rouge. Les compteurs affichés sont à jour.
- [ ] **G3 · Redondance.** `verif-contenu.js --redondance` doit rester à 0 : ces cours touchent des sujets voisins de l'existant (`securite`, `http`, `ml`, `cloud`), le risque de répétition est réel.
- [ ] **G4 · Ce qui n'a pas été fait.** Lister les modules ou cours laissés de côté et pourquoi.

---

## Fin de chantier

Quand toutes les cases sont cochées, l'autonomie passe à **`CHANTIER-V14.md`**.
