# Rapport V18 — case B8, lot 5 : les cours `archi` et `iac` (copie `b8-archi-iac`, branche `v18/b8-archi-iac`)

Copie de travail `D:\test-claude-b8-archi-iac`, partie de `d86be7b`. Part traitée : les **23 « Cas réel »**
des cours `archi` (12, un par leçon) et `iac` (11, un par leçon). Pièces dans `scratchpad/b8-archi-iac/`
(ignoré par git) : `new/<cours>__<NN>.html` (les 23 corps d'encadrés), `apply.js` (remplace du titre de
l'encadré au `</div></div>` final, refuse un remplacement ambigu, prouve que les octets hors de l'encadré
sont identiques, refuse tout CR, refuse un lien hors de la ligne de source, et calcule page par page les
mots d'options de QCM gagnés ou perdus avec la définition de `lexique-diff.js`), `txt.py` (texte d'une page
téléchargée), `dump.js`, `lecon.js`, les pages et PDF ouverts (`primevideo.html`, `gitlab-pm.html`,
`uber-complaint.pdf` et son texte, `ewd196.txt`, `reddit-piday.txt`, `charity.html`, `moj-2020-09-21.html`,
CHANGELOG de Terraform 0.7.0, 0.9.0 et 0.12.6…), `tf/` (Terraform 1.9.8 officiel et deux essais).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **12 hors de la règle à 0** pour
`archi` et de **11 à 0** pour `iac` ; sur les 23 cas trouvés, **aucun n'était VRAI tel quel** :
17 INVÉRIFIABLES (16 récits anonymes ou usages généraux, et une affirmation sans source sur un produit
nommé, `iac/lecon-04`), 5 sujets réels nommés mais INEXACTS, 1 VRAI dans les grandes lignes mais déjà
raconté par un autre cours (panne S3 de 2017, `cloud/lecon-12`) ; **17 remplacés** par un cas réel daté et sourcé sur la même notion, **6 corrigés sur
leur sujet** (dont les trois sujets que le registre garde ici : GitLab 2017, Uber 2016, Netflix et Hystrix),
**0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b8-archi-iac`) : `e273d84` (archi, 12 cas), `e80e2d2` (iac, 11 cas), puis le
commit de ce rapport (avec une retouche d'un mot de `archi/lecon-10`, « annoncé » au lieu de « publié »).

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`,
  icône, structure gardés), plus **deux intertitres `<h2>` collés** au-dessus d'un encadré, qui annonçaient
  l'ancien récit : `archi/lecon-08` (« Cas réel : passer une commande » → « Cas réel : les files de tâches
  de GitHub ») et `archi/lecon-09` (« Cas réel : le compte bancaire » → « Cas réel : la plateforme LMAX »).
  Aucun autre intertitre collé dans ces 23 leçons (vérifié page par page).
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; 127 à 185 mots par corps.
- **Un sujet = un seul cours** : chaque sujet et chaque URL cherchés dans `foyers.md` et dans tout `pages/`,
  puis inscrits au fichier commun `b8-reservations.txt` (23 lignes, plus une ligne de mise à jour de l'URL
  de `iac/lecon-01`). Écartés parce qu'un autre cours les raconte déjà : la panne S3 du 28/02/2017
  (`cloud/lecon-12`), la file de tâches de Slack (`nodejs/lecon-26`), le monolithe de Shopify et
  « Deconstructing the Monolith » (`ruby/lecon-15`, d'où le choix des ventes flash, autre sujet), Ticketmaster
  2022 (`tests/lecon-11`), Joyent 2014 (`equipe/lecon-13`), les clés d'idempotence de Stripe (déjà citées
  par le corps de `api/lecon-08`).
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes, hors de ma part).
- **Le piège du QCM de `archi/lecon-09`** : une question du QCM et une question « Vérifie ta compréhension »
  parlent du relevé bancaire. L'analogie reste dans le corps de la leçon (le solde de 30 € et la suite
  +100, −50, −20), et le cas LMAX garde, dans des phrases exactes de sa source, les mots « banque » et
  « opérations » (« la plupart des plateformes de courtage étaient réservées aux professionnels de la
  banque », « une opération peut peser sur les suivantes ») : 0 écart lexical.
