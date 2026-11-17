# Rapport V18 — case B10, lot 7 : les cours `cobol` et `markdown` (copie `b10-cobol-markdown`, branche `v18/b10-cobol-markdown`)

Copie de travail `D:\test-claude-b10-cobol-markdown`, partie de `01795b6`. Part traitée : les **25 « Cas réel »**
des cours `cobol` (14, un par leçon) et `markdown` (11, un par leçon). Scripts et pièces dans
`scratchpad/b10-cobol-markdown/` (ignoré par git) : `cas-cobol.js` et `cas-markdown.js` (les 25 titres, corps
et sources), `appliquer.js` (remplace du titre de l'encadré au `</div></div>` final ; refuse un titre absent ou
multiple, refuse tout CR, prouve que les octets hors de l'encadré sont identiques), `preuve-octets.js` (même
preuve, de la base `01795b6` à l'état final), `dump.js`, `texte.js`, `options.js`, `godbolt.py` (compile et
exécute du COBOL sur Compiler Explorer), les essais `t-euro.cbl`, `t-tva.cbl`, `t-ls.cbl`, et les documents
ouverts (PDF, textes extraits, pages de scans du rapport COBOL de 1960 lues en image).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **14 hors de la règle à 0** pour `cobol`
et de **11 à 0** pour `markdown` ; sur les 25 cas trouvés, **0 était VRAI tel quel** : 7 INEXACTS, 18
INVÉRIFIABLES (récits anonymes, usages généraux, chiffres sans source ouverte), 0 INVENTÉ ; **20 remplacés** par
un cas réel daté et sourcé sur la même notion, **5 corrigés sur leur sujet** (`cobol/01`, `cobol/03`,
`cobol/12`, `markdown/07`, `markdown/08`), **0 renommé « Scénario »**.

**Commits** (branche `v18/b10-cobol-markdown`) : `13b1119` (cobol, 14 cas), `fea7592` (markdown, 11 cas),
puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`, icône,
  structure gardés). Les intertitres collés au-dessus (`<h2>Un cas concret</h2>`, `cobol/01` à `09`) sont
  génériques et ne nomment aucun récit : rien à renommer. Aucun intertitre dans `markdown`.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; » et dans « » (les titres anglais cités gardent leur
  ponctuation). Longueur du corps : 132 à 188 mots (les originaux, plus vagues, en faisaient 60 à 130).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md` et dans tout `pages/` (texte et URL),
  puis inscrit au fichier commun `b10-reservations.txt` (25 lignes, aucune reprise par un autre agent).
  Écartés parce que déjà pris : le GO TO de Dijkstra (`EWD215`, au registre), la recherche binaire de Bloch
  (réservée par `algo/lecon-03`), Jekyll et « Blogging Like a Hacker » (`ruby/lecon-22`). Le récit du New
  Jersey était raconté **deux fois** dans `cobol` (01 et 09) : gardé en 01, remplacé en 09 ; le bogue de l'an
  2000 aussi (03 et 11) : gardé en 03 (la notion PICTURE), remplacé en 11. `doublons.js` : toujours **2**
  sources partagées entre cours (les deux légitimes connues).
- **Même document, sujets différents, dans le même cours** : le rapport COBOL d'avril 1960 sert à `cobol/02`
  (format de référence, chapitre VIII) et `cobol/11` (bibliothèques, chapitre IX) ; la norme ANSI X3.23-1985
  à `cobol/05` (EVALUATE, PERFORM en ligne) et `cobol/06` (tables), et pour un point à `cobol/13`.
