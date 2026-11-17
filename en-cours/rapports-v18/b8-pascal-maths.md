# Rapport V18 — case B8, lot 5 : les cours `pascal` et `maths` (copie `b8-pascal-maths`, branche `v18/b8-pascal-maths`)

Copie de travail `D:\test-claude-b8-pascal-maths`, partie de `d86be7b`. Part traitée : les **27 « Cas réel »**
des cours `pascal` (14 encadrés, un par leçon) et `maths` (13 : onze **sections** `<h2>`/`<h3>` et deux
encadrés, `lecon-12` et `lecon-13`). Scripts et pièces dans `scratchpad/b8-pascal-maths/` (ignoré par git) :
`dump.js` (cas et contexte), `optmots.js` (mots d'options de QCM présents ou absents de la page),
`runcode.js` (rejoue un bloc de code JavaScript d'une page), `restaure.js` (reprend les octets de la base
hors de la zone d'un cas), les scripts `m01.py` à `m13.py` (remplacements exacts, refusés s'ils ne sont pas
uniques), et les PDF et pages ouverts (lus avec `pypdf` quand l'outil web ne les lisait pas).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **14 hors de la règle à 0** pour
`pascal` et de **13 à 0** pour `maths`. Sur les 27 cas, **aucun n'était VRAI et sourcé tel quel** :
**25 remplacés** par un cas réel daté et sourcé sur la même notion, **2 corrigés sur leur sujet**
(`pascal/09` Total Commander, `maths/08` les clés RSA à facteur commun), **0 « Scénario »**.

**Commits** : `d15842f` (pascal, 14 cas), `b11ed28` (maths, 13 cas), puis ce rapport.

## Méthode

- Encadrés : seul l'intérieur du `div.callout__body` change (type `note` gardé). Sections : de l'intertitre
  au `<h2>`/`<h3>` suivant, comme le lit `extraction.js` ; le récit réel ouvre la section, la démonstration
  de la leçon (programme, sortie, explications) est gardée, la ligne de source ferme la section.
- **Chaque programme d'une section touchée a été rejoué** (Node 24) et sa sortie comparée à la sortie
  affichée : `simplifier.js` (16 cas, 5 écarts, 8 → 4 occurrences), `garde-api.js` (six verdicts, le
  `TypeError` exact), `bayes.js`, `congruences.js` (10 000/10 000, 157 sur 229, 229/229, 10^15 mod 7 = 6),
  `cles-partagees.js` (780 paires, 10 878 étapes, 1 008 divisions ; 5 étapes d'Euclide pour la paire),
  `dependances.js` (3 cycles, 7 arêtes, 1 seule débloque), `cout.js` (535 040 ; 778 ; 535 818 ; 6,85·10^7),
  `solution-2.js` de `maths/12` (12 405 398 ; 10 000 ; 1 241 ; 4,03), `arbres.js` (2 500,5 ; 11,36 ; 220).
  Recalculés en Python 3.14 : Bayes d'Axelsson (0,6667 ; 0,5833 ; 0,0196), 1 024 semaines = 7 168 jours
  = 19,62 ans, les 15 activations de `Fib(5)` (et `Fib(3)` ×2, `Fib(2)` ×3), ⌈10^6/65 536⌉ = 16. UglifyJS :
  la forme d'origine et la forme réécrite ont la même vérité sur les 64 combinaisons, mais pas la même
  valeur (`["ligne"]` contre `true`).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md` et dans tout `pages/`, inscrit dans
  `scratchpad/v18-parallele/b8-reservations.txt` (27 lignes, aucun conflit). **Écartés** parce qu'un autre
  cours les tient : la TVA passée à 20 % en 2014 (`clojure/lecon-03`), Twitter et `id_str`
  (`formats/lecon-10`), la hashDoS et la JEP 180 (`java/lecon-11`), le Zune (`c/lecon-16`), l'Excel 2007
  et 850 × 77,1 (`js/lecon-14`), la Bourse de Vancouver (`cobol/lecon-04`), GTA Online (`algo/lecon-01`),
  coverage.py (`csharp/lecon-10`). **Écartés faute de source primaire ouvrable** : Skype écrit en Delphi,
  le « Runtime error 200 » de Turbo Pascal (seulement des FAQ de tiers), FastMM devenu le gestionnaire de
  mémoire de Delphi 2006 (docwiki d'Embarcadero inaccessible, le README de FastMM ne le dit pas), le
  compresseur « 16:1 » de WEB Technologies (FAQ inaccessible). Zeller (1882) : année hors de la plage
  1950-2039, gardé seulement comme mention.
- `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes connues). **Source
  partagée à l'intérieur du cours** : « 50 Years of Pascal » (CACM 2021) sert à `pascal/01` (le contexte
  Fortran/Cobol et l'éventail d'applications) et à `pascal/04` (paramètres et suppressions) — même
  document, sujets différents.

## Les 27 cas

### `pascal`

| cas | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/pascal/lecon-01.html#1` | INVÉRIFIABLE (produit nommé : « premières versions de Skype », Total Commander, logiciels de gestion — rien de sourcé) | remplacé | Cas réel — Pascal, pensé pour enseigner et pour bâtir des systèmes (1970) | https://people.inf.ethz.ch/wirth/projects.html ; https://web.archive.org/web/20240121103823/https://cacm.acm.org/magazines/2021/3/250705-50-years-of-pascal/fulltext (texte original : https://informatika-21.ru/wirth/Pascal50E.pdf, comparé) |
| `pages/pascal/lecon-02.html#1` | INVÉRIFIABLE (général : « un logiciel de facturation ») | remplacé | Cas réel — Wirth et le signe = de l'affectation (2006) | https://people.inf.ethz.ch/wirth/Articles/GoodIdeas.pdf (métadonnées : api.crossref.org, 10.1109/MC.2006.20) |
| `pages/pascal/lecon-03.html#1` | INVÉRIFIABLE (général : « un distributeur ») | remplacé | Cas réel — Dijkstra et le go to « nuisible » (1968) | https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD215.html |
| `pages/pascal/lecon-04.html#1` | INVÉRIFIABLE (général : fonction de TVA) | remplacé | Cas réel — les paramètres de Pascal, et ce que Wirth a retiré d'Algol (1970) | https://web.archive.org/web/20240121103823/https://cacm.acm.org/magazines/2021/3/250705-50-years-of-pascal/fulltext |
| `pages/pascal/lecon-05.html#1` | INVÉRIFIABLE (anonyme : « un logiciel de gestion scolaire ») | remplacé | Cas réel — Hoare et les indices vérifiés à chaque accès (1980) | https://www.cs.princeton.edu/courses/archive/spr10/cos333/hoare.turing.pdf (métadonnées : Crossref 10.1145/358549.358561) |
| `pages/pascal/lecon-06.html#1` | INVÉRIFIABLE (général : carnet d'adresses ; idem au B2) | remplacé | Cas réel — le Macintosh décrit ses événements en records Pascal (1983) | http://www.bitsavers.org/pdf/apple/mac/Inside_Macintosh_Vol_1_1984.pdf |
| `pages/pascal/lecon-07.html#1` | INVÉRIFIABLE (général : « le Ctrl+Z repose souvent… ») | remplacé | Cas réel — l'historique d'annulation de Vim, une liste chaînée (2006) | https://github.com/vim/vim/blob/master/src/structs.h ; https://github.com/vim/vim/blob/master/runtime/doc/version7.txt ; https://github.com/vim/vim/commit/1423b9d3b8eec56227414417621350ac27af6fd7 |
| `pages/pascal/lecon-08.html#1` | INVÉRIFIABLE (anonyme : « un logiciel de facturation d'entreprise ») | remplacé | Cas réel — Turbo Pascal 4.0 découpe un programme en unités (1987) | http://www.bitsavers.org/pdf/borland/turbo_pascal/Turbo_Pascal_Version_4.0_Owners_Manual_1987.pdf |
| `pages/pascal/lecon-09.html#1` | INEXACT (produit nommé) : « lancé en 1993 » introuvable chez l'éditeur (son journal commence à la 3.00 du 15/12/1996) ; « des millions d'utilisateurs chaque jour » et « son auteur maintient seul » sans source ; « écrit en Object Pascal (Delphi) » incomplet : la version 64 bits est compilée avec Lazarus | corrigé (gardé, réécrit sur le journal des versions) | Cas réel — Total Commander, trente ans de Delphi et de Lazarus (1996-2026) | https://www.ghisler.com/history.txt ; https://ghisler.github.io/WDX-SDK/64_bit_support.htm ; https://www.ghisler.com/imprint.htm ; https://www.ghisler.com/whatsnew.htm |
| `pages/pascal/lecon-10.html#1` | INVENTÉ (« Imagine un petit gestionnaire… ») | remplacé | Cas réel — /var/log/wtmp, un fichier d'enregistrements figé avant 2038 (2023) | https://www.thkukuk.de/blog/Y2038_glibc_wtmp_64bit/ ; https://github.com/thkukuk/utmpx/blob/main/Y2038.md ; https://man7.org/linux/man-pages/man5/utmp.5.html ; https://github.com/thkukuk/wtmpdb (README) |
| `pages/pascal/lecon-11.html#1` | INVENTÉ (« Imagine un logiciel de caisse… ») | remplacé | Cas réel — Delphi 2009 et le set of Char devenu trop petit (2008) | https://www.embarcadero.com/images/dm/technical-papers/delphi-and-unicode-marco-cantu.pdf |
| `pages/pascal/lecon-12.html#1` | INVÉRIFIABLE (général : arborescences de dossiers) | remplacé | Cas réel — Wirth : pas de récursivité quand l'itération est évidente (2004) | https://people.inf.ethz.ch/wirth/AD.pdf |
| `pages/pascal/lecon-13.html#1` | INVÉRIFIABLE (général : `TButton.Caption`, « des milliers d'applications métier ») | remplacé | Cas réel — Turbo Pascal 6.0 et la portée de private (1990) | http://www.bitsavers.org/pdf/borland/turbo_pascal/Turbo_Pascal_Version_6.0_Programmers_Guide.pdf |
| `pages/pascal/lecon-14.html#1` | INVÉRIFIABLE (général : « beaucoup de logiciels de gestion… », renvoi à Total Commander) | remplacé | Cas réel — Turbo Pascal 5.5 : des records qui héritent (1989) | http://www.bitsavers.org/pdf/borland/turbo_pascal/Turbo_Pascal_Version_5.5_Object-Oriented_Programming_Guide_1989.pdf |

### `maths`

| cas | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/maths/lecon-01.html#1` (h3) | INVENTÉ (« Le scénario suivant arrive dans toutes les équipes ») | remplacé | Cas réel — OpenSMTPD et la quatrième ligne de la table (2020) | https://www.qualys.com/2020/01/28/cve-2020-7247/lpe-rce-opensmtpd.txt ; https://seclists.org/oss-sec/2020/q1/40 (date) ; https://www.openbsd.org/errata66.html ; https://github.com/OpenSMTPD/OpenSMTPD/blob/6.6.1p1/smtpd/smtp_session.c et 6.6.2p1 (code comparé) |
| `pages/maths/lecon-02.html#1` (h2) | INVENTÉ (condition « trouvée telle quelle dans du code de production », sans source) | remplacé ; programme gardé comme exemple déclaré | Cas réel — UglifyJS applique De Morgan à une valeur qui n'était pas un booléen (2015) | https://github.com/mishoo/UglifyJS/issues/751 (ticket et commentaires par l'API GitHub ; identités : api.github.com/users/tmcw, /mishoo) |
| `pages/maths/lecon-03.html#1` (h3) | INVÉRIFIABLE (méthode générale ; garde « du genre de celles qu'on trouve ») | remplacé ; méthode gardée | Cas réel — MySQL et le mot de passe accepté une fois sur 256 (2012) | https://www.openwall.com/lists/oss-security/2012/06/09/2 |
| `pages/maths/lecon-04.html#1` (h3) | INVENTÉ (« Le scénario est un classique de la revue de code », équipe anonyme) | remplacé ; calcul gardé comme exemple | Cas réel — Mercurial et les 46 492 têtes d'un dépôt de Mozilla (2017) | https://www.mercurial-scm.org/pipermail/mercurial-devel/2017-March/095416.html ; …/095418.html ; https://www.mercurial-scm.org/wiki/WhatsNew/Archive |
| `pages/maths/lecon-05.html#1` (h3) | INVÉRIFIABLE (général : « présente dans toutes les bibliothèques standard du monde ») | remplacé | Cas réel — Go 1.24 et ses tables suisses, bâties autour des collisions (2025) | https://go.dev/blog/swisstable |
| `pages/maths/lecon-06.html#1` (h2) | INVÉRIFIABLE (général : « l'alerte sera coupée avant la fin du mois », « aucune équipe ne survit ») | remplacé ; programme gardé (la prédiction non sourcée retirée du code et de la sortie) | Cas réel — Axelsson et l'alerte d'intrusion à laquelle plus personne ne croit (1999) | https://www.profsandhu.com/cs6393_s20/p186-axelsson.pdf (métadonnées : Crossref 10.1145/357830.357849) |
| `pages/maths/lecon-07.html#1` (h3) | INVÉRIFIABLE (général ; Zeller, 1882, hors de la plage des années) | remplacé | Cas réel — le numéro de semaine du GPS, un compteur modulo 1 024 (1999, 2019) | https://www.measurement.govt.nz/assets/Uploads/Memorandum-on-GPS-2019.pdf |
| `pages/maths/lecon-08.html#1` (h3) | INEXACT (événement daté) : « quelques dizaines de milliers de clés — soit environ 0,5 % des serveurs TLS » confond clés (16 717) et serveurs (64 081, 0,50 %) ; « des centaines de milliers de clés » (commentaire du code) ; « avant d'avoir accumulé la moindre entropie » (la source : sources d'entropie limitées) ; « c'est presque toujours ainsi » sans source | corrigé | Cas réel — « Mining Your Ps and Qs » : des clés RSA qui partagent un facteur (2012) | https://factorable.net/weakkeys12.extended.pdf ; https://eprint.iacr.org/2012/064 |
| `pages/maths/lecon-09.html#1` (h3) | INVÉRIFIABLE (général ; Twitter tenu par `formats/lecon-10` ; « la seule méthode qui tienne ») | remplacé | Cas réel — Mastodon 2.0 passe ses identifiants en chaînes (2017) | https://github.com/mastodon/mastodon/releases/tag/v2.0.0 |
| `pages/maths/lecon-10.html#1` (h3) | INVÉRIFIABLE (général ; « il est partout », « chaque fois que vous voyez ») | remplacé ; analyse du programme gardée | Cas réel — firewalld, cloud-init et un cycle d'ordre de systemd (2022) | https://bugs.launchpad.net/ubuntu/+source/firewalld/+bug/1956629 (et ses messages par l'API Launchpad) |
| `pages/maths/lecon-11.html#1` (h3 + encadré) | INEXACT (général) : une carte graphique « sait faire cette opération, et presque uniquement celle-là » ; « un modèle de langue… des dizaines de fois par seconde » sans source | remplacé ; chiffres du programme gardés | Cas réel — le TPU de Google, une puce bâtie pour l'inférence (2017) | https://arxiv.org/pdf/1704.04760 (version ISCA 2017) |
| `pages/maths/lecon-12.html#1` (encadré) | INVÉRIFIABLE (anonyme ; idem au B2) | remplacé ; chiffres de l'exercice 2 gardés | Cas réel — MySQL 8.0.18 remplace la double boucle par une table de hachage (2019) | https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-18.html ; https://dev.mysql.com/blog-archive/hash-join-in-mysql-8/ |
| `pages/maths/lecon-13.html#1` (encadré) | INVENTÉ (« l'incident type » d'un cache fictif) | remplacé ; chiffres du programme gardés | Cas réel — Pugh et l'arbre ruiné par une entrée triée (1990) | https://15721.courses.cs.cmu.edu/spring2018/papers/08-oltpindexes1/pugh-skiplists-cacm1990.pdf (métadonnées : Crossref 10.1145/78973.78977) |

## Décomptes

| | pascal | maths | total |
|---|---:|---:|---:|
| lus | 14 | 13 | 27 |
| VRAI tel quel | 0 | 0 | 0 |
| INEXACT | 1 | 2 | 3 |
| INVENTÉ | 2 | 4 | 6 |
| INVÉRIFIABLE | 11 | 7 | 18 |
| remplacés | 13 | 12 | 25 |
| corrigés | 1 | 1 | 2 |
| « Scénario » | 0 | 0 | 0 |
| conformes à la règle | 0 → 14 | 0 → 13 | 0 → 27 |

## Retouches hors du récit, dans les zones « Cas réel » des sections `maths`

Une section `<h2>`/`<h3>` va jusqu'à l'intertitre suivant : ses encadrés et ses tableaux font partie du cas
que la contre-relecture lira. Corrigé là, sans toucher au reste de la leçon : « Trois sorties, toutes
employées en production » → « Trois sorties » et « deux signaux vraiment indépendants sont rares » → « le
calcul suppose deux signaux vraiment indépendants » (`maths/06`) ; « `log1p` reste exact » → « précis »
(`maths/06`) ; « le `-0` normalisé à la sortie » → « enregistré comme `0` » et « les deux seuls pièges que tu
rencontreras vraiment » → « les deux pièges à connaître » (`maths/04`) ; « la leçon 9, quand elle sera écrite,
traitera » → « traite » (`maths/05`, la leçon 9 existe) ; « la plupart des lecteurs avaient compris autre
chose », « qu'aucun outil ne défend », « prend deux minutes » (`maths/03`) ; « il est partout », « chaque fois
que vous voyez » (`maths/10`) ; « la formule de Zeller aux fonctions de date de toutes les… » (`maths/07`).

**Deux phrases rendues au vérificateur `tools/maths/verif-verite.js`** (étape `maths` de `verif.js`), qui
lit dans la prose deux faits du cours et les recalcule : la ligne `V V V` de la table du bouton
« Publier » (`maths/01`, phrase « c'est la ligne V V V, la dernière, celle qui vaut faux ») et les
« onze bits de plus » d'un identifiant de 64 bits (`maths/09`). Le premier jet du remplacement les
avait fait disparaître (2 contrôles DIVERGENTS sur 237) ; elles sont revenues dans des phrases exactes,
rattachées au tableau et au programme de la leçon : **237/237 concordants**.

## Contrôles (sur l'état commité)

- `node tools/verif-contenu.js --cas-reel --cours=pascal` → **0** ; `--cours=maths` → **0**.
- `node tools/verif-contenu.js --strict` → **0** (« 1 maigre » : `os/lecon-04`, hors de ma part).
- `node tools/verif-html.js` → **0** ; `node tools/verif-domaines-interdits.js` → **0**.
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0**.
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b8-pascal-maths d86be7b` → **1 écart** :
  `maths/lecon-12` GAGNE « source » — le mot vient de la classe `cas-reel__source` elle-même (le motif
  de mesure coupe sur le `_`), donc inévitable ; il porte le distracteur 4 d'une question (« … du code
  source »), qui restait la moins présente des quatre options ; cliquets verts.
- `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b8-pascal-maths d86be7b` → **OK** (0 CR de
  plus, octets identiques hors « Cas réel », types gardés, signatures).
- `node tools/verif.js --rapide` (une seule fois, 1 494 s, machine partagée) → **code 1**, 7 étapes
  SIGNALE, toutes expliquées :
  - `donnees` : seulement l'invariant **I18** (index dérivés périmés : `search-index.js`,
    `antiseches-data.js` — l'antisèche « Les probabilités dont on se sert » de `maths/06`, où
    « `log1p` reste exact » est devenu « précis ») — toléré, l'orchestrateur régénère ;
  - `doc-ref` et `doc-rec` : « 896 citent la source » n'est plus le bon décompte (mes lignes de source) —
    toléré, l'orchestrateur régénère ;
  - `etudes` et `etude-6` : la page dérivée `etude-inconnu.html` est périmée d'une seule ligne, la taille
    totale des blocs de code (6 561,9 Ko → 6 561,8 Ko, mes commentaires de code raccourcis dans
    `maths/02`, `03`, `06`, `08`) — page dérivée, à régénérer avec les autres ;
  - `maths` (`tools/maths/verif-verite.js`) : 2 divergences au moment du passage, **corrigées ensuite**
    (voir plus haut) — relancé seul : **237/237, code 0** ;
  - `caract` (`verif-controles.js`) : le processus lancé par `verif.js` est resté **bloqué 18 minutes**
    (0,4 s de processeur, une autre copie du lot avait le même processus bloqué depuis 08:25) ; je l'ai
    arrêté. Relancé seul : **0 accident, code 0**, en quelques secondes.
  Après les dernières retouches, relancés seuls : `--cas-reel` pascal 0 et maths 0, `verif-html` 0,
  `verif-qcm-lexique` 0, `verif-qcm-biais` 0, `verif-verite` 0, `controle-branche` OK.

## Ce qui reste ouvert

- **Générateurs du cours `maths`** : `tools/maths/module-3/corps/l7.html` à `l9.html`,
  `module-4/corps/l10.html` et `l11.html`, `module-5/corps/l12.html` et `l13.html` portent encore les
  ANCIENS « Cas réel » (hors de ma part : je n'ai touché qu'aux pages). Relancer `gen.js` d'un de ces
  modules écraserait les cas de cette branche : à reporter dans ces sources, ou à ne plus régénérer.
- **CR préexistants** : `maths/lecon-01.html` porte, dans la base `d86be7b`, **26 CR** (bloc
  `connecteurs.js`, lignes 132 à 157). L'outil d'édition les avait convertis en LF ; ils ont été **rétablis
  à l'identique** pour que les octets hors du cas ne bougent pas. À retirer par l'orchestrateur s'il le
  souhaite (le fichier n'a donc pas 0 CR).
- **Hors encadré, non traité** : `pascal/lecon-09` (liste « Où Pascal vit encore » : « certaines parties de
  Skype à ses débuts » sans source) ; `maths/lecon-01`, commentaire du programme « La condition réelle d'un
  bouton Publier » (exemple d'enseignement présenté comme réel, hors de la zone) ; la sortie de
  `maths/lecon-11` (`cout.js`) dit encore des cartes graphiques qu'« elles font ce produit, et rien
  d'autre » ; le QCM de `pascal/lecon-01` dit Pascal conçu « pour l'enseignement », la page de Wirth y
  ajoute la conception de systèmes (pas de contradiction, une nuance).
- **Sources de seconde main ou copies** : la conférence de Hoare (copie de Princeton), Axelsson (copie d'un
  cours), Pugh (copie de CMU), le mémorandum GPS (copie néo-zélandaise, non daté : la date d'avril 2018 est
  celle du PDF) — titres, auteurs, dates et chiffres vérifiés sur Crossref quand c'était possible ; la
  version de l'ACM n'était pas téléchargeable (403).
