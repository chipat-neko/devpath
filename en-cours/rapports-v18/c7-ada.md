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
- `node tools/verif.js --rapide` (1 424 s, machine partagée avec les autres agents) : 54 étapes jouées,
  **4 signalées, toutes attendues** : `donnees` (I18, index périmés), `qcmbiai` et `qcmlexi` (« ada a
  PROGRESSÉ, longueur 96,6 % → 26,5 %, sans que le gain soit figé » : référence à refiger par
  l'orchestrateur), `normatf` (8 chiffres du site cités par `doc/lecon-0*` : taux et nombre de questions
  conformes à S3 — 805 manquements, 86,8 %… —, S4 69 / 89 cours, corpus de l'ancienne clause ; ils bougent
  parce que les QCM d'`ada` ont changé). Aucune autre étape en échec. `--mutations` non lancé.

## Reprise (après la contre-relecture `e138d31`)

La contre-relecture indépendante (23 corrections justes, commit `e138d31`) avait rouvert le lexique sur
10 questions, monté « la plus dense » à 31,1 % et « la moins bavarde » à 29,1 %, et laissé au bilan q0
(`lecon-14` q4, « Pour quel type de systèmes Ada est-il privilégié ? ») trois distracteurs du même champ
(inventaire, vente, stock). La mesure de départ de la reprise a trouvé en plus **deux alertes du biais
inverse** et **deux fenêtres de `--lots`** au-dessus du seuil, rouvertes elles aussi. Mission bornée :
remettre ces indices au hasard sans défaire le sens d'une seule correction.

Commit : `ef4c1cb` (les retouches), puis celui de cette section. ⚠ Le message de `ef4c1cb` dit « 22 options
sur 11 questions » : le compte juste est **17 options sur 11 questions** (détail ci-dessous).

### Avant / après

| indice | avant (`e138d31`) | après (`ef4c1cb`) | commande |
|---|---:|---:|---|
| lexique : exploitables / retournées / à mettre en forme | **10 / 6 / 10** | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=ada` |
| la plus dense (mots longs) | **31,1 %** | **25,0 %** | `node tools/mesure-biais-qcm.js --seul=ada` |
| la moins bavarde (peu de mots) | **29,1 %** | **26,0 %** | idem |
| la plus longue | 26,5 % | 25,2 % | idem |
| pire des 44 stratégies | la plus dense 31,1 % | le mot technique exclusif **26,5 %** | idem |
| stratégie la plus basse | ECARTER le mot technique exclusif 19,4 % | la même, 20,1 % | idem |
| ECARTER la plus dense / ECARTER la moins bavarde | 23,0 % / 20,6 % | 25,0 % / 22,3 % | idem |
| ECARTER la plus courte | 26,5 % (une question à 100 % : bilan q1) | 25,2 % | idem |
| questions trahies par 5 indices ou plus | 0 | 0 | idem |
| rangs de la bonne réponse | 13 / 12 / 12 / 12 | 13 / 12 / 12 / 12 | `node tools/plan-rangs-qcm.js ada` |
| biais inverse | **2 alertes** : le mot technique exclusif (17 tranchées, inverse 29,4 %), son ECARTER (9 tranchées, 33,3 %) | **0 alerte** (pire : le mot technique exclusif, inverse 27,1 %) | `node tools/mesure-biais-inverse.js --toutes ada` |
| `--lots` (fenêtres de 4 leçons) | **2** : la plus dense en 11-14 (19 q, 43,4 % / 42,1 % seule bonne) et en 5-8 (12 q, 41,7 %) | **0** | `node tools/mesure-biais-qcm.js --lots --cours=ada` |
| mot fétiche | 0 alerte | 0 alerte | `node tools/mesure-mot-fetiche.js ada` |
| tics de lot | 0 | 0 | `node tools/mesure-tics-lot.js ada --exemples` |
| intrus lexical DÉFAUT / EXCÈS | 25,0 % / 24,1 %, 0 sûre | 25,0 % / 24,1 %, 0 sûre | `node tools/mesure-mot-question.js ada --liste` |
| explications orphelines | 0 | 0 | `node tools/mesure-explain-orpheline.js --depuis=8d163bf --seul=ada` |
| intouchable | 1 atteinte (`lecon-11` q2, explain, déclarée en tête) | la même, aucune nouvelle | `node tools/mesure-qcm-intouchable.js ada 8d163bf` |
| `verif-html` / `verif-contenu --cas-reel --cours=ada` | — | 0 / 0 (14 « Cas réel » conformes) | `node tools/verif-html.js`, `node tools/verif-contenu.js --cas-reel --cours=ada` |
| blocs JSON, CR, BOM | — | tous valides, 0 CR, 0 BOM | contrôle node sur les 15 fichiers |

`verif-qcm-biais` et `verif-qcm-lexique` sortent en code 1 pour la seule raison attendue (« ada a
PROGRESSÉ […] sans que le gain soit figé »). Sorties brutes : `scratchpad/c7-ada/reprise/avant/` et
`scratchpad/c7-ada/reprise/apres1/` (hors git).

### Le dosage, calculé avant d'écrire

- **La plus dense** : 15,25 questions sur 49 (31,1 %) ; cible 12,25 → **trois bascules**, choisies pour
  vider aussi les deux fenêtres de `--lots` : une dans 5-8 (`lecon-08` q2), une dans 11-14 (`lecon-14`
  q5), une ailleurs (`lecon-03` q1). Fenêtre 5-8 : 5 → 4 bonnes désignées seules sur 12 ; 11-14 : 8 → 7
  sur 19 (36,8 %, sous 40 %). Résultat 12,25 / 49 = 25,0 %, et « ECARTER la plus dense » remonte de
  23,0 à 25,0 %.
- **La moins bavarde** : 14,25 (29,1 %) ; il fallait retirer au moins 0,78 → `lecon-14` q4 et q5 (un
  distracteur seul au minimum de mots : −0,5 chacune), `lecon-03` q1 (ex æquo avec la bonne : −0,5) :
  12,75 / 49 = 26,0 %.
- **Le mot technique exclusif, sens inverse** : inverse = (T − B) / 3T, avec T les questions où un seul
  mot exclusif tranche et B celles où c'est la bonne. Avant : T = 17, B = 2 → 29,4 %. Visé : B = 3 avec
  T ≤ 17 (bilan q1 devient B, `lecon-08` q2 et `lecon-14` q1 sortent de T) → T = 16, B = 3 → 27,1 %.
  Le sens direct est monté de 24,5 à 26,5 % : la variante qui donnait aussi B = 4 au bilan q0 le
  portait à 27,6 %, au-dessus de la cible — écartée, le bilan q0 garde un ex æquo à 1/2 comme avant.
- **ECARTER le mot technique exclusif** : 9 questions au motif « trois options en tête, la quatrième
  seule en dessous », toujours un distracteur → 6 (`lecon-01` q3, `lecon-12` q2 et le bilan q1 sortis
  du motif) : sous les 8 questions qu'il faut pour mesurer, plus d'alerte.

### Les retouches (17 options, 11 questions, aucune bonne réponse ni explication touchée)

| question | option | avant → après | pourquoi |
|---|---|---|---|
| `lecon-01` q1 | opt3 | « reprendre **ses logiciels** » → « reprendre **sa bibliothèque** » | k 3 → 2 (« logiciels » absent de la page, « bibliothèque » présent) |
| `lecon-01` q3 | opt1 | « (… les blogs, la radio et la photo en ligne) » → « (… la musique en studio, ou la commande sur catalogue) » | w 0 → 4, k 0 → 1 ; sort du motif ECARTER |
| `lecon-01` q3 | opt3 | « Le tableur et le web (… toute application du navigateur) » → « Le tableur et le navigateur (… tout logiciel installé) » | w 3 → 4, reste plus courte que la bonne |
| `lecon-03` q1 | opt1 | « ce qui **évite** les contrôles » → « ce qui **supprime** les contrôles » | w 10 → 11 (mot de la page) |
| `lecon-03` q1 | opt2 | « **est le fait du** type énuméré […] sauf sur **un entier** » → « **tient au** type énuméré […] sauf sur **les entiers** » | 33 → 31 mots, plus dense que la bonne (5,10 contre 5,06), reste plus longue qu'elle (194 contre 193) |
| `lecon-05` q1 | opt3 | « de la borne inférieure **à** la supérieure » → « **jusqu'à** la supérieure » | w 5 → 6 |
| `lecon-07` q1 | opt2 | « À relancer le bloc entier […] le même traitement **tour après tour** jusqu'au succès » → « À relancer **automatiquement** le bloc entier […] le même traitement jusqu'au succès » | w 9 → 10, pas de « seconde fois » (sens de la contre-relecture gardé) |
| `lecon-08` q2 | opt2 | « partagée entre tâches […] après **sa déclaration** » → « partagée entre **plusieurs** tâches […] après **son initialisation** » | k 3 → 4, w 9 → 10, plus dense que la bonne (bascule) ; ex æquo du mot exclusif avec opt3 |
| `lecon-12` q2 | opt3 | « Wide_String, dont la longueur est **extensible** et la mémoire **doublée en Unicode** » → « … est **variable** et la mémoire **adaptée à l'Unicode** » | k 2 → 0 (« doublée », « unicode » absents de la page ; « l'Unicode » y est) ; sort du motif ECARTER |
| `lecon-12` q3 | opt3 | « Fermer (Close) **d'abord** » → « Fermer (Close) **au début** » | k 1 → 0 |
| `lecon-14` q1 | opt1 | « lors de chaque lancement du **programme** » → « … du **logiciel** » | un mot exclusif de moins (ex æquo avec opt2, T − 1) ; l'écho de la question ne désigne plus ce distracteur |
| bilan q0 (`lecon-14` q4) | opt1 | « Les systèmes utilitaires d'inventaire (comptabilité) » → « Les systèmes de données numériques (statistiques) » | domaine : données et statistiques |
| bilan q0 | opt2 | « Les systèmes de vente des produits (performance) » → « Les systèmes web et l'interface des utilisateurs (réactivité) » | domaine : web et interfaces ; ex æquo du mot exclusif avec la bonne |
| bilan q0 | opt3 | « Les systèmes de saisie de stock (simplicité) » → « Les systèmes ludiques numériques (affichage) » | domaine : jeux ; seul au minimum de mots (−0,5 « moins bavarde ») |
| bilan q1 (`lecon-14` q5) | opt1 | « Faiblement et librement typé » → « Faiblement typé et laxiste » | typage faible ; k et w = 2 |
| bilan q1 | opt2 | « Typé à l'exécution seulement » → « Typé dynamiquement uniquement » | typage dynamique ; plus dense que la bonne, seule à 3 mots |
| bilan q1 | opt3 | « Sans type, tout est du texte » → « Sans type, uniquement textuel » | sans type ; la bonne devient seule porteuse d'un mot exclusif (B + 1) |

**Le bilan q0** a maintenant trois domaines distincts — données et statistiques, web et interfaces
utilisateur, jeux — tous faux pour Ada (privilégié pour les systèmes critiques et embarqués) et tous
plausibles pour un apprenant ; aucun ne contient « commande », que la contre-relecture avait trouvé
lisible vrai (« systèmes de commande »). Chaque distracteur porte, comme la bonne réponse, 4 mots longs
dont 1 absent de la page.

**Le sens des corrections de la contre-relecture est gardé** : bilan q1, trois thèses distinctes (faible,
dynamique, sans type) et non trois synonymes ; `lecon-12` q2, Wide_String reste faux par sa longueur, et
la partie vraie porte toujours sur l'Unicode (« adaptée à l'Unicode » au lieu de « doublée en Unicode »,
même idée, mots de la page) ; `lecon-12` q3, Close sans Reset ; `lecon-07` q1, pas de « seconde fois » ;
`lecon-14` q1, l'exécution accélérée à chaque lancement ; `lecon-01` q3, aucun doublon avec opt2 (calcul
scientifique, gestion).

### Exécuté pour la relecture des options retouchées

GNAT 16.2 par Compiler Explorer, `-gnat2022`, fichiers dans `scratchpad/c7-ada/reprise/preuves/` :
- `r1-wide.adb` : `W : Wide_String := "abc"; W := "abcd";` → avertissement « wrong length for array » puis
  **Constraint_Error** à l'exécution ; `Wide_Character'Size = 16` ; un `Unbounded_Wide_String` passe de 3
  à 6 caractères. Donc `lecon-12` q2 opt3 est bien fausse (longueur fixe) et sa partie Unicode est vraie.
- `r2-case-int.adb` : un `case` sur `Integer` sans `when others` → « error: missing case values:
  -16#8000_0000# .. 0 » et « 3 .. 16#7FFF_FFFF# ». Donc `lecon-03` q1 opt2 (« sauf sur les entiers »)
  est bien fausse.
- `r3-handler.adb` : une division par zéro dans un bloc, gestionnaire `when Constraint_Error` → « le bloc
  a tourné 1 fois » : le gestionnaire ne relance rien (`lecon-07` q1 opt2 fausse).
- Bilan q1 (typage dynamique faux) : déjà prouvé par l'auteur, `preuves/e03-melange` (Integer + Float
  refusé à la compilation).

