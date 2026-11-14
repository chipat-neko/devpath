# Rapport V18 — case B6 (lot 3) : les « Cas réel » des cours `kotlin` et `data-eng`

Copie de travail `D:\test-claude-b6-kotlin-dataeng`, branche `v18/b6-kotlin-dataeng`, partie de `1b45660`.
Scripts : `scratchpad/b6-kotlin-dataeng/` de la copie (ignoré par git) — `contenu-kotlin.js` et
`contenu-dataeng.js` (le texte exact de chaque nouvel encadré), `appliquer.js` (remplace l'intérieur de
`div.callout__body` du seul « Cas réel », contrôle la typographie, la structure et le titre, prouve que tout octet
hors de l'encadré est identique), `preuve-octets.js` (même preuve contre `1b45660`, pour les 35 pages),
`options.js` (mots d'options de QCM à garder, et ceux qu'un brouillon ferait entrer), `cherche.js` (sujet et URL
dans tout `pages/`, dans `foyers.md` et dans les réservations), `kt/` (programmes Kotlin d'essai).

Outil d'exécution téléchargé en version portable officielle dans le dossier de scratchpad de la copie :
**kotlinc 2.4.21** (`kotlin-compiler-2.4.21.zip` des versions GitHub de JetBrains, empreinte SHA-256
`7cc140e7…33e75cd` identique à celle publiée), lancé avec le Java 27 installé. Sources de bibliothèques lues
dans les archives `-sources.jar` officielles de Google Maven (`dl.google.com`).

## 1. Bilan

| cours | « Cas réel » | trouvés VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `kotlin` | 21 | 0 | 7 | 13 | 1 | 0 | 5 | 16 | 0 |
| `data-eng` | 14 | 0 | 0 | 10 | 4 | 0 | 0 | 14 | 0 |
| **total** | **35** | **0** | **7** | **23** | **5** | **0** | **5** | **30** | **0** |

Le cours `kotlin` mêlait des récits anonymes (« une équipe », « un back-end e-commerce », « Imagine un service de
panier »), des usages généraux et des cas sur des produits nommés, dont plusieurs faux : la fonction `Text` de
Compose n'a pas « une vingtaine » de paramètres mais seize ; Room n'a pas de `Dao<T>` (B2) ; le code `sealed`
présenté en `lecon-09` ne compilait pas (B2) ; Android KTX n'est pas fait « que » de fonctions d'extension
(`bundleOf` est une fonction de premier niveau) ; Cash App n'a pas migré « une grande partie de sa logique » :
sa propre étude de cas dit que « la grande majorité » de son code reste native.

Le cours `data-eng` ne racontait aucun fait vérifiable : dix récits anonymes et **quatre INVENTÉS** (`lecon-06`,
`08`, `10`, `14` racontaient comme réels des incidents de **Vélociti**, l'entreprise fictive du fil rouge du
cours). Ils sont tous remplacés par de vrais cas sur la même notion.

Les 35 cas sont maintenant **datés, nommés et sourcés** ; chaque affirmation a été confrontée à une source
**ouverte** (WebFetch ou `curl`, les 52 URL citées rouvertes en fin de travail : 51 en HTTP 200, celle
d'Uber en 406 à `curl` mais lue trois fois par WebFetch). Tout sujet est réservé dans
`D:\test-claude\scratchpad\v18-parallele\b6-reservations.txt` (lignes `kotlin/…` et `data-eng/…`, deux
remplacées par moi-même, marquées « REMPLACE ma ligne »), après lecture du registre `foyers.md`, recherche du
sujet et de l'URL dans tout `pages/` et relecture des réservations des autres agents : aucun conflit.
`doublons.js` : toujours 2 sources partagées, les deux légitimes déjà connues ; aucune des miennes.
**Aucune source de presse** : communiqué officiel (GOV.UK), blogs d'ingénierie, notes de version,
documentation, propositions (KEEP), code source publié, forum de l'éditeur (Confluent).

**Comportements rejoués** avec kotlinc 2.4.21 : `when` incomplet sur une `enum` refusé (« 'when' expression must
be exhaustive ») ; `List` exposée puis castée en `MutableList` et modifiée de l'extérieur, `toList()` qui reste
un instantané ; `reduce` sur une liste vide (`UnsupportedOperationException: Empty collection can't be
reduced.`), `reduceOrNull`, `runningFold`, `runningReduce` (`[0, 1, 3, 6, 10, 15]`), référence `::foo` à
paramètre par défaut ; `chunked`, `windowed(4) { it.average() }` (`[7.5, 13.5, 21.5, …]`), `zipWithNext`, et
`generateSequence(1) { it + 1 }.windowed(3).take(2)` qui rend `[[1, 2, 3], [2, 3, 4]]` en ne générant que quatre
éléments ; *explicit backing fields* (`articles.add` accepté dans la classe, refusé dehors) ; `data object` qui
s'affiche par son nom et `object` ordinaire qui s'affiche `Nom@hachage` ; déclarations imbriquées sans
`: EtatEcran` (« check for instance is always 'false' ») ; `@DslMarker` (« cannot be called in this context with an
implicit receiver »). Lus dans le code publié : la signature de `Text` (Compose Material 1.0.0 et Material 3
1.0.0 : seize paramètres, quinze par défaut), `FragmentViewModelLazy.kt` (fragment-ktx 1.1.0), `ViewModelLazy`
(lifecycle-viewmodel-ktx 2.1.0), `String.toUri()`, `SharedPreferences.edit { }`, `View.doOnPreDraw` et `bundleOf`
(core-ktx 0.1), `SearchResultUiState`, `NetworkNewsResource` et `NewsFeed.kt` (Now in Android, branche `main`).

**Des sources primaires se trompent de date** (règle du lot 1 : un fait se recoupe) : la page
« What's new in Kotlin 1.1 » de kotlinlang.org affiche « Released: 15 February 2016 » (c'est la date de Kotlin
1.0 ; la version 1.1 sort le 1er mars 2017 selon le blog Kotlin et la version GitHub `v1.1`) ; la page
« What's new in Kotlin 2.4.0 » affiche « July 14, 2026 » (date de la 2.4.10 ; la 2.4.0 sort le 3 juin 2026 selon
la page des versions, le blog Kotlin et GitHub). Les encadrés donnent les bonnes dates et citent le blog.

Nature : *événement* (fait daté), *produit* (produit ou document nommé), *anonyme* (récit sans sujet
identifiable), *général* (usage général présenté comme un cas), *fictif* (récit inventé ou personnage du cours).

## 2. Cas par cas — `kotlin`

L'intertitre collé au-dessus de chaque encadré est `<h2>Un cas réel</h2>` : il n'annonce aucun récit, il est
gardé tel quel.

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/kotlin/lecon-01.html#1` | INEXACT, événement : Uber et Evernote absents de l'annonce (qui cite Expedia, Flipboard, Pinterest, Square) ; « aucune grande application n'est réécrite » et « le levier que JetBrains avait prévu » sans source | corrigé, même sujet : l'annonce de Google, « 100 % compatible », Kotlin ajouté peu à peu à un code existant, module livré avec Android Studio 3.0 | Cas réel — Google adopte Kotlin pour Android (2017) | https://android-developers.googleblog.com/2017/05/android-announces-support-for-kotlin.html |
| `pages/kotlin/lecon-02.html#1` | INVÉRIFIABLE, général (« l'une des toutes premières causes de plantage », sans source) | remplacé par : Google Home, -33 % de `NullPointerException` depuis les nouvelles fonctions en Kotlin, type de plantage n° 1 de la Play Console | Cas réel — Google Home et ses NullPointerException (2020) | https://android-developers.googleblog.com/2020/07/Google-home-reduces-crashes.html ; https://developer.android.com/stories/apps/google-home |
| `pages/kotlin/lecon-03.html#1` | INVÉRIFIABLE, général (« un écran passe par plusieurs états ») | remplacé par : Kotlin 1.6.0 avertit, Kotlin 1.7.0 refuse les instructions `when` incomplètes sur `enum`, `sealed`, `Boolean` (KT-47709) | Cas réel — Kotlin 1.7 refuse les when incomplets (2022) | https://kotlinlang.org/docs/whatsnew16.html ; https://kotlinlang.org/docs/compatibility-guide-17.html ; https://kotlinlang.org/docs/whatsnew17.html ; https://kotlinlang.org/docs/releases.html (dates, contrôle) |
| `pages/kotlin/lecon-04.html#1` | INEXACT, produit : `Text` déclare seize paramètres, pas « une vingtaine » ; « surcharges par dizaines dans les anciennes API Java » sans source | corrigé, même sujet, ancré à Compose Material 3 1.0.0 (la même liste de seize paramètres que Compose Material 1.0.0, lu aussi) | Cas réel — la fonction Text de Compose Material 3 (2022) | https://developer.android.com/jetpack/androidx/releases/compose-material3#1.0.0 ; https://dl.google.com/android/maven2/androidx/compose/material3/material3/1.0.0/material3-1.0.0-sources.jar ; https://developer.android.com/jetpack/androidx/releases/compose-material (contrôle) ; `material-1.0.0-sources.jar` (contrôle) |
| `pages/kotlin/lecon-05.html#1` | INVENTÉ, fictif (« Imagine un service de panier… ») | remplacé par : la proposition « Immutable Collections » d'Ilya Gorbunov, une collection exposée en lecture seule peut être recastée en modifiable | Cas réel — la proposition de collections immuables pour Kotlin (2016) | https://github.com/Kotlin/kotlinx.collections.immutable/blob/420b991bc3/proposal.md (version du 12 juillet 2016) ; https://github.com/Kotlin/kotlinx.collections.immutable/blob/master/docs/proposal.md ; README du dépôt ; historique des commits (API GitHub) |
| `pages/kotlin/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« un back-end e-commerce ») | remplacé par : Kotlin 1.4.0, `reduceOrNull`, `runningFold`/`scan`/`runningReduce`, références `::` vers des fonctions à paramètres par défaut | Cas réel — Kotlin 1.4 complète fold et reduce (2020) | https://kotlinlang.org/docs/whatsnew14.html ; https://kotlinlang.org/docs/releases.html (date) |
| `pages/kotlin/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« un serveur produit un journal de plusieurs gigaoctets ») | remplacé par : Kotlin 1.2 ajoute `chunked`, `windowed`, `zipWithNext` à `Iterable`, `Sequence`, `CharSequence` | Cas réel — Kotlin 1.2 ajoute chunked, windowed et zipWithNext (2017) | https://kotlinlang.org/docs/whatsnew12.html ; version GitHub `v1.2.0` (date, contrôle) |
| `pages/kotlin/lecon-08.html#1` | INVÉRIFIABLE, général (« sur une boutique en ligne, un `Panier`… ») | remplacé par : les *explicit backing fields* de Kotlin 2.3.0, stables en 2.4.0 | Cas réel — Kotlin 2.3 et les champs de stockage explicites (2025) | https://kotlinlang.org/docs/whatsnew23.html ; https://kotlinlang.org/docs/whatsnew24.html ; https://blog.jetbrains.com/kotlin/2026/06/kotlin-2-4-0-released/ ; https://kotlinlang.org/docs/releases.html |
| `pages/kotlin/lecon-09.html#1` | INEXACT, général (B2) : le `sealed interface` montré ne compile pas (déclarations sans `: EtatEcran`) ; sujet anonyme | remplacé par : Kotlin 1.9.0 rend stables les `data object` (introduits en 1.8.20), utiles dans les hiérarchies `sealed` ; le code est écrit juste et compilé | Cas réel — Kotlin 1.9 et les data object (2023) | https://kotlinlang.org/docs/whatsnew19.html ; https://kotlinlang.org/docs/sealed-classes.html (B2) |
| `pages/kotlin/lecon-10.html#1` | INVÉRIFIABLE, général : hiérarchie des vues Android (`Button` hérite en fait de `TextView`), « évite des milliers de bugs » sans source | remplacé par : classes finales par défaut contre les proxys de Spring ; plugins `all-open` et `kotlin-spring` de Kotlin 1.0.6 | Cas réel — Spring et le final par défaut de Kotlin (2016) | https://blog.jetbrains.com/kotlin/2016/12/kotlin-1-0-6-is-here/ ; https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0 |
| `pages/kotlin/lecon-11.html#1` | INEXACT, produit (B2) : Room n'expose pas de `Dao<T>` (`@Dao` est une annotation) ; l'intercepteur « côté Room/Retrofit » relève d'OkHttp | remplacé, recentré sur un objet que l'ancien encadré citait déjà : `by viewModels()` d'AndroidX Fragment 1.1.0, fonction `inline` à paramètre `reified` contraint par `ViewModel`, qui renvoie un `Lazy` | Cas réel — by viewModels() dans AndroidX Fragment 1.1.0 (2019) | https://developer.android.com/jetpack/androidx/releases/fragment#1.1.0 ; https://dl.google.com/android/maven2/androidx/fragment/fragment-ktx/1.1.0/fragment-ktx-1.1.0-sources.jar ; https://dl.google.com/android/maven2/androidx/lifecycle/lifecycle-viewmodel-ktx/2.1.0/lifecycle-viewmodel-ktx-2.1.0-sources.jar |
| `pages/kotlin/lecon-12.html#1` | INEXACT, produit : les KTX ne sont pas « que » des extensions (`bundleOf` est une fonction de premier niveau dans core-ktx 0.1) ; builders d'OkHttp, Ktor, Exposed « comme des blocs apply » sans source | corrigé, même sujet : l'annonce d'Android KTX (`toUri()`, `edit { }`, `doOnPreDraw { }`), avec le code de core-ktx 0.1 | Cas réel — Google présente Android KTX (2018) | https://android-developers.googleblog.com/2018/02/introducing-android-ktx-even-sweeter.html ; https://dl.google.com/android/maven2/androidx/core/core-ktx/0.1/core-ktx-0.1-sources.jar |
| `pages/kotlin/lecon-13.html#1` | INVÉRIFIABLE, anonyme (« un écran de profil »), plus « Ktor traite des dizaines de milliers de connexions » et « le standard chez Google, JetBrains » sans source | remplacé par : Roman Elizarov, « Structured concurrency », kotlinx.coroutines 0.26.0 | Cas réel — Roman Elizarov et la concurrence structurée (2018) | https://elizarov.medium.com/structured-concurrency-722d765aa952 |
| `pages/kotlin/lecon-14.html#1` | INVÉRIFIABLE, anonyme (« une équipe hérite d'une application Java ») | remplacé par : Duolingo passe son app Android à 100 % Kotlin (convertisseur, `@JvmStatic`, detekt, ktlint, NPE venues de dépendances Java non annotées) | Cas réel — Duolingo passe son app Android à Kotlin (2018-2020) | https://blog.duolingo.com/migrating-duolingos-android-app-to-100-kotlin/ |
| `pages/kotlin/lecon-15.html#1` | INEXACT, produit : seul le Play Store est sourcé ; « de nombreux écrans de l'app Google », « Twitter/X ou des pans d'apps bancaires écrits en Compose », « devenu le défaut » sans source | corrigé, même sujet : l'annonce de Compose 1.0 (plus de 2 000 applis, le Play Store, Square, Monzo, Twitter ; aperçu, interopérabilité) | Cas réel — Jetpack Compose 1.0 (2021) | https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html |
| `pages/kotlin/lecon-16.html#1` | INVÉRIFIABLE, anonyme (« une équipe doit remanier le calcul des frais bancaires ») | remplacé par : kotlinx.coroutines 1.6.0 refond `kotlinx-coroutines-test`, `runTest` remplace `runBlockingTest` | Cas réel — runTest arrive dans kotlinx-coroutines-test (2021) | https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0 (et la version 1.6.0 de `CHANGES.md`) ; https://github.com/Kotlin/kotlinx.coroutines/blob/1.6.0/kotlinx-coroutines-test/README.md ; https://github.com/Kotlin/kotlinx.coroutines/blob/1.6.0/kotlinx-coroutines-test/MIGRATION.md |
| `pages/kotlin/lecon-17.html#1` | INVÉRIFIABLE, général (« dans une application Android… », « l'immense majorité des applications ») | remplacé par : `StateFlow` introduit dans kotlinx.coroutines 1.3.6, stable avec `SharedFlow` en 1.4.0 | Cas réel — StateFlow entre dans kotlinx.coroutines (2020) | https://github.com/Kotlin/kotlinx.coroutines/blob/1.4.0/CHANGES.md ; versions GitHub `1.3.6` et `1.4.0` (dates) |
| `pages/kotlin/lecon-18.html#1` | INVÉRIFIABLE, général (Gradle, Ktor, Compose, kotlinx.html : vrais mais ni datés ni sourcés) | remplacé par : `@DslMarker` dans Kotlin 1.1 (KEEP-57 d'Andrey Breslav) | Cas réel — Kotlin 1.1 et l'annotation @DslMarker (2017) | https://kotlinlang.org/docs/whatsnew11.html ; https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0057-scope-control-for-implicit-receivers.md ; https://blog.jetbrains.com/kotlin/2017/03/kotlin-1-1/ |
| `pages/kotlin/lecon-19.html#1` | INVÉRIFIABLE, anonyme (« une application affiche la météo ») | remplacé par : kotlinx.serialization 1.0, première version stable | Cas réel — kotlinx.serialization 1.0 (2020) | https://blog.jetbrains.com/kotlin/2020/10/kotlinx-serialization-1-0-released/ |
| `pages/kotlin/lecon-20.html#1` | INEXACT, produit : « a migré une grande partie de sa logique » contredit (« la grande majorité » du code reste native) ; modèles, réseau, logique de présentation partagés, Compose et SwiftUI, « dizaines de millions », Netflix/Philips/McDonald's : absents de la source | corrigé, même sujet : l'étude de cas de Cash App (30 millions d'utilisateurs actifs par mois, essais en 2018, dépôt partagé, persistance et fonctions pures) | Cas réel — Cash App et Kotlin Multiplatform (2021) | https://blog.jetbrains.com/kotlin/2021/03/cash-app-case-study/ |
| `pages/kotlin/lecon-21.html#1` | INVÉRIFIABLE, anonyme (« une application de e-commerce ») | remplacé par : l'appli d'exemple Now in Android (`@Serializable NetworkNewsResource`, `sealed interface SearchResultUiState`, `when` sur `NewsFeedUiState`) | Cas réel — l'appli d'exemple Now in Android (2022) | https://android-developers.googleblog.com/2022/05/now-in-android-sample-app-alpha.html ; https://github.com/android/nowinandroid (arbre de `main` et trois fichiers lus en brut) |

## 3. Cas par cas — `data-eng`

Chaque encadré est enveloppé d'un intertitre `<h2>Cas réel</h2>` : il ne dit rien de l'ancien récit, il est gardé
tel quel (comme dans `bdd`, traité au lot 2). Seul l'encadré compte comme cas (règle d'`extraction.js`).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/data-eng/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« une jeune entreprise de mobilité », +40 % devenus +12 %) | remplacé par : Public Health England, 15 841 cas absents des chiffres quotidiens, fichiers trop gros pour le processus de transfert | Cas réel — Public Health England et les 15 841 cas manquants (2020) | https://www.gov.uk/government/news/phe-statement-on-delayed-reporting-of-covid-19-cases |
| `pages/data-eng/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« une équipe reprend le pipeline », facture × 4) | remplacé par : Jay Kreps, « Questioning the Lambda Architecture » (batch si la latence n'importe pas, flux sinon, pas les deux ; Kappa) | Cas réel — Jay Kreps et l'architecture Lambda (2014) | https://www.oreilly.com/radar/questioning-the-lambda-architecture/ |
| `pages/data-eng/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« une plateforme régionale de mobilité ») | remplacé par : Uber, de l'ETL ad hoc vers Vertica au brut ingéré une fois, sans transformation, dans Hadoop | Cas réel — Uber passe de l'ETL à un lac de données brutes (2018) | https://www.uber.com/blog/uber-big-data-platform/ (WebFetch ; `curl` 406) |
| `pages/data-eng/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« une équipe analytique », 120 Go → 14 Go) | remplacé par : Amazon Athena, 1 To de journaux texte → 130 Go de Parquet, requête 34 fois plus rapide, 99 % de données lues en moins | Cas réel — Amazon Athena, du texte au Parquet (2016) | https://aws.amazon.com/blogs/big-data/analyzing-data-in-s3-using-amazon-athena/ |
| `pages/data-eng/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« une équipe mobilité », fichier du lundi livré le mercredi) | remplacé par : le connecteur JDBC source de Kafka Connect, une ligne validée derrière le curseur jamais lue, `timestamp.delay.interval.ms` | Cas réel — la ligne que le connecteur JDBC de Kafka Connect n'a jamais lue (2021) | https://forum.confluent.io/t/jdbc-source-connector-loses-data-in-incrementing-and-timestamp-incrementing-modes/3175 ; https://docs.confluent.io/kafka-connectors/jdbc/current/source-connector/source_config_options.html |
| `pages/data-eng/lecon-06.html#1` | INVENTÉ, fictif (« L'équipe data de Vélociti… ») | remplacé par : Airbnb, tables dérivées de `core_data` en cascade, chiffres divergents, modèles certifiés reconstruits avant Minerva | Cas réel — Airbnb et ses tables dérivées en cascade (2021) | https://medium.com/airbnb-engineering/how-airbnb-achieved-metric-consistency-at-scale-f23cc53dea70 |
| `pages/data-eng/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« une plateforme de mobilité », millions de petits fichiers) | remplacé par : Cloudera, « The Small Files Problem » (150 octets par objet dans le namenode, 10 millions de fichiers ≈ 3 Go) | Cas réel — Cloudera et le problème des petits fichiers (2009) | https://www.cloudera.com/blog/technical/the-small-files-problem.html |
| `pages/data-eng/lecon-08.html#1` | INVENTÉ, fictif (« Après le fameux +40 %, l'équipe de Vélociti… ») | remplacé par : Maxime Beauchemin, « Functional Data Engineering » (tâches pures et idempotentes, partition réécrite en entier) | Cas réel — Maxime Beauchemin et les tâches idempotentes (2018) | https://maximebeauchemin.medium.com/functional-data-engineering-a-modern-paradigm-for-batch-data-processing-2327ec32c42a |
| `pages/data-eng/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« une régie de transport », trois lignes de cron) | remplacé par : Airbnb publie Airflow (du cron aux DAG en Python, ordonnanceur, backfill, sensors) | Cas réel — Airbnb ouvre le code d'Airflow (2015) | https://medium.com/airbnb-engineering/airflow-a-workflow-management-platform-46318b977fd8 |
| `pages/data-eng/lecon-10.html#1` | INVENTÉ, fictif (« le tableau de bord de Vélociti affiche 2,3 millions de trajets ») | remplacé par : Amazon publie Deequ (contraintes vérifiées à chaque version d'un jeu de données, publication arrêtée en cas d'échec) | Cas réel — Amazon publie Deequ, des tests pour les données (2019) | https://aws.amazon.com/blogs/big-data/test-data-quality-at-scale-with-deequ/ |
| `pages/data-eng/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« un service de mobilité », °C devenus °F) | remplacé par : GoCardless introduit les Data Contracts (la CDC exposait le modèle interne des services) | Cas réel — GoCardless et les contrats de données (2021) | https://medium.com/gocardless-tech/improving-data-quality-with-data-contracts-238041e35698 |
| `pages/data-eng/lecon-12.html#1` | INVÉRIFIABLE, anonyme (« un service de mobilité surveillait ses serveurs ») | remplacé par : le système de lignage de Netflix, et son service de SLA qui alerte sur les retards en amont | Cas réel — le lignage des données chez Netflix (2019) | https://netflixtechblog.com/building-and-scaling-data-lineage-at-netflix-to-improve-data-infrastructure-reliability-and-1a52526a7977 |
| `pages/data-eng/lecon-13.html#1` | INVÉRIFIABLE, anonyme (B2 : « une équipe analytique », facture triplée) | remplacé par : Shopify, une requête BigQuery estimée à 949 218,75 dollars par mois, ramenée à environ 1 370 par une table regroupée (*clustering*) | Cas réel — Shopify et la requête à un million de dollars (2022) | https://shopify.engineering/reducing-bigquery-costs |
| `pages/data-eng/lecon-14.html#1` | INVENTÉ, fictif (« le fournisseur de météo de Vélociti… ») | remplacé par : Midas, la certification des données chez Airbnb (spécification avec SLA, backfill et plan de reprise, contrôles automatiques, quatre revues) | Cas réel — Midas, la certification des données chez Airbnb (2020) | https://medium.com/airbnb-engineering/data-quality-at-airbnb-870d03080469 |

## 4. Décomptes et contrôles

- Lus : **35** « Cas réel » (kotlin 21, data-eng 14). Trouvés : VRAI 0, INEXACT 7, INVÉRIFIABLE 23,
  INVENTÉ 5. Actions : **30 remplacés**, **5 corrigés** (même sujet), **0 vérifié tel quel**, **0 « Scénario »**.
- Conformes à la règle : kotlin 0 → **21**, data-eng 0 → **14** (site : 543 → 578 sur 1 551 dans cette copie).
- Longueur : le corps des nouveaux encadrés compte de 135 à 221 mots (ancien : 84 à 198).
- `lexique-diff.js D:\test-claude-b6-kotlin-dataeng 1b45660` : **0 écart** sur les 35 pages. Premier jet :
  7 mots d'options entrés côté kotlin (« simple », « finales », « pendant », « appelle », « vérifications »,
  « déclaratif », « plutôt ») et 8 côté data-eng (« chargement », « supprime », « produit », « étaient »,
  « précédente », « technique », « d'accès », « calcul »), reformulés. Les mots d'options qui n'étaient que dans
  les anciens encadrés sont restés, dans une phrase vraie : kotlin « chargement », « mécanisme », « offrir »,
  « attente », « qu'une », « problème », « l'appel » (mot de la BONNE réponse de `lecon-17`), « pousse »,
  « vivent », « l'interface » ; data-eng « fichiers », « cluster », « allumé », « uniquement », « changement »,
  « simplement », « celles », « l'équipe », « moindre », « double », « puisque », « techniques », « serveurs »,
  « jamais », « affichées », « aurait ».
- Octets : `preuve-octets.js` contre `1b45660` — **35 pages, 0 problème** : hors de l'intérieur de l'encadré,
  tout est identique ; type d'encadré gardé (`note`) ; nombre de CR inchangé.

Codes de sortie, sur l'état final :

| contrôle | code |
|---|---:|
| `node tools/verif-contenu.js --cas-reel --cours=kotlin` | 0 |
| `node tools/verif-contenu.js --cas-reel --cours=data-eng` | 0 |
| `node tools/verif-contenu.js --strict` | 0 |
| `node tools/verif-html.js` | 0 |
| `node tools/verif-domaines-interdits.js` | 0 |
| `node tools/verif-qcm-lexique.js` | 0 |
| `node tools/verif-qcm-biais.js` | 0 |
| `node tools/doc/verif-normatif.js` (étape `normatf`) | 0 |
| `node tools/doc/verif-doc.js` (étape `doc-ref`) | 0 |
| `node tools/verif.js --rapide` | 1 — voir § 5 |

## 5. `verif.js --rapide`

**Premier passage** (après les deux premiers commits) : 54 étapes, 4 signalées — `donnees`, `doc-ref`,
`doc-rec` et **`normatf`**. Cette dernière n'est pas dans la liste tolérée : `verif-normatif.js` recompte les
leçons dont l'article contient « la spécification », et la page du cours `doc` en annonce 40 ; mon encadré de
`kotlin/lecon-05` (« dépose la spécification d'une proposition ») en faisait 41. Reformulé (« dépose une
proposition », le fait est inchangé) : `normatf` revient à 0, et `doc-ref` avec lui.

**Passage final** (état commité `b3d8379`, 482,8 s) : 54 étapes jouées, **2 signalées, les deux tolérées** :

- `donnees` : seul l'invariant **I18** est rouge (`search-index.js` publié 4 341 825 octets, regénéré 4 345 666 :
  index de recherche périmé par les nouveaux encadrés) ; I17 et I19 ne sont que des avertissements préexistants ;
- `doc-rec` : « 572 citent la source » introuvable dans `pages/doc/lecon-04` (le nombre de leçons qui citent la
  source de leur « Cas réel », mesuré sur tout le site, que mes 35 lignes de source font bouger).

L'orchestrateur les régénère après la fusion ; aucune ligne de source n'a été déformée pour les garder verts.

## 6. Commits de la branche `v18/b6-kotlin-dataeng`

- `e3b29a6` kotlin : 21 « Cas réel » vrais et sourcés — 16 remplacés, 5 corrigés, 0 Scénario ;
- `f45583e` data-eng : 14 « Cas réel » vrais et sourcés — 14 remplacés, 0 Scénario ;
- `d87788c` kotlin : date de Kotlin 2.4.0 (3 juin 2026, `lecon-08`) et « la spécification » retirée de
  `lecon-05` (étape `normatf`) ;
- `b3d8379` deux nuances de relecture (`kotlin/lecon-09` : « souvent » sans source ; `data-eng/lecon-07` :
  « revient sans cesse » ramené à « fréquente ») ;
- le commit de ce rapport.

Consignes de fusion : fusionner la branche telle quelle (pas de commit de fusion dans la branche), puis
regénérer les index dérivés (`build-index.js --write --fresh`, I18) et les chiffres du cours `doc`
(`doc-rec`) ; ajouter au registre `foyers.md` les 35 sujets des réservations `kotlin/…` et `data-eng/…` (la
dernière ligne de chaque cas fait foi : `data-eng/lecon-03` = Uber, `kotlin/lecon-04` = Material 3 1.0.0) ;
trancher le sort des deux CR préexistants (§ 7).

## 7. Ce qui reste ouvert

- **Deux CR préexistants, hors encadré** : `pages/kotlin/lecon-04.html` et `pages/kotlin/lecon-08.html` portent
  chacun **un** CR, déjà présent à `1b45660` (fichiers marqués `-text` par git), à la fin d'un bloc de code juste
  avant `</code>` (`…$note/20")\n}\r</code>` et `….map { it.average() }\r</code>`). Je ne l'ai pas retiré
  (« ne touche à rien d'autre dans la leçon ») : `controle-branche.js` le signalera (« 1 CR ») sur ces deux pages.
  À l'orchestrateur de décider : le retirer est une correction d'un octet, hors des « Cas réel ».
- **Dates fausses dans la documentation de Kotlin** (voir § 1) : « What's new in Kotlin 1.1 » (15 février 2016
  au lieu du 1er mars 2017) et « What's new in Kotlin 2.4.0 » (14 juillet 2026 au lieu du 3 juin 2026). Les
  encadrés ne reprennent pas ces dates.
- **KDoc contre code** dans fragment-ktx 1.1.0 : la documentation de `viewModels()` annonce une
  `IllegalArgumentException` avant l'attachement, le code lève une `IllegalStateException` ; l'encadré dit
  seulement « lève une exception ».
- **Signature d'auteur** : la page actuelle de Cloudera attribue « The Small Files Problem » (2009) à Balint Szele ;
  l'encadré cite « Cloudera » sans nom d'auteur. Le billet Deequ d'AWS (16 mai 2019) a été mis à jour (Deequ 3.0.3,
  Spark 3.5, jeu d'exemple changé) : la ligne de source dit « version mise à jour », et l'exemple `hasSize`
  (1,5 million de lignes) vient de cette version.
- **Le cours `data-eng` compte quatre cas liés à Airbnb ou à Maxime Beauchemin** (`lecon-06` Minerva, `08`
  Functional Data Engineering, `09` Airflow, `14` Midas) : sujets et sources distincts, mais une B13 pourrait
  vouloir diversifier.
- **Hors encadré, vu en lisant** : le corps du cours `data-eng` reste bâti sur Vélociti (le fil rouge fictif est
  légitime dans le corps et les exercices ; il ne l'est plus dans aucun « Cas réel »). `kotlin/lecon-21` mentionne
  SQLDelight dans ses exercices sans rapport avec l'encadré.
