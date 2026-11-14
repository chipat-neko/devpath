# Rapport V18 — case B4, lot 1 : le cours `python` (copie `b4-python`, branche `v18/b4-python`)

Copie de travail `D:\test-claude-b4-python`, partie de `a244d0f`. Part traitée : les **50 « Cas réel »**
du cours `python` (un par leçon, `pages/python/lecon-01.html` à `lecon-50.html`). Scripts de travail et
pièces téléchargées dans `scratchpad/b4-python/` (ignoré par git) : `cas.js` (les 50 textes),
`appliquer.js` (remplacement de l'encadré seul, avec preuve d'intégrité), `originaux.json` (les 50
encadrés d'origine), `typo.js` (contrôle typographique).

**En une phrase** : `node tools/verif-contenu.js --cas-reel --cours=python` passe de **50 hors de la
règle à 0** ; sur les 50 cas trouvés, **3 étaient VRAIS, 7 INEXACTS, 35 INVÉRIFIABLES** (récits
anonymes ou usages généraux) et **5 généraux à produits nommés, non datés** ; **2 sont gardés tels
quels** (titre et source ajoutés), **6 corrigés sur leur sujet**, **42 remplacés** par un cas réel daté
et sourcé sur la même notion, **0 renommé « Scénario »**.

## Ce qui a été fait

- Pour chaque leçon : seul l'intérieur du `div.callout__body` de l'encadré « Cas réel » change
  (type d'encadré, icône et structure gardés). `appliquer.js` vérifie, pour chaque fichier, que tout
  ce qui précède et suit l'encadré est identique à l'octet ; `git diff --numstat` : 1 ligne changée
  par leçon, 2 pour `lecon-26` et `lecon-28`.
- **Deux intertitres changés** (lus par l'apprenant comme partie du cas, et qui annonçaient
  l'ancien récit) : `lecon-26` « Cas réel : un agrégateur de prix » → « Cas réel : le GIL mesuré » ;
  `lecon-28` « Cas réel : le rapport du lundi matin » → « Cas réel : une commande mal saisie ». Les
  intertitres de `lecon-24`, `-25`, `-27` restent justes et n'ont pas bougé.
- Forme de la règle partout : titre `Cas réel — sujet (année)`, dernier paragraphe
  `<p class="cas-reel__source">Source : …</p>` avec date et lien. Typographie : `&nbsp;` devant
  « : ; ? ! » et dans « » (`typo.js` : 0 défaut hors deux titres anglais cités tels quels).
- Aucun QCM, aucun `js/data.js`, aucun index dérivé touché. 0 CR dans les 50 fichiers.
- Toutes les URL citées ont été ouvertes (curl ou WebFetch) ; les PDF lus avec `pypdf`
  (`wp322.pdf`). Chaque affirmation des 50 textes a été confrontée à la source citée avant écriture.

## Cas par cas

Légende de l'état trouvé : **VRAI** · **INEXACT** (quoi) · **INVÉRIFIABLE** (récit anonyme ou usage
général sans sujet identifiable) · **GÉNÉRAL-PRODUITS** (liste d'usages de produits nommés, sans
événement ni date, non vérifiée affirmation par affirmation). Identifiant : `pages/python/lecon-NN.html#1`.

| # | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| 01 | INVÉRIFIABLE (général : f-strings dans les courriels et les journaux) | remplacé | Cas réel — la PEP 498 et la naissance des f-strings (2015) | https://peps.python.org/pep-0498/ |
| 02 | INVÉRIFIABLE (général : conversion des saisies) | remplacé | Cas réel — les noms de gènes changés en dates par Excel (2016) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4994289/ |
| 03 | INVÉRIFIABLE (général : usages du modulo) | remplacé | Cas réel — Guido van Rossum explique la division entière (2010) | https://python-history.blogspot.com/2010/08/why-pythons-integer-division-floors.html |
| 04 | INVÉRIFIABLE (général : clauses de garde) | remplacé | Cas réel — le bogue « goto fail » d'Apple (2014) | https://support.apple.com/en-us/103608 ; https://www.imperialviolet.org/2014/02/22/applebug.html |
| 05 | INVÉRIFIABLE (général : traitement de fichiers) | remplacé | Cas réel — la PEP 234 et le `for line in file` (2001) | https://peps.python.org/pep-0234/ |
| 06 | INVÉRIFIABLE (récit anonyme : `valider_mot_de_passe`) | remplacé (même notion : une seule source de vérité) | Cas réel — le NIST change les règles des mots de passe (2017) | https://pages.nist.gov/800-63-3/sp800-63b.html |
| 07 | INVÉRIFIABLE (général : grille de jeu) | remplacé | Cas réel — la FAQ officielle de Python et les listes partagées (2026) | https://docs.python.org/3/faq/programming.html |
| 08 | INVÉRIFIABLE (général : JSON, visiteurs uniques) | remplacé | Cas réel — l'ordre des dictionnaires devient une règle (2017) | https://mail.python.org/pipermail/python-dev/2017-December/151283.html ; https://docs.python.org/3/whatsnew/3.6.html ; https://docs.python.org/3/whatsnew/3.7.html |
| 09 | INVÉRIFIABLE (général : normaliser une adresse) | remplacé | Cas réel — Spotify et les pseudos en Unicode (2013) | https://engineering.atspotify.com/2013/06/creative-usernames |
| 10 | INVÉRIFIABLE (général) | remplacé | Cas réel — le « sale petit secret » des compréhensions (2010) | https://python-history.blogspot.com/2010/06/from-list-comprehensions-to-generator.html |
| 11 | INVÉRIFIABLE (général : module `json`) | remplacé | Cas réel — la PEP 594 retire des « piles mortes » (2019) | https://peps.python.org/pep-0594/ ; https://docs.python.org/3/whatsnew/3.13.html |
| 12 | INVÉRIFIABLE (général : réglages en JSON) | remplacé (fichier de configuration + erreur non gérée) | Cas réel — Cloudflare et un fichier de configuration trop gros (2025) | https://blog.cloudflare.com/18-november-2025-outage/ |
| 13 | GÉNÉRAL-PRODUITS (ORM Django/SQLAlchemy ; même sujet que le cas de `lecon-40`) | remplacé (doublon évité ; notion : classes, héritage, polymorphisme) | Cas réel — pathlib, des chemins devenus objets (2012) | https://peps.python.org/pep-0428/ |
| 14 | INVÉRIFIABLE (général : journaux, `chunksize`) | remplacé | Cas réel — Python 3.0 rend `map`, `filter` et `zip` paresseux (2008) | https://docs.python.org/3/whatsnew/3.0.html |
| 15 | INEXACT (produits nommés) : Django ne lance pas `ruff` (son pre-commit et sa CI lancent black, isort et flake8) ; pandas et requests non vérifiés | corrigé, recentré sur la décision datée de Django | Cas réel — Django adopte black (2019) | https://github.com/django/deps/blob/main/final/0008-black.rst (lu en brut) ; https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/ ; contrôle : `.pre-commit-config.yaml` et `.github/workflows/linters.yml` du dépôt django/django |
| 16 | INVÉRIFIABLE (général : usages des regex) | remplacé | Cas réel — le motif piégé du module `urllib`, CVE-2020-8492 (2020) | https://python-security.readthedocs.io/vuln/urllib-basic-auth-regex.html ; https://github.com/python/cpython/pull/18284 (correctif, via l'API GitHub) |
| 17 | INVÉRIFIABLE (général : visioconférence ; B2 : idem) | remplacé | Cas réel — le bogue du 29 février de Microsoft Azure (2012) | https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/ ; `ValueError` de `date(2012,2,29).replace(year=2013)` vérifiée en local |
| 18 | INVÉRIFIABLE (récit anonyme : nouveau développeur) | remplacé | Cas réel — Debian 12 refuse le pip global (2023) | https://www.debian.org/releases/bookworm/amd64/release-notes/ch-information.en.html ; https://www.debian.org/News/2023/20230610 ; https://peps.python.org/pep-0668/ |
| 19 | INVÉRIFIABLE (récit anonyme : sauvegarde nocturne) | remplacé | Cas réel — les sauvegardes muettes de GitLab (2017) | https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/ |
| 20 | INVÉRIFIABLE (récit anonyme : projet open source) | remplacé | Cas réel — l'attaque du paquet ultralytics sur PyPI (2024) | https://blog.pypi.org/posts/2024-12-11-ultralytics-attack-analysis/ |
| 21 | INVÉRIFIABLE (général : photo = ndarray) | remplacé | Cas réel — NumPy et la première image d'un trou noir (2020) | https://www.nature.com/articles/s41586-020-2649-2 |
| 22 | INVÉRIFIABLE (récit anonyme : boutique en ligne) | remplacé | Cas réel — l'erreur de tableur de Reinhart et Rogoff (2013) | https://peri.umass.edu/images/WP322.pdf (lu avec pypdf) |
| 23 | INVÉRIFIABLE (récit anonyme : « dans beaucoup d'entreprises ») | remplacé | Cas réel — matplotlib passe de `jet` à `viridis` (2015) | https://bids.github.io/colormap/ ; https://matplotlib.org/stable/release/prev_whats_new/dflt_style_changes.html |
| 24 | INVÉRIFIABLE (général ; B2 : le JSON montré n'est pas le format réel d'Open-Meteo) | corrigé : même sujet réel, avec la vraie requête, la vraie structure de réponse (appelée le 14/11/2026) et les quotas | Cas réel — l'API météo Open-Meteo (2026) | https://open-meteo.com/en/docs ; https://open-meteo.com/en/terms ; l'appel `https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current=temperature_2m,wind_speed_10m` |
| 25 | INEXACT (produits nommés) : « WhatsApp y stocke tes messages » et « Firefox et Chrome y rangent historique, cookies, marque-pages » ne sont pas dans la source de SQLite | corrigé : ne garde que ce que dit sqlite.org | Cas réel — SQLite, la base la plus déployée (2026) | https://www.sqlite.org/mostdeployed.html ; https://www.sqlite.org/about.html |
| 26 | INVÉRIFIABLE (récit anonyme, chiffres d'illustration) | remplacé ; intertitre changé | Cas réel — la PEP 371 mesure le GIL (2008) | https://peps.python.org/pep-0371/ |
| 27 | INVÉRIFIABLE (général : analyser un texte) | remplacé (même thème : compter les mots d'un texte) | Cas réel — le correcteur orthographique de Peter Norvig (2007) | https://norvig.com/spell-correct.html |
| 28 | INVÉRIFIABLE (récit anonyme : « des milliers d'équipes ») | remplacé ; intertitre changé | Cas réel — la commande qui a arrêté Amazon S3 (2017) | https://aws.amazon.com/message/41926/ |
| 29 | GÉNÉRAL-PRODUITS (Flask, FastAPI, Django, pytest, Celery) | remplacé par le fait daté ; seul Flask, vérifié, est gardé | Cas réel — la PEP 318 et le `@` des décorateurs (2004) | https://peps.python.org/pep-0318/ ; https://flask.palletsprojects.com/en/stable/quickstart/ |
| 30 | GÉNÉRAL-PRODUITS (descripteurs Django/SQLAlchemy, surcharge NumPy/pandas ; Django déjà au cas de `lecon-40`) | remplacé | Cas réel — la PEP 465 crée l'opérateur `@` (2014) | https://peps.python.org/pep-0465/ |
| 31 | VRAI (B2, produits nommés) mais général, non daté, et sur la paresse (notion de `lecon-14`) plutôt que sur les coroutines de cette leçon | remplacé | Cas réel — les PEP 342 et 380 font des générateurs des coroutines (2005) | https://peps.python.org/pep-0342/ ; https://peps.python.org/pep-0380/ |
| 32 | INEXACT (produit nommé) : « mypy est né chez Dropbox » — il est né à Cambridge, pendant la thèse de J. Lehtosalo, avant son arrivée chez Dropbox ; « Instagram a créé pyre » non vérifié, retiré | corrigé, recentré sur le billet de Dropbox | Cas réel — Dropbox et mypy (2019) | https://dropbox.tech/application/our-journey-to-type-checking-4-million-lines-of-python |
| 33 | VRAI (B2, revérifié : `HTTPStatus` sous-classe d'`IntEnum`, 404 `NOT_FOUND`, `StrEnum` ajouté en 3.11, `TextChoices`, `Enum` de SQLAlchemy qui accepte une énumération PEP 435) | vérifié tel quel ; titre et source ajoutés | Cas réel — `HTTPStatus`, `TextChoices` et `StrEnum` (2022) | https://docs.python.org/3/library/http.html ; https://docs.python.org/3/library/enum.html ; https://docs.python.org/3/whatsnew/3.11.html ; https://docs.djangoproject.com/en/stable/ref/models/fields/ ; https://docs.sqlalchemy.org/en/20/core/type_basics.html |
| 34 | GÉNÉRAL-PRODUITS (sqlite3, Django, SQLAlchemy, pytest, tempfile, PyTorch) | remplacé par la PEP fondatrice | Cas réel — la PEP 343 et l'instruction `with` (2005) | https://peps.python.org/pep-0343/ |
| 35 | INVÉRIFIABLE (récit anonyme : passerelle d'API, 8 × 80 ms) | remplacé | Cas réel — la PEP 492 introduit `async` et `await` (2015) | https://peps.python.org/pep-0492/ |
| 36 | INVÉRIFIABLE (général : pipeline de photos, Gunicorn) | remplacé | Cas réel — Python 3.2 réécrit le GIL (2011) | https://docs.python.org/3/whatsnew/3.2.html |
| 37 | INVÉRIFIABLE (récit anonyme : frais de port) | remplacé | Cas réel — Guido van Rossum et le sort de `reduce()` (2005) | https://www.artima.com/weblogs/viewpost.jsp?thread=98196 ; https://docs.python.org/3/whatsnew/3.0.html |
| 38 | INVÉRIFIABLE (récit anonyme : TVA, taux 0 % pris pour « absent ») | remplacé (même défaut : une valeur limite jugée fausse) | Cas réel — quand minuit valait `False` en Python (2012) | https://github.com/python/cpython/issues/58144 (via l'API GitHub, avec ses premiers commentaires) ; https://docs.python.org/3/whatsnew/3.5.html |
| 39 | INVÉRIFIABLE (récit anonyme, chiffres d'illustration) | remplacé (même défaut : O(n²) caché, trouvé au profileur) | Cas réel — les six minutes de chargement de GTA Online (2021) | https://nee.lv/2021/02/28/How-I-cut-GTA-Online-loading-times-by-70/ |
| 40 | INEXACT (produit nommé) : « la métaclasse … prépare les migrations » — rien de tel dans `ModelBase` ; « SQLAlchemy fait de même avec `DeclarativeMeta` » — vrai pour l'ancienne `declarative_base()` seulement, `DeclarativeBase` de SQLAlchemy 2.0 n'a plus de métaclasse | corrigé | Cas réel — les métaclasses de Django et de SQLAlchemy (2023) | https://github.com/django/django/blob/main/django/db/models/base.py (lu en brut) ; https://peps.python.org/pep-0487/ ; https://docs.sqlalchemy.org/en/20/orm/mapping_api.html ; https://www.sqlalchemy.org/blog/2023/01/26/sqlalchemy-2.0.0-released/ |
| 41 | INEXACT (événement daté) : motif cité `(?:.*.*=.*)` (la partie critique est `.*(?:.*=.*)`, que Cloudflare lit `.*.*=.*`) ; « une trentaine de minutes » (27) ; « CPU à 100 % sur l'ensemble des serveurs » (près de 100 % sur les cœurs qui servent HTTP/HTTPS) ; correctif inexact (rétablir la protection CPU retirée par erreur, inspecter 3 868 règles, passer à re2 ou au moteur Rust) | corrigé | Cas réel — la panne mondiale de Cloudflare (2019) | https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/ |
| 42 | GÉNÉRAL-PRODUITS (NumPy, pandas, cryptography, scikit-learn, PyTorch) | remplacé par un fait daté sur la même frontière Python ↔ natif | Cas réel — la bibliothèque cryptography adopte Rust (2021) | https://cryptography.io/en/latest/changelog/ |
| 43 | VRAI (produits nommés, revérifié affirmation par affirmation) | vérifié, précisé (noms des groupes de points d'entrée) ; titre et sources ajoutés | Cas réel — pytest-cov et le groupe `pytest11` (2026) | https://docs.pytest.org/en/stable/how-to/writing_plugins.html ; https://github.com/pytest-dev/pytest-cov/blob/master/pyproject.toml (lu en brut) ; https://docs.sqlalchemy.org/en/20/core/connections.html ; https://filesystem-spec.readthedocs.io/en/latest/developer.html ; https://airflow.apache.org/docs/apache-airflow-providers/howto/create-custom-providers.html |
| 44 | INVÉRIFIABLE (récit anonyme : comparateur de vols) | remplacé | Cas réel — la PEP 703 rend le GIL facultatif (2023) | https://peps.python.org/pep-0703/ ; https://docs.python.org/3/whatsnew/3.13.html |
| 45 | INEXACT (récit anonyme ; B2) : Kubernetes n'envoie pas de SIGKILL immédiat ; le « handler SIGTERM qui draine 30 s » introuvable | remplacé (même notion : un build qui change sans le lockfile) | Cas réel — NumPy 2.0 et sa rupture d'ABI (2024) | https://numpy.org/doc/stable/release/2.0.0-notes.html ; https://numpy.org/news/ |
| 46 | INVÉRIFIABLE (récit anonyme : worker qui gonfle) | remplacé | Cas réel — Instagram et `gc.freeze()` (2017) | https://github.com/python/cpython/issues/75739 (via l'API GitHub) ; https://github.com/python/cpython/pull/3705 ; https://docs.python.org/3/library/gc.html |
| 47 | INVÉRIFIABLE (récit anonyme : service de paiement) | remplacé (bonnes pratiques de journalisation) | Cas réel — des mots de passe lisibles chez Facebook (2019) | https://about.fb.com/news/2019/03/keeping-passwords-secure/ |
| 48 | INVÉRIFIABLE (récit anonyme : sessions pickle dans Redis) | remplacé par le cas réel du même risque (sessions pickle de Django) | Cas réel — Django abandonne les sessions en pickle (2022) | https://docs.djangoproject.com/en/4.1/topics/http/sessions/ ; https://docs.djangoproject.com/en/dev/releases/4.1/ ; https://docs.djangoproject.com/en/dev/releases/5.0/ ; https://docs.python.org/3/library/pickle.html |
| 49 | INEXACT (produits nommés) : « Flask, Django, Sphinx reposent sur le même principe » — Django lit `INSTALLED_APPS`, Sphinx la liste `extensions` de `conf.py`, Flask s'initialise par `init_app` : pas de découverte par point d'entrée ; et même sujet (pytest11) que le cas de `lecon-43` | remplacé | Cas réel — `importlib.metadata` entre dans la bibliothèque standard (2019) | https://docs.python.org/3/whatsnew/3.8.html ; https://docs.python.org/3/whatsnew/3.10.html ; https://docs.python.org/3/library/importlib.metadata.html ; contrôle de l'inexact : https://docs.djangoproject.com/en/stable/ref/settings/ ; https://www.sphinx-doc.org/en/master/usage/configuration.html ; https://flask.palletsprojects.com/en/stable/extensions/ |
| 50 | INVÉRIFIABLE (récit anonyme : « le script d'un stagiaire ») | remplacé (même défaut : `except: pass` qui masque une erreur) | Cas réel — la PEP 760 contre les `except` nus (2024) | https://peps.python.org/pep-0760/ |

## Décomptes

| état trouvé | nombre |
|---|---:|
| VRAI | 3 (31, 33, 43) |
| INEXACT | 7 (15, 25, 32, 40, 41, 45, 49) |
| INVÉRIFIABLE (anonyme ou général) | 35 |
| GÉNÉRAL-PRODUITS, non daté, non vérifié affirmation par affirmation | 5 (13, 29, 30, 34, 42) |
| INVENTÉ (déclaré fictif) | 0 |

| action | nombre |
|---|---:|
| vérifié tel quel (titre + source ajoutés) | 2 (33, 43 — ce dernier précisé) |
| corrigé sur son sujet | 6 (15, 24, 25, 32, 40, 41) |
| remplacé par un cas réel sourcé, même notion | 42 |
| renommé « Scénario » | 0 |

Chiffres de B1/B2 rapprochés : 40 suspects sur 50 en B1 ; les 10 « ancrés » de B1 (15, 25, 29, 30,
32, 40, 41, 42, 43, 49) comptent ici 6 INEXACT, 1 VRAI et 3 GÉNÉRAL-PRODUITS — même constat que B2 :
plus un cas affirme, plus il se trompe. Les 5 cas déjà vus en B2 (17, 24, 31, 33, 45) gardent leur
verdict.

## Contrôles (sur l'état final, avant le dernier commit)

| commande | code |
|---|---:|
| `node tools/verif-contenu.js --cas-reel --cours=python` | **0** (50 lus, 50 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/verif.js --rapide` | **1** (50 étapes vertes sur 54, 866 s — voir ci-dessous) |

`verif.js --rapide`, rejoué sur l'état commité (`7453527`), signale **4 étapes** :

- **`donnees`** : l'invariant **I18 seul** est en erreur (`search-index.js` périmé : publié
  4 274 431 o, régénéré 4 281 350 o). C'est le rouge toléré par la consigne ; l'orchestrateur
  régénère l'index après la fusion (`build-index.js --write --fresh`).
- **`doc-ref`** (`tools/doc/verif-doc.js`, 2 échecs) et **`doc-rec`** (`tools/doc/verif-recherche.js`,
  1 échec) : ce sont des **chiffres de corpus** que les pages du cours `doc` impriment, et que les
  encadrés réécrits ont changés. Mesures du jour : « fragments distincts = 9 013 » et « leçons qui
  renvoient à un document = 86 » (verif-doc), « 60 portent un lien vers l'extérieur » (verif-recherche,
  `pages/doc/lecon-04.html` imprime encore 11). Les 50 lignes de source portent chacune un lien
  externe, et deux intertitres ont changé. **Preuve que c'est la seule cause** : en remettant les
  50 pages python de `a244d0f` (`git checkout a244d0f -- pages/python`), `verif-doc.js` rend
  0 (41 OK), `verif-recherche.js` 0 (76 contrôles), `verif-donnees.js` 0 erreur ; puis l'état commité
  a été restauré (`git checkout HEAD -- pages/python`, arbre propre). Ces pages sont **dérivées** :
  `tools/doc/gen.js` les assemble à partir de `tools/doc/corps/` et de marqueurs `@@MESURE:…@@`. Je ne
  les ai pas régénérées : chaque copie B4 ajoute ses propres liens, et ces chiffres ne seront justes
  qu'après la fusion de tous les lots. **À faire par l'orchestrateur après la fusion** :
  `node tools/doc/gen.js`, puis rejouer `verif-doc.js` et `verif-recherche.js`.
- **`gitcmdp`** (`tools/preuves/git-commandes.js`) : « Chrome n'a pas écrit son port dans 30 s :
  rien n'a pu être mesuré » — démarrage de Chrome trop lent sur une machine chargée par les autres
  copies (l'étape était verte au premier passage, 3,4 s). Rejouée seule aussitôt après : **code 0**,
  « 13 valeurs comparées, 0 écart ». Sans lien avec les pages python.

Premier passage de `--rapide` (pendant l'écriture, 530,7 s) : mêmes `donnees`, `doc-ref`, `doc-rec`,
et `gitcmdp` vert.

`node tools/verif.js --mutations` n'a pas été lancé (consigne).

## Ce qui reste ouvert, et les doutes

1. **Trois cas datés par la consultation, pas par un événement** : `lecon-07` (la FAQ de Python,
   « mise à jour du 14 novembre 2026 »), `lecon-24` (l'API Open-Meteo, appelée le 14/11/2026),
   `lecon-43` (pytest-cov, documentation consultée en 2026). Ils sont vrais et sourcés, mais l'année du
   titre est celle du document lu. La valeur exacte renvoyée par Open-Meteo (3,3 °C à 4 h 15 UTC)
   n'est volontairement pas citée : elle change à chaque appel.
2. **Sources primaires introuvables ou bloquées, donc écartées** (aucune n'est citée) : le
   post-mortem de Stack Overflow du 20/07/2016 (tumblr et Wayback bloqués) → `lecon-16` a pris
   CVE-2020-8492 ; les diapositives de D. Beazley sur le GIL (404) → `lecon-26` a pris la PEP 371 ;
   le billet de Twitter du 03/05/2018 (403) → `lecon-47` a pris Facebook 2019 ; le rapport de
   JPMorgan sur la « baleine de Londres » (défi Cloudflare) → `lecon-28` a pris AWS S3 ; le billet
   d'Instagram sur le ramasse-miettes (connexion refusée, Medium en 403) → `lecon-46` s'appuie sur le
   ticket CPython de Ł. Langa, qui cite ce billet. Le Zune (2008) a été écarté : la boucle infinie
   n'est décrite que par des analyses tierces.
3. **Phrases de liaison à la leçon** : chaque cas finit par une phrase qui relie le fait à la notion
   (comme les originaux). Elles sont écrites comme des conseils ou des déductions, pas comme des
   affirmations de la source ; la contre-relecture doit les lire ainsi. Deux sont des déductions
   à surveiller : `lecon-11` (« sous Python 3.13, un `import cgi` échoue donc ») et `lecon-45`
   (un service à bornes larges « peut tirer NumPy 2.0 » à la réinstallation).
4. **`lecon-23`** : la page de BIDS dit que les nouvelles palettes sont « conçues » pour rester
   uniformes en noir et blanc ; l'option D (viridis) a été ajoutée en mise à jour de cette page.
   Le texte ne lui prête aucune propriété que la page ne dise.
5. **Deux incidents Cloudflare** dans le cours (`lecon-12` : 2025, fichier de configuration ;
   `lecon-41` : 2019, regex) : deux événements distincts, gardés sciemment.
6. **Deux intertitres `<h2>` changés** (`lecon-26`, `lecon-28`), hors de l'encadré : nécessaire
   pour que le titre de section ne promette plus l'ancien récit. Aucun autre fichier ne les cite.
7. L'index de recherche (`js/search-index.js`) et les chiffres de corpus des pages du cours `doc`
   sont **périmés** par ces changements : à régénérer par l'orchestrateur après la fusion (voir
   « Contrôles »).

## Consignes de fusion

- Branche `v18/b4-python` : ne touche que `pages/python/lecon-01.html` à `lecon-50.html` et ce
  rapport. Aucun conflit attendu avec les autres copies B4 (autres cours).
- Après la fusion : régénérer les index dérivés (`node tools/build-index.js --write --fresh` pour
  `search-index.js`, pages d'étude) **et les pages du cours `doc`** (`node tools/doc/gen.js`), dont les
  chiffres de corpus comptent les liens externes et les intertitres ; puis relancer `verif.js --rapide`.
- Commits de la branche : `7453527` (les 50 encadrés et les deux intertitres), puis ce rapport.
- Garder `core.autocrlf=false` : les 50 fichiers sont en LF (0 CR vérifié).
