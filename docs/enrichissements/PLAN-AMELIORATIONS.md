# Plan d'amélioration du site Syntaxe

> **Version 2 — établie le 2026-06-14** à partir d'un audit complet par **5 agents** (une dimension chacun :
> contenu pédagogique · intégrité technique HTML/CSS/JS · cohérence des données · accessibilité/SEO/UX · interactivité JS).
> Cet audit **remplace** le plan v1 (2026-06-13), dont les chantiers 0/A/B/C sont aujourd'hui réalisés.
> Priorités : **P1** à faire en premier · **P2** utile · **P3** confort/dette. Effort : **S** (court) · **M** (moyen) · **L** (long).

---

## État des lieux

Le site est à **63 cours / 818 leçons / 57 langages**. Les 5 agents convergent sur un même diagnostic : **le socle est excellent**, et les améliorations à mener sont surtout de la **finition** et un **chantier de contenu** dominant (les quiz).

**Points forts confirmés (à préserver) :**
- **Exactitude technique remarquable** : aucune erreur factuelle relevée, hors deux cas d'échappement (voir 1.B).
- **Intégrité parfaite** : 63 cartes `courses[]` ↔ 63 entrées `content`, les 818 fichiers `lecon-*.html` référencés existent tous, les `data-course`/`data-lesson` sont alignés (le calcul de la navigation Précédent/Suivant ne tombe jamais sur `-1`), les 8 parcours et tous les liens `related` se résolvent. **Aucun lien cassé ni orphelin.**
- **Compatibilité `file://` exemplaire** : 100 % vanilla, aucun `fetch`, aucun module ES ; le runner exécute le code dans un **Web Worker** (coupe-circuit 3 s) et l'aperçu HTML dans une **iframe `sandbox` `srcdoc`**. Tout fonctionne hors serveur.
- **Socle a11y/SEO solide** : un seul `h1` par page sans saut de niveau, `lang="fr"` + `viewport` + `meta description` + favicon partout, **885 titres et 818+ descriptions tous uniques**, `skip-link`, `focus-visible`, thème clair/sombre **sans clignotement** (theme.js applique le thème avant le 1er rendu), aucune image bitmap (donc zéro dette d'`alt`), responsive complet.
- **Les 100 quiz existants (300 questions)** sont tous des JSON valides, avec l'index `correct` toujours dans les bornes et figé **avant** le mélange des options.

---

## Diagnostic dominant (les 5 agents convergent)

> **Le quiz interactif auto-corrigé n'est présent que sur 100 des 818 leçons (12 %).**

Le gabarit de leçon prévoit un bloc `<script type="application/json" data-quiz>`, et le **moteur de rendu (`lecon.js` `initQuiz`) est déjà universel et fiable**. Mais il n'est alimenté que sur ~13 cours récents (tous à 6/6 : vue, api, markdown, securite, cicd, tests, regex, nosql, vscode, formats, patterns, docker…). **38 cours sur 63 ont zéro quiz interactif**, dont **tout le curriculum d'entrée le plus consulté** : JavaScript (37 leçons), JS avancé, Python (+ avancé), HTML (+ avancé), CSS (+ avancé), SQL, Java, C, C++, Rust, Go, algo, projets-js… Sur ces 718 leçons, le bloc « Vérifie ta compréhension » n'est qu'une **liste statique de questions ouvertes**, non corrigée.

C'est donc **la fonctionnalité phare du site, passive sur 88 % des leçons**. La combler **ne demande aucun changement de code JS** : c'est un chantier de **contenu/données** (ajouter un bloc `data-quiz` de 3 questions par leçon, au format déjà éprouvé). → **Chantier 1.A, P1.**

---

## Chantier 1 — Corrections & contenu prioritaire (P1)

### 1.A — Généraliser le quiz interactif au curriculum fondamental — **L**
- **Quoi** : ajouter un bloc `data-quiz` (3 questions QCM, format existant `[{q,a[],correct,explain}]`) aux leçons qui n'en ont pas, en **commençant par les cours phares** : JavaScript, Python, HTML, CSS, SQL, puis Java, C, C++, Rust, Go.
- **Base de départ** : réutiliser les questions ouvertes déjà présentes dans le bloc `lesson-check` de chaque leçon.
- **Pièges connus** (rappel campagne) : doubler les `\` dans les regex JSON (`\\d`), ne jamais mettre de `"` brut dans une valeur de chaîne (reformuler), valider chaque bloc par `ConvertFrom-Json`.
- **Pas de modif JS** : le moteur est déjà en place.

### 1.B — Corriger le code sur-échappé — **S**
- **Haskell `lecon-04.html`** : lambdas avec **double `\`** au lieu d'un seul (lignes ~136, 140, 159, 257, 269, 275, 282) et chaînes à guillemets échappés → du Haskell **faux, non compilable**, affiché à l'écran (la prose ligne 140 montre elle-même le double `\`).
- **HTML `lecon-17.html`** ligne ~109 : `getContext` inline mal échappé.
- **Action** : revenir à la forme simple, vérifier le rendu Prism. Ajouter un **garde-fou anti-régression** (voir 2.D).

### 1.C — Échapper les `<` qui masquent du texte — **S**
- **~12 blocs `<code>`** contiennent un `<` non échappé qui **masque le texte affiché** : `securite/lecon-04`, `securite/lecon-02`, `nosql/lecon-04`, `markdown`, `clojure/lecon-11`, `js-avance/lecon-10`.
- **Action** : remplacer par `&lt;` (et vérifier `&gt;`/`&amp;` au passage).

### 1.D — Corriger le contraste du texte « gold » en thème clair — **S**
- La variable `--gold` (`#a9740f`) donne **3,45:1** sur `gold-weak` en thème **clair**, sous le seuil **AA 4,5:1**. Touche la **pastille « Intermédiaire »**, les **numéros d'exercice** et les **titres de callout « Pour aller plus loin »** — éléments présents dans **chaque leçon**.
- **Emplacements** : `css/variables.css:80` (définition) ; usages `css/components.css:190, 966, 1341` et `css/pages.css:894, 1114`.
- **Action** : assombrir `--gold` en thème clair (ex. `#7e5408`) jusqu'à ≥ 4,5:1, **sans toucher au thème sombre** (déjà conforme à 7,81:1). Conserver `--gold-line` (filets décoratifs, hors contrainte). Revérifier les 6 emplacements.

### 1.E — Ajouter Open Graph / Twitter Card — **M**
- **0 balise** `og:*` ni `twitter:*` sur les 885 pages : un partage sur les réseaux ne génère **aucun aperçu** (titre/description/vignette). C'est le plus gros manque SEO/social, alors que titres et descriptions sont déjà tous uniques.
- **Action** : ajouter dans le `<head>` de chaque gabarit un bloc OG statique (`og:type`, `og:site_name`, `og:locale fr_FR`, `og:title`/`og:description` repris du title/description de la page, `og:image` vers un visuel **local** `assets/img/` en **chemins relatifs**) + `twitter:card summary`. **Industrialiser** via le script PowerShell déjà utilisé pour les sections « extensions VS Code ».
- **Nuance** : impact réel surtout **si le site est servi en http** ; en pur `file://`, c'est du bonus peu visible. Cheap et pérenne → à faire, mais déprioriser sous 1.A–1.D si le temps manque.

---

## Chantier 2 — Accessibilité, coloration & robustesse (P2)

### 2.A — Rendre le quiz accessible (lecteurs d'écran & daltoniens) — **M**
- Le retour **correct/incorrect repose sur la couleur seule** (classes `is-correct`/`is-wrong`) → **échec WCAG 1.4.1** ; de plus l'explication révélée n'est pas annoncée.
- **Emplacements** : `js/lecon.js:399, 404-427`.
- **Action (JS uniquement)** : au clic, injecter un libellé `sr-only` (« Bonne réponse »/« Mauvaise réponse ») ou un préfixe visible coche/croix + texte ; placer `quiz__explain` dans une région `aria-live="polite"` (ou y déplacer le focus) ; poser un `aria-disabled` cohérent sur les options verrouillées.

### 2.B — Durcir l'accessibilité clavier du menu mobile et des bascules — **S**
- **Menu mobile** (`js/main.js:35-55`, `css/layout.css:149-170`) : pas de fermeture à **Échap** ; à l'état fermé, `primary-nav` reste dans le DOM **sans `hidden`/`inert`** → ses liens restent atteignables au **Tab** (cibles de focus fantômes). Ajouter un `keydown` global (Échap referme, focus rendu au `nav-toggle`) et `hidden`/`inert` sous le breakpoint mobile.
- **Bascule de thème** : pas d'`aria-pressed`, et l'`aria-label` n'est **pas resynchronisé au chargement** en mode sombre (`js/main.js:22-32`) → un visiteur arrivant en sombre entend « Activer le thème sombre » alors que le clic activera le clair. Initialiser l'`aria-label` selon le thème courant + ajouter `aria-pressed`.
- **`coursenav-toggle`** : a `aria-expanded` mais pas d'`aria-controls` vers `coursenav-panel` → donner un `id` au panneau et le référencer.

### 2.C — Compléter les composants Prism par langage secondaire — **M**
- **~110 leçons** insèrent un bloc secondaire `language-bash` (commande npm/git/install) **sans charger `prism-bash`** → code affiché en **texte brut non coloré** (ex. confirmé : `pages/js/lecon-37.html`, 3 blocs bash). Autres langages secondaires concernés (marginaux) : `json`, `yaml`, `toml`, `makefile`, `cmake`, `twig`, `html` (dans un cours React). Total ~126 blocs.
- **Action** : pour chaque leçon, ajouter le `<script src=".../prism-<lang>.min.js" defer>` correspondant à **chaque** langage réellement utilisé dans un `<pre><code>` (pas seulement le langage principal), en respectant l'ordre de dépendances Prism (`clike` avant ses héritiers). **Scriptable** (lister langages en `pre/code` vs composants chargés).

### 2.D — Script de vérification d'intégrité (anti-régression) — **M**
- **Quoi** : un script PowerShell réutilisable qui contrôle, sur l'ensemble du site : échappement `< > &` dans les `<code>`, présence du composant Prism pour chaque `language-*` utilisé, validité JSON de chaque `data-quiz`, équilibre `{}`/`[]` de `data.js`, correspondance compteurs ↔ fichiers réels, absence de `style=""`/`<script>` inline, absence de mojibake.
- **Pourquoi** : empêche la réapparition des défauts 1.B/1.C/2.C sur 880+ pages ; à lancer après chaque chantier.

---

## Chantier 3 — Nettoyage & dette (P3)

### 3.A — Petites cohérences (groupées) — **S**
- **Règle CSS morte** : `[data-accent="html-css"]` (`css/pages.css` ~655 et ~722) — vestige sans cours associé → **supprimer**.
- **Totaux obsolètes** dans la doc : `README` (et anciens fichiers) affichent encore `51 / 714 / 45` → mettre à `63 / 818 / 57`.
- **Fil d'Ariane js** : 31 leçons `pages/js/lecon-*.html` utilisent un chemin indirect au lieu de `cours.html` → harmoniser.
- **ES5 strict** : `js/lecon.js:240` contient l'unique `?.` du codebase (branche morte : toutes les leçons ont un `<h2>`) → remplacer par une garde explicite pour rester homogène.
- **Code défensif dormant** : les branches `bientot`/`apercu`/fichier `#` ne sont jamais exécutées (tous les statuts valent `complet`) → soit **documenter** qu'elles sont dormantes (utiles si des cours « à venir » reviennent), soit retirer le **badge de statut redondant** du catalogue.

### 3.B — SEO technique avancé (si hébergement http) — **L**
- `link rel="canonical"` par page, **JSON-LD** (`Course` sur les `cours.html` depuis `data.js`, `Article` + `BreadcrumbList` sur les leçons — le fil d'Ariane HTML existe déjà), `sitemap.xml` + `robots.txt`.
- **Génération statique** (script PowerShell). **Peu pertinent en pur `file://`** ; à ne lancer que si le site passe en ligne.

### 3.C — Repli thème sombre sans JavaScript — **S** (cosmétique)
- Chaque page déclare `data-theme="light"` ; sans JS, un visiteur en `prefers-color-scheme: dark` verra le thème clair. Dégradation gracieuse acceptable. Pour couvrir le cas, ajouter un bloc `@media (prefers-color-scheme: dark)` dupliquant les tokens sombres (au prix d'une duplication des variables). Faible priorité.

---

## Ordre d'exécution recommandé

1. **1.B + 1.C + 1.D** (corrections rapides, fort rapport qualité/effort, ~½ journée).
2. **2.D** (script d'intégrité) — pour verrouiller les corrections et outiller la suite.
3. **1.A** (quiz sur les cours phares) — le gros morceau, par lots de cours (JS → Python → HTML/CSS → SQL → compilés).
4. **2.A + 2.B + 2.C** (accessibilité du quiz, clavier, Prism) — idéalement en même temps que 1.A puisqu'on touche déjà aux leçons.
5. **1.E** (Open Graph) si le site doit être partagé/hébergé.
6. **Chantier 3** au fil de l'eau.

---

## Annexe — Constats par dimension (résumé)

| Dimension | État | Constats majeurs |
|---|---|---|
| **Contenu pédagogique** | Très bon | Quiz absent de 718/818 leçons ; code sur-échappé (Haskell l04, HTML l17). |
| **Intégrité technique** | Excellente | `<` non échappés (12 cas) ; Prism manquant (~126 blocs) ; fil d'Ariane js (cosmétique). |
| **Cohérence des données** | Parfaite | Compteurs exacts partout ; règle CSS `html-css` morte ; totaux doc obsolètes. |
| **A11y / SEO / UX** | Solide | 0 Open Graph ; contraste `gold` clair < AA ; quiz couleur-seule ; clavier menu mobile ; canonical/JSON-LD absents. |
| **Interactivité JS** | Solide | Aucun plantage ; quiz limité à 12 % des leçons ; Prism bash secondaire ; `aria-label` thème non resync ; 1 `?.` hors ES5. |

*Détails complets (emplacements `fichier:ligne`, sévérités, recommandations) dans le résultat d'audit du workflow `audit-site-syntaxe` (run `wf_23c85f6c-d3e`).*
