# Consigne d'écriture — les QCM du cours `lisp` (B4, 55ᵉ cours)

Préparée le 2026-09-30, à la clôture du 54ᵉ cours (`perf-web`). Mesures de départ archivées dans
`scratchpad/lisp-depart/` (sorties brutes des outils). Sondes prêtes dans `scratchpad/lisp-sonde/`
(`controle.js` v2, `simule.js`, `essai.js`, `essai2.js`, `pose.js`, `rempl.js`, `k.js`, `dosage.js`,
`chaque.js`), copiées de `perf-web-sonde` et pointées sur `pages/lisp/` (`controle.js` à vide :
**0 indicateur déplacé sur 55 questions**).

Tu écris les **distracteurs** d'un lot de questions du cours `lisp` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).
Le cours s'intitule « Lisp & Scheme : le pouvoir des parenthèses » : notation préfixe,
S-expressions et évaluation, listes (`cons`, `car`, `cdr`), `define` et `lambda`, récursion,
fonctions d'ordre supérieur, conditions et liaisons locales (`let`, `let*`, `cond`), macros,
structures de données et état, l'écosystème (Common Lisp, Scheme, Racket, Clojure), récursion
terminale, fermetures, quasiquote et DSL, `eval` et `apply`, puis un mini-évaluateur en projet.
**Le cours est surtout en Scheme** (`define`), avec un peu de Common Lisp (`defun`, `lecon-04` et
`lecon-10`).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (pas même en lecture). Pour annuler, ré-écris un patch.

Les QCM sont dans `pages/lisp/lecon-NN.html`, dans un bloc `<script type="application/json" data-quiz>`
(et `data-quiz-bilan` pour `lecon-15`, qui porte **10 questions de bilan** en plus de ses 3). Schéma :
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

## ⚠️ ÉCRIRE PAR FICHIER DE PATCHS, JAMAIS AVEC L'OUTIL D'ÉDITION

Écris tes patchs dans `scratchpad/lisp-<ton lot>/patchs.json` (outil Write) :
`[{"fichier":"lecon-NN.html","q":<n° dans le fichier, 1-based, bilan compris>,"opt":<index 0-based>,"texte":"..."}]`
Aperçu : `node scratchpad/lisp-sonde/pose.js <patchs>` ; écriture : `--ecrire`. `pose.js` refuse de
toucher la bonne réponse et reparse chaque bloc JSON. **Jamais de heredoc Bash** pour un fichier qui
contient un antislash : l'outil Bash en mange un niveau. Écris tes scripts avec l'outil Write.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Aux 53ᵉ et 54ᵉ cours, après des vagues où toutes les mesures étaient vertes, la relecture a encore
trouvé des distracteurs inintelligibles, des fautes de français et **3 distracteurs VRAIS** par cours —
des queues de phrase ajoutées pour tenir un compte de caractères, des parenthèses qui n'énoncent rien.

Test de recevabilité, pour **CHAQUE** distracteur :
1. **Je peux nommer l'erreur en une phrase.**
2. **Chaque proposition a un référent** (pas de « y », de « eux », de « cette forme » orphelins).
3. **Un débutant crédule pourrait le cocher.**
4. **Aucune parenthèse ni queue de phrase de remplissage.**
5. **Aucune conjonction sans logique** (« exige ainsi », « plutôt » sans comparaison).
6. **Aucun distracteur qui cite du code faux sans le dire** : si un distracteur annonce une valeur
   (« `(car '(1 2))` vaut `(1)` »), c'est une valeur FAUSSE — **vérifiée fausse par exécution**.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## ✅ CE COURS S'EXÉCUTE — TOUT CE QUI SE PROUVE SE PROUVE

