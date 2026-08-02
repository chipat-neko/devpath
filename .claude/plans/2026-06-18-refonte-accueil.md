# Plan — Refonte totale de la page d'accueil (dé-centrer de JavaScript)
Date : 2026-06-18 · Palier : transversal

## Objectif
L'accueil (`index.html`) est trop centrée JavaScript (hero = code JS, cours mis en avant = JS,
syllabus JS, CTA « Commencer JavaScript », appel final JS). La refondre pour représenter **l'ensemble
du site** : 65 cours / 59 langages, les 8 parcours, et la suite d'outils — sans privilégier un langage.

## Investigation
- **Fichiers concernés** :
  - `index.html` — la page à refondre.
  - `js/home.js` — bloc « Reprendre » (cible `[data-home-resume]` + `[data-resume-title/meta/link]`).
    **À conserver intact** (dynamique).
  - `js/logos.js` — `window.courseLogo(id)` + remplit `[data-course-logo="<id>"]`.
  - `js/main.js` — i18n : `NAV_FR_EN` + dict `I18N` (clés `home.*`). À mettre à jour si le FR change.
  - `js/data.js` — `tracks` (8 parcours : premier-projet, web-frontend, backend, fondamentaux, data,
    systeme, jvm, fonctionnel) ; `courses` (accents par cours).
  - `css/pages.css` — composants : `.hero/.hero__grid/__text/__visual`, `.lang-strip/.lang-chip`,
    `.featured`, `.course-card` (couleur via `[data-accent="<id>"]{--card-accent}`), `.track-card`,
    `.feature-card`, `.cta-band`, `.steps`, `.grid--3/--cards`.
- **Conventions** : réutiliser les composants existants ; `data-accent="<id>"` colore via CSS ;
  `data-course-logo="<id>"` est rempli par logos.js ; `data-i18n="clé"` pour la traduction EN.
- **Tests** : aucun (site statique). **Risques de régression** :
  - casser l'i18n (clés `home.*`) → mettre à jour `I18N` dans main.js.
  - le bloc `resume-band` doit garder ses `data-*` (sinon home.js plante en silence).
  - liens internes → tous doivent rester valides.
  - Prism : si je retire le bloc de code du hero, retirer les `<script prism-*>` de l'accueil.
- **Docs/API externes** : aucune (vanilla ; Prism CDN seulement si bloc code conservé).

## Plan d'implémentation
1. **Header** : remplacer le bouton « Commencer le cours » (→ JS) par « Voir le catalogue ».
2. **Hero** : titre + lead **génériques** (choisis ton langage parmi 59) ; CTA « Explorer le
   catalogue » + « Choisir un parcours » ; garder les stats 65/832/59 ; **remplacer le bloc de code JS**
   par une **mosaïque de langages** (`.hero-langs`, tuiles `data-course-logo`/`data-accent`).
3. **Resume band** : inchangé.
4. **Ruban de langages** : inchangé.
5. **Notre approche** : généraliser la carte « projet fil rouge » (ne plus citer « le cours JavaScript »).
6. **Remplacer le « featured JavaScript »** par une section **« Choisis ton parcours »** : 4 `.track-card`
   (premier-projet, web-frontend, backend, fondamentaux) → `pages/parcours.html`.
7. **Cours populaires** : diversifier (6 cartes variées : Python, JavaScript, HTML, SQL, Rust, Go).
8. **Nouvelle section « Les outils »** : 6 cartes-liens phares (catalogue/recherche, playground, défis,
   examen blanc, comparateur de syntaxe, boîte à outils) + lien.
9. **Comment ça marche** : généraliser le texte (pas « JavaScript »).
10. **Appel final** : généraliser (« choisis ton premier cours »).
11. **Scripts** : retirer `prism-*` (plus de bloc code) ; garder data.js/main.js/logos.js/home.js.
12. **CSS** : ajouter `.hero-langs`/`.home-tool` (minimal) ; mettre à jour `I18N` (home.*) dans main.js.

## Hypothèses & risques
- Interprétation de « axée sur le JS » = trop centrée JavaScript → refonte vers une vitrine
  multi-langages + parcours + outils. (Option la plus sûre vu le contexte.)
- Je conserve la charte visuelle et les composants existants (pas de refonte du design system).
- Je garde le bloc « Reprendre » et tous les liens internes.

## Vérification (rempli après coup)
- Diff relu : oui. BOM=0, mojibake=0 sur index.html / main.js / pages.css.
- Balises équilibrées : section 7/7, article 16/16, main/header/footer 1/1.
- Liens internes : 14/14 pages cibles existent (catalogue, parcours, html/css/sql/js/python/rust cours,
  playground, defis, examen, comparateur, revision, outils).
- Prism retiré : 0 réf. `prism`, 0 `code-block`, 0 `language-javascript` ; bloc `data-home-resume` conservé.
- Rendu : non testable hors navigateur (file://). Composants réutilisés (course-card, track styling via
  course-card, card/home-tool, hero-langs via course-card__glyph) → CSS existant + 2 petits blocs ajoutés.
- i18n : clés home.* conservées, FR (HTML) et EN (main.js I18N) mis en cohérence.
