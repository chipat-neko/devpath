# Consigne d'écriture — les QCM du cours `docker` (B4, 57ᵉ cours)

Préparée le 2026-09-30, à la clôture du 56ᵉ cours (`observabilite`). Mesures de départ archivées
dans `scratchpad/docker-depart/` (sorties brutes des outils). Sondes prêtes dans
`scratchpad/docker-sonde/` (`controle.js` v2, `simule.js`, `essai.js`, `essai2.js`, `pose.js`,
`rempl.js`, `k.js`, `dosage.js`, `chaque.js`), copiées de `observabilite-sonde` et pointées sur
`pages/docker/` (`controle.js` à vide : **0 indicateur déplacé sur 57 questions**).

Tu écris les **distracteurs** d'un lot de questions du cours `docker` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).
Le cours s'intitule « Docker » : pourquoi les conteneurs (conteneur contre VM, image contre
conteneur), images et conteneurs en pratique (`run`, `exec`, `ps`), écrire un Dockerfile, volumes,
réseaux et ports, Docker Compose, images optimisées (multi-étapes, cache, `.dockerignore`), registres
et tags, développer dans des conteneurs, observer et déboguer, sécurité et chaîne
d'approvisionnement, `ENTRYPOINT` / `CMD` / `ARG` / `ENV`, BuildKit et multi-plateforme, une pile
Compose complète (réseaux, profils, montée en charge), gérer l'espace disque, puis un projet de bout
en bout (`lecon-15`, **15 questions dont 12 de bilan**).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-écris un patch.

Les QCM sont dans `pages/docker/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-15`). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Écris tes patchs dans `scratchpad/docker-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/docker-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js`
refuse de toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un
fichier qui contient un antislash : l'outil Bash en mange un niveau. Écris tes scripts avec Write.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Du 53ᵉ au 56ᵉ cours, après des vagues où toutes les mesures étaient vertes, la relecture a encore
trouvé des distracteurs inintelligibles, des fautes de français et **des distracteurs VRAIS** —
des queues de phrase ajoutées pour tenir un compte de caractères, des parenthèses qui n'énoncent
rien. Au 56ᵉ, un distracteur (« latence moyenne > 300 ms ») était un symptôme réel que rien dans la
page ne permettait d'écarter.

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette forme » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).
6. **Aucun distracteur qui annonce un comportement sans le prouver faux** : si un distracteur dit
   « Compose lit `22:22` comme un nombre » ou « la variable du shell perd contre le `.env` », le
   comportement vrai a été **exécuté** (voir plus bas), pas supposé.

⚠️ **Le piège propre à ce cours : Docker a des OPTIONS pour presque tout.** « `docker run` ne
publie jamais de port » est faux avec `-p` ; « un conteneur perd toujours ses données » est faux
avec un volume ; « `depends_on` n'attend pas la base » est faux avec `condition: service_healthy`.
Un distracteur qui absolutise le comportement PAR DÉFAUT peut devenir **vrai avec une option que
la leçon cite ailleurs** : vérifie que ta thèse est fausse **dans le contexte exact de la
question**, contre la page ET contre docs.docker.com.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, COMPOSE ET LES DOCKERFILE S'ANALYSENT

Docker n'est **pas installé** (pas de démon : on ne construit ni ne lance aucune image). Mais :

- **Compose** : `scratchpad/compose/docker-compose.exe` (Docker Compose **v5.5.1**, binaire officiel
  portable, hors git). `docker-compose.exe -f <fichier>.yml config` **valide, interpole et
  normalise** un fichier Compose **sans démon** : ports, `depends_on`, variables `${X:-défaut}`,
  priorité `.env` / shell, profils (`--profile`), réseaux et volumes par défaut. Écris le fichier
  avec Write dans ton dossier, lis la sortie.
- **Dockerfile** : `scratchpad/hadolint/hadolint.exe <Dockerfile>` (hadolint **2.15.1**, portable,
  hors git) — le linter de référence (règles `DL3xxx`, et ShellCheck sur les `RUN`).
- **YAML** : PyYAML 6.0.3 (`python -c "import yaml; ..."`) — ⚠️ il suit **YAML 1.1**, Compose non
  (voir la table).
