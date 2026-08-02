# Nouveaux cours modernes — plan & méthode (pour le cron)

Chantier : créer **4 cours complets** sur des sujets modernes non couverts, au même niveau que les 65 cours
existants. Un cours à la fois. Demande de Noah (2026-06-25).

## Les 4 cours (ordre de création)
| # | id | dir | Titre | Cours MODÈLE à copier | Accent (hex) | Leçons |
|---|----|-----|-------|------------------------|--------------|--------|
| 1 | `ml` | `ml` | Machine Learning : initiation avec Python | `python` (langage) | `#7c5cd6` | 7 |
| 2 | `kubernetes` | `kubernetes` | Kubernetes : orchestrer des conteneurs | `docker` | `#3367d6` | 7 |
| 3 | `graphql` | `graphql` | GraphQL : des API flexibles | `api` | `#d6398e` | 6 |
| 4 | `llm` | `llm` | Développer avec l'IA & les LLM | `api` / `nodejs` | `#1f9e8a` | 7 |

## Programmes (modules → leçons)
### 1. Machine Learning (`ml`) — 7 leçons
- M01 Comprendre le ML : L1 Qu'est-ce que le ML ? (supervisé / non supervisé) · L2 Le workflow (données → modèle → évaluation) · L3 Préparer les données (features, nettoyage, normalisation)
- M02 Modèles supervisés : L4 La régression (prédire un nombre) · L5 La classification (prédire une classe) · L6 Évaluer & éviter le surapprentissage (train/test, métriques)
- M03 Pratique : L7 **Capstone** — un projet ML de bout en bout (scikit-learn)

### 2. Kubernetes (`kubernetes`) — 7 leçons
- M01 Les bases : L1 Pourquoi Kubernetes ? (orchestration) · L2 Pods & conteneurs · L3 Déploiements & ReplicaSets
- M02 Réseau & configuration : L4 Services & exposition · L5 ConfigMaps & Secrets · L6 Volumes & stockage
- M03 En production : L7 **Capstone** — scaling, sondes de santé, déployer une app

### 3. GraphQL (`graphql`) — 6 leçons
- M01 Les bases : L1 REST vs GraphQL · L2 Le schéma & les types · L3 Les requêtes (queries)
- M02 Écrire & modifier : L4 Les mutations · L5 Les résolveurs (resolvers)
- M03 Pratique : L6 **Capstone** — une API GraphQL complète

### 4. Développer avec l'IA & les LLM (`llm`) — 7 leçons
- M01 Comprendre : L1 Comment marche un LLM (tokens, contexte, température) · L2 Bien rédiger un prompt (prompt engineering)
- M02 Construire : L3 Appeler une API de LLM · L4 Structurer les sorties (JSON, tool use) · L5 Le RAG (récupération augmentée)
- M03 Agents & pratique : L6 Les agents (boucle outils) · L7 **Capstone** — une petite app IA

## Méthode (UN cours par réveil, sinon UN module)
1. **Reprends au premier cours non créé** (vérifie si `pages/<dir>/cours.html` existe).
2. **Données — `js/data.js`** (3 insertions) :
   - `courses[]` : `{ id, dir, title, glyph, language, level, status:"complet", accent:"<hex>", lessons:<N>, hours:<~>, tagline, tags:[…] }`.
   - `content{}` : `<id>: { id, dir, title, glyph, accent, overview:"cours.html", related:[{course,note}…], modules:[{num,title,sub,lessons:[{num,title,file:"lecon-NN.html",status:"complet"}]}] }`.
   - `lessonDurations{}` (ou `durations`) : `<id>: { "lecon-01.html": <min>, … }`.
   - `related` : relier à 2-4 cours pertinents existants (ml→python/data, kubernetes→docker/cicd, graphql→api/nodejs, llm→api/python).
3. **Page de cours** : copie `pages/<MODELE>/cours.html` → `pages/<dir>/cours.html` ; adapte titre, description, hero,
   section « extensions VS Code », objectifs, « pour qui », `<h2>` du programme (N leçons), la section
   `#recap` (À retenir + `<dl class="glossary">`), la start-card. Mets `<body data-course="<id>">` et les bons liens.
