# Rapport V18 — case B7, lot 4 : les cours `clojure` et `elixir` (copie `b7-clojure-elixir`, branche `v18/b7-clojure-elixir`)

Copie de travail `D:\test-claude-b7-clojure-elixir`, partie de `13eabe3`. Part traitée : les **34 « Cas réel »**
des cours `clojure` (17, un par leçon) et `elixir` (17, un par leçon). Scripts et pièces dans
`scratchpad/b7-clojure-elixir/` (ignoré par git) : `cas-clojure.js` et `cas-elixir.js` (les 34 textes),
`appliquer.js` (remplace le seul intérieur du `div.callout__body` de l'encadré, prouve que les octets hors de
cet intérieur sont identiques, refuse tout CR), `typo.js`, `lire.js` (ouvre une URL et garde le texte dans
`sources/`), `qcm-mots.js`, `tests-clj/` et `tests-ex/` (scripts rejoués), `outils/` (jars et archives
officiels), `ex-posts/` et `clj/` (sources brutes des billets d'Elixir et de clojure.org, tirées des dépôts
`elixir-lang/elixir-lang.github.com` et `clojure/clojure-site`).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **17 hors de la règle à 0** pour
`clojure` et de **17 à 0** pour `elixir` ; sur les 34 cas trouvés, **0 était VRAI tel quel et conforme** :
1 INVENTÉ (`elixir/lecon-03`, relevé en B2), plusieurs INEXACT, une large majorité d'INVÉRIFIABLE (récits
anonymes, usages généraux) ; **31 remplacés** par un cas réel daté et sourcé sur la même notion, **3 corrigés
sur leur sujet** (`clojure/01` Cognitect et Nubank, `clojure/07` re-frame, `clojure/12` Clojure 1.9),
**0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b7-clojure-elixir`, partie de `13eabe3`) : `d68c758` (clojure, 17 cas), `deaa8ce`
(elixir, 17 cas), puis le commit de ce rapport. `controle-branche.js … 13eabe3` : « 0 CR, 0 domaine interdit,
octets identiques hors « Cas réel », types gardés, signatures, copie propre ».

## Méthode

- Seul l'intérieur du `div.callout__body` change (type `note`, icône et structure gardés). Les intertitres
  collés au-dessus (`<h2>Un cas concret</h2>` en clojure, intertitres de section en elixir) n'annoncent pas
  l'ancien récit : inchangés.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » (`typo.js` : 0 faute ; les deux-points
  restants sont dans un titre anglais cité tel quel — « Elixir v1.17 released: … » — et dans le message
  « Oops, something went wrong! » cité tel quel).
- Longueur du récit (titre et source exclus) : `clojure` 123 à 165 mots, `elixir` 111 à 160 mots.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et URL de
  la source) et dans `b7-reservations.txt`, où les 34 sujets sont inscrits (relu après inscription : aucun
  pris par un autre agent). **Écartés** parce qu'un autre cours les raconte déjà : WhatsApp et ses 2 millions
  de connexions par serveur (`erlang/lecon-01`), Discord sur Elixir en 2017 (`erlang/lecon-09`, aussi
  `erlang/lecon-05`), les gènes d'Excel, Ariane 5, etc. (registre). `doublons.js` : toujours **2** sources
  partagées entre cours (les deux légitimes déjà connues).
- **Comportements rejoués** (« un comportement technique se TESTE ») :
  - Clojure : jars officiels de Maven Central (SHA-1 comparés à ceux publiés) — 1.5.1, 1.6.0, 1.8.0, 1.9.0
    (+ spec.alpha 0.1.143, core.specs.alpha 0.1.24), 1.12.6 (+ spec.alpha 0.6.249, core.specs.alpha 0.5.81) —
    sous Java 27.
  - Elixir : Erlang/OTP 29.1.2 (`otp_win64_29.1.2.zip`, MD5 comparé au `MD5.txt` de la version) et Elixir
    1.20.5 précompilé (`elixir-otp-29.zip`, SHA-256 comparé au fichier publié), archives officielles des
    dépôts GitHub `erlang/otp` et `elixir-lang/elixir`, dans le scratchpad.
  - Résultats cas par cas ci-dessous.
- Les pages de tickets Jira (`clojure.atlassian.net/browse/CLJ-…`) s'affichent par JavaScript : ouvertes, puis
  lues par l'API REST publique du même site (`/rest/api/2/issue/CLJ-…`), contenu gardé dans `sources/`.
- Toutes les sources sont **primaires** (billets officiels des projets, journaux des changements, tickets,
  code source, études de cas publiées par l'équipe d'Elixir) ; aucune presse.

## Cas par cas — `clojure`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/clojure/lecon-01.html#1` | VRAI sur le sujet, INVÉRIFIABLE pour le reste — produit nommé : le rachat de Cognitect par Nubank en 2020 est vrai ; « la société qui portait le développement de Clojure » n'est pas dans la source ; « Walmart, Apple, CircleCI s'en servent » sans aucune source ; ni date dans le titre ni source | corrigé : gardé le sujet, chiffres du billet (600 développeurs Clojure, 2,5 millions de lignes, 500 microservices, plus de 2 000 serveurs Datomic, plus de 25 millions de clients), Rich Hickey reste à la tête de Clojure, retrait de Walmart, Apple, CircleCI | Cas réel — Cognitect rejoint Nubank (2020) | https://cognitect.com/blog/2020/07/23/Cognitect-Joins-Nubank ; https://clojure.org/news/2020/07/23/cognitect-joins-nubank (source brute du dépôt clojure-site) |
| `pages/clojure/lecon-02.html#1` | INVÉRIFIABLE — usage général (`deps.edn` est une donnée), vrai sur le fond | remplacé par : les git deps de Clojure | Cas réel — les dépendances Git dans deps.edn (2018) | https://clojure.org/news/2018/01/05/git-deps |
| `pages/clojure/lecon-03.html#1` | INVÉRIFIABLE — illustration générale (« une API de facturation », B2) | remplacé par : Clojure 1.6 ajoute `some?`, `if-some`, `when-some` (testé : `if-let` sur `false` donne la branche « absent », `if-some` la branche « présent » ; `if-some` inconnu en 1.5.1) | Cas réel — Clojure 1.6 ajoute if-some et when-some (2014) | https://github.com/clojure/clojure/blob/master/changes.md (§ 2.3 de 1.6) ; https://clojure.atlassian.net/browse/CLJ-1343 (lu par l'API REST) ; https://github.com/clojure/clojure/releases/tag/clojure-1.6.0 |
| `pages/clojure/lecon-04.html#1` | INVÉRIFIABLE — produit nommé (Reagent, re-frame), affirmations générales (« des milliers d'applications ») | remplacé par : Transit (Cognitect) | Cas réel — Transit, les collections de Clojure hors de Clojure (2014) | https://cognitect.com/blog/2014/7/22/transit |
| `pages/clojure/lecon-05.html#1` | INVÉRIFIABLE — illustration générale (« un rapport de ventes typique ») | remplacé par : les reducers de Rich Hickey | Cas réel — Rich Hickey présente les reducers (2012) | https://clojure.org/news/2012/05/08/reducers |
| `pages/clojure/lecon-06.html#1` | INVÉRIFIABLE — « c'est précisément le modèle de re-frame et des outils de dessin comme Quil » : rien ne documente une annulation dans Quil | remplacé par : Om, de David Nolen (égalité de références, annulation « gratuite », partage de structure ; le code d'annulation qui suit l'encadré reste pertinent) | Cas réel — Om et l'annulation « gratuite » (2013) | https://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/ |
| `pages/clojure/lecon-07.html#1` | INEXACT — produit nommé (B2) : re-frame installe le nouvel état par `reset!`, pas `swap!` ; « des tableaux de bord financiers … en production » introuvable | corrigé : `reset!` (« qui agit comme la validation d'une transaction »), une seule source de vérité, code de l'effet `:db`, retrait de l'affirmation introuvable | Cas réel — re-frame range tout l'état dans un atom (2015) | https://day8.github.io/re-frame/application-state/ ; https://day8.github.io/re-frame/releases/2015/ ; https://raw.githubusercontent.com/day8/re-frame/master/src/re_frame/fx.cljc |
| `pages/clojure/lecon-08.html#1` | INVÉRIFIABLE — produit nommé : les raisons prêtées à Nubank (JDBC, Kafka, `BigDecimal`) ne sont dans aucune source ; Nubank déjà sujet de la leçon 01 | remplacé par : Clojure 1.12, valeurs de méthodes et méthodes qualifiées (testé : `(map String/.toUpperCase …)` refusé en 1.9, `("CLOJURE" "JVM")` en 1.12.6) | Cas réel — Clojure 1.12 et les méthodes Java comme valeurs (2024) | https://clojure.org/news/2024/09/05/clojure-1-12-0 |
| `pages/clojure/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe ») ; CircleCI « repose sur ce partage serveur/client » sans source | remplacé par : Clojure 1.7, `.cljc` et reader conditionals (testé : un `.cljc` avec `#?(:clj …)` chargé par Clojure 1.12.6) | Cas réel — Clojure 1.7 et les fichiers .cljc (2015) | https://clojure.org/news/2015/06/30/clojure-17 ; changes.md (§ 2.2 de 1.7) ; https://clojure.org/guides/reader_conditionals |
| `pages/clojure/lecon-10.html#1` | INVÉRIFIABLE — récit anonyme (« Un service reçoit des webhooks ») | remplacé par : Clojure 1.2 introduit les protocols, raisons de la page de référence | Cas réel — Clojure 1.2 et les protocols (2010) | https://clojure.org/reference/protocols ; https://github.com/clojure/clojure/releases/tag/1.2.0 (étiquette du 19 août 2010, confirmée par l'API GitHub) |
| `pages/clojure/lecon-11.html#1` | INEXACT et INVÉRIFIABLE — « David Nolan » pour David Nolen ; « Om a popularisé l'approche » et la barre de recherche anonyme sans source | remplacé par : l'annonce de core.async | Cas réel — Rich Hickey annonce core.async (2013) | https://clojure.org/news/2013/06/28/clojure-clore-async-channels |
| `pages/clojure/lecon-12.html#1` | INEXACT — produit nommé : Clojure 1.9 spécifie bien ses macros, mais « au lieu d'une obscure exception de macroexpansion » est faux (Clojure 1.8 répond déjà « Parameter declaration "x" should be a vector », rejoué au jar 1.8.0) ; ni date ni source | corrigé : gardé le sujet, daté (8 décembre 2017), `core.specs.alpha` « spécifications de Clojure lui-même », vérification à la compilation, message relevé au jar 1.9.0 (« Call to clojure.core/defn did not conform to spec », valeur `x`, spec `arg-list`, prédicat `vector?`) | Cas réel — Clojure 1.9 vérifie ses propres macros (2017) | https://clojure.org/news/2017/12/08/clojure19 ; changes.md (§ 2.1 de 1.9) |
| `pages/clojure/lecon-13.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe calculait un prix après remise ») | remplacé par : CLJ-1285, un bogue des sets et maps à collision de hachage trouvé par test génératif (collection-check, sur simple-check, ancien nom de test.check), corrigé pour 1.6 (rejoué : `=` vaut `false` en 1.5.1, `true` en 1.6.0) | Cas réel — un test génératif trouve un bogue des sets de Clojure (2013) | https://clojure.atlassian.net/browse/CLJ-1285 (lu par l'API REST) ; https://github.com/ztellman/collection-check (README, `project.clj` du premier commit : `reiddraper/simple-check 0.5.1`) ; https://raw.githubusercontent.com/clojure/test.check/master/doc/migrating-from-simple-check.md |
| `pages/clojure/lecon-14.html#1` | INVÉRIFIABLE — récit anonyme (« Une plateforme analysait des fichiers de logs ») | remplacé par : « Transducers are Coming » (testé : `sequence`, `transduce`, `into` sur le `xform` du billet) | Cas réel — « Transducers are Coming » (2014) | https://clojure.org/news/2014/08/06/transducers-are-coming |
| `pages/clojure/lecon-15.html#1` | INVÉRIFIABLE — produit nommé : « re-frame, le framework ClojureScript le plus répandu », « a inspiré Redux » sans source | remplacé par : Clojure 1.11 ajoute `update-keys` et `update-vals`, ticket CLJ-1959 de 2016 (testé en 1.12.6) | Cas réel — Clojure 1.11 ajoute update-keys et update-vals (2022) | https://clojure.org/news/2022/03/22/clojure-1-11-0 ; https://clojure.atlassian.net/browse/CLJ-1959 (lu par l'API REST) ; changes.md (§ 3.3 de 1.11) |
| `pages/clojure/lecon-16.html#1` | INVÉRIFIABLE — illustration générale (un intergiciel Ring anonyme) | remplacé par : le ticket CLJ-733 « Data Conveying Exception » (Stuart Halloway, 2011) et `ex-info`/`ex-data` dans Clojure 1.4 (testé : `ex-data` rend la map ; `ExceptionInfo` hérite de `RuntimeException`) | Cas réel — Clojure 1.4 et ex-info (2012) | https://clojure.atlassian.net/browse/CLJ-733 (lu par l'API REST) ; changes.md (§ 2.4 de 1.4) ; https://github.com/clojure/clojure/releases/tag/clojure-1.4.0 |
| `pages/clojure/lecon-17.html#1` | INVÉRIFIABLE — produits nommés (Metabase, Clerk) mais « les développeurs bâtissent ces pipelines au REPL » sans source | remplacé par : Morse, navigateur de données au REPL | Cas réel — Morse, explorer ses données au REPL (2023) | https://clojure.org/news/2023/04/28/introducing-morse (billet daté du 24 avril 2023) |

## Cas par cas — `elixir`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/elixir/lecon-01.html#1` | INVÉRIFIABLE — produits nommés sans date ni source (WhatsApp « des millions de connexions par serveur », Discord) ; ces deux sujets sont déjà racontés par `erlang/lecon-01` et `erlang/lecon-09` | remplacé par : Change.org (prototypes en JRuby, Akka Streams, Node.js et Elixir ; pic de 10 millions de messages ; plus d'un milliard d'e-mails par mois) | Cas réel — Change.org confie ses e-mails à Elixir (2020) | https://elixir-lang.org/blog/2020/10/27/delivering-social-change-with-elixir-at-change.org/ |
| `pages/elixir/lecon-02.html#1` | INVÉRIFIABLE — usage général (`File.read/1` et `{:ok, _}`/`{:error, _}`), vrai sur le fond | remplacé par : Elixir 1.17 et les types inférés des motifs (rejoué en 1.20.5 : avertissements sur `%{adress: a} = client` et `client.adress`) | Cas réel — Elixir 1.17 tire des types des motifs (2024) | https://elixir-lang.org/blog/2024/06/12/elixir-v1-17-0-released/ |
| `pages/elixir/lecon-03.html#1` | **INVENTÉ** — « Imagine un module bancaire… » (B2) ; le contenu technique était juste | remplacé par : Elixir 1.5, `Exception.blame/3` et les `FunctionClauseError` qui montrent les clauses tentées (rejoué : « Attempted function clauses (showing 2 out of 2) », motifs fautifs entre tirets) | Cas réel — Elixir 1.5 montre les clauses tentées (2017) | https://elixir-lang.org/blog/2017/07/25/elixir-v1-5-0-released/ |
| `pages/elixir/lecon-04.html#1` | INVÉRIFIABLE — usage général (aliasing) ; WhatsApp (sujet d'`erlang`) sans source | remplacé par : Elixir 0.13, les maps, la mise à jour `%{map \| …}` et les structs (rejoué : la map d'origine ne change pas ; une clé absente lève une erreur, `KeyError` aujourd'hui) | Cas réel — Elixir 0.13 introduit les maps et les structs (2014) | https://elixir-lang.org/blog/2014/04/21/elixir-v0-13-0-released/ |
| `pages/elixir/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe traite chaque nuit un export ») | remplacé par : l'exemple du comptage de mots de José Valim (`File.read!` contre `File.stream!` et `Stream.flat_map`) | Cas réel — José Valim compte les mots d'un fichier avec Stream (2016) | https://elixir-lang.org/blog/2016/07/14/announcing-genstage/ |
| `pages/elixir/lecon-06.html#1` | INVÉRIFIABLE et en partie INEXACT — produit nommé (Phoenix) : le pipeline `conn \|> verifier_session() \|> …` est présenté comme du Phoenix, dont les pipelines se déclarent par `plug` ; ni date ni source | remplacé par : Elixir 1.12 ajoute `then/2` et `tap/2` « pour faciliter le travail avec les pipelines » (rejoué) | Cas réel — Elixir 1.12 ajoute then et tap aux pipelines (2021) | https://elixir-lang.org/blog/2021/05/19/elixir-v1-12-0-released/ |
| `pages/elixir/lecon-07.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe qui gère un tunnel de paiement ») ; Discord « sans jamais recourir aux exceptions » sans source | remplacé par : Elixir 1.2 introduit `with` ; `else` arrive en 1.3 (rejoué) | Cas réel — Elixir 1.2 introduit with (2016) | https://elixir-lang.org/blog/2016/01/03/elixir-v1-2-0-released/ ; https://github.com/elixir-lang/elixir/blob/v1.3/CHANGELOG.md |
| `pages/elixir/lecon-08.html#1` | INEXACT — produit nommé : « un processus coûte quelques centaines d'octets » (le guide d'efficacité d'Erlang : 327 mots, soit environ 2,6 Ko en 64 bits) ; WhatsApp 2012 déjà raconté par `erlang/lecon-01` ; Discord sans source | remplacé par : X-Plane, un processus Elixir par connexion UDP | Cas réel — X-Plane, un processus par joueur connecté (2021) | https://elixir-lang.org/blog/2021/07/29/bootstraping-a-multiplayer-server-with-elixir-at-x-plane/ ; (vérification de l'ancien : https://www.erlang.org/doc/system/eff_guide_processes.html) |
| `pages/elixir/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (B2), technique exacte | remplacé par : le banc des 2 millions de connexions de Phoenix (boîte aux lettres de `:timer` à 40 000 messages ; serveur PubSub unique dont les abonnements expirent à 1,3 million ; pool de serveurs PubSub) ; dans Phoenix 1.0.3 ce serveur est un `GenServer` et l'abonnement un `GenServer.call` | Cas réel — Phoenix et ses deux millions de connexions (2015) | https://www.phoenixframework.org/blog/the-road-to-2-million-websocket-connections ; https://github.com/phoenixframework/phoenix/blob/v1.0.3/lib/phoenix/pubsub/local.ex (commit de la version du 28 septembre 2015) |
| `pages/elixir/lecon-10.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe exploitait un service d'agrégation ») | remplacé par : Community, ses superviseurs qui rétablissent les connexions à RabbitMQ et à la base | Cas réel — Community et ses superviseurs (2021) | https://elixir-lang.org/blog/2021/02/03/social-messaging-with-elixir-at-community/ |
| `pages/elixir/lecon-11.html#1` | INEXACT — généralisation : les exemples de « milliers de bibliothèques » sur HexDocs ne tournent pas tous, par garantie, comme doctests dans leur CI ; ni date ni source | remplacé par : Elixir 0.8.2 ajoute les doctests (2013), rappel du but par le blog d'Elixir en 2022 | Cas réel — Elixir 0.8.2 fait tester la documentation (2013) | https://elixir-lang.org/blog/2013/04/29/elixir-v0-8-2-released/ ; https://elixir-lang.org/blog/2022/12/22/cheatsheets-and-8-other-features-in-exdoc-that-improve-the-developer-experience/ |
| `pages/elixir/lecon-12.html#1` | Discord 2017 : VRAI sur l'essentiel (billet du 6 juillet 2017 ouvert) mais sujet déjà raconté par `erlang/lecon-09` ; WhatsApp « 450 millions d'utilisateurs avec une cinquantaine d'ingénieurs » sans source primaire, sujet d'`erlang` | remplacé par : Mozilla Hubs sur Phoenix | Cas réel — Mozilla Hubs, des espaces virtuels sur Phoenix (2018) | https://elixir-lang.org/blog/2021/06/02/social-virtual-spaces-with-elixir-at-mozilla/ ; (vérification de l'ancien : https://discord.com/blog/how-discord-scaled-elixir-to-5-000-000-concurrent-users) |
| `pages/elixir/lecon-13.html#1` | INEXACT — récit anonyme (« Une struct Compte ») : avec `@derive {Inspect, except: [:mot_de_passe]}`, `inspect` n'affiche pas `#Compte<mot_de_passe: ...>` mais les autres champs suivis de `...` (rejoué : `#Compte<nom: "ada", ...>`) | remplacé par : l'annonce d'Elixir 1.8 (`@derive {Inspect, only: …}`, `except:`) (rejoué : `#User<id: 1, name: "Jane", age: 33, ...>`) | Cas réel — Elixir 1.8 et les champs masqués par Inspect (2019) | https://elixir-lang.org/blog/2019/01/14/elixir-v1-8-0-released/ |
| `pages/elixir/lecon-14.html#1` | INVÉRIFIABLE — illustration générale (« Une page d'accueil affiche la météo… ») | remplacé par : Elixir 1.4 ajoute `Task.async_stream` et `max_concurrency` (rejoué) | Cas réel — Elixir 1.4 ajoute Task.async_stream (2017) | https://elixir-lang.org/blog/2017/01/05/elixir-v1-4-0-released/ |
| `pages/elixir/lecon-15.html#1` | INVÉRIFIABLE au sens de la règle — fonctionnement d'un produit nommé (ExUnit `assert`), vrai sur le fond, sans date ni source | remplacé par : Elixir 1.14 et la macro `dbg`, qui « comprend le code » et affiche chaque étape d'un pipeline (rejoué en 1.20.5) | Cas réel — dbg, une macro qui lit le pipeline (2022) | https://elixir-lang.org/blog/2022/09/01/elixir-v1-14-0-released/ |
| `pages/elixir/lecon-16.html#1` | INEXACT — récit anonyme (« Un visiteur ») : « sans code de validation dupliqué entre le client et le serveur » ne découle pas du changeset, qui valide côté serveur | remplacé par : le `registration_changeset` de `phx.gen.auth` dans Phoenix 1.6 (validations, hachage si valide, formulaire réaffiché avec les erreurs) | Cas réel — le formulaire d'inscription de phx.gen.auth (2021) | https://www.phoenixframework.org/blog/phoenix-1.6-released ; https://github.com/phoenixframework/phoenix/blob/v1.6.0/priv/templates/phx.gen.auth/schema.ex ; https://raw.githubusercontent.com/phoenixframework/phoenix/v1.6.0/priv/templates/phx.gen.auth/registration_controller.ex ; https://raw.githubusercontent.com/phoenixframework/phoenix/v1.6.0/priv/templates/phx.gen.auth/registration_new.html.heex |
| `pages/elixir/lecon-17.html#1` | INVÉRIFIABLE — usage général (« Sur un site de vente, chaque panier est souvent… un GenServer ») | remplacé par : Veeps, dont chaque panier **est** un GenServer (verrouillage pendant le paiement, expiration par message) | Cas réel — chez Veeps, chaque panier est un GenServer (2024) | https://elixir-lang.org/blog/2024/03/05/veeps-elixir-case/ |

## Décomptes

| | clojure | elixir | total |
|---|---:|---:|---:|
| « Cas réel » lus | 17 | 17 | 34 |
| hors de la règle avant → après | 17 → 0 | 17 → 0 | 34 → 0 |
| état trouvé : VRAI tel quel | 0 | 0 | 0 |
| état trouvé : INEXACT (au moins un détail faux) | 3 (07, 11, 12) | 5 (06, 08, 11, 13, 16) | 8 |
| état trouvé : INVENTÉ | 0 | 1 (03) | 1 |
| état trouvé : INVÉRIFIABLE (le reste ; `clojure/01` vrai sur son sujet mais avec trois noms sans source) | 14 | 11 | 25 |
| action : remplacé | 14 | 17 | 31 |
| action : corrigé sur son sujet | 3 | 0 | 3 |
| action : gardé tel quel / « Scénario » | 0 / 0 | 0 / 0 | 0 / 0 |

(Un cas INEXACT peut aussi contenir des affirmations invérifiables ; il est compté une fois, sous INEXACT.)

## Contrôles (sur la copie, après le dernier commit de contenu)

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=clojure` | **0** (17 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=elixir` | **0** (17 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b7-clojure-elixir 13eabe3` | **0 écart** (34 pages) |
| `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b7-clojure-elixir 13eabe3` | **0** |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées (les deux légitimes connues) |
| `node tools/verif.js --rapide` | voir ci-dessous |

**`lexique-diff`** : le premier passage donnait **43 écarts** — les anciens récits portaient des mots d'options
de QCM (par exemple, en `clojure/lecon-09`, toute la bonne réponse de la question 3 : « écrire », « règles »,
« validation », « instantané », « sécurité », « divergent », et le mot de distracteur « partage » ; en
`clojure/lecon-16`, « décrit », « client », « détail », « validation », « l'intergiciel »). Chaque mot sorti a été
remis dans une phrase exacte du nouveau récit, et chaque mot entré a été retiré (« abrégée », « plateformes »,
« fichiers », « correspondance », « échoue », « d'erlang », puis « éléments » au deuxième passage) : **0 écart**
au troisième passage, et encore 0 après les dernières retouches de relecture.

**`node tools/verif.js --rapide`** (lancé depuis PowerShell, machine chargée par les autres agents :
2 356,7 s) : **code 1, 50/54 OK, 4 signalés**, tous expliqués :

- `donnees` — seul **I18** (index dérivés périmés : `search-index.js` publié 4 360 605 o, régénéré
  4 363 413 o) ; I1 à I17 et I19 sans erreur. **Toléré** : l'orchestrateur régénère après fusion.
- `doc-rec` — `verif-recherche` ne trouve plus « 745 citent la source » dans la page du cours `doc` : mes
  34 lignes de source font bouger ce compteur. **Toléré** (régénéré après fusion). `doc-ref` est vert.
- `erreurs` et `rj-bash` — **environnement, pas contenu** : lancé depuis PowerShell, `bash` désigne
  `C:\Users\…\WindowsApps\bash.exe` (le lanceur de WSL), qui n'exécute rien ; d'où « (échec sans message) »
  pour les 10 entrées `sh-*` du décodeur et 0 ligne exécutée pour `bash/lecon-08`. Aucune page `bash` ni
  aucun outil ne diffère de `13eabe3` dans cette copie. Rejoués seuls avec le bash de Git en tête du `PATH` :
  `node tools/preuves/rejoue-bash.js` → **0** (4 scripts conformes, 8 lignes comparées) ;
  `node tools/verif-erreurs.js` → **0** (« Aucune faute », 78 extraits réexécutés).

## Ce qui reste ouvert (hors de ma part ou hors encadré, non traité)

1. **`elixir/lecon-09`** : un intertitre `<h2>Un cas réel&nbsp;: le store clé-valeur KeyValue</h2>` coiffe un
   exemple d'enseignement, pas un fait. L'extraction ne le voit pas (il ne commence pas par « Cas réel ») ;
   au lot 1, `sql/lecon-13` a reçu le même traitement : « Cas d'usage ». Non touché (hors encadré).
2. **Corps des leçons** : `clojure/lecon-09` (section « Où Clojure s'emploie ») dit encore « Nubank …,
   Walmart ou Apple l'utilisent en production » sans source ; `elixir/cours.html` cite WhatsApp et Discord.
   `elixir/lecon-07` ouvre la section `with` par « Voici le scénario réel ». Non touchés.
3. **Blocs de code sous « Un cas concret »** en `clojure/lecon-03`, `-04`, `-05` (facture TTC, état d'un panier,
   ventes de juillet) : ils illustraient l'ancien récit ; ils restent justes et lisibles seuls, mais le nouvel
   encadré ne les introduit plus. En `clojure/lecon-06`, le nouvel encadré (Om) renvoie bien à l'exemple
   d'annulation qui suit.
4. **Phrases de liaison à la notion, sans source propre** (vraies par construction, à juger par la
   contre-relecture) : `clojure/09` (règles de validation partagées entre navigateur et serveur grâce à un
   `.cljc`), `clojure/10` (étendre un protocol depuis un autre fichier), `clojure/14` (un `xform` qui garde les
   erreurs d'un journal), `clojure/16` (un intergiciel qui lit `ex-data`), `elixir/11` (un doctest devenu faux
   fait échouer les tests), `elixir/15` (une fonction ne recevrait que la valeur finale). Elles viennent en
   partie de la contrainte de `lexique-diff`.
5. **Foyers à trancher** : Discord sur Elixir (billet du 6 juillet 2017) est raconté par `erlang/lecon-09` (et
   `erlang/lecon-05`) ; son foyer naturel pourrait être `elixir` — je ne l'ai pas pris, par la règle « un sujet
   déjà raconté ailleurs ne se reprend pas ». `lisp/lecon-08` (B12) mentionne le bloc `go` de core.async comme
   macro : sujet désormais gardé par `clojure/lecon-11`.
6. **Recoupements internes** (sujets distincts, mêmes documents) : `changes.md` de Clojure est cité par
   `clojure/03`, `09`, `12`, `16` (sections de versions différentes) ; le blog d'Elixir par 15 cas (15 billets
   différents) ; le blog de Phoenix par `elixir/09` et `16`. `doublons.js` ne compare que les cours entre eux.
7. **Sujets à inscrire au registre `foyers.md`** après fusion : les 34 lignes `clojure/…` et `elixir/…` de
   `b7-reservations.txt`, dont les plus « célèbres » : Cognitect rejoint Nubank (2020, `clojure/01`),
   core.async (2013, `clojure/11`), transducteurs (2014, `clojure/14`), Om (2013, `clojure/06`), Phoenix et
   ses 2 millions de connexions (2015, `elixir/09`), Change.org (`elixir/01`), Veeps (`elixir/17`).

## Pour la fusion

- Branche `v18/b7-clojure-elixir` : 3 commits sur `13eabe3` (clojure, elixir, ce rapport) ; seules les
  34 pages `pages/clojure/lecon-NN.html` et `pages/elixir/lecon-NN.html` et ce rapport changent.
- Après fusion : régénérer les index dérivés (I18) et les chiffres du cours `doc` (`doc-rec`) ; inscrire les
  34 sujets au registre `foyers.md` ; relancer `verif.js --rapide` **depuis un shell où `bash` est celui de
  Git** (sinon `erreurs` et `rj-bash` rougissent pour une raison d'environnement).
- Contre-relecture : les sources de tickets Jira se lisent par l'API REST (`/rest/api/2/issue/CLJ-…`) ;
  les comportements se rejouent avec les jars de Maven Central et l'Elixir 1.20.5 / OTP 29.1.2 portables
  (`scratchpad/b7-clojure-elixir/outils/`, scripts dans `tests-clj/` et `tests-ex/`).

## Doutes et pièges rencontrés

- **Le PDF « A History of Clojure »** (HOPL IV) est derrière un défi Cloudflare (download.clojure.org redirige
  vers dl.acm.org, 403) : non utilisé, aucune affirmation n'en dépend.
- **Les dates de versions de Clojure** avant 1.7 ne sont pas dans `changes.md` : prises aux étiquettes du dépôt
  (pages de tags GitHub ouvertes, dates confirmées par l'API : 1.2.0 le 19 août 2010, clojure-1.4.0 le
  15 avril 2012, clojure-1.6.0 le 25 mars 2014). Les dates de Maven Central sont celles d'un dépôt ultérieur
  (1.2.0 : septembre 2010) et ont été écartées.
- **Morse** : l'URL du billet porte le 28 avril 2023, la page affiche « 24 April 2023 » : j'ai écrit le 24.
- **Phoenix 1.0.3** : le banc a eu lieu en octobre 2015 sur le code d'alors ; la version 1.0.3 (commit du
  28 septembre 2015) est la dernière étiquetée avant le banc, et son `Phoenix.PubSub.Local` est bien un
  `GenServer` dont l'abonnement passe par `GenServer.call`. Le billet ne nomme pas `GenServer` : c'est le code
  qui le dit, d'où les deux sources.
- **`Exception.blame`** : un module défini dans un script `.exs` n'affiche pas les clauses tentées ; il faut un
  module compilé (`elixirc`). D'où « Soit un module compilé… » dans le cas.
- **Typographie** : deux deux-points sans espace insécable restent, à l'intérieur de citations anglaises
  exactes (un titre de billet, le message « Oops, something went wrong! »).
- **Coût** : 34 cas, deux cours, outils portables téléchargés (Clojure, Erlang/OTP, Elixir) ; aucune
  contre-relecture faite ici (elle suit, par un autre agent).
