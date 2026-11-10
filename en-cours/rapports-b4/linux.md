# LE NNᵉ COURS — `linux` (« Linux & administration système »), 94,5 % → 25,5 %

Passe du 2026-11-10, un seul agent, copie de travail `D:\test-claude-b4\linux`, branche
**`b4/linux`**. 55 questions dont 12 de bilan, 11 leçons. Consigne versionnée :
`scratchpad/CONSIGNE-LINUX.md`. Sondes et mesures brutes, hors git :
`scratchpad/linux-sonde/` (`etat.js` simule les patchs EN MÉMOIRE sur le cours entier avant
toute pose, `dose.js`, `voc.js`, `dens.js`, plus `controle.js`, `pose.js`, `sim.js`, `k.js`,
`kdiff.js` copiés de `tests-sonde` et repointés), `scratchpad/linux-depart/` (mesures de départ,
`classiques.sh` / `.out`), `scratchpad/linux-vague-mes/` (mesures de fin, `rendu.txt`,
`verif-rapide.txt`).

⚠️ **EN TÊTE, comme demandé : UNE BONNE RÉPONSE CORRIGÉE.** `lecon-07` q2 disait « cron tourne
dans un environnement minimal : PATH réduit, **pas de dossier courant** ni de variables
habituelles ». Faux : une tâche cron a un dossier courant, le HOME du compte — cronie
`src/security.c` (`if (chdir(homedir) == -1)` … « ERROR chdir failed »), Vixie cron
`do_command.c`. **Prouvé par la source, NON EXÉCUTÉ** (cron est absent de cette machine, WSL ne
fonctionne pas). Corrigée en « PATH réduit, **pas ton** dossier courant ni **tes** variables
habituelles », alignée sur le corps de la leçon qui disait déjà juste (« ni ton dossier
courant »). Commit `2ff23af`. `mesure-qcm-intouchable linux a6a45f2` : **1 atteinte, celle-ci,
délibérée**.

Aucun fichier du dépôt principal `D:\test-claude\` n'a été modifié.

## Commits (sur `b4/linux`, depuis `a6a45f2`)

| commit | contenu |
|---|---|
| `2ff23af` | bonne réponse de `lecon-07` q2 corrigée (source) |
| `6136d30` | vague, lot A (`lecon-01` à `04`) : 43 options |
| `250633f` | vague, lot B (`lecon-05` à `08`) : **48** options (le message dit 47) |
| `4178982` | vague, lot C (`lecon-09` à `11`, bilan compris) : **70** options (le message dit 72) |
| `5312f9f` | dosage calculé : 19 options (mot fétiche, tic de lot, densité, rangs) |
| `ebdac2a` | relecture par contradiction : 9 options de QCM, 25 corrections de corps et d'exercices, 3 rattrapages de `k` |
| `9594642` | contre-relecture : 2 corrections fautives retouchées |
| (dernier) | ce rapport et `scratchpad/CONSIGNE-LINUX.md` |

⚠️ Deux chiffres de messages de commit sont faux et le restent dans l'historique : les comptes
d'options des lots B et C (ci-dessus), et `5312f9f` annonce « la plus longue 25,5 % » quand la
mesure à ce commit valait **24,5 %** (25,5 % est la valeur après la relecture, `ebdac2a`).

## Avant / après

| indice | départ | arrivée | commande |
|---|---:|---:|---|
| « la plus longue » | **94,5 %** (couv. 100 %, rend. 94,5 %) | **25,5 %** (rend. 25,5 %) | `node tools/mesure-biais-qcm.js --seul=linux` |
| pire des 44 stratégies | 94,5 % | **27,6 %** (la moins bavarde, couv. 54,5 %, rend. 30,0 %) ; puis la plus dense 27,3 %, le mot technique exclusif 26,7 % | idem |
| la plus détaillée / ponctuation forte / incise / point-virgule | 78,0 / 60,0 / 59,1 / 41,4 % | 25,2 / 25,0 / 26,4 (couv. 1,8 %) / 25,0 % | idem |
| questions trahies par 5 indices ou plus | **45 sur 55** (81,8 %) | **0** (43 à 0–2, 12 à 3–4) | idem |
| rangs de la bonne réponse (0 = la plus longue) | 52 / 1 / 0 / 2 | **14 / 14 / 14 / 13** = la cible | `node tools/plan-rangs-qcm.js linux` |
| biais inverse | 4 alertes | **0** (pire : le mot technique exclusif, 27,3 %) | `node tools/mesure-biais-inverse.js --toutes linux` |
| mots fétiches | 3 alertes (`parce` 0/23, `service` 9/7, `fichiers` 6/7) | **0** (le plus haut : `machine`, ÉCARTER 27,9 %) | `node tools/mesure-mot-fetiche.js linux` |
| tics de lot | 13 (deux-points médian 19/1, point-virgule médian 13/3, glose finale 11/0, « parce que » 0/19…) | **0** | `node tools/mesure-tics-lot.js linux` |
| lexique (`k`/`w`) | 44 exploitables, 28 retournées, 46 à mettre en forme | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=linux` |
| intrus lexical | DÉFAUT 31,4 % (7 questions sûres), EXCÈS 26,5 % | **25,0 % / 25,0 %, 0 sûre** ; EXCÈS 24,5 / 25,2 %, 0 sûre | `node tools/mesure-mot-question.js linux` |

