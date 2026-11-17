# Rapport V18 — case B11, lot 8 : les cours `tests` et `doc` (copie `b11-tests-doc`, branche `v18/b11-tests-doc`)

Copie de travail `D:\test-claude-b11-tests-doc`, partie de `01795b6`. Part traitée : les **20 « Cas réel »**
des cours `tests` (14, un par leçon) et `doc` (6 : un en leçons 01 et 02, deux en leçons 03 et 04).
Scripts et pièces dans `scratchpad/b11-tests-doc/` (ignoré par git) : `nouveaux-tests.js` (les 14 textes
du cours `tests`), `remplace.js` (remplace du titre de l'encadré à son `</div>` ; refuse un encadré absent,
imbriqué ou un fragment non unique ; refuse tout CR), `diff-doc.js` (ce que `gen.js` change hors des
« Cas réel »), `tests-doc.js` (affirmations techniques du cours `doc` rejouées sous Node 24), `ft/`
(`@sinonjs/fake-timers` 6.0.1, pour `tests/lecon-08`), les PDF et textes des sources ouvertes.

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **11 hors de la règle à 0** pour `tests`
et de **6 à 0** pour `doc` ; sur les 20 cas, **2 VRAIS tels quels** (`tests/12`, `tests/14`), 2 sujets réels
dont le foyer est ailleurs (Ariane 5, Joshua Bloch), 1 sujet réservé par un autre cours du lot (Log4Shell,
`securite/06`), 6 INEXACTS, le reste INVÉRIFIABLE (récits anonymes, usages généraux) ; **8 remplacés**,
**9 corrigés sur leur sujet**, **3 vérifiés** (dont deux avec un lien ou une ambiguïté levée), **0 « Scénario »**.

**Commits** (branche `v18/b11-tests-doc`) : `287d724` (tests, 14 cas), `d21cabc` (doc, 6 cas, pages
régénérées par `gen.js`), puis le commit de ce rapport.

