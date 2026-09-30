# Consigne d'écriture — les QCM du cours `bash` (B4, 59ᵉ cours)

Préparée le 2026-09-30, à la clôture du 58ᵉ cours (`r`). Mesures de départ archivées dans
`scratchpad/bash-depart/` (sorties brutes des outils, et `classiques.sh` / `classiques.out` : la
table des erreurs classiques EXÉCUTÉE). Sondes prêtes dans `scratchpad/bash-sonde/` (`controle.js`
v2, `simule.js`, `essai.js`, `essai2.js`, `essai3.js`, `pose.js`, `rempl.js`, `k.js`, `kdiff.js`,
`dosage.js`, `chaque.js`) et `scratchpad/bash-corr/` (`remplace.js`, `wk.js`), copiées de `r-sonde`
et pointées sur `pages/bash/` (`controle.js` à vide : **0 indicateur déplacé sur 56 questions**).

Tu écris les **distracteurs** d'un lot de questions du cours `bash` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).
Le cours s'intitule « Bash » : le terminal et le shell, naviguer dans le système de fichiers,
manipuler fichiers et dossiers, lire, chercher et filtrer du texte, variables, expansions et
guillemets, écrire son premier script, conditions et boucles, fonctions, robustesse et
automatisation, `sed` et `awk`, processus, signaux et tâches de fond, scripts de production et
outils modernes, déboguer ses scripts, expansions de paramètres, tableaux indexés et associatifs,
entrées/sorties avancées, puis un projet (`lecon-16` : un script de sauvegarde robuste,
**11 questions dont 8 de bilan**). 16 leçons, 3 questions chacune, 56 questions.

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-écris un patch.

