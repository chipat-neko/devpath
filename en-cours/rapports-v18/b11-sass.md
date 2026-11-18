# Rapport V18 — case B11, lot 8 : le cours `sass` (copie `b11-sass`, branche `v18/b11-sass`)

Copie de travail `D:\test-claude-b11-sass`, partie de `01795b6`. Part traitée : les **14 « Cas réel »** du
cours `sass` (un par leçon). Scripts et pièces dans `scratchpad/b11-sass/` (ignoré par git) : `cas/NN.html`
(les 14 nouveaux corps), `appliquer.js` (remplace l'intérieur de `callout__body`, du titre au `</div></div>` ;
refuse un titre absent ou multiple, refuse tout CR, garde les octets hors de l'encadré), `risques.js` (mots
d'options de QCM qui n'existent dans la page que dans l'encadré, et ceux qu'un nouveau texte ferait entrer),
`montre.js`, `cherche.js` (recherche dans les 1 551 « Cas réel » du site), les essais `t-*.scss`, et les pages
et paquets ouverts. Paquets officiels installés **dans le scratchpad** : `sass@1.108.2`, `bootstrap@5.3.9`,
`bulma@1.0.4` (`sass/`), `bootstrap@5.3.8` (`bs538/`), `@primer/primitives` 4.0.0 et 4.3.0, `@primer/css`
16.0.0 (`prim/`), `@fortawesome/fontawesome-free` 7.3.1 (`fa/`).

**En une phrase** : `node tools/verif-contenu.js --cas-reel --cours=sass` passe de **14 hors de la règle à 0** ;
sur les 14 cas trouvés, **aucun n'était conforme ni VRAI tel quel** : 5 INVÉRIFIABLES (récits anonymes ou
usages généraux), 1 sujet réel dont le foyer est ailleurs (BEM chez Yandex), 4 INEXACTS (dont 2 devenus faux :
« la 5.3.8, dernière version stable », alors que Bootstrap 5.3.9 est sorti le 11 novembre 2026), 4 VRAIS sur
le fond mais non datés, datés sur une version dépassée, ou chargés d'affirmations sans source ; **9 remplacés** par un cas réel daté et sourcé
sur la même notion, **5 corrigés sur leur sujet**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b11-sass`) : `1558ae0` (sass, 14 cas), puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` : div externe, icône
  et type gardés (`note`, et `tip` pour `lecon-05`). Aucun intertitre `<h2>`/`<h3>` « Cas réel » n'est collé
  au-dessus d'un encadré dans ce cours (les `<h2>` qui précèdent — « Portée : global ou local », « Migrer sans
  tout casser »… — sont des sections de la leçon, suivies de plusieurs paragraphes) : rien à renommer.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? » et dans « » ; `&` écrit `&amp;` dans le `<code>`.
  Corps de 130 à 190 mots environ (hors titre et source).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans les 1 551 « Cas réel » du site
  (titres et corps), dans le fichier de réservations du lot 7 (`b10-reservations.txt`), puis inscrit au
  fichier commun `b11-reservations.txt` (14 lignes, relu après écriture : aucun conflit). Sujet **écarté** :
  la naissance de BEM chez Yandex, foyer `css/lecon-14` (que racontait `sass/lecon-08`). Sujets voisins
  vérifiés distincts : `css/lecon-13` (mode sombre de Bootstrap 5.3.0), `css/lecon-36` (Bootstrap 5 et le RTL),
  `css/lecon-42` (spécification des design tokens, qui cite Primer d'aujourd'hui ; je n'ai pas repris ses
  sources). Le cours racontait **Bootstrap dans 7 leçons sur 14** (01, 04, 07, 10, 11, 13, 14) ; il en garde
  4, chacune sur un fait distinct et daté (4 alpha en 2015, 5.0.2 en 2021, les mixins de 5.3.9, la 6 alpha
  de 2026). `doublons.js` : aucune source de `sass` partagée avec un autre cours.
