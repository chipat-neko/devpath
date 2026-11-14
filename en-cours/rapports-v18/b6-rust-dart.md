# Rapport V18 — case B6 (lot 3) : les « Cas réel » des cours `rust` et `dart`

Copie de travail `D:\test-claude-b6-rust-dart`, branche `v18/b6-rust-dart`, partie de `1b45660`.
Scripts dans `scratchpad/b6-rust-dart/` de la copie (ignoré par git) : `contenu-rust.js` et
`contenu-dart.js` (le texte exact de chaque nouvel encadré), `appliquer.js` (remplacement de
l'encadré seul et du texte de l'intertitre `<h2>` collé, avec preuve que tout octet hors de ces
zones est identique, et 0 CR), `options.js` (mots d'options de QCM d'une page, pour tenir
`lexique-diff.js`), `cherche.js` (sujet et source dans tout `pages/`, le registre `foyers.md` et
les fichiers de réservations), `txt.py` (texte d'une page HTML téléchargée), `dt/` (essais Dart)
et `rt/` (essais Rust).

Outils d'exécution : SDK **Dart 3.13.5** (portable, fourni) ; **Rust 1.100.0** (archive
officielle `rust-1.100.0-x86_64-pc-windows-gnu.tar.xz` du 12 novembre 2026, téléchargée dans le
dossier de scratchpad de la copie, empreinte SHA-256 `db93504e…02f` identique à celle du
manifeste `channel-rust-stable.toml`) — voir § 4.

## 1. Bilan

| cours | « Cas réel » | VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | sujet d'un autre cours | vérifié tel quel | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `rust` | 22 | 0 | 7 | 12 | 0 | 3 | 0 | 4 | 18 | 0 |
| `dart` | 16 | 0 | 3 | 12 | 0 | 1 | 0 | 2 | 14 | 0 |
| **total** | **38** | **0** | **10** | **24** | **0** | **4** | **0** | **6** | **32** | **0** |

(« sujet d'un autre cours » : le récit est réel mais son foyer est ailleurs — Tony Hoare
à `csharp/lecon-08` pour `rust/lecon-04` et `dart/lecon-02`, Ariane 5 à `ada/lecon-07` pour
`rust/lecon-02`, Heartbleed raconté deux fois par le cours `c` (`c/lecon-11`, `c/lecon-16`), son
foyer naturel, pour `rust/lecon-03`.)

Le cours `rust` mêlait des produits nommés aux détails faux ou gonflés (Serde dont une erreur de
champ « surgit à la compilation » — c'est une erreur de désérialisation, à l'exécution ; Stylo
après « près d'une décennie » et « quinze ans de C++ » — la source dit deux essais ; ripgrep
« sur des dizaines de millions de machines » ; Android « sous les 20 % » — le billet de 2022 dit
35 %) et, à partir de la leçon 9, des récits anonymes (« un service Rust », « une équipe
d'astreinte », « une petite boutique en ligne »). Stylo y était raconté deux fois (`lecon-05` et
`lecon-12`), ripgrep trois fois (`lecon-13`, `lecon-15`, `lecon-21`), Serde deux fois (`lecon-08`
et `lecon-20`) : chaque sujet n'est plus que dans sa leçon la plus proche (Stylo à la
concurrence, ripgrep au projet CLI, Serde au JSON). Le cours `dart` racontait surtout des usages
généraux de Flutter et des listes d'entreprises (« Nubank, Google Pay, Alibaba, BMW ont réécrit des
applications entières ») sans source, BMW revenant dans quatre leçons (`01`, `10`, `11`, `12`) et
Nubank dans deux (`01`, `11`).

Les 38 cas sont maintenant **datés, nommés et sourcés** ; chaque affirmation a été confrontée à
une source **ouverte** (téléchargée avec `curl` et lue en texte, ou ouverte avec WebFetch ; API
GitHub pour les tickets, demandes de fusion, dates et noms des comptes). Toutes les sources sont
primaires (annonces de version, RFC, avis de sécurité, tickets, billets d'ingénierie, documentation
officielle) ; aucune source de presse. Chaque sujet est réservé dans
`D:\test-claude\scratchpad\v18-parallele\b6-reservations.txt` (39 lignes `rust/…` et `dart/…` :
une par cas, plus celle qui remplace ma première réservation de `rust/lecon-05`),
après lecture du registre `foyers.md`, recherche du sujet et de l'URL dans tout `pages/`, et
relecture des réservations des autres agents : aucun conflit.

