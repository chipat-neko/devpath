# Plan — Fil rouge PROGRESSIF (un seul projet, enrichi cours après cours)
Date : 2026-06-25 · Palier : transversal (nouvelle page + données + script + CSS)

## Objectif
Une 3e forme de « fil rouge », demandée par Noah : un **projet unique cumulatif** qui sert **en continu**
à travers une séquence de cours. Le livrable d'un cours devient la base du suivant.
≠ capstone guidé (par cours) · ≠ briefs autonomes `pages/projets.html` (un projet indépendant par cours, CONSERVÉ).

## Décisions (cadrage utilisateur)
- **Périmètre** : le fil rouge **web seul** d'abord (proto soigné). Le reste (cours non-web) = à décider plus tard.
- **Projet** : « **Mon portfolio + tableau de bord** » — du site statique au full-stack déployé.
- Garder tout l'existant intact.

## Le fil rouge (15 étapes, 1 par cours du parcours web full-stack)
Phase **Frontend** : 1 HTML (structure) · 2 CSS (style + responsive + thème) · 3 JavaScript (interactivité :
filtre projets, validation formulaire, bascule thème) · 4 HTML avancé (modale `<dialog>` + accessibilité) ·
5 CSS avancé (animations, container queries) · 6 JS avancé (modules ES, async, structuration) ·
7 TypeScript (typer données + code) · 8 React (UI en composants).
Phase **Back-end** : 9 Node.js (serveur Express + API contact/projets + route dashboard) · 10 SQL (base :
projets/messages, requêtes du dashboard).
Phase **Industrialisation** : 11 Git (dépôt, branches, .gitignore) · 12 Sécurité (validation, XSS, bcrypt,
requêtes préparées, auth dashboard) · 13 Tests (AAA/TDD, test d'API) · 14 Docker (Dockerfile + Compose +
volume) · 15 CI/CD (workflow install→test→build→déploiement).

Chaque étape : `depart` (ce dont on hérite), `objectif`, `ajoute[]` (ce que CE cours apporte au projet),
`criteres[]` (checklist cochable), `livrable` (l'état du projet à la fin de l'étape).

## Investigation / réutilisation
- Modèle : `pages/projets.html` + `js/projets-data.js` + `js/projets.js` (déjà construits, mêmes conventions).
- CSS : réutiliser `.projets-layout/.projets-list/.projet-item/.projets-main/.project__*/.project-check/
  .project-progress` ; ajouter `.etape-num`, `.etape-depart` (bandeau « on part de… »), `.fr-phase` (séparateur).
- Logos/couleurs : `data-accent="<id>"` + `window.courseLogo(<id>)` (logos.js). Tous les cours web ont un logo/accent.
- localStorage : nouvelle clé `syntaxe-fil-rouge` = `{ "<n>": { "<critereIndex>": true } }`.

## Plan d'implémentation
1. `js/fil-rouge-data.js` → `window.FIL_ROUGE = { titre, sousTitre, intro, etapes:[…15…] }`.
2. `pages/fil-rouge.html` (modèle projets : page-head + layout liste/détail ; scripts main.js + logos.js +
   fil-rouge-data.js + fil-rouge.js).
3. `js/fil-rouge.js` : rendu de la liste (groupée par phase, numéros, compteur de complétion), du détail
   (depart + ajoute + checklist + livrable + lien cours), checklist persistée, progression globale (X/15).
4. `css/pages.css` : petites classes `.etape-num/.etape-depart/.fr-phase` (réutilise le reste).
5. Liens : accueil (footer « Explorer » + carte section « Outils ») + lien croisé depuis `pages/projets.html`
   (et inversement) pour distinguer « projet autonome » vs « fil rouge progressif ».

## Hypothèses & risques
- 15 cours web retenus pour la séquence (html, css, javascript, html-avance, css-avance, js-avance,
  typescript, react, nodejs, sql, git, securite, tests, docker, cicd). Les autres cours = hors de ce fil rouge
  (décision ultérieure).
- Backend/Python/SQL exécutables, Docker, CI/CD = nécessitent un vrai environnement (hors file://) — c'est un
  projet à réaliser par l'apprenant, la page n'exécute rien.

## Vérification (après coup)
- Créés : `js/fil-rouge-data.js` (15 étapes), `js/fil-rouge.js`, `pages/fil-rouge.html`.
  Modifiés : `css/pages.css` (bloc FIL ROUGE), `index.html` (footer + carte Outils), `pages/projets.html`
  (lien croisé).
- `node --check` OK (les 2 JS) ; 0 BOM, 0 mojibake sur les 6 fichiers ; 15 étapes ; HTML équilibré ;
  les 15 cours cibles (html…cicd) existent.
- localStorage `syntaxe-fil-rouge` ; checklist par étape + progression globale (X/15) + complétion d'étape.
- Rendu non testable hors navigateur (file://). Réutilise les composants projets (layout, checklist).
- **Hors web (C, Rust, fonctionnel, COBOL…) = volontairement laissé pour plus tard (choix Noah).**

## Suite (choix Noah) : lien depuis chaque cours web
- `js/cours.js` : mapping `FIL_ROUGE_ETAPE` (courseId → n) + `renderFilRouge()` qui injecte un encart
  `.start-card__filrouge` (lien `../fil-rouge.html#<n>`) dans la `.start-card` — **uniquement** pour les 15
  cours web. CSS `.start-card__filrouge` dans pages.css. Vérifié : node --check OK, data-course ↔ mapping
  cohérent sur les 15 pages, 0 BOM/mojibake. Un seul fichier touché (pas 15 HTML).
