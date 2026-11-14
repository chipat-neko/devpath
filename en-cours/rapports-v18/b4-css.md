# Rapport V18 — case B4 (lot 1), cours `css` (copie `b4-css`, branche `v18/b4-css`)

Copie de travail `D:\test-claude-b4-css`, partie de `a244d0f`. Part traitée : les **47 « Cas réel »**
du cours `css` (un par leçon, `pages/css/lecon-01.html` à `lecon-47.html`). Scripts, pages
téléchargées et journaux de mesure : `scratchpad/b4-css/` (ignoré par git) — `cas.js` (les 47 textes),
`appliquer.js` (le remplacement, qui prouve que rien ne bouge hors de l'encadré), `lire.js` (lecture
des sources), `pages/` (copie texte de chaque source ouverte).

**En une phrase** : sur 47 « Cas réel », **aucun** ne tenait la règle (47 sans source, 47 titres
sans date, 42 sans sujet ; 27 « suspects » selon B1) ;
**5 étaient INEXACTS**, **38 INVÉRIFIABLES** (récits anonymes ou usages généraux), **3 vrais
seulement à propos du site lui-même**, **1 vrai mais général** ; les **47 sont remplacés** par un
cas réel, nommé, daté, sur la même notion, dont **chaque affirmation** est confirmée par une source
ouverte et citée dans l'encadré ; `verif-contenu.js --cas-reel --cours=css` passe de **1 (47 hors
règle)** à **0 (47 conformes)**.

---

## 1. Méthode

1. **Lire le cas et sa leçon** (intertitres de chaque leçon relevés) : le nouveau cas illustre la
   notion de la leçon et garde une phrase qui l'y relie (« c'est tout l'apport de cette leçon », etc.).
2. **Juger l'original** : chaque affirmation nommée confrontée à une source (B2 réutilisé pour
   `lecon-05`, `-11`, `-12`, `-14`, `-46`, et revérifié) ; un récit anonyme (« une équipe »,
   « sur un site marchand », « beaucoup de sites ») est INVÉRIFIABLE par nature.
3. **Remplacer** par un vrai cas : billet ou documentation de l'éditeur, note de version, ticket et
   correctif publics, étude de cas, article de l'auteur du fait. Chaque URL citée a été **ouverte**
   (texte enregistré dans `scratchpad/b4-css/pages/`), et chaque phrase du récit renvoie à une phrase
   de la source ; ce que la source ne dit pas a été retiré (exemples : « très utilisé » pour HTML5
   Boilerplate, « en tête de feuille » pour Paul Irish, « des centaines de valeurs figées » pour
   Tailwind v4, « russe » pour Yandex, « britannique » pour le GDS).
4. **La forme** : `<p class="callout__title">Cas réel — sujet (année)</p>`, le récit, puis
   `<p class="cas-reel__source">Source&nbsp;: …</p>` en dernier, avec lien(s) et date. Structure et
   type de l'encadré gardés (`callout--note`, `callout--tip` pour `lecon-31`), mise en forme
   d'origine gardée (une ligne, ou une balise par ligne pour `lecon-01` et `lecon-26`).
5. **Le remplacement** (`appliquer.js`) ne touche que le titre et le paragraphe de l'encadré, et
   vérifie avant d'écrire que tout le reste du fichier est identique **octet pour octet** ; 0 CR dans
   les 47 fichiers (vérifié avec node). Longueur des récits : **107 à 146 mots**.
6. **Pas de reprise** : aucun sujet n'était déjà un cas d'une autre leçon du cours (recherche dans
   `pages/css/` de chaque sujet : Zen Garden, Igalia, Yandex, Meyer, Starlight, Tokopedia…).

---

## 2. Les 47 cas

États : **INEXACT** (fait réel, détail faux), **INVÉRIFIABLE** (anonyme ou général, aucune source ne
peut le confirmer), **VRAI** ; nature : *général* (usage général), *anonyme* (récit sans sujet),
*produit* (produit ou organisation nommés), *site* (le site Syntaxe lui-même). Aucun n'était INVENTÉ
au sens de B2 (fiction déclarée) ; `lecon-36` (« une équipe produit ouvre son application au
marché du Golfe… en deux semaines ») en a toutes les apparences.