Non exécutable : les thèses de domaine (bilan q0, `lecon-01` q3) ; relues contre l'encadré « Cas réel » de
`lecon-01`, qu'elles ne contredisent pas.

### Ce qui reste, sans arrondir

- Pire stratégie à **26,5 %** (le mot technique exclusif, sens direct ; il était à 24,5 %) ; dans le sens
  inverse, **27,1 %**, sous le seuil de 28 % mais sans grande marge. « La moins bavarde » à 26,0 %.
- Sous le hasard : ECARTER le mot technique exclusif **20,1 %** (couverture 12,2 %), ECARTER la moins
  bavarde 22,3 % — hors d'alerte (fenêtres trop courtes pour `mesure-biais-inverse`).
- Le tic « verbe conjugué » a changé de question : il désignait un distracteur du bilan q1 (seul à porter
  « est »), il désigne maintenant un distracteur de `lecon-03` q1 (seul sans « est ») ; toujours une seule
  question, sous le seuil de `mesure-tics-lot`.
- Bilan q1 : trois options de 29 caractères (la bonne et deux distracteurs) — « la plus longue » y vaut
  1/3 ; la bonne ne peut pas être raccourcie.
- Choix de mots discutables, signalés : « la commande sur catalogue » (`lecon-01` q3, la vente par
  correspondance ; « commande » seul aurait pu se lire « systèmes de commande ») ; « longueur variable »
  pour Wide_String (`lecon-12` q2) à la place d'« extensible », pour sortir du motif ECARTER.
