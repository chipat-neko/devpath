# LE NNᵉ COURS — `vb` (« Visual Basic »), 88,1 % → 25,4 %

Traité le 2026-11-10 en parallèle des huit autres cours, par un agent seul (vague, dosage,
relecture et contre-relecture faits par lui), sur la branche **`b4/vb`** de la copie
`D:\test-claude-b4\vb`. 14 leçons, **59 questions dont 12 de bilan** (`lecon-14`).
Consigne versionnée : `scratchpad/CONSIGNE-VB.md` (dialecte par leçon, table de 19 erreurs
classiques exécutées, fautes de corps repérées avant la vague).

Commits (dans l'ordre) : `18172d1` (vague, lot 1 : leçons 01-03), `b323cf2` (consigne + lot 2 :
04-06), `824db2a` (lot 3 : 07-09), `868a8be` (lot 4 : 10-11), `32e8149` (lot 5 : 12-13),
`6c61810` (lot 6 : 14), `c611a74` (dosage), `5473a91` (relecture), `836ee0d` (contre-relecture),
puis ce rapport.

⚠️ **À savoir avant de fusionner : la copie de travail était en CRLF.** `core.autocrlf=true` dans
la configuration partagée du dépôt : le `git worktree add` a sorti les fichiers en CRLF alors que
l'index est en LF. `pose.js` et `remplace.js` refusent le CRLF ; j'ai donc converti en LF les seuls
fichiers `pages/vb/*.html` de MA copie (`sed 's/\r$//'`), ce qui ne change rien pour git (blob
identique, `git diff --stat` vide avant toute écriture). Les autres agents ont très probablement
la même situation. Aucun fichier sous `D:\test-claude\` n'a été modifié.

## 1. Quel Visual Basic, leçon par leçon

| leçon | dialecte | exécuté ici |
|---|---|---|
| 01 | VBA et VB.NET (présentation des deux) | VB.NET oui, VBA non |
| 02, 04, 05 | socle commun écrit « à la VBA » (`MsgBox`, appel de Sub sans parenthèses, `Variant`, `Dim t(1 To 5)`) | la part commune, sous VB.NET ; le propre à VBA par la documentation Microsoft |
| 03 | socle commun, exemples mêlés (`MsgBox` VBA, initialiseur `{…}` VB.NET) | idem |
| 06 | VBA (`Collection`, `Scripting.Dictionary`, `On Error`) puis VB.NET (`Try/Catch`) | VB.NET oui |
| 07 | VBA pour Excel | **non** (aucun Excel) |
| 08 | VB.NET, Windows Forms | oui, l'événement rejoué en console (`WithEvents` + `Handles`) |
| 09 | outils et écosystème | non (faits d'outils, raccourcis d'Excel) |
| 10 à 14 | VB.NET seul | **oui** |

VB.NET : `dotnet` 10.0.403, projets console jetables **hors dépôt**
(`C:\Users\chipat\AppData\Local\Temp\claude\78f57d26372443c6\8835b37e-6675-4c86-aae2-b0139291affe\scratchpad\vbnet\`,
lanceur `run.sh fichier.vb [Strict On|Off] [Explicit On|Off]`, chaque essai avec sa sortie `*.out`),
culture fr-FR forcée quand l'affichage en dépend. VBA : documentation Microsoft
(learn.microsoft.com/office/vba : *Passing arguments efficiently*, *Calling Sub and Function
procedures*, *Call statement*, *Option Explicit*, *For Each…Next*, *Val*, *Type conversion
functions*), écrit « non exécuté » partout où c'est le cas.

## 2. Avant / après

| indice | avant | après | commande |
|---|---:|---:|---|
| « la plus longue » | **88,1 %** (couv. 98,3 %, rend. 89,7 %) | **25,4 %** (rend. 25,4 %) | `node tools/mesure-biais-qcm.js --seul=vb` |
| pire des 44 stratégies | 88,1 % | **27,1 %** (« la seule qui nie », 2 questions tranchées sur 59) | idem |
| la plus détaillée | 67,8 % | 25,4 % | idem |
| l'incise entre parenthèses | 62,9 % | 25,1 % | idem |
| le mot technique exclusif | 57,3 % | 25,8 % | idem |
| ECARTER la moins bavarde | 52,5 % | 23,2 % | idem |
| ponctuation forte (seule / restreindre) | 47,9 / 48,7 % | 25,0 / 25,0 % | idem |
| l'écho de la question | 44,1 % | 24,3 % | idem |
| la plus dense / la moins bavarde | 24,6 / 2,3 % (inverse) | 23,7 / 25,4 % | idem |
| questions trahies par 5 indices ou plus | 37 (62,7 %) | **1** (`lecon-14` bilan « Console.WriteLine ») ; 50 à 0–2, 8 à 3–4 | idem |
| rangs de la bonne réponse | 52 / 5 / 1 / 1 | **15 / 15 / 15 / 14** (visés 15/15/15/14) | `node tools/plan-rangs-qcm.js vb` |
| biais inverse | 5 alertes | **0** (pire : la moins bavarde, 26,3 %) | `node tools/mesure-biais-inverse.js --toutes vb` |
| lexique | 44 exploitables, 22 retournées, 46 à mettre en forme | **0 / 0 / 0** | `node tools/mesure-lexique-qcm.js --liste=vb` |
| intrus lexical (DEFAUT d / i ; EXCES d / i ; sûres) | 23,3 / 25,6 ; **33,2** / 17,7 ; 4 sûres | 16,1 / **28,0** ; 20,1 / 25,7 ; **0** | `node tools/mesure-mot-question.js vb` |
| mot fétiche | 0 alerte | 0 alerte | `node tools/mesure-mot-fetiche.js vb` |
| tics de lot | **8** (glose finale 18/3, deux-points 11/0, point-virgule 9/2, parenthèse à article 5/0…) | **0** | `node tools/mesure-tics-lot.js vb --exemples` |
| point interne | 1 question (rend. 100 %) | 0 | `node tools/mesure-point-interne.js` |

Mesures brutes : `scratchpad/vb-depart/` et `scratchpad/vb-final/` (hors git).

**Distracteurs : 170 réécrits sur 177, 7 gardés** (`lecon-02` q1 « Dim n Integer » ; `lecon-06` q1
« -1 » et « Au choix » ; `lecon-12` q1 « File.AppendAllText » et « File.ReadAllText » ;
`lecon-14` bilan « def … end » et « Imports System » — déjà justes de forme et de fond).
Longueur moyenne d'un distracteur **19,2 → 74,6 caractères** (bonne réponse : 71,8) ; **13 118
caractères** écrits dans les distracteurs réécrits (gain net 9 804 ; le plan en demandait 7 941).

## 3. Fautes de fond

**Aucune bonne réponse prouvée fausse.** Deux sont « datées ou discutables », signalées et non
touchées : `lecon-04` q3 (« il n'y a pas de return en VBA classique » — VBA a bien un `Return`,
celui de `GoSub`, mais aucun qui renvoie une valeur) ; `lecon-06` q3 (« Finally s'exécute
toujours » — sauf arrêt brutal du processus, simplification d'usage).

**Trois `explain` corrigés après preuve** (atteintes délibérées, `mesure-qcm-intouchable vb a6a45f2` :
3 atteintes, toutes des explications) :
- `lecon-01` q3 : « + pourrait tenter une addition si les opérandes *ressemblent à des nombres* » —
  exécuté : `"1" + "2"` donne `"12"`, `"1" + 2` donne `3` ; c'est un opérande NUMÉRIQUE qui
  déclenche l'addition ;
- `lecon-01` q1 : « VB.NET … sans lien avec Office » — la solution de l'exercice 3 de la même page
  dit qu'il peut piloter Office → « hors d'Office » ;
- `lecon-11` q2 : « y ajouter un autre type est refusé dès la compilation » — exécuté : sous
  Option Strict **Off** (le défaut d'un projet VB), `fruits.Add(42)` compile et range `"42"` ;
  seul Option Strict **On** refuse (BC30512).

**Corps de leçon : 19 fautes corrigées à la relecture (20 règles de remplacement, `scratchpad/vb-corr/corps1.js`),
7 reprises à la contre-relecture.** ⚠️ Le message du commit `5473a91` annonce « 21 fautes de
corps » : décompte fait trop vite, le bon est 19. Les plus nettes :
- **deux blocs de code donnés en modèle ne compilaient pas** — `lecon-06` : `r = 10 \ 0` (BC30542,
  division par zéro entre deux constantes), rejoué avec `Dim diviseur As Integer = 0` : « Erreur :
  Attempted to divide by zero. » puis « Terminé (toujours exécuté). » ; `lecon-14`, solution de
  l'exercice 1 : `For Each p In stock.Where(Function(p) …)` (BC36641, le paramètre lambda masque la
  variable de boucle), rejoué avec `Function(x)` dans le programme complet de la page (menu, CSV,
  rechargement, sous Option Strict On et fr-FR) ;
- `lecon-06` : un bloc VBA (`New Collection`, `.Add` sans parenthèses) appelait `Console.WriteLine`,
  qui n'existe pas en VBA → `Debug.Print f` (non exécuté) ;
- `lecon-04` : « ByVal … mode par défaut » (mémo, glossaire, récap) dans une leçon écrite pour VBA,
  où le défaut est **ByRef** (source Microsoft : « All arguments are passed to procedures by
  reference, unless you specify otherwise ») ; en VB.NET, ByVal (exécuté : un paramètre sans
  mot-clé laisse `x` à 42) ; et « les Function prennent toujours des parenthèses » — faux en VBA
  (source : une Function dont on ignore la valeur s'appelle comme une Sub), « MaSub(arg1, arg2) …
  change le sens pour un seul argument » réécrit (sans `Call`, deux arguments entre parenthèses
  sont refusés) ;
- `lecon-02` : « Par défaut, Visual Basic permet d'utiliser une variable sans la déclarer » — vrai
  en VBA, faux en VB.NET (exécuté : BC30451 dans un projet `dotnet new console -lang VB` sans
  réglage) ;
- `lecon-05` : `Dim t(1 To 5)` présenté sans dire « VBA » (VB.NET : BC32059) ; un message d'erreur
  cité entre guillemets qui n'est celui d'aucune version ; et `CDbl(Trim("1250.50"))` dans un
  « Cas réel » d'import : sous fr-FR, VB.NET lève InvalidCastException (exécuté) et VBA suit les
  réglages régionaux (source) → `Val`, qui lit toujours le point (source ; `Val("1250.50")`
  donne 1250,5 exécuté sous VB.NET) ;
- `lecon-12` : `Environment.CurrentDirectory` donné pour le dossier de l'application — exécuté :
  c'est le dossier de travail, `AppContext.BaseDirectory` est celui de l'application ;
- `lecon-13` : « n'utilise *jamais* Try/Catch … teste File.Exists » contredisait les leçons 12 et
  14, qui attrapent `FileNotFoundException` au premier lancement ; « jamais un Catch vide »
  contredisait leurs Catch vides voulus ;
- `lecon-03` : l'exemple `For Each` est du VB.NET (initialiseur `{…}`, variable `String`) — en VBA la
  variable d'un For Each sur un tableau doit être un Variant (source) ;
- `lecon-08` / `lecon-09` : « tout ce que l'un fait, l'autre le fait aussi » (VB.NET et C#) et
  « équivalents en puissance » — C# seul reçoit les nouveautés du langage (annonce Microsoft de
  2020) ; `lecon-08` renvoyait à la leçon 6 pour `TryParse` (vu en leçon 14) ;
- `lecon-09` : openpyxl lit et écrit des classeurs, il ne pilote pas Excel ;
- `lecon-11` : « tous villes confondues ».

**Exercices : 7 corrigés** — 3 listes `accept` qui validaient une réponse fausse pour la question
posée (`(2)` pour « le mot-clé », `UCase` pour « la fonction qui extrait », `Button1_Click` pour
« le mot-clé qui lie »), 1 qui acceptait le mot du placeholder (`Catch`), 3 indices qui donnaient
la réponse (`Long`, `New`, « Comme WHERE en SQL »). Rejoué avec `normExo` de `js/lecon.js`
(`exos-tous.js`, `fuites-larges.js` : 6 fuites larges → 1, celle qui reste est un choix binaire
« VBA ou VB.NET ? »).

**Contre-relecture : 7 corrections fautives ou incomplètes sur 33 reprises (21,2 %)** — dans la
fourchette des cours précédents (12,8 à 29,0 %), et toutes de MES corrections : un absolu déplacé
(« le tableau se remplit case par case » : VBA a `Array` et `Split`), une correction posée à
2 endroits sur 3 (`Dim t(1 To n)` sans « VBA » au récapitulatif), une affirmation non exécutée
écrite comme exécutée (« CDbl refuse 1250.50 » en VBA → « ne le lit pas comme 1250,5 »), un
« c'est pourquoi » qui prêtait aux leçons 12 et 14 une raison qui n'est pas la leur, « jamais un
Catch vide », et l'absolu « équivalents en puissance » corrigé en leçon 08 mais resté en leçon 09
(corps et solution d'exercice).

Après chaque passe : `node scratchpad/vb-sonde/controle.js --ref=c611a74` → **0 indicateur
déplacé** sur 59 questions (les 44 stratégies + `w` + `k`), `kdiff.js` : aucun mot de 6+ lettres
entré ni sorti du vocabulaire des pages.

**Ce qui a été exécuté** (VB.NET 10, 14 programmes) : toutes les bonnes réponses des leçons 01-06
et 08-14 qui portent sur le langage, et la fausseté de chaque distracteur qui annonce un
comportement (`2 & 3` donne `"23"`, `6 & 3` donne `"63"`, `For Each … Step` refusé, affecter la
variable de `For Each` laisse le tableau intact, une Function appelée seule compile, ReDim Preserve
ne trie ni n'efface, Split rend un tableau de base 0, le code après `End Try` n'est pas atteint
quand aucun Catch ne correspond, une interface refuse champ et code (BC30602, BC30603), héritage
multiple refusé (BC30121), `New` sur MustInherit refusé (BC30569), KeyNotFoundException,
ArgumentException sur `Add` d'une clé existante, exécution différée de LINQ, fichier vide lu sans
exception, fichier verrouillé → IOException et non FileNotFoundException, `stock.Count(Function…)`
sur une List refusé (BC32016), `String.Format(";", …)` rend « ; », `Double.TryParse("1.5")` rend
False sous fr-FR, Path.Combine ne crée aucun dossier) ; les solutions des exercices des leçons 10,
11, 13 et 14 ; le programme complet de la leçon 14 avec une saisie scriptée.
**Non exécuté** : tout ce qui est propre à VBA et à Excel (leçon 07 entière, `Collection` et
`Scripting.Dictionary` de VBA, `On Error`, `Debug.Print`, ByRef par défaut, appels sans
parenthèses, `Dim t(1 To 5)`, `CDbl` et `Val` de VBA, l'erreur 9), Windows Forms (concepteur,
`Label1.Text`), les raccourcis d'Excel et de Visual Studio (Alt+F11, Alt+F8, F9/F10/F11) — vérifiés
sur la documentation Microsoft ou laissés tels quels quand ils n'étaient pas en cause.

## 4. Les leçons de ce cours

1. **Un cours à deux dialectes cache ses fautes dans le « Visual Basic » générique.** Sur les 19
   fautes de corps, 7 sont vraies dans un dialecte ou sous un réglage et fausses dans l'autre
   (défaut de ByVal, Option Explicit, `Dim t(1 To 5)`, `Console.WriteLine` en VBA, initialiseur
   `{…}`, parenthèses des Function en VBA, Option Strict), et une dépend de la culture du poste
   (`CDbl`). Exécuter VB.NET ne suffit pas : il faut aussi CHERCHER, phrase par phrase, à quel
   dialecte elle s'applique.
2. **La vague fabrique l'intrus lexical inverse.** En reprenant les mots de la bonne réponse dans
   les distracteurs (pour tenir `k`, `w` et le mot technique exclusif), j'ai laissé 14 bonnes
   réponses sans AUCUN mot propre : la lecture EXCES désignait alors les trois distracteurs,
   et l'écarter rendait **38,0 %** (départ : 17,7 %). Corrigé en rendant à chaque bonne réponse
   un mot exclusif (de préférence de 5 lettres, qui ne compte ni dans `w` ni dans `k`). La règle
   « les quatre options portent le mot, ou aucune » doit être lue avec son corollaire : **chaque
   option, bonne réponse comprise, garde au moins un mot à elle.**
3. **Le dosage de densité et de nombre de mots se règle en RESSERRANT un distracteur** (retirer
   2 ou 3 mots courts), pas en l'allongeant : 32,2 % → 23,7 % pour la plus dense avec 5 retouches.
4. **Mon propre outil m'a trompé** : `atelier.js` lisait mal l'attribut `data-quiz-bilan`
   (alternance `quiz|quiz-bilan` dans le mauvais ordre) et présentait les 12 questions de bilan
   comme « hors plan ». Vu en écrivant le lot 6, corrigé avant d'écrire.

## 5. Ce qui reste

- **L'intrus lexical DEFAUT est à 28,0 % en lecture inverse, exactement au seuil d'alerte** (une
  question de plus le ferait passer) ; 21 questions y ont un mot porté par trois options sur
  quatre. **Une question** reste trahie par 5 indices (`lecon-14` bilan « Comment affiche-t-on
  en console ? » : `Console.WriteLine` est seule à porter un mot de 9 lettres et la plus dense ;
  tout distracteur plus dense serait plus long et changerait le rang).
- **« la seule qui nie » à 27,1 %** : deux questions où la bonne réponse et un seul distracteur
  nient (`lecon-12` q4, `lecon-14` q2).
- Laissé et dit : `lecon-07` exercice 3 demande `WorksheetFunction.Sum`, que la page n'enseigne
  nulle part, et son lien « Revoir « Les fonctions de feuille » » vise une section qui n'existe pas ;
  `lecon-06` affiche `MsgBox(ages.Exists("Bob")) ' True` (« Vrai » dans un Office français, non
  exécuté) ; 16 réponses lisibles dans l'énoncé visible et 14 libellés « Revoir « … » » qui
  affichent une réponse acceptée (convention du site entier, comme pour `bash` et `tests`).
