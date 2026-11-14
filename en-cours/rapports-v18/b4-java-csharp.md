# V18 / B4 (lot 1) — les « Cas réel » de `java` et `csharp`

Copie `D:\test-claude-b4-java-csharp`, branche `v18/b4-java-csharp`, partie de `a244d0f`.
46 « Cas réel » (23 + 23), un par leçon, tous des encadrés `callout--note`.

**Méthode.** Chaque cas lu avec sa leçon ; chaque affirmation confrontée à une source réellement
ouverte (page web lue en texte, PDF lu avec `pypdf`, et pour le rapport du GAO, PDF scanné : pages
recomposées en image et lues). Un cas ancré a été vérifié affirmation par affirmation et corrigé ;
un cas anonyme, général ou fictif a été remplacé par un vrai cas daté et sourcé, sur la notion de la
leçon, en gardant la phrase qui relie le cas à la leçon. Remplacement mécanique de l'encadré seul
(`scratchpad/b4-java-csharp/appliquer.js`, avec preuve que tout le reste de la page est identique à
l'octet), plus, dans sept leçons C#, l'intertitre `<h2>Un cas réel : …</h2>` qui enveloppe l'encadré
et nommait l'ancienne anecdote. Aucun QCM touché, aucun index dérivé touché.

**Sources inaccessibles en lecture directe, et contournement** : `openjdk.org` et `netflixtechblog.com`
refusent l'outil web (403) mais se lisent par `curl` ; `bugs.openjdk.org` (JDK-8075939, JDK-8072909)
et la page « Why did we build xUnit 1.0? » (supprimée du site) n'ont pas pu être lues : aucun cas ne
s'appuie dessus. La fiche NVD de CVE-2014-1266 est lue par l'API JSON du NVD (la page HTML est vide
sans JavaScript) : c'est ce lien qui est cité. Le communiqué de la FTC (Uber) est lu par l'outil web
(citations exactes relevées : « by using an access key an Uber engineer had posted on a code-sharing
website »). Presse : **aucune** source de presse n'est citée ; tout est primaire (rapports d'enquête,
régulateurs, post-mortems, blogs d'ingénierie officiels, documentation officielle, normes, articles
originaux). Deux sources sont des blogs d'auteurs qui racontent leur propre travail (t0st pour GTA
Online, Jon Skeet pour Noda Time) : primaires pour ce qu'ils ont mesuré.

## Java — 23 cas

