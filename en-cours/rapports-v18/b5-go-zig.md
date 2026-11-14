# Rapport V18 — case B5 (lot 2) : les « Cas réel » des cours `go` et `zig`

Copie de travail `D:\test-claude-b5-go-zig`, branche `v18/b5-go-zig`, partie de `1b8d94b`.
Scripts : `scratchpad/b5-go-zig/` de la copie (ignoré par git) — `contenu-go.js` et
`contenu-zig.js` (le texte exact de chaque nouvel encadré), `fr.js` (espaces insécables, `code`),
`appliquer.js` (remplacement de l'encadré seul et de l'intertitre collé, avec preuve que tout octet
hors de ces zones est identique, et 0 CR), `options.js` (mots d'options de QCM, pour tenir
`lexique-diff.js` à 0), `cherche.js` (sujet et source dans tout `pages/` et dans les réservations),
`gt/` et `zt/` (programmes d'essai Go et Zig).

Outils d'exécution téléchargés en version portable officielle dans le dossier de scratchpad de la
session (jamais dans le système ni dans le dépôt), empreintes SHA-256 vérifiées contre celles
publiées : **Go 1.27.4** (go.dev), **Zig 0.17.1** et **Zig 0.14.1** (ziglang.org).

## 1. Bilan

| cours | « Cas réel » | trouvés VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié (mis en forme) | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `go` | 18 | 0 | 1 | 17 | 0 | 0 | 0 | 18 | 0 |
| `zig` | 19 | 2 | 8 | 9 | 0 | 2 | 6 | 11 | 0 |
| **total** | **37** | **2** | **9** | **26** | **0** | **2** | **6** | **29** | **0** |

Le cours `go` ne racontait que des récits anonymes (« une équipe », « un service », « un
développeur ») ; le seul cas déjà vérifié en B2 (`go/lecon-17`) était INEXACT. Le cours `zig`
mêlait des illustrations générales et des cas sur des produits nommés, dont plusieurs faux : **Bun
n'est plus écrit en Zig** (réécriture en Rust annoncée le 8 juillet 2026), Uber ne vise pas Windows
et écrit bien du Zig, le serveur HTTP de la bibliothèque standard n'a pas d'arène par requête, la
`vtable` d'`Allocator` a quatre fonctions. Bun était en outre raconté deux fois dans le cours
(`lecon-01` et `lecon-10`), et `std.ArrayList` deux fois (`lecon-11` et `lecon-17#1`).

Les 37 cas sont maintenant **datés, nommés et sourcés** ; chaque affirmation a été confrontée à une
source **ouverte** (WebFetch ou `curl`, URL listées ci-dessous). Tout sujet est réservé dans
`D:\test-claude\scratchpad\v18-parallele\b5-reservations.txt` (37 lignes `go/…` et `zig/…`), après
lecture du registre `foyers.md`, recherche du sujet et de l'URL dans tout `pages/` et relecture des
réservations des autres agents : aucun conflit. Aucune source de presse : toutes sont primaires
(post-mortems, blogs d'ingénierie, notes de version, tickets, code source, CVE).

Comportements techniques **testés** (Go 1.27.4, Zig 0.14.1 et 0.17.1) : récepteur par valeur du
ticket 21066 (la modification est perdue) ; interface `error` qui porte un `*MyError` nil
(`err != nil` vrai) ; `fmt.Errorf` avec `%v` (`errors.Is` faux) et `%w` (vrai, à deux niveaux) ;
le motif de Let's Encrypt (`&v` d'une variable de `range`) — 1 pointeur distinct sur 3 dans un
module `go 1.21`, 3 sur 3 dans un module `go 1.22` ; les six formats des tickets `fmt` de 2015
(ne paniquent plus) ; JSON d'un `time.Time` nul avec `omitempty` (`"0001-01-01T00:00:00Z"`) et
`omitzero` (omis) ; `bufio.Scanner` sur une ligne de 70 Ko (`bufio.Scanner: token too long`,
`MaxScanTokenSize` = 65 536) ; l'exemple des notes de Go 1.26 et le profil `goroutineleak` de Go 1.27
(4 goroutines signalées, à la ligne de l'envoi) ; Zig : affichage d'une `struct` par `{}` et
erreur « too few arguments », `switch` incomplet sur `std.json.Value` (« switch must handle all
possibilities », note « unhandled enumeration value: 'object' »), slices du tokenizer qui pointent
dans le tampon du source. Les fichiers de la bibliothèque standard cités sur Codeberg (étiquette
`0.14.1`) sont identiques, octet pour octet hors CR, à ceux de l'archive officielle 0.14.1.

Nature : *événement* (fait daté), *produit* (produit ou document nommé), *anonyme* (récit sans
sujet identifiable), *général* (usage général présenté comme un cas).

## 2. Cas par cas — `go`

Chaque encadré du cours `go` a un intertitre `<h2>Un cas réel : …</h2>` collé au-dessus : le texte
après les deux-points est changé pour dire le nouveau cas (le séparateur d'origine, `&nbsp;:` ou
` :`, est laissé tel quel).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/go/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« une équipe distribuait un outil en Python ») | remplacé par : Rob Pike, « Go at Google » — 4,2 Mo de C++ devenus 8 Go à la compilation, imports inutilisés interdits, `gofmt` | Cas réel — Rob Pike explique pourquoi Go compile vite (2012) | https://go.dev/talks/2012/splash.article |
| `pages/go/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« un service Go ouvrait une connexion ») | remplacé par : le bogue de `CopyFile` du billet « Defer, Panic, and Recover », et le `defer` quasi gratuit de Go 1.14 | Cas réel — le bogue de `CopyFile` sur le blog de Go (2010) | https://go.dev/blog/defer-panic-and-recover ; https://go.dev/doc/go1.14 |
| `pages/go/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« une API Go », B2) | remplacé par : bogue de revérification CAA de Let's Encrypt (`&v` d'une variable de `range` dans Boulder), changement de Go 1.22 | Cas réel — Let's Encrypt et la variable de boucle (2020) | https://bugzilla.mozilla.org/show_bug.cgi?id=1619047 (WebFetch ; `curl` refusé) ; https://community.letsencrypt.org/t/2020-02-29-caa-rechecking-bug/114591 (contrôle) ; https://go.dev/blog/loopvar-preview ; https://go.dev/doc/devel/release (dates) |
| `pages/go/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« une boutique en ligne ») | remplacé par : ticket Go n° 21066, méthode `Init` à récepteur par valeur | Cas réel — le ticket Go n° 21066 et le récepteur par valeur (2017) | https://github.com/golang/go/issues/21066 (et l'API GitHub du ticket, de ses commentaires et de l'utilisateur `randall77` = Keith Randall) |
| `pages/go/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« un service Go exposait `valider` ») | remplacé par : proposition n° 22729 d'Ian Lance Taylor et la FAQ `nil_error` | Cas réel — la proposition Go n° 22729 sur le `nil` des interfaces (2017) | https://github.com/golang/go/issues/22729 ; https://go.dev/doc/faq#nil_error |
| `pages/go/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« une API de paiement ») | remplacé par : Go 1.13, `%w`, `errors.Is`/`As` | Cas réel — Go 1.13 apprend à envelopper les erreurs (2019) | https://go.dev/blog/go1.13-errors ; https://go.dev/doc/devel/release |
| `pages/go/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« un service Go mettait en cache des sessions ») | remplacé par : « Data Race Patterns in Go » d'Uber (≈ 2 000 courses de données, map, mutex par valeur, `WaitGroup`) ; détection des accès concurrents aux maps de Go 1.6 | Cas réel — les courses de données du code Go d'Uber (2022) | https://www.uber.com/blog/data-race-patterns-in-go/ (WebFetch ; `curl` 406) ; https://go.dev/doc/go1.6 |
| `pages/go/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« une équipe migrait un service ») ; de plus, même récit que `lecon-14` (champ JSON en minuscule) | remplacé par : le faux module `github.com/boltdb-go/bolt` et le cache du proxy de modules | Cas réel — le faux module `boltdb-go/bolt` (2025) | https://socket.dev/blog/malicious-package-exploits-go-module-proxy-caching-for-persistence |
| `pages/go/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« 90 % de couverture ») | remplacé par : `fmt` couvert à 91,7 % (2013) et ses six paniques « index out of range » trouvées par go-fuzz (2015) | Cas réel — le paquet `fmt`, sa couverture et go-fuzz (2013-2015) | https://go.dev/blog/cover ; https://github.com/dvyukov/go-fuzz (et son README brut, liste « Trophies ») ; https://github.com/golang/go/issues/10675 ; tickets 10674, 10695, 10745, 10770, 10771, 10945, 11376 (API GitHub) |
| `pages/go/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« 900 Mo → 12 Mo ») | remplacé par : ticket n° 4674 (2013) et `Server.Shutdown` de Go 1.8 (2017) | Cas réel — `Server.Shutdown`, du ticket n° 4674 à Go 1.8 (2013-2017) | https://github.com/golang/go/issues/4674 ; https://go.dev/doc/go1.8 |
| `pages/go/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« un service d'agrégation ») | remplacé par : le profil `goroutineleak` (expérimental dans Go 1.26, général dans Go 1.27), travail de Vlad Saioc (Uber) | Cas réel — le profil `goroutineleak` de Go 1.26 et 1.27 (2026) | https://go.dev/doc/go1.26 ; https://go.dev/doc/go1.27 |
| `pages/go/lecon-12.html#1` | INVÉRIFIABLE, anonyme (« reflect mangeait 40 % du CPU ») | remplacé par : Russ Cox profile le benchmark de Robert Hundt (11 fois plus rapide) | Cas réel — Russ Cox et le benchmark de Robert Hundt (2011) | https://go.dev/blog/pprof |
| `pages/go/lecon-13.html#1` | INVÉRIFIABLE, anonyme (« un petit service Go », slowloris) | remplacé par : Filippo Valsorda (Cloudflare), « So you want to expose Go on the Internet » ; ajouts de Go 1.8 | Cas réel — Cloudflare expose des serveurs Go sur Internet (2016) | https://blog.cloudflare.com/exposing-go-on-the-internet/ ; https://go.dev/doc/go1.8 |
| `pages/go/lecon-14.html#1` | INVÉRIFIABLE, anonyme (« une API partenaire ») | remplacé par : proposition n° 11939 (`omitempty` et `time.Time`, 2015) et `omitzero` de Go 1.24 (2025) | Cas réel — `omitempty`, `time.Time` et l'option `omitzero` (2015-2025) | https://github.com/golang/go/issues/11939 ; https://github.com/golang/go/issues/45669 (contrôle) ; https://go.dev/doc/go1.24 ; https://pkg.go.dev/encoding/json |
| `pages/go/lecon-15.html#1` | INVÉRIFIABLE, anonyme (« un outil interne générait un rapport CSV ») | remplacé par : tickets n° 6714 et 18990 de Brad Fitzpatrick, commit de Caleb Spare, `strings.Builder` dans Go 1.10 | Cas réel — `strings.Builder` entre dans Go 1.10 (2018) | https://github.com/golang/go/issues/6714 ; https://github.com/golang/go/issues/18990 ; https://go.googlesource.com/go/+/37b056948d058679efa4e87fb6c9b2a2ddfa31a3 (objet du commit lu en `?format=TEXT`) ; https://go.dev/doc/go1.10 |
| `pages/go/lecon-16.html#1` | INVÉRIFIABLE, anonyme (« un développeur arrivant de Python ») ; de plus `YYYY` n'est pas une syntaxe de Python (c'est `%Y`) | remplacé par : la seconde intercalaire du 1er janvier 2017 chez Cloudflare (RRDNS, durée négative, `rand.Int63n`), proposition d'horloge monotone, Go 1.9 | Cas réel — Cloudflare et la seconde intercalaire (1er janvier 2017) | https://blog.cloudflare.com/how-and-why-the-leap-second-affected-cloudflare-dns/ ; https://go.googlesource.com/proposal/+/master/design/12914-monotonic.md ; https://go.dev/doc/go1.9 ; https://pkg.go.dev/time |
| `pages/go/lecon-17.html#1` | INEXACT, anonyme (B2) : `strings.Split` ne recopie pas le texte (sous-chaînes partagées) ; le doublement vient de `string(data)` | remplacé par : logrus, `Writer()` et la ligne de plus de 64 Ko (`bufio.Scanner: token too long`), CVE-2025-65637 | Cas réel — logrus et la ligne trop longue pour `bufio.Scanner` (2023) | https://github.com/sirupsen/logrus/issues/1370 ; PR n° 1376 et versions 1.8.3, 1.9.1, 1.9.3 (API GitHub) ; https://github.com/sirupsen/logrus/releases/tag/v1.9.3 ; https://cveawg.mitre.org/api/cve/CVE-2025-65637 ; https://pkg.go.dev/bufio ; README de logrus |
| `pages/go/lecon-18.html#1` | INVÉRIFIABLE, anonyme (« une équipe avait écrit un petit outil ») | remplacé par : les avertissements de kubectl 1.19 sur stderr et `--warnings-as-errors` | Cas réel — les avertissements de kubectl sur stderr (2020) | https://kubernetes.io/blog/2020/09/03/warnings/ ; https://github.com/kubernetes/kubernetes/blob/master/cmd/kubectl/kubectl.go (et sa version brute : kubectl est écrit en Go) |

