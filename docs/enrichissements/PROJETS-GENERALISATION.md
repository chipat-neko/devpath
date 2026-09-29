# Généralisation des « Projets à réaliser » à tous les cours

Chantier : ajouter un **brief de projet contextualisé** (objet dans `js/projets-data.js` → `window.PROJETS`)
pour **chacun des 65 cours**. Page : `pages/projets.html` · Moteur : `js/projets.js`.
Voir la mémoire `projets-contextualises.md` et la trace `.claude/plans/2026-06-18-projets-fil-rouge.md`.

## Méthode (un LOT de 5-8 cours par réveil)
1. **Reprendre au premier cours `[ ]` ci-dessous** dont l'`id` n'est PAS déjà dans `window.PROJETS`
   (vérifier dans `js/projets-data.js`).
2. Rédiger l'objet en **copiant la structure** des briefs existants :
   `{ id, course, courseTitle, dir, accent, type, niveau, titre, contexte(HTML), objectif(HTML),
   livrable, fonctionnalites:[…], criteres:[…], pistes(HTML) }`.
   - `id` = `<dir>-<motcle>` (unique) · `course`/`accent` = **l'id du cours** (couleur + logo) ·
     `dir` = le dossier du cours (pour le lien `<dir>/cours.html`) · `courseTitle` = nom court.
   - `type` adapté au cours (Application, Logiciel, Script, API, Programme, Analyse de données,
     Smart contract, Bibliothèque, Composant web…). `niveau` = Débutant / Intermédiaire / Avancé.
   - Contenu **aligné sur ce que le cours enseigne**, en français correct (accents), avec HTML inline
     léger (`<strong>`, `<code>`). ~5-6 `fonctionnalites`, ~6-7 `criteres` **vérifiables et concrets**,
     `pistes` qui citent les notions/leçons du cours (jamais une solution clé en main).
   - ⚠️ Chaînes en `"..."` avec guillemets internes échappés `\"` ; apostrophes françaises OK.
   - Insérer le(s) objet(s) **avant le `];` final** de `js/projets-data.js`.
3. **Vérifier** : `node --check js/projets-data.js` (doit être OK), 0 BOM, 0 mojibake
   (`Ã©|Ã¨|Ã |Ã§|Â |Ã´|Ã®|Ã¹`). Cocher les cours faits ici.
4. Mettre à jour la mémoire (`projets-contextualises.md` : « X/65 »).
5. **Messages minimaux, PAS de questionnaire aux réveils.** Si **65/65 faits** : vérification légère,
   **couper le cron** (CronDelete), ne pas inventer de travail.

## Suivi (cocher au fur et à mesure)

### Faits (proto + lot 1)
- [x] html · [x] css · [x] javascript · [x] python · [x] sql · [x] algo · [x] typescript · [x] react · [x] nodejs

### Variantes & transversaux (faire en priorité)
- [x] python-avance (dir python-avance) — Outil Python avancé (typing/async/tests)
- [x] html-avance (dir html-avance) — Composant web accessible (dialog/ARIA/Web Components)
- [x] css-avance (dir css-avance) — Interface avancée (animations, container queries, thème)
- [x] js-avance (dir js-avance) — Bibliothèque utilitaire JS (modules, closures, async)
- [x] projets-js (dir projets-js) — Mini-jeu / widget DOM complet
- [x] git (dir git) — Scénario de flux de travail Git (branches, fusion, collaboration)
- [x] bash (dir bash) — Script shell d'automatisation (sauvegarde / traitement de fichiers)
- [x] regex (dir regex) — Jeu de motifs : validateur/extracteur de données
- [x] docker (dir docker) — Conteneuriser une appli (Dockerfile + Compose)
- [x] api (dir api) — Concevoir une API REST (ressources, verbes, statuts)
- [x] securite (dir securite) — Auditer et durcir une appli vulnérable
- [x] tests (dir tests) — Suite de tests d'un module (TDD, AAA)
- [x] patterns (dir patterns) — Refactoriser avec des design patterns
- [x] formats (dir formats) — Convertisseur/validateur JSON/CSV/YAML
- [x] cicd (dir cicd) — Pipeline CI/CD (workflow)
- [x] nosql (dir nosql) — Modéliser une base NoSQL (documents + requêtes)
- [x] markdown (dir markdown) — Rédiger une documentation / README complet
- [x] vscode (dir vscode) — Configurer un environnement de dev (settings/tasks/extensions)
- [x] sass (dir sass) — Système de styles Sass (variables, mixins, partials)
- [x] http (dir http) — Analyser/simuler des échanges HTTP
- [x] vue (dir vue) — Application Vue (composants, réactivité)

### Langages (Programme / Application / Logiciel adapté à chacun)
- [x] java (dir java) — Logiciel POO (gestion d'inventaire)
- [x] c (dir c) — Programme système (mémoire, mini-outil en ligne de commande)
- [x] cpp (dir cpp) — Application C++ (structures de données / petit moteur)
- [x] csharp (dir csharp) — Application .NET (gestion)
- [x] go (dir go) — Service concurrent / CLI en Go
- [x] rust (dir rust) — Outil CLI Rust (gestion d'erreurs, possession)
- [x] php (dir php) — Petit back-end / site dynamique PHP
- [x] ruby (dir ruby) — Script / outil Ruby
- [x] kotlin (dir kotlin) — Application Kotlin
- [x] swift (dir swift) — Application Swift
- [x] r (dir r) — Analyse de données R (jeu de données + stats + graphe)
- [x] dart (dir dart) — Application Dart / Flutter
- [x] lua (dir lua) — Script Lua (configuration / logique de jeu)
- [x] asm (dir asm) — Programme en assembleur x86-64
- [x] haskell (dir haskell) — Programme fonctionnel pur (Haskell)
- [x] elixir (dir elixir) — Service concurrent Elixir
- [x] scala (dir scala) — Application Scala (fonctionnel + JVM)
- [x] powershell (dir powershell) — Script d'automatisation PowerShell
- [x] perl (dir perl) — Script de traitement de texte Perl
- [x] cobol (dir cobol) — Programme de gestion COBOL
- [x] fortran (dir fortran) — Calcul numérique Fortran
- [x] julia (dir julia) — Calcul scientifique Julia
- [x] zig (dir zig) — Programme système Zig
- [x] lisp (dir lisp) — Programme Lisp/Scheme (récursivité, listes)
- [x] ocaml (dir ocaml) — Programme OCaml (types, pattern matching)
- [x] fsharp (dir fsharp) — Application F#
- [x] clojure (dir clojure) — Programme Clojure (données immuables)
- [x] prolog (dir prolog) — Base de connaissances + règles Prolog
- [x] ada (dir ada) — Programme Ada robuste
- [x] pascal (dir pascal) — Programme Pascal / Delphi
- [x] vb (dir vb) — Application Visual Basic
- [x] objc (dir objc) — Application Objective-C
- [x] erlang (dir erlang) — Système concurrent tolérant aux pannes (Erlang)
- [x] groovy (dir groovy) — Script / automatisation Groovy
- [x] solidity (dir solidity) — Smart contract Solidity

**Total : 65 cours — faits 65/65. ✅ CHANTIER TERMINÉ. Cron 714ee3be supprimé.**
