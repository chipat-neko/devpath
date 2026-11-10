# Consigne d'écriture — les QCM du cours `fsharp` (B4, cours traité en parallèle)

Préparée le 2026-11-10 dans la copie de travail `D:\test-claude-b4\fsharp` (branche `b4/fsharp`),
à partir du commit `a6a45f2`. Un seul agent fait tous les rôles (écriture, dosage, relecture,
correction, contre-relecture). Mesures de départ archivées dans `scratchpad/fsharp-depart/`
(sorties brutes des outils ; `questions.txt` : les 54 questions à plat, avec leurs explain).
Sondes dans `scratchpad/fsharp-sonde/` (copiées de `tests-sonde`, repointées sur `pages/fsharp/` :
`controle.js` à vide rend **0 indicateur déplacé sur 54 questions**) et deux outils neufs :
`diag.js` (diagnostic complet d'une question APRÈS un patch simulé : rang visé et bande de
chaque option, `w`/`k` comme `mesure-lexique-qcm`, mots de 9 lettres exclusifs, écho, attaque,
absolus, prudents, négation, marques, motifs de `mesure-tics-lot`, et les stratégies des 44 qui
tranchent) et `dump.js` / `texte.js` (les questions à plat, une leçon en texte lisible).

Le cours : F# — fonctionnel-first sur .NET, valeurs et curryfication, listes et pipe `|>`,
records et unions discriminées, pattern matching et active patterns, option et Result, async /
task et interop, données et type providers, outillage `dotnet`, composition `>>` et point-free,
computation expressions, active patterns avancés, projet (`.fsproj`, modules, FsCheck), et un
projet de synthèse (`lecon-14` : 3 questions + **12 de bilan**). 14 leçons, **54 questions**.

## ✅ CE QUI SE PROUVE SE PROUVE — F# S'EXÉCUTE ICI

`dotnet` 10.0.403, F# 10 (`dotnet fsi` 15.2.403.0). Dossier de preuves HORS des dépôts :
`D:\outils-b4\fsharp\preuves\` (`p01-03.fsx`, `erreurs-cas.js` + `erreurs.js` qui lance chaque
cas dans son propre script, `fscheck.fsx`), et un projet jetable `D:\outils-b4\fsharp\projet\`
pour ce qui demande une vraie compilation (ordre des fichiers, `namespace`). FsCheck 2.16.6 se
charge par `#r "nuget: FsCheck, 2.16.6"` (le réseau répond).

**Erreurs classiques EXÉCUTÉES avant l'écriture** (sorties dans `D:\outils-b4\fsharp\preuves\erreurs.out`).
N'emploie dans un distracteur que celles que TA leçon établit :

