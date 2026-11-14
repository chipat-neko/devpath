# Rapport V18 — case B6 (lot 3) : les « Cas réel » des cours `cpp` et `vb`

Copie de travail `D:\test-claude-b6-cpp-vb`, branche `v18/b6-cpp-vb`, partie de `1b45660`.
Scripts dans `scratchpad/b6-cpp-vb/` de la copie (ignoré par git) : `dump.js` (lecture des cas),
`motsqcm.js` (mots d'options de QCM à garder ou à ne pas ajouter, avant d'écrire),
`contenu-cpp.txt` et `contenu-vb.txt` (le texte exact de chaque nouvel encadré, `{{FIG0}}` = le bloc de
code d'origine gardé à l'octet), `appliquer.js` (remplacement de l'encadré seul et de l'intertitre
déclaré, preuve que tout octet hors d'eux est identique), `retouches1.js` (retouches de relecture),
`preuve.js` (même preuve contre `1b45660`, page par page), `gb.js` (compile et exécute un fichier C++
sur Compiler Explorer), les essais `t-*.cpp` et le projet `vbtest/` (.NET 10, VB). Scripts repris du
lot 2 (`b5-perl-powershell`), adaptés.

## 1. Bilan

| cours | « Cas réel » | trouvés VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié tel quel | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `cpp` | 23 | 1 | 6 | 16 | 0 | 0 | 6 | 17 | 0 |
| `vb` | 14 | 0 | 0 | 14 | 0 | 0 | 0 | 14 | 0 |
| **total** | **37** | **1** | **6** | **30** | **0** | **0** | **6** | **31** | **0** |

Le seul VRAI (`cpp/lecon-01`, vérifié en B2) est une liste générale de logiciels écrits en C++, sans
date ni source unique : il est remplacé par un cas daté de la même famille (V8, 2008). Parmi les
INVÉRIFIABLE de `cpp`, `cpp/lecon-18` racontait SQLite, sujet gardé par `csharp/lecon-19` (registre
des foyers) : remplacé sans revérifier ses chiffres. Les 14 cas `vb` étaient tous des récits anonymes
ou des usages généraux (« un comptable », « un développeur », « une macro de facturation »,
« un magasin », « beaucoup de petites structures ») : tous remplacés.

Chaque affirmation a été confrontée à une source **ouverte** (WebFetch, `curl`, `gh api`, PDF lu avec
`pypdf`) ; chaque comportement technique a été **essayé** : C++ sur Compiler Explorer (GCC 15.1 avec
libstdc++, Clang 18 avec libc++), VB sous .NET 10 SDK (10.0.403). Les 37 sujets sont réservés dans
`D:\test-claude\scratchpad\v18-parallele\b6-reservations.txt` (37 lignes `cpp/` et `vb/`), aucun n'est
au registre `foyers.md`, et leurs noms et URL ne sont racontés nulle part ailleurs dans `pages/`
(`grep` des numéros de propositions, des noms d'auteurs et des URL). Deux sujets écartés en cours de
route parce qu'un autre agent du lot les a pris ou allait les prendre : la course de `remove_all`
(CVE-2022-21658, prise par `rust/lecon-19`) et Public Health England (prise par `data-eng/lecon-01`).

**Les intertitres collés.** Huit intertitres `<h2>Cas réel&nbsp;: …</h2>` annonçaient l'ancien récit
(`vb/lecon-07` à `-14`) : ils suivent le nouveau cas. Celui de `vb/lecon-06` (« dédoublonner une
liste ») le dit encore et reste. Celui de `cpp/lecon-23` (« du, tree et compagnie ») introduit un
paragraphe général sur ces outils, hors encadré, que le nouveau cas (QDirStat) illustre : gardé.

**Le code des encadrés.** Huit encadrés `vb` portaient un bloc de code qui sert encore la notion
(04, 05, 06, 07, 08, 10, 11, 12) : il est gardé à l'octet, et le cas réel l'introduit. Celui de
`vb/lecon-03` (une remise de facturation fictive) disparaît au profit de l'exemple `AndAlso` de la
documentation, cité en ligne.

## 2. Cas par cas — `cpp`

Nature : *événement*, *produit* (produit nommé), *anonyme* (récit sans sujet identifiable),
*général* (usage général présenté comme un cas).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/cpp/lecon-01.html#1` | VRAI (B2), général : liste de logiciels en C++ (V8, Blink, Firefox, Unreal, MySQL…), ni date ni source | remplacé par : V8 publié en logiciel libre le jour du lancement de Chrome | Cas réel — V8, le moteur JavaScript de Chrome (2008) | https://v8.dev/blog/10-years ; https://v8.dev/ |
| `pages/cpp/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« un logiciel de traitement d'images ») | remplacé par : « Be careful when using std::string », 25 000 allocations par frappe | Cas réel — Chrome et ses 25 000 allocations par frappe (2014) | https://groups.google.com/a/chromium.org/g/chromium-dev/c/EUqoIz2iFU4/m/kPZ5ZK0K3gEJ |
| `pages/cpp/lecon-03.html#1` | INVÉRIFIABLE, général (la surcharge de `<<` dans les flux) | remplacé par : N2431, `f(0)` choisit `f(int)` | Cas réel — `nullptr` et la surcharge `f(int)` / `f(char*)` (2007) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2007/n2431.pdf (pypdf) ; https://en.cppreference.com/w/cpp/language/nullptr ; essai GCC 15.1 `-std=c++11` |
| `pages/cpp/lecon-04.html#1` | INVÉRIFIABLE, général (l'encapsulation de `std::vector`) | remplacé par : C++ Core Guidelines, règle C.2 | Cas réel — les C++ Core Guidelines et la règle C.2 (2015) | https://isocpp.org/blog/2015/09/bjarne-stroustrup-announces-cpp-core-guidelines ; https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines (et sa source https://raw.githubusercontent.com/isocpp/CppCoreGuidelines/master/CppCoreGuidelines.md, règle C.2) |
| `pages/cpp/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« un service réseau… too many open files ») | remplacé par : P0052R10, `unique_resource` | Cas réel — `unique_resource`, le RAII pour tout descripteur (2019) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p0052r10.pdf (pypdf) |
| `pages/cpp/lecon-06.html#1` | INEXACT (B2), produit : Qt ne range pas ses widgets dans un `std::vector` ; « toutes les bibliothèques d'interface » invérifiable | corrigé : `QWidget` base de tous les objets d'interface, `QAbstractButton` abstraite (`paintEvent` virtuelle pure), `~QObject` virtuel qui supprime les enfants par `delete` sur `QObject*` ; daté par Qt 6.12 | Cas réel — les widgets de Qt 6.12 (2026) | https://doc.qt.io/qt-6/qwidget.html ; https://doc.qt.io/qt-6/qabstractbutton.html ; https://doc.qt.io/qt-6/qobject.html ; https://doc.qt.io/qt-6/objecttrees.html ; https://github.com/qt/qtbase/blob/dev/src/corelib/kernel/qobject.cpp (`deleteChildren`) ; qwidget.h (`class QWidget : public QObject, public QPaintDevice`) ; https://qt.io/blog/qt-6.12-released |
| `pages/cpp/lecon-07.html#1` | INVÉRIFIABLE, produit / général (Eigen, `std::complex`, `std::chrono`) | remplacé par : P0515 et l'opérateur `<=>`, puis P1185 | Cas réel — l'opérateur `<=>` de Herb Sutter (2017) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2017/p0515r0.pdf (pypdf) ; https://herbsutter.com/2017/11/11/trip-report-fall-iso-c-standards-meeting-albuquerque/ ; https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1185r2.html ; https://herbsutter.com/2019/02/23/trip-report-winter-iso-c-standards-meeting-kona/ ; essais GCC 15.1 (`<=>` par défaut : six comparaisons ; écrit à la main : pas de `==`) |
| `pages/cpp/lecon-08.html#1` | INVÉRIFIABLE, général (le déplacement accélère « d'innombrables programmes ») | remplacé par : N2983, `move_if_noexcept` | Cas réel — `vector` ne déplace que si c'est `noexcept` (2009) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2009/n2983.html ; https://en.cppreference.com/w/cpp/utility/move_if_noexcept ; essais GCC 15.1 et Clang 18 libc++ (1 023 copies contre 1 023 déplacements) |
| `pages/cpp/lecon-09.html#1` | INVÉRIFIABLE, général (« des centaines de lignes » d'erreurs) | remplacé par : N3580 « Concepts Lite », concepts dans C++20 | Cas réel — les concepts et l'erreur de `sort` sur une `list` (2013) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3580.pdf (pypdf) ; https://herbsutter.com/2017/07/15/trip-report-summer-iso-c-standards-meeting-toronto/ ; essais GCC 15.1 (`std::sort` contre `std::ranges::sort`) |
| `pages/cpp/lecon-10.html#1` | INEXACT, produit/personne : « parfois d'un facteur dix » et « des milliers d'éléments » absents de la source ; « a popularisé un test » | corrigé : l'expérience de l'article de 2012 (N « bien supérieurs à 500 000 », 4 contre 12 octets, liste à nœuds préalloués) | Cas réel — Stroustrup oppose `vector` et `list` (2012) | https://www.stroustrup.com/Software-for-infrastructure.pdf (pypdf) |
| `pages/cpp/lecon-11.html#1` | INEXACT, événement : « architecte » (Principal Scientist), « panneau de calques » (`PanelBar::RepositionExpandedPanels`), « un seul `std::rotate` » (find_if puis lower_bound, et deux rotate) ; « devenu célèbre » retiré | corrigé | Cas réel — Sean Parent et « No raw loops » (2013) | https://sean-parent.stlab.cc/presentations/2013-09-11-cpp-seasoning/cpp-seasoning.pdf (pypdf, diapositives 4-5, 26-29, 69-82) ; https://sean-parent.stlab.cc/papers-and-presentations/ ; https://learn.microsoft.com/en-us/shows/goingnative-2013/cpp-seasoning |
| `pages/cpp/lecon-12.html#1` | INVÉRIFIABLE, général (« d'innombrables bases de code ») | remplacé par : N1450, `weak_ptr` contre les cycles | Cas réel — `weak_ptr` pour casser les cycles (2003) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2003/n1450.html ; https://en.cppreference.com/w/cpp/memory/weak_ptr ; essai GCC 15.1 (cycle : compteur 2 puis 1, aucun destructeur ; `weak_ptr` : 1, deux destructeurs) |
| `pages/cpp/lecon-13.html#1` | INEXACT, produit : « ancêtre direct de `std::expected` » non sourcé ; « en mode debug » approximatif (contrôle sous `LLVM_ENABLE_ABI_BREAKING_CHECKS`) | corrigé : `Error` et `Expected<T>` ajoutés par Lang Hames en mars 2016 | Cas réel — LLVM et son `Expected<T>` (2016) | https://llvm.org/docs/CodingStandards.html ; https://llvm.org/docs/ProgrammersManual.html ; https://github.com/llvm/llvm-project/commit/f7f6d3e93f739077dc280532d906ca523489b01f (et `gh api`) ; https://raw.githubusercontent.com/llvm/llvm-project/main/llvm/include/llvm/Support/Error.h ; Error.cpp (`fatalUncheckedError`) ; https://lists.llvm.org/pipermail/llvm-dev/2016-March/096880.html |
| `pages/cpp/lecon-14.html#1` | INVÉRIFIABLE, produit : temps de compilation de Chromium (« des heures », Goma/Reclient), sans chiffre daté ni source | remplacé par : `-ftime-trace` d'Aras Pranckevičius, Clang 9.0 | Cas réel — Clang chronomètre ses en-têtes : `-ftime-trace` (2019) | https://aras-p.info/blog/2019/01/16/time-trace-timeline-flame-chart-profiler-for-Clang/ ; https://releases.llvm.org/9.0.0/tools/clang/docs/ReleaseNotes.html |
| `pages/cpp/lecon-15.html#1` | INEXACT, événement : 55 millions (50 selon le rapport) ; « certaines pendant deux jours » (jusqu'à 4 jours aux États-Unis) ; XA/21 « écrit en C++ » (routine d'alarme en C et C++, l'ensemble en C) ; « deux threads » (deux processus) ; « des années de tests » (plus de 3 millions d'heures de fonctionnement selon GE) | corrigé | Cas réel — la panne géante du 14 août 2003 et l'alarme de FirstEnergy | https://www.energy.gov/sites/prod/files/oeprod/DocumentsandMedia/BlackoutFinal-Web.pdf (pypdf, chap. 1 et 5) ; https://www.theregister.com/2004/04/08/blackout_bug_report/ (presse : le rapport de la commission ne nomme pas la race condition, que rapporte Kevin Poulsen d'après GE) |
| `pages/cpp/lecon-16.html#1` | VRAI en partie, produit : le contrôle `consteval` de `std::format` est juste (depuis P2216R3) ; « fmt tourne en production dans d'innombrables projets » invérifiable, retiré | corrigé : daté par P2216R3, rétroactif sur C++20 | Cas réel — `std::format` vérifie sa chaîne à la compilation (2021) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p2216r3.html ; https://en.cppreference.com/w/cpp/utility/format/format (rapports de défauts) ; essai GCC 15.1 `-std=c++20` |
| `pages/cpp/lecon-17.html#1` | INVÉRIFIABLE, produit / général (« Unity DOTS, moteurs maison AAA », « un gain de plusieurs fois ») | remplacé par : Mike Acton, « Data-Oriented Design and C++ » | Cas réel — Mike Acton et le *data-oriented design* (CppCon 2014) | https://github.com/CppCon/CppCon2014/tree/master/Presentations/Data-Oriented%20Design%20and%20C%2B%2B (pptx téléchargé et lu : diapositives 1, 29-30, 40, 99, 113, 117) |
| `pages/cpp/lecon-18.html#1` | sujet d'un autre foyer (SQLite, `csharp/lecon-19`), produit ; chiffres non revérifiés | remplacé par : Catch2 3.0.1 abandonne l'en-tête unique | Cas réel — Catch2 3 quitte l'en-tête unique (2022) | https://github.com/catchorg/Catch2/releases/tag/v3.0.1 (et `gh api`, publiée le 17 mai 2022) ; https://github.com/catchorg/Catch2/blob/devel/docs/release-notes.md |
| `pages/cpp/lecon-19.html#1` | INVÉRIFIABLE, anonyme (« un service C++… débit multiplié par dix ») | remplacé par : clang-tidy 17, `performance-avoid-endl` | Cas réel — clang-tidy traque `std::endl` (2023) | https://clang.llvm.org/extra/clang-tidy/checks/performance/avoid-endl.html ; https://releases.llvm.org/17.0.1/tools/clang/tools/extra/docs/ReleaseNotes.html ; https://github.com/llvm/llvm-project/releases/tag/llvmorg-17.0.1 (19 septembre 2023) ; essai GCC 15.1 (98 ms contre 10 ms) |
| `pages/cpp/lecon-20.html#1` | INVÉRIFIABLE, anonyme (« une équipe de jeu ») | remplacé par : N3924, C++14 décourage `rand()` | Cas réel — C++14 décourage `rand()` (2014) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n3924.pdf (pypdf) ; https://eel.is/c++draft/rand.predef ; essais GCC 15.1 et Clang 18 libc++ (4123659995) |
| `pages/cpp/lecon-21.html#1` | INVÉRIFIABLE, anonyme (un script qui range les téléchargements) | remplacé par : P0218R1, Boost.Filesystem devient `std::filesystem`, clause des courses | Cas réel — Boost.Filesystem devient `std::filesystem` (2016) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2016/p0218r1.html ; https://herbsutter.com/2016/03/11/trip-report-winter-iso-c-standards-meeting/ |
| `pages/cpp/lecon-22.html#1` | INVÉRIFIABLE, produit / général (Qt, Boost, Abseil « exposent volontairement… ») | remplacé par : P0184R0, range-for à sentinelle | Cas réel — le range-for accepte une sentinelle (2016) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2016/p0184r0.html ; https://en.cppreference.com/w/cpp/language/range-for ; essai GCC 15.1 en C++14 et C++17 |
| `pages/cpp/lecon-23.html#1` | INVÉRIFIABLE, anonyme (« une développeuse… 8 Go ») | remplacé par : QDirStat et sa fenêtre de statistiques par type de fichier | Cas réel — QDirStat compte la place par type de fichier (2015) | https://github.com/shundhammer/qdirstat (README lu en entier, `gh api` : dépôt créé le 2015-11-28, langage C++) |

## 3. Cas par cas — `vb`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/vb/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« un comptable » dans « d'innombrables PME ») | remplacé par : Microsoft annonce que VB n'évoluera plus comme langage | Cas réel — Microsoft fige le langage Visual Basic (2020) | https://devblogs.microsoft.com/vbteam/visual-basic-support-planned-for-net-5-0/ |
| `pages/vb/lecon-02.html#1` | INVÉRIFIABLE (B2), anonyme (« un développeur… commissions ») | remplacé par : VBA 7, `Long` de 4 octets, `LongPtr`, `PtrSafe` | Cas réel — Office 2010, VBA 7 et le type `LongPtr` (2010) | https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/64-bit-visual-basic-for-applications-overview |
| `pages/vb/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« une macro de facturation ») | remplacé par : `AndAlso` et `OrElse` de VB.NET 2002 | Cas réel — `AndAlso` et `OrElse` arrivent avec VB.NET (2002) | https://learn.microsoft.com/en-us/archive/blogs/vbfaq/why-did-visual-basic-net-introduce-andalso-and-orelse ; https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/operators/andalso-operator ; essai .NET 10 (And : IndexOutOfRangeException ; AndAlso : -1). Le billet d'origine de Paul Vick (panopticoncentral.net) ne répond plus : cité par l'archive MSDN |
| `pages/vb/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« un classeur de devis ») | remplacé par : la TVA à 20 % au 1er janvier 2014 (code gardé) | Cas réel — la TVA passe de 19,6 % à 20 % (2014) | https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000026858463 ; https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000026857857 (titre et date de la loi) |
| `pages/vb/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« un export comptable… des millions de lignes ») | remplacé par : `TEXTSPLIT` dans Excel (code gardé) ; `Val` et `CDbl` essayés | Cas réel — Excel reçoit `TEXTSPLIT`, son `Split` en formule (2022) | https://techcommunity.microsoft.com/blog/excelblog/announcing-new-text-and-array-functions/3186066 ; https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/val-function ; essai .NET 10 en fr-FR |
| `pages/vb/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« une macro reçoit une colonne d'adresses ») | remplacé par : `UNIQUE` et les tableaux dynamiques (code gardé) | Cas réel — Excel ajoute la fonction `UNIQUE` (2018) | https://techcommunity.microsoft.com/blog/excelblog/preview-of-dynamic-arrays-in-excel/252944 |
| `pages/vb/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« un magasin ») | remplacé par : macros des fichiers venus d'Internet bloquées par défaut (code gardé) ; intertitre suivi | Cas réel — Office bloque les macros venues d'Internet (2022) | https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked |
| `pages/vb/lecon-08.html#1` | INVÉRIFIABLE, général (« une fenêtre avec une zone de saisie ») | remplacé par : VB et l'Application Framework dans .NET 5, `Handles` (code gardé) ; intertitre suivi | Cas réel — Windows Forms en VB arrive dans .NET 5 (2020) | https://devblogs.microsoft.com/dotnet/visual-basic-winforms-apps-in-net-5-and-visual-studio-16-8/ |
| `pages/vb/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« un employé… une cinquantaine d'heures ») | remplacé par : Office Scripts et son enregistreur, comparés à VBA ; intertitre suivi | Cas réel — Office Scripts, l'enregistreur d'Excel pour le Web (2020) | https://techcommunity.microsoft.com/blog/excelblog/announcing-office-scripts-preview/1093559 ; https://learn.microsoft.com/en-us/office/dev/scripts/resources/vba-differences |
| `pages/vb/lecon-10.html#1` | INVÉRIFIABLE, général (« une application de gestion ») | remplacé par : VB 14 et les propriétés `ReadOnly` d'interface (code gardé) ; intertitre suivi | Cas réel — Visual Basic 14 et les propriétés d'interface en lecture seule (2015) | https://learn.microsoft.com/en-us/dotnet/visual-basic/whats-new/ (et sa source GitHub) ; essai .NET 10 |
| `pages/vb/lecon-11.html#1` | INVÉRIFIABLE, général (« la direction demande… ») | remplacé par : LINQ dans VB avec Visual Studio 2008, clause `Aggregate` (code gardé) ; intertitre suivi | Cas réel — LINQ entre dans Visual Basic avec Visual Studio 2008 | https://learn.microsoft.com/en-us/dotnet/visual-basic/whats-new/ ; https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/linq/introduction-to-linq ; essai .NET 10 (`Where/Sum` = `Aggregate` = 140) |
| `pages/vb/lecon-12.html#1` | INVÉRIFIABLE, général (« une application garde une List(Of Client) ») | remplacé par : `Encoding.Default` en UTF-8 dans .NET Core, BOM de `WriteAllLines` (code gardé) ; intertitre suivi | Cas réel — .NET Core passe l'encodage par défaut en UTF-8 (2016) | https://learn.microsoft.com/en-us/dotnet/api/system.text.encoding.default ; https://learn.microsoft.com/en-us/dotnet/api/system.io.file.writealllines ; https://devblogs.microsoft.com/dotnet/announcing-net-core-1-0/ ; essai .NET 10 (octets `48…` et `EF BB BF 48…`) |
| `pages/vb/lecon-13.html#1` | INVÉRIFIABLE, anonyme (« un outil de comptabilité… une nuit ») | remplacé par : le motif Try-Parse des Framework Design Guidelines ; intertitre suivi | Cas réel — le motif Try-Parse de .NET (2008) | https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/exceptions-and-performance ; essai .NET 10 (`TryParse("N/A")` = False, `Parse` : FormatException) |
| `pages/vb/lecon-14.html#1` | INVÉRIFIABLE, général (« beaucoup de petites structures… un tableur qui finit par déborder ») | remplacé par : les 179 contrats de Lehman réintroduits par des lignes masquées ; intertitre suivi | Cas réel — Barclays, Lehman et les lignes masquées d'un tableur (2008) | https://www.computerworld.com/?p=1357785 (presse : la requête de Cleary Gottlieb au tribunal des faillites, citée par l'article, n'est pas en accès libre ; introuvable sur le web ouvert, PACER exigé) |

## 4. Contrôles avant le dernier commit

| contrôle | code / résultat |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=cpp` | 0 (23 conformes sur 23) |
| `node tools/verif-contenu.js --cas-reel --cours=vb` | 0 (14 conformes sur 14) |
| `node tools/verif-contenu.js --strict` | 0 — conformes sur le site : 543 → 580 sur 1 551 |
| `node tools/verif-html.js` | 0 |
| `node tools/verif-domaines-interdits.js` | 0 |
| `node tools/verif-qcm-lexique.js` | 0 |
| `node tools/verif-qcm-biais.js` | 0 |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b6-cpp-vb 1b45660` | 0 écart (37 pages) |
| `preuve.js` (octets hors encadrés et intertitres identiques à `1b45660`, 0 CR) | 0 écart (37 pages) |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées, les deux légitimes connues (react.dev, Safari 15.4) ; aucune des nôtres |
| `node tools/doc/verif-normatif.js` | 0 (75 contrôles) après la retouche décrite au § 5 |
| `node tools/verif.js --rapide` | 1 (54 étapes, 385,7 s) : 4 rouges, tous expliqués au § 5 (`donnees` I18, `doc-rec`, `etudes`, `etude-6`) |

Le cliquet lexical a rougi quatre fois pendant l'écriture, chaque fois sur un mot d'option de QCM :
« détruit » entré dans `cpp/lecon-05`, « nombre » dans `cpp/lecon-15`, « contrôle » dans
`cpp/lecon-16`, et « remplace » sorti de `vb/lecon-14` avec l'ancien intertitre. Reformulé dans
l'encadré (« à la destruction de l'objet », « encore et encore », « cette vérification »), et
« remplace » remis dans une phrase exacte (« le programme de cette leçon, petit outil qui remplace le
tableur »). Avant d'écrire, `motsqcm.js` a listé pour chaque leçon les mots à ne pas ajouter : ils ont
dicté plusieurs tournures (pas d'« exception » dans `cpp/lecon-08`, pas d'« insertion » dans
`cpp/lecon-10`, pas de « signale » ni de « bibliothèque » dans `cpp/lecon-19`, pas de « données » ni
de « fichiers » dans `vb/lecon-09`, pas d'« erreur » dans `vb/lecon-12`).

## 5. Les rouges de `verif.js --rapide`

Premier passage (sur les deux commits de cours) : code 1, 54 étapes, 440 s, six étapes signalées.

- **`donnees`** — invariant I18 seulement (`search-index.js` divergent du contenu regénéré, +4 830
  octets) : index de recherche périmé par les nouveaux textes. **Toléré** ; l'orchestrateur régénère
  après fusion. (I17, I19, I25 : avertissements, non bloquants.)
- **`doc-ref`** (`verif-doc`, 2 échecs sur 41 : « nombre de leçons qui renvoient à un document = 110 »
  et « nombre de cours concernés = 41 » de la page de cours `doc`) et **`doc-rec`**
  (`verif-recherche` : « 574 citent la source » introuvable dans la page) : chiffres du cours `doc`
  mesurés sur tout le site, que nos 37 lignes de source font bouger. **Tolérés**, lignes de source non
  déformées.
- **`normatf`** (`tools/doc/verif-normatif.js`, 1 échec sur 75) : **non listé dans la consigne,
  corrigé**. Le cours `doc` publie le nombre de leçons dont l'article contient « la spécification » ;
  deux de mes encadrés l'employaient au sens de « spécification technique » ISO (`cpp/lecon-21` : la TS
  18822 ; `cpp/lecon-22` : le Ranges TS), ce qui faisait passer le compte publié de 41 à 43. Reformulé
  dans l'encadré, sans changer le sens (« le TS ISO/IEC TS 18822 (une spécification technique) »,
  « le Ranges TS, une spécification technique ») : `verif-normatif` rend 75/75, `lexique-diff` 0 écart.
- **`etudes`** et **`etude-6`** (`verif-etudes.js`, `preuves/etude-inconnu.js`) : **non listés dans la
  consigne, expliqués ici**, comme au lot 2. La page dérivée `pages/etude-inconnu.html` publie une
  mesure de tout le site — les blocs de code d'au moins 5 lignes non vides, par langage. L'encadré de
  `vb/lecon-03` portait un bloc de 9 lignes (une remise de facturation fictive), remplacé par
  l'exemple `AndAlso` de la documentation, cité en ligne : vb perd un bloc, total 10 629 → 10 628. Rien
  de faux dans la page d'étude : elle est périmée. Remède (orchestrateur, après fusion) : relancer
  l'assembleur de `etude-inconnu` sans `--verifier`, comme les autres pages dérivées.

Second passage, après la retouche de `normatf` et celle de `cpp/lecon-07` : code 1, 54 étapes, 385,7 s, quatre étapes signalées — `donnees` (I18 seul, +4 832 octets), `doc-rec` (« 574 citent la source »), `etudes` et `etude-6` (10 629 → 10 628 blocs). `doc-ref` et `normatf` repassent au vert : le compteur des leçons qui « renvoient à un document » de `verif-doc` comptait lui aussi « la spécification ».

## 6. Les cas où j'ai douté

- `cpp/lecon-06` (Qt) : le titre date le cas par la version de la documentation lue (Qt 6.12, sortie le
  30 septembre 2026) plutôt que par un événement ; la phrase « en pratique, seul le destructeur de la
  base s'exécuterait » reprend le corps de la leçon (comportement indéfini), elle n'est pas dans la
  documentation de Qt.
- `cpp/lecon-15` (panne de 2003) : la race condition n'est pas dans le rapport de la commission (qui dit
  seulement que le processus d'alarme a « calé ») ; elle vient de l'enquête de Kevin Poulsen, qui cite
  GE. Source de presse, faute de document primaire de GE en ligne.
- `cpp/lecon-17` (Mike Acton) : les diapositives sont lues sans la vidéo ; je ne cite que les chiffres
  écrits sur les diapositives (12 et 4 octets × 32, ~10:1, 10x), sans prétendre décrire la structure
  exacte de son exemple.
- `cpp/lecon-19` : les 98 ms contre 10 ms viennent d'une seule machine (Compiler Explorer) ; l'encadré le
  dit. La phrase « chaque vidange force une écriture vers le système » est une explication du
  mécanisme, pas une citation de la documentation de clang-tidy.
- `vb/lecon-03` : le billet d'origine de Paul Vick n'est plus en ligne ; seule sa citation par la FAQ de
  MSDN (2004) est vérifiable.
- `vb/lecon-14` : seule une source de presse (Computerworld) ; la requête déposée au tribunal n'a pas pu
  être ouverte. Le lien avec la notion (le programme de la leçon ne cache aucune ligne) est une
  conclusion pédagogique, pas une affirmation de la source.
- `vb/lecon-05`, `-06`, `-07`, `-10`, `-11` : le code VBA gardé (Split/Trim/Val, Dictionary,
  AlerterStock) n'a pas pu être exécuté dans Excel (pas d'Office dans la copie) ; ses parties
  communes avec VB.NET (Split, Trim, Val, LINQ, interface) sont essayées sous .NET 10.

## 7. Ce qui reste ouvert

- `cpp/lecon-23` : le paragraphe sous l'intertitre « Cas réel : du, tree et compagnie » (hors encadré,
  non touché) cite `ncdu`, sujet de `zig/lecon-18` ; ce n'est qu'une mention dans une liste d'outils.
