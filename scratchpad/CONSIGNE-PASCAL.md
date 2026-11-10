# Consigne d'écriture — les QCM du cours `pascal` (B4, cours désigné 61ᵉ)

Préparée le 2026-11-10, à l'ouverture du cours, dans la copie de travail `D:\test-claude-b4\pascal`
(branche `b4/pascal`, un seul agent qui tient tous les rôles). Mesures de départ archivées dans
`scratchpad/pascal-depart/` (sorties brutes des outils ; `questions.txt` : les 59 questions à plat ;
`corps/` : le texte des 14 leçons). Sondes copiées de `tests-sonde` et repointées sur `pages/pascal/`
dans `scratchpad/pascal-sonde/` (`controle.js` à vide : **0 indicateur déplacé sur 59 questions**),
plus deux sondes neuves : `aplat.js` (les questions à plat) et `vague.js` (applique des patchs EN
MÉMOIRE et dit, question par question, ce que désigne chacune des 44 stratégies, avec rang, mots,
densité, `w`, `k` compté en occurrences comme l'outil lexique, absolus, mots prudents et marques).

Le cours s'intitule « Pascal & Delphi » : découvrir Pascal, variables et types, conditions et
boucles, procédures et fonctions, tableaux et chaînes, types définis (record, énuméré,
sous-domaine), pointeurs, unités, histoire (Turbo Pascal, Delphi, Free Pascal / Lazarus),
fichiers, énumérés et ensembles, récursivité, Object Pascal, projet (`lecon-14` : 4 questions de
leçon et 12 de bilan). **14 leçons, 59 questions.**

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Test de recevabilité, pour CHAQUE distracteur : (1) l'erreur se nomme en une phrase ; (2) chaque
proposition a un référent ; (3) un débutant crédule pourrait le cocher ; (4) aucune parenthèse ni
queue de phrase de remplissage ; (5) aucune conjonction sans logique ; (6) tout comportement du
compilateur ou de l'exécution annoncé dans un distracteur a été **exécuté** (table ci-dessous).

⚠️ **Le piège propre à ce cours : il y a PLUSIEURS Pascal.** Pascal ISO, Turbo Pascal, Delphi,
Free Pascal et ses modes (`fpc`, `objfpc`, `delphi`, `tp`). Un distracteur faux en Pascal standard
peut être VRAI en Delphi moderne ou sous Free Pascal. Exemples mesurés ou connus :
- **`writeln` d'un énuméré** : refusé en Pascal ISO et en Delphi, mais **Free Pascal affiche le
  NOM** (`Rouge`), dans les modes `fpc`, `objfpc`, `delphi`, `tp` (exécuté). Jamais « un nombre ».
- **Déclarer une variable après `begin`** : interdit en Pascal standard et sous FPC 3.2.2, mais
  **Delphi 10.3 et suivants acceptent les variables en ligne** (`begin var x := 5; …`). Ne pas
  écrire de distracteur « on peut déclarer après le begin » : il est vrai en Delphi récent.
- **`Exit(valeur)`** existe sous FPC et Delphi : « on renvoie avec `Exit` » n'est pas faux.
- **`GetMem`** alloue bel et bien de la mémoire dynamique pour un pointeur : ce n'est pas un
  distracteur pour « comment alloue-t-on de la mémoire dynamique ».
- **`private`** n'est pas privé à la classe : il l'est à l'UNITÉ (exécuté, voir plus bas).
Tiens-toi à des erreurs de FAIT nettes, fausses dans TOUS les dialectes que la leçon nomme, ou
fausses contre la page de TA leçon quand elle fixe le dialecte.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, PASCAL S'EXÉCUTE

**Free Pascal 3.2.2**, distribution officielle (`fpc-3.2.2.win32.and.win64.exe`, téléchargée sur
`downloads.freepascal.org`, SHA-256 `8c255390…bf08d3981b4924`) **déballée sans installation** par
innoextract 1.9 dans `D:\outils-b4\pascal\fpc\` (hors dépôt, aucun registre, aucun PATH modifié) ;
configuration générée par `fpcmkcfg` dans `D:\outils-b4\pascal\config\fpc.cfg`. Lanceur :

```
bash scratchpad/pascal-fpc/pc.sh dossier/essai.pas [options fpc]   # compile puis exécute
PC_NORUN=1 bash scratchpad/pascal-fpc/pc.sh essai.pas -Mdelphi     # compile seulement
```

Cible i386-win32 (`ppc386`). Mode par défaut `fpc` : **`integer` y fait 16 bits** (`-Mdelphi` ou
`{$mode objfpc}` : 32 bits). Ce qui ne s'exécute PAS ici : **Delphi** (ni le compilateur
d'Embarcadero, ni la VCL), **Turbo Pascal**, **Lazarus** (l'IDE), et un vrai Pascal ISO (le mode
`-Miso` de FPC n'est qu'une approximation). Pour ceux-là : la source, et dire « non exécuté ».

**Table des erreurs classiques — TOUTES EXÉCUTÉES à la préparation** (`scratchpad/pascal-fpc/`,
un dossier par leçon) :

| croyance fausse | ce que FPC 3.2.2 rend |
|---|---|
| `;` avant `else` est toléré | `Fatal: Syntax error, ";" expected but "ELSE" found` |
| `while` exécute au moins une fois | condition fausse d'emblée : **0 passage** ; `repeat … until` vraie d'emblée : **1 passage** |
| sans `begin … end`, les deux lignes sont dans le `then` | `age := 10` : `Bienvenue` s'affiche quand même |
| on peut modifier `i` dans un `for` | `Error: Illegal assignment to for-loop variable "i"` |
| `if age >= 18 and age < 65` marche sans parenthèses | `Error: Incompatible types: got "Boolean" expected "LongInt"` |
| `7 div 2` vaut 3.5 / `7 mod 2` vaut 0 | `3` et `1` ; `7 / 2` → `3.5` ; `-7 div 2` → `-3`, `-7 mod 2` → `-1` |
| `n := 7 / 2` avec `n : integer` passe | `Error: Incompatible types: got "Extended" expected "SmallInt"` |
| `writeln(9.99)` affiche `9.99` | ` 9.9900000000000002E+000` ; `:0:2` → `9.99` |
| une fonction renvoie avec `return` | `Error: Identifier not found "return"` (mais `Exit(x*x)` compile et rend 25) |
| une fonction sans affectation de résultat rend 0 | valeur indéterminée (mesuré : `4208981`) |
| un paramètre sans `var` modifie l'original | `x := 21` reste **21** ; avec `var` : **42** |
| une variable locale se lit depuis le programme | `Error: Identifier not found "temp"` |
| `t[6]` sur `array[1..5]` lève toujours une erreur | sans `{$R+}` : **aucune** erreur ; avec : `Runtime error 201` (mode delphi + SysUtils : `ERangeError : Range check error`) |
| `length('Pascal')` vaut 5 ou 7 | **6** ; `copy('Bonjour',1,3)` → `Bon` ; `pos('jour','Bonjour')` → `4` |
| `writeln(feu)` affiche un nombre | **`Rouge`** (modes fpc, objfpc, delphi, tp, macpas) |
| `feu := 0` affecte la 1ʳᵉ couleur | `Error: Incompatible types: got "ShortInt" expected "TCouleur"` |
| un sous-domaine `0..20` refuse toujours 25 | `note := 25` : **simple avertissement**, la variable vaut 25 ; erreur seulement avec `{$R+}` ; `note := x` (x = 25) sans `{$R+}` : **25**, aucun signal |
| `p := @x; p^ := 100` ne change pas `x` | `x` vaut **100** |
| déréférencer `nil` renvoie 0 | `Runtime error 216` (violation d'accès) |
| `x ^ 3` élève à la puissance | `Error: Illegal qualifier` |
| `new` sans `dispose` : la mémoire revient seule | 1 000 `new` sans `dispose` : **16 000 octets** encore alloués |
| deux unités peuvent s'importer dans leur `interface` | `Fatal: Circular unit reference between UB and UA` ; un `uses` en `implementation` compile |
| sans `Close`, le fichier est quand même écrit | deux `Writeln` puis fin du programme : **fichier de 0 octet** |
| `Seek` marche sur un fichier texte | `Error: Call by var for arg no. 1 has to match exactly: Got "Text" expected "File"` |
| lire après la fin d'un fichier TEXTE lève une erreur | **non** : `Readln` rend une chaîne vide, `Read` d'un entier rend 0, `IOResult = 0` |
| lire après la fin d'un fichier TYPÉ est sans danger | `Runtime error 100` |
| `Append` crée le fichier s'il n'existe pas | `Runtime error 2` (fichier introuvable) |
| `try … except … finally` en un seul bloc | `Fatal: Syntax error, "ON" expected but "FINALLY" found` (mode delphi) |
| `Ord(Lundi)` vaut 1 | **0** ; `Succ(Mercredi)` → `Jeudi` ; `Succ(Dimanche)` constant → erreur de compilation |
| `set of integer` est permis | `Error: illegal type declaration of set elements` |
| `if c = '0'..'9'` / `c in 0..9` / `if Ord(c)` | trois erreurs de compilation |
| récursion sans cas de base : boucle infinie silencieuse | `Runtime error 202` (débordement de pile) |
| `Fib(20)` récursif naïf : 20 appels | **21 891 appels** (Fib(5) : 15) |
| `private` interdit l'accès hors de la classe | **même fichier : `c.FSolde := -1000` compile et s'exécute** (modes objfpc et delphi) ; d'une autre unité : `identifier idents no member "FSolde"` ; `strict private` : refusé même dans le fichier |
| `StrToInt('abc')` rend 0 | exception : `"abc" is an invalid integer` |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **90,4 %** des QCM de `pascal` en cochant l'option la
plus longue (`node tools/mesure-biais-qcm.js --seul=pascal`, 59 questions dont 12 de bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **90,4 %** | 96,6 % | 93,0 % |
| la plus détaillée | **68,5 %** | 59,3 % | 97,1 % |
| le mot technique exclusif | **62,6 %** | 49,2 % | 89,7 % |
| RESTREINDRE à la parenthèse / l'incise | **62,4 % / 61,9 %** | 55,9 % | 90,9 % |
| ponctuation forte (seule / RESTREINDRE) | **53,8 % / 54,9 %** | 40,7 % | 95,8 % |
| l'écho de la question | **46,6 %** | 33,9 % | 80,0 % |
| ÉCARTER la moins bavarde | 44,4 % | 15,3 % | 77,8 % |
| RESTREINDRE aux deux-points | 43,8 % | 27,1 % | 93,8 % |
| le point-virgule (seule / RESTREINDRE) | 36,4 % / 37,4 % | 15,3 % | **100,0 %** |
| ÉCARTER la plus courte | 35,3 % | 1,7 % | 100,0 % |
| la seule qui nie | 33,1 % | 30,5 % | 50,0 % |
| la plus prudente | 30,9 % | 10,2 % | 83,3 % |
| la MAJUSCULE d'emphase | 30,1 % | 6,8 % | **100,0 %** |

**38 questions sur 59 (64,4 %)** sont trahies par 5 indices ou plus.

## Le travail est de l'ALLONGEMENT

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **79,5 caractères** |
| longueur moyenne d'un distracteur | **21,6 caractères** |
| **rapport** | **3,68** (`tests` : 3,24 ; `bash` : 4,36) |

`node tools/plan-rangs-qcm.js pascal` demande **8 564 caractères** sur **53 questions sur 59**.
Rangs actuels **54 / 1 / 3 / 1**, cible **15 / 15 / 15 / 14**. Suis le rang visé et la bande de
caractères de chaque option. Donne au distracteur la MÊME STRUCTURE que la bonne réponse : la
réponse fausse, PUIS sa justification fausse mais cohérente.

⚠️ Les distracteurs actuels sont des **boutades ou des renvois creux** (« C'est l'inverse »,
« Aucun intérêt », « Pour aller plus vite », « Copier, coller, exécuter, prier ») et **11
commencent par « Parce que »** (3 bonnes réponses) : aucun débutant ne les coche. Les contresens
réels sont dans la table ci-dessus et dans les encadrés « Piège fréquent » de chaque leçon.

⚠️ **Deux distracteurs actuels sont VRAIS ou défendables** et ne doivent pas survivre : `GetMem
seul` (bilan q11 : `GetMem` alloue bien de la mémoire dynamique) et `class (seul)` (bilan q10 : une
classe a aussi plusieurs champs).

⚠️ **Le bilan de `lecon-14`** a des bonnes réponses très courtes (`:=`, `writeln`, `uses`,
`Reset`, `in`, `Free`, 2 à 7 caractères) : le plan y demande de **RESSERRER** ou de tenir une
bande de quelques caractères. Les distracteurs y sont **les noms voisins que le cours établit ou
qu'un débutant venu d'un autre langage tapera** (`=`, `write`, `Rewrite`, `Append`, `Dispose`,
`Destroy`…), chacun réellement faux pour la question posée.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes pascal` : **5 alertes** au départ (la DEUXIÈME plus
longue 32,1 % en global, la QUATRIÈME 31,5 %, la TROISIÈME 29,9 %, la moins bavarde 28,7 %, écarter
les deux extrêmes 26,3 %). Le rang en MOTS de la bonne réponse doit suivre son rang en CARACTÈRES.
**L'attaque** : les quatre options d'une question commencent par le même type de mot, ou par
quatre différents. « Parce que » ne s'emploie en tête d'un distracteur que si la BONNE réponse
commence ainsi (`lecon-03` q1, `lecon-07` q3, `lecon-12` q4) — et alors dans les trois.

### (2) LA PONCTUATION — et L'UNION (54,9 %, rendement 95,8 %)
Par marque (`;`, `:`, parenthèse, tiret, guillemets, flèche, barre oblique, virgule décimale),
**les quatre options la portent, ou aucune** ; vérifie aussi l'UNION (« PONCTUATION FORTE » = `:` ou
`;` ou tiret cadratin). ⚠️ **Le CODE porte de la ponctuation** : `end;`, `Carre := x*x;`,
`Seek(f, n)`, `t[3]`, `uses SysUtils;`, `p^` comptent. `:=` porte un DEUX-POINTS : une option qui
cite `x := 5` est « aux deux-points ». Et `(Lundi, Mardi, …)` est une incise entre parenthèses.