Deux interprètes portables sont dans `scratchpad/` (hors git, rien d'installé) :

- **Scheme / Racket 8.17** : `scratchpad/racket/racket/Racket.exe fichier.rkt` (~0,1 s).
  Commence tes fichiers par `#lang racket/base` (ou `#lang racket`). Disponibles : `define`,
  `lambda`, `let`/`let*`/`letrec`, `cond`, `quasiquote` (`` ` ``, `,`, `,@`), `define-syntax` +
  `syntax-rules`, `define-syntax-rule`, `gensym`, `apply`, `assoc`, `delay`/`force`,
  `(require racket/list)`. **`eval` exige un espace de noms** :
  `(define ns (make-base-namespace)) (eval '(+ 1 2) ns)`. ⚠️ Différences Racket ↔ Scheme R7RS :
  les paires de Racket sont **immuables** (`set-car!` n'existe pas ; `mcons`/`set-mcar!` à la
  place), `'()` s'affiche `()`, `#t`/`#f` pour les booléens, `display` d'une paire pointée donne
  `(1 . 2)`. Si la page affirme un comportement propre à R7RS que Racket ne reproduit pas, **tu
  le remontes**, tu ne tranches pas de mémoire.
- **Common Lisp / SBCL 2.5.8** :
  `SBCL_HOME="scratchpad/sbcl/x/PFiles/Steel Bank Common Lisp" "scratchpad/sbcl/x/PFiles/Steel Bank Common Lisp/sbcl.exe" --script fichier.lisp`
  (le fichier doit être un vrai fichier, pas une substitution de processus). Pour les `defun`,
  `defmacro`, `loop`, `format`, `mapcar`, `funcall`, `nil` vs `'()`.

Tes scripts vont dans `scratchpad/lisp-<ton lot>/`. **Tout résultat que tu écris dans un distracteur
(« renvoie `(2 3)` », « lève une erreur », « boucle sans fin ») ou que tu contestes dans une bonne
réponse se CALCULE, il ne s'écrit pas de tête.** Si une bonne réponse te semble fausse, tu ne la
touches pas : tu la remontes avec la sortie de l'interprète.

**Erreurs classiques de débutant en Lisp/Scheme** (n'utilise que celles que TA leçon établit ;
les dix lignes ont été exécutées sous Racket à la préparation — `9`, `(+ 1 2)`, `(1 . 2)`, `(1 2)`, `let` → 1 contre `let*` → 2, `eq?` → `#f` contre `equal?` → `#t`, `(1 (2 3) 4 5)`, fermeture après `set!` → 5 ; vérifie quand même chaque ligne contre TA page) :

| croyance fausse | ce qui est vrai |
|---|---|
| `(+ 2 3 4)` n'accepte que deux arguments | `+` est variadique : 9 |
| `'(+ 1 2)` vaut 3 | la quote empêche l'évaluation : c'est la liste `(+ 1 2)` |
| `car` renvoie le dernier élément, `cdr` le premier | `car` = premier élément, `cdr` = le reste (une liste) |
| `(cons 1 2)` construit la liste `(1 2)` | une paire pointée `(1 . 2)` ; `(cons 1 '(2))` donne `(1 2)` |
| `let` voit les liaisons précédentes du même `let` | c'est `let*` ; `let` évalue toutes les valeurs dans l'environnement extérieur |
| une macro est une fonction appelée à l'exécution | elle transforme le CODE avant l'évaluation, ses arguments ne sont pas évalués |
| toute récursion consomme la pile | un appel en position terminale est garanti sans croissance de pile en Scheme |
| une fermeture copie la valeur des variables au moment de sa création | elle capture la LIAISON : une modification ultérieure (`set!`) est visible |
| `eq?` compare le contenu de deux listes | `eq?` compare l'identité ; `equal?` compare la structure |
| `,@` insère une liste telle quelle | `,@` épisse ses éléments ; `,` insère la valeur telle quelle |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **98,2 %** des QCM de `lisp` en cochant l'option la plus
longue. Relevé du 2026-09-30, `node tools/mesure-biais-qcm.js --seul=lisp` (55 questions, dont 10 de
bilan) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **98,2 %** | 100,0 % | 98,2 % |
| la plus détaillée | **85,6 %** | 78,2 % | **100,0 %** |
| RESTREINDRE à la ponctuation forte | **72,9 %** | 63,6 % | **100,0 %** |
| l'incise entre parenthèses | **68,6 %** | 58,2 % | 96,9 % |
| RESTREINDRE à la parenthèse | **65,0 %** | 52,7 % | 96,6 % |
| le mot technique exclusif | **62,3 %** | 58,2 % | 84,4 % |
| RESTREINDRE aux deux-points | 52,4 % | 36,4 % | **100,0 %** |
| ECARTER la moins bavarde | 50,3 % | 18,2 % | **100,0 %** |
| l'écho de la question | 46,5 % | 43,6 % | 70,8 % |
| la seule avec un point-virgule | 45,5 % | 27,3 % | **100,0 %** |
| la seule qui nie | 38,2 % | 34,5 % | 57,9 % |
| la plus prudente | 34,5 % | 20,0 % | 72,7 % |
| la MAJUSCULE d'emphase | 33,2 % | 10,9 % | **100,0 %** |
| la seule en deux phrases (point interne) | 27,7 % | 3,6 % | **100,0 %** |

**89,1 %** des questions (49 sur 55) sont trahies par **5 indices ou plus** sur 44.

## Le travail est de l'ALLONGEMENT — le plus fort rapport depuis `dart`

| | |
|---:|---:|
| longueur moyenne d'une bonne réponse | **106,0 caractères** |
| longueur moyenne d'un distracteur | **25,3 caractères** |
| **rapport** | **4,19** (`perf-web` : 3,36 ; `dart` : 4,77 ; `perl` : 4,01) |

`node tools/plan-rangs-qcm.js lisp` demande **11 080 caractères** sur **55 questions sur 55**.
Rangs actuels **54 / 0 / 1 / 0**, cible **14 / 14 / 14 / 13**. **Suis EXACTEMENT** le rang visé et la
bande de caractères de chacune de tes options. Donne au distracteur la MÊME STRUCTURE que la bonne
réponse : la réponse fausse, PUIS sa justification fausse mais cohérente.

⚠️ Beaucoup de distracteurs actuels sont du **code nu** (`(2 + 3 * 4)`, `(+ 2 3 4)`). Tu peux
garder le code en tête d'option, mais la bonne réponse l'accompagne d'une explication : le
distracteur doit en porter une aussi — FAUSSE, et prouvée fausse à l'interprète.

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`node tools/mesure-biais-inverse.js --toutes lisp` rend **4 alertes** au départ (la QUATRIÈME plus
longue 32,7 %, la DEUXIÈME 32,4 %, la TROISIÈME 31,2 %, la moins bavarde 28,9 %). **Le rang en MOTS
de la bonne réponse doit valoir son rang en CARACTÈRES.** Quand la bonne réponse est la plus courte,
qu'**un** de ses distracteurs ait autant de mots qu'elle (égalité) plutôt que tous davantage — et au
54ᵉ cours l'égalité seule n'a pas suffi : vise qu'un distracteur en ait **un de moins** quand la
bonne est au rang 3 en caractères.

### (2) LA PONCTUATION — et L'UNION (72,9 %, rendement 100 %)
Par marque (`;`, `:`, parenthèse, tiret, barre oblique, guillemets), **les quatre options la portent,
ou aucune** ; vérifie aussi l'UNION (« PONCTUATION FORTE » = `:` ou `;` ou tiret). ⚠️ **Dans ce
cours, le CODE porte des parenthèses** : `(car x)` compte comme une parenthèse pour l'outil. Si la
bonne réponse cite du code parenthésé, les trois distracteurs aussi, ou une glose entre parenthèses.

### (3) LES DOUZE TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js lisp --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **21 / 2** | 21 | 95,2 % | **51,8 %** |
| **point-virgule médian** | **15 / 0** | 15 | **100,0 %** | **45,5 %** |
| **glose finale entre parenthèses** | 12 / 7 | 17 | 70,6 % | 39,1 % |
| verbe conjugué en fin d'option | 20 / 28 | 20 | 55,0 % | 35,9 % |
| parenthèse ouverte par un article | 5 / 0 | 5 | 100,0 % | 31,8 % |
| « les éléments » | 4 / 0 | 4 | 100,0 % | 30,5 % |
| « ses arguments » | 4 / 0 | 4 | 100,0 % | 30,5 % |
| « une fonction » | 9 / 10 | 7 | 57,1 % | 29,1 % |
| « la fonction » | 3 / 1 | 4 | 75,0 % | 28,6 % |
| « que le » | 3 / 1 | 4 | 75,0 % | 28,6 % |
| « le code » | 4 / 4 | 8 | 50,0 % | 28,6 % |
| « une macro » | 4 / 2 | 4 | 75,0 % | 28,6 % |

Le gabarit des bonnes réponses est « réponse : explication » ou « réponse ; conséquence » : donne-le à
tes distracteurs, avec un contenu qui dit quelque chose. **Le deux-points médian est à 21 bonnes sur
55** : c'est le plus fort tic de lot mesuré depuis le début de B4.

### (4) ⚠️ LES MOTS FÉTICHES — 3 ALERTES DÈS LE DÉPART
`liste` (11 bonnes / 6 distracteurs, RESTREINDRE **35,0 %**), `fonction` (12 / 11, **34,7 %**),
`arguments` (7 / 4, **31,4 %**) ; juste sous le seuil : `appel` 34,5 % (7 questions), `capture`
(7 / 0), `évalue` (7 / 1), `valeur` (7 / 1). **Pose ces mots dans des distracteurs**, là où ils ont
un sens. **N'emploie pas « chaque », « chaîne » ni « valeur »** pour allonger : aux 50ᵉ à 52ᵉ cours,
la correction a fabriqué son propre mot fétiche avec eux. Et **« parce que »** est déjà un tic de
DISTRACTEUR ici (3 bonnes / 19 distracteurs) : ne l'ajoute pas.

### (5) LE MOT TECHNIQUE EXCLUSIF (62,3 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune. `node tools/mesure-mot-question.js
lisp --plan` donne la liste exacte, question par question (**165 mots à traiter sur 26 questions qui
tranchent**).

### (6) L'ÉCHO DE L'ÉNONCÉ (46,5 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. Les noms de formes courts
passent sous le radar : `car`, `cdr`, `cons`, `let`, `cond`, `eval`, `apply`, `quote`, `lambda`,
`define`, `macro` — compte-les.

### (7) L'INDICE LEXICAL — 50 exploitables, 24 retournées, 52 à mettre en forme sur 55
`node tools/mesure-lexique-qcm.js --liste=lisp`. **Règle du `k`** : les QUATRE options portent le même
nombre de mots de 6+ lettres absents du corps de la page — ⚠️ **compté en OCCURRENCES** : un mot
étranger répété compte deux fois. **Règle du `w`** : quand `k > 0`, les quatre portent aussi le même
nombre de mots de 6+ lettres. Un substitut doit être **présent dans la page** (jeton entier).
Cible : 0 / 0 / 0.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE — les quatre options ont le MÊME nombre de phrases

---

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js lisp <sha>`.
2. **Aucun distracteur ne doit devenir vrai** — et en Lisp, la vérité se TESTE.
3. **JSON valide, sans BOM, sans CRLF** — garanti si tu passes par `pose.js`.
4. **Aucune URL externe.**

## L'ORDRE DE TRAVAIL
1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js lisp` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger,
   et **exécute** chaque valeur ou comportement que tu annonces.
4. Rédige à la longueur imposée ; étoffe l'erreur (son mécanisme faux, sa conséquence fausse),
   jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Pose, puis relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js lisp
node tools/mesure-mot-question.js lisp --plan
node tools/mesure-biais-qcm.js --seul=lisp
node tools/mesure-biais-inverse.js --toutes lisp
node tools/mesure-lexique-qcm.js --liste=lisp
node tools/mesure-mot-fetiche.js lisp
node tools/mesure-tics-lot.js lisp --exemples
node scratchpad/lisp-sonde/essai.js "<fragment unique de l'énoncé>"
```

---

## CE QUE LES 53ᵉ ET 54ᵉ COURS ONT APPRIS À L'ORCHESTRATEUR

- **La relecture par contradiction doit lire les CORPS et les EXÉCUTER** : 51 fautes de corps sur 92
  pour `dart`, 99 sur 179 pour `perf-web`. Aucun des 46 outils ne lit un corps. Pour `lisp`, faire
  tourner **chaque bloc de code** qui annonce une sortie (`; → 9`, `;; affiche …`) sous Racket ou SBCL.
- **La CONTRE-RELECTURE des corrections** (54ᵉ cours) : 32 prises sur 176 corrections (18,2 %),
  dont un distracteur rendu VRAI par sa correction. À refaire avant de clore.
- **Relancer `mesure-mot-fetiche` APRÈS la relecture** : ses réécritures fabriquent un mot fétiche
  que `controle.js` (stratégies par question) ne voit pas.
- **Une correction de CORPS change le vocabulaire de la page** et peut rouvrir `k` : relancer
  `controle.js --ref=<sha de la vague>` après toute correction de corps.
- **`build-index.js --write --fresh --only=quiz,flashcards,search,searchlite,antiseches,pieges`**.
- **Dosage calculé** (`dosage.js`) : combien de points retirer, puis quelles questions rapportent le
  plus. Raccourcir un distracteur en ôtant des mots courts le rend PLUS DENSE : remplacer, pas ôter.
- **Un réveil qui termine son tour pendant un Workflow le tue** : attendre dans le même tour.
- Clôture : cliquets refigés (`verif-qcm-biais.js --ecrire`, `traite: true` à la main ;
  `verif-qcm-lexique.js --ecrire`), `tools/doc/gen.js`, `tools/etudes/inconnu/assembler.js` et
  `tools/etudes/recherche/assembler.js`, puis index, jusqu'au point fixe (vérifié par empreinte).
