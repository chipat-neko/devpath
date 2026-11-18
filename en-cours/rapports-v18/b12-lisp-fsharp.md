# Rapport V18 — case B12, lot 9 : les cours `lisp` et `fsharp` (copie `b12-lisp-fsharp`, branche `v18/b12-lisp-fsharp`)

Copie de travail `D:\test-claude-b12-lisp-fsharp`, partie de `8c65449`. Part traitée : les **29 « Cas réel »**
des cours `lisp` (15, un par leçon) et `fsharp` (14, un par leçon). Scripts et pièces dans
`scratchpad/b12-lisp-fsharp/` (ignoré par git) : `dump.js`, `contexte.js`, `section.js` (les encadrés et leur
section), `cherche.js` (un sujet dans tout `pages/`, dans `foyers.md` et dans les réservations du lot), `appliquer.js`
(remplace du titre de l'encadré au `</div></div>` final ; refuse un titre absent ou multiple, un CR, un lien hors de
la ligne de source, une source qui n'est pas en dernier, une faute de typographie ; prouve que les octets hors de
l'encadré sont identiques ; annonce les mots d'options de QCM qui entrent ou sortent de la page), `options-mot.js`,
`lisp-cas.js` et `fsharp-cas.js` (les 29 titres, corps et sources), les essais F# `t-*.fsx`, les PDF et pages lus.

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **15 hors de la règle à 0** pour `lisp` et de
**14 à 0** pour `fsharp` ; sur les 29 cas trouvés, **aucun n'était gardable tel quel** ; **15 remplacés** par un cas réel
daté et sourcé sur la même notion, **14 gardés sur leur sujet et corrigés**, **0 « Scénario »**.

