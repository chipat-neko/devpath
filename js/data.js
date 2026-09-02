/* =============================================================================
   data.js — Données du site (aucun fetch : tout est ici, exposé en global).
   Utilisé par catalogue.js (cartes + filtres), cours.js (page de cours) et
   lecon.js (nav, progression).

   ORGANISATION DES PAGES
   ----------------------
   Chaque cours a son propre dossier sous pages/ (champ `dir`) :
     pages/<dir>/cours.html        page de présentation
     pages/<dir>/lecon-01.html …   leçons
   Les chemins relatifs sont donc construits à partir de `dir` (catalogue) ou
   sont relatifs au dossier courant (cours.js / lecon.js, même dossier).

   LIENS ANNEXES (cross-références entre cours)
   --------------------------------------------
   Chaque cours peut déclarer `related` : d'autres cours complémentaires, avec
   une note expliquant le lien (ex. CSS → HTML « comment relier les deux »).
   Convention à respecter pour TOUT nouveau cours (voir README / mémoire projet).
   ============================================================================= */
window.SITE_DATA = (function () {
  "use strict";

  /* Niveaux normalisés (servent aussi de classes CSS : pill--debutant, …) */
  var LEVELS = {
    debutant: "Débutant",
    intermediaire: "Intermédiaire",
    avance: "Avancé",
    expert: "Expert",
  };

  /* ---- Cartes du catalogue --------------------------------------------------
     status : "complet" | "apercu" | "bientot"
     dir    : dossier du cours sous pages/ (lien = dir + "/cours.html")
     accent : couleur de marque (glyphe + filet de carte), harmonisée au système  */
  var courses = [
    {
      id: "javascript", dir: "js", title: "JavaScript : des fondations au niveau expert",
      glyph: "JS", language: "JavaScript", level: "debutant", status: "complet",
      accent: "#caa12f", lessons: 65, hours: 39,
      tagline:
        "Le cours complet : des variables au DOM, puis closures, POO, asynchrone & API, modules, regex, puis métaprogrammation, async expert, patterns, moteur V8, sécurité et WASM — 20 modules, un projet fil rouge, des compléments (stockage, formulaires, animation) et la pratique pro (composants, état, outils).",
      tags: ["Web", "Fondamentaux", "Front-end"],
    },
    {
      id: "python", dir: "python", title: "Python : des fondations au niveau expert",
      glyph: "Py", language: "Python", level: "debutant", status: "complet",
      accent: "#3b7dbf", lessons: 50, hours: 29,
      tagline:
        "Un langage clair et polyvalent, de zéro à l'expert : types, conditions, boucles, fonctions, listes/dicts, chaînes, modules, fichiers, exceptions, objets, générateurs, regex, dates, écosystème (venv/pip), outils et packaging, puis décorateurs, modèle de données, typage, async/asyncio, GIL, tests, performance, métaprogrammation, C/Cython, patterns et mise en production — 17 modules, un projet de synthèse.",
      tags: ["Polyvalent", "Scripts", "Back-end"],
    },
    {
      id: "html", dir: "html", title: "HTML : des fondations au niveau expert",
      glyph: "<>", language: "HTML", level: "debutant", status: "complet",
      accent: "#d9663d", lessons: 47, hours: 26,
      tagline:
        "Tout le HTML, du fondamental à l'expert : structure sémantique, texte, liens, médias, tableaux, formulaires, accessibilité et SEO, graphiques (canvas/SVG), puis éléments interactifs natifs, Web Components, ARIA, données structurées, PWA, performance, sécurité (CSP/SRI), Observers, API modernes et Service Workers.",
      tags: ["Web", "Front-end", "Structure"],
    },
    {
      id: "css", dir: "css", title: "CSS : des fondations au niveau expert",
      glyph: "{ }", language: "CSS", level: "debutant", status: "complet",
      accent: "#3a76c2", lessons: 47, hours: 26,
      tagline:
        "Tout le CSS, du fondamental à l'expert : sélecteurs, cascade, modèle de boîte, typographie, Flexbox, Grid, responsive, animations, variables, impression et qualité, puis @layer, :has(), oklch, subgrid, container queries, couleurs modernes (oklch), 3D, animations au scroll, masques, nesting, ancre et View Transitions.",
      tags: ["Web", "Front-end", "Design"],
    },
    {
      id: "git", dir: "git", title: "Git & GitHub : versionner son code",
      glyph: "Git", language: "Git", level: "debutant", status: "complet",
      accent: "#e0683b", lessons: 24, hours: 13,
      tagline:
        "Maîtriser le versionnement : commits, branches, fusion, conflits, distant, pull requests, forks, rebase, internes de Git, submodules, hooks, plus stratégies de branches, CI/CD (GitHub Actions) et gros dépôts.",
      tags: ["Outils", "Collaboration", "Workflow"],
    },
    {
      id: "sql", dir: "sql", title: "SQL : interroger les bases de données",
      glyph: "SQL", language: "SQL", level: "debutant", status: "complet",
      accent: "#2e9e8f", lessons: 24, hours: 14,
      tagline:
        "Maîtriser les données relationnelles : SELECT, jointures, sous-requêtes, CRUD, schéma, transactions, fenêtrage, procédures/triggers, CTE récursives, JSON, plus optimisation (plans d'exécution), modélisation avancée, SQL analytique, temps et séries, concurrence et migrations.",
      tags: ["Données", "Back-end", "Requêtes"],
    },
    {
      id: "react", dir: "react", title: "React : interfaces à composants",
      glyph: "Re", language: "React", level: "intermediaire", status: "complet",
      accent: "#3fa3c4", lessons: 26, hours: 15,
      tagline:
        "Penser l'UI en composants : JSX, props, état, événements, formulaires, useEffect, hooks, routage, performance, tests, plus gestion d'état à l'échelle, données serveur (React 19) et frameworks (Next.js, RSC).",
      tags: ["Web", "Front-end", "Bibliothèque"],
    },
    {
      id: "algo", dir: "algo", title: "Algorithmes & structures de données en JS",
      glyph: "O(n)", language: "JavaScript", level: "intermediaire", status: "complet",
      accent: "#6a4fb0", lessons: 28, hours: 17,
      tagline:
        "Les fondamentaux d'informatique en JS : Big O, récursion, tris, recherche, structures, graphes, glouton, prog. dynamique, backtracking, tries & bits, plus chaînes (KMP), complexité/NP et algorithmes randomisés.",
      tags: ["Informatique", "Algorithmes", "Entretiens"],
    },
    {
      id: "projets-js", dir: "projets-js", title: "Projets JavaScript : apprendre en construisant",
      glyph: "App", language: "JavaScript", level: "intermediaire", status: "complet",
      accent: "#2f9e74", lessons: 24, hours: 14,
      tagline:
        "Quinze projets concrets de A à Z : calculatrice, quiz, budget, mots de passe, morpion, Pomodoro, météo (API), serpent (canvas), projets bonus (dessin, audio, glisser-déposer), pendu, Memory, liste de tâches filtrable, et un suivi d'habitudes en projet final.",
      tags: ["Pratique", "Projets", "Applications"],
    },

    /* ---- Autres langages (tous complets : page + content) ---- */
    {
      id: "typescript", dir: "typescript", title: "TypeScript : du typage au quotidien",
      glyph: "TS", language: "TypeScript", level: "intermediaire", status: "complet",
      accent: "#2f6fd0", lessons: 20, hours: 12,
      tagline: "Ajouter un typage statique à JavaScript pour des bases de code plus sûres : types, interfaces, unions, génériques, types utilitaires, types conditionnels/mappés, patterns avancés et outillage.",
      tags: ["Web", "Typage"],
    },
    {
      id: "nodejs", dir: "nodejs", title: "Node.js : JavaScript côté serveur",
      glyph: "No", language: "Node.js", level: "intermediaire", status: "complet",
      accent: "#4f9e54", lessons: 27, hours: 16,
      tagline:
        "JavaScript hors du navigateur : modules, npm, asynchrone, streams, serveur HTTP, API REST Express, base de données, auth (JWT), WebSockets, plus architecture robuste, performance/montée en charge et observabilité/déploiement.",
      tags: ["Back-end", "Serveur", "API"],
    },
    {
      id: "bash", dir: "bash", title: "Bash & ligne de commande",
      glyph: "$_", language: "Bash", level: "debutant", status: "complet",
      accent: "#5a6470", lessons: 16, hours: 9,
      tagline: "Naviguer, manipuler des fichiers, filtrer du texte, puis automatiser et scripter dans le terminal : sed/awk, processus & signaux, scripts de production.",
      tags: ["Outils", "Shell"],
    },
    {
      id: "regex", dir: "regex", title: "Regex : les expressions régulières",
      glyph: ".*", language: "Regex", level: "intermediaire", status: "complet",
      accent: "#3a8f7a", lessons: 11, hours: 7,
      tagline: "Un mini-langage transversal pour décrire des motifs de texte : littéraux et métacaractères, classes, quantificateurs, ancres, groupes et captures, alternatives, remplacement, regards et bonnes pratiques (ReDoS).",
      tags: ["Transversal", "Outils", "Texte"],
    },
    {
      id: "docker", dir: "docker", title: "Docker : conteneuriser ses applications",
      glyph: "Dk", language: "Docker", level: "intermediaire", status: "complet",
      accent: "#2f7fb8", lessons: 15, hours: 10,
      tagline: "Emballer une application avec son environnement pour qu'elle tourne partout : conteneurs vs VM, images et Dockerfile, volumes, réseaux et ports, Docker Compose, images optimisées, puis le niveau supérieur — ENTRYPOINT/ARG/ENV, BuildKit et multi-plateforme, pile multi-services et gestion de l'espace.",
      tags: ["Transversal", "Outils", "DevOps"],
    },
    {
      id: "api", dir: "api", title: "API REST : concevoir des API web",
      glyph: "API", language: "API REST", level: "intermediaire", status: "complet",
      accent: "#b04a8f", lessons: 14, hours: 8,
      tagline: "Faire dialoguer deux programmes sur le web, indépendamment du langage : modèle client/serveur, verbes HTTP et CRUD, codes de statut, conception des URL, JSON, pagination, versioning, authentification et sécurité, puis le niveau « à l'échelle » (OAuth2/JWT, cache et rate limiting, GraphQL/gRPC/WebSockets).",
      tags: ["Transversal", "Web", "Back-end"],
    },
    {
      id: "securite", dir: "securite", title: "Sécurité applicative : comprendre et prévenir les failles",
      glyph: "Sec", language: "Sécurité", level: "intermediaire", status: "complet",
      accent: "#7a2f3a", lessons: 14, hours: 9,
      tagline: "Reconnaître et prévenir les failles les plus critiques, de façon défensive : état d'esprit sécurité, validation des entrées, injections, XSS et CSRF, authentification et mots de passe, contrôle d'accès, défense en profondeur (OWASP Top 10), puis HTTPS/TLS et en-têtes, cryptographie appliquée et sécurité des dépendances.",
      tags: ["Transversal", "Web", "Sécurité"],
    },
    {
      id: "tests", dir: "tests", title: "Tests & qualité : tester son code et le garder sain",
      glyph: "QA", language: "Tests", level: "intermediaire", status: "complet",
      accent: "#4a8c5a", lessons: 14, hours: 9,
      tagline: "Écrire de bons tests automatisés et bâtir une posture qualité, quel que soit le langage : valeur des tests, anatomie d'un bon test, pyramide des tests, TDD, doublures (mocks/stubs/fakes), couverture et intégration continue, tests de performance et de charge, tests de contrat entre services et automatisation des tests de sécurité.",
      tags: ["Transversal", "Qualité", "Outils"],
    },
    {
      id: "patterns", dir: "patterns", title: "Design patterns : concevoir un code clair et flexible",
      glyph: "DP", language: "Design patterns", level: "intermediaire", status: "complet",
      accent: "#6b5b95", lessons: 11, hours: 7,
      tagline: "Les solutions éprouvées aux problèmes récurrents de la conception objet, et un vocabulaire commun : principes SOLID, patterns de création, structurels et comportementaux, et surtout savoir quand les employer.",
      tags: ["Transversal", "Conception", "Objet"],
    },
    {
      id: "formats", dir: "formats", title: "Formats de données : JSON, CSV, YAML, XML",
      glyph: "{ }", language: "Formats de données", level: "debutant", status: "complet",
      accent: "#a86b3f", lessons: 11, hours: 7,
      tagline: "Lire, écrire, choisir et valider les formats du quotidien : sérialisation et échange, JSON, CSV, YAML et TOML, XML et son écosystème, schémas de validation et encodage UTF-8.",
      tags: ["Transversal", "Données", "Outils"],
    },
    {
      id: "cicd", dir: "cicd", title: "CI/CD : automatiser l'intégration et le déploiement",
      glyph: "CI", language: "CI/CD", level: "intermediaire", status: "complet",
      accent: "#4f63c4", lessons: 11, hours: 7,
      tagline: "Automatiser le chemin du code, du commit à la production : intégration et déploiement continus, pipelines et workflows YAML, tests et qualité dans le pipeline, environnements, secrets, stratégies de déploiement et rollback.",
      tags: ["Transversal", "DevOps", "Outils"],
    },
    {
      id: "nosql", dir: "nosql", title: "NoSQL : les bases de données non relationnelles",
      glyph: "NQL", language: "NoSQL", level: "intermediaire", status: "complet",
      accent: "#2f8f66", lessons: 14, hours: 9,
      tagline: "Comprendre, comparer et choisir les bases non relationnelles : pourquoi le NoSQL, ACID vs BASE et théorème CAP, les familles document, clé-valeur, colonnes et graphe, la modélisation par les requêtes, et les bases spécialisées (séries temporelles, recherche, vecteurs).",
      tags: ["Transversal", "Données", "Back-end"],
    },
    {
      id: "markdown", dir: "markdown", title: "Markdown : rédiger en texte lisible",
      glyph: "MD", language: "Markdown", level: "debutant", status: "complet",
      accent: "#5f6b8c", lessons: 11, hours: 6,
      tagline: "Mettre en forme du texte avec quelques signes discrets, tout en restant lisible : titres et listes, liens et images, code et coloration, tableaux et listes de tâches (GFM), README et bonnes pratiques.",
      tags: ["Transversal", "Écriture", "Outils"],
    },
    {
      id: "vscode", dir: "vscode", title: "VS Code : maîtriser son éditeur de code",
      glyph: "VS", language: "VS Code", level: "debutant", status: "complet",
      accent: "#2563c8", lessons: 11, hours: 6,
      tagline: "L'éditeur de code le plus utilisé : qui fait quoi dans l'interface, raccourcis et multi-curseurs, IntelliSense, palette de commandes, terminal et Git intégrés, extensions et personnalisation, débogage, snippets, tâches (tasks.json), développement à distance, et un projet capstone pour configurer un dépôt de A à Z.",
      tags: ["Transversal", "Outils", "Productivité"],
    },
    {
      id: "sass", dir: "sass", title: "Sass : du CSS, en mieux",
      glyph: "Sa", language: "Sass", level: "intermediaire", status: "complet",
      accent: "#c2557f", lessons: 14, hours: 7,
      tagline: "Le préprocesseur CSS le plus utilisé : variables et types, imbrication et sélecteur parent, partials et @use/@forward, mixins, fonctions et couleurs, conditions et boucles, bonnes pratiques, l'échelle (architecture 7-1/BEM, design system avec maps et thématisation), puis les sujets avancés (modules natifs, responsive avec @content et clamp, maps imbriquées, migration @import).",
      tags: ["Front-end", "Web", "CSS"],
    },
    {
      id: "http", dir: "http", title: "HTTP : comment marche le web",
      glyph: "HT", language: "HTTP", level: "debutant", status: "complet",
      accent: "#0e7490", lessons: 12, hours: 6,
      tagline: "Le protocole du web, sans boîte noire : client-serveur et DNS, requête et réponse, méthodes et codes de statut, en-têtes, cookies et sessions, HTTPS, CORS et l'évolution du protocole.",
      tags: ["Web", "Réseau", "Transversal"],
    },
    {
      id: "vue", dir: "vue", title: "Vue.js : construire des interfaces réactives",
      glyph: "V", language: "Vue.js", level: "intermediaire", status: "complet",
      accent: "#3aa06a", lessons: 14, hours: 8,
      tagline: "Le framework JavaScript progressif et réactif (Vue 3, Composition API) : réactivité, template et directives, ref/computed/v-model, composants et props, événements et cycle de vie, l'écosystème (Vue Router, Pinia, Vite), le niveau confirmé (composables, patterns de composants, état, performance et production), puis la construction d'applications réelles (Vue Router en profondeur, formulaires et validation, transitions et animations, tests de composants avec Vitest) jusqu'à un projet d'application de tâches complet.",
      tags: ["Front-end", "Web", "Framework"],
    },
    {
      id: "java", dir: "java", title: "Java : programmation orientée objet",
      glyph: "Jv", language: "Java", level: "intermediaire", status: "complet",
      accent: "#b5562f", lessons: 23, hours: 13,
      tagline: "Un langage objet robuste, du typage fort à la JVM : POO, interfaces, exceptions, génériques, collections, lambdas, streams, concurrence, Java moderne, performance et tests JUnit 5.",
      tags: ["Objet", "Back-end"],
    },
    {
      id: "c", dir: "c", title: "C : programmation système",
      glyph: "C", language: "C", level: "avance", status: "complet",
      accent: "#5566a8", lessons: 21, hours: 12,
      tagline: "Mémoire, pointeurs et fonctionnement bas niveau de la machine : compilation, allocation dynamique, structures, fichiers, débogage mémoire, pointeurs de fonction, structures dynamiques, programmation système et tests.",
      tags: ["Système", "Bas niveau"],
    },
    {
      id: "cpp", dir: "cpp", title: "C++ : performance et objets",
      glyph: "C++", language: "C++", level: "avance", status: "complet",
      accent: "#6f4fa8", lessons: 23, hours: 13,
      tagline: "La puissance du C avec l'abstraction objet et la STL : classes, RAII, templates, conteneurs, déplacement, pointeurs intelligents, concurrence, métaprogrammation, performance et tests Catch2.",
      tags: ["Système", "Performance"],
    },
    {
      id: "csharp", dir: "csharp", title: "C# : applications .NET",
      glyph: "C#", language: "C#", level: "intermediaire", status: "complet",
      accent: "#6a9b43", lessons: 23, hours: 13,
      tagline: "Un langage objet moderne pour le web, le bureau et les jeux : POO, interfaces, records, génériques, collections, LINQ, async/await, concurrence, fonctionnalités avancées, performance, tests, fichiers/JSON et sécurité du null.",
      tags: ["Objet", ".NET"],
    },
    {
      id: "go", dir: "go", title: "Go : simplicité et concurrence",
      glyph: "Go", language: "Go", level: "intermediaire", status: "complet",
      accent: "#3aa0c9", lessons: 18, hours: 10,
      tagline: "Un langage compilé, rapide et taillé pour la concurrence : slices, structures, interfaces, erreurs, goroutines, channels, patterns de concurrence, génériques/runtime, services robustes, JSON, texte, temps, fichiers et outils en ligne de commande.",
      tags: ["Back-end", "Concurrence"],
    },
    {
      id: "rust", dir: "rust", title: "Rust : sûreté mémoire sans GC",
      glyph: "Rs", language: "Rust", level: "avance", status: "complet",
      accent: "#c56a3a", lessons: 22, hours: 13,
      tagline: "Performances du C avec des garanties de sûreté à la compilation : possession, emprunts, durées de vie, traits, génériques, concurrence, pointeurs intelligents, async, unsafe et tests.",
      tags: ["Système", "Performance"],
    },
    {
      id: "php", dir: "php", title: "PHP : le web côté serveur",
      glyph: "PHP", language: "PHP", level: "debutant", status: "complet",
      accent: "#6e7cb8", lessons: 21, hours: 12,
      tagline: "Générer des pages dynamiques et gérer formulaires et données : tableaux, sessions, sécurité web, POO, PDO, Composer, API REST, performance, et une vraie application Laravel.",
      tags: ["Back-end", "Web"],
    },

    /* ---- Vague 1 — grands langages à venir ---- */
    {
      id: "ruby", dir: "ruby", title: "Ruby : un langage pensé pour le développeur",
      glyph: "Rb", language: "Ruby", level: "debutant", status: "complet",
      accent: "#c14a4a", lessons: 22, hours: 17,
      tagline: "Un langage expressif et élégant, du premier script à la métaprogrammation : objets partout, blocs et itérateurs, collections, modules, gems, fichiers, tests et une vraie application Rails.",
      tags: ["Polyvalent", "Web", "Scripts"],
    },
    {
      id: "kotlin", dir: "kotlin", title: "Kotlin : le JVM moderne et Android",
      glyph: "Kt", language: "Kotlin", level: "intermediaire", status: "complet",
      accent: "#7a5cc6", lessons: 21, hours: 17,
      tagline: "Le successeur pragmatique de Java : null-safety, fonctions d'extension, data classes, lambdas, coroutines, collections, interopérabilité Java, premiers pas Android et tests.",
      tags: ["Mobile", "JVM", "Android"],
    },
    {
      id: "swift", dir: "swift", title: "Swift : développer pour l'écosystème Apple",
      glyph: "Sw", language: "Swift", level: "intermediaire", status: "complet",
      accent: "#d97842", lessons: 18, hours: 14,
      tagline: "Le langage d'iOS et macOS : optionnels, structs et classes, protocoles, génériques, gestion d'erreurs, closures, concurrence (async/await, actors) et premiers pas SwiftUI.",
      tags: ["Mobile", "iOS", "Apple"],
    },
    {
      id: "r", dir: "r", title: "R : statistiques et analyse de données",
      glyph: "R", language: "R", level: "debutant", status: "complet",
      accent: "#3f6db5", lessons: 17, hours: 14,
      tagline: "Le langage des statisticiens : vecteurs, data frames, manipulation de données (dplyr), visualisation (ggplot2), statistiques descriptives et inférentielles, modèles et rapports.",
      tags: ["Données", "Statistiques", "Science"],
    },
    {
      id: "pandas", dir: "pandas", title: "pandas : analyser des données avec Python",
      glyph: "pd", language: "Python", level: "intermediaire", status: "complet",
      accent: "#5a4fcf", lessons: 14, hours: 9,
      tagline: "La bibliothèque reine de l'analyse de données en Python : charger et inspecter un jeu de données, nettoyer les valeurs manquantes, sélectionner et filtrer, créer des colonnes, regrouper et croiser, joindre des tables, traiter des séries temporelles et exporter — sur un vrai jeu de ventes.",
      tags: ["Data", "Python", "Analyse"],
    },
    {
      id: "dataviz", dir: "dataviz", title: "Data visualisation : donner à voir les données",
      glyph: "dv", language: "Python", level: "intermediaire", status: "complet",
      accent: "#c2410c", lessons: 14, hours: 9,
      tagline: "Transformer des chiffres en graphiques qui disent vrai : choisir la forme selon la question, maîtriser les barres, courbes, distributions, nuages et compositions, régler l'échelle, la couleur (et le daltonisme) et la densité, cartographier, annoter pour raconter — et repérer les graphiques qui mentent.",
      tags: ["Data", "Graphiques", "Visualisation"],
    },
    {
      id: "stats", dir: "stats", title: "Statistiques appliquées pour développeurs",
      glyph: "st", language: "Python", level: "intermediaire", status: "complet",
      accent: "#3949ab", lessons: 15, hours: 11,
      tagline: "La statistique dont un développeur a réellement besoin : décrire une distribution (moyenne, médiane, dispersion), passer d'un échantillon à la population, lire un intervalle de confiance, mener un test d'hypothèse et comprendre la valeur p, distinguer corrélation et causalité, ajuster une régression — et déjouer les pièges (p-hacking, biais de survie, paradoxe de Simpson).",
      tags: ["Data", "Statistiques", "Analyse"],
    },
    {
      id: "data-eng", dir: "data-eng", title: "Ingénierie de données : construire des pipelines",
      glyph: "de", language: "Python", level: "intermediaire", status: "complet",
      accent: "#0f766e", lessons: 14, hours: 10,
      tagline: "De la donnée brute au jeu de données fiable : penser un pipeline, choisir entre ETL et ELT, maîtriser les formats (CSV, JSON, Parquet), partitionner le stockage, rendre un traitement idempotent et rejouable, orchestrer les dépendances, garantir la qualité et les contrats de données, puis surveiller la fraîcheur, le coût et la santé d'un pipeline.",
      tags: ["Data", "Pipelines", "Ingénierie"],
    },
    {
      id: "bdd", dir: "bdd", title: "Concevoir une base de données",
      glyph: "bd", language: "SQL", level: "intermediaire", status: "complet",
      accent: "#8a3d62", lessons: 15, hours: 11,
      tagline: "Passer de l'usage de SQL à la conception : aller du besoin au modèle, poser entités et relations, choisir les clés primaires et étrangères, normaliser jusqu'à la 3e forme (et savoir dénormaliser), garantir l'intégrité par les contraintes, doser les index, lire un plan d'exécution, maîtriser transactions et niveaux d'isolation, faire évoluer un schéma par des migrations — et savoir quand modéliser pour du NoSQL.",
      tags: ["Data", "Bases de données", "Modélisation"],
    },
    {
      id: "mobile", dir: "mobile", title: "Développer une application mobile",
      glyph: "mo", language: "Mobile", level: "intermediaire", status: "complet",
      accent: "#2563eb", lessons: 15, hours: 11,
      tagline: "Ce qui fait une vraie application mobile, par-delà le langage : le cycle de vie et les interruptions, la navigation entre écrans, l'état et sa remontée, les listes performantes, le stockage local, le réseau et le mode hors ligne, les permissions et la vie privée, les notifications, l'adaptation à tous les écrans, les tests sur appareil et la publication sur les magasins — illustré avec SwiftUI, Kotlin/Compose et Flutter.",
      tags: ["Mobile", "Multiplateforme", "Transversal"],
    },
    {
      id: "equipe", dir: "equipe", title: "Travailler à plusieurs sur du code",
      glyph: "eq", language: "Collaboration", level: "intermediaire", status: "complet",
      accent: "#6d28d9", lessons: 14, hours: 10,
      tagline: "Ce qu'on n'apprend pas en apprenant un langage : lire le code des autres, faire une revue utile et en recevoir une, automatiser le style pour ne plus en débattre, écrire un message de commit et une demande de fusion, estimer sans se mentir, nommer et traiter la dette technique, documenter ce qui compte, intégrer un nouveau venu, gérer un incident et en faire l'après sans chercher de coupable.",
      tags: ["Collaboration", "Travail d'équipe", "Transversal"],
    },
    {
      id: "dart", dir: "dart", title: "Dart & Flutter : applications multiplateformes",
      glyph: "Da", language: "Dart", level: "intermediaire", status: "complet",
      accent: "#2fa3b8", lessons: 16, hours: 13,
      tagline: "Un langage typé et sain pour le mobile : null-safety, classes et mixins, async/streams, collections, puis Flutter — widgets, mise en page, gestion d'état, navigation, réseau/JSON et une vraie petite application.",
      tags: ["Mobile", "Multiplateforme", "Flutter"],
    },
    {
      id: "lua", dir: "lua", title: "Lua : scripting léger et embarqué",
      glyph: "Lua", language: "Lua", level: "debutant", status: "complet",
      accent: "#4a5fc1", lessons: 20, hours: 17,
      tagline: "Le petit langage qui se glisse partout — jeux, outils, serveurs : tables (l'unique structure), fonctions, métatables, coroutines, modules, intégration dans un hôte et un vrai jeu LÖVE.",
      tags: ["Jeux", "Scripts", "Embarqué"],
    },

    /* ---- Vague 2 — paradigmes et écosystèmes à venir ---- */
    {
      id: "asm", dir: "asm", title: "Assembleur x86-64 : parler à la machine",
      glyph: "asm", language: "Assembleur", level: "avance", status: "complet",
      accent: "#4a4f8c", lessons: 15, hours: 13,
      tagline: "Sous le capot de tous les langages : registres, mémoire, pile, instructions, appels de fonction, conventions d'appel, syscalls, et lire le code que produit ton compilateur.",
      tags: ["Système", "Bas niveau", "Architecture"],
    },
    {
      id: "haskell", dir: "haskell", title: "Haskell : la programmation fonctionnelle pure",
      glyph: "λ", language: "Haskell", level: "avance", status: "complet",
      accent: "#7d6bb5", lessons: 18, hours: 16,
      tagline: "Penser autrement : fonctions pures, immutabilité, évaluation paresseuse, types algébriques, pattern matching, type classes, foncteurs, monades et IO — sans mystification.",
      tags: ["Fonctionnel", "Types", "Académique"],
    },
    {
      id: "elixir", dir: "elixir", title: "Elixir : la concurrence sereine",
      glyph: "Ex", language: "Elixir", level: "avance", status: "complet",
      accent: "#8a5c9e", lessons: 17, hours: 14,
      tagline: "Le fonctionnel pragmatique sur la VM Erlang : pattern matching, pipe, processus et messages, OTP (GenServer, supervision), tolérance aux pannes et un soupçon de Phoenix.",
      tags: ["Fonctionnel", "Concurrence", "Back-end"],
    },
    {
      id: "scala", dir: "scala", title: "Scala : objet et fonctionnel sur la JVM",
      glyph: "Sc", language: "Scala", level: "avance", status: "complet",
      accent: "#c44536", lessons: 17, hours: 15,
      tagline: "Deux paradigmes réconciliés : case classes, pattern matching, collections immuables, traits, génériques avancés, implicits/given, for-comprehensions, performances des collections, et l'écosystème big data (Spark).",
      tags: ["JVM", "Fonctionnel", "Big data"],
    },
    {
      id: "powershell", dir: "powershell", title: "PowerShell : automatiser Windows",
      glyph: "PS", language: "PowerShell", level: "debutant", status: "complet",
      accent: "#2f6fb0", lessons: 17, hours: 14,
      tagline: "Le shell objet de Windows : cmdlets, pipeline d'objets, variables et types, scripts et fonctions, fichiers et registre, modules, remoting, texte et Web, classes, sécurité et administration au quotidien.",
      tags: ["Outils", "Windows", "Automatisation"],
    },
    {
      id: "perl", dir: "perl", title: "Perl : le couteau suisse du texte",
      glyph: "Pl", language: "Perl", level: "intermediaire", status: "complet",
      accent: "#3a5f8a", lessons: 16, hours: 13,
      tagline: "L'art de traiter du texte : scalaires/tableaux/hachages, contexte, expressions régulières au sommet, fichiers, one-liners, références, modules, CPAN, formats de données et bases via DBI.",
      tags: ["Scripts", "Texte", "Regex"],
    },

    /* ---- Vague 3 — découverte : historiques, fonctionnels et niches ---- */
    {
      id: "cobol", dir: "cobol", title: "COBOL : le langage des systèmes bancaires",
      glyph: "Cb", language: "COBOL", level: "intermediaire", status: "complet",
      accent: "#3f7a8c", lessons: 14, hours: 11,
      tagline: "Toujours au cœur des banques et assurances : divisions et sections, PICTURE, décimal exact, fichiers séquentiels et indexés, sous-programmes, traitements par lots et lecture de code existant.",
      tags: ["Legacy", "Entreprise", "Batch"],
    },
    {
      id: "fortran", dir: "fortran", title: "Fortran : le calcul scientifique historique",
      glyph: "F", language: "Fortran", level: "intermediaire", status: "complet",
      accent: "#5f7a3f", lessons: 14, hours: 12,
      tagline: "Le doyen toujours en service dans le calcul haute performance : tableaux au cœur du langage, sous-programmes, modules, le Fortran moderne et l'héritage des codes anciens.",
      tags: ["Scientifique", "HPC", "Legacy"],
    },
    {
      id: "julia", dir: "julia", title: "Julia : le calcul scientifique moderne",
      glyph: "Jl", language: "Julia", level: "intermediaire", status: "complet",
      accent: "#8a55b0", lessons: 16, hours: 14,
      tagline: "La vitesse du C avec la syntaxe d'un langage de script : multiple dispatch, tableaux et broadcasting, types, performance, packages et calcul numérique au quotidien.",
      tags: ["Scientifique", "Données", "Performance"],
    },
    {
      id: "zig", dir: "zig", title: "Zig : le système sans surprises",
      glyph: "Zg", language: "Zig", level: "avance", status: "complet",
      accent: "#b8862f", lessons: 18, hours: 16,
      tagline: "Un C moderne et explicite : pas d'allocations cachées, comptime, gestion d'erreurs par unions, allocateurs, interopérabilité C totale, compilation croisée, tests intégrés, concurrence, généricité et un projet en ligne de commande.",
      tags: ["Système", "Bas niveau", "Moderne"],
    },
    {
      id: "lisp", dir: "lisp", title: "Lisp & Scheme : le pouvoir des parenthèses",
      glyph: "( )", language: "Lisp", level: "intermediaire", status: "complet",
      accent: "#7a8a3f", lessons: 15, hours: 13,
      tagline: "Le code est une donnée : s-expressions, listes, récursion, fonctions d'ordre supérieur, macros — et pourquoi ce langage de 1958 influence encore tous les autres.",
      tags: ["Fonctionnel", "Académique", "Macros"],
    },
    {
      id: "ocaml", dir: "ocaml", title: "OCaml : typage fort et inférence",
      glyph: "Oc", language: "OCaml", level: "avance", status: "complet",
      accent: "#c97a35", lessons: 18, hours: 16,
      tagline: "Le fonctionnel pragmatique à la française : inférence de types, variants et pattern matching, immutabilité par défaut, modules et foncteurs, et un détour par l'impératif.",
      tags: ["Fonctionnel", "Types", "Compilateurs"],
    },
    {
      id: "fsharp", dir: "fsharp", title: "F# : le fonctionnel sur .NET",
      glyph: "F#", language: "F#", level: "avance", status: "complet",
      accent: "#3f8ab5", lessons: 14, hours: 12,
      tagline: "Le fonctionnel qui parle à tout .NET : immutabilité, unions discriminées, pattern matching, pipelines, async, et l'interopérabilité C# pour l'utiliser au travail dès demain.",
      tags: ["Fonctionnel", ".NET", "Données"],
    },
    {
      id: "clojure", dir: "clojure", title: "Clojure : Lisp moderne sur la JVM",
      glyph: "Cj", language: "Clojure", level: "avance", status: "complet",
      accent: "#4a9e58", lessons: 17, hours: 13,
      tagline: "L'immutabilité au service du réel : structures persistantes, séquences paresseuses, le REPL comme mode de vie, atomes et concurrence, et l'accès à tout l'écosystème Java.",
      tags: ["Fonctionnel", "JVM", "Immutabilité"],
    },
    {
      id: "prolog", dir: "prolog", title: "Prolog : la programmation logique",
      glyph: "?-", language: "Prolog", level: "avance", status: "complet",
      accent: "#a8553f", lessons: 14, hours: 12,
      tagline: "Décrire le problème, pas la solution : faits, règles et requêtes, unification, backtracking, listes, coupure, et des puzzles que dix lignes suffisent à résoudre.",
      tags: ["Logique", "IA", "Académique"],
    },
    {
      id: "ada", dir: "ada", title: "Ada : la fiabilité critique",
      glyph: "Ada", language: "Ada", level: "avance", status: "complet",
      accent: "#2e7d6e", lessons: 14, hours: 11,
      tagline: "Le langage de l'avionique et du ferroviaire : typage très fort, contrats, plages et contraintes, paquets, tâches concurrentes et l'art d'écrire du code qui n'a pas le droit d'échouer.",
      tags: ["Critique", "Embarqué", "Fiabilité"],
    },
    {
      id: "pascal", dir: "pascal", title: "Pascal & Delphi : l'école de la structure",
      glyph: "Pa", language: "Pascal", level: "debutant", status: "complet",
      accent: "#356a92", lessons: 14, hours: 11,
      tagline: "Le langage pédagogique par excellence : programmes structurés, types forts, procédures et fonctions, enregistrements, pointeurs maîtrisés, unités, l'Object Pascal de Delphi et un projet de synthèse.",
      tags: ["Pédagogie", "Structuré", "Legacy"],
    },
    {
      id: "vb", dir: "vb", title: "Visual Basic : l'automatisation Office et .NET",
      glyph: "VB", language: "Visual Basic", level: "debutant", status: "complet",
      accent: "#5a4fa0", lessons: 14, hours: 12,
      tagline: "Du VBA d'Excel à VB.NET : syntaxe lisible, formulaires, événements, macros Office qui font gagner des heures, et la transition vers l'écosystème .NET moderne.",
      tags: ["Bureautique", ".NET", "Automatisation"],
    },
    {
      id: "objc", dir: "objc", title: "Objective-C : l'héritage d'iOS",
      glyph: "[ ]", language: "Objective-C", level: "avance", status: "complet",
      accent: "#7a4f5f", lessons: 14, hours: 12,
      tagline: "Lire et maintenir l'existant Apple : messages entre crochets, classes et catégories, protocoles, gestion mémoire (ARC), blocks, erreurs NSError, Foundation et runtime dynamique.",
      tags: ["Apple", "Legacy", "Mobile"],
    },
    {
      id: "erlang", dir: "erlang", title: "Erlang : la tolérance aux pannes",
      glyph: "Er", language: "Erlang", level: "avance", status: "complet",
      accent: "#a8324f", lessons: 14, hours: 12,
      tagline: "Neuf neuf de disponibilité : processus ultra-légers, échange de messages, « let it crash », supervision, OTP, et pourquoi la téléphonie mondiale tourne dessus depuis 30 ans.",
      tags: ["Concurrence", "Distribué", "Télécoms"],
    },
    {
      id: "groovy", dir: "groovy", title: "Groovy : le script de la JVM",
      glyph: "Gv", language: "Groovy", level: "intermediaire", status: "complet",
      accent: "#4a8ab0", lessons: 14, hours: 12,
      tagline: "Java sans la cérémonie : typage optionnel, closures, GString, collections augmentées, builders, et le langage de Gradle et Jenkins que tout développeur JVM croise un jour.",
      tags: ["JVM", "Scripts", "Outils"],
    },
    {
      id: "solidity", dir: "solidity", title: "Solidity : les contrats intelligents",
      glyph: "So", language: "Solidity", level: "intermediaire", status: "complet",
      accent: "#5a5f6e", lessons: 17, hours: 15,
      tagline: "Programmer la blockchain Ethereum : contrats, stockage, gas, sécurité (réentrance), puis le niveau ingénieur — tests Foundry, contrats évolutifs et sécurité avancée.",
      tags: ["Blockchain", "Web3", "Sécurité"],
    },
    {
      id: "ml", dir: "ml", title: "Machine Learning : initiation avec Python",
      glyph: "ML", language: "Python", level: "intermediaire", status: "complet",
      accent: "#7c5cd6", lessons: 12, hours: 7,
      tagline: "Apprendre à une machine à partir de données : le workflow ML, préparer les données, régression et classification, évaluer un modèle et éviter le surapprentissage — en Python avec scikit-learn.",
      tags: ["Data", "IA", "Python"],
    },
    {
      id: "kubernetes", dir: "kubernetes", title: "Kubernetes : orchestrer des conteneurs",
      glyph: "K8s", language: "Kubernetes", level: "intermediaire", status: "complet",
      accent: "#3367d6", lessons: 12, hours: 7,
      tagline: "Déployer et piloter des applications conteneurisées à l'échelle : pods, déploiements, services, configuration, volumes, mise à l'échelle et sondes de santé.",
      tags: ["DevOps", "Cloud", "Conteneurs"],
    },
    {
      id: "graphql", dir: "graphql", title: "GraphQL : des API flexibles",
      glyph: "GQL", language: "GraphQL", level: "intermediaire", status: "complet",
      accent: "#d6398e", lessons: 11, hours: 7,
      tagline: "Interroger une API en demandant exactement les données voulues : le schéma typé, les requêtes, les mutations et les résolveurs, jusqu'à une API GraphQL complète.",
      tags: ["API", "Back-end", "Web"],
    },
    {
      id: "llm", dir: "llm", title: "Développer avec l'IA & les LLM",
      glyph: "LLM", language: "IA / LLM", level: "intermediaire", status: "complet",
      accent: "#1f9e8a", lessons: 12, hours: 7,
      tagline: "Construire des applications avec les grands modèles de langage : comprendre un LLM, le prompt engineering, appeler une API, structurer les sorties, le RAG et les agents, puis évaluer, sécuriser, produire et adapter.",
      tags: ["IA", "LLM", "API"],
    },
    {
      id: "a11y", dir: "a11y", title: "Accessibilité web (a11y)",
      glyph: "a11y", language: "Accessibilité", level: "intermediaire", status: "complet",
      accent: "#2aa37a", lessons: 15, hours: 9,
      tagline: "Concevoir des sites utilisables par tous : HTML sémantique, navigation clavier, ARIA, contrastes et audit — puis maîtriser tableaux, formulaires, widgets et tests (WCAG).",
      tags: ["Web", "Front-end", "Accessibilité"],
    },
    {
      id: "perf-web", dir: "perf-web", title: "Performance & SEO web",
      glyph: "Perf", language: "Performance", level: "intermediaire", status: "complet",
      accent: "#e0972a", lessons: 15, hours: 9,
      tagline: "Des sites rapides et bien référencés : Web Vitals, optimisation du chargement, rendu, SEO technique et données structurées — puis la performance d'exécution (60 fps, Web Workers), l'outillage (DevTools, Lighthouse) et les stratégies de rendu (CSR/SSR/SSG), jusqu'au diagnostic d'une page lente.",
      tags: ["Web", "Front-end", "Performance"],
    },
    {
      id: "cloud", dir: "cloud", title: "Cloud & déploiement (fondamentaux)",
      glyph: "Cloud", language: "Cloud", level: "intermediaire", status: "complet",
      accent: "#e8821e", lessons: 12, hours: 7,
      tagline: "Comprendre et utiliser le cloud : IaaS/PaaS/serverless, régions et disponibilité, stockage et bases gérées, coûts, sécurité (IAM) — jusqu'à concevoir un déploiement.",
      tags: ["Cloud", "DevOps", "Infrastructure"],
    },
    {
      id: "iac", dir: "iac", title: "Infrastructure as Code (Terraform)",
      glyph: "IaC", language: "Terraform", level: "intermediaire", status: "complet",
      accent: "#7b42bc", lessons: 11, hours: 7,
      tagline: "Décrire son infrastructure en code avec Terraform : providers et ressources, variables et state, plan/apply, modules et environnements — fini le « cliquer dans la console ».",
      tags: ["DevOps", "Cloud", "Infrastructure"],
    },
    {
      id: "archi", dir: "archi", title: "Architecture logicielle",
      glyph: "Arch", language: "Architecture", level: "intermediaire", status: "complet",
      accent: "#5a7d9a", lessons: 12, hours: 7,
      tagline: "Structurer une application qui dure : couches et responsabilités, couplage et cohésion, monolithe vs microservices, clean architecture, hexagonale et DDD léger.",
      tags: ["Architecture", "Conception", "Back-end"],
    },
    {
      id: "wasm", dir: "wasm", title: "WebAssembly",
      glyph: "Wasm", language: "WebAssembly", level: "intermediaire", status: "complet",
      accent: "#654ff0", lessons: 11, hours: 6,
      tagline: "Exécuter du code rapide dans le navigateur : ce qu'est WebAssembly, compiler du C ou du Rust vers .wasm, le charger, le faire dialoguer avec JavaScript, lire son format texte, l'exécuter hors du navigateur et assembler le tout en un projet complet.",
      tags: ["Web", "Performance", "Bas niveau"],
    },
    {
      id: "linux", dir: "linux", title: "Linux & administration système",
      glyph: "Lx", language: "Linux", level: "intermediaire", status: "complet",
      accent: "#6d8b3c", lessons: 11, hours: 6,
      tagline: "Comprendre et administrer un système Linux : noyau et distributions, système de fichiers, utilisateurs et permissions, processus, paquets et services (systemd), journaux, réseau et SSH, sauvegardes et exploitation — les bases d'un serveur que l'on maîtrise.",
      tags: ["Transversal", "Outils", "Système"],
    },
    {
      id: "reseaux", dir: "reseaux", title: "Réseaux : comment marche Internet",
      glyph: "Net", language: "Réseaux", level: "intermediaire", status: "complet",
      accent: "#3a56b0", lessons: 11, hours: 6,
      tagline: "Comprendre ce qui se passe entre deux machines : le modèle en couches, les adresses IP et le routage, TCP/UDP et les ports, le DNS, HTTP/TLS côté réseau, puis le réseau local en détail (CIDR, ARP, DHCP, Wi-Fi) et ses frontières (NAT, pare-feu, VPN) — pour ne plus voir Internet comme une boîte noire.",
      tags: ["Transversal", "Réseau", "Outils"],
    },
    {
      id: "ux", dir: "ux", title: "UX & design d'interface",
      glyph: "UX", language: "Design UX", level: "debutant", status: "complet",
      accent: "#c75b9e", lessons: 11, hours: 6,
      tagline: "Concevoir des interfaces claires et agréables : la différence UX/UI, comprendre l'utilisateur et ses parcours, la hiérarchie visuelle, la couleur et la typographie, les interactions et les états — du point de vue du développeur.",
      tags: ["Web", "Design", "Front-end"],
    },
    {
      id: "observabilite", dir: "observabilite", title: "Observabilité & SRE",
      glyph: "Obs", language: "Observabilité", level: "intermediaire", status: "complet",
      accent: "#3a8fb0", lessons: 11, hours: 6,
      tagline: "Savoir ce que fait un système en production : les trois piliers (logs, métriques, traces), les journaux structurés, les tableaux de bord, le tracing distribué, l'alerting, et la culture SRE (SLI/SLO) pour fiabiliser un service.",
      tags: ["Transversal", "Outils", "DevOps"],
    },
    {
      id: "os", dir: "os", title: "Systèmes d'exploitation : les fondations",
      glyph: "OS", language: "Systèmes", level: "intermediaire", status: "complet",
      accent: "#7a6f9c", lessons: 14, hours: 8,
      tagline: "Comprendre ce qui se passe sous le code : le rôle d'un système d'exploitation, les processus et threads, l'ordonnancement, la mémoire virtuelle, les fichiers et les entrées/sorties, jusqu'au temps réel, à la sécurité et à la tolérance aux pannes — les concepts qui éclairent tout le reste.",
      tags: ["Transversal", "Système", "Bas niveau"],
    },
    {
      id: "compilation", dir: "compilation", title: "Compilation : du texte source au code exécuté",
      glyph: "cp", language: "Compilation", level: "avance", status: "complet",
      accent: "#7a5a1e", lessons: 13, hours: 16,
      tagline: "Ce qui se passe entre le fichier que tu écris et ce que la machine exécute : compiler ou interpréter, les étapes d'une chaîne de compilation, pourquoi un langage a besoin d'une grammaire — puis, module après module, construire un langage minuscule de bout en bout : analyse lexicale, analyse syntaxique, arbre de syntaxe, évaluation et machine à pile. Tous les exemples sont en JavaScript et s'exécutent dans la page.",
      tags: ["Transversal", "Langages", "Bas niveau"],
    },
    {
      id: "neurones", dir: "neurones", title: "Réseaux de neurones : de l'addition à l'apprentissage profond",
      glyph: "nn", language: "Réseaux de neurones", level: "avance", status: "complet",
      accent: "#1c6822", lessons: 12, hours: 20,
      tagline: "Ce qu'il y a vraiment sous un « réseau de neurones » : une addition, une décision, et beaucoup de répétitions. On part du neurone formel, on mesure pourquoi un seul ne suffit pas, puis on empile des couches — chaque calcul étant refait dans la page, jamais admis. Tous les exemples sont en JavaScript et s'exécutent d'un clic.",
      tags: ["IA", "Données", "Transversal"],
    },
    {
      id: "distribue", dir: "distribue", title: "Systèmes distribués : quand le programme n'est plus sur une seule machine",
      glyph: "⇄", language: "Systèmes distribués", level: "avance", status: "complet",
      accent: "#2f4b7c", lessons: 12, hours: 16,
      tagline: "Le site enseigne partout les conséquences — réplication, latence, cohérence — sans jamais poser les fondations. Ce cours les pose. Dès qu'un programme s'étale sur deux machines, la moitié de ce que tu sais devient faux : un appel peut ne jamais répondre sans qu'on sache s'il a été exécuté, et la lumière elle-même impose un plancher de temps. Chaque affirmation y est chiffrée par un programme qui tourne dans la page.",
      tags: ["Transversal", "Architecture", "Distribué"],
    },
    {
      id: "offensive", dir: "offensive", title: "Sécurité offensive : comprendre l'attaque pour savoir défendre",
      glyph: "◎", language: "Sécurité offensive", level: "avance", status: "complet",
      accent: "#943f1a", lessons: 12, hours: 8,
      tagline: "Le cours Sécurité applicative enseigne les défenses. Celui-ci enseigne ce contre quoi elles défendent — parce qu'on ne protège correctement que ce dont on a compris l'attaque. Cadre strict : tout y est fait sur des cibles fictives, avec l'autorisation écrite comme premier chapitre, et la loi française citée article par article. Chaque affirmation est chiffrée par un programme qui tourne dans la page.",
      tags: ["Transversal", "Sécurité", "Web"],
    },
    {
      id: "crypto", dir: "crypto", title: "Cryptographie appliquée : ce que chaque outil garantit, et ce qu'il ne garantit pas",
      glyph: "⊕", language: "Cryptographie", level: "avance", status: "complet",
      accent: "#1d7a5f", lessons: 11, hours: 6,
      tagline: "Les cours Sécurité applicative et HTTP emploient le chiffrement sans jamais l'expliquer. Ce cours ouvre la boîte : chaque primitive y est écrite en entier, exécutée dans la page, vérifiée contre les vecteurs de test de sa norme — puis cassée, parce que c'est en la cassant qu'on comprend ce qu'elle protégeait. La règle qui traverse tout : on n'écrit jamais sa propre cryptographie, on choisit le bon outil avec les bons paramètres.",
      tags: ["Transversal", "Sécurité", "Fondamentaux"],
    },
    {
      id: "maths", dir: "maths", title: "Mathématiques de l'informatique : ce dont on se sert vraiment",
      glyph: "∀", language: "Mathématiques", level: "intermediaire", status: "apercu",
      accent: "#702070", lessons: 3, hours: 3,
      tagline: "Pas un cours de mathématiques déguisé : les mathématiques dont un développeur se sert, chacune reliée à l'endroit du site où elle sert déjà. La logique derrière un if, les ensembles derrière une table de hachage, l'arithmétique modulaire derrière la cryptographie, les graphes derrière un réseau, la croissance derrière un O(n²). Chaque notion arrive avec un programme qui la met en œuvre — et aucun chiffre de ce cours n'a été écrit de tête : tous sortent d'une exécution.",
      tags: ["Transversal", "Fondamentaux", "Mathématiques"],
    },
  ];

  /* ---- Structure détaillée des cours (pages de cours + nav de leçon) -------
     Chaque leçon : num, title, file ("lecon-NN.html" | "#"), status.
     overview : "cours.html" (relatif au dossier du cours).
     related  : cross-références vers d'autres cours (id + note).                */
  var content = {
    ml: {
      id: "ml", dir: "ml", title: "Machine Learning : initiation avec Python",
      glyph: "ML", accent: "#7c5cd6", overview: "cours.html",
      related: [
        { course: "python", note: "Le ML s'écrit en Python : assure-toi des bases du langage." },
        { course: "sql", note: "Les données d'entraînement viennent souvent d'une base de données." },
        { course: "r", note: "Une autre voie pour les statistiques et la visualisation." },
        { course: "stats", note: "Régression, sur-ajustement, échantillon d'entraînement et de test : le ML repose sur les statistiques du cours dédié." },
        { course: "pandas", note: "Nettoyer et préparer les données tabulaires : le premier vrai chantier avant tout modèle." },
        { course: "neurones", note: "La famille de modèles que ce cours ne traite pas : réseaux de neurones et apprentissage profond. Il en montre le fonctionnement interne, calcul par calcul." },
      ],
      modules: [
        {
          num: "01", title: "Comprendre le ML", sub: "Ce qu'est l'apprentissage automatique et son déroulé",
          lessons: [
            { num: "01", title: "Qu'est-ce que le Machine Learning ?", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le workflow d'un projet ML", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Préparer les données", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Modèles supervisés", sub: "Prédire un nombre, prédire une classe, évaluer",
          lessons: [
            { num: "04", title: "La régression (prédire un nombre)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "La classification (prédire une classe)", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Évaluer & éviter le surapprentissage", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Un modèle de bout en bout",
          lessons: [
            { num: "07", title: "Assembler un projet complet", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Clustering, évaluation fine, forêts et industrialisation",
          lessons: [
            { num: "08", title: "Le clustering : regrouper sans étiquettes", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Bien évaluer une classification", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Arbres de décision & forêts aléatoires", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Pipelines & réglage des hyperparamètres", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Le capstone : un projet ML complet, de la donnée à la décision",
          lessons: [
            { num: "12", title: "Projet final — de la donnée à la décision", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    kubernetes: {
      id: "kubernetes", dir: "kubernetes", title: "Kubernetes : orchestrer des conteneurs",
      glyph: "K8s", accent: "#3367d6", overview: "cours.html",
      related: [
        { course: "docker", note: "Kubernetes orchestre des conteneurs : fais d'abord le cours Docker." },
        { course: "cicd", note: "Déploie automatiquement sur Kubernetes depuis ton pipeline CI/CD." },
        { course: "nodejs", note: "Un bon candidat d'application à conteneuriser puis à déployer." },
      ],
      modules: [
        {
          num: "01", title: "Les bases", sub: "Le rôle de Kubernetes, pods et déploiements",
          lessons: [
            { num: "01", title: "Pourquoi Kubernetes ?", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Pods & conteneurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Déploiements & ReplicaSets", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Réseau & configuration", sub: "Exposer, configurer, stocker",
          lessons: [
            { num: "04", title: "Services & exposition", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "ConfigMaps & Secrets", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Volumes & stockage", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "En production", sub: "Mise à l'échelle et santé",
          lessons: [
            { num: "07", title: "Scaling, santé & déploiement", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Pour aller plus loin", sub: "Organiser, exposer, planifier, empaqueter",
          lessons: [
            { num: "08", title: "Namespaces, labels & organisation", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Ingress : router le trafic HTTP", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Jobs, CronJobs & DaemonSets", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Helm : empaqueter ses manifestes", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet final", sub: "Sécuriser, observer, assembler",
          lessons: [
            { num: "12", title: "Sécurité (RBAC), observabilité & projet final", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    graphql: {
      id: "graphql", dir: "graphql", title: "GraphQL : des API flexibles",
      glyph: "GQL", accent: "#d6398e", overview: "cours.html",
      related: [
        { course: "api", note: "GraphQL est une alternative au REST : compare les deux approches." },
        { course: "nodejs", note: "Le serveur GraphQL le plus courant tourne sur Node.js." },
        { course: "http", note: "GraphQL passe par HTTP : un seul endpoint, en POST." },
      ],
      modules: [
        {
          num: "01", title: "Les bases", sub: "Comprendre GraphQL, le schéma, les requêtes",
          lessons: [
            { num: "01", title: "REST vs GraphQL", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le schéma & les types", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Les requêtes (queries)", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Écrire & modifier", sub: "Mutations et résolveurs",
          lessons: [
            { num: "04", title: "Les mutations", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Les résolveurs (resolvers)", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Construire une API complète",
          lessons: [
            { num: "06", title: "Construire une API GraphQL", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "GraphQL avancé", sub: "Fragments, pagination, performance, sécurité",
          lessons: [
            { num: "07", title: "Fragments, variables et directives", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Pagination, connexions et erreurs", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Performance : le problème N+1 et DataLoader", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Sécurité et mise en production", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Assembler une API GraphQL de production",
          lessons: [
            { num: "11", title: "Projet — une API GraphQL de production", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    llm: {
      id: "llm", dir: "llm", title: "Développer avec l'IA & les LLM",
      glyph: "LLM", accent: "#1f9e8a", overview: "cours.html",
      related: [
        { course: "api", note: "Un LLM se consomme via une API web : les bases d'API aident." },
        { course: "python", note: "Python est le langage le plus courant pour l'IA." },
        { course: "nodejs", note: "Node.js est tout aussi adapté pour appeler un LLM." },
        { course: "ml", note: "Comprendre le ML éclaire ce qu'est — et n'est pas — un LLM." },
        { course: "neurones", note: "Un cran plus bas : ce qui rend un LLM possible. Des couches, des poids, une fonction d'activation — expliqués avec des nombres qu'on peut refaire à la main." },
      ],
      modules: [
        {
          num: "01", title: "Comprendre", sub: "Ce qu'est un LLM et comment le diriger",
          lessons: [
            { num: "01", title: "Comment marche un LLM", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Bien rédiger un prompt", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Construire", sub: "Appeler, structurer, augmenter",
          lessons: [
            { num: "03", title: "Appeler une API de LLM", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Structurer les sorties (JSON, tool use)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Le RAG (récupération augmentée)", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Agents & pratique", sub: "Agents et première app",
          lessons: [
            { num: "06", title: "Les agents (boucle d'outils)", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Construire une petite app IA", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Évaluer, sécuriser, produire, adapter",
          lessons: [
            { num: "08", title: "Évaluer un LLM", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Sécurité : injections de prompt", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Coût, latence et passage en production", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Adapter un modèle : prompt, RAG ou fine-tuning ?", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Le capstone de bout en bout",
          lessons: [
            { num: "12", title: "Projet final — un assistant documentaire", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    a11y: {
      id: "a11y", dir: "a11y", title: "Accessibilité web (a11y)",
      glyph: "a11y", accent: "#2aa37a", overview: "cours.html",
      related: [
        { course: "html", note: "L'accessibilité commence par un HTML sémantique solide." },
        { course: "css", note: "Contrastes, focus visible et responsive sont aussi affaire de CSS." },
        { course: "javascript", note: "Les composants interactifs accessibles s'appuient sur JS + ARIA." },
      ],
      modules: [
        {
          num: "01", title: "Comprendre", sub: "Pourquoi et pour qui, la sémantique", level: "intermediaire",
          lessons: [
            { num: "01", title: "Pourquoi l'accessibilité", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "HTML sémantique & structure de page", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Mettre en œuvre", sub: "Clavier, ARIA, contrastes", level: "intermediaire",
          lessons: [
            { num: "03", title: "Images, formulaires & navigation clavier", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "ARIA & composants interactifs", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Couleurs, contrastes & responsive", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Auditer et corriger", level: "intermediaire",
          lessons: [
            { num: "06", title: "Bilan d'étape — auditer & corriger une page", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "L'accessibilité en pratique", sub: "Lecteurs d'écran, focus clavier", level: "avance",
          lessons: [
            { num: "07", title: "Les lecteurs d'écran et l'arbre d'accessibilité", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Gérer le focus au clavier", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Aller plus loin", sub: "Contenu dynamique & médias", level: "avance",
          lessons: [
            { num: "09", title: "Régions live : annoncer les changements dynamiques", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Mouvement, animations & multimédia", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Maîtriser", sub: "Tableaux, formulaires, widgets & tests", level: "avance",
          lessons: [
            { num: "11", title: "Tableaux de données accessibles", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Formulaires accessibles : erreurs, groupes & aide", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Widgets ARIA au clavier : le clavier attendu", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Tester : outils d'audit & lecteurs d'écran", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Projet", sub: "Synthèse", level: "avance",
          lessons: [
            { num: "15", title: "Projet final : l'accessibilité dans un vrai projet", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },
    "perf-web": {
      id: "perf-web", dir: "perf-web", title: "Performance & SEO web",
      glyph: "Perf", accent: "#e0972a", overview: "cours.html",
      related: [
        { course: "http", note: "La performance web se joue beaucoup sur HTTP (cache, requêtes)." },
        { course: "html", note: "Un HTML propre et structuré aide la vitesse et le référencement." },
        { course: "css", note: "Le CSS critique et le rendu pèsent sur la vitesse perçue." },
        { course: "a11y", note: "Accessibilité et performance partagent beaucoup de bonnes pratiques." },
      ],
      modules: [
        {
          num: "01", title: "Performance", sub: "Mesurer et accélérer", level: "intermediaire",
          lessons: [
            { num: "01", title: "Les Web Vitals (LCP, CLS, INP)", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Optimiser le chargement", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "JavaScript & rendu", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "SEO", sub: "Être trouvé et compris", level: "intermediaire",
          lessons: [
            { num: "04", title: "SEO technique", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Contenu & données structurées", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Auditer et optimiser", level: "intermediaire",
          lessons: [
            { num: "06", title: "Auditer & optimiser un site", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Rendu, images/polices, cache, réseau & mesure", level: "avance",
          lessons: [
            { num: "07", title: "Le chemin critique du rendu", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Images et polices : alléger le plus lourd", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Le cache et le réseau : livrer vite", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Mesurer dans la durée : labo, terrain & budgets", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Maîtriser", sub: "Exécution fluide, workers, outillage & stratégies de rendu", level: "avance",
          lessons: [
            { num: "11", title: "Fluidité à l'exécution : 60 fps, jank et tâches longues", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Les Web Workers : libérer le fil principal", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Outiller la mesure : DevTools, Lighthouse & WebPageTest", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Stratégies de rendu : CSR, SSR, SSG & hydratation", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Diagnostiquer une page lente de bout en bout", level: "avance",
          lessons: [
            { num: "15", title: "Projet — diagnostiquer une page lente", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },
    cloud: {
      id: "cloud", dir: "cloud", title: "Cloud & déploiement (fondamentaux)",
      glyph: "Cloud", accent: "#e8821e", overview: "cours.html",
      related: [
        { course: "docker", note: "Le cloud héberge souvent des conteneurs : Docker est un socle utile." },
        { course: "kubernetes", note: "Beaucoup de fournisseurs proposent un Kubernetes géré." },
        { course: "cicd", note: "On déploie vers le cloud depuis un pipeline CI/CD." },
        { course: "distribue", note: "Les raisons derrière les objets du cloud : régions, zones et réplicas existent parce que le réseau tombe, et ce cours mesure exactement ce que ça implique." },
      ],
      modules: [
        {
          num: "01", title: "Concepts", sub: "Ce qu'est le cloud, où et comment",
          lessons: [
            { num: "01", title: "Qu'est-ce que le cloud (IaaS/PaaS/SaaS)", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Régions, disponibilité & réseau", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Stockage & bases gérées", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Déployer", sub: "Calcul, coûts, sécurité",
          lessons: [
            { num: "04", title: "Le calcul (VM, conteneurs, serverless)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Coûts & dimensionnement", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Sécurité & IAM", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Concevoir un déploiement",
          lessons: [
            { num: "07", title: "Concevoir un déploiement cloud", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Réseau, observabilité, résilience et architecture",
          lessons: [
            { num: "08", title: "Le réseau cloud (VPC)", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Observabilité & supervision", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Haute disponibilité & résilience", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Déployer une application conteneurisée", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Projet — architecturer selon le Well-Architected", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    iac: {
      id: "iac", dir: "iac", title: "Infrastructure as Code (Terraform)",
      glyph: "IaC", accent: "#7b42bc", overview: "cours.html",
      related: [
        { course: "cloud", note: "L'IaC décrit l'infrastructure cloud que tu as appris à concevoir." },
        { course: "docker", note: "On déploie souvent des images conteneurisées via l'IaC." },
        { course: "kubernetes", note: "Terraform provisionne aussi des clusters Kubernetes." },
        { course: "cicd", note: "L'IaC s'intègre au pipeline pour automatiser l'infrastructure." },
        { course: "data-eng", note: "Un pipeline de données vit sur une infrastructure — entrepôt, orchestrateur, stockage — qu'on décrit en code pour la rendre reproductible." },
      ],
      modules: [
        {
          num: "01", title: "Les bases", sub: "Décrire l'infra en code avec Terraform",
          lessons: [
            { num: "01", title: "Pourquoi l'Infrastructure as Code", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Terraform : providers & ressources", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Variables, state, plan/apply", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Structurer", sub: "Modules et environnements",
          lessons: [
            { num: "04", title: "Modules & réutilisation", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Environnements & bonnes pratiques", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Décrire une infra complète",
          lessons: [
            { num: "06", title: "Capstone — décrire une infra complète", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "IaC en production", sub: "State distant, boucles, cycle de vie, sécurité",
          lessons: [
            { num: "07", title: "Le state à distance et le travail en équipe", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Boucles et conditions : count, for_each et dynamic", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Le cycle de vie et les dépendances", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Sécurité, secrets et conformité", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Assembler une infra modulaire de bout en bout",
          lessons: [
            { num: "11", title: "Projet — une infrastructure modulaire de bout en bout", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    archi: {
      id: "archi", dir: "archi", title: "Architecture logicielle",
      glyph: "Arch", accent: "#5a7d9a", overview: "cours.html",
      related: [
        { course: "patterns", note: "Les design patterns sont des briques récurrentes de l'architecture." },
        { course: "api", note: "Concevoir une API propre est un cas d'architecture très concret." },
        { course: "tests", note: "Une bonne architecture se teste plus facilement." },
        { course: "nosql", note: "Le choix de la persistance fait partie des décisions d'architecture." },
        { course: "bdd", note: "Le schéma d'une base est une décision d'architecture à part entière : entités, normalisation, index, transactions engagent tout le système." },
        { course: "equipe", note: "Les décisions d'architecture se prennent et se documentent à plusieurs ; ce cours en traite la face humaine : tracer un choix, nommer et traiter la dette technique, se mettre d'accord." },
        { course: "distribue", note: "Découper en services transforme des appels de fonction en appels réseau. Le prix de ce changement y est chiffré, aller-retour par aller-retour." },
      ],
      modules: [
        {
          num: "01", title: "Fondations", sub: "Couches, responsabilités, dépendances",
          lessons: [
            { num: "01", title: "Qu'est-ce qu'une architecture logicielle", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Couches & séparation des responsabilités", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Couplage, cohésion & dépendances", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Styles", sub: "Du monolithe au DDD",
          lessons: [
            { num: "04", title: "Monolithe vs microservices", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Clean architecture & hexagonale", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Domain-Driven Design (léger)", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Concevoir une architecture",
          lessons: [
            { num: "07", title: "Capstone — concevoir l'architecture d'une app", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Architecture en pratique", sub: "Communication, événements, résilience, décisions & projet",
          lessons: [
            { num: "08", title: "Communication : synchrone vs asynchrone", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Architecture pilotée par les événements", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Résilience & tolérance aux pannes", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Documenter & décider : C4, ADR et compromis", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Projet : concevoir un système distribué de bout en bout", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    wasm: {
      id: "wasm", dir: "wasm", title: "WebAssembly",
      glyph: "Wasm", accent: "#654ff0", overview: "cours.html",
      related: [
        { course: "javascript", note: "WebAssembly s'utilise depuis JavaScript : on les fait dialoguer." },
        { course: "cpp", note: "Le C/C++ est un langage source classique pour produire du .wasm." },
        { course: "rust", note: "Rust a un excellent support de WebAssembly." },
        { course: "perf-web", note: "Wasm est un levier de performance pour le calcul lourd côté client." },
      ],
      modules: [
        {
          num: "01", title: "Comprendre", sub: "Ce qu'est Wasm et d'où il vient",
          lessons: [
            { num: "01", title: "Qu'est-ce que WebAssembly", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Du C/Rust au .wasm", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Charger & exécuter dans le navigateur", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Interopérer", sub: "JavaScript et Wasm ensemble",
          lessons: [
            { num: "04", title: "JS ↔ Wasm (mémoire, fonctions)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Cas d'usage & limites", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Appeler du Wasm depuis JS",
          lessons: [
            { num: "06", title: "La chaîne complète : un module Wasm appelé depuis JS", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Format, ponts, parallélisme, hors navigateur",
          lessons: [
            { num: "07", title: "L'anatomie d'un module : le format WAT", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Types riches avec wasm-bindgen", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Calculer sans bloquer : Web Worker", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Hors du navigateur : WASI & runtimes", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Assembler tout le cours",
          lessons: [
            { num: "11", title: "Projet : un studio d'image WebAssembly", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    linux: {
      id: "linux", dir: "linux", title: "Linux & administration système",
      glyph: "Lx", accent: "#6d8b3c", overview: "cours.html",
      related: [
        { course: "bash", note: "Linux s'administre au terminal : le shell est ton outil de tous les jours." },
        { course: "docker", note: "Les conteneurs sont des processus Linux isolés : comprendre l'un éclaire l'autre." },
        { course: "cloud", note: "La plupart des serveurs cloud tournent sous Linux." },
        { course: "securite", note: "Permissions, utilisateurs et SSH sont au cœur du durcissement d'un serveur." },
      ],
      modules: [
        {
          num: "01", title: "Le système", sub: "Fichiers, utilisateurs, processus",
          lessons: [
            { num: "01", title: "Qu'est-ce que Linux", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Système de fichiers & arborescence", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Utilisateurs, permissions & processus", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Administrer", sub: "Paquets, services, réseau",
          lessons: [
            { num: "04", title: "Paquets, services (systemd) & journaux", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Réseau, SSH & sécurité de base", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Mettre en service un serveur",
          lessons: [
            { num: "06", title: "Mettre en service un petit serveur", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Administration avancée", sub: "Automatiser, stocker, diagnostiquer",
          lessons: [
            { num: "07", title: "Automatiser : cron & timers systemd", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Le stockage : disques, partitions & montage", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Diagnostiquer : ressources, performance & dépannage", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Exploiter dans la durée", sub: "Sauvegarder, restaurer, projet final",
          lessons: [
            { num: "10", title: "Sauvegarder & restaurer : rsync, tar & la règle 3-2-1", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Capstone — administrer un serveur de bout en bout", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    reseaux: {
      id: "reseaux", dir: "reseaux", title: "Réseaux : comment marche Internet",
      glyph: "Net", accent: "#3a56b0", overview: "cours.html",
      related: [
        { course: "http", note: "HTTP est le protocole applicatif qui voyage sur ces réseaux." },
        { course: "linux", note: "Les serveurs qu'on relie tournent le plus souvent sous Linux." },
        { course: "securite", note: "TLS, ports et pare-feu sont au cœur de la sécurité réseau." },
        { course: "cloud", note: "Le cloud, c'est aussi du réseau : régions, adresses, routage." },
        { course: "distribue", note: "L'étage au-dessus : ce que ces paquets et ces connexions coûtent à un programme réparti sur plusieurs machines, chiffres à l'appui." },
        { course: "offensive", note: "Les mêmes objets — noms, adresses, ports, bannières — vus comme un inventaire de portes. La reconnaissance commence là, et ce cours en chiffre le rendement." },
        { course: "crypto", note: "La leçon 5 pose la poignée de main TLS et la leçon 11 les tunnels chiffrés, sans ouvrir ce qui les fait tenir. Ce cours-là écrit les primitives en entier : ce que chacune garantit, et où elle cède." },
      ],
      modules: [
        {
          num: "01", title: "Fondations", sub: "Couches, adresses, transport",
          lessons: [
            { num: "01", title: "Le modèle en couches", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "IP & le routage", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "TCP, UDP & les ports", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Les services du quotidien", sub: "DNS, HTTP, TLS",
          lessons: [
            { num: "04", title: "DNS : du nom à l'adresse", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "HTTP, TLS & le web côté réseau", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Suivre une requête",
          lessons: [
            { num: "06", title: "Capstone — tracer le voyage d'une requête", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Le réseau local en détail", sub: "Découpage, couche lien, Wi-Fi",
          lessons: [
            { num: "07", title: "Découper un réseau : sous-réseaux & CIDR", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Dans le réseau local : MAC, ARP & DHCP", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Le Wi-Fi : le réseau local, sans fil", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Frontières & accès distant", sub: "NAT, pare-feu, VPN",
          lessons: [
            { num: "10", title: "La frontière : NAT, pare-feu & ports ouverts", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "VPN & tunnels : rejoindre un réseau à distance", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    ux: {
      id: "ux", dir: "ux", title: "UX & design d'interface",
      glyph: "UX", accent: "#c75b9e", overview: "cours.html",
      related: [
        { course: "a11y", note: "Une bonne UX est accessible à tous : les deux vont de pair." },
        { course: "css", note: "Le design se met en œuvre en CSS : mise en page, couleurs, typographie." },
        { course: "html", note: "Une structure HTML claire est la base d'une interface compréhensible." },
        { course: "perf-web", note: "La vitesse fait partie de l'expérience : une page lente est une mauvaise UX." },
      ],
      modules: [
        {
          num: "01", title: "Penser l'expérience", sub: "UX vs UI, l'utilisateur",
          lessons: [
            { num: "01", title: "Qu'est-ce que l'UX (vs UI)", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Comprendre l'utilisateur", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Concevoir l'interface", sub: "Hiérarchie, couleur, interactions",
          lessons: [
            { num: "03", title: "Hiérarchie visuelle & mise en page", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Couleur, typographie & cohérence", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Interactions, retours & états", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Repenser un écran",
          lessons: [
            { num: "06", title: "Mener une refonte : méthode et justification", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Approfondir l'UX", sub: "Lois, structure, formulaires, recherche",
          lessons: [
            { num: "07", title: "Les lois & heuristiques de l'UX", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Architecture de l'information & navigation", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Concevoir des formulaires efficaces", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Recherche utilisateur & tests d'utilisabilité", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Concevoir de bout en bout",
          lessons: [
            { num: "11", title: "Projet — concevoir un écran de bout en bout", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    observabilite: {
      id: "observabilite", dir: "observabilite", title: "Observabilité & SRE",
      glyph: "Obs", accent: "#3a8fb0", overview: "cours.html",
      related: [
        { course: "cloud", note: "On observe surtout des applications déployées dans le cloud." },
        { course: "kubernetes", note: "Surveiller des conteneurs orchestrés demande de bons outils d'observabilité." },
        { course: "cicd", note: "Métriques et alertes complètent un pipeline de livraison continue." },
        { course: "securite", note: "Les journaux sont aussi essentiels pour détecter les incidents de sécurité." },
        { course: "data-eng", note: "Un pipeline de données se surveille comme un service : fraîcheur, volumétrie, taux d'échec, lignage. Les mêmes métriques et alertes s'y appliquent." },
        { course: "distribue", note: "Ce qu'il y a à voir : pannes partielles, appels sans réponse, horloges qui divergent. Ce cours nomme les phénomènes que les traces révèlent." },
      ],
      modules: [
        {
          num: "01", title: "Voir l'état du système", sub: "Logs, métriques, traces",
          lessons: [
            { num: "01", title: "Pourquoi l'observabilité", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les journaux (logs) structurés", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Métriques & tableaux de bord", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Réagir & fiabiliser", sub: "Tracing, alerting, SRE",
          lessons: [
            { num: "04", title: "Le tracing distribué", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Alerting, SLI/SLO & SRE", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Rendre une app observable",
          lessons: [
            { num: "06", title: "Rendre une app observable, en pratique", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "OTel, métriques avancées, logs à l'échelle, incidents",
          lessons: [
            { num: "07", title: "OpenTelemetry : instrumenter avec un standard ouvert", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Les métriques en profondeur : types & PromQL", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Les journaux à grande échelle", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Gérer l'incident : budget d'erreur, astreinte & post-mortem", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Instrumenter un service de bout en bout",
          lessons: [
            { num: "11", title: "Projet — instrumenter un service de bout en bout", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    os: {
      id: "os", dir: "os", title: "Systèmes d'exploitation : les fondations",
      glyph: "OS", accent: "#7a6f9c", overview: "cours.html",
      related: [
        { course: "algo", note: "Comprendre l'ordonnancement et la mémoire éclaire la complexité des algorithmes." },
        { course: "c", note: "Le C est le langage des systèmes : il manipule mémoire et appels système directement." },
        { course: "linux", note: "Linux est un système d'exploitation concret pour voir ces concepts à l'œuvre." },
        { course: "reseaux", note: "Les entrées/sorties réseau sont gérées par l'OS, comme les fichiers." },
      ],
      modules: [
        {
          num: "01", title: "Le cœur", sub: "Rôle, processus, ordonnancement",
          lessons: [
            { num: "01", title: "Le rôle d'un système d'exploitation", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Processus & threads", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "L'ordonnancement", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Les ressources", sub: "Mémoire, fichiers, entrées/sorties",
          lessons: [
            { num: "04", title: "La mémoire (virtuelle, pagination)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Fichiers, E/S & systèmes de fichiers", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pratique", sub: "Observer un programme",
          lessons: [
            { num: "06", title: "Analyser le comportement d'un programme", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Concurrence, IPC, noyau, virtualisation",
          lessons: [
            { num: "07", title: "La concurrence & la synchronisation", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "La communication entre processus (IPC)", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Le noyau : modes, interruptions & démarrage", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "La virtualisation & les conteneurs", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Exigences critiques", sub: "Temps réel, sécurité, tolérance aux pannes",
          lessons: [
            { num: "11", title: "L'ordonnancement temps réel", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "La sécurité du système d'exploitation", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Fiabilité et tolérance aux pannes", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Mettre tout en œuvre",
          lessons: [
            { num: "14", title: "Projet — diagnostiquer & optimiser un programme", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    compilation: {
      id: "compilation", dir: "compilation", title: "Compilation : du texte source au code exécuté",
      glyph: "cp", accent: "#7a5a1e", overview: "cours.html",
      related: [
        { course: "algo", note: "Un compilateur est une chaîne d'algorithmes sur des arbres : parcours récursifs, piles, tables. Ce cours-là en donne les briques ; celui-ci montre à quoi elles servent une fois assemblées." },
        { course: "regex", note: "L'analyse lexicale est le premier vrai métier des expressions régulières — et la leçon 3 explique précisément où elles s'arrêtent : équilibrer des parenthèses leur est impossible." },
        { course: "asm", note: "Le bout de la chaîne : ce que le générateur de code produit. Voir les instructions d'une machine réelle rend concret ce que « générer du code » veut dire." },
        { course: "c", note: "Le langage compilé de référence : compilation séparée, fichiers objets, édition de liens. Les messages d'erreur du C prennent tout leur sens une fois la chaîne connue." },
        { course: "python", note: "Python compile lui aussi, en bytecode, avant d'exécuter — la leçon 1 le démontre avec le module dis. Le cours Python donne le langage ; celui-ci montre son moteur." },
      ],
      modules: [
        {
          num: "01", title: "Ce qu'est compiler", sub: "interprété ou compilé, la chaîne, la grammaire", level: "avance",
          lessons: [
            { num: "01", title: "Compiler ou interpréter : deux façons de faire tourner du texte", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "La chaîne de compilation, étape par étape", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Pourquoi un langage a besoin d'une grammaire", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Analyse lexicale", sub: "du texte aux jetons, automates, espaces et commentaires", level: "avance",
          lessons: [
            { num: "04", title: "Du texte aux jetons", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Expressions régulières et automates", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Espaces, commentaires et erreurs lexicales", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Analyse syntaxique", sub: "grammaires, descente récursive, arbre de syntaxe", level: "avance",
          lessons: [
            { num: "07", title: "De la grammaire à l'analyseur : dériver et reconnaître", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "L'analyse par descente récursive", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Priorité, associativité et arbre de syntaxe abstraite", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Évaluer et générer", sub: "parcourir l'arbre, machine à pile, optimiser", level: "avance",
          lessons: [
            { num: "10", title: "Parcourir l'arbre pour l'exécuter", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Une machine à pile, et le code qui la nourrit", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Ce que compiler fait gagner, mesuré", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Le projet", sub: "un petit langage complet, du texte au résultat", level: "avance",
          lessons: [
            { num: "13", title: "Projet — Brindille, un langage de bout en bout", file: "lecon-13.html", status: "complet" },
          ],
        },
      ],
    },
    neurones: {
      id: "neurones", dir: "neurones", title: "Réseaux de neurones : de l'addition à l'apprentissage profond",
      glyph: "nn", accent: "#1c6822", overview: "cours.html",
      related: [
        { course: "ml", note: "Le cours qui s'arrête juste avant : régression, classification, arbres, pipelines. Il apprend à faire tourner un modèle ; celui-ci ouvre la boîte de la famille qu'il ne traite pas." },
        { course: "stats", note: "Un réseau ne devine rien : il minimise une erreur mesurée. Moyenne, variance, sur-ajustement, jeu de test — le vocabulaire du module 3 vient de là." },
        { course: "python", note: "Les réseaux s'écrivent en Python dans la vraie vie. Ici les exemples sont en JavaScript pour tourner dans la page, mais les idées se transposent ligne à ligne." },
        { course: "llm", note: "Ce que ce cours explique est exactement ce qui rend un LLM possible : des couches, des poids, une fonction d'activation. Le cours LLM part de là et monte d'un cran." },
        { course: "algo", note: "Une couche est une boucle sur des tableaux, un réseau une composition de fonctions. Les briques algorithmiques rendent le code des leçons évident plutôt que magique." },
        { course: "maths", note: "Matrices et dérivées, posées sans prérequis et exécutées dans la page — les deux objets dont l'apprentissage profond ne se passe pas." },
      ],
      modules: [
        {
          num: "01", title: "Du neurone au réseau", sub: "le neurone formel, les activations, les couches", level: "avance",
          lessons: [
            { num: "01", title: "Un neurone, c'est une addition et une décision", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Pourquoi il faut une fonction non linéaire", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Des couches, et ce qu'elles contiennent", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Apprendre", sub: "fonction de perte, descente de gradient, rétropropagation", level: "avance",
          lessons: [
            { num: "04", title: "Mesurer l'erreur : la fonction de perte", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Descendre la pente : le gradient", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "La rétropropagation, étape par étape", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Ce qui rate", sub: "surapprentissage, régularisation, gradients qui meurent", level: "avance",
          lessons: [
            { num: "07", title: "Surapprentissage : quand le réseau récite au lieu d'apprendre", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Régularisation et taux d'apprentissage", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Le gradient qui disparaît", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Les familles d'architectures", sub: "convolutifs pour l'image, attention pour les séquences", level: "avance",
          lessons: [
            { num: "10", title: "Convolutifs : regarder une image par morceaux", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Récurrents et attention : traiter une séquence", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Le projet", sub: "un réseau entraîné de bout en bout, à la main", level: "avance",
          lessons: [
            { num: "12", title: "Projet — un réseau qui apprend, du premier poids au dernier", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    offensive: {
      id: "offensive", dir: "offensive", title: "Sécurité offensive : comprendre l'attaque pour savoir défendre",
      glyph: "◎", accent: "#943f1a", overview: "cours.html",
      related: [
        { course: "securite", note: "Le cours jumeau, et le prérequis : il enseigne les défenses — validation des entrées, requêtes préparées, en-têtes, contrôle d'accès. Celui-ci enseigne ce contre quoi elles défendent. On y renvoie plutôt que de le répéter." },
        { course: "http", note: "Une attaque web est une requête HTTP comme une autre. Méthodes, en-têtes, cookies, codes de retour : ce cours les pose, celui-ci s'en sert." },
        { course: "reseaux", note: "La reconnaissance commence par le réseau : noms, adresses, ports, ce qu'un service annonce de lui-même. Ce cours explique les objets que la surface d'attaque recense." },
        { course: "equipe", note: "Un rapport de faille est d'abord un texte lu par quelqu'un d'autre. Revue, ton, reproductibilité : ce que ce cours enseigne sert directement à la divulgation." },
        { course: "crypto", note: "Les mots de passe, les jetons et les secrets de ce cours reposent tous sur des primitives cryptographiques. Le cours Cryptographie appliquée explique ce que chacune garantit — et ce qu'elle ne garantit pas." },
      ],
      modules: [
        {
          num: "01", title: "Penser comme un attaquant", sub: "cadre légal, surface d'attaque, chaînage et gravité", level: "avance",
          lessons: [
            { num: "01", title: "Ce qui sépare un test d'une intrusion", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "La surface d'attaque : tout ce qui accepte une entrée", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Enchaîner : l'arbre d'attaque et la note de gravité", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Les failles du web", sub: "injection, XSS, CSRF, contrôle d'accès", level: "avance",
          lessons: [
            { num: "04", title: "L'injection, vue du côté de celui qui la déclenche", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "XSS : exécuter du code dans le navigateur d'un autre", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Contrôle d'accès défaillant et requêtes forcées", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Authentification et secrets", sub: "mots de passe, sessions, jetons, fuites", level: "avance",
          lessons: [
            { num: "07", title: "Mots de passe : ce que coûte vraiment une attaque hors ligne", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Sessions et jetons : prendre une identité sans mot de passe", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Les secrets qui fuient : dépôts, journaux, sauvegardes", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Chaîne d'approvisionnement et outillage", sub: "dépendances, intégrité, limites de l'automatique", level: "avance",
          lessons: [
            { num: "10", title: "La dépendance comme porte d'entrée", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Ce qu'un outil automatique trouve, et ce qu'il ne trouvera jamais", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Le projet", sub: "un audit méthodique, de bout en bout", level: "avance",
          lessons: [
            { num: "12", title: "Projet : auditer une application fictive", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    crypto: {
      id: "crypto", dir: "crypto", title: "Cryptographie appliquée : ce que chaque outil garantit, et ce qu'il ne garantit pas",
      glyph: "⊕", accent: "#1d7a5f", overview: "cours.html",
      related: [
        { course: "securite", note: "La leçon 8 y distingue hacher, chiffrer et signer en quelques paragraphes, et répond à « lequel employer ». Ce cours répond à « pourquoi celui-là tient, et où il cède ». On y renvoie plutôt que de le répéter." },
        { course: "http", note: "HTTPS y est expliqué du point de vue du protocole : en-têtes, certificats, redirections. Ici, on ouvre les primitives qui le font tenir." },
        { course: "offensive", note: "Le point de vue de l'attaquant sur les mots de passe, les sessions et les jetons. Ce cours-ci donne les fondations que ces attaques exploitent." },
        { course: "reseaux", note: "Ce qui voyage sur un réseau, et qui écoute. Le chiffrement de transport ne se comprend qu'une fois le trajet d'un paquet posé." },
        { course: "maths", note: "L'arithmétique modulaire, les nombres premiers et le dénombrement des collisions : le socle sur lequel RSA et Diffie-Hellman sont construits." },
      ],
      modules: [
        {
          num: "01", title: "Les primitives", sub: "empreintes, chiffrement symétrique, chiffrement asymétrique", level: "avance",
          lessons: [
            { num: "01", title: "L’empreinte : à sens unique, et ce que cela ne veut pas dire", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le chiffrement symétrique : une clé, et deux garanties qu’on confond", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Deux clés au lieu d’une : ce que l’asymétrique permet, et ce qu’il coûte", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Les assembler", sub: "signature, échange de clés, certificats, TLS", level: "avance",
          lessons: [
            { num: "04", title: "Signer et authentifier : prouver l’origine", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "S’accorder sur un secret devant témoin", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Certificats et chaîne de confiance, jusqu’à TLS", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "En pratique", sub: "mots de passe, données au repos, gestion des clés", level: "avance",
          lessons: [
            { num: "07", title: "Stocker un mot de passe", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Chiffrer des données au repos", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Gérer des clés : les créer, les ranger, les remplacer", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Le projet", sub: "un coffre local, de bout en bout", level: "avance",
          lessons: [
            { num: "10", title: "Auditer l’usage de la cryptographie dans un projet", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Projet : un coffre de notes chiffré et vérifiable", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },
    distribue: {
      id: "distribue", dir: "distribue", title: "Systèmes distribués : quand le programme n'est plus sur une seule machine",
      glyph: "⇄", accent: "#2f4b7c", overview: "cours.html",
      related: [
        { course: "reseaux", note: "Ce que ce cours suppose connu : ce qu'est un paquet, une adresse, un port, une connexion TCP. Ici on ne redéfinit pas le réseau, on mesure ce qu'il coûte à un programme." },
        { course: "cloud", note: "Le cours qui donne les outils — régions, zones, services managés. Celui-ci donne les raisons : pourquoi ces objets existent, et ce qu'ils ne peuvent pas garantir." },
        { course: "observabilite", note: "On ne voit une panne partielle qu'à travers des traces et des métriques. Ce cours explique ce qu'il y a à voir, celui-là comment le regarder." },
        { course: "nosql", note: "ACID, BASE et le théorème CAP y sont posés du point de vue des bases. Ici, ils sont repris depuis le réseau qui les rend nécessaires." },
        { course: "archi", note: "Découper un système en services, c'est transformer des appels de fonction en appels réseau. Ce cours mesure ce que ce changement coûte." },
        { course: "http", note: "Chaque aller-retour HTTP est un aller-retour réseau : le module 1 chiffre ce que valent une poignée de main TCP et une poignée de main TLS en millisecondes." },
        { course: "maths", note: "Raisonner sur un graphe de machines et formuler une garantie en logique : les deux outils que ce cours emploie à chaque page." },
      ],
      modules: [
        {
          num: "01", title: "Pourquoi c'est difficile", sub: "les illusions du réseau, latence et débit, pannes partielles", level: "avance",
          lessons: [
            { num: "01", title: "Le réseau est fiable, et sept autres illusions", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Latence et débit : deux choses qu'on confond", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "La panne partielle : ni réponse, ni erreur", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "S'accorder", sub: "horloges, ordre des événements, CAP, cohérence", level: "avance",
          lessons: [
            { num: "04", title: "Le temps n'existe pas : horloges et dérive", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Ordonner sans horloge : causalité et compteurs", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Le théorème CAP, énoncé correctement", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Répliquer et partitionner", sub: "copies, partitionnement, hachage cohérent, quorum", level: "avance",
          lessons: [
            { num: "07", title: "Répliquer : plusieurs copies, un seul état", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Partitionner : découper les données", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Le quorum : décider à plusieurs", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "En pratique", sub: "idempotence, reprise, files de messages", level: "avance",
          lessons: [
            { num: "10", title: "Idempotence : réessayer sans dégât", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Files de messages et livraison « au moins une fois »", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Le projet", sub: "un magasin de clés-valeurs répliqué, de bout en bout", level: "avance",
          lessons: [
            { num: "12", title: "Projet — un magasin répliqué qui survit à une partition", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },
    javascript: {
      id: "javascript", dir: "js", title: "JavaScript : des fondations au niveau expert",
      glyph: "JS", accent: "#caa12f", overview: "cours.html",
      related: [
        { course: "algo", note: "Mets tes bases au service de la résolution de problèmes : algorithmes & structures de données." },
        { course: "html", note: "Le HTML structure les pages que ton code manipule." },
        { course: "react", note: "Passe aux interfaces à composants une fois les bases acquises." },
      ],
      modules: [
        {
          num: "01", title: "Fondations du langage", sub: "Exécuter du JS, variables, types et opérateurs", level: "debutant",
          lessons: [
            { num: "01", title: "Prendre en main JavaScript", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et valeurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Opérateurs et expressions", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Logique et structures", sub: "Décisions, répétitions et fonctions", level: "debutant",
          lessons: [
            { num: "04", title: "Prendre des décisions (conditions)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Répéter (boucles & itération)", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Factoriser (fonctions)", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Données structurées", sub: "Tableaux, méthodes fonctionnelles et objets", level: "debutant",
          lessons: [
            { num: "07", title: "Les tableaux (listes ordonnées)", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Transformer les tableaux (map/filter/reduce)", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Les objets (données nommées)", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "JavaScript dans le navigateur", sub: "DOM, événements, asynchrone et persistance", level: "debutant",
          lessons: [
            { num: "10", title: "Le DOM : sélectionner et modifier", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Réagir : les événements", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Asynchrone & persistance (1re app)", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Données du langage", sub: "Chaînes, nombres et dates", level: "debutant",
          lessons: [
            { num: "13", title: "Les chaînes de caractères en profondeur", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Les nombres et l'objet Math", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Les dates", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Fonctions avancées", sub: "Portée, closures, this et ordre supérieur", level: "intermediaire",
          lessons: [
            { num: "16", title: "Portée, hoisting et fermetures (closures)", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "this, call, apply et bind", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Fonctions d'ordre supérieur & récursion", file: "lecon-18.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Programmation orientée objet", sub: "Prototypes, classes, héritage", level: "intermediaire",
          lessons: [
            { num: "19", title: "Objets avancés et prototypes", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Les classes", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Héritage et encapsulation", file: "lecon-21.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "Asynchrone & réseau approfondis", sub: "Event loop, promesses, fetch & API", level: "intermediaire",
          lessons: [
            { num: "22", title: "La boucle d'événements en profondeur", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Les promesses avancées", file: "lecon-23.html", status: "complet" },
            { num: "24", title: "fetch et les API REST", file: "lecon-24.html", status: "complet" },
          ],
        },
        {
          num: "09", title: "Robustesse & outillage", sub: "Erreurs, modules ES, regex, Map/Set", level: "intermediaire",
          lessons: [
            { num: "25", title: "La gestion des erreurs", file: "lecon-25.html", status: "complet" },
            { num: "26", title: "Les modules ES (import / export)", file: "lecon-26.html", status: "complet" },
            { num: "27", title: "Les expressions régulières (regex)", file: "lecon-27.html", status: "complet" },
            { num: "28", title: "Map, Set et structures de données", file: "lecon-28.html", status: "complet" },
          ],
        },
        {
          num: "10", title: "Aller plus loin & projet final", sub: "Générateurs, débogage, assemblage", level: "intermediaire",
          lessons: [
            { num: "29", title: "Itérateurs, générateurs et immutabilité", file: "lecon-29.html", status: "complet" },
            { num: "30", title: "Déboguer et tester son code", file: "lecon-30.html", status: "complet" },
            { num: "31", title: "Projet final : assembler l'application", file: "lecon-31.html", status: "complet" },
          ],
        },
        {
          num: "11", title: "Compléments : le navigateur en pratique", sub: "Stockage, formulaires, planification", level: "intermediaire",
          lessons: [
            { num: "32", title: "Le stockage côté navigateur", file: "lecon-32.html", status: "complet" },
            { num: "33", title: "Les formulaires et FormData", file: "lecon-33.html", status: "complet" },
            { num: "34", title: "Planification, animation et fluidité", file: "lecon-34.html", status: "complet" },
          ],
        },
        {
          num: "12", title: "JavaScript en pratique pro", sub: "Composants, état, outils", level: "intermediaire",
          lessons: [
            { num: "35", title: "Composants réutilisables et DOM efficace", file: "lecon-35.html", status: "complet" },
            { num: "36", title: "Consommer des API et gérer l'état", file: "lecon-36.html", status: "complet" },
            { num: "37", title: "Outils, qualité et déploiement d'un projet", file: "lecon-37.html", status: "complet" },
          ],
        },
        {
          num: "13", title: "Pour aller plus loin", sub: "Métaprogrammation, i18n, parallélisme, itérateurs et stockage", level: "intermediaire",
          lessons: [
            { num: "38", title: "Métaprogrammation : Proxy et Reflect", file: "lecon-38.html", status: "complet" },
            { num: "39", title: "Internationalisation : l'API Intl", file: "lecon-39.html", status: "complet" },
            { num: "40", title: "Web Workers : calculer sans figer l'interface", file: "lecon-40.html", status: "complet" },
            { num: "41", title: "Générateurs et itérateurs", file: "lecon-41.html", status: "complet" },
            { num: "42", title: "Stocker des données côté client", file: "lecon-42.html", status: "complet" },
          ],
        },
        {
          num: "14", title: "Le langage en profondeur", sub: "Symboles, générateurs, métaprogrammation", level: "expert",
          lessons: [
            { num: "43", title: "Symboles et propriétés cachées", file: "lecon-43.html", status: "complet" },
            { num: "44", title: "Itérateurs et générateurs avancés", file: "lecon-44.html", status: "complet" },
            { num: "45", title: "Proxy et Reflect (métaprogrammation)", file: "lecon-45.html", status: "complet" },
          ],
        },
        {
          num: "15", title: "Asynchrone expert", sub: "Concurrence, annulation, flux", level: "expert",
          lessons: [
            { num: "46", title: "Maîtriser la boucle d'événements et la concurrence", file: "lecon-46.html", status: "complet" },
            { num: "47", title: "Annulation, délais et limites (AbortController)", file: "lecon-47.html", status: "complet" },
            { num: "48", title: "Flux de données asynchrones (async iterators)", file: "lecon-48.html", status: "complet" },
          ],
        },
        {
          num: "16", title: "Conception & qualité", sub: "Patterns, fonctionnel, mémoire", level: "expert",
          lessons: [
            { num: "49", title: "Patterns de conception en JavaScript", file: "lecon-49.html", status: "complet" },
            { num: "50", title: "Programmation fonctionnelle avancée", file: "lecon-50.html", status: "complet" },
            { num: "51", title: "Mémoire : références faibles et fuites", file: "lecon-51.html", status: "complet" },
          ],
        },
        {
          num: "17", title: "Outils du langage", sub: "Regex avancées, i18n, et après", level: "expert",
          lessons: [
            { num: "52", title: "Expressions régulières avancées", file: "lecon-52.html", status: "complet" },
            { num: "53", title: "Internationalisation avec Intl", file: "lecon-53.html", status: "complet" },
            { num: "54", title: "Décorateurs et synthèse expert", file: "lecon-54.html", status: "complet" },
          ],
        },
        {
          num: "18", title: "La plateforme bas niveau & les flux", sub: "Binaire, Web Workers, Streams", level: "expert",
          lessons: [
            { num: "55", title: "Données binaires : ArrayBuffer, TypedArray, DataView", file: "lecon-55.html", status: "complet" },
            { num: "56", title: "Web Workers et parallélisme", file: "lecon-56.html", status: "complet" },
            { num: "57", title: "La Streams API", file: "lecon-57.html", status: "complet" },
          ],
        },
        {
          num: "19", title: "Aux frontières de JavaScript", sub: "Moteur V8, sécurité, runtimes & WASM", level: "expert",
          lessons: [
            { num: "58", title: "Le moteur V8 et la performance fine", file: "lecon-58.html", status: "complet" },
            { num: "59", title: "La sécurité côté client", file: "lecon-59.html", status: "complet" },
            { num: "60", title: "Au-delà du navigateur : runtimes et WebAssembly", file: "lecon-60.html", status: "complet" },
          ],
        },
        {
          num: "20", title: "Pour aller plus loin", sub: "Modules, observation, erreurs, messages & synthèse", level: "expert",
          lessons: [
            { num: "61", title: "Les modules ES en profondeur", file: "lecon-61.html", status: "complet" },
            { num: "62", title: "Observer le navigateur : les Observer APIs", file: "lecon-62.html", status: "complet" },
            { num: "63", title: "La gestion professionnelle des erreurs", file: "lecon-63.html", status: "complet" },
            { num: "64", title: "Communiquer entre contextes", file: "lecon-64.html", status: "complet" },
            { num: "65", title: "Projet de synthèse : un store réactif", file: "lecon-65.html", status: "complet" },
          ],
        },
      ],
    },


    algo: {
      id: "algo", dir: "algo", title: "Algorithmes & structures de données en JS",
      glyph: "O(n)", accent: "#6a4fb0", overview: "cours.html",
      related: [
        { course: "javascript", note: "Les bases JS indispensables avant de plonger dans les algorithmes." },
        { course: "compilation", note: "Un compilateur est le plus bel assemblage de ces algorithmes : arbres, piles, tables et parcours récursifs y travaillent ensemble sur un vrai problème." },
        { course: "neurones", note: "Une couche de neurones n'est qu'une boucle sur des tableaux, un réseau qu'une composition de fonctions : les briques d'ici, appliquées ailleurs." },
        { course: "maths", note: "La complexité, les logarithmes et les matrices d'adjacence viennent de là. Le cours de mathématiques les pose calmement, chacun avec le programme qui le mesure." },
      ],
      modules: [
        {
          num: "01", title: "Penser algorithmes", sub: "Complexité, récursion, recherche", level: "intermediaire",
          lessons: [
            { num: "01", title: "La complexité algorithmique (Big O)", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "La récursion en profondeur", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Rechercher : linéaire et binaire", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Trier", sub: "Des tris simples aux tris efficaces", level: "intermediaire",
          lessons: [
            { num: "04", title: "Les tris élémentaires", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Le tri fusion (merge sort)", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Tri rapide et tri par tas", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Structures linéaires", sub: "Listes, piles, files, hachage", level: "intermediaire",
          lessons: [
            { num: "07", title: "Les listes chaînées", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Piles et files", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Les tables de hachage", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Structures hiérarchiques & graphes", sub: "Arbres, tas, graphes", level: "intermediaire",
          lessons: [
            { num: "10", title: "Arbres binaires et arbres de recherche", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Tas et file de priorité", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Les graphes : représentation et parcours", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Techniques de conception", sub: "Glouton, programmation dynamique, patterns", level: "expert",
          lessons: [
            { num: "13", title: "Les algorithmes gloutons (greedy)", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "La programmation dynamique", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Patterns d'entretien & synthèse", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Graphes avancés & techniques", sub: "Dijkstra, union-find, backtracking, fenêtre, tries/bits", level: "expert",
          lessons: [
            { num: "16", title: "Graphes pondérés et plus courts chemins", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Union-Find et arbres couvrants minimaux", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Le backtracking (retour sur trace)", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Deux pointeurs et fenêtre glissante", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Tries et manipulation de bits", file: "lecon-20.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Sujets avancés", sub: "Chaînes, complexité/NP, randomisé", level: "expert",
          lessons: [
            { num: "21", title: "Algorithmes sur les chaînes", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Complexité avancée et problèmes difficiles", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Algorithmes randomisés et probabilistes", file: "lecon-23.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "Algorithmes : aller plus loin", sub: "Requêtes d'intervalle, arbres équilibrés, flots, cache, projet", level: "expert",
          lessons: [
            { num: "24", title: "Arbres de segments et arbres de Fenwick", file: "lecon-24.html", status: "complet" },
            { num: "25", title: "Arbres auto-équilibrés (AVL)", file: "lecon-25.html", status: "complet" },
            { num: "26", title: "Les flots maximaux", file: "lecon-26.html", status: "complet" },
            { num: "27", title: "Un cache LRU", file: "lecon-27.html", status: "complet" },
            { num: "28", title: "Projet de synthèse : choisir et combiner", file: "lecon-28.html", status: "complet" },
          ],
        },
      ],
    },

    "projets-js": {
      id: "projets-js", dir: "projets-js", title: "Projets JavaScript : apprendre en construisant",
      glyph: "App", accent: "#2f9e74", overview: "cours.html",
      related: [
        { course: "javascript", note: "Ces projets supposent les bases du cours confirmé (fonctions, tableaux, DOM)." },
      ],
      modules: [
        {
          num: "01", title: "Calculatrice & convertisseur", sub: "Logique pure, puis interface", level: "intermediaire",
          lessons: [
            { num: "01", title: "La logique de la calculatrice", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "L'interface de la calculatrice", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Quiz interactif", sub: "Moteur de quiz et affichage", level: "intermediaire",
          lessons: [
            { num: "03", title: "Le moteur du quiz", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "L'affichage du quiz", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Gestionnaire de budget", sub: "Modèle de données et interface", level: "intermediaire",
          lessons: [
            { num: "05", title: "Le modèle de budget", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "L'interface du budget", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Générateur de mot de passe", sub: "Génération sûre et outil complet", level: "intermediaire",
          lessons: [
            { num: "07", title: "La génération du mot de passe", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "L'outil complet", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Jeu du morpion", sub: "Logique du jeu et plateau jouable", level: "intermediaire",
          lessons: [
            { num: "09", title: "La logique du morpion", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Le jeu jouable", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Minuteur Pomodoro", sub: "Machine à états et minuteur complet", level: "intermediaire",
          lessons: [
            { num: "11", title: "La logique du minuteur", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Le Pomodoro complet", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Application météo (API)", sub: "Données d'API puis interface", level: "expert",
          lessons: [
            { num: "13", title: "Traiter les données d'une API météo", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "L'interface météo : fetch et affichage", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "Jeu du serpent (canvas)", sub: "Logique de jeu puis rendu animé", level: "expert",
          lessons: [
            { num: "15", title: "La logique du serpent", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Le rendu sur canvas et la boucle de jeu", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "09", title: "Projets bonus : les API du navigateur", sub: "Dessin, audio, glisser-déposer", level: "expert",
          lessons: [
            { num: "17", title: "Un éditeur de dessin avec Canvas", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Un visualiseur audio avec Web Audio", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Un tableau Kanban avec glisser-déposer", file: "lecon-19.html", status: "complet" },
          ],
        },
        {
          num: "10", title: "Jeu du pendu", sub: "Logique pure, puis interface", level: "expert",
          lessons: [
            { num: "20", title: "La logique du pendu", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "L'interface du pendu", file: "lecon-21.html", status: "complet" },
          ],
        },
        {
          num: "11", title: "Encore des projets", sub: "Un projet complet par leçon", level: "expert",
          lessons: [
            { num: "22", title: "Un jeu de Memory (paires)", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Une liste de tâches filtrable", file: "lecon-23.html", status: "complet" },
          ],
        },
        {
          num: "12", title: "Projet final", sub: "Assembler la méthode de bout en bout", level: "expert",
          lessons: [
            { num: "24", title: "Projet final — un suivi d'habitudes", file: "lecon-24.html", status: "complet" },
          ],
        },
      ],
    },

    python: {
      id: "python", dir: "python", title: "Python : des fondations au niveau expert",
      glyph: "Py", accent: "#3b7dbf", overview: "cours.html",
      related: [
        { course: "sql", note: "Fais parler tes données en combinant Python et SQL." },
        { course: "git", note: "Versionne tes scripts dès le premier jour." },
        { course: "javascript", note: "Compare les deux langages : beaucoup de concepts se recoupent." },
        { course: "pandas", note: "La bibliothèque reine pour manipuler des données tabulaires en Python." },
        { course: "compilation", note: "Python compile en bytecode avant d'exécuter : le cours le démontre avec le module dis, et explique la machine qui exécute ce bytecode." },
        { course: "neurones", note: "Le domaine où Python règne sans partage. Les exemples y sont en JavaScript pour tourner dans la page, mais la traduction en Python est immédiate." },
      ],
      modules: [
        {
          num: "01", title: "Fondations", sub: "Variables, types, opérateurs", level: "debutant",
          lessons: [
            { num: "01", title: "Premiers pas en Python", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables et types", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Opérateurs et expressions", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Logique & flux", sub: "Conditions, boucles, fonctions", level: "debutant",
          lessons: [
            { num: "04", title: "Les conditions", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Les boucles", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Les fonctions", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Données structurées", sub: "Listes, dicts, chaînes, compréhensions", level: "debutant",
          lessons: [
            { num: "07", title: "Listes et tuples", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Dictionnaires et ensembles", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Les chaînes de caractères", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Les compréhensions", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Programmation pratique", sub: "Modules, fichiers, objets", level: "intermediaire",
          lessons: [
            { num: "11", title: "Modules et bibliothèque standard", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Fichiers et exceptions", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "La programmation orientée objet", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Vers le confirmé", sub: "Générateurs, style & qualité", level: "intermediaire",
          lessons: [
            { num: "14", title: "Itérateurs, générateurs & style fonctionnel", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Bonnes pratiques & synthèse", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Compléments essentiels", sub: "Regex et dates", level: "intermediaire",
          lessons: [
            { num: "16", title: "Les expressions régulières (module re)", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Dates, heures et durées (datetime)", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Python en pratique", sub: "Écosystème, outils, qualité", level: "intermediaire",
          lessons: [
            { num: "18", title: "Environnements virtuels et écosystème (pip)", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Outils du quotidien : CLI, logging, pathlib", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Qualité, tests et distribution", file: "lecon-20.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "Données & calcul scientifique", sub: "NumPy, pandas, visualisation", level: "intermediaire",
          lessons: [
            { num: "21", title: "NumPy : tableaux et calcul vectoriel", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "pandas : analyser des données en tableaux", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Visualiser avec matplotlib", file: "lecon-23.html", status: "complet" },
          ],
        },
        {
          num: "09", title: "Pour aller plus loin", sub: "API web, bases de données, concurrence, outils et projet", level: "intermediaire",
          lessons: [
            { num: "24", title: "Consommer une API web : HTTP et JSON", file: "lecon-24.html", status: "complet" },
            { num: "25", title: "Stocker des données avec SQLite", file: "lecon-25.html", status: "complet" },
            { num: "26", title: "La concurrence : threads, processus et asyncio", file: "lecon-26.html", status: "complet" },
            { num: "27", title: "La boîte à outils : collections, itertools, functools", file: "lecon-27.html", status: "complet" },
            { num: "28", title: "Projet : automatiser une tâche (capstone)", file: "lecon-28.html", status: "complet" },
          ],
        },
        {
          num: "10", title: "Fonctions & objets avancés", sub: "Décorateurs, data model, générateurs", level: "expert",
          lessons: [
            { num: "29", title: "Les décorateurs", file: "lecon-29.html", status: "complet" },
            { num: "30", title: "Le modèle de données : méthodes spéciales & descripteurs", file: "lecon-30.html", status: "complet" },
            { num: "31", title: "Générateurs avancés, itérateurs & coroutines", file: "lecon-31.html", status: "complet" },
          ],
        },
        {
          num: "11", title: "Typage & données structurées", sub: "typing, dataclasses, contextes", level: "expert",
          lessons: [
            { num: "32", title: "Le typage statique (typing & mypy)", file: "lecon-32.html", status: "complet" },
            { num: "33", title: "Dataclasses, Enum & structures de données", file: "lecon-33.html", status: "complet" },
            { num: "34", title: "Gestionnaires de contexte & contextlib", file: "lecon-34.html", status: "complet" },
          ],
        },
        {
          num: "12", title: "Asynchrone & concurrence", sub: "asyncio, threads, fonctionnel", level: "expert",
          lessons: [
            { num: "35", title: "Asynchrone avec async/await et asyncio", file: "lecon-35.html", status: "complet" },
            { num: "36", title: "Threads, processus et le GIL", file: "lecon-36.html", status: "complet" },
            { num: "37", title: "Programmation fonctionnelle (functools & itertools)", file: "lecon-37.html", status: "complet" },
          ],
        },
        {
          num: "13", title: "Robustesse, performance & métaprogrammation", sub: "Tests, perf, métaprog", level: "expert",
          lessons: [
            { num: "38", title: "Tests et qualité (pytest)", file: "lecon-38.html", status: "complet" },
            { num: "39", title: "Performance et profilage", file: "lecon-39.html", status: "complet" },
            { num: "40", title: "Métaprogrammation, packaging & synthèse", file: "lecon-40.html", status: "complet" },
          ],
        },
        {
          num: "14", title: "Au-delà de Python pur", sub: "Regex avancées, code natif", level: "expert",
          lessons: [
            { num: "41", title: "Expressions régulières avancées", file: "lecon-41.html", status: "complet" },
            { num: "42", title: "Interfacer Python avec le code natif", file: "lecon-42.html", status: "complet" },
          ],
        },
        {
          num: "15", title: "Python à l'échelle", sub: "Patterns, concurrence, production", level: "expert",
          lessons: [
            { num: "43", title: "Patterns et architecture pythonique", file: "lecon-43.html", status: "complet" },
            { num: "44", title: "Concurrence à grande échelle et le no-GIL", file: "lecon-44.html", status: "complet" },
            { num: "45", title: "Python en production", file: "lecon-45.html", status: "complet" },
          ],
        },
        {
          num: "16", title: "Pour aller plus loin", sub: "Mémoire, journalisation, sérialisation", level: "expert",
          lessons: [
            { num: "46", title: "La gestion de la mémoire en CPython", file: "lecon-46.html", status: "complet" },
            { num: "47", title: "Journalisation avec le module logging", file: "lecon-47.html", status: "complet" },
            { num: "48", title: "Sérialisation : pickle, JSON et binaire", file: "lecon-48.html", status: "complet" },
          ],
        },
        {
          num: "17", title: "Étendre & assembler", sub: "Système d'import, plugins et projet de synthèse", level: "expert",
          lessons: [
            { num: "49", title: "Le système d'import et les plugins", file: "lecon-49.html", status: "complet" },
            { num: "50", title: "Projet de synthèse : concevoir un module professionnel", file: "lecon-50.html", status: "complet" },
          ],
        },
      ],
    },


    html: {
      id: "html", dir: "html", title: "HTML : des fondations au niveau expert",
      glyph: "<>", accent: "#d9663d", overview: "cours.html",
      related: [
        { course: "css", note: "Une fois la structure posée, mets-la en forme avec CSS." },
        { course: "javascript", note: "Rends tes pages interactives avec JavaScript." },
      ],
      modules: [
        {
          num: "01", title: "Les fondations", sub: "Structure, texte, liens, images", level: "debutant",
          lessons: [
            { num: "01", title: "Structurer une page en HTML", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le texte : titres, paragraphes, listes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Liens et navigation", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Images et médias visuels", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Contenu riche", sub: "Tableaux, médias, contenu intégré", level: "debutant",
          lessons: [
            { num: "05", title: "Tableaux de données", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Audio et vidéo", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Contenu intégré (iframe, SVG)", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Les formulaires", sub: "Saisir et envoyer des données", level: "debutant",
          lessons: [
            { num: "08", title: "Les formulaires : structure et envoi", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Les champs de saisie", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "La validation native des formulaires", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "La sémantique", sub: "Donner du sens au contenu", level: "intermediaire",
          lessons: [
            { num: "11", title: "Les balises sémantiques de structure", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "La sémantique du texte", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Accessibilité, métadonnées & qualité", sub: "Pour tous, et bien référencé", level: "intermediaire",
          lessons: [
            { num: "13", title: "L'accessibilité (a11y, ARIA)", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Métadonnées, SEO et partage", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Bonnes pratiques, validation & structure", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Compléments : images & graphiques", sub: "Images responsives, canvas, SVG", level: "intermediaire",
          lessons: [
            { num: "16", title: "Images responsives et formats modernes", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Canvas, SVG et éléments graphiques", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "HTML appliqué", sub: "Formulaires, médias accessibles, emails", level: "intermediaire",
          lessons: [
            { num: "18", title: "Formulaires avancés et expérience utilisateur", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Tableaux complexes, médias et contenu intégré", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Les emails HTML et les modèles contraints", file: "lecon-20.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "Pour aller plus loin", sub: "Encodage, composants natifs, données structurées", level: "intermediaire",
          lessons: [
            { num: "21", title: "Les entités et l'encodage des caractères", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Composants interactifs natifs (details, dialog)", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Données structurées : Schema.org et JSON-LD", file: "lecon-23.html", status: "complet" },
            { num: "24", title: "Composants réutilisables : template et Web Components", file: "lecon-24.html", status: "complet" },
            { num: "25", title: "Performance de chargement : livrer une page rapide", file: "lecon-25.html", status: "complet" },
          ],
        },
        {
          num: "09", title: "Éléments interactifs natifs", sub: "details, dialog, popover", level: "expert",
          lessons: [
            { num: "26", title: "Divulgation progressive : details et summary", file: "lecon-26.html", status: "complet" },
            { num: "27", title: "La modale native : l'élément dialog", file: "lecon-27.html", status: "complet" },
            { num: "28", title: "L'API Popover et le menu", file: "lecon-28.html", status: "complet" },
          ],
        },
        {
          num: "10", title: "Web Components", sub: "Composants HTML réutilisables", level: "expert",
          lessons: [
            { num: "29", title: "template et slot", file: "lecon-29.html", status: "complet" },
            { num: "30", title: "Les custom elements", file: "lecon-30.html", status: "complet" },
            { num: "31", title: "Le Shadow DOM", file: "lecon-31.html", status: "complet" },
          ],
        },
        {
          num: "11", title: "Accessibilité experte", sub: "ARIA, live, focus", level: "expert",
          lessons: [
            { num: "32", title: "Les patterns ARIA", file: "lecon-32.html", status: "complet" },
            { num: "33", title: "Régions live, focus et formulaires accessibles", file: "lecon-33.html", status: "complet" },
          ],
        },
        {
          num: "12", title: "Métadonnées, données structurées & performance", sub: "schema.org, PWA, perf", level: "expert",
          lessons: [
            { num: "34", title: "Les données structurées (schema.org)", file: "lecon-34.html", status: "complet" },
            { num: "35", title: "Métadonnées avancées & PWA", file: "lecon-35.html", status: "complet" },
            { num: "36", title: "Performance et attributs de plateforme", file: "lecon-36.html", status: "complet" },
          ],
        },
        {
          num: "13", title: "Aller plus loin", sub: "i18n et sous le capot", level: "expert",
          lessons: [
            { num: "37", title: "Internationalisation & sous le capot du HTML", file: "lecon-37.html", status: "complet" },
          ],
        },
        {
          num: "14", title: "Interactions & sécurité", sub: "Drag & drop, History, CSP/SRI", level: "expert",
          lessons: [
            { num: "38", title: "Glisser-déposer et l'API History", file: "lecon-38.html", status: "complet" },
            { num: "39", title: "Sécurité côté client (CSP, SRI, sandbox)", file: "lecon-39.html", status: "complet" },
          ],
        },
        {
          num: "15", title: "La plateforme web en profondeur", sub: "Observers, API modernes, Service Workers", level: "expert",
          lessons: [
            { num: "40", title: "Les Observers et le rendu réactif", file: "lecon-40.html", status: "complet" },
            { num: "41", title: "Les API modernes du navigateur", file: "lecon-41.html", status: "complet" },
            { num: "42", title: "Service Workers et l'offline avancé", file: "lecon-42.html", status: "complet" },
          ],
        },
        {
          num: "16", title: "Le HTML avancé en pratique", sub: "Formulaires, canvas, édition, composants", level: "expert",
          lessons: [
            { num: "43", title: "La validation de formulaire sur mesure", file: "lecon-43.html", status: "complet" },
            { num: "44", title: "Dessiner avec l'élément canvas", file: "lecon-44.html", status: "complet" },
            { num: "45", title: "Éditer dans la page : contenteditable et Selection", file: "lecon-45.html", status: "complet" },
            { num: "46", title: "Declarative Shadow DOM et le rendu serveur", file: "lecon-46.html", status: "complet" },
            { num: "47", title: "Capstone : un Web Component accessible", file: "lecon-47.html", status: "complet" },
          ],
        },
      ],
    },

    css: {
      id: "css", dir: "css", title: "CSS : des fondations au niveau expert",
      glyph: "{ }", accent: "#3a76c2", overview: "cours.html",
      related: [
        { course: "html", note: "Apprends d'abord à structurer ta page en HTML, puis relie-la au CSS." },
        { course: "javascript", note: "Anime et pilote tes styles depuis JavaScript." },
      ],
      modules: [
        {
          num: "01", title: "Fondations", sub: "Sélecteurs, cascade, couleurs, unités", level: "debutant",
          lessons: [
            { num: "01", title: "Premiers pas en CSS", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les sélecteurs en profondeur", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Cascade, spécificité et héritage", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Couleurs et unités", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le texte et la boîte", sub: "Modèle de boîte, typographie, décors", level: "debutant",
          lessons: [
            { num: "05", title: "Le modèle de boîte", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "La typographie", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Arrière-plans, bordures et ombres", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "La mise en page", sub: "Flux, Flexbox, Grid", level: "debutant",
          lessons: [
            { num: "08", title: "Le flux, display et position", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Flexbox", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "CSS Grid", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Responsive & dynamique", sub: "Media queries, animations, variables", level: "intermediaire",
          lessons: [
            { num: "11", title: "Le responsive (media queries)", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Transitions et animations", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Les variables CSS et calc()", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Organisation & qualité", sub: "Architecture et bonnes pratiques", level: "intermediaire",
          lessons: [
            { num: "14", title: "Organiser son CSS (méthodologies)", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Bonnes pratiques & synthèse", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Compléments : colonnes & impression", sub: "Multi-colonnes, impression, compteurs", level: "intermediaire",
          lessons: [
            { num: "16", title: "La mise en page multi-colonnes", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Impression et compteurs CSS", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "CSS dans la vraie vie", sub: "Composants, layouts, qualité", level: "intermediaire",
          lessons: [
            { num: "18", title: "Construire des composants d'interface", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Mises en page complètes et robustes", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Performance, débogage et qualité CSS", file: "lecon-20.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "CSS : aller plus loin", sub: "Pseudo-éléments, unités fluides, transformations, filtres, défilement", level: "intermediaire",
          lessons: [
            { num: "21", title: "Les pseudo-éléments ::before et ::after", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Les unités fluides : clamp(), min() et le viewport", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Les transformations : translate, rotate et scale", file: "lecon-23.html", status: "complet" },
            { num: "24", title: "Les filtres et le fond flou : filter et backdrop-filter", file: "lecon-24.html", status: "complet" },
            { num: "25", title: "Le défilement maîtrisé : scroll-snap et ancres douces", file: "lecon-25.html", status: "complet" },
          ],
        },
        {
          num: "09", title: "Maîtriser la cascade moderne", sub: "@layer, :is / :where / :has", level: "expert",
          lessons: [
            { num: "26", title: "Les couches de cascade (@layer)", file: "lecon-26.html", status: "complet" },
            { num: "27", title: "Sélecteurs modernes : :is(), :where() et :has()", file: "lecon-27.html", status: "complet" },
          ],
        },
        {
          num: "10", title: "Couleur & mise en page avancées", sub: "oklch, subgrid, container queries", level: "expert",
          lessons: [
            { num: "28", title: "La couleur moderne : oklch, color-mix et couleurs relatives", file: "lecon-28.html", status: "complet" },
            { num: "29", title: "CSS Grid avancé et subgrid", file: "lecon-29.html", status: "complet" },
            { num: "30", title: "Dimensionnement intrinsèque et aspect-ratio", file: "lecon-30.html", status: "complet" },
            { num: "31", title: "Les container queries (@container)", file: "lecon-31.html", status: "complet" },
          ],
        },
        {
          num: "11", title: "Mouvement & effets visuels", sub: "3D, @property, scroll, masques", level: "expert",
          lessons: [
            { num: "32", title: "Transformations 3D et perspective", file: "lecon-32.html", status: "complet" },
            { num: "33", title: "Animations modernes : @property et scroll-driven", file: "lecon-33.html", status: "complet" },
            { num: "34", title: "Filtres, fusion, découpe et masques", file: "lecon-34.html", status: "complet" },
          ],
        },
        {
          num: "12", title: "Architecture, accessibilité & performance", sub: "Nesting, propriétés logiques, perf", level: "expert",
          lessons: [
            { num: "35", title: "Nesting natif, @scope et architecture", file: "lecon-35.html", status: "complet" },
            { num: "36", title: "Propriétés logiques, préférences & robustesse", file: "lecon-36.html", status: "complet" },
            { num: "37", title: "Performance, containment & synthèse", file: "lecon-37.html", status: "complet" },
          ],
        },
        {
          num: "13", title: "À la pointe du CSS", sub: "Positionnement par ancre, View Transitions", level: "expert",
          lessons: [
            { num: "38", title: "Le positionnement par ancre", file: "lecon-38.html", status: "complet" },
            { num: "39", title: "Les View Transitions", file: "lecon-39.html", status: "complet" },
          ],
        },
        {
          num: "14", title: "CSS, encore plus loin", sub: "Fonctions math, transitions d'état, échelle", level: "expert",
          lessons: [
            { num: "40", title: "Fonctions mathématiques et couleur relative", file: "lecon-40.html", status: "complet" },
            { num: "41", title: "Les transitions d'état modernes", file: "lecon-41.html", status: "complet" },
            { num: "42", title: "Le CSS à l'échelle et l'avenir", file: "lecon-42.html", status: "complet" },
          ],
        },
        {
          num: "15", title: "Pour aller plus loin", sub: "Typographie, dégradés, formes, défilement & formulaires", level: "expert",
          lessons: [
            { num: "43", title: "Typographie CSS de précision", file: "lecon-43.html", status: "complet" },
            { num: "44", title: "Dégradés et motifs en CSS pur", file: "lecon-44.html", status: "complet" },
            { num: "45", title: "Formes, découpe et tracé", file: "lecon-45.html", status: "complet" },
            { num: "46", title: "Le défilement maîtrisé", file: "lecon-46.html", status: "complet" },
            { num: "47", title: "Styler les contrôles de formulaire", file: "lecon-47.html", status: "complet" },
          ],
        },
      ],
    },


    git: {
      id: "git", dir: "git", title: "Git & GitHub : versionner son code",
      glyph: "Git", accent: "#e0683b", overview: "cours.html",
      related: [
        { course: "javascript", note: "Versionne tes projets JavaScript dès le départ." },
        { course: "python", note: "Suis l'historique de tes scripts Python." },
        { course: "equipe", note: "Git en solo est un outil ; en équipe, il devient un langage commun. Ce cours enseigne les usages autour : commits qui racontent, demandes de fusion relisibles, historique propre à plusieurs." },
      ],
      modules: [
        {
          num: "01", title: "Démarrer avec Git", sub: "Dépôt, commits, historique", level: "debutant",
          lessons: [
            { num: "01", title: "Pourquoi le contrôle de version", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Premier dépôt et commits", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Lire l'historique et ignorer des fichiers", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Branches & corrections", sub: "Branches, fusion, conflits, annulation", level: "debutant",
          lessons: [
            { num: "04", title: "Travailler avec des branches", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Fusionner des branches", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Résoudre les conflits", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Annuler et corriger", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Collaborer avec GitHub", sub: "Distant, GitHub, pull requests, forks", level: "intermediaire",
          lessons: [
            { num: "08", title: "Les dépôts distants", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "GitHub : héberger et publier", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Pull requests et revue de code", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Forks et contribution open source", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Maîtrise & workflows", sub: "Rebase, stash/tags, bonnes pratiques", level: "intermediaire",
          lessons: [
            { num: "12", title: "Rebase et historique propre", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Stash, tags, bisect et autres outils", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Workflows d'équipe & bonnes pratiques", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Git en profondeur", sub: "Internes, submodules, worktrees, hooks", level: "expert",
          lessons: [
            { num: "15", title: "Sous le capot : les objets de Git", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Submodules, worktrees, hooks et signature", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Collaboration et automatisation", sub: "Stratégies de branches, CI/CD, gros dépôts", level: "expert",
          lessons: [
            { num: "17", title: "Stratégies de branches et revue de code", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "L'intégration continue avec GitHub Actions", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Gros dépôts et récupération avancée", file: "lecon-19.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Pour aller plus loin", sub: "Cherry-pick, configuration, enquête, échange sans serveur & projet", level: "expert",
          lessons: [
            { num: "20", title: "Cherry-pick : transplanter un commit", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Configurer Git à son goût : config, alias, includeIf", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Enquêter dans l'historique : blame, log et pickaxe", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Échanger sans serveur : patch, bundle et archive", file: "lecon-23.html", status: "complet" },
            { num: "24", title: "Projet : prendre en main et assainir un dépôt inconnu", file: "lecon-24.html", status: "complet" },
          ],
        },
      ],
    },

    sql: {
      id: "sql", dir: "sql", title: "SQL : interroger les bases de données",
      glyph: "SQL", accent: "#2e9e8f", overview: "cours.html",
      related: [
        { course: "python", note: "Interroge tes bases directement depuis Python." },
        { course: "git", note: "Versionne tes requêtes et tes migrations." },
        { course: "algo", note: "Comprends ce que font les index et la complexité des requêtes." },
        { course: "data-eng", note: "Les transformations d'un pipeline de données sont, très souvent, des requêtes SQL : l'ingénierie de données industrialise ce que ce cours apprend à écrire." },
        { course: "bdd", note: "Écrire des requêtes est une chose ; concevoir les tables qu'elles interrogent en est une autre. Ce cours enseigne la modélisation, la normalisation et les clés — l'amont de tout ce SQL." },
      ],
      modules: [
        {
          num: "01", title: "Interroger des données", sub: "SELECT, WHERE, tri", level: "debutant",
          lessons: [
            { num: "01", title: "SELECT : interroger une table", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Filtrer avec WHERE", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Trier et limiter les résultats", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Calculer et agréger", sub: "Fonctions, GROUP BY", level: "debutant",
          lessons: [
            { num: "04", title: "Fonctions et expressions", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Agréger : COUNT, SUM et GROUP BY", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Combiner des tables", sub: "Modèle, jointures, sous-requêtes", level: "intermediaire",
          lessons: [
            { num: "06", title: "Modéliser : tables, clés et relations", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Les jointures (JOIN)", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Jointures avancées et auto-jointures", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Sous-requêtes, ensembles et CTE", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Manipuler et structurer", sub: "Écriture, DDL, transactions", level: "intermediaire",
          lessons: [
            { num: "10", title: "Insérer, modifier, supprimer", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Créer et modifier des tables (DDL)", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Vues, transactions et intégrité", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Aller plus loin", sub: "Fenêtrage, performance, sécurité", level: "expert",
          lessons: [
            { num: "13", title: "Les fonctions de fenêtrage", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Performance, sécurité & bonnes pratiques", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Logique stockée & données modernes", sub: "Procédures, triggers, CTE récursives, JSON", level: "expert",
          lessons: [
            { num: "15", title: "Procédures, fonctions et triggers", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "CTE récursives, JSON et recherche plein-texte", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "SQL en production", sub: "Optimisation, modélisation, analytique", level: "expert",
          lessons: [
            { num: "17", title: "Optimiser les requêtes et les index", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Modélisation avancée et intégrité", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "SQL analytique et données à l'échelle", file: "lecon-19.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "Pour aller plus loin", sub: "Reporting, temps, concurrence, migrations & projet", level: "expert",
          lessons: [
            { num: "20", title: "Pivots, tableaux croisés et sous-totaux", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Dates, temps et séries temporelles", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Concurrence, transactions et niveaux d'isolation", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Migrations et évolution du schéma", file: "lecon-23.html", status: "complet" },
            { num: "24", title: "Projet : un rapport analytique de bout en bout", file: "lecon-24.html", status: "complet" },
          ],
        },
      ],
    },

    react: {
      id: "react", dir: "react", title: "React : interfaces à composants",
      glyph: "Re", accent: "#3fa3c4", overview: "cours.html",
      related: [
        { course: "javascript", note: "React s'appuie entièrement sur JavaScript : commence par là." },
        { course: "css", note: "Styliser tes composants demande de bonnes bases en CSS." },
      ],
      modules: [
        {
          num: "01", title: "Les fondations", sub: "JSX, props, listes", level: "intermediaire",
          lessons: [
            { num: "01", title: "Premier composant & JSX", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "JSX en profondeur", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Les props", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Afficher des listes et les clés", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "État & interactivité", sub: "Conditionnel, useState, événements", level: "intermediaire",
          lessons: [
            { num: "05", title: "Le rendu conditionnel", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "L'état avec useState", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Gérer les événements", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Les formulaires contrôlés", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Effets & données", sub: "useEffect, fetch, composition", level: "intermediaire",
          lessons: [
            { num: "09", title: "useEffect et le cycle de vie", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Récupérer des données (fetch)", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Lever l'état et composer", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Hooks avancés & application", sub: "useRef, useContext, useReducer, app", level: "intermediaire",
          lessons: [
            { num: "12", title: "useRef et useContext", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "useReducer et les hooks personnalisés", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Organiser une application & bonnes pratiques", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Aller plus loin : routage, perf, robustesse", sub: "React Router, performance, tests", level: "expert",
          lessons: [
            { num: "15", title: "Le routage avec React Router", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Performance : mémoïsation, lazy et hooks récents", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Robustesse : error boundaries, portals et tests", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "React en production", sub: "État à l'échelle, données, frameworks", level: "expert",
          lessons: [
            { num: "18", title: "La gestion d'état à l'échelle", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Les données serveur et React moderne", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Les frameworks et le rendu (Next.js, RSC)", file: "lecon-20.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "React avec TypeScript", sub: "Fiabiliser ses composants", level: "expert",
          lessons: [
            { num: "21", title: "React avec TypeScript", file: "lecon-21.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "React en pratique", sub: "Composition, formulaires, accessibilité, animations & projet", level: "expert",
          lessons: [
            { num: "22", title: "Les patterns de composition", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Des formulaires robustes", file: "lecon-23.html", status: "complet" },
            { num: "24", title: "L'accessibilité des composants", file: "lecon-24.html", status: "complet" },
            { num: "25", title: "Animations et transitions", file: "lecon-25.html", status: "complet" },
            { num: "26", title: "Projet : une bibliothèque de composants", file: "lecon-26.html", status: "complet" },
          ],
        },
      ],
    },

    nodejs: {
      id: "nodejs", dir: "nodejs", title: "Node.js : JavaScript côté serveur",
      glyph: "No", accent: "#4f9e54", overview: "cours.html",
      related: [
        { course: "javascript", note: "Le prérequis : Node, c'est JavaScript hors du navigateur." },
        { course: "sql", note: "Connecte ton API Node à une vraie base de données." },
        { course: "git", note: "Versionne et déploie tes projets Node." },
      ],
      modules: [
        {
          num: "01", title: "Les fondations de Node", sub: "Runtime, modules, npm", level: "intermediaire",
          lessons: [
            { num: "01", title: "Découvrir Node.js", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les modules (CommonJS et ESM)", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "npm et l'écosystème", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le cœur asynchrone", sub: "Event loop, promesses, events, streams", level: "intermediaire",
          lessons: [
            { num: "04", title: "L'asynchrone et la boucle d'événements", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Promesses et async/await", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Les événements (EventEmitter)", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Les streams et les buffers", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Interagir avec le système", sub: "Fichiers, process, OS", level: "intermediaire",
          lessons: [
            { num: "08", title: "Le système de fichiers", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Process, environnement et système", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Construire un serveur", sub: "HTTP, Express, middleware", level: "intermediaire",
          lessons: [
            { num: "10", title: "Créer un serveur HTTP", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Une API REST avec Express", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Middleware, données et erreurs", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Qualité & production", sub: "Env, tests, sécurité, déploiement", level: "intermediaire",
          lessons: [
            { num: "13", title: "Environnement, débogage et tests", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Bonnes pratiques, sécurité & déploiement", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Données, authentification & temps réel", sub: "Base de données, JWT, WebSockets", level: "expert",
          lessons: [
            { num: "15", title: "Connecter une base de données", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Authentification : mots de passe et JWT", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Le temps réel avec les WebSockets", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Node.js à l'échelle", sub: "Architecture, performance, déploiement", level: "expert",
          lessons: [
            { num: "18", title: "Architecture d'une application robuste", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Performance et montée en charge", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Observabilité, conteneurisation et déploiement", file: "lecon-20.html", status: "complet" },
          ],
        },
        {
          num: "08", title: "Données et robustesse", sub: "ORM et validation des entrées", level: "expert",
          lessons: [
            { num: "21", title: "Accès aux données avec un ORM (Prisma)", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Valider et typer les entrées (Zod)", file: "lecon-22.html", status: "complet" },
          ],
        },
        {
          num: "09", title: "Node.js en pratique", sub: "CLI, parallélisme, tests, files & projet", level: "expert",
          lessons: [
            { num: "23", title: "Construire un outil en ligne de commande (CLI)", file: "lecon-23.html", status: "complet" },
            { num: "24", title: "Paralléliser : worker_threads, child_process et cluster", file: "lecon-24.html", status: "complet" },
            { num: "25", title: "Tester avec le runner natif (node:test)", file: "lecon-25.html", status: "complet" },
            { num: "26", title: "Tâches en arrière-plan et files d'attente", file: "lecon-26.html", status: "complet" },
            { num: "27", title: "Projet : concevoir et livrer un service Node complet", file: "lecon-27.html", status: "complet" },
          ],
        },
      ],
    },

    typescript: {
      id: "typescript", dir: "typescript", title: "TypeScript : du typage au quotidien",
      glyph: "TS", accent: "#2f6fd0", overview: "cours.html",
      related: [
        { course: "javascript", note: "Le prérequis : TypeScript est un sur-ensemble de JavaScript." },
        { course: "react", note: "TS et React forment le duo standard du front-end moderne." },
        { course: "nodejs", note: "Type aussi ton back-end : Node + TypeScript." },
      ],
      modules: [
        {
          num: "01", title: "Démarrer avec TypeScript", sub: "Compilation, types de base, interfaces", level: "intermediaire",
          lessons: [
            { num: "01", title: "Pourquoi TypeScript ?", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les types de base", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Objets, interfaces et alias de types", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le système de types", sub: "Unions, fonctions, génériques, utilitaires", level: "intermediaire",
          lessons: [
            { num: "04", title: "Unions, littéraux et affinage (narrowing)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Typer les fonctions", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Les génériques", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Types utilitaires et transformation de types", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "TypeScript en pratique", sub: "Classes, modules, projet réel", level: "avance",
          lessons: [
            { num: "08", title: "Classes et POO typée", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Modules, déclarations et configuration", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "TypeScript au quotidien", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "TypeScript en profondeur", sub: "Types avancés, patterns, production", level: "expert",
          lessons: [
            { num: "11", title: "Types conditionnels, mappés et template literals", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Patterns de typage avancés", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "TypeScript en production : décorateurs et outillage", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "TypeScript appliqué", sub: "React et validation à la frontière", level: "expert",
          lessons: [
            { num: "14", title: "TypeScript avec React", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Valider à la frontière : unknown, Zod et satisfies", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Pour aller plus loin", sub: "Configuration, typage structurel, gardes, migration & projet", level: "expert",
          lessons: [
            { num: "16", title: "Configurer le compilateur : tsconfig et le mode strict", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Le typage structurel : compatibilité, variance et types nominaux", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Gardes de type et fonctions d'assertion", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Migrer un projet JavaScript vers TypeScript", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Projet : un client d'API typé de bout en bout", file: "lecon-20.html", status: "complet" },
          ],
        },
      ],
    },

    bash: {
      id: "bash", dir: "bash", title: "Bash & ligne de commande",
      glyph: "$_", accent: "#5a6470", overview: "cours.html",
      related: [
        { course: "git", note: "Git se pilote au terminal : les deux vont de pair." },
        { course: "nodejs", note: "Lance et automatise tes projets Node depuis le shell." },
        { course: "python", note: "Bash orchestre, Python calcule : le duo classique de l'automatisation." },
      ],
      modules: [
        {
          num: "01", title: "Le terminal et les fichiers", sub: "Naviguer, manipuler, filtrer",
          lessons: [
            { num: "01", title: "Le terminal et le shell", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Naviguer dans le système de fichiers", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Manipuler fichiers et dossiers", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Lire, chercher et filtrer du texte", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Scripter en Bash", sub: "Variables, scripts, conditions, boucles",
          lessons: [
            { num: "05", title: "Variables, expansions et guillemets", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Écrire son premier script", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Conditions et boucles", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Fonctions, robustesse et automatisation", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Aller plus loin", sub: "Texte avancé, processus, production",
          lessons: [
            { num: "09", title: "sed, awk et le traitement de texte avancé", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Processus, signaux et tâches de fond", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Scripts de production et outils modernes", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Maîtrise du shell", sub: "Débogage, expansions, tableaux, E/S et projet",
          lessons: [
            { num: "12", title: "Déboguer ses scripts Bash", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Expansions de paramètres et manipulation de chaînes", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Les tableaux : indexés et associatifs", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Entrées/sorties avancées", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Projet : un script de sauvegarde robuste", file: "lecon-16.html", status: "complet" },
          ],
        },
      ],
    },

    regex: {
      id: "regex", dir: "regex", title: "Regex : les expressions régulières",
      glyph: ".*", accent: "#3a8f7a", overview: "cours.html",
      related: [
        { course: "javascript", note: "JavaScript intègre les regex nativement (/.../) : le terrain d'essai idéal." },
        { course: "python", note: "Le module re de Python : search, findall, sub sur tes motifs." },
        { course: "bash", note: "grep, sed et awk filtrent le texte avec des expressions régulières." },
        { course: "compilation", note: "Le premier métier des regex : découper un code source en jetons. Le cours montre aussi, mesure à l'appui, ce qu'elles ne peuvent pas faire — équilibrer des parenthèses." },
      ],
      modules: [
        {
          num: "01", title: "Les fondamentaux", sub: "Littéraux, classes, quantificateurs, ancres",
          lessons: [
            { num: "01", title: "Découvrir les expressions régulières", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Classes de caractères", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Quantificateurs et ancres", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Composer et capturer", sub: "Groupes, alternatives, captures, regards",
          lessons: [
            { num: "04", title: "Groupes, alternatives et captures", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Remplacement et regards", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "En pratique", sub: "Langages, drapeaux, pièges, ReDoS",
          lessons: [
            { num: "06", title: "Les regex en pratique", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Unicode, groupes nommés, performance, recettes",
          lessons: [
            { num: "07", title: "Regex et Unicode : accents, propriétés et émojis", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Groupes nommés et backréférences", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Performance et ReDoS : écrire des regex sûres", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Recettes prêtes à l'emploi", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Un valideur-extracteur complet",
          lessons: [
            { num: "11", title: "Projet : un valideur-extracteur de données", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },

    docker: {
      id: "docker", dir: "docker", title: "Docker : conteneuriser ses applications",
      glyph: "Dk", accent: "#2f7fb8", overview: "cours.html",
      related: [
        { course: "bash", note: "Docker se pilote au terminal : l'aisance en ligne de commande aide." },
        { course: "nodejs", note: "Conteneurise une app Node : Dockerfile, ports, variables d'environnement." },
        { course: "git", note: "Versionne ton Dockerfile et ton compose.yaml avec le reste du projet." },
      ],
      modules: [
        {
          num: "01", title: "Les conteneurs", sub: "Concepts, commandes, Dockerfile", level: "intermediaire",
          lessons: [
            { num: "01", title: "Pourquoi Docker : les conteneurs", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Images et conteneurs en pratique", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Écrire un Dockerfile", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Applications réelles", sub: "Volumes, réseaux, Docker Compose", level: "intermediaire",
          lessons: [
            { num: "04", title: "Volumes, réseaux et ports", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Orchestrer avec Docker Compose", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "En production", sub: "Images optimisées, sécurité, déploiement", level: "avance",
          lessons: [
            { num: "06", title: "Images optimisées et bonnes pratiques", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Docker au quotidien", sub: "Publier, développer, observer, sécuriser", level: "avance",
          lessons: [
            { num: "07", title: "Publier ses images : registres et tags", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Développer dans des conteneurs", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Observer et déboguer ses conteneurs", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Renforcer la sécurité : images et chaîne d'approvisionnement", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Aller plus loin", sub: "Instructions avancées, BuildKit, pile multi-services, stockage", level: "avance",
          lessons: [
            { num: "11", title: "Configurer l'image : ENTRYPOINT, CMD, ARG et ENV", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Builds modernes : BuildKit, cache et multi-plateforme", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Composer une pile complète : réseaux, profils et montée en charge", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Gérer l'espace et le stockage", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Le capstone : conteneuriser de bout en bout", level: "avance",
          lessons: [
            { num: "15", title: "Projet : conteneuriser une application de bout en bout", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },

    api: {
      id: "api", dir: "api", title: "API REST : concevoir des API web",
      glyph: "API", accent: "#b04a8f", overview: "cours.html",
      related: [
        { course: "nodejs", note: "Node et Express sont un terrain idéal pour implémenter une API REST." },
        { course: "php", note: "Le cours PHP construit une API REST en JSON : la théorie rencontre la pratique." },
        { course: "docker", note: "Conteneurise ton API pour la déployer à l'identique partout." },
      ],
      modules: [
        {
          num: "01", title: "Les fondamentaux REST", sub: "Client/serveur, verbes, statuts",
          lessons: [
            { num: "01", title: "Qu'est-ce qu'une API REST", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les verbes HTTP et le CRUD", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Codes de statut et en-têtes", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Concevoir une API", sub: "URL, JSON, pagination, versioning",
          lessons: [
            { num: "04", title: "Concevoir des ressources et des URL", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "JSON, pagination, filtrage et versioning", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Robustesse", sub: "Authentification, sécurité, GraphQL",
          lessons: [
            { num: "06", title: "Authentification, sécurité et bonnes pratiques", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "API à l'échelle", sub: "Auth avancée, performance, au-delà de REST",
          lessons: [
            { num: "07", title: "Authentification avancée (OAuth2, JWT)", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Performance & fiabilité", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Au-delà de REST (GraphQL, gRPC, WebSockets)", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "API en pratique", sub: "Documentation, erreurs, webhooks, tests, projet",
          lessons: [
            { num: "10", title: "Documenter une API avec OpenAPI", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Gérer les erreurs proprement", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Notifier avec les webhooks", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Tester une API", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet fil rouge : une API de bout en bout", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    securite: {
      id: "securite", dir: "securite", title: "Sécurité applicative : comprendre et prévenir les failles",
      glyph: "Sec", accent: "#7a2f3a", overview: "cours.html",
      related: [
        { course: "api", note: "Une API exposée doit être sécurisée : authentification, validation, CORS." },
        { course: "php", note: "Le cours PHP applique ces principes : sessions, injections, sécurité web." },
        { course: "sql", note: "Comprendre le SQL aide à saisir l'injection SQL et les requêtes préparées." },
        { course: "offensive", note: "Le cours jumeau, pris par l'autre bout : ce que ces défenses arrêtent, comment on cadre un test légalement, et comment trois failles jugées mineures s'enchaînent en une compromission." },
        { course: "crypto", note: "La leçon 8 de ce cours distingue hacher, chiffrer et signer. Le cours Cryptographie appliquée ouvre les trois fonctions, les exécute et montre où chacune cède." },
      ],
      modules: [
        {
          num: "01", title: "Penser sécurité", sub: "Surface d'attaque, validation des entrées",
          lessons: [
            { num: "01", title: "Pourquoi la sécurité applicative", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Ne jamais faire confiance à l'entrée", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Les failles classiques", sub: "Injections, XSS, CSRF, authentification",
          lessons: [
            { num: "03", title: "Les injections", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "XSS et CSRF", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Authentification et mots de passe", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Durcir", sub: "Contrôle d'accès, secrets, défense en profondeur",
          lessons: [
            { num: "06", title: "Contrôle d'accès, secrets et défense en profondeur", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Transport & chaîne d'approvisionnement", sub: "TLS, en-têtes, cryptographie, dépendances",
          lessons: [
            { num: "07", title: "HTTPS, TLS et en-têtes de sécurité", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Cryptographie appliquée", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Sécurité des dépendances & supply chain", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Sécurité avancée & opérations", sub: "Jetons et API, SSRF, désérialisation, journalisation",
          lessons: [
            { num: "10", title: "Sécuriser les API : jetons, JWT et OAuth 2", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Failles côté serveur : SSRF et désérialisation", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Journaliser, détecter et réagir aux incidents", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Concevoir et auditer", sub: "Modélisation des menaces (STRIDE), audit de sécurité",
          lessons: [
            { num: "13", title: "Modéliser les menaces avec STRIDE", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Auditer une application : mettre tout en pratique", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    tests: {
      id: "tests", dir: "tests", title: "Tests & qualité : tester son code et le garder sain",
      glyph: "QA", accent: "#4a8c5a", overview: "cours.html",
      related: [
        { course: "java", note: "Le cours Java applique ces principes avec JUnit 5 (module « Tester son code »)." },
        { course: "rust", note: "Rust intègre les tests au langage : cargo test, #[test], assertions." },
        { course: "git", note: "L'intégration continue rejoue tes tests à chaque push : Git en est la base." },
        { course: "equipe", note: "Des tests solides sont ce qui rend une revue rapide et une fusion sereine : ce cours montre leur rôle dans le travail collectif — relire, livrer, gérer un incident sans tout casser." },
      ],
      modules: [
        {
          num: "01", title: "Les bases du test", sub: "Valeur, anatomie, pyramide",
          lessons: [
            { num: "01", title: "Pourquoi tester son code", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Anatomie d'un bon test", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "La pyramide des tests", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Bien tester", sub: "TDD, doublures de test",
          lessons: [
            { num: "04", title: "Le développement piloté par les tests (TDD)", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Les doublures de test : mocks, stubs et fakes", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Qualité au-delà des tests", sub: "Couverture, CI, garde-fous",
          lessons: [
            { num: "06", title: "Couverture, intégration continue et qualité du code", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Tests avancés", sub: "Paramétrés, indéterminisme, intégration, propriétés & mutation",
          lessons: [
            { num: "07", title: "Tests paramétrés et bons jeux de données", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Tester l'asynchrone, le temps et l'aléatoire", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Tests d'intégration et de bout en bout (E2E)", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Tests basés sur les propriétés et mutation testing", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Tester au-delà du fonctionnel", sub: "Performance, contrats, sécurité",
          lessons: [
            { num: "11", title: "Tests de performance et de charge", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Les tests de contrat entre services", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Automatiser les tests de sécurité", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Reprendre un code legacy sous filet de tests",
          lessons: [
            { num: "14", title: "Projet — reprendre du code legacy sous filet de tests", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    patterns: {
      id: "patterns", dir: "patterns", title: "Design patterns : concevoir un code clair et flexible",
      glyph: "DP", accent: "#6b5b95", overview: "cours.html",
      related: [
        { course: "java", note: "Java illustre la POO sur laquelle reposent les patterns : classes, interfaces, héritage." },
        { course: "tests", note: "Une bonne suite de tests donne le filet pour refactorer vers un pattern sereinement." },
        { course: "csharp", note: "Beaucoup de patterns sont intégrés à .NET : les reconnaître éclaire les bibliothèques." },
      ],
      modules: [
        {
          num: "01", title: "Fondamentaux", sub: "Définition, familles, principes SOLID",
          lessons: [
            { num: "01", title: "Qu'est-ce qu'un design pattern", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les principes SOLID", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Création & structure", sub: "Factory, Singleton, Builder, Adapter, Decorator…",
          lessons: [
            { num: "03", title: "Patterns de création", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Patterns structurels", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Comportement", sub: "Strategy, Observer, Iterator, Command, bon usage",
          lessons: [
            { num: "05", title: "Patterns comportementaux", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Bien utiliser les patterns", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Pour aller plus loin", sub: "Proxy/Bridge, State, injection de dépendances, MVC/MVVM",
          lessons: [
            { num: "07", title: "Structurels avancés : Proxy, Bridge, Flyweight", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "État & comportement : State, Template, Chain", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "L'injection de dépendances", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Patterns d'architecture : MVC, MVVM, Repository", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Assembler Command, Memento et Observer",
          lessons: [
            { num: "11", title: "Projet — un éditeur avec annulation (undo/redo)", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },

    formats: {
      id: "formats", dir: "formats", title: "Formats de données : JSON, CSV, YAML, XML",
      glyph: "{ }", accent: "#a86b3f", overview: "cours.html",
      related: [
        { course: "api", note: "Les API REST échangent presque toujours en JSON : ce cours en donne les bases." },
        { course: "javascript", note: "JSON dérive des objets JavaScript : JSON.parse/stringify y sont natifs." },
        { course: "sql", note: "Les exports de bases et de tableurs se font souvent en CSV." },
      ],
      modules: [
        {
          num: "01", title: "Les formats texte courants", sub: "Sérialisation, JSON, CSV",
          lessons: [
            { num: "01", title: "Pourquoi des formats de données", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "JSON, le format roi", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "CSV, les données tabulaires", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Configuration et documents", sub: "YAML, TOML, XML",
          lessons: [
            { num: "04", title: "YAML et TOML, la configuration lisible", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "XML et les documents structurés", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Bien choisir", sub: "Choix, validation, encodage, binaire",
          lessons: [
            { num: "06", title: "Choisir et valider un format", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Formats de données : aller plus loin", sub: "Validation, binaire, Unicode, interopérabilité, projet",
          lessons: [
            { num: "07", title: "Valider en profondeur avec un schéma", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Les formats binaires en pratique", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Unicode et l'encodage, en profondeur", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Les pièges d'interopérabilité", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Concevoir un échange de données, de bout en bout", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },

    cicd: {
      id: "cicd", dir: "cicd", title: "CI/CD : automatiser l'intégration et le déploiement",
      glyph: "CI", accent: "#4f63c4", overview: "cours.html",
      related: [
        { course: "git", note: "La CI/CD se déclenche sur les pushs et pull requests : Git en est la base." },
        { course: "tests", note: "Le pipeline rejoue automatiquement la chaîne qualité à chaque changement." },
        { course: "docker", note: "On emballe l'application en image pour un déploiement reproductible." },
        { course: "equipe", note: "La CI automatise le style, les tests et le déploiement dont ce cours parle côté équipe : brancher le formatage sur la CI, relire vite, gérer les incidents que la mise en production révèle." },
      ],
      modules: [
        {
          num: "01", title: "Les fondamentaux", sub: "CI/CD, anatomie d'un pipeline",
          lessons: [
            { num: "01", title: "Qu'est-ce que la CI/CD", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le pipeline : étapes et déclencheurs", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Construire un pipeline", sub: "Workflow YAML, tests et qualité",
          lessons: [
            { num: "03", title: "Anatomie d'un workflow", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Tester et vérifier dans le pipeline", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Livrer en production", sub: "Déploiement, stratégies, robustesse",
          lessons: [
            { num: "05", title: "Déployer en continu", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Bonnes pratiques et robustesse", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "CI/CD en pratique", sub: "Secrets, artefacts, conteneurs, stratégies & projet",
          lessons: [
            { num: "07", title: "Secrets et sécurité de la chaîne", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Cache, artefacts et matrices", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Conteneurs et registres dans le pipeline", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Environnements, approbations et feature flags", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Projet : un pipeline de bout en bout", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },

    nosql: {
      id: "nosql", dir: "nosql", title: "NoSQL : les bases de données non relationnelles",
      glyph: "NQL", accent: "#2f8f66", overview: "cours.html",
      related: [
        { course: "sql", note: "Le NoSQL se comprend par contraste avec le relationnel : le cours SQL d'abord." },
        { course: "formats", note: "Les documents NoSQL sont du JSON : ce format est la brique de base." },
        { course: "api", note: "Une API sert souvent des données issues d'une base NoSQL document." },
        { course: "data-eng", note: "Files d'événements, documents JSON, stockage objet : un pipeline de données puise et déverse dans des bases non relationnelles autant que dans un entrepôt." },
        { course: "bdd", note: "Avant de choisir le NoSQL, il faut savoir concevoir en relationnel : entités, relations, normalisation. Ce cours pose ces fondations et compare les deux modèles." },
        { course: "distribue", note: "ACID, BASE et CAP repris depuis leur cause : le réseau. Le théorème y est énoncé dans sa forme exacte, pas dans sa version simplifiée." },
      ],
      modules: [
        {
          num: "01", title: "Comprendre le NoSQL", sub: "Pourquoi, et SQL vs NoSQL",
          lessons: [
            { num: "01", title: "Pourquoi le NoSQL", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "SQL contre NoSQL : ACID, BASE et CAP", file: "lecon-02.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Les familles", sub: "Document, clé-valeur, colonnes",
          lessons: [
            { num: "03", title: "Les bases document", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Bases clé-valeur et orientées colonnes", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Concevoir et choisir", sub: "Graphe, modélisation, persistance polyglotte",
          lessons: [
            { num: "05", title: "Les bases graphe", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Modéliser et choisir en NoSQL", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Index, agrégation, réplication et sécurité",
          lessons: [
            { num: "07", title: "Indexer pour la performance", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Agréger les données", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Répliquer et partitionner", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Cohérence, transactions et sécurité", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Bases spécialisées", sub: "Séries temporelles, recherche, vecteurs",
          lessons: [
            { num: "11", title: "Les bases de séries temporelles", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Les moteurs de recherche : l'index inversé", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Les bases vectorielles : la recherche par similarité", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Concevoir et exploiter une base de bout en bout",
          lessons: [
            { num: "14", title: "Projet : une base NoSQL de bout en bout", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    markdown: {
      id: "markdown", dir: "markdown", title: "Markdown : rédiger en texte lisible",
      glyph: "MD", accent: "#5f6b8c", overview: "cours.html",
      related: [
        { course: "git", note: "La doc en Markdown vit dans le dépôt Git et se versionne avec le code." },
        { course: "html", note: "Markdown se convertit en HTML ; on peut même y insérer du HTML." },
        { course: "formats", note: "Markdown est du texte brut : portable, durable, versionnable." },
      ],
      modules: [
        {
          num: "01", title: "Les bases", sub: "Texte, titres, listes, liens",
          lessons: [
            { num: "01", title: "Pourquoi Markdown", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Texte, titres et listes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Liens, images et citations", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Structurer un document", sub: "Code, tableaux, listes de tâches",
          lessons: [
            { num: "04", title: "Code et blocs de code", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Tableaux, listes de tâches et GFM", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "En pratique", sub: "README, HTML, variantes, bonnes pratiques",
          lessons: [
            { num: "06", title: "Markdown en pratique", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Extensions, maths, diagrammes, sites, conversion",
          lessons: [
            { num: "07", title: "Markdown étendu : notes, définitions et attributs", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Maths et diagrammes en texte", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Front matter et sites de documentation", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Convertir et outiller Markdown", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Documenter un projet de bout en bout",
          lessons: [
            { num: "11", title: "Projet : documenter un projet de bout en bout", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },

    vscode: {
      id: "vscode", dir: "vscode", title: "VS Code : maîtriser son éditeur de code",
      glyph: "VS", accent: "#2563c8", overview: "cours.html",
      related: [
        { course: "git", note: "Git est intégré à VS Code : commits, diffs et branches depuis l'éditeur." },
        { course: "bash", note: "Le terminal intégré de VS Code accueille ta ligne de commande." },
        { course: "markdown", note: "Autre savoir-faire transversal, utile à tous les langages." },
      ],
      modules: [
        {
          num: "01", title: "Prendre en main", sub: "Interface, édition, recherche",
          lessons: [
            { num: "01", title: "Découvrir VS Code et son interface", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Éditer efficacement", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "La palette de commandes et la recherche", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Outils intégrés", sub: "Terminal, Git, extensions",
          lessons: [
            { num: "04", title: "Le terminal intégré et Git", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Extensions et personnalisation", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Aller plus loin", sub: "Débogage et productivité",
          lessons: [
            { num: "06", title: "Le débogage et fonctionnalités avancées", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Productivité avancée", sub: "Multi-curseurs, snippets",
          lessons: [
            { num: "07", title: "Maîtriser les multi-curseurs et la sélection", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Créer ses propres snippets", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Automatiser et étendre", sub: "Tâches, développement à distance",
          lessons: [
            { num: "09", title: "Automatiser avec les tâches (tasks.json)", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Développer à distance : SSH, WSL et conteneurs", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Capstone : configurer un dépôt",
          lessons: [
            { num: "11", title: "Projet : configurer un dépôt VS Code de A à Z", file: "lecon-11.html", status: "complet" },
          ],
        },
      ],
    },

    sass: {
      id: "sass", dir: "sass", title: "Sass : du CSS, en mieux",
      glyph: "Sa", accent: "#c2557f", overview: "cours.html",
      related: [
        { course: "css", note: "Sass prolonge le CSS : maîtriser les bases est indispensable." },
        { course: "html", note: "L'imbrication Sass reflète la structure de ton HTML." },
      ],
      modules: [
        {
          num: "01", title: "Les bases", sub: "Variables, imbrication",
          lessons: [
            { num: "01", title: "Découvrir Sass", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables et types", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Imbrication et sélecteur parent", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Organiser et réutiliser", sub: "Partials, mixins, fonctions",
          lessons: [
            { num: "04", title: "Partials, @use et @forward", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Mixins et @include", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Fonctions, opérations et couleurs", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Aller plus loin", sub: "Conditions, boucles, pratiques",
          lessons: [
            { num: "07", title: "Conditions, boucles et bonnes pratiques", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Sass à l'échelle", sub: "Architecture & design system",
          lessons: [
            { num: "08", title: "Architecture CSS (7-1, BEM)", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Design system en Sass (maps, thèmes)", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Sass avancé & production", sub: "Modules, responsive, migration",
          lessons: [
            { num: "10", title: "Les modules natifs de Sass", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Media queries et responsive avec Sass", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Maps avancées : imbrication, fusion, thèmes", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Migration @import → @use/@forward", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Design system de bout en bout",
          lessons: [
            { num: "14", title: "Composer un design system Sass complet", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    http: {
      id: "http", dir: "http", title: "HTTP : comment marche le web",
      glyph: "HT", accent: "#0e7490", overview: "cours.html",
      related: [
        { course: "api", note: "Une API REST échange ces mêmes requêtes HTTP, avec un corps en JSON." },
        { course: "securite", note: "Cookies, HTTPS et CORS sont au cœur de la sécurité web." },
        { course: "html", note: "Le HTML voyage justement dans le corps des réponses HTTP." },
        { course: "distribue", note: "Sous chaque requête HTTP, un aller-retour physique : ce cours calcule le plancher imposé par la vitesse de la lumière et ce que coûte une poignée de main." },
        { course: "offensive", note: "Une attaque web n'est qu'une requête HTTP écrite exprès. Ce cours montre ce qu'un en-tête, un cookie ou un code de retour révèlent à qui les lit avec cette intention." },
        { course: "crypto", note: "HTTPS repose sur des primitives que ce cours emploie sans les expliquer : empreintes, chiffrement symétrique et asymétrique, signatures. Le cours Cryptographie appliquée les pose." },
      ],
      modules: [
        {
          num: "01", title: "Le web, comment ça marche", sub: "Client, serveur, DNS",
          lessons: [
            { num: "01", title: "Le web : client, serveur et Internet", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les URL et le DNS", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "La requête et la réponse HTTP", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le dialogue en détail", sub: "Méthodes, statuts, en-têtes",
          lessons: [
            { num: "04", title: "Méthodes et codes de statut", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "En-têtes, cookies et sessions", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Web moderne et sécurité", sub: "HTTPS, CORS, HTTP/2-3",
          lessons: [
            { num: "06", title: "HTTPS et la sécurité du transport", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "CORS et l'évolution du protocole", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "HTTP en pratique", sub: "Cache, négociation, authentification, débogage",
          lessons: [
            { num: "08", title: "Le cache HTTP", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "La négociation de contenu et la compression", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "L'authentification HTTP", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Observer et déboguer HTTP", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Synthèse : un échange HTTP de bout en bout",
          lessons: [
            { num: "12", title: "Projet — un échange HTTP de bout en bout", file: "lecon-12.html", status: "complet" },
          ],
        },
      ],
    },

    vue: {
      id: "vue", dir: "vue", title: "Vue.js : construire des interfaces réactives",
      glyph: "V", accent: "#3aa06a", overview: "cours.html",
      related: [
        { course: "javascript", note: "Vue est un framework JavaScript : maîtriser JS est indispensable." },
        { course: "react", note: "L'autre grand framework : composants, props et flux descendant, autrement." },
        { course: "typescript", note: "Vue 3 et la Composition API s'intègrent très bien à TypeScript." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Vue", sub: "Réactivité, template, état",
          lessons: [
            { num: "01", title: "Découvrir Vue", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le template et les directives", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "La réactivité : ref, computed et v-model", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Composants", sub: "Props, événements, cycle de vie",
          lessons: [
            { num: "04", title: "Les composants et les props", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Événements, cycle de vie et watchers", file: "lecon-05.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Aller plus loin", sub: "Écosystème : Router, Pinia, Vite",
          lessons: [
            { num: "06", title: "L'écosystème Vue", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Vue confirmé", sub: "Composition API, patterns, production",
          lessons: [
            { num: "07", title: "Composition API & composables", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Patterns de composants avancés", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "État, performance & production", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Construire une application", sub: "Router, formulaires, animations, tests",
          lessons: [
            { num: "10", title: "Vue Router : le routage d'une application", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Les formulaires et leur validation", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Les transitions et les animations", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Tester ses composants avec Vitest", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Assembler une application complète",
          lessons: [
            { num: "14", title: "Projet : une application de tâches complète", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    java: {
      id: "java", dir: "java", title: "Java : programmation orientée objet",
      glyph: "Jv", accent: "#b5562f", overview: "cours.html",
      related: [
        { course: "csharp", note: "C# partage l'héritage objet de Java : passe de l'un à l'autre facilement." },
        { course: "algo", note: "Mets la POO au service des structures de données et des algorithmes." },
        { course: "git", note: "Versionne et collabore sur tes projets Java." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Java", sub: "JVM, types, conditions, méthodes", level: "intermediaire",
          lessons: [
            { num: "01", title: "Découvrir Java et la JVM", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types primitifs et opérateurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Méthodes et tableaux", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Programmation orientée objet", sub: "Classes, héritage, interfaces", level: "intermediaire",
          lessons: [
            { num: "05", title: "Classes et objets", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Héritage et polymorphisme", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Interfaces et classes abstraites", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Énumérations, records et classes internes", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Robustesse et collections", sub: "Exceptions, génériques, collections", level: "intermediaire",
          lessons: [
            { num: "09", title: "Exceptions et gestion d'erreurs", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Les génériques", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Les collections (List, Set, Map)", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Java moderne", sub: "Lambdas, streams, projet", level: "intermediaire",
          lessons: [
            { num: "12", title: "Lambdas et streams", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Fichiers, dates et utilitaires", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Organiser un projet et aller plus loin", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Java en profondeur", sub: "Concurrence, Java moderne, JVM & performance", level: "expert",
          lessons: [
            { num: "15", title: "Concurrence et parallélisme", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Java moderne : sealed, pattern matching et records", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "La JVM, la mémoire et la performance", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Tester son code", sub: "JUnit 5, assertions, TDD", level: "expert",
          lessons: [
            { num: "18", title: "Tester avec JUnit 5", file: "lecon-18.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Java en pratique", sub: "Optional, égalité, API web, concurrence & projet", level: "expert",
          lessons: [
            { num: "19", title: "Optional et le code sans null", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "equals, hashCode et l'ordre des objets", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Consommer une API web avec HttpClient", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Concurrence moderne : CompletableFuture et threads virtuels", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Projet : une application Java de bout en bout", file: "lecon-23.html", status: "complet" },
          ],
        },
      ],
    },

    c: {
      id: "c", dir: "c", title: "C : programmation système",
      glyph: "C", accent: "#5566a8", overview: "cours.html",
      related: [
        { course: "cpp", note: "Le C++ étend le C avec les objets et la STL : la suite naturelle." },
        { course: "rust", note: "Rust vise la même puissance que le C, avec la sûreté mémoire en plus." },
        { course: "algo", note: "Implémente les structures de données au plus près de la mémoire." },
        { course: "compilation", note: "Compilation séparée, fichier objet, édition de liens : les étapes que gcc enchaîne pour toi, expliquées une à une." },
      ],
      modules: [
        {
          num: "01", title: "Les bases du C", sub: "Compilation, types, fonctions", level: "avance",
          lessons: [
            { num: "01", title: "Découvrir le C et la compilation", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, variables et opérateurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Les fonctions", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Mémoire et pointeurs", sub: "Pointeurs, tableaux, allocation, structures", level: "avance",
          lessons: [
            { num: "05", title: "Les pointeurs", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Tableaux et chaînes de caractères", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "L'allocation dynamique de mémoire", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Structures, unions et énumérations", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Aller plus loin", sub: "Fichiers, préprocesseur, débogage", level: "avance",
          lessons: [
            { num: "09", title: "Entrées/sorties et fichiers", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Préprocesseur et compilation multi-fichiers", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Débogage et sûreté mémoire", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Organiser un projet et aller plus loin", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "C en profondeur", sub: "Pointeurs de fonction, structures, système", level: "expert",
          lessons: [
            { num: "13", title: "Pointeurs de fonction et abstraction", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Structures de données dynamiques", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Manipulation de bits et programmation système", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Tester son code", sub: "assert.h, mini-framework, sanitizers", level: "expert",
          lessons: [
            { num: "16", title: "Tester son code C", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "C en pratique", sub: "Bibliothèque standard, généricité, texte, threads & projet", level: "expert",
          lessons: [
            { num: "17", title: "La bibliothèque standard C", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Programmation générique : void* et qsort", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Chaînes robustes et analyse de texte", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Programmer en parallèle : les threads POSIX", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Projet : un outil en ligne de commande", file: "lecon-21.html", status: "complet" },
          ],
        },
      ],
    },

    cpp: {
      id: "cpp", dir: "cpp", title: "C++ : performance et objets",
      glyph: "C++", accent: "#6f4fa8", overview: "cours.html",
      related: [
        { course: "c", note: "Le C++ part du C : connaître la mémoire et les pointeurs aide beaucoup." },
        { course: "rust", note: "Rust propose une autre réponse à la sûreté mémoire sans ramasse-miettes." },
        { course: "algo", note: "La STL implémente les structures de données du cours Algorithmes." },
      ],
      modules: [
        {
          num: "01", title: "Du C au C++", sub: "Compilation, références, fonctions, classes", level: "avance",
          lessons: [
            { num: "01", title: "Découvrir le C++", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, références et bases modernes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Fonctions et surcharge", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Classes et objets", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "POO et RAII", sub: "Cycle de vie, héritage, opérateurs, déplacement", level: "avance",
          lessons: [
            { num: "05", title: "Constructeurs, destructeurs et RAII", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Héritage et polymorphisme", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "La surcharge d'opérateurs", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Sémantique de copie et de déplacement", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "La bibliothèque standard", sub: "Templates, conteneurs, algorithmes", level: "avance",
          lessons: [
            { num: "09", title: "Templates et généricité", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "La STL : les conteneurs", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "La STL : algorithmes et lambdas", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "C++ moderne", sub: "Pointeurs intelligents, robustesse, projet", level: "avance",
          lessons: [
            { num: "12", title: "Les pointeurs intelligents", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Gestion d'erreurs et utilitaires modernes", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Organiser un projet et aller plus loin", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "C++ en profondeur", sub: "Concurrence, métaprogrammation, performance", level: "expert",
          lessons: [
            { num: "15", title: "Concurrence et programmation parallèle", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Métaprogrammation et templates avancés", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Performance et C++ moderne", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Tester son code", sub: "assert, Catch2, sections, CTest", level: "expert",
          lessons: [
            { num: "18", title: "Tester en C++ : assertions et Catch2", file: "lecon-18.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "C++ en pratique", sub: "Flux, hasard, fichiers, itérateurs & projet", level: "expert",
          lessons: [
            { num: "19", title: "Les flux d'entrée/sortie", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Le hasard et le temps", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Le système de fichiers", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Écrire ses propres itérateurs", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Projet : un outil d'analyse de dossier", file: "lecon-23.html", status: "complet" },
          ],
        },
      ],
    },

    csharp: {
      id: "csharp", dir: "csharp", title: "C# : applications .NET",
      glyph: "C#", accent: "#6a9b43", overview: "cours.html",
      related: [
        { course: "java", note: "C# et Java partagent l'héritage objet : l'un éclaire l'autre." },
        { course: "typescript", note: "Même famille de syntaxe typée et moderne." },
        { course: "git", note: "Versionne et collabore sur tes projets .NET." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de C#", sub: ".NET, types, conditions, méthodes", level: "intermediaire",
          lessons: [
            { num: "01", title: "Découvrir C# et .NET", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et opérateurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Méthodes et tableaux", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "POO en C#", sub: "Classes, propriétés, héritage, interfaces", level: "intermediaire",
          lessons: [
            { num: "05", title: "Classes, objets et propriétés", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Héritage et polymorphisme", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Interfaces et structures", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Énumérations, records et types modernes", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Robustesse et collections", sub: "Exceptions, génériques, LINQ", level: "intermediaire",
          lessons: [
            { num: "09", title: "Exceptions et gestion d'erreurs", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Génériques et collections", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "LINQ, délégués et lambdas", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "C# moderne", sub: "Asynchrone, projet", level: "intermediaire",
          lessons: [
            { num: "12", title: "L'asynchrone avec async/await", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Organiser un projet et aller plus loin", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "C# en profondeur", sub: "Concurrence, langage avancé, performance", level: "expert",
          lessons: [
            { num: "14", title: "Asynchrone avancé et concurrence", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Fonctionnalités avancées du langage", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Performance, mémoire et écosystème", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "C# en pratique : le web", sub: "ASP.NET Core et Entity Framework", level: "expert",
          lessons: [
            { num: "17", title: "Une API web avec ASP.NET Core", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Données avec Entity Framework Core", file: "lecon-18.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "C# : qualité, données et production", sub: "Tests, fichiers & JSON, sécurité du null", level: "expert",
          lessons: [
            { num: "19", title: "Tester son code avec xUnit et Moq", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Fichiers, JSON et sérialisation", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Sécurité du null : types références nullables", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Configuration, injection de dépendances et logging", file: "lecon-22.html", status: "complet" },
            { num: "23", title: "Projet : une bibliothèque en console", file: "lecon-23.html", status: "complet" },
          ],
        },
      ],
    },

    go: {
      id: "go", dir: "go", title: "Go : simplicité et concurrence",
      glyph: "Go", accent: "#3aa0c9", overview: "cours.html",
      related: [
        { course: "nodejs", note: "Deux approches du back-end : compare Go et Node.js." },
        { course: "rust", note: "Autre langage système moderne, avec d'autres compromis." },
        { course: "bash", note: "Go produit des binaires faciles à lancer et à scripter." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Go", sub: "Syntaxe, types, collections, structures", level: "intermediaire",
          lessons: [
            { num: "01", title: "Découvrir Go", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, variables et fonctions", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et collections", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Structures et méthodes", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Go idiomatique", sub: "Interfaces, erreurs, concurrence", level: "intermediaire",
          lessons: [
            { num: "05", title: "Interfaces et polymorphisme", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "La gestion d'erreurs", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Concurrence : goroutines et channels", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Go en pratique", sub: "Modules, tests, application", level: "intermediaire",
          lessons: [
            { num: "08", title: "Packages, modules et bibliothèque standard", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Tests et outillage", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Construire une application et aller plus loin", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Go en profondeur", sub: "Concurrence avancée, runtime, services", level: "avance",
          lessons: [
            { num: "11", title: "Patterns de concurrence et context", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Génériques, réflexion et le runtime", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Construire des services robustes", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Go en pratique", sub: "JSON, texte, temps, fichiers, projet", level: "avance",
          lessons: [
            { num: "14", title: "JSON et sérialisation", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Manipuler le texte : chaînes, runes et conversions", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Le temps : dates, durées et fuseaux", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Fichiers et entrées-sorties", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Projet : un outil en ligne de commande", file: "lecon-18.html", status: "complet" },
          ],
        },
      ],
    },

    rust: {
      id: "rust", dir: "rust", title: "Rust : sûreté mémoire sans GC",
      glyph: "Rs", accent: "#c56a3a", overview: "cours.html",
      related: [
        { course: "c", note: "Rust vise les usages du C, en supprimant les bugs mémoire." },
        { course: "cpp", note: "Une autre approche de la sûreté que le RAII du C++." },
        { course: "go", note: "Compare deux langages système modernes aux compromis opposés." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Rust", sub: "Cargo, types, structures, enums", level: "avance",
          lessons: [
            { num: "01", title: "Découvrir Rust et Cargo", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et fonctions", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Contrôle de flux et collections", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Structures, enums et pattern matching", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le système de possession", sub: "Ownership, emprunts, durées de vie", level: "avance",
          lessons: [
            { num: "05", title: "La possession (ownership)", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Emprunts et références", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Les durées de vie (lifetimes)", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Rust idiomatique", sub: "Traits, erreurs, itérateurs", level: "avance",
          lessons: [
            { num: "08", title: "Traits et génériques", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "La gestion d'erreurs", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Collections, itérateurs et closures", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Rust en pratique", sub: "Modules, concurrence, projet", level: "avance",
          lessons: [
            { num: "11", title: "Modules, crates et écosystème", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "La concurrence sans peur", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Construire un projet et aller plus loin", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Rust en profondeur", sub: "Smart pointers, traits avancés, async & unsafe", level: "expert",
          lessons: [
            { num: "14", title: "Pointeurs intelligents et mutabilité intérieure", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Traits avancés et programmation générique", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Async, unsafe et performance", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Tester son code", sub: "cargo test, assertions, intégration", level: "expert",
          lessons: [
            { num: "17", title: "Tester avec cargo test", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Rust au quotidien", sub: "Chaînes, fichiers, JSON & CLI", level: "expert",
          lessons: [
            { num: "18", title: "Chaînes de caractères et UTF-8", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Fichiers, entrées/sorties et système", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Sérialiser en JSON avec serde", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Écrire une application en ligne de commande", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Projet : un gestionnaire de tâches en ligne de commande", file: "lecon-22.html", status: "complet" },
          ],
        },
      ],
    },

    php: {
      id: "php", dir: "php", title: "PHP : le web côté serveur",
      glyph: "PHP", accent: "#6e7cb8", overview: "cours.html",
      related: [
        { course: "html", note: "PHP génère du HTML : maîtriser la structure des pages aide." },
        { course: "sql", note: "PHP interroge des bases : le SQL est son compagnon naturel." },
        { course: "git", note: "Versionne et déploie tes sites PHP." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de PHP", sub: "Syntaxe, types, fonctions, tableaux", level: "debutant",
          lessons: [
            { num: "01", title: "Découvrir PHP", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et opérateurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Fonctions et tableaux", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "PHP pour le web", sub: "Formulaires, sessions, sécurité", level: "debutant",
          lessons: [
            { num: "05", title: "Formulaires et données HTTP", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Sessions, cookies et état", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "La sécurité web", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "PHP moderne", sub: "POO, base de données, écosystème", level: "intermediaire",
          lessons: [
            { num: "08", title: "Programmation orientée objet", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "POO avancée et organisation", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Bases de données avec PDO", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Composer, frameworks et aller plus loin", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "PHP en profondeur", sub: "API REST, POO avancée, performance", level: "avance",
          lessons: [
            { num: "12", title: "Construire une API REST en JSON", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "POO avancée et fonctionnalités du langage", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Performance, tests et déploiement", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Le web avec Laravel", sub: "Routes, contrôleurs, Blade, Eloquent, auth", level: "avance",
          lessons: [
            { num: "15", title: "Découvrir Laravel : routes, contrôleurs, Blade et Eloquent", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Authentification, validation et middleware", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "PHP en pratique", sub: "Texte, temps, fichiers, API & projet", level: "avance",
          lessons: [
            { num: "17", title: "Chaînes de caractères et expressions régulières", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Dates, heures et fuseaux horaires", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Fichiers, flux et téléversement", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Consommer une API web", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "Projet : un carnet de tâches en ligne de commande", file: "lecon-21.html", status: "complet" },
          ],
        },
      ],
    },

    ruby: {
      id: "ruby", dir: "ruby", title: "Ruby : un langage pensé pour le développeur",
      glyph: "Rb", accent: "#c14a4a", overview: "cours.html",
      related: [
        { course: "python", note: "L'autre grand langage « lisible avant tout » : comparer les deux éclaire chacun." },
        { course: "javascript", note: "Blocs Ruby et callbacks JS : deux réponses au même besoin." },
        { course: "git", note: "Versionne tes scripts et tes gems dès le premier jour." },
      ],
      modules: [
        {
          num: "01", title: "Découvrir Ruby", sub: "irb, types, chaînes, conditions", level: "debutant",
          lessons: [
            { num: "01", title: "Prendre en main Ruby", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et chaînes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et vérité", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Collections et blocs", sub: "Tableaux, hachages, blocs, Enumerable", level: "debutant",
          lessons: [
            { num: "04", title: "Les tableaux", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Les hachages", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Blocs, procs et lambdas", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Enumerable en profondeur", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Objets partout", sub: "Méthodes, classes, mixins, métaprogrammation", level: "intermediaire",
          lessons: [
            { num: "08", title: "Méthodes : l'art du message", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Classes et objets", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Héritage, modules et mixins", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Métaprogrammation : Ruby qui écrit Ruby", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Ruby en pratique", sub: "Fichiers, gems, tests, écosystème", level: "intermediaire",
          lessons: [
            { num: "12", title: "Fichiers, erreurs et robustesse", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Gems, Bundler et structure de projet", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Tester son Ruby", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Vers Rails et l'écosystème web", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Le web avec Rails", sub: "MVC, scaffolding, ActiveRecord, vues ERB", level: "avance",
          lessons: [
            { num: "16", title: "Découvrir Rails : MVC et scaffolding", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "ActiveRecord et les vues", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Ruby au quotidien", sub: "Chaînes, expressions régulières, JSON et web", level: "avance",
          lessons: [
            { num: "18", title: "Chaînes et expressions régulières", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "JSON, le web et les APIs", file: "lecon-19.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Aller plus loin", sub: "Pattern matching, concurrence et projet", level: "expert",
          lessons: [
            { num: "20", title: "Le pattern matching (case/in)", file: "lecon-20.html", status: "complet" },
            { num: "21", title: "La concurrence : threads, GVL et Ractor", file: "lecon-21.html", status: "complet" },
            { num: "22", title: "Projet : un carnet de contacts en ligne de commande", file: "lecon-22.html", status: "complet" },
          ],
        },
      ],
    },

    kotlin: {
      id: "kotlin", dir: "kotlin", title: "Kotlin : le JVM moderne et Android",
      glyph: "Kt", accent: "#7a5cc6", overview: "cours.html",
      related: [
        { course: "java", note: "Kotlin tourne sur la JVM et dialogue avec Java : connaître l'un éclaire l'autre." },
        { course: "mobile", note: "Kotlin est le langage d'Android ; le cours « application mobile » couvre ce qui fait une vraie app — état, listes performantes, notifications, magasins." },
        { course: "typescript", note: "Même esprit : un typage moderne qui attrape les erreurs avant l'exécution." },
        { course: "git", note: "Versionne tes projets Kotlin et Android dès le départ." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Kotlin", sub: "val/var, null-safety, when, fonctions", level: "intermediaire",
          lessons: [
            { num: "01", title: "Découvrir Kotlin", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, chaînes et null-safety", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et when", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Les fonctions", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Collections et lambdas", sub: "List/Map, fonctions d'ordre supérieur, séquences", level: "intermediaire",
          lessons: [
            { num: "05", title: "Les collections", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Lambdas et fonctions d'ordre supérieur", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Traiter des données : chaînage et séquences", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "L'objet à la Kotlin", sub: "Data classes, sealed, génériques, extensions", level: "avance",
          lessons: [
            { num: "08", title: "Classes et propriétés", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Data classes, enums et sealed classes", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Héritage et interfaces", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Génériques, lazy et delegation", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Extensions et scope functions", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Kotlin en pratique", sub: "Coroutines, interop Java, Android", level: "avance",
          lessons: [
            { num: "13", title: "Coroutines : l'asynchrone serein", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Interopérabilité Java et outillage", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Premiers pas vers Android", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Tester son code", sub: "kotlin.test, exceptions, coroutines", level: "avance",
          lessons: [
            { num: "16", title: "Tester son code Kotlin", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Kotlin avancé et écosystème", sub: "Flows, DSL, sérialisation, multiplateforme", level: "expert",
          lessons: [
            { num: "17", title: "Flows : les flux asynchrones", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Construire un DSL", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Sérialisation avec kotlinx.serialization", file: "lecon-19.html", status: "complet" },
            { num: "20", title: "Kotlin Multiplateforme : un code, toutes les cibles", file: "lecon-20.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Projet de synthèse", sub: "Assembler tout le cours en un programme complet", level: "expert",
          lessons: [
            { num: "21", title: "Projet de synthèse — un inventaire de bout en bout", file: "lecon-21.html", status: "complet" },
          ],
        },
      ],
    },

    swift: {
      id: "swift", dir: "swift", title: "Swift : développer pour l'écosystème Apple",
      glyph: "Sw", accent: "#d97842", overview: "cours.html",
      related: [
        { course: "mobile", note: "Swift écrit le code ; le cours « application mobile » explique tout ce qui l'entoure — cycle de vie, navigation, hors-ligne, permissions, publication sur l'App Store." },
        { course: "kotlin", note: "L'équivalent côté Android : optionnels, value types et concurrence moderne." },
        { course: "typescript", note: "Même goût du typage sûr et de l'inférence." },
        { course: "git", note: "Versionne tes projets Xcode et Swift Package Manager." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Swift", sub: "Optionnels, switch, fonctions, closures", level: "intermediaire",
          lessons: [
            { num: "01", title: "Découvrir Swift", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, chaînes et optionnels", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et switch", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Fonctions et closures", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Collections et valeurs", sub: "Tableaux, structs, classes, énumérations", level: "intermediaire",
          lessons: [
            { num: "05", title: "Tableaux, ensembles et dictionnaires", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Structs et classes", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Énumérations et pattern matching", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Protocoles et généricité", sub: "Protocoles, génériques, mémoire et erreurs", level: "avance",
          lessons: [
            { num: "08", title: "Les protocoles", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Génériques et extensions", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Gestion de la mémoire et des erreurs", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Swift en pratique", sub: "Concurrence, outils, SwiftUI", level: "avance",
          lessons: [
            { num: "11", title: "Concurrence : async/await et actors", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Outils, paquets et tests", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Premiers pas vers SwiftUI", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "SwiftUI : partager l'état et naviguer", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Codable : lire et écrire du JSON", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Swift idiomatique", sub: "Result, style fonctionnel, property wrappers", level: "avance",
          lessons: [
            { num: "16", title: "Result et le style fonctionnel", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Property wrappers et sémantique de valeur", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Assembler une app SwiftUI complète", level: "avance",
          lessons: [
            { num: "18", title: "Projet : une app de tâches en SwiftUI", file: "lecon-18.html", status: "complet" },
          ],
        },
      ],
    },

    r: {
      id: "r", dir: "r", title: "R : statistiques et analyse de données",
      glyph: "R", accent: "#3f6db5", overview: "cours.html",
      related: [
        { course: "python", note: "L'autre grand langage de la data science : comparer les deux est éclairant." },
        { course: "sql", note: "Interroge des bases pour alimenter tes analyses R." },
        { course: "dataviz", note: "La grammaire des graphiques de ggplot2 se retrouve, côté Python, dans le cours de data visualisation." },
        { course: "stats", note: "R est né pour la statistique : le cours de statistiques appliquées en donne les concepts, indépendamment du langage." },
      ],
      modules: [
        {
          num: "01", title: "Découvrir R", sub: "Vecteurs, indexation, vectorisation",
          lessons: [
            { num: "01", title: "Prendre en main R", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Vecteurs, types et indexation", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et vectorisation", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Manipuler des données", sub: "Data frames, dplyr, tidyr",
          lessons: [
            { num: "04", title: "Listes et data frames", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Transformer avec dplyr", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Importer, nettoyer et remodeler", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Visualiser et analyser", sub: "ggplot2, stats, inférence, modèles",
          lessons: [
            { num: "07", title: "Visualiser avec ggplot2", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Statistiques descriptives", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Inférence : tests et intervalles", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Modèles : la régression", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "R en pratique", sub: "purrr, rapports reproductibles",
          lessons: [
            { num: "11", title: "Programmer proprement en R", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Rapports reproductibles et écosystème", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Aller plus loin", sub: "Texte, dates, jointures, itération",
          lessons: [
            { num: "13", title: "Chaînes de caractères et expressions régulières", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Facteurs et dates : forcats et lubridate", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Joindre des tables : les jointures dplyr", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Programmation fonctionnelle avec purrr", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Analyse de données de bout en bout",
          lessons: [
            { num: "17", title: "Projet — une analyse de données de bout en bout", file: "lecon-17.html", status: "complet" },
          ],
        },
      ],
    },

    pandas: {
      id: "pandas", dir: "pandas", title: "pandas : analyser des données avec Python",
      glyph: "pd", accent: "#5a4fcf", overview: "cours.html",
      related: [
        { course: "python", note: "pandas est une bibliothèque Python : le cours Python pose les bases du langage." },
        { course: "sql", note: "groupby, jointures et filtres de pandas sont les cousins directs de GROUP BY, JOIN et WHERE." },
        { course: "dataviz", note: "Une fois les données prêtes et agrégées, il faut les donner à voir : la suite naturelle de pandas." },
        { course: "r", note: "L'autre grand langage de l'analyse de données : data frames et dplyr côté R." },
        { course: "ml", note: "pandas prépare et nettoie les données que scikit-learn va apprendre." },
        { course: "stats", note: ".describe(), .corr() et les percentiles calculés par pandas prennent tout leur sens avec les statistiques du cours dédié." },
      ],
      modules: [
        {
          num: "01", title: "Prendre pandas en main", sub: "Series, DataFrame, charger, types, valeurs manquantes", level: "intermediaire",
          lessons: [
            { num: "01", title: "Series et DataFrame : les deux structures", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Charger et inspecter un jeu de données", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Types de colonnes et conversions", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Les valeurs manquantes", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Sélectionner et transformer", sub: "loc/iloc, filtres booléens, tri, colonnes calculées", level: "intermediaire",
          lessons: [
            { num: "05", title: "Sélectionner lignes et colonnes", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Filtrer avec des conditions", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Trier et classer", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Colonnes calculées et texte", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Regrouper et relier", sub: "groupby, tableaux croisés, jointures", level: "avance",
          lessons: [
            { num: "09", title: "Regrouper et agréger", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Croiser et pivoter", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Combiner des tables", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller au bout", sub: "séries temporelles, export, projet complet", level: "avance",
          lessons: [
            { num: "12", title: "Séries temporelles", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Exporter et présenter", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet — une analyse de ventes de bout en bout", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    dataviz: {
      id: "dataviz", dir: "dataviz", title: "Data visualisation : donner à voir les données",
      glyph: "dv", accent: "#c2410c", overview: "cours.html",
      related: [
        { course: "pandas", note: "pandas prépare et agrège les tableaux que l'on trace ; sa méthode .plot() est le pont direct vers un graphique." },
        { course: "python", note: "matplotlib, la bibliothèque de tracé des exemples, est du Python : le langage sous les graphiques." },
        { course: "r", note: "L'autre grand atelier de dataviz : ggplot2 applique la même grammaire des graphiques, côté R." },
        { course: "ux", note: "Lisibilité, hiérarchie visuelle, couleur et daltonisme : une bonne dataviz, c'est de l'UX appliquée aux données." },
        { course: "stats", note: "Histogramme, boîte à moustaches, nuage de corrélation : on visualise surtout des objets statistiques. Le cours de statistiques en donne le sens." },
      ],
      modules: [
        {
          num: "01", title: "Voir pour comprendre", sub: "pourquoi visualiser, la grammaire, choisir la forme", level: "intermediaire",
          lessons: [
            { num: "01", title: "Pourquoi visualiser des données", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "La grammaire d'un graphique", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Choisir la forme selon la question", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "La boîte à outils", sub: "barres, courbes, distributions, nuages, compositions", level: "intermediaire",
          lessons: [
            { num: "04", title: "Comparer des catégories : les barres", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Suivre une évolution : courbes et aires", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Décrire une distribution", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Relier deux variables : le nuage de points", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Montrer une composition", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Bien encoder", sub: "échelle, couleur, densité, cartes", level: "avance",
          lessons: [
            { num: "09", title: "L'échelle qui ment", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "La couleur qui parle", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Quand il y a trop de points", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Cartographier des données", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Communiquer", sub: "annoter, raconter, démasquer les graphiques trompeurs", level: "avance",
          lessons: [
            { num: "13", title: "Annoter et raconter une histoire", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet — les graphiques qui mentent, et le tableau de bord refait", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    stats: {
      id: "stats", dir: "stats", title: "Statistiques appliquées pour développeurs",
      glyph: "st", accent: "#3949ab", overview: "cours.html",
      related: [
        { course: "pandas", note: "pandas calcule ces statistiques sur de vraies données : .mean(), .median(), .std(), .describe() et .corr() sont l'application directe de ce cours." },
        { course: "dataviz", note: "Une distribution, une corrélation, un intervalle : la statistique se lit surtout en images. La dataviz est son bras visuel." },
        { course: "python", note: "Les exemples s'écrivent en Python (module statistics, un peu de numpy) : le langage sous les calculs." },
        { course: "ml", note: "Régression, sur-ajustement, échantillon d'entraînement et de test : le machine learning est de la statistique appliquée à grande échelle." },
        { course: "neurones", note: "Un réseau apprend en minimisant une erreur mesurée : perte, moyenne, jeu de test. Ce cours-ci fournit les notions dont le module « Ce qui rate » se sert en permanence." },
        { course: "maths", note: "Ensembles, dénombrement et probabilités, pris à la racine — ce que les statistiques appliquées supposent connu." },
      ],
      modules: [
        {
          num: "01", title: "Décrire des données", sub: "centre, dispersion, forme d'une distribution", level: "debutant",
          lessons: [
            { num: "01", title: "Pourquoi les statistiques, quand on code", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le centre : moyenne, médiane, mode", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "La dispersion : étendue, écart-type, quartiles", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "La forme d'une distribution", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "De l'échantillon à la population", sub: "échantillonner, hasard, intervalle de confiance, valeur p", level: "intermediaire",
          lessons: [
            { num: "05", title: "Échantillonner sans se tromper", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Hasard, probabilités et loi normale", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "L'incertitude d'une mesure : l'intervalle de confiance", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Comparer deux groupes : test d'hypothèse et valeur p", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Relations entre variables", sub: "corrélation, causalité, régression, prédiction", level: "intermediaire",
          lessons: [
            { num: "09", title: "La corrélation, et ce qu'elle rate", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Corrélation n'est pas causalité", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "La régression linéaire simple", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Prédire, et connaître ses limites", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Ne pas se faire avoir", sub: "p-hacking, biais de survie, paradoxe de Simpson, projet", level: "avance",
          lessons: [
            { num: "13", title: "Les pièges qui faussent tout", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Le paradoxe de Simpson et les moyennes trompeuses", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Projet — une analyse honnête de bout en bout", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },

    "data-eng": {
      id: "data-eng", dir: "data-eng", title: "Ingénierie de données : construire des pipelines",
      glyph: "de", accent: "#0f766e", overview: "cours.html",
      related: [
        { course: "sql", note: "L'ingénierie de données orchestre du SQL à grande échelle : les transformations d'un pipeline sont, très souvent, des requêtes. SQL enseigne le langage ; ce cours, comment l'industrialiser." },
        { course: "nosql", note: "Files d'événements, documents, stockage objet : un pipeline puise et déverse dans des bases non relationnelles autant que dans un entrepôt. Deux mondes que l'ingénieur data relie." },
        { course: "iac", note: "Un pipeline vit sur une infrastructure — entrepôt, orchestrateur, stockage — qu'on décrit en code pour la rendre reproductible. L'IaC est le socle sur lequel tourne le pipeline." },
        { course: "observabilite", note: "Un pipeline se surveille comme un service : fraîcheur, volumétrie, taux d'échec, lignage. Les métriques, logs et alertes du cours observabilité s'appliquent directement aux données." },
        { course: "bdd", note: "Un pipeline alimente des tables ; encore faut-il qu'elles soient bien conçues. Ce cours enseigne la modélisation et la normalisation en amont de l'ingénierie." },
      ],
      modules: [
        {
          num: "01", title: "Penser en pipeline", sub: "données brutes, sources et puits, ETL/ELT, formats", level: "intermediaire",
          lessons: [
            { num: "01", title: "Qu'est-ce que l'ingénierie de données ?", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Le trajet d'une donnée : sources, puits, batch et flux", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "ETL ou ELT : transformer avant ou après ?", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Les formats de données : CSV, JSON, Parquet", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Construire un pipeline robuste", sub: "ingestion, transformation, partitionnement, idempotence", level: "intermediaire",
          lessons: [
            { num: "05", title: "Ingérer une source : pleine ou incrémentale", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Transformer proprement : bronze, silver, gold", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Partitionner et organiser le stockage", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Idempotence et reprise : rejouer sans doublonner", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Faire tourner et faire confiance", sub: "orchestration, qualité, contrats, observabilité", level: "intermediaire",
          lessons: [
            { num: "09", title: "Orchestrer : DAG, dépendances et planification", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "La qualité des données : tester ce qui coule", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Les contrats de données et l'évolution de schéma", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Observer un pipeline : fraîcheur, lignage, alertes", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "À l'échelle et en production", sub: "coût, volumétrie, projet de bout en bout", level: "avance",
          lessons: [
            { num: "13", title: "Coût et volumétrie : quand la donnée devient chère", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet : le pipeline de Vélociti de bout en bout", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    bdd: {
      id: "bdd", dir: "bdd", title: "Concevoir une base de données",
      glyph: "bd", accent: "#8a3d62", overview: "cours.html",
      related: [
        { course: "sql", note: "SQL apprend à interroger une base ; ce cours apprend à la dessiner. L'un écrit les requêtes, l'autre décide des tables qu'elles interrogent — les deux faces d'une même compétence." },
        { course: "nosql", note: "Toutes les bases ne sont pas relationnelles. Le NoSQL modélise par documents et par agrégats ; la dernière leçon montre comment Rideau se penserait de ce côté, et quand le choisir." },
        { course: "archi", note: "Le schéma d'une base engage tout le système : ses choix se paient longtemps. Concevoir une base, c'est déjà faire de l'architecture — celle des données." },
        { course: "data-eng", note: "Les pipelines déplacent et transforment les données à grande échelle ; encore leur faut-il des schémas sains au départ. Ce cours conçoit les tables que l'ingénierie de données alimente." },
      ],
      modules: [
        {
          num: "01", title: "Du besoin au modèle", sub: "entités, attributs, relations, modèle entité-association", level: "intermediaire",
          lessons: [
            { num: "01", title: "Concevoir une base avant de la coder", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Repérer les entités et leurs attributs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Relier les entités : les cardinalités", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Le modèle entité-association : du diagramme aux tables", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Clés et intégrité", sub: "clés primaires, clés étrangères, contraintes", level: "intermediaire",
          lessons: [
            { num: "05", title: "Les clés primaires : identifier chaque ligne", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Les clés étrangères et l'intégrité référentielle", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Les contraintes : laisser la base dire non", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "La juste normalisation", sub: "1re, 2e et 3e formes normales, dénormalisation", level: "intermediaire",
          lessons: [
            { num: "08", title: "La redondance et la première forme normale", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Deuxième et troisième formes normales", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Dénormaliser à bon escient", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Performance, concurrence et vie du schéma", sub: "index, plan d'exécution, transactions, migrations, projet", level: "avance",
          lessons: [
            { num: "11", title: "Les index : ce qu'ils coûtent, ce qu'ils rapportent", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Lire un plan d'exécution", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Transactions et isolation : le cas du dernier billet", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Faire évoluer un schéma : les migrations", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Projet : concevoir la base de Rideau de bout en bout", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },

    mobile: {
      id: "mobile", dir: "mobile", title: "Développer une application mobile",
      glyph: "mo", accent: "#2563eb", overview: "cours.html",
      related: [
        { course: "swift", note: "Le natif Apple : SwiftUI met en œuvre concrètement le cycle de vie, la navigation et les listes de ce cours sur iOS." },
        { course: "kotlin", note: "Le natif Android : Jetpack Compose applique les mêmes notions — état, navigation, listes performantes — côté Google." },
        { course: "dart", note: "Flutter, la voie multiplateforme : un seul code pour iOS et Android, et tous les concepts de ce cours réunis dans un même projet." },
        { course: "ux", note: "Une application se juge à son ergonomie tactile : cibles, gestes, états, hiérarchie visuelle — le cours UX en donne les règles." },
      ],
      modules: [
        {
          num: "01", title: "Le terrain du mobile", sub: "ce qui change, natif ou multiplateforme, cycle de vie, architecture", level: "intermediaire",
          lessons: [
            { num: "01", title: "Développer pour mobile : ce qui change vraiment", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Natif ou multiplateforme : choisir son approche", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Le cycle de vie d'une application", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "L'architecture d'une app : écrans, composants, état", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Construire l'interface", sub: "navigation, état, listes performantes, adaptation aux écrans", level: "intermediaire",
          lessons: [
            { num: "05", title: "Naviguer entre les écrans", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "L'état et la remontée d'événements", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Les listes performantes", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "S'adapter à tous les écrans", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "L'app dans le monde réel", sub: "stockage local, réseau, hors ligne, permissions, notifications", level: "intermediaire",
          lessons: [
            { num: "09", title: "Stocker des données sur l'appareil", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Parler au réseau : appeler une API sans figer l'écran", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Fonctionner hors ligne : le stockage local fait autorité", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Permissions et vie privée", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Les notifications, à bon escient", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Livrer et tenir dans la durée", sub: "tester sur appareil, publier sur les magasins, projet complet", level: "avance",
          lessons: [
            { num: "14", title: "Tester sur un appareil réel", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Publier Carnet : des magasins à la première version", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },

    equipe: {
      id: "equipe", dir: "equipe", title: "Travailler à plusieurs sur du code",
      glyph: "eq", accent: "#6d28d9", overview: "cours.html",
      related: [
        { course: "git", note: "Git fournit les branches, les commits et les fusions ; ce cours enseigne les usages humains autour — écrire un message de commit qui raconte, ouvrir une demande de fusion qu'on a envie de relire, garder un historique lisible." },
        { course: "tests", note: "Les tests donnent la confiance qui rend une revue rapide et une fusion sereine. Ce cours les suppose acquis et montre leur rôle dans le processus collectif : relire, livrer, gérer un incident sans tout casser." },
        { course: "archi", note: "L'architecture décide des structures qui durent ; ce cours en traite la face humaine : documenter les décisions, nommer et traiter la dette technique, se mettre d'accord à plusieurs sur ce qui compte." },
        { course: "cicd", note: "L'intégration continue automatise le style, les tests et le déploiement dont ce cours parle côté équipe : brancher le formatage sur la CI, relire vite, et gérer les incidents que la mise en production révèle." },
        { course: "offensive", note: "Signaler une faille est un exercice d'écriture avant d'être un exercice technique : un rapport reproductible, daté, sans esbroufe, adressé à quelqu'un qui devra le corriger." },
      ],
      modules: [
        {
          num: "01", title: "Entrer dans le code des autres", sub: "lire, comprendre, être intégré", level: "intermediaire",
          lessons: [
            { num: "01", title: "Coder à plusieurs change tout", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Lire le code des autres", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Rejoindre un projet : être intégré, et intégrer", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "La revue de code", sub: "faire et recevoir une relecture, automatiser le style", level: "intermediaire",
          lessons: [
            { num: "04", title: "Faire une revue utile", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Recevoir une revue sans la prendre mal", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Ne plus débattre du style : conventions et automatisation", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Communiquer autour du code", sub: "commits, demandes de fusion, documentation, estimation", level: "intermediaire",
          lessons: [
            { num: "07", title: "Écrire un bon message de commit", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Une demande de fusion qu'on a envie de relire", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Documenter ce qui compte", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Estimer sans se mentir", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Vivre le projet dans la durée", sub: "dette technique, incidents, post-mortem, projet", level: "avance",
          lessons: [
            { num: "11", title: "La dette technique : la nommer, la rendre visible, la traiter", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Quand ça casse : gérer un incident", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "L'après-incident sans chercher de coupable", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet — un cycle d'équipe de bout en bout", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    dart: {
      id: "dart", dir: "dart", title: "Dart & Flutter : applications multiplateformes",
      glyph: "Da", accent: "#2fa3b8", overview: "cours.html",
      related: [
        { course: "mobile", note: "Flutter est un moyen ; le cours « application mobile » donne la fin — cycle de vie, hors-ligne, permissions, publication — quel que soit l'outil." },
        { course: "swift", note: "L'autre voie vers le mobile : compare l'approche Flutter et SwiftUI." },
        { course: "kotlin", note: "Côté Android natif : deux philosophies pour la même plateforme." },
        { course: "javascript", note: "Dart compile aussi en JavaScript : un cousin du web." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Dart", sub: "Null safety, collections, fonctions",
          lessons: [
            { num: "01", title: "Découvrir Dart", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, null safety et chaînes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et collections", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Fonctions et closures", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Objets et asynchrone", sub: "Classes, mixins, Future, Streams",
          lessons: [
            { num: "05", title: "Classes et constructeurs", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Héritage, mixins et interfaces", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Asynchrone : Future et async/await", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Streams et génériques", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Vers Flutter", sub: "Outils, widgets, une petite app",
          lessons: [
            { num: "09", title: "Erreurs, tests et outillage", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Premiers widgets Flutter", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Une petite app Flutter", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Flutter en pratique", sub: "Mise en page, état, navigation, données, projet",
          lessons: [
            { num: "12", title: "La mise en page : Row, Column, Expanded, Stack", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Gérer l'état : setState, lifting up, Provider", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Naviguer entre écrans : Navigator et routes", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Réseau et données : JSON et HTTP", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Projet de synthèse : une app d'inventaire", file: "lecon-16.html", status: "complet" },
          ],
        },
      ],
    },

    lua: {
      id: "lua", dir: "lua", title: "Lua : scripting léger et embarqué",
      glyph: "Lua", accent: "#4a5fc1", overview: "cours.html",
      related: [
        { course: "javascript", note: "Un autre langage de script à fonctions de première classe et closures." },
        { course: "python", note: "Comparer deux langages « simples » éclaire les choix de chacun." },
        { course: "c", note: "Lua s'embarque dans des programmes C : comprendre le C aide à saisir son rôle." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Lua", sub: "Types, vérité, boucles, fonctions", level: "debutant",
          lessons: [
            { num: "01", title: "Découvrir Lua", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, variables et chaînes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Fonctions et portée", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Les tables", sub: "Tableaux, dictionnaires, métatables, POO", level: "intermediaire",
          lessons: [
            { num: "05", title: "Les tables comme tableaux", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Les tables comme dictionnaires et structures", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Métatables et métaméthodes", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Programmation orientée objet", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Lua en pratique", sub: "Modules, coroutines, Lua embarqué", level: "intermediaire",
          lessons: [
            { num: "09", title: "Modules et bibliothèque standard", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Coroutines et gestion d'erreurs", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Lua embarqué et écosystème", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Faire un jeu avec LÖVE", sub: "Boucle de jeu, clavier, collisions, score", level: "intermediaire",
          lessons: [
            { num: "12", title: "Créer un jeu complet avec LÖVE", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Aller plus loin", sub: "Motifs, itérateurs, performance", level: "avance",
          lessons: [
            { num: "13", title: "Les motifs de chaînes (patterns)", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Itérateurs et la boucle for générique", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Performance et gestion mémoire", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Maîtriser Lua", sub: "Fonctionnel, environnements, sérialisation, tests", level: "avance",
          lessons: [
            { num: "16", title: "Programmation fonctionnelle en Lua", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Environnements et bac à sable", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Sérialiser et persister des données", file: "lecon-18.html", status: "complet" },
            { num: "19", title: "Tester et fiabiliser son code", file: "lecon-19.html", status: "complet" },
          ],
        },
        {
          num: "07", title: "Projet", sub: "Un moteur de configuration", level: "avance",
          lessons: [
            { num: "20", title: "Projet : un moteur de configuration", file: "lecon-20.html", status: "complet" },
          ],
        },
      ],
    },

    asm: {
      id: "asm", dir: "asm", title: "Assembleur x86-64 : parler à la machine",
      glyph: "asm", accent: "#4a4f8c", overview: "cours.html",
      related: [
        { course: "c", note: "Le C est le pont naturel vers l'assembleur : pointeurs et mémoire d'abord." },
        { course: "rust", note: "Comprendre la machine éclaire les garanties de Rust (et son unsafe)." },
        { course: "cpp", note: "Lire l'assembleur produit par le compilateur aide à optimiser en C++." },
        { course: "compilation", note: "D'où vient cet assembleur ? Le cours remonte la chaîne, du texte source jusqu'à la génération de code." },
      ],
      modules: [
        {
          num: "01", title: "La machine", sub: "Registres, mémoire, drapeaux, sauts",
          lessons: [
            { num: "01", title: "Découvrir l'assembleur", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Registres et instructions de base", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Mémoire, drapeaux et sauts", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Structurer le code", sub: "Pile, fonctions, ABI, syscalls",
          lessons: [
            { num: "04", title: "La pile et les fonctions", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Conventions d'appel et ABI", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Appels système et entrées/sorties", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Données et lecture", sub: "Structures, code compilé, sécurité",
          lessons: [
            { num: "07", title: "Tableaux, chaînes et structures", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Lire le code du compilateur", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Flottants et SIMD (survol)", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Du code à la machine : panorama final", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Assembleur en pratique", sub: "Débogage, édition de liens, optimisation, interfaçage & projet",
          lessons: [
            { num: "11", title: "Déboguer en assembleur avec GDB", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "De la source à l'exécutable", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Ce que fait l'optimiseur", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Assembleur et C : inline asm et ABI", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Projet de synthèse : une fonction asm, du C au débogueur", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },

    haskell: {
      id: "haskell", dir: "haskell", title: "Haskell : la programmation fonctionnelle pure",
      glyph: "λ", accent: "#7d6bb5", overview: "cours.html",
      related: [
        { course: "javascript", note: "map, filter et les fonctions pures de Haskell se retrouvent en JS moderne." },
        { course: "rust", note: "Rust hérite de Haskell : types algébriques, traits, pattern matching." },
        { course: "elixir", note: "Un autre fonctionnel, plus pragmatique et orienté concurrence." },
      ],
      modules: [
        {
          num: "01", title: "Penser fonctionnel", sub: "Pureté, récursion, ordre supérieur", level: "avance",
          lessons: [
            { num: "01", title: "Découvrir Haskell", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types et fonctions pures", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Listes et récursion", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Fonctions d'ordre supérieur", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le système de types", sub: "Types algébriques, classes, monades", level: "avance",
          lessons: [
            { num: "05", title: "Types algébriques et pattern matching", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Type classes", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Foncteurs et applicatives", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Les monades, démystifiées", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Haskell en pratique", sub: "IO, paresse, outils, projet", level: "avance",
          lessons: [
            { num: "09", title: "IO et le monde réel", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Évaluation paresseuse", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Modules, outils et tests", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Gérer l'état et structurer", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Un vrai programme et l'écosystème", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Haskell avancé", sub: "Abstractions, effets composés, analyse, concurrence", level: "expert",
          lessons: [
            { num: "14", title: "Monoïdes, Foldable et Traversable", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Les transformers de monades", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Les combinateurs d'analyseurs", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "La concurrence : threads légers, MVar et STM", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet de synthèse", sub: "Assembler tout Haskell dans un outil complet", level: "expert",
          lessons: [
            { num: "18", title: "Projet de synthèse — un inventaire de bout en bout", file: "lecon-18.html", status: "complet" },
          ],
        },
      ],
    },

    elixir: {
      id: "elixir", dir: "elixir", title: "Elixir : la concurrence sereine",
      glyph: "Ex", accent: "#8a5c9e", overview: "cours.html",
      related: [
        { course: "ruby", note: "Elixir emprunte sa syntaxe à Ruby : un terrain familier." },
        { course: "haskell", note: "L'autre versant du fonctionnel : pur vs pragmatique et concurrent." },
        { course: "nodejs", note: "Comparer deux approches du temps réel et des serveurs." },
      ],
      modules: [
        {
          num: "01", title: "Découvrir Elixir", sub: "Pattern matching, modules, collections",
          lessons: [
            { num: "01", title: "Découvrir Elixir", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types et pattern matching", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Fonctions, modules et clauses", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Collections : listes, tuples et maps", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le cœur fonctionnel", sub: "Enum/Stream, le pipe, gestion d'erreur",
          lessons: [
            { num: "05", title: "Récursion, Enum et Stream", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Le pipe et le flux de données", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Gérer l'erreur : with, case et :ok/:error", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Concurrence et OTP", sub: "Processus, GenServer, supervision, Phoenix",
          lessons: [
            { num: "08", title: "Processus et messages", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "GenServer et l'état", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Supervision et tolérance aux pannes", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Mix, tests et écosystème", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Vers Phoenix et le temps réel", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Elixir : aller plus loin", sub: "Structs, protocoles, concurrence, métaprogrammation, Ecto",
          lessons: [
            { num: "13", title: "Structs et protocoles", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Task et Agent", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Métaprogrammation : quote, unquote et macros", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Ecto : penser ses données", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Projet de synthèse : un service d'inventaire", file: "lecon-17.html", status: "complet" },
          ],
        },
      ],
    },

    scala: {
      id: "scala", dir: "scala", title: "Scala : objet et fonctionnel sur la JVM",
      glyph: "Sc", accent: "#c44536", overview: "cours.html",
      related: [
        { course: "java", note: "Scala tourne sur la JVM et dialogue avec Java : l'un éclaire l'autre." },
        { course: "haskell", note: "Le versant fonctionnel pur que Scala rend accessible et pragmatique." },
        { course: "kotlin", note: "Deux modernisations de la JVM aux choix de conception différents." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Scala", sub: "Expressions, fonctions, collections",
          lessons: [
            { num: "01", title: "Découvrir Scala", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, expressions et chaînes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Fonctions et ordre supérieur", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Les collections", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Objet et fonctionnel", sub: "Case classes, traits, pattern matching",
          lessons: [
            { num: "05", title: "Classes, objects et case classes", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Traits, héritage et composition", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Pattern matching", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Option, Try et la gestion d'erreur", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Scala en pratique", sub: "given, Futures, sbt, big data",
          lessons: [
            { num: "09", title: "Génériques et given/using", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Concurrence avec les Futures", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "sbt, tests et outillage", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Vers le big data et au-delà", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Scala avancé", sub: "For-comprehensions, collections, type classes, validation",
          lessons: [
            { num: "13", title: "For-comprehensions : enchaîner sans se noyer", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Collections : immutabilité, vues et performances", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Type classes : la polymorphie avec given/using", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Valider proprement : Either, court-circuit et accumulation", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Capstone : un gestionnaire d'inventaire",
          lessons: [
            { num: "17", title: "Projet : un gestionnaire d'inventaire fonctionnel", file: "lecon-17.html", status: "complet" },
          ],
        },
      ],
    },

    powershell: {
      id: "powershell", dir: "powershell", title: "PowerShell : automatiser Windows",
      glyph: "PS", accent: "#2f6fb0", overview: "cours.html",
      related: [
        { course: "bash", note: "L'équivalent côté Unix : comparer les deux shells est éclairant." },
        { course: "python", note: "Un autre grand langage d'automatisation et de scripting." },
        { course: "git", note: "Versionne tes scripts d'automatisation dès le départ." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de PowerShell", sub: "Cmdlets, pipeline, conditions",
          lessons: [
            { num: "01", title: "Découvrir PowerShell", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et opérateurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Le pipeline d'objets", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Conditions et boucles", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Scripts et fonctions", sub: "Scripts, fonctions avancées, erreurs",
          lessons: [
            { num: "05", title: "Écrire des scripts", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Fonctions et paramètres avancés", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Tableaux, hashtables et chaînes", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Gestion des erreurs", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Administrer le système", sub: "Fichiers, .NET, remoting, bonnes pratiques",
          lessons: [
            { num: "09", title: "Fichiers, registre et système", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Modules, objets et .NET", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Remoting et automatisation", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Bonnes pratiques et écosystème", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "PowerShell en pratique", sub: "Texte, API web, classes, sécurité",
          lessons: [
            { num: "13", title: "Manipuler le texte : les expressions régulières", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Dialoguer avec le Web : REST et JSON", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Programmation objet : les classes PowerShell", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Sécuriser ses scripts : identifiants, secrets et signature", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Assembler un outil complet",
          lessons: [
            { num: "17", title: "Projet — un tableau de bord système", file: "lecon-17.html", status: "complet" },
          ],
        },
      ],
    },

    perl: {
      id: "perl", dir: "perl", title: "Perl : le couteau suisse du texte",
      glyph: "Pl", accent: "#3a5f8a", overview: "cours.html",
      related: [
        { course: "bash", note: "Le duo classique de l'administration Unix : shell et traitement de texte." },
        { course: "python", note: "Le langage qui a souvent succédé à Perl : comparer les deux éclaire." },
        { course: "sql", note: "Perl interroge volontiers des bases de données via DBI." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Perl", sub: "Sigils, données, contexte",
          lessons: [
            { num: "01", title: "Découvrir Perl", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Scalaires, tableaux et hachages", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et contexte", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le texte et les motifs", sub: "Regex, substitution, fichiers",
          lessons: [
            { num: "04", title: "Les expressions régulières", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Manipuler le texte", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Fichiers et entrées/sorties", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Perl structuré", sub: "Sous-programmes, références, CPAN, POO",
          lessons: [
            { num: "07", title: "Sous-programmes et portée", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Références et structures de données", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Modules et CPAN", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Programmation objet", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Bonnes pratiques et écosystème", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Perl en pratique", sub: "Regex avancées, données, bases de données, erreurs",
          lessons: [
            { num: "12", title: "Les expressions régulières avancées", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Traiter des formats de données : CSV et JSON", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Interroger une base de données avec DBI", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Gérer les erreurs : die, eval, Try::Tiny et Carp", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Mettre en pratique tout le cours",
          lessons: [
            { num: "16", title: "Projet — un analyseur de journaux", file: "lecon-16.html", status: "complet" },
          ],
        },
      ],
    },

    cobol: {
      id: "cobol", dir: "cobol", title: "COBOL : le langage des systèmes bancaires",
      glyph: "Cb", accent: "#3f7a8c", overview: "cours.html",
      related: [
        { course: "sql", note: "Le COBOL de production interroge souvent DB2 en SQL embarqué." },
        { course: "fortran", note: "L'autre grand survivant des débuts : calcul scientifique vs gestion." },
        { course: "c", note: "Comprendre la mémoire et les formats aide à lire le COBOL bas niveau." },
      ],
      modules: [
        {
          num: "01", title: "Découvrir COBOL", sub: "Divisions, structure, PICTURE",
          lessons: [
            { num: "01", title: "Découvrir COBOL", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "La structure d'un programme", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Décrire les données : PICTURE", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Logique et traitement", sub: "MOVE, calculs, PERFORM, tables",
          lessons: [
            { num: "04", title: "Déplacer et calculer", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Conditions et PERFORM", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Les tables (OCCURS)", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Fichiers et maintenance", sub: "Fichiers, batch, code existant",
          lessons: [
            { num: "07", title: "Les fichiers séquentiels", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Traitement par lots", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Lire et maintenir du COBOL", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "COBOL en production", sub: "Décimal exact, sous-programmes, fichiers indexés, texte, projet",
          lessons: [
            { num: "10", title: "L'arithmétique décimale exacte", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Découper en sous-programmes : CALL et COPY", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Les fichiers indexés (VSAM)", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Manipuler le texte : STRING, UNSTRING, INSPECT", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet de synthèse : un traitement bancaire complet", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    fortran: {
      id: "fortran", dir: "fortran", title: "Fortran : le calcul scientifique historique",
      glyph: "F", accent: "#5f7a3f", overview: "cours.html",
      related: [
        { course: "c", note: "L'autre pilier du HPC : on combine souvent C et Fortran." },
        { course: "python", note: "Python pilote fréquemment un cœur de calcul écrit en Fortran (NumPy s'appuie sur BLAS/LAPACK)." },
        { course: "cobol", note: "Les deux doyens encore en service : calcul scientifique vs gestion." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Fortran", sub: "Types, précision, boucles",
          lessons: [
            { num: "01", title: "Découvrir Fortran", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et opérations", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Tableaux et procédures", sub: "Tableaux, subroutines, modules",
          lessons: [
            { num: "04", title: "Les tableaux", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Procédures : subroutines et functions", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Modules et organisation", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Calcul scientifique", sub: "Fichiers, performance, écosystème",
          lessons: [
            { num: "07", title: "Entrées/sorties et fichiers", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Calcul numérique et performance", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Fortran moderne et écosystème", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Fortran avancé et haute performance", sub: "Objets, tableaux dynamiques, parallélisme, interop C, projet",
          lessons: [
            { num: "10", title: "Types dérivés et objets", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Tableaux dynamiques et opérations globales", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Parallélisme : do concurrent et coarrays", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Interopérabilité avec le C", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet de synthèse — assembler ce qu'on a appris", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },

    julia: {
      id: "julia", dir: "julia", title: "Julia : le calcul scientifique moderne",
      glyph: "Jl", accent: "#8a55b0", overview: "cours.html",
      related: [
        { course: "python", note: "Le concurrent direct en science des données : comparer les deux est éclairant." },
        { course: "fortran", note: "Julia veut remplacer le combo Python+Fortran par un seul langage rapide." },
        { course: "r", note: "Autre langage de l'analyse de données et des statistiques." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Julia", sub: "Types, boucles, fonctions",
          lessons: [
            { num: "01", title: "Découvrir Julia", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types et nombres", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
            { num: "04", title: "Les fonctions", file: "lecon-04.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Données et performance", sub: "Tableaux, structs, dispatch, perf",
          lessons: [
            { num: "05", title: "Tableaux et broadcasting", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Dictionnaires, tuples et structures", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Le multiple dispatch", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Types et performance", file: "lecon-08.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Julia en pratique", sub: "Packages, données, calcul scientifique",
          lessons: [
            { num: "09", title: "Packages et écosystème", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Données et visualisation", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Calcul numérique et au-delà", file: "lecon-11.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Métaprogrammation, parallélisme, tests, déploiement",
          lessons: [
            { num: "12", title: "Métaprogrammation : expressions et macros", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Parallélisme et calcul concurrent", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Tester et fiabiliser son code", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Interfacer et déployer", file: "lecon-15.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet de synthèse", sub: "Assembler tout le cours",
          lessons: [
            { num: "16", title: "Projet : un gestionnaire d'inventaire", file: "lecon-16.html", status: "complet" },
          ],
        },
      ],
    },

    zig: {
      id: "zig", dir: "zig", title: "Zig : le système sans surprises",
      glyph: "Zg", accent: "#b8862f", overview: "cours.html",
      related: [
        { course: "c", note: "Zig se veut un « meilleur C » : le C est le point de comparaison idéal." },
        { course: "rust", note: "L'autre prétendant moderne au trône du C : deux philosophies de la sûreté." },
        { course: "cpp", note: "comptime offre une généricité sans la complexité des templates C++." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Zig", sub: "Types, optionnels, contrôle du flux", level: "avance",
          lessons: [
            { num: "01", title: "Découvrir Zig", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, variables et fonctions", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et optionnels", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Mémoire et structures", sub: "Slices, structs, allocateurs, erreurs", level: "avance",
          lessons: [
            { num: "04", title: "Tableaux et slices", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Structs, enums et unions", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "La gestion mémoire et les allocateurs", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "La gestion d'erreurs", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Zig en pratique", sub: "comptime, interop C, build", level: "avance",
          lessons: [
            { num: "08", title: "comptime : la métaprogrammation", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Interopérabilité C et build", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Zig en pratique et écosystème", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Zig en profondeur", sub: "comptime, allocateurs, cross-compilation", level: "expert",
          lessons: [
            { num: "11", title: "comptime en profondeur", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Gérer la mémoire : les allocateurs", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "build.zig et cross-compilation", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Zig avancé", sub: "Tests, pointeurs, threads, généricité", level: "expert",
          lessons: [
            { num: "14", title: "Les tests intégrés au langage", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Pointeurs, slices et chaînes façon système", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Les threads et la synchronisation", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "La généricité et les interfaces", file: "lecon-17.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Assembler un outil complet", level: "expert",
          lessons: [
            { num: "18", title: "Projet : un inventaire en ligne de commande", file: "lecon-18.html", status: "complet" },
          ],
        },
      ],
    },

    lisp: {
      id: "lisp", dir: "lisp", title: "Lisp & Scheme : le pouvoir des parenthèses",
      glyph: "( )", accent: "#7a8a3f", overview: "cours.html",
      related: [
        { course: "clojure", note: "Le Lisp moderne sur la JVM : le prolongement direct de ce cours." },
        { course: "haskell", note: "L'autre grande école fonctionnelle : pure et typée." },
        { course: "javascript", note: "Les lambdas et map/filter/reduce de JS viennent de Lisp." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Lisp", sub: "S-expressions, évaluation, listes",
          lessons: [
            { num: "01", title: "Découvrir Lisp", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "S-expressions et évaluation", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Les listes : la structure fondamentale", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le paradigme fonctionnel", sub: "Fonctions, récursion, ordre supérieur",
          lessons: [
            { num: "04", title: "Définir et appeler des fonctions", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "La récursion", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Fonctions d'ordre supérieur", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Conditions et liaisons locales", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "La puissance de Lisp", sub: "Macros, structures, héritage",
          lessons: [
            { num: "08", title: "Les macros : le code est une donnée", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Structures de données et état", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "L'écosystème et l'héritage de Lisp", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Récursion terminale, fermetures, macros, symbolique",
          lessons: [
            { num: "11", title: "Récursion terminale et itération", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Fermetures et état encapsulé", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Macros avancées : quasiquote et DSL", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Programmation symbolique : eval et apply", file: "lecon-14.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Un mini-évaluateur Lisp",
          lessons: [
            { num: "15", title: "Projet : un mini-évaluateur Lisp", file: "lecon-15.html", status: "complet" },
          ],
        },
      ],
    },

    ocaml: {
      id: "ocaml", dir: "ocaml", title: "OCaml : typage fort et inférence",
      glyph: "Oc", accent: "#c97a35", overview: "cours.html",
      related: [
        { course: "rust", note: "Rust a directement emprunté à OCaml ses variants, son pattern matching et son Option." },
        { course: "haskell", note: "L'autre grande école fonctionnelle typée : pure vs pragmatique." },
        { course: "fsharp", note: "F# est le descendant direct d'OCaml sur la plateforme .NET." },
      ],
      modules: [
        {
          num: "01", title: "Les bases d'OCaml", sub: "Inférence, fonctions, listes", level: "avance",
          lessons: [
            { num: "01", title: "Découvrir OCaml", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, inférence et fonctions", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, listes et récursion", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le système de types", sub: "Pattern matching, variants, records", level: "avance",
          lessons: [
            { num: "04", title: "Le pattern matching", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Types algébriques (variants)", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Records, options et erreurs", file: "lecon-06.html", status: "complet" },
            { num: "07", title: "Fonctions d'ordre supérieur", file: "lecon-07.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "OCaml en pratique", sub: "Modules, foncteurs, mutabilité, outils", level: "avance",
          lessons: [
            { num: "08", title: "Modules et foncteurs", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Mutabilité et impératif", file: "lecon-09.html", status: "complet" },
            { num: "10", title: "Outils, écosystème et au-delà", file: "lecon-10.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "OCaml en profondeur", sub: "Types avancés, concurrence, projet", level: "expert",
          lessons: [
            { num: "11", title: "Types avancés : GADT et variants polymorphes", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Concurrence : Lwt et les effets d'OCaml 5", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Un projet complet : interpréteur", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "OCaml, encore plus loin", sub: "Objets, paresse, structures, erreurs, tests", level: "expert",
          lessons: [
            { num: "14", title: "La programmation orientée objet", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "La paresse et les séquences", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Collections immuables : Map et Set", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Gérer les erreurs : result et let*", file: "lecon-17.html", status: "complet" },
            { num: "18", title: "Tester et outiller un projet OCaml", file: "lecon-18.html", status: "complet" },
          ],
        },
      ],
    },

    fsharp: {
      id: "fsharp", dir: "fsharp", title: "F# : le fonctionnel sur .NET",
      glyph: "F#", accent: "#3f8ab5", overview: "cours.html",
      related: [
        { course: "ocaml", note: "Le père spirituel de F# : même esprit fonctionnel, hors de .NET." },
        { course: "csharp", note: "L'autre grand langage .NET : F# en partage tout l'écosystème." },
        { course: "haskell", note: "Pour approfondir le fonctionnel pur et typé." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de F#", sub: "Inférence, fonctions, collections",
          lessons: [
            { num: "01", title: "Découvrir F#", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Valeurs, types et fonctions", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Listes, collections et pipe", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le fonctionnel typé", sub: "Records, unions, pattern matching",
          lessons: [
            { num: "04", title: "Records et unions discriminées", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Le pattern matching", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Gestion d'erreurs : option et Result", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "F# en pratique", sub: "Async, interop .NET, données, outils",
          lessons: [
            { num: "07", title: "Asynchrone et interop .NET", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Programmation orientée données", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Outils, écosystème et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin en F#", sub: "Composition, computation expressions, active patterns",
          lessons: [
            { num: "10", title: "Composition et application partielle", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Les computation expressions", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Les active patterns", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Structurer et tester un projet F#", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet de synthèse : une petite bibliothèque", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    clojure: {
      id: "clojure", dir: "clojure", title: "Clojure : Lisp moderne sur la JVM",
      glyph: "Cj", accent: "#4a9e58", overview: "cours.html",
      related: [
        { course: "lisp", note: "La source : Clojure est un Lisp moderne, ce cours en éclaire les racines." },
        { course: "scala", note: "L'autre grand langage de la JVM au cœur fonctionnel." },
        { course: "haskell", note: "Pour approfondir le fonctionnel pur et l'immuabilité." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Clojure", sub: "REPL, données, fonctions",
          lessons: [
            { num: "01", title: "Découvrir Clojure", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Données et S-expressions", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Fonctions et liaisons", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Données immuables", sub: "Collections, séquences, persistance",
          lessons: [
            { num: "04", title: "Les collections", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Séquences et ordre supérieur", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Immuabilité et structures persistantes", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Clojure en pratique", sub: "Concurrence, macros, interop, outils",
          lessons: [
            { num: "07", title: "Concurrence et état", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Macros et interop JVM", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Outils, écosystème et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Clojure en grand", sub: "Polymorphisme, core.async, spec",
          lessons: [
            { num: "10", title: "Polymorphisme : protocols et records", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Concurrence asynchrone : core.async", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Spécifier et valider : clojure.spec", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Pour aller plus loin", sub: "Tests, transducteurs, données imbriquées, erreurs et projet",
          lessons: [
            { num: "13", title: "Tester en Clojure : clojure.test et test.check", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Les transducteurs", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "Manipuler les données imbriquées", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Gérer les erreurs", file: "lecon-16.html", status: "complet" },
            { num: "17", title: "Projet de synthèse", file: "lecon-17.html", status: "complet" },
          ],
        },
      ],
    },
    prolog: {
      id: "prolog", dir: "prolog", title: "Prolog : la programmation logique",
      glyph: "?-", accent: "#a8553f", overview: "cours.html",
      related: [
        { course: "lisp", note: "L'autre grand langage symbolique : listes et termes, même esprit déclaratif." },
        { course: "haskell", note: "Le filtrage par motifs et l'inférence de types prolongent l'unification." },
        { course: "sql", note: "Une autre approche déclarative : décrire le résultat, pas l'algorithme." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Prolog", sub: "Faits, règles, unification",
          lessons: [
            { num: "01", title: "Découvrir Prolog", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Faits, règles et requêtes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Unification et variables", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le moteur logique", sub: "Backtracking, listes, récursion",
          lessons: [
            { num: "04", title: "Le backtracking", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Les listes", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Récursion et arithmétique", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Prolog en pratique", sub: "Coupure, puzzles, écosystème",
          lessons: [
            { num: "07", title: "La coupure et la négation", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Résoudre des problèmes", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Outils, écosystème et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Prolog : aller plus loin", sub: "Collecte, base dynamique, grammaires, contraintes",
          lessons: [
            { num: "10", title: "Collecter les solutions : findall, bagof, setof", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "La base dynamique : assert et retract", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Analyser du texte : les grammaires DCG", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Résoudre sous contraintes : CLP(FD)", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Assembler : un système expert",
          lessons: [
            { num: "14", title: "Projet — un système expert", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    ada: {
      id: "ada", dir: "ada", title: "Ada : la fiabilité critique",
      glyph: "Ada", accent: "#2e7d6e", overview: "cours.html",
      related: [
        { course: "rust", note: "Même obsession de la sûreté à la compilation, par d'autres moyens." },
        { course: "pascal", note: "Un cousin de la même famille structurée et lisible." },
        { course: "cpp", note: "L'autre grand langage système, aux compromis opposés." },
      ],
      modules: [
        {
          num: "01", title: "Les bases d'Ada", sub: "Types forts, contraintes, contrôle",
          lessons: [
            { num: "01", title: "Découvrir Ada", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types et fortes contraintes", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "La rigueur Ada", sub: "Sous-programmes, données, paquets",
          lessons: [
            { num: "04", title: "Procédures et fonctions", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Tableaux et enregistrements", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Les paquets et la modularité", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Ada en pratique", sub: "Contrats, concurrence, écosystème",
          lessons: [
            { num: "07", title: "Exceptions et contrats", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "La concurrence : les tâches", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Outils, écosystème et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Ada : aller plus loin", sub: "Généricité, objets, fichiers, preuve & projet",
          lessons: [
            { num: "10", title: "La généricité : un code, tous les types", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "La POO : les types étiquetés", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Chaînes, texte et fichiers", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "SPARK : prouver, pas seulement tester", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet de synthèse : assembler un programme Ada", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    pascal: {
      id: "pascal", dir: "pascal", title: "Pascal & Delphi : l'école de la structure",
      glyph: "Pa", accent: "#356a92", overview: "cours.html",
      related: [
        { course: "ada", note: "Le cousin rigoureux de la même famille structurée." },
        { course: "c", note: "L'autre grande influence des débutants ; pointeurs et structures." },
        { course: "csharp", note: "Conçu par l'architecte de Delphi : la filiation est directe." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Pascal", sub: "Structure, variables, contrôle",
          lessons: [
            { num: "01", title: "Découvrir Pascal", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et affectation", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Programmer avec méthode", sub: "Sous-programmes, données composées",
          lessons: [
            { num: "04", title: "Procédures et fonctions", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Tableaux et chaînes", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Enregistrements et types", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Pascal en pratique", sub: "Pointeurs, unités, Delphi",
          lessons: [
            { num: "07", title: "Pointeurs et mémoire", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Unités et modularité", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "De Turbo Pascal à Delphi", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Fichiers, ensembles, récursivité, objets",
          lessons: [
            { num: "10", title: "Les fichiers en Pascal", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Les ensembles & les énumérations", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "La récursivité", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "L'Object Pascal : classes et objets", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Mettre tout en œuvre",
          lessons: [
            { num: "14", title: "Projet — un gestionnaire d'inventaire", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    vb: {
      id: "vb", dir: "vb", title: "Visual Basic : l'automatisation Office et .NET",
      glyph: "VB", accent: "#5a4fa0", overview: "cours.html",
      related: [
        { course: "csharp", note: "L'autre langage .NET : même plateforme, transition naturelle." },
        { course: "python", note: "Une autre voie d'automatisation, au-delà du monde Office." },
        { course: "pascal", note: "Un cousin lisible, lui aussi pensé pour l'accessibilité." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Visual Basic", sub: "Syntaxe, variables, contrôle",
          lessons: [
            { num: "01", title: "Découvrir Visual Basic", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et opérateurs", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions et boucles", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Programmer en VB", sub: "Sous-programmes, données, erreurs",
          lessons: [
            { num: "04", title: "Procédures et fonctions", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Tableaux et chaînes", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Collections et gestion d'erreurs", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "VB en pratique", sub: "VBA, Office, VB.NET, écosystème",
          lessons: [
            { num: "07", title: "Automatiser Office avec VBA", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "VB.NET : formulaires et événements", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Outils, écosystème et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "VB.NET approfondi", sub: "POO, collections, fichiers, robustesse",
          lessons: [
            { num: "10", title: "POO en VB.NET : héritage et interfaces", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Collections génériques et LINQ", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Lire et écrire des fichiers", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Déboguer et fiabiliser son code", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Assembler tout le cours",
          lessons: [
            { num: "14", title: "Projet : un gestionnaire d'inventaire", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    objc: {
      id: "objc", dir: "objc", title: "Objective-C : l'héritage d'iOS",
      glyph: "[ ]", accent: "#7a4f5f", overview: "cours.html",
      related: [
        { course: "swift", note: "Le successeur : chaque nouveauté de Swift répond à une limite d'Objective-C." },
        { course: "c", note: "Le socle : Objective-C est un sur-ensemble strict du C." },
        { course: "ruby", note: "Un autre héritier de l'esprit objet de Smalltalk." },
      ],
      modules: [
        {
          num: "01", title: "Les bases d'Objective-C", sub: "Messages, types, NSString",
          lessons: [
            { num: "01", title: "Découvrir Objective-C", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, variables et NSString", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Envoyer des messages", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Objets et classes", sub: "Classes, propriétés, protocoles",
          lessons: [
            { num: "04", title: "Classes : interface et implémentation", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Propriétés et méthodes", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Protocoles et catégories", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Objective-C en pratique", sub: "Mémoire, blocks, Swift",
          lessons: [
            { num: "07", title: "La gestion mémoire (ARC)", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Blocks et collections", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Cohabiter avec Swift et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Aller plus loin", sub: "Erreurs, Foundation, runtime, concurrence",
          lessons: [
            { num: "10", title: "Gérer les erreurs : NSError et exceptions", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Foundation en pratique : dates, fichiers, tri", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Le runtime : introspection et messages dynamiques", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "La concurrence avec Grand Central Dispatch", file: "lecon-13.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Projet", sub: "Capstone : un gestionnaire d'inventaire",
          lessons: [
            { num: "14", title: "Projet final — un gestionnaire d'inventaire", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    erlang: {
      id: "erlang", dir: "erlang", title: "Erlang : la tolérance aux pannes",
      glyph: "Er", accent: "#a8324f", overview: "cours.html",
      related: [
        { course: "elixir", note: "Le cousin moderne : même BEAM, même OTP, syntaxe nouvelle." },
        { course: "go", note: "Une autre approche de la concurrence par messages (goroutines)." },
        { course: "prolog", note: "Un autre langage déclaratif au pattern matching central." },
      ],
      modules: [
        {
          num: "01", title: "Les bases d'Erlang", sub: "Données, pattern matching, fonctions",
          lessons: [
            { num: "01", title: "Découvrir Erlang", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Données et pattern matching", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Fonctions et récursion", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Le modèle concurrent", sub: "Processus, acteurs, supervision",
          lessons: [
            { num: "04", title: "Processus et messages", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Le modèle acteur et l'état", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "« Let it crash » et la supervision", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Erlang en pratique", sub: "OTP, distribution, écosystème",
          lessons: [
            { num: "07", title: "OTP : behaviours et gen_server", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Distribution et tolérance aux pannes", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Outils, écosystème et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Erlang : aller plus loin", sub: "ETS, records & types, binaires",
          lessons: [
            { num: "10", title: "ETS : le stockage en mémoire", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Enregistrements, specs et Dialyzer", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Binaires et bit syntax", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Tester et consolider", sub: "Tests EUnit, projet de synthèse",
          lessons: [
            { num: "13", title: "Tester son code : EUnit et les propriétés", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet de synthèse : un inventaire supervisé", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    groovy: {
      id: "groovy", dir: "groovy", title: "Groovy : le script de la JVM",
      glyph: "Gv", accent: "#4a8ab0", overview: "cours.html",
      related: [
        { course: "java", note: "Le socle : Groovy est Java sans la cérémonie, sur la même JVM." },
        { course: "kotlin", note: "L'autre grand langage moderne de la JVM, plus statique." },
        { course: "python", note: "Un esprit proche pour le scripting dynamique." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Groovy", sub: "Syntaxe, types, contrôle",
          lessons: [
            { num: "01", title: "Découvrir Groovy", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Variables, types et GString", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Conditions, boucles et opérateurs", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Groovy expressif", sub: "Closures, collections, objets",
          lessons: [
            { num: "04", title: "Les closures", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Collections : listes et maps", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "Classes, POGO et typage", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Groovy en pratique", sub: "Métaprogrammation, Gradle, Jenkins",
          lessons: [
            { num: "07", title: "Métaprogrammation et builders", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Gradle et Jenkins : Groovy au travail", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Outils, écosystème et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Groovy avancé", sub: "Traits, données, tests, DSL, projet",
          lessons: [
            { num: "10", title: "Les traits : composer le comportement", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "JSON, XML et le web", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Tester avec Spock", file: "lecon-12.html", status: "complet" },
            { num: "13", title: "Écrire un DSL en Groovy", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Projet de synthèse : un gestionnaire d'inventaire", file: "lecon-14.html", status: "complet" },
          ],
        },
      ],
    },
    solidity: {
      id: "solidity", dir: "solidity", title: "Solidity : les contrats intelligents",
      glyph: "So", accent: "#5a5f6e", overview: "cours.html",
      related: [
        { course: "javascript", note: "Le langage des dApps : une page web qui parle au contrat (ethers.js)." },
        { course: "rust", note: "L'autre grand langage de contrats (Solana), axé sécurité." },
        { course: "go", note: "Très présent dans l'infrastructure blockchain (clients Ethereum)." },
      ],
      modules: [
        {
          num: "01", title: "Les bases de Solidity", sub: "Contrats, types, fonctions",
          lessons: [
            { num: "01", title: "Découvrir Solidity", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Types, variables et stockage", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Fonctions et visibilité", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Programmer un contrat", sub: "État, modificateurs, ether",
          lessons: [
            { num: "04", title: "État, mappings et structs", file: "lecon-04.html", status: "complet" },
            { num: "05", title: "Modificateurs, événements et erreurs", file: "lecon-05.html", status: "complet" },
            { num: "06", title: "L'argent : ether, payable et gas", file: "lecon-06.html", status: "complet" },
          ],
        },
        {
          num: "03", title: "Solidity en pratique", sub: "Sécurité, déploiement, standards",
          lessons: [
            { num: "07", title: "Sécurité : réentrance et pièges", file: "lecon-07.html", status: "complet" },
            { num: "08", title: "Déployer et interagir", file: "lecon-08.html", status: "complet" },
            { num: "09", title: "Écosystème, standards et au-delà", file: "lecon-09.html", status: "complet" },
          ],
        },
        {
          num: "04", title: "Solidity de l'ingénieur", sub: "Tests, contrats évolutifs, sécurité avancée",
          lessons: [
            { num: "10", title: "Tester ses contrats avec Foundry", file: "lecon-10.html", status: "complet" },
            { num: "11", title: "Contrats évolutifs : proxy et UUPS", file: "lecon-11.html", status: "complet" },
            { num: "12", title: "Sécurité avancée et audits", file: "lecon-12.html", status: "complet" },
          ],
        },
        {
          num: "05", title: "Solidity avancé", sub: "Gas, standards de jetons, interactions",
          lessons: [
            { num: "13", title: "Optimiser le gas : écrire un contrat économe", file: "lecon-13.html", status: "complet" },
            { num: "14", title: "Créer un jeton : le standard ERC-20", file: "lecon-14.html", status: "complet" },
            { num: "15", title: "NFT et ERC-721 : posséder l'unique", file: "lecon-15.html", status: "complet" },
            { num: "16", title: "Interagir entre contrats : interfaces, call et delegatecall", file: "lecon-16.html", status: "complet" },
          ],
        },
        {
          num: "06", title: "Projet", sub: "Le contrat de synthèse",
          lessons: [
            { num: "17", title: "Projet : un financement participatif décentralisé", file: "lecon-17.html", status: "complet" },
          ],
        },
      ],
    },
    maths: {
      id: "maths", dir: "maths", title: "Mathématiques de l'informatique : ce dont on se sert vraiment",
      glyph: "∀", accent: "#702070", overview: "cours.html",
      related: [
        { course: "algo", note: "La complexité, les arbres et les graphes de ce cours-là s'appuient sur les notions du module 5 et du module 4 : croissance, logarithmes, matrices d'adjacence." },
        { course: "crypto", note: "L'arithmétique modulaire du module 3 est le socle de RSA et de Diffie-Hellman. Ce cours-ci donne l'outil ; celui-là montre ce qu'on en fait." },
        { course: "neurones", note: "Un réseau de neurones est une suite de produits de matrices. Le module 4 pose ces objets calmement, avant de les voir apprendre." },
        { course: "distribue", note: "Un système distribué se raisonne sur un graphe de machines, et ses garanties se formulent en logique — les deux sujets du module 1 et du module 4." },
        { course: "stats", note: "Le module 2 pose les ensembles, le dénombrement et les probabilités : exactement ce que les statistiques appliquées supposent connu." },
      ],
      modules: [
        {
          num: "01", title: "Logique et booléens", sub: "propositions, tables de vérité, De Morgan, ce qu'un if veut dire",
          level: "intermediaire",
          lessons: [
            { num: "01", title: "Propositions, connecteurs et tables de vérité", file: "lecon-01.html", status: "complet" },
            { num: "02", title: "Les lois de l'algèbre de Boole, et De Morgan", file: "lecon-02.html", status: "complet" },
            { num: "03", title: "Ce qu'un if complexe veut vraiment dire", file: "lecon-03.html", status: "complet" },
          ],
        },
        {
          num: "02", title: "Ensembles, dénombrement, probabilités", sub: "ce qui fonde les tables de hachage et les collisions",
          level: "intermediaire",
          lessons: [
            { num: "04", title: "Ensembles, unions, intersections", file: "#", status: "bientot" },
            { num: "05", title: "Compter sans énumérer : le dénombrement", file: "#", status: "bientot" },
            { num: "06", title: "Probabilités, collisions et paradoxe des anniversaires", file: "#", status: "bientot" },
          ],
        },
        {
          num: "03", title: "Arithmétique et nombres en machine", sub: "modulo, nombres premiers, et 0.1 + 0.2",
          level: "intermediaire",
          lessons: [
            { num: "07", title: "Arithmétique modulaire : l'horloge des cryptographes", file: "#", status: "bientot" },
            { num: "08", title: "Nombres premiers, PGCD et algorithme d'Euclide", file: "#", status: "bientot" },
            { num: "09", title: "Pourquoi 0.1 + 0.2 ne fait pas 0.3", file: "#", status: "bientot" },
          ],
        },
        {
          num: "04", title: "Graphes et matrices", sub: "représenter un réseau, une carte, un réseau de neurones",
          level: "intermediaire",
          lessons: [
            { num: "10", title: "Représenter un réseau : graphes et matrices d'adjacence", file: "#", status: "bientot" },
            { num: "11", title: "Matrices : une seule opération pour une carte et un réseau", file: "#", status: "bientot" },
          ],
        },
        {
          num: "05", title: "Croissance et complexité", sub: "ce que veut dire O(n²) sur un million de lignes",
          level: "intermediaire",
          lessons: [
            { num: "12", title: "Ordres de grandeur : mesurer la croissance", file: "#", status: "bientot" },
            { num: "13", title: "Logarithmes et exponentielles, vus du code", file: "#", status: "bientot" },
          ],
        },
      ],
    },
  };

  /* ---- Parcours d'apprentissage (itinéraires de cours existants) -------------
     Chaque parcours enchaîne des cours déjà au catalogue dans un ordre conseillé.
     Utilisé par parcours.js (page parcours.html) et la page de progression. */
  var tracks = [
    {
      id: "web-frontend",
      title: "Développeur Web Front-end",
      glyph: "</>",
      tagline: "Construire des interfaces modernes, du HTML au framework.",
      courses: ["html", "css", "javascript", "react", "typescript"],
    },
    {
      id: "produit-design",
      title: "Produit, design & qualité web",
      glyph: "UX",
      tagline: "Concevoir des interfaces utiles, accessibles et rapides.",
      courses: ["ux", "a11y", "perf-web"],
    },
    {
      id: "backend",
      title: "Développeur Back-end / API",
      glyph: "{ }",
      tagline: "Servir des données : serveur, base, authentification.",
      courses: ["javascript", "nodejs", "sql", "java", "git"],
    },
    {
      id: "exploitation",
      title: "Exploitation & SRE",
      glyph: "SRE",
      tagline: "Faire tourner un service en production, de la machine aux métriques.",
      courses: ["linux", "reseaux", "os", "distribue", "docker", "cloud", "observabilite"],
    },
    {
      id: "fondamentaux",
      title: "Fondamentaux & informatique",
      glyph: "O(n)",
      tagline: "Les bases solides : programmer, raisonner, comprendre la machine.",
      courses: ["maths", "python", "algo", "c", "rust", "compilation"],
    },
    {
      id: "data",
      title: "Données & analyse",
      glyph: "Σ",
      tagline: "Interroger, manipuler, industrialiser, analyser et visualiser des données.",
      courses: ["sql", "bdd", "python", "pandas", "data-eng", "stats", "dataviz", "r"],
    },
    {
      id: "systeme",
      title: "Langages système",
      glyph: "sys",
      tagline: "Du contrôle mémoire au plus près du métal.",
      courses: ["c", "cpp", "rust", "zig", "asm"],
    },
    {
      id: "jvm",
      title: "L'écosystème JVM",
      glyph: "JVM",
      tagline: "Un bytecode, plusieurs langages : de Java au fonctionnel.",
      courses: ["java", "kotlin", "scala", "groovy", "clojure"],
    },
    {
      id: "dotnet",
      title: "L'écosystème .NET",
      glyph: ".NET",
      tagline: "Un runtime, plusieurs langages : le monde Microsoft.",
      courses: ["csharp", "vb", "powershell", "fsharp"],
    },
    {
      id: "fonctionnel",
      title: "Paradigme fonctionnel",
      glyph: "λ",
      tagline: "Penser en fonctions, valeurs immuables et types.",
      courses: ["haskell", "elixir", "ocaml", "fsharp", "lisp", "clojure", "prolog"],
    },
    {
      id: "premier-projet",
      title: "Du débutant au premier projet",
      glyph: "★",
      tagline: "Démarrer de zéro et construire pour de vrai.",
      courses: ["python", "git", "projets-js"],
    },

    /* ---- Parcours ajoutés (chantier V10 — élargir le catalogue) ---------------
       But : rendre visibles les cours qui n'appartenaient à aucun itinéraire.
       Un cours peut figurer dans plusieurs parcours (comme python ou git) quand
       il y a sa place légitimement. Seul « solidity » (contrats intelligents,
       très spécialisé) reste volontairement hors parcours. */
    {
      id: "front-avance",
      title: "Front-end : au-delà des bases",
      glyph: "UI",
      tagline: "Aller plus loin côté client : Sass et Vue.js.",
      courses: ["css", "sass", "vue"],
    },
    {
      id: "api-web",
      title: "Concevoir et exposer une API",
      glyph: "API",
      tagline: "Du protocole HTTP aux API REST et GraphQL.",
      courses: ["http", "api", "graphql"],
    },
    {
      id: "web-serveur",
      title: "Le web côté serveur",
      glyph: "srv",
      tagline: "Le serveur qui répond au navigateur : PHP, Ruby, Go.",
      courses: ["http", "php", "ruby", "go"],
    },
    {
      id: "bases-donnees",
      title: "Bases de données",
      glyph: "db",
      tagline: "Concevoir, stocker et interroger : du relationnel au NoSQL.",
      courses: ["sql", "bdd", "nosql"],
    },
    {
      id: "ia",
      title: "Intelligence artificielle",
      glyph: "AI",
      tagline: "De Python à l'apprentissage automatique et aux LLM.",
      courses: ["python", "pandas", "stats", "ml", "neurones", "llm"],
    },
    {
      id: "mobile-dev",
      title: "Développement mobile",
      glyph: "app",
      tagline: "De l'application elle-même aux langages natifs et multiplateformes.",
      courses: ["mobile", "swift", "kotlin", "dart", "objc"],
    },
    {
      id: "devops",
      title: "DevOps & livraison continue",
      glyph: "∞",
      tagline: "Construire, tester et livrer en continu, jusqu'au cluster.",
      courses: ["docker", "cicd", "iac", "kubernetes"],
    },
    {
      id: "conception",
      title: "Concevoir un logiciel robuste",
      glyph: "◇",
      tagline: "Structurer, tester, sécuriser un code qui dure — et le porter à plusieurs.",
      courses: ["patterns", "archi", "tests", "securite", "offensive", "crypto", "equipe"],
    },
    {
      id: "outils",
      title: "La boîte à outils du développeur",
      glyph: "kit",
      tagline: "L'éditeur, le terminal et les formats du quotidien.",
      courses: ["vscode", "bash", "git", "regex", "markdown", "formats"],
    },
    {
      id: "scripting",
      title: "Scripting & automatisation",
      glyph: "sh",
      tagline: "Des langages légers pour automatiser et outiller.",
      courses: ["bash", "powershell", "perl", "lua"],
    },
    {
      id: "concurrence",
      title: "Concurrence & résilience",
      glyph: "∥",
      tagline: "Faire beaucoup de choses à la fois, sans tomber.",
      courses: ["go", "elixir", "erlang"],
    },
    {
      id: "calcul-scientifique",
      title: "Calcul scientifique",
      glyph: "∫",
      tagline: "Le code au service des nombres et de la science.",
      courses: ["python", "r", "julia", "fortran"],
    },
    {
      id: "performance-web",
      title: "Performance web",
      glyph: "0ms",
      tagline: "Rendre le web rapide, jusqu'au calcul natif.",
      courses: ["perf-web", "wasm"],
    },
    {
      id: "patrimoine",
      title: "Langages historiques & patrimoine",
      glyph: "'70",
      tagline: "Le code qui fait encore tourner banques et industrie.",
      courses: ["fortran", "cobol", "pascal", "ada"],
    },
  ];

  var lessonDurations = {
    "ml": {"lecon-01.html":33,"lecon-02.html":35,"lecon-03.html":37,"lecon-04.html":37,"lecon-05.html":37,"lecon-06.html":35,"lecon-07.html":38,"lecon-08.html":34,"lecon-09.html":35,"lecon-10.html":36,"lecon-11.html":37,"lecon-12.html":42},
    "kubernetes": {"lecon-01.html":30,"lecon-02.html":33,"lecon-03.html":35,"lecon-04.html":34,"lecon-05.html":33,"lecon-06.html":35,"lecon-07.html":38,"lecon-08.html":34,"lecon-09.html":36,"lecon-10.html":35,"lecon-11.html":38,"lecon-12.html":42},
    "graphql": {"lecon-01.html":31,"lecon-02.html":33,"lecon-03.html":35,"lecon-04.html":33,"lecon-05.html":37,"lecon-06.html":40,"lecon-07.html":38,"lecon-08.html":40,"lecon-09.html":42,"lecon-10.html":44,"lecon-11.html":44},
    "llm": {"lecon-01.html":31,"lecon-02.html":33,"lecon-03.html":35,"lecon-04.html":37,"lecon-05.html":37,"lecon-06.html":35,"lecon-07.html":40,"lecon-08.html":36,"lecon-09.html":38,"lecon-10.html":37,"lecon-11.html":39,"lecon-12.html":42},
    "a11y": {"lecon-01.html":30,"lecon-02.html":32,"lecon-03.html":34,"lecon-04.html":34,"lecon-05.html":33,"lecon-06.html":36,"lecon-07.html":32,"lecon-08.html":34,"lecon-09.html":35,"lecon-10.html":34,"lecon-11.html":36,"lecon-12.html":38,"lecon-13.html":40,"lecon-14.html":34,"lecon-15.html":38},
    "perf-web": {"lecon-01.html":31,"lecon-02.html":35,"lecon-03.html":35,"lecon-04.html":35,"lecon-05.html":33,"lecon-06.html":33,"lecon-07.html":36,"lecon-08.html":37,"lecon-09.html":36,"lecon-10.html":38,"lecon-11.html":37,"lecon-12.html":36,"lecon-13.html":36,"lecon-14.html":38,"lecon-15.html":42},
    "cloud": {"lecon-01.html":30,"lecon-02.html":32,"lecon-03.html":35,"lecon-04.html":35,"lecon-05.html":33,"lecon-06.html":35,"lecon-07.html":32,"lecon-08.html":34,"lecon-09.html":33,"lecon-10.html":37,"lecon-11.html":36,"lecon-12.html":40},
    "iac": {"lecon-01.html":31,"lecon-02.html":35,"lecon-03.html":35,"lecon-04.html":33,"lecon-05.html":35,"lecon-06.html":40,"lecon-07.html":34,"lecon-08.html":36,"lecon-09.html":35,"lecon-10.html":36,"lecon-11.html":42},
    "archi": {"lecon-01.html":30,"lecon-02.html":32,"lecon-03.html":34,"lecon-04.html":34,"lecon-05.html":34,"lecon-06.html":33,"lecon-07.html":40,"lecon-08.html":35,"lecon-09.html":37,"lecon-10.html":36,"lecon-11.html":37,"lecon-12.html":40},
    "wasm": {"lecon-01.html":31,"lecon-02.html":30,"lecon-03.html":32,"lecon-04.html":33,"lecon-05.html":29,"lecon-06.html":37,"lecon-07.html":34,"lecon-08.html":36,"lecon-09.html":35,"lecon-10.html":33,"lecon-11.html":40},
    "ada": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":55,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":45,"lecon-10.html":38,"lecon-11.html":40,"lecon-12.html":36,"lecon-13.html":40,"lecon-14.html":42},
    "algo": {"lecon-01.html":35,"lecon-02.html":36,"lecon-03.html":33,"lecon-04.html":34,"lecon-05.html":36,"lecon-06.html":36,"lecon-07.html":36,"lecon-08.html":34,"lecon-09.html":36,"lecon-10.html":36,"lecon-11.html":36,"lecon-12.html":38,"lecon-13.html":34,"lecon-14.html":38,"lecon-15.html":36,"lecon-16.html":36,"lecon-17.html":34,"lecon-18.html":36,"lecon-19.html":34,"lecon-20.html":35,"lecon-21.html":37,"lecon-22.html":37,"lecon-23.html":35,"lecon-24.html":42,"lecon-25.html":42,"lecon-26.html":44,"lecon-27.html":38,"lecon-28.html":40},
    "api": {"lecon-01.html":30,"lecon-02.html":35,"lecon-03.html":35,"lecon-04.html":34,"lecon-05.html":37,"lecon-06.html":36,"lecon-07.html":37,"lecon-08.html":35,"lecon-09.html":36,"lecon-10.html":36,"lecon-11.html":35,"lecon-12.html":35,"lecon-13.html":36,"lecon-14.html":40},
    "asm": {"lecon-01.html":50,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":55,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":50,"lecon-10.html":50,"lecon-11.html":50,"lecon-12.html":50,"lecon-13.html":55,"lecon-14.html":55,"lecon-15.html":60},
    "bash": {"lecon-01.html":26,"lecon-02.html":28,"lecon-03.html":30,"lecon-04.html":33,"lecon-05.html":33,"lecon-06.html":35,"lecon-07.html":35,"lecon-08.html":35,"lecon-09.html":35,"lecon-10.html":35,"lecon-11.html":35,"lecon-12.html":34,"lecon-13.html":36,"lecon-14.html":35,"lecon-15.html":36,"lecon-16.html":38},
    "linux": {"lecon-01.html":29,"lecon-02.html":31,"lecon-03.html":33,"lecon-04.html":33,"lecon-05.html":32,"lecon-06.html":33,"lecon-07.html":31,"lecon-08.html":33,"lecon-09.html":34,"lecon-10.html":35,"lecon-11.html":38},
    "reseaux": {"lecon-01.html":28,"lecon-02.html":30,"lecon-03.html":32,"lecon-04.html":30,"lecon-05.html":32,"lecon-06.html":37,"lecon-07.html":33,"lecon-08.html":32,"lecon-09.html":30,"lecon-10.html":34,"lecon-11.html":32},
    "ux": {"lecon-01.html":26,"lecon-02.html":28,"lecon-03.html":31,"lecon-04.html":31,"lecon-05.html":31,"lecon-06.html":32,"lecon-07.html":32,"lecon-08.html":33,"lecon-09.html":34,"lecon-10.html":33,"lecon-11.html":40},
    "observabilite": {"lecon-01.html":29,"lecon-02.html":31,"lecon-03.html":32,"lecon-04.html":31,"lecon-05.html":32,"lecon-06.html":37,"lecon-07.html":35,"lecon-08.html":36,"lecon-09.html":34,"lecon-10.html":35,"lecon-11.html":40},
    "os": {"lecon-01.html":28,"lecon-02.html":31,"lecon-03.html":31,"lecon-04.html":33,"lecon-05.html":30,"lecon-06.html":32,"lecon-07.html":32,"lecon-08.html":31,"lecon-09.html":33,"lecon-10.html":32,"lecon-11.html":34,"lecon-12.html":34,"lecon-13.html":33,"lecon-14.html":40},
    "c": {"lecon-01.html":31,"lecon-02.html":33,"lecon-03.html":30,"lecon-04.html":32,"lecon-05.html":36,"lecon-06.html":34,"lecon-07.html":36,"lecon-08.html":34,"lecon-09.html":32,"lecon-10.html":33,"lecon-11.html":35,"lecon-12.html":33,"lecon-13.html":35,"lecon-14.html":36,"lecon-15.html":34,"lecon-16.html":36,"lecon-17.html":34,"lecon-18.html":37,"lecon-19.html":35,"lecon-20.html":38,"lecon-21.html":40},
    "compilation": {"lecon-01.html":55,"lecon-02.html":52,"lecon-03.html":58,"lecon-04.html":62,"lecon-05.html":62,"lecon-06.html":54,"lecon-07.html":75,"lecon-08.html":80,"lecon-09.html":95,"lecon-10.html":80,"lecon-11.html":85,"lecon-12.html":90,"lecon-13.html":95},
    "neurones": {"lecon-01.html":83,"lecon-02.html":86,"lecon-03.html":88,"lecon-04.html":102,"lecon-05.html":101,"lecon-06.html":102,"lecon-07.html":117,"lecon-08.html":117,"lecon-09.html":109,"lecon-10.html":104,"lecon-11.html":103,"lecon-12.html":117},
    "crypto": {"lecon-01.html":32,"lecon-02.html":30,"lecon-03.html":34,"lecon-04.html":34,"lecon-05.html":33,"lecon-06.html":35,"lecon-07.html":34,"lecon-08.html":35,"lecon-09.html":35,"lecon-10.html":36,"lecon-11.html":40},
    "maths": {"lecon-01.html":52,"lecon-02.html":50,"lecon-03.html":54},
    "offensive": {"lecon-01.html":78,"lecon-02.html":82,"lecon-03.html":86,"lecon-04.html":22,"lecon-05.html":18,"lecon-06.html":18,"lecon-07.html":26,"lecon-08.html":24,"lecon-09.html":22,"lecon-10.html":24,"lecon-11.html":24,"lecon-12.html":30},
    "distribue": {"lecon-01.html":80,"lecon-02.html":84,"lecon-03.html":86,"lecon-04.html":79,"lecon-05.html":73,"lecon-06.html":71,"lecon-07.html":77,"lecon-08.html":74,"lecon-09.html":77,"lecon-10.html":94,"lecon-11.html":94,"lecon-12.html":84},
    "cicd": {"lecon-01.html":30,"lecon-02.html":35,"lecon-03.html":38,"lecon-04.html":37,"lecon-05.html":38,"lecon-06.html":35,"lecon-07.html":37,"lecon-08.html":36,"lecon-09.html":38,"lecon-10.html":38,"lecon-11.html":40},
    "clojure": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":45,"lecon-10.html":50,"lecon-11.html":50,"lecon-12.html":50,"lecon-13.html":36,"lecon-14.html":38,"lecon-15.html":35,"lecon-16.html":37,"lecon-17.html":40},
    "cobol": {"lecon-01.html":44,"lecon-02.html":50,"lecon-03.html":55,"lecon-04.html":50,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":50,"lecon-09.html":45,"lecon-10.html":48,"lecon-11.html":46,"lecon-12.html":46,"lecon-13.html":44,"lecon-14.html":50},
    "cpp": {"lecon-01.html":30,"lecon-02.html":32,"lecon-03.html":32,"lecon-04.html":34,"lecon-05.html":36,"lecon-06.html":35,"lecon-07.html":33,"lecon-08.html":36,"lecon-09.html":34,"lecon-10.html":34,"lecon-11.html":34,"lecon-12.html":35,"lecon-13.html":33,"lecon-14.html":33,"lecon-15.html":37,"lecon-16.html":37,"lecon-17.html":35,"lecon-18.html":37,"lecon-19.html":35,"lecon-20.html":36,"lecon-21.html":34,"lecon-22.html":37,"lecon-23.html":40},
    "csharp": {"lecon-01.html":30,"lecon-02.html":32,"lecon-03.html":30,"lecon-04.html":32,"lecon-05.html":34,"lecon-06.html":34,"lecon-07.html":32,"lecon-08.html":32,"lecon-09.html":33,"lecon-10.html":35,"lecon-11.html":37,"lecon-12.html":35,"lecon-13.html":32,"lecon-14.html":36,"lecon-15.html":35,"lecon-16.html":35,"lecon-17.html":44,"lecon-18.html":40,"lecon-19.html":34,"lecon-20.html":34,"lecon-21.html":32,"lecon-22.html":34,"lecon-23.html":40},
    "css": {"lecon-01.html":30,"lecon-02.html":32,"lecon-03.html":32,"lecon-04.html":30,"lecon-05.html":34,"lecon-06.html":32,"lecon-07.html":32,"lecon-08.html":34,"lecon-09.html":36,"lecon-10.html":36,"lecon-11.html":34,"lecon-12.html":34,"lecon-13.html":32,"lecon-14.html":32,"lecon-15.html":32,"lecon-16.html":30,"lecon-17.html":32,"lecon-18.html":36,"lecon-19.html":36,"lecon-20.html":34,"lecon-21.html":34,"lecon-22.html":35,"lecon-23.html":36,"lecon-24.html":34,"lecon-25.html":35,"lecon-26.html":33,"lecon-27.html":33,"lecon-28.html":33,"lecon-29.html":35,"lecon-30.html":32,"lecon-31.html":34,"lecon-32.html":32,"lecon-33.html":34,"lecon-34.html":33,"lecon-35.html":33,"lecon-36.html":33,"lecon-37.html":30,"lecon-38.html":34,"lecon-39.html":34,"lecon-40.html":34,"lecon-41.html":34,"lecon-42.html":34,"lecon-43.html":34,"lecon-44.html":34,"lecon-45.html":35,"lecon-46.html":35,"lecon-47.html":38},
    "dart": {"lecon-01.html":40,"lecon-02.html":50,"lecon-03.html":45,"lecon-04.html":45,"lecon-05.html":50,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":50,"lecon-09.html":50,"lecon-10.html":50,"lecon-11.html":55,"lecon-12.html":48,"lecon-13.html":50,"lecon-14.html":46,"lecon-15.html":52,"lecon-16.html":55},
    "data-eng": {"lecon-01.html":30,"lecon-02.html":34,"lecon-03.html":35,"lecon-04.html":36,"lecon-05.html":37,"lecon-06.html":38,"lecon-07.html":36,"lecon-08.html":37,"lecon-09.html":36,"lecon-10.html":36,"lecon-11.html":37,"lecon-12.html":36,"lecon-13.html":38,"lecon-14.html":44},
    "bdd": {"lecon-01.html":32,"lecon-02.html":34,"lecon-03.html":36,"lecon-04.html":38,"lecon-05.html":34,"lecon-06.html":38,"lecon-07.html":36,"lecon-08.html":38,"lecon-09.html":40,"lecon-10.html":36,"lecon-11.html":38,"lecon-12.html":40,"lecon-13.html":44,"lecon-14.html":38,"lecon-15.html":46},
    "mobile": {"lecon-01.html":28,"lecon-02.html":31,"lecon-03.html":33,"lecon-04.html":34,"lecon-05.html":35,"lecon-06.html":37,"lecon-07.html":37,"lecon-08.html":35,"lecon-09.html":36,"lecon-10.html":36,"lecon-11.html":38,"lecon-12.html":35,"lecon-13.html":34,"lecon-14.html":35,"lecon-15.html":45},
    "equipe": {"lecon-01.html":28,"lecon-02.html":33,"lecon-03.html":34,"lecon-04.html":35,"lecon-05.html":34,"lecon-06.html":34,"lecon-07.html":32,"lecon-08.html":35,"lecon-09.html":35,"lecon-10.html":36,"lecon-11.html":38,"lecon-12.html":38,"lecon-13.html":37,"lecon-14.html":46},
    "docker": {"lecon-01.html":30,"lecon-02.html":35,"lecon-03.html":40,"lecon-04.html":40,"lecon-05.html":40,"lecon-06.html":40,"lecon-07.html":35,"lecon-08.html":40,"lecon-09.html":40,"lecon-10.html":38,"lecon-11.html":40,"lecon-12.html":42,"lecon-13.html":40,"lecon-14.html":38,"lecon-15.html":42},
    "elixir": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":50,"lecon-05.html":50,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":55,"lecon-09.html":55,"lecon-10.html":55,"lecon-11.html":50,"lecon-12.html":50,"lecon-13.html":48,"lecon-14.html":50,"lecon-15.html":52,"lecon-16.html":50,"lecon-17.html":55},
    "erlang": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":45,"lecon-10.html":52,"lecon-11.html":52,"lecon-12.html":55,"lecon-13.html":50,"lecon-14.html":55},
    "formats": {"lecon-01.html":30,"lecon-02.html":37,"lecon-03.html":35,"lecon-04.html":37,"lecon-05.html":35,"lecon-06.html":37,"lecon-07.html":40,"lecon-08.html":40,"lecon-09.html":40,"lecon-10.html":40,"lecon-11.html":45},
    "fortran": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":55,"lecon-09.html":45,"lecon-10.html":50,"lecon-11.html":52,"lecon-12.html":54,"lecon-13.html":52,"lecon-14.html":56},
    "fsharp": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":50,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":50,"lecon-09.html":45,"lecon-10.html":50,"lecon-11.html":55,"lecon-12.html":50,"lecon-13.html":50,"lecon-14.html":55},
    "git": {"lecon-01.html":28,"lecon-02.html":30,"lecon-03.html":30,"lecon-04.html":32,"lecon-05.html":32,"lecon-06.html":32,"lecon-07.html":35,"lecon-08.html":33,"lecon-09.html":33,"lecon-10.html":35,"lecon-11.html":32,"lecon-12.html":34,"lecon-13.html":32,"lecon-14.html":32,"lecon-15.html":34,"lecon-16.html":34,"lecon-17.html":34,"lecon-18.html":36,"lecon-19.html":34,"lecon-20.html":34,"lecon-21.html":33,"lecon-22.html":36,"lecon-23.html":35,"lecon-24.html":40},
    "go": {"lecon-01.html":28,"lecon-02.html":32,"lecon-03.html":35,"lecon-04.html":35,"lecon-05.html":33,"lecon-06.html":33,"lecon-07.html":36,"lecon-08.html":31,"lecon-09.html":31,"lecon-10.html":34,"lecon-11.html":36,"lecon-12.html":35,"lecon-13.html":35,"lecon-14.html":36,"lecon-15.html":35,"lecon-16.html":35,"lecon-17.html":36,"lecon-18.html":40},
    "groovy": {"lecon-01.html":40,"lecon-02.html":45,"lecon-03.html":45,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":50,"lecon-09.html":50,"lecon-10.html":52,"lecon-11.html":50,"lecon-12.html":48,"lecon-13.html":46,"lecon-14.html":55},
    "haskell": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":50,"lecon-05.html":55,"lecon-06.html":55,"lecon-07.html":55,"lecon-08.html":60,"lecon-09.html":55,"lecon-10.html":50,"lecon-11.html":50,"lecon-12.html":55,"lecon-13.html":55,"lecon-14.html":55,"lecon-15.html":60,"lecon-16.html":58,"lecon-17.html":58,"lecon-18.html":62},
    "html": {"lecon-01.html":32,"lecon-02.html":30,"lecon-03.html":30,"lecon-04.html":32,"lecon-05.html":32,"lecon-06.html":30,"lecon-07.html":30,"lecon-08.html":32,"lecon-09.html":34,"lecon-10.html":32,"lecon-11.html":32,"lecon-12.html":30,"lecon-13.html":34,"lecon-14.html":32,"lecon-15.html":32,"lecon-16.html":32,"lecon-17.html":32,"lecon-18.html":35,"lecon-19.html":35,"lecon-20.html":32,"lecon-21.html":30,"lecon-22.html":32,"lecon-23.html":34,"lecon-24.html":34,"lecon-25.html":36,"lecon-26.html":28,"lecon-27.html":33,"lecon-28.html":31,"lecon-29.html":30,"lecon-30.html":34,"lecon-31.html":32,"lecon-32.html":34,"lecon-33.html":32,"lecon-34.html":32,"lecon-35.html":32,"lecon-36.html":32,"lecon-37.html":32,"lecon-38.html":34,"lecon-39.html":35,"lecon-40.html":35,"lecon-41.html":34,"lecon-42.html":36,"lecon-43.html":34,"lecon-44.html":36,"lecon-45.html":35,"lecon-46.html":36,"lecon-47.html":38},
    "http": {"lecon-01.html":24,"lecon-02.html":26,"lecon-03.html":28,"lecon-04.html":28,"lecon-05.html":30,"lecon-06.html":30,"lecon-07.html":30,"lecon-08.html":34,"lecon-09.html":33,"lecon-10.html":36,"lecon-11.html":32,"lecon-12.html":40},
    "java": {"lecon-01.html":30,"lecon-02.html":33,"lecon-03.html":32,"lecon-04.html":33,"lecon-05.html":34,"lecon-06.html":34,"lecon-07.html":34,"lecon-08.html":32,"lecon-09.html":35,"lecon-10.html":35,"lecon-11.html":35,"lecon-12.html":35,"lecon-13.html":32,"lecon-14.html":32,"lecon-15.html":36,"lecon-16.html":34,"lecon-17.html":35,"lecon-18.html":40,"lecon-19.html":34,"lecon-20.html":35,"lecon-21.html":36,"lecon-22.html":38,"lecon-23.html":40},
    "javascript": {"lecon-01.html":30,"lecon-02.html":33,"lecon-03.html":33,"lecon-04.html":35,"lecon-05.html":34,"lecon-06.html":36,"lecon-07.html":34,"lecon-08.html":38,"lecon-09.html":36,"lecon-10.html":38,"lecon-11.html":38,"lecon-12.html":42,"lecon-13.html":34,"lecon-14.html":32,"lecon-15.html":32,"lecon-16.html":38,"lecon-17.html":36,"lecon-18.html":36,"lecon-19.html":36,"lecon-20.html":38,"lecon-21.html":37,"lecon-22.html":35,"lecon-23.html":37,"lecon-24.html":38,"lecon-25.html":35,"lecon-26.html":36,"lecon-27.html":36,"lecon-28.html":34,"lecon-29.html":36,"lecon-30.html":34,"lecon-31.html":40,"lecon-32.html":33,"lecon-33.html":35,"lecon-34.html":35,"lecon-35.html":35,"lecon-36.html":36,"lecon-37.html":34,"lecon-38.html":34,"lecon-39.html":34,"lecon-40.html":36,"lecon-41.html":35,"lecon-42.html":36,"lecon-43.html":35,"lecon-44.html":37,"lecon-45.html":38,"lecon-46.html":37,"lecon-47.html":36,"lecon-48.html":36,"lecon-49.html":36,"lecon-50.html":36,"lecon-51.html":35,"lecon-52.html":36,"lecon-53.html":35,"lecon-54.html":36,"lecon-55.html":35,"lecon-56.html":35,"lecon-57.html":34,"lecon-58.html":36,"lecon-59.html":36,"lecon-60.html":34,"lecon-61.html":37,"lecon-62.html":35,"lecon-63.html":36,"lecon-64.html":36,"lecon-65.html":38},
    "julia": {"lecon-01.html":40,"lecon-02.html":50,"lecon-03.html":45,"lecon-04.html":50,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":50,"lecon-10.html":50,"lecon-11.html":50,"lecon-12.html":52,"lecon-13.html":55,"lecon-14.html":52,"lecon-15.html":54,"lecon-16.html":50},
    "kotlin": {"lecon-01.html":40,"lecon-02.html":45,"lecon-03.html":45,"lecon-04.html":45,"lecon-05.html":45,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":50,"lecon-09.html":50,"lecon-10.html":45,"lecon-11.html":45,"lecon-12.html":45,"lecon-13.html":50,"lecon-14.html":44,"lecon-15.html":50,"lecon-16.html":40,"lecon-17.html":50,"lecon-18.html":50,"lecon-19.html":48,"lecon-20.html":50,"lecon-21.html":55},
    "lisp": {"lecon-01.html":40,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":50,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":60,"lecon-09.html":50,"lecon-10.html":45,"lecon-11.html":55,"lecon-12.html":55,"lecon-13.html":60,"lecon-14.html":55,"lecon-15.html":60},
    "lua": {"lecon-01.html":40,"lecon-02.html":45,"lecon-03.html":45,"lecon-04.html":45,"lecon-05.html":50,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":50,"lecon-09.html":50,"lecon-10.html":50,"lecon-11.html":50,"lecon-12.html":55,"lecon-13.html":55,"lecon-14.html":50,"lecon-15.html":50,"lecon-16.html":50,"lecon-17.html":55,"lecon-18.html":50,"lecon-19.html":50,"lecon-20.html":60},
    "markdown": {"lecon-01.html":24,"lecon-02.html":32,"lecon-03.html":32,"lecon-04.html":32,"lecon-05.html":35,"lecon-06.html":36,"lecon-07.html":34,"lecon-08.html":35,"lecon-09.html":34,"lecon-10.html":35,"lecon-11.html":40},
    "nodejs": {"lecon-01.html":31,"lecon-02.html":33,"lecon-03.html":33,"lecon-04.html":34,"lecon-05.html":32,"lecon-06.html":30,"lecon-07.html":34,"lecon-08.html":33,"lecon-09.html":31,"lecon-10.html":35,"lecon-11.html":37,"lecon-12.html":34,"lecon-13.html":32,"lecon-14.html":33,"lecon-15.html":36,"lecon-16.html":38,"lecon-17.html":36,"lecon-18.html":35,"lecon-19.html":37,"lecon-20.html":34,"lecon-21.html":40,"lecon-22.html":40,"lecon-23.html":36,"lecon-24.html":38,"lecon-25.html":36,"lecon-26.html":37,"lecon-27.html":40},
    "nosql": {"lecon-01.html":33,"lecon-02.html":37,"lecon-03.html":38,"lecon-04.html":38,"lecon-05.html":35,"lecon-06.html":34,"lecon-07.html":36,"lecon-08.html":38,"lecon-09.html":39,"lecon-10.html":40,"lecon-11.html":37,"lecon-12.html":38,"lecon-13.html":39,"lecon-14.html":42},
    "objc": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":45,"lecon-10.html":50,"lecon-11.html":52,"lecon-12.html":55,"lecon-13.html":52,"lecon-14.html":60},
    "ocaml": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":55,"lecon-09.html":50,"lecon-10.html":45,"lecon-11.html":55,"lecon-12.html":55,"lecon-13.html":50,"lecon-14.html":50,"lecon-15.html":50,"lecon-16.html":55,"lecon-17.html":55,"lecon-18.html":55},
    "pascal": {"lecon-01.html":39,"lecon-02.html":44,"lecon-03.html":45,"lecon-04.html":50,"lecon-05.html":50,"lecon-06.html":51,"lecon-07.html":55,"lecon-08.html":50,"lecon-09.html":40,"lecon-10.html":50,"lecon-11.html":48,"lecon-12.html":52,"lecon-13.html":54,"lecon-14.html":46},
    "patterns": {"lecon-01.html":30,"lecon-02.html":37,"lecon-03.html":38,"lecon-04.html":38,"lecon-05.html":38,"lecon-06.html":33,"lecon-07.html":36,"lecon-08.html":37,"lecon-09.html":36,"lecon-10.html":35,"lecon-11.html":40},
    "perl": {"lecon-01.html":40,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":50,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":55,"lecon-09.html":50,"lecon-10.html":50,"lecon-11.html":38,"lecon-12.html":42,"lecon-13.html":40,"lecon-14.html":45,"lecon-15.html":48,"lecon-16.html":50},
    "php": {"lecon-01.html":29,"lecon-02.html":33,"lecon-03.html":30,"lecon-04.html":34,"lecon-05.html":34,"lecon-06.html":32,"lecon-07.html":36,"lecon-08.html":34,"lecon-09.html":33,"lecon-10.html":35,"lecon-11.html":32,"lecon-12.html":34,"lecon-13.html":35,"lecon-14.html":35,"lecon-15.html":45,"lecon-16.html":45,"lecon-17.html":36,"lecon-18.html":35,"lecon-19.html":36,"lecon-20.html":37,"lecon-21.html":40},
    "powershell": {"lecon-01.html":40,"lecon-02.html":45,"lecon-03.html":50,"lecon-04.html":45,"lecon-05.html":50,"lecon-06.html":55,"lecon-07.html":50,"lecon-08.html":50,"lecon-09.html":55,"lecon-10.html":55,"lecon-11.html":50,"lecon-12.html":45,"lecon-13.html":50,"lecon-14.html":52,"lecon-15.html":55,"lecon-16.html":52,"lecon-17.html":55},
    "projets-js": {"lecon-01.html":32,"lecon-02.html":34,"lecon-03.html":32,"lecon-04.html":34,"lecon-05.html":33,"lecon-06.html":37,"lecon-07.html":31,"lecon-08.html":33,"lecon-09.html":33,"lecon-10.html":35,"lecon-11.html":33,"lecon-12.html":35,"lecon-13.html":33,"lecon-14.html":35,"lecon-15.html":35,"lecon-16.html":37,"lecon-17.html":38,"lecon-18.html":38,"lecon-19.html":38,"lecon-20.html":34,"lecon-21.html":36,"lecon-22.html":35,"lecon-23.html":35,"lecon-24.html":40},
    "prolog": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":40,"lecon-10.html":45,"lecon-11.html":50,"lecon-12.html":52,"lecon-13.html":55,"lecon-14.html":48},
    "python": {"lecon-01.html":32,"lecon-02.html":30,"lecon-03.html":31,"lecon-04.html":33,"lecon-05.html":33,"lecon-06.html":35,"lecon-07.html":34,"lecon-08.html":35,"lecon-09.html":32,"lecon-10.html":32,"lecon-11.html":32,"lecon-12.html":34,"lecon-13.html":36,"lecon-14.html":35,"lecon-15.html":33,"lecon-16.html":34,"lecon-17.html":33,"lecon-18.html":33,"lecon-19.html":34,"lecon-20.html":34,"lecon-21.html":40,"lecon-22.html":44,"lecon-23.html":40,"lecon-24.html":36,"lecon-25.html":36,"lecon-26.html":38,"lecon-27.html":37,"lecon-28.html":40,"lecon-29.html":34,"lecon-30.html":36,"lecon-31.html":35,"lecon-32.html":35,"lecon-33.html":33,"lecon-34.html":33,"lecon-35.html":37,"lecon-36.html":35,"lecon-37.html":33,"lecon-38.html":35,"lecon-39.html":35,"lecon-40.html":37,"lecon-41.html":35,"lecon-42.html":35,"lecon-43.html":35,"lecon-44.html":37,"lecon-45.html":34,"lecon-46.html":35,"lecon-47.html":34,"lecon-48.html":36,"lecon-49.html":40,"lecon-50.html":42},
    "r": {"lecon-01.html":40,"lecon-02.html":50,"lecon-03.html":45,"lecon-04.html":50,"lecon-05.html":55,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":50,"lecon-09.html":55,"lecon-10.html":55,"lecon-11.html":50,"lecon-12.html":50,"lecon-13.html":52,"lecon-14.html":50,"lecon-15.html":52,"lecon-16.html":50,"lecon-17.html":55},
    "pandas": {"lecon-01.html":34,"lecon-02.html":35,"lecon-03.html":36,"lecon-04.html":37,"lecon-05.html":35,"lecon-06.html":36,"lecon-07.html":34,"lecon-08.html":37,"lecon-09.html":38,"lecon-10.html":38,"lecon-11.html":38,"lecon-12.html":40,"lecon-13.html":38,"lecon-14.html":42},
    "dataviz": {"lecon-01.html":32,"lecon-02.html":34,"lecon-03.html":34,"lecon-04.html":36,"lecon-05.html":36,"lecon-06.html":38,"lecon-07.html":37,"lecon-08.html":37,"lecon-09.html":38,"lecon-10.html":38,"lecon-11.html":38,"lecon-12.html":40,"lecon-13.html":38,"lecon-14.html":42},
    "stats": {"lecon-01.html":32,"lecon-02.html":36,"lecon-03.html":38,"lecon-04.html":38,"lecon-05.html":36,"lecon-06.html":40,"lecon-07.html":40,"lecon-08.html":42,"lecon-09.html":38,"lecon-10.html":38,"lecon-11.html":40,"lecon-12.html":38,"lecon-13.html":40,"lecon-14.html":38,"lecon-15.html":44},
    "react": {"lecon-01.html":35,"lecon-02.html":33,"lecon-03.html":33,"lecon-04.html":31,"lecon-05.html":31,"lecon-06.html":36,"lecon-07.html":33,"lecon-08.html":35,"lecon-09.html":36,"lecon-10.html":35,"lecon-11.html":35,"lecon-12.html":35,"lecon-13.html":35,"lecon-14.html":35,"lecon-15.html":35,"lecon-16.html":35,"lecon-17.html":35,"lecon-18.html":37,"lecon-19.html":37,"lecon-20.html":35,"lecon-21.html":40,"lecon-22.html":37,"lecon-23.html":36,"lecon-24.html":35,"lecon-25.html":36,"lecon-26.html":40},
    "regex": {"lecon-01.html":30,"lecon-02.html":33,"lecon-03.html":36,"lecon-04.html":36,"lecon-05.html":39,"lecon-06.html":39,"lecon-07.html":42,"lecon-08.html":38,"lecon-09.html":41,"lecon-10.html":37,"lecon-11.html":45},
    "ruby": {"lecon-01.html":40,"lecon-02.html":44,"lecon-03.html":44,"lecon-04.html":45,"lecon-05.html":45,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":45,"lecon-09.html":48,"lecon-10.html":50,"lecon-11.html":50,"lecon-12.html":44,"lecon-13.html":45,"lecon-14.html":50,"lecon-15.html":50,"lecon-16.html":44,"lecon-17.html":44,"lecon-18.html":44,"lecon-19.html":45,"lecon-20.html":40,"lecon-21.html":42,"lecon-22.html":40},
    "rust": {"lecon-01.html":31,"lecon-02.html":33,"lecon-03.html":35,"lecon-04.html":35,"lecon-05.html":37,"lecon-06.html":35,"lecon-07.html":35,"lecon-08.html":37,"lecon-09.html":35,"lecon-10.html":35,"lecon-11.html":31,"lecon-12.html":37,"lecon-13.html":34,"lecon-14.html":36,"lecon-15.html":36,"lecon-16.html":36,"lecon-17.html":36,"lecon-18.html":34,"lecon-19.html":35,"lecon-20.html":34,"lecon-21.html":33,"lecon-22.html":40},
    "sass": {"lecon-01.html":25,"lecon-02.html":27,"lecon-03.html":26,"lecon-04.html":28,"lecon-05.html":28,"lecon-06.html":28,"lecon-07.html":30,"lecon-08.html":30,"lecon-09.html":32,"lecon-10.html":34,"lecon-11.html":34,"lecon-12.html":35,"lecon-13.html":33,"lecon-14.html":36},
    "scala": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":50,"lecon-05.html":55,"lecon-06.html":55,"lecon-07.html":55,"lecon-08.html":50,"lecon-09.html":55,"lecon-10.html":50,"lecon-11.html":50,"lecon-12.html":50,"lecon-13.html":48,"lecon-14.html":50,"lecon-15.html":52,"lecon-16.html":52,"lecon-17.html":55},
    "securite": {"lecon-01.html":30,"lecon-02.html":35,"lecon-03.html":40,"lecon-04.html":40,"lecon-05.html":40,"lecon-06.html":40,"lecon-07.html":35,"lecon-08.html":36,"lecon-09.html":34,"lecon-10.html":42,"lecon-11.html":40,"lecon-12.html":40,"lecon-13.html":45,"lecon-14.html":55},
    "solidity": {"lecon-01.html":44,"lecon-02.html":49,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":55,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":45,"lecon-10.html":55,"lecon-11.html":55,"lecon-12.html":55,"lecon-13.html":50,"lecon-14.html":48,"lecon-15.html":46,"lecon-16.html":50,"lecon-17.html":52},
    "sql": {"lecon-01.html":30,"lecon-02.html":30,"lecon-03.html":29,"lecon-04.html":33,"lecon-05.html":34,"lecon-06.html":33,"lecon-07.html":37,"lecon-08.html":33,"lecon-09.html":34,"lecon-10.html":32,"lecon-11.html":33,"lecon-12.html":33,"lecon-13.html":34,"lecon-14.html":32,"lecon-15.html":34,"lecon-16.html":34,"lecon-17.html":36,"lecon-18.html":34,"lecon-19.html":35,"lecon-20.html":36,"lecon-21.html":35,"lecon-22.html":38,"lecon-23.html":36,"lecon-24.html":40},
    "swift": {"lecon-01.html":40,"lecon-02.html":45,"lecon-03.html":44,"lecon-04.html":45,"lecon-05.html":45,"lecon-06.html":50,"lecon-07.html":50,"lecon-08.html":50,"lecon-09.html":50,"lecon-10.html":45,"lecon-11.html":55,"lecon-12.html":45,"lecon-13.html":50,"lecon-14.html":50,"lecon-15.html":48,"lecon-16.html":48,"lecon-17.html":50,"lecon-18.html":55},
    "tests": {"lecon-01.html":30,"lecon-02.html":35,"lecon-03.html":35,"lecon-04.html":36,"lecon-05.html":37,"lecon-06.html":37,"lecon-07.html":40,"lecon-08.html":42,"lecon-09.html":42,"lecon-10.html":44,"lecon-11.html":40,"lecon-12.html":40,"lecon-13.html":42,"lecon-14.html":46},
    "typescript": {"lecon-01.html":30,"lecon-02.html":34,"lecon-03.html":34,"lecon-04.html":36,"lecon-05.html":35,"lecon-06.html":38,"lecon-07.html":37,"lecon-08.html":35,"lecon-09.html":35,"lecon-10.html":35,"lecon-11.html":36,"lecon-12.html":35,"lecon-13.html":35,"lecon-14.html":40,"lecon-15.html":40,"lecon-16.html":36,"lecon-17.html":37,"lecon-18.html":37,"lecon-19.html":36,"lecon-20.html":40},
    "vb": {"lecon-01.html":40,"lecon-02.html":45,"lecon-03.html":45,"lecon-04.html":50,"lecon-05.html":50,"lecon-06.html":50,"lecon-07.html":55,"lecon-08.html":55,"lecon-09.html":45,"lecon-10.html":50,"lecon-11.html":52,"lecon-12.html":50,"lecon-13.html":52,"lecon-14.html":55},
    "vscode": {"lecon-01.html":25,"lecon-02.html":27,"lecon-03.html":27,"lecon-04.html":29,"lecon-05.html":29,"lecon-06.html":31,"lecon-07.html":32,"lecon-08.html":34,"lecon-09.html":36,"lecon-10.html":37,"lecon-11.html":40},
    "vue": {"lecon-01.html":33,"lecon-02.html":37,"lecon-03.html":37,"lecon-04.html":37,"lecon-05.html":37,"lecon-06.html":30,"lecon-07.html":35,"lecon-08.html":35,"lecon-09.html":37,"lecon-10.html":38,"lecon-11.html":36,"lecon-12.html":34,"lecon-13.html":35,"lecon-14.html":40},
    "zig": {"lecon-01.html":45,"lecon-02.html":50,"lecon-03.html":50,"lecon-04.html":55,"lecon-05.html":55,"lecon-06.html":55,"lecon-07.html":50,"lecon-08.html":55,"lecon-09.html":50,"lecon-10.html":45,"lecon-11.html":55,"lecon-12.html":55,"lecon-13.html":50,"lecon-14.html":50,"lecon-15.html":52,"lecon-16.html":52,"lecon-17.html":52,"lecon-18.html":60},
  };

  /* ---- Niveaux réellement couverts par un cours (DÉDUITS) -------------------
     De plus en plus de cours voient leur difficulté monter au fil des modules :
     chaque module peut porter un `level` (debutant→intermediaire→avance→expert),
     et le cours couvre alors plusieurs niveaux. Plutôt que de recopier
     l'information dans la fiche du catalogue — un champ redondant finit toujours
     par mentir le jour où un module change —, on la DÉDUIT au chargement, à
     partir de `content[id].modules[].level`.
     Résultat : `course.levels` = tableau ordonné du plus simple au plus pointu.
     Les cours dont aucun module ne porte de `level` reçoivent simplement
     `[course.level]`, donc leur comportement est strictement inchangé.       */
  var LEVEL_ORDER = ["debutant", "intermediaire", "avance", "expert"];

  courses.forEach(function (c) {
    var found = {};
    if (c.level) found[c.level] = true; // niveau d'entrée annoncé par la fiche
    var mods = (content[c.id] && content[c.id].modules) || [];
    mods.forEach(function (m) {
      if (m.level && LEVELS[m.level]) found[m.level] = true;
    });
    var list = LEVEL_ORDER.filter(function (k) {
      return found[k];
    });
    c.levels = list.length ? list : c.level ? [c.level] : [];
  });

  /* ---- Durée d'un cours (DÉDUITE) ------------------------------------------
     Même parti pris que `levels` ci-dessus : `hours`, saisi à la main sur
     chaque fiche, avait fini par mentir (jusqu'à +58 % d'écart avec la somme
     réelle des leçons — 983 h annoncées pour 893 h cumulées), ce qui faussait
     le tri « durée » du catalogue. On le RECALCULE au chargement depuis
     `lessonDurations` (minutes → heures arrondies), désormais seule source de
     vérité ; le champ des fiches n'est plus qu'un repli si un cours n'a pas
     encore de durées. La couverture étant totale (une durée par leçon de
     chaque cours), toutes les fiches sont recalculées.                        */
  courses.forEach(function (c) {
    var d = lessonDurations[c.id];
    if (!d) return;
    var total = 0, k;
    for (k in d) if (Object.prototype.hasOwnProperty.call(d, k)) total += d[k];
    if (total > 0) c.hours = Math.round(total / 60);
  });

  return {
    LEVELS: LEVELS,
    LEVEL_ORDER: LEVEL_ORDER,
    courses: courses,
    content: content,
    tracks: tracks,
    durations: lessonDurations,
  };
})();
