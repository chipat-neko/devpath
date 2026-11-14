# Rapport V18 — case B6 (lot 3) : les « Cas réel » des cours `r` et `docker`

Copie de travail `D:\test-claude-b6-r-docker`, branche `v18/b6-r-docker`, partie de `1b45660`.
Scripts : `scratchpad/b6-r-docker/` de la copie (ignoré par git) — `contenu.txt` (le texte exact
de chaque nouvel encadré), `appliquer.js` (espaces insécables hors `<code>`, remplacement du corps
de l'encadré seul — titre, récit, source —, aperçu des écarts lexicaux, conformité, preuve que
les octets hors encadré sont identiques, 0 CR), `preuve.js` (contrôle indépendant contre `HEAD`,
à l'octet, en latin1, donc sûr pour la page au mojibake), `cherche.js` (sujet et source dans
tout `pages/`, le registre `foyers.md` et les réservations), `dump.js`, et les essais R
(`t03.R`, `t09.R`, `t15.R`, `tdivers.R`).

Comportements techniques **rejoués** avec R 4.6.0 (webR, `D:/test-claude/scratchpad/webr/r.js`) :
`if (c(12, 8, 15) >= 10)` → « the condition has length > 1 » ; `&&` sur trois valeurs →
« 'length = 3' in coercion to 'logical(1)' » ; `set.seed(123); sample(1:100, 5)` →
`31 79 51 14 67`, et `29 79 41 86 91` après `RNGversion("3.5.0")` (avertissement « non-uniform
'Rounding' sampler used ») ; `str()` d'un `data.frame` : `chr` par défaut, `Factor w/ 2 levels`
avec `stringsAsFactors = TRUE` ; `identical(r"(^0[67]\d{8}$)", "^0[67]\\d{8}$")` → `TRUE` ;
`model.matrix` : une colonne `pays` en numérique, `factor(pays)2` et `factor(pays)3` en facteur ;
`list_rbind(names_to =)` : noms des éléments, numéros 1, 2 si la liste n'est pas nommée ; la
jointure du billet dplyr 1.1.0 (6 lignes, avertissement « many-to-many » avec dplyr 1.2.1).

Tous les sujets sont réservés dans `D:\test-claude\scratchpad\v18-parallele\b6-reservations.txt`
(33 lignes, plus une ligne « REMPLACE » pour `r/lecon-10`), après lecture du registre `foyers.md`,
recherche du sujet et de l'URL dans tout `pages/` et relecture des réservations des autres
agents : aucun conflit. `doublons.js` : toujours 2 sources partagées (les deux légitimes,
inchangées).

Nature : *événement* (fait daté), *produit* (produit ou document nommé), *anonyme* (récit sans
sujet identifiable), *général* (usage général présenté comme un cas).

## 1. Bilan

| cours | « Cas réel » | VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `r` | 17 | 0 | 2 | 14 | 1 | 0 | 2 | 15 | 0 |
| `docker` | 16 | 0 | 0 | 16 | 0 | 0 | 0 | 16 | 0 |
| **total** | **33** | **0** | **2** | **30** | **1** | **0** | **2** | **31** | **0** |

Le cours `r` racontait surtout des journées d'analystes anonymes (« un analyste », « une
association », « une boutique ») ; `r/lecon-02` se déclarait lui-même fictif (« Imagine un
fichier… »). Le cours `docker` ne nommait presque rien, et racontait **quatre fois** l'arrivée
d'un nouveau développeur (leçons 1, 5, 8 et 15). Les 33 cas sont maintenant **datés, nommés et
sourcés**, sur la notion de leur leçon ; chaque affirmation a été confrontée à une source
**ouverte** (WebFetch, `curl`, API GitHub, `pypdf` pour les PDF). Toutes les sources sont
primaires, sauf l'avis de retrait de *Current Biology* (`r/lecon-02`), cité par Retraction Watch :
la page de l'éditeur renvoie 403 (cell.com et sciencedirect.com) ; le récit s'appuie d'abord sur
le billet de Tyler VanderWeele (Harvard) et sur les métadonnées d'Europe PMC (dates, effectifs).

Les intertitres `<h2>Cas réel</h2>` collés au-dessus des 17 encadrés du cours `r` ne disent pas
l'ancien récit : laissés tels quels. Le cours `docker` n'a pas d'intertitre collé.

