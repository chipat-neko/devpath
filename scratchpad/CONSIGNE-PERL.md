# Consigne d'écriture — les QCM du cours `perl` (B4, 52ᵉ cours)

Préparée le 2026-09-29, à la clôture du 51ᵉ cours (`vue`). Mesures de départ archivées dans
`scratchpad/perl-depart/` (sorties brutes des outils, à relancer avant la vague : le site bouge).

Tu écris les **distracteurs** d'un lot de questions du cours `perl` du site Syntaxe
(`D:\test-claude`, 100 % `file://`, aucun serveur, aucun build, aucune dépendance installée).

**Un seul agent écrit dans un fichier donné.** Tu ne touches qu'aux leçons de TON lot, tu ne fais
**aucun commit** et **aucune commande git** (ni `checkout`, ni `stash`, ni `reset`, ni `restore` :
un `git checkout -- pages/vue/` a détruit 107 réécritures au 51ᵉ cours). Pour annuler, ré-édite.

Les QCM sont dans `pages/perl/lecon-NN.html`, dans un bloc
`<script type="application/json" data-quiz>` (et `data-quiz-bilan` pour `lecon-16`, qui porte
**15 questions** à lui seul). Le schéma est
`{"q": "...", "a": ["...", "...", "...", "..."], "correct": 0, "explain": "..."}`.

**Écris tes scripts jetables dans TON dossier** (`scratchpad/perl-<ton lot>/`).

⚠️⚠️ **`pages/perl/lecon-13.html` porte un MOJIBAKE VOLONTAIRE** : c'est une leçon sur
l'encodage, et ses caractères « cassés » sont le sujet. **Ne « répare » rien dans son corps**, ne
lance aucun outil de réencodage sur ce fichier, et ne touche qu'aux distracteurs de son QCM.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Au 50ᵉ cours (`nosql`), les 46 mesures étaient vertes et **15 distracteurs sur 27 ne voulaient plus
rien dire**. Au 51ᵉ (`vue`), une relecture lancée APRÈS que toutes les mesures furent vertes a encore
trouvé **63 fautes sur 62 questions**, dont **les trois distracteurs d'une même question qui
s'accusaient eux-mêmes d'absurdité** (« `<html>` pour la logique, `<js>` pour le contenu ») : un
débutant trouvait la bonne réponse **par élimination**, sans rien savoir.

Test de recevabilité, pour **CHAQUE** distracteur :

1. **Je peux nommer l'erreur en une phrase.** « Il croit que `@t` en contexte scalaire rend le
   dernier élément. » Si la réponse est « il ne dit rien de précis », réécris.
2. **Chaque proposition a un référent.** Pas de « y » qui ne renvoie à rien, pas de « cette
   notation » sans antécédent, pas de démonstratifs empilés pour tenir un compte.
3. **Un débutant crédule pourrait le cocher.** Un distracteur absurde ne piège personne — et trois
   distracteurs absurdes désignent la bonne réponse.
4. **Aucune parenthèse de remplissage.**
5. **Aucune conjonction sans logique.**

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

---

## 🟢 CE COURS S'EXÉCUTE — ET C'EST UNE OBLIGATION, PAS UN CONFORT

**Perl 5.42 est installé** (`/usr/bin/perl`, celui de Git Bash). Contrairement aux cours `vue` ou
`nosql`, **toute affirmation sur le comportement de Perl se prouve en trois secondes**. Donc :

- **Un distracteur qui parle d'un résultat de code se vérifie par exécution AVANT d'être écrit** :
  il doit être FAUX à l'exécution. Écris le script dans ton dossier avec l'outil d'écriture de
  fichiers (**jamais par heredoc** : l'outil Bash mange un niveau d'antislash, `\n` et `\b`
  deviennent autre chose) et lance `perl ton-script.pl`.
- **Si en exécutant tu découvres qu'une BONNE réponse est fausse**, tu ne la corriges pas (elle est
  intouchable) : tu la remontes dans ton compte rendu **avec le script et sa sortie**. C'est la
  découverte la plus précieuse que tu puisses faire : au 51ᵉ cours, deux bonnes réponses fausses
  n'ont été vues par aucun des 46 outils.
