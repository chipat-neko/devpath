# Consigne d'écriture — les QCM du cours `ada` (V18, case C7)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c7-ada` (branche `v18/c7-ada`,
partie de `8d163bf`). Un seul agent fait tous les rôles (écriture, dosage, relecture,
correction, contre-relecture). Mesures de départ archivées dans `scratchpad/c7-ada/depart/`
(hors git : sorties brutes des outils, `questions.txt` = les 49 questions à plat avec leurs
explain). Sondes dans `scratchpad/c7-ada/sonde/` : `controle.js` (copié de `vue-sonde`, v2, il
CHARGE les 44 stratégies ; à vide : **0 indicateur déplacé sur 49 questions**), `pose.js`,
`simule.js`, et trois neuves : `dump.js` (les QCM à plat), `texte.js` (une leçon en texte
lisible) et **`atelier.js`** (banc d'écriture : un lot de patchs appliqué EN MÉMOIRE ; pour
chaque option la longueur, le rang, les mots, la densité, `, : ;`, les incises, les marques,
négation / absolu / prudent, l'écho, l'attaque, les mots de 9+ lettres exclusifs, `w` et `k`,
les tics de forme ; pour chaque question les stratégies des 44 qui tranchent, l'intrus lexical,
les tics à 1 ou 3 porteurs ; puis le résumé du cours entier).

Le cours : « Ada », 14 leçons — philosophie et premier programme (`01`), types et plages (`02`),
contrôle (`03`), sous-programmes et modes (`04`), tableaux et records (`05`), paquets et type
`private` (`06`), exceptions et contrats (`07`), tâches, `protected`, rendez-vous (`08`),
GNAT, SPARK et Alire (`09`), génériques (`10`), types étiquetés (`11`), chaînes et fichiers
(`12`), SPARK et la preuve (`13`), projet de synthèse (`14` : 3 questions + **7 de bilan**).
**49 questions, 147 distracteurs.**

## ✅ CE QUI SE PROUVE SE PROUVE — ADA S'EXÉCUTE ICI (par Compiler Explorer)

Aucun GNAT sur la machine ; l'API de Compiler Explorer compile **et exécute** avec
**GNAT 16.2** (`gnat162`, x86-64, `-gnat2022`). Lanceur : `scratchpad/c7-ada/gb.js
<fichier.adb> [--opt="-gnat2022 -gnata"]` (la procédure principale s'appelle `Example`,
nom imposé par la source `example.adb` ; les paquets se déclarent DANS cette procédure).
Preuves : `scratchpad/c7-ada/preuves/*.adb` et leurs sorties `*.out`.

**Erreurs classiques EXÉCUTÉES avant l'écriture** (GNAT 16.2). N'emploie dans un distracteur
que celles que TA leçon établit, et au mot près :

