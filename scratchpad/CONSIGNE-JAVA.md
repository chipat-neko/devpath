# CONSIGNE D'ÉCRITURE — détordage du QCM du cours `java` (point B4, CHANTIER-V16)

Racine du projet : `D:\test-claude`. Tous les chemins ci-dessous en sont relatifs.

## Le problème que tu corriges

Sur les 77 questions du cours `java`, la bonne réponse est **la plus longue dans 73 cas
sur 77 (94,8 %)**. Un apprenant qui ne connaît rien à Java et clique systématiquement
l'option la plus longue a donc 94,8 % de bonnes réponses. Les distracteurs sont
squelettiques : ils descendent à **7 %** de la longueur de la bonne réponse.

Ta tâche : **réécrire les distracteurs** de ton lot pour que la longueur cesse d'être un
indice — sans jamais toucher au fond de la bonne réponse, et sans rendre un distracteur vrai.

## CE QUI EST STRICTEMENT INTOUCHABLE

Dans chaque objet de question tu ne modifies **QUE** le texte des options qui ne sont PAS
la bonne réponse. Sont interdits, et contrôlés après coup contre `git show HEAD:` par
`tools/mesure-qcm-intouchable.js` :

- le champ `q` (l'énoncé) — pas un caractère ;
- le champ `correct` (l'index de la bonne réponse) — l'ordre des options ne change pas ;
- le champ `explain` — pas un caractère ;
- le **texte de la bonne réponse** `a[correct]` — pas un caractère.

Tu ne touches à aucun autre endroit du fichier : ni au corps de la leçon, ni aux blocs
`data-exos`, ni au HTML. **Uniquement** les chaînes de distracteurs dans les blocs
`<script type="application/json" data-quiz…>`.

## Ton plan de travail, question par question

Ton lot est décrit dans `scratchpad/java-<TON_LOT>.json`. Chaque entrée donne :

- `fichier`, `question` (n° dans le bloc), `enonce`, `texteBon`, `longueurBonne` ;
- `rangCible` : le rang de longueur que la bonne réponse doit occuper APRÈS ta réécriture.
  `0` = la bonne réponse est la plus longue, `3` = la plus courte. **La cible du cours est
  une répartition plate : 20/19/19/19 sur les quatre rangs**, c'est pourquoi chaque question
  a son rang assigné. Respecte-le exactement ;
- pour chaque option : `cible` = la **fenêtre de longueur en caractères** `[min, max]` dans
  laquelle son texte réécrit doit tomber, et `sens` (ALLONGER / RACCOURCIR).

**Compte les caractères pour de vrai** (`String.length` en JS, accents compris — `é` compte
pour 1). Ne juge pas « à l'œil ». Une option hors de sa fenêtre est un travail à refaire.

## LES SIX PIÈGES, tous rencontrés sur les vingt cours déjà traités

1. **UN DISTRACTEUR ALLONGÉ DEVIENT VRAI.** C'est le piège n° 1 de cette phase : sur le cours
   `iac`, 13 distracteurs sur 135 étaient devenus partiellement vrais. En étoffant, on ajoute
   des précisions… exactes. Chaque option que tu écris doit rester **fausse en entier**, et
   fausse pour une raison qu'un débutant peut comprendre en lisant l'explication de la
   question. Attention en particulier à la première moitié d'une phrase : « X, donc Y » où X
   est vrai et Y faux se lit comme vrai.
2. **NE PAS INVERSER LE BIAIS.** Rendre la bonne réponse systématiquement la plus COURTE est
   la même faute. D'où les rangs cibles.
3. **NE PAS DÉPLACER LE BIAIS SUR LA PONCTUATION.** La bonne réponse ne doit pas être la
   seule à porter un **point-virgule**, un **deux-points**, une **incise entre parenthèses**,
   une **MAJUSCULE d'emphase** ou une virgule d'énumération. Le point-virgule seul vaut
   **93,5 % de rendement** sur le site, et sur `java` il tranche **32 questions sur 32**.
   Donc : si la bonne réponse d'une question porte un `;`, **mets-en un dans au moins un
   distracteur** de la même question ; idem pour le `:` et pour une incise `(…)`.
4. **NE PAS FABRIQUER UN TIC DE LOT.** Tu écris ~45 options d'affilée : si elles commencent
   toutes par le même mot, finissent toutes par un point, ou emploient toutes la même
   tournure (« ce qui… », « car… », « en réalité… »), tu crées un indice neuf, mesurable sur
   ton lot même s'il disparaît dans la moyenne du cours. **Varie les attaques, les fins, la
   présence ou l'absence du point final** — et regarde ce que font les bonnes réponses de ton
   lot pour t'aligner sur elles, pas pour t'en distinguer.
5. **PAS D'ABSOLUS NI DE PRUDENCE.** « toujours », « jamais », « aucun », « impossible »
   marquent un distracteur ; « en général », « la plupart du temps » marquent une bonne
   réponse. Distribue-les comme dans les bonnes réponses du lot.
6. **PAS D'ÉCHO DE L'ÉNONCÉ.** Ne recopie pas les mots rares de la question dans la seule
   bonne réponse ni dans un seul distracteur.

## VÉRIFIER PLUTÔT QUE CROIRE

⚠️ **Java n'est PAS installé sur cette machine** (`java` et `javac` : command not found).
Tu ne peux donc rien exécuter. **Conséquence directe : n'écris aucune affirmation dont tu
n'es pas certain.** Préfère un distracteur qui est faux pour une raison *conceptuelle*
énoncée dans la leçon elle-même (lis le corps de la leçon, il est au-dessus du bloc QCM)
plutôt qu'un distracteur qui prétend donner une sortie de programme, un numéro de version,
un nom de méthode exact ou un message d'erreur. **Si tu inventes un message d'erreur ou une
signature d'API, tu prends le risque qu'il existe vraiment.**

## FORMAT — le piège qui a fait 90 lignes de diff au lieu de 7

Les blocs JSON n'ont pas tous la même mise en forme. **N'utilise JAMAIS `JSON.parse` puis
`JSON.stringify` pour réécrire le bloc** : cela reformate tout le fichier. Remplace les
chaînes **en place**, par une substitution textuelle exacte sur la chaîne d'origine. Après
écriture, vérifie que le diff (`git diff --stat`) ne touche QUE les lignes des options que tu
devais changer.

Règles de fichier : encodage **UTF-8 sans BOM**, accents français corrects (jamais `e` pour
`é`), **fin de ligne LF** (le dépôt est en LF), guillemets JSON échappés correctement.

## TON PÉRIMÈTRE, et il est exclusif

Tu es **le seul** agent à écrire dans tes fichiers. N'ouvre en écriture **aucun** fichier
hors de ton lot. **Ne fais AUCUN commit git**, aucun `git add`, aucun `git stash` : le
coordinateur s'en charge. Tu peux lire tout ce que tu veux.

## CONTRÔLE AVANT DE RENDRE

1. `node -e "JSON.parse(...)"` sur chacun de tes blocs modifiés — le JSON doit rester valide ;
2. recompte les longueurs de tes options et vérifie qu'elles sont toutes dans leur fenêtre,
   et que le rang de la bonne réponse est bien le `rangCible` ;
3. `git diff --stat` sur tes fichiers : le nombre de lignes touchées doit être proche du
   nombre d'options réécrites.

Rends un compte rendu court : questions traitées, options réécrites, rangs obtenus, et la
liste des endroits où tu as hésité sur la véracité d'un distracteur.
