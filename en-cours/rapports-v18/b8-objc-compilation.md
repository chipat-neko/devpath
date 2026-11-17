# Rapport V18 — case B8, lot 5 : les cours `objc` et `compilation` (copie `b8-objc-compilation`, branche `v18/b8-objc-compilation`)

Copie de travail `D:\test-claude-b8-objc-compilation`, partie de `d86be7b`. Part traitée : les **27 « Cas réel »**
des cours `objc` (14, un par leçon) et `compilation` (13, un par leçon). Scripts et pièces dans
`scratchpad/b8-objc-compilation/` (ignoré par git) : `new/<cours>__<NN>.html` (les 27 encadrés), `apply.js`
(remplace du titre de l'encadré au `</div></div>` final, refuse un remplacement ambigu, prouve que les octets
hors de l'encadré sont identiques et refuse tout CR), `mots.js` (mots d'options de QCM qui entreraient ou
sortiraient), `typo.js` (espaces insécables, liens hors de la ligne de source, `<` dans un `<pre>`),
`fetch.py`, `grep.py`, `txt/` et `raw/` (pages ouvertes et leur texte), PDF lus avec `pypdf`
(`naroff2007.pdf`, `n1570.pdf`, `n3337.pdf`), tests rejoués (`objc/tests.m`, `objc/tests3.m`,
`objc/extraits.m`, `common/` pour `-fno-common`, `chevrons.cpp`, `profondeur.py`, `mesures_py.py`,
`json2-test.js`, `ut/` pour unittest), `outils/py311/` (Python 3.11.9 « embeddable », archive officielle de
python.org).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **14 hors de la règle à 0** pour `objc`
et de **13 à 0** pour `compilation` ; sur les 27 cas trouvés, **22 INVÉRIFIABLES** (récits anonymes « Une
équipe… », « Un développeur… », usages généraux « Ouvre n'importe quel projet iOS… », un exercice hypothétique),
**3 INEXACTS** (`compilation/08`, `11`, `12`), **2 VRAIS** (`objc/08`, déjà jugé VRAI par B2 ;
`compilation/10`, à retoucher), **0 INVENTÉ** ; **21 remplacés** par un cas réel daté et sourcé sur la même
notion, **5 corrigés sur leur sujet**, **1 gardé et précisé**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b8-objc-compilation`) : `755b8c8` (objc, 14 cas), `f07b1aa` (compilation, 13 cas),
`4a30ffd` (compilation/lecon-03 : json2.js remplace ALGOL 60, voir plus bas), puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` final (type `note`,
  icône, structure gardés). Les 13 encadrés de `compilation` sont chacun sous un `<h2>Cas réel</h2>` nu, qui
  n'annonce aucun récit : gardés tels quels. Aucun intertitre au-dessus des encadrés d'`objc`.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps (les deux liens internes « leçon 1 », « leçon 11 » des anciens encadrés
  `compilation/11` et `12` sont devenus du texte) ; `&nbsp;` devant « : ; ? ! » et dans « » ; dans les
  `<pre><code>`, `<` écrit `&lt;`.
- Longueur : 180 à 270 mots source comprise (corps d'environ 150 à 220 mots), un peu au-dessus de la cible
  pour plusieurs cas d'`objc`, dont les originaux étaient très courts (55 à 100 mots) : chaque affirmation
  garde sa précision (version, date, message exact).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et URL),
  dans `b8-reservations.txt` (lignes ajoutées pour les 27 cas ; `compilation/lecon-03` réservé deux fois,
  la dernière ligne — json2.js — fait foi), et `doublons.js` lancé : toujours **2** sources partagées entre
  cours (les deux légitimes). Sujets **écartés** : Node.js 15 et les rejets non gérés (gardé par
  `js/lecon-63`), Dropbox et mypy (`python/lecon-32`), la RFC 8259 de JSON (`js/lecon-09`, que racontait
  l'ancien `compilation/07`), la panne ReDoS de Cloudflare et Stack Overflow (`regex`), le rachat de NeXT par
  le communiqué de 1996 (ne parle pas d'Objective-C), la réponse Stack Overflow « You can't parse [X]HTML with
  regex » (ton outrancier, impropre au site), les nouveautés de Perl 5.10 (source partagée avec
  `perl/lecon-12`), PCRE (`perl/lecon-04`). Sources volontairement **sans lien** pour ne pas créer de source
  partagée : le projet N1570 de la norme C (déjà lié trois fois par le cours `c`), la page des versions de
  GCC (`asm/lecon-13`) — remplacée par la page de la série GCC 10.
- **Comportements rejoués** (« un comportement de compilateur se TESTE ») : `zig cc` 0.14.1 = **Clang
  19.1.7** (`-target x86_64-macos -fsyntax-only -fobjc-arc`, déclarations Foundation minimales écrites à la
  main), Node 24, Python 3.14.5, et **Python 3.11.9** portable officiel. Résultats cas par cas ci-dessous.
  Présence des diagnostics de Clang dans les **sources des versions publiées** vérifiée sur les tags
  `llvmorg-2.9.0` à `llvmorg-12.0.0` (fichier `DiagnosticSemaKinds.td`), dates des versions sur
  releases.llvm.org (3.0 : 1er décembre 2011 ; 3.2 : 20 décembre 2012).
- **Mots d'options de QCM** : `mots.js` avant chaque application ; mots gardés dans une phrase exacte
  (« jamais », « sous-classer », « NSData », « applications », « échoue », « l'appel », « grammaire »,
  « l'occasion », « enchaînement ») ; mots entrants retirés (« compare », « fabrique », « qu'ensuite »,
  « gestion », « mémoire », « commence », « manque », et « stable » qui entrait par l'URL de pytest
  — `/en/stable/` remplacé par `/en/latest/`, page ouverte). `lexique-diff.js` : **0 écart** sur les 27 pages.

## Cas par cas — `objc`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/objc/lecon-01.html#1` | INVÉRIFIABLE — général (frameworks « d'abord écrits en Objective-C », « premières versions de Facebook, d'Instagram, de YouTube », sans source) | remplacé par : l'API OpenStep (septembre 1994), première à employer le préfixe NS, devenue Cocoa | Cas réel — OpenStep et le préfixe NS (1994) | https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CocoaFundamentals/WhatIsCocoa/WhatIsCocoa.html (« A Bit of History », mis à jour le 2013-09-18) ; écartée : https://www.sec.gov/Archives/edgar/data/0000320193/000032019396000027/0000320193-96-000027.txt (communiqué du 20/12/1996, ne nomme pas Objective-C) |
| `pages/objc/lecon-02.html#1` | INVÉRIFIABLE — général (`==` qui marche « par chance » sur des littéraux fusionnés, bugs « impossibles à reproduire ») | remplacé par : Clang 3.2 (20/12/2012), première version dont le code contient « direct comparison of a string literal has undefined behavior » ; rejoué Clang 19.1 | Cas réel — Clang et le == entre chaînes (2012) | https://github.com/llvm/llvm-project/blob/llvmorg-3.2.0/clang/include/clang/Basic/DiagnosticSemaKinds.td (absent de 2.9, 3.0, 3.1) ; https://releases.llvm.org/ ; https://clang.llvm.org/docs/DiagnosticsReference.html |
| `pages/objc/lecon-03.html#1` | INVÉRIFIABLE — général (« des pans entiers de Cocoa en dépendent ») | remplacé par : la section « Sending Messages to nil » de *The Objective-C Programming Language* (valeurs renvoyées, limites : structs non remplies, valeur indéfinie) | Cas réel — Ce que renvoie un message à nil, selon Apple (2013) | https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjectiveC/Chapters/ocObjectsClasses.html (mis à jour le 2013-04-23) |
| `pages/objc/lecon-04.html#1` | INVÉRIFIABLE — général (« un réflexe que suit tout le code Cocoa ») | remplacé par : `%@` → `descriptionWithLocale:` ou `description`, NSObject rend classe et adresse, `po` affiche `debugDescription` | Cas réel — description, %@ et la commande po, selon Apple (2014) | https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithObjects/WorkingwithObjects.html (2014-09-17) ; https://developer.apple.com/documentation/objectivec/nsobjectprotocol/debugdescription (lu en `.md`) |
| `pages/objc/lecon-05.html#1` | INVÉRIFIABLE — produit nommé, affirmations générales (« la convention veut… », « si lisible ») | remplacé par : `instancetype` pour `alloc`, `init` et les fabriques ; rejoué Clang 19.1 (avertissement de types incompatibles avec `instancetype`, rien avec `id`) | Cas réel — instancetype pour les fabriques, selon Apple (2014) | https://developer.apple.com/library/archive/releasenotes/ObjectiveC/ModernizationObjC/AdoptingModernObjective-C/AdoptingModernObjective-C.html (2014-10-16) |
| `pages/objc/lecon-06.html#1` | INVÉRIFIABLE — général (« Ouvre n'importe quel projet iOS… UIColor+Hex ») | remplacé par : la catégorie `sortDescriptorWithKey:ascending:` rattrapée par la méthode ajoutée à NSSortDescriptor dans Mac OS X 10.6 / iOS 4.0, préfixe `xyz_`, nommage `Classe+Catégorie.h` | Cas réel — Une catégorie rattrapée par NSSortDescriptor, selon Apple (2014) | https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/CustomizingExistingClasses/CustomizingExistingClasses.html (2014-09-17) |
| `pages/objc/lecon-07.html#1` | INVÉRIFIABLE — général (« le cycle le plus fréquent en pratique », « tout développeur iOS écrit ce `__weak` des dizaines de fois ») | remplacé par : les notes de transition vers ARC (ARC ne protège pas des cycles, blocks, `__weak`, variable forte pour les cycles non triviaux) et l'avertissement `-Warc-retain-cycles` (présent dans Clang 3.0, rejoué Clang 19.1) ; code `weakself.m` gardé (compilé sans avertissement) | Cas réel — ARC et le cycle du block (2011) | https://developer.apple.com/library/archive/releasenotes/ObjectiveC/RN-TransitioningToARC/Introduction/Introduction.html (2013-08-08) ; https://developer.apple.com/library/archive/releasenotes/ObjectiveC/ObjCAvailabilityIndex/index.html (2013-10-22) ; https://github.com/llvm/llvm-project/blob/llvmorg-3.0.0/clang/include/clang/Basic/DiagnosticSemaKinds.td ; https://releases.llvm.org/ |
| `pages/objc/lecon-08.html#1` | VRAI (B2) — produit nommé ; une imprécision : le handler « exécuté sur un autre thread » | **gardé et précisé** : exécuté sur la file d'opérations de la session (file série créée par la session si on n'en donne pas), `resume`, iOS 7 (2013) ; « partout où tu vois completion » restreint aux deux API citées ; code `reseau.m` gardé (compilé) | Cas réel — NSURLSession et ses blocks de complétion (2013) | https://developer.apple.com/documentation/foundation/urlsession/datatask(with:completionhandler:)-52wk8 ; https://developer.apple.com/documentation/foundation/urlsession/init(configuration:delegate:delegatequeue:) ; https://developer.apple.com/documentation/uikit/uiview/animate(withduration:animations:completion:) (les trois lus en `.md`) ; https://developer.apple.com/library/archive/releasenotes/General/WhatsNewIniOS/Articles/iOS7.html ; https://www.apple.com/newsroom/2013/09/10iOS-7-With-Completely-Redesigned-User-Interface-Great-New-Features-Available-September-18/ |
| `pages/objc/lecon-09.html#1` | INVÉRIFIABLE — général (« beaucoup de grandes applications… en régime mixte », frameworks « en grande partie » en Objective-C) | remplacé par : Swift annoncé le 2 juin 2014, « coexists with Objective-C code » ; migrer une classe à la fois, bridging header, en-tête généré | Cas réel — Swift arrive et cohabite avec Objective-C (2014) | https://www.apple.com/newsroom/2014/06/02Apple-Releases-iOS-8-SDK-With-Over-4-000-New-APIs/ ; https://developer.apple.com/documentation/swift/migrating-your-objective-c-code-to-swift (lu en `.md`) |
| `pages/objc/lecon-10.html#1` | INVÉRIFIABLE — général (« Tout Foundation parle NSError ») | remplacé par : l'*Error Handling Programming Guide* — le succès se lit dans le retour (`nil`/`NO`), jamais dans l'NSError d'abord ; `NULL` permis | Cas réel — Le guide des erreurs de Cocoa : le retour d'abord (2011) | https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ErrorHandlingCocoa/CreateCustomizeNSError/CreateCustomizeNSError.html (2011-01-07) |
| `pages/objc/lecon-11.html#1` | INVÉRIFIABLE — anonyme (« Une application ne devine pas où écrire ») | remplacé par : le *File System Programming Guide* — dossiers sauvegardés ou non (Documents, Library sauf Caches, tmp), paquet signé, `URLsForDirectory:inDomains:` conseillé à la place de `NSSearchPathForDirectoriesInDomains` ; nouveau code compilé | Cas réel — Apple et le bon dossier pour chaque fichier (2018) | https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html et …/AccessingFilesandDirectories/AccessingFilesandDirectories.html (2018-04-09) ; https://developer.apple.com/documentation/foundation/filemanager/urls(for:in:) ; https://developer.apple.com/documentation/foundation/nsurl/appendingpathcomponent(_:) ; (écartées faute d'accès, Internet Archive en 429 : les copies de QA1719 de 2011-2013) ; vue : https://developer.apple.com/documentation/foundation/optimizing-your-app-s-data-for-icloud-backup |
| `pages/objc/lecon-12.html#1` | INVÉRIFIABLE — général (target-action « du runtime pur ») | remplacé par : ARC et `performSelector:` — familles de méthodes ; Clang 3.0 contient l'erreur « performSelector names a selector which retains the object » et l'avertissement « …may cause a leak because its selector is unknown » ; rejoués Clang 19.1 (`@selector(copy)` → erreur, variable `SEL` → avertissement, sélecteur hors famille → rien) | Cas réel — ARC face à performSelector: (2011) | https://clang.llvm.org/docs/AutomaticReferenceCounting.html ; https://github.com/llvm/llvm-project/blob/llvmorg-3.0.0/clang/include/clang/Basic/DiagnosticSemaKinds.td ; https://releases.llvm.org/ |
| `pages/objc/lecon-13.html#1` | INVÉRIFIABLE — produit nommé : « c'est exactement ce que font, en coulisses, les bibliothèques comme SDWebImage ; GCD en est le moteur » (rien ne l'établit) | remplacé par : le Main Thread Checker d'Xcode 9 (2017) — AppKit/UIKit/WebKit hors du thread principal, 1 à 2 % de CPU, ≤ 100 ms au lancement, fautes surtout dans les blocks de complétion | Cas réel — Le Main Thread Checker d'Xcode 9 (2017) | https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/WhatsNewXcode/xcode_9/xcode_9.html (2017-09-19) ; https://developer.apple.com/documentation/xcode/diagnosing-memory-thread-and-crash-issues-early (lu en `.md`) |
| `pages/objc/lecon-14.html#1` | INVÉRIFIABLE — général (« exactement celle des composants de Cocoa ») | remplacé par : NSFetchedResultsController (iPhone OS 3.0) et son délégué, qui encadre les mises à jour d'un tableau | Cas réel — NSFetchedResultsController et son délégué (2009) | https://developer.apple.com/documentation/coredata/nsfetchedresultscontroller ; https://developer.apple.com/documentation/coredata/nsfetchedresultscontrollerdelegate (lus en `.md`) ; https://www.apple.com/newsroom/2009/03/17Apple-Previews-Developer-Beta-of-iPhone-OS-3-0/ |

## Cas par cas — `compilation`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/compilation/lecon-01.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe livre un service écrit en Python… ») | remplacé par : Stripe et Sorbet — les `NameError: uninitialized constant` de production remplacés par des erreurs de type statiques | Cas réel — Stripe et Sorbet, le vérificateur de types de Ruby (2017-2022) | https://stripe.dev/blog/sorbet-stripes-type-checker-for-ruby (Jake Zimmerman, 2022-03-28) |
| `pages/compilation/lecon-02.html#1` | INVÉRIFIABLE — récit anonyme (« Un développeur passe une demi-journée… ») | remplacé par : GCC 10 passe à `-fno-common` (définitions provisoires dans un en-tête → erreur d'édition de liens) ; rejoué Clang 19.1 : deux objets sans avertissement, puis `duplicate symbol: compteur` ; `-fcommon` passe | Cas réel — GCC 10 et la variable définie dans un en-tête (2020) | https://gcc.gnu.org/gcc-10/porting_to.html ; https://gcc.gnu.org/gcc-10/changes.html ; https://gcc.gnu.org/gcc-10/ (GCC 10.1, 7 mai 2020) |
| `pages/compilation/lecon-03.html#1` | INVÉRIFIABLE — récit anonyme (format de configuration maison, regex puis EBNF) | remplacé par : json2.js de Douglas Crockford — quatre regex ne contrôlent que des catégories de caractères, `eval` juge l'imbrication ; rejoué Node 24 (`[1,[2,[3]]` et `[1]]]` passent le filtre, `SyntaxError` à `eval`). Un premier remplacement par ALGOL 60 (le `if` interdit après `then`, rapport révisé de 1962, source https://www.masswerk.at/algol60/report.htm), vrai, a été **retiré** (commit `4a30ffd`) : la solution de l'exercice, hors encadré, renvoie au « scénario du Cas réel » d'une analyse par regex d'un format imbriqué | Cas réel — json2.js : des regex pour les jetons, eval pour l'imbrication (2010) | https://github.com/douglascrockford/JSON-js/blob/11c7bdf47c3f21b014b1e984be52211142d8d8b7/json2.js (version 2010-11-17, premier commit du dépôt) ; https://github.com/douglascrockford/JSON-js/blob/master/json2.js (2023-05-10) |
| `pages/compilation/lecon-04.html#1` | INVÉRIFIABLE — récit anonyme (langage de filtres, `etat` découpé en `et` + `at`) | remplacé par : N1757, les `>>` des templates C++ (plus longue correspondance), règle de N3337 § 14.2 ; rejoué Clang 19.1 : erreur « a space is required between consecutive right angle brackets (use '> >') » en `-std=c++98`/`c++03`, accepté en `-std=c++11` | Cas réel — Les deux chevrons des templates C++ (N1757, 2005) | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2005/n1757.html ; https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2012/n3337.pdf (lu avec pypdf, p. 321) |
| `pages/compilation/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (service bloqué par une regex) | remplacé par : Russ Cox, automate de Thompson contre retour arrière (Perl > 60 s pour 29 caractères, 20 µs pour l'automate) | Cas réel — Russ Cox, l'automate contre le retour arrière (2007) | https://swtch.com/~rsc/regexp/regexp1.html |
| `pages/compilation/lecon-06.html#1` | INVÉRIFIABLE — récit anonyme (langage de règles métier, commentaires imbriqués) | remplacé par : Trojan Source (Boucher et Anderson, Cambridge), caractères bidirectionnels dans commentaires et chaînes, CVE-2021-42574 | Cas réel — Trojan Source, du code caché par un commentaire (2021) | https://arxiv.org/abs/2111.00169 (v1 du 30/10/2021) ; https://trojansource.codes/ ; vue, non citée (source partagée avec `asm/lecon-13`) : https://gcc.gnu.org/gcc-12/changes.html (`-Wbidi-chars`) |
| `pages/compilation/lecon-07.html#1` | INVÉRIFIABLE — exercice hypothétique (« Tu écriras un jour un lecteur de JSON… ») bâti sur la RFC 8259, sujet gardé par `js/lecon-09` | remplacé par : PEP 617 — `namedexpr_test: [NAME ':='] test` impossible en LL(1) (NAME dans PREMIERS de `test`), contournement trop large, gestionnaires de contexte entre parenthèses | Cas réel — CPython quitte son analyseur LL(1) (PEP 617, 2020) | https://peps.python.org/pep-0617/ |
| `pages/compilation/lecon-08.html#1` | INEXACT — produit nommé : « son manuel interne le dit en toutes lettres » (le manuel interne dit *recursive-descent* ; « construit à la main » vient de la page de présentation et de la présentation de 2007) ; « la qualité des messages est **l'**argument » (un des trois) ; ni date ni source | **corrigé** et sourcé : présentation de Steve Naroff (25 mai 2007, « Hand built recursive descent », « Expressive diagnostics ») ; trois arguments de la page Features ; `clang/lib/Parse` ; grammaire C (N1570 § 6.5.6) ; rejoué Clang 19.1 : 256 parenthèses passent, 257 → « bracket nesting level exceeded maximum of 256 » + note `-fbracket-depth=N` | Cas réel — Clang et son analyseur écrit à la main (2007) | https://llvm.org/devmtg/2007-05/09-Naroff-CFE.pdf (lu avec pypdf) ; https://llvm.org/devmtg/2007-05/ ; https://clang.llvm.org/features.html ; https://clang.llvm.org/docs/InternalsManual.html ; https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf (cité sans lien) ; liste de `clang/lib/Parse` par l'API GitHub |
| `pages/compilation/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe reprend en Python une feuille de calculs… », vingt minutes de dispute) autour d'une mesure vraie | **corrigé** : le récit d'équipe retiré ; la grammaire et le tableau des priorités de la référence du langage (`a_expr` récursive à gauche, `power` à droite, « sauf l'exponentiation et les expressions conditionnelles », `-1**2` vaut `-1`) ; mesure `ast` rejouée sur Python 3.14.5, identique au bloc sous l'encadré | Cas réel — L'exponentiation de Python groupe à droite (Python 3.14, 2025) | https://docs.python.org/3.14/reference/expressions.html (§ 6.5, 6.7, 6.17) ; https://peps.python.org/pep-0745/ (3.14.0 : 7 octobre 2025) |
| `pages/compilation/lecon-10.html#1` | VRAI pour l'essentiel — produit nommé (ast.NodeVisitor), mesure rejouée exacte (38, 5 visites) ; superlatif invérifiable (« une des bibliothèques standard les plus employées au monde ») et conclusion d'opinion (« une seule façon raisonnable ») | **corrigé** : superlatif et opinion retirés ; ce que dit la documentation de `NodeVisitor` (`visit_` + nom de classe, `generic_visit`, valeur transmise par `visit()`) | Cas réel — ast.NodeVisitor, le parcours d'arbre de Python (Python 3.14, 2025) | https://docs.python.org/3.14/library/ast.html ; https://peps.python.org/pep-0745/ |
| `pages/compilation/lecon-11.html#1` | INEXACT — produit nommé : la leçon 1 n'a pas désassemblé « une expression seule » mais l'affectation `x = 2 + 3 * 4`, où `STORE_NAME` (« celle qui range une variable ») figurait déjà | **corrigé** : la leçon 1 montrait `LOAD_SMALL_INT 14` puis `STORE_NAME` (calcul plié) ; le programme entier fait sortir ce que le pliage cachait ; ce que la doc de `dis` 3.14 dit de `LOAD_SMALL_INT` (nouvelle en 3.14, `range(256)`), `STORE_NAME`, `LOAD_NAME`, `BINARY_OP` ; listing sous l'encadré rejoué à l'identique | Cas réel — Le bytecode de CPython 3.14, lu par dis (2025) | https://docs.python.org/3.14/library/dis.html ; https://peps.python.org/pep-0745/ |
| `pages/compilation/lecon-12.html#1` | INEXACT — produit nommé, généralisations (« n'importe quel projet », « tout le monde met dans son fichier d'exclusions », « beaucoup de développeurs les prennent pour des déchets », « mise en œuvre industrielle »), ni date ni source | **corrigé** : PEP 3147 (16/12/2009, Python 3.2) — raison du cache, nombre magique et horodatage, conflit des versions, `__pycache__` ; rejoué Python 3.14.5 : `monmodule.cpython-314.pyc` créé à l'importation (le script lancé n'en a pas), `7 / 2` → `LOAD_CONST 3.5` | Cas réel — PEP 3147 et le dossier __pycache__ de CPython (2009) | https://peps.python.org/pep-3147/ |
| `pages/compilation/lecon-13.html#1` | INVÉRIFIABLE (B2) — usage général (code de sortie, `&&`, Makefile, CI, « années 1970 ») | remplacé par : unittest et le code 5 — ticket de Robert Collins (16/06/2013), témoignage d'un empaqueteur (2021), correction de Stefano Rivera fusionnée le 27/04/2023, Python 3.12 (2/10/2023) ; rejoué Python 3.11.9 (`Ran 0 tests`, `OK`, code 0) et 3.14.5 (5 / 0 / 1) | Cas réel — unittest et le code de sortie 5 (Python 3.12, 2023) | https://github.com/python/cpython/issues/62432 (et ses commentaires, API GitHub) ; https://github.com/python/cpython/pull/102051 ; https://docs.python.org/3.12/whatsnew/changelog.html (3.12.0 bêta 1) ; https://docs.python.org/3/whatsnew/3.12.html ; https://docs.pytest.org/en/latest/reference/exit-codes.html ; https://docs.python.org/3.14/library/unittest.html |

## Décomptes

| | objc | compilation | total |
|---|---:|---:|---:|
| « Cas réel » lus | 14 | 13 | **27** |
| INVÉRIFIABLE | 13 | 9 | 22 |
| INEXACT | 0 | 3 | 3 |
| VRAI | 1 | 1 | 2 |
| INVENTÉ | 0 | 0 | 0 |
| remplacés | 13 | 8 | **21** |
| corrigés sur leur sujet | 0 | 5 | **5** |
| gardés (précisés) | 1 | 0 | **1** |
| renommés « Scénario » | 0 | 0 | 0 |
| hors de la règle avant → après | 14 → 0 | 13 → 0 | 27 → 0 |

Échantillon de B2 touché : `objc/lecon-08` (VRAI, gardé) ; `compilation/lecon-13` (INVÉRIFIABLE, remplacé).

## Contrôles (sur `4a30ffd`, cités avec leur code de sortie)

- `node tools/verif-contenu.js --cas-reel --cours=objc` → **0** ; `--cours=compilation` → **0** ;
- `node tools/verif-contenu.js --strict` → **0** (« Toutes les leçons tiennent le standard · 1 maigre(s) » : `os/lecon-04`, hors de ma part) ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b8-objc-compilation d86be7b` → **0 écart** (27 pages) ;
- `node tools/cas-reels/lots/controle-branche.js D:/test-claude-b8-objc-compilation d86be7b` → OK (0 CR, octets identiques hors « Cas réel », types gardés, copie propre) ;
- `node tools/cas-reels/lots/doublons.js` → **2** sources partagées (inchangé, les deux légitimes) ;
- `node tools/verif.js --rapide` → **1** (54 étapes, 47 vertes, 2 696 s ; machine partagée avec trois autres
  `--rapide` d'agents). Les 7 rouges, chacun expliqué :
  - `donnees` : invariant **I18** seul (2 erreurs : `js/search-index.js` divergent du contenu, +2 868 o) —
    toléré, l'orchestrateur régénère ;
  - `doc-ref` et `doc-rec` : « 896 citent la source » introuvable dans `doc/lecon-04` — les lignes de source
    ajoutées font bouger le compteur — tolérés ;
  - `normatf` : un seul contrôle sur 75, « la page cite ce compte (40) — leçons parlant de la
    spécification » : `objc/lecon-12` cite désormais « la spécification d'ARC de Clang » (seul mot
    « spécification » ajouté par la branche), mot que la consigne annonce comme faisant bouger ce
    compteur — à régénérer ; l'ancien encadré de `compilation/lecon-07` nommait « la RFC 8259 », retirée
    (le contrôle des leçons citant une RFC reste vert) ;
  - `etudes` et `etude-6` : la page dérivée `pages/etude-inconnu.html` publie « 39 langages, 10 625 blocs
    de code », la mesure du jour en compte 10 623 (les anciens encadrés `objc/10`, `12` et `13` portaient
    chacun un bloc de code que les nouveaux n'ont plus ; la mesure, qui compte à sa façon, en voit deux de
    moins) — page assemblée, à relancer par l'orchestrateur avec les index
    dérivés ;
  - `caract` : l'enfant `verif-controles.js` lancé par `verif.js` a fini son travail (338 octets écrits,
    CPU 0,4 s) puis ne s'est plus terminé ; arrêté par moi après 36 min (SIGNALE en 2 155 s). Les
    `--rapide` des autres copies sont restés eux aussi 20 à 35 min sur cette étape. Rejoué seul sur la même
    copie : `node tools/verif-controles.js` → **0** en 12 s, « 0 accident(s), 2 emploi(s) voulu(s) ».
  Les 29 étapes du mode `--complet` n'ont pas tourné (consigne : `--rapide` seulement).

## Ce dont j'ai douté

- `objc/lecon-11` : le titre porte 2018, date de mise à jour du *File System Programming Guide* (archivé) ;
  l'événement de 2011 (QA1719, l'attribut « do not back up » d'iOS 5.0.1) aurait été plus parlant, mais
  l'Internet Archive répondait 429 et la page actuelle de QA1719 renvoie vers un article sans date.
- `objc/lecon-14` : « iPhone OS 3.0 » vient de la disponibilité indiquée par la documentation ; la date
  (17 mars 2009) est celle du communiqué qui présente iPhone OS 3.0, qui ne nomme pas Core Data.
- `objc/lecon-07` : Xcode 4.2 n'a pas de date dans les sources ouvertes ; l'année du titre s'appuie sur
  Clang 3.0 (1er décembre 2011), dont le code contient déjà l'avertissement. Le « LLVM Compiler 3.0 »
  d'Apple n'est pas présenté comme la même chose que Clang 3.0.
- `objc/lecon-02` et `12` : « première version dont le code contient » est établi en comparant les tags
  publiés 2.9, 3.0, 3.1 et 3.2 ; que l'avertissement de 3.2 fût actif par défaut n'est pas affirmé (la
  référence actuelle le dit, l'encadré l'écrit au présent).
- `compilation/lecon-04` : N3337 est le projet de travail de janvier 2012 qui suit C++11, pas le texte ISO ;
  l'encadré dit « le projet de norme N3337 » et ne prête la règle à C++11 que par l'essai `-std=c++11`.
- `compilation/lecon-05` : « seules les références arrière… demandent une recherche exponentielle » serre un
  peu le texte de Cox (« les meilleures implémentations connues demandent, au pire, une recherche
  exponentielle… les langages pourraient employer des algorithmes bien plus rapides pour les autres »).
- `compilation/lecon-13` : le commentateur de 2021 a supprimé son compte (« un empaqueteur ») ; le choix du
  code 5 n'est pas présenté comme causé par pytest (un seul commentaire du ticket le suggère).
- `objc/lecon-09` : le lancement de Swift (2 juin 2014) pourrait tenter le cours `swift` (B9) ; le foyer
  proposé est `objc/lecon-09` pour « Swift coexiste avec Objective-C / migration classe par classe ».

## Ouvert, hors encadré (non traité)

- `objc/lecon-01` (corps) : « le préfixe NS (pour « NeXTSTEP ») » ; le guide d'Apple attribue le premier
  emploi du préfixe « NS » à l'API OpenStep publiée en septembre 1994, sans développer le sigle. Pas faux,
  imprécis.
- `objc/lecon-11` (corps) : les exemples de `NSFileManager` passent des chemins en chaîne
  (`fileExistsAtPath:`, `/tmp/…`), alors que le guide d'Apple préfère les URL ; l'encadré le dit
  désormais, le corps n'est pas faux.
- Registre `foyers.md` à compléter par l'orchestrateur avec les 27 sujets ci-dessus (la dernière ligne de
  `b8-reservations.txt` pour `compilation/lecon-03` est json2.js ; ALGOL 60 reste libre).