- **Comportements rejoués** :
  - Compiler Explorer, **GnuCOBOL 3.2** (`gnucobol32`) : 20 francs / 6,55957 = 3,048980 ; `ROUNDED` → 3,05,
    sans `ROUNDED` → 3,04 (`cobol/04`) ; 0,70 × 1,05 en `COMP-3` `ROUNDED` → 0,74, en `COMP-2` → 0,7349999999999998
    puis 0,73 (`cobol/10`) ; Python 3.14 confirme `0.70*1.05` = 0,73499999999999998667… et `round(…, 2)` = 0,73.
  - **GnuCOBOL 3.1 contre 3.2** (`gnucobol31`, `gnucobol32`), une ligne de 25 caractères lue dans un
    enregistrement `LINE SEQUENTIAL` de 10 (`cobol/07`) : 3.1 rend `ABCDEFGHIJ` statut 00 puis la ligne
    suivante ; 3.2 rend trois enregistrements, statuts 06, 06, 00.
  - **markdown-it-py 4.3.0** (roue officielle installée dans le scratchpad, préréglage `commonmark`) :
    « 1. » répété → `<ol>` 1, 2, 3 ; « 3. » puis « 1. » → `<ol start="3">` ; la phrase coupée avant « 14. »
    reste un paragraphe, avant « 1. » elle ouvre une liste (`markdown/02`).
