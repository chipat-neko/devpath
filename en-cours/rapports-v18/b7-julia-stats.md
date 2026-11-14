# Rapport V18 — case B7 (lot 4) : les « Cas réel » des cours `julia` et `stats`

Copie de travail `D:\test-claude-b7-julia-stats`, branche `v18/b7-julia-stats`, partie de `13eabe3`.
Scripts dans `scratchpad/b7-julia-stats/` de la copie (ignoré par git) : `dump.js` (lecture des cas et
de l'intertitre collé), `appliquer.js` (remplace le titre et le corps du seul encadré visé, vérifie que
le préfixe et le suffixe de la page sont identiques à l'octet et qu'aucun CR n'entre), `spec-stats.js`
et `spec-julia.js` (le texte exact de chaque nouvel encadré), `essais.jl` et `portee.jl` (essais Julia),
les PDF lus avec `pypdf` dans `pdf/`, et Julia 1.11.7 portable officiel (archive de julialang-s3) dans
`outils/jl/`.

## 1. Bilan

| cours | « Cas réel » | VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié tel quel | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `julia` | 16 | 1 | 3 | 12 | 0 | 0 | 3 | 13 | 0 |
| `stats` | 15 | 0 | 2 | 8 | 5 | 0 | 2 | 13 | 0 |
| **total** | **31** | **1** | **5** | **20** | **5** | **0** | **5** | **26** | **0** |

Les 5 INVENTÉS sont tous dans `stats` : Orbit, l'application fictive du fil rouge du cours, racontée
comme une entreprise réelle (03, 05, 06, 09, 11 ; `stats/lecon-05` relevé en B2). Orbit apparaissait
encore en morale de `stats/lecon-13` et en comparaison dans `stats/lecon-14` : retiré des deux. Dans
`julia`, `lecon-10` racontait la même histoire que `lecon-01` (la Fed de New York) : doublon interne,
remplacé. Le seul VRAI, `julia/lecon-12` (JuMP), était juste pour JuMP mais sans source ni date (Turing.jl et
DifferentialEquations.jl y étaient cités sans vérification) : il est corrigé, recentré sur l'article
des auteurs de JuMP.

**Méthode.** Chaque affirmation a été confrontée à une source **ouverte** (WebFetch, `curl`,
`gh api`, PDF lus avec `pypdf`). Quand une page refusait l'accès (Cloudflare, Anubis, 403), la copie
citée est une copie ouverte et identifiée : le rapport Sturgis lu sur la copie liée par le dépôt
institutionnel de la LSE, l'essai de Gould sur le site de statistique de Berkeley, la note de Daniels
sur l'Internet Archive (scan DTIC), la version des auteurs de l'article de *Science* (Edinburgh
Research Explorer). Les comportements de Julia ont été **rejoués** avec Julia 1.11.7 portable :
`typemax(Int64) + 1 == typemin(Int64)` ; la somme `Int64` des deux sorties du bloc Bitcoin 74638
(9 223 372 036 854 277 039 × 2) donne `-997538`, `Base.Checked.checked_add` lève `OverflowError`,
`BigInt` donne 18 446 744 073 708 554 078 ; `sum(valeur, Produit[])` lève `ArgumentError`
(« reducing over an empty collection is not allowed; consider supplying `init` to the reducer »),
`sum(…; init = 0.0)` renvoie `0.0`, `maximum(Int[]; init = -1)` renvoie `-1` ; la boucle
`s = 0; for i = 1:10; s = s + i; end` dans un **fichier** affiche l'avertissement de portée douce puis
`UndefVarError` ; modifier un champ de `struct` lève une erreur, celui d'un `mutable struct` passe ;
`2 .* v.^2 .+ 6 .* v.^3 == @. 2v^2 + 6v^3`. Les probabilités de la loi normale de `stats/lecon-06`
(3σ : 0,135 % soit 1 jour sur 741 ; 25σ : 1,31 × 10^135 années de 250 jours) et
1 − 0,99^100 = 0,634 (`stats/lecon-04`) ont été recalculées en Python.

**Les sujets.** Les 31 sujets sont réservés dans
`D:\test-claude\scratchpad\v18-parallele\b7-reservations.txt` (lignes `julia/` et `stats/`) ; aucun n'est
au registre `foyers.md` ; leurs noms et URL ne sont racontés nulle part ailleurs dans `pages/` (`grep`
des noms propres, titres et URL) ; `doublons.js` reste à 2 sources partagées (les deux légitimes,
d'avant ce lot). Écartés : le salaire médian de l'Insee (pris par `r/lecon-08`), la Bourse de Vancouver
(`cobol/lecon-04`), le bug d'affichage d'Excel 2007 (`js/lecon-14`), le Patriot de Dhahran
(`asm/lecon-09`), Dynamo d'Amazon (raconté par `nosql`), le Literary Digest, Berkeley 1973, Wald et
Anscombe (déjà dans les corps des leçons `stats`), et Hubble 1929 (réservé puis rendu : la règle ne
reconnaît que les années 1950 à 2039, voir § 4).

**Les intertitres collés.** Les 15 encadrés `stats` sont sous un `<h2>Cas réel</h2>` et 9 encadrés
`julia` sous un `<h2>Un cas réel</h2>` : intertitres génériques, qui ne nomment aucun récit, gardés.

## 2. Cas par cas — `julia`

Nature : *événement*, *produit* (produit nommé), *anonyme* (récit sans sujet identifiable), *général*
(usage général présenté comme un cas).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/julia/lecon-01.html#1` | INEXACT, événement : « un code lisible par les économistes (pas besoin de le réécrire en C) » absent de la source ; pas de chiffre | corrigé : réécriture depuis MATLAB, raisons données (gratuit, performances « comme C ou Fortran »), estimation ~10× plus rapide, gensys ~6×, réserve des auteurs, QuantEcon, DSGE.jl | Cas réel — La Fed de New York passe son modèle DSGE à Julia (2015) | https://libertystreeteconomics.newyorkfed.org/2015/12/the-frbny-dsge-model-meets-julia |
| `pages/julia/lecon-02.html#1` | INEXACT (B2), général : `BigFloat` présenté comme type exact pour l'argent | remplacé par : le débordement d'entier de Bitcoin, bloc 74638 ; overflow Julia rejoué | Cas réel — Le débordement d'entier de Bitcoin (2010) | https://en.bitcoin.it/wiki/Value_overflow_incident ; https://bitcointalk.org/index.php?topic=822.0 ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2010-5139 (la page NVD ne s'affiche pas sans JavaScript ; l'API officielle donne la fiche) ; https://docs.julialang.org/en/v1/manual/integers-and-floating-point-numbers/ ; essai Julia 1.11.7 |
| `pages/julia/lecon-03.html#1` | INVÉRIFIABLE, général (filtrer des températures par compréhension) | remplacé par : Julia 1.5 rend la portée douce aux boucles du REPL | Cas réel — Julia 1.5 et la boucle for au REPL (2020) | https://julialang.org/blog/2020/08/julia-1.5-highlights/ ; essai Julia 1.11.7 (fichier) |
| `pages/julia/lecon-04.html#1` | INVÉRIFIABLE, général (pipeline charger → nettoyer → agréger) | remplacé par : Julia 0.5, `map(x->2x, v)` 22 fois plus lent en 0.4, aussi rapide en 0.5 | Cas réel — Julia 0.5 rend les fonctions anonymes rapides (2016) | https://julialang.org/blog/2016/10/julia-0.5-highlights/ |
| `pages/julia/lecon-05.html#1` | INVÉRIFIABLE, général (traitement d'images, finance ; « le broadcasting a inspiré des bibliothèques bien au-delà de Julia » sans source) | remplacé par : « More Dots », la fusion syntaxique des boucles de Julia 0.6 | Cas réel — « More Dots » : la fusion des points dans Julia 0.6 (2017) | https://julialang.org/blog/2017/01/moredots/ |
| `pages/julia/lecon-06.html#1` | INVÉRIFIABLE, général (une particule dans une simulation ; « exactement ainsi que DifferentialEquations.jl… ») | remplacé par : le ticket n° 19157 de Jeff Bezanson et le passage à `struct` / `mutable struct` dans Julia 0.6 ; avantages de l'immuabilité selon le manuel | Cas réel — Julia 0.6 rebaptise type et immutable (2017) | https://github.com/JuliaLang/julia/issues/19157 (et `gh api`) ; https://github.com/JuliaLang/julia/blob/release-0.6/NEWS.md ; https://julialang.org/blog/2017/06/julia-0.6-release/ ; https://docs.julialang.org/en/v1/manual/types/ |
| `pages/julia/lecon-07.html#1` | INVÉRIFIABLE, produit : Measurements.jl et DifferentialEquations.jl ; « les deux auteurs ne se sont jamais concertés » introuvable (ni l'article de Giordano ni la documentation de Measurements.jl ne parlent de DifferentialEquations.jl) | remplacé (recentré) : l'article de Mosè Giordano, `Measurement <: AbstractFloat`, complexes, précision arbitraire, algèbre linéaire et unités « gratuits » | Cas réel — Measurements.jl hérite de fonctions qu'il n'a pas écrites (2016) | https://arxiv.org/abs/1610.08716 (PDF lu) ; https://juliaphysics.github.io/Measurements.jl/stable/examples/ (vérification négative) |
| `pages/julia/lecon-08.html#1` | INEXACT, événement : « 1,5 pétaflop/s (plus de mille milliards d'opérations par seconde) » — c'est un million de milliards ; « cette même discipline de type » non sourcée ; analyste anonyme « facteur ~50 » | corrigé : Celeste, 1,54 PFLOP/s en pointe, 1,3 million de threads, 650 000 cœurs Xeon Phi, 178 To et 188 millions d'objets en 14,6 min, remaniements (allocations, recherche dynamique de méthodes, ordre mémoire) et compilateur | Cas réel — Celeste atteint le pétaflop/s en Julia (2017) | https://juliahub.com/blog/julia-joins-petaflop-club ; https://arxiv.org/abs/1801.10277 (PDF lu) |
| `pages/julia/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« une équipe… ») et produit : « Pumas sert à des soumissions à la FDA » — seule une déclaration d'entreprise (communiqué JuliaHub, 2025) l'affirme | remplacé par : Julia 1.7 et le nouveau format du `Manifest.toml` (`[deps]`, `julia_version`) | Cas réel — Julia 1.7 et le nouveau format du Manifest.toml (2021) | https://julialang.org/blog/2021/11/julia-1.7-highlights/ |
| `pages/julia/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« un analyste reçoit 200 000 relevés… ») + doublon interne de `julia/lecon-01` (Fed de New York) | remplacé par : Julia 1.9 met en cache le code natif ; TTFX de CSV, DataFrames, GLMakie | Cas réel — Julia 1.9 et le premier appel de CSV et DataFrames (2023) | https://julialang.org/blog/2023/04/julia-1.9-highlights/ |
| `pages/julia/lecon-11.html#1` | INVÉRIFIABLE en partie, événement : CliMA et ses partenaires vrais ; « la différenciation automatique y sert à calibrer le modèle », « l'esprit du SciML » introuvables dans les sources ouvertes | remplacé (recentré) : Oceananigans.jl, développé dans le cadre de CliMA, un seul code Julia pour CPU et GPU | Cas réel — Oceananigans.jl, l'océan de CliMA en Julia (2020) | https://joss.theoj.org/papers/10.21105/joss.02018 (PDF lu) ; https://sustainability.mit.edu/article/new-climate-model-be-built-ground ; https://clima.caltech.edu/ |
| `pages/julia/lecon-12.html#1` | VRAI dans l'ensemble mais sans date ni source, produit (JuMP, Turing.jl, DifferentialEquations.jl) | corrigé : l'article de JuMP — macros syntaxiques plutôt que surcharge d'opérateurs, O(d⁴) → O(d²), « premier langage de modélisation conçu autour de macros », mesures (22 s contre 24 s AMPL, 26 s Gurobi C++, > 600 s Pyomo) | Cas réel — JuMP, un langage d'optimisation fait de macros (2017) | https://arxiv.org/abs/1508.01982 (PDF lu) ; métadonnées Crossref du DOI 10.1137/15M1020575 (SIAM Review 59(2), 2017) |
| `pages/julia/lecon-13.html#1` | INVÉRIFIABLE (B2), général (Monte-Carlo pour π ; « sur 4 cœurs, près de 4 » non mesuré) | remplacé par : Julia 1.3, `Threads.@spawn`, ordonnanceur partr, tri fusion 2,95 s → 0,66 s sur 16 threads | Cas réel — Julia 1.3 et Threads.@spawn (2019) | https://julialang.org/blog/2019/07/multithreading/ |
| `pages/julia/lecon-14.html#1` | INVÉRIFIABLE, produit / général (« des milliers de @test » dans DataFrames.jl et DifferentialEquations.jl, sans source) | remplacé par : BenchmarkTools.jl, estimateur du minimum, plus de 1 300 benchmarks, des dizaines de régressions interceptées | Cas réel — BenchmarkTools et les benchmarks de Julia (2016) | https://arxiv.org/abs/1608.04295 (PDF lu) |
| `pages/julia/lecon-15.html#1` | INVÉRIFIABLE, produit (SpecialFunctions.jl « s'appuie sur du code C », SUNDIALS piloté par `ccall`, migration par PyCall) : non vérifié à une source primaire, remplacé | remplacé par : PySR, interface Python d'un moteur écrit en Julia (SymbolicRegression.jl), JIT et fusion d'opérateurs | Cas réel — PySR, une interface Python sur un moteur Julia (2023) | https://arxiv.org/abs/2305.01582 (PDF de la v1 lu) |
| `pages/julia/lecon-16.html#1` | INVÉRIFIABLE, général (« le squelette de n'importe quelle application ») | remplacé par : le mot-clé `init` de `sum`/`maximum`, PR n° 35839 (Tim Holy) et 36188 (Takafumi Arakaki), Julia 1.6 — le `init = 0.0` du projet | Cas réel — Le mot-clé init de sum et de maximum (2020) | https://github.com/JuliaLang/julia/pull/35839 ; https://github.com/JuliaLang/julia/pull/36188 (et `gh api`) ; https://github.com/JuliaLang/julia/blob/release-1.6/NEWS.md ; https://julialang.org/blog/2021/03/julia-1.6-highlights/ ; essai Julia 1.11.7 |

## 3. Cas par cas — `stats`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/stats/lecon-01.html#1` | INVÉRIFIABLE (B2), anonyme (« une équipe d'infrastructure », moyenne 180 ms, p95) | remplacé par : la méthodologie de l'enquête développeurs de Stack Overflow 2025 (population et échantillon) | Cas réel — L'enquête développeurs de Stack Overflow (2025) | https://survey.stackoverflow.co/2025/methodology/ |
| `pages/stats/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« une start-up », salaire moyen 68 000 €) | remplacé par : Stephen Jay Gould, la médiane de survie de huit mois | Cas réel — Stephen Jay Gould et la médiane de huit mois (1985) | https://www.stat.berkeley.edu/users/rice/Stat2/GouldCancer.html (texte de *Discover*, juin 1985) ; la réédition du *AMA Journal of Ethics* (2013) est derrière Cloudflare |
| `pages/stats/lecon-03.html#1` | INVENTÉ, Orbit (« une équipe d'Orbit », écart-type de 8 à 55 ms) | remplacé par : la note de Gilbert S. Daniels sur l'« homme moyen » (4 063 aviateurs, aucun moyen sur 10 mesures) | Cas réel — L'« homme moyen » de l'US Air Force (1952) | https://archive.org/details/DTIC_AD0010203 (et le texte OCR https://archive.org/stream/DTIC_AD0010203/DTIC_AD0010203_djvu.txt) |
| `pages/stats/lecon-04.html#1` | INVÉRIFIABLE, anonyme (copie quasi exacte du récit de la leçon 01, « deux bosses ») | remplacé par : Dean et Barroso, « The Tail at Scale » | Cas réel — Google et « The Tail at Scale » (2013) | https://www.barroso.org/publications/TheTailAtScale.pdf (PDF lu) |
| `pages/stats/lecon-05.html#1` | INVENTÉ (B2), Orbit (échantillonnage nocturne à 3 h) | remplacé par : les sondages des élections britanniques de 2015 et l'enquête Sturgis | Cas réel — Les sondages des élections britanniques (2015) | https://eprints.lse.ac.uk/101941/ (notice LSE, qui renvoie au PDF) ; https://www.markpack.org.uk/files/2016/03/Report-of-the-Inquiry-into-the-2015-British-general-election-opinion-polls.pdf (PDF lu, 120 p.) ; le dépôt NCRM refuse les robots (Anubis) |
| `pages/stats/lecon-06.html#1` | INVENTÉ, Orbit (alerte sur la latence, TCL) | remplacé par : les « 25 écarts-types » de David Viniar (Goldman Sachs) et le calcul de Dowd et al. | Cas réel — Goldman Sachs et les « 25 écarts-types » (2007) | https://arxiv.org/abs/1103.5672 (PDF lu ; la citation y renvoie au *Financial Times* du 13 août 2007) |
| `pages/stats/lecon-07.html#1` | INVÉRIFIABLE, général (sondage à 43 % ± 3 points, aucun sondage nommé) | remplacé par : le chômage BIT de l'Insee au 4e trimestre 2025, 7,9 % à ± 0,3 point | Cas réel — Le taux de chômage de l'Insee, à 0,3 point près (2026) | https://www.insee.fr/fr/statistiques/8735266 ; PDF de la publication (IR34_Chomage_4T2025, lu) |
| `pages/stats/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« une équipe growth », p = 0,04) | remplacé par : la déclaration de l'ASA sur les valeurs p, six principes | Cas réel — La déclaration de l'ASA sur les valeurs p (2016) | https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf (communiqué lu) |
| `pages/stats/lecon-09.html#1` | INVENTÉ, Orbit (notifications et engagement en cloche) | remplacé par : la « Datasaurus Dozen » (r = −0,06 pour treize nuages) | Cas réel — La « Datasaurus Dozen » d'Autodesk Research (2017) | https://www.research.autodesk.com/publications/same-stats-different-graphs/ ; PDF de l'article (Autodesk Research, lu) |
| `pages/stats/lecon-10.html#1` | INEXACT, événement (WHI) : « l'exemple le plus fameux », « largement prescrit dans ce but » non sourcés ; confusion présentée comme cause certaine (« c'était leur mode de vie ») ; phrase générale sur les logs non sourcée | corrigé : 40 à 50 % de risque en moins dans les études observationnelles, 16 608 femmes tirées au sort, arrêt recommandé le 31 mai 2002, risque coronarien 1,29 (1,02–1,63) ; confusion socio-économique « pourrait expliquer une partie » (Lawlor et al.) | Cas réel — Le traitement hormonal de la ménopause et l'essai WHI (2002) | https://jamanetwork.com/journals/jama/fullarticle/195120 ; PDF de l'article (copie de cours, McGill, lu) ; https://pmc.ncbi.nlm.nih.gov/articles/PMC1448605 |
| `pages/stats/lecon-11.html#1` | INVENTÉ, Orbit (dimensionnement d'un serveur, R² ≈ 0,9) | remplacé par : Gordon Moore, une droite par cinq points, 65 000 composants pour 1975, pente révisée en 1975 | Cas réel — Gordon Moore prolonge une droite (1965) | https://www.cs.utexas.edu/~fussell/courses/cs352h/papers/moore.pdf (réédition 1998, lue) ; https://www.computerhistory.org/siliconengine/moores-law-predicts-the-future-of-integrated-circuits/ |
| `pages/stats/lecon-12.html#1` | INVÉRIFIABLE, anonyme (deux histoires « qu'on croise en production ») | remplacé par : Google Flu Trends, sur-ajustement de 50 millions de termes à 1 152 points | Cas réel — Google Flu Trends (2013) | https://gking.harvard.edu/files/gking/files/0314policyforumff.pdf (PDF lu) |
| `pages/stats/lecon-13.html#1` | INEXACT, événement + INVENTÉ en partie : crise de la reproductibilité vague (« plus de la moitié », « des centaines d'études », « et la médecine ») suivie d'une morale Orbit | corrigé (recentré) : Open Science Collaboration, 100 réplications, 97 % contre 36 % significatifs, effets moitié moins grands, biais de publication | Cas réel — Cent réplications en psychologie (2015) | https://www.pure.ed.ac.uk/ws/files/21474290/RPP.pdf (version des auteurs, lue) |
| `pages/stats/lecon-14.html#1` | INVÉRIFIABLE, anonyme (test A/B « exactement comme Orbit ») ; mention finale de Berkeley 1973 (déjà dans le corps de la leçon) | remplacé par : le paradoxe de Simpson dans la létalité du Covid-19, Italie contre Chine | Cas réel — La létalité du Covid-19, Italie contre Chine (2020) | https://arxiv.org/abs/2005.07180 (PDF de la v1 lu) |
| `pages/stats/lecon-15.html#1` | INVÉRIFIABLE, anonyme (« +12 % » au bout de trois jours) | remplacé par : Optimizely et les valeurs p « toujours valides » contre le *peeking* | Cas réel — Optimizely et les tests A/B regardés en continu (2015) | https://arxiv.org/abs/1512.04922 (PDF de la v3 lu) |

## 4. Points à signaler

- **La règle ne reconnaît pas les années avant 1950** (`RE_ANNEE` = `19[5-9]\d|20[0-3]\d` dans
  `tools/cas-reels/extraction.js`). Le premier choix de `stats/lecon-11` était la droite de Hubble
  (PNAS, 15 mars 1929, texte reproduit par la NASA) : impossible à titrer. Réservation rendue, remplacée
  par Moore 1965. Même effet que « Galton 1886 » au lot 3.
- **`lexique-diff.js` : 4 écarts, inévitables et compensés, tous dans `julia/lecon-08`.** La classe
  obligatoire `cas-reel__source` fait entrer le mot « source » dans la page (l'outil, comme la mesure
  du cliquet, lit le HTML brut). « source » est un mot d'un distracteur de la question 1, qui passait de
  6 à 5 mots étrangers : le cliquet lexical rougissait (`julia` INVERSE restreint 0,0 % → 8,3 %). Trois
  mots, un de chacune des trois autres options (« appels », « réduit », « lecture »), entrent dans des
  phrases exactes tirées de l'article Celeste (« avoid dynamic method lookup », « reduce dynamic memory
  allocations », « iteration order matched memory layout order ») : la question revient à 5/5/5/5 et
  le cliquet est vert. Toute page dont un QCM porte « source » en distracteur aura le même effet.
  Hors de cette page : 0 écart (six mots perdus en route, remis dans des phrases exactes :
  « répondent », « milliers », « annonce », « vérifié », « déployer », « semaines » en `stats` ;
  « compilateur », « variable », « explicite », « vitesse », « réécrit » en `julia`, et « simulation »
  évité au singulier).
- **Hors encadré, non traité** : le corps de `julia/lecon-16` affiche `Gomme : 12 × 0.8 € =
  9.600000000000001 €` — c'est le résultat réel d'un `Float64` (le nouveau cas de `julia/lecon-02` ne le
  contredit pas) ; l'exercice 2 de `stats/lecon-05` reprend le scénario fictif d'Orbit à 3 h, présenté
  comme exercice, pas comme « Cas réel » : laissé.
- **Sources secondaires ou d'entreprise** : `stats/lecon-06` cite la phrase de David Viniar par
  l'article de Dowd et al., qui la tient du *Financial Times* du 13 août 2007 (article payant, non
  ouvert) ; `julia/lecon-08` cite le communiqué de Julia Computing pour la date de l'annonce, les
  chiffres viennent de l'article scientifique ; `stats/lecon-11` s'appuie sur le Computer History
  Museum pour l'article interne de 1964 et la révision de 1975 (le texte de 1975 n'a pas été ouvert).
- **Doutes** : `julia/lecon-07` et `julia/lecon-11` gardent le sujet d'origine (Measurements.jl,
  CliMA) mais en changent le récit, faute de source pour les affirmations initiales ; `stats/lecon-07`
  applique la marge de ± 0,3 point à l'évolution trimestrielle (l'Insee écrit que sa précision vaut
  « du niveau du taux de chômage et de son évolution d'un trimestre à l'autre » ; l'intervalle
  −0,1/+0,5 est notre calcul) ; `julia/lecon-03` dit que l'exemple « échouait » au REPL de Julia 1.0
  d'après le billet de Julia 1.5 (non rejoué sous 1.0).

## 5. Contrôles avant le dernier commit

(codes de sortie relevés sur la branche, après les deux commits de contenu)

| contrôle | code | détail |
|---|---:|---|
| `node tools/verif-contenu.js --cas-reel --cours=julia` | **0** | 16 lus, 16 conformes (0 avant) |
| `node tools/verif-contenu.js --cas-reel --cours=stats` | **0** | 15 lus, 15 conformes (0 avant) |
| `node tools/verif-contenu.js --strict` | **0** | toutes les leçons tiennent le standard |
| `node tools/verif-html.js` | **0** | aucun problème |
| `node tools/verif-domaines-interdits.js` | **0** | aucune référence réelle aux trois domaines |
| `node tools/verif-qcm-lexique.js` | **0** | l'indice lexical n'a empiré nulle part (voir § 4 pour `julia/lecon-08`) |
| `node tools/verif-qcm-biais.js` | **0** | aucun cours n'a empiré |
| `node tools/cas-reels/lots/lexique-diff.js <copie> 13eabe3` | — | 31 pages, 4 écarts, tous dans `julia/lecon-08`, expliqués au § 4 |
| `node tools/cas-reels/lots/controle-branche.js <copie> 13eabe3` | OK | 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, 31 zones avant et après |
| `node tools/cas-reels/lots/doublons.js` | — | 2 sources partagées entre cours, les deux d'avant ce lot (react.dev, webkit.org) |
| `node tools/verif.js --rapide` | **1** | 54 étapes jouées, 52 vertes, 522,5 s ; 2 rouges, toutes deux tolérées par la consigne : **`donnees`** (invariant I18 seul : `search-index.js` périmé, +6 031 o) et **`doc-rec`** (2 contrôles de `tools/doc/verif-recherche.js` sur 77 : « 742 citent la source » — les lignes de source de ce lot ; « 9 leçons » nomment Stack Overflow ou un assistant — le nouveau cas `stats/lecon-01`, sur l'enquête développeurs de Stack Overflow, fait passer le compte de 8 à 9). `doc-ref` est vert. |

## 6. Consignes de fusion

- Branche `v18/b7-julia-stats`, quatre commits : `stats` (574a43b), `julia` (c25bff8), une
  relecture de `stats/lecon-02` (07f7dd6), puis ce rapport. Seuls changent
  `pages/stats/lecon-01` à `-15`, `pages/julia/lecon-01` à `-16` (un seul encadré par page, octets
  identiques ailleurs, 0 CR) et ce rapport.
- À régénérer par l'orchestrateur après fusion : index dérivés (`js/search-index.js`,
  `pages/etude-recherche.html`…) et chiffres du cours `doc` (`doc-rec` : le nombre de leçons qui
  citent leur source, et celui des leçons qui nomment Stack Overflow, 8 → 9 ; la phrase de la page
  `doc` qui en dit qu'aucune mention n'est un conseil de méthode reste vraie : `stats/lecon-01` parle
  de la méthodologie de l'enquête, pas de chercher une réponse sur Stack Overflow).
- Contre-relecture : les 31 encadrés (aucun gardé tel quel). Points à regarder en priorité : § 4,
  « Doutes ».
- Registre `foyers.md` : y inscrire les 31 sujets (lignes `julia/` et `stats/` du fichier de
  réservations ; la ligne « Hubble 1929 » est remplacée par la ligne Moore).
