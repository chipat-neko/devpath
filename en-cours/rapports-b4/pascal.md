# LE NNᵉ COURS — `pascal` (« Pascal & Delphi »), 90,4 % → 23,7 %

Branche `b4/pascal`, copie de travail `D:\test-claude-b4\pascal`, un seul agent qui a tenu tous les
rôles (écriture, dosage, relecture, contre-relecture). 14 leçons, **59 questions dont 12 de bilan**.
Consigne versionnée : `scratchpad/CONSIGNE-PASCAL.md`. Aucun fichier du dépôt principal
`D:\test-claude\` n'a été modifié (lecture seule des sondes de `scratchpad/tests-*`, copiées).

## ⚠️ À lire en premier

1. **Une seule atteinte à l'intouchable, délibérée et prouvée par exécution** : l'**explication** de
   `lecon-10` q2 disait que lire au-delà de la fin d'un fichier, dans la boucle
   `while not Eof(f) do Readln(f, x)`, « provoquerait une erreur d'E/S ». Exécuté sous Free Pascal
   3.2.2 (`scratchpad/pascal-fpc/l10/texte.pas`) : après `Eof`, `Readln(f, ligne)` rend une chaîne
   **vide**, `Read(f, n)` d'un entier rend **0**, `IOResult` vaut **0** — aucune erreur. (Sur un
   fichier **typé**, `Read` après la fin donne bien `Runtime error 100`, `l10/typefin.pas`.) Nouvelle
   fin de phrase : « …sans jamais lire au-delà de la fin, où Readln ne rendrait plus que des valeurs
   vides. » `node tools/mesure-qcm-intouchable.js pascal 4a4b753` : **1 atteinte** (celle-ci),
   aucune bonne réponse, aucun énoncé touchés.
2. **Aucune bonne réponse prouvée fausse.** Deux sont **datées ou discutables, signalées sans y
   toucher** :
   - `lecon-02` q1 « Dans la section var, avant le begin du bloc : toutes les variables sont déclarées
     en tête » — vrai en Pascal standard et sous Free Pascal (exécuté : `var x : integer := 5;` après
     `begin`, même en `-Mdelphi`, donne `Error: Illegal expression`, `l02/inline.pas`), **faux en
     Delphi 10.3 et suivants**, qui acceptent les variables en ligne (source : documentation
     Embarcadero, de mémoire, **non exécuté**). Le cours s'intitule « Pascal & Delphi ».
   - les explications de `lecon-13` q3 et `lecon-14` q3 disent que `private` empêche de modifier le
     champ « de l'extérieur » : vrai depuis une autre unité, faux dans le fichier même de la classe
     (voir la faute 5 ci-dessous). Formulation ambiguë plutôt que fausse : laissée.
3. **La copie de travail avait été extraite en CRLF** (`core.autocrlf=true` au niveau système) alors
   que l'index et le dépôt principal sont en LF : les 15 pages de `pages/pascal/` ont été ramenées en
   LF avant tout travail (aucun diff de contenu pour git). Les autres fichiers de la copie sont restés
   en CRLF sur le disque ; c'est sans effet sur les commits (index en LF), **mais cela fait signaler
   six étapes de `verif.js --rapide`** qui passent sur le même commit extrait en LF (voir la section
   `verif.js --rapide` ci-dessous).
4. Deux messages de commit portent un chiffre erroné : `7ba405d` annonce « la plus longue 56,6 % »
   (mesuré : **54,8 %**) ; `6b1e0d9` annonce « la plus longue 25,4 % », qui était la mesure de fin
   de vague — après le dosage, **23,7 %**. Les bons chiffres sont ceux de ce rapport.

## Commits (tous sur `b4/pascal`)

| commit | contenu |
|---|---|
| `4a4b753` | consigne d'écriture, mesures de départ, table de 35 erreurs classiques exécutée |
| `48f6920` | vague, lot 1 (leçons 01-03), 27 distracteurs |
| `8c04f7e` | vague, lot 2 (leçons 04-06), 27 distracteurs |
| `7ba405d` | vague, lot 3 (leçons 07-09), 27 distracteurs |
| `c158fd6` | vague, lot 4 (leçons 10-11), 24 distracteurs |
| `62d2848` | vague, lot 5 (leçons 12-13), 24 distracteurs |
| `7b22e8b` | vague, lot 6 (leçon 14, 4 + 12 de bilan), 46 distracteurs |
| `6b1e0d9` | dosage calculé (72 retouches en 5 passes) |
| `b3fdadd` | relecture par contradiction (35 corrections de corps / code / exercices + 11 retouches de QCM) |
| `ae386df` | contre-relecture des corrections (4 prises) |

## Exécuter pour prouver : Free Pascal 3.2.2 portable

Le plan notait « aucun `fpc` installé ». **Free Pascal s'exécute désormais**, sans installation :
l'installateur officiel `fpc-3.2.2.win32.and.win64.exe` (téléchargé sur `downloads.freepascal.org`,
SHA-256 `8c255390544b051388b577eb61c6191a04883264afe0e3369b3600a56daf7bde`) a été **déballé** par
innoextract 1.9 dans `D:\outils-b4\pascal\fpc\` (hors dépôt, aucun registre ni PATH touché),
`fpc.cfg` généré par `fpcmkcfg` dans `D:\outils-b4\pascal\config\`. ⚠️ L'archive
`fpc-3.2.2.x86_64-win64.tar` du même site est un compilateur **croisé hébergé sous Linux** :
inutilisable sous Windows (essayée, supprimée). Lanceur : `scratchpad/pascal-fpc/pc.sh` (compile
puis exécute ; `PC_NORUN=1` pour compiler seulement). Cible i386-win32 ; en mode `fpc` par défaut,
`integer` fait 16 bits (`32767 + 1 = -32768`, exécuté).

**Exécuté** (environ 60 programmes, `scratchpad/pascal-fpc/l01` … `l14`) : la table des 35 erreurs
classiques de la consigne, chaque comportement annoncé par un distracteur, chaque correction de
corps ou de code. **Les 66 blocs `<pre>` « complets » du cours ont été extraits tels que la page les
affiche et compilés** (`scratchpad/pascal-sonde/blocs.js`) : 46 compilent seuls ; les 20 autres sont
tous des fragments expliqués (suite d'un bloc précédent qui déclare le type, unités à compiler
ensemble, classes qui exigent `{$mode objfpc}` ou `delphi`, une ligne de commande `$ fpc`, un bloc
sans `uses SysUtils`) et ont été exécutés **assemblés** dans les essais de chaque leçon.

**Non exécuté** (source ou mémoire, dit comme tel) : **Delphi** (comportement de `writeln` sur un
énuméré — refus E2054 —, variables en ligne, `try … except … finally` refusé — confirmé seulement en
mode `delphi` de FPC), **Turbo Pascal**, **Lazarus** (l'IDE), un vrai **Pascal ISO** (le mode
`-Miso` de FPC n'est qu'une approximation : il refuse `writeln` d'un énuméré par un `Fatal` de
bibliothèque), et **tous les faits historiques** (UCSD Pascal, Turbo Pascal 5.5, Total Commander).

## Avant / après

Commandes : `node tools/mesure-biais-qcm.js --seul=pascal`, `node tools/plan-rangs-qcm.js pascal`,
`node tools/mesure-lexique-qcm.js --liste=pascal`, `node tools/mesure-mot-fetiche.js pascal`,
`node tools/mesure-tics-lot.js pascal --exemples`, `node tools/mesure-biais-inverse.js --toutes
pascal`, `node tools/mesure-mot-question.js pascal`. Sorties brutes : `scratchpad/pascal-depart/`
(départ) et `scratchpad/pascal-depart/final-*.txt` (arrivée).

| indice | avant | après |
|---|---:|---:|
| **la plus longue** | **90,4 %** (couverture 96,6 %, rendement 93,0 %) | **23,7 %** (rendement 23,6 %) |
| pire des 44 stratégies | 90,4 % | **26,6 %** (« la TROISIÈME plus longue ») |
| la plus détaillée | 68,5 % | 24,7 % |
| le mot technique exclusif | 62,6 % | 24,7 % |
| l'incise entre parenthèses / RESTREINDRE | 61,9 % / 62,4 % | 24,2 % / 25,0 % |
| ponctuation forte (seule / RESTREINDRE) | 53,8 % / 54,9 % | 25,0 % / 25,0 % |
| l'écho de la question | 46,6 % | 23,7 % |
| le point-virgule | 36,4 % | 25,0 % |
| la MAJUSCULE d'emphase | 30,1 % | 25,0 % |
| la plus dense / la moins bavarde | 25,0 % / 3,7 % | 23,3 % / 26,4 % |
| questions trahies par 5 indices ou plus | **38 sur 59** (64,4 %) | **0** (45 à 0-2, 14 à 3-4) |
| rangs de la bonne réponse | 54 / 1 / 3 / 1 | **16 / 16 / 14 / 13** (cible 15/15/15/14) |
| longueur moyenne bonne / distracteur | 79,5 / 21,6 car. (rapport 3,68) | 79,5 / 80,3 car. (rapport 0,99) |
| lexique : exploitables / retournées / à mettre en forme | 49 / 20 / 51 | **0 / 0 / 0** |
| mot fétiche (alertes) | 0 | **0** (après dosage : `chaque` était monté à 1 bonne / 20 distracteurs) |
| tics de lot | 7 (glose finale 16/2, deux-points médian 15/6, point-virgule médian 12/4…) | **0** |
| biais inverse (alertes) | 5 | **0** (pire : mot technique exclusif, 26,2 % en global) |
| intrus lexical DÉFAUT direct / inverse / sûres | 22,5 / 25,8 / 0 | 22,6 / 26,6 / **0** |
| intrus lexical EXCÈS direct / inverse / sûres | 32,6 / 19,9 / **4** | 25,1 / 23,7 / **0** |

**Distracteurs : 176 réécrits sur 177, 1 gardé** (`print`, bilan q7 de `lecon-14`). Longueur
totale des distracteurs : **3 823 → 14 206 caractères**, soit environ **10 380 caractères écrits**
(le plan en demandait 8 564).

## Ce que la vague a fait, et le dosage

Six lots, un commit chacun. Chaque distracteur est une thèse fausse **prouvée fausse par
exécution** quand elle porte sur le compilateur : `7 div 2` vaut 3 et pas 3.5 ni 4 ; `;` avant `else`
est une erreur de syntaxe, pas un bug d'exécution ni un détail de style ; `return` et `yield`
inconnus ; paramètre sans `var` inchangé (21) ; `t[6]` silencieux sans `{$R+}`, `Runtime error 201`
avec ; `Lundi + 1` refusé ; `SizeOf` d'un sous-domaine `0..20` = 1 octet ; `x ^ 3` → `Illegal
qualifier` ; 1 000 `new` sans `dispose` compilent et finissent en code 0 ; `Seek` refusé sur un
fichier texte ; `Ord(Lundi)` = 0 ; `c = '0'..'9'`, `c in 0..9`, `c in [0..9]` refusés ; récursion
sans cas de base → `Runtime error 202`, aucun refus à la compilation ; `finally` ne rattrape pas
l'exception.

⚠️ **Le piège propre à ce cours, écrit en consigne avant la vague : il y a plusieurs Pascal.** Des
distracteurs évidents auraient été **vrais** dans un dialecte : « on peut déclarer une variable
après `begin` » (vrai en Delphi 10.3+), « `Exit(x)` renvoie la valeur » (vrai sous FPC et Delphi),
« une économie de mémoire » pour un énuméré (`SizeOf(TJour)` = **4** en mode `fpc`, **1** en mode
`delphi`, exécuté), « `GetMem` alloue de la mémoire dynamique » (vrai). Écartés. **Deux distracteurs
de départ étaient déjà vrais ou défendables** et ont disparu : `GetMem seul` et `class (seul)`.

**Le dosage (commit `6b1e0d9`) a été calculé, en cinq passes, sur des sondes écrites pour ce cours**
(`scratchpad/pascal-sonde/vague.js`, `dosage-pascal.js`, `mte.js`) : à la fin de la vague,
« la plus longue » était déjà à 25,4 %, mais **trois défauts que la vague avait fabriqués** restaient :
- **le mot fétiche `chaque`** : 1 bonne réponse / **20 distracteurs** (alerte, ÉCARTER 28,4 %) —
  le mot sert à atteindre le compte de mots longs (`w`) avec du vocabulaire de la page ; ramené
  sous le seuil (7 retraits) ;
- **l'intrus lexical en lecture INVERSE** (29,1 % et 29,0 %) : des mots portés par 3 options sur 4
  qui désignaient presque toujours un **distracteur** — 19 corrections ;
- **trois alertes de biais inverse** (mot technique exclusif, moins bavarde, plus détaillée) :
  l'indice désignait un distracteur 22 fois sur 23 ; 5 questions où la bonne réponse redevient la
  seule à porter un mot de 9 lettres, 4 où elle redevient la moins bavarde, 9 virgules retirées.
  « La plus dense » est passée de 28,4 % à **30,1 %** par effet de bord, puis à **21,6 %** après 4
  bascules — trop —, puis **23,3 %** après un retour : **le dosage se calcule, et se corrige**.

## Fautes de fond trouvées et corrigées (relecture `b3fdadd`, contre-relecture `ae386df`)

Toutes **prouvées par exécution** sous FPC 3.2.2 sauf mention :

1. **`writeln(feu)` « affiche un nombre »** (`lecon-06` : SVG, `aria-label`, encadré « Piège ») —
   **faux partout** : Free Pascal écrit le **nom** (`Rouge`) dans les modes `fpc`, `objfpc`,
   `delphi`, `tp`, `macpas` (`l06/enumwrite.pas`) ; Pascal ISO et Delphi refusent l'instruction
   (source, non exécuté). Le piège dit maintenant que le résultat dépend du compilateur.
2. **Le sous-domaine « garanti » par le compilateur** (`lecon-06` corps, glossaire, « Pour aller
   plus loin », code ; `lecon-11` code et corps) : `note := 25` n'est qu'un **avertissement** et la
   variable vaut 25 ; `note := x` avec `x = 25` passe **en silence** ; erreur seulement avec `{$R+}`
   (`l06/sousdomaine*.pas`, `l11/chiffre12.pas`).
3. **Un modèle de code qui ne compile pas** (`lecon-10`, gestion d'erreurs « en Delphi ») :
   `try … except … finally` en un seul bloc → `Fatal: Syntax error, "ON" expected but "FINALLY"
   found` (mode `delphi`). Remplacé par un `try … finally` imbriqué dans un `try … except`, extrait de
   la page et exécuté : `Erreur : File not found` (fichier absent), fichier relu et refermé sinon.
4. **Lire après `Eof`** (`lecon-10` encadré « Piège » **et explication de q2**) : voir « À lire en
   premier ».
5. **`private` « accessible seulement à l'intérieur de la classe »** (`lecon-13`) : faux en Object
   Pascal — `c.FSolde := -1000` **compile et s'exécute** dans le fichier de la classe (modes
   `objfpc` et `delphi`, `l13/privememefichier.pas`) ; refusé depuis une autre unité ; seul `strict
   private` le réserve à la classe.
6. **Une sortie inventée** (`lecon-02`) : « `9.9899999E+00` » ; FPC écrit
   `9.9900000000000002E+000` (`l02/reels.pas`).
7. **Le modèle `TInventaire` sans la vérification de bornes** que l'encadré juste dessous exige
   (`lecon-14`) : ajoutée, exécutée (`refusé : Stock plein` au 101ᵉ ajout).
8. **Sortie de polymorphisme** (`lecon-13`) : le commentaire annonçait « Ouaf ! », le code affichait
   ` fait Ouaf !` (nom vide) ; nom affecté, sortie exécutée « Rex fait Ouaf ! ».
9. **Ligne morte** `FactIter := n;` dans le modèle itératif (`lecon-12`).
10. **Historique, de mémoire, en formulation prudente** : les unités « invention de Turbo Pascal »
    (elles viennent de l'UCSD Pascal) ; « Delphi apporte l'objet à Pascal » (Turbo Pascal 5.5 avait
    des objets dès 1989) — **corrigé à quatre endroits** (`lecon-01` frise et corps, `lecon-09` corps,
    glossaire et récapitulatif, `lecon-13` introduction ; la contre-relecture en a trouvé trois que
    la relecture avait laissés) ; « préfigure les .h/.c du C » (antérieurs) → « rappelle » ;
    Total Commander « écrit en Delphi » → « en Object Pascal (Delphi) ».
11. **Exercices** : le placeholder de `lecon-12` exo 1 contenait une réponse acceptée (« condition
    d'arrêt ») ; « Fact(4) » était **accepté** comme réponse à « Que vaut Fact(4) ? » ; deux indices
    intermédiaires donnaient la réponse (`lecon-02` exo 2, `lecon-05` exo 3) ; le placeholder de
    `lecon-06` exo 1 écrivait la réponse en capitales (« TYPE ») ; celui de `lecon-07` exo 2 et son
    premier indice contenaient « 99 ». Rejeu `normExo` sur les 40 exercices
    (`scratchpad/pascal-contre/exos-tous.js`) : **0 fuite**.
12. Petites : français (« à le plus de monde »), `Exit(x * x)` mentionné à côté de « pas de
    `return` », commentaire d'inclusion faux, `Low`/`High` sur un tableau, `TStringList` rangé parmi
    les flux, « bloc final » pour `initialization`.

**Contre-relecture** (diff `6b1e0d9..b3fdadd` relu ligne à ligne, blocs corrigés ré-extraits de la
page et ré-exécutés) : **4 prises sur 46 corrections (8,7 %)**, toutes du même type — **la
correction posée à un endroit quand la page le dit à quatre** (la faute historique survivait trois
fois ; la sortie de `lecon-02` ne disait pas de quel compilateur elle venait). Aucune correction
n'enseignait une chose fausse. Chaque lot de corps a été suivi de `controle.js` : la relecture a
d'abord **déplacé 3 questions** (le mot « erreur », sorti de deux pages, et « vérifier »,
« directement » faisaient bouger `k`) ; 4 rattrapages de vocabulaire, puis **0 indicateur déplacé**.

## `node tools/verif.js --rapide`, après `ae386df`

Lancé dans la copie de travail : **code 1 en 367,4 s**, « problèmes 0 », **10 étapes SIGNALE et 1
NON MESURÉ**. Sortie complète, non versionnée, sur le disque de la copie :
`scratchpad/pascal-depart/final-verif-rapide.txt`. Hors `pages/pascal/`, `scratchpad/` et ce rapport,
la branche ne diffère en rien de `master` (`git diff master -- . ':!pages/pascal' ':!scratchpad'
':!en-cours/rapports-b4'` est vide). Pour séparer ce qui vient du cours de ce qui vient de la copie,
le commit `ae386df` et `master` (`a6a45f2`) ont été extraits **en LF hors dépôt**
(`git -c core.autocrlf=false archive`, dans le scratchpad de session, supprimés ensuite) et les
étapes signalées y ont été rejouées une à une.

| étape | dans la copie (CRLF) | `ae386df` extrait en LF | `master` extrait en LF | cause |
|---|---|---|---|---|
| `qcmbiai`, `qcmlexi` | « [référence périmée] cours pascal », progressé sans gain figé | — | — | **attendue** (cliquets non refigés, règle de fusion) |
| `donnees` | 8 erreurs, toutes I18 (5 index divergents) | — | — | **attendue** (index non régénérés) |
| `requete` | NON MESURÉ : « fin de JUGE_SQL introuvable » | 0 faute (30 lignes, 39 contre-requêtes) | — | **CRLF** : l'outil cherche `'\n  }\n'` dans `js/lecon.js` (2 051 CRLF dans la copie, 0 dans le dépôt principal) |
| `moteurs` | 4 écarts (`SQLJS_SRC` 46 535 caractères pour 46 721…) | aucun écart | — | **CRLF** |
| `maths` | 58 divergents | 0 divergent | — | **CRLF** |
| `doc-ref` | 1 échec sur 41 (copie de `slugify.txt` : « écart de 1 caractères ») | 41 contrôles OK, 0 échec | — | **CRLF** |
| `rj-cpp` | 12 blocs « introuvables » sur 12 | 12 programmes conformes | — | **CRLF** |
| `normatf` | 12 échecs sur 75 (dont un « écart de 1 caractères » avec `quiz-format.txt`) | **8 échecs sur 75** | 75 OK, 0 échec | **le cours** : `pages/doc/lecon-03.html` cite des mesures du corpus entier (S3 : 20,2 % de manquements, 1 232 manquements, 4 871 conformes ; S4 : 59 / 89 cours, 66,3 % ; corpus de l'ancienne clause 3 699) que la réécriture des 59 questions de `pascal` fait bouger. Page dérivée d'un autre cours : **non touchée**, à remettre au point fixe par l'orchestrateur après fusion |
| `etudes` | `etude-inconnu.html` périmée, ligne 171 (« des ; en fin de ligne » 23 / 39 contre 20 / 39) | périmée, ligne **226** (sortie de `mesure-langages.js`) | périmée, ligne **226**, identique | ligne 171 : **CRLF** ; ligne 226 : **antérieure au cours** (même divergence sur `master`) |
| `etude-6` | 1 faute | 1 faute | 1 faute | **antérieure au cours** (même faute sur `master`) |

Je n'ai pas tranché si la divergence de `etude-inconnu` (ligne 226) existe aussi dans le dépôt
principal ou si elle naît de l'extraction par `git archive` : aucun outil n'a été lancé dans
`D:\test-claude\`.

## Ce qui reste, sans arrondir

- **Signalé, non corrigé** :
  - `lecon-07` : « les variables ordinaires rangées sur la pile » et « Le pointeur p, lui, reste sur
    la pile » — le `p` de l'exemple est une variable **globale**, rangée dans le segment de données
    statique, pas sur la pile ; simplification pédagogique courante, non exécutée (il faudrait
    comparer des adresses), à trancher hors B4 ;
  - `lecon-13` : le bloc `try … finally` appelle `c.Retirer(500)`, méthode qu'aucune déclaration de
    `TCompte` de la page ne définit (fragment illustratif) ;
  - `lecon-01` : la frise date Free Pascal « 1999+ » (le projet date de 1993 ; 1999 est l'année de
    Lazarus) — de mémoire, non corrigé ;
  - les énoncés de 10 exercices contiennent le mot attendu (convention du site, déjà notée sur
    `bash` et `tests`) ; `fuites-larges.js` signale à tort `^integer` dans le placeholder de
    `lecon-07` exo 1 (sa découpe en mots ignore `^`).
- **Mesures** : « la TROISIÈME plus longue » 26,6 % et « la moins bavarde » 26,4 % sont les deux
  plus hautes ; les rangs sont à **16 / 16 / 14 / 13** pour une cible 15 / 15 / 15 / 14 (une
  question à faire passer du rang 0 ou 1 au rang 3 fermerait l'écart). Trois questions du bilan
  (`uses`, `Free`, et `:=` en partie) ont des options de même longueur : les stratégies de rang n'y
  tranchent pas, c'est voulu.
- **Non fait, par la règle de fusion** : cliquets non refigés (`verif-qcm-biais.js --ecrire`,
  `verif-qcm-lexique.js --ecrire`), `pascal` non marqué `traite`, index (`quiz-index.js`,
  `pieges-data.js`, `flashcards-data.js`) non régénérés, `verif-rendu` non lancé. `verif-donnees` :
  **8 erreurs, toutes I18** (index périmés : les trois encadrés « Piège » réécrits et les QCM), comme
  le prévoit la consigne commune. `verif-html` : **0 problème**. JSON des blocs valide, 0 CR, 0 BOM,
  0 chargement externe dans `pages/pascal/`.

## Leçons de ce cours

1. **Un compilateur « absent » est souvent un installateur à déballer.** L'archive `.tar` officielle
   était un leurre (compilateur croisé hébergé sous Linux) ; l'installateur Inno Setup, ouvert par
   innoextract, donne la distribution complète sans rien installer. Coût : 10 minutes, et la table
   des erreurs classiques a rendu **deux fautes de fond avant toute écriture** (`writeln` d'un
   énuméré, sous-domaine sans `{$R+}`).
2. **Un cours sur une famille de dialectes impose une règle de plus** : un distracteur doit être
   faux dans tous les dialectes que la page nomme. Sans elle, quatre distracteurs « évidents » étaient
   vrais en Delphi récent ou sous FPC.
3. **Le vocabulaire de la page est la vraie contrainte d'écriture** quand `k` vaut 0 : pour tenir
   `w` avec des mots présents dans la page, on attrape les mêmes mots passe-partout — et `chaque`
   devient un mot fétiche (1 / 20). Le contrôler à la fin de chaque lot, pas à la fin de la vague.
4. **L'intrus lexical se dérègle par les retouches de dosage elles-mêmes** : retirer un mot à un
   distracteur pour une stratégie le laisse à 3 options sur 4 pour une autre. La lecture inverse est
   passée de 29,1 % à 27,0 % puis remontée à 28,7 % par trois corrections de relecture, et il a fallu
   la refermer (26,6 %).
5. **La contre-relecture prend moins quand on relit son propre diff, mais elle prend encore** :
   8,7 % des corrections, toutes « posées à un endroit sur quatre ».
