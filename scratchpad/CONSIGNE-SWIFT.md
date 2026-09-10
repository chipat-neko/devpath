# Consigne d'écriture — les QCM du cours `swift` (B4, 37ᵉ cours)

Tu réécris **les distracteurs** des QCM d'un lot de leçons du cours `swift` (le langage Swift :
optionnels, `struct` contre `class`, protocoles et extensions, génériques, `guard`, ARC et cycles de
rétention, `Codable`, `async`/`await`, SwiftUI et son état, gestion d'erreurs `throws`).
La question, l'index `correct`, l'explication et **le texte de la bonne réponse** sont
**INTOUCHABLES** : `tools/mesure-qcm-intouchable.js <cours> <ref-git>` le contrôle et signalera
toute atteinte. Tu ne touches qu'aux **trois options fausses** de chaque question.

## Pourquoi

Un apprenant qui ne comprend rien au cours réussit **95,2 %** des QCM de `swift` en cochant
simplement **l'option la plus longue** — couverture **97,0 %**. C'est le cours le plus nocif des
**51** qui restent au-dessus de 60 %. **Ton lot doit ramener chaque indice à 25 %, l'étalon du
hasard.** On ne rend pas les questions plus difficiles : on rend les **distracteurs crédibles**.

## Ce que tu dois tenir, dans l'ordre d'importance

### (1) LA LONGUEUR — 95,2 %, couverture 97,0 %

`node tools/plan-rangs-qcm.js swift` donne, question par question, la **fenêtre de caractères**
visée pour chaque distracteur. **63 questions sur 66** sont à retoucher, soit **17 810 caractères**
à écrire — le plus gros volume d'un cours depuis le début de B4, devant `lua` (14 613). La bonne
réponse est **64 fois au rang 0** ; l'outil vise **17 / 17 / 16 / 16**.

⚠️ **VISE LA FENÊTRE, PAS « PLUS LONG »**. Écraser « la plus longue » ne fait que **déplacer** le
biais d'un rang : sur `sql`, la bonne réponse mise au rang 1 partout rendait **60,9 %** à qui
cochait « la deuxième plus longue ». C'est pour ça que l'outil demande une **répartition**.

⚠️ **SIMULE AVANT D'ÉCRIRE.** Compte les caractères en JS (`[...s].length`, un accent compte 1).
**La moitié des textes proposés sans simulation cassent la fenêtre.**

### (2) L'ÉCHO DE L'ÉNONCÉ — 58,3 %, rendement 86,2 %, 29 questions

⚠️ **RÈGLE RÉÉCRITE DEUX FOIS LE 2026-09-08, SUR `lua` — les deux premières formulations
fabriquaient l'indice, chacune à sa façon. Voici la troisième, et elle est PROUVÉE.**

**Première formulation, celle de la consigne de `lua`** : *« fais reprendre les mots de la question
par UN seul distracteur »*. Résultat mesuré après la vague : sur les **34 questions** où la règle
« choisir l'option qui reprend le plus de mots de l'énoncé » tranchait, la porteuse de l'écho était
un **mauvais** choix **33 fois**. Un apprenant qui l'ÉCARTE montait à **32,4 %** — et **aucun des 43
outils ne le voyait**, parce qu'ils ne mesuraient que le sens direct.

**Deuxième formulation, celle de l'incise apprise sur `java`** : *« autant de mots d'écho que la
bonne réponse, jamais plus »*. Elle ferme bien le sens inversé — mais elle laisse la bonne réponse
**ex æquo dans un ensemble de deux**, et qui restreint son tirage à ces deux options vaut **50 %**.
Mesure sur `lua` après la première volée : **30,7 %**, encore 5,7 points au-dessus de l'étalon, sur
**21 questions** où l'ensemble maximal comptait 1, 2 ou 3 options.

**LA TROISIÈME EST LA BONNE, ET C'EST UNE ÉGALITÉ, PAS UNE INÉGALITÉ : LES QUATRE OPTIONS PORTENT
LE MÊME NOMBRE DE MOTS D'ÉCHO.** La démonstration est arithmétique, pas empirique : avec un
ensemble maximal de taille `s` contenant la bonne réponse, le crédit vaut `1/s` ; il ne vaut
l'étalon `1/4` **que** si `s = 4`. Toute autre valeur est un cadeau.