- **Arithmétique** (tailles d'image, couches, espace disque, nombre de répliques) :
  `node -e "..."` ou un script écrit avec Write. **Aucun chiffre de tête.**
- **Ce qui ne s'exécute pas** (cache de build, signaux, réseaux, stockage) : cite
  **docs.docker.com** ou la référence Dockerfile / Compose Specification. Si la page affirme autre
  chose que la source, **tu le remontes**, tu ne tranches pas de mémoire.

**Erreurs classiques de débutant** (n'utilise que celles que TA leçon établit). Les lignes marquées
▶ ont été **exécutées** à la préparation (Compose v5.5.1, hadolint 2.15.1 ou PyYAML) :

| croyance fausse | ce qui est vrai |
|---|---|
| ▶ dans `-p 8080:80` / `"8080:80"`, 8080 est le port du conteneur | `HÔTE:CONTENEUR` : `config` rend **`target: 80`, `published: "8080"`** |
| ▶ `"5432:5432"` ne s'ouvre que sur la machine locale | il publie sur toutes les interfaces ; `"127.0.0.1:5432:5432"` rend **`host_ip: 127.0.0.1`** |
| ▶ le `.env` l'emporte sur la variable du shell | le shell gagne : `PG_PW` du shell → **`depuis_shell`**, sans elle → **`depuis_env_file`**, sans les deux → la valeur de `${PG_PW:-secret}`, **`secret`** |
| `depends_on: [db]` attend que la base soit prête | la forme courte n'attend que le **démarrage** du conteneur (doc Compose) ; ▶ la forme longue `condition: service_healthy` est normalisée par `config` avec **`required: true`** et attend le `healthcheck` du service cible |
| ▶ `FROM node:latest` est la version stable recommandée | hadolint **DL3007** : `latest` bouge, épingler un tag |
| ▶ `ADD` et `COPY` sont interchangeables pour copier des fichiers | hadolint **DL3020** (*error*) : `COPY` pour des fichiers et dossiers ; `ADD` décompresse et télécharge |
| ▶ `RUN cd /app && …` fixe le dossier des instructions suivantes | hadolint **DL3003** : chaque `RUN` repart du `WORKDIR` ; on utilise `WORKDIR` |
| ▶ `CMD node server.js` vaut `CMD ["node","server.js"]` | hadolint **DL3025** : la forme shell lance `/bin/sh -c`, qui devient PID 1 et ne relaie pas `SIGTERM` (référence Dockerfile) |
| ▶ Compose lit `- 22:22` comme un nombre en base 60 | **nuance** : PyYAML (YAML 1.1) rend `22:22` → **1342** ; Compose v5.5.1 rend **`target: 22`, `published: "22"`**. La doc recommande quand même les guillemets |
| un conteneur embarque un système d'exploitation complet | il **partage le noyau** de l'hôte ; la VM, elle, a le sien |
| supprimer un conteneur supprime ses volumes nommés | non : `docker rm` les garde ; `docker compose down -v` les supprime |
| l'ordre des instructions du Dockerfile ne change rien au cache | une couche modifiée invalide **toutes les suivantes** : copier `package.json` et installer AVANT `COPY . .` |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **94,7 %** des QCM de `docker` en cochant l'option la plus
longue. Relevé du 2026-09-30, `node tools/mesure-biais-qcm.js --seul=docker` (57 questions, dont
12 de bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **94,7 %** | 96,5 % | 96,4 % |
| la plus détaillée | **77,9 %** | 68,4 % | **100,0 %** |
| RESTREINDRE à la PONCTUATION FORTE | **68,7 %** | 56,1 % | **100,0 %** |
| le mot technique exclusif | **55,3 %** | 63,2 % | 66,7 % |
| RESTREINDRE aux deux-points | **55,0 %** | 38,6 % | **100,0 %** |
| l'incise entre parenthèses | **53,9 %** | 38,6 % | **100,0 %** |
| l'écho de la question | 48,0 % | 42,1 % | 70,8 % |
| la seule avec un point-virgule | 42,1 % | 22,8 % | **100,0 %** |
| ECARTER la moins bavarde | 41,5 % | 7,0 % | 75,0 % |
| la seule qui nie / ECARTER la plus courte | 36,5 % | 42,1 % / 1,8 % | 50,0 % / 100,0 % |
| la MAJUSCULE d'emphase | 35,5 % | 21,1 % | 75,0 % |
| barre oblique / guillemets | 30–32 % | 9 % | 80–100 % |

**77,2 %** des questions (44 sur 57) sont trahies par **5 indices ou plus** sur 44.

## Le travail est de l'ALLONGEMENT

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **107,9 caractères** |
| longueur moyenne d'un distracteur | **34,5 caractères** |
| **rapport** | **3,13** (`observabilite` : 3,60 ; `lisp` : 4,19) |

`node tools/plan-rangs-qcm.js docker` demande **10 327 caractères** sur **55 questions sur 57**.
Rangs actuels **55 / 1 / 1 / 0**, cible **15 / 14 / 14 / 14**. **Suis EXACTEMENT** le rang visé et la
bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la bonne
réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

⚠️ Beaucoup de distracteurs actuels sont des **boutades** (« Le rendu graphique des applications »,
« Le chiffrement des mots de passe », « Réinstaller Docker ») ou des **synonymes creux** (« Aucune
différence, ce sont des synonymes ») : aucun débutant ne les coche. Remplace-les par des
**contresens réels** — ceux de la table ci-dessus, ou ceux que ta leçon réfute explicitement
(encadrés « Attention », « Erreur fréquente », exercices).

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes docker` rend **5 alertes** au départ (la QUATRIÈME
plus longue 32,2 %, la DEUXIÈME 32,2 %, la TROISIÈME 31,4 %, la moins bavarde 29,7 %, écarter les
deux extrêmes 26,3 %). **Le rang en MOTS de la bonne réponse doit valoir son rang en CARACTÈRES.**
Quand la bonne réponse est la plus courte, qu'**un** de ses distracteurs ait autant de mots qu'elle
(égalité) plutôt que tous davantage — et vise qu'un distracteur en ait **un de moins** quand la
bonne est au rang 3.

### (2) LA PONCTUATION — et L'UNION (68,7 %, rendement 100 %)
Par marque (`;`, `:`, parenthèse, tiret, barre oblique, guillemets « », flèche `→`, virgule
décimale), **les quatre options la portent, ou aucune** ; vérifie aussi l'UNION (« PONCTUATION
FORTE » = `:` ou `;` ou tiret). ⚠️ **Dans ce cours, le CODE porte de la ponctuation** : `8080:80`
compte comme deux-points pour l'outil, `/app` ou `ghcr.io/noah/app` comme barre oblique,
`--volumes` comme tiret, `["node","server.js"]` comme guillemets. Compte-les.

### (3) LES NEUF TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js docker --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **25 / 7** | 24 | **91,7 %** | **53,1 %** |
| **point-virgule médian** | **13 / 0** | 13 | **100,0 %** | **42,1 %** |
| **glose finale entre parenthèses** | **12 / 0** | 12 | **100,0 %** | **40,8 %** |
| « que le » | 5 / 1 | 6 | 83,3 % | 31,1 % |
| guillemets français | 4 / 1 | 5 | 80,0 % | 29,8 % |
| « de l'hôte » | 5 / 2 | 5 | 80,0 % | 29,8 % |
| « les données » | 3 / 1 | 4 | 75,0 % | 28,5 % |
| « du conteneur » ; « il faut » | 3 / 2 ; 4 / 5 | 5 | 60,0 % | 28,1 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (exemple) » : donne-le à tes distracteurs, avec un contenu qui dit quelque chose.
⚠️ **« Parce que » est un tic de DISTRACTEUR** (`parce` : 2 bonnes contre 17 distracteurs) : quand la
bonne réponse d'un « Pourquoi… ? » n'en porte pas, **retire-le** des distracteurs plutôt que de le
garder — ou mets-le dans deux options.

### (4) ⚠️ LES MOTS FÉTICHES — 4 ALERTES DÈS LE DÉPART
`node tools/mesure-mot-fetiche.js docker` : `docker` (16 bonnes / 27 distracteurs, RESTREINDRE
**33,9 %**), `conteneur` (13 / 14, **33,3 %**), `compose` (7 / 5, **31,1 %**), `build` (6 / 5,
**30,7 %**) ; juste sous le seuil : `fichiers` (4 / 2), `volumes`, `données`, `volume`, `mount`,
`exécution`, `réseau` (autour de 28 %). **Pose ces mots dans des distracteurs**, là où ils ont un
sens — dans ce cours c'est facile, ce sont les mots du sujet. **N'emploie pas « chaque »,
« chaîne » ni « valeur »** pour allonger : aux 50ᵉ à 52ᵉ cours, la correction a fabriqué son
propre mot fétiche avec eux. **« chiffre »** (0 / 6) et **« aucune »** (1 / 6) sont déjà des mots
de DISTRACTEUR : ne les multiplie pas.

### (5) LE MOT TECHNIQUE EXCLUSIF (55,3 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune.
`node tools/mesure-mot-question.js docker --plan` donne la liste exacte, question par question
(**94 mots à traiter sur 18 questions qui tranchent**).

### (6) L'ÉCHO DE L'ÉNONCÉ (48,0 %, rendement 70,8 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les mots courts et les
commandes passent sous le radar : `run`, `exec`, `ps`, `tag`, `CMD`, `ARG`, `ENV`, `COPY`, `-v`,
`prune`, `down` — compte-les.

### (7) L'INDICE LEXICAL — 54 exploitables, 36 retournées, 55 à mettre en forme sur 57
`node tools/mesure-lexique-qcm.js --liste=docker`. **Règle du `k`** : les QUATRE options portent le
même nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en OCCURRENCES** : un
mot étranger répété compte deux fois. **Règle du `w`** : quand `k > 0`, les quatre portent aussi le
même nombre de mots de 6+ lettres. Un substitut doit être **présent dans la page** (jeton entier ;
l'apostrophe et le tiret séparent les mots). Cible : 0 / 0 / 0.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE — les quatre options ont le MÊME nombre de phrases
Le point suivi d'une espace puis d'une majuscule est la signature ; « etc. », « ex. », la virgule
décimale et le point d'un nom de fichier (`server.js`, `ghcr.io`) ne comptent pas.

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js docker <sha>`.
2. **Aucun distracteur ne doit devenir vrai** — et ici, une option de ligne de commande suffit à
   rendre vrai un « jamais » : relis ta thèse contre la page ET contre docs.docker.com.
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`.
4. **Aucune URL externe** dans le contenu (une image `ghcr.io/noah/app` n'est pas une URL : garde
   les noms d'image de la page).

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js docker` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger,
   et **exécute** (Compose `config`, hadolint, Node) chaque comportement ou valeur que tu annonces.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Pose, puis relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js docker
node tools/mesure-mot-question.js docker --plan
node tools/mesure-biais-qcm.js --seul=docker
node tools/mesure-biais-inverse.js --toutes docker
node tools/mesure-lexique-qcm.js --liste=docker
node tools/mesure-mot-fetiche.js docker
node tools/mesure-tics-lot.js docker --exemples
node scratchpad/docker-sonde/essai.js "<fragment unique de l'énoncé>"
```

---

## CE QUE LES 53ᵉ À 56ᵉ COURS ONT APPRIS À L'ORCHESTRATEUR

- **La relecture par contradiction doit lire les CORPS et les VÉRIFIER** : 51 fautes de corps sur
  92 pour `dart`, 99 sur 179 pour `perf-web`, 56 sur 113 pour `lisp`, 20 corps sur 69 pour
  `observabilite`, dont des **configurations qui ne démarreraient pas**. Pour `docker` : passer
  **chaque fichier Compose** de la page à `docker-compose.exe config`, **chaque Dockerfile** à
  hadolint, **chaque calcul** de taille sous Node, et confronter chaque affirmation sur le cache,
  les signaux, les réseaux ou le stockage à docs.docker.com.
- **La CONTRE-RELECTURE des corrections** : 18,2 %, 25,0 %, puis **29,0 %** des corrections fautives
  (la part MONTE). Dire aux correcteurs de recalculer **tout chiffre dérivé** du chiffre corrigé,
  et de rejouer `normExo` sur le placeholder et les indices après avoir élargi un `accept`.
- **Relancer `mesure-mot-fetiche` APRÈS la relecture** : ses réécritures fabriquent un mot fétiche
  que `controle.js` (stratégies par question) ne voit pas.
- **Une correction de CORPS change le vocabulaire de la page** et peut rouvrir `k` : relancer
  `controle.js --ref=<sha de la vague>` après toute correction de corps.
- **`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges`** :
  sans `--only`, `antiseches` et `pieges` restent périmés.
- **Dosage calculé** (`dosage.js`) : combien de points retirer, puis quelles questions rapportent le
  plus. Raccourcir un distracteur en ôtant des mots courts le rend PLUS DENSE : remplacer, pas ôter.
- **Un réveil qui termine son tour pendant un Workflow le tue** : attendre dans le même tour
  (boucle Bash bloquante `seq 1 50` × 10 s, sous le délai de 590 s).
- Clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` à la main ;
  `verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, `tools/etudes/inconnu/assembler.js` et
  `tools/etudes/recherche/assembler.js`, puis index, jusqu'au point fixe (vérifié par empreinte).