**Distracteurs : 161 réécrits sur 165, 4 gardés** (`lecon-02` q2 « /home… /bin » et « /var…
/usr », bilan q6 « Dans /home », bilan q13 « free -h ») — compté par
`node tools/mesure-qcm-intouchable.js linux a6a45f2`. **10 564 caractères écrits** (distracteurs
de 30,1 à 94,1 caractères en moyenne, bonnes réponses 93,6). `verif-html` **0** ;
`verif-rendu` sur les **12 pages** du cours (3 largeurs × 2 thèmes) **0 erreur, 0
avertissement** ; `verif-donnees` : seules les erreurs attendues `[I18]` (4 index périmés) et
trois avertissements anciens étrangers au cours (`zig`, pages d'étude, `doc`) ;
`mesure-explain-orpheline --depuis=a6a45f2 --seul=linux` : **1 signalement bénin** (`lecon-01`
q2 : l'explain dit « simplifie le système », mot employé en général, pas une option effacée).

## Comment c'est fait (et pourquoi une seule vague a suffi)

Seul, sans agents : **chaque question a été écrite contre le tableau de `etat.js`** (rang et
bande, marques, `, : ;`, incises, `k` et `w`, mots exclusifs de 9+ lettres, écho, négation,
absolus, prudents, attaque, intrus lexical), puis **le cours entier a été simulé en mémoire**
avant chaque pose. Les mots candidats ont été testés contre le vocabulaire de la page
(`voc.js --teste`) AVANT d'écrire la phrase : c'est la contrainte du `k` qui commande ici —
le bilan de `lecon-11` exige jusqu'à `k = 6, w = 6` (q8), et la plupart des questions `k = 0`,
c'est-à-dire des distracteurs écrits **uniquement avec des mots de 6+ lettres déjà présents
dans la leçon**.

Le dosage s'est calculé (`dose.js`) : la plus dense était montée à 47,3 % après la vague
(les bonnes réponses portent les mots techniques longs) ; une dizaine de bascules choisies par
le plus petit écart l'ont ramenée à 27,3 %, le mot technique exclusif de 39,5 à 26,7 %, la
moins bavarde de 33,6 à 27,6 %.

## Fautes de fond trouvées et corrigées

Au-delà de la bonne réponse de `lecon-07` (ci-dessus). Chacune avec sa preuve.

- **`systemctl disable` présenté comme coupant un service** (`lecon-05`, liste du durcissement
  et exercice 3) : « ce qui ne tourne pas ne peut pas être attaqué » — or `disable` n'arrête
  pas l'unité (systemctl(1) : « this command does not implicitly stop the units that are being
  disabled »). Devenu `systemctl disable --now`, ce que `lecon-04` enseigne déjà (start et
  enable sont deux axes). **Source, non exécuté.**
- **Le schéma du load average de `lecon-09` enseignait l'inverse de l'exercice de la même
  page** : 1,20 / 0,80 / 0,45 sur 1 / 5 / 15 min avec la légende « la charge redescend » et
  l'`aria-label` « tendance à la baisse » — l'exercice 1 dit, à juste titre, que 1 min > 15 min
  veut dire que la charge MONTE. Valeurs remises dans l'ordre (0,45 / 0,80 / 1,20), texte et
  `aria-label`. **Logique de la page.**
- **`mount -a` comme test de la ligne ajoutée à `fstab`** (`lecon-08`, exercice 2) : l'étape
  précédente venait de monter `/data` à la main, et `mount -a` ignore ce qui est déjà monté
  (mount(8)) : le test ne testait rien. L'étape démonte d'abord. L'encadré disait aussi « le
  prochain démarrage se passera bien » (absolu, adouci). **Source, non exécuté.**
- **Le cas réel de `lecon-10`** : « les archives font toutes quelques kilo-octets » et une
  erreur « fichier introuvable ». **Exécuté** (GNU tar 1.35, Git Bash) : l'archive `.tar.gz`
  d'un chemin absent pèse **45 octets**, `tar` sort en code **2** avec « Cannot stat: No such
  file or directory ». Le commentaire `-mtime +14 # ne garder que 14 jours` : **exécuté**, `find`
  retient les fichiers de 15 jours entiers et plus (« effacer celles de plus de 14 jours »).
- **La charge ne compte pas que le CPU** (`lecon-09`, corps et glossaire) : proc_loadavg(5),
  « run queue (state R) or waiting for disk I/O (state D) ». Nuance ajoutée. **Source.**
- **`ps aux --sort=-%mem | head` « les 10 processus »** : `head` rend 10 lignes dont l'en-tête.
  `head -n 11`. **Logique** (sous Git Bash `ps aux` n'existe pas tel quel ; l'en-tête de
  `ps -ef` y est bien la première ligne).
- **`ufw allow 443` manquait** au code de `lecon-05` (le schéma et sa légende ouvrent 22, 80 et
  443) et au plan du mini-projet de `lecon-11` (l'architecture cible ouvre 22, 80, 443).
- **Indice d'exercice faux** : `lsblk` annoncé en « Six lettres » (`lecon-08`, il en a cinq).
- **Deux PREMIERS indices qui donnaient une réponse acceptée** (`lecon-01` « En anglais :
  « kernel » », `lecon-05` « En anglais : « firewall » ») : placés en dernier, comme les autres
  traductions du cours. Rejoué : `fuites-larges` 2 → 0.
- **`lecon-06` « Cette dernière leçon relie tout »** et « Tu sais administrer un serveur de bout
  en bout » : le cours a 11 leçons (`cours.html` : 5 modules). Corrigé, et le lien d'exercice
  « Revoir « Et après ? » » (section qui ne parle pas du moindre privilège) pointe vers le
  glossaire.
- Plus petites : « la quasi-totalité » / « la majorité » des serveurs web dans la même page
  (`lecon-01`) ; la sortie stylisée de `ls -l` sans colonne de date (`lecon-03`, date ajoutée —
  `ls -l` exécuté sous Git Bash l'affiche) ; OpenSSH qui « bloque la connexion » (il ignore la
  clé, la connexion par clé échoue — **de mémoire**, message « This private key will be
  ignored ») ; `systemctl start` « pour la session en cours » (`lecon-04` : au plus jusqu'au
  prochain arrêt, sans lien avec la session — **de mémoire**, sémantique de systemd) ; un
  fichier supprimé encore ouvert occupe la place « jusqu'au redémarrage du service » (tant que
  le processus le garde ouvert, `lecon-08`).

**Distracteurs pris à la relecture (9)** : `lecon-02` q2 (« /usr/lib » et « /run » portent
bien des réglages fournis et un journal volatil de systemd : discutable), `lecon-05` q3
(« fermer le port SSH » à Internet se défend : discutable), bilan q14 (« cron a pu tuer le
processus » est une hypothèse VRAIE ; « un disque saturé a pu tuer le processus » aussi),
`lecon-06` q4 (« pare-feu ouvert — ne bloquer que le réseau externe » se contredisait),
bilan q8 (« sa session peut fermer » → « peut se fermer »), plus trois retouches de sens.

**Contre-relecture de mes corrections : 2 fautives sur 34 (5,9 %)** — un absolu déplacé
(« comme elles le feront au prochain démarrage », `lecon-08`) et une borne trop forte
(« jusqu'au prochain arrêt » → « au plus jusqu'au prochain arrêt », `lecon-04`). Et **trois
corrections de corps qui ont déplacé un `k`**, vues par `controle.js --ref=HEAD` et rattrapées
avant le commit : « grande » entré dans `lecon-01` (la bonne réponse de q3 perdait un mot
étranger), « bloque » sorti de `lecon-03` et « session » sorti de `lecon-04` (un distracteur
en gagnait un). État final : **0 indicateur déplacé** par le corps.

## Exécuté / non exécuté

**Exécuté sous Git Bash (MINGW64, bash 5.3.9), PAS sous Linux** —
`scratchpad/linux-depart/classiques.sh` et `.out` : `ls`, `ls -a`, `ls -A`, `ls -h`, `ls -l`
(aucun ne montre `.env` sauf `-a` / `-A`) ; `cp -r projet/` contre `cp -r projet/*` (l'étoile
oublie les noms en point) ; `kill` contre `kill -9` (piège `TERM` joué, code 0 ; jamais sous
`-9`, code 137 ; `sleep` tué : 143 / 137) ; `tar` d'un chemin absent (45 octets, code 2) ; `tar`
d'un chemin absolu puis extraction (`` Removing leading `/' from member names ``) ; `find -mtime +14` ; la
traduction 754 / 640 / 600 / 644 / 777 en `rwx` (calcul, pas un vrai `chmod` POSIX).

