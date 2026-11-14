# Rapport V18 — case B5 (lot 2) : les « Cas réel » des cours `nodejs` et `bdd`

Copie de travail `D:\test-claude-b5-nodejs-bdd`, branche `v18/b5-nodejs-bdd`, partie de `1b8d94b`.
Scripts dans `scratchpad/b5-nodejs-bdd/` de la copie (ignoré par git) : `donnees-nodejs.js`,
`donnees-bdd.js`, `donnees-section07.js` (le texte de chaque cas), `appliquer.js` (remplace l'encadré
seul et prouve que les octets hors de la zone retouchée sont identiques), `impact-lexique.js`
(désignations STRICTE / INVERSE / PROPORTION de chaque question, avant et après), `liens.js` (liens des
lignes de source), et les essais exécutés (`redos.js`, `close-test2.js`, `t-chalk/`, `t-zod/`). Les PDF
lus avec `pypdf` y sont aussi (diapositives de Ryan Dahl, acte d'accusation de Gonzalez, Chen 1976, TAO).

## 1. Ce qui a été fait

**42 « Cas réel » lus** (27 `nodejs`, dont une section `<h2>` en `nodejs/lecon-07` ; 15 `bdd`), chacun
avec sa leçon. **Aucun n'était sourcé.** Pour chacun, la notion de la leçon d'abord, puis un vrai cas
daté sur la même notion, vérifié à des sources ouvertes ; le texte ne dit que ce que disent ces sources ;
les chiffres sont recopiés, pas arrondis ; une citation traduite seulement quand la phrase est dans la
source. Chaque sujet a été cherché dans le registre `tools/cas-reels/lots/foyers.md`, dans tout `pages/`
et réservé dans `D:\test-claude\scratchpad\v18-parallele\b5-reservations.txt` avant l'écriture.

| cours | lus | vérifiés tels quels | corrigés | remplacés | renommés « Scénario » |
|---|---:|---:|---:|---:|---:|
| `nodejs` | 27 | 0 | 1 | 26 | 0 |
| `bdd` | 15 | 0 | 0 | 15 | 0 |
| **total** | **42** | **0** | **1** | **41** | **0** |

**État trouvé** : VRAI (mais non sourcé) 1 (`nodejs/lecon-02`) · fait réel mais **déjà raconté par un
autre cours** 3 (`nodejs/lecon-03` left-pad, foyer `js/lecon-13` ; `nodejs/lecon-16` LinkedIn 2012,
raconté par `crypto/lecon-07` et `securite/lecon-05` ; `nodejs/lecon-22`, GitHub et l'assignation de
masse en 2012, foyer `ruby/lecon-09`) · INVÉRIFIABLE 38 (récits anonymes : « une équipe », « une petite
billetterie »… ; usages généraux : « chez la plupart des API »…) · INEXACT 0 relevé · INVENTÉ 0 déclaré.
B2 avait tiré 5 de ces cas (`bdd/04`, `bdd/10`, `nodejs/05`, `07`, `23` : INVÉRIFIABLE) : verdicts
confirmés.

Aucun cas renommé « Scénario » : chaque leçon a trouvé un vrai cas sourcé sur sa notion.

## 2. Cas par cas — `nodejs`

Tous les identifiants sont `#1` (une leçon = un « Cas réel »).

| leçon | notion | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|---|
| `pages/nodejs/lecon-01.html#1` | ce qu'est Node | INVÉRIFIABLE (général : « tu utilises déjà Node », esbuild, Rolldown) | remplacé | Cas réel — Ryan Dahl présente node.js (2009) | https://web.archive.org/web/20101226093024/http://nodejs.org/jsconf.pdf (69 diapositives lues avec pypdf) ; https://simonwillison.net/2009/Nov/17/nodepdf/ |
| `pages/nodejs/lecon-02.html#1` | CommonJS / ESM | VRAI, produit nommé, non sourcé | corrigé : sujet gardé (chalk 5 « ESM pur »), dates et versions posées à la source, citation des notes de chalk, comportement testé sous Node 24.16 | Cas réel — chalk 5 passe en ESM pur (2021) | https://github.com/chalk/chalk/releases/tag/v5.0.0 ; https://github.com/node-fetch/node-fetch/releases/tag/v3.0.0 ; https://nodejs.org/en/blog/release/v22.12.0 ; https://nodejs.org/en/blog/release/v20.19.0 ; registre npm (dates de chalk 5.0.0 et node-fetch 3.0.0) |
| `pages/nodejs/lecon-03.html#1` | npm, arbre de dépendances, lockfile | réel (left-pad, 2016), non sourcé ; **doublon** (foyer `js/lecon-13`) ; « React et Babel cessent de compiler », « en quelques minutes » non confirmés | remplacé | Cas réel — Le paquet colors piégé, chez Netlify (2022) | https://github.com/netlify/cli/issues/3981 ; https://github.com/netlify/cli/pull/3995 (corps et fichiers via l'API GitHub) ; https://github.com/advisories/GHSA-5rqg-jm4f-cqx7 |
| `pages/nodejs/lecon-04.html#1` | boucle d'événements, bloquer | INVÉRIFIABLE (anonyme : « une API Node ») | remplacé | Cas réel — path-to-regexp, la route qui bloque Express (2024) | https://github.com/advisories/GHSA-9wv6-86v2-598j ; https://blakeembrey.com/posts/2024-09-web-redos/ ; https://github.com/expressjs/express/blob/4.x/History.md (4.20.0 : path-to-regexp@0.1.10) |
| `pages/nodejs/lecon-05.html#1` | `await` en boucle, `Promise.all` | INVÉRIFIABLE (anonyme ; B2 idem) | remplacé ; intertitre « un tableau de bord six fois plus rapide » → « la règle d'ESLint contre l'await en boucle » | Cas réel — ESLint et la règle no-await-in-loop (2016) | https://eslint.org/blog/2016/12/eslint-v3.12.0-released ; https://eslint.org/docs/latest/rules/no-await-in-loop |
| `pages/nodejs/lecon-06.html#1` | écouteurs, fuites | INVÉRIFIABLE (anonyme : « un service Node ») | remplacé ; intertitre « la fuite d'écouteurs qui tue le service » → « des écouteurs posés à chaque requête » | Cas réel — Mongoose et useDb() à chaque requête (2021) | https://github.com/Automattic/mongoose/issues/9961 (ticket et commentaires via l'API) ; https://github.com/Automattic/mongoose/blob/master/CHANGELOG.md (5.12.0) |
| `pages/nodejs/lecon-07.html#1` (section) | flux, `Buffer.concat`, caractères multi-octets | INVÉRIFIABLE (illustration générale ; B2 idem) | remplacé : intertitre devenu le titre conforme, paragraphe d'ouverture réécrit, code gardé, ligne de source en fin de section | Cas réel — Les caractères coupés du SDK OpenAI pour Node (2024) | https://github.com/openai/openai-node/issues/706 ; https://github.com/openai/openai-node/blob/master/CHANGELOG.md (4.32.2) ; PR n° 757 (API) |
| `pages/nodejs/lecon-08.html#1` | chemin du script / CWD | INVÉRIFIABLE (général : prettier, eslint) | remplacé | Cas réel — Node.js ajoute import.meta.dirname (2023) | https://github.com/nodejs/node/pull/48740 ; https://nodejs.org/api/esm.html ; https://nodejs.org/en/blog/release/v20.11.0 |
| `pages/nodejs/lecon-09.html#1` | variables d'environnement | INVÉRIFIABLE (général : « les plateformes modernes ») | remplacé par le texte même qu'il citait | Cas réel — Heroku et « The Twelve-Factor App » (2011) | https://12factor.net/config ; https://www.heroku.com/blog/heroku-open-sources-twelve-factor-app-definition/ |
| `pages/nodejs/lecon-10.html#1` | codes de statut | INVÉRIFIABLE (général) | remplacé | Cas réel — Google et les « soft 404 » (2008) | https://developers.google.com/search/blog/2008/08/farewell-to-soft-404s |
| `pages/nodejs/lecon-11.html#1` | REST | INVÉRIFIABLE (usage général de GitHub et Stripe, non sourcé ; Stripe est déjà dans 15 cas du site) | remplacé | Cas réel — Roy Fielding définit REST (2000) | https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm ; https://ics.uci.edu/~fielding/pubs/dissertation/abstract.htm ; https://ics.uci.edu/~fielding/pubs/dissertation/top.htm |
| `pages/nodejs/lecon-12.html#1` | pile de middlewares, authentification | INVÉRIFIABLE (général : « chez la plupart des API ») | remplacé | Cas réel — Next.js et le middleware contourné (2025) | https://vercel.com/blog/postmortem-on-next-js-middleware-bypass ; https://github.com/advisories/GHSA-f82v-jwr5-mffw |
| `pages/nodejs/lecon-13.html#1` | config par l'environnement, tests, lint | INVÉRIFIABLE (anonyme : « une équipe ») | remplacé | Cas réel — Node 20.6 lit lui-même le fichier .env (2023) | https://nodejs.org/en/blog/release/v20.6.0 ; CHANGELOG_V20.md (date du 4 septembre 2023) |
| `pages/nodejs/lecon-14.html#1` | arrêt propre, `server.close()` | INVÉRIFIABLE (général : rolling update) | remplacé ; comportement **testé** sous Node 24.16 | Cas réel — Node 19 et les connexions inactives (2022) | https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V19.md ; https://nodejs.org/api/http.html ; https://nodejs.org/api/net.html |
| `pages/nodejs/lecon-15.html#1` | requêtes paramétrées | INVÉRIFIABLE (général : OWASP, Bobby Tables) | remplacé | Cas réel — Heartland et l'injection SQL (2007) | https://www.justice.gov/archive/usao/nj/Press/files/pdffiles/2009/gonz0817%20rel.pdf ; https://www.justice.gov/archive/usao/nj/Press/files/pdffiles/2009/GonzIndictment.pdf (lus avec pypdf) |
| `pages/nodejs/lecon-16.html#1` | hachage des mots de passe | réel (LinkedIn 2012, anonymisé), non sourcé ; **doublon** (`crypto/lecon-07`, `securite/lecon-05`) | remplacé | Cas réel — Comment Dropbox stocke les mots de passe (2016) | https://dropbox.tech/security/how-dropbox-securely-stores-your-passwords |
| `pages/nodejs/lecon-17.html#1` | WebSocket, multi-instances | INVÉRIFIABLE (général : Google Docs, Figma, Slack…) | remplacé | Cas réel — Le multijoueur de Figma, en WebSocket (2019) | https://www.figma.com/blog/how-figmas-multiplayer-technology-works/ |
| `pages/nodejs/lecon-18.html#1` | secret par défaut, échec au démarrage | INVÉRIFIABLE (général) | remplacé | Cas réel — Apache Superset et sa clé secrète par défaut (2023) | https://www.horizon3.ai/attack-research/disclosures/cve-2023-27524-insecure-default-configuration-in-apache-superset-leads-to-remote-code-execution/ ; https://cveawg.mitre.org/api/cve/CVE-2023-27524 |
| `pages/nodejs/lecon-19.html#1` | performance, mesurer | INVÉRIFIABLE (« scénario classique ») | remplacé | Cas réel — Netflix et « Node.js in Flames » (2014) | https://netflixtechblog.com/node-js-in-flames-ddd073803aa4 |
| `pages/nodejs/lecon-20.html#1` | readiness, drainage, pause avant l'arrêt | INVÉRIFIABLE (anonyme : « une équipe ») | remplacé | Cas réel — Kubernetes ajoute une pause avant l'arrêt d'un pod (2023) | https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3960-pod-lifecycle-sleep-action (README et kep.yaml) |
| `pages/nodejs/lecon-21.html#1` | ORM, N+1 | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — Prisma 5.7 charge les relations par JOIN (2023) | https://github.com/prisma/prisma/issues/5184 ; https://github.com/prisma/prisma/releases/tag/5.7.0 ; https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance |
| `pages/nodejs/lecon-22.html#1` | over-posting, Zod | récit anonyme + mention exacte de GitHub 2012 ; **sujet gardé par `ruby/lecon-09`** | remplacé ; « Zod retire les champs non déclarés » **testé** (zod 4.6.7) | Cas réel — AnythingLLM et le rôle admin glissé dans une invitation (2024) | https://github.com/mintplex-labs/anything-llm/pull/566 ; commit 8cd3a92 (diff via l'API) ; …/server/models/user.js et …/server/package.json au commit ; https://cveawg.mitre.org/api/cve/CVE-2024-0404 |
| `pages/nodejs/lecon-23.html#1` | CLI, arguments | INVÉRIFIABLE (anonyme ; B2 idem) | remplacé | Cas réel — Node 18.3 intègre util.parseArgs (2022) | https://github.com/nodejs/node/pull/42675 ; https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V18.md |
| `pages/nodejs/lecon-24.html#1` | worker threads, CPU-bound | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — ESLint passe aux worker threads (2025) | https://eslint.org/blog/2025/08/multithread-linting/ |
| `pages/nodejs/lecon-25.html#1` | `node:test` | INVÉRIFIABLE (anonyme) | remplacé | Cas réel — Le lanceur de tests de Node devient stable (2023) | https://nodejs.org/en/blog/announcements/v18-release-announce ; https://nodejs.org/en/blog/announcements/v20-release-announce |
| `pages/nodejs/lecon-26.html#1` | files de tâches | INVÉRIFIABLE (anonyme : « une plateforme ») | remplacé | Cas réel — La file de tâches de Slack (2017) | https://slack.engineering/scaling-slacks-job-queue/ |
| `pages/nodejs/lecon-27.html#1` | livrer un service structuré | INVÉRIFIABLE (anonyme : « un prototype ») | remplacé | Cas réel — PayPal passe Node.js en production (2013) | https://medium.com/paypal-tech/node-js-at-paypal-4e2d1d08ce4f |