- **Mots d'options de QCM** (`lexique-diff.js`, base `01795b6`) : 18 écarts au premier jet, ramenés à **0**
  (« refusé », « d'arrondi », « conversion », « centime », « proche », « demande », « fonctionne »,
  « plateforme » retirés de mes phrases ; « chaque », « fichier », « contrôle », « guichets », « structure »,
  « autres », « calculé », « retrouver », « unique », « millisecondes » remis dans des phrases exactes de mes
  sources — pour « millisecondes », la phrase du Redbook « VSAM Demystified » sur `ACCESS MODE IS DYNAMIC`, qui
  éclaire aussi l'`ACCESS MODE` de la leçon). Cliquets QCM verts.

## Cas par cas — `cobol`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/cobol/lecon-01.html#1` | INEXACT en partie — événement réel (New Jersey, avril 2020), mais « personne n'était disponible » et « appel public urgent » absents de la transcription ; raconté aussi en `cobol/09` | corrigé sur son sujet, sur la transcription officielle : 362 000 demandes en deux semaines, +1 600 % la première semaine, « mainframes de 40 ans » (le commissaire), la page de volontaires COBOL et les « postmortems » (le gouverneur), la transcription qui écrit « Cobalt » | Cas réel — le New Jersey cherche des programmeurs COBOL (2020) | https://web.archive.org/web/20200408090928/https://www.nj.gov/governor/news/news/562020/approved/20200404b.shtml (l'original sur nj.gov répond 404 ; copie trouvée par l'index CDX de l'Internet Archive) |
| `pages/cobol/lecon-02.html#1` | INEXACT — « les colonnes 73 à 80 servaient à numéroter les cartes » : en COBOL, le numéro de séquence occupe les **six premières positions** dès le rapport de 1960 ; récit général des cartes perforées sans source | remplacé par : le format de référence du rapport COBOL d'avril 1960 (6 positions de séquence, marges A et B en 8 et 12, « the number of spaces is critical », trois divisions seulement) | Cas réel — le format de référence du premier rapport COBOL (1960) | https://ftp.mirrorservice.org/sites/www.bitsavers.org/pdf/codasyl/COBOL_Report_Apr60.pdf (scan : couverture « Department of Defense, April 1960 », page de titre, avant-propos, I-1, I-2, II-1, VIII-1, VIII-2, IX-1, IX-2 lues en image) |
| `pages/cobol/lecon-03.html#1` | INEXACT (verdict de B2, confirmé) — « la remédiation a consisté, pour l'essentiel, à repasser ces champs en PIC 9(4) » : environ 80 % des ordinateurs corrigés en 1999 ont pris le fenêtrage ; « plus de 300 milliards » sans source ouverte | corrigé sur son sujet (gardé ici, foyer de la notion PICTURE) : la cause selon le GAO (1997), la conversion longue des bases, le fenêtrage, ses 80 %, les parcmètres de New York en janvier 2020 ; le coût retiré | Cas réel — le bogue de l'an 2000, corrigé à moitié (2020) | https://web.archive.org/web/20240715220803/https://www.gao.gov/assets/aimd-10.1.14.pdf (gao.gov refuse le téléchargement direct) ; https://www.newscientist.com/article/2229238-a-lazy-fix-20-years-ago-means-the-y2k-bug-is-taking-down-computers-now/ (presse : aucune source primaire du chiffre de 80 % n'a été trouvée) |
| `pages/cobol/lecon-04.html#1` | INVÉRIFIABLE au primaire — Bourse de Vancouver 1982-1983 : l'article du Wall Street Journal (8 novembre 1983) est payant ; les sources secondaires ouvertes ne s'accordent pas (une note de R. W. Floyd de 1985 donne d'autres valeurs) | remplacé par : le règlement (CE) 1103/97 (taux à six chiffres significatifs, ni arrondis ni tronqués ; arrondi au cent le plus proche, la moitié vers le haut) et le taux du franc (règlement 2866/98) ; essai `ROUNDED` | Cas réel — l'euro et ses règles pour arrondir (1997) | https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:31997R1103 ; https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:31998R2866 ; Compiler Explorer (GnuCOBOL 3.2) |
| `pages/cobol/lecon-05.html#1` | INVÉRIFIABLE — usage général (« chaque nuit, les banques… », « au cœur de la finance mondiale ») | remplacé par : la liste des nouveautés d'ANSI X3.23-1985 (EVALUATE, PERFORM en ligne et END-PERFORM, TEST AFTER, END-IF, SET … TO TRUE) | Cas réel — COBOL 85 ajoute EVALUATE et le PERFORM en ligne (1985) | https://nvlpubs.nist.gov/nistpubs/Legacy/FIPS/fipspub21-2.pdf (FIPS PUB 21-2 = texte d'ANSI X3.23-1985, « Approved September 10, 1985 » ; chapitre XVII 2.1, points 52, 69, 82, 83, 95 ; règle 6.13.1 d'EVALUATE) |
| `pages/cobol/lecon-06.html#1` | INVÉRIFIABLE — illustration générale (table de paie et `SEARCH ALL`, « quelques secondes ou plusieurs minutes ») | remplacé par : les changements de tables de COBOL 85 (sept dimensions au lieu de trois, `VALUE` sous `OCCURS`, indices relatifs, indices et index mêlés, `OCCURS DEPENDING ON` à zéro, `RECORD VARYING`) | Cas réel — COBOL 85 élargit les tables (1985) | https://nvlpubs.nist.gov/nistpubs/Legacy/FIPS/fipspub21-2.pdf (chapitre XVII 2.1, points 10, 11, 12, 38, 41, 46) |
| `pages/cobol/lecon-07.html#1` | INVÉRIFIABLE — usage général (banques, remises SEPA, « 40 millions d'écritures d'une nuit ») | remplacé par : GnuCOBOL 3.2 et les lignes trop longues des fichiers `LINE SEQUENTIAL` (coupe et statut 00 avant, plusieurs enregistrements et statut 06 depuis) ; essai 3.1 contre 3.2 | Cas réel — GnuCOBOL 3.2 et la ligne trop longue (2023) | https://sourceforge.net/p/gnucobol/code/HEAD/tree/tags/gnucobol-3.2/NEWS?format=raw (« GnuCOBOL 3.2 (20230728) ») ; Compiler Explorer (GnuCOBOL 3.1 et 3.2) |
| `pages/cobol/lecon-08.html#1` | INVÉRIFIABLE — usage général (« fenêtre batch » des banques, « finir à 4 h ou à 9 h ») | remplacé par : l'incident de juin 2012 chez NatWest et Ulster Bank (ordonnanceur mis à jour le 17, retour en arrière incompatible le 19, batchs d'Ulster Bank en retard de plus d'un jour le 21, 6,5 millions de clients, retour à la normale le 10 juillet, amende de 42 M£) | Cas réel — les batchs en retard de NatWest et d'Ulster Bank (2012) | https://www.fca.org.uk/publication/final-notices/rbs-natwest-ulster-final-notice.pdf (avis final daté du 19 novembre 2014, § 1.1, 2.1-2.9, 4.5-4.15) |
| `pages/cobol/lecon-09.html#1` | INEXACT en partie et doublon — même récit du New Jersey qu'en `cobol/01` ; « presque plus personne ne savait le faire évoluer » et « plusieurs autres États » sans source | remplacé par : le rapport GAO-16-468 (75 % du budget informatique fédéral 2015 en exploitation et maintenance ; Title II de la SSA, 162 sous-systèmes dont certains en COBOL, retraités réembauchés, remplacement progressif) | Cas réel — la Social Security et ses 162 sous-systèmes (2016) | https://www.gao.gov/products/gao-16-468 ; texte intégral lu dans https://web.archive.org/web/20210506230534/https://www.gao.gov/assets/gao-16-468.pdf (gao.gov refuse le téléchargement direct ; un résumé automatique disait « 162 subsystems written in COBOL », le rapport dit « some are still written in COBOL ») |
| `pages/cobol/lecon-10.html#1` | INVÉRIFIABLE — chiffres attribués à Reuters (2017), non ouverts, et statistique d'usage plutôt que cas sur le décimal ; « instructions packed decimal du silicium IBM z » non sourcé | remplacé par : l'exemple de Cowlishaw (taxe de 5 % sur 0,70 $ : 0,73 en binaire, 0,74 en décimal) et l'enquête sur 456 420 colonnes numériques ; essai COMP-3 contre COMP-2 | Cas réel — Mike Cowlishaw et le centime du binaire (2003) | https://speleotrove.com/decimal/IEEE-cowlishaw-arith16.pdf (pied de page : « Proceedings of the 16th IEEE Symposium on Computer Arithmetic (ARITH'03) ») ; Compiler Explorer (GnuCOBOL 3.2) |
| `pages/cobol/lecon-11.html#1` | INVÉRIFIABLE et doublon — le bogue de l'an 2000 « si coûteux à cause des copybooks » : affirmation sans source ; sujet gardé en `cobol/03` | remplacé par : la section « Libraries » du rapport de 1960 (COPY dans ENVIRONMENT et DATA, INCLUDE avec REPLACING pour les procédures, « same effect as if the programmer had written » le texte) | Cas réel — la bibliothèque du premier rapport COBOL (1960) | https://ftp.mirrorservice.org/sites/www.bitsavers.org/pdf/codasyl/COBOL_Report_Apr60.pdf (page IX-1 lue en image) |
| `pages/cobol/lecon-12.html#1` | INVÉRIFIABLE en partie — VSAM réel, mais « apparu en 1973 » non confirmé (le guide de planification d'IBM date de juillet 1972 ; le Redbook dit « early 1970s ») ; « l'écrasante majorité des données transactionnelles des banques » et « quelques millisecondes » sans source | corrigé sur son sujet : le guide IBM de juillet 1972 (fichier à clé, index et espace libre, réorganisation rarement nécessaire, accès direct ou séquentiel, COBOL par l'interface ISAM) et le Redbook de 2022 sur `ACCESS MODE IS DYNAMIC` | Cas réel — IBM présente VSAM et ses fichiers à clé (1972) | https://ftp.mirrorservice.org/sites/www.bitsavers.org/pdf/ibm/370/OS_VS2/Release_1_1972/GC26-3799-0_OS_VS_Virtual_Storage_Access_Method_VSAM_Planning_Guide_Jul72.pdf (« First Edition (July 1972) ») ; https://www.redbooks.ibm.com/redbooks/pdfs/sg246105.pdf (SG24-6105-02, § 1.1 et 4.4.15) |
| `pages/cobol/lecon-13.html#1` | INVÉRIFIABLE — usage général (fichiers plats des banques, « une bonne part du COBOL de production ») | remplacé par : le supplément ANSI X3.23a-1989 (FIPS PUB 21-3), module des fonctions intrinsèques (UPPER-CASE, LOWER-CASE, REVERSE, LENGTH, NUMVAL) ; INSPECT CONVERTING né en 1985 | Cas réel — COBOL reçoit ses fonctions intrinsèques (1989) | https://nvlpubs.nist.gov/nistpubs/Legacy/FIPS/fipspub21-3.pdf (« Approved September 13, 1989 », avant-propos, § 2.22, 2.29, 2.44) ; https://nvlpubs.nist.gov/nistpubs/Legacy/FIPS/fipspub21-2.pdf (point 76) |
| `pages/cobol/lecon-14.html#1` | INVÉRIFIABLE — usage général (« arrêté de journée » des banques) | remplacé par : le FISCAM du GAO, révision de septembre 2024 (BP.01.01.02, totaux de contrôle comparés entre entrée et sortie ; BP.01.01.03, contrôle de séquence) | Cas réel — le manuel d'audit du GAO et les totaux de contrôle (2024) | https://web.archive.org/web/20240905185206/https://www.gao.gov/assets/gao-24-107026.pdf (lettre d'envoi datée de septembre 2024, « supersedes the 2009 revision ») ; révision de 2009 consultée : https://web.archive.org/web/20210330084326/https://www.gao.gov/assets/gao-09-232g.pdf |

## Cas par cas — `markdown`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/markdown/lecon-01.html#1` | INEXACT (verdict de B2, confirmé) — le dépôt torvalds/linux n'a pas de `README.md` : l'API GitHub répond `name: README` | remplacé par : l'annonce de Markdown par John Gruber (15 mars 2004) et le but de lisibilité de sa page de projet (Markdown 1.0.1, 17 décembre 2004) | Cas réel — John Gruber présente Markdown (2004) | https://daringfireball.net/2004/03/introducing_markdown ; https://daringfireball.net/projects/markdown/ ; https://api.github.com/repos/torvalds/linux/readme (vérification) |
| `pages/markdown/lecon-02.html#1` | INVÉRIFIABLE — récit fictif à la deuxième personne (« Tu rédiges une procédure… ») | remplacé par : la règle du numéro de départ et la règle « seule une liste qui commence à 1 coupe un paragraphe » de CommonMark 0.26 ; essai markdown-it-py | Cas réel — CommonMark et les numéros d'une liste (2016) | https://spec.commonmark.org/0.26/ (« Version 0.26 (2016-07-15) », section 5.3) ; https://spec.commonmark.org/changelog.txt (entrée 0.26) ; markdown-it-py 4.3.0 |
| `pages/markdown/lecon-03.html#1` | INVÉRIFIABLE — usage général (captures dans les pull requests, Markdown d'image « généré » par GitHub) | remplacé par : accessibility-alt-text-bot (GitHub, 12 juin 2023) et le texte alternatif par défaut = nom du fichier | Cas réel — GitHub et le robot du texte alternatif (2023) | https://github.blog/developer-skills/github/make-your-github-projects-more-accessible-with-accessibility-alt-text-bot/ ; https://github.com/github/accessibility-alt-text-bot (README) |
| `pages/markdown/lecon-04.html#1` | INVÉRIFIABLE — usage général (Stack Overflow, issues, « obtient des réponses plus vite ») | remplacé par : la demande de blocs délimités sur Meta Stack Exchange (9 mars 2012) et la réponse « Code fences work now » de balpha, membre de l'équipe (8 janvier 2019) | Cas réel — Stack Exchange adopte les blocs de code délimités (2019) | https://web.archive.org/web/20231203052937/https://meta.stackexchange.com/questions/125148/implement-style-fenced-markdown-code-blocks (la page vivante est derrière un défi Cloudflare) ; questions et réponses lues aussi par l'API officielle api.stackexchange.com (réponse 322000) |
| `pages/markdown/lecon-05.html#1` | INVÉRIFIABLE — « beaucoup d'équipes bloquent la fusion », avancement « 3/5 » en tête de PR : sans source ni date | remplacé par : l'arrivée des listes de tâches dans le GFM (9 janvier 2013) et leur extension à tous les documents Markdown (28 avril 2014) | Cas réel — GitHub ajoute les listes de tâches (2013) | https://github.blog/news-insights/product-news/task-lists-in-gfm-issues-pulls-comments/ ; https://github.blog/news-insights/product-news/task-lists-in-all-markdown-documents/ |
| `pages/markdown/lecon-06.html#1` | INVÉRIFIABLE — « les projets populaires l'ouvrent presque tous par des badges », « beaucoup décident en lisant le README » | remplacé par : l'étude de Prana, Treude et al. (393 dépôts, 4 226 sections ; What 97 %, How 88,5 %, Why 25,7 %, When 21,4 % ; 20 professionnels) | Cas réel — ce que contiennent les README de GitHub (2018) | https://arxiv.org/abs/1802.06997 ; https://arxiv.org/pdf/1802.06997v2 (tableau 3) |
| `pages/markdown/lecon-07.html#1` | INEXACT en partie — date juste (2021), mais « dépôts, issues, discussions » : le changelog dit « any Markdown field », et la doc les exclut des wikis ; « la plupart des générateurs » et « Wikipédia repose entièrement » sans source | corrigé sur son sujet : changelog du 30 septembre 2021, rendu en exposant et section en bas, limite des wikis | Cas réel — GitHub accepte les notes de bas de page (2021) | https://github.blog/changelog/2021-09-30-footnotes-now-supported-in-markdown-fields/ ; https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax |
| `pages/markdown/lecon-08.html#1` | INVÉRIFIABLE en partie — date juste (2022), mais « GitLab, Jupyter, Obsidian et Notion font de même » et « standard de fait » sans source | corrigé sur son sujet : annonce du 19 mai 2022 (huit ans de demandes, `$` et `$$`, MathJax), fin de l'astuce des images par API, lieux de rendu selon la doc | Cas réel — GitHub affiche les maths en Markdown (2022) | https://github.blog/news-insights/product-news/math-support-in-markdown/ ; https://github.blog/changelog/2022-05-19-render-mathematical-expressions-in-markdown/ ; https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/writing-mathematical-expressions |
| `pages/markdown/lecon-09.html#1` | INEXACT — « la doc de React tourne sous Docusaurus » : react.dev est une application Next.js ; « des millions de sites via GitHub Pages + Jekyll » sans source | remplacé par : « Introducing Docusaurus » (Joel Marcey, 14 décembre 2017) : la fin du gabarit Jekyll recopié, le Markdown et ses métadonnées | Cas réel — Facebook présente Docusaurus (2017) | https://docusaurus.io/blog/2017/12/14/introducing-docusaurus ; vérification : https://raw.githubusercontent.com/reactjs/react.dev/main/README.md et …/package.json (`"next": "15.1.12"`) |
| `pages/markdown/lecon-10.html#1` | INVÉRIFIABLE — usage général (« dans le monde académique, beaucoup rédigent… ») | remplacé par : JOSS (lancé en mai 2016, 111 articles la première année) et sa chaîne Markdown → Pandoc → PDF et JATS | Cas réel — JOSS, une revue écrite en Markdown (2016) | https://joss.readthedocs.io/en/latest/paper.html ; https://arxiv.org/abs/1707.02264 et https://arxiv.org/pdf/1707.02264 |
| `pages/markdown/lecon-11.html#1` | INVÉRIFIABLE — fonctions réelles de GitHub mais sans date ni source (lien CONTRIBUTING, « Community Standards ») | remplacé par : l'annonce du 17 septembre 2012 (lien vers CONTRIBUTING à la création d'une issue ou d'une PR) et celle du 17 février 2016 (modèles, dossier `.github/`) | Cas réel — GitHub met en avant le fichier CONTRIBUTING (2012) | https://github.blog/news-insights/the-library/contributing-guidelines/ ; https://github.blog/developer-skills/github/issue-and-pull-request-templates/ |

## Décomptes

| | cobol | markdown | total |
|---|---:|---:|---:|
| « Cas réel » lus | 14 | 11 | **25** |
| VRAI tel quel | 0 | 0 | 0 |
| INEXACT | 4 (01, 02, 03, 09) | 3 (01, 07, 09) | 7 |
| INVÉRIFIABLE (dont « en partie ») | 10 | 8 | 18 |
| INVENTÉ | 0 | 0 | 0 |
| vérifiés tels quels | 0 | 0 | 0 |
| corrigés sur leur sujet | 3 (01, 03, 12) | 2 (07, 08) | 5 |
| remplacés | 11 | 9 | **20** |
| renommés « Scénario » | 0 | 0 | 0 |
| hors de la règle avant → après | 14 → 0 | 11 → 0 | 25 → 0 |

(`markdown/02` — un « tu » fictif — est compté INVÉRIFIABLE : il ne se présente pas comme un fait daté.)

## Contrôles (sur l'état commité)

- `node tools/verif-contenu.js --cas-reel --cours=cobol` → **0** (14 lus, 14 conformes) ;
  `--cours=markdown` → **0** (11 lus, 11 conformes).
- `node tools/verif-contenu.js --strict` → **0**.
- `node tools/verif-html.js` → **0**.
- `node tools/verif-domaines-interdits.js` → **0**.
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**.
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b10-cobol-markdown 01795b6` → **0 écart**.
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées entre cours (les deux légitimes connues).
- 0 CR dans les 25 pages ; `preuve-octets.js` : 25 pages, **0 octet changé hors des encadrés** par rapport à
  `01795b6`.
- `node tools/verif.js --rapide` → **code 1**, 50/54 étapes vertes en 1 009,5 s (machine partagée) ; les
  quatre qui signalent sont attendues et régénérées par l'orchestrateur après la fusion :
  - `donnees` : seul l'invariant **I18** (`search-index.js` périmé, +3 314 octets à la régénération) ;
  - `doc-ref` : « la page de cours cite le nombre de leçons qui renvoient à un document = 123 » (les
    lignes de source font monter le compte) ;
  - `doc-rec` : « 1 180 citent la source » introuvable dans la page (même cause) ;
  - `normatf` : « la page cite ce compte (45) — leçons parlant de la spécification » (le mot
    « spécification » entre par `markdown/02`, CommonMark ; toléré par la consigne).
  Aucun autre rouge.

## Où j'ai douté

- `cobol/01` : la transcription officielle écrit « Cobalt » (mot mal entendu) ; le cas le dit, entre
  parenthèses. La page de nj.gov a disparu (404) : seule la copie de l'Internet Archive du 8 avril 2020 est
  citée.
- `cobol/03` : le chiffre de 80 % vient de la presse (New Scientist, qui le donne comme estimation) ; aucune
  source primaire de la répartition des méthodes n'a été trouvée (même constat qu'en B2). La cause, elle, est
  sourcée au GAO (1997).
- `cobol/02` : « les positions 8 et 12 » est déduit du schéma du rapport (6 positions de séquence, 1 vide, puis
  4 positions de A à B) ; le rapport parle de « positions », pas de colonnes de carte, et ne fixe pas de marge
  droite (« déterminée par la largeur du papier ») : le cas ne parle donc ni de cartes perforées ni de la
  colonne 72.
- `cobol/05` et `cobol/06` : « la norme de 1974 n'en prévoyait aucun » / « ne le permettait pas » s'appuie
  sur la liste des changements de 1985 (« new features ») ; des compilateurs ont pu offrir ces outils plus tôt
  en extension (le cas ne dit pas le contraire).
- `cobol/12` : « Aujourd'hui, le Redbook… » : la troisième édition date de mars 2013, mise à jour en août
  2022 ; la phrase sur `ACCESS MODE IS DYNAMIC` et l'`ACCBIAS` est au § 4.4.15.
- `cobol/14` : un manuel d'audit, pas un incident ; choisi faute d'un incident bancaire documenté par une
  source primaire où des totaux de contrôle auraient joué (RBS 2012 est déjà en `cobol/08`).
- `markdown/04` : balpha est marqué « Staff » sur la copie de 2023 de la page ; l'API ne donne que son profil.
- Phrases de liaison à la leçon, qui viennent du cours et non des sources : la dernière phrase de `cobol/01`,
  `04`, `08`, `09`, `10`, `11`, `12`, `14` et de `markdown/01`, `03`, `04`, `07`, `08`, `09`, `10`, `11`.

## Ce qui reste ouvert

- **Hors encadré, non corrigé** (consigne : ne toucher qu'aux « Cas réel ») : `cobol/lecon-01` et
  `cobol/cours.html` affirment que « des centaines de milliards de lignes de COBOL sont encore en production »,
  sans source.
- `cobol/lecon-02` (corps) parle d'un format « hérité des cartes perforées » ; le rapport de 1960 décrit un
  format de page de listing (marge droite selon le papier) : imprécision possible, à relire en B13.
- Les essais Compiler Explorer sont cités sans lien permanent (l'API de compilation ne crée pas de lien
  court) ; les fichiers d'essai sont dans `scratchpad/b10-cobol-markdown/`.