**Non exécuté — établi par la source ou de mémoire, dit comme tel** : tout ce qui touche
systemd (`systemctl`, `journalctl`, timers, `Persistent=`), `cron` / `crontab`, `ufw`, `ss`,
`ip`, `lsblk`, `blkid`, `fdisk`, `mount -a`, `/etc/fstab`, `free`, `dmesg`, l'OOM killer,
`rsync` et `--delete`, le comportement d'OpenSSH sur une clé en 644, les vraies permissions
POSIX. Sources citées : systemctl(1), mount(8), proc_loadavg(5), crontab(5), le code de cronie.
Aucun de ces outils n'existe sur cette machine et WSL ne fonctionne pas.

## Laissé, et dit

- **Trois bonnes réponses simplificatrices, signalées sans y toucher** (aucune n'est prouvée
  fausse) : `lecon-09` q1 (« deux fois plus de processus **veulent le CPU** » : la charge Linux
  compte aussi l'attente disque — le corps porte maintenant la nuance) ; `lecon-09` q2 (la part
  buff/cache « rendue **instantanément** » : `free` y range aussi la mémoire partagée, que seule
  la colonne `available` estime vraiment — **de mémoire**, d'après free(1), non exécuté) ; `lecon-10` q3 (« ou un chiffrement par
  rançongiciel » attribué à `--delete` : un miroir rsync recopie aussi des fichiers chiffrés en
  place, avec ou sans `--delete` ; seul un rançongiciel qui renomme puis efface relève de
  `--delete`).