## 3. Cas par cas — `bdd`

Les quinze encadrés étaient tous des récits anonymes sans date (« une petite association », « une
boutique en ligne », « une petite billetterie »…) : INVÉRIFIABLE. Tous remplacés. Les intertitres
`<h2>Cas réel</h2>` qui les enveloppent ne nomment aucun récit : gardés. Aucun sujet du cours `sql`
n'est repris (Codd 1970, Jim Gray, gh-ost, Mattermost, Stripe, ACIDRain, M. Null… y sont déjà).

| leçon | notion | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/bdd/lecon-01.html#1` | concevoir avant de coder, redondance | remplacé | Cas réel — Le répertoire électoral unique (2019) | https://www.insee.fr/fr/metadonnees/source/serie/s1046 ; https://www.insee.fr/fr/statistiques/4134308 |
| `pages/bdd/lecon-02.html#1` | attribut composé, multivalué | remplacé | Cas réel — Le W3C et les noms de personnes (2011) | https://www.w3.org/International/questions/qa-personal-names (date et auteur dans les métadonnées de la page) |
| `pages/bdd/lecon-03.html#1` | cardinalités, 1-N / N-N | remplacé | Cas réel — GitHub et les commits à plusieurs auteurs (2018) | https://github.blog/news-insights/product-news/commit-together-with-co-authors/ ; https://git-scm.com/docs/git-commit-tree |
| `pages/bdd/lecon-04.html#1` | modèle entité-association, table d'association | remplacé | Cas réel — Peter Chen et le modèle entité-association (1976) | https://www.comp.nus.edu.sg/~lingtw/papers/tods76.chen.pdf (28 pages lues avec pypdf) |
| `pages/bdd/lecon-05.html#1` | clé naturelle / artificielle | remplacé ; titre daté « 1938-1977 » (la règle ne lit que les années 1950-2039) | Cas réel — Le numéro de Sécurité sociale de Woolworth (1938-1977) | https://web.archive.org/web/20250103210754/https://www.ssa.gov/history/ssn/misused.html (ssa.gov répond 403 aux robots) |
| `pages/bdd/lecon-06.html#1` | clés étrangères, actions référentielles | remplacé | Cas réel — Django rend on_delete obligatoire (2017) | https://code.djangoproject.com/ticket/21127 ; https://docs.djangoproject.com/en/stable/releases/1.9/ ; https://docs.djangoproject.com/en/stable/releases/2.0/ |
| `pages/bdd/lecon-07.html#1` | contraintes, la base qui dit non | remplacé | Cas réel — MySQL et ses contraintes CHECK ignorées (2019) | https://bugs.mysql.com/bug.php?id=3464 ; https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html ; https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-16.html |
| `pages/bdd/lecon-08.html#1` | 1NF, colonne « liste » | remplacé | Cas réel — Les champs à valeurs multiples d'Access 2007 (2006) | https://www.theregister.com/2006/07/18/multivalued_datatypes_access/ ; https://support.microsoft.com/en-us/access/create-or-delete-a-multivalued-field |
| `pages/bdd/lecon-09.html#1` | 2NF, 3NF, « la clé, toute la clé, rien que la clé » | remplacé | Cas réel — William Kent et « rien que la clé » (1983) | http://www.bkent.net/Doc/simple5.htm |
| `pages/bdd/lecon-10.html#1` | dénormaliser, compteurs, réconciliation | remplacé | Cas réel — TAO, le magasin du graphe social de Facebook (2013) | https://www.usenix.org/system/files/conference/atc13/atc13-bronson.pdf (lu avec pypdf) |
| `pages/bdd/lecon-11.html#1` | coût des index | remplacé | Cas réel — Uber et le coût des index de PostgreSQL (2016) | https://www.uber.com/blog/postgres-to-mysql-migration/ |
| `pages/bdd/lecon-12.html#1` | lire un plan d'exécution | remplacé | Cas réel — Instagram lit son plan d'exécution (2013) | https://web.archive.org/web/20240126214634/https://instagram-engineering.com/handling-growth-with-postgres-5-tips-from-instagram-d5d7e7ffdfcb (le site d'origine refuse la connexion) |
| `pages/bdd/lecon-13.html#1` | transactions, niveaux d'isolation | remplacé | Cas réel — Jepsen prend PostgreSQL en défaut (2020) | https://jepsen.io/analyses/postgresql-12.3 ; https://www.postgresql.org/docs/release/12.4/ |
| `pages/bdd/lecon-14.html#1` | migrations, `NOT NULL` sans `DEFAULT` | remplacé | Cas réel — PostgreSQL 11 et l'ajout de colonne avec DEFAULT (2018) | https://www.postgresql.org/docs/release/11.0/ ; https://www.postgresql.org/docs/10/sql-altertable.html ; https://www.postgresql.org/docs/current/sql-altertable.html |
| `pages/bdd/lecon-15.html#1` | relationnel ou documents, le bon modèle par partie | remplacé | Cas réel — Diaspora quitte MongoDB pour MySQL (2013) | https://web.archive.org/web/20141205234428/http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/ (le site d'origine répond 500) |

