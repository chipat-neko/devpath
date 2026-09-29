# Kit de démarrage — site de cours

Un point de départ **minimal et fonctionnel** pour créer un site de cours :
HTML/CSS/JS vanilla, **sans serveur ni build** (ouvre `index.html` directement).
Reprend le système de Syntaxe (thème, palette de couleurs, langue, progression,
quiz et exercices auto-corrigés, code exécutable).

## Contenu du kit

```
starter/
├─ index.html                  ← accueil : liste les cours depuis js/data.js
├─ css/                        ← variables, base, layout, components, pages (génériques)
├─ js/
│  ├─ theme.js                 ← thème clair/sombre + palette d'accent (chargé en 1er)
│  ├─ data.js                  ← ⭐ TES DONNÉES (catalogue, modules, leçons) — à remplir
│  ├─ main.js                  ← commun (thème, langue, accent, boutons du header)
│  ├─ cours.js                 ← rend la page d'un cours (programme + progression)
│  ├─ lecon.js                 ← moteur d'une leçon (nav, quiz, exos, progression…)
│  └─ runner.js                ← rend le code exécutable dans les leçons
├─ assets/img/favicon.svg
└─ pages/
   └─ mon-cours/
      ├─ cours.html            ← gabarit de page de cours
      ├─ lecon-01.html         ← gabarit de leçon (complet : code, quiz, exos)
      └─ lecon-02.html         ← gabarit de leçon (court)
```

## Démarrer

1. Ouvre `index.html` dans un navigateur. Tu vois la carte du cours « Mon premier cours ».
2. Clique dessus pour ouvrir la page de cours, puis « Commencer la leçon 1 ».
3. Tout fonctionne déjà : thème (bouton lune/soleil), palette de couleurs et langue (boutons
   ajoutés automatiquement dans le header), sommaire, navigation, quiz, exercices, progression.

## Ajouter un cours

1. **Dans `js/data.js`** : duplique l'entrée de `courses[]` et celle de `content` (change l'`id`,
   le `dir`, le titre…). Ajoute éventuellement une entrée dans `durations`.
2. **Crée le dossier** `pages/<dir>/` et copie-y `cours.html` + des `lecon-NN.html`.
3. Dans chaque leçon, mets bien sur le `<body>` :
   `data-course="<id>"` et `data-lesson="lecon-NN.html"` — c'est ce qui relie la leçon à la
   progression.

## Ajouter une leçon

1. Ajoute la leçon dans le bon module de `content[<id>].modules[].lessons[]` (avec son `file`).
2. Duplique un `lecon-NN.html` et adapte le contenu (titre, `data-lesson`, `.prose`, quiz, exos).
   La navigation précédent/suivant et le sommaire se construisent tout seuls.

## Les blocs interactifs (dans une leçon)

- **QCM** : un `<script type="application/json" data-quiz>` contenant
  `[{ "q", "a":[…], "correct", "explain" }]`.
- **Exercices** : un `<script type="application/json" data-exos>` après un `<h2>Exercices</h2>`,
  avec des objets `{ "type":"code"|"text", "run":{"expect"}, "accept":[…], "placeholder",
  "hints":[…], "link":{…} }`. ⚠️ Seul le **JavaScript** est exécuté ; pour les autres langages,
  utilise `"type":"text"`.
- **Code exécutable** : un bloc `<figure class="code-block"><pre><code class="language-javascript">…`
  reçoit automatiquement des boutons (via `runner.js`).

## Réglages disponibles (déjà actifs)

| Réglage | Stockage | Détail |
|---------|----------|--------|
| Thème clair/sombre | `syntaxe-theme` | bouton lune/soleil ; `<html data-theme>` |
| Couleur d'accent | `syntaxe-theme-color` | 6 palettes ; bouton palette injecté |
| Langue FR/EN | `syntaxe-lang` | bouton FR/EN ; `data-i18n` sur les éléments à traduire |
| Progression | `syntaxe-progress` | bouton « Marquer comme terminée » |

## Personnaliser l'identité visuelle

Tout passe par **`css/variables.css`** (couleurs, typo, espacements). Change les valeurs des
variables (`--accent`, `--bg`, `--ink`, polices…) sans toucher au reste.

## Pour aller plus loin

Le document **`paramettre.md`** (dans `docs/reference/` du projet Syntaxe) détaille **tout** : structure des
données, format exact des blocs, mécanisme du thème/palette/langue/progression, liste des variables
CSS et des clés `localStorage`.

## Limites

L'exécution **Python/SQL** et un éventuel **service worker (PWA)** nécessitent de servir le site en
**HTTP/HTTPS** (`python -m http.server` puis `http://localhost:8000`). Le reste fonctionne en
ouverture directe des fichiers.
