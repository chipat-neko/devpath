### LE NNᵉ COURS — `prolog` (« Prolog : la programmation logique »), 96,3 % → 25,0 %

**Clos le 2026-11-10, en un seul passage, par un agent seul sur sa copie** (`D:\test-claude-b4\prolog`,
branche `b4/prolog`, partie de `a6a45f2`). 14 leçons, **54 questions dont 12 de bilan, 162
distracteurs**. Consigne versionnée : `scratchpad/CONSIGNE-PROLOG.md`. Aucun fichier hors
`pages/prolog/**`, `scratchpad/CONSIGNE-PROLOG.md` et ce rapport n'a été modifié ; **rien n'a été
écrit sous `D:\test-claude\`**.

**Commits** (dans l'ordre) : `c7b4e1a` (corrections prouvées AVANT la vague), `fb25ac6`,
`30dd470`, `e568e47`, `880d122`, `2d1e1d1` (la vague, cinq lots), `8376c2f` (dosage), `9ecb826`
(relecture par contradiction), `0a2aebd` (contre-relecture), `c080cca` (ce rapport), `464b57f`
(clause MUST M6 rétablie après `verif.js --rapide`), puis le commit qui complète ce rapport.

#### PROLOG S'EXÉCUTE — SANS RIEN INSTALLER

**SWI-Prolog 10.0.2 (x64-win64)**, tiré de l'installateur officiel `swipl-10.0.2-1.x64.exe`
(SHA-256 `2ec1f25b…41ad6`, **identique** à l'empreinte publiée sur swi-prolog.org). L'installateur
exige les droits d'administrateur (`requestedExecutionLevel level="requireAdministrator"`) : il
**n'a pas été lancé**. Son contenu a été **extrait** par 7-Zip 26.01, lui-même extrait de son
installateur officiel par `7zr.exe` : aucun registre, aucune association de fichier `.pl`, rien hors
de `D:\outils-b4\prolog\`. `swipl --version` répond, `library(clpfd)` se charge.

Outillage écrit pour ce cours (`scratchpad/prolog-essais/`, hors git) : **`rejoue.pl`**, un
mini-toplevel non interactif (toutes les solutions, déterminisme — le toplevel attendrait-il un
« ; » ? —, `false.` final, exception exacte), et `top.sh` qui passe par le vrai toplevel pour
l'affichage exact des réponses déterministes. **322 requêtes rejouées** dans 31 fichiers (
`l/l01.*` à `l/l14b.*`). Sondes : `scratchpad/prolog-sonde/` (celles de `tests`, repointées, plus
`atelier.js` — un lot de patchs appliqué en mémoire, et pour chaque question tout ce qui désigne une
option —, `cand.js`, `vocab.js`, `aplat.js`).

#### AVANT / APRÈS

| indice | avant (`a6a45f2`) | après | commande |
|---|---:|---:|---|
| « la plus longue » | **96,3 %** | **25,0 %** | `mesure-biais-qcm.js --seul=prolog` |
| pire des 44 stratégies | 96,3 % | **26,9 %** (la DEUXIÈME plus longue ; toutes les autres ≤ 25,5 %) | idem |
| la plus détaillée / mot technique exclusif / incise | 78,9 / 71,1 / 66,8 % | 25,0 / 25,0 / 25,0 % (couverture 0) | idem |
| ponctuation forte / point-virgule / deux-points | 65,7 / 38,9 / 58,8 % | 25,0 % partout (couverture 0) | idem |
| questions trahies par 5 indices ou plus | **43 sur 54** (79,6 %) | **0** (46 à 0–2, 8 à 3–4) | idem |
| rangs de la bonne réponse | 52 / 2 / 0 / 0 | **14 / 14 / 13 / 13** (la cible) | `plan-rangs-qcm.js prolog` |
| biais inverse | 5 alertes | **0** (pire : la QUATRIÈME plus longue, 25,3 %) | `mesure-biais-inverse.js --toutes prolog` |
| mots fétiches | 4 alertes (`liste`, `faits`, `prolog`, `variables`) | **0** | `mesure-mot-fetiche.js prolog` |
| tics de lot | **15** (deux-points médian 24/1, glose finale 16/5, point-virgule 10/0…) | **0** | `mesure-tics-lot.js prolog` |
| lexique | **43 exploitables**, 22 retournées, 47 à mettre en forme | **0 exploitable**, 5 retournées, 8 à mettre en forme | `mesure-lexique-qcm.js --liste=prolog` |
| intrus lexical (DÉFAUT / EXCÈS) | 23,1 % / **28,9 % exploitable**, 1 question sûre | 23,6 % / 24,5 %, **0 question sûre** | `mesure-mot-question.js prolog` |
| bonne réponse / distracteur (car.) | 88,5 / 19,6 (rapport 4,5) | 89,2 / 90,5 | calcul sur les blocs |

**162 distracteurs réécrits sur 162, aucun gardé** ; **14 653 caractères** de distracteurs au lieu
de 3 182 (**+11 471**). `mesure-qcm-intouchable prolog a6a45f2` : **5 atteintes, toutes délibérées
et prouvées** (ci-dessous). `verif-html` **0** ; `verif-rendu` sur les **15 pages** du cours (90
mesures page × largeur × thème) : **0 erreur, 0 avertissement** ; JSON des blocs valide, 0 BOM, 0
CRLF dans les pages, 0 chargement externe. `verif-donnees` : seules les **8 erreurs I18** (index
dérivés périmés : `quiz-index.js`, `flashcards-data.js`, antisèches, pièges), **attendues** — la
consigne interdit de régénérer `js/*`.

#### LES FAUTES DE FOND — toutes prouvées par exécution sous SWI-Prolog 10.0.2

**Une BONNE RÉPONSE FAUSSE** (corrigée avec son explain) : `lecon-06` q3, « Que se passe-t-il si on
oublie le cas de base d'une récursion ? » répondait « elle boucle indéfiniment ». **Faux pour les
exemples mêmes de la leçon** : sans cas de base, `somme([10, 20, 30], S)` répond **`false`**
(aucune clause pour `[]`) et `factorielle(5, F)`, gardée par `N > 0`, répond **`false`** aussi ;
seule une récursion SANS garde s'enfonce (`fact_nue(5, F)` : « Stack limit exceeded »). Nouvelle
réponse : « Elle n'a plus de clause d'arrêt : elle échoue (false) dès qu'aucune clause ne
s'applique, sinon elle s'enfonce sans fin ou jusqu'à épuiser la pile ». ⚠️ **Ma première correction
portait elle-même un absolu déplacé**, pris à la contre-relecture : « jusqu'à épuiser la pile » est
faux pour une récursion **terminale** (`boucle(5)` tourne 4 s sans erreur, pile de 64 Mo intacte).
Le glossaire et le « Piège fréquent » de la page disaient la même erreur : corrigés.

**Un ÉNONCÉ faux** : `lecon-13` q1 disait que `10 is X + Y` « échoue » ; il **lève une erreur
d'instanciation** (« Arguments are not sufficiently instantiated ») — le corps de la même page le
disait déjà. En Prolog, « échoue » veut dire `false` : c'est le contresens que le cours doit
justement éviter. Même faute dans la question de vérification de `lecon-13`, dans le corps de
`lecon-06` (`X is Y + 1`, `5 is X + 2`), dans l'explain de `lecon-08` q2 et dans l'encadré « Piège
fréquent » de `lecon-08` (le test placé avant le générateur : `=:=/2` lève l'erreur).

**Trois EXPLAIN faux** : `lecon-06` q3 (ci-dessus), `lecon-08` q2 (« ou échoue »), `lecon-11` q1
(« modifier ou interroger un prédicat inexistant lève une erreur ») — `assertz(jamais_declare(1))`
**réussit** et crée le prédicat dynamique ; seule la modification d'un prédicat chargé du fichier
lève `permission_error`, et seule l'interrogation d'un prédicat inconnu lève `existence_error`.

**Un DISTRACTEUR D'ORIGINE VRAI** : `lecon-02` q3 proposait « Avec | » comme faux « ou » — dans
SWI-Prolog 10, `(p(X) | q(X))` **est** une disjonction (deux solutions). Retiré par la vague ; `or`,
`and`, `&&` et `\/` ont été exécutés avant d'être employés (erreur de syntaxe ou procédure inconnue).

**Corps des leçons** (toutes rejouées) :
- `lecon-13` — **la démonstration centrale de la propagation était fausse** : après
  `X + Y #= 10, X #< Y`, SWI-Prolog donne `X in 1..8, Y in 2..9` (**64 couples**), pas `X in 1..4,
  Y in 6..9` ni « 4 couples restants ». Corrigé dans le bloc de code (sortie recopiée du toplevel),
  le texte, le schéma (trois `<text>`, `aria-label`, légende) ; la page dit maintenant que chaque
  contrainte élague pour son compte et que `label` trouve les 4 solutions.
- `lecon-12` — « `"42"` vaut `[52, 50]` » est faux dans SWI-Prolog 7 et suivants : `"42"` est une
  chaîne, `phrase(nombre(L), "42")` lève `type_error(list, "42")` ; corrigé avec
  `atom_codes('42', C)`. Et `phrase(as(4), L)` rend la liste puis, au « ; », cherche sans fin
  (dépassement de la limite de temps) : signalé dans le commentaire.
- `lecon-07` — « Sans coupure : max renvoie parfois deux réponses » : jamais (`max(7, 3, M)` → `M = 7`
  puis `false` ; `max(3, 3, M)` → `M = 3` puis `false`) ; c'est un point de choix inutile.
- `lecon-05` — « Sans lui, la récursion ne s'arrêterait jamais » (légende du schéma d'`afficher`) :
  sans `afficher([])`, la requête écrit `a`, `b`, `c` puis répond `false`. Et la liste interne
  `'.'(Tete, Queue)` est nommée `'[|]'` depuis SWI-Prolog 7 (précision ajoutée).
- `lecon-02` — le message « Clause/directive expected » **n'existe pas** dans SWI-Prolog 10.0.2
  (absent de `boot/`, de `library/` et de `libswipl.dll`) : un point oublié donne « Operator
  expected », ou « Unexpected end of file » en fin de fichier (exécutés). Et `camarades(alice, X)`
  affichait `X = bob` alors que la base de la page répond `false`.
- `lecon-11` — « retract … réussit une fois » (il en retire une par solution :
  `findall(X, retract(r(X)), L)` → `[1, 2, 3]`) ; le commentaire « retire l'ancienne (si elle
  existe) » d'une fonction qui **échoue** quand il n'y en a pas ; `listing` d'un prédicat dynamique
  vide écrit la directive (« affiche rien ») ; `nb_setval` / `nb_getval` ; la question de
  vérification qui présupposait que `assertz` exige toujours `dynamic`.
- `lecon-06` — « `N = N - 1` … échoue toujours (un nombre n'est jamais égal à lui-même moins un) » :
  la raison est qu'`=` n'évalue pas le terme, pas l'arithmétique.
- `lecon-03` — le toplevel écrit `X = Y, Y = 3.`, pas `X = 3, Y = 3.` (vrai toplevel).
- `lecon-04` — deux renvois à la « leçon 6 » pour la récursion à gauche, que la leçon 6 ne traite
  pas ; renvoi à l'encadré voisin et au tabling de la leçon 11 (`:- table ancetre/2.` termine,
  exécuté).
- `lecon-08` et `lecon-14` — français (« il ne échoue pas », « lui manque cruellement à »).
- `lecon-13` — « OR-Tools, Gecode en descendent directement » : filiation non établie, formulation
  prudente.

**Exercices** : `lecon-11` exo 2 **acceptait `asserta`** pour « le prédicat qui ajoute une clause à
la FIN » (retiré ; `assert` reste accepté : `assert(f(1)), assert(f(2))` → `[1, 2]`). **Sept indices
ou placeholders donnaient la réponse avant le masque** (`lecon-01` exo 2, `lecon-02` exo 1,
`lecon-08` exo 2, `lecon-09` exos 1 et 2, `lecon-12` exos 1 et 2) : réordonnés ou réécrits ;
`exos-tous.js` : 17 → **14 fuites**, toutes des **derniers indices délibérés** ou des données de
l'énoncé (`lecon-04` exo 3).

#### `verif.js --rapide` — CE QU'IL SIGNALE, ÉTAPE PAR ÉTAPE

Joué sur la copie (53 étapes, 383,5 s) : 10 étapes signalent, 1 ne mesure rien. Pour séparer ce
qui vient du cours de ce qui existait avant, les huit étapes en cause ont été rejouées deux fois
dans la copie, pages de `prolog` prises à `a6a45f2` puis remises à `HEAD` (sorties :
`scratchpad/prolog-apres/signaux-a6a45f2/` et `signaux-head/`, script
`scratchpad/prolog-corr/signaux.sh`).

- **Une faute à moi, corrigée (`464b57f`)** : `doc-ref`/`normatf` — « aucune question du site ne
  viole un MUST » tombait à **1 manquement**, et c'était `lecon-04` q3 : deux distracteurs finissaient
  par « la réponse suivante », que la clause **M6** (« aucune option ne fait référence à sa position
  d'affichage », `tools/doc/mesures/conformite-quiz.js`) lit comme un renvoi à l'option suivante.
  En Prolog, c'est la solution d'après le « ; », mais la règle est un MUST : réécrit « la réponse à
  suivre » (même longueur, `w` et `k` inchangés, `controle.js --ref=c080cca` : 0 indicateur
  déplacé). M6 : **0 / 6 103**.
- **Attendus** : `qcmbiai` et `qcmlexi` (le cours a progressé, 96,3 % → 25,0 %, sans que le gain
  soit figé) ; `donnees` (I18, 8 erreurs : index dérivés périmés).
- **Dus au cours, hors de mon périmètre** : `normatf` — **9 contrôles de plus en échec** (4 à
  `a6a45f2`, 13 à `HEAD`), tous des chiffres du site que **`pages/doc/lecon-03.html`** cite et que
  le cours a fait bouger : manquements à S3 **1 282 → 1 231** (21,0 % → 20,2 %), conformes 4 821 →
  4 872 (79,0 % → 79,8 %), S4 **58 → 59 / 89 cours** (65,2 % → 66,3 %), ancienne clause 3 661 →
  3 699 questions, rang 1 35,2 % → 35,1 %. Page d'un autre cours : non touchée, à régénérer après
  fusion (voir « Ce qui reste »).
- **Préexistants, sans lien avec `prolog`** (sortie identique ligne pour ligne à `a6a45f2`) :
  `etudes` (`pages/etude-inconnu.html` périmée), `moteurs` (`build-sources-worker`), `maths`
  (58 divergents, leçons 07-08 de maths), `rj-cpp` (12 blocs C++ introuvables), `doc-ref` (« écart
  de 1 caractère » avec `tools/doc/reference/slugify.txt`), les 4 échecs de `normatf` présents à
  `a6a45f2` (sorties publiées « 31 lignes, obtenu 31 »), `requete` NON MESURÉ (« fin de JUGE_SQL
  introuvable »). `etude-inconnu` ne diffère que par le poids du corpus (6 728,8 → 6 728,9 Ko ; la
  page publiée en annonce 6 570,2 depuis avant `a6a45f2`). Hypothèse **non prouvée** pour plusieurs
  d'entre eux : les fins de ligne CRLF que la copie de travail reçoit (`core.autocrlf=true`) —
  `tools/doc/reference/slugify.txt` y est en CRLF ; à rejouer dans le dépôt principal.
- 28 étapes ne sont pas jouées par ce mode ; `verif-rendu` l'a été à part (15 pages, 0 erreur).

#### CE QUI N'A PAS ÉTÉ EXÉCUTÉ

SWISH, Tau Prolog, GNU Prolog, SICStus, Mercury, Datalog, ASP ; le traceur interactif (`trace.`,
décrit seulement) ; les entrées-sorties interactives de `lecon-14` (`read/1` simulé par une liste :
5 questions posées une seule fois, `[poil, carnivore, taches, rayures, sabots]`). **Non vérifiés,
laissés tels quels** (de mémoire, sans source consultée) : IBM Watson et Prolog, les compagnies
aériennes et SICStus (`lecon-09`, `lecon-13`), MYCIN « environ 600 règles », XCON « des dizaines
de millions de dollars par an » (`lecon-14`), le Sudoku « en quelques millisecondes » (`lecon-08`).

#### LES LEÇONS DE CE COURS

- **Le mot « échoue » est un terme technique en Prolog** (`false`), distinct de « lève une
  erreur ». Le cours le confondait à six endroits, dont un énoncé de QCM ; une bonne réponse
  intouchable reposait sur cette confusion. Aucun outil ne le voit : il faut exécuter.
- **Corriger avant d'écrire** : les fautes prouvées à la préparation ont été posées dans un commit
  à part (`c7b4e1a`) AVANT la vague, pour que le vocabulaire des pages — donc le `k` du lexique —
  ne bouge plus sous les distracteurs ; la seule correction tardive qui a fait sortir un mot de la
  page (« directement », `lecon-13`) a aussitôt changé le `k` d'un distracteur (vu par
  `controle.js`, rattrapé).
- **La vague fabrique « la plus dense » et « la moins bavarde »** (31,5 % et 27,3 % après la
  vague) et **« écarter les deux extrêmes »** (31,5 %) : ce dernier venait de **cinq égalités de
  longueur entre deux distracteurs** aux extrêmes, qui laissaient la bonne réponse seule au milieu.
  Dosage calculé : 17 retouches simulées, aucune régression.
- **L'intrus lexical se règle à l'écriture, pas après** : un distracteur « miroir » de la bonne
  réponse (mêmes mots, rôles inversés) prive la bonne réponse de tout mot unique, et la lecture
  EXCÈS la désigne alors par élimination. Il faut qu'un mot de la bonne réponse manque au miroir.
- **Mes propres corrections sont fautives comme celles des agents** : la contre-relecture a pris
  un absolu déplacé dans la bonne réponse que je venais de corriger, une correction posée à un
  endroit sur deux, une question de vérification devenue incohérente — 3 corrections en défaut sur
  49 posées (6,1 %) — et, dans la consigne, des chiffres écrits sans mesure (94,8 / 20,6 au lieu de
  88,5 / 19,6), corrigés. ⚠️ Le message du commit `0a2aebd` annonce « 4 prises sur 30 corrections,
  13,3 % » : chiffres écrits trop vite, les bons sont ceux-ci.
- **Deux sondes ne comptent pas `k` de la même façon** : `controle.js` compte les mots étrangers
  DISTINCTS, `mesure-lexique-qcm.js` (celui du cliquet) les OCCURRENCES ; sur `lecon-06` q2, le
  distracteur qui répète « l'unification » est conforme pour l'outil officiel et signalé par la
  sonde. À harmoniser hors B4.
- **Les 44 stratégies, le lexique, l'intrus, les tics, le fétiche et mes sondes étaient tous verts
  sur une option qu'une clause MUST du site interdit** (« la réponse suivante », M6) : seul
  `verif-normatif` la lit. Il se joue en une seconde
  (`tools/doc/mesures/conformite-quiz.js`, fonction `mesurer()`) : à mettre dans la boucle de la
  vague, pas seulement à la fin.

#### CE QUI RESTE

- Lexique : **5 questions retournées** (une variante désigne un distracteur seul : l'écarter rend
  33,3 % sur la question) et **8 à mettre en forme** ; aucune exploitable.
- Intrus lexical (`mesure-mot-question.js prolog --plan`) : **11 mots sur 3 questions** qui
  tranchent — `lecon-06` q2 (« égalité », « arithmétique », « évalue », « côtés » absents de
  l'option 3 ; « aussi », « termes », « entiers » propres à elle), `lecon-07` q1 (« points »,
  « retour », « arrière » absents de l'option 3), `lecon-14` q14 (« inconnues » absent de
  l'option 2). Tous désignent un **distracteur**, jamais la bonne réponse : **0 question sûre**,
  DÉFAUT 23,6 / 25,5 %, EXCÈS 24,5 / 25,2 %.
- « la DEUXIÈME plus longue » à **26,9 %** (rangs 14 / 14 / 13 / 13 exacts ; la différence vient des
  égalités de longueur restantes).
- Affichage du toplevel : les pages montrent `true.` ou `F = 120.` là où SWI-Prolog attend un « ; »
  (l'apprenant qui tape Entrée voit bien le point) ; les suites de solutions s'arrêtent avant le
  `false.` final. Convention du cours, laissée.
- Dix exercices dont la réponse se lit dans l'énoncé visible (`fuites-enonces.js`, dont
  `lecon-01` exo 1 « sous la forme aime(chat, poisson) ») : convention du site, à trancher hors B4.
- `lecon-08`, « C'est l'inverse exact de l'erreur, mais facile à commettre » : phrase obscure,
  laissée.
- **À faire par l'orchestrateur** : refiger les cliquets (`verif-qcm-biais.js --ecrire`, `prolog`
  à marquer `traite` ; `verif-qcm-lexique.js --ecrire`), régénérer les index (`build-index --write
  --fresh`, `tools/doc/gen.js`, assembleurs des études) jusqu'au point fixe, puis `verif.js
  --rapide`. Dans cette copie, `verif-donnees` ne signale que l'I18 attendu. **Et régénérer les
  chiffres du site que cite `pages/doc/lecon-03.html`** (S3, S4, ancienne clause : 9 contrôles de
  `verif-normatif` les attendent à jour), une fois toutes les branches B4 fusionnées, puisque chaque
  cours clos les déplace.
