# Rapport V18 — case B10, lot 7 : les cours `linux`, `cicd` et `formats` (copie `b10-linux-cicd-formats`, branche `v18/b10-linux-cicd-formats`)

Copie de travail `D:\test-claude-b10-linux-cicd-formats`, partie de `01795b6`. Part traitée : les **34 « Cas réel »**
des cours `linux` (11, un par leçon), `cicd` (11, un par leçon) et `formats` (12 : un par leçon, deux dans
`lecon-06`). Pièces dans `scratchpad/b10-linux-cicd-formats/` (ignoré par git) : `new/<cours>__<NN>.html` (les
34 corps d'encadrés ; `formats__06-1` et `-2` pour les deux encadrés de `lecon-06`), `apply.js` (remplace du titre
de l'encadré au `</div></div>` final, refuse un remplacement ambigu, tout CR, tout lien hors de la ligne de source,
une source qui n'est pas en dernier, une espace simple devant « : ; ! ? » ou dans « », et calcule page par page les
mots d'options de QCM gagnés ou perdus avec la définition de `lexique-diff.js`), `hors-encadre.js` (preuve, en
lecture latin1, que les octets hors des encadrés sont identiques à `01795b6`), `dump.js`, `cherche.js` (un sujet
dans `pages/`, `foyers.md` et le fichier de réservations), `txt.py`, et les pages, PDF et fichiers ouverts
(`thrift.pdf`, `ooxml-wp.pdf`, `dl-docx/HelloWorld.docx`, `fhs3d.html`, `kde.html`, `fritz2020.html`, `npmtest/`…).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **11 hors de la règle à 0** pour `linux`, de
**11 à 0** pour `cicd` et de **12 à 0** pour `formats` ; sur les 34 cas trouvés, **2 étaient VRAIS** dans le détail
(`formats/lecon-02`, `formats/lecon-11` à une généralisation près), 4 vrais dans l'ensemble mais datés, exagérés
ou en partie non sourcés, 5 INEXACTS, 5 sujets gardés par d'autres cours ou racontés deux fois, 18 INVÉRIFIABLES
(récits anonymes, usages généraux), 0 INVENTÉ (au sens de B2) ; **9 corrigés sur leur sujet**, **25 remplacés** par un cas réel daté et
sourcé sur la même notion, **0 renommé « Scénario »**, **0 gardé tel quel**.

**Commits** (branche `v18/b10-linux-cicd-formats`) : `e151957` (linux, 11 cas), `7f01313` (cicd, 11 cas),
`163dadd` (formats, 12 cas), `a0f2a78` (formats, retouche de forme de `lecon-06#1`), puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` final (type `note`,
  icône, structure gardés). Aucun intertitre collé à corriger : les intertitres au-dessus des encadrés
  (« Pourquoi Linux domine côté serveur », « Les artefacts », « Échouer vite »…) sont des titres de section du
  cours, qui restent vrais. `hors-encadre.js` : **33 pages, 0 écart** hors encadrés, 0 CR.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ; aucun
  lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; 112 à 191 mots par corps.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` et dans
  `b10-reservations.txt` (34 lignes à moi, la dernière fait foi). Écartés parce qu'un autre cours les garde ou les
  prendra naturellement : Amazon 11,6 s (`kubernetes/lecon-03`), Knight Capital (`tests/lecon-14`), les gènes
  renommés par Excel (`python/lecon-02`), la panne CrowdStrike (`js/lecon-30`), la panne de Google Cloud du
  12 juin 2025 (`java/lecon-19`), Fedora 17 et UsrMove (`bash/lecon-02`, d'où le choix de la FHS plutôt que
  l'histoire du `/usr`), l'incendie d'OVHcloud à Strasbourg (`cloud/lecon-02`), Codecov (`bash/lecon-05`),
  la règle 3-2-1 (`bash/lecon-16`), le gel de k8s.gcr.io (`docker/lecon-07`), OpenAPI 3.1 (`api/lecon-14`),
  l'API météo du NWS (`api/lecon-01`), la porte dérobée de xz (cours `securite` et `offensive`), le post-mortem
  « sans reproche » d'Etsy/Allspaw (laissé à `observabilite/lecon-10`, dont c'est la notion).
