# Consigne d'écriture — détordre les QCM du cours `data-eng` (point B4 du CHANTIER-V16)

## Le problème, mesuré le 2026-09-06 sur les 70 questions du cours

| stratégie d'un apprenant qui ne comprend RIEN | réussite | rendement |
|---|---:|---:|
| la plus longue | **98,6 %** | 98,6 % |
| la plus détaillée (nb de `,` + `:` + `;`) | **84,9 %** | 98,1 % |
| l'incise entre parenthèses | **66,1 %** | **100,0 %** |
| le mot technique exclusif | **61,8 %** | 72,5 % |
| la seule avec un point-virgule | 44,3 % | **100,0 %** (18 questions tranchées) |
| la seule qui nie | 41,9 % | 55,9 % |
| l'écho de la question | 40,8 % | 57,1 % |
| la MAJUSCULE d'emphase | 34,6 % | **100,0 %** |
| la plus prudente | 30,0 % | 66,7 % |
| la seule avec un tiret | 27,1 % | **100,0 %** |
| hasard | 25,0 % | — |

Rangs de longueur aujourd'hui : **69 / 1 / 0 / 0** (0 = la bonne réponse est la plus longue).
Cible : **18 / 18 / 17 / 17**. 70 questions sur 70 sont à retoucher, 14 669 caractères à écrire.

## RÈGLES ABSOLUES — une infraction fait rejeter tout le lot