## 2. Cas par cas — `r`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/r/lecon-01.html#1` | INVÉRIFIABLE, général : trois affirmations larges (rédactions, pharma, COVID), une seule vérifiable (les pilotes FDA depuis 2021) | remplacé par : le pilote 1 du R Consortium soumis à la FDA (reprise précisée de la seule affirmation vérifiable) | Cas réel — Un dossier d'essai clinique en R remis à la FDA (2021-2022) | https://github.com/RConsortium/submissions-pilot1-to-fda (README ; PDF des revues FDA du 22/11/2021 et du 10/03/2022, lus avec pypdf) ; https://rconsortium.github.io/submissions-wg/pilot1.html ; https://www.r-bloggers.com/2022/03/update-successful-r-based-test-package-submitted-to-fda/ (contrôle, non cité) |
| `pages/r/lecon-02.html#1` | INVENTÉ (« Imagine un fichier de réponses… ») | remplacé par : Decety et al., le pays codé 1, 2, 3 traité en variable continue, article retiré | Cas réel — Un pays codé 1, 2, 3 dans une étude retirée (2015-2019) | https://hfh.fas.harvard.edu/post/does-a-religious-upbringing-promote-generosity-or-not ; https://retractionwatch.com/2019/10/04/authors-retract-paper-claiming-religious-upbringing-is-linked-to-less-generosity/ ; Europe PMC (API, métadonnées de l'article, de l'avis de retrait et de la réanalyse) ; Crossref (réanalyse de Shariff et al.) |
| `pages/r/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« un analyste », NPS) | remplacé par : R 4.2.0 (`if`) et R 4.3.0 (`&&`, `||`) refusent une condition de longueur > 1 | Cas réel — R 4.2 et 4.3 refusent une condition à plusieurs valeurs (2022-2023) | https://cran.r-project.org/doc/manuals/r-release/NEWS.html ; https://cran.r-project.org/src/base/R-4/ (dates) |
| `pages/r/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« un data scientist », 12 000 patients) | remplacé par : R 4.0.0 passe `stringsAsFactors = FALSE`, billet de Kurt Hornik | Cas réel — R 4.0 cesse de changer le texte en facteurs (2020) | https://developer.r-project.org/Blog/public/2020/02/16/stringsasfactors/index.html ; https://cran.r-project.org/doc/manuals/r-release/NEWS.html |
| `pages/r/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« une analyste e-commerce ») | remplacé par : dplyr 1.0.0 et `across()` (l'exemple du billet contient l'erreur de copier-coller `d = mean(c)`) | Cas réel — dplyr 1.0 et across() (2020) | https://www.tidyverse.org/blog/2020/04/dplyr-1-0-0-colwise/ |
| `pages/r/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« un journaliste de données ») ; « la moitié du temps » sans source | remplacé par : « Tidy Data » (2014) et `pivot_longer()` de tidyr 1.0.0 (2019) | Cas réel — « Tidy Data », puis pivot_longer() (2014-2019) | https://www.jstatsoft.org/article/view/v059i10 (et le PDF de l'article) ; https://www.tidyverse.org/blog/2019/09/tidyr-1-0-0/ |
| `pages/r/lecon-07.html#1` | INEXACT, produit (bbplot de la BBC) : `bbc_style()` ne fixe pas les couleurs (le README dit de les régler dans les couches) ; « des centaines de graphiques homogènes » sans source | corrigé à la source, même sujet | Cas réel — bbplot, le style maison de la BBC pour ggplot2 (2019) | https://bbc.github.io/rcookbook/ ; https://github.com/bbc/bbplot (README brut et API : dépôt créé le 15/01/2019) |
| `pages/r/lecon-08.html#1` | INEXACT, événement (salaires Insee) : « environ 2000 € nets » sans année ni publication | corrigé à la source : Insee Première n° 2079 (2024 : moyenne 2 733 €, médiane 2 190 €, déciles) | Cas réel — Salaire moyen et salaire médian du privé selon l'Insee (2024) | https://www.insee.fr/fr/statistiques/8657156 |
| `pages/r/lecon-09.html#1` | INVÉRIFIABLE, général (sondages, tests A/B) | remplacé par : Ottoboni et Stark, « Random problems with R » ; R 3.6.0 change `sample()` | Cas réel — R 3.6.0 change la méthode de sample() (2019) | https://arxiv.org/abs/1809.06520 ; https://cran.r-project.org/doc/manuals/r-release/NEWS.3.html ; https://stat.ethz.ch/R-manual/R-devel/library/base/html/Random.html ; https://cran.r-project.org/src/base/R-3/ (date) |
| `pages/r/lecon-10.html#1` | INVÉRIFIABLE, produits nommés (MeilleursAgents, Zillow « reposent sur des régressions » : fonctionnement interne non documenté) | remplacé par : Challenger, les vols sans incident omis de la comparaison (commission Rogers). Premier choix, Galton (1886), abandonné : la règle ne reconnaît que les années 1950-2039 | Cas réel — Challenger et les vols sans incident oubliés (1986) | https://www.nasa.gov/history/rogersrep/v1ch3.htm ; https://www.nasa.gov/history/rogersrep/v1ch6.htm ; https://www.nasa.gov/history/rogersrep/genindex.htm (date du rapport) |
| `pages/r/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« un institut de sondage », B2) | remplacé par : les scripts « Willoughby-Hoye » qui dépendaient de l'ordre des fichiers | Cas réel — Des scripts dont le résultat dépendait de l'ordre des fichiers (2019) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6919963/ ; Europe PMC (API) ; https://stat.ethz.ch/R-manual/R-devel/library/base/html/list.files.html |
| `pages/r/lecon-12.html#1` | INVÉRIFIABLE, général (« de nombreuses équipes d'épidémiologie ») | remplacé par : Baggerly et Coombes, bio-informatique légiste, rapports Sweave et `sessionInfo()` | Cas réel — Baggerly et Coombes exigent des rapports Sweave (2009) | https://arxiv.org/abs/1010.1092 (et le PDF, lu avec pypdf) |
| `pages/r/lecon-13.html#1` | INVÉRIFIABLE, anonyme (« une association », B2) ; « la majorité du temps » sans source | remplacé par : les chaînes brutes `r"(...)"` de R 4.0.0 | Cas réel — R 4.0 et les chaînes brutes r"(…)" (2020) | https://cran.r-project.org/doc/manuals/r-release/NEWS.html ; https://cran.r-project.org/src/base/R-4/ |
| `pages/r/lecon-14.html#1` | INVÉRIFIABLE, anonyme (« une boutique en ligne ») | remplacé par : l'article lubridate (JSS 2011) et les dates des Lakers lues comme des entiers | Cas réel — lubridate et les dates des Lakers lues comme des entiers (2011) | https://www.jstatsoft.org/article/view/v040i03 (et le PDF) |
| `pages/r/lecon-15.html#1` | INVÉRIFIABLE, anonyme (« une équipe d'analyse e-commerce », 0,3 %) | remplacé par : dplyr 1.1.0, `join_by()`, l'avertissement des correspondances multiples, `closest()` | Cas réel — dplyr 1.1.0 et les correspondances multiples (2023) | https://www.tidyverse.org/blog/2023/01/dplyr-1-1-0-joins/ |
| `pages/r/lecon-16.html#1` | INVÉRIFIABLE, anonyme (« un analyste ») | remplacé par : purrr 1.0.0, `map_dfr()` dépassée au profit de `map()` suivi de `list_rbind()` | Cas réel — purrr 1.0.0 et la fin de map_dfr() (2022) | https://www.tidyverse.org/blog/2022/12/purrr-1-0-0/ |
| `pages/r/lecon-17.html#1` | INVÉRIFIABLE, anonyme (« un institut de santé publique ») | remplacé par : le Reproducible Analytical Pipeline du GDS et du DCMS, en R | Cas réel — Une statistique officielle britannique produite par un pipeline en R (2017) | https://dataingovernment.blog.gov.uk/2017/03/27/reproducible-analytical-pipeline/ |

## 3. Cas par cas — `docker`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/docker/lecon-01.html#1` | INVÉRIFIABLE, général (« beaucoup d'équipes », intégration en une ou deux journées) | remplacé par : le README de Docker 0.1.0, le « Standard Container » | Cas réel — Le README de Docker 0.1.0 et le « conteneur standard » (2013) | https://github.com/moby/moby/blob/v0.1.0/README.md (et sa version brute) ; https://docs.docker.com/engine/release-notes/prior-releases/ |
| `pages/docker/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« un site conteneurisé renvoie des 502 ») | remplacé par : le billet de Jérôme Petazzoni (SSH, `nsenter`) puis `docker exec` dans Docker 1.3.0 | Cas réel — Avant docker exec : SSH, puis nsenter (2014) | https://jpetazzo.github.io/2014/06/23/docker-ssh-considered-evil/ ; https://docs.docker.com/engine/release-notes/prior-releases/ ; https://github.com/jpetazzo/nsenter (README brut) |
| `pages/docker/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« une équipe », 8 min → 40 s, B2) | remplacé par : Docker 1.10 ne tire plus la chaîne des parents, cache de build perdu en CI ; `--cache-from` dans 1.13.0 | Cas réel — Docker 1.10, le cache de build perdu en CI, et --cache-from (2016-2017) | https://github.com/moby/moby/issues/20316 ; https://github.com/moby/moby/pull/24711 ; https://github.com/moby/moby/issues/26065 ; https://github.com/moby/moby/pull/26839 (API GitHub) ; https://docs.docker.com/engine/release-notes/prior-releases/ |
| `pages/docker/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« une équipe », base perdue) ; le mécanisme du volume anonyme est exact | remplacé par : l'image `postgres` déplace `PGDATA` et son `VOLUME` à partir de PostgreSQL 18 (le mécanisme du volume anonyme, désormais sourcé, est gardé) | Cas réel — L'image postgres déplace ses données à partir de PostgreSQL 18 (2025) | https://github.com/docker-library/postgres/pull/1259 ; https://github.com/docker-library/postgres/issues/1370 (API GitHub) ; https://github.com/docker-library/docs/blob/master/postgres/content.md |
| `pages/docker/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« intégrer une recrue ») ; même récit que les leçons 1, 8 et 15 | remplacé par : Fig d'Orchard, rejoint Docker, renommé Docker Compose | Cas réel — Fig devient Docker Compose (2013-2015) | https://github.com/docker/compose/blob/1.1.0/CHANGES.md ; https://github.com/docker/compose/blob/0.1.0/README.md |
| `pages/docker/lecon-06.html#1` | INVÉRIFIABLE, général (« des milliers de clés ont ainsi fuité » sans source) | remplacé par : Dahlmanns et al., secrets dans 8,5 % des images (ASIA CCS 2023), qui étaye ce que l'ancien encadré affirmait | Cas réel — Des secrets dans 8,5 % des images publiques (2023) | https://arxiv.org/abs/2307.03958 (et le PDF) |
| `pages/docker/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« une équipe », `ghcr.io/noah/monapp`) | remplacé par : gel de `k8s.gcr.io` au profit de `registry.k8s.io` | Cas réel — Kubernetes gèle le registre k8s.gcr.io (2023) | https://kubernetes.io/blog/2023/02/06/k8s-gcr-io-freeze-announcement/ |
| `pages/docker/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« sur un projet réel ») ; même récit que les leçons 1, 5 et 15 | remplacé par : Compose Watch, expérimental (2.16.0) puis général (2.22.0), et sa documentation face au bind mount | Cas réel — Docker Compose Watch, d'expérimental à stable (2023) | https://github.com/docker/compose/releases/tag/v2.16.0 ; https://github.com/docker/compose/releases/tag/v2.22.0 (API GitHub) ; https://docs.docker.com/compose/how-tos/file-watch/ |
| `pages/docker/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« un service en production », OOMKilled) | remplacé par : JDK-8146115, la JVM qui lisait les ressources de l'hôte (Java 10, 8u191) | Cas réel — La JVM ne voyait pas les limites de son conteneur (2015-2018) | https://bugs.openjdk.org/browse/JDK-8146115 ; https://docs.docker.com/engine/containers/resource_constraints/ (contrôle) |
| `pages/docker/lecon-10.html#1` | INVÉRIFIABLE à la source primaire, événement (images `docker123321`) : le rapport de Kromtech n'est plus en ligne ; selon les résultats de recherche (presse, non cités), « 5 millions » de téléchargements est une estimation et les images étaient tirées par les attaquants sur des systèmes compromis, pas par des utilisateurs trompés | remplacé par : l'analyse de Sysdig (typosquatting, 1 652 images malveillantes) | Cas réel — Des images piégées qui imitent des logiciels connus (2022) | https://sysdig.com/blog/analysis-of-supply-chain-attacks-through-public-docker-images/ ; https://unit42.paloaltonetworks.com/malicious-cryptojacking-images/ (contrôle, non cité) |
| `pages/docker/lecon-11.html#1` | INVÉRIFIABLE, général (« l'outil de diagnostic n° 1 des images ») | remplacé par : les images distroless sans shell, leur variante `:debug` et `docker run --entrypoint=sh` | Cas réel — Les images distroless, sans shell, et leur variante :debug (2017) | https://github.com/GoogleContainerTools/distroless (README brut) ; https://swampup2017.sched.com/event/A6CW/distroless-docker-containerizing-apps-not-vms (WebFetch ; `curl` 503) |
| `pages/docker/lecon-11.html#2` | INVÉRIFIABLE, général (« beaucoup d'images officielles ») | remplacé par : Yelp et `dumb-init`, le shell en PID 1, `exec` du dernier processus | Cas réel — Yelp et le problème du PID 1 (2016) | https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html |
| `pages/docker/lecon-12.html#1` | INVÉRIFIABLE, anonyme (« une équipe développe sur des MacBook ARM ») | remplacé par : le ticket docker/for-mac n° 5475, le même récit vrai et daté | Cas réel — Construite sur un Mac M1, l'image refuse de démarrer sur le serveur (2021) | https://github.com/docker/for-mac/issues/5475 (et ses commentaires, API GitHub) |
| `pages/docker/lecon-13.html#1` | INVÉRIFIABLE, général (B2) ; le mécanisme du DNS par nom de service est exact | remplacé par : Compose 1.6.0, format version 2 et réseau par défaut | Cas réel — Compose 1.6 : chaque service joignable par son nom (2016) | https://github.com/docker/compose/releases/tag/1.6.0 (API GitHub : publiée le 04/02/2016) ; https://github.com/docker/compose/blob/1.6.0/docs/networking.md ; CHANGELOG de la 1.6.0 (contrôle) ; https://docs.docker.com/compose/how-tos/networking/ (contrôle) |
| `pages/docker/lecon-14.html#1` | INVÉRIFIABLE, général (« un poste échappe à `docker system df` ») ; le défaut sans rotation est exact | remplacé par : la proposition moby n° 33475, le pilote `local`, et la documentation actuelle | Cas réel — Les journaux json-file, sans rotation par défaut (2017) | https://github.com/moby/moby/issues/33475 ; https://github.com/moby/moby/pull/37092 (API GitHub) ; https://docs.docker.com/engine/logging/configure/ ; https://docs.docker.com/engine/logging/drivers/local/ ; https://docs.docker.com/engine/logging/drivers/json-file/ (contrôle) |
| `pages/docker/lecon-15.html#1` | INVÉRIFIABLE, général (« avant Docker, l'intégration se comptait en jours ») ; même récit que les leçons 1, 5 et 8 | remplacé par : « Docker at Shopify » (image de base de 125 lignes, conteneurs fins, règle des 100) | Cas réel — Shopify conteneurise ses boutiques en production (2014) | https://shopify.engineering/docker-at-shopify-how-we-built-containers-that-power-over-100-000-online-shops |

## 4. Décomptes et contrôles

- Lus : **33** « Cas réel » (r 17, docker 16). Trouvés : VRAI 0, INEXACT 2, INVÉRIFIABLE 30,
  INVENTÉ 1. Actions : **31 remplacés**, **2 corrigés**, **0 vérifiés tels quels**, **0 renommé
  « Scénario »**.
- Conformes à la règle : r 0 → **17**, docker 0 → **16** (site : 543 → 576 sur 1 551 dans cette copie).
- Longueur du récit (hors titre et source) : 135 à 180 mots, comme les cas des lots 1 et 2.
- `lexique-diff.js D:\test-claude-b6-r-docker 1b45660` : **0 écart** sur les 32 pages. Premier jet :
  30 écarts, ramenés à 0 en reformulant : un mot d'option entré (« tourner », « changer »,
  « tirages », « remplace », « écarte », « reçoive »…) remplacé par un autre, ou un mot d'option
  sorti avec l'ancien récit (« chacun », « nouveau », « empilées », « l'équipe », « service »,
  « apparaît », « compte », « plante », « attendre », « publier », « macbook », « serveur »,
  « gonflée », « fautif », « capteurs », « exemple ») réintroduit dans une phrase vraie.
- Fins de ligne et octets : `preuve.js` — 32 pages, octets identiques à `HEAD` hors des corps
  d'encadrés, 0 CR. **Mojibake de `pages/r/lecon-06.html` intact** : préfixe (31 383 octets) et
  suffixe (13 494 octets) de l'encadré identiques à `HEAD`, les 2 « Ã » volontaires toujours là.

Codes de sortie (dernier état) :

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=r` | **0** |
| `node tools/verif-contenu.js --cas-reel --cours=docker` | **0** |
| `node tools/verif-contenu.js --strict` | **0** (1 leçon « maigre », préexistante) |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js` | 0 écart |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées entre cours (légitimes, inchangé) |
| `node tools/verif.js --rapide` | **1** — 52 étapes vertes sur 54 (421,1 s) ; les deux rouges sont ceux que la consigne tolère : `donnees` pour l'invariant **I18** seul (`search-index.js` périmé, +4 555 octets à la régénération) et `doc-rec` (la page du cours `doc` doit publier le nombre de leçons qui citent la source de leur « Cas réel » : mesuré **569** dans cette copie) ; `doc-ref` est vert. Aucun autre rouge. |

## 5. Ce qui reste ouvert

1. **Marque de fraîcheur** : l'ancien encadré de `docker/lecon-01` portait une marque
   (`data-arrete="2026-09-03"`, « beaucoup d'équipes livrent un fichier compose.yaml ») ; elle
   part avec lui. Son ancre reste dans `tools/fraicheur/releves/infra-lot-2026-09-03.json`
   (comme les trois ancres signalées au lot 2, à reprendre en phase E).
2. **Doute de méthode, `r/lecon-10`** : Galton (1886), le cas le plus proche de la notion de
   « régression », ne passe pas la règle mécanique (l'année doit être entre 1950 et 2039) ;
   remplacé par Challenger (1986), qui éclaire la régression logistique et l'extrapolation de la
   leçon. Si la règle s'élargit un jour aux années antérieures à 1950, Galton reste un bon
   candidat (source ouverte : https://galton.org/essays/1880-1889/galton-1886-jaigi-regression-stature.pdf).
3. **Phrases de liaison** : comme aux lots précédents, chaque cas garde une phrase qui le relie
   à la leçon ; quand elle énonce un comportement de R, il a été rejoué (§ en tête). Trois
   phrases de liaison portent un fait général que leur source ne dit pas, signalées pour la
   contre-relecture : `docker/lecon-09` (le noyau tue le processus d'un conteneur qui dépasse
   `--memory`, `OOMKilled` dans `docker inspect` — le cœur de la leçon), `docker/lecon-12`
   (« le même piège guette tout Mac à puce Apple, MacBook compris »), `r/lecon-17` (« le cycle
   vaut aussi bien pour des relevés de capteurs que pour des enquêtes »). Les deux dernières
   gardent dans la page un mot d'option de QCM (`lexique-diff` à 0).
4. **Pour le registre `foyers.md`** (à l'orchestrateur) : Challenger et la commission Rogers
   (`r/lecon-10`), le salaire médian de l'Insee (`r/lecon-08` ; le cas anonyme de
   `stats/lecon-02`, lot 4, devra en prendre un autre), Kubernetes et `k8s.gcr.io`
   (`docker/lecon-07`), JDK-8146115 (`docker/lecon-09`), Shopify et Docker 2014
   (`docker/lecon-15`).
5. Rien d'anormal vu hors des encadrés : les leçons Docker utilisent `postgres:16` avec
   `/var/lib/postgresql/data`, ce qui reste juste pour la 16 (à changer si le cours passe un
   jour à `postgres:18`, voir `docker/lecon-04#1`).
