# Rapport V18 — case B11, lot 8 : les cours `observabilite`, `reseaux` et `http` (copie `b11-observabilite-reseaux-http`, branche `v18/b11-observabilite-reseaux-http`)

Copie de travail `D:\test-claude-b11-observabilite-reseaux-http`, partie de `01795b6`. Part traitée : les **34 « Cas réel »**
des cours `observabilite` (11), `reseaux` (11) et `http` (12), un par leçon, tous sous forme d'encadré `callout--note`.
Pièces dans `scratchpad/b11-observabilite-reseaux-http/` (ignoré par git) : `new/<cours>__<NN>.html` (les 34 corps
d'encadrés), `apply.js` (remplace, sur la ligne de l'encadré, du `<p class="callout__title">Cas réel` au `</div></div>`
final ; refuse un CR, un saut de ligne, un lien hors de la ligne de source, une source qui n'est pas en dernier, une
espace simple devant « : ; ! ? » ou dans « », un chevron brut dans `<code>`, une balise inattendue ; calcule page par page
les mots d'options de QCM gagnés ou perdus avec la définition de `lexique-diff.js`), `lexinfo.js` (mots d'options que
seul l'encadré porte, et mots d'options absents de la page), `dump.js`, `cherche.sh` (registre, réservations des lots 7
et 8, index texte de `pages/`), `txt.py` et `pdftxt.py` (texte d'une page ou d'un PDF téléchargé), et les sources
téléchargées (PDF de Dapper, de QUIC, de Mosh, du communiqué de la FCC ; RFC 1149, 5227, 6598, 7231, 7538, 7932, 9000,
9114 ; CSV des pages chargées en HTTPS par Chrome ; notes de version et `redis.conf` de Redis 3.2…).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **10, 11 et 12 hors de la règle à 0** pour
`observabilite`, `reseaux` et `http` ; sur les 34 cas trouvés, **2 VRAIS** (Facebook 2021 dans `observabilite/06`,
Let's Encrypt et Chrome 68 dans `http/06`), **2 VRAIS mais doublons de foyer** (Facebook 2021 encore raconté par
`reseaux/04` et `http/01`), **4 INEXACTS** (`reseaux/05`, Dyn, Firesheep, Brotli), **26 INVÉRIFIABLES** (récits
anonymes, usages généraux), **0 INVENTÉ** ; **29 remplacés** par un cas réel daté et sourcé sur la même notion,
**5 gardés et corrigés ou précisés** sur leur sujet, **0 renommé « Scénario »**.

