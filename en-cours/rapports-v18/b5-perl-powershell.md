# Rapport V18 — case B5 (lot 2) : les « Cas réel » des cours `perl` et `powershell`

Copie de travail `D:\test-claude-b5-perl-powershell`, branche `v18/b5-perl-powershell`, partie de `1b8d94b`.
Scripts : `scratchpad/b5-perl-powershell/` de la copie (ignoré par git) — `contenu-perl.txt` et
`contenu-ps.txt` (le texte exact de chaque nouvel encadré), `appliquer.js` (remplacement de l'encadré
seul, et de l'intertitre déclaré, avec preuve que tout octet hors d'eux est identique), `preuve.js`
(même preuve contre `1b8d94b`, page par page), `motsqcm.js` (mots d'options de QCM à garder ou à ne
pas ajouter, avant d'écrire), `dump.js` (lecture des cas), et les essais (`ps-test/`, `*.pl`, `preg.php`).

## 1. Bilan

| cours | « Cas réel » | trouvés VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié tel quel | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `perl` | 17 | 0 | 0 | 17 | 0 | 0 | 0 | 17 | 0 |
| `powershell` | 17 | 0 | 0 | 17 | 0 | 0 | 0 | 17 | 0 |
| **total** | **34** | **0** | **0** | **34** | **0** | **0** | **0** | **34** | **0** |

Aucun des 34 cas d'origine ne nommait un sujet réel : tous étaient des récits anonymes (« un·e
administrateur·rice », « un script de facturation », « une équipe », « un exploitant ») ou des usages
généraux (« le hachage est l'outil idéal pour compter »). Leur technique était le plus souvent juste
(B2 l'avait vérifié pour `perl/lecon-07`, `perl/lecon-16#1`, `powershell/lecon-02` et `-13`), mais
aucun ne pouvait être sourcé : tous sont **remplacés** par un vrai cas, daté et sourcé, **sur la notion
de leur leçon**. Chaque affirmation a été confrontée à une source **ouverte** (WebFetch, `curl`,
`gh api`, ou PDF lu avec `pypdf`) ; chaque comportement technique a été **essayé** (Perl 5.42,
Windows PowerShell 5.1, PHP 8.4 en WebAssembly) — ce qui relève de PowerShell 7 est pris à sa
documentation. Les sujets sont réservés dans `D:\test-claude\scratchpad\v18-parallele\b5-reservations.txt`
(34 lignes), et aucun n'est raconté ailleurs sur le site (`grep` des noms et des URL dans `pages/`,
`doublons.js` inchangé).

**Les encadrés à code.** 14 des 17 encadrés PowerShell portaient un bloc de code, et les intertitres
de quatre leçons (« Un script complet, de bout en bout », « Une fonction avancée au complet »…)
annoncent ce code. Quand il servait encore la notion, il est **gardé à l'identique** (leçons 01, 05,
06, 07, 08, 10, 12, 15, 16, 17), et le cas réel l'introduit ; sinon il est remplacé par le code du
cas, essayé (02, 03, 04, 11, 13, 14). Le script de la leçon 09 reçoit `-Encoding UTF8` : sans lui,
`Set-Content` écrit en ANSI sous 5.1 et casse les accents (essayé) — c'est le sujet du nouveau cas.

**Les intertitres collés.** Sept intertitres « Un cas réel — … » annonçaient l'ancien récit ; ils suivent
le nouveau (`powershell/lecon-09`, `-11` à `-17`). Celui de la leçon 10, « la boîte à outils d'une
équipe », dit encore le cas (dbatools) et reste.

## 2. Cas par cas — `perl`

