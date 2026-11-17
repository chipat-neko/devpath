# Rapport V18 — case B11, lot 8 : les cours `haskell` et `erlang` (copie `b11-haskell-erlang`, branche `v18/b11-haskell-erlang`)

Copie de travail `D:\test-claude-b11-haskell-erlang`, partie de `01795b6`. Part traitée : les **32 « Cas réel »**
des cours `haskell` (18, un par leçon) et `erlang` (14, un par leçon). Scripts et pièces dans
`scratchpad/b11-haskell-erlang/` (ignoré par git) : `montre.js` (les encadrés de chaque leçon), `cas-haskell.js`
et `cas-erlang.js` (les 32 titres et corps), `appliquer.js` (repris du lot 7 : remplace du titre de l'encadré au
`</div></div>` final ; refuse un titre absent ou multiple, un CR, un lien hors de la ligne de source, une ligne
de source qui n'est pas en dernier, une faute de typographie ; prouve que les octets hors de l'encadré sont
identiques ; annonce les mots d'options de QCM qui entrent ou sortent), `options-mot.js` et `presence.js`
(mots d'options d'une question et leur présence dans la page), `godbolt.py` (Compiler Explorer, GHC),
`pdftxt.py` (pypdf), l'archive officielle d'**Erlang/OTP 29.1.2** décompressée dans `otp/`, les essais `t/*`,
les pages et PDF lus (`*.html`, `*.pdf`, `*.txt`).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **18 hors de la règle à 0** pour `haskell`
et de **14 à 0** pour `erlang` ; sur les 32 cas trouvés, **aucun n'était conforme ni gardable tel quel** ;
**20 remplacés** par un cas réel daté et sourcé sur la même notion, **12 gardés sur leur sujet et corrigés**,
**0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b11-haskell-erlang`) : `a99a051` (haskell, 18 cas), `41b51dd` (erlang, 14 cas), puis le
commit de ce rapport, qui porte aussi une retouche du titre de `haskell/lecon-06` (« Wadler et Blott inventent » →
« présentent les type classes » : l'article signale un système voisin trouvé indépendamment par Stefan Kaes). ⚠️ Les décomptes des messages de commit sont faux d'un cran de classement (haskell :
« 17 remplacés, 1 gardé » ; erlang : « 9 remplacés, 5 gardés ») : le décompte qui fait foi est celui de ce
rapport (haskell 12 + 6, erlang 8 + 6), où un cas compte « gardé » dès que son **sujet** reste celui de l'original.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`, icône,
  structure gardés). Aucun intertitre `<h2>`/`<h3>` n'est collé au-dessus d'un de ces 32 encadrés : aucun touché.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; `<` écrit `&lt;` dans le code.
- **Un sujet = un seul cours, et un seul cas** : chaque sujet cherché dans `foyers.md`, dans tout `pages/`, dans
  `b10-reservations.txt` (lot 7) et `b11-reservations.txt` (lot 8), puis réservé (32 lignes, aucune collision).
  Dans le cours `haskell`, Pandoc était raconté **quatre fois** (01, 09, 16, 18), ShellCheck deux fois (09, 18),
  Sigma deux fois (01, 17), MapReduce deux fois (04, 14, foyer `data-eng`) : il n'en reste qu'un par sujet
  (Sigma en 01, Pandoc en 18, MapReduce nulle part). Dans `erlang`, WhatsApp l'était trois fois (01, 07, 14) et
  Discord deux fois (05, 09) : WhatsApp ne reste qu'en 14 (le foyer que la consigne garde), Discord qu'en 05
  (billet de 2017 sur Elixir, distinct des deux foyers Discord déjà pris : `rust/lecon-16`, `nosql/lecon-04`).
- **Comportements rejoués** : sur Compiler Explorer (GHC 9.8.4 et 9.6.1) l'avertissement `x-partial` de `head`,
  le message d'exécution de `head []`, et `product [1..100] :: Int` (rend 0) ; avec Erlang/OTP 29.1.2 (archive
  officielle) `{ok, X} = {error, absent}` (badmatch) contre `maybe … ?= … end` (rend `{error,absent}`).