**Commits** (branche `v18/b12-lisp-fsharp`) : `0f4be5a` (lisp, 15 cas : 8 remplacés, 7 corrigés), `e306360` (fsharp,
14 cas : 7 remplacés, 7 corrigés), puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` final ; type d'encadré gardé
  (`note` partout, `tip` pour `lisp/lecon-15`). Aucun intertitre `<h2>`/`<h3>` n'est collé au-dessus d'un de ces 29
  encadrés : aucun touché. `controle-branche.js` : octets identiques hors « Cas réel », types gardés, 0 CR.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ; aucun lien
  dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; `<` écrit `&lt;` dans le code.
- **Un sujet = un seul cours, un seul cas** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` et dans
  `b12-reservations.txt`, puis réservé (29 lignes, aucune collision). Doublons internes trouvés et réglés : Viaweb deux
  fois dans `lisp` (02, 08 → gardé en 08), Jet.com **trois** fois dans `fsharp` (01, 06, 10 → gardé en 10, où l'article
  source parle justement d'application partielle), les workflows async de 2007 deux fois (07, 11 → gardé en 07).
  Foyers d'autres cours respectés : MapReduce (`data-eng`) retiré de `lisp/06`, bloc `go` de core.async
  (`clojure/lecon-11`) et Nubank (`clojure/lecon-01`) retirés de `lisp/08` et `lisp/10`, appels terminaux de WebKit
  (`js/lecon-18`) retirés de `lisp/11`, Tony Hoare (`csharp/lecon-08`) retiré de `fsharp/06`, Mars Climate Orbiter
  (`tests/lecon-12`) retiré de `fsharp/02` et `fsharp/09`, la naissance de QuickCheck (`haskell/lecon-11`) absente de
  `fsharp/13` (qui ne parle que de FsCheck).
- **Dialectes de Lisp nommés à chaque fois** : Common Lisp (01, 08, 10), le tout premier Lisp de McCarthy (02, 05, 15),
  Scheme et ses rapports R5RS, R6RS, R7RS (04, 06, 09, 11), Emacs Lisp (07, 14), Racket (13), Clojure (02).
- **Comportements rejoués** avec .NET 10 (`dotnet fsi`, SDK 10.0.404) : l'unité inférée `float<m/s>` de
  `sqrt (2.0 * 9.81<m/s^2> * 3.5<m>)` et le refus de `hauteur + g` (FS0001) ; `List.map (fun s -> s.Length) data` sans
  pipe refusé (FS0072), avec pipe accepté ; un pipeline sur deux millions d'entiers ; `Result.bind` qui s'arrête à la
  première `Error` ; le motif ET `(a, _) & (_, b)` ; `Array.chunkBySize 3 [|0;0;0;0|]` (correct aujourd'hui) ;
  l'exemple `ParseRegex` de l'article ICFP 2007, recopié : **il ne permute rien**, la liste des groupes commençant par
  la correspondance entière (groupe 0) — il faut `[_; l; r]`. Une source primaire qui se trompe, dite dans le cas.
- **Presse** : aucune. Toutes les sources sont primaires (article, rapport, RFC, SRFI, notes de version, ticket et
  commit, blog ou billet de l'auteur, communiqué de l'entreprise, fiche du NIST). Copies tierces ou archivées :
  l'article de McCarthy (1960) est la copie retapée par l'auteur sur son site (« Copied with minor notational changes
  from CACM, April 1960 » ; le PDF de l'ACM refuse le téléchargement) ; le communiqué de Google sur ITA (1er juillet 2010)
  est cité dans sa copie de l'Internet Archive (le site d'origine est derrière une vérification Cloudflare) ; le PDF de
  l'article ICFP 2007 a été lu dans sa copie de l'Internet Archive (le serveur de Microsoft Research répondait 502), la
  ligne de source renvoie à la page de publication de Microsoft Research ; la fiche NVD CVE-2024-39331 ne s'affiche qu'en
  JavaScript, son contenu a été lu par l'API du NVD.

## Les 29 cas

États : VRAI / INEXACT / INVÉRIFIABLE / INVENTÉ ; nature : événement, produit nommé, anonyme, général.

### Cours `lisp` (15)

| Cas | État trouvé (nature) | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/lisp/lecon-01.html#1` | INEXACT (événement) : le Remote Agent écrit « en partie » en Common Lisp (la source : *entièrement*) ; la correction « en évaluant du code dans le REPL » n'est pas dans la source | **corrigé** : ce que dit Ron Garret, sans plus (deux jours de mai 1999, situation de concurrence absente des essais au sol, REPL « inestimable ») | Cas réel — Deep Space 1 déboguée au REPL (1999) | https://flownet.com/gat/jpl-lisp.html |
| `pages/lisp/lecon-02.html#1` | VRAI dans l'ensemble (produit nommé), mais doublon de `lecon-08` ; « Clojure en tête » sans source | **remplacé** par la naissance des S-expressions (M-expressions abandonnées, notation imprévue d'`eval`) | Cas réel — les S-expressions, une notation imprévue (1960) | http://www-formal.stanford.edu/jmc/history/lisp/node3.html (et `lisp.html`, version du 12/02/1979) ; https://clojure.org/reference/reader |
| `pages/lisp/lecon-03.html#1` | INVÉRIFIABLE (général : AutoLISP et EDN, sans date ni source) | **remplacé** par la RFC 9804 (S-expressions de SDSI/SPKI) | Cas réel — les S-expressions de SPKI deviennent la RFC 9804 (2025) | https://www.rfc-editor.org/rfc/rfc9804.html (et `.txt`) |
| `pages/lisp/lecon-04.html#1` | INVÉRIFIABLE (général : « lambda a conquis tous les langages », AWS Lambda) | **remplacé** par Brendan Eich et les fonctions de première classe « à la Scheme » | Cas réel — JavaScript et les fonctions « à la Scheme » (1995) | https://brendaneich.com/2008/04/popularity/ |
| `pages/lisp/lecon-05.html#1` | INVÉRIFIABLE (général : parcours d'arbres) | **remplacé** par la factorielle récursive de l'article de 1960 (cas de base, non-terminaison) | Cas réel — la factorielle récursive de McCarthy (1960) | http://www-formal.stanford.edu/jmc/recursive.pdf (section 2d) |
| `pages/lisp/lecon-06.html#1` | VRAI (B2, événement) mais sujet au foyer `data-eng` (MapReduce) | **remplacé** par la SRFI 1 d'Olin Shivers | Cas réel — SRFI 1, la bibliothèque de listes de Scheme (1999) | https://srfi.schemers.org/srfi-1/srfi-1.html ; https://srfi.schemers.org/srfi-1/ |
| `pages/lisp/lecon-07.html#1` | VRAI sur Emacs 24.1 (2012) ; « Scheme a repris la structure de blocs d'ALGOL 60 » et « Common Lisp a adopté » non vérifiés (événement) | **corrigé** : un seul sujet, Emacs Lisp et `lexical-binding` (24.1, 27.1, 30.1) | Cas réel — Emacs Lisp passe à la portée lexicale (2012) | https://git.savannah.gnu.org/cgit/emacs.git/plain/etc/NEWS.24 ; …/NEWS.27 ; …/NEWS.30 ; …/etc/HISTORY |
| `pages/lisp/lecon-08.html#1` | INEXACT (produit nommé) : le bloc `go` de core.async (foyer `clojure`) et `#lang` de Racket sans source ; Viaweb exact | **corrigé** : Viaweb seul, ses macros, Rtml et les paramètres par mot-clé de Common Lisp, les « 20-25 % de macros » | Cas réel — Viaweb, une boutique en ligne faite de macros (1995) | https://paulgraham.com/avg.html ; https://paulgraham.com/lib/paulgraham/bbnexcerpts.txt (et https://paulgraham.com/lwba.html) |
| `pages/lisp/lecon-09.html#1` | INVÉRIFIABLE (général : « Redis n'est qu'une gigantesque table de hachage ») | **remplacé** par la bibliothèque `(rnrs hashtables (6))` du R6RS et sa justification | Cas réel — R6RS normalise les tables de hachage de Scheme (2007) | http://www.r6rs.org/ ; http://www.r6rs.org/final/r6rs-lib.pdf (ch. 13) ; http://www.r6rs.org/final/r6rs-rationale.pdf (§ 24) |
| `pages/lisp/lecon-10.html#1` | INEXACT (produit nommé) : « c'est aujourd'hui le cœur de Google Flights » (présent non sourcé), « des milliards de combinaisons » absent de la source, Nubank (foyer `clojure`) et Walmart sans source ; 700 M$ exacts | **corrigé** : le courriel de Carl de Marcken (Common Lisp, CMUCL et Franz, 200 000 lignes) et le communiqué de Google | Cas réel — ITA Software cherche les vols en Common Lisp (2001) | https://paulgraham.com/carl.html ; https://web.archive.org/web/2010id_/http://investor.google.com/releases/2010/0701.html ; https://googleblog.blogspot.com/2010/07/taking-off-with-ita.html (ouvert, ne donne pas le prix) |
| `pages/lisp/lecon-11.html#1` | INEXACT (produit nommé) : « on code donc *toutes* les boucles ainsi » (généralisation), JavaScript « directement inspiré de Scheme » sans source et sujet au foyer `js/lecon-18`, SBCL sans source ; R5RS/R7RS exact | **corrigé** : R7RS, section 3.5, ses contextes terminaux et son exemple | Cas réel — R7RS exige les appels terminaux (2013) | https://small.r7rs.org/attachment/r7rs.pdf |
| `pages/lisp/lecon-12.html#1` | VRAI selon B2, mais la formule entre guillemets n'est dans aucune source telle quelle (deux phrases de deux auteurs, Norman Adams et Christian Queinnec, que van Straaten réunit) ; « tout l'écosystème » JavaScript sans source | **corrigé** : SICP 3.1.1 et le koan rendus à leurs auteurs ; partie JavaScript retirée | Cas réel — le koan des fermetures et des objets (2003) | https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book-Z-H-20.html (et `book-Z-H-2.html`, © 1996) ; https://people.csail.mit.edu/gregs/ll1-discuss-archive-html/msg03277.html |
| `pages/lisp/lecon-13.html#1` | INVÉRIFIABLE (produits nommés, sans date ni source : `loop`, `syntax-rules`, Racket) | **remplacé** par « Languages as Libraries » (macros hygiéniques de Racket, `do-10-times`, Typed Racket) | Cas réel — « Languages as Libraries » et Typed Racket (2011) | https://www2.ccs.neu.edu/racket/pubs/pldi11-thacff.pdf |
| `pages/lisp/lecon-14.html#1` | INVÉRIFIABLE (général : « le même piège dans tous les langages », OWASP sans source) | **remplacé** par la version d'urgence d'Emacs 29.4 et d'Org 9.7.5 (CVE-2024-39331) | Cas réel — Emacs 29.4, une version d'urgence (2024) | https://list.orgmode.org/87sex5gdqc.fsf@localhost/ ; https://lists.gnu.org/archive/html/info-gnu-emacs/2024-06/msg00000.html ; https://nvd.nist.gov/vuln/detail/CVE-2024-39331 (via l'API du NVD) ; …/etc/NEWS.29 |
| `pages/lisp/lecon-15.html#1` | VRAI sur McCarthy 1960 ; partie Emacs générale, sans source (produit nommé) | **corrigé** : `eval`/`apply` (§ 3f), APPLY sur IBM 704 (§ 4f), S. R. Russell (History of Lisp) ; Emacs retiré | Cas réel — eval et apply, du papier à l'IBM 704 (1960) | http://www-formal.stanford.edu/jmc/recursive.pdf ; http://www-formal.stanford.edu/jmc/history/lisp/node3.html |

### Cours `fsharp` (14)

| Cas | État trouvé (nature) | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/fsharp/lecon-01.html#1` | INEXACT (produit nommé) : « l'essentiel de son back-end » et « l'immuabilité et le pattern matching réduisent les bugs » absents de la source, « très prisé en finance quantitative » sans source ; doublon de 06 et 10 | **remplacé** par la naissance de F# (« Caml.NET », décembre 2001 ; version 0.1 du 4 juin 2002) | Cas réel — de « Caml.NET » à F# (2002) | https://fsharp.org/history/hopl-final/hopl-fsharp.pdf (§ 6-7) |
| `pages/fsharp/lecon-02.html#1` | Événement réel, mais foyer `tests/lecon-12` (Mars Climate Orbiter) | **remplacé** par l'annonce des unités de mesure par Andrew Kennedy | Cas réel — F# infère les unités de mesure (2008) | https://learn.microsoft.com/en-us/archive/blogs/andrewkennedy/units-of-measure-in-f-part-one-introducing-units ; HOPL § 12 ; essais `t-divers.fsx`, `t-u2.fsx`, `t-u3.fsx`, `t-unites-erreur.fsx` |
| `pages/fsharp/lecon-03.html#1` | INEXACT (B2, produit nommé) : la proposition TC39 (stade 2) porte sur les Hack pipes, pas sur l'opérateur de F# ; « très présent dans les salles de marché » sans source | **corrigé** : la naissance du `|>` dans Isabelle/ML (avril-mai 1994), son entrée dans F# (2003), l'inférence de gauche à droite (rejouée), le mot de José Valim | Cas réel — la naissance du symbole \|> (1994) | https://learn.microsoft.com/en-us/archive/blogs/dsyme/archeological-semiotics-the-birth-of-the-pipeline-symbol-1994 ; HOPL § 9.1 ; https://forum.elixirforum.com/t/which-language-first-introduced-the-pipe-operator/16791/8 ; essais `t-pipe.fsx`, `t-pipe2.fsx`, `t-big.fsx` |
| `pages/fsharp/lecon-04.html#1` | INEXACT (produit nommé) : « exemple vécu » e-mail/téléphone « source de bugs en production » (l'exemple réel est e-mail **ou adresse postale**), « adopté dans la finance et l'assurance » sans source | **corrigé** : le billet de Wlaschin, la formule empruntée à Yaron Minsky | Cas réel — rendre les états illégaux irreprésentables (2013) | https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/ |
| `pages/fsharp/lecon-05.html#1` | INVÉRIFIABLE (général : adoption par C# 8, Python 3.10, Java ; « colonne vertébrale des compilateurs ») | **corrigé** : réduit à Python 3.10 et à la PEP 635 (joker `_`, motifs ET de F#, « pas un `switch` ») | Cas réel — Python 3.10 adopte le filtrage par motif (2021) | https://peps.python.org/pep-0635/ (et le `.rst` du dépôt python/peps) ; https://www.python.org/downloads/release/python-3100/ ; essais `t-regex.fsx`, `t-and.fsx` |
| `pages/fsharp/lecon-06.html#1` | Tony Hoare au foyer `csharp/lecon-08` ; Jet.com en doublon ; « états illégaux non représentables » prêté à Jet sans source | **remplacé** par l'arrivée du type `Result` dans F# 4.1 | Cas réel — F# 4.1 ajoute le type Result (2017) | https://github.com/fsharp/fslang-design/blob/main/FSharp-4.1/FS-1004-result-type.md ; https://devblogs.microsoft.com/dotnet/announcing-f-4-1-and-the-visual-f-tools-for-visual-studio-2017-2/ ; essai `t-divers.fsx` |
| `pages/fsharp/lecon-07.html#1` | VRAI sur 2007 → C# 5 (2012), mais « une équipe .NET garde son application C#… » anonyme ; doublon de 11 | **corrigé** : le billet de Syme (F# 1.9.2.9) et l'influence décrite par HOPL ; récit anonyme retiré | Cas réel — les workflows async de F# inspirent C# 5.0 (2007) | https://learn.microsoft.com/en-us/archive/blogs/dsyme/introducing-f-asynchronous-workflows ; HOPL § 9.7 ; https://tomasp.net/academic/papers/async (PADL 2011, lu, non cité) |
| `pages/fsharp/lecon-08.html#1` | INVÉRIFIABLE (général : « un analyste branche FSharp.Data… ») | **corrigé** : F# Data et la Banque mondiale, d'après l'article de ses auteurs | Cas réel — F# Data, des types tirés des données (2016) | https://tomasp.net/academic/papers/fsharp-data/fsharp-data.pdf |
| `pages/fsharp/lecon-09.html#1` | Mars Climate Orbiter au foyer `tests/lecon-12` ; « refuse d'additionner des dollars et des euros » présenté comme raison de l'adoption en finance, sans source | **remplacé** par le rôle de la finance dans la « productisation » de F# (30 août 2007) | Cas réel — la finance pousse Microsoft vers F# (2007) | https://fsharp.org/history/hopl-final/hopl-fsharp.pdf (§ 10) |
| `pages/fsharp/lecon-10.html#1` | INVÉRIFIABLE (produit nommé) : les « pipelines composés » de Jet (`appliquerRemise 0.10`) inventés pour l'exemple | **corrigé** : l'article de Rachel Reese (application partielle, « l'héritage pour les fonctions »), le rachat par Walmart et l'arrêt de Jet.com | Cas réel — Jet.com et l'application partielle (2016) | https://www.codemag.com/Article/1611071/Case-Study-Writing-Microservices-with-F ; https://corporate.walmart.com/news/2016/08/08/walmart-agrees-to-acquire-jet-com-one-of-the-fastest-growing-e-commerce-companies-in-the-u-s ; https://stock.walmart.com/sec-filings/all-sec-filings/content/0000104169-20-000016/earningsrelease-4302020.htm |
| `pages/fsharp/lecon-11.html#1` | Doublon de 07 ; « reposent massivement » (Giraffe, Saturn) sans source | **remplacé** par « The F# Computation Expression Zoo » (`let!` traduit en `Bind`) | Cas réel — le « zoo » des computation expressions (2014) | https://tomasp.net/academic/papers/computation-zoo/ (et `computation-zoo.pdf`) |
| `pages/fsharp/lecon-12.html#1` | INVÉRIFIABLE (général) ; « le compilateur F# lui-même s'appuie sur les active patterns » sans source | **remplacé** par l'article ICFP 2007 qui les présente, et son exemple `ParseRegex` rejoué | Cas réel — les active patterns entrent dans F# (2007) | https://www.microsoft.com/en-us/research/publication/extensible-pattern-matching-via-a-lightweight-language-extension/ ; https://web.archive.org/web/2020id_/https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/p29-syme.pdf ; HOPL § 9.5 ; essai `t-regex.fsx` |
| `pages/fsharp/lecon-13.html#1` | INVÉRIFIABLE (général : propriétés « round-trip » « en finance ») ; naissance de QuickCheck au foyer `haskell` | **remplacé** par le bogue d'`Array.chunkBySize` trouvé par FsCheck dans FSharp.Core | Cas réel — FsCheck trouve un bogue d'Array.chunkBySize (2015) | https://github.com/dotnet/fsharp/issues/501 (commentaires, historique : titre corrigé par l'auteur 3 minutes après) ; https://github.com/dotnet/fsharp/commit/2f5d047d0572e4eab10dcbcda4a44ff5499c3f35 ; PR n° 503 (API) ; essai `t-divers.fsx` |
| `pages/fsharp/lecon-14.html#1` | INEXACT (produit nommé) : « cette progression porte un nom : le DDD », « très lu dans les équipes F# », « l'idée qui a séduit l'industrie » sans source | **corrigé** : ce que disent l'éditeur et la préface du livre | Cas réel — Domain Modeling Made Functional (2018) | https://pragprog.com/titles/swdddf/domain-modeling-made-functional/ ; https://media.pragprog.com/titles/swdddf/preface.pdf |

## Décomptes

| cours | lus | remplacés | corrigés | vérifiés tels quels | « Scénario » |
|---|---:|---:|---:|---:|---:|
| `lisp` | 15 | 8 | 7 | 0 | 0 |
| `fsharp` | 14 | 7 | 7 | 0 | 0 |
| **total** | **29** | **15** | **14** | **0** | **0** |

Un cas compte « corrigé » dès que son **sujet** reste celui de l'original (Viaweb, ITA, Jet.com, R7RS, SICP, Python 3.10…).
États trouvés : **INEXACT 9** (`lisp` 01, 08, 10, 11, 12 ; `fsharp` 01, 03, 04, 14), **INVÉRIFIABLE 11** (`lisp` 03, 04,
05, 09, 13, 14 ; `fsharp` 05, 08, 10, 12, 13), **sujet réel à déplacer 6** (doublon ou foyer d'un autre cours : `lisp` 02,
06 ; `fsharp` 02, 06, 09, 11), **vrai en partie 3** (le reste sans source : `lisp` 07, 15 ; `fsharp` 07). Aucun INVENTÉ
au sens de B2, mais deux exemples présentés comme vécus sans source (`fsharp/04` « exemple vécu », `fsharp/10` règles de
Jet), et une citation qui n'était dans aucune source telle quelle (`lisp/12`, cas pourtant jugé VRAI par B2).

## Contrôles (sur l'état commité, avant le commit de ce rapport)

- `node tools/verif-contenu.js --cas-reel --cours=lisp` → **0** (15/15 conformes) ; `--cours=fsharp` → **0** (14/14) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ; `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b12-lisp-fsharp 8c65449` → **0 écart** sur les 29 pages ;
- `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b12-lisp-fsharp 8c65449` → **0** (0 CR, octets identiques
  hors « Cas réel », types gardés, signatures) ; `node tools/cas-reels/lots/doublons.js` → 3 groupes, tous antérieurs et
  légitimes (Debian 12, react.dev, WebKit 15.4), aucun des miens ;
- `node tools/verif.js --rapide` → **code 1** (280,6 s, 54 étapes jouées sur 83), **4 étapes signalées, toutes des
  chiffres ou index dérivés que l'orchestrateur régénère après la fusion** : `donnees` (seulement I18 : `search-index.js`
  périmé, +4 713 octets), `doc-ref` (la page du cours `doc` cite 126 leçons et 44 cours qui renvoient à un document),
  `normatf` (compteur « 44 leçons parlant de la spécification », que la consigne range avec `doc-ref` et `doc-rec`) et
  `doc-rec` (« 1 440 citent la source » de leur « Cas réel », à recompter). Aucune ligne de source n'a été déformée pour
  les garder verts. Toutes les autres étapes vertes, dont `source`, `contenu`, `qcmbiai`, `qcmlexi`, `caract`.
- Après ce `--rapide`, une seule retouche (`lisp/01` : « Ron Garret (anciennement Erann Gat), qui a travaillé au JPL »,
  au lieu de « alors Erann Gat, ancien ingénieur du JPL ») ; rejoués ensuite : `--cas-reel` lisp et fsharp 0,
  `lexique-diff` 0 écart, cliquets lexique et biais 0, `verif-html` 0, `controle-branche` 0.

## Ce qui reste ouvert, et mes doutes

- **Mots ajoutés pour le lexique** (0 écart exigé) : `lisp/02` (la phrase sur Clojure, sourcée à sa référence du lecteur,
  garde « encore » et « clojure »), `lisp/10` (les quatre entreprises et les « compagnies aériennes », dans le courriel),
  `lisp/11` (« interpréteurs ou compilateurs » glose « implementations » du R7RS), `lisp/13` (« un gabarit qui reste
  lisible » est un jugement, pas une phrase de l'article), `fsharp/03` (« un pipeline filtre deux millions d'entiers »,
  vrai et rejoué, mais ajouté pour garder « millions »), `fsharp/13` (« la poignée d'exemples écrits à la main des tests
  déjà en place n'avait rien vu » : déduit du commit, qui ajoute deux exemples à `ArrayModule.fs` où les anciens
  passaient). À relire par la contre-relecture.
- **Sources partagées dans un même cours** (sujets distincts) : l'article HOPL IV de Syme sert à `fsharp` 01, 03, 07, 09
  (sections 6-7, 9.1, 9.7, 10) ; l'article de McCarthy (1960) à `lisp` 05 et 15, son *History of Lisp* à `lisp` 02 et 15 ;
  Emacs à `lisp` 07 et 14 ; Scott Wlaschin à `fsharp` 04 (billet de 2013) et 14 (livre de 2018).
- `fsharp/05` raconte un fait de Python dans le cours F# : la PEP 635 cite F# deux fois, et aucun cours ne le racontait.
- `lisp/02` cite la version HTML du *History of Lisp* datée du 12 février 1979 (le texte des actes HOPL de 1978 n'a pas
  été ouvert).
- **Foyers à inscrire au registre** (sujets que d'autres cours pourraient vouloir) : Remote Agent de Deep Space 1
  (`lisp/01`), Viaweb et Rtml (`lisp/08`), ITA Software et QPX (`lisp/10`), Brendan Eich et Scheme (`lisp/04`),
  S-expressions et RFC 9804 (`lisp/03`), McCarthy 1960 (`lisp/05`, `lisp/15`), History of Lisp et les M-expressions
  (`lisp/02`), SRFI 1 (`lisp/06`), `lexical-binding` d'Emacs (`lisp/07`), R6RS hashtables (`lisp/09`), R7RS 3.5
  (`lisp/11`), le koan de van Straaten (`lisp/12`), « Languages as Libraries » (`lisp/13`), Emacs 29.4 et
  CVE-2024-39331 (`lisp/14`) ; Jet.com (`fsharp/10`), « Caml.NET » (`fsharp/01`), unités de mesure de Kennedy
  (`fsharp/02`), naissance du `|>` (`fsharp/03`), « Making illegal states unrepresentable » (`fsharp/04`), PEP 635
  (`fsharp/05`), `Result` de F# 4.1 (`fsharp/06`), async de F# et C# 5.0 (`fsharp/07`), F# Data (`fsharp/08`),
  la finance et la productisation de F# (`fsharp/09`), le Zoo des computation expressions (`fsharp/11`), les active
  patterns (`fsharp/12`), `chunkBySize` (`fsharp/13`), *Domain Modeling Made Functional* (`fsharp/14`).
- Hors des encadrés, non touché : le corps de `fsharp/lecon-09` affirme que F# « brille » en finance grâce à ses unités
  de mesure, sans source ; l'antisèche de `fsharp/lecon-12` garde la ligne `(|Regex|_|)`.