## 3. Cas par cas — `zig`

Aucun intertitre collé au-dessus des encadrés de ce cours (vérifié). Les cas sur la bibliothèque
standard sont **ancrés à Zig 0.14.1** (21 mai 2025) : c'est la version où le code du cours compile
(voir § 5), et elle est datée.

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/zig/lecon-01.html#1` | INEXACT, produit : « Bun est écrit en Zig » (réécrit en Rust, 2026) ; « sa vitesse doit beaucoup au contrôle bas niveau » et « de nombreux projets » sans source ; même sujet que `lecon-10` | remplacé par : Andrew Kelley présente Zig (2016) | Cas réel — Andrew Kelley présente Zig (2016) | https://andrewkelley.me/post/intro-to-zig.html |
| `pages/zig/lecon-02.html#1` | INVÉRIFIABLE, général (« lire un en-tête binaire ») | remplacé par : Git sous Windows (LLP64), `unsigned long` de 32 bits, fichiers de 5 Go tronqués à 1 Go | Cas réel — Git sous Windows et le `long` de 32 bits (2021) | https://github.com/gitgitgadget/git/pull/1068 (texte de la série et chronologie : « integrated into master via git@f9ba6ac ») ; notes de Git 2.35.0 (contrôle, non citées) |
| `pages/zig/lecon-03.html#1` | INVÉRIFIABLE, général (« un programme lit un réglage ») | remplacé par : `??` devient `orelse` dans Zig 0.3.0 ; exemple `malloc` de la référence 0.14 | Cas réel — `??` devient `orelse` dans Zig 0.3.0 (2018) | https://ziglang.org/download/0.3.0/release-notes.html ; https://ziglang.org/documentation/0.14.1/#Optionals ; https://ziglang.org/download/index.json (dates) |
| `pages/zig/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« un analyseur de journaux ») | remplacé par : le compilateur Zig garde ses jetons sans copier leur texte (5 octets par jeton, 0.8.0 ; `tokenSlice` de `std.zig.Ast`) | Cas réel — le compilateur Zig garde ses jetons sans copier leur texte (2021) | https://ziglang.org/download/0.8.0/release-notes.html (§ « Reworked Memory Layout ») ; https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/zig/Ast.zig ; `lib/std/zig/tokenizer.zig` 0.14.1 |
| `pages/zig/lecon-05.html#1` | INVÉRIFIABLE, général (« une interface qui récupère des données ») | remplacé par : `std.json.Value`, `union(enum)` à huit variantes, et son `switch` | Cas réel — `std.json.Value`, une union étiquetée de la bibliothèque standard (2025) | https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/json/dynamic.zig |
| `pages/zig/lecon-06.html#1` | INVÉRIFIABLE, général (« un serveur … une arène par requête » ; même sujet que `lecon-12`) | remplacé par : TigerBeetle, aucune allocation après le démarrage | Cas réel — TigerBeetle, une base de données sans allocation dynamique (2022) | https://tigerbeetle.com/blog/2022-10-12-a-database-without-dynamic-memory/ ; https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md ; README de TigerBeetle |
| `pages/zig/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« un outil en ligne de commande ») | remplacé par : Zig 0.2.0 renomme `%return`, `%defer`, `%%` en `try`, `errdefer`, `catch` ; traces de retour d'erreur | Cas réel — Zig 0.2.0 renomme ses opérateurs d'erreur (2018) | https://ziglang.org/download/0.2.0/release-notes.html |
| `pages/zig/lecon-08.html#1` | VRAI, produit (bibliothèque standard) | vérifié au code de 0.14.1 (`formatType` : méthode `format`, sinon `@typeInfo` et `inline for` ; même mécanisme dans `json/stringify.zig`) et testé ; mis en forme, complété par l'erreur « too few arguments » | Cas réel — l'affichage formaté de la bibliothèque standard (Zig 0.14, 2025) | https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/fmt.zig ; https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/json/stringify.zig |
| `pages/zig/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« plusieurs équipes d'ingénierie ») | remplacé par : l'annonce de `zig cc` (musl, mingw-w64, glibc en sources ; 46 cibles, 42 glibc, LuaJIT) | Cas réel — Andrew Kelley présente `zig cc` (2020) | https://andrewkelley.me/post/zig-cc-powerful-drop-in-replacement-gcc-clang.html |
| `pages/zig/lecon-10.html#1` | INEXACT, produit : « son cœur est écrit en Zig » (Bun 1.4.0 est la première version en Rust) ; « l'absence de ramasse-miettes … explique ses performances » sans source | corrigé à la source, même sujet : Bun quitte Zig pour Rust, et la réponse d'Andrew Kelley | Cas réel — Bun quitte Zig pour Rust (2026) | https://bun.com/blog/bun-in-rust ; https://andrewkelley.me/post/my-thoughts-bun-rust-rewrite.html ; https://bun.sh/blog/bun-v1.0 (contrôle) ; README de Bun (« It's written in Rust », contrôle) |
| `pages/zig/lecon-11.html#1` | INEXACT, produit : `ArrayList` ne contient pas « littéralement » `return struct { … }` (il renvoie `ArrayListAligned(T, null)`) ; même sujet que `lecon-17#1` | remplacé par : `std.MultiArrayList` (Zig 0.8.0), un type fabriqué par `comptime` | Cas réel — `std.MultiArrayList` arrive dans Zig 0.8.0 (2021) | https://ziglang.org/download/0.8.0/release-notes.html (§ « MultiArrayList ») ; https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/multi_array_list.zig ; version 0.8.0 du même fichier (contrôle) |
| `pages/zig/lecon-12.html#1` | INEXACT, général (B2) : le serveur HTTP de la bibliothèque standard n'utilise pas d'arène par requête | corrigé : l'arène par requête de http.zig (Karl Seguin) | Cas réel — l'arène par requête de http.zig (2024) | https://openmymind.net/Leveraging-Zigs-Allocators/ ; https://github.com/karlseguin/http.zig (README, § « Memory and Arenas ») |
| `pages/zig/lecon-13.html#1` | INEXACT, événement (Uber) : la source ne parle pas de cgo ; cibles Linux x86_64 et arm64 seulement, macOS sur une flotte dédiée, rien sur Windows ; « ni Uber n'écrit de Zig » est faux (le lanceur de hermetic_cc_toolchain est en Zig) ; « quelques dizaines de mégaoctets » absent | corrigé à la source, même sujet | Cas réel — Uber compile son C et son C++ avec `zig cc` (2023) | https://www.uber.com/blog/bootstrapping-ubers-infrastructure-on-arm64-with-zig/ (WebFetch ; `curl` 406) |
| `pages/zig/lecon-14.html#1` | INEXACT, produit : « n'importe quel fichier » (généralisation), l'allocateur de test « garantit » qu'aucune structure ne fuit (il signale les fuites des allocations qui passent par lui) | corrigé, même sujet : les 30 blocs `test` de `array_list.zig` (0.14.1), `testing.allocator`, « Report Memory Leaks », doctests | Cas réel — les tests de `std/array_list.zig` (Zig 0.14, 2025) | https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/array_list.zig ; https://ziglang.org/documentation/0.14.1/#Zig-Test (§ « Doctests », « Report Memory Leaks ») |
| `pages/zig/lecon-15.html#1` | VRAI, produit (B2), avec une nuance : sous Windows et WASI les arguments ne passent pas ainsi | vérifié au code de 0.14.1 ; précisé (`std.os.argv` indisponible sous WASI et Windows sans libc, WTF-8 sous Windows, `argsFree`) et mis en forme | Cas réel — les arguments du programme dans la bibliothèque standard (Zig 0.14, 2025) | https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/os.zig ; https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/process.zig |
| `pages/zig/lecon-16.html#1` | INVÉRIFIABLE, général (« un serveur web reçoit des dizaines de connexions ») | remplacé par : Ghostty passe à trois threads par fenêtre (files MPSC, mutex, débit + 400 %) | Cas réel — Ghostty passe à trois threads par fenêtre (2022) | https://github.com/ghostty-org/ghostty/commit/01040326795c4662c81e3a1e7967163009cbb74d (message du commit, et son `.patch`) ; https://mitchellh.com/writing/ghostty-and-useful-zig-patterns ; README de Ghostty |
| `pages/zig/lecon-17.html#1` | INEXACT, produit : la `struct` a les champs `items`, `capacity` et `allocator` (pas « une longueur » à part) ; depuis Zig 0.15.1, `BoundedArray` est retiré et `SinglyLinkedList` n'est plus générique | corrigé, même sujet, ancré à 0.14.1, avec le changement de 0.15.1 | Cas réel — `std.ArrayList`, une fonction qui fabrique un type (Zig 0.14 et 0.15, 2025) | https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/array_list.zig ; https://ziglang.org/download/0.15.1/release-notes.html ; `lib/std/std.zig` de 0.17.1 (contrôle) |
| `pages/zig/lecon-17.html#2` | INEXACT, produit : la `vtable` a quatre fonctions (`alloc`, `resize`, `remap`, `free`) ; en 0.14, `std.io.Writer` est générique (`GenericWriter`), c'est `std.io.AnyWriter` qui suit la recette | corrigé, même sujet | Cas réel — `std.mem.Allocator` est une interface (Zig 0.14, 2025) | https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/mem/Allocator.zig ; https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/Random.zig ; https://codeberg.org/ziglang/zig/src/tag/0.14.1/lib/std/io/Writer.zig ; `lib/std/io.zig` 0.14.1 |
| `pages/zig/lecon-18.html#1` | INVÉRIFIABLE, général (« des projets réels l'emploient déjà ») | remplacé par : ncdu 2, réécrit en Zig (mémoire, binaires statiques, et l'avertissement sur la stabilité de Zig) | Cas réel — ncdu 2, un outil en ligne de commande réécrit en Zig (2021) | https://dev.yorhel.nl/doc/ncdu2 ; https://dev.yorhel.nl/ncdu |

