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

## Pris par le lot 3 (B6, 2026-11-14)

La DERNIÈRE réservation de chaque cas.

| Sujet | Foyer |
|---|---|
| V8, moteur JavaScript de Chrome écrit en C++, publié en logiciel libre le jour du lancement de Chrome (2 septembre 2008 ; Mathias Bynens, « Celebrating 10 years of V8 », 11 septembre 2018) | `cpp/lecon-01#1` |
| Chromium, « Be careful when using std::string » : près de 25 000 allocations par frappe dans l'Omnibox, std::string = près de la moitié des allocations du processus navigateur (Georges Khalil, chromium-dev, 1er décembre 2014) | `cpp/lecon-02#1` |
| N2431, « A name for the null pointer: nullptr » (Herb Sutter et Bjarne Stroustrup, 2 octobre 2007) : f(0) choisit f(int) et non f(char*) | `cpp/lecon-03#1` |
| C++ Core Guidelines (annoncées par Stroustrup à CppCon, isocpp.org, 21 septembre 2015), règle C.2 : class s'il y a un invariant, struct sinon | `cpp/lecon-04#1` |
| P0052R10, « Generic Scope Guard and RAII Wrapper for the Standard Library » : unique_resource pour FILE* et descripteurs POSIX (Peter Sommerlad et Andrew L. Sandoval, 19 février 2019 ; N3677, 2013) | `cpp/lecon-05#1` |
| Qt 6.12 (30 septembre 2026) : QWidget base de tous les objets d'interface, QAbstractButton abstraite (paintEvent virtuelle pure), ~QObject virtuel qui détruit les enfants | `cpp/lecon-06#1` |
| P0515R0, « Consistent comparison » (Herb Sutter, 5 février 2017) : l'opérateur <=>, adopté pour C++20 à Albuquerque (novembre 2017), puis P1185R2 « <=> != == » (Barry Revzin, 22 février 2019) | `cpp/lecon-07#1` |
| N2983, « Allowing Move Constructors to Throw » (Abrahams, Sharoni, Gregor, 9 novembre 2009) : vector::reserve avec std::move_if_noexcept, noexcept | `cpp/lecon-08#1` |
| N3580, « Concepts Lite » (Sutton, Stroustrup, Dos Reis, 17 mars 2013) : sort(list) et ses diagnostics ; concepts fusionnés dans C++20 à Toronto (juillet 2017) | `cpp/lecon-09#1` |
| Bjarne Stroustrup, « Software Development for Infrastructure » (IEEE Computer, janvier 2012) : l'expérience vector contre list | `cpp/lecon-10#1` |
| Sean Parent (Adobe), « C++ Seasoning » (GoingNative 2013) : « No raw loops », PanelBar::RepositionExpandedPanels réécrit avec find_if et rotate | `cpp/lecon-11#1` |
| N1450, « A Proposal to Add General Purpose Smart Pointers to the Library Technical Report » (Dimov, Dawes, Colvin, 27 mars 2003) : weak_ptr pour casser les cycles de shared_ptr | `cpp/lecon-12#1` |
| LLVM ajoute Error et Expected<T> (Lang Hames, commit du 16 mars 2016, r263609) : une erreur non vérifiée fait avorter le programme ; LLVM n'utilise pas les exceptions | `cpp/lecon-13#1` |
| Aras Pranckevičius ajoute -ftime-trace à Clang (billet du 16 janvier 2019 ; Clang 9.0) : profil de compilation par en-tête | `cpp/lecon-14#1` |
| Panne géante du 14 août 2003 (nord-est des États-Unis, Ontario) : le logiciel d'alarme XA/21 de GE chez FirstEnergy figé par une race condition (rapport final de la Task Force, avril 2004 ; Kevin Poulsen, 8 avril 2004) | `cpp/lecon-15#1` |
| P2216R3, « std::format improvements » (Victor Zverovich, 5 février 2021) : chaîne de format vérifiée à la compilation, défaut corrigé rétroactivement dans C++20 | `cpp/lecon-16#1` |
| Mike Acton (Insomniac Games), « Data-Oriented Design and C++ » (CppCon 2014) | `cpp/lecon-17#1` |
| Catch2 v3.0.1 (17 mai 2022) abandonne l'en-tête unique : bibliothèque compilée, catch_test_macros.hpp 80 % moins cher à inclure que catch.hpp | `cpp/lecon-18#1` |
| clang-tidy 17 ajoute la vérification performance-avoid-endl (LLVM 17, 2023) ; règle SL.io.50 des Core Guidelines non utilisée | `cpp/lecon-19#1` |
| N3924, « Discouraging rand() in C++14, v2 » (Walter E. Brown, 14 février 2014) : algorithme de rand non spécifié, random_shuffle déprécié ; 10 000e valeur de mt19937 imposée par la norme | `cpp/lecon-20#1` |
| P0218R1, « Adopt the File System TS for C++17 » (Beman Dawes, 5 mars 2016) : Boost.Filesystem depuis 2003, TS 18822:2015, clause « file system race » | `cpp/lecon-21#1` |
| P0184R0, « Generalizing the Range-Based For Loop » (Eric Niebler, 11 février 2016) : begin et end de types différents (sentinelle) dans C++17 | `cpp/lecon-22#1` |
| QDirStat de Stefan Hundhammer (projet commencé le 28 novembre 2015), portage Qt de KDirStat (2000) ; fenêtre des statistiques par type de fichier | `cpp/lecon-23#1` |
| Dart 2.6 et dart2native (Michael Thomsen, 5 novembre 2019) : exécutables autonomes compilés AOT pour macOS, Windows, Linux, sans SDK installé, hello world en 49 ms | `dart/lecon-01#1` |
| Dart 2.12 (Michael Thomsen, 3 mars 2021) : null safety stable ; bogue de l'outil flutter « The method '>=' was called on null » (version?.major) que l'analyse statique attrape | `dart/lecon-02#1` |
| Dart 2.3 (Michael Thomsen, 8 mai 2019) : opérateur spread, collection if, collection for pour décrire une interface Flutter en Dart (Flutter 1.5) | `dart/lecon-03#1` |
| Dart 2.17 (Michael Thomsen, 11 mai 2022) : les arguments nommés peuvent se placer n'importe où dans l'appel (exemple List.generate et growable) | `dart/lecon-04#1` |
| Vijay Menon, « An update on Dart macros & data serialization » : l'équipe Dart arrête les macros, dont la motivation première était la sérialisation des données ; réflexion à l'exécution contraire au tree-shaking, build_runner (29 janvier 2025) | `dart/lecon-05#1` |
| Dart 3 (Michael Thomsen, 10 mai 2023) : modificateur sealed et switch exhaustif (Animal, Cow, Sheep, Pig oublié), modificateurs interface, base, final | `dart/lecon-06#1` |
| Dart 1.9 (26 mars 2015) : méthodes async et expressions await bâties sur l'API Future, boucles et try/catch dans le code asynchrone | `dart/lecon-07#1` |
| David Morgan, « Dart gets a type system » : en Dart 1 une List<TempFile> acceptait un BankAccount, Strong Mode puis Dart 2 rendent les génériques sound (4 juillet 2017) | `dart/lecon-08#1` |
| « Introducing a brand new pub.dev » (Michael Thomsen, 15 juillet 2020) : pub points en cinq catégories (conventions, documentation, plateformes, analyse statique sans erreur ni avertissement ni lint, dépendances à jour), calculés par pana, comptés dans le classement | `dart/lecon-09#1` |
| Le hot reload avec état arrive sur le web : expérimental dans Flutter 3.32 (20 mai 2025, 2e demande la plus votée), activé par défaut dans Flutter 3.35 (14 août 2025) | `dart/lecon-10#1` |
| Nubank, « Why we think Flutter will help us scale mobile development at Nubank » (Alexandre Freire, 30 septembre 2019) : groupe de travail, Kotlin Native, React Native et Flutter comparés sur 11 critères, Flutter retenu pour une seule base de code | `dart/lecon-11#1` |
| Wonderous s'adapte aux pliables et aux tablettes (Leigha Jarett, blog de Flutter, 25 janvier 2023) : widget Flex en ligne ou en colonne selon l'écran, MediaQuery | `dart/lecon-12#1` |
| Google I/O 2019 : Flutter présente le paquet provider pour la gestion d'état (Tim Sneath, 8 mai 2019) ; la doc « Simple app state management » le conseille aux débutants, exemple catalogue et panier (CartModel, ChangeNotifierProvider) | `dart/lecon-13#1` |
| John Ryan, « Learning Flutter's new navigation and routing system » (30 septembre 2020) : routes nommées prédéfinies, /details/:id impossible à analyser, onGenerateRoute, Navigator 2.0 et Router pour liens profonds et URL web | `dart/lecon-14#1` |
| Paquet http de Dart, ticket n° 175 (13 juillet 2018) : réponse application/json sans charset décodée en latin1, caractères accentués abîmés, contournement utf8.decode(bodyBytes) ; corrigé dans http 1.4.0 (PR n° 1422, 2025) | `dart/lecon-15#1` |
| Wolt, « Scaling our merchant app with Flutter » (Rifat Ordulu, 30 juin 2023) : Picker App, premier essai Flutter, pour préparer les commandes en magasin, étendue en app marchande unique iOS/Android | `dart/lecon-16#1` |
| Public Health England : 15 841 cas de COVID-19 absents des chiffres quotidiens, fichiers trop gros pour le chargement (25 septembre - 2 octobre 2020) | `data-eng/lecon-01#1` |
| Jay Kreps (LinkedIn), « Questioning the Lambda Architecture » : batch si la latence n'importe pas, flux sinon, pas les deux ; architecture Kappa (O'Reilly Radar, 2 juillet 2014) | `data-eng/lecon-02#1` |
| REMPLACE ma ligne « Redshift / Tristan Handy » (sujet libéré) : Uber, « Uber's Big Data Platform: 100+ Petabytes with Minute Latency » : ETL ad hoc vers Vertica, puis brut ingéré une seule fois sans transformation dans Hadoop (Reza Shiftehfar, 17 octobre 2018) | `data-eng/lecon-03#1` |
| AWS, « Analyzing Data in S3 using Amazon Athena » : 1 To de journaux texte devenus 130 Go de Parquet, 99 % de données scannées en moins (30 novembre 2016) | `data-eng/lecon-04#1` |
| Kafka Connect, connecteur JDBC source : ligne validée après l'avance du curseur jamais lue (forum Confluent, 22 octobre 2021) ; timestamp.delay.interval.ms | `data-eng/lecon-05#1` |
| Airbnb, Minerva partie I : tables dérivées de core_data qui prolifèrent, chiffres divergents, modèles certifiés reconstruits (Robert Chang, 30 avril 2021) | `data-eng/lecon-06#1` |
| Cloudera, « The Small Files Problem » : 150 octets par objet dans la mémoire du namenode HDFS, 10 millions de fichiers = 3 Go, journaux écrits par morceaux (2 février 2009) | `data-eng/lecon-07#1` |
| Maxime Beauchemin, « Functional Data Engineering » : tâches pures et idempotentes, partition réécrite en entier, backfill sans double compte (8 janvier 2018) | `data-eng/lecon-08#1` |
| Airbnb ouvre Airflow : du cron aux DAG écrits en Python, capteurs (sensors), backfill (Maxime Beauchemin, 2 juin 2015) | `data-eng/lecon-09#1` |
| Amazon publie Deequ : contraintes de qualité vérifiées à chaque version d'un jeu de données, publication bloquée en cas d'échec (AWS Big Data Blog, 16 mai 2019) | `data-eng/lecon-10#1` |
| GoCardless introduit les Data Contracts : la capture de changements (CDC) exposait le modèle interne des services, ruptures inattendues (Andrew Jones, 23 décembre 2021) | `data-eng/lecon-11#1` |
| Netflix, « Building and Scaling Data Lineage at Netflix » : lignage collecté depuis les journaux et les plans Spark, service de SLA qui alerte sur les retards en amont des rapports (25 mars 2019) | `data-eng/lecon-12#1` |
| Shopify, « Reducing BigQuery Costs: How We Fixed A $1 Million Query » : 75 Go par requête, table regroupée (clustering) sur deux colonnes du WHERE (Calvin Zhou, 3 novembre 2022) | `data-eng/lecon-13#1` |
| Airbnb, Midas (« Data Quality at Airbnb, Part 2 — A New Gold Standard ») : spécification de conception, SLA d'arrivée, plan de reprise, contrôles automatiques, quatre revues (24 novembre 2020) | `data-eng/lecon-14#1` |
| Google, Treynor, Dahlin, Rau et Beyer, « The Calculus of Service Availability » : la « règle du neuf supplémentaire » pour les dépendances critiques (ACM Queue, mars-avril 2017) | `distribue/lecon-01#1` |
| Stuart Cheshire, « It's the Latency, Stupid » : le débit s'achète, la latence reste (mai 1996) | `distribue/lecon-02#1` |
| Microsoft Research et Azure, « Gray Failure: The Achilles' Heel of Cloud-Scale Systems » : observabilité différentielle (HotOS, mai 2017) | `distribue/lecon-03#1` |
| Google Spanner et TrueTime : l'heure rendue comme un intervalle, epsilon de 1 à 7 ms, attente de validation (OSDI 2012) | `distribue/lecon-04#1` |
| Leslie Lamport, origine de « Time, Clocks and the Ordering of Events » (CACM, juillet 1978) : la note de Johnson et Thomas qui violait la causalité, commentaire de Lamport | `distribue/lecon-05#1` |
| GitHub, analyse de l'incident du 21 octobre 2018 : 43 s de coupure, bascule vers la côte Ouest, intégrité préférée à la disponibilité (Jason Warner, 30 octobre 2018) | `distribue/lecon-06#1` |
| Amazon Aurora, six copies sur trois zones, quorum 4/6 et « AZ+1 » contre les pannes corrélées (Anurag Gupta, AWS Database Blog, 14 août 2017) | `distribue/lecon-07#1` |
| Notion, « Herding elephants » : partition par identifiant d'espace de travail, 480 partitions logiques sur 32 bases (Garrett Fidalgo, 6 octobre 2021) | `distribue/lecon-08#1` |
| Cloudflare, « A Byzantine failure in the real world » : élections Raft d'etcd sans fin derrière un commutateur à moitié en panne, incident du 2 novembre 2020 (27 novembre 2020) | `distribue/lecon-09#1` |
| AWS Builders' Library, Malcolm Featonby, « Making retries safe with idempotent APIs » : ClientToken de RunInstances (2020) | `distribue/lecon-10#1` |
| Uber, « Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka » : files de réessai et file des lettres mortes (Ning Xia, 16 février 2018) | `distribue/lecon-11#1` |
| Elastic, « A new era for cluster coordination in Elasticsearch » : Elasticsearch 7.0 retire minimum_master_nodes (David Turner et Yannick Welsch, 13 mars 2019) | `distribue/lecon-12#1` |
| Docker 0.1.0 (23 mars 2013) : le README définit le « Standard Container », analogie du conteneur maritime, répétabilité | `docker/lecon-01#1` |
| Jérôme Petazzoni, « If you run SSHD in your Docker containers, you're doing it wrong! » (23 juin 2014), nsenter ; Docker 1.3.0 ajoute docker exec (14 octobre 2014) | `docker/lecon-02#1` |
| Docker 1.10 ne tire plus la chaîne des images parentes : cache de build perdu en CI (ticket moby n° 20316, 14 février 2016) ; --cache-from dans Docker 1.13.0 (18 janvier 2017) | `docker/lecon-03#1` |
| L'image officielle postgres déplace PGDATA et son VOLUME à partir de PostgreSQL 18 (PR docker-library/postgres n° 1259, juin 2025 ; ticket n° 1370, octobre 2025) | `docker/lecon-04#1` |
| Fig d'Orchard (0.0.1, 20 décembre 2013), rejoint Docker (Fig 1.0.0, 16 octobre 2014), renommé Docker Compose (1.1.0, 25 février 2015) | `docker/lecon-05#1` |
| Dahlmanns, Sander, Decker, Wehrle (RWTH Aachen), « Secrets Revealed in Container Images » (ASIA CCS 2023) : 8,5 % des images contiennent des secrets | `docker/lecon-06#1` |
| Kubernetes gèle le registre k8s.gcr.io le 3 avril 2023, images sur registry.k8s.io (blog Kubernetes, 6 février 2023) | `docker/lecon-07#1` |
| Docker Compose Watch : expérimental dans Compose 2.16.0 (8 février 2023), disponible en général dans 2.22.0 (21 septembre 2023) | `docker/lecon-08#1` |
| JDK-8146115 : la JVM lisait la mémoire et les CPU de l'hôte, pas les limites du conteneur ; corrigé dans Java 10, rétroporté en 8u191 (2015-2018) | `docker/lecon-09#1` |
| Sysdig Threat Research Team : 1 652 images malveillantes sur plus de 250 000 analysées sur Docker Hub, typosquatting et mineurs (Stefano Chierici, 23 novembre 2022) | `docker/lecon-10#1` |
| Les images distroless de Google n'ont pas de shell ; leurs variantes :debug et docker run --entrypoint=sh (projet présenté à swampUP, 25 mai 2017) | `docker/lecon-11#1` |
| Yelp publie dumb-init : un shell en PID 1 ne relaie pas les signaux, exec du dernier processus (Chris K., 6 janvier 2016) | `docker/lecon-11#2` |
| Ticket docker/for-mac n° 5475 : image construite sur un Mac M1 (arm64), « exec format error » sur un serveur x86_64 (19 mars 2021) | `docker/lecon-12#1` |
| Compose 1.6.0 (février 2016) : format de fichier version 2, réseau par défaut, chaque service joignable par son nom (postgres://db:5432) | `docker/lecon-13#1` |
| Proposition moby n° 33475 (1er juin 2017) : journaux json-file sans rotation par défaut, pilote local qui tourne par défaut (PR n° 37092, août 2018) | `docker/lecon-14#1` |
| Graeme Johnson, « Docker at Shopify: How We Built Containers that Power Over 100,000 Online Shops » (18 novembre 2014) : image de base de 125 lignes, conteneurs fins, règle des 100 | `docker/lecon-15#1` |
| Google annonce le support officiel de Kotlin sur Android, « 100 % compatible » avec Java, Expedia, Flipboard, Pinterest, Square (Mike Cleron, Google I/O, 17 mai 2017) | `kotlin/lecon-01#1` |
| Google Home : 33 % de NullPointerException en moins depuis les nouvelles fonctions en Kotlin, type de plantage n° 1 de la Play Console (Android Developers Blog, 16 juillet 2020) | `kotlin/lecon-02#1` |
| Kotlin 1.6.0 avertit puis Kotlin 1.7.0 refuse les instructions when non exhaustives sur enum, sealed et Boolean (KT-47709 ; 16 novembre 2021, 9 juin 2022) | `kotlin/lecon-03#1` |
| REMPLACE ma ligne « Compose Material 1.0.0 » : la fonction Text de Compose Material 3, première version stable 1.0.0, seize paramètres dont quinze ont une valeur par défaut (24 octobre 2022) | `kotlin/lecon-04#1` |
| Proposition « Immutable Collections » d'Ilya Gorbunov (kotlinx.collections.immutable) : une collection exposée en lecture seule peut être recastée en mutable (12 juillet 2016) | `kotlin/lecon-05#1` |
| Kotlin 1.4.0 : reduceOrNull, runningFold et scan, références :: vers des fonctions à paramètres par défaut (17 août 2020) | `kotlin/lecon-06#1` |
| Kotlin 1.2 ajoute chunked, windowed et zipWithNext à Iterable, Sequence et CharSequence (28 novembre 2017) | `kotlin/lecon-07#1` |
| Kotlin 2.3.0 introduit les champs de stockage explicites (explicit backing fields, expérimental, 16 décembre 2025), stables dans Kotlin 2.4.0 (14 juillet 2026) | `kotlin/lecon-08#1` |
| Kotlin 1.9.0 rend stables les data object (introduits en 1.8.20), utiles dans les hiérarchies sealed (6 juillet 2023) | `kotlin/lecon-09#1` |
| Kotlin 1.0.6 publie le plugin all-open et kotlin-spring : les classes finales par défaut gênaient Spring et Mockito (Yan Zhulanow, 27 décembre 2016 ; S. Deleuze, blog Spring, 4 janvier 2017) | `kotlin/lecon-10#1` |
| AndroidX Fragment 1.1.0 : délégués by viewModels() et by activityViewModels(), fonctions inline reified qui renvoient un Lazy (ViewModelLazy) (5 septembre 2019) | `kotlin/lecon-11#1` |
| Google présente Android KTX en préversion : String.toUri(), SharedPreferences.edit { }, View.doOnPreDraw { } (Jake Wharton, Florina Muntenescu, James Lau, 5 février 2018) | `kotlin/lecon-12#1` |
| Roman Elizarov, « Structured concurrency » : kotlinx.coroutines 0.26.0, launch et async deviennent des extensions de CoroutineScope, coroutineScope { } (12 septembre 2018) | `kotlin/lecon-13#1` |
| Duolingo passe son app Android à 100 % Kotlin : convertisseur de l'IDE, @JvmStatic, detekt et ktlint, NPE venues de dépendances Java non annotées (Art Chaidarun, 6 avril 2020) | `kotlin/lecon-14#1` |
| Jetpack Compose 1.0 : plus de 2 000 applis du Play Store l'utilisent, dont le Play Store lui-même ; Square, Monzo, Twitter (A.-C. Bellini et N. Butcher, 28 juillet 2021) | `kotlin/lecon-15#1` |
| kotlinx.coroutines 1.6.0 refond kotlinx-coroutines-test : runTest remplace runBlockingTest, delay sauté en temps virtuel (22 décembre 2021) | `kotlin/lecon-16#1` |
| (même sujet, URL corrigée pour la version 1.4.0 du journal des modifications) kotlinx.coroutines 1.3.6 introduit StateFlow (8 mai 2020), stable en 1.4.0 (26 octobre 2020) | `kotlin/lecon-17#1` |
| Kotlin 1.1 introduit @DslMarker (KEEP d'Andrey Breslav) : un tr { } glissé dans un tr { } du constructeur HTML, refusé (1er mars 2017) | `kotlin/lecon-18#1` |
| kotlinx.serialization 1.0, première version stable : @Serializable, erreur à la compilation sans annotation, List<T> malgré l'effacement des types, @SerialName et clés inconnues (Sebastian Aigner, 8 octobre 2020) | `kotlin/lecon-19#1` |
| Cash App adopte Kotlin Multiplatform : essais dès 2018 derrière un drapeau, dépôt partagé de logique métier, persistance et fonctions pures, interface native (Alec Strong, blog Kotlin, 17 mars 2021) | `kotlin/lecon-20#1` |
| Google publie l'appli d'exemple Now in Android (Paris Hsu et Don Turner, 12 mai 2022) : sealed interface SearchResultUiState, @Serializable NetworkNewsResource | `kotlin/lecon-21#1` |
| Lua 5.5 introduit les déclarations de variables globales (global *, global none), sortie le 22 décembre 2025 | `lua/lecon-01#1` |
| Lua 5.0 introduit les booléens true et false, nil reste faux (avril 2003 ; « The Evolution of Lua », HOPL III, 2007) | `lua/lecon-02#1` |
| Lua 5.2 ajoute goto (Roberto Ierusalimschy, « The Novelties of Lua 5.2 », atelier Lua, septembre 2011 ; sortie le 16 décembre 2011) | `lua/lecon-03#1` |
| Des upvalues figées de Lua 3.1 à la portée lexicale complète de Lua 5.0 : message de John D. Ramsdell (juillet 2001), algorithme d'Edgar Toering (HOPL III, 2007) | `lua/lecon-04#1` |
| Lua 5.1 remplace table.getn par l'opérateur de longueur #, table.setn obsolète (février 2006) | `lua/lecon-05#1` |
| GARDE ET CORRIGE : lua-cjson d'OpenResty et la table vide, encode_empty_table_as_object (18 février 2014), cjson.empty_array et empty_array_mt (29 février 2016) | `lua/lecon-06#1` |
| etc/strict.lua, livré avec Lua 5.1 (février 2006) : métatable sur _G, __newindex et __index contre les globales non déclarées | `lua/lecon-07#1` |
| Programming in Lua, 1re édition (2003), chapitre 16 : la classe Account, setmetatable(o, self) et self.__index = self, SpecialAccount | `lua/lecon-08#1` |
| GARDE ET CORRIGE : Neovim 0.5 (2 juillet 2021), init.lua et package.path ajusté selon 'runtimepath' (lua-package-path) | `lua/lecon-09#1` |
| Lua 5.2 (16 décembre 2011) : yield possible dans un pcall, « attempt to yield across metamethod/C-call boundary » en Lua 5.1 | `lua/lecon-10#1` |
| GitHub, « How we scaled the GitHub API with a sharded, replicated rate limiter in Redis » : logique en Lua pour l'atomicité (Robert Mosolgo, 5 avril 2021) | `lua/lecon-11#1` |
| GARDE ET CORRIGE : Balatro, fait avec LÖVE (site de LÖVE), trois prix aux Game Awards 2024 | `lua/lecon-12#1` |
| Programming in Lua, 1re édition (2003), § 20.1 : pas de regex POSIX, plus de 4 000 lignes contre moins de 500 pour les motifs | `lua/lecon-13#1` |
| Lua 5.4 (29 juin 2020) : io.lines rend 4 valeurs, le fichier est fermé même après un break (valeur de fermeture) | `lua/lecon-14#1` |
| Lua 5.1 et le ramasse-miettes incrémental demandé par les développeurs de jeux, le robot Crazy Ivan (HOPL III, 2007) | `lua/lecon-15#1` |
| Neovim 0.10 (16 mai 2024) ajoute vim.iter() : filter, map, fold en pipeline | `lua/lecon-16#1` |
| CVE-2022-0543 : évasion du bac à sable Lua de Redis propre à Debian et Ubuntu, globale package oubliée (DSA-5081, 18 février 2022 ; billet ubercomp, 8 mars 2022) | `lua/lecon-17#1` |
| Lua 5.2 retire la vérification du bytecode, argument mode de load ("t", "b", "bt") (manuel 5.2, § 8.2, décembre 2011) | `lua/lecon-18#1` |
| LuaRocks 3.0.0 (20 juillet 2018) : commande luarocks test, section test du rockspec, moteur busted | `lua/lecon-19#1` |
| awesome 3.0 (septembre 2008) remplace ~/.awesomerc (libconfuse) par rc.lua, un programme Lua exécuté au démarrage | `lua/lecon-20#1` |
| R Consortium, R Submission Pilot 1 : dossier de test en R envoyé à la FDA (22 novembre 2021), analyse reproduite, phase 1 close (revue FDA du 10 mars 2022) | `r/lecon-01#1` |
| Decety et al. (Current Biology, 2015) : le pays codé 1, 2, 3 traité comme une variable continue ; réanalyse de Shariff et al. (2016), article retiré (août 2019) | `r/lecon-02#1` |
| R 4.2.0 (2022) : if() sur une condition de longueur > 1 devient une erreur ; R 4.3.0 (2023) : && et // aussi | `r/lecon-03#1` |
| R 4.0.0 passe stringsAsFactors à FALSE par défaut (billet de Kurt Hornik, R Blog, 16 février 2020) | `r/lecon-04#1` |
| dplyr 1.0.0 introduit across() et remplace les variantes _if, _at, _all (Hadley Wickham, 3 avril 2020) | `r/lecon-05#1` |
| Hadley Wickham, « Tidy Data » (Journal of Statistical Software, 2014) puis pivot_longer() de tidyr 1.0.0 (13 septembre 2019) | `r/lecon-06#1` |
| BBC Visual and Data Journalism : le package bbplot et le cookbook R pour ggplot2 (janvier 2019) | `r/lecon-07#1` |
| Insee Première n° 2079 : salaires du privé en 2024, moyenne 2 733 euros, médiane 2 190 euros (23 octobre 2025) | `r/lecon-08#1` |
| Ottoboni et Stark, « Random problems with R » (2018) ; R 3.6.0 change l'algorithme de sample() (26 avril 2019), RNGversion / sample.kind | `r/lecon-09#1` |
| REMPLACE ma ligne « Galton 1886 » (sujet libéré : l'année 1886 n'est pas reconnue par la règle) : Challenger, les vols sans incident omis de la comparaison température / dégâts des joints, 36 °F au lancement (rapport de la commission Rogers, 6 juin 1986) | `r/lecon-10#1` |
| Les scripts « Willoughby-Hoye » donnaient des résultats différents selon le système (ordre des fichiers) ; Bhandari Neupane et al., Organic Letters, 8 octobre 2019 | `r/lecon-11#1` |
| Baggerly et Coombes, « Deriving chemosensitivity from cell lines » (Annals of Applied Statistics, 2009) : rapports Sweave et sessionInfo | `r/lecon-12#1` |
| R 4.0.0 (24 avril 2020) ajoute les chaînes brutes r"(...)" : plus besoin de doubler les antislashs des regex | `r/lecon-13#1` |
| Grolemund et Wickham, « Dates and Times Made Easy with lubridate » (JSS, avril 2011) : dates des Lakers lues comme des entiers 20081028 | `r/lecon-14#1` |
| dplyr 1.1.0 : join_by(), avertissement des correspondances multiples, jointures par inégalité et closest() (Davis Vaughan, 31 janvier 2023) | `r/lecon-15#1` |
| purrr 1.0.0 remplace map_dfr() par map() /> list_rbind() (Hadley Wickham, 20 décembre 2022) | `r/lecon-16#1` |
| GDS et DCMS, « Reproducible Analytical Pipelines » : statistiques officielles produites en R, testées, versionnées (Matt Upson, 27 mars 2017) | `r/lecon-17#1` |
| Google, « Memory Safe Languages in Android 13 » : 21 % du nouveau code natif en Rust, failles mémoire de 76 % (2019) à 35 % (2022), zéro faille mémoire dans le code Rust (Jeff Vander Stoep, 1er décembre 2022) | `rust/lecon-01#1` |
| RFC 560 « Integer overflow » (Niko Matsakis, acceptée le 6 février 2015) : le débordement d'entier devient une erreur, vérifiée au moins quand les debug_assert! sont actifs, WrappingOps pour l'arithmétique modulaire voulue | `rust/lecon-02#1` |
| Rust 1.19 : loop peut rendre une valeur par break (RFC 1624, 2016) — langage orienté expressions (blog de Rust, 20 juillet 2017) | `rust/lecon-03#1` |
| Rust 1.65 stabilise let-else : motif réfutable, bloc else divergent (blog de Rust, 3 novembre 2022) | `rust/lecon-04#1` |
| REMPLACE ma ligne « Avis zlib 2002-03-11 » (sujet libéré, foyer naturel plutôt au cours c) : Rust retire ses pointeurs @ à ramasse-miettes — 0.9 (janvier 2014) les met derrière un drapeau, 0.11 (juillet 2014) remplace ~T par Box<T> et @T par Gc<T>, 0.12 (octobre 2014) supprime Gc<T> (RELEASES.md) | `rust/lecon-05#1` |
| Rust 1.31 et Rust 2018 : les durées de vie non lexicales (NLL), le borrow checker accepte let y = &x; let z = &mut x; (blog de Rust, 6 décembre 2018) | `rust/lecon-06#1` |
| RFC 141 d'Aaron Turon, nouvelles règles d'élision des durées de vie : 147 des 169 annotations de libstd évitées, 87 % (2014) | `rust/lecon-07#1` |
| Rust 1.47 : les traits de la bibliothèque standard implémentés pour les tableaux de toute longueur, plus seulement 0..=32, grâce aux const generics (8 octobre 2020) | `rust/lecon-08#1` |
| Rust 1.13 introduit l'opérateur ? à la place de la macro try! (blog de Rust, 10 novembre 2016) | `rust/lecon-09#1` |
| Rust 1.53 : les tableaux implémentent IntoIterator, array.into_iter() garde l'ancien sens jusqu'à Rust 2021 (17 juin 2021) | `rust/lecon-10#1` |
| L'équipe Cargo change sa consigne sur Cargo.lock : plus seulement pour les binaires, cargo new ne l'ignore plus pour les bibliothèques (Ed Page, 29 août 2023) | `rust/lecon-11#1` |
| Manish Goregaokar, « Fearless Concurrency in Firefox Quantum » : Stylo, moteur CSS parallèle en Rust, deux essais en C++ abandonnés, 160 000 lignes de C++ remplacées par 85 000 de Rust (blog de Rust, 14 novembre 2017) | `rust/lecon-12#1` |
| ripgrep d'Andrew Gallant (« ripgrep is faster than {grep, ag, …} », 23 septembre 2016) devient le moteur de recherche de VS Code 1.11 (mars 2017) | `rust/lecon-13#1` |
| RFC 1066 (Alex Crichton, 2015) : un cycle de Rc peut fuir et sauter un destructeur sans unsafe, thread::scoped jugé non sûr (arielb1), mem::forget devient sûr avant Rust 1.0 | `rust/lecon-14#1` |
| Rust 1.27 stabilise la syntaxe dyn Trait pour les objets-traits, Box<Foo> devient Box<dyn Foo> (21 juin 2018) | `rust/lecon-15#1` |
| Jesse Howarth, « Why Discord is switching from Go to Rust » : service Read States, pics de latence du GC de Go toutes les 2 minutes, async sur Rust nightly puis tokio 0.2 (4 février 2020) | `rust/lecon-16#1` |
| RFC 1937 « ? in main » (Zack Weinberg, 2017) : main (Rust 1.26) puis les fonctions #[test] (Rust 1.28, 2 août 2018) peuvent renvoyer Result<(), E> | `rust/lecon-17#1` |
| Rob Pike, « UTF-8 history » (courriel du 30 avril 2003) : Ken Thompson conçoit UTF-8 sur un set de table dans un diner du New Jersey (septembre 1992), Plan 9 converti, frontières de caractères retrouvables | `rust/lecon-18#1` |
| CVE-2022-21658 : std::fs::remove_dir_all suivait un lien symbolique par course TOCTOU (Rust 1.0.0 à 1.58.0), Rust 1.58.1 corrige ; Hans Kratz (Rust Security Response WG, 20 janvier 2022) | `rust/lecon-19#1` |
| Serde 1.0.0 (David Tolnay, 20 avril 2017) : Serde commencé par Erick Tryzelaar en 2014, un null JSON ne se désérialise plus dans une String — succès = l'entrée correspond à la structure | `rust/lecon-20#1` |
| Ticket rust-lang/rust n° 46016 (15 novembre 2017) : println! panique « Broken pipe » dans ./yes | `rust/lecon-21#1` |
| Taskwarrior 3.0.0 (24 mars 2024) : gestionnaire de tâches en ligne de commande, nouveau cœur de stockage TaskChampion écrit en Rust, synchronisation réécrite | `rust/lecon-22#1` |
| Microsoft, « Visual Basic support planned for .NET 5.0 » : VB stable, « we do not plan to evolve Visual Basic as a language » (11 mars 2020) | `vb/lecon-01#1` |
| Office 2010 et VBA 7 : Long sur 4 octets pour les pointeurs, LongPtr, LongLong, PtrSafe (doc. Microsoft « 64-bit Visual Basic for Applications overview ») | `vb/lecon-02#1` |
| Visual Basic .NET 2002 ajoute AndAlso et OrElse, opérateurs à court-circuit (FAQ VB de MSDN, Duncan Mackenzie relayant Paul Vick, 2004 ; doc AndAlso) | `vb/lecon-03#1` |
| Loi n° 2012-1510 du 29 décembre 2012, article 68 : le taux normal de TVA passe de 19,60 % à 20 % au 1er janvier 2014 | `vb/lecon-04#1` |
| Excel ajoute TEXTSPLIT, TEXTBEFORE, TEXTAFTER (Joe McDaid, « Announcing New Text and Array Functions », 16 mars 2022) | `vb/lecon-05#1` |
| Excel ajoute UNIQUE et les tableaux dynamiques (Joe McDaid, « Preview of Dynamic Arrays in Excel », 25 septembre 2018) | `vb/lecon-06#1` |
| Office bloque par défaut les macros VBA des fichiers venus d'Internet (Mark of the Web), Current Channel 2206, 27 juillet 2022 | `vb/lecon-07#1` |
| Klaus Loeffelmann, « Visual Basic WinForms Apps in .NET 5 and Visual Studio 16.8 » : Application Framework, événements reliés par Handles (23 novembre 2020) | `vb/lecon-08#1` |
| Excel annonce Office Scripts en préversion : enregistreur d'actions, éditeur TypeScript, Excel sur le Web (7 janvier 2020) ; doc « Differences between Office Scripts and VBA macros » | `vb/lecon-09#1` |
| Visual Basic 14 (Visual Studio 2015) : une propriété ReadOnly d'interface implémentée par une propriété en lecture-écriture (doc « What's new for Visual Basic ») | `vb/lecon-10#1` |
| LINQ arrive dans Visual Basic avec Visual Studio 2008 (doc « What's new for Visual Basic ») ; clause Aggregate | `vb/lecon-11#1` |
| .NET Core (1.0, 27 juin 2016) : Encoding.Default renvoie toujours UTF-8, la page de codes active sous .NET Framework ; File.WriteAllLines écrit en UTF-8 sans BOM | `vb/lecon-12#1` |
| Framework Design Guidelines (Cwalina et Abrams, 2e éd., 22 octobre 2008) : le motif Try-Parse (DateTime.Parse et TryParse) | `vb/lecon-13#1` |
| Barclays et la faillite de Lehman : 179 contrats cachés dans des lignes masquées d'un tableur réintégrés lors d'une conversion en PDF (Computerworld, 15 octobre 2008) | `vb/lecon-14#1` |
