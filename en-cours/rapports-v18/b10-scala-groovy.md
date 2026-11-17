# Rapport V18 — case B10, lot 7 : les cours `scala` et `groovy` (copie `b10-scala-groovy`, branche `v18/b10-scala-groovy`)

Copie de travail `D:\test-claude-b10-scala-groovy`, partie de `01795b6`. Part traitée : les **31 « Cas réel »**
des cours `scala` (17 : douze encadrés, `lecon-01` à `12`, et cinq **sections** `<h2>`, `lecon-13` à `17`) et
`groovy` (14 encadrés ; ceux de `lecon-13` et `14` sont enveloppés par un intertitre `<h2>Cas réel — …</h2>`).
Scripts et pièces dans `scratchpad/b10-scala-groovy/` (ignoré par git) : `appliquer.js` (remplace un encadré
du titre au `</div></div>` final, ou une section de son `<h2>` au `<h2>` suivant ; refuse un titre absent ou
multiple, un CR, un lien hors de la ligne de source, une ligne de source qui n'est pas en dernier, une espace
ordinaire devant « : ; ! ? » ; prouve que les octets hors de la zone sont identiques ; calcule à l'avance les mots
d'options de QCM qui entrent dans la page ou en sortent), `cas-scala.js` et `cas-groovy.js` (les 31 textes),
`qcm-mot.js` (options de QCM qui portent un mot), `dump.js`, `htmltxt.py`, `pdftxt.py`, `sc.sh` (scalac 3.10.1)
et `gv.sh` (Groovy 6.0.0), les essais `t/*`, les pages et PDF lus (`rdd.pdf`, `funsrv.pdf`, `ecoop20.pdf`…).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **17 hors de la règle à 0** pour `scala`
et de **14 à 0** pour `groovy` ; sur les 31 cas trouvés, **aucun n'était conforme ni gardable tel quel** :
29 remplacés par un cas réel daté et sourcé sur la même notion, **2 corrigés sur leur sujet** (`scala/07`
Catalyst, `groovy/08` Jenkins et le pipeline écrit en Groovy), **0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b10-scala-groovy`) : `4f3e407` (scala, 17 cas), `eea6399` (groovy, 14 cas), puis le
commit de ce rapport.

## Méthode

- Encadrés : seul l'intérieur du `div.callout__body` change (type `note` et icône gardés). Sections `scala/13`
  à `17` : de l'intertitre au `<h2>` suivant, comme le lit `extraction.js` ; le récit réel ouvre la section, le
  code et les tableaux de la leçon sont gardés, la ligne de source ferme la section (après le tableau-mémo).
  Dans ces zones, les affirmations sans source ont été retirées ou ramenées à ce que la source dit :
  « C'est exactement l'argument qui fait choisir Scala dans la fintech » et le titre « Pourquoi les équipes
  adorent ce style » (`scala/13`, devenu « Ce que ce style apporte »), « le débouché n°1 de Scala » et « font la
  différence entre un job qui tient en RAM et un OutOfMemoryError » (`scala/14`), « l'usage phare des type
  classes » et l'encadré « Scala 3 sait la dériver tout seul » (`scala/15`, l'INEXACT de B2), « La validation
  applicative est la norme du métier » et « la doc de Cats et de ZIO » (ZIO non vérifié → « la documentation de
  Cats », `scala/16`), « Ce modèle est celui d'un vrai back-end de e-commerce » (`scala/17`).
- Intertitres : les cinq `<h2>` des sections `scala` portent le nouveau sujet ; `groovy/14` : « le même code en
  production » → « un JSON trop gros pour la production » ; `groovy/13` garde « Cas réel — build.gradle » (le cas
  parle toujours du `build.gradle`) ; les `<h2>Cas réel</h2>` nus de `scala/01` à `04` n'annoncent aucun récit :
  gardés.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md` et dans tout `pages/` (noms et URL), puis
  inscrit au fichier commun `b10-reservations.txt` (31 lignes, aucune collision avec les quatre autres agents ;
  la seule ligne voisine, `cicd/lecon-11` « How We Build Code at Netflix », est un autre sujet). **Écartés** :
  Tony Hoare (foyer `csharp/lecon-08`, que racontait `scala/08`) ; « Spark chez Netflix », raconté deux fois
  (`scala/01` et `scala/12`) et jamais sourcé ; Flexcoin (cité par `sql/lecon-22`) ; le GOV.UK Design System
  (six cas ailleurs) ; RFC 7807/9457 Problem Details (cours `api`). **Écartés faute de source ouvrable** : le
  billet de James Strachan sur la naissance de Groovy (29 août 2003) et les billets de Netflix sur les scripts
  Groovy de son API (Medium répond 403, l'Internet Archive 429 au moment de la recherche).
- `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes connues). **Sources partagées
  dans le cours, pour deux sujets différents** : l'annonce de Scala 2.10 par Typesafe (`scala/02`
  l'interpolation, `scala/10` les Future, avec la SIP-14) et les notes de Scala 2.12.0 (`scala/06` les traits,
  `scala/13` l'Either biaisé, avec la pull request #5135) ; Marius Eriksen signe deux documents distincts
  (`scala/03` l'article PLOS 2013, `scala/17` *Effective Scala*).
- **Dates de Groovy** : les pages de notes de version de groovy-lang.org ne sont pas datées ; chaque date de
  sortie vient de l'API REST des versions du gestionnaire de tickets de l'ASF (`/rest/api/2/version/<id>`,
  ouverte pour 1.8.0, 2.0.0, 2.2.0, 2.3.0, 2.5.0, 3.0.0, 6.0.0) et c'est cette URL qui est citée.
- **Historique des tickets** lu dans leur chronologie, pas dans la description du jour : JENKINS-26481
  (`?expand=changelog` : titre d'origine « Closures only executed once… », renommé le 17 mars 2015, résolu le
  30 mai 2017, description jamais modifiée), GROOVY-6975 (titre renommé le 30 décembre 2014, résolu le
  25 octobre 2016, version corrigée ramenée à 2.5.0-alpha-1 le 29 mars 2017), scala/bug#10511 (description
  complétée par son auteur les 10 février et 3 mars 2018 : le cas l'écrit), scala/bug#4776 et #10919 lus pour
  l'histoire de `mapValues`, finalement racontée par le billet de Julien Richard-Foy.
- **Toutes les URL citées ont été ouvertes** (52 liens, 200 au dernier passage ; la copie Wayback du billet de
  Typesafe, lue en 200 pendant la recherche, répondait 429 — limitation de l'Internet Archive — au contrôle
  final).
- **Comportements rejoués** (archives officielles dans le scratchpad, Java 27 ; les caches que le lanceur
  `scala` de Scala CLI avait créés dans `AppData\Local` lors d'un premier essai ont été supprimés aussitôt, le
  reste passe par `scalac` puis `java`) :
  - scalac 3.10.1 : `f"$height%4d"` avec un `Double` → « Found: (height : Double), Required: Int, Long, Byte,
    Short, BigInt » ; `f"…%.2f…"` affiche `1,23s` (locale française de la machine : le cas ne dit rien du
    séparateur) ; deux parcours d'un `groupBy(_.age).view.mapValues(…)` à deux groupes → 4 appels ;
    `groupMap(_.age)(_.name)` ; tête d'une `LazyList` calculée au premier accès seulement ; `case class` de
    23 champs (construction, `copy(c23 = 99)`, `match` positionnel) ; `javap` sur le trait `Salueur` de la
    leçon : `public interface Salueur` avec `default saluer()`, aucun `Salueur$class.class` ; `Option(s)` avec
    `s` à `null` → `None`, et `-Yexplicit-nulls` refuse `val s: String = null` (« Found: Null, Required:
    String ») ; `List(2.0, 1.0, NaN, -1.0).sorted` → `List(-1.0, 1.0, 2.0, NaN)` sans avertissement avec
    `-deprecation` (min −1.0, max NaN) ; le code `Validation.scala` de `scala/13` → `Right(Ada
    <ada@calcul.org>, 36 ans)`, une garde `if` dans une `for` sur `Either` → « value withFilter is not a member
    of Either[String, Int] », `filterOrElse(_ > 10, "trop petit")` → `Left(trop petit)` ; le code `Json.scala`
    de `scala/15` compile et s'exécute ; `derives Encoder` sans compagnon → « Encoder[Produit] cannot be
    derived since trait Encoder has no companion object », avec un compagnon vide → « value derived is not a
    member of object Encoder » ; deux `given Show[Int]` → « Ambiguous given instances ».
  - Cats 2.13.0 (jars de Maven Central) : reprise simplifiée de l'exemple de la page `Validated` (mot de passe
    `password`, âge 15) → `for` : `Left(PasswordDoesNotMeetCriteria)` ; `mapN` sur `ValidatedNec` :
    `Invalid(Chain(PasswordDoesNotMeetCriteria, AgeIsInvalid))` — le cas dit « reprise simplifiée ».
  - Groovy 6.0.0 : `0.1 + 0.2 == 0.3` → `true`, type `java.math.BigDecimal`, `0.1d + 0.2d` →
    `0.30000000000000004`, `1 / 3` → `0.3333333333` ; Node 24 et jshell : `0.1 + 0.2` → `0.30000000000000004` ;
    exemples des notes de Groovy 3.0 (`Element(Helium, 2)`, `array?[1]` → `b` puis `null`, `4 !in [1, 3, 5, 7]`
    → `true`, `===`/`!==`) ; exemple `Predicate` des notes de 2.2 → `[1, 3, 5]` sans `as` ;
    `[1, 2, 3].each { println it }` et `replaceAll` → `1 2 3` et `ABC` hors de Jenkins ; `@TypeChecked` refuse
    `sommeeMethod()` (« Cannot find matching method ») ; `Hipster` de 2.3 → `web` ; `JsonBuilder` de 1.8 → la
    chaîne exacte des notes ; `JsonOutput.toJson(["Éric", "Καλύβια"])` → 58 caractères (`\u00c9ric`…),
    `JsonGenerator` avec `disableUnicodeEscaping()` → 18.
  - Maven Central : `org.spockframework:spock-core:2.3`, cité dans l'ancien `groovy/13`, n'existe pas (404) ;
    les artefacts 2.3 portent un suffixe (`2.3-groovy-3.0`, `2.3-groovy-4.0`, 200). Le code a disparu avec le
    cas remplacé.

## Les 31 cas

### `scala`

| cas | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/scala/lecon-01.html#1` | INVÉRIFIABLE (produit nommé : Spark « utilisé par Netflix, Airbnb ou la NASA », « centaines de machines », rien de sourcé ; même récit qu'en `lecon-12`) | remplacé | Cas réel — Scala 3 sort après huit ans de travail (2021) | https://www.scala-lang.org/blog/2021/05/14/scala3-is-here.html |
| `pages/scala/lecon-02.html#1` | INVÉRIFIABLE (anonyme : « une appli de facturation » ; Doobie/Quill sans source) | remplacé | Cas réel — Scala 2.10 et l'interpolation de chaînes (2013) | http://web.archive.org/web/20150907191827/https://www.typesafe.com/blog/announcing-scala-210-a-simpler-way-to-tackle ; https://docs.scala-lang.org/sips/11.html (SIP-11, Google Doc embarqué, non cité) ; scalac 3.10.1 |
| `pages/scala/lecon-03.html#1` | INVÉRIFIABLE (général : le titre de blog et le « principe » de Spark) | remplacé | Cas réel — Twitter compose ses serveurs avec andThen (2013) | https://monkey.org/~marius/funsrv.pdf (métadonnées : api.crossref.org, 10.1145/2525528.2525538, PLOS '13, 3 novembre 2013) |
| `pages/scala/lecon-04.html#1` | INVÉRIFIABLE (général ; « Netflix agrège ainsi ses journaux de visionnage » sans source) | remplacé | Cas réel — les collections de Scala 2.13 : groupMap et LazyList (2018) | https://www.scala-lang.org/blog/2018/06/13/scala-213-collections.html ; (lus : https://github.com/scala/bug/issues/4776, https://github.com/scala/bug/issues/10919, https://github.com/scala/scala/pull/7014, notes de 2.13.0) |
| `pages/scala/lecon-05.html#1` | INVÉRIFIABLE (usage général : schémas Spark en case class, messages Akka) | remplacé | Cas réel — Scala 2.11 lève la limite des 22 paramètres (2014) | https://github.com/scala/bug/issues/7296 (et ses commentaires par l'API) ; https://github.com/scala/scala/pull/2305 ; https://github.com/scala/scala/releases/tag/v2.11.0 ; api.github.com/users/retronym (Jason Zaugg) |
| `pages/scala/lecon-06.html#1` | INVÉRIFIABLE (général : ADT d'états, « Kotlin, Rust, Elm, Redux reposent exactement sur ce principe ») | remplacé | Cas réel — Scala 2.12 compile les traits en interfaces Java 8 (2016) | https://www.scala-lang.org/news/2.12.0/ ; scalac 3.10.1 + javap |
| `pages/scala/lecon-07.html#1` | VRAI sur Catalyst (règles par filtrage de motif, `x + 0`), INEXACT/INVÉRIFIABLE en partie : « les linters (ESLint) et formateurs (Prettier) reposent **tous** sur le même principe : modéliser en ADT, transformer par match » — sans source, et ces outils JavaScript ne travaillent pas par types algébriques et `match` | corrigé (sujet gardé, ESLint/Prettier retirés, détails de la source : trois `case`, point fixe, fonction partielle, 1 000 et 12 lignes) | Cas réel — Spark SQL et l'optimiseur Catalyst (2015) | https://www.databricks.com/blog/2015/04/13/deep-dive-into-spark-sqls-catalyst-optimizer.html |
| `pages/scala/lecon-08.html#1` | INVÉRIFIABLE (général : http4s/Play, « standard des API web ») ; Tony Hoare, sujet tenu par `csharp/lecon-08` | remplacé | Cas réel — « Scala with Explicit Nulls » : rendre null visible (2020) | https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ECOOP.2020.25 (et le PDF LIPIcs, lu avec pypdf : tables 1 et 2, §§ 1, 5.2, 5.3) ; https://docs.scala-lang.org/scala3/reference/experimental/explicit-nulls.html ; scalac 3.10.1 |
| `pages/scala/lecon-09.html#1` | INVÉRIFIABLE (général : tableau triable ; « dans Slick, chaque colonne fournit son propre given Ordering ») | remplacé | Cas réel — Ordering[Double], NaN et Scala 2.13 (2017-2020) | https://github.com/scala/bug/issues/10511 (et ses 24 commentaires) ; https://github.com/scala/scala/pull/6410 ; https://github.com/scala/bug/issues/11844 ; https://github.com/scala/scala/releases/tag/v2.13.0 ; https://github.com/scala/scala/releases/tag/v2.13.2 ; scalac 3.10.1 |
| `pages/scala/lecon-10.html#1` | INVÉRIFIABLE (général : page produit, « API Gateway ») | remplacé | Cas réel — SIP-14 : les Future entrent dans la bibliothèque standard (2013) | https://docs.scala-lang.org/sips/futures-promises.html ; billet de Typesafe (Wayback, ci-dessus) |
| `pages/scala/lecon-11.html#1` | INVÉRIFIABLE (général : CI, « aucun code non testé ne part en production ») | remplacé | Cas réel — Scala CLI devient la commande scala (2024) | https://docs.scala-lang.org/sips/scala-cli.html ; https://www.scala-lang.org/blog/2024/08/22/scala-3.5.0-released.html |
| `pages/scala/lecon-12.html#1` | INVÉRIFIABLE (produit nommé : « Netflix traite chaque nuit des pétaoctets… », banques) | remplacé | Cas réel — Akka change de licence, Apache Pekko prend le relais (2022) | https://akka.io/blog/why-we-are-changing-the-license-for-akka ; https://news.apache.org/foundation/entry/apache-software-foundation-announces-new-top-level-project-apache-pekko ; https://pekko.apache.org/ |
| `pages/scala/lecon-13.html#1` (h2) | INVÉRIFIABLE (général : « patron omniprésent », « l'argument qui fait choisir Scala dans la fintech ») | remplacé ; code gardé et rejoué | Cas réel — Scala 2.12 et l'Either biaisé à droite (2016) | https://github.com/scala/scala/pull/5135 ; https://www.scala-lang.org/news/2.12.0/ ; https://www.scala-lang.org/api/2.11.12/scala/util/Either.html (identité de « soc » : remerciements des notes de 2.12.0) ; scalac 3.10.1 |
| `pages/scala/lecon-14.html#1` (h2) | INVÉRIFIABLE (général ; « le débouché n°1 de Scala ») | remplacé ; code et tableau gardés | Cas réel — Spark et la fouille de journaux (2012) | https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final138.pdf (§§ 2.2.1 et 3, lu avec pypdf) ; https://www.usenix.org/conference/nsdi12/technical-sessions/presentation/zaharia |
| `pages/scala/lecon-15.html#1` (h2) | INEXACT (B2) : `derives Encoder` ne dérive rien « tout seul » — le compilateur génère `given … = Encoder.derived`, que la type class doit fournir ; « l'usage phare » sans source | remplacé ; encadré de dérivation corrigé, rejoué | Cas réel — Dotty 0.13 et la clause derives (2019) | https://www.scala-lang.org/api/3.3.8/docs/blog/2019/03/05/13th-dotty-milestone-release.html ; https://docs.scala-lang.org/scala3/reference/contextual/derivation.html ; https://com-lihaoyi.github.io/upickle/ ; scalac 3.10.1 |
| `pages/scala/lecon-16.html#1` (h2) | INVÉRIFIABLE (général : « la norme du métier ») | remplacé ; code, diagramme et tableau gardés | Cas réel — la documentation de Cats et le formulaire d'inscription (2023) | https://typelevel.org/cats/datatypes/validated.html ; https://github.com/typelevel/cats/blob/main/docs/datatypes/validated.md (historique par l'API GitHub : dernière révision le 18 février 2023) ; Cats 2.13.0 |
| `pages/scala/lecon-17.html#1` (h2) | INVÉRIFIABLE (B2 : back-end e-commerce générique) | remplacé ; encadré `AtomicReference` et tableau gardés | Cas réel — Effective Scala, le guide de Twitter (2012) | https://twitter.github.io/effectivescala/ (section « Concurrency », sous-partie « Collections » ; © 2012 ; dépôt créé le 31 janvier 2012 d'après api.github.com) |

### `groovy`

| cas | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/groovy/lecon-01.html#1` | INVÉRIFIABLE (« Netflix, LinkedIn et la plupart des grandes plateformes Java ont piloté leur CI/CD ainsi ») | remplacé | Cas réel — la JSR 241, Groovy candidat au titre de langage de Java (2004) | https://jcp.org/en/jsr/detail?id=241 |
| `pages/groovy/lecon-02.html#1` | INVÉRIFIABLE (général : « on l'apprécie pour scripter des traitements financiers ») | remplacé | Cas réel — les décimaux BigDecimal de Groovy (documentation de Groovy 6.0, 2026) | https://docs.groovy-lang.org/6.0.0/html/documentation/core-syntax.html ; https://issues.apache.org/jira/rest/api/2/version/12357525 ; Groovy 6.0.0, Node 24, jshell |
| `pages/groovy/lecon-03.html#1` | INVÉRIFIABLE (général ; « c'est exactement pourquoi Gradle et Jenkins ont adopté Groovy ») | remplacé | Cas réel — Groovy 3.0 et ses nouveaux opérateurs (2020) | https://groovy-lang.org/releasenotes/groovy-3.0.html ; …/version/12345566 ; Groovy 6.0.0 |
| `pages/groovy/lecon-04.html#1` | INVÉRIFIABLE (usage général du `build.gradle`) | remplacé | Cas réel — Groovy 2.2 et la coercition implicite des closures (2013) | https://groovy-lang.org/releasenotes/groovy-2.2.html ; …/version/12331908 ; Groovy 6.0.0 |
| `pages/groovy/lecon-05.html#1` | INVENTÉ (« Imagine des commandes sous forme de maps… » ; « les tableaux de bord… se construisent sur ce trio ») | remplacé | Cas réel — JENKINS-26481 : [1, 2, 3].each n'affichait que 1 (2015-2017) | https://issues.jenkins.io/browse/JENKINS-26481 (ticket, historique et 65 commentaires par l'API REST) ; https://www.jenkins.io/blog/2017/09/08/enumerators-in-pipeline/ ; Groovy 6.0.0 |
| `pages/groovy/lecon-06.html#1` | INVÉRIFIABLE (général : POGO, Lombok, Grails, « 40 lignes ») | remplacé | Cas réel — Groovy 2.0 et la vérification statique (2012) | https://groovy-lang.org/releasenotes/groovy-2.0.html ; …/version/12331877 ; Groovy 6.0.0 |
| `pages/groovy/lecon-07.html#1` | INVÉRIFIABLE (« des dizaines de millions de projets », « outil officiel d'Android depuis 2013 », sans source) ; le mécanisme de `compileSdk 34` mal nommé | remplacé (le vrai mécanisme : méthodes générées à l'exécution par Gradle, et leur dépréciation) | Cas réel — Gradle renonce à la « space assignment » (2024) | https://docs.gradle.org/8.12/userguide/upgrading_version_8.html (section dans « Upgrading from 8.11 and earlier », donc 8.12) ; https://gradle.org/releases/ (8.12 : 20 décembre 2024) |
| `pages/groovy/lecon-08.html#1` | INVÉRIFIABLE (produit nommé : « Jenkins a lancé le mouvement pipeline as code », « la norme dans toute l'industrie ») | corrigé sur son sujet, réécrit sur la source primaire | Cas réel — Jenkins 2.0 et le pipeline écrit en Groovy (2016) | https://www.jenkins.io/blog/2016/04/26/jenkins-20-is-here/ |
| `pages/groovy/lecon-09.html#1` | INEXACT (« Ouvre n'importe quel projet Android : son build.gradle est écrit en Groovy » : faux pour un projet neuf depuis Android Studio Giraffe, 2023) ; « des millions de développeurs » sans source | remplacé (le titre « faire du Groovy sans le savoir » retiré) | Cas réel — Android passe ses nouveaux builds au Kotlin DSL (2023) | https://android-developers.googleblog.com/2023/04/kotlin-dsl-is-now-default-for-new-gradle-builds.html |
| `pages/groovy/lecon-10.html#1` | INVÉRIFIABLE (« Spock et Grails s'appuient massivement sur les traits ») | remplacé | Cas réel — Groovy 2.3 introduit les traits (2014) | https://groovy-lang.org/releasenotes/groovy-2.3.html ; …/version/12331916 ; Groovy 6.0.0 |
| `pages/groovy/lecon-11.html#1` | INVÉRIFIABLE (général : « des milliers de scripts d'ops ») | remplacé | Cas réel — Groovy 1.8 intègre JSON (2011) | https://groovy-lang.org/releasenotes/groovy-1.8.html ; …/version/12331860 ; Groovy 6.0.0 |
| `pages/groovy/lecon-12.html#1` | INVÉRIFIABLE (B2 : le « succès de Spock » dû aux tables where, sans source) | remplacé | Cas réel — Spock 2.0 déroule les tables where par défaut (2021) | https://spockframework.org/spock/docs/2.0/release_notes.html ; https://spockframework.org/spock/docs/2.0/migration_guide.html |
| `pages/groovy/lecon-13.html#1` | INVÉRIFIABLE (« le fichier de build le plus édité de la planète JVM ») ; coordonnée `spock-core:2.3` inexistante (404) | remplacé | Cas réel — le manuel de Gradle et les blocs délégués (Gradle 9.9.1, 2026) | https://docs.gradle.org/9.9.1/userguide/groovy_build_script_primer.html (et sa version Markdown `.md`) ; https://gradle.org/releases/ (9.9.1 : 10 novembre 2026) ; repo1.maven.org (spock-core) |
| `pages/groovy/lecon-14.html#1` | INVÉRIFIABLE (général : « milliers de scripts d'exploitation », « pain quotidien de l'automatisation ») | remplacé ; intertitre `<h2>` renommé | Cas réel — GROOVY-6975 : un JSON 4,8 fois trop gros (2014-2018) | https://issues.apache.org/jira/browse/GROOVY-6975 (ticket, commentaire et historique par l'API REST) ; …/version/12343341 ; Groovy 6.0.0 |

## Décomptes

| | scala | groovy | total |
|---|---:|---:|---:|
| lus | 17 | 14 | 31 |
| VRAI tel quel | 0 | 0 | 0 |
| INEXACT | 2 (`07`, `15`) | 1 (`09`) | 3 |
| INVENTÉ | 0 | 1 (`05`) | 1 |
| INVÉRIFIABLE | 15 | 12 | 27 |
| remplacés | 16 | 13 | 29 |
| corrigés sur leur sujet | 1 (`07`) | 1 (`08`) | 2 |
| « Scénario » | 0 | 0 | 0 |
| conformes à la règle | 0 → 17 | 0 → 14 | 0 → 31 |

## Contrôles (sur l'état commité)

- `node tools/verif-contenu.js --cas-reel --cours=scala` → **0** ; `--cours=groovy` → **0**.
- `node tools/verif-contenu.js --strict` → **0** (« Toutes les leçons tiennent le standard · 0 maigre »).
- `node tools/verif-html.js` → **0** ; `node tools/verif-domaines-interdits.js` → **0**.
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**.
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b10-scala-groovy 01795b6` → **0 écart** sur
  31 pages. Le premier jet en faisait 27 (mots d'options entrés ou sortis), et deux retouches en ont créé deux autres (« compilateur », « fichier ») ; chacun a été traité dans le texte
  du cas, par une phrase exacte : par exemple « modifiée » (`scala/05`, la copie modifiée par `copy`),
  « chargement » (`scala/06`, ce que `javap` montre de la classe chargée), « naturel » (`scala/09`, un ordre
  n'est pas l'ordre naturel figé d'un type), « d'attente » (`scala/10`, les deux demandes partent ensemble),
  « personne » (`scala/11`), « saisie » (`scala/16`), « partent » et « modifier » (`scala/17`, la phrase
  d'origine sur les deux requêtes), « scripts » et « jenkins » (`groovy/14`, renvoi à la leçon 8) ; mots gagnés
  évités (« génère », « ensemble », « nullité », « commun », « compile », « l'objet », « compilation »,
  « parcourir », « fichier »…) ; « Sources » au pluriel évité dans `scala/13`, où un distracteur porte
  « sources ».
- `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b10-scala-groovy 01795b6` → **OK** (0 CR,
  0 domaine interdit, octets identiques hors « Cas réel », types gardés, 31 zones avant, 31 après).
- `node tools/cas-reels/lots/doublons.js` → **2** sources partagées entre cours (les deux légitimes), code 0.
- `node tools/verif.js --rapide` → voir la dernière section.

## Ce qui reste ouvert

- **Hors encadré, non corrigé** : `scala/lecon-12`, liste « Où Scala s'emploie », affirme « Twitter/X,
  Netflix, Disney+ ont des briques Scala » sans source (hors de la zone « Cas réel », donc hors de ma part).
- **Dates tirées d'une version de documentation** : `groovy/02` (documentation de Groovy 6.0.0, 2026) et
  `groovy/13` (manuel de Gradle 9.9.1, 2026) sont des cas « produit nommé » datés par la version de la
  documentation citée, comme `java/lecon-06` ; `scala/16` est daté par la dernière révision de la page de Cats
  (18 février 2023, historique du dépôt). Si B13 exige un événement daté, ce sont les trois à revoir.
- `groovy/14` renvoie à la leçon 8 (« les scripts d'un pipeline Jenkins ») pour garder les mots « scripts » et
  « jenkins » de la bonne réponse d'un QCM : renvoi interne exact (le Jenkinsfile de la leçon 8 est un script
  Groovy), à ne pas retirer sans relancer `lexique-diff.js`.
- **À ajouter au registre `foyers.md` après la fusion** (sujets qu'un autre cours pourrait vouloir) :
  Scala 3.0.0, « Scala 3 is here » (2021) → `scala/lecon-01` ; Twitter, « Your Server as a Function »
  (Eriksen, PLOS 2013) → `scala/lecon-03` ; Spark, article RDD (NSDI 2012) → `scala/lecon-14` ; Spark SQL,
  Catalyst (Databricks, 2015) → `scala/lecon-07` ; « Scala with Explicit Nulls » (ECOOP 2020) →
  `scala/lecon-08` ; Ordering[Double] et NaN (scala/bug#10511, 2017-2020) → `scala/lecon-09` ; SIP-14, Futures
  and Promises (2013) → `scala/lecon-10` ; Akka passe en BSL, Apache Pekko (2022-2024) → `scala/lecon-12` ;
  Effective Scala, Twitter (2012) → `scala/lecon-17` ; Cats, page Validated → `scala/lecon-16` ; JSR 241
  (2004) → `groovy/lecon-01` ; JENKINS-26481 (2015-2017) → `groovy/lecon-05` ; Gradle 8.12 et la « space
  assignment » (2024) → `groovy/lecon-07` ; Jenkins 2.0 (2016) → `groovy/lecon-08` ; Android et le Kotlin DSL
  par défaut (2023) → `groovy/lecon-09` ; Spock 2.0 (2021) → `groovy/lecon-12` ; GROOVY-6975 (2014-2018) →
  `groovy/lecon-14`.

## `node tools/verif.js --rapide`

Lancé une fois, sur une machine chargée (cinq agents en parallèle) : le passage a été **coupé à 25 minutes**
par la limite que j'avais fixée (`timeout 1500`, code 124) pendant l'étape `etude-5` ; 45 étapes avaient
rendu leur verdict. Les étapes non jouées ont été lancées ensuite avec
`node tools/verif.js --rapide --seules=etude-euclide,etude-inconnu,erreurs-sql,decodeur,preuves/git-modele,preuves/git-commandes,verif-lexique-clic,verif-cours-progression`
(code 1 : `etude-6` et `decodwb` signalés, les six autres OK). Bilan, étape par étape :

- **OK** : `source`, `contenu`, `exemple`, `motifs`, `requete`, `python`, `erreurs`, `gitmodl`, `altern`,
  `moteurs`, `wrksrc`, `fraich`, `maths`, `gardech`, `qcmbiai`, `qcmlexi`, `contras`, `sql-blc`, `js-etiq`,
  `txt-etiq`, les neuf `rj-*`, `domaine`, `mth-acc`, `mth-ren`, `mth-e3` à `mth-e5`, `etude-1`, `etude-2`,
  `etude-4`, `etude-5`, `err-sql`, `gitmod`, `gitcmdp`, `lexique`, `mth-prg`.
- **`donnees` (SIGNALÉ, toléré)** : la seule erreur est l'invariant **I18** — `js/search-index.js` diverge du
  contenu regénéré (+5 985 octets) ; index dérivé que l'orchestrateur régénère après la fusion.
- **`doc-ref`, `doc-rec`, `normatf` (SIGNALÉS, tolérés)** : chiffres du cours `doc` mesurés sur tout le site et
  que mes lignes de source et mes textes font bouger — « leçons qui renvoient à un document » (la page cite 123),
  « leçons parlant de la spécification » (la page cite 45), « 1 186 citent la source » de leur « Cas réel ».
- **`etudes` et `etude-6` (SIGNALÉS, expliqués)** : la page dérivée `pages/etude-inconnu.html` publie un relevé
  des blocs de code du site (« 39 langages, 10 623 blocs de code » ; « groovy(67) ») ; trois blocs de code
  vivaient dans les anciens « Cas réel » de `groovy/04` (le bloc `dependencies`), `groovy/05` (les commandes en
  maps) et `groovy/06` (la classe `@Canonical`), remplacés par des récits sans bloc (`groovy/13` remplace son
  bloc par celui du manuel de Gradle : solde nul) → 10 620 et `groovy(64)`. Page dérivée, régénérée par
  l'orchestrateur (comme au lot 6, `5bbca52`) : non touchée.
- **`etude-3` et `decodwb` (SIGNALÉS sous charge, verts seuls)** : rejoués seuls, `node tools/preuves/etude-recherche.js`
  → code 0 (« écarts ligne à ligne : 0 », 0 faute) et `node tools/preuves/decodeur.js` → code 0 (55/55, 3/3
  contre-épreuves) ; le décodeur n'avait pas fini de charger dans Chrome pendant le passage chargé (« La page
  n'expose pas le décodeur — script non chargé ? »). Aucun fichier JavaScript n'est touché par cette branche.
- **`caract` (NON MESURÉ)** : délai interne de 600 s dépassé sous la charge ; relancé seul, voir ci-dessous.
- **`caract`, relancé seul** (`node tools/verif-controles.js`) : verdict imprimé « **0 accident(s), 2 emploi(s)
  voulu(s)** » (les deux emplois déclarés, U+0000 et U+0001, dans les outils), puis le processus a été coupé
  par ma limite de 900 s (code 124 de `timeout`, après le verdict) : la mesure est faite, la machine était
  saturée.

En résumé : aucun rouge propre à cette branche. Restent rouges, par construction et à régénérer par
l'orchestrateur après la fusion : `donnees` (I18, `js/search-index.js`), `etudes`/`etude-6`
(`pages/etude-inconnu.html`, trois blocs de code Groovy en moins) et les compteurs du cours `doc`
(`doc-ref`, `doc-rec`, `normatf`).

## Consignes de fusion

- Fusionner `v18/b10-scala-groovy` (3 commits au-dessus de `01795b6`) avec `git -c core.autocrlf=false` ;
  seules les 31 pages `pages/scala/lecon-01` à `17` et `pages/groovy/lecon-01` à `14`, plus ce rapport, sont
  touchées.
- Régénérer ensuite les index et pages dérivés jusqu'au point fixe (`js/search-index.js`,
  `pages/etude-recherche.html`, `pages/etude-inconnu.html`, compteurs du cours `doc`).
- Ajouter au registre `foyers.md` les 17 sujets listés dans « Ce qui reste ouvert ».
