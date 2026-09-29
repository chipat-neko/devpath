# PROGRESSION — Cours « JavaScript : des bases à l'intermédiaire »

Suivi de production (production itérée, une leçon à la fois). Statuts : ⬜ à faire ·
🟡 en cours · ✅ terminé.

## Cadre du cours
- **Public** : débutant qui connaît un peu HTML, sait ouvrir la console du navigateur.
- **Niveau de départ** : aucune notion de programmation requise.
- **Niveau cible** : intermédiaire **autonome** — sait écrire de la logique, manipuler
  tableaux/objets, et rendre une page interactive (DOM, événements, persistance).
- **Profondeur** : maîtrise (chaque leçon = pourquoi + comment + pièges + cas limites).
- **Projet fil rouge** : **Gestionnaire de tâches** (Todo) construit module par module,
  finalisé en leçon 12 (ajout/suppression, filtres, persistance localStorage).

## Conception à rebours — compétences finales
À la fin, l'apprenant sait : déclarer et typer des données ; écrire conditions et boucles ;
factoriser en fonctions ; structurer des données en tableaux et objets et les transformer
(map/filter/reduce) ; sélectionner et modifier le DOM ; réagir aux événements ;
gérer l'asynchrone simple et persister des données. → Il peut construire une petite app web
vanilla de bout en bout.

## Modules, leçons et statut

### Module 1 — Fondations du langage  (profondeur : pratique → maîtrise)
- ✅ **L01 — Prendre en main JavaScript** *(référence)*
  Obj : exécuter son premier JS. Couvre : où tourne JS (navigateur/Node), la console,
  `<script src>` et `defer`, `console.log`, instructions et `;`, commentaires. Piège :
  confondre HTML et JS, ouvrir le mauvais fichier. Fil rouge : afficher « Mes tâches » dans la
  console. Exercices : 3 gradués.
- ✅ **L02 — Variables, types et valeurs**
  Obj : stocker et nommer des données. Couvre : `let`/`const` (et pourquoi pas `var`), nommage,
  types primitifs (number, string, boolean, null, undefined, bigint/symbol mention), `typeof`,
  réassignation vs redéclaration, mutabilité d'un `const` objet (teaser). Pièges : `const` ≠
  immuable ; `==` vs valeurs ; NaN. Fil rouge : modéliser une tâche en variables.
- ✅ **L03 — Opérateurs et expressions**
  Obj : calculer et comparer. Couvre : arithmétiques (+ - * / % **), concat vs addition,
  template literals, comparaison `===` vs `==` (et pourquoi `===`), logiques `&& || !`,
  truthy/falsy, précédence, affectations composées. Pièges : `0.1+0.2`, coercition implicite,
  `==` surprenant. Fil rouge : composer un libellé de tâche.

### Module 2 — Logique et structures
- ✅ **L04 — Prendre des décisions (conditions)**
  Obj : exécuter du code selon une condition. Couvre : `if/else if/else`, conditions imbriquées
  vs early return (teaser), `switch`, ternaire, court-circuit `&&`/`||`, `??` (nullish).
  Pièges : `=` au lieu de `==`/`===`, oublier `break` dans `switch`, ternaires imbriqués.
  Fil rouge : afficher l'état d'une tâche (faite / à faire).
- ✅ **L05 — Répéter (boucles & itération)**
  Obj : répéter une action. Couvre : `for` classique, `while`, `do...while`, `for...of`,
  `break`/`continue`, boucles imbriquées (mesure). Pièges : boucle infinie, off-by-one,
  modifier l'index. Fil rouge : parcourir une liste de tâches et les afficher.
- ✅ **L06 — Factoriser (fonctions)**
  Obj : réutiliser de la logique. Couvre : déclaration vs expression, paramètres et arguments,
  `return`, portée (scope) et fermeture (closure light), fonctions fléchées, params par défaut
  et rest, hoisting. Pièges : oublier `return`, confondre afficher et retourner, `this` (teaser).
  Fil rouge : `ajouterTache()`, `formaterTache()`.

### Module 3 — Données structurées
- ✅ **L07 — Les tableaux (listes ordonnées)**
  Obj : stocker des collections. Couvre : littéraux, index, `length`, ajout/retrait (`push`,
  `pop`, `shift`, `unshift`, `splice`), `indexOf`/`includes`, parcours, copie vs référence,
  spread `[...]`. Pièges : index hors borne (`undefined`), mutation par référence. Fil rouge :
  tableau `taches`.
- ✅ **L08 — Transformer les tableaux (map/filter/reduce)**
  Obj : traiter des collections sans boucle manuelle. Couvre : `forEach`, `map`, `filter`,
  `find`/`findIndex`, `some`/`every`, `sort` (comparateur), `reduce`, chaînage, immuabilité.
  Pièges : oublier `return` dans le callback, `sort` qui mute, `sort` lexicographique des
  nombres. Fil rouge : filtrer les tâches faites, compter, rendre la liste.
- ✅ **L09 — Les objets (données nommées)**
  Obj : regrouper des données liées. Couvre : littéraux, accès `.`/`[]`, ajout/suppression,
  méthodes et `this` (cadré), imbrication, destructuration, spread/merge, raccourcis,
  `Object.keys/values/entries`, `JSON.stringify/parse`. Pièges : référence partagée,
  `this` perdu, JSON et types non sérialisables. Fil rouge : une tâche = objet `{id, texte, faite}`.