Sujets écartés parce qu'un autre cours les raconte déjà : la panne de Cloudflare du 18 novembre
2025 (un `unwrap()` en Rust, envisagée pour `rust/lecon-09`, déjà à `python/lecon-12`), Cloudbleed
(`js/lecon-05`), les collisions de hachage de 2011 (`java/lecon-11`, `algo/lecon-09`), les
identifiants `id_str` de Twitter (`formats/lecon-10`), le chiffre de 70 % de failles mémoire de
Microsoft et Chrome (`c/lecon-14`), Bun réécrit en Rust (`zig/lecon-10`).

Nature : *événement* (fait daté), *produit* (produit ou document nommé), *anonyme* (récit sans
sujet identifiable), *général* (usage général présenté comme un cas).

## 2. Cas par cas — `rust`

Les encadrés des leçons 1 à 16 et 22 ont un intertitre `<h2>Un cas réel : …</h2>` collé
au-dessus : son texte après les deux-points est changé pour dire le nouveau cas (séparateur
d'origine gardé), sauf aux leçons 12 et 16, dont le sujet reste. Les leçons 17 à 21 n'en ont pas.

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/rust/lecon-01.html#1` | INEXACT, événement : « sous les 20 % » de failles mémoire absent du billet de 2022 (76 % en 2019, 35 % en 2022) ; « 70 % » de Microsoft et Google (sujet de `c/lecon-14`) ; noyau Linux non sourcé | corrigé, même sujet (Android) : 21 % du nouveau code natif en Rust, 1,5 million de lignes, 76 % → 35 %, zéro faille mémoire dans le code Rust | Cas réel — Android 13 et le code Rust (2022) | https://security.googleblog.com/2022/12/memory-safe-languages-in-android-13.html |
| `pages/rust/lecon-02.html#1` | événement réel, foyer `ada/lecon-07` (registre) ; non revérifié ici | remplacé par : la RFC 560, le débordement d'entier devient une erreur vérifiée en debug | Cas réel — la RFC 560 et le débordement d'entier (2015) | https://rust-lang.github.io/rfcs/0560-integer-overflow.html ; API GitHub de la PR rust-lang/rfcs n° 560 (auteur `nikomatsakis` = Niko Matsakis, fusion le 6 février 2015) |
| `pages/rust/lecon-03.html#1` | événement réel (Heartbleed), raconté deux fois par le cours `c`, son foyer naturel ; non revérifié ici | remplacé par : Rust 1.19, `loop` rend une valeur par `break` (RFC 1624), et `eprint!`/`eprintln!` | Cas réel — Rust 1.19 et la valeur rendue par `loop` (2017) | https://blog.rust-lang.org/2017/07/20/Rust-1.19/ ; https://rust-lang.github.io/rfcs/1624-loop-break-value.html ; API GitHub de la PR n° 1624 |
| `pages/rust/lecon-04.html#1` | événement réel (Tony Hoare), foyer `csharp/lecon-08` | remplacé par : Rust 1.65 stabilise `let`-`else` | Cas réel — Rust 1.65 et `let`-`else` (2022) | https://blog.rust-lang.org/2022/11/03/Rust-1.65.0/ |
| `pages/rust/lecon-05.html#1` | INEXACT, produit (Stylo) : « convaincu l'industrie », « souvent bien plus rapide » sans source ; même sujet que `lecon-12` | remplacé par : Rust retire ses pointeurs `@` à ramasse-miettes (0.9, 0.11, 0.12) avant 1.0. Premier choix écarté : la double libération de zlib 1.1.3 (avis de 2002, vérifié), libérée dans les réservations parce que son foyer naturel est plutôt le cours `c` (double libération en C) | Cas réel — Rust renonce à son ramasse-miettes (2014) | https://github.com/rust-lang/rust/blob/master/RELEASES.md (version brute, sections 0.9, 0.11, 0.12, 1.0.0) ; https://www.zlib.net/advisory-2002-03-11.txt (premier choix, non cité) |
| `pages/rust/lecon-06.html#1` | INVÉRIFIABLE, général (B2 : comparaison C++/Java/Rust sans sujet) | remplacé par : Rust 2018 et les durées de vie non lexicales (NLL) | Cas réel — Rust 2018 et les durées de vie non lexicales (2018) | https://blog.rust-lang.org/2018/12/06/Rust-1.31-and-rust-2018/ |
| `pages/rust/lecon-07.html#1` | INEXACT, produit (B2) : dans `httparse`, `value` est un `&'a [u8]`, pas un `&'a str` ; « des millions de requêtes » sans source ; ni date ni événement | remplacé par : la RFC 141 d'Aaron Turon, 87 % des annotations de libstd évitées | Cas réel — la RFC 141 et l'élision des durées de vie (2014) | https://rust-lang.github.io/rfcs/0141-lifetime-elision.html ; API GitHub de la PR n° 141 (auteur `aturon` = Aaron Turon) |
| `pages/rust/lecon-08.html#1` | INEXACT, produit (Serde) : « si un champ ne correspond pas, l'erreur surgit à la compilation » est faux (erreur de désérialisation, à l'exécution) ; « presque tous les projets Rust » sans source ; Serde a sa leçon (`lecon-20`) | remplacé par : Rust 1.47, les traits des tableaux de plus de 32 éléments, puis les const generics de 1.51 | Cas réel — Rust 1.47 et les tableaux de plus de 32 éléments (2020) | https://blog.rust-lang.org/2020/10/08/Rust-1.47/ ; https://blog.rust-lang.org/2021/03/25/Rust-1.51.0/ |
| `pages/rust/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« un service Rust lit sa configuration ») | remplacé par : Rust 1.13 introduit l'opérateur `?` à la place de `try!` | Cas réel — Rust 1.13 et l'opérateur `?` (2016) | https://blog.rust-lang.org/2016/11/10/Rust-1.13/ |
| `pages/rust/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« un outil doit compter les lignes d'erreur ») | remplacé par : Rust 1.53, `IntoIterator` pour les tableaux et l'exception de `.into_iter()` jusqu'à Rust 2021 | Cas réel — Rust 1.53 : `IntoIterator` pour les tableaux (2021) | https://blog.rust-lang.org/2021/06/17/Rust-1.53.0/ |
| `pages/rust/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« une équipe développe un service ») | remplacé par : l'équipe Cargo change sa consigne sur `Cargo.lock` (Ed Page, 2023) | Cas réel — Cargo change sa consigne sur `Cargo.lock` (2023) | https://blog.rust-lang.org/2023/08/29/committing-lockfiles/ |
| `pages/rust/lecon-12.html#1` | INEXACT, événement : « près d'une décennie » et « quinze ans de C++ » (la source dit : deux essais en C++, tous deux échoués) ; « Firefox 57 » et « tous les cœurs » absents de la source | corrigé, même sujet : rayon, `Arc<T>`, référence immuable vers le style du parent, 160 000 lignes de C++ → 85 000 de Rust, page d'Amazon 30 % plus rapide | Cas réel — Stylo, le moteur CSS parallèle de Firefox (2017) | https://blog.rust-lang.org/2017/11/14/Fearless-Concurrency-In-Firefox-Quantum/ |
| `pages/rust/lecon-13.html#1` | INEXACT, produit : « plus rapide que grep » (le billet dit qu'aucun outil ne le dépasse nettement), « avec clap », « des dizaines de millions de machines » sans source | corrigé, même sujet : le billet de 2016 (25 mesures) et VS Code 1.11 (mars 2017) | Cas réel — ripgrep, de la ligne de commande à VS Code (2016-2017) | https://blog.burntsushi.net/ripgrep/ ; https://code.visualstudio.com/updates/v1_11 |
| `pages/rust/lecon-14.html#1` | INVÉRIFIABLE, général (« le bug le plus courant chez les développeurs iOS ») | remplacé par : la RFC 1066 — un cycle de `Rc` fait sauter un destructeur sans `unsafe`, `thread::scoped` non sûr, `mem::forget` devient sûr | Cas réel — la RFC 1066 et le cycle de `Rc` qui fuit (2015) | https://rust-lang.github.io/rfcs/1066-safe-mem-forget.html ; API GitHub de la PR n° 1066 (auteur `alexcrichton` = Alex Crichton, fusion le 7 mai 2015) |
| `pages/rust/lecon-15.html#1` | INVÉRIFIABLE, général (« performances égales au cycle près ») ; ripgrep déjà en `lecon-13` | remplacé par : Rust 1.27 stabilise `dyn Trait` | Cas réel — Rust 1.27 et la syntaxe `dyn Trait` (2018) | https://blog.rust-lang.org/2018/06/21/Rust-1.27/ |
| `pages/rust/lecon-16.html#1` | INEXACT, événement : « Cloudflare ou AWS (Firecracker) » absents de la source ; le reste confirmé | corrigé, même sujet : pics toutes les deux minutes, GC forcé, cache LRU, nightly puis tokio 0.2 | Cas réel — Discord passe de Go à Rust (2020) | https://discord.com/blog/why-discord-is-switching-from-go-to-rust |
| `pages/rust/lecon-17.html#1` | INVÉRIFIABLE, anonyme (« une petite boutique en ligne écrite en Rust ») | remplacé par : RFC 1937 (« `?` in `main` »), `main` dans Rust 1.26, tests dans Rust 1.28 | Cas réel — des tests qui renvoient un `Result` (Rust 1.28, 2018) | https://rust-lang.github.io/rfcs/1937-ques-in-main.html ; https://github.com/rust-lang/rust/blob/master/RELEASES.md (version brute) ; https://blog.rust-lang.org/2018/05/10/Rust-1.26/ (contrôle) ; API GitHub (`zackw` = Zack Weinberg) |
| `pages/rust/lecon-18.html#1` | INVÉRIFIABLE, anonyme (« un réseau social limite un message à 280 caractères ») | remplacé par : Rob Pike raconte la naissance d'UTF-8 (1992) | Cas réel — UTF-8, dessiné sur un set de table (1992) | https://www.cl.cam.ac.uk/~mgk25/ucs/utf-8-history.txt |
| `pages/rust/lecon-19.html#1` | INVÉRIFIABLE, anonyme (« une équipe d'astreinte cherchait pourquoi… ») | remplacé par : CVE-2022-21658, `remove_dir_all` et la course TOCTOU | Cas réel — `remove_dir_all` et le lien symbolique (CVE-2022-21658, 2022) | https://blog.rust-lang.org/2022/01/20/cve-2022-21658/ |
| `pages/rust/lecon-20.html#1` | INVÉRIFIABLE, anonyme (« un service météo répond par du JSON ») | remplacé par : Serde 1.0 (David Tolnay, 2017), le `null` qui ne se désérialise plus dans une chaîne | Cas réel — Serde 1.0 (2017) | https://github.com/serde-rs/serde/releases/tag/v1.0.0 (et l'API GitHub de la version) |
| `pages/rust/lecon-21.html#1` | INVÉRIFIABLE, général (« ce qui a fait le succès de ripgrep ») ; ripgrep déjà en `lecon-13` | remplacé par : ticket n° 46016, `println!` panique « Broken pipe » | Cas réel — le « Broken pipe » de `println!` (2017) | https://github.com/rust-lang/rust/issues/46016 (et son API : date, auteur `infinity0` = Ximin Luo, 20 commentaires, ouvert) |
| `pages/rust/lecon-22.html#1` | INVÉRIFIABLE, anonyme (« une équipe d'astreinte gérait sa liste d'incidents ») | remplacé par : Taskwarrior 3.0.0 et son cœur TaskChampion en Rust | Cas réel — Taskwarrior 3.0 et TaskChampion (2024) | https://github.com/GothenburgBitFactory/taskwarrior/releases/tag/v3.0.0 (API GitHub ; `djmitche` = Dustin J. Mitchell) ; README du dépôt ; https://taskwarrior.org/docs/upgrade-3/ |

## 3. Cas par cas — `dart`

Aucun intertitre collé au-dessus des encadrés de ce cours (vérifié).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/dart/lecon-01.html#1` | INVÉRIFIABLE, produits : « Nubank, Google Pay, Alibaba, BMW ont réécrit des applications entières », sans source (Nubank : voir `lecon-11`) | remplacé par : Dart 2.6 et dart2native | Cas réel — Dart 2.6 et dart2native (2019) | https://dart.dev/blog/announcing-dart-2-6-with-dart2native-compile-dart-to-self-contained-native-executables ; https://dart.dev/tools/dart-compile |
| `pages/dart/lecon-02.html#1` | événement réel (Tony Hoare), foyer `csharp/lecon-08` | remplacé par : Dart 2.12 et le bogue de l'outil `flutter` (`version?.major`) | Cas réel — Dart 2.12 et le bogue de l'outil flutter (2021) | https://dart.dev/blog/announcing-dart-2-12 |
| `pages/dart/lecon-03.html#1` | INVÉRIFIABLE, général (B2) | remplacé par : Dart 2.3, spread, collection if, collection for | Cas réel — Dart 2.3, des collections pensées pour les interfaces (2019) | https://dart.dev/blog/announcing-dart-2-3-optimized-for-building-user-interfaces |
| `pages/dart/lecon-04.html#1` | INVÉRIFIABLE, général (« ouvre le code d'un widget Flutter ») | remplacé par : Dart 2.17, les arguments nommés n'importe où | Cas réel — Dart 2.17 : des arguments nommés n'importe où (2022) | https://dart.dev/blog/dart-2-17-productivity-and-integration |
| `pages/dart/lecon-05.html#1` | INVÉRIFIABLE, général (« toute app mobile qui parle à un serveur ») | remplacé par : l'équipe Dart arrête les macros, dont le but premier était la sérialisation | Cas réel — Dart renonce aux macros (2025) | https://dart.dev/blog/an-update-on-dart-macros-data-serialization |
| `pages/dart/lecon-06.html#1` | INVÉRIFIABLE, général (« presque tout écran d'app mobile… » ; Riverpod et flutter_bloc cités sans source) | remplacé par : Dart 3, `sealed` et les modificateurs de classe | Cas réel — Dart 3 et les classes `sealed` (2023) | https://dart.dev/blog/announcing-dart-3 |
| `pages/dart/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« l'écran d'accueil d'un réseau social » ; « cause n° 1 des démarrages lents » sans source) | remplacé par : Dart 1.9 apporte `async`/`await` | Cas réel — Dart 1.9 apporte `async` et `await` (2015) | https://news.dartlang.org/2015/03/dart-19-release-youve-been-await-ing-for.html |
| `pages/dart/lecon-08.html#1` | INVÉRIFIABLE, général (« un écran de messagerie, WhatsApp, Discord… ») | remplacé par : David Morgan, « Dart gets a type system » (la `List<TempFile>` qui acceptait un `BankAccount`) | Cas réel — en Dart 1, une `List<TempFile>` acceptait un compte bancaire (2017) | https://dart.dev/blog/dart-gets-a-type-system |
| `pages/dart/lecon-09.html#1` | INEXACT, produit : « passer `dart format` sans changement » ne figure pas parmi les critères ; « remonte moins bien » vrai (les pub points comptent dans le classement) ; sans date | corrigé, même sujet, daté par le lancement de 2020 | Cas réel — les pub points de pub.dev (2020) | https://dart.dev/blog/introducing-a-brand-new-pub-dev ; https://pub.dev/help/scoring ; https://pub.dev/help/search |
| `pages/dart/lecon-10.html#1` | INVÉRIFIABLE, général (« dans un studio, un designer… ») ; Google Pay, Xianyu, My BMW « ont choisi Flutter » pour le hot reload, sans source | remplacé par : le hot reload arrive sur le web (Flutter 3.32 puis 3.35) | Cas réel — le hot reload arrive sur le web (2025) | https://flutter.dev/blog/whats-new-in-flutter-3-32 ; https://flutter.dev/blog/whats-new-in-flutter-3-35 |
| `pages/dart/lecon-11.html#1` | INEXACT, événement : Nubank n'a pas « réécrit son app » (Flutter retenu pour les nouvelles fonctions, l'ancien code migré peu à peu) ; « aux dizaines de millions de clients » et My BMW sans source | corrigé, même sujet : le billet de Nubank (groupe de travail, onze critères, tests d'usage) | Cas réel — Nubank choisit Flutter (2019) | https://building.nubank.com/why-we-think-flutter-will-help-us-scale-mobile-development-at-nubank/ ; https://flutter.dev/showcase/nubank (contrôle, non citée : non datée) |
| `pages/dart/lecon-12.html#1` | INVÉRIFIABLE, produits : Google Ads, eBay Motors, BMW « ont choisi Flutter » pour la mise en page, sans source | remplacé par : Wonderous passe aux tablettes et aux écrans pliables (`Flex`, `MediaQuery`) | Cas réel — Wonderous passe aux tablettes et aux écrans pliables (2023) | https://flutter.dev/blog/wonderous-explore-the-world-with-flutter ; https://flutter.dev/blog/adapting-wonderous-to-larger-device-formats |
| `pages/dart/lecon-13.html#1` | INVÉRIFIABLE, anonyme (« une boutique en ligne a un panier… ») | remplacé par : provider à la Google I/O 2019, et l'exemple du panier de la documentation | Cas réel — Flutter met en avant provider (Google I/O 2019) | https://flutter.dev/blog/a-roundup-of-flutter-news-at-google-i-o (le lien « state management » mène à pub.dev/packages/provider) ; https://docs.flutter.dev/data-and-backend/state-mgmt/simple |
| `pages/dart/lecon-14.html#1` | INVÉRIFIABLE, général (« tu cliques sur un lien de partage ») | remplacé par : John Ryan, Navigator 2.0 et l'API Router (2020) | Cas réel — Navigator 2.0 et les URL du web (2020) | https://flutter.dev/blog/learning-flutters-new-navigation-and-routing-system |
| `pages/dart/lecon-15.html#1` | INEXACT, général (B2) : la réponse `/weather` d'OpenWeatherMap ne contient pas de prévisions ; le 404 « ville inconnue » n'est pas documenté | remplacé par : paquet `http`, ticket n° 175 (latin1 par défaut), correction dans `http` 1.4.0 | Cas réel — le paquet http et les accents abîmés (2018-2025) | https://github.com/dart-lang/http/issues/175 ; https://github.com/dart-lang/http/pull/1422 ; https://github.com/dart-lang/http/issues/367 (contrôle : ancien texte de la doc) ; https://pub.dev/packages/http/changelog ; https://pub.dev/packages/http/versions ; https://pub.dev/documentation/http/latest/http/Response/body.html (contrôle) |
| `pages/dart/lecon-16.html#1` | INVÉRIFIABLE, général (« une app de gestion de stock en boutique ») | remplacé par : Wolt et sa Picker App, premier essai Flutter devenu l'appli des commerçants | Cas réel — la Picker App de Wolt (2023) | https://careers.wolt.com/en/blog/tech/scaling-our-merchant-app-with-flutter ; https://flutter.dev/showcase/wolt (contrôle, non citée) |

## 4. Comportements testés

**Dart 3.13.5** (`dt/` ; `PUB_CACHE` dans le dossier de scratchpad) :
- `List<int>.generate(growable: false, 3, (i) => i * i)` compile et rend `[0, 1, 4]` (nommé avant positionnel, Dart 2.17).
- Le `switch` du billet de Dart 3 sans `Pig` : `Error: The type 'Animal' is not exhaustively matched by the switch cases since it doesn't match 'Pig()'.` — texte identique au billet.
- `List<TempFile>.from([TempFile(), BankAccount()])` : `type 'BankAccount' is not a subtype of type 'TempFile'` à l'exécution.
- `final int major = version?.major;` : `A value of type 'int?' can't be assigned to a variable of type 'int'.`
- spread, collection if et collection for : liste attendue.
- Paquet `http`, serveur local (port choisi par le système) qui renvoie `Content-Type: application/json` sans charset et `{"nom":"PEÑA"}` en UTF-8 : **1.3.0** rend un `body` abîmé (`PEÃ…`, `jsonDecode` ≠ `PEÑA`) et `utf8.decode(bodyBytes)` le bon texte ; **1.4.0** et **1.6.0** rendent `PEÑA`.

**Rust 1.100.0** (`rt/` ; les composants `rustc`, `rust-std`, `rust-mingw` et `cargo` de l'archive
assemblés en un sysroot dans le dossier de scratchpad ; `CARGO_HOME` aussi) :
- NLL : `let mut x = 5; let y = &x; let z = &mut x;` compile (éditions 2015, 2018 et 2021) ; avec
  `y` utilisé après, `error[E0502]: cannot borrow `x` as mutable because it is also borrowed as
  immutable` et la note `immutable borrow later used here`.
- `let x = loop { break 7; };` rend 7 ; `let Some(n) = x else { return -1; };` ; `?` sur
  `File::open("username.txt")` absent rend `Err(NotFound)` ; `println!("{:?}", [0; 34])` affiche
  les 34 zéros.
- Débordement : un `u8` valant 255 **à l'exécution**, plus 1, panique en debug (`attempt to add
  with overflow`) et donne 0 en release (`-O`).
- `[1, 2, 3].into_iter().collect()` : `Vec<&i32>` en édition 2018 (avec l'avertissement « will
  resolve to `<[T; N] as IntoIterator>::into_iter` in Rust 2021 »), `Vec<i32>` en édition 2021.
- Cycle de deux `Rc` (via `RefCell`) : aucun `Drop` n'est appelé.
- `Box<Foo>` sans `dyn` : avertissement « trait objects without an explicit `dyn` are deprecated »
  en éditions 2015 et 2018, erreur `E0782` en édition 2021 (le cas décrit l'état de 1.27, où le
  lint était désactivé par défaut, ce que dit la source).
- Une fonction `#[test]` qui renvoie `Result<(), ParseIntError>` : `Ok` passe, un `?` sur
  `Err` fait échouer le test (`Error: ParseIntError { kind: InvalidDigit }`).
- `"déjà prêt ! 😀"` : `len()` = 19 octets, `chars().count()` = 13.
- Ticket 46016 : `fn main() { loop { println!("y"); } }` dans `./yes_rs.exe | head -n1` (Git Bash,
  Windows) affiche `y` puis **panique encore** en 1.100.0 — sous Windows le message est
  `failed printing to stdout: Le canal de communication est sur le point d'être fermé. (os error
  232)` au lieu du `Broken pipe (os error 32)` d'Unix cité par le ticket ; code de sortie 101.
- Serde (`serde` 1.0.229, `serde_json` 1.0.154) : `{"ville": null}` dans un champ `String` →
  `invalid type: null, expected a string at line 1 column 14` ; dans un `Option<String>` → `None`.

## 5. Décomptes et contrôles

- Lus : **38** « Cas réel » (rust 22, dart 16). Trouvés : VRAI 0, INEXACT 10, INVÉRIFIABLE 24,
  INVENTÉ 0, sujets réels d'un autre cours 4. Actions : **32 remplacés**, **6 corrigés**,
  **0 vérifié tel quel**, **0 renommé « Scénario »**.
- Conformes à la règle : rust 0 → **22**, dart 0 → **16** (site, dans cette copie : 543 → **581**
  sur 1 551).
- `lexique-diff.js D:\test-claude-b6-rust-dart 1b45660` : premier jet **53 écarts**, ramenés à
  **4** en reformulant (mot d'option entré remplacé par un autre — « détecté », « portée »,
  « annotations », « acceptée », « ordinaire »… — ou mot d'option sorti avec l'ancien récit remis
  dans une phrase vraie — « tampon », « bornes », « bibliothèque », « introuvable », « mobile »,
  « développeur », « séquence »…). Les 4 restants :
  - « source » GAGNÉ dans `dart/lecon-11`, `rust/lecon-17`, `rust/lecon-21` : il vient de la
    ligne de source obligatoire (`<p class="cas-reel__source">Source&nbsp;: …`), donc
    inévitable — même cas qu'au lot 2 (`git/lecon-22`, `nodejs/lecon-08`, `-17`, `-23`). Effet
    mesuré avec `mesure-lexique-qcm.js` sur l'état de base et l'état final : `rust` reste à 60
    questions exploitables sur 76 (cours non traité) ; `dart` reste à 0 exploitable sur 60.
  - « longues » GAGNÉ dans `dart/lecon-11`, **voulu** : le « source » de la classe a retiré un
    mot étranger au distracteur 3 de la question 2 (« … quand la liste source change … »), et le
    cliquet lexical a rougi (`dart` INVERSE/restreint 0,0 % → 33,3 %). « longues », présent dans
    les trois autres options, remet les quatre à 3 mots étrangers (règle du `k`) : cliquet vert,
    sortie de `mesure-lexique-qcm.js --liste=dart` identique à l'octet à celle de la base.

Codes de sortie (dernier état) :

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=rust` | **0** (22 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=dart` | **0** (16 conformes) |
| `node tools/verif-contenu.js --strict` | **0** (1 leçon « maigre », préexistante) |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js` | 4 écarts, expliqués ci-dessus |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées entre cours (les deux légitimes, inchangé) |
| `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b6-rust-dart 1b45660` | **OK** — 2 commits, 38 pages, zones « Cas réel » 38 avant / 38 après, 0 CR, octets identiques hors « Cas réel », types gardés, signatures |
| fins de ligne (node) | 0 CR dans `pages/rust/` et `pages/dart/` |
| `node tools/verif.js --rapide` | **1** — 51 étapes vertes sur 54 (425,7 s) ; les trois rouges sont ceux que la consigne tolère : `donnees` pour l'invariant **I18** seul (`search-index.js` périmé, +3 449 octets à la régénération ; I17 et I19 ne sont que des avertissements), `doc-ref` (la page de cours du cours `doc` doit citer le nombre de leçons qui renvoient à un document, mesuré **114**) et `doc-rec` (la leçon 04 du cours `doc` doit publier « **575** citent la source »). Aucun autre rouge. |

## 6. Ce qui reste ouvert

Hors des encadrés, non touché (« ne touche à rien d'autre dans la leçon ») :

1. **`pages/rust/lecon-02.html`, encadré « Piège fréquent » (§ débordement)** : « En mode debug
   (`cargo run`), `255u8 + 1` provoque une panique `attempt to add with overflow` ». Testé avec
   rustc 1.100.0 : écrite en constante, cette addition est **refusée à la compilation**
   (`error: this arithmetic operation will overflow`, lint `arithmetic_overflow` refusé par
   défaut) ; la panique ne vaut que pour une valeur connue à l'exécution (testée, § 4). Le nouveau
   « Cas réel » parle d'un `u8` « qui va au-delà de 255 » sans reprendre l'exemple littéral.
2. **Heartbleed** reste raconté deux fois par le cours `c` (`c/lecon-11`, `c/lecon-16`) : à
   trancher au lot 4 (B7).
3. **Nubank** : le cours `clojure` raconte Nubank et Clojure (`clojure/lecon-01`, `lecon-08`), un
   autre sujet que le choix de Flutter (`dart/lecon-11`) ; signalé pour le registre.
4. **Le mot « source »** entre dans toute page dont une option de QCM le contient et que rien
   d'autre ne nommait : c'est la ligne de source obligatoire. Au lot 2 comme ici, l'effet sur
   les cliquets est nul ; mais `lexique-diff.js` le comptera à chaque lot. Piste pour
   l'orchestrateur : ignorer dans `lexique-diff.js` le texte de `<p class="cas-reel__source">`
   et l'attribut `class`, comme le fait déjà `recours.js` du cours `doc` pour les liens.

## 7. Consignes de fusion

- Branche `v18/b6-rust-dart`, commits listés dans la réponse de l'agent ; pas de commit de
  fusion ; seuls `pages/rust/lecon-*.html`, `pages/dart/lecon-*.html` et ce rapport changent.
- À régénérer après la fusion (rouges tolérés de `--rapide`) : `search-index.js` (I18),
  et les chiffres du cours `doc` (`doc-ref` : « leçons qui renvoient à un document » ;
  `doc-rec` : « N citent la source »), qui bougent avec les 38 nouvelles lignes de source.
- Registre `foyers.md` : ajouter les 38 sujets (dernière réservation de chaque cas ; pour
  `rust/lecon-05`, la ligne « REMPLACE ma ligne Avis zlib » — le sujet zlib est libre).
- Contre-relecture : les cas qui citent deux documents (`rust/lecon-03`, `-08`, `-13`, `-17`,
  `-22` ; `dart/lecon-01`, `-09`, `-10`, `-12`, `-13`, `-15`) demandent d'ouvrir les deux ; les
  dates de version Rust anciennes (0.9, 0.11, 0.12, 1.0.0, 1.26.0, 1.28.0) viennent de
  `RELEASES.md` ; les noms d'auteurs des RFC et tickets, de l'API GitHub (§ 2).
