# Rapport V18 — case B10, lot 7 : le cours `algo` (copie `b10-algo`, branche `v18/b10-algo`)

Copie de travail `D:\test-claude-b10-algo`, partie de `01795b6`. Part traitée : les **28 « Cas réel »** du
cours `algo` (un par leçon). Pièces dans `scratchpad/b10-algo/` (ignoré par git) : `nouveaux.js` (les 28
titres, corps et sources), `appliquer.js` (remplace du `<p class="callout__title">` au `</div></div>` final,
refuse un remplacement ambigu et tout CR), `dump.js`, `cherche.js` (recherche d'un sujet dans tout `pages/`,
en signalant s'il est dans un « Cas réel »), `voircas.js`, `liens.js`, `java/Mid.java`, et les pages et PDF
ouverts (`gta.html`, `bloch.html`, `schrijver.pdf`, `mdmspe.pdf`, `huffman.pdf` et ses images de pages,
`dreyfus.pdf`, `viola.pdf`, `tuplesort.c`, `stl_tree.h`, `LinkedHashMap.java`, `timers.js`, `fib_trie.c`…).

**En une phrase** : `node tools/verif-contenu.js --cas-reel --cours=algo` passe de **28 hors de la règle à
0** ; sur les 28 cas trouvés, **un seul était VRAI tel quel sur le fond** (Bloch 2006), un autre VRAI mais
doublon du registre (le CFS de Linux), quatre INEXACTS, trois sujets déjà gardés par un autre cours, et le
reste INVÉRIFIABLE (usages généraux, un récit anonyme, un « Imagine… ») ; **24 remplacés** par un cas réel
daté et sourcé sur la même notion, **3 corrigés sur leur sujet**, **1 vérifié et mis en forme**, **0 renommé
« Scénario »**.

**Commits** (branche `v18/b10-algo`) : `2be239a` (algo, 28 cas), puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du titre au `</div></div>` final ; les 28 encadrés sont de type
  `note`, gardé. **Aucun intertitre `<h2>`/`<h3>` n'est collé au-dessus** de ces encadrés (figure, liste,
  paragraphe ou autre encadré entre les deux, vérifié page par page). `controle-branche.js` sur l'état
  commité : 0 CR, 0 domaine interdit, octets identiques hors des « Cas réel », types gardés, signatures.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">`, **aucun lien
  dans le corps** (`liens.js` le vérifie) ; `&nbsp;` devant « : ; ? ! » et dans « » ; 154 à 209 mots par
  corps (60 à 130 avant).
- **Un sujet = un seul cours** : chaque sujet et chaque URL cherchés dans `foyers.md` et dans tout `pages/`
  (`cherche.js`, qui dit si la mention est dans un « Cas réel »), puis inscrits au fichier commun
  `b10-reservations.txt` (28 lignes, aucune reprise par un autre agent, relu à la fin). Écartés parce qu'un
  autre cours les raconte déjà : V8 et le tri stable (`js/lecon-08`) ; le TimSort d'OpenJDK
  (`java/lecon-18`) ; le Hash DoS de 2011 et la JEP 180 (`java/lecon-11`) ; le CFS de Linux
  (`os/lecon-03`) ; les Swiss Tables de Go (`maths/lecon-05`) ; Expat CVE-2022-25313 (`c/lecon-04`) ; le
  `qsort` de la glibc (`c/lecon-18`) ; le dict compact de Python 3.6 (`python/lecon-08`) ; Musser et
  Stepanov (`ada/lecon-10`) ; le ReDoS de Cloudflare (`regex/lecon-06`, foyer du registre).
- Chaque affirmation relue contre la source ouverte. PDF lus avec `pypdf` (Schrijver, McIlroy, Dreyfus,
  Viola et Jones) ; l'article de Huffman est un scan sans texte : pages extraites en images et lues une à
  une. Pages lues par `curl` quand l'outil web échouait (PC Gamer, Rust, AWS, PostgreSQL, Node.js, Cloudflare,
  Elastic) ; métadonnées par l'API Crossref, l'API de NVD et l'API GitHub (historique des tickets et des
  pull requests : la description du ticket Jackson n° 2816 a été **réécrite en 2022**, elle cite le ticket
  n° 3397, postérieur ; seuls les commentaires datés de 2020 sont repris pour 2020).