**Consignes de fusion** : régénérer les index dérivés (`search-index.js` périmé : I18) et le point fixe ;
`doc/lecon-04` porte déjà le compteur « 1 166 citent la source » mesuré sur cette copie — il bougera
avec les autres branches du lot, `gen.js` le recalcule ; inscrire au registre les sujets des réservations
`tests/*` et `doc/*` de `b11-reservations.txt` (la dernière ligne de chaque cas fait foi) ; trancher le
statut des cas auto-référents du cours `doc` (voir plus bas).

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div>` du corps (type, icône,
  structure gardés). Le seul intertitre collé, `tests/lecon-13` (`<h2>Cas réel</h2>`), ne dit rien du récit :
  gardé. Pour les deux **sections** du cours `doc` (`<h2>Cas réel : …</h2>`, leçons 01 et 02), l'intertitre
  reçoit l'année et la ligne de source ferme la section, juste avant le `<h2>` suivant.
- **Cours `doc`** : les leçons 01 à 04 sont générées ; chaque retouche est faite dans
  `tools/doc/corps/lN.html`, puis `node tools/doc/gen.js` (code 0) ; les pages portent bien les textes
  (vérifié par `extraction.js` sur `pages/doc/`).
- Forme : titre `Cas réel — sujet (année)` (le cours `doc` garde son séparateur `:`, que la règle admet),
  dernier paragraphe `<p class="cas-reel__source">` daté, lié quand la source est en ligne ; aucun lien dans
  le corps ; `&nbsp;` devant « : ; ? » et dans « ».
- Longueur des corps du cours `tests` (hors titre et source) : 128 à 202 mots (les originaux : 90 à 160).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et URL),
  dans les réservations du lot 7 (`b10-reservations.txt`) et du lot 8 (`b11-reservations.txt`), où les
  20 sujets sont inscrits ; `doublons.js` : 2 sources partagées, les deux légitimes connues (inchangé).
  Écartés en chemin parce que déjà pris : CrowdStrike 2024 (`js/30`), le Zune (`c/16`), Excel et 65 535
  (`js/14`), event-stream (`securite/09`, `offensive/10`), Equifax (`securite/01`), Log4Shell (`securite/06`),
  `java.time` (`java/13`), QuickCheck (`haskell/11`, `erlang/13`).
- **Lexique** : `lexique-diff.js` contre `01795b6` rendait 10 écarts après le premier jet (mots d'options
  sortis : « inaperçu », « quelques », « personne », « monter », « atteint », « devient », « qu'une »,
  « complet » ; entrés : « réserve », « présente ») puis 2 en `doc` (« mauvais » sorti, « connues » entré) :
  chaque mot remis ou retiré dans une phrase exacte de la source → **0 écart**.

## Cours `tests` (14)

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/tests/lecon-01.html#1` | Événement réel, **foyer ailleurs** (Ariane 5 → `ada/lecon-07`) ; « le calculateur plante » était déjà relevé INEXACT au lot 1 (les deux centrales inertielles) | **remplacé** : le vol d'essai orbital de Starliner (horloge de mission synchronisée avant le compte à rebours final, 61 actions dont des tests de bout en bout plus fidèles, 80 recommandations, second vol) | Cas réel — Starliner, le vol d'essai de Boeing (2019) | https://web.archive.org/web/20200328004021/https://blogs.nasa.gov/commercialcrew/2020/03/06/nasa-update-on-orbital-flight-test-independent-review-team/ ; https://web.archive.org/web/20200708181031/https://blogs.nasa.gov/commercialcrew/2020/07/07/nasa-and-boeing-complete-orbital-flight-test-reviews/ (les URL vivantes redirigent vers l'accueil des blogs de la NASA) |
| `pages/tests/lecon-02.html#1` | Événement réel, **INEXACT** : « une infrastructure qui exécute des millions de tests » n'est pas dans la source ; les causes listées (horloge, réseau, ordre) ne sont pas les siennes (concurrence, non-déterminisme, code tiers, infrastructure) | **corrigé** sur la source ; ajout des 84 % de passages au rouge et de la phrase sur les vrais échecs ignorés | Cas réel — les tests instables de Google (2016) | https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html |
| `pages/tests/lecon-03.html#1` | Mixte : Cohn 2009 et le 70/20/10 de Google VRAIS ; les « énormes suites Selenium… repassées de plusieurs heures à quelques minutes » **INVÉRIFIABLES** (anonymes) | **corrigé** : récit refait sur le billet de Cohn (base, couche de services oubliée, sommet minimal) et la réserve de Fowler ; le 70/20/10 part en `lecon-09` avec sa source | Cas réel — la pyramide de Mike Cohn (2009) | https://www.mountaingoatsoftware.com/blog/the-forgotten-layer-of-the-test-automation-pyramid (auteur et date 2009-12-17 dans les métadonnées de la page) ; https://martinfowler.com/bliki/TestPyramid.html |
| `pages/tests/lecon-04.html#1` | Usage général : Beck 2002 réel, mais « dans beaucoup de grands projets, on attend… » **INVÉRIFIABLE** | **remplacé** : le guide des contributeurs de Django 1.8 (test de régression, « should fail before the fix is applied ») ; texte présent au tag `1.8`, absent au tag `1.7`, toujours mot pour mot dans la doc de développement | Cas réel — Django et le test qui échoue avant le correctif (2015) | https://docs.djangoproject.com/en/1.8/internals/contributing/writing-code/submitting-patches/ ; https://docs.djangoproject.com/en/5.2/releases/1.8/ ; https://raw.githubusercontent.com/django/django/1.8/docs/internals/contributing/writing-code/submitting-patches.txt (et `1.7`) ; https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/submitting-patches/ |
| `pages/tests/lecon-05.html#1` | Livre réel, principe VRAI ; « beaucoup d'équipes ont fait ce chemin… » **INVÉRIFIABLE** | **corrigé** sur le chapitre 13 : réel d'abord, fake ensuite (écrit par l'équipe propriétaire), marteau et balancier, tests « détecteurs de changement » | Cas réel — Google et les doublures de test (2020) | https://abseil.io/resources/swe-book/html/ch13.html ; https://abseil.io/resources/swe-book (« In March, 2020, we published… ») |
| `pages/tests/lecon-06.html#1` | Usage général, **INVÉRIFIABLE** (« des équipes imposent… ») | **remplacé** : les bonnes pratiques de couverture de Google (faux sentiment de sécurité, case à cocher, 60/75/90 %, lignes non couvertes en revue) | Cas réel — Google et la couverture de code (2020) | https://testing.googleblog.com/2020/08/code-coverage-best-practices.html |
| `pages/tests/lecon-07.html#1` | Récit anonyme (« une billetterie »), **INVÉRIFIABLE** (B2) | **remplacé** : Comair, Noël 2004, TRACK arrêté à la limite fixe de 32 000 transactions par mois, inconnue de Comair et de SBS ; 25 800 par mois en moyenne, jamais plus de 30 000 ; 1 100 vols annulés le 25 | Cas réel — Comair et la limite des 32 000 transactions (2004) | https://web.archive.org/web/20150908004946/https://www.oig.dot.gov/sites/default/files/sc2005051.pdf (rapport SC-2005-051, lu avec pypdf) |
| `pages/tests/lecon-08.html#1` | Récit anonyme (« une équipe »), **INVÉRIFIABLE** | **remplacé** : Jest 26 « Tick Tock » (faux minuteurs fondés sur `@sinonjs/fake-timers`, qui simulent `Date`), par défaut dans Jest 27. Rejoué avec `@sinonjs/fake-timers` 6.0.1 : `Date` figée, `tick` d'une heure qui passe minuit et déclenche le `setTimeout`, `setSystemTime` | Cas réel — Jest 26 et ses faux minuteurs (2020) | https://jestjs.io/blog/2020/05/05/jest-26 ; https://jestjs.io/blog/2021/05/25/jest-27 ; https://raw.githubusercontent.com/jestjs/jest/main/CHANGELOG_PRE_v30.md (26.0.0 et 27.0.0) |
| `pages/tests/lecon-09.html#1` | Récit anonyme, **INVÉRIFIABLE** | **remplacé** : « Just Say No to More End-to-End Tests » — le portrait **composite** (dit comme tel) d'une stratégie tout-E2E, la boucle de retour, le 70/20/10, le cornet de glace | Cas réel — Google et les tests de bout en bout (2015) | https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html |
| `pages/tests/lecon-10.html#1` | Événement réel, **foyer ailleurs** (Joshua Bloch 2006 → `algo/lecon-03`) | **remplacé** : Mutation Monkey de Facebook (mutations apprises, 15 000 mutants en deux mois, plus de la moitié survivent, 60 à 70 % par règle contre 15 % chez Google, 26 développeurs) | Cas réel — les mutants de Facebook (2020) | https://arxiv.org/abs/2010.13464 ; https://arxiv.org/pdf/2010.13464v3 (lu avec pypdf) |
| `pages/tests/lecon-11.html#1` | Événement réel, **INEXACT** : l'annulation de la vente du 18 novembre et sa citation ne sont pas dans l'explication du 19 novembre que cite la source ; « files d'attente figées » non plus | **corrigé** : 3,5 M d'inscrits, 1,5 M de codes, ventes ralenties et repoussées, 15 % d'interactions en erreur ; lien vers la copie d'archive (le site vivant bloque) | Cas réel — la billetterie de la tournée Eras (2022) | https://web.archive.org/web/20221119040154/https://business.ticketmaster.com/business-solutions/taylor-swift-the-eras-tour-onsale-explained/ (publiée le 2022-11-19T03:17 UTC selon ses métadonnées) |
| `pages/tests/lecon-12.html#1` | Événement réel, **VRAI** (foyer de Mars Climate Orbiter) : perte le 23/9/1999, SM_FORCES, SIS, lbf·s au lieu de N·s, « not caught by the processes in-place » | **vérifié tel quel**, lien ajouté | Cas réel — Mars Climate Orbiter (1999) | https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf (rapport de phase I du MIB, 10/11/1999, lu avec pypdf) |
| `pages/tests/lecon-13.html#1` | Log4Shell sans le nommer (« une bibliothèque de journalisation ») : sujet **réservé** par `securite/lecon-06` ; « trois niveaux plus bas », « corrigé dans la journée », « des semaines à l'aveugle » **INVÉRIFIABLES** | **remplacé** : npm 6 et `npm audit` (rachat de la Node Security Platform, analyse récursive de l'arbre, effet de réseau, `npm audit fix`) | Cas réel — npm audit et l'arbre entier des dépendances (2018) | https://blog.npmjs.org/post/173260195980/announcing-npm6 ; https://blog.npmjs.org/post/173719309445/npm-audit-identify-and-fix-insecure |
| `pages/tests/lecon-14.html#1` | Événement réel, **VRAI** (foyer de Knight Capital), date de l'ordonnance vérifiée (16/10/2013) ; « omet de **le** copier » ambigu (le drapeau ?) | **vérifié**, précisé (« omet de copier ce nouveau code ») ; lien ajouté | Cas réel — Knight Capital (2012) | https://www.sec.gov/litigation/admin/2013/34-70694.pdf (lu avec pypdf) |

