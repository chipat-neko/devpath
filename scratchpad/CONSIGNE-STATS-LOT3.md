# Lot 3 de `stats` — le dernier : `pages/stats/lecon-15.html`

LIS D'ABORD, EN ENTIER : `scratchpad/CONSIGNE-STATS.md`. Toutes ses règles s'appliquent.
Ce fichier ne fait qu'ajouter ce qui est propre au lot 3.

## Ce qui reste à faire

`pages/stats/lecon-15.html` porte DEUX blocs JSON :
- `<script type="application/json" data-quiz>` : 4 questions (le QCM de la leçon 15) ;
- `<script type="application/json" data-quiz-bilan="…">` : 12 questions (le QCM bilan du cours).

Ce sont les **16 dernières questions non traitées** du cours. Les 56 autres sont faites et
committées.

## ⚠️ TU N'ÉCRIS PAS DANS LE FICHIER

Un seul agent peut écrire dans `lecon-15.html` et ce n'est pas toi. Tu rends une **PROPOSITION
JSON** dans le fichier que ta mission te désigne, de cette forme exacte :

```json
{
  "quiz": {
    "0": ["distracteur pour opt1", "distracteur pour opt2", "distracteur pour opt3"],
    "1": [...]
  },
  "bilan": {
    "0": [...]
  }
}
```

Les clés sont les **index de question dans son bloc** (0-based). Les trois chaînes sont les
distracteurs, **dans l'ordre où ils apparaissent aujourd'hui dans le tableau `a`** (c'est-à-dire
en sautant l'option d'indice `correct`). Tu ne fournis QUE les questions de ta mission.
N'utilise pas d'espace insécable U+00A0.

## TU SIMULES AVANT DE RENDRE — c'est la partie qui compte

Écris un script Node jetable dans `scratchpad/` qui, pour chaque question de ta proposition :
1. reconstruit le tableau `a` complet (bonne réponse à sa place, tes trois distracteurs) ;
2. vérifie le **rang de longueur** de la bonne réponse contre le rang cible du plan
   (`node tools/plan-rangs-qcm.js stats`) ;
3. vérifie la **fourchette 70–130 %** et les fenêtres `[min..max]` du plan ;
4. compte les **`;`**, les **`(`/`)`** et les **`:`** : règle « les quatre options ou aucune » ;
5. compte les signes de ponctuation `, : ;` : la bonne réponse ne doit pas être **seule** en tête
   (`node tools/plan-rangs-qcm.js stats --ponctuation` donne son compte) ;
6. compte les **mots de 6 lettres et plus absents du texte de la page**, avec la règle du `k` :
   `k = 0` → `0 / 0 / 0` ; `k > 0` → `0 / 0 / k` **exactement**
   (`node tools/mesure-lexique-qcm.js --liste=stats` donne `k` et le visé de chaque question).
   ⚠️ **Ne mets pas tout le monde à zéro quand `k > 0`** : ça retourne l'indice.
Colle la sortie de ce script dans ton compte rendu. **Une proposition non simulée est refusée.**

## Le matériau

`stats` est CONCEPTUEL et CHIFFRÉ. Les confusions réelles qui font de bons distracteurs faux :
valeur p / probabilité que H0 soit vraie, intervalle de confiance / intervalle de prédiction,
écart-type / variance, moyenne / médiane / mode, population / échantillon, corrélation / causalité,
significativité statistique / importance pratique, erreur de type I / type II, R² / pente,
théorème central limite mal énoncé, biais de sélection / erreur aléatoire, percentile / moyenne,
paradoxe de Simpson, ÷n contre ÷(n−1), loi normale / loi de Student, unilatéral / bilatéral.

⚠️ **AUCUN CALCUL DE TÊTE.** Le cours cite des nombres (10,4 % contre 8,0 %, z ≈ 1,86,
p ≈ 0,063, intervalle allant de −0,3 à +5,1 points, moyenne 239 ms, médiane 107 ms…). Si un
distracteur cite un nombre, **fais tourner le calcul** (`node -e`) et cite le chiffre de la leçon
correctement, ou un chiffre faux dont tu sais qu'il est faux.

⚠️ Si le corps de `lecon-15.html` est faux quelque part, **signale-le dans ton compte rendu**,
preuve par calcul à l'appui. Ne le corrige pas toi-même.