## 4. Décomptes et contrôles

- Lus : **37** « Cas réel » (go 18, zig 19). Trouvés : VRAI 2, INEXACT 9, INVÉRIFIABLE 26,
  INVENTÉ 0. Actions : **29 remplacés**, **6 corrigés**, **2 vérifiés** (mis en forme et
  précisés), **0 renommé « Scénario »**.
- Conformes à la règle : go 0 → **18**, zig 0 → **19** (site : 354 → 391 sur 1 551 dans cette copie).
- `lexique-diff.js D:\test-claude-b5-go-zig 1b8d94b` : **0 écart** sur les 36 pages. Premier jet :
  go 25 écarts puis 4, zig 27 puis 2, ramenés à 0 en reformulant : un mot d'option entré (« fuient »,
  « ramasse-miettes », « recopie », « démarrage », « version »…) remplacé par un autre plus court,
  ou un mot d'option sorti avec l'ancien récit (« cohérence », « réflexion », « python »,
  « horodatage », « convention »…) réintroduit dans une phrase vraie.

Codes de sortie (dernier état, après les deux commits de cours) :

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=go` | **0** (18 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=zig` | **0** (19 conformes) |
| `node tools/verif-contenu.js --strict` | **0** (1 leçon « maigre », `os/lecon-04`, préexistante) |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js` | 0 écart |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées entre cours (les deux légitimes, inchangé) |
| fins de ligne (node) | 0 CR dans `pages/go/` et `pages/zig/` |
| `node tools/verif.js --rapide` | **1** — 52 étapes vertes sur 54 (246,0 s) ; les deux rouges sont ceux que la consigne tolère : `donnees` pour l'invariant **I18** seul (`search-index.js` périmé, +4 862 octets à la régénération) et `doc-rec` (la page du cours `doc` doit publier le nombre de leçons qui citent la source de leur « Cas réel » : mesuré **388** dans cette copie) ; `doc-ref` est vert. Aucun autre rouge. |

## 5. Ce qui reste ouvert (hors des encadrés, non touché : « ne touche à rien d'autre »)

1. **`pages/zig/lecon-02.html`, § « Pas de conversions implicites » : le code affirme une erreur
   qui n'existe pas.** `const a: u8 = 200; const b: i32 = 50; const c = a + b;` est commenté
   « erreur : types différents », et le texte dit que « mélanger un u8 et un i32 exige une
   conversion explicite ». Testé : ce code **compile** et vaut `250`, de type `i32`, avec Zig 0.14.1
   comme avec 0.17.1 (la résolution des types pairs élargit `u8` en `i32`, conversion sans perte).
   Zig refuse les conversions qui **perdent** de l'information (un `i32` vers un `u8`), pas
   celles-ci. Le schéma et sa légende répètent l'erreur. À corriger par l'orchestrateur (et un QCM
   en dépend peut-être).
2. **Le cours `zig` est écrit pour Zig ≤ 0.14** : `std.heap.GeneralPurposeAllocator` n'existe plus
   dans Zig 0.17.1 (erreur de compilation testée), et `std.ArrayList(T).init(allocator)` (API
   « managée ») n'est plus celle de `std.ArrayList` depuis 0.15.1 (août 2025). Le même programme
   compile avec 0.14.1. Le cours n'annonce aucune version. Les « Cas réel » sur la bibliothèque
   standard sont donc ancrés à 0.14.1, et `lecon-17#1` signale le changement de 0.15.1. À
   traiter en phase E (fraîcheur) : annoncer la version visée, ou mettre le code à jour.
