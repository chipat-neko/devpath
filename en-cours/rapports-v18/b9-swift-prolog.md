# Rapport V18 — case B9, lot 6 : les cours `swift` et `prolog` (copie `b9-swift-prolog`, branche `v18/b9-swift-prolog`)

Copie de travail `D:\test-claude-b9-swift-prolog`, partie de `c5b3e9d`. Part traitée : les **32 « Cas réel »**
des cours `swift` (18, un par leçon) et `prolog` (14, un par leçon). Scripts et pièces dans
`scratchpad/b9-swift-prolog/` (ignoré par git) : `cas-swift.js` et `cas-prolog.js` (les 32 titres et corps),
`appliquer.js` (remplace du titre de l'encadré au `</div></div>` final, plus l'intertitre `<h2>` collé quand il
est donné ; refuse un titre absent ou multiple, un CR, un lien hors de la ligne de source, une ligne de source
qui n'est pas en dernier ; prouve que les octets hors des zones remplacées sont identiques ; calcule à l'avance
les mots d'options de QCM qui entreraient dans la page ou en sortiraient), `risques.js` et `options-mot.js`
(mots d'options présents seulement grâce à l'encadré, ou absents de la page), `dump.js`, `godbolt.py`
(Compiler Explorer, swiftc), `swish.py` (SWISH, API Pengines de SWI-Prolog), les essais `t/*`, `pdftxt.py`,
`htmltxt.py`, les propositions Swift Evolution téléchargées (`se/*.md`), les billets swift.org (`blog/*.html`)
et les PDF lus (`lpw1980.pdf`, `birth.pdf`, `milner2.pdf`, `wirth71.pdf`, `bna.pdf`, `clark-neg.pdf`,
`swi2012.pdf`, `swiweb.pdf`, `triska.pdf`).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **18 hors de la règle à 0** pour `swift`
et de **14 à 0** pour `prolog` ; sur les 32 cas trouvés, **aucun n'était conforme ni gardable tel quel** :
2 INEXACTS (Lyft, Watson), 1 INVENTÉ (« Imagine une app… »), 1 sujet VRAI mais gardé ailleurs (Tony Hoare,
foyer `csharp/lecon-08`), 28 INVÉRIFIABLES (usages généraux, récits anonymes, affirmations introuvables) ;
**26 remplacés** par un cas réel daté et sourcé sur la même notion, **6 corrigés sur leur sujet**, **0 gardé tel
quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b9-swift-prolog`) : `23f2474` (swift, 18 cas), `7085b7d` (prolog, 14 cas), puis le
commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`, icône,
  structure gardés), plus **un intertitre** : `swift/lecon-18` (« Cas réel — le squelette des vraies apps » →
  « Cas réel — SwiftData, l'étage suivant »). Les intertitres `<h2>Cas réel</h2>` de `prolog/lecon-05` à `08`
  n'annoncent aucun récit : gardés.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; `<` écrit `&lt;` dans le code.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md` et dans tout `pages/` (noms et URL), puis
  inscrit au fichier commun `b9-reservations.txt` (32 lignes, aucune collision). Sujets **écartés** parce que
  gardés ailleurs : Tony Hoare (`csharp/lecon-08`, que racontait `swift/lecon-02`), le ReDoS (`regex`, cité par
  `prolog/lecon-04`), le R5RS de Scheme (`lisp/lecon-11`, cité par `prolog/lecon-06`), la session WWDC 2019
  « Data Flow Through SwiftUI » (`mobile/lecon-06`), l'annonce de Swift en 2014 (`objc/lecon-09`).
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes, inchangées). Deux sources
  servent deux fois **dans un même cours**, pour deux sujets différents : les actes du Logic Programming
  Workshop de 1980 (Byrd en `prolog/04`, Warren en `prolog/06`) et quelques billets de version de swift.org.
- **Toutes les URL citées ont été ouvertes** (curl, codes 200/206 au dernier passage ; la copie de l'Internet
  Archive de Fast Company répond 200 sous la forme `…fastcompany.com:80/…`, citée telle quelle).