**C'est exactement la forme des deux autres règles du chantier** — « par marque : les quatre ou
aucune », et `k / k / k / k` sur les mots étrangers à la page. Trois familles d'indices, trois fois
la même leçon : **une inégalité laisse toujours une lecture exploitable ; seule l'égalité ferme les
deux sens.**

Outil : `node tools/mesure-biais-inverse.js --toutes swift` — il mesure les **42 stratégies dans le
sens inverse** et alerte dès qu'une tranche sur ≥ 8 questions et rend ≥ 28,0 %. **Lis la colonne
GLOBAL**, pas la colonne INVERSE : c'est celle qui se compare aux 25,0 %. Et pour le sens direct,
la colonne « réussite » de `mesure-biais-qcm --seul=swift` **compte déjà les ex æquo au prorata** :
c'est elle qui a révélé les 30,7 % que la couverture (1,4 %) cachait.

⚠️ **UN MOT D'ÉCHO EST SOUVENT UN MOT LONG.** Le retirer fait tomber le compte de mots longs de
l'option et rouvre la **règle du `w`** ; l'ajouter peut introduire un mot **étranger à la page** et
rouvrir la règle du `k`. **Recompte `k` ET `w` après chaque retouche d'écho** — c'est arrivé deux
fois sur `lua`, sur la même question.

### (3) LA PONCTUATION FORTE EN UNION — 77,3 %, rendement **100 %**, 46 questions

Elle regarde l'**UNION** de trois marques : « `:` », « `;` » et le **tiret cadratin**. Sur `swift`
elle **tranche sur 46 questions et ne se trompe jamais**.

**La règle, et elle suffit à fermer aussi les marques prises une par une** : *par marque, ou les
quatre options la portent, ou aucune*.

Les marques isolées sur ce cours : point-virgule **68,2 %** (rendement 100 %), deux-points
**48,5 %** (91,3 %), barre oblique **33,0 %** (100 %), guillemets 27,3 % (100 %), majuscule
d'emphase 27,3 % (100 %), point interne 26,1 % (100 %). Toutes se ferment par la même règle.

### (4) LA PLUS DÉTAILLÉE — 85,2 %, rendement **100 %**

La bonne réponse ne doit pas être la seule à donner un exemple, un nom de type, un chiffre.
**Fais porter du concret à tes distracteurs** — du concret **faux** : un type de la bibliothèque
standard employé pour la mauvaise chose, un attribut de propriété appliqué au mauvais endroit, un
comportement d'ARC inventé.

### (5) L'INCISE ENTRE PARENTHÈSES — 69,7 %, rendement **95,2 %**, 42 questions

