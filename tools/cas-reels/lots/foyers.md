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

## Pris par le lot 2 (B5, 2026-11-14)

La DERNIÈRE réservation de chaque cas (un agent qui change de sujet ajoute une ligne).

| Sujet | Foyer |
|---|---|
| Le Répertoire électoral unique de l'Insee remplace 35 500 listes indépendantes (loi 2016, en service 2019) | `bdd/lecon-01#1` |
| W3C, Richard Ishida, « Personal names around the world » : découper ou non l'attribut nom (2011) | `bdd/lecon-02#1` |
| GitHub accepte plusieurs auteurs par commit, trailers Co-authored-by (Joel Califa, 29 janvier 2018) | `bdd/lecon-03#1` |
| Peter Chen, « The Entity-Relationship Model — Toward a Unified View of Data » (ACM TODS, mars 1976) | `bdd/lecon-04#1` |
| Le numéro de Sécurité sociale 078-05-1120 des portefeuilles vendus par Woolworth (1938) | `bdd/lecon-05#1` |
| Django rend on_delete obligatoire (ticket 21127 de Carl Meyer 2013 ; Django 1.9 en 2015, 2.0 en 2017) | `bdd/lecon-06#1` |
| MySQL analysait et ignorait CHECK jusqu'à la 8.0.16 (ticket n° 3464 de 2004, version du 25 avril 2019) | `bdd/lecon-07#1` |
| Les champs à valeurs multiples d'Access 2007 contre la 1NF (Mark Whitehorn, The Register, 18 juillet 2006) | `bdd/lecon-08#1` |
| William Kent, « A Simple Guide to Five Normal Forms in Relational Database Theory » (CACM, février 1983) | `bdd/lecon-09#1` |
| Facebook TAO (USENIX ATC 2013) : compteurs d'associations en table à part, liens inverses réparés par tâche asynchrone | `bdd/lecon-10#1` |
| Uber, Evan Klitzke, « Why Uber Engineering Switched from Postgres to MySQL » : l'amplification d'écriture des index (26 juillet 2016) | `bdd/lecon-11#1` |
| (déplace ma ligne bdd/lecon-11 « Instagram » sur la leçon 12 ; la leçon 11 prendra un autre sujet) Instagram, « Handling Growth with Postgres » : EXPLAIN ANALYZE avant et après un index partiel (17 janvier 2013) | `bdd/lecon-12#1` |
| Jepsen, analyse de PostgreSQL 12.3 : REPEATABLE READ = isolation par instantané, SERIALIZABLE pris en défaut (Kyle Kingsbury, 12 juin 2020) | `bdd/lecon-13#1` |
| PostgreSQL 11 ajoute une colonne avec DEFAULT sans réécrire la table (18 octobre 2018) ; doc d'ALTER TABLE de la v10 | `bdd/lecon-14#1` |
| Sarah Mei, « Why You Should Never Use MongoDB » : Diaspora passe de MongoDB à MySQL (11 novembre 2013) | `bdd/lecon-15#1` |
| Linus Torvalds renonce à BitKeeper (« Kernel SCM saga.. », 6 avril 2005) et premier commit de Git le 7 avril 2005 | `git/lecon-01#1` |
| Git 1.5.0 fait de git add l'outil de l'index, « staging area », et ajoute git add -i (2007) | `git/lecon-02#1` |
| Premier commit du noyau Linux sous Git, Linux-2.6.12-rc2, sans l'historique de 3,2 Go (16 avril 2005) | `git/lecon-03#1` |
| GitHub nomme main la branche par défaut des nouveaux dépôts (1er octobre 2020) ; Git 2.28 et init.defaultBranch | `git/lecon-04#1` |
| GitHub ajoute « Squash and merge » (1er avril 2016) et « Rebase and merge » (26 septembre 2016) ; le bouton par défaut fusionne en --no-ff | `git/lecon-05#1` |
| GitLab, « How we solved GitLab's CHANGELOG conflict crisis » (Robert Speicher, 2018) | `git/lecon-06#1` |
| Meli, McNiece et Reaves, « How Bad Can It Git? » (NDSS 2019) : secrets retirés par un nouveau commit, historique jamais réécrit | `git/lecon-07#1` |
| GitHub refuse le mot de passe du compte pour Git à partir du 13 août 2021 (billet du 15 décembre 2020) | `git/lecon-08#1` |
| REMPLACE ma ligne « GitHub Pages (2008) » (sujet déjà raconté par ruby/lecon-22, libéré) : GitHub rend gratuits les dépôts privés illimités (Nat Friedman, 7 janvier 2019) | `git/lecon-09#1` |
| Bacchelli et Bird (Microsoft Research), « Expectations, Outcomes, and Challenges of Modern Code Review » (ICSE 2013) | `git/lecon-10#1` |
| Hacktoberfest 2020 : PR indésirables, passage à l'opt-in des dépôts (DigitalOcean, DEV) | `git/lecon-11#1` |
| Documentation du noyau Linux « Rebasing and merging » (Jonathan Corbet, 2019) | `git/lecon-12#1` |
| Christian Couder, « Fighting regressions with git bisect » (Linux-Kongress 2009), témoignage d'Ingo Molnar | `git/lecon-13#1` |
| GitHub active la push protection par défaut sur les dépôts publics (29 février 2024) | `git/lecon-14#1` |
| Vicent Martí, « Counting Objects » : les forks de GitHub partagent leurs objets (network.git, alternates) (2015) | `git/lecon-15#1` |
| Git 2.5 introduit git worktree (billet de Michael Haggerty, 29 juillet 2015) | `git/lecon-16#1` |
| Jenkins : 186 dépôts rembobinés par un push forcé (10 novembre 2013, rapport de Kohsuke Kawaguchi) | `git/lecon-17#1` |
| Shopify ramène le p95 de la CI de son monolithe de 45 à 18 minutes (Christian Bruckmayer, 2021) | `git/lecon-18#1` |
| Git 2.24 déconseille git filter-branch au profit de git filter-repo (2019) | `git/lecon-19#1` |
| Les règles des noyaux Linux -stable (Greg KH, 2005) : correctif d'abord dans mainline, « commit <sha1> upstream » | `git/lecon-20#1` |
| Git 2.13 introduit includeIf, les inclusions conditionnelles (billet de Jeff King, 10 mai 2017) | `git/lecon-21#1` |
| Barret Rhoden (Google) ajoute git blame --ignore-rev (2019), livré dans Git 2.23 | `git/lecon-22#1` |
| Le projet Git refuse les pull requests : liste de diffusion et GitGitGadget (commit de Jeff King, 12 mars 2019) | `git/lecon-23#1` |
| GitHub publie git-sizer (Michael Haggerty, 5 mars 2018) | `git/lecon-24#1` |
| Rob Pike, « Go at Google » (SPLASH 2012) : 4,2 Mo de C++ devenus 8 Go à la compilation, imports inutilisés interdits | `go/lecon-01#1` |
| Le bogue de CopyFile du billet « Defer, Panic, and Recover » (blog de Go, 2010) et le defer quasi gratuit de Go 1.14 | `go/lecon-02#1` |
| Let's Encrypt, bogue de revérification CAA (2020) : &v d'une variable de range dans Boulder ; Go 1.22 | `go/lecon-03#1` |
| Ticket golang/go n° 21066 (2017) : méthode Init à récepteur par valeur, modification perdue | `go/lecon-04#1` |
| Proposition golang/go n° 22729 d'Ian Lance Taylor (2017) : l'interface non nil qui contient un pointeur nil (FAQ nil_error) | `go/lecon-05#1` |
| Go 1.13 ajoute %w, errors.Is, errors.As (blog « Working with Errors in Go 1.13 », 2019) | `go/lecon-06#1` |
| Uber, « Data Race Patterns in Go » (2022) : ~2 000 courses de données, map, mutex par valeur, WaitGroup | `go/lecon-07#1` |
| Socket : le faux module github.com/boltdb-go/bolt et le cache du proxy de modules Go (2021-2025) | `go/lecon-08#1` |
| fmt couvert à 91,7 % (blog « The cover story », 2013) et six paniques « index out of range » trouvées par go-fuzz (2015) | `go/lecon-09#1` |
| Ticket golang/go n° 4674 (2013) : arrêt propre de net/http, Server.Shutdown dans Go 1.8 (2017) | `go/lecon-10#1` |
| Le profil goroutineleak de Go 1.26 (expérimental, 2026) puis 1.27, travail de Vlad Saioc (Uber) | `go/lecon-11#1` |
| Russ Cox, « Profiling Go Programs » (2011) : le benchmark de Robert Hundt 11 fois plus rapide avec pprof | `go/lecon-12#1` |
| Filippo Valsorda (Cloudflare), « So you want to expose Go on the Internet » (2016) : timeouts de http.Server | `go/lecon-13#1` |
| Proposition golang/go n° 11939 (2015) : omitempty ignore les structs et time.Time ; omitzero dans Go 1.24 (2025) | `go/lecon-14#1` |
| Brad Fitzpatrick, tickets golang/go n° 6714 (2013) et 18990 (2017) : strings.Builder dans Go 1.10 (2018) | `go/lecon-15#1` |
| Cloudflare : la seconde intercalaire du 1er janvier 2017 et le DNS RRDNS en Go (durée négative, rand.Int63n) | `go/lecon-16#1` |
| logrus : Writer() et la ligne de plus de 64 Ko sans saut (bufio.Scanner, token too long), ticket 1370 (2023), CVE-2025-65637 | `go/lecon-17#1` |
| Kubernetes 1.19 : avertissements de kubectl sur stderr et --warnings-as-errors (blog de J. Liggitt, 2020) | `go/lecon-18#1` |
| iPhone OS 4 et le multitâche des apps tierces (8 avril 2010) : applicationDidEnterBackground, environ cinq secondes | `mobile/lecon-01#1` |
| Airbnb abandonne React Native (Gabriel Peal, « Sunsetting React Native », 19 juin 2018) | `mobile/lecon-02#1` |
| Android 3.0 Honeycomb (2011) : une app n'est « tuable » qu'après onStop() ; sauver les données dans onPause() | `mobile/lecon-03#1` |
| Google publie son guide d'architecture Android (17 mai 2017) ; la règle de la source unique de vérité (SSOT) | `mobile/lecon-04#1` |
| Android 13 et le geste « retour prédictif » : onBackPressed déprécié, OnBackPressedDispatcher (29 juillet 2022) | `mobile/lecon-05#1` |
| Apple, WWDC 2019, « Data Flow Through SwiftUI » : une seule source de vérité, données remontées vers un ancêtre commun, @Binding | `mobile/lecon-06#1` |
| Facebook ouvre Litho, listes Android plus fluides (jusqu'à 35 %, 18 avril 2017) | `mobile/lecon-07#1` |
| Apple, « Designing for iPhone X » (12 septembre 2017) : écran à coins arrondis, capteurs, Safe Area d'iOS 11 | `mobile/lecon-08#1` |
| Jetpack DataStore remplace SharedPreferences (Android Developers Blog, 2 septembre 2020) | `mobile/lecon-09#1` |
| Brad Fitzpatrick présente StrictMode ; réseau sur le fil principal fatal à partir de Honeycomb (12 décembre 2010) | `mobile/lecon-10#1` |
| Trello passe ses apps mobiles en hors-ligne : base locale centrale, deltas synchronisés (Dan Lew, 2017) | `mobile/lecon-11#1` |
| FTC contre Goldenshores Technologies, l'app « Brightest Flashlight Free » (5 décembre 2013) | `mobile/lecon-12#1` |
| Android O introduit les canaux de notification (Dave Burke, 21 mars 2017) | `mobile/lecon-13#1` |
| Facebook, « Year class » : classer les téléphones Android par année (Weaver et Marra, 6 novembre 2014) | `mobile/lecon-14#1` |
| Google Play lance les déploiements progressifs (staged rollouts) à la Google I/O (15 mai 2013) | `mobile/lecon-15#1` |
| Ryan Dahl présente node.js à JSConf.eu (8 novembre 2009) | `nodejs/lecon-01#1` |
| chalk 5 passe en ESM pur (2021) et require(esm) dans Node 22.12/20.19 | `nodejs/lecon-02#1` |
| Le paquet colors piégé (janvier 2022), dépendance indirecte de la CLI de Netlify | `nodejs/lecon-03#1` |
| path-to-regexp, ReDoS qui bloque la boucle d'événements d'Express (CVE-2024-45296, 2024) | `nodejs/lecon-04#1` |
| ESLint 3.12.0 ajoute la règle no-await-in-loop (2016) | `nodejs/lecon-05#1` |
| Mongoose : useDb() à chaque requête et l'option noListener de la 5.12.0 (2021) | `nodejs/lecon-06#1` |
| SDK OpenAI pour Node : caractères multi-octets coupés entre deux morceaux du streaming (2024) | `nodejs/lecon-07#1` |
| Node.js ajoute import.meta.dirname et import.meta.filename (PR #48740, 2023 ; v20.11.0, 2024) | `nodejs/lecon-08#1` |
| Adam Wiggins (Heroku) publie The Twelve-Factor App, facteur III Config (2011) | `nodejs/lecon-09#1` |
| Google, « Farewell to soft 404s » : le 200 renvoyé pour une page absente (2008) | `nodejs/lecon-10#1` |
| Roy Fielding définit REST dans sa thèse (UC Irvine, 2000) | `nodejs/lecon-11#1` |
| Next.js, CVE-2025-29927 : la vérification d'accès du middleware contournée (2025) | `nodejs/lecon-12#1` |
| Node.js 20.6.0 lit lui-même un fichier .env avec --env-file (2023) | `nodejs/lecon-13#1` |
| Node.js 19 : server.close() ferme les connexions keep-alive inactives (2022) | `nodejs/lecon-14#1` |
| Heartland Payment Systems : l'injection SQL du 26 décembre 2007, acte d'accusation d'Albert Gonzalez (2009) | `nodejs/lecon-15#1` |
| Dropbox, « How Dropbox securely stores your passwords » : SHA512, bcrypt coût 10, poivre AES256 (2016) | `nodejs/lecon-16#1` |
| REMPLACE ma ligne « Slack Real-time Messaging » (sujet libéré) : Figma, « How Figma's multiplayer technology works », WebSocket et un processus par document (Evan Wallace, 2019) | `nodejs/lecon-17#1` |
| Apache Superset, CVE-2023-27524 : la SECRET_KEY par défaut, refus de démarrer en 2.1 (2023) | `nodejs/lecon-18#1` |
| Netflix, « Node.js in Flames » : routes Express dupliquées, +10 ms par heure, flame graphs (2014) | `nodejs/lecon-19#1` |
| Kubernetes KEP-3960 : l'action sleep du crochet preStop contre la course des endpoints (2023, alpha 1.29) | `nodejs/lecon-20#1` |
| Prisma, ticket n° 5184 « Use JOINs in more queries » (2021) puis relationJoins dans Prisma 5.7.0 (2023) | `nodejs/lecon-21#1` |
| REMPLACE ma ligne « GitHub et l'assignation de masse (2012) » (sujet déjà raconté par ruby/lecon-09, libéré) : AnythingLLM, CVE-2024-0404, rôle admin glissé dans la route d'invitation (correctif du 10 janvier 2024) | `nodejs/lecon-22#1` |
| Node.js 18.3.0 intègre util.parseArgs (PR #42675 de Benjamin Coe, 2022) | `nodejs/lecon-23#1` |
| ESLint 9.34.0 : analyse multithread par worker threads, --concurrency (2025) | `nodejs/lecon-24#1` |
| Le lanceur de tests node:test : expérimental dans Node 18 (2022), stable dans Node 20 (2023) | `nodejs/lecon-25#1` |
| Slack, « Scaling Slack's Job Queue » : file Redis saturée, Kafka en amont (2017) | `nodejs/lecon-26#1` |
| PayPal, « Node.js at PayPal » : la page de synthèse du compte, Kraken.js, Java en parallèle (2013) | `nodejs/lecon-27#1` |
| Pinterest reconstruit ses pages pour la vitesse : temps d'attente -40 %, trafic SEO +15 % (2017) | `perf-web/lecon-01#1` |
| Google présente WebP : images = 65 % des octets, -39 % en moyenne (2010) | `perf-web/lecon-02#1` |
| Moment.js passe en maintenance : trop lourd, mal « tree-shaké », remplacé par Intl (2020) | `perf-web/lecon-03#1` |
| Google cesse de lire noindex dans robots.txt (1er septembre 2019) | `perf-web/lecon-04#1` |
| Rakuten Recipe et les données structurées Recipe (étude Google, 2018) | `perf-web/lecon-05#1` |
| The Economic Times passe les Core Web Vitals (web.dev, 2021) | `perf-web/lecon-06#1` |
| Filament Group : charger le CSS en media="print" (Scott Jehl, 2019) | `perf-web/lecon-07#1` |
| Firefox 71 déduit l'aspect-ratio des attributs width/height des images (2019) | `perf-web/lecon-08#1` |
| Facebook, Chrome et Cache-Control: immutable : -60 % de requêtes statiques (2017) | `perf-web/lecon-09#1` |
| Google lance le Chrome User Experience Report, données de terrain (2017) | `perf-web/lecon-10#1` |
| Chrome 56 rend passifs par défaut les écouteurs tactiles (2017) | `perf-web/lecon-11#1` |
| OffscreenCanvas sans drapeau dans Chrome 69 (2018) | `perf-web/lecon-12#1` |
| Partytown : scripts tiers dans un web worker (Adam Bradley, 2021) | `perf-web/lecon-12#2` |
| Addy Osmani, « The Cost of JavaScript in 2018 » : CNN.com, 4 s sur iPhone 8, 13 s sur Moto G4 | `perf-web/lecon-13#1` |
| Next.js 9.5 et l'Incremental Static Regeneration (2020) | `perf-web/lecon-14#1` |
| Twitter ramène le rendu côté serveur, « time to first Tweet » divisé par cinq (2012) | `perf-web/lecon-14#2` |
| Casper auto-héberge le script d'Optimizely : -1,7 s de start render (2018) | `perf-web/lecon-15#1` |
| Perl 5.36 : use v5.36 active les avertissements (strict via use VERSION depuis 5.12) (2022) | `perl/lecon-01#1` |
| Perl 5.18 rend aléatoire l'ordre des hachages, contre les attaques par complexité algorithmique (2013) | `perl/lecon-02#1` |
| Bugzilla CVE-2014-1572 : $cgi->param en contexte de liste dans un hachage (Netanel Rubin, 2014) | `perl/lecon-03#1` |
| PCRE de Philip Hazel, les regex de Perl 5 hors de Perl, écrit pour Exim (1997) | `perl/lecon-04#1` |
| Perl 5.14 ajoute le drapeau /r à s/// (2011) | `perl/lecon-05#1` |
| Perl 5.22 et le double losange <<>> contre l'open à deux arguments de <> (2015) | `perl/lecon-06#1` |
| « my $x if 0 », fausse variable statique, fatale dans Perl 5.30 (2019) | `perl/lecon-07#1` |
| autoderef (push $ref) expérimental en Perl 5.14, retiré en 5.24 (2016) | `perl/lecon-08#1` |
| HTTP::Tiny ne vérifiait pas les certificats TLS, CVE-2023-31486 (2023) | `perl/lecon-09#1` |
| Perl 5.32 ajoute l'opérateur isa (2020) | `perl/lecon-10#1` |
| Perl 5.28 rend perl -i plus sûr (2018) | `perl/lecon-11#1` |
| Perl 5.10 et les captures nommées (?<nom>…) (2007) | `perl/lecon-12#1` |
| Lincoln Stein, « How Perl Saved the Human Genome Project », format d'échange CAF (1996) | `perl/lecon-13#1` |
| Netanel Rubin, « The Perl Jam » (31C3, 2014) : DBI->quote contourné par un param en liste | `perl/lecon-14#1` |
| Try::Tiny de Yuval Kogman (2009) et le $@ écrasé, corrigé dans Perl 5.14 (2011) | `perl/lecon-15#1` |
| Tim Bray, Wide Finder (2007) puis Wide Finder 2 : 45 Go en 218 millions de lignes (2008) | `perl/lecon-16#1` |
| MRTG de Tobias Oetiker, script Perl de surveillance du trafic réseau (1994-1995) | `perl/lecon-16#2` |
| Jeffrey Snover, « Monad Manifesto » : objets .NET contre « prayer-based parsing » (2002) | `powershell/lecon-01#1` |
| PSScriptAnalyzer 1.17.0, règle PossibleIncorrectUsageOfRedirectionOperator (> dans un if) (2018) | `powershell/lecon-02#1` |
| Select-Object -First arrête la commande amont depuis Windows PowerShell 3.0 (2012), piège Rename-Item / -Wait | `powershell/lecon-03#1` |
| about_Break : break dans ForEach-Object peut arrêter tout le runspace (doc. Microsoft 2026) | `powershell/lecon-04#1` |
| Export-Csv, exemple 7 : Format-Table avant Export-Csv donne des objets de mise en forme (doc. 2025) | `powershell/lecon-05#1` |
| PSScriptAnalyzer 1.19.0, règle UseProcessBlockForPipelineCommand (2020) | `powershell/lecon-06#1` |
| « PowerShell scripting performance considerations » : += sur un tableau, mesures 7.3.4, optimisé en 7.5 | `powershell/lecon-07#1` |
| Kevin Marquette, « Everything you wanted to know about exceptions » (2017, repris par Microsoft) : -ErrorAction Stop | `powershell/lecon-08#1` |
| about_Character_Encoding : encodages par défaut incohérents de Windows PowerShell 5.1 (Set-Content ANSI) | `powershell/lecon-09#1` |
| dbatools, module communautaire SQL Server de près de 700 commandes sur la PowerShell Gallery (2015) | `powershell/lecon-10#1` |
| Paul Higinbotham, « PowerShell ForEach-Object Parallel Feature » (blog PowerShell, 2019) | `powershell/lecon-11#1` |
| Pester 3.4.0 livré avec Windows contre la syntaxe Should -Be de Pester 4 (2017) | `powershell/lecon-12#1` |
| Microsoft, HAFNIUM et Exchange : Select-String -Pattern 'Set-.+VirtualDirectory' (2 mars 2021) | `powershell/lecon-13#1` |
| KB5074596 : Invoke-WebRequest demande confirmation dans Windows PowerShell 5.1 (CVE-2025-54100, 9 décembre 2025) | `powershell/lecon-14#1` |
| about_Classes_Methods : une méthode de classe ne sort que par return (classes depuis PowerShell 5.0) | `powershell/lecon-15#1` |
| MS14-025 : mots de passe des préférences de stratégie de groupe dans SYSVOL (2014), script Get-SettingsWithCPassword.ps1 | `powershell/lecon-16#1` |
| Microsoft CSS-Exchange, HealthChecker.ps1 et son rapport HTML -BuildHtmlServersReport | `powershell/lecon-17#1` |
| Gao, Bird et Barr, « To Type or Not to Type » : 15 % de bugs publics détectables (ICSE 2017) | `typescript/lecon-01#1` |
| TypeScript 2.0 et les types non-nullables, --strictNullChecks (2016) | `typescript/lecon-02#1` |
| TypeScript 4.1 et --noUncheckedIndexedAccess (2020) | `typescript/lecon-03#1` |
| TypeScript 4.4, l'affinage par conditions rangées dans une constante (2021) | `typescript/lecon-04#1` |
| TypeScript 3.2 et strictBindCallApply (2018) | `typescript/lecon-05#1` |
| TypeScript 0.9 introduit les génériques (2013) | `typescript/lecon-06#1` |
| TypeScript 2.1 : keyof, types mappés, Partial/Readonly/Record/Pick (2016) | `typescript/lecon-07#1` |
| TypeScript 3.8 et les champs privés # d'ECMAScript (2020) | `typescript/lecon-08#1` |
| Babel 7 compile TypeScript sans vérifier les types (2018) | `typescript/lecon-09#1` |
| Node.js 23.6 exécute les .ts par effacement des types, sans vérification (2025) | `typescript/lecon-10#1` |
| TypeScript 2.8 et les types conditionnels, infer (2018) | `typescript/lecon-11#1` |
| TypeScript 4.9 et l'opérateur satisfies (2022) | `typescript/lecon-12#1` |
| Le portage natif de TypeScript en Go, « A 10x Faster TypeScript » (2025) | `typescript/lecon-13#1` |
| React 18 : les types de React exigent children explicite (2022) | `typescript/lecon-14#1` |
| TypeScript 3.0 introduit le type unknown (2018) | `typescript/lecon-15#1` |
| TypeScript 2.3 et l'option --strict (2017) | `typescript/lecon-16#1` |
| TypeScript 2.6 et --strictFunctionTypes, la variance des paramètres (2017) | `typescript/lecon-17#1` |
| TypeScript 3.7 et les fonctions d'assertion (2019) | `typescript/lecon-18#1` |
| VS Code active strictNullChecks fichier par fichier (2019) | `typescript/lecon-19#1` |
| ts-reset de Matt Pocock : .json() et JSON.parse renvoient unknown (2023) | `typescript/lecon-20#1` |
| Andrew Kelley, « Introduction to the Zig Programming Language » (8 février 2016) | `zig/lecon-01#1` |
| Git sous Windows (LLP64) : unsigned long de 32 bits, fichiers de 5 Go tronqués à 1 Go ; série de J. Schindelin (2021), Git 2.35 | `zig/lecon-02#1` |
| Zig 0.3.0 (2018) : l'opérateur ?? devient le mot-clé orelse ; exemple malloc de la référence du langage 0.14 | `zig/lecon-03#1` |
| Le compilateur Zig ne recopie pas le texte de ses jetons : 5 octets par jeton (Zig 0.8.0, 2021), tokenSlice de std.zig.Ast | `zig/lecon-04#1` |
| std.json.Value, union(enum) à huit variantes de la bibliothèque standard de Zig 0.14 (2025) | `zig/lecon-05#1` |
| TigerBeetle, base de données sans allocation dynamique après le démarrage (blog de Phil Eaton, 2022 ; TIGER_STYLE) | `zig/lecon-06#1` |
| Zig 0.2.0 (2018) : %return, %defer, %% deviennent try, errdefer, catch ; traces de retour d'erreur | `zig/lecon-07#1` |
| std.fmt formate une struct par @typeInfo et inline for à la compilation (Zig 0.14, 2025), json stringify idem | `zig/lecon-08#1` |
| Andrew Kelley, « zig cc: a Powerful Drop-In Replacement for GCC/Clang » (24 mars 2020), LuaJIT compilé pour aarch64 | `zig/lecon-09#1` |
| Bun réécrit de Zig en Rust (J. Sumner, 8 juillet 2026) et la réponse d'Andrew Kelley | `zig/lecon-10#1` |
| std.MultiArrayList arrive dans Zig 0.8.0 (2021) : structure de tableaux par comptime | `zig/lecon-11#1` |
| Karl Seguin, « Leveraging Zig's Allocators » (5 juin 2024) : arène par requête de http.zig | `zig/lecon-12#1` |
| Uber, « Bootstrapping Uber's Infrastructure on arm64 with Zig » (3 mai 2023) : zig cc et hermetic_cc_toolchain | `zig/lecon-13#1` |
| Les 30 blocs test de lib/std/array_list.zig et std.testing.allocator (Zig 0.14, 2025) | `zig/lecon-14#1` |
| std.os.argv [][*:0]u8 et std.process.argsAlloc [][:0]u8 (Zig 0.14, 2025) | `zig/lecon-15#1` |
| Ghostty passe à trois threads par fenêtre, files MPSC et mutex (commit de M. Hashimoto, 5 novembre 2022) | `zig/lecon-16#1` |
| std.ArrayList, fonction comptime qui renvoie une struct (Zig 0.14) ; ArrayList non géré par défaut dans 0.15.1 (2025) | `zig/lecon-17#1` |
| std.mem.Allocator, interface ptr + vtable (alloc, resize, remap, free), std.Random, AnyWriter (Zig 0.14, 2025) | `zig/lecon-17#2` |
| ncdu 2 réécrit en Zig (« Ncdu 2: Less hungry and more Ziggy », 22 juillet 2021) | `zig/lecon-18#1` |