- ⚠️ Attention aux **versions** : `say` exige `use feature 'say'` (ou `use v5.10`+), les signatures
  de sous-routines sont récentes, `given/when` est expérimental. **Ne fonde une fausseté sur un point
  de version que si TA page le date.**

**Erreurs classiques de débutant, chacune VÉRIFIÉE par exécution le 2026-09-29** (n'utilise que
celles que TA leçon établit) :

| croyance fausse | ce que Perl rend réellement |
|---|---|
| `@t` en contexte scalaire rend le dernier élément | le **nombre** d'éléments (`my $n = @t` → `3` pour `(10,20,30)`) |
| `my ($p) = @t` rend le nombre d'éléments | le **premier** élément (`10`) — contexte de liste |
| `$#t` est la taille du tableau | le **dernier indice** (`2` pour trois éléments) |
| la chaîne `"0.0"` (ou `"00"`, `" "`, `"0E0"`) est fausse | elles sont **vraies** ; seules `"0"`, `""`, `0` et `undef` sont fausses |
| `chomp` retire le dernier caractère quel qu'il soit | il retire le **saut de ligne final** ; c'est `chop` qui retire n'importe quel dernier caractère |
| `"10" eq "10.0"` est vrai parce que les nombres sont égaux | **faux** : `eq` compare des chaînes ; `10 == 10.0` est vrai |
| `.*` s'arrête à la première occurrence | il est **glouton** : sur `<a><b>`, `<(.*)>` capture `a><b` ; `.*?` capture `a` |
| une sous-routine reçoit des copies dans `@_` | `@_` est un **alias** : `$_[0] = …` modifie la variable de l'appelant |
| `.` répète une chaîne et `x` la concatène | l'inverse : `"ab" x 3` → `ababab`, `"a" . "b"` → `ab` |
| `exists` et `defined` sont synonymes | `exists` teste la **clé**, `defined` la **valeur** |

---

## Pourquoi ce travail

Un apprenant qui ne comprend rien réussit **92,9 %** des QCM de `perl` en cochant l'option la plus
longue. Relevé du 2026-09-29, `node tools/mesure-biais-qcm.js --seul=perl` (60 questions) :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **92,9 %** | 95,0 % | **96,5 %** |
| la plus détaillée | **80,4 %** | 75,0 % | 97,8 % |
| l'incise entre parenthèses | **60,4 %** | 51,7 % | 93,5 % |
| la seule avec une PONCTUATION FORTE | **54,6 %** | 41,7 % | 96,0 % |
| le mot technique exclusif | **51,5 %** | 50,0 % | 73,3 % |
| ECARTER la moins bavarde | **50,3 %** | 21,7 % | 92,3 % |
| la seule avec un point-virgule | **45,0 %** | 26,7 % | **100,0 %** |
| l'écho de la question | **41,4 %** | 36,7 % | 63,6 % |
| RESTREINDRE aux deux-points | **38,9 %** | 20,0 % | 91,7 % |
| ECARTER la plus courte | 37,1 % | 6,7 % | 75,0 % |
| la plus prudente | 36,3 % | 15,0 % | **100,0 %** |
| la seule avec une flèche | 30,0 % | 6,7 % | **100,0 %** |

**Ton lot doit ramener chaque indice à 25 %.** On ne rend pas les questions plus difficiles : on rend
les **distracteurs crédibles**.

## Le travail est de l'ALLONGEMENT

| | |
|---|---:|
| longueur moyenne d'une bonne réponse | **90,4 caractères** |
| longueur moyenne d'un distracteur | **22,5 caractères** |
| **rapport** | **4,01** (`vue` : 3,68 ; `nosql` : 3,41) |

`node tools/plan-rangs-qcm.js perl` demande **10 509 caractères** sur **57 questions sur 60**.
Rangs actuels **58 / 1 / 1 / 0**, cible **15 / 15 / 15 / 15**. **Suis EXACTEMENT** le rang visé et la
bande de caractères que l'outil donne pour chacune de tes options.

La bonne réponse est « la réponse + sa justification » ; les distracteurs sont des télégrammes
(« Pour accélérer le script », « C'est l'inverse »). **Le remède : donne au distracteur la MÊME
STRUCTURE que la bonne réponse — la réponse fausse, PUIS sa justification fausse mais cohérente.**

