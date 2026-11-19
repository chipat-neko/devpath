# C7 — ada, 96,6 % → 26,5 %

Rapport de la case C7 du CHANTIER-V18 (phase C) : les QCM du cours `ada`. Copie de travail
`D:\test-claude-c7-ada`, branche `v18/c7-ada`, partie de `8d163bf`. Un seul agent pour tous les rôles
(mesure, preuves, consigne, vague, dosage, relecture, contre-relecture). Rien n'a été écrit dans
`D:\test-claude\`.

**En tête, comme demandé — atteinte à l'intouchable : 1, déclarée et prouvée.**
`lecon-11` q2, **explication** : « … et affecter un descendant à un Animal le tronque à sa partie
ancêtre » devient « … et convertir un descendant en Animal le tronque à sa partie ancêtre (l'affectation
directe est refusée) ». Preuve, GNAT 16.2 par Compiler Explorer : `A := R;` (un `Chien` dans un `Animal`)
est refusé à la compilation — « expected type "Animal" defined at line 3 / found type "Chien" defined at
line 4 » (`preuves/e14c-affect.adb`) ; c'est la conversion `Animal (R)` qui ne garde que la partie ancêtre
(`Presenter (Animal (R))` affiche « Animal.Parler (Rex) », `preuves/e14-objet.adb`). Aucune bonne réponse
n'a été touchée. `node tools/mesure-qcm-intouchable.js ada 8d163bf` : 1 atteinte, celle-ci.

**Commits** : `65f9a14` (lot 1 + consigne), `8da0436` (lot 2), `fb09195` (lot 3), `c8256ba` (lot 4),
`1988a48` (lot 5, bilan compris), `99b475b` (dosage), `8f16267` (relecture : corps et explain),
`1d061cb` (« écarter les deux extrêmes »), puis le commit de ce rapport.

## Avant / après

| indice | avant (`8d163bf`) | après | commande |
|---|---:|---:|---|
| la plus longue | **96,6 %** | **26,5 %** | `node tools/mesure-biais-qcm.js --seul=ada` |
| pire des 44 stratégies | la plus longue 96,6 % | la moins bavarde **26,9 %** | idem |
| stratégie la plus basse | — | ECARTER le mot technique exclusif 20,2 % | idem |
| le mot technique exclusif | 77,7 % | 25,7 % | idem |
| la plus détaillée | 76,0 % | 24,0 % | idem |
| RESTREINDRE à la ponctuation forte | 65,8 % | 25,5 % | idem |
| RESTREINDRE à la parenthèse | 62,8 % | 25,0 % | idem |
| l'incise entre parenthèses | 61,7 % | 24,5 % | idem |
| RESTREINDRE aux deux-points | 57,7 % | 25,5 % | idem |
| l'écho de la question | 50,5 % | 23,0 % | idem |
| la plus dense / la moins bavarde | 32,1 % / 1,7 % | 25,0 % / 26,9 % | idem |
| écarter les deux extrêmes | 2,0 % | 24,5 % | idem |
| questions trahies par 5 indices ou plus | **38 / 49** | **0** | idem |
| rangs de la bonne réponse (0 = la plus longue) | 48 / 0 / 1 / 0 | **13 / 12 / 12 / 12** (cible exacte) | `node tools/plan-rangs-qcm.js ada` |
| lexique : exploitables / retournées / à mettre en forme | 43 / 32 / 47 | **0 / 0 / 0** (couverture 0,0 % dans les six lectures) | `node tools/mesure-lexique-qcm.js --liste=ada` et `--seul=ada` |
| mot fétiche | 0 alerte | 0 alerte (« chaque » 27,6 % en ECARTER, sous le seuil) | `node tools/mesure-mot-fetiche.js ada` |
| tics de lot | **5** (deux-points médian 55,6 %, glose finale 41,3 %, point-virgule 37,2 %, « à la » 32,1 %, « et la » 31,1 %) | **0** | `node tools/mesure-tics-lot.js ada --exemples` |
| biais inverse | 4 alertes (rangs 2, 3, 4, la moins bavarde) | **0 alerte** (pire : le mot technique exclusif 27,5 %) | `node tools/mesure-biais-inverse.js --toutes ada` |
| intrus lexical DÉFAUT / EXCÈS | 21,4 % / 28,6 %, 1 question sûre | 25,0 % / 24,1 %, **0** question sûre | `node tools/mesure-mot-question.js ada --liste` |
| explications orphelines | — | 0 (3 cas indicatifs de vocabulaire, lus) | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --travail --seul=ada` |