1. **INTOUCHABLE : `q`, `correct`, `explain` et le TEXTE DE LA BONNE RÉPONSE.** Un contrôle
   automatique (`tools/mesure-qcm-intouchable.js`) compare octet à octet avec `git show HEAD:`.
   Tu ne réécris QUE les distracteurs (les options dont l'indice ≠ `correct`).
2. **Un distracteur doit rester FAUX.** C'est la faute la plus grave et la plus fréquente :
   en allongeant, on ajoute une précision vraie et le distracteur devient une seconde bonne
   réponse. Chaque distracteur allongé doit rester réfutable par le corps de la leçon.
   Le bon matériau est une confusion réelle de l'ingénierie des données : ETL/ELT,
   batch/streaming, entrepôt/lac/lakehouse, schéma à la lecture / à l'écriture, idempotence
   mal comprise, partition/index, ligne/colonne (Parquet vs CSV), DAG vs boucle,
   « au moins une fois » / « exactement une fois », fenêtre de temps d'événement vs de
   traitement, normalisation vs étoile, orchestration vs ordonnancement, CDC vs export complet.
3. **Le JSON doit rester valide** : guillemets doubles échappés `\"`, antislash `\`, pas de
   saut de ligne littéral dans une chaîne. Vérifie avec `node -e` après écriture.
4. **Français correct, accents corrects** (jamais `a` pour `à`). Encodage **UTF-8 sans BOM**,
   fins de ligne **LF**. N'utilise PAS d'espace insécable U+00A0, ni `&nbsp;` dans un bloc
   `data-quiz` (il y serait lu littéralement).
5. **Aucun `git commit`, aucun `git add`.** Tu écris seulement dans les fichiers de ton lot.

## LES SEPT INDICES À FERMER, dans la même passe

Pour CHAQUE question, après réécriture :

- **(1) RANG DE LONGUEUR.** `node tools/plan-rangs-qcm.js data-eng` donne, question par question,
  le `rang cible` et une **fenêtre de longueur [min..max] par option**. Respecte-la : c'est elle
  qui produit la répartition plate 18/18/17/17. Le rang se compte en caractères de la chaîne.
- **(2) FOURCHETTE 70–130 %.** Chaque distracteur doit mesurer entre 70 % et 130 % de la
  longueur de la bonne réponse. (Exemption S3 : options de moins de 20 caractères d'un QCM
  bilan à réponse d'un mot.) Les fenêtres du plan intègrent déjà cette contrainte.
- **(3) POINT-VIRGULE.** Si la bonne réponse contient un `;`, **au moins un distracteur doit en
  contenir un aussi**. Rendement mesuré : **100 %** sur ce cours, sur 18 questions — c'est le
  correctif le moins cher du lot. Inversement, n'ajoute pas de `;` dans un distracteur quand la
  bonne réponse n'en a pas.
- **(4) INCISE ENTRE PARENTHÈSES.** Compte le **NOMBRE** de `(...)`, pas leur présence :
  **au moins un distracteur doit porter AUTANT d'incises que la bonne réponse.** La consigne
  « pas la seule à en porter » a été mesurée insuffisante sur le cours `java`.
  `node tools/plan-rangs-qcm.js data-eng --incise` donne le plan (39 questions concernées).
- **(5) DENSITÉ DE PONCTUATION (« la plus détaillée »).** La bonne réponse ne doit pas être la
  seule à porter le plus de `,` + `:` + `;`. Au moins un distracteur doit l'égaler.
  `node tools/plan-rangs-qcm.js data-eng --ponctuation` (53 questions concernées, 75,7 %).
- **(6) MOT TECHNIQUE EXCLUSIF.** Les termes de métier (`DAG`, `Parquet`, `idempotent`,
  `partition`, `bronze/silver/gold`, `checkpoint`, `backfill`…) ne doivent pas apparaître
  seulement dans la bonne réponse : un distracteur au moins doit employer du vocabulaire
  technique du même registre.
- **(7) ÉCHO DE LA QUESTION.** La bonne réponse ne doit pas être la seule à reprendre les mots
  de l'énoncé. Fais reprendre les mêmes termes par au moins un distracteur.

Quatre indices mineurs à ne pas RECRÉER en écrivant : pas de tiret « — » exclusif à la bonne
réponse, pas de MAJUSCULE d'emphase exclusive (rendement 100 % ici), n'accumule pas les absolus
(« toujours », « jamais », « aucun ») dans les seuls distracteurs, et **ne réserve pas la nuance
à la bonne réponse** (« souvent », « en général », « dans la plupart des cas »).
⚠️ Indice supplémentaire propre à ce cours : **« la seule qui nie »** couvre 48,6 % des questions
et rend 55,9 %. N'écris pas la négation uniquement dans la bonne réponse, et ne fais pas des
distracteurs des affirmations toutes positives quand la bonne réponse nie.

## Méthode

1. Lis tes leçons (corps + QCM) : un distracteur ne peut être écrit sans le contenu enseigné.
2. Récupère ton plan : `node tools/plan-rangs-qcm.js data-eng --json` puis filtre sur tes fichiers.
3. Réécris les distracteurs question par question. **SIMULE AVANT D'ÉCRIRE** : compte les
   caractères de ta proposition (`[...].length` en JS, accents comptés 1) et vérifie qu'elle
   tombe dans la fenêtre. La moitié des textes proposés sans simulation cassent la forme.
4. Après écriture, relance `node tools/plan-rangs-qcm.js data-eng` et vérifie que **tes** questions
   sont au rang cible, puis `node tools/mesure-qcm-longueurs.js data-eng` pour la fourchette.
5. Rends un compte rendu : questions traitées, distracteurs réécrits, rangs obtenus, et la
   liste de ce que tu n'as pas pu tenir avec la raison.

⚠️ Ce cours est **conceptuel et outillé** (SQL, Python, Airflow, Spark, dbt) : aucun de ces
outils n'est installé ici. N'affirme rien « de tête » sur une sortie de commande ou de requête :
si tu ne peux pas prouver un comportement par le corps de la leçon ou par la documentation,
n'écris pas de distracteur qui en dépend.

---

## ⚠️ AJOUT DU 2026-09-06, APRÈS LA PASSE — À REMETTRE EN CONSIGNE DÈS LE PREMIER LOT

**La règle « au moins un distracteur porte la même marque » a un PLAFOND de 50 %, pas de 25 %.**
Mesuré sur ce cours : après la vague d'écriture, « la seule avec un point-virgule » tombe bien à
0 % de couverture — mais un apprenant n'a pas besoin de l'unicité. Il lui suffit de **restreindre
son tirage aux options marquées** : si la marque est portée par la bonne réponse et par UN seul
distracteur, il tire à pile ou face.

| marque | rendement avant la vague | après « au moins un » | après « au moins deux » |
|---|---:|---:|---:|
| point-virgule | 97,4 % | **45,6 %** | 0 % (ne tranche plus) |
| parenthèse | 98,7 % | **48,7 %** | 0 % |
| deux-points | 83,8 % | **35,7 %** | 0 % |

Sur les 6 167 questions du site, la restriction à la parenthèse rend **49,1 %** — le deuxième
indice du site derrière la longueur. Les six cours déjà traités sont tous entre 34 et 51 %.

**LA RÈGLE, désormais** : quand la bonne réponse porte un `;`, une incise `(...)` ou un `:`,
la marque doit être portée par **DEUX distracteurs au moins**, idéalement les trois — ou par
aucun. Un invariant simple et sûr : *par marque, ou les quatre options la portent, ou aucune.*
Les trois stratégies sont dans `tools/mesure-biais-qcm.js` (« RESTREINDRE au … ») et dans
`scratchpad/mesure-paire.js`, qui donne la colonne rendement.

**Deuxième leçon de la passe : l'ÉCHO peut se retourner.** Sur `data-eng`, la vague a fait tomber
« l'écho de la question » de 40,8 % à **11,3 %** : les distracteurs reprennent maintenant les mots
de l'énoncé PLUS que la bonne réponse, et l'apprenant qui écarte l'option la plus écho obtient
**30,4 %** (plafond de l'inverse : 33,3 %). Ne fais pas reprendre les termes de l'énoncé par LES
TROIS distracteurs : un seul suffit à fermer l'indice direct.
