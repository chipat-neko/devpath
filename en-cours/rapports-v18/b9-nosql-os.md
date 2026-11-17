# Rapport V18 — case B9, lot 6 : les cours `nosql` et `os` (copie `b9-nosql-os`, branche `v18/b9-nosql-os`)

Copie de travail `D:\test-claude-b9-nosql-os`, partie de `c5b3e9d`. Part traitée : les **28 « Cas réel »**
des cours `nosql` (14, un par leçon) et `os` (14, un par leçon). Pièces dans `scratchpad/b9-nosql-os/`
(ignoré par git) : `nouveaux.js` (les 28 titres et corps), `appliquer.js` (remplace du titre de l'encadré
au `</div></div>` final, refuse un remplacement ambigu et tout CR), `retouches1.js` (retouches lexicales),
`dump.js`, `raw.js`, `qcm-mot.js` (options de QCM qui portent un mot, présentes ou absentes de la page),
`texte.py`, et les pages et PDF ouverts (`reeves.html`, `therac.pdf` et son texte, `dynamo.pdf`,
`denning.pdf`, `tweedie.pdf`, `guardian.html`, `icij.html`, `aphyr.html`, `gh.html`, `faiss.html`…).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **14 hors de la règle à 0** pour
`nosql` et de **14 à 0** pour `os` ; sur les 28 cas trouvés, **aucun n'était VRAI tel quel** :
9 sujets réels nommés mais INEXACTS ou en partie non sourcés, 2 INVÉRIFIABLES sur un sujet nommé (The
Guardian « en 2011 », un Prometheus générique), 17 récits anonymes ou usages généraux (INVÉRIFIABLES) ; **18 remplacés** par un cas réel
daté et sourcé sur la même notion, **10 corrigés sur leur sujet** (dont le Therac-25, que le registre garde
ici), **0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b9-nosql-os`) : `3c61e3f` (nosql, 14 cas), `ca64e67` (os, 14 cas), puis le commit
de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (types `note`, et
  `warn` pour `os/lecon-06`, gardés). Aucun intertitre `<h2>`/`<h3>` n'est collé au-dessus de ces 28
  encadrés (paragraphes ou figures entre les deux, vérifié page par page) ; `controle-branche.js` : octets
  identiques hors des « Cas réel ».
- Forme : titre `Cas réel — sujet (année)` (sauf `os/lecon-12`, titre gardé `Cas réel : la faille « Dirty
  COW » (2016)`, déjà conforme), dernier paragraphe `<p class="cas-reel__source">` daté ou lié ; **aucun lien
  dans le corps** (les trois liens internes d'origine, « leçon 13 », « leçon 7 », « leçon 4 », et les
  renvois aux cours Linux, Docker, Kubernetes, Cloud, deviennent du texte simple ou disparaissent, comme
  dans les 956 cas déjà conformes du site) ; `&nbsp;` devant « : ; ? ! » et dans « ».
  138 à 219 mots par corps (63 à 129 avant).
- **Un sujet = un seul cours** : chaque sujet et chaque URL cherchés dans `foyers.md` et dans tout `pages/`,
  puis inscrits au fichier commun `b9-reservations.txt` (28 lignes, aucune reprise par un autre agent).
  Écartés parce qu'un autre cours les raconte déjà : Knuth et McIlroy (`bash/lecon-04`), d'où les tubes
  racontés par Ritchie pour `os/lecon-08` ; GitHub et la partition du 21 octobre 2018 (`distribue/lecon-06`) ;
  la doc Jepsen de PostgreSQL (`bdd/lecon-13`, l'analyse MongoDB de 2013 est un autre sujet) ; « Why You
  Should Never Use MongoDB » (`bdd/lecon-15`) ; Discord sur Elixir (`erlang/lecon-05`) et Discord en Rust
  (`rust/lecon-16`), le stockage des messages est un autre sujet ; SharedArrayBuffer et Spectre chez Mozilla
  (`js/lecon-56`), l'isolation des sites de Chrome est un autre sujet. L'article de Brewer de 2012 n'est cité
  ailleurs qu'en lecture conseillée (« Pour aller plus loin » de `distribue/lecon-06`), jamais en cas.
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes, hors de ma part).
- Chaque affirmation relue contre la source ouverte ; les PDF lus avec `pypdf` (Leveson et Turner, Dynamo,
  Denning, Tweedie). Pages lues par `curl` quand l'outil web échouait (The Guardian, Netflix TechBlog sur
  Medium, Harness sur Medium, aphyr.com, GitHub blog).

## Cas par cas

### nosql

| Cas | Trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/nosql/lecon-01.html#1` | Événement nommé, VRAI dans l'ensemble mais deux détails sans source : « pics de fin d'année », « centaines de serveurs ordinaires » ; Cassandra et Riak « inspirés » non dits par les sources ouvertes | Corrigé : Oracle en 2004, 70 % d'accès clé-valeur, panier, cohérence sacrifiée dans certains scénarios de panne, SOSP 2007, DynamoDB en janvier 2012 | Cas réel — Amazon et Dynamo (2004-2007) | https://www.allthingsdistributed.com/2017/10/a-decade-of-dynamo.html ; https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf |
| `pages/nosql/lecon-02.html#1` | Général, INVÉRIFIABLE (B2) : l'exemple d'Eric Brewer sans le nommer ; le « virement interbancaire » n'est dans aucune source | Remplacé par le même exemple, nommé et sourcé : mode « stand-in », limite k de 200 dollars, « A l'emporte sur C », compensation par frais | Cas réel — Eric Brewer et les distributeurs de billets (2012) | https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/ ; métadonnées IEEE (vol. 45, n° 2, février 2012) par https://api.crossref.org/works/10.1109/MC.2012.37 |
| `pages/nosql/lecon-03.html#1` | Produit nommé, INVÉRIFIABLE sur sa date (« en 2011 ») et sa raison ; la source primaire du Guardian raconte autre chose | Corrigé sur le même sujet : Composer sur MongoDB (2,3 millions de contenus), passage à PostgreSQL JSONB en avril 2018 pour des raisons d'exploitation, forme document gardée, proxy de comparaison | Cas réel — The Guardian et ses articles en documents (2018) | https://www.theguardian.com/info/2018/nov/30/bye-bye-mongo-hello-postgres |
| `pages/nosql/lecon-04.html#1` | Produit nommé, INEXACT : « sessions et cache confiés à Redis » non sourcé (le billet de 2017 dit ne pas vouloir mettre les messages en cache dans Redis ou Memcached) | Corrigé : MongoDB jusqu'à 100 millions de messages (nov. 2015), Cassandra (2017), clé `((channel_id, bucket), message_id)`, 12 puis 177 nœuds, ScyllaDB en mai 2022 sur 72 nœuds, p99 de 40-125 ms à 15 ms | Cas réel — Discord, de Cassandra à ScyllaDB (2017-2023) | https://discord.com/blog/how-discord-stores-billions-of-messages ; https://discord.com/blog/how-discord-stores-trillions-of-messages |
| `pages/nosql/lecon-05.html#1` | Événement nommé, INEXACT : les 11,5 millions de documents n'ont pas été chargés dans Neo4j (indexés pour la recherche) ; seule la base interne de Mossack Fonseca, reconstruite, est passée de SQL à Neo4j | Corrigé : 2,6 To, 11,5 millions de fichiers, plus de 370 journalistes, base reconstruite, Talend vers Neo4j, Linkurious, Cypher « deux degrés de séparation » | Cas réel — les Panama Papers dans un graphe (2016) | https://www.icij.org/investigations/panama-papers/data-tech-team-icij/ (ouverts aussi, non cités : https://neo4j.com/blog/analyzing-panama-papers-neo4j/) |
| `pages/nosql/lecon-06.html#1` | Organisation nommée, en partie non sourcée : Elasticsearch « pour la recherche » et relationnel « pour les transactions » absents de la source ouverte | Corrigé et resserré sur l'historique de visionnage : Cassandra (écritures, 9 pour 1, disponibilité préférée) + EVCache clé-valeur en lecture | Cas réel — Netflix et l'historique de visionnage (2018) | https://netflixtechblog.com/scaling-time-series-data-storage-part-i-ec2b6d44ba39 |
| `pages/nosql/lecon-07.html#1` | Général (l'index sur l'e-mail), INVÉRIFIABLE | Remplacé : panne de Harness du 8 avril 2021, parcours complet de `logAnalysisRecords` après la suppression d'un index jugé inutile, recréé à 11 h 20 | Cas réel — Harness et l'index supprimé (2021) | https://medium.com/harness-engineering/production-updates-c36424875529 |
| `pages/nosql/lecon-08.html#1` | Général (tableaux de bord), INVÉRIFIABLE | Remplacé : map-reduce déprécié à partir de MongoDB 5.0 (sortie le 13 juillet 2021) au profit du pipeline d'agrégation, `$group`, `$merge`, `$accumulator`, `$function` | Cas réel — MongoDB 5.0 déprécie map-reduce (2021) | https://www.mongodb.com/docs/manual/core/map-reduce/ ; http://web.archive.org/web/20210725065800/https://docs.mongodb.com/manual/release-notes/5.0/ |
| `pages/nosql/lecon-09.html#1` | Anonyme (« un site e-commerce »), INVÉRIFIABLE | Remplacé : Jepsen sur MongoDB 2.4, élection d'un nouveau primaire, rollback, 2 208 écritures confirmées perdues sur 5 900 en « Safe », 2 en « Majority » | Cas réel — Jepsen teste le basculement de MongoDB (2013) | https://aphyr.com/posts/284-call-me-maybe-mongodb |
| `pages/nosql/lecon-10.html#1` | Événement nommé, INEXACT ou non sourcé : « dizaines de milliers » (presse seulement), surnom « MongoDB apocalypse » (introuvable dans une source primaire), Elasticsearch et Redis, « Depuis » (lien de cause non établi) | Corrigé : alerte de MongoDB du 6 janvier 2017 (base effacée, rançon, copie probable des données), paquet RPM sur localhost, localhost par défaut à partir de la 3.6 | Cas réel — les bases MongoDB rançonnées (2017) | http://web.archive.org/web/20170202114953/https://www.mongodb.com/blog/post/how-to-avoid-a-malicious-attack-that-ransoms-your-data ; http://web.archive.org/web/20240422055842/https://www.mongodb.com/docs/manual/release-notes/3.6-compatibility/ |
| `pages/nosql/lecon-11.html#1` | Produit nommé mais générique, INVÉRIFIABLE et en partie inexact (« on agrège l'ancien » : Prometheus ne sous-échantillonne pas ; « Linky » sans source) | Remplacé : Prometheus 2.0 (8 novembre 2017), blocs de deux heures compactés, rétention par blocs entiers, 1 à 2 octets par mesure, WAL compressé par défaut depuis 2.20 | Cas réel — Prometheus 2.0 et son nouveau stockage (2017) | https://prometheus.io/blog/2017/11/08/announcing-prometheus-2-0/ ; https://prometheus.io/docs/prometheus/latest/storage/ ; https://prometheus.io/docs/introduction/overview/ |
| `pages/nosql/lecon-12.html#1` | Général, INVÉRIFIABLE | Remplacé : GitHub écrit Blackbird en Rust ; ponctuation, pas de racinisation, mots vides gardés ; index inversé de trigrammes | Cas réel — GitHub réécrit sa recherche de code (2023) | https://github.blog/engineering/architecture-optimization/the-technology-behind-githubs-new-code-search/ |
| `pages/nosql/lecon-13.html#1` | Général, INVÉRIFIABLE | Remplacé : Faiss (29 mars 2017), distance euclidienne et produit scalaire maximal, vecteurs compressés, 8,5 fois plus rapide, graphe k-NN sur un milliard de vecteurs | Cas réel — Facebook publie Faiss (2017) | https://engineering.fb.com/2017/03/29/data-infrastructure/faiss-a-library-for-efficient-similarity-search/ |
| `pages/nosql/lecon-14.html#1` | Général, INVÉRIFIABLE | Remplacé : OpenSky met ses produits dans MongoDB et garde le relationnel pour les commandes (transactions), contre l'EAV de Magento | Cas réel — le catalogue d'OpenSky (2010) | https://doctrine-project.org/2010/07/22/mongodb-for-ecommerce.html |

### os

| Cas | Trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/os/lecon-01.html#1` | Démonstration générale (`strace ls`), INVÉRIFIABLE comme cas | Remplacé : KPTI contre Meltdown, bascule de tables de pages à chaque entrée dans le noyau, surcoût mesuré par Brendan Gregg selon le débit d'appels système | Cas réel — Meltdown rend l'appel système plus cher (2018) | https://www.brendangregg.com/blog/2018-02-09/kpti-kaiser-meltdown-performance.html ; https://docs.kernel.org/arch/x86/pti.html |
| `pages/os/lecon-02.html#1` | Produit nommé, INEXACT ou non sourcé : « chaque onglet » a son processus, une extension malveillante « reste confinée » | Corrigé : Chrome 67 (annonce du 11 juillet 2018), 99 % des utilisateurs, iframes et pop-ups d'un autre site autrefois dans le même processus, Spectre, 10 à 13 % de mémoire en plus | Cas réel — l'isolation des sites dans Chrome (2018) | https://security.googleblog.com/2018/07/mitigating-spectre-with-site-isolation.html |
| `pages/os/lecon-03.html#1` | Général (téléphone), INVÉRIFIABLE | Remplacé : annonce de CFS par Ingo Molnar, fin des heuristiques d'interactivité, arbre rouge-noir, tâche qui a le moins tourné ; Linux 2.6.23 ; EEVDF aujourd'hui | Cas réel — Linux adopte l'ordonnanceur CFS (2007) | https://lkml.iu.edu/hypermail/linux/kernel/0704.1/2138.html ; https://docs.kernel.org/scheduler/sched-design-CFS.html |
| `pages/os/lecon-04.html#1` | Général (PC qui swappe), INVÉRIFIABLE | Remplacé : l'article de Denning, cause (temps d'accès à la mémoire auxiliaire), remède (ensemble de travail), « la pagination ne remplace pas la vraie mémoire » | Cas réel — Peter Denning et le « thrashing » (1968) | https://cs.uwaterloo.ca/~brecht/courses/epfl/Possible-Readings/vm-and-gc/thrashing-denning-afips-1968.pdf |
| `pages/os/lecon-05.html#1` | Général, INVÉRIFIABLE (et en partie périmé : sous Windows, l'éjection n'est plus nécessaire par défaut depuis 1809) | Remplacé : politiques « Better performance » et « Quick removal », cache d'écriture, défaut changé à partir de Windows 10 version 1809 | Cas réel — « Retirer le périphérique en toute sécurité » et Windows 10 (2018) | https://learn.microsoft.com/windows/client-management/change-default-removal-policy-external-storage-media ; https://learn.microsoft.com/en-us/windows/release-health/release-information |
| `pages/os/lecon-06.html#1` | Anonyme (« une équipe »), INVÉRIFIABLE | Remplacé : la première minute d'enquête de Netflix, `vmstat` (r, wa), `mpstat -P ALL` (un seul processeur brûlant, appli mono-thread) | Cas réel — la première minute d'une enquête de performance chez Netflix (2015) | https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55 |
| `pages/os/lecon-07.html#1` | Événement nommé (foyer), INEXACT : « faisceau à pleine puissance sans la plaque de protection » (c'est à Yakima, 25 MeV sans la cible), « la saisie et le sous-programme qui positionnait le faisceau » (imprécis), « très rare, d'où sa non-détection en test » (non dit) ; deux défauts fondus en un ; titre sans date | Corrigé et gardé : six accidents de juin 1985 à janvier 1987, variables partagées sans test-et-mise-à-jour indivisible, Tyler (1986, saisie en moins de 8 s), Yakima (1987, compteur d'un octet), pas de cause unique | Cas réel — le Therac-25 (1985-1987) | https://www.se.rit.edu/~swen-342/resources/Leveson,%20Turner%20-%20An%20Investigation%20of%20the%20Therac-25%20Accidents%20-%20IEEE%20Computer%20v26n7%20-%201993-07.pdf |
| `pages/os/lecon-08.html#1` | Général (philosophie Unix), INVÉRIFIABLE comme cas | Remplacé : récit de Ritchie, tubes en 1972 à la demande de McIlroy, « filtre », première notation `>`/`<` abandonnée | Cas réel — l'arrivée des tubes dans Unix (1972) | https://www.nokia.com/bell-labs/about/dennis-m-ritchie/hist.html |
| `pages/os/lecon-09.html#1` | Général, INVÉRIFIABLE | Remplacé : multitâche coopératif du Mac (*Inside Macintosh: Processes*, `WaitNextEvent`), puis Mac OS X préemptif (24 mars 2001) | Cas réel — le Mac passe au multitâche préemptif (2001) | https://developer.apple.com/library/archive/documentation/mac/Processes/Processes-14.html ; https://developer.apple.com/library/archive/documentation/mac/Processes/Processes-16.html ; https://www.apple.com/newsroom/2001/03/21Mac-OS-X-Hits-Stores-This-Weekend/ (ouvert aussi : https://apple.com/newsroom/2000/01/05Apple-Unveils-Mac-OS-X) |
| `pages/os/lecon-10.html#1` | Général (« ça marche sur ma machine »), INVÉRIFIABLE | Remplacé, sur le compromis VM / conteneur de la section : Firecracker, microVM en 125 ms, environ 5 Mio, Lambda et Fargate | Cas réel — AWS Firecracker, entre VM et conteneur (2018) | https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/ (ouvert aussi : https://www.usenix.org/conference/nsdi20/presentation/agache) |
| `pages/os/lecon-11.html#1` | Événement nommé, INEXACT (B2) : c'est l'ordinateur de la sonde, pas le rover Sojourner ; les données déjà recueillies ne sont pas perdues (Reeves) ; « centaines de millions de kilomètres » retiré | Corrigé à partir du courriel de Glenn Reeves : ASI/MET, mutex de `select()`, bc_dist bloquée, bc_sched déclenche la réinitialisation, reproduction en moins de 18 h, héritage de priorité par une variable globale | Cas réel — Mars Pathfinder (1997) | http://web.archive.org/web/20161230103247/http://research.microsoft.com:80/en-us/um/people/mbj/Mars_Pathfinder/Authoritative_Account.html ; https://science.nasa.gov/mission/mars-pathfinder/ (ouvert aussi : https://www.cs.cmu.edu/afs/cs/user/raj/www/mars.html, le message de Mike Jones) |
| `pages/os/lecon-12.html#1` | Événement nommé, INEXACT ou non sourcé : « près de neuf ans » (Linus Torvalds parle d'un bug « ancien », déjà mal corrigé onze ans plus tôt), « fichier appartenant à root », « correctif d'urgence sur des milliards d'appareils » | Corrigé : CVE-2016-5195 exploitée en octobre 2016, noyaux 2.x à 4.x avant 4.8.3, commit du 13 octobre 2016 | Cas réel : la faille « Dirty COW » (2016) (titre gardé) | https://github.com/torvalds/linux/commit/19be0eaffa3ac7d8eb6784ad9bdbc7d67ed8e619 (message lu par https://api.github.com/repos/torvalds/linux/commits/19be0eaffa3ac7d8eb6784ad9bdbc7d67ed8e619) ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2016-5195 (ouvert aussi : https://dirtycow.ninja/) |
| `pages/os/lecon-13.html#1` | Général (fsck contre journal), INVÉRIFIABLE | Remplacé : article de Stephen Tweedie, récupération d'une heure ou plus, commit atomique, journal de quelques secondes | Cas réel — Stephen Tweedie et le journal d'ext2 (1998) | https://pdos.csail.mit.edu/6.828/2018/readings/journal-design.pdf |
| `pages/os/lecon-14.html#1` | Anonyme (« l'équipe »), INVÉRIFIABLE | Remplacé : Brendan Gregg retrouve le correctif de Matthias Urlichs (29 octobre 1993, Linux 0.99.14) qui fait compter l'état « D » | Cas réel — l'énigme du *load average* de Linux (1993-2017) | https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html |

## Décomptes

| | nosql | os | total |
|---|---:|---:|---:|
| « Cas réel » lus | 14 | 14 | 28 |
| trouvés VRAI tels quels | 0 | 0 | 0 |
| trouvés INEXACT ou en partie non sourcés (sujet réel nommé) | 5 | 4 | 9 |
| trouvés INVÉRIFIABLES sur un sujet nommé (date, produit générique) | 2 | 0 | 2 |
| trouvés INVÉRIFIABLES anonymes ou généraux | 7 | 10 | 17 |
| trouvés INVENTÉS | 0 | 0 | 0 |
| **corrigés** sur leur sujet | 6 | 4 | 10 |
| **remplacés** par un vrai cas | 8 | 10 | 18 |
| vérifiés tels quels | 0 | 0 | 0 |
| renommés « Scénario » | 0 | 0 | 0 |
| conformes à la règle après | 14 | 14 | 28 |

(nosql : INEXACT 01, 04, 05, 06, 10 ; INVÉRIFIABLE sur sujet nommé 03, 11 ; os : INEXACT 02, 07, 11, 12.)

## Contrôles (codes de sortie)

- `node tools/verif-contenu.js --cas-reel --cours=nosql` → **0** (14 conformes) ;
- `node tools/verif-contenu.js --cas-reel --cours=os` → **0** (14 conformes) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:/test-claude-b9-nosql-os c5b3e9d` → **5 écarts, tous
  expliqués** : « source » entre par la classe obligatoire `cas-reel__source` dans `os/lecon-01`, `-06`,
  `-10` et `-14`, où un distracteur porte « code source » (inévitable). J'ai compté, pour chaque question
  touchée, les mots étrangers à la page de chaque option avant et après : dans `-01`, `-06` et `-10`, ni la
  bonne réponse ni l'option extrême ne changent. Dans `-14`, la question « Quel est le rôle d'un système
  d'exploitation ? » passait de 6 (bonne réponse) / 7 (distracteur « Compiler le code source… ») à une
  égalité 6 / 6 : « ressources », mot de la bonne réponse, entre dans une phrase exacte de Gregg (« to
  reflect demand for other system resources, not just CPUs ») et rétablit l'écart 5 / 6. Tous les autres
  mots d'options perdus ou gagnés en route (« hiérarchique », « documents », « propriété », « usages »,
  « recherche », « période », « classement », « compresse », « boutique », « tableaux », « lancer »,
  « afficher », « copies », « moment », « acheter », « accélérer » ; « retraits », « refusé », « modèle »,
  « efface », « système », « moindre », « réglage », « déclencher », « passer », « instance »,
  « redémarrer », « rapide », « attente », « tâches », « d'autres », « remplace », « entièrement »,
  « qu'une », « changement ») ont été remis ou retirés dans des phrases exactes : 0 autre écart.
- `node tools/cas-reels/lots/controle-branche.js D:/test-claude-b9-nosql-os c5b3e9d` → OK (0 CR, 0 domaine
  interdit, octets identiques hors « Cas réel », types gardés, signatures, copie propre) ;
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées, les deux légitimes connues ;
- `node tools/verif.js --rapide` → voir la dernière section.

## Ce qui reste ouvert, et mes doutes

- **`os/lecon-11`, intertitre** « L'inversion de priorité : le bug qui a figé un robot sur Mars » : il n'est
  pas collé à l'encadré (deux paragraphes et une figure entre eux), donc laissé tel quel (« ne touche à rien
  d'autre »). « Un robot » peut désigner l'atterrisseur, mais le lecteur pensera au rover : à reprendre en
  B13 ou à la fusion si l'orchestrateur le juge trompeur (proposition : « … le bug qui réinitialisait Mars
  Pathfinder »). Le corps de `os/lecon-13` (« C'est lui qui relançait Mars Pathfinder à chaque blocage »)
  reste juste.
- **Copies hébergées par des tiers** (titre, auteurs, date et chiffres vérifiés dans le fichier) : Leveson
  et Turner (site de cours du RIT), Denning (site de cours de Waterloo), Tweedie (site de cours du MIT) ;
  le courriel de Reeves par la copie de l'Internet Archive de la page d'origine chez Microsoft Research.
  Les notes de version de MongoDB 5.0, la page de compatibilité de la 3.6 et le billet de MongoDB du
  6 janvier 2017 sont cités par l'Internet Archive (les URL d'origine redirigent ailleurs).
- **NVD** : la page `nvd.nist.gov/vuln/detail/CVE-2016-5195` ne se lit pas sans JavaScript ; j'ai ouvert et
  cité la même fiche par l'API officielle du NIST (description et date de publication).
- **`nosql/lecon-03`** : « un document JSON hiérarchique » est une propriété générale du JSON, pas une
  phrase du Guardian (entrée pour garder « hiérarchique », mot d'un distracteur que l'ancien récit portait).
- **`nosql/lecon-05`** : la question « Qui détient la propriété de cette société, trois intermédiaires plus
  loin ? » est un exemple de requête, pas une citation de l'ICIJ (elle garde « propriété » dans la page).
- **`nosql/lecon-13`**, dernière phrase (la boutique) : une comparaison, pas une affirmation de la source.
- **`os/lecon-03`** : « une tâche liée aux E/S, souvent bloquée, s'exécute peu » est la conséquence directe
  de la règle de CFS (exécuter la tâche qui a le moins tourné), pas une phrase de la documentation.
- **`os/lecon-09`** : « un programme coincé dans un `while (true) {}` … garde le processeur pour lui seul »
  découle de la doc d'Apple (le processeur n'est disponible que pour l'application en cours, qui ne rend la
  main qu'en appelant `WaitNextEvent` ou `EventAvail`) ; la phrase sur le noyau qui reprend la main à chaque
  tic renvoie au corps de la leçon, pas au communiqué d'Apple.
- **`os/lecon-05`** : la date « fin 2018 » s'appuie sur la date de disponibilité de l'édition LTSC 2019
  (version 1809), 13 novembre 2018, donnée par Microsoft ; la diffusion générale de 1809 a commencé plus tôt
  à l'automne 2018, sans que j'aie ouvert de source primaire pour cette date.
- Longueurs : 138 à 219 mots, au-dessus de la fourchette indicative (80 à 180) pour une dizaine de cas,
  surtout à cause des phrases exactes ajoutées pour le cliquet lexical.
- Le quiz de `nosql/lecon-14` (explication d'une question, non touchée) parle encore de « Des milliers de
  bases … rançonnées (« MongoDB apocalypse », 2017) » : surnom que je n'ai pas trouvé dans une source
  primaire. Hors de ma portée (QCM).
- Le registre `foyers.md` est à compléter par l'orchestrateur avec les 28 sujets ci-dessus.

## Consignes de fusion

- Branche `v18/b9-nosql-os`, partie de `c5b3e9d` : 28 pages (`pages/nosql/lecon-01` à `-14`,
  `pages/os/lecon-01` à `-14`), une ligne changée par page (l'encadré), et ce rapport.
- Index dérivés (`js/search-index.js`, `pages/etude-recherche.html`…) à régénérer après la fusion ;
  compteurs du cours `doc` (`doc-ref`, `doc-rec`) bougés par les 28 lignes de source.

## `node tools/verif.js --rapide` (lancé une fois, à la fin)

Code de sortie **1**, 422,4 s, **50 étapes vertes sur 54**, 4 signalées, toutes dans la liste tolérée ou
déjà rouges à la base :

- `donnees` — **I18** seulement (index dérivés périmés) : `search-index.js` (les 28 encadrés réécrits) et
  `quiz-index.js` (+20 octets : l'explication d'une question d'`ocaml/lecon-10`, « Rocq, anciennement Coq »,
  héritée de la base `c5b3e9d`, pas de ma branche — vérifié en regénérant l'index dans le scratchpad).
  À régénérer après la fusion.
- `doc-ref` et `doc-rec` (`verif-doc.js`, `verif-recherche.js`) — « 977 citent la source » : les 28 lignes
  de source de cette branche (949 → 977) ; « 8 leçons » (mentions de Stack Overflow ou d'un assistant de
  code) : aucune de mes 28 pages ne change ce compte (vérifié page par page contre la base), l'écart vient
  de la base.
- `normatf` (`verif-normatif.js`) — « leçons parlant de la spécification » (40 publié) : aucune de mes
  28 pages ne change la présence de « la spécification » (vérifié page par page) ; écart hérité de la base,
  toléré par la consigne.