Sorties brutes : `scratchpad/c7-ada/depart/` et `scratchpad/c7-ada/final/` (hors git).

## Ce qui a été écrit

- **147 distracteurs, 145 réécrits, 2 gardés** (« = » et « <- » du bilan q3 « Quel est l'opérateur
  d'affectation ? », déjà des erreurs nettes ; ils ont été gardés après un essai de remplacement).
- **11 807 caractères écrits** (3 914 → 15 721) ; longueur moyenne d'un distracteur 26,6 → 106,9 caractères,
  bonne réponse 105,5.
- Vague en cinq lots commités (01-03, 04-06, 07-09, 10-12, 13-14), puis un dosage de **24 options** sur
  20 questions, puis 4 options retouchées à la relecture et à la mesure finale.
- Consigne du cours : `scratchpad/CONSIGNE-ADA.md` (versionnée), avec la table des erreurs classiques
  exécutées avant l'écriture.

**Outils de travail** (`scratchpad/c7-ada/`, hors git) : `gb.js` (compile ET exécute un programme Ada par
l'API de Compiler Explorer, GNAT 16.2) ; sonde copiée de `vue-sonde` et repointée (`controle.js` v2,
`pose.js`, `simule.js`) ; `atelier.js` (banc d'écriture : un lot en mémoire, et pour chaque option longueur,
rang, mots, densité, `, : ;`, incises, marques, négation / absolus / prudents, écho, attaque, mots 9+
exclusifs, `w` et `k`, tics ; pour chaque question les stratégies qui tranchent, l'intrus, les tics à 1 ou
3 porteurs) ; `vocab.js` (`w` et `k` d'une phrase candidate contre la page) ; `dosage2.js`, `deficit.js`
(lettres manquantes et marge de longueur pour faire basculer « la plus dense ») ; `x9.js` (motif du mot
technique exclusif par question) ; `stats.js`.

## Le dosage, calculé

Après la vague : la plus longue 26,5 %, mais **la plus dense 46,4 %**, **la moins bavarde 36,4 %**,
**le mot technique exclusif 31,3 %** — la bonne réponse, intouchable, est écrite avec les mots longs du
domaine, les distracteurs allongés portent des mots courts. Cible 25 % = 12,25 questions sur 49 :
- densité : `deficit.js` donne, par distracteur, les lettres qui manquent pour dépasser la bonne réponse
  et la marge de longueur avant de changer de rang ; une dizaine de bascules (dont deux en égalité),
  choisies là où le déficit était le plus petit (retirer « par une table », « si bien que » → « donc »,
  « un accès en lecture » → « la lecture », « (via return) » → « (avec return) »…) : 46,4 → 25,0 % ;
- peu de mots : quelques options raccourcies en mots (`lecon-04` q3, `lecon-13` q2, `lecon-14` q1 et q9) :
  36,4 → 26,9 % ;
- mot technique exclusif : 31,3 → 25,7 %, et surtout **le biais inverse** de cet indice — l'outil a d'abord
  alerté dans l'autre sens (le mot exclusif désignait un distracteur 15 fois sur 17 : écarter rendait
  29,4 %) ; ramené à 27,5 % en rendant l'égalité aux quatre options de `lecon-02` q3 et du bilan q2 (`lecon-14`
  q5), et en laissant la bonne seule en tête sur `lecon-03` q1 ; « écarter le mot exclusif » ne tranche
  plus que sur 7 questions (motif « trois options en tête, la quatrième seule en dessous » : 8 → 7).
Chaque retouche passée par `controle.js` (aucun autre indicateur déplacé) avant d'être posée.

## Fautes de fond trouvées et corrigées (corps et explain)

Toutes **exécutées** sous GNAT 16.2 (Compiler Explorer, `-gnat2022`), fichiers dans
`scratchpad/c7-ada/preuves/`, sauf le dernier point.