### Module 4 — JavaScript dans le navigateur
- ✅ **L10 — Le DOM : sélectionner et modifier**
  Obj : lire et changer la page. Couvre : arbre DOM, `querySelector(All)`, `textContent` vs
  `innerHTML` (et sécurité), `classList`, attributs/`dataset`, créer (`createElement`) et
  insérer (`append`, `prepend`), supprimer (`remove`). Pièges : script avant le DOM (defer),
  `innerHTML` et injection, NodeList ≠ Array. Fil rouge : rendre les tâches en `<li>`.
- ✅ **L11 — Réagir : les événements**
  Obj : répondre aux actions de l'utilisateur. Couvre : `addEventListener`, l'objet `event`,
  `target`/`currentTarget`, délégation d'événements, formulaires + `submit` + `preventDefault`,
  `input`/`change`/`click`/`keydown`, retrait d'écouteur. Pièges : écouteurs en double,
  rebind après re-render → délégation, oublier `preventDefault`. Fil rouge : ajouter/cocher/
  supprimer une tâche via l'UI.
- ✅ **L12 — Asynchrone & persistance (+ finalisation)**
  Obj : différer du travail, persister l'état, terminer l'app. Couvre : pile d'exécution &
  boucle d'événements (intuition), `setTimeout`, callbacks → Promesses (`.then/.catch`),
  `async/await` + `try/catch`, aperçu de `fetch` (réseau), `localStorage` (`getItem/setItem` +
  JSON). Pièges : oublier `await`, `JSON.parse` sur `null`, bloquer le thread. Fil rouge :
  persister les tâches dans `localStorage`, recharger au démarrage → **projet final livré**.

## Exercices & projet
Chaque leçon : 2–4 exercices gradués (échauffement → application → défi) avec énoncé clair et
piste de solution. Projet fil rouge récapitulé sur la page du cours et finalisé en L12.

## Cours en aperçu (1 leçon d'exemple rédigée chacun, reste « à venir »)
- ✅ Python (présentation + curriculum + L01 « Premiers pas en Python »)
- ✅ HTML (présentation + curriculum + L01 « Structurer une page en HTML »)
- ✅ CSS (présentation + curriculum + L01 « Premiers pas en CSS », avec lien annexe vers HTML)
- ✅ Git & GitHub (présentation + curriculum + L01 « Pourquoi le contrôle de version »)
- ✅ SQL (présentation + curriculum + L01 « SELECT : interroger une table »)
- ✅ React (présentation + curriculum + L01 « Premier composant & JSX »)

## Extension du cours JavaScript → niveau confirmé (modules 5 à 10)

Décidé avec l'utilisateur : porter le cours à **10 modules / 31 leçons**, projet fil rouge qui
grandit en parallèle. Production via workflow (rédacteur + relecteur).

- **Module 5 — Données du langage** : ✅ L13 chaînes · ✅ L14 nombres & Math · ✅ L15 dates
- **Module 6 — Fonctions avancées** : ✅ L16 closures · ✅ L17 this/bind · ✅ L18 ordre supérieur & récursion
- **Module 7 — POO** : ✅ L19 prototypes · ✅ L20 classes · ✅ L21 héritage & encapsulation
- **Module 8 — Asynchrone & réseau** : ✅ L22 event loop · ✅ L23 promesses avancées · ✅ L24 fetch & API
- **Module 9 — Robustesse & outillage** : ✅ L25 erreurs · ✅ L26 modules ES · ✅ L27 regex · ✅ L28 Map/Set
- **Module 10 — Aller plus loin & projet final** : ✅ L29 itérateurs/générateurs · ✅ L30 débogage/tests · ✅ L31 projet final

✅ **Extension terminée** : 19 leçons (L13→L31) produites (la reprise via `resumeFromRunId`
a re-servi L14 du cache et généré les 18 restantes après réinitialisation de la limite).
Toutes repassées en `status: "complet"` dans `js/data.js`. Cours JavaScript = **10 modules,
31 leçons, 100 % rédigé**. Liens re-vérifiés (899, hors blocs de code) : OK.

## Nouveau cours — JavaScript avancé (niveau expert)

Cours distinct (`pages/js-avance/`), relié au cours confirmé (liens annexes réciproques).
4 modules / 12 leçons, **100 % rédigé** (workflow rédacteur + relecteur, run wf_1418719b-2f1) :
- **M1 Le langage en profondeur** : ✅ Symboles · ✅ Itérateurs/générateurs avancés · ✅ Proxy & Reflect
- **M2 Asynchrone expert** : ✅ Event loop & concurrence · ✅ Annulation (AbortController) · ✅ Flux async
- **M3 Conception & qualité** : ✅ Patterns · ✅ Programmation fonctionnelle avancée · ✅ Mémoire & références faibles
- **M4 Outils du langage** : ✅ Regex avancées · ✅ Intl (i18n) · ✅ Décorateurs & synthèse

Vérifié : échappement OK (y compris regex `(?&lt;nom&gt;…)` / lookbehind), 1143 liens du site
résolvent, captures de contrôle (overview, Proxy, regex en sombre) conformes.

## Nouveau cours — Algorithmes & structures de données en JS ✅ TERMINÉ

