# CONSIGNE — 2ᵉ vague sur le QCM du cours `java` : fermer L'INCISE ENTRE PARENTHÈSES

Racine : `D:\test-claude`. Cette vague suit une première qui a déjà réécrit les
216 distracteurs du cours pour fermer le biais de LONGUEUR. **Ce travail-là est terminé et
il ne doit pas être défait.**

## Ce qui reste, et il est mesuré

Sur les 77 questions du cours, la bonne réponse est **celle qui porte le plus d'incises
entre parenthèses** dans 54 cas, et elle est **seule en tête 24 fois — dont 21 fois la
bonne réponse (87,5 %)**. Rendement global de la stratégie sur `java` : **65,7 %**, contre
25,0 % au hasard. C'est aujourd'hui le pire indice du cours.

La cause est mécanique et connue : la bonne réponse porte l'explication, donc c'est la seule
à glisser une précision entre parenthèses. Le remède est bon marché : **donner une incise à
un distracteur**, sans toucher au fond.

## Ta tâche

Ton plan est dans `scratchpad/java-<TON_LOT>.json`. Chaque entrée donne l'énoncé, la bonne
réponse (avec son nombre d'incises), et les trois distracteurs avec `incises`, `longueur` et
`fenetre` (les bornes de longueur à respecter).

Pour chaque question de ton lot : fais en sorte que **la bonne réponse ne soit plus seule à
porter le plus grand nombre d'incises**. Concrètement, porte au moins un distracteur au même
nombre d'incises que la bonne réponse (ou au-dessus).

Le geste type coûte deux caractères : `X car Y` → `X (car Y)`, `X, c'est-à-dire Y` →
`X (c'est-à-dire Y)`, `sans passer par Z` → `(sans passer par Z)`. **Tu réécris la forme, pas
le fond** : l'affirmation du distracteur doit rester exactement la même, et rester fausse.

## CE QUI EST INTOUCHABLE, et contrôlé après coup contre `git show HEAD:`

- le champ `q` (l'énoncé), le champ `correct`, le champ `explain` ;
- **le texte de la bonne réponse `a[correct]`** — pas un caractère, même pour lui retirer
  une parenthèse. On corrige par le bas, jamais en appauvrissant la bonne réponse ;
- tout le reste du fichier (corps de la leçon, `data-exos`, HTML).

## LES QUATRE CONTRAINTES QUI SE COMBINENT — c'est là qu'est la difficulté

1. **La LONGUEUR de chaque distracteur doit rester dans sa `fenetre`.** Elle vient de la
   première vague et elle tient le rang de longueur de la bonne réponse. Ajouter deux
   parenthèses fait +2 caractères : vérifie que tu ne sors pas de la borne haute. Si la
   fenêtre est saturée, compense en retirant deux caractères ailleurs dans la même option
   (une tournure plus courte), **jamais en changeant le rang**.
2. **Le RANG de longueur de la bonne réponse ne doit pas bouger.** C'est le résultat de la
   vague précédente : le cours est à 20/19/19/19 sur les quatre rangs, exactement le hasard.
3. **Ne pas déplacer le biais sur une autre ponctuation.** En ajoutant des parenthèses tu
   risques de créer le tic inverse (les distracteurs seuls à en porter). Vise l'équilibre,
   pas le renversement : il est bon qu'une question ait 2 ou 3 options avec incise. Surveille
   aussi le `;` et le `:`.
4. **Un distracteur retouché reste FAUX.** Une parenthèse qui ajoute une précision exacte
   peut rendre l'option défendable. Si tu ne peux pas ajouter une incise sans rendre l'option
   vraie, ajoute-la **à un autre distracteur de la même question**.

⚠️ **Java n'est PAS installé ici.** N'introduis dans tes parenthèses aucune sortie de
programme, aucun message d'erreur, aucun numéro de version, aucune signature d'API dont tu
n'es pas certain. Une incise purement reformulante (« car… », « sans… », « c'est-à-dire… »)
est toujours préférable à une incise qui affirme un fait neuf.

## FORMAT

**Ne repasse JAMAIS par `JSON.parse` + `JSON.stringify`** : cela reformate le bloc entier.
Remplace les chaînes en place par substitution textuelle exacte. UTF-8 sans BOM, LF, accents
français corrects. `git diff --stat` doit rester au niveau d'une ligne par question touchée.

## PÉRIMÈTRE

Tu es le seul agent à écrire dans tes fichiers. N'écris nulle part ailleurs. **Aucun commit,
aucun `git add`, aucun `git stash`.**

## CONTRÔLE AVANT DE RENDRE

1. JSON valide sur chaque bloc modifié ;
2. pour chaque question : `max(incises des distracteurs) >= incises de la bonne réponse` ;
3. longueurs toujours dans leur `fenetre`, et rang de la bonne réponse inchangé ;
4. `git diff --stat` sur tes seuls fichiers.

Compte rendu court et chiffré : questions traitées, incises ajoutées, longueurs avant/après,
rangs, et la liste des questions où tu as renoncé (avec la raison).
