# Paramètres & guide de réutilisation — système « Syntaxe »

> Ce document explique **comment fonctionne** le système (contenu d'un cours + tous les réglages)
> pour le réutiliser dans un autre projet web. Tout est en **HTML/CSS/JS vanilla**, **sans framework
> ni serveur** : il suffit d'ouvrir les fichiers (`file://`). Aucune donnée n'est envoyée en ligne,
> tout est gardé dans le `localStorage` du navigateur.

---

## 0. Vue d'ensemble des fichiers

```
projet/
├─ index.html              ← accueil
├─ css/
│  ├─ variables.css        ← TOKENS (couleurs, thèmes, palettes, espacements…)  ⭐ à adapter
│  ├─ base.css             ← styles de base (typo, éléments, .prose)
│  ├─ layout.css           ← header, footer, conteneurs, grilles
│  ├─ components.css       ← boutons, cartes, theme-toggle, accent-picker, lang-toggle…
│  └─ pages.css            ← styles par page/fonctionnalité
├─ js/
│  ├─ theme.js             ← THÈME + PALETTE (à charger en 1er, bloquant)        ⭐ réglages
│  ├─ data.js              ← TOUTES les données (window.SITE_DATA)               ⭐ contenu
│  ├─ main.js              ← commun à toutes les pages (thème, langue, accent…)  ⭐ réglages
│  ├─ cours.js             ← rend la page d'un cours (programme + progression)
│  ├─ lecon.js             ← moteur d'une leçon (nav, quiz, exos, progression…)
│  └─ runner.js            ← rend le code exécutable dans les leçons
└─ pages/
   ├─ catalogue.html, progression.html, parcours.html…
   └─ <cours>/cours.html + lecon-01.html, lecon-02.html…
```

**Ordre de chargement (important).** Dans le `<head>`, on charge **`theme.js` de façon bloquante**
(pas de `defer`) pour appliquer le thème **avant** le rendu et éviter tout clignotement. Le reste
(`data.js`, `main.js`, …) est chargé en bas de page avec `defer`.

```html
<head>
  …
  <script src="../../js/theme.js"></script>   <!-- bloquant : applique data-theme + data-accent -->
  <link rel="stylesheet" href="../../css/variables.css" />
  <link rel="stylesheet" href="../../css/base.css" />
  <link rel="stylesheet" href="../../css/layout.css" />
  <link rel="stylesheet" href="../../css/components.css" />
  <link rel="stylesheet" href="../../css/pages.css" />
</head>
```

---

## 1. Gérer un cours — les DONNÉES (`js/data.js`)

Tout le catalogue vit dans **un seul objet global** exposé sans `fetch` :

```js
window.SITE_DATA = {
  LEVELS:    { debutant:"Débutant", intermediaire:"Intermédiaire", avance:"Avancé" },
  courses:   [ /* cartes du catalogue */ ],
  content:   { /* structure détaillée de chaque cours */ },
  tracks:    [ /* parcours = enchaînements de cours */ ],
  durations: { /* durée de chaque leçon en minutes */ },
};
```

### 1.1 `courses[]` — la carte du catalogue

Une entrée par cours (sert au catalogue + aux liens) :

```js
{
  id: "javascript",            // identifiant unique (clé utilisée PARTOUT, dont la progression)
  dir: "js",                   // dossier sous pages/  →  pages/js/cours.html
  title: "JavaScript : des bases au niveau confirmé",
  glyph: "JS",                 // 2-3 lettres affichées dans la pastille
  language: "JavaScript",
  level: "debutant",           // debutant | intermediaire | avance  (= classe CSS pill--debutant)
  status: "complet",           // complet | apercu | bientot
  accent: "#caa12f",           // couleur de marque du cours (glyphe + filet de carte)
  lessons: 37, hours: 26,      // affichés sur la carte
  tagline: "…",                // résumé
  tags: ["Web", "Fondamentaux"]
}
```

### 1.2 `content[id]` — la structure détaillée (modules & leçons)

Clé = `id` du cours. Sert à la page de cours et à la navigation de leçon.

```js
javascript: {
  id: "javascript", dir: "js", title: "…", glyph: "JS",
  accent: "#caa12f", overview: "cours.html",
  related: [                                   // cross-références entre cours (facultatif)
    { course: "react", note: "Passe aux composants une fois les bases acquises." }
  ],
  modules: [
    {
      num: "01", title: "Fondations du langage", sub: "Exécuter du JS, variables, types",
      lessons: [
        { num: "01", title: "Prendre en main JavaScript", file: "lecon-01.html", status: "complet" },
        { num: "02", title: "Variables, types et valeurs",  file: "lecon-02.html", status: "complet" }
      ]
    }
  ]
}
```

- `file` = nom du fichier dans `pages/<dir>/`. Mettre `"#"` pour une leçon pas encore écrite.
- `status` : `complet` | `apercu` | `bientot`.

### 1.3 `tracks[]` — les parcours (itinéraires)

```js
{ id:"web-frontend", title:"Développeur Web Front-end", glyph:"</>",
  tagline:"…", courses:["html","css","javascript","react"] }   // liste d'id de cours, dans l'ordre
```

### 1.4 `durations` — durée par leçon

```js
durations = { "js": { "lecon-01.html": 18, "lecon-06.html": 32 }, "python": { … } }  // minutes
```

> **Pour ajouter un cours** : ajouter une entrée dans `courses[]`, une dans `content`, créer le dossier
> `pages/<dir>/` avec `cours.html` + `lecon-NN.html`, et (option) une entrée dans `durations` et un
> `tracks`. Aucun autre câblage : `catalogue.js`, `cours.js` et `lecon.js` lisent tout depuis `SITE_DATA`.

---

## 2. Gérer un cours — la PAGE de cours (`pages/<dir>/cours.html`)

Squelette (les zones `data-*` sont remplies par `cours.js`) :

```html
<div class="course-hero" data-accent="javascript">
  <span class="course-hero__glyph" data-course-logo="javascript">JS</span>
  <h1 class="course-hero__title">JavaScript : des bases au niveau confirmé</h1>
  <p class="course-hero__lead">…présentation…</p>
</div>

<div class="container course-layout">
  <div>  <!-- colonne principale -->
    <section class="course-extensions"> … outils conseillés … </section>
    <section> … objectifs (.objectives) … </section>
    <section> … projet fil rouge … </section>

    <section id="programme">
      <h2>12 modules · 37 leçons</h2>
      <div data-course-modules></div>            <!-- ACCORDÉON rendu par cours.js -->
    </section>

    <section id="recap" class="course-recap">     <!-- À RETENIR + GLOSSAIRE -->
      <div class="callout callout--note"> … points clés … </div>
      <dl class="glossary">
        <dt>Variable</dt><dd>Un nom lié à une valeur…</dd>
        <dt>Closure</dt><dd>Fonction qui retient sa portée…</dd>
      </dl>
    </section>
  </div>

  <aside class="course-aside">                    <!-- carte « Commencer » -->
    <div class="start-card">
      <div class="start-card__stats" data-course-stats></div>   <!-- stats remplies par cours.js -->
      <div class="progress" data-course-progress></div>         <!-- barre de progression -->
      <a class="btn btn--primary" href="lecon-01.html">Commencer la leçon 1</a>
    </div>
  </aside>
</div>
```

Points d'accroche lus par `cours.js` : `data-course-modules` (programme), `data-course-stats`,
`data-course-progress`, `data-course-logo`. Le **glossaire** (`<dl class="glossary">`) et le bloc
**« À retenir »** sont écrits **en dur** dans la page (contenu rédactionnel).

---

## 3. Gérer une leçon — la PAGE de leçon (`pages/<dir>/lecon-NN.html`)

### 3.1 Les deux attributs indispensables

```html
<html lang="fr" data-theme="light">
…
<body data-course="javascript" data-lesson="lecon-06.html">
```

- `data-course` = `id` du cours, `data-lesson` = nom du fichier. **C'est ce couple qui relie la leçon
  à la progression** (`lecon.js` s'en sert pour cocher la bonne case).

### 3.2 Le squelette

```html
<header class="lesson-header">
  <p class="kicker">Module 02 · Logique — Leçon 06</p>
  <h1 class="lesson-header__title">Factoriser (fonctions)</h1>
  <div class="meta-row">
    <span class="duration"> … ~32 min</span>
    <span class="pill pill--debutant">Débutant</span>
    <span>Leçon 05 recommandée</span>
  </div>
  <div class="objectives"><p class="objectives__title">À la fin, tu sauras</p><ul>…</ul></div>
</header>

<details class="toc-inline" open>
  <summary>Sommaire de la leçon</summary>
  <nav class="toc"><div data-toc></div></nav>   <!-- sommaire généré depuis les <h2> -->
</details>

<article class="prose">
  … LE CONTENU (voir 3.3) …
  <button class="btn btn--primary" data-complete-toggle aria-pressed="false">
    <span>Marquer comme terminée</span>
  </button>
  <nav class="lesson-nav" data-lesson-nav></nav>   <!-- précédent / suivant auto -->
</article>
```

### 3.3 Le contenu rédactionnel (dans `.prose`)

Du HTML simple : `<h2>` (servent au sommaire), `<p>`, `<ul>/<ol>`, `<code>` en ligne, et :

```html
<!-- Bloc de code (coloré par Prism ; rendu exécutable par runner.js si le langage est supporté) -->
<figure class="code-block" data-file="exemple.js">
  <pre><code class="language-javascript">function direBonjour() {
  console.log("Bonjour");
}</code></pre>
</figure>

<!-- Encadré -->
<div class="callout callout--note"> … </div>   <!-- variantes : --note, --more -->

<!-- Bloc « Vérifie ta compréhension » (questions ouvertes en fin de leçon) -->
<div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol>…</ol></div>
```

### 3.4 Les blocs interactifs (JSON dans des `<script>`)

**QCM interactif** — placé juste après le `.lesson-check` :

```html
<script type="application/json" data-quiz>
[
  { "q":"Question ?",
    "a":["Bonne réponse","Mauvaise 1","Mauvaise 2","Mauvaise 3"],
    "correct":0,                              // index de la bonne réponse dans "a"
    "explain":"Pourquoi c'est cette réponse." }
]
</script>
```

**Exercices auto-corrigés** — après un `<h2>Exercices</h2>` :

```html
<script type="application/json" data-exos>
[
  { "type":"code",                            // "code" = exécuté (JS only) ; "text" = comparaison
    "run":{"expect":"9 12"},                  // sortie attendue (console capturée, espaces joints)
    "placeholder":"écris plusGrand, puis affiche plusGrand(3,9) et plusGrand(12,4)",
    "hints":["Indice 1","Indice 2","Indice 3"],   // débloqués progressivement, jamais la réponse
    "link":{"href":"lecon-06.html","label":"Revoir « return »"} },

  { "type":"text",                            // réponse textuelle
    "accept":["false"],                       // réponses acceptées (plusieurs variantes possibles)
    "placeholder":"true ou false",
    "hints":["…","…"], "link":{…} }
]
</script>
```

> ⚠️ Le worker n'exécute **que du JavaScript**. Pour les autres langages, utiliser `type:"text"`
> (faire prédire la sortie/valeur déterministe). Bien former `hints` en **tableau**.

**Énoncé d'exercice + solution repliée** (rédactionnel, à côté du bloc `data-exos`) :

```html
<div class="exercise">
  <div class="exercise__head"><span class="exercise__num">Exercice 1</span>
    <span class="exercise__level">Échauffement</span></div>
  <p>Écris une fonction <code>plusGrand(a, b)</code>…</p>
  <details><summary>Voir une solution</summary>
    <figure class="code-block" data-file="solution.js"><pre><code class="language-javascript">…</code></pre></figure>
  </details>
</div>
```

Autres blocs optionnels : `data-quiz-bilan` (QCM récapitulatif de fin de cours, même format que
`data-quiz`) et un **mini-projet « fil rouge »** (capstone) sur la **dernière leçon** du cours.

### 3.5 Les scripts d'une leçon (en bas de page)

```html
<script src="../../js/data.js" defer></script>
<script src="../../js/main.js" defer></script>
<script src="../../js/lecon.js" defer></script>     <!-- nav, quiz, exos, progression, notes, diapo -->
<script src="../../js/runner.js" defer></script>    <!-- rend le code exécutable -->
<!-- Prism pour la coloration : core + clike + markup + le(s) langage(s) du cours -->
<script src="…/prism-core.min.js" defer></script>
<script src="…/prism-javascript.min.js" defer></script>
```

---

## 4. PARAMÈTRES & RÉGLAGES

### 4.1 Thème clair / sombre

- Géré par **`js/theme.js`** (chargé en premier, bloquant).
- État porté par **`<html data-theme="light">`** ou `"dark"`.
- **`variables.css`** définit les couleurs : `:root { … }` (clair) puis `[data-theme="dark"] { … }`.
- Persistance : clé `localStorage` **`syntaxe-theme`**. Respecte aussi `prefers-color-scheme` au
  premier passage, et un aperçu via l'URL `?theme=dark`.
- Bouton de bascule : `<button class="theme-toggle" data-theme-toggle>` (câblé par `main.js`).
- API JS exposée :

```js
window.SyntaxeTheme.get();      // "light" | "dark"
window.SyntaxeTheme.set("dark");
window.SyntaxeTheme.toggle();
```

### 4.2 Couleur d'accent (palette)

- Aussi gérée par **`theme.js`**, via **`<html data-accent="emeraude">`** (rien = palette par défaut).
- **6 palettes** : `indigo` (défaut), `emeraude`, `ambre`, `framboise`, `cyan`, `violet`.
- Persistance : clé **`syntaxe-theme-color`**.
- Dans **`variables.css`**, chaque palette surcharge 4 variables, pour le clair ET le sombre :

```css
[data-accent="emeraude"] {                       /* mode clair */
  --accent: #0f9d58; --accent-strong: #0c7d46; --accent-weak: #dcf3e8; --btn-bg: #0f9d58;
}
[data-theme="dark"][data-accent="emeraude"] {    /* mode sombre (couleurs éclaircies) */
  --accent: #5fd2a0; --accent-strong: #8ce0bd; --accent-weak: #143026; --btn-bg: #1f9d6a;
}
```

- Le **sélecteur** (bouton palette + pastilles) est injecté dans le header par `main.js`
  (`initAccent()`, classe `.accent-picker`).
- API JS :

```js
window.SyntaxeAccent.get();              // "indigo", "emeraude", …
window.SyntaxeAccent.set("violet");
window.SyntaxeAccent.list;               // liste des palettes
```

- **Ajouter une palette** : (1) l'ajouter à `SyntaxeAccent.list` dans `theme.js` ; (2) ajouter une
  entrée `{ id, label, color }` au tableau `ACCENTS` de `main.js` ; (3) ajouter les **2 blocs CSS**
  (`[data-accent="…"]` et `[data-theme="dark"][data-accent="…"]`) dans `variables.css`.

### 4.3 Langue (i18n FR / EN)

- Gérée par **`main.js`**. Clé `localStorage` **`syntaxe-lang`** (`"fr"` par défaut, `"en"`).
- **Deux mécanismes** :
  1. **Navigation** : un dictionnaire `NAV_FR_EN` traduit automatiquement les liens connus du menu.
  2. **Contenu instrumenté** : tout élément portant **`data-i18n="clé"`** est traduit ; le FR
     d'origine est mémorisé dans `data-i18n-fr`, et la traduction EN vient du dictionnaire `I18N`.

```html
<h1 data-i18n="accueil.titre">Apprends à coder, vraiment</h1>
```

```js
// dans main.js
var I18N = { "accueil.titre": "Learn to code, for real" };
```

- Le **bouton FR/EN** (`.lang-toggle`) est injecté dans le header par `initI18n()`.
- **Ajouter une traduction** : poser `data-i18n="ma.cle"` sur l'élément + ajouter `"ma.cle": "English…"`
  dans `I18N`. (Seule l'**ossature** est traduite : la navigation et les éléments marqués ; le corps
  des leçons reste en français.)

### 4.4 Suivi de progression

- Clé `localStorage` **`syntaxe-progress`** = `{ "<courseId>": { "<lecon-NN.html>": true } }`.
- Cochée/décochée par le bouton **`data-complete-toggle`** d'une leçon (géré par `lecon.js`, qui lit
  `data-course` / `data-lesson` sur le `<body>`).
- La page **`progression.html`** (script `progression.js`) agrège tout : leçons terminées, cours
  terminés, barres de progression, objectif du jour, heatmap, badges.
- Données liées :
  - **`syntaxe-quiz`** = scores des QCM `{ course:{ file:{ quiz:{best,total}, bilan:{best,total} } } }`.
  - **`syntaxe-activity`** = journal d'activité `{ "AAAA-MM-JJ": nb }` (heatmap + séries).
  - **`syntaxe-last`** = dernière leçon visitée (bandeau « Reprendre » sur l'accueil).

---

## 5. Toutes les clés `localStorage` (préfixe `syntaxe-`)

| Clé | Contenu |
|-----|---------|
| `syntaxe-progress` | Leçons terminées par cours |
| `syntaxe-quiz` | Meilleurs scores de QCM |
| `syntaxe-activity` | Journal d'activité (heatmap, séries) |
| `syntaxe-last` | Dernière leçon visitée |
| `syntaxe-theme` | Thème clair / sombre |
| `syntaxe-theme-color` | Couleur d'accent (palette) |
| `syntaxe-lang` | Langue (fr / en) |
| `syntaxe-notes` | Notes & surlignages perso |
| `syntaxe-revision` | Révision (flashcards, Leitner) |
| `syntaxe-defis` | Défis de code résolus |
| `syntaxe-mes-qcm` | QCM personnels |
| `syntaxe-goal` | Objectif d'étude quotidien |
| `syntaxe-pomodoro` | Sessions Pomodoro |
| `syntaxe-playground` / `syntaxe-console-python` | Contenu des bacs à sable |

> Une page **« Mes données »** (`donnees-perso.html`) permet de toutes les voir (taille incluse),
> les **exporter** en JSON, les **réimporter** et les **effacer** (sélectif ou total).

---

## 6. Les variables CSS réutilisables (`variables.css`)

Tout le design passe par des **tokens** (`var(--…)`), donc changer l'identité visuelle = éditer
`variables.css` uniquement.

- **Typo** : `--font-display`, `--font-sans`, `--font-mono` ; échelle `--fs-3xs … --fs-4xl` ;
  interlignes `--lh-tight/snug/body`.
- **Espacements** (échelle 4 px) : `--sp-1 … --sp-10`.
- **Rayons** : `--r-sm/md/lg/xl/pill`.
- **Couleurs** (clair + sombre) : fonds `--bg`, `--bg-2`, `--surface`, `--surface-2`,
  `--surface-inset` ; texte `--ink`, `--ink-2`, `--ink-3` ; **accent** `--accent`, `--accent-strong`,
  `--accent-weak`, `--btn-bg` (surchargés par les palettes) ; décor `--gold*`, `--line*` ;
  sémantiques `--ok`, `--warn`, `--danger`.
- **Mise en page** : `--w-page`, `--w-prose`, `--header-h` ; **mouvement** : `--ease`, `--t-fast/t/t-slow`.

---

## 7. Réutiliser le système dans un autre projet — checklist

1. Copier **`css/`** et **`js/theme.js`** + **`js/main.js`** (ils apportent thème, palette, langue,
   sélecteurs, et n'ont pas de dépendance externe).
2. Adapter **`variables.css`** (couleurs/typo de ton projet) ; garder les noms de variables.
3. Mettre `<html data-theme="light">`, charger `theme.js` **bloquant** dans le `<head>`, puis les 5 CSS.
4. Dans le header, prévoir `<div class="header-actions">` : `main.js` y injecte les boutons thème,
   palette et langue.
5. Pour un site de cours : reprendre **`data.js`** (vider `courses`/`content` et mettre tes données),
   **`cours.js`**, **`lecon.js`**, **`runner.js`**, et le gabarit `cours.html` / `lecon-NN.html`.
6. Pour de la **progression** : il suffit que chaque page de leçon ait `data-course` + `data-lesson`
   sur le `<body>` et un bouton `data-complete-toggle`. Le reste est automatique.

> ⚠️ **Limites** : l'exécution **Python/SQL** (Pyodide, sql.js) et le **service worker** (PWA) ne
> marchent qu'en **HTTP/HTTPS** (pas en `file://`). Tout le reste fonctionne en ouverture directe.

---

*Document de référence — système Syntaxe. À copier/adapter librement dans tes autres projets web.*
