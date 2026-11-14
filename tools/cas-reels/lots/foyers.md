# Foyers des « Cas réel » — un sujet, un seul cours

Registre tenu par l'orchestrateur des lots du CHANTIER-V18 (créé au B4, 2026-11-14). Un
**foyer** est le cours, et la leçon, qui garde un sujet. Tout autre cours qui le raconte le
remplace par un autre vrai cas sur la même notion. Le foyer est la leçon dont la **notion** est
la plus proche du sujet (le ReDoS de Cloudflare va au cours `regex`, pas à `python` ; Ariane 5 va
à `ada`), à défaut le premier cas vérifié et sourcé.

**Avant d'écrire un cas** : chercher son sujet ici, puis dans tout `pages/` (`grep -ril`), puis
lancer `node tools/cas-reels/lots/doublons.js`. **Après une fusion** : ajouter ici les sujets
célèbres que le lot a pris (ceux qu'un autre cours pourrait vouloir).

| Sujet | Foyer | À remplacer ailleurs (lot qui s'en charge) |
|---|---|---|
| Ariane 5, vol 501 (1996) | `ada/lecon-07` | `ada/lecon-09` (B9), `tests/lecon-01` (B11) ; mentions dans `c/lecon-02`, `rust/lecon-02` à relire |
| Patriot de Dhahran (1991) | `fortran/lecon-02` ou `asm/lecon-09` (à trancher en B7) | l'autre des deux |
| Therac-25 (1985-1987) | `os/lecon-07` | — |
| GitLab, suppression de la base (2017) | `iac/lecon-05` | `bash/lecon-03`, `bash/lecon-12` (B7) |
| Cloudflare, ReDoS (2019) | `regex/lecon-06` | mention dans `algo/lecon-18` à relire (B10) |
| Stack Overflow, regex (2016) | `regex/lecon-09` | — |
| TalkTalk, injection SQL (2015) | `securite/lecon-03` | `offensive/lecon-04` si c'est le même récit (B12) |
| Ver Samy sur MySpace (2005) | `securite/lecon-04` | `offensive/lecon-05` si c'est le même récit (B12) |
| Portefeuille Parity (2017) | `solidity/lecon-16` | `solidity/lecon-03`, `solidity/lecon-11` (B12) |
| Clé d'accès d'Uber (2016) | `iac/lecon-10` | mentions dans `offensive/lecon-09`, `crypto/lecon-09` à relire |
| Netflix et Hystrix | `archi/lecon-10` | — |
| GTA Online, chargement (2021) | `algo/lecon-01` | — |
| Figma et WebAssembly (2017) | `wasm/lecon-01` | `wasm/lecon-05`, `wasm/lecon-09` (B12) |
| Tony Hoare et la référence nulle (2009) | `csharp/lecon-08` | `typescript/lecon-02` (B5), `c/lecon-05` (B7), `rust/lecon-04`, `dart/lecon-02` (B6), `swift/lecon-02` (B9), `scala/lecon-08` (B10), `ocaml/lecon-06` (B8), `fsharp/lecon-06` (B12) |
| Knight Capital (2012) | `tests/lecon-14` | — |
| Facebook disparaît d'Internet (4 octobre 2021) | `observabilite/lecon-06` | `reseaux/lecon-04` (B11) |
| Azure et le 29 février (2012) | `python/lecon-17` | — |
| Les gènes renommés par Excel (2016) | `python/lecon-02` | — |
| « goto fail » d'Apple (2014) | `csharp/lecon-03` | — |
| Tests de non-régression de SQLite | `csharp/lecon-19` | — |
| Coupons de CRMEB (2024) | `php/lecon-16` | — |
| PEP 343, l'instruction `with` (2005) | `python/lecon-34` | — |
| Reinhart et Rogoff, l'erreur de tableur (2013) | `python/lecon-22` | — |
| Minuit valait `False` en Python (2012) | `python/lecon-38` | — |
| IntersectionObserver | `js/lecon-62` | — |
| `prefers-reduced-motion` chez WebKit (2017) | `css/lecon-12` | — |
| Robles contre Domino's (2019) | `html/lecon-32` | — |
| La course des requêtes (doc de React, 2023) | `react/lecon-10` | — |
| Les événements de React 17 (2020) | `react/lecon-07` | — |
| Pourquoi React est né (2013) | `react/lecon-01` | — |

Sources PARTAGÉES légitimes (même document, sujets différents) : les notes de Safari 15.4
(`html/lecon-27` : `<dialog>` ; `js/lecon-64` : BroadcastChannel) ; le billet de lancement de
react.dev (2023), qui date trois documentations différentes (`js/lecon-04`, `js/lecon-29`,
`react/lecon-10`).

**À trancher en B13** : `js/lecon-04` (le « 0 » qu'affiche React, doc de react.dev) et
`react/lecon-05` (le « 0 » livré en production chez PayPal) racontent le même piège par deux
sources différentes ; le foyer naturel est `react/lecon-05`.

## Pris par la passe de dédoublonnage du lot 1 (2026-11-14)

Chacun de ces sujets a remplacé un doublon ; son foyer est la leçon indiquée.

| Sujet | Foyer |
|---|---|
| Exchange Server et le bogue du 1er janvier 2022 (FIP-FS, « Y2K22 ») | `sql/lecon-21` |
| SQLite 3.37.0 et les tables STRICT (2021) | `sql/lecon-04` |
| Coinbase, l'ordre de vente accepté sans contrôle du compte source (2022) | `react/lecon-23` |
| MOVEit Transfer, l'injection SQL exploitée par CL0P (2023) | `sql/lecon-14` |
| Maggie Pint et les défauts de Date, avant Temporal (2017) | `js/lecon-15` |
| Bentkowski, le copier-coller qui injecte du HTML dans les éditeurs (2020) | `html/lecon-45` |
| JPMorgan Chase, le modèle de VaR tenu dans des feuilles Excel copiées à la main (2012, rapport du 16 janvier 2013) | `sql/lecon-24` |
| L'audit d'accessibilité de l'éditeur Gutenberg de WordPress (WPCampus et Tenon, 2019) | `react/lecon-24` |
| Drupalgeddon, l'injection SQL dans l'API de base de données de Drupal 7 (SA-CORE-2014-005, 2014) | `php/lecon-07` |
| PHP 8.4 et la visibilité asymétrique, public private(set) (RFC 2024) | `php/lecon-08` |
| PHP retire le modificateur /e de preg_replace (RFC 2012, PHP 5.5 et 7.0) | `php/lecon-17` |
| Les Samoa sautent le 30 décembre 2011 (base des fuseaux IANA, Pacific/Apia) | `php/lecon-18` |
| Cloudflare et la panne de Workers KV due à son fournisseur de stockage (12 juin 2025) | `php/lecon-20` |
| Ruby 2.6 et l'option exception: false de Integer() (Feature #12732, 2018) | `ruby/lecon-02` |
| RSpec 3 renomme be_true en be_truthy (2014) | `ruby/lecon-03` |
| Rails et le return dans un bloc de transaction (Rails 6.1 puis 7.0, 2020-2021) | `ruby/lecon-06` |
| GitHub publie Scientist pour réécrire sans régression (2016) | `ruby/lecon-14` |
| La porte dérobée du noyau Linux, = au lieu de == dans wait4 (2003) | `python/lecon-04` |
| La PEP 282 et le module logging de Python (2002, Python 2.3) | `python/lecon-19` |
| CVE-2020-10735, la conversion int/str quadratique de CPython (2022) | `python/lecon-39` |
| Python 3.11 ajoute groupes atomiques et quantificateurs possessifs à re (2022) | `python/lecon-41` |
| Boeing 787, le compteur des GCU qui déborde après 248 jours (FAA, 2015) | `java/lecon-02` |
| JEP 150 / JSR 310, java.time remplace Date et Calendar (JDK 8, 2014) | `java/lecon-13` |
| GitHub, la condition de course qui mélangeait des sessions (2021) | `java/lecon-15` |
| .NET Core 3.0 rend visible l'imprécision des double (formatage IEEE, 2019) | `csharp/lecon-02` |
| .NET 2.0 cesse d'avaler les exceptions non gérées des threads (2005) | `csharp/lecon-09` |
| coverage.py 7.6.9, une liste remplacée par un set (730 s -> 13 s, 2024) | `csharp/lecon-10` |
| Toyota T-Connect, la clé d'accès publiée sur GitHub (2017-2022) | `csharp/lecon-22` |
| Motion (ex-Framer Motion) : useReducedMotion (2019) puis l'option reducedMotion de MotionConfig (2022) | `react/lecon-25` |
| jQuery déprécie .live(), la délégation posée sur document (jQuery 1.7, 2011) | `js/lecon-11` |
| L'option cause des erreurs JavaScript (V8 9.3, 2021 ; ES2022) | `js/lecon-25` |
| Le moteur d'expressions régulières linéaire de V8 (2021) | `js/lecon-27` |
| Rich Harris, « Virtual DOM is pure overhead » (Svelte, 2018) | `js/lecon-35` |
| John Hann et le debounce des requêtes XHR (2009) | `js/lecon-36` |
| Le composant dark-mode-toggle de Google et localStorage (2019) | `js/lecon-42` |
| La bibliothèque source-map en Rust/WebAssembly, et la réponse de V. Egorov en JavaScript (2018) | `js/lecon-60` |
| Chrome retire les événements de mutation au profit de MutationObserver (2023-2024) | `html/lecon-40` |
