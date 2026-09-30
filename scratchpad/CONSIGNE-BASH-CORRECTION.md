# Consigne de correction — relecture du cours `bash` (B4, 59ᵉ cours)

Préparée le 2026-09-30. La relecture par contradiction (6 agents, lecture seule, **756
vérifications exécutées sous bash 5.3.9, 568 affirmations confirmées justes**) a rendu **146 fautes**
dans `scratchpad/bash-relecture/fautes.json` (local, hors git ; rassemblées par
`scratchpad/bash-relecture/agrege.js`, lisibles par
`node scratchpad/bash-relecture/voir.js "<condition sur f>"`). **16 sont déjà corrigées** (champ
`traitee: true`, commit `8c67d6f`, preuves rejouées dans `scratchpad/bash-hautes/moi.sh` / `moi.out`) :
- **`set -u` ne réagit pas à une variable VIDE** (exécuté : code 0 ; seule une variable NON DÉFINIE
  donne « unbound variable », code 127) : le « Cas réel » Steam de `lecon-06` et de `lecon-11`
  (c'est `set -e` qui arrête le script quand la substitution chargée de remplir la variable échoue :
  code 1), l'antisèche et l'explain de q3 de `lecon-06`, « plante sur un `$1` vide » ;
- **`trap … ERR` n'est pas hérité par les fonctions sans `set -E`** (`lecon-12`, exécuté : arrêt
  muet, code 1 ; avec `set -Eeuo pipefail` le message sort), ni déclenché dans un `if` ou à gauche
  de `||` / `&&` ;
- **`cron` démarre dans le HOME du compte, pas dans `/`** (`lecon-02`, source : crontab(5)) ;
- **7 distracteurs** (4 inintelligibles, 3 de français) et **l'énoncé de bilan q1 de `lecon-16`**
  (« nom » nu est VRAI dans `$(( ))` : l'énoncé fixe maintenant le contexte), l'explain de
  `lecon-15` q3 (`diff -` lit un tube).
**1 est laissée** (n° 22, bonne réponse de `lecon-16` q1, « chaque exécution » : la correction
proposée, « journée », déplace le mot technique exclusif et `k` ; champ `laissee`).

**Reste 129 à corriger : 45 moyennes, 84 basses** — 70 corps, 38 exercices, 8 schémas, 5 antisèches,
8 « autre ». Les `extrait_exact` sont **uniques** dans leur fichier (vérifié par `agrege.js`).

Tu corriges les fautes UNIQUEMENT dans TES fichiers (filtre `fichier`, `traitee` différent de
`true`, pas de champ `laissee`). Chaque faute a un `extrait_exact`, une `preuve` et une
`correction_proposee` — la proposition est une piste, pas un ordre : c'est toi qui prouves.

## Règles
1. **Un seul correcteur par fichier** : tu ne touches qu'à tes fichiers. Aucune commande git (sauf
   celle que lance `controle.js` en interne), aucun commit.
