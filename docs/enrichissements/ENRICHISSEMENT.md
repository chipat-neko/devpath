# Enrichissement du site Syntaxe — plan d'exécution (pour le cron)

Chantier autonome (suite des 4 cours modernes). Le site est déjà très complet (69 cours, 11 fils rouges,
~50 pages-outils, gamification faite). On enrichit le **contenu**. Méthode = identique à `NOUVEAUX-COURS.md`.
Demande de Noah (2026-06-25) : « en autonomie (cron) », « je te laisse choisir l'ordre tant que tout est fait ».

## Méthode (UN cours/module par réveil, sinon UN module)
Pour chaque cours : (a) 3 insertions `js/data.js` (courses[], content{}, lessonDurations{}) ; (b) `pages/<dir>/cours.html`
copié du cours MODÈLE et adapté (data-course, hero, extensions VS Code, objectifs, programme, `#recap`+glossary, start-card) ;
(c) les `pages/<dir>/lecon-NN.html` rédigées (.prose, code-block `language-…`, callouts, `data-quiz`, `data-exos` `type:text`
hors JS, **capstone « Mini-projet fil rouge » + `data-quiz-bilan` sur la DERNIÈRE leçon**, `data-course`/`data-lesson` sur
le body) ; (d) accent `[data-accent="<id>"]` clair + sombre dans `css/pages.css` ; (e) classer l'id dans `js/catalogue.js` ;
(f) logo dans `js/logos.js` (LOGOS + ID_TO_LOGO) ; (g) un brief dans `js/projets-data.js` ; (h) éligibilité fil rouge si
pertinent (`js/cours.js` FILS_ROUGES). **Vérifier TOUJOURS** : `node --check`, `ConvertFrom-Json` des blocs, 0 BOM,
0 mojibake (`Ã©|Ã¨|Ã |Ã§|Â |Ã´|Ã®|Ã¹`), balises équilibrées, `file` de content existants.
À la fin d'un cours : régénérer `js/search-index.js` (script Node idempotent, cf. cours-modernes) ou le signaler.

## PHASE 1 — Nouveaux cours (vague 1)
| # | id | dir | Titre | Modèle | Accent (hex) | Leçons |
|---|----|-----|-------|--------|--------------|--------|
| 1 | `a11y` | `a11y` | Accessibilité web (a11y) | `html` | `#2aa37a` (sombre `#3fc99a`) | 6 |
| 2 | `perf-web` | `perf-web` | Performance & SEO web | `http` | `#e0972a` (sombre `#f0b452`) | 6 |
| 3 | `cloud` | `cloud` | Cloud & déploiement (fondamentaux) | `docker` | `#e8821e` (sombre `#f59e47`) | 7 |
| 4 | `iac` | `iac` | Infrastructure as Code (Terraform) | `docker` | `#7b42bc` (sombre `#9d6fd6`) | 6 |
| 5 | `archi` | `archi` | Architecture logicielle | `patterns` | `#5a7d9a` (sombre `#7fa3c0`) | 7 |
| 6 | `wasm` | `wasm` | WebAssembly | `cpp` | `#654ff0` (sombre `#8b78f5`) | 6 |

### Programmes (modules → leçons)
**1. a11y — Accessibilité web (6)** · catalogue « Front-end & web »
- M01 Comprendre : L1 Pourquoi l'accessibilité (handicaps, WCAG, cadre légal) · L2 HTML sémantique & structure de page
- M02 Mettre en œuvre : L3 Images, formulaires & navigation clavier · L4 ARIA & composants interactifs · L5 Couleurs, contrastes & responsive
- M03 Pratique : L6 **Capstone** — auditer et corriger une page (axe DevTools, checklist)

**2. perf-web — Performance & SEO web (6)** · catalogue « Front-end & web »
- M01 Performance : L1 Les Web Vitals (LCP, CLS, INP) · L2 Optimiser le chargement (images, lazy-loading, cache) · L3 JS & rendu (bundle, chemin critique)
- M02 SEO : L4 SEO technique (balises, sitemap, robots) · L5 Contenu & données structurées (schema.org)
- M03 Pratique : L6 **Capstone** — auditer et optimiser un site (Lighthouse)

**3. cloud — Cloud & déploiement (7)** · catalogue « Outils, pratiques & transversaux »
- M01 Concepts : L1 Qu'est-ce que le cloud (IaaS/PaaS/SaaS) · L2 Régions, disponibilité & réseau · L3 Stockage & bases gérées
- M02 Déployer : L4 Le calcul (VM, conteneurs, serverless) · L5 Coûts & dimensionnement · L6 Sécurité & IAM
- M03 Pratique : L7 **Capstone** — concevoir le déploiement cloud d'une application

