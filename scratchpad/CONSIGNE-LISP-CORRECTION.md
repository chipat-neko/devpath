# Consigne de correction — relecture du cours `lisp` (B4, 55ᵉ cours)

Préparée le 2026-09-30. La relecture par contradiction (6 agents, lecture seule, **119 blocs exécutés,
193 sorties confirmées**) a rendu **113 fautes** dans `scratchpad/lisp-relecture/fautes.json` (local,
hors git ; copie de secours : `scratchpad/lisp-relecture/relecture.jsonl`, et le `journal.jsonl` du
workflow `wf_dfdd57f9-601` dans le dossier de session). **22 sont déjà corrigées** (champ
`traitee: true`, commit `c132afc`) : les 6 hautes et les fautes du même passage (`lecon-13` passée en
Common Lisp annoncé, `fold-left` annoncé R6RS en `lecon-06`, `make-hash` en `lecon-12`, l'exercice
d'affichage de `lecon-01`, la bonne réponse de `lecon-06` q2). **Reste 91 : 24 moyennes, 67 basses** —
42 dans les CORPS, 21 dans les exercices, 25 distracteurs, 2 `explain`, 1 énoncé.

Tu corriges les fautes UNIQUEMENT dans TES leçons (filtre `fichier`, et `traitee` différent de `true`).
Chaque faute a un `extrait_exact` (unique dans son fichier, vérifié pour 90 sur 91 ; la n° 7 de
`lecon-03`, dans un `<text>` SVG, se retrouve par `= (1 . (2 . '()))`), une `preuve` et une
`correction_proposee` — la proposition est une piste, pas un ordre : c'est toi qui prouves.

## Règles
1. **Un seul correcteur par fichier** : tu ne touches qu'à tes leçons. Aucune commande git (sauf celle
   que lance `controle.js` en interne), aucun commit.
2. **Jamais l'outil Edit/Write sur une page** (il écrit en CRLF). Distracteurs : patchs JSON posés par
   `node scratchpad/lisp-sonde/pose.js <patchs.json> [--ecrire]`. Corps, exercice, explain : un script
   Node de remplacements littéraux, écrit avec l'outil Write, sur le modèle de
   `scratchpad/lisp-corr/l13.js` (refuse si l'ancien texte n'est pas unique). Jamais de heredoc. Dans
   le HTML, copie l'extrait tel qu'il est dans le fichier (`&lt;`, `&nbsp;`…).
3. **NE JAMAIS ÉCRIRE UN RÉSULTAT DE TÊTE : L'EXÉCUTER.** Racket 8.17 :
   `scratchpad/racket/racket/Racket.exe f.rkt` (`#lang racket/base` ; `eval` exige
   `(make-base-namespace)`). SBCL 2.5.8 :
   `SBCL_HOME="scratchpad/sbcl/x/PFiles/Steel Bank Common Lisp" "scratchpad/sbcl/x/PFiles/Steel Bank Common Lisp/sbcl.exe" --script f.lisp`.
   Tout bloc corrigé rend ce qu'il annonce, sous l'interprète de SON dialecte. Pour une règle de
   norme, cite R7RS (ou la CLHS) et distingue « prouvé par exécution », « établi par la norme » et
   « de mémoire ». **Une faute non confirmée ne se corrige pas** : laisse-la et dis pourquoi.
4. **LE DIALECTE, décision prise au 55ᵉ cours** : on ne réécrit pas un bloc d'un dialecte dans l'autre
   quand il suffit de **l'annoncer** (« en Common Lisp », « R6RS », « en Racket »). Quand un bloc
   MÊLE les deux et ne tourne nulle part, on le rend cohérent avec le dialecte qu'annonce la page
   (modèle : `lecon-13`, désormais en Common Lisp déclaré). Racket n'est pas la norme : ce qui est
   valide en R7RS (un `if` sans `else`) ne se corrige pas pour plaire à Racket.
5. **Un distracteur corrigé reste une thèse FAUSSE, précise, plausible, en français correct**
   (« LA RÈGLE QUI PRIME » de `scratchpad/CONSIGNE-LISP.md`), même longueur à ±10 %, même
   ponctuation et même nombre de phrases que ses options sœurs. **Simule-le avant de le poser** :
   `node scratchpad/lisp-sonde/essai2.js essais.json` (44 stratégies + w + k, contre HEAD) et
   `node scratchpad/lisp-corr/wk.js lecon-NN.html "texte"` (longueur, mots, w, k). Pas de mot
   absolu ajouté pour allonger ; pas de « chaque », « chaîne », « valeur », « parce que ».
6. **Garde-fou** : après chaque lot, `node scratchpad/lisp-sonde/controle.js --ref=df426ac` ne doit
   montrer AUCUN déplacement (état de départ : 0). **Une correction de CORPS change le vocabulaire de
   la page et peut rouvrir `k`** : relance-le après toute correction de corps. Vérifie aussi
   `node tools/mesure-lexique-qcm.js --liste=lisp` (0/0/0) et `node tools/mesure-mot-fetiche.js lisp`
   (0 alerte).
7. **Bonne réponse, explain, énoncé** : ne les modifie QUE pour une faute listée et confirmée, en
   gardant longueur, ponctuation et nombre de mots au plus près (simulé par `essai2.js`).
8. **Priorité** : toutes les moyennes, puis les basses réelles et prouvées.
9. À la fin : `node tools/verif-html.js` (0 attendu) et JSON des blocs valide.

## Groupes proposés (disjoints)
| groupe | leçons | moyennes | basses | total |
|---|---|---:|---:|---:|
| G1 | 01, 02, 03 | 4 | 8 | 12 |
| G2 | 04, 05, 06 | 3 | 9 | 12 |
| G3 | 07, 08, 09 | 8 | 18 | 26 |
| G4 | 10, 11, 12 | 4 | 14 | 18 |
| G5 | 13, 14 | 1 | 8 | 9 |
| G6 | 15 | 4 | 10 | 14 |

Points signalés à ne pas oublier : `fold-left` de l'antisèche de `lecon-10` (n° 51 — même décision
que `lecon-06` : l'annoncer R6RS, montrer `foldl`) ; l'énoncé de `lecon-06` q3 (n° 34, parenthèses de
l'appel) ; Deep Space 1 en `lecon-01` (n° 2 : 100 millions de MILES, soit **160 934 400 km** —
calculé, et le Remote Agent a piloté en mai 1999) ; le `t` de Common Lisp dans un `cond` Scheme
(`lecon-07`) ; `macroexpand` absent de Scheme (`lecon-08`) ; « Lisp a 67 ans » (`lecon-10` :
2026 − 1958 = 68).

## Après la correction : la CONTRE-RELECTURE (54ᵉ cours : 32 prises sur 176 corrections)
Un second workflow en lecture seule, chargé de DÉMOLIR les corrections (le diff depuis `df426ac`),
avant de clore. Puis clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` ;
`verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, assembleurs des études, index `--fresh` jusqu'au
point fixe, `verif.js --rapide`.

## Compte rendu attendu
Par faute : corrigée / laissée (raison), avec la preuve citée (fichier, sortie). Le résultat final de
`controle.js --ref=df426ac` sur tes leçons, et de `verif-html`.