### (3) LES SEPT TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js pascal --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **glose finale entre parenthèses** | **16 / 2** | 16 | **93,8 %** | **43,6 %** |
| **deux-points médian** | **15 / 6** | 15 | **86,7 %** | **40,7 %** |
| **point-virgule médian** | **12 / 4** | 10 | **90,0 %** | **36,0 %** |
| parenthèse ouverte par un article | 6 / 0 | 6 | 100,0 % | 32,6 % |
| « de la » | 5 / 0 | 5 | 100,0 % | 31,4 % |
| verbe conjugué en fin d'option | 13 / 13 | 14 | 50,0 % | 30,9 % |
| « la mémoire » | 4 / 1 | 5 | 80,0 % | 29,7 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (une glose) » : donne-le aux distracteurs de la MÊME question, avec un contenu qui dit
quelque chose — une glose finale qui PRÉCISE l'erreur, jamais une parenthèse vide de sens.
⚠️ Ne crée pas le tic inverse : là où la bonne réponse n'a ni `:` ni `;` ni glose, les distracteurs
n'en ont pas non plus.

### (4) LES MOTS FÉTICHES — 0 alerte au départ
`node tools/mesure-mot-fetiche.js pascal` : `parce` (3 bonnes / 11 distracteurs), `valeur` (7 / 3),
`mémoire` (5 / 2), `variable` (4 / 8), `programme` (1 / 7), `fichier` (1 / 7). **Ne fabrique pas
d'alerte** : un mot posé partout devient une signature de distracteur (`chaque` sur `bash` : 10 /
46 après la vague). Vise environ 1 bonne pour 3 distracteurs ; `valeur` et `mémoire`, mots de
BONNE réponse, peuvent entrer dans des distracteurs là où ils ont un sens.