**Commits** (branche `v18/b11-observabilite-reseaux-http`) : `998d3f3` (observabilite, 11 cas), `a9493df` (reseaux,
11 cas), `4a18f5a` (http, 12 cas), `6d45eba` (observabilite/07, deux nuances après relecture), puis le commit de ce
rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` final (type `note`, icône,
  structure gardés). **Aucun intertitre collé** : dans les 34 leçons, aucun `<h2>`/`<h3>` n'est placé juste au-dessus
  d'un encadré « Cas réel ». Aucune méta-description, aucun exercice ni QCM ne renvoyait aux anciens récits
  (vérifié par recherche des mots propres à chacun ; l'exercice 3 de `reseaux/lecon-08` enseigne toujours le conflit
  d'adresses IP, que le nouveau cas, la RFC 5227, prolonge).
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté **et** lié ; aucun
  lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « ». Corps de 150 à 215 mots environ (plus la ligne de
  source).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (index texte des 1 797 pages)
  et dans les réservations des lots 7 (`b10-reservations.txt`) et 8 (`b11-reservations.txt`, 34 lignes à moi, une par
  cas, dont les 5 « cas gardé » posées d'abord ; aucun sujet pris par un autre agent). Écartés parce qu'un autre cours les garde : la panne de Facebook du
  4 octobre 2021 hors de son foyer (`observabilite/06`), Let's Encrypt hors de `http/06` (cas de `reseaux/05`),
  Dynamo et ses 99,9 % (`nosql/01`), The Tail at Scale (`stats/04`), les rançons MongoDB de 2017 (`nosql/10`), la panne
  de Cloudflare du 18 novembre 2025 (racontée par `python/lecon-12`), `Cache-Control: immutable` chez Facebook
  (`perf-web/09`), la push protection de GitHub (`git/14`), les jetons Hugging Face (`llm/03`, lot 7, sujet voisin de
  `http/10` : j'ai pris les jetons Slack de 2016, autre sujet, autre source). `doublons.js` : toujours **2** sources
  partagées (les deux légitimes connues).
- **Firesheep** est aussi raconté par `securite/lecon-07` (lot 8, autre agent) et `offensive/lecon-08` (lot 9) : je l'ai
  réservé le premier pour `http/lecon-05` (la leçon qui enseigne les cookies et l'attribut `Secure`), au tout début du
  travail ; les deux autres cours devront prendre un autre sujet (voir « ouvert »).
- **Sources difficiles** : The New Stack (403), Medium (403), les billets de LinkedIn (404), de Dyn (redirigé vers
  Oracle), d'Etsy (403), de Microsoft (retiré) et du CERN (404) sont cités par leur **copie de l'Internet Archive,
  effectivement ouverte** ; le corps du billet de Google sur Chrome 68 n'apparaît qu'en HTML brut (lu tel quel) ; les
  dates d'un billet d'antirez (« il y a 4 032 jours ») sont rapportées à « novembre 2015 » (la session SSH du billet
  date du 2 novembre 2015). Les PDF (Dapper, QUIC, Mosh, FCC) lus avec `pypdf`.
- **Le présent devenu faux** : Parse, Dyn, l'IT Showcase de Microsoft, le premier serveur du CERN sont racontés au passé.

## Les 34 cas

### `observabilite`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/observabilite/lecon-01.html#1` | INVÉRIFIABLE, anonyme (le site marchand du vendredi soir ; B2 : INVÉRIFIABLE) | remplacé : Charity Majors, Parse et Scuba (« Parse is down! » pendant que le monitoring est vert, d'un jour à quelques minutes) | Cas réel — Charity Majors, Parse et Scuba (récit de 2019) | https://web.archive.org/web/20210102024036/https://thenewstack.io/observability-a-3-year-retrospective/ |
| `pages/observabilite/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« une équipe », un émetteur de cartes) | remplacé : Stripe et les lignes de log canoniques | Cas réel — Stripe et ses lignes de log « canoniques » (2019) | https://stripe.com/blog/canonical-log-lines |
| `pages/observabilite/lecon-03.html#1` | INVÉRIFIABLE, anonyme (p99 à 4,2 s d'un site) | remplacé : LinkedIn et la latence de longue traîne (microrafales invisibles à la seconde) | Cas réel — LinkedIn et sa latence du 99e centile (2015) | https://web.archive.org/web/20170225072238/https://engineering.linkedin.com/performance/who-moved-my-99th-percentile-latency |
| `pages/observabilite/lecon-04.html#1` | INVÉRIFIABLE, anonyme (« la base de données » soupçonnée) | remplacé : Dapper, l'équipe Ads Review d'AdWords | Cas réel — Dapper, le traçage distribué de Google (2010) | https://static.googleusercontent.com/media/research.google.com/en//archive/papers/dapper-2010-1.pdf |
| `pages/observabilite/lecon-05.html#1` | INVÉRIFIABLE, anonyme (« un éditeur SaaS ») | remplacé : Evernote et ses SLO (99,95 % sur le mois, fenêtres de livraison de cinq à deux) | Cas réel — Evernote adopte les SLO (récit de 2018) | https://sre.google/workbook/slo-engineering-case-studies/ (copyright 2018 vérifié sur la page et la table des matières) |
| `pages/observabilite/lecon-06.html#1` | VRAI, événement (foyer du registre) ; « Facebook, Instagram et WhatsApp » et « plusieurs heures » absents du billet de Facebook | gardé et précisé : auteur et lien, heures de disparition de `facebook.com` sur 1.1.1.1 (15 h 50 – 21 h 20 UTC) et les trois services d'après Cloudflare, accès normal et de secours coupés | Cas réel — la panne de Facebook (4 octobre 2021) | https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/ ; https://engineering.fb.com/2021/10/04/networking-traffic/outage/ ; https://blog.cloudflare.com/october-2021-facebook-outage/ |
| `pages/observabilite/lecon-07.html#1` | INVÉRIFIABLE, général (« Shopify ou eBay ont documenté » : aucune trace pour Shopify ; le billet d'eBay sur OpenTelemetry, 2022, porte sur le Collector et les métriques, pas sur l'auto-instrumentation) | remplacé : Uplight, dépendance au fournisseur d'APM, auto-instrumentation et instrumentation manuelle | Cas réel — OpenTelemetry chez Uplight (2023) | https://opentelemetry.io/blog/2023/end-user-q-and-a-02/ (et sa version `index.md`) ; consulté et écarté : https://opentelemetry.io/blog/2022/why-and-how-ebay-pivoted-to-opentelemetry/index.md |
| `pages/observabilite/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« une entreprise », « la communauté recommande ») ; la technique est juste (doc. Prometheus) | remplacé : Thumbtack, max des p95 ≠ p95 du max ; lien avec la doc. de Prometheus (quantiles non agrégeables) | Cas réel — Thumbtack et les centiles mal lus (2021) | https://web.archive.org/web/20220329011513/https://medium.com/thumbtack-engineering/lowering-microservice-latency-a-tale-of-misinterpreted-percentiles-a9997cbb58a4 ; https://prometheus.io/docs/practices/histograms/ |
| `pages/observabilite/lecon-09.html#1` | INVÉRIFIABLE, général (« de nombreuses équipes », « Netflix, Datadog ») | remplacé : Uber, 200 To de logs Spark par jour, CLP, 169 fois, rétention × 10 | Cas réel — Uber et le coût de ses logs Spark (2022) | https://www.uber.com/blog/reducing-logging-cost-by-two-orders-of-magnitude-using-clp/ |
| `pages/observabilite/lecon-10.html#1` | INVÉRIFIABLE, général (« Google, Etsy et bien d'autres ont popularisé ») | remplacé par le texte précis et daté d'Etsy : John Allspaw, « Blameless PostMortems and a Just Culture » | Cas réel — Etsy et le post-mortem sans blâme (2012) | https://web.archive.org/web/20140106020335/http://codeascraft.com/2012/05/22/blameless-postmortems/ |
| `pages/observabilite/lecon-11.html#1` | INVÉRIFIABLE, général (« la surprise est toujours la même » ; « aucun outil ne raccourcit le troisième », contredit par le retour arrière automatique que Cloudflare annonce) | remplacé : la chronologie de la panne de Cloudflare du 21 juin 2022, découpée en détecter / localiser / réparer | Cas réel — la chronologie d'une panne de Cloudflare (21 juin 2022) | https://blog.cloudflare.com/cloudflare-outage-on-june-21-2022/ |

### `reseaux`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/reseaux/lecon-01.html#1` | INVÉRIFIABLE, général (passer en fibre ; « du modem 56k à la 5G ») | remplacé : RFC 1149 et sa mise en œuvre à Bergen | Cas réel — IP par pigeon voyageur (1990-2001) | https://www.rfc-editor.org/rfc/rfc1149.txt ; https://blug.linux.no/rfc1149/writeup/ |
| `pages/reseaux/lecon-02.html#1` | INVÉRIFIABLE, général (traceroute vers l'autre bout du monde) | remplacé : Pakistan Telecom détourne YouTube par une annonce BGP | Cas réel — Pakistan Telecom détourne YouTube (24 février 2008) | https://www.ripe.net/about-us/news/youtube-hijacking-a-ripe-ncc-ris-case-study/ |
| `pages/reseaux/lecon-03.html#1` | INVÉRIFIABLE, général (la visio qui gèle) | remplacé : Mosh, SSP sur UDP contre SSH sur TCP (5 ms contre 503 ms) | Cas réel — Mosh, un terminal à distance bâti sur UDP (2012) | https://mosh.org/mosh-paper.pdf ; https://www.usenix.org/conference/atc12/technical-sessions/presentation/winstein |
| `pages/reseaux/lecon-04.html#1` | VRAI dans les grandes lignes, sans source ; **doublon** : Facebook 2021 a son foyer en `observabilite/06` (registre) | remplacé : Slack et DNSSEC, le DS gardé 24 h en cache par la zone `.com` | Cas réel — Slack et son passage à DNSSEC (30 septembre 2021) | https://slack.engineering/what-happened-during-slacks-dnssec-rollout/ |
| `pages/reseaux/lecon-05.html#1` | en partie INEXACT, événement ; **doublon** de `http/06` (Let's Encrypt) ; « de 30 % » vaut pour Android seul (29,2 % en mars 2015, 38,6 % sous Windows, 44 % sous ChromeOS) ; « Chrome et Firefox… réservaient HTTP/2 au HTTPS » sans source | remplacé : Google et QUIC (SIGCOMM 2017), RFC 9000 et 9114 — la leçon finit sur HTTP/3 et QUIC | Cas réel — Google et QUIC, le HTTPS sur UDP (2017) | https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46403.pdf ; https://www.rfc-editor.org/rfc/rfc9000.txt ; https://www.rfc-editor.org/rfc/rfc9114.txt ; https://d1dfn7jg27m4cf.cloudfront.net/chrome-https-adoption.csv |
| `pages/reseaux/lecon-06.html#1` | INVÉRIFIABLE, général (DevTools, « attente serveur 3 s ») | remplacé : Cloudflare décompose 3 s avec `curl -w` (la moitié dans le DNS) | Cas réel — Cloudflare décompose une requête lente (2018) | https://blog.cloudflare.com/a-question-of-timing/ |
| `pages/reseaux/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« un développeur en télétravail ») | remplacé : la RFC 6598 réserve 100.64.0.0/10 parce que la RFC 1918 chevauche les réseaux des abonnés | Cas réel — la RFC 6598 et la plage 100.64.0.0/10 (2012) | https://www.rfc-editor.org/rfc/rfc6598.txt |
| `pages/reseaux/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« une petite entreprise ») | remplacé : RFC 5227, détection des conflits d'adresses par ARP, DHCPDECLINE, 169.254 de Mac OS 9 | Cas réel — la RFC 5227 et les conflits d'adresses IP (2008) | https://www.rfc-editor.org/rfc/rfc5227.txt |
| `pages/reseaux/lecon-09.html#1` | INVÉRIFIABLE, anonyme (« un télétravailleur ») | remplacé : la FCC ouvre 1 200 MHz à 6 GHz | Cas réel — la FCC ouvre la bande des 6 GHz au Wi-Fi (23 avril 2020) | https://docs.fcc.gov/public/attachments/DOC-363945A1.pdf |
| `pages/reseaux/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« une développeuse » ; B2 : INVÉRIFIABLE) | remplacé : Redis exposé par accident (antirez, 2015) puis le protected mode de Redis 3.2 | Cas réel — Redis ouvert sur Internet, puis le « protected mode » (2015-2016) | http://antirez.com/news/96 ; https://raw.githubusercontent.com/redis/redis/3.2/00-RELEASENOTES ; https://raw.githubusercontent.com/redis/redis/3.2/redis.conf |
| `pages/reseaux/lecon-11.html#1` | INVÉRIFIABLE, général (« des entreprises entières », printemps 2020) | remplacé : Microsoft, tunnel partagé sur la plupart des sites, la Chine en tunnel complet à 85-95 % | Cas réel — Microsoft, son VPN et le tunnel partagé (mars 2020) | https://web.archive.org/web/20200523150012/https://www.microsoft.com/itshowcase/blog/running-on-vpn-how-microsoft-is-keeping-its-remote-workforce-connected/ ; https://learn.microsoft.com/en-us/microsoft-365/enterprise/microsoft-365-vpn-split-tunnel (contexte, non cité) |

### `http`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/http/lecon-01.html#1` | VRAI dans les grandes lignes mais **doublon** (foyer `observabilite/06`) ; « près de six heures » et les badges d'accès qui ne marchent plus : absents du billet de Facebook | remplacé : le premier serveur web au CERN, le web à 1 % du trafic d'Internet fin 1993 (web ≠ Internet) | Cas réel — le premier serveur web, au CERN (1990) | https://web.archive.org/web/20241229032907/https://home.cern/science/computing/birth-web/short-history-web ; https://web.archive.org/web/20241230202925/https://home.cern/science/computing/birth-web |
| `pages/http/lecon-02.html#1` | VRAI dans les grandes lignes, événement ; la liste « Twitter, Spotify, Reddit, GitHub, Netflix » n'est dans aucune source primaire ouverte | gardé et corrigé : liste retirée ; horaires, port 53, Mirai, jusqu'à 100 000 sources, tempête de nouvelles tentatives (10 à 20 fois), d'après Dyn | Cas réel — l'attaque contre le DNS de Dyn (21 octobre 2016) | https://web.archive.org/web/20161231191203/http://dyn.com/blog/dyn-analysis-summary-of-friday-october-21-attack/ |
| `pages/http/lecon-03.html#1` | INVÉRIFIABLE, général (« un classique du débogage ») | remplacé : GitHub, les fichiers raw en `text/plain` et `X-Content-Type-Options: nosniff` | Cas réel — GitHub, les fichiers « raw » et l'en-tête Content-Type (2013) | https://github.blog/news-insights/product-news/heads-up-nosniff-header-support-coming-to-chrome-and-firefox/ |
| `pages/http/lecon-04.html#1` | INVÉRIFIABLE, général ; « les moteurs ne transfèrent le référencement que sur un 301 » n'est pas ce que dit Google (permanente : la cible s'affiche dans les résultats ; temporaire : la source ; 308 rangé avec 301) | remplacé : le code 308, d'après la RFC 7231 § 6.4 et la RFC 7538 | Cas réel — le code 308, variante permanente de 307 (2015) | https://www.rfc-editor.org/rfc/rfc7231.txt ; https://www.rfc-editor.org/rfc/rfc7538.txt ; https://developers.google.com/search/docs/crawling-indexing/301-redirects |
| `pages/http/lecon-05.html#1` | INEXACT, événement : « en quelques mois, ces sites sont passés au HTTPS intégral » — Facebook propose le HTTPS en option en 2011 et l'active par défaut en juillet 2013 ; la causalité Firesheep → HTTPS n'est dans aucune source | gardé et corrigé : le constat de Butler, puis la chronologie de Facebook (option 2011, défaut juillet 2013, cookies `Secure`), sans lien de cause | Cas réel — Firesheep et les cookies de session en clair (2010) | https://codebutler.com/2010/10/24/firesheep/ ; https://engineering.fb.com/2013/07/31/web/secure-browsing-by-default/ |
| `pages/http/lecon-06.html#1` | VRAI (B2), événement ; « obtenir un certificat était payant » sans source ; « de 40 % à plus de 90 % » arrondi | gardé et précisé : bêta publique du 3 décembre 2015, annonce du 8 février 2018 pour Chrome 68, chiffres exacts par système (Windows 38,6 % → 89,2 %, Android 29,2 % → 92,7 %) | Cas réel — Let's Encrypt et Chrome 68 (2015-2018) | https://letsencrypt.org/2015/12/03/entering-public-beta/ ; https://security.googleblog.com/2018/02/a-secure-web-is-here-to-stay.html ; https://letsencrypt.org/stats/ ; https://d1dfn7jg27m4cf.cloudfront.net/chrome-https-adoption.csv |
| `pages/http/lecon-07.html#1` | INVÉRIFIABLE, général (« le développeur débutant ») | remplacé : James Kettle et l'origine reflétée avec `Access-Control-Allow-Credentials` | Cas réel — James Kettle et les CORS mal configurés (2016) | https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties |
| `pages/http/lecon-08.html#1` | INVÉRIFIABLE, général (« parfois plus de 90 % des octets ») | remplacé : Rails 3.1 abandonne la chaîne de requête pour l'empreinte dans le nom | Cas réel — Rails 3.1 et les noms de fichiers empreintés (2011) | https://guides.rubyonrails.org/v3.1/asset_pipeline.html ; https://rubyonrails.org/2011/8/31/rails-3-1-0-has-been-released |
| `pages/http/lecon-09.html#1` | INEXACT, produit nommé : « 15 à 25 % mieux que gzip » absent (Google : 20 à 26 % mieux que Zopfli) ; « les serveurs et les CDN le servent par défaut » sans source | gardé et corrigé : chiffres de Google, nom, RFC 7932 et le jeton `br` du registre des codages | Cas réel — Google publie Brotli (2015) | https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html ; https://www.rfc-editor.org/rfc/rfc7932.txt |
| `pages/http/lecon-10.html#1` | INVÉRIFIABLE, général (« chaque année, des dizaines de milliers de clés ») | remplacé : Detectify, plus de 1 500 jetons Slack publiés sur GitHub | Cas réel — des jetons Slack publiés sur GitHub (2016) | https://labs.detectify.com/writeups/slack-bot-token-leakage-exposing-business-critical-information/ |
| `pages/http/lecon-11.html#1` | INVÉRIFIABLE, anonyme (« un développeur ») | remplacé : Okta, les fichiers HAR du support et les jetons de session (134 clients, 5 sessions détournées) — la leçon enseigne justement qu'un HAR contient des secrets | Cas réel — Okta et les fichiers HAR (2023) | https://sec.okta.com/articles/2023/10/tracking-unauthorized-access-oktas-support-system/ ; https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/ ; https://sec.okta.com/harfiles (clôture, 8 février 2024) |
| `pages/http/lecon-12.html#1` | INVÉRIFIABLE, anonyme (« un développeur ») | remplacé : Chrome 80, `SameSite=Lax` par défaut et `SameSite=None` qui exige `Secure` | Cas réel — Chrome 80 et les cookies SameSite (2019-2020) | https://blog.chromium.org/2019/10/developers-get-ready-for-new.html ; https://www.chromium.org/updates/same-site/ |

## Décomptes

| cours | « Cas réel » | VRAI | VRAI mais doublon | INEXACT (ou en partie) | INVÉRIFIABLE | INVENTÉ | remplacés | gardés et corrigés / précisés | « Scénario » |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `observabilite` | 11 | 1 | 0 | 0 | 10 | 0 | 10 | 1 | 0 |
| `reseaux` | 11 | 0 | 1 | 1 | 9 | 0 | 11 | 0 | 0 |
| `http` | 12 | 1 | 1 | 3 | 7 | 0 | 8 | 4 | 0 |
| **total** | **34** | **2** | **2** | **4** | **26** | **0** | **29** | **5** | **0** |

(« VRAI » : `observabilite/06`, `http/06` ; « VRAI mais doublon » : `reseaux/04`, `http/01`, tous deux la panne de
Facebook ; « INEXACT » : `reseaux/05`, `http/02` (liste de sites sans source primaire, comptée ici), `http/05`, `http/09`.)
Conformes à la règle dans la part : **1 → 34**.

## Contrôles (sur la copie, après le dernier commit de cas)

- `node tools/verif-contenu.js --cas-reel --cours=observabilite` → **0** ; `--cours=reseaux` → **0** ; `--cours=http` → **0**.
- `node tools/verif-contenu.js --strict` → **0**.
- `node tools/verif-html.js` → **0**.
- `node tools/verif-domaines-interdits.js` → **0**.
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**.
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b11-observabilite-reseaux-http 01795b6` → **34 pages, 0 écart**
  (trois gains corrigés en cours de rédaction : « qu'ils », « déclenche », « compte »).
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées, les deux légitimes connues.
- 0 CR dans les pages modifiées (contrôlé avec node à chaque commit).
- `node tools/verif.js --rapide` → **code 1**, 918,8 s, 54 étapes jouées, 4 signalées : `donnees` (seulement
  l'invariant I18 : `search-index.js` périmé, +5 587 octets, toléré, l'orchestrateur régénère), `doc-ref` et `doc-rec`
  (chiffres du cours `doc` que les lignes de source font bouger, tolérés), et `etude-4` (« la page n'a pas fini de se
  construire » : délai dépassé sous charge, sur `pages/etude-reecriture.html`, que je n'ai pas touchée ; rejoué seul
  aussitôt après, `node tools/preuves/etude-reecriture.js` est vert : 0 écart, 0 faute). Aucun autre rouge.

## Ce qui reste ouvert

- **Firesheep** est aussi raconté par `securite/lecon-07` (lot 8, agent `b11-securite-regex`) et par la section
  « Cas réel » de `offensive/lecon-08` (lot 9) : foyer pris par `http/lecon-05` (réservé en premier) ; à remplacer
  ailleurs, ou à trancher par l'orchestrateur à la fusion.
- `reseaux/lecon-05` : le cas réel ne parle plus du passage au HTTPS (désormais en `http/lecon-06`) mais de QUIC, sur
  lequel la leçon se termine ; le corps de la leçon n'a pas été relu hors de l'encadré.
- `observabilite/lecon-06` : le cas cite deux sources (Facebook et Cloudflare) ; Cloudflare y sert seulement aux heures
  et aux trois services touchés, que le billet de Facebook ne donne pas.
- `http/lecon-01` : la page `home.cern/science/computing/birth-web` répond 404 aujourd'hui ; le cas cite la copie de
  l'Internet Archive du 29 décembre 2024.
- Le billet d'antirez n'affiche pas de date absolue (« il y a 4 032 jours », soit le 3 novembre 2015) : la ligne de
  source dit « novembre 2015 ».
- Pour le registre (`foyers.md`, à la fusion) : les 34 sujets ci-dessus ; en particulier Firesheep (`http/05`),
  Let's Encrypt bêta et Chrome 68 (`http/06`), Dyn 2016 (`http/02`), Brotli (`http/09`), Pakistan Telecom et YouTube
  (`reseaux/02`), QUIC (`reseaux/05`), la panne de Cloudflare du 21 juin 2022 (`observabilite/11`), Dapper
  (`observabilite/04`), Etsy et le post-mortem sans blâme (`observabilite/10`).
