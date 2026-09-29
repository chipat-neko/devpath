# Récapitulatif complet — Syntaxe

> Document de synthèse de **tout** ce qui a été mis en place sur le projet Syntaxe
> (site de cours de programmation, 100 % HTML/CSS/JS « vanilla », compatible `file://`).
> Édité le 17 juin 2026, à la fin du **Lot 5** de gros projets.

---

## 1. Le site en bref

- **65 cours** · **832 leçons** · **59 langages** couverts.
- **~40 pages-outils** transversales (en plus des pages de cours).
- **5 lots** de « gros projets » menés en autonomie via un cron, soit **47 projets** au total
  (G1→G7, P1→P10, R1→R10, S1→S10, T1→T10).
- Tout fonctionne **sans serveur** (ouverture directe des fichiers), sauf quelques fonctions
  signalées comme nécessitant HTTP (voir §6).
- Aucune donnée ne quitte l'appareil : tout est en **`localStorage`**.

---

## 2. Le contenu pédagogique

### Cours et leçons
- **Catalogue de 65 cours**, du débutant à l'avancé, organisés en modules et leçons
  (`js/data.js` = `window.SITE_DATA`).
- **6 cours phares** très complets : JavaScript, Python, SQL, HTML, CSS, CSS avancé.
- Cours transversaux : algo, projets-js, TypeScript, React, Node.js, Git, Docker, API REST,
  Sécurité, Tests, Design patterns, Formats de données, CI/CD, NoSQL, Markdown, Sass, Vue.js,
  HTTP, VS Code, regex, etc.
- **36 langages** documentés en plus (Java, C, C++, C#, Go, Rust, Kotlin, Swift, Dart, Scala,
  Lua, R, Perl, Haskell, Elixir, Erlang, Bash, PowerShell, Clojure, F#, Julia, Groovy, OCaml,
  Lisp, Objective-C, VB, Solidity, Zig, Pascal, Ada, COBOL, Fortran, ASM, Prolog…).

### Dispositifs d'apprentissage ajoutés sur chaque cours
- **QCM `data-quiz`** : 897 blocs de quiz interactifs répartis sur les 832 leçons (≈ 3015 questions).
- **Exercices interactifs `data-exos`** : saisie de texte / code auto-corrigée, indices progressifs,
  jamais la réponse donnée d'emblée — sur les 832 leçons.
- **QCM bilan** de fin de cours (`data-quiz-bilan`).
- **Glossaire « À retenir »** sur les 65 cours (`<dl class="glossary">`, 455 termes au total).
- **Mini-projet « fil rouge » (capstone)** guidé en fin de cours (63 cours applicables).
- **Section « extensions VS Code pour X »** en tête de chaque cours.
- Rapport pédagogique comparatif (`rap_peda.md`) et plan d'améliorations (`PLAN-AMELIORATIONS.md`).

---

## 3. Les fonctionnalités du site

- **Catalogue** : recherche, filtres (niveau), **tri**, **groupement par thème**, recherche
  **profonde** (jusque dans les titres de leçons), surlignage `<mark>`, URL partageable (`?q=`).
- **Navigation de leçon** : fil d'Ariane, précédent/suivant, sommaire (TOC), barre de progression
  de lecture, **bouton Imprimer** (rendu `@media print` propre).
- **Suivi de progression** : leçons terminées, scores de QCM mémorisés, badges de fin de cours,
  réinitialisation, page **Ma progression** (tableau de bord).
- **Accueil** : bandeau « Reprendre où j'en étais ».
- **Page À propos**, durées estimées par leçon.
- **Thème clair / sombre** (anti-clignotement via `theme.js`).

---

## 4. Les 5 lots de gros projets

### Lot 1 — Infrastructure & exécution (G1→G7)
1. **G1** Export / import de la progression (sauvegarde JSON).
2. **G2** Page de recherche dans les leçons (index `search-index.js`, 832 entrées).
3. **G3** Bac à sable web (`playground.html`).
4. **G4** Impression / PDF d'une leçon.
5. **G5** Code **exécutable** dans les leçons — JavaScript (Web Worker), **Python** (Pyodide) et
   **SQL** (sql.js, base de démo) via `runner.js`. ⚠️ Python/SQL = HTTP requis.
6. **G6** Infrastructure d'internationalisation (FR/EN).
7. **G7** Abstraction de synchronisation (`js/sync.js`) + contrat serveur documenté.

### Lot 2 — Expérience d'apprentissage (P1→P10)
1. **P1** Gamification : XP, niveaux, badges de succès (`window.SyntaxeXP`).
2. **P2** Flashcards & révision espacée (Leitner ; 455 cartes, `revision.html`).
3. **P3** Statistiques enrichies : heatmap d'activité SVG + séries (streaks).
4. **P4** Annotations & notes personnelles (surlignage + « Ma note » ; `notes.html`).
5. **P5** Katas auto-corrigés (10 défis JS, worker de test ; `defis.html`).
6. **P6** Examen blanc chronométré (3015 questions ; `examen.html`).
7. **P7** Comparateur de syntaxe multi-langages (`comparateur.html`).
8. **P8** Antisèches imprimables (4 fiches ; `antiseches.html`).
9. **P9** Visualisations d'algorithmes — tris animés (`visualisations.html`).
10. **P10** PWA hors-ligne (`manifest.webmanifest` + `sw.js`). ⚠️ Service worker = HTTP requis.

