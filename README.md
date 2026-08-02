# Syntaxe — site de cours de programmation

**Syntaxe** est un site de cours de développement informatique, écrit en **HTML, CSS et
JavaScript « vanilla »**, multi-pages, **sans framework et sans étape de build**. Il se lance
en ouvrant simplement `index.html` (double-clic), sans serveur.

Le site contient **65 cours 100 % complets** — soit **832 leçons** rédigées en profondeur — couvrant
**59 langages et technologies**. **Tout le catalogue est rédigé** : il n'y a plus aucun cours « à venir ».

**Socle web & fondamentaux (23 cours, le module final « en profondeur / production »)** :
JavaScript (+ avancé, Algorithmes, Projets), Python (+ avancé), HTML (+ avancé), CSS (+ avancé),
Git & GitHub, SQL, React, Node.js, TypeScript, Bash, Java, C, C++, C#, Go, Rust et PHP.

**Extension « tous les langages » (28 cours)** : Ruby, Kotlin, Swift, R, Dart, Lua, Assembleur,
Haskell, Elixir, Scala, PowerShell, Perl, COBOL, Fortran, Julia, Zig, Lisp & Scheme, OCaml, F#,
Clojure, Prolog, Ada, Pascal & Delphi, Visual Basic, Objective-C, Erlang, Groovy et Solidity.

**Transversaux & outils (14 cours)** : Regex, Docker, API REST, Sécurité, Tests & qualité,
Design patterns, Formats de données, CI/CD, NoSQL, Markdown, VS Code, Sass/SCSS, HTTP et Vue.js.

---

## Comment ouvrir le site

1. **Double-cliquez sur `index.html`** (à la racine du projet). Le site s'ouvre dans votre
   navigateur par défaut.
2. Aucune installation, aucun serveur, aucune compilation.

> Le site fonctionne hors ligne. Deux ressources sont chargées depuis un CDN quand Internet
> est disponible : les **polices** Google Fonts et la **coloration syntaxique** Prism.js. En
> cas d'absence de réseau, le site se rabat proprement sur les polices système et le code
> reste lisible (simplement non colorisé).

Astuce : on peut prévisualiser un thème via l'URL, par ex. `index.html?theme=dark`.

---

## Architecture du projet

Séparation stricte **contenu / style / comportement** : tout le CSS est dans `css/`, tout le
JavaScript dans `js/`, aucun style inline ni script inline dans le HTML.

