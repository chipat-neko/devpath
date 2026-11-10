# Consigne d'écriture — les QCM du cours `prolog` (B4, chantier V16)

Préparée le 2026-11-10 par l'agent du cours `prolog`, seul sur sa copie de travail
(`D:\test-claude-b4\prolog`, branche `b4/prolog`), en parallèle de huit autres cours. Mesures
de départ archivées dans `scratchpad/prolog-depart/` (sorties brutes des outils ;
`questions.txt` : les 54 questions à plat ; `texte/` : le texte des 14 leçons). Sondes copiées
de `tests-sonde` et repointées dans `scratchpad/prolog-sonde/` (`controle.js` à vide : **0
indicateur déplacé sur 54 questions**), plus deux sondes neuves : `aplat.js` (les QCM à plat)
et **`atelier.js`** (banc d'écriture : un lot de patchs appliqué EN MÉMOIRE, et pour chaque
question tout ce qui désigne une option — rangs de longueur, de mots et de densité, `w` et `k`,
mots de 9 lettres exclusifs, écho, marques, toutes les stratégies qui tranchent, l'intrus
lexical, les tics de forme).

Le cours s'intitule « Prolog : la programmation logique » : faits, règles, requêtes
(`lecon-01`, `lecon-02`), unification (`03`), backtracking (`04`), listes (`05`), arithmétique
et récursion (`06`), coupure et négation par l'échec (`07`), générer-et-tester et `findall`
(`08`), outils et héritiers (`09`), `findall` / `bagof` / `setof` / `aggregate_all` (`10`),
base dynamique `assertz` / `retract` (`11`), DCG (`12`), CLP(FD) (`13`), projet système expert
(`14` : 3 questions + **12 de bilan**). **54 questions, 162 distracteurs.**

## ✅ CE QUI SE PROUVE SE PROUVE — ET ICI, PROLOG S'EXÉCUTE

**SWI-Prolog 10.0.2 (x64-win64)**, extrait SANS installation de l'installateur officiel
(`swipl-10.0.2-1.x64.exe`, SHA-256 `2ec1f25b…41ad6`, identique à celui publié sur
swi-prolog.org) par 7-Zip 26.01, lui-même extrait de son installateur officiel : rien n'est
écrit dans le registre ni dans un dossier système (l'installateur exige les droits
d'administrateur : il n'a PAS été lancé). Tout est dans `D:\outils-b4\prolog\`, hors dépôt.

```
cd scratchpad/prolog-essais
./pl.sh l/l06.pl l/l06.txt      # mini-toplevel : toutes les solutions, déterminisme, exceptions
./top.sh l/clp.pl l/l13c.txt    # le VRAI toplevel (requêtes déterministes) : affichage exact
```
`rejoue.pl` (écrit pour ce cours) rejoue une requête par ligne et dit, pour chaque solution,
si le toplevel attendrait un « ; », puis « false. » quand l'énumération s'épuise, ou
l'exception exacte. Les fichiers `.pl` et `.txt` s'écrivent avec l'outil **Write** (jamais par
heredoc : `\+`, `\=` et `=\=` perdent leur antislash).

**Erreurs classiques de débutant — toutes EXÉCUTÉES sous SWI-Prolog 10.0.2**
(`scratchpad/prolog-essais/l/l01.txt` à `l14b.txt`) :

| croyance fausse | ce que SWI-Prolog 10.0.2 rend |
|---|---|
| `X = 1 + 2` lie X à 3 | `X = 1+2` (le terme) ; `Y is X` donne 3 |
| `4 = 2 + 2` est vrai | `false` ; `4 =:= 2 + 2` est `true` |
| `X is Y + 1` (Y libre) échoue | il LÈVE « Arguments are not sufficiently instantiated » (de même `10 is X + Y`, `5 is X + 2`, et `X + Y =:= 10` placé avant le générateur) |
| `X = 3, X = 4` réaffecte X | `false` |
| la liste vide se décompose en tête et queue | `[T\|Q] = []` rend `false` |
| sans cas de base, la récursion boucle toujours | sur une liste, `false` (aucune clause pour `[]`) ; avec la garde `N > 0`, `false` ; seule une récursion SANS garde épuise la pile (« Stack limit exceeded ») |
| `max` sans coupure rend deux réponses | jamais : `M = 7`, puis `false` au « ; » (un point de choix inutile) |
| `\+ aime(ana, X)` cherche ce qu'ana n'aime pas | `false` (aucune liaison, « il n'est pas prouvable ») |
| `findall` échoue sans solution | `L = []` ; `bagof` et `setof` échouent (`false`) |
| `bagof` trie | `bagof` garde l'ordre et les doublons (`[b, a, b]`), `setof` trie et dédoublonne (`[a, b]`) |
| sans `Qui^`, setof rend une liste globale | une solution PAR valeur de `Qui` |
| le retour arrière défait un `assertz` | la clause ajoutée RESTE (`essai_bt`) |
| `assertz` exige la directive `dynamic` | sur un prédicat jamais vu, `assertz` RÉUSSIT (il le crée dynamique) ; sur un prédicat chargé du fichier, `permission_error` ; interroger un prédicat inconnu : `existence_error` ; `retract` d'un inconnu : `false` |
| `retract` ne réussit qu'une fois | il retire une clause par solution (`findall(X, retract(r(X)), L)` → `[1, 2, 3]`) |
| on peut appeler le non-terminal `phrase_simple([…])` | `existence_error` : `phrase_simple/1` n'existe pas, il faut `phrase/2` |
| `"42"` est une liste de codes | dans SWI-Prolog 7+, une CHAÎNE (`phrase(nombre(L), "42")` → `type_error(list, "42")`) |
| la propagation trouve les solutions | `X in 1..9, Y in 1..9, X + Y #= 10, X #< Y` laisse `X in 1..8, Y in 2..9` (64 couples) ; `label` trouve les 4 solutions |
| `#=` marche sans charger clpfd | erreur de SYNTAXE (« Operator expected ») |
| `label` sans domaine | « Arguments are not sufficiently instantiated » |