Cours distinct (`pages/algo/`), 5 modules / **15 leçons**, 100 % rédigé (relié au cours JS confirmé
et expert). Production en deux temps à cause de la limite de session (1ʳᵉ passe : L03/L05/L08 ;
reprise via `resumeFromRunId: wf_205e96e4-2bc` après reset → les 12 restantes + relectures). Toutes
repassées en `status: "complet"` ; carte catalogue + page de cours en « Complet ».
- **M1 Penser algorithmes** : ✅ Big O · ✅ Récursion · ✅ Recherche linéaire/binaire
- **M2 Trier** : ✅ Tris élémentaires · ✅ Tri fusion · ✅ Tri rapide & tas
- **M3 Structures linéaires** : ✅ Listes chaînées · ✅ Piles & files · ✅ Tables de hachage
- **M4 Hiérarchiques & graphes** : ✅ Arbres/ABR · ✅ Tas & file de priorité · ✅ Graphes (BFS/DFS)
- **M5 Techniques** : ✅ Glouton · ✅ Programmation dynamique · ✅ Patterns d'entretien

Vérifié : échappement OK (aucun `&lt;`/`&lt;=`/`&amp;&amp;` brut sur les nombreuses comparaisons),
**1449 liens** du site résolvent, captures de contrôle (overview, graphes, prog. dynamique en sombre).

## Éditeur de code intégré ✅

`js/runner.js` (+ CSS) : bouton « ▶ Tester » ajouté automatiquement à chaque bloc
`language-javascript` EXÉCUTABLE (hors `document`/`window`/`localStorage`…) sur les 64 pages de
leçon. Le bloc devient un éditeur éditable (coloration Prism live) avec Exécuter/Réinitialiser +
console. Exécution dans un Web Worker isolé (coupe-circuit anti-boucle à 3 s), en `file://`.
Validé par capture (exécution réelle : `carre(3) → 9`, objets en JSON, erreurs en rouge).

## Nouveau cours — Projets JavaScript ✅ TERMINÉ

Cours distinct (`pages/projets-js/`), 6 projets / **12 leçons**, 100 % rédigé. Méthode : pour
chaque projet, leçon 1 = **logique pure testable dans l'éditeur**, leçon 2 = **interface** (DOM).
- **P1 Calculatrice** · **P2 Quiz** · **P3 Budget** · **P4 Générateur de mot de passe** ·
  **P5 Morpion** · **P6 Pomodoro** (chacun : logique + interface).
