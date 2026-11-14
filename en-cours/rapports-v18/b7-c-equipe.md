# Rapport V18 — case B7, lot 4 : les cours `c` et `equipe` (copie `b7-c-equipe`, branche `v18/b7-c-equipe`)

Copie de travail `D:\test-claude-b7-c-equipe`, partie de `13eabe3`. Part traitée : les **35 « Cas réel »**
des cours `c` (21, un par leçon) et `equipe` (14, un par leçon). Scripts et pièces dans
`scratchpad/b7-c-equipe/` (ignoré par git) : `cas-c.js` et `cas-equipe.js` (les 35 textes),
`appliquer.js` (remplace le seul intérieur du `div.callout__body` et, si demandé, l'intertitre collé ;
prouve que les octets hors de l'encadré sont identiques ; refuse un lien dans le corps, un CR, une
espace ordinaire devant « : ; ! ? » ou dans « »), `lexdiff-local.js` (même calcul que
`lexique-diff.js`, sur une copie locale de la base : git répondait en 20 à 30 s par commande pendant la
séance), `qcm-mot.js`, `contexte.js`, `pdftxt.py` (lecture des PDF par `pypdf`), `tests-c/essais.c`,
`pdf/` (PDF et textes extraits), `outils/` (Zig 0.14.1 officiel portable : celui du dossier partagé n'a
plus ses en-têtes libc).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **21 hors de la règle à 0** pour
`c` et de **14 à 0** pour `equipe` ; sur les 35 cas trouvés, **1 seul était VRAI** tel quel (Heartbleed) ;
**32 remplacés**, **3 gardés et corrigés**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b7-c-equipe`) : `bb0478f` (c, 21 cas), `9e1eacb` (equipe, 14 cas, et
rééquilibrage lexical de `c/lecon-11`), puis ce rapport.

## Méthode

- **Un sujet = un seul cours.** Chaque sujet cherché dans `tools/cas-reels/lots/foyers.md`, dans tout
  `pages/` (texte et URL, `cherche.js`) et dans le fichier commun
  `D:/test-claude/scratchpad/v18-parallele/b7-reservations.txt`, où les 35 sujets sont inscrits (relu
  après écriture : aucun pris par un autre agent). Écartés parce qu'un autre cours les raconte :
  Tony Hoare (`csharp/lecon-08`), goto fail (`csharp/lecon-03`), Ariane 5 (`ada/lecon-07`), Gangnam
  Style (`haskell/lecon-02`), la philosophie Unix des tubes (`os/lecon-08`) et ripgrep (`rust/lecon-13`),
  le pilote tun et GCC (`asm/lecon-08`, réservé par l'agent asm), Cloudbleed (`js/lecon-05`), la
  recherche dichotomique de Bloch (`algo`, `java`, `tests`), Debian et OpenSSL 2008 (`crypto/lecon-10`),
  Amazon S3 2017 (`python/lecon-28`), Atlassian 2022 (`sql/lecon-10`), McIlroy (réservé par `bash/lecon-04`).
  Le **ver Morris**, raconté par `c/lecon-06`, `c/lecon-09` et `asm/lecon-10`, a son foyer en
  `c/lecon-09` (gets contre fgets est la notion de la leçon) ; l'agent asm a pris SQL Slammer pour
  `asm/lecon-10`. **Heartbleed** garde son foyer en `c/lecon-11` (sanitizers) ; `c/lecon-16` est remplacé.
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes connues).
- **Intertitres** : les `<h2>` collés de `c/lecon-17`, `-19`, `-20`, `-21` annonçaient l'ancien récit
  (« un argument mal converti », « la valeur de config trop longue », « le compteur de statistiques qui
  mentait », « la philosophie Unix ») : retouchés. Les quatorze `<h2>Cas réel</h2>` d'`equipe`
  n'annoncent rien : inchangés.
- **Forme** : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté
  et lié ; aucun lien dans le corps ; `&nbsp;` partout où il faut (contrôlé par `appliquer.js`).
  Longueur des corps : `c` 150 à 215 mots, `equipe` 166 à 215 mots (les anciens récits d'`equipe`
  faisaient 120 à 210 mots).
- **Comportements rejoués** (Zig 0.14.1, Clang intégré) : `sizeof(struct usbdevfs_connectinfo)` = 8
  et `slow` à l'offset 4 ; `atoi("")`, `atoi("abc")` et `atoi("0")` valent 0, `strtol("abc")` laisse
  `fin == txt` ; le comparateur `a - b` sur `INT_MIN, 0, INT_MAX` rend −2147483648, −2147483647 puis
  **+1** (compilé en `-fwrapv`). Date de débordement d'un `time_t` signé de 32 bits recalculée avec
  node : 2038-01-19T03:14:07Z.

## Cas par cas — `c`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/c/lecon-01.html#1` | INVÉRIFIABLE — récit anonyme (« un vrai projet », `printf("%d", prix)`) | remplacé par : GCC 14 change des avertissements en erreurs | Cas réel — GCC 14 change des avertissements en erreurs (2024) | https://gcc.gnu.org/gcc-14/porting_to.html ; https://gcc.gnu.org/gcc-14/ |
| `pages/c/lecon-02.html#1` | INEXACT et doublons — événements datés : Ariane 5 « quarante secondes après le décollage » (le rapport dit 37 s après H0, 30 s après le décollage ; sujet gardé par `ada/lecon-07`) ; Gangnam Style, sujet aussi raconté par `haskell/lecon-02`, sourcé seulement par la presse | remplacé par : Linux 5.6 et l'an 2038 | Cas réel — Linux 5.6 et le bogue de l'an 2038 (2020) | https://github.com/torvalds/linux/commit/22b17db4ea05561c7c8e4d770f10751e22e339f9 ; https://sourceware.org/git/?p=glibc.git;a=blob_plain;f=NEWS;hb=refs/heads/release/2.34/master ; https://pubs.opengroup.org/onlinepubs/9799919799/functions/time.html |
| `pages/c/lecon-03.html#1` | sujet réel gardé ailleurs — goto fail d'Apple (foyer `csharp/lecon-03`) ; non revérifié | remplacé par : le noyau Linux et `-Wimplicit-fallthrough` | Cas réel — le noyau Linux traque les break oubliés (2019) | https://github.com/torvalds/linux/commit/b4b52b881cf08e13d110eac811d4becc0775abbf ; https://github.com/torvalds/linux/commit/88c5083442454e5e8a505b11fa16f32d2879651e ; https://github.com/torvalds/linux/commit/a035d552a93bb9ef6048733bb9f2a0dc857ff869 (et deprecated.rst à ce commit) |
| `pages/c/lecon-04.html#1` | INVÉRIFIABLE — illustration générale (« plusieurs bibliothèques JSON ») | remplacé par : Expat, CVE-2022-25313 | Cas réel — Expat et la pile épuisée par la récursion (2022) | https://github.com/libexpat/libexpat/blob/master/expat/Changes ; https://github.com/libexpat/libexpat/pull/558 ; https://github.com/libexpat/libexpat/blob/R_2_4_5/expat/README.md |
| `pages/c/lecon-05.html#1` | sujet réel gardé ailleurs — Tony Hoare (foyer `csharp/lecon-08`) | remplacé par : OpenSSL, CVE-2021-3449 | Cas réel — OpenSSL et le pointeur NULL de la renégociation (2021) | https://www.openssl.org/news/secadv/20210325.txt ; https://github.com/openssl/openssl/commit/fb9fa6b51defd48157eeb207f52181f735d96148 |
| `pages/c/lecon-06.html#1` | doublon interne — ver Morris, aussi en `c/lecon-09` (foyer) | remplacé par : sudo « Baron Samedit » | Cas réel — sudo et l'antislash qui fait enjamber le zéro final (2021) | https://www.openwall.com/lists/oss-security/2021/01/26/3 |
| `pages/c/lecon-07.html#1` | INVÉRIFIABLE — récit anonyme (« un service réseau », OOM killer) | remplacé par : BIND 9, CVE-2022-38177 | Cas réel — BIND et la petite fuite qui use la mémoire (2022) | https://kb.isc.org/docs/cve-2022-38177 |
| `pages/c/lecon-08.html#1` | INVÉRIFIABLE — récit anonyme (« une équipe », `fwrite` d'une struct) | remplacé par : CVE-2016-4482, bourrage de `usbdevfs_connectinfo` | Cas réel — trois octets de bourrage sortis du noyau Linux (2016) | https://github.com/torvalds/linux/commit/681fef8380eb818c0b845fca5d2ab1dcbab114ee ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2016-4482 ; https://raw.githubusercontent.com/torvalds/linux/master/include/uapi/linux/usbdevice_fs.h |
| `pages/c/lecon-09.html#1` | INEXACT (mineur) — événement daté : le ver n'a pas « paralysé » des milliers de machines, il s'est répandu sur des milliers et a perturbé le réseau plusieurs jours ; ni date précise ni source | gardé et corrigé : date, 536 octets, VAX sous 4 BSD, audit de Berkeley (fingerd et timed), C11 | Cas réel — le ver Morris et le gets() de fingerd (1988) | https://www.cerias.purdue.edu/techreports-ssl/public/823.pdf ; https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf |
| `pages/c/lecon-10.html#1` | INVÉRIFIABLE — produit nommé, chiffres non sourcés (« 30 millions de lignes », « dizaines de minutes ») | remplacé par : Peter Miller, « Recursive Make Considered Harmful » | Cas réel — Peter Miller et le make récursif (1997) | https://aegis.sourceforge.net/auug97.pdf |
| `pages/c/lecon-11.html#1` | VRAI (verdict de B2 confirmé) ; « depuis » laissait croire à une causalité, « une grande partie du web » sans source | gardé et corrigé : mécanisme d'après le commit, OSS-Fuzz au présent ; trois mots d'options remis (voir « Lexique ») | Cas réel — Heartbleed dans OpenSSL (2014) | https://www.openssl.org/news/secadv/20140407.txt ; https://github.com/openssl/openssl/commit/96db9023b881d7cd9f379b0c154650d6c108e9a3 ; https://heartbleed.com/ ; https://github.com/google/fuzzer-test-suite/blob/master/openssl-1.0.1f/README.md ; https://github.com/google/oss-fuzz/blob/master/projects/openssl/project.yaml |
| `pages/c/lecon-12.html#1` | INVÉRIFIABLE — illustration générale (« zlib ou OpenSSL », sans événement) | remplacé par : l'avis zlib du 11 mars 2002 | Cas réel — la faille de zlib et les programmes liés en statique (2002) | https://www.zlib.net/advisory-2002-03-11.txt ; http://web.archive.org/web/20020603132250/http://www.cert.org:80/advisories/CA-2002-07.html |
| `pages/c/lecon-13.html#1` | INVÉRIFIABLE — produit nommé sans date ni source (`file_operations`) ; « le pointeur `.read` » pour un fichier ordinaire est douteux (les systèmes de fichiers actuels passent par `read_iter`) | remplacé par : CVE-2009-2692, `sock_sendpage` | Cas réel — Linux et la méthode sendpage restée à NULL (2009) | https://blog.cr0.org/2009/08/linux-null-pointer-dereference-due-to.html ; https://github.com/torvalds/linux/commit/e694958388c50148389b0e9b9e9e8945cf0f1b98 |
| `pages/c/lecon-14.html#1` | INEXACT — « 70 % de leurs failles critiques » : Microsoft compte les vulnérabilités qui reçoivent un CVE, Chromium les bogues de gravité haute | gardé et corrigé : chiffres exacts, moitié de use-after-free, MiraclePtr ; `free(NULL)` sourcé (C11) | Cas réel — Microsoft et Chrome comptent leurs failles mémoire (2019) | https://www.microsoft.com/en-us/msrc/blog/2019/07/a-proactive-approach-to-more-secure-code ; https://www.chromium.org/Home/chromium-security/memory-safety/ ; https://security.googleblog.com/2021/09/an-update-on-memory-safety-in-chrome.html ; https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf (§ 7.22.3.3) |
| `pages/c/lecon-15.html#1` | INVÉRIFIABLE — illustration générale vraie mais ni sujet daté ni source (`chmod 0644`) | remplacé par : `chmod` dans la première édition du manuel d'Unix et POSIX.1-2024 | Cas réel — chmod et ses drapeaux octaux, dès Unix (1971) | https://www.nokia.com/bell-labs/about/dennis-m-ritchie/1stEdman.html (et man11.ps, manintro.ps : page CHMOD (I), auteurs) ; https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/sys_stat.h.html |
| `pages/c/lecon-16.html#1` | doublon interne — Heartbleed, aussi en `c/lecon-11` (foyer) | remplacé par : le Zune 30 Go, 31 décembre 2008 | Cas réel — le Zune 30 Go et l'année bissextile (2008) | http://web.archive.org/web/20090102065900/http://forums.zune.net:80/412486/ShowPost.aspx ; http://web.archive.org/web/20090102065939/http://www.zune.net:80/en-us/support/zune30.htm |
| `pages/c/lecon-17.html#1` | INVÉRIFIABLE — récit anonyme (« un outil de sauvegarde ») | remplacé par : OpenBSD 3.6 ajoute `strtonum` ; intertitre retouché | Cas réel — OpenBSD ajoute strtonum (2004) | https://www.openbsd.org/36.html ; https://man.openbsd.org/strtonum.3 ; https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf (§ 7.22.1, 7.22.1.2) |
| `pages/c/lecon-18.html#1` | INVÉRIFIABLE — usage général (tri par colonnes) | remplacé par : Qualys, le `qsort` de la glibc | Cas réel — qsort, la glibc et le comparateur qui soustrait (2024) | https://www.openwall.com/lists/oss-security/2024/01/30/7 |
| `pages/c/lecon-19.html#1` | INVÉRIFIABLE — récit anonyme (« un service », `strcpy` d'une valeur de configuration) | remplacé par : `strlcpy`, de l'article USENIX 1999 à la glibc 2.38 ; intertitre retouché | Cas réel — strlcpy et strlcat, d'OpenBSD (1999) à la glibc (2023) | https://www.usenix.org/legacy/event/usenix99/full_papers/millert/millert.pdf ; https://www.usenix.org/legacy/event/usenix99/full_papers/millert/millert_html/index.html ; https://sourceware.org/bugzilla/show_bug.cgi?id=178 ; https://sourceware.org/pipermail/libc-alpha/2023-July/150524.html ; NEWS de la glibc 2.38 (https://sourceware.org/git/?p=glibc.git;a=blob_plain;f=NEWS;hb=refs/heads/release/2.38/master) |
| `pages/c/lecon-20.html#1` | INVÉRIFIABLE — récit anonyme (« un serveur multithread ») | remplacé par : Mozilla, ThreadSanitizer dans Firefox ; intertitre retouché | Cas réel — Firefox chasse ses courses aux données (2021) | https://hacks.mozilla.org/2021/04/eliminating-data-races-in-firefox-a-technical-report/ |
| `pages/c/lecon-21.html#1` | sujet gardé ailleurs et non sourcé — la philosophie Unix des tubes (`os/lecon-08`), ripgrep (`rust/lecon-13`) ; « wc, 1971, toujours écrit en C » non vérifié (l'Unix de 1971 n'était pas en C) | remplacé par : Jim Meyering, « Goodbye World! » ; intertitre retouché | Cas réel — Jim Meyering et le « Hello, world » qui ment (2011) | https://www.gnu.org/ghm/2011/paris/slides/jim-meyering-goodbye-world.pdf ; https://www.gnu.org/ghm/2011/paris/ |

## Cas par cas — `equipe`

Les 14 anciens cas étaient des **récits fictifs ou anonymes** ; quatre mettaient en scène l'équipe
fictive du fil rouge (Sam, Léa, Inès, Théo, l'application Repère) sous le titre « Cas réel ». État :
**INVÉRIFIABLE** (nature : anonyme) pour les quatorze ; action : **remplacé** pour les quatorze.

| Cas | Ancien récit | Nouveau titre | Sources ouvertes |
|---|---|---|---|
| `pages/equipe/lecon-01.html#1` | « un développeur brillant » qui part | Cas réel — le « facteur camion » de 133 projets GitHub (2016) | https://arxiv.org/abs/1604.06766 ; https://arxiv.org/pdf/1604.06766v1 |
| `pages/equipe/lecon-02.html#1` | le `* 1.0` retiré d'un service de facturation | Cas réel — 58 % du temps à comprendre le code (2018) | https://xin-xia.github.io/publication/TSE17.pdf |
| `pages/equipe/lecon-03.html#1` | deux arrivées dans deux équipes | Cas réel — l'intégration à distance des nouveaux venus chez Microsoft (2020) | https://arxiv.org/abs/2011.08130 ; https://arxiv.org/pdf/2011.08130v2 |
| `pages/equipe/lecon-04.html#1` | « un relecteur exigeant » | Cas réel — Google publie ses règles de revue de code (2019) | https://google.github.io/eng-practices/review/reviewer/standard.html ; https://google.github.io/eng-practices/review/reviewer/comments.html ; https://github.com/google/eng-practices/commit/537567e904000021505816594d4ba66d19224464 ; version de 2019 des deux pages (commit 47ea81e) ; https://api.github.com/repos/google/eng-practices (création du dépôt, 4 septembre 2019) |
| `pages/equipe/lecon-05.html#1` | « un développeur solide mais susceptible » | Cas réel — Google mesure le « pushback » en revue de code (2020) | https://research.google/pubs/predicting-developers-negative-feelings-about-code-review/ ; https://storage.googleapis.com/gweb-research2023-media/pubtools/5495.pdf |
| `pages/equipe/lecon-06.html#1` | une équipe qui adopte un formateur | Cas réel — Prettier, le formateur qui clôt les débats (2017) | https://archive.jlongster.com/A-Prettier-Formatter ; https://prettier.io/docs/why-prettier ; https://prettier.io/docs/option-philosophy |
| `pages/equipe/lecon-07.html#1` | Théo et le commit « maj » | Cas réel — le noyau Linux veut un changement par correctif (2014) | https://docs.kernel.org/process/submitting-patches.html (et le .rst brut) ; https://github.com/torvalds/linux/commit/7994cc15d83c6188a77516f4c8400d3a4965b0a5 (date de la phrase sur git bisect, absente des versions v3.0 à v3.19, présente en v4.0) |
| `pages/equipe/lecon-08.html#1` | la PR de 800 lignes de Sam | Cas réel — chez Google, de petits changements relus vite (2018) | https://sback.it/publications/icse2018seip.pdf |
| `pages/equipe/lecon-09.html#1` | Théo et la page de wiki périmée | Cas réel — Google sort sa documentation du wiki (2020) | https://abseil.io/resources/swe-book/html/ch10.html ; https://abseil.io/resources/swe-book |
| `pages/equipe/lecon-10.html#1` | la migration promise « en une semaine » | Cas réel — Ron Jeffries regrette les « story points » (2019) | https://ronjeffries.com/articles/019-01ff/story-points/Index.html |
| `pages/equipe/lecon-11.html#1` | Léa et le registre DETTE.md | Cas réel — Ward Cunningham et la dette de WyCash (1992) | http://c2.com/doc/oopsla92.html |
| `pages/equipe/lecon-12.html#1` | la plateforme de billetterie du vendredi | Cas réel — Fastly endigue d'abord, corrige ensuite (2021) | https://www.fastly.com/blog/summary-of-june-8-outage |
| `pages/equipe/lecon-13.html#1` | « deux entreprises », la commande sur le mauvais serveur (B2 : INVÉRIFIABLE) | Cas réel — Joyent, une commande mal tapée et un opérateur gardé (2014) | http://web.archive.org/web/20140531132417/http://www.joyent.com:80/blog/postmortem-for-outage-of-us-east-1-may-27-2014 ; https://news.ycombinator.com/item?id=7807074 ; https://news.ycombinator.com/item?id=7813959 (retrouvés par l'API de recherche de Hacker News) |
| `pages/equipe/lecon-14.html#1` | « une jeune équipe » qui saute le cycle | Cas réel — le bilan de santé des équipes de Spotify (2014) | https://engineering.atspotify.com/2014/09/squad-health-check-model |

## Décomptes

| | `c` | `equipe` | total |
|---|---:|---:|---:|
| « Cas réel » lus | 21 | 14 | 35 |
| VRAI | 1 | 0 | 1 |
| INEXACT | 3 | 0 | 3 |
| INVÉRIFIABLE | 12 | 14 | 26 |
| sujet réel gardé par un autre cours ou en double dans le cours | 5 | 0 | 5 |
| INVENTÉ (fiction présentée comme réelle, sans s'annoncer) | 0 | 0 | 0 |
| remplacés | 18 | 14 | 32 |
| gardés et corrigés | 3 | 0 | 3 |
| renommés « Scénario » | 0 | 0 | 0 |

Les quatorze récits d'`equipe` sont classés INVÉRIFIABLES (récits anonymes) ; quatre d'entre eux mettent
en scène les personnages fictifs du fil rouge et seraient INVENTÉS à la lecture stricte de B2 (une fiction
du cours présentée comme réelle, comme Carnet en `mobile` ou Vélociti en `data-eng`).

## Lexique des QCM

`lexique-diff.js` (calcul rejoué par `lexdiff-local.js`) : **51 écarts** au premier jet (22 en `c`,
29 en `equipe`), ramenés à **6**, tous expliqués :
- « source » GAGNÉ dans `c/lecon-11`, `equipe/lecon-03` et `equipe/lecon-08` : il entre par la classe
  obligatoire `cas-reel__source` (même cas qu'aux lots 2 et 3).
- « retrouve », « précise », « restent » GAGNÉS dans `c/lecon-11`, **voulus** : le « source » de la
  classe retirait un mot étranger à la seule bonne réponse de la question 2 (4/4/4/4 → 3/4/4/4) ; un mot
  de chaque distracteur remis dans le récit de Heartbleed rétablit l'égalité (3/3/3/3, règle du `k`).
- `mesure-lexique-qcm.js --liste=c` : « 0 exploitable sur 71, 26 retournées, 32 à mettre en forme »,
  identique à la base ; seule différence, le décompte de cette question (k = 3 au lieu de 4, tenu).
  `--liste=equipe` : « 61 exploitables sur 68 » avant comme après (cours non traité) ; deux distracteurs
  perdent un mot étranger (« source »), ce qui va vers la cible (k = 0), sans changer aucune désignation.
- Les autres écarts ont été fermés en reformulant les encadrés (jamais les QCM) : mots d'options sortis
  avec l'ancien récit remis dans une phrase vraie (« recompilation », « distributions », « double »,
  « laissé », « pousse », « fonctionnels », « révèlent », « muette », « garanti », « attendu »,
  « pendant », « prévenir », « réalité », « compte », « devient », « élégance », « brillant »,
  « réécrire », « personnes », « passer », « argumenter », « fonctions », « désigne », « suivant »,
  « chacun », « réelle », « qualité », « premières », « répéter », « décision », « pression »…), mots
  d'options entrés remplacés (« dépend », « rendent », « version », « compilateur », « navigateur »,
  « recrues », « collègues », « fichiers », « heures », « obsolètes », « devenus », « servir »,
  « développement »…).

## Contrôles (dernier état)

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=c` | **0** (21/21 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=equipe` | **0** (14/14 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées (inchangé, légitimes) |
| CR dans les 35 pages (node) | 0 |
| `node tools/verif.js --rapide` | 1 — **52 étapes OK sur 54**, 467,6 s ; les 2 signalées sont les rouges tolérés |

`verif.js --rapide` : seules `donnees` (invariant I18, « 1 index publié divergent du contenu regénéré »,
l'index de recherche périmé par les nouveaux textes) et `doc-rec` (chiffres de `doc/lecon-04` mesurés
sur tout le site, que les nouvelles lignes de source font bouger) signalent ; l'orchestrateur les
régénère après la fusion. `doc-ref`, `normatf`, `qcmlexi`, `qcmbiai`, `domaine` et toutes les autres
étapes sont vertes.

## Ce qui reste ouvert

- **Sources prises dans l'Internet Archive** : la réponse officielle de Microsoft sur le Zune et sa FAQ
  (zune.net n'existe plus), l'avis CA-2002-07 du CERT, le post-mortem de Joyent (l'adresse actuelle,
  tritoncloud.io, répond 404). Ce sont des copies de documents primaires, pas de la presse.
- **Liens qui refusent un client automatique** au moment de la vérification finale (ils ont été ouverts
  plus tôt dans la séance) : `aegis.sourceforge.net` (403), `hacks.mozilla.org` (403), `gnu.org` (403),
  `microsoft.com/msrc` (403), `web.archive.org` (429) ; la contre-relecture devra peut-être les ouvrir
  sans en-tête `User-Agent` ou plus tard.
- `lore.kernel.org` et `lkml.org` sont protégés par Anubis : les citations du noyau passent par les
  commits de fusion sur GitHub, qui reprennent le texte des demandes d'intégration.
- **Hors encadré** (non traité, signalé) : `c/lecon-21` garde en récapitulatif « c'est la philosophie
  Unix » (vrai, sans prétention de cas) ; le corps d'`equipe/lecon-01` donne « une ligne de code est lue
  dix fois pour une fois qu'elle est écrite » comme une estimation « courante », sans source. (Les
  intertitres de `c/lecon-20` et `-21` avaient une espace ordinaire devant « : » : corrigée avec eux.)
- **Pour le registre `foyers.md`** : ver Morris → `c/lecon-09` (le remplacer en `asm/lecon-10` n'est plus
  utile, l'agent asm a pris SQL Slammer) ; Heartbleed → `c/lecon-11` ; Gangnam Style reste raconté par
  `haskell/lecon-02` (lot 8), sourcé par la presse seulement ; le pilote tun et GCC → `asm/lecon-08`.
- **Outil** : comme aux lots 2 et 3, `lexique-diff.js` compte le « source » de la classe obligatoire ;
  l'ignorer (attribut `class` et ligne de source) éviterait trois faux écarts par lot.
