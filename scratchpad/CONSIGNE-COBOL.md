# Consigne d'écriture — les QCM du cours `cobol` (B4, point parallèle du 2026-11-10)

Préparée le 2026-11-10 dans la copie de travail `D:\test-claude-b4\cobol` (branche `b4/cobol`),
par un agent seul qui tient tous les rôles (écriture, relecture, contre-relecture). Mesures de
départ archivées dans `scratchpad/cobol-depart/` (hors git : sorties brutes des outils,
`questions.txt` = les 50 questions à plat). Sondes dans `scratchpad/cobol-sonde/` (copiées de
`tests-sonde` et repointées sur `pages/cobol/`, plus `aplat.js`, `texte.js`, `blocs.js` et
`eval.js`, qui simule un lot de patchs et rejoue les 44 stratégies sans rien écrire) et
`scratchpad/cobol-corr/` (`remplace.js`, `wk.js`).

Le cours : « COBOL : le langage des systèmes bancaires », 14 leçons, **50 questions** dont 8 de
bilan (`lecon-14`). Trois questions par leçon, sauf `lecon-14` (3 + 8).

## ⚠️ CE COURS S'EXÉCUTE — GnuCOBOL 3.2 PORTABLE, HORS DE TOUT DÉPÔT

Aucun compilateur n'était installé. Installé le 2026-11-10 dans `D:\outils-b4\cobol\` à partir
des **paquets officiels MSYS2** (`repo.msys2.org/mingw/ucrt64/`) : `mingw-w64-ucrt-x86_64-gnucobol
1~3.2-10` et sa chaîne `gcc` 16.2 (29 paquets ; chaque archive vérifiée contre le SHA256 de la base
`ucrt64.db`, décompressée par le zstd de Node 24 et extraite par un lecteur tar écrit pour
l'occasion : le `tar` de Git Bash refuse les liens durs sur ce disque). Script d'installation dans
le scratchpad de session (`cobol-outil/msys2.js`), lanceur `D:\outils-b4\cobol\cob.sh` :

```
bash /d/outils-b4/cobol/cob.sh fichier.cbl [-free] [options cobc]   # compile (cobc -x) puis exécute
```

`cobc (GnuCOBOL) 3.2.0`. Les essais vivent dans `D:\outils-b4\cobol\essais\` (jamais dans le dépôt).
Les fichiers indexés passent par Berkeley DB : faire chaque essai indexé dans un **dossier neuf**
(sous Windows `CLIENTS.DAT` et `clients.dat` sont le même fichier).

## LES ERREURS CLASSIQUES — TOUTES EXÉCUTÉES SOUS GnuCOBOL 3.2 AVANT D'ÊTRE ÉCRITES ICI

`essais/classiques.cbl` → `classiques.out`, plus `divers.cbl`, `l06.cbl`, `l07.cbl`, `l08.cbl`,
`l12d/l12.cbl`, `l13.cbl`, `l11/`, `bonnes/*.cbl`. N'emploie dans un distracteur que la croyance
que TA leçon établit, et sa réfutation telle que GnuCOBOL la rend :

| croyance fausse | ce que GnuCOBOL 3.2 rend |
|---|---|
| un MOVE numérique trop long coupe à droite | `MOVE 1234` vers `PIC 9(3)` → **234** (chiffres de tête perdus) ; `MOVE "ABCDE"` vers `X(3)` → **ABC** (le texte, lui, est coupé à droite) |
| les décimales excédentaires s'arrondissent | `MOVE 12.345` vers `9(3)V99` → **012.34** ; `COMPUTE … = 2 / 3` vers `9V99` → **0.66**, avec `ROUNDED` → **0.67** |
| un champ sans S refuse un négatif | `MOVE -5` vers `PIC 9(3)` → **005** (valeur absolue, sans erreur) ; vers `S9(3)` → **-005** |
| un débordement arrête le programme | `99 + 1` dans `PIC 99` → **00** sans message ; avec `ON SIZE ERROR`, le traitement de secours se joue et la cible **garde 99** |
| on peut calculer sur un champ édité | `ADD 1 TO ED` (`ZZ9.99`) → refusé : « 'ED' is not a numeric name » |
| le V occupe un octet | `S9(4)V99` = **6** octets ; `SIGN SEPARATE` → 7 ; `S9(7)V99 COMP-3` = **5** ; `S9(5) COMP-3` = **3** (`12345C`) ; `-1234.56` en `S9(7)V99 COMP-3` = `000123456D` |
| un COMP de 2 octets garde 12345 | `PIC 9(4) COMP` = **2** octets et `MOVE 12345` y laisse **2345** ; `PIC 9(5) COMP` = **4** octets |
| le décimal de COBOL se trompe comme un flottant | `0.10 + 0.20` en `9V99` = **0.30** exactement ; en `COMP-1` → **0.30000001** |
| une table commence à 0 | `-debug` : « subscript of 'E' out of bounds: 0 » ; sans contrôle, l'indice 13 d'une table de 12 passe sans message |
| SEARCH se passe d'index | « 'ARTICLE' not indexed » ; `SEARCH ALL` sans clé : « SEARCH ALL requires KEY phrase » |
| PERFORM VARYING 1..10 fait 11 tours | **10** tours, I vaut **11** à la sortie ; `PERFORM UNTIL` dont la condition est vraie d'emblée : **0** tour |
| le point est décoratif | après `IF X > 0 DISPLAY "a".`, la phrase suivante s'exécute **toujours** |
| l'ordre des divisions est libre | `DATA DIVISION` avant `IDENTIFICATION` → « PROGRAM-ID header missing » |
| un groupe a une PIC | « group item 'G' cannot have PICTURE clause » ; taille de `CLIENT` (20 + 3 + 9) = **32** |
| BY CONTENT renvoie le résultat | après `CALL "SP" USING BY REFERENCE R BY CONTENT T`, R vaut **999** (modifié), T reste **20.00** |
| un CALL littéral est toujours statique | sous GnuCOBOL par défaut, l'appelant se compile seul et échoue **à l'exécution** : « module 'CALC-TVA' not found » ; `-fstatic-call` le lie à la compilation |
| WRITE sur une clé présente la remplace | FILE STATUS **22** ; READ d'une clé absente **23** ; fin de fichier **10** ; REWRITE en accès DYNAMIC **00** sans READ préalable |
| DELIMITED BY SIZE vaut pour UNSTRING | `UNSTRING … DELIMITED BY SIZE` → « syntax error, unexpected SIZE » (SIZE est propre à STRING) |
| `CHAINE(3:2)` de BONJOUR = « ONJ » | **NJ** ; `(2:3)` = **ONJ** ; une référence de sous-chaîne sur un LITTÉRAL (`"BONJOUR"(2:3)`) ne compile pas |
| `INSPECT … REPLACING ALL SPACE BY "-"` ne touche que les espaces « du texte » | sur `PIC X(30)` contenant « LE CLIENT », tous les espaces de bourrage deviennent aussi des tirets |
| `MESSAGE`, `CODE` sont des noms libres | ce sont des mots réservés : « syntax error, unexpected MESSAGE » (et `CODE`) |

⚠️ **DISPLAY d'un champ `9(5)V99` sous GnuCOBOL 3.2 affiche le point décimal** (`00087.50`) : c'est
un réglage de GnuCOBOL (`pretty-display`), un mainframe IBM affiche `0008750`. Ne fonde aucun
distracteur sur ce détail.

**Ce qui ne s'exécute PAS ici** : le JCL, CICS, DB2 et le SQL embarqué, VSAM et IDCAMS (le
fichier indexé de GnuCOBOL est du Berkeley DB, pas du VSAM), le comportement exact du compilateur
IBM Enterprise COBOL (options DYNAM, TRUNC). Pour ceux-là : la source, citée, ou « non exécuté ».

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Test de recevabilité, pour CHAQUE distracteur : (1) je nomme l'erreur en une phrase ; (2) chaque
proposition a un référent ; (3) un débutant crédule pourrait le cocher ; (4) aucune parenthèse ni
queue de phrase de remplissage ; (5) aucune conjonction sans logique ; (6) tout comportement de
COBOL annoncé faux l'est **par exécution** (table ci-dessus, ou un essai neuf dans `essais/`).

⚠️ **Le piège propre à ce cours : un verbe ou une clause qui EXISTE.** COBOL a des centaines de mots
réservés ; un distracteur « Avec ROUND() » est faux, mais « avec la fonction INTEGER » serait un
autre calcul, et « SET X TO 5 » affecte bel et bien un index. Un distracteur qui cite un mot réel
doit lui prêter un rôle que ce mot n'a PAS, et que la page ne lui donne pas. Et la norme bouge :
`TYPE` existe depuis COBOL 2002, `FUNCTION UPPER-CASE` met en majuscules, `SET … TO TRUE` affecte
un niveau 88. Vérifie la thèse contre la page ET contre `cobc`.

## Pourquoi ce travail

`node tools/mesure-biais-qcm.js --seul=cobol` (2026-11-10, départ) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **98,7 %** | 98,0 % | 100,0 % |
| RESTREINDRE à la parenthèse / l'incise entre parenthèses | **73,5 % / 72,0 %** | 64 % / 62 % | 100,0 % |
| la plus détaillée | **68,3 %** | 60,0 % | 96,7 % |
| le mot technique exclusif | **60,7 %** | 48,0 % | 95,8 % |
| ECARTER la moins bavarde | **58,2 %** | 34,0 % | 94,1 % |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | **52,0 % / 52,5 %** | 36,0 % | 100,0 % |
| RESTREINDRE aux deux-points | 45,0 % | 26,0 % | 100,0 % |
| l'écho de la question | 43,3 % | 30,0 % | 80,0 % |
| ECARTER la plus courte | 38,3 % | 4,0 % | 100,0 % |
| la plus dense | 35,7 % | 86,0 % | 39,5 % |
| la seule qui nie | 35,0 % | 28,0 % | 57,1 % |
| la MAJUSCULE d'emphase | 34,0 % | 24,0 % | 66,7 % |
| point-virgule / deux phrases (et RESTREINDRE) | 32,5 % | 10,0 % | 100,0 % |

**74,0 %** des questions (37 sur 50) sont trahies par 5 indices ou plus. Rangs **50 / 0 / 0 / 0**,
cible **13 / 13 / 12 / 12** ; `plan-rangs-qcm` demande **9 485 caractères** sur 45 questions.
Biais inverse : **4 alertes** (DEUXIÈME 31,7 %, QUATRIÈME 31,8 %, TROISIÈME 30,5 %, la moins
bavarde 27,7 %). Mot fétiche : **1 alerte** (`procedure` 5 / 5, RESTREINDRE 29,7 %) et
`enregistrement` **6 bonnes / 0 distracteur** (RESTREINDRE 34,0 %, sous le seuil de couverture).
Lexique : `--liste=cobol` → 305 lignes, presque toutes les questions à mettre en forme.
Intrus lexical : EXCÈS direct **28,8 %** (exploitable), 0 question sûre.

## Les NEUF tics de lot — connus AVANT d'écrire (`mesure-tics-lot.js cobol --exemples`)

| tic | bonnes / distracteurs | rendement | gain au cours |
|---|---|---:|---:|
| **glose finale entre parenthèses** | **15 / 1** | 93,8 % | **47,0 %** |
| **deux-points médian** | **14 / 1** | 100,0 % | **44,5 %** |
| parenthèse ouverte par un article | 5 / 0 | 100,0 % | 32,5 % |
| adverbe de reprise (alors / ensuite / puis) | 5 / 2 | 100,0 % | 32,5 % |
| point-virgule médian | 5 / 0 | 100,0 % | 32,5 % |
| quatre segments séparés par virgule | 5 / 3 | 100,0 % | 31,0 % |
| « de fichier » | 3 / 1 | 75,0 % | 29,0 % |
| « un champ » | 3 / 3 | 75,0 % | 29,0 % |
| « procedure division » | 3 / 3 | 50,0 % | 28,0 % |

Le gabarit des bonnes réponses est « réponse (glose) », « réponse : explication », « réponse ;
conséquence » : donne-le à tes distracteurs, avec une glose qui PRÉCISE l'erreur.

## Ce qu'il faut tenir, dans l'ordre d'importance

1. **La longueur et les rangs** : suis le rang visé et la bande de `plan-rangs-qcm.js cobol`. Le
   rang en MOTS de la bonne réponse suit son rang en caractères (biais inverse). Une seule erreur,
   complète : la thèse fausse, PUIS sa justification fausse mais cohérente.
2. **La ponctuation, par marque** (`;`, `:`, parenthèses, tiret, barre oblique, guillemets, point
   interne) : les quatre options la portent, ou aucune. ⚠️ Le CODE porte de la ponctuation :
   `9(7)V99`, `CHAINE(3:2)`, `ASSIGN TO` après `SELECT ...`, `ex. ADD` (le point d'abréviation
   suivi d'une majuscule compte pour un **point interne** chez `plan-rangs --marques` : il le
   compte sur `lecon-04` q1/q2, `lecon-05` q2, `lecon-07` q1 — les distracteurs y portent donc
   aussi un « ex. MOT » ou un « ... MOT »).
3. **Les majuscules** : chaque mot-clé COBOL (`DISPLAY`, `PROCEDURE`, `COMP-3`) est une majuscule
   pour « la MAJUSCULE d'emphase » (34,0 % au départ) : les distracteurs portent autant de
   mots-clés que la bonne réponse.
4. **Le mot technique exclusif** (mots de 9 lettres et plus) : par mot, les quatre options le
   portent, ou deux, jamais un seul.
5. **Le lexique** : règle du `k` (OCCURRENCES de mots de 6+ lettres absents du corps de la page,
   comme `mesure-lexique-qcm.js`) — les quatre options portent le même `k`, et quand `k > 0` le
   même `w`. Un mot de moins de 6 lettres ne compte ni dans `w` ni dans `k`.
6. **Les absolus** (toujours, jamais, seul, tout) : 0, 2 ou 3 porteurs par question, jamais 1.
7. **La négation** (« la seule qui nie », 35,0 %) : 0, 2 ou 3 options qui nient.
8. **Trois erreurs différentes**, jamais le miroir de la bonne réponse, jamais « C'est l'inverse ».
9. **Le point interne** : `lecon-03` q3 a une bonne réponse en deux phrases — les trois
   distracteurs concluent aussi, par une règle fausse, ou rien.

## L'ORDRE DE TRAVAIL (un agent seul)

1. Lire la leçon en entier : c'est elle qui fixe le vocabulaire permis.
2. Pour chaque question, écrire les trois erreurs en une phrase chacune, vérifier chaque
   comportement annoncé contre la table ci-dessus ou par un essai `cobc` neuf.
3. Rédiger à la longueur imposée, simuler (`node scratchpad/cobol-sonde/eval.js <patchs.json>`),
   ajuster, poser (`pose.js --ecrire`), commiter le lot.
4. Après chaque lot : `mesure-tics-lot`, `mesure-mot-fetiche`, `mesure-lexique-qcm --liste=cobol`,
   `mesure-mot-question cobol`, `mesure-biais-inverse --toutes cobol`.