- **Comportement rejoué** : Terraform 1.9.8 officiel (`releases.hashicorp.com`, somme SHA-256 vérifiée
  contre `terraform_1.9.8_SHA256SUMS`), deux essais `terraform_data` : retirer le premier de trois éléments
  donne avec `count` « 2 to change, 1 to destroy » (`rule[2]` détruit, `rule[0]` et `rule[1]` décalés) et
  avec `for_each` « 1 to destroy » (`rule["rdp"]` seul) — c'est ce qu'affirme `iac/lecon-08`.
- **Historique des tickets** lu dans leurs événements (API GitHub) et non dans la description du jour :
  le n° 17179 n'a jamais été édité (`userContentEdits` vide), il a été **renommé** le 27/01/2018 (ancien
  titre « Add better loop based on keys rather than indexes ») ; le n° 2437 non plus ; la PR n° 2525 est
  fusionnée le 14/10/2015 ; la réponse du 27/01/2018 sur le 17179 parle du « plan » de l'équipe (son
  auteur apparaît en `CONTRIBUTOR` : le cas ne lui donne donc pas de rôle).
- **Le présent devenu faux** : Hystrix est raconté au passé et sa mise en maintenance (README du
  19/11/2018) est dite ; le billet de Prime Video, retiré, est cité par sa copie de l'Internet Archive ;
  le blog de Segment vit aujourd'hui chez Twilio (dit dans la ligne de source).

## Les 23 cas

### `archi`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/archi/lecon-01.html#1` | INEXACT, événement (Segment) : « des dizaines de microservices » pour plus de 140, « petite équipe » sans chiffre | corrigé : plus de 140 services, un dépôt par destination, trois ingénieurs à plein temps, 32 puis 46 améliorations, « marchent bien » ailleurs | Cas réel — Segment revient au monolithe (2018) | https://www.twilio.com/en-us/blog/developers/best-practices/goodbye-microservices/ (redirigé depuis segment.com) |
| `pages/archi/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« une boutique en ligne ») | remplacé : le système THE de Dijkstra, six niveaux, testés niveau par niveau | Cas réel — Dijkstra et le système THE, bâti par niveaux (1968) | https://www.cs.utexas.edu/~EWD/transcriptions/EWD01xx/EWD196.html |
| `pages/archi/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« un service de commande » et Stripe) | remplacé : l'article de Fowler qui nomme l'injection de dépendances (MovieLister, MovieFinder, assembleur) | Cas réel — Martin Fowler nomme l'injection de dépendances (2004) | https://martinfowler.com/articles/injection.html |
| `pages/archi/lecon-04.html#1` | INEXACT (B2), événement : « jusqu'à ~90 % » pour « plus de 90 % » ; plafond attribué au réseau et au stockage alors que la source accuse surtout l'orchestration | corrigé : plafond vers 5 % de la charge, orchestration Step Functions, coût des appels S3, un seul processus sur EC2/ECS, « plus de 90 % », choix au cas par cas | Cas réel — Prime Video revient au monolithe (2023) | https://web.archive.org/web/20230323220106/https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90 (l'URL d'origine redirige vers aboutamazon.com) |
| `pages/archi/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« une équipe », MongoDB → PostgreSQL) | remplacé : Netflix Studio Workflows, data source GraphQL, une ligne changée, bascule en deux heures | Cas réel — Netflix Studio et l'architecture hexagonale (2020) | https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749 |
| `pages/archi/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« une plateforme SaaS ») | remplacé : DOMA d'Uber, 2 200 microservices en 70 domaines, inspirée du DDD | Cas réel — Uber range ses microservices en domaines (2020) | https://www.uber.com/blog/microservice-architecture/ |
| `pages/archi/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« une équipe », ADR du Black Friday) | remplacé : le billet de Nygard qui propose les ADR, et son retour d'expérience | Cas réel — Michael Nygard propose les ADR (2011) | https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions |
| `pages/archi/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« une boutique en ligne ») | remplacé : Resque chez GitHub, « 50 % de travail en arrière-plan », et le prix de l'asynchrone ; intertitre retouché | Cas réel — GitHub et ses files de tâches (2009) | https://github.blog/news-insights/the-library/introducing-resque/ |
| `pages/archi/lecon-09.html#1` | INVÉRIFIABLE, usage général (« une banque ») | remplacé : LMAX, processeur en mémoire, journal, instantané nocturne, rejeu ; intertitre retouché | Cas réel — LMAX, une plateforme de courtage en event sourcing (2011) | https://martinfowler.com/articles/lmax.html |
| `pages/archi/lecon-10.html#1` | INEXACT, produit nommé (Netflix, Hystrix) : page d'accueil « des dizaines de services » et repli vers « les tendances du moment » dans aucune source ; Hystrix au présent | corrigé (sujet gardé à son foyer) : disjoncteur de l'API (2011), incident documenté (157 serveurs sur 200 en repli, effet minime), Hystrix annoncé le 26/11/2012, en maintenance depuis le 19/11/2018 | Cas réel — Netflix, le disjoncteur de son API, puis Hystrix (2011) | https://netflixtechblog.com/making-the-netflix-api-more-resilient-a8ec62159c2d ; https://netflixtechblog.com/introducing-hystrix-for-resilience-engineering-13531c1ab362 ; https://github.com/Netflix/Hystrix/commit/a7df971cbaddd8c5e976b3cc5f14013fe6ad00e6 ; https://github.com/Netflix/Hystrix |
| `pages/archi/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« une équipe reprend un service de facturation ») | remplacé : les ADR de l'équipe Creator de Spotify (arrivée des nouveaux, passation, alignement) | Cas réel — Spotify, les ADR de son équipe Creator (2020) | https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record |
| `pages/archi/lecon-12.html#1` | INVÉRIFIABLE, anonyme (« une tournée sold-out ») | remplacé : ventes flash de Kylie Cosmetics, limiteur à seau percé, page d'attente, et ses 40 minutes d'attente | Cas réel — Shopify et les ventes flash de Kylie Cosmetics (2016) | https://shopify.engineering/surviving-flashes-of-high-write-traffic-using-scriptable-load-balancers-part-i |