| # | identifiant | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| 1 | `pages/java/lecon-01.html#1` | VRAI sur l'essentiel, un détail non sourcé : « téléchargé par des millions de joueurs » ; pas de date (produit nommé) | corrigé : détail retiré, précisé par les métadonnées officielles (un seul `client.jar`, une seule empreinte SHA-1 ; seules les bibliothèques natives existent en trois variantes) | Cas réel — Minecraft : Java Edition (2011) | https://piston-meta.mojang.com/mc/game/version_manifest_v2.json ; https://piston-meta.mojang.com/v1/packages/75062586b830dd5160f13f1c9130eb365e01f1b9/1.0.json |
| 2 | `pages/java/lecon-02.html#1` | INEXACT (événement) : « 37 secondes après le décollage » (c'est 37 s après le début de l'allumage, **30 s après le décollage**, selon l'ESA) ; titre « un débordement à des centaines de millions » absent des sources primaires ; « dépassement de capacité **silencieux** » faux (une erreur d'opérande est levée, non protégée) | corrigé (les trois points) ; ajout : logiciel repris d'Ariane 4, vitesse horizontale cinq fois plus rapide, deux centrales hors service | Cas réel — Ariane 5 (1996) | https://www.esa.int/Newsroom/Press_Releases/Ariane_501_-_Presentation_of_Inquiry_Board_report ; https://www-users.cse.umn.edu/~arnold/disasters/ariane5rep.html |
| 3 | `pages/java/lecon-03.html#1` | INVÉRIFIABLE (anonyme : « un développeur », `break` oublié) | remplacé : JEP 361, le `switch` à flèche contre la chute accidentelle | Cas réel — JEP 361, le switch de Java 14 (2020) | https://openjdk.org/jeps/361 ; https://openjdk.org/projects/jdk/14/ |
| 4 | `pages/java/lecon-04.html#1` | INVÉRIFIABLE (anonyme : `mediane` qui trie le tableau de l'appelant) | remplacé : le bug de `Arrays.binarySearch` révélé par Joshua Bloch | Cas réel — Arrays.binarySearch (2006) | https://research.google/blog/extra-extra-read-all-about-it-nearly-all-binary-searches-and-mergesorts-are-broken/ |
| 5 | `pages/java/lecon-05.html#1` | INVÉRIFIABLE (anonyme : « une petite appli de caisse ») | remplacé : `Class.getSigners()` (JDK 1.1.1) qui laissait sortir un tableau modifiable — l'encapsulation trahie par une référence | Cas réel — Class.getSigners dans le JDK 1.1.1 (1997) | https://seclists.org/bugtraq/1997/Apr/158 ; https://securingjava.com/chapter-five/chapter-five-15.html |
| 6 | `pages/java/lecon-06.html#1` | INVÉRIFIABLE (anonyme : « une équipe », `HashSet`) | remplacé : `java.sql.Timestamp extends java.util.Date`, héritage d'implémentation que la doc déconseille de traiter comme un `Date` | Cas réel — java.sql.Timestamp (documentation de Java 21, 2023) | https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Timestamp.html ; https://openjdk.org/projects/jdk/21/ |
| 7 | `pages/java/lecon-07.html#1` | INVÉRIFIABLE (anonyme : « une boutique en ligne », PayPal) | remplacé : l'interface `java.sql.Driver` et le chargement automatique des pilotes de JDBC 4.0 | Cas réel — JDBC 4.0 et ses pilotes (2006) | https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Driver.html ; https://docs.oracle.com/javase/8/docs/api/java/sql/DriverManager.html ; https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/DriverManager.html ; https://jcp.org/en/jsr/detail?id=221 |
| 8 | `pages/java/lecon-08.html#1` | INVÉRIFIABLE (anonyme : « un service de commandes ») | remplacé : les défauts du motif « int enum » d'après le guide officiel de Java 5 | Cas réel — les enums de Java 5 (2004) | https://docs.oracle.com/javase/1.5.0/docs/guide/language/enums.html ; https://jcp.org/en/jsr/detail?id=176 |
| 9 | `pages/java/lecon-09.html#1` | INVÉRIFIABLE (anonyme, déjà jugé ainsi en B2) | remplacé : l'étude OSDI 2014 sur 198 pannes de Cassandra, HBase, HDFS, MapReduce et Redis (92 % / 35 %, `catch` vides) | Cas réel — les pannes de Cassandra, HBase et HDFS (2014) | https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf |
| 10 | `pages/java/lecon-10.html#1` | INVÉRIFIABLE (anonyme : « une équipe », « une quinzaine d'endroits ») | remplacé : `Collections.checkedCollection` de Java 5 et sa documentation sur les `ClassCastException` tardives | Cas réel — Collections.checkedCollection dans Java 5 (2004) | https://docs.oracle.com/javase/1.5.0/docs/api/java/util/Collections.html ; https://docs.oracle.com/javase/1.5.0/docs/guide/language/generics.html ; https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html ; https://jcp.org/en/jsr/detail?id=176 |
| 11 | `pages/java/lecon-11.html#1` | INVÉRIFIABLE (anonyme : « un traitement par lots ») | remplacé : l'avis oCERT-2011-003 (collisions de hachage) et la JEP 180 (arbres dans `HashMap`, Java 8) | Cas réel — les collisions de HashMap (2011) | https://ocert.org/advisories/ocert-2011-003.html ; https://openjdk.org/jeps/180 ; https://openjdk.org/projects/jdk8/ |
| 12 | `pages/java/lecon-12.html#1` | INVÉRIFIABLE (anonyme : `trouverClient`, pic de trafic) | remplacé : RxJava, les pipelines d'opérateurs de Netflix (2013) — voir « doutes » | Cas réel — Netflix et RxJava (2013) | https://netflixtechblog.com/reactive-programming-in-the-netflix-api-with-rxjava-7811c3a1496a ; https://openjdk.org/projects/jdk8/ |
| 13 | `pages/java/lecon-13.html#1` | INVÉRIFIABLE (anonyme : « un logiciel de caisse ») | remplacé : la panne de Windows Azure du 29 février 2012 et `LocalDate.plusYears` | Cas réel — Windows Azure et le 29 février (2012) | https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/ ; https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html |
| 14 | `pages/java/lecon-14.html#1` | INVÉRIFIABLE (anonyme : « un projet d'équipe », CI) | remplacé : la suite de tests de Lucene qui détecte les boucles mal compilées de Java 7 | Cas réel — Apache Lucene et Java 7 (2011) | https://issues.apache.org/jira/browse/LUCENE-3335 (et son API REST) ; https://mail-archive.com/announce@apache.org/msg01248.html |
| 15 | `pages/java/lecon-15.html#1` | INVÉRIFIABLE (anonyme : « un site e-commerce », `stock--`) | remplacé : Therac-25, variables partagées et « test » puis « affectation » non indivisibles | Cas réel — Therac-25 (1985-1987) | https://www.se.rit.edu/~swen-342/resources/Leveson,%20Turner%20-%20An%20Investigation%20of%20the%20Therac-25%20Accidents%20-%20IEEE%20Computer%20v26n7%20-%201993-07.pdf |
| 16 | `pages/java/lecon-16.html#1` | INVÉRIFIABLE (anonyme : « une application de paiement », ApplePay) | remplacé : JEP 441, l'exhaustivité des `switch` sur types scellés et le refus de la clause attrape-tout | Cas réel — JEP 441, le switch exhaustif de Java 21 (2023) | https://openjdk.org/jeps/441 ; https://openjdk.org/projects/jdk/21/ |
| 17 | `pages/java/lecon-17.html#1` | INVÉRIFIABLE (anonyme : `Map` statique de sessions) | remplacé : les fuites de chargeur de classes que Tomcat détecte depuis 6.0.24 | Cas réel — les fuites de Tomcat au redéploiement (2010) | https://cwiki.apache.org/confluence/display/TOMCAT/MemoryLeakProtection ; https://archive.apache.org/dist/tomcat/tomcat-6/v6.0.24/ |
| 18 | `pages/java/lecon-18.html#1` | INVÉRIFIABLE (anonyme : remise de 100 %) | remplacé : le bug de TimSort trouvé au CWI et le test de non-régression `TimSortStackSize2.java` d'OpenJDK | Cas réel — le tri TimSort d'OpenJDK (2015) | https://www.cwi.nl/en/news/java-bug-fixed-formal-methods-cwi/ ; https://raw.githubusercontent.com/openjdk/jdk/master/test/jdk/java/util/Arrays/TimSortStackSize2.java (cité sous sa forme github.com/…/blob/…) |
| 19 | `pages/java/lecon-19.html#1` | INVÉRIFIABLE (anonyme : « un service d'authentification ») ; la causalité « c'est pourquoi Spring Data JPA renvoie des Optional » n'est étayée par aucune source lue | remplacé : la panne de Google Cloud du 12 juin 2025 (champs vides, pointeur nul, pas de gestion d'erreur) | Cas réel — la panne mondiale de Google Cloud (2025) | https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW |
| 20 | `pages/java/lecon-20.html#1` | INVÉRIFIABLE (anonyme : « une application de panier ») | remplacé : `BigDecimal`, l'exception du JDK à « ordre naturel cohérent avec `equals` » | Cas réel — BigDecimal, l'exception du JDK (Java 21, 2023) | https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Comparable.html ; https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html |
| 21 | `pages/java/lecon-21.html#1` | INVÉRIFIABLE (anonyme : tableau de bord météo) | remplacé : JEP 110 (défauts de `HttpURLConnection`) et JEP 321 (le `HttpClient` du JDK 11) | Cas réel — le HttpClient de Java 11 (2018) | https://openjdk.org/jeps/110 ; https://openjdk.org/jeps/321 ; https://openjdk.org/projects/jdk/11/ |
| 22 | `pages/java/lecon-22.html#1` | INVÉRIFIABLE (anonyme : agrégateur de dix API) | remplacé : les threads virtuels épinglés de Netflix (2024) et la JEP 491 (JDK 24) | Cas réel — Netflix et les threads virtuels (2024) | https://netflixtechblog.com/java-21-virtual-threads-dude-wheres-my-lock-3052540e231d ; https://openjdk.org/jeps/491 ; https://openjdk.org/projects/jdk/24/ |
| 23 | `pages/java/lecon-23.html#1` | INVÉRIFIABLE (anonyme : « un développeur », carnet de contacts) | remplacé : l'architecture hexagonale d'Alistair Cockburn | Cas réel — l'architecture hexagonale d'Alistair Cockburn (2005) | https://alistair.cockburn.us/hexagonal-architecture |

## C# — 23 cas

| # | identifiant | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| 1 | `pages/csharp/lecon-01.html#1` | INEXACT (produits nommés) : « tourne **depuis ses débuts** sur C# » non étayé ; « des milliards de pages par mois » non dit (la source donne 66 millions de pages chargées le 9 février 2016) ; « **plus de la moitié des jeux mobiles** » faux de portée (Unity dit « plus de 70 % des **1 000 premiers** jeux mobiles », chiffre du 4e trimestre 2022) | corrigé : chiffres datés de la source, portée exacte du chiffre d'Unity | Cas réel — Stack Overflow (2016) | https://nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/ ; https://unity.com/solutions/mobile-game-development ; https://docs.unity3d.com/Manual/scripting-get-started.html |
| 2 | `pages/csharp/lecon-02.html#1` | INVÉRIFIABLE (anonyme : « un logiciel de caisse ») | remplacé : le Patriot de Dhahran (horloge en dixièmes, registres de 24 bits) | Cas réel — le Patriot de Dhahran (1991) | https://www.gao.gov/products/imtec-92-26 ; https://www.gao.gov/assets/imtec-92-26.pdf (PDF scanné, pages 1, 3, 4, 5 et 6 du rapport lues en image) |
| 3 | `pages/csharp/lecon-03.html#1` | INVÉRIFIABLE (général : « un logiciel de dessin ») | remplacé : « goto fail » chez Apple, le `if` sans accolades | Cas réel — « goto fail » chez Apple (2014) | https://www.imperialviolet.org/2014/02/22/applebug.html ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2014-1266 |
| 4 | `pages/csharp/lecon-04.html#1` | INEXACT (produit nommé) : « dix-huit versions dans .NET » — la page de référence recense **21** surcharges, toutes versions confondues (son tableau ne se filtre pas par version : impossible d'y vérifier un compte « .NET 8 ») | corrigé : 21 surcharges, toutes versions confondues ; `Math.Max` vérifié | Cas réel — les surcharges de Console.WriteLine (.NET 10, 2025) | https://learn.microsoft.com/en-us/dotnet/api/system.console.writeline?view=net-10.0 (et ?view=net-8.0) ; https://learn.microsoft.com/en-us/dotnet/api/system.math.max?view=net-10.0 ; https://devblogs.microsoft.com/dotnet/announcing-dotnet-10/ |
| 5 | `pages/csharp/lecon-05.html#1` | VRAI pour WPF (la doc dit « You can't bind to public fields »), MAUI non vérifié ; pas de date ni de source (produit nommé) | corrigé : limité à WPF, formulation de la doc | Cas réel — le data binding de WPF (documentation, 2024) | https://learn.microsoft.com/en-us/dotnet/desktop/wpf/data/binding-sources-overview |
| 6 | `pages/csharp/lecon-06.html#1` | VRAI (produit nommé), sans date ni source | vérifié ; mis en forme, complété par la liste officielle des dérivées et la définition de `CopyTo` | Cas réel — la classe Stream de .NET (.NET 10, 2025) | https://learn.microsoft.com/en-us/dotnet/api/system.io.stream?view=net-10.0 ; https://devblogs.microsoft.com/dotnet/announcing-dotnet-10/ |
| 7 | `pages/csharp/lecon-07.html#1` | VRAI sur le principe (général), détails non sourcés : message « Timeout expired », « quelques milliers de requêtes », liste StreamReader/HttpClient/DbContext | corrigé : mécanique exacte du pool d'après la doc (100 connexions par défaut, attente de 15 s puis exception, recommandation de fermer par `Close`/`Dispose`/`using`) | Cas réel — le pool de connexions d'ADO.NET (documentation, 2026) | https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/sql-server-connection-pooling |
| 8 | `pages/csharp/lecon-08.html#1` | INEXACT (événement + produit) : « l'exception la plus fréquente en production sur .NET » et « les équipes … constatent une chute nette » non sourcés ; « tant les NullReferenceException ont coûté cher en pannes » non dit par Hoare dans la source | corrigé : citations exactes de Hoare (ALGOL W, 1965, « simplement parce que c'était si facile à implémenter »), C# 8.0 (septembre 2019), modèles .NET 6 | Cas réel — Tony Hoare et la référence nulle (2009) | https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/ ; https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-version-history ; https://learn.microsoft.com/en-us/dotnet/core/compatibility/sdk/6.0/csharp-template-code ; https://learn.microsoft.com/en-us/dotnet/csharp/nullable-references |
| 9 | `pages/csharp/lecon-09.html#1` | INEXACT (événement) : « une quarantaine de secondes **après le décollage** » (après le début de la séquence de vol) ; « l'exception non gérée a arrêté **le calculateur de bord** » (ce sont les **deux centrales inertielles** qui s'arrêtent ; l'ordinateur de bord prend leurs données de diagnostic pour des données de vol) ; « Coût : environ 370 millions de dollars » absent des sources primaires | corrigé (les trois points) | Cas réel — Ariane 5 (1996) | https://www.esa.int/Newsroom/Press_Releases/Ariane_501_-_Presentation_of_Inquiry_Board_report ; https://www-users.cse.umn.edu/~arnold/disasters/ariane5rep.html |
| 10 | `pages/csharp/lecon-10.html#1` | INVÉRIFIABLE (anonyme : « une équipe », adresses e-mail) | remplacé : les chargements de GTA Online (recherche linéaire de doublons, ~1,98 milliard de comparaisons) | Cas réel — le chargement de GTA Online (2021) | https://nee.lv/2021/02/28/How-I-cut-GTA-Online-loading-times-by-70/ |
| 11 | `pages/csharp/lecon-11.html#1` | INVÉRIFIABLE (anonyme : « un tableau de bord d'administration ») | remplacé : la règle CA1851 de .NET 7 (énumérations multiples) | Cas réel — la règle CA1851 de .NET 7 (2022) | https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/quality-rules/ca1851 ; https://devblogs.microsoft.com/dotnet/announcing-dotnet-7/ |
| 12 | `pages/csharp/lecon-12.html#1` | INVÉRIFIABLE (anonyme : « une application de saisie ») ; la mention de CS4014 était juste | remplacé : l'avertissement CS4014 et sa documentation (exceptions perdues en silence) | Cas réel — l'avertissement CS4014 de C# (documentation, 2026) | https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-messages/cs4014 |
| 13 | `pages/csharp/lecon-13.html#1` | INVÉRIFIABLE (anonyme : « une petite équipe », `Program.cs` de 2 400 lignes) | remplacé : le passage d'une équipe Microsoft de 27 000 anciens tests à des tests unitaires dans le circuit des pull requests ; intertitre `<h2>` renommé | Cas réel — Microsoft déplace ses tests « à gauche » (2022) | https://learn.microsoft.com/en-us/devops/develop/shift-left-make-testing-fast-reliable |
| 14 | `pages/csharp/lecon-14.html#1` | INVÉRIFIABLE (anonyme : « un service d'import ») | remplacé : la boucle de l'« IPO Cross » du Nasdaq le jour de l'entrée en Bourse de Facebook (ordonnance de la SEC) | Cas réel — Nasdaq et l'entrée en Bourse de Facebook (2012) | https://www.sec.gov/files/litigation/admin/2013/34-69655.pdf |
| 15 | `pages/csharp/lecon-15.html#1` | INVÉRIFIABLE (anonyme : « une application de bureau », dotMemory) | remplacé : la page officielle de WPF sur les fuites mémoire par abonnement et le motif des événements faibles ; intertitre renommé | Cas réel — le motif des événements faibles de WPF (documentation, 2024) | https://learn.microsoft.com/en-us/dotnet/desktop/wpf/events/weak-event-patterns |
| 16 | `pages/csharp/lecon-16.html#1` | INVÉRIFIABLE (anonyme, déjà jugé ainsi en B2 : 40 %, ~100 non attribués) | remplacé : Bing.com sur .NET Core 2.1 (latence −34 %, vectorisation des chaînes) | Cas réel — Bing passe à .NET Core 2.1 (2018) | https://devblogs.microsoft.com/dotnet/bing-com-runs-on-net-core-2-1/ |
| 17 | `pages/csharp/lecon-17.html#1` | INVÉRIFIABLE (anonyme : back-end mobile qui renvoie toujours 200) | remplacé : RFC 9457 (le code de statut réel est obligatoire) et `Results.Problem()` d'ASP.NET Core ; intertitre renommé | Cas réel — RFC 9457, les erreurs d'API normalisées (2023) | https://www.rfc-editor.org/rfc/rfc9457.html ; https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api |
| 18 | `pages/csharp/lecon-18.html#1` | INVÉRIFIABLE (anonyme : « une équipe », SQLite) | remplacé : la panne de Doppler causée par une migration en avance sur le code ; intertitre renommé | Cas réel — la migration qui a arrêté Doppler (2020) | https://status.doppler.com/incidents/jryntlb30t16 |
| 19 | `pages/csharp/lecon-19.html#1` | INVÉRIFIABLE (anonyme : TVA arrondie, « tous les six mois ») | remplacé : la règle de non-régression de SQLite ; intertitre renommé | Cas réel — les tests de non-régression de SQLite (2023) | https://www.sqlite.org/testing.html |
| 20 | `pages/csharp/lecon-20.html#1` | INVÉRIFIABLE (anonyme, B2 ; la technique était juste) ; « des e-mails "Bonjour null" sont partis » non sourcé | remplacé par le même phénomène, sourcé : `System.Text.Json` (.NET Core 3.0) sensible à la casse par défaut, membres inconnus ignorés, ASP.NET Core déjà réglé ; intertitre renommé | Cas réel — System.Text.Json et la casse (2019) | https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/migrate-from-newtonsoft ; https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/missing-members ; https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/character-casing ; https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-3-0 ; https://devblogs.microsoft.com/dotnet/announcing-net-core-3-0/ |
| 21 | `pages/csharp/lecon-21.html#1` | INVÉRIFIABLE (anonyme : « une soixantaine d'avertissements ») | remplacé : Jon Skeet passe Noda Time au nullable (228 avertissements, deux vrais bugs) ; intertitre renommé | Cas réel — Noda Time essaie le nullable (2018) | https://codeblog.jonskeet.uk/2018/04/21/first-steps-with-nullable-reference-types/ |
| 22 | `pages/csharp/lecon-22.html#1` | INVÉRIFIABLE (anonyme : « une startup ») ; Twelve-Factor App juste | remplacé : la clé d'accès publiée d'Uber (FTC, 2018) + la règle Twelve-Factor gardée et sourcée | Cas réel — la clé d'accès publiée d'Uber (2016) | https://www.ftc.gov/news-events/news/press-releases/2018/04/uber-agrees-expanded-settlement-ftc-related-privacy-security-claims ; https://12factor.net/config |
| 23 | `pages/csharp/lecon-23.html#1` | INVÉRIFIABLE (général : « la quasi-totalité des logiciels .NET réels ») | remplacé : Roslyn, compilateur en couches d'API sans dépendance à Visual Studio | Cas réel — Roslyn, le compilateur C# en bibliothèque (documentation, 2020) | https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/compiler-api-model ; https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/ |

## Décomptes

| | java | csharp | total |
|---|---:|---:|---:|
| « Cas réel » lus | 23 | 23 | **46** |
| état trouvé : VRAI | 0 | 2 (L05 pour WPF, L06) | 2 |
| état trouvé : VRAI sur l'essentiel, détail non sourcé | 1 (L01) | 1 (L07) | 2 |
| état trouvé : INEXACT | 1 (L02) | 4 (L01, L04, L08, L09) | 5 |
| état trouvé : INVÉRIFIABLE (anonyme ou général) | 21 | 16 | **37** |
| état trouvé : INVENTÉ | 0 | 0 | 0 |
| action : vérifié (mis en forme, complété) | 0 | 1 (L06) | 1 |
| action : corrigé | 2 | 6 | 8 |
| action : remplacé par un vrai cas sourcé | 21 | 16 | **37** |
| action : renommé « Scénario » | 0 | 0 | 0 |
| conformes à la règle (`--cas-reel`) avant → après | 0 → 23 | 0 → 23 | 0 → 46 |

Les deux Ariane 5 (java L02, csharp L09) étaient les seuls cas « ancrés » sur un événement : **les
deux étaient inexacts**, comme l'annonçait B2 (37,7 % d'INEXACT chez les cas ancrés). Aucun récit
anonyme n'a été gardé : on ne peut pas rendre vrai un récit qui n'a pas eu lieu.

Intertitres `<h2>Un cas réel : …</h2>` renommés (ils nommaient l'ancienne anecdote) : csharp L13,
L15, L17, L18, L19, L20, L21. Gardés tels quels, car toujours justes : L09 (« l'exception qui a
détruit une fusée »), L10 (« la bonne collection change tout »), L11 (« la requête exécutée deux fois »).

## Contrôles (avant le dernier commit)

| commande | code | verdict |
|---|---:|---|
| `node tools/verif-contenu.js --cas-reel --cours=java` | **0** | 23 lus, 23 conformes (avant : 0 conforme) |
| `node tools/verif-contenu.js --cas-reel --cours=csharp` | **0** | 23 lus, 23 conformes (avant : 0 conforme) |
| `node tools/verif-contenu.js --strict` | **0** | toutes les leçons tiennent le standard |
| `node tools/verif-html.js` | **0** | aucun problème |
| `node tools/verif-domaines-interdits.js` | **0** | aucune référence aux trois domaines |
| `node tools/verif-qcm-lexique.js` | **0** | après report du gain de `csharp` (voir plus bas) ; **1** au premier passage, pour un progrès non figé |
| `node tools/verif-qcm-biais.js` | **0** | aucun cours n'a empiré |
| `node tools/verif.js --rapide` | **1** | 54 étapes jouées, 712 s, 3 signalent — toutes expliquées ci-dessous |

Les trois signalements de `verif.js --rapide` :

- **`donnees`** — l'invariant **I18** : `js/search-index.js` diverge du contenu régénéré (+4 556 octets).
  C'est le rouge attendu : l'orchestrateur régénère l'index après la fusion.
- **`doc-ref`** (`tools/doc/verif-doc.js`, § 6 bis) — `pages/doc/cours.html` annonce « 85 leçons de
  ce site, réparties dans 37 cours » qui renvoient à un document (motifs « documentation officielle »,
  « la spécification », « RFC nnnn »…) ; la mesure en trouve maintenant **93 dans 38 cours** : les
  nouveaux « Cas réel » citent la documentation officielle ou une RFC dans 8 leçons de plus.
- **`doc-rec`** (`tools/doc/verif-recherche.js`) — `pages/doc/lecon-04.html` publie « 11 portent un
  lien vers l'extérieur » ; la mesure en trouve **57** : les 46 lignes de source portent un lien.

Ces deux pages du cours `doc` sont produites par `tools/doc/gen.js` à partir de gabarits (`@@MESURE@@`) :
ce sont des pages dérivées du corpus, que chaque lot du V18 fera bouger. Je ne les ai pas
régénérées ici (sept branches, sept conflits) : à faire une fois, après la fusion.

## Le cliquet lexical, et ce qui a été refigé

Premier passage de `verif-qcm-lexique.js` : **code 1**, non pas pour un recul mais pour un **progrès
non figé** — `csharp`, stratégie STRICTE : 85,7 % → 82,6 % (les nouveaux encadrés ont fait entrer dans
le corps de plusieurs leçons des mots que portaient des options de QCM, par exemple « précision » en
L02 ; comparaison mot à mot par `mesure-lexique-qcm.js --liste=csharp` sur la copie et sur une
extraction de `HEAD`). Le cliquet exige alors de refiger. Je n'ai
pas lancé `--ecrire` tel quel dans le commit : il réécrit tout le fichier (date, et `nodejs`, dont la
mesure avait déjà dérivé **avant** ce lot — vérifié identique sur une extraction de `HEAD`). Seules
les deux valeurs `csharp.stricte` (0,8571 → 0,8261) et `csharp.stricteCouverture` (0,2727 → 0,2987)
ont été reportées dans `tools/qcm-lexique-reference.json`, à partir de la référence complète produite
par `--ecrire` (script `scratchpad/b4-java-csharp/refiger-mes-cours.js`). Les autres dimensions de
`csharp` et de `java` ont bougé de moins de 2 points dans les deux sens : laissées à leur valeur
figée, pour ne pas masquer un léger recul. Aucun QCM n'a été touché. `verif-qcm-biais.js` : 0 dès
le premier passage.

## Doutes, et ce qui reste ouvert

- **java L12** : l'ancien cas illustrait `Optional` (null → `Optional`), notion que le cours traite
  surtout en leçon 19 (qui a maintenant son propre cas, Google Cloud 2025). Le remplaçant illustre la
  notion propre de la leçon 12, les pipelines d'opérateurs et les lambdas (RxJava, Netflix 2013).
  Choix de notion à confirmer à la relecture.
- **Cas tirés d'une documentation officielle** (java L06, L08, L10, L16, L20, L21 ; csharp L04, L05,
  L06, L07, L11, L12, L15, L23, et en partie L17) : ce sont des faits vrais, datés et sourcés sur un
  produit nommé, pas des incidents. La date du titre est alors celle de la version documentée
  (sortie de Java 5, du JDK 21, de .NET 10…) ou, à défaut, la date de mise à jour de la page
  (`ms.date` de Microsoft Learn : 2024, 2026, 2020) — c'est la seule date que la source porte.
- **csharp L04** : le compte « dix-huit » était peut-être juste pour .NET 8, mais la page officielle
  ne filtre pas son tableau par version ; le texte dit donc « 21 surcharges, toutes versions de .NET
  confondues », ce que la page montre.
- **csharp L03** : Langley ne dit pas que les accolades auraient évité le bug (il en doute) ; le texte
  ne lui prête que le regret qu'aucun avertissement du compilateur ne l'ait signalé, et la phrase
  sur les accolades est présentée comme la leçon de C#, pas comme sa conclusion.
- **csharp L22** : le communiqué de la FTC n'a été lu qu'au travers de l'outil web (le site refuse
  `curl`) ; les citations exactes relevées sont celles reproduites plus haut.
- **java L18** : le lien entre le numéro `@bug 8072909` du test d'OpenJDK et le rapport cité par le
  CWI (« TimSort fails with ArrayIndexOutOfBoundsException on worst case long arrays ») n'a pas pu
  être confirmé (`bugs.openjdk.org` refuse la lecture) ; le texte ne l'affirme pas : il dit que le
  dépôt contient depuis 2015 ce test, qui construit le « pire cas » et échoue sur cette exception.
- **Contre-relecture** à faire, comme prévu : confronter chaque affirmation à la source citée.

## Consignes de fusion

- Branche `v18/b4-java-csharp` : 46 pages (`pages/java/lecon-01..23.html`,
  `pages/csharp/lecon-01..23.html`), `tools/qcm-lexique-reference.json` (entrée `csharp`, deux
  valeurs), ce rapport. Rien d'autre.
- `tools/qcm-lexique-reference.json` : si un autre lot a aussi refigé, garder **les deux** côtés
  (chacun ne touche que l'entrée de ses cours) ; si `--ecrire` a été lancé ailleurs sur tout le
  fichier, relancer après fusion `node tools/verif-qcm-lexique.js` et refiger seulement s'il annonce
  des progrès.
- Après fusion : régénérer les index dérivés (I18, `js/search-index.js`) **et les pages du cours
  `doc` produites par `tools/doc/gen.js`** (`pages/doc/cours.html`, `pages/doc/lecon-04.html`) : elles
  publient des comptes du corpus que les lignes de source font bouger (voir « Contrôles »). Les
  régénérer dans chaque branche ferait sept conflits ; après fusion, un seul passage suffit. Puis
  relancer les deux cliquets QCM et `verif.js --rapide`.