- **Code rejoué** : Java 27 (`java/Mid.java` : `(low + high) / 2` avec `low = 2^30` donne -1 073 741 821 et
  une `ArrayIndexOutOfBoundsException`, `low + ((high - low) / 2)` donne 1 073 741 826) ; Node 24
  (`Math.floor((g + d) / 2)` exact jusqu'aux tailles de tableau permises ; 42 × 45 / 60 + 18 = 49,5 ;
  (63 000² + 63 000) / 2 = 1 984 531 500 ; (360 − 110) / 360 = 69,4 % ; 5 731 437 / 1 824 345 = 3,1416).
- Tous les liens des lignes de source rouverts à la fin (`liens.js`, 53 liens) : 49 en 200 ; les 4 copies
  de l'Internet Archive répondent 429 (limite de débit) au moment du contrôle, mais avaient été ouvertes et
  lues plus tôt dans la session.

## Cas par cas

| Cas | Trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/algo/lecon-01.html#1` | Événement nommé (foyer du registre), INEXACT : « divise par ~3 » (6 min -> 1 min 50 s, 69,4 %) ; « longueur mémorisée + `Set` de hachage » (t0st saute le test de doublons, les articles étant uniques) ; « tous deux O(n²) » (seul le dédoublonnage est chiffré, (n²+n)/2) ; « des millions de joueurs impactés » sans source ; ni date ni source | Corrigé : billet du 28 février 2021, JSON de 10 Mo et ~63 000 articles, `sscanf`/`strlen`, 1 984 531 500 comparaisons, 1 min 50 s, version PC, prime de 10 000 dollars « à titre exceptionnel », correctif du 16 mars 2021 | Cas réel — les 6 minutes de chargement de GTA Online (2021) | https://nee.lv/2021/02/28/How-I-cut-GTA-Online-loading-times-by-70/ ; https://www.pcgamer.com/rockstar-thanks-gta-online-player-who-fixed-poor-load-times-official-update-coming/ (déclaration de Rockstar, citée par la presse : Rockstar ne l'a pas publiée ailleurs) |
| `pages/algo/lecon-02.html#1` | Général (limites de pile de V8, SpiderMonkey, JavaScriptCore), INVÉRIFIABLE tel quel | Remplacé : ticket jackson-databind n° 2816 (13 août 2020, ~2 000 niveaux passent, 3 000 échouent), CVE-2020-36518 (11 mars 2022), limite de 1 000 niveaux dans 2.13.2.1 (24 mars 2022, PR n° 3416) | Cas réel — Jackson et le JSON trop imbriqué (2020-2022) | https://github.com/FasterXML/jackson-databind/issues/2816 (et ses commentaires par l'API) ; https://github.com/FasterXML/jackson-databind/pull/3416 (fichiers : `MAX_DEPTH = 1000`) ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2020-36518 ; https://github.com/FasterXML/jackson/wiki/Jackson-Release-2.13 |
| `pages/algo/lecon-03.html#1` | Événement nommé (foyer du registre), VRAI sur le fond, sans date précise ni source | Vérifié et mis en forme : 2 juin 2006, blog de Google Research, bug de `java.util.Arrays` « neuf ans environ », 2^31 − 1, 2^30 éléments, `ArrayIndexOutOfBoundsException`, correctif ; phrase JavaScript gardée, rejouée | Cas réel — le bug du milieu, resté 9 ans dans la bibliothèque Java (2006) | https://research.google/blog/extra-extra-read-all-about-it-nearly-all-binary-searches-and-mergesorts-are-broken/ |
| `pages/algo/lecon-04.html#1` | Produit nommé, vrai sur le fond (V8, ES2019, Timsort) mais exemple d'affichage non sourcé ; **sujet gardé par `js/lecon-08`** (V8 7.0, 2018) | Remplacé : Rust 1.20 ajoute `sort_unstable` (31 août 2017), exemple rust/crate/package/cargo, tri en place sans allocation, `sort` stable avec tampon et tri par insertion sur les tranches courtes | Cas réel — Rust 1.20 et ses tris « instables » (2017) | https://blog.rust-lang.org/2017/08/31/Rust-1.20/ ; https://doc.rust-lang.org/1.20.0/std/primitive.slice.html |
| `pages/algo/lecon-05.html#1` | « Imagine un fichier de 1 To… » : récit fictif, INVÉRIFIABLE (usage général de `sort`) | Remplacé : tri externe de PostgreSQL (`work_mem`, runs, fusion par un tas des têtes), fusion polyphasée de Knuth remplacée par une fusion équilibrée à k voies (commit 65014000b, 18 octobre 2021), PostgreSQL 15 (13 octobre 2022) | Cas réel — PostgreSQL 15 et le tri qui déborde de la mémoire (2022) | https://www.postgresql.org/docs/release/15.0/ ; https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=65014000b ; https://raw.githubusercontent.com/postgres/postgres/REL_15_STABLE/src/backend/utils/sort/tuplesort.c (cité par son adresse github.com) |
| `pages/algo/lecon-06.html#1` | Général (attaque par complexité sur un quicksort à pivot fixe), INVÉRIFIABLE | Remplacé : McIlroy, « A Killer Adversary for Quicksort » (avril 1999), comparaison adverse, ~0,25 n² contre Digital Unix 4.0 et Irix 6.4 (médiane de trois), méthode valable même à pivot aléatoire | Cas réel — un adversaire « tueur » pour quicksort (1999) | https://web.archive.org/web/20260723183331/https://www.cs.dartmouth.edu/~doug/mdmspe.pdf (le serveur de Dartmouth coupait la connexion) ; métadonnées Crossref (vol. 29, n° 4, p. 341-344) |
| `pages/algo/lecon-07.html#1` | Général (cache LRU « partout », Redis, ORM), INVÉRIFIABLE ; doublait le sujet de la leçon 27 | Remplacé : `LinkedHashMap` de Java 1.4 (Sun, 6 février 2002), liste doublement chaînée, liens `before`/`after`, ordre d'accès et `removeEldestEntry` | Cas réel — LinkedHashMap, la liste doublement chaînée de Java (2002) | http://web.archive.org/web/2002id_/http://www.sun.com:80/smi/Press/sunflash/2002-02/sunflash.20020206.5.html ; http://web.archive.org/web/20021202163345/http://java.sun.com:80/j2se/1.4/docs/guide/collections/changes4.html ; https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html ; https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/LinkedHashMap.java |
| `pages/algo/lecon-08.html#1` | Général (annuler/refaire, pile d'appels, files), INVÉRIFIABLE (B2) | Remplacé : files FIFO d'Amazon SQS (Jeff Barr, 17 novembre 2016) contre l'ordre « au mieux » des files standard ; 300 requêtes/s par file et deux régions au lancement | Cas réel — Amazon SQS lance ses files FIFO (2016) | https://aws.amazon.com/blogs/aws/new-for-amazon-simple-queue-service-fifo-queues-with-exactly-once-delivery-deduplication/ ; https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html |
| `pages/algo/lecon-09.html#1` | Événement nommé, sans source ; « Map/Set modernes semés à chaque démarrage » généralise ; **sujet gardé par `java/lecon-11`** (oCERT-2011-003) | Remplacé : la graine de hachage constante de Node.js (instantanés de V8), CVE-2017-11499, correctifs du 11 juillet 2017, instantanés réactivés dans 8.3.0 (mise à jour du 10 août) | Cas réel — la graine de hachage figée de Node.js (2017) | https://nodejs.org/en/blog/vulnerability/july-2017-security-releases |
| `pages/algo/lecon-10.html#1` | Général (index B+), INVÉRIFIABLE | Remplacé : Bayer et McCreight, Acta Informatica, septembre 1972 (log_k I, 50 % d'occupation au moins, 100 000 clés, IBM 360/44) ; `CREATE INDEX` crée un B-tree par défaut dans PostgreSQL | Cas réel — Bayer, McCreight et l'arbre B (1972) | https://link.springer.com/article/10.1007/BF00288683 (résumé, affiliations) ; https://www.postgresql.org/docs/current/indexes-types.html |
| `pages/algo/lecon-11.html#1` | Général (GPS, Huffman, ordonnanceur), INVÉRIFIABLE | Remplacé : les minuteurs de Node.js, listes par durée ordonnées par une `PriorityQueue` en tas binaire (PR n° 20555, mai 2018), Node.js 11.0.0 (23 octobre 2018) | Cas réel — les minuteurs de Node.js dans un tas binaire (2018) | https://github.com/nodejs/node/blob/main/lib/internal/timers.js ; https://github.com/nodejs/node/pull/20555 (et ses commits par l'API) ; https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V11.md |
| `pages/algo/lecon-12.html#1` | Organisation nommée, INEXACT : Facebook mesure 3,57 **degrés** (intermédiaires) pour une distance moyenne de **4,57**, et ne l'a pas fait par BFS (estimation de Flajolet-Martin) | Remplacé : The Oracle of Bacon, qui fait bien un BFS ; nombres de Bacon au 30 août 2026 (moyenne 3,142 ; Samuel L. Jackson 2,968). Le chiffre de Facebook, corrigé, sert à la leçon 23 | Cas réel — l'Oracle of Bacon et ses « nombres de Bacon » (2026) | https://oracleofbacon.org/how.php ; https://oracleofbacon.org/center.php |
| `pages/algo/lecon-13.html#1` | Général (« chaque fois que tu crées un .zip… », « des pétaoctets »), INVÉRIFIABLE | Remplacé sur le même algorithme, daté : l'article de Huffman (septembre 1952), le glouton des deux messages les moins probables ; DEFLATE (RFC 1951, mai 1996), compatible gzip | Cas réel — David Huffman et le code à redondance minimale (1952) | https://www.csd.uoc.gr/~hy474/bibliography/Huffman.pdf (scan des Proceedings of the I.R.E., titre, auteur, MIT, réception le 6 décembre 1951 vérifiés) ; https://www.rfc-editor.org/rfc/rfc1951.txt |
| `pages/algo/lecon-14.html#1` | Général (`git diff`, « vouliez-vous dire », ADN), INVÉRIFIABLE ; « une place dans tous les correcteurs orthographiques modernes » généralise sans source | Remplacé : Richard Bellman et le nom de la programmation dynamique (Wilson, « planning », « dynamic », le Congrès), puis le « principe d'optimalité », d'après son autobiographie, raconté **comme son récit** | Cas réel — Richard Bellman baptise la programmation dynamique (années 1950) | https://web.cs.miami.edu/home/odelia/teaching/csc317_fall19/syllabus/dy_birth.pdf (copie d'un cours ; titre, auteur, revue, volume et pages vérifiés par Crossref) |
| `pages/algo/lecon-15.html#1` | Général (429 et fenêtre glissante, image intégrale, Floyd), INVÉRIFIABLE | Remplacé : l'image intégrale de Viola et Jones (CVPR 2001), somme préfixée 2D, un rectangle en quatre accès, 384 × 288 à 15 images/s | Cas réel — Viola, Jones et l'« image intégrale » (2001) | https://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf (copie d'un cours ; métadonnées Crossref, DOI 10.1109/CVPR.2001.990517) |
| `pages/algo/lecon-16.html#1` | Général (Google Maps, OSPF, RIP, arbitrage, npm), INVÉRIFIABLE | Remplacé : Dijkstra conçoit l'algorithme en vingt minutes pour la démonstration de l'ARMAC (1956), 64 villes, publié en 1959 avec l'arbre couvrant minimal | Cas réel — Dijkstra et l'algorithme inventé en vingt minutes (1956) | http://web.archive.org/web/20220518201905/https://cacm.acm.org/magazines/2010/8/96632-an-interview-with-edsger-w-dijkstra/fulltext (cacm.acm.org bloque les robots) |
| `pages/algo/lecon-17.html#1` | Général (« un opérateur télécom »), INVÉRIFIABLE (B2 ; Union-Find ne gère pas la suppression d'arêtes) | Remplacé : R. C. Prim, Bell System Technical Journal, novembre 1957 : principes P1 et P2, Washington et les 48 capitales, lignes louées du Bell System | Cas réel — R. C. Prim et les lignes louées du Bell System (1957) | https://archive.org/stream/bstj36-6-1389/bstj36-6-1389_djvu.txt (texte reconnu du scan ; métadonnées de l'élément archive.org) |
| `pages/algo/lecon-18.html#1` | Général + le ReDoS de Cloudflare (2019), **foyer `regex/lecon-06`** | Remplacé : Peter Norvig, « Solving Every Sudoku Puzzle » (2006) : recherche en profondeur qui recopie l'état plutôt que de défaire, heuristique *minimum remaining values*, 95 grilles difficiles sur 95 | Cas réel — Peter Norvig résout tous les sudokus (2006) | https://norvig.com/sudoku.html |
| `pages/algo/lecon-19.html#1` | Général (rate limiter, moyenne mobile, Floyd), INVÉRIFIABLE | Remplacé : la fenêtre glissante approchée du limiteur de Cloudflare (Julien Desgats, 7 juin 2017), 42 × 0,75 + 18 = 49,5, 0,003 % d'erreurs sur 400 millions de requêtes | Cas réel — la fenêtre glissante du limiteur de Cloudflare (2017) | https://blog.cloudflare.com/counting-things-a-lot-of-different-things/ |
| `pages/algo/lecon-20.html#1` | Général (T9, chmod, bitboards de Stockfish, RAID), INVÉRIFIABLE | Remplacé : Linux retire `fib_hash`, la table de routage IPv4 passe au trie compressé `fib_trie` (David S. Miller, 1er février 2011 ; Linux 2.6.39, 18 mai 2011) ; nœuds indexés par quelques bits de la clé | Cas réel — Linux route l'IPv4 avec un trie (2011) | https://github.com/torvalds/linux/commit/3630b7c050d9c3564f143d595339fc06b888d6f3 ; https://kernelnewbies.org/Linux_2_6_39 ; https://docs.kernel.org/networking/fib_trie.html ; https://github.com/torvalds/linux/blob/master/net/ipv4/fib_trie.c |
| `pages/algo/lecon-21.html#1` | Récit anonyme (« un collègue reformate un fichier de 12 000 lignes »), INVÉRIFIABLE | Remplacé : Mike Haertel, « why GNU grep is fast » (freebsd-current, 21 août 2010) : Boyer-Moore, boucle déroulée, moins de 3 instructions x86 par octet examiné | Cas réel — pourquoi GNU grep est rapide (2010) | https://lists.freebsd.org/pipermail/freebsd-current/2010-August/019310.html |
| `pages/algo/lecon-22.html#1` | Général (RSA, P = NP, solveurs), INVÉRIFIABLE | Remplacé : `pla85900`, puce LaserLogic des Bell Labs, résolu à l'optimum par Concorde (vingt calculs de décembre 2004 à avril 2006, tournée de 142 382 641) | Cas réel — le voyageur de commerce à 85 900 villes (2006) | https://www.math.uwaterloo.ca/tsp/pla85900/index.html ; https://www.math.uwaterloo.ca/tsp/pla85900/compute/compute.htm ; https://www.math.uwaterloo.ca/tsp/pla85900/bell/bell.htm |
| `pages/algo/lecon-23.html#1` | Général (Cassandra, RocksDB, Redis 12 Ko, BigQuery, Presto), INVÉRIFIABLE | Remplacé : Facebook, « Three and a half degrees of separation » (4 février 2016) : 3,57 intermédiaires, distance moyenne 4,57, estimées par Flajolet-Martin (hachage, zéros finaux, OU bit à bit) sur Apache Giraph | Cas réel — Facebook compte ses degrés de séparation (2016) | https://research.facebook.com/blog/2016/02/three-and-a-half-degrees-of-separation/ |
| `pages/algo/lecon-24.html#1` | Récit générique (« un jeu compétitif avec des millions de joueurs »), INVÉRIFIABLE | Remplacé : Peter M. Fenwick, Software: Practice and Experience, mars 1994 : le *binary indexed tree*, né pour la compression arithmétique dynamique | Cas réel — Peter Fenwick et ses fréquences cumulées (1994) | https://api.crossref.org/works/10.1002/spe.4380240306 (résumé de l'éditeur ; la page de Wiley et la copie de NSYSU sont restées inaccessibles) |
| `pages/algo/lecon-25.html#1` | Produit nommé, VRAI (B2, revérifié : cppreference « usually implemented as Red–black trees », TreeMap) ; « des milliers de fois par seconde » sans source ; **le CFS de Linux est gardé par `os/lecon-03`** (registre) | Corrigé : CFS retiré ; `std::map`/`TreeMap` gardés et sourcés, plus `bits/stl_tree.h` de libstdc++ (Hewlett-Packard 1994, SGI 1996-1997, d'après Cormen, Leiserson et Rivest, deux écarts documentés) | Cas réel — les arbres rouge-noir de la STL et de TreeMap (1994) | https://raw.githubusercontent.com/gcc-mirror/gcc/master/libstdc++-v3/include/bits/stl_tree.h ; https://en.cppreference.com/w/cpp/container/map.html ; https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html |
| `pages/algo/lecon-26.html#1` | Événement nommé, en partie INEXACT : l'intérêt de Harris et Ross était la coupe (« interdiction »), pas le débit ; « Ford et Fulkerson formalisent la réponse » brouille la chronologie (leur rapport de 1954 cite déjà Harris, leur algorithme date du 29 décembre 1955) ; « soixante-dix ans plus tard… covoiturages, images médicales » sans source | Corrigé : rapport du 24 octobre 1955 pour l'US Air Force, divisions ferroviaires, 44 sommets et 105 arêtes, heuristique d'« inondation », flot de 163 000 tonnes = coupe « the bottleneck », déclassifié le 21 mai 1999 | Cas réel — Harris, Ross et le rail soviétique (1955) | https://homepages.cwi.nl/~lex/files/histtrpclean.pdf ; métadonnées Crossref (Math. Programming 91(3), p. 437-445, février 2002) |
| `pages/algo/lecon-27.html#1` | Général (pseudo-LRU des processeurs, Redis, CDN, `lru_cache`), INVÉRIFIABLE | Remplacé : le LRU approché de Redis (échantillon `maxmemory-samples`, 5 par défaut), « Much improved LRU approximation » de Redis 3.0.0 (1er avril 2015), LFU en 4.0 | Cas réel — le LRU approché de Redis (2015) | https://redis.io/docs/latest/develop/reference/eviction/ ; https://raw.githubusercontent.com/redis/redis/unstable/redis.conf ; https://raw.githubusercontent.com/redis/redis/3.0/00-RELEASENOTES |
| `pages/algo/lecon-28.html#1` | Général (Google et DAWG, IntelliSense, claviers), INVÉRIFIABLE | Remplacé : le *completion suggester* d'Elasticsearch (Alexander Reelsen, 22 août 2013) : FST en mémoire par segment, poids des suggestions | Cas réel — la complétion d'Elasticsearch (2013) | https://www.elastic.co/blog/you-complete-me |

## Décomptes

- **Lus : 28.** Trouvés : 1 VRAI tel quel sur le fond (03) ; 1 VRAI mais doublon du registre (25, le CFS) ;
  3 INEXACTS (01, 12, 26) ; 3 sujets réels déjà gardés par un autre cours (04, 09, 18) ; 20
  INVÉRIFIABLES (usages généraux, un récit anonyme en 21, un récit générique en 24, un « Imagine… » en 05).
- **Fait : 24 remplacés, 3 corrigés (01, 25, 26), 1 vérifié et mis en forme (03), 0 « Scénario ».**
- Nature des 28 nouveaux cas : 10 articles ou documents fondateurs (Huffman, Prim, Bayer et McCreight,
  Harris et Ross par Schrijver, McIlroy, Fenwick, Viola et Jones, Dijkstra, Bellman, Bloch), 10 annonces,
  notes de version, commits ou tickets d'un produit (Rust, PostgreSQL, Java 1.4, Node.js ×2, Jackson, Linux,
  Redis, Elasticsearch, SQS), 8 billets ou pages techniques (GTA Online, Oracle of Bacon, Norvig, Cloudflare, Haertel, pla85900,
  Facebook, STL et TreeMap).
- Presse : une seule source de presse, PC Gamer, pour la déclaration de Rockstar (lecon-01), le primaire
  restant le billet de t0st.

## Contrôles (sur la copie, après le commit `2be239a`)

- `node tools/verif-contenu.js --cas-reel --cours=algo` -> **0** (28 lus, 28 conformes ; 28 hors de la règle
  avant).
- `node tools/verif-contenu.js --strict` -> **0**.
- `node tools/verif-html.js` -> **0**.
- `node tools/verif-domaines-interdits.js` -> **0**.
- `node tools/verif-qcm-lexique.js` -> **0** ; `node tools/verif-qcm-biais.js` -> **0**.
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b10-algo 01795b6` -> **0 écart** (16 au premier
  jet : 12 pages ; corrigés en reformulant l'encadré, jamais le QCM — « tandis », « plusieurs »,
  « souvent », « déséquilibré », « trahit », « évincent » remis dans des phrases exactes ; « contient »,
  « quadratique », « celles », « seconde », « depuis », « comparée », « lettre », « bibliothèque »,
  « choisir », « millisecondes » retirés. « souvent » vient d'une phrase de McIlroy : « When using
  quicksort one often feels a nagging tension »).
- `node tools/cas-reels/lots/controle-branche.js D:/test-claude-b10-algo 01795b6` -> **0** (0 CR, octets
  identiques hors « Cas réel », 28 zones avant et après).
- `node tools/cas-reels/lots/doublons.js` -> **3** sources partagées entre cours : les 2 légitimes connues, et
  **une nouvelle** : le billet de Bloch (Google Research, 2006) est aussi la source de `java/lecon-04#1`
  (« Cas réel — Arrays.binarySearch (2006) », lot 1), qui raconte le même sujet. Voir « Ouvert ».
- `node tools/verif.js --rapide` (lancé une fois, 1 574,3 s sur la machine partagée) -> **code 1** : 54
  étapes, 49 vertes, 4 signalées, 1 non mesurée. Les rouges, un par un :
  - `donnees` : invariant **I18** seul en erreur (`search-index.js` publié 4 431 618 o, regénéré
    4 435 931 o) — index de recherche périmé, **toléré**, l'orchestrateur le régénère ;
  - `doc-rec` : « 1 183 citent la source » introuvable dans `doc/lecon-04` (le compte des leçons qui
    citent la source de leur cas a bougé) — **toléré** ;
  - `normatf` : « leçons citant une RFC », la page dit 29, la mesure a bougé d'une leçon (la RFC 1951
    citée par `algo/lecon-13`) — **toléré** par la consigne (§ « spécification », « RFC ») ;
  - `etude-3` (`preuves/etude-recherche.js`) : « la page n'a pas fini de se construire » sous la charge ;
    **rejoué seul : code 0**, 0 écart, 0 faute ;
  - `caract` (`verif-controles.js`) : arrêté au plafond de 10 min, NON MESURÉ ; **rejoué seul : code 0**
    (0 accident, en 1 s).
  `doc-ref` est vert.
- Note : le message du commit `2be239a` compte « 4 INEXACTS » en y mettant `algo/lecon-14` (Levenshtein) ;
  relu pour ce rapport, ce cas est classé INVÉRIFIABLE (aucune source ouverte ne tranche) : **3
  INEXACTS** font foi.

## Ouvert, pour l'orchestrateur

- **Doublon Bloch** : le registre fait de `algo/lecon-03` le foyer du bug de la recherche binaire (2006) et
  prévoit que `tests/lecon-10` (lot B11) change de sujet. **`java/lecon-04#1` raconte aussi ce sujet** (lot
  1, même source) : `doublons.js` le voit maintenant que `algo/lecon-03` porte le lien. À trancher à la
  fusion (registre : ajouter `java/lecon-04` aux cas à remplacer, ou désigner le foyer).
- **Registre** (`foyers.md`) : sujets que d'autres cours pourraient vouloir — Huffman 1952 (`algo/13`),
  Dijkstra et l'ARMAC (`algo/16`), Prim 1957 (`algo/17`), l'arbre B de Bayer et McCreight (`algo/10`),
  Bellman et le nom de la programmation dynamique (`algo/14`), Facebook et les 3,57 degrés (`algo/23`),
  Norvig et le sudoku (`algo/18`), Fenwick 1994 (`algo/24`), le tri externe de PostgreSQL 15 (`algo/05`),
  `fib_trie` de Linux (`algo/20`, à surveiller pour le cours `linux`), la graine de hachage de Node.js
  (`algo/09`), les minuteurs de Node.js (`algo/11`).
- Peter Norvig apparaît deux fois sur le site, sur deux sujets distincts : le correcteur orthographique
  (`python/lecon-27`, 2007) et le solveur de sudoku (`algo/lecon-18`, 2006).
- `algo/lecon-14` : l'année du nom n'est donnée que par une parenthèse de Dreyfus (« Fall quarter (of
  1950) ») dans un récit autobiographique écrit trente ans après ; le cas raconte donc le nom **selon le
  récit de Bellman**, sans année précise, titré « années 1950 » (« The 1950s were not good years for
  mathematical research », dit Bellman). Un contre-relecteur pourra confronter la date du mandat de
  Wilson, que je n'ai pas pu ouvrir (history.defense.gov répond 403).
- Hors encadré, non traité : le corps de `algo/lecon-13` (« Kruskal et Prim »), de `algo/lecon-21`
  (Myers, `git diff`) et de `algo/lecon-23` ne citent aucune source ; rien d'inexact relevé dans les
  paragraphes voisins des encadrés.