- **Exercices** : cinq derniers indices sont des traductions ou des sigles qui donnent la
  réponse (« kernel », « racine », « least privilege », « Secure Shell », « firewall ») et deux
  libellés « Revoir « SSH » » / « Revoir « rsync » » l'affichent au 10ᵉ essai ; dans sept
  exercices, la réponse se lit dans le texte au-dessus du champ (`fuites-enonces.js`). C'est la
  convention du moteur sur tout le site, déjà notée sur `bash` et `tests`.
- `lecon-03` q2 : une seule option (« Proprio : … ») porte un mot de 5+ lettres que les autres
  n'ont pas ; l'intrus « par excès » la désigne seule. Les quatre options sont des permutations
  des mêmes mots ; ne pas la désigner demanderait de casser l'égalité des longueurs. L'indice
  reste à 24,5 / 25,2 % sur le cours.
- **Ce que je n'ai pas fait, par la règle de fusion** : cliquets non refigés
  (`verif-qcm-biais.js --ecrire`, `traite: true`, `verif-qcm-lexique.js --ecrire`), index non
  régénérés (`build-index --write --fresh`), pages dérivées non réassemblées — c'est le travail
  de l'orchestrateur à la fusion. `verif.js --rapide` : voir la dernière section.

## Leçons de ce cours

1. **Écrire contre une simulation du cours entier, en mémoire, avant de poser** a permis UNE
   vague sans réécriture : les indices se sont fermés question par question, et le dosage n'a
   porté que sur les stratégies continues (densité, mot exclusif, nombre de mots).
2. **La contrainte du `k` fabrique ses propres mots fétiches** : pour écrire avec les seuls
   mots de la page, la vague a mis « machine » dans 27 distracteurs (2 bonnes réponses) et
   « système » dans 17 (0). Remplacés par d'autres mots de la page. À mesurer dès la fin de la
   vague, comme « la plus dense » (règle tirée de `tests`).
3. **En administration système, la thèse « fausse » est souvent une pratique défendable** :
   quatre distracteurs écrits de bonne foi étaient discutables ou vrais (configuration dans
   `/usr/lib`, journal dans `/run`, SSH fermé à Internet, cron qui tue un processus). Ce sont
   eux que la relecture doit chercher d'abord.
4. **Un schéma peut contredire l'exercice de sa propre page** (le load average) : aucun outil
   ne lit les nombres d'un SVG ; seule la relecture du texte ET de l'`aria-label` l'a vu.
5. **Une correction de corps déplace un `k` trois fois sur vingt-cinq** : `controle.js
   --ref=HEAD` après chaque lot de corps, avant le commit.

## Ce qui reste