---

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR ET LES RANGS
`plan-rangs-qcm`, question par question. `node tools/mesure-biais-inverse.js --toutes perl` rend
**4 alertes** : DEUXIÈME, TROISIÈME, QUATRIÈME plus longue et « la moins bavarde » ont une DIRECTE à
**0,0 %** (élimination sûre). **Le rang en MOTS de la bonne réponse doit valoir son rang en
CARACTÈRES** : n'allonge pas avec quelques mots très longs.

### (2) LA PONCTUATION — et L'UNION
Par marque (`;`, `:`, parenthèse, tiret, flèche `=>`/`->`, barre oblique, guillemets), **les quatre
options la portent, ou aucune** — et vérifie aussi l'UNION (« PONCTUATION FORTE » = `:` ou `;` ou
tiret, **54,6 %**, rendement 96,0 %). ⚠️ En Perl, `->` et `=>` sont du CODE : une flèche dans un
distracteur doit être du vrai code, pas une décoration.

### (3) LES DIX TICS DE LOT — connus AVANT d'écrire
`node tools/mesure-tics-lot.js perl --exemples` :

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **point-virgule médian** | **18 / 2** | 16 | **100,0 %** | **45,0 %** |
| **glose finale entre parenthèses** | **15 / 2** | 17 | 88,2 % | **42,9 %** |
| **deux-points médian** | **11 / 1** | 10 | **100,0 %** | 37,5 % |
| quatre segments séparés par virgule | 7 / 0 | 7 | 100,0 % | 33,8 % |
| « à la » | 6 / 2 | 8 | 75,0 % | 31,7 % |
| parenthèse ouverte par un article | 4 / 0 | 4 | 100,0 % | 30,0 % |
| « un scalaire » | 4 / 0 | 4 | 100,0 % | 30,0 % |
| « ce qui » | 4 / 0 | 4 | 100,0 % | 30,0 % |
| « une référence » | 4 / 1 | 5 | 80,0 % | 29,6 % |
| connecteur causal (car / puisque / parce que) | **7 / 21** | 8 | 50,0 % | 28,3 % (**inverse**) |

Les trois premiers viennent du **même gabarit de bonne réponse** (« réponse ; justification (glose) »).
La bonne réponse étant intouchable, **donne ce gabarit à tes distracteurs** — avec un contenu qui dit
quelque chose. ⚠️ Le connecteur causal penche déjà **du côté des distracteurs** (7/21) : n'ouvre pas
tes distracteurs par « Parce que » si la bonne réponse ne le fait pas.

### (4) LE MOT TECHNIQUE EXCLUSIF (51,5 %) ET L'INTRUS LEXICAL (EXCÈS 28,9 %, 2 questions sûres)
Par mot de 9 lettres et plus : les quatre options le portent, ou aucune. **Tension structurelle**
(48ᵉ cours) : la seule issue qui ferme les deux est de reprendre un mot de 9+ lettres de la bonne
réponse et de le poser dans les **trois** distracteurs. `node tools/mesure-mot-question.js perl
--plan` donne la liste exacte des mots à ajouter ou retirer.

### (5) L'ÉCHO DE L'ÉNONCÉ (41,4 %)
Les quatre options portent le **même nombre** de mots repris de l'énoncé. ⚠️ Les identifiants courts
passent sous le radar de l'outil : `my`, `@_`, `$_`, `%h`, `=~`, `qw`, `die`, `sub`, `use` —
**compte-les à la main**.

### (6) L'INDICE LEXICAL — 46 exploitables, 28 retournées, 50 à mettre en forme sur 60
`node tools/mesure-lexique-qcm.js --liste=perl`. **Règle du `k`** : les QUATRE options portent le
même nombre de mots de 6+ lettres absents du corps de la page. **Règle du `w`** : quand `k > 0`, les
quatre portent aussi le même nombre de mots de 6+ lettres. Un substitut doit être **présent dans la
page** (jeton entier : « référence » ≠ « références ») et poser dans **deux** distracteurs à la fois.
Cible : **0 exploitable ET 0 retournée ET 0 à mettre en forme**.