## 4. Ce qui a été testé, et les points de vigilance pour la contre-relecture

- **`nodejs/02`** : sous Node 24.16, `require("chalk")` (chalk 5) renvoie l'objet module, la fonction est
  dans `.default` ; avec `--no-experimental-require-module`, `ERR_REQUIRE_ESM`.
- **`nodejs/04`** : la regex générée pour `/:a-:b` (`/^\/([^\/]+?)-([^\/]+?)\/?$/`) sur `/a` + 8 000 × `-a`
  + `/a` : 68 ms sous Node 24.16, et un minuteur de 10 ms programmé avant n'est servi qu'à 79 ms. Le cas
  cite les chiffres de l'alerte (≈ 600 ms contre 1 ms sous Express 4, 10 connexions), pas les miens.
- **`nodejs/14`** : sous Node 24.16, `server.close()` coupe aussitôt une connexion keep-alive inactive et
  laisse finir une requête en vol ; mais la connexion de cette requête, gardée par le client, retient
  ensuite la fermeture du serveur (60 s de keep-alive dans l'essai) — d'où la mention du minuteur de
  secours, qui existe dans le schéma de la leçon.
- **`nodejs/22`** : `z.object({ email, nom }).safeParse({ email, nom, role: "admin", credit })` renvoie
  `{ email, nom }` (zod 4.6.7).
- **`bdd/07`** : le ticket MySQL n° 3464 se clôt le 23 janvier 2019 par « Fixed in 8.0.15 », mais le manuel
  et les notes de version datent la mise en œuvre de **8.0.16** (25 avril 2019) ; le cas suit le manuel
  et ne cite pas la version du ticket.
- **`bdd/13`** : la note de PostgreSQL 12.4 (« Fix conflict-checking anomalies in SERIALIZABLE isolation
  mode ») ne cite pas Jepsen ; le cas dit seulement que Jepsen annonçait un correctif pour le 13 août et
  que, ce jour-là, la 12.4 corrige ces anomalies.
- **`bdd/11`** : la description de l'amplification d'écriture est celle d'Uber (« explique-t-il ») ; la
  communauté PostgreSQL l'a discutée (mises à jour HOT), le cas ne prend pas parti.
- **`bdd/08`** : la source principale est une chronique de presse (The Register), parce que l'entretien
  avec le responsable d'Access n'existe que là ; le comportement actuel vient de la documentation de
  Microsoft.
- **Copies d'archive** citées quand l'original est mort ou fermé aux robots : diapositives de Ryan Dahl
  (`nodejs.org/jsconf.pdf` répond 404), SSA (403), Instagram Engineering (connexion refusée), blog de
  Sarah Mei (500).

## 5. Lexique des QCM

`lexique-diff.js D:\test-claude-b5-nodejs-bdd 1b8d94b` : **55 écarts** au premier jet, ramenés à **3**
en reformulant les encadrés (jamais les QCM). Les 3 restants, expliqués :
- `nodejs/lecon-08` et `nodejs/lecon-17` : **« source » GAGNÉ** — il entre par le nom de classe
  obligatoire `cas-reel__source` (l'outil lit le HTML brut, attributs compris : `cas-reel__source` donne
  les jetons `cas-reel` et `source`). Inévitable avec la forme de la règle.
- `nodejs/lecon-17` : **« requêtes » GAGNÉ**, volontairement. « source » faisait perdre un mot étranger au
  distracteur n° 2 de la Q1, qui passait à égalité avec la bonne réponse sous INVERSE (désignation {1}
  → {0, 1}). « requêtes », mot de la bonne réponse, rétablit l'écart d'avant.

`impact-lexique.js` sur les 42 pages : **0 désignation STRICTE / INVERSE / PROPORTION changée**.
Cliquets : `verif-qcm-lexique.js` **0**, `verif-qcm-biais.js` **0**.

## 6. Contrôles (codes de sortie)

| commande | résultat |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=nodejs` | **0** — 27 lus, 27 conformes |
| `node tools/verif-contenu.js --cas-reel --cours=bdd` | **0** — 15 lus, 15 conformes |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js … 1b8d94b` | 3 écarts, expliqués au § 5 |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées, les deux déjà enregistrées comme légitimes (react.dev, Safari 15.4) ; aucune ne touche `nodejs` ni `bdd` |
| `node tools/cas-reels/lots/controle-branche.js … 1b8d94b` | OK : 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, copie propre |
| `node tools/verif.js --rapide` | **1**, 219,9 s, 54 étapes jouées, 2 signalements, les deux tolérés : `donnees` (seul **I18** en erreur : `js/search-index.js` périmé, écart +5 830 o, à régénérer après fusion) et `doc-rec` (« introuvable dans la page : « 394 citent la source » » — le compte des leçons qui citent la source de leur cas a bougé avec mes 42 lignes de source). `doc-ref`, `contenu`, `lexique`, `requete`, `exemple` et toutes les autres étapes : OK |

Liens : les 77 liens des lignes de source ont été ouverts (WebFetch, curl, API GitHub ou `pypdf`) ; un
dernier passage curl donne 200 pour 66, et pour les 11 autres un refus aux robots ou une limite de débit
(403/406/429 : w3.org, MySQL, Uber, Internet Archive, blobs GitHub) sur des pages lues plus tôt.

## 7. Ce qui reste ouvert

- **Fraîcheur** : trois ancres du relevé `tools/fraicheur/releves/nodejs-lot-2026-11-11.json` étaient
  dans les anciens encadrés et n'existent plus (`nodejs/lecon-01` « comme esbuild (en Go)… »,
  `nodejs/lecon-09` « Les plateformes modernes… », `nodejs/lecon-15` « figure encore aujourd'hui… »).
  Aucun contrôle ne les lit ; à retirer du relevé si on le rejoue avec `tools/fraicheur/appliquer.js`.
- **Foyers à inscrire au registre** (sujets que d'autres cours pourraient vouloir) : Fielding et REST
  (2000) → `nodejs/lecon-11` ; Netflix « Node.js in Flames » → `nodejs/lecon-19` ; Twelve-Factor App →
  `nodejs/lecon-09` ; Peter Chen 1976 → `bdd/lecon-04` ; William Kent 1983 → `bdd/lecon-09` ; Jepsen et
  PostgreSQL 12.3 → `bdd/lecon-13` ; Diaspora et MongoDB → `bdd/lecon-15` ; TAO de Facebook →
  `bdd/lecon-10` ; Uber, Postgres → MySQL → `bdd/lecon-11`.
- **Doublons repérés hors de ma part** : LinkedIn 2012 est raconté à la fois par `crypto/lecon-07` et
  `securite/lecon-05` (à trancher par leurs lots).