4. **Leçons** : pour chaque leçon, copie une leçon du cours modèle et RÉDIGE le contenu (prose `.prose`, blocs
   `figure.code-block` avec `language-python`/`language-yaml`/`language-graphql`/`language-bash`, callouts,
   `<script type="application/json" data-quiz>` (QCM), `<script type="application/json" data-exos>` (exos `type:text`
   sauf JS), un `data-quiz-bilan` + un **capstone** « Mini-projet fil rouge » sur la DERNIÈRE leçon). Mets
   `data-course="<id>"` et `data-lesson="lecon-NN.html"` sur le `<body>`.
5. **Style accent** : ajoute dans `css/pages.css` `[data-accent="<id>"] { --card-accent: <hex>; }` ET la variante
   sombre `[data-theme="dark"] [data-accent="<id>"] { --card-accent: <hex clair>; }` (copie le bloc d'un cours voisin).
6. **Logo (optionnel)** : `js/logos.js` — ajoute un `badge("…")` dans `LOGOS` + l'entrée `ID_TO_LOGO`. Sinon le
   glyphe texte de repli s'affiche (acceptable).
7. **Catalogue** : si `js/catalogue.js` classe les cours par thème (objet `SECTIONS`), ajoute l'id au bon groupe.
8. **Vérifie TOUJOURS** : `node --check js/data.js` ; `ConvertFrom-Json` de chaque bloc `data-quiz`/`data-exos`/
   `data-quiz-bilan` ; 0 BOM ; 0 mojibake (`Ã©|Ã¨|Ã |Ã§|Â |Ã´|Ã®|Ã¹`) ; balises HTML équilibrées ; les `file` de
   `content` existent ; `node --check` des JS touchés.
9. **Mets à jour** ce fichier (cocher le cours) + la mémoire (`X/4 cours faits`). Messages MINIMAUX, PAS de
   questionnaire aux réveils. Si les 4 cours sont faits : vérification légère, **coupe le cron** (CronDelete),
   régénère si possible `js/search-index.js` (sinon le signaler), n'invente pas de travail.

## Contraintes
- 100 % file:// (Python/ML non exécutable dans le navigateur → exemples + `type:text` pour les exos).
- Français correct (accents). Style pédagogique des cours existants (clair, progressif, pièges, récap).
- Réutiliser les composants existants (callouts, code-block, glossary, exercise, start-card).

## ⚠️ Convention d'échappement dans les blocs de code (LA règle qui casse des pages)
C'est **la seule famille de bugs qui a réellement détruit des pages** de ce site : un `<` non
échappé à l'intérieur d'un exemple de code. Le navigateur ne « saute » pas le contenu d'un
`<pre>` — il y crée de vrais éléments. Un `<script>`, un `<template>`, un `<div>` ou même un
`<!` écrits dans un exemple avalent la suite de la page (parfois jusqu'aux `<script>` de fin,
qui ne s'exécutent alors plus du tout).

**La règle** : dans un bloc `<pre><code>…</code></pre>`, **tout `<` s'écrit `&lt;`** — sans
exception : dans un commentaire de code, dans une chaîne, dans un générique (`List&lt;T&gt;`),
dans une expression régulière (`/&lt;/g`), dans du JSX/HTML montré en exemple. Le `>` peut
rester tel quel, mais par symétrie on écrit souvent `&gt;` aussi. Pour **afficher** la suite
littérale `&lt;` dans l'exemple (montrer une entité), écrire `&amp;lt;`.

Le mojibake **volontaire** des 4 leçons qui enseignent l'encodage (`pages/formats/lecon-06.html`,
`pages/html/lecon-15.html`, `pages/r/lecon-06.html`, `pages/perl/lecon-13.html`) est une exception
assumée : **ne pas y toucher**.

## Outils de vérification (à lancer après TOUT changement de contenu)
- `node tools/verif-html.js` — parcours « type navigateur » des 1341 leçons : détecte en <1 s
  toute balise créée par erreur dans un bloc de code (la convention ci-dessus). **Doit rester à 0.**
- `node tools/verif-donnees.js` — vérifie les **16 invariants de données** (cohérence
  `courses`⇄`content`⇄`durations`, fichier cité ⇄ fichier disque, numérotation, unicité, piège
  `javascript`/`js`, `related`/`tracks`/fils rouges/projets, QCM bilan par cours, alignement
  `data-exos`↔`.exercise` — piège A8, grammaires **Prism** chargées, JSON des blocs `data-*`).
  **Doit rester à 0 erreur.** Un lancement révèle aussi les avertissements (défauts mineurs non bloquants).
- `node tools/build-index.js --write --only=quiz,flashcards,search,antiseches` — régénère les 4
  index dérivés si le **contenu** d'une leçon a changé (sans `--write`, comparaison seule).

## Suivi
- [x] 1. Machine Learning (`ml`) — ✅ **TERMINÉ** : 7 leçons rédigées et vérifiées (node OK, JSON data-quiz/
  data-exos/data-quiz-bilan valides, 0 BOM/mojibake, balises OK, 0 statut `bientot`). Capstone « Mini-projet fil
  rouge » + QCM bilan sur la L07. Cours présent au catalogue (« Back-end, données & API »), accent `[data-accent="ml"]`.
- [x] 2. Kubernetes (`kubernetes`) — ✅ **TERMINÉ** : 7 leçons rédigées et vérifiées (node OK, JSON data-quiz/
  data-exos/data-quiz-bilan valides, 0 BOM/mojibake, balises OK, 0 statut `bientot`). L01 Pourquoi K8s, L02 Pods,
  L03 Déploiements, L04 Services, L05 ConfigMaps & Secrets, L06 Volumes, L07 capstone (sondes liveness/readiness,
  requests/limits, HPA + Mini-projet fil rouge + QCM bilan). Au catalogue « Outils, pratiques & transversaux »,
  accent `[data-accent="kubernetes"]` clair+sombre. Prism bash+yaml.
- [x] 3. GraphQL (`graphql`) — ✅ **TERMINÉ** : 6 leçons rédigées et vérifiées (node OK, JSON data-quiz/data-exos/
  data-quiz-bilan valides, 0 BOM/mojibake, balises OK, 0 statut `bientot`). L01 REST vs GraphQL, L02 Schéma & types,
  L03 Queries, L04 Mutations, L05 Resolvers, L06 capstone (API GraphQL complète + Mini-projet fil rouge + QCM bilan).
  Au catalogue « Back-end, données & API », accent `[data-accent="graphql"]` clair+sombre. Prism graphql+json+bash+js.
- [x] 4. Développer avec l'IA & les LLM (`llm`) — ✅ **TERMINÉ** : 7 leçons rédigées et vérifiées (node OK, JSON
  data-quiz/data-exos/data-quiz-bilan valides, 0 BOM/mojibake, balises OK, 0 statut `bientot`). L01 Comment marche un
  LLM, L02 Prompt, L03 Appeler une API, L04 Sorties structurées (JSON, tool use), L05 RAG, L06 Agents, L07 capstone
  (petite app IA + Mini-projet fil rouge + QCM bilan). Au catalogue « Back-end, données & API », accent
  `[data-accent="llm"]` clair+sombre. Prism = json+bash+python.

## ✅ CHANTIER TERMINÉ — 4/4 cours (2026-06-25)
- ML (7) · Kubernetes (7) · GraphQL (6) · LLM (7) = **27 nouvelles leçons**. Site **65 → 69 cours**.
- Vérif globale OK : `node --check data.js`, 4 cours dans courses[]+content{}, 27 leçons, 0 BOM/mojibake, 0 statut `bientot`.
- `js/search-index.js` **régénéré** (832 → 859 entrées, +27) via script Node (idempotent, préserve l'existant) ;
  node --check OK, 0 BOM. Si le contenu d'une leçon change ensuite, re-régénérer.
- Cron `2e4dd12e` **supprimé** (CronDelete). Plus aucun travail en attente sur ce chantier.