Les QCM sont dans `pages/bash/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-16`). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Écris tes patchs dans `scratchpad/bash-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/bash-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js`
refuse de toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un
fichier qui contient un antislash ou un `$` : l'outil Bash en mange un niveau. Écris tes scripts
avec Write — c'est DOUBLEMENT vrai ici, où le sujet du cours est justement ce que le shell fait
des `$`, des `\` et des guillemets.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Du 53ᵉ au 58ᵉ cours, après des vagues où toutes les mesures étaient vertes, la relecture a encore
trouvé des distracteurs inintelligibles, des fautes de français et **des distracteurs VRAIS** —
des queues de phrase ajoutées pour tenir un compte de caractères, des parenthèses qui n'énoncent
rien (« un vecteur de doubles (tirés) »).

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette forme » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).
6. **Aucun distracteur qui annonce un comportement sans le prouver faux** : si un distracteur dit
   « `$*` et `$@` rendent la même chose » ou « `false | true` renvoie 1 », le comportement vrai a
   été **exécuté** (voir plus bas), pas supposé.

⚠️ **Le piège propre à ce cours : en shell, presque tout dépend d'une OPTION, du SHELL ou de
l'OUTIL.** « Un pipeline renvoie le code de sa dernière commande » est faux sous `set -o pipefail` ;
« un glob sans correspondance reste tel quel » est faux sous `shopt -s nullglob` ; « `[[ ]]` compare
des chaînes » est faux pour `-eq` ; « `sed -i` modifie le fichier » s'écrit `sed -i ''` sur macOS
(BSD) ; les tableaux associatifs, `${s^^}` et `mapfile` n'existent pas dans le Bash 3.2 de macOS ni
dans `sh` (POSIX). Un distracteur qui absolutise un comportement peut être **vrai avec une option
que la leçon cite ailleurs, ou dans l'autre shell** : vérifie que ta thèse est fausse **dans le
contexte exact de la question**, contre la page ET par exécution.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, BASH S'EXÉCUTE

L'outil Bash de cette machine EST un Bash : **GNU bash 5.3.9** (Git Bash, MSYS), avec **GNU sed
4.9, GNU awk 5.4.0, GNU grep 3.0**, `find`, `xargs`, `tar`, `sort`, `uniq`, `cut`, `wc`.

```
bash scratchpad/bash-<ton lot>/<essai>.sh          # un script écrit avec l'outil Write
bash -x scratchpad/bash-<ton lot>/<essai>.sh       # avec la trace (leçon 12)
```

- Écris le fichier `.sh` avec l'outil **Write** dans ton dossier (`scratchpad/bash-<ton lot>/`),
  puis lance-le par `bash fichier.sh`. **Ne tape pas le code à tester dans la ligne de commande de
  l'outil** : ses `$`, ses `\` et ses guillemets y seraient interprétés une fois de trop.
- Travaille dans un dossier jetable : `cd "$(mktemp -d)" || exit 1` en tête de script. **Aucun
  `rm -rf` sur un chemin construit avec une variable**, aucune écriture hors de ce dossier.
- Pour relever un message d'erreur et continuer, isole la ligne dans un sous-shell : `( ... ) 2>&1`.
- **Ce qui ne s'exécute PAS fidèlement ici** (Windows sous le capot) — pour ceux-là, cite la source
  (manuel de Bash `gnu.org/software/bash/manual`, pages `man` de GNU coreutils, POSIX) et distingue
  « prouvé par exécution », « établi par la source » et « de mémoire » :
  - **les permissions** : `chmod +x` / `-x`, « Permission denied », `ls -l` — mesuré à la
    préparation, un fichier sans bit `x` s'exécute quand même et `ls -l` ne montre pas le bit ;
  - `sudo`, les utilisateurs et groupes, `cron` / `crontab` (absents), `systemctl`, `/proc`,
    les liens symboliques (`ln -s` copie), `rsync`, `jq`, `tmux`, `fzf`, **ShellCheck** et `shfmt`
    (absents) ;
  - les **signaux** et les tâches de fond sont approximatifs (`kill` envoie bien SIGTERM : code
    **143** mesuré ; `Ctrl+Z`, `fg`, `bg`, `nohup`, `disown` ne se testent pas sans terminal) ;
  - les chemins (`/c/Users/…`, pas de `/home`), `~`, `$HOME`, `$PATH` sont ceux de Git Bash.
  Si la page affirme autre chose que la source ou que l'exécution, **tu le remontes**, tu ne
  tranches pas de mémoire.
- **Codes de retour, comptes de lignes, arithmétique** : **toujours par Bash**, jamais de tête.

**Erreurs classiques de débutant** (n'utilise que celles que TA leçon établit). Toutes les lignes
ont été **exécutées** à la préparation (`scratchpad/bash-depart/classiques.out`, bash 5.3.9) :

| croyance fausse | ce que Bash rend |
|---|---|
| les guillemets simples et doubles se valent | `echo 'Bonjour $nom'` → `Bonjour $nom` ; `echo "Bonjour $nom"` → `Bonjour Ada` |
| `x = 5` affecte 5 à `x` | `x: command not found` — aucune espace autour du `=` |
| `$f` et `"$f"` passent le même argument | `f="mon fichier.txt"` : sans guillemets **2** arguments, avec **1** |
| `[ $a = "x" ]` marche avec `a` vide | `[: =: unary operator expected` ; quoté, le test rend simplement **1** |
| `-eq` et `=` sont interchangeables | `[ "01" = "1" ]` → code **1** ; `[ 01 -eq 1 ]` → code **0** ; `[ 10 -eq 10.0 ]` → `integer expected` |
| `[[ 10 < 9 ]]` compare des nombres | code **0** (vrai : ordre lexicographique) ; `(( 10 < 9 ))` → code **1** |
| 1 veut dire « vrai / succès » | `true` → **0**, `false` → **1**, `ls /inexistant` → **2** |
| `$?` garde le code de la commande qui a échoué | après `false; echo …`, `$?` vaut **0** (celui de l'`echo`) |
| un pipeline échoue dès qu'une commande échoue | `false \| true` → **0** ; avec `set -o pipefail` → **1** |
| une variable modifiée dans `… \| while read` est gardée | après la boucle `n=0` (sous-shell) ; avec `done < <(…)` → `n=3` |
| `"$*"` et `"$@"` sont identiques | avec `"a b" c` : `"$*"` → **1** mot `[a b c]` ; `"$@"` → **2** `[a b]` `[c]` ; `$@` nu → **3** |
| `2>&1 > f` envoie tout dans le fichier | `> f 2>&1` : l'erreur est dans le fichier (1 ligne) ; `2>&1 > f` : fichier **vide**, l'erreur reste à l'écran |
| `>` ajoute à la fin du fichier | deux `>` de suite : **1** ligne ; `>>` ajoute : 2 lignes |
| `$(( ))` sait diviser avec une virgule | `$((7 / 2))` → **3** ; `$((7 % 2))` → 1 ; `$((1.5 + 1))` → `arithmetic syntax error` ; `$((2 ** 10))` → 1024 |
| `08` est le nombre huit | `$((010))` → **8** (octal) ; `$((08))` → `value too great for base` ; `$((10#08))` → 8 |
| un tableau commence à l'indice 1 ; `$t` rend tout le tableau | `${t[0]}` → `a` ; `$t` → **`a`** (le premier) ; `${#t[@]}` → 3 ; `${#t}` → **1** (longueur du premier élément) ; `${t[-1]}` → `c` |
| `%` et `%%` (ou `#` et `##`) rendent la même chose | `f=archive.tar.gz` : `${f%.*}` → `archive.tar` ; `${f%%.*}` → `archive` ; `${f#*.}` → `tar.gz` ; `${f##*.}` → `gz` |
| `${v:-defaut}` affecte la variable | `v` reste **vide** ; `${v:=defaut}` l'affecte |
| `${s/o/0}` remplace toutes les occurrences | `b0njour` (la première) ; `${s//o/0}` → `b0nj0ur` ; `${#s}` → 7 ; `${s:0:3}` → `bon` ; `${s^^}` → `BONJOUR` |
| `set -e` arrête le script à la moindre commande en échec | pas à gauche de `\|\|` ni dans la condition d'un `if` : le script continue ; un `false` nu l'arrête (code **1**) |
| une variable non définie est une erreur | sans `set -u` elle vaut la chaîne vide ; avec : `unbound variable` |
| `return` renvoie une valeur | un **code** (`$?` → 3) ; une valeur se capture par `$(f)` sur ce que la fonction affiche ; `local` reste dans la fonction, une variable sans `local` est **globale** |
| `( … )` et `{ …; }` sont équivalents | après `( y=2 )`, `y` vaut encore **1** ; après `{ y=3; }`, **3** ; un `cd` dans `( )` ne déplace pas le shell |
| `grep -c` compte les occurrences | les **lignes** : `aa aa` → **1** ; `grep -o aa \| wc -l` → 2 ; rien trouvé → code **1** |
| `for x in $(ls *.txt)` parcourt les fichiers | il découpe aux espaces : 6 fichiers dont 2 avec une espace → **8** tours ; `for x in *.txt` → **6** |
| un glob sans correspondance ne fait aucun tour | **un** tour avec le motif littéral `[*.xyz]` ; avec `shopt -s nullglob` → 0 |
| `read` lit la ligne telle quelle | sans `-r` il mange l'antislash : `a\tb` → `atb` ; `read -r` → `a\tb` |
| `echo $v` garde les retours à la ligne | `l1 l2` sur une ligne ; `echo "$v"` → 2 lignes |
| `sed 's/a/b/'` modifie le fichier et toutes les occurrences | `a-a-a` → `b-a-a` (la première par ligne ; `g` → `b-b-b`) et le fichier est **intact** sans `-i` |
| `awk` numérote les champs à partir de 0 | `$1` = premier champ, `$NF` = dernier, `NF` = 3, **`$0` = la ligne entière** |
| `uniq` retire tous les doublons | seulement les **adjacents** : `b a b` → 3 lignes ; après `sort` → 2 ; `sort` sans `-n` classe `10` avant `9` |
| `[ -n "" ]` est vrai | code **1** ; `[ -z "" ]` → **0** ; `[ ]` vide → 1 ; `[ -f /inexistant ]` → 1 |
| `trap … EXIT` change le code de sortie | le piège s'exécute et le code reste **4** ; un processus tué par SIGTERM rend **143** (128 + 15) |
| un here-document ne développe jamais les variables | `<<FIN` développe `$nom` ; `<<'FIN'` le laisse tel quel |
| `a && b \|\| c` est un `if / else` | `true && false \|\| echo …` : l'`echo` s'exécute (c'est `b` qui a échoué) |
| `mkdir` crée les dossiers parents ; `cp` copie un dossier | `mkdir d1` deux fois → `File exists` ; `mkdir -p d1/a/b` → 0 ; `cp d1 d2` → `-r not specified; omitting directory` ; `rmdir` d'un dossier plein → `Directory not empty` |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **95,5 %** des QCM de `bash` en cochant l'option la plus
longue. Relevé du 2026-09-30, `node tools/mesure-biais-qcm.js --seul=bash` (56 questions, dont 8 de
bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **95,5 %** | 96,4 % | 98,1 % |
| la plus détaillée | **69,2 %** | 57,1 % | 96,9 % |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | **66,5 % / 67,6 %** | 55,4 % | **100,0 %** |
| RESTREINDRE à la parenthèse | **65,6 %** | 53,6 % | **100,0 %** |
| l'incise entre parenthèses | **62,9 %** | 50,0 % | **100,0 %** |
| le mot technique exclusif | **62,5 %** | 58,9 % | 84,8 % |
| la seule avec un point-virgule (et RESTREINDRE) | **54,0 % / 54,5 %** | 41,1 % | 95,7 % |
| l'écho de la question | **53,4 %** | 42,9 % | 83,3 % |
| ÉCARTER la moins bavarde | 48,4 % | 19,6 % | 90,9 % |
| RESTREINDRE aux deux-points | 42,6 % | 23,2 % | **100,0 %** |
| la MAJUSCULE d'emphase | 31,7 % | 8,9 % | **100,0 %** |
| la plus prudente ; la seule en deux phrases | 29,0 % | 5,4 % | **100,0 %** |
| la seule qui nie | 28,9 % | 19,6 % | 36,4 % |
| la seule avec une barre oblique | 28,6 % | 7,1 % | 75,0 % |

**75,0 %** des questions (42 sur 56) sont trahies par **5 indices ou plus** sur 44.

## Le travail est de l'ALLONGEMENT

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **111,4 caractères** |
| longueur moyenne d'un distracteur | **25,6 caractères** |
| **rapport** | **4,36** (`r` : 4,42 ; `lisp` : 4,19 ; `observabilite` : 3,60 ; `docker` : 3,13) |

`node tools/plan-rangs-qcm.js bash` demande **12 252 caractères** sur **53 questions sur 56**.
Rangs actuels **55 / 1 / 0 / 0**, cible **14 / 14 / 14 / 14**. **Suis EXACTEMENT** le rang visé et la
bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la bonne
réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

⚠️ Les distracteurs actuels sont presque tous des **renvois creux** (« C'est l'inverse » : le mot
`inverse` est dans **10 distracteurs et 0 bonne réponse** ; « Parce que… » : **25 distracteurs
contre 9 bonnes réponses**) : aucun débutant ne les coche, et ils ne disent rien. Un distracteur de
200 caractères se construit avec un **mécanisme faux complet** — ce que l'apprenant croit que le
shell fait, puis la conséquence qu'il en tire. Les contresens réels sont dans la table ci-dessus et
dans les encadrés « Attention » / « Erreur fréquente » de ta leçon.

⚠️ **Le bilan de `lecon-16` a des bonnes réponses très courtes** (`$@`, un nom de commande, une
forme de boucle de 18 à 21 caractères) : là, le plan demande de **RESSERRER** ou de tenir une bande
de quelques caractères. Pour une syntaxe attendue, les distracteurs sont **les formes que donnent
les erreurs classiques** (`$*` pour `$@`, `${t}` pour `${t[@]}`, la syntaxe d'un autre langage) —
**chacune exécutée**, et chacune réellement fausse en Bash (`for ((i=0;i<3;i++))` EXISTE).

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes bash` rend **5 alertes** au départ (la QUATRIÈME plus
longue 32,1 % en global, la DEUXIÈME 31,7 %, la TROISIÈME 30,8 %, la moins bavarde 29,2 %,
l'attaque unique 27,4 %). **Le rang en MOTS de la bonne réponse doit valoir son rang en
CARACTÈRES.** Quand la bonne réponse est la plus courte, qu'**un** de ses distracteurs ait autant de
mots qu'elle (égalité) plutôt que tous davantage — et vise qu'un distracteur en ait **un de moins**
quand la bonne est au rang 3. **L'attaque** : les quatre options d'une question commencent par le
même type de mot (un nom de commande, « Parce que », un article), ou par quatre différents.

### (2) LA PONCTUATION — et L'UNION (67,6 %, rendement 100 %)
Par marque (`;`, `:`, parenthèse, tiret, barre oblique, guillemets « », flèche `→`, virgule
décimale), **les quatre options la portent, ou aucune** ; vérifie aussi l'UNION (« PONCTUATION
FORTE » = `:` ou `;` ou tiret). ⚠️ **Dans ce cours, le CODE porte toute la ponctuation du monde** :
`ls -la`, `set -e` et `--help` comptent comme tiret, `/etc/passwd` et `s/a/b/` comme barre oblique,
`$(cmd)` et `${v}` comme parenthèse ou accolade, `cmd1; cmd2` comme point-virgule, `${v:-x}` et
`PATH=a:b` comme deux-points, `"$f"` comme guillemets, `2>&1` et `|` comme signes, `$HOME` et `EXIT`
comme majuscule d'emphase, `script.sh` comme point. Compte-les.

### (3) LES DOUZE TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js bash --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **point-virgule médian** | **25 / 8** | 23 | **95,7 %** | **54,0 %** |
| **glose finale entre parenthèses** | **16 / 1** | 15 | **100,0 %** | **45,1 %** |
| **deux-points médian** | **13 / 0** | 13 | **100,0 %** | **42,4 %** |
| adverbe de reprise (alors / ensuite / puis) | 6 / 3 | 5 | 100,0 % | 31,7 % |
| « la commande » | 5 / 0 | 5 | 100,0 % | 31,7 % |
| « de la » | 5 / 0 | 5 | 100,0 % | 31,7 % |
| quatre segments séparés par des virgules | 6 / 2 | 6 | 83,3 % | 31,3 % |
| parenthèse ouverte par un article | 4 / 0 | 4 | 100,0 % | 30,4 % |
| « que le » | 4 / 1 | 5 | 80,0 % | 29,9 % |
| « la sortie » | 4 / 1 | 5 | 80,0 % | 29,9 % |
| « les lignes » | 4 / 2 | 4 | 75,0 % | 28,6 % |
| « toutes les » | 3 / 2 | 5 | 60,0 % | 28,1 % |

Le gabarit des bonnes réponses est « réponse ; conséquence », « réponse : explication » ou
« réponse (une glose) » : donne-le à tes distracteurs, avec un contenu qui dit quelque chose — une
glose finale entre parenthèses qui PRÉCISE l'erreur (« (le code de la première commande) »), jamais
une parenthèse vide de sens.

### (4) ⚠️ LES MOTS FÉTICHES — 3 ALERTES DÈS LE DÉPART
`node tools/mesure-mot-fetiche.js bash` : `commande` (11 bonnes / 4 distracteurs, RESTREINDRE
**37,5 %**), `chaque` (10 / 2, **37,1 %**), `sortie` (7 / 1, **33,9 %**) ; puis `erreur` (6 / 1,
32,1 %), `arguments` et `lignes` (4 / 2, 29,0 %). **Pose ces mots dans des distracteurs**, là où ils
ont un sens — ce sont les mots du sujet. ⚠️ Pour ce cours, « chaque » est donc À EMPLOYER dans les
distracteurs (la mise en garde des cours précédents ne vaut pas ici : le mot manque aux
distracteurs). **« inverse »** (0 / 10), **« parce »** (9 / 25), **« exécute »** (2 / 5),
**« aucune »** et **« guillemets »** (2 / 4) sont déjà des mots de DISTRACTEUR : ne les multiplie
pas, et retire « C'est l'inverse » partout où il ne dit rien.

### (5) LE MOT TECHNIQUE EXCLUSIF (62,5 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune.
`node tools/mesure-mot-question.js bash --plan` donne la liste exacte, question par question
(**140 mots à traiter sur 27 questions qui tranchent**).

### (6) L'ÉCHO DE L'ÉNONCÉ (53,4 %, rendement 83,3 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les noms de commandes
passent sous le radar : `grep`, `sed`, `awk`, `set`, `trap`, `read`, `echo`, `$@`, `$?` —
compte-les. L'« écho de FRAGMENT d'identifiant » existe aussi (`pipefail` ↔ `pipe`).

### (7) L'INDICE LEXICAL — 44 exploitables, 28 retournées, 47 à mettre en forme sur 56
`node tools/mesure-lexique-qcm.js --liste=bash`. **Règle du `k`** : les QUATRE options portent le
même nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en OCCURRENCES** : un
mot étranger répété compte deux fois. **Règle du `w`** : quand `k > 0`, les quatre portent aussi le
même nombre de mots de 6+ lettres. Un substitut doit être **présent dans la page** (jeton entier ;
l'apostrophe et le tiret séparent les mots). Cible : 0 / 0 / 0. Fais-le mot par mot avec
`node scratchpad/bash-sonde/k.js` et `node scratchpad/bash-corr/wk.js lecon-NN.html "texte"`.
**Un mot de moins de 6 lettres ne compte ni dans `w` ni dans `k`** : c'est le levier.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE (29,0 %, rendement 100 %) — les quatre options ont le MÊME nombre de phrases
Le point suivi d'une espace puis d'une majuscule est la signature ; « etc. », « ex. », le point
d'un nom de fichier (`script.sh`, `.bashrc`) et celui d'un motif (`*.txt`, `${f%.*}`) ne comptent
pas. Si la bonne réponse conclut par une seconde phrase, **les trois distracteurs concluent aussi**,
par une règle FAUSSE mais plausible.

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js bash <sha>`. Si une bonne réponse te paraît FAUSSE (Bash
   la dément), **ne la corrige pas** : remonte-la dans ton compte rendu, avec le script et sa sortie.
2. **Aucun distracteur ne doit devenir vrai** — et ici, une option (`pipefail`, `nullglob`, `-r`,
   `-i`, `-p`) ou l'autre shell (`sh`, Bash 3.2, zsh) suffit à rendre vrai un « jamais ».
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`. ⚠️ Dans un patch
   JSON, un antislash se double (`"a\\tb"`), et `$` ne s'échappe pas.
4. **Aucune URL externe** dans le contenu.

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js bash` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger,
   et **exécute sous Bash** chaque comportement, chaque code de retour et chaque sortie que tu
   annonces.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Pose, puis relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js bash
node tools/mesure-mot-question.js bash --plan
node tools/mesure-biais-qcm.js --seul=bash
node tools/mesure-biais-inverse.js --toutes bash
node tools/mesure-lexique-qcm.js --liste=bash
node tools/mesure-mot-fetiche.js bash
node tools/mesure-tics-lot.js bash --exemples
node scratchpad/bash-sonde/essai.js "<fragment unique de l'énoncé>"
bash scratchpad/bash-<ton lot>/<essai>.sh
```

## Lots proposés (six écrivains, fichiers disjoints)
| lot | leçons | questions |
|---|---|---:|
| `l01-03` | lecon-01, lecon-02, lecon-03 | 9 |
| `l04-06` | lecon-04, lecon-05, lecon-06 | 9 |
| `l07-09` | lecon-07, lecon-08, lecon-09 | 9 |
| `l10-12` | lecon-10, lecon-11, lecon-12 | 9 |
| `l13-15` | lecon-13, lecon-14, lecon-15 | 9 |
| `l16` | lecon-16 (3 questions + 8 de bilan) | 11 |

## CE QUE TU RENDS
Un compte rendu bref : nombre de distracteurs réécrits, nombre de scripts Bash exécutés, les
chiffres de tes contrôles sur ton lot, et la **liste des défauts que tu as VUS sans y toucher**
(corps de leçon dont un exemple ne rend pas ce que la page annonce, bonne réponse douteuse,
`explain` qui cite un ancien distracteur, exercice dont la réponse attendue est fausse) — chacun
avec le fichier, le passage exact, et la sortie Bash qui le prouve. Écris cette liste aussi dans
`scratchpad/bash-<ton lot>/defauts.json` : `[{"fichier","zone","passage","constat","preuve"}]`.

---

## CE QUE LES 53ᵉ À 58ᵉ COURS ONT APPRIS À L'ORCHESTRATEUR

- **La relecture par contradiction doit lire les CORPS et les EXÉCUTER** : 51 fautes de corps sur
  92 pour `dart`, 99 sur 179 pour `perf-web`, 56 sur 113 pour `lisp`, 59 sur 126 pour `docker`,
  88 sur 180 pour `r` (une leçon entière dont les sorties étaient inventées). Pour `bash` : passer
  **chaque bloc de code** de la page à `bash`, comparer **chaque sortie affichée** et **chaque code
  de retour** annoncé à la sortie réelle.
- **La CONTRE-RELECTURE des corrections** : 18,2 %, 25,0 %, 29,0 %, 23,8 %, **12,8 %** des
  corrections fautives. Dire aux correcteurs de recalculer **tout chiffre dérivé** du chiffre
  corrigé, de relire le schéma et la légende voisins, et de rejouer `normExo` sur TOUS les exercices
  du cours après avoir élargi un `accept` (modèle : `scratchpad/docker-contre/exos.js`) — y compris
  la forme que le CORPS de la leçon enseigne (`r` : six listes `accept` la refusaient encore).
- ⚠️ **Les propositions des CONTRADICTEURS ne sont pas simulées contre la référence** : sur `r`,
  3 sur 42, posées telles quelles, ont déplacé 4 questions. Après la pose :
  `controle.js --ref=<sha de la vague>`, puis rattraper (`kdiff.js` nomme le mot entré dans la
  page). `essai3.js` compare à l'état DU DISQUE : après une pose ratée, ses écarts se lisent à
  l'envers.
- **Compléter le CORPS avec un mot que la bonne réponse est seule à porter fait tomber son `k`** :
  dire la même chose avec un mot déjà présent dans la page.
- **Un absolu déplacé n'est pas un absolu retiré** : pour tenir une mesure, réordonner les MÊMES
  mots de façon que l'absolu porte sur une chose vraie.
- **Relancer `mesure-mot-fetiche` APRÈS la relecture** : ses réécritures fabriquent un mot fétiche
  que `controle.js` (stratégies par question) ne voit pas.
- **`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges`** :
  sans `--only`, `antiseches` et `pieges` restent périmés.
- **Dosage calculé** (`dosage.js`) : combien de points retirer, puis quelles questions rapportent le
  plus. Raccourcir un distracteur en ôtant des mots courts le rend PLUS DENSE : remplacer, pas ôter.
- **Un réveil qui termine son tour pendant un Workflow le tue** : attendre dans le même tour (une
  boucle Bash bloquante de moins de 10 min sur le `journal.jsonl` du workflow).
- **Commiter après CHAQUE étape** (vague, corrections, contre-relecture) : un lot non commité ne
  survit pas à un réveil coupé.
- Clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` à la main ;
  `verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, `tools/etudes/inconnu/assembler.js` et
  `tools/etudes/recherche/assembler.js`, puis index, jusqu'au point fixe (vérifié par empreinte).
