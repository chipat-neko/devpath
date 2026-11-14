# Rapport V18 — case B6, lot 3 : les cours `lua` et `distribue` (copie `b6-lua-distribue`, branche `v18/b6-lua-distribue`)

Copie de travail `D:\test-claude-b6-lua-distribue`, partie de `1b45660`. Part traitée : les **32 « Cas réel »**
des cours `lua` (20, un par leçon) et `distribue` (12, un par leçon). Scripts et pièces dans
`scratchpad/b6-lua-distribue/` (ignoré par git) : `cas-lua.js` et `cas-distribue.js` (les 32 textes),
`appliquer.js` (remplace le contenu du seul `div.callout__body` de l'encadré et prouve que les octets
hors de l'encadré sont identiques, refuse tout CR), `typo.js`, `contexte.js` (mots d'options de QCM
présents seulement dans l'encadré), `cherche.js`, `tests-lua/` (scripts de test), `outils/` (sources
officielles de Lua, zig portable, PDF ouverts).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **20 hors de la règle à 0** pour
`lua` et de **12 à 0** pour `distribue` ; sur les 32 cas trouvés, **0 était VRAI tel quel** :
29 INVÉRIFIABLES (récits anonymes, illustrations générales, un « Imagine… »), 3 sujets réels nommés
mais inexacts ou en partie invérifiables ; **29 remplacés** par un cas réel daté et sourcé sur la même
notion, **3 corrigés sur leur sujet** (`lua/06` lua-cjson, `lua/09` Neovim, `lua/12` Balatro),
**0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b6-lua-distribue`, partie de `1b45660`) : `e4ed7a4` (lua, 20 cas), `4b7338f`
(distribue, 12 cas), puis un dernier commit (une phrase de `lua/lecon-03` reformulée — « retirer un
élément d'une séquence » au lieu de « retirer un objet du sac pendant la boucle », qui laissait croire
qu'on peut appeler `table.remove` dans une boucle `ipairs` à l'endroit — et ce rapport).
`controle-branche.js … 1b45660` : « 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types
gardés, signatures, copie propre ».

## Méthode

- Seul l'intérieur du `div.callout__body` change (type `note`, icône et structure gardés). Les douze
  `<h2>Cas réel</h2>` collés au-dessus des encadrés de `distribue` et le `<h2>Cas réel&nbsp;: lire un
  fichier ligne par ligne</h2>` de `lua/lecon-14` n'annoncent pas l'ancien récit : inchangés.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et
  lié ; aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » (`typo.js` : 0 faute ; les
  deux-points restants sont dans des titres anglais cités tels quels).
- Longueur (titre et source compris) : `lua` 131 à 252 mots ; `distribue` 201 à 274 mots — les anciens
  récits de `distribue` faisaient 400 à 650 mots.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et
  URL) et dans le fichier commun `b6-reservations.txt`, où les 32 sujets sont inscrits (aucun pris par
  un autre agent). Sujets **écartés** parce qu'un autre cours les raconte déjà : Stripe et la clé
  d'idempotence (`api/lecon-08`), Discord et ses messages (`nosql/lecon-04`), l'article Dynamo de 2007
  (source de `nosql/lecon-01`), Jepsen sur Riak (`erlang/lecon-08` raconte Riak pendant une partition),
  « Fix Your Timestep » (`projets-js/lecon-16`), la seconde intercalaire de Cloudflare (`go/lecon-16`).
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes déjà connues).
- **Comportements testés** (« un comportement technique se TESTE ») : Lua 5.1.5, 5.2.4, 5.3.6, 5.4.7 et
  5.5.0 compilés depuis les archives officielles de lua.org avec zig 0.14.1 portable (`zig cc`, dans le
  scratchpad) ; lua-cjson d'OpenResty (branche `master`) liée statiquement à Lua 5.1.5. Résultats
  ci-dessous, cas par cas.

## Cas par cas — `lua`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/lua/lecon-01.html#1` | INVÉRIFIABLE — récit anonyme (« un débutant » sous Neovim) ; « le bug n°1 » sans source | remplacé par : Lua 5.5 et les déclarations `global` | Cas réel — Lua 5.5 et les déclarations de globales (2025) | https://www.lua.org/manual/5.5/manual.html ; https://www.lua.org/versions.html ; `luaconf.h` de lua-5.5.0.tar.gz (https://www.lua.org/ftp/lua-5.5.0.tar.gz) |
| `pages/lua/lecon-02.html#1` | INVÉRIFIABLE — récit anonyme (jeu Love2D) ; règle technique juste | remplacé par : Lua 5.0 ajoute les booléens | Cas réel — Lua 5.0 ajoute true et false (2003) | https://www.lua.org/doc/hopl.pdf (§ 4, § 6.1, § 7) ; https://www.lua.org/versions.html |
| `pages/lua/lecon-03.html#1` | INVÉRIFIABLE — récit anonyme (inventaire d'un jeu), « l'un des bugs les plus fréquents » | remplacé par : Lua 5.2 ajoute `goto` | Cas réel — Lua 5.2 ajoute goto, faute de continue (2011) | https://www.lua.org/wshop11/novelties-5.2.pdf ; https://www.lua.org/manual/5.2/manual.html (§ 3.3.4) ; https://www.lua.org/versions.html |
| `pages/lua/lecon-04.html#1` | INVÉRIFIABLE — illustration générale (serveur OpenResty anonyme) | remplacé par : des upvalues figées de Lua 3.1 à la portée lexicale de Lua 5.0 | Cas réel — Lua 5.0 et la vraie portée lexicale (2003) | https://www.lua.org/doc/hopl.pdf (§ 6.6) |
| `pages/lua/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (projectiles d'un jeu) | remplacé par : Lua 5.1 remplace `table.getn` par `#` | Cas réel — Lua 5.1 remplace table.getn par l'opérateur # (2006) | https://www.lua.org/manual/5.0/manual.html (§ 5.4) ; https://www.lua.org/manual/5.1/manual.html (§ 2.5.5, 7.2) |
| `pages/lua/lecon-06.html#1` | INEXACT — produit nommé : la sentinelle `cjson.empty_array` n'existe que dans la lua-cjson d'OpenResty, pas dans « cjson » en général ni dans celle de Redis ; ni date ni source | corrigé : limité à la version d'OpenResty, dates des deux ajouts, sourcé | Cas réel — lua-cjson d'OpenResty et la table vide (2016) | https://github.com/openresty/lua-cjson (README) ; commits `cdb1a73615` (18/02/2014) et `7a9c25ee69` (29/02/2016), https://github.com/openresty/lua-cjson/commit/7a9c25ee69 |
| `pages/lua/lecon-07.html#1` | INVÉRIFIABLE — moteur de jeu anonyme ; « exactement le mécanisme » des classes de Roblox et des objets de LÖVE : rien ne le documente | remplacé par : `etc/strict.lua` de Lua 5.1 | Cas réel — strict.lua, livré avec Lua 5.1, piège les globales (2006) | https://www.lua.org/ftp/lua-5.1.tar.gz (`etc/strict.lua`, daté du 25/08/2005 dans l'archive, et `etc/README`) ; https://www.lua.org/ftp/lua-5.1.5.tar.gz |
| `pages/lua/lecon-08.html#1` | INVÉRIFIABLE — « d'innombrables mods reposent sur ce pattern exact », classes `Entity`/`Boss` anonymes | remplacé par : la classe `Account` de *Programming in Lua* | Cas réel — Programming in Lua et la classe Account (2003) | https://www.lua.org/pil/16.1.html ; https://www.lua.org/pil/16.2.html ; https://www.lua.org/doc/hopl.pdf (date du livre, décembre 2003) |
| `pages/lua/lecon-09.html#1` | INEXACT — produit nommé, juste sur le fond (Neovim ajoute bien `/lua/?.lua` et `/lua/?/init.lua` de chaque dossier de `'runtimepath'` à `package.path`), mais « la configuration de Neovim *est* écrite en Lua » (c'est une option, depuis 0.5) et « des centaines de milliers de configurations » invérifiable | corrigé et daté (Neovim 0.5) | Cas réel — Neovim 0.5 et la configuration en Lua (2021) | https://github.com/neovim/neovim/releases/tag/v0.5.0 et le commit de notes `a5ac2f45ff` ; https://raw.githubusercontent.com/neovim/neovim/release-0.5/runtime/doc/lua.txt ; https://raw.githubusercontent.com/neovim/neovim/release-0.5/runtime/doc/options.txt |
| `pages/lua/lecon-10.html#1` | INVÉRIFIABLE (verdict de B2 confirmé) — « presque toujours des coroutines », « LÖVE et Defold fonctionnent exactement ainsi » introuvables | remplacé par : le `pcall` interruptible de Lua 5.2 | Cas réel — Lua 5.2 laisse une coroutine se suspendre dans un pcall (2011) | https://www.lua.org/versions.html ; https://www.lua.org/wshop11/novelties-5.2.pdf |
| `pages/lua/lecon-11.html#1` | INVÉRIFIABLE — usage général, « d'innombrables sites » | remplacé par : le limiteur de débit de GitHub en Redis et Lua | Cas réel — GitHub confie sa limite de débit à Redis et Lua (2021) | https://github.blog/engineering/infrastructure/how-we-scaled-github-api-sharded-replicated-rate-limiter-redis/ |
| `pages/lua/lecon-12.html#1` | INEXACT en partie — produit nommé : LÖVE vrai ; « nommé aux Game Awards » incomplet (trois prix gagnés) ; « plusieurs millions de copies » trouvé seulement dans la presse ; « son unique développeur a bâti tout le jeu sur ces mêmes fonctions de rappel » et *Mari0* non confirmés par une source primaire | corrigé : LÖVE et palmarès sourcés au primaire, le reste retiré | Cas réel — Balatro, fait avec LÖVE, primé aux Game Awards (2024) | https://www.love2d.org/ (rubrique « Games » : Balatro, Move or Die, Gravity Circuit, Moonring…) ; https://thegameawards.com/rewind/year-2024 |
| `pages/lua/lecon-13.html#1` | INEXACT (verdict de B2 confirmé) — les motifs n'expliquent pas la présence de Lua dans Redis, et Redis ne « filtre ni ne route » des requêtes avec | remplacé par : pourquoi Lua n'a pas de regex POSIX | Cas réel — Programming in Lua : pourquoi pas de regex POSIX (2003) | https://www.lua.org/pil/20.1.html |
| `pages/lua/lecon-14.html#1` | INVÉRIFIABLE — usage général (juste techniquement) | remplacé par : `io.lines` et la valeur de fermeture de Lua 5.4 | Cas réel — Lua 5.4 : io.lines referme le fichier même après un break (2020) | https://www.lua.org/manual/5.4/manual.html (§ 3.3.5, 6.8) ; https://www.lua.org/manual/5.3/manual.html (§ 6.8) ; https://www.lua.org/versions.html |
| `pages/lua/lecon-15.html#1` | INVÉRIFIABLE — « les studios appliquent exactement les règles de cette leçon » | remplacé par : le ramasse-miettes incrémental de Lua 5.1 et le robot Crazy Ivan | Cas réel — Lua 5.1 et son ramasse-miettes incrémental (2006) | https://www.lua.org/doc/hopl.pdf (§ 5.5, note 10) ; https://www.lua.org/manual/5.1/manual.html (§ 2.10) |
| `pages/lua/lecon-16.html#1` | INVÉRIFIABLE — illustration fictive annoncée (« Imagine une liste d'inscriptions… ») | remplacé par : `vim.iter` de Neovim 0.10 | Cas réel — Neovim 0.10 et vim.iter : filter, map, fold (2024) | https://raw.githubusercontent.com/neovim/neovim/release-0.10/runtime/doc/news.txt ; https://raw.githubusercontent.com/neovim/neovim/release-0.10/runtime/doc/lua.txt ; date de publication par l'API GitHub (release v0.10.0, 16/05/2024) |
| `pages/lua/lecon-17.html#1` | INVÉRIFIABLE — titre « pourquoi Redis a choisi Lua » que le corps ne traite pas ; usages généraux (WoW, nginx, Wireshark) | remplacé par : CVE-2022-0543, évasion du bac à sable Lua de Redis sous Debian | Cas réel — Redis sous Debian, l'évasion du bac à sable Lua (2022) | https://www.ubercomp.com/posts/2022-01-20_redis_on_debian_rce ; https://security-tracker.debian.org/tracker/CVE-2022-0543 |
| `pages/lua/lecon-18.html#1` | INVÉRIFIABLE — usage général (LÖVE, Neovim, awesome), sans date | remplacé par : Lua 5.2 retire la vérification du bytecode, argument `mode` de `load` | Cas réel — Lua 5.2 renonce à vérifier le bytecode (2011) | https://www.lua.org/manual/5.2/manual.html (§ 6.1, 8.2) ; https://www.lua.org/manual/5.1/manual.html (signatures de `load`, `loadstring`) |
| `pages/lua/lecon-19.html#1` | INVÉRIFIABLE — « c'est ainsi que des bibliothèques comme Penlight restent fiables » | remplacé par : LuaRocks 3.0 et `luarocks test` | Cas réel — LuaRocks 3.0 ajoute la commande luarocks test (2018) | https://github.com/luarocks/luarocks/blob/main/CHANGELOG.md (« What's new in LuaRocks 3.0.0 ») ; date du commit « Release 3.0.0 » (20/07/2018) par l'API GitHub |
| `pages/lua/lecon-20.html#1` | INVÉRIFIABLE — liste générale sans date ni source | remplacé par : awesome 3.0 passe sa configuration en `rc.lua` | Cas réel — awesome 3.0 passe sa configuration en Lua (2008) | https://github.com/awesomeWM/awesome/blob/v3.0/awesomerc.5.txt ; https://github.com/awesomeWM/awesome/blob/v2.3/awesomerc.5.txt ; README des étiquettes v3.0 et v2.3 (raw.githubusercontent.com) |

### Tests rejoués (`scratchpad/b6-lua-distribue/tests-lua/`)

- `if 0 then` et `if "" then` exécutent leur bloc de 5.1 à 5.5 (`lua/02`).
- `goto continue` : refusé par 5.1 (« '=' expected near 'continue' »), accepté de 5.2 à 5.5 ;
  `continue` reste un nom ordinaire ; `table.remove(sac, 2)` décale bien les suivants (`lua/03`).
- `table.getn` existe en 5.1 et plus en 5.2 ; `table.setn` lève « 'setn' is obsolete » en 5.1 ;
  `#{1, 2, nil, 4}` vaut **4** en 5.1 à 5.4 et **2** en 5.5 — la « limite » quelconque du manuel (`lua/05`).
- lua-cjson d'OpenResty : `encode({})` → `{}`, `empty_array` → `[]`, `empty_array_mt` → `[]`,
  `encode_empty_table_as_object(false)` puis `encode({})` → `[]` (`lua/06`).
- `strict.lua` sous 5.1.5 : affectation non déclarée depuis une fonction → « assign to undeclared
  variable 'nouvelle' » ; lecture → « variable 'inconnue' is not declared » ; globale déclarée à `nil`
  dans le morceau principal puis affectée depuis une fonction → accepté (`lua/07`).
- `yield` dans un `pcall` : 5.1 → le `pcall` rend `false, "attempt to yield across metamethod/C-call
  boundary"` ; 5.2 et 5.4 → la coroutine se suspend, reprend, et l'erreur levée après la reprise est
  rattrapée par le même `pcall` (`lua/10`).
- `io.lines` : 1 valeur en 5.3, 4 en 5.4 et 5.5 ; après `break`, `io.type(h)` vaut « closed file » (`lua/14`).
- `load(string.dump(f), "bin", "t")` → « attempt to load a binary chunk (mode is 't') » de 5.2 à 5.5 ;
  `load` de 5.1 n'accepte qu'une fonction (`lua/18`) ; `load("return os", "x", "t", {})()` → `nil`.
- Lua 5.5 : après `global none`, `X = 1` est refusé **à la compilation** (« variable 'X' not declared »,
  la ligne précédente n'est pas exécutée) ; `global X; X = 1` passe. **Écart avec le manuel** : le §8.1 dit
  « global est un mot réservé », mais `luaconf.h` de la distribution 5.5.0 définit `LUA_COMPAT_GLOBAL` par
  défaut, et `local global = 1` compile — le cas le dit (`lua/01`).

## Cas par cas — `distribue`

Les douze anciens « Cas réel » étaient des récits anonymes très détaillés (« une équipe », « une
plateforme », « une place de marché »…), dont les chiffres reprenaient ceux des simulations de la leçon :
**INVÉRIFIABLES** (nature : récit anonyme), probablement construits pour la leçon. B2 avait tiré
`distribue/lecon-10` : INVÉRIFIABLE, confirmé. Les douze sont **remplacés**.

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/distribue/lecon-01.html#1` | INVÉRIFIABLE — récit anonyme (monolithe découpé en dix services) | remplacé par : la « règle du neuf supplémentaire » de Google | Cas réel — Google et la « règle du neuf supplémentaire » (2017) | https://sre.google/static/pdf/calculus_of.pdf (ACM Queue, mars-avril 2017 ; queue.acm.org refuse l'accès automatique, 403) |
| `pages/distribue/lecon-02.html#1` | INVÉRIFIABLE — récit anonyme (base déplacée en Amérique du Nord) | remplacé par : Stuart Cheshire, « It's the Latency, Stupid » | Cas réel — Stuart Cheshire, « It's the Latency, Stupid » (1996) | http://www.stuartcheshire.org/rants/latency.html |
| `pages/distribue/lecon-03.html#1` | INVÉRIFIABLE — récit anonyme (boutique et prestataire de paiement) | remplacé par : la « panne grise » d'Azure (HotOS 2017) | Cas réel — Microsoft Azure et la « panne grise » (2017) | https://www.microsoft.com/en-us/research/wp-content/uploads/2017/06/paper-1.pdf |
| `pages/distribue/lecon-04.html#1` | INVÉRIFIABLE — récit anonyme (billetterie, deux salles, 54 s de dérive) | remplacé par : Spanner et TrueTime | Cas réel — Google Spanner et l'heure donnée comme un intervalle (2012) | https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf |
| `pages/distribue/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (application de notes hors ligne) | remplacé par : l'origine de l'article de Lamport (1978) | Cas réel — Lamport et l'algorithme qui violait la causalité (1978) | https://lamport.azurewebsites.net/pubs/pubs.html#time-clocks |
| `pages/distribue/lecon-06.html#1` | INVÉRIFIABLE — récit anonyme (réservation de salles, 41 doubles réservations) | remplacé par : l'incident de GitHub du 21 octobre 2018 | Cas réel — GitHub choisit la cohérence pendant une partition (2018) | https://github.blog/news-insights/company-news/oct21-post-incident-analysis/ |
| `pages/distribue/lecon-07.html#1` | INVÉRIFIABLE — récit anonyme (place de marché, huit suiveurs) | remplacé par : les six copies d'Aurora sur trois zones | Cas réel — Amazon Aurora et ses six copies sur trois zones (2017) | https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/ (le PDF SIGMOD 2017 était inaccessible : 403 et 404) |
| `pages/distribue/lecon-08.html#1` | INVÉRIFIABLE — récit anonyme (messagerie d'entreprise, 16 → 24 partitions) | remplacé par : le partitionnement de Notion | Cas réel — Notion partitionne sa base par espace de travail (2021) | https://www.notion.com/blog/sharding-postgres-at-notion |
| `pages/distribue/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (configuration, quatre répliques sur deux zones) | remplacé par : l'incident Cloudflare du 2 novembre 2020 (etcd, Raft) | Cas réel — Cloudflare, une élection Raft qui n'aboutit pas (2020) | https://blog.cloudflare.com/a-byzantine-failure-in-the-real-world/ |
| `pages/distribue/lecon-10.html#1` | INVÉRIFIABLE — récit anonyme (billetterie) ; verdict de B2 | remplacé par : le `ClientToken` d'EC2 (Amazon Builders' Library) | Cas réel — Amazon EC2 et le jeton client des réessais (2020) | https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ ; PDF de l'article (© 2020, créé le 29/12/2020) https://d1.awsstatic.com/builderslibrary/pdfs/making-retries-safe-with-idempotent-apis-malcolm-featonby.pdf |
| `pages/distribue/lecon-11.html#1` | INVÉRIFIABLE — récit anonyme (entrepôt, 16 partitions) | remplacé par : les files de réessai et la file des lettres mortes d'Uber | Cas réel — Uber sort les messages empoisonnés de sa file Kafka (2018) | https://www.uber.com/blog/reliable-reprocessing/ |
| `pages/distribue/lecon-12.html#1` | INVÉRIFIABLE — récit anonyme (magasin de sessions, bascule en W = 1) | remplacé par : Elasticsearch 7.0 retire `minimum_master_nodes` | Cas réel — Elasticsearch 7.0 retire le quorum réglé à la main (2019) | https://www.elastic.co/blog/a-new-era-for-cluster-coordination-in-elasticsearch |

## Décomptes

| | lua | distribue | total |
|---|---:|---:|---:|
| « Cas réel » lus | 20 | 12 | **32** |
| VRAI tel quel | 0 | 0 | 0 |
| INEXACT (dont en partie invérifiable) | 4 (06, 09, 12, 13) | 0 | 4 |
| INVÉRIFIABLE | 16 | 12 | 28 |
| INVENTÉ | 0 | 0 | 0 |
| vérifiés tels quels | 0 | 0 | 0 |
| corrigés sur leur sujet | 3 (06, 09, 12) | 0 | **3** |
| remplacés | 17 | 12 | **29** |
| renommés « Scénario » | 0 | 0 | 0 |
| hors de la règle avant → après | 20 → 0 | 12 → 0 | 32 → 0 |

(`lua/13`, INEXACT, est remplacé et non corrigé : sa thèse même — les motifs expliqueraient Lua dans
Redis — était fausse.)

## Contrôles (sur la copie, avant le dernier commit)

| Commande | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=lua` | **0** (20 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=distribue` | **0** (12 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b6-lua-distribue 1b45660` | **1 écart, structurel** (ci-dessous) |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées (les deux légitimes connues) |
| 0 CR dans les 32 fichiers | oui |
| `node tools/verif.js --rapide` | voir plus bas |

**L'écart de `lexique-diff`** : `pages/distribue/lecon-12.html` « gagne » le mot `source`, qui entre par
la classe obligatoire `cas-reel__source` et le « Source&nbsp;: » de la ligne de source ; il est absent du
reste de la page et figure dans une option de ses QCM. Inévitable sans déroger à la règle de B3 (même cas
qu'au lot 2, `git/lecon-22`, `nodejs/lecon-08` et `-17`). Les deux cliquets restent à 0. Aucun mot
d'option n'est PERDU : les mots qui n'étaient dans la page que par l'ancien récit sont gardés dans des
phrases exactes (`décale` en lua/03 ; `partagée`, `unique` en lua/04 ; `moteur` en lua/07 ;
`dupliquer` en lua/08 ; `attendre`, `qu'elle` en lua/10 ; `limite` en lua/11 ; `entier`, `plusieurs` en
lua/14 ; `collecte` en lua/15 ; `dossier` en lua/18 ; `puisqu'il` en distribue/06 ; `prévoir` en
distribue/08 ; `puisque`, `exception` en distribue/11 ; `bascule`, `connexion`, `aurait`, `exploite`,
`charge` en distribue/12), et dix mots GAGNÉS au premier jet ont été reformulés (`espacées`, `liaison`,
`elle-même`, `ordinaire`, `parcours`, `version`, `défaut`, `limite` en lua/10, `charge` et `commande` en
lua/17).

**`node tools/verif.js --rapide`** (code 1, 54 étapes jouées) : quatre rouges, tous expliqués, aucun
autre.
- `donnees` — invariant **I18** seul (index de recherche périmé : `search-index.js` publié 4 341 825 o,
  régénéré ≈ 4 343 800 o) : toléré, l'orchestrateur régénère après la fusion.
- `doc-rec` — chiffres du cours `doc` mesurés sur tout le site, que mes lignes de source font bouger :
  toléré, régénéré après la fusion.
- `etudes` et `etude-6` — **non listés dans les tolérés, expliqués** : la page d'étude
  `pages/etude-inconnu.html` publie une mesure du site entier, « 39 langages, 10 629 blocs de code » (et
  13 187 blocs au total) ; la mesure du jour donne **10 626** (et 13 184). Les **trois** blocs de code qui
  manquent sont ceux des anciens récits que j'ai remplacés : `rate_limit.lua` (`lua/lecon-11`),
  `log.lua` (`lua/lecon-13`), `analyse.lua` (`lua/lecon-14`) — du code illustratif d'un cas anonyme, que
  je n'ai pas remplacé par du code inventé pour garder le compte. `etude-6` (« la page dit-elle qu'aucun
  compilateur Go n'a tourné ») échoue pour la même raison : sa sortie brute publiée n'est plus celle de la
  mesure du jour. Remède, après la fusion : relancer l'assembleur de `etude-inconnu.html` sans
  `--verifier` (page dérivée, je n'y ai pas touché).

Rejoué trois fois (sur `4b7338f`, puis sur l'état final après une phrase reformulée en `lua/lecon-03`) :
mêmes quatre rouges, mêmes causes.

## Ce qui reste ouvert (hors encadré : non touché, à trancher par l'orchestrateur)

1. **`pages/distribue/lecon-04.html`, corps de la leçon** — deux phrases renvoient à l'ANCIEN récit
   (serveur de temps injoignable, écart d'horloge non supervisé), qui n'existe plus :
   - section « Superviser l'écart… » : « Une chose frappe dans le cas réel raconté plus bas, et dans
     presque tous ceux du même genre&nbsp;: l'écart d'horloge n'était mesuré nulle part. » — le nouveau cas
     (Spanner) dit l'inverse : l'incertitude y est mesurée et payée. Proposition : « Une chose frappe dans
     presque tous les incidents de ce genre&nbsp;: l'écart d'horloge n'y était mesuré nulle part. »
   - même section : « C'est le signal qui manquait dans le cas réel. » — proposition : supprimer la phrase.
2. **`pages/distribue/lecon-12.html`, explication de la 4ᵉ question du QCM de la leçon** (« Pendant la
   partition, le tableau de bord affiche « 96,77 % des opérations servies »… ») : « …c'est précisément
   l'écran qui manquait dans le cas réel de cette leçon. » — l'écran par zone était celui de l'ancien
   récit. Je n'ai pas touché au QCM (interdit) ; proposition : terminer l'explication à « C'est le taux de
   service PAR ZONE qui informe. »
3. **Recoupements internes au cours `lua`** (sujets distincts, mêmes documents) : « The Evolution of
   Lua » (HOPL III, 2007) source trois cas (02 booléens, 04 portée lexicale, 15 ramasse-miettes) ;
   *Programming in Lua* deux (08 classes, 13 motifs) ; Neovim deux (09 en 0.5, 16 en 0.10) ; Redis deux
   (11 GitHub, 17 CVE Debian). `doublons.js` ne compare que les cours entre eux.
4. **Risques pour les lots suivants** : `cloud/lecon-09` (B12) raconte le SRE de Google sans source — qu'il
   ne prenne pas l'article d'ACM Queue de 2017 (pris ici, `distribue/lecon-01`) ; `erlang/lecon-08` (B11)
   raconte Riak pendant une partition — l'analyse Jepsen de Riak (2013) reste libre, je l'ai écartée pour
   ne pas lui prendre son sujet ; `api/lecon-08` (B9) garde Stripe et la clé d'idempotence.
5. Sujets à inscrire au registre `foyers.md` après fusion : les 32 de `b6-reservations.txt` (lignes
   `lua/…` et `distribue/…`), dont les plus « célèbres » : GitHub 21/10/2018 (`distribue/06`), Cloudflare
   2/11/2020 (`distribue/09`), Spanner/TrueTime (`distribue/04`), CVE-2022-0543 (`lua/17`), Balatro
   (`lua/12`).

## Doutes et pièges rencontrés

- **Neovim et `package.path`** : la doc ACTUELLE de Neovim (lue par l'outil web) ne montre que la
  recherche dans les dossiers `lua/` du `'runtimepath'` ; j'ai d'abord cru l'ancien cas faux sur ce
  point. La doc de la version **0.5** (`lua-package-path`) dit bien que Neovim ajoute `/lua/?.lua` et
  `/lua/?/init.lua` de chaque dossier du `'runtimepath'` à `package.path` : l'affirmation était juste,
  gardée et datée. Leçon : lire la doc de la version citée, pas la dernière.
- **Lua 5.5 et le mot `global`** : le manuel le dit réservé, la distribution officielle le laisse libre
  par défaut (`LUA_COMPAT_GLOBAL`) ; vérifié à la compilation, écrit tel quel.
- **Balatro** : aucune source primaire pour les ventes (seulement la presse) ; retirées. La page
  d'accueil de LÖVE (non datée) est la source primaire du lien Balatro–LÖVE.
- **Aurora** : le PDF SIGMOD 2017 était inaccessible (403/404) ; le billet du blog AWS d'Anurag Gupta
  (14/08/2017) porte toutes les affirmations du cas.
- **Debian DSA-5081** : la page de l'avis est derrière une preuve de travail ; date et numéro tirés du
  billet d'analyse et du suivi de sécurité de Debian (ouverts).
- **Cheshire** énumère quatre « faits » : le cas dit « premier » et « deuxième », pas « deux faits ».
