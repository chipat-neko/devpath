# Rapport V18 — case B12, lot 9 : les cours `graphql` et `wasm` (copie `b12-graphql-wasm`, branche `v18/b12-graphql-wasm`)

Copie de travail `D:\test-claude-b12-graphql-wasm`, partie de `8c65449`. Part traitée : les **22 « Cas réel »**
des cours `graphql` (11, un par leçon) et `wasm` (11, un par leçon). Scripts et pièces dans
`scratchpad/b12-graphql-wasm/` (ignoré par git) : `dump.js` (les encadrés de chaque leçon), `optmots.js` (mots
d'options de QCM présents dans l'encadré seul, et ceux qu'un texte candidat ferait entrer), `cas/<cours>-<NN>.html`
(les 22 encadrés écrits), `appliquer.js` (remplace du titre de l'encadré à la fermeture de `div.callout__body` ;
refuse un titre absent ou multiple et un CR ; prouve que les octets hors de l'encadré sont identiques),
`add42.js` (rejoue les octets de Lin Clark), les pages téléchargées (`*.html`, `*.json`) et `ffcore.wasm`.

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **11 hors de la règle à 0** pour `graphql`
et de **11 à 0** pour `wasm` ; sur les 22 cas trouvés, **aucun n'était conforme ni gardable tel quel** ;
**13 remplacés** par un cas réel daté et sourcé sur la même notion, **9 gardés sur leur sujet et corrigés**,
**0 vérifié tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b12-graphql-wasm`) : `108d947` (graphql, 11 cas), `b82113b` (wasm, 11 cas), puis le commit
de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` à la fermeture de `div.callout__body`
  (type `note`, icône, structure gardés). Aucun intertitre `<h2>`/`<h3>` n'est collé au-dessus d'un des 22
  encadrés (vérifié sur le HTML qui précède chacun) : aucun touché.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; `&lt;` pour `<canvas>`.
- **Un sujet = un seul cours, et un seul cas** : chaque sujet cherché dans `foyers.md`, dans tout `pages/`
  (sujet et URL de la source), puis réservé dans `b12-reservations.txt` (22 lignes, relu après ajout : aucune
  collision avec les quatre autres agents). Deux sources envisagées étaient déjà prises et ont été écartées :
  « Evolving API Pagination at Slack » (`sql/lecon-03`) et « Photoshop's journey to the web » (`html/lecon-24`) ;
  SharedArrayBuffer et COOP/COEP sont racontés par `js/lecon-56`, d'où un autre sujet pour `wasm/lecon-09`.
  `doublons.js` : 3 sources partagées, les trois légitimes déjà connues (Debian 12, react.dev, Safari 15.4).
- **Consignes propres à cette part, tenues** : l'API GraphQL de GitHub était racontée cinq fois (02, 06, 07, 08,
  10) ; elle ne reste qu'en **06** (foyer : l'annonce de 2016, corrigée) et en **10** (un autre fait : la limite
  en points, documentation de 2026). Facebook revient en 01 (naissance de GraphQL, 2012), 03 (Relay présenté,
  février 2015) et 09 (DataLoader 1.0.0, septembre 2015) : trois faits datés distincts. `graphql/lecon-04`
  (Apollo Client, VRAI en B2) est gardé et précisé. Figma était raconté quatre fois en `wasm` (01, 05, 09, 11)
  et cité en 08 : il ne reste qu'en **05** (VRAI en B2), comme le demande la consigne. Squoosh, raconté trois
  fois (06, 09, 11), ne reste qu'en 06.
- **Comportements rejoués** : sous Node 26.13.1, un module assemblé à la main dont le corps est
  `20 00 41 2A 6A` rend `add42(1) = 43` (les octets de Lin Clark font bien « paramètre + 42 »), et un module vide
  (`\0asm` + version) est valide — d'où le retrait de « trois sections obligatoires » que l'article de 2017
  affirme ; `ffmpeg-core.wasm` de `@ffmpeg/core` 0.12.10, téléchargé depuis unpkg : **32 232 419 octets** (en-tête
  `0061736d01000000`) ; dans Python 3.14.5, `mimetypes.guess_type('a.wasm')` rend `application/wasm` et
  `SimpleHTTPRequestHandler.guess_type` retombe sur `mimetypes` puis sur `application/octet-stream`.