- **Comportements rejoués** (Node 26.13.1, npm 11.20.0, Python 3.14.5, PyYAML 6.0.3 installé dans le scratchpad) :
  `npm install` sur un `package.json` à virgule finale → `EJSONPARSE … package.json must be actual JSON, not just
  JavaScript` ; PyYAML lit `[3.9, 3.10]` comme `[3.9, 3.1]` et `NO` comme `False` ; `'𝐀'.length` = 2,
  `'🎉'.length` = 2, `[...'🎉'].length` = 1 ; `JSON.parse` lit `10765432100123456789` et `…790` comme le même
  nombre `10765432100123458000` ; `'Café'` encodé en UTF-8 puis lu en Windows-1252 donne `CafÃ©` ; `utf-8-sig`
  écrit bien le BOM `EF BB BF` ; le `.docx` d'exemple du SDK Open XML contient `[Content_Types].xml`, `_rels/.rels`,
  `word/document.xml` avec `<w:body>` et `<w:p>`.
- **L'histoire d'un ticket se lit dans son historique** : `actions/runner-images` n° 10636 (chronologie lue :
  annonce du 17 septembre 2024, retour arrière du 16 octobre, corps réécrit le 5 novembre avec les nouvelles dates) ;
  `webpack` n° 14532 (commentaires des mainteneurs, PR n° 14584, commit `1d7f6da`) ; `moby/moby` n° 4737 et
  `actions/setup-python` n° 198 (dates de l'API GitHub).
- **Piège d'outil** : l'outil Write a converti la séquence `'\uD835\uDC00'` en caractère `𝐀` dans un fichier de
  travail ; écrite en `&#92;uD835&#92;uDC00` dans la page (`formats/lecon-09`).
- **Internet Archive** : bloquée par intermittence (« abusive bot traffic »), puis lisible avec un en-tête de
  navigateur ; ouverts ainsi : le billet de Jeff Mitchell (KDE, 2013), le rapport FritzFrog de Guardicore (2020),
  le billet de Rob Pike (non retenu).

## Les 34 cas

### `linux`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/linux/lecon-01.html#1` | VRAI dans l'ensemble (B2), mais daté et exagéré : « presque à coup sûr un serveur Linux » pour 64,5 % des sites dont l'OS est connu ; « trente ans plus tard » ; « des milliards de téléphones » sourcé par la presse ; événement | corrigé : citation retraduite (« just a hobby, won't be big and professional like gnu »), chiffres datés au 17/11/2026 (W3Techs 64,5 % ; TOP500 de novembre 2026 : 500 sur 500), noyau d'Android fondé sur un LTS, « de bonnes chances » | Cas réel — Linus Torvalds annonce son noyau (1991) | https://groups.google.com/g/comp.os.minix/c/dlNtH7RRrGA/m/SwRavCzVE7gJ ; https://www.helsinki.fi/en/news/mathematics-and-science/how-did-30-year-old-linux-conquer-world ; https://w3techs.com/technologies/details/os-linux ; https://www.top500.org/statistics/details/osfam/1/ (tableau lu par le formulaire de https://www.top500.org/statistics/list/) ; https://source.android.com/docs/core/architecture/kernel |
| `pages/linux/lecon-02.html#1` | INVÉRIFIABLE, anonyme (l'astreinte sur un Ubuntu, « toujours dans /var/log ») | remplacé : la FHS 3.0, de l'effort d'août 1993 au FSSTND du 14 février 1994, `/etc` et `/var/log` | Cas réel — la FHS 3.0, une arborescence commune (2015) | https://www.debian.org/doc/packaging-manuals/fhs/fhs-3.0.html (la copie de refspecs.linuxfoundation.org est derrière un anti-robot) |
| `pages/linux/lecon-03.html#1` | INVÉRIFIABLE, usage général prêté à un produit nommé (OpenSSH, « l'une des premières frayeurs de tout nouvel utilisateur »), sans date ni source | remplacé : Ubuntu 21.04 rend les dossiers personnels privés (755 → 750), `chmod 750 /home/*`, `DIR_MODE` | Cas réel — Ubuntu 21.04 rend les dossiers personnels privés (2021) | https://ubuntu.com/blog/private-home-directories-for-ubuntu-21-04 |
| `pages/linux/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« Un développeur », `start` sans `enable`) | remplacé : Debian 12 n'installe plus rsyslog, `apt-mark auto` / `apt autoremove`, `journalctl -e` / `-ef`, `/var/log/journal` | Cas réel — Debian 12 n'installe plus rsyslog (2023) | https://www.debian.org/releases/bookworm/amd64/release-notes/ch-information.en.html (§ 5.1.7) ; https://www.debian.org/News/2023/20230610 |
| `pages/linux/lecon-05.html#1` | INVÉRIFIABLE, général (robots sur le port 22) | remplacé : FritzFrog, force brute SSH depuis janvier 2020, plus de 500 serveurs percés, clé ajoutée à `authorized_keys`, conseils (mots de passe forts, clé publique) | Cas réel — FritzFrog, des robots contre les serveurs SSH (2020) | https://web.archive.org/web/20200826044010/https://www.guardicore.com/2020/08/fritzfrog-p2p-botnet-infects-ssh-servers/ (original du 19 août 2020) ; https://www.akamai.com/blog/security/fritzfrog-a-new-generation-of-peer-to-peer-botnets ; https://github.com/guardicore/labs_campaigns/tree/master/FritzFrog |
| `pages/linux/lecon-06.html#1` | INVÉRIFIABLE, général (« la plupart des clouds… », groupe de sécurité) | remplacé : ticket moby/moby n° 4737, les ports publiés par Docker joignables malgré `ufw default deny` ; doc. Docker « Docker and ufw » (table `nat`, chaînes `INPUT`/`OUTPUT`) | Cas réel — Docker passe sous le pare-feu ufw (2014) | https://github.com/moby/moby/issues/4737 ; https://docs.docker.com/engine/network/packet-filtering-firewalls/ |
| `pages/linux/lecon-07.html#1` | INVÉRIFIABLE comme cas (usage général de certbot, sans date) ; le « valables 90 jours » au présent va devenir faux (64 jours en 2027, 45 en 2028) | remplacé (même famille, recentré sur un événement daté) : Let's Encrypt annonce 45 jours (2 décembre 2025), fin des courriels d'expiration (4 juin 2025), `certbot.timer` de Debian 13 (00 h et 12 h, `RandomizedDelaySec=43200`, `Persistent=true`), seuil d'un tiers de la durée de vie depuis certbot 4.0.0 | Cas réel — Let's Encrypt raccourcit ses certificats à 45 jours (2025) | https://letsencrypt.org/2025/12/02/from-90-to-45 ; https://letsencrypt.org/2025/01/22/ending-expiration-emails/ ; https://sources.debian.org/src/python-certbot/4.0.0-2+deb13u1/debian/certbot.timer/ (et `certbot.service`, `certbot.cron.d`) ; https://eff-certbot.readthedocs.io/en/stable/using.html ; https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html |
| `pages/linux/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« Un classique du support ») | remplacé : le `/scratch` du cluster Jed de l'EPFL, 77 % d'espace mais 98 % d'inodes, supervision aveugle aux inodes | Cas réel — le /scratch de l'EPFL à court d'inodes (2023) | https://scitas-doc.epfl.ch/blog/2023/12/13/jed-scratch-full/ |
| `pages/linux/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« Un service disparaît… ») | remplacé : Facebook publie oomd (PSI, cgroups v2, livelocks de 30 minutes disparus) | Cas réel — Facebook publie oomd, un OOM killer hors du noyau (2018) | https://engineering.fb.com/2018/07/19/production-engineering/oomd/ |
| `pages/linux/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« Une petite association ») | remplacé : KDE, la corruption de git.kde.org recopiée par les miroirs anongit, un seul serveur intact vérifié par `git fsck` ; lien avec `rsync --delete` | Cas réel — KDE et le miroir trop parfait (2013) | https://web.archive.org/web/20130327024044/http://jefferai.org:80/2013/03/24/too-perfect-a-mirror/ ; https://mail.kde.org/pipermail/kde-core-devel/2013-March/078050.html (annonce de remise en service, 23 mars 2013, non citée dans l'encadré) |
| `pages/linux/lecon-11.html#1` | INVÉRIFIABLE, général (« Les bonnes équipes… ») | remplacé : customers.gitlab.com, disque plein le 25 mai 2021 (logrotate, vieux journaux, paquets de noyau), même cause qu'au 29 juin 2020, analyse « sans reproche », alerte à 90 % | Cas réel — customers.gitlab.com, deux fois le disque plein (2021) | https://gitlab.com/gitlab-com/gl-infra/production/-/issues/4716 ; https://gitlab.com/gitlab-com/gl-infra/production/-/issues/2342 (lus par l'API de GitLab) |

### `cicd`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/cicd/lecon-01.html#1` | sujet gardé par `kubernetes/lecon-03` (Amazon, 11,6 s), raconté ici sans source ; DORA invoqué sans source | remplacé : Facebook passe facebook.com à une livraison quasi continue depuis master (avril 2016 → avril 2017), paliers employés / 2 % / 100 %, correctifs urgents absorbés | Cas réel — Facebook livre son site depuis master (2017) | https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/ |
| `pages/cicd/lecon-02.html#1` | INVÉRIFIABLE : Prow et Kubernetes nommés, mais « milliers de jobs par jour » et « des centaines de contributeurs… chaque jour » sans source | remplacé : la file de fusion de GitHub (trains de 15 PR, 8 h d'attente, 2 500 PR par mois, -33 %), protection de branche | Cas réel — GitHub passe à la file de fusion (2023) | https://github.blog/engineering/engineering-principles/how-github-uses-merge-queue-to-ship-hundreds-of-changes-every-day/ |
| `pages/cicd/lecon-03.html#1` | INEXACT : « a exposé les secrets de milliers de pipelines » (l'avis dit : plus de 23 000 dépôts utilisaient l'action, secrets écrits dans les journaux, lisibles pour les dépôts publics) ; sujet raconté deux fois (lecon-07) ; événement | corrigé, **foyer du sujet** : 14-15 mars 2025, étiquettes déplacées (exemple `@v44.5.1` de la liste de l'avis), mémoire du runner, base64, consignes de l'avis ; parade par SHA d'après la doc. GitHub | Cas réel — l'action tj-actions/changed-files piégée (2025) | https://github.com/advisories/GHSA-mrrh-fwg8-r2c3 (et https://api.github.com/advisories/GHSA-mrrh-fwg8-r2c3) ; https://docs.github.com/en/actions/reference/security/secure-use |
| `pages/cicd/lecon-04.html#1` | INVÉRIFIABLE (B2), deux récits anonymes | remplacé : Node.js 17 et OpenSSL 3 cassent webpack (`error:0308010C`), webpack 5.61.0 passe à un md4 en WebAssembly et ajoute Node 17 à sa matrice (commit `1d7f6da`, `cache: "yarn"`) | Cas réel — Node.js 17 casse les builds de webpack (2021) | https://nodejs.org/en/blog/release/v17.0.0 ; https://nodejs.org/dist/index.json ; https://github.com/webpack/webpack/issues/14532 ; https://github.com/webpack/webpack/pull/14584 ; https://github.com/webpack/webpack/releases/tag/v5.61.0 ; https://github.com/webpack/webpack/commit/1d7f6da4162f23995c8a5baf88ba9f5f73b33c76 |
| `pages/cicd/lecon-05.html#1` | sujet gardé par `tests/lecon-14` (Knight Capital), non revérifié ici | remplacé : Slack, staging, dogfood, canary à 2 %, paliers 10-25-50-75-100 %, retour au build précédent | Cas réel — Slack déploie par paliers, du canary à 100 % (2020) | https://slack.engineering/deploys-at-slack/ |
| `pages/cicd/lecon-06.html#1` | INEXACT : « environ 18 000 organisations » (le 8-K dit : moins de 18 000 clients ont pu installer une version piégée) ; « dont de grandes administrations » sans source ; événement | corrigé : 8-K du 14 décembre 2020 (système de build compromis, mises à jour de mars à juin 2020, 33 000 clients prévenus), composant signé (FireEye), directive CISA ED 21-01 | Cas réel — SolarWinds, le système de build compromis (2020) | https://www.sec.gov/Archives/edgar/data/1739942/000162828020017451/swi-20201214.htm ; https://cloud.google.com/blog/topics/threat-intelligence/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor ; https://www.cisa.gov/news-events/directives/ed-21-01-mitigate-solarwinds-orion-code-compromise |
| `pages/cicd/lecon-07.html#1` | même sujet que `lecon-03` (tj-actions) ; « les projets épinglés par SHA sont restés indemnes » absent de l'avis | remplacé : CircleCI, session volée sur un portable, variables d'environnement, jetons et clés exfiltrés le 22 décembre 2022, recommandation OIDC | Cas réel — CircleCI et les secrets de ses clients (2023) | https://circleci.com/blog/jan-4-2023-incident-report/ |
| `pages/cicd/lecon-08.html#1` | INVÉRIFIABLE, général (« `npm ci` à froid prend deux à trois minutes ») | remplacé : GitHub Actions Artifacts v4 (4 millions d'artefacts par jour, archive unique, plus de 10x, artefacts immuables, noms suffixés en matrice) | Cas réel — GitHub reconstruit ses artefacts, la v4 (2024) | https://github.blog/news-insights/product-news/get-started-with-v4-of-github-actions-artifacts/ |
| `pages/cicd/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« Une équipe déployait toujours `monimage:latest` ») | remplacé : `ubuntu-latest` vers Ubuntu 24.04 (annonce, pipelines cassés, retour arrière du 16 octobre, nouvelle bascule du 5 décembre 2024 au 17 janvier 2025) ; lien vers la référence immuable des images de conteneur | Cas réel — ubuntu-latest passe à Ubuntu 24.04 (2024) | https://github.com/actions/runner-images/issues/10636 (corps, commentaires et chronologie lus par l'API) |
| `pages/cicd/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« Une équipe fintech ») | remplacé : Flickr, feature flags et flippers, code livré éteint puis activé | Cas réel — Flickr déploie du code éteint (2009) | https://code.flickr.net/2009/12/02/flipping-out/ |
| `pages/cicd/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« Une équipe produit… en six mois ») | remplacé : Netflix, Nebula, Jenkins, AMI cuite une fois, Spinnaker, 16 minutes du commit au déploiement multirégion ; phrase de lien avec les conteneurs (voir « lexique ») | Cas réel — Netflix, du commit à la production en 16 minutes (2016) | https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15 |

### `formats`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/formats/lecon-01.html#1` | INVÉRIFIABLE, anonyme (« Une API météo publique ») | remplacé : Facebook ouvre Thrift, types et interfaces dans un fichier neutre, cinq langages, XML ou binaire indifférent | Cas réel — Facebook publie Thrift (2007) | https://thrift.apache.org/static/files/thrift-20070401.pdf (lu avec pypdf) ; https://thrift.apache.org/about |
| `pages/formats/lecon-02.html#1` | VRAI (B2) ; généralisation « à la racine de tout projet JavaScript » ; « la CI lit le numéro de version, npmjs.com l'affiche » sans source ; produit nommé | corrigé : `package.json` « doit être du vrai JSON » (doc. npm 11), extension npm de VS Code, `EJSONPARSE` rejoué avec npm 11.20.0 | Cas réel — package.json et l'erreur EJSONPARSE de npm (2026) | https://docs.npmjs.com/cli/v11/configuring-npm/package-json ; https://github.com/microsoft/vscode/blob/main/extensions/npm/README.md ; essai local |
| `pages/formats/lecon-03.html#1` | sujet gardé par `python/lecon-02` (les gènes renommés), non revérifié ici | remplacé : PEP 305, `line.split(",")` « finit par échouer », le « V » de Vague, pas d'interprétation des types | Cas réel — la PEP 305 donne un lecteur CSV à Python (2003) | https://peps.python.org/pep-0305/ |
| `pages/formats/lecon-04.html#1` | INVÉRIFIABLE, général : causalité « a poussé YAML 1.2 à retirer » non sourcée, « scénario typique en CI » sans sujet | remplacé : `3.10` lu `3.1` dans une matrice GitHub Actions (tickets n° 198, 334, 482, 695 d'actions/setup-python), rejoué avec PyYAML, `NO` → `False` | Cas réel — « 3.10 » lu 3.1 dans GitHub Actions (2021) | https://github.com/actions/setup-python/issues/198 ; /334 ; /482 ; /695 (dates par l'API) ; essai local avec PyYAML 6.0.3 (roue de PyPI installée par `pip install --target` dans le scratchpad) |
| `pages/formats/lecon-05.html#1` | VRAI dans l'ensemble, non daté ; « des milliards de documents bureautiques reposent ainsi sur XML » sans source ; produit nommé | corrigé : ECMA-376, 1re édition (décembre 2006), comité TC45, but (400 millions d'utilisateurs, plus de 40 milliards de documents binaires), XML et ZIP, `.docx` dézippé | Cas réel — Office Open XML, des documents en XML zippé (2006) | https://ecma-international.org/publications-and-standards/standards/ecma-376/ ; https://ecma-international.org/wp-content/uploads/OpenXML-White-Paper.pdf (date par les métadonnées du PDF : 11 décembre 2006) ; https://raw.githubusercontent.com/dotnet/Open-XML-SDK/main/test/DocumentFormat.OpenXml.Tests.Assets/assets/TestFiles/HelloWorld.docx |
| `pages/formats/lecon-06.html#1` | VRAI dans l'ensemble, non daté ; « propriété inconnue, champ obligatoire manquant » non vérifié ; produit nommé | corrigé : `jsonValidation` de l'extension npm (`package.json` → `https://www.schemastore.org/package`), doc. VS Code (schémas des extensions, `$schema` propre à VS Code) | Cas réel — VS Code valide package.json avec SchemaStore (doc. 2026) | https://code.visualstudio.com/docs/languages/json ; https://github.com/microsoft/vscode/blob/main/extensions/npm/package.json (et le manifeste de `json-language-features`) |
| `pages/formats/lecon-06.html#2` | INEXACT ou non sourcé : « Par défaut, Excel suppose l'encodage local (Windows-1252) » (l'aide de Microsoft dit seulement : ouverture normale avec BOM, sinon Power Query ou l'assistant) ; « une immense part des tickets » invérifiable | corrigé : blog Excel du 6 décembre 2016 (format CSV en UTF-8), aide Microsoft (BOM, Power Query), mojibake `CafÃ©` rejoué, `utf-8-sig` | Cas réel — Excel et les CSV en UTF-8 (2016) | https://techcommunity.microsoft.com/blog/excelblog/the-excel-community-updates-and-uservoice/34258 ; https://support.microsoft.com/en-us/office/opening-csv-utf-8-files-correctly-in-excel-8a935af5-3416-4edd-ba7e-3dfd2bc4a032 ; essai local |
| `pages/formats/lecon-07.html#1` | second encadré SchemaStore du cours (après `lecon-06#1`) ; « des milliers de schémas publics » non vérifié ; général | remplacé : les schémas structurels des CRD de Kubernetes (le champ `privileged` inconnu, `minLength`, `pattern`, `oneOf`, élagage), CRD stables dans Kubernetes 1.16 | Cas réel — Kubernetes exige des schémas complets (2019) | https://kubernetes.io/blog/2019/06/20/crd-structural-schema/ ; https://kubernetes.io/blog/2019/09/18/kubernetes-1-16-release-announcement/ |
| `pages/formats/lecon-08.html#1` | INVÉRIFIABLE : gRPC « utilisé par Google, Netflix, Uber », « bien plus vite qu'en JSON » sans source | remplacé : Google ouvre Protocol Buffers (pourquoi ni XML ni octets bruts, compatibilité entre versions, « au moins un ordre de grandeur plus rapide que XML ») | Cas réel — Google ouvre Protocol Buffers (2008) | https://opensource.googleblog.com/2008/07/protocol-buffers-googles-data.html |
| `pages/formats/lecon-09.html#1` | comportement vrai mais général, sans date ni source | remplacé (même notion, sourcée) : « JavaScript has a Unicode problem », paires de substitution, `Array.from` / `[...s]`, rejoué dans Node | Cas réel — « JavaScript has a Unicode problem » (2013) | https://mathiasbynens.be/notes/javascript-unicode ; essai local |
| `pages/formats/lecon-10.html#1` | INEXACT sur deux points : « deux tweets différents pouvaient recevoir le même identifiant » non dit par la source (rejoué : deux identifiants voisins donnent bien le même nombre) ; « gravé dans la documentation de milliers d'API » invérifiable ; produit nommé, **foyer** du sujet | corrigé : annonce Snowflake de Matt Harris (64 bits, plus de 53 bits pour JavaScript, `id` et `id_str`, 26 novembre 2010), doc. X IDs actuelle, `JSON.parse` rejoué | Cas réel — Twitter ajoute id_str à ses identifiants (2010) | https://groups.google.com/g/twitter-api-announce/c/ahbvo3VTIYI ; https://docs.x.com/fundamentals/x-ids (et sa version .md) ; essai local |
| `pages/formats/lecon-11.html#1` | VRAI dans l'ensemble, non daté ; « documente chaque champ » non vérifié ; produit nommé | corrigé : versions datées (`2017-05-24`), compte épinglé, `Stripe-Version`, modules de transformation, près de cent changements incompatibles en six ans | Cas réel — Stripe date les versions de son API (2017) | https://stripe.com/blog/api-versioning |

## Décomptes

| cours | « Cas réel » | corrigés sur leur sujet | remplacés | renommés « Scénario » | `--cas-reel` avant → après |
|---|---:|---:|---:|---:|---|
| `linux` | 11 | 1 | 10 | 0 | 11 → 0 |
| `cicd` | 11 | 2 | 9 | 0 | 11 → 0 |
| `formats` | 12 | 6 | 6 | 0 | 12 → 0 |
| **total** | **34** | **9** | **25** | **0** | **34 → 0** |

État trouvé (34) : VRAI 2 (`formats/lecon-02`, `formats/lecon-11` à une généralisation près) ; VRAI dans l'ensemble
mais daté, exagéré ou en partie non sourcé 4 (`linux/lecon-01`, `formats/lecon-05`, `-06#1`, `-09`) ; INEXACT 5
(`cicd/lecon-03`, `cicd/lecon-06`, `formats/lecon-06#2`, `formats/lecon-10`, `linux/lecon-07` au présent) ;
sujet gardé ailleurs ou doublon 5 (`cicd/lecon-01`, `-05`, `-07`, `formats/lecon-03`, `-07`) ; INVÉRIFIABLE 18
(récits anonymes ou usages généraux) ; INVENTÉ 0.

## Contrôles (codes de sortie, état commité avant ce rapport)

- `node tools/verif-contenu.js --cas-reel --cours=linux` → **0** ; `--cours=cicd` → **0** ; `--cours=formats` → **0** ;
- `node tools/verif-contenu.js --strict` → **0** (« Toutes les lecons tiennent le standard ») ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/verif-fraicheur.js` → **0** ;
- `scratchpad/.../hors-encadre.js 01795b6` → **0** (33 pages, octets hors encadrés identiques, 0 CR) ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b10-linux-cicd-formats 01795b6` → **4 écarts, tous dans
  `cicd/lecon-11`, voulus** (voir ci-dessous) ; 0 ailleurs ;
- `node tools/verif.js --rapide` → voir la section suivante.

**Lexique, `cicd/lecon-11`.** La ligne de source obligatoire (`cas-reel__source`, « Source : ») fait entrer le mot
« source » dans la page ; il est le seul mot du distracteur « Le code source » de la question 2 (« Qu'est-ce qui
varie légitimement d'un environnement à l'autre… »). Avant, la question était équilibrée à 1/1/1/1 mot étranger à la
page (« injectés », « source », « dépendances », « dockerfile ») ; après la seule ligne de source, 1/0/1/1. Comme le
demande la consigne, les trois autres options sont égalisées avec une phrase exacte : Nebula « gère aussi les
dépendances » (« plugins for dependency management ») et une phrase de lien avec le cours, « Avec des conteneurs, le
principe reste le même : l'image se construit une fois à partir d'un Dockerfile, dépendances comprises, et les
réglages de chaque environnement sont injectés à l'exécution » (principe enseigné par la leçon, présenté comme tel,
pas prêté à Netflix). La question passe à 0/0/0/0 ; les 12 autres questions de la page sont inchangées (comparaison
question par question) ; les deux cliquets restent à 0.

## `verif.js --rapide`

`node tools/verif.js --rapide` (une seule fois, 800,6 s sur une machine partagée) → **code 1, 54 vérificateurs,
4 ont signalé** :

- `donnees` : **invariant I18 seul** (`search-index.js` publié divergent du contenu régénéré, +5 240 octets) — toléré,
  l'orchestrateur régénère après la fusion ; I17 et I19 ne sont que des avertissements déjà présents à la base ;
- `doc-ref` : « la page de cours cite le nombre de leçons qui renvoient à un document = 121 » — toléré, les lignes de
  source font bouger ce chiffre mesuré sur tout le site ;
- `doc-rec` : « 1 188 citent la source » introuvable dans la page du cours `doc` — toléré, même cause ;
- `etude-4` (`tools/preuves/etude-reecriture.js`) : « la page n'a pas fini de se construire » dans Chrome, sous la
  charge de dix agents ; **relancé seul, il passe : code 0** (« les deux programmes publiés rendent, dans le
  navigateur, EXACTEMENT la sortie publiée ; le banc aussi »). Rien de ma part n'y touche (`pages/etude-reecriture.html`
  et ses programmes sont hors de ma part).

Tous les autres sont verts, dont `qcmbiai`, `qcmlexi`, `contenu`, `fraich`, `domaine`, `source`, `caract`.
Après ce passage, une retouche de forme a été faite dans `formats/lecon-06#1` (« l'autocomplétion des champs et les
soulignés rouges s'appuient sur un JSON Schema », car la doc. de VS Code propose aussi des suggestions sans schéma),
puis les contrôles rapides ont été rejoués sur l'état final (voir les codes plus haut, inchangés).

## Ce qui reste ouvert

- **Source partagée entre cours (légitime, même document, sujets différents)** : les notes de publication de
  Debian 12, chapitre `ch-information`, servent à `linux/lecon-04` (§ 5.1.7, rsyslog) et à `python/lecon-18`
  (§ 5.2.2, pip « externally managed ») ; `doublons.js` passe de 2 à 3 groupes. À inscrire au registre parmi les
  sources partagées légitimes.
- **Sujets à inscrire au registre des foyers** : tj-actions/changed-files (`cicd/lecon-03`), Twitter `id`/`id_str`
  (`formats/lecon-10`), SolarWinds (`cicd/lecon-06`), CircleCI 2023 (`cicd/lecon-07`), FritzFrog (`linux/lecon-05`),
  KDE 2013 (`linux/lecon-10`), Let's Encrypt 45 jours (`linux/lecon-07`), la FHS (`linux/lecon-02`), Thrift
  (`formats/lecon-01`), Protocol Buffers 2008 (`formats/lecon-08`), PEP 305 (`formats/lecon-03`), la file de fusion
  de GitHub (`cicd/lecon-02`), Flickr « Flipping Out » (`cicd/lecon-10`), Netflix 2016 (`cicd/lecon-11`).
  `crypto/lecon-06` (B12) parle de certificats de 47 jours dans du code, sans être encore un « Cas réel » sourcé :
  sujet voisin du mien (les 45 jours de Let's Encrypt), à surveiller.
- **Dates de source indirectes** : le billet de Torvalds est daté « août 1991 » (Google Groups affiche le 26 août
  selon le fuseau, l'université d'Helsinki écrit 19 août, le message est couramment daté du 25) ; l'article sur Thrift
  n'a pas de date dans le texte (nom du fichier `thrift-20070401.pdf`, et « open sourced in April 2007 » sur le site
  d'Apache Thrift) ; l'aperçu d'Ecma TC45 est daté par les métadonnées du PDF (11 décembre 2006) ; l'annonce
  Snowflake de Twitter est datée « octobre 2010 » (19 octobre en UTC, le 18 au soir en Californie).
- **Hors encadré, non touché** : les leçons de `cicd` écrivent `runs-on: ubuntu-latest` partout, ce
  que le nouveau cas de `cicd/lecon-09` met en garde pour la reproductibilité ; `formats/lecon-04` présente le
  « problème de la Norvège » dans son corps (non vérifié ici, l'encadré ne le reprend que par l'essai PyYAML).
- **Fraîcheur (phase E)** : les marques `fraicheur` des anciens encadrés de `cicd/lecon-01` (DORA), `-02` (Prow) et
  `-08` (`npm ci`) sont parties avec eux ; leurs ancres restent dans `tools/fraicheur/releves/infra-2026-09-03.json`.
  `verif-fraicheur.js` reste à 0. Phrases au présent à dater en phase E : W3Techs et TOP500 (`linux/lecon-01`, datés
  au 17 novembre 2026 dans l'encadré), la doc. de npm, de VS Code, de Docker, de GitHub et de X (consultées le
  17 novembre 2026, dites ainsi dans les lignes de source).

## Consignes de fusion

- Branche `v18/b10-linux-cicd-formats`, partie de `01795b6`, 5 commits, sans commit de fusion ; seuls
  `pages/linux/lecon-*.html`, `pages/cicd/lecon-*.html`, `pages/formats/lecon-*.html` (33 pages) et ce rapport
  changent. Aucun index dérivé, ni `js/data.js`, ni QCM touché.
- Après fusion : régénérer les index dérivés (`search-index.js`, `etude-recherche.html`… jusqu'au point fixe) et les
  compteurs du cours `doc` (`doc-ref`, `doc-rec`, `normatf`), que les lignes de source font bouger ; inscrire au
  registre les sujets et la source partagée listés plus haut.