- **Comportements rejoués** avec Dart Sass **1.108.2** (paquet npm officiel, dans le scratchpad) :
  - `!global` (`02`) : `$global: #c00;` dans `.carte` → `.carte { color: #c00 }`, puis `#333` ailleurs ;
    `$global: #0c0 !global;` → `#0c0` dans la suite de la feuille.
  - imbrication (`03`) : `.page-container { .content { .profile {…} } }` → `.page-container .content .profile`.
  - couleurs (`06`) : `lighten(#2563c8, 10%)` → avertissements `color-functions` (« Suggestions:
    color.scale($color, $lightness: 18.6813186813%) / color.adjust($color, $lightness: 10%) ») et
    `global-builtin` ; l'exemple du billet (`color.scale(hsl(0 100% 25.1%), $lightness: 25%)`, avec et sans
    `$space: oklch`) redonne les valeurs publiées.
  - Font Awesome Free 7.3.1 (`07`) : `fontawesome.scss` compilé → **2 001** classes `.fa-* { --fa: … }`,
    autant que d'entrées dans la map `$icons` ; `.fa-1x` à `.fa-10x` par `@for`.
  - BEM (`08`) : `&__titre` → `.carte__titre`, `&--mise-en-avant` → `.carte--mise-en-avant` ; `.bar-&` →
    « "&" may only used at the beginning of a compound selector ».
  - Bootstrap 5.3.9 (`07` écarté, `10`, `11`) : grille par `@for $i from 1 through $columns` dans
    `make-grid-columns` (`.col-md-1` à `.col-md-12` produits ; avec `$grid-columns: 16`, `.col-16` apparaît) ;
    les marges `.m-0` à `.m-5` viennent de l'entrée `"margin"` de `$utilities` (valeurs `$spacers`), déroulée
    par `@each` dans l'API des utilitaires ; `divide()` : deux `@while` imbriqués, 18 lignes d'appel, aucun
    `@use "sass:…"` ; avec `md: 800px` dans `$grid-breakpoints`, plus un seul `768px` dans le CSS.
  - Bulma 1.0.4 (`12`) : `@use "bulma/sass" with ($primary: #00d1b2, $custom-colors: ("marque": #e0245e))` →
    30 sélecteurs `is-marque`, dont `.button.is-marque` ; avec `"marque": "e0245e"` (sans `#`) → 0, sans
    erreur ni message sur cette couleur (seuls des avertissements `if-function` sans rapport) ; 0 `@error`
    et 0 `@warn` dans `sass/`.
  - Primer (`09`) : `_dark.scss` de Primer Primitives 4.0.0 déclare **521** propriétés personnalisées (compte
    des déclarations et des points-virgules ; fichier identique sur unpkg et dans le paquet) ;
    `base/modes.scss` de Primer CSS 16.0.0 lu dans le paquet et sur GitHub (tag `v16.0.0`).
- **Mots d'options de QCM** (`lexique-diff.js`, base `01795b6`) : **0 écart dès l'application**. `risques.js`
  avait listé avant d'écrire les mots de distracteurs présents **seulement** dans l'ancien encadré (`teinte`,
  `impose`, `reprend`, `correction`, `composant`, `entière`, `écrites`, `moteur`, `charger`, `feuilles`,
  `ajouté`, `styles`, `lignes`, `tourne`) : chacun est remis dans une phrase exacte du nouveau cas
  (« la nouvelle teinte valait pour la suite de la feuille », « Ruby Sass, le moteur d'origine du langage »,
  « modifier les jetons pendant que la page tourne »…). Mots qui seraient entrés, retirés avant application :
  `allonge` (`03`), `compilé` (`10`), `modules` et `changer` (`13`), `import` (`14`).