- **Dates prises aux registres** : npm (`dataloader` 1.0.0 le 2015-09-14 par `leebyron`, contributeurs Lee Byron,
  Daniel Schafer, Nicholas Schrock ; `@ffmpeg/ffmpeg` 0.1.0 le 2019-10-20, auteur Jerome Wu ; `@ffmpeg/core`
  0.12.10 le 2025-01-07 ; `@apollo/client` 4.3.8, dernière version, d'où « Apollo Client 4 »), API de GitHub
  (`rustwasm/book` créé le 2018-06-06 et archivé ; `wasm-bindgen/wasm-bindgen` non archivé ;
  `GoogleChromeLabs/squoosh` non archivé), notes de version `June2018` de `graphql-spec` (publiées le 2018-06-11).
- **Lexique** : chaque texte a été passé à `optmots.js` avant d'être posé. Mots d'options qui n'étaient QUE dans
  l'ancien encadré, gardés dans une phrase exacte : `automatiquement` (graphql/03), `simple` et `refaire` (04),
  `appels` (06), `possible` (07), `qu'une` (10), `compilé` (wasm/05), `calcul` (08), `emscripten`, `moteur` et
  `souvent` (wasm/11 : « le moteur peut compiler à l'avance » vient de la doc d'OpenCV.js ; « souvent » est dans
  la phrase de liaison, « un filtre lourd fige souvent l'interface s'il reste sur le fil principal »). Neuf mots
  qu'un premier jet faisait entrer ont été reformulés (`l'état`, `réponses`, `utiles`, `toujours` ×2,
  `l'introspection`, `fichiers`, `fonctionne`, `différents`, `dessus`, `l'exécution`). `lexique-diff` : **0 écart**.
- **Fraîcheur** : les marques des anciens encadrés (`graphql` 01, 02, 03, 05, 07, 08, 09, 11) disparaissent avec
  leurs phrases ; celle de `graphql/lecon-10` est gardée sur la phrase des 5 000 points (relue à la source le
  18/11, date d'arrêt inchangée). `tools/fraicheur/releves/graphql-lot-2026-11-11.json` garde donc des ancres
  d'anciens encadrés (phase E, non touché). `verif-fraicheur --cours=graphql` et `--cours=wasm` : 0.

## Les 22 cas

### `graphql`

| Cas | État trouvé (nature) | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/graphql/lecon-01.html#1` | VRAI pour l'essentiel, détails non sourcés (événement daté) : les « tonnes de champs inutiles » ne sont pas dans la source ; liste des utilisateurs actuels (GitHub, Shopify, Netflix, Starbucks) hors de toute source citée | corrigé : récit refait sur le billet de 2015 (apps iOS et Android « minces enveloppes » du site mobile, fil d'actualité en HTML, REST et FQL évalués, allers-retours, centaines de milliards d'appels par jour, ouverture) | Cas réel — Facebook invente GraphQL pour ses applications mobiles (2012) | https://engineering.fb.com/2015/09/14/core-infra/graphql-a-data-query-language/ |
| `pages/graphql/lecon-02.html#1` | vraisemblablement VRAI (produit nommé : introspection de GitHub, explorateur retiré en novembre 2025 selon le relevé de fraîcheur), non revérifié ligne à ligne | remplacé (consigne : GitHub raconté cinq fois) par : le langage de définition des types entre dans l'édition de juin 2018 de la spécification, « source de vérité », validation du schéma, fin du « Draft RFC » | Cas réel — le langage des schémas entre dans la spécification GraphQL (2018) | https://github.com/graphql/graphql-spec/releases/tag/June2018 (et l'API `releases/tags/June2018`) |
| `pages/graphql/lecon-03.html#1` | INVÉRIFIABLE (usage général d'Apollo et Relay, sans date ni source ; l'exemple `name`/`avatarUrl`/`role` est inventé pour l'illustration) | remplacé par : Greg Hurrell présente Relay et GraphQL, colocation des requêtes avec les composants | Cas réel — Relay colle les requêtes aux composants (2015) | https://legacy.reactjs.org/blog/2015/02/20/introducing-relay-and-graphql.html |
| `pages/graphql/lecon-04.html#1` | VRAI (B2 ; produit nommé), mais sans date ni source, et « sans recharger la page » non dit | gardé, corrigé : clé `__typename` + `id` (`Todo:5`), champs remplacés « sans requête réseau de suivi », interface optimiste et retour arrière, limite des listes, bonne pratique ; l'exemple `likePost` est présenté comme exemple | Cas réel — Apollo Client met son cache à jour après une mutation (doc. 2026) | https://www.apollographql.com/docs/react/data/mutations ; https://www.apollographql.com/docs/react/performance/optimistic-ui ; https://www.apollographql.com/docs/react/caching/overview ; https://www.apollographql.com/docs/react (Apollo Client 4.x) ; registre npm `@apollo/client` |
| `pages/graphql/lecon-05.html#1` | INVÉRIFIABLE (récit anonyme : « une page de blog », 30 requêtes, charge « multipliée par 30 ») | remplacé par : Shopify, le problème N+1 des résolveurs et GraphQL Batch (exemple des 50 auteurs : 51 allers-retours, puis 2) | Cas réel — Shopify regroupe ses résolveurs avec GraphQL Batch (2018) | https://shopify.engineering/solving-the-n-1-problem-for-graphql-through-batching |
| `pages/graphql/lecon-06.html#1` | INEXACT (événement daté, FOYER) : « publié son API v4 entièrement en GraphQL » (c'était l'annonce d'un accès anticipé) ; « tableaux de bord », l'exemple dépôt → issues → auteurs et « Shopify, Netflix ou Meta ont fait des choix similaires » absents de la source | corrigé : accès anticipé, REST à plus de 60 % des requêtes vers les bases, deux ou trois appels pour une vue complète, trop de données sans celles qu'il faut, typage des paramètres | Cas réel — GitHub ouvre son API en GraphQL (2016) | https://github.blog/developer-skills/github/the-github-graphql-api/ |
| `pages/graphql/lecon-07.html#1` | INVÉRIFIABLE (produit nommé, usage non documenté : un fragment `on Repository` « réutilisé dans la recherche, le profil et les listes » ; requêtes persistées « souvent » en production, sans source) | remplacé par : Apollo, requêtes persistées automatiques (plus de 10 Ko de texte, empreinte, registre, renvoi du texte complet) ; lien aux variables : un texte qui change donne une autre empreinte SHA-256 | Cas réel — Apollo envoie une empreinte au lieu de la requête (2017) | https://www.apollographql.com/blog/improve-graphql-performance-with-automatic-persisted-queries ; https://www.apollographql.com/docs/apollo-server/performance/apq |
| `pages/graphql/lecon-08.html#1` | VRAI dans les grandes lignes (connexions de Relay, `edges`/`node`/`pageInfo` chez GitHub et Shopify), sans date ni source ; « 10 000 dépôts » illustratif | remplacé (GitHub raconté cinq fois) par : Shopify abandonne la pagination par numéro de page (2 500 lus pour 100 gardés, 2 221,60 ms contre 5,24 ms, environ 11 fois plus rapide, fin en juillet 2020) | Cas réel — Shopify passe du numéro de page au curseur (2019) | https://shopify.engineering/pagination-relative-cursors |
| `pages/graphql/lecon-09.html#1` | INEXACT (produit nommé) : DataLoader présenté comme « écrit par Lee Byron », alors que le README en fait le port de l'API Loader de Nick Schrock (2010) ; « milliards de requêtes », « des milliers de lectures unitaires » et « la première optimisation qu'on ajoute à tout serveur » sans source | corrigé : npm 1.0.0 du 14/09/2015, dépôt `facebook/dataloader`, Loader (2010), framework Ent, un tour de boucle, une instance par requête, portages | Cas réel — Facebook publie DataLoader (2015) | https://github.com/graphql/dataloader ; https://registry.npmjs.org/dataloader |
| `pages/graphql/lecon-10.html#1` | INEXACT (produit nommé) : « une requête qui pagine 100 objets contenant chacun 100 sous-objets coûte bien plus qu'une requête simple » est faux selon la formule de GitHub (1 + 100 = 101 requêtes, /100, arrondi : 1 point, comme un appel minimal) | corrigé : l'exemple de la documentation (100 dépôts × 50 tickets × 60 étiquettes = 5 101 → 51 points), minimum 1 point, `first`/`last` de 1 à 100, 500 000 nœuds, la limite contre les abus et le déni de service | Cas réel — GitHub compte en points, pas en requêtes (doc. 2026) | https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api |
| `pages/graphql/lecon-11.html#1` | INVÉRIFIABLE en l'état (produit nommé, affirmations générales : « chaque brique de cette checklist est activée », « autorisation fine par champ selon les permissions de l'app », « erreurs typées ») ; « des millions de marchands » vérifié en phase E | remplacé par : les limites documentées de l'API GraphQL de GitLab (100 nœuds par page, complexité 200/250, 10 000 caractères, 30 s, jetons ou cookie, dépréciation sur six versions) | Cas réel — les garde-fous de l'API GraphQL de GitLab (doc. 2026) | https://docs.gitlab.com/api/graphql/ |

### `wasm`

| Cas | État trouvé (nature) | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/wasm/lecon-01.html#1` | VRAI sur Figma (C++ → Wasm), mais « des milliers de calques restent fluides » et « Google Earth, AutoCAD Web, Photoshop en ligne » sans source ; Figma raconté quatre fois | remplacé par : WebAssembly devient Recommandation du W3C, « quatrième langage du Web » après HTML, CSS et JavaScript | Cas réel — WebAssembly devient une Recommandation du W3C (2019) | https://www.w3.org/press-releases/2019/wasm/ |
| `pages/wasm/lecon-02.html#1` | VRAI pour l'essentiel (produit nommé, sans date ni source) ; « plusieurs mégaoctets » confirmé (32 Mo mesurés) ; « coûts d'hébergement » non dit | corrigé : première version npm (20/10/2019, Jerome Wu), Emscripten 3.1.40 et FFmpeg n5.1.4, données qui restent dans le navigateur, cœur téléchargé d'un CDN et lancé dans un worker, 32 232 419 octets en 0.12.10 | Cas réel — FFmpeg compilé en Wasm avec Emscripten (2019) | https://github.com/ffmpegwasm/ffmpeg.wasm ; https://ffmpegwasm.netlify.app/docs/overview ; https://registry.npmjs.org/@ffmpeg/ffmpeg ; https://registry.npmjs.org/@ffmpeg/core ; https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm |
| `pages/wasm/lecon-03.html#1` | INVÉRIFIABLE (récit anonyme : « l'hébergeur servait le .wasm en application/octet-stream ») | remplacé par : le bogue bpo-34758 de `http.server` (Python), corrigé dans `mimetypes` et livré dès Python 3.8.0 alpha 1 | Cas réel — le serveur de Python et le type MIME du .wasm (2018) | https://bugs.python.org/issue34758 ; https://docs.python.org/3.8/whatsnew/changelog.html (entrée bpo-34758 sous « Python 3.8.0 alpha 1 », 2019-02-03) |
| `pages/wasm/lecon-04.html#1` | INVÉRIFIABLE (illustration générale : « un filtre d'image ») | remplacé par : Surma compile libwebp et copie l'image dans la mémoire du module (`create_buffer`, `HEAP8.set`, vue `Uint8Array`, vue contre copie) | Cas réel — Surma copie une image dans la mémoire de libwebp (2018) | https://web.dev/articles/emscripting-a-c-library |
| `pages/wasm/lecon-05.html#1` | VRAI (B2, produit nommé ; FOYER), mais « la fluidité d'un logiciel de bureau » et « des milliers de vecteurs, le zoom instantané » sans source, et sans date | gardé, corrigé : passage à WebAssembly le 8 juin 2017 (chargement amélioré de plus de 3 fois, mesure décrite), limites de Chrome à l'époque, architecture C++/JavaScript, Emscripten en 2025 | Cas réel — Figma passe à WebAssembly (2017) | https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/ ; https://madebyevan.com/figma/ ; https://www.figma.com/blog/figma-rendering-powered-by-webgpu/ |
| `pages/wasm/lecon-06.html#1` | VRAI pour l'essentiel (produit nommé, sans date) ; « C/C++ » et « tu déplaces un curseur, l'image est ré-encodée à la volée » non trouvés dans une source primaire | corrigé : Chrome Dev Summit 2018, compression locale (README), v2 de décembre 2020 (OxiPNG, MozJPEG, WebP, AVIF par WebAssembly), Squoosh CLI au passé | Cas réel — Squoosh, des codecs d'image en WebAssembly (2018) | https://web.dev/blog/squoosh-v2 ; https://github.com/GoogleChromeLabs/squoosh |
| `pages/wasm/lecon-07.html#1` | INVÉRIFIABLE (récit anonyme : « une équipe… le binaire fond de moitié ») | remplacé par : Lin Clark dissèque `add42` (octets, texte, machine à pile, sections) ; « trois sections obligatoires » de l'article non repris (un module vide est valide, rejoué sous Node) | Cas réel — Lin Clark dissèque un module WebAssembly (2017) | https://hacks.mozilla.org/2017/02/creating-and-working-with-webassembly-modules/ |
| `pages/wasm/lecon-08.html#1` | VRAI sur le tutoriel, INEXACT sur la fin : « Figma ou le terminal web xterm.js + Wasm reposent sur la même répartition » sans source ; présent devenu faux (le livre n'est plus maintenu) | corrigé : `Universe`, `tick` exposé par `#[wasm_bindgen]`, copies limitées, pointeur et vue `Uint8Array`, `<canvas>` ; livre archivé, groupe de travail archivé en 2024, organisation rustwasm en septembre 2025, wasm-bindgen dans sa propre organisation | Cas réel — le jeu de la vie du livre « Rust and WebAssembly » (2018) | https://rustwasm.github.io/docs/book/game-of-life/implementing.html ; https://rustwasm.github.io/docs/book/game-of-life/introduction.html ; https://rustwasm.github.io/docs/book/ ; https://blog.rust-lang.org/inside-rust/2025/07/21/sunsetting-the-rustwasm-github-org ; API GitHub `rustwasm/book`, `wasm-bindgen/wasm-bindgen` |
| `pages/wasm/lecon-09.html#1` | INVÉRIFIABLE (produits nommés, affirmations sans source : Figma « s'appuie massivement sur workers et threads… sans jamais figer le pointeur ») ; Figma et Squoosh déjà racontés ailleurs | remplacé par : eBay, lecteur de codes-barres en Wasm dans des workers mis en course (20 %, 60 %, près de 80 %, près de 100 %) | Cas réel — eBay lit les codes-barres avec Wasm dans des workers (2019) | https://innovation.ebayinc.com/stories/webassembly-at-ebay-a-real-world-use-case/ |
| `pages/wasm/lecon-10.html#1` | INVÉRIFIABLE en l'état (liste de sept produits nommés — Envoy, Shopify Functions, Fastly Compute@Edge, Docker, SingleStore, Zellij — sans date ni source, non vérifiés un à un) | remplacé par : Lin Clark présente WASI (compiler une fois, bac à sable, sécurité par capacités, `wasi-core`, wasmtime, Lucet, polyfill) | Cas réel — Mozilla présente WASI (2019) | https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/ |
| `pages/wasm/lecon-11.html#1` | INVÉRIFIABLE en l'état (liste : Figma, Photoshop web, Google Earth, Squoosh « font tous exactement cela… souvent dans un Worker ») ; Figma et Squoosh déjà racontés | remplacé par : OpenCV.js (Emscripten vers asm.js ou WebAssembly, UCI et Intel, Google Summer of Code 2017) | Cas réel — OpenCV.js, la vision par ordinateur dans le navigateur (2017) | https://docs.opencv.org/4.x/df/d0a/tutorial_js_intro.html (lu par curl : WebFetch reçoit un 403) |

## Décomptes

| Cours | Cas | Remplacés | Corrigés (sujet gardé) | Vérifiés tels quels | « Scénario » |
|---|---:|---:|---:|---:|---:|
| `graphql` | 11 | 6 (02, 03, 05, 07, 08, 11) | 5 (01, 04, 06, 09, 10) | 0 | 0 |
| `wasm` | 11 | 7 (01, 03, 04, 07, 09, 10, 11) | 4 (02, 05, 06, 08) | 0 | 0 |
| **total** | **22** | **13** | **9** | **0** | **0** |

États trouvés : VRAI ou VRAI pour l'essentiel 8 (`graphql` 01, 02, 04, 08 ; `wasm` 01, 02, 05, 06 ; dont 2 jugés
VRAI en B2), INEXACT 4 (`graphql` 06, 09, 10 ; `wasm` 08), INVÉRIFIABLE 10 (`graphql` 03, 05, 07, 11 ; `wasm` 03,
04, 07, 09, 10, 11), INVENTÉ 0 (aucun ne se déclarait fictif ; les exemples sans sujet de `graphql/05` et
`wasm/03`, `04`, `07` sont comptés INVÉRIFIABLE).

Sources : toutes primaires (blogs d'ingénierie de Facebook/Meta, GitHub, Shopify, Apollo, Figma, eBay, Mozilla ;
documentations officielles de GitHub, GitLab, Apollo, OpenCV, ffmpeg.wasm ; notes de version de la spécification
GraphQL ; communiqué du W3C ; ticket et journal des changements de CPython ; registres npm et API GitHub). Aucune
source de presse.

## Contrôles (sur la branche, avant le commit de ce rapport)

- `node tools/verif-contenu.js --cas-reel --cours=graphql` → **0** (11 conformes sur 11) ;
- `node tools/verif-contenu.js --cas-reel --cours=wasm` → **0** (11 conformes sur 11) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b12-graphql-wasm 8c65449` → **0 écart** (22 pages) ;
- `node tools/verif-fraicheur.js --cours=graphql` → 0, `--cours=wasm` → 0 ;
- 0 CR dans les 22 pages (contrôle node) ;
- `node tools/verif.js --rapide` → **code 1**, 54 étapes jouées en 310,8 s, **4 signalées, toutes attendues** :
  `donnees` (seul l'invariant **I18** : `search-index.js` périmé, +2 844 octets ; les autres invariants OK),
  `doc-ref` (la page du cours `doc` cite 129 leçons renvoyant à un document et 46 cours : les nouvelles lignes
  de source les font bouger), `doc-rec` (« 1 433 citent la source » : idem) et `normatf` (« 47 leçons parlant de
  la spécification » : les mots « spécification » de `graphql/01`, `02` et `wasm/01`, tolérés par la consigne).
  Toutes les autres étapes OK, dont `qcmbiai`, `qcmlexi`, `fraich`, `contenu` et `source`. L'orchestrateur
  régénère index et compteurs après la fusion ; aucune ligne de source n'a été déformée pour les garder verts.

## Ce qui reste ouvert

- **Registre des foyers** (à faire par l'orchestrateur après la fusion) : le foyer « Figma et WebAssembly (2017) »
  passe de `wasm/lecon-01` à **`wasm/lecon-05`** (consigne de ce lot) ; plus aucun autre cas ne raconte Figma
  en `wasm`. Sujets pris par ce lot qu'un autre cours pourrait vouloir : naissance de GraphQL chez Facebook
  (`graphql/01`), édition June 2018 de la spécification (`graphql/02`), Relay 2015 (`graphql/03`), GraphQL Batch
  (`graphql/05`), annonce de l'API GraphQL de GitHub 2016 (`graphql/06`, foyer), APQ d'Apollo (`graphql/07`),
  curseurs relatifs de Shopify (`graphql/08`), DataLoader (`graphql/09`), WebAssembly Recommandation du W3C
  (`wasm/01`), ffmpeg.wasm (`wasm/02`), bpo-34758 (`wasm/03`), Surma et libwebp (`wasm/04`), Squoosh (`wasm/06`),
  Lin Clark 2017 (`wasm/07`), livre Rust and WebAssembly (`wasm/08`), eBay et ses codes-barres (`wasm/09`), WASI
  (`wasm/10`), OpenCV.js (`wasm/11`).
- **Fraîcheur (phase E)** : `tools/fraicheur/releves/graphql-lot-2026-11-11.json` garde huit ancres d'anciens
  encadrés de `graphql` (une chacun : 01, 02, 03, 05, 07, 08, 09, 11) et l'ancre de 10 a changé de texte
  (« un compte dispose de… » → « un utilisateur dispose de… »).
- **Doutes** : `wasm/lecon-03` affirme que `http.server` cherche ses types dans `mimetypes` — vrai dans le code de
  Python 3.14.5 lu ici (repli sur `mimetypes.guess_file_type`), et la page de bpo-34758 le dit implicitement (le
  correctif est dans `mimetypes`), mais la phrase n'est pas citée telle quelle. `wasm/lecon-07` : la page de Lin
  Clark dit « trois sections obligatoires » ; le cas ne le reprend pas (un module vide est valide). `wasm/lecon-02` :
  la taille de 32 Mo est une mesure de ce lot sur le paquet npm, pas une phrase de la documentation.
  `graphql/lecon-04` : l'exemple `likePost` vient de l'ancien encadré ; la documentation d'Apollo prend `Todo` et
  `Comment` — il est présenté comme un exemple, pas comme un fait.
- **Hors encadré, signalé** : rien relevé dans ces deux cours.

## Consignes de fusion

- Fusionner `v18/b12-graphql-wasm` (trois commits) ; seuls changent `pages/graphql/lecon-01` à `11`,
  `pages/wasm/lecon-01` à `11` et ce rapport.
- Puis régénérer les pages dérivées et index (`search-index`, `etude-recherche`…) jusqu'au point fixe, et les
  compteurs du cours `doc` (`doc-ref`, `doc-rec`) que les nouvelles lignes de source font bouger ; mettre à jour
  `foyers.md` (Figma → `wasm/lecon-05`, et les sujets listés plus haut).