| croyance fausse | ce que F# 10 rend |
|---|---|
| `x = 6` réaffecte une valeur liée | comparaison : `false`, `x` vaut toujours 5 ; dans une fonction, avertissement FS0020 « le résultat … a le type bool et est implicitement ignoré » |
| `age <- 40` marche sur un `let` simple | erreur FS0027 « Cette valeur n'est pas mutable » |
| `var x = 0` déclare une variable | erreur FS0039 « La valeur ou le constructeur 'var' n'est pas défini » |
| on mélange `1 + 2.0` | erreur FS0001 « Le type 'float' ne correspond pas au type 'int' » |
| `int -> int -> int` rend trois entiers | `f 1 2` est un `int` (FS0001 si on attend `int * int * int`) ; `somme 2` est une fonction |
| `ada.Age <- 37` sur un record | erreur FS0005 « Ce champ n'est pas mutable » ; `{ ada with Age = 37 }` laisse `ada` intact |
| un match incomplet ne compile pas | il COMPILE avec l'avertissement FS0025 et lève `MatchFailureException` à l'exécution sur le cas oublié |
| un `_` placé tôt est refusé | avertissement FS0026 « Cette règle n'aura aucune correspondance » |
| `Option.get None` rend une valeur par défaut | `System.ArgumentException` « La valeur de l'option est Aucun » |
| `Int32.TryParse` rend une option | il rend un tuple : `(true, 12)` / `(false, 0)` |
| `Async.Parallel` exige un cœur par tâche | trois `Async.Sleep 1000` : **1,02 s** avec `DOTNET_PROCESSOR_COUNT=1` ; `Async.Sequential` : 3,03 s |
| un `async` démarre à sa création | rien ne s'affiche avant `Async.RunSynchronously` ; relancé deux fois, il s'exécute deux fois ; un `task` démarre aussitôt |
| `let!` s'écrit hors d'un bloc | erreur de syntaxe (FS0010) |
| `return` émet un élément dans `seq { }` | erreur FS0635 « les résultats sont générés à l'aide de 'yield' » |
| un `Error` dans `result { }` laisse continuer | les étapes suivantes ne s'exécutent pas, `Error "…"` ressort tel quel (builder minimal exécuté) |
| `Seq` trie ou matérialise tout | `Seq.map` n'est calculé qu'à la demande (`Seq.head` : 1 calcul sur 5) ; ordre conservé |
| nom de cas d'active pattern en minuscule | erreur FS0623 |
| `type Statut = string \| int` | erreur FS0053 (cas d'union en minuscules) |
| `let (Entier n) = "abc"` | FS0025 puis `MatchFailureException` |
| `printfn "%d" nom` avec une chaîne | erreur FS0001 à la compilation |
| tabulation d'indentation | erreur FS1161 « TABs are not allowed in F# code » |
| fichiers du `.fsproj` dans l'ordre inverse | erreur FS0039 « L'espace de noms ou le module 'Domaine' n'est pas défini » |
| un `let` directement sous un `namespace` | erreur FS0201 « Les espaces de noms ne peuvent pas contenir de valeurs » |
| FsCheck essaie « des centaines » de cas | `Check.Quick` : **100** cas (« Ok, passed 100 tests », `Config.Quick.MaxTest = 100`) |

⚠️ `begin … end` EXISTE en F# (exécuté : `begin x + 1 end` compile et rend 2). Ne l'emploie pas
comme une syntaxe inexistante.

---

## Pourquoi ce travail — mesure de départ (`node tools/mesure-biais-qcm.js --seul=fsharp`)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **96,8 %** | 98,1 % | 98,1 % |
| la plus détaillée | **82,9 %** | 79,6 % | 95,3 % |
| le mot technique exclusif | **75,9 %** | 70,4 % | 92,1 % |
| RESTREINDRE à la parenthèse | **74,1 %** | 72,2 % | 92,3 % |
| l'incise entre parenthèses | **73,6 %** | 66,7 % | 97,2 % |
| ponctuation forte (seule / RESTREINDRE) | **70,8 % / 71,3 %** | 61,1 % | **100,0 %** |
| RESTREINDRE aux deux-points | **58,8 %** | 44,4 % | **100,0 %** |
| l'écho de la question | **54,8 %** | 44,4 % | 87,5 % |
| ECARTER la moins bavarde | **50,0 %** | 16,7 % | **100,0 %** |
| le point-virgule (seul / RESTREINDRE) | **43,1 %** | 24,1 % | **100,0 %** |

**48 questions sur 54 (88,9 %)** trahies par 5 indices ou plus. Bonne réponse **114,0 caractères**
en moyenne, distracteur **26,1** : rapport **4,36** (le plus haut avec `bash`). Rangs
**53 / 1 / 0 / 0**, cible **14 / 14 / 13 / 13** ; `plan-rangs-qcm` demande **12 010 caractères**
sur **53 questions sur 54**. Biais inverse : **4 alertes** (rangs 2, 3, 4 et « la moins bavarde »).

### Les NEUF tics de lot (`node tools/mesure-tics-lot.js fsharp --exemples`) — le record du site

| tic | bonnes / distr. | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **25 / 1** | 24 | **100,0 %** | **58,3 %** |
| **point-virgule médian** | **13 / 0** | 13 | **100,0 %** | **43,1 %** |
| **glose finale entre parenthèses** | **12 / 2** | 14 | 85,7 % | **40,7 %** |
| « à la » | 6 / 1 | 7 | 85,7 % | 32,9 % |
| « ce qui » | 5 / 0 | 5 | 100,0 % | 31,9 % |
| adverbe de reprise (alors/ensuite/puis) | 4 / 0 | 4 | 100,0 % | 30,6 % |
| « la valeur » | 5 / 4 | 7 | 57,1 % | 29,2 % |
| « et le » | 3 / 1 | 4 | 75,0 % | 28,7 % |
| « la compilation » | 3 / 1 | 4 | 75,0 % | 28,7 % |

Le gabarit des bonnes réponses est « réponse : explication », « réponse ; conséquence » ou
« réponse (glose) » : **les distracteurs prennent le MÊME gabarit**, avec un contenu qui énonce
une erreur — jamais une parenthèse ou une queue de phrase de remplissage.

### Mots fétiches (`node tools/mesure-mot-fetiche.js fsharp`) : 3 alertes
`valeur` (9 bonnes / 7 distracteurs, RESTREINDRE 33,3 %), `match` (6 / 2, 32,4 %), `fonction`
(6 / 5, 30,1 %) ; sous le seuil mais à surveiller : `fonctions` 6 / 1, `quand` 6 / 1, `argument`
5 / 1, `option` 5 / 1. **Pose ces mots dans les distracteurs des questions où la bonne réponse
les porte**, là où ils ont un sens ; et `parce` est déjà un mot de distracteur (7 / 17) : ne
commence un distracteur par « Parce que » que si la bonne réponse commence ainsi.

### Lexique (`node tools/mesure-lexique-qcm.js --liste=fsharp`)
**49 exploitables, 26 retournées, 50 à mettre en forme sur 54.** Règle du `k` (compté en
OCCURRENCES, comme l'outil) : les quatre options portent le même nombre de mots de 6 lettres et
plus ABSENTS de la page (la page entière hors blocs de quiz). Règle du `w` : quand `k > 0`, les
quatre portent aussi le même nombre de mots de 6+ lettres. Le levier : un mot de moins de 6
lettres ne compte ni dans `w` ni dans `k` ; l'apostrophe et le tiret collent (`l'immuabilité`
est UN jeton). Le moyen le plus sûr de tenir `k` : **reprendre dans les distracteurs les mots
étrangers de la bonne réponse** (ils cessent du même coup d'être exclusifs).

### Mot technique exclusif (75,9 %) et intrus lexical (`mesure-mot-question`)
Chaque mot de **9 lettres et plus** est porté par **au moins deux** options (ou par aucune) :
reprends ceux de la bonne réponse dans un ou plusieurs distracteurs, et ne laisse aucun
distracteur seul porteur d'un mot de 9+ lettres. Pour l'intrus (mots de 5+ lettres), évite
qu'un mot soit porté par **exactement trois** options.

---

## La règle qui prime sur toutes les mesures

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**
> Si tu ne peux pas dire en une phrase *pourquoi c'est faux*, ce n'est pas un distracteur.

Test de recevabilité pour CHAQUE distracteur : (1) l'erreur se nomme en une phrase ; (2) chaque
proposition a un référent ; (3) un débutant crédule pourrait le cocher ; (4) aucune parenthèse
ni queue de phrase de remplissage ; (5) aucune conjonction sans logique ; (6) aucun comportement
de F# annoncé sans avoir été EXÉCUTÉ (table ci-dessus).

⚠️ Le piège propre à ce cours : F# est **pragmatique** (objet et impératif permis, `begin/end`
existe, `mutable` existe, l'interop C# renvoie des `null`) — un distracteur « F# interdit X » est
souvent VRAI pour une autre forme de X. Tiens-toi à des erreurs de FAIT vérifiables contre la
page de TA leçon et contre l'exécution. **Préfère une erreur classique et nette à une élégance
mesurée.**

## Ce que tu tiens, question par question (`diag.js` le vérifie)

1. **Longueur et rangs** : la bande de caractères de `plan-rangs-qcm` pour chaque option et le
   rang visé de la bonne réponse ; le rang en MOTS suit le rang en caractères.
2. **Marques — les quatre ou aucune** : `;`, `:`, incise entre parenthèses (même NOMBRE
   d'incises), glose finale, tiret cadratin, `/`, « », flèche `->`, point interne (« ex. L… »
   compte : un point suivi d'une espace et d'une majuscule). ⚠️ Le CODE porte des marques :
   `(|X|_|)` est une parenthèse, `int -> int` une flèche, `Pair/Impair` une barre oblique.
3. **Nombre de `, : ;`** voisin de celui de la bonne réponse (« la plus détaillée » 82,9 %).
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre options.
5. **Attaque** : les quatre options commencent par le même type de mot, ou par quatre mots
   différents — jamais trois pareils et un intrus. **Casse initiale** : si la bonne réponse
   commence par du code en minuscule (`yield`, `|>`), les distracteurs aussi.
6. **Absolus** (toujours, jamais, uniquement, seulement, aucun, impossible, rien…) : pas dans un
   distracteur si la bonne réponse n'en porte pas. **Prudents** (peut, permet, souvent, selon,
   plutôt, notamment…) et **négation** (ne, pas, n', aucun, rien, ni, non) : les quatre ou aucune.
7. **Majuscule d'emphase** (`ET`, `OU`, `PEUT`… hors sigles) : même nombre partout.
8. **Fin d'option** : aucune ne finit par `.`, `!` ou `?` (attention à `yield!`, `let!`).
9. **Densité** : allonger avec le vocabulaire technique de la leçon, pas avec des chevilles —
   mais sans que la bonne réponse devienne systématiquement la moins dense. Mesurée en fin de
   vague, dosée par calcul.

## L'ordre de travail
1. Relire la leçon entière (le corps fixe le vocabulaire et ce qui est vrai).
2. Écrire les trois erreurs en une phrase chacune, les exécuter si elles portent sur F#.
3. Rédiger au gabarit de la bonne réponse, dans la bande ; passer `diag.js`, corriger.
4. Poser par `pose.js --ecrire`, mesurer le cours entier, COMMITER le lot.