**4. iac — Infrastructure as Code / Terraform (6)** · catalogue « Outils, pratiques & transversaux »
- M01 Bases : L1 Pourquoi l'Infrastructure as Code · L2 Terraform : providers & ressources · L3 Variables, state, plan/apply
- M02 Structurer : L4 Modules & réutilisation · L5 Environnements & bonnes pratiques
- M03 Pratique : L6 **Capstone** — décrire une infra complète (→ devient la **4ᵉ étape du fil rouge DevOps**)

**5. archi — Architecture logicielle (7)** · catalogue « Outils, pratiques & transversaux »
- M01 Fondations : L1 Qu'est-ce qu'une architecture logicielle · L2 Couches & séparation des responsabilités · L3 Couplage, cohésion & dépendances
- M02 Styles : L4 Monolithe vs microservices · L5 Clean architecture & hexagonale · L6 Domain-Driven Design (léger)
- M03 Pratique : L7 **Capstone** — concevoir l'architecture d'une application

**6. wasm — WebAssembly (6)** · catalogue « Front-end & web » (ou transversaux)
- M01 Comprendre : L1 Qu'est-ce que WebAssembly · L2 Du C/Rust au `.wasm` · L3 Charger & exécuter dans le navigateur
- M02 Interop : L4 JS ↔ Wasm (mémoire, fonctions) · L5 Cas d'usage & limites
- M03 Pratique : L6 **Capstone** — un module Wasm appelé depuis JavaScript

## PHASE 2 — Approfondir des cours phares (modules avancés, 2-3 leçons chacun)
- **sql** → index & plans d'exécution, transactions/ACID, fonctions de fenêtrage.
- **python** → typage (`typing`), `asyncio`, performance & profiling.
- **securite** → volet offensif (injections, XSS/CSRF en pratique), gestion des secrets.
(Ajout = nouvelles leçons dans le content du cours existant + durées + régénérer l'index.)

## PHASE 3 — Fils rouges & projets
- **Étendre le fil rouge DevOps** : ajouter `iac` en 4ᵉ étape (`js/fil-rouge-devops-data.js`, `cours.js` map, carte hub total 4).
- **Nouveau fil rouge « Sécuriser une application »** : securite → tests → http/api.
- **Couvrir les cours niche** (powershell, perl, erlang, solidity, cobol, fortran, ada, pascal, vb) : fil rouge
  « scripting & automatisation » (bash→powershell→perl) et/ou « patrimoine » (cobol→fortran→pascal).

## PHASE 4 — Gamification (petite marge)
- **Certificat de cours imprimable** : à la complétion d'un cours, une vue « certificat » (titre, date, %, score QCM)
  via `imprimer.html`. + badges thématiques (ex. « DevOps » : docker+kubernetes+cicd+cloud+iac terminés).

## Suivi (cocher au fur et à mesure)
- [x] 1. a11y ✅ (6, 859→865)   - [x] 2. perf-web ✅ (6, 865→871)   - [x] 3. cloud ✅ (7, 871→878)   - [x] 4. iac ✅ (6, 878→884)   - [x] 5. archi ✅ (7, 884→891)   - [x] 6. wasm ✅ (6, 891→897) — **PHASE 1 TERMINÉE (75 cours)**
- [x] Phase 2 ✅ — sql DÉJÀ approfondi (L12/L13/L17), python DÉJÀ couvert par cours `python-avance` (L04/L07/L11) → seul **securite** approfondi : +module M04 (L07 HTTPS/TLS & en-têtes, L08 crypto appliquée, L09 dépendances/supply chain), 6→9 leçons, search-index 897→900.
- [x] Phase 3 ✅ — (1) fil DevOps étendu à 4 étapes (+iac « Provisionner ») ; (2) nouveau fil « Sécuriser une application » (securite→api→http→tests) ; (3) fils niche « Automatiser le système » (bash→powershell→perl) + « Explorer le patrimoine logiciel » (cobol→fortran→pascal). **14 fils rouges** (était 11).
- [x] Phase 4 ✅ — (1) certificat de cours imprimable (`pages/certificat.html` + `js/certificat.js`, lié depuis progression) ; (2) badges thématiques par famille de cours terminés (DevOps/Front-end/Données & IA/Sécurité & qualité/Bas niveau/Fonctionnel) dans `js/progression.js`.

## ✅ CHANTIER TERMINÉ (toutes phases 1→4). Vérif globale OK (75 cours, 0 fichier manquant, search-index 900, 0 BOM/mojibake). Cron supprimé.

## Reprise & fin
À chaque réveil : reprendre au PREMIER cours dont `pages/<dir>/cours.html` n'existe pas (ou au 1er module/leçon manquant
d'un cours en cours), sinon avancer Phase 2, 3, puis 4. **Quand tout est fait** : vérif légère globale, régénérer
`js/search-index.js`, mettre à jour la mémoire, **supprimer le cron** (CronDelete), n'inventer aucun travail.
Messages MINIMAUX, PAS de questionnaire aux réveils. Français correct. 100 % file://.