### (5) LE MOT TECHNIQUE EXCLUSIF (62,6 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou au moins deux (jamais une seule).
`node tools/mesure-mot-question.js pascal --plan` : **94 mots à traiter sur 21 questions** ;
lecture EXCÈS à **32,6 %, 4 questions sûres**. Cible : par mot de 5 lettres et plus, jamais porté
par exactement 3 options sur 4 ; et chaque option porte au moins un mot à elle (alors l'EXCÈS
désigne les quatre et ne tranche pas).

### (6) L'ÉCHO DE L'ÉNONCÉ (46,6 %, rendement 80,0 %)
Les quatre options portent le **même nombre** de mots de 4 lettres et plus repris de l'énoncé.

### (7) L'INDICE LEXICAL — 49 exploitables, 20 retournées, 51 à mettre en forme sur 59
`node tools/mesure-lexique-qcm.js --liste=pascal`. **Règle du `k`** : les QUATRE options portent
le même nombre de mots de 6+ lettres absents du corps de la page — **compté en OCCURRENCES**.
**Règle du `w`** : quand `k > 0`, les quatre portent aussi le même nombre de mots de 6+ lettres.
Un mot de moins de 6 lettres ne compte ni dans `w` ni dans `k` : c'est le levier. Contrôle :
`node scratchpad/pascal-sonde/vague.js <patchs> lecon-NN.html`.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
`toujours`, `jamais`, `uniquement`, `seulement`, `aucun(e)`, `impossible`, `obligatoirement`,
`rien`… Même règle pour les mots PRUDENTS (`peut`, `permet`, `selon`, `souvent`, `notamment`) et
pour la NÉGATION (`ne`, `pas`, `n'`, `jamais`, `aucun`, `rien`).

### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE — les quatre options ont le MÊME nombre de phrases
Au départ aucune option n'a deux phrases : **n'en crée pas**. Le point de `end.` n'est pas suivi
d'une majuscule : il ne compte pas, mais n'écris pas « end. Le … ».

### (11) LA MAJUSCULE D'EMPHASE (30,1 %, rendement 100 %)
Quatre bonnes réponses portent seules des capitales : `PC` (`lecon-09` q1), `FPC` (`lecon-09`
q3), `ET` (`lecon-11` q2), `SUIT` (`lecon-11` q4). Dans ces questions, au moins deux autres options
en portent aussi. Ailleurs, n'en crée pas. Les sigles de la liste `SIGLES` de l'outil (`IDE`,
`ISO`, `EOF`, `MS`…) ne comptent pas ; `PC`, `FPC`, `DOS`, `VCL`, `LCL`, `TP7` NE SONT PAS dans la
liste : ils comptent comme un cri.

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js pascal <sha>`. Exception : une faute PROUVÉE (exécution de
   préférence), écrite en tête du rapport.
2. **Aucun distracteur ne doit devenir vrai ni DISCUTABLE** — voir le piège des dialectes.
3. **JSON valide, sans BOM, sans CRLF** — garanti si l'on passe par `pose.js`. ⚠️ La copie de travail
   avait été extraite en CRLF (`core.autocrlf=true`) : les 15 pages du cours ont été ramenées en LF
   (le contenu de l'index git est LF : aucun diff). Dans un patch JSON, un antislash se double et un
   guillemet droit s'échappe ; préfère « » dans le texte.
4. **Aucune URL externe** dans le contenu.

## L'ORDRE DE TRAVAIL
1. Lire la leçon en entier — le corps établit ce que l'on a le droit d'écrire.
2. `node tools/plan-rangs-qcm.js pascal` : rang visé et bande de chaque option.
3. Pour chaque question, écrire les **trois erreurs** en une phrase chacune, **avant** de rédiger,
   et exécuter sous FPC chaque comportement annoncé.
4. Rédiger à la longueur imposée ; étoffer l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. `node scratchpad/pascal-sonde/vague.js <patchs> lecon-NN.html` : « BONNE seule : aucune » sauf
   les stratégies de RANG et de DENSITÉ (qui désignent toujours une option, et se dosent au cours).
6. Poser (`pose.js --ecrire`), relancer les mesures du cours, **commiter le lot**.

## Lots (un agent, commit après chaque lot)
| lot | leçons | questions |
|---|---|---:|
| 1 | lecon-01, lecon-02, lecon-03 | 9 |
| 2 | lecon-04, lecon-05, lecon-06 | 9 |
| 3 | lecon-07, lecon-08, lecon-09 | 9 |
| 4 | lecon-10, lecon-11 | 8 |
| 5 | lecon-12, lecon-13 | 8 |
| 6 | lecon-14 (4 questions + 12 de bilan) | 16 |
