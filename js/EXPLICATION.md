# js/ — tout le comportement du site

Aucun script n'est écrit dans le HTML : tout est ici. **Que des scripts classiques** (pas de
module ES, pas de build) : chaque fichier s'exécute tel quel en ouvrant une page en `file://`, et
les données sont des variables globales (`window.X = …`), jamais un `fetch`.

**Le cœur**

| Fichier | Rôle |
|---|---|
| `theme.js` | Thème clair/sombre sans clignotement (chargé en tête de page). |
| `main.js` | Commun à toutes les pages : menu, thème, barres de code, manifeste PWA, service worker. |
| `data.js` | **Les données du site** : catalogue des cours, structure des leçons, durées (`lessonDurations`). |
| `cours.js`, `lecon.js` | Page de cours, page de leçon (navigation, sommaire, QCM, exercices, progression). |
| `catalogue.js`, `parcours.js`, `progression.js`, `home.js` | Catalogue, parcours, tableau de bord, accueil. |
| `runner.js` | L'éditeur intégré : exécution JS (Worker), aperçu HTML, Python et SQL — les quatre moteurs fonctionnent en `file://`. |
| `interpreteur.js`, `execution.js`, `execution-exemples.js` | Le mini-interpréteur JavaScript qui enregistre chaque pas d'un programme, et la page « Voir un programme s'exécuter » (`pages/execution.html`) qui montre la pile d'appels pas à pas. |

**Les index générés — ne pas modifier à la main**

`search-index.js`, `search-lite.js`, `quiz-index.js`, `flashcards-data.js`, `antiseches-data.js`
sont produits par `node tools/build-index.js --write` à partir des leçons. Après un changement de
leçon ou de QCM, les régénérer ; `tools/verif-donnees.js` signale un index périmé.

**Les données des pages et des outils**

Les fichiers `*-data.js` portent le contenu d'une page (fils rouges, projets, défis, erreurs,
lexique, pièges…), et le fichier du même nom sans `-data` l'affiche. Les autres fichiers pilotent
chacun une page-outil de `pages/` (Git, regex, JSON, couleurs, diff, visualisations, examen…).

Après une modification : `node --check <fichier>` sur chaque fichier touché, puis
`node tools/verif.js --rapide`.