### `iac`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/iac/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« un ingénieur » et la règle de pare-feu) | remplacé : panne Reddit de 314 minutes, réglage Calico fait à la main, « enregistré nulle part » | Cas réel — Reddit et la panne du jour de pi (14 mars 2023) | https://web.archive.org/web/20230325004006id_/https://old.reddit.com/r/RedditEng/comments/11xx5o0/you_broke_reddit_the_piday_outage/ (reddit.com refuse les robots) |
| `pages/iac/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« une équipe », script maison) | remplacé : l'annonce de Terraform, dépendances déduites, création en parallèle, plans d'exécution | Cas réel — HashiCorp annonce Terraform (2014) | https://www.hashicorp.com/blog/terraform-announcement |
| `pages/iac/lecon-03.html#1` | INVÉRIFIABLE, anonyme (« deux ingénieurs d'astreinte ») | remplacé : Terraform 0.9, remote backends et verrouillage du state (local, S3 via DynamoDB, Consul) | Cas réel — Terraform 0.9 verrouille le state (2017) | https://github.com/hashicorp/terraform/blob/v0.9.0/CHANGELOG.md (et sa version raw) ; https://developer.hashicorp.com/terraform/language/state/locking ; https://www.hashicorp.com/blog/terraform-0-9 (n'expose pas le détail : non cité) |
| `pages/iac/lecon-04.html#1` | INVÉRIFIABLE, produit nommé : « le module VPC AWS officiel utilisé par des milliers d'équipes » sans source, sans date | corrigé : l'annonce du Terraform Module Registry, modules vérifiés, suivi des versions | Cas réel — HashiCorp ouvre le Terraform Module Registry (2017) | https://www.hashicorp.com/blog/hashicorp-terraform-module-registry ; https://www.hashicorp.com/blog/hashicorp-announcements-hashiconf-2017 |
| `pages/iac/lecon-05.html#1` | INEXACT, événement (foyer GitLab 2017) : « cinq méthodes de sauvegarde » (le post-mortem en décrit quatre, dont l'instantané LVM qui a servi), « en pleine nuit » non dit, et « la leçon retenue : on n'opère pas à la main » contredite (GitLab écrit ne pas viser à interdire des commandes) | corrigé : réplication cassée, procédure manuelle « ni automatisée ni correctement documentée », primaire effacée (~300 Go), pg_dump en échec silencieux, instantanés Azure absents, ~6 h de données perdues, ~18 h de coupure, invite de commande et restaurations testées | Cas réel — GitLab.com efface sa base de production (2017) | https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/ (redirigé depuis /blog/2017/02/10/…) |
| `pages/iac/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« une équipe plateforme ») | remplacé : Charity Majors, un state pour tous les environnements, infra supprimée à la main trois fois, un state par environnement | Cas réel — Charity Majors et le state partagé par tous les environnements (2016) | https://charity.wtf/2016/03/30/terraform-vpc-and-why-you-want-a-tfstate-file-per-env/ |
| `pages/iac/lecon-07.html#1` | INVÉRIFIABLE (B2), usage général (« une bévue classique ») | remplacé : Terraform 1.10, secrets en clair dans plan et state, valeurs éphémères | Cas réel — Terraform 1.10 sort les secrets du state (2024) | https://www.hashicorp.com/blog/terraform-1-10-improves-handling-secrets-in-state-with-ephemeral-values ; https://developer.hashicorp.com/terraform/language/state/sensitive-data (B2) |
| `pages/iac/lecon-08.html#1` | INVÉRIFIABLE, usage général (« un motif que l'on croise souvent ») | remplacé : ticket n° 17179 (règles Azure décalées par `count`), `for_each` dans Terraform 0.12.6 ; comportement rejoué | Cas réel — le ticket qui a donné for_each aux ressources Terraform (2018) | https://github.com/hashicorp/terraform/issues/17179 (et ses événements par l'API) ; https://github.com/hashicorp/terraform/blob/v0.12.6/CHANGELOG.md |
| `pages/iac/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« une équipe », autoscaling) | remplacé : ticket n° 2437, ses commentaires (dont l'autoscaling piloté par Mesos), PR n° 2525, `ignore_changes` dans Terraform 0.6.4 | Cas réel — Terraform et la naissance d'ignore_changes (2015) | https://github.com/hashicorp/terraform/issues/2437 ; https://github.com/hashicorp/terraform/pull/2525 ; https://github.com/hashicorp/terraform/blob/v0.7.0/CHANGELOG.md |
| `pages/iac/lecon-10.html#1` | INEXACT, événement (foyer Uber 2016) : « 57 millions » absent de la plainte de la FTC (25,6 millions de noms et e-mails américains) ; « droits trop larges » non affirmé pour la clé de 2016 | corrigé : 16 fichiers du 13/10 au 15/11/2016, clé AWS en clair dans du code d'un dépôt GitHub privé, comptes sans double authentification, 25,6 millions et 607 000, 100 000 dollars, prévenus le 21/11/2017 | Cas réel — Uber, une clé d'accès en clair dans un dépôt GitHub (2016) | https://www.ftc.gov/system/files/documents/cases/1523054_uber_technologies_revised_complaint_0.pdf (PDF lu avec pypdf) ; https://www.ftc.gov/news-events/news/press-releases/2018/04/uber-agrees-expanded-settlement-ftc-related-privacy-security-claims |
| `pages/iac/lecon-11.html#1` | VRAI dans les grandes lignes (panne S3 du 28/02/2017) mais « la leçon retenue par beaucoup d'équipes » sans source, et sujet déjà raconté par `cloud/lecon-12` | remplacé : composants du cluster de production du ministère de la Justice britannique supprimés par un script, restaurés par un apply ciblé et le pipeline d'apply (38 min pour réparer) | Cas réel — la Cloud Platform du ministère de la Justice britannique (2020) | https://runbooks.cloud-platform.service.justice.gov.uk/incidents/2020-09-21-some-cloud-platform-components-destroyed.html |

## Décomptes

| cours | lus | VRAI tel quel | INEXACT | INVÉRIFIABLE | INVENTÉ | remplacés | corrigés | gardés | « Scénario » |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `archi` | 12 | 0 | 3 | 9 | 0 | 9 | 3 | 0 | 0 |
| `iac` | 11 | 0 (1 VRAI déjà raconté ailleurs) | 2 | 8 | 0 | 8 | 3 | 0 | 0 |
| **total** | **23** | **0** | **5** | **17** | **0** | **17** | **6** | **0** | **0** |

(`iac/lecon-04` est compté INVÉRIFIABLE — affirmation sans source sur un produit nommé — et corrigé sur son
sujet ; `iac/lecon-11` compté à part, VRAI mais doublon d'un autre cours.) Conformes à la règle : `archi`
0 → 12, `iac` 0 → 11.

**Sources primaires** pour les 23 cas (billets d'ingénierie des organisations concernées, post-mortems,
plainte de la FTC, notes de version, tickets GitHub, article original de 1968, journal d'incidents d'une
administration). **Aucune presse**. Deux copies de l'Internet Archive (Prime Video, billet retiré ;
Reddit, que l'outil ne peut pas lire en direct).

## Contrôles avant le dernier commit (codes de sortie)

- `node tools/verif-contenu.js --cas-reel --cours=archi` → **0** (12 conformes sur 12) ;
  `--cours=iac` → **0** (11 sur 11) ;
- `node tools/verif-contenu.js --strict` → **0** (le seul « maigre » est `os/lecon-04`, hors de ma part) ;
- `node tools/verif-html.js` → **0** ; `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b8-archi-iac d86be7b` → **23 pages, 0 écart** ;
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées (les deux légitimes connues) ;
- `node tools/verif-fraicheur.js` → **0** ;
- 0 CR dans les 23 pages (vérifié avec node) ;
- `node tools/verif.js --rapide` → voir la dernière section.

## Ce qui reste ouvert

- **Fraîcheur (phase E)** : `tools/fraicheur/releves/infra-2026-09-03.json` et `infra-lot-2026-09-03.json`
  gardent l'ancre de l'ancienne phrase de `iac/lecon-04` (« comme le module VPC AWS officiel utilisé par des
  milliers d'équipes »), disparue avec sa marque `fraicheur` ; `verif-fraicheur.js` reste vert.
- **Hors encadré, non touché** : le corps de `iac/lecon-07` dit qu'avec le backend S3 le verrou est
  « souvent géré par une table DynamoDB » ; la documentation actuelle du backend S3
  (https://developer.hashicorp.com/terraform/language/backend/s3, version 1.17.x) écrit que le verrou
  passe par S3 (`use_lockfile`) ou DynamoDB, et que le verrou par DynamoDB est déprécié et sera retiré
  dans une prochaine version mineure : phrase à reprendre (phase E). Le corps de `archi/lecon-10`
  (« Pour aller plus loin ») cite « Hystrix/opossum » parmi les bibliothèques sans dire qu'Hystrix est en
  maintenance.
- **Une source à l'accès capricieux** : l'Internet Archive a répondu 429 (limite de débit) à plusieurs
  reprises ; la copie Reddit citée est l'URL `…id_/…` effectivement ouverte (page complète lue à 07:40).
- **`archi/lecon-09`** : le QCM et la question « Vérifie ta compréhension » parlent encore du relevé
  bancaire ; l'analogie reste portée par le corps de la section « Event sourcing », mais l'intertitre ne
  l'annonce plus.

## `node tools/verif.js --rapide` (lancé une fois, à la fin)

**Code 1, 50 vérificateurs OK sur 54, 1 652 s** (machine partagée par quatre autres agents qui lançaient
le même contrôle au même moment). Les quatre « SIGNALE », un par un :

- `donnees` — l'invariant **I18** seul (`search-index.js` périmé, +3 413 octets) : toléré, l'orchestrateur
  régénère les index après la fusion. Rejoué seul : mêmes 2 erreurs, toutes deux I18.
- `doc-rec` — les chiffres de `doc/lecon-04` mesurés sur tout le site, que mes lignes de source font
  bouger : toléré. (`doc-ref` est resté **OK**.)
- `python` — 4 « fautes » dans `dataviz/lecon-06`, `-09`, `-11` et `ml/lecon-08`, pages que je n'ai pas
  touchées, dont les sorties « produites » sont celles d'AUTRES exercices (« Le Meilleur des mondes < 1984… »)
  ou un fichier introuvable : `verif-python-exos.js` écrit chaque exercice dans un fichier temporaire au nom
  FIXE (`%TEMP%\verif-python-exo.py`), partagé par les `verif.js` des agents qui tournaient en même temps.
  **Rejoué seul : 25 exercices, 0 faute, code 0.** À corriger dans l'outil (nom de fichier unique par
  processus) si les lots continuent en parallèle.
- `caract` — `verif-controles.js` a écrit son verdict complet dans le journal (« 0 accident(s), 2 emploi(s)
  voulu(s) ») puis **ne s'est jamais terminé** (0,33 s de processeur en 23 minutes, aucune lecture) ; les
  processus `verif-controles.js` des copies `ocaml-vscode`, `dataviz-pandas` et `objc-compilation` étaient
  bloqués de la même façon au même moment. J'ai arrêté le mien (le seul processus de ma copie), ce qui a
  laissé `verif.js` finir et marquer l'étape. **Rejoué seul : 0 accident, code 0, en quelques secondes.**

Aucun autre rouge : `source`, `contenu`, `exemple`, `fraich`, `qcmbiai`, `qcmlexi`, `doc-ref`, `normatf`…
sont verts.