```
test-claude/
├── index.html                  Accueil (hero, présentation, mise en avant du cours complet)
├── README.md                   Ce fichier
├── DESIGN_SYSTEM.md            Direction artistique + tokens
├── PROGRESSION.md              Suivi de production du cours complet (statut par leçon)
│
├── css/                        TOUT le style
│   ├── variables.css           Tokens : couleurs, typo, espacements, rayons, ombres (+ thème sombre)
│   ├── base.css                Reset, éléments de base, typographie, utilitaires
│   ├── layout.css              Structure : en-tête, pied, conteneurs, grilles de page
│   ├── components.css          Composants : boutons, cartes, badges, encadrés, code, TOC, nav…
│   └── pages.css               Spécifique : accueil, prose d'article, page de cours, catalogue
│
├── js/                         TOUT le comportement (aucun JS inline)
│   ├── theme.js                Thème clair/sombre sans clignotement (chargé en tête)
│   ├── data.js                 Données du site (catalogue + structure des cours + durées) — aucun fetch
│   ├── main.js                 Commun : thème, menu, année, barres de code + « copier », bascule FR/EN (i18n)
│   ├── logos.js                Logos/glyphes des langages
│   ├── catalogue.js            Catalogue : rendu, recherche (avec contenu des leçons), filtres, tri, groupement
│   ├── cours.js                Page de cours : stats, progression, accordéon, badge de fin, lien PDF
│   ├── lecon.js                Page de leçon : nav, sommaire + scrollspy, progression, QCM, exercices, impression
│   ├── runner.js               Éditeur intégré : exécution JS (Worker), aperçu HTML, Python (Pyodide) & SQL (sql.js)
│   ├── parcours.js             Page Parcours (itinéraires de cours)
│   ├── progression.js          Tableau de bord + export/import de progression
│   ├── home.js                 Accueil : bloc « Reprendre où j'en étais »
│   ├── recherche.js            Recherche plein-texte (lit search-index.js)
│   ├── search-index.js         Index plein-texte pré-généré des 832 leçons (window.SEARCH_INDEX)
│   ├── playground.js           Bac à sable web (HTML/CSS/JS, aperçu en direct)
│   ├── imprimer.js             Assemble un cours complet en un document imprimable (PDF)
│   └── sync.js                 Couche d'abstraction de synchronisation (non chargée par défaut ; prête pour un futur backend)
│
├── assets/
│   ├── img/                    logo.svg, favicon.svg
│   ├── icons/                  (icônes intégrées en SVG inline — voir le README du dossier)
│   └── fonts/                  (polices via CDN — voir le README du dossier)
│
└── pages/                      Toutes les pages hors accueil
    ├── catalogue.html          Grille de 65 cours, recherche, filtres, tri, groupement par thème
    ├── recherche.html          Recherche plein-texte dans le contenu des leçons
    ├── playground.html         Bac à sable web (HTML/CSS/JS) · console.html : Python & SQL
    ├── imprimer.html           Version imprimable / PDF d'un cours · a-propos.html : à propos
    │
    │   UN SOUS-DOSSIER PAR COURS (cours.html = présentation, lecon-NN.html = leçons)
    ├── js/         cours.html + lecon-01.html … lecon-37.html   ← cours COMPLET (12 modules, 37 leçons)
    ├── js-avance/  cours.html + lecon-01.html … lecon-18.html   ← cours COMPLET (expert, 18 leçons)
    ├── algo/       cours.html + lecon-01.html … lecon-23.html   ← cours COMPLET (algorithmes, 23 leçons)
    ├── projets-js/ cours.html + lecon-01.html … lecon-19.html   ← cours COMPLET (11 projets, 19 leçons)
    ├── python/        cours.html + lecon-01.html … lecon-20.html   ← cours COMPLET (20 leçons)
    ├── python-avance/ cours.html + lecon-01.html … lecon-17.html   ← cours COMPLET (avancé, 17 leçons)
    ├── html/        cours.html + lecon-01.html … lecon-20.html   ← cours COMPLET (20 leçons)
    ├── html-avance/ cours.html + lecon-01.html … lecon-17.html   ← cours COMPLET (avancé, 17 leçons)
    ├── css/        cours.html + lecon-01.html … lecon-20.html   ← cours COMPLET (20 leçons)
    ├── css-avance/ cours.html + lecon-01.html … lecon-17.html   ← cours COMPLET (avancé, 17 leçons)
    ├── git/        cours.html + lecon-01.html … lecon-19.html   ← cours COMPLET (19 leçons)
    ├── sql/        cours.html + lecon-01.html … lecon-19.html   ← cours COMPLET (19 leçons)
    ├── react/      cours.html + lecon-01.html … lecon-20.html   ← cours COMPLET (20 leçons)
    ├── nodejs/     cours.html + lecon-01.html … lecon-20.html   ← cours COMPLET (20 leçons)
    ├── typescript/ cours.html + lecon-01.html … lecon-13.html   ← cours COMPLET (13 leçons)
    ├── bash/       cours.html + lecon-01.html … lecon-11.html   ← cours COMPLET (11 leçons)
    ├── java/       cours.html + lecon-01.html … lecon-17.html   ← cours COMPLET (17 leçons)
    ├── c/          cours.html + lecon-01.html … lecon-15.html   ← cours COMPLET (15 leçons)
    ├── cpp/        cours.html + lecon-01.html … lecon-17.html   ← cours COMPLET (17 leçons)
    ├── csharp/     cours.html + lecon-01.html … lecon-16.html   ← cours COMPLET (16 leçons)
    ├── go/         cours.html + lecon-01.html … lecon-13.html   ← cours COMPLET (13 leçons)
    ├── rust/       cours.html + lecon-01.html … lecon-16.html   ← cours COMPLET (16 leçons)
    ├── php/        cours.html + lecon-01.html … lecon-14.html   ← cours COMPLET (14 leçons)
    │
    │   + 28 dossiers de cours supplémentaires (extension « tous les langages ») :
    └── ruby/ kotlin/ swift/ r/ dart/ lua/ asm/ haskell/ elixir/ scala/ powershell/ perl/
        cobol/ fortran/ julia/ zig/ lisp/ ocaml/ fsharp/ clojure/ prolog/ ada/ pascal/ vb/
        objc/ erlang/ groovy/ solidity/   ← tous COMPLETS (9 à 15 leçons chacun ; voir le catalogue)
```

