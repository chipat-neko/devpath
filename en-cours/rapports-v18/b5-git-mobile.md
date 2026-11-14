# Rapport V18 — case B5, lot 2 : les cours `git` et `mobile` (copie `b5-git-mobile`, branche `v18/b5-git-mobile`)

Copie de travail `D:\test-claude-b5-git-mobile`, partie de `1b8d94b`. Part traitée : les **39 « Cas réel »**
des cours `git` (24, un par leçon) et `mobile` (15, un par leçon). Scripts et pièces téléchargées dans
`scratchpad/b5-git-mobile/` (ignoré par git) : `cas-git.js` et `cas-mobile.js` (les 39 textes),
`appliquer.js` (remplacement de l'encadré seul, avec contrôle des octets hors encadré, du CR, de la
règle, du lexique des QCM, de la typographie et de la longueur), `lexique-cas.js` (mots d'options de QCM
à garder ou à ne pas faire entrer, page par page), `lire.js`, `cherche.js`, `contexte.js`, `web/` (les
pages et PDF ouverts).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **24 hors de la règle à 0** pour
`git` et de **15 à 0** pour `mobile` ; sur les 39 cas trouvés, **0 était VRAI tel quel** :
31 INVÉRIFIABLES (récits anonymes ou usages généraux), 6 sujets réels nommés mais inexacts ou
invérifiables en partie, 2 INVENTÉS (le fil rouge fictif « Carnet » raconté comme réel) ;
**34 remplacés** par un cas réel daté et sourcé sur la même notion, **5 corrigés sur leur sujet**,
**0 gardé tel quel**, **0 renommé « Scénario »**.

## Ce qui a été fait

- Pour chaque leçon, seul l'intérieur du `div.callout__body` de l'encadré change (type d'encadré,
  icône et structure gardés : `note` partout, `warn` pour `git/lecon-08`). `appliquer.js` vérifie que
  tout ce qui précède et suit l'encadré est identique à l'octet ; `controle-branche.js` le confirme sur
  l'état commité (« octets identiques hors « Cas réel », types gardés, 0 CR, signatures, copie propre »).
- **Intertitres** : aucun intertitre « Un cas réel : … » collé au-dessus des encadrés de ces deux
  cours. Les cinq `<h2>Cas réel</h2>` de `mobile` (leçons 02, 03, 04, 06, 10) ne portent pas de sous-titre
  qui annoncerait l'ancien récit : inchangés.