## Cours `doc` (6) — des cas auto-référents, gardés

Les six « Cas réel » du cours `doc` racontent la fabrication du cours lui-même (V15, D1 à D4) : c'est sa
méthode depuis sa création (« on ne publie pas ce qu'on croit savoir »), et deux d'entre eux sont des
**sections** dont le corps est la leçon elle-même (tableau de mesures, programme exécuté). Le B2 a classé
`doc/lecon-02` comme événement (INEXACT, pas INVÉRIFIABLE). Ils sont donc **gardés**, chaque affirmation
confrontée à un relevé **daté** du dépôt (message du commit qui publie la leçon, commentaires du code publié
le même jour), corrigés là où ce relevé dit autre chose, et sourcés à ce relevé. ⚠ **À trancher par
l'orchestrateur** : au B4, `js/lecon-42` a été remplacé parce qu'auto-référent ; si la règle vaut aussi pour
le cours `doc`, les deux sections (01, 02) ne se remplacent pas sans réécrire la leçon, et une phrase hors
encadré de la leçon 04 (« le biais raconté juste en dessous ») renvoie au cas n° 2.

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/doc/lecon-01.html#1` (section) | **VRAI** : le relevé est refait par `gen.js` à chaque génération (17 104 titres, 56 à ligature, 0 fragment vide, 0 collision) ; les dix titres et fragments sont la sortie exécutée | **vérifié** ; intertitre daté, ligne de source ajoutée en fin de section | Cas réel : ce que la doc de slugify() annonce, et ce que le site vit vraiment (2026) | `tools/doc/mesures/corpus-slugify.js` (rejoué par `gen.js`) ; `pages/doc/lecon-01.html` générée ; commit `d17c8a2` (renommage en « Cas réel », V15 F1) |
| `pages/doc/lecon-02.html#1` (section) | **INEXACT** (B2) : la citation « Throws a TypeError if s is not a string » est reformulée ; le seul relevé d'époque (commit `785940f`) dit « Thrown if s is not a string », sous `TypeError` ; « qui a coûté deux heures » (titre) sans trace — la faute a été trouvée par la relecture avant publication | **corrigé** : citation exacte, « une relecture l'a signalée avant la publication », titre refait ; `typeof`, objet `String` accepté par `slugify()` et contrôle de `verif-doc.js` rejoués | Cas réel : la ligne de documentation de slugify() qui promettait trop (2026) | `git show 785940f` ; `tools/doc/reference/slugify.txt` ; `tools/doc/verif-doc.js` (l. 110-114) ; `scratchpad/b11-tests-doc/tests-doc.js` |
| `pages/doc/lecon-03.html#1` | **VRAI sur le journal** (11, 4, 2 manquements, 17 annoncés, 0 réel ; `\b` et « côté client ») mais deux relevés du même commit **se contredisent** sur le rang de la rédaction au `\b` (message de `7051fe9` : la troisième ; commentaire de `conformite-quiz.js` : la deuxième) ; « la seule du document » plus fort que la source (« la seule qu'on ne devine pas en lisant les données », parmi les clauses mesurées) ; « pendant des années » sans source | **corrigé** : la rédaction au `\b` n'est plus numérotée, « sans tenir compte de la casse » ajouté (le motif ne voit « côté client » qu'avec le drapeau `i`, rejoué), « des clauses mesurées ici », « pendant des années » retiré | Cas réel : la clause M6, qu'il a fallu écrire trois fois (2026) | `git show 7051fe9` ; `tools/doc/mesures/conformite-quiz.js` (version du commit et actuelle) ; `tools/doc/reference/quiz-format.txt` § 6 ; `tests-doc.js` |
| `pages/doc/lecon-03.html#2` | Fait **VRAI** (96 blocs, garde-fou de `gen.js`) ; **INEXACT mineur** : « et la plupart dans le mauvais sens » — le relevé dit « dont des blocs Node » ; « Personne ne l'aurait vu » et « règle non écrite » sans source | **corrigé** : « dont des programmes Node qui gagneraient, à mauvais escient, un bouton… », « Rien ne le signalait », « une règle du site » | Cas réel : le bouton « Tester » que ce programme avait perdu (2026) | `git show 7051fe9` ; `tools/doc/gen.js` (l. 106-114, 135-141) ; `js/runner.js` (`BROWSER_ONLY`) |
| `pages/doc/lecon-04.html#1` | **VRAI** (commentaire de l'entrée `arguments-slice` et garde-fou de `mesurer()` dans `conseils.js`, publiés avec la leçon ; compte rendu D4) ; « rédigé de mémoire » sans trace ; « elle ne lève donc rien » vrai dans une fonction, faux au niveau global d'un script (ReferenceError, rejoué) | **corrigé** : la phrase sans trace retirée, « Placée dans une autre fonction, comme dans la sonde, elle ne lève donc rien » | Cas réel : la sonde que le garde-fou a refusée (2026) | `tools/doc/reponses/conseils.js` (l. 36-44, 326-333) ; `git show 2d121fa` ; `docs/chantiers/CHANTIER-V15.md` (D4) ; `tests-doc.js` |
| `pages/doc/lecon-04.html#2` | **Auto-attesté** : les chiffres des premières rédactions (48 et 72 caractères, 7,2 mots) n'ont d'autre trace que la page elle-même, identique depuis sa première publication (`2d121fa`) ; le compte rendu D4 confirme seulement l'encadré et ses « 24 caractères » ; « Personne n'aurait vu… » et « la seule façon » trop forts | **gardé, retouché** : la phrase « Personne n'aurait vu ces vingt-quatre caractères à la relecture » retirée, « la seule façon » adouci, « 0,5 » suivi de son unité (mot) | Cas réel : le biais que cette page avait introduit sans le voir (2026) | `git show 2d121fa:tools/doc/corps/l4.html` ; `tools/doc/reponses/affirmations.js` ; `docs/chantiers/CHANTIER-V15.md` (D4) |

**Octets que `gen.js` change hors des encadrés** : sur les cinq pages du cours, un seul paragraphe, dans
`pages/doc/lecon-04.html` : « **1 155** citent la source de leur « Cas réel » » devient « **1 166** » — les
11 nouvelles lignes de source du cours `tests` (le cours `doc` est exclu de son propre corpus). Les autres
compteurs (1 536 leçons, 11 portes, 1 525 sans lien, 17 104 titres…) ne bougent pas ; `cours.html` est
identique à l'octet. C'est attendu ; l'orchestrateur régénère après fusion.

## Décomptes

| | `tests` | `doc` | total |
|---|---:|---:|---:|
| « Cas réel » lus | 14 | 6 | 20 |
| remplacés | 8 | 0 | 8 |
| corrigés (sujet gardé) | 4 | 5 | 9 |
| vérifiés (lien ou ambiguïté au plus) | 2 | 1 | 3 |
| renommés « Scénario » | 0 | 0 | 0 |
| conformes à la règle (avant → après) | 3 → 14 | 0 → 6 | 3 → 20 |

## Contrôles

Joués dans la copie, après le dernier commit de contenu (`d21cabc`) :

| Contrôle | Code | Détail |
|---|---:|---|
| `node tools/verif-contenu.js --cas-reel --cours=tests` | **0** | 14 lus, 14 conformes (3 au départ) |
| `node tools/verif-contenu.js --cas-reel --cours=doc` | **0** | 6 lus, 6 conformes (0 au départ) |
| `node tools/verif-contenu.js --strict` | **0** | toutes les leçons au standard ; site : **1 179** « Cas réel » conformes sur 1 551 (1 162 à `01795b6`) |
| `node tools/verif-html.js` | **0** | aucun problème |
| `node tools/verif-domaines-interdits.js` | **0** | |
| `node tools/verif-qcm-lexique.js` | **0** | |
| `node tools/verif-qcm-biais.js` | **0** | |
| `node tools/cas-reels/lots/lexique-diff.js … 01795b6` | — | **0 écart** sur les 18 pages modifiées |
| `node tools/cas-reels/lots/doublons.js` | — | 2 sources partagées (les deux légitimes connues), inchangé |
| `node tools/doc/gen.js` | **0** | seul changement hors encadrés : « 1 155 » → « 1 166 citent la source » (`doc/lecon-04`) |
| `node tools/doc/verif-doc.js` | **0** | 41/41 |
| `node tools/doc/verif-recherche.js` | **0** | 77/77 |
| `node tools/doc/verif-normatif.js` | **0** | 75/75 |
| `node tools/doc/verif-vocab.js` | 1 | 78/79 : « deprecated reste introuvable ailleurs sur le site — 3 cours ». **Préexistant** : le mot est déjà dans `c/lecon-03`, `kotlin/lecon-18` et `ruby/lecon-19` à `01795b6` (lignes de source des lots précédents) ; aucun de mes textes ne le porte. Étape hors de `--rapide`. |
| `node tools/verif.js --rapide` | 1 | 54 étapes, 856,8 s, **2 signalées** : `donnees` = I18 seul (`search-index.js` périmé, +1 551 o — toléré, l'orchestrateur régénère) ; `etude-5` = **transitoire** : rejouée seule juste après (`node tools/preuves/etude-euclide.js`), code **0**, « fautes : 0 » — étape Chrome sous une machine partagée, page que ce lot ne touche pas. `doc-ref` et `doc-rec` **verts**. |
| fins de ligne | — | 0 CR dans les 18 fichiers modifiés (compté avec node) |

## Ce qui reste ouvert

- **Le cours `doc` est auto-référent** (voir plus haut) : décision de l'orchestrateur.
- `doc/lecon-04#2` repose sur la seule parole de la page (aucun relevé indépendant des premières
  rédactions) : c'est le cas le plus faible de la part.
- `doc/lecon-03#1` : les deux relevés d'époque se contredisent sur le rang de la rédaction au `\b` ; le
  commentaire de `tools/doc/mesures/conformite-quiz.js` (« TROISIÈME RÉDACTION. La deuxième cherchait… »)
  et le message du commit `7051fe9` ne peuvent pas être vrais ensemble — hors encadré, non touché.
- `tests/lecon-08` : le comportement est rejoué sur `@sinonjs/fake-timers` 6.0.1 (la bibliothèque sur
  laquelle Jest 26 fonde ses faux minuteurs), pas sur Jest lui-même (absent de la machine).
- `tests/lecon-10` : l'étude est datée de sa mise en ligne (v1, 26 octobre 2020) ; les chiffres cités sont
  ceux de la version 3 (27 janvier 2021), la seule lue.
- Longueurs : quatre corps du cours `tests` dépassent un peu 180 mots (197 à 202).
