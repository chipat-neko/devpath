# Consigne d'écriture — les QCM du cours `erlang` (case C6 du chantier V18)

Préparée le 2026-11-19 par l'agent du cours `erlang`, seul sur sa copie de travail
(`D:\test-claude-c6-erlang`, branche `v18/c6-erlang`, partie de `8d163bf`). Un seul agent fait tous
les rôles (preuves, écriture, dosage, relecture, contre-relecture). Mesures de départ archivées dans
`scratchpad/c6-erlang/depart/` (hors git : sorties brutes des outils, `questions.txt` = les
54 questions à plat). Sondes dans `scratchpad/c6-erlang/sonde/` : `controle.js` et `simule.js`
copiés de `vue-sonde` et repointés (`controle.js` à vide : 0 indicateur déplacé), `pose.js`
(applicateur : reparse chaque bloc, refuse la bonne réponse), et deux outils neufs : `atelier.js`
(banc d'écriture : un lot de patchs appliqué EN MÉMOIRE ; pour chaque question, rang visé, fenêtre
70-130 %, mots, densité, `w`/`k` copiés de `mesure-lexique-qcm`, mots de 9+ lettres exclusifs, écho,
absolus / prudents / négation, marques, tics de forme copiés de `mesure-tics-lot`, intrus copié de
`mesure-mot-question`, et les stratégies de `mesure-biais-qcm` CHARGÉES depuis l'outil) et
`texte.js` (une leçon en texte lisible).

Le cours : « Erlang », 14 leçons — bases et shell (`01`), types et filtrage (`02`), clauses, gardes,
récursion (`03`), processus, `spawn`, `!`, `receive` (`04`), modèle acteur et état (`05`), « let it
crash », `link`, `monitor`, superviseurs (`06`), OTP, `gen_server`, `call`/`cast` (`07`),
distribution et mise à jour à chaud (`08`), écosystème, rebar3, Elixir (`09`), ETS (`10`), records,
specs, Dialyzer (`11`), bit syntax (`12`), EUnit et PropEr (`13`), projet inventaire (`14` : 3
questions + **12 de bilan**). **54 questions, 162 distracteurs.**

## ✅ CE QUI SE PROUVE SE PROUVE — ERLANG S'EXÉCUTE ICI

Erlang/OTP 29.1.2 (ERTS 17.1.1), archive officielle décompressée dans `D:\outils-c\erlang\otp\`
(hors dépôt) ; preuves dans `D:\outils-c\erlang\preuves\` (`p01.erl`, `p06.erl`, `p07.erl`,
`p08.erl`, `p11.erl`, `maths.erl`, `geo.erl`, `p13.erl`, `l14/`), lancées par `lance.sh`, qui
**se place dans ce dossier** (un premier lancement sans `cd` a écrit un `erl_crash.dump` dans le
dépôt principal). PropEr 1.5.0 : archive officielle de hex.pm, compilée hors dépôt
(`D:\outils-c\erlang\libs\`). Dialyzer : PLT `erts kernel stdlib` construite hors dépôt.

**Ce que l'exécution a rendu — n'emploie dans un distracteur que ce que TA leçon établit :**

| croyance fausse (bonne matière à distracteur) | ce que rend OTP 29 |
|---|---|
| `X = 2` après `X = 1` réaffecte X | `{badmatch,2}` |
| `[T|Q] = [1,2,3]` donne T = [1,2] ou Q = 3 | T = 1, Q = [2,3] |
| Erlang essaie la clause la plus précise, la dernière, au hasard | la première qui correspond, de haut en bas : `jour(2)` → `"mardi"` |
| « inférieur ou égal » s'écrit `<=` | `=<` (1 =< 2 → true) ; `<=` est une erreur de syntaxe |
| sans accumulateur, même mémoire | tas+pile plafonnés à 100 000 mots : `compte_corps(1000000)` → tué ; `compte_term` → `{fini,1000000}` |
| `dire/0` = version, nombre de lignes… | `bonjour:dire(x)` → `undef` ; exports `[{dire,0}, …]` |
| `spawn` renvoie la valeur de la fonction | un PID (`<0.84.0>`, `is_pid` → true) |
| `E ! Msg` attend une réponse | l'expression vaut `Msg` aussitôt, le message est déposé |
| un processus sans rappel continue | `une_fois` traite un message puis meurt (`is_process_alive` → false) |
| un processus neuf pèse « quelques centaines d'octets » | `process_info(P, memory)` → **2624 octets** (mots de 8 octets) |
| `register` accepte une chaîne | `badarg` ; il faut un atome |
| `link` est à sens unique | tuer B tue A, tuer A tue B |
| `monitor` tue l'observateur | l'observateur reçoit `{'DOWN', Ref, process, Pid, boom}` et vit ; tuer l'observateur ne touche pas la cible |
| `cast` attend la réponse | `call` : 513 ms (handle_call dort 500 ms) ; `cast` : 0 ms, renvoie `ok` |
| `one_for_all` ne relance que le fautif | e2 plante : one_for_one → [e2] ; one_for_all → [e1,e2,e3] ; rest_for_one → [e2,e3] |
| le superviseur rend l'état perdu | état `{e1,2}` avant, `{e1,0}` après ; inventaire : total 0 après relance |
| `code:load_file` bascule le processus aussitôt | le message suivant répond encore `v1` (appel local), puis `v2` après l'appel qualifié |
| `ets:lookup` d'une clé absente lève une erreur / rend `undefined` | `[]` |
| `ets:update_counter/3` crée la clé | `badarg` (cause `badkey`) ; `update_counter/4` avec défaut rend 1 puis 2 |
| la table survit à son propriétaire | `ets:info(tab_a)` → `undefined`, `lookup` → `badarg` ; avec `heir`, message `'ETS-TRANSFER'` |
| protection / type par défaut `public` / `bag` | `protected` / `set` |
| un record devient une map ou `{x, 1, y, 2}` | `{point,1,2}` ; `P#personne{age = 31}` laisse P intact |
| `<<1:4, 2:4, 42:16>>` fait 8 ou 16 bits | `<<18,0,42>>`, `bit_size` 24, `byte_size` 3 |
| `Reste/binary` donne une liste ou une somme | `X = 255, Reste = <<10,20,30>>` |
| `<<"ok">>` est une liste ou un atome | binaire de 2 octets ; `"ok" =:= [111,107]` |
| EUnit lance `test_xxx()` ou une fonction avec argument | seuls `*_test()` (arité 0) et les générateurs `*_test_()` sont lancés |
| `?assertThrow` n'existe pas | il existe (`throw_test` passe) ; `?assertError(badarith, …)` passe |
| PropEr génère « des centaines » de cas | **100** par défaut (« OK: Passed 100 test(s). ») ; contre-exemple rétréci `[-8,0]` → `[-1,0]` |
| Dialyzer : « Function surface/2 will never return since it differs in argument position 1 » (texte recopié de mémoire dans `lecon-11`) | « Function appel/0 has no local return » et « The call geo:surface("x", 3) will never return since the success typing is … and the contract is … » |

**Non exécuté** (documentation officielle seulement, à écrire tel quel dans le rapport) : la
distribution entre nœuds (`net_adm:ping`, envoi distant), rebar3, Elixir, le « zéro faux positif »
de Dialyzer (documentation de Dialyzer d'OTP 29).

## Les fautes de fond corrigées AVANT la vague (commit `feb2e92`)

`lecon-13` q3 (bonne réponse : « des centaines » → « une centaine ») et l'explain de `lecon-14` q15 ;
`lecon-04` (2 624 octets), `lecon-11` (sortie réelle de Dialyzer), `lecon-10` exercice 2
(`update_counter/4`), `lecon-05` exercice 2 (« boucle »), liens de `lecon-14`. Les bonnes réponses
discutables (`lecon-01` q1 « distribution » au lieu de la « disponibilité continue » du corps ;
`lecon-14` q7 « une majuscule », alors qu'une variable peut aussi commencer par `_`) sont
**signalées, pas touchées** — et aucun distracteur ne doit devenir vrai à leur contact (ne jamais
écrire « un souligné » en q7, ni « la disponibilité continue » en q1).

---

## ⚠️⚠️⚠️ LA RÈGLE QUI PRIME SUR TOUTES LES MESURES

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si l'on ne peut pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

1. L'erreur se nomme en une phrase ; le comportement vrai est dans la table ci-dessus ou dans le
   corps de la leçon.
2. Chaque proposition a un référent ; aucune parenthèse ni queue de phrase de remplissage.
3. Un débutant crédule pourrait la cocher : c'est une erreur RÉELLE (encadrés « Piège fréquent »,
   habitudes d'autres langages : `<=`, `for`, threads, mutation, `try/catch` partout).
4. Le distracteur affirme sa thèse POSITIVEMENT ; sa fausseté est dans le mécanisme décrit, jamais
   dans un aveu final (« … et le processus plante »).
5. ⚠️ **Les pièges propres à ce cours** : (a) Erlang a des choses que l'apprenant croit absentes :
   `try … catch` existe (simplement découragé), `?assertThrow` existe, les maps existent, ETS peut
   être `public`, un `bag` garde plusieurs valeurs — un distracteur « Erlang n'a pas X » est souvent
   VRAI pour une autre forme de X ; (b) « échoue », « plante », « lève une erreur » : vérifier sur la
   table ; (c) `catch Expr` est **déprécié** depuis OTP 29 (avertissement du compilateur) : ne pas
   s'appuyer sur une différence de version.

**PRÉFÈRE UNE ERREUR CLASSIQUE ET NETTE À UNE ÉLÉGANCE MESURÉE.**

## Pourquoi ce travail — départ sur `8d163bf`

`node tools/mesure-biais-qcm.js --seul=erlang` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **88,9 %** | 94,4 % | 92,2 % |
| la plus détaillée | **72,2 %** | 70,4 % | 92,1 % |
| l'incise entre parenthèses / RESTREINDRE à la parenthèse | **68,2 %** | 57,4 % | **100,0 %** |
| le mot technique exclusif | **63,0 %** | 63,0 % | 82,4 % |
| la seule avec une PONCTUATION FORTE (et RESTREINDRE) | **52,8 %** | 37,0 % | **100,0 %** |
| l'écho de la question | **46,6 %** | 44,4 % | 70,8 % |
| ECARTER la moins bavarde | **43,7 %** | 11,1 % | 83,3 % |
| RESTREINDRE aux deux-points | **40,3 %** | 22,2 % | 91,7 % |
| la seule avec un point-virgule | **38,4 %** | 20,4 % | 90,9 % |
| ECARTER la plus courte | 34,9 % | 0,0 % | — |
| la plus prudente | 32,4 % | 14,8 % | 75,0 % |

**39 questions sur 54 (72,2 %)** trahies par 5 indices ou plus. Bonne réponse **95,3 caractères** en
moyenne, distracteur **24,2** (rapport **3,94**). `node tools/plan-rangs-qcm.js erlang` : rangs
**49 / 2 / 3 / 0**, cible **14 / 14 / 13 / 13**, **9 731 caractères** à écrire sur **53 questions**
(cible par question dans `sonde/cibles.json`, tirée du plan). Biais inverse
(`mesure-biais-inverse --toutes erlang`) : **5 alertes** (QUATRIÈME plus longue 32,1 %, DEUXIÈME
31,3 %, TROISIÈME 29,9 %, la moins bavarde 29,8 %, écarter les deux extrêmes 26,1 %).

### Les TREIZE tics de lot (`mesure-tics-lot.js erlang --exemples`)

| tic | bonnes / distr. | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **glose finale entre parenthèses** | **18 / 2** | 18 | 94,4 % | **48,1 %** |
| **deux-points médian** | **12 / 0** | 12 | **100,0 %** | **41,7 %** |
| **point-virgule médian** | **10 / 1** | 11 | 90,9 % | **38,4 %** |
| « des messages » | 7 / 0 | 7 | 100,0 % | 34,7 % |
| parenthèse ouverte par un article | 6 / 0 | 6 | 100,0 % | 33,3 % |
| verbe conjugué (est / sont / reste…) | 14 / 17 | 11 | 63,6 % | 32,9 % |
| « aux pannes » | 5 / 0 | 5 | 100,0 % | 31,9 % |
| « un processus » | 5 / 2 | 7 | 71,4 % | 31,0 % |
| « et le », « un message », « à un » | 3 / 1 | 4 | 75,0 % | 28,7 % |
| quatre segments à virgules, « de la » | 3 / 2 | 5 | 60,0 % | 28,2 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (une glose) » : **les trois distracteurs prennent le MÊME gabarit** (quatre porteurs,
jamais un ni trois), avec un contenu qui énonce une erreur.

### Mots fétiches (`mesure-mot-fetiche.js erlang`) : 2 alertes
`processus` (12 bonnes / 6 distracteurs, RESTREINDRE 37,7 %), `messages` (8 / 1, 35,6 %) ; sous le
seuil : `message` 5 / 2 ; `parce` 0 / 7 est un mot de DISTRACTEUR (ne commencer par « Parce que »
que si la bonne réponse le fait). **Pose `processus`, `messages`, `message` dans les distracteurs
des questions où la bonne réponse les porte** (là où ils ont un sens), et quelquefois là où elle ne
les porte pas ; viser une bonne pour trois distracteurs.

### Lexique (`mesure-lexique-qcm.js --liste=erlang`) : 43 exploitables, 22 retournées, 48 à mettre en forme
Règle du `k` (OCCURRENCES de mots de 6+ lettres absents de la page, quiz exclus, apostrophe droite
collée : `l'arité` est UN jeton) : les quatre options portent le même `k` ; si `k > 0`, elles portent
aussi le même `w` (mots de 6+ lettres). Moyen le plus sûr : **reprendre dans les distracteurs les
mots étrangers de la bonne réponse**. Un mot de moins de 6 lettres est libre.

### Mot technique exclusif (63,0 %) et intrus lexical (`mesure-mot-question.js erlang --liste`)
Par mot de **9+ lettres** : chaque option en porte autant d'exclusifs que la bonne réponse (en
général : reprendre ses mots longs dans deux distracteurs ou plus). Intrus (mots de **5+** lettres,
apostrophe et tiret COUPENT : `l'arité` → `arité`) : aucun mot porté par **exactement trois**
options, et chaque option a au moins un mot propre (au départ : 5 questions sûres, dont deux par
« parce »).

## Ce que chaque question doit tenir (`atelier.js` le vérifie)

1. **Rang** de la bonne réponse = `cibles.json`, sans ex æquo ; distracteurs dans 70-130 % de sa
   longueur ; le rang en MOTS suit le rang en caractères ; la bonne réponse n'est ni toujours la plus
   dense, ni toujours la moins dense.
2. **Marques — les quatre ou aucune** : `;`, `:`, incise (même NOMBRE), glose finale, `/`, « »,
   flèche, point interne, virgule décimale, tiret. ⚠️ Le CODE porte des marques : `dire/0`,
   `ajouter/3`, `call/cast` sont des barres obliques ; `->`, `=>` des flèches ; `self()`, `f(X)` des
   parenthèses (moins de 4 caractères dedans : pas une incise, mais compte pour RESTREINDRE) ;
   `<<X:8>>`, `1:4` des deux-points. **Même nombre de `, : ;`** dans les quatre.
3. **Absolus, prudents, négation** : 0 ou 4 porteurs. **MAJUSCULE d'emphase** : même nombre ;
   ⚠️ `ETS`, `DOWN`, `PLT`, `NOUVELLE` comptent (absents des sigles de l'outil), pas `BEAM`, `PID`,
   `OTP`, `VM`, `JIT`.
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre. **Attaque** : jamais trois
   pareilles et une différente ; casse initiale identique.
5. **Tics de forme** (copie de `mesure-tics-lot`) : 0, 2 ou 4 porteurs — « est / sont / reste /
   garde / devient » où qu'ils soient, « ce / cette / ces », « car / puisque / parce que », « alors /
   ensuite / puis », « ne … que », « (un/une/le… », « , et », quatre segments à virgules.
6. **Fin d'option** : la même pour les quatre (`-module(nom).` et `Le point .` finissent par un
   point : leurs distracteurs aussi, au moins un).

## L'ordre de travail
1. Relire la leçon entière (le corps fixe le vocabulaire et ce qui est vrai).
2. Écrire les trois erreurs en une phrase chacune, vérifier qu'elles sont fausses (table).
3. Rédiger au gabarit de la bonne réponse, dans la bande ; `node scratchpad/c6-erlang/sonde/atelier.js
   <lot.json>` jusqu'à « rien » ; `simule.js` sur le cumul.
4. Poser par `pose.js <lot.json> --ecrire`, mesurer le cours entier avec les VRAIS outils, COMMITER.
