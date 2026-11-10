# LE NNᵉ COURS — fsharp, 96,8 % → 24,5 %

Branche `b4/fsharp`, 13 commits de `4abde12` à `80312ef`, sur la base `a6a45f2`.

## À lire en premier

- **Une bonne réponse était prouvée fausse, et elle a été corrigée** : lecon-13 q3 (commit `d6f4ebf`).
  - L'ancienne réponse disait que FsCheck éprouve une propriété sur « des centaines de cas aléatoires ».
  - La nouvelle dit « une centaine de cas aléatoires ».
  - Preuve, exécutée sous `dotnet fsi` 10.0.403 (F# 10) avec FsCheck 2.16.6 chargé par `#r "nuget: FsCheck, 2.16.6"` :
    - `Check.Quick` affiche « Ok, passed 100 tests. » ;
    - `Config.Quick.MaxTest` vaut 100.
  - La page se contredisait déjà : elle affichait ailleurs « ~100 » et « passed 100 tests ».
  - La même erreur figurait à six endroits du corps (lecon-09 ×2, lecon-13 ×4, dont le schéma). Ils sont corrigés dans le même commit.
  - L'`explain` n'a pas été touché.
- **Une bonne réponse est datée** (lecon-12 q2). Je la signale sans y toucher.
  - Elle dit qu'un active pattern partiel renvoie `Some` (avec la valeur éventuelle) ou `None`.
  - Depuis F# 9, un motif partiel qui ne capture rien peut aussi renvoyer un `bool`. Exécuté sous F# 10 : avec `let (|Pair|_|) n = n % 2 = 0`, le `match` affiche « pair impair » pour 4 et 7 (`D:\outils-b4\fsharp\preuves\rapport\bool.fsx`).
  - La leçon le dit désormais dans son corps (correction de relecture n° 21). La bonne réponse reste vraie pour le cas général.
- **Aucun fichier sous `D:\test-claude\` n'a été modifié.**
  - Toutes les écritures sont dans ma copie.
  - Les sondes et les mesures sont dans `scratchpad/fsharp-*`, que git ignore.
  - Les preuves F# et les exports de contrôle sont dans `D:\outils-b4\fsharp\`, hors des dépôts.
- **Fins de ligne** : la copie a `core.autocrlf=true`.
  - Mes 14 pages ont été remises en LF dans l'arbre de travail, comme dans l'index.
  - `git diff` ne montre aucun écart de contenu dû aux fins de ligne.
  - Les avertissements « LF will be replaced by CRLF » de git sont sans effet sur les commits, qui restent en LF.

## Avant / après

Mesures « avant » rejouées sur un export de `a6a45f2` (`git archive a6a45f2 pages/fsharp tools`), « après » sur `80312ef`, avec les mêmes commandes.

| Indice | Commande | Avant | Après |
| --- | --- | --- | --- |
| la plus longue | `node tools/mesure-biais-qcm.js --seul=fsharp` | **96,8 %** (96,3 % sans ex aequo) | **24,5 %** (24,1 %) |
| COMBINE : tiret puis longueur | id. | 96,8 % | 24,5 % |
| la plus détaillée | id. | 82,9 % | 25,0 % |
| le mot technique exclusif | id. | 75,9 % | 19,8 % |
| RESTREINDRE à la parenthèse / l'incise | id. | 74,1 % / 73,6 % | 25,0 % / 24,7 % |
| la seule avec une PONCTUATION FORTE | id. | 70,8 % | 25,0 % |
| RESTREINDRE aux deux-points | id. | 58,8 % | 25,0 % |
| l'écho de la question | id. | 54,8 % | 23,6 % |
| la seule avec un point-virgule | id. | 43,1 % | 25,0 % |
| ECARTER la moins bavarde | id. | 50,0 % | 22,2 % |
| **pire stratégie** sur les 44 | id. | **96,8 %** (la plus longue) | **26,4 %** (la plus dense ; puis ECARTER le mot technique exclusif 25,9 %, ECARTER l'écho 25,5 %) |
| questions trahies par 5 indices ou plus | id., bloc « Nombre d'indices » | 48 sur 54 (88,9 %) | 0 |
| rangs de la bonne réponse (1ʳᵉ/2ᵉ/3ᵉ/4ᵉ plus longue) | `node tools/plan-rangs-qcm.js fsharp` | 53 / 1 / 0 / 0 | **14 / 14 / 13 / 13** (= la cible) |
| lexique (règles du k et du w) | `node tools/mesure-lexique-qcm.js --liste=fsharp` | 49 exploitables, 26 retournées, 50 à mettre en forme | **0 / 0 / 0** |
| mot fétiche | `node tools/mesure-mot-fetiche.js fsharp` | 3 alertes | **0** |
| tics de lot | `node tools/mesure-tics-lot.js fsharp` | 9 tics, dont « deux-points médiane » 25 bonnes / 1 distracteur, 24 questions tranchées, **GLOBAL 58,3 %** (le record du site) | **0** |
| biais inverse | `node tools/mesure-biais-inverse.js fsharp --toutes` | 4 alertes : DEUXIÈME 32,6 %, QUATRIÈME 32,4 %, TROISIÈME 31,9 %, moins bavarde 28,7 % (GLOBAL) | 1 alerte : le mot technique exclusif, 16 tranchées, directe 6,3 %, inverse 31,2 %, **GLOBAL 26,9 %** |
| intrus lexical | `node tools/mesure-mot-question.js fsharp` | DEFAUT 23,1 / 25,3 % ; EXCES **29,3** / 16,0 % (exploitable) | DEFAUT 17,1 / 27,9 % ; EXCES 23,6 / 24,2 % ; 0 question sûre ; plus d'alerte |
| bonnes réponses, `q`, `correct` et `explain` | `node tools/mesure-qcm-intouchable.js fsharp d6f4ebf` | — | 0 atteinte depuis la seule correction prouvée |
| explications orphelines | `node tools/mesure-explain-orpheline.js --depuis=d6f4ebf --seul=fsharp` | — | 0 |
| HTML | `node tools/verif-html.js --tous` | — | 1 802 fichiers, 0 problème |

Longueur moyenne :

- bonne réponse : 114,0 caractères, inchangée ;
- distracteur : 26,1 caractères avant, 115,0 après. Le rapport passe de 4,36 à 0,99.

## Ce qui a été écrit

Décompte fait par `scratchpad/fsharp-sonde/bilan.js a6a45f2` :

| Élément | Nombre |
| --- | --- |
| distracteurs réécrits | **156 sur 162** |
| distracteurs gardés | **6** (q5 et q6 du bilan de lecon-14, déjà sans indice de forme) |
| caractères écrits | **18 611** (le plan de départ en demandait 12 010) |
| bonnes réponses changées | 1 (la correction prouvée ci-dessus) |

Déroulé, un commit par lot :

1. **Consigne** (`4abde12`).
   - Mesures de départ.
   - Table de 25 erreurs classiques **exécutées** avant d'écrire, pour que chaque distracteur de syntaxe soit une vraie erreur du compilateur.
2. **Vague, cinq lots** (`4f075e6`, `9c3e79e`, `e619c23`, `8a610fa`, `c695fb3`).
   - Lecon-01 à lecon-14, 155 distracteurs dans les lots.
   - La forme de la bonne réponse est reprise dans les distracteurs : deux-points, point-virgule, incises, glose finale.
   - k et w sont égaux sur chaque question où k > 0.
3. **Dosage calculé** (`b4a22bf`).
   - la plus dense : 34,4 → 26,4 % ;
   - la moins bavarde : 27,9 → 26,1 % ;
   - égalités de longueur cassées ;
   - un « juste » porté par les trois distracteurs (lecon-12 q3), retiré.
4. **Relecture par contradiction** (`178a4d0`).
   - Les 162 distracteurs et les 14 corps sont relus, avec environ 70 cas F# exécutés.
   - 6 options de QCM retouchées, 29 corrections de corps.
5. **Contre-relecture** des corrections (`a3b7fc2`) et **explication orpheline** (`bedc438`).
6. **Intrus lexical** : `bbcc6f3`, 5 retouches, puis `80312ef`, 20 retouches sur 15 questions (voir « Leçons »).

## Fautes de fond trouvées et corrigées, avec leurs preuves

Les preuves sont dans `D:\outils-b4\fsharp\preuves\` : `erreurs.js`, `erreurs-cas*.js`, `erreurs.out` (41 cas), `p01-03.fsx`/`.out`, `fscheck.fsx`, `l10-corrige.fsx`, `tryhead.fsx`, `p13.fsx`. Le projet jetable est dans `D:\outils-b4\fsharp\projet`. Tout a tourné sous `dotnet fsi` 10.0.403 (F# 10).

**Bonne réponse**

- lecon-13 q3 : « des centaines » → « une centaine ». Voir l'en-tête.

**Distracteur rendu VRAI par le langage**

- lecon-12 q1 : « La forme booléenne (bool)… » présentait comme impossible un motif partiel qui renvoie `bool`. C'est légal depuis F# 9, exécuté sous F# 10.
- Remplacé par « La forme constante (|Seul|)… ».

**Corps, code, schémas et exercices** : 29 corrections, règles dans `scratchpad/fsharp-corr/r-relecture.js` et suivantes.

| Leçon | Faute | Correction et preuve |
| --- | --- | --- |
| lecon-01 | sortie du REPL d'une ancienne version | `val it: int = 3` (exécuté) |
| lecon-01 | « mélanger » espaces et tabulations | une tabulation est refusée d'office (FS1161, exécuté) |
| lecon-02 exo 2 | « curryfication » accepté pour « application partielle », alors que la leçon distingue les deux | retiré de l'accept |
| lecon-03 | « le pipe est né en F# » | « popularisé par F# » (il circulait déjà en ML ; non exécuté, voir plus bas) |
| lecon-04 | « le compilateur exige tous les cas » | un `match` incomplet compile avec l'avertissement FS0025, puis lève `MatchFailureException` (exécuté) ; même correction dans le schéma de lecon-06 |
| lecon-04 | « là où C# demanderait du code supplémentaire » | « une classe C# ordinaire » (les records C# 9 ont l'égalité par valeur) |
| lecon-05 exos 1 et 3 | accept `match` pour `estVide` ; `active` refusé | accept corrigé |
| lecon-06 | `Int32.TryParse` donné en exemple de fonction qui renvoie une option | il renvoie un tuple, exécuté : `(true, 12)` ; remplacé par `List.tryHead` |
| lecon-07 | async/await de C# 5 présenté comme « conçu par la même équipe autour de Don Syme » | membre de phrase retiré |
| lecon-07 exo 3 | le placeholder affichait la réponse ; `member` accepté | corrigé |
| lecon-09 | « le site officiel F# for Fun and Profit » | site de Scott Wlaschin, et le site officiel fsharp.org est ajouté |
| lecon-09 exo 1 | `dotnet` seul accepté ; `new` refusé | corrigé |
| lecon-09 | une phrase ajoutée sur les domaines où F# n'est pas le choix naturel | voir « Leçons » : elle a été corrigée à la contre-relecture |
| lecon-10 | `multiplier 1.20` ne compilait pas : FS0001, `multiplier` est `int -> int -> int` | exemple remplacé par `tripler = multiplier 3`, `tripler 50` donne 150 (exécuté) |
| lecon-10 | la 3ᵉ question de « Vérifie ta compréhension » ne correspondait pas au QCM | question remplacée |
| lecon-11 | l'exemple `result` reprenait la pyramide des `option` sans le dire | précision ajoutée |
| lecon-12 | `let (Entier n) = "7"` contredisait la règle « motif qui ne peut pas échouer » : FS0025, puis `MatchFailureException` sur `"abc"` (exécuté) | exemple `KeyValue` ; accept `Some ()` retiré (le motif renvoie `Some n`) ; note F# 9 sur `bool` |
| lecon-13 | « l'ordre alphabétique casse la compilation » | « peut casser » : seulement s'il diffère de l'ordre des dépendances (FS0039 dans le projet jetable) |
| lecon-14 | masque d'indice faux (`???` pour `Error`) | `?????` |
| lecon-14 | une union seule n'interdit pas d'expédier une commande non payée | « avec une fonction `expedier` qui n'accepte qu'une commande payée » |
| lecon-14 | « Impossible d'oublier un cas » | « Difficile… et signale un `match` incomplet » |
| lecon-01, 04, 09, 11 | indices d'exercice qui donnaient la réponse avant le dernier | corrigés |

**Contre-relecture de mes 36 corrections : 3 fautives (8,3 %), corrigées dans `a3b7fc2`.**

- L'accept élargi de lecon-09 exo 1 acceptait `dotnet new console`. Ce modèle crée un projet **C#**. Exécuté : `dotnet new console -o cs` crée `cs.csproj`.
- La phrase ajoutée en lecon-09 contenait un absolu (« ne donnent pas »). Unity et Godot font tourner du C# à ramasse-miettes dans des jeux.
- L'absolu corrigé en lecon-04 survivait mot pour mot en lecon-14.

**Explication orpheline** (`bedc438`) :

- l'`explain` intouchable de lecon-11 q1 réfute `return`, que la vague avait retiré des options ;
- un distracteur `return` est remis. Exécuté : `seq { return 1 }` donne FS0635.

## Ce qui a été exécuté, et ce qui ne l'a pas été

**Exécuté** sous `dotnet fsi` 10.0.403 (F# 10), avec FsCheck 2.16.6 et un projet `dotnet new console -lang F#` jetable :

- **Erreurs de compilation** :
  - FS0027 (réaffecter un immuable) ;
  - FS0039 (`var`, ordre des fichiers dans le `.fsproj`) ;
  - FS0001 (int/float, `x >> 2`) ;
  - FS0005, FS0025, FS0026, FS0010 (`let!` hors bloc, syntaxes d'union fausses) ;
  - FS0635 (`return` dans `seq`), FS0623, FS0053, FS1161, FS0201 (valeur dans un `namespace`).
- **Comportements** :
  - `Option.get None` lève `ArgumentException` ;
  - `Int32.TryParse` renvoie un tuple ;
  - `Async.Parallel` sur trois attentes d'une seconde : 1,02 s sur un cœur, 3,03 s en séquentiel ;
  - `async` est froid, `task` est chaud ;
  - `Seq` est paresseux ;
  - un builder `result` minimal ne joue pas l'étape après `Error` ;
  - active patterns totaux, partiels, paramétrés et booléens (F# 9) ;
  - `begin … end` existe ;
  - `dotnet new fsharp console` répond « modèle introuvable ».
- **FsCheck** : 100 cas par défaut, réduction du contre-exemple.

Au total, 41 cas sont consignés dans `erreurs.out`, plus environ 30 lors de la relecture.

**Non exécuté** (sources de mémoire, ou formulations rendues prudentes plutôt que prouvées) :

- Jet.com et Mars Climate Orbiter, cités par les leçons ;
- l'origine du pipe dans Isabelle/ML ;
- la date d'async/await en C# 5 : le membre de phrase faux a été retiré, pas remplacé ;
- le numéro de version « F# 9 » de la note sur les motifs booléens : le comportement est exécuté sous F# 10, le numéro vient de la mémoire ;
- l'attribution de *F# for Fun and Profit* à Scott Wlaschin et le statut de fsharp.org ;
- Expecto et `dotnet test` (cités, non lancés) ;
- aucun type provider ;
- les records C# 9 (égalité par valeur), non exécutés : C# n'a pas été compilé.

## Vérification globale (`node tools/verif.js --rapide`, sur l'état de `bbcc6f3`)

Dix étapes sont signalées et une n'a rien mesuré. Trois signalements sont attendus par la consigne. Les autres viennent de l'environnement de la copie ou de pages dérivées :

- **qcmbiai, qcmlexi** : attendus. Le cours a progressé sans que les références soient refigées : la plus longue 96,8 → 24,5 %, lexique STRICTE 9,1 → 0,0 %.
- **donnees** : seul I18 est en erreur (index périmés, 8 erreurs), ce qui est attendu. Les avertissements I17 (zig), I19 (pages d'étude) et I25 (doc) existent déjà au départ (rejoué sur un export LF de `a6a45f2`).
- **moteurs, maths, doc-ref, rj-cpp, requete (« fin de JUGE_SQL introuvable »)** : causés par les **CRLF de la copie**.
  - `core.autocrlf=true`, et `git ls-files --eol` donne `i/lf w/crlf` pour `js/`, `tools/`, `assets/` et les pages des autres cours.
  - Preuve : rejouées sur un export LF du même commit (`git -c core.autocrlf=false archive HEAD`, dans `D:\outils-b4\fsharp\lf`), ces étapes passent toutes : `build-sources-worker` « aucun écart », `maths/verif-verite` 0 divergent, `rejoue-cpp` 12 conformes, `verif-sql-exos` code 0, `doc/verif-doc` code 0.
  - Ce n'est pas un défaut des outils : dans le dépôt principal, l'arbre de travail est en LF.
- **etudes, etude-6** (`pages/etude-inconnu.html` périmée) : **antérieur à mon travail**.
  - Même signalement sur un export LF de `a6a45f2` : la ligne « 6570.2 Ko » publiée contre 6561.1 mesurés.
  - En CRLF s'y ajoute le décompte « des ; en fin de ligne ».
- **normatf** (`tools/doc/verif-normatif.js`) : **dû à ma progression**, et c'est une page dérivée.
  - `pages/doc/lecon-03.html` cite des chiffres du site entier : manquements à S3 = 1 231, S4 = 59/89 cours, et d'autres.
  - Le traitement de fsharp les fait bouger : 0 échec sur l'export LF de `a6a45f2`, 9 sur celui de `80312ef`.
  - À régénérer à la fusion. Je n'y ai pas touché, c'est hors de mon périmètre.

## Leçons de ce cours

1. **Le record du tic de lot est tombé en reprenant le GABARIT de la bonne réponse, pas en le fuyant.**
   - Le tic (« deux-points médiane », 25 bonnes contre 1 distracteur, GLOBAL 58,3 %) venait de ce que seules les bonnes réponses avaient une structure « annonce : développement ».
   - Écrire les distracteurs dans la même structure (deux-points, point-virgule, incise, glose) a fermé d'un coup 9 tics, la ponctuation forte (70,8 → 25,0 %) et les deux-points (58,8 → 25,0 %).
2. **L'intrus lexical s'est RETOURNÉ, et c'est la vague elle-même qui l'a retourné.**
   - Au départ, la lecture directe EXCES rendait 29,3 % : la bonne réponse portait seule des mots.
   - Pour fermer le lexique (k) et l'écho, la vague a recopié les mots de la bonne réponse dans DEUX distracteurs sur trois. Le troisième devenait l'intrus désigné.
   - Après la vague, l'intrus était à 32,9 % en lecture inverse, **le pire des 90 cours du site** (`--tous`).
   - Règle d'écriture qui en sort : un mot recopié de la bonne réponse va dans les TROIS distracteurs, ou dans UN SEUL (2 porteurs sur 4), jamais dans deux.
   - La fermeture a dû tenir trois contraintes à la fois :
     - un mot à ajouter peut être **étranger à la page** et faire monter k : « définition » sur lecon-12 q3, d'où une question laissée ouverte ;
     - la règle du w exige **quatre w strictement égaux** dès que k > 0 ;
     - « la plus dense » est une **moyenne de longueur de mots** : un distracteur raccourci en petits mots cède la place à la bonne réponse.
   - Il a fallu quatre versions simulées avant une pose sans écart. L'outil `scratchpad/fsharp-sonde/intrus-sim.js` simule un patch sur l'intrus, comme `sim.js` le fait pour les 44 stratégies.
3. **Un distracteur écrit de mémoire peut être devenu vrai.**
   - « La forme booléenne » d'active pattern était fausse en F# 8 et elle est légale depuis F# 9.
   - Seule l'exécution l'a vu : la relecture de tête l'aurait laissé passer.
4. **Corriger une phrase ne corrige pas ses copies.** La contre-relecture a trouvé 3 fautes sur 36 corrections, dont deux de cette famille :
   - l'absolu corrigé en lecon-04 survivait en lecon-14 ;
   - en corrigeant un absolu, j'en ai écrit un autre (lecon-09).
5. **La bonne réponse fausse se lisait dans la page.**
   - « Des centaines de cas » côtoyait « passed 100 tests » dans la même leçon.
   - Aucun outil ne compare un chiffre d'une réponse aux sorties publiées.
6. **Une copie de travail en CRLF fait mentir verif.js sur des étapes sans rapport avec le cours.**
   - 7 signalements sur 10 ici.
   - Avant d'en expliquer un, le rejouer sur un export LF du même commit et sur la base.

## Ce qui reste

- **Le mot technique exclusif, lecture inverse** : 1 alerte de `mesure-biais-inverse`.
  - 16 questions tranchées, directe 6,3 %, inverse 31,2 %, **GLOBAL 26,9 %**.
  - Dans `mesure-biais-qcm` : ECARTER le mot technique exclusif 25,9 %, le direct 19,8 %.
  - 15 des 18 questions tranchées désignent un distracteur seul (`node scratchpad/fsharp-sonde/strat.js "le mot technique exclusif"`).
  - Les fermer demande de réécrire des distracteurs déjà contraints par le k, le w et l'intrus. Non fait.
- **Intrus lexical, DEFAUT inverse 27,9 %** : sous le seuil d'alerte (28 %), mais pas à 25 %.
  - Il reste environ 16 questions où un mot est porté par trois options dont la bonne.
  - Le plus gros cas est lecon-12 q3, deux distracteurs désignés. Le fermer exige d'ajouter « définition », étranger à la page (k +1), ou de réécrire le distracteur en entier.
- **La plus dense : 26,4 %**, le pire indice du cours, inchangé depuis le dosage.
- **Bonne réponse datée** de lecon-12 q2 (motifs booléens de F# 9) : signalée, à trancher par l'orchestrateur.
- **Réponses lisibles dans l'énoncé** : 20 cas, `node scratchpad/fsharp-contre/fuites-enonces.js`. Exemple : lecon-14 exo 3, dont l'énoncé contient « Error ». À trancher hors B4.
- **Libellés « Revoir « X » »** : 13 cas, `exos-tous.js`. C'est la convention du site, je les laisse.
- **À faire par l'orchestrateur à la fusion** :
  - refiger `qcm-biais-reference` et la référence du cliquet lexical (`verif-qcm-biais.js --ecrire`, `verif-qcm-lexique.js --ecrire`, `traite` à true) ;
  - régénérer les index (`build-index.js --write --fresh`, I18) ;
  - remettre à jour `pages/doc/lecon-03.html` (chiffres S3/S4 de `verif-normatif`).