**Ce qui ne s'exécute PAS ici** : SWISH, Tau Prolog, GNU Prolog, SICStus, Mercury, Datalog,
ASP, le traceur interactif (`trace.`, seulement décrit), les entrées-sorties interactives
(`read/1` est simulé par une liste dans `l14b.pl`). Pour ceux-là : la source, et « non
exécuté » dans le rapport.

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

1. Je peux nommer l'erreur en une phrase, et le comportement vrai a été EXÉCUTÉ (table ci-dessus).
2. Chaque proposition a un référent ; aucune parenthèse ni queue de phrase de remplissage.
3. Un débutant crédule pourrait la cocher : c'est une erreur RÉELLE de débutant (table
   ci-dessus, encadrés « Piège fréquent » / « Attention » de la leçon).
4. ⚠️ **Le piège propre à ce cours : « échoue » a un sens TECHNIQUE en Prolog** (`false`),
   distinct de « lève une erreur ». Un distracteur qui dit « échoue » quand Prolog lève une
   exception (ou l'inverse) est vrai ou faux par accident : vérifier chaque fois.
5. ⚠️ **La version compte** : `"…"` (chaîne ou codes), `'[|]'` contre `'.'`, l'affichage des
   réponses (« X = Y, Y = 3 ») sont ceux de SWI-Prolog 7+ ; un distracteur ne s'appuie pas sur
   une différence de version.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## Pourquoi ce travail

Relevé du 2026-11-10, `node tools/mesure-biais-qcm.js --seul=prolog` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **96,3 %** | 100,0 % | 96,3 % |
| la plus détaillée | **78,9 %** | 74,1 % | 97,5 % |
| le mot technique exclusif | **71,1 %** | 72,2 % | 84,6 % |
| l'incise entre parenthèses | **66,8 %** | 55,6 % | **100,0 %** |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | **65,7 %** | 59,3 % | 93,8 % |
| RESTREINDRE à la parenthèse | 65,3 % | 53,7 % | **100,0 %** |
| RESTREINDRE aux deux-points | 58,8 % | 50,0 % | 92,6 % |
| ECARTER la moins bavarde | 50,0 % | 20,4 % | 90,9 % |
| la seule avec un point-virgule (et RESTREINDRE) | 38,9 % | 18,5 % | **100,0 %** |
| ECARTER la plus courte | 36,7 % | 1,9 % | 100,0 % |
| la seule qui nie | 36,1 % | 38,9 % | 52,4 % |
| la MAJUSCULE d'emphase | 36,1 % | 14,8 % | **100,0 %** |
| l'écho de la question | 36,0 % | 33,3 % | 50,0 % |

**43 questions sur 54 (79,6 %)** sont trahies par 5 indices ou plus sur 44.

## Le travail est de l'ALLONGEMENT

Bonne réponse : **94,8 caractères** en moyenne ; distracteur : **20,6** (rapport **4,6**).
`node tools/plan-rangs-qcm.js prolog` : rangs **52 / 2 / 0 / 0**, cible **14 / 14 / 13 / 13**,
**9 403 caractères** à écrire sur 52 questions. **Suis EXACTEMENT** le rang visé et la bande de
caractères de chaque option. Donne au distracteur la MÊME STRUCTURE que la bonne réponse : la
réponse fausse, PUIS sa justification fausse mais cohérente. Les distracteurs actuels sont des
renvois creux (« C'est l'inverse », « Aucune différence », « Visual Basic », « Avec && ») :
aucun débutant ne les coche.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR, LES RANGS, LES MOTS, LA DENSITÉ
Rang visé de `plan-rangs-qcm`. `mesure-biais-inverse --toutes prolog` : **5 alertes** au
départ (la QUATRIÈME plus longue 32,1 %, la TROISIÈME 31,3 %, la DEUXIÈME 31,8 %, la moins
bavarde 29,2 %, la casse initiale rare 26,2 %). Le rang en MOTS de la bonne réponse et son rang
de DENSITÉ (longueur moyenne des mots) doivent eux aussi se répartir : la bonne réponse ne doit
être ni toujours la plus dense, ni toujours la moins bavarde. **Mesurer « la plus dense » dès
la fin de chaque lot** (leçon du cours `tests`).

### (2) LA PONCTUATION — PAR MARQUE, LES QUATRE OU AUCUNE
`;`, `:`, parenthèse, barre oblique, guillemets « », flèche, point interne, virgule décimale,
majuscule d'emphase. ⚠️ Le CODE porte de la ponctuation : `:-` compte comme deux-points,
`déclaratif/logique` et `assert/retract` comme barre oblique (`[T|Q]` n'en est pas une),
`X is 2 + 3` n'en porte pas,
`findall(A, but(A), L)` porte une parenthèse SANS incise (moins de 4 caractères dedans ne
compte pas pour « l'incise », mais compte pour RESTREINDRE à la parenthèse). `NE PAS`,
`QUOI`, `FIN`, `DÉBUT`, `TOUTES`, `ET`, `OU`, `SI` comptent comme majuscule d'emphase.

### (3) LES QUINZE TICS DE LOT — connus AVANT d'écrire (`mesure-tics-lot.js prolog --exemples`)

| tic | bonnes / distracteurs | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **24 / 1** | 25 | **96,0 %** | **57,9 %** |
| **glose finale entre parenthèses** | **16 / 5** | 15 | **93,3 %** | **44,0 %** |
| **point-virgule médian** | **10 / 0** | 10 | **100,0 %** | **38,9 %** |
| parenthèse ouverte par un article | 5 / 0 | 5 | 100,0 % | 31,9 % |
| adverbe de reprise (alors / ensuite / puis) | 6 / 2 | 4 | 100,0 % | 30,6 % |
| « ce qui », « base de » | 4 / 0 | 4 | 100,0 % | 30,6 % |
| « de la » | 4 / 1 | 5 | 80,0 % | 30,1 % |
| « est vrai », « une variable », « ne peut », « la fin », « de la base » | 3 / 1 | 4 | 75,0 % | 28,7 % |
| verbe conjugué en fin d'option | 14 / 19 | 13 | 38,5 % | 28,2 % |
| « des variables » | 3 / 2 | 5 | 60,0 % | 28,2 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (une glose) » : donne-le aux trois distracteurs (quatre porteurs, jamais un ni trois),
avec un contenu qui dit quelque chose.

### (4) LES MOTS FÉTICHES — 4 ALERTES AU DÉPART (`mesure-mot-fetiche.js prolog`)
`liste` (9 bonnes / 5 distracteurs, RESTREINDRE 34,9 %), `faits` (7 / 1, 34,3 %), `prolog`
(7 / 2, 33,8 %), `variables` (5 / 3, 30,6 %) ; puis `règles` (5 / 1), `backtracking` (4 / 2),
`contraintes` (4 / 2) : **pose ces mots dans des distracteurs**, là où ils ont un sens — ce
sont les mots du sujet. `trier` (0 / 6), `aucune` (1 / 5), `boucle` (1 / 5), `assertz` (2 / 4)
sont déjà des mots de DISTRACTEUR : ne les multiplie pas. ⚠️ Dosage : viser une proportion
voisine d'une bonne pour trois distracteurs.

### (5) LE MOT TECHNIQUE EXCLUSIF (71,1 %) ET L'INTRUS LEXICAL
Par mot de 9 lettres et plus : chaque option en porte autant d'exclusifs que la bonne réponse
(égalité), ou le mot de la bonne réponse est repris par les trois distracteurs. Intrus
(`mesure-mot-question.js prolog --plan`) : jamais un mot de 5 lettres et plus porté par
EXACTEMENT trois options — surtout pas les trois distracteurs.

### (6) L'ÉCHO DE L'ÉNONCÉ (36,0 %) — le même nombre de mots repris de l'énoncé dans les quatre

### (7) L'INDICE LEXICAL — règles du `k` et du `w`
`k` = mots de 6 lettres et plus ABSENTS du corps de la page (en occurrences) : les quatre
options en portent le même nombre ; si `k > 0`, elles portent aussi le même nombre `w` de mots
de 6 lettres et plus. Un mot de moins de 6 lettres ne compte ni dans `w` ni dans `k`.

### (8) LES ABSOLUS, LES PRUDENTS, LA NÉGATION — 0 ou 4 porteurs, jamais 1
### (9) TROIS ERREURS DIFFÉRENTES, jamais le miroir de la bonne réponse
### (10) LE POINT INTERNE : un point suivi d'une espace et d'une majuscule
Aucune option n'est écrite en deux phrases. ⚠️ Mais l'outil voit un point interne dans la bonne
réponse du bilan `is (ex. X is 2 + 3)` : « ex. X » est un point suivi d'une majuscule
(`plan-rangs-qcm --marques`, seule marque de ce type avec les guillemets de `tete :- corps.
(se lit « si »)`). Dans ces deux questions, les trois distracteurs portent la même marque.

## Les contraintes de non-régression
1. **La bonne réponse, `q`, `correct` et `explain` sont INTOUCHABLES**, sauf faute PROUVÉE par
   exécution — déjà corrigées avant la vague (commit `c7b4e1a`) : la bonne réponse et l'explain
   de `lecon-06` q3, l'énoncé de `lecon-13` q1, les explain de `lecon-08` q2 et `lecon-11` q1.
2. Aucun distracteur ne devient vrai ni discutable (« échoue » contre « lève une erreur » ;
   un comportement de version).
3. JSON valide, sans BOM, sans CRLF : écrire par `node scratchpad/prolog-sonde/pose.js
   <patchs.json> [--ecrire]` ; un antislash se double dans le JSON (`\\+`).
4. Aucune URL externe.

## L'ORDRE DE TRAVAIL (un écrivain, leçon par leçon, un commit par lot)
1. Lire la leçon en entier.
2. Écrire les trois erreurs de chaque question en une phrase, et les EXÉCUTER si elles
   annoncent un comportement.
3. Rédiger les patchs (`scratchpad/prolog-vague/lNN.json`), puis
   `node scratchpad/prolog-sonde/atelier.js scratchpad/prolog-vague/lNN.json` jusqu'à ce que
   plus rien ne désigne la bonne réponse, puis `node scratchpad/prolog-sonde/simule.js` sur le
   cumul.
4. Poser (`pose.js --ecrire`), `verif-html`, commit.