- **Comportements rejoués** :
  - Compiler Explorer, swiftc (x86-64) :
    - `let x: Int! = 5; let y = x; let z = x + 0` → `Optional<Int> Int` ; `let y4: Int = g()` avec `g()` qui
      renvoie `nil` → « Fatal error: Unexpectedly found nil while implicitly unwrapping an Optional value » (5.9) ;
    - `frequencies[c, default: 0] += 1` sur `"how now brown cow"` → `w` = 4 ; `frequencies["z", default: 0]`
      → 0 et `frequencies["z"]` reste `nil` ; `Dictionary(grouping:by:)` (5.9) ; copie d'un dictionnaire
      modifiée sans toucher l'original (5.9) ;
    - trailing closures multiples : « consecutive statements on a line must be separated by ';' » en 5.2,
      compilé et exécuté en 5.3 ;
    - `{ [self] in x += 1 }` dans une classe et `print(x)` implicite dans un `struct` : erreur « requires
      explicit 'self.' » en 5.2, compilé et exécuté en 5.3 ; sans liste de capture, l'erreur reste en 5.9 ;
    - `["1","2","x"].map { Int($0) } == [1, 2, nil]` : « binary operator '==' cannot be applied to two '[Int?]'
      operands » en 4.0.3, compilé en 4.1 (Compiler Explorer ne produit pas d'exécutable pour 4.1), `true` en 5.9 ;
    - `@Clamping(min: 0, max: 255)` de SE-0258 : 300 → 255, −4 → 0 (5.1 et 5.9) ; `CaseIterable` : 4 cas.
  - SWISH (SWI-Prolog 10.1.21, `current_prolog_flag(version, 100121)`) : `n_factorial/2` de Triska → 47!
    exact, `n_factorial(N, 1)` → `[0, 1]` ; la même définition en `is/2` lève `instantiation_error` (contexte
    `(>)/2`) après la réponse `N = 0` ; vue logique : `findall(X, (p(X), assertz(p(99))), L)` → `[1, 2]`,
    puis `p/1` compte quatre clauses.
- **Lexique** : `risques.js` a listé, page par page, les mots d'options que seul l'ancien encadré portait
  (`rattrape`, `jetable`, `promotion`, `éplucher`, `légères`, `systématiques`, `délibérément`, `système`,
  `l'écran`, `empile`, `identique`, `logique`, `propre`, `simple`, `charge`, `retrouve`, `action`, `vérifier`,
  `hasard`, `l'affectation`…) : tous repris dans une phrase exacte du nouveau cas. **Seule exception,
  `swift/lecon-12`** : « source » entre forcément par la classe `cas-reel__source`, et c'était un mot de la
  BONNE réponse (« code source ») de la question product/target, absent de la page : `verif-qcm-lexique` est
  passé à STRICTE 0 % → 100 % sur `swift`. Remède, sans toucher au QCM : les trois distracteurs, qui portaient
  chacun un mot étranger (« distant », « sortent », « notice »), ont reçu ce mot dans une phrase exacte de la
  source (« dépendance … vers un paquet distant », « les résultats de chaque argument sortent à part », « une
  notice de migration, Migrating a test from XCTest »). Cliquet revenu à 0 ; `lexique-diff.js` compte donc
  **4 écarts, tous sur `swift/lecon-12`** (expliqués ici), **0 sur les 31 autres pages**.

## Cas par cas — `swift`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/swift/lecon-01.html#1` | INEXACT — produit nommé : « près de 25 000 lignes », « trois fois moins » (la source dit « moins d'un tiers » de 75 000) ; « plus sûr » absent de la source | corrigé : chiffres de la source, chronologie (septembre 2014, mars 2015, 16 juillet 2015), refonte du parcours d'accueil | Cas réel — Lyft réécrit son app iOS en Swift (2015) | https://web.archive.org/web/20150913204110/http://www.fastcompany.com:80/3050266/tech-forecast/lyft-goes-swift-how-and-why-it-rewrote-its-app-from-scratch-in-apples-new-lang (presse : aucun billet de Lyft trouvé ; lu aussi https://mjtsai.com/blog/2015/09/11/lyft-goes-swift) |
| `pages/swift/lecon-02.html#1` | VRAI (B2) mais foyer ailleurs — Tony Hoare, gardé par `csharp/lecon-08` | remplacé par : SE-0054, fin du type `ImplicitlyUnwrappedOptional` | Cas réel — Swift 4.2 abolit le type ImplicitlyUnwrappedOptional (2018) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0054-abolish-iuo.md ; https://www.swift.org/blog/iuo/ ; https://www.swift.org/blog/swift-4.2-released/ (lu, non cité) ; Compiler Explorer |
| `pages/swift/lecon-03.html#1` | INVENTÉ — « Imagine une app… » | remplacé par : SE-0192, `@unknown default` | Cas réel — SE-0192 et @unknown default (2019) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0192-non-exhaustive-enums.md ; https://www.swift.org/blog/swift-5-released/ |
| `pages/swift/lecon-04.html#1` | INVÉRIFIABLE — usage général (« ouvre n'importe quelle app ») | remplacé par : SE-0279, trailing closures multiples | Cas réel — Swift 5.3 et les trailing closures multiples (2020) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0279-multiple-trailing-closures.md ; https://www.swift.org/blog/swift-5.3-released/ ; Compiler Explorer |
| `pages/swift/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (le panier « copié » en Python ou JS) | remplacé par : SE-0165, subscript `default`, `Dictionary(grouping:by:)` | Cas réel — Swift 4 et les dictionnaires : default et grouping (2017) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0165-dict.md ; https://www.swift.org/blog/swift-4.0-released/ ; Compiler Explorer |
| `pages/swift/lecon-06.html#1` | INVÉRIFIABLE — usage général (vue SwiftUI « recréée des dizaines de fois par seconde », sans source) | remplacé par : SE-0069, Foundation en types valeur | Cas réel — Swift 3 fait de Date, URL et Data des types valeur (2016) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0069-swift-mutability-for-foundation.md ; https://www.swift.org/blog/swift-3.0-released/ |
| `pages/swift/lecon-07.html#1` | INVÉRIFIABLE — usage général (« mantra de la communauté Swift » sans source) | remplacé par : SE-0194, `CaseIterable` | Cas réel — SE-0194 et CaseIterable (2018) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0194-derived-collection-of-enum-cases.md ; https://www.swift.org/blog/swift-4.2-released/ ; Compiler Explorer |
| `pages/swift/lecon-08.html#1` | INVÉRIFIABLE — usage général d'`Identifiable` et de `Codable` | remplacé par : SE-0261, `Identifiable` passe de SwiftUI à la bibliothèque standard | Cas réel — Identifiable passe de SwiftUI à la bibliothèque standard (2019) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0261-identifiable.md ; https://www.swift.org/blog/swift-5.1-released/ |
| `pages/swift/lecon-09.html#1` | INVÉRIFIABLE — usage général (autocomplétion d'Xcode) | remplacé par : SE-0143, conformances conditionnelles | Cas réel — Swift 4.1 et les conformances conditionnelles (2018) | https://www.swift.org/blog/conditional-conformance/ ; https://github.com/swiftlang/swift-evolution/blob/main/proposals/0143-conditional-conformances.md ; https://www.swift.org/blog/swift-4.1-released/ (lu, non cité) ; Compiler Explorer |
| `pages/swift/lecon-10.html#1` | INVÉRIFIABLE — usage général (le cycle d'un `UIViewController`) | remplacé par : SE-0269, `self` explicite et cycles de références | Cas réel — Swift 5.3 et le self explicite des closures (2020) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0269-implicit-self-explicit-capture.md ; https://www.swift.org/blog/swift-5.3-released/ ; Compiler Explorer |
| `pages/swift/lecon-11.html#1` | INVÉRIFIABLE — récit anonyme (« un écran de profil d'une app moderne ») | remplacé par : SE-0296, async/await contre la « pyramide » | Cas réel — Swift 5.5 et async/await (2021) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0296-async-await.md ; https://www.swift.org/blog/swift-5.5-released/ |
| `pages/swift/lecon-12.html#1` | INVÉRIFIABLE — récit anonyme (« sur un projet d'équipe ») | remplacé par : Swift Testing (WWDC24), livré avec Swift 6 | Cas réel — Apple présente Swift Testing (2024) | https://developer.apple.com/videos/play/wwdc2024/10179/ ; https://www.swift.org/blog/announcing-swift-6/ |
| `pages/swift/lecon-13.html#1` | INVÉRIFIABLE — général (filiation React/Flutter/Compose, « quand une équipe migre ») | remplacé par : l'annonce de SwiftUI | Cas réel — Apple dévoile SwiftUI (2019) | https://www.apple.com/newsroom/2019/06/apple-unveils-groundbreaking-new-technologies-for-app-development/ |
| `pages/swift/lecon-14.html#1` | INVÉRIFIABLE (B2, confirmé) — « l'architecture que recommande Apple », « MV » : la session ne nomme aucune architecture | corrigé : sujet gardé (Observation, WWDC23), prétention d'architecture retirée ; SE-0395 et les trois questions de la session | Cas réel — Swift 5.9 et la macro @Observable (2023) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0395-observability.md ; https://developer.apple.com/videos/play/wwdc2023/10149/ ; https://www.swift.org/blog/swift-5.9-released/ (lu, non cité) |
| `pages/swift/lecon-15.html#1` | VRAI en partie — « Codable, arrivé avec Swift 4 en 2017 » exact ; le reste, usage général | corrigé : recentré sur SE-0166 et SE-0167 (`[String: Any]`, SwiftyJSON, ObjectMapper, Argo, `NSCoding`) | Cas réel — Swift 4 et Codable (2017) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0166-swift-archival-serialization.md ; https://github.com/swiftlang/swift-evolution/blob/main/proposals/0167-swift-encoders.md ; https://www.swift.org/blog/swift-4.0-released/ |
| `pages/swift/lecon-16.html#1` | VRAI en partie — « Swift 5 (2019) » exact ; « après des années où chaque projet réinventait le sien » non sourcé | corrigé : motivation de SE-0235 (completion handler de `URLSession`, conflit possible avec des `Result` existants) | Cas réel — Result entre dans la bibliothèque standard (2019) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0235-add-result.md ; https://www.swift.org/blog/swift-5-released/ |
| `pages/swift/lecon-17.html#1` | INVÉRIFIABLE — général (« des milliers de fois par seconde » sans source) | remplacé par : SE-0258, property wrappers (`@Clamping`, `CopyOnWrite`) | Cas réel — SE-0258 et les property wrappers (2019) | https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md ; https://www.swift.org/blog/swift-5.1-released/ ; Compiler Explorer |
| `pages/swift/lecon-18.html#1` | INVÉRIFIABLE — architecture prêtée à Rappels, Notes, Things, Todoist sans source | remplacé par : SwiftData (WWDC23) ; intertitre mis au nouveau cas | Cas réel — Apple présente SwiftData (2023) | https://developer.apple.com/videos/play/wwdc2023/10187/ |

Les propositions ont été lues dans leur texte brut (`raw.githubusercontent.com/swiftlang/swift-evolution/main/proposals/…`),
puis leurs pages `github.com/…/blob/main/…` ouvertes (code 200) : ce sont elles que citent les lignes de source.

## Cas par cas — `prolog`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/prolog/lecon-01.html#1` | INEXACT — événement : Prolog n'écrivait pas « l'analyse grammaticale des questions » (un analyseur produit l'arbre ; Prolog porte les règles qui y repèrent focus, type de réponse, relations) ; « plus lisible que des milliers de lignes impératives » absent | corrigé : faits, règles et motifs d'après les auteurs | Cas réel — IBM Watson et ses règles Prolog (2011) | https://logicprogramming.org/2011/03/natural-language-processing-with-prolog-in-the-ibm-watson-system/ |
| `pages/prolog/lecon-02.html#1` | INVÉRIFIABLE — général (« Vous connaissez peut-être… » de LinkedIn ou Facebook) | remplacé par : les contraintes de Yarn 2 en Prolog, dépréciées dans Yarn 4 | Cas réel — Yarn 2 vérifie ses dépendances en Prolog (2020) | https://dev.to/arcanis/introducing-yarn-2-4eh1 ; https://v3.yarnpkg.com/features/constraints ; https://yarnpkg.com/blog/release/4.0 |
| `pages/prolog/lecon-03.html#1` | INVÉRIFIABLE — général (destructuration JavaScript) | remplacé par : Milner, l'algorithme W et l'unification de Robinson | Cas réel — Robin Milner unifie des types (1978) | https://homepages.inf.ed.ac.uk/wadler/papers/papers-we-love/milner-type-polymorphism.pdf (copie hébergée à Édimbourg : titre, auteur, revue, pages et date vérifiés sur le PDF) |
| `pages/prolog/lecon-04.html#1` | INVÉRIFIABLE — général ; ReDoS, sujet gardé par `regex` | remplacé par : le modèle des boîtes de Byrd (Call, Exit, Redo, Fail) | Cas réel — Lawrence Byrd et les quatre ports du traceur (1980) | https://archive.computerhistory.org/resources/access/text/2022/11/102785624-05-01-acc.pdf (p. 135-143 du PDF) ; https://www.swi-prolog.org/pldoc/man?section=debugoverview |
| `pages/prolog/lecon-05.html#1` | VRAI en partie — « né en 1972 pour le traitement du langage naturel » exact (nom en 1972, version préliminaire fin 1971) ; DCG et jetons : général | remplacé par : les listes du Prolog de 1973 (`*X.*Y`, `ELEMENT`, concaténation linéaire) | Cas réel — les listes du Prolog de Marseille (1973) | http://alain.colmerauer.free.fr/alcol/ArchivesPublications/PrologHistory/19november92.pdf |
| `pages/prolog/lecon-06.html#1` | INVÉRIFIABLE (B2, confirmé) — « la plupart des Prolog » introuvable ; R5RS, sujet gardé par `lisp/lecon-11` | remplacé par : Warren et l'optimisation du dernier appel dans DEC-10 Prolog | Cas réel — David Warren et l'optimisation du dernier appel (1980) | https://archive.computerhistory.org/resources/access/text/2022/11/102785624-05-01-acc.pdf (p. 9-20 du PDF) |
| `pages/prolog/lecon-07.html#1` | INVÉRIFIABLE — général (SQL `NOT IN`, « default deny », systèmes experts) | remplacé par : Clark et la négation par l'échec | Cas réel — Keith Clark et la négation par l'échec (1978) | https://www.doc.ic.ac.uk/~klc/neg.html ; https://www.doc.ic.ac.uk/~klc/NegAsFailure.pdf (scan sans texte : p. 1 lue en image, cité seulement pour le résumé, l'affiliation et l'avantage d'efficacité) |
| `pages/prolog/lecon-08.html#1` | INVÉRIFIABLE — général (emplois du temps, tournées) | remplacé par : Wirth et les huit reines (2<sup>32</sup> candidats, 7 h ; 2<sup>24</sup>, 100 s ; backtracking) | Cas réel — Niklaus Wirth et les huit reines (1971) | https://john.cs.olemiss.edu/~hcc/csci658/notes/localcopy/WirthStepwiseRefinement.pdf (scan de CACM 14(4), p. 221-227 : titre, auteur, date, chiffres vérifiés) |
| `pages/prolog/lecon-09.html#1` | INVÉRIFIABLE — « des compagnies aériennes » avec SICStus introuvable ; prototype d'Erlang non sourcé ; Datalog général | remplacé par : les débuts de SWI-Prolog (Shelley, Quintus, `make/0`, FTP anonyme) | Cas réel — les débuts de SWI-Prolog (années 1980) | https://arxiv.org/abs/1011.5332 ; https://arxiv.org/pdf/1011.5332 |
| `pages/prolog/lecon-10.html#1` | INVÉRIFIABLE — général (Datalog « motorise » des moteurs d'analyse) | remplacé par : le fichier SETOF.PL de Richard O'Keefe (bagof/setof de David Warren) | Cas réel — le SETOF.PL de Richard O'Keefe (1983) | https://history.dcs.ed.ac.uk/archive/languages/prolog/tools/setof.pl ; https://history.dcs.ed.ac.uk/archive/languages/prolog/tools/contents |
| `pages/prolog/lecon-11.html#1` | INVÉRIFIABLE — général (moteur de jeu, système expert, agent) | remplacé par : la vue logique des mises à jour (BSI 1986, Quintus 2.0, ISO 1991) | Cas réel — la vue logique des mises à jour (1986) | https://dtai.cs.kuleuven.be/projects/ALP/newsletter/archive_93_96/net/systems/update.html ; https://www.swi-prolog.org/pldoc/man?section=update ; SWISH |
| `pages/prolog/lecon-12.html#1` | VRAI en partie, non sourcé — la bibliothèque HTTP de SWI-Prolog s'appuie bien sur des DCG ; « nées dans les années 1970 », « souvent plus court » : général | corrigé : sujet gardé, daté et sourcé (`http_header.pl`, `html//1`, SeRQL, 140 règles DCG) | Cas réel — SWI-Prolog lit et écrit HTTP avec des DCG (2007) | https://arxiv.org/abs/0711.0917 ; https://arxiv.org/pdf/0711.0917 |
| `pages/prolog/lecon-13.html#1` | INVÉRIFIABLE — SICStus « en production », OR-Tools, Gecode : rien de sourcé | remplacé par : le solveur CLP(FD) de Triska (entiers non bornés, 7-11, `n_factorial/2`) | Cas réel — Markus Triska et la CLP(FD) de SWI-Prolog (2012) | https://www.metalevel.at/swiclpfd.pdf ; https://www.metalevel.at/swiclpfd.bib ; SWISH |
| `pages/prolog/lecon-14.html#1` | INVÉRIFIABLE — MYCIN « environ 600 règles », XCON « dizaines de millions de dollars par an » : aucune source | remplacé par : le British Nationality Act traduit en Prolog (APES, micro-Prolog) | Cas réel — la loi britannique sur la nationalité en Prolog (1986) | https://www.doc.ic.ac.uk/~rak/papers/British%20Nationality%20Act.pdf (copie de R. Kowalski ; CACM 29(5), mai 1986, p. 370-386 vérifiés sur le PDF) |

## Décomptes

| | swift | prolog | total |
|---|---:|---:|---:|
| « Cas réel » lus | 18 | 14 | **32** |
| VRAI tel quel | 0 | 0 | 0 |
| VRAI mais foyer ailleurs | 1 (`02`, Hoare) | 0 | 1 |
| INEXACT | 1 (`01`) | 1 (`01`) | 2 |
| INVENTÉ | 1 (`03`) | 0 | 1 |
| INVÉRIFIABLE (dont « vrai en partie, non sourcé ») | 15 (2) | 13 (2) | 28 |
| remplacés | 14 | 12 | **26** |
| corrigés sur leur sujet | 4 (`01`, `14`, `15`, `16`) | 2 (`01`, `12`) | **6** |
| gardés tels quels | 0 | 0 | 0 |
| renommés « Scénario » | 0 | 0 | 0 |
| hors de la règle, avant → après | 18 → 0 | 14 → 0 | 32 → 0 |

## Contrôles

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=swift` | **0** (18 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=prolog` | **0** (14 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js … c5b3e9d` | 4 écarts, tous sur `swift/lecon-12` (expliqués plus haut) ; 0 sur les 31 autres pages |
| `node tools/cas-reels/lots/controle-branche.js … c5b3e9d` | OK : 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, signatures, copie propre |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées entre cours (les deux légitimes, inchangées) |
| `node tools/verif.js --rapide` | voir ci-dessous |

`node tools/verif.js --rapide` (lancé **une fois**, à la fin, sur la machine partagée, 457,0 s) : code **1**,
**4 étapes signalées sur 54**, toutes expliquées :

- `donnees` — invariant **I18** seul : `quiz-index.js` (+20 octets) et `search-index.js` (+17 125 octets) sont
  périmés, puisque 32 encadrés ont changé ; l'orchestrateur les régénère après la fusion (toléré).
- `doc-ref` — `tools/doc/verif-doc.js`, section 6 bis : la page du cours `doc` cite « 116 » leçons qui renvoient
  à un document et « 42 » cours concernés ; les lignes de source de ce lot ajoutent des liens (toléré, à
  régénérer).
- `doc-rec` — `tools/doc/verif-recherche.js` : « 981 citent la source » n'est plus le chiffre mesuré, puisque
  32 leçons de plus citent la source de leur cas (toléré, à régénérer).
- `normatf` — `tools/doc/verif-normatif.js`, section 3 bis : « leçons parlant de la spécification », la page cite
  un autre compte que la mesure (40). **Ce lot n'y est pour rien** : rejoué sur les 32 pages modifiées, aucun des
  trois motifs du contrôle (`RFC nnnn`, « la spécification », `MUST`/`SHOULD`) ne change de présence entre
  `c5b3e9d` et la branche ; l'écart vient donc de la base (à régénérer avec les compteurs du cours `doc`).

Les 50 autres étapes jouées sont vertes, dont `qcmlexi`, `qcmbiai`, `domaine`, `vexec` et les rejeux de code.

## Ce qui reste ouvert

- **Fast Company est une source de presse** (`swift/lecon-01`) : aucun billet d'ingénierie de Lyft n'a été trouvé
  sur la réécriture de 2015 ; l'article (Harry McCracken, 10 septembre 2015) est cité par sa copie de l'Internet
  Archive, l'original répondant 403.
- **Copies hébergées par des tiers**, vérifiées sur le document (titre, auteurs, revue, pages, chiffres) : Milner
  (page de Philip Wadler), Wirth (université du Mississippi), le British Nationality Act (page de R. Kowalski),
  Clark (page de l'auteur). Le PDF de Clark est un scan sans texte (paginé 113, sans doute la version de l'atelier
  de Toulouse) : le cas ne s'appuie que sur le résumé de la page de l'auteur et sur la première page.
- **Actes du Logic Programming Workshop de 1980** (Byrd, Warren) : scan de l'OCR parfois illisible ; seuls les
  passages lisibles sont repris (les gains de vitesse de Warren, mal reconnus, ne sont pas cités).
- **Longueur** : plusieurs corps dépassent un peu 180 mots au compteur (le code en ligne compte pour plusieurs
  mots), surtout en `prolog`, dont les anciens encadrés étaient courts (70 à 100 mots).
- **Hors encadré, non traité** : `prolog/lecon-09` dit dans son corps « IBM Watson, à ses débuts, intégrait du
  Prolog pour l'analyse des questions » — le Prolog portait les règles de repérage sur l'arbre d'analyse, pas
  l'analyseur (voir `prolog/lecon-01`).
- **Registre** `foyers.md` : les 32 sujets de ce lot sont à y inscrire à la fusion (`foyers-ajouter.js`) ; sujets
  « célèbres » qu'un autre cours pourrait vouloir : Lyft et Swift (2015), Wirth et les huit reines (1971, foyer
  naturel aussi d'`algo/lecon-18`), Milner et l'algorithme W (1978, `ocaml`/`haskell`), Clark et la négation par
  l'échec (1978), le British Nationality Act (1986), la vue logique des mises à jour (1986).