**Pourquoi des sous-dossiers ?** Pour que `pages/` reste lisible quand le catalogue grandit :
chaque nouveau cours obtient son propre dossier. Convention détaillée plus bas.

> Le dossier `tools/` contient uniquement des **outils de développement** (un script de
> capture d'écran headless et les scripts d'orchestration utilisés pour produire les leçons).
> Il ne fait **pas** partie du site et peut être supprimé sans rien casser.

---

## Ce qui est complet vs aperçu

| Cours | Statut | Contenu |
| --- | --- | --- |
| **JavaScript : des bases au niveau confirmé** | ✅ **Complet** | 12 modules, **37 leçons** : des variables au DOM, closures, POO, asynchrone & API, modules, regex + compléments navigateur + **module pro** (composants réutilisables, API & gestion d'état, outils/qualité/déploiement) |
| **JavaScript avancé : niveau expert** | ✅ **Complet** | 6 modules, **18 leçons** : métaprogrammation, async expert, patterns, mémoire, regex avancées, Intl, binaire/Workers/Streams + **aux frontières de JS** (moteur V8 & perf, sécurité client, runtimes & WebAssembly) |
| **Algorithmes & structures de données (en JS)** | ✅ **Complet** | 7 modules, **23 leçons** : Big O, tris, structures, graphes avancés, glouton, prog. dynamique + **sujets avancés** (algos sur les chaînes/KMP, complexité & NP, algorithmes randomisés) |
| **Projets JavaScript : apprendre en construisant** | ✅ **Complet** | 11 projets, **19 leçons** : calculatrice, quiz, budget, mots de passe, morpion, Pomodoro, météo (API), serpent (canvas) + **projets bonus** (éditeur de dessin Canvas, visualiseur Web Audio, Kanban glisser-déposer) |
| **Python : des bases au niveau confirmé** | ✅ **Complet** | 7 modules, **20 leçons** : types, conditions, boucles, fonctions, structures, modules, fichiers/exceptions, POO, générateurs, regex, dates + **Python en pratique** (venv/pip, CLI/logging/pathlib, qualité/tests/packaging) |
| **Python avancé : maîtriser le langage en profondeur** | ✅ **Complet** | 6 modules, **17 leçons** : décorateurs, data model, générateurs/coroutines, typage, dataclasses, async/asyncio, GIL, tests, perf, métaprog, C/Cython + **Python à l'échelle** (patterns/architecture, concurrence & no-GIL, production) |
| **HTML : structurer le web** | ✅ **Complet** | 7 modules, **20 leçons** : texte, liens, images, tableaux, médias, formulaires, sémantique, accessibilité, SEO, canvas/SVG + **HTML appliqué** (formulaires avancés, médias accessibles & contenu intégré, emails HTML) |
| **HTML avancé : le web platform moderne** | ✅ **Complet** | 7 modules, **17 leçons** : dialog/popover, Web Components, ARIA, schema.org, PWA/perf, drag & drop, History, CSP/SRI + **la plateforme web** (Observers, API modernes/View Transitions, Service Workers/offline) |
| **CSS : mettre en forme le web** | ✅ **Complet** | 7 modules, **20 leçons** : sélecteurs, cascade, boîte, typographie, Flexbox, Grid, responsive, animations, variables, méthodologies, colonnes/impression + **CSS dans la vraie vie** (composants d'UI, layouts robustes, perf/débogage/qualité) |
| **CSS avancé : le CSS moderne en profondeur** | ✅ **Complet** | 6 modules, **17 leçons** : @layer, :has(), oklch, subgrid, container queries, 3D, scroll-driven, masques, nesting, ancre, View Transitions + **encore plus loin** (fonctions math & couleur relative, transitions d'état, CSS à l'échelle) |
| **Git & GitHub : versionner son code** | ✅ **Complet** | 6 modules, **19 leçons** : commits, branches, fusion, conflits, distant, PR, forks, rebase, stash/tags/bisect, internes, submodules/hooks + **collaboration & automatisation** (stratégies de branches, CI/CD GitHub Actions, gros dépôts/récupération) |
| **SQL : interroger les bases de données** | ✅ **Complet** | 7 modules, **19 leçons** : SELECT, jointures, sous-requêtes/CTE, CRUD, DDL, transactions, fenêtrage, procédures/triggers, CTE récursives, JSON, plein-texte + **SQL en production** (optimisation & plans d'exécution, modélisation/intégrité, SQL analytique) |
| **React : interfaces à composants** | ✅ **Complet** | 6 modules, **20 leçons** : JSX, props, état, événements, formulaires, useEffect, hooks, routage, performance, tests + **React en production** (état à l'échelle, données serveur & React 19, frameworks/Next.js/RSC) |
| **Node.js : JavaScript côté serveur** | ✅ **Complet** | 7 modules, **20 leçons** : modules, npm, asynchrone, streams, fs, serveur HTTP, API REST Express, middleware, tests, BDD, auth JWT, WebSockets + **Node.js à l'échelle** (architecture en couches, performance/montée en charge, observabilité/Docker/déploiement) |
| **TypeScript : du typage au quotidien** | ✅ **Complet** | 4 modules, **13 leçons** : pourquoi TS, types de base, interfaces, unions/narrowing, fonctions, génériques, types utilitaires, classes, modules, migration JS→TS + **en profondeur** (types conditionnels/mappés/template literals, patterns de typage, décorateurs & outillage) |
| **Bash & ligne de commande** | ✅ **Complet** | 3 modules, **11 leçons** : terminal, navigation, fichiers, filtres/pipes, variables/quoting, scripts, conditions/boucles, fonctions/cron + **aller plus loin** (sed/awk, processus & signaux, scripts de production & outils modernes) |
| **Java : programmation orientée objet** | ✅ **Complet** | 5 modules, **17 leçons** : JVM, types, POO, interfaces, enum/record, exceptions, génériques, collections, lambdas/streams, fichiers/dates + **en profondeur** (concurrence, sealed/pattern matching/records, JVM/mémoire/performance) |
| **C : programmation système** | ✅ **Complet** | 4 modules, **15 leçons** : compilation, types, fonctions, pointeurs, tableaux/chaînes, allocation dynamique, structures/unions, fichiers, préprocesseur, débogage mémoire + **en profondeur** (pointeurs de fonction, structures de données dynamiques, bits & programmation système) |
| **C++ : performance et objets** | ✅ **Complet** | 5 modules, **17 leçons** : du C au C++, RAII, héritage, surcharge d'opérateurs, copie/déplacement, templates, STL, pointeurs intelligents + **en profondeur** (concurrence, métaprogrammation/templates avancés, performance & C++ moderne) |
| **C# : applications .NET** | ✅ **Complet** | 5 modules, **16 leçons** : .NET, POO & propriétés, interfaces/structs, enum/record, exceptions, génériques/collections, LINQ, async/await + **en profondeur** (asynchrone avancé/concurrence, fonctionnalités avancées, performance/mémoire/écosystème) |
| **Go : simplicité et concurrence** | ✅ **Complet** | 4 modules, **13 leçons** : gofmt, types, collections, structures/méthodes, interfaces, erreurs, goroutines & channels, modules, tests, serveur HTTP + **en profondeur** (patterns de concurrence & context, génériques/réflexion/runtime, services robustes) |
| **Rust : sûreté mémoire sans GC** | ✅ **Complet** | 5 modules, **16 leçons** : Cargo, possession, emprunts, durées de vie, traits/génériques, erreurs, itérateurs/closures, modules, concurrence + **en profondeur** (pointeurs intelligents & mutabilité intérieure, traits avancés, async/unsafe/performance) |
| **PHP : le web côté serveur** | ✅ **Complet** | 4 modules, **14 leçons** : bases, types, formulaires, sessions/cookies, sécurité web, POO, namespaces/traits, PDO, Composer + **en profondeur** (API REST en JSON, POO avancée & fonctionnalités, performance/tests/déploiement) |

> **HTML et CSS sont deux cours distincts** (deux dossiers, deux curriculums, deux leçons),
> car ce sont deux langages complémentaires mais différents.

### Liens annexes entre cours (cross-références)

Chaque cours déclare dans `js/data.js` un champ `related` (cours complémentaires + une note).
`cours.js` affiche automatiquement une section **« Cours liés / À combiner avec ce cours »** en
bas de chaque page de présentation, et certaines leçons renvoient explicitement vers un autre
cours (ex. la 1ʳᵉ leçon de **CSS** renvoie au cours **HTML** pour expliquer *comment relier les
deux* via `<link rel="stylesheet">`). C'est une convention à maintenir pour tout nouveau cours.

### Ajouter un nouveau cours (convention)

1. Créer `pages/<dir>/` avec `cours.html` (gabarit d'un cours existant) et `lecon-01.html`…
2. Ajouter le cours dans `courses` **et** `content` de `js/data.js` (avec `dir`,
   `overview: "cours.html"`, fichiers `lecon-NN.html`, et `related`).
3. Ajouter son accent dans `css/pages.css` (`[data-accent="<id>"] { --card-accent: … }`).

**Cours complet (JavaScript)** — programme :
1. **Fondations** : prise en main · variables & types · opérateurs et expressions
2. **Logique** : conditions · boucles · fonctions
3. **Données** : tableaux · map/filter/reduce · objets
4. **Navigateur** : DOM · événements · asynchrone & persistance (1re app)
5. **Données du langage** : chaînes · nombres & Math · dates
6. **Fonctions avancées** : portée & closures · this/bind · ordre supérieur & récursion
7. **POO** : prototypes · classes · héritage & encapsulation
8. **Asynchrone & réseau** : boucle d'événements · promesses avancées · fetch & API REST
9. **Robustesse & outillage** : erreurs · modules ES · expressions régulières · Map/Set
10. **Aller plus loin** : itérateurs/générateurs · débogage & tests · projet final assemblé

Le **projet fil rouge** (un gestionnaire de tâches) est construit module après module et
finalisé à la leçon 12.

---

## Parcours, progression et quiz (dispositif d'apprentissage)

Au-delà du catalogue, le site propose :

- **`pages/parcours.html`** (`js/parcours.js`, données `tracks` dans `data.js`) — des
  **itinéraires** ordonnés de cours existants (Web front-end, Back-end, Fondamentaux, Données,
  Système, JVM, Fonctionnel, Premier projet), avec progression cumulée par parcours.
- **`pages/progression.html`** (`js/progression.js`) — un **tableau de bord** transversal :
  leçons terminées, cours en cours / terminés, et un bouton **« Reprendre »** (la dernière leçon
  visitée est mémorisée par `lecon.js` sous la clé `syntaxe-last`). Tout est en `localStorage`,
  rien n'est envoyé sur un serveur. La page propose aussi un **export / import** de la progression
  (fichier JSON) pour la transférer d'un navigateur à l'autre — synchro « manuelle », sans serveur.
- **Recherche plein-texte** (`pages/recherche.html`, `js/recherche.js` + index `js/search-index.js`)
  — cherche un mot dans le **contenu intégral des 832 leçons**, avec extraits et liens. Le catalogue,
  lui, cherche dans les titres/descriptions et **propose la leçon exacte** quand un mot y correspond.
- **Bacs à sable** : `pages/playground.html` (HTML/CSS/JS avec aperçu en direct) et
  `pages/console.html` (**Python via Pyodide** et **SQL via sql.js**, base de démo fournie).
- **Export d'un cours en PDF** (`pages/imprimer.html`) : assemble toutes les leçons d'un cours en un
  seul document imprimable (un lien « Version imprimable » est ajouté sur chaque page de cours).
- **Badges de fin de cours**, **glossaire + mini-projet « fil rouge »** en fin de cours, **exercices
  interactifs auto-corrigés** (blocs `data-exos`) et **bascule FR / EN** de l'interface (bouton dans
  l'en-tête ; le contenu des leçons reste en français).
- **Quiz interactif** dans les leçons — `lecon.js` détecte un bloc optionnel et affiche un **QCM
  auto-corrigé** (options mélangées, correction immédiate, explication, score) sous
  « Vérifie ta compréhension ». Un **QCM bilan** récapitule la fin du cours. Convention dans une leçon :

  ```html
  <script type="application/json" data-quiz>
  [
    {"q":"Question ?","a":["bonne réponse","mauvaise","mauvaise"],"correct":0,"explain":"Pourquoi."}
  ]
  </script>
  ```

  `correct` est l'index de la bonne réponse **dans le tableau `a`** (avant mélange). Si le bloc est
  absent, les questions ouvertes existantes restent affichées.

## Direction visuelle

Identité **« éditorial-technique »** volontairement distinctive (voir `DESIGN_SYSTEM.md`) :

- **Système de design par variables CSS** : palette restreinte (papier chaud + encre + accent
  cobalt + miel), échelle typographique, espacements sur une grille de 4 px, rayons et ombres.
- **Typographie** : Space Grotesk (titres), Inter (corps), JetBrains Mono (code et libellés).
- **Thème clair + sombre** avec bascule persistée (localStorage), sans clignotement au chargement.
- **Composants réutilisables** : cartes, boutons, badges, encadrés (note / piège / astuce /
  pour aller plus loin), blocs de code « éditeur » avec **bouton copier**, sommaire avec
  **scrollspy**, barres de progression, navigation précédent/suivant.
- **Page de leçon soignée** : navigation du cours, sommaire, fil d'Ariane, indicateur de
  progression, suivi des leçons terminées.

---

## Accessibilité & responsive

- HTML **sémantique** (landmarks `header`/`nav`/`main`/`aside`/`footer`), lien d'évitement,
  `aria-current`, `aria-expanded`, libellés de formulaires, `alt` sur les images.
- **Contraste** visé AA dans les deux thèmes ; focus clavier visible ; `prefers-reduced-motion`
  respecté.
- **Responsive** mobile / tablette / desktop (grilles fluides, menus repliables).

---

## Choix techniques

- **Aucun build** : fichiers statiques servis tels quels.
- **Aucun `fetch` de fichiers locaux** : toutes les données sont dans `js/data.js`, ce qui
  permet l'ouverture en `file://` (double-clic).
- **Icônes en SVG inline** (héritent de `currentColor`, suivent le thème, fiables en `file://`).
- **Coloration syntaxique** : Prism.js (CDN) dont les couleurs sont pilotées par nos propres
  tokens CSS pour rester cohérentes avec le thème.
- **Éditeur de code intégré** (`js/runner.js`), plusieurs langages, sur les blocs de code :
  - **JavaScript** → **« ▶ Tester »** : le bloc devient un **éditeur** (coloration en direct) avec
    **Exécuter / Réinitialiser** et un **panneau console**. Le code tourne dans un **Web Worker
    isolé** (coupe-circuit anti-boucle à 3 s). N'apparaît que sur la logique pure (pas le code DOM).
  - **HTML** → **« 👁 Aperçu »** : le bloc devient éditable et son **rendu s'affiche en direct** dans
    une `<iframe>` isolée (sandbox).
  - **Python** → **« ▶ Tester »** : exécution réelle via **Pyodide** (WebAssembly) dans un Worker.
  - **SQL** → **« Exécuter »** : requêtes via **sql.js** (SQLite WASM), avec une **base de démo
    préchargée** (clients / commandes / produits…) ; résultats affichés en tableau.
  - JavaScript et HTML fonctionnent **sans serveur, en `file://`**. ⚠️ **Python et SQL** chargent leur
    moteur WebAssembly depuis un CDN : ils nécessitent une **connexion** et que le site soit servi en
    **HTTP** (repli avec message clair en `file://`).

---

*Projet de démonstration — Syntaxe.*