- Une marque de fraîcheur (`<span class="fraicheur">`, « l'un des frameworks CSS les plus utilisés au monde »)
  disparaît avec l'ancien texte de `lecon-01` ; `verif-fraicheur.js --cours=sass` reste à 0.

## Cas par cas

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/sass/lecon-01.html#1` | produit nommé, VRAI sur le fond (Bootstrap écrit en Sass, `$primary`, `$spacer`, `$border-radius` existent) mais non daté, et deux affirmations sans source (« l'un des frameworks CSS les plus utilisés au monde », « des milliers de sites ») | corrigé sur son sujet : recentré sur l'événement daté, la 4 alpha qui quitte Less pour Sass et passe ses options en variables ; LibSass datée (dépréciée, puis fin de vie) | Cas réel — Bootstrap 4 passe de Less à Sass (2015) | https://blog.getbootstrap.com/2015/08/19/bootstrap-4-alpha/ (19 août 2015, @mdo) ; https://sass-lang.com/blog/libsass-is-deprecated/ (26 octobre 2020) ; https://sass-lang.com/blog/libsass-is-end-of-life/ (23 octobre 2025) |
| `pages/sass/lecon-02.html#1` | INVÉRIFIABLE — récit anonyme (« un design system d'entreprise », « le service marketing ») | remplacé par : Sass 3.3 déprécie l'écriture d'une globale depuis un bloc et crée `!global`, Sass 3.4 rend ces affectations locales — le piège de la leçon | Cas réel — Sass 3.4 et le drapeau !global (2014) | https://github.com/sass/ruby-sass/blob/stable/doc-src/SASS_CHANGELOG.md (lu en brut : 3.3.0 du 7 mars 2014, « Backwards Incompatibilities », et 3.4.0 du 18 août 2014) ; Dart Sass 1.108.2 |
| `pages/sass/lecon-03.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe reprend une vieille feuille Sass… ») | remplacé par : la règle « pas plus de trois niveaux » du guide CSS/Sass d'Airbnb, et sa raison | Cas réel — Airbnb limite l'imbrication à trois niveaux (2015) | https://github.com/airbnb/css (README actuel, avis d'archivage) ; historique par l'API GitHub : commit `325b6599` du 29 juin 2015 (« Adds initial styleguide content », règle déjà présente), commit `5bbcb735` du 3 juin 2024 (avis) ; Dart Sass 1.108.2 |
| `pages/sass/lecon-04.html#1` | INVÉRIFIABLE (« Dans une équipe produit… ») et INEXACT, devenu faux : « la 5.3.8, dernière version stable » — Bootstrap 5.3.9 est sorti le 11 novembre 2026 | remplacé par : le lancement du système de modules (`@use`, `with`, `@forward`) dans Dart Sass 1.23.0 | Cas réel — Sass lance son système de modules (2019) | https://sass-lang.com/blog/the-module-system-is-launched/ (Natalie Weizenbaum, 2 octobre 2019) ; https://github.com/sass/dart-sass/releases/tag/1.23.0 (par l'API) |
| `pages/sass/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (« Sur un site de 60 composants… ») | remplacé par : le mixin `mq()` du Guardian (site responsive et IE8), devenu Sass MQ | Cas réel — le mixin mq() du Guardian (2013) | https://www.theguardian.com/info/developer-blog/2013/oct/14/mobile-first-responsive-ie8 (auteur et date dans les métadonnées : Kaelig Deloumeau-Prigent, 14 octobre 2013) ; https://github.com/sass-mq/sass-mq (README lu en brut) |
| `pages/sass/lecon-06.html#1` | INVÉRIFIABLE (verdict de B2, confirmé) — illustration générale ; Material non vérifié, Tailwind va de 50 à 950 | remplacé par : les espaces de couleur, `lighten()` et `darken()` dépréciés depuis Dart Sass 1.79.0 au profit de `color.adjust()` / `color.scale()` | Cas réel — Sass déprécie lighten() et darken() (2024) | https://sass-lang.com/blog/wide-gamut-colors-in-sass/ (Miriam Suzanne, 11 septembre 2024) ; https://sass-lang.com/documentation/breaking-changes/color-functions/ (« Dart Sass since 1.79.0 », retrait en 2.0.0, mode « terse ») ; journal de Dart Sass, 1.79.0 ; Dart Sass 1.108.2 |
| `pages/sass/lecon-07.html#1` | produit nommé, INEXACT : les classes `.m-0` à `.m-5` ne sortent pas d'une boucle `@for` « depuis une seule variable », mais de l'API des utilitaires (`@each` sur `$utilities`, valeurs de `$spacers`) ; « millions de sites » sans source. La grille par `@for` est VRAIE (vérifiée sur 5.3.9) | remplacé par : Font Awesome Free 7.3.1, 2 001 classes par `@each` sur `$icons`, tailles par `@for` (pour ne pas raconter la grille de Bootstrap une cinquième fois ; `14` la racontait aussi) | Cas réel — les 2 001 icônes de Font Awesome Free 7.3 (2026) | https://github.com/FortAwesome/Font-Awesome/releases/tag/7.3.1 (publiée le 15 juillet 2026) ; `scss/_variables.scss`, `_icons.scss`, `_sizing.scss` lus dans le paquet npm et identiques à `raw.githubusercontent.com/FortAwesome/Font-Awesome/7.3.1/scss/…` ; Dart Sass 1.108.2 |
| `pages/sass/lecon-08.html#1` | sujet réel, foyer ailleurs — la naissance de BEM chez Yandex (foyer `css/lecon-14`) ; non revérifié | remplacé par : Sass 3.3.0 accepte un suffixe après `&` (`&-suffix`, `&_suffix`), ce qui permet `&__titre` | Cas réel — Sass 3.3 et le suffixe du sélecteur parent (2014) | https://github.com/sass/ruby-sass/blob/stable/doc-src/SASS_CHANGELOG.md (3.3.0, « Smaller Improvements ») ; https://sass-lang.com/ruby-sass/ (implémentation d'origine, fin de vie le 26 mars 2019) ; Dart Sass 1.108.2 |
| `pages/sass/lecon-09.html#1` | événement nommé, VRAI en substance (mode sombre, thèmes dimmed et contraste élevé, jetons Primer en variables CSS) mais non daté, et « il n'a pas réécrit ses feuilles de styles » sans source | corrigé sur son sujet, comme le demandait la consigne : dates du blog et du changelog de GitHub, et le mécanisme Sass réel de 2020-2021 (mixins de Primer Primitives 4.0.0 qui déclarent les variables, inclus par `base/modes.scss` de Primer CSS 16.0.0, `prefers-color-scheme` pour `auto`) ; le thème à contraste élevé (beta 28 juin, GA 25 août 2021, vus en résultat de recherche seulement) est retiré | Cas réel — les thèmes sombres de GitHub et Primer CSS (2021) | https://github.blog/news-insights/product-news/new-from-universe-2020-dark-mode-github-sponsors-for-companies-and-more/ (Shanku Niyogi, 8 décembre 2020) ; https://github.blog/changelog/2021-03-16-dimmed-theme-beta-for-github-com/ ; https://github.blog/changelog/2021-04-14-dark-and-dimmed-themes-are-now-generally-available/ ; https://unpkg.com/@primer/primitives@4.0.0/dist/scss/colors/_dark.scss (date npm : 3 novembre 2020) ; https://github.com/primer/css/blob/v16.0.0/src/base/modes.scss et https://github.com/primer/css/releases/tag/v16.0.0 (« Add color modes », 25 mars 2021) ; https://primer.style/foundations/primitives/getting-started (état actuel, non cité) ; https://github.blog/news-insights/product-news/accelerating-github-theme-creation-with-color-tooling/ (contexte, non cité) |
| `pages/sass/lecon-10.html#1` | produit nommé, VRAI en substance sur 5.3.8 et 5.3.9 (aucun module `sass:`, aucun `math.div()`, `divide()` sur 18 lignes) mais non daté ; « 330 avertissements avec Dart Sass 1.108.1 » non rejoué (retiré) | corrigé sur son sujet : recentré sur l'événement daté, Bootstrap 5.0.2 qui contourne la dépréciation de `/` (Dart Sass 1.33.0) par `divide()` pour garder LibSass ; état vérifié sur 5.3.9 | Cas réel — Bootstrap 5.0.2 contourne math.div() (2021) | https://blog.getbootstrap.com/2021/06/22/bootstrap-5-0-2/ (22 juin 2021, @mdo) ; https://github.com/sass/dart-sass/releases/tag/1.33.0 (21 mai 2021 UTC) ; https://sass-lang.com/documentation/breaking-changes/slash-div/ (`math.div()` depuis 1.33.0) ; https://github.com/twbs/bootstrap/blob/v5.3.9/scss/_functions.scss (identique au paquet npm) |
| `pages/sass/lecon-11.html#1` | produit nommé, VRAI (la map `$grid-breakpoints`, les mixins à `@content`) ; « 12 des 99 fichiers de son dossier `scss/` » se vérifie sur le **dépôt** de la 5.3.8 (99 fichiers, tests compris ; 92 dans le paquet) en comptant le fichier qui définit les mixins ; daté sur une version que 5.3.9 a remplacée | corrigé sur son sujet : version 5.3.9 et sa date, quatre mixins nommés, la liste des fichiers appelants au lieu du compte, l'essai `md: 800px` | Cas réel — les mixins de points de rupture de Bootstrap 5.3 (2026) | https://github.com/twbs/bootstrap/blob/v5.3.9/scss/mixins/_breakpoints.scss ; `scss/_variables.scss` (identique au paquet npm 5.3.9) ; https://blog.getbootstrap.com/ (5.3.9 le 11 novembre 2026) ; API GitHub (arbre du tag v5.3.8) ; Dart Sass 1.108.2 |
| `pages/sass/lecon-12.html#1` | produit nommé, VRAI (tout rejoué : `mergeColorMaps()`, `map.merge`, `.button.is-marque`, aucun `@error`) mais non daté | corrigé sur son sujet : daté (Bulma 1.0.4, 19 avril 2025), rejoué avec Dart Sass 1.108.2, faute de frappe montrée (`"e0245e"`) | Cas réel — les couleurs configurables de Bulma 1.0 (2025) | https://github.com/jgthms/bulma/blob/1.0.4/sass/utilities/functions.scss (identique au paquet npm) ; `sass/utilities/derived-variables.scss` ; https://github.com/jgthms/bulma/releases/tag/1.0.4 (par l'API) ; https://bulma.io/documentation/customize/with-sass/ |
| `pages/sass/lecon-13.html#1` | INEXACT : « la 5.3.8, sa dernière version stable » devenu faux (5.3.9) ; `sass-migrator` ne « crée » pas d'`index.scss` avec `@forward` (sa documentation : fichiers « import-only » avec `--remove-prefix`, membres transmis avec `--forward`) ; « compilation plus rapide » sans source | remplacé par : `@import` déprécié dans Dart Sass 1.80.0, ce que fait vraiment `sass-migrator module`, et le calendrier confirmé en 2026 | Cas réel — Dart Sass 1.80 déprécie @import (2024) | https://sass-lang.com/blog/import-is-deprecated/ (Jennifer Thakar, 17 octobre 2024) ; https://sass-lang.com/documentation/cli/migrator/ ; https://sass-lang.com/blog/the-road-to-dart-sass-2/ (Natalie Weizenbaum, 22 septembre 2026) ; https://github.com/sass/dart-sass/releases/tag/1.80.0 (par l'API) |
| `pages/sass/lecon-14.html#1` | INVÉRIFIABLE — usage général (« Primer, Lightning, Material partent tous d'une source de tokens unique », « équipes de centaines de personnes ») et INEXACT (« toute sa grille … avec des `@each` » : la grille de Bootstrap passe par `@for`) | remplacé par : Bootstrap 6 alpha, ses « token maps » (maps Sass de variables CSS), `@each`, `$radius`, `@use … with` | Cas réel — Bootstrap 6 range ses jetons dans des maps Sass (2026) | https://blog.getbootstrap.com/2026/10/08/bootstrap-6-alpha/ (8 octobre 2026, @mdo) |

## Décomptes

| | sass |
|---|---:|
| « Cas réel » lus | **14** |
| VRAI tel quel (et conforme) | 0 |
| VRAI sur le fond, mais non daté, daté sur une version dépassée, ou chargé d'affirmations sans source | 4 (`01`, `10`, `11`, `12`) |
| INEXACT (dont devenus faux) | 4 (`04`, `07`, `13`, `14` ; `04` et `13` devenus faux) |
| sujet réel, foyer ailleurs | 1 (`08`, BEM chez Yandex) |
| INVÉRIFIABLE | 5 (`02`, `03`, `05`, `06`, `09` en partie) |
| INVENTÉ | 0 |
| remplacés | **9** (`02`, `03`, `04`, `05`, `06`, `07`, `08`, `13`, `14`) |
| corrigés sur leur sujet | **5** (`01`, `09`, `10`, `11`, `12`) |
| renommés « Scénario » | 0 |
| hors de la règle, avant → après | 14 → 0 |

(`04` et `14` mêlaient un récit anonyme et des affirmations inexactes ; ils sont comptés INEXACT. `09` est
compté INVÉRIFIABLE pour son affirmation centrale, mais corrigé sur son sujet comme le demandait la consigne.)

## Contrôles (sur l'état commité `1558ae0`, avant le commit de ce rapport)

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=sass` | **0** (14 conformes sur 14) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b11-sass 01795b6` | **0 écart** (14 pages comparées) |
| `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b11-sass 01795b6` | **0** — OK : 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, signatures, copie propre |
| `node tools/cas-reels/lots/doublons.js` | 0 ; 2 sources partagées sur le site (les deux d'avant, hors `sass`) |
| `node tools/verif-fraicheur.js --cours=sass` | **0** |
| `node tools/verif.js --rapide` | voir ci-dessous |

`node tools/verif.js --rapide` (lancé **une fois**, à la fin, sur la machine partagée ; 726,1 s) : code **1**,
2 étapes signalées sur 54, toutes deux tolérées par la consigne :

- `donnees` : **I18** seul en erreur (`search-index.js` divergent du contenu regénéré, écart de +1 382 octets) —
  l'index de recherche est périmé par les 14 nouveaux textes ; l'orchestrateur le régénère après fusion. Les
  autres invariants sont OK (I17 et I19 : un avertissement chacun, déjà présents).
- `doc-rec` : 76 contrôles passés, 1 échec — « 1 169 citent la source » introuvable dans la page du cours `doc` :
  le nombre de leçons qui citent la source de leur « Cas réel » a bougé avec les 14 lignes de source de `sass`.
  Aucune ligne de source n'a été déformée pour le garder vert.

`doc-ref` est **OK**. Les 29 étapes du mode `--complet` n'ont pas été jouées (consigne : `--rapide` seulement ;
`--mutations` jamais lancé).

## Ce qui reste ouvert

- **Pour le registre `foyers.md`** (après fusion) : sujets pris par `sass` qu'un autre cours pourrait vouloir —
  Bootstrap 4 alpha et le passage de Less à Sass (2015) ; Bootstrap 5.0.2 et `divide()` (2021) ; Bootstrap 6
  alpha et ses token maps (2026) ; le guide CSS/Sass d'Airbnb (2015) ; le mixin `mq()` du Guardian (2013) ;
  le mode sombre de GitHub dans Primer CSS 16 (2020-2021) ; Font Awesome Free 7.3.1 (2026) ; la dépréciation
  de `@import` (Dart Sass 1.80, 2024) ; LibSass dépréciée (2020) puis en fin de vie (2025).
- **Hors des encadrés, non touché** (consigne : rien d'autre dans la leçon) : `lecon-01` montre encore
  `darken($primaire, 10%)` dans son premier exemple, une fonction dépréciée depuis Dart Sass 1.79.0 (ce que
  `lecon-06` explique désormais) ; `lecon-06` écrit « cette division sera retirée dans Dart Sass 2.0.0 », ce
  que confirme le billet du 22 septembre 2026 (Dart Sass 2 traitera `/` comme un séparateur), à garder à l'œil
  quand Dart Sass 2 sortira (attendu en décembre 2026). Les marques de fraîcheur de `lecon-10`, `-11`, `-13`
  et `-14` sont intactes.
- Les cas `10`, `11` et `12` s'appuient sur des versions vivantes (Bootstrap 5.3.9, Bulma 1.0.4, Dart Sass
  1.108.2) : chaque affirmation est datée par sa version, mais une prochaine version de Bootstrap 5.3.x ou de
  Bulma ne les rendra pas fausses (elles décrivent la version nommée).
- Le billet du Guardian est servi par un ancien gabarit du site (bas de page « © 2016 ») ; titre, auteur
  et date viennent de ses métadonnées (`article:published_time` = 2013-10-14). Le blog de Bootstrap ne signe
  ses billets que par l'identifiant `@mdo` : la ligne de source dit « billet signé @mdo », sans nom complet.