- Forme de la règle partout : titre `Cas réel — sujet (année)`, dernier paragraphe
  `<p class="cas-reel__source">Source(s)&nbsp;: …</p>` avec date et lien(s). Aucun lien dans le corps
  des récits (les deux liens internes de l'ancien `mobile/lecon-15`, vers les leçons 12 et 14, sont partis
  avec l'ancien récit). Typographie : `&nbsp;` devant « : ; ! ? » et dans « » ; les seuls deux-points
  « collés » restants sont dans des titres anglais cités tels quels (« docs: Add… », « Summary Report:
  Git… », « blame: add… », « New year, new GitHub: … », « New Gingerbread API: StrictMode »,
  « Year class: A… », « Android at Google I/O 2013: Keynote Wrapup »).
- Longueur : 131 à 183 mots (deux cas à 182 et 183, `mobile/lecon-15` et `-11`).
- **Un sujet = un seul cours** : chaque sujet cherché dans tout `pages/` (texte et sources), dans
  `tools/cas-reels/lots/foyers.md` et dans le fichier commun des réservations du lot 2, où les 39 sujets
  sont inscrits. Deux sujets écartés en route : **SHAttered** (l'ancien `git/lecon-15`) est raconté par
  son foyer `crypto/lecon-01` ; **le lancement de GitHub Pages (2008)**, que j'avais d'abord pris pour
  `git/lecon-09`, est déjà raconté par `ruby/lecon-22` (vu par `doublons.js`) — remplacé par les dépôts
  privés gratuits (2019), et la réservation corrigée (« REMPLACE ma ligne… »). `doublons.js` : 2 sources
  partagées, celles du lot 1, aucune nouvelle.
- **Comportements testés** (Git 2.54, dépôt jetable) : `git filter-branch` affiche son avertissement
  « glut of gotchas… use … git filter-repo » puis attend 10 s (12 s mesurées contre 1 s avec
  `FILTER_BRANCH_SQUELCH_WARNING=1` ; `sleep 10` dans le script) ; `git -c init.defaultBranch=main init`
  crée bien `main`. Dates de version vérifiées sur les étiquettes Git (API GitHub : v1.5.0 du 14/02/2007,
  v1.5.4 du 02/02/2008, v2.5.0, v2.13.0, v2.23.0 du 16/08/2019, v2.24.0 du 04/11/2019, v2.28.0 du
  27/07/2020) et sur les commits cités (auteur, date, message, parents).
- Toutes les URL citées ont été ouvertes (curl ; WebFetch pour la FTC, qui refuse curl ; la
  documentation d'Apple, rendue en JavaScript, lue aussi par son JSON). PDF lus avec `pypdf` : l'article
  NDSS 2019 (`meli.pdf`). Chaque phrase des 39 textes a été relue contre sa source avant écriture.

## Cas par cas — `git`

Légende : **INVÉRIFIABLE** (récit anonyme ou usage général, sans sujet que une source puisse
confirmer) · **INEXACT** (sujet réel, détail faux ou sans source) · **INVENTÉ** (fiction présentée comme
réelle). Identifiant : `pages/git/lecon-NN.html#1`.

| # | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| 01 | INVÉRIFIABLE (récit général : « Lundi, une page qui marchait vendredi plante ») | remplacé | Cas réel — Git naît de l'abandon de BitKeeper (2005) | https://lkml.iu.edu/hypermail/linux/kernel/0504.0/1540.html ; https://github.com/git/git/commit/e83c5163316f89bfbde7d9ab23ca2e25604af290 |
| 02 | INVÉRIFIABLE (tutoriel à la deuxième personne) | remplacé | Cas réel — Git 1.5.0 met l'index au premier plan (2007) | https://github.com/git/git/blob/master/Documentation/RelNotes/1.5.0.adoc ; https://github.com/git/git/blob/master/Documentation/RelNotes/1.5.4.adoc ; étiquette https://github.com/git/git/releases/tag/v1.5.0 |
| 03 | INVÉRIFIABLE (récit anonyme : `panier.js`, commit `3f2a1b0`) | remplacé | Cas réel — le commit initial du noyau Linux (2005) | https://github.com/torvalds/linux/commit/1da177e4c3f41524e886b7f1b8a0c1fc7321cac2 |
| 04 | INVÉRIFIABLE (général, déjà jugé ainsi en B2) | remplacé | Cas réel — GitHub passe de master à main (2020) | https://github.blog/changelog/2020-10-01-the-default-branch-for-newly-created-repositories-is-now-main/ ; https://github.com/github/renaming ; https://github.com/git/git/blob/master/Documentation/RelNotes/2.28.0.adoc |
| 05 | INEXACT en partie (produits nommés) : vrai pour GitHub (`--no-ff`, doc), non vérifié pour GitLab et Bitbucket ; « Merge pull request #42 » est un message de GitHub seul | corrigé : recentré sur GitHub, daté (squash 1er avril 2016, rebase 26 septembre 2016) | Cas réel — GitHub et ses trois façons de fusionner (2016) | https://docs.github.com/en/pull-requests/reference/pull-request-merges ; https://github.blog/open-source/git/squash-your-commits/ ; https://github.blog/developer-skills/github/rebase-and-merge-pull-requests/ |
| 06 | INVÉRIFIABLE (général : CHANGELOG, `package-lock.json`) | remplacé | Cas réel — GitLab et la crise des conflits de CHANGELOG (2018) | https://about.gitlab.com/blog/solving-gitlabs-changelog-conflict-crisis/ |
| 07 | INVÉRIFIABLE (général, B2 idem) | remplacé | Cas réel — des secrets retirés, mais toujours dans l'historique (2019) | https://www.ndss-symposium.org/ndss-paper/how-bad-can-it-git-characterizing-secret-leakage-in-public-github-repositories/ (PDF lu : ndss2019_04B-3_Meli_paper.pdf) |
| 08 | INEXACT en partie (événement daté) : « depuis août 2021 » juste ; « blocage n° 1 des débutants » sans source | corrigé : annonce du 15 décembre 2020, date du 13 août 2021, coupures du 30 juin et du 28 juillet, raisons de GitHub ; affirmation non sourcée retirée | Cas réel — GitHub refuse le mot de passe pour Git (2021) | https://github.blog/security/application-security/token-authentication-requirements-for-git-operations/ |
| 09 | INVÉRIFIABLE (général : « une bonne partie des sites de documentation ») | remplacé (GitHub Pages 2008 écarté : sujet de `ruby/lecon-22`) | Cas réel — GitHub rend gratuits les dépôts privés (2019) | https://github.blog/news-insights/product-news/new-year-new-github/ |
| 10 | INVÉRIFIABLE (général, produits nommés : « aucune ligne n'entre sans revue ») | remplacé | Cas réel — Microsoft étudie la revue de code (2013) | https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/ |
| 11 | INVÉRIFIABLE (produits nommés, chiffres sans source : « des centaines de PR chaque semaine », « forké des dizaines de milliers de fois ») | remplacé | Cas réel — Hacktoberfest et les PR indésirables (2020) | https://dev.to/devteam/an-update-on-hacktoberfest-37a ; https://www.digitalocean.com/blog/hacktoberfest-recap2020 |
| 12 | INVÉRIFIABLE (général, produits nommés) | remplacé | Cas réel — le noyau Linux écrit ses règles du rebase (2019) | https://www.kernel.org/doc/html/latest/maintainer/rebasing-and-merging.html ; https://github.com/torvalds/linux/commit/d95ea1a4e1fb |
| 13 | INEXACT en partie (produits nommés) : bisect sur le noyau Linux, vrai ; Firefox et « des milliers de commits » sans source | corrigé : recentré sur le noyau, témoignage d'Ingo Molnar (15 étapes en 20-30 min « dans le meilleur cas ») | Cas réel — git bisect dans le noyau Linux (2009) | https://git-scm.com/docs/git-bisect-lk2009 (et son source `Documentation/git-bisect-lk2009.adoc`, date 2009/11/08) |
| 14 | INVÉRIFIABLE (général : « quelques minutes », « plusieurs milliers d'euros ») | remplacé | Cas réel — GitHub bloque les secrets au moment du push (2024) | https://github.blog/news-insights/product-news/keeping-secrets-out-of-public-repositories/ |
| 15 | INEXACT en partie (produit nommé) : « des téraoctets économisés » introuvable ; SHAttered est le sujet de `crypto/lecon-01` | corrigé : la déduplication des forks, sourcée (alternates, `network.git`, 11 000 forks de Rails) ; SHAttered et SHA-256 retirés | Cas réel — les forks de GitHub partagent leurs objets (2015) | https://github.blog/open-source/git/counting-objects/ |
| 16 | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — Git 2.5 et git worktree (2015) | https://github.blog/open-source/git/git-2-5-including-multiple-worktrees-and-triangular-workflows/ |
| 17 | INVÉRIFIABLE (anonyme : push forcé d'un vendredi soir) | remplacé | Cas réel — Jenkins et 186 dépôts rembobinés par un push forcé (2013) | https://www.jenkins.io/blog/2013/11/25/summary-report-git-repository-disruption-incident-of-nov-10th/ |
| 18 | INVÉRIFIABLE (anonyme : « un projet web réel », 22 min → 5 min) | remplacé | Cas réel — Shopify accélère la CI de son monolithe (2021) | https://shopify.engineering/faster-shopify-ci |
| 19 | INVÉRIFIABLE (anonyme : clé AWS, minage) | remplacé | Cas réel — Git déconseille filter-branch (2019) | https://github.com/git/git/blob/master/Documentation/RelNotes/2.24.0.adoc ; https://git-scm.com/docs/git-filter-branch |
| 20 | INEXACT en partie (produits nommés) : rétroportage chez Linux, PostgreSQL, Chromium, vrai en général ; « faille sur la 17 rejouée sur 16, 15, 14 » illustratif | corrigé : recentré sur les règles des noyaux « -stable » | Cas réel — les noyaux Linux « -stable » et le rétroportage (2005) | https://www.kernel.org/doc/html/latest/process/stable-kernel-rules.html ; https://github.com/torvalds/linux/commit/fc185d95ecf3 |
| 21 | INVÉRIFIABLE (anonyme : « une développeuse ») | remplacé | Cas réel — Git 2.13 et les inclusions conditionnelles (2017) | https://github.blog/open-source/git/git-2-13-has-been-released/ |
| 22 | INVÉRIFIABLE (anonyme : « la développeuse dégaine la pioche ») | remplacé | Cas réel — git blame apprend à ignorer un commit (2019) | https://github.com/git/git/commit/ae3f36dea16e51041c56ba9ed6b38380c8421816 ; https://github.com/git/git/blob/master/Documentation/RelNotes/2.23.0.adoc ; https://git-scm.com/docs/git-blame |
| 23 | INEXACT en partie (produits nommés) : patchs du noyau par courriel, vrai ; « depuis 2005 » attache à Git une pratique antérieure ; le « site classifié » et son `.bundle` sans source | remplacé (le projet Git et sa liste de diffusion, GitGitGadget) | Cas réel — le projet Git refuse les pull requests (2019) | https://gitgitgadget.github.io/ ; https://github.com/git/git/commit/c3a7dd70c4af (modèle `.github/PULL_REQUEST_TEMPLATE.md` lu) |
| 24 | INVÉRIFIABLE (anonyme : « une développeuse reprend un service legacy ») | remplacé | Cas réel — GitHub publie git-sizer (2018) | https://github.blog/developer-skills/github/measuring-the-many-sizes-of-a-git-repository/ |

## Cas par cas — `mobile`

Identifiant : `pages/mobile/lecon-NN.html#1`.

| # | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| 01 | INVÉRIFIABLE (anonyme : app de prise de notes) | remplacé | Cas réel — iPhone OS 4 et le multitâche (2010) | https://www.apple.com/newsroom/2010/04/08Apple-Previews-iPhone-OS-4/ ; https://developer.apple.com/documentation/uikit/uiapplicationdelegate/applicationdidenterbackground(_:) ; https://developer.apple.com/documentation/uikit/uiapplicationdelegate/applicationwillterminate(_:) |
| 02 | INVÉRIFIABLE (anonyme : jeune pousse en Flutter, banque en natif) | remplacé | Cas réel — Airbnb abandonne React Native (2018) | https://medium.com/airbnb-engineering/react-native-at-airbnb-f95aa460be1c ; https://medium.com/airbnb-engineering/sunsetting-react-native-1868ba28e30a |
| 03 | INVÉRIFIABLE (anonyme : journal intime ; même récit que la leçon 01) | remplacé | Cas réel — Android 3.0 et le moment où l'app peut être tuée (2011) | https://developer.android.com/reference/android/app/Activity ; https://developer.android.com/reference/android/os/Build.VERSION_CODES |
| 04 | INVÉRIFIABLE (anonyme : app de recettes, « favori fantôme ») | remplacé | Cas réel — Google et la source unique de vérité (2017) | https://android-developers.googleblog.com/2017/05/android-and-architecture.html ; https://developer.android.com/topic/architecture |
| 05 | INVÉRIFIABLE (anonyme : portage iOS → Android) | remplacé | Cas réel — Android et le « retour prédictif » (2022) | https://android-developers.googleblog.com/2022/07/prepare-your-app-to-support-predictive-back-gestures.html ; https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture |
| 06 | INVENTÉ (incident de Carnet, l'app fictive du fil rouge, raconté comme réel) | remplacé | Cas réel — Apple et la source de vérité de SwiftUI (2019) | https://developer.apple.com/videos/play/wwdc2019/226/ (transcription lue) |
| 07 | INVÉRIFIABLE (anonyme : galerie de photos) | remplacé | Cas réel — Facebook ouvre Litho pour ses listes Android (2017) | https://engineering.fb.com/2017/04/18/android/open-sourcing-litho-a-declarative-ui-framework-for-android/ |
| 08 | INVÉRIFIABLE (anonyme : app de terrain, boutons de 20 pt) | remplacé | Cas réel — l'iPhone X et sa zone sûre (2017) | https://developer.apple.com/videos/play/tech-talks/801/ (transcription lue ; datePublished 2017-09-12) |
| 09 | INVÉRIFIABLE (anonyme : photos en base64 dans les préférences) | remplacé | Cas réel — Android remplace SharedPreferences par DataStore (2020) | https://android-developers.googleblog.com/2020/09/prefer-storing-data-with-jetpack.html |
| 10 | INVÉRIFIABLE (anonyme : app de transport) ; réserve de B2 confirmée : sous Android, un appel réseau sur le fil principal lève `NetworkOnMainThreadException` (« elle ne plantait pas » n'y vaut pas) | remplacé | Cas réel — StrictMode et le réseau sur le fil principal (2010) | https://android-developers.googleblog.com/2010/12/new-gingerbread-api-strictmode.html ; https://developer.android.com/reference/android/os/NetworkOnMainThreadException |
| 11 | INVÉRIFIABLE (anonyme : notes perdues dans le métro) | remplacé | Cas réel — Trello passe ses apps mobiles en hors-ligne (2017) | https://www.atlassian.com/blog/trello/trello-mobile-offline ; https://www.atlassian.com/blog/how-we-build/sync-architecture ; https://www.atlassian.com/blog/how-we-build/syncing-changes |
| 12 | INVÉRIFIABLE (anonyme : app de balade, B2 idem) | remplacé | Cas réel — la FTC et la lampe torche « Brightest Flashlight » (2013) | https://www.ftc.gov/news-events/news/press-releases/2013/12/android-flashlight-app-developer-settles-ftc-charges-it-deceived-consumers (ouverte par WebFetch ; curl reçoit un 404 du site) |
| 13 | INVÉRIFIABLE (anonyme : app de livraison) | remplacé | Cas réel — Android O et les canaux de notification (2017) | https://android-developers.googleblog.com/2017/03/first-preview-of-android-o.html ; https://developer.android.com/develop/ui/compose/notifications/channels |
| 14 | INVÉRIFIABLE (anonyme : « une petite équipe ») | remplacé | Cas réel — Facebook classe les téléphones par « année » (2014) | https://engineering.fb.com/2014/11/06/android/year-class-a-classification-system-for-android/ |
| 15 | INVENTÉ (publication de Carnet, l'app fictive du fil rouge : rejet par la revue d'Apple, crash limité à 5 %) | remplacé | Cas réel — Google Play et les déploiements progressifs (2013) | https://android-developers.googleblog.com/2013/05/android-at-google-io-2013-keynote-wrapup.html ; https://support.google.com/googleplay/android-developer/answer/6346149?hl=en ; https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases |

## Décomptes

| | git | mobile | total |
|---|---:|---:|---:|
| « Cas réel » lus | 24 | 15 | **39** |
| VRAI tel quel | 0 | 0 | 0 |
| INEXACT (en partie) | 6 | 0 | 6 |
| INVÉRIFIABLE | 18 | 13 | 31 |
| INVENTÉ | 0 | 2 | 2 |
| gardés tels quels | 0 | 0 | 0 |
| corrigés sur leur sujet | 5 | 0 | 5 |
| remplacés | 19 | 15 | 34 |
| renommés « Scénario » | 0 | 0 | 0 |
| conformes à la règle (`--cas-reel`) | 0 → 24 | 0 → 15 | 0 → 39 |

Sources : toutes primaires (notes de version, commits, documentation officielle, blogs d'ingénierie des
organisations concernées, article de conférence, communiqué d'un régulateur) ; aucune presse. Seule
exception relative : DEV (`git/lecon-11`), coparrain de Hacktoberfest, qui cite DigitalOcean ; le bilan
chiffré vient de DigitalOcean lui-même.

## Contrôles (sur l'état commité, avant le commit du rapport)

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=git` | **0** (24/24 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=mobile` | **0** (15/15 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b5-git-mobile 1b8d94b` | OK (39 pages, 39 zones avant et après, octets identiques hors « Cas réel ») |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées (celles du lot 1), aucune nouvelle |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b5-git-mobile 1b8d94b` | **1 écart**, structurel (voir ci-dessous) |
| 0 CR dans les 39 fichiers | oui |
| `node tools/verif.js --rapide` | voir la section suivante |

**L'écart de `lexique-diff`, expliqué** : `pages/git/lecon-22.html` « gagne » le mot `source`. Il ne vient
d'aucun texte visible : c'est la classe obligatoire `cas-reel__source` de la ligne de source, que
l'outil (comme `mesure-lexique-qcm.js`) lit dans le HTML brut et découpe en `cas-reel` + `source`. Le mot
est absent du reste de cette page et figure dans deux distracteurs de ses QCM (« …le contenu du code
source », « …du code source complet »). Il entrera dans toute page dont un QCM contient « source » sans
que la page l'ait déjà : impossible à éviter sans déroger à la règle de B3. Les deux cliquets restent à 0.
Toutes les autres pages : 0 écart (les mots d'options qui n'étaient dans la page que par l'ancien récit
ont été gardés : « vendredi » et « reflog » en `git/lecon-17`, « robots » et « régénérer » en
`git/lecon-14`, « moindre », « exports », « commités », « affiche » en `git/lecon-24`, « tunnel »,
« trajets », « empiler » en `mobile/lecon-11`, etc. — chaque fois dans une phrase vraie).

## verif.js --rapide

`node tools/verif.js --rapide` : **code 1**, 54 étapes jouées en 277,3 s, **2 rouges, tous deux tolérés** :
- `donnees` — invariant **I18** seul : `js/search-index.js` publié diverge du contenu régénéré (+4 959 o),
  conséquence attendue des 39 encadrés réécrits ; l'orchestrateur régénère les index après la fusion ;
- `doc-rec` — la page `doc/lecon-04` publie le nombre de leçons qui citent la source de leur « Cas
  réel » ; la mesure en trouve désormais **391** (les lignes de source de cette part le font monter).
  À régénérer après la fusion ; aucune ligne de source déformée pour le garder vert.

`doc-ref` est vert. Toutes les autres étapes (52) sont vertes. Trace : `scratchpad/.verif-journal/2026-11-14T08-50-09/`.

## Ce qui reste ouvert

- **Contre-relecture** : à faire par un autre agent, comme au lot 1. Points où j'ai le plus douté :
  `git/lecon-14` (« ses robots d'analyse (le *secret scanning*) » paraphrase la détection automatique de
  GitHub ; le billet dit « GitHub has detected ») ; `git/lecon-17` (la dernière phrase, « Pas besoin
  d'un vendredi soir de malchance : un réglage par défaut a suffi », garde le mot « vendredi » d'un
  distracteur sans rien affirmer de faux : l'incident a eu lieu un dimanche matin, et le rapport ne le
  dit pas) ; `git/lecon-11` (la date du 3 octobre 2020 pour les nouvelles règles vient de la citation de
  DigitalOcean reprise par DEV : « avant le 2020-10-03 12:00:00 UTC ») ; `git/lecon-20` (« Greg KH » est
  le nom de l'auteur tel que l'écrit le commit) ; `mobile/lecon-12` (la page de la FTC ne se lit pas par
  curl ; lue par WebFetch) ; `mobile/lecon-04` (le guide d'architecture cité pour la règle SSOT est la
  version actuelle, pas celle de 2017 : le texte le dit).
- **Phrases de liaison** : chaque cas finit par une phrase qui relie le fait à la notion de la leçon
  (« C'est le patron de cette leçon… »). Elles n'affirment rien de neuf sur le sujet réel, mais la
  contre-relecture doit les lire comme telles.
- **Registre des foyers** (`tools/cas-reels/lots/foyers.md`) : à compléter par l'orchestrateur après
  fusion avec les sujets célèbres de ce lot que d'autres cours pourraient vouloir : naissance de Git et
  BitKeeper (`git/lecon-01`), Jenkins et le push forcé (`git/lecon-17`), NDSS 2019 « How Bad Can It
  Git? » (`git/lecon-07`), Airbnb et React Native (`mobile/lecon-02`), StrictMode (`mobile/lecon-10`),
  FTC contre Brightest Flashlight (`mobile/lecon-12`), « year class » de Facebook (`mobile/lecon-14`).
- **Hors encadré, vu en lisant** (non touché) : le corps de `mobile/lecon-13` présente déjà les canaux de
  notification d'Android ; le cas les date. Rien de faux repéré dans les corps lus.
- **Index dérivés** (`js/search-index.js`, etc.) et chiffres du cours `doc` : à régénérer par
  l'orchestrateur après fusion.

## Consignes de fusion

- Branche `v18/b5-git-mobile`, partie de `1b8d94b` ; commits : `d2b3e63` (git, 24 pages), `4e4a386`
  (mobile, 15 pages), puis le commit de ce rapport. Rien n'est poussé.
- Fichiers touchés : `pages/git/lecon-01.html` à `lecon-24.html`, `pages/mobile/lecon-01.html` à
  `lecon-15.html`, `en-cours/rapports-v18/b5-git-mobile.md`. Aucun QCM, aucun `js/data.js`, aucun index
  dérivé, aucun cliquet figé (`tools/qcm-lexique-reference.json` inchangé).
- Pas de conflit attendu avec les autres copies du lot 2 (cours disjoints). Le fichier commun des
  réservations porte les 39 sujets de cette part (et la ligne qui remplace GitHub Pages par les dépôts
  privés gratuits pour `git/lecon-09`).
