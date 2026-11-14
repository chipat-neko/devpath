# Rapport V18 — case B7, lot 4 : les cours `bash` et `asm` (copie `b7-bash-asm`, branche `v18/b7-bash-asm`)

Copie de travail `D:\test-claude-b7-bash-asm`, partie de `13eabe3`. Part traitée : les **31 « Cas réel »**
des cours `bash` (16, un par leçon) et `asm` (15, un par leçon). Scripts et pièces dans
`scratchpad/b7-bash-asm/` (ignoré par git) : `new/<cours>__<NN>.html` (les 31 corps d'encadrés),
`apply.js` (remplace du titre de l'encadré au `</div></div>` final, refuse un remplacement ambigu, prouve
que les octets hors de l'encadré sont identiques et refuse tout CR), `fix1.py`, `fix2.py` (retouches
lexicales), `mots.js`, `qcmmots.js` (mots d'options de QCM présents dans la page), tests rejoués
(`steam-test.sh`, `shellshock-test.sh`, `patsub-test.sh`, `nullcheck.c`, `div10.c`, `hello.c`,
`vec.c`, `vec2.c`, `godbolt.js`, `verneed.py`, `versym.py`), PDF ouverts et leur texte extrait
(`p471.txt`, `awk9.txt`, `cisa.txt`, `skeel.txt`, `divcnst.txt`, `paoloni.txt`, `wer.txt`,
`automemcpy.txt`, `cert2003.txt`), `outils/` (Zig 0.14.1 officiel portable, avec glibc et musl).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **16 hors de la règle à 0** pour
`bash` et de **15 à 0** pour `asm` ; sur les 31 cas trouvés, **0 était VRAI tel quel et libre** :
23 INVÉRIFIABLES (récits anonymes, usages généraux), 7 sujets réels nommés mais INEXACTS (dont les deux
GitLab, sujet du foyer `iac/lecon-05`), 1 VRAI dont le foyer est ailleurs (le ver Morris, `c/lecon-09`) ; **28 remplacés**
par un cas réel daté et sourcé sur la même notion, **3 corrigés sur leur sujet** (`bash/06` Steam,
`asm/08` CVE-2009-1897, `asm/09` Patriot), **0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b7-bash-asm`) : `0de7133` (bash, 16 cas), `9570aa7` (asm, 15 cas), puis le
commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`,
  icône, structure gardés). Aucun intertitre `<h2>`/`<h3>` n'est collé au-dessus de ces 31 encadrés
  (vérifié page par page) : rien d'autre à retoucher.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » ; dans le `<code>`, `<` écrit `&lt;`.
- Longueur du corps (hors titre et source, code compris) : 144 à 223 mots — un peu au-dessus de la cible
  pour une dizaine de cas, parce que chaque affirmation garde sa précision (date, chiffre, version).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et URL),
  dans les réservations des lots 2 et 3 et dans le fichier commun `b7-reservations.txt`, où les 31 sujets
  sont inscrits (deux lignes « REMPLACE ma ligne » : `asm/15`, de dav1d à automemcpy ; `asm/12`, de
  « glibc 2.34 » au ticket Go 60937). Sujets **écartés** parce qu'un autre cours les raconte ou les a
  réservés : GitLab 2017 (`iac/lecon-05`), le ver Morris (réservé par `c/lecon-09` au même lot), Spectre
  et Meltdown (`js/lecon-56`), l'avis zlib de 2002 (réservé par `c/lecon-12`), l'incendie d'OVHcloud
  (`cloud/lecon-02`). `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes).
- **Comportements rejoués** (« un comportement technique se TESTE ») : Bash 5.3.9 (Git Bash), Zig 0.14.1
  (`zig cc`, Clang/LLVM 19), Compiler Explorer (GCC 11.4 et 12.1, x86-64), et un lecteur ELF écrit pour
  l'occasion (`verneed.py`, `versym.py`). Résultats ci-dessous.
- Mots d'options de QCM : `lexique-diff.js` a signalé 10 écarts (bash) puis 5 (asm) après le premier jet ;
  tous ramenés à 0 en remettant le mot dans une phrase exacte de l'encadré (« échouer », « réduit »,
  « absolu », « refuse », « l'utilisateur », « lancée », « ensuite », « interdire », « valide »,
  « maintenable ») ou en retirant le mot entré (« montre », « réclame », « troisième », « termine »,
  « planter »).

## Cas par cas — `bash`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/bash/lecon-01.html#1` | INVÉRIFIABLE — usage général (« un site web », serveur anonyme) | remplacé par : macOS 10.15 passe de bash à zsh | Cas réel — macOS Catalina passe de bash à zsh (2019) | https://support.apple.com/en-us/102360 ; https://support.apple.com/en-us/103107 ; https://www.apple.com/newsroom/2019/10/macos-catalina-is-available-today/ |
| `pages/bash/lecon-02.html#1` | INVÉRIFIABLE — récit anonyme (script de sauvegarde en cron) | remplacé par : UsrMove de Fedora 17, /bin devenu un lien vers usr/bin | Cas réel — Fedora 17 range /bin dans /usr (2012) | https://fedoraproject.org/wiki/Features/UsrMove ; (date de la bêta : https://www.redhat.com/en/blog/fedora17-beefy-miracle-beta-release-now-available-for-taste-testing) |
| `pages/bash/lecon-03.html#1` | sujet réel, foyer `iac/lecon-05` (GitLab 2017 ; INEXACT selon B2 : `rm -rf` n'est pas dans la source) | remplacé par : Bumblebee, l'espace de trop dans `rm -rf /usr /lib/…` | Cas réel — Bumblebee et l'espace de trop (2011) | https://github.com/MrMEEE/bumblebee-Old-and-abbandoned/issues/123 ; https://github.com/MrMEEE/bumblebee-Old-and-abbandoned/commit/a047be85247755cdbe0acce6f1dafc8beb84f2ac ; https://github.com/MrMEEE/bumblebee-Old-and-abbandoned (README) |
| `pages/bash/lecon-04.html#1` | INVÉRIFIABLE — récit anonyme (log d'accès, « 40 000 requêtes ») | remplacé par : la critique de McIlroy, `tr | sort | uniq -c | sort -rn | sed` | Cas réel — Knuth, McIlroy et six commandes en tuyau (1986) | https://cs61.seas.harvard.edu/site/pdf/p471-bentley.pdf (CACM 29(6), p. 471-483 ; pipeline p. 480) |
| `pages/bash/lecon-05.html#1` | INVÉRIFIABLE — usage général (`pg_dump` daté) | remplacé par : le Bash Uploader de Codecov, `$(env)` envoyé à un serveur tiers | Cas réel — Le Bash Uploader de Codecov modifié (2021) | https://about.codecov.io/security-update/ |
| `pages/bash/lecon-06.html#1` | INEXACT — produit nommé : `steam.sh` est le script de lancement, pas « d'installation » ; ont disparu les fichiers du compte (disque externe compris), pas « tout le disque » ; la cause (le `cd` qui échoue) n'est qu'une hypothèse du ticket | corrigé (foyer du sujet Steam ; `bash/11` le racontait aussi) | Cas réel — Steam pour Linux et la variable vide (2015) | https://github.com/ValveSoftware/steam-for-linux/issues/3671 |
| `pages/bash/lecon-07.html#1` | INVÉRIFIABLE — usage général nommé (« chaque service Linux », « des millions de serveurs ») | remplacé par : le modèle `/etc/init.d/skeleton` de Debian wheezy, la charte Debian, puis Jessie et systemd | Cas réel — Les scripts init.d de Debian, jusqu'à « Jessie » (2015) | https://sources.debian.org/src/sysvinit/2.88dsf-41+deb7u1/debian/src/initscripts/etc/init.d/skeleton/ ; https://sources.debian.org/src/sysvinit/ ; https://www.debian.org/doc/debian-policy/ch-opersys.html ; https://chronicles.debian.org/www/News/2015/20150426 |
| `pages/bash/lecon-08.html#1` | INVÉRIFIABLE — récit anonyme (cron et PATH) | remplacé par : Shellshock, CVE-2014-6271 | Cas réel — Shellshock, la faille des fonctions exportées (2014) | https://www.openwall.com/lists/oss-security/2014/09/24/10 ; fiche NVD de CVE-2014-6271 lue par l'API (https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2014-6271) ; https://ftp.gnu.org/gnu/bash/bash-4.3-patches/bash43-025 ; https://ftp.gnu.org/gnu/bash/bash-4.3-patches/bash43-027 |
| `pages/bash/lecon-09.html#1` | INVÉRIFIABLE — récit anonyme (« un soir d'incident ») | remplacé par : le rapport awk de 1978 (motif { action }, BEGIN, END) | Cas réel — Aho, Kernighan et Weinberger décrivent awk (1978) | https://plan9.io/sources/contrib/steve/other-docs/awk.pdf ; https://www.awk.dev/awk.spe.pdf |
| `pages/bash/lecon-10.html#1` | INVÉRIFIABLE — récit anonyme (`kill -9`, base qui ne redémarre pas) | remplacé par : systemd 230 et `KillUserProcesses=yes` | Cas réel — systemd 230 nettoie les sessions à la déconnexion (2016) | https://raw.githubusercontent.com/systemd/systemd/main/NEWS (« CHANGES WITH 230 », 2016-05-21) ; https://www.fedoraproject.org/wiki/Changes/KillUserProcesses_by_default ; https://www.freedesktop.org/software/systemd/man/latest/logind.conf.html |
| `pages/bash/lecon-11.html#1` | INEXACT, et doublon interne de `bash/06` (Steam) | remplacé par : Ubuntu 6.10 « Edgy », `/bin/sh` vers dash, ticket 61463 | Cas réel — Ubuntu « Edgy » confie /bin/sh à dash (2006) | https://bugs.launchpad.net/ubuntu/+source/dash/+bug/61463 ; https://launchpad.net/ubuntu/edgy |
| `pages/bash/lecon-12.html#1` | sujet réel, foyer `iac/lecon-05` (GitLab ; INEXACT selon B2 : la recommandation citée n'est pas celle du post-mortem) | remplacé par : l'installateur d'iTunes 2.0, `rm -rf $2Applications/iTunes.app` | Cas réel — L'installateur d'iTunes 2 et la variable non quotée (2001) | https://tidbits.com/2001/11/12/itunes-2-installer-debacle/ ; https://lists.debian.org/debian-devel/2001/11/msg00312.html |
| `pages/bash/lecon-13.html#1` | INVÉRIFIABLE — récit anonyme (renommage de fichiers « des minutes aux secondes ») | remplacé par : Bash 5.2 et l'option `patsub_replacement` | Cas réel — Bash 5.2 donne un sens au « & » des remplacements (2022) | https://git.savannah.gnu.org/cgit/bash.git/plain/NEWS ; https://git.savannah.gnu.org/cgit/bash.git/plain/doc/bash.1 ; https://ftp.gnu.org/gnu/bash/ (bash-5.2.tar.gz, 2022-09-26) |
| `pages/bash/lecon-14.html#1` | INVÉRIFIABLE — usage général (codes HTTP comptés) | remplacé par : Bash 4.0 ajoute les tableaux associatifs et `mapfile` | Cas réel — Bash 4.0 apporte les tableaux associatifs et mapfile (2009) | https://git.savannah.gnu.org/cgit/bash.git/plain/NEWS ; https://ftp.gnu.org/gnu/bash/ (bash-4.0.tar.gz, 2009-02-20) |
| `pages/bash/lecon-15.html#1` | INVÉRIFIABLE — usage général (heredocs « partout ») | remplacé par : les heredocs dans les Dockerfile | Cas réel — Les heredocs entrent dans les Dockerfile (2021) | https://www.docker.com/blog/introduction-to-heredocs-in-dockerfiles/ |
| `pages/bash/lecon-16.html#1` | INVÉRIFIABLE — conseil général (règle 3-2-1 sans source ; B2 l'avait jugé INVÉRIFIABLE) | remplacé par : la fiche « Data Backup Options » de l'US-CERT | Cas réel — L'US-CERT et la règle de sauvegarde 3-2-1 (2012) | https://www.cisa.gov/sites/default/files/publications/data_backup_options.pdf |

### Tests rejoués — `bash` (Bash 5.3.9, Git Bash)

- `STEAMROOT="$(cd /chemin/inexistant && echo $PWD)"` : sans option, la suite tourne et la ligne
  devient `rm -rf "/"*` (affichée, pas exécutée) ; avec `set -e`, le script sort en code 1 ; avec
  `set -u` seul, il continue ; `[ -n "$STEAMROOT" ] || exit 1` refuse (`bash/06`).
- `env x='() { :;}; echo VULNERABLE' bash -c 'echo test'` n'affiche que `test` ; après
  `export -f salut`, `env` montre `BASH_FUNC_salut%%=() {  echo "bonjour"` et un Bash enfant appelle
  `salut` (`bash/08`).
- `shopt patsub_replacement` vaut `on` ; `${x/tom/[&]}` → `[tom] et jerry` ; `${x/tom/Tom & Co}` →
  `Tom tom Co et jerry` ; avec `shopt -u`, avec `\&` ou avec `"$r"` : `Tom & Co et jerry` (`bash/13`).

## Cas par cas — `asm`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/asm/lecon-01.html#1` | INEXACT — Spectre et Meltdown tiennent à l'exécution spéculative de la microarchitecture, pas « au niveau des instructions » ; « impossible de les comprendre sans lire l'assembleur » est une opinion ; sujet déjà raconté par `js/lecon-56` | remplacé par : la FFmpeg School of Assembly Language | Cas réel — FFmpeg ouvre son « école de l'assembleur » (2025) | https://github.com/FFmpeg/asm-lessons ; https://github.com/FFmpeg/asm-lessons/commit/383705603073e403ba2fac024a4687339aea826d ; texte de la première version (raw.githubusercontent.com/…/383705603073…/lesson_one/index.md) ; date du commit par l'API GitHub (25/01/2025) |
| `pages/asm/lecon-02.html#1` | INVÉRIFIABLE — usage général (division par une constante) | remplacé par : Granlund et Montgomery, PLDI 1994 | Cas réel — Granlund et Montgomery, la division par une constante (1994) | https://gmplib.org/~tege/divcnst-pldi94.pdf ; https://gmplib.org/~tege/ |
| `pages/asm/lecon-03.html#1` | INVÉRIFIABLE — illustration générale (« des CVE de ce type reviennent chaque année ») | remplacé par : l'avis FreeBSD-SA-02:38, entiers signés | Cas réel — FreeBSD et les longueurs négatives (2002) | https://www.freebsd.org/security/advisories/FreeBSD-SA-02:38.signed-error.asc |
| `pages/asm/lecon-04.html#1` | INVÉRIFIABLE — illustration générale ; cite le ver Morris (réservé par `c/lecon-09`) | remplacé par : « Smashing The Stack For Fun And Profit » | Cas réel — « Smashing The Stack For Fun And Profit » (1996) | https://phrack.org/issues/49/smashing-the-stack-for-fun-and-profit.html |
| `pages/asm/lecon-05.html#1` | INVÉRIFIABLE — récit anonyme (« une équipe », `movaps` en production) | remplacé par : nolibc, le `push %eax` qui désaligne la pile de `_start` | Cas réel — nolibc et le push qui désaligne la pile (2023) | https://lists.openwall.net/linux-kernel/2023/08/30/39 ; https://github.com/torvalds/linux/commit/d873a364ef2182af40110869f9c62813ce6f9386 ; fusion en ligne principale par l'API GitHub (merge `84186fcb`, 23/10/2023) |
| `pages/asm/lecon-06.html#1` | INVÉRIFIABLE — récit anonyme (« le script cent fois trop lent ») | remplacé par : `gettimeofday` et `clock_gettime` sans vDSO sur EC2 | Cas réel — Deux appels système bien plus lents sur AWS EC2 (2017) | https://blog.packagecloud.io/eng/2017/03/08/system-calls-are-much-slower-on-ec2/ |
| `pages/asm/lecon-07.html#1` | INVÉRIFIABLE — usage général (boutisme réseau) | remplacé par : Danny Cohen, IEN 137 | Cas réel — Danny Cohen baptise les « Big-Endians » (1980) | https://www.rfc-editor.org/ien/ien137.txt |
| `pages/asm/lecon-08.html#1` | INEXACT — événement daté, juste sur le fond ; « c'est en relisant cet asm qu'on a compris le problème » n'est dans aucune source | corrigé et sourcé | Cas réel — CVE-2009-1897, le test que GCC a supprimé (2009) | https://lwn.net/Articles/342330/ ; https://lwn.net/Articles/342420/ ; https://github.com/torvalds/linux/commit/3c8a9c63d5fd738c261bd0ceece04d9c8357ca13 ; fiche NVD lue par l'API (https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2009-1897) |
| `pages/asm/lecon-09.html#1` | INEXACT — événement daté (foyer, vérifié à fond) : le temps n'était pas converti « en flottant » mais multiplié par 0,1 en **virgule fixe sur 24 bits** (puis converti en flottant de 48 bits) ; l'erreur ne « s'accumulait » pas à chaque top, elle est proportionnelle au compteur, et la cause réelle est une conversion précise ajoutée à certains endroits seulement, si bien que l'écart entre deux impulsions radar ne s'annulait plus (Skeel) | corrigé et sourcé (GAO + Skeel) ; 25/02/1991, 28 morts, plus de 100 h, 0,3433 s et 687 m confirmés | Cas réel — Le Patriot de Dhahran et le dixième de seconde (1991) | https://www.gao.gov/products/imtec-92-26 ; https://www.gao.gov/assets/imtec-92-26.pdf (PDF scanné, illisible sans OCR) ; texte intégral https://www.globalsecurity.org/space/library/report/gao/im92026.htm ; https://www-users.cse.umn.edu/~arnold/disasters/Patriot-dharan-skeel-siam.pdf ; https://www-users.cse.umn.edu/~arnold/disasters/patriot.html |
| `pages/asm/lecon-10.html#1` | VRAI selon B2, mais foyer du ver Morris réservé par `c/lecon-09` (raconté aussi par `c/lecon-06` et `asm/04`) | remplacé par : le ver SQL Slammer | Cas réel — Le ver SQL Slammer (2003) | https://www.sei.cmu.edu/documents/510/2003_019_001_496200.pdf (CA-2003-04) ; https://www.kb.cert.org/vuls/id/484891 ; https://www.caida.org/catalog/papers/2003_sapphire/ ; https://learn.microsoft.com/en-us/security-updates/securitybulletins/2002/ms02-039 |
| `pages/asm/lecon-11.html#1` | INVÉRIFIABLE — récit anonyme (« un service en production plante une fois par jour ») | remplacé par : Windows Error Reporting, SOSP 2009 | Cas réel — Windows Error Reporting, l'autopsie à grande échelle (2009) | https://cs.uwaterloo.ca/~m2nagapp/courses/CS846/1171/papers/glerum_sosp09.pdf |
| `pages/asm/lecon-12.html#1` | INVÉRIFIABLE (verdict de B2 confirmé) — récit anonyme (« une équipe », musl, 900 Ko) | remplacé par : le ticket Go 60937 (GLIBC_2.34 introuvable sur Debian 11), expliqué par la glibc 2.34 | Cas réel — Un binaire Go compilé sur Debian 12 refuse Debian 11 (2023) | https://github.com/golang/go/issues/60937 ; https://raw.githubusercontent.com/bminor/glibc/glibc-2.34/NEWS ; https://ftp.gnu.org/gnu/glibc/ (glibc-2.34.tar.xz, 2021-08-01) |
| `pages/asm/lecon-13.html#1` | INVÉRIFIABLE — récit anonyme (boucle de luminance, 12 ms → 0,8 ms) | remplacé par : GCC 12 vectorise à `-O2` | Cas réel — GCC 12 vectorise dès -O2 (2022) | https://gcc.gnu.org/gcc-12/changes.html ; https://gcc.gnu.org/releases.html |
| `pages/asm/lecon-14.html#1` | INVÉRIFIABLE — récit anonyme (« une équipe », `rdtsc`) | remplacé par : le livre blanc d'Intel sur la mesure en cycles (Paoloni) | Cas réel — Intel et la bonne façon de lire rdtsc (2010) | https://cis.temple.edu/~qzeng/cis3207-spring18/files/ia-32-ia-64-benchmark-code-execution-paper.pdf (l'URL d'Intel renvoie vers une page 404) |
| `pages/asm/lecon-15.html#1` | INVÉRIFIABLE — illustration générale (« un développeur de bibliothèque ») | remplacé par : automemcpy (Google, ISMM 2021) | Cas réel — Chez Google, memcpy réécrit en C++ plutôt qu'en assembleur (2021) | https://research.google/pubs/automemcpy-a-framework-for-automatic-generation-of-fundamental-memory-operations/ ; https://storage.googleapis.com/gweb-research2023-media/pubtools/6156.pdf |

### Tests rejoués — `asm`

- **Division par 10** (`div10.c`, `zig cc -target x86_64-linux-gnu -O2`) : `x / 10` signé → `imul rax, rax, 1717986919`,
  `shr rcx, 63`, `sar rax, 34`, `add` (aucun `idiv`) ; non signé → `imul` par 3435973837 et `shr 35` ;
  `x * 20` → `shl edi, 2` puis `lea eax, [rdi + 4*rdi]` ; division par une variable → `cdq` + `idiv` (`asm/02`).
- **Test de pointeur nul** (`nullcheck.c`, même forme que `tun_chr_poll`) : à `-O2`, `poll_bug` = deux `mov`
  et `ret`, aucun `test rdi, rdi` ; avec `-fno-delete-null-pointer-checks`, `test rdi, rdi` / `je` reviennent (`asm/08`).
- **Vectorisation** (Compiler Explorer, x86-64) : `for (i < 1024) a[i] += b[i]` sur tableaux globaux, `-O2` :
  GCC 11.4 → `mov`/`add` scalaires ; GCC 12.1 → `movdqa`/`paddd`/`movaps`. Même boucle avec `n` inconnu et
  pointeurs `restrict` : GCC 12.1 `-O2` scalaire, `-O3` vectorisé (`movdqu`/`paddd`) avec code de fin (`asm/13`).
- **glibc 2.34** (`hello.c` : un thread + `puts` ; Zig 0.14.1 officiel) : contre `x86_64-linux-gnu.2.34` →
  NEEDED `libc.so.6` seul, `__libc_start_main`, `pthread_create`, `pthread_join` en **GLIBC_2.34** ;
  contre `.2.17` (`-lpthread`) → NEEDED `libpthread.so.0` et `libc.so.6`, tout en GLIBC_2.2.5 ; contre
  `x86_64-linux-musl -static` → aucune section `.dynamic` (913 976 octets, non strippé) (`asm/12`).
  Le Zig portable commun (`D:/test-claude/scratchpad/outils-portables/zig-0.14.1`) ne contient que la libc
  mingw : l'archive officielle a été téléchargée dans mon scratchpad.

## Décomptes

| | lus | VRAI tel quel | INEXACT | INVÉRIFIABLE | INVENTÉ | remplacés | corrigés | gardés | « Scénario » |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `bash` | 16 | 0 | 4 (Steam ×2, GitLab ×2 selon B2) | 12 | 0 | 15 | 1 | 0 | 0 |
| `asm` | 15 | 1 (Morris, foyer ailleurs) | 3 (Spectre, CVE-2009-1897, Patriot) | 11 | 0 | 13 | 2 | 0 | 0 |
| **total** | **31** | **1** | **7** | **23** | **0** | **28** | **3** | **0** | **0** |

Les deux GitLab n'ont pas été revérifiés à fond (sujet du foyer `iac/lecon-05`, remplacés d'office) : leur
état est celui de B2 pour `bash/12`, et le même récit pour `bash/03`.

## Contrôles (codes de sortie, sur la branche commitée)

| Contrôle | Code | Détail |
|---|---:|---|
| `node tools/verif-contenu.js --cas-reel --cours=bash` | 0 | 16 lus, 16 conformes |
| `node tools/verif-contenu.js --cas-reel --cours=asm` | 0 | 15 lus, 15 conformes |
| `node tools/verif-contenu.js --strict` | 0 | toutes les leçons tiennent le standard (1 maigre, 0 redondance) |
| `node tools/verif-html.js` | 0 | aucun problème |
| `node tools/verif-domaines-interdits.js` | 0 | aucune référence réelle |
| `node tools/verif-qcm-lexique.js` | 0 | l'indice lexical n'a empiré nulle part |
| `node tools/verif-qcm-biais.js` | 0 | aucun cours n'a empiré |
| `node tools/cas-reels/lots/lexique-diff.js D:/test-claude-b7-bash-asm 13eabe3` | 0 | 31 pages, **0 écart** |
| `node tools/cas-reels/lots/doublons.js` | 0 | 2 sources partagées (les deux légitimes connues) |
| `node tools/cas-reels/lots/controle-branche.js D:/test-claude-b7-bash-asm 13eabe3` | 0 | 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », 31 zones avant et après, types gardés, signatures |
| `node tools/verif.js --rapide` | 1 | 54 étapes, **2 signalées, les deux tolérées** : `donnees` (I18 : `search-index.js` périmé, écart +5 660 o — l'orchestrateur régénère) et `doc-rec` (« 742 citent la source » : chiffre de `doc/lecon-04` que mes lignes de source font bouger). `doc-ref`, `qcmlexi`, `qcmbiai`, `rj-bash` et les 49 autres : OK. 474,6 s |

## Ce qui reste ouvert, et les doutes

- **Presse au lieu du primaire** : `bash/12` (iTunes 2) s'appuie sur TidBITS (Adam Engst, 12/11/2001) pour
  l'explication et la date, et sur un message de debian-devel pour la ligne du script : l'alerte d'Apple
  de novembre 2001 est introuvable en ligne.
- **Copies hébergées par des tiers** : le livre blanc d'Intel (`asm/14`, URL d'Intel morte), le rapport du
  GAO (`asm/09`, PDF officiel scanné : texte lu sur globalsecurity.org, page produit ouverte sur gao.gov),
  la lettre de Skeel (copie de l'université du Minnesota), la CACM de 1986 (`bash/04`, copie de Harvard),
  l'article de WER (`asm/11`, copie de Waterloo).
- **Dates tirées d'un serveur** : bash-4.0, bash-5.2 et glibc-2.34 datés par le listing de ftp.gnu.org ;
  la première leçon de FFmpeg (`asm/01`) et la fusion du correctif nolibc (`asm/05`) par l'API de GitHub.
- **`asm/14`** : le livre blanc écrit « depuis le Pentium » pour l'exécution dans le désordre (en fait, le
  Pentium Pro) ; l'encadré dit seulement « la plupart des processeurs Intel ». La phrase sur `volatile`
  (« ne s'adresse qu'au compilateur ») vient de la leçon, pas du livre blanc.
- **`bash/08`** : la dernière phrase (cron, PATH réduit, chemin absolu) relie le cas à la section où se
  trouve l'encadré et garde deux mots d'options de QCM ; elle ne parle pas de Shellshock.
- **`asm/12`** : « le chargeur refuse » repose sur le ticket Go (messages d'erreur cités) ; le passage de
  GLIBC_2.2.5 à GLIBC_2.34 est rejoué avec Zig, pas sur une machine Debian 11.
- Longueur : une dizaine de corps dépassent un peu 180 mots (au plus 223, `asm/14`).