| cas | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/css/lecon-01.html#1` | INVÉRIFIABLE (général ; la mention du site est vraie à peu près) | remplacé : le CSS Zen Garden | Cas réel — le CSS Zen Garden (2003) | https://csszengarden.com/ · https://csszengarden.com/pages/about · https://daveshea.com/projects/zen/ · https://stopdesign.com/archive/2003/05/08/zen-inspiration.html |
| `pages/css/lecon-02.html#1` | INVÉRIFIABLE (général : « beaucoup de sites ») | remplacé : le keylogger CSS de Max Chehab (sélecteur `[value$=…]`) | Cas réel — un enregistreur de frappe en CSS (2018) | https://github.com/maxchehab/CSS-Keylogging · https://api.github.com/repos/maxchehab/CSS-Keylogging · https://api.github.com/users/maxchehab |
| `pages/css/lecon-03.html#1` | INVÉRIFIABLE (général, à la 2e personne) | remplacé : l'option `important` de Tailwind CSS v3 (spécificité, `!important`, sélecteur d'id) | Cas réel — Tailwind CSS face aux sélecteurs trop spécifiques (2021) | https://v3.tailwindcss.com/docs/configuration · https://tailwindcss.com/blog/tailwindcss-v3 |
| `pages/css/lecon-04.html#1` | INVÉRIFIABLE (anonyme : « une personne malvoyante ») | remplacé : la mesure de l'Internet Archive (3,08 % hors 16 px) | Cas réel — l'Internet Archive compte les tailles de police (2018) | https://web.archive.org/web/20221205131357/https://medium.com/@vamptvo/pixels-vs-ems-users-do-change-font-size-5cfb20831773 (Medium direct : 403) |
| `pages/css/lecon-05.html#1` | **INEXACT** (produit) : Bootstrap et Tailwind ouvrent bien sur le reset, mais « presque tous les sites » est faux — 44 % l'appliquent via `*` (Web Almanac 2022) | remplacé et corrigé : le billet de Paul Irish + la mesure du Web Almanac (92 % / 44 %) | Cas réel — le reset box-sizing de Paul Irish (2012) | https://www.paulirish.com/2012/box-sizing-border-box-ftw/ · https://almanac.httparchive.org/en/2022/css |
| `pages/css/lecon-06.html#1` | INVÉRIFIABLE (général : « les sites soignés… toujours system-ui ») | remplacé : WordPress 4.6 abandonne Open Sans pour la pile système | Cas réel — WordPress passe aux polices système (2016) | https://make.wordpress.org/core/2016/07/07/native-fonts-in-4-6/ |
| `pages/css/lecon-07.html#1` | INVÉRIFIABLE (général) | remplacé : « Sliding Doors of CSS » (coins arrondis par images, avant `border-radius`) | Cas réel — les Sliding Doors d'A List Apart (2003) | https://alistapart.com/article/slidingdoors/ |
| `pages/css/lecon-08.html#1` | INVÉRIFIABLE (général) | remplacé : retour de `position: sticky` dans Chrome 56 | Cas réel — position: sticky revient dans Chrome (2016) | https://developer.chrome.com/blog/position-sticky |
| `pages/css/lecon-09.html#1` | **INEXACT** (général) : le « Saint Graal » du CSS n'est pas le centrage, c'est la mise en page à trois colonnes avec en-tête et pied (Holy Grail Layout) | remplacé et corrigé : Solved by Flexbox (Holy Grail + centrage vertical) | Cas réel — Solved by Flexbox, de Philip Walton (2013) | https://philipwalton.github.io/solved-by-flexbox/ · …/demos/holy-grail/ · …/demos/vertical-centering/ · https://api.github.com/repos/philipwalton/solved-by-flexbox |
| `pages/css/lecon-10.html#1` | INVÉRIFIABLE (général : « reposent presque toutes ») | remplacé : Grid livré au printemps 2017 (Igalia, Bloomberg) et la page Grid de mozilla.org | Cas réel — CSS Grid arrive dans les navigateurs (2017) | https://www.igalia.com/2017/04/04/Shipping-CSS-Grid-Layout-in-major-browsers.html · https://hacks.mozilla.org/2017/03/a-new-css-grid-demo-on-mozilla-org/ |
| `pages/css/lecon-11.html#1` | INVÉRIFIABLE (général ; B2 : « pénalisée » introuvable chez Google) | remplacé : l'annonce Google du 26 février 2015 (signal de classement mobile au 21 avril) | Cas réel — la mise à jour mobile de Google (2015) | https://developers.google.com/search/blog/2015/02/finding-more-mobile-friendly-search |
| `pages/css/lecon-12.html#1` | INVÉRIFIABLE (général ; B2 idem) | remplacé : WebKit, `prefers-reduced-motion` et les troubles vestibulaires | Cas réel — Apple et prefers-reduced-motion (2017) | https://webkit.org/blog/7551/responsive-design-for-motion/ |
| `pages/css/lecon-13.html#1` | VRAI pour le site (`[data-theme="dark"]` dans `css/components.css`, variables dans `css/variables.css`), « le pattern n°1 du thème » INVÉRIFIABLE ; source = le site lui-même | remplacé : le mode sombre de Bootstrap 5.3 (`data-bs-theme` sur `<html>`) | Cas réel — le mode sombre de Bootstrap 5.3 (2023) | https://blog.getbootstrap.com/2023/05/30/bootstrap-5-3-0/ |
| `pages/css/lecon-14.html#1` | **INEXACT** (site ; B2) : six feuilles de style liées, pas cinq (`fonts.css` d'abord) — revérifié dans `lecon-14.html` | remplacé : la naissance de BEM chez Yandex | Cas réel — la naissance de BEM chez Yandex (2009) | https://www.smashingmagazine.com/2013/02/the-history-of-the-bem-methodology/ (la page d'histoire officielle `en.bem.info/method/history` répond 404) |
| `pages/css/lecon-15.html#1` | INVÉRIFIABLE (général : « beaucoup de sites ») | remplacé : le `:focus { outline: 0 }` du reset d'Eric Meyer, puis son retrait | Cas réel — le :focus du reset d'Eric Meyer (2011) | https://meyerweb.com/eric/thoughts/2007/05/01/reset-reloaded/ · https://meyerweb.com/eric/thoughts/2011/01/03/reset-revisited/ |
| `pages/css/lecon-16.html#1` | INVÉRIFIABLE (général) | remplacé : les références de Wikipédia en colonnes (`column-width: 30em`) | Cas réel — les références de Wikipédia en colonnes (2017) | https://www.mediawiki.org/wiki/Contributors_(2015-2021)/Projects/Columns_for_references · https://www.mediawiki.org/wiki/Extension:Cite · https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Cite/master/modules/ext.cite.styles.less · …/extension.json |
| `pages/css/lecon-17.html#1` | INVÉRIFIABLE (général) ; la mention du certificat du site est vraie (`@media print` dans `css/pages.css`) | remplacé : le bloc `@media print` d'HTML5 Boilerplate 9.0.1 | Cas réel — les styles d'impression d'HTML5 Boilerplate (2024) | https://github.com/h5bp/html5-boilerplate/blob/v9.0.1/dist/css/style.css (lu en brut sur raw.githubusercontent.com) · README v9.0.1 · https://api.github.com/repos/h5bp/html5-boilerplate/releases/latest |
| `pages/css/lecon-18.html#1` | INVÉRIFIABLE (anonyme : « une équipe » ; « Tailwind UI » bâti sur `.btn` non confirmé) | remplacé : le GOV.UK Design System et ses variantes de bouton | Cas réel — le GOV.UK Design System (2018) | https://gds.blog.gov.uk/2018/06/22/introducing-the-gov-uk-design-system/ · https://design-system.service.gov.uk/components/button/ |
| `pages/css/lecon-19.html#1` | VRAI pour le site (grilles `repeat(auto-fill/auto-fit, minmax(…))` dans `css/layout.css`, `css/pages.css`) ; « la quasi-totalité des tableaux de bord » INVÉRIFIABLE | remplacé : l'article d'Una Kravets qui nomme le motif « RAM » | Cas réel — la grille « RAM » d'Una Kravets (2020) | https://web.dev/articles/one-line-layouts |
| `pages/css/lecon-20.html#1` | INVÉRIFIABLE (général : « neuf fois sur dix ») | remplacé : les badges scroll/overflow de Firefox 83 | Cas réel — Firefox 83 désigne les débordements (2020) | https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/83 · https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/debug_scrollable_overflow/ |
| `pages/css/lecon-21.html#1` | INVÉRIFIABLE (anonyme : « sur un tableau de bord ») | remplacé : la bibliothèque hint.css (`::after` + `attr(aria-label)`) | Cas réel — la bibliothèque hint.css (2012) | https://github.com/chinchang/hint.css (README et `hint.base.css` v2.7.0 en brut) · API GitHub (création, version, auteur) |
| `pages/css/lecon-22.html#1` | INVÉRIFIABLE (anonyme : « la page d'accueil d'un site ») | remplacé : Utopia, l'échelle fluide puis `clamp()` | Cas réel — l'échelle typographique fluide d'Utopia (2020) | https://utopia.fyi/blog/designing-with-fluid-type-scales/ · https://utopia.fyi/blog/clamp/ |
| `pages/css/lecon-23.html#1` | INVÉRIFIABLE (anonyme : « une équipe ») | remplacé : la mesure de Paul Irish, `translate()` contre `top`/`left` | Cas réel — translate contre top/left, mesuré par Paul Irish (2012) | https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/ |
| `pages/css/lecon-24.html#1` | INVÉRIFIABLE (anonyme ; le détail du préfixe Safari était juste jusqu'à Safari 18) | remplacé : Safari 18.0 retire le préfixe de `backdrop-filter` | Cas réel — Safari abandonne le préfixe de backdrop-filter (2024) | https://webkit.org/blog/15865/webkit-features-in-safari-18-0/ |
| `pages/css/lecon-25.html#1` | INVÉRIFIABLE (anonyme : « une page de documentation ») | remplacé : le même problème, réel — ticket n° 53 et correctif n° 54 de Starlight (`scroll-padding-top`) | Cas réel — le sommaire de Starlight caché sous la barre (2023) | https://github.com/withastro/starlight/issues/53 · https://github.com/withastro/starlight/pull/54 (lus par l'API GitHub, avec le diff du commit `db728d61af`) |
| `pages/css/lecon-26.html#1` | INVÉRIFIABLE (anonyme : « une équipe qui intègre Bootstrap » ; « la façon recommandée » non sourcée) | remplacé : l'annonce des couches de cascade (Chromium 99, Firefox 97, Safari 15.4) | Cas réel — les couches de cascade arrivent partout (2022) | https://developer.chrome.com/blog/cascade-layers |
| `pages/css/lecon-27.html#1` | INVÉRIFIABLE (général) | remplacé : l'histoire de `:has()` (WebKit, Igalia) | Cas réel — :has(), le sélecteur parent enfin livré (2022) | https://webkit.org/blog/13096/css-has-pseudo-class/ |
| `pages/css/lecon-28.html#1` | INVÉRIFIABLE (produit) : Tailwind v4 en oklch est vrai (blog v4.0) ; Radix Colors « en oklch » non confirmé — son paquet publie hexadécimal et `color(display-p3 …)`, aucune valeur oklch | remplacé : le billet d'Evil Martians (HSL contre OKLCH, syntaxe relative) | Cas réel — pourquoi Evil Martians est passé à OKLCH (2022) | https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl · https://web.archive.org/web/20221101171713/https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl · https://raw.githubusercontent.com/radix-ui/colors/main/src/light.ts (verdict) |
| `pages/css/lecon-29.html#1` | INVÉRIFIABLE (général) | remplacé : subgrid dans les trois moteurs (Firefox 71, Safari 16, Chrome/Edge 117) | Cas réel — subgrid dans tous les moteurs (2023) | https://web.dev/articles/css-subgrid · https://web.dev/blog/interop-2023-wrapup |
| `pages/css/lecon-30.html#1` | INVÉRIFIABLE (général ; « pénalisée » comme en `lecon-11`) | remplacé : l'étude de cas Yahoo! JAPAN News (CLS 0,2 → 0) | Cas réel — Yahoo! JAPAN News réserve la place de ses images (2021) | https://web.dev/case-studies/yahoo-japan-news |
| `pages/css/lecon-31.html#1` | VRAI (général) : « support généralisé depuis 2023 » se confirme (Firefox 110) | réécrit autour de l'annonce sourcée du 14 février 2023 (même propos, maintenant daté et sourcé) | Cas réel — les container queries dans tous les navigateurs (2023) | https://web.dev/blog/cq-stable |
| `pages/css/lecon-32.html#1` | INVÉRIFIABLE (général) | remplacé : l'annonce des transformations 3D par WebKit | Cas réel — WebKit introduit les transformations 3D (2009) | https://webkit.org/blog/386/3d-transforms/ |
| `pages/css/lecon-33.html#1` | INVÉRIFIABLE (produit : Medium n'est montré nulle part utiliser `scroll()`) | remplacé : l'étude de cas Tokopedia (80 % de code en moins, CPU 50 % → 2 %) | Cas réel — Tokopedia et les animations liées au défilement (2024) | https://developer.chrome.com/blog/css-ui-ecommerce-sda |
| `pages/css/lecon-34.html#1` | **INEXACT** (produit) : iOS, macOS et Windows 11 ne « reposent » pas sur la propriété CSS `backdrop-filter` (ce sont des matériaux natifs), et Mica est **opaque** selon Microsoft | remplacé : CSSgram, les filtres d'Instagram en `filter` + modes de fusion | Cas réel — CSSgram, les filtres d'Instagram en CSS (2015) | https://github.com/una/CSSgram (README, `inkwell.css`, `aden.css` en brut ; API GitHub) · https://learn.microsoft.com/en-us/windows/apps/design/style/mica (verdict) |
| `pages/css/lecon-35.html#1` | **INEXACT** (général) : « depuis 2023, tous les navigateurs à jour gèrent… `@scope` » — Firefox ne l'a qu'en version 146 (9 décembre 2025) | remplacé : le sondage de WebKit sur la syntaxe du nesting | Cas réel — la syntaxe du nesting CSS choisie par sondage (2023) | https://webkit.org/blog/13607/help-choose-from-options-for-css-nesting-syntax/ · https://webkit.org/blog/13813/try-css-nesting-today-in-safari-technology-preview/ · https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/at-rules/scope.json et …/browsers/firefox.json (verdict) |
| `pages/css/lecon-36.html#1` | INVÉRIFIABLE (anonyme, d'allure fictive : « marché du Golfe… en deux semaines ») | remplacé : le RTL de Bootstrap 5 et le renommage `.ml-*` → `.ms-*` | Cas réel — Bootstrap 5 passe au RTL (2020) | https://blog.getbootstrap.com/2020/12/07/bootstrap-5-beta-1/ · https://getbootstrap.com/docs/5.3/getting-started/rtl/ |
| `pages/css/lecon-37.html#1` | INVÉRIFIABLE (anonyme : « une messagerie », chiffres non sourcés) | remplacé : la mesure de web.dev sur un blog de voyage (232 ms → 30 ms) | Cas réel — content-visibility à l'épreuve d'un blog de voyage (2020) | https://web.dev/articles/content-visibility |
| `pages/css/lecon-38.html#1` | INVÉRIFIABLE (produit : « les comboboxes de GitHub ou de Google Maps » non confirmé) | remplacé : l'annonce de l'API par Chrome 125 et son renommage dans Chrome 129 | Cas réel — le positionnement par ancre arrive dans Chrome (2024) | https://developer.chrome.com/blog/anchor-positioning-api |
| `pages/css/lecon-39.html#1` | INVÉRIFIABLE (produit : « la documentation d'Astro s'en sert » non confirmé) | remplacé : l'étude de cas redBus (+7 % de ventes) et Nykaa | Cas réel — les View Transitions de redBus (2023) | https://developer.chrome.com/blog/view-transitions-case-studies |
| `pages/css/lecon-40.html#1` | INVÉRIFIABLE (produit) : Tailwind v4 en OKLCH vrai ; « Radix Colors raisonne en luminance perceptuelle » non confirmé | remplacé (même sujet, recentré sur la leçon) : Tailwind CSS v4.0, `calc(var(--spacing) * n)` et `color-mix()` | Cas réel — Tailwind CSS v4 calcule ses utilitaires (2025) | https://tailwindcss.com/blog/tailwindcss-v4 |
| `pages/css/lecon-41.html#1` | INVÉRIFIABLE (général) | remplacé : `interpolate-size` (Chrome 129) et pourquoi il n'est pas actif d'office | Cas réel — animer vers height: auto, enfin (2024) | https://developer.chrome.com/docs/css-ui/animate-to-height-auto |
| `pages/css/lecon-42.html#1` | INVÉRIFIABLE (produit) : Primer confirmé (base / fonctionnels / composant) ; Polaris, Material 3 et Spectrum non vérifiés | remplacé (même idée, sourcée) : la spécification stable des design tokens du W3C + les catégories de Primer | Cas réel — les design tokens deviennent un standard (2025) | https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/ · https://primer.style/product/primitives/token-names/ · https://primer.style/product/primitives/ · https://primer.style/ |
| `pages/css/lecon-43.html#1` | INVÉRIFIABLE (produit : « Stripe, Shopify activent systématiquement » ; Polaris n'en fait qu'une option, `numeric = false` par défaut) | remplacé (même sujet, corrigé) : l'option `numeric` du composant `Text` de Polaris | Cas réel — les chiffres du design system Polaris de Shopify (2025) | https://github.com/Shopify/polaris/blob/%40shopify/polaris%4013.9.5/polaris-react/src/components/Text/Text.module.css · …/Text.tsx (lus en brut) · API GitHub (archivé, version du 26 mars 2025) |
| `pages/css/lecon-44.html#1` | INVÉRIFIABLE (produit : les squelettes de Facebook, YouTube, LinkedIn « sont un dégradé animé » non confirmé) | remplacé : la galerie de motifs CSS3 de Lea Verou | Cas réel — la galerie de motifs CSS3 de Lea Verou (2011) | https://lea.verou.me/blog/2011/04/css3-patterns-gallery-and-a-new-pattern/ · https://projects.verou.me/css3patterns/ |
| `pages/css/lecon-45.html#1` | INVÉRIFIABLE (général) | remplacé : Firefox 72 livre CSS Motion Path | Cas réel — Firefox 72 et le CSS Motion Path (2020) | https://hacks.mozilla.org/2020/01/firefox-72-our-first-song-of-2020/ · https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/72 |
| `pages/css/lecon-46.html#1` | INVÉRIFIABLE (produit ; B2 : Messenger, WhatsApp Web, Intercom introuvables) | remplacé (même source que B2) : le billet Chrome 63 et son exemple de fenêtre de discussion | Cas réel — overscroll-behavior arrive dans Chrome 63 (2017) | https://developer.chrome.com/blog/overscroll-behavior |
| `pages/css/lecon-47.html#1` | INVÉRIFIABLE (produit : GitHub, Stripe, MDN « déclarent color-scheme » non confirmé) | remplacé : le mode sombre de WebKit et `color-scheme` (ex-`supported-color-schemes`) | Cas réel — WebKit et color-scheme (2019) | https://webkit.org/blog/8840/dark-mode-support-in-webkit/ |

---

## 3. Décomptes

| | nombre |
|---|---:|
| « Cas réel » lus (tous, pas seulement les 27 suspects de B1) | 47 |
| conformes à la règle avant / après (`--cas-reel --cours=css`, code 1 → 0) | 0 / **47** |
| avant : sans source / titre sans date / titre sans sujet | 47 / 47 / 42 |
| état trouvé : INEXACT | 5 (`05`, `09`, `14`, `34`, `35`) |
| état trouvé : INVÉRIFIABLE | 38 |
| état trouvé : VRAI pour le site seulement (source = le site ; généralité invérifiable) | 3 (`13`, `17`, `19`) |
| état trouvé : VRAI (général) | 1 (`31`) |
| état trouvé : INVENTÉ (fiction déclarée) | 0 |
| action : vérifié tel quel | 0 |
| action : remplacé par un vrai cas sourcé sur la même notion | 47 (dont 6 qui gardent le sujet ou le fait vrai de l'original, désormais sourcé et corrigé : `31`, `40`, `42`, `43`, `46`, et `05` pour Bootstrap/Tailwind → la mesure qui les situe) |
| action : renommé « Scénario » | 0 |
| sources citées dans les encadrés (URL distinctes) | 70, toutes ouvertes |

Sources : primaires pour 46 cas (billets et documentations des éditeurs, notes de version, tickets,
dépôts, études de cas). **Une exception assumée** : `lecon-14` (BEM) cite l'article de Smashing
Magazine de Maxim Shirshin (2013), récit de première main de l'histoire de BEM chez Yandex, parce que
la page d'histoire officielle `en.bem.info/method/history` répond **404**. **Deux sources lues par
copie archivée** : Medium répond 403 (`lecon-04`, lu sur web.archive.org, lien d'archive cité), et la
version d'origine d'Evil Martians (2022) est citée en archive à côté de la page actuelle (`lecon-28`).
Hacks Mozilla et web.archive.org refusent `curl` (403/429) mais ont été lus par `fetch`.

---

## 4. Contrôles (avant le dernier commit)

Joués sur l'état final des 47 leçons (commit `d687a9b`), dans `D:\test-claude-b4-css` :

| commande | code | ce qu'elle dit |
|---|---:|---|
| `node tools/verif-contenu.js --cas-reel --cours=css` | **0** | 47 lus, 47 conformes, 0 hors règle (à la base : code 1, 47 hors règle) |
| `node tools/verif-contenu.js --strict` | **0** | toutes les leçons tiennent le standard ; 1 maigre (`os/lecon-04`, déjà à la base) |
| `node tools/verif-html.js` | **0** | aucun problème |
| `node tools/verif-domaines-interdits.js` | **0** | aucune référence réelle aux trois domaines |
| `node tools/verif-qcm-lexique.js` | **0** | l'indice lexical n'a empiré nulle part (0 aussi avant les changements) |
| `node tools/verif-qcm-biais.js` | **0** | aucun cours n'a empiré (0 aussi avant) |
| fins de ligne (node, octet 13 compté dans les 47 fichiers) | — | **0 CR** |
| `node tools/verif.js --rapide` | **1** | 54 étapes jouées ; rouges expliqués ci-dessous |

`--rapide` a tourné deux fois. **1<sup>er</sup> passage** (avant deux retouches de mots, en `lecon-17`
et `lecon-44`) : 528,8 s, 3 signalés — `donnees`, `doc-ref`, `doc-rec`. **2<sup>e</sup> passage**
(état final) : 759,9 s, 4 signalés — les trois mêmes, plus `vexec` :

- `donnees` : **I18 seul** (`search-index.js` périmé, publié 4 274 431 o, regénéré 4 279 841 o) — le
  rouge toléré ; les 2 « ERREURS » du journal sont les deux lignes de cet unique invariant.
- `doc-ref` (`tools/doc/verif-doc.js`, 40/41) et `doc-rec` (`tools/doc/verif-recherche.js`, 75/76) :
  les chiffres de corpus du cours `doc`, que ce lot change légitimement (§ 5.2). Verts à la base.
- `vexec` (`tools/verif-execution.js`) : **transitoire** — « la page n'a pas chargé ses scripts » dans
  le délai de 15 s, alors que 141 processus Chrome tournaient sur la machine (six autres lots en
  parallèle). La page `pages/execution.html` et ses scripts ne sont pas touchés par ce lot ; l'étape
  était verte au 1<sup>er</sup> passage, et rejouée seule deux fois ensuite : **0 problème, code 0**
  (`scratchpad/b4-css/vexec-1.txt`, `vexec-2.txt`).

Journaux : `scratchpad/b4-css/verif-rapide.txt`, `verif-rapide-2.txt`, et
`scratchpad/.verif-journal/2026-11-14T04-59-37/`. `verif.js --mutations` n'a **pas** été lancé.

---

## 5. Ce qui reste ouvert, et où j'ai douté

**Ouvert (dérivés, à régénérer après la fusion — rien à corriger dans cette branche)** :

1. **I18** : `js/search-index.js` périmé (+5 405 octets au regénéré) — attendu, l'orchestrateur le
   régénère.
2. **Les chiffres du cours `doc`** (`doc-ref` = `tools/doc/verif-doc.js`, `doc-rec` =
   `tools/doc/verif-recherche.js`) : ces deux pages **comptent les leçons du site** et publient le
   compte. Les 47 lignes de source portent des liens externes et deux d'entre elles nomment MDN :
   - `doc/lecon-04` publie « **11** portent un lien vers l'extérieur » ; le relevé d'aujourd'hui en
     trouve **58** (les 47 leçons css s'y ajoutent) ;
   - la page de cours `doc` publie **84** leçons qui « renvoient à un document » (motifs
     `documentation officielle`, `MDN`, `la spécification`, `RFC n`) ; le relevé en trouve **86**
     (`css/lecon-20` et `css/lecon-45` citent MDN).
   À la base (`a244d0f`, rejoué sur un export `git archive`), les deux outils sont verts : c'est donc
   bien ce lot qui les fait bouger, et **chaque lot de B4 les fera bouger encore** (tout « Cas réel »
   sourcé par un lien). Ces pages sont assemblées par `tools/doc/gen.js` : je ne l'ai pas lancé (pages
   hors de ma part, et un chiffre écrit ici serait faux dès la fusion du lot suivant). À faire une
   fois, après la fusion de tous les lots : `node tools/doc/gen.js`, puis les deux outils.
3. `verif-contenu --strict` signale **1 leçon maigre**, `os/lecon-04` : déjà signalée à la base, sans
   rapport avec ce lot.
4. Les cliquets QCM sont verts ; seule la statistique de site du lexique bouge d'un dixième
   (`PROPORTION rend 56,1 % → 56,2 %`, `INVERSE tranche sur 37,0 % → 37,1 %`), sans qu'aucun cours
   n'empire.

**Doutes, cas par cas** (rien de faux à ma connaissance, mais des points qu'une contre-relecture doit
regarder) :

- `lecon-26` (cascade layers) et `lecon-33` (Tokopedia) : la page Chrome ne montre qu'une date de
  **mise à jour** (1<sup>er</sup> février 2022, 7 mai 2024), pas la date de publication ; le récit
  dit « début 2022 » pour la première et ne date pas la seconde, l'année du titre est celle de la
  mise à jour.
- `lecon-41` et `lecon-29` : « Chrome 129 », « Firefox 71, Safari 16, Chrome et Edge 117 » viennent du
  tableau de compatibilité affiché dans l'article (pas d'une phrase).
- `lecon-14` : la seule source non éditeur (Smashing Magazine), faute de la page officielle (404).
- `lecon-43` : Polaris React est **archivé** (marqué « Deprecated ») ; le récit le dit et date la
  version (13.9.5, 26 mars 2025). Un cas plus vivant serait préférable à terme.
- `lecon-16` et `lecon-17` : le code cité est celui d'aujourd'hui (`master` de Cite) ou de la version
  9.0.1 d'HTML5 Boilerplate, pas celui de 2017 ou des premières versions ; le récit le dit
  (« Aujourd'hui », « version 9.0.1 »).
- `lecon-42` : deux sources réunies (la spécification DTCG datée, la documentation Primer non datée).
- `lecon-12` : le réglage d'iOS est nommé en anglais, « Reduce Motion », comme dans la source.
- `lecon-02` : exemple tiré de la sécurité (un « keylogger ») ; il illustre exactement `[attr$=…]`,
  et le récit dit qu'il ne vise que les sites à composants « contrôlés » comme React.
- Les phrases qui relient le cas à la leçon (« c'est tout l'apport de cette leçon », « un seul
  dégradé », « `tabular-nums` donne la même largeur à tous les chiffres »…) énoncent des faits de
  CSS enseignés par la leçon elle-même, pas des faits de la source.

---

## 6. Consignes de fusion

- Branche `v18/b4-css`, deux commits : `d687a9b` (les 47 leçons) et celui de ce rapport. Fichiers
  touchés : `pages/css/lecon-01.html` à `lecon-47.html` (un encadré chacun : 45 lignes remplacées
  une pour une, `lecon-01` et `lecon-26` passent de 2 à 3 lignes) et `en-cours/rapports-v18/b4-css.md`.
  Aucun autre cours, aucun QCM, aucun `js/`, aucun index dérivé. Pas de conflit attendu avec les
  autres lots (autres cours). Erratum : le message de `d687a9b` annonce 69 URL, il y en a **70** (le
  lien vers le README d'HTML5 Boilerplate a été ajouté juste avant ce commit).
- Après la fusion de **tous** les lots : `node tools/build-index.js --write --fresh` (I18, jusqu'au
  point fixe), puis `node tools/doc/gen.js` (chiffres du cours `doc`, § 5.2), puis
  `node tools/doc/verif-doc.js`, `node tools/doc/verif-recherche.js`, les deux cliquets QCM et
  `node tools/verif.js --rapide`.
- Pour la contre-relecture : la copie texte de chaque source ouverte est dans
  `D:\test-claude-b4-css\scratchpad\b4-css\pages\` (ignoré par git), et les 47 textes dans
  `scratchpad/b4-css/cas.js`.