Vérifié : échappement OK (HTML d'exemple échappé, comparaisons `&lt;`/`&amp;&amp;`), **1774 liens**
résolvent (88 pages), exécution réelle de la logique testée dans l'éditeur sur la leçon 1.

## Aperçu HTML live (éditeur) ✅

`js/runner.js` étendu : bouton « 👁 Aperçu » sur les blocs `language-markup` → éditeur + rendu
du HTML dans une `<iframe>` sandbox (en `file://`). Refactor partagé (makeEditable) sans
régression de l'exécution JS. Validé par capture (rendu réel d'un fragment et d'un tableau généré).

## Cours HTML → complet ✅ ÉPUISÉ

Cours « HTML : structurer le web » passé d'aperçu à **5 modules / 15 leçons** :
- **M1 Fondations** : structurer (L01) · texte · liens & navigation · images & médias
- **M2 Contenu riche** : tableaux · audio/vidéo · contenu intégré (iframe, SVG)
- **M3 Formulaires** : structure & envoi · champs de saisie · validation native
- **M4 Sémantique** : balises de structure · sémantique du texte
- **M5 Accessibilité, métadonnées & qualité** : a11y/ARIA · SEO & Open Graph · validation & checklist
Production L02→L15 par workflow (rédacteur + relecteur ; 4 relectures coupées par la limite
HEBDOMADAIRE — versions rédacteur conservées, échappement vérifié OK). data.js + carte catalogue +
page de cours basculés en « Complet ». Vérifié : aucune balise d'exemple non échappée
(`&lt;form&gt;`, `&lt;input&gt;`…), 0 style/script inline, **2054 liens** résolvent (102 pages),
aperçu live testé sur du contenu généré.

## Nouveau cours — HTML avancé (le web platform moderne) ✅ TERMINÉ

Cours distinct (`pages/html-avance/`), 5 modules / **12 leçons**, 100 % rédigé (relié au cours HTML
de base). Généré en une passe par workflow (rédacteur + relecteur, **aucun échec** — la limite
hebdo s'était réinitialisée), run wf_df7264be-27d.
- **M1 Éléments interactifs natifs** : ✅ details/summary · ✅ dialog · ✅ popover & menu
- **M2 Web Components** : ✅ template/slot · ✅ custom elements · ✅ Shadow DOM
- **M3 Accessibilité experte** : ✅ patterns ARIA · ✅ régions live, focus & formulaires
- **M4 Métadonnées, données structurées & perf** : ✅ schema.org · ✅ métadonnées/PWA · ✅ attributs de performance
- **M5 Aller plus loin** : ✅ i18n & sous le capot du HTML

Vérifié : aucune balise d'exemple non échappée (`&lt;dialog&gt;`, `&lt;template&gt;`, `&lt;script&gt;`…),
0 style/script inline réel, **2315 liens** résolvent (115 pages). Les exemples interactifs (details,
popover, dialog, custom elements) se visualisent via « 👁 Aperçu » (iframe avec scripts autorisés) ;
les blocs JS dépendant du DOM n'affichent pas « Tester » (filtre correct). data.js + carte catalogue +
page de cours basculés en « Complet ».

→ **HTML désormais épuisé** : cours débutant→confirmé (15 leçons) + cours avancé→expert (12 leçons) = 27 leçons HTML.

## Cours CSS → complet ✅ ÉPUISÉ

Cours « CSS : mettre en forme le web » passé d'aperçu à **5 modules / 15 leçons** (workflow
rédacteur + relecteur, run wf_9f0d51f4-854, **aucun échec** — 14/14 leçons L02→L15 générées et
relues) :
- **M1 Fondations** : premiers pas (L01) · sélecteurs en profondeur · cascade/spécificité/héritage · couleurs & unités
- **M2 Le texte et la boîte** : modèle de boîte · typographie · arrière-plans, bordures & ombres
- **M3 La mise en page** : flux/display/position · Flexbox · Grid
- **M4 Responsive & dynamique** : media queries · transitions & animations · variables CSS & calc()
- **M5 Organisation & qualité** : méthodologies (BEM) · bonnes pratiques & synthèse
data.js + carte catalogue + page de cours basculés en « Complet ». Atout : chaque effet visuel est
un bloc `language-markup` (HTML + `&lt;style&gt;` échappé) prévisualisable via « 👁 Aperçu ».
Vérifié : 0 style/script inline réel, escaping OK (combinateur `&gt;` échappé).

## Nouveau cours — CSS avancé (le CSS moderne en profondeur) ✅ TERMINÉ

Cours distinct (`pages/css-avance/`), 4 modules / **12 leçons**, 100 % rédigé (relié au cours CSS
de base), run wf_4ab217b1-5cd.
- **M1 Maîtriser la cascade moderne** : ✅ @layer · ✅ :is()/:where()/:has()
- **M2 Couleur & mise en page avancées** : ✅ oklch/color-mix · ✅ Grid avancé & subgrid · ✅ sizing intrinsèque/aspect-ratio · ✅ container queries
- **M3 Mouvement & effets visuels** : ✅ transformations 3D · ✅ @property/scroll-driven · ✅ filtres, fusion & masques
- **M4 Architecture, accessibilité & perf** : ✅ nesting natif/@scope · ✅ propriétés logiques & préférences · ✅ performance/containment & synthèse

⚠️ **Relecture partielle** : la limite de SESSION (reset 9:30 Europe/Paris) a coupé 6 relectures
(L02, L03, L04, L07, L09, L10) — ces leçons utilisent la **version rédacteur** (déjà conforme aux
mêmes consignes strictes). Les 6 autres (L01, L05, L06, L08, L11, L12) sont relues. Reprise possible
des 6 relectures via `resumeFromRunId: wf_4ab217b1-5cd` après reset (cache → seules les 6 relues).
Vérifié quand même : 12/12 leçons assemblées, escaping OK (`@property` `syntax: "&lt;angle&gt;"`
échappé, aucune balise réelle dans `&lt;code&gt;`), rendu conforme (overview + L03 + L07 en capture),
**2856 liens** du site résolvent (seul faux positif connu : `icone.svg` dans un `&lt;h2&gt;` d'exemple).

→ **CSS désormais épuisé** : cours débutant→confirmé (15 leçons) + cours avancé→expert (12 leçons) = 27 leçons CSS.

## Cours Python → complet ✅ ÉPUISÉ (base → confirmé)

Cours « Python : des bases au niveau confirmé » (anciennement « Python pour débuter ») passé d'aperçu à
**5 modules / 15 leçons** (workflow rédacteur + relecteur, run wf_89dfeabb-b17, **aucun échec** — 14/14
leçons L02→L15 générées ET relues, la limite de session ayant été réinitialisée) :
- **M1 Fondations** : premiers pas (L01) · variables & types · opérateurs et expressions
- **M2 Logique & flux** : conditions · boucles · fonctions
- **M3 Données structurées** : listes & tuples · dictionnaires & ensembles · chaînes de caractères · compréhensions
- **M4 Programmation pratique** : modules & bibliothèque standard · fichiers & exceptions · programmation orientée objet
- **M5 Vers le confirmé** : itérateurs/générateurs & style fonctionnel · bonnes pratiques (PEP 8) & synthèse
Le titre, la carte catalogue (15 leçons), le contenu et la page de cours sont en « Complet ».
Particularité : Python ne s'exécute PAS dans le navigateur (file://) — pas de bouton « Tester » ; les
résultats sont montrés en COMMENTAIRE dans le code. Vérifié : 0 style/script inline, échappement OK
(comparaisons `&lt;`/`&gt;`, flèche d'annotation `-&gt;` — 3 flèches brutes corrigées a posteriori dans L12).

## Nouveau cours — Python avancé (maîtriser le langage en profondeur) ✅ TERMINÉ

Cours distinct (`pages/python-avance/`), 4 modules / **12 leçons**, 100 % rédigé (relié au cours Python
de base), run wf_a4805769-22b, **aucun échec** (12/12 rédigées ET relues).
- **M1 Fonctions & objets avancés** : ✅ décorateurs · ✅ modèle de données & descripteurs · ✅ générateurs/coroutines
- **M2 Typage & données structurées** : ✅ typage statique (typing & mypy) · ✅ dataclasses & Enum · ✅ gestionnaires de contexte
- **M3 Asynchrone & concurrence** : ✅ async/await & asyncio · ✅ threads, processus & GIL · ✅ programmation fonctionnelle
- **M4 Robustesse, perf & métaprog** : ✅ tests (pytest) · ✅ performance & profilage · ✅ métaprogrammation & packaging

data.js (carte + content + related croisés), accent `python-avance` (clair/sombre), overview et footer
accueil à jour. Vérifié : 0 style/script inline, échappement OK (aucune flèche `-&gt;` brute sur les
annotations omniprésentes, comparaisons `&lt;`/`&gt;`). Catalogue : 23 cartes.

→ **Python désormais épuisé** : cours débutant→confirmé (15 leçons) + cours avancé→expert (12 leçons) = 27 leçons Python.

## Cours Git & GitHub → complet ✅ ÉPUISÉ

Cours « Git & GitHub : versionner son code » passé d'aperçu à **4 modules / 14 leçons** (workflow
rédacteur + relecteur, run wf_d3c4a672-368, **aucun échec** — 13/13 leçons L02→L14 générées ET relues) :
- **M1 Démarrer avec Git** : pourquoi (L01) · premier dépôt & commits · historique & .gitignore
- **M2 Branches & corrections** : branches · fusion · conflits · annuler/corriger (reset/revert/reflog)
- **M3 Collaborer avec GitHub** : dépôts distants · GitHub (héberger/publier) · pull requests & revue · forks & open source
- **M4 Maîtrise & workflows** : rebase & historique propre · stash/tags/bisect/blame · workflows d'équipe & bonnes pratiques
Carte catalogue (14 leçons), content et page de cours basculés en « Complet ». Comme Python, Git ne
s'exécute pas dans le navigateur : commandes en blocs `language-bash`, sorties en COMMENTAIRE/bloc « Terminal ».
Vérifié : 0 style/script inline, échappement OK (marqueurs de conflit `&lt;&lt;&lt;&lt;&lt;&lt;&lt;` échappés,
chaînage `&amp;&amp;`, placeholders `&lt;branche&gt;`, redirections `&gt;`).

## Journal
- 2026-06-08 : cadrage, design system, curriculum figés. Démarrage du socle (CSS/JS) + L01.
- 2026-06-08 : socle complet (5 CSS, 6 JS, assets). Accueil + leçon de référence validés par
  capture (clair/sombre/mobile). Catalogue + page de cours JavaScript.
- 2026-06-08 : leçons JS 02→12 rédigées (rédacteur + relecteur, gabarit fixe) — vérifiées
  (échappement du code, structure, thèmes, responsive). Cours complet livré.
- 2026-06-08 : 5 cours en aperçu (page + leçon d'exemple) générés et vérifiés.
- 2026-06-08 : passe finale — 505 liens locaux OK, base accessibilité OK sur 25 pages,
  QA visuelle (accueil, catalogue, cours, leçons JS et aperçus) en clair/sombre/mobile.
  **Site terminé.**
- 2026-06-08 : réorganisation — `pages/` éclaté en un sous-dossier par cours
  (`pages/<dir>/cours.html` + `lecon-NN.html`). Scission HTML / CSS en deux cours distincts
  (nouveau cours CSS + sa leçon « Premiers pas en CSS »). Ajout des **liens annexes**
  (`related` dans data.js → section « Cours liés » via cours.js + lien CSS→HTML dans la leçon).
  Liens re-vérifiés (538, hors blocs de code) : OK. Convention enregistrée en mémoire projet.
- 2026-06-09 : **CSS épuisé**. Cours CSS de base porté à 15 leçons (workflow sans échec) +
  nouveau cours **CSS avancé** (12 leçons ; 6 relectures coupées par la limite de session →
  versions rédacteur conservées, reprise possible après reset). data.js (2 cartes + content +
  related croisés), accent `css-avance` (clair/sombre), overviews et footer accueil à jour.
  Catalogue : 22 cartes. **2856 liens** vérifiés (1 faux positif connu). Captures de contrôle OK.
- 2026-06-09 : reprise des **6 relectures CSS avancé** après réinitialisation de la limite
  (`resumeFromRunId` → cache instantané + 6 relectures) : les 12 leçons sont désormais toutes relues.
- 2026-06-09 : **Python (base) épuisé**. Cours porté d'aperçu à 5 modules / 15 leçons (workflow sans
  échec), renommé « Python : des bases au niveau confirmé », basculé en « Complet » (carte + content + page).
  Préférence utilisateur enregistrée : **communiquer en français** ; **questionnaire après chaque tâche**.
- 2026-06-09 : **nouveau cours Python avancé** (4 modules / 12 leçons, workflow sans échec) : décorateurs,
  data model, typage, dataclasses, contextes, asyncio, GIL, fonctionnel, tests, perf, métaprogrammation.
  data.js + accent + overview + footer à jour. **Python épuisé** (base + avancé = 27 leçons). Catalogue : 23 cartes.
- 2026-06-09 : **Git & GitHub épuisé**. Cours porté d'aperçu à 4 modules / 14 leçons (workflow sans échec),
  basculé en « Complet » (carte + content + page). 11 cours complets, 2 en aperçu (SQL, React).
- 2026-06-10 : **SQL épuisé**. Cours porté d'aperçu à 5 modules / 14 leçons. Le workflow a été coupé par la
  limite de session (8 rédactions + 5 relectures échouées → 5 leçons sauvées) puis **repris via `resumeFromRunId`
  wf_9a415915-4c1** (la limite s'étant levée) → 13/13 leçons générées ET relues. Résultats de requêtes affichés
  en VRAIS tableaux HTML (`.prose table`). Basculé en « Complet ». **12 cours complets, 1 en aperçu (React)**.
- 2026-06-10 : **React épuisé** (dernier aperçu). Cours porté à 4 modules / 14 leçons (workflow sans échec,
  run wf_fc5e135d-258) : JSX, props, listes/clés, conditionnel, useState, événements, formulaires, useEffect,
  fetch, lever l'état, useRef/useContext, useReducer & hooks personnalisés, organisation d'app. React moderne
  (composants fonction + hooks). Code en blocs `language-jsx` (pas d'exécution : React exige un build). Échappement
  JSX vérifié (chevrons des balises, fragments `&lt;&gt;`, flèches `=&gt;`, `&amp;&amp;`). Basculé en « Complet ».
  → **PLUS AUCUN cours en aperçu** : 13 cours complets sur 23 cartes (les 10 autres sont « bientôt », sans page).
- 2026-06-10 : **nouveau cours Node.js** (créé de zéro, 5 modules / 14 leçons, workflow sans échec, run
  wf_ed13a90e-66d) : runtime, modules CJS/ESM, npm, event loop, promesses, EventEmitter, streams, fs,
  process, serveur HTTP, API REST Express, middleware/erreurs, tests (node:test), sécurité & déploiement.
  Carte « bientôt » → « Complet », content + overview + footer créés. `runner.js` : filtre BROWSER_ONLY
  affiné (marqueurs Node spécifiques require(/process/module.exports/node:… au lieu de mots communs) →
  pas de « Tester » sur le code Node, régression nulle sur les cours JS. **14 cours complets** ; 9 cartes « bientôt ».

## Passe d'exhaustivité — combler les lacunes des cours existants

Audit des 14 cours réalisé (gaps réels listés). Décision utilisateur : passe **cours par cours, dans l'ordre**,
en ajoutant les leçons manquantes (qualité + quantité, sans rien négliger). Méthode : nouveau module « compléments »
APPENDU (pas d'insertion mid-cours → aucun renumérotage de fichiers).
- 2026-06-10 : **JavaScript** porté de 31 à **34 leçons** (nouveau Module 11 « Compléments : le navigateur en
  pratique » : stockage côté navigateur (sessionStorage/cookies/IndexedDB), formulaires & FormData, planification/
  animation (requestAnimationFrame, debounce/throttle)). Workflow wf_e51b8ded-6d1 sans échec. data.js + carte (34 leçons)
  + page de cours + docs à jour.

À partir d'ici, l'utilisateur a demandé d'**enchaîner en autonomie** (sans redemander à chaque cours), avec un
**bilan global** à la fin. Chaque cours reçoit un module « compléments » appendu (rédacteur + relecteur).

- 2026-06-10/11 : **JavaScript avancé** 12 → **15 leçons** (Module 5 « La plateforme bas niveau & les flux » :
  binaire & ArrayBuffer/TypedArray/DataView, Worker threads & messagerie, mesure des performances). 5 modules.
- **Algorithmes** 15 → **20 leçons** (Module 6 « Graphes avancés & techniques » : Dijkstra/plus courts chemins,
  union-find & MST, backtracking, bit manipulation, complément d'entretien). 6 modules.
- **Projets JavaScript** 6 → **8 projets / 12 → 16 leçons** (P7 Application météo avec API `fetch`, P8 Jeu du
  serpent sur `<canvas>` — chacun logique testable + interface). 27 flèches `=&gt;` brutes corrigées dans une leçon.
- **Python** 15 → **17 leçons** (Module 6 « Compléments essentiels »). 6 modules.
- **Python avancé** 12 → **14 leçons** (Module 5 « Au-delà de Python pur »). 5 modules.
- **HTML** 15 → **17 leçons** (Module 6 « Compléments : images & graphiques » : `<canvas>`, SVG). 6 modules.
- **HTML avancé** 12 → **14 leçons** (Module 6 « Interactions & sécurité »). 6 modules.
- **CSS** 15 → **17 leçons** (Module 6 « Compléments : colonnes & impression »). 6 modules.
- **CSS avancé** 12 → **14 leçons** (Module 5 « À la pointe du CSS »). 5 modules.
- **Git & GitHub** 14 → **16 leçons** (Module 5 « Git en profondeur » : objets internes, submodules, worktrees, hooks). 5 modules.
- **SQL** 14 → **16 leçons** (Module 6 « Logique stockée & données modernes » : procédures/triggers, CTE récursives,
  JSON, recherche plein-texte — résultats en vrais tableaux HTML). 6 modules.
- 2026-06-11 : **React** 14 → **17 leçons** (Module 5 « Aller plus loin : routage, perf, robustesse » : React Router,
  mémoïsation/`lazy`/hooks 18, error boundaries/portals/tests). Workflow wf_88a269a8-4d9 sans échec. 5 modules.
- 2026-06-11 : **Node.js** 14 → **17 leçons** (Module 6 « Données, authentification & temps réel » : connexion BDD
  (`pg`/pool/requêtes paramétrées), auth `bcrypt`+JWT+middleware, WebSockets/`ws`/broadcast). Workflow wf_ead46d67-979 :
  1 relecture (L15) coupée par la limite de session → version rédacteur conservée (2 flèches `=&gt;` corrigées a posteriori). 6 modules.

### Bilan de la passe d'exhaustivité ✅
- **14 cours complets, 244 leçons** (vs 207 avant la passe ; +37 leçons réparties sur les 14 cours).
- Totaux par cours : JS 34 · JS av. 15 · Algo 20 · Projets 16 · Python 17 · Python av. 14 · HTML 17 · HTML av. 14 ·
  CSS 17 · CSS av. 14 · Git 16 · SQL 16 · React 17 · Node.js 17.
- data.js (cartes catalogue + content) et chaque page `cours.html` (compteurs modules/leçons + description) à jour.
- README.md (intro, arbre, tableau) et PROGRESSION.md synchronisés.
- **Vérification finale des liens** : sur **260 pages HTML**, **5214 liens réels** (vraies balises, hors exemples de
  code échappés) → **0 lien cassé**. Échappement vérifié sur les 6 nouvelles leçons React/Node (0 `<style>`/`<script>`
  réel, 0 `=&gt;`/`&amp;&amp;` brut après corrections).

## Création des 9 derniers cours (« à venir » → complets)

Décision utilisateur : après la passe d'exhaustivité, **créer en autonomie les 9 cours restants** du catalogue, en
cours complets, **même approche** (workflow rédacteur + relecteur, page `cours.html`, câblage data.js, échappement
vérifié, check liens). Mutualisation : un **workflow générique** `tools/wf-course.js` paramétré par `args` (config +
specs en JSON), réutilisé pour les 8 derniers cours (gabarit `buildLesson` + INSTRUCTIONS partagés, plus de comptage
de backticks). TypeScript a son propre `tools/wf-typescript.js` (premier du lot).

- 2026-06-11 : **TypeScript** créé — 3 modules / **10 leçons** (types, interfaces, unions & narrowing, fonctions,
  génériques, types utilitaires, classes, modules, migration JS→TS). Prism `typescript`. 1 flèche `=&gt;` corrigée.
- **Bash** — 2 modules / **8 leçons** (terminal, navigation, fichiers, filtres/pipes, variables/quoting, scripts,
  conditions/boucles, fonctions/cron). Prism `bash`. Tous opérateurs (`2>&1`, `<<`, `&&`) échappés.
- **Java** — 4 modules / **14 leçons** (JVM, POO, interfaces, enum/record, exceptions, génériques, collections,
  lambdas/streams, fichiers/dates, projet). Prism `java`.
- **C** — 3 modules / **12 leçons** (compilation, pointeurs, allocation dynamique, structures, fichiers,
  préprocesseur/Makefile, débogage/sûreté mémoire). Prism `c`. `#include <…>` et flèches échappés.
- **C++** — 4 modules / **14 leçons** (du C au C++, RAII, héritage, surcharge d'opérateurs, copie/déplacement,
  templates, STL, pointeurs intelligents). Prism `cpp`. Templates `&lt;T&gt;` et flux `&lt;&lt;` échappés.
- **C#** — 4 modules / **13 leçons** (.NET, POO & propriétés, interfaces/structs, enum/record, exceptions,
  génériques/collections, LINQ, async/await). Prism `csharp`.
- **Go** — 3 modules / **10 leçons** (gofmt, slices/maps, structures/méthodes, interfaces, erreurs, goroutines &
  channels, modules, tests, serveur HTTP). Prism `go`. Channels `&lt;-` échappés.
- **Rust** — 4 modules / **13 leçons** (Cargo, possession, emprunts, durées de vie, traits/génériques, erreurs,
  itérateurs/closures, modules, concurrence sans peur). Prism `rust`.
- 2026-06-11 : **PHP** (dernier) — 3 modules / **11 leçons** (balises, types, formulaires GET/POST, sessions/cookies,
  **sécurité web** : injection SQL/XSS/CSRF/hachage, POO, namespaces, PDO, Composer). Prism `php` (+ markup-templating).
  Workflow d'abord coupé net par la limite de session (11 rédacteurs échoués) → **relancé après reset (21h10)** : 11/11.
  Balises `&lt;?php`/`?&gt;` et flèches `=&gt;`/`-&gt;` toutes échappées.

> Pas de travail CSS : les accents `[data-accent]` des 9 cours étaient déjà définis dans `css/pages.css` (clair + sombre).
> `runner.js` n'ajoute aucun bouton « Tester »/« Aperçu » sur ces langages (aucun `language-javascript`/`language-markup`).

### Bilan final — catalogue 100 % rédigé ✅
- **23 cours complets, 349 leçons** (244 des 14 cours précédents + **105** des 9 nouveaux : TS 10, Bash 8, Java 14,
  C 12, C++ 14, C# 13, Go 10, Rust 13, PHP 11). **Plus aucun cours « à venir ».**
- Pour chaque nouveau cours : carte catalogue basculée en « Complet » (+ tagline), bloc `content` (modules/leçons +
  `related` croisés) et page `cours.html` créés ; statuts des leçons passés en `complet`.
- **Intégrité data.js → disque** : **349 leçons « complet », 349 fichiers présents, 0 manquant**, 0 lien `#` résiduel.
- **Vérification finale des liens** : **374 pages HTML**, **7494 liens réels** (vraies balises, hors exemples de code
  échappés) → **0 lien cassé**.
- Échappement vérifié sur les 105 nouvelles leçons (0 `<style>`/`<script>` réel ; `#include`, `<?php ?>`, génériques
  `&lt;T&gt;`, channels `&lt;-`, flèches `=&gt;`/`-&gt;`/`->` et `&amp;&amp;` correctement échappés ; rares résidus en
  commentaires corrigés a posteriori).
- Docs synchronisées : `index.html` (cours phare 11 modules / 34 leçons), `README.md` (intro 23 cours / 349 leçons,
  arbre, tableau), `PROGRESSION.md`.

## QA visuelle et améliorations (accueil / catalogue)

- 2026-06-11/12 : **QA visuelle** par captures headless (`tools/shot.ps1`, `?theme=dark`) — accueil, catalogue et
  plusieurs nouvelles leçons en clair/sombre/mobile.
- 🐞 **Bug critique mojibake trouvé et corrigé** : les 111 leçons générées via PowerShell (9 nouveaux cours +
  compléments React/Node) étaient en **double-encodage UTF-8** (« génériques » → « gÃ©nÃ©riques ») car
  `Get-Content -Raw` (PS 5.1) lit en ANSI. Corrigé en **relisant les `.output` avec `ReadAllText(..., UTF8)`** et en
  réécrivant les 111 fichiers (0 mojibake après coup, rendu confirmé par captures). **Leçon retenue** : toujours lire
  les sorties workflow en UTF-8 explicite et vérifier le RENDU, pas seulement l'échappement ASCII.
- **Accueil/catalogue mis à jour** : intro catalogue (23 cours / 349 puis 418 leçons), hero d'accueil + stats, cartes
  mises en avant (plus aucun « Aperçu », carte Rust ajoutée), meta descriptions ; notes « leçon d'exemple » obsolètes
  corrigées dans HTML/React.

## Approfondissement des 23 cours (un module « en profondeur / production » par cours)

Choix utilisateur : **approfondir les 23 cours** en ajoutant à chacun un module final (3 leçons avancées), appendu
(pas de renumérotage). Mutualisé via le workflow générique `tools/wf-course.js`. **+69 leçons** (3 × 23).

- **9 nouveaux cours** : TS « en profondeur » (types conditionnels/mappés, patterns, décorateurs/outillage) · Bash
  « aller plus loin » (sed/awk, processus & signaux, scripts de production) · Java (concurrence, sealed/pattern
  matching, JVM/perf) · C (pointeurs de fonction, structures dynamiques, bits & système) · C++ (concurrence,
  métaprogrammation, performance) · C# (async avancé, langage avancé, perf/écosystème) · Go (concurrence/context,
  génériques/runtime, services) · Rust (smart pointers, traits avancés, async/unsafe) · PHP (API REST, POO avancée,
  perf/tests).
- **14 cours d'origine** : JS « pratique pro » (composants, API/état, outils) · JS avancé « aux frontières » (V8,
  sécurité client, runtimes/WASM) · Algo « sujets avancés » (chaînes/KMP, complexité/NP, randomisé) · Projets « bonus »
  (Canvas, Web Audio, Kanban) · Python « en pratique » (venv, CLI/logging, qualité/packaging) · Python avancé « à
  l'échelle » (patterns, no-GIL, production) · HTML « appliqué » (formulaires, médias accessibles, emails) · HTML avancé
  « plateforme web » (Observers, View Transitions, Service Workers) · CSS « vraie vie » (composants, layouts, qualité) ·
  CSS avancé « encore plus loin » (fonctions math, transitions d'état, échelle) · Git « collaboration & automatisation »
  (branches, CI/CD, gros dépôts) · SQL « en production » (plans d'exécution, modélisation, analytique) · React « en
  production » (état à l'échelle, données React 19, frameworks/RSC) · Node « à l'échelle » (architecture, performance,
  observabilité/déploiement).
- Un seul échec de relecture (PHP, limite de session) → version rédacteur conservée, escaping vérifié.

### Bilan final — catalogue approfondi ✅
- **23 cours, 418 leçons** (349 + 69). Totaux : JS 37 · JS av. 18 · Algo 23 · Projets 19 · Python 20 · Python av. 17 ·
  HTML 20 · HTML av. 17 · CSS 20 · CSS av. 17 · Git 19 · SQL 19 · React 20 · Node 20 · TS 13 · Bash 11 · Java 17 · C 15 ·
  C++ 17 · C# 16 · Go 13 · Rust 16 · PHP 14.
- **Intégrité data.js → disque** : **418 leçons « complet », 0 manquant**, 0 lien `#` résiduel.
- **Vérification finale des liens** : **443 pages HTML**, **8875 liens réels** → **0 lien cassé**.
- **Encodage** : 0 mojibake (hors le faux positif `html/lecon-15.html`, leçon sur l'encodage qui montre « Ã© » en
  exemple). Échappement vérifié cours par cours (génériques, `<?php ?>`, channels, flèches, redirections shell).
- Docs synchronisées : `index.html` (418 leçons, cours phare 12 modules/37 leçons), `README.md` (intro/arbre/tableau à
  jour), `catalogue.html`, `PROGRESSION.md`.