### Lot 3 — Outils & exploration (R1→R10)
1. **R1** Boîte à outils dev (JSON, Base64, URL, bases, compteur, mot de passe ; `outils.html`).
2. **R2** Testeur de regex interactif (`regex-test.html`).
3. **R3** Visualiseur de structures de données — pile/file/liste/arbre BST (`structures.html`).
4. **R4** Plus de visualisations — quicksort, merge sort, recherche binaire.
5. **R5** Méta-glossaire interactif (455 termes ; `glossaire.html`).
6. **R6** Thèmes de couleur (6 palettes d'accent).
7. **R7** Plan d'étude & objectif quotidien (sur Ma progression).
8. **R8** Carte des cours — graphe SVG des liens (`carte.html`).
9. **R9** Mode diaporama d'une leçon (plein écran).
10. **R10** Générateur de QCM personnel (`mes-qcm.html`).

### Lot 4 — Utilitaires du développeur (S1→S10)
1. **S1** Éditeur Markdown avec aperçu live (`markdown.html`).
2. **S2** Studio de couleurs + contraste WCAG (`couleurs.html`).
3. **S3** Évaluateur d'expressions (shunting-yard maison, sans `eval` ; `expression.html`).
4. **S4** Minuteur Pomodoro (`pomodoro.html`).
5. **S5** Générateur de données de test JSON/CSV (`donnees.html`).
6. **S6** Comparateur de textes / diff (LCS maison ; `diff.html`).
7. **S7** Convertisseur tout-en-un — unités CSS/couleurs/octets/timestamps (`convertir.html`).
8. **S8** Aide-mémoire des raccourcis clavier (`raccourcis.html`).
9. **S9** Devine la sortie — quiz d'extraits de code (`devine.html`).
10. **S10** Bilan d'apprentissage imprimable (`bilan.html`).

### Lot 5 — CSS, données & référence (T1→T10)
1. **T1** Visualiseur Flexbox & Grid (`flexbox.html`).
2. **T2** Générateur de dégradés CSS (`degrade.html`).
3. **T3** Visualiseur d'arbre DOM (`arbre-dom.html`).
4. **T4** Visualiseur de JSON pliable (`json.html`).
5. **T5** Convertisseur de casse & texte (`texte.html`).
6. **T6** Générateur de Lorem Ipsum (`lorem.html`).
7. **T7** Table de vérité booléenne (parseur maison, sans `eval` ; `verite.html`).
8. **T8** Lexique anglais de la programmation (64 termes + quiz ; `lexique.html`).
9. **T9** Fiches de référence — ASCII / HTTP / entités HTML / Markdown (`reference.html`).
10. **T10** Gestionnaire de mes données localStorage (`donnees-perso.html`).

---

## 5. Récap technique

### Organisation des fichiers
- `index.html` — accueil + pied de page listant tous les outils.
- `pages/` — pages transversales (outils, catalogue, progression…) et un dossier par cours
  (`pages/<dir>/cours.html` + `lecon-NN.html`).
- `css/` — `variables.css`, `base.css`, `layout.css`, `components.css`, `pages.css`.
- `js/` — un script par page/fonctionnalité ; `main.js` (commun), `theme.js` (anti-FOUC),
  `data.js` (`SITE_DATA`), `runner.js` (exécution de code), `lecon.js` (moteur de leçon).
- Données générées : `RECAP-COMPLET.md` (ce document), `GROS-PROJETS.md` (feuille de route).

### Index pré-générés (pour rester `file://`, sans `fetch`)
- `js/search-index.js` — 832 leçons indexées (recherche).
- `js/flashcards-data.js` — 455 cartes (flashcards + méta-glossaire).
- `js/quiz-index.js` — 3015 questions (examen blanc).
- `durations` dans `js/data.js` — durée des 832 leçons.
> ⚠️ Ces index sont à **régénérer** si le contenu des leçons / glossaires / QCM change.

### Clés `localStorage` (préfixe `syntaxe-`)
`progress` · `quiz` · `activity` · `last` · `theme` · `theme-color` · `lang` · `notes` ·
`revision` · `defis` · `mes-qcm` · `goal` · `pomodoro` · `playground` · `console-python`.
> La page **« Mes données »** (`donnees-perso.html`) permet de toutes les voir, exporter, importer
> ou effacer.

---

## 6. Limites connues (nécessitent un serveur HTTP)

- **G5** : exécution **Python** (Pyodide) et **SQL** (sql.js) — chargent des bibliothèques par CDN
  dans un Web Worker, ce qui ne fonctionne pas en `file://`.
- **P10** : le **service worker** (PWA hors-ligne) ne s'enregistre qu'en **HTTPS** ou
  `http://localhost`. Le manifeste, lui, est injecté partout.
- **G7** : la synchronisation multi-appareils suppose un **backend** (hors du périmètre autonome) ;
  seule l'abstraction côté client est en place.

Pour tester ces fonctions : servir le dossier en HTTP (ex. `python -m http.server`) puis ouvrir
`http://localhost:8000`.

---

## 7. Méthode de travail

- **Un projet à la fois**, terminé et vérifié avant le suivant.
- **Vérification systématique** : délimiteurs équilibrés, 0 BOM, 0 mojibake réel, JSON validé.
- Tout en **français** avec accents, sans bibliothèque externe (hors polices + CDN d'exécution).
- Avancement piloté par un **cron** (réveils réguliers), **désormais coupé** : le site est en veille
  jusqu'à une nouvelle demande.

---

*Fin du récapitulatif. Le projet couvre aujourd'hui un site de cours complet doublé d'une véritable
suite d'outils pédagogiques et de développement, le tout hors-ligne et respectueux des données.*
