# La règle de L'INTRUS LEXICAL — à coller dans toutes les consignes d'écriture à partir du 39ᵉ cours

Trouvée le 2026-09-10 sur le cours `typescript` (38ᵉ), par la relecture adversariale.
Outil : `node tools/mesure-mot-question.js <cours> [--liste]`.

## Ce que c'est

Pour **une** question, un mot porté par **toutes les options sauf une** désigne cette option.
L'apprenant qui écarte les options qui partagent un mot que la quatrième n'a pas trouve la
bonne réponse **sans rien connaître au cours**.

Deux lectures, comme partout dans ce protocole :

- **PAR DÉFAUT** : trois options partagent un mot, la quatrième ne l'a pas → cocher la quatrième.
- **PAR EXCÈS** : une option porte un mot qu'aucune autre n'a → la cocher.

## Pourquoi aucun des 44 outils précédents ne le voyait

`tools/mesure-mot-fetiche.js`, écrit la veille après le cours `swift`, agrège **par mot sur le
cours entier** et n'alerte qu'au-delà de **deux** seuils : le mot doit trancher sur **≥ 8
questions** ET rendre **≥ 28 %**. Ces seuils sont justes pour ce qu'il mesure — et ils le rendent
aveugle au mot qui tranche **une seule** question, où il rend pourtant **100 %**.

Sur `typescript`, `mesure-mot-fetiche` rendait **« 0 alerte »** pendant que cinq relecteurs
adversariaux trouvaient, chacun de son côté, **sept** questions de ce type : « tuple »,
« produit », « deux », « patron », « (voir X) », « toute erreur », « typage ».

C'est la même famille de faute que « la colonne réussite NOIE les indices rares » (cours `doc`) :
un seuil conçu pour réduire le bruit finit par cacher le signal. La parade est la même —
**ne pas relever le seuil, CHANGER DE GRANULARITÉ.**

## L'ampleur, mesurée sur le site entier

| | |
|---|---:|
| Cours au-dessus de 28 % sur l'une des deux lectures | **34 sur 90** |
| Questions tranchées **à coup sûr** (une seule option désignée, et c'est la bonne) | **374** |
| dont par DÉFAUT | 304 |
| dont par EXCÈS | 70 |

## La règle d'écriture

C'est celle des marques, du `k` et du mot fétiche, appliquée **question par question** :

> **Par mot : les quatre options le portent, ou aucune.**

⚠️ **Quand c'est la BONNE réponse qui porte le mot — et elle est intouchable — on l'AJOUTE aux
distracteurs.** Le retirer d'eux laisserait la bonne réponse seule à le porter et retournerait
l'indice de la lecture DÉFAUT vers la lecture EXCÈS. C'est la règle du `k` transposée une
troisième fois.

⚠️ **Ne pas fermer à fond** : la leçon du cours `mobile` vaut ici aussi — fermer une lecture à
fond ouvre l'autre. Viser l'égalité des quatre, pas l'inversion. Contrôler **les deux colonnes**
de l'outil, pas une seule.

## Le piège de lecture de l'outil

La colonne **taux** peut être **sous l'étalon de 25 %** alors que des questions sont ouvertes à
100 %. Sur `typescript` après la vague d'écriture : taux DÉFAUT **24,1 %**, et pourtant **5
questions sûres**. **C'est la colonne « sûres » qui décide, pas le taux** — encore la leçon du
cours `react` : un indice de lot vaut 100 % sur le lot et 25 % sur le site.

## Ce que l'outil ne dit pas

Un mot-outil commun à trois options **par pur hasard** déclenche la même lecture qu'un mot
fabriqué par la vague d'écriture : la mesure ne distingue pas l'intention. D'où `--min=N`
(5 lettres par défaut) et `--liste`, qui sert à **juger** question par question.