`node tools/plan-rangs-qcm.js swift --incise` donne les questions concernées. Formulation exacte,
apprise sur `java` : **autant d'incises que la bonne réponse** — et non « pas la seule à en
porter » (cette formulation molle laissait l'indice à 39,9 %).

⚠️ **« Au moins un distracteur porte la marque » NE SUFFIT PAS** — plafond trouvé sur `data-eng` :
il reste **50 %** à qui **RESTREINT** son tirage aux options marquées.

### (6) LE MOT TECHNIQUE EXCLUSIF — 77,9 %, rendement 90,4 %

La bonne réponse ne doit pas être la seule à employer un mot long que personne d'autre n'emploie.
⚠️ **Ne le ferme pas à fond** : sur `git`, l'écraser a fait passer l'inverse à 28,5 %. Vise
l'égalité, pas l'inversion.

### (7) LES MARQUES À NE PAS OUVRIR

- **virgule décimale** (`4,5`) : à **0** aujourd'hui sur ce cours. Elle rend 55,4 % sur le site et
  **100 % sur `crypto`** : **ne l'ouvre pas.**
- **flèche** (`→`, `->`) : à **0** aujourd'hui. ⚠️ En Swift, `->` est du code (le type de retour
  d'une fonction). Si une option en porte, les quatre en portent.
- **nom d'outil ou de bibliothèque** (`Xcode`, `SwiftUI`, `Combine`, `CocoaPods`) : sur `dataviz`,
  **0 bonne réponse sur 68** en portait, contre 17 distracteurs — la règle « écarter l'option qui
  nomme un outil » n'avait **jamais tort**. Vérifie-le sur ton lot, et applique les quatre ou aucune.

### (8) L'INDICE LEXICAL — **26 questions EXPLOITABLES sur 66** (STRICTE 39,4 % / rendement 19,2 %)

Un apprenant qui cherche au clavier (Ctrl+F) **les mots de chaque option dans la page** réussit.
⚠️ Sur ce cours la variante **INVERSE** est déjà à **75,7 % de rendement sur 56,1 % des questions** :
elle est plus forte que la directe. Écarter l'option la plus étrangère à la page marche déjà.

**RÈGLE DU `k`** : soit `k` le nombre de mots de **6 lettres et plus absents de la page** que porte
la bonne réponse (intouchable). **Les trois distracteurs en portent EXACTEMENT `k`.**
- `k = 0` → `0 / 0 / 0`
- `k > 0` → `k / k / k`

Ne mets **pas** les trois à zéro quand `k > 0` : ça retourne l'indice (**100 %** sur `mobile`). Et
`0 / 0 / k` laisse **exactement 50 %** à qui restreint son tirage aux deux options les plus
étrangères. **Seule l'égalité des quatre ferme les deux lectures.**

**RÈGLE DU `w`, et elle NE SE DÉDUIT PAS DU `k`.** Soit `w` le nombre de mots de 6 lettres et plus
de la bonne réponse : **ou les quatre options portent le même `w`, ou au moins un distracteur en
porte strictement plus.** C'est `w`, pas `k`, qui ferme la stratégie PROPORTION.

⚠️ **CONSTITUE LE DICTIONNAIRE DE LA PAGE AVANT DE RÉDIGER, pas après.** Un écrivain du 35ᵉ cours
a perdu un tour complet faute de l'avoir fait : premier jet propre en longueur, en marques et en
`w`, et **7 questions sur 10** violaient quand même la règle du `k`.

Outil : `node tools/mesure-lexique-qcm.js --liste=swift`. Cible : **0 exploitable ET 0 à mettre en
forme**.

### (9) Les indices mineurs à ne pas RECRÉER

« la plus prudente » 33,7 %, « la seule qui nie » 32,7 %, « l'attaque unique » 28,0 % : tous sont
déjà proches du hasard, ne les rouvre pas. **La densité (mots longs) est à 24,0 % et « la moins
bavarde » à 1,1 %** : ces deux-là sont le miroir de la longueur et se refermeront avec elle.

## Les cinq contraintes de non-régression

1. **La bonne réponse est intouchable** — `q`, `correct`, `explain` et son texte.
2. **La fenêtre de caractères** de `plan-rangs-qcm`, simulée avant d'écrire.
3. **Par marque : les quatre options, ou aucune.**
4. **`k / k / k / k`** sur les mots étrangers à la page, et le `w` fermé séparément.
5. **Le distracteur reste FAUX en Swift** — c'est la plus importante. Le coût mesuré sur `a11y`
   d'un distracteur devenu vrai est de **1,68 réécriture** (0,68 de rattrapage plus la correction
   elle-même).

## Vrai en Swift, donc jamais employable comme distracteur

Un optionnel n'est pas un pointeur nul et doit être déballé ; `struct` est un type valeur copié à
l'affectation, `class` un type référence ; `let` sur une `struct` en fige les champs, sur une
`class` seulement la référence ; les protocoles peuvent porter une implémentation par défaut via
une extension ; `guard` exige de sortir de la portée dans son `else` ; ARC compte les références et
`weak`/`unowned` cassent les cycles ; `weak` implique un optionnel, `unowned` non ; `Codable` est
l'union de `Encodable` et `Decodable` ; un `enum` peut porter des valeurs associées ; `async`/`await`
ne crée pas de fil d'exécution par lui-même ; `@State` appartient à la vue et `@Binding` la relie à
la source ; une `View` SwiftUI est une valeur recalculée, pas un objet muté ; `try?` transforme
l'erreur en optionnel et `try!` plante ; les chaînes s'indexent par `String.Index`, jamais par un
entier ; `map` sur un optionnel n'agit que s'il contient une valeur.

## Le contrôle d'après, à citer dans ton compte rendu

```
node tools/mesure-biais-qcm.js --seul=swift          # les 43 stratégies, sens direct
node tools/mesure-biais-inverse.js --toutes swift    # les 42, sens INVERSE (colonne GLOBAL)
node tools/mesure-lexique-qcm.js --liste=swift       # 0 exploitable ET 0 à mettre en forme
node tools/mesure-qcm-longueurs.js swift             # rangs, cible 17/17/16/16
node tools/mesure-qcm-intouchable.js swift <ref>     # 0 atteinte
```

**Cible : 25 % dans les DEUX sens, sur les 43 stratégies.**
