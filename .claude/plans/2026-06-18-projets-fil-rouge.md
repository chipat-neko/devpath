# Plan — Projets fil rouge contextualisés (page globale « Projets »)
Date : 2026-06-18 · Palier : transversal → architectural (nouvelle fonctionnalité + page + données + CSS)

## Objectif
Ajouter une fonctionnalité « Projet à réaliser » par cours : on pose un **contexte** (mise en situation)
+ un **cahier des charges**, l'apprenant réalise le livrable lui-même (site web pour HTML/CSS/JS ;
application/logiciel/script/API selon le cours). **Différent** du « Mini-projet fil rouge » guidé déjà
présent dans la dernière leçon (celui-ci est ouvert, sans pas-à-pas).

## Décisions (cadrage utilisateur)
- **Emplacement** : page globale `pages/projets.html` listant un projet par cours.
- **Format** : brief complet = contexte + objectif + livrable + fonctionnalités attendues +
  **critères de réussite (checklist cochable)** + **pistes (repliées)**.
- **Périmètre de départ** : prototype sur le **trio web** (HTML, CSS, JavaScript). Généralisation ensuite.

## Investigation
- **Modèle de page** : `pages/defis.html` — head standard (theme.js, fonts, 5 CSS), header standard,
  `main > .page-head (breadcrumb+kicker+h1+lead) + section > .container--wide`, footer simple,
  scripts `main.js` + `<page>-data.js` + `<page>.js` (defer).
- **Modèle de données** : `js/defis-data.js` → `window.DEFIS = [{id, titre, niveau, enonce(HTML), …}]`.
- **Modèle de script** : `js/defis.js` — IIFE `"use strict"`, `esc()`, localStorage via
  `JSON.parse(localStorage.getItem(KEY)||"{}")` / `setItem`, clé `syntaxe-defis`, rendu DOM.
- **Layout liste+détail** : CSS `.defis-layout` (grid `260px 1fr`, responsive `1fr`), `.defis-list`,
  `.defis-main`. Je clone en `.projets-layout/.projets-list/.projets-main`.
- **Glyphs de cours** : `js/logos.js` → `window.courseLogo(id)` + `[data-course-logo]` ; couleur via
  `[data-accent="<id>"]{--card-accent}` (CSS, déjà en place).
- **Composants réutilisés** : `.card`, `.badge`, `.pill--*`, `.callout--note`, `<details>`, `.kicker`.

## Conventions / risques
- 100 % file:// (aucun fetch ; data injectées via `<script>`). Français correct (accents).
- localStorage préfixe `syntaxe-` → nouvelle clé `syntaxe-projets` = `{ projetId: { critereIndex: true } }`.
- Pas de tests auto (un site/app complet ne s'auto-corrige pas) → la checklist est l'auto-évaluation.
- Risque : doublon perçu avec le capstone de la dernière leçon → bien distinguer le ton (ouvert vs guidé)
  dans le lead de la page. Lier le brief vers le cours concerné.
- Vérif : 0 BOM, 0 mojibake, délimiteurs JS équilibrés, structure HTML équilibrée, liens valides.

## Plan d'implémentation
1. `js/projets-data.js` — `window.PROJETS = [...]` : 3 briefs (html, css, javascript), riches et alignés
   sur le contenu réel des cours. Champs : `{id, course, courseTitle, dir, accent, type, niveau, titre,
   contexte(HTML), objectif(HTML), livrable, fonctionnalites:[…], criteres:[…], pistes(HTML)}`.
2. `pages/projets.html` — modèle defis : page-head + `.projets-layout` (aside liste + main détail).
   Scripts : main.js + logos.js + projets-data.js + projets.js.
3. `js/projets.js` — rendu liste (glyph cours + titre + type + compteur coché), rendu brief, checklist
   cochable persistée (`syntaxe-projets`), barre de progression par projet.
4. `css/pages.css` — `.projets-layout/.projets-list/.projets-main` (clone defis) + `.project__head`,
   `.project-meta`, `.project-check` (checklist), etc.
5. Liens depuis l'accueil : footer « Explorer » + une carte dans la section « Outils & pratique ».

## Hypothèses & risques
- Choix des sujets pour éviter le doublon avec les fils rouges des cours : HTML = site vitrine d'un café ;
  CSS = habiller/mettre en forme une page produit ; JS = quiz interactif (≠ gestionnaire de tâches, qui
  est déjà le fil rouge du cours JS).
- La généralisation aux ~60 autres cours se fera ensuite (mêmes données, un objet par cours) — éventuellement
  via le cron une fois le format validé par l'utilisateur.

## Vérification (rempli après coup)
- Fichiers créés : `js/projets-data.js`, `js/projets.js`, `pages/projets.html` ; modifiés : `css/pages.css`
  (bloc PROJETS), `index.html` (footer Explorer + carte section Outils).
- BOM=0, mojibake=0 sur les 5 fichiers. `node --check` OK sur projets-data.js et projets.js.
- Structure HTML projets.html équilibrée (html/head/body/header/main/section/footer/aside 1/1).
- Liens cibles OK (html/css/js cours.html, projets.html, scripts).
- Rendu visuel non testable hors navigateur (file://). Logique : liste 3 projets, sélection, checklist
  cochable persistée `syntaxe-projets`, barre de progression, pistes repliées.
- **État : PROTO (3/65 cours = html, css, javascript). Reste à généraliser aux autres cours.**