3. **Bun n'est plus écrit en Zig** : le corps de `pages/zig/lecon-10.html` (« Le célèbre runtime Bun
   (alternative à Node.js) est écrit en Zig — une vitrine de ses capacités ») et
   `pages/zig/cours.html` (« il alimente déjà des projets de pointe comme le runtime Bun ») sont
   devenus faux le 8 juillet 2026. L'encadré de `lecon-10` raconte désormais cette réécriture ;
   les deux phrases hors encadré restent à corriger.
4. Les intertitres « Un cas réel : … » de `go/lecon-03` à `go/lecon-18` séparent par une espace
   ordinaire avant les deux-points (préexistant, laissé tel quel).
5. **Cas où j'ai douté**, à regarder en contre-relecture :
   - `zig/lecon-10` (Bun) : sujet récent et contesté ; l'encadré s'en tient aux faits du billet de
     Jarred Sumner et à une phrase de la réponse d'Andrew Kelley ; les accusations personnelles du
     second billet ne sont pas reprises. La 1.4.0 était en « canary » à la date du billet : l'encadré
     dit « sera, écrit-il, la première en Rust ».
   - `zig/lecon-09` : « 46 cibles » est mon décompte de la liste `zig targets | jq .libc` publiée
     dans le billet (le billet ne donne pas le nombre).
   - `zig/lecon-02` (Git sous Windows) : sujet de C et de Git, placé dans `zig` pour la notion
     (taille des entiers) ; réservé, et absent de tout `pages/` au moment de l'écriture — à
     inscrire au registre pour que le cours `git` ne le reprenne pas.
   - `go/lecon-07` : le billet d'Uber ne nomme pas l'outil de détection ; l'encadré dit « un
     système de détection dynamique ». La phrase finale (« la parade est dans cette leçon ») est un
     lien pédagogique, pas une affirmation d'Uber.
   - `go/lecon-08` (« À la réflexion ») et `go/lecon-16` (dernière phrase, formats et `%Y` de
     Python) : tournures choisies pour garder des mots d'options de QCM ; leurs affirmations sont
     vraies (documentation du paquet `time` : les opérations qui « disent l'heure » lisent l'horloge
     murale).
   - `go/lecon-18` : sujet Kubernetes ; le cours `kubernetes` (B9) pourrait le vouloir ; foyer
     proposé : `go/lecon-18` (la notion est stdout/stderr d'un outil en ligne de commande).

## 6. Consignes de fusion

- Branche `v18/b5-go-zig`, trois commits au-dessus de `1b8d94b` : go, zig, rapport. Fichiers
  touchés : `pages/go/lecon-01` à `-18`, `pages/zig/lecon-01` à `-18`, ce rapport. Aucun QCM,
  aucun `js/data.js`, aucun index dérivé.
- Après fusion : régénérer les index dérivés (`build-index.js`), puis vérifier `doc-ref` /
  `doc-rec` (36 leçons de plus citent la source de leur « Cas réel » : 388 mesurées dans cette copie, `zig/lecon-17` en ayant deux).
- **Registre des foyers** (`tools/cas-reels/lots/foyers.md`), sujets pris par ce lot qu'un autre
  cours pourrait vouloir : Let's Encrypt et la variable de boucle, 2020 (`go/lecon-03`) ;
  Cloudflare et la seconde intercalaire, 2017 (`go/lecon-16`) ; Cloudflare, « So you want to
  expose Go on the Internet », 2016 (`go/lecon-13`) ; Uber, « Data Race Patterns in Go », 2022
  (`go/lecon-07`) ; le faux module `boltdb-go/bolt`, 2025 (`go/lecon-08`) ; logrus et
  CVE-2025-65637 (`go/lecon-17`) ; avertissements de kubectl sur stderr, 2020 (`go/lecon-18`) ;
  Rob Pike, « Go at Google », 2012 (`go/lecon-01`) ; Russ Cox, « Profiling Go Programs », 2011
  (`go/lecon-12`) ; Git sous Windows et le `long` de 32 bits, 2021 (`zig/lecon-02`) ; TigerBeetle
  sans allocation dynamique, 2022 (`zig/lecon-06`) ; l'annonce de `zig cc`, 2020 (`zig/lecon-09`) ;
  Bun réécrit en Rust, 2026 (`zig/lecon-10`) ; Uber et `zig cc`, 2023 (`zig/lecon-13`) ; Ghostty
  et ses threads, 2022 (`zig/lecon-16`) ; ncdu 2 réécrit en Zig, 2021 (`zig/lecon-18`).
- Les trois points du § 5 (1 à 3) sont hors encadré : à confier à l'orchestrateur.
