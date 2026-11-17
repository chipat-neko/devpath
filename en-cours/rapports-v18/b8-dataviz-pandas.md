# Rapport V18 — case B8 (lot 5) : les « Cas réel » des cours `dataviz` et `pandas`

Copie de travail `D:\test-claude-b8-dataviz-pandas`, branche `v18/b8-dataviz-pandas`, partie de `d86be7b`.
Scripts dans `scratchpad/b8-dataviz-pandas/` de la copie (ignoré par git) : `extraire.js` (lit chaque
encadré et l'intertitre collé), `contenu.js` (le texte exact des 28 nouveaux encadrés), `appliquer.js`
(remplace le seul segment titre + récit + source de l'encadré, vérifie que le préfixe et le suffixe de la
page sont identiques à l'octet et qu'aucun CR n'entre), `options.js` (options de QCM touchées par
`lexique-diff.js`), `test_pandas3.py` et `test_jhu.py` (essais pandas), les PDF lus avec `pypdf`, et
pandas 3.1.1 + PyArrow 26.0.1 installés par `pip install --target scratchpad/b8-dataviz-pandas/py`
(roues officielles de PyPI).

## 1. Bilan

| cours | « Cas réel » | VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié tel quel | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `dataviz` | 14 | 0 | 2 | 5 | 7 | 0 | 1 | 13 | 0 |
| `pandas` | 14 | 0 | 0 | 7 | 7 | 0 | 0 | 14 | 0 |
| **total** | **28** | **0** | **2** | **12** | **14** | **0** | **1** | **27** | **0** |

**Les INVENTÉS** sont les exemples fictifs des deux cours racontés comme réels : la ville fictive de
Belleville (commission des sports, service logement, service urbanisme, mobilité, magasins
« Belleville-Gare » et quartier des « Coteaux ») dans sept encadrés de `dataviz`, et la librairie fictive
du fil rouge de `pandas` dans sept encadrés (« l'équipe de la librairie », « la responsable de la
librairie »…). B2 avait classé `pandas/lecon-12` INVÉRIFIABLE (usage général) ; la règle des lots 2 à 4
(« l'exemple fictif du cours raconté comme réel est INVENTÉ ») le classe ici INVENTÉ. Les messages de
commit résument ces 26 récits comme « anonymes ou fictifs » ; le classement exact est celui de ce tableau.

**Les deux INEXACTS** sont les deux seuls sujets réels trouvés, tous deux dans `dataviz` :
- `dataviz/lecon-09` : le graphique des impôts de Fox — daté « 2015 » alors qu'il a été diffusé par Fox
  Business (émission *Cavuto*) le 31 juillet 2012 (Media Matters, 31 juillet 2012) ; « près de cinq
  fois » pour un rapport de 5,6 (39,6 − 34 contre 35 − 34) ; « le graphique corrigé, largement partagé »
  sans source. La source primaire (l'émission) est introuvable, la seule trace est Media Matters, un
  observatoire militant : **remplacé** par un cas à source primaire sur la même notion (l'axe tronqué
  d'un tweet du ministère britannique de l'Éducation, relevé par l'autorité de la statistique).
- `dataviz/lecon-14` : le graphique de Planned Parenthood (2015) — décrit avec des « barres » alors que
  ce sont deux flèches qui se croisent ; « un nombre six fois plus petit » alors qu'en 2013 les dépistages
  et services de prévention étaient **trois** fois plus nombreux que les avortements (PolitiFact) ; « la
  correction a circulé plus largement que l'original » sans source. **Corrigé** : audition du
  29 septembre 2015 (transcription officielle), deux axes non indiqués, rapport de trois, graphique
  redessiné par PolitiFact.

**Méthode.** Chaque affirmation a été confrontée à une source **ouverte** (WebFetch, `curl`, API
GitHub et Crossref, PDF lus avec `pypdf`). Quand une page refusait l'accès, la copie citée est une copie
ouverte et identifiée : l'avis de retrait du *Lancet* sur PubMed Central (le site du *Lancet* répond
403), l'article de Wickham (2010) sur le site de l'auteur, celui de Heer et Agrawala (2006) sur le site
de Heer à l'université de Washington, l'article de Correll et al. sur arXiv (le DOI ACM répond 403 ; la
date et la revue, *Proceedings of the 2020 CHI Conference*, 21 avril 2020, viennent de l'API Crossref),
le chapitre 7 du rapport du CAIB sur le stockage de la NASA. L'Internet Archive refuse les requêtes
automatiques depuis cette machine (« suspected abusive bot traffic ») : rien n'y a été lu.

**Comportements rejoués** avec pandas 3.1.1 : `pd.Series(["a", "b"])` a le type `str`, y affecter
l'entier 1 lève `TypeError: Invalid value '1' for dtype 'str'` ; `read_csv` d'une colonne « 1 234,50 »
donne `str` ; `df[masque]["b"] = 0` laisse le tableau intact et émet `ChainedAssignmentError`,
`df.loc[masque, "b"] = 0` le modifie, `pd.errors.SettingWithCopyWarning` n'existe plus ;
`pd.to_datetime(['13-01-2000', '12-01-2000'])` donne le 13 puis le 12 janvier ; `resample("M")` lève
« 'M' is no longer supported for offsets. Please use 'ME' instead » ; `rank` sur 52,70 / 52,70 / 52,99
donne 1, 1, 3 (`min`), 1, 1, 2 (`dense`), 1,5, 1,5, 3 (`average`, le défaut) ;
`df["year"] - df.groupby("id")["year"].transform("min") + 1` calcule l'année de carrière ; l'addition de
deux `Series` aux étiquettes différentes aligne sur les noms et met `NaN` ailleurs ; le CSV réel
`time_series_covid19_confirmed_global.csv` du dépôt de Johns Hopkins fait 289 lignes × 1 147 colonnes
(4 d'identité + 1 143 dates, du 1/22/20 au 3/9/23) et son `melt` 330 327 lignes.

**Les sujets.** Les 28 sujets sont réservés dans
`D:\test-claude\scratchpad\v18-parallele\b8-reservations.txt` (lignes `dataviz/` et `pandas/`), relus
après écriture : aucun pris par un autre agent. Aucun n'est au registre `foyers.md` ; leurs noms et URL
ne sont racontés nulle part ailleurs dans `pages/` (`grep` des noms propres et des URL) ; `doublons.js`
reste à 2 sources partagées (les deux légitimes, d'avant ce lot). Écartés : les gènes renommés par
Excel (`python/lecon-02`) et Reinhart-Rogoff (`python/lecon-22`), Challenger (`r/lecon-10`), la
Datasaurus Dozen (`stats/lecon-09`), The Tail at Scale (`stats/lecon-04`), le passage de matplotlib de
`jet` à `viridis` (`python/lecon-23`), Berkeley 1973 (corps de `stats/lecon-14`), la Bourse de Vancouver
(`cobol/lecon-04`), le bbplot de la BBC (`r/lecon-07`), Public Health England et Excel
(`data-eng/lecon-01`), Parquet chez AWS (`data-eng/lecon-04` ; d'où, pour `pandas/lecon-13`, la fin de
`xlwt` plutôt que l'annonce d'Apache Parquet), Anscombe et Cleveland & McGill (déjà dans les corps de
`dataviz/lecon-01`), et des candidats sans source primaire ouvrable (l'article de l'*Economist*
« Mistakes, we've drawn a few », Medium inaccessible ; Messerli et le chocolat, NEJM en 403 ; la ferme
du Kansas de MaxMind, presse seulement ; le billet de Twitter sur Parquet 1.0, Cloudflare).

**Les intertitres collés.** Les 28 encadrés sont sous un `<h2>Cas réel</h2>` générique, qui ne nomme
aucun récit : gardés tels quels.

**Sources de presse** (le primaire n'était pas ouvrable) : `dataviz/lecon-14` cite PolitiFact pour la
description du graphique (l'image d'Americans United for Life n'a pas été ouverte ; la transcription de
l'audition, elle, est primaire) ; `pandas/lecon-07` cite NBC Sports pour la médaille de bronze de
Sarah Sjöström (olympics.com ne répond pas depuis cette machine ; l'égalité en or vient du Comité
olympique canadien). `pandas/lecon-08` cite le *RISKS Digest* (témoignage d'une informaticienne de la
FU Berlin deux jours après l'élection), pas les résultats officiels du Land.

## 2. Cas par cas — `dataviz`

Nature : *événement*, *produit* (produit nommé), *anonyme* (récit sans sujet identifiable), *général*
(usage général présenté comme un cas), *fictif* (exemple du cours raconté comme réel).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/dataviz/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« une équipe produit », API à 180 ms en moyenne, deux bosses) | remplacé par : Gelman, Pasarica et Dodhia redessinent en graphiques les tableaux d'un numéro du JASA (72 figures, 60 tableaux, sept exemples) | Cas réel — Gelman, Pasarica et Dodhia changent des tableaux en graphiques (2002) | http://www.stat.columbia.edu/~gelman/research/published/dodhia.pdf (PDF lu) |
| `pages/dataviz/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« une équipe data d'une collectivité », temps divisé par trois) | remplacé par : la grammaire en couches de ggplot2 ; le camembert = barre empilée en coordonnées polaires, `coord_polar(theta = "y")` | Cas réel — Hadley Wickham et la grammaire « en couches » de ggplot2 (2010) | https://vita.had.co.nz/papers/layered-grammar.pdf (PDF lu) |
| `pages/dataviz/lecon-03.html#1` | INVÉRIFIABLE (B2), anonyme (« le service culturel d'une ville », camembert par année) | remplacé par : le Visual Vocabulary du FT, neuf familles de relations, la courbe « façon standard » d'une série temporelle, la mise en garde sur le camembert | Cas réel — le « Visual Vocabulary » du Financial Times (2016) | https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary ; https://raw.githubusercontent.com/Financial-Times/chart-doctor/main/visual-vocabulary/README.md ; affiches EN et FR (PDF lus) ; historique des commits (API GitHub : `add-visual-vocabulary`, 15 août 2016) |
| `pages/dataviz/lecon-04.html#1` | INVENTÉ, fictif (« une enseigne de vingt-deux magasins », magasins « Belleville-Gare » et « Coteaux-Nord ») | remplacé par : Correll, Bertini et Franconeri, l'axe tronqué grossit la gravité perçue, même avec axe cassé ou dégradé, même en faisant lire les valeurs ; les auteurs refusent un zéro obligatoire partout | Cas réel — « Truncating the Y-Axis: Threat or Menace? », Correll, Bertini et Franconeri (2020) | https://arxiv.org/pdf/1907.02035 (PDF lu) ; https://api.crossref.org/works/10.1145/3313831.3376222 (revue et date) |
| `pages/dataviz/lecon-05.html#1` | INVENTÉ, fictif (la commission des sports de Belleville, piscine de 8 100 à 7 400 entrées) | remplacé par : le CO2 de Mauna Loa en ratio 1,17 et 7,87 (banking to 45°), puis le multi-scale banking | Cas réel — le dioxyde de carbone de Mauna Loa et le « banking » de Heer et Agrawala (2006) | https://homes.cs.washington.edu/~jheer/files/2006-Banking-InfoVis.pdf (PDF lu) |
| `pages/dataviz/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« une équipe surveille son API », 90 ms / 600 ms) | remplacé par : Weissgerber et al., 703 articles de physiologie, 85,6 % avec un diagramme en barres, figure 1 (quatre jeux, une même paire de barres) | Cas réel — « Beyond Bar and Line Graphs », Weissgerber et ses coauteurs (2015) | https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1002128 (et le texte intégral XML de PLOS) |
| `pages/dataviz/lecon-07.html#1` | INVENTÉ, fictif (le service logement de Belleville, quartier des Docks) | remplacé par : les bulles de Hans Rosling (pays, population, enfants par femme, espérance de vie, 1962 → aujourd'hui) | Cas réel — les bulles de Hans Rosling à la conférence TED (2006) | https://www.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen/transcript (transcription et durée 19 min 36 s dans les métadonnées de la page) |
| `pages/dataviz/lecon-08.html#1` | INVENTÉ, fictif (« un service mobilité », le vélo « aux Coteaux », quartier de Belleville) | remplacé par : Shneiderman invente le treemap pour un disque de 80 Mo partagé par 14 utilisateurs ; rapport mars 1991, ACM TOG janvier 1992 | Cas réel — Ben Shneiderman invente le treemap pour un disque plein (1990) | https://www.cs.umd.edu/hcil/treemap-history/ |
| `pages/dataviz/lecon-09.html#1` | INEXACT, événement (Fox Business 2012 daté 2015, « près de cinq fois » pour 5,6, correction « largement partagée » sans source ; primaire introuvable) | remplacé par : le tweet du DfE (28 septembre 2018) et les lettres de l'UK Statistics Authority et de l'OSR (8 octobre 2018) : axe tronqué, valeur nominale, pas par élève ; réponse du secrétaire permanent | Cas réel — le tweet du ministère britannique de l'Éducation sur le financement des écoles (2018) | https://uksa.statisticsauthority.gov.uk/wp-content/uploads/2018/10/20181008_Sir_David_Norgrove_letter_to_SoS_for-_Education.pdf ; https://osr.statisticsauthority.gov.uk/wp-content/uploads/sites/3/2018/10/Education-statistics-Ed-Humpherson-to-Neil-McIvor-20181008.pdf ; https://osr.statisticsauthority.gov.uk/wp-content/uploads/sites/3/2018/10/Education-statistics-Jonathan-Slater-to-Ed-Humpherson-20181008-.pdf (PDF lus) ; pour le verdict sur l'ancien cas : https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition |
| `pages/dataviz/lecon-10.html#1` | INVENTÉ, fictif (le service urbanisme de Belleville, un élu daltonien) | remplacé par : Crameri, Shephard et Heron, jet contre batlow (portrait de Marie Skłodowska-Curie), daltonisme simulé, 0,5 % des femmes et 8 % des hommes | Cas réel — « The misuse of colour in science communication », Crameri, Shephard et Heron (2020) | https://www.nature.com/articles/s41467-020-19160-7.pdf (PDF lu) ; date de publication (28 octobre 2020) lue dans les métadonnées de https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7595127/ |
| `pages/dataviz/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« une équipe d'astronomie », millions d'étoiles en hexbin) + INVENTÉ, fictif (les 2 000 trajets de Belleville) | remplacé par : Gaia DR2, diagrammes HR en cartes de densité (racine carrée), 65 921 112 et 4 276 690 étoiles, séquence des naines blanches dédoublée | Cas réel — les diagrammes de Hertzsprung-Russell de Gaia (2018) | https://arxiv.org/pdf/1804.09378 (PDF lu) |
| `pages/dataviz/lecon-12.html#1` | INVÉRIFIABLE, général (« quantité de cartes de la Covid », « beaucoup de rédactions ont dû republier ») | remplacé par : le bulletin de l'ONS du 1er mai 2020, carte en taux standardisés sur l'âge, Newham 144,3 pour 100 000 ; nombres seulement pour des MSOA de population comparable | Cas réel — l'ONS cartographie les décès du Covid-19 en taux, pas en nombres (2020) | https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/deaths/bulletins/deathsinvolvingcovid19bylocalareasanddeprivation/deathsoccurringbetween1marchand17april |
| `pages/dataviz/lecon-13.html#1` | INVENTÉ, fictif (le service des sports de Belleville, « +38 % en juillet », la DSI de la ville) | remplacé par : la diapositive de l'équipe d'évaluation des débris de Columbia, analysée par Tufte dans le rapport du CAIB (six niveaux de hiérarchie, titre trompeur, 640 fois / 400 fois) | Cas réel — la diapositive de l'équipe d'évaluation des débris de Columbia (2003) | https://s3.amazonaws.com/akamai.netstorage/anon.nasa-global/CAIB/CAIB_lowres_chapter7.pdf (PDF lu ; copie concordante sur globalsecurity.org) |
| `pages/dataviz/lecon-14.html#1` | INEXACT, événement (des « barres » au lieu de flèches ; « six fois plus petit » au lieu de trois ; correction « plus largement » diffusée sans source) | corrigé : audition du 29 septembre 2015, flèches de 2006 à 2013, les mots de Chaffetz (rose, rouge ; −53 % des dépistages entre 2005 et 2013), Americans United for Life, graphique à deux axes non indiqués, rapport de trois en 2013, redessin de PolitiFact | Cas réel — le graphique sans axes de l'audition de Planned Parenthood (2015) | https://www.govinfo.gov/content/pkg/CHRG-114hhrg26029/html/CHRG-114hhrg26029.htm ; https://www.politifact.com/factchecks/2015/oct/01/jason-chaffetz/chart-shown-planned-parenthood-hearing-misleading-/ (presse) |

## 3. Cas par cas — `pandas`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/pandas/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« une équipe e-commerce », `shape`, `dtypes`) | remplacé par : McKinney présente pandas à SciPy 2010 (tableaux structurés de NumPy, `data.frame` de R, `Index`, alignement automatique, union des étiquettes) ; début chez AQR en 2008 | Cas réel — Wes McKinney présente pandas à la conférence SciPy (2010) | https://proceedings.scipy.org/articles/Majora-92bf1922-00a (et son PDF, lu) ; https://pandas.pydata.org/about/index.html ; essai pandas 3.1.1 |
| `pages/pandas/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« une analyste marketing », 4 120 lignes, 8 % d'e-mails manquants) | remplacé par : l'étude Surgisphere du *Lancet* (96 032 patients), la lettre ouverte de 201 signataires (données australiennes, africaines, variances trop faibles), le retrait du 5 juin 2020 | Cas réel — l'étude Surgisphere retirée du Lancet (2020) | https://zenodo.org/records/3871094 (et le PDF de la lettre, lu ; API Zenodo pour la date et les 201 signataires) ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7274621/ (avis de retrait) ; métadonnées PubMed 32450107 et 32511943 |
| `pages/pandas/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« un analyste », « une chaîne de librairies », mémoire « de plus de moitié ») | remplacé par : pandas 3.0 et le type `str` par défaut (PDEP-14) ; défauts d'`object` selon les notes de version | Cas réel — pandas 3.0 donne au texte son propre type, str (2026) | https://pandas.pydata.org/docs/whatsnew/v3.0.0.html ; essai pandas 3.1.1 |
| `pages/pandas/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« une équipe data », code postal rempli par 0) | remplacé par : pandas 1.0 introduit `pd.NA` (expérimental), entiers nullables, propagation dans les comparaisons, logique à trois valeurs | Cas réel — pandas 1.0 introduit pd.NA, une seule marque pour le manquant (2020) | https://pandas.pydata.org/docs/whatsnew/v1.0.0.html |
| `pages/pandas/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« une équipe support d'une boutique en ligne », `loc` sur C1023) | remplacé par : pandas 3.0 et le Copy-on-Write (PDEP-7) : l'affectation enchaînée ne marche plus, `SettingWithCopyWarning` supprimé, `ChainedAssignmentError`, `df.loc[...]` | Cas réel — pandas 3.0 généralise le Copy-on-Write : l'affectation enchaînée ne marche plus (2026) | https://pandas.pydata.org/docs/whatsnew/v3.0.0.html ; https://pandas.pydata.org/docs/user_guide/migration.html ; essai pandas 3.1.1 |
| `pages/pandas/lecon-06.html#1` | INVENTÉ, fictif (« un analyste marketing de la librairie ») | remplacé par : la PEP 335 (Gregory Ewing, 2004) et son rejet par Guido van Rossum (13 mars 2012) : pourquoi `&`, `|`, `~` et les parenthèses | Cas réel — la PEP 335 rejetée, ou pourquoi les masques se combinent avec &, \| et ~ (2012) | https://peps.python.org/pep-0335/ ; https://mail.python.org/pipermail/python-dev/2012-March/117510.html |
| `pages/pandas/lecon-07.html#1` | INVENTÉ, fictif (« l'équipe de la librairie », Top 5, rang `dense`) | remplacé par : les deux médailles d'or d'Oleksiak et Manuel à Rio (52,70), le bronze de Sjöström : la numérotation 1, 1, 3 de `rank(method="min")` | Cas réel — deux médailles d'or ex aequo au 100 m nage libre de Rio (2016) | https://olympic.ca/2016/08/12/i-never-thought-id-win-a-gold-oleksiak-celebrates-sharing-olympic-podium/ ; https://www.nbcsports.com/olympics/news/team-usas-simone-manuel-canadas-penny-oleksiak-tie-for-gold-in-100-free (presse) ; essai pandas 3.1.1 |
| `pages/pandas/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« une équipe fusionne les commandes de deux boutiques ») | remplacé par : l'élection du Schleswig-Holstein du 5 avril 1992, 4,97 % affichés 5 %, majorité d'un siège | Cas réel — un arrondi change la majorité au parlement du Schleswig-Holstein (1992) | https://catless.ncl.ac.uk/Risks/13/37 |
| `pages/pandas/lecon-09.html#1` | INVENTÉ, fictif (« l'équipe commerciale de la librairie ») | remplacé par : Wickham et le split-apply-combine (plyr), l'année de carrière des joueurs de baseball par `transform` ; l'équivalent pandas rejoué | Cas réel — Hadley Wickham et le « split-apply-combine » (2011) | https://www.jstatsoft.org/article/view/v040i01 (et le PDF de l'article, lu) ; essai pandas 3.1.1 |
| `pages/pandas/lecon-10.html#1` | INVENTÉ, fictif (« la responsable de la librairie », comptable et marketing) | remplacé par : les séries Covid-19 du CSSE de Johns Hopkins en format large (une colonne par jour) et leur `melt` | Cas réel — les séries Covid-19 de l'université Johns Hopkins, en format large (2020) | https://github.com/CSSEGISandData/COVID-19 ; https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series (README) ; le CSV lui-même ; essai pandas 3.1.1 |
| `pages/pandas/lecon-11.html#1` | INVENTÉ, fictif (« le service commercial de la librairie ») | remplacé par : le ticket n° 16270 de Nick Eubank, la demande de fusion n° 16275, `validate` livré dans pandas 0.21.0 | Cas réel — l'argument validate de pd.merge, proposé par Nick Eubank (2017) | https://github.com/pandas-dev/pandas/issues/16270 (et API GitHub : commentaires, chronologie, PR 16275) ; https://pandas.pydata.org/docs/whatsnew/v0.21.0.html |
| `pages/pandas/lecon-12.html#1` | INVENTÉ, fictif (la librairie ; INVÉRIFIABLE selon B2) | remplacé par : pandas 2.0 applique à la colonne le format de la première valeur non manquante (`'13-01-2000', '12-01-2000'`), `format="mixed"` | Cas réel — pandas 2.0 lit toutes les dates d'une colonne au même format (2023) | https://pandas.pydata.org/docs/whatsnew/v2.0.0.html ; essai pandas 3.1.1 |
| `pages/pandas/lecon-13.html#1` | INVENTÉ, fictif (« fin de mois à la librairie ») | remplacé par : pandas 1.2.0, `xlwt` n'est plus maintenu, `xlrd` ne lit plus que les `.xls`, écrire les `.xlsx` avec `openpyxl` | Cas réel — pandas 1.2 tourne la page de xlwt : écrire les .xlsx avec openpyxl (2020) | https://pandas.pydata.org/docs/whatsnew/v1.2.0.html |
| `pages/pandas/lecon-14.html#1` | INVÉRIFIABLE, anonyme (« dans une PME de e-commerce, une analyste… ») | remplacé par : « The Tennis Racket » de BuzzFeed News et la BBC, méthode et carnet pandas publiés (26 000 matchs, 25 993 retenus, 39 joueurs, un million de simulations par joueur, aucun nom publié) | Cas réel — « The Tennis Racket », l'enquête de BuzzFeed News publiée avec son code pandas (2016) | https://github.com/BuzzFeedNews/2016-01-tennis-betting-analysis (README, API GitHub, carnet `notebooks/tennis-analysis.ipynb` lu) |

## 4. Points à signaler

- **`lexique-diff.js` : 26 écarts au premier jet, 0 à la fin.** Les anciens récits portaient des mots
  de distracteurs de QCM que les nouveaux n'avaient plus (« unités », « refait », « trompeur »,
  « presque », « graphique », « autant », « instantanément », « entièrement », « moitié », « partant »
  en `dataviz` ; « échouer », « chiffre », « lancer », « fiable », « moitié », « afficher », « portent »,
  « ferait », « laisse », « automatiquement », « quelques » en `pandas`), et quelques mots en entraient
  (« toutes », « ranger », « change », « qu'une », « rappelle »). Chaque mot sorti est revenu dans une
  phrase exacte (par exemple « presque » par la durée de la vidéo de Rosling, 19 min 36 s ; « moitié »
  par les 53 % annoncés par Chaffetz ; « ferait » par l'équivalent pandas du calcul de Wickham) ; chaque
  mot entré a été reformulé. Aucun QCM touché.
- **Hors encadré, non traité — les deux cours `pandas` sont écrits pour pandas 2 sans le dire.**
  pandas 3.0 (21 janvier 2026) range le texte en `str` et non plus en `object` : les corps de
  `pandas/lecon-01`, `-02`, `-03`, `-05`, `-07` et `-12` affichent `dtype: object` ou parlent d'une
  colonne de texte « en `object` » (une trentaine d'occurrences), et `pandas/lecon-01` montre
  `pd.__version__` = '2.2.1'. pandas 3.0 supprime aussi le `SettingWithCopyWarning`, que les corps de
  `pandas/lecon-05` (10 mentions) et `-06` (5 mentions) enseignent encore — le Copy-on-Write lève
  désormais `ChainedAssignmentError`. Les nouveaux encadrés de `pandas/lecon-03` et `-05` racontent
  ces changements ; les corps restent à dater (« pandas 2.x ») ou à mettre à jour (phase E ?).
- **`pandas/lecon-12`** dit déjà « Depuis pandas 2.2, 'ME'/'YE' remplacent les anciens » : juste
  (pandas 3.1.1 refuse `resample("M")`).
- Les comportements de pandas cités dans les encadrés ont été rejoués avec la 3.1.1, la version
  installable aujourd'hui ; les exemples historiques (`['13-01-2000', '12-01-2000']` avant 2.0,
  `df["foo"][...] = 100` avant 3.0) viennent des notes de version et du guide de migration.

## 5. Contrôles avant le dernier commit

(codes de sortie relevés sur la copie, après les deux commits de contenu)

- `node tools/verif-contenu.js --cas-reel --cours=dataviz` → **0** (14/14 conformes)
- `node tools/verif-contenu.js --cas-reel --cours=pandas` → **0** (14/14 conformes)
- `node tools/verif-contenu.js --strict` → **0**
- `node tools/verif-html.js` → **0**
- `node tools/verif-domaines-interdits.js` → **0**
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b8-dataviz-pandas d86be7b` → **0 écart**
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées (les deux légitimes, d'avant ce lot)
- 0 CR dans les 28 pages ; octets hors encadré identiques (contrôlé par `appliquer.js` à chaque passe)
- `node tools/verif.js --rapide` → **code 1**, 51 étapes OK sur 54, trois SIGNALÉES :
  - `donnees` : seulement l'invariant **I18** (`search-index.js` périmé, +4 505 octets à la
    régénération) — toléré, l'orchestrateur régénère après la fusion ;
  - `doc-rec` : « 897 citent la source » introuvable dans `pages/doc/` — le compte des leçons qui
    citent leur source monte avec ce lot — toléré, l'orchestrateur régénère ;
  - `caract` : **pas un défaut du contenu**. Le sous-processus `verif-controles.js` lancé par
    `verif.js` est resté bloqué (0,45 s de processeur en 25 minutes ; même blocage au même moment chez
    le `verif-controles.js` de la copie `objc-compilation`, sur une machine chargée par quatre
    `verif.js --rapide` simultanés) ; je l'ai arrêté au bout de 1 493,7 s, d'où « SIGNALÉ ». Relancé
    seul sur la même copie : **code 0** en 15 s, « 0 accident(s), 2 emploi(s) voulu(s) ».

## 6. Décomptes

28 « Cas réel » lus (14 + 14) ; 0 VRAI, 2 INEXACT, 12 INVÉRIFIABLE, 14 INVENTÉ ; 27 remplacés,
1 corrigé, 0 vérifié tel quel, 0 « Scénario ». Conformes à la règle dans les deux cours : 0 → 28.