| croyance fausse | ce que GNAT 16.2 rend (fichier) |
|---|---|
| `if X := 5 then` passe | erreur « ":=" should be "=" » (`e01`) |
| `P := 150;` pour `range 0 .. 100` se règle à l'exécution | erreur de COMPILATION « value not in range… static expression fails Constraint_Check » (150 sort de la base −128 .. 127) ; mais `H : Heure := 25;` pour `range 0 .. 23` COMPILE avec deux avertissements et lève `Constraint_Error` à l'exécution (`c02`, `c02b`) |
| une valeur calculée hors plage est tronquée | `Constraint_Error` (type comme subtype) (`e02`) |
| un subtype ne se mélange pas à `Integer` | `N + 3` avec `N : Note` rend 18 (`e02`) |
| `Integer + Float` passe | « invalid operand types for operator "+" » ; idem `Pourcentage + Integer`, `Metres + Secondes` (`e03`) |
| `Integer (2.5)` tronque | il ARRONDIT : 3 ; `Integer (3.5)` = 4 ; `Integer (1.4)` = 1 (`e03b`) |
| un `case` incomplet compile | « missing case value: "Dimanche" » (`e04`) |
| `break` sort d'une boucle | « "break" is undefined » (`e05b`) |
| on réaffecte l'indice d'un `for` | « assignment to loop parameter not allowed » (`e05`) |
| on modifie un paramètre `in` | « assignment to "in" mode parameter not allowed » (`e06`) |
| on appelle une fonction comme une instruction | « cannot use call to function "Carre" as a statement » + « return value of a function call cannot be ignored » (`e06`) |
| une procédure dans une expression | « expected type "Standard.Integer" / found package or procedure name » (`e06`) |
| nommé puis positionnel | « positional parameter association not allowed after named one » ; positionnel PUIS nommé est permis (`e07`, `e07b`) |
| `P->Age` sur un record | « invalid token » (`e08b`) |
| `for I in 1 .. 4` sur `N (3 .. 6)` | `Constraint_Error` ; `N'Range` = 3 .. 6, `N'Length` = 4 (`e08`) |
| on lit un champ d'un type `private` hors du paquet | « invalid prefix "A" in selected component » ; mais `B := A` et `A = B` sont permis (`e09`) |
| `Ada.Text_IO.Put_Line` sans `with` | « "Ada" is undefined » + « missing "with Ada.Text_IO;" » (`e09b`) |
| une exception non rattrapée est ignorée | le programme s'arrête, code 1, « raised EXAMPLE.SOLDE_INSUFFISANT : solde 10 » (`e10`) |
| `Pre` / `Post` sont toujours vérifiés | **SANS `-gnata` (ni `pragma Assertion_Policy`), GNAT NE LES VÉRIFIE PAS** : `Racine_Entiere (-4)` rend 1 en silence ; avec `-gnata` : `ADA.ASSERTIONS.ASSERTION_ERROR : failed precondition` (`e11`) |
| une tâche attend un `start` | elle est active avant la première instruction du corps qui la déclare ; le bloc qui déclare 4 tâches attend leur fin ; 4 × 1 000 incréments protégés = 4 000 (`e12`) |
| rendez-vous : l'appelant continue sans attendre | l'appelant attend la fin de l'`accept` ; les deux poursuivent ensuite (`e12`) |
| `<` sur un `type Element is private` formel | « there is no applicable operator "<" for private type "Element" » ; `=` et `:=` passent (`e13`, `e13b`) |
| on appelle un générique sans l'instancier | « prefix must not be a generic package / use package instantiation as prefix instead » (`e13b`) |
| `overriding` sur un nom mal tapé passe | « subprogram "Parlr" is not overriding » ; SANS `overriding`, la faute passe en silence (`e14b`) |
| un paramètre `Animal` dispatche | appel STATIQUE (version d'Animal) ; `Animal'Class` dispatche (Chien.Parler) (`e14`) |
| `A := R;` (un Chien dans un Animal) | refusé : « expected type "Animal" / found type "Chien" » ; `Animal (R)` convertit et garde la partie Animal (`e14`, `e14c`) |
| `"Lyon"` dans `String (1 .. 5)` | compile avec « wrong length for array… Constraint_Error will be raised at run time », puis `Constraint_Error` (`p12a`) |
| `Get_Line` après la fin | `End_Error` ; `Open` d'un fichier absent : `Name_Error` (`e16`) |

⚠️ **Les pièges propres à ce cours.**
- « Le programme ne compile pas » contre « il compile avec un avertissement et lève
  `Constraint_Error` » : GNAT distingue les deux (tableau). Un distracteur qui confond est
  vrai ou faux par accident — vérifier chaque fois.
- `return` SORT bien d'une boucle (en quittant le sous-programme) : « avec `return` » n'est pas
  une erreur nette pour « sortir d'une boucle ». Même prudence avec `goto`.
- Les contrats ne sont vérifiés que si les assertions sont activées : un distracteur ne peut pas
  s'appuyer sur « vérifiés toujours / jamais ».
- SPARK, GNATprove, Alire et GNAT Studio ne s'exécutent PAS ici : la source, et « non exécuté ».

## Pourquoi ce travail — mesure de départ (`node tools/mesure-biais-qcm.js --seul=ada`)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **96,6 %** | 98,0 % | 97,9 % |
| le mot technique exclusif | **77,7 %** | 77,6 % | 89,5 % |
| la plus détaillée | **76,0 %** | 65,3 % | 100,0 % |
| RESTREINDRE à la ponctuation forte | **65,8 %** | 53,1 % | 100,0 % |
| RESTREINDRE à la parenthèse | **62,8 %** | 55,1 % | 92,6 % |
| l'incise entre parenthèses | **61,7 %** | 51,0 % | 96,0 % |
| RESTREINDRE aux deux-points | **57,7 %** | 42,9 % | 100,0 % |
| l'écho de la question | **50,5 %** | 42,9 % | 81,0 % |
| ECARTER la moins bavarde | **44,6 %** | 16,3 % | 87,5 % |
| RESTREINDRE au point-virgule | **37,8 %** | 16,3 % | 100,0 % |
| ECARTER la plus courte | 36,1 % | 2,0 % | 100,0 % |
| la plus prudente | 34,2 % | 12,2 % | 100,0 % |
| la plus dense | 32,1 % | 93,9 % | 32,6 % |

**38 questions sur 49 (77,6 %)** trahies par 5 indices ou plus. La bonne réponse est en
position 0 dans la source pour les 49 (sans effet : `js/lecon.js` mélange à l'affichage).
Rangs **48 / 0 / 1 / 0**, cible **13 / 12 / 12 / 12** ; `plan-rangs-qcm` demande
**9 822 caractères** sur **47 questions**. Biais inverse : **4 alertes** (rangs 2, 3, 4 et
« la moins bavarde », DIRECTE 0,0 %). Lexique : **43 exploitables, 32 retournées, 47 à mettre en
forme**. Intrus lexical : EXCÈS 28,6 %, 1 question sûre (`lecon-05` q2 : « notation pointée »).
Mot fétiche : 0 alerte (`rapide` 0 / 7 et `interdit` 1 / 6 sont des mots de DISTRACTEUR : ne
les multiplie pas).

### Les CINQ tics de lot (`node tools/mesure-tics-lot.js ada --exemples`)

| tic | bonnes / distr. | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **20 / 0** | 20 | **100,0 %** | **55,6 %** |
| **glose finale entre parenthèses** | **12 / 2** | 12 | 91,7 % | **41,3 %** |
| **point-virgule médian** | **9 / 1** | 8 | 100,0 % | **37,2 %** |
| « à la » | 5 / 1 | 6 | 83,3 % | 32,1 % |
| « et la » | 4 / 0 | 4 | 100,0 % | 31,1 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (glose) » : **les distracteurs prennent le MÊME gabarit**, avec un contenu qui énonce
une erreur — jamais une parenthèse ou une queue de phrase de remplissage.

## La règle qui prime sur toutes les mesures

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Test de recevabilité pour CHAQUE distracteur : (1) l'erreur se nomme en une phrase ; (2) chaque
proposition a un référent ; (3) un débutant crédule pourrait le cocher (erreur venue d'un autre
langage : `break`, `->`, `int x = …`, conversion implicite, `start()` d'un thread…) ; (4) aucune
parenthèse ni queue de phrase de remplissage ; (5) aucune clause finale qui avoue la faute
(« … et le programme plante ») ; (6) aucun comportement de GNAT annoncé sans avoir été EXÉCUTÉ
(table ci-dessus). **Préfère une erreur classique et nette à une élégance mesurée** ; et si une
contrainte de forme oblige à une phrase bancale, c'est la contrainte qui cède.

## Ce que tu tiens, question par question (`atelier.js` le vérifie)

1. **Longueur et rangs** : rang visé de `plan-rangs-qcm` (13 / 12 / 12 / 12), sans ex æquo avec
   la bonne réponse ; distracteurs dans 70-130 % de sa longueur.
2. **Marques — les quatre ou aucune** : `;`, `:`, parenthèse, `/`, « », flèche (`=>` compte !),
   point interne (un point suivi d'une espace et d'une majuscule), tiret cadratin. ⚠️ Le CODE
   porte des marques : `Proc(Nom => "Ada")` est une parenthèse ET une flèche, `T'Range` n'en est
   pas une, `in out` non plus, `Ada.Text_IO;` porte un point-virgule.
3. **Même nombre de `, : ;`** et **même nombre d'incises** de 4+ caractères dans les quatre.
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre options.
5. **Attaque** : jamais trois options sur le même premier mot et la quatrième ailleurs
   (`Parce que` et `Parce qu'` sont DEUX attaques) ; casse initiale : pas une seule minuscule.
6. **Absolus, prudents, négation** : les quatre ou aucune (`ne`, `pas`, `n'`, `rien`, `aucun`,
   `jamais`, `ni` ; `peut`, `permet`, `selon`, `souvent` ; `uniquement`, `seulement`, `toujours`).
7. **Mots de 9+ lettres** : chaque option en porte le même nombre d'EXCLUSIFS — le plus sûr est de
   reprendre ceux de la bonne réponse dans les distracteurs.
8. **Intrus lexical** (mots de 5+ lettres) : aucun mot porté par exactement trois options ; chaque
   option garde au moins un mot à elle.
9. **Lexique** : `k` (mots de 6+ lettres absents du corps de la page, en occurrences) égal dans
   les quatre ; si `k > 0`, `w` (mots de 6+ lettres) égal aussi. L'apostrophe et le tiret collent
   (`l'exhaustivité`, `mutuellement-exclusif` sont UN jeton).
10. **Tics de forme** : 0, 2 ou 4 porteurs (deux-points médian, point-virgule, glose finale,
    « à la », « et la », « est / sont / reste », « ce / cette / ces », « car / parce que »,
    « alors / ensuite / puis », « ne … que », « (un / une / le … »).
11. **Fin d'option** : aucune ne finit par `.`, `!` ou `?`.
12. **Densité et nombre de mots** : allonger avec le vocabulaire technique de la leçon, pas avec
    des chevilles ; mesurer « la plus dense » et « la moins bavarde » à la fin de chaque lot,
    doser par calcul.

## L'ordre de travail
1. Relire la leçon entière (le corps fixe le vocabulaire et ce qui est vrai) ; exécuter ce que
   le corps affirme de GNAT quand c'est douteux.
2. Écrire les trois erreurs de chaque question en une phrase, les exécuter si elles portent sur
   le comportement du compilateur ou du programme.
3. Rédiger au gabarit de la bonne réponse, dans la bande ; `atelier.js lot.json --rangs=…`
   jusqu'à ce que plus rien ne désigne la bonne réponse.
4. Poser par `pose.js lot.json --ecrire`, `controle.js` / mesures du cours, COMMITER le lot.