Rien sur les QCM du cours. Pour l'orchestrateur, à la fusion : refiger les cliquets avec
`linux` marqué `traite`, régénérer les index (`--fresh`) et les pages dérivées, puis
`verif.js --rapide`.

## `verif.js --rapide` dans la copie

`node tools/verif.js --rapide` (sortie complète : `scratchpad/linux-vague-mes/verif-rapide.txt`,
338,0 s, 53 étapes jouées) : **10 étapes signalent, 1 n'a rien pu mesurer**. Attribution :

- **attendues par la consigne** : `qcmbiai` et `qcmlexi` (« linux a progressé — longueur
  94,5 % → 25,5 % — sans que le gain soit figé ») et `donnees` (`[I18]`, 4 index périmés) ;
- **pages qui publient des mesures du site entier, que la passe a fait bouger** (pages dérivées,
  hors de mon périmètre de fusion) : `doc-ref` (1 contrôle), `normatf` (13 contrôles : les taux
  S3/S4 et les sorties publiées de `doc/lecon-03`), `etudes` (1 page d'étude périmée),
  `etude-6` (`etude-inconnu` : 3 fautes, chiffres publiés qui ont dérivé) ;
- **artefacts de la copie de travail, pas de la passe** : la copie est extraite en CRLF
  (`core.autocrlf=true`, `js/lecon.js` : 2 051 CRLF sur 2 051 fins de ligne) et plusieurs
  outils cherchent des motifs écrits en LF. Prouvé pour `requete` (NON MESURÉ :
  `verif-sql-exos.js` cherche `'\n  }\n'` après `function JUGE_SQL(`) ; très probable pour
  `moteurs` (longueurs des sources Pyodide « attendu 1229116, obtenu 1229099 »), `maths`
  (58 divergents) et `rj-cpp` (12 blocs « introuvables » dans `pages/cpp`). Aucun de ces
  fichiers n'est touché par la branche : `git diff --stat a6a45f2 HEAD` ne liste que
  `pages/linux/` (11 fichiers), plus ce rapport et la consigne.

À rejouer par l'orchestrateur après la fusion, dans le dépôt principal (LF), une fois les
cliquets refigés, les index et les pages dérivées régénérés.

## Retouche après fusion : un distracteur de remplissage (`lecon-01` q1)

Faite sur `b4/linux` à partir de `d6cd961` (master après les neuf fusions), copie en LF.

Le 4ᵉ distracteur de `lecon-01` q1 portait une parenthèse de remplissage, une liste de synonymes
qui ne servait qu'à tenir les compteurs :

- avant : « Le noyau et la distribution sont un même programme (distro, kernel, système, base,
  socle) ; le second terme est plus répandu chez les débutants » ;
- après : « Le noyau et la distribution sont, au fond, un même programme (Debian ou Ubuntu) ; le
  second terme, plus répandu, parle surtout aux débutants ».

La phrase reste fausse (le noyau est un programme, une distribution est un système complet bâti
autour de lui : c'est ce que dit l'explication, intouchée) et plausible : c'est la confusion du
débutant pour qui « Ubuntu, c'est Linux ». Ce que la mesure imposait, et que la nouvelle phrase
tient sans liste de remplissage :

- cinq signes `,` `:` `;` comme les trois autres options (`la plus détaillée` ne tranche pas) :
  deux virgules autour de « au fond », deux autour de « plus répandu », le point-virgule ;
- une incise entre parenthèses, et pas de deux-points ni de guillemets ;
- 8 mots de six lettres et plus, tous présents dans la page (w = 8, k = 0) ;
- 140 caractères (la plus courte, comme avant), 23 mots (la moins bavarde, comme avant), densité
  4,78 (sous l'option la plus dense) ;
- un seul mot exclusif de neuf lettres et plus (`débutants`), aucun mot partagé par trois options.

| Contrôle | Résultat |
| --- | --- |
| `controle.js --ref=d6cd961` | **0** question dont un indicateur a bougé (« TOUT EST EN PLACE ») |
| lexique `--liste=linux` | 0 / 0 / 0 (inchangé) |
| la plus longue / questions trahies par 5 indices ou plus | 25,5 % / 0 (inchangés) |
| mot fétiche / tics de lot | 0 / 0 |
| intrus lexical DÉFAUT / EXCÈS (direct / inverse) | 25,0 / 25,0 · 24,5 / 25,2 (inchangés) |
| explications orphelines | 0 (un cas indicatif, `système`, mot français courant de l'explication) |
| atteintes à l'intouchable | 0 |
| `verif-html.js` | 0 |
