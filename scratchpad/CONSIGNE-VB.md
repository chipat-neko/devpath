# Consigne d'écriture — les QCM du cours `vb` (B4, cours traité en parallèle, branche `b4/vb`)

Préparée le 2026-11-10 par l'agent du cours `vb`, seul sur sa copie (`D:\test-claude-b4\vb`). Mesures
de départ archivées hors git dans `scratchpad/vb-depart/` (`biais.txt`, `rangs.txt`/`rangs.json`,
`lexique.txt`, `motq.txt`, `fetiche.txt`, `tics.txt`, `inverse.txt`, `questions.txt` : les 59
questions à plat). Sondes copiées de `tests-sonde` et repointées sur `pages/vb/`
(`scratchpad/vb-sonde/`, `vb-corr/`, `vb-contre/moi/`, `vb-relecture/moi/`), plus deux outils
neufs : `atelier.js` (une question à la fois : rang visé, mots, w/k, mots de 9+ lettres
exclusifs, écho, marques, absolus, tics, intrus, et les 44 stratégies qui tranchent) et
`vocab.js` (les mots de 6+ lettres du corps d'une leçon, ceux qui ne comptent pas dans `k`).

Le cours : « Visual Basic », 14 leçons, **59 questions dont 12 de bilan** (`lecon-14`).

## 0. QUEL VISUAL BASIC, LEÇON PAR LEÇON — à dire, jamais à mélanger

| leçon | dialecte enseigné | s'exécute ici ? |
|---|---|---|
| 01 | les deux visages (VBA + VB.NET), socle commun | VB.NET oui ; VBA non |
| 02, 04, 05 | socle commun écrit à la VBA (`MsgBox`, appel de Sub sans parenthèses, `Variant`, `Dim t(1 To 5)`) | la part commune oui, sous VB.NET ; le propre à VBA non |
| 03 | socle commun, exemples mêlés (`MsgBox` VBA, `Console.WriteLine` et initialiseur `{…}` VB.NET) | idem |
| 06 | VBA (`Collection`, `Scripting.Dictionary`, `On Error`) puis VB.NET (`Try/Catch`) | VB.NET oui |
| 07 | VBA pour Excel (`Range`, `Cells`, `.Select`, `Workbook_Open`) | **non** (pas d'Excel) |
| 08 | VB.NET, Windows Forms et événements | VB.NET oui (événement rejoué en console avec `WithEvents`) |
| 09 | outils et écosystème (éditeur VBA, Visual Studio, C#) | non (faits d'outils) |
| 10 à 14 | VB.NET seul (POO, génériques, LINQ, fichiers, débogage, projet) | **oui** |

VB.NET s'exécute : `dotnet` 10.0.403, projets console jetables hors dépôt
(`…\scratchpad\vbnet\run.sh fichier.vb [Strict On|Off] [Explicit On|Off]`). Ce qui relève de VBA
ou de VB6 se vérifie dans la documentation Microsoft (learn.microsoft.com/office/vba) et s'écrit
« non exécuté ». **Ne jamais présenter un comportement VB.NET comme valable en VBA, ni l'inverse.**

### Table des erreurs classiques — EXÉCUTÉE avant d'écrire (VB.NET 10, culture fr-FR)

| croyance fausse | ce que VB.NET rend |
|---|---|
| `&` additionne des nombres | `2 & 3` donne `"23"` (String), `6 & 3` donne `"63"` ; `6 And 3` donne 2 |
| `+` additionne dès que les chaînes « ressemblent à des nombres » | `"1" + "2"` donne `"12"` ; `"1" + 2` donne 3 (Double) : c'est un opérande NUMÉRIQUE qui déclenche l'addition |
| `\` arrondit au plus proche | `7 \ 2` donne 3 ; `-7 \ 2` donne -3 (troncature) ; `7.6 \ 2` donne 4 (l'opérande Double est arrondi AVANT) |
| `Do … Loop Until` boucle tant que c'est vrai | il s'arrête quand la condition devient vraie (3 tours pour `k >= 3`) |
| affecter la variable de `For Each` modifie le tableau | le tableau reste `1,2,3` |
| `For Each … Step -1` | refusé : BC30205 « Fin d'instruction attendue » |
| `!=` teste l'inégalité | refusé : BC30203 « Identificateur attendu » |
| `Dim t(1 To 5)` marche en VB.NET | refusé : BC32059 « Les limites inférieures du tableau ne peuvent être que '0' » (valable en VBA seulement) |
| un paramètre sans mot-clé est passé ByRef | en VB.NET, **ByVal** (x reste 42) ; en VBA c'est **ByRef** (source Microsoft, non exécuté) |
| `Doubler x` sans parenthèses en VB.NET | refusé : BC30800 « Les arguments de méthode doivent être mis entre parenthèses » |
| Option Explicit est désactivée par défaut | en VB.NET elle est **active** par défaut (BC30451 sur `totl`, projet `dotnet new` sans réglage) ; en VBA elle est absente tant qu'on ne l'écrit pas |
| `List(Of String)` refuse un nombre à la compilation | sous Option Strict **Off** (défaut), `fruits.Add(42)` compile et range `"42"` ; sous **On** : BC30512 |
| `Dim n As Integer = "42"` refusé partout | Strict Off : compile, `"abc"` lève InvalidCastException à l'exécution ; Strict On : BC30512 |
| `10 \ 0` lève une exception | avec deux CONSTANTES, refus de compiler : BC30542 ; avec une variable : DivideByZeroException ; `10.0 / 0.0` donne Infinity |
| `CDbl("1250.50")` donne 1250,5 partout | sous fr-FR : InvalidCastException ; `Val("1250.50")` donne 1250,5 |
| un Catch général en tête ne gêne pas | avertissement BC42029, le Catch spécifique n'est jamais atteint |
| lire une clé absente d'un Dictionary rend Nothing | KeyNotFoundException ; `TryGetValue` rend False ; `Add` d'une clé existante : ArgumentException |
| une requête LINQ est calculée à sa déclaration | exécution différée : après `Add(99)`, `Count()` voit 4 éléments au lieu de 3 |
| `Environment.CurrentDirectory` = dossier de l'application | c'est le dossier de travail ; le dossier de l'application est `AppContext.BaseDirectory` |

## 1. Pourquoi ce travail (départ, `node tools/mesure-biais-qcm.js --seul=vb`)

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **88,1 %** | 98,3 % | 89,7 % |
| la plus détaillée | 67,8 % | 55,9 % | 100,0 % |
| l'incise entre parenthèses | 62,9 % | 49,2 % | 100,0 % |
| le mot technique exclusif | 57,3 % | 57,6 % | 76,5 % |
| ECARTER la moins bavarde | 52,5 % | 25,4 % | 93,3 % |
| la ponctuation forte (seule / restreindre) | 47,9 % / 48,7 % | 30,5 % | 100,0 % |
| l'écho de la question | 44,1 % | 25,4 % | 93,3 % |

**62,7 %** des questions (37 sur 59) trahies par 5 indices ou plus. Rangs 52 / 5 / 1 / 1, cible
15 / 15 / 15 / 14, **7 941 caractères** à écrire sur 49 questions (`plan-rangs-qcm.js vb`).
Tics de lot : glose finale entre parenthèses **18 / 3**, deux-points médian **11 / 0**,
point-virgule médian **9 / 2**, parenthèse ouverte par un article **5 / 0**. Lexique : **44
exploitables, 22 retournées, 46 à mettre en forme**. Intrus : 116 mots sur 27 questions.
Biais inverse : 5 alertes. Mot fétiche : 0 alerte.

## 2. Les règles (celles des 60 cours précédents, appliquées question par question)

1. **Un distracteur est une thèse fausse, précise, plausible** ; on dit en une phrase pourquoi
   elle est fausse, et ce qui s'exécute est exécuté. Trois erreurs différentes par question.
2. **Rang** : celui du plan, fenêtre de caractères comprise ; longueurs toutes différentes.
3. **Marques** : `;`, `:`, incise `(…)`, tiret, `/`, « », flèche, virgule décimale, point
   interne — les quatre options, ou aucune. Même nombre d'incises que la bonne réponse.
4. **Lexique** : `k` (mots de 6+ lettres absents du corps, en occurrences) égal sur les quatre ;
   `w` (mots de 6+ lettres) égal quand `k > 0`. Le levier : reprendre les mots étrangers de la
   bonne réponse dans les distracteurs, et piocher les autres dans `vocab.js`. ⚠️ l'apostrophe
   colle : `l'antislash`, `qu'une`, `d'indice` sont UN jeton.
5. **Mots de 9+ lettres** : partagés, ou un par option ; jamais l'exclusivité de la bonne.
6. **Écho de l'énoncé** : même nombre de mots repris (`atelier.js` les liste).
7. **Absolus, prudents, négation** : quatre porteurs, ou au moins trois ; jamais la bonne seule.
8. **Attaque** : même premier mot, ou quatre différents ; même casse initiale.
9. **Intrus** : aucun mot de 5+ lettres sur exactement trois options.

## 3. Ce qui a été trouvé AVANT d'écrire (corps de leçon, à corriger après la vague)

- `lecon-06` : l'exemple VB.NET `r = 10 \ 0` ne compile pas (BC30542) ; le bloc VBA de la
  Collection appelle `Console.WriteLine` (n'existe pas en VBA).
- `lecon-04` : « ByVal … défaut » (mémo, glossaire, récap) — faux en VBA, où le défaut est ByRef
  (source Microsoft) ; « Les Function, elles, prennent toujours des parenthèses » — faux en VBA
  (source Microsoft : appelée comme une Sub, une Function se passe de parenthèses).
- `lecon-02` : « Par défaut, Visual Basic permet d'utiliser une variable sans la déclarer » —
  vrai en VBA, faux en VB.NET (exécuté).
- `lecon-05` : `Dim t(1 To 5)` présenté sans dire « en VBA » (BC32059 en VB.NET) ; `CDbl` sur
  « 1250.50 » dépend des paramètres régionaux (InvalidCastException sous fr-FR en VB.NET).
- `lecon-11` : « y glisser un nombre est refusé à la compilation » — seulement sous Option
  Strict On (exécuté) ; « tous villes confondues ».
- `lecon-12` : `Environment.CurrentDirectory` donné pour le dossier de l'application (exécuté).
- `lecon-13` : « n'utilise jamais Try/Catch … teste If File.Exists » contredit `lecon-12` et
  `lecon-14`, qui attrapent FileNotFoundException au premier lancement.
- `lecon-14` : la solution de l'exercice 1 ne compile pas (BC36641 : le paramètre lambda `p`
  masque la variable de boucle `p`).
