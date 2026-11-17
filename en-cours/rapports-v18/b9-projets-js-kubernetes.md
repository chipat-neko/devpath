# Rapport V18 — case B9, lot 6 : les cours `projets-js` et `kubernetes` (copie `b9-projets-js-kubernetes`, branche `v18/b9-projets-js-kubernetes`)

Copie de travail `D:\test-claude-b9-projets-js-kubernetes`, partie de `c5b3e9d`. Part traitée : les **36 « Cas réel »**
des cours `projets-js` (24, un par leçon) et `kubernetes` (12, un par leçon). Pièces dans
`scratchpad/b9-projets-js-kubernetes/` (ignoré par git) : `new/<cours>__<NN>.html` (les 36 corps d'encadrés),
`apply.js` (remplace du titre de l'encadré au `</div></div>` final, refuse un remplacement ambigu, refuse tout
CR, tout lien hors de la ligne de source, une source qui n'est pas en dernier, une espace simple devant
« : ; ! ? » ou dans « », et calcule page par page les mots d'options de QCM gagnés ou perdus avec la définition
de `lexique-diff.js`), `dump.js`, `txt.py` et `k8s.py` (texte d'une page téléchargée), et les pages, PDF et
sources ouverts (`varia2011.pdf`, `harel87.pdf` et ses pages en image, `doomsrc/` : les 124 fichiers de
`linuxdoom-1.10`, `pwgen.mjs`, `bcd-closest.json` = browser-compat-data de MDN…).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **24 hors de la règle à 0** pour
`projets-js` et de **12 à 0** pour `kubernetes` ; sur les 36 cas trouvés, **un seul était VRAI** dans le détail
(`kubernetes/lecon-03`, Amazon 2011, revérifié et gardé), 5 INEXACTS, 2 justes dans les grandes lignes mais sans
date ni source, 28 INVÉRIFIABLES (usages généraux prêtés à des produits nommés, récits anonymes), 0 INVENTÉ ;
**30 remplacés** par un cas réel daté et sourcé sur la même notion, **6 corrigés sur leur sujet**,
**0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b9-projets-js-kubernetes`) : `780e6b7` (projets-js, 24 cas), `0ef795f` (kubernetes,
12 cas), puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`, icône,
  structure gardés). Aucun intertitre collé à corriger : dans les 36 leçons, les seuls intertitres au-dessus
  d'un encadré sont les deux `<h2>Cas réel</h2>` de `kubernetes/lecon-11` et `-12`, génériques, qui restent vrais.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ; aucun
  lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; 138 à 200 mots par corps (le plus long,
  `kubernetes/lecon-07`, Buffer, garde la recommandation finale de l'auteur).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` et dans le fichier
  commun `b9-reservations.txt` (36 lignes à moi). Écartés parce qu'un autre cours les garde : jQuery et `.live()`
  (`js/lecon-11`), Flux (`js/lecon-31`), « Pourquoi React est né » (`react/lecon-01`), les événements de React 17
  (`react/lecon-07`), le plafond de 7 jours de Safari sur localStorage (`js/lecon-32`), Heilmann et la lenteur de
  localStorage (`js/lecon-12`), GOV.UK et `type="number"` (`html/lecon-09`), Wroblewski 2009 (`html/lecon-43`,
  sujet différent du mien, gardé distinct), Om et TodoMVC (`clojure/lecon-06`), « How Bad Can It Git? »
  (`git/lecon-07`), la panne de Reddit du jour de pi (`iac/lecon-01`), l'action `sleep` du `preStop`
  (`nodejs/lecon-20`). Stockfish évité (cité par `algo/lecon-20`). `doublons.js` : toujours **2** sources
  partagées (les deux légitimes connues).
- **Comportements et codes lus ou rejoués** : `Date.now()` appelé deux fois dans la même milliseconde rend la même
  valeur (Node 24) ; `PasswordGenerator.sys.mjs` de Firefox lu en entier (alphabets, longueur 15, un caractère par
  classe puis mélange, rejet des valeurs trop hautes) ; les 124 fichiers `.c`/`.h` de `linuxdoom-1.10` :
  **seul `i_video.c` inclut les en-têtes X11** (`doomdef.h` n'en a qu'un commentaire), seul `i_video.c` appelle
  `D_PostEvent`, `xlatekey` traduit `XK_Left` en `KEY_LEFTARROW` ; `nouvellePomme` de `projets-js/lecon-15` prend
  la première case libre (pas de `Math.random`), d'où « sans hasard » ; le filtre `t.id !== id` de
  `projets-js/lecon-06` supprimerait deux transactions de même identifiant.
- **Sources difficiles** : l'article de Harel (1987) est un PDF scanné sans texte ; ses pages 231, 236 et 237 ont
  été extraites en image (pypdf + Pillow) et lues (montre Citizen Quartz Multi-Alarm III, boutons a à d, figure 9,
  note sur Israel Aircraft Industries). Les billets Medium (Skyscanner, JW Player) et ceux de Spotify Labs, Dark
  Sky et Google Developers (2018) sont cités par leur copie de l'Internet Archive, effectivement ouverte. Les dates
  de version des navigateurs (dataset, `closest`, `randomUUID`) viennent de browser-compat-data de MDN.
- **Le présent devenu faux** : Ingress NGINX est raconté au passé et son dépôt est dit archivé (bandeau GitHub :
  « archived by the owner on Mar 24, 2026 ») ; Dark Sky au passé ; Helm 3 daté de 2019 (Helm 4 est sorti, voir
  « ouvert »).

## Les 36 cas

### `projets-js`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/projets-js/lecon-01.html#1` | INVÉRIFIABLE, usage général prêté à des produits nommés (les reducers de Redux « font tourner » Facebook et Instagram) | remplacé : la Calculatrice de Windows publiée en open source, MVVM, CalcEngine qui garde l'état, RatPack en précision « infinie » | Cas réel — la Calculatrice de Windows ouvre son code (2019) | https://blogs.windows.com/windowsdeveloper/2019/03/06/announcing-the-open-sourcing-of-windows-calculator/ ; https://github.com/microsoft/calculator/blob/main/docs/ApplicationArchitecture.md |
| `pages/projets-js/lecon-02.html#1` | INVÉRIFIABLE, usage général (listes infinies de X/Twitter) | remplacé : John Resig présente les attributs `data-` et `dataset` ; Firefox 6 ; `DOMStringMap` | Cas réel — John Resig et les attributs data- de HTML 5 (2008) | https://johnresig.com/blog/html-5-data-attributes/ ; https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/6 ; https://html.spec.whatwg.org/multipage/dom.html |
| `pages/projets-js/lecon-03.html#1` | INVÉRIFIABLE (Kahoot! et Duolingo « stockent la bonne réponse par index » : introuvable) ; la mention de Spotify et Fisher-Yates était juste | remplacé : Spotify 2014, sujet repris de l'ancien encadré et sourcé (plaintes, Fisher-Yates depuis le lancement, sophisme du joueur, algorithme inspiré du tramage) | Cas réel — Spotify et son mélange « pas assez aléatoire » (2014) | https://web.archive.org/web/20200612074218/https://labs.spotify.com/2014/02/28/how-to-shuffle-songs/ |
| `pages/projets-js/lecon-04.html#1` | INVÉRIFIABLE, général (React et Vue « derrière une immense part du web », Facebook, WhatsApp Web, Airbnb) | remplacé : « Pure UI » de Guillermo Rauch (refonte de VideoPress, l'interface fonction pure de l'état, décrire A et B plutôt que la transition) | Cas réel — Guillermo Rauch et l'interface, fonction pure de l'état (2015) | https://rauchg.com/2015/pure-ui |
| `pages/projets-js/lecon-05.html#1` | INVÉRIFIABLE (fonctionnement interne de Bankin', Linxo et YNAB) | remplacé : l'API de YNAB et ses montants entiers en milliunits (sujet YNAB repris, sur sa documentation) ; v1.0.0 du 19/06/2018 ; champs `_formatted` de la v1.82.0 (02/04/2026) | Cas réel — l'API de YNAB compte en « milliunits » (2018) | https://api.ynab.com/ |
| `pages/projets-js/lecon-06.html#1` | INVÉRIFIABLE, général (paniers d'Amazon et de la Fnac, Todoist, Trello, délégation de React) | remplacé : la proposition `crypto.randomUUID()` (uuid sur npm : 235 millions de téléchargements par mois, 8,2 millions de dépôts, avril 2021), Chrome 92, Firefox 95, Safari 15.4 ; relié au `Date.now()` de la leçon | Cas réel — crypto.randomUUID() arrive dans les navigateurs (2021) | https://github.com/WICG/uuid/blob/14c29dce221dbd375dde60718c226cad49dbe1e7/explainer.md ; https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID ; browser-compat-data (unpkg.com/@mdn/browser-compat-data) |
| `pages/projets-js/lecon-07.html#1` | **INEXACT** (B2 confirmé) : le générateur de Chrome est en C++ et ne tire pas avec `crypto.getRandomValues` ; 1Password, Bitwarden et « un indicateur de force » introuvables | corrigé sur son sujet : le générateur de Firefox 70 seul, d'après son code (quatre jeux sans caractères ambigus, longueur 15, un caractère par jeu puis mélange, rejet des valeurs qui biaiseraient le modulo) | Cas réel — le générateur de mots de passe de Firefox (2019) | https://www.firefox.com/en-US/firefox/70.0/releasenotes/ ; https://github.com/mozilla-firefox/firefox/blob/main/toolkit/components/passwordmgr/shared/PasswordGenerator.sys.mjs ; https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues |
| `pages/projets-js/lecon-08.html#1` | INVÉRIFIABLE (GitHub, Google Docs, MDN, Stack Overflow « tous » sur `writeText` avec un retour d'une seconde) | remplacé : l'API Clipboard asynchrone, livrée dans Chrome 66 (HTTPS, onglet actif, écrire sans permission, lire avec) | Cas réel — Chrome 66 et l'API Clipboard asynchrone (2018) | http://web.archive.org/web/20180430032355/https://developers.google.com/web/updates/2018/03/clipboardapi ; https://web.dev/articles/async-clipboard |
| `pages/projets-js/lecon-09.html#1` | INVÉRIFIABLE, général (Photoshop, Figma, Redux) | remplacé : le tutoriel officiel de React (morpion, `slice()`, tableau `history`, `jumpTo`), déjà présent en octobre 2017 | Cas réel — le tutoriel de React, un morpion qui remonte le temps (2017) | https://react.dev/learn/tutorial-tic-tac-toe ; https://github.com/reactjs/legacy.reactjs.org/blob/93aa551f1a565fe77e166c6ace9b8f036f52c7e1/content/tutorial/tutorial.md |
| `pages/projets-js/lecon-10.html#1` | INVÉRIFIABLE, général (fil X, Facebook, boîte mail) | remplacé : Svelte 5 délègue `click` et d'autres événements à un écouteur racine ; pièges `bubbles: true` et `stopPropagation()` | Cas réel — Svelte 5 confie les clics à un seul écouteur (2024) | https://svelte.dev/blog/svelte-5-is-alive ; https://svelte.dev/docs/svelte/basic-markup ; https://svelte.dev/docs/svelte/v5-migration-guide |
| `pages/projets-js/lecon-11.html#1` | INVÉRIFIABLE, général (feu tricolore, lecteur vidéo, XState) | remplacé : les statecharts de David Harel et sa montre Citizen | Cas réel — David Harel décrit une montre en « statecharts » (1987) | http://web.archive.org/web/20230331082501/https://www.wisdom.weizmann.ac.il/~harel/SCANNED.PAPERS/Statecharts.pdf (pages lues en image) |
| `pages/projets-js/lecon-12.html#1` | INVÉRIFIABLE, général (fuites d'intervalles dans une application monopage) | remplacé : le bridage intensif des minuteurs enchaînés de Chrome 88 dans les pages cachées (une vérification par minute), relié à la dérive et à l'horodatage de la leçon | Cas réel — Chrome 88 freine les minuteurs des onglets cachés (2021) | https://developer.chrome.com/blog/timer-throttling-in-chrome-88 |
| `pages/projets-js/lecon-13.html#1` | INVÉRIFIABLE, anonyme (« une appli météo », « un tableau de bord ») | remplacé : Dark Sky rejoint Apple, plus d'inscriptions à son API, arrêt repoussé au 31/03/2023, renvoi vers WeatherKit | Cas réel — Dark Sky rejoint Apple et annonce la fin de son API météo (2020) | http://web.archive.org/web/20240810150359/https://blog.darksky.net/dark-sky-has-a-new-home/ |
| `pages/projets-js/lecon-14.html#1` | INVÉRIFIABLE, général (squelettes de LinkedIn, YouTube, Facebook ; TanStack Query, SWR, RTK Query) | remplacé : Luke Wroblewski, les indicateurs de chargement de Polar remplacés par des écrans squelettes | Cas réel — Luke Wroblewski et les indicateurs de chargement de Polar (2013) | https://www.lukew.com/ff/entry.asp?1797 |
| `pages/projets-js/lecon-15.html#1` | INVÉRIFIABLE, général (moteur d'échecs, Redux, « time-travel debugging ») | remplacé : Elm Reactor (entrées enregistrées, fonctions pures rejouées, instantané tous les 100 événements) | Cas réel — Elm Reactor fait remonter le temps à un programme (2014) | https://elm-lang.org/news/time-travel-made-easy (texte lu dans sa source : https://github.com/elm/elm-lang.org/blob/master/pages/news/time-travel-made-easy.elm ; auteur : `src/Skeleton.elm`) |
| `pages/projets-js/lecon-16.html#1` | **INEXACT** : « le cœur de tous les moteurs de jeu professionnels (Unity, Unreal, Godot) », « relu par des générations », et l'écran à 120 Hz, absent de l'article ; l'article lui-même est réel | corrigé sur son sujet : l'article de Fiedler seul, daté (pas fixe, pas variable, accumulateur, « le rendu produit du temps, la simulation le consomme », spirale de la mort) | Cas réel — Glenn Fiedler, « Fix Your Timestep! » (2004) | https://gafferongames.com/post/fix_your_timestep/ |
| `pages/projets-js/lecon-17.html#1` | INVÉRIFIABLE (DocuSign, Excalidraw, tldraw) | remplacé : les Pointer Events, Recommandation du W3C (pointeur = souris, stylet, doigt ; pression, inclinaison ; `touch-action`) | Cas réel — les Pointer Events deviennent une norme du W3C (2015) | https://www.w3.org/TR/2015/REC-pointerevents-20150224/ |
| `pages/projets-js/lecon-18.html#1` | **INEXACT** (B2 confirmé) : Audacity, éditeur de bureau en C++, n'utilise pas `getByteTimeDomainData` ; Winamp, iTunes, Zoom, Meet, Discord introuvables | remplacé : Chrome 71 étend sa politique d'autoplay à Web Audio (`AudioContext` « suspended », `resume()` après un geste), relié au `resume()` de la leçon | Cas réel — Chrome 71 soumet Web Audio à sa règle d'autoplay (2018) | https://developer.chrome.com/blog/autoplay ; https://chromereleases.googleblog.com/2018/12/stable-channel-update-for-desktop.html |
| `pages/projets-js/lecon-19.html#1` | INVÉRIFIABLE, général (Trello, Jira, Linear, Notion, Asana) | remplacé : Atlassian et Pragmatic drag and drop (glisser-déposer natif, Trello/Jira/Confluence, menus « déplacer » pour les technologies d'assistance), relié au `<select>` de la leçon | Cas réel — Atlassian et son glisser-déposer unique, Pragmatic drag and drop (2024) | https://www.atlassian.com/blog/design/designed-for-delight-built-for-performance ; https://github.com/atlassian/pragmatic-drag-and-drop ; https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines |
| `pages/projets-js/lecon-20.html#1` | VRAI dans les grandes lignes (Wordle, 2021, racheté par le NYT) mais non daté ni sourcé ; « un ressort vieux comme l'imprimerie » introuvable ; Motus (1990) non sourcé | corrigé sur son sujet : Wordle et son rachat d'après le communiqué (six essais, cinq lettres, 90 puis 300 000 joueurs, « bas des sept chiffres ») ; Motus retiré | Cas réel — Wordle rejoint le New York Times (2022) | https://www.nytco.com/press/wordle-new-york-times-games/ |
| `pages/projets-js/lecon-21.html#1` | INVÉRIFIABLE (« les équipes de Wordle ou des mots croisés du New York Times raisonnent ainsi ») | remplacé : le code source de DOOM (README de Carmack, `i_video.c` seul à inclure X11, traduction des touches) | Cas réel — le code source de DOOM et ses fichiers « i_ » (1997) | https://github.com/id-Software/DOOM/blob/master/README.TXT ; https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/i_video.c (et les 124 fichiers du dossier) |
| `pages/projets-js/lecon-22.html#1` | **INEXACT** : Spotify « part d'un Fisher-Yates puis l'ajuste » — l'algorithme de 2014 étale les titres de chaque artiste et ne cite Fisher-Yates qu'en exemple pour les mélanger entre eux ; quiz, examens et validation croisée : général | remplacé : l'écran de choix des navigateurs de Microsoft (mélange par `sort` biaisé, IE dernier dans 50 % des cas), déjà évoqué par le corps de la leçon (Spotify passe en `lecon-03`) | Cas réel — l'écran de choix des navigateurs de Microsoft (2010) | https://www.robweir.com/blog/2010/02/microsoft-random-browser-ballot.html |
| `pages/projets-js/lecon-23.html#1` | VRAI dans les grandes lignes (TodoMVC existe, la même liste de tâches dans des dizaines de frameworks) mais non daté ni sourcé | corrigé sur son sujet : daté par le premier commit (3/06/2011), fonctions de la spécification, Speedometer 3.0 (2024) | Cas réel — TodoMVC, l'étalon des frameworks (2011) | https://github.com/tastejs/todomvc/commit/6f02ce1fd0d87917193f610f1432760543cb678b ; https://github.com/tastejs/todomvc/blob/master/app-spec.md ; https://github.com/tastejs/todomvc (README) ; https://browserbench.org/announcements/speedometer3/ ; https://browserbench.org/Speedometer3.1/about.html |
| `pages/projets-js/lecon-24.html#1` | INVÉRIFIABLE (Streaks, Habitica, « ne pas casser la chaîne ») | remplacé : Duolingo sépare la série de l'objectif quotidien (une leçon suffit ; +3,3 % de rétention à 14 jours ; plus de la moitié des apprenants quotidiens sur une série d'au moins 7 jours) | Cas réel — Duolingo assouplit la règle de sa série (2020) | https://blog.duolingo.com/improving-the-streak/ |

### `kubernetes`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/kubernetes/lecon-01.html#1` | **INEXACT**, événement (Pokémon GO) : « environ 50 fois les prévisions les plus optimistes » pour 50 fois l'**objectif** et 10 fois le pire scénario ; le succès attribué à la mise à l'échelle automatique et au redémarrage des conteneurs, que le billet ne crédite pas (il raconte des problèmes de stabilité, de la capacité ajoutée par Google et une mise à niveau de GKE) | corrigé sur son sujet | Cas réel — Pokémon GO sur Kubernetes (2016) | https://cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud |
| `pages/kubernetes/lecon-02.html#1` | INVÉRIFIABLE, usage général non daté (Istio, Linkerd « ajoutent automatiquement » un side-car Envoy dans chaque pod) | remplacé : les side-cars natifs, alpha en 1.28 (25/08/2023), stables en 1.33 (23/04/2025, KEP-753) | Cas réel — Kubernetes rend natifs les conteneurs side-car (2025) | https://kubernetes.io/blog/2023/08/25/native-sidecar-containers/ ; https://kubernetes.io/blog/2025/04/23/kubernetes-v1-33-release/ |
| `pages/kubernetes/lecon-03.html#1` | **VRAI** (B2 revérifié sur les diapositives : 11,6 s en semaine, 1 079 déploiements en une heure, 10 000 hôtes en moyenne et 30 000 au plus) ; « ~11 secondes », « sur des milliers de serveurs » et « impossible sans déploiements progressifs » arrondis ou non dits | gardé et corrigé : chiffres exacts, principes des diapositives (un clic, petits lots, retours arrière faciles, passage 1.1 → 1.2 sous surveillance), Deployment stable depuis 1.9 | Cas réel — Amazon, un déploiement toutes les 11,6 secondes en moyenne (2011) | https://qconsf.com/sf2011/dl/qcon-sanfran-2011/slides/JineshVaria_CloudPoweredContinuousIntegrationAndDeployment.pdf (pages 36, 40, 43, 61, 62, 98) ; https://kubernetes.io/blog/2017/12/kubernetes-19-workloads-expanded-ecosystem/ |
| `pages/kubernetes/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« une application découpée en dizaines de microservices ») | remplacé : CoreDNS GA en 1.11, kube-dns à trois conteneurs, failles de dnsmasq | Cas réel — CoreDNS devient le DNS des clusters Kubernetes (2018) | https://kubernetes.io/blog/2018/07/10/coredns-ga-for-kubernetes-cluster-dns/ |
| `pages/kubernetes/lecon-05.html#1` | INVÉRIFIABLE, général (bots qui trouvent les clés « en quelques secondes », factures de milliers d'euros) ; l'étude NDSS 2019 sur le sujet est gardée par `git/lecon-07` | remplacé : Secrets non chiffrés par défaut (documentation) et KMS v2 stable en 1.29 | Cas réel — Kubernetes 1.29 rend stable le chiffrement par KMS v2 (2023) | https://kubernetes.io/docs/concepts/configuration/secret/ ; https://kubernetes.io/blog/2023/12/13/kubernetes-v1-29-release/ ; https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/ |
| `pages/kubernetes/lecon-06.html#1` | INVÉRIFIABLE, anonyme (« une équipe déploie PostgreSQL dans un pod nu ») | remplacé : provisionnement dynamique et StorageClass stables en 1.6, classes par défaut, politique `delete` | Cas réel — Kubernetes 1.6 rend stable le stockage à la demande (2017) | https://kubernetes.io/blog/2017/03/dynamic-provisioning-and-storage-classes-kubernetes/ |
| `pages/kubernetes/lecon-07.html#1` | INVÉRIFIABLE, général (« Black Friday ») | remplacé : Buffer retire les limites de CPU de ses services critiques (bridage CFS, bogue du noyau, requests au pic + 20 %, 22 fois plus rapide, mise à jour du noyau recommandée d'abord) | Cas réel — Buffer retire les limites de CPU de ses services critiques (2020) | https://erickhun.com/posts/kubernetes-faster-services-no-cpu-limits/ |
| `pages/kubernetes/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« une équipe fait tourner dev et prod dans le même cluster ») | remplacé : la panne mondiale de Skyscanner (gabarit sans `{{ }}`, tous les namespaces corrompus, 478 services supprimés par ArgoCD) | Cas réel — Skyscanner supprime tous ses services d'un coup (2021) | http://web.archive.org/web/20220508172800/https://medium.com/@SkyscannerEng/how-a-couple-of-characters-brought-down-our-site-356ccaf1fbc3 |
| `pages/kubernetes/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« une PME héberge une dizaine de sites ») | remplacé : la retraite d'Ingress NGINX (annonce du 11/11/2025, maintenance arrêtée en mars 2026, dépôt archivé), Ingress v1 stable depuis 1.19 | Cas réel — Kubernetes met Ingress NGINX à la retraite (2025) | https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/ ; https://github.com/kubernetes/ingress-nginx ; https://kubernetes.io/blog/2020/08/26/kubernetes-release-1.19-accentuate-the-paw-sitive/ |
| `pages/kubernetes/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« la migration lancée en Deployment ») | remplacé : CronJob GA en 1.21 et son nouveau contrôleur (5 120 CronJobs : 9 min et 8 planifications manquées pour l'ancien) | Cas réel — Kubernetes 1.21 rend les CronJobs stables (2021) | https://kubernetes.io/blog/2021/04/09/kubernetes-release-1.21-cronjob-ga/ |
| `pages/kubernetes/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« trois environnements, un seul chart ») | remplacé : Helm 3.0.0, fin de Tiller, fusion à trois voies et `helm rollback` | Cas réel — Helm 3 se passe de Tiller (2019) | https://helm.sh/blog/helm-3-released/ ; https://helm.sh/docs/v3/faq/changes_since_helm2/ |
| `pages/kubernetes/lecon-12.html#1` | INVÉRIFIABLE, anonyme (« un déploiement passe en CrashLoopBackOff ») | remplacé : JW Player, un mineur de Monero via le tableau de bord Weave Scope exposé ; RBAC limité au namespace `weave` | Cas réel — JW Player trouve un mineur de cryptomonnaie dans ses clusters (2019) | http://web.archive.org/web/20190319144607/https://medium.com/jw-player-engineering/how-a-cryptocurrency-miner-made-its-way-onto-our-internal-kubernetes-clusters-9b09c4704205 |

## Décomptes

| cours | lus | VRAI tel quel | INEXACT | juste mais sans date ni source | INVÉRIFIABLE | INVENTÉ | remplacés | corrigés | gardés | « Scénario » |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `projets-js` | 24 | 0 | 4 | 2 | 18 | 0 | 20 | 4 | 0 | 0 |
| `kubernetes` | 12 | 1 (corrigé sur des arrondis) | 1 | 0 | 10 | 0 | 10 | 2 | 0 | 0 |
| **total** | **36** | **1** | **5** | **2** | **28** | **0** | **30** | **6** | **0** | **0** |

(Le message du commit `0ef795f` range `kubernetes/lecon-02` à part ; ce rapport le compte INVÉRIFIABLE, usage
général non daté.) Conformes à la règle : `projets-js` 0 → 24, `kubernetes` 0 → 12.

**Sources primaires** pour les 36 cas : billets d'ingénierie ou post-mortems des organisations concernées
(Spotify, Atlassian, Duolingo, Google Cloud, Skyscanner, JW Player, Buffer, Dark Sky, Polar), notes de version et
blogs officiels (Firefox, Chrome, Kubernetes, Helm, Svelte, Elm), normes (W3C, WHATWG), code source (Firefox,
DOOM, React, TodoMVC), documentation (YNAB, Kubernetes, MDN), article original (Harel 1987), communiqué (New York
Times Company). **Aucune presse.** Les auteurs personnels (Rob Weir, Glenn Fiedler, Guillermo Rauch, Luke
Wroblewski, John Resig, Eric Khun) racontent leur propre travail ou leur propre analyse.

## Contrôles avant le dernier commit (codes de sortie)

- `node tools/verif-contenu.js --cas-reel --cours=projets-js` → **0** (24 conformes sur 24) ;
  `--cours=kubernetes` → **0** (12 sur 12) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ; `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b9-projets-js-kubernetes c5b3e9d` → **36 pages,
  0 écart** (obtenu en retouchant mes propres phrases, jamais un QCM : les mots d'options sortis avec l'ancien
  récit — « présents », « l'écran », « machine », « dansent », « mémoire », « suppression », « nombreux »,
  « automatique », « possible », « redémarre » — remis chacun dans une phrase exacte ; les mots d'options
  entrés avec le nouveau — « problème », « service », « comparateur », « internet », « secrets », « système »,
  « conteneurs », « minutes », etc. — remplacés par des synonymes) ;
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées (les deux légitimes connues) ;
- `node tools/verif-fraicheur.js` → **0** ;
- 0 CR dans les 36 pages (vérifié avec node) ;
- `node tools/verif.js --rapide` → voir la dernière section.

## Ce qui reste ouvert

- **Amazon, 11,6 s : deux cours.** `cicd/lecon-01` (lot B10) raconte le même chiffre, sans source. Je l'ai gardé
  dans `kubernetes/lecon-03`, comme le demandait la consigne (B2 l'avait jugé VRAI) et en le reliant aux
  diapositives sur le déploiement progressif et le retour arrière. Le foyer est à trancher par l'orchestrateur :
  ou bien `kubernetes/lecon-03` le garde et B10 remplace celui de `cicd`, ou bien le sujet va à `cicd/lecon-01`
  (notion la plus proche : la fréquence de déploiement) et `kubernetes/lecon-03` prend un autre cas.
- **Fraîcheur (phase E)** : `tools/fraicheur/releves/infra-2026-09-03.json` et `infra-lot-2026-09-03.json` gardent
  l'ancre de l'ancienne phrase de `kubernetes/lecon-02` (« Les maillages de services comme Istio ou Linkerd »),
  disparue avec sa marque `fraicheur` ; `verif-fraicheur.js` reste vert.
- **Hors encadré, non touché** : le corps de `kubernetes/lecon-09` conseille encore « sur un cluster, on déploie
  ingress-nginx (ou autre) » et son glossaire cite ingress-nginx comme exemple de contrôleur, alors que le projet
  est retiré depuis mars 2026 et son dépôt archivé (le cas réel de la leçon le dit désormais) ; le site de Helm
  annonce Helm 4 et une fin de vie de Helm 3 (`kubernetes/lecon-11` enseigne des commandes communes aux deux,
  à relire en phase E).
- **Une date de source indirecte** : le relevé d'Amazon est « de mai » sans année sur la diapositive (le PDF est
  celui de QCon San Francisco 2011) ; le titre date le cas de 2011, année de la présentation.

## `node tools/verif.js --rapide` (lancé une fois, à la fin)

**Code 1, 49 vérificateurs OK sur 54, 1 043 s** (machine partagée avec les autres agents du lot). Les cinq
étapes qui ne sont pas « OK », une par une :

- `donnees` — l'invariant **I18** seul (index dérivés périmés) : toléré, l'orchestrateur régénère après la
  fusion. Rejoué seul : 3 erreurs, toutes I18 ; `search-index.js` +16 633 octets (mes 36 encadrés), et
  `quiz-index.js` +20 octets, qui ne vient PAS de ma part : régénéré à part (`build-index.js --write --fresh
  --only=quiz --out=<scratchpad>`), le premier écart est l'explication d'une question de `ocaml/lecon-10`
  (« Rocq, anciennement Coq »), déjà dans la base `c5b3e9d`.
- `doc-ref` — `doc/verif-doc.js` : 2 échecs, « nombre de leçons qui renvoient à un document » et « nombre de
  cours concernés », comptes mesurés sur tout le site que mes lignes de source font bouger : toléré.
- `doc-rec` — `doc/verif-recherche.js` : 2 échecs, « 985 citent la source » (le nombre de leçons qui citent la
  source de leur « Cas réel » augmente avec mes 36 lignes) et « 7 leçons » qui mentionnent Stack Overflow
  (l'ancien encadré de `projets-js/lecon-08` en parlait) : toléré, l'orchestrateur régénère.
- `normatf` — `doc/verif-normatif.js` : 1 échec, « leçons parlant de la spécification » (40), compte que mes
  encadrés font bouger (« spécification » de TodoMVC, « Recommandation du W3C ») : toléré par la consigne (§ 6).
- `caract` — **NON MESURÉ** : `verif-controles.js` a dépassé le plafond de 10 minutes sous la charge de la
  machine. **Rejoué seul : code 0**, 2 676 fichiers, 0 accident, les 2 emplois voulus (6,5 s). Contrôle
  complémentaire : aucun caractère invisible ou de contrôle dans les lignes que j'ai ajoutées (36 pages).