2. **Jamais l'outil Edit/Write sur une page** (il écrit en CRLF). Distracteurs : patchs JSON posés par
   `node scratchpad/bash-sonde/pose.js <patchs.json> [--ecrire]`. Corps, exercice, schéma, explain,
   bonne réponse : un fichier de règles écrit avec l'outil Write
   (`module.exports = [{f:"lecon-NN.html", de:"…", vers:"…", n:1}]`) et posé par
   `node scratchpad/bash-corr/remplace.js <règles.js> [--ecrire]` (il refuse si l'ancien texte
   n'apparaît pas le nombre de fois attendu, reparse chaque bloc JSON et refuse BOM et CRLF).
   ⚠️ **Jamais de heredoc** pour un texte qui contient un antislash ou un `$` — vu à cette passe :
   un patch JSON écrit par heredoc a perdu son `\\;` ; écris TOUT fichier avec l'outil Write, et
   dans un fichier de règles écris les antislashs avec `String.raw`. Dans le HTML, copie l'extrait
   tel qu'il est dans le fichier (`&lt;`, `&amp;`, `&nbsp;`…).
3. **NE JAMAIS ÉCRIRE UNE SORTIE DE TÊTE : L'EXÉCUTER.** Bash 5.3.9 est l'outil Bash lui-même
   (mode d'emploi et limites — permissions, liens symboliques, cron, sudo, signaux de terminal —
   dans `scratchpad/CONSIGNE-BASH.md`, section « CE QUI SE PROUVE SE PROUVE »). Une sortie corrigée
   se **recopie de Bash**, caractère pour caractère. Exercices : rejoue `normExo` de `js/lecon.js`
   sur la réponse que la leçon enseigne ET sur les réponses justes voisines, puis vérifie qu'**aucun
   placeholder ni indice** ne devient une réponse acceptée (modèle :
   `scratchpad/docker-contre/exos.js`). ⚠️ `normExo` passe en minuscules : `declare -a` vaut
   `declare -A` pour lui. Ce qui ne s'exécute pas ici : cite la source et distingue « prouvé par
   exécution », « établi par la source » et « de mémoire ».
   **Une faute non confirmée ne se corrige pas** : laisse-la et dis pourquoi.
4. **Garde-fou** : après chaque lot, `node scratchpad/bash-sonde/controle.js --ref=8c67d6f` ne doit
   montrer AUCUN déplacement (état actuel : 0). **Une correction de CORPS change le vocabulaire de
   la page et peut rouvrir `k`** (vu à cette passe : « échouer » sorti de `lecon-06` a déplacé deux
   questions) — `node scratchpad/bash-sonde/kdiff.js 8c67d6f lecon-NN.html` nomme le mot entré ou
   sorti : relance-le après toute correction de corps, et redis la chose avec un mot déjà présent.
   Vérifie aussi `node tools/mesure-lexique-qcm.js --liste=bash` (1 question à mettre en forme,
   `lecon-03` q1, connue), `node tools/mesure-mot-fetiche.js bash` (0 alerte) et
   `node tools/mesure-tics-lot.js bash` (0 tic).
5. **Bonne réponse, explain, énoncé, distracteur** : ne les modifie QUE pour une faute listée et
   confirmée, simulée avant pose par `node scratchpad/bash-sonde/essai3.js essais.json`
   (`[{fichier, q (1-based), a:[4 options]}]`, comparaison à l'état DU DISQUE) et
   `node scratchpad/bash-corr/wk.js lecon-NN.html "texte"`.
6. **Recalcule TOUT ce qui dérive de ce que tu corriges**, relis le schéma, la légende,
   l'`aria-label`, l'antisèche et le glossaire voisins, et **cherche la même faute dans TOUTES tes
   leçons**, pas seulement là où elle est listée.
7. **Priorité** : toutes les moyennes, puis les basses réelles et prouvées.
8. À la fin : `node tools/verif-html.js` (0 attendu) et JSON des blocs valide. Aucune URL externe.

## Groupes (disjoints)
| groupe | fichiers | moyennes | basses | total |
|---|---|---:|---:|---:|
| G1 | lecon-01, lecon-02, lecon-03 | 9 | 19 | 28 |
| G2 | lecon-04, lecon-05, lecon-06 | 8 | 13 | 21 |
| G3 | lecon-07, lecon-08, lecon-09 | 8 | 8 | 16 |
| G4 | lecon-10, lecon-11, lecon-12 | 9 | 24 | 33 |
| G5 | lecon-13, lecon-14, lecon-15 | 6 | 11 | 17 |
| G6 | lecon-16 | 5 | 10 | 15 (dont le n° 22, laissé) |

Points à ne pas oublier :
- **`lecon-02`** : quatre sorties de `ls` / `ls -l` / `ls -lah` / `tree` qui se contredisent entre
  blocs voisins (tailles « 240K » sans `-h`, entrées manquantes) — construire UN dossier jetable et
  recopier les quatre sorties du même état ; « sensible à la casse » est démenti sous Git Bash et
  macOS.
- **`lecon-08`** : le script de synthèse crée son archive DANS le dossier temporaire que le `trap`
  supprime à la sortie (la sauvegarde est détruite) ; `set -e` « dès qu'une commande échoue » est
  un absolu faux (quatre exceptions exécutées) ; Bash n'est plus le shell par défaut de macOS.
- **`lecon-09`** : `awk '{ print $2, $4 }'` rend « 42 serveur », pas « 42 web » ; à égalité de
  compte, `sort -rn` sort 10.0.0.2 avant 10.0.0.1 ; `sed -i.bak` est la forme PORTABLE.
- **`lecon-12`** : tous les numéros de ligne de `pile.sh` et de la solution de l'exercice 3 sont
  décalés (exécuté : « + 7:main: externe / + 6:externe: interne / + 5:interne: echo coeur / coeur »).
- **`lecon-10` / `lecon-11`** : un `kill -TERM` n'interrompt pas un `sleep` au premier plan ; un
  piège sur INT ou TERM qui ne fait pas `exit` EMPÊCHE l'arrêt du script.
- **`lecon-13`** : `${#abc}` mesure la VARIABLE `abc` (rend 0) ; l'exercice 1 refuse
  `${chemin##*/}`, la forme du corps.
- **`lecon-16`** : la rotation `ls -1t | tail | xargs -r rm --` casse sur un chemin avec espace ;
  `date +%F` ne distingue pas deux exécutions du même jour ; l'exercice 3 accepte « crontab » seul
  (qui REMPLACE la table), l'exercice 2 accepte « -t » seul.
- **Les 38 fautes d'exercice** sont presque toutes des listes `accept` qui refusent la forme que le
  corps enseigne, ou des masques d'indice qui fabriquent une autre commande réelle (`$?`).

## Après la correction : la CONTRE-RELECTURE (18,2 %, 25,0 %, 29,0 %, 23,8 %, 12,8 % de corrections fautives)
Un second workflow en lecture seule, chargé de DÉMOLIR les corrections (le diff depuis `5b3c59a`,
**les 16 de cette passe comprises**), avant de clore. ⚠️ Les propositions des contradicteurs se
simulent contre la référence avant d'être posées. Puis clôture : cliquets refigés
(`verif-qcm-biais.js --ecrire`, `traite: true` ; `verif-qcm-lexique.js --ecrire`),
`tools/doc/gen.js`, assembleurs des études, index
`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges` jusqu'au
point fixe, `verif.js --rapide`, désignation du 60ᵉ cours.

## Compte rendu attendu
Par faute : corrigée / laissée (raison), avec la preuve citée (fichier, sortie). Le résultat final de
`controle.js --ref=8c67d6f` sur tes leçons, et de `verif-html`.