Nature : *général* (usage général présenté comme un cas), *anonyme* (récit sans sujet identifiable).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/perl/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« un·e administrateur·rice… access.log de 2 Go ») | remplacé par : `use v5.36` active strict (via `use VERSION` ≥ 5.12) et warnings (≥ 5.35) | Cas réel — Perl 5.36 et la ligne `use v5.36` (2022) | https://perldoc.perl.org/perl5360delta ; https://perldoc.perl.org/perlhist ; https://perldoc.perl.org/functions/use ; https://perldoc.perl.org/feature (essai Perl 5.42 : `Global symbol…`, `Argument "a" isn't numeric`) |
| `pages/perl/lecon-02.html#1` | INVÉRIFIABLE, général (compter avec un hachage) | remplacé par : la graine aléatoire des hachages de Perl 5.18 | Cas réel — Perl 5.18 rend aléatoire le parcours des hachages (2013) | https://perldoc.perl.org/perl5180delta ; https://perldoc.perl.org/perlhist ; (contrôle : https://perldoc.perl.org/perl581delta) ; essai : trois lancements, trois ordres |
| `pages/perl/lecon-03.html#1` | INVÉRIFIABLE, général (filtre `print if /ERROR/`) | remplacé par : Bugzilla, CVE-2014-1572, `$cgi->param` en contexte de liste dans un hachage | Cas réel — Bugzilla et le contexte de liste (CVE-2014-1572, 2014) | https://www.bugzilla.org/security/4.0.14/ ; https://bugzilla.mozilla.org/show_bug.cgi?id=1074812 (et l'API REST du ticket : commentaires, correctif joint n° 8497591) ; https://metacpan.org/pod/CGI ; essai Perl 5.42 de l'expansion dans un hachage |
| `pages/perl/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« Une regex… ») | remplacé par : PCRE de Philip Hazel | Cas réel — PCRE, les regex de Perl hors de Perl (1997) | https://www.pcre.org/ ; essai : le même motif dans `preg_match` de PHP 8.4 (WebAssembly, PCRE 10.44) |
| `pages/perl/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« un fichier client exporté d'un vieux logiciel ») | remplacé par : le drapeau `/r` de Perl 5.14 et le retour de `s///` | Cas réel — Perl 5.14 et le drapeau `/r` (2011) | https://perldoc.perl.org/perl5140delta ; https://perldoc.perl.org/perlhist ; https://perldoc.perl.org/perlop ; essais Perl 5.42 (`1` contre `2026-07-26`, `map … /gr`) |
| `pages/perl/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« un serveur web… 2 Go ») | remplacé par : le double losange `<<>>` de Perl 5.22 contre l'`open` à deux arguments de `<>` | Cas réel — Perl 5.22 et le double losange `<<>>` (2015) | https://perldoc.perl.org/perl5220delta ; https://perldoc.perl.org/perlop ; https://perldoc.perl.org/perlhist ; essai avec `'echo bonjour|'` |
| `pages/perl/lecon-07.html#1` | INVÉRIFIABLE, anonyme (déjà en B2 : la TVA « à quinze endroits ») | remplacé par : `my $x if 0`, fausse variable qui retient sa valeur, fatale en 5.30 | Cas réel — `my $x if 0`, refusé par Perl 5.30 (2019) | https://perldoc.perl.org/perldeprecation ; https://perldoc.perl.org/perlhist ; essais Perl 5.42 (erreur fatale, `state`, fermeture) |
| `pages/perl/lecon-08.html#1` | INVÉRIFIABLE, général (index inversé) | remplacé par : l'« autoderef » expérimental de 5.14, retiré en 5.24 | Cas réel — l'« autoderef » de Perl, essayé puis retiré (2011-2016) | https://perldoc.perl.org/perl5140delta ; https://perldoc.perl.org/perl5240delta ; https://perldoc.perl.org/perlhist ; essai (`Experimental push on scalar is now forbidden`) |
| `pages/perl/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« un script d'astreinte ») | remplacé par : HTTP::Tiny ne vérifiait pas les certificats TLS (CVE-2023-31486) | Cas réel — HTTP::Tiny ne vérifiait pas les certificats (CVE-2023-31486, 2023) | https://blog.hackeriet.no/perl-http-tiny-insecure-tls-default-affects-cpan-modules/ ; https://cveawg.mitre.org/api/cve/CVE-2023-31486 ; https://raw.githubusercontent.com/chansen/p5-http-tiny/master/Changes ; https://perldoc.perl.org/perl5380delta ; https://perldoc.perl.org/perlhist (la NVD répondait 503 ; la fiche MITRE est citée) |
| `pages/perl/lecon-10.html#1` | INVÉRIFIABLE, général (DBI « l'un des plus utilisés ») | remplacé par : l'opérateur `isa` de Perl 5.32 | Cas réel — Perl 5.32 ajoute l'opérateur `isa` (2020) | https://perldoc.perl.org/perl5320delta ; https://perldoc.perl.org/perlop ; https://perldoc.perl.org/perlhist ; essais Perl 5.42 (`ref`, méthode `isa` sur référence non bénie, opérateur `isa`). Écarté : la syntaxe `class` de 5.38, déjà dans le corps de la leçon |
| `pages/perl/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« un collègue t'envoie… ») | remplacé par : `perl -i` rendu plus sûr par Perl 5.28 | Cas réel — Perl 5.28 rend `perl -i` plus sûr (2018) | https://perldoc.perl.org/perl5280delta ; https://perldoc.perl.org/perlhist ; essai du one-liner sous 5.42 |
| `pages/perl/lecon-12.html#1` | INVÉRIFIABLE, général (log Apache) | remplacé par : les captures nommées de Perl 5.10 | Cas réel — Perl 5.10 nomme les captures (2007) | https://perldoc.perl.org/perl5100delta ; https://perldoc.perl.org/perlhist ; essai du motif sur la ligne de journal |
| `pages/perl/lecon-13.html#1` | INVÉRIFIABLE, anonyme (« un service marketing ») | remplacé par : Lincoln Stein, le format d'échange CAF du projet génome humain | Cas réel — Perl et le projet génome humain (1996) | https://bioperl.org/articles/How_Perl_saved_human_genome.html (reproduction BioPerl, qui date l'article du numéro de septembre 1996 de *The Perl Journal* ; l'encadré dit seulement « en 1996 »). ⚠️ page au mojibake volontaire : octets hors de l'encadré identiques (prouvé par `appliquer.js` et `preuve.js` ; compte de « Ã » inchangé) |
| `pages/perl/lecon-14.html#1` | INVÉRIFIABLE, général (« beaucoup d'entreprises ») | remplacé par : « The Perl Jam » (31C3) et `DBI->quote` contourné par un `param` en liste | Cas réel — « The Perl Jam » et `DBI->quote` (31C3, 2014) | https://fahrplan.events.ccc.de/congress/2014/Fahrplan/events/6243.html ; https://fahrplan.events.ccc.de/congress/2014/Fahrplan/system/attachments/2542/original/the-perl-jam-netanel-rubin-31c3.pdf (lu avec `pypdf`, diapositives 15-16) ; https://metacpan.org/pod/DBI (méthode `quote`) ; https://api.media.ccc.de/public/events/search?q=perl%20jam (contrôle de la date) |
| `pages/perl/lecon-15.html#1` | INVÉRIFIABLE, anonyme (« un script d'import… 200 000 lignes ») | remplacé par : Try::Tiny (2009) et le `$@` effacé, corrigé dans Perl 5.14 | Cas réel — Try::Tiny et la fragilité de `$@` (2009-2011) | https://metacpan.org/pod/Try::Tiny ; https://perldoc.perl.org/perl5140delta |
| `pages/perl/lecon-16.html#1` | INVÉRIFIABLE, général (déjà en B2 : lecture ligne à ligne) | remplacé par : Wide Finder et Wide Finder 2 de Tim Bray | Cas réel — Wide Finder, des journaux plus gros que la mémoire (Tim Bray, 2007-2008) | https://www.tbray.org/ongoing/When/200x/2007/09/20/Wide-Finder ; https://www.tbray.org/ongoing/When/200x/2008/05/01/Wide-Finder-2 |
| `pages/perl/lecon-16.html#2` | INVÉRIFIABLE, anonyme (« sur un vrai serveur » ; « beaucoup d'outils d'observabilité ont commencé… ») | remplacé par : MRTG, script Perl de Tobias Oetiker | Cas réel — MRTG, un script Perl devenu outil de surveillance (1995) | https://oss.oetiker.ch/mrtg/doc/mrtg.en.html (section HISTORY) |

## 3. Cas par cas — `powershell`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/powershell/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« un administrateur ») | remplacé par : le « Monad Manifesto » (objets .NET contre « prayer-based parsing ») ; code gardé | Cas réel — le « Monad Manifesto » de Jeffrey Snover (2002) | https://www.jsnover.com/Docs/MonadManifesto.pdf (lu avec `pypdf`, §§ 4.2 et 6.1, note 7) ; code essayé sous 5.1 |
| `pages/powershell/lecon-02.html#1` | INVÉRIFIABLE, général (déjà en B2, technique juste) | remplacé par : règle PSScriptAnalyzer `PossibleIncorrectUsageOfRedirectionOperator` (1.17.0) ; code adapté | Cas réel — PSScriptAnalyzer et le `>` dans un `if` (2018) | https://learn.microsoft.com/en-us/powershell/utility-modules/psscriptanalyzer/rules/possibleincorrectusageofredirectionoperator ; https://raw.githubusercontent.com/PowerShell/PSScriptAnalyzer/master/CHANGELOG.MD ; essai 5.1 (`if ($libre > $seuil)` écrit 12 dans un fichier « 20 », aucune alerte) |
| `pages/powershell/lecon-03.html#1` | INVÉRIFIABLE, général | remplacé par : `Select-Object -First` arrête la commande amont (PowerShell 3.0), piège de `Rename-Item … -PassThru` ; code du cas | Cas réel — `Select-Object -First` arrête le pipeline (PowerShell 3.0, 2012) | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-object?view=powershell-5.1 ; https://devblogs.microsoft.com/powershell/windows-management-framework-3-0-available-for-download/ ; essai 5.1 sur huit `.log` (3 renommés sans `-Wait`, 8 avec) |
| `pages/powershell/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« un script doit joindre un serveur ») | remplacé par : `break` dans `ForEach-Object` (section dédiée d'`about_Break`) ; code du cas | Cas réel — `break` dans `ForEach-Object`, l'avertissement de Microsoft (doc. 2026) | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_break?view=powershell-5.1 ; essais 5.1 (script coupé, `foreach` intact, boucle de l'appelant quittée) |
| `pages/powershell/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« une administratrice ») | remplacé par : l'exemple 7 d'`Export-Csv` (Format-Table avant Export-Csv) et la ligne `#TYPE` ; code gardé | Cas réel — `Format-Table` avant `Export-Csv`, l'exemple 7 de Microsoft (doc. 2025) | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/export-csv?view=powershell-5.1 ; (contrôle : version 7.5 de la même page) ; essais 5.1 (`ClassId2e4f51ef…`, ligne `#TYPE`, script des services) |
| `pages/powershell/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« un exploitant ») | remplacé par : règle `UseProcessBlockForPipelineCommand` (PSScriptAnalyzer 1.19.0) ; code gardé | Cas réel — la règle `UseProcessBlockForPipelineCommand` de PSScriptAnalyzer (2020) | https://learn.microsoft.com/en-us/powershell/utility-modules/psscriptanalyzer/rules/useprocessblockforpipelinecommand ; https://github.com/PowerShell/PSScriptAnalyzer/releases/tag/1.19.0 (date confirmée par `gh api`) ; essais 5.1 (`Get-Number` → 3 seul ; `Test-Serveur` → 2/3) |
| `pages/powershell/lecon-07.html#1` | INVÉRIFIABLE, anonyme | remplacé par : le `+=` sur un tableau mesuré par Microsoft ; code gardé (il suit déjà la méthode la plus rapide) | Cas réel — le `+=` sur un tableau, mesuré par Microsoft (doc. 2026) | https://learn.microsoft.com/en-us/powershell/scripting/dev-cross-plat/performance/script-authoring-considerations |
| `pages/powershell/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« un script copie chaque soir ») | remplacé par : l'article de Kevin Marquette sur les exceptions, repris par Microsoft ; code gardé | Cas réel — Kevin Marquette et les erreurs non terminantes (2017) | https://powershellexplained.com/2017-04-10-Powershell-exceptions-everything-you-ever-wanted-to-know/ ; https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-exceptions ; essai 5.1 (avec et sans `-ErrorAction Stop`) |
| `pages/powershell/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« un logiciel RH ») | remplacé par : les encodages incohérents de Windows PowerShell 5.1 ; code corrigé (`-Encoding UTF8`) ; intertitre « nettoyer un export mensuel » → « l'encodage d'un export » | Cas réel — les encodages de Windows PowerShell 5.1 (doc. Microsoft, 2021) | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding?view=powershell-5.1 ; essai 5.1 (octet `E9` seul sans `-Encoding`, BOM + UTF-8 avec) |
| `pages/powershell/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« une équipe d'administration ») | remplacé par : dbatools, module communautaire sur la PowerShell Gallery ; code gardé ; intertitre gardé | Cas réel — dbatools, une boîte à outils devenue module public (2015) | https://github.com/dataplat/dbatools ; https://api.github.com/repos/dataplat/dbatools (date de création, par `gh api`) ; https://www.powershellgallery.com/packages/dbatools |
| `pages/powershell/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« un administrateur… 60 serveurs ») | remplacé par : le billet de Paul Higinbotham sur `ForEach-Object -Parallel` et ses mesures ; code du billet ; intertitre « l'inventaire d'un parc » → « paralléliser, ou pas » | Cas réel — `ForEach-Object -Parallel`, plus lent qu'on ne croit (blog PowerShell, 2019) | https://devblogs.microsoft.com/powershell/powershell-foreach-object-parallel-feature/ (PowerShell 7 : pris à la source, non essayé) |
| `pages/powershell/lecon-12.html#1` | INVÉRIFIABLE, anonyme (« une équipe versionne… ») | remplacé par : la syntaxe `Should -Be` de Pester 4 contre le Pester 3.4.0 livré avec Windows ; code gardé ; intertitre → « la version de Pester » | Cas réel — `Should -Be` et le Pester 3.4.0 de Windows (2017) | https://pester.dev/docs/introduction/installation ; https://pester.dev/docs/migrations/v3-to-v4 ; https://raw.githubusercontent.com/pester/Pester/4.10.1/CHANGELOG.md ; essai 5.1 sur ce poste (Pester 3.4.0 : `'-Be' is not a valid Should operator` ; `Should Be 20` passe) |
| `pages/powershell/lecon-13.html#1` | INVÉRIFIABLE, général (déjà en B2, technique juste) | remplacé par : les commandes de Microsoft pour fouiller les journaux d'Exchange après HAFNIUM ; code du billet ; intertitre → « fouiller les journaux d'Exchange » | Cas réel — fouiller les journaux d'Exchange après HAFNIUM (Microsoft, 2021) | https://www.microsoft.com/en-us/security/blog/2021/03/02/hafnium-targeting-exchange-servers/ (commande exacte relevée dans la page) |
| `pages/powershell/lecon-14.html#1` | INVÉRIFIABLE, anonyme (« une équipe veut être prévenue ») | remplacé par : KB5074596, `Invoke-WebRequest` demande confirmation (CVE-2025-54100) ; code du cas ; intertitre → « l'avertissement d'Invoke-WebRequest » | Cas réel — `Invoke-WebRequest` demande confirmation (KB5074596, 2025) | https://support.microsoft.com/topic/7cb95559-655e-43fd-a8bd-ceef2406b705 ; essais 5.1 non interactifs (sans option : « pas en mode interactif » ; avec `-UseBasicParsing` ou `$PSDefaultParameterValues` : 200 ; `Invoke-RestMethod` sans invite) |
| `pages/powershell/lecon-15.html#1` | INVÉRIFIABLE, anonyme (« un script de supervision ») | remplacé par : une méthode de classe ne sort que par `return` ; code gardé ; intertitre → « return, seule sortie d'une méthode » | Cas réel — une méthode de classe ne sort que par `return` (doc. Microsoft, 2023) | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_methods?view=powershell-5.1 ; https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes?view=powershell-5.1 ; essais 5.1 (`MethodHasCodePathNotReturn`, méthode `[void]` muette, classe `Serveur`) |
| `pages/powershell/lecon-16.html#1` | INVÉRIFIABLE, anonyme (« une équipe déploie ») | remplacé par : MS14-025, les mots de passe des préférences de stratégie de groupe dans SYSVOL ; code gardé ; intertitre → « les mots de passe de SYSVOL » | Cas réel — les mots de passe des préférences de stratégie de groupe (MS14-025, 2014) | https://learn.microsoft.com/en-us/security-updates/securitybulletins/2014/ms14-025 ; https://support.microsoft.com/kb/2962486 |
| `pages/powershell/lecon-17.html#1` | INVÉRIFIABLE, anonyme (« une tâche planifiée… l'équipe ») | remplacé par : le rapport HTML de `HealthChecker.ps1` (CSS-Exchange) ; code et paragraphe sur `ConvertTo-Html` gardés ; intertitre → « le rapport HTML d'un parc Exchange » | Cas réel — le rapport HTML de l'Exchange Health Checker (Microsoft, 2025) | https://microsoft.github.io/CSS-Exchange/Diagnostics/HealthChecker/ ; essai 5.1 du paragraphe gardé (`ConvertTo-Html` sans paramètre de profondeur, `@{Lettre=…}` et `System.Object[]`) |

## 4. Où j'ai douté, et ce qui reste ouvert

- **Un même chercheur, deux leçons** : `perl/lecon-03` (le ticket Bugzilla de Netanel Rubin) et
  `perl/lecon-14` (sa conférence « The Perl Jam », la partie `DBI->quote`) sont deux cas distincts
  — une faille réelle corrigée, une démonstration publique — sourcés par des documents distincts.
  `perl/lecon-14` est une **démonstration**, pas un incident : la diapositive montre le motif et le code
  de `quote` ; que la seconde valeur devienne l'argument `$type` se lit dans la signature montrée
  (`my ($self, $str, $type) = @_`), la diapositive ne l'écrit pas en toutes lettres.
- **Cas tirés d'une documentation** (comme au lot 1, « doc. 2026 ») : `powershell/lecon-04`, `-05`, `-07`,
  `-09`, `-15`. Ce sont des faits documentés et vérifiés à l'essai, pas des événements.
- **Chiffres qui bougent** : le nombre de téléchargements de dbatools (« plus de 9 millions en novembre
  2026 ») et sa dernière version (2.9.1) sont datés dans l'encadré.
- **Hors encadré, à reprendre par l'orchestrateur** (je n'ai touché qu'aux encadrés et à leurs
  intertitres) :
  - `powershell/lecon-12` enseigne `Should -Be` sans dire que le Pester 3.4.0 livré avec Windows le
    refuse (le corps, l'antisèche et l'exercice 2) ; le nouvel encadré le signale.
  - `powershell/lecon-14` montre `$r = Invoke-WebRequest "https://example.com"` : sur un Windows
    PowerShell 5.1 à jour (après le 9 décembre 2025), cette ligne demande confirmation, et échoue en
    mode non interactif ; le nouvel encadré le signale.
