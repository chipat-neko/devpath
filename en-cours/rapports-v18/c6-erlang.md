# C6 — erlang, 88,9 % → 24,1 %

Case C6 de la phase C du chantier V18 : les QCM du cours `erlang` (14 leçons, **54 questions** dont
12 de bilan, **162 distracteurs**). Agent seul, copie `D:\test-claude-c6-erlang`, branche
`v18/c6-erlang`, partie de `8d163bf`. Consigne du cours : `scratchpad/CONSIGNE-ERLANG.md`.

## ⚠️ À lire d'abord

1. **Un fichier écrit par erreur dans le dépôt principal** : `D:\test-claude\erl_crash.dump`
   (851 164 octets, 2026-11-19 12:58). Un premier lancement d'`erl.exe` pendant la décompression
   d'OTP, sans `cd`, a planté au démarrage (`load_failed`) et a écrit son vidage dans le dossier
   courant, qui était `D:\test-claude`. Non corrigé, comme le veut la consigne. Il n'est pas suivi
   par git ; il peut être supprimé sans risque. Ensuite, tout a été lancé par
   `D:\outils-c\erlang\preuves\lance.sh`, qui se place dans le dossier de preuves et y redirige
   `ERL_CRASH_DUMP`.
2. **Une bonne réponse et une explication corrigées** (atteintes à l'intouchable, prouvées par
   exécution) — `mesure-qcm-intouchable.js erlang 8d163bf` en compte exactement **2** :
   - `lecon-13` q3, **bonne réponse** : « laisse l'outil générer **des centaines** d'entrées » →
     « **une centaine** d'entrées ». PropEr 1.5.0 (archive officielle de hex.pm, compilée hors
     dépôt) répond « OK: Passed 100 test(s). » et la propriété est évaluée **100 fois** ; dans
     `src/proper.erl`, `numtests = 100`. Même faute, même preuve, que FsCheck au cours `fsharp`.
   - `lecon-14` q15, **explication** : « PropEr génère des centaines de cas » → « PropEr génère
     100 cas par défaut pour tenter de réfuter une propriété ».

## Avant / après

| indice | commande | avant (`8d163bf`) | après |
|---|---|---:|---:|
| la plus longue | `mesure-biais-qcm.js --seul=erlang` | **88,9 %** | **24,1 %** |
| pire des 44 stratégies | id. | 88,9 % (la plus longue) | **27,0 %** (la plus dense) |
| la plus détaillée | id. | 72,2 % | 25,0 % |
| l'incise / RESTREINDRE à la parenthèse | id. | 68,2 % / 68,2 % | 25,0 % / 25,0 % |
| le mot technique exclusif | id. | 63,0 % | 25,5 % |
| ponctuation forte (seule / restreindre) | id. | 52,8 % / 52,8 % | 25,0 % / 25,0 % |
| l'écho de la question | id. | 46,6 % | 25,0 % |
| ECARTER la moins bavarde | id. | 43,7 % | 23,8 % |
| la moins bavarde / la plus dense | id. | 1,1 % / 24,1 % | 26,2 % / 27,0 % |
| écarter les deux extrêmes | id. | 4,6 % | 26,9 % |
| questions trahies par 5 indices ou plus | id. | 39 sur 54 (72,2 %) | **0** |
| rangs de longueur (0 = la plus longue) | `plan-rangs-qcm.js erlang` | 49 / 2 / 3 / 0 | **13 / 14 / 13 / 14** |
| lexique : exploitables / retournées / à mettre en forme | `mesure-lexique-qcm.js --liste=erlang` | 43 / 22 / 48 | **0 / 0 / 0** |
| mot fétiche (alertes) | `mesure-mot-fetiche.js erlang` | 2 (`processus`, `messages`) | **0** |
| tics de lot | `mesure-tics-lot.js erlang` | 13 | **0** |
| biais inverse (alertes) | `mesure-biais-inverse.js --toutes erlang` | 5 | **0** (pire 25,2 %) |
| intrus lexical DÉFAUT (direct / inverse / sûres) | `mesure-mot-question.js erlang --liste` | 26,9 / 24,4 % / 2 | **25,0 / 25,0 % / 0** |
| intrus lexical EXCÈS (direct / inverse / sûres) | id. | 30,7 / 19,9 % / 3 | **25,0 / 25,0 % / 0** |
| explications orphelines | `mesure-explain-orpheline.js --depuis=8d163bf --seul=erlang` | — | **0** (5 cas indicatifs, relus : cohérents) |