- Les corps des leçons n'ont pas été relus au-delà de ce que les cas touchaient. Vu en passant :
  `cpp/lecon-17` cite Mike Acton dans un encadré « Pour aller plus loin » (cohérent avec le nouveau
  cas) ; `vb/lecon-09` cite Office Scripts dans son corps (idem).

## 8. Consignes de fusion

- Branche `v18/b6-cpp-vb`, trois commits sur `1b45660` : `cpp` (23 encadrés), `vb` (14 encadrés et huit
  intertitres), puis ce rapport avec trois retouches d'encadrés `cpp` faites après les contrôles
  (`cpp/lecon-07` : le titre de P1185 mis en `<code>` ; `cpp/lecon-21` et `-22` : « la spécification
  technique » reformulé pour le compteur de `verif-normatif`, voir § 5).
- Seuls changent les 37 encadrés « Cas réel » de `pages/cpp/` et `pages/vb/` et les huit intertitres
  `<h2>Cas réel&nbsp;: …</h2>` de `vb/lecon-07` à `-14` ; `preuve.js` le montre octet par octet contre
  `1b45660`. Aucune page à mojibake volontaire touchée.
- Après fusion : régénérer les index dérivés (`build-index.js --write --fresh`, I18), la page
  `etude-inconnu.html` (assembleur de l'étude : un bloc `vb` de moins) et les chiffres du cours `doc`
  (37 lignes de source de plus) ; rejouer `doublons.js` avec les autres branches du lot 3.
- À ajouter au registre des foyers, si l'orchestrateur le juge utile : la panne du 14 août 2003
  (`cpp/lecon-15`), les propositions WG21 N2431, P0515/P1185, N2983, N3580, N1450, P0052, P2216,
  P0218, P0184, N3924 (une par leçon de `cpp`), les C++ Core Guidelines (`cpp/lecon-04`), V8 2008
  (`cpp/lecon-01`), la TVA à 20 % de 2014 (`vb/lecon-04`), le blocage des macros venues d'Internet
  (`vb/lecon-07`), Barclays/Lehman (`vb/lecon-14`).