### (7) LES MOTS FÉTICHES — 0 alerte au départ, et c'est la correction qui les fabrique
Au 50ᵉ cours, six agents ont fabriqué `chaque` (6 bonnes / 44 distracteurs) **sans se concerter**.
**N'emploie pas le mot « chaque »** pour allonger. Relance `mesure-mot-fetiche perl` à la fin.

### (8) LES ABSOLUS — 0, 2 ou 3 porteurs par question, jamais 1
`toujours`, `jamais`, `uniquement`, `seulement`, `aucun`, `rien`, `impossible` : un seul
distracteur absolutiste fait désigner les trois autres.

### (9) LA PAIRE AUTO-ÉLIMINATRICE ET LE MIROIR
Trois distracteurs = **trois erreurs différentes** ; jamais le miroir exact de la bonne réponse.

### (10) LE DISTRACTEUR NE DOIT PAS DEVENIR UN MODE D'EMPLOI
La fausseté est dans la **thèse, dès la première proposition**, pas dans une queue de phrase — et
jamais un conseil dangereux qu'un débutant appliquerait (« pas besoin de `use strict` », « on peut
ignorer la valeur de retour de `open` »).

---

## Les contraintes de non-régression

1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES.** Contrôle :
   `node tools/mesure-qcm-intouchable.js perl <sha>`.
2. **Aucun distracteur ne doit devenir vrai — ici, ça se PROUVE en l'exécutant.**
3. **JSON valide, sans BOM, sans CRLF** (l'outil d'édition écrit parfois en CRLF : au 51ᵉ cours, les
   14 fichiers y sont passés). Les antislashes des littéraux (`\n`, `\"`, `\\`) restent échappés.
4. **Aucune URL externe.**
5. **Le mojibake de `lecon-13` reste intact.**

## L'ORDRE DE TRAVAIL

1. Lis **TES** leçons en entier — le corps établit ce que tu as le droit d'écrire.
2. `node tools/plan-rangs-qcm.js perl` : rang visé et bande de chaque option.
3. Pour chaque question, écris les **trois erreurs** en une phrase chacune, **avant** de rédiger ;
   **exécute** celles qui parlent d'un résultat de code.
4. Rédige à la longueur imposée ; si tu manques de caractères, étoffe l'erreur (son mécanisme faux,
   sa conséquence fausse), jamais par du remplissage.
5. Relis les quatre options **à voix haute**.
6. Relance les contrôles sur TON lot et cite les chiffres.

```
node tools/plan-rangs-qcm.js perl
node tools/mesure-mot-question.js perl --plan
node tools/mesure-biais-qcm.js --seul=perl
node tools/mesure-biais-inverse.js --toutes perl
node tools/mesure-lexique-qcm.js --liste=perl
node tools/mesure-mot-fetiche.js perl
node tools/mesure-tics-lot.js perl --exemples
```

---

## CE QUE LE 51ᵉ COURS A APPRIS À L'ORCHESTRATEUR (pour la suite de ce cours)

- **Après la première vague, les retouches se font sous `scratchpad/perl-sonde/controle.js`** (copie
  de celui de `vue`) : il CHARGE les 44 stratégies de `mesure-biais-qcm.js` et compare, question par
  question, l'ensemble des options que chacune désigne, contre HEAD. Consigne des retouches :
  *change les MOTS autant qu'il faut, ne change AUCUNE ligne `S:`.* Sur `vue`, 60 réécritures faites
  ainsi n'ont déplacé **aucune** des 44 stratégies.
- **Commiter chaque vague AVANT d'y toucher.**
- **Relire par contradiction AVANT de déclarer le cours clos**, même quand toutes les mesures sont
  vertes : c'est la relecture, pas les outils, qui a trouvé les deux bonnes réponses fausses de `vue`.
- **Après un changement d'énoncé, `build-index.js --fresh`**, puis `--strict` : sans `--fresh`, le
  « filet de reprise » garde l'ancien énoncé dans `quiz-index.js`.
- `tools/doc/gen.js` **ignore ses arguments** et réassemble les pages du cours `doc` à chaque appel.