Les cliquets `verif-qcm-biais.js` et `verif-qcm-lexique.js` disent ce qui est attendu : « le cours a
PROGRESSÉ sans que le gain soit figé » (longueur 88,9 → 24,1 %, lexique STRICTE 11,8 → 0,0 %). Non
refigés : c'est à l'orchestrateur de le faire, à la fusion.

## Ce qui a été écrit

- **161 distracteurs réécrits sur 162** ; un gardé : `lecon-12` q2, « X = <<255>> et Reste =
  [10,20,30] » (déjà dans la bonne longueur, et faux de deux façons).
- **11 664 caractères écrits** : distracteur moyen 24,2 → 96,2 caractères, pour une bonne réponse
  moyenne de 95,3.
- Méthode : chaque distracteur prend le **gabarit** de sa bonne réponse (même ponctuation, même
  nombre d'incises, mêmes tics de forme, même écho), énonce une erreur réelle de débutant, et tient
  la fenêtre 70-130 % au rang visé ; `atelier.js` (banc d'écriture, stratégies chargées depuis
  `mesure-biais-qcm.js`, `w`/`k`, tics et intrus copiés des outils) jusqu'à « 0 alerte », puis
  pose, mesure avec les VRAIS outils, commit. Une exception à la fenêtre : `lecon-11` q1,
  « {point, x=1, y=2} » à 131 %.
- **Cinq phrases de corps ajoutées**, chacune vraie, pour que la page porte les mots de sa bonne
  réponse (règle du `k`) : `lecon-01` (`c(bonjour)` compile en bytecode dans `bonjour.beam`, que la
  BEAM charge puis exécute — rejoué : `{ok,bonjour}`, fichier présent) ; `lecon-03` (`=<`, « et non
  `<=` comme dans beaucoup de langages ») ; `lecon-08` (on envoie un message de la même façon, local
  ou distant) ; `lecon-11` (« jamais sur un simple doute ») ; `lecon-14` (les fonctions d'API cachent
  le protocole interne). Aucun encadré « Cas réel » touché (`verif-contenu` : 1 551 conformes).
- **Dosage calculé** (commit `d3547dd`) : après la vague, « la plus dense » était à 41,8 % et « la
  moins bavarde » à 40,6 % — la bonne réponse, intouchable, porte les mots techniques longs, et
  mes distracteurs avaient plus de petits mots. Sonde `densite2.js` (crédit de la bonne réponse
  question par question) : 24 distracteurs retouchés pour qu'un distracteur soit plus dense, ou
  moins bavard, que la bonne réponse, à longueur et rang tenus ; plus trois ex æquo de longueur
  cassés pour « écarter les deux extrêmes ». Résultat 27,0 / 26,2 / 26,9 %.

## Les fautes de fond (toutes rejouées sous Erlang/OTP 29.1.2)

Archive officielle `otp_win64_29.1.2.zip` décompressée dans `D:\outils-c\erlang\otp\` (ERTS
17.1.1) ; preuves dans `D:\outils-c\erlang\preuves\` (`p01.erl`, `p06.erl`, `p07.erl`, `p08.erl`,
`p11.erl`, `p13.erl`, `maths.erl`, `geo.erl`, `geo2.erl`, `corps.erl`, `l14/`, `modules/`).

| où | ce qui était écrit | ce que rend l'exécution | correction |
|---|---|---|---|
| `lecon-13` q3 (bonne réponse), corps (2 paragraphes, légende, schéma et son aria-label, exercice 3, description de la page), `lecon-14` q15 (explain) | PropEr génère « des centaines » de cas | PropEr 1.5.0 : « OK: Passed 100 test(s). », 100 évaluations ; `numtests = 100` | « une centaine », « 100 par défaut », l'option `{numtests, N}` citée |
| `lecon-04`, corps et solution de l'exercice 3 | un processus pèse « quelques centaines d'octets » | `erlang:process_info(P, memory)` → **2624** octets (mots de 8 octets) | « environ 2,6 Ko au démarrage, sur une machine 64 bits » ; la pile d'un thread système : « souvent de l'ordre du méga-octet » (documentation, non exécuté) |
| `lecon-11`, bloc Dialyzer | « geo.erl:8: Function surface/2 will never return since it differs in argument position 1 from the success typing » (recopié de mémoire) | `dialyzer --plt base.plt geo.beam` : « Function appel/0 has no local return » et « The call geo:surface("x", 3) will never return since the success typing is (number(), number()) -> number() and the contract is (number(), number()) -> number() » | sortie réelle, lignes regroupées ; la solution de l'exercice 3 cite « will never return » (rejoué aussi avec `surface("10", 3)`, et `badarith` à l'exécution) |
| `lecon-10`, exercice 2 | `ets:update_counter(visites, "/accueil", {2, 1})` « à chaque visite » | sur une clé absente : `badarg` (cause `badkey`) — la première visite plante | `update_counter/4` avec `{"/accueil", 0}` : rend 1 puis 2 |
| `lecon-05`, exercice interactif 2 | n'accepte que « loop » ; la leçon nomme la fonction `boucle` | — | « boucle » accepté, indices refaits |
| `lecon-14`, exercices 1 et 2 | lien « Revoir » vers la leçon 05 | `spawn` et `!` sont enseignés en leçon 04 | liens vers `lecon-04.html` |
| 5 distracteurs (relecture) | `lecon-10` q1 « copiées dans le tas de plusieurs processus » : **vrai par accident** (chaque `ets:lookup` recopie le tuple dans le tas du lecteur, la leçon le dit) ; `lecon-05` q2 « sans adresse » contredisait `{self(), Requête}` dans la même option | — | réécrits (commit `5b1ede2`) |

**Rejoué et conforme** (aucune correction) : toutes les autres bonnes réponses qu'on peut exécuter
(`dire/0` et `undef`, `{badmatch,2}`, `[T|Q]`, ordre des clauses, `=<`, récursion terminale sous
plafond de tas — 100 000 mots : la version non terminale est tuée, la terminale rend 1 000 000 —,
PID de `spawn`, `!`, processus sans rappel qui meurt, `register` et `badarg` sur une chaîne, `link`
dans les deux sens, `monitor` et `'DOWN'`, `call` 513 ms contre `cast` 0 ms, les trois stratégies
de redémarrage, l'état perdu au redémarrage, la mise à jour à chaud (le message suivant répond
encore `v1`, puis `v2` après l'appel qualifié), `ets:lookup` → `[]`, table détruite avec son
propriétaire et `'ETS-TRANSFER'` avec `heir`, records → tuples, bit syntax, `<<"ok">>` contre
`[111,107]`, EUnit (`*_test()` seulement, `?assertError`, `?assertThrow` existe)) ; tous les
modules des leçons compilent (`bonjour`, `salut`, `echo`, `compteur`, `compteur_serv`, `maths`, les
quatre modules de l'inventaire) ; le projet inventaire tourne (31.00 ; test EUnit vert ; relance
par le superviseur, total 0 après) ; les extraits du corps des leçons 02, 03, 05 et 12 rendent ce
que leurs commentaires annoncent (`corps.erl`).

**Non exécuté** (documentation seulement) : la distribution entre nœuds (`net_adm:ping`, envoi
distant), rebar3, Elixir et mix, le « zéro faux positif » de Dialyzer, la taille par défaut de la
pile d'un thread système, QuickCheck (Quviq).

## Signalé, pas touché

- `lecon-01` q1 : la bonne réponse donne « la distribution » comme troisième objectif ; le corps de
  la leçon dit « la disponibilité continue ». Défendable (Erlang vise aussi la distribution), donc
  laissée ; aucun distracteur ne dit « disponibilité continue ».
- `lecon-14` q7 (bilan) : « Une majuscule (X, Nom) » ; une variable peut aussi commencer par `_`.
  Simplification ; aucun distracteur ne propose le souligné.
- `lecon-14`, solution de l'exercice 3 : « la brique que généralise un gen_server, en y ajoutant la
  gestion d'état et la supervision (one_for_one, one_for_all) » — la supervision n'est pas le fait
  du `gen_server` mais du `supervisor`. Imprécision de corps, non corrigée (hors QCM, non prouvée
  par exécution).
- `catch Expr` est **déprécié** depuis OTP 29 (le compilateur l'avertit) ; le cours ne l'emploie
  pas, rien à faire, mais à savoir pour les cours voisins.
- Le test EUnit de `lecon-14` démarre le serveur avec `start_link` et ne l'arrête pas : relancé
  dans la même VM, il échoue sur `already_started`. Conforme à ce qu'il annonce (un passage), non
  corrigé.

## Les leçons de ce cours

- **Le `k` était le vrai travail.** 36 bonnes réponses sur 54 avaient des mots absents de leur page
  (jusqu'à 6) : chaque distracteur doit en porter autant, et le même nombre de mots longs. Deux
  leviers : reprendre dans les distracteurs les mots étrangers de la bonne réponse, ou — cinq fois —
  faire entrer ces mots dans le corps, par une phrase vraie qui manquait.
- **Fermer la longueur fabrique la densité** (41,8 % et 40,6 % après la vague), comme au cours
  `tests` : la bonne réponse, intouchable, porte les termes techniques. Le dosage s'est calculé
  question par question ; le levier le plus sûr a été de **retirer des petits mots** d'un
  distracteur (articles d'une énumération, « de bas en haut », « à des » → « aux ») en gardant
  longueur et rang.
- **Le dosage a rouvert un tic** : remplacer « à un PID » par « au PID » pour casser un ex æquo a
  laissé la bonne réponse seule à porter « à un » (tic de lot à 28,7 %), vu par `mesure-tics-lot`
  et refermé dans le même lot.
- **Un distracteur peut devenir vrai par la leçon elle-même** : « copiées dans le tas de plusieurs
  processus » décrit ce que fait chaque `ets:lookup` ; seule une relecture contre le corps l'a vu.
- **Un message d'erreur recopié de mémoire** (Dialyzer) et **un ordre de grandeur faux** (la
  mémoire d'un processus) : comme au V16, seuls l'exécution et la relecture du corps les ont vus.

## Ce qui reste, sans arrondir

- Pire stratégie à **27,0 %** (« la plus dense »), puis « écarter les deux extrêmes » 26,9 %,
  « la moins bavarde » 26,2 %, la DEUXIÈME et la QUATRIÈME plus longue 25,9 %.
- Rangs **13 / 14 / 13 / 14** pour une cible 14 / 14 / 13 / 13 (un rang 0 de moins, un rang 3 de
  plus).
- `lecon-11` q1 : un distracteur à 131 % de la bonne réponse (« {point, x=1, y=2} »).
- Pas de contre-relecture **indépendante** : relecture et contre-relecture faites par l'agent
  lui-même (voir ci-dessous) ; l'orchestrateur prévoit la sienne.
- Index dérivés (`quiz-index.js`, `search-index.js`…) et références des cliquets : non régénérés,
  comme le veut la règle de fusion.

## Contre-relecture de mes propres corrections

Relu une à une après coup : les 6 corrections de fond, les 5 phrases de corps, les 24 retouches du
dosage, les 5 corrections de relecture. Une reprise : le bloc Dialyzer présentait la sortie comme
brute alors que les lignes étaient regroupées — « (lignes regroupées) » ajouté. Le reste tient ;
deux distracteurs restent un peu raides en français et ont été gardés faute de mieux sous les
contraintes (`lecon-02` q1 « les variables Erlang sont un compteur entier », `lecon-03` q2 « l'ordre
des caractères fondu en un signe »).

## Commits

`feb2e92` fautes de fond · `c7ebf74` consigne · `824efc9` lot 1 (01-05) · `b9cc545` lot 2 (06-08)
· `ccf693f` lot 3 (09-13) · `18f1757` lot 4 (14) · `d3547dd` dosage · `5b1ede2` relecture · et le
commit de clôture (ce rapport, contre-relecture).

## Vérifications finales

`verif-html` 0 problème ; 29 blocs JSON (quiz, bilan, exos) valides ; 0 BOM, 0 CR ;
`verif-contenu` code 0 (1 551 « Cas réel » conformes) ; `verif-donnees` : seule l'erreur attendue
I18 (index périmés) et 3 avertissements anciens (I17, I19, I25).

`node tools/verif.js --rapide` (1 575 s ; 54 étapes jouées sur 83) : 7 étapes signalent, code 1.

- Attendues : `qcmbiai` et `qcmlexi` (erlang a progressé sans que le gain soit figé : la plus
  longue 88,9 → 24,1 %, STRICTE 11,8 → 0,0 % ; cliquets non refigés, comme la consigne le
  demande), `donnees` (seule l'erreur I18), `normatf` (8 contrôles de la page `doc`, hors erlang).
- Causées par cette branche, sur une page dérivée que je n'ai pas le droit de toucher : `etudes` et
  `etude-6`. `pages/etude-inconnu.html` publie « 6560,6 Ko » de code ; la mesure du jour rend
  6560,9 Ko. L'écart (+277 octets de code, 13 177 blocs inchangés) vient de mes deux corrections
  de blocs de code : la solution de l'exercice 2 de lecon-10 (+66 octets, `update_counter/4`) et la
  sortie réelle de Dialyzer en lecon-11 (+211 octets). À régénérer par l'assembleur de l'étude
  après la fusion.
- Instable : `vexec` (`pages/execution.html` n'a pas chargé ses scripts pendant la chaîne, sous la
  charge) ; rejoué seul (`node tools/verif-execution.js`) : 0 problème, code 0.

Étapes que ce mode ne joue pas et que mes changements touchent, jouées à part :
`node tools/preuves/exos-texte.js` sur les six leçons dont un exercice a changé (lecon-04, 05, 10,
11, 13, 14) : 16 réponses publiées tapées, 16 acceptées ; avec `--contre` : 16 réponses fausses,
16 refusées. `node tools/mesure-explain-orpheline.js --depuis=master --seul=erlang` : aucune
explication orpheline (53 explains intouchées mesurées).

## Reprise (après la contre-relecture indépendante, commit `f5ea6c0`)

La contre-relecture indépendante (`d3ff7fc`) a corrigé 13 distracteurs ; ces corrections justes
avaient rouvert le lexique sur 8 questions, porté « la plus dense » à 29,8 %, « la DEUXIÈME plus
longue » à 29,6 %, « la moins bavarde » à 28,1 %, et laissé trois ex æquo de longueur avec la bonne
réponse. Reprise bornée à ce dosage : **17 distracteurs retouchés sur 16 questions**, aucune bonne
réponse ni explication touchée, aucun corps de leçon touché.

### Avant / après (avant = `d3ff7fc`, après = `f5ea6c0`)

| indice | commande | avant | après |
|---|---|---:|---:|
| la plus longue | `mesure-biais-qcm.js --seul=erlang` | 23,1 % | **24,1 %** |
| la DEUXIÈME / TROISIÈME / QUATRIÈME plus longue | id. | **29,6** / 22,2 / 25,0 % | 25,9 / 24,1 / 25,9 % |
| la plus dense (mots longs) | id. | **29,8 %** | **25,2 %** |
| la moins bavarde (peu de mots) | id. | **28,1 %** | **25,3 %** |
| écarter les deux extrêmes | id. | 26,9 % | 25,9 % |
| ECARTER la plus dense / la moins bavarde | id. | 23,6 / 22,5 % | 25,5 / 23,5 % |
| **pire des 44 stratégies** | id. | **29,8 %** (la plus dense) | **25,9 %** (DEUXIÈME, QUATRIÈME, écarter les deux extrêmes) |
| questions trahies par 5 indices ou plus | id. | 0 | 0 |
| crédits par rang (0 = la plus longue) | sonde `reprise/bilan.js` | 12,5 / 16 / 12 / 13,5 | **13 / 14 / 13 / 14** |
| rangs | `plan-rangs-qcm.js erlang` | 13 / 16 / 12 / 13 | 13 / 14 / 13 / 14 (visé 14 / 14 / 13 / 13) |
| ex æquo de longueur avec la bonne réponse | `atelier.js` | 3 | **0** |
| lexique : exploitables / retournées / à mettre en forme | `mesure-lexique-qcm.js --liste=erlang` | **8 / 5 / 8** | **0 / 0 / 0** |
| fenêtres de 4 leçons au-dessus des seuils | `mesure-biais-qcm.js --lots --cours=erlang` | **5** (la plus dense 4-7 : 50,0 %, 3-6 : 41,7 % ; DEUXIÈME 6-9, 7-10, 8-11 : 41,7 %) | **0** |
| biais inverse (alertes) | `mesure-biais-inverse.js --toutes erlang` | 0 (pire 25,3 %) | 0 (pire 25,4 %) |
| mot fétiche / tics de lot | `mesure-mot-fetiche.js erlang` / `mesure-tics-lot.js erlang` | 0 / 0 | 0 / 0 |
| intrus lexical DÉFAUT / EXCÈS (direct / inverse) | `mesure-mot-question.js erlang --liste` | 23,1 / 25,9 % — 24,5 / 25,5 % | 24,5 / 25,2 % — 24,5 / 25,5 % |
| explications orphelines | `mesure-explain-orpheline.js --depuis=8d163bf --seul=erlang` | 0 | 0 |
| atteintes à l'intouchable | `mesure-qcm-intouchable.js erlang 8d163bf` | 2 (déclarées) | 2 (les mêmes) |

Remarque sur `--lots` : sans `--cours=erlang`, l'outil ne regarde que les cours marqués `traite`
dans la référence des cliquets, et erlang n'y est pas encore ; la mesure ci-dessus force le cours.

### Les retouches

Méthode : le crédit de la bonne réponse calculé question par question pour chaque indice (sondes
`scratchpad/c6-erlang/reprise/bilan.js` et `strat.js`, stratégies CHARGÉES depuis l'outil, plus une
copie des fenêtres de `--lots`), le nombre de bascules calculé avant d'écrire, chaque lot simulé en
mémoire (`atelier.js`, `densite2.js`), posé par `pose.js`, puis remesuré avec les vrais outils et
comparé à `HEAD` par `controle.js` (seules les 16 questions touchées ont bougé).

- **Lexique (8 questions)** : `lecon-02` q1 (w 10 → 11 : « somme totale ») ; `lecon-03` q3 (« à
  l'abri », mot étranger, remplacé : k 4 → 3, w 13 → 14) ; `lecon-04` q3 (« continuer » rendu au
  distracteur : k 5 → 6, et le « est » du tic de verbe retiré) ; `lecon-05` q2 (w 8 → 10, le
  « garde » du tic de verbe retiré, « renvoie » remis dans les quatre options) ; `lecon-09` q2 (k 0
  → 1, w 5 → 6 ; la négation « et non », l'écho « Erlang » et l'absence de barre oblique, qui
  désignaient chacun ce distracteur, retirés) ; `lecon-09` q3 (k 3 → 4, l'absolu « toujours » retiré,
  la ponctuation ramenée à 5 signes comme les trois autres, « calcul » / « monothread » / « télécoms »
  portés par les quatre options) ; `lecon-14` q2 (« expose », étranger à la page → « ouvre ») ;
  `lecon-14` q14 (w 6 → 7 : « chaque note »).
- **La plus dense : 2,5 crédits rendus pour 2,6 visés** (16,1 → 13,6 sur 54) : `lecon-04` q1
  (« les » → « leurs » : le distracteur devient le plus dense), `lecon-04` q3, et la moitié de
  `lecon-12` q3. Les deux premières sont dans la fenêtre 4-7 de `--lots`, qu'il fallait ramener à 4
  questions sur 12.
- **La moins bavarde : 1,5 crédit rendu** (15,2 → 13,7) : `lecon-04` q3 (25 mots pour 26 à la
  bonne réponse), `lecon-08` q1 (24 mots pour 25 : un ex æquo cassé).
- **Rangs** : `lecon-08` q3 et `lecon-09` q3 passent du rang 1 au rang 2 (ce sont elles qui
  faisaient les trois fenêtres DEUXIÈME de `--lots`) ; trois ex æquo cassés : `lecon-12` q3 (bonne
  réponse au rang 3), bilan « Par quoi commence une VARIABLE » (« Un astérisque » → « L'astérisque »,
  21 car. : bonne réponse seule au rang 0), bilan « À quoi sert un gen_server » (« en panne » →
  « morts » : bonne réponse seule au rang 1).
- **Écarter les deux extrêmes** : `lecon-02` q2, où deux distracteurs ex æquo en tête laissaient la
  bonne réponse seule au milieu (crédit 1) : « Q vaut 3 » → « Q vaut [3] ».
- Un effet de bord vu par `controle.js` et refermé dans le même commit : la première version de
  `lecon-05` q2 mettait trois options à 22 mots, et « ECARTER la moins bavarde » désignait alors la
  bonne réponse seule ; la version posée (21 mots) rend ce crédit à 1/3.

### Le sens des corrections de la contre-relecture est gardé

Onze des treize corrections ont changé de mots, aucune de sens ; `lecon-03` q2 et `lecon-08` q2 sont
intactes. Les deux qui ont le plus bougé :
- `lecon-05` q2 : « le serveur garde sa donnée dans sa boîte, que le client trie par receive » →
  « le serveur se renvoie sa donnée, que le client attend avec receive ». Même thèse : la réponse
  reste côté serveur et ne parvient jamais au client.
- `lecon-09` q2 : « Le même outil de projet (la commande mix) et non rebar3 côté Erlang » → « Le
  même outil de projet (la commande mix) et sa structure standard lib/test ». Même thèse, fausse
  d'après la page (l'outil standard d'Erlang est rebar3) ; « et non », « Erlang » et l'absence de
  « / » désignaient ce distracteur à trois stratégies.

### Exécuté pour la reprise (Erlang/OTP 29.1.2)

Module `D:\outils-c\erlang\preuves\reprise\rep.erl`, lancé par `lance.sh` hors de tout dépôt :
- `lecon-02` q2 : `[T|Q] = [1,2,3]` → T = 1, Q = [2,3] (le nouveau « Q vaut [3] » est faux) ;
  `X = 1, Y = 2, X = Y` → `{badmatch,2}`.
- `lecon-03` q3 : une somme AVEC accumulateur dont l'appel récursif attend son retour
  (`R = somme_attend(N - 1, Acc + N), R + 0`) est tuée sous un plafond de 100 000 mots
  (`{mort,killed}`) ; la version terminale rend `{fini,500000500000}`. « Économe en mémoire » est faux.
- `lecon-04` q3 : un serveur bouclé par récursion, au repos : statut `waiting`, **0 réduction en
  500 ms** ; il répond `pong` au message suivant. « À plein régime, sans attente » est faux.
- `lecon-05` q2 : un serveur qui se renvoie sa réponse (`self() ! {reponse, R}`) : le client reçoit
  `timeout`, la boîte du serveur contient `[{reponse,total}]`.
- `lecon-12` q3 : `is_list(<<"ok">>)` → false, `is_binary("ok")` → false.
- bilan « VARIABLE » : `erl_parse` sur `*X = 1.` → `syntax error before: '*'`.

Non exécuté (thèses définitionnelles, réfutées par la page elle-même) : `lecon-08` q1 et q3,
`lecon-09` q2 (ni mix ni rebar3 installés) et q3, `lecon-14` q2, q14 et le bilan gen_server.

### Contrôles

`verif-html` : aucun problème ; `verif-contenu --cas-reel --cours=erlang` : 14 conformes sur 14 ;
29 blocs JSON valides ; 0 CR, 0 BOM ; `verif-donnees` : seule l'erreur attendue I18 (index
périmés) et les avertissements anciens ; `verif-qcm-biais` et `verif-qcm-lexique` : « progressé sans
que le gain soit figé » (longueur 88,9 → 24,1 %, pire indice 88,9 → 25,9 % ; STRICTE 11,8 → 0,0 %),
attendu, non refigé. `verif.js --rapide` n'a pas été rejoué pour la reprise (1 575 s au premier
passage ; la reprise ne touche que des options de QCM).

### Ce qui reste, sans arrondir

- Rangs **13 / 14 / 13 / 14** pour une cible 14 / 14 / 13 / 13 : « la plus longue » à 24,1 %, la
  QUATRIÈME à 25,9 %. Passer un rang 3 au rang 0 coûterait trois distracteurs (`lecon-02` q3) ; pas
  fait.
- Pire stratégie **25,9 %** (trois à égalité).
- Indices locaux, présents avant la reprise et non aggravés : `lecon-03` q3, « le mot technique
  exclusif » garde la bonne réponse parmi deux options ; `lecon-09` q3, il désigne un seul
  distracteur (l'écarter rend 1/3, comme avant) ; `lecon-12` q3, intrus EXCÈS (seuls deux
  distracteurs ont un mot propre) ; bilan « Quel caractère termine une clause » : deux distracteurs
  ex æquo en tête (13 car.), « écarter les deux extrêmes » y désigne la bonne réponse seule — le
  casser sortait de la fenêtre 70-130 % sur une réponse de 10 caractères.
- Index dérivés et références des cliquets non régénérés (règle de fusion).