- **Index dérivés** (`js/search-index.js`, `pages/etude-recherche.html`…) non régénérés : les
  intertitres changés y sont encore sous leur ancien texte ; l'orchestrateur les régénère après fusion.

## 5. Contrôles (code de sortie)

Après le dernier changement, dans la copie :

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=perl` | 0 (17/17 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=powershell` | 0 (17/17 conformes) |
| `node tools/verif-contenu.js --strict` | 0 |
| `node tools/verif-html.js` | 0 |
| `node tools/verif-domaines-interdits.js` | 0 |
| `node tools/verif-qcm-lexique.js` | 0 |
| `node tools/verif-qcm-biais.js` | 0 |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b5-perl-powershell 1b8d94b` | 0 écart (33 pages) |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées, les deux légitimes connues ; aucune des nôtres |
| `preuve.js` (octets hors encadrés et intertitres identiques à `1b8d94b`, 0 CR) | 0 (33 pages) |
| `node tools/verif.js --rapide` | 1 (54 étapes, 325,8 s) : 5 rouges, tous expliqués ci-dessous |

## 6. Les rouges de `verif.js --rapide`, un par un

- **`donnees`** — invariant I18 seulement (« 1 index publié divergent du contenu regénéré ») : index
  de recherche périmé par les nouveaux textes. **Toléré** ; l'orchestrateur régénère après fusion.
- **`doc-ref`** (`verif-doc`, 2 échecs sur 41 : « nombre de leçons qui renvoient à un document » et
  « nombre de cours concernés » de la page de cours `doc`) et **`doc-rec`** (`verif-recherche` :
  « 385 citent la source » introuvable dans la page) : chiffres du cours `doc` mesurés sur tout le site,
  que nos 34 lignes de source font bouger. **Tolérés**, lignes de source non déformées.
- **`etudes`** et **`etude-6`** (`verif-etudes.js`, `preuves/etude-inconnu.js`) : **non listés dans la
  consigne, expliqués ici.** La page dérivée `pages/etude-inconnu.html` publie une mesure de tout le
  site — les blocs de code d'au moins 5 lignes non vides, par langage. Trois encadrés PowerShell dont
  le code suit désormais le cas ont un bloc plus court (`powershell/lecon-04` : la boucle `do … until`
  de 6 lignes → l'exemple `break` de 2 lignes ; `-13` : la chaîne `Select-String … | Group-Object` de
  6 lignes → la commande d'une ligne du billet HAFNIUM ; `-14` : l'appel GitHub de 8 lignes → 3 lignes) :
  powershell 82 → 79 blocs, total 10 632 → 10 629, corpus 6 563,7 → 6 563,5 Ko. Rien de faux dans la
  page d'étude : elle est périmée. Remède (orchestrateur, après fusion) : relancer l'assembleur de
  `etude-inconnu` sans `--verifier`, comme les autres pages dérivées.

## 7. Consignes de fusion

- Branche `v18/b5-perl-powershell`, trois commits sur `1b8d94b` : perl, powershell, puis ce rapport avec deux retouches de formulation relevées à la relecture (`perl/lecon-03` : « le premier correctif, joint au ticket » — la CVE a ensuite été rattachée au correctif plus large du ticket 1075578 ; `perl/lecon-09` : « le blog Hackeriet »).
- Seuls changent les 34 encadrés « Cas réel » de `pages/perl/` et `pages/powershell/` et sept
  intertitres `<h2>Un cas réel — …</h2>` collés au-dessus (powershell 09, 11 à 17) ; `preuve.js` le
  montre octet par octet contre `1b8d94b`. Mojibake de `perl/lecon-13` intact.
- Après fusion : régénérer les index dérivés (`build-index.js --write --fresh`, I18), la page
  `etude-inconnu.html` (assembleur de l'étude) et les chiffres du cours `doc` ; rejouer `doublons.js`
  avec les autres branches du lot 2 (nos 34 sujets sont réservés dans
  `D:\test-claude\scratchpad\v18-parallele\b5-reservations.txt`).
- À ajouter au registre des foyers, si l'orchestrateur le juge utile : Bugzilla CVE-2014-1572 et
  « The Perl Jam » (`perl/lecon-03`, `-14`), PCRE (`perl/lecon-04`), Monad Manifesto
  (`powershell/lecon-01`), HAFNIUM / Exchange 2021 (`powershell/lecon-13`), MS14-025
  (`powershell/lecon-16`), KB5074596 (`powershell/lecon-14`).
