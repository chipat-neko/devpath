# Consigne de correction — relecture du cours `docker` (B4, 57ᵉ cours)

Préparée le 2026-09-30. La relecture par contradiction (6 agents, lecture seule, **136 vérifications
exécutées ou sourcées, 173 affirmations confirmées justes**) a rendu **126 fautes** dans
`scratchpad/docker-relecture/fautes.json` (local, hors git ; sortie brute du workflow :
`scratchpad/docker-depart/relecture.json`). **16 sont déjà corrigées** (champ `traitee: true`) :
les 8 hautes et les fautes du même passage —
- les **commentaires en fin de ligne des Dockerfile** (`lecon-03`, `lecon-06`, `lecon-11`) : hors d'un
  `RUN`, un `#` en milieu de ligne est un ARGUMENT (référence Dockerfile) ; `USER app  # …` donnait un
  utilisateur inexistant, `ENTRYPOINT [...]  # …` retombait en forme shell (hadolint : « unexpected
  '#' »). Commentaires passés sur leur propre ligne ; les quatre blocs repassent hadolint (exit 0,
  sauf DL3066 *info*) ;
- la commande de durcissement de `lecon-10`, dont chaque `\` suivi d'un commentaire coupait la
  commande à la première ligne (bash rejoué avec un `docker()` factice : **13 arguments** reçus après
  correction, 4 avant) ;
- les deux `postgres:16` sans `POSTGRES_PASSWORD` de `lecon-04` (l'entrypoint officiel fait `exit 1`
  sur une base neuve) ;
- le schéma de `lecon-09` qui faisait relancer un conteneur *unhealthy* par la restart policy (Docker
  seul ne le fait pas ; la question 3 de la page le dit), et « `docker logs` montre un OOMKilled »
  (c'est un champ de `docker inspect`) ;
- `--volumes` (`lecon-14` : encadré, texte, schéma, antisèche, exercice, commentaires ; `lecon-15`,
  explain q12) : depuis Docker Engine 23 (API 1.42) il ne supprime que les volumes **ANONYMES** ; un
  volume nommé ne part qu'avec `docker volume prune -a`. **La bonne réponse de `lecon-14` q3 a été
  réécrite** après **11 candidats simulés** (`essai3.js`), un seul à 0 écart.

**Reste 110 : 37 moyennes, 73 basses** — 50 corps, 28 exercices, 10 distracteurs, 9 schémas,
4 explain, 3 bonnes réponses, 3 antisèches, 2 glossaires, 1 énoncé. Les 110 `extrait_exact`
restants sont **uniques** dans leur fichier (vérifié).

Tu corriges les fautes UNIQUEMENT dans TES fichiers (filtre `fichier`, et `traitee` différent de
`true`). Chaque faute a un `extrait_exact`, une `preuve` et une `correction_proposee` — la
proposition est une piste, pas un ordre : c'est toi qui prouves.

## Règles
1. **Un seul correcteur par fichier** : tu ne touches qu'à tes fichiers. Aucune commande git (sauf
   celle que lance `controle.js` en interne), aucun commit.
2. **Jamais l'outil Edit/Write sur une page** (il écrit en CRLF). Distracteurs : patchs JSON posés par
   `node scratchpad/docker-sonde/pose.js <patchs.json> [--ecrire]`. Corps, exercice, schéma,
   explain, bonne réponse : un fichier de règles écrit avec l'outil Write et posé par
   `node scratchpad/docker-corr/remplace.js <règles.js> [--ecrire]` (modèles dans
   `scratchpad/observabilite-corr/r-l10.js`, `r-l06.js` ; il refuse si l'ancien texte n'apparaît pas
   le nombre de fois attendu, reparse chaque bloc JSON et refuse BOM et CRLF). Jamais de heredoc pour
   un texte qui contient un antislash. Dans le HTML, copie l'extrait tel qu'il est dans le fichier
   (`&lt;`, `&nbsp;`…).
3. **NE JAMAIS ÉCRIRE UN RÉSULTAT DE TÊTE : L'EXÉCUTER.** Compose :
   `scratchpad/compose/docker-compose.exe -f f.yml config` (v5.5.1, sans démon ; `--profile`).
   Dockerfile : `scratchpad/hadolint/hadolint.exe f` (2.15.1). Bash : rejouer le bloc avec une
   fonction `docker()` factice qui affiche ses arguments. Calculs : Node. Exercices : rejoue `normExo`
   de `js/lecon.js` (l. 717-725) sur la réponse que la leçon enseigne ET sur les réponses justes
   voisines, puis vérifie qu'**aucun placeholder ni indice** ne devient une réponse acceptée. Le reste :
   cite docs.docker.com et distingue « prouvé par exécution », « établi par la source » et « de
   mémoire ». **Une faute non confirmée ne se corrige pas** : laisse-la et dis pourquoi.
4. **Un distracteur corrigé reste une thèse FAUSSE, précise, plausible, en français correct**
   (« LA RÈGLE QUI PRIME » de `scratchpad/CONSIGNE-DOCKER.md`), même longueur à ±10 %, même
   ponctuation et même nombre de phrases que ses options sœurs. **Simule-le avant de le poser** :
   `node scratchpad/docker-sonde/essai3.js essais.json` (44 stratégies + w + k, contre l'état DU
   DISQUE ; format `[{fichier, q (1-based, bilan compris), a:[4 options]}]`) et
   `node scratchpad/docker-corr/wk.js lecon-NN.html "texte"`. Pas de mot absolu ajouté pour allonger ;
   pas de « chaque », « chaîne », « valeur », « parce que ».
5. **Garde-fou** : après chaque lot, `node scratchpad/docker-sonde/controle.js --ref=15a65ba` ne doit
   montrer AUCUN déplacement (état actuel : 0). **Une correction de CORPS change le vocabulaire de
   la page et peut rouvrir `k`** (vu à cette passe : retirer « en marche » du corps de `lecon-14` a
   rouvert `k` sur deux questions — remis dans une phrase vraie) : relance-le après toute correction
   de corps. Vérifie aussi `node tools/mesure-lexique-qcm.js --liste=docker` (0/0/0) et
   `node tools/mesure-mot-fetiche.js docker` (0 alerte).
6. **Bonne réponse, explain, énoncé** : ne les modifie QUE pour une faute listée et confirmée, en
   gardant longueur, ponctuation, majuscules d'emphase et nombre de mots au plus près (simulé par
   `essai3.js`).
7. **Recalcule TOUT chiffre dérivé du chiffre que tu corriges** (56ᵉ cours : une moyenne corrigée
   laissait deux lignes plus bas un p99 devenu faux), et **cherche la même faute dans TOUTES tes
   leçons**, pas seulement là où elle est listée.
8. **Priorité** : toutes les moyennes, puis les basses réelles et prouvées.
9. À la fin : `node tools/verif-html.js` (0 attendu) et JSON des blocs valide.

## Groupes (disjoints)
| groupe | fichiers | moyennes | basses | total |
|---|---|---:|---:|---:|
| G1 | lecon-01, lecon-02, lecon-03 | 4 | 20 | 24 |
| G2 | lecon-04, lecon-05, lecon-06 | 10 | 9 | 19 |
| G3 | lecon-07, lecon-08, lecon-09 | 6 | 16 | 22 |
| G4 | lecon-10, lecon-11, lecon-12 | 9 | 11 | 20 |
| G5 | lecon-13, lecon-14 | 5 | 9 | 14 |
| G6 | lecon-15, cours.html | 3 | 8 | 11 |

Points à ne pas oublier :
- **`lecon-13`, profils** : un service sans profil qui `depends_on` un service à profil — la page dit
  qu'il démarre malgré tout, Compose v5.5.1 **rejette le projet** (signalement n° 30 des écrivains) ;
  et la bonne réponse « ne démarre qu'avec `--profile dev` » (n° 112) oublie `COMPOSE_PROFILES` et le
  service visé nommément. Simuler les candidats.
- **les Postgres sans mot de passe ou au mauvais utilisateur** : `lecon-13` (`DATABASE_URL` avec
  `app` alors que seul `POSTGRES_PASSWORD` est défini), `lecon-15` (solution sans
  `POSTGRES_PASSWORD`) — passer chaque fichier Compose corrigé à `docker-compose.exe config`.
- **`lecon-11` q3** (n° 80) : l'image officielle `node` définit elle-même `ENV NODE_VERSION` ; la
  bonne réponse « Non » est trompeuse sur l'exemple exact de la page. **`lecon-15`** (n° 121) :
  « toujours lancé » contre `docker run --entrypoint`.
- **FROM « toujours la première instruction »** (`lecon-03` : liste, exercice, placeholder, glossaire,
  antisèche) : `ARG` peut la précéder (référence Dockerfile).

## Après la correction : la CONTRE-RELECTURE (18,2 %, 25,0 %, puis 29,0 % de corrections fautives)
Un second workflow en lecture seule, chargé de DÉMOLIR les corrections (le diff depuis `15a65ba`),
avant de clore. Puis clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` ;
`verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, assembleurs des études, index
`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges` jusqu'au
point fixe, `verif.js --rapide`.

## Compte rendu attendu
Par faute : corrigée / laissée (raison), avec la preuve citée (fichier, sortie). Le résultat final de
`controle.js --ref=15a65ba` sur tes leçons, et de `verif-html`.