- **Le message du commit `c611a74` annonce « la plus dense 32,2 % → 26,0 % et la moins bavarde
  29,0 % → 26,3 % »** : chiffres écrits avant la mesure. Les bons, au même commit : **23,7 %** et
  **25,4 %**.
- À faire par l'orchestrateur à la fusion : régénérer les index (`verif-donnees` I18 : 8 erreurs
  attendues, toutes « index périmés », dont `quiz-index.js` +9 845 octets), refiger les cliquets
  (`verif-qcm-biais.js --ecrire` avec `vb` marqué `traite` : longueur 25,4 %, pire indice 27,1 % ;
  `verif-qcm-lexique.js --ecrire`).

## 6. Contrôles de clôture

`verif-html` **0** ; `verif-rendu` sur les **15 pages** du cours (14 leçons + `cours.html`, 90
mesures) : **0 erreur, 0 avertissement** ; 29 blocs JSON (quiz, bilan, exos) valides ; 0 CR, 0 BOM,
0 chargement externe ; `verif-donnees` : 8 erreurs, **toutes I18 (index périmés, attendues)**, et
3 avertissements anciens (I17 `zig`, I19 pages d'étude, I25 `doc`) ; `mesure-qcm-intouchable vb
a6a45f2` : 3 atteintes, toutes délibérées (explications ci-dessus) ; `verif.js --rapide` : voir
§ 7.

## 7. `verif.js --rapide` (sortie complète : `scratchpad/vb-final/verif-rapide.txt`, hors git)

53 étapes jouées en 599,6 s ; **10 signalent, 1 n'a rien pu mesurer — toutes expliquées** :
- **attendues par la consigne** : `donnees` (I18, index périmés), `qcmbiai` et `qcmlexi` (le cours
  `vb` a progressé sans que le gain soit figé) ;
- **pages dérivées qui publient des mesures du site, que cette passe a fait bouger** (à
  réassembler par l'orchestrateur, je n'y touche pas) : `etudes` et `etude-6`
  (`pages/etude-inconnu.html` : le décompte des blocs de code a changé, une ligne ajoutée au bloc
  `trycatch.vb` de `lecon-06`) et `normatf` (`pages/doc/lecon-03.html` : S3 et S4 recomptés sur le
  corpus de QCM, « 59 / 89 cours » etc.) ;
- **artefacts du CRLF de la copie de travail** (voir l'avertissement en tête) : `moteurs`
  (`build-sources-worker.js` : longueurs de chaînes faussées par les `\r`), `maths` (58
  divergents), `rj-cpp` (12 blocs « introuvables »), `doc-ref`, et `verif-sql-exos` (« fin de
  JUGE_SQL introuvable », rien mesuré). **Rejoués sur un export LF du commit (`git -c
  core.autocrlf=false archive HEAD` dans un dossier temporaire hors dépôt) : code 0 pour
  `rejoue-cpp`, `build-sources-worker`, `maths/verif-verite`, `doc/verif-doc` ; `verif-sql-exos`
  mesure (39 contre-requêtes, 0 faute).** Seuls `verif-etudes`, `verif-normatif` et
  `etude-inconnu` y restent rouges, pour la raison « pages dérivées » ci-dessus.