- **Presse** : aucune. Toutes les sources sont primaires (article, thèse, documentation, notes de version, blog
  officiel ou blog de l'auteur). Trois copies sont hébergées par un tiers, titre, auteurs et date vérifiés :
  QuickCheck (université Tufts), « A History of Erlang » (projet LFE), Yorgey 2012 (Internet Archive, le site de
  l'auteur refuse la connexion TLS). Le billet ReaderT est cité dans sa copie de l'Internet Archive : le domaine
  du blog de FP Complete ne répond plus.

## Les 32 cas

États : VRAI / INEXACT / INVÉRIFIABLE / INVENTÉ ; nature : événement, produit nommé, anonyme, général.

### Cours `haskell` (18)

| Cas | État trouvé (nature) | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/haskell/lecon-01.html#1` | INEXACT (produits nommés) : trois sujets mêlés (Pandoc, Sigma, Cardano) ; « Meta » pour un système de Facebook en 2015 ; « des millions de requêtes par seconde » (la source : plus d'un million) ; Cardano sans source | **corrigé** : un seul sujet, Sigma, sur le billet d'origine | Cas réel — Facebook réécrit Sigma en Haskell (2015) | https://engineering.fb.com/2015/06/26/security/fighting-spam-with-haskell/ |
| `pages/haskell/lecon-02.html#1` | INEXACT (événement, B2) : le compteur de Gangnam Style n'a pas débordé ; le récit ne tient pas sans la presse | **remplacé** par la panne de Basecamp 3 : colonne `integer` pleine à 2 147 483 647 | Cas réel — Basecamp bloqué par un entier trop petit (2018) | https://signalvnoise.com/svn3/update-on-basecamp-3-being-stuck-in-read-only-as-of-nov-8-922am-cst/ ; https://signalvnoise.com/svn3/postmortem-on-the-read-only-outage-of-basecamp-on-november-9th-2018/ ; Compiler Explorer (`product [1..100] :: Int` = 0) |
| `pages/haskell/lecon-03.html#1` | INVÉRIFIABLE (général : « des fichiers de logs de plusieurs gigaoctets » avec conduit/pipes) | **remplacé** par l'avertissement `x-partial` de GHC 9.8 sur `head`/`tail` | Cas réel — GHC 9.8 met en garde contre head et tail (2023) | https://github.com/haskell/core-libraries-committee/issues/87 (et ses commentaires, chronologie : vote du 15/11/2022) ; https://downloads.haskell.org/ghc/9.8.1/docs/users_guide/_sources/9.8.1-notes.rst.txt ; https://ghc.gitlab.haskell.org/homepage/blog/20231009-ghc-9.8.1-released.html ; Compiler Explorer (GHC 9.8.4, 9.6.1) |
| `pages/haskell/lecon-04.html#1` | INEXACT (événement, B2) : MapReduce « indexe le web » au présent ; LINQ n'emploie pas ce vocabulaire ; sujet gardé par `data-eng` | **remplacé** par l'article de John Hughes | Cas réel — « Why Functional Programming Matters » (1989) | https://www.cse.chalmers.se/~rjmh/Papers/whyfp.html ; https://www.cse.chalmers.se/~rjmh/Papers/whyfp.pdf |
| `pages/haskell/lecon-05.html#1` | INVÉRIFIABLE (général : Rust, Swift, TypeScript, Elm « zéro exception » sans source ; Tony Hoare sous-entendu, foyer `csharp`) | **remplacé** par l'essai d'Alexis King | Cas réel — « Parse, don't validate » (2019) | https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/ |
| `pages/haskell/lecon-06.html#1` | INVÉRIFIABLE (général : `sort`, `Ord`) | **remplacé** par l'article fondateur des type classes | Cas réel — Wadler et Blott présentent les type classes (1989) | https://homepages.inf.ed.ac.uk/wadler/topics/type-classes.html ; https://www.cs.tufts.edu/~nr/cs257/archive/phil-wadler/class.pdf |
| `pages/haskell/lecon-07.html#1` | INVÉRIFIABLE (produits nommés, général : optparse-applicative « standard de fait », « les back-ends web s'en servent ») | **remplacé** par l'article qui nomme `Applicative` | Cas réel — McBride et Paterson nomment Applicative (2008) | https://www.staff.city.ac.uk/~ross/papers/Applicative.pdf ; https://www.staff.city.ac.uk/~ross/papers/ (JFP 18:1, 2008) |
| `pages/haskell/lecon-08.html#1` | INVÉRIFIABLE (produit nommé, général : aeson, « tous reposent là-dessus », message d'erreur cité de mémoire) | **remplacé** par l'évaluateur de Wadler | Cas réel — Philip Wadler et l'évaluateur qui divise par zéro (1992) | https://homepages.inf.ed.ac.uk/wadler/topics/monads.html ; https://homepages.inf.ed.ac.uk/wadler/papers/marktoberdorf/baastad.pdf |
| `pages/haskell/lecon-09.html#1` | INVÉRIFIABLE (produits nommés : architecture de Pandoc et ShellCheck décrite sans source, « des millions de développeurs ») ; Pandoc répété dans le cours | **remplacé** par le passage aux I/O monadiques | Cas réel — Haskell 1.3 adopte les I/O monadiques (1996) | https://www.microsoft.com/en-us/research/?p=252902 ; https://www.microsoft.com/en-us/research/wp-content/uploads/2016/07/history.pdf |
| `pages/haskell/lecon-10.html#1` | INVÉRIFIABLE (anonyme : « un service accumule des statistiques… au petit matin ») | **remplacé** par le billet de Well-Typed que le récit citait | Cas réel — nothunks, la chasse aux thunks de Cardano (2020) | https://well-typed.com/blog/2020/09/nothunks/ |
| `pages/haskell/lecon-11.html#1` | INEXACT (événement) : « à peine cent lignes » (l'article : environ 300) ; « 1999-2000 » (ICFP 2000) ; le récit AUTOSAR/Volvo (« dans des spécifications signées… », réduction « de milliers de messages CAN à trois ou quatre ») ne se trouve pas dans les sources ouvertes, et c'est l'histoire de Quviq, pas de l'article | **corrigé** : recentré sur l'article de 2000 | Cas réel — QuickCheck, l'article fondateur (2000) | https://www.cs.tufts.edu/comp/150FP/archive/john-hughes/quick.pdf ; https://research.chalmers.se/en/publication/?id=219899 (AUTOSAR, écarté) |
| `pages/haskell/lecon-12.html#1` | INEXACT (produit nommé) : « des milliers de développeurs » (la source : des dizaines de milliers d'utilisateurs) ; « des centaines de tests QuickCheck qui rejouent des milliers de séquences » sans source | **corrigé** sur l'article de Swierstra | Cas réel — xmonad, un état pur sous une fine coquille (2012) | https://webspace.science.uu.nl/~swier004/publications/2012-haskell.pdf |
| `pages/haskell/lecon-13.html#1` | INVÉRIFIABLE (organisation nommée) : « depuis la fin des années 2000 », « des centaines de milliers de lignes », Mu « pour rapprocher Haskell de ses quants » sans source | **corrigé** sur les diapositives de Lennart Augustsson | Cas réel — Standard Chartered, Cortex et Mu (2012) | https://www.cse.chalmers.se/edu/year/2012/course/pfp/lectures/lecture13/PFP2012.pdf ; https://www.cse.chalmers.se/edu/year/2012/course/pfp/lectures.html (cours 13 du cours « Parallel Functional Programming ») |
| `pages/haskell/lecon-14.html#1` | sujet gardé ailleurs (MapReduce, foyer `data-eng`) | **remplacé** par la bibliothèque diagrams | Cas réel — diagrams, une bibliothèque bâtie sur les monoïdes (2012) | https://web.archive.org/web/20201205223934/http://ozark.hendrix.edu/~yorgey/pub/monoid-pearl.pdf |
| `pages/haskell/lecon-15.html#1` | INEXACT (personne et produit nommés) : Snoyman « créateur de Stack » non dit ; « le patron le plus recommandé aujourd'hui » et « de nombreux services d'entreprise » sans source | **corrigé** sur le billet (copie de l'Internet Archive) | Cas réel — le « ReaderT design pattern » de Michael Snoyman (2017) | https://web.archive.org/web/20180107002014/https://www.fpcomplete.com/blog/2017/06/readert-design-pattern (auteur et date) ; https://web.archive.org/web/20240124135910/https://www.fpcomplete.com/blog/readert-design-pattern/ (texte) |
| `pages/haskell/lecon-16.html#1` | INEXACT (produit nommé) : « son cœur repose entièrement sur des combinateurs » (les writers n'en sont pas) ; Dhall sans source ; Pandoc répété | **remplacé** par le rapport de Parsec | Cas réel — Parsec, des combinateurs pour le monde réel (2001) | https://www.microsoft.com/en-us/research/publication/parsec-direct-style-monadic-parser-combinators-for-the-real-world/ ; https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/parsec-paper-letter.pdf |
| `pages/haskell/lecon-17.html#1` | INEXACT (produit nommé) : Sigma « laisse le runtime et STM gérer le partage d'état » (le billet parle de Haxl et de concurrence implicite, pas de STM) ; « étonnamment lisible » sans source ; Sigma repris en 01 | **remplacé** par l'article STM | Cas réel — les transactions mémoire composables arrivent dans GHC (2005) | https://www.microsoft.com/en-us/research/publication/composable-memory-transactions/ ; https://www.microsoft.com/en-us/research/wp-content/uploads/2005/01/2005-ppopp-composable.pdf |
| `pages/haskell/lecon-18.html#1` | INVÉRIFIABLE (produits nommés) : ShellCheck « intégré à GitHub », architecture de Pandoc sans source | **corrigé** : Pandoc seul, sur le récit de son auteur | Cas réel — Pandoc, des lecteurs purs et PandocMonad (2017) | https://pandoc.org/twenty-years-of-pandoc.html ; https://pandoc.org/using-the-pandoc-api.html ; https://pandoc.org/MANUAL.html |

### Cours `erlang` (14)

| Cas | État trouvé (nature) | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/erlang/lecon-01.html#1` | sujet gardé ailleurs (WhatsApp, foyer `erlang/lecon-14`) ; « une cinquantaine d'ingénieurs » sans source primaire | **remplacé** par l'histoire de la BEAM | Cas réel — de la JAM à la BEAM (1993) | https://lfe.github.io/papers/%5B2007%5D%20Armstrong%20-%20HOPL%20III%20A%20History%20of%20Erlang.pdf |
| `pages/erlang/lecon-02.html#1` | INVÉRIFIABLE (général : télécoms, en-tête binaire) ; notion de la leçon 12 | **remplacé** par l'EEP 49 (`maybe`, `?=`) | Cas réel — l'EEP 49 et le bloc maybe (2022) | https://www.erlang.org/eeps/eep-0049 ; https://www.erlang.org/blog/My-OTP-25-highlights/ ; https://www.erlang.org/blog/otp-26-highlights/ ; https://www.erlang.org/blog/highlights-otp-27/ ; Erlang/OTP 29.1.2 (`t/eep49.erl`) |
| `pages/erlang/lecon-03.html#1` | INVÉRIFIABLE (général : « c'est ainsi qu'est écrit le routage… dans les commutateurs d'Ericsson ») | **remplacé** par le débat sur la récursion terminale | Cas réel — la récursion terminale n'est pas une solution miracle (2011) | https://ferd.ca/erlang-s-tail-recursion-is-not-a-silver-bullet.html ; https://www.erlang.org/doc/system/listhandling.html (et `otp/doc/system/listhandling.md`) |
| `pages/erlang/lecon-04.html#1` | INEXACT (produit nommé) : « chaque connexion… est un processus » (la documentation : chaque file ; un canal coûte « quelques processus ») ; « des millions de messages par seconde » et « banques, e-commerce, IoT » sans source | **corrigé** sur la documentation et le test de 2014 | Cas réel — RabbitMQ, un processus par file (2014) | https://cloudplatform.googleblog.com/2014/06/rabbitmq-on-google-compute-engine.html ; https://www.rabbitmq.com/docs/memory-use ; https://www.rabbitmq.com/docs/runtime ; https://www.rabbitmq.com/docs/channels |
| `pages/erlang/lecon-05.html#1` | INVÉRIFIABLE (produit nommé) : « chaque salon, chaque serveur vocal y est un processus », « qui est en ligne en temps réel pour des millions de salons » sans source | **corrigé** sur le billet de Discord de 2017 | Cas réel — Discord, un processus par serveur (2017) | https://discord.com/blog/how-discord-scaled-elixir-to-5-000-000-concurrent-users |
| `pages/erlang/lecon-06.html#1` | INVÉRIFIABLE (produit nommé) : les « neuf 9 » « mesurés », « quelques dizaines de millisecondes par an » sans source primaire | **corrigé** : l'AXD301 gardé, raconté par la thèse d'Armstrong (les neuf 9 retirés) | Cas réel — l'AXD301 et ses arbres de supervision (2003) | https://erlang.org/download/armstrong_thesis_2003.pdf |
| `pages/erlang/lecon-07.html#1` | INVÉRIFIABLE (produit nommé) : ejabberd « au cœur des débuts de WhatsApp », « chaque session utilisateur est un gen_server supervisé » sans source ; WhatsApp gardé en 14 | **remplacé** par `gen_statem` | Cas réel — gen_statem remplace gen_fsm (2016) | https://www.erlang.org/patches/otp-19.0 ; https://www.erlang.org/patches/otp-20.0 ; `otp/lib/stdlib-8.1.1/doc/html/notes.md` (STDLIB 3.0 et 3.4) |
| `pages/erlang/lecon-08.html#1` | INVÉRIFIABLE (produit nommé, sans date ni source ; fond juste) | **corrigé** : Riak gardé, avec l'option de cohérence forte de Riak 2.0 | Cas réel — Riak 2.0 laisse choisir la cohérence (2014) | https://docs.riak.com/riak/kv/2.0.0/developing/app-guide/strong-consistency/index.html ; https://docs.riak.com/riak/kv/2.0.0/learn/concepts/strong-consistency/index.html ; https://github.com/basho/riak/blob/riak-2.0.0/RELEASE-NOTES.md ; étiquette `riak-2.0.0` (API GitHub, 2014-09-02) ; https://docs.riak.com/riak/kv/2.0.0/setup/installing/source/erlang/index.html |
| `pages/erlang/lecon-09.html#1` | sujet répété (Discord, déjà en 05) ; « millions d'utilisateurs simultanés dès 2017 » | **remplacé** par le JIT d'OTP 24 | Cas réel — la BEAM passe au JIT (2021) | https://www.erlang.org/blog/My-OTP-24-Highlights/ ; https://www.erlang.org/blog/a-first-look-at-the-jit/ |
| `pages/erlang/lecon-10.html#1` | INEXACT/INVÉRIFIABLE (produits nommés) : « Cowboy garde ses routes en ETS », « la table interne qui associe un named_table à son identifiant » | **remplacé** par l'`ordered_set` d'OTP 22 | Cas réel — ETS : l'ordered_set devient parallèle (2020) | https://www.erlang.org/blog/the-new-scalable-ets-ordered_set/ ; https://www.erlang.org/blog/scalable-ets-counters/ |
| `pages/erlang/lecon-11.html#1` | INVÉRIFIABLE (anonyme : « une équipe peut faire échouer le build ») | **remplacé** par le mode incrémental de Dialyzer | Cas réel — Dialyzer passe en mode incrémental (2023) | https://www.erlang.org/blog/otp-26-highlights/ ; https://www.erlang.org/doc/apps/dialyzer/dialyzer.html (et `otp/lib/dialyzer-6.0.4/doc/html/dialyzer.md`) |
| `pages/erlang/lecon-12.html#1` | INVÉRIFIABLE (général : ATM, RADIUS, DNS, RabbitMQ, MQTT) | **remplacé** par l'arrivée de la bit syntax | Cas réel — la bit syntax entre dans Erlang (2000) | https://erlang.org/euc/00/bit_syntax.html ; https://erlang.org/euc/00/ ; https://erlang.org/documentation/doc-5.2/doc/extensions/bit_syntax.html ; https://www.erlang.org/doc/system/bit_syntax.html |
| `pages/erlang/lecon-13.html#1` | INVÉRIFIABLE (produits nommés) : Quviq « fondée par des vétérans d'Erlang », « Ericsson et Volvo… protocoles télécoms et composants automobiles » mêlés, PropEr et `[0, 1]` sans source | **corrigé** : Quviq QuickCheck gardé, sur l'étude chez Ericsson | Cas réel — Quviq QuickCheck chez Ericsson (2006) | https://research.chalmers.se/publication/115891 ; https://erlang.org/pipermail/erlang-questions/2006-June/020652.html |
| `pages/erlang/lecon-14.html#1` | VRAI (B2), mais sans sujet, date ni source | **corrigé** (gardé) : titre, détails tirés des diapositives, ligne de source | Cas réel — WhatsApp commence par un gen_server (2014) | https://www.erlang-factory.com/static/upload/media/1394350183453526efsf2014whatsappscaling.pdf |

## Décomptes

| | haskell | erlang | total |
|---|---:|---:|---:|
| « Cas réel » | 18 | 14 | 32 |
| conformes avant / après | 0 / 18 | 0 / 14 | 0 / 32 |
| état trouvé : VRAI (sans la forme) | 0 | 1 | 1 |
| INEXACT | 8 | 2 | 10 |
| INVÉRIFIABLE | 9 | 9 | 18 |
| sujet gardé ailleurs ou répété dans le cours | 1 | 2 | 3 |
| INVENTÉ | 0 | 0 | 0 |
| **remplacés** | 12 | 8 | **20** |
| **gardés sur leur sujet et corrigés** | 6 | 6 | **12** |
| gardés tels quels | 0 | 0 | 0 |
| renommés « Scénario » | 0 | 0 | 0 |

(Classement des états : un cas compte INEXACT dès qu'une affirmation vérifiable est fausse, INVÉRIFIABLE si rien
n'est faux mais que l'essentiel est introuvable ; les trois « gardés ailleurs ou répétés » sont haskell 14
— MapReduce, foyer data-eng ; haskell 04, qui le racontait aussi, est compté INEXACT —, erlang 01 — WhatsApp —
et erlang 09 — Discord.)

## Sujets à inscrire au registre des foyers

- **Gangnam Style (2014)** : le registre en faisait le foyer `haskell/lecon-02` ; le cas est **retiré** (le
  compteur n'a pas débordé, et le démenti n'est que dans la presse). Plus aucun foyer : à rayer.
- Nouveaux foyers : Facebook Sigma 2015 (`haskell/lecon-01`), Basecamp et la colonne integer 2018
  (`haskell/lecon-02`), GHC 9.8 `x-partial` (`haskell/lecon-03`), Why Functional Programming Matters
  (`haskell/lecon-04`), Parse don't validate (`haskell/lecon-05`), Wadler et Blott 1989 (`haskell/lecon-06`),
  McBride et Paterson 2008 (`haskell/lecon-07`), Wadler 1992 (`haskell/lecon-08`), Haskell 1.3 et A History of
  Haskell (`haskell/lecon-09`), nothunks (`haskell/lecon-10`), **QuickCheck, l'article d'ICFP 2000**
  (`haskell/lecon-11`), xmonad (`haskell/lecon-12`), Standard Chartered (`haskell/lecon-13`), Yorgey et
  diagrams (`haskell/lecon-14`), ReaderT pattern (`haskell/lecon-15`), Parsec 2001 (`haskell/lecon-16`), STM
  PPoPP 2005 (`haskell/lecon-17`), **Pandoc** (`haskell/lecon-18`) ; JAM et BEAM / A History of Erlang
  (`erlang/lecon-01`), EEP 49 (`erlang/lecon-02`), récursion terminale de Hébert (`erlang/lecon-03`), RabbitMQ
  (`erlang/lecon-04`), Discord sur Elixir 2017 (`erlang/lecon-05`), thèse d'Armstrong et AXD301
  (`erlang/lecon-06`), gen_statem (`erlang/lecon-07`), Riak 2.0 (`erlang/lecon-08`), BeamAsm (`erlang/lecon-09`),
  ETS CA tree (`erlang/lecon-10`), Dialyzer incrémental (`erlang/lecon-11`), bit syntax R7A (`erlang/lecon-12`),
  **Quviq QuickCheck chez Ericsson** (`erlang/lecon-13`), **WhatsApp de Rick Reed 2014** (`erlang/lecon-14`).
- À surveiller : `markdown/lecon-10` (lot 7) raconte le Journal of Open Source Software, **compilé par Pandoc** ;
  sujet et source différents (JOSS contre l'architecture de Pandoc racontée par son auteur), mais le nom est
  commun.

## Contrôles (sur la copie, après le dernier encadré)

- `node tools/verif-contenu.js --cas-reel --cours=haskell` → **0** (18 conformes sur 18) ;
- `node tools/verif-contenu.js --cas-reel --cours=erlang` → **0** (14 conformes sur 14) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/doublons.js` → toujours 2 sources partagées entre cours (les deux légitimes,
  inchangées) ;
- `node tools/cas-reels/lots/lexique-diff.js D:/test-claude-b11-haskell-erlang 01795b6` → **1 écart, expliqué** :
  `erlang/lecon-08` gagne « source », qui entre par la classe obligatoire `cas-reel__source` ; le distracteur
  « On voit le code source à distance » le porte. Mots étrangers à la page par option, avant → après : bonne
  réponse 3 → 3 (« envoie », « change », « l'emplacement »), « code source » 1 → 0, « adresses IP » 2 → 2,
  « chiffre les messages » 0 → 0 : la bonne réponse reste l'option la plus étrangère à la page, l'option la
  moins étrangère n'était déjà pas elle. Tous les autres mots d'options perdus ou gagnés en route (« ajoute »,
  « comparable », « entiers », « complète », « enferme », « accumule », « modélise », « l'écriture », « simple »,
  « partie », « entièrement », « groupées », « commun », « obtient », « production », « avertissements »,
  « générer » ; « d'abord », « peuvent », « signale », « départ », « permet », « exécute », « d'erreur »,
  « compilateur », « seulement », « fonctions ») ont été remis dans une phrase exacte ou retirés ;
- 0 CR dans les 32 pages modifiées ;
- `node tools/verif.js --rapide` → voir ci-dessous.

`node tools/verif.js --rapide` → **code 1**, lancé une seule fois, à la fin (journal `scratchpad/.verif-journal/2026-11-17T21-37-16/`). 49 étapes OK. Les rouges :
- `donnees` **SIGNALE** : uniquement l'invariant **I18** (`search-index.js` périmé, +4 475 octets à la régénération) — toléré, l'orchestrateur régénère ;
- `doc-ref`, `doc-rec` et `normatf` **SIGNALE** : les chiffres du cours `doc` mesurés sur tout le site (dont « 45 leçons parlant de la spécification », « 123 leçons qui renvoient à un document », « 44 cours ») bougent avec les lignes de source — toléré par la consigne (§ 6 pour `normatf`), l'orchestrateur régénère ; aucune ligne de source déformée pour les garder verts ;
- `caract` **NON MESURÉ** : le plafond de 10 min a été atteint sur la machine partagée (aucune mesure rendue). Relancé seul : `node tools/verif-controles.js` → **code 0** en 0,4 s, « 0 accident(s), 2 emploi(s) voulu(s) ».


## Ce qui reste ouvert, et les doutes

- `haskell/lecon-02` : le post-mortem de Basecamp écrit « Last Thursday, November 9th », mais le jeudi était le
  8 novembre 2018, et le billet publié le jour même porte « Nov 8 » : le cas dit « le jeudi 8 novembre 2018 ».
- `haskell/lecon-03` : l'encadré est placé dans la section des listes infinies ; il raconte `head`/`tail`, autre
  notion de la même leçon (pas de déplacement, la consigne interdit de toucher au reste).
- `haskell/lecon-16` : la notice de Microsoft Research donne « UU-CS-2001-27, July 2001 », le PDF qu'elle
  héberge est un brouillon daté du 4 octobre 2001 ; un résultat de recherche (non ouvert) donne UU-CS-2001-35 au
  portail d'Utrecht. Le cas ne cite que « rapport technique UU-CS-2001-27, 2001 ».
- `haskell/lecon-18` : « Twenty Years of Pandoc » est daté du 2 août 2026 ; aucun chiffre « du jour » n'est repris.
- `erlang/lecon-08` : l'avertissement « expérimental, déconseillé en production » figure sur les pages 2.0.0 de
  docs.riak.com telles qu'elles sont servies aujourd'hui (régénérées, © 2011-2017) ; il a pu y être ajouté après
  2014. Le cas l'attribue à « la documentation », sans date.
- `erlang/lecon-13` : le texte intégral de l'article de 2006 est derrière l'ACM (403) ; le cas ne dit que ce que
  dit son résumé (notice de Chalmers). Même limite pour l'article AUTOSAR de 2015, écarté pour cette raison.
- `erlang/lecon-04` : les pages de documentation de RabbitMQ ne sont pas datées (« consultées en novembre 2026 »).
- Le mot « Volvo » et le récit AUTOSAR (plus de 200 problèmes, 3 000 pages de spécifications, résumé de 2015)
  sortent du site : ils pourraient servir un autre cours (`tests`), avec la notice Chalmers comme source.

## Consignes de fusion

- Branche `v18/b11-haskell-erlang`, trois commits au-dessus de `01795b6` ; seuls changent `pages/haskell/lecon-01`
  à `-18`, `pages/erlang/lecon-01` à `-14` et ce rapport. Aucun QCM, aucun `js/data.js`, aucun index dérivé.
- Après fusion : régénérer les pages dérivées et les index (`search-index.js`, `etude-recherche.html`…) et les
  chiffres `doc-ref` / `doc-rec` ; reporter au registre les foyers ci-dessus et rayer Gangnam Style.