1. **`lecon-11`, explain q2 + piège** — l'affectation d'un descendant à un `Animal` (voir en tête).
2. **`lecon-04`, trois phrases** : « le compilateur refuse […] de lire un `out` non encore affecté »,
   « un `out` doit recevoir une valeur », et le piège « un paramètre `out` n'est pas lisible avant d'avoir
   été affecté ». Faux depuis Ada 95 : lire un `out` avant de l'affecter compile, avec
   « warning: "R" may be referenced before it has a value », et la valeur lue n'a pas de sens (V passe de
   41 à 1) ; un `out` jamais affecté compile sans un mot (`c04-out.adb`). Le refus vaut pour le seul `in`
   (« assignment to "in" mode parameter not allowed », `e06`).
3. **`lecon-05`, code** : `Ma_Classe (1).Nom := "Premier élève       ";` lève **Constraint_Error** (« length
   check failed ») avec les réglages par défaut de GNAT : la source est en UTF-8, « é » et « è » comptent
   chacun pour deux caractères, la chaîne en fait 22 pour un `String (1 .. 20)` (`c05-record.adb` ; elle
   passe avec `-gnatW8`). Remplacée par `"Premier inscrit     "` (20 caractères), exécutée (`c05b-record.adb`).
4. **`lecon-02`, trois passages** : (a) « toute valeur hors de cette plage déclenche une erreur — à la
   compilation si elle est détectable » : faux en général — `H : Heure := 25;` (plage 0 .. 23) compile avec
   deux avertissements puis lève Constraint_Error ; seul `P := 150;` (hors de la base −128 .. 127 de
   `Pourcentage`) est une erreur de compilation (« static expression fails Constraint_Check ») (`c02`,
   `c02b`) ; (b) la solution de l'exercice 3 disait `H : Heure := 25;` « rejeté » : réécrite d'après
   l'exécution ; (c) `type Tension is delta 0.01` ne donne pas un pas de 0,01 : `Tension'Small` vaut
   7,8125E-03 (1/128), et 1,0 / 3 rend 0,328125 (`c02-plages.adb`) — « un pas d'au plus 0,01 (GNAT choisit
   1/128) ».
5. **`lecon-07` et `lecon-13`** : « si une précondition est violée à l'exécution, Ada lève une exception » et
   « en Ada ordinaire, [les contrats] sont vérifiés à l'exécution » — seulement si les assertions sont
   actives : sans `-gnata`, `Racine_Entiere (-4)` rend 1 en silence ; avec, `ADA.ASSERTIONS.ASSERTION_ERROR :
   failed precondition` (`e11-contrats.adb`). Nuance ajoutée aux deux endroits.
6. **`lecon-13`** : « on active l'analyse avec un simple *pragma* » alors que le code montre l'aspect
   `with SPARK_Mode => On` (et le glossaire de la page dit « Aspect ») → « aspect » ; « SPARK refuse de
   compiler tant qu'une des deux obligations n'est pas tenue » → « GNATprove signale chacune des deux
   obligations tant qu'il ne parvient pas à la prouver » (la compilation par GNAT est indépendante de la
   preuve). **Non exécuté** (pas de GNATprove ici) : d'après la documentation SPARK.

Aucune bonne réponse n'a été trouvée fausse. **Aucun encadré « Cas réel » touché** (`verif-contenu` :
1 551 conformes sur 1 551).

## Ce qui a été exécuté, et ce qui ne l'a pas été

**Exécuté** (GNAT 16.2, x86-64, Compiler Explorer — 38 programmes, sorties `*.out`) : chaque erreur classique
de la consigne (`:=` dans un `if`, plages, mélange Integer / Float, `Integer (2.5)` = 3, `case` incomplet sur
énuméré et sur Integer, `break`, indice de `for` et de `for reverse`, paramètre `in`, appel de fonction en
instruction, nommé puis positionnel, `P->Age`, index hors bornes avec `1 .. 4`, champ d'un type `private`,
`with` absent, exception non rattrapée, contrats avec et sans `-gnata`, tâches et objet protégé
(4 × 1 000 = 4 000), rendez-vous, `<` sur un formel `private`, générique non instancié, `overriding` mal tapé,
dispatching `Animal` / `Animal'Class`, `"Lyon"` dans `String (1 .. 5)`, `Get_Line` après la fin, `Float'Val`,
les sous-types fautifs du bilan, `type … is 0 .. 100`) ; le code des leçons 05 (records), 08 (`Demo`),
14 (`Inventaire` : 15,0 + 16,0 = 31,0).

**Non exécuté** : SPARK et GNATprove (AoRTE, `Loop_Invariant`, niveaux), Alire (`alr`), GNAT Studio, le
profil Ravenscar (cité dans un « Cas réel », non touché) — vérifiés par la documentation seulement.

## Les leçons de ce cours

- **Le cours le plus contraint par le lexique** : beaucoup de bonnes réponses portent des mots absents
  de leur page (`k` jusqu'à 9 sur `lecon-07` q3, 5 sur `lecon-06` q2), avec `w` jusqu'à 13. La règle
  `k / k / k / k` + `w` égal oblige à écrire chaque distracteur avec un nombre exact de mots longs
  absents ; le moyen le plus sûr a été de **reprendre les mots étrangers de la bonne réponse** (« erreur
  de compilation », « l'exhaustivité », « vérifications strictes », « n'ajoute qu'une »).
- **Fermer la longueur a ouvert la densité, puis fermer le mot exclusif a retourné son inverse** : à la
  fin de la vague, « la plus dense » valait 46,4 % ; au premier dosage du mot exclusif, l'indice est passé
  à 24,3 % mais `mesure-biais-inverse` a alerté (écarter le distracteur désigné rendait 29,4 %). Viser
  l'égalité, pas la bascule.
- **Un mot de remplissage devient un mot fétiche** : « chaque », posé pour tenir le `w`, a fini sur 23
  distracteurs contre 2 bonnes réponses (ECARTER 28,4 %). Ramené sous le seuil en le retirant là où deux
  distracteurs le portaient.
- **Une retouche de corps rouvre le lexique** : changer « Rejeté » en « Refusé » dans un commentaire de
  `lecon-02` a fait sortir « rejeté » de la page et monté le `k` d'un distracteur de `lecon-02` q3 ;
  `controle.js` l'a vu, l'option a été retouchée (« sera refusé partout »).
- **Les toutes petites questions du bilan** (`:=`, `Put_Line`, `package`) ne tiennent la longueur
  qu'avec des ex æquo, et les ex æquo font monter « écarter les deux extrêmes » (27,6 % avant les trois
  dernières retouches).

## Ce qui reste, sans arrondir

- Pire stratégie à **26,9 %** (la moins bavarde), la plus basse à **20,2 %** (ECARTER le mot technique
  exclusif, couverture 14,3 %) ; « la plus longue » à 26,5 % (13 bonnes réponses au rang 0 sur 49, cible
  exacte du plan).
- `mesure-biais-inverse` : 0 alerte, mais le mot technique exclusif est à **27,5 %** dans le sens inverse,
  juste sous le seuil de 28 %.
- `mesure-mot-fetiche` : « chaque » à 27,6 % en ECARTER (seuil 28 %).
- Quelques distracteurs courts du bilan restent hors de la fenêtre 70-130 % de longueur (bonne réponse de
  2, 8 ou 40 caractères) ; deux options du bilan q3 sont celles d'origine.
- **Signalés, non corrigés (non prouvés faux)** : `lecon-09` attribue à Ada les « commandes de vol d'Airbus
  et de Boeing » (Boeing 777 : oui ; Airbus : non vérifié) et dit DO-178C « le plus haut standard » ;
  `lecon-01` q3, le distracteur « le calcul scientifique et la gestion » s'appuie sur le « Cas réel » de la
  leçon (le DoD visait les systèmes d'armes, « non du calcul scientifique ou de gestion ») — un relecteur
  pourrait le juger discutable ; `lecon-08` dit qu'une tâche démarre « dès l'entrée dans Demo » (elle est
  activée après l'élaboration des déclarations, juste avant le `begin`) ; la récapitulation de `lecon-04`
  (« le compilateur fait respecter les modes ») reste générale.
- Les messages de commit `8f16267` (« 9 phrases de corps ») et `99b475b` (« 27 options ») arrondissent :
  les comptes justes sont **12 passages de corps** (dont une ligne de code) + 1 explain, et **24 options**
  au dosage.

## Vérifications finales

- `node tools/verif-html.js` : aucun problème ; tous les blocs JSON reparsent (`controle.js` : 0 bloc
  cassé) ; 0 CR, 0 BOM dans les 15 fichiers du cours.
- `node tools/verif-contenu.js` : code 0, 1 551 « Cas réel » conformes.
- `node tools/verif-donnees.js` : I18 en erreur (index périmés : attendu, l'orchestrateur régénère) ;
  avertissements I17, I19, I25 (anciens, déjà relevés au V16).
- `node tools/verif.js --rapide` : voir ci-dessous.
